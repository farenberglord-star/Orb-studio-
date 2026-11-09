import test from "node:test"; import assert from "node:assert/strict";
import { parseStations, levelChange } from "../src/hydro.js";
const feed = [
  { shortname: "HAMBURG ST. PAULI", longname: "HAMBURG ST. PAULI", water: { longname: "ELBE" }, timeseries: [{ shortname: "W", unit: "cm", currentMeasurement: { timestamp: "2026-11-09T13:20:00+01:00", value: 612, trend: 1, stateMnwMhw: "normal", stateNswHsw: "unknown" } }] },
  { shortname: "CUXHAVEN STEUBENHÖFT", water: { shortname: "ELBE" }, timeseries: [{ shortname: "W", currentMeasurement: { value: 540, trend: -1 } }, { shortname: "WT", currentMeasurement: { value: 11.2 } }] },
  { shortname: "WITTENBERGE", timeseries: [] }];
test("parse both stations", () => {
  const r = parseStations(feed);
  assert.equal(r.ok, true); assert.equal(r.stations.length, 2);
  assert.equal(r.stations[0].water_level_cm, 612); assert.equal(r.stations[0].trend, "RISING"); assert.equal(r.stations[0].level_state, "normal");
  assert.equal(r.stations[1].trend, "FALLING"); assert.equal(r.stations[1].water_temp_c, 11.2); assert.equal(r.stations[0].water_temp_c, null);
});
test("one station and failures", () => {
  assert.equal(parseStations(feed, "cuxhaven").stations.length, 1);
  assert.equal(parseStations(feed, "nope").ok, false);
  const r = parseStations([{ shortname: "HAMBURG ST. PAULI", timeseries: [] }], "st_pauli");
  assert.equal(r.ok, false); assert.equal(r.stations[0].ok, false);
  assert.equal(parseStations(null).ok, false);
});

test("observed change", () => {
  const h = [{ timestamp: "2026-11-09T13:00:00+01:00", value: 560 }, { timestamp: "2026-11-09T14:00:00+01:00", value: 601 }, { timestamp: "2026-11-09T13:30:00+01:00", value: 580 }];
  const c = levelChange(h);
  assert.equal(c.change_cm, 41); assert.equal(c.window_min, 60); assert.equal(c.direction, "UP");
  assert.equal(levelChange([h[0]]), null); assert.equal(levelChange(null), null);
  assert.equal(levelChange([h[0], { timestamp: "2026-11-09T13:10:00+01:00", value: 561 }]), null);
  const r = parseStations([{ shortname: "HAMBURG ST. PAULI", timeseries: [{ shortname: "W", currentMeasurement: { value: 601 }, history: h }] }], "st_pauli");
  assert.equal(r.stations[0].observed_change.direction, "UP");
});
