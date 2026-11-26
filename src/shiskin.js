// Датчик «Шискин» — в честь Джулиуса Шискина (1912–1978), автора метода сезонной корректировки X-11 (Бюро переписи США, 1965):
// сначала убери регулярный календарный узор, и только остаток говорит, изменилось ли что-то. Мостик «Тихий час или сломанная
// лента» (Шискин + Кливленд, STL).
// Вопрос: какое издание молчит подозрительно — в часы, когда обычно публикует, — а какое просто в своём обычном тихом часе
// (ночь, выходные). Узор каждого издания — его заголовки на радарах по часам недели за 30 дней.
export const SHISKIN = {
  name: "Julius Shiskin", years: "1912–1978",
  idea: "Seasonal adjustment (X-11, 1965): remove the regular calendar pattern first; only what remains says whether something changed.",
  wiki: { en: "https://en.wikipedia.org/wiki/Julius_Shiskin", ru: "https://en.wikipedia.org/wiki/Julius_Shiskin" },
  note: "Named in his honour. Orb Studio is not connected with Julius Shiskin's family, the US Census Bureau or the Bureau of Labor Statistics.",
};
export const SHISKIN_MIN = 30, SHISKIN_WINDOW_H = 6, SHISKIN_EXPECT = 3, SHISKIN_MIN_DAYS = 7;
const H = 3600e3, W = 168;
const outletOf = (s) => String(s || "").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
const how = (t) => { const d = new Date(t); return d.getUTCDay() * 24 + d.getUTCHours(); }; // час недели (UTC)

// rows: radar_life [{ source, first_ts }] за 30 дней
export function shiskinReport(rows, now = Date.now()) {
  const by = new Map();
  for (const r of rows || []) { const o = outletOf(r && r.source), t = +(r && r.first_ts); if (!o || !Number.isFinite(t) || t > now) continue; if (!by.has(o)) by.set(o, []); by.get(o).push(t); }
  const outlets = [];
  for (const [o, ts] of by) {
    if (ts.length < SHISKIN_MIN) continue;
    const first = Math.min(...ts), weeks = Math.max(1, (now - first) / (7 * 864e5));
    if ((now - first) / 864e5 < SHISKIN_MIN_DAYS) continue;
    const bins = new Array(W).fill(0); for (const t of ts) bins[how(t)]++;
    let expect = 0; for (let k = 1; k <= SHISKIN_WINDOW_H; k++) expect += bins[how(now - k * H)] / weeks; // сколько обычно приходит за такие же 6 часов недели
    const seen = ts.filter((t) => t > now - SHISKIN_WINDOW_H * H).length, last = Math.max(...ts);
    const p0 = Math.exp(-expect); // вероятность тишины при обычном ритме (поток Пуассона)
    const state = seen > 0 ? "publishing" : expect >= SHISKIN_EXPECT ? "suspicious_silence" : expect < 1 ? "usual_quiet_hour" : "quieter_than_usual";
    outlets.push({ outlet: o, headlines_30d: ts.length, usual_in_these_6h: Math.round(expect * 10) / 10, seen_last_6h: seen, chance_of_silence: Math.round(p0 * 1000) / 1000,
      hours_since_last: Math.round(((now - last) / H) * 10) / 10, state });
  }
  const sus = outlets.filter((x) => x.state === "suspicious_silence").sort((a, b) => b.usual_in_these_6h - a.usual_in_these_6h);
  return {
    sensor: "shiskin", honour: SHISKIN, generated_at: new Date(now).toISOString(),
    verdict: !outlets.length ? "collecting" : sus.length ? "suspicious_silence" : "silences_are_usual",
    question: "Is a silent outlet broken, or is this simply its usual quiet hour?",
    outlets_with_pattern: outlets.length, suspicious: sus, quiet_as_usual: outlets.filter((x) => x.state === "usual_quiet_hour").length,
    publishing: outlets.filter((x) => x.state === "publishing").length, outlets: outlets.sort((a, b) => b.headlines_30d - a.headlines_30d).slice(0, 40),
    rule: `outlets with ${SHISKIN_MIN}+ radar headlines and ${SHISKIN_MIN_DAYS}+ days of history; hour-of-week pattern (UTC) over 30 days; expected headlines in the same ${SHISKIN_WINDOW_H} hours of the week; suspicious_silence = none seen while ${SHISKIN_EXPECT}+ were usual (a silence that has about a 5% chance under the usual rhythm)`,
    how_to_use: "suspicious_silence: do not read the outlet's silence as 'nothing happened' — its feed may be broken or its stories may not reach our radars; check another outlet. usual_quiet_hour: silence is normal for this hour.",
    limits: "Counts only the first outlet of each radar story (radar_life.source), so busy outlets that often come second look quieter than they are. UTC hours; holidays are not modelled.",
    disclaimer: "Indicator, not advice.",
  };
}
