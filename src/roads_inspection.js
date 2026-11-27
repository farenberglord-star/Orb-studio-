// «Парадокс инспекции» на пробках (Терада 1922, Феллер 1966): случайный момент чаще попадает в длинную пробку.
// Берём получасовые снимки трасс Гамбурга (Autobahn GmbH): для каждой пробки длительность = от первого до последнего снимка + шаг.
// Число: средняя длительность пробки, которую видишь в случайный момент, к средней длительности пробки вообще (≥ 1).
export const SNAP_STEP_MS = 30 * 60e3;
export const INSPECTION_MIN_JAMS = 30;
export function inspectionStats(rows, now = Date.now()) {
  if (!Array.isArray(rows) || !rows.length) return { status: "collecting", jams_finished: 0, need: INSPECTION_MIN_JAMS };
  const seen = new Map();
  const lastTs = Math.max(...rows.map((r) => r.ts));
  for (const r of rows) for (const j of r.jams || []) { const id = String(j[0]); const e = seen.get(id) || { first: r.ts, last: r.ts, n: 0 }; e.first = Math.min(e.first, r.ts); e.last = Math.max(e.last, r.ts); e.n++; seen.set(id, e); }
  const done = [...seen.values()].filter((e) => e.last < lastTs - SNAP_STEP_MS / 2 && e.first > Math.min(...rows.map((r) => r.ts)));
  if (done.length < INSPECTION_MIN_JAMS) return { status: "collecting", jams_finished: done.length, need: INSPECTION_MIN_JAMS };
  const dur = done.map((e) => (e.last - e.first + SNAP_STEP_MS) / 60e3);
  const mean = dur.reduce((a, b) => a + b, 0) / dur.length;
  let sum = 0, cnt = 0;
  for (const e of done) { const d = (e.last - e.first + SNAP_STEP_MS) / 60e3; sum += d * e.n; cnt += e.n; }
  const atRandom = sum / cnt;
  return { status: "ok", jams_finished: done.length, mean_duration_min: Math.round(mean), mean_seen_at_random_min: Math.round(atRandom), ratio: Math.round((atRandom / mean) * 100) / 100,
    note: { en: "A random look at the road finds the longer jams more often, so the typical jam you see lasts longer than the typical jam there is. Plan the buffer by the second number, not the first.", ru: "Случайный взгляд на дорогу чаще попадает в долгие пробки, поэтому типичная увиденная пробка длиннее типичной пробки вообще. Запас считайте по второму числу, а не по первому.", de: "Ein zufälliger Blick auf die Straße trifft häufiger die langen Staus; der typische gesehene Stau dauert also länger als der typische Stau überhaupt. Den Puffer nach der zweiten Zahl planen." },
    source: "Autobahn GmbH des Bundes (open data), half-hourly snapshots; jams still running are left out" };
}
