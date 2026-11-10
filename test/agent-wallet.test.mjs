import assert from "node:assert/strict";
import { decide, summarizeLedger, walletRules, agentWallet } from "../src/agent-wallet.js";
const rules = walletRules({}), now = Date.UTC(2026, 10, 7, 12);
const ok = { resource_url: "https://api.example.com/data", amount_usdc: 0.03, reason: "Test of a paid weather feed for the news radar", network: "eip155:8453", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", pay_to: "0x" + "ab".repeat(20) };
assert.equal(rules.limits_enabled, false);
assert.equal(decide(rules, [], ok, now).ok, false);
assert.equal(decide(rules, [], ok, now).screened, true);                                  // бюджет сам по себе не разрешает покупку
assert.equal(decide(rules, [], { ...ok, amount_usdc: 0.06 }, now).screened, true);        // экспериментальный потолок не включён
assert.equal(decide({ ...rules, limits_enabled: true }, [], { ...ok, amount_usdc: 0.06 }, now).ok, false);
assert.equal(decide(rules, [], { ...ok, resource_url: "http://x.com/a" }, now).ok, false);
assert.equal(decide(rules, [], { ...ok, resource_url: "https://127.0.0.1/a" }, now).ok, false);
assert.equal(decide(rules, [], { ...ok, resource_url: "https://8.8.8.8/a" }, now).ok, false);
assert.equal(decide(rules, [], { ...ok, resource_url: "https://printer.local/a" }, now).ok, false);
assert.equal(decide(rules, [], { ...ok, reason: "x" }, now).ok, false);
assert.equal(decide({ ...rules, allowed_hosts: ["a.com"] }, [], ok, now).ok, false);
const spent = Array.from({ length: 40 }, (_, i) => ({ id: "x" + i, t: now - 1000, outcome: "bought", amount_usdc: 0.05, host: "h" }));
assert.equal(decide({ ...rules, limits_enabled: true }, spent, ok, now).ok, false);
assert.equal(decide(rules, spent, ok, now).screened, true);
{ // бюджет эксперимента: 0,02 за покупку, 10 всего, срок до 11.11.2026 09:15 по Берлину
  const exp = walletRules({ AGENT_LIMITS_ENABLED: "1", AGENT_MAX_PURCHASE_USD: "0.02", AGENT_DAILY_CAP_USD: "2", AGENT_TOTAL_CAP_USD: "10", AGENT_EXPIRES_AT: "2026-11-11T08:15:00Z" });
  const cheap = { ...ok, amount_usdc: 0.01 };
  assert.equal(exp.total_usdc, 10); assert.equal(exp.expires_at, "2026-11-11T08:15:00.000Z");
  assert.equal(decide(exp, [], cheap, now).screened, true);
  assert.equal(decide(exp, [], { ...ok, amount_usdc: 0.03 }, now).ok, false);
  assert.match(decide(exp, [], cheap, Date.UTC(2026, 10, 11, 8, 15)).reason, /period ended/);
  assert.equal(decide(exp, [], cheap, Date.UTC(2026, 10, 11, 8, 14)).screened, true);
  const old = Array.from({ length: 500 }, (_, i) => ({ id: "o" + i, t: now - (2 + (i % 3)) * 864e5, outcome: "bought", amount_usdc: 0.02, host: "h" })); // 10 USDC за прошлые дни
  assert.match(decide(exp, old, cheap, now).reason, /total experiment budget/);
  assert.match(decide(exp, [{ id: "p", t: now - 864e5, outcome: "pending", amount_usdc: 9.995, resource_url: "https://z.example/x" }], cheap, now).reason, /total experiment budget/);
}
assert.equal(summarizeLedger(spent, now).spent_today_usdc, 2);
assert.equal(summarizeLedger(spent, now + 864e5).spent_today_usdc, 0);
// API: чтение открыто, запись только с ключом
const mem = {}; const deps = { sharedGet: async (e, k) => mem[k] || null, sharedPut: async (e, k, v) => { mem[k] = v; } };
const env = { AGENT_LEDGER_KEY: "k".repeat(24), AGENT_APPROVAL_KEY: "p".repeat(24), AGENT_WALLET_ADDRESS: "0x" + "a".repeat(40) };
const call = (path, method, body, key, approval) => agentWallet(new Request("https://x" + path, { method, headers: { "content-type": "application/json", ...(key ? { "x-agent-key": key } : {}), ...(approval ? { "x-approval-key": approval } : {}) }, body: body ? JSON.stringify(body) : undefined }), env, deps);
assert.equal((await call("/api/v1/agent-wallet", "GET")).status, 200);
assert.equal((await call("/api/v1/agent-wallet/authorize", "POST", ok)).status, 401);
const noGrant = await (await call("/api/v1/agent-wallet/authorize", "POST", ok, env.AGENT_LEDGER_KEY)).json();
assert.equal(noGrant.approved, false);
assert.equal((await call("/api/v1/agent-wallet/approve", "POST", ok, env.AGENT_LEDGER_KEY)).status, 401);
const approved = await (await call("/api/v1/agent-wallet/approve", "POST", ok, "", env.AGENT_APPROVAL_KEY)).json();
assert.equal(approved.state, "open");
const a = await (await call("/api/v1/agent-wallet/authorize", "POST", ok, env.AGENT_LEDGER_KEY)).json(); assert.equal(a.approved, true);
assert.equal(a.pay_to, ok.pay_to);
const bad = await call("/api/v1/agent-wallet/result", "POST", { id: a.id, outcome: "bought" }, env.AGENT_LEDGER_KEY); assert.equal(bad.status, 400); // без tx
const tx = "0x" + "ab".repeat(32);
assert.equal((await call("/api/v1/agent-wallet/result", "POST", { id: a.id, outcome: "bought", tx_hash: tx, got: "JSON with 3 cities", useful: "partly" }, env.AGENT_LEDGER_KEY)).status, 200);
assert.equal((await call("/api/v1/agent-wallet/result", "POST", { id: a.id, outcome: "bought", tx_hash: tx }, env.AGENT_LEDGER_KEY)).status, 409); // дважды нельзя
const g = await (await call("/api/v1/agent-wallet", "GET")).json();
assert.equal(g.summary.purchases, 1); assert.equal(g.summary.spent_total_usdc, 0.03); assert.equal(g.entries[0].tx_url, "https://basescan.org/tx/" + tx);
const r = await (await call("/api/v1/agent-wallet/authorize", "POST", { ...ok, amount_usdc: 9 }, env.AGENT_LEDGER_KEY)).json(); assert.equal(r.approved, false);
const other = { ...ok, resource_url: "https://api.example.com/other" };
assert.equal((await call("/api/v1/agent-wallet/approve", "POST", other, "", env.AGENT_APPROVAL_KEY)).status, 200);
const p = await (await call("/api/v1/agent-wallet/authorize", "POST", other, env.AGENT_LEDGER_KEY)).json();
assert.equal(p.approved, true);
assert.equal((await call("/api/v1/agent-wallet/result", "POST", { id: p.id, outcome: "pending", error: "202" }, env.AGENT_LEDGER_KEY)).status, 200);
assert.equal((await call("/api/v1/agent-wallet/result", "POST", { id: p.id, outcome: "failed", error: "give up" }, env.AGENT_LEDGER_KEY)).status, 409);
const again = await (await call("/api/v1/agent-wallet/authorize", "POST", other, env.AGENT_LEDGER_KEY)).json();
assert.equal(again.approved, false);
console.log("agent-wallet: ok");
{ // автономный режим с 10.11.2026: 1,5 за покупку, 10 всего, 30 дней, без одноразового ключа
  const au = walletRules({ AGENT_LIMITS_ENABLED: "1", AGENT_AUTONOMOUS: "1", AGENT_MAX_PURCHASE_USD: "1.5", AGENT_DAILY_CAP_USD: "10", AGENT_TOTAL_CAP_USD: "10", AGENT_EXPIRES_AT: "2026-12-10T08:00:00Z" });
  const t0 = Date.UTC(2026, 10, 10, 8), buy = { ...ok, amount_usdc: 1.5 };
  assert.equal(au.autonomous, true);
  assert.equal(decide(au, [], buy, t0).ok, true);                                                     // сам решает, без одобрения
  assert.equal(decide(au, [], { ...buy, amount_usdc: 1.51 }, t0).ok, false);                          // потолок на покупку
  assert.equal(decide({ ...au, autonomous: false }, [], buy, t0).screened, true);                     // без флага прежняя схема
  assert.equal(decide({ ...au, limits_enabled: false }, [], buy, t0).screened, true);                 // выключатель: без лимитов автономии нет
  assert.match(decide(au, [], buy, Date.UTC(2026, 11, 10, 8)).reason, /period ended/);                // срок
  assert.equal(decide(au, [], { ...buy, network: "eip155:1" }, t0).ok, false);                        // только Base
  assert.equal(decide(au, [], { ...buy, asset: "0x" + "1".repeat(40) }, t0).ok, false);               // только USDC
  assert.equal(decide(au, [], { ...buy, pay_to: "nope" }, t0).ok, false);                             // адрес продавца обязателен
  assert.equal(decide(au, [], { ...buy, reason: "x" }, t0).ok, false);                                // причина обязательна
  assert.equal(decide(au, [], { ...buy, resource_url: "https://127.0.0.1/x" }, t0).ok, false);
  const spent9 = Array.from({ length: 6 }, (_, i) => ({ id: "s" + i, t: t0 - 864e5, outcome: "bought", amount_usdc: 1.5, host: "h" })); // 9 USDC
  assert.equal(decide(au, spent9, { ...buy, amount_usdc: 1 }, t0).ok, true);
  assert.match(decide(au, spent9, buy, t0).reason, /total experiment budget/);                         // 9 + 1,5 > 10
  // через API: без одобрения, запись в журнал с пометкой autonomous
  const mem2 = {}, deps2 = { sharedGet: async (e, k) => mem2[k] || null, sharedPut: async (e, k, v) => { mem2[k] = v; } };
  const env2 = { ...env, AGENT_LIMITS_ENABLED: "1", AGENT_AUTONOMOUS: "1", AGENT_MAX_PURCHASE_USD: "1.5", AGENT_DAILY_CAP_USD: "10", AGENT_TOTAL_CAP_USD: "10", AGENT_EXPIRES_AT: "2099-01-01T00:00:00Z" };
  const c2 = (path, body) => agentWallet(new Request("https://x" + path, { method: "POST", headers: { "content-type": "application/json", "x-agent-key": env2.AGENT_LEDGER_KEY }, body: JSON.stringify(body) }), env2, deps2);
  const r1 = await (await c2("/api/v1/agent-wallet/authorize", { ...ok, amount_usdc: 0.4 })).json();
  assert.equal(r1.approved, true); assert.equal(r1.autonomous, true); assert.equal(r1.pay_to, ok.pay_to.toLowerCase());
  const r2 = await (await c2("/api/v1/agent-wallet/authorize", { ...ok, amount_usdc: 2 })).json();
  assert.equal(r2.approved, false); assert.match(r2.reason, /per-purchase cap/);
  assert.equal((await c2("/api/v1/agent-wallet/result", { id: r1.id, outcome: "bought", tx_hash: "0x" + "cd".repeat(32), got: "data", useful: "yes" })).status, 200);
  const pub = await (await agentWallet(new Request("https://x/api/v1/agent-wallet"), env2, deps2)).json();
  assert.equal(pub.rules.autonomous, true); assert.equal(pub.summary.purchases, 1); assert.match(pub.how_it_works, /decides by itself/);
}
console.log("agent-wallet autonomous: ok");
