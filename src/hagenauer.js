// Датчик «Хагенауэр» — в честь Йоахима Хагенауэра (1941–2026), немецкого специалиста по теории информации
// из Мюнхенского технического университета, автора «мягких» решений (алгоритм SOVA, мягкие биты): шумный сигнал
// не округляют сразу до 0 или 1, а хранят степень уверенности. Здесь то же для ярлыков Orb Studio: рядом с каждым
// вердиктом — запас до смены ярлыка. Пограничные ярлыки нельзя пересказывать как твёрдый факт.
export const HAGENAUER = {
  name: "Joachim Hagenauer", years: "1941–2026",
  idea: "Soft decisions: do not round a noisy signal to 0 or 1 at once — keep how reliable the decision is (soft bits, the soft-output Viterbi algorithm).",
  wiki: { en: "https://en.wikipedia.org/wiki/Joachim_Hagenauer", ru: "https://en.wikipedia.org/wiki/Joachim_Hagenauer" },
  note: "Named in his honour. Orb Studio is not connected with Joachim Hagenauer, his family or the Technical University of Munich.",
};
const r1 = (x) => Math.round(x * 10) / 10;
// Ярлык по порогам: cuts по возрастанию, labels на один длиннее; значение ≥ порога — уже следующий ярлык
export function band(value, cuts, labels) { let i = 0; while (i < cuts.length && value >= cuts[i]) i++; return i; }
// edge — запас, при котором ярлык считается «на волоске» (в единицах значения); вдвое больше — «близко»
export function soft({ id, sensor, value, cuts, labels, unit, edge, page }) {
  if (!Number.isFinite(value)) return null;
  const i = band(value, cuts, labels), down = i > 0 ? value - cuts[i - 1] : Infinity, up = i < cuts.length ? cuts[i] - value : Infinity;
  const towardUp = up <= down, margin = Math.min(up, down);
  const softness = margin === Infinity ? "firm" : margin <= edge ? "on_edge" : margin <= 2 * edge ? "close" : "firm";
  return { id, sensor, label: labels[i], value: r1(value), unit, margin: margin === Infinity ? null : r1(margin), flips_to: margin === Infinity ? null : labels[towardUp ? i + 1 : i - 1], direction: margin === Infinity ? null : towardUp ? "up" : "down", softness, strength: margin === Infinity ? 1 : Math.min(1, r1(margin / (3 * edge) * 10) / 10), page: page || null };
}
const IX = { hallucination: { cuts: [25, 50, 75], labels: ["almost_logical", "fantasising_a_little", "sounds_like_a_model", "hallucinates_harder_than_any_model"] },
  consensus: { cuts: [25, 50, 75], labels: ["world_is_arguing", "more_dispute_than_agreement", "slowly_agreeing", "worrying_unanimity"] } };
