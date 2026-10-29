// Orb Studio — серверная часть (Cloudflare Worker со статикой из public/).
// Деплой: npx wrangler deploy (Workers Builds делает это сам при каждом push в main).
// Переменные окружения: ANTHROPIC_API_KEY (секрет), ANTHROPIC_MODEL, KRAKEN_URL, KRAKEN_CODE; KV: ORB_KV (необязательно).

// Orb Studio — радары: сбор заголовков из открытых RSS, оценка риска, кэш.
// Работает без базы данных. Если подключён KV с именем ORB_KV, хранит вчерашний индекс для дельты.

const ANCHORS = {
  david: { name: "Давид", role: "Гео-радар · RU / CN / US", kind: "human" },
  anna:  { name: "Анна",  role: "Радар бюджета домохозяйств", kind: "human" },
  kai:   { name: "Кай",   role: "Крипто-радар · Kraken", kind: "human" },
  lena:  { name: "Лена",  role: "Энерго-радар", kind: "human" },
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
    id: "budget", title: "Бюджет домохозяйств", anchor: "anna",
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
    id: "crypto", title: "Крипто-радар", anchor: "kai",
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
    id: "energy", title: "Энерго-радар", anchor: "lena",
    lead: "Brent, газ, танкеры и решения ОПЕК+.",
    feeds: [
      gnews("Brent OR OPEC OR \"oil price\" when:1d"),
      gnews("LNG OR \"gas price\" OR TTF when:2d"),
    ],
    factors: {
      "Нефть":    { w: 55, k: ["brent","crude","oil","wti","нефт"] },
      "Газ":      { w: 55, k: ["lng","gas","ttf","газ"] },
      "ОПЕК+":    { w: 60, k: ["opec","output cut","production","опек"] },
      "Маршруты": { w: 75, k: ["tanker","red sea","strait","hormuz","pipeline","танкер"] },
    },
  },
];

// ---------- RSS ----------
const decode = (s) => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
  .replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, " ")
  .trim();
const tag = (block, name) => {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
  return m ? decode(m[1]) : "";
};

