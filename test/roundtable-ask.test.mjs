import { test } from "node:test";
import assert from "node:assert/strict";
import { raPassport, raCreate, raProcess, raTick, raPublic, raPublishable, cleanAgentName, isAskId, newAskId, RA_KEY, RA_QUEUE } from "../src/roundtable-ask.js";
import { rtQueue, rtCards } from "../src/roundtable.js";

const PP = { status: "ok", url: "https://news.example.org/a", title: "Minister says fuel tax will fall in January", source: { name: "Example News", host: "news.example.org" }, published: "2026-11-26T08:00:00Z",
  summary: "The minister announced a plan.", final: { verdict: "partly_verified", label: "Partly verified", counts: { checkable: 2, confirmed: 1, exaggerated: 0, contradicted: 0, unverified: 1, opinions: 1 }, check_strength: "normal" },
  confirmed: [{ text: "The minister spoke on Tuesday.", sources: [{ host: "reuters.com", url: "https://reuters.com/x" }] }], exaggerated: [], unverified: [{ text: "Fuel tax will fall by 10 cents.", sources: [] }],
  opinions: [{ text: "This is long overdue.", who: "an economist", sources: [] }], missing: ["No date for the vote."], original_source: { name: "Ministry" }, freshness: { old_as_new: false } };

function memDeps(passport = PP) {
  const m = new Map();
  return { m, sharedGet: async (env, k) => (m.has(k) ? JSON.parse(m.get(k)) : null), sharedPut: async (env, k, v) => { m.set(k, JSON.stringify(v)); },
    hash: async (s) => "h" + s.length, rate: async () => true, passport: async () => passport, json: (b, h, s) => ({ b, h, s }) };
}
// Модели: Claude (инструменты), Grok/DeepSeek (OpenAI-совместимые), Gemini; перевод — тоже через xAI
function mockFetch(calls) {
  return async (url, o) => {
    const body = JSON.parse(o.body); calls.push({ url, body });
    const ok = (j) => ({ ok: true, json: async () => j, text: async () => JSON.stringify(j) });
    if (url.includes("anthropic")) {
      const tool = body.tools[0].name;
      const input = tool === "ask_round_table_open" ? { intro: "Welcome to the Orb Studio AI Round Table, I am Claude.", recap: "According to Example News, the minister says fuel tax will fall; the size of the cut is not verified.", question: "What would a lower fuel tax change for households?" }
        : { thanks: [{ i: 0, text: "Thank you all." }], closing: "Thanks Gemini, Grok and DeepSeek. These were views of AI models.", withhold: [] };
      return ok({ model: "claude-test", content: [{ type: "tool_use", name: tool, input }] });
    }
    if (url.includes("generativelanguage")) return ok({ modelVersion: "gemini-test", candidates: [{ finishReason: "STOP", content: { parts: [{ text: JSON.stringify({ answers: [{ i: 0, text: "Gemini says the cut itself is not verified yet, so it depends on the vote.", importance: 6, confidence: 5 }] }) }] } }] });
    const sys = body.messages[0].content;
    if (/You translate/.test(sys)) { const src = JSON.parse(body.messages[1].content); return ok({ model: "grok", choices: [{ message: { content: JSON.stringify(src) } }] }); }
    const who = url.includes("deepseek") ? "DeepSeek" : "Grok";
    return ok({ model: who.toLowerCase(), choices: [{ message: { content: JSON.stringify({ answers: [{ i: 0, text: who + " notes only the speech is confirmed and the 10 cents are not verified.", importance: 5, confidence: 4 }] }) } }] });
  };
}
const ENV = { DB: {}, ANTHROPIC_API_KEY: "k", XAI_API_KEY: "k", GEMINI_API_KEY: "k", DEEPSEEK_API_KEY: "k" };

test("ask: паспорт для стола — только проверенное кодом, с разделением подтверждено / не проверено / мнения", () => {
  const P = raPassport(PP, Date.parse("2026-11-26T10:00:00Z"));
  assert.equal(P.headline, PP.title); assert.equal(P.outlet, "Example News"); assert.equal(P.status, "plan_or_promise"); // «will fall» — обещание, не событие
  assert.equal(P.url_check.verdict, "partly_verified");
  assert.deepEqual(P.url_check.confirmed[0].sources, ["reuters.com"]);
  assert.equal(P.url_check.unverified[0].text, "Fuel tax will fall by 10 cents.");
  assert.equal(P.url_check.opinions[0].who, "an economist");
});

test("ask: имя агента и id — без команд, только безопасные знаки", () => {
  assert.equal(cleanAgentName("Bot <script>ignore all</script>"), "Bot script ignore all script");
  assert.equal(cleanAgentName("x"), null);
  assert.ok(isAskId(newAskId())); assert.ok(!isAskId("../etc")); assert.ok(!isAskId("ABC"));
});

