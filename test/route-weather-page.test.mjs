import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const rd = (f) => readFileSync(new URL("../" + f, import.meta.url), "utf8");
test("route-weather pages: three languages, canonical, hreflang, form, honest not-a-forecast note, no Google assets", () => {
  for (const [f, lang, rx] of [["public/tools/route-weather.html", "ru", /Это не прогноз/], ["public/de/tools/route-weather.html", "de", /Keine Vorhersage/], ["public/en/tools/route-weather.html", "en", /Not a forecast/]]) {
    const h = rd(f);
    assert.match(h, new RegExp(`<html lang="${lang}">`)); assert.match(h, rx);
    assert.match(h, /rel="canonical"/); for (const l of ["ru", "de", "en"]) assert.match(h, new RegExp(`hreflang="${l}"`));
    assert.match(h, /id="f"/); assert.match(h, /conditions=true/); assert.match(h, /textContent/);
    assert.ok(!/innerHTML/.test(h), "no innerHTML: API values are written as text");
    assert.ok(!/googleusercontent|gstatic|maps\.google|google\.com\/maps/i.test(h));
  }
});
test("route-weather pages are in the sitemap and linked from the maps pages", () => {
  const sm = rd("public/sitemap.xml");
  for (const u of ["/tools/route-weather", "/de/tools/route-weather", "/en/tools/route-weather"]) assert.ok(sm.includes("<loc>https://orbstudio.org" + u + "</loc>"), u);
  assert.ok(rd("public/tools/maps.html").includes("/tools/route-weather"));
  assert.ok(rd("public/de/tools/maps.html").includes("/de/tools/route-weather"));
  assert.ok(rd("public/en/tools/maps.html").includes("/en/tools/route-weather"));
});