async function fetchFeed(url) {
  try {
    const r = await fetch(url, {
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
    const r = await fetch(`https://api.kraken.com/0/public/Ticker?pair=${pairs.join(",")}`, { cf: { cacheTtl: 60 } });
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
function scoreItem(title, factors) {
  const t = title.toLowerCase();
  let best = 15; const hits = [];
  for (const [name, f] of Object.entries(factors)) {
    if (f.k.some((k) => t.includes(k))) { hits.push(name); best = Math.max(best, f.w); }
  }
  return { weight: best, hits };
}

const hhmm = (ts) => new Date(ts).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Berlin" });

async function buildRadar(def, env) {
  const lists = await Promise.all(def.feeds.map(fetchFeed));
  const seen = new Set();
  const items = lists.flat()
    .filter((i) => { const k = i.title.toLowerCase().slice(0, 60); if (seen.has(k)) return false; seen.add(k); return true; })
    .filter((i) => Date.now() - i.ts < 72 * 3600e3)
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

  // Дельта за сутки (если есть KV)
  let prev = lvl;
  if (env && env.ORB_KV) {
    const day = new Date().toISOString().slice(0, 10);
    const yday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
    const y = await env.ORB_KV.get(`lvl:${def.id}:${yday}`);
    if (y !== null) prev = +y;
    await env.ORB_KV.put(`lvl:${def.id}:${day}`, String(lvl), { expirationTtl: 7 * 864e5 });
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
  const fresh = new Request(origin + "/__cache/radars-v2");
  const stale = new Request(origin + "/__cache/radars-v2-stale");
  const hit = await cache.match(fresh);
  if (hit) return hit.json();
  const refresh = () => (refreshing ||= (async () => {
    try {
      const data = await Promise.all(RADARS.map((d) => buildRadar(d, env)));
      const body = JSON.stringify(data);
      await Promise.all([
        cache.put(fresh, new Response(body, { headers: { "Cache-Control": "max-age=300" } })),
        cache.put(stale, new Response(body, { headers: { "Cache-Control": "max-age=86400" } })),
      ]);
      return data;
    } finally { refreshing = null; }
  })());
  const old = await cache.match(stale);
  if (old) { ctx.waitUntil(refresh().catch(() => {})); return old.json(); }
  return refresh();
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
  david: "Давид — ведущий гео-радара (Россия, Китай, США). Сдержанный, точный, с сухой иронией там, где новость это позволяет. Говорит как опытный международный обозреватель.",
  anna:  "Анна — ведущая радара бюджета домохозяйств в Германии. Тёплая, практичная, объясняет, что новость значит для кошелька обычной семьи.",
  kai:   "Кай — ведущий крипто-радара. Энергичный, говорит коротко, всегда помнит про риск и никогда не даёт торговых советов.",
  lena:  "Лена — ведущая энерго-радара. Спокойная, аналитичная, связывает нефть и газ с ценами для людей.",
};

const SYSTEM = `Ты пишешь реплики для ИИ-ведущих новостного сайта Orb Studio. Каждый ведущий читает заголовки своего радара в прямом эфире.

Правила:
- Опирайся только на факты из заголовка и названия источника. Не придумывай цифры, имена, даты и подробности, которых нет в заголовке.
- 1–2 предложения, не больше 35 слов на реплику. Живая разговорная речь ведущего, без канцелярита.
- Тон соответствует серьёзности: при severity "тревожно" и при новостях о жертвах, ударах, катастрофах никаких шуток и иронии.
- Никаких инвестиционных советов, призывов купить или продать.
- Каждая реплика есть на русском (ru) и на немецком (de). Немецкий — естественный, не дословный перевод.
- greeting: приветствие в начале выпуска, каждый раз другое (не "добрый вечер", а свободно, с учётом времени суток), от лица Давида, 1 предложение.
- signoff: шутливая просьба подписаться в конце, каждый раз новая, 1 предложение.

Ответь только JSON без пояснений, строго такой формы:
{"greeting":{"ru":"…","de":"…"},"lines":[{"i":0,"ru":"…","de":"…"}],"signoff":{"ru":"…","de":"…"}}
где i — номер заголовка из входных данных.`;

async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].slice(0, 8).map((x) => x.toString(16).padStart(2, "0")).join("");
}

function templateBroadcast(items) {
  return {
    voice: "template",
    greeting: { ru: "Это Orb Studio, радары на связи.", de: "Hier ist Orb Studio, die Radare sind live." },
    signoff: { ru: "Подпишись, чтобы радар не скучал.", de: "Abonniere, damit das Radar nicht allein ist." },
    lines: items.map((it) => ({ ru: it.template, de: it.template })),
  };
}

async function askClaude(env, items) {
  const now = new Date().toLocaleString("ru-RU", { timeZone: "Europe/Berlin", weekday: "long", hour: "2-digit", minute: "2-digit" });
  const input = {
    berlin_time: now,
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
      max_tokens: 3000,
      system: SYSTEM,
      messages: [{ role: "user", content: JSON.stringify(input) }],
    }),
  });
  if (!res.ok) throw new Error(`Claude API ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const j = await res.json();
  const text = (j.content || []).filter((c) => c.type === "text").map((c) => c.text).join("");
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) throw new Error("No JSON in model reply");
  const out = JSON.parse(m[0]);
  const byI = new Map((out.lines || []).map((l) => [l.i, l]));
  return {
    voice: "claude",
    model: j.model,
    greeting: out.greeting,
    signoff: out.signoff,
    lines: items.map((it, i) => {
      const l = byI.get(i);
      return l && l.ru ? { ru: l.ru, de: l.de || l.ru } : { ru: it.template, de: it.template };
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
  const key = new Request(`${origin}/__cache/voice-v1-${h}`);
  const hit = await cache.match(key);
  if (hit) return hit.json();
  // Claude пишет выпуск в фоне; если ответ не успел за 8 секунд, сейчас отдаём шаблон,
  // а следующий запрос получит уже готовый живой текст из кэша.
  const job = askClaude(env, items).then(async (data) => {
    data.generated_at = new Date().toISOString();
    await cache.put(key, new Response(JSON.stringify(data), { headers: { "Cache-Control": "max-age=900" } }));
    return data;
  });
  ctx.waitUntil(job.catch(() => {}));
  try {
    const data = await Promise.race([job, new Promise((r) => setTimeout(() => r(null), 8000))]);
    if (data) return data;
    const fb = templateBroadcast(items);
    fb.error = "Claude is still writing this broadcast; live text will be ready on the next request (about 10-20 s).";
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

  if (p === "/go/kraken") {
    const from = (url.searchParams.get("from") || "unknown").replace(/[^a-z0-9_-]/gi, "").slice(0, 40) || "unknown";
    const target = env.KRAKEN_URL || `https://geoquant-orb.pages.dev/go/kraken?from=${from.startsWith("studio") ? "" : "studio-"}${encodeURIComponent(from)}`;
    const who = classifyAgent(request.headers.get("user-agent"));
    ctx.waitUntil(recordHit(env, from, "kraken", who ? "agent:" + who : "human"));
    return Response.redirect(target, 302);
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
        line_ru: v.lines[i].ru, line_de: v.lines[i].de,
        headline: it.headline, source: it.source, time: it.time, link: it.link,
        weight: it.weight, severity: it.severity, risk_index: it.risk_index, delta_24h: it.delta_24h,
      })),
      voice_error: v.error || undefined,
      method: "Keyword-weighted headline scoring over public RSS feeds; crypto radar blends Kraken 24h moves. Anchor lines written by Claude from headlines only.",
      disclaimer: "Indicator, not advice. No orders are sent.",
      referral: referral(env, "api-broadcast"),
    });
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
  ["Bingbot", /bingbot/i], ["Meta-AI", /meta-externalagent|facebookbot/i], ["Apple", /applebot/i], ["Bytespider", /bytespider/i],
  ["CommonCrawl", /ccbot/i], ["Amazonbot", /amazonbot/i], ["DuckAssist", /duckassistbot/i], ["Mistral", /mistralai/i],
  ["You.com", /youbot/i], ["Cohere", /cohere-ai/i],
];
function classifyAgent(ua) {
  ua = ua || "";
  for (const [name, re] of AGENT_UA) if (re.test(ua)) return name;
  if (/bot|crawler|spider|agent/i.test(ua)) return "Other bot";
  if (!/mozilla/i.test(ua)) return ua ? "Script · " + ua.split(/[\/ ]/)[0].slice(0, 20) : "Script";
  return null; // обычный браузер
}
const AGENT_PATHS = /^\/(api\/|llms\.txt$|\.well-known\/|robots\.txt$)/;
const PAGES = new Set(["home", "radar", "anchors", "agents", "orb7"]);
let tableReady = false;
async function ensureTable(env) {
  if (tableReady) return;
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS hits (day TEXT NOT NULL, page TEXT NOT NULL, kind TEXT NOT NULL, name TEXT NOT NULL DEFAULT '', n INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (day, page, kind, name))").run();
  tableReady = true;
}
const today = () => new Date().toISOString().slice(0, 10);
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
  const krakenFrom = (await env.DB.prepare("SELECT page AS source, SUM(n) AS n FROM hits WHERE kind='kraken' AND day>=?1 GROUP BY page ORDER BY n DESC LIMIT 8").bind(week).all()).results || [];
  return { enabled: true, page, page_total: pageTotal, page_today: pageToday, site_total: siteTotal, site_today: siteToday,
    agents_today: agentsToday, agents_total: agentsTotal, top_agents_7d: top,
    kraken_clicks_today: krakenToday, kraken_clicks_total: krakenTotal, kraken_by_source_7d: krakenFrom };
}

