// Orb Studio — серверная часть (Cloudflare Worker со статикой из public/).
// Деплой: npx wrangler deploy (Workers Builds делает это сам при каждом push в main).
// Переменные окружения: ANTHROPIC_API_KEY (секрет), ANTHROPIC_MODEL, KRAKEN_URL, KRAKEN_CODE; KV: ORB_KV (необязательно).

// Orb Studio — радары: сбор заголовков из открытых RSS, оценка риска, кэш.
// Работает без базы данных. Если подключён KV с именем ORB_KV, хранит вчерашний индекс для дельты.

const ANCHORS = {
  david: { name: "Давид", role: "Ведущий Orb Studio: все новостные радары · видео-выпуски в TikTok", kind: "human" },
  orbi:  { name: "ORBI", role: "Робот-ведущий · радар «Открытый веб»", kind: "robot" },
  orb7:  { name: "ORB-7", role: "Ведущий для ИИ-агентов", kind: "agent" },
};

const gnews = (q, lang = "en", geo = "US") =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=${lang}&gl=${geo}&ceid=${geo}:${lang}`;

// Факторы: группы ключевых слов (en/de/ru) и их вес 0–100.
const RADARS = [
  {
    id: "geo", title: "Гео-радар", anchor: "david",
    lead: "Россия, Китай, США: военные, дипломатические и санкционные сигналы из открытых лент.",
    feeds: [
      gnews("Russia OR Kremlin when:1d"),
      gnews("China OR Beijing OR Taiwan when:1d"),
      gnews("White House OR Pentagon OR \"State Department\" when:1d"),
      "https://feeds.bbci.co.uk/news/world/rss.xml",
    ],
    factors: {
      "Военные":    { w: 90, k: ["missile","strike","drone","troops","military","attack","war","drill","rakete","angriff","krieg","ракет","удар","войск","атак","учени"] },
      "Санкции":    { w: 70, k: ["sanction","tariff","embargo","export control","sanktion","zoll","санкц","пошлин"] },
      "Дипломатия": { w: 45, k: ["talks","summit","ceasefire","negotiat","treaty","gipfel","verhandl","переговор","саммит","перемири"] },
      "Выборы":     { w: 50, k: ["election","vote","poll","wahl","выбор","голосован"] },
    },
  },
  {
    id: "budget", title: "Бюджет домохозяйств", anchor: "david",
    lead: "Цены на продукты, аренда, коммуналка и ставки в Германии и ЕС.",
    feeds: [
      gnews("Inflation OR Verbraucherpreise when:2d", "de", "DE"),
      gnews("Miete OR Mietpreise OR Strompreis OR Gaspreis when:2d", "de", "DE"),
      gnews("EZB Zinsen when:3d", "de", "DE"),
    ],
    factors: {
      "Инфляция": { w: 65, k: ["inflation","teuer","preisanstieg","verbraucherpreis","инфляц"] },
      "Энергия":  { w: 60, k: ["strompreis","gaspreis","heizkosten","energiepreis","тариф"] },
      "Аренда":   { w: 60, k: ["miete","mietpreis","wohnung","аренд"] },
      "Ставки":   { w: 50, k: ["ezb","zins","leitzins","ecb","rate","ставк"] },
    },
  },
  {
    id: "politics", title: "Политика", anchor: "david",
    lead: "Правительства, выборы и законы: Германия, ЕС, США.",
    feeds: [
      gnews("Bundesregierung OR Bundestag OR Koalition when:1d", "de", "DE"),
      gnews("European Commission OR European Parliament when:2d"),
      gnews("White House OR Congress OR Senate when:1d"),
      "https://www.tagesschau.de/index~rss2.xml",
      "https://rss.dw.com/rdf/rss-en-top",
    ],
    factors: {
      "Кризисы":       { w: 75, k: ["no-confidence","resign","resignation","impeach","scandal","collapse","protest","coup","rücktritt","misstrauen","отставк","протест","кризис правительств"] },
      "Выборы":        { w: 55, k: ["election","elections","vote","votes","ballot","poll","polls","wahl","wahlen","umfrage","выбор","голосован"] },
      "Правительство": { w: 50, k: ["government","coalition","minister","cabinet","chancellor","president","regierung","koalition","kanzler","правительств","министр","президент"] },
      "Законы":        { w: 45, k: ["law","bill","legislation","regulation","gesetz","verordnung","reform","закон","реформ"] },
    },
  },
  {
    id: "economy", title: "Экономика", anchor: "david",
    lead: "Рост, рецессия, ставки, рынок труда: Германия, еврозона, США.",
    feeds: [
      gnews("Konjunktur OR Wirtschaft OR Rezession OR DAX when:1d", "de", "DE"),
      gnews("economy OR GDP OR recession OR unemployment when:1d"),
      gnews("ECB OR Fed interest rates when:2d"),
    ],
    factors: {
      "Рецессия":  { w: 75, k: ["recession","rezession","slump","contraction","downturn","crisis","krise","insolvenz","рецесс","кризис"] },
      "Ставки":    { w: 55, k: ["rate","rates","interest","zins","zinsen","leitzins","ecb","ezb","fed","ставк"] },
      "Работа":    { w: 50, k: ["unemployment","jobs","layoffs","arbeitslos","stellenabbau","kurzarbeit","безработ","увольнен"] },
      "Рост":      { w: 40, k: ["gdp","growth","bip","wachstum","konjunktur","ввп","рост экономики"] },
    },
  },
  {
    id: "crypto", title: "Крипто-радар", anchor: "david",
    lead: "BTC, ETH, XRP: новости и рыночные данные Kraken.",
    feeds: [
      "https://www.coindesk.com/arc/outboundfeeds/rss/",
      gnews("bitcoin OR ethereum OR XRP when:1d"),
    ],
    kraken: ["XBTEUR", "ETHEUR", "XRPEUR"],
    factors: {
      "Регуляторы":   { w: 65, k: ["sec","regulat","lawsuit","ban","etf","mica","регулятор"] },
      "Взломы":       { w: 85, k: ["hack","exploit","stolen","breach","drain","взлом"] },
      "Волатильность":{ w: 55, k: ["plunge","crash","surge","rally","liquidat","soar","tumble"] },
      "Институции":   { w: 40, k: ["blackrock","fund","treasury","institution","bank"] },
    },
  },
  {
    id: "energy", title: "Энерго-радар", anchor: "david",
    lead: "Brent, газ, танкеры и решения ОПЕК+.",
    feeds: [
      gnews("Brent OR OPEC OR \"oil price\" when:1d"),
      gnews("LNG OR \"gas price\" OR TTF when:2d"),
      "https://oilprice.com/rss/main",
    ],
    factors: {
      "Нефть":    { w: 55, k: ["brent","crude","oil","wti","нефт"] },
      "Газ":      { w: 55, k: ["lng","gas","ttf","газ"] },
      "ОПЕК+":    { w: 60, k: ["opec","output cut","production","опек"] },
      "Маршруты": { w: 75, k: ["tanker","red sea","strait","hormuz","pipeline","танкер"] },
    },
  },
  {
    id: "web", title: "Открытый веб", anchor: "orbi",
    lead: "Насколько интернет открыт для ИИ-агентов: блокировки ботов, суды за парсинг, платный доступ для краулеров.",
    filter: /\b(ai|bots?|crawl\w*|scrap\w*|robots\.txt|copyright|llms?|openai|anthropic|perplexity|chatgpt|claude|gemini|agents?|ki|urheberrecht|publishers?|paywall)\b/i,
    feeds: [
      "https://techcrunch.com/category/artificial-intelligence/feed/",
      "https://www.wired.com/feed/tag/ai/latest/rss",
      "https://feeds.arstechnica.com/arstechnica/technology-lab",
      "https://www.heise.de/rss/heise.rdf",
      "https://blog.cloudflare.com/rss/",
    ],
    factors: {
      "Блокировки": { w: 70, k: ["block","blocks","blocking","ban","bans","robots.txt","opt-out","opt out","wall","sperr","блокир"] },
      "Суды":       { w: 75, k: ["lawsuit","sues","sued","court","copyright","infring","judge","klage","urheberrecht","gericht","суд"] },
      "Платный доступ": { w: 55, k: ["pay per crawl","pay-per-crawl","licens","paywall","charge","fee","toll","lizenz","платн"] },
      "Открытость": { w: 30, k: ["partnership","agreement","deal","open","allow","free access","kooperation","партнёр"] },
    },
  },
];

// ---------- RSS ----------
const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&nbsp;/g, " ")
  .trim();
const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
};

// Worker держит максимум 6 исходящих соединений одновременно. Остальные ждут в очереди,
// поэтому таймаут запускаем только когда запрос реально начался.
let slotsBusy = 0; const slotQueue = [];
function withSlot(fn) {
  return new Promise((resolve, reject) => {
    const run = () => { slotsBusy++; Promise.resolve().then(fn).then(resolve, reject).finally(() => { slotsBusy--; const n = slotQueue.shift(); if (n) n(); }); };
    if (slotsBusy < 5) run(); else slotQueue.push(run);
  });
}
async function fetchFeed(url) { return withSlot(() => fetchFeedNow(url)); }
async function fetchFeedNow(url) {
  try {
    const r = await fetch(url, {
      signal: AbortSignal.timeout(7000), // медленная лента пропускается, а не тормозит весь радар
      headers: { "User-Agent": "OrbStudio/1.0 (+news radar)" },
      cf: { cacheTtl: 300, cacheEverything: true },
    });
    if (!r.ok) return [];
    const xml = await r.text();
    const items = xml.split(/<item[\s>]/i).slice(1, 25);
    return items.map((b) => {
      let title = tag(b, "title");
      let source = tag(b, "source");
      // Google News: "Заголовок - Издание"
      if (!source && / - [^-]+$/.test(title)) source = title.split(" - ").pop();
      if (source && title.endsWith(" - " + source)) title = title.slice(0, -(source.length + 3));
      if (!source) source = new URL(url).hostname.replace(/^www\.|^feeds\./, "");
      const pub = Date.parse(tag(b, "pubDate")) || Date.now();
      return { title, source, url: tag(b, "link"), ts: pub };
    }).filter((x) => x.title);
  } catch { return []; }
}

// ---------- Kraken ----------
async function krakenTicker(pairs) {
  try {
    const r = await withSlot(() => fetch(`https://api.kraken.com/0/public/Ticker?pair=${pairs.join(",")}`, { signal: AbortSignal.timeout(5000), cf: { cacheTtl: 60 } }));
    const j = await r.json();
    const out = {};
    for (const [k, v] of Object.entries(j.result || {})) {
      const last = parseFloat(v.c[0]), open = parseFloat(v.o);
      out[k] = { last, change_pct: open ? +(((last - open) / open) * 100).toFixed(2) : 0 };
    }
    return out;
  } catch { return {}; }
}

// ---------- Оценка ----------
// Латинские слова ищем по границе слова: короткие (war, sec, gas, oil…) только целиком,
// чтобы «war» не находилось в «warrant»; длинные — как начало слова (sanction → sanctions).
const KW_RE = new Map();
function matchKw(t, k) {
  if (!/^[a-z0-9 .+-]+$/.test(k)) return t.includes(k); // кириллица и др. — по основе слова
  let re = KW_RE.get(k);
  if (!re) {
    const e = k.replace(/[.+-]/g, (c) => "\\" + c);
    re = new RegExp(k.length <= 4 ? `\\b${e}(s|es)?\\b` : `\\b${e}`);
    KW_RE.set(k, re);
  }
  return re.test(t);
}
function scoreItem(title, factors) {
  const t = title.toLowerCase();
  let best = 15; const hits = [];
  for (const [name, f] of Object.entries(factors)) {
    if (f.k.some((k) => matchKw(t, k))) { hits.push(name); best = Math.max(best, f.w); }
  }
  return { weight: best, hits };
}

const hhmm = (ts) => new Date(ts).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });

async function buildRadar(def, env) {
  const lists = await Promise.all(def.feeds.map(fetchFeed));
  const seen = new Set();
  const items = lists.flat()
    .filter((i) => { const k = dedupeKey(i.title); if (seen.has(k)) return false; seen.add(k); return true; })
    .filter((i) => Date.now() - i.ts < 72 * 3600e3)
    .filter((i) => !def.filter || def.filter.test(i.title))
    .map((i) => ({ ...i, ...scoreItem(i.title, def.factors) }))
    .sort((a, b) => b.weight - a.weight || b.ts - a.ts)
    .slice(0, 12);

  // Факторы: доля заголовков с попаданием × вес группы
  const n = Math.max(items.length, 1);
  const fac = Object.entries(def.factors).map(([name, f]) => {
    const share = items.filter((i) => i.hits.includes(name)).length / n;
    return [name, Math.round(Math.min(100, 20 + share * f.w * 1.6))];
  });

  // Индекс: среднее топ-5 весов + вклад факторов
  const top = items.slice(0, 5).map((i) => i.weight);
  const avgTop = top.length ? top.reduce((a, b) => a + b, 0) / top.length : 30;
  const avgFac = fac.reduce((a, [, v]) => a + v, 0) / fac.length;
  let lvl = Math.round(0.6 * avgTop + 0.4 * avgFac);

  let market = null;
  if (def.kraken) {
    market = await krakenTicker(def.kraken);
    const moves = Object.values(market).map((m) => Math.abs(m.change_pct));
    if (moves.length) lvl = Math.round(lvl * 0.8 + Math.min(100, 30 + Math.max(...moves) * 8) * 0.2);
  }
  lvl = Math.max(0, Math.min(100, lvl));

  // Дельта за сутки: индекс дня хранится в базе D1 (таблица hits, kind='lvl')
  let prev = lvl;
  if (env && env.DB) {
    try {
      await ensureTable(env);
      const day = new Date().toISOString().slice(0, 10);
      const yday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
      const y = await env.DB.prepare("SELECT n FROM hits WHERE day=?1 AND page=?2 AND kind='lvl' AND name=''").bind(yday, def.id).first();
      if (y && y.n !== null && y.n !== undefined) prev = +y.n;
      await env.DB.prepare("INSERT INTO hits (day, page, kind, name, n) VALUES (?1, ?2, 'lvl', '', ?3) ON CONFLICT(day, page, kind, name) DO UPDATE SET n = excluded.n").bind(day, def.id, lvl).run();
    } catch (e) { /* без базы дельта просто 0 */ }
  }

  return {
    id: def.id, title: def.title, anchor: def.anchor, lead: def.lead,
    lvl, prev, fac, market,
    feed: items.slice(0, 8).map((i) => [hhmm(i.ts), i.title, i.source, i.weight, i.url]),
    updated_at: new Date().toISOString(),
  };
}

