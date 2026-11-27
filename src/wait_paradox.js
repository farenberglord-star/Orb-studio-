// «Парадокс ожидания» на остановках (Терада 1922, Феллер 1966): человек, пришедший в случайный момент, ждёт в среднем E[H²]/(2·E[H]),
// а не E[H]/2. Если автобусы идут неровно, ожидание длиннее «половины интервала». Число: отношение ожидания к половине среднего интервала = 1 + CV² (≥ 1).
// Вход: GTFS-Realtime TripUpdates (protobuf), поток VBB (Berlin-Brandenburg), CC BY 4.0. Расписание не нужно: интервалы берём из прогнозных времён прибытия соседних рейсов
// одной линии на одной остановке. Это прогнозы оператора, а не измеренные прибытия; в отчёте так и сказано.
export const VBB_RT_URL = "https://production.gtfsrt.vbb.de/data";
export const WAIT_ATTRIBUTION = { text: "VBB Verkehrsverbund Berlin-Brandenburg, GTFS-Realtime, CC BY 4.0", license: "CC BY 4.0", license_url: "https://creativecommons.org/licenses/by/4.0/", url: "https://production.gtfsrt.vbb.de" };
export const MIN_TRIPS = 4, MIN_GROUPS = 20, MAX_FEED_BYTES = 12e6;

// --- минимальный разбор protobuf (varint, длина-префикс) под gtfs-realtime.proto ---
function reader(buf, start = 0, end = buf.length) {
  let p = start;
  const varint = () => { let lo = 0, hi = 0, s = 0, b; do { if (p >= end) throw new Error("eof"); b = buf[p++]; if (s < 28) lo |= (b & 127) << s; else hi |= (b & 127) << (s - 28); s += 7; if (s > 70) throw new Error("varint"); } while (b & 128); return (hi >>> 0) * 268435456 + (lo >>> 0); };
  return { more: () => p < end, varint, pos: () => p, skip: (n) => { p += n; if (p > end) throw new Error("eof"); } };
}
function fields(buf, start, end, onField) {
  const r = reader(buf, start, end);
  while (r.more()) {
    const tag = r.varint(), f = Math.floor(tag / 8), w = tag % 8;
    if (w === 0) onField(f, w, r.varint());
    else if (w === 2) { const len = r.varint(), s = r.pos(); r.skip(len); onField(f, w, [s, s + len]); }
    else if (w === 1) r.skip(8);
    else if (w === 5) r.skip(4);
    else throw new Error("wire " + w);
  }
}
const str = (buf, [s, e]) => new TextDecoder().decode(buf.subarray(s, e));
export function decodeTripUpdates(bytes) {
  const buf = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), out = [];
  fields(buf, 0, buf.length, (f, w, v) => {
    if (f !== 2 || w !== 2) return; // FeedMessage.entity
    let tu = null;
    fields(buf, v[0], v[1], (f2, w2, v2) => { if (f2 === 3 && w2 === 2) tu = v2; }); // FeedEntity.trip_update
    if (!tu) return;
    const t = { trip_id: null, route_id: null, direction: null, cancelled: false, stops: [] };
    fields(buf, tu[0], tu[1], (f3, w3, v3) => {
      if (f3 === 1 && w3 === 2) fields(buf, v3[0], v3[1], (f4, w4, v4) => { // TripDescriptor
        if (f4 === 1 && w4 === 2) t.trip_id = str(buf, v4); else if (f4 === 5 && w4 === 2) t.route_id = str(buf, v4);
        else if (f4 === 6 && w4 === 0) t.direction = v4; else if (f4 === 4 && w4 === 0 && v4 === 3) t.cancelled = true; });
      else if (f3 === 2 && w3 === 2) { // StopTimeUpdate
        const s = { stop_id: null, time: null, skipped: false };
        fields(buf, v3[0], v3[1], (f4, w4, v4) => {
          if (f4 === 4 && w4 === 2) s.stop_id = str(buf, v4); else if (f4 === 5 && w4 === 0 && v4 === 1) s.skipped = true;
          else if ((f4 === 2 || f4 === 3) && w4 === 2) fields(buf, v4[0], v4[1], (f5, w5, v5) => { if (f5 === 2 && w5 === 0 && (f4 === 2 || s.time == null)) s.time = v5; }); }); // arrival.time, else departure.time
        if (s.stop_id && s.time) t.stops.push(s);
      }
    });
    out.push(t);
  });
  return out;
}

// --- статистика ---
const r2 = (v) => Math.round(v * 100) / 100;
export function groupHeadways(trips) {
  const g = new Map();
  for (const t of trips) {
    if (t.cancelled || !t.route_id) continue;
    for (const s of t.stops) { if (s.skipped) continue; const k = `${s.stop_id}|${t.route_id}|${t.direction ?? ""}`; (g.get(k) || g.set(k, []).get(k)).push(s.time); }
  }
  const res = [];
  for (const [k, times] of g) {
    const ts = [...new Set(times)].sort((a, b) => a - b);
    if (ts.length < MIN_TRIPS) continue;
    const h = []; for (let i = 1; i < ts.length; i++) { const d = (ts[i] - ts[i - 1]) / 60; if (d >= 1 && d <= 120) h.push(d); }
    if (h.length < MIN_TRIPS - 1) continue;
    const m1 = h.reduce((a, b) => a + b, 0) / h.length, m2 = h.reduce((a, b) => a + b * b, 0) / h.length;
    const [stop, route] = k.split("|");
    res.push({ stop, route, trips: ts.length, mean_headway_min: r2(m1), expected_wait_min: r2(m2 / (2 * m1)), half_headway_min: r2(m1 / 2), ratio: r2(m2 / (2 * m1) / (m1 / 2)) });
  }
  return res;
}
export function waitParadox(trips) {
  const g = groupHeadways(trips);
  if (g.length < MIN_GROUPS) return { status: "collecting", groups: g.length, need: MIN_GROUPS };
  const rs = g.map((x) => x.ratio).sort((a, b) => a - b), med = rs[Math.floor(rs.length / 2)];
  return { status: "ok", groups: g.length, median_ratio: med, share_ratio_over_1_25: r2(rs.filter((x) => x > 1.25).length / rs.length),
    worst: [...g].sort((a, b) => b.ratio - a.ratio).slice(0, 10),
    note: { en: "If vehicles come unevenly, someone arriving at a random moment waits longer than half the average gap. Ratio 1 = perfectly even; 1.5 = a random arrival waits 50 % longer than the timetable gap suggests. Built from the operator's forecast arrival times, not from measured arrivals.", ru: "Если транспорт идёт неровно, пришедший в случайный момент ждёт дольше половины среднего интервала. Отношение 1 — идеально ровно; 1,5 — ожидание на 50 % больше, чем подсказывает интервал по расписанию. Считано по прогнозным временам оператора, а не по измеренным прибытиям.", de: "Kommen die Fahrzeuge ungleichmäßig, wartet man bei zufälliger Ankunft länger als den halben mittleren Abstand. Verhältnis 1 = ganz gleichmäßig; 1,5 = 50 % längeres Warten als der Fahrplanabstand vermuten lässt. Berechnet aus den Prognosezeiten des Betreibers, nicht aus gemessenen Ankünften." },
    source: WAIT_ATTRIBUTION.text };
}
