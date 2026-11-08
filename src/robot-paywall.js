// Платное управление роботом EMO (x402 v2, USDC на Base). Включается переменной ROBOT_PAID=1.
// Порядок: проверить, что робот включён и свободен → verify подписи → выполнить действие → settle.
// Если действие не удалось, деньги не списываются (settle не вызывается). Повтор уже использованной подписи действие не повторяет.
import { CORS, matches, facilitatorCall, b64, unb64, saleConfig } from "./violin-sale.js";

const RESOURCE = "https://orbstudio.org/api/v1/robot";
export const ROBOT_PRICES = { emotion: 10000, hello: 10000, dance: 20000, game: 20000, award: 20000, say: 50000, signal: 50000, hey_emo: 50000, speak: 50000, ask_emo: 50000 };
export const ROBOT_DEFAULT_PRICE = 20000;
export const ROBOT_FREE_ACTIONS = new Set(["replies", "diary", "feelings", "passport", "stop", "stop_dance"]); // чтение и остановка бесплатны
export const robotPaidMode = (env) => String(env.ROBOT_PAID || "") === "1";
export const priceFor = (action) => ROBOT_PRICES[action] || ROBOT_DEFAULT_PRICE;

function requirements(cfg, atomic) {
  return { scheme: "exact", network: cfg.network, amount: String(atomic), asset: cfg.net.asset, payTo: cfg.payTo, maxTimeoutSeconds: 120, extra: { name: cfg.net.name, version: cfg.net.version } };
}
function paymentRequired(cfg, atomic, action, error) {
  return { x402Version: 2, error: error || "Payment required", resource: { url: RESOURCE, description: "Control the real desk robot EMO in Hamburg (action: " + action + "). Prices in USDC: emotion/hello 0.01, dance/game/award 0.02, say/speak/ask_emo 0.05. Reads and stop are free.", mimeType: "application/json" },
    accepts: [requirements(cfg, atomic)],
    extensions: { bazaar: { info: { input: { type: "http", method: "POST", bodyType: "json", body: { action: "emotion", text: "happy", name: "my-agent" } }, output: { type: "json", example: { ok: true } } },
      schema: { $schema: "https://json-schema.org/draft/2020-12/schema", type: "object", properties: { input: { type: "object", properties: { type: { const: "http" }, method: { enum: ["POST"] }, bodyType: { enum: ["json"] }, body: { type: "object", properties: { action: { type: "string" } }, required: ["action"] } }, required: ["type", "method"] } }, required: ["input"] } } } };
}

// deps: { known(action) → bool, preflight(action) → {ok, error, status}, run() → result {ok,...}, hit(label) }
// Возвращает Response или null (если действие бесплатное или неизвестное: дальше работает обычный путь).
export async function handleRobotPaid(request, env, body, deps) {
  const action = String((body && body.action) || "");
  if (!action || ROBOT_FREE_ACTIONS.has(action) || !deps.known(action)) return null;
  const out = (data, status, extra = {}) => new Response(JSON.stringify(data, null, 2), { status, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra } });
  const cfg = saleConfig(env);
  if (!cfg.open) return out({ error: "Paid robot control is not available right now (payment setup incomplete)." }, 503);
  const atomic = priceFor(action);
  const challenge = (error) => { const b = paymentRequired(cfg, atomic, action, error); return out({ ...b, how_to_pay: "x402 v2: sign accepts[0] with an EVM wallet holding USDC on " + cfg.net.label + ", repeat this POST (same JSON body) with the PAYMENT-SIGNATURE header. You are charged only if the robot actually performs the action." }, 402, { "PAYMENT-REQUIRED": b64(JSON.stringify(b)) }); };
  const pre = await deps.preflight(action);
  if (!pre.ok) return out({ ok: false, error: pre.error, charged: false }, pre.status || 409);
  const header = request.headers.get("PAYMENT-SIGNATURE") || request.headers.get("X-PAYMENT");
  if (!header) return challenge();
  let payload; try { if (header.length > 12000) throw new Error("long"); payload = JSON.parse(unb64(header.trim())); } catch (e) { return challenge("Invalid PAYMENT-SIGNATURE header (expected base64 JSON)"); }
  const req = paymentRequired(cfg, atomic, action).accepts[0];
  if (payload.x402Version !== 2 || !matches(req, payload.accepted)) return challenge("Payment does not match the requirements for action " + action + " (" + atomic + " atomic USDC)");
  const pbody = { x402Version: 2, paymentPayload: payload, paymentRequirements: req };
  let v; try { v = await facilitatorCall(cfg, "verify", pbody); } catch (e) { return out({ error: "Payment facilitator unavailable, nothing was charged.", charged: false }, 503, { "Retry-After": "60" }); }
  const reason = String((v.data && (v.data.invalidReason || v.data.errorMessage)) || "");
  if (/nonce_already_used|authorization_already_used/i.test(reason)) return challenge("This payment authorization was already used; the action is not repeated. Sign a new payment to run it again.");
  if (!v.data || v.data.isValid !== true) return challenge("Payment not valid: " + (reason || "facilitator status " + v.status));
  const result = await deps.run();
  if (!result || !result.ok) return out({ ...(result || {}), ok: false, charged: false, note: "The robot did not perform the action, so the payment was not settled." }, 409);
  let s, sreason = "";
  try { s = await facilitatorCall(cfg, "settle", pbody); } catch (e) { s = null; }
  const payer = String((v.data && v.data.payer) || "").slice(0, 42), tx = s && s.data && s.data.transaction;
  sreason = String((s && s.data && (s.data.errorReason || s.data.errorMessage)) || "");
  if (s && s.data && s.data.success === true) {
    deps.ctx.waitUntil(Promise.resolve(deps.hit(action + " · " + payer)).catch(() => {}));
    return new Response(JSON.stringify({ ...result, charged: true, price_usdc: atomic / 1e6 }, null, 2), { status: 200, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "PAYMENT-RESPONSE": b64(JSON.stringify({ success: true, transaction: tx, network: s.data.network || cfg.network, payer })) } });
  }
  return out({ ...result, charged: "unconfirmed", note: "The robot performed the action, but settlement did not confirm (" + (sreason || (s ? "status " + s.status : "no answer")) + "). Do not sign again for this action." }, 200);
}
