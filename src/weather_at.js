// Austria: live 10-minute station observations (GeoSphere Austria Data Hub, TAWES, CC BY 4.0). Values are passed through unchanged; null stays null; nothing is forecast.
export const TAWES_PARAMS = { TL: "temp_c", RR: "precip_10min_mm", FF: "wind_ms", DD: "wind_dir_deg", FFX: "gust_ms", P: "pressure_hpa", PRED: "pressure_msl_hpa", RF: "humidity_pct", SO: "sunshine_s_10min", SCHNEE: "snow_cm" };
export const STATIONS = [
  { id: "11035", name: "Wien · Hohe Warte", state: "Wien", lat: 48.2486, lon: 16.3564, alt: 198 },
  { id: "11150", name: "Salzburg · Flughafen", state: "Salzburg", lat: 47.7894, lon: 13.0086, alt: 430 },
  { id: "11320", name: "Innsbruck · Universität", state: "Tirol", lat: 47.26, lon: 11.3842, alt: 578 },
  { id: "11240", name: "Graz · Thalerhof Flughafen", state: "Steiermark", lat: 46.9806, lon: 15.44, alt: 340 },
  { id: "11060", name: "Linz · Stadt", state: "Oberösterreich", lat: 48.2964, lon: 14.2856, alt: 262 },
  { id: "11331", name: "Klagenfurt · Flughafen", state: "Kärnten", lat: 46.6483, lon: 14.3183, alt: 450 },
  { id: "11101", name: "Bregenz", state: "Vorarlberg", lat: 47.4992, lon: 9.7461, alt: 424 },
  { id: "11190", name: "Eisenstadt", state: "Burgenland", lat: 47.8542, lon: 16.5383, alt: 184 },
  { id: "11389", name: "St. Pölten · Landhaus", state: "Niederösterreich", lat: 48.1997, lon: 15.6311, alt: 274 },
  { id: "11343", name: "Sonnblick", state: "Salzburg", lat: 47.0542, lon: 12.9575, alt: 3109 },
  { id: "11110", name: "Galzig", state: "Tirol", lat: 47.1297, lon: 10.2303, alt: 2079 },
  { id: "11126", name: "Patscherkofel", state: "Tirol", lat: 47.2089, lon: 11.4622, alt: 2251 },
];
export const TAWES_URL = "https://dataset.api.hub.geosphere.at/v1/station/current/tawes-v1-10min?parameters=" + Object.keys(TAWES_PARAMS).join(",") + "&station_ids=" + STATIONS.map((s) => s.id).join(",") + "&output_format=geojson";
export const STALE_MIN = 40;
export const ATTRIBUTION = { text: "Datenquelle: GeoSphere Austria - https://data.hub.geosphere.at", license: "CC BY 4.0", license_url: "https://creativecommons.org/licenses/by/4.0/legalcode", url: "https://data.hub.geosphere.at/dataset/tawes-v1-10min" };
const num = (x) => (typeof x === "number" && Number.isFinite(x) ? x : null);
export function parseTawes(j, now = Date.now()) {
  const feats = j && Array.isArray(j.features) ? j.features : null, ts = j && Array.isArray(j.timestamps) ? j.timestamps[0] : null;
  const t = Date.parse(ts || "");
  if (!feats || !Number.isFinite(t)) return { ok: false };
  const by = {};
  for (const f of feats) { const p = f && f.properties; if (p && p.station && p.parameters && typeof p.parameters === "object") by[String(p.station)] = p.parameters; }
  const age = Math.round((now - t) / 6e4), stale = age > STALE_MIN || age < -5;
  const stations = STATIONS.map((s) => {
    const pr = by[s.id], o = { station: s.id, name: s.name, state: s.state, lat: s.lat, lon: s.lon, altitude_m: s.alt };
    for (const k of Object.keys(TAWES_PARAMS)) { const d = pr && pr[k] && Array.isArray(pr[k].data) ? pr[k].data[0] : null; o[TAWES_PARAMS[k]] = stale ? null : num(d); }
    o.live = !stale && o.temp_c != null;
    return o;
  });
  if (!stations.some((s) => s.live) && !stale && !feats.length) return { ok: false };
  return { ok: true, observed_at: new Date(t).toISOString(), age_min: age, stale, live_count: stations.filter((s) => s.live).length, stations };
}