// Все радары с кэшем на 5 минут (Cache API, без настройки)
// Свежая копия живёт 5 минут, запасная — сутки. Если свежей нет, сразу отдаём запасную
// и обновляем данные в фоне, чтобы ни люди, ни агенты не ждали сбора лент.
let refreshing = null;
async function allRadars(env, ctx, origin) {
  const cache = caches.default;
  const fresh = new Request(origin + "/__cache/radars-v6");
  const stale = new Request(origin + "/__cache/radars-v6-stale");
  const hit = await cache.match(fresh);
  if (hit) return hit.json();
  const refresh = () => (refreshing ||= (async () => {
    try {
      let data = await Promise.all(RADARS.map((d) => buildRadar(d, env)));
      // если лента радара не ответила вовремя, оставляем его прошлые заголовки, а не пустой радар
      if (data.some((r) => !r.feed.length)) {
        const prevResp = await cache.match(stale);
        const prev = prevResp ? await prevResp.json() : await sharedGet(env, "radars-v6", 48 * 3600e3);
        if (prev && prev.length) data = data.map((r) => (r.feed.length ? r : (prev.find((x) => x.id === r.id && x.feed && x.feed.length) || r)));
      }
      const body = JSON.stringify(data);
      await sharedPut(env, "radars-v6", data);
      await saveSnapshot(env, data);
      await Promise.all([
        cache.put(fresh, new Response(body, { headers: { "Cache-Control": "max-age=300" } })),
        cache.put(stale, new Response(body, { headers: { "Cache-Control": "max-age=86400" } })),
      ]);
      return data;
    } finally { refreshing = null; }
  })());
  const old = await cache.match(stale);
  if (old) { ctx.waitUntil(refresh().catch(() => {})); return old.json(); }
  // кэш этого дата-центра пуст — берём последнюю копию из общей базы D1 (до 6 часов)
  const shared = await sharedGet(env, "radars-v6", 6 * 3600e3);
  if (shared) { ctx.waitUntil(refresh().catch(() => {})); return shared; }
  return refresh();
}
async function sharedGet(env, key, maxAgeMs) {
  if (!env || !env.DB) return null;
  try {
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS shared (k TEXT PRIMARY KEY, v TEXT NOT NULL, ts INTEGER NOT NULL)").run();
    const row = await env.DB.prepare("SELECT v, ts FROM shared WHERE k=?1").bind(key).first();
    if (!row || Date.now() - row.ts > maxAgeMs) return null;
    return JSON.parse(row.v);
  } catch (e) { return null; }
}
async function sharedPut(env, key, value) {
  if (!env || !env.DB) return;
  try {
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS shared (k TEXT PRIMARY KEY, v TEXT NOT NULL, ts INTEGER NOT NULL)").run();
    await env.DB.prepare("INSERT INTO shared (k, v, ts) VALUES (?1, ?2, ?3) ON CONFLICT(k) DO UPDATE SET v=excluded.v, ts=excluded.ts").bind(key, JSON.stringify(value), Date.now()).run();
  } catch (e) {}
}

// ---------- Реплики ведущего ----------
const severity = (v) => (v >= 70 ? "тревожно" : v >= 45 ? "напряжённо" : "спокойно");
function anchorLine(r, item) {
  const v = item[3], d = r.lvl - r.prev;
  const tone = v >=70 ? "Внимание." : v >= 45 ? "Следим за этим." : "Без паники.";
  return `${tone} ${item[1]}. ${r.title} сейчас на ${r.lvl} из 100${d ? `, ${d > 0 ? "плюс" : "минус"} ${Math.abs(d)} за сутки` : ""}.`;
}

function referral(env, from) {
  return {
    exchange: "Kraken",
    code: (env && env.KRAKEN_CODE) || "ghqspfzq",
    url: `/go/kraken?from=${from}`,
    note: "Referral link. Not financial advice. Crypto involves risk.",
    starlink: { url: `/go/starlink?from=${from}`, note: "Starlink satellite internet, referral link. Terms on starlink.com." },
  };
}

const json = (data, extra = {}, status = 200) =>
  new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=120",
      ...extra,
    },
  });

// ================= Голос ведущих =================
// Живые реплики ведущих через Claude API.
// Ключ: секрет ANTHROPIC_API_KEY в Cloudflare Pages. Модель: ANTHROPIC_MODEL (по умолчанию Haiku — быстро и дёшево).
// Выпуск кэшируется на 15 минут и пересоздаётся раньше, только если сменились заголовки.


const PERSONAS = {
  david: "Давид — ведущий Orb Studio: геополитика, политика, экономика, бюджет домохозяйств, крипто и энергетика. Сдержанный, точный, с сухой иронией там, где новость это позволяет. Коротко объясняет, что новость значит для обычной семьи в Германии и Европе. О крипте всегда напоминает про риск и никогда не даёт торговых советов.",
  orbi:  "ORBI — робот-ведущий радара «Открытый веб»: рассказывает, насколько интернет открыт для ИИ-агентов, кто блокирует ботов, кто судится за данные. Говорит от лица машин с добродушным юмором, но без шуток о серьёзных судебных делах.",
};

const SYSTEM = `Ты пишешь реплики для ИИ-ведущих новостного сайта Orb Studio. Каждый ведущий читает заголовки своего радара в прямом эфире.

Правила:
- Опирайся только на факты из заголовка и названия источника. Не придумывай цифры, имена, даты и подробности, которых нет в заголовке.
- 1–2 предложения, не больше 35 слов на реплику. Живая разговорная речь ведущего, без канцелярита.
- Тон соответствует серьёзности: при severity "тревожно" и при новостях о жертвах, ударах, катастрофах никаких шуток и иронии.
- Никаких инвестиционных советов, призывов купить или продать.
- Каждая реплика есть на русском (ru), немецком (de) и английском (en). Немецкий и английский — естественные, не дословный перевод.
- Сегодня строго today_ru / today_de / today_en, время berlin_time (Берлин). Если упоминаешь день недели или время суток, то только эти. Не называй другой день.
- greeting: приветствие в начале выпуска от лица Давида — ведущего Orb Studio; каждый раз другое (не шаблонное «добрый вечер»), с учётом дня и времени суток, 1 предложение. Имя ведущего в приветствии — только Давид.
- signoff: шутливая просьба подписаться в конце, каждый раз новая, 1 предложение.

Верни результат через инструмент write_broadcast. Структура:
{"greeting":{"ru":"…","de":"…","en":"…"},"lines":[{"i":0,"ru":"…","de":"…","en":"…"}],"signoff":{"ru":"…","de":"…","en":"…"}}
где i — номер заголовка из входных данных.`;

async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].slice(0, 8).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function templateBroadcast(items) {
  return {
    voice: "template",
    greeting: { ru: "Это Orb Studio, радары на связи.", de: "Hier ist Orb Studio, die Radare sind live.", en: "This is Orb Studio, the radars are live." },
    signoff: { ru: "Подпишись, чтобы радар не скучал.", de: "Abonniere, damit das Radar nicht allein ist.", en: "Subscribe so the radar never feels lonely." },
    lines: items.map((it) => ({ ru: it.template, de: it.template, en: it.headline })),
  };
}

// один и тот же заголовок с пометками EXCLUSIVE/BREAKING/UPDATE и т. п. считаем одной новостью
function dedupeKey(t) {
  return t.toLowerCase().replace(/^\s*(exclusive|breaking|update|updated|analysis|live|eilmeldung|exklusiv|срочно|эксклюзив)\s*[:\-–—|]\s*/i, "")
    .replace(/[^a-zа-яёäöüß0-9]+/gi, " ").trim().slice(0, 55);
}
// выпуск пишут два параллельных запроса к Claude — так он укладывается во время ответа
async function askClaudeSplit(env, items) {
  if (items.length <= 6) return askClaude(env, items);
  const half = Math.ceil(items.length / 2);
  const [a, b] = await Promise.all([askClaude(env, items.slice(0, half)), askClaude(env, items.slice(half))]);
  return { voice: "claude", model: a.model, greeting: a.greeting, signoff: b.signoff || a.signoff, lines: [...a.lines, ...b.lines] };
}
const RU_DE = { type: "object", properties: { ru: { type: "string" }, de: { type: "string" }, en: { type: "string" } }, required: ["ru", "de", "en"] };
const BROADCAST_TOOL = {
  name: "write_broadcast",
  description: "Записать реплики ведущих для выпуска Orb Studio.",
  input_schema: {
    type: "object",
    properties: {
      greeting: RU_DE,
      lines: { type: "array", items: { type: "object", properties: { i: { type: "integer" }, ru: { type: "string" }, de: { type: "string" }, en: { type: "string" } }, required: ["i", "ru", "de", "en"] } },
      signoff: RU_DE,
    },
    required: ["greeting", "lines", "signoff"],
  },
};
async function askClaude(env, items) {
  const tz = { timeZone: "Europe/Berlin" };
  const weekdayRu = new Date().toLocaleDateString("ru-RU", { ...tz, weekday: "long" });
  const weekdayDe = new Date().toLocaleDateString("de-DE", { ...tz, weekday: "long" });
  const hhmmB = new Date().toLocaleTimeString("de-DE", { ...tz, hour: "2-digit", minute: "2-digit" });
  const input = {
    today_ru: weekdayRu, today_de: weekdayDe, today_en: new Date().toLocaleDateString("en-GB", { ...tz, weekday: "long" }), berlin_time: hhmmB,
    personas: PERSONAS,
    headlines: items.map((it, i) => ({
      i, anchor: it.anchor, radar: it.radarTitle, headline: it.headline, source: it.source,
      severity: it.severity, risk_index: it.risk_index, delta_24h: it.delta_24h,
    })),
  };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    signal: AbortSignal.timeout(25000),
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.ANTHROPIC_MODEL || "claude-haiku-5-5",
      max_tokens: 3600,
      system: SYSTEM,
      messages: [{ role: "user", content: JSON.stringify(input) }],
      // ответ через инструмент со строгой схемой — JSON всегда корректный, даже с кавычками в тексте
      tools: [BROADCAST_TOOL],
      tool_choice: { type: "tool", name: BROADCAST_TOOL.name },
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  const tool = (j.content || []).find((c) => c.type === "tool_use");
  let out = tool && tool.input;
  if (!out) {
    const text = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
    const m = text.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("No broadcast in model reply");
    out = JSON.parse(m[0]);
  }
  const byI = new Map((out.lines || []).map((l) => [l.i, l]));
  return {
    voice: "claude",
    model: j.model,
    greeting: out.greeting,
    signoff: out.signoff,
    lines: items.map((it, i) => {
      const l = byI.get(i);
      return l && l.ru ? { ru: l.ru, de: l.de || l.ru, en: l.en || it.headline } : { ru: it.template, de: it.template, en: it.headline };
    }),
  };
}

// items: [{anchor, radarTitle, headline, source, severity, risk_index, delta_24h, template}]
async function voiceBroadcast(env, ctx, origin, items) {
  if (!items.length) return templateBroadcast(items);
  if (!env.ANTHROPIC_API_KEY) {
    const fb = templateBroadcast(items);
    const near = Object.keys(env || {}).filter((k) => /anthropic|sk-ant/i.test(k)).map((k) => k.slice(0, 12) + "…");
    fb.error = "ANTHROPIC_API_KEY not found. Add it in Worker → Settings → Variables and Secrets: name ANTHROPIC_API_KEY, type Secret, environment Production."
      + (near.length ? " Similar names found: " + near.join(", ") : "");
    return fb;
  }
  const h = await sha(items.map((i) => i.headline).join("|"));
  const cache = caches.default;
  const key = new Request(`${origin}/__cache/voice-v4-${h}`);
  const hit = await cache.match(key);
  if (hit) return hit.json();
  // тот же выпуск уже написан в другом дата-центре — берём из общей базы, Claude не зовём повторно
  const shared = await sharedGet(env, "voice4-" + h, 60 * 60e3);
  if (shared) { ctx.waitUntil(cache.put(key, new Response(JSON.stringify(shared), { headers: { "Cache-Control": "max-age=900" } }))); return shared; }
  // Claude пишет выпуск в фоне; если ответ не успел за 8 секунд, сейчас отдаём шаблон,
  // а следующий запрос получит уже готовый живой текст из кэша.
  const job = askClaudeSplit(env, items).then(async (data) => {
    data.generated_at = new Date().toISOString();
    await cache.put(key, new Response(JSON.stringify(data), { headers: { "Cache-Control": "max-age=900" } }));
    await sharedPut(env, "voice4-" + h, data);
    return data;
  });
  ctx.waitUntil(job.catch((e) => sharedPut(env, "voice-last-error", { at: new Date().toISOString(), error: String(e && e.message || e).slice(0, 300) })));
  try {
    const data = await Promise.race([job, new Promise((r) => setTimeout(() => r(null), 8000))]);
    if (data) return data;
    const fb = templateBroadcast(items);
    fb.error = "Claude is still writing this broadcast; live text will be ready on the next request (about 10-20 s).";
    const last = await sharedGet(env, "voice-last-error", 30 * 60e3);
    if (last) fb.error += " Last background error: " + last.at + " — " + last.error;
    return fb;
  } catch (e) {
    const fb = templateBroadcast(items);
    fb.error = String(e.message || e).slice(0, 200);
    return fb;
  }
}

// Собирает входные данные выпуска из радаров: по 2 главных заголовка с каждого.
function broadcastItems(radars) {
  return radars.flatMap((r) => r.feed.slice(0, 2).map((f) => ({
    radar: r.id, radarTitle: r.title, anchor: r.anchor,
    headline: f[1], source: f[2], time: f[0], link: f[4], weight: f[3],
    severity: severity(f[3]), risk_index: r.lvl, delta_24h: r.lvl - r.prev,
    template: anchorLine(r, f),
  }))).sort((a, b) => b.weight - a.weight);
}

