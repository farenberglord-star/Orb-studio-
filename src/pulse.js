// Impulse layer: a short log of real source events (a new value or a changed state from a sensor's own source), so an agent can ask "what changed since T" instead of polling every sensor.
// Events are facts noticed by Orb Studio's own poll (detected_at), never predictions. The first run only records a baseline and emits nothing.
export const PULSE_SENSORS = {
  gas: { endpoint: "/api/v1/gas/storage", basis: "a new published gas day" },
  bafin: { endpoint: "/api/v1/finance/bafin-measures", basis: "a new measure in the BaFin feed" },
  flood: { endpoint: "/api/v1/hydro/flood-warnings", basis: "change in the set of active flood warnings" },
  quakes: { endpoint: "/api/v1/quakes", basis: "a new significant earthquake (USGS significant feed, last 7 days)" },
  space: { endpoint: "/api/v1/space", basis: "change of a NOAA space-weather scale (G, R or S)" },
};
const MAX_PER_SENSOR = 5, KEEP_IDS = 40;
const s = (x, n = 140) => (typeof x === "string" ? x.slice(0, n) : "");
export function snapshot(sensor, d) {
  if (!d || typeof d !== "object") return null;
  if (sensor === "gas") return d.ok && typeof d.gas_day === "string" ? { sig: d.gas_day, info: { gas_day: d.gas_day, full_percent: d.full_percent, net_flow: s(d.net_flow, 20) } } : null;
  if (sensor === "bafin") {
    if (!d.ok || !Array.isArray(d.items)) return null;
    const ids = [], info = {};
    for (const it of d.items) { const id = s(it && (it.url || it.title), 200); if (id && !info[id]) { ids.push(id); info[id] = { title: s(it.title), sector: s(it.sector, 30), date: s(it.date, 30) }; } }
    return { ids: ids.slice(0, KEEP_IDS), info };
  }
  if (sensor === "flood") {
    if (!d.ok || typeof d.active_count !== "number") return null;
    const names = Array.isArray(d.items) ? d.items.map((x) => s(x && (x.name || x.id || x.title), 80)).sort() : [];
    return { sig: d.active_count + "|" + (d.highest_class == null ? "" : d.highest_class) + "|" + names.join(";"), info: { active_count: d.active_count, highest_class: d.highest_class == null ? null : d.highest_class, highest_class_name: s(d.highest_class_name, 60) || null } };
  }
  if (sensor === "quakes") {
    const ev = d.significant_week && Array.isArray(d.significant_week.events) ? d.significant_week.events : null;
    if (!ev) return null;
    const ids = [], info = {};
    for (const e of ev) { const id = s(e && (e.url || (e.time + "|" + e.place)), 200); if (id && !info[id]) { ids.push(id); info[id] = { mag: typeof e.mag === "number" ? e.mag : null, place: s(e.place), time: s(e.time, 30), tsunami_flag: !!e.tsunami_flag }; } }
    return { ids: ids.slice(0, KEEP_IDS), info };
  }
  if (sensor === "space") {
    const c = d.noaa_scales && d.noaa_scales.ok && d.noaa_scales.current;
    if (!c || !c.geomagnetic || !c.radio_blackout || !c.radiation) return null;
    const g = s(c.geomagnetic.scale, 4), r = s(c.radio_blackout.scale, 4), sr = s(c.radiation.scale, 4);
    return { sig: g + "|" + r + "|" + sr, info: { geomagnetic: g, radio_blackout: r, radiation: sr } };
  }
  return null;
}
// prev: { sensor: {sig?|ids?} }, snaps: { sensor: snapshot|null }. Returns { state, events } (events oldest first).
export function diff(prev, snaps, now = Date.now()) {
  const state = { ...(prev || {}) }, events = [], at = new Date(now).toISOString();
  const push = (sensor, type, summary, source_time, data) => events.push({ id: sensor + ":" + type + ":" + Buffer_id(summary, source_time), sensor, type, detected_at: at, ...(source_time ? { source_time } : {}), summary: s(summary, 200), data });
  for (const sensor of Object.keys(PULSE_SENSORS)) {
    const sn = snaps ? snaps[sensor] : null;
    if (!sn) continue; // source error: keep the previous state, emit nothing
    const old = state[sensor];
    if (sn.ids) {
      state[sensor] = { ids: sn.ids };
      if (!old || !Array.isArray(old.ids)) continue; // baseline
      const fresh = sn.ids.filter((id) => !old.ids.includes(id)).slice(0, MAX_PER_SENSOR);
      for (const id of fresh.reverse()) {
        const i = sn.info[id];
        if (sensor === "bafin") push(sensor, "new_measure", "BaFin: " + i.title, i.date || null, { title: i.title, sector: i.sector });
        else push(sensor, "new_significant_quake", "M" + i.mag + " " + i.place, i.time || null, { mag: i.mag, place: i.place, tsunami_flag: i.tsunami_flag });
      }
      continue;
    }
    state[sensor] = { sig: sn.sig };
    if (!old || typeof old.sig !== "string" || old.sig === sn.sig) continue; // baseline or no change
    if (sensor === "gas") push(sensor, "new_gas_day", "Gas storage " + sn.info.gas_day + ": " + sn.info.full_percent + "% full, " + sn.info.net_flow, sn.info.gas_day, sn.info);
    else if (sensor === "flood") push(sensor, "warnings_changed", "Flood warnings: " + sn.info.active_count + " active" + (sn.info.highest_class_name ? ", highest: " + sn.info.highest_class_name : ""), null, sn.info);
    else if (sensor === "space") push(sensor, "noaa_scales_changed", "NOAA scales G/R/S: " + old.sig.replace(/\|/g, "/") + " -> " + sn.sig.replace(/\|/g, "/"), null, { from: old.sig, to: sn.sig, ...sn.info });
  }
  return { state, events };
}
function Buffer_id(a, b) { let h = 5381; const t = String(a) + "|" + String(b || ""); for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) >>> 0; return h.toString(36); }
export function mergeEvents(log, fresh, keep = 100) {
  const seen = new Set((log || []).map((e) => e.id)), add = fresh.filter((e) => !seen.has(e.id));
  return [...add.reverse(), ...(log || [])].slice(0, keep);
}
export function sinceMs(v, now = Date.now()) {
  if (v == null || v === "") return null;
  const n = /^\d{10,13}$/.test(String(v)) ? (String(v).length <= 10 ? +v * 1000 : +v) : Date.parse(String(v));
  return Number.isFinite(n) && n <= now + 6e4 ? n : NaN;
}
// ETag basis: the answer without per-request timing fields, so a conditional request answers 304 until the data itself changes.
const VOLATILE = new Set(["checked_at", "computed_at", "age_min", "referral", "now", "fetched_at"]);
export function etagBasis(x) {
  if (Array.isArray(x)) return x.map(etagBasis);
  if (x && typeof x === "object") { const o = {}; for (const k of Object.keys(x)) if (!VOLATILE.has(k)) o[k] = etagBasis(x[k]); return o; }
  return x;
}
