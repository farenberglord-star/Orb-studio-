import { test } from "node:test";
import assert from "node:assert/strict";
import { handleViolinMidi, saleConfig } from "../src/violin-sale.js";
import { ASSET, FACILITATOR, NETWORK, PROBE_PAY_TO, productionPayTo, testPiece } from "../scripts/x402-payai-sepolia.mjs";

const PRODUCTION = productionPayTo();
const PIECE = testPiece();

function ctx() {
  const jobs = [];
  return { jobs, waitUntil(p) { jobs.push(p); } };
}

function deps(piece = PIECE, options = {}) {
  return {
    ctx: options.ctx || ctx(),
    agent: "x402-unit",
    piece: async (day) => {
      if (!day) return { piece: options.latest || null, idx: { days: [] } };
      if (day === piece.day) return { piece: options.preview ? { ...piece, preview: true } : piece, idx: { days: [{ day: piece.day }] } };
      return { piece: null, idx: { days: [{ day: piece.day, title: piece.title }] } };
    },
    hit() {},
    log() {},
  };
}

function sepoliaEnv(extra = {}) {
  return {
    X402_NETWORK: NETWORK,
    X402_FACILITATOR_URL: FACILITATOR + "/",
    X402_PAY_TO: PROBE_PAY_TO,
    X402_PRICE_USD: "0.01",
    ...extra,
  };
}

function request(path, headers = {}) {
  return new Request("http://127.0.0.1" + path, { headers });
}

async function read(response) {
  const text = await response.text();
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: response.status, text, json, headers: response.headers };
}

function headerPayload(accepted, authorization) {
  return Buffer.from(JSON.stringify({
    x402Version: 2,
    accepted,
    payload: { signature: "0x" + "11".repeat(65), authorization },
  })).toString("base64");
}

test("Sepolia config uses PayAI only when Coinbase credentials are absent", () => {
  const cfg = saleConfig(sepoliaEnv());
  assert.equal(cfg.open, true);
  assert.equal(cfg.cdp, false);
  assert.equal(cfg.network, NETWORK);
  assert.equal(cfg.facilitator, FACILITATOR);
  assert.equal(cfg.net.asset, ASSET);
  assert.equal(cfg.atomic, "10000");
  assert.notEqual(cfg.payTo.toLowerCase(), PRODUCTION.toLowerCase());
  assert.equal(cfg.keyId, "");
  assert.equal(cfg.keySecret, "");
});

test("default network stays Base mainnet; Coinbase keys apply only when no facilitator URL is set", () => {
  const mainnet = saleConfig({ X402_PAY_TO: PRODUCTION, X402_FACILITATOR_URL: FACILITATOR });
  assert.equal(mainnet.network, "eip155:8453");
  assert.equal(mainnet.net.asset, "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913");
  assert.equal(mainnet.facilitator, FACILITATOR);

  const secret = Buffer.alloc(64, 3).toString("base64");
  const bound = saleConfig(sepoliaEnv({ X402_FACILITATOR_URL: "", CDP_API_KEY_ID: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", CDP_API_KEY_SECRET: secret }));
  assert.equal(bound.cdp, true);
  assert.equal(bound.facilitator, "https://api.cdp.coinbase.com/platform/v2/x402");

  const malformed = saleConfig(sepoliaEnv({ X402_FACILITATOR_URL: "", CDP_API_KEY_ID: { name: "whole-json-placeholder" }, CDP_API_KEY_SECRET: "not-a-key" }));
  assert.equal(malformed.cdp, true);
  assert.equal(malformed.facilitator, "https://api.cdp.coinbase.com/platform/v2/x402");
  assert.equal(malformed.keyId, "[object Object]");
});

test("a missing or preview piece is a 404 before any facilitator call", async () => {
  let called = 0;
  global.fetch = async () => { called += 1; throw new Error("facilitator must not be called"); };
  const cfg = saleConfig(sepoliaEnv());
  const missing = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=2026-11-06"), cfg, deps()));
  const preview = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day), cfg, deps(PIECE, { preview: true })));
  assert.equal(missing.status, 404);
  assert.equal(missing.json.error, "No composed piece for this day yet");
  assert.equal(preview.status, 404);
  assert.equal(called, 0);
});

test("the challenge is x402 v2 Base Sepolia and names the production resource URL", async () => {
  const cfg = saleConfig(sepoliaEnv());
  const res = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day), cfg, deps()));
  assert.equal(res.status, 402);
  assert.equal(res.json.x402Version, 2);
  assert.equal(res.json.accepts[0].scheme, "exact");
  assert.equal(res.json.accepts[0].network, NETWORK);
  assert.equal(res.json.accepts[0].amount, "10000");
  assert.equal(res.json.accepts[0].asset, ASSET);
  assert.equal(res.json.accepts[0].payTo, PROBE_PAY_TO);
  assert.equal(res.json.accepts[0].extra.name, "USDC");
  assert.equal(res.json.accepts[0].extra.version, "2");
  assert.equal(res.json.accepts[0].maxTimeoutSeconds, 120);
  assert.equal(res.json.resource.url, "https://orbstudio.org/api/v1/violin/midi");
  const header = JSON.parse(Buffer.from(res.headers.get("PAYMENT-REQUIRED"), "base64").toString());
  assert.equal(header.accepts[0].network, NETWORK);
  assert.equal(header.how_to_pay, undefined);
});