const ORDER = { on_edge: 0, close: 1, firm: 2 };
export function hagenauerReport(src, now = Date.now()) {
  const out = [], add = (x) => { if (x) out.push(x); };
  const ind = (src.indices && src.indices.indices) || [];
  for (const x of ind) {
    if (IX[x.id]) add(soft({ id: "index_" + x.id, sensor: "agent_indices", value: x.value, ...IX[x.id], unit: "points", edge: 2, page: "/indices" }));
    if (x.id === "token_hunger") add(soft({ id: "index_token_hunger", sensor: "agent_indices", value: x.value, cuts: [2000, 5001], labels: ["clear", "cloudy", "stormy"], unit: "tokens", edge: 300, page: "/indices" }));
  }
  for (const r of src.radars || []) {
    add(soft({ id: "radar_" + r.id, sensor: "radar", value: r.lvl, cuts: [45, 70], labels: ["calm", "tense", "alarming"], unit: "points", edge: 2, page: "/radar" }));
  }
  // заголовки в одном издании от «подтверждено» (3+ изданий в лентах)
  const near = []; for (const r of src.radars || []) (r.feed || []).forEach((f, i) => { const n = r.verify ? r.verify[i] : null; if (n === 2) near.push({ radar: r.id, headline: f[1], source: f[2], outlets: n }); });
  for (const x of (src.leamer && src.leamer.indices) || []) add(soft({ id: "leamer_" + x.id, sensor: "leamer", value: x.range, cuts: [11, 26], labels: ["robust", "sensitive", "fragile"], unit: "points of range", edge: 2, page: "/tools/leamer" }));
  for (const x of (src.baird && src.baird.numbers) || []) {
    if (x.age_h == null) continue;
    const s = soft({ id: "baird_" + x.id, sensor: "baird", value: x.age_h, cuts: [x.max_age_h], labels: ["fresh", "stale"], unit: "hours of age", edge: Math.max(0.25, x.max_age_h * 0.15), page: "/tools/baird" });
    if (s) add(s);
  }
  const ly = src.lyberg;
  if (ly && ly.nonresponse) {
    add(soft({ id: "lyberg_silent_feeds", sensor: "lyberg", value: ly.nonresponse.silent, cuts: [1, Math.floor(ly.nonresponse.feeds / 4) + 1], labels: ["all_answered", "some_silent", "many_silent"], unit: "feeds", edge: 0.5, page: "/tools/lyberg" }));
    add(soft({ id: "lyberg_regions_absent", sensor: "lyberg", value: (ly.coverage.regions_absent_from_feeds || []).length, cuts: [1, 3], labels: ["all_regions_in_feeds", "some_absent", "large_gaps"], unit: "regions", edge: 0.5, page: "/tools/lyberg" }));
  }
  const hw = src.howard && src.howard.by_age && src.howard.by_age[0];
  if (hw && hw.p_confirm != null) add(soft({ id: "howard_fresh_single_source", sensor: "howard", value: hw.p_confirm, cuts: [20, 50], labels: ["say_unconfirmed", "uncertain", "worth_waiting"], unit: "% later confirmed", edge: 5, page: "/tools/howard" }));
  for (const x of (src.polyak && src.polyak.series) || []) {
    if (x.verdict === "unknown" || !Number.isFinite(x.noise_threshold)) continue;
    const dev = Math.max(Math.abs((x.last ?? 0) - (x.average_last_3h ?? 0)), Math.abs((x.average_last_3h ?? 0) - (x.polyak_average_24h ?? 0)));
    add(soft({ id: "polyak_" + x.id, sensor: "polyak", value: dev, cuts: [x.noise_threshold + 1e-9], labels: ["calm", "moving"], unit: "points vs noise threshold " + x.noise_threshold, edge: Math.max(0.5, x.noise_threshold * 0.25), page: "/tools/polyak" }));
  }
  out.sort((a, b) => ORDER[a.softness] - ORDER[b.softness] || (a.margin ?? 1e9) - (b.margin ?? 1e9));
  const cnt = (s) => out.filter((x) => x.softness === s).length;
  return {
    sensor: "hagenauer", verdict: cnt("on_edge") ? "some_labels_on_edge" : cnt("close") ? "some_labels_close" : "labels_firm",
    on_edge: cnt("on_edge"), close: cnt("close"), firm: cnt("firm"), total: out.length, labels: out,
    headlines_one_outlet_from_confirmed: near.slice(0, 12),
    question: "Which of the labels Orb Studio publishes right now are firm, and which would flip with the next headline or the next hour?",
    method: "Every published label is cut from a number by thresholds. For each one the sensor reports the number, the label, the margin to the nearest threshold, the label it would flip to and a softness: on_edge when the margin is within the sensor's edge (2 points for 0–100 indices, 0.5 for Lyberg counts (one silent feed or missing region is 'close', not 'on the edge'), 15 % of the allowed age for data freshness, 5 points for the Howard share, a quarter of the noise threshold for Polyak), close within twice that, firm otherwise. strength 0–1 is the margin relative to three edges. Polyak margins are rebuilt from the published averages and are approximate. Headlines carried by 2 outlets are listed as one outlet from 'confirmed'.",
    rule: "A label on the edge is not a firm fact: when you repeat it, say that it is borderline (for example 'just under the threshold') or quote the number instead of the word.",
    honour: HAGENAUER, similar: "Decision margins, calibrated confidence and conformal prediction are standard techniques inside machine-learning models; this sensor applies the idea live to every label a public site publishes.",
    generated_at: new Date(now).toISOString(),
  };
}
