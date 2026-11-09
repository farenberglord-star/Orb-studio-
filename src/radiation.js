// Ambient gamma dose rate (ODL) from the BfS measuring network (Bundesamt für Strahlenschutz, open data).
// Values are passed through as published; Orb Studio only counts stations and takes median / min / max / nearest. No thresholds, no alarms, no forecast.
export const ATTRIBUTION = "Quelle: Bundesamt für Strahlenschutz (BfS), ODL-Messnetz, https://odlinfo.bfs.de. Lizenz: Datenlizenz Deutschland – Namensnennung – Version 2.0 / GeoNutzV (https://www.govdata.de/dl-de/by-2-0). Daten von Orb Studio aggregiert (Zählung, Median, Minimum, Maximum, nächste Stationen); Messwerte unverändert.";
export const CONTEXT_NOTE = "BfS: typical levels in Germany are roughly 0.05–0.2 µSv/h (national average about 0.08 µSv/h), differing mainly by geology. Rain can temporarily raise readings, snow cover can lower them. Since 1 July 2025 BfS calculates the values with a revised method, which slightly raises them. Orb Studio sets no thresholds and gives no assessment.";
export const GERMANY_BOX = { lat: [47.0, 55.2], lon: [5.5, 15.6] };
export const HAMBURG = { lat: 53.55, lon: 9.99 };
const num = (x) => { const v = x == null || x === "" ? NaN : +x; return Number.isFinite(v) ? v : null; };
// Factor to µSv/h; null = unknown unit (the station is skipped rather than guessed).
export function unitFactor(u) {
  const s = String(u == null ? "µSv/h" : u).replace(/\s/g, "").replace("μ", "µ").toLowerCase();
  if (s === "µsv/h" || s === "usv/h") return 1;
  if (s === "nsv/h") return 0.001;
  if (s === "msv/h") return 1000;
  return null;
}
// Reduce a WFS GeoJSON FeatureCollection to the fields we use (keeps the cache small).
export function reduceFeed(j) {
  const fs = j && Array.isArray(j.features) ? j.features : null;
  if (!fs) return null;
  const out = [];
  for (const f of fs) {
    const p = (f && f.properties) || {}, c = f && f.geometry && f.geometry.coordinates;
    const lon = Array.isArray(c) ? num(c[0]) : null, lat = Array.isArray(c) ? num(c[1]) : null;
    const k = unitFactor(p.unit), v = num(p.value);
    out.push({ id: p.id || null, name: p.name || null, plz: p.plz || null, lat, lon, status: num(p.site_status), v: v == null || k == null ? null : Math.round(v * k * 1e5) / 1e5, end: p.end_measure || null, ok_val: num(p.validated) });
  }
  return out;
}
export function haversineKm(a, b) {
  const R = 6371, r = (d) => (d * Math.PI) / 180, dLat = r(b.lat - a.lat), dLon = r(b.lon - a.lon);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(x)));
}
export function parsePointParams(lat, lon) {
  if (lat == null && lon == null) return { point: HAMBURG, default: true };
  const la = num(lat), lo = num(lon);
  if (la == null || lo == null) return { error: "lat and lon must both be numbers." };
  if (la < GERMANY_BOX.lat[0] || la > GERMANY_BOX.lat[1] || lo < GERMANY_BOX.lon[0] || lo > GERMANY_BOX.lon[1]) return { error: "The BfS ODL network covers Germany; lat must be 47.0–55.2 and lon 5.5–15.6." };
  return { point: { lat: la, lon: lo } };
}
const med = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const r4 = (x) => Math.round(x * 1e4) / 1e4;
export function summarize(stations, point, k = 3) {
  if (!Array.isArray(stations) || !stations.length) return { ok: false, reason: "no stations in feed" };
  const live = stations.filter((s) => s.status === 1 && s.v != null && s.v >= 0);
  if (!live.length) return { ok: false, reason: "no station in operation with a reading", stations_in_feed: stations.length };
  const vals = live.map((s) => s.v);
  const lo = live.reduce((a, s) => (s.v < a.v ? s : a)), hi = live.reduce((a, s) => (s.v > a.v ? s : a));
  const ends = live.map((s) => Date.parse(s.end)).filter(Number.isFinite);
  const pick = (s) => ({ station: s.name, station_id: s.id, dose_rate_usv_h: s.v, measured_at: s.end });
  const near = live.filter((s) => s.lat != null && s.lon != null).map((s) => ({ s, d: haversineKm(point, s) })).sort((a, b) => a.d - b.d).slice(0, Math.max(1, Math.min(5, k)))
    .map(({ s, d }) => ({ ...pick(s), plz: s.plz, distance_km: Math.round(d * 10) / 10, validated: s.ok_val === 1 ? true : s.ok_val === 2 ? false : null }));
  return {
    ok: true, unit: "µSv/h",
    stations: { in_feed: stations.length, in_operation_with_reading: live.length, share_validated: Math.round((live.filter((s) => s.ok_val === 1).length / live.length) * 1000) / 10 },
    germany: { median: r4(med(vals)), min: { ...pick(lo) }, max: { ...pick(hi) } },
    latest_measurement_at: ends.length ? new Date(Math.max(...ends)).toISOString() : null,
    nearest: near, near_point: point,
  };
}
