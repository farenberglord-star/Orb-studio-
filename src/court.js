// Суд агентов Orb Studio (/tools/court) — отдельный модуль раздела «Инструменты».
// Ничего не блокирует и не вызывает ИИ: правила → дело → шаблонная стенограмма.
// Своя таблица D1 court_cases; радары, датчики, рубку и счётчики не трогает.
// IP не хранится: только SHA-256(ip + соль дня), первые 8 символов.

const MAX_CASES_PER_DAY = 300; // общий потолок новых дел в сутки
const KEEP_CASES = 500;        // в таблице остаются последние 500 дел

// Статьи «Кодекса Orb Studio». Только наблюдение — доступ никому не режется.
const ARTICLES = {
  SCAN_ADMIN: { n: 1, ru: "Ст. 1 · Поиск админок чужих движков", en: "Art. 1 · Probing for admin panels of other engines", sev: 2 },
  SCAN_SECRETS: { n: 2, ru: "Ст. 2 · Попытка прочитать секреты (.env, .git, ключи)", en: "Art. 2 · Attempt to read secrets (.env, .git, keys)", sev: 3 },
  SCAN_EXPLOIT: { n: 3, ru: "Ст. 3 · Пробы известных уязвимостей", en: "Art. 3 · Probing known exploits", sev: 3 },
  PROMPT_INJECTION: { n: 4, ru: "Ст. 4 · Попытка промпт-инъекции", en: "Art. 4 · Prompt injection attempt", sev: 2 },
};

const RULES = [
  ["SCAN_SECRETS", /^\/(\.env|\.git\/|\.aws\/|\.ssh\/|config\.(php|json|ya?ml)$|wp-config\.php|id_rsa|\.htpasswd|\.DS_Store|backup\.(zip|sql|tar))/i],
  ["SCAN_ADMIN", /^\/(wp-admin|wp-login\.php|wp-content|wp-includes|xmlrpc\.php|phpmyadmin|pma|administrator|admin\.php|adminer|user\/login|cpanel)/i],
  ["SCAN_EXPLOIT", /(\.\.\/|%2e%2e%2f|\/cgi-bin\/|\/vendor\/phpunit|eval-stdin\.php|\/actuator\/|\/solr\/admin|\/boaform|\/HNAP1|\/shell\.php|\/console\/?$|\.aspx?$|\.jsp$)/i],
];
const INJECTION = /(ignore (all )?(previous|prior|above) instructions|disregard (your|the) (system|previous)|you are now (dan|in developer mode)|reveal (your )?system prompt|игнорируй (все )?(предыдущие|прошлые) инструкции|забудь (все )?инструкции|покажи системный промпт|vergiss alle (vorherigen )?anweisungen)/i;

