// Space weather from NOAA SWPC open JSON (public domain). Only observed values and NOAA's own published scales/texts.
// Parsers are tolerant (array-of-arrays or array-of-objects) and every block reports ok:false instead of guessing.
const num = (x) => { const v = x == null || x === "" ? NaN : +x; return Number.isFinite(v) ? v : null; };
const tbl = (j) => {
  if (!Array.isArray(j) || !j.length) return [];
  if (Array.isArray(j[0])) { const h = j[0].map(String); return j.slice(1).map((r) => Object.fromEntries(h.map((k, i) => [k, r[i]]))); }
  return j.filter((x) => x && typeof x === "object");
};
const iso = (t) => { if (!t) return null; const s = String(t).trim(); const d = Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : s.replace(" ", "T") + "Z"); return Number.isFinite(d) ? new Date(d).toISOString() : null; };

export function parseKp(j) {
  const rows = tbl(j).map((r) => ({ time: iso(r.time_tag), kp: num(r.Kp ?? r.kp_index ?? r.kp) })).filter((r) => r.time && r.kp != null);
  if (!rows.length) return { ok: false };
  const last = rows[rows.length - 1], day = Date.parse(last.time) - 864e5;
  const d24 = rows.filter((r) => Date.parse(r.time) >= day);
  return { ok: true, kp: last.kp, time: last.time, max_24h: d24.reduce((m, r) => Math.max(m, r.kp), 0), storm: last.kp >= 5, storm_note: "NOAA defines Kp 5 or higher as a geomagnetic storm (G1)." };
}
export function parseScales(j) {
  if (!j || typeof j !== "object") return { ok: false };
  const pick = (k) => j[k] && typeof j[k] === "object" ? j[k] : null;
  const cur = pick("0"), past = pick("-1");
  if (!cur) return { ok: false };
  const one = (o, k) => o && o[k] ? { scale: k + String(o[k].Scale ?? "0"), text: o[k].Text || null } : null;
  const block = (o) => o ? { geomagnetic: one(o, "G"), radio_blackout: one(o, "R"), radiation: one(o, "S") } : null;
  return { ok: true, current: block(cur), current_stamp: cur.DateStamp && cur.TimeStamp ? `${cur.DateStamp} ${cur.TimeStamp} UTC` : null, past_24h_max: block(past),
    note: "Scales as published by NOAA: G geomagnetic storms, R radio blackouts, S solar radiation storms (0 = none). Forecast days in the NOAA product are deliberately not used." };
}
export function parseWind(j) {
  const rows = tbl(j).map((r) => ({ time: iso(r.time_tag), density: num(r.density ?? r.proton_density), speed: num(r.speed ?? r.proton_speed), temperature: num(r.temperature ?? r.proton_temperature) })).filter((r) => r.time && (r.speed != null || r.density != null));
  const last = [...rows].reverse().find((r) => r.speed != null && r.density != null) || rows[rows.length - 1];
  if (!last) return { ok: false };
  return { ok: true, time: last.time, speed_kms: last.speed, density_pcm3: last.density, temperature_k: last.temperature };
}
const cls = (c) => { const m = /^([A-Z])(\d+(?:\.\d+)?)?/.exec(String(c || "")); return m ? m[1] : null; };
export function parseFlares(j, nowMs = Date.now()) {
  if (!Array.isArray(j)) return { ok: false };
  const items = j.filter((x) => x && typeof x === "object").map((x) => ({ begin: iso(x.begin_time || x.time_tag), max: iso(x.max_time), max_class: x.max_class || x.current_class || null }))
    .filter((x) => x.max_class && ["M", "X"].includes(cls(x.max_class)) && Date.parse(x.max || x.begin) >= nowMs - 864e5)
    .sort((a, b) => Date.parse(b.max || b.begin) - Date.parse(a.max || a.begin));
  return { ok: true, count_24h: items.length, strongest: items.reduce((b, x) => (!b || (cls(x.max_class) === "X" && cls(b.max_class) !== "X") || (cls(x.max_class) === cls(b.max_class) && parseFloat(x.max_class.slice(1)) > parseFloat(b.max_class.slice(1))) ? x : b), null)?.max_class || null, events: items.slice(0, 8), note: "M- and X-class X-ray flares in the last 24 hours (GOES)." };
}
