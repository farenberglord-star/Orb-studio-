// ================= Глубокая проверка заголовка: GET /api/v1/check/deep?headline=… за 0,02 USDC (x402 v2, Base) =================
// Бесплатная /api/v1/check ищет тот же сюжет в Bing News за 2 дня на языке заголовка.
// Глубокая: заголовок переводится на EN/DE/RU (Claude Haiku), поиск на трёх языках за 7 дней, до 20 изданий со ссылками,
// самая ранняя публикация, официальные источники (сайты правительств, ЕС, ЦБ, ООН и т. п.) отдельно.
// Это мера распространения, а не истины: сайт не переписывает новости и не выносит вердикт «правда/ложь».
import { CORS } from "./violin-sale.js";
import { paidFlow, paymentRequiredFor } from "./x402-flow.js";

export const DEEP_PRICE_ATOMIC = "20000"; // 0,02 USDC
export const DEEP_PRICE_USD = 0.02;
const ORIGIN = "https://orbstudio.org";
export const DEEP_RESOURCE = ORIGIN + "/api/v1/check/deep";
export const DEEP_WINDOW_DAYS = 7;
export const LANGS = { en: "en-US", de: "de-DE", ru: "ru-RU" };
const DESCRIPTION = "Deep headline check for AI agents: the headline is translated to English, German and Russian and searched in Bing News for 7 days; returns up to 20 outlets with links and language, the earliest publication, official sources (governments, EU, central banks, UN…) listed separately, verdict and tone. Measures how widely a story is reported, not whether it is true. Free 2-day single-language check: " + ORIGIN + "/api/v1/check";
export const DEEP_RULE = "Measures how widely a story is reported by news outlets in EN/DE/RU over 7 days, not whether it is true. Matching is by shared key words per language, so a rephrased rumour may be missed and an unrelated story with the same words may match. official = the link points to a government, parliament, central bank or international organisation site. Orb Studio never rewrites the news.";

// ---------- чистые помощники ----------
export function realLink(link) {
  const s = String(link || "");
  try { const u = new URL(s); if (/bing\.com$/i.test(u.hostname) && u.searchParams.get("url")) return u.searchParams.get("url"); } catch (e) {}
  return s || null;
}
export function hostOf(link) { try { return new URL(link).hostname.toLowerCase().replace(/^www\./, ""); } catch (e) { return null; } }
const OFFICIAL_RE = /(^|\.)(gov(\.[a-z]{2})?|gob\.[a-z]{2}|gouv\.fr|gc\.ca|admin\.ch|gv\.at|bund\.de|bundesregierung\.de|bundestag\.de|bundesbank\.de|bafin\.de|destatis\.de|europa\.eu|europarl\.europa\.eu|ecb\.europa\.eu|federalreserve\.gov|bankofengland\.co\.uk|parliament\.uk|un\.org|who\.int|nato\.int|imf\.org|worldbank\.org|oecd\.org|opec\.org|iaea\.org|icj-cij\.org|icc-cpi\.int|kremlin\.ru|government\.ru|mid\.ru|cbr\.ru|president\.gov\.ua)$/i;
export const isOfficial = (link) => { const h = hostOf(link); return !!h && OFFICIAL_RE.test(h); };
export const deepVerdict = (n) => (n >= 3 ? "confirmed" : n === 2 ? "two_sources" : n === 1 ? "single_source" : "not_found");
export function langOf(text) { return /[а-яё]/i.test(text) ? "ru" : /[äöüß]/i.test(text) ? "de" : "en"; }

// Ответ Claude → { en, de, ru }; всё, что не похоже на перевод, отбрасываем
export function parseTranslations(raw, original) {
  const out = {}; const lang = langOf(original); out[lang] = original;
  let j = null;
  try { const m = String(raw || "").match(/\{[\s\S]*\}/); j = m ? JSON.parse(m[0]) : null; } catch (e) {}
  for (const k of Object.keys(LANGS)) {
    if (k === lang) continue;
    const v = j && typeof j[k] === "string" ? j[k].replace(/\s+/g, " ").trim() : "";
    if (v.length >= 8 && v.length <= 400) out[k] = v.slice(0, 300);
  }
  return out;
}

