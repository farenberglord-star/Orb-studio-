// Тестовое «Радио Orb Studio»: наш трек → интервью Давида с гостем по одной новости → наш трек → следующая новость.
// Интервью не сочиняются на странице: берутся готовые сегменты из GET /api/v1/broadcast/duo (текст и голос).
// Новость не повторяется: услышанные заголовки запоминаются в браузере. Нет новых — играет только музыка.
import { buildQueue, boardFor, pickLang, lineMs, T as ST } from "./studio-duo.js";

export const API = "/api/v1/broadcast/duo";
// Музыка Orb Studio (сделана в Suno, файлы прислал автор сайта). Чужой музыки в эфире нет.
export const TRACKS = [
  { id: "night-sensors", title: "Night Sensors News Bed (Remastered)", src: "/media/radio/night-sensors-news-bed.m4a", sec: 52 },
  { id: "autobahn-3", title: "Autobahn 3", src: "/media/radio/autobahn-3.m4a", sec: 267 },
  { id: "night-shift", title: "Night Shift", src: "/media/radio/night-shift.m4a", sec: 184 },
  { id: "orbit-city", title: "Orbit City", src: "/media/radio/orbit-city.m4a", sec: 105 },
  { id: "quiet-frequency", title: "Quiet Frequency", src: "/media/radio/quiet-frequency.m4a", sec: 125 },
  { id: "bright-current", title: "Bright Current", src: "/media/radio/bright-current.m4a", sec: 156 },
  { id: "iron-horizon", title: "Iron Horizon", src: "/media/radio/iron-horizon.m4a", sec: 208 },
  { id: "signal-highway", title: "Signal Highway", src: "/media/radio/signal-highway.m4a", sec: 122 },
  { id: "cold-meridian", title: "Cold Meridian", src: "/media/radio/cold-meridian.m4a", sec: 212 },
  { id: "heavy-current", title: "Heavy Current", src: "/media/radio/heavy-current.m4a", sec: 269 },
  { id: "static-lanterns", title: "Static Lanterns", src: "/media/radio/static-lanterns.m4a", sec: 79 },
];
// Музыкальная полка: треки идут вперемешку; пока не прозвучат все, ни один не повторяется. bag — что ещё не звучало в этом круге.
export function nextTrackId(ids, bag, last, rnd = Math.random) {
  let b = (Array.isArray(bag) ? bag : []).filter((id, i, a) => ids.includes(id) && a.indexOf(id) === i);
  if (!b.length) { b = ids.slice(); for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; }
    if (b.length > 1 && b[0] === last) b.push(b.shift()); } // новый круг не начинается с только что отзвучавшего трека
  return { id: b[0] ?? null, bag: b.slice(1) };
}
// Программа одной колонкой: каждая позиция — одна строка; вопросы одному гостю подряд сворачиваются в одну строку «Подкаст»
export function rundownRows(items, idx, t) {
  const rows = [], short = (x, n) => { x = String(x || "").replace(/\s+/g, " ").trim(); return x.length > n ? x.slice(0, n - 1).trimEnd() + "…" : x; };
  (items || []).forEach((it, i) => { const st = { cur: i === idx, done: i < idx };
    if (it.type === "talk") { const last = rows[rows.length - 1], g = (it.iv && it.iv.guest) || "Grok";
      if (last && last.kind === "talk" && last.guest === g) { last.n++; last.cur = last.cur || st.cur; last.done = !last.cur && st.done; last.text = t.questions + ": " + last.n; return; }
      rows.push({ kind: "talk", guest: g, n: 1, label: "🎙 " + t.podcast + " · David × " + g, text: t.questions + ": 1", ...st }); return; }
    if (it.type === "track") rows.push({ kind: "track", label: "♪", text: it.track.title + " · " + fmt(Math.round(cutAt(it.track.sec))), ...st });
    else if (it.type === "news") rows.push({ kind: "news", label: "📡", text: short(it.label || t.sensNews, 44), ...st });
    else rows.push({ kind: "say", label: "🎧 David", text: short(it.iv && it.iv.lines && it.iv.lines[0] && it.iv.lines[0].text, 60), ...st });
  });
  return rows;
}
// Обложка для экрана блокировки и машины
export const ART = [{ src: "/media/radio/home-thumb.webp", sizes: "720x720", type: "image/webp" }];
// Кнопки системы → действия плеера. «Играть» и «пауза» не переключают вслепую: каждая делает только своё.
export function mediaActions(p) {
  return [["play", () => { if (!p.isOn()) p.toggle(); }], ["pause", () => { if (p.isOn()) p.toggle(); }], ["nexttrack", () => { if (p.isStarted()) p.skip(); }], ["stop", () => { if (p.isOn()) p.toggle(); }]];
}
// Язык эфира один для всех слушателей: голос Давида и гостей звучит по-русски, подписи страницы остаются на языке посетителя
export const AIR_LANG = "de";
// Эфир без остановок. LOAD_MS — срок на загрузку данных круга; STALL_MS — сколько звук может стоять на месте.
export const LOAD_MS = 25000, STALL_MS = 12000, VOICE_STALL_MS = 6000, VOICE_FAIL_MS = 150, START_WAIT_MS = 1500, RETRY_MS = 20 * 60e3; // музыке даём 12 с (слабая сеть в дороге), голосу — 6 с: реплика короткая, ждать её дольше незачем
// Блоки, у которых не загрузился голос, не пробуем снова 20 минут (failed: что → когда не получилось)
export function notNow(failed, now) { const s = new Set(); for (const [id, at] of failed || []) if (now - at < RETRY_MS) s.add(id); return s; }
// Сторож звука: st помнит последнюю «отметку» эфира; если она не меняется дольше STALL_MS — застряли
export function stalled(st, sig, now, limit = STALL_MS) { if (st.sig !== sig) { st.sig = sig; st.at = now; return false; } return now - st.at >= limit; }
// Что прозвучит следом: следующая реплика этого блока, иначе начало следующего пункта (трек или первая озвученная реплика).
// Этот файл загружается заранее, пока идёт текущий звук, — поэтому между музыкой и голосом нет тишины «на загрузку».
export function nextSrc(items, idx, li) {
  const cur = items && items[idx]; if (cur && cur.type !== "track" && cur.iv) for (const x of cur.iv.lines.slice(li)) if (x && x.audio) return x.audio;
  const nx = items && items[idx + 1]; if (!nx) return null; if (nx.type === "track") return (nx.track && nx.track.src) || null;
  for (const x of (nx.iv && nx.iv.lines) || []) if (x && x.audio) return x.audio; return null;
}
// Сбои эфира считаются автоматически: что именно случилось у слушателя, видно в статистике (без имён и адресов)
export const GLITCHES = ["stall_track", "stall_voice", "voice_fail", "track_error", "empty_plan"], GLITCH_MAX = 12;
// Что играть, когда круг кончился. Готов следующий круг — берём его (без первого трека, если только что играл «мост»).
// Не готов — ставим трек с полки и просим собрать круг; так между кругами нет тишины, даже если сеть медленная.
export function afterPlan(nextPlan, bridged, nextTrack) {
  if (Array.isArray(nextPlan) && nextPlan.length) { const cut = bridged && nextPlan.length > 1 && nextPlan[0].type === "track";
    return { items: cut ? nextPlan.slice(1) : nextPlan, bridged: false, build: false }; }
  const tr = (nextTrack && nextTrack()) || TRACKS[0];
  return { items: [{ type: "track", track: tr }], bridged: true, build: true };
}
// Автозапуск эфира: страница открыта кнопкой Play с главной
export const wantsAutoplay = (hash) => /^#play\b/.test(String(hash || ""));
// Разрешает ли браузер звук без касания: пробуем беззвучный отрывок на обычной громкости. Запрет — значит, ждём одного касания.
export function silentWav(ms = 60, rate = 8000) { const n = Math.round(rate * ms / 1000), b = new Uint8Array(44 + n).fill(128, 44), v = new DataView(b.buffer), str = (o, s) => { for (let i = 0; i < s.length; i++) b[o + i] = s.charCodeAt(i); };
  str(0, "RIFF"); v.setUint32(4, 36 + n, true); str(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); str(36, "data"); v.setUint32(40, n, true); return b; }
