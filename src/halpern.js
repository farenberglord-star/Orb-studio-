// Датчик «Халперн» — в честь Джозефа Халперна (1953–2026), автора (с Джудеей Перлом) определения фактической причины.
// «Почему сдвинулся индекс»: какие именно заголовки сдвинули индекс Orb Studio. Причина по Халперну — Перлу: если бы этих
// заголовков не было (или ушедшие остались), индекс был бы прежним; берём наименьший такой набор. Плюс — из чего индекс состоит сейчас.
export const HALPERN = {
  name: "Joseph Halpern", years: "1953–2026",
  idea: "Actual causality (Halpern–Pearl): X is a cause of Y if, had X been different, Y would have been different – and the cause is the smallest such set.",
  wiki: { en: "https://en.wikipedia.org/wiki/Joseph_Halpern", ru: "https://en.wikipedia.org/wiki/Joseph_Halpern" }, // русской статьи нет в проверке — ведём на английскую
  source: "https://www.news.cornell.edu/stories/2026/02/joe-halpern-towering-computer-scientist-and-mentor-dies-72",
  note: "Named in his honour. Orb Studio is not connected with Joseph Halpern, his family or Cornell University.",
};
export const HALPERN_HOURS = 6, HALPERN_TOL = 2; // сравниваем с 6 часами назад; «прежний» = в пределах 2 пунктов
// index: { id, value(set) → число, tag(h) → "agree"|"fight"|"odd"|null }; set: [{ k, headline, source, radar }]
export function explainIndex(index, now, then) {
  const key = (h) => h.k, inThen = new Set(then.map(key)), inNow = new Set(now.map(key));
  const vNow = index.value(now), vThen = index.value(then);
  const tagged = (a) => a.map((h) => ({ ...h, tag: index.tag(h.headline) })).filter((h) => h.tag);
  const entered = tagged(now.filter((h) => !inThen.has(key(h)))).map((h) => ({ ...h, role: "entered" })), left = tagged(then.filter((h) => !inNow.has(key(h)))).map((h) => ({ ...h, role: "left" }));
  const revert = (set, c) => (c.role === "entered" ? set.filter((h) => key(h) !== key(c)) : [...set, c]);
  let set = now, causes = [];
  if (Math.abs(vNow - vThen) > HALPERN_TOL) {
    const pool = [...entered, ...left];
    while (pool.length && Math.abs(index.value(set) - vThen) > HALPERN_TOL) { // жадно: каждый раз берём заголовок, который сильнее всего возвращает индекс
      let best = -1, bestD = Infinity; pool.forEach((c, i) => { const d = Math.abs(index.value(revert(set, c)) - vThen); if (d < bestD) { bestD = d; best = i; } });
      if (best < 0 || bestD >= Math.abs(index.value(set) - vThen)) break;
      const c = pool.splice(best, 1)[0]; causes.push(c); set = revert(set, c);
    }
  }
  const explained = Math.abs(vNow - vThen) <= HALPERN_TOL ? "no_shift" : Math.abs(index.value(set) - vThen) <= HALPERN_TOL ? "explained" : "partly";
  const clean = (h) => ({ headline: h.headline, source: h.source || null, radar: h.radar || null, role: h.role, kind: h.tag });
  return { id: index.id, value_now: vNow, value_then: vThen, shift: vNow - vThen, verdict: explained, causes: causes.map(clean),
    made_of_now: tagged(now).slice(0, 12).map((h) => ({ headline: h.headline, source: h.source || null, radar: h.radar || null, kind: h.tag })) };
}
export function halpernReport(indices, now, then, meta = {}) {
  const ready = Array.isArray(then) && then.length > 0;
  return { sensor: "halpern", checked_at: new Date(meta.now || Date.now()).toISOString(), compared_with: ready ? meta.thenAt || null : null, hours: HALPERN_HOURS,
    indices: indices.map((ix) => (ready ? explainIndex(ix, now, then) : { id: ix.id, value_now: ix.value(now), value_then: null, shift: null, verdict: "collecting", causes: [],
      made_of_now: now.map((h) => ({ headline: h.headline, source: h.source || null, radar: h.radar || null, kind: ix.tag(h.headline) })).filter((h) => h.kind).slice(0, 12) })),
    honour: HALPERN,
    how_to_read: "Values are recomputed from the radar headlines recorded now and " + HALPERN_HOURS + " hours ago (same formula as the Orb Studio indices; for the hallucination index only the radar part, the separate feed of curious news is not stored). causes = the smallest set of headlines that, had they not appeared (entered) or had they stayed (left), would bring the index back within " + HALPERN_TOL + " points of its earlier value – the Halpern–Pearl test of actual causation, found greedily. verdict: no_shift, explained, partly (the listed headlines explain only part), collecting (not enough history yet). made_of_now = headlines that currently feed the index." };
}