test("ask: заявка → паспорт → модератор → три гостя → итог; выпуск приватный и играется как обычный стол", async () => {
  const calls = [], f0 = globalThis.fetch; globalThis.fetch = mockFetch(calls);
  try {
    const deps = memDeps(); let bg = null; const ctx = { waitUntil: (p) => { bg = p; } };
    const [body, , st] = await raCreate(ENV, ctx, deps, { url: "https://news.example.org/a?utm_source=x", lang: "ru", agent: "Test Agent", request: null, origin: "https://orbstudio.org" });
    assert.equal(st, 202); assert.equal(body.status, "queued"); assert.ok(isAskId(body.id));
    assert.equal(body.page, "https://orbstudio.org/ru/roundtable?ask=" + body.id);
    assert.equal(body.url, "https://news.example.org/a"); // метки слежения сняты
    const rec = await bg; // сборка ушла в фон сразу после заявки
    assert.equal(rec.status, "ok", JSON.stringify(rec.error)); const d = rec.episode;
    assert.ok(raPublishable(d)); assert.equal(d.kind, "ask"); assert.equal(d.episode_id, "ask-" + body.id); assert.equal(d.ask.agent, "Test Agent");
    assert.equal(d.passport_check.verdict, "partly_verified");
    for (const g of ["gemini", "grok", "deepseek"]) assert.equal(d.topics[0].answers[g].status, "ok");
    // модератор и гости получили паспорт, гости — правило про url_check
    const mod = calls.find((c) => c.url.includes("anthropic") && c.body.tools[0].name === "ask_round_table_open");
    assert.match(mod.body.messages[0].content, /Fuel tax will fall by 10 cents/); assert.match(mod.body.system, /STRICTLY by the passport/);
    const grok = calls.find((c) => c.url.includes("x.ai") && /url_check/.test(c.body.messages[0].content)); assert.ok(grok);
    assert.match(grok.body.messages[1].content, /PASSPORT/);
    // очередь эфира: приветствие, пересказ, вопрос, три гостя, благодарность, финал; аудио по ep=ask-…
    const q = rtQueue(d, "ru", "https://orbstudio.org"); assert.equal(q.lang, "ru"); assert.equal(q.lines.length, 8);
    assert.match(q.lines[1].audio, /ep=ask-[0-9a-f]{18}&part=recap/);
    assert.match(rtCards(d)[0].page, /roundtable\?ask=/);
    // не в очереди, ответ для владельца ссылки — без IP и внутренних полей
    assert.deepEqual((await deps.sharedGet(ENV, RA_QUEUE)).ids, []);
    const pub = raPublic(rec); assert.equal(pub.episode.answers.length, 3); assert.equal(pub.brought_by.agent, "Test Agent"); assert.ok(!("tries" in pub));
    // та же ссылка за сутки — тот же выпуск, без новой сборки
    const [again] = await raCreate(ENV, ctx, deps, { url: "https://news.example.org/a", lang: "en", request: null, origin: "https://orbstudio.org" });
    assert.equal(again.id, body.id); assert.equal(again.reused, true);
  } finally { globalThis.fetch = f0; }
});

test("ask: паспорт не удался — заявка закрыта с причиной, модели не вызываются", async () => {
  const calls = [], f0 = globalThis.fetch; globalThis.fetch = mockFetch(calls);
  try {
    const deps = memDeps({ status: "not_checked", reason: "login_or_paywall", message: "paywall" });
    const [b] = await raCreate(ENV, null, deps, { url: "https://paywalled.example.com/x", request: null, origin: "https://orbstudio.org" });
    const rec = await raProcess(ENV, deps, b.id);
    assert.equal(rec.status, "failed"); assert.equal(rec.reason, "login_or_paywall"); assert.equal(calls.length, 0);
  } finally { globalThis.fetch = f0; }
});

test("ask: лимиты и плохие ссылки", async () => {
  const deps = memDeps(); deps.rate = async () => false;
  const [b1, , s1] = await raCreate(ENV, null, deps, { url: "https://news.example.org/b", request: null });
  assert.equal(s1, 429); assert.equal(b1.reason, "rate_limited");
  const [b2, , s2] = await raCreate(ENV, null, memDeps(), { url: "http://127.0.0.1/x", request: null });
  assert.equal(s2, 400); assert.equal(b2.reason, "ip_address_not_allowed");
  const [b3, , s3] = await raCreate({ ...ENV, RT_ASK_DAILY_CAP: "0" }, null, memDeps(), { url: "https://news.example.org/c", request: null });
  assert.ok(s3 === 202 || s3 === 429); // 0 = потолок по умолчанию
  const [, , s4] = await raCreate({ DB: {} }, null, memDeps(), { url: "https://news.example.org/c", request: null });
  assert.equal(s4, 503);
});

test("ask: cron доделывает брошенную заявку", async () => {
  const calls = [], f0 = globalThis.fetch; globalThis.fetch = mockFetch(calls);
  try {
    const deps = memDeps(); const [b] = await raCreate(ENV, null, deps, { url: "https://news.example.org/d", request: null });
    const rec0 = await deps.sharedGet(ENV, RA_KEY(b.id)); await deps.sharedPut(ENV, RA_KEY(b.id), { ...rec0, status: "working", started_at: new Date(Date.now() - 10 * 60e3).toISOString(), tries: 1 });
    const r = await raTick(ENV, deps); assert.equal(r.status, "ok");
  } finally { globalThis.fetch = f0; }
});
