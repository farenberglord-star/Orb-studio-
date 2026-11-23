import { test } from "node:test";
import assert from "node:assert/strict";
import { toneOf } from "../src/tone.js";
import { newsPassport } from "../src/passport.js";

test("loaded words in three languages (Osgood, Elias); literal topics and look-alike words are not loaded", () => {
  for (const h of ["Shocking scandal rocks parliament", "Katastrophe! Preise explodieren", "Шок и паника на бирже", "Chaos at airports as strikes hit Germany"]) {
    const p = newsPassport({ headline: h, confirm: 3 }); assert.ok(p.tone && p.tone.loaded, h); assert.ok(p.say.some((x) => /emotionally loaded/.test(x)), h);
  }
  for (const h of ["Bitcoin falls 5%", "Earthquake kills 30 in Turkey", "Шоколад дорожает", "Stunt performer hurt", "massive turnout in Berlin"]) assert.equal(newsPassport({ headline: h, confirm: 3 }).tone, null, h);
  const t = toneOf("Shocking scandal rocks parliament"); assert.equal(t.evaluation, "negative"); assert.equal(t.potency, "strong"); assert.equal(t.activity, "sharp");
});
test("tone line never changes confidence (Harman calibration stays comparable)", () => {
  for (const [a, b] of [["Chaos at airports as strikes hit Germany", "Delays at airports as strikes hit Germany"], ["Shocking scandal rocks parliament", "Scandal rocks parliament"]]) {
    for (const c of [0, 1, 3, 5]) assert.equal(newsPassport({ headline: a, confirm: c }).confidence, newsPassport({ headline: b, confirm: c }).confidence, a);
  }
});
