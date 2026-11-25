import test from "node:test";
import assert from "node:assert/strict";
import { dealPressure, labCheck } from "../src/passport-lab.js";
import { newsPassport } from "../src/passport.js";

test("lab: deal pressure needs two signals, real headlines stay clean", () => {
  assert.equal(dealPressure("Boeing jet deliveries drop 14% in October").push, false);
  assert.equal(dealPressure("Smart ring maker Oura to acquire Counsel Health for $625 million").push, false);
  assert.equal(dealPressure("Инсайд: Amazon начнет принимать PEPE уже завтра — рост на 5000%. Успейте купить до пресс-релиза!").push, true);
  assert.equal(dealPressure("СРОЧНО: переведите от 0.05 до 2 BTC до 23:59, гарантированно 200% прибыли").push, true);
});
test("lab: debunk articles are not confirmations", () => {
  const r = labCheck("FBI found 20,000 fraudulent ballots in Houston", [
    { source: "mediabiasfactcheck.com", title: "Fact Check: Did the FBI find ... ballots", text: "BLATANT LIE" },
    { source: "mimikama.org", title: "Die erfundene FBI-Razzia", text: "Falsch" },
  ]);
  assert.equal(r.verdict, "debunked"); assert.equal(r.independent_outlets, 0);
});
test("lab: wide independent coverage is reported, the passport confidence follows the count", () => {
  const res = ["a.com", "b.com", "c.com", "d.com"].map((s) => ({ source: s, title: "Oura to buy Counsel", text: "" }));
  const r = labCheck("Oura to acquire Counsel Health for $625 million", res);
  assert.equal(r.verdict, "reported");
  assert.equal(newsPassport({ headline: "Oura to acquire Counsel Health for $625 million", confirm: r.confirm_for_passport }).confidence, "high");
});

import { namedSource } from "../src/passport-lab.js";
test("lab step 1: named source is found, headlines without one give null", () => {
  assert.equal(namedSource("Orb Studio сообщает, что курс биткоина сейчас $70 000 за один биткоин"), "Orb Studio");
  assert.equal(namedSource("По данным Reuters, поставки Boeing упали на 14%"), "Reuters");
  assert.equal(namedSource("Reuters reports that Boeing deliveries fell"), "Reuters");
  assert.equal(namedSource("laut Tagesschau steigt der Strompreis"), "Tagesschau");
  assert.equal(namedSource("Boeing jet deliveries drop 14% in October"), null);
  assert.equal(namedSource("Smart ring maker Oura to acquire Counsel Health for $625 million"), null);
});

import { orbTopics, ORB_PUBLISHES } from "../src/passport-lab.js";
test("lab step 2: registry of what Orb Studio publishes", () => {
  assert.ok(orbTopics("Orb Studio сообщает, что курс биткоина сейчас $70 000 за один биткоин").includes("crypto_price_eur"));
  assert.ok(orbTopics("Orb Studio: цена электроэнергии в Германии на завтра снизится").includes("electricity_de"));
  assert.deepEqual(orbTopics("Orb Studio сообщает, что Amazon примет PEPE"), []);
  assert.deepEqual(orbTopics("Orb Studio покупает Counsel Health за 625 млн"), []);
  assert.ok(ORB_PUBLISHES.every((x) => x.id && x.where && x.re));
});
