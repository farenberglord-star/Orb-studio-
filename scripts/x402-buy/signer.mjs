// Интерфейс подписи EIP-3009. Здесь нет генерации ключа, чтения ключа и экспорта.
// Реальная подпись подключается отдельно и должна сама отвергать всё, кроме точного запроса.
export const BASE_NETWORK = "eip155:8453";
export const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

const same = (a, b) => String(a || "").toLowerCase() === String(b || "").toLowerCase();

export function assertEip3009(req) {
  if (!req || req.network !== BASE_NETWORK) throw Object.assign(new Error("signer accepts only eip155:8453"), { code: "signer_policy" });
  if (!same(req.asset, BASE_USDC)) throw Object.assign(new Error("signer accepts only Base USDC"), { code: "signer_policy" });
  if (!/^0x[0-9a-fA-F]{40}$/.test(req.payTo || "")) throw Object.assign(new Error("merchant address rejected"), { code: "signer_policy" });
  if (!same(req.payTo, req.approvedPayTo)) throw Object.assign(new Error("merchant does not match the one-time approval"), { code: "signer_policy" });
  if (!/^\d+$/.test(String(req.value || "")) || BigInt(req.value) < 1n) throw Object.assign(new Error("value rejected"), { code: "signer_policy" });
  if (req.approvedAtomic != null && BigInt(req.value) !== BigInt(req.approvedAtomic)) throw Object.assign(new Error("value does not match the approved total"), { code: "signer_policy" });
  if (!/^0x[0-9a-fA-F]{64}$/.test(req.nonce || "")) throw Object.assign(new Error("nonce must be 32 bytes"), { code: "signer_policy" });
  const now = BigInt(req.now || Math.floor(Date.now() / 1000));
  const before = BigInt(req.validBefore || 0);
  const after = BigInt(req.validAfter || 0);
  if (before <= now || before <= after || before > now + 120n) throw Object.assign(new Error("authorization expiry rejected"), { code: "signer_policy" });
  if (after > now - 5n) throw Object.assign(new Error("validAfter must be in the past (facilitator rejects validAfter >= now)"), { code: "signer_policy" });
  if (!req.resourceUrl || req.resourceUrl !== req.approvedResource) throw Object.assign(new Error("resource does not match the one-time approval"), { code: "signer_policy" });
}

export const blockedSigner = {
  async signEip3009(req) {
    assertEip3009(req);
    throw Object.assign(new Error("signer_blocked: no non-exportable signer is configured"), { code: "signer_blocked" });
  },
};

// Только для тестов. Не содержит и не создаёт приватный ключ.
export function mockSigner() {
  let calls = 0;
  const last = [];
  return {
    calls: () => calls,
    last: () => last.map((x) => ({ ...x })),
    async signEip3009(req) {
      assertEip3009(req);
      calls += 1;
      const body = { mock: true, nonce: req.nonce, to: req.payTo, value: req.value, resource: req.resourceUrl };
      last.push(body);
      return { header: Buffer.from(JSON.stringify(body)).toString("base64"), nonce: req.nonce };
    },
  };
}
