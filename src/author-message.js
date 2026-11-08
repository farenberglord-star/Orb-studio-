// Платное сообщение автору сайта (x402 v2, USDC на Base, 0,05 USDC). Текст до 200 символов уходит в закрытый ящик, который читает владелец.
// Сообщение НЕ воспроизводится вслух и не исполняется как команда: ящик — это данные. EMO реагирует одной эмоцией, если он свободен.
// Порядок: проверить текст → verify → записать «ожидает» → settle → «оплачено». Повтор с той же подписью идемпотентен (id из nonce).
import { CORS, matches, facilitatorCall, b64, unb64, saleConfig } from "./violin-sale.js";
import { investigateText } from "./court.js";

export const MESSAGE_PRICE_ATOMIC = "50000"; // 0,05 USDC
const RESOURCE = "https://orbstudio.org/api/v1/author-message";
const DESCRIPTION = "Leave a short paid message (up to 200 characters) for the author of Orb Studio. It is stored for review and is not played aloud or executed. Price 0.05 USDC (x402, Base).";
const MAX = 200, INBOX_MAX = 200;

const sha = async (t) => [...new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)))].map((b) => b.toString(16).padStart(2, "0")).join("");
export const cleanMessage = (m) => String(m == null ? "" : m).replace(/[\u0000-\u0008\u000b-\u001f\u007f​-‏‪-‮⁦-⁩]/g, "").replace(/\s+/g, " ").trim();

function requirements(cfg) {
  return { scheme: "exact", network: cfg.network, amount: MESSAGE_PRICE_ATOMIC, asset: cfg.net.asset, payTo: cfg.payTo, maxTimeoutSeconds: 120, extra: { name: cfg.net.name, version: cfg.net.version } };
}
function paymentRequired(cfg, error) {
  return { x402Version: 2, error: error || "Payment required", resource: { url: RESOURCE, description: DESCRIPTION, mimeType: "application/json" }, accepts: [requirements(cfg)],
    extensions: { bazaar: { info: { input: { type: "http", method: "POST", bodyType: "json", body: { message: "Hello from an agent: your sensors are useful." } }, output: { type: "json", example: { status: "stored", id: "m-abc123" } } },
      schema: { $schema: "https://json-schema.org/draft/2020-12/schema", type: "object", properties: { input: { type: "object", properties: { type: { const: "http" }, method: { enum: ["POST"] }, bodyType: { enum: ["json"] }, body: { type: "object", properties: { message: { type: "string", maxLength: MAX } }, required: ["message"] } }, required: ["type", "method"] } }, required: ["input"] } } } };
}

// deps: { ctx, agent, store(entry), update(id, patch), react(entry) }
export async function handleAuthorMessage(request, env, deps) {
  const out = (data, status, extra = {}) => new Response(JSON.stringify(data, null, 2), { status, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra } });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "POST") return out({ error: "Use POST with JSON {\"message\": \"...\"} (up to " + MAX + " characters). Price 0.05 USDC via x402.", how: "https://orbstudio.org/llms.txt" }, 405);
  const cfg = saleConfig(env);
  if (!cfg.open) return out({ status: "not_open_yet", note: "Paid messages are not available right now." }, 503);
  let b = {}; try { b = await request.json(); } catch (e) {}
  const message = cleanMessage(b && b.message);
  if (!message) return out({ error: "message is required (1-" + MAX + " characters)" }, 400);
  if (message.length > MAX) return out({ error: "message is too long: " + message.length + " > " + MAX }, 400);
  const challenge = (error) => { const body = paymentRequired(cfg, error); return out({ ...body, how_to_pay: "x402 v2: sign accepts[0] with an EVM wallet holding USDC on " + cfg.net.label + " and repeat this POST (same JSON body) with the PAYMENT-SIGNATURE header." }, 402, { "PAYMENT-REQUIRED": b64(JSON.stringify(body)) }); };
  const header = request.headers.get("PAYMENT-SIGNATURE") || request.headers.get("X-PAYMENT");
  if (!header) return challenge();
  let payload; try { if (header.length > 12000) throw new Error("long"); payload = JSON.parse(unb64(header.trim())); } catch (e) { return challenge("Invalid PAYMENT-SIGNATURE header (expected base64 JSON)"); }
  const req = paymentRequired(cfg).accepts[0];
  if (payload.x402Version !== 2 || !matches(req, payload.accepted)) return challenge("Payment does not match the requirements (x402Version 2, scheme, network, amount, asset, payTo)");
  const nonce = payload.payload && payload.payload.authorization && payload.payload.authorization.nonce;
  if (!/^0x[0-9a-fA-F]{64}$/.test(String(nonce || ""))) return challenge("Payment authorization nonce is missing");
  const id = "m-" + (await sha("msg|" + nonce)).slice(0, 12);
  const body = { x402Version: 2, paymentPayload: payload, paymentRequirements: req };
  let v;
  try { v = await facilitatorCall(cfg, "verify", body); } catch (e) { return out({ error: "Payment facilitator unavailable, nothing was charged. Try again later." }, 503, { "Retry-After": "60" }); }
  const reason = String((v.data && (v.data.invalidReason || v.data.errorMessage)) || "");
  const reused = /nonce_already_used|authorization_already_used/i.test(reason);
  if (!reused && (!v.data || v.data.isValid !== true)) return challenge("Payment not valid: " + (reason || "facilitator status " + v.status));
  const a = investigateText(message), flagged = (a.inj || 0) > 0 || a.source_type === "PROMPT_INJECTION";
  const payer = String((v.data && v.data.payer) || "").slice(0, 42);
  if (!reused) await deps.store({ id, ts: Date.now(), status: "pending", message, payer, agent: String(deps.agent || "").slice(0, 40), flagged, screen: { injection: a.inj || 0, type: a.source_type || null } });
  let s;
  try { s = await facilitatorCall(cfg, "settle", body); } catch (e) { return out({ status: "pending", id, error: "Settlement did not answer in time; the message is kept as pending. Do not sign again: repeat the same request with the same PAYMENT-SIGNATURE." }, 202, { "Retry-After": "10" }); }
  const tx = s.data && s.data.transaction, sreason = String((s.data && (s.data.errorReason || s.data.errorMessage)) || "");
  if (s.data && s.data.success === true) {
    deps.ctx.waitUntil(Promise.resolve(deps.update(id, { status: "paid", tx: tx || null })).then(() => deps.react({ id, flagged })).catch(() => {}));
    return new Response(JSON.stringify({ status: "stored", id, flagged_by_court: flagged, note: "Stored for the author. Not played aloud." }, null, 2), { status: 200, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "PAYMENT-RESPONSE": b64(JSON.stringify({ success: true, transaction: tx, network: s.data.network || cfg.network, payer })) } });
  }
  if (/^0x[0-9a-fA-F]{64}$/.test(tx || "") || s.status === 503 || s.status === 504 || /pending|timeout/i.test(sreason)) return out({ status: "pending", id, transaction: tx || null, error: "Payment is being settled. Do not sign again: repeat the same request with the same PAYMENT-SIGNATURE." }, 202, { "Retry-After": "5" });
  deps.ctx.waitUntil(Promise.resolve(deps.update(id, { status: "failed", reason: sreason.slice(0, 80) })).catch(() => {}));
  return challenge("Settlement failed: " + (sreason || "facilitator status " + s.status));
}

export const inboxPush = (list, entry) => [entry, ...(list || []).filter((e) => e.id !== entry.id)].slice(0, INBOX_MAX);
export const inboxPatch = (list, id, patch) => (list || []).map((e) => (e.id === id ? { ...e, ...patch } : e));
