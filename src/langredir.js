// Языковой адрес из внешней ссылки (/de/…, /en/…, /ru/…, /ro/…, /tr/…): если у человека телефон на другом языке
// и он ещё не выбирал язык на сайте сам — отправляем на ту же страницу на его языке.
// Выбор на сайте (переключатель RU/DE/EN, переход внутри сайта) запоминается в cookie orb_lang и дальше уважается.
// Роботов и агентов не перенаправляем: им нужна каждая языковая версия как есть.

const STUDIO_LANGS = ["ru", "de", "en", "ro", "tr"];
const SITE_LANGS = ["ru", "de", "en"];

export function readCookieLang(request) {
  const m = String(request.headers.get("cookie") || "").match(/(?:^|;\s*)orb_lang=(ru|de|en|ro|tr|ja)(?:;|$)/);
  return m ? m[1] : null;
}
function sameSite(request, url) {
  try { const r = request.headers.get("referer"); return !!r && new URL(r).origin === url.origin; } catch { return false; }
}

// Решение: { redirect: url } | { setCookie: lang } | null
// deps: { isAgent(ua), pickSite(request) → ru|de|en, pickStudio(request) → ru|de|en|ro|tr, translated: Set страниц с переводом }
export function langDecision(request, url, deps) {
  if (request.method !== "GET") return null;
  const m = url.pathname.match(/^\/(ru|de|en|ro|tr|ja)(\/.*)?$/);
  if (!m) return null;
  const L = m[1], rest = (m[2] || "/").replace(/\.html$/, "");
  const page = rest.replace(/^\//, "").replace(/\/$/, "");
  const studio = page === "studio" || page === "roundtable";
  const avail = studio ? STUDIO_LANGS : (page === "" || page === "index" || deps.translated.has(page)) ? SITE_LANGS : null;
  if (!avail || !avail.includes(L)) return null;
  if ((request.headers.get("accept") || "").indexOf("text/html") < 0) return null;
  const ua = request.headers.get("user-agent") || "";
  if (!ua || deps.isAgent(ua)) return null;
  // переход внутри сайта — это выбор человека: запоминаем язык
  if (sameSite(request, url)) return { setCookie: L };
  const saved = readCookieLang(request);
  const want = saved && avail.includes(saved) ? saved : (studio ? deps.pickStudio(request) : deps.pickSite(request));
  if (!want || want === L || !avail.includes(want)) return null;
  const path = page === "" || page === "index" ? (want === "ru" ? "/ru/" : `/${want}/`) : `/${want}/${page}`;
  return { redirect: url.origin + path + url.search };
}
