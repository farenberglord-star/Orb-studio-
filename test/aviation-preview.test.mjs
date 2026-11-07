import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  BBOX_ONE_CREDIT_MAX_DEG2,
  CANONICAL_SITE_URL,
  CLAIMS_NOT_MADE,
  FUTURE_SHARE_TEMPLATE,
  MAX_STALE_AGE_SECONDS,
  PREVIEW_SHARE_TEXT,
  boundingBox,
  boxAreaDeg2,
  countObservedAirborne,
  destination,
  hamburgSector,
  haversineKm,
  previewContract,
  projectAviation,
  quotaArithmetic,
  sectorLines,
  statesAllCreditCost,
  xComposeIntent,
} from "../preview/aviation/proposal.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

function vector(lat, lon, sourceTime, patch = {}) {
  const timePosition = Object.hasOwn(patch, "time_position") ? patch.time_position : sourceTime;
  const onGround = Object.hasOwn(patch, "on_ground") ? patch.on_ground : false;
  return [
    "abc123", "TEST", "Nowhere",
    timePosition, sourceTime,
    patch.longitude === undefined ? lon : patch.longitude,
    patch.latitude === undefined ? lat : patch.latitude,
    1000, onGround, 200, 0, 0, null, 1000, null, false, 0, 0,
  ];
}

test("Hamburg box contains the circle, stays inside one OpenSky credit, and corners fall outside", () => {
  const sector = hamburgSector();
  assert.equal(sector.lat, 53.6304);
  assert.equal(sector.lon, 9.9882);
  assert.equal(sector.radiusKm, 100);
  assert.ok(sector.areaDeg2 < BBOX_ONE_CREDIT_MAX_DEG2);
  assert.ok(sector.areaDeg2 > 1);
  assert.equal(sector.statesAllCredits, 1);
  assert.equal(statesAllCreditCost(25), 1);
  assert.equal(statesAllCreditCost(25.01), 2);
  assert.equal(statesAllCreditCost(100), 2);
  assert.equal(statesAllCreditCost(400), 3);
  assert.equal(statesAllCreditCost(400.01), 4);
  const north = destination(sector.lat, sector.lon, 100, 0);
  assert.ok(haversineKm(sector.lat, sector.lon, north.lat, north.lon) <= 100.001);
  assert.equal(
    countObservedAirborne({ time: 1_700_000_000, states: [vector(north.lat, north.lon, 1_700_000_000)] }).observed_airborne_count,
    1,
  );
  assert.ok(haversineKm(sector.lat, sector.lon, sector.box.lamax, sector.box.lomax) > 100);
  const outside = destination(sector.lat, sector.lon, 101, 0);
  assert.equal(
    countObservedAirborne({ time: 1_700_000_000, states: [vector(outside.lat, outside.lon, 1_700_000_000)] }).observed_airborne_count,
    0,
  );
});

test("airborne count keeps only fresh on-ground-false coordinates and never emits identifiers", () => {
  const sector = hamburgSector();
  const t = 1_700_000_000;
  const inside = destination(sector.lat, sector.lon, 20, 90);
  const corner = { lat: sector.box.lamax, lon: sector.box.lomax };
  const response = {
    time: t,
    states: [
      vector(inside.lat, inside.lon, t),
      vector(inside.lat, inside.lon, t, { on_ground: true }),
      vector(inside.lat, inside.lon, t, { on_ground: null }),
      vector(inside.lat, inside.lon, t, { latitude: null }),
      vector(inside.lat, inside.lon, t, { longitude: null }),
      vector(inside.lat, inside.lon, t, { time_position: t - 61 }),
      vector(inside.lat, inside.lon, t, { time_position: null }),
      vector(corner.lat, corner.lon, t),
    ],
  };
  const counted = countObservedAirborne(response);
  assert.equal(counted.ok, true);
  assert.equal(counted.observed_airborne_count, 1);
  assert.equal(JSON.stringify(counted).includes("abc123"), false);
  assert.equal(JSON.stringify(counted).includes("TEST"), false);
});

test("a missing payload is null, an empty state list is a real zero", () => {
  const missing = countObservedAirborne({ time: 10, states: null });
  assert.equal(missing.ok, false);
  assert.equal(missing.observed_airborne_count, null);
  const absent = countObservedAirborne(null);
  assert.equal(absent.observed_airborne_count, null);
  const empty = countObservedAirborne({ time: 10, states: [] });
  assert.equal(empty.ok, true);
  assert.equal(empty.observed_airborne_count, 0);
});

