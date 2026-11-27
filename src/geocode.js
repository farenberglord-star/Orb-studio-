// Ручной ввод адреса: Nominatim (OpenStreetMap), только серверный поиск по строке, не автодополнение.
// Условия Nominatim: не чаще 1 запроса в секунду на всё приложение, свой User-Agent, кэш, указание источника. Ключ кэша — хэш запроса.
import { ROUTE_BOX } from "./route.js";
export const GEOCODE_ATTRIBUTION = "Address search: Nominatim, © OpenStreetMap contributors (ODbL).";
export function normQuery(s) {
  const t = String(s ?? "").replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();
  if (t.length < 3 || t.length > 100 || !/\p{L}/u.test(t)) return null;
  if (/^[-\d.,;\s]+$/.test(t)) return null;
  return t;
}
export function parseNominatim(arr, box = ROUTE_BOX) {
  if (!Array.isArray(arr)) return null;
  for (const x of arr) {
    const lat = parseFloat(x && x.lat), lon = parseFloat(x && x.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
    if (lat < box.latMin || lat > box.latMax || lon < box.lonMin || lon > box.lonMax) continue;
    return { lat: Math.round(lat * 1e4) / 1e4, lon: Math.round(lon * 1e4) / 1e4, place: String(x.display_name || "").split(",").slice(0, 3).join(",").trim().slice(0, 120) };
  }
  return null;
}
async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s.toLowerCase()));
  return [...new Uint8Array(b)].slice(0, 12).map((x) => x.toString(16).padStart(2, "0")).join("");
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Возвращает {lat, lon, place} | {notfound:true} | {unavailable:true} | null (строка не годится для поиска)
export async function geocode(text, fetchImpl = fetch, cache = typeof caches !== "undefined" ? caches.default : null, wait = sleep) {
  const q = normQuery(text);
  if (!q) return null;
  const key = new Request(`https://orbstudio.org/__cache/geocode-v1/${await sha(q)}`);
  try { const hit = cache && (await cache.match(key)); if (hit) return await hit.json(); } catch (e) {}
  const gate = new Request("https://orbstudio.org/__cache/geocode-gate-v1");
  try { const g = cache && (await cache.match(gate)); if (g) { const last = +(await g.text()); const d = Date.now() - last; if (d >= 0 && d < 1100) await wait(1100 - d); } } catch (e) {}
  try { if (cache) await cache.put(gate, new Response(String(Date.now()), { headers: { "Cache-Control": "max-age=5" } })); } catch (e) {}
  const u = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&countrycodes=de&bounded=1&viewbox=${ROUTE_BOX.lonMin},${ROUTE_BOX.latMax},${ROUTE_BOX.lonMax},${ROUTE_BOX.latMin}&q=${encodeURIComponent(q)}`;
  let out;
  try {
    const r = await fetchImpl(u, { signal: AbortSignal.timeout(6000), headers: { "User-Agent": "OrbStudio/1.0 (+https://orbstudio.org/tools/route-weather; contact via site)", Accept: "application/json" } });
    if (!r.ok) return { unavailable: true };
    out = parseNominatim(await r.json()) || { notfound: true };
  } catch (e) { return { unavailable: true }; }
  try { if (cache) await cache.put(key, new Response(JSON.stringify(out), { headers: { "Cache-Control": out.notfound ? "max-age=86400" : "max-age=2592000" } })); } catch (e) {}
  return out;
}
