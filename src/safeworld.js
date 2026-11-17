// «Безопасный мир», слой шума: что пишут (GDELT DOC 2.0) и что читают (Wikimedia Pageviews, CC0) о теме за неделю.
// Это внимание СМИ и читателей, а не число преступлений. Без ключей, без имён и дел, без прогнозов.
// Чистые функции: сеть и кэш живут в worker.js (safeworldNoiseRefresh / safeworldNoiseGet).

export const GDELT_TOPICS = [
  { topic: "Menschenhandel", q: "Menschenhandel" },
  { topic: "human trafficking", q: '"human trafficking"' },
  { topic: "Kindesmissbrauch", q: "Kindesmissbrauch" },
];
export const GDELT_SCOPES = [{ country: "DE", add: " sourcecountry:GM" }, { country: null, add: "" }]; // null = весь мир
export const WIKI_ARTICLES = [
  { lang: "de", article: "Menschenhandel" },
  { lang: "de", article: "Sexueller_Missbrauch_von_Kindern" },
  { lang: "en", article: "Human_trafficking" },
  { lang: "en", article: "Child_sexual_abuse" },
  { lang: "ru", article: "Торговля_людьми" },
];
export const GDELT_PAUSE_MS = 6000; // GDELT просит не чаще 1 запроса в 5 с
export const NOISE_KEY = "safeworld-noise-v1";
export const NOISE_MAX_AGE_MS = 7 * 864e5;
export const UA = "OrbStudio/1.0 (https://orbstudio.org)";

const DAY = 864e5;
const ymd = (ms) => new Date(ms).toISOString().slice(0, 10).replace(/-/g, "");
const iso = (s) => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;

// Две полные недели по UTC, последняя кончается вчера: prev = дни 1–7, week = дни 8–14.
export function weeks(now = Date.now()) {
  const today = Math.floor(now / DAY) * DAY, days = [];
  for (let i = 14; i >= 1; i--) days.push(ymd(today - i * DAY));
  return { prev: days.slice(0, 7), week: days.slice(7), start: days[0] + "000000", end: ymd(today) + "000000" };
}

export function gdeltUrl(t, scope, mode, w) {
  const q = encodeURIComponent(t.q + scope.add);
  return `https://api.gdeltproject.org/api/v2/doc/doc?query=${q}&mode=${mode}&format=json&startdatetime=${w.start}&enddatetime=${w.end}`;
}
export function wikiUrl(a, w) {
  return `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/${a.lang}.wikipedia/all-access/user/${encodeURIComponent(a.article)}/daily/${w.prev[0]}00/${w.week[6]}00`;
}

// Точки GDELT (любая детализация: 15 мин, час, день) → {день: [значения]}. Пустой ответ {} или мусор → null.
export function gdeltPoints(j) {
  const tl = j && Array.isArray(j.timeline) ? j.timeline : null;
  if (!tl || !tl.length || !Array.isArray(tl[0].data) || !tl[0].data.length) return null;
  const by = {};
  for (const p of tl[0].data) {
    const d = String(p && p.date || "").slice(0, 8), v = Number(p && p.value);
    if (!/^\d{8}$/.test(d) || !Number.isFinite(v)) continue;
    (by[d] = by[d] || []).push(v);
  }
  return Object.keys(by).length ? by : null;
}
const sumDays = (by, days) => { let s = 0, n = 0; for (const d of days) if (by[d]) { n++; for (const v of by[d]) s += v; } return n ? s : null; };
const meanDays = (by, days) => { let s = 0, n = 0; for (const d of days) for (const v of by[d] || []) { s += v; n++; } return n ? Math.round((s / n) * 100) / 100 : null; };

export function gdeltRow(t, scope, volJson, toneJson, w) {
  const vol = gdeltPoints(volJson), tone = gdeltPoints(toneJson);
  return { topic: t.topic, country: scope.country, articles: vol ? sumDays(vol, w.week) : null, prev_articles: vol ? sumDays(vol, w.prev) : null, tone: tone ? meanDays(tone, w.week) : null };
}
export function wikiRow(a, json, w) {
  const items = json && Array.isArray(json.items) ? json.items : null, by = {};
  for (const x of items || []) { const d = String(x.timestamp || "").slice(0, 8), v = Number(x.views); if (/^\d{8}$/.test(d) && Number.isFinite(v)) by[d] = [v]; }
  const ok = Object.keys(by).length > 0;
  return { lang: a.lang, article: a.article.replace(/_/g, " "), url: `https://${a.lang}.wikipedia.org/wiki/${encodeURIComponent(a.article)}`,
    views: ok ? sumDays(by, w.week) : null, prev_views: ok ? sumDays(by, w.prev) : null };
}

// Итог для сайта и агентов. ok=false, если ни один источник не дал чисел: тогда голограмма кольцо не рисует.
export function buildNoise(gdelt, wiki, w, now = Date.now()) {
  const has = (a, k) => a.some((r) => typeof r[k] === "number");
  const world = gdelt.filter((r) => r.country === null && typeof r.articles === "number");
  const sum = (a, k) => (a.some((r) => typeof r[k] === "number") ? a.reduce((s, r) => s + (r[k] || 0), 0) : null);
  return {
    schema: "orb.safeworld.noise.v1", updated: new Date(now).toISOString(), ok: has(gdelt, "articles") || has(wiki, "views"),
    week: { from: iso(w.week[0]), to: iso(w.week[6]) }, prev_week: { from: iso(w.prev[0]), to: iso(w.prev[6]) },
    totals: { articles_world: world.length ? sum(world, "articles") : null, prev_articles_world: world.length ? sum(world, "prev_articles") : null,
      wiki_views: sum(wiki, "views"), prev_wiki_views: sum(wiki, "prev_views") },
    gdelt, wiki,
    note: "Media attention is not the number of crimes. Article counts by keyword (GDELT DOC 2.0, all languages the query matches); the topics overlap and the world rows include Germany, so rows are not added up across topics except in totals.articles_world, which can count one article more than once. Wikipedia: views by human readers (agent=user). Weeks are full UTC days. null = no data.",
    sources: [{ name: "GDELT Project, DOC 2.0 API", url: "https://www.gdeltproject.org/" }, { name: "Wikimedia Foundation, Pageviews API", url: "https://wikimedia.org/api/rest_v1/", license: "CC0" }],
    page: "https://orbstudio.org/tools/court#safeworld",
  };
}
