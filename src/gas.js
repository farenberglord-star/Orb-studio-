// German natural gas storage fill level from GIE AGSI+ (open data, free key). Values are passed through as published; nothing is forecast.
const num = (x) => { const v = x == null || x === "" || x === "-" ? NaN : +x; return Number.isFinite(v) ? v : null; };
const r1 = (v) => Math.round(v * 10) / 10, r2 = (v) => Math.round(v * 100) / 100;
export function parseGas(j) {
  const rows = (j && Array.isArray(j.data) ? j.data : []).map((x) => ({ day: String(x && x.gasDayStart || ""), full: num(x && x.full), twh: num(x && x.gasInStorage), wgv: num(x && x.workingGasVolume), inj: num(x && x.injection), wd: num(x && x.withdrawal), trend: num(x && x.trend), status: x && x.status || null }))
    .filter((x) => /^\d{4}-\d{2}-\d{2}$/.test(x.day) && x.full != null).sort((a, b) => (a.day < b.day ? 1 : -1));
  if (!rows.length) return { ok: false };
  const c = rows[0], d7 = rows.find((x) => Math.round((Date.parse(c.day) - Date.parse(x.day)) / 864e5) === 7) || null;
  return { ok: true, gas_day: c.day, full_percent: r2(c.full), gas_in_storage_twh: c.twh, working_gas_volume_twh: c.wgv, injection_gwh_d: c.inj, withdrawal_gwh_d: c.wd,
    net_flow: c.inj != null && c.wd != null ? (c.wd > c.inj ? "WITHDRAWING" : c.inj > c.wd ? "INJECTING" : "BALANCED") : null,
    trend_pp_day: c.trend, trend_note: "Percentage points per day as published by GIE AGSI+; not a forecast.",
    data_status: c.status, data_status_note: "AGSI+ status: C = confirmed, E = estimated, N = not yet available.",
    observed_change_7d: d7 ? { change_pp: r1(c.full - d7.full), from_day: d7.day, note: "Difference between two published fill levels. Computed by Orb Studio; not a forecast." } : null,
    series: rows.slice(0, 30).reverse().map((x) => ({ day: x.day, full_percent: r2(x.full) })) };
}
