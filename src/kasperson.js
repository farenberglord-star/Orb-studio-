// Датчик «Касперсон» — в честь Роджера Касперсона (1938–2021), автора теории социального усиления риска (1988):
// сообщение о риске растёт или слабеет, пока его пересказывают СМИ и люди. Мостик библиотеки кристаллов:
// Касперсон (усиление) + Тоффлер (перегрузка пересказами) + Ховард (сколько изданий в первый час и на пике) + Сёрл (какой это речевой акт).
// Вопрос: какие истории на радарах разошлись намного шире своего первого источника, и какие именно — события, угрозы или обещания?
import { searleHeadline } from "./searle.js";

export const KASPERSON = {
  name: "Roger Kasperson", years: "1938–2021",
  idea: "Social amplification of risk: a risk message grows or fades as media and people retell it, often beyond what the first source said.",
  wiki: { en: "https://en.wikipedia.org/wiki/Roger_Kasperson", ru: "https://en.wikipedia.org/wiki/Roger_Kasperson" },
  note: "Named in his honour. Orb Studio is not connected with Roger Kasperson, his family or Clark University.",
};
export const KASPERSON_MIN = 30, KASPERSON_AMP = { factor: 2, outlets: 3 };
const H = 3600e3, med = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10), pct = (a, b) => (b ? Math.round(100 * a / b) : null);

// одна история: сколько изданий в первый раз, сколько на пике, во сколько раз выросла
export function kaspersonStory(row) {
  const first = Math.max(1, +row.n_first || 1), peak = Math.max(first, +row.n_max || first), factor = peak / first;
  return { radar: row.radar || null, headline: row.headline || "", source: row.source || null, outlets_first: first, outlets_peak: peak, factor: r1(factor),
    amplified: peak >= KASPERSON_AMP.outlets && factor >= KASPERSON_AMP.factor, grew: peak > first, hours_on_radar: r1(Math.max(0, (+row.last_ts - +row.first_ts) / H)),
    first_seen: row.first_ts ? new Date(+row.first_ts).toISOString() : null, speech_act: searleHeadline(row.headline).act };
}
export function kaspersonReport(rows, now = Date.now(), since = null) {
  const st = (rows || []).filter((r) => r && r.n_first != null).map(kaspersonStory), n = st.length, amp = st.filter((s) => s.amplified), grew = st.filter((s) => s.grew);
  const radars = [...new Set(st.map((s) => s.radar).filter(Boolean))].map((id) => { const a = st.filter((s) => s.radar === id), b = a.filter((s) => s.amplified);
    return { id, stories: a.length, amplified: b.length, amplified_pct: pct(b.length, a.length), max_factor: a.length ? Math.max(...a.map((s) => s.factor)) : null }; }).sort((x, y) => y.amplified - x.amplified || y.stories - x.stories);
  const acts = ["event", "claim", "promise", "threat", "demand"].map((k) => { const a = st.filter((s) => s.speech_act === k), b = a.filter((s) => s.amplified);
    return { act: k, stories: a.length, amplified: b.length, amplified_pct: pct(b.length, a.length) }; }).filter((x) => x.stories);
  const share = pct(amp.length, n);
  return {
    sensor: "kasperson", verdict: n < KASPERSON_MIN ? "collecting" : share >= 10 ? "much_amplification" : share >= 3 ? "some_amplification" : "little_amplification",
    stories: n, grew: grew.length, amplified: amp.length, amplified_pct: share, median_growth_factor: r1(med(grew.map((s) => s.factor))),
    radars, by_speech_act: acts,
    most_amplified: [...amp].sort((a, b) => b.factor - a.factor || b.outlets_peak - a.outlets_peak).slice(0, 8),
    question: "Which stories on the Orb Studio radars spread far wider than their first source, on which radar, and were they events or only threats, promises or statements?",
    method: `For every radar story (last 7 days) Orb Studio records how many outlets in its feeds carried it when it first appeared and at its peak. Amplified = at least ${KASPERSON_AMP.outlets} outlets at the peak and at least ${KASPERSON_AMP.factor}× the first count. The speech act of the headline comes from the Searle sensor. Counts are outlets in our feeds, reprints included: more outlets means wider spread, not more facts. Word rules, no AI.`,
    rule: "When a story has spread from one outlet to many, more outlets does not mean more facts: go back to what the first source said, and do not make the risk sound bigger than it does.",
    bridge: "Crystal Library bridge: Kasperson (amplification) + Toffler (overload of retellings) + Howard (outlets at first sight and at peak) + Searle (speech act).",
    history_since: since ? new Date(+since).toISOString() : null,
    honour: KASPERSON, similar: "Media-monitoring dashboards (Media Cloud, GDELT) and research on the social amplification of risk measure coverage volume for researchers; this sensor reports live, per story, how far each radar story spread beyond its first source and which speech act it was, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