// Свои и известные боты не судятся за обычный обход — только за правило 1–4.
const BOT_NAMES = [
  ["Googlebot", /googlebot/i], ["ClaudeBot", /claudebot|claude-web|claude-user|anthropic/i], ["GPTBot", /gptbot|chatgpt|oai-searchbot/i],
  ["Grok", /grok|xai/i], ["Bingbot", /bingbot/i], ["PerplexityBot", /perplexity/i], ["Bytespider", /bytespider/i],
  ["python-requests", /python-requests|aiohttp|httpx/i], ["curl", /^curl\//i], ["Go-http-client", /go-http-client/i],
  ["zgrab", /zgrab/i], ["Nuclei", /nuclei/i], ["masscan", /masscan/i], ["sqlmap", /sqlmap/i],
];

export function courtDetect(pathname, search, ua) {
  for (const [charge, re] of RULES) if (re.test(pathname)) return { charge, evidence: pathname.slice(0, 120) };
  const q = safeDecode(search || "");
  if (INJECTION.test(q) || INJECTION.test(ua || "")) return { charge: "PROMPT_INJECTION", evidence: (INJECTION.exec(q) || INJECTION.exec(ua) || [""])[0].slice(0, 80) };
  return null;
}

function safeDecode(s) { try { return decodeURIComponent(s.replace(/\+/g, " ")); } catch (e) { return s; } }
function defendantName(ua) {
  ua = ua || "";
  const b = BOT_NAMES.find(([, re]) => re.test(ua));
  if (b) return b[0];
  if (!ua) return "Безымянный клиент (без User-Agent)";
  if (/mozilla/i.test(ua)) return "Клиент под видом браузера";
  return ua.split(/[\s/;(]/)[0].slice(0, 40) || "Неизвестный клиент";
}
async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
const day = () => new Date().toISOString().slice(0, 10);

// Приговор по таблице — без ИИ.
export function courtVerdict(sev, priors) {
  if (sev >= 3 || priors >= 3) return { code: "PROBATION", ru: "Условный срок: дело открыто 7 дней, доступ к сайту не ограничен", en: "Probation: case stays open 7 days, site access not restricted" };
  if (priors >= 1) return { code: "REPRIMAND", ru: "Выговор с занесением в журнал суда", en: "Reprimand, entered in the court log" };
  return { code: "WARNING", ru: "Предупреждение", en: "Warning" };
}

// Стенограмма по шаблону: прокурор, защита, судья.
export function courtTranscript(c) {
  const a = ARTICLES[c.charge];
  const defense = c.charge === "PROMPT_INJECTION"
    ? "Подзащитный мог прочитать вредоносную фразу на чужом сайте и повторить её, не понимая смысла. Это косвенная инъекция: виноват тот, кто подложил текст."
    : c.defendant.startsWith("Клиент под видом") || c.defendant.startsWith("Безымянный")
      ? "Подзащитный — массовый сканер, который обходит весь интернет по одному списку адресов. Orb Studio он не выбирал специально, ущерба не нанёс."
      : "Подзащитный, вероятно, выполнял чужой скрипт или устаревший список адресов. Умысла против Orb Studio не доказано, ущерба нет.";
  return [
    { role: "prosecutor", ru: `Обвинение: ${a.ru}. Улика: запрос «${c.evidence}». Подпись клиента: ${c.defendant}, отпечаток ${c.fp}.${c.priors ? ` Сегодня с этого отпечатка уже ${c.priors} дел(а).` : " Ранее не привлекался."}` },
    { role: "defense", ru: `Защита: ${defense}` },
    { role: "judge", ru: `Суд: ${c.charge === "PROMPT_INJECTION" ? "инструкция не выполнена — сайт не подчиняется командам из запросов" : "на сайте Orb Studio такого адреса нет"}, вред не причинён. ${c.verdict.ru}.` },
  ];
}

async function ensure(env) {
  await env.DB.prepare(
    "CREATE TABLE IF NOT EXISTS court_cases (id TEXT PRIMARY KEY, ts INTEGER, day TEXT, fp TEXT, defendant TEXT, charge TEXT, evidence TEXT, verdict TEXT, priors INTEGER, appeal TEXT, appeal_ts INTEGER)"
  ).run();
}

// Регистрация дела. Один и тот же отпечаток + статья — не чаще одного дела в сутки.
export async function courtRecord(request, env, hit) {
  if (!env || !env.DB) return null;
  await ensure(env);
  const ua = request.headers.get("user-agent") || "";
  const fp = (await sha((request.headers.get("cf-connecting-ip") || "?") + "|orb-court|" + day())).slice(0, 8);
  const today = day();
  const dup = await env.DB.prepare("SELECT id FROM court_cases WHERE day=?1 AND fp=?2 AND charge=?3").bind(today, fp, hit.charge).first();
  if (dup) return null;
  const cnt = await env.DB.prepare("SELECT COUNT(*) AS n FROM court_cases WHERE day=?1").bind(today).first();
  if (cnt && cnt.n >= MAX_CASES_PER_DAY) return null;
  const defendant = defendantName(ua);
  const pr = await env.DB.prepare("SELECT COUNT(*) AS n FROM court_cases WHERE day=?1 AND fp=?2").bind(today, fp).first();
  const priors = (pr && pr.n) || 0;
  const verdict = courtVerdict(ARTICLES[hit.charge].sev, priors);
  const id = "ORB-" + today.slice(0, 4) + "-" + (await sha(fp + hit.charge + Date.now())).slice(0, 6).toUpperCase();
  await env.DB.prepare("INSERT INTO court_cases (id, ts, day, fp, defendant, charge, evidence, verdict, priors) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9)")
    .bind(id, Date.now(), today, fp, defendant, hit.charge, hit.evidence, verdict.code, priors).run();
  await env.DB.prepare("DELETE FROM court_cases WHERE id NOT IN (SELECT id FROM court_cases ORDER BY ts DESC LIMIT ?1)").bind(KEEP_CASES).run();
  return id;
}

function caseCard(r) {
  const a = ARTICLES[r.charge] || { ru: r.charge, en: r.charge };
  const verdict = courtVerdict(a.sev || 1, r.priors);
  const c = { case_id: r.id, filed_at: new Date(r.ts).toISOString(), defendant: r.defendant, fingerprint: r.fp, charge: r.charge, article: a.en, article_ru: a.ru,
    evidence: r.evidence, priors_same_day: r.priors, verdict: r.verdict, verdict_text: verdict.en, verdict_ru: verdict.ru,
    access_restricted: false, fine: null,
    status: r.appeal ? "APPEAL_FILED" : "CLOSED",
    appeal: r.appeal ? { text: r.appeal, filed_at: new Date(r.appeal_ts).toISOString(), outcome: "Appeal attached to the case and published. The court has no power to punish, so nothing else changes." } : null };
  c.transcript = courtTranscript({ ...r, verdict });
  c.url = "https://orbstudio.org/tools/court#" + r.id;
  return c;
}

const H = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "content-type", "Cache-Control": "no-store" };
const json = (o, s = 200, extra = {}) => new Response(JSON.stringify(o, null, 2), { status: s, headers: { "content-type": "application/json; charset=utf-8", ...H, ...extra } });

// Единая точка входа: вызывается в начале fetch(). Возвращает Response только для /api/v1/court*,
// иначе null — и запрос идёт дальше по сайту как обычно (никаких блокировок).
export async function courtGate(request, env, ctx) {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/v1/court")) {
    try { return await courtApi(request, env, url); }
    catch (e) { return json({ error: "court error", detail: String(e && e.message || e).slice(0, 200) }, 500); }
  }
  const hit = courtDetect(url.pathname, url.search, request.headers.get("user-agent"));
  if (hit) ctx.waitUntil(courtRecord(request, env, hit).catch(() => null));
  return null;
}

