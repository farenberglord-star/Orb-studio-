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
  assert.match(readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"), /const passport = newsPassport\(\{ ...it, amplified/);
});
test("colon speaker, forecast, question", () => {
  assert.equal(newsPassport({ headline: "Трамп: Иран за неделю выпустил рекордное число ракет" }, now).status, "statement");
  assert.equal(newsPassport({ headline: "Citi Report: Fed to Raise Rates by 25 BPS in December" }, now).status, "forecast_or_speculation");
  assert.equal(newsPassport({ headline: "Will It Be Enough to Stop the Rate Hikes?" }, now).status, "question_headline");
  assert.equal(newsPassport({ headline: "Drones hit fuel depots in three Russian regions" }, now).status, "reported_event");
});
test("bridges: amplified story (Zajonc + Kasperson) and 'not known yet' (Weizenbaum)", () => {
  const p = newsPassport({ headline: "Explosion at port", confirm: 5, amplified: { outlets_first: 1, outlets_peak: 5 } }, now);
  assert.deepEqual(p.amplified, { from: 1, to: 5 }); assert.ok(p.say.some((x) => /repetition is not confirmation/.test(x)));
  assert.equal(newsPassport({ headline: "x", amplified: { outlets_first: 2, outlets_peak: 3 } }, now).amplified, null);
  assert.match(GROK_SYSTEM, /never cover a gap with smooth general words/);
});
test("a place before the colon is not a speaker", () => {
  assert.equal(newsPassport({ headline: "Turkey: Thousands protest closure of critical media outlets" }, now).status, "reported_event");
});
test("round table and David's pick get the passport; any-headline passport tool exists", async () => {
  const { rtCandidates, rtGuestSystem, RT_MOD_SYSTEM } = await import("../src/roundtable.js");
  const radars = [{ id: "geo", title: "Geo", feed: [["10:00", "Iran threatens to close the Strait of Hormuz", "Reuters", 80, "https://x", Date.now() - 3600e3]], verify: [1] }];
  const c = rtCandidates(radars, [], null, []);
  assert.equal(c[0].passport.status, "threat_or_warning"); assert.equal(c[0].passport.outlets, 1);
  assert.match(rtGuestSystem("grok"), /PASSPORT/); assert.match(RT_MOD_SYSTEM, /passport/);
  const { pickUser, HOST_PICK_SYSTEM } = await import("../src/duo.js");
  assert.match(pickUser([{ headline: "h", passport: newsPassport({ headline: "Will it rain?" }, now) }], [], [], []), /question_headline/); assert.match(HOST_PICK_SYSTEM, /passport/);
  assert.match(GROK_SYSTEM, /do not open every answer with "David,"/);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"); assert.match(w, /name: "get_news_passport"/); assert.match(w, /p === "\/api\/v1\/passport"/);
});
test("Hume: an extraordinary claim with few outlets gets extra caution", () => {
  const p = newsPassport({ headline: "Трамп: Иран за неделю выпустил рекордное число ракет и дронов", confirm: 1 }, now);
  assert.equal(p.confidence, "low"); assert.ok(p.say.some((x) => /extraordinary claim/.test(x)));
  assert.ok(!newsPassport({ headline: "Record heat in Spain", confirm: 6, published_at: new Date(now - 3600e3).toISOString() }, now).say.some((x) => /extraordinary/.test(x)), "many outlets: no extra line");
  assert.ok(newsPassport({ headline: "Erstmals seit 1990: Bahn streicht alle Züge" }, now).say.some((x) => /extraordinary/.test(x)));
});
test("quotes, found documents and first source (Derrida, Valla/Dobrovsky/Chasles, Schleicher)", async () => {
  const { newsPassport } = await import("../src/passport.js");
  const q = newsPassport({ headline: "Minister calls plan “a disaster” for farmers", confirm: 4 });
  assert.ok(q.quoted && q.say.some((x) => /out of context/.test(x)));
  const d = newsPassport({ headline: "Leaked memo shows ministry knew about delays", confirm: 5, published_at: new Date().toISOString() });
  assert.ok(d.found_document && d.say.some((x) => /double checking/.test(x)) && d.confidence !== "high");
  const f = newsPassport({ headline: "Rail strike halts trains across Germany", confirm: 4, amplified: { outlets_first: 1, outlets_peak: 6, first_source: "Reuters" } });
  assert.equal(f.first_source, "Reuters"); assert.ok(f.say.some((x) => /First carried by Reuters/.test(x)));
  const n = newsPassport({ headline: "Rail strike halts trains across Germany", confirm: 4 });
  assert.ok(!n.quoted && !n.found_document && !n.say.some((x) => /First carried/.test(x)));
});
test("hosts correct a false premise (Strawson, Schopenhauer)", async () => {
  const { GROK_SYSTEM } = await import("../src/duo.js"); const { rtGuestSystem } = await import("../src/roundtable.js");
  assert.match(GROK_SYSTEM, /false or unverified premise/); assert.match(rtGuestSystem("grok"), /false or unverified premise/);
});
test("metaphor is not the fact (Max Müller); hosts name who else pays (Sidgwick)", async () => {
  const { newsPassport } = await import("../src/passport.js");
  for (const h of ["Price war hits supermarkets as Aldi cuts 500 prices", "Handelskrieg: EU antwortet auf US-Zölle", "Цунами увольнений в автопроме"]) { const p = newsPassport({ headline: h, confirm: 3 }); assert.ok(p.metaphor, h); assert.ok(p.say.some((x) => /metaphor/.test(x)), h); }
  for (const h of ["Tsunami warning after earthquake off Japan", "War in Sudan displaces thousands", "Bitcoin falls 5%"]) assert.equal(newsPassport({ headline: h, confirm: 3 }).metaphor, null, h);
  const { GROK_SYSTEM } = await import("../src/duo.js"); const { rtGuestSystem } = await import("../src/roundtable.js");
  assert.match(GROK_SYSTEM, /who else gains or pays/); assert.match(rtGuestSystem("grok"), /who else gains or pays/);
});
