import test from "node:test"; import assert from "node:assert/strict"; import fs from "node:fs";
import { H2_API, H2_MIN_GAP_MS, H2_STATUS_TTL_MS, STALE_MIN, H2_SOURCE, isHamburg, stationPoint, parseStations, buildStation, parseStatus, overall, newestSignal } from "../src/h2stations.js";

const NOW = Date.parse("2026-11-23T15:00:00Z");
const HH = { hrs_id: "AAAAA", name: "Station Hamburg Ost", address: { street_address: "Musterweg 1", postal_code: "22113", city: "Hamburg", country: "DE" }, geolocation: { latitude: 53.53, longitude: 10.1 },
  fuel_types: [{ fuelling_option: "700car" }, { fuelling_option: "350bus" }] };
const MUC = { hrs_id: "BBBBB", name: "Muenchen", address: { city: "München" }, geolocation: { latitude: 48.1, longitude: 11.6 } };
const NOADDR = { hrs_id: "CCCCC", name: "Ohne Adresse", geolocation: { latitude: 53.6, longitude: 9.95 } };
const NEAR = { hrs_id: "DDDDD", name: "Buxtehude", address: { city: "Buxtehude" }, geolocation: { latitude: 53.47, longitude: 9.69 } };

test("API base is v2 only, with a floor of one minute between requests", () => {
  assert.equal(H2_API, "https://api.h2-stations.eu/v2");
  assert.ok(H2_MIN_GAP_MS >= 60e3 && H2_STATUS_TTL_MS >= 60e3);
  assert.ok(!/\/v1/.test(fs.readFileSync("src/h2stations.js", "utf8").replace(/\/\/.*$/gm, "")), "no v1 path in code");
});
test("Hamburg filter: by city or by box, not München, not Buxtehude", () => {
  assert.ok(isHamburg(HH)); assert.ok(isHamburg(NOADDR)); assert.ok(!isHamburg(MUC)); assert.ok(!isHamburg(NEAR));
  const r = parseStations([HH, MUC, NOADDR, NEAR, null, {}]);
  assert.deepEqual(r.stations.map((x) => x.hrs_id), ["AAAAA", "CCCCC"]);
  assert.equal(r.stations[0].lat, 53.53); assert.deepEqual(r.stations[0].fuel_options, ["700car", "350bus"]);
  assert.equal(parseStations("x").ok, false);
  assert.equal(stationPoint({ geolocation: { latitude: "abc", longitude: 1 } }), null);
});
test("entrance coordinates are used for the pin when the source gives them", () => {
  assert.deepEqual(stationPoint({ geolocation: { latitude: 53.5, longitude: 10 }, entrance_geolocation: { latitude: 53.51, longitude: 10.01 } }), { lat: 53.51, lon: 10.01 });
});
const ST = { hrs_id: "AAAAA",
  availability: { datetime: "2026-11-23T14:58:00Z", received_datetime: "2026-11-23T14:58:05Z", station: { maintenance: false, limitedly_available: false }, nozzles: [{ id: "n1", available: true }, { id: "n2", available: false }] },
  usage: { datetime: "2026-11-23T14:58:00Z", nozzles: [{ id: "n1", usage_status: "free" }, { id: "n2", usage_status: "in-use" }] },
  pricing: { datetime: "2026-11-23T14:00:00Z", products: [{ id: "p1", gross_price: "13.90", net_price: null, currency: "EUR" }] },
  fuel_types: { datetime: "2026-11-23T14:59:00Z", entries: [{ id: "700ld", status: "available", reason: null }, { id: "350hd", status: "unavailable", reason: "in-maintenance" }] },
  events: { ongoing: [{ id: "e1", start_datetime: "2026-11-23T08:00:00Z", end_datetime: null, subject: "Wartung", message: "Heute eingeschränkt", expected_availability_status: "limitedly-available" }] } };