test("version, network, amount and recipient mismatches never reach the facilitator", async () => {
  const calls = [];
  global.fetch = async (url) => { calls.push(String(url)); return Response.json({ isValid: true }); };
  const cfg = saleConfig(sepoliaEnv());
  const first = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day), cfg, deps()));
  const accepted = first.json.accepts[0];
  const cases = [
    { x402Version: 1, accepted },
    { x402Version: 2, accepted: { ...accepted, network: "eip155:8453" } },
    { x402Version: 2, accepted: { ...accepted, amount: "1" } },
    { x402Version: 2, accepted: { ...accepted, asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" } },
    { x402Version: 2, accepted: { ...accepted, payTo: PRODUCTION } },
  ];
  for (const payload of cases) {
    const encoded = Buffer.from(JSON.stringify(payload)).toString("base64");
    const res = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps()));
    assert.equal(res.status, 402);
    assert.match(res.json.error, /does not match|Invalid PAYMENT-SIGNATURE|Payment required/);
  }
  assert.equal(calls.length, 0);
});

test("PayAI invalidReason is surfaced and invalidMessage alone is not", async () => {
  const bodies = [
    { isValid: false, invalidReason: "invalid_exact_evm_payload_authorization_valid_before", invalidMessage: "expired" },
    { isValid: false, invalidMessage: "expired" },
  ];
  let n = 0;
  global.fetch = async () => Response.json(bodies[n++]);
  const cfg = saleConfig(sepoliaEnv());
  const first = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day), cfg, deps()));
  const encoded = headerPayload(first.json.accepts[0], { from: PROBE_PAY_TO, to: PROBE_PAY_TO, value: "10000", validAfter: "0", validBefore: "1", nonce: "0x" + "22".repeat(32) });
  const expired = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps()));
  const opaque = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps()));
  assert.match(expired.json.error, /invalid_exact_evm_payload_authorization_valid_before/);
  assert.match(opaque.json.error, /facilitator status 200/);
});

test("a successful mock settlement returns the labelled fixture MIDI once", async () => {
  const calls = [];
  global.fetch = async (url, init) => {
    calls.push({ url: String(url), authorization: !!(init.headers && init.headers.Authorization) });
    if (String(url).endsWith("/verify")) return Response.json({ isValid: true, payer: "0x" + "11".repeat(20) });
    return Response.json({ success: true, transaction: "0x" + "ab".repeat(32), network: NETWORK, payer: "0x" + "11".repeat(20) });
  };
  const cfg = saleConfig(sepoliaEnv());
  const first = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day), cfg, deps()));
  const encoded = headerPayload(first.json.accepts[0], { from: "0x" + "11".repeat(20), to: PROBE_PAY_TO, value: "10000", validAfter: "0", validBefore: "9999999999", nonce: "0x" + "33".repeat(32) });
  const paid = await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps());
  const bytes = new Uint8Array(await paid.arrayBuffer());
  assert.equal(paid.status, 200);
  assert.equal(paid.headers.get("content-type"), "audio/midi");
  assert.equal(String.fromCharCode(...bytes.slice(0, 4)), "MThd");
  assert.match(new TextDecoder().decode(bytes), /TEST FIXTURE/);
  const receipt = JSON.parse(Buffer.from(paid.headers.get("PAYMENT-RESPONSE"), "base64").toString());
  assert.equal(receipt.success, true);
  assert.equal(calls.map((c) => c.url).join(" "), FACILITATOR + "/verify " + FACILITATOR + "/settle");
  assert.equal(calls.every((c) => c.authorization === false), true);
});

test("the worker does not remember a receipt, so a used nonce does not return MIDI again", async () => {
  let verifies = 0;
  global.fetch = async (url) => {
    if (String(url).endsWith("/verify")) {
      verifies += 1;
      return Response.json(verifies === 1 ? { isValid: true, payer: "0x" + "11".repeat(20) } : { isValid: false, invalidReason: "invalid_exact_evm_payload_signature" });
    }
    return Response.json({ success: true, transaction: "0x" + "ab".repeat(32), network: NETWORK, payer: "0x" + "11".repeat(20) });
  };
  const cfg = saleConfig(sepoliaEnv());
  const first = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day), cfg, deps()));
  const encoded = headerPayload(first.json.accepts[0], { from: "0x" + "11".repeat(20), to: PROBE_PAY_TO, value: "10000", validAfter: "0", validBefore: "9999999999", nonce: "0x" + "44".repeat(32) });
  const ok = await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps());
  const again = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps()));
  assert.equal(ok.status, 200);
  assert.equal(again.status, 402);
  assert.match(again.json.error, /invalid_exact_evm_payload_signature/);
});

