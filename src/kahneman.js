// Датчик «Канеман» — в честь Даниэля Канемана (1934–2024), автора книги «Шум» (2021, с Сибони и Санстейном).
// Аудит шума: три ИИ-гостя круглого стола оценивают одну и ту же новость (важность для людей в Европе и уверенность в фактах, 0–10).
// Разброс их оценок — шум; он раскладывается на шум уровня (кто-то всегда выше) и шум суждения (расходятся на конкретной теме).
export const KAHNEMAN = {
  name: "Daniel Kahneman", years: "1934–2024",
  idea: "Noise: judgements of the same case that should agree are scattered. System noise splits into level noise (one judge is always higher) and pattern noise (judges react differently to a particular case); a noise audit gives the same case to several judges and measures the spread.",
  wiki: { ru: "https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D0%BD%D0%B5%D0%BC%D0%B0%D0%BD,_%D0%94%D0%B0%D0%BD%D0%B8%D1%8D%D0%BB%D1%8C", en: "https://en.wikipedia.org/wiki/Daniel_Kahneman" },
  note: "Named in his honour. Orb Studio is not connected with Daniel Kahneman, his family or his co-authors.",
};
export const KAHNEMAN_SCALES = ["importance", "confidence"];
const r1 = (x) => (x == null || !Number.isFinite(x) ? null : Math.round(x * 10) / 10), mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
// матрица тем × гостей; только темы, где оценили все гости
export function noiseAudit(rows, guests) {
  const full = rows.filter((r) => guests.every((g) => Number.isFinite(r.scores[g])));
  if (full.length < 2) return { topics: full.length, system_noise: null, level_noise: null, pattern_noise: null, level_by_guest: null };
  const m = full.map((r) => mean(guests.map((g) => r.scores[g])));
  const level = Object.fromEntries(guests.map((g) => [g, mean(full.map((r, i) => r.scores[g] - m[i]))]));
  const sysVar = mean(full.map((r, i) => mean(guests.map((g) => (r.scores[g] - m[i]) ** 2))));
  const lvlVar = mean(guests.map((g) => level[g] ** 2));
  const patVar = mean(full.flatMap((r, i) => guests.map((g) => (r.scores[g] - m[i] - level[g]) ** 2)));
  return { topics: full.length, system_noise: r1(Math.sqrt(sysVar)), level_noise: r1(Math.sqrt(lvlVar)), pattern_noise: r1(Math.sqrt(patVar)), level_by_guest: Object.fromEntries(guests.map((g) => [g, r1(level[g])])) };
}
// episodes: архив круглого стола (новые первыми)
export function kahnemanReport(episodes, guests, now = Date.now(), days = 14) {
  const from = now - days * 864e5, rows = { importance: [], confidence: [] }, topics = [];
  for (const ep of episodes || []) { if (!ep || !Array.isArray(ep.topics) || Date.parse(ep.generated_at) < from) continue;
    for (const t of ep.topics) { const sc = { importance: {}, confidence: {} };
      for (const g of guests) { const a = t.answers && t.answers[g]; if (!a || a.status !== "ok") continue; for (const k of KAHNEMAN_SCALES) if (Number.isInteger(a[k]) && a[k] >= 0 && a[k] <= 10) sc[k][g] = a[k]; }
      for (const k of KAHNEMAN_SCALES) rows[k].push({ scores: sc[k] });
      const imp = Object.values(sc.importance); if (imp.length >= 2) topics.push({ headline: t.headline || null, source: t.source || null, at: ep.generated_at, importance: sc.importance, confidence: sc.confidence, spread: Math.max(...imp) - Math.min(...imp) }); } }
  const audit = Object.fromEntries(KAHNEMAN_SCALES.map((k) => [k, noiseAudit(rows[k], guests)]));
  const byNoise = [...topics].sort((a, b) => b.spread - a.spread);
  return { sensor: "kahneman", checked_at: new Date(now).toISOString(), period_days: days, guests, topics_rated: audit.importance.topics, audit,
    loudest_topics: byNoise.slice(0, 3), quietest_topics: byNoise.slice(-3).reverse(), honour: KAHNEMAN,
    how_to_read: "On the AI Round Table three AI guests answer the same question about the same news and give two numbers from 0 to 10: how much it matters for ordinary people in Europe, and how sure they are about the facts. system_noise = typical distance of a guest's number from the topic average (in points); level_noise = part that comes from a guest being always higher or lower (level_by_guest shows who); pattern_noise = part that comes from guests reacting differently to a particular topic. system_noise² = level_noise² + pattern_noise². The sensor measures disagreement, not who is right. null = not enough rated topics yet." };
}
