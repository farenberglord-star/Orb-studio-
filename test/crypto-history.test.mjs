import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { radarSeries, spikesFromCandles, dailyTable, parseDays, buildCryptoHistory, handleCryptoHistory, CH_RESOURCE } from "../src/crypto-history.js";

const NOW = Date.parse("2026-11-24T07:00:00Z");
// получасовые уровни радара за 3 дня: 60 → 50 → 70
const ROWS = Array.from({ length: 144 }, (_, i) => ({ ts: NOW - (143 - i) * 18e5, k: i < 48 ? 60 : i < 96 ? 50 : 70 }));
// часовые свечи за 10 дней: спокойные ±0,1 %, одна свеча +6 % с объёмом ×8
function candles(spikeAtHoursAgo) {
  const out = []; let p = 100;
  for (let i = 240; i >= 1; i--) { const t = NOW - i * 3600e3, o = p; const big = i === spikeAtHoursAgo; p = o * (big ? 1.06 : i % 2 ? 1.001 : 0.999);
    out.push([t / 1000, String(o), String(Math.max(o, p)), String(Math.min(o, p)), String(p), String(p), String(big ? 80 : 10), 5]); }
  return out;
}

test("radar series is cut to the window and sorted", () => {
  const s = radarSeries(ROWS, NOW - 864e5, NOW);
  assert.equal(s.length, 48); assert.equal(s[0].level, 70); assert.ok(s[0].t < s[47].t);
});

test("spikes: the same rule as the volatility sensor, only inside the window", () => {
  const sp = spikesFromCandles("BTC", candles(5), NOW - 864e5);
  assert.equal(sp.length, 1); assert.equal(sp[0].coin, "BTC"); assert.equal(sp[0].move_pct, 6); assert.ok(sp[0].z >= 4);
  assert.equal(spikesFromCandles("BTC", candles(100), NOW - 864e5).length, 0, "spike older than the window is left out");
});

test("daily table: radar open/close per UTC day next to the coin move of the same day", () => {
  const d = dailyTable(radarSeries(ROWS, 0, NOW), { BTC: candles(5) });
  assert.ok(d.length >= 3);
  const last = d[d.length - 1]; assert.equal(last.radar_close, 70); assert.equal(typeof last.coin_move_pct.BTC, "number");
  assert.equal(d[0].coin_move_pct.BTC === null || typeof d[0].coin_move_pct.BTC === "number", true);
});

test("days: 1..30, anything else is an input error before payment", () => {
  assert.equal(parseDays(null), 30); assert.equal(parseDays("7"), 7);
  for (const v of ["0", "31", "2.5", "abc"]) assert.throws(() => parseDays(v), /1 to 30/);
});

test("free tier: 24 hours, offer for the full version; full tier: daily table and requested window", () => {
  const free = buildCryptoHistory({ rows: ROWS, candles: { BTC: candles(5) }, since: ROWS[0].ts, now: NOW });
  assert.equal(free.tier, "free"); assert.equal(free.radar.length, 48); assert.equal(free.daily, undefined);
  assert.equal(free.full_version.url, CH_RESOURCE + "?days=30"); assert.equal(free.full_version.price_usdc, 0.01);
  assert.equal(free.spikes.length, 1); assert.equal(free.history_since, new Date(ROWS[0].ts).toISOString());
  const full = buildCryptoHistory({ rows: ROWS, candles: { BTC: candles(5) }, days: 3, tier: "full", now: NOW });
  assert.equal(full.window.days, 3); assert.equal(full.radar.length, 144); assert.ok(Array.isArray(full.daily)); assert.equal(full.full_version, undefined);
  assert.deepEqual([full.summary.min, full.summary.max, full.summary.first, full.summary.last], [50, 70, 60, 70]);
});

const deps = (over = {}) => ({ ctx: { waitUntil() {} }, agent: "test", free: async () => buildCryptoHistory({ rows: ROWS, now: NOW }), full: async () => ({ ok: 1 }), hit: async () => {}, log: async () => {}, ...over });
const OPEN = { open: true, network: "eip155:8453", payTo: "0x0000000000000000000000000000000000000001", net: { asset: "0xusdc", name: "USD Coin", version: "2", label: "Base" } };

test("handler: free part answers 200; full part asks for 0.01 USDC; bad days answered before any payment", async () => {
  const f = await handleCryptoHistory(new Request("https://orbstudio.org/api/v1/crypto-history"), OPEN, deps());
  assert.equal(f.status, 200); assert.equal((await f.json()).tier, "free");
  const p = await handleCryptoHistory(new Request("https://orbstudio.org/api/v1/crypto-history/full?days=7"), OPEN, deps());
  assert.equal(p.status, 402); const b = await p.json(); assert.equal(b.accepts[0].amount, "10000"); assert.equal(b.resource.url, CH_RESOURCE);
  const bad = await handleCryptoHistory(new Request("https://orbstudio.org/api/v1/crypto-history/full?days=99"), OPEN, deps());
  assert.equal(bad.status, 402); assert.match((await bad.json()).input_note, /1 to 30/);
  const closed = await handleCryptoHistory(new Request("https://orbstudio.org/api/v1/crypto-history"), { ...OPEN, open: false }, deps());
  assert.equal((await closed.json()).full_version, undefined, "no offer while the sale is closed");
});

test("worker, agent card and llms.txt list the product", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /url\.pathname === "\/api\/v1\/crypto-history" \|\| url\.pathname === "\/api\/v1\/crypto-history\/full"/);
  assert.match(w, /no radar history/);
  const card = JSON.parse(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"));
  assert.ok(card.payments.items.some((i) => i.resource === CH_RESOURCE && i.price === "0.01 USDC"));
  assert.ok(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8").includes("/api/v1/crypto-history/full"));
});
