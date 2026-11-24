// «Мерка зависит от набора» — мостик Библиотеки кристаллов: Пардуччи (теория диапазона и частоты, 1963–1965: оценка зависит
// от диапазона и распределения всего набора) + Фехнер (относительно, а не абсолютно) + Эджуорт (веса индекса) + Наатанен (отклонение от недавнего стандарта).
// «65 из 100» само по себе мало что говорит: в тихий месяц это высоко, в бурный — обычно. Поэтому к уровню радара добавляем его место
// среди собственных получасовых значений за 30 дней (перцентиль), минимум и максимум.
export const PARDUCCI_MIN_POINTS = 7 * 48; // неделя получасовых записей
const pctRank = (vals, v) => { let lo = 0, eq = 0; for (const x of vals) { if (x < v) lo++; else if (x === v) eq++; } return Math.round((100 * (lo + eq / 2)) / vals.length); };
export function levelVs30d(rows, series, now = Date.now()) {
  const out = {};
  for (const [id, col] of series) {
    const vals = (rows || []).map((r) => r[col]).filter((x) => x != null && Number.isFinite(+x)).map(Number);
    if (!vals.length) { out[id] = { verdict: "no_history" }; continue; }
    const last = vals[vals.length - 1], first = (rows.find((r) => r[col] != null) || {}).ts;
    const base = { level: last, points: vals.length, min_30d: Math.min(...vals), max_30d: Math.max(...vals), history_since: first ? new Date(+first).toISOString() : null };
    if (vals.length < PARDUCCI_MIN_POINTS) { out[id] = { ...base, verdict: "collecting", percentile_30d: null }; continue; }
    const p = pctRank(vals, last);
    out[id] = { ...base, verdict: "measured", percentile_30d: p, reads_as: p >= 90 ? "top_10pct_of_month" : p >= 70 ? "above_usual" : p > 30 ? "usual" : p > 10 ? "below_usual" : "bottom_10pct_of_month" };
  }
  return out;
}
export const PARDUCCI_NOTE = "level_vs_30d: each radar level placed among its own half-hourly values of the last 30 days (percentile, min, max). The same number can be high in a quiet month and ordinary in a busy one — say against which range a level is high or low. Crystal Library bridge 'the measure depends on the set': Parducci (range–frequency theory) + Fechner + Edgeworth + Näätänen. Verdict from one week of history.";
