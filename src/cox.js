// Датчик «Кокс» — в честь сэра Дэвида Кокса (1924–2022), автора модели пропорциональных рисков (1972).
// Сколько живёт новость на радарах Orb Studio: от первого появления заголовка до того, как он пропал. Истории, которые ещё на радаре,
// учитываются как «ещё живы» (цензурирование). Для каждого радара — медиана по Каплану — Мейеру и отношение рисков Кокса против остальных радаров.
export const COX = {
  name: "David Cox", years: "1924–2022",
  idea: "The proportional hazards model (1972): how a factor changes the risk that an event happens at any moment, using also the cases where the event has not happened yet.",
  wiki: { en: "https://en.wikipedia.org/wiki/David_Cox_(statistician)", ru: "https://en.wikipedia.org/wiki/David_Cox_(statistician)" }, // русской статьи не проверяла — ведём на английскую
  note: "Named in his honour. Orb Studio is not connected with David Cox, his family or the University of Oxford.",
};
export const COX_GAP = 2 * 3600e3, COX_STEP = 30 * 60e3; // заголовка нет на радаре 2 часа — история закончилась
// stories: [{ radar, first_ts, last_ts }] → длительность в часах и событие (закончилась или ещё жива)
export function coxDurations(stories, now) {
  return (stories || []).filter((s) => s && s.first_ts && s.last_ts).map((s) => { const ended = now - s.last_ts > COX_GAP;
    return { radar: s.radar, t: Math.max(COX_STEP, (ended ? s.last_ts - s.first_ts + COX_STEP : now - s.first_ts)) / 3600e3, e: ended ? 1 : 0 }; });
}
export function kmMedian(d) {
  const s = [...d].sort((a, b) => a.t - b.t); let atRisk = s.length, surv = 1;
  for (let i = 0; i < s.length;) { const t = s[i].t; let ev = 0, n = 0; while (i < s.length && s[i].t === t) { ev += s[i].e; n++; i++; }
    if (ev) { surv *= 1 - ev / atRisk; if (surv <= 0.5) return Math.round(t * 10) / 10; } atRisk -= n; }
  return null; // половина историй ещё жива — медиану честно не назвать
}
// одномерная модель Кокса (x = 1 — этот радар, 0 — остальные), метод Ньютона, связи по Бреслоу
export function coxHR(d, isX) {
  const s = d.map((r) => ({ t: r.t, e: r.e, x: isX(r) ? 1 : 0 })).sort((a, b) => b.t - a.t);
  if (s.filter((r) => r.e && r.x).length < 3 || s.filter((r) => r.e && !r.x).length < 3) return null;
  let b = 0;
  for (let it = 0; it < 30; it++) { let U = 0, I = 0;
    for (const ev of s.filter((r) => r.e)) { let s0 = 0, s1 = 0; for (const r of s) if (r.t >= ev.t) { const w = Math.exp(b * r.x); s0 += w; s1 += w * r.x; }
      const p = s1 / s0; U += ev.x - p; I += p * (1 - p); }
    if (I <= 1e-9) return null; const step = U / I; b += Math.max(-2, Math.min(2, step)); if (Math.abs(step) < 1e-6) {
      const se = 1 / Math.sqrt(I), rd = (x) => Math.round(x * 100) / 100; return { hr: rd(Math.exp(b)), low: rd(Math.exp(b - 1.96 * se)), high: rd(Math.exp(b + 1.96 * se)) }; } }
  return null;
}
export function coxReport(stories, radars, now = Date.now()) {
  const d = coxDurations(stories, now), ended = d.filter((r) => r.e).length;
  const list = radars.map((id) => { const mine = d.filter((r) => r.radar === id), hr = coxHR(d, (r) => r.radar === id);
    return { id, stories: mine.length, ended: mine.filter((r) => r.e).length, median_hours: kmMedian(mine), hazard_ratio: hr,
      verdict: !hr ? "not_enough" : hr.low > 1 ? "shorter" : hr.high < 1 ? "longer" : "like_others" }; });
  return { sensor: "cox", checked_at: new Date(now).toISOString(), stories: d.length, ended, median_hours_all: kmMedian(d), radars: list, honour: COX,
    how_to_read: "A story starts when its headline first appears on an Orb Studio radar and ends when it has not been seen for 2 hours; stories still on a radar count as still alive (censored). median_hours = Kaplan–Meier median lifetime. hazard_ratio = Cox proportional hazards model, this radar against all others: above 1 its stories end sooner, below 1 they live longer; low–high is the 95% interval. verdict shorter/longer only when the whole interval is on one side of 1. not_enough = fewer than 3 ended stories on either side. Past data only." };
}
