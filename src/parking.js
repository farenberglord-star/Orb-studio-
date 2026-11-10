// Live parking occupancy of two open municipal feeds: Karlsruhe region "Parkhäuser" (WFS GeoJSON, CC BY 4.0) and Leipzig Park+Ride (WFS CSV, dl-de/by-2-0).
// Values are passed through; a facility whose reading is older than STALE_MIN minutes (or flagged not real-time / closed) is returned with live:false and no numbers.
export const KA_URL = "https://mobil.trk.de/geoserver/TBA/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=TBA%3Aparkhaeuser&outputFormat=application%2Fjson";
export const LE_URL = "https://geodienste.leipzig.de/l5/Amt66/pr_anlage_belegung_lastrecord/MapServer/WFSServer?SERVICE=WFS&request=GetFeature&typeName=pr_anlage_belegung_lastrecord:pr_anlage_belegung_lastrecord&outputFormat=CSV";
export const STALE_MIN = 30;
export const SOURCES = {
  karlsruhe: { id: "karlsruhe", attribution: 'Datensatz "Parkhäuser", Stadt Karlsruhe, CC BY 4.0', license: "CC BY 4.0", license_url: "https://creativecommons.org/licenses/by/4.0/", url: "https://transparenz.karlsruhe.de/dataset/parkhaeuser" },
  leipzig: { id: "leipzig", attribution: "Stadt Leipzig, dl-de/by-2-0", license: "dl-de/by-2-0", license_url: "https://www.govdata.de/dl-de/by-2-0", url: "https://opendata.leipzig.de/dataset/aktuelle-belegung-parkride-anlagen-stadt-leipzig" },
};
const num = (x) => { const v = x == null || x === "" ? NaN : +x; return Number.isFinite(v) ? v : null; };
const r2 = (v) => Math.round(v * 100) / 100;
const lastSunday = (y, m) => { const d = new Date(Date.UTC(y, m + 1, 0, 1)); d.setUTCDate(d.getUTCDate() - d.getUTCDay()); return d.getTime(); }; // 01:00 UTC on the last Sunday of month m (0-based)
// "2026-11-10T21:25:00" in Europe/Berlin local time -> ISO with offset (EU summer-time rule, no Intl needed)
export function berlinToIso(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/.exec(String(s || ""));
  if (!m) return null;
  const [y, mo, d, h, mi, se] = [+m[1], +m[2], +m[3], +m[4], +m[5], +(m[6] || 0)];
  const asUtc = Date.UTC(y, mo - 1, d, h, mi, se);
  const summer = asUtc - 36e5 >= lastSunday(y, 2) && asUtc - 72e5 < lastSunday(y, 9);
  const off = summer ? 2 : 1, p = (n) => String(n).padStart(2, "0");
  return `${m[1]}-${m[2]}-${m[3]}T${p(h)}:${p(mi)}:${p(se)}+${p(off)}:00`;
}
function build(o, now) {
  const t = Date.parse(o.updated_at || ""), age = Number.isFinite(t) ? Math.round((now - t) / 6e4) : null;
  const stale = age == null || age > STALE_MIN || age < -5;
  const live = o.realtime && !o.closed && !stale && o.free != null && o.capacity > 0;
  const occ = live ? (o.occupancy != null ? o.occupancy : (o.capacity - o.free) / o.capacity) : null;
  return { city: o.city, facility: o.facility, free: live ? o.free : null, capacity: o.capacity, occupancy: occ == null ? null : r2(Math.min(1, Math.max(0, occ))),
    updated_at: o.updated_at || null, age_min: age, live, ...(o.closed ? { closed: true } : {}), ...(o.realtime && !o.closed && stale ? { stale: true } : {}), ...(o.realtime ? {} : { realtime: false }),
    source: SOURCES[o.src].attribution, license: SOURCES[o.src].license, url: SOURCES[o.src].url };
}
export function parseKarlsruhe(j, now = Date.now()) {
  const f = j && Array.isArray(j.features) ? j.features : null;
  if (!f) return { ok: false, items: [] };
  const items = [];
  for (const x of f) {
    const p = x && x.properties; if (!p || !p.parkhaus_name) continue;
    items.push(build({ src: "karlsruhe", city: p.gemeinde || null, facility: String(p.parkhaus_name), free: num(p.freie_parkplaetze), capacity: num(p.gesamte_parkplaetze), occupancy: null,
      realtime: p.echtzeit_belegung === "T" && p.echtzeit_status === "OK", closed: p.geschlossen === "T", updated_at: /Z$|[+-]\d\d:\d\d$/.test(p.stand_freieparkplaetze || "") ? p.stand_freieparkplaetze : null }, now));
  }
  return { ok: items.length > 0, items };
}
export function parseCsv(text) {
  const rows = []; let row = [], f = "", q = false;
  const s = String(text || "").replace(/^\uFEFF/, "");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) { if (c === '"') { if (s[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; }
    else if (c === '"') q = true;
    else if (c === ",") { row.push(f); f = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && s[i + 1] === "\n") i++; row.push(f); f = ""; if (row.length > 1 || row[0] !== "") rows.push(row); row = []; }
    else f += c;
  }
  if (f !== "" || row.length) { row.push(f); rows.push(row); }
  return rows;
}
export function parseLeipzig(csv, now = Date.now()) {
  const rows = parseCsv(csv);
  if (rows.length < 2) return { ok: false, items: [] };
  const h = rows[0].reduce((a, k, i) => (a[k] = i, a), {});
  if (h.parkingfacilityname == null || h.phenomenontime == null) return { ok: false, items: [] };
  const g = (r, k) => (h[k] == null ? "" : r[h[k]]);
  const items = rows.slice(1).filter((r) => g(r, "parkingfacilityname")).map((r) => build({ src: "leipzig", city: "Leipzig", facility: "P+R " + g(r, "parkingfacilityname"), free: num(g(r, "totalnumvacantparkingspaces")),
    capacity: num(g(r, "totalparkingcapacity")), occupancy: num(g(r, "parkingfacilityoccupancy")), realtime: true, closed: false, updated_at: berlinToIso(g(r, "phenomenontime")) }, now));
  return { ok: items.length > 0, items };
}
