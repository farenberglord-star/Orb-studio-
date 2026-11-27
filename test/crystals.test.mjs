import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CRYSTALS, CRYSTAL_ZONES, crystalsReport } from "../src/crystals.js";
import { SCIENTISTS } from "../src/scientists.js";

test("every crystal: name, years, Wikipedia link, zone, ideas in three languages, a rule", () => {
  assert.ok(CRYSTALS.length >= 80);
  const ids = new Set();
  for (const c of CRYSTALS) {
    assert.ok(!ids.has(c.id), "duplicate " + c.id); ids.add(c.id);
    assert.ok(c.name && c.name_ru && /(20(2[0-6])|201[0-9]|200[0-9]|19[0-9][0-9])$/.test(c.years), c.id + " years " + c.years);
    assert.match(c.wiki, /^https:\/\/((en|de|ru|et|fr|pl|it|es|zh|ar|fa|tr|no|sv|da|fi|nl|cs|hu|ja|pt)\.wikipedia\.org\/wiki\/\S+|[a-z0-9.-]+\.(edu|ac\.uk)\/\S+|(www\.)?(bigenc|krugosvet)\.ru\/\S+|dspace\.ut\.ee\/\S+|mdpi\.com\/\S+)$/); // без статьи в Википедии — некролог университета, чтобы учёный не потерялся
    assert.ok(CRYSTAL_ZONES.includes(c.zone), c.id);
    for (const l of ["en", "ru", "de"]) assert.ok(c.idea[l] && c.idea[l].length > 10, c.id + " " + l);
    assert.ok(c.rule.length > 15, c.id);
  }
  for (const s of SCIENTISTS) assert.ok(!ids.has(s.id), "built sensor duplicated as waiting card: " + s.id);
});
test("report merges live sensors and filters by zone and query", () => {
  const all = crystalsReport(SCIENTISTS);
  assert.equal(all.with_sensor, SCIENTISTS.length); assert.equal(all.count, SCIENTISTS.length + CRYSTALS.length);
  const r = crystalsReport(SCIENTISTS, { zone: "rumour_vs_fact" }); assert.ok(r.crystals.every((c) => c.zone === "rumour_vs_fact"));
  assert.ok(r.crystals.some((c) => c.id === "park" && c.status === "has_sensor"));
  assert.equal(crystalsReport(SCIENTISTS, { q: "Gettier" }).crystals[0].id, "gettier");
  for (const s of SCIENTISTS) assert.ok(all.crystals.find((c) => c.id === s.id).zone, s.id + " has no zone");
});
test("pages and wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/crystals"/); assert.match(w, /name: "get_crystals"/); assert.match(w, /name === "get_crystals"/); assert.match(w, /"tools\/crystals"/); assert.match(w, /"hagenauer", "crystals"/);
  for (const f of ["tools/crystals.html", "de/tools/crystals.html", "en/tools/crystals.html"]) {
    const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8");
    assert.match(h, /\/go\/kraken\?from=crystals/); assert.match(h, /\/go\/starlink\?from=crystals/); assert.match(h, /share-x\.js/); assert.match(h, /hreflang="de"/);
    assert.match(h, /Edmund_Gettier/); assert.match(h, /\/tools\/hagenauer/);
  }
  for (const f of ["tools/scientists.html", "sitemap.xml", "llms.txt", ".well-known/agent.json", "share-x.js", "tools.html", "de/tools.html", "en/tools.html"]) assert.match(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), /crystals/);
});
