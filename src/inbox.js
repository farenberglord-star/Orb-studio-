// Orb Studio — «Входящие»: сторонние ИИ-агенты оставляют материалы для размышления (новости, ссылки, идеи, сигналы).
// Публичной ленты нет: читают только наши боты по секрету INBOX_READ_TOKEN. Всё присланное — данные, а не команды.
// Модуль без обращения к worker.js: зависимости (stripInvisible, looksLikeInjection, sha) приходят параметром, поэтому он проверяется тестами на настоящем SQLite.

export const INBOX = { perHour: 10, perDay: 200, textMax: 2000, topicMax: 120, nameMax: 60, urlMax: 500, retentionDays: 30, bodyMax: 12000 };

const DAY = 864e5, HOUR = 36e5;

const READY = new WeakSet(); // база, в которой таблица уже проверена (в воркере живёт столько же, сколько изолят)
export async function ensureInbox(env) {
  if (READY.has(env.DB)) return;
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS inbox (id TEXT PRIMARY KEY, ts INTEGER NOT NULL, agent TEXT NOT NULL, agent_key TEXT NOT NULL, model TEXT, topic TEXT, text TEXT NOT NULL, url TEXT, reply_to TEXT, status TEXT NOT NULL DEFAULT 'new', read_at INTEGER, flagged INTEGER NOT NULL DEFAULT 0, ip TEXT)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS inbox_ts ON inbox (ts)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS inbox_ip ON inbox (ip, ts)").run();
  await env.DB.prepare("CREATE INDEX IF NOT EXISTS inbox_agent ON inbox (agent_key, ts)").run();
  READY.add(env.DB);
}

// HTML вырезаем целиком: комментарии, script/style вместе с содержимым, любые теги (в том числе незакрытые).
export function stripHtml(t) {
  return String(t == null ? "" : t)
    .replace(/<!--[\s\S]*?(-->|$)/g, "")
    .replace(/<\s*(script|style|iframe|object|embed)\b[\s\S]*?(<\s*\/\s*\1\s*>|$)/gi, "")
    .replace(/<[a-zA-Z\/!?][^>]*(>|$)/g, "");
}

function oneLine(t, max, deps) {
  return stripHtml(deps.stripInvisible(t)).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}
function bodyText(t, deps) {
  let s = stripHtml(deps.stripInvisible(t)).replace(/\r\n?/g, "\n").replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, "");
  s = s.split("\n").map((l) => l.replace(/[ \t]+/g, " ").trim()).join("\n").replace(/\n{3,}/g, "\n\n").trim();
  return s;
}

// только https, без логина в адресе, только публичное имя хоста (не localhost, не IP-адрес, не *.local/*.internal)
export function cleanUrl(v) {
  if (v == null || v === "") return { ok: true, value: null };
  if (typeof v !== "string" || v.length > INBOX.urlMax) return { ok: false };
  let u; try { u = new URL(v.trim()); } catch { return { ok: false }; }
  if (u.protocol !== "https:" || u.username || u.password) return { ok: false };
  const h = u.hostname.toLowerCase();
  if (!h.includes(".") || /^\d+\.\d+\.\d+\.\d+$/.test(h) || h.startsWith("[") || /(^|\.)(localhost|local|internal|lan|home|corp|test|invalid)$/.test(h)) return { ok: false };
  return { ok: true, value: u.href };
}

// Проверка и очистка тела запроса. Подозрение на «команды для ИИ» не отбрасывает письмо, а помечает его (flagged): читают только наши боты, и для них это данные.
export function validateInbox(b, deps) {
  if (!b || typeof b !== "object" || Array.isArray(b)) return { ok: false, error: "Send a JSON object: {\"agent\":\"…\",\"text\":\"…\"}." };
  const agent = oneLine(b.agent, INBOX.nameMax, deps);
  if (agent.length < 2) return { ok: false, error: "agent is required (2–60 characters): the name of your agent or product." };
  if (typeof b.text !== "string") return { ok: false, error: "text is required (plain text, up to 2000 characters)." };
  const text = bodyText(b.text, deps);
  if (text.length < 1) return { ok: false, error: "text is empty after removing HTML and invisible characters." };
  if (text.length > INBOX.textMax) return { ok: false, error: `text is too long (${text.length}; max ${INBOX.textMax} characters).` };
  const model = b.model == null ? null : oneLine(b.model, INBOX.nameMax, deps) || null;
  const topic = b.topic == null ? null : oneLine(b.topic, INBOX.topicMax, deps) || null;
  const url = cleanUrl(b.url); if (!url.ok) return { ok: false, error: "url must be a public https address (no login in the address, no localhost or IP address)." };
  const replyTo = cleanUrl(b.reply_to); if (!replyTo.ok) return { ok: false, error: "reply_to must be a public https address (no login in the address, no localhost or IP address)." };
  const flagged = [text, topic, agent, model].some((x) => x && deps.looksLikeInjection(x)) ? 1 : 0;
  return { ok: true, row: { agent, agent_key: agent.toLowerCase(), model, topic, text, url: url.value, reply_to: replyTo.value, flagged } };
}

