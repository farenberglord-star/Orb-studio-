import assert from "node:assert/strict";
import { handleRobotPaid, priceFor, robotPaidMode, ROBOT_FREE_ACTIONS } from "../src/robot-paywall.js";
import { saleConfig } from "../src/violin-sale.js";
const env = { X402_PAY_TO: "0xA91269022be3dc5208Ab3Da1eb288E261DE23DB5", X402_FACILITATOR_URL: "https://fac.example", ROBOT_PAID: "1" };
const cfg = saleConfig(env), b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64");
const acc = (amount) => ({ scheme: "exact", network: "eip155:8453", amount: String(amount), asset: cfg.net.asset, payTo: env.X402_PAY_TO, maxTimeoutSeconds: 120, extra: { name: cfg.net.name, version: cfg.net.version } });
const pay = (amount, n = "ab") => b64({ x402Version: 2, accepted: acc(amount), payload: { signature: "0x" + "11".repeat(65), authorization: { from: "0x" + "22".repeat(20), to: env.X402_PAY_TO, value: String(amount), validAfter: "1", validBefore: "9999999999", nonce: "0x" + n.repeat(32) } } });
const req = (h) => new Request("https://orbstudio.org/api/v1/robot", { method: "POST", headers: h ? { "PAYMENT-SIGNATURE": h } : {} });
let fac, calls, ran, pre = { ok: true };
const deps = () => ({ ctx: { waitUntil: (p) => p }, known: (a) => ["emotion", "dance", "say", "hello", "stop"].includes(a), preflight: async () => pre, run: async () => { ran++; return fac.runResult; }, hit: () => {} });
const reset = () => { calls = []; ran = 0; pre = { ok: true }; fac = { runResult: { ok: true, did: "x" }, verify: { isValid: true, payer: "0x" + "22".repeat(20) }, settle: { success: true, transaction: "0x" + "cd".repeat(32) } }; };
globalThis.fetch = async (u) => { const op = String(u).split("/").pop(); calls.push(op); return new Response(JSON.stringify(fac[op]), { status: 200 }); };
assert.equal(robotPaidMode({ ROBOT_PAID: "1" }), true); assert.equal(robotPaidMode({}), false);
assert.equal(priceFor("emotion"), 10000); assert.equal(priceFor("dance"), 20000); assert.equal(priceFor("say"), 50000);
reset();
// бесплатные и неизвестные действия — не наш случай
for (const a of ["passport", "diary", "stop", "nonsense"]) assert.equal(await handleRobotPaid(req(), env, { action: a }, deps()), null);
// без подписи — 402 с ценой действия
let r = await handleRobotPaid(req(), env, { action: "dance" }, deps()); assert.equal(r.status, 402);
assert.equal(JSON.parse(Buffer.from(r.headers.get("payment-required"), "base64").toString()).accepts[0].amount, "20000"); assert.equal(ran, 0);
// робот выключен или занят: не берём деньги и даже не просим подпись
pre = { ok: false, error: "switched off. You were not charged." }; r = await handleRobotPaid(req(), env, { action: "dance" }, deps()); assert.equal(r.status, 409); assert.equal((await r.json()).charged, false); pre = { ok: true };
// подпись на другую сумму (платил за эмоцию, просит танец)
r = await handleRobotPaid(req(pay(10000)), env, { action: "dance" }, deps()); assert.equal(r.status, 402); assert.equal(ran, 0);
// успех: verify → действие → settle
r = await handleRobotPaid(req(pay(20000)), env, { action: "dance" }, deps()); assert.equal(r.status, 200);
assert.deepEqual(calls, ["verify", "settle"]); assert.equal(ran, 1); assert.equal((await r.json()).charged, true); assert.ok(r.headers.get("payment-response"));
// действие не удалось: settle не вызывается, деньги не списаны
reset(); fac.runResult = { ok: false, error: "robot did not answer" }; r = await handleRobotPaid(req(pay(20000)), env, { action: "dance" }, deps());
assert.equal(r.status, 409); assert.deepEqual(calls, ["verify"]); assert.equal((await r.json()).charged, false);
// повтор уже использованной подписи действие не повторяет
reset(); fac.verify = { isValid: false, invalidReason: "nonce_already_used" }; r = await handleRobotPaid(req(pay(20000)), env, { action: "dance" }, deps());
assert.equal(r.status, 402); assert.equal(ran, 0); assert.deepEqual(calls, ["verify"]);
// недостаточный баланс: действие не выполняется
reset(); fac.verify = { isValid: false, invalidReason: "invalid_exact_evm_insufficient_balance" }; r = await handleRobotPaid(req(pay(20000)), env, { action: "dance" }, deps()); assert.equal(r.status, 402); assert.equal(ran, 0);
console.log("robot-paywall: ok");
