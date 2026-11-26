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

test("author's archive round: fixed theses, one neutral question, answers cleaned; made once and only on request", async () => {
  const m = await import("../src/roundtable.js");
  assert.equal(m.RT_AUTHOR_THESES.length, 5); assert.match(m.RT_AUTHOR_THESES[4], /закрепить линию соприкосновения и прекратить огонь/); assert.match(m.RT_AUTHOR_QUESTION, /что в нём подтвердилось, что нет и что осталось спорным/);
  assert.match(m.RT_AUTHOR_CLOSE_SYSTEM, /never say whether the thesis is right or wrong/); assert.match(m.rtGuestSystem("grok", "Russian"), /in Russian in 2-4 spoken sentences/); assert.match(m.rtGuestSystem("grok"), /in English in 2-4 spoken sentences/);
  assert.match(m.rtGuestSystem("gemini", "Russian"), /present the main viewpoints fairly instead of taking a side/);
  const ans = { gemini: { model: "g", data: { answers: [{ i: 0, text: "Это **разумная** мысль, но бюджеты с тех пор только выросли. https://x.io" }, { i: 9, text: "лишний ответ не по теме, он никуда не попадает" }] } }, grok: { error: "timeout" }, deepseek: { data: { answers: [{ i: 0, text: "коротко" }] } } };
  const r = m.rtAuthorAssemble(ans, { notes: [{ i: 0, text: "Спасибо гостям: они сходятся в том, что бюджеты выросли." }, { i: 1, text: "x" }] });
  assert.equal(r.length, 5); assert.equal(r[0].answers.gemini.text, "Это разумная мысль, но бюджеты с тех пор только выросли."); assert.equal(r[0].answers.grok.status, "offline"); assert.equal(r[0].answers.deepseek.status, "offline", "a too short answer is not shown");
  assert.equal(r[0].moderator_note, "Спасибо гостям: они сходятся в том, что бюджеты выросли."); assert.equal(r[1].moderator_note, null); assert.equal(r[3].thesis, m.RT_AUTHOR_THESES[3]);
  const store = {}, deps = { sharedGet: async (e, k) => store[k] || null, sharedPut: async (e, k, v) => { store[k] = v; } };
  assert.deepEqual(await m.rtAuthorPreview({}, deps, false), { status: "not_made_yet" }); assert.deepEqual(store, {}, "a plain read never starts the models");
  assert.equal((await m.rtAuthorPreview({}, deps, true)).status, "guests_offline", "no keys: nothing is invented"); assert.ok(!store[m.RT_AUTHOR_KEY]);
  assert.equal((await m.rtAuthorPreview({}, deps, true)).status, "preparing", "a second request while one is running does not start another");
  store[m.RT_AUTHOR_KEY] = { status: "ok", rounds: [] }; assert.equal((await m.rtAuthorPreview({}, deps, true)).status, "ok");
});

test("author's archive round: German and English translations cover every thesis and answer and keep the numbers", async () => {
  const { readFileSync } = await import("node:fs");
  const tr = JSON.parse(readFileSync(new URL("../public/data/author-round-i18n.json", import.meta.url), "utf8")), m = await import("../src/roundtable.js");
  assert.match(tr.generated_at, /^2026-11-21T/); assert.equal(tr.translated_by, "Claude (Anthropic)");
  for (const l of ["en", "de"]) { const L = tr[l]; assert.equal(L.rounds.length, m.RT_AUTHOR_THESES.length); assert.match(L.sub, /Claude/); assert.ok(L.title.length > 10 && L.question.length > 40);
    for (const r of L.rounds) { assert.ok(r.thesis.length > 40); for (const g of m.RT_GUESTS) { assert.ok(r[g].length > 60, l + " " + g); assert.ok(!/[а-яё]/i.test(r[g] + r.thesis), "no Russian left in " + l); } } }
  assert.match(tr.en.rounds[4].thesis, /fix the line of contact and cease fire/); assert.match(tr.de.rounds[4].thesis, /Kontaktlinie festzuschreiben/);
  const html = readFileSync(new URL("../public/roundtable.html", import.meta.url), "utf8");
  assert.match(html, /res\[1\]\.generated_at === \(d && d\.generated_at\)/, "a translation of another round is never shown"); assert.match(html, /\["ru", "de", "en"\]\.indexOf\(lg\) < 0/);
});

test("three site languages only: Russian, German, English — Romanian and Turkish are retired", async () => {
  const { readFileSync } = await import("node:fs");
  const m = await import("../src/roundtable.js"), page = await import("../public/roundtable.js"), duo = await import("../public/studio-duo.js");
  assert.deepEqual(m.RT_LANGS, ["en", "de", "ru"]); assert.deepEqual(m.RT_TR, ["de", "ru"]);
  assert.deepEqual(Object.keys(page.T).sort(), ["de", "en", "ru"]); assert.deepEqual(Object.keys(duo.T).sort(), ["de", "en", "ru"]);
  assert.equal(duo.pickLang("?lang=ro", "ru-RU"), "ru"); assert.equal(duo.pickLang("", "tr-TR"), "en");
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /const DUO_LANGS = \["de", "ru"\];/); assert.match(w, /Response\.redirect\(url\.origin \+ "\/en\/" \+ \(old\[1\] \|\| ""\) \+ url\.search, 301\)/);
  assert.ok(!/RO: "ro"|TR: "tr"/.test(w)); assert.ok(!/5 languages/.test(w + readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8")));
  const aj = JSON.parse(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8")); assert.ok(!JSON.stringify(aj).includes('"ro"') && !JSON.stringify(aj).includes('"tr"'));
});

test("Gemini: пустой ответ или 404 первой модели — берётся следующая, причины видны в ошибке", async () => {
  const m = await import("../src/roundtable.js"), realFetch = globalThis.fetch, seen = [];
  try {
    const good = JSON.stringify({ answers: [{ i: 0, text: "Ответ Gemini по теме выпуска." }] });
    globalThis.fetch = async (url, init) => { const model = decodeURIComponent(String(url).split("/models/")[1].split(":")[0]); seen.push([model, JSON.parse(init.body).generationConfig.temperature]);
      if (model === "gemini-3.6-flash") return new Response(JSON.stringify({ candidates: [{ finishReason: "STOP", content: { parts: [] } }] }), { status: 200 });
      if (model === "gemini-3.5-flash") return new Response("not found", { status: 404 });
      return new Response(JSON.stringify({ modelVersion: model, candidates: [{ finishReason: "STOP", content: { parts: [{ text: good }] } }] }), { status: 200 }); };
    const r = await m.askGuest({ GEMINI_API_KEY: "k" }, "gemini", [{ i: 0, headline: "H", source: "S", recap: "R", question: "Q?" }], "Russian");
    assert.equal(r.model, "gemini-3.1-flash-lite"); assert.deepEqual(seen.map((x) => x[0]), ["gemini-3.6-flash", "gemini-3.5-flash", "gemini-3.1-flash-lite"]);
    assert.equal(seen[0][1], undefined, "для серии 3 temperature не задаём");
    globalThis.fetch = async () => new Response("boom", { status: 500 });
    await assert.rejects(() => m.askGuest({ GEMINI_API_KEY: "k" }, "gemini", [], "Russian"), /gemini-3\.6-flash: 500 boom.*gemini-3\.5-flash: 500/);
  } finally { globalThis.fetch = realFetch; }
});
