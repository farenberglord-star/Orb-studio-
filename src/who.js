// ВОЗ, Disease Outbreak News: официальные сообщения ВОЗ о вспышках международного значения (без ключа, OData).
// Берём только заголовок («Болезнь – Страна»), дату и ссылку. Числа заболевших не выводим: в сообщениях они несопоставимы.
export const WHO_URL = "https://www.who.int/api/news/diseaseoutbreaknews?$orderby=PublicationDate%20desc&$top=15&$select=Title,OverrideTitle,PublicationDate,UrlName,DonId";
export const ATTRIBUTION = "World Health Organization, Disease Outbreak News (https://www.who.int/emergencies/disease-outbreak-news).";
const s = (v, n = 200) => (v == null ? null : String(v).replace(/<[^>]*>/g, "").trim().slice(0, n) || null);
// «Middle East respiratory syndrome (MERS) – Qatar» → болезнь и место. Разделитель — тире с пробелами; места может не быть.
export function splitTitle(t) {
  const x = s(t, 240); if (!x) return { disease: null, place: null };
  const m = /^(.*\S)\s+[–—-]\s+([^–—]+)$/.exec(x);
  return m ? { disease: m[1].trim(), place: m[2].trim() } : { disease: x, place: null };
}
export function parseItem(it) {
  if (!it || typeof it !== "object") return null;
  const title = s(it.OverrideTitle, 240) || s(it.Title, 240), t = Date.parse(it.PublicationDate);
  const slug = s(it.UrlName, 60) || s(it.DonId, 60);
  if (!title || !Number.isFinite(t)) return null;
  return { id: s(it.DonId, 40) || slug, title, ...splitTitle(title), published: new Date(t).toISOString(),
    url: slug && /^[A-Za-z0-9-]+$/.test(slug) ? "https://www.who.int/emergencies/disease-outbreak-news/item/" + slug : null };
}
export function summarize(json, now = Date.now()) {
  const v = json && Array.isArray(json.value) ? json.value : null;
  if (!v) return { ok: false, reason: "WHO answer has no list" };
  const seen = new Set(), items = [];
  for (const it of v) { const e = parseItem(it); if (e && !seen.has(e.id)) { seen.add(e.id); items.push(e); } }
  items.sort((a, b) => b.published.localeCompare(a.published));
  return { ok: true, latest_published: items[0] ? items[0].published : null,
    count_30d: items.filter((e) => now - Date.parse(e.published) <= 30 * 864e5).length, items: items.slice(0, 10) };
}
