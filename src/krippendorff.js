// Датчик «Криппендорф» — в честь Клауса Криппендорфа (1932–2022), автора коэффициента альфа («Estimating the Reliability,
// Systematic Error and Random Error of Interval Data», 1970; «Content Analysis», 1980): согласие кодировщиков засчитывается только
// сверх случайного. Мостик «Согласны ли издания, что это за новость» (Криппендорф + Коэн + Сёрл + Райс).
// Вопрос: когда разные издания пишут об одном событии, одинаково ли они его подают — как совершившееся событие, чьё-то
// заявление, обещание, угрозу или требование? Метки ставят правила Сёрла по словам (без ИИ), «кодировщики» — издания.
// Альфа близка к 1 — издания согласны; около 0 — согласие не выше случайного: статус истории спорный, и агенту нельзя
// выдавать её подачу одного издания за факт.
import { searleHeadline } from "./searle.js";
import { storyStems, commonStems } from "./duo.js";

export const KRIPPENDORFF = {
  name: "Klaus Krippendorff", years: "1932–2022",
  idea: "Agreement between coders counts only beyond what chance would give; when agreement is low, the categories, not the data, are speaking.",
  wiki: { en: "https://en.wikipedia.org/wiki/Klaus_Krippendorff", ru: "https://en.wikipedia.org/wiki/Klaus_Krippendorff" },
  note: "Named in his honour. Orb Studio is not connected with Klaus Krippendorff's family or the Annenberg School for Communication.",
};
export const KRIPP_HOURS = 48, KRIPP_MIN_UNITS = 15, KRIPP_LOW = 0.4, KRIPP_HIGH = 0.67; // 0.667 — нижняя граница «допустимых выводов» у Криппендорфа
const outletOf = (s) => String(s || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");

// Альфа Криппендорфа для номинальных меток. units: [[метка, метка, …], …] (у каждой единицы ≥ 2 метки).
export function alphaNominal(units) {
  const us = (units || []).filter((u) => Array.isArray(u) && u.length >= 2);
  const nc = {}; let n = 0, dObs = 0;
  for (const u of us) {
    const m = u.length, cnt = {}; for (const v of u) cnt[v] = (cnt[v] || 0) + 1;
    for (const [c, k] of Object.entries(cnt)) { nc[c] = (nc[c] || 0) + k; dObs += (k * (m - k)) / (m - 1); }
    n += m;
  }
  if (n < 2) return null;
  let dExp = 0; for (const c of Object.keys(nc)) dExp += nc[c] * (n - nc[c]);
  if (dExp === 0) return { alpha: null, reason: "one_category_only", pairable: n };
  return { alpha: Math.round((1 - ((n - 1) * dObs) / dExp) * 100) / 100, pairable: n };
}

// rows: radar_life [{ radar, source, headline, first_ts }] — разные истории; склеиваем одно событие у разных изданий
export function sameEventGroups(rows) {
  const items = (rows || []).filter((r) => r && r.headline && r.source).map((r) => ({ ...r, outlet: outletOf(r.source), stems: storyStems(r.headline) }));
  // «рубричные» основы (война, Украина, биткоин) весят половину: в 48-часовом потоке это слова из 2 % заголовков и чаще
  const common = commonStems(items.map((x) => x.headline), 0.02, 3);
  const match = (x, y) => { let k = 0; for (const w of x.stems) if (y.stems.has(w)) k += common.has(w) ? 0.5 : 1; return k >= 3 || (k >= 2 && k >= 0.5 * Math.min(x.stems.size, y.stems.size)); };
  // без цепочек: заголовок входит в событие, только если совпадает с его первым заголовком (иначе «война в Украине» склеивает всё)
  const sorted = [...items].sort((a, b) => a.first_ts - b.first_ts), groups = [];
  for (const x of sorted) { const g = groups.find((gr) => gr[0].outlet !== x.outlet && x.first_ts - gr[0].first_ts <= KRIPP_HOURS * 3600e3 && match(gr[0], x)); if (g) g.push(x); else groups.push([x]); }
  const g = new Map(groups.map((xs, i) => [i, xs]));
  // одно издание — один голос в событии (первая его подача)
  return [...g.values()].map((xs) => { const by = new Map(); for (const x of xs.sort((a, b) => a.first_ts - b.first_ts)) if (!by.has(x.outlet)) by.set(x.outlet, x); return [...by.values()]; }).filter((xs) => xs.length >= 2);
}

export function krippendorffReport(rows, now = Date.now()) {
  const groups = sameEventGroups(rows).map((xs) => xs.map((x) => ({ ...x, act: searleHeadline(x.headline).act })));
  const a = alphaNominal(groups.map((xs) => xs.map((x) => x.act)));
  const split = groups.filter((xs) => new Set(xs.map((x) => x.act)).size > 1);
  const verdict = groups.length < KRIPP_MIN_UNITS || !a || a.alpha == null ? "collecting" : a.alpha >= KRIPP_HIGH ? "outlets_agree" : a.alpha >= KRIPP_LOW ? "partly_agree" : "status_disputed";
  return {
    sensor: "krippendorff", honour: KRIPPENDORFF, generated_at: new Date(now).toISOString(), verdict,
    question: "When several outlets report the same event, do they present it the same way — as something that happened, a statement, a promise, a threat or a demand?",
    alpha: a ? a.alpha : null, events_with_2plus_outlets: groups.length, events_presented_differently: split.length,
    split_share_pct: groups.length ? Math.round((100 * split.length) / groups.length) : null,
    examples_split: split.slice(0, 6).map((xs) => ({ versions: xs.slice(0, 4).map((x) => ({ outlet: x.outlet, act: x.act, headline: x.headline })) })),
    rule: `radar stories of the last ${KRIPP_HOURS} h; the same event at different outlets is matched by shared word stems with each event's first headline (no chaining; stems in 2%+ of headlines weigh half); each outlet's first headline is labelled by the Searle word rules; Krippendorff's alpha (nominal) over events with 2+ outlets. alpha >= ${KRIPP_HIGH}: outlets agree; ${KRIPP_LOW}-${KRIPP_HIGH}: partly; below ${KRIPP_LOW}: status disputed`,
    how_to_use: "status_disputed or a split example: do not pass on one outlet's framing (for example 'X did' versus 'X threatens to') as the fact; say that outlets present it differently and which version is a statement or a plan. outlets_agree: the framing is shared — still check the source, agreement is not truth.",
    limits: "Word rules, no AI; matching by word stems can merge two stories or miss a paraphrase. Agreement between outlets is not evidence that the event happened.",
    disclaimer: "Indicator, not advice.",
  };
}
