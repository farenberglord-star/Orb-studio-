import { test } from "node:test";
import assert from "node:assert/strict";
import { zipfReport, zipfWords } from "../src/zipf.js";

const DAY = 864e5, now = Date.parse("2026-12-10T12:00:00Z");
function rows() {
  const r = [];
  for (let d = 1; d <= 20; d++) for (let i = 0; i < 30; i++) r.push({ first_ts: now - d * DAY - i * 6e5, headline: i % 3 ? `Inflation rate rises in Germany number ${i}` : `Ukraine talks continue in Geneva round ${i}` });
  for (let i = 0; i < 50; i++) r.push({ first_ts: now - i * 6e5, headline: i < 8 ? `Volcano erupts near Naples, flights halted ${i}` : i < 16 ? `Ukraine talks collapse over ceasefire map ${i}` : `Inflation rate rises in Germany number ${i}` });
  return r;
}
test("Zipf: words, stop words, crude stems on any alphabet", () => {
  assert.deepEqual(zipfWords("The Fed says it will act"), []);
  assert.ok(zipfWords("Удары по Запорожью").includes("запорож"));
});
test("Zipf: a new word climbs as new_word, background words stay, verdict needs history", () => {
  const r = zipfReport(rows(), now);
  assert.notEqual(r.verdict, "collecting");
  const v = r.climbers.find((c) => c.word === "volcano");
  assert.ok(v && v.company === "new_word" && v.today_headlines === 8);
  assert.ok(r.background_words.includes("inflati"));
  assert.ok(!r.climbers.some((c) => c.word === "inflati"));
  assert.equal(r.stories.filter((s) => s.words.includes("volcano")).length, 1);
  assert.ok(r.stories.find((s) => s.words.includes("volcano")).words.includes("naples"));
  assert.equal(zipfReport(rows().filter((x) => x.first_ts > now - 3 * DAY), now).verdict, "collecting");
});
