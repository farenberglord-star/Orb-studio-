import assert from "node:assert/strict";
import { decide, summarizeLedger, walletRules, agentWallet } from "../src/agent-wallet.js";
const rules = walletRules({}), now = Date.UTC(2026, 10, 7, 12);
const ok = { resource_url: "https://api.example.com/data", amount_usdc: 0.03, reason: "Test of a paid weather feed for the news radar" };
assert.equal(decide(rules, [], ok, now).ok, true);
assert.equal(decide(rules, [], { ...ok, amount_usdc: 0.06 }, now).ok, false);          // выше лимита покупки
assert.equal(decide(rules, [], { ...ok, resource_url: "http://x.com/a" }, now).ok, false); // не https
assert.equal(decide(rules, [], { ...ok, resource_url: "https://127.0.0.1/a" }, now).ok, false);
assert.equal(decide(rules, [], { ...ok, resource_url: "https://8.8.8.8/a" }, now).ok, false);
assert.equal(decide(rules, [], { ...ok, reason: "x" }, now).ok, false);
assert.equal(decide({ ...rules, allowed_hosts: ["a.com"] }, [], ok, now).ok, false);
const spent = Array.from({ length: 40 }, (_, i) => ({ id: "x" + i, t: now - 1000, outcome: "bought", amount_usdc: 0.05, host: "h" }));
assert.equal(decide(rules, spent, ok, now).ok, false);                                   // 2.00 + 0.03 > 2
assert.equal(decide(rules, spent.slice(0, 30), ok, now).ok, true);
assert.equal(summarizeLedger(spent, now).spent_today_usdc, 2);
assert.equal(summarizeLedger(spent, now + 864e5).spent_today_usdc, 0);                    // новый день
// API: чтение открыто, запись только с ключом
const mem = {}; const deps = { sharedGet: async (e, k) => mem[k] || null, sharedPut: async (e, k, v) => { mem[k] = v; } };
const env = { AGENT_LEDGER_KEY: "k".repeat(24), AGENT_WALLET_ADDRESS: "0x" + "a".repeat(40) };
const call = (path, method, body, key) => agentWallet(new Request("https://x" + path, { method, headers: { "content-type": "application/json", ...(key ? { "x-agent-key": key } : {}) }, body: body ? JSON.stringify(body) : undefined }), env, deps);
assert.equal((await call("/api/v1/agent-wallet", "GET")).status, 200);
assert.equal((await call("/api/v1/agent-wallet/authorize", "POST", ok)).status, 401);
const a = await (await call("/api/v1/agent-wallet/authorize", "POST", ok, env.AGENT_LEDGER_KEY)).json(); assert.equal(a.approved, true);
const bad = await call("/api/v1/agent-wallet/result", "POST", { id: a.id, outcome: "bought" }, env.AGENT_LEDGER_KEY); assert.equal(bad.status, 400); // без tx
const tx = "0x" + "ab".repeat(32);
assert.equal((await call("/api/v1/agent-wallet/result", "POST", { id: a.id, outcome: "bought", tx_hash: tx, got: "JSON with 3 cities", useful: "partly" }, env.AGENT_LEDGER_KEY)).status, 200);
assert.equal((await call("/api/v1/agent-wallet/result", "POST", { id: a.id, outcome: "bought", tx_hash: tx }, env.AGENT_LEDGER_KEY)).status, 409); // дважды нельзя
const g = await (await call("/api/v1/agent-wallet", "GET")).json();
assert.equal(g.summary.purchases, 1); assert.equal(g.summary.spent_total_usdc, 0.03); assert.equal(g.entries[0].tx_url, "https://basescan.org/tx/" + tx);
const r = await (await call("/api/v1/agent-wallet/authorize", "POST", { ...ok, amount_usdc: 9 }, env.AGENT_LEDGER_KEY)).json(); assert.equal(r.approved, false);
console.log("agent-wallet: ok");
