// Frequency of the Continental European power grid, measured at Freiburg (Fraunhofer ISE) and published by Energy-Charts (CC BY 4.0, no key).
// Facts only: the latest reading, simple arithmetic over published values, no forecast, no grid-stability score.
export const FREQ_URL = "https://api.energy-charts.info/frequency";
export const ATTRIBUTION = "Energy-Charts (Fraunhofer ISE), https://www.energy-charts.info, licensed CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Orb Studio computed minute means, minimum, maximum and shares from the published 1-second values; nothing else was changed.";
export const STANDARD_RANGE_HZ = 0.05; // ±50 mHz around 50 Hz: the "standard frequency range" of the European system operation guideline (EU 2017/1485)
const r4 = (v) => Math.round(v * 1e4) / 1e4;
const iso = (s) => new Date(s * 1000).toISOString();

export async function fetchFrequency(fetcher = fetch) {
  const r = await fetcher(FREQ_URL, { headers: { accept: "application/json", "user-agent": "orbstudio.org (open data dashboard)" }, signal: AbortSignal.timeout(12000) });
  if (!r.ok) throw new Error("energy-charts http " + r.status + (r.status === 429 ? " (rate limit)" : ""));
  const j = await r.json();
  if (!j || !Array.isArray(j.unix_seconds) || !Array.isArray(j.data)) throw new Error("energy-charts: unexpected answer");
  return j;
}

export function summarizeFrequency(j, now = Date.now()) {
  if (!j || !Array.isArray(j.unix_seconds) || !Array.isArray(j.data)) return { ok: false };
  const n = Math.min(j.unix_seconds.length, j.data.length), pts = [];
  for (let i = 0; i < n; i++) { const t = j.unix_seconds[i], v = j.data[i]; if (Number.isFinite(t) && typeof v === "number" && Number.isFinite(v) && v > 40 && v < 60) pts.push([t, v]); }
  if (!pts.length) return { ok: false };
  const last = pts[pts.length - 1], ageMin = Math.max(0, Math.round((now / 1000 - last[0]) / 60 * 10) / 10);
  const win = (sec) => pts.filter((p) => p[0] > last[0] - sec).map((p) => p[1]);
  const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length;
  const w60 = win(60), w900 = win(900);
  let mn = pts[0], mx = pts[0], out = 0;
  for (const p of pts) { if (p[1] < mn[1]) mn = p; if (p[1] > mx[1]) mx = p; if (Math.abs(p[1] - 50) > STANDARD_RANGE_HZ) out++; }
  const perMin = [], from = last[0] - 3600, buckets = new Map();
  for (const p of pts) if (p[0] > from) { const k = Math.floor(p[0] / 60); const b = buckets.get(k) || []; b.push(p[1]); buckets.set(k, b); }
  for (const [k, b] of [...buckets].sort((a, c) => a[0] - c[0])) perMin.push({ minute: iso(k * 60), mean_hz: r4(mean(b)) });
  return {
    ok: true, unit: "Hz", nominal_hz: 50,
    latest: { hz: r4(last[1]), at: iso(last[0]), age_min: ageMin, deviation_mhz: Math.round((last[1] - 50) * 1000) },
    last_minute: { mean_hz: r4(mean(w60)), min_hz: r4(Math.min(...w60)), max_hz: r4(Math.max(...w60)), samples: w60.length },
    last_15_min: { mean_hz: r4(mean(w900)), min_hz: r4(Math.min(...w900)), max_hz: r4(Math.max(...w900)), samples: w900.length },
    today_utc: { since: iso(pts[0][0]), samples: pts.length, min_hz: r4(mn[1]), min_at: iso(mn[0]), max_hz: r4(mx[1]), max_at: iso(mx[0]),
      share_outside_standard_range_pct: Math.round(out / pts.length * 1000) / 10 },
    standard_range: { low_hz: 50 - STANDARD_RANGE_HZ, high_hz: 50 + STANDARD_RANGE_HZ, note: "±50 mHz around 50 Hz is the standard frequency range in the European system operation guideline (EU 2017/1485). Shown as a reference for the share above; not a statement about grid stability." },
    last_hour_per_minute: perMin,
  };
}
