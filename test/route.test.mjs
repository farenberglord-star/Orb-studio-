import test from "node:test"; import assert from "node:assert/strict";
import { parsePoint, distToLine, incidentsNear, summarizeRoute } from "../src/route.js";
test("parsePoint", () => {
  assert.deepEqual(parsePoint("53.5511, 9.9937"), { lat: 53.5511, lon: 9.9937 });
  assert.equal(parsePoint("abc"), null);
  assert.equal(parsePoint("48.1,11.5").outside, true);
});
test("distToLine", () => {
  const line = [{ lat: 53.5, lon: 9.9 }, { lat: 53.5, lon: 10.0 }];
  assert.ok(distToLine({ lat: 53.5, lon: 9.95 }, line) < 1);
  const d = distToLine({ lat: 53.509, lon: 9.95 }, line);
  assert.ok(d > 950 && d < 1050, String(d));
});
test("incidentsNear and summary", () => {
  const roads = { jams: [{ kind: "jam", road: "A7", title: "A7", lat: 53.5005, lon: 9.95, delay_min: 12 }, { kind: "jam", road: "A1", title: "far", lat: 53.7, lon: 10.2 }], closures: [], roadworks: [] };
  const osrm = { routes: [{ distance: 7000, duration: 600, geometry: { coordinates: [[9.9, 53.5], [10.0, 53.5]] }, legs: [{ steps: [{ name: "Elbe", distance: 500 }, { name: "Elbe", distance: 400 }, { name: "x", distance: 20 }] }] }] };
  const s = summarizeRoute(osrm, "car", roads);
  assert.equal(s.distance_m, 7000); assert.equal(s.duration_min, 10);
  assert.deepEqual(s.main_streets, ["Elbe"]);
  assert.equal(s.motorway_reports_near_route.length, 1);
  assert.equal(summarizeRoute(osrm, "foot", roads).motorway_check.startsWith("not applicable"), true);
  assert.equal(summarizeRoute({ routes: [] }, "car", roads), null);
  assert.equal(incidentsNear([{ lat: 1, lon: 1 }, { lat: 1, lon: 1.001 }], roads).length, 0);
});

import { resolvePlace, parsePlaceOrPoint } from "../src/route.js";
test("places", () => {
  assert.equal(resolvePlace("Flughafen").lat, 53.6304);
  assert.equal(resolvePlace("Lübeck").place.startsWith("Lübeck"), true);
  assert.equal(resolvePlace("nowhere"), null);
  assert.equal(parsePlaceOrPoint("53.55,9.99").lat, 53.55);
  assert.equal(parsePlaceOrPoint("Hbf").lon, 10.0067);
});
