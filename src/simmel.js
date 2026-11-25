// Датчик «Зиммель» — в честь Георга Зиммеля (1858–1918): «Большие города и духовная жизнь» (1903). Под постоянным потоком
// раздражителей горожанин притупляется. Мостик «больше потока — слабее отклик». Вопрос: когда за 30 минут пришло много новых
// историй, индексы радаров сдвигаются сильнее, так же или слабее, чем в обычные получасы?
// Поток = число новых историй радаров за получас (radar_life.first_ts). Отклик = средний |сдвиг| уровней 8 радаров между
// соседними точками ix_hist. Это не внимание людей и не причина: только связь двух рядов.
export const SIMMEL = {
  name: "Georg Simmel", years: "1858–1918",
  idea: "'Die Großstädte und das Geistesleben' (1903): under a constant flood of stimuli the city dweller protects himself with a blasé reserve.",
  wiki: { en: "https://en.wikipedia.org/wiki/Georg_Simmel", ru: "https://en.wikipedia.org/wiki/Georg_Simmel" },
  note: "Named in his honour. Orb Studio is not connected with Georg Simmel, his family or any university.",
};
export const SIMMEL_MIN_SLOTS = 100, SIMMEL_MIN_HIGH = 8, SIMMEL_DAYS = 14, SIMMEL_Q = 0.9, SIMMEL_DULL = 0.8, SIMMEL_SHARP = 1.25, SIMMEL_GAP = 45 * 60e3;
const RADARS = ["g", "k", "b", "p", "e", "n", "j", "w"];
const r2 = (x) => (x == null ? null : Math.round(x * 100) / 100);
const mean = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : null);

// ix: [{ts, g,k,b,p,e,n,j,w}] по времени; storyTs: first_ts историй; since: начало учёта историй
export function simmelSlots(ix, storyTs, since) {
  const ts = [...storyTs].map(Number).filter(Boolean).sort((a, b) => a - b), out = []; let lo = 0;
  const rows = [...(ix || [])].sort((a, b) => a.ts - b.ts);
  for (let i = 1; i < rows.length; i++) {
    const a = rows[i - 1], b = rows[i]; if (b.ts - a.ts > SIMMEL_GAP || (since && a.ts < since)) continue;
    const d = RADARS.filter((k) => a[k] != null && b[k] != null).map((k) => Math.abs(b[k] - a[k])); if (d.length < 4) continue;
    while (lo < ts.length && ts[lo] <= a.ts) lo++; let hi = lo; while (hi < ts.length && ts[hi] <= b.ts) hi++;
    out.push({ ts: b.ts, flow: hi - lo, move: mean(d) });
  }
  return out;
}
export function simmelReport(ix, storyTs, now = Date.now(), since = null) {
  const slots = simmelSlots(ix, storyTs, since), n = slots.length;
  const fl = slots.map((s) => s.flow).sort((a, b) => a - b), thr = n ? fl[Math.min(n - 1, Math.floor(SIMMEL_Q * n))] : null;
  let high = thr == null ? [] : slots.filter((s) => s.flow >= thr && s.flow > 0); if (high.length > 0.25 * n) high = slots.filter((s) => s.flow > thr); // при ничьих порог строгий
  const rest = slots.filter((s) => !high.includes(s));
  const mh = mean(high.map((s) => s.move)), mr = mean(rest.map((s) => s.move)), ratio = mh != null && mr ? mh / mr : null;
  const verdict = n < SIMMEL_MIN_SLOTS || high.length < SIMMEL_MIN_HIGH || ratio == null ? "collecting" : ratio < SIMMEL_DULL ? "dulled_under_flow" : ratio > SIMMEL_SHARP ? "sharper_under_flow" : "same_under_flow";
  const days = {}; for (const s of slots) { const d = new Date(s.ts).toISOString().slice(0, 10); (days[d] ||= []).push(s); }
  const by_day = Object.keys(days).sort().slice(-7).map((d) => ({ day: d, slots: days[d].length, flow_mean: r2(mean(days[d].map((s) => s.flow))), move_mean: r2(mean(days[d].map((s) => s.move))) }));
  return {
    sensor: "simmel", verdict, slots: n, high_flow_slots: high.length, high_flow_from: thr,
    move_high: r2(mh), move_rest: r2(mr), ratio: r2(ratio), by_day,
    question: "When many new radar stories arrive within 30 minutes, do the radar indices move more, the same or less than in ordinary half-hours?",
    method: `Flow = new radar stories per 30-minute step (first sight in radar_life); response = mean absolute change of the levels of up to 8 radars between consecutive 30-minute points (ix_hist). Last ${SIMMEL_DAYS} days. High flow = top ${Math.round((1 - SIMMEL_Q) * 100)}% of steps. Ratio = response at high flow / response otherwise; below ${SIMMEL_DULL} is dulled, above ${SIMMEL_SHARP} is sharper. Rule-based, no AI. Thresholds are working assumptions.`,
    rule: "dulled_under_flow: in busy half-hours the indices react less, so do not read a calm index at a news peak as 'nothing happened'; say that the flow was heavy. sharper_under_flow: heavy flow goes with larger moves, so a move then says less about one story. collecting: no rule yet.",
    limit: "Shows a link between two series, not a cause and not human attention. Flow follows the time of day, and so may the index; with few days this can mimic or hide dulling.",
    bridge: "Crystal Library bridge 'more flow, less response': Simmel + Simon + Becker.",
    history_since: since ? new Date(+since).toISOString() : null, honour: SIMMEL, generated_at: new Date(now).toISOString(),
  };
}
