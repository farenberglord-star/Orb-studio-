// Датчик «Тревизан» — в честь Луки Тревизана (1971–2024), итальянского специалиста по теории вычислений
// (псевдослучайность, сублинейные алгоритмы): ответ можно получить, не читая все данные. Здесь — сколько заголовков
// радаров достаточно случайно прочесть, чтобы индекс Orb Studio вышел тем же в пределах ±5 пунктов.
export const TREVISAN = {
  name: "Luca Trevisan", years: "1971–2024",
  idea: "Sublinear algorithms and pseudorandomness: a well-chosen random sample can answer a question without reading all the data.",
  wiki: { en: "https://en.wikipedia.org/wiki/Luca_Trevisan", ru: "https://en.wikipedia.org/wiki/Luca_Trevisan" },
  note: "Named in his honour. Orb Studio is not connected with Luca Trevisan, his family or Bocconi University.",
};
export const TREVISAN_TOL = 5, TREVISAN_SHARE = 0.9, TREVISAN_DRAWS = 300;
const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
// детерминированный генератор, чтобы ответ не скакал от запроса к запросу
function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function sample(arr, k, r) { const a = arr.slice(); for (let i = 0; i < k; i++) { const j = i + Math.floor(r() * (a.length - i)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k); }
export function trevisanReport(heads, res, weirdSerious = 0, now = Date.now()) {
  const H = (heads || []).map((h) => ({ t: h.title, a: res.AGREE_RE.test(h.title || ""), f: res.FIGHT_RE.test(h.title || ""), o: res.ODD_RE.test(h.title || ""), len: String(h.title || "").length }));
  const n = H.length;
  if (n < 10) return { sensor: "trevisan", verdict: "no_data", headlines: n, generated_at: new Date(now).toISOString() };
  const ix = { consensus: (s) => { const a = s.filter((h) => h.a).length, f = s.filter((h) => h.f).length; return clamp(100 * a / Math.max(1, a + f)); },
    hallucination: (s) => clamp(8 + s.filter((h) => h.o).length / Math.max(1, s.length) * 250 + weirdSerious * 4) };
  const tokPer = H.reduce((a, h) => a + h.len, 0) / n / 4, sizes = [...new Set([5, 10, 15, 20, 25, 30, 40, 50, 60, 80].filter((k) => k < n)), n];
  const indices = Object.entries(ix).map(([id, f]) => {
    const full = f(H), r = rng(n * 7919 + id.length), curve = [];
    for (const k of sizes) { let hit = 0; for (let d = 0; d < TREVISAN_DRAWS; d++) if (Math.abs(f(sample(H, k, r)) - full) <= TREVISAN_TOL) hit++; curve.push({ headlines: k, within_tolerance_pct: Math.round(100 * hit / TREVISAN_DRAWS) }); }
    const enough = curve.find((c) => c.within_tolerance_pct >= TREVISAN_SHARE * 100) || curve[curve.length - 1];
    return { id, value: full, enough_headlines: enough.headlines, of: n, share_needed_pct: Math.round(100 * enough.headlines / n), tokens_full: Math.round(tokPer * n), tokens_enough: Math.round(tokPer * enough.headlines), curve };
  });
  return {
    sensor: "trevisan", headlines: n, indices, verdict: indices.every((x) => x.enough_headlines < n) ? "sample_is_enough" : "needs_most_headlines",
    question: "How many radar headlines does an agent need to read, chosen at random, to get the same Orb Studio index within ±5 points?",
    method: `For each index the sensor draws ${TREVISAN_DRAWS} random samples of k headlines (k = 5, 10, 15 …) from the current radar headlines and recomputes the index on each sample. enough_headlines is the smallest k for which at least ${TREVISAN_SHARE * 100} % of samples land within ±${TREVISAN_TOL} points of the full value. Tokens are estimated at 4 characters per token of headline text. Deterministic random draws, so the answer is stable for the same headlines.`,
    rule: "If you only need the index, read the index (get_agent_indices) rather than all headlines; if you build your own picture from headlines, read at least enough_headlines chosen at random, not only the first ones, and say that you sampled.",
    honour: TREVISAN, similar: "Sample-size calculators and sublinear/property-testing algorithms are standard tools; this sensor measures live how many of the site's own headlines its indices actually need.",
    generated_at: new Date(now).toISOString(),
  };
}
