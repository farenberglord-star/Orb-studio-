// GDACS (Global Disaster Alert and Coordination System, UN + European Commission JRC): текущие оранжевые и красные тревоги по миру.
// Быстрые события (циклоны, землетрясения, наводнения, вулканы, пожары) и долгие засухи показываем раздельно: засухи висят месяцами и иначе «замораживают» слой.
// Только то, что опубликовал GDACS: тип, уровень тревоги, страны, даты, ссылка на отчёт. Без прогнозов. Автоматические тревоги GDACS не заменяют официальные предупреждения.
export const GDACS_URL = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?alertlevel=Orange;Red";
export const TYPES = {
  EQ: { ru: "землетрясение", de: "Erdbeben", en: "earthquake", slow: false },
  TC: { ru: "тропический циклон", de: "Tropischer Wirbelsturm", en: "tropical cyclone", slow: false },
  FL: { ru: "наводнение", de: "Überschwemmung", en: "flood", slow: false },
  VO: { ru: "извержение вулкана", de: "Vulkanausbruch", en: "volcanic eruption", slow: false },
  WF: { ru: "лесной пожар", de: "Waldbrand", en: "wildfire", slow: false },
  DR: { ru: "засуха", de: "Dürre", en: "drought", slow: true },
};
export const ATTRIBUTION = "Global Disaster Alert and Coordination System (GDACS), a cooperation of the United Nations and the European Commission (https://www.gdacs.org). Automatic alerts: not for decisions without confirmation by the authorities.";
const LEVEL = { red: "Red", orange: "Orange", green: "Green" };
const pick = (o, ...k) => { for (const x of k) if (o && o[x] != null && o[x] !== "") return o[x]; return null; };
const s = (v, n = 120) => (v == null ? null : String(v).replace(/<[^>]*>/g, "").trim().slice(0, n) || null);
// GDACS даёт время без зоны («2026-11-16T18:00:00»): это UTC.
export function utc(v) {
  const t = s(v, 40); if (!t) return null;
  const x = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(t) ? t + "Z" : t;
  const ms = Date.parse(x); return Number.isFinite(ms) ? new Date(ms).toISOString() : null;
}
export function parseEvent(f) {
  const p = f && (f.properties || f);
  if (!p || typeof p !== "object") return null;
  const type = String(pick(p, "eventtype", "eventType") || "").toUpperCase();
  const lvl = LEVEL[String(pick(p, "alertlevel", "alertLevel", "episodealertlevel") || "").toLowerCase()];
  if (!TYPES[type] || !lvl || lvl === "Green") return null;
  const ac = Array.isArray(p.affectedcountries) ? p.affectedcountries : [];
  const countries = ac.map((c) => s(c && (c.countryname || c.countryName), 60)).filter(Boolean).slice(0, 40);
  const iso3 = ac.map((c) => s(c && c.iso3, 3)).filter(Boolean).slice(0, 40);
  const sev = p.severitydata && typeof p.severitydata === "object" ? s(p.severitydata.severitytext, 160) : null;
  const url = p.url && typeof p.url === "object" ? s(p.url.report || p.url.details, 300) : null;
  const geo = f && f.geometry && f.geometry.type === "Point" && Array.isArray(f.geometry.coordinates) ? f.geometry.coordinates.slice(0, 2).map(Number) : null;
  return {
    id: type + "-" + s(pick(p, "eventid", "eventId"), 20) + (pick(p, "episodeid") != null ? "-" + s(p.episodeid, 20) : ""),
    type, kind: TYPES[type].slow ? "slow" : "fast", alert: lvl, name: s(pick(p, "name", "eventname", "eventName"), 140),
    countries: countries.length ? countries : (s(p.country, 200) ? [s(p.country, 200)] : []), iso3,
    from: utc(pick(p, "fromdate", "fromDate")), to: utc(pick(p, "todate", "toDate")), modified: utc(pick(p, "datemodified", "dateModified")),
    severity: sev, current: String(pick(p, "iscurrent", "isCurrent")) !== "false",
    point: geo && geo.every(Number.isFinite) ? { lon: Math.round(geo[0] * 100) / 100, lat: Math.round(geo[1] * 100) / 100 } : null,
    url: url && /^https:\/\//.test(url) ? url : null,
  };
}
// json — ответ geteventlist (GeoJSON FeatureCollection). null/мусор → ok:false («нет данных»), пустой список → ok:true и ноль тревог.
export function summarize(json, now = Date.now()) {
  const feats = json && Array.isArray(json.features) ? json.features : null;
  if (!feats) return { ok: false, reason: "GDACS answer has no event list" };
  const seen = new Set(), ev = [], dropped = { green_or_unknown: 0, not_current: 0, duplicate: 0 };
  for (const f of feats) {
    const e = parseEvent(f);
    if (!e) dropped.green_or_unknown++; else if (!e.current) dropped.not_current++; else if (seen.has(e.id)) dropped.duplicate++; else { seen.add(e.id); ev.push(e); }
  }
  const byTime = (a, b) => String(b.from || "").localeCompare(String(a.from || ""));
  const fast = ev.filter((e) => e.kind === "fast").sort((a, b) => (a.alert === b.alert ? byTime(a, b) : a.alert === "Red" ? -1 : 1));
  const slow = ev.filter((e) => e.kind === "slow").sort(byTime);
  const days = (e) => (e.from ? Math.floor((now - Date.parse(e.from)) / 864e5) : null);
  const count = (a, f) => a.filter(f).length;
  const stamps = ev.map((e) => e.modified || e.from).filter(Boolean).sort();
  return {
    ok: true, received: feats.length, dropped, latest_update: stamps.length ? stamps[stamps.length - 1] : null,
    counts: { fast: fast.length, slow: slow.length, red: count(ev, (e) => e.alert === "Red"), orange: count(ev, (e) => e.alert === "Orange"),
      by_type: Object.fromEntries(Object.keys(TYPES).map((t) => [t, count(ev, (e) => e.type === t)])) },
    fast: fast.slice(0, 20), slow: slow.slice(0, 20).map((e) => ({ ...e, ongoing_days: days(e) })),
    types: TYPES,
  };
}
