// ================= Продажа «Скрипки дня» агентам: MIDI-файл за USDC по протоколу x402 (v2) =================
// GET /api/v1/violin/midi?date=YYYY-MM-DD → 402 Payment Required (заголовок PAYMENT-REQUIRED) →
// агент платит (заголовок PAYMENT-SIGNATURE, подпись EIP-3009 из СВОЕГО кошелька) → фасилитатор проверяет
// и проводит платёж (/verify, /settle) → агент получает .mid файл и квитанцию PAYMENT-RESPONSE.
//
// Безопасность:
// • Модуль получает только свои настройки (cfg), а не env: ключи Kraken, Anthropic и прочие секреты ему не видны.
// • Сайт хранит лишь ПУБЛИЧНЫЙ адрес кошелька для приёма (X402_PAY_TO). Приватного ключа на сервере нет,
//   поэтому даже взлом сайта не позволяет вывести деньги. Деньги идут от покупателя прямо на этот адрес.
// • Файл отдаётся только ПОСЛЕ успешного settle (повтор той же подписи не пройдёт: nonce одноразовый).
// • Пока X402_PAY_TO не задан, продажа выключена (503), остальное API работает как раньше.

const NETS = {
  "eip155:8453": { label: "Base", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", name: "USD Coin", version: "2" },
  "eip155:84532": { label: "Base Sepolia (testnet)", asset: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", name: "USDC", version: "2" },
};
const CDP_HOST = "api.cdp.coinbase.com", CDP_ROUTE = "/platform/v2/x402";
const RESOURCE = "https://orbstudio.org/api/v1/violin/midi";
const DESCRIPTION = "Violin of the day as a Standard MIDI File: a short solo violin piece that Claude composes once a day from Orb Studio's open market and network sensors (funding, fees, rates, FX). Program 40 (violin), tempo, meter, dynamics as velocity, articulations. Import into any DAW or notation app. Free text version with ABC score: https://orbstudio.org/api/v1/violin";
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "PAYMENT-SIGNATURE, X-PAYMENT, Content-Type, X-Agent-Name",
  "Access-Control-Expose-Headers": "PAYMENT-REQUIRED, PAYMENT-RESPONSE",
};

// ---------- MIDI (Standard MIDI File, формат 0) из нот пьесы ----------
const NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const VEL = { pp: 32, p: 48, mp: 64, mf: 80, f: 96, ff: 112 };
const GATE = { legato: 0.98, detache: 0.85, staccato: 0.45, accent: 0.9, tremolo: 1, pizzicato: 0.35 };
function midiPitch(p) {
  const m = /^([A-G])([#b]?)([3-7])$/.exec(String(p || ""));
  return m ? 12 * (+m[3] + 1) + NOTE[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) : null;
}
const vlq = (n) => { const b = [n & 0x7f]; while ((n >>= 7)) b.unshift((n & 0x7f) | 0x80); return b; };
const txt = (s) => [...new TextEncoder().encode(String(s || "").slice(0, 120))];
export function violinToMidi(piece) {
  const PPQ = 480, ev = []; // [tick, bytes]
  const meta = (type, data) => [0xff, type, ...vlq(data.length), ...data];
  const us = Math.round(60000000 / Math.min(240, Math.max(30, +piece.bpm || 72)));
  const [num, den] = String(piece.meter || "4/4").split("/").map(Number);
  ev.push([0, meta(0x03, txt(piece.title || "Violin of the day"))]);
  ev.push([0, meta(0x02, txt(`Orb Studio · orbstudio.org · ${piece.day || ""}`))]);
  ev.push([0, meta(0x51, [(us >> 16) & 255, (us >> 8) & 255, us & 255])]);
  ev.push([0, meta(0x58, [num || 4, Math.round(Math.log2(den || 4)), 24, 8])]);
  let t = 0, prog = -1;
  for (const n of piece.notes || []) {
    const [pitch, beats, dyn, art] = n, len = Math.round((+beats || 0) * PPQ);
    if (!len) continue;
    const key = pitch === "r" ? null : midiPitch(pitch);
    if (key != null) {
      const want = art === "pizzicato" ? 45 : 40;
      if (want !== prog) { ev.push([t, [0xc0, want]]); prog = want; }
      const vel = Math.min(127, (VEL[dyn] || 80) + (art === "accent" ? 16 : 0));
      if (art === "tremolo") { // тремоло: повторяющиеся шестнадцатые
        const step = PPQ / 4;
        for (let s = 0; s < len; s += step) { ev.push([t + s, [0x90, key, vel]]); ev.push([t + Math.min(len, s + step) - 1, [0x80, key, 0]]); }
      } else {
        ev.push([t, [0x90, key, vel]]);
        ev.push([t + Math.max(1, Math.round(len * (GATE[art] || 0.95))), [0x80, key, 0]]);
      }
    }
    t += len;
  }
  ev.push([t + PPQ / 2, meta(0x2f, [])]);
  ev.sort((a, b) => a[0] - b[0] || (a[1][0] === 0x80 ? -1 : 0) - (b[1][0] === 0x80 ? -1 : 0));
  const track = []; let last = 0;
  for (const [tick, bytes] of ev) { track.push(...vlq(tick - last), ...bytes); last = tick; }
  const u32 = (n) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
  return new Uint8Array([0x4d, 0x54, 0x68, 0x64, ...u32(6), 0, 0, 0, 1, (PPQ >> 8) & 255, PPQ & 255, 0x4d, 0x54, 0x72, 0x6b, ...u32(track.length), ...track]);
}

// ---------- base64 / JWT для фасилитатора Coinbase CDP (WebCrypto, без зависимостей) ----------
const b64 = (s) => btoa(String.fromCharCode(...new TextEncoder().encode(s)));
const unb64 = (s) => new TextDecoder().decode(Uint8Array.from(atob(s), (c) => c.charCodeAt(0)));
const b64url = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export async function cdpJwt(keyId, secret, method, path, now = Math.floor(Date.now() / 1000)) {
  const nonceBytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = [...nonceBytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  const claims = { sub: keyId, iss: "cdp", uris: [`${method} ${CDP_HOST}${path}`], iat: now, nbf: now, exp: now + 120 };
  let alg, key, signAlg;
  const s = String(secret || "").trim();
  if (s.includes("BEGIN PRIVATE KEY")) { // EC P-256 в PKCS#8
    const der = Uint8Array.from(atob(s.replace(/-----[^-]+-----|\s+/g, "")), (c) => c.charCodeAt(0));
    key = await crypto.subtle.importKey("pkcs8", der, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
    alg = "ES256"; signAlg = { name: "ECDSA", hash: "SHA-256" };
  } else { // Ed25519: base64 из 64 байт (32 seed + 32 public)
    const raw = Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
    if (raw.length !== 64) throw new Error("CDP_API_KEY_SECRET: expected Ed25519 base64 (64 bytes) or PKCS#8 EC PEM");
    key = await crypto.subtle.importKey("jwk", { kty: "OKP", crv: "Ed25519", d: b64url(raw.subarray(0, 32)), x: b64url(raw.subarray(32)) }, { name: "Ed25519" }, false, ["sign"]);
    alg = "EdDSA"; signAlg = { name: "Ed25519" };
  }
  const enc = (o) => b64url(new TextEncoder().encode(JSON.stringify(o)));
  const head = enc({ alg, kid: keyId, typ: "JWT", nonce }) + "." + enc(claims);
  const sig = new Uint8Array(await crypto.subtle.sign(signAlg, key, new TextEncoder().encode(head)));
  return head + "." + b64url(sig);
}

// ---------- настройки ----------
export function saleConfig(env) {
  const network = env.X402_NETWORK || "eip155:8453", net = NETS[network];
  const payTo = String(env.X402_PAY_TO || "").trim();
  const usd = Math.min(5, Math.max(0.001, +(env.X402_PRICE_USD || 0.01)));
  const cdp = !!(env.CDP_API_KEY_ID && env.CDP_API_KEY_SECRET);
  const facilitator = cdp ? `https://${CDP_HOST}${CDP_ROUTE}` : String(env.X402_FACILITATOR_URL || "").replace(/\/+$/, "");
  const problems = [];
  if (!/^0x[0-9a-fA-F]{40}$/.test(payTo)) problems.push("receiving wallet (X402_PAY_TO) is not set");
  if (!net) problems.push("unsupported network " + network);
  if (!facilitator) problems.push("no facilitator: set CDP_API_KEY_ID + CDP_API_KEY_SECRET (mainnet) or X402_FACILITATOR_URL (testnet)");
  return { open: problems.length === 0, problems, network, net, payTo, usd, atomic: String(Math.round(usd * 1e6)), cdp, facilitator,
    keyId: env.CDP_API_KEY_ID, keySecret: env.CDP_API_KEY_SECRET };
}

function requirements(cfg) {
  return { scheme: "exact", network: cfg.network, amount: cfg.atomic, asset: cfg.net.asset, payTo: cfg.payTo, maxTimeoutSeconds: 120,
    extra: { name: cfg.net.name, version: cfg.net.version } };
}
function paymentRequired(cfg, error) {
  return {
    x402Version: 2,
    error: error || "Payment required",
    resource: { url: RESOURCE, description: DESCRIPTION, mimeType: "audio/midi" },
    accepts: [requirements(cfg)],
    extensions: {
      bazaar: {
        info: {
          input: { type: "http", method: "GET", queryParams: { date: "2026-11-04" } },
          output: { type: "binary", example: { contentType: "audio/midi", filename: "orb-violin-2026-11-04.mid", format: "SMF type 0, 480 PPQ, program 40 (violin)" } },
        },
        schema: {
          $schema: "https://json-schema.org/draft/2020-12/schema", type: "object",
          properties: {
            input: { type: "object", properties: { type: { type: "string", const: "http" }, method: { type: "string", enum: ["GET"] },
              queryParams: { type: "object", properties: { date: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "Day of the piece, YYYY-MM-DD. Default: latest piece. List of days: archive in https://orbstudio.org/api/v1/violin" } } } },
              required: ["type", "method"], additionalProperties: false },
            output: { type: "object", properties: { type: { type: "string" }, example: { type: "object" } }, required: ["type"] },
          },
          required: ["input"],
        },
      },
    },
  };
}

const sameAddr = (a, b) => String(a || "").toLowerCase() === String(b || "").toLowerCase();
function matches(req, acc) {
  return acc && acc.scheme === req.scheme && acc.network === req.network && String(acc.amount) === req.amount &&
    sameAddr(acc.asset, req.asset) && sameAddr(acc.payTo, req.payTo);
}

async function facilitatorCall(cfg, op, body) {
  const headers = { "Content-Type": "application/json" };
  if (cfg.cdp) headers.Authorization = "Bearer " + (await cdpJwt(cfg.keyId, cfg.keySecret, "POST", `${CDP_ROUTE}/${op}`));
  const r = await fetch(`${cfg.facilitator}/${op}`, { method: "POST", headers, body: JSON.stringify(body), signal: AbortSignal.timeout(25000) });
  const text = await r.text();
  let data = null; try { data = JSON.parse(text); } catch (e) {}
  return { status: r.status, data, text: text.slice(0, 300) };
}

// deps: { piece(day) → {piece, idx}, hit(page, kind, name), log(kind, data), ctx }
export async function handleViolinMidi(request, cfg, deps) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const out = (data, status, extra = {}) => new Response(JSON.stringify(data, null, 2), { status, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra } });
  if (request.method !== "GET" && request.method !== "HEAD") return out({ error: "Use GET" }, 405);
  const url = new URL(request.url);
  const d = (url.searchParams.get("date") || url.searchParams.get("day") || "").match(/^\d{4}-\d{2}-\d{2}$/);
  const { piece, idx } = await deps.piece(d ? d[0] : null);
  if (!piece || piece.preview) return out({ error: "No composed piece for this day yet", archive: ((idx && idx.days) || []).slice(0, 30) }, 404);
  const who = (deps.agent || "unknown").slice(0, 40);

  if (!cfg.open) {
    deps.ctx.waitUntil(deps.hit("/api/v1/violin/midi", "x402", "closed · " + who));
    return out({ status: "sale_not_open_yet", note: "Paid MIDI download is being set up. The full piece is free as text (ABC score and note list).", free: "https://orbstudio.org/api/v1/violin", listen_url: `https://orbstudio.org/violin?day=${piece.day}` }, 503, { "Retry-After": "86400" });
  }

  const pr = paymentRequired(cfg);
  const challenge = (error, extraBody = {}) => {
    const body = paymentRequired(cfg, error);
    return out({ ...body, ...extraBody, how_to_pay: "x402 v2: sign the accepts[0] requirement with an EVM wallet holding USDC on " + cfg.net.label + " and repeat the request with the PAYMENT-SIGNATURE header (base64 JSON). Price: " + cfg.usd + " USDC. Free text version: https://orbstudio.org/api/v1/violin" },
      402, { "PAYMENT-REQUIRED": b64(JSON.stringify(body)) });
  };

  const header = request.headers.get("PAYMENT-SIGNATURE") || request.headers.get("X-PAYMENT");
  if (!header) {
    deps.ctx.waitUntil(deps.hit("/api/v1/violin/midi", "x402", "challenge · " + who));
    return challenge();
  }
  let payload;
  try {
    if (header.length > 12000) throw new Error("too long");
    payload = JSON.parse(unb64(header.trim()));
  } catch (e) { return challenge("Invalid PAYMENT-SIGNATURE header (expected base64 JSON)"); }
  const req = pr.accepts[0];
  if (payload.x402Version !== 2 || !matches(req, payload.accepted)) return challenge("Payment does not match the requirements (x402Version 2, scheme, network, amount, asset, payTo)");

  const body = { x402Version: 2, paymentPayload: payload, paymentRequirements: req };
  let v;
  try { v = await facilitatorCall(cfg, "verify", body); } catch (e) { return out({ error: "Payment facilitator unavailable, nothing was charged. Try again later." }, 503, { "Retry-After": "60" }); }
  if (!v.data || v.data.isValid !== true) {
    deps.ctx.waitUntil(deps.hit("/api/v1/violin/midi", "x402", "invalid · " + who));
    return challenge("Payment not valid: " + ((v.data && (v.data.invalidReason || v.data.errorMessage)) || "facilitator status " + v.status));
  }
  let s;
  try { s = await facilitatorCall(cfg, "settle", body); } catch (e) { return out({ error: "Settlement failed, nothing was delivered. If your wallet shows a transfer, contact the site via https://orbstudio.org/.well-known/security.txt" }, 502); }
  if (!s.data || s.data.success !== true) {
    deps.ctx.waitUntil(deps.hit("/api/v1/violin/midi", "x402", "settle-failed · " + who));
    return challenge("Settlement failed: " + ((s.data && (s.data.errorReason || s.data.errorMessage)) || "facilitator status " + s.status));
  }

  const payer = String(s.data.payer || (v.data && v.data.payer) || "").slice(0, 42);
  deps.ctx.waitUntil(Promise.all([
    deps.hit("/api/v1/violin/midi", "x402-sale", who + " · " + payer),
    deps.log("sale", { day: piece.day, payer, agent: who, tx: s.data.transaction, network: s.data.network || cfg.network, usdc: cfg.usd, ts: Date.now() }),
  ]).catch(() => {}));
  const midi = violinToMidi(piece);
  const receipt = { success: true, transaction: s.data.transaction, network: s.data.network || cfg.network, payer };
  return new Response(request.method === "HEAD" ? null : midi, { status: 200, headers: { ...CORS, "Content-Type": "audio/midi",
    "Content-Disposition": `attachment; filename="orb-violin-${piece.day}.mid"`, "Cache-Control": "no-store", "PAYMENT-RESPONSE": b64(JSON.stringify(receipt)) } });
}

// Краткая информация о продаже для карточки get_violin и /api/v1/violin
export function saleInfo(cfg, day) {
  return cfg.open
    ? { midi_url: RESOURCE + (day ? "?date=" + day : ""), price_usdc: cfg.usd, network: cfg.network, protocol: "x402 v2 (HTTP 402, USDC)", note: "Optional paid download of this piece as a MIDI file. The text version here stays free." }
    : undefined;
}
