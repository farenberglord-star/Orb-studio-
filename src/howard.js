// Датчик «Ховард» — в честь Рональда Ховарда (1934–2024), основателя анализа решений и автора понятия «ценность информации».
// Вопрос агента: новость пока пишет 1–2 издания — пересказать сейчас или подождать? Ответ — по нашей истории:
// какая доля таких новостей позже набрала 3+ издания в лентах радаров и через сколько часов. Статистика прошлого, не прогноз.
export const HOWARD = {
  name: "Ronald A. Howard", years: "1934–2024",
  idea: "Value of information: before you decide, ask what it is worth to learn more — and act now only when waiting would not change the decision.",
  wiki: { en: "https://en.wikipedia.org/wiki/Ronald_A._Howard", ru: "https://en.wikipedia.org/wiki/Ronald_A._Howard" },
  note: "Named in his honour. Orb Studio is not connected with Ronald Howard, his family or Stanford University.",
};
export const HOWARD_CONF = 3, HOWARD_DEAD_MS = 2 * 3600e3, HOWARD_MIN = 10, HOWARD_DAYS = 30;
// возраст новости, на котором она ещё не подтверждена: 0–1 ч, 1–3 ч, 3–6 ч, 6–12 ч, 12 ч+
export const HOWARD_AGES = [[0, 1], [1, 3], [3, 6], [6, 12], [12, Infinity]];
const H = 3600e3;
function median(a) { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; }
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10);

// rows: [{ first_ts, last_ts, n_first, n_max, t3 }] из radar_life; учитываем только новости, начавшиеся с 1–2 изданий
export function howardOutcome(row, now) {
  if (row.t3 != null) return "confirmed";
  return row.last_ts < now - HOWARD_DEAD_MS ? "faded" : "open";
}
// для возраста a (часы): новости, которые дожили до a и к этому моменту ещё не набрали 3 издания
export function howardAtAge(rows, now, a0) {
  const at = a0 * H; let conf = 0, faded = 0, open = 0; const wait = [];
  for (const r of rows) {
    if (r.t3 != null) { if (r.t3 - r.first_ts <= at) continue; } // уже подтвердилась раньше этого возраста
    else if (r.last_ts - r.first_ts < at) continue; // не дожила до этого возраста (ушла или ещё молодая)
    const o = howardOutcome(r, now);
    if (o === "confirmed") { conf++; wait.push((r.t3 - r.first_ts - at) / H); } else if (o === "faded") faded++; else open++;
  }
  const done = conf + faded;
  return { decided: done, open, confirmed_later: conf, faded, p_confirm: done >= HOWARD_MIN ? Math.round(100 * conf / done) : null, median_wait_h: conf >= 3 ? r1(median(wait)) : null };
}
export function howardAdvice(p, wait) {
  if (p == null) return "collecting";
  if (p >= 50) return "worth_waiting";
  if (p >= 20) return "uncertain";
  return "say_unconfirmed";
}
export const HOWARD_ADVICE = {
  collecting: "Not enough history yet. Say that the story is not confirmed.",
  worth_waiting: "Most such stories were later carried by 3+ outlets: waiting about median_wait_h hours is likely to settle it. If you must answer now, say it is not confirmed yet.",
  uncertain: "About a fifth to a half of such stories were later carried by 3+ outlets: if you repeat it now, say clearly that it is from one or two outlets.",
  say_unconfirmed: "Few such stories were ever carried by 3+ outlets: waiting is unlikely to help — say it is unconfirmed, or leave it out.",
};
export function howardBucket(ageH) { const i = HOWARD_AGES.findIndex(([a, b]) => ageH >= a && ageH < b); return i < 0 ? 0 : i; }

export function howardReport(rows, now = Date.now(), since = null) {
  const own = (rows || []).filter((r) => r && r.n_first != null && r.n_first < HOWARD_CONF);
  const all = (rows || []).filter((r) => r && r.n_first != null);
  const by = (n) => own.filter((r) => r.n_first === n);
  const ages = HOWARD_AGES.map(([a, b]) => { const s = howardAtAge(own, now, a); return { age_h: b === Infinity ? a + "+" : a + "–" + b, ...s, advice: howardAdvice(s.p_confirm, s.median_wait_h) }; });
  const start = { one_outlet: howardAtAge(by(1), now, 0), two_outlets: howardAtAge(by(2), now, 0) };
  const ready = ages[0].p_confirm != null;
  return {
    sensor: "howard", verdict: ready ? ages[0].advice : "collecting",
    question: "A story is carried by only 1–2 outlets in Orb Studio's radar feeds. How often, and how soon, did such stories later reach 3+ outlets?",
    stories_tracked: all.length, started_unconfirmed: own.length, started_confirmed: all.length - own.length,
    by_start: start, by_age: ages, advice_text: HOWARD_ADVICE,
    collecting_since: since ? new Date(since).toISOString() : null,
    method: `Every 30 minutes the radars count how many different outlets in their feeds carry each top headline (72 h window). A story that started with 1–2 outlets is 'confirmed' when the count first reaches ${HOWARD_CONF}, 'faded' when it left the radars for over 2 hours without that, and 'open' while still running (not counted in the share). For each age (how long the story has been unconfirmed) the share is confirmed / (confirmed + faded), shown from ${HOWARD_MIN} decided stories; the wait is the median extra hours until 3 outlets. Last ${HOWARD_DAYS} days.`,
    rule: "Statistics of how past stories in Orb Studio's feeds behaved, not a forecast for any story and not a judgement of truth: outlets can repeat a false story and a true one can stay with one outlet. Outlet counts come from the radar feeds only.",
    honour: HOWARD, similar: "corroborate-mcp and check_headline-style tools give the count now; Reuters News Tracer (internal) scores credibility of tweets. This sensor adds what the past says about waiting.",
    generated_at: new Date(now).toISOString(),
  };
}
// короткая подсказка для check_headline: возраст новости в часах и текущий вердикт по числу голосов
export function howardHint(rep, ageH, voices) {
  if (!rep || !(voices >= 1) || voices >= HOWARD_CONF || !(ageH >= 0)) return null;
  const b = rep.by_age[howardBucket(ageH)];
  return { age_h: r1(ageH), age_bucket: b.age_h, p_confirm_later: b.p_confirm, median_wait_h: b.median_wait_h, advice: b.advice, advice_text: HOWARD_ADVICE[b.advice], decided_stories: b.decided, sensor: "https://orbstudio.org/tools/howard" };
}
