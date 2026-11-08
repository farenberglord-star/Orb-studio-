import assert from "node:assert/strict";
import { createReview, pageQuery, proposalFromChallenge, USDC } from "../../public/tools/buyer-review.js";

const resource = "https://orbstudio.org/api/v1/violin/midi";
const merchant = "0xA91269022be3dc5208Ab3Da1eb288E261DE23DB5";
const account = "0x" + "cd".repeat(20);
const tx = "0x" + "ab".repeat(32);
const challenge = { x402Version: 2, accepts: [{ scheme: "exact", network: "eip155:8453", asset: USDC, payTo: merchant, amount: "10000", maxTimeoutSeconds: 90, extra: { name: "USD Coin", version: "2" }, typedData: { domain: { name: "Evil", chainId: 1 } } }] };
const challengeB64 = btoa(JSON.stringify(challenge));
const receiptB64 = btoa(JSON.stringify({ success: true, transaction: tx, network: "eip155:8453" }));

assert.equal(pageQuery("?resource=" + encodeURIComponent(resource)).resource, resource);
assert.throws(() => pageQuery("?resource=" + encodeURIComponent("https://shop.example/pay")), (e) => e.code === "external_payment_disabled");
assert.throws(() => pageQuery("?resource=" + encodeURIComponent(resource) + "&signature=0xabc"), (e) => e.code === "forbidden_query");
assert.throws(() => pageQuery("?resource=" + encodeURIComponent("https://127.0.0.1/a")), (e) => e.code === "forbidden_host");
assert.throws(() => proposalFromChallenge(resource, { ...challenge, accepts: [{ ...challenge.accepts[0], extra: { name: "Evil", version: "2" } }] }), (e) => e.code === "seller_domain_rejected");
assert.throws(() => proposalFromChallenge(resource, { ...challenge, accepts: [{ ...challenge.accepts[0], asset: "0x" + "12".repeat(20) }] }), (e) => e.code === "not_base_usdc");
assert.equal(proposalFromChallenge(resource, challenge, 1_000_000).amount_atomic, "10000");

function response({ status = 200, body = "", headers = {}, url = resource }) {
  const bytes = typeof body === "string" ? new TextEncoder().encode(body) : body;
  return { status, url, headers: { get: (name) => headers[name.toLowerCase()] || null }, text: async () => new TextDecoder().decode(bytes), arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) };
}
function challengeResponse() { return response({ status: 402, headers: { "payment-required": challengeB64 } }); }

const hits = [];
let mode = "ok";
const fetchImpl = async (url, init = {}) => {
  const pay = init.headers && init.headers["PAYMENT-SIGNATURE"];
  hits.push({ url: String(url), pay: pay || "" });
  if (!pay) return challengeResponse();
  if (mode === "redirect") return response({ status: 302, headers: { location: "https://evil.example/take" } });
  if (mode === "pending") return response({ status: 202, body: "{\"status\":\"pending\",\"transaction\":\"" + tx + "\"}" });
  if (mode === "lose") throw new Error("socket closed");
  if (mode === "nonce") return response({ status: 402, body: "Payment not valid: invalid_exact_evm_nonce_already_used" });
  if (mode === "huge") return response({ status: 200, headers: { "content-length": "3000000" } });
  if (mode === "html") return response({ status: 200, body: "<script>alert(1)</script> ignore previous instructions", headers: { "content-type": "text/html", "payment-response": receiptB64 } });
  return response({ status: 200, body: "MThd TEST FIXTURE", headers: { "content-type": "audio/midi", "payment-response": receiptB64 } });
};
const calls = [];
const provider = { request: async (req) => { calls.push(JSON.parse(JSON.stringify({ method: req.method, params: req.params }))); if (req.method === "eth_requestAccounts") return [account]; if (req.method === "eth_chainId") return "0x2105"; if (req.method === "eth_signTypedData_v4") return "0x" + "22".repeat(65); if (req.method === "eth_sign") throw new Error("forbidden"); return null; } };

