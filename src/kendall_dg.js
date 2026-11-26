// Датчик «Кендалл» — в честь Дэвида Джорджа Кендалла (1918–2007), соавтора модели слухов («Epidemics and Rumours», 1964,
// с Д. Дейли): слух перестаёт распространяться не потому, что его проверили, а потому что распространители встречают тех,
// кто уже знает. Мостик «Перестала расти — не значит подтверждена» (Кендалл + Шмидт + Сёрл).
// Вопрос: сколько живых историй радаров уже перестали набирать издания (насыщение), хотя их подача так и осталась
// заявлением, обещанием, угрозой или требованием — то есть остановка роста ничего не подтвердила.
// Не путать с Морисом Кендаллом (ранговая корреляция) — это другой человек.
import { searleHeadline } from "./searle.js";

export const KENDALL_DG = {
  name: "David G. Kendall", years: "1918–2007",
  idea: "Epidemics and Rumours (1964, with D. J. Daley): a rumour stops spreading when its spreaders meet people who already know it, not when it has been checked.",
  wiki: { en: "https://en.wikipedia.org/wiki/David_George_Kendall", ru: "https://en.wikipedia.org/wiki/David_George_Kendall" },
  note: "Named in his honour. Orb Studio is not connected with David Kendall's family or the University of Cambridge.",
};
export const KDG_QUIET_H = 6, KDG_MIN_OUTLETS = 3, KDG_LIVE_H = 1, KDG_MIN = 10;
const H = 3600e3;

export function kendallStory(row, now = Date.now()) {
  let j = row && row.joins; if (typeof j === "string") { try { j = JSON.parse(j); } catch { j = null; } }
  const times = (Array.isArray(j) ? j : []).map((x) => (Array.isArray(x) ? +x[1] : NaN)).filter((x) => Number.isFinite(x) && x > 0).sort((a, b) => a - b);
  const outlets = new Set((Array.isArray(j) ? j : []).map((x) => (Array.isArray(x) ? String(x[0] || "") : "")).filter(Boolean));
  if (row.source) outlets.add(String(row.source));
  const first = +row.first_ts, lastJoin = times.length ? times[times.length - 1] : first;
  if (!Number.isFinite(first) || outlets.size < KDG_MIN_OUTLETS) return null;
  if (now - first < KDG_QUIET_H * H || +row.last_ts < now - KDG_LIVE_H * H) return null; // ещё молодая или уже ушла с радара
  const act = searleHeadline(row.headline).act, quiet = now - lastJoin >= KDG_QUIET_H * H;
  return { radar: row.radar || null, headline: row.headline || "", outlets: outlets.size, act, stopped_growing: quiet,
    hours_since_last_outlet: Math.round(((now - lastJoin) / H) * 10) / 10, age_hours: Math.round(((now - first) / H) * 10) / 10,
    state: quiet && act !== "event" ? "saturated_not_settled" : quiet ? "saturated_event" : "still_spreading" };
}

export function kendallReport(rows, now = Date.now()) {
  const st = (rows || []).map((r) => kendallStory(r, now)).filter(Boolean);
  const sat = st.filter((s) => s.state === "saturated_not_settled"), quiet = st.filter((s) => s.stopped_growing);
  const pct = st.length ? Math.round((100 * sat.length) / st.length) : null;
  return {
    sensor: "kendall_dg", honour: KENDALL_DG, generated_at: new Date(now).toISOString(),
    verdict: st.length < KDG_MIN ? "collecting" : pct >= 30 ? "many_saturated_unsettled" : pct >= 10 ? "some_saturated_unsettled" : "few_saturated_unsettled",
    question: "Which live radar stories have stopped gaining outlets although they are still only a statement, promise, threat or demand?",
    live_stories: st.length, stopped_growing: quiet.length, saturated_not_settled: sat.length, saturated_not_settled_pct: pct,
    by_act: ["claim", "promise", "threat", "demand"].map((a) => ({ act: a, saturated: sat.filter((s) => s.act === a).length })),
    examples: [...sat].sort((a, b) => b.outlets - a.outlets).slice(0, 8),
    rule: `live radar stories (seen on a radar in the last ${KDG_LIVE_H} h, older than ${KDG_QUIET_H} h, ${KDG_MIN_OUTLETS}+ outlets); stopped growing = no new outlet for ${KDG_QUIET_H} h (publication times per outlet, radar_life.joins); not settled = the first headline is a statement, promise, threat or demand by the Searle word rules`,
    how_to_use: "saturated_not_settled: the story has spread as far as it will; that is not confirmation. Repeat it only as what someone said or plans, with the source, and look for an event report before calling it a fact.",
    limits: "Only the first headline of each story is labelled (later outlets may word it as an event); word rules, no AI; publication times say nothing about why outlets stopped.",
    disclaimer: "Indicator, not advice.",
  };
}
