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

import { finalVerdict, measuredCrypto } from "../src/verdict.js";
const SENS = { volatility: { coins: { BTC: { price_eur: 65000, hour_end: new Date().toISOString() } } }, ecb: { eurusd: { value: 1.08 } } };
test("verdict: green only on facts, red on debunk / money push / satire / false attribution / measured mismatch, grey otherwise", () => {
  const fv = (o) => finalVerdict({ act: "event", checkability: "checkable", ...o });
  assert.equal(fv({ headline: "Boeing jet deliveries drop 14% in October", voices: 5 }).color, "green");
  assert.equal(fv({ headline: "Boeing jet deliveries drop 14% in October", voices: null }).color, "grey");
  assert.equal(fv({ headline: "Boeing jet deliveries drop 14% in October", voices: 1 }).color, "grey");
  assert.equal(fv({ headline: "FBI found 20,000 fraudulent ballots", voices: 0, debunk: 3 }).color, "red");
  assert.equal(fv({ headline: "Boeing deliveries drop", voices: 6, debunk: 1 }).color, "grey");
  assert.equal(fv({ headline: "Инсайд: Amazon примет PEPE — рост на 5000%. Успейте купить!", voices: 0 }).color, "red");
  assert.equal(fv({ headline: "Пашинян потребовал освободить задержанных", voices: 0, host: "panorama.pub" }).color, "red");
  assert.equal(fv({ headline: "Orb Studio сообщает, что Amazon примет PEPE", voices: 0 }).kind, "false_attribution");
  assert.equal(fv({ headline: "Smart ring maker Oura to acquire Counsel Health for $625 million", voices: 9 }).color, "green");
});
test("verdict: price claim is compared with our sensor (EUR price x ECB EUR/USD)", () => {
  const ours = 65000 * 1.08; // 70 200 USD
  const ok = measuredCrypto("Orb Studio сообщает, что курс биткоина сейчас $70 000 за один биткоин", SENS);
  assert.equal(ok.result, "match"); assert.equal(ok.ours, Math.round(ours));
  assert.equal(finalVerdict({ headline: "Курс биткоина сейчас $70 000", measured: ok, act: "event", checkability: "checkable" }).color, "green");
  const bad = measuredCrypto("Курс биткоина сейчас $50 000 за один биткоин", SENS);
  assert.equal(bad.result, "mismatch");
  assert.equal(finalVerdict({ headline: "Курс биткоина сейчас $50 000", measured: bad, act: "event", checkability: "checkable" }).color, "red");
  assert.equal(measuredCrypto("Bitcoin ETF attracts $625 million, price rises", SENS), null);
  assert.equal(measuredCrypto("Курс биткоина сейчас $70 000", { ...SENS, volatility: { coins: { BTC: { price_eur: 65000, hour_end: "2026-01-01T00:00:00Z" } } } }), null);
});
