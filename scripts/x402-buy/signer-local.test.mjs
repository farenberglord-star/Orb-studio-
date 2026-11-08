import assert from "node:assert/strict";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { recoverTypedDataAddress } from "viem";
import { localSignerFromEnv } from "./signer-local.mjs";
import { BASE_NETWORK, BASE_USDC } from "./signer.mjs";

assert.equal(localSignerFromEnv({}), null);
assert.equal(localSignerFromEnv({ X402_BUYER_KEY: "0x12" }), null);
const key = generatePrivateKey(), acct = privateKeyToAccount(key); // одноразовый, без денег
const signer = localSignerFromEnv({ X402_BUYER_KEY: key });
assert.equal(signer.address, acct.address);
const payTo = "0xA91269022be3dc5208Ab3Da1eb288E261DE23DB5", url = "https://orbstudio.org/api/v1/violin/midi", now = 1_800_000_000;
const accepted = { scheme: "exact", network: BASE_NETWORK, asset: BASE_USDC, payTo, amount: "10000", maxTimeoutSeconds: 120, extra: { name: "USD Coin", version: "2" } };
const challenge = { x402Version: 2, resource: { url }, accepts: [accepted], extensions: { bazaar: { ok: true } } };
const req = { network: BASE_NETWORK, asset: BASE_USDC, payTo, approvedPayTo: payTo, value: "10000", approvedAtomic: "10000", resourceUrl: url, approvedResource: url, validAfter: String(now - 60), validBefore: String(now + 120), nonce: "0x" + "ab".repeat(32), now, accepted, challenge };
const out = await signer.signEip3009(req);
const body = JSON.parse(Buffer.from(out.header, "base64").toString());
assert.equal(body.x402Version, 2); assert.equal(body.payload.authorization.from, acct.address); assert.equal(body.payload.authorization.to, payTo);
assert.deepEqual(body.extensions, challenge.extensions); assert.equal(body.resource.url, url);
const a = body.payload.authorization;
const rec = await recoverTypedDataAddress({ domain: { name: "USD Coin", version: "2", chainId: 8453, verifyingContract: BASE_USDC },
  types: { TransferWithAuthorization: [{ name: "from", type: "address" }, { name: "to", type: "address" }, { name: "value", type: "uint256" }, { name: "validAfter", type: "uint256" }, { name: "validBefore", type: "uint256" }, { name: "nonce", type: "bytes32" }] },
  primaryType: "TransferWithAuthorization", message: { ...a, value: BigInt(a.value), validAfter: BigInt(a.validAfter), validBefore: BigInt(a.validBefore) }, signature: body.payload.signature });
assert.equal(rec, acct.address);
assert.ok(!out.header.includes(key.slice(2)) && !JSON.stringify(out).includes(key.slice(2)));
for (const bad of [{ approvedPayTo: "0x" + "11".repeat(20) }, { approvedAtomic: "9999" }, { approvedResource: "https://evil.example/x" }, { network: "eip155:1" }, { validBefore: String(now + 500) }, { validAfter: String(now) }, { accepted: { ...accepted, payTo: "0x" + "22".repeat(20) } }])
  await assert.rejects(signer.signEip3009({ ...req, ...bad }), (e) => e.code === "signer_policy");
console.log("signer-local: ok");