test("readers do not publish a count without a license, and stale snapshots expire to 503", () => {
  const nowMs = 1_700_000_000_000;
  const leaked = projectAviation({
    nowMs,
    licenseApproved: false,
    connected: true,
    snapshot: { observed_airborne_count: 12, source_time: nowMs / 1000, fetched_at: new Date(nowMs).toISOString() },
  });
  assert.equal(leaked.http_status, 503);
  assert.equal(leaked.observed_airborne_count, null);
  assert.equal(leaked.reason, "license_not_approved");
  assert.equal(leaked.upstream_called, false);
  assert.equal(leaked.music_reads_aviation, false);
  assert.equal(leaked.emo_reads_aviation, false);

  const fresh = projectAviation({
    nowMs,
    licenseApproved: true,
    connected: true,
    snapshot: { observed_airborne_count: 4, source_time: nowMs / 1000 - 100, fetched_at: new Date(nowMs - 100000).toISOString() },
  });
  assert.equal(fresh.http_status, 200);
  assert.equal(fresh.freshness, "fresh");
  assert.equal(fresh.observed_airborne_count, 4);
  assert.equal(fresh.data_age_seconds, 100);

  const zero = projectAviation({
    nowMs,
    licenseApproved: true,
    connected: true,
    snapshot: { observed_airborne_count: 0, source_time: nowMs / 1000 - 30, fetched_at: new Date(nowMs).toISOString() },
  });
  assert.equal(zero.http_status, 200);
  assert.equal(zero.observed_airborne_count, 0);

  const stale = projectAviation({
    nowMs,
    licenseApproved: true,
    connected: true,
    snapshot: { observed_airborne_count: 4, source_time: nowMs / 1000 - 500, fetched_at: new Date(nowMs - 500000).toISOString() },
  });
  assert.equal(stale.http_status, 200);
  assert.equal(stale.freshness, "stale");
  assert.equal(stale.stale, true);
  assert.equal(stale.observed_airborne_count, 4);

  const expired = projectAviation({
    nowMs,
    licenseApproved: true,
    connected: true,
    snapshot: { observed_airborne_count: 4, source_time: nowMs / 1000 - (MAX_STALE_AGE_SECONDS + 1), fetched_at: new Date(nowMs).toISOString() },
  });
  assert.equal(expired.http_status, 503);
  assert.equal(expired.freshness, "unusable");
  assert.equal(expired.observed_airborne_count, null);
  assert.equal(expired.data_age_seconds, MAX_STALE_AGE_SECONDS + 1);
  assert.equal(expired.reason, "maximum_stale_age_exceeded");

  const none = projectAviation({ nowMs, licenseApproved: true, connected: true, snapshot: null });
  assert.equal(none.http_status, 503);
  assert.equal(none.observed_airborne_count, null);
  assert.equal(none.reason, "no_usable_snapshot");
});

test("quota arithmetic stays labeled as not permitted", () => {
  const quota = quotaArithmetic();
  assert.equal(quota.permitted, false);
  assert.equal(quota.theoretical_calls_per_day_at_that_cadence, 288);
  assert.equal(quota.anonymous_global_calls_per_day_max, 100);
  assert.equal(quota.standard_user_credits_per_day, 4000);
  assert.equal(quota.anonymous_credits_per_day, 400);
});

test("X compose intent is an editable draft URL and the preview text is not an observation", () => {
  const href = xComposeIntent(PREVIEW_SHARE_TEXT);
  const url = new URL(href);
  assert.equal(url.origin + url.pathname, "https://x.com/intent/post");
  assert.equal(url.searchParams.get("text"), PREVIEW_SHARE_TEXT);
  assert.equal(url.searchParams.get("url"), CANONICAL_SITE_URL);
  assert.match(PREVIEW_SHARE_TEXT, /не подключён/);
  assert.doesNotMatch(PREVIEW_SHARE_TEXT, /\d/);
  assert.match(FUTURE_SHARE_TEMPLATE, /\{observed_airborne_count\}/);
  assert.match(FUTURE_SHARE_TEMPLATE, /\{data_age_seconds\}/);
  assert.match(FUTURE_SHARE_TEMPLATE, /покрытие/i);
  assert.ok(CLAIMS_NOT_MADE.includes("airspace_closures"));
  assert.ok(CLAIMS_NOT_MADE.includes("flight_delays"));
});

