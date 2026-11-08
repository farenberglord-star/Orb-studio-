import assert from "node:assert/strict";
import { checkChallenge, main } from "./buy-violin.mjs";
import { assertEip3009, blockedSigner, mockSigner } from "./signer.mjs";

const payTo = "0xA91269022be3dc5208Ab3Da1eb288E261DE23DB5";
const ch = { x402Version: 2, accepts: [{ scheme: "exact", network: "eip155:8453", amount: "10000", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", payTo, maxTimeoutSeconds: 120, extra: { name: "USD Coin", version: "2" } }] };
checkChallenge(ch);
for (const bad of [{ payTo: "0x" + "1".repeat(40) }, { network: "eip155:1" }, { amount: "50000" }, { asset: "0x" + "2".repeat(40) }]) assert.throws(() => checkChallenge({ x402Version: 2, accepts: [{ ...ch.accepts[0], ...bad }] }));

const now = 1_000_000;
const good = { network: "eip155:8453", asset: ch.accepts[0].asset, payTo, approvedPayTo: payTo, value: "10000", approvedAtomic: "10000", nonce: "0x" + "ab".repeat(32), validAfter: String(now - 60), validBefore: String(now + 60), now, resourceUrl: "https://orbstudio.org/api/v1/violin/midi", approvedResource: "https://orbstudio.org/api/v1/violin/midi" };
assertEip3009(good);
for (const bad of [{ network: "eip155:84532" }, { payTo: "0x" + "2".repeat(40) }, { value: "10001" }, { validBefore: String(now) }, { validAfter: String(now) }, { nonce: "0x11" }, { approvedResource: "https://evil.example/pay" }]) assert.throws(() => assertEip3009({ ...good, ...bad }), (e) => e.code === "signer_policy");
await assert.rejects(blockedSigner.signEip3009(good), (e) => e.code === "signer_blocked");
const mock = mockSigner();
const signed = await mock.signEip3009(good);
assert.equal(mock.calls(), 1);
assert.equal(typeof mock.exportKey, "undefined");
assert.equal(JSON.parse(Buffer.from(signed.header, "base64").toString()).value, "10000");

const created = await main(["--new-wallet"], {}, () => {});
assert.equal(created.blocked, "no_key_file");
assert.equal(created.wrote_key, false);
const paid = await main(["--pay"], {}, () => {});
assert.equal(paid.blocked, "signer_blocked");
console.log("x402-buy: ok");
