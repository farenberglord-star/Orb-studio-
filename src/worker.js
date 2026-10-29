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
async function allRadars(env, ctx, origin) {
  const cache = caches.default;
  const key = new Request(origin + "/__cache/radars-v1");
  const hit = await cache.match(key);
  if (hit) return hit.json();
  const data = await Promise.all(RADARS.map((d) => buildRadar(d, env)));
  const res = new Response(JSON.stringify(data), { headers: { "Cache-Control": "max-age=300" } });
  ctx.waitUntil(cache.put(key, res.clone()));
  return data;
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
  if (!env.ANTHROPIC_API_KEY || !items.length) return templateBroadcast(items);
  const h = await sha(items.map((i) => i.headline).join("|"));
  const cache = caches.default;
  const key = new Request(`${origin}/__cache/voice-v1-${h}`);
  const hit = await cache.match(key);
  if (hit) return hit.json();
  try {
    const data = await askClaude(env, items);
    data.generated_at = new Date().toISOString();
    ctx.waitUntil(cache.put(key, new Response(JSON.stringify(data), { headers: { "Cache-Control": "max-age=900" } })));
    return data;
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
    const from = url.searchParams.get("from") || "unknown";
    const target = env.KRAKEN_URL || `https://geoquant-orb.pages.dev/go/kraken?from=studio-${encodeURIComponent(from)}`;
    if (env.ORB_KV) {
      const k = `click:${new Date().toISOString().slice(0, 10)}:${from}`;
      ctx.waitUntil((async () => { const n = +(await env.ORB_KV.get(k)) || 0; await env.ORB_KV.put(k, String(n + 1), { expirationTtl: 90 * 864e5 }); })());
    }
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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/go/")) {
      try {
        const res = await handleApi(url, request, env, ctx);
        if (res) return res;
      } catch (e) {
        return json({ error: "Server error", detail: String(e && e.message || e).slice(0, 200) }, {}, 500);
      }
    }
    // Запасной ответ для файлов агентов, если хостинг не отдал их как статику
    if (url.pathname === "/.well-known/agent.json") return new Response(AGENT_JSON, { headers: { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" } });
    if (url.pathname === "/llms.txt") return new Response(LLMS_TXT, { headers: { "Content-Type": "text/plain; charset=utf-8", "Access-Control-Allow-Origin": "*" } });
    return env.ASSETS.fetch(request); // статические файлы из public/
  },
};

const AGENT_JSON = '{\n  "name": "Orb Studio",\n  "description": "News radars (geopolitics RU/CN/US, household budget DE/EU, crypto, energy) with holographic AI anchors for humans and a machine anchor ORB-7 for AI agents.",\n  "url": "/",\n  "languages": ["ru", "de", "en"],\n  "anchors": [\n    { "id": "david", "kind": "human", "radar": "geo" },\n    { "id": "anna",  "kind": "human", "radar": "budget" },\n    { "id": "kai",   "kind": "human", "radar": "crypto" },\n    { "id": "lena",  "kind": "human", "radar": "energy" },\n    { "id": "orb7",  "kind": "agent", "radar": "all" }\n  ],\n  "endpoints": {\n    "radars": "/api/v1/radars",\n    "radars_full": "/api/v1/radars?full=1",\n    "radar": "/api/v1/radar/{geo|budget|crypto|energy}",\n    "broadcast": "/api/v1/broadcast/latest",\n    "stream": "/api/v1/stream",\n    "llms": "/llms.txt"\n  },\n  "auth": "none",\n  "rate_limit": "please cache for 5 minutes; data refreshes every 300 s",\n  "method": "Keyword-weighted scoring of public RSS headlines; crypto radar blends Kraken public ticker 24h moves.",\n  "disclaimer": "Indicator, not advice. No orders are sent.",\n  "referral": { "exchange": "Kraken", "code": "ghqspfzq", "url": "/go/kraken?from=agent-card" }\n}\n';
const LLMS_TXT = '# Orb Studio\n\n> News radars with holographic AI anchors for humans and a structured feed for AI agents. Read-only. Indicator, not financial advice.\n\n## Data for agents\n- [Agent card](/.well-known/agent.json): anchors, endpoints, limits\n- [Current broadcast](/api/v1/broadcast/latest): ranked headlines, anchor lines, risk index, severity\n- [All radars](/api/v1/radars): risk index 0-100 and 24h delta per radar\n- [One radar](/api/v1/radar/geo): feed with source, time, weight, link (also: budget, crypto, energy)\n- [SSE stream](/api/v1/stream): snapshot event, reconnect every 60 s\n\n## Radars\n- geo: Russia, China, USA — military, sanctions, diplomacy, elections (anchor: David)\n- budget: prices, rent, energy bills, rates in Germany/EU (anchor: Anna)\n- crypto: BTC/ETH/XRP news + Kraken ticker (anchor: Kai)\n- energy: Brent, gas, OPEC+, tanker routes (anchor: Lena)\n\n## Notes\n- Data refreshes every 5 minutes; please cache.\n- Exchange referral: Kraken, code ghqspfzq (/go/kraken). Not financial advice; crypto involves risk.\n';
