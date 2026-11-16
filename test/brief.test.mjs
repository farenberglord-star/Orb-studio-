import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildBrief, handleBrief, verdictOf, BRIEF_PRICE_ATOMIC } from "../src/brief.js";
import { saleConfig } from "../src/violin-sale.js";

const IN = JSON.parse(readFileSync(new URL("./fixtures/brief-inputs.json", import.meta.url)));
const TITLES = { geo: "Geo radar", crypto: "Crypto radar", energy: "Energy radar" };
const PAY_TO = "0x1111111111111111111111111111111111111111";
const env = { X402_NETWORK: "eip155:84532", X402_FACILITATOR_URL: "https://facilitator.test", X402_PAY_TO: PAY_TO };

function ctx() { const jobs = []; return { jobs, waitUntil(p) { jobs.push(p); } }; }
const brief = (tier = "delayed") => buildBrief({ ...IN, titles: TITLES, tier, wide: tier === "fresh", counts: IN.radars.map(() => [3, 1]), now: Date.parse("2026-11-16T12:00:00Z") });
function deps(over = {}) {
  const calls = { hits: [], logs: [], fresh: 0 };
  return { calls, ctx: ctx(), agent: "unit", free: async () => brief(), fresh: async () => { calls.fresh++; return brief("fresh"); },
    hit: (page, kind, name) => calls.hits.push([page, kind, name]), log: (kind, d) => calls.logs.push([kind, d]), ...over };
}
const req = (path, headers = {}) => new Request("https://orbstudio.org" + path, { headers });
const pay = (accepted) => Buffer.from(JSON.stringify({ x402Version: 2, accepted, payload: { signature: "0x" + "11".repeat(65), authorization: {} } })).toString("base64");

test("verdict thresholds", () => {
  assert.equal(verdictOf(null), null); assert.equal(verdictOf(1), "single_source"); assert.equal(verdictOf(2), "two_sources"); assert.equal(verdictOf(5), "confirmed");
});

test("brief covers all radars and main sensors in a compact text", () => {
  const b = brief();
  assert.equal(b.radars.length, IN.radars.length);
  for (const r of IN.radars) assert.match(b.text, new RegExp(`\\[${r.id}\\]: ${r.lvl} `));
  for (const h of ["## Markets", "## Energy", "## Networks", "## Other sensors", "BTC ", "ECB deposit rate", "Earthquakes M4.5+"]) assert.ok(b.text.includes(h), h);
  assert.ok(b.text.includes("confirmed (3)") && b.text.includes("single_source (1)"));
  assert.ok(b.approx_tokens < 2500, "too long: " + b.approx_tokens);
  assert.ok(b.text.includes("/api/v1/brief/fresh"), "free version advertises the paid one");
  // радары отсортированы по риску
  const lv = b.radars.map((r) => r.risk_index); assert.deepEqual(lv, [...lv].sort((a, c) => c - a));
});

test("brief survives missing sensors", () => {
  const b = buildBrief({ radars: [], sensors: null, quakes: null });
  assert.ok(b.text.startsWith("# Orb Studio world brief"));
  assert.deepEqual(b.radars, []);
});

test("free endpoint returns the cached brief, json and text", async () => {
  const cfg = saleConfig(env), d = deps();
  const r = await handleBrief(req("/api/v1/brief"), cfg, d);
  assert.equal(r.status, 200);
  const j = await r.json();
  assert.equal(j.tier, "delayed"); assert.equal(j.fresh_version.price_usdc, 0.01); assert.equal(d.calls.fresh, 0);
  const t = await handleBrief(req("/api/v1/brief?format=text"), cfg, deps());
  assert.match(t.headers.get("content-type"), /text\/markdown/);
  assert.ok((await t.text()).startsWith("# Orb Studio world brief"));
});