test("a fresh station: summary, per-fuel statuses unchanged, nozzles, price, events", () => {
  const stn = parseStations([HH]).stations[0], r = buildStation(stn, ST, NOW);
  assert.equal(r.live, true); assert.equal(r.status, "available");
  assert.deepEqual(r.by_fuel, [{ id: "700ld", status: "available", reason: null }, { id: "350hd", status: "unavailable", reason: "in-maintenance" }]);
  assert.deepEqual(r.nozzles, { total: 2, available: 1 }); assert.equal(r.nozzles_free_now, 1);
  assert.deepEqual(r.prices, [{ id: "p1", gross_price_per_kg: "13.90", net_price_per_kg: null, currency: "EUR" }]);
  assert.equal(r.events_ongoing.length, 1); assert.equal(r.events_ongoing[0].expected_availability_status, "limitedly-available");
  assert.equal(r.signal_age_min, 2);
});
test("old signal (measurement time, not receipt time) is stale: no status, no numbers", () => {
  const old = { ...ST, availability: { ...ST.availability, datetime: "2026-11-23T14:00:00Z", received_datetime: "2026-11-23T14:59:00Z" } };
  const r = buildStation(parseStations([HH]).stations[0], old, NOW);
  assert.equal(r.live, false); assert.equal(r.stale, true); assert.equal(r.status, "unknown"); assert.deepEqual(r.by_fuel, []); assert.equal(r.nozzles, null);
  assert.ok(STALE_MIN <= 30);
});
test("null sections and unknown-only statuses mean no signal; nothing is invented", () => {
  const stn = parseStations([HH]).stations[0];
  const none = buildStation(stn, { hrs_id: "AAAAA", availability: null, usage: null, pricing: null, fuel_types: null, events: { ongoing: [] } }, NOW);
  assert.equal(none.live, false); assert.equal(none.no_signal, true); assert.equal(none.status, "unknown"); assert.equal(none.nozzles, null); assert.equal(none.maintenance, null);
  const unk = buildStation(stn, { ...ST, fuel_types: { entries: [{ id: "700ld", status: "unknown", reason: "no-signal" }] } }, NOW);
  assert.equal(unk.live, false); assert.equal(unk.status, "unknown");
  assert.equal(buildStation(stn, undefined, NOW).live, false);
});
test("junk values are dropped, text is cleaned and cut", () => {
  const stn = parseStations([HH]).stations[0];
  const r = buildStation(stn, { ...ST, fuel_types: { entries: [{ id: "700ld", status: "bogus" }, { id: "350ld", status: "closed", reason: "weird" }] },
    events: { ongoing: [{ subject: "a\u0000b" + "x".repeat(400), message: "m", expected_availability_status: "nope" }] } }, NOW);
  assert.deepEqual(r.by_fuel, [{ id: "350ld", status: "closed", reason: null }]);
  assert.equal(r.status, "closed"); assert.ok(r.events_ongoing[0].subject.length <= 160 && !/\u0000/.test(r.events_ongoing[0].subject)); assert.equal(r.events_ongoing[0].expected_availability_status, null);
});
test("overall summary order: available > limited > unavailable > closed > unknown", () => {
  const e = (...s) => s.map((status) => ({ status }));
  assert.equal(overall(e("unavailable", "available")), "available"); assert.equal(overall(e("unavailable", "limitedly-available")), "limitedly-available");
  assert.equal(overall(e("closed", "unavailable")), "unavailable"); assert.equal(overall(e("closed", "unknown")), "closed"); assert.equal(overall([]), "unknown");
});
test("parseStatus matches by hrs_id, keeps stations missing from the answer as unknown, newestSignal", () => {
  const stns = parseStations([HH, NOADDR]).stations;
  const r = parseStatus({ datetime: "2026-11-23T15:00:00Z", stations: [ST, { hrs_id: "ZZZZZ" }] }, stns, NOW);
  assert.equal(r.ok, true); assert.equal(r.items.length, 2); assert.equal(r.items[0].live, true); assert.equal(r.items[1].live, false); assert.equal(r.items[1].reason, "no-status-entry");
  assert.equal(newestSignal(r.items), "2026-11-23T14:58:00.000Z"); assert.equal(newestSignal([]), null);
  assert.equal(parseStatus({}, stns, NOW).ok, false);
});
test("attribution and licence are present", () => {
  assert.equal(H2_SOURCE.attribution, "Clean Hydrogen Joint Undertaking, 2026."); assert.equal(H2_SOURCE.license, "CC BY 4.0");
});

