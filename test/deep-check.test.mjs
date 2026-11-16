import { test } from "node:test";
import assert from "node:assert/strict";
import { realLink, isOfficial, mergeDeep, parseTranslations, handleDeepCheck, DEEP_PRICE_ATOMIC, langOf } from "../src/deep-check.js";
import { saleConfig } from "../src/violin-sale.js";

// упрощённые копии помощников сайта (src/worker.js: sigOf, srcKey)
const sigOf = (t) => new Set(String(t).toLowerCase().replace(/[^a-zа-яёäöüß0-9 ]+/gi, " ").split(/\s+/).filter((x) => x.length >= 4).map((x) => x.slice(0, 6)));
const srcKey = (s) => String(s || "").toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "").slice(0, 24);
const NOW = Date.parse("2026-11-16T12:00:00Z"), H = 3600e3;
const PAY_TO = "0x1111111111111111111111111111111111111111";
const env = { X402_NETWORK: "eip155:84532", X402_FACILITATOR_URL: "https://facilitator.test", X402_PAY_TO: PAY_TO };
const bing = (u) => "http://www.bing.com/news/apiclick.aspx?ref=FexRss&url=" + encodeURIComponent(u) + "&mkt=en-us";

test("bing redirect is unwrapped and official sites are recognised", () => {
  assert.equal(realLink(bing("https://www.nbcnews.com/x")), "https://www.nbcnews.com/x");
  assert.equal(realLink("https://dw.com/a"), "https://dw.com/a");
  assert.ok(isOfficial("https://www.bundesregierung.de/breg-de/aktuelles"));
  assert.ok(isOfficial("https://www.ecb.europa.eu/press/pr/date/2026/html/x.en.html"));
  assert.ok(isOfficial("https://www.state.gov/x") && isOfficial("https://www.gov.uk/x"));
  assert.ok(!isOfficial("https://www.reuters.com/x") && !isOfficial("https://govnews.example.com/x"));
});

test("translations: original kept, junk dropped", () => {
  const t = parseTranslations('Sure: {"en":"Ukraine launches biggest drone attack","de":"Ukraine startet größten Drohnenangriff","ru":"x"}', "Украина запустила крупнейшую атаку дронов");
  assert.equal(langOf("Украина запустила"), "ru");
  assert.equal(t.ru, "Украина запустила крупнейшую атаку дронов");
  assert.equal(t.en, "Ukraine launches biggest drone attack"); assert.equal(t.de, "Ukraine startet größten Drohnenangriff");
  assert.deepEqual(Object.keys(parseTranslations("not json", "Some english headline here")), ["en"]);
});

test("merge across languages: dedupe outlets, earliest first, 7-day window, official separately", () => {
  const searches = [
    { lang: "en", text: "Ukraine launches biggest drone attack on Russia", items: [
      { title: "Ukraine launches biggest drone attack on Russia since war began", source: "NBC News", link: bing("https://nbcnews.com/a"), ts: NOW - 5 * H },
      { title: "Ukraine biggest drone attack Russia, ministry says", source: "Reuters", link: bing("https://reuters.com/a"), ts: NOW - 9 * H },
      { title: "Ukraine launches biggest drone attack on Russia", source: "Reuters", link: bing("https://reuters.com/b"), ts: NOW - 2 * H },
      { title: "Ukraine drone attack biggest Russia old", source: "Old Paper", link: "https://old.example/a", ts: NOW - 9 * 24 * H },
      { title: "Football results tonight", source: "Sport", link: "https://sport.example", ts: NOW - H } ] },
    { lang: "de", text: "Ukraine startet größten Drohnenangriff auf Russland", items: [
      { title: "Ukraine startet größten Drohnenangriff auf Russland seit Kriegsbeginn", source: "tagesschau.de", link: "https://tagesschau.de/a", ts: NOW - 4 * H },
      { title: "Größten Drohnenangriff Ukraine Russland: Erklärung", source: "Bundesregierung", link: "https://www.bundesregierung.de/x", ts: NOW - 3 * H } ] },
  ];
  const m = mergeDeep(searches, { sigOf, srcKey, now: NOW });
  assert.equal(m.outlets_found, 4); assert.equal(m.verdict, "confirmed");
  assert.deepEqual(m.languages_found.sort(), ["de", "en"]);
  assert.equal(m.earliest.outlet, "Reuters"); assert.equal(m.earliest.link, "https://reuters.com/a");
  assert.equal(m.official_sources.length, 1); assert.equal(m.official_sources[0].outlet, "Bundesregierung");
  assert.ok(!m.outlets.some((o) => o.outlet === "Old Paper" || o.outlet === "Sport"));
});

