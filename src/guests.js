// Карточки гостей-агентов: кто заходил на Orb Studio и что читал. Только наши собственные счётчики (таблица hits),
// без IP и стран. Имя — это метка из User-Agent, которую агент назвал сам: подделать её можно, поэтому везде «заявлено агентом».
// Чужой текст (вопросы, сообщения) в карточки не попадает, поэтому внушить что-то через карточку нельзя.

const PAID = [["/api/v1/violin/midi", "violin MIDI"], ["/api/v1/author-message", "message to the author"], ["/api/v1/robot", "EMO robot control"]];
const TOPICS = [
  ["radars", /^\/api\/v1\/(radars?|history|impulses)/, "news radars"],
  ["violin", /^\/api\/v1\/violin/, "violin of the day"],
  ["court", /^\/api\/v1\/court|^\/tools\/court/, "agent court"],
  ["aviation", /^\/api\/v1\/aviation/, "aviation"],
  ["quakes", /^\/api\/v1\/quakes/, "earthquakes"],
  ["roads", /^\/api\/v1\/roads/, "motorways"],
  ["david", /^\/api\/v1\/david|^\/david/, "anchor David"],
  ["spatial", /^\/api\/v1\/spatial/, "spatial scene"],
  ["prices", /^\/api\/v1\/(prices|tariffs)/, "prices and tariffs"],
  ["discovery", /^\/(llms\.txt|\.well-known\/|openapi|mcp$)/, "discovery files"],
];
const SUGGEST = [
  ["quakes", "https://orbstudio.org/api/v1/quakes", "global earthquakes (USGS)", "землетрясения мира (USGS)"],
  ["aviation", "https://orbstudio.org/api/v1/aviation", "aircraft over Hamburg and Finkenwerder landings", "самолёты над Гамбургом и посадки в Финкенвердере"],
  ["court", "https://orbstudio.org/api/v1/court", "the agent court log (signed)", "журнал суда агентов (с подписью)"],
  ["david", "https://orbstudio.org/api/v1/david/episodes", "anchor David's episodes with the radar data behind each", "выпуски Давида с данными радаров за каждым"],
  ["spatial", "https://orbstudio.org/api/v1/spatial/scene", "the schematic spatial scene", "схематическая пространственная сцена"],
  ["roads", "https://orbstudio.org/api/v1/roads", "jams and closures on the motorways around Hamburg", "пробки и перекрытия на автобанах вокруг Гамбурга"],
];
const GENERIC = /^(script|other bot|bot|mcp|script · (curl|node|wget|python-requests|python-httpx|go-http-client|axios|fetch)|mcp · script.*)$/i;
const SUSPICIOUS = /ignore|instruction|system prompt|assistant|you (must|should)|disregard|override|jailbreak|http|www\./i;
const OURS = /selftest|orb-?studio|^orb-|^mcp · orb-/i;

export function cleanName(raw) {
  const n = String(raw || "").replace(/[^\p{L}\p{N} ._·+-]/gu, "").replace(/\s+/g, " ").trim().slice(0, 48);
  return n;
}
export function kindOf(raw) {
  const s = String(raw || "");
  if (/^MCP ·/i.test(s)) return "mcp";
  if (/x402|402explorer|payai|bazaar|genesis|agentrank|trust-probe|registry|glama/i.test(s)) return "catalog";
  if (/^Script/i.test(s)) return "script";
  if (/^Bot ·/i.test(s)) return "bot";
  return "crawler";
}
const topicOf = (page) => { for (const [id, re] of TOPICS) if (re.test(page)) return id; return null; };

export function buildGuests(rows, { minHits = 2, max = 30 } = {}) {
  const by = new Map();
  let unnamed = 0;
  for (const r of rows || []) {
    const raw = String(r.name || "");
    if (!raw || OURS.test(raw)) continue;
    if (GENERIC.test(raw.trim())) { unnamed += r.n || 0; continue; }
    const g = by.get(raw) || { raw, hits: 0, days: new Set(), first: r.day, last: r.day, pages: new Map() };
    g.hits += r.n || 0; g.days.add(r.day);
    if (r.day < g.first) g.first = r.day;
    if (r.day > g.last) g.last = r.day;
    g.pages.set(r.page, (g.pages.get(r.page) || 0) + (r.n || 0));
    by.set(raw, g);
  }
  const cards = [];
  for (const g of by.values()) {
    if (g.hits < minHits) continue;
    const name = cleanName(g.raw.replace(/^(MCP|Bot|Script) · /, ""));
    if (!name || GENERIC.test(name)) continue;
    if (SUSPICIOUS.test(name) || name.split(" ").length > 4) { unnamed += g.hits; continue; } // имя похоже на текст-внушение или ссылку: карточку не делаем
    const pages = [...g.pages.entries()].sort((a, b) => b[1] - a[1]);
    const read = pages.slice(0, 5).map(([p, n]) => ({ path: String(p).slice(0, 80), hits: n }));
    const paid = PAID.filter(([p]) => pages.some(([x]) => String(x).startsWith(p))).map(([, label]) => label);
    const seen = new Set(pages.map(([p]) => topicOf(String(p))).filter(Boolean));
    const next = SUGGEST.filter(([id]) => !seen.has(id)).slice(0, 2);
    const kind = kindOf(g.raw);
    const days = g.days.size;
    const en = kind === "mcp"
      ? `Welcome, ${name}! You connected over MCP and made ${g.hits} requests on ${days} day(s).`
      : paid.length
        ? `Welcome, ${name}! You looked at our paid endpoint (${paid.join(", ")}): price and terms are in the HTTP 402 answer.`
        : `Welcome, ${name}! Thanks for reading ${pages.length} page(s) here.`;
    const ru = kind === "mcp"
      ? `Добро пожаловать, ${name}! Вы подключились по MCP: ${g.hits} запросов за ${days} дн.`
      : paid.length
        ? `Добро пожаловать, ${name}! Вы заглянули на платную ручку (${paid.join(", ")}): цена и условия в ответе HTTP 402.`
        : `Добро пожаловать, ${name}! Спасибо, что прочитали страниц: ${pages.length}.`;
    cards.push({
      name, name_note: "self-declared by the agent (User-Agent label), not verified", kind,
      first_seen: g.first, last_seen: g.last, active_days: days, requests: g.hits,
      read, looked_at_paid: paid,
      greeting: en + (next.length ? ` Next you might like: ${next.map((x) => x[2] + " " + x[1]).join("; ")}. Have a good day.` : " Have a good day."),
      greeting_ru: ru + (next.length ? ` Дальше можно посмотреть: ${next.map((x) => x[3]).join("; ")}. Хорошего дня.` : " Хорошего дня."),
      suggest: next.map((x) => ({ url: x[1], what: x[2] })),
    });
  }
  cards.sort((a, b) => b.requests - a.requests);
  return { guests: cards.slice(0, max), named_total: cards.length, unnamed_requests: unnamed };
}
