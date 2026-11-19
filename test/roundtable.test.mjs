import { test } from "node:test";
import assert from "node:assert/strict";
import { rtWhen, cleanSpeech, rtCandidates, rtTopics, rtAssemble, rtPublishable, rtQueue, rtLineText, RT_GUESTS } from "../src/roundtable.js";

const B = (iso) => Date.parse(iso);

test("модератор решает сам, но в рамках: от 8 до 22, не чаще 6 ч, 1–2 в день, после 18:00 — обязательно", () => {
  assert.equal(rtWhen(null, B("2026-11-19T03:00:00Z"), 0, null), "first");
  const ep = { generated_at: "2026-11-19T07:00:00Z" };                       // 08:00 Берлин
  assert.equal(rtWhen(ep, B("2026-11-19T10:00:00Z"), 1, null), null);       // 11:00 — меньше 6 ч
  assert.equal(rtWhen(ep, B("2026-11-19T14:00:00Z"), 1, null), "ask");      // 15:00 — можно спросить
  assert.equal(rtWhen(ep, B("2026-11-19T14:00:00Z"), 1, B("2026-11-19T13:30:00Z")), null); // спрашивали полчаса назад
  assert.equal(rtWhen(ep, B("2026-11-19T15:00:00Z"), 2, null), null);       // уже два сегодня
  assert.equal(rtWhen(ep, B("2026-11-19T21:30:00Z"), 1, null), null);       // 22:30 — ночь
  const y = { generated_at: "2026-11-18T19:00:00Z" };                        // вчера
  assert.equal(rtWhen(y, B("2026-11-19T12:00:00Z"), 0, null), "ask");       // 13:00 — спросить, есть ли повод
  assert.equal(rtWhen(y, B("2026-11-19T17:10:00Z"), 0, B("2026-11-19T17:00:00Z")), "daily"); // 18:10 и ни одного — выходим
});

test("ответ гостя очищается от разметки и ссылок и обрезается по предложению", () => {
  assert.equal(cleanSpeech("**Sure.** See https://x.com/a and [this](https://b.c) now"), "Sure. See and this now");
  const long = "One sentence here. ".repeat(60);
  const c = cleanSpeech(long, 120); assert.ok(c.length <= 120 && c.endsWith("."));
});

const radars = [
  { id: "geo", title: "Geopolitics", feed: [["10:00", "Trump, Xi and Putin meet at Asia summit", "spiegel.de", 9, "https://s/1"], ["09:00", "Old story", "x", 2, ""]] },
  { id: "energy", title: "Energy", feed: [["11:00", "Tankers wait at Hormuz as talks stall", "reuters.com", 8, "https://r/2"], ["08:00", "Gas storage falls", "agsi", 3, ""]] },
  { id: "eco", title: "Economy", feed: [["07:00", "Bundesbank warns of 2027 inflation jump", "handelsblatt", 5, ""], ["07:30", "Trump, Xi and Putin meet at Asia summit", "dup", 1, ""]] },
];

test("кандидаты: без дублей и без вчерашних тем, тренды первыми", () => {
  const terms = [{ term: "hormuz" }];
  const tm = (h, t) => (/hormuz/i.test(h) ? ["hormuz"] : []);
  const c = rtCandidates(radars, terms, tm, ["Gas storage falls"]);
  assert.equal(c[0].headline, "Tankers wait at Hormuz as talks stall");
  assert.ok(c[0].trending);
  assert.equal(c.filter((x) => /Asia summit/.test(x.headline)).length, 1);
  assert.ok(!c.some((x) => x.headline === "Gas storage falls"));
  assert.deepEqual(c.map((x) => x.i), c.map((_, k) => k));
});

function sample() {
  const c = rtCandidates(radars, [], null, []);
  const plan = { intro: "Welcome to the Orb Studio AI Round Table.", topics: c.slice(0, 4).map((x) => ({ i: x.i, recap: "Recap of " + x.headline + ".", question: "What does it mean?" })) };
  const topics = rtTopics(c, plan);
  const list = topics.map((t) => ({ i: t.i, text: "A balanced answer about topic number " + t.i + " with context." }));
  const answers = { gemini: { list, model: "gemini-x" }, grok: { list, model: "grok-x" }, deepseek: { status: "off" } };
  const close = { thanks: topics.map((t) => ({ i: t.i, text: "Thank you both." })), closing: "Thank you Gemini, Grok and DeepSeek. Draw your own conclusions and comment below.", withhold: [{ i: 1, guest: "grok", reason: "price prediction" }] };
  return rtAssemble(topics, plan.intro, answers, close, { claude: "claude-x" });
}

test("сборка: 4 темы, DeepSeek не подключён, удержанный ответ не идёт в эфир", () => {
  const d = sample();
  assert.equal(d.topics.length, 4);
  assert.deepEqual(d.topics.map((t) => t.i), [0, 1, 2, 3]);
  assert.equal(d.topics[0].answers.deepseek.status, "off");
  assert.equal(d.topics[1].answers.grok.status, "withheld");
  assert.equal(d.cast.find((x) => x.id === "deepseek").connected, false);
  assert.equal(rtPublishable(d), true);
  const none = { ...d, topics: d.topics.map((t) => ({ ...t, answers: Object.fromEntries(RT_GUESTS.map((g) => [g, { status: "error" }])) })) };
  assert.equal(rtPublishable(none), false);
});

test("очередь эфира: приветствие, по теме — пересказ, вопрос, гости по очереди, спасибо; финал", () => {
  const d = { ...sample(), episode_id: "123" };
  const { lines, lang } = rtQueue(d, "ru", "https://o");
  assert.equal(lang, "en"); // перевода нет — честно английский
  assert.equal(lines[0].part, "intro"); assert.equal(lines[0].who, "claude");
  assert.equal(lines.at(-1).part, "closing");
  const t0 = lines.filter((x) => x.topic === 0).map((x) => x.part + ":" + x.who);
  assert.deepEqual(t0, ["recap:claude", "question:claude", "answer:gemini", "answer:grok", "absent:deepseek", "thanks:claude"]);
  assert.ok(lines.find((x) => x.part === "answer").audio.includes("ep=123&part=answer&seg=0&who=gemini&lang=en"));
  assert.ok(!lines.some((x) => x.topic === 1 && x.part === "answer" && x.who === "grok"));
});

test("перевод: реплика берётся на языке слушателя, нет перевода — нет реплики", () => {
  const d = sample();
  d.translations = { de: { intro: "Willkommen.", closing: "Danke.", topics: Object.fromEntries(d.topics.map((t) => [t.i, { recap: "R", question: "F", thanks: "D", answers: { gemini: "G-de", grok: "X-de" } }])) } };
  assert.equal(rtLineText(d, "intro", null, null, "de").text, "Willkommen.");
  assert.equal(rtLineText(d, "answer", 0, "gemini", "de").text, "G-de");
  assert.equal(rtLineText(d, "answer", 0, "deepseek", "de"), null);
  assert.equal(rtLineText(d, "intro", null, null, "tr"), null);
});
