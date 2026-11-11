import test from "node:test"; import assert from "node:assert/strict";
import { parseTawes, STATIONS, TAWES_URL, STALE_MIN } from "../src/weather_at.js";
const feat = (id, p) => ({ type: "Feature", geometry: { type: "Point", coordinates: [0, 0] }, properties: { station: id, parameters: Object.fromEntries(Object.entries(p).map(([k, v]) => [k, { name: k, unit: "x", data: [v] }])) } });
const FULL = { TL: 5.0, RR: 0.0, FF: 2.7, DD: 129.0, FFX: 5.3, P: 984.9, PRED: 1010.3, RF: 82.0, SO: 0.0, SCHNEE: 0.0 };
const NOW = Date.parse("2026-11-11T09:11:00Z");
const doc = (features, ts = "2026-11-11T09:00+00:00") => ({ type: "FeatureCollection", timestamps: [ts], features });
test("url asks for the documented parameters and all stations as geojson", () => {
  assert.match(TAWES_URL, /parameters=TL,RR,FF,DD,FFX,P,PRED,RF,SO,SCHNEE/); assert.match(TAWES_URL, /output_format=geojson/); for (const s of STATIONS) assert.ok(TAWES_URL.includes(s.id));
});
test("normal answer: values pass through unchanged, time is the slot in UTC", () => {
  const r = parseTawes(doc([feat("11035", FULL)]), NOW), w = r.stations.find((s) => s.station === "11035");
  assert.equal(r.ok, true); assert.equal(r.observed_at, "2026-11-11T09:00:00.000Z"); assert.equal(r.age_min, 11); assert.equal(r.stale, false);
  assert.equal(w.temp_c, 5.0); assert.equal(w.precip_10min_mm, 0); assert.equal(w.wind_ms, 2.7); assert.equal(w.pressure_msl_hpa, 1010.3); assert.equal(w.live, true);
});
test("null stays null (not zero); zero stays zero", () => {
  const w = parseTawes(doc([feat("11343", { ...FULL, TL: -2.9, RR: null, SCHNEE: 33.0 })]), NOW).stations.find((s) => s.station === "11343");
  assert.equal(w.precip_10min_mm, null); assert.equal(w.snow_cm, 33); assert.equal(w.live, true);
  const z = parseTawes(doc([feat("11035", { ...FULL, SCHNEE: null, SO: 0 })]), NOW).stations.find((s) => s.station === "11035");
  assert.equal(z.snow_cm, null); assert.equal(z.sunshine_s_10min, 0);
});
test("requested station missing from features (HTTP 200 silent gap) -> live false, no numbers", () => {
  const r = parseTawes(doc([feat("11035", FULL)]), NOW), g = r.stations.find((s) => s.station === "11240");
  assert.equal(g.live, false); assert.equal(g.temp_c, null); assert.equal(r.live_count, 1); assert.equal(r.stations.length, STATIONS.length);
});
test("station without a temperature reading is not live", () => {
  assert.equal(parseTawes(doc([feat("11035", { ...FULL, TL: null })]), NOW).stations[0].live, false);
});
test("stale slot (older than the limit) -> nothing live, numbers withheld", () => {
  const r = parseTawes(doc([feat("11035", FULL)], "2026-11-11T07:00+00:00"), NOW);
  assert.equal(r.ok, true); assert.equal(r.stale, true); assert.ok(r.age_min > STALE_MIN); assert.equal(r.live_count, 0); assert.equal(r.stations[0].temp_c, null);
});
test("empty or broken answer, error bodies and junk values", () => {
  for (const j of [null, {}, { features: [] }, { detail: "Parameters {'X'} do not exist or access is denied" }, { features: "x", timestamps: ["2026-11-11T09:00+00:00"] }, { features: [], timestamps: [] }, "x"]) assert.equal(parseTawes(j, NOW).ok, false);
  const r = parseTawes(doc([feat("11035", { ...FULL, TL: "5.0", FF: NaN })]), NOW); assert.equal(r.stations[0].temp_c, null); assert.equal(r.stations[0].live, false);
});
import { readFileSync } from "node:fs";
test("real GeoSphere answer (11.11.2026 10:00 CET): 11 stations live, Graz 11290 was never requested, Sonnblick RR null", () => {
  const j = JSON.parse(readFileSync(new URL("./fixtures/tawes-sample2.json", import.meta.url), "utf8")), r = parseTawes(j, Date.parse("2026-11-11T09:11:01Z"));
  assert.equal(r.ok, true); assert.equal(r.observed_at, "2026-11-11T09:00:00.000Z"); assert.equal(r.live_count, 11);
  const by = Object.fromEntries(r.stations.map((s) => [s.station, s]));
  assert.equal(by["11035"].temp_c, 5.0); assert.equal(by["11035"].pressure_msl_hpa, 1010.3); assert.equal(by["11343"].precip_10min_mm, null); assert.equal(by["11343"].snow_cm, 33); assert.equal(by["11060"].snow_cm, null);
  assert.equal(by["11240"].live, false);
});
