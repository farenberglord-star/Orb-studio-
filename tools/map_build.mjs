// Builds public/data/map-geo.json: embedded world outline + DACH inset (Natural Earth via world-atlas, public domain). No external requests at runtime.
// Run: node tools/map_build.mjs <dir-with-node_modules(world-atlas,topojson-client)>   (build-time only, output is committed)
import { createRequire } from "node:module"; import fs from "node:fs"; import path from "node:path";
const dir = path.resolve(process.argv[2] || "."), req = createRequire(path.join(dir, "package.json"));
const { feature } = req("topojson-client");
const load = (n) => JSON.parse(fs.readFileSync(req.resolve("world-atlas/" + n), "utf8"));
const c110 = load("countries-110m.json"), c50 = load("countries-50m.json");
const feats = (t) => feature(t, t.objects.countries).features;
const rad = Math.PI / 180, r1 = (v) => Math.round(v * 10) / 10;
// Equal Earth (Šavrič et al. 2018)
const A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, S3 = Math.sqrt(3);
function eqEarth(lon, lat) { const l = lon * rad, th = Math.asin(S3 / 2 * Math.sin(lat * rad)), t2 = th * th, t6 = t2 * t2 * t2;
  return [2 * S3 * l * Math.cos(th) / (3 * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2))]; }
const wx = eqEarth(180, 0)[0], wy = eqEarth(0, 90)[1], W = 1000, ws = W / (2 * wx), H = Math.round(2 * wy * ws);
const projW = (lon, lat) => { const [x, y] = eqEarth(lon, lat); return [(x + wx) * ws, (wy - y) * ws]; };
// DACH inset: Mercator, linear in lon and in mercator-y
const BB = { lon0: 4.6, lon1: 18.6, lat0: 45.3, lat1: 55.9 };
const mer = (lat) => Math.log(Math.tan(Math.PI / 4 + lat * rad / 2)) / rad;
const my0 = mer(BB.lat0), my1 = mer(BB.lat1), IW = 700, IH = Math.round(IW * (my1 - my0) / (BB.lon1 - BB.lon0));
const projI = (lon, lat) => [(lon - BB.lon0) / (BB.lon1 - BB.lon0) * IW, (my1 - mer(lat)) / (my1 - my0) * IH];
function dp(pts, tol) { if (pts.length < 4) return pts; const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1; const st = [[0, pts.length - 1]];
  while (st.length) { const [a, b] = st.pop(); let md = 0, mi = -1; const [x1, y1] = pts[a], [x2, y2] = pts[b], dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1e-9;
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + x2 * y1 - y2 * x1) / L; if (d > md) { md = d; mi = i; } }
    if (md > tol && mi > 0) { keep[mi] = 1; st.push([a, mi], [mi, b]); } }
  return pts.filter((_, i) => keep[i]); }
function clip(ring, x0, y0, x1, y1) { const edges = [[(p) => p[0] >= x0, (a, b) => [x0, a[1] + (b[1] - a[1]) * (x0 - a[0]) / (b[0] - a[0])]], [(p) => p[0] <= x1, (a, b) => [x1, a[1] + (b[1] - a[1]) * (x1 - a[0]) / (b[0] - a[0])]],
  [(p) => p[1] >= y0, (a, b) => [a[0] + (b[0] - a[0]) * (y0 - a[1]) / (b[1] - a[1]), y0]], [(p) => p[1] <= y1, (a, b) => [a[0] + (b[0] - a[0]) * (y1 - a[1]) / (b[1] - a[1]), y1]]];
  let out = ring; for (const [inside, cut] of edges) { const inp = out; out = []; if (!inp.length) break;
    for (let i = 0; i < inp.length; i++) { const a = inp[i], b = inp[(i + 1) % inp.length], ia = inside(a), ib = inside(b); if (ia) { out.push(a); if (!ib) out.push(cut(a, b)); } else if (ib) out.push(cut(a, b)); } }
  return out; }
function rings(geom) { const polys = geom.type === "Polygon" ? [geom.coordinates] : geom.type === "MultiPolygon" ? geom.coordinates : []; return polys.flatMap((p) => p); }
function pathOf(f, proj, tol, clipBox) { let d = "";
  for (const ring of rings(f.geometry)) { let r = ring; if (clipBox) r = clip(r, clipBox[0], clipBox[1], clipBox[2], clipBox[3]); if (r.length < 3) continue;
    let pts = r.map(([lo, la]) => proj(lo, la)); if (pts.length > 1 && pts[0][0] === pts[pts.length - 1][0] && pts[0][1] === pts[pts.length - 1][1]) pts.pop(); pts = dp(pts, tol); if (pts.length < 3) continue;
    d += "M" + pts.map(([x, y]) => r1(x) + " " + r1(y)).join(" ") + "Z"; }
  return d; }
const DACH = { "276": "DE", "040": "AT", "756": "CH" };
const world = { dach: {}, rest: "" };
for (const f of feats(c110)) { if (f.id === "010") continue; const d = pathOf(f, projW, 0.5); if (DACH[f.id]) world.dach[DACH[f.id]] = d; else world.rest += d; }
const box = [BB.lon0 - 0.6, BB.lat0 - 0.6, BB.lon1 + 0.6, BB.lat1 + 0.6], inset = { dach: {}, rest: "" };
const NB = new Set(["250", "380", "438", "203", "616", "208", "528", "056", "442", "703", "348", "705", "191", "100", "826", "752", "578", "372", "724", "620", "300", "070", "688", "498", "804", "112", "440", "428", "233", "642"]);
for (const f of feats(c50)) { if (DACH[f.id]) inset.dach[DACH[f.id]] = pathOf(f, projI, 0.3, box); else if (NB.has(f.id)) inset.rest += pathOf(f, projI, 0.8, box); }
const CITIES = [["Hamburg", 53.5511, 9.9937], ["Berlin", 52.52, 13.405], ["Frankfurt", 50.1109, 8.6821], ["München", 48.1351, 11.582], ["Wien", 48.2082, 16.3738], ["Zürich", 47.3769, 8.5417]];
const out = { attribution: "Natural Earth (public domain) via world-atlas", world: { w: W, h: H, ...world }, inset: { w: IW, h: IH, bbox: BB, my0, my1, ...inset, cities: CITIES.map(([n, la, lo]) => { const [x, y] = projI(lo, la); return { n, x: r1(x), y: r1(y) }; }) } };
fs.writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public", "data", "map-geo.json"), JSON.stringify(out));
console.log("world", W + "x" + H, "inset", IW + "x" + IH, "bytes", fs.statSync(path.join(path.dirname(new URL(import.meta.url).pathname), "..", "public", "data", "map-geo.json")).size);
