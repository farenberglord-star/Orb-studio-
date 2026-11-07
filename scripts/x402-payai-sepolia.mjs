// Isolated PayAI x402 check for the violin MIDI paywall.
// Base Sepolia only. No Coinbase credentials, no /settle, no production recipient.
import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { handleViolinMidi, saleConfig } from "../src/violin-sale.js";

export const FACILITATOR = "https://facilitator.payai.network";
export const NETWORK = "eip155:84532";
export const ASSET = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";
export const PROBE_PAY_TO = "0x2222222222222222222222222222222222222222";
const CDP_ENV = ["CDP_API_KEY_ID", "CDP_API_KEY_SECRET", "CDP_API_KEY_PRIVATE_KEY"];

export function productionPayTo() {
  const text = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
  const m = text.match(/^X402_PAY_TO\s*=\s*"([^"]+)"/m);
  if (!m) throw new Error("production X402_PAY_TO missing from wrangler.toml");
  return m[1];
}

export function assertNoCdpEnv(env = process.env) {
  for (const key of CDP_ENV) {
    if (env[key]) throw new Error("Refusing to run: " + key + " is set. This harness does not use Coinbase credentials.");
  }
}

export function isolatedConfig(payTo, env = process.env) {
  assertNoCdpEnv(env);
  if (env.X402_NETWORK && env.X402_NETWORK !== NETWORK) {
    throw new Error("Refusing network " + env.X402_NETWORK + "; this harness allows only " + NETWORK);
  }
  const production = productionPayTo();
  if (!payTo || payTo.toLowerCase() === production.toLowerCase()) {
    throw new Error("Refusing the production recipient. Use a new disposable Base Sepolia address.");
  }
  if (!/^0x[0-9a-fA-F]{40}$/.test(payTo)) throw new Error("X402_PAY_TO must be a 20-byte hex address");
  const cfg = saleConfig({
    X402_NETWORK: NETWORK,
    X402_FACILITATOR_URL: FACILITATOR,
    X402_PAY_TO: payTo,
    X402_PRICE_USD: env.X402_PRICE_USD || "0.01",
  });
  if (cfg.cdp || cfg.network !== NETWORK || cfg.facilitator !== FACILITATOR) {
    throw new Error("Isolated config resolved to a non-PayAI or non-Sepolia facilitator");
  }
  return cfg;
}

export function testPiece() {
  return JSON.parse(readFileSync(new URL("../test/fixtures/violin-x402-piece.json", import.meta.url), "utf8"));
}

function depsFor(piece) {
  return {
    ctx: { waitUntil() {} },
    agent: "x402-isolated-test",
    piece: async (day) => {
      if (day === piece.day) return { piece, idx: { days: [{ day: piece.day, title: piece.title }] } };
      if (day === "1999-01-02") return { piece: { ...piece, day, preview: true, title: "TEST FIXTURE preview" }, idx: { days: [] } };
      return { piece: null, idx: { days: [] } };
    },
    hit() {},
    log() {},
  };
}

async function localRoundTrip() {
  const piece = testPiece();
  const cfg = isolatedConfig(PROBE_PAY_TO);
  const deps = depsFor(piece);
  const server = createServer(async (req, res) => {
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) for (const item of value) headers.append(key, item);
      else if (value != null) headers.set(key, value);
    }
    const response = await handleViolinMidi(new Request("http://127.0.0.1" + req.url, { method: req.method, headers }), cfg, deps);
    const body = Buffer.from(await response.arrayBuffer());
    const out = {};
    response.headers.forEach((value, key) => { out[key] = value; });
    res.writeHead(response.status, out);
    res.end(body);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  try {
    const challenge = await fetch(`http://127.0.0.1:${port}/api/v1/violin/midi?date=${piece.day}`);
    const challengeBody = await challenge.json();
    const missing = await fetch(`http://127.0.0.1:${port}/api/v1/violin/midi?date=2026-11-06`);
    const preview = await fetch(`http://127.0.0.1:${port}/api/v1/violin/midi?date=1999-01-02`);
    if (challenge.status !== 402) throw new Error("local challenge status " + challenge.status);
    if (challengeBody.x402Version !== 2 || challengeBody.accepts?.[0]?.network !== NETWORK) throw new Error("local challenge is not x402 v2 Base Sepolia");
    if (challengeBody.accepts[0].asset.toLowerCase() !== ASSET.toLowerCase()) throw new Error("local challenge asset is not Base Sepolia USDC");
    if (challengeBody.accepts[0].payTo.toLowerCase() === productionPayTo().toLowerCase()) throw new Error("local challenge used the production recipient");
    if (missing.status !== 404 || preview.status !== 404) throw new Error("missing or preview piece was not a 404");
    return { port, challenge: challenge.status, missing: missing.status, preview: preview.status, amount: challengeBody.accepts[0].amount };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

async function payaiCheck() {
  assertNoCdpEnv();
  const supportedRes = await fetch(FACILITATOR + "/supported", { signal: AbortSignal.timeout(20000) });
  const supported = await supportedRes.json();
  const kind = (supported.kinds || []).find((item) => item.x402Version === 2 && item.scheme === "exact" && item.network === NETWORK);
  const rate = ((supported.pricing || {}).rates || []).find((item) => item.network === NETWORK && item.scheme === "exact" && item.transferMethod === "eip3009");
  const requirements = {
    scheme: "exact", network: NETWORK, amount: "10000", asset: ASSET, payTo: PROBE_PAY_TO, maxTimeoutSeconds: 120,
    extra: { name: "USDC", version: "2" },
  };
  const now = Math.floor(Date.now() / 1000);
  const verifyBody = {
    x402Version: 2,
    paymentPayload: {
      x402Version: 2,
      accepted: requirements,
      payload: {
        signature: "0x" + "00".repeat(65),
        authorization: {
          from: "0x1111111111111111111111111111111111111111", to: PROBE_PAY_TO, value: "10000",
          validAfter: "0", validBefore: String(now + 90), nonce: "0x" + "11".repeat(32),
        },
      },
    },
    paymentRequirements: requirements,
  };
  const verifyRes = await fetch(FACILITATOR + "/verify", {
    method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(verifyBody), signal: AbortSignal.timeout(20000),
  });
  const verify = await verifyRes.json();
  return {
    supported_status: supportedRes.status,
    sepolia_exact_v2: !!kind,
    asset_matches_code: ASSET,
    rate: rate ? { credits: rate.credits, usd: rate.usd, effectiveAt: rate.effectiveAt, rateId: rate.rateId } : null,
    creditUsd: supported.pricing && supported.pricing.creditUsd,
    marginBps: supported.pricing && supported.pricing.marginBps,
    verify_status: verifyRes.status,
    verify_isValid: verify.isValid,
    verify_invalidReason: verify.invalidReason || null,
    settle_called: false,
  };
}

export async function main() {
  const local = await localRoundTrip();
  const payai = await payaiCheck();
  const report = { local, payai };
  console.log(JSON.stringify(report, null, 2));
  if (!payai.sepolia_exact_v2 || payai.verify_isValid !== false || payai.settle_called !== false) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(String(error && error.message || error));
    process.exit(1);
  });
}
