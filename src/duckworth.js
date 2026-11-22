// Датчик «Дакворт» — в честь Фрэнка Дакворта (1939–2024), британского статистика, соавтора метода Дакворта–Льюиса:
// если матч в крикете прервали, цель пересчитывают честно, по тем ресурсам, что были у команды. Здесь то же для индексов:
// значение «сейчас» сравниваем не со вчерашним днём целиком, а с тем же временем суток вчера и за прошлую неделю.
export const DUCKWORTH = {
  name: "Frank Duckworth", years: "1939–2024",
  idea: "Duckworth–Lewis: when a match is interrupted, reset the target fairly by the resources actually available, not by the full game.",
  wiki: { en: "https://en.wikipedia.org/wiki/Frank_Duckworth", ru: "https://en.wikipedia.org/wiki/Frank_Duckworth" },
  note: "Named in his honour. Orb Studio is not connected with Frank Duckworth, his family or the Royal Statistical Society.",
};
const D = 864e5, TOL = 45 * 60e3, r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);
const median = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
function nearest(points, t) { let best = null, bd = Infinity; for (const p of points) { const d = Math.abs(p.ts - t); if (d < bd) { bd = d; best = p; } } return bd <= TOL ? best : null; }
// series: { id: [{ts, v}] } отсортированы по времени
export function duckworthSeries(points, now) {
  if (!points.length) return { verdict: "no_data" };
  const last = points[points.length - 1], t = last.ts;
  const sameTime = []; for (let d = 1; d <= 7; d++) { const p = nearest(points, t - d * D); if (p) sameTime.push(p.v); }
  const yest = nearest(points, t - D), day = points.filter((p) => p.ts > t - D && p.ts <= t), dayAvg = day.length ? day.reduce((a, p) => a + p.v, 0) / day.length : null;
  const med = median(sameTime);
  const fair = med == null ? null : last.v - med, naive = dayAvg == null ? null : last.v - dayAvg;
  return { now: last.v, at: new Date(t).toISOString(), same_time_yesterday: yest ? yest.v : null, vs_same_time_yesterday: yest ? r1(last.v - yest.v) : null,
    same_time_median_7d: r1(med), vs_same_time_median_7d: r1(fair), days_with_same_time: sameTime.length,
    average_last_24h: r1(dayAvg), vs_average_last_24h: r1(naive),
    rhythm_effect: fair != null && naive != null ? r1(naive - fair) : null,
    verdict: sameTime.length < 3 ? "collecting" : Math.abs((naive ?? 0) - fair) >= 3 ? "rhythm_matters" : "rhythm_small" };
}
export function duckworthReport(series, now = Date.now()) {
  const out = Object.entries(series || {}).map(([id, pts]) => ({ id, ...duckworthSeries(pts, now) }));
  const ok = out.filter((x) => x.verdict !== "no_data" && x.verdict !== "collecting");
  return {
    sensor: "duckworth", verdict: !ok.length ? "collecting" : ok.some((x) => x.verdict === "rhythm_matters") ? "rhythm_matters" : "rhythm_small", series: out,
    question: "Is an Orb Studio index really higher or lower than usual — compared fairly with the same time of day, not with a whole day?",
    method: "Every 30 minutes the indices are stored. The latest value is compared with the value at the same time of day yesterday and with the median of the same time of day over the last 7 days (nearest reading within 45 minutes). The naive comparison with the average of the last 24 hours is shown too; rhythm_effect is how much of the naive difference is just the time of day. Needs at least 3 past days at the same time.",
    rule: "When you say an index is 'up' or 'down', say compared with what. Prefer the same-time comparison; a difference against the 24-hour average can be only the daily rhythm of the news.",
    honour: DUCKWORTH, similar: "Seasonal adjustment (X-13ARIMA-SEATS, STL) and 'same period last year' comparisons are standard in statistics and analytics dashboards; this sensor applies the same-time-of-day comparison live to the site's indices.",
    generated_at: new Date(now).toISOString(),
  };
}
