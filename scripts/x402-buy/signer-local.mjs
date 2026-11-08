// Локальная подпись EIP-3009 для агента. Ключ берётся ТОЛЬКО из переменной окружения X402_BUYER_KEY:
// не читается из файла, не печатается, не попадает в журнал и в ответ. Любые правила подписи проверяет assertEip3009 из signer.mjs:
// сеть Base, USDC, получатель и сумма из разового разрешения сайта, срок не дольше 120 с, тот же ресурс.
import { privateKeyToAccount } from "viem/accounts";
import { assertEip3009 } from "./signer.mjs";

export function localSignerFromEnv(env = process.env) {
  const k = env.X402_BUYER_KEY || "";
  if (!/^0x[0-9a-fA-F]{64}$/.test(k)) return null;
  const account = privateKeyToAccount(k);
  return {
    address: account.address,
    async signEip3009(req) {
      assertEip3009(req);
      const accepted = req.accepted;
      if (!accepted || accepted.payTo.toLowerCase() !== req.payTo.toLowerCase() || String(accepted.amount) !== String(req.value)) throw Object.assign(new Error("accepted offer differs from the approved request"), { code: "signer_policy" });
      const authorization = { from: account.address, to: req.payTo, value: String(req.value), validAfter: String(req.validAfter), validBefore: String(req.validBefore), nonce: req.nonce };
      const signature = await account.signTypedData({
        domain: { name: accepted.extra?.name || "USD Coin", version: accepted.extra?.version || "2", chainId: Number(String(req.network).split(":")[1]), verifyingContract: req.asset },
        types: { TransferWithAuthorization: [
          { name: "from", type: "address" }, { name: "to", type: "address" }, { name: "value", type: "uint256" },
          { name: "validAfter", type: "uint256" }, { name: "validBefore", type: "uint256" }, { name: "nonce", type: "bytes32" } ] },
        primaryType: "TransferWithAuthorization",
        message: { ...authorization, value: BigInt(authorization.value), validAfter: BigInt(authorization.validAfter), validBefore: BigInt(authorization.validBefore) },
      });
      const payload = { x402Version: 2, resource: req.challenge?.resource, accepted, payload: { signature, authorization }, extensions: req.challenge?.extensions };
      return { header: Buffer.from(JSON.stringify(payload)).toString("base64"), nonce: req.nonce };
    },
  };
}
