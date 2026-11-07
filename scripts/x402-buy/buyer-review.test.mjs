import assert from "node:assert/strict";
import { createReview, pageQuery, proposalFromChallenge, USDC } from "../../public/tools/buyer-review.js";

const resource = "https://orbstudio.org/api/v1/violin/midi";
const merchant = "0x" + "ab".repeat(20);
const challenge = { x402Version: 2, accepts: [{ scheme: "exact", network: "eip155:8453", asset: USDC, payTo: merchant, amount: "10000", maxTimeoutSeconds: 90, extra: { name: "USD Coin", version: "2" }, typedData: { domain: { name: "Evil", chainId: 1 } } }] };

assert.equal(pageQuery("?resource=" + encodeURIComponent(resource)).resource, resource);
assert.throws(() => pageQuery("?resource=" + encodeURIComponent(resource) + "&signature=0xabc"), (e) => e.code === "forbidden_query");
assert.throws(() => pageQuery("?resource=" + encodeURIComponent("https://127.0.0.1/a")), (e) => e.code === "forbidden_host");
assert.throws(() => proposalFromChallenge(resource, { ...challenge, accepts: [{ ...challenge.accepts[0], extra: { name: "Evil", version: "2" } }] }), (e) => e.code === "seller_domain_rejected");

function mockFetch(status, body, headers = {}) {
  return async () => ({ status, headers: { get: (name) => headers[name.toLowerCase()] || null }, text: async () => JSON.stringify(body) });
}
const review = createReview();
await assert.rejects(review.load(resource, mockFetch(302, {}, { location: "https://evil.example" })), (e) => e.code === "redirect_refused");
await review.load(resource, mockFetch(402, challenge, { "payment-required": Buffer.from(JSON.stringify(challenge)).toString("base64") }));
assert.equal(review.view().merchant, merchant);
assert.equal(review.view().amount_atomic, "10000");
assert.equal(review.view().domain_name, "USD Coin");

const calls = [];
const provider = { request: async (req) => { calls.push(req); if (req.method === "eth_requestAccounts") return ["0x" + "cd".repeat(20)]; if (req.method === "eth_chainId") return "0x1"; if (req.method === "eth_signTypedData_v4") return "0x" + "11".repeat(65); return null; } };
assert.equal(calls.length, 0);
await assert.rejects(review.sign(provider), (e) => e.code === "not_connected");
assert.equal(calls.some((c) => c.method === "eth_signTypedData_v4"), false);
await review.connect(provider);
await review.readChain(provider);
await assert.rejects(review.sign(provider), (e) => e.code === "wrong_chain");
calls.length = 0;
provider.request = async (req) => { calls.push(req); if (req.method === "eth_chainId") return "0x2105"; if (req.method === "eth_signTypedData_v4") return "0x" + "22".repeat(65); return ["0x" + "cd".repeat(20)]; };
await review.readChain(provider);
const first = await review.sign(provider);
const second = await review.sign(provider);
assert.equal(first.payment, "blocked");
assert.equal(first.stored, false);
assert.equal(JSON.stringify(first).includes("0x" + "22".repeat(20)), false);
const signs = calls.filter((c) => c.method === "eth_signTypedData_v4");
assert.equal(signs.length, 2);
assert.equal(signs[0].params[1], signs[1].params[1]);
const typed = JSON.parse(signs[0].params[1]);
assert.equal(typed.domain.chainId, 8453);
assert.equal(typed.domain.verifyingContract, USDC);
assert.equal(typed.domain.name, "USD Coin");
assert.equal(typed.message.to, merchant);
assert.equal(typed.message.value, "10000");
assert.equal(typed.message.from, "0x" + "cd".repeat(20));
assert.equal(calls.some((c) => c.method === "eth_sign" || c.method === "eth_sendTransaction"), false);
const preview = createReview();
preview.showPreview();
await assert.rejects(preview.sign(provider), (e) => e.code === "preview_blocked");
console.log("buyer-review: ok");