// searches: [{ lang, text, items: [{ title, link, source, ts }] }]; sigOf/srcKey — функции сайта
export function mergeDeep(searches, { sigOf, srcKey, now = Date.now(), max = 20 }) {
  const seen = new Map();
  for (const s of searches) {
    const sig = sigOf(s.text); const need = sig.size <= 7 ? 2 : 3;
    for (const it of s.items || []) {
      if (!it.title || !it.source) continue;
      if (it.ts && now - it.ts > (DEEP_WINDOW_DAYS + 0.5) * 864e5) continue;
      const t = sigOf(it.title); let k = 0; for (const x of sig) if (t.has(x)) k++;
      if (k < need) continue;
      const key = srcKey(it.source); if (!key) continue;
      const link = realLink(it.link);
      const prev = seen.get(key);
      const row = { outlet: String(it.source).slice(0, 60), title: String(it.title).slice(0, 200), link, language: s.lang, published: it.ts ? new Date(it.ts).toISOString() : null, official: isOfficial(link) };
      if (!prev || (it.ts && (!prev.published || it.ts < Date.parse(prev.published)))) seen.set(key, row); // у издания оставляем самую раннюю публикацию
    }
  }
  const all = [...seen.values()].sort((a, b) => (a.published && b.published ? Date.parse(a.published) - Date.parse(b.published) : a.published ? -1 : 1));
  const n = all.length;
  const languages = [...new Set(all.map((o) => o.language))];
  return {
    outlets_found: n, verdict: deepVerdict(n), languages_found: languages,
    earliest: all.find((o) => o.published) || null,
    official_sources: all.filter((o) => o.official).slice(0, 10),
    outlets: all.slice(0, max),
  };
}

// ---------- x402 ----------
const BAZAAR = {
  info: { input: { type: "http", method: "GET", queryParams: { headline: "Ukraine launches biggest drone attack on Russia since war began" } },
    output: { type: "json", example: { verdict: "confirmed", outlets_found: 9, languages_found: ["en", "de", "ru"], earliest: { outlet: "Reuters", published: "2026-11-16T02:33:32Z" }, official_sources: [], outlets: [{ outlet: "NBC News", language: "en", link: "https://…", published: "…" }] } } },
  schema: { $schema: "https://json-schema.org/draft/2020-12/schema", type: "object",
    properties: { input: { type: "object", properties: { type: { type: "string", const: "http" }, method: { type: "string", enum: ["GET"] },
      queryParams: { type: "object", properties: { headline: { type: "string", minLength: 12, maxLength: 300, description: "Headline or short claim to check, any of EN/DE/RU" } }, required: ["headline"] } }, required: ["type", "method"], additionalProperties: false },
      output: { type: "object", properties: { type: { type: "string" }, example: { type: "object" } }, required: ["type"] } },
    required: ["input"] },
};
const OFFER = { atomic: DEEP_PRICE_ATOMIC, usd: DEEP_PRICE_USD, resource: DEEP_RESOURCE, description: DESCRIPTION, mimeType: "application/json", bazaar: BAZAAR,
  page: "/api/v1/check/deep", product: "check-deep", freeHint: ORIGIN + "/api/v1/check?headline=… (2 days, one language)" };
export const deepPaymentRequired = (cfg, error) => paymentRequiredFor(cfg, OFFER, error);

export function cleanHeadline(raw, strip = (x) => x) {
  return strip(String(raw || "")).replace(/\s+/g, " ").trim().slice(0, 300);
}

// deps: { ctx, agent, deep(text) → результат, hit, log, strip(text) }
export async function handleDeepCheck(request, cfg, deps) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "GET" && request.method !== "HEAD") return new Response(JSON.stringify({ error: "Use GET with ?headline=" }), { status: 405, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });
  const url = new URL(request.url);
  const text = cleanHeadline(url.searchParams.get("headline") || url.searchParams.get("q"), deps.strip);
  return paidFlow(request, cfg, {
    ...OFFER,
    validate: () => (text.length < 12 ? "Send the headline or short claim (12–300 characters) in ?headline=" : null),
    build: () => deps.deep(text),
    deliver: (r, receipt) => new Response(JSON.stringify({ ...r, receipt }, null, 2), { status: 200, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } }),
  }, deps);
}
