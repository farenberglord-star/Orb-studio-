// Датчик «Парето» — в честь Вильфредо Парето (1848–1923): доходы распределены по степенному закону, малая доля держит большую часть.
// Мостик библиотеки кристаллов «тяжёлые хвосты»: Парето + Мандельброт + Чебышёв (граница для любой формы) + Лоренц (горизонт).
// Вопрос: какая доля всего движения каждого радара пришлась на 20 % самых крупных получасовых скачков — ровно ли движется радар
// или всё решают редкие рывки? Если рывки, то «обычный день» мало говорит, а среднее изменение вводит в заблуждение.
export const PARETO = {
  name: "Vilfredo Pareto", years: "1848–1923",
  idea: "In 'Cours d'économie politique' (1896–97) he showed that incomes follow a power law: a small share of people holds a large share of the total.",
  wiki: { en: "https://en.wikipedia.org/wiki/Vilfredo_Pareto", ru: "https://en.wikipedia.org/wiki/Vilfredo_Pareto" },
  note: "Named in his honour. Orb Studio is not connected with any institution bearing his name.",
};
export const PARETO_SERIES = [["consensus", "c"], ["geo", "g"], ["crypto", "k"], ["budget", "b"], ["politics", "p"], ["economy", "e"], ["energy", "n"], ["justice", "j"], ["web", "w"]];
export const PARETO_MIN = { steps: 96, moves: 20 }; // не меньше двух суток получасовых шагов и 20 ненулевых скачков
export const PARETO_LIMITS = { heavy: 0.8, skewed: 0.6 }; // доля движения у 20 % крупнейших скачков
const STEP = 18e5, GAP = 1.6 * STEP;
const r2 = (x) => (x == null ? null : Math.round(x * 100) / 100);
const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// одна серия: |Δ| между соседними получасовыми замерами (без разрывов больше ~48 минут)
export function paretoSeries(rows, col) {
  const pts = (rows || []).filter((r) => r && Number.isFinite(+r.ts) && r[col] != null && Number.isFinite(+r[col])).map((r) => [+r.ts, +r[col]]).sort((a, b) => a[0] - b[0]);
  const d = [];
  for (let i = 1; i < pts.length; i++) if (pts[i][0] - pts[i - 1][0] <= GAP) d.push(Math.abs(pts[i][1] - pts[i - 1][1]));
  const moves = d.filter((x) => x > 0).sort((a, b) => b - a), total = moves.reduce((s, x) => s + x, 0);
  const top = Math.max(1, Math.ceil(0.2 * moves.length)), topSum = moves.slice(0, top).reduce((s, x) => s + x, 0);
  const share = total ? topSum / total : null, enough = d.length >= PARETO_MIN.steps && moves.length >= PARETO_MIN.moves;
  const m = med(moves), big = moves[0] ?? null;
  return {
    steps: d.length, moves: moves.length, still_pct: d.length ? Math.round(100 * (d.length - moves.length) / d.length) : null,
    total_movement: total, top20_share: r2(share), biggest_jump: big, median_jump: m, biggest_vs_median: m ? r2(big / m) : null,
    tail: !enough ? "collecting" : share >= PARETO_LIMITS.heavy ? "heavy_tails" : share >= PARETO_LIMITS.skewed ? "skewed" : "even",
  };
}
export function paretoReport(rows, now = Date.now(), since = null) {
  const series = PARETO_SERIES.map(([id, col]) => ({ id, ...paretoSeries(rows, col) }));
  const ready = series.filter((s) => s.tail !== "collecting"), heavy = ready.filter((s) => s.tail === "heavy_tails");
  const c = series.find((s) => s.id === "consensus");
  return {
    sensor: "pareto", verdict: !ready.length ? "collecting" : heavy.length >= Math.ceil(ready.length / 2) ? "mostly_heavy_tails" : heavy.length ? "some_heavy_tails" : "mostly_even",
    index: c, radars: series.filter((s) => s.id !== "consensus").sort((a, b) => (b.top20_share ?? -1) - (a.top20_share ?? -1)),
    question: "What share of each radar's total movement came from its biggest 20% of half-hour jumps — does the radar move evenly, or do a few rare jumps decide everything?",
    method: `Half-hour levels of the consensus index and the eight radars (last 30 days). For each series: absolute change between neighbouring readings (gaps over ~48 minutes skipped), total movement = sum of changes, top-20% share = movement of the largest fifth of the non-zero jumps divided by the total. heavy_tails ≥ ${PARETO_LIMITS.heavy}, skewed ≥ ${PARETO_LIMITS.skewed}, otherwise even (the Pareto rule of thumb: 20% of the jumps carrying 80% of the movement). A verdict needs at least ${PARETO_MIN.steps} steps and ${PARETO_MIN.moves} non-zero jumps. No AI.`,
    rule: "When a few jumps carry most of the movement, the typical half hour tells little: look at the biggest jumps and what caused them, and do not extend a calm stretch into the future.",
    caveat: "Radar levels are whole numbers, so many half hours show no change; the share is about this site's radars, not about markets.",
    bridge: "Crystal Library bridge 'heavy tails': Pareto (power law) + Mandelbrot (wild randomness) + Chebyshev (a bound for any shape) + Lorenz (forecast horizon).",
    history_since: since ? new Date(+since).toISOString() : null,
    honour: PARETO, similar: "Tail and concentration measures (Pareto/Lorenz curves, Gini, top-share statistics, tail indices) are standard in finance and economics; this sensor applies a simple top-20% share live to the Orb Studio radars, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
