import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { slotStart, newsBrief, cryptoBrief, assembleBrief, stampLine, stampHtml, datasetLd, briefMarkdown, sitemapFresh, llmsFull, ID_RE } from "../src/witness.js";

const NOW = Date.parse("2026-11-25T08:41:00Z");
const radars = [{ id: "geo", lvl: 40 }, { id: "crypto", lvl: 44 }];
const items = [
  { headline: "Minister says tariffs could rise next month", source: "Outlet A", radar: "geo", published_at: "2026-11-25T07:50:00Z", confirm: 1 },
  { headline: "Central bank cut rates by 0.25 points on Tuesday", source: "Outlet B", radar: "crypto", published_at: "2026-11-25T06:00:00Z", confirm: 4 },
];

test("slotStart rounds down to 30 minutes", () => {
  assert.equal(new Date(slotStart(NOW)).toISOString(), "2026-11-25T08:30:00.000Z");
});
test("newsBrief: radar mean, per-story passport, counts and honest checks list", () => {
  const b = newsBrief(items, radars, NOW);
  assert.equal(b.radar_mean_level, 42); assert.equal(b.items.length, 2);
  assert.ok(["high", "medium", "low"].includes(b.items[0].confidence));
  assert.equal(b.summary.stories, 2);
  assert.equal(b.summary.confidence.high + b.summary.confidence.medium + b.summary.confidence.low, 2);
  assert.ok(b.checks_applied.length > 0);
});
test("assembleBrief: id format, stable for the same content, changes with content", async () => {
  const d = newsBrief(items, radars, NOW);
  const a = await assembleBrief("news", d, NOW), a2 = await assembleBrief("news", d, NOW);
  assert.match(a.passport_id, ID_RE); assert.match(a.passport_id, /^orb-wit-20261125-0830-/);
  assert.equal(a.passport_id, a2.passport_id);
  const c = await assembleBrief("news", newsBrief(items.slice(0, 1), radars, NOW), NOW);
  assert.notEqual(a.passport_id, c.passport_id);
  assert.equal(a.witness_url, "https://orbstudio.org/api/v1/agents/witness/" + a.passport_id);
});
test("stamp: one plain line, link to the record within the first 200 characters, no pressure words", async () => {
  const b = await assembleBrief("news", newsBrief(items, radars, NOW), NOW);
  for (const lang of ["en", "ru", "de"]) {
    const t = stampLine(b, lang);
    assert.ok(t.startsWith("Orb Studio")); assert.ok(t.indexOf(b.passport_id) > -1 && t.indexOf(b.passport_id) + b.passport_id.length < 200, lang);
    assert.ok(!/verified|confirmed|trusted|cite|quote this|подтверждён|цитируй|verifiziert/i.test(t), lang + ": " + t);
    assert.ok(!/\n/.test(t));
  }
  assert.match(stampHtml(b, "en"), /id="orb-stamp"/);
});
test("datasetLd: standard schema.org Dataset, no custom orb: keys, parses as JSON", async () => {
  const b = await assembleBrief("news", newsBrief(items, radars, NOW), NOW);
  const m = datasetLd(b).match(/<script type="application\/ld\+json">(.*)<\/script>/s); assert.ok(m);
  const j = JSON.parse(m[1]); assert.equal(j["@type"], "Dataset"); assert.equal(j.isAccessibleForFree, true);
  assert.ok(!/"orb:/.test(m[1])); assert.ok(j.additionalProperty.some((p) => p.name === "passportId" && p.value === b.passport_id));
  assert.match(datasetLd({ ...b }, "https://x.test"), /https:\/\/x\.test\/api\/v1\/brief\?topic=news/);
});
test("cryptoBrief never carries a direction and survives missing data", async () => {
  const b = cryptoBrief({ regime: "calm", drivers: [], new_trade_size_pct_of_plan: 100, max_risk_per_trade_pct_of_capital: 1, order: "limit" }, { ecb: { eurusd: { value: 1.05, date: "2026-11-25" } } });
  assert.equal(b.regime, "calm"); assert.equal(b.ecb_eurusd.value, 1.05); assert.equal(b.ecb_deposit_rate_pct, null);
  assert.ok(!/buy|sell|long|short/i.test(JSON.stringify({ ...b, checks_applied: undefined })));
  const full = await assembleBrief("crypto", b, NOW); assert.match(briefMarkdown(full), /regime: calm/);
  assert.equal(cryptoBrief(null, null).regime, null);
});
test("sitemapFresh: hourly pages get the slot time, daily pages today, the rest stay", () => {
  const xml = `<urlset><url><loc>a</loc><lastmod>2026-11-20</lastmod><changefreq>hourly</changefreq></url><url><loc>b</loc><lastmod>2026-11-20</lastmod><changefreq>daily</changefreq></url><url><loc>c</loc><lastmod>2026-11-01</lastmod><changefreq>monthly</changefreq></url></urlset>`;
  const o = sitemapFresh(xml, NOW);
  assert.match(o, /<loc>a<\/loc><lastmod>2026-11-25T08:30:00Z<\/lastmod>/); assert.match(o, /<loc>b<\/loc><lastmod>2026-11-25<\/lastmod>/); assert.match(o, /<loc>c<\/loc><lastmod>2026-11-01<\/lastmod>/);
});
test("llmsFull keeps the base and adds verification and every tool", () => {
  const t = llmsFull("# Orb Studio\n", [{ name: "get_brief", description: "A  signed\nbrief" }]);
  assert.ok(t.startsWith("# Orb Studio")); assert.match(t, /agents\/witness\/<passport_id>/); assert.match(t, /- get_brief: A signed brief/);
});
test("worker registers brief, witness, get_brief, page stamps, sitemap and llms-full", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  for (const re of [/p === "\/api\/v1\/brief"/, /startsWith\("\/api\/v1\/agents\/witness\/"\)/, /name: "get_brief"/, /name === "get_brief"/, /url\.pathname === "\/sitemap\.xml"/, /url\.pathname === "\/llms-full\.txt"/, /studioKind === "studio" \|\| studioKind === "roundtable"/, /tool: "get_brief", url:/])
    assert.match(w, re);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /\(get_brief\)/);
  const ap = JSON.parse(readFileSync(new URL("../public/.well-known/ai-plugin.json", import.meta.url), "utf8"));
  assert.equal(ap.api.url, "https://orbstudio.org/openapi.json"); assert.equal(ap.auth.type, "none");
});

