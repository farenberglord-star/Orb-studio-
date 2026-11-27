// Датчик «Менденхолл» — в честь Томаса Корвина Менденхолла (1841–1924), автора «характеристических кривых текста»
// («The Characteristic Curves of Composition», Science, 1887): сколько слов какой длины в тексте — у одного автора кривая устойчива.
// Мостик «Пачка, которая не похожа на своё издание» (Менденхолл + Гердан + Эллегорд + Мостеллер + Гиро + Мюллер).
// Вопрос: не отличается ли сегодняшняя лента заголовков издания от его же обычной ленты за предыдущие 6 дней по длинам слов?
// Показываем расстояние до собственной нормы и его отношение к обычному разбросу этого же издания; порога нет.
export const MENDENHALL = {
  name: "Thomas Corwin Mendenhall", years: "1841–1924",
  idea: "Count how many words of each length a text uses; the curve of one author stays steady, so a different curve hints at another hand.",
  wiki: { en: "https://en.wikipedia.org/wiki/Thomas_Corwin_Mendenhall", ru: "https://en.wikipedia.org/wiki/Thomas_Corwin_Mendenhall" },
  note: "Named in his honour. Orb Studio is not connected with Mendenhall's family or Ohio State University.",
};
export const MEN_MAX_LEN = 15, MEN_MIN_DAY = 20, MEN_MIN_BASE = 100, MEN_MIN_OUTLETS = 4; // объёмы выборки — рабочие допущения, не пороги вердикта
const DAY = 864e5;
const outletOf = (s) => String(s || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
export function wordLengths(h) { // → { counts: [1..15], words, vocab }
  const counts = new Array(MEN_MAX_LEN).fill(0), seen = new Set(); let words = 0;
  for (const w of String(h || "").toLowerCase().match(/\p{L}+/gu) || []) { counts[Math.min(w.length, MEN_MAX_LEN) - 1]++; words++; seen.add(w); }
  return { counts, words, seen };
}
const norm = (c) => { const n = c.reduce((a, b) => a + b, 0); return n ? c.map((x) => x / n) : null; };
export function curveDistance(p, q) { // симметричное хи-квадрат расстояние, 0..2
  if (!p || !q) return null; let d = 0; for (let i = 0; i < p.length; i++) { const s = p[i] + q[i]; if (s > 0) d += ((p[i] - q[i]) ** 2) / s; }
  return Math.round(d * 10000) / 10000;
}
const median = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length ? (s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) : null; };
// rows: radar_life [{ source, headline, first_ts }]
export function mendenhallReport(rows, now = Date.now()) {
  const by = new Map();
  for (const r of rows || []) { if (!r || !r.headline || !r.source || !(r.first_ts > now - 7 * DAY)) continue;
    const o = outletOf(r.source), k = Math.min(6, Math.floor((now - r.first_ts) / DAY)); if (!by.has(o)) by.set(o, Array.from({ length: 7 }, () => ({ counts: new Array(MEN_MAX_LEN).fill(0), n: 0, words: 0, seen: new Set() })));
    const w = wordLengths(r.headline), d = by.get(o)[k]; for (let i = 0; i < MEN_MAX_LEN; i++) d.counts[i] += w.counts[i]; d.n++; d.words += w.words; for (const x of w.seen) d.seen.add(x); }
  const out = [];
  for (const [outlet, days] of by) {
    const dist = (k) => { const base = new Array(MEN_MAX_LEN).fill(0); let nb = 0; days.forEach((d, j) => { if (j !== k) { for (let i = 0; i < MEN_MAX_LEN; i++) base[i] += d.counts[i]; nb += d.n; } });
      if (days[k].n < MEN_MIN_DAY || nb < MEN_MIN_BASE) return null; return curveDistance(norm(days[k].counts), norm(base)); };
    const today = dist(0); if (today == null) continue;
    const past = []; for (let k = 1; k < 7; k++) { const x = dist(k); if (x != null) past.push(x); }
    const usual = median(past); const d0 = days[0];
    out.push({ outlet, headlines_today: d0.n, distance: today, usual_distance: usual, days_for_usual: past.length,
      ratio: usual && usual > 0 ? Math.round((today / usual) * 100) / 100 : null,
      herdan_beta: d0.words > 1 && d0.seen.size > 1 ? Math.round((Math.log(d0.seen.size) / Math.log(d0.words)) * 100) / 100 : null });
  }
  const ranked = out.filter((x) => x.ratio != null).sort((a, b) => b.ratio - a.ratio);
  const verdict = ranked.length < MEN_MIN_OUTLETS ? "collecting" : "measured";
  return {
    sensor: "mendenhall", honour: MENDENHALL, generated_at: new Date(now).toISOString(), verdict,
    question: "Does an outlet's headlines of the last 24 hours read, by word lengths, like that outlet's own headlines of the previous days?",
    outlets_measured: ranked.length, most_unlike_its_usual: ranked.slice(0, 5), calmest: ranked.slice(-3).reverse(),
    rule: `per outlet from radar headlines; word lengths 1-${MEN_MAX_LEN} letters; distance = symmetric chi-square between the last 24 h and the outlet's own other 6 days (0 = same curve, 2 = no overlap); usual_distance = median of the same distance for each of the previous days against the rest; ratio = distance today / usual. An outlet is measured only with at least ${MEN_MIN_DAY} headlines in the day and ${MEN_MIN_BASE} in the rest (working assumptions). No cut-off for 'unusual' until the spread of the ratio is seen. Herdan's beta (log distinct words / log words) is shown next to it.`,
    how_to_use: "A high ratio: today's batch of this outlet differs from its habit (a topic wave, a rewrite or a feed change are likelier than another hand): look at the headlines before you say anything. Ratio near 1: nothing to flag. Never read it as who wrote a text.",
    limits: "Headlines are short and topic changes move word lengths, so a high ratio is a reason to look, not a finding. Agency texts in several languages lower comparability. A flag, never a verdict.",
    disclaimer: "Indicator, not advice.",
  };
}