test("fresh endpoint: 503 when the sale is closed, 402 challenge when open", async () => {
  const closed = await handleBrief(req("/api/v1/brief/fresh"), saleConfig({}), deps());
  assert.equal(closed.status, 503);
  const d = deps(), r = await handleBrief(req("/api/v1/brief/fresh"), saleConfig(env), d);
  assert.equal(r.status, 402);
  const pr = JSON.parse(Buffer.from(r.headers.get("PAYMENT-REQUIRED"), "base64").toString());
  assert.equal(pr.accepts[0].amount, BRIEF_PRICE_ATOMIC); assert.equal(pr.accepts[0].payTo, PAY_TO);
  assert.equal(pr.resource.url, "https://orbstudio.org/api/v1/brief/fresh");
  assert.deepEqual(d.calls.hits[0], ["/api/v1/brief/fresh", "x402", "challenge · unit"]);
  assert.equal(d.calls.fresh, 0);
});

test("wrong amount is rejected without calling the facilitator", async () => {
  const cfg = saleConfig(env), acc = { scheme: "exact", network: cfg.network, amount: "1", asset: cfg.net.asset, payTo: PAY_TO };
  const orig = globalThis.fetch; let called = 0; globalThis.fetch = async () => { called++; throw new Error("no"); };
  try { const r = await handleBrief(req("/api/v1/brief/fresh", { "PAYMENT-SIGNATURE": pay(acc) }), cfg, deps()); assert.equal(r.status, 402); assert.equal(called, 0); }
  finally { globalThis.fetch = orig; }
});

function withFacilitator(answers, fn) {
  const orig = globalThis.fetch, seen = [];
  globalThis.fetch = async (url) => { const op = String(url).split("/").pop(); seen.push(op); const a = answers[op]; return new Response(JSON.stringify(a.body), { status: a.status || 200 }); };
  return fn(seen).finally(() => { globalThis.fetch = orig; });
}
const goodAcc = (cfg) => ({ scheme: "exact", network: cfg.network, amount: BRIEF_PRICE_ATOMIC, asset: cfg.net.asset, payTo: PAY_TO });

test("valid payment: build, settle, deliver with receipt and log the sale", async () => {
  const cfg = saleConfig(env), d = deps();
  await withFacilitator({ verify: { body: { isValid: true, payer: "0xabc" } }, settle: { body: { success: true, transaction: "0x" + "ab".repeat(32), network: cfg.network, payer: "0xabc" } } }, async (seen) => {
    const r = await handleBrief(req("/api/v1/brief/fresh", { "PAYMENT-SIGNATURE": pay(goodAcc(cfg)) }), cfg, d);
    assert.equal(r.status, 200); assert.deepEqual(seen, ["verify", "settle"]);
    const j = await r.json(); assert.equal(j.tier, "fresh"); assert.equal(j.receipt.payer, "0xabc");
    assert.ok(r.headers.get("PAYMENT-RESPONSE"));
    await Promise.all(d.ctx.jobs);
    assert.equal(d.calls.logs[0][0], "sale"); assert.equal(d.calls.logs[0][1].product, "brief"); assert.equal(d.calls.logs[0][1].usdc, 0.01);
    assert.deepEqual(d.calls.hits.find((h) => h[1] === "x402-sale"), ["/api/v1/brief/fresh", "x402-sale", "unit · 0xabc"]);
  });
});

test("if the brief cannot be built, nothing is settled", async () => {
  const cfg = saleConfig(env), d = deps({ fresh: async () => { throw new Error("feeds down"); } });
  await withFacilitator({ verify: { body: { isValid: true, payer: "0xabc" } }, settle: { body: { success: true } } }, async (seen) => {
    const r = await handleBrief(req("/api/v1/brief/fresh", { "PAYMENT-SIGNATURE": pay(goodAcc(cfg)) }), cfg, d);
    assert.equal(r.status, 503); assert.deepEqual(seen, ["verify"]);
  });
});

test("invalid payment from verify returns a new challenge", async () => {
  const cfg = saleConfig(env), d = deps();
  await withFacilitator({ verify: { body: { isValid: false, invalidReason: "insufficient_funds" } } }, async (seen) => {
    const r = await handleBrief(req("/api/v1/brief/fresh", { "PAYMENT-SIGNATURE": pay(goodAcc(cfg)) }), cfg, d);
    assert.equal(r.status, 402); assert.deepEqual(seen, ["verify"]);
    assert.match((await r.json()).error, /insufficient_funds/);
  });
});
