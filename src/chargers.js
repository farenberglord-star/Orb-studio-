// Ladesäulen in der Nähe: Bundesnetzagentur, Ladesäulenregister (CC BY 4.0, «Bundesnetzagentur.de»).
// Daten liegen als Zellen 0,5° in public/data/chargers/ (monatlicher Import per GitHub Action). Koordinaten des Nutzers werden nicht gespeichert.
export const CHARGERS_ATTRIBUTION = "Bundesnetzagentur.de, Ladesäulenregister (CC BY 4.0)";
export const CHARGERS_CELL = 0.5;
export const CHARGERS_RADIUS_KM = 2;
const rad = (x) => (x * Math.PI) / 180;
function km(a, b, c, d) { const h = Math.sin(rad(c - a) / 2) ** 2 + Math.cos(rad(a)) * Math.cos(rad(c)) * Math.sin(rad(d - b) / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); }
// Ключи клеток, которые покрывают круг радиуса r вокруг точки
export function chargerCellKeys(lat, lon, r = CHARGERS_RADIUS_KM) {
  const dLat = r / 111, dLon = r / (111 * Math.max(0.2, Math.cos(rad(lat))));
  const keys = new Set();
  for (const la of [lat - dLat, lat + dLat]) for (const lo of [lon - dLon, lon + dLon]) keys.add(`${Math.floor(la / CHARGERS_CELL)}_${Math.floor(lo / CHARGERS_CELL)}`);
  return [...keys];
}
// запись: [lat, lon, kw, dc, points, operator, address]
export function nearestChargers(records, lat, lon, r = CHARGERS_RADIUS_KM, limit = 5) {
  if (!Array.isArray(records)) return [];
  const out = [];
  for (const x of records) {
    if (!Array.isArray(x) || !Number.isFinite(x[0]) || !Number.isFinite(x[1])) continue;
    const d = km(lat, lon, x[0], x[1]);
    if (d <= r) out.push({ distance_m: Math.round(d * 1000), kw: x[2], dc_fast: x[3] === 1, points: x[4], operator: x[5], address: x[6] });
  }
  return out.sort((p, q) => p.distance_m - q.distance_m).slice(0, limit);
}
export function chargersSummary(found, meta, radius = CHARGERS_RADIUS_KM) {
  if (!found) return { status: "unavailable", source: CHARGERS_ATTRIBUTION };
  const dc = found.filter((x) => x.dc_fast).length;
  return {
    status: "ok", source: CHARGERS_ATTRIBUTION, register_date: (meta && meta.stand) || null, radius_km: radius,
    stations_found: found.length, dc_fast_among_them: dc, nearest: found,
    note: { en: "The register lists only operators that completed the Bundesnetzagentur notification, so real chargers are more numerous. It says nothing about whether a charger is free or working right now.", ru: "В реестре только операторы, завершившие уведомление Bundesnetzagentur, реальных зарядок больше. Он не говорит, свободна ли зарядка и работает ли она прямо сейчас.", de: "Das Register enthält nur Betreiber, die das Anzeigeverfahren der Bundesnetzagentur abgeschlossen haben; real gibt es mehr Ladepunkte. Ob eine Säule gerade frei ist oder funktioniert, sagt es nicht." },
  };
}
