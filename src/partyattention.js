// Attention to Bundestag parties: human pageviews of German Wikipedia articles (Wikimedia Pageviews API, CC0).
// Not support, not a forecast, not search queries, not an audience limited to Germany. Fixed article list, no ranking, no "leader of attention".
export const PARTIES = [
  { party: "AfD", title: "Alternative_für_Deutschland" },
  { party: "CDU", title: "Christlich_Demokratische_Union_Deutschlands" },
  { party: "CSU", title: "Christlich-Soziale_Union_in_Bayern" },
  { party: "SPD", title: "Sozialdemokratische_Partei_Deutschlands" },
  { party: "Grüne", title: "Bündnis_90/Die_Grünen" },
  { party: "Linke", title: "Die_Linke" },
  { party: "FDP", title: "Freie_Demokratische_Partei" },
  { party: "BSW", title: "Bündnis_Sahra_Wagenknecht" },
  { party: "Freie Wähler", title: "Freie_Wähler_(Partei)" },
];
export const SURGE = 2.5;
export const ATTRIBUTION = "Pageview data: Wikimedia Foundation, Pageviews API (https://wikimedia.org/api/rest_v1/), CC0. Articles: German Wikipedia (https://de.wikipedia.org). Aggregated by Orb Studio (yesterday vs the median of the 28 days before).";
export const CONTEXT_NOTE = "These are views of German-language Wikipedia articles by human readers worldwide (agent=user), not search queries and not an audience limited to Germany; Wikimedia gives no per-country split per article. Attention is not support: people read about a party because of a scandal, a vote or curiosity. In the polls endpoint CDU/CSU is one line; here the two articles are shown separately. No forecast, no ranking, no seat or coalition projection, no 'leader of attention'.";
const ymd = (d) => d.toISOString().slice(0, 10).replace(/-/g, "");
export const dayRange = (now = Date.now(), back = 36) => ({ from: ymd(new Date(now - back * 864e5)), to: ymd(new Date(now - 864e5)) });
export const pageUrl = (t) => "https://de.wikipedia.org/wiki/" + encodeURIComponent(t).replace(/%2F/g, "/");
export const apiUrl = (t, gran, from, to) => `https://wikimedia.org/api/rest_v1/metrics/pageviews/per-article/de.wikipedia/all-access/user/${encodeURIComponent(t)}/${gran}/${from}/${to}`;
const med = (a) => { const b = a.slice().sort((x, y) => x - y), m = b.length >> 1; return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
// items: Wikimedia `items` array. Returns null when the series is too short to say anything.
export function reduceDaily(items) {
  const it = (Array.isArray(items) ? items : []).map((x) => ({ day: String(x.timestamp || "").slice(0, 8), v: Number(x.views) })).filter((x) => /^\d{8}$/.test(x.day) && Number.isFinite(x.v) && x.v >= 0);
  return it.length >= 15 ? it : null;
}
export function rowFor(p, it, monthly) {
  const last = it[it.length - 1], base = med(it.slice(-29, -1).map((x) => x.v));
  const ratio = base > 0 ? Math.round((last.v / base) * 100) / 100 : null;
  return { party: p.party, article: p.title.replace(/_/g, " "), url: pageUrl(p.title), day: `${last.day.slice(0, 4)}-${last.day.slice(4, 6)}-${last.day.slice(6, 8)}`,
    views: last.v, usual: base, ratio, surge: ratio != null && ratio >= SURGE, week: it.slice(-7).map((x) => x.v),
    monthly: monthly ? monthly.map((x) => ({ month: x.day.slice(0, 4) + "-" + x.day.slice(4, 6), views: x.v })) : null };
}
export function summarizeAttention(rows) {
  const ok = rows.filter(Boolean);
  if (ok.length < 4) return { ok: false, reason: "too few articles returned data", articles_ok: ok.length };
  return { ok: true, rule: `surge = yesterday ≥ ${SURGE}× the usual day (median of the 28 days before)`, day: ok.map((r) => r.day).sort().pop(), articles_ok: ok.length, articles_expected: PARTIES.length, parties: ok,
    missing: PARTIES.filter((p) => !ok.some((r) => r.party === p.party)).map((p) => p.party) };
}
