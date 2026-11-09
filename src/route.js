// Free route sensor: open routing (OSRM by FOSSGIS, OpenStreetMap data) + motorway reports (Autobahn GmbH) near the route.
// Nothing is estimated: distance and duration come from the router, incidents from the official feed.
export const ROUTE_BOX = { latMin: 52.9, latMax: 54.2, lonMin: 8.9, lonMax: 10.9 };
export const MODES = { foot: "routed-foot", bike: "routed-bike", car: "routed-car" };

export function parsePoint(s) {
  const m = /^\s*(-?\d{1,2}(?:\.\d+)?)\s*[,;]\s*(-?\d{1,3}(?:\.\d+)?)\s*$/.exec(String(s || ""));
  if (!m) return null;
  const lat = +m[1], lon = +m[2];
  if (lat < ROUTE_BOX.latMin || lat > ROUTE_BOX.latMax || lon < ROUTE_BOX.lonMin || lon > ROUTE_BOX.lonMax) return { outside: true, lat, lon };
  return { lat: Math.round(lat * 1e4) / 1e4, lon: Math.round(lon * 1e4) / 1e4 };
}

const R = 6371000, rad = (x) => (x * Math.PI) / 180;
// distance from point to a segment in metres (local flat approximation, fine for a few km)
function distSeg(p, a, b) {
  const k = Math.cos(rad(p.lat)), x = (q) => rad(q.lon) * k * R, y = (q) => rad(q.lat) * R;
  const px = x(p), py = y(p), ax = x(a), ay = y(a), bx = x(b), by = y(b), dx = bx - ax, dy = by - ay;
  const t = dx || dy ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy))) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}
export function distToLine(p, line) {
  let best = Infinity;
  for (let i = 1; i < line.length; i++) best = Math.min(best, distSeg(p, line[i - 1], line[i]));
  return line.length === 1 ? distSeg(p, line[0], line[0]) : best;
}

export function incidentsNear(line, roads, maxM = 1000) {
  const out = [];
  for (const kind of ["jams", "closures", "roadworks"]) {
    for (const i of roads[kind] || []) {
      if (!Number.isFinite(i.lat) || !Number.isFinite(i.lon)) continue;
      const d = distToLine({ lat: i.lat, lon: i.lon }, line);
      if (d <= maxM) out.push({ kind: i.kind, road: i.road, title: i.title, direction: i.direction, delay_min: i.delay_min, blocked: i.blocked, distance_from_route_m: Math.round(d) });
    }
  }
  return out.sort((a, b) => a.distance_from_route_m - b.distance_from_route_m).slice(0, 20);
}

export function summarizeRoute(osrm, mode, roads) {
  const r = osrm && osrm.routes && osrm.routes[0];
  if (!r || !r.geometry || !r.geometry.coordinates || !r.geometry.coordinates.length) return null;
  const line = r.geometry.coordinates.map(([lon, lat]) => ({ lat, lon }));
  const names = [];
  for (const leg of r.legs || []) for (const s of leg.steps || []) if (s.name && s.distance > 150 && names[names.length - 1] !== s.name) names.push(s.name);
  const out = {
    mode, distance_m: Math.round(r.distance), duration_min: Math.round(r.duration / 6) / 10,
    main_streets: names.slice(0, 12), points: line.length,
    duration_note: "Duration is the router's free-flow estimate from OpenStreetMap speeds. It does not include live traffic.",
  };
  if (mode === "car") {
    if (roads) { out.motorway_reports_near_route = incidentsNear(line, roads); out.motorway_check = "Autobahn GmbH reports within 1 km of the route (jams, closures, roadworks). City streets are not covered."; }
    else out.motorway_check = "unavailable: the Autobahn feed did not answer, nothing is estimated";
  } else out.motorway_check = "not applicable for this mode (motorway reports are only checked for car routes)";
  return out;
}