test("settle HTTP 503 and settlement_pending are reported as pending, not as a refusal", async () => {
  const responses = [
    { status: 503, body: { success: false, errorReason: "service_unavailable", transaction: "0x" + "cd".repeat(32), network: NETWORK, payer: "" } },
    { status: 200, body: { success: false, errorReason: "settlement_pending", transaction: "0x" + "ef".repeat(32), network: NETWORK, payer: "0x" + "11".repeat(20) } },
  ];
  let n = 0;
  global.fetch = async (url) => {
    if (String(url).endsWith("/verify")) return Response.json({ isValid: true, payer: "0x" + "11".repeat(20) });
    const next = responses[n++];
    return Response.json(next.body, { status: next.status });
  };
  const cfg = saleConfig(sepoliaEnv());
  const first = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day), cfg, deps()));
  const encoded = headerPayload(first.json.accepts[0], { from: "0x" + "11".repeat(20), to: PROBE_PAY_TO, value: "10000", validAfter: "0", validBefore: "9999999999", nonce: "0x" + "55".repeat(32) });
  const unavailable = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps()));
  const pending = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps()));
  // 503 и settlement_pending — незавершённый исход: 202 «в обработке», а не отказ 402; клиент повторяет ту же подпись
  assert.equal(unavailable.status, 202);
  assert.equal(pending.status, 202);
  for (const res of [unavailable, pending]) {
    assert.equal(res.json.status, "pending");
    assert.match(res.json.message, /same PAYMENT-SIGNATURE/);
  }
  assert.equal(pending.json.transaction, "0x" + "ef".repeat(32));
});

test("a settle timeout is not reported as an unpaid verify failure", async () => {
  let phase = "verify";
  global.fetch = async () => {
    if (phase === "verify") { phase = "settle"; return Response.json({ isValid: true, payer: "0x" + "11".repeat(20) }); }
    throw new Error("The operation was aborted due to timeout");
  };
  const cfg = saleConfig(sepoliaEnv());
  const first = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day), cfg, deps()));
  const encoded = headerPayload(first.json.accepts[0], { from: "0x" + "11".repeat(20), to: PROBE_PAY_TO, value: "10000", validAfter: "0", validBefore: "9999999999", nonce: "0x" + "66".repeat(32) });
  const res = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps()));
  assert.equal(res.status, 502);
  assert.doesNotMatch(res.json.error, /nothing was charged/);
  assert.match(res.json.error, /If your wallet shows a transfer/);
  assert.match(res.json.error, /same PAYMENT-SIGNATURE/);
});

test("Coinbase mode never posts the JWT to PayAI", async () => {
  const calls = [];
  global.fetch = async (url, init) => {
    calls.push({ url: String(url), authorization: init.headers && init.headers.Authorization });
    if (String(url).endsWith("/verify")) return Response.json({ isValid: false, invalidReason: "invalid_payload" });
    throw new Error("settle must not run");
  };
  const key = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign"]);
  const jwk = await crypto.subtle.exportKey("jwk", key.privateKey);
  const secret = Buffer.concat([Buffer.from(jwk.d, "base64url"), Buffer.from(jwk.x, "base64url")]).toString("base64");
  const cfg = saleConfig(sepoliaEnv({
    X402_FACILITATOR_URL: "",
    CDP_API_KEY_ID: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    CDP_API_KEY_SECRET: secret,
  }));
  const first = await read(await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day), cfg, deps()));
  const encoded = headerPayload(first.json.accepts[0], { from: "0x" + "11".repeat(20), to: PROBE_PAY_TO, value: "10000", validAfter: "0", validBefore: "9999999999", nonce: "0x" + "77".repeat(32) });
  await handleViolinMidi(request("/api/v1/violin/midi?date=" + PIECE.day, { "PAYMENT-SIGNATURE": encoded }), cfg, deps());
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /^https:\/\/api\.cdp\.coinbase\.com\//);
  assert.equal(calls[0].url.includes("payai"), false);
  assert.equal(String(calls[0].authorization).slice(0, 7), "Bearer ");
});

test("an explicit X402_FACILITATOR_URL beats leftover Coinbase keys", async () => {
  const cfg = saleConfig({ ...sepoliaEnv(), CDP_API_KEY_ID: "x", CDP_API_KEY_SECRET: "y" });
  assert.equal(cfg.cdp, false);
  assert.equal(cfg.facilitator, FACILITATOR);
});
