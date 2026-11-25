// Датчик «Эшби» — в честь У. Росса Эшби (1903–1972), автора закона необходимого разнообразия (1956): регулятор может
// справиться только с тем разнообразием, которое сам умеет различать. Мостик библиотеки кристаллов «достаточно видов ответа»:
// Эшби + Бир + Луман. Вопрос: на какую долю историй радара у паспорта новости нет ни одной строки о содержании заголовка?
// «Молчит» ≠ «слеп»: тихий заголовок может быть просто обычным событием. Число говорит, сколько потока паспорт не различает.
// Строки few_voices и stale не считаем: они про состояние истории (один источник, возраст), а не про то, что сказано, и при
// первом показе срабатывают почти всегда.
export const ASHBY = {
  name: "W. Ross Ashby", years: "1903–1972",
  idea: "Law of requisite variety: a regulator can only handle as many kinds of disturbance as it can tell apart.",
  wiki: { en: "https://en.wikipedia.org/wiki/W._Ross_Ashby", ru: "https://en.wikipedia.org/wiki/W._Ross_Ashby" },
  note: "Named in his honour. Orb Studio is not connected with W. Ross Ashby, his family or any university.",
};
export const ASHBY_STATE_LINES = ["few_voices", "stale"], ASHBY_MIN = 30, ASHBY_DAYS = 14, ASHBY_HIGH = 70, ASHBY_MID = 40;
const pct = (a, b) => (b ? Math.round(100 * a / b) : null);
const day = (ts) => new Date(ts).toISOString().slice(0, 10);

// fired: строка из radar_life ("" = ни одной строки; null = паспорт не считался) → список строк о содержании или null
export function ashbyLines(fired) {
  if (fired == null) return null;
  return String(fired).split(",").map((s) => s.trim()).filter(Boolean).filter((l) => !ASHBY_STATE_LINES.includes(l));
}
export function ashbyReport(rows, now = Date.now(), since = null) {
  const st = []; for (const r of rows || []) { const l = ashbyLines(r.fired); if (l) st.push({ radar: r.radar || null, headline: r.headline || "", first_ts: +r.first_ts || 0, lines: l }); }
  const n = st.length, silent = st.filter((s) => !s.lines.length), sp = pct(silent.length, n);
  const lineCount = {}; for (const s of st) for (const l of s.lines) lineCount[l] = (lineCount[l] || 0) + 1;
  const radars = [...new Set(st.map((s) => s.radar).filter(Boolean))].sort().map((id) => { const a = st.filter((s) => s.radar === id), q = a.filter((s) => !s.lines.length).length; return { id, stories: a.length, silent: q, silent_pct: pct(q, a.length) }; });
  const days = {}; for (const s of st) { if (!s.first_ts) continue; const d = day(s.first_ts); (days[d] ||= { stories: 0, silent: 0 }); days[d].stories++; if (!s.lines.length) days[d].silent++; }
  const by_day = Object.keys(days).sort().slice(-7).map((d) => ({ day: d, stories: days[d].stories, silent_pct: pct(days[d].silent, days[d].stories) }));
  return {
    sensor: "ashby", verdict: n < ASHBY_MIN ? "collecting" : sp >= ASHBY_HIGH ? "passport_silent_on_most" : sp >= ASHBY_MID ? "passport_silent_on_many" : "passport_speaks_on_most",
    stories: n, silent: silent.length, silent_pct: sp, lines: Object.entries(lineCount).sort((a, b) => b[1] - a[1]).map(([line, stories]) => ({ line, stories, pct: pct(stories, n) })),
    radars, by_day, silent_examples: [...silent].sort((a, b) => b.first_ts - a.first_ts).slice(0, 8).map((s) => ({ radar: s.radar, headline: s.headline, first_seen: s.first_ts ? new Date(s.first_ts).toISOString() : null })),
    question: "On what share of radar stories does the news passport have no line about what the headline says?",
    method: `For every radar story of the last ${ASHBY_DAYS} days whose passport lines were stored at first sight, count the stories with none of the content lines (not_event, vague, quoted, found_document, extraordinary, rumour_risk, poll, metaphor, tone, state_media, amplified). The state lines few_voices and stale are left out: they fire for almost every new story. Rule-based, no AI. Thresholds (${ASHBY_MID}% and ${ASHBY_HIGH}%) are working assumptions.`,
    rule: "A silent passport means no rule matched, not that the story was checked. When the silent share is high, keep your own wording plain and hedged, and never write 'nothing to flag'. Look at silent_examples to see what kind of headline the passport cannot tell apart.",
    limit: "Silence can be right: an ordinary event headline needs no warning. The sensor cannot tell a quiet story from a blind spot; it only says how much of the stream the passport has no line for.",
    bridge: "Crystal Library bridge 'enough variety': Ashby (requisite variety) + Beer + Luhmann.",
    history_since: since ? new Date(+since).toISOString() : null,
    honour: ASHBY, generated_at: new Date(now).toISOString(),
  };
}
