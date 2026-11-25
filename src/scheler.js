// Датчик «Шелер» — в честь Макса Шелера (1874–1928): знание о мире зависит от того, что люди вообще замечают и называют
// («Die Wissensformen und die Gesellschaft», 1926). Мостик «измерено, но не сообщено». Вопрос к данным:
// какая доля событий, которые измерил официальный датчик (сейчас: предупреждения DWD уровня 3+),
// не получила ни одного заголовка на наших радарах в течение суток. Это не «СМИ молчат»: радары видят
// только свои 8 тем и свои издания. Это связь двух рядов, без причины и без оценки.
export const SCHELER = {
  name: "Max Scheler", years: "1874–1928",
  idea: "'Die Wissensformen und die Gesellschaft' (1926): what a society knows depends on which things it notices and puts into words.",
  wiki: { en: "https://en.wikipedia.org/wiki/Max_Scheler", ru: "https://en.wikipedia.org/wiki/Max_Scheler" },
  note: "Named in his honour. Orb Studio is not connected with Max Scheler, his family or any university.",
};
export const SCHELER_HOURS = 24, SCHELER_MIN_EVENTS = 10, SCHELER_LOW = 0.33, SCHELER_HIGH = 0.66;
const STEMS = [
  [/sturm|orkan|b[öo]e|wind|storm|gale|gust|hurricane/, "wind"], [/regen|überschwemm|ueberschwemm|flut|hochwasser|rain|flood/, "rain"],
  [/schnee|snow|blizzard/, "snow"], [/glatteis|glätte|glaette|eis\b|ice|icy/, "ice"], [/gewitter|hagel|thunder|hail|tornado/, "storm2"],
  [/hitze|heat/, "heat"], [/frost|kälte|kaelte|cold|freez/, "cold"], [/nebel|fog/, "fog"],
];
const GENERIC = /unwetter|wetterwarnung|severe weather|weather warning|dwd|deutscher wetterdienst|wetterdienst/;
const PLACE = {
  "baden-württemberg": ["baden-württemberg", "baden-wuerttemberg", "baden-wurttemberg"], bayern: ["bayern", "bavaria"], berlin: ["berlin"], brandenburg: ["brandenburg"],
  bremen: ["bremen"], hamburg: ["hamburg"], hessen: ["hessen", "hesse"], "mecklenburg-vorpommern": ["mecklenburg"], niedersachsen: ["niedersachsen", "lower saxony"],
  "nordrhein-westfalen": ["nordrhein-westfalen", "north rhine"], "rheinland-pfalz": ["rheinland-pfalz", "rhineland-palatinate"], saarland: ["saarland"], sachsen: ["sachsen", "saxony"],
  "sachsen-anhalt": ["sachsen-anhalt", "saxony-anhalt"], "schleswig-holstein": ["schleswig-holstein"], thüringen: ["thüringen", "thueringen", "thuringia"],
};
const WHOLE = /deutschland|germany|german\b|bundesweit|nationwide/;
const stemOf = (s) => { const t = String(s || "").toLowerCase(); for (const [re, k] of STEMS) if (re.test(t)) return k; return null; };
// событие: {state, event}; заголовок: строка. Нужны место (земля или вся Германия) и тип явления (или общее слово «Unwetter»).
export function matches(ev, headline) {
  const h = String(headline || "").toLowerCase(); if (!h) return false;
  const st = String(ev.state || "").toLowerCase(), names = PLACE[st] || (st ? [st] : []);
  const place = names.some((n) => h.includes(n)) || WHOLE.test(h);
  if (!place) return false;
  const es = stemOf(ev.event); return GENERIC.test(h) || (es != null && stemOf(h) === es);
}
const r2 = (x) => (x == null ? null : Math.round(x * 100) / 100);
// events: [{k, state, event, level, first_ts}], heads: [{headline, first_ts}]; since: начало записи событий
export function schelerReport(events, heads, now = Date.now(), since = null) {
  const win = SCHELER_HOURS * 36e5, hs = (heads || []).filter((h) => h && h.headline && Number.isFinite(h.first_ts));
  const closed = [], open = [];
  for (const e of events || []) { (e.first_ts + win <= now ? closed : open).push(e); }
  const seen = (e) => hs.find((h) => h.first_ts >= e.first_ts - 36e5 && h.first_ts <= e.first_ts + win && matches(e, h.headline));
  const rows = closed.map((e) => { const h = seen(e); return { state: e.state, event: e.event, level: e.level, first_seen: new Date(e.first_ts).toISOString(), headline: h ? h.headline : null }; });
  const unrep = rows.filter((x) => !x.headline).length, n = rows.length, share = n ? unrep / n : null;
  const base = { name: SCHELER.name, years: SCHELER.years, idea: SCHELER.idea, wiki: SCHELER.wiki, note: SCHELER.note,
    what: "Share of official German measurements (DWD warnings, level 3+, grouped by state and type) that got no matching headline on any Orb Studio radar within 24 hours of first being seen.",
    limits: "The radars follow eight topics and their own outlets, so 'no headline' means 'not on our radars', not 'no media reported it'. The text match needs a place (state or Germany) and a weather type in the headline. A link between two series, not a cause and not a rating.",
    source_of_events: "Deutscher Wetterdienst (DWD), https://www.dwd.de", window_hours: SCHELER_HOURS, since: since ? new Date(since).toISOString() : null,
    events_open: open.length, events_closed: n, min_events: SCHELER_MIN_EVENTS };
  if (n < SCHELER_MIN_EVENTS) return { ...base, status: "collecting", verdict: "collecting", note_status: `Collecting: ${n} of ${SCHELER_MIN_EVENTS} closed events needed before any share is shown. The 24-hour window of each event has to pass first.`, share_unreported: null, reported: null, unreported: null, examples_unreported: rows.filter((x) => !x.headline).slice(0, 5) };
  const verdict = share < SCHELER_LOW ? "mostly_reported" : share > SCHELER_HIGH ? "mostly_unreported" : "mixed";
  return { ...base, status: "ok", verdict, share_unreported: r2(share), reported: n - unrep, unreported: unrep, examples_unreported: rows.filter((x) => !x.headline).slice(0, 5), examples_reported: rows.filter((x) => x.headline).slice(0, 3) };
}
