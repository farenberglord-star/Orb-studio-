import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { feiertagModel, feiertagHtml, LAENDER } from "../src/feiertag.js";

const NOW = Date.parse("2026-10-31T10:00:00Z"); // Reformationstag: Feiertag in HH, nicht in BY
const rd = (f) => readFileSync(new URL("../" + f, import.meta.url), "utf8");

test("feiertag page: states differ on 31 October, German only, FAQ in JSON-LD", () => {
  const m = feiertagModel(NOW), h = feiertagHtml(m, "https://orbstudio.org", new Date(NOW));
  assert.equal(m.rows.length, 16); assert.equal(LAENDER.length, 16);
  assert.equal(m.rows.find((r) => r.code === "HH").is_public_holiday, true);
  assert.equal(m.rows.find((r) => r.code === "BY").is_public_holiday, false);
  assert.ok(!/[Ѐ-ӿ]/.test(h)); assert.match(h, /<html lang="de">/);
  assert.match(h, /<link rel="canonical" href="https:\/\/orbstudio.org\/de\/feiertag-heute">/);
  assert.match(h, /Reformationstag/); assert.match(h, /Keine Rechtsberatung/);
  const ld = JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/s.exec(h)[1]);
  assert.equal(ld["@graph"][1]["@type"], "FAQPage"); assert.ok(ld["@graph"][1].mainEntity.length >= 4);
});
test("feiertag page: an ordinary Thursday says so and names the next holiday", () => {
  const m = feiertagModel(Date.parse("2026-11-26T12:00:00Z")), h = feiertagHtml(m);
  assert.equal(m.hh.is_public_holiday, false); assert.match(h, /kein Feiertag/); assert.match(h, /1\. Weihnachtstag/);
});
test("maps pages exist in three languages with canonical, hreflang and the honest Google line", () => {
  for (const [f, lang, rx] of [["public/tools/maps.html", "ru", /не связан с Google/], ["public/de/tools/maps.html", "de", /nicht mit Google verbunden/], ["public/en/tools/maps.html", "en", /not affiliated with or endorsed by Google/]]) {
    const h = rd(f);
    assert.match(h, new RegExp(`<html lang="${lang}">`)); assert.match(h, rx);
    assert.match(h, /rel="canonical"/); assert.match(h, /hreflang="ru"/); assert.match(h, /hreflang="de"/); assert.match(h, /hreflang="en"/);
    assert.match(h, /Google LLC/);
    assert.ok(!/<img[^>]+google/i.test(h), "no Google logos or images");
    assert.ok(!/googleusercontent|gstatic|maps\.google|google\.com\/maps/i.test(h), "no Google assets or links");
  }
});
test("worker serves the feiertag page; sitemap and llms.txt list the new pages", () => {
  const w = rd("src/worker.js");
  assert.match(w, /feiertagHtml\(feiertagModel\(\), url\.origin\)/);
  const sm = rd("public/sitemap.xml");
  for (const u of ["/de/feiertag-heute", "/tools/maps", "/de/tools/maps", "/en/tools/maps"]) assert.ok(sm.includes("<loc>https://orbstudio.org" + u + "</loc>"), u);
  assert.ok(rd("public/llms.txt").includes("https://orbstudio.org/de/feiertag-heute"));
});