test("proposal module has no network client", () => {
  const source = read("preview/aviation/proposal.mjs");
  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /XMLHttpRequest|WebSocket|child_process|net\.request|http\.request/);
  assert.doesNotMatch(source, /https?:\/\/opensky-network\.org\/api/);
  assert.doesNotMatch(source, /https?:\/\/auth\.opensky/);
  assert.doesNotMatch(source, /flightradar24|adsbexchange/i);
});

test("preview page states the demonstration and does not invent a live count", () => {
  const html = read("preview/aviation/index.html");
  const contract = previewContract();
  const lines = sectorLines();
  assert.match(html, /DEMONSTRATION/);
  assert.match(html, /ПРЕВЬЮ НЕ ПОДКЛЮЧЕНО/);
  assert.match(html, new RegExp(`data-field="observed_airborne_count">null<`));
  assert.match(html, /data-field="freshness">not_connected</);
  assert.match(html, /data-field="data_age_seconds">null</);
  assert.match(html, /data-field="fetched_at">null</);
  assert.match(html, /data-field="last_success_at">null</);
  assert.match(html, /data-field="source_time">null</);
  assert.match(html, /data-field="http_status">503</);
  assert.match(html, /blocked_written_agreement_required/);
  assert.match(html, new RegExp(lines.lamin));
  assert.match(html, new RegExp(lines.lamax));
  assert.match(html, new RegExp(lines.lomin));
  assert.match(html, new RegExp(lines.lomax));
  assert.match(html, new RegExp(lines.areaDeg2));
  assert.match(html, /53\.6304/);
  assert.match(html, /9\.9882/);
  assert.equal(contract.observed_airborne_count, null);
  assert.match(html, /id="share-text"[^>]*>\s*Превью Orb Studio: авиационный раздел не подключён/);
  assert.match(html, /https:\/\/x\.com\/intent\/post/);
  assert.match(html, /https:\/\/orbstudio\.org\//);
  assert.match(html, /data-synthetic="scenario"/);
  assert.match(html, /СИНТЕТИЧЕСКИЙ СЦЕНАРИЙ/);
  assert.match(html, /Наблюдаемые борты в воздухе с валидной свежей координатой: \{observed_airborne_count\}\./);
  assert.doesNotMatch(html, /opensky-network\.org\/api/);
  assert.doesNotMatch(html, /https?:\/\/[^\s"'<>]*(flightradar24|adsbexchange|adsb\.lol)/i);
  assert.doesNotMatch(html, /\bfetch\s*\(/);
  assert.doesNotMatch(html, /api\.x\.com|api\.twitter\.com|oauth_token|client_secret|authorization:\s*bearer/i);
  assert.doesNotMatch(html, /<script[^>]+src=/);
  assert.equal(boxAreaDeg2(boundingBox(53.6304, 9.9882, 100)), hamburgSector().areaDeg2);
});

test("runtime, payment, violin and EMO files are not part of the preview", () => {
  const worker = read("src/worker.js");
  const wrangler = read("wrangler.toml");
  assert.equal(worker.includes("get_aviation_sensors"), false);
  assert.equal(worker.includes("/api/v1/aviation"), false);
  assert.equal(worker.toLowerCase().includes("opensky"), false);
  assert.equal(wrangler.includes("aviation"), false);
  assert.equal(fs.existsSync(path.join(root, "public/aviation.html")), false);
});

test("handoff and architecture name the license blocker and the untouched surfaces", () => {
  const handoff = read("preview/aviation/HANDOFF-RU.md");
  const architecture = read("preview/aviation/ARCHITECTURE.md");
  for (const doc of [handoff, architecture]) {
    assert.match(doc, /https:\/\/opensky-network\.org\/about\/terms-of-use/);
    assert.match(doc, /https:\/\/openskynetwork\.github\.io\/opensky-api\/rest\.html/);
    assert.match(doc, /письменн/i);
    assert.match(doc, /не вызывать/i);
    assert.match(doc, /503/);
    assert.match(doc, /null/);
    assert.match(doc, /get_aviation_sensors/);
    assert.match(doc, /x402|violin|EMO/i);
  }
  assert.match(handoff, /Claude/);
  assert.match(architecture, /sensors-v8/);
  assert.match(architecture, /roads-hh-v1/);
  assert.match(architecture, /OurAirports/);
});