// ---- Worker wiring: the secret stays a secret ----
const worker = fs.readFileSync("src/worker.js", "utf8");
const i0 = worker.indexOf("// ================= Водородные заправки Гамбурга"), i1 = worker.indexOf("// ================= Австрия: живые станции TAWES");
const block = worker.slice(i0, i1);
test("token is read only from env.H2_STATIONS_TOKEN, only in the Authorization header", () => {
  assert.ok(i0 > 0 && i1 > i0);
  const uses = block.replace(/^\s*\/\/.*$/gm, "").match(/H2_STATIONS_TOKEN/g) || [];
  assert.equal(uses.length, 2, "one guard + one header");
  assert.ok(/Authorization: "Bearer " \+ env\.H2_STATIONS_TOKEN/.test(block));
  assert.ok(!/console\./.test(block), "no logging in the H2 block");
  assert.ok(!/H2_STATIONS_TOKEN/.test(fs.readFileSync("wrangler.toml", "utf8").replace(/^#.*$/gm, "")), "token must not be a [vars] entry");
  assert.ok(!/H2_STATIONS_TOKEN/.test(fs.readFileSync("src/h2stations.js", "utf8").replace(/\/\/.*$/gm, "")), "parsing module never sees the token");
});
test("errors never carry the original message, redirects are refused, only /v2 paths are called", () => {
  assert.ok(/redirect: "error"/.test(block));
  assert.ok(/catch \(e\) \{ throw new Error\("network"\); \}/.test(block));
  assert.ok(!/api\.h2-stations\.eu\/v1/.test(block));
  const paths = [...block.matchAll(/h2Fetch\(env, [`"]([^`"?$]+)/g)].map((m) => m[1]);
  assert.deepEqual(paths.sort(), ["/hrs", "/hrs/status"]);
});
test("Worker answers without the token configured: unavailable, no crash, nothing leaked", async () => {
  const src = worker.slice(worker.indexOf("async function h2Claim"), i1);
  const mod = new Function("H2_API", "H2_PAGE", "H2_STATUS_TTL_MS", "H2_MIN_GAP_MS", "H2_LIST_TTL_MS", "H2_SOURCE", "H2_STALE_MIN", "h2ParseStations", "h2ParseStatus", "h2Newest", "sharedGet", "sharedPut", "ensureShared", src + "\nreturn { h2Data };");
  const calls = [];
  const m = mod(H2_API, 500, H2_STATUS_TTL_MS, H2_MIN_GAP_MS, 864e5, H2_SOURCE, 30, parseStations, parseStatus, newestSignal, async () => null, async () => {}, async () => {});
  const r = await m.h2Data({});
  assert.equal(r.status, "unavailable"); assert.equal(r.http, 503); assert.deepEqual(r.items, []);
  assert.ok(!/Bearer/.test(JSON.stringify(r)));
  void calls;
});
test("end to end with a fake D1 and a fake source: one request per minute window, token only in the header, not in the answer", async () => {
  const SECRET = "TEST-SECRET-TOKEN-VALUE";
  const store = new Map(), claim = { ts: 0 };
  const DB = { prepare: (sql) => ({ bind: (...a) => ({ run: async () => {
    if (/INSERT INTO shared .*'h2-claim'/.test(sql)) { const [now, floor] = a; if (claim.ts < floor) { claim.ts = now; return { meta: { changes: 1 } }; } return { meta: { changes: 0 } }; }
    if (/UPDATE shared SET ts/.test(sql)) { claim.ts = a[0]; return { meta: { changes: 1 } }; }
    return { meta: { changes: 0 } }; } }) }) };
  const src = worker.slice(worker.indexOf("async function h2Claim"), i1);
  const seen = []; let n = 0;
  const fakeFetch = async (url, opt) => {
    seen.push({ url, auth: opt.headers.Authorization, redirect: opt.redirect });
    if (url.includes("/hrs/status")) return new Response(JSON.stringify({ datetime: new Date().toISOString(), stations: [{ ...ST, availability: { ...ST.availability, datetime: new Date(Date.now() - 60e3).toISOString() } }, { hrs_id: "OTHER" }] }), { status: 200 });
    n++; return new Response(JSON.stringify({ count: 3, next: null, previous: null, results: [HH, MUC, NOADDR] }), { status: 200 });
  };
  const sharedGet = async (env, k, maxAge) => { const v = store.get(k); return v ? JSON.parse(v) : null; };
  const sharedPut = async (env, k, v) => { store.set(k, JSON.stringify(v)); };
  const mod = new Function("fetch", "AbortSignal", "H2_API", "H2_PAGE", "H2_STATUS_TTL_MS", "H2_MIN_GAP_MS", "H2_LIST_TTL_MS", "H2_SOURCE", "H2_STALE_MIN", "h2ParseStations", "h2ParseStatus", "h2Newest", "sharedGet", "sharedPut", "ensureShared", src + "\nreturn { h2Data };");
  const m = mod(fakeFetch, AbortSignal, H2_API, 500, H2_STATUS_TTL_MS, H2_MIN_GAP_MS, 864e5, H2_SOURCE, 30, parseStations, parseStatus, newestSignal, sharedGet, sharedPut, async () => {});
  const env = { DB, H2_STATIONS_TOKEN: SECRET };
  const a = await m.h2Data(env);
  assert.equal(a.status, "ok"); assert.equal(a.stations_count, 2); assert.equal(a.live_count, 1);
  assert.ok(seen.length === 2 && seen.every((x) => x.url.startsWith("https://api.h2-stations.eu/v2/") && x.auth === "Bearer " + SECRET && x.redirect === "error"));
  assert.ok(!JSON.stringify(a).includes(SECRET));
  // right after: served from the shared cache, no new request
  const b = await m.h2Data(env); assert.equal(b.status, "cached"); assert.equal(seen.length, 2);
  // cache older than the TTL but the claim window still closed: no request, last copy served
  const k = JSON.parse(store.get("h2-status-v1")); k.fetched_ms -= 10 * 60e3; store.set("h2-status-v1", JSON.stringify(k));
  const c = await m.h2Data(env); assert.equal(seen.length, 2); assert.ok(["cached", "degraded"].includes(c.status));
  // claim window open again: exactly one more status request (the station list is cached for a day)
  claim.ts = Date.now() - 61e3;
  const d = await m.h2Data(env); assert.equal(d.status, "ok"); assert.equal(seen.length, 3); assert.equal(n, 1);
  assert.ok(!JSON.stringify(d).includes(SECRET));
});
test("401/429 from the source: degraded answer from the last copy, error text has only the status code", async () => {
  const SECRET = "TEST-SECRET-TOKEN-VALUE-2";
  const store = new Map(), claim = { ts: 0 };
  const DB = { prepare: (sql) => ({ bind: (...a) => ({ run: async () => {
    if (/INSERT INTO shared .*'h2-claim'/.test(sql)) { const [now, floor] = a; if (claim.ts < floor) { claim.ts = now; return { meta: { changes: 1 } }; } return { meta: { changes: 0 } }; }
    if (/UPDATE shared SET ts/.test(sql)) { claim.ts = a[0]; return { meta: { changes: 1 } }; }
    return { meta: { changes: 0 } }; } }) }) };
  const src = worker.slice(worker.indexOf("async function h2Claim"), i1);
  let mode = "ok";
  const fakeFetch = async (url) => {
    if (mode === "429") return new Response("slow down " + SECRET, { status: 429, headers: { "Retry-After": "120" } });
    if (mode === "401") return new Response("bad token " + SECRET, { status: 401 });
    if (url.includes("/hrs/status")) return new Response(JSON.stringify({ datetime: "2026-11-23T15:00:00Z", stations: [ST] }), { status: 200 });
    return new Response(JSON.stringify({ results: [HH], next: null }), { status: 200 });
  };
  const sharedGet = async (env, k) => { const v = store.get(k); return v ? JSON.parse(v) : null; };
  const sharedPut = async (env, k, v) => { store.set(k, JSON.stringify(v)); };
  const mod = new Function("fetch", "AbortSignal", "H2_API", "H2_PAGE", "H2_STATUS_TTL_MS", "H2_MIN_GAP_MS", "H2_LIST_TTL_MS", "H2_SOURCE", "H2_STALE_MIN", "h2ParseStations", "h2ParseStatus", "h2Newest", "sharedGet", "sharedPut", "ensureShared", src + "\nreturn { h2Data };");
  const m = mod(fakeFetch, AbortSignal, H2_API, 500, H2_STATUS_TTL_MS, H2_MIN_GAP_MS, 864e5, H2_SOURCE, 30, parseStations, parseStatus, newestSignal, sharedGet, sharedPut, async () => {});
  const env = { DB, H2_STATIONS_TOKEN: SECRET };
  assert.equal((await m.h2Data(env)).status, "ok");
  const age = () => { const k = JSON.parse(store.get("h2-status-v1")); k.fetched_ms -= 10 * 60e3; store.set("h2-status-v1", JSON.stringify(k)); };
  age(); claim.ts = 0; mode = "401";
  const a = await m.h2Data(env); assert.equal(a.status, "degraded"); assert.equal(a.error, "http 401"); assert.ok(!JSON.stringify(a).includes(SECRET)); assert.equal(a.items.length, 1);
  claim.ts = 0; mode = "429";
  const b = await m.h2Data(env); assert.equal(b.status, "degraded"); assert.equal(b.error, "http 429"); assert.ok(!JSON.stringify(b).includes(SECRET));
  assert.ok(claim.ts > Date.now() - 1000, "after 429 the next request waits for Retry-After");
});
