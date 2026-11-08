// Сейсмодатчик: открытые каналы USGS (GeoJSON, без ключа, общественное достояние).
// Только чтение. Ничего не предсказывается: показываем, что USGS записал, и ничего сверх этого.

export const USGS_DAY_M45 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson";
export const USGS_SIG_WEEK = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson";

export function parseFeatures(j) {
  const out = [];
  for (const f of (j && j.features) || []) {
    const p = (f && f.properties) || {}, c = (f && f.geometry && f.geometry.coordinates) || [];
    if (p.type && p.type !== "earthquake") continue;
    if (typeof p.mag !== "number" || !p.time) continue;
    out.push({
      mag: Math.round(p.mag * 10) / 10, place: String(p.place || "").slice(0, 120), time: new Date(p.time).toISOString(),
      depth_km: typeof c[2] === "number" ? Math.round(c[2] * 10) / 10 : null,
      lat: typeof c[1] === "number" ? Math.round(c[1] * 100) / 100 : null, lon: typeof c[0] === "number" ? Math.round(c[0] * 100) / 100 : null,
      tsunami_flag: p.tsunami === 1, url: typeof p.url === "string" && p.url.startsWith("https://earthquake.usgs.gov/") ? p.url : null,
    });
  }
  return out.sort((a, b) => b.mag - a.mag || (a.time < b.time ? 1 : -1));
}

export function summarizeQuakes(dayFeed, sigFeed, now = new Date()) {
  const day = parseFeatures(dayFeed), sig = parseFeatures(sigFeed);
  return {
    last_24h_m45: { count: day.length, strongest: day[0] || null, m60_or_more: day.filter((q) => q.mag >= 6).length,
      list: day.slice(0, 8) },
    significant_week: { count: sig.length, events: sig.slice(0, 8) },
    feed_generated: dayFeed && dayFeed.metadata && dayFeed.metadata.generated ? new Date(dayFeed.metadata.generated).toISOString() : null,
    computed_at: now.toISOString(),
  };
}

export async function fetchUsgs(fetcher = fetch) {
  const get = async (u) => {
    const r = await fetcher(u, { headers: { accept: "application/geo+json,application/json", "user-agent": "orbstudio.org (open data dashboard)" }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error("usgs " + r.status);
    return r.json();
  };
  const [d, s] = await Promise.all([get(USGS_DAY_M45), get(USGS_SIG_WEEK)]);
  return { d, s };
}
