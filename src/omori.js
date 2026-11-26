// Датчик «Омори» — в честь Фусакити Омори (1868–1923), автора закона афтершоков («On the After-shocks of Earthquakes», 1894):
// после сильного землетрясения число толчков убывает примерно как 1/t. Мостик «Афтершок — не новое землетрясение»
// (Омори + Рихтер + Стэнли Коэн).
// Вопрос: какие из недавних землетрясений USGS — афтершоки недавнего сильного (M6+) толчка рядом, и какие заголовки радаров
// о «новом землетрясении» на деле говорят об афтершоке. Плюс проверка задним числом: убывали ли афтершоки примерно как 1/t.
// Только описание прошлого: никаких ожиданий на будущее.
import { isQuakeHeadline, matchQuake } from "./cohen_s.js";

export const OMORI = {
  name: "Fusakichi Omori", years: "1868–1923",
  idea: "Omori's law (1894): after a large earthquake the number of aftershocks falls roughly as one over the time elapsed.",
  wiki: { en: "https://en.wikipedia.org/wiki/Fusakichi_Omori", ru: "https://en.wikipedia.org/wiki/Fusakichi_Omori" },
  note: "Named in his honour. Orb Studio is not connected with Fusakichi Omori's family or the University of Tokyo.",
};
export const OMORI_MAIN_MAG = 6, OMORI_KM = 100, OMORI_DAYS = 30;
const D = 864e5, rad = (x) => (x * Math.PI) / 180;
export function kmBetween(a, b) {
  if ([a.lat, a.lon, b.lat, b.lon].some((x) => typeof x !== "number")) return Infinity;
  const dl = rad(b.lat - a.lat), dn = rad(b.lon - a.lon), s = Math.sin(dl / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dn / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(s)));
}

// events: parseFeatures() из USGS (mag, place, time ISO, lat, lon). Возвращает главные толчки с их афтершоками.
export function omoriSequences(events, now = Date.now()) {
  const ev = (events || []).map((e) => ({ ...e, t: Date.parse(e.time) })).filter((e) => Number.isFinite(e.t) && e.t > now - OMORI_DAYS * D && e.t <= now);
  const mains = ev.filter((e) => e.mag >= OMORI_MAIN_MAG).sort((a, b) => b.mag - a.mag);
  const used = new Set(), seqs = [];
  for (const m of mains) {
    if (used.has(m)) continue;
    const after = ev.filter((e) => e !== m && e.t > m.t && e.mag < m.mag && kmBetween(m, e) <= OMORI_KM);
    after.forEach((e) => used.add(e));
    // проверка закона задним числом: при n(t) ~ 1/t сутки 1 и сутки 2–10 дают примерно поровну (ln 1/0,05 ≈ ln 10/1)
    const day1 = after.filter((e) => e.t - m.t <= D).length, days2to10 = after.filter((e) => e.t - m.t > D && e.t - m.t <= 10 * D).length;
    const age = (now - m.t) / D;
    seqs.push({ main: { mag: m.mag, place: m.place, time: m.time, url: m.url || null }, aftershocks: after.length, day1, days2to10,
      decay: age < 10 ? "too_early" : after.length < 10 ? "too_few" : days2to10 <= day1 * 2.5 && days2to10 >= day1 * 0.4 ? "omori_like" : days2to10 > day1 * 2.5 ? "slower_than_omori" : "faster_than_omori",
      largest_aftershock: after.length ? Math.max(...after.map((e) => e.mag)) : null, events: after });
  }
  return seqs;
}

// rows: radar_life [{ radar, headline, first_ts }] за 7 дней
export function omoriReport(rows, events, now = Date.now(), usgsOk = true) {
  const seqs = omoriSequences(events, now), after = new Set(seqs.flatMap((s) => s.events.map((e) => e.time + "|" + e.place)));
  const heads = (rows || []).filter((r) => r && isQuakeHeadline(r.headline)).map((r) => {
    const q = matchQuake(r.headline, events, r.first_ts); if (!q) return null;
    const seq = seqs.find((s) => s.events.some((e) => e.time === q.time && e.place === q.place));
    return { radar: r.radar || null, headline: r.headline, usgs_magnitude: q.mag, usgs_place: q.place, usgs_time: q.time,
      verdict: seq ? "aftershock" : q.mag >= OMORI_MAIN_MAG ? "mainshock" : "independent", of_mainshock: seq ? seq.main : null };
  }).filter(Boolean);
  const afterHeads = heads.filter((h) => h.verdict === "aftershock");
  return {
    sensor: "omori", honour: OMORI, generated_at: new Date(now).toISOString(), usgs_available: usgsOk,
    verdict: !usgsOk ? "no_measurement_source" : !seqs.length ? "no_large_quake_30d" : afterHeads.length ? "aftershock_headlines" : "sequences_without_headlines",
    question: "Is a 'new earthquake' in the news actually an aftershock of a recent large quake nearby?",
    sequences: seqs.map(({ events: e, ...s }) => s), aftershock_events_30d: after.size,
    quake_headlines_matched: heads.length, aftershock_headlines: afterHeads.length, examples: afterHeads.slice(0, 8),
    rule: `USGS events of magnitude 2.5+ over ${OMORI_DAYS} days; a mainshock is magnitude ${OMORI_MAIN_MAG}+; an aftershock is a smaller event within ${OMORI_KM} km after it. Omori check on the past: with n(t) ~ 1/t the first day and days 2-10 hold roughly equal counts. Radar quake headlines are matched to USGS events by the place named (as in Cohen-S).`,
    how_to_use: "aftershock: say it is an aftershock of the named mainshock, not a new earthquake, and give both magnitudes. omori_like: the sequence is fading as aftershocks usually do. This describes what USGS recorded; it is not a forecast of further quakes.",
    limits: "Distance and time window only; a nearby independent quake can be counted as an aftershock. USGS 2.5+ feed: outside the US it holds mostly magnitude 4.5+, so many small aftershocks are missing and too_few is common.",
    disclaimer: "Indicator, not advice. Not a forecast.",
  };
}
