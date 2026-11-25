// Датчик «Поляк» — в честь Бориса Теодоровича Поляка (1935–2023), математика, автора метода тяжёлого шарика
// (из него выросли «импульсные» методы, которыми обучают нейросети) и усреднения Поляка — Юдицкого (усреднение делает оценку в шуме устойчивой).
// Датчик разводит для индексов Orb Studio «разовый скачок» и «устойчивый сдвиг». Только прошлые значения, без прогнозов.
export const POLYAK = {
  name: "Boris Polyak", years: "1935–2023",
  idea: "Heavy-ball method: a step keeps the inertia of past steps, so one push does not knock it off course (the root of momentum in neural network training). Polyak–Juditsky averaging: averaging noisy steps makes the estimate stable.",
  wiki: { ru: "https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BB%D1%8F%D0%BA,_%D0%91%D0%BE%D1%80%D0%B8%D1%81_%D0%A2%D0%B5%D0%BE%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D0%B8%D1%87" },
  sources: ["https://www.ipu.ru/en/node/74437", "https://ar5iv.labs.arxiv.org/html/2311.16743"],
  note: "Named in his honour. Orb Studio is not connected with Boris Polyak, his family or the Institute of Control Sciences.",
};
export const POLYAK_SERIES = ["hallucination", "consensus", "token_hunger", "geo_radar"];
export const POLYAK_BETA = 0.9, POLYAK_MIN = 12; // инерция тяжёлого шарика; меньше 12 замеров (6 часов) — нет вывода
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length, median = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const r1 = (x) => Math.round(x * 10) / 10;
// points: [{ ts, v }] по возрастанию времени, шаг 30 минут
export function polyakSeries(points, now) {
  const p = (points || []).filter((x) => x && Number.isFinite(x.v) && Number.isFinite(x.ts) && x.ts <= now).sort((a, b) => a.ts - b.ts);
  const day = p.filter((x) => x.ts > now - 864e5);
  if (day.length < POLYAK_MIN) return { verdict: "unknown", readings_24h: day.length, last: p.length ? p[p.length - 1].v : null };
  const vals = day.map((x) => x.v), last = vals[vals.length - 1], recent = vals.slice(-6), before = vals.slice(0, -6);
  const avg = mean(before.length ? before : vals), avg3h = median(recent); // за 3 часа берём медиану: один выброс её не сдвигает
  // шум — типичный шаг между соседними замерами (медиана |Δ|): сам сдвиг на пороге не сказывается
  const step = median(vals.slice(1).map((x, i) => Math.abs(x - vals[i]))), thr = Math.max(2 * step, 0.05 * Math.abs(avg), 2);
  let m = 0; for (let i = 1; i < vals.length; i++) m = POLYAK_BETA * m + (1 - POLYAK_BETA) * (vals[i] - vals[i - 1]); // инерция изменений
  const jump = last - avg, shift = avg3h - avg;
  const verdict = Math.abs(shift) > thr && Math.sign(jump) === Math.sign(shift) ? "shift" : Math.abs(jump) > thr ? "jump" : "calm";
  return { verdict, direction: verdict === "calm" ? null : Math.sign(verdict === "shift" ? shift : jump) > 0 ? "up" : "down", last: r1(last), polyak_average_24h: r1(avg), average_last_3h: r1(avg3h), noise_threshold: r1(thr), inertia_per_6h: r1(m * 12), readings_24h: day.length, since: new Date(day[0].ts).toISOString() };
}
export function polyakReport(inp) {
  const now = inp.now || Date.now(), s = inp.series || {};
  return { sensor: "polyak", checked_at: new Date(now).toISOString(), series: POLYAK_SERIES.map((id) => ({ id, ...polyakSeries(s[id], now) })), honour: POLYAK,
    how_to_read: "Past readings only, no forecast. polyak_average_24h = average of the readings in the last 24 hours before the last 3 hours; average_last_3h = median of the last 6 readings. calm = nothing beyond the noise threshold; jump = the last reading is far from the average but the last 3 hours are not (a one-off); shift = the last 3 hours as a whole moved away from the average (a sustained change). inertia_per_6h = heavy-ball momentum of the changes, in index points per 6 hours. unknown = fewer than 12 readings in 24 hours." };
}

// Какие заголовки дали сдвиг: для индексов, которые считаются по словам заголовка (галлюцинации — «странное», согласие — «договорились/спор»).
// rows: заголовки радаров за последние часы [{ radar, source, headline, first_ts, last_ts }]; links: { нормализованный заголовок: ссылка } из живых лент.
// Вошли — заголовок появился за последние 3 часа и жив сейчас; вышли — был, а за последние 3 часа пропал. Для индексов без слов (token_hunger, geo_radar) вклад не считаем.
const WORD_SIDE = { hallucination: { up: ["odd", "in"], down: ["odd", "out"] }, consensus: { up: [["agree", "in"], ["fight", "out"]], down: [["fight", "in"], ["agree", "out"]] } };
export function polyakContributors(id, verdict, direction, rows, res, links, now, norm = (x) => String(x || "").toLowerCase().trim(), max = 5) {
  if (!WORD_SIDE[id] || (verdict !== "shift" && verdict !== "jump") || !direction) return null;
  const T3 = now - 3 * 3600e3, ALIVE = now - 45 * 60e3, out = [];
  const plan = WORD_SIDE[id][direction]; for (const [tag, way] of (Array.isArray(plan[0]) ? plan : [plan])) {
    const re = res[tag]; if (!re) continue;
    for (const r of rows || []) { if (!r || !re.test(r.headline || "")) continue;
      const entered = way === "in" && r.first_ts >= T3 && r.last_ts >= ALIVE, left = way === "out" && r.first_ts < T3 && r.last_ts < ALIVE && r.last_ts >= T3;
      if (entered || left) out.push({ headline: r.headline, source: r.source || null, radar: r.radar, link: (links && links[norm(r.headline)]) || null, what: tag === "odd" ? "odd_wording" : tag, change: way === "in" ? "entered_last_3h" : "left_last_3h", at: new Date(way === "in" ? r.first_ts : r.last_ts).toISOString() }); } }
  out.sort((a, b) => (a.change === b.change ? Date.parse(b.at) - Date.parse(a.at) : a.change === "entered_last_3h" ? -1 : 1));
  return { counted_by: id === "hallucination" ? "headlines with odd wording (strange, bizarre, unprecedented, viral …)" : "headlines with agreement words (deal, accord, backs …) against conflict words (clash, reject, protest …)", total: out.length, items: out.slice(0, max),
    note: "Headlines whose wording moved this index in the last 3 hours (entered = new and still on a radar; left = dropped off). Counted by words, not by meaning: read them before you repeat the number. Not a forecast." };
}