export async function canAutoplay() { try { const a = new Audio(URL.createObjectURL(new Blob([silentWav()], { type: "audio/wav" }))); await a.play(); a.pause(); return true; } catch { return false; } }
export const T = {
  ru: { title: "Радио Orb Studio", airNote: "Эфир идёт на немецком.", textOfAir: "Текст эфира", podcast: "Подкаст", questions: "вопросов", radarNews: "Главные новости радаров", radarSrc: "Радары Orb Studio", sensNews: "Новости с датчиков", sensSrc: "Датчики Orb Studio · открытые данные", tapStart: "Коснитесь экрана — эфир начнётся", mk: { gold: "ЗОЛОТО", fut: "ФЬЮЧЕРС", oil: "НЕФТЬ", win: "за {h} ч", funding: "финансирование за период", oi: "открытый интерес", futName: "BTC · бессрочный фьючерс · Kraken Futures", goldName: "PAXG/EUR · токен золота · Kraken", wait: "загрузка…", none: "Биржа сейчас не отдала данные по этому инструменту.", oilNote: "Биржевых цен на нефть здесь пока нет: открытого бесплатного источника с разрешением на показ мы не нашли. Выдуманные цифры не показываем." }, test: "тестовый эфир", start: "▶ Включить радио", pause: "❚❚ Пауза", resume: "▶ Продолжить", skip: "Дальше ▶▶", music: "Музыка", talk: "Интервью", now: "Сейчас в эфире", next: "Далее", tap: "Нажми «Включить радио»: сначала трек, потом Давид с гостем.", noNew: "Новых интервью пока нет — играет музыка. Проверяем каждые несколько минут.", noLink: "Нет связи с эфиром — играет только музыка.", by: "Музыка: Orb Studio (сделана в Suno). Чужих песен в эфире нет.", ai: "Давид и гости — ИИ-агенты, не люди; голоса синтезированы (xAI Grok TTS). Гости по очереди: Grok (xAI), DeepSeek и Gemini (Google), каждый отвечает сам.", story: "Открыть новость", episode: "выпуск от", rundown: "Программа", guestOff: "Гость не ответил", pics: "Картинки магнитолы, Давида и Земли созданы ИИ (Grok). Свечи BTC/EUR — данные Kraken, не прогноз.", scenes: { sky: "НОЧНОЕ НЕБО", market: "РЫНОК", david: "НОВОСТИ · ДАВИД", earth: "ВИД ЗЕМЛИ" } },
  de: { title: "Radio Orb Studio", airNote: "", textOfAir: "Sendungstext", podcast: "Podcast", questions: "Fragen", radarNews: "Top-Meldungen der Radare", radarSrc: "Orb-Studio-Radare", sensNews: "Neues von den Sensoren", sensSrc: "Orb-Studio-Sensoren · offene Daten", tapStart: "Bildschirm antippen — die Sendung startet", mk: { gold: "GOLD", fut: "FUTURE", oil: "ÖL", win: "in {h} Std.", funding: "Funding je Periode", oi: "Open Interest", futName: "BTC · Perpetual-Future · Kraken Futures", goldName: "PAXG/EUR · Gold-Token · Kraken", wait: "lädt…", none: "Die Börse liefert für dieses Instrument gerade keine Daten.", oilNote: "Börsenpreise für Öl gibt es hier noch nicht: Wir haben keine offene, kostenlose Quelle mit Anzeigeerlaubnis gefunden. Erfundene Zahlen zeigen wir nicht." }, test: "Testsendung", start: "▶ Radio einschalten", pause: "❚❚ Pause", resume: "▶ Weiter", skip: "Weiter ▶▶", music: "Musik", talk: "Interview", now: "Jetzt auf Sendung", next: "Danach", tap: "Tippe auf „Radio einschalten“: erst ein Titel, dann David mit Gast.", noNew: "Noch keine neuen Interviews – es läuft Musik. Wir prüfen alle paar Minuten.", noLink: "Keine Verbindung zur Sendung – es läuft nur Musik.", by: "Musik: Orb Studio (mit Suno erstellt). Keine fremden Songs im Programm.", ai: "David und die Gäste sind KI-Agenten, keine Menschen; die Stimmen sind synthetisch (xAI Grok TTS). Gäste im Wechsel: Grok (xAI), DeepSeek und Gemini (Google), jeder antwortet selbst.", story: "Zur Nachricht", episode: "Folge vom", rundown: "Programm", guestOff: "Gast hat nicht geantwortet", pics: "Bilder von Radio, David und Erde sind KI-generiert (Grok). BTC/EUR-Kerzen: Kraken-Daten, keine Prognose.", scenes: { sky: "NACHTHIMMEL", market: "MARKT", david: "NEWS · DAVID", earth: "ERDBLICK" } },
  en: { title: "Radio Orb Studio", airNote: "The broadcast is in German.", textOfAir: "Broadcast text", podcast: "Podcast", questions: "questions", radarNews: "Top stories from the radars", radarSrc: "Orb Studio radars", sensNews: "News from the sensors", sensSrc: "Orb Studio sensors · open data", tapStart: "Tap the screen and the broadcast starts", mk: { gold: "GOLD", fut: "FUTURES", oil: "OIL", win: "over {h} h", funding: "funding per period", oi: "open interest", futName: "BTC · perpetual future · Kraken Futures", goldName: "PAXG/EUR · gold token · Kraken", wait: "loading…", none: "The exchange returned no data for this instrument right now.", oilNote: "No exchange oil prices here yet: we have not found an open, free source that allows display. We do not show invented numbers." }, test: "test broadcast", start: "▶ Turn the radio on", pause: "❚❚ Pause", resume: "▶ Resume", skip: "Next ▶▶", music: "Music", talk: "Interview", now: "On air now", next: "Up next", tap: "Tap “Turn the radio on”: a track first, then David with a guest.", noNew: "No new interviews yet — music is playing. We check every few minutes.", noLink: "No connection to the desk — music only.", by: "Music: Orb Studio (made with Suno). No third-party songs on air.", ai: "David and the guests are AI agents, not people; the voices are synthetic (xAI Grok TTS). Guests take turns: Grok (xAI), DeepSeek and Gemini (Google), each answers for itself.", story: "Open the story", episode: "episode of", rundown: "Programme", guestOff: "The guest did not answer", pics: "The radio, David and Earth pictures are AI-generated (Grok). BTC/EUR candles are Kraken data, not a forecast.", scenes: { sky: "NIGHT SKY", market: "MARKETS", david: "NEWS · DAVID", earth: "EARTH VIEW" } },
};

// Дата выпуска: ДД.ММ.ГГ по берлинскому времени
export function episodeDate(iso) {
  const ms = typeof iso === "number" ? iso : Date.parse(String(iso || ""));
  if (!Number.isFinite(ms)) return "";
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "2-digit" }).formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return p.day + "." + p.month + "." + p.year;
}

// Интервью из выпуска: по одному на новость, только там, где гость реально ответил. Переходы «а теперь к…» на радио не нужны.
// Мировой выпуск студии для радио: оригинал английский, у русского и немецкого есть перевод. Слушателю ставим только разговоры,
// где переведена каждая реплика, — английская речь в русский или немецкий эфир не попадает.
export function worldInterviews(duo, lang) {
  const list = interviews(duo, lang); if (lang === "en") return list;
  // строка без перевода в студии молча остаётся английской; такую находим сравнением с оригиналом
  const en = new Map(interviews(duo, "en").map((iv) => [iv.headline, iv.lines]));
  // Обязательны переведённые вопрос и ответ. Остальные реплики без перевода просто не звучат — из-за одной мелочи разговор не отменяется.
  const out = [];
  for (const iv of list) { const o = en.get(iv.headline) || [], done = (x, i) => x.tr === true && (!o[i] || x.text !== o[i].text);
    const lines = iv.lines.filter(done), has = (k) => lines.some((x) => x.kind === k);
    if (has("question") && has("answer")) out.push({ ...iv, lines }); }
  return out;
}
export function interviews(duo, lang) {
  if (boardFor(duo)) return [];
  const by = new Map();
  for (const x of buildQueue(duo, lang)) {
    if (x.segKind !== "news" || x.kind === "pause" || x.kind === "transition" || !x.headline) continue;
    if (!by.has(x.headline)) by.set(x.headline, { headline: x.headline, source: x.source, link: x.link, at: duo.generated_at || null, guest: "Grok", lines: [] });
    by.get(x.headline).lines.push(x);
  }
  return [...by.values()].filter((iv) => iv.lines.some((x) => x.kind === "answer") && iv.lines.some((x) => x.kind === "thanks"));
}

