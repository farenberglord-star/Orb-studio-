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
