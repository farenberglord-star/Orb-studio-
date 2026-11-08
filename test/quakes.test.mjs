import test from "node:test";
import assert from "node:assert/strict";
import { parseFeatures, summarizeQuakes } from "../src/quakes.js";

const F = (mag, place, t, depth, extra = {}) => ({ properties: { mag, place, time: t, type: "earthquake", tsunami: 0, url: "https://earthquake.usgs.gov/earthquakes/eventpage/x", ...extra }, geometry: { coordinates: [10.123, 50.456, depth] } });
const day = { metadata: { generated: 1794096181000 }, features: [F(4.6, "A", 1794090000000, 10), F(6.1, "B", 1794080000000, 35.04), F(5.2, "C", 1794085000000, 12), F(4.8, "quarry", 1794086000000, 1, { type: "quarry blast" }), F(null, "bad", 1794086000000, 1)] };

test("parse: sorted by magnitude, non-earthquakes and broken rows dropped, coords rounded", () => {
  const p = parseFeatures(day);
  assert.deepEqual(p.map((q) => q.mag), [6.1, 5.2, 4.6]);
  assert.equal(p[0].depth_km, 35);
  assert.equal(p[0].lat, 50.46);
  assert.equal(p[0].tsunami_flag, false);
});
test("summary: counts, strongest, empty week stays zero (no invented events)", () => {
  const s = summarizeQuakes(day, { features: [] }, new Date("2026-11-08T12:00:00Z"));
  assert.equal(s.last_24h_m45.count, 3);
  assert.equal(s.last_24h_m45.strongest.mag, 6.1);
  assert.equal(s.last_24h_m45.m60_or_more, 1);
  assert.equal(s.significant_week.count, 0);
  assert.equal(s.feed_generated, "2026-11-08T00:03:01.000Z");
});
test("summary of empty/garbage feeds is zeros and nulls", () => {
  const s = summarizeQuakes(null, undefined);
  assert.equal(s.last_24h_m45.count, 0);
  assert.equal(s.last_24h_m45.strongest, null);
  assert.equal(s.feed_generated, null);
});
test("foreign urls are not passed through", () => {
  const p = parseFeatures({ features: [F(5, "X", 1794090000000, 1, { url: "https://evil.example/x" })] });
  assert.equal(p[0].url, null);
});
