// Вход для свободного вопроса агента («что с Ормузом», «что с Китаем»): без ИИ и без затрат.
// Разбираем вопрос на слова, ищем их в живых заголовках радаров и в описаниях инструментов, отвечаем: какие заголовки, какие инструменты вызвать дальше.
// Это не ответ по существу и не прогноз: это указатель. Развёрнутый ответ — через ведущего Давида (ask_david), он придёт в эфире, не сразу.
const STOP = new Set("the and for what with about are was were how why who when where does did has have this that from into over under what's whats как что где когда почему про для или это при над под der die das und mit von für über was wie wer wann wo ist sind".split(" "));
export const askTokens = (q) => [...new Set(String(q || "").toLowerCase().replace(/[^a-zа-яёäöüß0-9 -]/gi, " ").split(/\s+/).filter((w) => w.length >= 3 && !STOP.has(w)))].slice(0, 8);
// Совпадение по началу слова: «ормузом» находит «ормуз», «china» находит «chinese» (для слов ≥ 6 букв берём первые 5 букв)
const stem = (w) => (w.length >= 6 ? w.slice(0, 5) : w);
export const askHit = (text, toks) => { const t = String(text || "").toLowerCase(); return toks.filter((w) => t.includes(stem(w))).length; };
export function askReport(q, radars, tools, now = Date.now()) {
  const query = String(q || "").replace(/\s+/g, " ").trim().slice(0, 200), toks = askTokens(query);
  const generic = [{ tool: "ask_david", why: "Send the question to the AI anchor David in your own words; the best ones are answered on air (not instantly)." }, { tool: "check_headline", why: "Before you repeat any headline: how many outlets carry it and how alarmist the tone is." }];
  if (!toks.length) return { question: query, matched: false, note: "Give a question with at least one real word (three letters or more).", next: generic };
  const heads = [];
  for (const r of radars || []) for (const f of r.feed || []) { const n = askHit(f[1], toks); if (n) heads.push({ n, radar: r.id, headline: f[1], source: f[2] || null, link: /^https:\/\//.test(f[4] || "") ? f[4] : null }); }
  heads.sort((a, b) => b.n - a.n);
  const sensors = (tools || []).map((t) => ({ tool: t.name, n: askHit(t.name.replace(/_/g, " ") + " " + (t.title || ""), toks) * 2 + askHit(t.description, toks) })).filter((x) => x.n).sort((a, b) => b.n - a.n).slice(0, 5);
  const byRadar = {}; for (const h of heads) byRadar[h.radar] = (byRadar[h.radar] || 0) + 1;
  return { question: query, words_searched: toks, checked_at: new Date(now).toISOString(),
    matched: heads.length > 0 || sensors.length > 0,
    headlines: heads.slice(0, 8).map(({ n, ...x }) => x), headlines_found: heads.length, by_radar: byRadar,
    tools_to_call_next: sensors.map((x) => x.tool),
    next: generic,
    how_to_read: "A pointer, not an answer. Headlines are matched by the words of your question (beginning of word), so read them before you rely on them; no match means these radars carry nothing on it right now, not that nothing happened. Sensors named after scientists each answer one fixed question; this entry point is for a free question. No AI is used, nothing is forecast." };
}
