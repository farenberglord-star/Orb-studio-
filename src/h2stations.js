// Hydrogen refuelling stations in Hamburg: live availability from the H2-Stations Export API v2 (Clean Hydrogen Joint Undertaking, CC BY 4.0).
// Pure parsing only: no network, no secrets. The Worker (src/worker.js, h2Data) holds the token in env.H2_STATIONS_TOKEN and never passes it here.
// The token is a personal v2 token. v1/v1.1 tokens and the shared sandbox token are rejected by v2, so this module knows only the /v2 base.
export const H2_API = "https://api.h2-stations.eu/v2";
export const H2_PAGE = 500;            // /hrs: limit max 500
export const H2_STATUS_TTL_MS = 120e3; // we ask the bulk status endpoint at most once per 2 minutes (the rule is: not more than once a minute)
export const H2_MIN_GAP_MS = 60e3;     // hard floor between two requests to the API, whatever the outcome (also after errors)
export const H2_LIST_TTL_MS = 24 * 3600e3;
export const STALE_MIN = 30;           // a station whose last availability signal is older than this is reported as stale, without a status
export const H2_SOURCE = {
  attribution: "Clean Hydrogen Joint Undertaking, 2026.",
  license: "CC BY 4.0", license_url: "https://creativecommons.org/licenses/by/4.0/",
  url: "https://map.h2-stations.eu/", docs: "https://docs.h2-stations.eu/for-data-users/api-v2/",
  reuse: "Reuse is authorised, provided the sources and authors are acknowledged. The Joint Undertaking shall not be liable for any consequence stemming from the reuse.",
};
// Hamburg: city name in the address, or coordinates inside the city-state box (a station with no address still lands on the map).
const BOX = { lat0: 53.39, lat1: 53.76, lon0: 9.7, lon1: 10.35 };
const num = (x) => { const v = x == null || x === "" ? NaN : +x; return Number.isFinite(v) ? v : null; };
const str = (x, n = 120) => (x == null ? null : String(x).replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, n) || null);
const FUEL = new Set(["available", "limitedly-available", "unavailable", "closed", "unknown"]);
const REASON = new Set(["failure", "in-maintenance", "outside-opening-hours", "not-in-operation", "not-monitored", "no-signal"]);
const EXPECT = new Set(["available", "limitedly-available", "unavailable"]);

