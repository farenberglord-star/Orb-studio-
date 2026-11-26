import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { thinkItThrough, THINK_ZONES, detectLang } from "../src/think.js";
import { CRYSTALS } from "../src/crystals.js";

test("think_it_through: every card id in the questions exists in the library", () => {
  const ids = new Set(CRYSTALS.map((c) => c.id));
  for (const z of Object.values(THINK_ZONES)) for (const w of z.who) if (w.id) assert.ok(ids.has(w.id), w.id);
});
test("think_it_through: every zone has a question in three languages", () => {
  for (const z of Object.values(THINK_ZONES)) for (const l of ["ru", "en", "de"]) assert.ok(z.q[l] && z.q[l].length > 40, z.zone + l);
});
test("think_it_through: news question goes to rumour_vs_fact and points to check_claim", () => {
  const r = thinkItThrough("Как мне проверить эту новость, это правда или слух?");
  assert.equal(r.lang, "ru"); assert.equal(r.questions[0].zone, "rumour_vs_fact");
  assert.ok(r.pointers.some((p) => p.tool === "check_claim"));
});
test("think_it_through: choosing a country gives questions, never a recommendation, and says so", () => {
  const r = thinkItThrough("Which country and political system is better to choose?");
  assert.equal(r.lang, "en"); assert.ok(r.questions.some((q) => q.zone === "one_model"));
  assert.ok(r.notes.some((n) => /does not rate or recommend/.test(n)));
  assert.ok(!/you should (choose|pick|move)/i.test(JSON.stringify(r)));
});
test("think_it_through: money and health questions carry the no-advice note", () => {
  assert.ok(thinkItThrough("Should I buy bitcoin now? Is it still a good time?").notes.some((n) => /not financial advice/.test(n)));
  assert.ok(thinkItThrough("Welche Behandlung ist besser? Ich bin unsicher.").notes.some((n) => /kein medizinischer Rat/.test(n)));
});
test("think_it_through: no trigger words falls back to three default questions; short input is refused", () => {
  const r = thinkItThrough("Расскажи что-нибудь интересное пожалуйста");
  assert.equal(r.matched_by_words, false); assert.equal(r.questions.length, 3);
  assert.ok(thinkItThrough("hi").error);
  assert.equal(detectLang("Ist das wahr und nicht erfunden"), "de");
});
test("think_it_through: MCP tool, REST route and announcements are registered", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /name: "think_it_through"/); assert.match(w, /p === "\/api\/v1\/think"/); assert.match(w, /name === "think_it_through"/);
  assert.match(w, /tool: "think_it_through", url:/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /\(think_it_through\)/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /"think_it_through"/);
});
test("think_it_through: time words, reviews and urgency reach their zones", () => {
  assert.ok(thinkItThrough("Какие новости были в городе за последнюю неделю?").questions.some((q) => q.zone === "stale_data"));
  assert.ok(thinkItThrough("Проверь рейтинг и отзывы отеля").questions.some((q) => q.zone === "measurement_error"));
  assert.ok(thinkItThrough("Мне нужна комната через час, срочно").questions.some((q) => q.zone === "answer_cost"));
});
