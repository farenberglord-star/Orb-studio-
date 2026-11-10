import test from "node:test"; import assert from "node:assert/strict";
import { parseLhp } from "../src/lhp.js";
const legend = { items: [{ lhpClass: 6, lhpClassName: "Sehr großes Hochwasser", color: "#765e9c" }, { lhpClass: 5, lhpClassName: "Großes Hochwasser", color: "#e53935" }, { lhpClass: 4, lhpClassName: "Hochwasser", color: "#fb8c00" }, { lhpClass: 2, lhpClassName: "Vorwarnung", cssStyle: "x" }, { lhpClass: 1, lhpClassName: "Entwarnung", color: "#60bf41" }] };
const base = { type: "FeatureCollection", updated: "2026-11-10T20:03:47+01:00", sourceName: "Länderübergreifendes Hochwasserportal (LHP)", licenceName: "CC BY 4.0 - Namensnennung", legend };
test("empty list: no active warnings", () => {
  const r = parseLhp({ ...base, features: [] });
  assert.equal(r.ok, true); assert.equal(r.active_count, 0); assert.equal(r.highest_class, null); assert.deepEqual(r.by_class, {});
  assert.equal(r.stand, "2026-11-10T20:03:47+01:00"); assert.equal(r.legend.length, 5);
});
test("classes, missing class 3, missing color, hostile values", () => {
  const r = parseLhp({ ...base, features: [
    { type: "Feature", properties: { name: "Elbe / Dresden", lhpClass: 4, color: "#fb8c00", url: "https://www.hochwasserzentralen.de/x" } },
    { type: "Feature", properties: { title: "Mosel", lhpClass: "5" } },
    { type: "Feature", properties: { name: "Ohne Klasse", url: "javascript:alert(1)", big: "x".repeat(500), nested: { a: 1 } } },
  ] });
  assert.equal(r.active_count, 3); assert.equal(r.highest_class, 5); assert.equal(r.highest_class_name, "Großes Hochwasser");
  assert.deepEqual(r.by_class, { 4: 1, 5: 1 }); assert.equal(r.items[0].class_name, "Hochwasser");
  assert.equal(r.items[2].url, null); assert.deepEqual(r.items[2].properties, { name: "Ohne Klasse" }); assert.equal("color" in r.items[0].properties, false);
});
test("bad input", () => {
  assert.equal(parseLhp(null).ok, false); assert.equal(parseLhp({ type: "x" }).ok, false); assert.equal(parseLhp({ type: "FeatureCollection" }).ok, false);
});
