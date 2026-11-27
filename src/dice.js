// Датчик «Дайс» — в честь Ли Р. Дайса (1887–1977), автора коэффициента сходства двух наборов («Measures of the Amount of Ecologic
// Association Between Species», 1945): удвоенная общая часть, делённая на сумму обоих наборов. Мостик «След копии»
// (Локар + Бертильон + Мостеллер + Нароль + Маас + Эллегорд + Свартвик + Дайс).
// Вопрос: когда несколько изданий пишут об одном событии, не похожи ли их заголовки настолько, что это один текст в нескольких местах?
// Результат — флаг «похоже на копию» и порядок появления; кто у кого скопировал, датчик не говорит.
import { sameEventGroups, KRIPP_HOURS } from "./krippendorff.js";
import { storyStems } from "./duo.js";

export const DICE = {
  name: "Lee R. Dice", years: "1887–1977",
  idea: "Similarity of two sets is twice the shared part over the sum of both; stems shared by outlets that nobody else uses are the trace of one text.",
  wiki: { en: "https://en.wikipedia.org/wiki/Lee_R._Dice", ru: "https://en.wikipedia.org/wiki/Lee_R._Dice" },
  note: "Named in his honour. Orb Studio is not connected with Lee R. Dice's family or the University of Michigan.",
};
export const DICE_HIGH = 0.75, DICE_MIN_GROUPS = 10, DICE_RARE_DF = 3; // 0,75 — рабочее допущение; основа «редкая», если стоит не более чем в 3 заголовках потока
export function diceCoef(a, b) {
  const A = a instanceof Set ? a : new Set(a), B = b instanceof Set ? b : new Set(b);
  if (!A.size || !B.size) return null;
  let k = 0; for (const w of A) if (B.has(w)) k++;
  return Math.round(((2 * k) / (A.size + B.size)) * 100) / 100;
}
export function diceReport(rows, now = Date.now()) {
  const all = (rows || []).filter((r) => r && r.headline); const df = {};
  for (const r of all) for (const w of storyStems(r.headline)) df[w] = (df[w] || 0) + 1;
  const groups = sameEventGroups(rows), out = [];
  let pairs = 0, high = 0;
  for (const xs of groups) {
    const S = xs.map((x) => storyStems(x.headline)); let best = null;
    for (let i = 0; i < xs.length; i++) for (let j = i + 1; j < xs.length; j++) {
      const d = diceCoef(S[i], S[j]); if (d == null) continue; pairs++; if (d >= DICE_HIGH) high++;
      const rare = [...S[i]].filter((w) => S[j].has(w) && df[w] <= DICE_RARE_DF);
      if (!best || d > best.dice) best = { dice: d, a: xs[i], b: xs[j], rare };
    }
    if (best && (best.dice >= DICE_HIGH || best.rare.length >= 2)) out.push(best);
  }
  const verdict = groups.length < DICE_MIN_GROUPS ? "collecting" : !out.length ? "no_copy_like_pairs" : high / Math.max(1, pairs) >= 0.25 ? "many_copy_like" : "some_copy_like";
  return {
    sensor: "dice", honour: DICE, generated_at: new Date(now).toISOString(), verdict,
    question: "When several outlets report the same event, do some of their headlines look like one text copied between outlets?",
    events_with_2plus_outlets: groups.length, outlet_pairs_compared: pairs, pairs_at_or_above_0_75: high,
    share_pairs_high_pct: pairs ? Math.round((100 * high) / pairs) : null,
    examples: out.sort((x, y) => y.dice - x.dice).slice(0, 6).map((b) => ({ dice: b.dice, shared_rare_stems: b.rare.slice(0, 6),
      earlier: { outlet: b.a.first_ts <= b.b.first_ts ? b.a.outlet : b.b.outlet, headline: (b.a.first_ts <= b.b.first_ts ? b.a : b.b).headline },
      later: { outlet: b.a.first_ts <= b.b.first_ts ? b.b.outlet : b.a.outlet, headline: (b.a.first_ts <= b.b.first_ts ? b.b : b.a).headline } })),
    rule: `radar stories of the last ${KRIPP_HOURS} h; the same event at different outlets is matched as in the Krippendorff sensor; for each pair of outlets Dice = 2 x shared word stems / (stems of both headlines); a pair is flagged when Dice >= ${DICE_HIGH} (working assumption) or the headlines share 2+ stems that occur in at most ${DICE_RARE_DF} headlines of the whole stream; the earlier and the later outlet are named by first-seen time`,
    how_to_use: "A flagged pair: say the two reports may be one text, count them as one source, and do not count the later one as a second confirmation. no_copy_like_pairs: nothing to flag; this still does not show that outlets checked independently.",
    limits: "Headlines only, word stems, no AI. Short headlines about a fixed fact (a score, a rate) look alike without copying; wire agencies legitimately supply the same text. The earlier outlet is the first one we saw, not necessarily the source. A flag, never a verdict on who copied.",
    disclaimer: "Indicator, not advice.",
  };
}
