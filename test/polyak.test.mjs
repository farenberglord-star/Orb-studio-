import test from "node:test"; import assert from "node:assert/strict"; import { readFileSync, existsSync } from "node:fs";
import { polyakSeries, polyakReport, POLYAK, POLYAK_SERIES } from "../src/polyak.js";
const now = Date.parse("2026-11-22T12:00:00Z"), step = 18e5;
const series = (vals) => vals.map((v, i) => ({ ts: now - (vals.length - 1 - i) * step, v }));
const noisy = (n, base, amp) => Array.from({ length: n }, (_, i) => base + ((i * 7) % 5 - 2) * amp);
test("Polyak sensor: calm, one-off jump and sustained shift are told apart", () => {
  assert.equal(polyakSeries(series(noisy(48, 50, 1)), now).verdict, "calm");
  const j = polyakSeries(series([...noisy(47, 50, 1), 80]), now); assert.equal(j.verdict, "jump"); assert.equal(j.direction, "up");
  const s = polyakSeries(series([...noisy(40, 50, 1), ...noisy(8, 30, 1)]), now); assert.equal(s.verdict, "shift"); assert.equal(s.direction, "down"); assert.ok(s.inertia_per_6h < 0, "heavy-ball inertia points down");
  assert.equal(polyakSeries(series(noisy(8, 50, 1)), now).verdict, "unknown", "fewer than 12 readings: no verdict");
  assert.equal(polyakSeries([], now).last, null);
  const real = [25, 18, 19, 28, 23, 33, 28, 23, 29, 27, 25, 23, 14, 27, 15, 14, 14, 13, 19, 15, 29, 13, 14, 29, 27, 12, 12, 9, 8, 7, 8, 8, 8, 7, 8, 7, 8, 8, 8, 8, 9, 15, 8, 8, 8, 8, 7, 7]; // барометр согласия 21–22.11.2026: с ~20 опустился до ~8 и держится
  const rs = polyakSeries(series(real), now); assert.equal(rs.verdict, "shift"); assert.equal(rs.direction, "down");
});
test("Polyak sensor: report shape, honour, no crypto, pages and wiring", () => {
  const r = polyakReport({ now, series: {} }); assert.deepEqual(r.series.map((x) => x.id), POLYAK_SERIES); assert.ok(!POLYAK_SERIES.some((x) => /crypto|btc|price/.test(x)), "no market series: no look of a trading signal");
  assert.match(r.how_to_read, /no forecast/); assert.match(POLYAK.years, /1935–2023/); assert.match(POLYAK.note, /not connected/);
  for (const p of ["tools/polyak.html", "de/tools/polyak.html", "en/tools/polyak.html"]) { const u = new URL("../public/" + p, import.meta.url); assert.ok(existsSync(u), p); const h = readFileSync(u, "utf8");
    assert.ok(h.includes(POLYAK.wiki.ru)); assert.match(h, /fetch\("\/api\/v1\/polyak"/); assert.match(h, /class="pstrip"/); assert.equal((h.match(/rel="alternate" hreflang=/g) || []).length, 4); }
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"); assert.match(w, /p === "\/api\/v1\/polyak"/); assert.match(w, /name: "get_polyak"/); assert.match(w, /"tools\/mikrin", "tools\/polyak"/);
  const sm = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8"); for (const pre of ["", "/de", "/en"]) assert.ok(sm.includes("<loc>https://orbstudio.org" + pre + "/tools/polyak</loc>"));
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /\[Polyak sensor\]/);
});
import { polyakContributors } from "../src/polyak.js";
test("Polyak sensor: a shift names the headlines that moved the index, with links", () => {
  const res = { odd: /\b(bizarre|strange)\b/i, agree: /\bdeal\b/i, fight: /\bclash\b/i }, H = 3600e3;
  const rows = [
    { radar: "geo", source: "A", headline: "Bizarre storm surprises town", first_ts: now - H, last_ts: now - 600e3 },
    { radar: "ai", source: "B", headline: "Strange robot goes viral", first_ts: now - 10 * H, last_ts: now - 600e3 },
    { radar: "geo", source: "C", headline: "Ordinary budget news", first_ts: now - H, last_ts: now - 600e3 },
  ];
  const norm = (x) => x.toLowerCase(), links = { "bizarre storm surprises town": "https://example.org/a" };
  const c = polyakContributors("hallucination", "shift", "up", rows, res, links, now, norm);
  assert.equal(c.items.length, 1, "only the headline that is new in the last 3 hours and odd-worded");
  assert.equal(c.items[0].link, "https://example.org/a"); assert.equal(c.items[0].change, "entered_last_3h");
  assert.equal(polyakContributors("hallucination", "calm", null, rows, res, links, now, norm), null, "calm: nothing to explain");
  assert.equal(polyakContributors("token_hunger", "shift", "up", rows, res, links, now, norm), null, "no words behind this index: no contributors");
  const gone = polyakContributors("hallucination", "shift", "down", [{ radar: "ai", source: "B", headline: "Strange old story", first_ts: now - 10 * H, last_ts: now - 2 * H }], res, {}, now, norm);
  assert.equal(gone.items[0].change, "left_last_3h");
});
import { askReport, askTokens } from "../src/ask.js";
test("ask entry: free question points to headlines and tools, no AI", () => {
  const radars = [{ id: "geo", feed: [[0, "Iran threatens Strait of Hormuz shipping", "Reuters", 0, "https://example.org/h"], [0, "Weather in Hamburg", "NDR", 0, "https://example.org/w"]] }];
  const tools = [{ name: "get_roads", title: "Roads", description: "jams" }, { name: "get_hormuz", title: "Hormuz chokepoint", description: "ship passages" }];
  const r = askReport("what about Hormuz", radars, tools);
  assert.equal(r.matched, true); assert.equal(r.headlines.length, 1); assert.equal(r.headlines[0].link, "https://example.org/h"); assert.deepEqual(r.tools_to_call_next, ["get_hormuz"]);
  assert.equal(askReport("Hormuzes", radars, tools).headlines.length, 1, "word beginning matches inflected forms");
  assert.equal(askReport("is", radars, tools).matched, false); assert.deepEqual(askTokens("what about the Hormuz Hormuz"), ["hormuz"]);
});
