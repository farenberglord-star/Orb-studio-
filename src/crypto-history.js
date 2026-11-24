// ================= История крипто-радара: бесплатно за сутки, целиком за 0,01 USDC (x402) =================
// GET /api/v1/crypto-history        — бесплатно: уровень крипто-радара по получасам за последние 24 часа и всплески за сутки.
// GET /api/v1/crypto-history/full   — 0,01 USDC по x402 v2 (Base): до 30 дней (?days=1..30): уровень радара по получасам,
//                                     сводка по дням вместе с движением BTC, ETH, XRP, SOL за тот же день (Kraken),
//                                     и все всплески волатильности за период по тому же правилу, что и датчик volatility.
// Сегодняшние цены агент возьмёт у биржи сам; прошлые показания радара есть только у Orb Studio — за это и платят.
// История радара хранится с 12.11.2026 (ix_hist, колонка k), поэтому честно отдаём history_since.
// Товар собирается до списания (x402-flow.js): нет данных — деньги не списываются.
import { CORS } from "./violin-sale.js";
import { paidFlow, paymentRequiredFor, InputError } from "./x402-flow.js";

export const CH_PRICE_ATOMIC = "10000"; // 0,01 USDC
export const CH_PRICE_USD = 0.01;
export const CH_MAX_DAYS = 30;
const ORIGIN = "https://orbstudio.org";
export const CH_RESOURCE = ORIGIN + "/api/v1/crypto-history/full";
export const CH_COINS = { BTC: "XBTEUR", ETH: "ETHEUR", XRP: "XRPEUR", SOL: "SOLEUR" };
export const SPIKE_RULE = "spike = an hourly move ≥ 4 typical hourly moves (z, 30-day standard deviation), or hourly volume ≥ 5× the median hour of the past week together with a move ≥ 1.5 typical moves";
const DESCRIPTION = "Orb Studio crypto radar history for up to 30 days: radar level (0-100) every 30 minutes, daily open/close/min/max of the radar next to the same day's BTC, ETH, XRP and SOL close-to-close move (Kraken), and every hourly volatility spike in the period. Past radar readings exist only here. Indicator, not advice.";

const r2 = (x) => +x.toFixed(2);
const dayUtc = (t) => new Date(t).toISOString().slice(0, 10);

// Уровни радара: строки ix_hist { ts, k } → [{ t, level }] за окно
export function radarSeries(rows, from, to = Infinity) {
  return (rows || []).filter((x) => x && x.k != null && +x.ts > from && +x.ts <= to)
    .map((x) => ({ t: new Date(+x.ts).toISOString(), level: +x.k })).sort((a, b) => a.t.localeCompare(b.t));
}

// Всплески за окно по правилу датчика volatility. ohlc — строки Kraken [time_s, open, high, low, close, vwap, volume, count]
export function spikesFromCandles(coin, ohlc, from) {
  const rows = (ohlc || []).map((r) => ({ t: r[0] * 1000, o: +r[1], c: +r[4], v: +r[6] })).filter((r) => r.o > 0 && r.c > 0);
  if (rows.length < 50) return [];
  const ret = rows.slice(1).map((r, i) => Math.log(r.c / rows[i].c));
  const m = ret.reduce((a, b) => a + b, 0) / ret.length, sd = Math.sqrt(ret.reduce((a, b) => a + (b - m) ** 2, 0) / ret.length) || 1e-9;
  const med = (a) => { const b = a.slice().sort((x, y) => x - y); return b[Math.floor(b.length / 2)] || 1e-9; };
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    const end = rows[i].t + 3600e3; if (end < from) continue;
    const vr = rows[i].v / med(rows.slice(Math.max(0, i - 168), i).map((r) => r.v)), z = Math.log(rows[i].c / rows[i].o) / sd;
    if (Math.abs(z) >= 4 || (vr >= 5 && Math.abs(z) >= 1.5)) out.push({ coin, hour_end: new Date(end).toISOString(), move_pct: r2((rows[i].c / rows[i].o - 1) * 100), z: +z.toFixed(1), volume_vs_week_median: +vr.toFixed(1) });
  }
  return out;
}

// Сводка по дням (UTC): радар и движение монет за тот же день (закрытие последней свечи дня к закрытию предыдущего дня)
export function dailyTable(series, candles) {
  const days = new Map();
  for (const p of series) { const d = p.t.slice(0, 10); const a = days.get(d) || []; a.push(p.level); days.set(d, a); }
  const closeOf = {};
  for (const [coin, ohlc] of Object.entries(candles || {})) { const m = new Map(); for (const r of ohlc || []) m.set(dayUtc(r[0] * 1000 + 3600e3 - 1), +r[4]); closeOf[coin] = m; }
  const prevDay = (d) => new Date(Date.parse(d + "T12:00:00Z") - 864e5).toISOString().slice(0, 10);
  return [...days.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([d, lv]) => {
    const coins = {};
    for (const [coin, m] of Object.entries(closeOf)) { const c = m.get(d), p = m.get(prevDay(d)); coins[coin] = c && p ? r2((c / p - 1) * 100) : null; }
    return { day: d, points: lv.length, radar_open: lv[0], radar_close: lv[lv.length - 1], radar_min: Math.min(...lv), radar_max: Math.max(...lv), radar_change: lv[lv.length - 1] - lv[0], coin_move_pct: coins };
  });
}