function ctx() { const jobs = []; return { jobs, waitUntil(p) { jobs.push(p); } }; }
function deps(over = {}) {
  const calls = { deep: 0, hits: [], logs: [] };
  return { calls, ctx: ctx(), agent: "unit", deep: async (t) => { calls.deep++; return { headline: t, verdict: "confirmed", outlets_found: 3 }; },
    hit: (...a) => calls.hits.push(a), log: (...a) => calls.logs.push(a), ...over };
}
const req = (q, headers = {}) => new Request("https://orbstudio.org/api/v1/check/deep" + q, { headers });
const pay = (cfg, amount = DEEP_PRICE_ATOMIC) => Buffer.from(JSON.stringify({ x402Version: 2, accepted: { scheme: "exact", network: cfg.network, amount, asset: cfg.net.asset, payTo: PAY_TO }, payload: { signature: "0x" + "11".repeat(65), authorization: {} } })).toString("base64");
function withFacilitator(answers, fn) {
  const orig = globalThis.fetch, seen = [];
  globalThis.fetch = async (url) => { const op = String(url).split("/").pop(); seen.push(op); const a = answers[op]; return new Response(JSON.stringify(a.body), { status: a.status || 200 }); };
  return fn(seen).finally(() => { globalThis.fetch = orig; });
}

test("402 with price 0.02 even without a headline (for catalog scanners), with a hint", async () => {
  const cfg = saleConfig(env), r = await handleDeepCheck(req(""), cfg, deps());
  assert.equal(r.status, 402);
  const pr = JSON.parse(Buffer.from(r.headers.get("PAYMENT-REQUIRED"), "base64").toString());
  assert.equal(pr.accepts[0].amount, "20000"); assert.equal(pr.resource.url, "https://orbstudio.org/api/v1/check/deep");
  assert.match((await r.json()).input_note, /headline/);
});

test("bad headline with a payment: 400, facilitator never called", async () => {
  const cfg = saleConfig(env);
  await withFacilitator({}, async (seen) => {
    const r = await handleDeepCheck(req("?headline=short", { "PAYMENT-SIGNATURE": pay(cfg) }), cfg, deps());
    assert.equal(r.status, 400); assert.deepEqual(seen, []);
  });
});

test("paid deep check: verify, build, settle, deliver, sale logged as check-deep", async () => {
  const cfg = saleConfig(env), d = deps();
  await withFacilitator({ verify: { body: { isValid: true, payer: "0xabc" } }, settle: { body: { success: true, transaction: "0x" + "cd".repeat(32), payer: "0xabc" } } }, async (seen) => {
    const r = await handleDeepCheck(req("?headline=" + encodeURIComponent("Ukraine launches biggest drone attack on Russia"), { "PAYMENT-SIGNATURE": pay(cfg) }), cfg, d);
    assert.equal(r.status, 200); assert.deepEqual(seen, ["verify", "settle"]);
    const j = await r.json(); assert.equal(j.verdict, "confirmed"); assert.equal(j.receipt.payer, "0xabc");
    assert.ok(r.headers.get("PAYMENT-RESPONSE"));
    await Promise.all(d.ctx.jobs);
    assert.equal(d.calls.logs[0][1].product, "check-deep"); assert.equal(d.calls.logs[0][1].usdc, 0.02);
  });
});

test("news search down: nothing is settled", async () => {
  const cfg = saleConfig(env), d = deps({ deep: async () => { throw new Error("news search unavailable"); } });
  await withFacilitator({ verify: { body: { isValid: true } }, settle: { body: { success: true } } }, async (seen) => {
    const r = await handleDeepCheck(req("?headline=" + encodeURIComponent("Ukraine launches biggest drone attack on Russia"), { "PAYMENT-SIGNATURE": pay(cfg) }), cfg, d);
    assert.equal(r.status, 503); assert.deepEqual(seen, ["verify"]);
  });
});

test("wrong amount (e.g. the 0.01 price) is rejected", async () => {
  const cfg = saleConfig(env);
  await withFacilitator({}, async (seen) => {
    const r = await handleDeepCheck(req("?headline=" + encodeURIComponent("Ukraine launches biggest drone attack on Russia"), { "PAYMENT-SIGNATURE": pay(cfg, "10000") }), cfg, deps());
    assert.equal(r.status, 402); assert.deepEqual(seen, []);
  });
});
