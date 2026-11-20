// Язык в ссылках и служебных тегах страниц. Сайт отдаёт одну и ту же страницу по адресам /x (язык по браузеру),
// /ru/x, /de/x, /en/x. Если человек или поисковик пришёл по адресу с явным языком, ссылки меню должны этот язык сохранять,
// а canonical, og:url и hreflang — указывать на адрес именно этой языковой версии.
export const SITE_LANGS = ["ru", "de", "en"];
export const EXTRA_LOCAL = ["studio", "roundtable", "radio", "tools/inbox"]; // страницы, где язык задаётся атрибутом, а не отдельным файлом

export function explicitLang(pathname) { const m = /^\/(ru|de|en)(?:\/|$)/.exec(String(pathname || "")); return m ? m[1] : null; }
export function barePath(pathname) { const p = String(pathname || "/").replace(/\.html$/, "").replace(/^\/(ru|de|en)(?=\/|$)/, ""); return p === "" ? "/" : p.length > 1 ? p.replace(/\/$/, "") : p; }
export function isLocalizable(bare, translated) { if (bare === "/" || bare === "/index") return true; const k = String(bare).replace(/^\//, ""); return (translated && translated.has(k)) || EXTRA_LOCAL.includes(k); }

// Внутренняя ссылка → та же страница на языке текущего адреса; null — ссылку не трогаем
export function localHref(href, lang, translated) {
  if (!SITE_LANGS.includes(lang) || typeof href !== "string" || !href.startsWith("/") || href.startsWith("//")) return null;
  const cut = href.search(/[?#]/), path = cut < 0 ? href : href.slice(0, cut), rest = cut < 0 ? "" : href.slice(cut);
  if (/^\/(ru|de|en|ro|tr)(\/|$)/.test(path) || /^\/(api|go|media|mcp|\.well-known|me)(\/|$)/.test(path)) return null;
  if (/\.[a-z0-9]{2,5}$/i.test(path) && !/\.html$/.test(path)) return null; // файлы: картинки, скрипты, json
  const bare = barePath(path);
  if (!isLocalizable(bare, translated)) return null;
  return "/" + lang + (bare === "/" || bare === "/index" ? "/" : bare) + rest;
}
// Адрес этой языковой версии для canonical и og:url
export function canonicalUrl(origin, pathname) { const l = explicitLang(pathname); if (!l) return null; const b = barePath(pathname); return origin + "/" + l + (b === "/" || b === "/index" ? "/" : b); }
// hreflang: русская версия живёт по /ru/x (а не /x, где язык выбирается по браузеру); x-default — адрес без языка
export function fixAlternate(hreflang, href, origin) {
  if (typeof href !== "string" || !href.startsWith(origin + "/") && href !== origin) return null;
  const path = href.slice(origin.length) || "/";
  if (hreflang === "ru" && !/^\/ru(\/|$)/.test(path)) return origin + "/ru" + (path === "/" ? "/" : path);
  if (hreflang === "x-default" && /^\/(ru|de|en)(\/|$)/.test(path)) { const b = barePath(path); return origin + b; }
  return null;
}
export function alternateTags(origin, bare) {
  const b = bare === "/" ? "/" : bare;
  return SITE_LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${origin}/${l}${b === "/" ? "/" : b}">`).join("") + `<link rel="alternate" hreflang="x-default" href="${origin}${b}">`;
}
// Тестовые записи в зале агентов: остаются в базе, но в публичный список не попадают
export function isTestAgentName(name) { const n = String(name || "").trim(); return /^(?:test[\s_-]*\d*|\d+|audit[\s_-]*fixture.*|demo|asdf+|qwerty|foo|bar|x+)$/i.test(n); }

// Заголовок и описание страниц, у которых один файл на все языки (студия, круглый стол, радио)
export const PAGE_META = {
  studio: {
    en: { title: "Studio for two · Orb Studio", desc: "A two-seat news desk: the AI host David reads today's headlines and asks, Grok (xAI) answers from published sensor data. Subtitles and voices come live from /api/v1/broadcast/duo." },
    de: { title: "Studio zu zweit · Orb Studio", desc: "Ein Nachrichtenstudio mit zwei Plätzen: KI-Moderator David liest die Schlagzeilen des Tages und fragt, Grok (xAI) antwortet anhand veröffentlichter Sensordaten. Untertitel und Stimmen kommen live aus /api/v1/broadcast/duo." },
    ru: { title: "Студия на двоих · Orb Studio", desc: "Новостная студия на два места: ИИ-ведущий Давид читает заголовки дня и спрашивает, Grok (xAI) отвечает по опубликованным данным датчиков. Субтитры и голоса идут вживую из /api/v1/broadcast/duo." },
  },
  roundtable: {
    en: { title: "AI Round Table · Orb Studio", desc: "A daily AI round table on the hottest news: moderator Claude (Anthropic) asks Gemini (Google), Grok (xAI) and DeepSeek the same questions. Subtitles and voices come live from /api/v1/roundtable." },
    de: { title: "KI-Runder Tisch · Orb Studio", desc: "Ein täglicher runder Tisch der KI zu den wichtigsten Nachrichten: Moderator Claude (Anthropic) stellt Gemini (Google), Grok (xAI) und DeepSeek dieselben Fragen. Untertitel und Stimmen kommen live aus /api/v1/roundtable." },
    ru: { title: "Круглый стол ИИ · Orb Studio", desc: "Ежедневный круглый стол ИИ по главным новостям: модератор Claude (Anthropic) задаёт Gemini (Google), Grok (xAI) и DeepSeek одни и те же вопросы. Субтитры и голоса идут вживую из /api/v1/roundtable." },
  },
  radio: {
    en: { title: "Radio Orb Studio", desc: "Test radio of Orb Studio: our own tracks, and between them the AI host David interviews AI guests (Grok, DeepSeek, Gemini) about headlines from the live sensors, with the weather for the listener's city. Voices are synthetic." },
    de: { title: "Radio Orb Studio", desc: "Testradio von Orb Studio: eigene Titel, dazwischen interviewt KI-Moderator David KI-Gäste (Grok, DeepSeek, Gemini) zu Schlagzeilen aus den Live-Sensoren, dazu das Wetter für die Stadt des Hörers. Die Stimmen sind synthetisch." },
    ru: { title: "Радио Orb Studio", desc: "Тестовое радио Orb Studio: наши треки, между ними ИИ-ведущий Давид берёт интервью у ИИ-гостей (Grok, DeepSeek, Gemini) по заголовкам с живых датчиков, плюс погода в городе слушателя. Голоса синтезированы." },
  },
};
export function pageMeta(bare, lang) { const p = PAGE_META[String(bare || "").replace(/^\//, "")]; return p ? p[lang] || p.en : null; }
const escAttr = (t) => String(t).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
export function ogTags(meta, url) { return meta ? `<meta property="og:title" content="${escAttr(meta.title)}"><meta property="og:description" content="${escAttr(meta.desc)}"><meta property="og:url" content="${escAttr(url)}"><meta property="og:type" content="website">` : ""; }
