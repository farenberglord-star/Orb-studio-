// LHP (Länderübergreifendes Hochwasser Portal) alerts: flood warnings and situation classes, CC BY 4.0. Passed through, not rated.
export const LHP_URL = "https://api.hochwasserzentralen.de/public/v1/data/alerts?format=json&lang=de";
const num = (x) => { const v = x == null || x === "" ? NaN : +x; return Number.isFinite(v) ? v : null; };
const scalars = (p) => { const o = {}; let n = 0; for (const [k, v] of Object.entries(p && typeof p === "object" ? p : {})) { if (n >= 14) break; if (/color|style|icon|logo|url|link|href/i.test(k)) continue; if (typeof v === "string" && v.length <= 240) { o[k] = v; n++; } else if (typeof v === "number" && Number.isFinite(v)) { o[k] = v; n++; } } return o; };
export function parseLhp(j0) {
  let j = j0;
  if (!j || typeof j !== "object") return { ok: false };
  // LHP wraps the list in "data" (observed live: status "success", no top-level "features"); a plain FeatureCollection is accepted too.
  const list = Array.isArray(j.features) ? j.features : Array.isArray(j.data) ? j.data : j.data && typeof j.data === "object" && Array.isArray(j.data.features) ? j.data.features : null;
  if (!list || (typeof j.status === "string" && j.status !== "success") || typeof j.updated !== "string") return { ok: false };
  j = { ...j, features: list };
  const legend = (j.legend && Array.isArray(j.legend.items) ? j.legend.items : []).map((x) => ({ class: num(x && x.lhpClass), name: x && x.lhpClassName || null })).filter((x) => x.class != null);
  const nameOf = new Map(legend.map((x) => [x.class, x.name]));
  const items = j.features.slice(0, 100).map((f) => {
    const p = f && typeof f === "object" ? (f.properties && typeof f.properties === "object" ? f.properties : f) : {}, cls = num(p.lhpClass != null ? p.lhpClass : p.class);
    const name = p.name || p.title || p.label || p.gewaesser || p.region || null;
    const url = typeof p.url === "string" && /^https:\/\//.test(p.url) ? p.url : typeof p.link === "string" && /^https:\/\//.test(p.link) ? p.link : null;
    return { class: cls, class_name: p.lhpClassName || (cls != null ? nameOf.get(cls) || null : null), name: name ? String(name).slice(0, 200) : null, url, properties: scalars(p) };
  });
  const by = {}; let hi = null;
  for (const i of items) { if (i.class == null) continue; by[i.class] = (by[i.class] || 0) + 1; if (hi == null || i.class > hi) hi = i.class; }
  return { ok: true, stand: typeof j.updated === "string" ? j.updated : null, source_name: j.sourceName || "Länderübergreifendes Hochwasserportal (LHP)", licence: j.licenceName || "CC BY 4.0 - Namensnennung",
    active_count: j.features.length, shown_count: items.length, highest_class: hi, highest_class_name: hi != null ? nameOf.get(hi) || null : null, by_class: by, legend, items };
}
