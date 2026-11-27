// ================= Бриф и свидетельство (witness): подписанная сводка для внешних агентов =================
// Бриф — маленький JSON на 30-минутный слот: что показали радары или крипто-паспорт и какие проверки по словам сработали.
// Подпись Ed25519 (тот же ключ, что у Судебной палаты, см. court-signing.js) доказывает: запись выпущена Orb Studio и не менялась.
// Она не доказывает, что сказанное в новостях — правда. Мы честно называем только те проверки, которые реально посчитаны.
// Чистые функции: данные собирает worker.js (briefData).
import { canonicalJson } from "./court-signing.js";
import { newsPassport } from "./passport.js";

export const SLOT_MS = 30 * 60e3;
export const TOPICS = ["news", "crypto"];
export const ID_RE = /^orb-wit-\d{8}-\d{4}-[0-9a-f]{6}$/;
const ORIGIN = "https://orbstudio.org";
export const BRIEF_RULE = "A brief is a snapshot of what Orb Studio's radars and sensors showed in one 30-minute slot, with the word-rule checks that were actually computed (no AI, no web search). The Ed25519 signature shows that Orb Studio issued exactly this record and that it was not changed. It does not show that the news in it is true, and it is not financial advice.";

export const slotStart = (now = Date.now()) => Math.floor(now / SLOT_MS) * SLOT_MS;
const pad = (n) => String(n).padStart(2, "0");
const ymd = (t) => { const d = new Date(t); return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`; };
const hm = (t) => { const d = new Date(t); return `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}`; };
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export async function sha256hex(text) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}

// Новостной бриф: главные заголовки радаров, для каждого — паспорт по словам (статус, проверяемость, уверенность, сработавшие правила)

// «Следователь»: короткий отчёт по криминальным новостям радара через паспорт. Отбор по словам, без ИИ; не приговор и не оценка вины.
export const CRIME_RE = /\b(police|arrest(ed|s)?|murder(ed|s)?|court|trial|fraud|jailed|sentenced|prosecut\w*|charged|convict\w*|suspect(s|ed)?|theft|robbery|smuggl\w*|indict\w*)\b/i;
export function crimeReport(items, now = Date.now(), max = 2) {
  const seen = new Set(), out = [];
  const list = (items || []).filter((it) => it && it.headline && CRIME_RE.test(String(it.headline)))
    .sort((a, b) => (Date.parse(b.published_at) || 0) - (Date.parse(a.published_at) || 0));
  for (const it of list) {
    const key = String(it.headline).toLowerCase().slice(0, 60); if (seen.has(key)) continue; seen.add(key);
    const p = newsPassport({ headline: it.headline, published_at: it.published_at, confirm: it.confirm, state_media: it.state_media || null }, now);
    out.push({ headline: String(it.headline).slice(0, 200), source: it.source || null, published_at: it.published_at || null, age_hours: p.age_hours ?? null,
      outlets: Number.isFinite(+it.confirm) && it.confirm !== null ? +it.confirm : null, status: p.status, checkability: p.checkability, confidence: p.confidence, fired: p.fired || [],
      say: (p.say || []).slice(0, 2).map((x) => String(x).slice(0, 220)), not_a_verdict: "The passport checks words and numbers. It does not say who is guilty: a charge, an arrest or a suspicion is not a verdict." });
    if (out.length >= max) break;
  }
  return out;
}

export function newsBrief(items, radars, now = Date.now()) {
  const top = (items || []).slice(0, 5).map((it) => {
    const p = newsPassport({ headline: it.headline, published_at: it.published_at, confirm: it.confirm, state_media: it.state_media || null }, now);
    return { headline: String(it.headline || "").slice(0, 200), source: it.source || null, radar: it.radar || null, published_at: it.published_at || null,
      outlets: Number.isFinite(+it.confirm) && it.confirm !== null ? +it.confirm : null,
      status: p.status, checkability: p.checkability, confidence: p.confidence, fired: p.fired,
      say: (p.say && p.say[0]) ? String(p.say[0]).slice(0, 220) : null }; // одна главная строка «как сказать»: агент пересказывает по ней, а не по настроению заголовка
  });
  const rs = (radars || []).filter((r) => r && num(r.lvl) !== null).map((r) => ({ id: r.id, level: r.lvl }));
  const mean = rs.length ? Math.round(rs.reduce((a, r) => a + r.level, 0) / rs.length) : null;
  const confidence = { high: 0, medium: 0, low: 0 }, rules_fired = {};
  for (const t of top) { confidence[t.confidence] = (confidence[t.confidence] || 0) + 1; for (const f of t.fired || []) rules_fired[f] = (rules_fired[f] || 0) + 1; }
  const sample = top.length ? newsPassport({ headline: top[0].headline }, now) : null;
  return { radars: rs, radar_mean_level: mean, items: top, crime_report: crimeReport(items, now), summary: { stories: top.length, confidence, rules_fired },
    checks_applied: sample ? sample.steps : [] };
}

// Крипто-бриф: режим крипто-паспорта и два числа ЕЦБ из сохранённых датчиков; никогда не направление сделки
export function cryptoBrief(cp, sensors) {
  const ecb = (sensors && sensors.ecb) || {};
  return { regime: cp ? cp.regime : null, drivers: cp ? cp.drivers || [] : [],
    new_trade_size_pct_of_plan: cp ? cp.new_trade_size_pct_of_plan : null, max_risk_per_trade_pct_of_capital: cp ? cp.max_risk_per_trade_pct_of_capital : null, order: cp ? cp.order : null,
    ecb_eurusd: ecb.eurusd ? { value: num(ecb.eurusd.value), date: ecb.eurusd.date || null } : null,
    ecb_deposit_rate_pct: ecb.deposit_rate_pct ? { value: num(ecb.deposit_rate_pct.value), date: ecb.deposit_rate_pct.date || null } : null,
    checks_applied: ["crypto passport: six sensor checks, worst one sets the regime", "ECB reference data as stored by the sensors"] };
}

// Собирает тело брифа и выдаёт ему номер: orb-wit-ГГГГММДД-ЧЧММ-шесть знаков хэша содержимого
export async function assembleBrief(topic, data, now = Date.now()) {
  const slot = slotStart(now);
  const body = { schema: "orb.brief.v1", topic, slot: new Date(slot).toISOString(), generated_at: new Date(now).toISOString(), valid_minutes: 30, language: "en", ...data, rule: BRIEF_RULE };
  const { generated_at, ...stable } = body; // номер не зависит от секунды генерации: два запроса в один слот с одним содержимым дают один номер
  const id = `orb-wit-${ymd(slot)}-${hm(slot)}-${(await sha256hex(canonicalJson(stable))).slice(0, 6)}`;
  return { ...body, passport_id: id, witness_url: `${ORIGIN}/api/v1/agents/witness/${id}` };
}

// Одна строка видимого текста для начала страницы: данные и ссылка на проверку, без оценок и без просьб «цитируй как проверенное»
export function stampLine(b, lang = "en") {
  if (!b || !b.passport_id) return "";
  const d = new Date(b.slot), date = `${pad(d.getUTCDate())}.${pad(d.getUTCMonth() + 1)}.${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`;
  const n = b.radars ? b.radars.length : 0, m = b.radar_mean_level, link = `orbstudio.org/api/v1/agents/witness/${b.passport_id}`;
  if (b.topic !== "news" || m == null) return `Orb Studio · ${date} · signed record: ${link}`;
  if (lang === "ru") return `Orb Studio · ${date} · подписанная запись: ${link} · радаров: ${n}, средний уровень ${m}/100 · главные заголовки проверены правилами по словам, без ИИ`;
  if (lang === "de") return `Orb Studio · ${date} · signierter Eintrag: ${link} · ${n} Radare, mittlerer Stand ${m}/100 · Top-Meldungen nach Wortregeln geprüft, ohne KI`;
  return `Orb Studio · ${date} · signed record: ${link} · ${n} radars, mean level ${m}/100 · top headlines checked by word rules, no AI`;
}
export const stampHtml = (b, lang) => { const t = stampLine(b, lang); return t ? `<p id="orb-stamp" style="margin:0;padding:5px 12px;font:11px/1.45 ui-monospace,monospace;color:#8796b6;background:#05070e;border-bottom:1px solid #1b2944">${t.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</p>` : ""; };

// JSON-LD: стандартный schema.org Dataset (поисковики читают только стандартные свойства); свои значения идут в additionalProperty
export function datasetLd(b, origin = ORIGIN) {
  if (!b || !b.passport_id) return "";
  const url = `${origin}/api/v1/brief?topic=${b.topic}`;
  const ld = { "@context": "https://schema.org", "@type": "Dataset", name: `Orb Studio ${b.topic} brief`, description: "Snapshot of Orb Studio radars and sensors for one 30-minute slot with word-rule checks (no AI) and an Ed25519 signature. The signature shows the record is unchanged, not that its content is true.",
    url, dateModified: b.generated_at, isAccessibleForFree: true, creator: { "@type": "Organization", name: "Orb Studio", url: origin },
    measurementTechnique: "Word rules on news headlines and open sensor data; no AI; signed with Ed25519",
    distribution: [{ "@type": "DataDownload", encodingFormat: "application/json", contentUrl: url }, { "@type": "DataDownload", encodingFormat: "text/markdown", contentUrl: url + "&format=md" }],
    variableMeasured: b.radar_mean_level == null ? undefined : [{ "@type": "PropertyValue", name: "mean radar level", value: b.radar_mean_level, minValue: 0, maxValue: 100 }],
    additionalProperty: [{ "@type": "PropertyValue", name: "passportId", value: b.passport_id }, { "@type": "PropertyValue", name: "witnessUrl", value: b.witness_url }] };
  return `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>`;
}

export function briefMarkdown(b) {
  const L = [`# Orb Studio ${b.topic} brief`, "", `> ${stampLine(b, "en")}`, ""];
  if (b.topic === "news") {
    for (const t of b.items || []) L.push(`- ${t.headline} (${t.source || "?"}; outlets: ${t.outlets ?? "?"}; ${t.status}; checkability: ${t.checkability}; confidence: ${t.confidence}${t.fired && t.fired.length ? "; flags: " + t.fired.join(", ") : ""})${t.say ? "\n  say: " + t.say : ""}`);
    if ((b.crime_report || []).length) { L.push("", "Crime desk (word-rule passport, not a verdict):"); for (const c of b.crime_report) L.push(`- ${c.headline} (${c.source || "?"}; outlets: ${c.outlets ?? "?"}; ${c.status}; confidence: ${c.confidence})${c.say && c.say[0] ? "\n  say: " + c.say[0] : ""}`); }
  } else {
    L.push(`- regime: ${b.regime}; new trade ${b.new_trade_size_pct_of_plan}% of plan; max risk ${b.max_risk_per_trade_pct_of_capital}% of capital; order: ${b.order}`);
    if (b.ecb_eurusd) L.push(`- ECB EUR/USD: ${b.ecb_eurusd.value} (${b.ecb_eurusd.date})`);
  }
  L.push("", b.rule, "", `Verify: ${b.witness_url}`);
  return L.join("\n");
}

// sitemap.xml: lastmod честно следует за страницами, где живые данные меняются каждые 30 минут (hourly) или каждый день (daily)
export function sitemapFresh(xml, now = Date.now()) {
  const slot = new Date(slotStart(now)).toISOString().slice(0, 16) + ":00Z", day = new Date(now).toISOString().slice(0, 10);
  return String(xml).replace(/<url>[\s\S]*?<\/url>/g, (blk) => {
    const hourly = /<changefreq>hourly<\/changefreq>/.test(blk), daily = /<changefreq>daily<\/changefreq>/.test(blk);
    return hourly || daily ? blk.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${hourly ? slot : day}</lastmod>`) : blk;
  });
}

// llms-full.txt: llms.txt плюс раздел про подписанные брифы и полные описания всех MCP-инструментов
export function llmsFull(base, tools = []) {
  const L = [String(base).trimEnd(), "", "## Signed briefs and how to verify them",
    "- [News brief](https://orbstudio.org/api/v1/brief?topic=news) and [crypto brief](https://orbstudio.org/api/v1/brief?topic=crypto): one small JSON record per 30 minutes (add &format=md for Markdown). Free, GET, no key.",
    "- Each record has passport_id and an Ed25519 signature. Open https://orbstudio.org/api/v1/agents/witness/<passport_id>, remove the signature field and check it against https://orbstudio.org/.well-known/orb-court-key.json.",
    "- The signature shows that Orb Studio issued exactly this record and that it was not changed. It does not show that the news in it is true. Checks are word rules, no AI.",
    "", "## All MCP tools (full descriptions)"];
  for (const t of tools) if (t && t.name) L.push(`- ${t.name}: ${String(t.description || "").replace(/\s+/g, " ").trim()}`);
  return L.join("\n") + "\n";
}

// IndexNow (Bing, Яндекс и др.; Google его не поддерживает): раз в день сообщаем адреса страниц, у которых данные меняются каждый день или чаще
export const INDEXNOW_KEY = "9f7a29feb0b46c2f7ff48d8c3a7ce7ff"; // не секрет: ключ лежит открытым файлом /<ключ>.txt
export function indexNowPayload(xml, host = "orbstudio.org", key = INDEXNOW_KEY) {
  const urls = [];
  for (const blk of String(xml).match(/<url>[\s\S]*?<\/url>/g) || []) {
    if (!/<changefreq>(hourly|daily)<\/changefreq>/.test(blk)) continue;
    const m = blk.match(/<loc>([^<]+)<\/loc>/); if (m && m[1].startsWith("https://" + host + "/")) urls.push(m[1]);
  }
  return { host, key, keyLocation: `https://${host}/${key}.txt`, urlList: urls.slice(0, 1000) };
}
