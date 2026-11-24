// «Длинная серия — тоже сигнал» — мостик Библиотеки кристаллов: Ллойд С. Нельсон («Контрольная карта Шухарта — тесты на особые
// причины», 1984: девять точек подряд по одну сторону среднего — сигнал, даже если ни одна не вышла за границы) + Шухарт + Несселроуд
// (колебание или сдвиг). Медленный дрейф прячется внутри обычного разброса: считаем, сколько получасов подряд радар держится выше или
// ниже своего 30-дневного среднего, и сравниваем эту серию с длиной прошлых серий того же радара (уровни радаров «липкие», поэтому
// голое правило «9 точек» срабатывало бы почти всегда).
export const NELSON_MIN_POINTS = 7 * 48; // неделя получасовых записей
export const NELSON_RUN = 9; // тест 2 Нельсона
const sideOf = (v, m) => (v > m ? 1 : v < m ? -1 : 0);
const pctl = (arr, q) => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : null; };
export function runVsMean(vals) {
  const v = (vals || []).filter((x) => x != null && Number.isFinite(+x)).map(Number);
  if (!v.length) return { verdict: "no_history" };
  const mean = v.reduce((a, b) => a + b, 0) / v.length, runs = [];
  let cur = 0, side = 0;
  for (const x of v) { const s = sideOf(x, mean); if (s !== 0 && s === side) cur++; else { if (side !== 0 && cur) runs.push(cur); side = s; cur = s ? 1 : 0; } }
  const base = { side: side > 0 ? "above_mean" : side < 0 ? "below_mean" : "at_mean", run_halfhours: cur, run_hours: cur / 2, mean_30d: Math.round(mean * 10) / 10, points: v.length };
  if (v.length < NELSON_MIN_POINTS) return { ...base, verdict: "collecting" };
  const median = pctl(runs, 0.5), p90 = pctl(runs, 0.9);
  const long = side !== 0 && cur >= NELSON_RUN && (p90 == null || cur >= p90);
  return { ...base, past_runs: runs.length, median_run_halfhours: median, p90_run_halfhours: p90, verdict: long ? "long_run" : "usual_run" };
}
export function runsVs30d(rows, series) {
  const out = {};
  for (const [id, col] of series) out[id] = runVsMean((rows || []).map((r) => r[col]));
  return out;
}
export const NELSON_NOTE = "run_vs_mean: how many half-hours in a row each radar has stayed on one side of its own 30-day mean, against the length of its past runs. long_run = at least 9 in a row (Nelson's test 2) and as long as the longest 10% of its past runs: a slow drift that hides inside the usual band. Crystal Library bridge 'a long run is a signal too': Lloyd S. Nelson (1984) + Shewhart + Nesselroade. Verdict from one week of history. A drift is a reason to look, not a forecast.";
