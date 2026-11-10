// German voting-intention polls (Sonntagsfrage) from DAWUM (dawum.de, open database, ODC-ODbL).
// Orb Studio only reduces and aggregates published poll results: latest poll per institute, unweighted mean, min, max. No forecast, no seat or coalition projection.
export const ATTRIBUTION = "Daten von dawum.de (Open Database License (ODbL)); https://dawum.de, Lizenz: https://opendatacommons.org/licenses/odbl/1-0/. Von Orb Studio aggregiert (jüngste Umfrage je Institut, ungewichteter Mittelwert, Minimum, Maximum); Umfragewerte unverändert.";
export const CONTEXT_NOTE = "Polls measure stated voting intention in one sample at one time, not support among the whole population and not a forecast. Institutes use different methods; a typical margin of error is about ±2–3 percentage points. The mean here is a simple unweighted mean of each institute's latest poll, not an official trend. Orb Studio makes no prediction and no seat or coalition projection.";
export const DEFAULT_PARLIAMENT = "Bundestag";
export const WINDOW_DAYS = 35;
const num = (x) => { const v = x == null || x === "" ? NaN : +x; return Number.isFinite(v) ? v : null; };
// Keep only what we use, so the cache stays small. Input: DAWUM JSON (newest_surveys.json or data.json).
export function reduceDawum(j) {
  if (!j || typeof j !== "object" || !j.Surveys || !j.Parties || !j.Institutes || !j.Parliaments) return null;
  const parl = {}, inst = {}, parties = {};
  for (const [id, p] of Object.entries(j.Parliaments)) parl[id] = (p && p.Shortcut) || null;
  for (const [id, p] of Object.entries(j.Institutes)) inst[id] = (p && p.Name) || null;
  for (const [id, p] of Object.entries(j.Parties)) parties[id] = { short: (p && p.Shortcut) || null, name: (p && p.Name) || null };
  const surveys = [];
  for (const [id, s] of Object.entries(j.Surveys)) {
    if (!s || !s.Results || !/^\d{4}-\d{2}-\d{2}/.test(String(s.Date))) continue;
    const res = {};
    for (const [pid, v] of Object.entries(s.Results)) { const n = num(v); if (n != null && n >= 0 && n <= 100) res[pid] = n; }
    surveys.push({ id, parliament: parl[String(s.Parliament_ID)] || null, institute: inst[String(s.Institute_ID)] || null, date: String(s.Date).slice(0, 10),
      persons: num(s.Surveyed_Persons), start: s.Survey_Period && s.Survey_Period.Date_Start || null, end: s.Survey_Period && s.Survey_Period.Date_End || null, results: res });
  }
  return { updated: (j.Database && j.Database.Last_Update) || null, parliaments: [...new Set(Object.values(parl).filter(Boolean))], parties, surveys };
}
const r1 = (x) => Math.round(x * 10) / 10;
export function summarizePolls(feed, parliament = DEFAULT_PARLIAMENT, now = Date.now()) {
  if (!feed || !Array.isArray(feed.surveys) || !feed.surveys.length) return { ok: false, reason: "no polls in feed" };
  const want = String(parliament || DEFAULT_PARLIAMENT);
  const known = feed.parliaments.find((p) => p.toLowerCase() === want.toLowerCase());
  if (!known) return { ok: false, bad_request: true, reason: "unknown parliament", parliaments: feed.parliaments };
  const latestByInst = {};
  for (const s of feed.surveys) if (s.parliament === known && s.institute && (!latestByInst[s.institute] || s.date > latestByInst[s.institute].date)) latestByInst[s.institute] = s;
  const cutoff = new Date(now - WINDOW_DAYS * 864e5).toISOString().slice(0, 10);
  const used = Object.values(latestByInst).filter((s) => s.date >= cutoff).sort((a, b) => (a.date < b.date ? 1 : -1));
  if (!used.length) return { ok: false, reason: "no poll in the last " + WINDOW_DAYS + " days", parliament: known, newest_poll_date: Object.values(latestByInst).map((s) => s.date).sort().pop() || null };
  const byParty = {};
  for (const s of used) for (const [pid, v] of Object.entries(s.results)) (byParty[pid] = byParty[pid] || []).push({ v, institute: s.institute });
  const parties = Object.entries(byParty).map(([pid, a]) => {
    const vs = a.map((x) => x.v), p = feed.parties[pid] || {};
    return { party: p.short || p.name || pid, name: p.name || null, mean: r1(vs.reduce((x, y) => x + y, 0) / vs.length), min: Math.min(...vs), max: Math.max(...vs), institutes: a.length };
  }).sort((a, b) => b.mean - a.mean);
  return { ok: true, parliament: known, unit: "percent", window_days: WINDOW_DAYS, institutes_used: used.length, parties,
    polls: used.map((s) => ({ institute: s.institute, published: s.date, fieldwork_end: s.end, surveyed_persons: s.persons, results: Object.fromEntries(Object.entries(s.results).map(([pid, v]) => [(feed.parties[pid] || {}).short || pid, v])) })),
    database_updated_at: feed.updated };
}
