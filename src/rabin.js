// Датчик «Рабин» — в честь Михаэля Рабина (1931–2026), лауреата премии Тьюринга (1976), одного из основателей
// вероятностных алгоритмов: несколько случайных проверок говорят о большом наборе почти столько же, сколько полная проверка.
// Раз в час берём случайные заголовки радаров и открываем страницу источника: совпадает ли заголовок, жива ли ссылка.
export const RABIN = {
  name: "Michael O. Rabin", years: "1931–2026",
  idea: "Randomised algorithms: a few random checks can tell almost as much about a large set as checking everything (Turing award 1976).",
  wiki: { en: "https://en.wikipedia.org/wiki/Michael_O._Rabin", ru: "https://en.wikipedia.org/wiki/Michael_O._Rabin" },
  note: "Named in his honour. Orb Studio is not connected with Michael Rabin, his family, Harvard University or the Hebrew University of Jerusalem.",
};
export const RABIN_PER_HOUR = 3, RABIN_KEEP = 200;
const words = (t) => [...new Set(String(t || "").toLowerCase().replace(/&[a-z#0-9]+;/g, " ").replace(/[^\p{L}\p{N} ]+/gu, " ").split(/\s+/).filter((w) => w.length >= 4))];
// что нашли на странице источника: заголовок страницы, og:title, первый h1
export function pageTitles(html) {
  const s = String(html || "").slice(0, 300000), out = [];
  const t = s.match(/<title[^>]*>([\s\S]{0,400}?)<\/title>/i); if (t) out.push(t[1]);
  const og = s.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']{0,400})/i) || s.match(/<meta[^>]+content=["']([^"']{0,400})["'][^>]+property=["']og:title["']/i); if (og) out.push(og[1]);
  const h = s.match(/<h1[^>]*>([\s\S]{0,400}?)<\/h1>/i); if (h) out.push(h[1].replace(/<[^>]+>/g, " "));
  return out.map((x) => x.replace(/\s+/g, " ").trim()).filter(Boolean);
}
// совпадение: доля слов заголовка радара, найденных в заголовках страницы
export function rabinMatch(headline, titles) {
  const w = words(headline); if (w.length < 2) return { share: null, verdict: "too_short" };
  const page = new Set(words(titles.join(" "))); const hit = w.filter((x) => page.has(x)).length, share = Math.round(100 * hit / w.length);
  return { share, verdict: !titles.length ? "no_title" : share >= 60 ? "matches" : share >= 30 ? "partly" : "differs" };
}
// выбор случайных заголовков с прямыми ссылками (ссылки Google News ведут на переадресацию — не берём)
export function rabinPick(radars, k, r = Math.random) {
  const pool = (radars || []).flatMap((x) => (x.feed || []).map((f) => ({ radar: x.id, headline: f[1], source: f[2], link: f[4] }))).filter((x) => typeof x.link === "string" && /^https:\/\//.test(x.link) && !/news\.google\.com|bing\.com\/news/.test(x.link));
  const a = pool.slice(); for (let i = 0; i < Math.min(k, a.length); i++) { const j = i + Math.floor(r() * (a.length - i)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, k);
}
const pct = (a, b) => (b ? Math.round(100 * a / b) : null);
export function rabinReport(checks, now = Date.now()) {
  const c = (checks || []).filter((x) => x && x.at && now - Date.parse(x.at) < 7 * 864e5);
  if (!c.length) return { sensor: "rabin", verdict: "collecting", checks: 0, recent: [], generated_at: new Date(now).toISOString() };
  const n = (v) => c.filter((x) => x.verdict === v).length, decided = c.filter((x) => ["matches", "partly", "differs"].includes(x.verdict)).length;
  const share = { matches: pct(n("matches"), c.length), partly: pct(n("partly"), c.length), differs: pct(n("differs"), c.length), unreachable: pct(n("unreachable") + n("blocked"), c.length), no_title: pct(n("no_title"), c.length) };
  return {
    sensor: "rabin", verdict: decided < 10 ? "collecting" : share.differs >= 20 ? "many_differ" : share.differs >= 5 ? "some_differ" : "faithful",
    checks: c.length, decided, shares: share,
    differs: c.filter((x) => x.verdict === "differs").slice(-6).reverse(), recent: c.slice(-12).reverse(),
    question: "When an Orb Studio radar shows a headline, does the source page really carry that headline — checked by random samples?",
    method: `Every hour ${RABIN_PER_HOUR} radar headlines with a direct link are drawn at random (Google News and Bing redirect links are skipped). The source page is opened (first 300 KB, 7 s) and its <title>, og:title and first <h1> are compared with the radar headline: matches = 60 %+ of the headline's words appear, partly = 30–59 %, differs = under 30 %. unreachable/blocked = the page did not open or refused robots. Last 7 days, at most ${RABIN_KEEP} checks.`,
    rule: "If a headline 'differs', the outlet may have changed it after publication or the feed title differs from the article; read the source before quoting. This checks fidelity of the feed, not truth of the story.",
    honour: RABIN, similar: "Link checkers and uptime monitors test whether pages open; feed validators check feed format; NewsDiffs-style tools track article edits. This sensor samples a live news feed at random and compares its headlines with the source pages.",
    generated_at: new Date(now).toISOString(),
  };
}
