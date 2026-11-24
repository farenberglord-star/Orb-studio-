// Датчик «Лимер» — в честь Эдварда Лимера (1944–2025), автора «Let's Take the Con Out of Econometrics» (1983) и
// анализа крайних границ: честный вывод — это не одно число, а разброс по всем разумным вариантам модели.
// Пересчитываем индексы Orb Studio при других, но разумных решениях: без одного радара, без одного ключевого слова,
// только верхние заголовки, спорные заголовки иначе. Показываем вилку и какое решение сильнее всего двигает число.
export const LEAMER = {
  name: "Edward E. Leamer", years: "1944–2025",
  idea: "Extreme bounds: a conclusion is credible only if it survives the reasonable choices of the model; report the range, not just one number.",
  wiki: { en: "https://en.wikipedia.org/wiki/Edward_E._Leamer", ru: "https://en.wikipedia.org/wiki/Edward_E._Leamer" },
  note: "Named in his honour. Orb Studio is not connected with Edward Leamer, his family or UCLA.",
};
export const LEAMER_ROBUST = 10, LEAMER_FRAGILE = 25, LEAMER_TOP = 4;
const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
function wordsOf(re, t) { const g = new RegExp(re.source, re.flags.includes("g") ? re.flags : re.flags + "g"); return [...new Set((String(t || "").match(g) || []).map((w) => w.toLowerCase()))]; }

// heads: [{ radar, title, rank }]; res: { AGREE_RE, FIGHT_RE, ODD_RE }; weirdSerious — число странных новостей с политикой/рынком
export function leamerSpecs(heads, res, weirdSerious = 0) {
  const H = heads.map((h) => ({ ...h, a: wordsOf(res.AGREE_RE, h.title), f: wordsOf(res.FIGHT_RE, h.title), o: wordsOf(res.ODD_RE, h.title) }));
  const cons = (set, drop = null, both = "both") => {
    let a = 0, f = 0;
    for (const h of set) { const ha = h.a.some((w) => w !== drop), hf = h.f.some((w) => w !== drop);
      if (ha && hf) { if (both === "both") { a++; f++; } else if (both === "fight") f++; else if (both === "agree") a++; } else { if (ha) a++; if (hf) f++; } }
    return a + f ? clamp(100 * a / (a + f)) : null; // Кодд: нет ни одного слова — нет данных, а не 0
  };
  const hall = (set, drop = null, ws = weirdSerious) => clamp(8 + set.filter((h) => h.o.some((w) => w !== drop)).length / Math.max(1, set.length) * 250 + ws * 4);
  const radars = [...new Set(H.map((h) => h.radar))], top = H.filter((h) => h.rank < LEAMER_TOP);
  const words = (k) => [...new Set(H.flatMap((h) => h[k]))];
  const specs = { consensus: [], hallucination: [] };
  for (const r of radars) { const s = H.filter((h) => h.radar !== r); specs.consensus.push({ kind: "without_radar", id: r, value: cons(s) }); specs.hallucination.push({ kind: "without_radar", id: r, value: hall(s) }); }
  for (const w of [...words("a"), ...words("f")]) specs.consensus.push({ kind: "without_word", id: w, value: cons(H, w) });
  for (const w of words("o")) specs.hallucination.push({ kind: "without_word", id: w, value: hall(H, w) });
  specs.consensus.push({ kind: "top_headlines_only", id: String(LEAMER_TOP), value: cons(top) }, { kind: "mixed_as_conflict", id: "fight", value: cons(H, null, "fight") }, { kind: "mixed_as_agreement", id: "agree", value: cons(H, null, "agree") }, { kind: "mixed_left_out", id: "none", value: cons(H, null, "none") });
  specs.hallucination.push({ kind: "top_headlines_only", id: String(LEAMER_TOP), value: hall(top) }, { kind: "without_odd_news_feed", id: "upi", value: hall(H, null, 0) });
  return { base: { consensus: cons(H), hallucination: hall(H) }, specs, headlines: H.length, radars: radars.length };
}
export function leamerBounds(base, specs) {
  specs = specs.filter((s) => s.value != null);
  if (base == null) return { value: null, low: null, high: null, median: null, range: null, verdict: "no_data", specifications: specs.length, drivers: [] };
  const vals = [base, ...specs.map((s) => s.value)].sort((x, y) => x - y), lo = vals[0], hi = vals[vals.length - 1];
  const med = vals.length % 2 ? vals[vals.length >> 1] : Math.round((vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2);
  const range = hi - lo, verdict = range <= LEAMER_ROBUST ? "robust" : range <= LEAMER_FRAGILE ? "sensitive" : "fragile";
  const drivers = specs.map((s) => ({ ...s, delta: s.value - base })).filter((s) => s.delta).sort((x, y) => Math.abs(y.delta) - Math.abs(x.delta)).slice(0, 5);
  return { value: base, low: lo, high: hi, median: med, range, verdict, specifications: specs.length + 1, drivers };
}
export function leamerReport(heads, res, weirdSerious, now = Date.now()) {
  if (!heads || !heads.length) return { sensor: "leamer", verdict: "no_data", indices: [], generated_at: new Date(now).toISOString() };
  const s = leamerSpecs(heads, res, weirdSerious);
  const indices = ["consensus", "hallucination"].map((id) => ({ id, ...leamerBounds(s.base[id], s.specs[id]) }));
  const order = { no_data: -1, robust: 0, sensitive: 1, fragile: 2 }, worst = indices.reduce((a, b) => (order[b.verdict] > order[a.verdict] ? b : a));
  return {
    sensor: "leamer", verdict: worst.verdict, headlines: s.headlines, radars: s.radars, indices,
    question: "How much would an Orb Studio index change under other reasonable choices of how it is computed?",
    method: `Each index is recomputed under every reasonable alternative: without one radar at a time, without one keyword at a time, only the top ${LEAMER_TOP} headlines per radar, and (Consensus barometer) headlines with both an agreement and a conflict word counted as conflict, as agreement or left out; (Hallucination index) without the odd-news feed. low–high is the extreme bound over all of them; verdict robust ≤ ${LEAMER_ROBUST} points, sensitive ≤ ${LEAMER_FRAGILE}, fragile above. drivers are the choices that move the number most.`,
    rule: "This shows how much an index depends on Orb Studio's own modelling choices, not whether the news is true. When you quote an index, quote the range too if the verdict is sensitive or fragile.",
    honour: LEAMER, similar: "Extreme bounds analysis (R package ExtremeBounds), specification curve analysis (Simonsohn, Simmons, Nelson) and multiverse analysis are research methods run once for a paper; this sensor runs it live on the site's published indices.",
    generated_at: new Date(now).toISOString(),
  };
}
