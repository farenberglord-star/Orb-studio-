// Luft in Deutschland: Luftqualitätsindex der nächsten UBA-Messstation. Quelle: Umweltbundesamt mit Daten der Messnetze der Länder und des Bundes
// (Datenlizenz Deutschland – Namensnennung 2.0). Der Index ist vorläufig (nicht qualitätsgesichert). Reine Parser: das Abrufen macht worker.js.
// Дистанция до станции — это расстояние до станции, а не измерение в самой точке: в ответе это сказано явно.
export const AIR_ATTRIBUTION = "Umweltbundesamt mit Daten der Messnetze der Länder und des Bundes";
export const AIR_MAX_KM = 25;
const COMPONENTS = { 1: "PM10", 2: "CO", 3: "O3", 4: "SO2", 5: "NO2", 9: "PM2.5" };
const CLASSES = [["very good", "очень хорошее", "sehr gut"], ["good", "хорошее", "gut"], ["moderate", "умеренное", "mäßig"], ["poor", "плохое", "schlecht"], ["very poor", "очень плохое", "sehr schlecht"]];

function km(lat1, lon1, lat2, lon2) {
  const r = Math.PI / 180, dl = (lat2 - lat1) * r, dn = (lon2 - lon1) * r;
  const h = Math.sin(dl / 2) ** 2 + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dn / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
// Станции: массивы разной длины в v2–v4, поэтому код станции, название и пара «долгота, широта» ищем по виду значений.
export function parseAirStations(json) {
  const rows = json && (json.stations || json.data);
  if (!rows || typeof rows !== "object") return null;
  const out = [];
  for (const row of Array.isArray(rows) ? rows : Object.values(rows)) {
    if (!Array.isArray(row)) continue;
    const code = row.find((x) => typeof x === "string" && /^DE[A-Z]{2}\d{2,3}[A-Z]?$/.test(x));
    let lat = NaN, lon = NaN;
    for (let i = 0; i + 1 < row.length; i++) {
      const a = Number(row[i]), b = Number(row[i + 1]);
      if (row[i] === null || row[i + 1] === null || row[i] === "" || row[i + 1] === "" || !Number.isFinite(a) || !Number.isFinite(b)) continue;
      if (a > 5 && a < 16 && b > 47 && b < 56) { lon = a; lat = b; break; }
    }
    if (!code || !Number.isFinite(lat)) continue;
    const strs = row.filter((x) => typeof x === "string" && x !== code && !/^\d+$/.test(x));
    out.push({ code, name: strs[0] || code, city: strs[1] || null, lat, lon });
  }
  return out.length ? out : null;
}
export function nearestAirStation(stations, lat, lon) {
  if (!Array.isArray(stations) || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  let best = null;
  for (const s of stations) { const d = km(lat, lon, s.lat, s.lon); if (!best || d < best.distance_km) best = { ...s, distance_km: d }; }
  return best ? { ...best, distance_km: Math.round(best.distance_km * 10) / 10 } : null;
}
// airquality/json: data → станция → дата начала → [конец, общий индекс, неполные данные, [компонент, значение, индекс, y], ...]
export function parseAirQuality(json) {
  const data = json && json.data;
  if (!data || typeof data !== "object") return null;
  const st = Object.values(data)[0];
  if (!st || typeof st !== "object") return null;
  let best = null;
  for (const k of Object.keys(st).sort()) {
    const e = st[k];
    if (!Array.isArray(e) || e[1] === null || e[1] === undefined || !Number.isFinite(Number(e[1]))) continue;
    best = { start: k, end: e[0], index: Number(e[1]), incomplete: Number(e[2]) === 1, parts: e.slice(3).filter(Array.isArray) };
  }
  if (!best) return null;
  const pollutants = best.parts.map((p) => ({ pollutant: COMPONENTS[p[0]] || "component " + p[0], value_ug_m3: Number(p[1]), class_index: Number(p[2]) })).filter((p) => Number.isFinite(p.value_ug_m3));
  return { hour_start: best.start, hour_end: best.end, index: best.index, incomplete: best.incomplete, pollutants };
}
export function airSummary(station, aq) {
  if (!station) return { status: "no_station", source: AIR_ATTRIBUTION, note: `No UBA station within ${AIR_MAX_KM} km. Not zero pollution: nothing measured near this place.` };
  if (!aq) return { status: "unavailable", station: station.name, distance_km: station.distance_km, source: AIR_ATTRIBUTION, note: "The station gave no index for the last hours." };
  const cls = CLASSES[aq.index];
  return {
    status: "ok", source: AIR_ATTRIBUTION, licence: "Datenlizenz Deutschland – Namensnennung 2.0", provisional: true,
    station: station.name, station_code: station.code, city: station.city, distance_km: station.distance_km,
    hour_start: aq.hour_start, index: aq.index, index_class: cls ? { en: cls[0], ru: cls[1], de: cls[2] } : null, data_incomplete: aq.incomplete,
    worst_pollutants: aq.pollutants.filter((p) => p.class_index === aq.index).map((p) => p.pollutant), pollutants: aq.pollutants.slice(0, 6),
    note: "Latest hourly index of the nearest station (worst pollutant decides), not a measurement at the exact spot. Values are provisional until quality assured. Scale labels follow the five UBA classes; see umweltbundesamt.de/berechnungsgrundlagen-luftqualitaetsindex. Not a health recommendation.",
  };
}
