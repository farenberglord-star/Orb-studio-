import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseBrightSky, summarizeWeather, weatherNow } from "../src/weather_now.js";
import { normQuery, parseNominatim, geocode } from "../src/geocode.js";
import { conditionsSummary } from "../src/route_conditions.js";
const BS = { weather: { timestamp: "2026-11-27T10:00:00+00:00", source_id: 7, temperature: 4.26, wind_speed_10: 21.6, wind_gust_speed_10: 40.3, wind_direction_10: 250, condition: "cloudy" }, sources: [{ id: 7, station_name: "Hamburg-Fuhlsbüttel" }] };
test("parseBrightSky: temperature, wind, gusts, station; empty is null", () => {
  const p = parseBrightSky(BS);
  assert.equal(p.temperature_c, 4.3); assert.equal(p.wind_kmh, 21.6); assert.equal(p.gust_kmh, 40.3); assert.equal(p.wind_dir_deg, 250); assert.equal(p.station, "Hamburg-Fuhlsbüttel");
  assert.equal(parseBrightSky({ weather: {} }), null); assert.equal(parseBrightSky(null), null);
  assert.equal(parseBrightSky({ weather: { temperature: null, wind_speed_10: null } }), null);
});
test("summarizeWeather: min/max temp, max wind, unavailable when nothing", () => {
  const a = parseBrightSky(BS), b = parseBrightSky({ weather: { temperature: -1.2, wind_speed_10: 35, wind_gust_speed_10: 61 } });
  const s = summarizeWeather([a, null, b]);
  assert.equal(s.status, "ok"); assert.equal(s.temperature_min_c, -1.2); assert.equal(s.temperature_max_c, 4.3); assert.equal(s.wind_max_kmh, 35); assert.equal(s.gust_max_kmh, 61); assert.equal(s.points_with_data, 2); assert.equal(s.points_checked, 3);
  assert.equal(summarizeWeather([null, null]).status, "unavailable"); assert.equal(summarizeWeather([]).status, "unavailable");
});
test("weatherNow: fetches Bright Sky with units=dwd and caches", async () => {
  const store = new Map(); const cache = { match: async (k) => store.get(k.url), put: async (k, r) => { store.set(k.url, r); } };
  let n = 0, url; const f = async (u) => { n++; url = u; return { ok: true, json: async () => BS }; };
  const p = await weatherNow(53.55, 9.99, f, { match: async () => undefined, put: cache.put });
  assert.equal(p.wind_kmh, 21.6); assert.match(url, /brightsky\.dev\/current_weather\?lat=53\.55&lon=9\.99&units=dwd/); assert.equal(n, 1);
  await assert.rejects(weatherNow(53.5, 9.9, async () => ({ ok: false, status: 500 }), null));
});
test("conditionsSummary carries weather when given", () => {
  const c = conditionsSummary({ sun: null, durationMin: 10, air: [], dwd: null, state: "HH", mode: "bike", weather: { status: "ok" } });
  assert.equal(c.weather.status, "ok"); assert.equal(conditionsSummary({ sun: null, durationMin: 10, air: [], dwd: null, state: "HH", mode: "bike" }).weather, undefined);
});
test("normQuery: accepts addresses, rejects short, numeric and control junk", () => {
  assert.equal(normQuery("  Bergedorfer   Straße 1 "), "Bergedorfer Straße 1");
  assert.equal(normQuery("ab"), null); assert.equal(normQuery("53.5, 9.9"), null); assert.equal(normQuery("12345"), null); assert.equal(normQuery("x".repeat(101)), null); assert.equal(normQuery(undefined), null);
  assert.equal(normQuery("Hannoversche\nStraße"), "Hannoversche Straße");
});
test("parseNominatim: first hit inside the Hamburg box, rounds, shortens name", () => {
  const r = parseNominatim([{ lat: "48.1", lon: "11.5", display_name: "München" }, { lat: "53.4645123", lon: "9.9876543", display_name: "Hannoversche Straße, Harburg, Hamburg, 21079, Deutschland" }]);
  assert.deepEqual(r, { lat: 53.4645, lon: 9.9877, place: "Hannoversche Straße, Harburg, Hamburg" });
  assert.equal(parseNominatim([{ lat: "48.1", lon: "11.5" }]), null); assert.equal(parseNominatim(null), null); assert.equal(parseNominatim([]), null);
});
test("geocode: one Nominatim call with UA and viewbox, hashed cache key, notfound and unavailable", async () => {
  const store = new Map(); const cache = { match: async (k) => store.get(k.url)?.clone(), put: async (k, r) => { store.set(k.url, r); } };
  let n = 0, seen; const f = async (u, o) => { n++; seen = { u, ua: o.headers["User-Agent"] }; return { ok: true, json: async () => [{ lat: "53.46", lon: "9.98", display_name: "Hannoversche Straße, Hamburg" }] }; };
  const g1 = await geocode("Hannoversche Straße 10", f, cache, async () => {}), g2 = await geocode("hannoversche straße 10", f, cache, async () => {});
  assert.equal(g1.lat, 53.46); assert.deepEqual(g2, g1); assert.equal(n, 1, "second call from cache");
  assert.match(seen.u, /nominatim\.openstreetmap\.org\/search\?/); assert.match(seen.u, /bounded=1/); assert.match(seen.u, /countrycodes=de/); assert.match(seen.ua, /OrbStudio/);
  for (const k of store.keys()) assert.ok(!/Hannover|hannover/.test(k), "cache key is a hash, not the text");
  assert.deepEqual(await geocode("Nirgendwostraße 99", async () => ({ ok: true, json: async () => [] }), null, async () => {}), { notfound: true });
  assert.deepEqual(await geocode("Irgendwas Straße", async () => ({ ok: false, status: 429 }), null, async () => {}), { unavailable: true });
  assert.equal(await geocode("12", f, cache), null);
});
test("geocode waits when the last call was under 1.1 s ago", async () => {
  const store = new Map(); const cache = { match: async (k) => store.get(k.url)?.clone(), put: async (k, r) => { store.set(k.url, r); } };
  let waited = 0; const f = async () => ({ ok: true, json: async () => [] });
  await geocode("Erste Straße 1", f, cache, async (ms) => { waited += ms; });
  await geocode("Zweite Straße 2", f, cache, async (ms) => { waited += ms; });
  assert.ok(waited > 0 && waited <= 1100, "waited " + waited);
});
test("route-weather pages: free-text inputs with datalist, temperature and wind rows, Nominatim and DWD notes", () => {
  for (const f of ["public/tools/route-weather.html", "public/de/tools/route-weather.html", "public/en/tools/route-weather.html"]) {
    const h = readFileSync(new URL("../" + f, import.meta.url), "utf8");
    assert.match(h, /<input id="from" list="pl"/); assert.match(h, /<input id="to" list="pl"/); assert.match(h, /<datalist id="pl">/);
    assert.ok(!/<select id="from"/.test(h)); assert.match(h, /Nominatim/); assert.match(h, /Bright Sky/); assert.match(h, /r_temp/); assert.match(h, /wind_max_kmh/);
  }
});