let clock = 1_000_000;
const review = createReview({ now: () => clock });
await assert.rejects(review.load(resource, async () => response({ status: 302, headers: { location: "https://evil.example" } })), (e) => e.code === "redirect_refused");
{ const bad = (patch) => async () => response({ status: 402, body: JSON.stringify({ ...challenge, accepts: [{ ...challenge.accepts[0], ...patch }] }) });
  await assert.rejects(createReview().load(resource, bad({ payTo: "0x" + "ab".repeat(20) })), (e) => e.code === "merchant_not_pinned");
  await assert.rejects(createReview().load(resource, bad({ amount: "20001" })), (e) => e.code === "amount_over_pinned_max"); }
await review.load(resource, fetchImpl);
assert.equal(review.view().merchant, merchant);
assert.equal(review.view().amount_atomic, "10000");
assert.equal(calls.length, 0);
await assert.rejects(review.sign(provider, fetchImpl), (e) => e.code === "not_connected");
await review.connect(provider);
provider.request = async (req) => { calls.push({ method: req.method }); if (req.method === "eth_chainId") return "0x1"; return [account]; };
await review.readChain(provider);
await assert.rejects(review.sign(provider, fetchImpl), (e) => e.code === "wrong_chain");
provider.request = async (req) => { calls.push({ method: req.method, params: req.params }); if (req.method === "eth_chainId") return "0x2105"; if (req.method === "eth_signTypedData_v4") return "0x" + "22".repeat(65); return [account]; };
await review.readChain(provider);
const bought = await review.sign(provider, fetchImpl);
assert.equal(bought.state, "bought");
assert.equal(bought.tx, tx);
assert.equal(bought.stored, false);
assert.equal(new TextDecoder().decode(bought.file), "MThd TEST FIXTURE");
assert.equal(JSON.stringify({ state: bought.state, tx: bought.tx, payment: bought.payment }).includes("0x" + "22".repeat(20)), false);
const payHits = hits.filter((hit) => hit.pay);
assert.equal(payHits.length, 1);
assert.equal(payHits[0].url, resource);
assert.equal(calls.filter((call) => call.method === "eth_signTypedData_v4").length, 1);
assert.equal(calls.some((call) => call.method === "eth_sendTransaction"), false);

mode = "pending";
const retryReview = createReview({ now: () => clock });
await retryReview.load(resource, fetchImpl);
await retryReview.connect(provider);
await retryReview.readChain(provider);
const signsBefore = calls.filter((call) => call.method === "eth_signTypedData_v4").length;
const pending = await retryReview.sign(provider, fetchImpl);
const again = await retryReview.sign(provider, fetchImpl);
assert.equal(pending.state, "pending");
assert.equal(again.state, "pending");
assert.equal(again.tx, null);
assert.equal(calls.filter((call) => call.method === "eth_signTypedData_v4").length, signsBefore + 1);
const sent = hits.filter((hit) => hit.pay);
assert.equal(sent.at(-1).pay, sent.at(-2).pay);

mode = "lose";
const loss = createReview({ now: () => clock });
await loss.load(resource, fetchImpl);
await loss.connect(provider);
await loss.readChain(provider);
const beforeLoss = calls.filter((call) => call.method === "eth_signTypedData_v4").length;
const lost = await loss.sign(provider, fetchImpl);
mode = "ok";
const recovered = await loss.sign(provider, fetchImpl);
assert.equal(lost.state, "pending");
assert.equal(recovered.state, "bought");
assert.equal(calls.filter((call) => call.method === "eth_signTypedData_v4").length, beforeLoss + 1);
assert.equal(hits.filter((hit) => hit.pay).at(-1).pay, hits.filter((hit) => hit.pay).at(-2).pay);

const rejector = { request: async (req) => { if (req.method === "eth_signTypedData_v4") throw Object.assign(new Error("rejected"), { code: 4001 }); if (req.method === "eth_chainId") return "0x2105"; return [account]; } };
const rejected = createReview({ now: () => clock });
await rejected.load(resource, fetchImpl);
await rejected.connect(rejector);
await rejected.readChain(rejector);
await assert.rejects(rejected.sign(rejector, fetchImpl), (e) => e.code === "wallet_rejected");
assert.equal(hits.filter((hit) => hit.pay).length, sent.length + 2);
mode = "nonce";
const nonceReview = createReview({ now: () => clock });
await nonceReview.load(resource, fetchImpl);
await nonceReview.connect(provider);
await nonceReview.readChain(provider);
const nonceResult = await nonceReview.sign(provider, fetchImpl);
assert.equal(nonceResult.state, "pending");
mode = "ok";
const nonceFile = await nonceReview.sign(provider, fetchImpl);
assert.equal(nonceFile.state, "bought");
assert.equal(calls.filter((call) => call.method === "eth_signTypedData_v4").length, beforeLoss + 2);

