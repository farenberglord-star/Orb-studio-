import test from "node:test";
import assert from "node:assert/strict";
import { summarizeParties, bundestagPolls, DISCLAIMER_I18N, PARTIES } from "../src/partyradar.js";

const parties = { 1: { short: "AfD", name: "AfD" }, 2: { short: "CDU/CSU", name: "Union" }, 3: { short: "SPD", name: "SPD" }, 4: { short: "Grüne", name: "Grüne" }, 5: { short: "Linke", name: "Die Linke" } };
const S = (institute, date, results, parliament = "Bundestag") => ({ institute, date, parliament, results });
const NOW = Date.UTC(2026, 10, 28, 12);
const feed = { updated: "2026-11-27T10:00:00", parties, surveys: [
  S("Forsa", "2026-11-24", { 1: 26, 2: 25 }), S("INSA", "2026-11-25", { 1: 26.5, 2: 24 }), S("INSA", "2026-11-22", { 1: 99 }),
  S("Forsa", "2026-11-17", { 1: 25, 2: 26 }), S("Verian", "2026-11-18", { 1: 26, 2: 25 }),
  S("Forsa", "2026-11-26", { 1: 10 }, "Landtag"),
] };

test("range, mean, count and shift per party from the last N days", () => {
  const r = summarizeParties(feed, NOW);
  assert.equal(r.ok, true);
  const afd = r.cards.find((c) => c.party === "AfD");
  // window A (22.11–28.11): latest per institute = Forsa 26, INSA 26.5 (the older INSA 99 does not count twice)
  assert.deepEqual([afd.n, afd.min, afd.max, afd.mean], [2, 26, 26.5, 26.25]);
  // window B (15.11–21.11): Forsa 25, Verian 26 → mean 25.5; shift 0.75
  assert.equal(afd.mean_previous, 25.5);
  assert.equal(afd.shift_pp, 0.75);
  assert.equal(afd.sources[0].institute, "INSA");
});
test("a missing value is not zero and a thin window gives no shift", () => {
  const r = summarizeParties(feed, NOW);
  const spd = r.cards.find((c) => c.party === "SPD"), bsw = r.cards.find((c) => c.party === "BSW");
  assert.equal(spd.n, 0); assert.equal(spd.mean, null); assert.equal(spd.shift_pp, null);
  assert.equal(bsw.n, 0); assert.equal(bsw.mean, null);
  const cdu = r.cards.find((c) => c.party === "CDU/CSU");
  assert.equal(cdu.shift_pp, -1); // (25+24)/2 - (26+25)/2 = -1
});
test("only the Bundestag counts and all seven parties are present", () => {
  assert.equal(bundestagPolls(feed).length, 5);
  assert.deepEqual(summarizeParties(feed, NOW).cards.map((c) => c.party), PARTIES);
});
test("no poll in the window is reported honestly, never estimated", () => {
  const r = summarizeParties(feed, Date.UTC(2026, 11, 28));
  assert.equal(r.ok, false); assert.match(r.reason, /no poll/);
});
test("disclaimer exists in three languages and the result carries ODbL attribution", () => {
  const r = summarizeParties(feed, NOW);
  assert.ok(DISCLAIMER_I18N.ru && DISCLAIMER_I18N.de && DISCLAIMER_I18N.en);
  assert.match(r.attribution, /dawum\.de/); assert.match(r.attribution, /ODbL|Open Database/);
  assert.match(r.disclaimer, /Не рекомендация, не прогноз, не призыв/);
});

import { readFileSync } from "node:fs";
test("check_place says chargers 'not_requested' instead of a bare null, and /news, /check-claim are in the OpenAPI list", () => {
  assert.match(readFileSync(new URL("../src/place.js", import.meta.url), "utf8"), /status: "not_requested"/);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.ok(w.includes('"/api/v1/news", "getNewsByTopic"') && w.includes('"/api/v1/check-claim", "checkClaim"'));
  assert.ok(!readFileSync(new URL("../src/news.js", import.meta.url), "utf8").includes("check-headline"));
});