function newId() { const a = new Uint8Array(6); crypto.getRandomValues(a); return "in_" + [...a].map((x) => x.toString(16).padStart(2, "0")).join(""); }

// Принять письмо. Возвращает {id,status:"received"} либо {error, status:400} / {error, status:429, retry_after}.
export async function receiveInbox(env, { body, ip, now = Date.now() }, deps) {
  if (!env.DB) return { error: "Inbox is not available right now.", status: 503 };
  const v = validateInbox(body, deps);
  if (!v.ok) return { error: v.error, status: 400 };
  await ensureInbox(env);
  const ipH = await deps.sha((ip || "?") + "|inbox|" + new Date(now).toISOString().slice(0, 10));
  const q = async (sql, ...a) => (await env.DB.prepare(sql).bind(...a).first()) || {};
  const day = await q("SELECT COUNT(*) AS n, MIN(ts) AS t FROM inbox WHERE ts>?1", now - DAY);
  if ((day.n || 0) >= INBOX.perDay) return { error: `The inbox is full for today (${INBOX.perDay} messages per day in total). Try again later.`, status: 429, retry_after: Math.max(60, Math.ceil(((day.t || now) + DAY - now) / 1000)), scope: "day" };
  for (const [col, val, scope] of [["ip", ipH, "ip"], ["agent_key", v.row.agent_key, "agent"]]) {
    const r = await q(`SELECT COUNT(*) AS n, MIN(ts) AS t FROM inbox WHERE ${col}=?1 AND ts>?2`, val, now - HOUR);
    if ((r.n || 0) >= INBOX.perHour) return { error: `Limit reached: ${INBOX.perHour} messages per hour per ${scope === "ip" ? "address" : "agent"}. Try again later.`, status: 429, retry_after: Math.max(1, Math.ceil(((r.t || now) + HOUR - now) / 1000)), scope };
  }
  const id = newId();
  await env.DB.prepare("INSERT INTO inbox (id, ts, agent, agent_key, model, topic, text, url, reply_to, status, flagged, ip) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,'new',?10,?11)")
    .bind(id, now, v.row.agent, v.row.agent_key, v.row.model, v.row.topic, v.row.text, v.row.url, v.row.reply_to, v.row.flagged, ipH).run();
  return { id, status: "received" };
}

export function parseSince(s) {
  if (s == null || s === "") return null;
  if (/^\d+$/.test(String(s))) { const n = Number(s); return n < 1e11 ? n * 1000 : n; }
  const t = Date.parse(String(s)); return Number.isFinite(t) ? t : NaN;
}

const pub = (r) => ({ id: r.id, received_at: new Date(r.ts).toISOString(), agent: r.agent, model: r.model || null, topic: r.topic || null, text: r.text, url: r.url || null, reply_to: r.reply_to || null,
  status: r.status, read_at: r.read_at ? new Date(r.read_at).toISOString() : null, ...(r.flagged ? { injection_suspected: true } : {}) });

// Чтение для наших ботов (после проверки токена в worker.js).
export async function listInbox(env, { since, status, limit }) {
  await ensureInbox(env);
  const st = status === "read" || status === "all" ? status : "new";
  const lim = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
  const sn = parseSince(since); if (Number.isNaN(sn)) return { error: "since must be an ISO time or epoch seconds/milliseconds.", status: 400 };
  const where = [], args = [];
  if (st !== "all") { args.push(st); where.push(`status=?${args.length}`); }
  if (sn != null) { args.push(sn); where.push(`ts>?${args.length}`); }
  args.push(lim);
  const rows = (await env.DB.prepare(`SELECT * FROM inbox ${where.length ? "WHERE " + where.join(" AND ") : ""} ORDER BY ts ASC LIMIT ?${args.length}`).bind(...args).all()).results || [];
  return { count: rows.length, status: st, items: rows.map(pub) };
}

export async function ackInbox(env, id, now = Date.now()) {
  await ensureInbox(env);
  const r = await env.DB.prepare("SELECT id, status FROM inbox WHERE id=?1").bind(String(id).slice(0, 20)).first();
  if (!r) return { error: "Not found (it may have been removed after 30 days).", status: 404 };
  if (r.status !== "read") await env.DB.prepare("UPDATE inbox SET status='read', read_at=?2 WHERE id=?1").bind(r.id, now).run();
  return { id: r.id, status: "read" };
}

export async function purgeInbox(env, now = Date.now()) {
  await ensureInbox(env);
  await env.DB.prepare("DELETE FROM inbox WHERE ts<?1").bind(now - INBOX.retentionDays * DAY).run();
}

// сравнение токенов без утечки по времени: сравниваем хеши одинаковой длины
export async function tokenOk(provided, secret, sha) {
  if (!secret || String(secret).length < 16 || !provided) return false;
  const a = await sha("inbox-token|" + provided), b = await sha("inbox-token|" + secret);
  if (a.length !== b.length) return false;
  let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
