import assert from "node:assert/strict";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { recoverTypedDataAddress } from "viem";
import { buildPayment, checkChallenge } from "./buy-violin.mjs";
const ch = { x402Version: 2, accepts: [{ scheme: "exact", network: "eip155:8453", amount: "10000", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", payTo: "0xA91269022be3dc5208Ab3Da1eb288E261DE23DB5", maxTimeoutSeconds: 120, extra: { name: "USD Coin", version: "2" } }] };
checkChallenge(ch);
const acc = privateKeyToAccount(generatePrivateKey());
const { typed, authorization } = buildPayment(ch, acc, 1000, "0x" + "ab".repeat(32));
const sig = await acc.signTypedData(typed);
assert.equal(await recoverTypedDataAddress({ ...typed, signature: sig }), acc.address);
assert.equal(authorization.validBefore, "1120");
for (const bad of [{ ...ch.accepts[0], payTo: "0x" + "1".repeat(40) }, { ...ch.accepts[0], network: "eip155:1" }, { ...ch.accepts[0], amount: "50000" }, { ...ch.accepts[0], asset: "0x" + "2".repeat(40) }])
  assert.throws(() => checkChallenge({ x402Version: 2, accepts: [bad] }));
console.log("x402-buy: ok");