// ================= Машинный слой страниц: живые данные прямо в HTML =================
const escH = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function machineHtml(radars, page) {
  const when = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  let h = `<p>Обновлено: ${escH(when)} (Берлин). Машинная версия: <a href="/api/v1/broadcast/latest">/api/v1/broadcast/latest</a>, <a href="/.well-known/agent.json">agent.json</a>, <a href="/llms.txt">llms.txt</a>.</p>`;
  for (const r of radars) {
    h += `<h3>${escH(r.title)} — индекс риска ${r.lvl}/100 (${escH(severity(r.lvl))}) · <a href="/api/v1/radar/${r.id}">JSON</a></h3><ul>`;
    for (const f of r.feed.slice(0, page === "orb7" ? 2 : 4)) h += `<li><time>${escH(f[0])}</time> ${f[4] ? `<a href="${escH(f[4])}" rel="nofollow noopener">${escH(f[1])}</a>` : escH(f[1])} — ${escH(f[2])}</li>`;
    h += "</ul>";
  }
  h += `<p>Биржа, с которой берутся котировки: <a href="/go/kraken?from=machine-${page}">Kraken</a>, реферальный код ghqspfzq. Индикатор, не инвестиционный совет.</p>`;
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
const HTML_PAGES = { "/": "home", "/index.html": "home", "/orb7.html": "orb7" };

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
    if (url.pathname === "/api/v1/hit" && request.method === "POST") {
      let page = "home";
      try { page = ((await request.json()).page || "home").toString().slice(0, 20); } catch {}
      if (!PAGES.has(page)) page = "home";
      if (!classifyAgent(request.headers.get("user-agent"))) await recordHit(env, page, "view", "");
      return json(await readStats(env, page), { "Cache-Control": "no-store" });
    }
    if (url.pathname === "/api/v1/stats") {
      const page = (url.searchParams.get("page") || "home").slice(0, 20);
      return json(await readStats(env, PAGES.has(page) ? page : "home"), { "Cache-Control": "no-store" });
    }
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/go/")) {
      try {
        const res = await handleApi(url, request, env, ctx);
        if (res) return res;
      } catch (e) {
        return json({ error: "Server error", detail: String(e && e.message || e).slice(0, 200) }, {}, 500);
      }
    }
    const asset = await env.ASSETS.fetch(request); // статические файлы из public/
    const pg = HTML_PAGES[url.pathname];
    if (pg && asset.ok && (asset.headers.get("content-type") || "").includes("text/html")) {
      // подставляем живые заголовки в HTML, чтобы агенты без JavaScript видели настоящие данные
      const radars = await Promise.race([allRadars(env, ctx, url.origin).catch(() => null), new Promise((r) => setTimeout(() => r(null), 1500))]);
      if (radars && radars.length) {
        const block = machineHtml(radars, pg), ld = jsonLd(radars, url.origin);
        return new HTMLRewriter()
          .on("head", { element(e) { e.append(ld, { html: true }); } })
          .on("#machine-feed", { element(e) { e.setInnerContent(block, { html: true }); } })
          .transform(asset);
      }
    }
    if (asset.status === 404 && url.pathname === "/.well-known/agent.json") return new Response(AGENT_JSON, { headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" } });
    if (asset.status === 404 && url.pathname === "/llms.txt") return new Response(LLMS_TXT, { headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" } });
    return asset;
  },
};

const AGENT_JSON = "{\n  \"name\": \"Orb Studio\",\n  \"description\": \"News radars (geopolitics RU/CN/US, household budget DE/EU, crypto, energy) with holographic AI anchors for humans and a machine anchor ORB-7 for AI agents.\",\n  \"url\": \"https://orbstudio.org/\",\n  \"languages\": [\n    \"ru\",\n    \"de\",\n    \"en\"\n  ],\n  \"anchors\": [\n    {\n      \"id\": \"david\",\n      \"kind\": \"human\",\n      \"radar\": \"geo\"\n    },\n    {\n      \"id\": \"anna\",\n      \"kind\": \"human\",\n      \"radar\": \"budget\"\n    },\n    {\n      \"id\": \"kai\",\n      \"kind\": \"human\",\n      \"radar\": \"crypto\"\n    },\n    {\n      \"id\": \"lena\",\n      \"kind\": \"human\",\n      \"radar\": \"energy\"\n    },\n    {\n      \"id\": \"orb7\",\n      \"kind\": \"agent\",\n      \"radar\": \"all\"\n    }\n  ],\n  \"endpoints\": {\n    \"radars\": \"https://orbstudio.org/api/v1/radars\",\n    \"radars_full\": \"https://orbstudio.org/api/v1/radars?full=1\",\n    \"radar\": \"https://orbstudio.org/api/v1/radar/{geo|budget|crypto|energy}\",\n    \"broadcast\": \"https://orbstudio.org/api/v1/broadcast/latest\",\n    \"stream\": \"https://orbstudio.org/api/v1/stream\",\n    \"llms\": \"https://orbstudio.org/llms.txt\"\n  },\n  \"auth\": \"none\",\n  \"rate_limit\": \"please cache for 5 minutes; data refreshes every 300 s\",\n  \"method\": \"Keyword-weighted scoring of public RSS headlines; crypto radar blends Kraken public ticker 24h moves.\",\n  \"disclaimer\": \"Indicator, not advice. No orders are sent.\",\n  \"referral\": {\n    \"exchange\": \"Kraken\",\n    \"code\": \"ghqspfzq\",\n    \"url\": \"https://orbstudio.org/go/kraken?from=agent-card\"\n  },\n  \"homepage\": \"https://orbstudio.org/\"\n}\n";
const LLMS_TXT = "# Orb Studio\n\nSite: https://orbstudio.org\n\n> News radars with holographic AI anchors for humans and a structured feed for AI agents. Read-only. Indicator, not financial advice.\n\n## Data for agents\n- [Agent card](https://orbstudio.org/.well-known/agent.json): anchors, endpoints, limits\n- [Current broadcast](https://orbstudio.org/api/v1/broadcast/latest): ranked headlines, anchor lines, risk index, severity\n- [All radars](https://orbstudio.org/api/v1/radars): risk index 0-100 and 24h delta per radar\n- [One radar](https://orbstudio.org/api/v1/radar/geo): feed with source, time, weight, link (also: budget, crypto, energy)\n- [SSE stream](https://orbstudio.org/api/v1/stream): snapshot event, reconnect every 60 s\n\n## Radars\n- geo: Russia, China, USA — military, sanctions, diplomacy, elections (anchor: David)\n- budget: prices, rent, energy bills, rates in Germany/EU (anchor: Anna)\n- crypto: BTC/ETH/XRP news + Kraken ticker (anchor: Kai)\n- energy: Brent, gas, OPEC+, tanker routes (anchor: Lena)\n\n## Notes\n- Data refreshes every 5 minutes; please cache.\n- Exchange referral: Kraken, code ghqspfzq (/go/kraken). Not financial advice; crypto involves risk.\n";
