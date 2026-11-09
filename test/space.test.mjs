import test from "node:test"; import assert from "node:assert/strict";
import { parseKp, parseScales, parseWind, parseFlares } from "../src/space.js";
test("kp both formats", () => {
  const a = parseKp([["time_tag","Kp","a_running","station_count"],["2026-11-09 06:00:00.000","2.33","9","8"],["2026-11-09 09:00:00.000","5.00","48","8"]]);
  assert.equal(a.kp, 5); assert.equal(a.storm, true); assert.equal(a.max_24h, 5);
  const b = parseKp([{ time_tag: "2026-11-09T09:00:00", Kp: 3.33 }]);
  assert.equal(b.kp, 3.33); assert.equal(b.storm, false);
  assert.equal(parseKp([]).ok, false); assert.equal(parseKp(null).ok, false);
});
test("scales", () => {
  const s = parseScales({ "-1": { G: { Scale: "1", Text: "minor" }, R: { Scale: "0", Text: "none" }, S: { Scale: "0", Text: "none" } }, "0": { DateStamp: "2026-11-09", TimeStamp: "12:00:00", G: { Scale: "0", Text: "none" }, R: { Scale: "1", Text: "minor" }, S: { Scale: "0", Text: "none" } }, "1": { G: { Scale: "3" } } });
  assert.equal(s.current.radio_blackout.scale, "R1"); assert.equal(s.past_24h_max.geomagnetic.scale, "G1"); assert.equal(JSON.stringify(s).includes("G3"), false);
  assert.equal(parseScales({}).ok, false);
});
test("wind", () => {
  const w = parseWind([["time_tag","density","speed","temperature"],["2026-11-09 11:00:00","5.1","410.2","90000"],["2026-11-09 11:01:00",null,null,null]]);
  assert.equal(w.speed_kms, 410.2); assert.equal(w.density_pcm3, 5.1);
  assert.equal(parseWind([["time_tag","density","speed","temperature"]]).ok, false);
});
test("flares", () => {
  const now = Date.parse("2026-11-09T12:00:00Z");
  const f = parseFlares([{ begin_time: "2026-11-09T05:00:00Z", max_time: "2026-11-09T05:20:00Z", max_class: "M2.1" }, { max_time: "2026-11-09T08:00:00Z", max_class: "C9.0" }, { max_time: "2026-11-07T08:00:00Z", max_class: "X1.0" }, { max_time: "2026-11-09T09:00:00Z", max_class: "M5.0" }], now);
  assert.equal(f.count_24h, 2); assert.equal(f.strongest, "M5.0");
  assert.equal(parseFlares({}).ok, false);
});

test("wind rtsw objects", () => {
  const w = parseWind([{ time_tag: "2026-11-09T11:58:00", proton_speed: 402.5, proton_density: 4.2, proton_temperature: 80000 }, { time_tag: "2026-11-09T11:59:00", proton_speed: null, proton_density: null }]);
  assert.equal(w.speed_kms, 402.5); assert.equal(w.density_pcm3, 4.2);
});