export function stationPoint(s) {
  const g = (s && (s.entrance_geolocation && s.entrance_geolocation.latitude != null ? s.entrance_geolocation : s.geolocation)) || {};
  const lat = num(g.latitude), lon = num(g.longitude);
  return lat == null || lon == null ? null : { lat, lon };
}
export function isHamburg(s) {
  const a = (s && s.address) || {}, p = stationPoint(s);
  if (/^\s*hamburg\b/i.test(String(a.city || ""))) return true;
  return !!p && p.lat >= BOX.lat0 && p.lat <= BOX.lat1 && p.lon >= BOX.lon0 && p.lon <= BOX.lon1;
}
// /hrs page(s) -> the small static list we keep (Hamburg only)
export function parseStations(results) {
  if (!Array.isArray(results)) return { ok: false, stations: [] };
  const stations = [];
  for (const s of results) {
    if (!s || !s.hrs_id || !isHamburg(s)) continue;
    const a = s.address || {}, p = stationPoint(s);
    stations.push({ hrs_id: String(s.hrs_id).slice(0, 40), name: str(s.name), street: str(a.street_address), postal_code: str(a.postal_code, 12), city: str(a.city, 60),
      lat: p ? p.lat : null, lon: p ? p.lon : null,
      fuel_options: Array.isArray(s.fuel_types) ? s.fuel_types.map((f) => str(f && f.fuelling_option, 12)).filter(Boolean) : [] });
  }
  return { ok: true, stations };
}
const age = (iso, now) => { const t = Date.parse(iso || ""); return Number.isFinite(t) ? Math.round((now - t) / 6e4) : null; };
// our one-word summary over the per-fuel statuses the source derived (the per-fuel list is passed through unchanged next to it)
export function overall(entries) {
  const st = entries.map((e) => e.status);
  for (const k of ["available", "limitedly-available", "unavailable", "closed"]) if (st.includes(k)) return k;
  return "unknown";
}
// one station + its entry of /hrs/status -> one record
export function buildStation(st, s, now = Date.now()) {
  const out = { hrs_id: st.hrs_id, name: st.name, street: st.street, postal_code: st.postal_code, city: st.city, lat: st.lat, lon: st.lon };
  if (!s) return { ...out, live: false, status: "unknown", reason: "no-status-entry", by_fuel: [], events_ongoing: [] };
  const av = s.availability || null, ft = s.fuel_types || null;
  const sig = av && av.datetime ? av.datetime : null, ageMin = age(sig, now);
  const entries = ft && Array.isArray(ft.entries) ? ft.entries.filter((e) => e && FUEL.has(e.status)).map((e) => ({ id: str(e.id, 12), status: e.status, reason: REASON.has(e.reason) ? e.reason : null })) : [];
  const stale = sig != null && (ageMin == null || ageMin > STALE_MIN || ageMin < -5);
  const noSignal = !entries.length || entries.every((e) => e.status === "unknown");
  const live = !stale && !noSignal;
  const nz = av && Array.isArray(av.nozzles) ? av.nozzles : null;
  const us = s.usage && Array.isArray(s.usage.nozzles) ? s.usage.nozzles : null;
  const pr = s.pricing && Array.isArray(s.pricing.products) ? s.pricing.products.map((p) => ({ id: str(p && p.id, 20), gross_price_per_kg: str(p && p.gross_price, 12), net_price_per_kg: str(p && p.net_price, 12), currency: str(p && p.currency, 3) })).filter((p) => p.gross_price_per_kg) : [];
  const ev = s.events && Array.isArray(s.events.ongoing) ? s.events.ongoing.map((e) => ({ start: str(e && e.start_datetime, 30), end: str(e && e.end_datetime, 30), subject: str(e && e.subject, 160), message: str(e && e.message, 300),
    expected_availability_status: EXPECT.has(e && e.expected_availability_status) ? e.expected_availability_status : null })) : [];
  return { ...out, live, status: live ? overall(entries) : "unknown", ...(stale ? { stale: true } : {}), ...(noSignal ? { no_signal: true } : {}),
    by_fuel: live ? entries : [],
    maintenance: av && av.station ? !!av.station.maintenance : null, limitedly_available: av && av.station ? !!av.station.limitedly_available : null,
    nozzles: live && nz ? { total: nz.length, available: nz.filter((n) => n && n.available === true).length } : null,
    nozzles_free_now: live && us ? us.filter((n) => n && n.usage_status === "free").length : null,
    ...(pr.length ? { prices: pr } : {}),
    signal_at: sig, signal_age_min: ageMin, events_ongoing: ev };
}
// /hrs/status body + stored Hamburg list -> items
export function parseStatus(body, stations, now = Date.now()) {
  const list = body && Array.isArray(body.stations) ? body.stations : null;
  if (!list) return { ok: false, items: [], datetime: null };
  const by = new Map(list.filter((x) => x && x.hrs_id).map((x) => [String(x.hrs_id), x]));
  const items = stations.map((st) => buildStation(st, by.get(st.hrs_id), now));
  return { ok: true, items, datetime: body.datetime || null };
}
// the highest signal time over the items: this is what the freshness map shows as "source time"
export function newestSignal(items) {
  let best = null;
  for (const i of items || []) { const t = Date.parse(i && i.signal_at || ""); if (Number.isFinite(t) && (best == null || t > best)) best = t; }
  return best == null ? null : new Date(best).toISOString();
}
