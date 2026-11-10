import test from "node:test"; import assert from "node:assert/strict";
import { PARTIES, reduceDaily, rowFor, summarizeAttention, pageUrl, apiUrl, dayRange } from "../src/partyattention.js";
const items = (vals, start = Date.parse("2026-10-05")) => vals.map((v, i) => ({ timestamp: new Date(start + i * 864e5).toISOString().slice(0, 10).replace(/-/g, "") + "00", views: v }));
test("fixed list has no Sonstige and CDU/CSU as two articles", () => {
  const n = PARTIES.map((p) => p.party); assert.ok(n.includes("CDU") && n.includes("CSU")); assert.ok(!n.includes("Sonstige")); assert.equal(PARTIES.length, 9); assert.ok(n.includes("Freie Wähler"));
});
test("ratio, surge, week", () => {
  const base = Array(30).fill(1000);
  let r = rowFor(PARTIES[0], reduceDaily(items([...base, 2600])), null); assert.equal(r.ratio, 2.6); assert.equal(r.surge, true); assert.equal(r.views, 2600); assert.equal(r.week.length, 7);
  r = rowFor(PARTIES[0], reduceDaily(items([...base, 2400])), null); assert.equal(r.surge, false);
  r = rowFor(PARTIES[0], reduceDaily(items([...Array(30).fill(0), 5])), null); assert.equal(r.ratio, null); assert.equal(r.surge, false);
});
test("short or broken series are dropped; too few articles is explicit", () => {
  assert.equal(reduceDaily(items([1, 2, 3])), null); assert.equal(reduceDaily(null), null); assert.equal(reduceDaily([{ timestamp: "x", views: 1 }]), null);
  assert.equal(summarizeAttention([null, null]).ok, false);
  const rows = PARTIES.slice(0, 5).map((p) => rowFor(p, reduceDaily(items(Array(31).fill(10))), null));
  const s = summarizeAttention(rows); assert.equal(s.ok, true); assert.equal(s.missing.length, 4); assert.ok(!("leader" in s));
});
test("urls", () => {
  assert.equal(pageUrl("Bündnis_90/Die_Grünen"), "https://de.wikipedia.org/wiki/B%C3%BCndnis_90/Die_Gr%C3%BCnen");
  assert.match(apiUrl("Bündnis_90/Die_Grünen", "daily", "20261001", "20261009"), /B%C3%BCndnis_90%2FDie_Gr%C3%BCnen\/daily\/20261001\/20261009$/);
  assert.equal(dayRange(Date.parse("2026-11-10T08:00:00Z")).to, "20261109");
});
test("Freie Wähler article title and surge after a spike week", () => {
  const p = PARTIES.find((x) => x.party === "Freie Wähler"); assert.equal(p.title, "Freie_Wähler_(Partei)");
  assert.equal(pageUrl(p.title), "https://de.wikipedia.org/wiki/Freie_W%C3%A4hler_(Partei)");
  const v = [...Array(24).fill(120), 130, 8500, 19800, 5300, 900, 1000]; // spike days sit inside the 28-day baseline, the median stays low
  const r = rowFor(p, reduceDaily(items([...Array(4).fill(120), ...v])), null);
  assert.equal(r.views, 1000); assert.equal(r.usual, 120); assert.equal(r.surge, true);
});
