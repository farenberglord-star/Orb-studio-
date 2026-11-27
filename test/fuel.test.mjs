import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fuelPassport, fuelReport, fuelData, FUEL_RADIUS_KM, FUEL_TTL_MS } from "../src/fuel.js";

const S = (brand, place, diesel, extra = {}) => ({ brand, name: brand, place, street: "X", isOpen: true, diesel, e5: 1.8, e10: 1.75, ...extra });

test("fuel passport: closed, empty, impossible and outlier prices are dropped, prices never changed", () => {
  const st = [S("A", "Hamburg", 1.69), S("B", "Hamburg", 1.65), S("C", "Buxtehude", 1.72), S("D", "Harburg", 1.7),
    S("closed", "Hamburg", 1.5, { isOpen: false }), S("none", "Hamburg", null), S("false", "Hamburg", false), S("zero", "Hamburg", 0),
    S("range", "Hamburg", 0.999), S("typo", "Hamburg", 2.4)];
  const p = fuelPassport(st, "diesel");
  assert.equal(p.stations_total, 10);
  assert.equal(p.stations_passed, 4);
  assert.deepEqual(p.rejected, { closed: 1, no_price: 3, out_of_range: 1, outlier: 1 });
  assert.equal(p.lowest, 1.65);
  assert.deepEqual(p.top.map((x) => x.price), [1.65, 1.69, 1.7, 1.72]); // цены ровно такие, как пришли
});

test("fuel report: attribution, passport note, no key, all three fuels", () => {
  const r = fuelReport([S("A", "Hamburg", 1.69)], Date.now());
  assert.equal(r.status, "ok");
  assert.match(r.attribution, /Tankerkönig\.de, CC BY 4\.0/);
  assert.deepEqual(Object.keys(r.fuels), ["diesel", "e5", "e10"]);
  assert.match(r.passport.note, /never changes a price/);
  assert.ok(!/apikey/i.test(JSON.stringify(r)));
});

test("fuel data: radius within API limit, shared cache is used, no key means unavailable, no call to the API while cache is fresh", async () => {
  assert.ok(FUEL_RADIUS_KM <= 25); assert.ok(FUEL_TTL_MS >= 5 * 60e3);
  const noKey = await fuelData({}, { sharedGet: async () => null, sharedPut: async () => {} });
  assert.equal(noKey.status, "unavailable");
  const cached = { stations: [S("A", "Hamburg", 1.69)], at: Date.now() };
  let fetched = false; const real = globalThis.fetch; globalThis.fetch = async () => { fetched = true; throw new Error("must not be called"); };
  try {
    const r = await fuelData({ TANKERKOENIG_KEY: "k" }, { sharedGet: async () => cached, sharedPut: async () => {} });
    assert.equal(r.status, "ok"); assert.equal(r.cached, true); assert.equal(fetched, false);
  } finally { globalThis.fetch = real; }
});

test("fuel pages: three languages, canonical, hreflang, partner banners, attribution, share on X, in sitemap, route wired", () => {
  const rd = (f) => readFileSync(new URL("../" + f, import.meta.url), "utf8");
  for (const [f, lang] of [["public/tools/fuel.html", "ru"], ["public/de/tools/fuel.html", "de"], ["public/en/tools/fuel.html", "en"]]) {
    const h = rd(f);
    assert.match(h, new RegExp(`<html lang="${lang}">`));
    assert.match(h, /rel="canonical" href="https:\/\/orbstudio\.org[^"]*\/tools\/fuel"/);
    assert.match(h, /hreflang="de"/); assert.match(h, /\/go\/kraken\?from=fuel/); assert.match(h, /\/go\/starlink\?from=fuel/);
    assert.match(h, /tankerkoenig\.de/); assert.match(h, /CC BY 4\.0/); assert.match(h, /x\.com\/intent\/post/);
    assert.match(h, /\/api\/v1\/fuel-hamburg/); assert.ok(!/demo|демо/i.test(h));
  }
  const sm = rd("public/sitemap.xml");
  for (const u of ["/tools/fuel", "/de/tools/fuel", "/en/tools/fuel"]) assert.ok(sm.includes(`<loc>https://orbstudio.org${u}</loc>`));
  const w = rd("src/worker.js");
  assert.match(w, /p === "\/api\/v1\/fuel-hamburg"/); assert.match(w, /"tools\/fuel"/); assert.match(w, /"tools", "fuel", "court"/);
});
