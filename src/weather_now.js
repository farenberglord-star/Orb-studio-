// Погода «сейчас» вдоль маршрута: температура и ветер. Источник: Bright Sky (открытые данные Службы погоды Германии, DWD), без ключа.
// Наблюдение на ближайшей станции, не прогноз. Единицы: °C и км/ч (units=dwd).
export const BRIGHTSKY_URL = "https://api.brightsky.dev/current_weather";
export const WEATHER_ATTRIBUTION = "Weather: Deutscher Wetterdienst (DWD) open data via Bright Sky (brightsky.dev).";
const num = (x) => (Number.isFinite(x) ? x : null);
const r1 = (x) => (x === null ? null : Math.round(x * 10) / 10);
export function parseBrightSky(j) {
  const w = j && j.weather;
  if (!w || typeof w !== "object") return null;
  const t = num(w.temperature), wind = num(w.wind_speed_10 ?? w.wind_speed_30 ?? w.wind_speed_60 ?? w.wind_speed);
  if (t === null && wind === null) return null;
  const gust = num(w.wind_gust_speed_10 ?? w.wind_gust_speed_30 ?? w.wind_gust_speed_60 ?? w.wind_gust_speed);
  const dir = num(w.wind_direction_10 ?? w.wind_direction_30 ?? w.wind_direction_60 ?? w.wind_direction);
  const src = Array.isArray(j.sources) ? j.sources.find((s) => s && s.id === w.source_id) || j.sources[0] : null;
  return { temperature_c: r1(t), wind_kmh: r1(wind), gust_kmh: r1(gust), wind_dir_deg: dir === null ? null : Math.round(dir), condition: typeof w.condition === "string" ? w.condition : null,
    observed_at: typeof w.timestamp === "string" ? w.timestamp : null, station: src && src.station_name ? String(src.station_name).slice(0, 60) : null };
}
export function summarizeWeather(list) {
  const ok = (list || []).filter(Boolean);
  if (!ok.length) return { status: "unavailable", points_checked: (list || []).length, note: "No DWD observation for the route points." };
  const temps = ok.map((x) => x.temperature_c).filter((x) => x !== null), winds = ok.filter((x) => x.wind_kmh !== null), gusts = ok.map((x) => x.gust_kmh).filter((x) => x !== null);
  const wmax = winds.reduce((m, x) => (!m || x.wind_kmh > m.wind_kmh ? x : m), null), mid = ok[Math.floor(ok.length / 2)];
  return { status: "ok", temperature_min_c: temps.length ? Math.min(...temps) : null, temperature_max_c: temps.length ? Math.max(...temps) : null,
    wind_max_kmh: wmax ? wmax.wind_kmh : null, wind_dir_deg: wmax ? wmax.wind_dir_deg : null, gust_max_kmh: gusts.length ? Math.max(...gusts) : null,
    condition: mid.condition, observed_at: ok.map((x) => x.observed_at).filter(Boolean).sort().pop() || null, points_with_data: ok.length, points_checked: (list || []).length,
    note: "Latest DWD observation at the nearest station to each route point, not a forecast. Wind is the 10-minute mean in km/h.", attribution: WEATHER_ATTRIBUTION };
}
export async function weatherNow(lat, lon, fetchImpl = fetch, cache = typeof caches !== "undefined" ? caches.default : null) {
  const la = Math.round(lat * 100) / 100, lo = Math.round(lon * 100) / 100;
  const key = new Request(`https://orbstudio.org/__cache/brightsky-v1/${la},${lo}`);
  try { const hit = cache && (await cache.match(key)); if (hit) return await hit.json(); } catch (e) {}
  const r = await fetchImpl(`${BRIGHTSKY_URL}?lat=${la}&lon=${lo}&units=dwd`, { signal: AbortSignal.timeout(6000), headers: { "User-Agent": "OrbStudio/1.0 (+https://orbstudio.org/tools/route-weather)", Accept: "application/json" } });
  if (!r.ok) throw new Error("brightsky http " + r.status);
  const p = parseBrightSky(await r.json());
  if (p && cache) { try { await cache.put(key, new Response(JSON.stringify(p), { headers: { "Cache-Control": "max-age=600" } })); } catch (e) {} }
  return p;
}