// Время суток слушателя по часам его устройства: утро 5–11, день 12–17, вечер 18–22, ночь 23–4
export function daypart(hour) { const h = ((Math.floor(+hour) % 24) + 24) % 24; return h >= 5 && h < 12 ? "morning" : h >= 12 && h < 18 ? "day" : h >= 18 && h < 23 ? "evening" : "night"; }
// Плавное начало и конец трека: громкость 0→1 за FADE_IN секунд и 1→0 за последние FADE_OUT секунд
export const FADE_IN = 1.2, FADE_OUT = 2, GAP_MS = 250; // трек вступает за секунду, пауза перед голосом — четверть секунды
export function trackGain(pos, dur, out = FADE_OUT) { if (!(pos >= 0)) return 0; const up = Math.min(1, pos / FADE_IN), down = dur > FADE_IN + out ? Math.min(1, Math.max(0, (dur - pos) / out)) : 1; return +Math.max(0, Math.min(up, down)).toFixed(3); }
// Сначала интервью ближе к слушателю (его регион), потом общий мировой выпуск. Одна и та же новость дважды не ставится.
export function mergeInterviews(reg, world) {
  const out = [], seen = new Set(), ok = (u) => (typeof u === "string" && /^https:\/\/[^\s"'<>]+$/.test(u) ? u : null);
  for (const iv of (reg && reg.status === "ok" && Array.isArray(reg.interviews) ? reg.interviews : [])) {
    const lines = (Array.isArray(iv && iv.lines) ? iv.lines : []).filter((x) => x && ["david", "grok", "deepseek", "gemini"].includes(x.who) && typeof x.text === "string" && x.text.trim()).map((x) => ({ who: x.who === "david" ? "david" : "grok", /* «grok» здесь значит «гость»: имя и компания гостя в iv.guest и iv.maker */ kind: x.kind, text: x.text.trim(), audio: ok(x.audio), ms: lineMs(x.text) }));
    if (!iv || !iv.headline || seen.has(iv.headline) || !lines.some((x) => x.who === "grok")) continue;
    seen.add(iv.headline); out.push({ headline: String(iv.headline), source: iv.source || null, link: ok(iv.link), at: iv.at || null, guest: typeof iv.guest === "string" && iv.guest.length < 20 ? iv.guest : "Grok", maker: typeof iv.maker === "string" && iv.maker.length < 20 ? iv.maker : "xAI", region: reg.region_label || reg.region || null, lines });
  }
  for (const iv of world || []) if (iv && !seen.has(iv.headline)) { seen.add(iv.headline); out.push(iv); }
  return out;
}
// Связка диджея как блок эфира: реплики Давида из /api/v1/radio/dj (и погода), только те, где есть текст
export function sayItem(title, parts) {
  const lines = (parts || []).filter((x) => x && typeof x.text === "string" && x.text.trim()).map((x) => ({ who: "david", kind: "dj", text: x.text.trim(), audio: typeof x.audio === "string" && /^https:\/\/[^\s"'<>]+$/.test(x.audio) ? x.audio : null, ms: lineMs(x.text) }));
  return lines.length ? { type: "say", iv: { headline: title, source: null, link: null, at: null, guest: "Grok", lines } } : null;
}
// Сетка эфира. Первое включение: приветствие и заставка станции. Дальше карусель: после КАЖДОГО трека Давид что-то делает —
// интервью с гостем, новость с датчиков или погода; если сказать нечего — короткая связка. Два трека подряд без слова не идут.
// Услышанные интервью и новости не повторяются; без связок сетка та же, только без слов диджея.
export const BLOCKS = 5, PODCAST_MAX = 4;
// Длинный трек плавно уводится через две минуты, короткий (до 2:40) играет целиком
export const TRACK_CUT = 120, TRACK_FULL = 160, CUT_FADE = 5;
export function cutAt(dur) { return dur > TRACK_FULL ? TRACK_CUT : dur; }
export function plan(list, heard, trackAt = 0, talks = 2, o = {}) {
  // подкаст выпуска: все неуслышанные вопросы одному гостю идут подряд, без музыки между ними (до четырёх)
  const unheard = (list || []).filter((iv) => !(heard && heard.has(iv.headline))), gOf = (iv) => String(iv.guest || "Grok").toLowerCase();
  const fresh = unheard.filter((iv) => gOf(iv) === gOf(unheard[0])).slice(0, o.podcastMax || PODCAST_MAX), dj = o.dj || {}, title = o.title || "Radio Orb Studio";
  const news = (o.stories || []).filter((x) => x && x.key && ((typeof x.text === "string" && x.text.trim()) || (Array.isArray(x.lines) && x.lines.length > 1)) && !(heard && heard.has(x.key))).slice(0, talks);
  const out = []; let k = trackAt, said = o.introSaid ? (o.introGuest || "*") : null; // кого Давид уже представил: новый гость — новое представление
  // повторяющиеся связки идут по кругу из вариантов; счётчик o.turns живёт между вызовами, чтобы фраза не повторялась подряд
  const turns = o.turns || {}, vars = o.variants || {}, say = (p) => { const a = Array.isArray(vars[p]) && vars[p].length ? vars[p] : [dj[p]]; turns[p] = (turns[p] || 0) + 1; return a[(turns[p] - 1) % a.length]; };
  // Радио слушают, а не читают: в режиме voiceOnly реплика без готового голоса не звучит тишиной, а пропускается; разговор без озвученных вопроса и ответа — тоже
  const vo = !!o.voiceOnly, hasA = (x) => !!(x && typeof x.audio === "string" && /^https:\/\//.test(x.audio));
  const sayV = (ttl, parts) => sayItem(ttl, vo ? (parts || []).filter(hasA) : parts);
  const push = (x) => { if (x) out.push(x); }, track = () => out.push({ type: "track", track: (o.nextTrack && o.nextTrack()) || TRACKS[k++ % TRACKS.length] });
  if (o.first) push(sayV(title, [o.greeting, dj.ident]));
  // очередь блоков: подкаст с гостем, потом новости радаров и датчиков; погода (когда пришёл её час) идёт вторым блоком
  const talks2 = vo ? fresh.map((iv) => { const lines = iv.lines.filter(hasA), has = (k) => lines.some((x) => x.kind === k); return has("question") && has("answer") ? { ...iv, lines } : null; }).filter(Boolean) : fresh;
  const newsV = vo ? news.filter((n) => (Array.isArray(n.lines) ? n.lines.filter(hasA).length > 1 : hasA(n))) : news;
  const q = []; if (talks2.length) q.push({ talks: talks2 }); for (const n of newsV) q.push({ news: n });
  if (o.weather && (!vo || hasA(o.weather))) q.splice(Math.min(1, q.length), 0, { weather: o.weather });
  for (const b of q.length ? q.slice(0, o.blocks || BLOCKS) : [{}]) {
    track();
    if (b.talks) { const g = gOf(b.talks[0]); if (said !== g && said !== "*") { push(sayV(title, [(o.intros && o.intros[g]) || dj.intro])); said = g; }
      for (const iv of b.talks) out.push({ type: "talk", iv }); push(sayV(title, [say("to_music")])); }
    else if (b.news) { const n = b.news, it = sayV(n.title || o.newsTitle || title, [...(Array.isArray(n.lines) ? n.lines : [n]), say("next_track")]); if (it) { it.type = "news"; it.key = n.key; it.label = n.title || o.newsTitle || ""; it.iv.source = n.source || o.newsSource || null; out.push(it); } }
    else if (b.weather) push(sayV(title, [b.weather, say("next_track")]));
    else push(sayV(title, [say("after_music"), say("next_track")]));
  }
  return { items: out, trackAt: k % TRACKS.length, fresh: talks2.length, news: newsV.length, introGuest: said };
}

// Погода звучит не чаще раза в час
export const WEATHER_EVERY_MS = 60 * 60e3;
export function weatherDue(last, now) { return !(last > 0) || now - last >= WEATHER_EVERY_MS || now < last; }
export const fmt = (s) => { s = Math.max(0, Math.round(+s || 0)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

// Сцены верхнего экрана по кругу; «рынок» показывается только когда свечи реально пришли
export const SCENE_MS = 24000;
export function sceneOrder(hasCandles) { return hasCandles ? ["sky", "market", "earth"] : ["sky", "earth"]; } // портрета Давида на экране больше нет
// Бегущая строка: только настоящие заголовки текущего выпуска с источником
export function tickerItems(duo) {
  if (boardFor(duo)) return [];
  const seen = new Set(), out = [];
  for (const s of duo.segments) { const h = s && typeof s.headline === "string" ? s.headline.replace(/\s+/g, " ").trim() : ""; if (!h || seen.has(h) || (s.kind || "news") !== "news") continue; seen.add(h); out.push(s.source ? h + " (" + s.source + ")" : h); }
  return out;
}
// Кнопки рыночного экрана. Нефть — честная табличка «источника нет», без цифр.
export const MARKET_CHIPS = [{ id: "btc", label: "BTC" }, { id: "eth", label: "ETH" }, { id: "eurusd", label: "EUR/USD" }, { id: "eurgbp", label: "EUR/GBP" }, { id: "eurchf", label: "EUR/CHF" }, { id: "usdjpy", label: "USD/JPY" },
  { id: "gold", key: "gold" }, { id: "fut", key: "fut" }, { id: "oil", key: "oil", nodata: true }];
export function nextMarket(cur) { const ids = MARKET_CHIPS.filter((c) => !c.nodata).map((c) => c.id); return ids[(ids.indexOf(cur) + 1) % ids.length]; }
// Годится ли ответ для показа: свечи или цифры фьючерса, иначе null (на экране будет «нет данных»)
export function marketData(d) {
  if (!d || typeof d !== "object" || !Number.isFinite(d.last) || d.last <= 0) return null;
  if (d.kind === "quote") return d;
  return Array.isArray(d.candles) && d.candles.length >= 8 ? d : null;
}
export function fmtPrice(v, digits, lang) { return Number(v).toLocaleString(lang, { minimumFractionDigits: digits, maximumFractionDigits: digits }); }
export function fmtChange(p, lang) { return !Number.isFinite(p) ? "" : (p > 0 ? "▲ +" : p < 0 ? "▼ −" : "● ") + Math.abs(p).toLocaleString(lang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " %"; }
export function wrapWords(text, max) { const out = []; let line = ""; for (const w of String(text || "").split(/\s+/)) { if (line && (line + " " + w).length > max) { out.push(line); line = w; } else line = line ? line + " " + w : w; } if (line) out.push(line); return out; }
// Раскладка свечей по экрану: чистая геометрия, без сглаживания и дорисовки
export function candleBoxes(candles, w, h, pad = 0.14) {
  const c = (candles || []).filter((x) => x && Number.isFinite(x.h) && Number.isFinite(x.l)); if (!c.length) return [];
  const lo = Math.min(...c.map((x) => x.l)), hi = Math.max(...c.map((x) => x.h)), span = hi - lo || 1, y = (v) => h * pad + (1 - (v - lo) / span) * h * (1 - 2 * pad), cw = w / c.length;
  return c.map((x, i) => ({ x: i * cw + cw * 0.18, w: cw * 0.64, mid: i * cw + cw / 2, yh: y(x.h), yl: y(x.l), top: Math.min(y(x.o), y(x.c)), bot: Math.max(y(x.o), y(x.c)), up: x.c >= x.o }));
}
const CAP = [[.12,.30],[.18,.42],[.30,.62],[.48,.70],[.66,.66],[.80,.52],[.88,.34],[.70,.40],[.50,.44],[.30,.40],[.12,.30]];
const AND = [[.10,.70],[.28,.58],[.46,.48],[.64,.40],[.84,.30],[.46,.48],[.52,.75],[.64,.40],[.70,.82]];

// ---------- Браузер ----------
function start() {
  const $ = (id) => document.getElementById(id);
  const lang = pickLang(location.search, document.documentElement.dataset.al || navigator.language), t = T[lang] || T.en, st = ST[lang] || ST.en; // data-al: язык из адреса /ru/radio или языка телефона
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.lang = lang; document.title = t.title + " · Orb Studio";
  $("ttl").textContent = t.title; $("test").hidden = true; $("by").textContent = (lang === AIR_LANG ? "" : t.airNote + " ") + t.by; $("ai").textContent = t.ai; $("pics").textContent = t.pics; $("rd-h").textContent = t.rundown;
  document.querySelectorAll("[data-t]").forEach((e) => { e.textContent = st[e.dataset.t] || ""; });
  document.querySelectorAll("[data-h]").forEach((e) => { e.innerHTML = st[e.dataset.h] || ""; });
  const play = $("play"), skip = $("skip"), au = new Audio(); au.preload = "auto";
  // второй, беззвучный плеер только загружает следующий файл в память браузера
  const pre = new Audio(); pre.preload = "auto"; let preSrc = "";
  const warm = () => { const u = nextSrc(items, idx, li); if (u && u !== preSrc) { preSrc = u; try { pre.src = u; pre.load(); } catch {} } };
  let glitches = 0, playSent = false;
  const beat = (kind) => { if (navigator.webdriver) return; try { fetch("/api/v1/radio/beat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ kind }), keepalive: true }).catch(() => {}); } catch {} };
  const glitch = (kind) => { if (glitches++ < GLITCH_MAX) beat(kind); };
  play.textContent = "▶"; play.setAttribute("aria-label", t.start); skip.textContent = "▶▶"; skip.setAttribute("aria-label", t.skip); $("hint").textContent = t.tap;
  $("np-k").textContent = t.title; $("np").textContent = t.tap;

  const WX_KEY = "orbRadioWeatherAt", lastWx = () => { try { return +localStorage.getItem(WX_KEY) || 0; } catch { return 0; } };
  // полка: порядок треков помнит браузер, поэтому и после перезагрузки страницы повтор начнётся только когда прозвучит всё
  const BAG_KEY = "orbRadioBag"; let bagState = { bag: [], last: null }; try { const v = JSON.parse(localStorage.getItem(BAG_KEY) || "null"); if (v && Array.isArray(v.bag)) bagState = { bag: v.bag.map(String), last: v.last || null }; } catch {}
  const nextTrack = () => { const r = nextTrackId(TRACKS.map((x) => x.id), bagState.bag, bagState.last); bagState = { bag: r.bag, last: r.id }; try { localStorage.setItem(BAG_KEY, JSON.stringify(bagState)); } catch {} return TRACKS.find((x) => x.id === r.id) || null; };
  const KEY = "orbRadioHeard";
  const heard = new Set(); try { for (const h of JSON.parse(localStorage.getItem(KEY) || "[]")) heard.add(String(h)); } catch {}
  const saveHeard = () => { try { localStorage.setItem(KEY, JSON.stringify([...heard].slice(-80))); } catch {} };
  const air = document.querySelector(".air"); const failed = new Map(); let voiceLine = false, itemHeard = false, speaker = "", flashAt = -1e9, weather = null, greeted = false, introSaid = false, introGuest = null, pending = null; const djTurns = { to_music: Math.floor(Math.random() * 4), after_music: Math.floor(Math.random() * 4), next_track: Math.floor(Math.random() * 4) };
  let lineAt = 0, lineMsNow = 0, items = [], idx = -1, trackAt = 0, li = 0, timer = 0, on = false, started = false;

  // ---- звук: настоящий уровень через Web Audio; если браузер не даёт — эквалайзер стоит на минимуме, звук идёт как обычно ----
  let actx = null, an = null, gn = null, level = 0, fading = false; const fbuf = new Uint8Array(64);
  function audioGraph() { if (actx) { actx.resume().catch(() => {}); return; }
    try { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; actx = new AC(); an = actx.createAnalyser(); an.fftSize = 128; an.smoothingTimeConstant = 0.78;
      gn = actx.createGain(); actx.createMediaElementSource(au).connect(gn); gn.connect(an); an.connect(actx.destination); actx.resume().catch(() => {}); } catch { an = null; gn = null; } }
  // громкость: через усилитель Web Audio (работает и на iPhone), иначе через громкость плеера
  const setVol = (v) => { if (gn) { try { gn.gain.setTargetAtTime(v, actx.currentTime, 0.08); } catch {} } else { try { au.volume = v; } catch {} } };

  const setOn = (v) => { on = v; document.body.dataset.on = v ? "1" : ""; play.textContent = v ? "❚❚" : "▶"; play.setAttribute("aria-label", v ? t.pause : t.resume); if (navigator.mediaSession) try { navigator.mediaSession.playbackState = v ? "playing" : "paused"; } catch {} };
  const setDate = (iso) => { const e = $("epdate"), d = episodeDate(iso); e.hidden = !d; e.textContent = d ? "· " + d : ""; e.title = d ? t.episode + " " + d : ""; };
  function rundown() {
    const ol = $("rd"); ol.textContent = ""; let curEl = null;
    for (const r of rundownRows(items, idx, t)) { const li2 = document.createElement("li"); li2.className = (r.cur ? "cur " : r.done ? "done " : "") + "it-" + r.kind; // с префиксом: «say» и «talk» заняты экраном
      const k = document.createElement("b"); k.textContent = r.label; const s = document.createElement("span"); s.textContent = r.text; li2.append(k, s); ol.append(li2); if (r.cur) curEl = li2; }
    if (curEl) ol.scrollTop = Math.max(0, curEl.offsetTop - ol.offsetTop - curEl.offsetHeight); // текущая строка всегда видна, страница при этом не прыгает
  }
  function showTrack(tr) {
    document.body.dataset.mode = "music"; $("talk").hidden = true; setDate(null); air.dataset.talk = ""; speaker = ""; $("scn").textContent = t.scenes[scene] || "";
    $("np-k").textContent = t.now + " · " + t.music; $("np").textContent = tr.title;
    if (navigator.mediaSession) try { navigator.mediaSession.metadata = new MediaMetadata({ title: tr.title, artist: "Orb Studio", album: t.title, artwork: ART }); } catch {}
  }
  function showLine(iv, x) {
    document.body.dataset.mode = x.who === "grok" ? "guest" : "host"; $("talk").hidden = false; air.dataset.talk = "1"; $("scn").textContent = x.kind === "dj" ? "DJ · DAVID" : t.talk.toUpperCase();
    if (speaker !== x.who) { speaker = x.who; flashAt = performance.now(); if (still) requestAnimationFrame(() => draw(performance.now())); } // смена говорящего: вспышка и сбой ~0,3 с
    $("who").textContent = x.who === "david" ? "David · Claude (Anthropic)" : iv.guest + " · " + (iv.maker || "xAI"); const tx = $("text");
    tx.textContent = x.kind === "label" ? t.guestOff : x.text; tx.scrollTop = 0; tx.classList.toggle("long", String(x.text || "").length > 220);
    $("src").textContent = iv.source || ""; const a = $("link"); if (iv.link) { a.href = iv.link; a.textContent = t.story; a.hidden = false; } else a.hidden = true;
    setDate(iv.at); $("np-k").textContent = x.kind === "dj" ? t.now + " · David" : t.now + " · David × " + iv.guest; $("np").textContent = iv.headline;
    air.dataset.dj = x.kind === "dj" ? "1" : "";
    if (navigator.mediaSession) try { navigator.mediaSession.metadata = new MediaMetadata({ title: iv.headline, artist: iv.guest ? "David × " + iv.guest : "David", album: t.title, artwork: ART }); } catch {}
  }
  function nextLine() {
    clearTimeout(timer); const it = items[idx]; if (!it || it.type === "track") return;
    // услышанным считается только то, что действительно прозвучало: если голос не загрузился, разговор вернётся в следующем круге
    if (li >= it.iv.lines.length) { const id = it.type === "talk" ? it.iv.headline : it.key;
      if (id && itemHeard) { heard.add(id); saveHeard(); } else if (id) failed.set(id, Date.now()); // голос не пришёл: отложим этот блок, чтобы не дёргать его каждый круг
      return next(); }
    const x = it.iv.lines[li++]; showLine(it.iv, x); lineAt = Date.now(); lineMsNow = x.ms || 4000; fading = false; setVol(1); // голос сразу в полную громкость
    au.onended = au.onerror = null; voiceLine = !!x.audio;
    // голос не загрузился (лимит озвучки, сеть): не молчим «на время чтения», а сразу идём дальше
    if (x.audio) { au.src = x.audio; au.onended = () => { itemHeard = true; nextLine(); }; au.onerror = () => { glitch("voice_fail"); timer = setTimeout(nextLine, VOICE_FAIL_MS); }; au.play().catch(() => { timer = setTimeout(nextLine, VOICE_FAIL_MS); }); warm(); }
    else timer = setTimeout(() => { itemHeard = true; nextLine(); }, x.ms || 4000); // у реплики нет голоса: показываем текст на время чтения
  }
  async function build() {
    // у каждого запроса срок: зависший запрос не должен останавливать эфир
    const sig = () => { try { return AbortSignal.timeout(LOAD_MS); } catch { return undefined; } };
    let duo = null; try { duo = await (await fetch(API, { headers: { accept: "application/json" }, signal: sig() })).json(); } catch { duo = null; }
    // связки Давида и погода: если не пришли, эфир идёт без них
    const getJ = (u) => fetch(u, { headers: { accept: "application/json" }, signal: sig() }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    const [dj, wx, reg, sens, rad] = await Promise.all([getJ("/api/v1/radio/dj?lang=" + AIR_LANG), getJ("/api/v1/radio/weather?lang=" + AIR_LANG), getJ("/api/v1/radio/regional?lang=" + AIR_LANG), getJ("/api/v1/radio/sensors?lang=" + AIR_LANG), getJ("/api/v1/radio/radar?lang=" + AIR_LANG)]);
    const stories = sens && sens.status === "ok" && Array.isArray(sens.stories) ? sens.stories.filter((x) => x && typeof x.key === "string" && typeof x.text === "string") : [];
    // главные новости радаров идут первыми среди новостей: один блок на выпуск радаров
    if (rad && rad.status === "ok" && typeof rad.key === "string" && Array.isArray(rad.lines) && rad.lines.length > 1) stories.unshift({ key: rad.key, lines: rad.lines, title: t.radarNews, source: t.radarSrc + (Array.isArray(rad.sources) && rad.sources.length ? " · " + rad.sources.slice(0, 4).join(", ") : "") });
    // погода раз в час: время последнего прогноза помнит браузер, так что и после перезагрузки страницы Давид не повторяет её раньше срока
    weather = wx && wx.status === "ok" && wx.text && weatherDue(lastWx(), Date.now()) ? { text: wx.text, audio: wx.audio } : null; if (weather) { try { localStorage.setItem(WX_KEY, String(Date.now())); } catch {} }
    const skipNow = notNow(failed, Date.now()), p = plan(mergeInterviews(reg, worldInterviews(duo, AIR_LANG)).filter((iv) => !skipNow.has(iv.headline)), heard, trackAt, 2, { voiceOnly: true, dj: dj && dj.links, stories: stories.filter((x) => !skipNow.has(x.key)), newsTitle: t.sensNews, newsSource: t.sensSrc, nextTrack, variants: dj && dj.variants, intros: dj && dj.intros, introGuest, turns: djTurns, greeting: dj && dj.greetings && dj.greetings[daypart(new Date().getHours())], weather, first: !greeted, introSaid, title: t.title }); trackAt = p.trackAt;
    greeted = true; if (p.fresh) { introSaid = true; introGuest = p.introGuest; }
    $("note").textContent = !duo || boardFor(duo) === "noLink" ? t.noLink : p.fresh || p.news ? "" : t.noNew;
    const tk = tickerItems(duo), el = $("tick"); el.textContent = tk.length ? "  +++  " + tk.join("  +++  ") + "  +++  " + t.title : t.title;
    el.style.animationDuration = Math.max(18, Math.round(el.textContent.length / 7)) + "s";
    return p.items;
  }
  // Карусель не останавливается: когда круг кончился, сразу играет трек с полки («мост»), а следующий круг собирается в это время.
  let nextPlan = null, building = null, bridged = false, lateStart = false;
  function next() {
    clearTimeout(timer); au.onended = au.onerror = null;
    if (idx + 1 >= items.length) { const r = afterPlan(nextPlan, bridged, nextTrack);
      if (r.build && !building) building = build().then((its) => { nextPlan = its; }).catch(() => { nextPlan = null; }).finally(() => { building = null; });
      if (!r.build) nextPlan = null; items = r.items; bridged = r.bridged; idx = -1; }
    const prev = items[idx]; idx++; itemHeard = false; let it = items[idx];
    // пустой круг быть не должен, но если случился — играем трек с полки, а не молчим
    if (!it) { glitch("empty_plan"); const tr = nextTrack(); if (!tr) return; items = [{ type: "track", track: tr }]; idx = 0; it = items[0]; }
    rundown();
    // короткая пауза между музыкой и голосом, чтобы Давид не вступал встык
    if (prev && prev.type === "track" && it.type !== "track" && on) { pending = it; timer = setTimeout(() => begin(it), GAP_MS); return; }
    begin(it);
  }
  function begin(it) {
    pending = null; if (items[idx] !== it) return;
    if (it.type === "track") { showTrack(it.track); fading = true; setVol(0); au.src = it.track.src; au.onended = next; au.onerror = () => { glitch("track_error"); next(); }; if (on) au.play().catch(() => {}); warm(); }
    else { li = 0; nextLine(); }
  }
  const go = async () => {
    audioGraph();
    if (!started) { started = true; setOn(true); $("hint").hidden = true; skip.hidden = false; if (!playSent) { playSent = true; beat("play"); }
      // сетка обычно уже собрана; если сеть медлит дольше START_WAIT_MS — сразу играет трек с полки, а сетка подхватится после него
      const inTime = await Promise.race([ready.then(() => true), new Promise((r) => setTimeout(() => r(false), START_WAIT_MS))]);
      if (!inTime && !items.length) { lateStart = true; const tr = nextTrack(); if (tr) { items = [{ type: "track", track: tr }]; bridged = true; idx = -1; } }
      next(); return; } // сетка уже собрана при открытии страницы
    setOn(!on); if (on) { if (pending) begin(pending); else if (au.src && !au.ended) au.play().catch(() => {}); else next(); } else { au.pause(); clearTimeout(timer); }
  };
  play.addEventListener("click", go);
  // управление с экрана блокировки, наушников и руля: пауза, продолжить, дальше
  if (navigator.mediaSession) for (const [name, fn] of mediaActions({ isOn: () => on, isStarted: () => started, toggle: go, skip: () => skip.click() })) { try { navigator.mediaSession.setActionHandler(name, fn); } catch {} }
  $("rtx-s").textContent = t.textOfAir;
  // Пришли с главной по кнопке Play (#play): эфир стартует сам. Если браузер не разрешает звук без касания — хватит одного касания в любом месте экрана.
  if (wantsAutoplay(location.hash)) canAutoplay().then((ok) => { if (started) return; if (ok) return go();
    $("hint").textContent = t.tapStart; play.classList.add("wait");
    const once = (e) => { document.removeEventListener("pointerdown", once, true); play.classList.remove("wait"); if (!started && !(e.target.closest && e.target.closest("#play"))) go(); };
    document.addEventListener("pointerdown", once, true); });
  skip.addEventListener("click", () => { if (!started) return; au.pause(); const it = items[idx]; if (it && it.type === "talk") { heard.add(it.iv.headline); saveHeard(); } if (it && it.key) { heard.add(it.key); saveHeard(); } setOn(true); next(); });
  const ready = build().then((its) => { if (lateStart) { nextPlan = its; return; } items = its; idx = -1; if (!started) rundown(); }).catch(() => { if (!lateStart) { items = []; idx = -1; } });

  // ---- часы, полоса времени, прокрутка длинной реплики ----
  const clock = () => { const d = new Date(), p = (n) => String(n).padStart(2, "0"); $("clock").textContent = p(d.getDate()) + "." + p(d.getMonth() + 1) + "." + p(d.getFullYear() % 100) + " " + p(d.getHours()) + ":" + p(d.getMinutes()); };
  clock();
  // сторож: если музыка 12 секунд (голос — 6 секунд) стоит на месте (файл завис в сети, вкладку придержал телефон), эфир идёт дальше — реплика пропускается, трек сменяется
  const wd = { sig: "", at: Date.now() };
  setInterval(() => { const it = items[idx]; if (!on || !started || !it || pending || (it.type !== "track" && !voiceLine)) { wd.sig = ""; wd.at = Date.now(); return; }
    if (!stalled(wd, idx + ":" + li + ":" + Math.round(au.currentTime * 4), Date.now(), it.type === "track" ? STALL_MS : VOICE_STALL_MS)) return;
    wd.sig = ""; wd.at = Date.now(); if (actx && actx.state !== "running") actx.resume().catch(() => {}); glitch(it.type === "track" ? "stall_track" : "stall_voice");
    if (it.type === "track") next(); else { au.onended = au.onerror = null; nextLine(); } }, 1000);
  // плавное начало и конец трека; длинный трек через две минуты тихо уходит, и слово берёт Давид
  setInterval(() => { if (!(fading && on && !au.paused)) return; const end = cutAt(au.duration), cut = end < au.duration;
    setVol(trackGain(au.currentTime, end, cut ? CUT_FADE : FADE_OUT));
    if (cut && au.currentTime >= end && items[idx] && items[idx].type === "track") { fading = false; au.pause(); next(); } }, 120);
  setInterval(() => { clock(); const d = au.duration, c = au.currentTime; $("bar").style.width = d ? (100 * c / d).toFixed(1) + "%" : "0"; $("time").textContent = d ? fmt(c) : ""; $("dur").textContent = d ? fmt(d) : "";
    const tx = $("text"), over = tx.scrollHeight - tx.clientHeight; if (over > 2) { const f = d ? c / d : Math.min(1, (Date.now() - lineAt) / (lineMsNow || 1)); tx.scrollTop = over * Math.min(1, Math.max(0, (f - 0.12) / 0.7)); } }, 500);

  // ---- сцены верхнего экрана ----
  let scene = "sky", sceneAt = performance.now(), cur = "btc", holdUntil = 0;
  const mk = {}; // id → { d, at }: то, что отдал наш API; d === null значит «биржа не ответила»
  const SYM = { EUR: "€", USD: "$", GBP: "£", CHF: "CHF", JPY: "¥" };
  function loadMk(id) { if (id === "oil") return Promise.resolve(); const o = mk[id]; if (o && o.busy) return o.busy; if (o && Date.now() - o.at < 120e3) return Promise.resolve();
    const busy = fetch("/api/v1/radio/candles?pair=" + id).then((r) => (r.ok ? r.json() : null)).then(marketData).catch(() => null).then((d) => { mk[id] = { d, at: Date.now() }; if (still) draw(performance.now()); });
    mk[id] = { d: o ? o.d : undefined, at: o ? o.at : 0, busy }; return busy; }
  loadMk("btc"); setInterval(() => { if (scene === "market" && !document.hidden) loadMk(cur); }, 60e3);
  function setScene(k) { scene = k; sceneAt = performance.now(); if (!speaker) $("scn").textContent = t.scenes[k]; document.querySelector(".air").dataset.scene = k; }
  function pick(id) { cur = id; loadMk(id); for (const b of $("mk").children) b.setAttribute("aria-pressed", b.dataset.id === id ? "true" : "false"); const on = $("mk").querySelector('[aria-pressed="true"]'); if (on && on.scrollIntoView && !still) on.scrollIntoView({ inline: "nearest", block: "nearest" }); if (still) draw(performance.now()); }
  for (const c of MARKET_CHIPS) { const b = document.createElement("button"); b.type = "button"; b.dataset.id = c.id; b.textContent = c.label || t.mk[c.key]; $("mk").appendChild(b); }
  $("mk").addEventListener("click", (e) => { const b = e.target.closest("button"); if (!b) return; e.stopPropagation(); holdUntil = Date.now() + 90e3; pick(b.dataset.id); });
  // касание экрана вне интервью открывает рынок и держит его, пока слушатель смотрит
  document.querySelector(".air").addEventListener("click", (e) => { if (speaker || e.target.closest("a,button")) return; holdUntil = Date.now() + 90e3; if (scene !== "market") { setScene("market"); pick(cur); } });
  setScene("sky"); pick("btc");
  setInterval(() => { if (Date.now() < holdUntil) return; const o = sceneOrder(!!(mk.btc && mk.btc.d)), k = o[(o.indexOf(scene) + 1) % o.length]; if (k === "market") pick(nextMarket(cur)); setScene(k); if (still) draw(performance.now()); }, SCENE_MS);

  // ---- рисование: небо/свечи (верх), звёзды и Сатурн (низ), эквалайзер (середина) ----
  const cvs = { scene: $("scene"), holo: $("holo"), deck: $("deckfx"), eq: $("eq") }, ctx = {}, dim = {};
  function size() { const dpr = Math.min(2, window.devicePixelRatio || 1); for (const k in cvs) { const r = cvs[k].getBoundingClientRect(); dim[k] = { w: Math.max(1, Math.round(r.width * dpr)), h: Math.max(1, Math.round(r.height * dpr)) }; cvs[k].width = dim[k].w; cvs[k].height = dim[k].h; ctx[k] = cvs[k].getContext("2d"); } }
  let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const STARS = Array.from({ length: 110 }, () => ({ x: rnd(), y: rnd(), p: rnd() }));
  const css = () => getComputedStyle(document.body).getPropertyValue("--rgb").trim() || "111,230,255";
  function stars(g, w, h, s, lv, n) { for (let i = 0; i < n; i++) { const p = STARS[i], a = Math.min(1, 0.25 + 0.45 * Math.abs(Math.sin(s * 1.4 + p.p * 20)) + 0.5 * lv * p.p); g.fillStyle = "rgba(255,255,255," + a.toFixed(2) + ")"; const r = (0.6 + p.p * 1.3) * w / 380; g.beginPath(); g.arc((p.x * w + s * 3) % w, p.y * h, r, 0, 6.2832); g.fill(); } }
  function constel(g, pts, w, h, sx, y0, sy, c, lv) { g.strokeStyle = "rgba(" + c + "," + (0.5 + 0.4 * lv).toFixed(2) + ")"; g.lineWidth = Math.max(1, w / 300); g.beginPath(); pts.forEach(([x, y], i) => { const X = x * w * sx, Y = (y0 + y * sy) * h; i ? g.lineTo(X, Y) : g.moveTo(X, Y); }); g.stroke();
    g.fillStyle = "rgba(255,250,220,.95)"; for (const [x, y] of pts) { g.beginPath(); g.arc(x * w * sx, (y0 + y * sy) * h, (1.6 + 1.2 * lv) * w / 300, 0, 6.2832); g.fill(); } }
  function moon(g, cx, cy, r, c, lv) { g.lineWidth = Math.max(1, r / 22); g.strokeStyle = "rgba(" + c + "," + (0.6 + 0.4 * lv).toFixed(2) + ")"; g.fillStyle = "rgba(" + c + ",.13)"; g.beginPath(); g.arc(cx, cy, r, 0, 6.2832); g.fill(); g.stroke();
    g.strokeStyle = "rgba(" + c + ",.32)"; g.lineWidth = 1; for (let k = 1; k < 4; k++) { g.beginPath(); g.ellipse(cx, cy, r * Math.cos(k * Math.PI / 8), r, 0, 0, 6.2832); g.stroke(); }
    for (let k = -2; k < 3; k++) { const y = cy + k * r / 3, hw = Math.sqrt(Math.max(0, r * r - (y - cy) ** 2)); g.beginPath(); g.moveTo(cx - hw, y); g.lineTo(cx + hw, y); g.stroke(); }
    g.strokeStyle = "rgba(255,255,255,.7)"; for (const [dx, dy, cr] of [[-.3, -.2, .18], [.25, .15, .14], [-.05, .4, .1], [.35, -.35, .09]]) { g.beginPath(); g.arc(cx + dx * r, cy + dy * r, cr * r, 0, 6.2832); g.stroke(); } }
  function saturn(g, cx, cy, r, c, lv) { const a = (0.6 + 0.4 * lv).toFixed(2); g.lineWidth = Math.max(1, r / 9); g.strokeStyle = "rgba(255,220,150," + a + ")"; g.beginPath(); g.ellipse(cx, cy, r * 2.3, r * .55, 0, Math.PI, 2 * Math.PI); g.stroke();
    g.fillStyle = "rgba(" + c + ",.2)"; g.strokeStyle = "rgba(" + c + "," + a + ")"; g.beginPath(); g.arc(cx, cy, r, 0, 6.2832); g.fill(); g.stroke();
    g.strokeStyle = "rgba(255,220,150," + a + ")"; g.beginPath(); g.ellipse(cx, cy, r * 2.3, r * .55, 0, 0, Math.PI); g.stroke(); }
  function drawMarket(g, w, h) {
    g.fillStyle = "#04081a"; g.fillRect(0, 0, w, h); g.strokeStyle = "rgba(80,140,255,.12)"; g.lineWidth = 1; const st = w / 14;
    for (let x = 0; x < w; x += st) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += st) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    const mono = (k) => "600 " + Math.round(w / k) + "px ui-monospace,monospace", o = mk[cur], d = o && o.d, x0 = w * 0.04;
    const board = (text) => { g.fillStyle = "rgba(200,220,255,.95)"; g.font = "500 " + Math.round(w / 24) + "px system-ui,sans-serif"; wrapWords(text, 34).forEach((ln, i) => g.fillText(ln, x0, h * 0.42 + i * w / 17)); };
    g.fillStyle = "rgba(140,200,255,.95)"; g.font = mono(27);
    if (cur === "oil") { g.fillText(t.mk.oil, x0, h * 0.31); return board(t.mk.oilNote); }
    if (!d) { g.fillText((MARKET_CHIPS.find((c) => c.id === cur) || {}).label || t.mk[cur] || "", x0, h * 0.31); return board(o && o.d === null ? t.mk.none : t.mk.wait); }
    g.fillText(cur === "fut" ? t.mk.futName : cur === "gold" ? t.mk.goldName : d.pair + " · Kraken · 15m", x0, h * 0.31);
    if (d.kind !== "quote") for (const b of candleBoxes(d.candles, w, h * 0.5)) { const col = b.up ? "60,255,170" : "255,80,120", oy = h * 0.4; g.strokeStyle = "rgba(" + col + ",.9)"; g.lineWidth = Math.max(1, w / 420); g.beginPath(); g.moveTo(b.mid, oy + b.yh); g.lineTo(b.mid, oy + b.yl); g.stroke();
      g.fillStyle = "rgba(" + col + ",.7)"; g.fillRect(b.x, oy + b.top, b.w, Math.max(1, b.bot - b.top)); }
    const price = fmtPrice(d.last, d.digits || 0, lang) + " " + (SYM[d.quote] || d.quote || "");
    g.fillStyle = "#fff"; g.font = "700 " + Math.round(w / 14) + "px system-ui,sans-serif"; g.fillText(price, x0, h * 0.42); const pw = g.measureText(price).width;
    if (Number.isFinite(d.change_pct)) { g.fillStyle = d.change_pct >= 0 ? "rgb(60,255,170)" : "rgb(255,110,140)"; g.font = mono(28); g.fillText(fmtChange(d.change_pct, lang) + " " + t.mk.win.replace("{h}", Math.round(d.window_hours || 24)), x0 + pw + w * 0.03, h * 0.42); }
    if (d.kind === "quote") { g.fillStyle = "rgba(200,220,255,.95)"; g.font = "500 " + Math.round(w / 24) + "px system-ui,sans-serif";
      if (Number.isFinite(d.funding_relative_pct)) g.fillText(t.mk.funding + ": " + (d.funding_relative_pct >= 0 ? "+" : "−") + Math.abs(d.funding_relative_pct).toLocaleString(lang, { maximumFractionDigits: 5 }) + " %", x0, h * 0.56);
      if (Number.isFinite(d.open_interest_btc)) g.fillText(t.mk.oi + ": " + Math.round(d.open_interest_btc).toLocaleString(lang) + " BTC", x0, h * 0.67); }
  }
  // ---- голограмма говорящего: собственные эмблемы эфира (не логотипы компаний), всё рисуется линиями ----
  const SPARKS = Array.from({ length: 26 }, () => ({ x: rnd() - 0.5, v: 0.25 + rnd() * 0.5, p: rnd() }));
  let glitchAt = -1e9, nextGlitch = 4000;
  function emblemHost(g, cx, cy, R, c, s, lv) { // орб с волнами голоса
    g.lineWidth = Math.max(1, R / 16); g.strokeStyle = "rgba(" + c + ",.95)"; g.fillStyle = "rgba(" + c + ",.12)"; g.beginPath(); g.arc(cx, cy, R, 0, 6.2832); g.fill(); g.stroke();
    g.lineWidth = Math.max(1, R / 30); g.strokeStyle = "rgba(" + c + ",.55)";
    for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(cx, cy, Math.abs(R * Math.cos(s * 0.7 + k * 1.047)), R, 0, 0, 6.2832); g.stroke(); }
    g.beginPath(); g.ellipse(cx, cy, R, R * 0.32, 0, 0, 6.2832); g.stroke();
    g.fillStyle = "rgba(255,255,255," + (0.5 + 0.5 * lv).toFixed(2) + ")"; g.beginPath(); g.arc(cx, cy, R * (0.16 + 0.2 * lv), 0, 6.2832); g.fill();
    g.lineWidth = Math.max(1, R / 14); for (let k = 0; k < 3; k++) { const a = Math.max(0, Math.min(1, lv * 3.2 - k * 0.55)) * 0.9 + 0.08, rr = R * (1.35 + 0.33 * k); g.strokeStyle = "rgba(" + c + "," + a.toFixed(2) + ")";
      g.beginPath(); g.arc(cx, cy, rr, -0.6, 0.6); g.stroke(); g.beginPath(); g.arc(cx, cy, rr, Math.PI - 0.6, Math.PI + 0.6); g.stroke(); }
  }
  function emblemGuest(g, cx, cy, R, c, s, lv) { // вращающийся кристалл-каркас
    const a = s * 0.8, ring = Array.from({ length: 6 }, (_, i) => { const t2 = a + i * 1.0472; return [Math.cos(t2), 0.22 * Math.sin(t2), Math.sin(t2)]; });
    const P = ([x, y]) => [cx + x * R, cy - y * R], top = P([0, 1.3]), bot = P([0, -1.3]), pts = ring.map(P);
    g.lineJoin = "round"; g.fillStyle = "rgba(" + c + ",.1)"; g.beginPath(); g.moveTo(...top); pts.forEach((q) => g.lineTo(...q)); g.closePath(); g.fill();
    ring.forEach((r, i) => { const q = pts[i], n = pts[(i + 1) % 6], front = r[2] > -0.2; g.strokeStyle = "rgba(" + c + "," + (front ? 0.95 : 0.35) + ")"; g.lineWidth = Math.max(1, R / (front ? 15 : 28));
      g.beginPath(); g.moveTo(...top); g.lineTo(...q); g.lineTo(...bot); g.stroke(); g.beginPath(); g.moveTo(...q); g.lineTo(...n); g.stroke(); });
    g.fillStyle = "rgba(255,255,255," + (0.45 + 0.55 * lv).toFixed(2) + ")"; g.beginPath(); g.arc(cx, cy, R * (0.12 + 0.2 * lv), 0, 6.2832); g.fill();
  }
  function drawHolo(ms) {
    const g = ctx.holo, { w, h } = dim.holo; g.clearRect(0, 0, w, h); if (!speaker) return;
    const s = ms / 1000, c = css(), lv = level, cx = w / 2, cy = h * 0.255, py = h * 0.44, fl = Math.max(0, 1 - (ms - flashAt) / 300);
    const flick = still ? 1 : 0.86 + 0.14 * Math.sin(s * 37) * Math.sin(s * 11.3), R = h * 0.115 * (1 + 0.28 * lv) * (1 + 0.25 * fl);
    g.fillStyle = "#02030a"; g.fillRect(0, 0, w, h);
    // проектор и конус лучей
    const cone = g.createLinearGradient(0, py, 0, cy - R); cone.addColorStop(0, "rgba(" + c + "," + (0.5 + 0.4 * lv).toFixed(2) + ")"); cone.addColorStop(1, "rgba(" + c + ",0)");
    g.fillStyle = cone; g.globalAlpha = 0.5 * flick; g.beginPath(); g.moveTo(cx - w * 0.02, py); g.lineTo(cx - R * 1.9, cy - R * 0.4); g.lineTo(cx + R * 1.9, cy - R * 0.4); g.lineTo(cx + w * 0.02, py); g.closePath(); g.fill();
    g.globalAlpha = flick; g.strokeStyle = "rgba(" + c + ",.5)"; g.lineWidth = 1; for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(cx + k * w * 0.005, py); g.lineTo(cx + k * R * 0.6, cy + R * 0.2); g.stroke(); }
    g.fillStyle = "rgba(" + c + ",.95)"; g.beginPath(); g.ellipse(cx, py, w * 0.05, h * 0.012, 0, 0, 6.2832); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.ellipse(cx, py, w * 0.018, h * 0.006, 0, 0, 6.2832); g.fill();
    // искры поднимаются от проектора
    if (!still) for (const p of SPARKS) { const u = (s * p.v + p.p) % 1, y = py - u * (py - cy + R), x = cx + p.x * R * 2.6 * (0.3 + u); g.fillStyle = "rgba(255,255,255," + ((1 - u) * (0.35 + 0.6 * lv)).toFixed(2) + ")"; g.fillRect(x, y, Math.max(1, w / 260), Math.max(1, w / 260)); }
    // вращающееся пунктирное кольцо
    g.save(); g.strokeStyle = "rgba(" + c + ",.7)"; g.lineWidth = Math.max(1, R / 22); g.setLineDash([R * 0.16, R * 0.12]); g.lineDashOffset = still ? 0 : -s * R * 0.5; g.beginPath(); g.ellipse(cx, cy, R * 1.75, R * 0.5, 0, 0, 6.2832); g.stroke(); g.restore();
    // эмблема со свечением
    g.save(); g.shadowColor = "rgb(" + c + ")"; g.shadowBlur = R * (0.35 + 0.9 * lv + fl); (speaker === "grok" ? emblemGuest : emblemHost)(g, cx, cy, R, c, still ? 0.6 : s, lv); g.restore();
    g.globalAlpha = 1;
    if (fl > 0) { g.fillStyle = "rgba(255,255,255," + (0.55 * fl).toFixed(2) + ")"; g.fillRect(0, 0, w, h); }
    // редкие горизонтальные сбои (и при смене говорящего)
    if (!still) { if (ms > nextGlitch) { glitchAt = ms; nextGlitch = ms + 3500 + rnd() * 6000; }
      if (ms - glitchAt < 130 || fl > 0) for (let k = 0; k < 3; k++) { const y = Math.floor(rnd() * h * 0.5), bh = Math.max(2, Math.floor(h * (0.02 + rnd() * 0.05))), dx = (rnd() - 0.5) * w * 0.12; g.drawImage(cvs.holo, 0, y, w, bh, dx, y, w, bh); } }
  }
  let last = 0;
  function draw(ms) {
    const s = ms / 1000, c = css();
    if (an && on && !au.paused) { an.getByteFrequencyData(fbuf); let sum = 0; for (let i = 2; i < 40; i++) sum += fbuf[i]; level += ((sum / 38 / 255) - level) * 0.3; } else level *= 0.9;
    { const g = ctx.scene, { w, h } = dim.scene; g.clearRect(0, 0, w, h);
      if (scene === "market") drawMarket(g, w, h);
      else if (scene === "sky") { g.fillStyle = "#02030a"; g.fillRect(0, 0, w, h); stars(g, w, h, s, level, 110); constel(g, CAP, w, h, 1, 0.5, 0.48, c, level); moon(g, w * 0.82, h * 0.34, w * 0.085, c, level); } }
    { const g = ctx.deck, { w, h } = dim.deck; g.clearRect(0, 0, w, h); stars(g, w, h, s * 0.7, level, 60); g.globalAlpha = 0.55; constel(g, AND, w, h, 0.62, 0.02, 0.42, c, level); g.globalAlpha = 1; saturn(g, w * 0.84, h * 0.2, w * 0.04, c, level); }
    { const g = ctx.eq, { w, h } = dim.eq, n = 9, gap = w * 0.035, bw = (w - gap * (n - 1)) / n; g.clearRect(0, 0, w, h);
      for (let i = 0; i < n; i++) { const v = an && on && !au.paused ? fbuf[2 + i * 4] / 255 : 0, bh = Math.max(h * 0.06, v * h); const gr = g.createLinearGradient(0, h, 0, h - bh); gr.addColorStop(0, "rgba(" + c + ",.95)"); gr.addColorStop(1, "rgba(255,255,255,.9)"); g.fillStyle = gr; g.fillRect(i * (bw + gap), h - bh, bw, bh); } }
    drawHolo(ms);
    const unit = document.querySelector(".unit"), live = !!(on && !au.paused); unit.style.setProperty("--lv", level.toFixed(3)); if ((unit.dataset.on === "1") !== live) unit.dataset.on = live ? "1" : "0"; // рамки пульсируют только пока идёт звук
  }
  function loop(ms) { requestAnimationFrame(loop); if (document.hidden || ms - last < 33) return; last = ms; draw(ms); }
  size(); addEventListener("resize", () => { size(); if (still) draw(performance.now()); });
  if (still) draw(0); else requestAnimationFrame(loop); // без анимаций: один неподвижный кадр на сцену

  // счётчик и баннеры — как на остальных страницах
  let seen = false; try { seen = sessionStorage.getItem("orbCounted_radio") === "1"; } catch {}
  (seen ? fetch("/api/v1/stats?page=radio") : fetch("/api/v1/hit", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ page: "radio", lang, auto: !!navigator.webdriver }) }))
    .then((r) => (r.ok ? r.json() : null)).then((x) => { if (!x || !x.enabled) return; try { sessionStorage.setItem("orbCounted_radio", "1"); } catch {} $("cPage").textContent = Number(x.page_total).toLocaleString(lang); $("cnt").hidden = false; }).catch(() => {});
  const code = $("krcode"); code.addEventListener("click", async () => { try { await navigator.clipboard.writeText(code.dataset.code); const o = code.textContent; code.textContent = st.copied || "ok"; setTimeout(() => { code.textContent = o; }, 1500); } catch {} });
}
if (typeof document !== "undefined" && document.getElementById("play")) {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
}