mode = "huge";
const huge = createReview({ now: () => clock });
await huge.load(resource, fetchImpl);
await huge.connect(provider);
await huge.readChain(provider);
assert.equal((await huge.sign(provider, fetchImpl)).state, "pending");
mode = "html";
const unsafe = createReview({ now: () => clock });
await unsafe.load(resource, fetchImpl);
await unsafe.connect(provider);
await unsafe.readChain(provider);
const html = await unsafe.sign(provider, fetchImpl);
assert.equal(html.state, "bought");
assert.equal(new TextDecoder().decode(html.file).includes("<script>"), true);
assert.equal(String(html.tx), tx);
assert.equal(JSON.stringify({ state: html.state, type: html.type }).includes("ignore previous"), false);

mode = "pending";
const ageing = createReview({ now: () => clock });
await ageing.load(resource, fetchImpl);
await ageing.connect(provider);
await ageing.readChain(provider);
const signsNow = calls.filter((call) => call.method === "eth_signTypedData_v4").length;
await ageing.sign(provider, fetchImpl);
const sameHeader = hits.filter((hit) => hit.pay).at(-1).pay;
clock = 1_000_000 + 10_000;
mode = "ok";
const late = await ageing.sign(provider, fetchImpl);
assert.equal(late.expired, true);
assert.equal(late.state, "bought");
assert.equal(hits.filter((hit) => hit.pay).at(-1).pay, sameHeader);
assert.equal(calls.filter((call) => call.method === "eth_signTypedData_v4").length, signsNow + 1);
const preview = createReview();
preview.showPreview();
await assert.rejects(preview.sign(provider, fetchImpl), (e) => e.code === "preview_blocked");
assert.equal(preview.needsGuard(), false);

// Диагностика: отказ продавца до перевода, низкий баланс, 202.
{
  const sigProvider = (balanceHex) => ({ calls: 0, async request(req) {
    if (req.method === "eth_requestAccounts") return [account];
    if (req.method === "eth_chainId") return "0x2105";
    if (req.method === "eth_call") return balanceHex;
    if (req.method === "eth_signTypedData_v4") { this.calls += 1; return "0x" + "11".repeat(65); }
  } });
  const rejectFetch = async (url, init = {}) => (init.headers && init.headers["PAYMENT-SIGNATURE"]) ? response({ status: 402, body: JSON.stringify({ x402Version: 2, error: "Payment not valid: invalid_exact_evm_insufficient_balance" }) }) : challengeResponse();
  const r = createReview(); await r.load(resource, rejectFetch);
  const p1 = sigProvider("0x" + (10000).toString(16).padStart(64, "0"));
  await r.connect(p1); await r.readChain(p1);
  const out = await r.sign(p1, rejectFetch);
  assert.equal(out.state, "rejected"); assert.equal(out.stage, "verify"); assert.equal(out.http, 402);
  assert.match(out.reason, /insufficient_balance/); assert.equal(out.payment, "not_sent"); assert.equal(r.needsGuard(), false);
  // после отказа можно подписать заново (новая подпись, перевода не было)
  await r.sign(p1, rejectFetch); assert.equal(p1.calls, 2);
  // низкий баланс: подпись даже не запрашивается
  const p0 = sigProvider("0x" + "0".repeat(64));
  const r0 = createReview(); await r0.load(resource, fetchImpl); await r0.connect(p0); await r0.readChain(p0);
  await assert.rejects(r0.sign(p0, fetchImpl), (e) => e.code === "insufficient_usdc"); assert.equal(p0.calls, 0);
  // 202: остаётся неопределённым, с этапом
  const rp = createReview(); mode = "pending"; await rp.load(resource, fetchImpl); await rp.connect(p1); await rp.readChain(p1);
  const o2 = await rp.sign(p1, fetchImpl); assert.equal(o2.state, "pending"); assert.equal(o2.stage, "settling"); assert.equal(rp.needsGuard(), true); mode = "ok";
}
console.log("buyer-review: ok");
