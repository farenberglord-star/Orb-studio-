// Parteien-Radar: neutral poll aggregation for the Bundestag Sonntagsfrage, built on the reduced DAWUM feed (src/polls.js).
// Pure arithmetic over published numbers: range, mean, number of institutes, 7-day shift. No forecast, no seats, no recommendation.
// Method (same as github.com/farenberglord-star/parteien-radar): window A = last N days up to the reference date, window B = the N days before;
// in each window the latest poll of each institute counts once. Shift = mean(A) - mean(B), only if both windows hold >= 2 values, else null.
export const PARTIES = ["AfD", "CDU/CSU", "SPD", "Grüne", "FDP", "Linke", "BSW"];
export const DISCLAIMER = "Агрегация публичных опросов. Не рекомендация, не прогноз, не призыв.";
export const DISCLAIMER_I18N = {
  ru: DISCLAIMER,
  de: "Aggregation öffentlicher Umfragen. Keine Empfehlung, keine Prognose, kein Aufruf.",
  en: "Aggregation of public polls. Not a recommendation, not a forecast, not a call to action.",
};
export const ATTRIBUTION = "Daten von dawum.de (Open Database License (ODbL)); https://dawum.de, Lizenz: https://opendatacommons.org/licenses/odbl/1-0/";
export const MIN_PER_WINDOW = 2;
const NAME = { "cdu/csu": "CDU/CSU", union: "CDU/CSU", spd: "SPD", "grüne": "Grüne", gruene: "Grüne", "bündnis 90/die grünen": "Grüne", fdp: "FDP", linke: "Linke", "die linke": "Linke", bsw: "BSW", afd: "AfD" };
const r2 = (x) => Math.round(x * 100) / 100;
const mean = (a) => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : null);
const day = (s) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / 864e5;
const inst = (s) => String(s).split(" (")[0].toLowerCase();

// feed.surveys[{institute,date,results{partyId:value}}] + feed.parties{id:{short,name}} → flat polls with our party names.
export function bundestagPolls(feed, parliament = "Bundestag") {
  if (!feed || !Array.isArray(feed.surveys)) return [];
  const out = [];
  for (const s of feed.surveys) {
    if (!s.institute || String(s.parliament).toLowerCase() !== parliament.toLowerCase()) continue;
    const values = Object.fromEntries(PARTIES.map((p) => [p, null]));
    for (const [pid, v] of Object.entries(s.results || {})) {
      const p = feed.parties[pid] || {}, n = NAME[String(p.short || "").toLowerCase()] || NAME[String(p.name || "").toLowerCase()];
      if (n && Number.isFinite(v)) values[n] = v;
    }
    out.push({ institute: s.institute, date: s.date, values });
  }
  return out;
}
function windowOf(polls, party, from, to) {
  const latest = new Map();
  for (const p of [...polls].sort((a, b) => (a.date < b.date ? -1 : 1))) {
    const d = day(p.date);
    if (d >= from && d <= to && p.values[party] != null) latest.set(inst(p.institute), { institute: p.institute, date: p.date, value: p.values[party] });
  }
  return [...latest.values()];
}
export function partyCard(polls, party, refDay, days = 7) {
  const a = windowOf(polls, party, refDay - days + 1, refDay), b = windowOf(polls, party, refDay - 2 * days + 1, refDay - days);
  const va = a.map((x) => x.value), vb = b.map((x) => x.value);
  const shift = va.length >= MIN_PER_WINDOW && vb.length >= MIN_PER_WINDOW ? r2(mean(va) - mean(vb)) : null;
  return { party, days, n: va.length, min: va.length ? Math.min(...va) : null, max: va.length ? Math.max(...va) : null, mean: va.length ? r2(mean(va)) : null,
    mean_previous: vb.length ? r2(mean(vb)) : null, n_previous: vb.length, shift_pp: shift,
    sources: a.sort((x, y) => (x.date < y.date ? 1 : -1)).map((x) => ({ institute: x.institute, date: x.date, value: x.value })) };
}
export function summarizeParties(feed, now = Date.now(), days = 7) {
  const polls = bundestagPolls(feed);
  if (!polls.length) return { ok: false, reason: "no Bundestag polls in feed" };
  const ref = new Date(now).toISOString().slice(0, 10), refDay = day(ref);
  const cards = PARTIES.map((p) => partyCard(polls, p, refDay, days));
  if (!cards.some((c) => c.n)) return { ok: false, reason: "no poll in the last " + days + " days", newest_poll_date: polls.map((p) => p.date).sort().pop() };
  return { ok: true, reference_date: ref, window_days: days, unit: "percent", min_per_window_for_shift: MIN_PER_WINDOW,
    method: "Latest poll of each institute inside the window counts once. mean = simple mean over the last " + days + " days; shift_pp = mean(last " + days + " days) - mean(the " + days + " days before), only if both windows hold at least " + MIN_PER_WINDOW + " values, otherwise null. A missing value is not zero.",
    disclaimer: DISCLAIMER, disclaimer_i18n: DISCLAIMER_I18N, attribution: ATTRIBUTION, cards, database_updated_at: feed.updated || null };
}
