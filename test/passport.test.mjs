import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { newsPassport } from "../src/passport.js";
import { grokUser, GROK_SYSTEM, assembleDuo } from "../src/duo.js";

const now = Date.UTC(2026, 10, 23, 12);
test("threat with one outlet: low confidence, do not say it happened", () => {
  const p = newsPassport({ headline: "Trump threatens 50% tariffs on EU cars", confirm: 1, published_at: new Date(now - 3 * 3600e3).toISOString() }, now);
  assert.equal(p.status, "threat_or_warning"); assert.equal(p.confidence, "low"); assert.equal(p.voices, 1);
  assert.ok(p.say.some((x) => /not something that happened/.test(x))); assert.ok(p.say.some((x) => /Only one outlet/.test(x)));
});
test("event with many outlets, fresh and checkable: high", () => {
  const p = newsPassport({ headline: "Germany's Bundestag passes 2027 budget on Friday", confirm: 5, published_at: new Date(now - 2 * 3600e3).toISOString() }, now);
  assert.equal(p.status, "reported_event"); assert.equal(p.confidence, "high");
});
test("old, hedged, state media, statement", () => {
  const p = newsPassport({ headline: "Kremlin says talks could reportedly resume", confirm: 3, published_at: new Date(now - 30 * 3600e3).toISOString(), state_media: "TASS — state news agency" }, now);
  assert.equal(p.status, "statement"); assert.ok(p.say.some((x) => /hours ago/.test(x))); assert.ok(p.say.some((x) => /state media/.test(x))); assert.notEqual(p.confidence, "high"); assert.ok(p.say.some((x) => /vague|hedge/.test(x)));
  assert.equal(newsPassport({ headline: "x" }, now).voices, null);
});
test("Grok gets the passport, and the segment shows it", () => {
  const p = newsPassport({ headline: "EU plans new sanctions", confirm: 2 }, now);
  const u = JSON.parse(grokUser("EU plans new sanctions", "Reuters", [], null, [], p));
  assert.equal(u.PASSPORT.status, "plan_or_promise"); assert.ok(Array.isArray(u.PASSPORT.say));
  assert.equal(JSON.parse(grokUser("h", "s", [], null, [])).PASSPORT, undefined);
  assert.match(GROK_SYSTEM, /PASSPORT/);
  const d = assembleDuo([{ headline: "h", source: "s", read: "h", facts: [], passport: p, reply: { ok: true, text: "ok" } }]);
  assert.equal(d.segments[0].passport.status, "plan_or_promise");
  assert.match(readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"), /const passport = newsPassport\(it\)/);
});
test("colon speaker, forecast, question", () => {
  assert.equal(newsPassport({ headline: "Трамп: Иран за неделю выпустил рекордное число ракет" }, now).status, "statement");
  assert.equal(newsPassport({ headline: "Citi Report: Fed to Raise Rates by 25 BPS in December" }, now).status, "forecast_or_speculation");
  assert.equal(newsPassport({ headline: "Will It Be Enough to Stop the Rate Hikes?" }, now).status, "question_headline");
  assert.equal(newsPassport({ headline: "Drones hit fuel depots in three Russian regions" }, now).status, "reported_event");
});
