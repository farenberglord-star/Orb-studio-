// «Число против датчика»: заметка или ответ называет число, которое мы сами измеряем, — сверяем с датчиком /api/v1/sensors.
// Совпало — подтверждено измерением, разошлось — опровергнуто, рядом — не точно. Без названного числа отдаём наше значение с источником и временем.
// Без ИИ; датчик старше своего допуска не судит. Измеряем: цена BTC/ETH/XRP/SOL, финансирование и открытый интерес BTC, комиссия сети Bitcoin,
// ставка ЕЦБ по депозитам, EUR/USD, цена электроэнергии DE (сейчас).
import { parseNum, measuredCrypto } from "./verdict.js";

const NUMB = "(\\d[\\d\\s\\u00a0.,]*\\d|\\d)";
const first = (t, res) => { for (const re of res) { const m = String(t).match(re); if (m) { const v = parseNum(m[1] || m[2]); if (v != null) return { v, idx: m.index + m[0].length }; } } return null; };
const judge = (claimed, ours, matchAbs, missAbs, matchRel, missRel) => {
  const absd = Math.abs(claimed - ours), rel = ours ? Math.abs(claimed / ours - 1) : Infinity;
  const ok = matchAbs != null ? absd <= matchAbs : rel <= matchRel, bad = missAbs != null ? absd >= missAbs : rel >= missRel;
  return ok ? "match" : bad ? "mismatch" : "close_not_exact";
};
const age = (iso) => { const t = Date.parse(iso); return Number.isFinite(t) ? Date.now() - t : null; };

