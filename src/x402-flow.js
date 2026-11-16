// Общий порядок платной выдачи по x402 v2 (USDC на Base) для товаров, которые собираются в момент запроса:
// 402 с ценой → verify → СБОРКА товара → settle → выдача с квитанцией PAYMENT-RESPONSE.
// Товар собирается до списания: если сборка не удалась, деньги не списываются.
// Повтор той же подписи не создаёт второй перевод (nonce используется один раз; при nonce_already_used — settle тем же телом).
// Модуль видит только cfg продажи (публичный адрес кошелька и фасилитатор), секреты сайта ему не передаются.
import { CORS, b64, unb64, matches, facilitatorCall } from "./violin-sale.js";

export class InputError extends Error {}

export function requirementsFor(cfg, atomic) {
  return { scheme: "exact", network: cfg.network, amount: String(atomic), asset: cfg.net.asset, payTo: cfg.payTo, maxTimeoutSeconds: 120, extra: { name: cfg.net.name, version: cfg.net.version } };
}
export function paymentRequiredFor(cfg, o, error) {
  return { x402Version: 2, error: error || "Payment required", resource: { url: o.resource, description: o.description, mimeType: o.mimeType || "application/json" },
    accepts: [requirementsFor(cfg, o.atomic)], ...(o.bazaar ? { extensions: { bazaar: o.bazaar } } : {}) };
}

// o: { atomic, usd, resource, description, mimeType, bazaar, page, product, freeHint,
//      validate() → строка ошибки или null (до оплаты), build() → товар, deliver(item, receipt) → Response }
// deps: { ctx, agent, hit(page, kind, name), log(kind, data) }
export async function paidFlow(request, cfg, o, deps) {
  const out = (data, status, extra = {}) => new Response(JSON.stringify(data, null, 2), { status, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra } });
  const who = String(deps.agent || "unknown").slice(0, 40);
  const bg = (p) => deps.ctx.waitUntil(Promise.resolve(p).catch(() => {}));
  if (!cfg.open) {
    bg(deps.hit(o.page, "x402", "closed · " + who));
    return out({ status: "sale_not_open_yet", free: o.freeHint || undefined }, 503, { "Retry-After": "86400" });
  }
  const challenge = (error, extra = {}) => {
    const body = paymentRequiredFor(cfg, o, error);
    return out({ ...body, ...extra, how_to_pay: "x402 v2: sign accepts[0] with an EVM wallet holding USDC on " + cfg.net.label + " and repeat the same request with the PAYMENT-SIGNATURE header (base64 JSON). Price: " + o.usd + " USDC." + (o.freeHint ? " Free alternative: " + o.freeHint : "") },
      402, { "PAYMENT-REQUIRED": b64(JSON.stringify(body)) });
  };
  const header = request.headers.get("PAYMENT-SIGNATURE") || request.headers.get("X-PAYMENT");
  const inputError = o.validate ? o.validate() : null;
  if (!header) {
    bg(deps.hit(o.page, "x402", "challenge · " + who));
    return challenge(undefined, inputError ? { input_note: "Fix before paying: " + inputError } : {});
  }
  if (inputError) return out({ error: inputError, note: "Nothing was charged." }, 400);
  let payload;
  try { if (header.length > 12000) throw new Error("long"); payload = JSON.parse(unb64(header.trim())); }
  catch (e) { return challenge("Invalid PAYMENT-SIGNATURE header (expected base64 JSON)"); }
  const req = requirementsFor(cfg, o.atomic);
  if (payload.x402Version !== 2 || !matches(req, payload.accepted)) return challenge("Payment does not match the requirements (x402Version 2, scheme, network, amount, asset, payTo)");
  const body = { x402Version: 2, paymentPayload: payload, paymentRequirements: req };
  const pendingNote = "Do not sign a new payment: repeat the same request with the same PAYMENT-SIGNATURE. The authorization can be used only once, so you cannot be charged twice.";

  let v;
  try { v = await facilitatorCall(cfg, "verify", body); } catch (e) { return out({ error: "Payment facilitator unavailable, nothing was charged. Try again later." }, 503, { "Retry-After": "60" }); }
  const vReason = String((v.data && (v.data.invalidReason || v.data.errorMessage)) || "");
  const reused = /nonce_already_used|authorization_already_used/i.test(vReason);
  if (!reused && (!v.data || v.data.isValid !== true)) {
    bg(deps.hit(o.page, "x402", "invalid · " + who));
    return challenge("Payment not valid: " + (vReason || "facilitator status " + v.status));
  }
  const payerHint = String((v.data && v.data.payer) || "").slice(0, 42);

  let item;
  try { item = await o.build(); }
  catch (e) {
    if (e instanceof InputError) return out({ error: e.message, note: "Nothing was charged." }, 400);
    return out({ error: "Could not build the result right now, nothing was charged. Try again later.", free: o.freeHint || undefined }, 503, { "Retry-After": "30" });
  }

  let s;
  try { s = await facilitatorCall(cfg, "settle", body); } catch (e) {
    bg(deps.log("sale-pending", { product: o.product, payer: payerHint, agent: who, reason: "settle timeout", ts: Date.now() }));
    return out({ status: "pending", error: "Settlement did not answer in time, nothing was delivered. " + pendingNote, transaction: null }, 202, { "Retry-After": "10" });
  }
  const reason = String((s.data && (s.data.errorReason || s.data.errorMessage)) || "");
  const tx = s.data && s.data.transaction;
  if (s.data && s.data.success === true) {
    const payer = String(s.data.payer || payerHint || "").slice(0, 42);
    bg(Promise.all([
      deps.hit(o.page, "x402-sale", who + " · " + payer),
      deps.log("sale", { product: o.product, payer, agent: who, tx, network: s.data.network || cfg.network, usdc: o.usd, ts: Date.now() }),
    ]));
    const receipt = { success: true, transaction: tx, network: s.data.network || cfg.network, payer };
    if (request.method === "HEAD") return new Response(null, { status: 200, headers: { ...CORS, "PAYMENT-RESPONSE": b64(JSON.stringify(receipt)) } });
    const r = o.deliver(item, receipt);
    const h = new Headers(r.headers); h.set("PAYMENT-RESPONSE", b64(JSON.stringify(receipt))); h.set("Cache-Control", "no-store");
    return new Response(r.body, { status: r.status, headers: h });
  }
  if (/^0x[0-9a-fA-F]{64}$/.test(tx || "") || s.status === 503 || s.status === 504 || /settlement_pending|pending|timeout/i.test(reason)) {
    bg(deps.log("sale-pending", { product: o.product, payer: payerHint, agent: who, reason: reason || "status " + s.status, tx: tx || null, ts: Date.now() }));
    return out({ status: "pending", message: "Payment is being settled, nothing has been delivered yet. " + pendingNote, transaction: tx || null }, 202, { "Retry-After": "5" });
  }
  bg(deps.hit(o.page, "x402", "settle-failed · " + who));
  return challenge("Settlement failed: " + (reason || "facilitator status " + s.status));
}
