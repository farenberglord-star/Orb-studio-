// Датчик «Симпсон» — в честь Эдварда Симпсона (1922–2019), британского статистика, описавшего парадокс Симпсона (1951):
// общий вывод по данным может быть противоположен выводам по их частям, если меняется состав частей.
// Здесь: изменение индексов за 6 часов раскладывается на «внутри радаров» и «смену состава» (больше заголовков с одного радара).
export const SIMPSON = {
  name: "Edward H. Simpson", years: "1922–2019",
  idea: "Simpson's paradox: a trend in the combined data can reverse the trend inside every group when the mix of groups changes.",
  wiki: { en: "https://en.wikipedia.org/wiki/Edward_H._Simpson", ru: "https://en.wikipedia.org/wiki/Edward_H._Simpson" },
  note: "Named in his honour. Orb Studio is not connected with Edward Simpson or his family.",
};
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);
// part(h) → "num" | "den" | null: для барометра согласия num = «согласие», den = «согласие или конфликт»
export function simpsonDecompose(nowSet, thenSet, part) {
  const group = (set) => { const g = {}; for (const h of set) { const t = part(h); if (!t) continue; const x = (g[h.radar] = g[h.radar] || { num: 0, den: 0 }); x.den++; if (t === "num") x.num++; } return g; };
  const gn = group(nowSet), gt = group(thenSet), Nn = Object.values(gn).reduce((a, x) => a + x.den, 0), Nt = Object.values(gt).reduce((a, x) => a + x.den, 0);
  if (Nn < 5 || Nt < 5) return null;
  const radars = [...new Set([...Object.keys(gn), ...Object.keys(gt)])].map((id) => {
    const a = gn[id] || { num: 0, den: 0 }, b = gt[id] || { num: 0, den: 0 };
    return { id, share_now: a.den ? 100 * a.num / a.den : null, share_then: b.den ? 100 * b.num / b.den : null, weight_now: a.den / Nn, weight_then: b.den / Nt, n_now: a.den, n_then: b.den };
  });
  const Pn = Object.values(gn).reduce((a, x) => a + x.num, 0) / Nn * 100, Pt = Object.values(gt).reduce((a, x) => a + x.num, 0) / Nt * 100;
  let within = 0, mix = 0;
  for (const r of radars) { const pn = r.share_now ?? r.share_then ?? 0, pt = r.share_then ?? r.share_now ?? 0; within += r.weight_then * (pn - pt); mix += (r.weight_now - r.weight_then) * pn; }
  const both = radars.filter((r) => r.share_now != null && r.share_then != null && r.n_now >= 2 && r.n_then >= 2), up = both.filter((r) => r.share_now > r.share_then).length, down = both.filter((r) => r.share_now < r.share_then).length;
  const total = Pn - Pt, verdict = Math.abs(total) < 3 ? "no_change"
    : (Math.sign(total) !== Math.sign(within) && Math.abs(within) >= 1) || (total > 0 && down > up && up === 0) || (total < 0 && up > down && down === 0) ? "paradox"
    : Math.abs(mix) > Math.abs(within) ? "mix_dominates" : "consistent";
  return { now: r1(Pn), then: r1(Pt), change: r1(total), within_radars: r1(within), mix_of_radars: r1(mix), radars_up: up, radars_down: down, verdict,
    radars: radars.map((r) => ({ id: r.id, share_now: r1(r.share_now), share_then: r1(r.share_then), weight_now_pct: Math.round(100 * r.weight_now), weight_then_pct: Math.round(100 * r.weight_then), n_now: r.n_now, n_then: r.n_then })) };
}
export function simpsonReport(nowSet, thenSet, parts, meta = {}) {
  const now = meta.now || Date.now();
  if (!thenSet || !thenSet.length) return { sensor: "simpson", verdict: "collecting", indices: [], generated_at: new Date(now).toISOString() };
  const indices = parts.map((p) => ({ id: p.id, ...(simpsonDecompose(nowSet, thenSet, p.part) || { verdict: "too_few" }) }));
  const order = { paradox: 3, mix_dominates: 2, consistent: 1, no_change: 0, too_few: -1 }, worst = indices.reduce((a, b) => ((order[b.verdict] ?? -1) > (order[a.verdict] ?? -1) ? b : a), indices[0]);
  return {
    sensor: "simpson", verdict: worst ? worst.verdict : "collecting", hours: meta.hours || 6, then_at: meta.thenAt || null, indices,
    question: "When an Orb Studio index changed over the last hours, did it change inside the radars — or only because the mix of radars changed?",
    method: "The headlines on the radars now are compared with those of about 6 hours ago (from the radar life table, as in the Halpern sensor). For each index share (consensus: agreement among agreement-or-conflict headlines; hallucination: odd headlines among all) the change is split into a within-radar effect (each radar's share changed, at the old mix) and a mix effect (some radars now carry more of the counted headlines). paradox = the combined change points the opposite way to the within-radar change, or every radar with data moved against it; mix_dominates = the mix explains more than the radars themselves; consistent = they agree; no_change = under 3 points.",
    rule: "Before saying 'the world agrees more' or 'more odd news', check whether it happened inside the radars or only because one radar now fills more of the feed. Under 'paradox' or 'mix_dominates', report the per-radar picture.",
    honour: SIMPSON, similar: "Simpson's paradox is taught in every statistics course and checked by hand in analyses; research tools detect it in tables and dashboards. This sensor runs the decomposition live on the site's own index changes.",
    generated_at: new Date(now).toISOString(),
  };
}