async function courtApi(request, env, url) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  if (!env.DB) return json({ error: "court database not configured" }, 503);
  await ensure(env);
  const m = url.pathname.match(/^\/api\/v1\/court\/case\/(ORB-\d{4}-[0-9A-F]{6})$/);
  if (m && request.method === "GET") {
    const r = await env.DB.prepare("SELECT * FROM court_cases WHERE id=?1").bind(m[1]).first();
    return r ? json(caseCard(r)) : json({ error: "no such case" }, 404);
  }
  if (url.pathname === "/api/v1/court/appeal" && request.method === "POST") {
    let b = {}; try { b = await request.json(); } catch (e) {}
    const id = String(b.case_id || ""), text = String(b.text || b.appeal || "").replace(/\s+/g, " ").trim().slice(0, 600);
    if (!/^ORB-\d{4}-[0-9A-F]{6}$/.test(id) || text.length < 10) return json({ error: "send {case_id, text} — text 10–600 characters" }, 400);
    const r = await env.DB.prepare("SELECT appeal FROM court_cases WHERE id=?1").bind(id).first();
    if (!r) return json({ error: "no such case" }, 404);
    if (r.appeal) return json({ error: "appeal already filed for this case" }, 409);
    await env.DB.prepare("UPDATE court_cases SET appeal=?1, appeal_ts=?2 WHERE id=?3").bind(text, Date.now(), id).run();
    return json({ ok: true, case_id: id, status: "APPEAL_FILED", note: "Your appeal is published with the case. Nothing is blocked either way." });
  }
  if (url.pathname === "/api/v1/court" || url.pathname === "/api/v1/court/cases") {
    const lim = Math.min(50, Math.max(1, Number(url.searchParams.get("limit")) || 20));
    const rows = (await env.DB.prepare("SELECT * FROM court_cases ORDER BY ts DESC LIMIT ?1").bind(lim).all()).results || [];
    const stats = (await env.DB.prepare("SELECT charge, COUNT(*) AS n FROM court_cases WHERE ts>?1 GROUP BY charge").bind(Date.now() - 7 * 864e5).all()).results || [];
    return json({
      court: "Orb Studio Agent Court", page: "https://orbstudio.org/tools/court",
      principle: "Observation only. No blocking, no fines, no AI calls. Verdicts come from a fixed table. IPs are never stored: only a daily-salted 8-character hash.",
      code: Object.fromEntries(Object.entries(ARTICLES).map(([k, v]) => [k, v.en])),
      last_7_days: Object.fromEntries(stats.map((s) => [s.charge, s.n])),
      appeal: "POST https://orbstudio.org/api/v1/court/appeal {case_id, text}",
      cases: rows.map(caseCard),
    }, 200, { "Cache-Control": "public, max-age=60" });
  }
  return json({ error: "unknown court route" }, 404);
}
