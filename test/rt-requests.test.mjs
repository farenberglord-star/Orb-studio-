import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { rqKind, rqId, rqPassportFrom, rqSubmit, rqProcess, rqTick, rqFind, rqHandle, RQ_PER_IP_DAY, RQ_QUEUE_CAP, RQ_YT_DAILY } from "../src/rt-requests.js";
import { rtFind, rtQueue } from "../src/roundtable.js";

// D1 из SQLite в памяти
function fakeDb() {
  const db = new DatabaseSync(":memory:");
  const wrap = (sql, args = []) => ({
    bind: (...a) => wrap(sql, a),
    run: async () => { const r = db.prepare(sql).run(...args); return { meta: { changes: Number(r.changes) } }; },
    first: async () => { const r = db.prepare(sql).get(...args); return r ? { ...r } : null; },
    all: async () => ({ results: db.prepare(sql).all(...args).map((x) => ({ ...x })) }),
  });
  return { prepare: (sql) => wrap(sql) };
}
const req = (ip = "1.1.1.1", ua = "Mozilla/5.0") => ({ method: "POST", headers: { get: (k) => ({ "cf-connecting-ip": ip, "user-agent": ua })[k.toLowerCase()] || null } });
const ctx = () => ({ jobs: [], waitUntil(p) { this.jobs.push(p); } });
const json = (b, h, st = 200) => ({ body: b, status: st });
const okBody = { status: "ok", title: "Port strike ends after two days", source: { name: "Example News", host: "example.com" }, url: "https://example.com/a", published: new Date().toISOString(), summary: "Dock workers ended a two-day strike after a deal on pay.", confirmed: [{ text: "Strike ended on Tuesday" }], exaggerated: [], opinions: [], unverified: [{ text: "Cost of 40 million" }], missing: [], verdict: "partly_confirmed", final: { stale_news: false } };
const deps = (over = {}) => ({ autoStart: false, json, classifyAgent: () => null, urlPassport: async () => ({ http: 200, body: okBody }), ...over });

function mockFetch({ reject = false, guestFail = [] } = {}) {
  const calls = [];
  globalThis.fetch = async (url, init) => {
    const b = init && init.body ? JSON.parse(init.body) : {}; calls.push(String(url));
    if (String(url).includes("api.anthropic.com")) {
      const name = b.tools[0].name;
      const input = name === "round_table_request"
        ? (reject ? { ok: false, reject_reason: "advertisement", headline: "", recap: "", question: "", intro: "" }
          : { ok: true, reject_reason: "", headline: "Port strike ends after two days", recap: "Example News reports that dock workers ended a strike. One figure is not confirmed.", question: "What is confirmed here, and what is still unclear?", intro: "Welcome to a special round table. A viewer sent us this story." })
        : { thanks: [{ i: 0, text: "Thank you all, the views meet on the strike but differ on cost." }], closing: "Thank you Gemini, Grok and DeepSeek. Send your own story and write in the comments.", withhold: [] };
      return new Response(JSON.stringify({ model: "claude-test", content: [{ type: "tool_use", name, input }] }), { status: 200 });
    }
    const sys = (b.messages && b.messages[0] && b.messages[0].content) || "";
    if (String(url).includes("x.ai/v1/chat") && /You translate/.test(sys)) {
      const src = JSON.parse(b.messages[1].content);
      const out = { intro: "Willkommen " + src.intro, closing: "Danke " + src.closing, topics: src.topics.map((t) => ({ i: t.i, recap: "Zusammenfassung " + t.recap, question: "Frage " + t.question, thanks: "Danke " + t.thanks, answers: Object.fromEntries(Object.entries(t.answers).map(([g, x]) => [g, "Antwort " + x])) })) };
      return new Response(JSON.stringify({ model: "grok-test", choices: [{ message: { content: JSON.stringify(out) } }] }), { status: 200 });
    }
    const guest = String(url).includes("x.ai") ? "grok" : String(url).includes("deepseek") ? "deepseek" : "gemini";
    if (guestFail.includes(guest)) return new Response("boom", { status: 500 });
    const ans = JSON.stringify({ answers: [{ i: 0, text: guest + " says: the strike is over, the cost figure is unverified, and details are still unclear.", importance: 5, confidence: 6 }] });
    if (guest === "gemini") return new Response(JSON.stringify({ modelVersion: "gem-test", candidates: [{ finishReason: "STOP", content: { parts: [{ text: ans }] } }] }), { status: 200 });
    return new Response(JSON.stringify({ model: guest + "-test", choices: [{ message: { content: ans } }] }), { status: 200 });
  };
  return calls;
}
const KEYS = { ANTHROPIC_API_KEY: "a", XAI_API_KEY: "x", GEMINI_API_KEY: "g", DEEPSEEK_API_KEY: "d" };

