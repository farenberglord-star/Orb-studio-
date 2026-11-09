import test from "node:test"; import assert from "node:assert/strict";
import { reduceFeed, summarize, unitFactor, parsePointParams, haversineKm, HAMBURG } from "../src/radiation.js";
const F = (id, name, lon, lat, value, o = {}) => ({ type: "Feature", geometry: { type: "Point", coordinates: [lon, lat] }, properties: { id, name, plz: "20095", site_status: 1, value, unit: "µSv/h", end_measure: "2026-11-09T18:00:00Z", validated: 1, ...o } });
const feed = { type: "FeatureCollection", features: [
  F("DEZ0001", "Hamburg", 10.0, 53.55, 0.081), F("DEZ0002", "Cuxhaven", 8.7, 53.87, 0.065), F("DEZ0003", "Munich", 11.57, 48.14, 0.121, { end_measure: "2026-11-09T17:00:00Z", validated: 2 }),
  F("DEZ0004", "Broken", 9, 52, 0.4, { site_status: 2 }), F("DEZ0005", "NoValue", 9, 52, null), F("DEZ0006", "Nano", 9.5, 53.0, 70, { unit: "nSv/h" }), F("DEZ0007", "WeirdUnit", 9, 51, 5, { unit: "cpm" }),
] };
test("reduce converts units and drops unknown units", () => {
  const r = reduceFeed(feed);
  assert.equal(r.length, 7); assert.equal(r[5].v, 0.07); assert.equal(r[6].v, null); assert.equal(r[4].v, null);
  assert.equal(reduceFeed(null), null); assert.equal(reduceFeed({}), null);
  assert.equal(unitFactor("µSv/h"), 1); assert.equal(unitFactor("uSv/h"), 1); assert.equal(unitFactor("x"), null); assert.equal(unitFactor(undefined), 1);
});
test("summary counts only stations in operation with a reading", () => {
  const s = summarize(reduceFeed(feed), HAMBURG);
  assert.equal(s.ok, true);
  assert.equal(s.stations.in_feed, 7); assert.equal(s.stations.in_operation_with_reading, 4);
  assert.equal(s.germany.min.station, "Cuxhaven"); assert.equal(s.germany.max.station, "Munich");
  assert.equal(s.germany.median, 0.0755); // 0.065, 0.07, 0.081, 0.121 -> (0.07+0.081)/2
  assert.equal(s.stations.share_validated, 75);
  assert.equal(s.latest_measurement_at, "2026-11-09T18:00:00.000Z");
});
test("nearest stations sorted by distance, validated flag", () => {
  const s = summarize(reduceFeed(feed), HAMBURG, 2);
  assert.equal(s.nearest.length, 2); assert.equal(s.nearest[0].station, "Hamburg"); assert.ok(s.nearest[0].distance_km < 5);
  const m = summarize(reduceFeed(feed), { lat: 48.1, lon: 11.6 }, 1);
  assert.equal(m.nearest[0].station, "Munich"); assert.equal(m.nearest[0].validated, false);
});
test("failures are explicit, not zeros", () => {
  assert.equal(summarize([], HAMBURG).ok, false); assert.equal(summarize(null, HAMBURG).ok, false);
  const r = summarize(reduceFeed({ features: [F("a", "x", 9, 53, 0.1, { site_status: 2 })] }), HAMBURG);
  assert.equal(r.ok, false); assert.match(r.reason, /no station in operation/);
});
test("point params", () => {
  assert.equal(parsePointParams(null, null).default, true);
  assert.deepEqual(parsePointParams("53.5", "10").point, { lat: 53.5, lon: 10 });
  assert.ok(parsePointParams("10", "10").error); assert.ok(parsePointParams("abc", "10").error); assert.ok(parsePointParams("53", null).error);
  assert.ok(Math.abs(haversineKm({ lat: 53.55, lon: 9.99 }, { lat: 48.14, lon: 11.57 }) - 612) < 15);
});
