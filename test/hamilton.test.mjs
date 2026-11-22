import test from "node:test"; import assert from "node:assert/strict"; import { readFileSync, existsSync } from "node:fs";
import { hamiltonReport, HAMILTON, HAMILTON_ORDER } from "../src/hamilton.js";
const now = Date.parse("2026-11-22T12:00:00Z"), m = 60e3;
const base = { now, air: "de", healthTs: now - 10 * m, radarTs: now - 30 * m, regionTs: now - 60 * m,
  health: { checked_at: "x", problems: [], info: { voice_used: 20000, voice_limit: 90000, dj_links: 5, dj_voiced: 5 } },
  sens: { ts: now - 60 * m, stories: { de: { money: {}, world: {} } }, rejected: { de: { crypto: "unit_not_in_words: /s" } } } };
test("Hamilton sensor: components in priority order, what was set aside and why", () => {
  const r = hamiltonReport(base); assert.deepEqual(r.components.map((c) => c.id), HAMILTON_ORDER); assert.deepEqual(r.components.map((c) => c.priority), [1, 2, 3, 4, 5, 6, 7]);
  const s = r.components.find((c) => c.id === "sensor_news"); assert.equal(s.state, "degraded"); assert.deepEqual(s.dropped, ["crypto"]); assert.deepEqual(s.why, ["unit_not_in_words"]);
  assert.equal(r.status, "degraded"); assert.equal(r.components.find((c) => c.id === "voice").state, "full");
});
test("Hamilton sensor: voice limit, missing tracks, stale data and no measurement are told apart", () => {
  const r = hamiltonReport({ ...base, health: { checked_at: "x", problems: ["track_missing:orbit-city"], info: { voice_used: 85000, voice_limit: 90000, dj_links: 5, dj_voiced: 3 } }, radarTs: now - 7 * 60 * m, regionTs: null });
  const by = Object.fromEntries(r.components.map((c) => [c.id, c]));
  assert.equal(by.music.state, "degraded"); assert.deepEqual(by.music.dropped, ["orbit-city"]); assert.equal(by.voice.state, "degraded"); assert.deepEqual(by.voice.why, ["voice_budget_low"]);
  assert.equal(by.dj.state, "degraded"); assert.equal(by.radar_news.state, "stale"); assert.equal(by.regional.state, "unknown");
  assert.equal(hamiltonReport({ ...base, health: { info: { voice_used: 90000, voice_limit: 90000 } } }).components[1].state, "down");
  assert.equal(hamiltonReport({ now, air: "de" }).components[0].state, "unknown", "no data is never shown as working");
});
test("Hamilton sensor: honour, sources and pages in three languages, wired into the worker", () => {
  assert.match(HAMILTON.years, /1936–2026/); assert.match(HAMILTON.note, /not connected/); for (const l of ["ru", "de", "en"]) assert.match(HAMILTON.wiki[l], new RegExp("^https://" + l + "\\.wikipedia\\.org/wiki/"));
  for (const [p, wiki] of [["tools/hamilton.html", HAMILTON.wiki.ru], ["de/tools/hamilton.html", HAMILTON.wiki.de], ["en/tools/hamilton.html", HAMILTON.wiki.en]]) {
    const u = new URL("../public/" + p, import.meta.url); assert.ok(existsSync(u), p); const h = readFileSync(u, "utf8");
    assert.ok(h.includes(wiki), p + " links Wikipedia"); assert.match(h, /fetch\("\/api\/v1\/hamilton"/); assert.match(h, /Hamilton Technologies/); assert.ok(!/<img/.test(h), "no portrait"); }
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/hamilton"/); assert.match(w, /name: "get_hamilton"/); assert.match(w, /if \(name === "get_hamilton"\)/); assert.match(w, /"tools\/clips", "tools\/hamilton"/);
  for (const p of ["tools.html", "de/tools.html", "en/tools.html"]) assert.match(readFileSync(new URL("../public/" + p, import.meta.url), "utf8"), /<h3>get_hamilton<\/h3>/);
});