export const MEASURANDS = [
  { id: "btc_funding", label: "BTC funding rate", unit: "%", topic: /funding|фандинг/iu, needs: /bitcoin|биткоин|btc|perp/iu,
    get: (s) => s.derivatives && Number.isFinite(+s.derivatives.funding_relative_pct) ? { value: +s.derivatives.funding_relative_pct, at: s.derivatives.at, source: s.derivatives.source, url: s.derivatives.source_url, maxAgeMs: 3 * 3600e3 } : null,
    claim: (t) => first(t, [new RegExp(NUMB + "\\s?%", "iu")]), judge: (c, o) => judge(c, o, 0.002, 0.01) },
  { id: "btc_open_interest_usd", label: "BTC open interest (USD)", unit: "USD", topic: /open interest|открыт\p{L}* интерес/iu,
    get: (s) => s.derivatives && Number.isFinite(+s.derivatives.open_interest_usd) ? { value: +s.derivatives.open_interest_usd, at: s.derivatives.at, source: s.derivatives.source, url: s.derivatives.source_url, maxAgeMs: 3 * 3600e3 } : null,
    claim: (t) => { const m = String(t).match(new RegExp(NUMB + "\\s?(млрд|billion|bn|млн|million|mn)", "iu")); if (!m) return null; const v = parseNum(m[1]); return v == null ? null : { v: v * (/млрд|billion|bn/i.test(m[2]) ? 1e9 : 1e6) }; }, judge: (c, o) => judge(c, o, null, null, 0.1, 0.25) },
  { id: "btc_fee_fast", label: "Bitcoin fast fee (sat/vB)", unit: "sat/vB", topic: /комисси|fees?|sat\/?v?b/iu, needs: /bitcoin|биткоин|btc|mempool/iu,
    get: (s) => s.bitcoin && Number.isFinite(+s.bitcoin.fee_fast_sat_vb) ? { value: +s.bitcoin.fee_fast_sat_vb, at: s.bitcoin.at, source: s.bitcoin.source, url: s.bitcoin.source_url, maxAgeMs: 3 * 3600e3 } : null,
    claim: (t) => first(t, [new RegExp(NUMB + "\\s?sat", "iu")]), judge: (c, o) => judge(c, o, 1, 8) },
  { id: "ecb_deposit_rate", label: "ECB deposit rate (%)", unit: "%", topic: /ставк\p{L}* по депозит|deposit (?:facility )?rate|einlagesatz|ecb|ЕЦБ|ezb/iu, needs: /ставк|rate|satz|зин/iu,
    get: (s) => s.ecb && s.ecb.deposit_rate_pct && Number.isFinite(+s.ecb.deposit_rate_pct.value) ? { value: +s.ecb.deposit_rate_pct.value, at: s.ecb.deposit_rate_pct.date || s.ecb.deposit_rate_pct.at || null, source: s.ecb.source, url: s.ecb.source_url, maxAgeMs: 10 * 864e5 } : null,
    claim: (t) => first(t, [new RegExp(NUMB + "\\s?%", "iu")]), judge: (c, o) => judge(c, o, 0.05, 0.25) },
  { id: "eurusd", label: "EUR/USD (ECB reference)", unit: "USD per EUR", topic: /eur\s?\/\s?usd|евро к доллар|euro (?:to|vs\.?) (?:the )?dollar|euro.{0,20}dollar/iu,
    get: (s) => s.ecb && s.ecb.eurusd && Number.isFinite(+s.ecb.eurusd.value) ? { value: +s.ecb.eurusd.value, at: s.ecb.eurusd.date || s.ecb.eurusd.at || null, source: s.ecb.source, url: s.ecb.source_url, maxAgeMs: 5 * 864e5 } : null,
    claim: (t) => { const m = String(t).match(/(?<![\d.,])(1[.,]\d{2,4})(?!\d)/u); return m ? { v: parseFloat(m[1].replace(",", ".")) } : null; }, judge: (c, o) => judge(c, o, null, null, 0.01, 0.03) },
  { id: "power_de_now", label: "German day-ahead power price now (ct/kWh)", unit: "ct/kWh", topic: /электр|strom|electricity|power price/iu, needs: /германи|german|deutsch|de-lu|day-ahead/iu,
    get: (s) => s.power && Number.isFinite(+s.power.now_ct_kwh) ? { value: +s.power.now_ct_kwh, at: s.power.now_at, source: s.power.source, url: s.power.source_url, maxAgeMs: 3 * 3600e3 } : null,
    claim: (t) => { const m = String(t).match(new RegExp(NUMB + "\\s?(?:ct|cent|цент)\\w*\\s?\\/?\\s?kwh|" + NUMB + "\\s?(?:€|eur|евро)\\s?\\/?\\s?mwh", "iu")); if (!m) return null; if (m[1]) return { v: parseNum(m[1]) }; const v = parseNum(m[2]); return v == null ? null : { v: v / 10 }; }, judge: (c, o) => judge(c, o, 0.5, 3) },
];

// Возвращает список измерений по тексту: { id, label, ours, unit, at, source, url, claimed?, diff_pct?, result?, stale? }
export function measureClaim(text, sens) {
  const t = String(text || ""), out = [];
  if (!sens) return out;
  const crypto = measuredCrypto(t, sens);
  if (crypto) out.push({ id: "crypto_price_" + crypto.coin.toLowerCase(), label: crypto.coin + " price", unit: crypto.currency, ours: crypto.ours, claimed: crypto.claimed, diff_pct: crypto.diff_pct, result: crypto.result, at: crypto.hour_end, source: "Kraken hourly close, ECB EUR/USD", url: "https://orbstudio.org/api/v1/sensors" });
  for (const m of MEASURANDS) {
    if (!m.topic.test(t) || (m.needs && !m.needs.test(t))) continue;
    const g = m.get(sens); if (!g) continue;
    const a = age(g.at), stale = a != null && a > g.maxAgeMs;
    const c = m.claim(t), rec = { id: m.id, label: m.label, ours: g.value, unit: m.unit, at: g.at || null, source: g.source || null, url: g.url || null, ...(stale ? { stale: true } : {}) };
    if (c && Number.isFinite(c.v) && !stale) { rec.claimed = c.v; rec.diff_pct = g.value ? Math.round((c.v / g.value - 1) * 1000) / 10 : null; rec.result = m.judge(c.v, g.value); }
    out.push(rec);
  }
  return out;
}