test("ссылка → один и тот же выпуск, метки слежения не в счёт; YouTube отличается от статьи", async () => {
  assert.equal(await rqId("https://example.com/a?utm_source=x"), await rqId("http://www.example.com/a/#top"));
  assert.notEqual(await rqId("https://example.com/a"), await rqId("https://example.com/b"));
  assert.match(await rqId("https://example.com/a"), /^rq[0-9a-f]{12}$/);
  assert.equal(rqKind("https://youtu.be/dQw4w9WgXcQ"), "youtube"); assert.equal(rqKind("https://example.com/a"), "article");
});

test("паспорт запроса: слово-правило + проверка по ссылке; без проверки — честное «не проверено»", () => {
  const a = rqPassportFrom(okBody, okBody.title, "Example News", okBody.published, okBody.url);
  assert.equal(a.outlets, 1); assert.equal(a.checked.verdict, "partly_confirmed"); assert.deepEqual(a.checked.confirmed, ["Strike ended on Tuesday"]);
  const v = rqPassportFrom(null, "Interview: Putin says war will end", "Channel", null, "https://youtu.be/x");
  assert.equal(v.checked.verdict, "not_checked"); assert.ok(v.status);
});

test("приём: плохие ссылки, свой сайт, дубль, лимит с адреса, очередь, видео", async () => {
  const env = { DB: fakeDb(), ...KEYS }, c = ctx();
  assert.equal((await rqSubmit(req(), env, c, deps(), { url: "" })).http, 400);
  assert.equal((await rqSubmit(req(), env, c, deps(), { url: "http://127.0.0.1/admin" })).http, 400);
  assert.equal((await rqSubmit(req(), env, c, deps(), { url: "https://orbstudio.org/roundtable" })).http, 400);
  assert.equal((await rqSubmit(req(), env, c, deps(), { url: "https://example.com/a", name: "see https://spam.example" })).http, 400, "ссылки в имени нельзя");
  const r1 = await rqSubmit(req(), env, { waitUntil() {} }, deps(), { url: "https://example.com/a?utm_source=tw", name: "Anna" });
  assert.equal(r1.http, 202); assert.equal(r1.body.status, "queued"); assert.match(r1.body.page, /roundtable\?ep=rq/);
  const dup = await rqSubmit(req("2.2.2.2"), env, { waitUntil() {} }, deps(), { url: "https://www.example.com/a" });
  assert.equal(dup.http, 200); assert.equal(dup.body.already, true); assert.equal(dup.body.id, r1.body.id);
  for (let i = 0; i < RQ_PER_IP_DAY - 1; i++) assert.equal((await rqSubmit(req(), env, { waitUntil() {} }, deps(), { url: "https://example.com/p" + i })).http, 202);
  const lim = await rqSubmit(req(), env, { waitUntil() {} }, deps(), { url: "https://example.com/zzz" });
  assert.equal(lim.http, 429, "четвёртый запрос с адреса за сутки");
  // очередь: с разных адресов, пока не переполнится
  let last = null; for (let i = 0; i < 20; i++) { last = await rqSubmit(req("9.9.9." + i), env, { waitUntil() {} }, deps(), { url: "https://example.org/q" + i }); if (last.http === 429) break; }
  assert.equal(last.http, 429); assert.match(last.body.error, /queue is full|today's limit/);
});

test("видео: суточный потолок отдельный", async () => {
  const env = { DB: fakeDb(), ...KEYS };
  for (let i = 0; i < RQ_YT_DAILY; i++) assert.equal((await rqSubmit(req("3.3.3." + i), env, { waitUntil() {} }, deps(), { url: "https://youtu.be/AAAAAAAAA0" + i })).http, 202);
  const r = await rqSubmit(req("4.4.4.4"), env, { waitUntil() {} }, deps(), { url: "https://youtu.be/AAAAAAAAA09" });
  assert.equal(r.http, 429); assert.match(r.body.error, /video/);
});

test("сборка: паспорт → модератор → три гостя → перевод; карточка читается, играется и попадает «следом»", async () => {
  mockFetch(); const env = { DB: fakeDb(), ...KEYS };
  const r = await rqSubmit(req(), env, { waitUntil() {} }, deps(), { url: "https://example.com/a", name: "Anna" });
  assert.equal(await rqProcess(env, deps(), r.body.id), "ready");
  const d = await rqFind(env, r.body.id);
  assert.equal(d.episode_id, r.body.id); assert.equal(d.kind, "viewer_request"); assert.equal(d.topics.length, 1);
  assert.equal(d.topics[0].passport.checked.verdict, "partly_confirmed");
  assert.ok(["gemini", "grok", "deepseek"].every((g) => d.topics[0].answers[g].status === "ok"));
  assert.ok(d.translations.de && d.translations.de.topics[0].answers.grok);
  assert.equal(d.request.by, "visitor"); assert.equal(d.request.name, "Anna");
  const q = rtQueue(d, "de", "https://orbstudio.org"); assert.ok(q.lines.length >= 7 && q.lines[0].part === "intro");
  assert.equal((await rtFind(env, { rqFind, sharedGet: async () => null }, r.body.id)).episode_id, r.body.id, "аудио и страница находят карточку через rtFind");
  assert.equal(await rtFind(env, { rqFind, sharedGet: async () => null }, "rq000000000000"), null);
  // «следом»: не виденная зрителем карточка; виденная не повторяется
  const get = (qs) => rqHandle({ method: "GET", headers: { get: () => null } }, env, ctx(), new URL("https://orbstudio.org/api/v1/roundtable/requests" + qs), deps());
  const n1 = (await get("?next=1&lang=de")).body; assert.equal(n1.status, "ok"); assert.equal(n1.episode_id, r.body.id); assert.ok(n1.queue.lines.length);
  assert.equal((await get("?next=1&seen=" + r.body.id)).body.status, "none");
  const list = (await get("")).body; assert.equal(list.requests.length, 1); assert.equal(list.requests[0].title, "Port strike ends after two days");
  assert.equal(JSON.stringify(list).includes("iph"), false, "адрес зрителя не раскрывается");
});

test("модератор отклоняет неподходящее: статус rejected, в эфир не идёт, ответ гостям не тратится", async () => {
  const calls = mockFetch({ reject: true }); const env = { DB: fakeDb(), ...KEYS };
  const r = await rqSubmit(req(), env, { waitUntil() {} }, deps(), { url: "https://example.com/ad" });
  assert.equal(await rqProcess(env, deps(), r.body.id), "rejected");
  assert.equal(calls.filter((u) => /x\.ai|deepseek|googleapis/.test(u)).length, 0);
  assert.equal(await rqFind(env, r.body.id), null);
  const st = (await rqHandle({ method: "GET", headers: { get: () => null } }, env, ctx(), new URL("https://orbstudio.org/api/v1/roundtable/request?id=" + r.body.id), deps())).body;
  assert.equal(st.status, "rejected"); assert.equal(st.reason, "advertisement");
});

test("страница не прочиталась или гости не ответили — failed, повтор через час; cron подбирает очередь", async () => {
  mockFetch(); const env = { DB: fakeDb(), ...KEYS };
  const bad = deps({ urlPassport: async () => ({ http: 200, body: { status: "not_checked", reason: "captcha_or_paywall" } }) });
  const r = await rqSubmit(req(), env, { waitUntil() {} }, bad, { url: "https://example.com/paywall" });
  assert.equal(await rqProcess(env, bad, r.body.id), "failed");
  const again = await rqSubmit(req("5.5.5.5"), env, { waitUntil() {} }, deps(), { url: "https://example.com/paywall" });
  assert.equal(again.http, 200); assert.equal(again.body.status, "failed"); assert.ok(again.body.retry_after_minutes > 0);
  mockFetch({ guestFail: ["grok", "deepseek"] });
  const r2 = await rqSubmit(req("6.6.6.6"), env, { waitUntil() {} }, deps(), { url: "https://example.com/b" });
  assert.equal(await rqProcess(env, deps(), r2.body.id), "failed", "ответил один гость из трёх — в эфир нельзя");
  mockFetch(); const r3 = await rqSubmit(req("7.7.7.7"), env, { waitUntil() {} }, deps(), { url: "https://example.com/c" });
  await rqTick(env, deps()); assert.equal((await rqHandle({ method: "GET", headers: { get: () => null } }, env, ctx(), new URL("https://orbstudio.org/api/v1/roundtable/request?id=" + r3.body.id), deps())).body.status, "ready");
});

test("одновременно в работу берётся один и тот же запрос только один раз", async () => {
  mockFetch(); const env = { DB: fakeDb(), ...KEYS };
  const r = await rqSubmit(req(), env, { waitUntil() {} }, deps(), { url: "https://example.com/once" });
  const [a, b] = await Promise.all([rqProcess(env, deps(), r.body.id), rqProcess(env, deps(), r.body.id)]);
  assert.deepEqual([a, b].filter(Boolean), ["ready"]); assert.equal([a, b].filter((x) => x === null).length, 1);
});

test("страница: форма, три языка, переход к следующей карточке и ссылка на выпуск", async () => {
  const { readFileSync } = await import("node:fs");
  const { T } = await import("../public/roundtable.js");
  const html = readFileSync(new URL("../public/roundtable.html", import.meta.url), "utf8"), js = readFileSync(new URL("../public/roundtable.js", import.meta.url), "utf8");
  for (const id of ["rq-f", "rq-url", "rq-name", "rq-go", "rq-msg", "rq-list", "rq-list-h"]) assert.ok(html.includes('id="' + id + '"'), id);
  for (const l of ["en", "ru", "de"]) for (const k of ["rqH", "rqSub", "rqUrl", "rqName", "rqGo", "rqQueued", "rqReady", "rqRej", "rqFail", "rqErr", "rqList", "rqEmpty", "rqLabel", "rqNote"]) assert.ok(T[l][k], l + "." + k);
  assert.match(js, /nextReq\(\)/); assert.match(js, /requests\?next=1/);
  assert.ok(html.indexOf('id="rq"') < html.indexOf('id="krb"'), "форма стоит до баннеров");
  assert.match(html, /go\/kraken/); assert.match(html, /go\/starlink/);
});
