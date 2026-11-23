// Датчик «Счёт попаданий» (track record): как часто изменение крипто-радара за сутки совпадало
// с движением BTC и ETH за следующие сутки. Только прошлое, за последние 30 дней, с честным размером выборки.
// Одна точка в день в один и тот же час (по умолчанию 12:00 UTC), окна не перекрываются.
// Это измерение прошлого совпадения, не прогноз и не торговый сигнал.

export const TRACK_BUCKETS = [["0", 0, 0], ["1-2", 1, 2], ["3-5", 3, 5], ["6+", 6, Infinity]];
export const TRACK_MIN = 8; // меньше точек в корзине — выводов не делаем
const H = 3600e3, D = 864e5;

// значение радара в момент t: ближайшая точка не дальше 45 минут
export function radarAt(rows, t, tol = 45 * 60e3) {
  let best = null;
  for (const r of rows) { const d = Math.abs(r.ts - t); if (d <= tol && (!best || d < Math.abs(best.ts - t))) best = r; }
  return best ? best.v : null;
}
// цена в момент t: закрытие последней завершённой часовой свечи (свеча с открытием o закрывается в o+1ч)
export function priceAt(candles, t) {
  let p = null;
  for (const [o, c] of candles) { if (o + H <= t) p = c; else break; }
  return p;
}
// интервал Уилсона, 90 %
export function wilson(k, n, z = 1.645) {
  if (!n) return null;
  const p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = (z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / d;
  return [+Math.max(0, c - h).toFixed(3), +Math.min(1, c + h).toFixed(3)];
}
const mean = (a) => (a.length ? +(a.reduce((x, y) => x + y, 0) / a.length).toFixed(2) : null);

// точки: для каждого дня — изменение радара за прошлые сутки и изменение цены за следующие сутки
export function trackSamples(rows, candles, { now = Date.now(), hourUtc = 12, days = 30 } = {}) {
  const out = [], first = Math.floor((now - (days + 1) * D) / D) * D;
  for (let day = first; day <= now; day += D) {
    const a = day + hourUtc * H;
    if (a - D < now - (days + 1) * D || a + D > now) continue;
    const k1 = radarAt(rows, a), k0 = radarAt(rows, a - D), p0 = priceAt(candles, a), p1 = priceAt(candles, a + D);
    if (k1 == null || k0 == null || p0 == null || p1 == null) continue;
    out.push({ at: new Date(a).toISOString(), radar_then: k0, radar_at: k1, radar_change: k1 - k0, next_day_pct: +((p1 / p0 - 1) * 100).toFixed(2) });
  }
  return out;
}
function bucketOf(d) { const a = Math.abs(d); return TRACK_BUCKETS.find(([, lo, hi]) => a >= lo && a <= hi)[0]; }
// «против радара»: радар вниз — цена вверх, радар вверх — цена вниз (так читает радар Грок); «вместе» — наоборот
export function trackStats(samples) {
  const up = samples.filter((s) => s.next_day_pct > 0).length;
  const buckets = TRACK_BUCKETS.map(([id]) => {
    const s = samples.filter((x) => bucketOf(x.radar_change) === id);
    const moved = s.filter((x) => x.radar_change !== 0 && x.next_day_pct !== 0), against = moved.filter((x) => Math.sign(x.radar_change) !== Math.sign(x.next_day_pct)).length;
    const ci = id === "0" ? null : wilson(against, moved.length);
    const verdict = id === "0" ? (s.length ? "radar_unchanged" : "no_days") : moved.length < TRACK_MIN ? "too_few_days" : ci[0] > 0.5 ? "price_moved_against_radar_more_often" : ci[1] < 0.5 ? "price_moved_with_radar_more_often" : "no_clear_link";
    return { bucket: id, days: s.length, against_radar: id === "0" ? null : against, with_radar: id === "0" ? null : moved.length - against,
      against_share: moved.length ? +(against / moved.length).toFixed(2) : null, interval_90: ci, verdict,
      mean_next_day_pct_when_radar_fell: mean(s.filter((x) => x.radar_change < 0).map((x) => x.next_day_pct)),
      mean_next_day_pct_when_radar_rose: mean(s.filter((x) => x.radar_change > 0).map((x) => x.next_day_pct)),
      mean_next_day_pct_when_unchanged: id === "0" ? mean(s.map((x) => x.next_day_pct)) : null };
  });
  return { days: samples.length, days_price_rose: up, share_days_price_rose: samples.length ? +(up / samples.length).toFixed(2) : null, buckets };
}
export const TRACK_EXPLAIN = {
  too_few_days: "fewer than 8 days in this group: no conclusion either way",
  no_clear_link: "the 90 % interval contains 50 %: over these days the next-day move went against the radar about as often as with it",
  price_moved_against_radar_more_often: "over these days the price more often moved opposite to the radar change (radar fell, price rose; or the reverse)",
  price_moved_with_radar_more_often: "over these days the price more often moved in the same direction as the radar change",
  radar_unchanged: "days when the radar did not change",
  no_days: "no days in this group",
};
// «Шум радара» (мостик Грилихес + «Счёт попаданий» + Поляк): насколько радар меняется сам по себе — обычное суточное изменение,
// доля получасовых скачков на 5+ пунктов и как часто они возвращаются в течение часа. Шумное измерение делает связи слабее, чем они есть.
export function radarNoise(rows, now = Date.now()) {
  const r = (rows || []).filter((x) => x && x.v != null && x.ts > now - 30 * D);
  if (r.length < 96) return { verdict: "collecting", points: r.length };
  const d24 = [];
  for (const x of r) { const y = radarAt(r, x.ts - D); if (y != null) d24.push(Math.abs(x.v - y)); }
  const steps = r.slice(1).map((x, i) => x.v - r[i].v), jumps = steps.map((d, i) => ({ d, i })).filter((s) => Math.abs(s.d) >= 5);
  const back = jumps.filter(({ d, i }) => { const nx = steps.slice(i + 1, i + 3).reduce((a, b) => a + b, 0); return Math.sign(nx) === -Math.sign(d) && Math.abs(nx) >= Math.abs(d) * 0.6; }).length;
  const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(p * s.length))] : null; };
  return { verdict: "measured", points: r.length, since: new Date(r[0].ts).toISOString(), typical_24h_change: q(d24, 0.5), large_24h_change_p90: q(d24, 0.9),
    jumps_30min_5plus_pct: steps.length ? Math.round(1000 * jumps.length / steps.length) / 10 : null, jumps_reverted_within_1h_pct: jumps.length ? Math.round(100 * back / jumps.length) : null,
    rule: "A 24-hour radar change smaller than typical_24h_change is within the radar's ordinary day-to-day movement. Many half-hour jumps that come straight back are measurement flicker (the mix of headlines changes), not a real shift.",
    bridge: "Crystal Library bridge: Griliches (noisy data hides and fakes links) + track record + Polyak (jump or shift)." };
}
export function trackReport(rows, coins, { now = Date.now(), hourUtc = 12, days = 30 } = {}) {
  const per = {};
  for (const [c, candles] of Object.entries(coins || {})) {
    const samples = trackSamples(rows, candles || [], { now, hourUtc, days });
    per[c] = { ...trackStats(samples), recent: samples.slice(-7) };
  }
  const lastK = rows.length ? rows[rows.length - 1] : null, prevK = lastK ? radarAt(rows, lastK.ts - D) : null;
  const cur = lastK && prevK != null ? { radar: lastK.v, radar_24h_ago: prevK, change: lastK.v - prevK, bucket: bucketOf(lastK.v - prevK), at: new Date(lastK.ts).toISOString() } : null;
  const anyN = Math.max(0, ...Object.values(per).map((x) => x.days));
  return {
    sensor: "trackrecord", verdict: anyN < TRACK_MIN ? "collecting" : "measured",
    question: "When the Orb Studio crypto radar changed over a day, how often did BTC and ETH move the opposite way (or the same way) over the next day?",
    radar_now: cur ? { ...cur, vs_typical: (() => { const nz = radarNoise(rows, now); return nz.verdict === "measured" ? (Math.abs(cur.change) <= nz.typical_24h_change ? "within_typical_daily_move" : Math.abs(cur.change) >= nz.large_24h_change_p90 ? "large_move_top_10pct" : "above_typical") : null; })() } : null,
    radar_noise: radarNoise(rows, now), coins: per, explain: TRACK_EXPLAIN,
    method: `One point per day at ${String(hourUtc).padStart(2, "0")}:00 UTC (query hour=0–23 to match your own check time), last ${days} days: the crypto radar change over the previous 24 hours (stored every 30 minutes) and the next 24-hour change of the Kraken price (close of the last completed hourly candle, EUR pairs XBTEUR and ETHEUR). Windows do not overlap. Days are grouped by the size of the radar change (0, 1–2, 3–5, 6+ points). 'Against' = radar fell and price rose, or radar rose and price fell. The 90 % interval is the Wilson score interval; with fewer than ${TRACK_MIN} days in a group there is no conclusion. Compare with share_days_price_rose: if the price rose on most days anyway, a high 'against' share after radar drops may only reflect that.`,
    rule: "This measures past coincidence over a small sample, not a forecast and not a trading signal. Report the number of days and the interval together with any share.",
    history_since: rows.length ? new Date(rows[0].ts).toISOString() : null,
    source: "Orb Studio crypto radar history (D1 ix_hist) and Kraken public OHLC, hourly", source_url: "https://docs.kraken.com/api/docs/rest-api/get-ohlc-data",
    similar: "Standard backtesting and signal-evaluation tools (for example Alphalens for factor signals, TradingView strategy tester) measure hit rates of indicators; this sensor applies the same check openly to the Orb Studio crypto radar, with sample size and intervals, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