export function parseDays(v) {
  if (v == null || v === "") return CH_MAX_DAYS;
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > CH_MAX_DAYS) throw new InputError(`days must be a whole number from 1 to ${CH_MAX_DAYS}`);
  return n;
}

// Чистая сборка: rows — ix_hist { ts, k }, candles — { BTC: ohlc, … }, since — первая запись истории радара
export function buildCryptoHistory({ rows = [], candles = {}, since = null, days = CH_MAX_DAYS, tier = "free", now = Date.now() }) {
  const span = tier === "full" ? days * 864e5 : 864e5, from = now - span;
  const series = radarSeries(rows, from, now);
  const spikes = Object.entries(candles).flatMap(([c, o]) => spikesFromCandles(c, o, from)).sort((a, b) => b.hour_end.localeCompare(a.hour_end));
  const lv = series.map((p) => p.level);
  const summary = lv.length ? { points: lv.length, first: lv[0], last: lv[lv.length - 1], change: lv[lv.length - 1] - lv[0], min: Math.min(...lv), max: Math.max(...lv), mean: r2(lv.reduce((a, b) => a + b, 0) / lv.length) } : null;
  const out = { product: "crypto-history", tier, generated_at: new Date(now).toISOString(), window: { from: new Date(from).toISOString(), to: new Date(now).toISOString(), days: tier === "full" ? days : 1 },
    history_since: since ? new Date(+since).toISOString() : null,
    note: "Orb Studio crypto radar: 0-100 index from crypto news headlines blended with Kraken 24h moves, saved every 30 minutes. Coin moves and spikes from Kraken public hourly candles. Indicator, not advice or a forecast.",
    spike_rule: SPIKE_RULE, summary, radar: series, spikes };
  if (tier === "full") out.daily = dailyTable(series, candles);
  else out.full_version = { url: CH_RESOURCE + "?days=" + CH_MAX_DAYS, price_usdc: CH_PRICE_USD, protocol: "x402 v2 (HTTP 402, USDC on Base)", what: "up to 30 days: radar every 30 min, daily radar vs BTC/ETH/XRP/SOL moves, all volatility spikes" };
  out.related = { track_record_free: ORIGIN + "/api/v1/trackrecord", radar_now: ORIGIN + "/api/v1/radar/crypto" };
  return out;
}

// ---------- x402 ----------
const BAZAAR = {
  info: { input: { type: "http", method: "GET", queryParams: { days: "30" } },
    output: { type: "json", example: { product: "crypto-history", tier: "full", window: { days: 30 }, summary: { points: 1440, first: 58, last: 61, min: 41, max: 74 },
      radar: [{ t: "2026-11-24T07:00:00.000Z", level: 61 }], daily: [{ day: "2026-11-23", radar_open: 64, radar_close: 61, radar_change: -3, coin_move_pct: { BTC: 1.1, ETH: 0.8 } }],
      spikes: [{ coin: "XRP", hour_end: "2026-11-23T18:00:00.000Z", move_pct: -1.57, z: -2.1, volume_vs_week_median: 7.9 }] } } },
  schema: { $schema: "https://json-schema.org/draft/2020-12/schema", type: "object",
    properties: { input: { type: "object", properties: { type: { type: "string", const: "http" }, method: { type: "string", enum: ["GET"] },
      queryParams: { type: "object", properties: { days: { type: "string", description: "1-30, default 30" } } } }, required: ["type", "method"], additionalProperties: false },
      output: { type: "object", properties: { type: { type: "string" }, example: { type: "object" } }, required: ["type"] } },
    required: ["input"] },
};
const OFFER = { atomic: CH_PRICE_ATOMIC, usd: CH_PRICE_USD, resource: CH_RESOURCE, description: DESCRIPTION, mimeType: "application/json", bazaar: BAZAAR,
  page: "/api/v1/crypto-history/full", product: "crypto-history", freeHint: ORIGIN + "/api/v1/crypto-history (last 24 hours)" };
export const cryptoHistoryPaymentRequired = (cfg, error) => paymentRequiredFor(cfg, OFFER, error);

const send = (data, extra = {}) => new Response(JSON.stringify(data, null, 2), { status: 200, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", ...extra } });

// deps: { ctx, agent, free() → history (24 ч), full(days) → history, hit, log }
export async function handleCryptoHistory(request, cfg, deps) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "GET" && request.method !== "HEAD") return new Response(JSON.stringify({ error: "Use GET" }), { status: 405, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });
  const url = new URL(request.url);
  if (!url.pathname.replace(/\/+$/, "").endsWith("/full")) {
    const h = await deps.free();
    if (!cfg.open) delete h.full_version;
    return send(h, { "Cache-Control": "public, max-age=300" });
  }
  let days = CH_MAX_DAYS, bad = null;
  try { days = parseDays(url.searchParams.get("days")); } catch (e) { bad = e.message; }
  return paidFlow(request, cfg, { ...OFFER, validate: () => bad, build: () => deps.full(days), deliver: (h, receipt) => send({ ...h, receipt }) }, deps);
}
