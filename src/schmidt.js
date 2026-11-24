// Датчик «Шмидт» — в честь Йоханнеса Шмидта (1843–1901), автора волновой теории (1872): новшества расходятся по соседним
// языкам волной, а не только ветвями одного родословного дерева (Шлейхер). Мостик библиотеки кристаллов «дерево или волна»:
// Шмидт (волна) + Шлейхер (дерево) + Тард (подражание) + Касперсон (усиление) + Брэдфорд (ядро изданий).
// Вопрос: издания подключаются к истории друг за другом (цепочка пересказов от первого) или почти одновременно (волна: общая лента или независимые репортёры)?
// По одним временам публикации отличить копирование от независимой работы нельзя — датчик говорит только о форме, не о причине.
export const SCHMIDT = {
  name: "Johannes Schmidt", years: "1843–1901",
  idea: "Wave theory: an innovation spreads outward from a centre like a wave over neighbouring languages, instead of only branching down a family tree.",
  wiki: { en: "https://en.wikipedia.org/wiki/Johannes_Schmidt_(linguist)", ru: "https://en.wikipedia.org/wiki/Johannes_Schmidt_(linguist)" },
  note: "Named in his honour. Orb Studio is not connected with Johannes Schmidt, his family or any university.",
};
export const SCHMIDT_MIN_OUTLETS = 3, SCHMIDT_MIN = 30, SCHMIDT_BURST_MIN = 30, SCHMIDT_CASCADE_MIN = 60, SCHMIDT_DAYS = 7;
const M = 60e3, r1 = (x) => (x == null ? null : Math.round(x * 10) / 10), pct = (a, b) => (b ? Math.round(100 * a / b) : null);
const med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };

// joins: [[издание, время_мс], …] или JSON-строка; возвращает форму одной истории или null, если изданий меньше трёх
export function schmidtShape(joinsIn) {
  let j = joinsIn; if (typeof j === "string") { try { j = JSON.parse(j); } catch { return null; } }
  if (!Array.isArray(j)) return null;
  const t = j.map((x) => (Array.isArray(x) ? +x[1] : NaN)).filter((x) => Number.isFinite(x) && x > 0).sort((a, b) => a - b);
  if (t.length < SCHMIDT_MIN_OUTLETS) return null;
  const lags = t.slice(1).map((x) => (x - t[0]) / M), burst = lags.filter((x) => x <= SCHMIDT_BURST_MIN).length / lags.length, last = lags[lags.length - 1];
  const shape = burst >= 0.6 ? "wave" : burst <= 1 / 3 && last >= SCHMIDT_CASCADE_MIN ? "cascade" : "mixed";
  return { shape, outlets: t.length, median_lag_min: r1(med(lags)), last_lag_min: r1(last), burst_pct: Math.round(100 * burst), first_ts: t[0] };
}
export function schmidtStory(row) {
  const s = schmidtShape(row.joins); if (!s) return null;
  return { radar: row.radar || null, headline: row.headline || "", first_source: row.source || null, ...s, first_seen: new Date(s.first_ts).toISOString() };
}
export function schmidtReport(rows, now = Date.now(), since = null) {
  const st = (rows || []).map(schmidtStory).filter(Boolean), n = st.length, by = (k) => st.filter((s) => s.shape === k);
  const wave = by("wave"), casc = by("cascade"), mixed = by("mixed");
  const radars = [...new Set(st.map((s) => s.radar).filter(Boolean))].map((id) => { const a = st.filter((s) => s.radar === id);
    return { id, stories: a.length, wave: a.filter((s) => s.shape === "wave").length, cascade: a.filter((s) => s.shape === "cascade").length, cascade_pct: pct(a.filter((s) => s.shape === "cascade").length, a.length) }; }).sort((x, y) => y.stories - x.stories);
  const cp = pct(casc.length, n), wp = pct(wave.length, n);
  return {
    sensor: "schmidt", verdict: n < SCHMIDT_MIN ? "collecting" : cp >= 50 ? "mostly_cascades" : wp >= 50 ? "mostly_waves" : "mixed",
    stories: n, wave: wave.length, cascade: casc.length, mixed: mixed.length, wave_pct: wp, cascade_pct: cp,
    median_lag_min: r1(med(st.map((s) => s.median_lag_min))), radars,
    longest_cascades: [...casc].sort((a, b) => b.last_lag_min - a.last_lag_min).slice(0, 6),
    biggest_waves: [...wave].sort((a, b) => b.outlets - a.outlets).slice(0, 6),
    question: "Do outlets join a radar story one after another (a chain of retellings from the first) or almost all at once (a wave: one wire feed or independent reporters)?",
    method: `For every radar story with at least ${SCHMIDT_MIN_OUTLETS} outlets in our feeds, Orb Studio keeps the earliest publication time per outlet. Wave = at least 60% of the later outlets appear within ${SCHMIDT_BURST_MIN} minutes of the first. Cascade = at most one third do, and the last outlet comes at least ${SCHMIDT_CASCADE_MIN} minutes after the first. Everything between is mixed. Times are the feeds' own publication times and can be wrong. The shape says how the story spread, not why: a wave can be one wire agency reprinted everywhere or many reporters on the same event. Word rules, no AI.`,
    rule: "Do not count outlets as independent confirmations. In a cascade, treat the story as the first outlet plus its retellers. In a wave, ask first whether one wire feed sits behind it. Only a source that adds something the first did not is a second source.",
    bridge: "Crystal Library bridge 'tree or wave': Schmidt (wave) + Schleicher (tree) + Tarde (imitation) + Kasperson (amplification) + Bradford (core of outlets).",
    history_since: since ? new Date(+since).toISOString() : null,
    honour: SCHMIDT, similar: "Media-monitoring and misinformation-tracking tools (Media Cloud, GDELT, Hoaxy) map who copied whom for researchers; this sensor reports live, per radar story, whether the outlets arrived as a chain or as a wave, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
