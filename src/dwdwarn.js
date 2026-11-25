// Official German weather warnings of the Deutscher Wetterdienst (DWD), passed through as published; nothing is rated or forecast by us.
// Source: DWD warnapp JSON (JSONP "warnWetter.loadWarnings({...});" or plain JSON): { time, warnings: { <warncell id>: [ {state, stateShort, regionName, start, end, level, type, event, headline, ...} ] }, copyright }.
// Levels are DWD's own: 1 Wetterwarnung, 2 markantes Wetter, 3 Unwetter, 4 extremes Unwetter (other numbers, e.g. heat, are passed through as "other").
export const DWD_URLS = ["https://www.dwd.de/DWD/warnungen/warnapp/json/warnings.json", "https://www.dwd.de/DWD/warnungen/warnapp_landkreise/json/warnings.json"];
export const DWD_ATTRIBUTION = "Quelle: Deutscher Wetterdienst (DWD), Wetterwarnungen, https://www.dwd.de. Orb Studio passes the warnings through and only counts and groups them.";
export const LEVELS = { 1: "Wetterwarnung (minor)", 2: "markantes Wetter (moderate)", 3: "Unwetter (severe)", 4: "extremes Unwetter (extreme)" };
const label = (l) => LEVELS[l] || "other";
const ms = (v) => { const n = +v; return Number.isFinite(n) && n > 0 ? (n < 1e11 ? n * 1000 : n) : null; };

export function parseDwd(text) {
  let s = String(text == null ? "" : text).trim();
  const m = /^[A-Za-z_$][\w$.]*\s*\(([\s\S]*)\)\s*;?$/.exec(s); if (m) s = m[1];
  let j; try { j = JSON.parse(s); } catch { return { ok: false }; }
  if (!j || typeof j.warnings !== "object" || !j.warnings || Array.isArray(j.warnings)) return { ok: false };
  const items = [];
  for (const [id, arr] of Object.entries(j.warnings)) for (const w of Array.isArray(arr) ? arr : []) {
    if (!w || typeof w !== "object") continue;
    const level = Number.isFinite(+w.level) ? +w.level : null; if (level == null) continue;
    items.push({ id, state: w.state || null, state_short: w.stateShort || null, region: w.regionName || null, level, event: w.event || w.headline || null,
      headline: w.headline || null, start: ms(w.start), end: ms(w.end) });
  }
  return { ok: true, issued_at: ms(j.time), items, copyright: typeof j.copyright === "string" ? j.copyright.slice(0, 200) : null };
}
const stateOk = (it, f) => !f || [it.state, it.state_short].some((x) => x && x.toLowerCase() === f.toLowerCase());
export function summarizeDwd(p, now = Date.now(), state = null) {
  if (!p || !p.ok) return { ok: false };
  const act = p.items.filter((w) => stateOk(w, state) && (w.start == null || w.start <= now) && (w.end == null || w.end > now));
  const levels = {}; for (const w of act) levels[w.level] = (levels[w.level] || 0) + 1;
  const regions = new Set(act.map((w) => w.id)), st = {};
  for (const w of act) { const k = w.state || "?"; const o = (st[k] ||= { state: k, warnings: 0, max_level: 0, regions: new Set() }); o.warnings++; o.regions.add(w.id); if (w.level > o.max_level) o.max_level = w.level; }
  const by_state = Object.values(st).map((o) => ({ state: o.state, warnings: o.warnings, regions: o.regions.size, max_level: o.max_level, max_level_label: label(o.max_level) })).sort((a, b) => b.max_level - a.max_level || b.regions - a.regions || a.state.localeCompare(b.state));
  const ev = {}; for (const w of act) if (w.level >= 2 && w.event) ev[w.event] = (ev[w.event] || 0) + 1;
  const grp = new Map();
  for (const w of act) if (w.level >= 3) {
    const k = [w.state, w.event, w.level].join("|"); const g = grp.get(k) || { state: w.state, event: w.event, level: w.level, level_label: label(w.level), regions: new Set(), start: w.start, end: w.end, headline: w.headline };
    g.regions.add(w.region || w.id); if (w.start != null && (g.start == null || w.start < g.start)) g.start = w.start; if (w.end != null && (g.end == null || w.end > g.end)) g.end = w.end; grp.set(k, g);
  }
  const severe = [...grp.values()].sort((a, b) => b.level - a.level || b.regions.size - a.regions.size).slice(0, 15)
    .map((g) => ({ state: g.state, event: g.event, level: g.level, level_label: g.level_label, regions: g.regions.size, regions_sample: [...g.regions].slice(0, 5), from: g.start ? new Date(g.start).toISOString() : null, until: g.end ? new Date(g.end).toISOString() : null, headline: g.headline }));
  return { ok: true, issued_at: p.issued_at ? new Date(p.issued_at).toISOString() : null, state_filter: state || null, active_warnings: act.length, regions_with_warning: regions.size,
    levels: Object.entries(levels).sort((a, b) => b[0] - a[0]).map(([level, n]) => ({ level: +level, label: label(+level), warnings: n })),
    by_state, events_level2_plus: Object.entries(ev).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([event, warnings]) => ({ event, warnings })), severe_level3_plus: severe };
}
