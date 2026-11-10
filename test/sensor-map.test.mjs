import test from "node:test"; import assert from "node:assert/strict"; import fs from "node:fs";
const man = JSON.parse(fs.readFileSync("public/data/sensor-map.json", "utf8")), geo = JSON.parse(fs.readFileSync("public/data/map-geo.json", "utf8"));
const worker = fs.readFileSync("src/worker.js", "utf8");
test("every sensor has real API route, MCP tool and 3 languages", () => {
  const ids = new Set();
  for (const s of man.sensors) {
    assert.ok(!ids.has(s.id), "dup " + s.id); ids.add(s.id);
    assert.ok(worker.includes('"' + s.api + '"'), "api not in worker: " + s.api);
    assert.ok(worker.includes('name: "' + s.mcp + '"'), "mcp tool not in worker: " + s.mcp);
    for (const l of ["ru", "de", "en"]) { assert.ok(s.name[l] && s.what[l], s.id + " " + l); }
    assert.ok(["place", "de", "world"].includes(s.scope));
    if (s.scope === "place") assert.ok(s.pins && s.pins.length, s.id + " needs pins");
    else assert.ok(!s.pins, s.id + " must not have invented pins");
    if (s.sub) assert.ok(worker.includes(s.sub + ":") || worker.includes('"' + s.sub + '"'), "sub key not in worker: " + s.sub);
    for (const p of s.wpins || []) { assert.ok(s.scope === "world", s.id + " wpins only for world"); assert.ok(Math.abs(p.lat) <= 90 && Math.abs(p.lon) <= 180 && p.label && p.kind === "source"); }
    for (const p of s.pins || []) { assert.ok(p.lat >= 45.3 && p.lat <= 55.9 && p.lon >= 4.6 && p.lon <= 18.6, s.id + " pin outside DACH inset"); assert.ok(["point", "area", "source"].includes(p.kind)); }
  }
});
test("embedded geography is present and small", () => {
  assert.ok(geo.world.rest.length > 5000 && geo.world.dach.DE.length > 100 && geo.world.dach.AT && geo.world.dach.CH);
  assert.ok(geo.inset.dach.DE.length > 500 && geo.inset.rest.length > 500 && geo.inset.cities.length >= 5);
  assert.ok(fs.statSync("public/data/map-geo.json").size < 150000);
  assert.ok(!/NaN|undefined/.test(JSON.stringify(geo)));
});
