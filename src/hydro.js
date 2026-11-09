// Elbe water level from PEGELONLINE (WSV, open data). Values and trend are passed through as published; nothing is computed or forecast.
export const STATIONS = { st_pauli: /ST\.?\s*PAULI/i, cuxhaven: /CUXHAVEN/i };
const num = (x) => { const v = x == null || x === "" ? NaN : +x; return Number.isFinite(v) ? v : null; };
const TREND = { "-1": "FALLING", "0": "STABLE", "1": "RISING" };
export function parseStations(j, which = "all") {
  if (!Array.isArray(j)) return { ok: false };
  const keys = which === "all" ? Object.keys(STATIONS) : STATIONS[which] ? [which] : [];
  const out = [];
  for (const key of keys) {
    const st = j.find((s) => s && STATIONS[key].test(String(s.shortname || s.longname || "")));
    if (!st) { out.push({ station: key, ok: false, reason: "station not in feed" }); continue; }
    const ts = (n) => (Array.isArray(st.timeseries) ? st.timeseries.find((t) => t && t.shortname === n) : null);
    const W = ts("W"), cm = W && W.currentMeasurement;
    if (!cm || num(cm.value) == null) { out.push({ station: key, name: st.longname || st.shortname, ok: false, reason: "no current water level" }); continue; }
    const t = num(cm.trend);
    const WT = ts("WT"), wt = WT && WT.currentMeasurement && num(WT.currentMeasurement.value);
    out.push({
      station: key, ok: true, name: st.longname || st.shortname, water: st.water && (st.water.longname || st.water.shortname) || null,
      water_level_cm: cm.value, measured_at: cm.timestamp || null, unit: (W.unit || "cm"),
      trend: t == null ? null : TREND[String(t)] || null, trend_note: "Trend as published by WSV from the last measurements, not a forecast.",
      level_state: cm.stateMnwMhw || null, level_state_note: "stateMnwMhw: WSV's classification against mean low/high water (e.g. low, normal, high).",
      storm_surge_state: cm.stateNswHsw || null,
      water_temp_c: wt == null ? null : wt,
    });
  }
  if (!out.length) return { ok: false };
  return { ok: out.some((s) => s.ok), stations: out };
}