test("assembleBrief: same slot and content give the same id even at another second", async () => {
  const d = newsBrief(items, radars, NOW);
  const a = await assembleBrief("news", d, NOW), b = await assembleBrief("news", d, NOW + 7000);
  assert.equal(a.passport_id, b.passport_id);
});

import { indexNowPayload, INDEXNOW_KEY } from "../src/witness.js";
import { existsSync } from "node:fs";
test("IndexNow: only hourly/daily URLs of our host, key file exists and matches", () => {
  const xml = `<urlset><url><loc>https://orbstudio.org/live</loc><changefreq>hourly</changefreq></url><url><loc>https://orbstudio.org/de/live</loc><changefreq>daily</changefreq></url><url><loc>https://orbstudio.org/old</loc><changefreq>monthly</changefreq></url><url><loc>https://evil.test/x</loc><changefreq>daily</changefreq></url></urlset>`;
  const p = indexNowPayload(xml);
  assert.deepEqual(p.urlList, ["https://orbstudio.org/live", "https://orbstudio.org/de/live"]);
  assert.equal(p.keyLocation, `https://orbstudio.org/${INDEXNOW_KEY}.txt`);
  assert.match(INDEXNOW_KEY, /^[0-9a-f]{32}$/);
  const f = new URL(`../public/${INDEXNOW_KEY}.txt`, import.meta.url); assert.ok(existsSync(f));
  assert.equal(readFileSync(f, "utf8"), INDEXNOW_KEY);
  assert.match(readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"), /indexNowDaily\(env\)\.catch/);
});
test("task-first titles: sensor pages start with the question, then the name", () => {
  const h = readFileSync(new URL("../public/tools/hamilton.html", import.meta.url), "utf8");
  assert.match(h, /<title>Что работает и что отложено на сайте · Датчик Гамильтон · Orb Studio<\/title>/);
  const e = readFileSync(new URL("../public/en/tools/howard.html", import.meta.url), "utf8");
  assert.match(e, /<title>Retell a story now or wait for confirmation\? · Howard sensor · Orb Studio<\/title>/);
});