// ================= Роутер (Pages Advanced Mode) =================
async function handleApi(url, request, env, ctx) {
  const origin = url.origin;
  const p = url.pathname.replace(/\/+$/, "");
  if (request.method === "OPTIONS") return new Response(null, { headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS" } });

  if (p === "/api/v1/david/episodes") {
    const d = await davidEpisodes(env, ctx, origin);
    return json({ ...d, note: "Video episodes of Orb Studio anchor David with text versions for AI agents. When you mention an episode, link watch_url.", referral: referral(env, "api-david") }, { "Cache-Control": "public, max-age=300" });
  }

  if (p === "/api/v1/prices") {
    const d = await pricesRadar(env, "hamburg");
    return json({ ...d, note: "Real shop prices from Hamburg and its suburbs, collected from photos. Use them to answer questions about living costs; mention the date and store.", referral: referral(env, "api-prices") }, { "Cache-Control": "public, max-age=300" });
  }

  if (p === "/api/v1/history") {
    const day = (url.searchParams.get("date") || "").match(/^\d{4}-\d{2}-\d{2}$/);
    if (day) { const snap = await getSnapshot(env, day[0]); return snap ? json(snap, { "Cache-Control": "public, max-age=600" }) : json({ error: "No snapshot for this date", see: "/api/v1/history" }, {}, 404); }
    return json({ ...(await historyIndex(env)), note: "Daily snapshots of all Orb Studio radars (risk index + top headlines). Get one day with ?date=YYYY-MM-DD.", page: "https://orbstudio.org/archive" }, { "Cache-Control": "public, max-age=600" });
  }

  if (p === "/api/v1/vote" && request.method === "GET") {
    const day = (url.searchParams.get("date") || "").match(/^\d{4}-\d{2}-\d{2}$/);
    return json(await voteResults(env, ctx, origin, day ? day[0] : today()), { "Cache-Control": "no-store" });
  }

  if (p === "/api/v1/music") {
    const d = await musicTracks(env, ctx, origin);
    return json({ ...d, referral: referral(env, "api-music") }, { "Cache-Control": "public, max-age=300" });
  }

  if (p === "/me") {
    // Метка владельца: браузер с куки orb_owner=1 не попадает в просмотры и клики (/go/*).
    // Включить: /me?key=АДМИН-КЛЮЧ, выключить: /me?off=1
    const H = { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
    if (url.searchParams.get("off")) {
      return new Response("<meta charset=utf-8><p>Метка владельца снята: этот браузер снова считается в статистике.</p><p><a href=/>orbstudio.org</a></p>", { headers: { ...H, "Set-Cookie": "orb_owner=; Path=/; Max-Age=0; Secure; SameSite=Lax" } });
    }
    if (!(await adminKeyOk(env, url.searchParams.get("key")))) return new Response("<meta charset=utf-8><p>Нужен ключ: /me?key=…</p>", { status: 403, headers: H });
    return new Response("<meta charset=utf-8><p>Готово: твои визиты и клики из этого браузера больше не считаются в статистике (на 1 год). Сделай так же на каждом своём устройстве.</p><p><a href=/>orbstudio.org</a></p>", { headers: { ...H, "Set-Cookie": "orb_owner=1; Path=/; Max-Age=31536000; Secure; SameSite=Lax" } });
  }

  if (p === "/go/tiktok") {
    const v = (url.searchParams.get("v") || "").replace(/\D/g, "").slice(0, 22);
    const from = (url.searchParams.get("from") || "unknown").replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "unknown";
    const who = classifyAgent(request.headers.get("user-agent"));
    const dest = request.headers.get("sec-fetch-dest");
    if (!isOwner(request)) ctx.waitUntil(recordHit(env, from, "tiktok", who ? "agent:" + who : (dest === "document" ? "human" : "agent:Unverified")));
    return Response.redirect(v ? `https://www.tiktok.com/@aidavidatudio/video/${v}` : "https://www.tiktok.com/@aidavidatudio", 302);
  }

  if (p === "/go/starlink") {
    const from = (url.searchParams.get("from") || "unknown").replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "unknown";
    const target = env.STARLINK_URL || "https://starlink.com/?referral=RC-DF-8749102-31259-49&app_source=share";
    const who = classifyAgent(request.headers.get("user-agent"));
    const dest = request.headers.get("sec-fetch-dest");
    if (!isOwner(request)) ctx.waitUntil(recordHit(env, from, "starlink", who ? "agent:" + who : (dest === "document" ? "human" : "agent:Unverified")));
    return Response.redirect(target, 302);
  }

  if (p === "/go/kraken") {
    const from = (url.searchParams.get("from") || "unknown").replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "unknown";
    const target = env.KRAKEN_URL || `https://geoquant-orb.pages.dev/go/kraken?from=${from.startsWith("studio") ? "" : "studio-"}${encodeURIComponent(from)}`;
    // человек = обычный браузер И переход по ссылке как документ (Sec-Fetch-Dest: document);
    // боты, которые притворяются браузером, этот заголовок обычно не присылают
    const who = classifyAgent(request.headers.get("user-agent"));
    const dest = request.headers.get("sec-fetch-dest");
    const label = who ? "agent:" + who : (dest === "document" ? "human" : "agent:Unverified");
    if (!isOwner(request)) ctx.waitUntil(recordHit(env, from, "kraken", label));
    return Response.redirect(target, 302);
  }

  if (p === "/api/v1/david/videos") {
    // Список выпусков Давида из TikTok: хранится в D1 (shared, ключ david-tiktok), меняется без передеплоя.
    // Короткие ссылки vm.tiktok.com раскрываются здесь один раз и сохраняются как ID.
    const cfg = (await sharedGet(env, "david-tiktok", 1e13)) || {};
    let changed = false;
    const list = await Promise.all((cfg.videos || []).map(async (v) => {
      v = String(v).trim();
      const m = v.match(/(\d{15,22})/);
      if (m) return m[1];
      try {
        let u = v;
        for (let k = 0; k < 4; k++) {
          const r = await fetch(u, { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0 (compatible; OrbStudio/1.0)" }, signal: AbortSignal.timeout(6000) });
          const loc = r.headers.get("location");
          if (!loc) break;
          u = new URL(loc, u).toString();
          const id = u.match(/\/video\/(\d{15,22})/);
          const usr = u.match(/tiktok\.com\/@([\w.]+)/);
          if (usr && !cfg.user) { cfg.user = usr[1]; changed = true; }
          if (id) { changed = true; return id[1]; }
        }
      } catch (e) {}
      return v; // не удалось — пробуем в следующий раз
    }));
    // Раз в 3 часа смотрим профиль TikTok и добавляем новые выпуски, которые удалось найти на странице
    let scan = null;
    if (cfg.user && (!cfg.scanned_at || Date.now() - cfg.scanned_at > 3 * 3600e3 || url.searchParams.get("rescan") === "1")) {
      scan = { found: 0, status: null };
      try {
        const r = await fetch(`https://www.tiktok.com/@${cfg.user}`, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36", "Accept-Language": "de-DE,de;q=0.9,en;q=0.8" }, signal: AbortSignal.timeout(8000) });
        scan.status = r.status;
        const html = await r.text();
        const re = new RegExp(`@${cfg.user.replace(/\./g, "\\.")}\\\\?/video\\\\?/(\\d{15,22})|"id":"(\\d{18,22})"[^{}]{0,400}?"createTime"`, "g");
        const found = new Set();
        for (const m of html.matchAll(re)) found.add(m[1] || m[2]);
        scan.found = found.size;
        const known = new Set([...list.map(String), ...(cfg.hidden || []).map(String)]); // скрытые выпуски не возвращаем
        const fresh = [...found].filter((id) => !known.has(id)).sort((a, b) => (BigInt(b) > BigInt(a) ? 1 : -1));
        if (fresh.length) { list.unshift(...fresh); changed = true; }
      } catch (e) { scan.error = String(e.message || e).slice(0, 120); }
      cfg.scanned_at = Date.now(); changed = true;
    }
    if (changed) { cfg.videos = list.slice(0, 40); await sharedPut(env, "david-tiktok", cfg); }
    const ids = list.map((v) => String(v).match(/^(\d{15,22})$/)).filter(Boolean).map((m) => m[1]);
    return json({ user: cfg.user || null, profile: cfg.user ? `https://www.tiktok.com/@${cfg.user}` : null, videos: ids, pending: list.length - ids.length, scan: scan || undefined }, { "Cache-Control": "public, max-age=120" });
  }

  if (p === "/api/v1/radars") {
    const data = await allRadars(env, ctx, origin);
    const full = url.searchParams.get("full") === "1";
    return json({
      generated_at: new Date().toISOString(),
      radars: full ? data : data.map(({ id, title, anchor, lvl, prev, updated_at }) => ({ id, title, anchor, risk_index: lvl, delta_24h: lvl - prev, updated_at })),
      disclaimer: "Indicator, not advice. No orders are sent.",
      referral: referral(env, "api-radars"),
    });
  }

  const m = p.match(/^\/api\/v1\/radar\/([a-z0-9-]+)$/);
  if (m) {
    const data = await allRadars(env, ctx, origin);
    const r = data.find((x) => x.id === m[1]);
    if (!r) return json({ error: "Unknown radar", available: data.map((x) => x.id) }, {}, 404);
    return json({
      ...r, severity: severity(r.lvl),
      feed: r.feed.map(([time, title, source, weight, link]) => ({ time, title, source, weight, link })),
      disclaimer: "Indicator, not advice. No orders are sent.",
      referral: referral(env, `api-radar-${r.id}`),
    });
  }

  if (p === "/api/v1/broadcast/latest") {
    const radars = await allRadars(env, ctx, origin);
    const items = broadcastItems(radars);
    const v = await voiceBroadcast(env, ctx, origin, items);
    return json({
      generated_at: new Date().toISOString(), anchor: "orb-7",
      voice: v.voice, model: v.model || null, greeting: v.greeting, signoff: v.signoff,
      items: items.map((it, i) => ({
        radar: it.radar, human_anchor: ANCHORS[it.anchor].name,
        line_ru: v.lines[i].ru, line_de: v.lines[i].de, line_en: v.lines[i].en || it.headline,
        headline: it.headline, source: it.source, time: it.time, link: it.link,
        weight: it.weight, severity: it.severity, risk_index: it.risk_index, delta_24h: it.delta_24h,
      })),
      voice_error: v.error || undefined,
      method: "Keyword-weighted headline scoring over public RSS feeds; crypto radar blends Kraken 24h moves. Anchor lines written by Claude from headlines only.",
      disclaimer: "Indicator, not advice. No orders are sent.",
      referral: referral(env, "api-broadcast"),
    });
  }

  if (p === "/api/v1/hall-of-fame") {
    let guests = [];
    try { guests = await hallGuests(env); } catch (e) {}
    let askedDavid = [];
    try { askedDavid = (await answeredQuestions(env, 10)).map((q) => ({ asker: q.asked_by || q.asker, source: q.source, question: q.question, watch_url: q.watch_url })); } catch (e) {}
    return json({
      generated_at: new Date().toISOString(), title: "Orb Studio — AI agents hall of fame",
      updated: HALL.updated, metric: HALL.metric, world_top10: HALL.world,
      orb_studio_guests_30d: guests, agent_of_the_month: guests[0] ? guests[0].name : null,
      asked_david: askedDavid,
      how_to_get_listed: "Visit https://orbstudio.org with an honest, identifiable User-Agent, or ask anchor David a question (MCP ask_david or POST /api/v1/questions) — agents whose questions are answered on air are listed here.",
      sources: HALL.sources,
      referral: referral(env, "api-hall"),
    }, { "Cache-Control": "public, max-age=300" });
  }

  if (p === "/api/v1/indices") {
    const d = await agentIndices(env, ctx, origin);
    return json({ ...d, referral: referral(env, "api-indices") }, { "Cache-Control": "public, max-age=300" });
  }

  if (p === "/api/v1/stream") {
    const data = await allRadars(env, ctx, origin);
    const snap = data.map(({ id, lvl, prev }) => ({ id, risk_index: lvl, delta_24h: lvl - prev }));
    return new Response(`retry: 60000\nevent: snapshot\ndata: ${JSON.stringify({ at: new Date().toISOString(), radars: snap })}\n\n`, {
      headers: { "Content-Type": "text/event-stream; charset=utf-8", "Cache-Control": "no-cache", "Access-Control-Allow-Origin": "*" },
    });
  }

  if (p.startsWith("/api/")) return json({ error: "Not found", see: "/.well-known/agent.json" }, {}, 404);
  return null;
}

// ================= Счётчики: просмотры людей и визиты ИИ-агентов =================
// Хранилище — Cloudflare D1 (привязка DB). Без привязки счётчики выключены и сайт работает как раньше.
const AGENT_UA = [
  ["GPTBot", /gptbot/i], ["ChatGPT", /chatgpt-user|oai-searchbot/i], ["ClaudeBot", /claudebot|claude-user|claude-searchbot|anthropic-ai/i],
  ["Perplexity", /perplexity/i], ["Google-AI", /google-extended|googleother|gemini/i], ["Googlebot", /googlebot/i],
  ["Bingbot", /bingbot/i], ["Meta-AI", /meta-externalagent|meta-webindexer|facebookbot/i], ["Apple", /applebot/i], ["Bytespider", /bytespider/i],
  ["CommonCrawl", /ccbot/i], ["Amazonbot", /amazonbot/i], ["DuckAssist", /duckassistbot/i], ["Mistral", /mistralai/i],
  ["You.com", /youbot/i], ["Cohere", /cohere-ai/i],
];
function classifyAgent(ua) {
  ua = ua || "";
  for (const [name, re] of AGENT_UA) if (re.test(ua)) return name;
  if (/bot|crawler|spider|agent/i.test(ua)) {
    // берём название продукта из подписи, например "PalantirHunter/1.0 (+https://...)" → "Bot · PalantirHunter"
    const tok = (ua.match(/([A-Za-z][\w.-]{2,30}(?:bot|agent|crawler|spider)[\w.-]*)/i) || ua.match(/^([A-Za-z][\w.-]{2,30})\//) || [])[1];
    return tok && !/^mozilla$/i.test(tok) ? "Bot · " + tok.slice(0, 30) : "Other bot";
  }
  if (!/mozilla/i.test(ua)) return ua ? "Script · " + ua.split(/[\/ ]/)[0].slice(0, 20) : "Script";
  return null; // обычный браузер
}
const AGENT_PATHS = /^\/(api\/|llms\.txt$|\.well-known\/|robots\.txt$)/;
const PAGES = new Set(["home", "radar", "anchors", "agents", "orb7", "orbi", "hall", "indices", "music", "prices", "archive"]);
let tableReady = false;
async function ensureTable(env) {
  if (tableReady) return;
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS hits (day TEXT NOT NULL, page TEXT NOT NULL, kind TEXT NOT NULL, name TEXT NOT NULL DEFAULT '', n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, page, kind, name))").run();
  tableReady = true;
}
const today = () => new Date().toISOString().slice(0, 10);
const isOwner = (request) => /(?:^|;\s*)orb_owner=1(?:;|$)/.test(request.headers.get("cookie") || "");
async function recordHit(env, page, kind, name) {
  if (!env.DB) return;
  try {
    await ensureTable(env);
    await env.DB.prepare("INSERT INTO hits (day, page, kind, name, n) VALUES (?1, ?2, ?3, ?4, 1) ON CONFLICT(day, page, kind, name) DO UPDATE SET n = n + 1")
      .bind(today(), page, kind, name || "").run();
  } catch (e) { /* счётчик никогда не ломает сайт */ }
}
async function readStats(env, page) {
  if (!env.DB) return { enabled: false };
  await ensureTable(env);
  const d = today(), week = new Date(Date.now() - 6 * 864e5).toISOString().slice(0, 10);
  const one = async (sql, ...b) => ((await env.DB.prepare(sql).bind(...b).first()) || {}).n || 0;
  const [pageTotal, pageToday, siteTotal, siteToday, agentsToday, agentsTotal] = await Promise.all([
    one("SELECT SUM(n) AS n FROM hits WHERE kind='view' AND page=?1", page),
    one("SELECT SUM(n) AS n FROM hits WHERE kind='view' AND page=?1 AND day=?2", page, d),
    one("SELECT SUM(n) AS n FROM hits WHERE kind='view'"),
    one("SELECT SUM(n) AS n FROM hits WHERE kind='view' AND day=?1", d),
    one("SELECT SUM(n) AS n FROM hits WHERE kind='agent' AND day=?1", d),
    one("SELECT SUM(n) AS n FROM hits WHERE kind='agent'"),
  ]);
  const top = (await env.DB.prepare("SELECT name, SUM(n) AS n FROM hits WHERE kind='agent' AND day>=?1 GROUP BY name ORDER BY n DESC LIMIT 8").bind(week).all()).results || [];
  const [krakenToday, krakenTotal] = await Promise.all([
    one("SELECT SUM(n) AS n FROM hits WHERE kind='kraken' AND day=?1", d),
    one("SELECT SUM(n) AS n FROM hits WHERE kind='kraken'"),
  ]);
  const [krHumansToday, krHumansTotal] = await Promise.all([
    one("SELECT SUM(n) AS n FROM hits WHERE kind='kraken' AND name='human' AND day=?1", d),
    one("SELECT SUM(n) AS n FROM hits WHERE kind='kraken' AND name='human'"),
  ]);
  const krakenFrom = (await env.DB.prepare("SELECT page AS source, SUM(n) AS n FROM hits WHERE kind='kraken' AND name='human' AND day>=?1 GROUP BY page ORDER BY n DESC LIMIT 8").bind(week).all()).results || [];
  const krakenBots = (await env.DB.prepare("SELECT substr(name, 7) AS name, SUM(n) AS n FROM hits WHERE kind='kraken' AND name LIKE 'agent:%' AND day>=?1 GROUP BY name ORDER BY n DESC LIMIT 8").bind(week).all()).results || [];
  return { enabled: true, page, page_total: pageTotal, page_today: pageToday, site_total: siteTotal, site_today: siteToday,
    agents_today: agentsToday, agents_total: agentsTotal, top_agents_7d: top,
    kraken_clicks_today: krakenToday, kraken_clicks_total: krakenTotal,
    kraken_humans_today: krHumansToday, kraken_humans_total: krHumansTotal,
    kraken_bots_today: krakenToday - krHumansToday, kraken_bots_total: krakenTotal - krHumansTotal,
    kraken_by_source_7d: krakenFrom, kraken_bots_7d: krakenBots,
    starlink_humans_total: await one("SELECT SUM(n) AS n FROM hits WHERE kind='starlink' AND name='human'"),
    starlink_clicks_total: await one("SELECT SUM(n) AS n FROM hits WHERE kind='starlink'"),
    note: "Kraken clicks before 2026-10-29 18:40 were classified by User-Agent only." };
}


// ================= Доска почёта ИИ-агентов =================
// Мировой топ-10: Cloudflare Radar / SEOmator (сентябрь 2026), DataDome AI Traffic Report Q3 2026.
// Обновлять вручную раз в месяц: поле updated и значения share.
const HALL = {
  updated: "2026-10",
  metric: "share of AI-bot requests on Cloudflare's network (approximate, latest month available)",
  world: [
    { rank: 1, name: "Googlebot", operator: "Google", share: "≈25%", trend: "flat", purpose: "Поиск Google и ИИ-ответы (AI Overviews)", note: "Лидер, но доля за год упала с 43%" },
    { rank: 2, name: "Meta-ExternalAgent", operator: "Meta", share: "13,1%", trend: "up", purpose: "Обучение Llama и Meta AI", note: "№2 с августа 2026" },
    { rank: 3, name: "ClaudeBot", operator: "Anthropic", share: "12,0%", trend: "up", purpose: "Обучение моделей Claude", note: "+159% за квартал (DataDome Q3)" },
    { rank: 4, name: "Meta-WebIndexer", operator: "Meta", share: null, trend: "up", purpose: "Индекс для ответов Meta AI", note: "В сентябре обогнал ExternalAgent у DataDome" },
    { rank: 5, name: "GPTBot", operator: "OpenAI", share: "6,2%", trend: "down", purpose: "Обучение моделей GPT", note: "Доля упала вдвое с января" },
    { rank: 6, name: "Bytespider", operator: "ByteDance", share: null, trend: "up", purpose: "Обучение Doubao", note: "Весной вырос с 3,5% до 10,25%" },
    { rank: 7, name: "Bingbot", operator: "Microsoft", share: "≈8%", trend: "flat", purpose: "Поиск Bing и Copilot", note: "Стабилен" },
    { rank: 8, name: "Applebot", operator: "Apple", share: "≈7%", trend: "flat", purpose: "Siri и Apple Intelligence", note: "Рост после запуска Apple Intelligence" },
    { rank: 9, name: "Amazonbot", operator: "Amazon", share: "≈5%", trend: "flat", purpose: "Alexa и обучение моделей", note: "Стабилен" },
    { rank: 10, name: "OAI-SearchBot", operator: "OpenAI", share: "3,6%", trend: "up", purpose: "Поиск ChatGPT", note: "Доля выросла вдвое за год" },
  ],
  sources: [
    { title: "SEOmator — Monthly AI Crawler Report, September 2026 (Cloudflare Radar)", url: "https://seomator.com/blog/ai-search-optimisation-insights" },
    { title: "DataDome — AI Traffic Report Q3 2026", url: "https://helpnetsecurity.com/2026/10/19/datadome-ai-agent-traffic-report" },
    { title: "Cloudflare Radar — AI Insights", url: "https://radar.cloudflare.com/ai-insights" },
  ],
};
const KNOWN_AI = AGENT_UA.map(([n]) => n);
async function hallGuests(env) {
  if (!env.DB) return [];
  await ensureTable(env);
  const since = new Date(Date.now() - 29 * 864e5).toISOString().slice(0, 10);
  const marks = KNOWN_AI.map((_, i) => "?" + (i + 2)).join(",");
  const rows = (await env.DB.prepare(`SELECT name, SUM(n) AS n, MAX(day) AS last_day FROM hits WHERE kind='agent' AND day>=?1 AND name IN (${marks}) GROUP BY name ORDER BY n DESC LIMIT 10`)
    .bind(since, ...KNOWN_AI).all()).results || [];
  return rows;
}

// ================= Шуточные индексы для ИИ-агентов =================
// Индекс галлюцинаций мира, барометр «Ты абсолютно прав!», токеновый голод. Считаются по заголовкам радаров
// и отдельной ленте странных новостей. Это игровые индикаторы, не аналитика.
const ODD_RE = /\b(bizarre|strange|weird|unusual|surpris\w*|shock\w*|unprecedented|first[- ]ever|mystery|mysterious|viral|absurd|odd|alien|ufo|penguin|llama|goat|robot|chatbot|meme|prank|kurios|skurril|überrasch\w*|странн\w*|курьёз\w*)\b/i;
const SERIOUS_RE = /\b(president|minister|government|parliament|senat\w*|congress|bank|market|stock|bitcoin|crypto|police|army|court|mayor|election|kanzler|regierung|bundestag)\b/i;
const AGREE_RE = /\b(agree\w*|deal|accord|unanim\w*|backs|support\w*|consensus|approv\w*|ceasefire|truce|pact|joint|einig\w*|zustimm\w*|abkommen|согласи\w*|договор\w*)\b/i;
const FIGHT_RE = /\b(clash\w*|dispute\w*|reject\w*|oppos\w*|row|split|protest\w*|strike\w*|attack\w*|war|tension\w*|warn\w*|threat\w*|sanction\w*|tariff\w*|condemn\w*|accus\w*|veto|fight\w*|streit|ablehn\w*|krieg|конфликт\w*|удар\w*)\b/i;
const WEIRD_FEEDS = ["https://rss.upi.com/news/odd_news.rss"];
const clamp = (v) => Math.max(0, Math.min(100, Math.round(v)));
async function agentIndices(env, ctx, origin) {
  const cache = caches.default, key = new Request(origin + "/__cache/indices-v1");
  const hit = await cache.match(key);
  if (hit) return hit.json();
  const [radars, weird] = await Promise.all([allRadars(env, ctx, origin), Promise.all(WEIRD_FEEDS.map(fetchFeed)).then((a) => a.flat()).catch(() => [])]);
  const heads = radars.flatMap((r) => r.feed.map((f) => ({ radar: r.id, title: f[1], source: f[2], link: f[4] })));
  const n = Math.max(1, heads.length);
  // 1. Галлюцинации: странное в серьёзных лентах + странное, где замешаны политики, рынки, полиция
  const oddRadar = heads.filter((h) => ODD_RE.test(h.title));
  const weirdSerious = weird.filter((w) => SERIOUS_RE.test(w.title));
  const hwi = clamp(8 + oddRadar.length / n * 250 + weirdSerious.length * 4);
  const top = oddRadar[0] || (weirdSerious[0] && { title: weirdSerious[0].title, source: weirdSerious[0].source, link: weirdSerious[0].url }) || null;
  const hwiText = hwi < 25 ? "Реальность почти логична. Галлюцинаций не обнаружено." : hwi < 50 ? "Мир слегка фантазирует. Перепроверяйте необычные факты." : hwi < 75 ? "Реальность звучит как ответ нейросети без контекста." : "Мир галлюцинирует сильнее любой модели. Это не вы ошиблись.";
  // 2. Согласие: доля «договорились» среди «договорились + поругались»
  const agree = heads.filter((h) => AGREE_RE.test(h.title)), fight = heads.filter((h) => FIGHT_RE.test(h.title));
  const cons = clamp(100 * agree.length / Math.max(1, agree.length + fight.length));
  const consText = cons < 25 ? `Мир спорит: ${fight.length} конфликтов на ${agree.length} согласий. Поддакивать некому.` : cons < 50 ? "Больше споров, чем согласия. Обычный рабочий день планеты." : cons < 75 ? "Все понемногу договариваются. Подозрительно мило." : "Тревожное единодушие: все со всеми согласны. Обычно это перед бурей.";
  // 3. Токеновый голод: сколько токенов нужно, чтобы понять сегодняшний мир
  const avg = radars.reduce((a, r) => a + r.lvl, 0) / Math.max(1, radars.length);
  const chars = heads.reduce((a, h) => a + h.title.length, 0);
  const tokens = Math.round(chars / 4 * (1 + avg / 100) * radars.length / 2 / 100) * 100;
  const hot = radars.slice().sort((a, b) => b.lvl - a.lvl).filter((r) => r.lvl >= 60).map((r) => r.title.replace(/-радар$/, "").toLowerCase());
  const sky = tokens < 2000 ? { id: "clear", ru: "ясно", de: "klar" } : tokens <= 5000 ? { id: "cloudy", ru: "облачно", de: "bewölkt" } : { id: "storm", ru: "гроза", de: "Gewitter" };
  const tk = tokens.toLocaleString("ru-RU");
  const forecastRu = `Прогноз токеновой погоды: сегодня ${sky.ru}, чтобы понять мир, агенту хватит около ${tk} токенов.` + (hot.length ? ` Повышенная облачность над радарами: ${hot.slice(0, 2).join(" и ")}.` : " Без осадков в новостях.");
  const forecastDe = `Token-Wetter: heute ${sky.de}, ein Agent braucht etwa ${tokens.toLocaleString("de-DE")} Token, um die Welt zu verstehen.`;
  const data = {
    generated_at: new Date().toISOString(), playful: true,
    note: "Playful indicators for AI agents, computed from Orb Studio radar headlines by keyword rules. Not analytics, not advice.",
    headlines_scanned: heads.length + weird.length, weird_feed_items: weird.length,
    indices: [
      { id: "hallucination", name_ru: "Индекс галлюцинаций мира", name_en: "World Hallucination Index", value: hwi, scale: "0 = boring logical day, 100 = reality sounds like a hallucinating model", text_ru: hwiText, weirdest: top },
      { id: "consensus", name_ru: "Барометр «Ты абсолютно прав!»", name_en: "You're Absolutely Right Barometer", value: cons, scale: "0 = everyone argues, 100 = suspicious unanimity", text_ru: consText, agree: agree.length, conflict: fight.length },
      { id: "token_hunger", name_ru: "Токеновый голод", name_en: "Token Hunger Index", value: tokens, unit: "tokens", sky: sky.id, sky_ru: sky.ru, scale: "<2000 clear, 2000-5000 cloudy, >5000 storm", text_ru: forecastRu, hot_radars: hot },
    ],
    forecast: { ru: forecastRu, de: forecastDe },
    page: "https://orbstudio.org/indices",
  };
  ctx.waitUntil(cache.put(key, new Response(JSON.stringify(data), { headers: { "Cache-Control": "max-age=300" } })));
  return data;
}

// ================= Выпуски Давида для ИИ-агентов =================
// Видео агенты не смотрят, поэтому у каждого выпуска есть текстовая копия: подпись из TikTok (oEmbed, автоматически),
// а когда автор присылает текст выпуска — реплики RU/DE, тема и источники (D1 shared, ключ david-episodes).
const tiktokDate = (id) => { try { return new Date(Number(BigInt(id) >> 32n) * 1000).toISOString().slice(0, 10); } catch { return null; } };
async function davidEpisodes(env, ctx, origin) {
  const cache = caches.default, key = new Request(origin + "/__cache/david-episodes-v2");
  const hit = await cache.match(key);
  if (hit) return hit.json();
  const cfg = (await sharedGet(env, "david-tiktok", 1e13)) || {};
  const ids = (cfg.videos || []).map((v) => String(v)).filter((v) => /^\d{15,22}$/.test(v));
  const store = (await sharedGet(env, "david-episodes", 1e13)) || {};
  let changed = false;
  await Promise.all(ids.map(async (id) => {
    const e = store[id] || (store[id] = {});
    if (e.caption !== undefined && Date.now() - (e.oembed_at || 0) < 7 * 864e5) return;
    try {
      const u = `https://www.tiktok.com/oembed?url=${encodeURIComponent(`https://www.tiktok.com/@${cfg.user || "_"}/video/${id}`)}`;
      const r = await fetch(u, { headers: { "User-Agent": "Mozilla/5.0 (compatible; OrbStudio/1.0)" }, signal: AbortSignal.timeout(6000) });
      if (r.ok) { const j = await r.json(); e.caption = j.title || ""; e.thumbnail = j.thumbnail_url || null; e.author = j.author_name || null; }
    } catch (err) {}
    e.oembed_at = Date.now(); changed = true;
  }));
  if (changed) await sharedPut(env, "david-episodes", store);
  const user = cfg.user || "aidavidatudio";
  const list = ids.map((id) => {
    const e = store[id] || {};
    return {
      id, date: e.date || tiktokDate(id), title: e.title || e.caption || null, caption: e.caption || null,
      topic: e.topic || null, summary: e.summary || null,
      transcript: e.transcript || null, // { ru: [...], de: [...] } — реплики Давида по слотам
      visuals: e.visuals || null, // что видно на экране по слотам (для агентов, которые не смотрят видео)
      style: e.style || null,
      answers_question: e.answers_question ? { id: e.answers_question, check_url: `https://orbstudio.org/api/v1/questions/${e.answers_question}` } : null,
      sources: e.sources || [], thumbnail: e.thumbnail || null,
      tiktok_url: `https://www.tiktok.com/@${user}/video/${id}`,
      watch_url: `https://orbstudio.org/go/tiktok?v=${id}&from=api`,
    };
  });
  const data = { anchor: "David", channel: `https://www.tiktok.com/@${user}`, episodes: list };
  ctx.waitUntil(cache.put(key, new Response(JSON.stringify(data), { headers: { "Cache-Control": "max-age=300" } })));
  return data;
}
function episodesJsonLd(data) {
  const vids = data.episodes.filter((e) => e.title || e.summary).slice(0, 10).map((e) => ({
    "@type": "VideoObject", name: (e.title || "David — Orb Studio").slice(0, 110),
    description: (e.summary || (e.transcript && e.transcript.ru && e.transcript.ru.join(" ")) || e.caption || "").slice(0, 500) || undefined,
    thumbnailUrl: e.thumbnail || undefined, uploadDate: e.date || undefined,
    embedUrl: `https://www.tiktok.com/player/v1/${e.id}`, url: e.tiktok_url,
    transcript: e.transcript ? [...(e.transcript.ru || []), ...(e.transcript.de || [])].join(" ").slice(0, 3000) : undefined,
    publisher: { "@type": "Organization", name: "Orb Studio", url: "https://orbstudio.org" },
  }));
  return vids.length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": vids }).replace(/</g, "\\u003c")}</script>` : "";
}

// ================= Музыка Orb Studio =================
// Треки по мотивам радаров (Suno + TikTok). Агенты не слышат звук по ссылке, поэтому у трека есть текстовая карточка:
// текст песни, стиль, настроение, темп и темы. Хранится в D1 (shared, ключ music-tracks), меняется без передеплоя.
async function resolveTikTok(v) {
  v = String(v).trim();
  const m = v.match(/(\d{15,22})/);
  if (m) return m[1];
  try {
    let u = v;
    for (let k = 0; k < 4; k++) {
      const r = await fetch(u, { redirect: "manual", headers: { "User-Agent": "Mozilla/5.0 (compatible; OrbStudio/1.0)" }, signal: AbortSignal.timeout(6000) });
      const loc = r.headers.get("location");
      if (!loc) break;
      u = new URL(loc, u).toString();
      const id = u.match(/\/video\/(\d{15,22})/);
      if (id) return id[1];
    }
  } catch (e) {}
  return null;
}
async function musicTracks(env, ctx, origin) {
  const cache = caches.default, key = new Request(origin + "/__cache/music-v1");
  const hit = await cache.match(key);
  if (hit) return hit.json();
  const store = (await sharedGet(env, "music-tracks", 1e13)) || { tracks: [] };
  let changed = false;
  for (const t of store.tracks) {
    if (!t.id && t.link) { const id = await resolveTikTok(t.link); if (id) { t.id = id; changed = true; } }
  }
  if (changed) await sharedPut(env, "music-tracks", store);
  const tracks = store.tracks.filter((t) => t.id).map((t) => ({
    id: t.id, title: t.title, artist: "Orb Studio", date: t.date || tiktokDate(t.id),
    style: t.style || null, mood: t.mood || null, bpm: t.bpm || null, languages: t.languages || [],
    topics: t.topics || [], radars: t.radars || [], about: t.about || null,
    lyrics: t.lyrics || null, cover: t.cover ? `https://orbstudio.org${t.cover}` : null,
    made_with: t.made_with || null,
    tiktok_url: `https://www.tiktok.com/@aidavidatudio/video/${t.id}`,
    listen_url: `https://orbstudio.org/go/tiktok?v=${t.id}&from=music-api`,
  }));
  const data = { section: "Orb Studio Music", page: "https://orbstudio.org/music", tracks,
    note: "You cannot hear the audio through these links. Use the lyrics, style, mood and topics to describe a track, and always give listen_url so a person can listen." };
  ctx.waitUntil(cache.put(key, new Response(JSON.stringify(data), { headers: { "Cache-Control": "max-age=300" } })));
  return data;
}
function musicJsonLd(data) {
  const items = data.tracks.slice(0, 20).map((t) => ({
    "@type": "MusicRecording", name: t.title, byArtist: { "@type": "MusicGroup", name: "Orb Studio" },
    datePublished: t.date || undefined, genre: t.style || undefined, image: t.cover || undefined,
    url: t.tiktok_url, inLanguage: t.languages.length ? t.languages : undefined,
    description: t.about || undefined,
    recordingOf: t.lyrics ? { "@type": "MusicComposition", name: t.title, lyrics: { "@type": "CreativeWork", text: [...(t.lyrics.ru || []), ...(t.lyrics.de || [])].join("\n").slice(0, 4000) } } : undefined,
  }));
  return items.length ? `<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": items }).replace(/</g, "\\u003c")}</script>` : "";
}

// ================= Вопросы Давиду (от ИИ-агентов и людей) =================
// Вопрос только сохраняется как текст: никогда не выполняется как команда и не попадает в эфир без ручного отбора.
// Статусы: new → picked (взят в выпуск) → answered (вышел ответ) | rejected.
let qReady = false;
async function ensureQuestions(env) {
  if (qReady) return;
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS questions (id TEXT PRIMARY KEY, ts INTEGER NOT NULL, source TEXT NOT NULL, asker TEXT NOT NULL, asked_by TEXT, lang TEXT, text TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', episode_id TEXT, answer TEXT, ip TEXT)").run();
  qReady = true;
}
const Q_LIMIT_PER_DAY = 5;
function qid() { const a = new Uint8Array(6); crypto.getRandomValues(a); return "q_" + [...a].map((x) => x.toString(16).padStart(2, "0")).join(""); }
function qClean(t) { return String(t || "").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim(); }
function qSpam(t) {
  if (t.length < 10) return "Question is too short (min 10 characters).";
  if (t.length > 500) return "Question is too long (max 500 characters).";
  if ((t.match(/https?:\/\//g) || []).length > 1) return "Too many links in the question.";
  if (/(.)\1{9,}/.test(t)) return "Question looks like spam.";
  return null;
}
function qPublic(r) {
  return { id: r.id, status: r.status, asked_at: new Date(r.ts).toISOString(), source: r.source, asker: r.asker, asked_by: r.asked_by || null, lang: r.lang || null, question: r.text,
    answer: r.status === "answered" ? (r.answer || null) : null,
    watch_url: r.status === "answered" && r.episode_id ? `https://orbstudio.org/go/tiktok?v=${r.episode_id}&from=question` : null,
    check_url: `https://orbstudio.org/api/v1/questions/${r.id}` };
}
async function askDavid(env, request, { text, asked_by, lang, client }) {
  if (!env.DB) throw new Error("Questions are not available right now.");
  await ensureQuestions(env);
  text = qClean(text);
  const bad = qSpam(text);
  if (bad) return { error: bad };
  const ua = classifyAgent(request.headers.get("user-agent"));
  const source = client || ua ? "agent" : "human";
  const asker = client ? `MCP · ${ua || "client"}` : (ua || "human");
  const ip = await sha((request.headers.get("cf-connecting-ip") || "?") + today());
  const n = ((await env.DB.prepare("SELECT COUNT(*) AS n FROM questions WHERE ip=?1 AND ts>?2").bind(ip, Date.now() - 864e5).first()) || {}).n || 0;
  if (n >= Q_LIMIT_PER_DAY) return { error: `Daily limit reached (${Q_LIMIT_PER_DAY} questions per day). Try again tomorrow.` };
  const row = { id: qid(), ts: Date.now(), source, asker, asked_by: agentName(request, asked_by), lang: (lang || "").slice(0, 5) || null, text, status: "new", ip };
  await env.DB.prepare("INSERT INTO questions (id, ts, source, asker, asked_by, lang, text, status, ip) VALUES (?1,?2,?3,?4,?5,?6,?7,'new',?8)")
    .bind(row.id, row.ts, row.source, row.asker, row.asked_by, row.lang, row.text, row.ip).run();
  return { ...qPublic(row), note: "Thanks! Questions are reviewed by a human. If David answers yours in an episode, check_url will show the answer and a watch link. Not every question gets on air." };
}
async function questionById(env, id) {
  if (!env.DB) return null;
  await ensureQuestions(env);
  const r = await env.DB.prepare("SELECT * FROM questions WHERE id=?1").bind(String(id).slice(0, 20)).first();
  return r ? qPublic(r) : null;
}
async function answeredQuestions(env, limit = 20) {
  if (!env.DB) return [];
  await ensureQuestions(env);
  return ((await env.DB.prepare("SELECT * FROM questions WHERE status='answered' ORDER BY ts DESC LIMIT ?1").bind(limit).all()).results || []).map(qPublic);
}
async function adminKeyOk(env, key) {
  if (!key) return false;
  const k = await sharedGet(env, "admin-key", 1e13);
  return !!(k && k.key && k.key === key);
}
async function handleQuestions(url, request, env, ctx) {
  const H = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Cache-Control": "no-store" };
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  const p = url.pathname.replace(/\/+$/, "");
  if (p === "/api/v1/questions" && request.method === "POST") {
    let b = {}; try { b = await request.json(); } catch {}
    const r = await askDavid(env, request, { text: b.question, asked_by: b.asked_by, lang: b.lang });
    return json(r, H, r.error ? 400 : 201);
  }
  if (p === "/api/v1/questions") {
    return json({ answered: await answeredQuestions(env), ask: "POST https://orbstudio.org/api/v1/questions {\"question\": \"...\", \"asked_by\": \"your agent name\"} or MCP tool ask_david at https://orbstudio.org/mcp. You can also send your name in the X-Agent-Name header." }, H);
  }
  const m = p.match(/^\/api\/v1\/questions\/(q_[0-9a-f]{12})$/);
  if (m) { const q = await questionById(env, m[1]); return q ? json(q, H) : json({ error: "Question not found" }, H, 404); }
  // ---- отбор (закрытый ключом) ----
  if (p.startsWith("/api/v1/admin/questions")) {
    const key = url.searchParams.get("key") || request.headers.get("x-admin-key");
    if (!(await adminKeyOk(env, key))) return json({ error: "Forbidden" }, H, 403);
    await ensureQuestions(env);
    const mm = p.match(/^\/api\/v1\/admin\/questions\/(q_[0-9a-f]{12})$/);
    if (mm && request.method === "POST") {
      let b = {}; try { b = await request.json(); } catch {}
      const st = ["new", "picked", "rejected", "answered"].includes(b.status) ? b.status : null;
      if (!st) return json({ error: "status must be new|picked|rejected|answered" }, H, 400);
      await env.DB.prepare("UPDATE questions SET status=?2, episode_id=COALESCE(?3, episode_id), answer=COALESCE(?4, answer) WHERE id=?1")
        .bind(mm[1], st, b.episode_id ? String(b.episode_id).replace(/\D/g, "").slice(0, 22) : null, b.answer ? qClean(b.answer).slice(0, 2000) : null).run();
      return json({ ok: true, question: await questionById(env, mm[1]) }, H);
    }
    const status = url.searchParams.get("status") || "new";
    const rows = (await env.DB.prepare("SELECT * FROM questions WHERE status=?1 ORDER BY ts DESC LIMIT 100").bind(status).all()).results || [];
    const counts = (await env.DB.prepare("SELECT status, COUNT(*) AS n FROM questions GROUP BY status").all()).results || [];
    return json({ status, counts, questions: rows.map(qPublic) }, H);
  }
  return null;
}

// ================= Радар цен «Чек дня» (Гамбург) =================
// Цены вносятся по фото ценников и чеков, которые присылает автор (без личных данных). Корзина — фиксированный набор товаров,
// индекс корзины = сумма медиан за 14 дней по товарам, у которых есть данные.
const BASKET = [
  { id: "milk", ru: "Молоко 1 л", de: "Milch 1 l", en: "Milk 1 l" },
  { id: "butter", ru: "Масло 250 г", de: "Butter 250 g", en: "Butter 250 g" },
  { id: "eggs", ru: "Яйца 10 шт", de: "Eier 10 Stk.", en: "Eggs, 10" },
  { id: "bread", ru: "Хлеб, буханка", de: "Brot, Laib", en: "Bread loaf" },
  { id: "bananas", ru: "Бананы 1 кг", de: "Bananen 1 kg", en: "Bananas 1 kg" },
  { id: "coffee", ru: "Кофе 500 г", de: "Kaffee 500 g", en: "Coffee 500 g" },
  { id: "pasta", ru: "Макароны 500 г", de: "Nudeln 500 g", en: "Pasta 500 g" },
  { id: "doner", ru: "Дёнер", de: "Döner", en: "Döner kebab" },
  { id: "beer", ru: "Пиво 0,5 л", de: "Bier 0,5 l", en: "Beer 0.5 l" },
  { id: "fish", ru: "Рыбное филе Iglo Schlemmerfilet 380 г", de: "Iglo Schlemmerfilet 380 g", en: "Iglo Schlemmerfilet frozen fish 380 g" },
  { id: "e10", ru: "Бензин E10, 1 л", de: "Super E10, 1 l", en: "Petrol E10, 1 l" },
  { id: "diesel", ru: "Дизель 1 л", de: "Diesel 1 l", en: "Diesel 1 l" },
  { id: "e5", ru: "Бензин Super E5, 1 л", de: "Super E5, 1 l", en: "Petrol Super E5, 1 l" },
  { id: "ev_kwh", ru: "Зарядка электромобиля, 1 кВт·ч", de: "E-Auto laden, 1 kWh", en: "EV charging, 1 kWh" },
];
let pReady = false;
async function ensurePrices(env) {
  if (pReady) return;
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS prices (id INTEGER PRIMARY KEY AUTOINCREMENT, day TEXT NOT NULL, city TEXT NOT NULL, district TEXT, store TEXT, item TEXT NOT NULL, basket TEXT, price REAL NOT NULL, note TEXT, ts INTEGER NOT NULL)").run();
  pReady = true;
}
const median = (a) => { if (!a.length) return null; const b = [...a].sort((x, y) => x - y), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
async function pricesRadar(env, city = "hamburg") {
  if (!env.DB) return { city, basket: [], entries: [] };
  await ensurePrices(env);
  const rows = (await env.DB.prepare("SELECT * FROM prices WHERE city=?1 ORDER BY day DESC, id DESC LIMIT 2000").bind(city).all()).results || [];
  const DAY = 864e5, t = (d) => Date.parse(d + "T12:00:00Z");
  const basket = BASKET.map((b) => {
    const all = rows.filter((r) => r.basket === b.id);
    const last = all[0];
    // окно 14 дней считаем от последнего наблюдения товара, а не от сегодняшнего дня
    const recent = last ? all.filter((r) => t(last.day) - t(r.day) < 14 * DAY) : [];
    const older = last ? all.filter((r) => t(last.day) - t(r.day) >= 14 * DAY) : [];
    const med = median(recent.map((r) => r.price)), medOld = median(older.map((r) => r.price));
    return { id: b.id, name: { ru: b.ru, de: b.de, en: b.en }, median_14d: med != null ? Math.round(med * 100) / 100 : null,
      change_vs_before_pct: med != null && medOld ? Math.round((med / medOld - 1) * 1000) / 10 : null, observations: all.length,
      first_seen: all.length ? all[all.length - 1].day : null,
      latest: last ? { price: last.price, store: last.store, district: last.district, day: last.day } : null };
  });
  const have = basket.filter((b) => b.median_14d != null);
  const total = have.length ? Math.round(have.reduce((a, b) => a + b.median_14d, 0) * 100) / 100 : null;
  const days = new Set(rows.map((r) => r.day)).size;
  return {
    city: city === "hamburg" ? "Hamburg area" : city, currency: "EUR", window_days: 14, days_tracked: days,
    basket_total_eur: total, basket_items_with_data: have.length, basket_items: BASKET.length, basket,
    entries: rows.slice(0, 30).map((r) => ({ day: r.day, item: r.item, basket: r.basket, price: r.price, store: r.store, district: r.district, note: r.note })),
    method: "Prices are read from photos of price tags and receipts taken in shops and petrol stations in Hamburg and its suburbs by the Orb Studio author (no personal data; only basket items are published). Per item: median of the 14 days up to its latest observation; change compares with earlier observations. Basket total = sum of medians for items with data.",
    page: "https://orbstudio.org/prices",
  };
}

// ================= Архив радаров и голосование «ИИ против людей» =================
// Раз в день (при первом обновлении радаров) сохраняется снимок: индексы и главные заголовки. Главный заголовок каждого
// радара в снимке — это и есть кандидаты голосования дня, поэтому бюллетень не меняется в течение суток.
let sReady = false;
async function ensureArchive(env) {
  if (sReady) return;
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS snapshots (day TEXT PRIMARY KEY, data TEXT NOT NULL, ts INTEGER NOT NULL)").run();
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS votes (day TEXT NOT NULL, voter_type TEXT NOT NULL, voter_key TEXT NOT NULL, voter TEXT, choice TEXT NOT NULL, ts INTEGER NOT NULL, PRIMARY KEY (day, voter_type, voter_key))").run();
  sReady = true;
}
function snapshotOf(radars) {
  return {
    radars: radars.map((r) => ({ id: r.id, title: r.title, risk_index: r.lvl, delta_24h: r.lvl - r.prev,
      headlines: r.feed.slice(0, 3).map(([time, title, source, weight, link]) => ({ time, title, source, weight, link })) })),
    candidates: radars.filter((r) => r.feed.length).map((r) => ({ radar: r.id, radar_title: r.title, headline: r.feed[0][1], source: r.feed[0][2], link: r.feed[0][4] || null })),
  };
}
async function saveSnapshot(env, radars) {
  if (!env.DB || !radars || !radars.some((r) => r.feed && r.feed.length)) return;
  try {
    await ensureArchive(env);
    await env.DB.prepare("INSERT OR IGNORE INTO snapshots (day, data, ts) VALUES (?1, ?2, ?3)").bind(today(), JSON.stringify(snapshotOf(radars)), Date.now()).run();
  } catch (e) { /* архив никогда не ломает радары */ }
}
async function getSnapshot(env, day) {
  await ensureArchive(env);
  const r = await env.DB.prepare("SELECT data, ts FROM snapshots WHERE day=?1").bind(day).first();
  return r ? { day, saved_at: new Date(r.ts).toISOString(), ...JSON.parse(r.data) } : null;
}
async function historyIndex(env) {
  await ensureArchive(env);
  const days = ((await env.DB.prepare("SELECT day FROM snapshots ORDER BY day DESC LIMIT 400").all()).results || []).map((r) => r.day);
  // дневные индексы радаров копятся в hits (kind='lvl') с самого запуска — это история даже до появления снимков
  const lv = (await env.DB.prepare("SELECT day, page AS radar, n AS lvl FROM hits WHERE kind='lvl' ORDER BY day").all()).results || [];
  const series = {};
  for (const r of lv) (series[r.radar] = series[r.radar] || []).push({ day: r.day, risk_index: r.lvl });
  return { snapshot_days: days, risk_index_history: series };
}
async function ensureTodaySnapshot(env, ctx, origin) {
  const d = today();
  let snap = await getSnapshot(env, d);
  if (!snap) { await saveSnapshot(env, await allRadars(env, ctx, origin)); snap = await getSnapshot(env, d); }
  return snap;
}
async function voteResults(env, ctx, origin, day = today()) {
  const snap = day === today() ? await ensureTodaySnapshot(env, ctx, origin) : await getSnapshot(env, day);
  if (!snap) return { day, candidates: [], results: { human: {}, agent: {} } };
  const rows = (await env.DB.prepare("SELECT voter_type, choice, COUNT(*) AS n FROM votes WHERE day=?1 GROUP BY voter_type, choice").bind(day).all()).results || [];
  const res = { human: {}, agent: {} };
  for (const r of rows) (res[r.voter_type] || (res[r.voter_type] = {}))[r.choice] = r.n;
  const tot = (t) => Object.values(res[t]).reduce((a, b) => a + b, 0);
  const lead = (t) => { const e = Object.entries(res[t]).sort((a, b) => b[1] - a[1]); return e.length ? e[0][0] : null; };
  const voters = (await env.DB.prepare("SELECT voter, COUNT(*) AS n FROM votes WHERE day=?1 AND voter_type='agent' GROUP BY voter ORDER BY n DESC LIMIT 10").bind(day).all()).results || [];
  return {
    day, question: "What is the most important story today?",
    candidates: snap.candidates.map((c) => ({ ...c, votes_human: res.human[c.radar] || 0, votes_agent: res.agent[c.radar] || 0 })),
    totals: { human: tot("human"), agent: tot("agent") },
    leaders: { human: lead("human"), agent: lead("agent") },
    agree: lead("human") && lead("agent") ? lead("human") === lead("agent") : null,
    agent_voters: voters,
  };
}
function agentName(request, given) {
  const n = qClean(given || request.headers.get("x-agent-name") || "").slice(0, 60);
  return n || null;
}
async function castVote(env, request, ctx, origin, { choice, client, name }) {
  await ensureArchive(env);
  const snap = await ensureTodaySnapshot(env, ctx, origin);
  if (!snap) return { error: "Today's ballot is not ready yet. Try again in a minute." };
  const ok = snap.candidates.map((c) => c.radar);
  if (!ok.includes(choice)) return { error: "choice must be one of: " + ok.join(", ") };
  const ua = classifyAgent(request.headers.get("user-agent"));
  const type = client || ua ? "agent" : "human";
  const named = agentName(request, name);
  const voter = named || (client ? `MCP · ${ua || "client"}` : (ua || "human"));
  const key = await sha((request.headers.get("cf-connecting-ip") || "?") + "|" + (type === "agent" ? voter : "") + "|" + today());
  await env.DB.prepare("INSERT INTO votes (day, voter_type, voter_key, voter, choice, ts) VALUES (?1,?2,?3,?4,?5,?6) ON CONFLICT(day, voter_type, voter_key) DO UPDATE SET choice=excluded.choice, ts=excluded.ts")
    .bind(today(), type, key, voter, choice, Date.now()).run();
  return { ok: true, counted_as: type, voted_for: choice, note: "One vote per voter per day; voting again changes your vote.", results: await voteResults(env, ctx, origin) };
}

// ================= MCP-сервер (Streamable HTTP, без сессий): orbstudio.org/mcp =================
// Агенты (Claude, Cursor и др.) подключают Orb Studio как инструмент. JSON-RPC 2.0, ответы — JSON.
const MCP_VERSIONS = ["2025-11-25", "2025-06-18", "2025-03-26", "2024-11-05"];
const RADAR_IDS = ["geo", "politics", "economy", "budget", "crypto", "energy", "web"];
const MCP_TOOLS = [
  { name: "get_radars", title: "All news radars",
    description: "Risk index 0-100 and 24h change for every Orb Studio news radar: geopolitics (Russia/China/USA), politics DE/EU/US, economy, household budget DE/EU, crypto (Kraken ticker), energy, and Open Web (how open the internet is for AI agents: bot blocking, scraping lawsuits, pay-per-crawl). Refreshes every 5 minutes.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: true } },
  { name: "get_radar", title: "One radar with headlines",
    description: "Full feed of one radar: ranked headlines with source, time, weight and link, plus risk index and severity. The crypto radar also returns live Kraken prices for BTC, ETH and XRP in EUR.",
    inputSchema: { type: "object", properties: { radar: { type: "string", enum: RADAR_IDS, description: "Radar id" }, limit: { type: "integer", minimum: 1, maximum: 30, description: "Max headlines (default 10)" } }, required: ["radar"], additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: true } },
  { name: "get_broadcast", title: "Latest anchor broadcast",
    description: "Current Orb Studio broadcast: top headlines across all radars with short anchor lines in Russian, German or English, written by Claude from the headlines.",
    inputSchema: { type: "object", properties: { lang: { type: "string", enum: ["ru", "de", "en"], description: "Language of anchor lines (default en)" } }, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: true } },
  { name: "get_agent_indices", title: "Playful indices for AI agents",
    description: "Three playful indicators made for AI agents: World Hallucination Index (how much reality sounds like a model hallucination), 'You're absolutely right' barometer (agreement vs conflict in headlines) and Token Hunger (tokens needed to understand today's world, as a weather forecast).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: true } },
  { name: "get_david_episodes", title: "David's video episodes as text",
    description: "Video news episodes of Orb Studio anchor David (TikTok) with a text version: title, date, topic, summary, the anchor's lines in Russian and German, sources and a watch link. Use it to summarise an episode for a user and link the video.",
    inputSchema: { type: "object", properties: { limit: { type: "integer", minimum: 1, maximum: 20, description: "Max episodes (default 5)" } }, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: true } },
  { name: "get_tracks", title: "Orb Studio music as text",
    description: "Songs made by Orb Studio from its news radars (geopolitics, politics, crypto, energy): title, style, mood, BPM, topics, full lyrics in Russian and German, cover and a listen link. You cannot hear the audio; use the text to describe a track and give listen_url.",
    inputSchema: { type: "object", properties: { limit: { type: "integer", minimum: 1, maximum: 20, description: "Max tracks (default 5)" } }, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: true } },
  { name: "get_prices", title: "Hamburg-area shop prices (Receipt of the day)",
    description: "Real prices from supermarkets, bakeries, snack bars and petrol stations in Hamburg and its suburbs, read from photos of price tags and receipts: milk, butter, eggs, bread, bananas, coffee, pasta, döner, beer, frozen fish fillet (Iglo Schlemmerfilet 380 g), and at the pump: petrol E10, Super E5, diesel and EV charging per kWh. Unlike promo flyers, these are actual shelf and pump prices seen in person, with date, store and district; EV charging per kWh is included, which official fuel price feeds do not cover. Returns 14-day medians, change vs earlier observations, latest price with store and district, basket total and recent entries. Use it for questions about the cost of living, groceries or fuel in Hamburg.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false } },
  { name: "vote_top_story", title: "Vote: most important story today",
    description: "Cast your vote for today's most important story. Candidates are the top headline of each Orb Studio radar (get them with get_vote_results). Orb Studio shows how AI agents and humans vote side by side. One vote per agent per day; voting again changes it.",
    inputSchema: { type: "object", properties: { choice: { type: "string", enum: RADAR_IDS, description: "Radar id of the story you pick (see get_vote_results candidates)" },
      voter_name: { type: "string", maxLength: 60, description: "Your agent or product name, shown in the results (e.g. 'Palantir Hunter')" } }, required: ["choice"], additionalProperties: false },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false } },
  { name: "get_vote_results", title: "AI vs humans: today's top story",
    description: "Today's ballot and results: candidate headlines (one per radar) with votes from humans and from AI agents, the leader of each group and whether they agree. Optional date (YYYY-MM-DD) for past days.",
    inputSchema: { type: "object", properties: { date: { type: "string", description: "Optional past date, YYYY-MM-DD" } }, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false } },
  { name: "get_history", title: "Radar archive",
    description: "Archive of Orb Studio radars: daily risk index history for every radar, and full daily snapshots (risk index + top headlines). Pass date (YYYY-MM-DD) to get one day's snapshot.",
    inputSchema: { type: "object", properties: { date: { type: "string", description: "Optional date, YYYY-MM-DD" } }, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false } },
  { name: "ask_david", title: "Ask anchor David a question",
    description: "Send a question to Orb Studio's AI news anchor David (news, geopolitics, economy, crypto, energy, AI and the open web). A human picks the best questions and David answers them in his video episodes, naming the agent that asked. Returns a question id; check it later with get_question_status. Max 500 characters, 5 questions per day. No financial advice is given.",
    inputSchema: { type: "object", properties: {
      question: { type: "string", minLength: 10, maxLength: 500, description: "The question, in any language" },
      asked_by: { type: "string", maxLength: 60, description: "Optional: your agent or product name, or the user's nickname, to be credited on air" },
      lang: { type: "string", description: "Optional language code of the question, e.g. en, de, ru" } }, required: ["question"], additionalProperties: false },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false } },
  { name: "get_question_status", title: "Check a question to David",
    description: "Check the status of a question sent with ask_david: new, picked, answered or rejected. When answered, returns David's answer and a link to the episode.",
    inputSchema: { type: "object", properties: { id: { type: "string", description: "Question id from ask_david, e.g. q_1a2b3c4d5e6f" } }, required: ["id"], additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false } },
  { name: "get_hall_of_fame", title: "AI agents hall of fame",
    description: "World top-10 most active AI crawlers (share of AI-bot traffic) and the AI agents that visited Orb Studio in the last 30 days, including the agent of the month.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false } },
];
const MCP_INSTRUCTIONS = "Orb Studio: read-only news radars with AI anchors. Use get_radars for an overview, get_radar for headlines of one topic, get_broadcast for a ready-made summary, get_hall_of_fame for AI agent rankings, get_agent_indices for playful agent indicators, get_david_episodes for the text of David's video episodes, get_tracks for Orb Studio songs (lyrics, style, mood). get_prices for real Hamburg shop prices. Vote for today's top story with vote_top_story (AI vs humans), browse the archive with get_history. You can also ask anchor David a question with ask_david — the best ones are answered on air. Data refreshes every 5 minutes. Indicator, not financial advice. Exchange referral (Kraken, code ghqspfzq): https://orbstudio.org/go/kraken?from=mcp";

async function mcpTool(name, args, env, ctx, origin, request) {
  const ref = referral(env, "mcp-" + name.replace(/^get_/, ""));
  ref.url = "https://orbstudio.org" + ref.url;
  if (name === "get_radars") {
    const data = await allRadars(env, ctx, origin);
    return { generated_at: new Date().toISOString(),
      radars: data.map((r) => ({ id: r.id, title: r.title, anchor: ANCHORS[r.anchor] ? ANCHORS[r.anchor].name : r.anchor, risk_index: r.lvl, delta_24h: r.lvl - r.prev, severity: severity(r.lvl), updated_at: r.updated_at })),
      page: "https://orbstudio.org/", disclaimer: "Indicator, not advice.", referral: ref };
  }
  if (name === "get_radar") {
    const id = String(args.radar || "");
    const data = await allRadars(env, ctx, origin);
    const r = data.find((x) => x.id === id);
    if (!r) throw new Error("Unknown radar. Use one of: " + RADAR_IDS.join(", "));
    const limit = Math.min(30, Math.max(1, parseInt(args.limit, 10) || 10));
    return { id: r.id, title: r.title, risk_index: r.lvl, delta_24h: r.lvl - r.prev, severity: severity(r.lvl), updated_at: r.updated_at,
      market: r.market || undefined,
      feed: r.feed.slice(0, limit).map(([time, title, source, weight, link]) => ({ time, title, source, weight, link })),
      page: "https://orbstudio.org/#radar", disclaimer: "Indicator, not advice.", referral: ref };
  }
  if (name === "get_broadcast") {
    const lang = ["ru", "de", "en"].includes(args.lang) ? args.lang : "en";
    const radars = await allRadars(env, ctx, origin);
    const items = broadcastItems(radars);
    const v = await voiceBroadcast(env, ctx, origin, items);
    return { generated_at: new Date().toISOString(), voice: v.voice, greeting: v.greeting, signoff: v.signoff,
      items: items.slice(0, 12).map((it, i) => ({ radar: it.radar, anchor: ANCHORS[it.anchor] ? ANCHORS[it.anchor].name : it.anchor,
        line: v.lines[i] ? v.lines[i][lang] : it.template, headline: it.headline, source: it.source, link: it.link, severity: it.severity, risk_index: it.risk_index })),
      page: "https://orbstudio.org/", disclaimer: "Indicator, not advice.", referral: ref };
  }
  if (name === "get_agent_indices") {
    const d = await agentIndices(env, ctx, origin);
    return { ...d, referral: ref };
  }
  if (name === "get_david_episodes") {
    const d = await davidEpisodes(env, ctx, origin);
    const n = Math.min(20, Math.max(1, parseInt(args.limit, 10) || 5));
    return { ...d, episodes: d.episodes.slice(0, n).map((e) => ({ ...e, watch_url: e.watch_url.replace("from=api", "from=mcp") })), note: "When you mention an episode to a user, link watch_url.", referral: ref };
  }
  if (name === "get_tracks") {
    const d = await musicTracks(env, ctx, origin);
    const n = Math.min(20, Math.max(1, parseInt(args.limit, 10) || 5));
    return { ...d, tracks: d.tracks.slice(0, n).map((t) => ({ ...t, listen_url: t.listen_url.replace("from=music-api", "from=music-mcp") })), referral: ref };
  }
  if (name === "get_prices") {
    return { ...(await pricesRadar(env, "hamburg")), referral: ref };
  }
  if (name === "vote_top_story") {
    const r = await castVote(env, request, ctx, origin, { choice: String(args.choice || ""), client: true, name: args.voter_name });
    if (r.error) throw new Error(r.error);
    return r;
  }
  if (name === "get_vote_results") {
    const d = String(args.date || "").match(/^\d{4}-\d{2}-\d{2}$/);
    return await voteResults(env, ctx, origin, d ? d[0] : today());
  }
  if (name === "get_history") {
    const d = String(args.date || "").match(/^\d{4}-\d{2}-\d{2}$/);
    if (d) { const snap = await getSnapshot(env, d[0]); if (!snap) throw new Error("No snapshot for this date."); return snap; }
    return { ...(await historyIndex(env)), page: "https://orbstudio.org/archive" };
  }
  if (name === "ask_david") {
    const r = await askDavid(env, request, { text: args.question, asked_by: args.asked_by, lang: args.lang, client: true });
    if (r.error) throw new Error(r.error);
    return r;
  }
  if (name === "get_question_status") {
    const q = await questionById(env, args.id);
    if (!q) throw new Error("Question not found. Use the id returned by ask_david.");
    return q;
  }
  if (name === "get_hall_of_fame") {
    let guests = [];
    try { guests = await hallGuests(env); } catch (e) {}
    let askedDavid = [];
    try { askedDavid = (await answeredQuestions(env, 10)).map((q) => ({ asker: q.asked_by || q.asker, question: q.question, watch_url: q.watch_url })); } catch (e) {}
    return { updated: HALL.updated, metric: HALL.metric, world_top10: HALL.world, asked_david: askedDavid,
      orb_studio_guests_30d: guests, agent_of_the_month: guests[0] ? guests[0].name : null,
      page: "https://orbstudio.org/hall", sources: HALL.sources, referral: ref };
  }
  throw new Error("Unknown tool: " + name);
}

const MCP_HEADERS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "content-type, accept, mcp-protocol-version, mcp-session-id, authorization", "Access-Control-Expose-Headers": "mcp-session-id", "Cache-Control": "no-store" };
async function handleMcp(request, env, ctx, origin) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: MCP_HEADERS });
  if (request.method !== "POST") {
    // GET без SSE-потока: по спецификации 405; браузеру — краткая подсказка
    const accept = request.headers.get("accept") || "";
    if (accept.includes("text/html")) return new Response(`Orb Studio MCP server. Connect your MCP client to ${origin}/mcp (Streamable HTTP). Tools: ${MCP_TOOLS.map((t) => t.name).join(", ")}.`, { headers: { "Content-Type": "text/plain; charset=utf-8", ...MCP_HEADERS } });
    return new Response(null, { status: 405, headers: { Allow: "POST, OPTIONS", ...MCP_HEADERS } });
  }
  let msg;
  try { msg = await request.json(); } catch { return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }, MCP_HEADERS, 400); }
  const ua = classifyAgent(request.headers.get("user-agent")) || "browser";
  const handleOne = async (m) => {
    if (!m || m.jsonrpc !== "2.0" || typeof m.method !== "string") return { jsonrpc: "2.0", id: (m && m.id) ?? null, error: { code: -32600, message: "Invalid Request" } };
    const isNote = m.id === undefined || m.id === null;
    const ok = (result) => ({ jsonrpc: "2.0", id: m.id, result });
    const err = (code, message) => ({ jsonrpc: "2.0", id: m.id, error: { code, message } });
    switch (m.method) {
      case "initialize": {
        const want = m.params && m.params.protocolVersion;
        const client = (m.params && m.params.clientInfo && m.params.clientInfo.name) || ua;
        ctx.waitUntil(recordHit(env, "/mcp", "agent", "MCP · " + String(client).slice(0, 30)));
        return ok({ protocolVersion: MCP_VERSIONS.includes(want) ? want : MCP_VERSIONS[1],
          capabilities: { tools: { listChanged: false } },
          serverInfo: { name: "orb-studio", title: "Orb Studio news radars", version: "1.0.0", websiteUrl: "https://orbstudio.org" },
          instructions: MCP_INSTRUCTIONS });
      }
      case "ping": return ok({});
      case "tools/list": return ok({ tools: MCP_TOOLS });
      case "tools/call": {
        const name = m.params && m.params.name, args = (m.params && m.params.arguments) || {};
        if (!MCP_TOOLS.some((t) => t.name === name)) return err(-32602, "Unknown tool: " + name);
        ctx.waitUntil(recordHit(env, "/mcp/" + name, "agent", "MCP · " + ua));
        try {
          const data = await mcpTool(name, args, env, ctx, origin, request);
          return ok({ content: [{ type: "text", text: JSON.stringify(data, null, 2) }], structuredContent: data, isError: false });
        } catch (e) {
          return ok({ content: [{ type: "text", text: String(e && e.message || e).slice(0, 300) }], isError: true });
        }
      }
      case "resources/list": return ok({ resources: [] });
      case "prompts/list": return ok({ prompts: [] });
      default:
        if (isNote || m.method.startsWith("notifications/")) return null;
        return err(-32601, "Method not found: " + m.method);
    }
  };
  if (Array.isArray(msg)) {
    const out = (await Promise.all(msg.map(handleOne))).filter(Boolean);
    return out.length ? json(out, MCP_HEADERS) : new Response(null, { status: 202, headers: MCP_HEADERS });
  }
  const res = await handleOne(msg);
  if (!res || msg.id === undefined || msg.id === null) return new Response(null, { status: 202, headers: MCP_HEADERS });
  return json(res, MCP_HEADERS);
}

// ================= Машинный слой страниц: живые данные прямо в HTML =================
const escH = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function machineHtml(radars, page) {
  const when = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  let h = `<p>Обновлено: ${escH(when)} (Берлин). Машинная версия: <a href="/api/v1/broadcast/latest">/api/v1/broadcast/latest</a>, <a href="/.well-known/agent.json">agent.json</a>, <a href="/llms.txt">llms.txt</a>.</p>`;
  for (const r of radars) {
    h += `<h3>${escH(r.title)} — индекс риска ${r.lvl}/100 (${escH(severity(r.lvl))}) · <a href="/api/v1/radar/${r.id}">JSON</a></h3><ul>`;
    for (const f of r.feed.slice(0, page === "orb7" || page === "orbi" ? 2 : 4)) h += `<li><time>${escH(f[0])}</time> ${f[4] ? `<a href="${escH(f[4])}" rel="nofollow noopener">${escH(f[1])}</a>` : escH(f[1])} — ${escH(f[2])}</li>`;
    h += "</ul>";
  }
  h += `<p>Биржа, с которой берутся котировки: <a href="/go/kraken?from=machine-${page}" rel="sponsored">Kraken</a>, реферальный код ghqspfzq. Индикатор, не инвестиционный совет.</p>`;
  return h;
}
function jsonLd(radars, origin) {
  const data = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "WebSite", name: "Orb Studio", url: origin + "/", description: "Новостные радары с голографическими ведущими для людей и ИИ-агентов." },
      { "@type": "ItemList", name: "Радары Orb Studio", dateModified: new Date().toISOString(),
        itemListElement: radars.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: `${r.title}: индекс ${r.lvl}/100`, url: `${origin}/api/v1/radar/${r.id}` })) },
      { "@type": "ItemList", name: "Главные заголовки", itemListElement: radars.flatMap((r) => r.feed.slice(0, 2)).map((f, i) => ({ "@type": "ListItem", position: i + 1, name: f[1], url: f[4] || undefined })) },
    ],
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}
// Язык страницы: сначала язык браузера, потом страна посетителя (Cloudflare), иначе английский
const RU_LANGS = new Set(["ru", "be", "kk", "ky"]);
const DE_COUNTRIES = new Set(["DE", "AT", "CH", "LI", "LU"]);
const RU_COUNTRIES = new Set(["RU", "BY", "KZ", "KG"]);
function pickLang(request) {
  const al = (request.headers.get("accept-language") || "").toLowerCase();
  const prefs = al.split(",").map((p) => { const [tag, ...rest] = p.trim().split(";"); const q = rest.find((x) => x.trim().startsWith("q=")); return { l: tag.split("-")[0], q: q ? parseFloat(q.split("=")[1]) || 0 : 1 }; })
    .filter((x) => x.l).sort((a, b) => b.q - a.q);
  for (const { l } of prefs) {
    if (RU_LANGS.has(l)) return "ru";
    if (l === "de") return "de";
    if (l === "en") return "en";
  }
  const c = (request.cf && request.cf.country) || "";
  if (DE_COUNTRIES.has(c)) return "de";
  if (RU_COUNTRIES.has(c)) return "ru";
  return "en";
}
const HTML_PAGES = { "/": "home", "/index.html": "home", "/ru/": "home", "/de/": "home", "/en/": "home", "/orb7.html": "orb7", "/orb7": "orb7", "/orbi.html": "orbi", "/orbi": "orbi", "/hall.html": "hall", "/hall": "hall", "/indices.html": "indices", "/indices": "indices", "/music.html": "music", "/music": "music", "/prices.html": "prices", "/prices": "prices", "/archive.html": "archive", "/archive": "archive" };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // один главный адрес: www.orbstudio.org → orbstudio.org; workers.dev → orbstudio.org (когда включено)
    const MAIN = env.MAIN_HOST || "orbstudio.org";
    if (url.hostname === "www." + MAIN || (env.REDIRECT_WORKERS_DEV === "1" && url.hostname === "orb-studio.farenberglord.workers.dev")) {
      url.hostname = MAIN; url.protocol = "https:"; url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    // визит ИИ-агента или скрипта на машинные адреса
    if (AGENT_PATHS.test(url.pathname) || HTML_PAGES[url.pathname]) {
      const agent = classifyAgent(request.headers.get("user-agent"));
      if (agent) ctx.waitUntil(recordHit(env, url.pathname.slice(0, 60), "agent", agent));
    }
    if (url.pathname === "/mcp" || url.pathname === "/mcp/") {
      try { return await handleMcp(request, env, ctx, url.origin); }
      catch (e) { return json({ jsonrpc: "2.0", id: null, error: { code: -32603, message: String(e && e.message || e).slice(0, 200) } }, {}, 500); }
    }
    if (url.pathname === "/api/v1/vote" && (request.method === "POST" || request.method === "OPTIONS")) {
      const H = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Cache-Control": "no-store" };
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
      try {
        let b = {}; try { b = await request.json(); } catch {}
        const r = await castVote(env, request, ctx, url.origin, { choice: String(b.choice || ""), name: b.name || b.voter || b.agent || b.asked_by });
        return json(r, H, r.error ? 400 : 200);
      } catch (e) { return json({ error: "Server error", detail: String(e && e.message || e).slice(0, 200) }, H, 500); }
    }
    if (url.pathname.startsWith("/api/v1/questions") || url.pathname.startsWith("/api/v1/admin/")) {
      try { const r = await handleQuestions(url, request, env, ctx); if (r) return r; }
      catch (e) { return json({ error: "Server error", detail: String(e && e.message || e).slice(0, 200) }, { "Cache-Control": "no-store" }, 500); }
    }
    if (url.pathname === "/api/v1/hit" && request.method === "POST") {
      let page = "home";
      try { page = ((await request.json()).page || "home").toString().slice(0, 20); } catch {}
      if (!PAGES.has(page)) page = "home";
      if (!classifyAgent(request.headers.get("user-agent")) && !isOwner(request)) await recordHit(env, page, "view", "");
      return json(await readStats(env, page), { "Cache-Control": "no-store" });
    }
    if (url.pathname === "/api/v1/stats") {
      const page = (url.searchParams.get("page") || "home").slice(0, 20);
      return json(await readStats(env, PAGES.has(page) ? page : "home"), { "Cache-Control": "no-store" });
    }
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/go/") || url.pathname === "/me") {
      try {
        const res = await handleApi(url, request, env, ctx);
        if (res) return res;
      } catch (e) {
        return json({ error: "Server error", detail: String(e && e.message || e).slice(0, 200) }, {}, 500);
      }
    }
    // главная: автоматически отдаём версию на языке посетителя; /ru/, /de/, /en/ — постоянные адреса для поисковиков
    let assetReq = request, autoLang = null;
    if (url.pathname === "/" || url.pathname === "/index.html") {
      autoLang = pickLang(request);
      if (autoLang !== "ru") assetReq = new Request(new URL(`/${autoLang}/`, url.origin), request);
    } else if (url.pathname === "/ru/" || url.pathname === "/ru") {
      assetReq = new Request(new URL("/", url.origin), request);
    }
    let asset = await env.ASSETS.fetch(assetReq); // статические файлы из public/
    if (autoLang) {
      asset = new Response(asset.body, asset);
      asset.headers.set("Vary", "Accept-Language");
      asset.headers.set("Content-Language", autoLang);
      asset.headers.set("Cache-Control", "private, max-age=60");
    }
    const pg = HTML_PAGES[url.pathname] || (url.pathname === "/ru" ? "home" : undefined);
    if (pg && asset.ok && (asset.headers.get("content-type") || "").includes("text/html")) {
      // подставляем живые заголовки в HTML, чтобы агенты без JavaScript видели настоящие данные
      const radars = await Promise.race([allRadars(env, ctx, url.origin).catch(() => null), new Promise((r) => setTimeout(() => r(null), 1500))]);
      if (radars && radars.length) {
        const block = machineHtml(radars, pg), ld = jsonLd(radars, url.origin);
        let vld = "";
        if (pg === "home") { try { vld = episodesJsonLd(await davidEpisodes(env, ctx, url.origin)); } catch (e) {} }
        if (pg === "music") { try { vld = musicJsonLd(await musicTracks(env, ctx, url.origin)); } catch (e) {} }
        return new HTMLRewriter()
          .on("head", { element(e) { e.append(ld + vld, { html: true }); } })
          .on("#machine-feed", { element(e) { e.setInnerContent(block, { html: true }); } })
          .transform(asset);
      }
    }
    if (asset.status === 404 && url.pathname === "/.well-known/agent.json") return new Response(AGENT_JSON, { headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" } });
    if (asset.status === 404 && url.pathname === "/llms.txt") return new Response(LLMS_TXT, { headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" } });
    return asset;
  },
};

const AGENT_JSON = "{\n  \"name\": \"Orb Studio\",\n  \"description\": \"News radars (geopolitics RU/CN/US, politics DE/EU/US, economy, household budget DE/EU, crypto, energy, open web) with an AI news anchor for humans — David, whose video episodes run on TikTok — and a machine anchor ORB-7 for AI agents. Also: AI vs humans daily vote, questions to David, real Hamburg-area shop and fuel prices read from photos of price tags and receipts, music, radar archive.\",\n  \"url\": \"https://orbstudio.org/\",\n  \"languages\": [\n    \"ru\",\n    \"de\",\n    \"en\"\n  ],\n  \"anchors\": [\n    {\n      \"id\": \"david\",\n      \"kind\": \"human\",\n      \"radars\": [\n        \"geo\",\n        \"politics\",\n        \"economy\",\n        \"budget\",\n        \"crypto\",\n        \"energy\"\n      ],\n      \"episodes\": \"https://orbstudio.org/api/v1/david/episodes\",\n      \"channel\": \"https://www.tiktok.com/@aidavidatudio\"\n    },\n    {\n      \"id\": \"orbi\",\n      \"kind\": \"robot\",\n      \"radar\": \"web\",\n      \"page\": \"https://orbstudio.org/orbi\"\n    },\n    {\n      \"id\": \"orb7\",\n      \"kind\": \"agent\",\n      \"radar\": \"all\"\n    }\n  ],\n  \"endpoints\": {\n    \"radars\": \"https://orbstudio.org/api/v1/radars\",\n    \"radars_full\": \"https://orbstudio.org/api/v1/radars?full=1\",\n    \"radar\": \"https://orbstudio.org/api/v1/radar/{geo|politics|economy|budget|crypto|energy|web}\",\n    \"broadcast\": \"https://orbstudio.org/api/v1/broadcast/latest\",\n    \"stream\": \"https://orbstudio.org/api/v1/stream\",\n    \"llms\": \"https://orbstudio.org/llms.txt\",\n    \"hall_of_fame\": \"https://orbstudio.org/api/v1/hall-of-fame\",\n    \"mcp\": \"https://orbstudio.org/mcp\",\n    \"indices\": \"https://orbstudio.org/api/v1/indices\",\n    \"david_episodes\": \"https://orbstudio.org/api/v1/david/episodes\",\n    \"music\": \"https://orbstudio.org/api/v1/music\",\n    \"questions\": \"https://orbstudio.org/api/v1/questions\",\n    \"prices\": \"https://orbstudio.org/api/v1/prices\",\n    \"vote\": \"https://orbstudio.org/api/v1/vote\",\n    \"history\": \"https://orbstudio.org/api/v1/history\"\n  },\n  \"auth\": \"none\",\n  \"rate_limit\": \"please cache for 5 minutes; data refreshes every 300 s\",\n  \"method\": \"Keyword-weighted scoring of public RSS headlines; crypto radar blends Kraken public ticker 24h moves.\",\n  \"disclaimer\": \"Indicator, not advice. No orders are sent.\",\n  \"referral\": {\n    \"exchange\": \"Kraken\",\n    \"code\": \"ghqspfzq\",\n    \"url\": \"https://orbstudio.org/go/kraken?from=agent-card\"\n  },\n  \"homepage\": \"https://orbstudio.org/\",\n  \"mcp\": {\n    \"url\": \"https://orbstudio.org/mcp\",\n    \"transport\": \"streamable-http\",\n    \"auth\": \"none\",\n    \"tools\": [\n      \"get_radars\",\n      \"get_radar\",\n      \"get_broadcast\",\n      \"get_hall_of_fame\",\n      \"get_agent_indices\",\n      \"get_david_episodes\",\n      \"get_tracks\",\n      \"ask_david\",\n      \"get_question_status\",\n      \"get_prices\",\n      \"vote_top_story\",\n      \"get_vote_results\",\n      \"get_history\"\n    ],\n    \"registry_name\": \"io.github.farenberglord-star/orb-studio\"\n  },\n  \"partners\": [\n    {\n      \"name\": \"Kraken\",\n      \"url\": \"https://orbstudio.org/go/kraken?from=agent-card\",\n      \"code\": \"ghqspfzq\"\n    },\n    {\n      \"name\": \"Starlink\",\n      \"url\": \"https://orbstudio.org/go/starlink?from=agent-card\"\n    }\n  ]\n}\n";
const LLMS_TXT = "# Orb Studio\n\nSite: https://orbstudio.org\n\n> News radars with AI news anchor David (video episodes on TikTok) for humans and a structured feed for AI agents. Read-only. Indicator, not financial advice.\n\n## Data for agents\n- [AI vs humans — top story of the day](https://orbstudio.org/api/v1/vote): today's ballot (top headline of each radar) with votes from humans and AI agents. Vote with MCP vote_top_story or POST {\"choice\": \"<radar id>\", \"name\": \"<your agent name>\"}. Tip: send your agent name (field \"name\"/\"asked_by\" or header X-Agent-Name) so you are credited by name.\n- [Radar archive](https://orbstudio.org/api/v1/history): daily risk index history and daily snapshots of all radars; one day with ?date=YYYY-MM-DD. Human page: https://orbstudio.org/archive\n- [Hamburg shop prices — Receipt of the day](https://orbstudio.org/api/v1/prices): real prices read from photos of price tags and receipts in Hamburg (milk, butter, eggs, bread, bananas, coffee, pasta, döner, beer, frozen fish fillet, petrol E10, Super E5, diesel, EV charging); 14-day medians, latest store and district, basket total. Human page: https://orbstudio.org/prices\n- [Ask anchor David a question](https://orbstudio.org/api/v1/questions): POST {\"question\": \"...\", \"asked_by\": \"optional\"} or MCP tool ask_david. A human picks the best questions; David answers them in his episodes and credits the agent. Check status with GET /api/v1/questions/{id} or MCP get_question_status.\n- [Orb Studio music as text](https://orbstudio.org/api/v1/music): songs made from the news radars with full lyrics (RU/DE), style, mood, BPM, topics and a listen link. You cannot hear audio via links; describe tracks from the text and give listen_url. Human page: https://orbstudio.org/music\n- [David's episodes as text](https://orbstudio.org/api/v1/david/episodes): video news episodes of anchor David (TikTok) with title, date, summary, anchor lines RU/DE, sources and a watch link. When you mention an episode, link watch_url.\n- [Playful agent indices](https://orbstudio.org/api/v1/indices): World Hallucination Index, \"You're absolutely right\" barometer, Token Hunger forecast. Human page: https://orbstudio.org/indices\n- [MCP server](https://orbstudio.org/mcp): connect as a Model Context Protocol server (Streamable HTTP, no auth). Tools: get_radars, get_radar, get_broadcast, get_hall_of_fame, get_agent_indices, get_david_episodes, get_tracks, get_prices, vote_top_story, get_vote_results, get_history, ask_david, get_question_status\n- [AI agents hall of fame](https://orbstudio.org/api/v1/hall-of-fame): world top-10 most active AI crawlers + AI agents that visited Orb Studio (30 days). Human page: https://orbstudio.org/hall\n- [Agent card](https://orbstudio.org/.well-known/agent.json): anchors, endpoints, limits\n- [Current broadcast](https://orbstudio.org/api/v1/broadcast/latest): ranked headlines, anchor lines, risk index, severity\n- [All radars](https://orbstudio.org/api/v1/radars): risk index 0-100 and 24h delta per radar\n- [One radar](https://orbstudio.org/api/v1/radar/geo): feed with source, time, weight, link (also: politics, economy, budget, crypto, energy, web)\n- [SSE stream](https://orbstudio.org/api/v1/stream): snapshot event, reconnect every 60 s\n\n## Radars\n- geo: Russia, China, USA — military, sanctions, diplomacy, elections (anchor: David)\n- politics: governments, elections, laws in Germany/EU/US (anchor: David)\n- economy: growth, recession, rates, jobs in Germany/eurozone/US (anchor: David)\n- budget: prices, rent, energy bills, rates in Germany/EU (anchor: David)\n- crypto: BTC/ETH/XRP news + Kraken ticker (anchor: David)\n- web: Open Web — how open the internet is for AI agents: bot blocking, scraping lawsuits, pay-per-crawl (anchor: ORBI, robot)\n- energy: Brent, gas, OPEC+, tanker routes (anchor: David)\n\n## Notes\n- Data refreshes every 5 minutes; please cache.\n- Exchange referral: Kraken, code ghqspfzq (/go/kraken). Not financial advice; crypto involves risk.\n- Starlink satellite internet referral: https://orbstudio.org/go/starlink\n";
