// Датчик «Стэнли Коэн» — в честь Стэнли Коэна (1942–2013), автора книги «Народные дьяволы и моральные паники» (1972):
// тревога в СМИ может быть несоразмерна самому событию. Мостик библиотеки кристаллов «размер случая и размер тревоги»:
// Коэн (несоразмерность) + Касперсон (усиление) + Осгуд (окраска слов) + USGS (размер события измерен прибором).
// Вопрос: насколько громко радары пишут о землетрясении по сравнению с тем, что записал USGS?
// Сначала только землетрясения: у них размер измеряет прибор, и его публикует открытая служба. Другие события — когда найдём такую же меру.
export const COHEN_S = {
  name: "Stanley Cohen", years: "1942–2013",
  idea: "Moral panic: the reaction to an event (alarm, language, coverage) can be out of proportion to the size of the event itself.",
  wiki: { en: "https://en.wikipedia.org/wiki/Stanley_Cohen_(sociologist)", ru: "https://en.wikipedia.org/wiki/Stanley_Cohen_(sociologist)" },
  note: "Named in his honour. Orb Studio is not connected with Stanley Cohen, his family or any university.",
};
export const COHEN_S_MIN = 10, COHEN_S_LOUD_OUTLETS = 5, COHEN_S_SMALL_MAG = 5.5, COHEN_S_BIG_MAG = 6.5, COHEN_S_DAYS = 7;
export const USGS_DAY_M25 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";
const QUAKE = /earthquake|quake|tremor|erdbeben|beben\b|землетряс|подземн\w+ толч/i;
// громкие слова: само слово ничего не доказывает, оно считается только рядом с измеренным размером
const LOUD = /\b(devastat\w*|massive|powerful|deadly|catastroph\w*|terrif\w*|violent\w*|huge|shock\w*|panic\w*|strong|major|monster)\b|verheerend\w*|heftig\w*|gewaltig\w*|katastroph\w*|panik\w*|stark\w*|schwer\w*|мощн\w*|сильн\w*|разрушител\w*|страшн\w*|паник\w*|катастроф\w*/gi;
const STOP = new Set(["earthquake", "quake", "strikes", "strikes", "hits", "near", "off", "coast", "region", "south", "north", "east", "west", "central", "southern", "northern", "eastern", "western", "island", "islands", "sea", "ocean"]);
const r1 = (x) => (x == null ? null : Math.round(x * 10) / 10), pct = (a, b) => (b ? Math.round(100 * a / b) : null);

export function loudWords(headline) { return [...new Set((String(headline || "").match(LOUD) || []).map((w) => w.toLowerCase()))]; }
export function isQuakeHeadline(h) { return QUAKE.test(String(h || "")); }
function tokens(t) { return [...new Set((String(t || "").match(/\p{Lu}[\p{L}'-]{3,}/gu) || []).map((w) => w.toLowerCase()).filter((w) => !STOP.has(w)))]; }
// самое сильное землетрясение USGS, место которого названо в заголовке (в английской записи места); events: [{mag, place, time}]
export function matchQuake(headline, events, firstTs = null) {
  const want = tokens(headline); if (!want.length) return null;
  const lo = firstTs ? firstTs - 3 * 864e5 : -Infinity, hi = firstTs ? firstTs + 864e5 : Infinity;
  let best = null;
  for (const e of events || []) { const t = Date.parse(e.time); if (Number.isFinite(t) && (t < lo || t > hi)) continue;
    const pl = String(e.place || "").toLowerCase(); if (!want.some((w) => pl.includes(w))) continue;
    if (!best || e.mag > best.mag) best = e; }
  return best;
}
export function cohenStory(row, events) {
  const h = row.headline || ""; if (!isQuakeHeadline(h)) return null;
  const q = matchQuake(h, events, +row.first_ts || null), loud = loudWords(h), peak = Math.max(+row.n_max || 1, +row.n_first || 1);
  const alarm = loud.length >= 1 || peak >= COHEN_S_LOUD_OUTLETS;
  const verdict = !q ? "no_measurement" : alarm && q.mag < COHEN_S_SMALL_MAG ? "loud_for_size" : q.mag >= COHEN_S_BIG_MAG ? "size_fits" : alarm ? "in_between" : "quiet_for_size";
  return { radar: row.radar || null, headline: h, outlets_peak: peak, loud_words: loud, alarm, usgs_magnitude: q ? q.mag : null, usgs_place: q ? q.place : null, usgs_time: q ? q.time : null, tsunami_flag: q ? !!q.tsunami_flag : null, verdict };
}
export function cohenReport(rows, events, now = Date.now(), since = null, usgsOk = true) {
  const st = (rows || []).map((r) => cohenStory(r, events)).filter(Boolean), meas = st.filter((s) => s.verdict !== "no_measurement"), loud = st.filter((s) => s.verdict === "loud_for_size");
  const radars = [...new Set(st.map((s) => s.radar).filter(Boolean))].map((id) => { const a = meas.filter((s) => s.radar === id);
    return { id, quake_stories: st.filter((s) => s.radar === id).length, measured: a.length, loud_for_size: a.filter((s) => s.verdict === "loud_for_size").length }; }).sort((x, y) => y.loud_for_size - x.loud_for_size || y.measured - x.measured);
  const p = pct(loud.length, meas.length);
  return {
    sensor: "cohen_s", usgs_available: usgsOk, verdict: !usgsOk ? "no_measurement_source" : meas.length < COHEN_S_MIN ? "collecting" : p >= 30 ? "often_loud_for_size" : p >= 10 ? "sometimes_loud_for_size" : "mostly_proportionate",
    quake_stories: st.length, measured: meas.length, unmeasured: st.length - meas.length, loud_for_size: loud.length, loud_for_size_pct: p,
    radars, loud_for_size_examples: [...loud].sort((a, b) => b.outlets_peak - a.outlets_peak).slice(0, 8),
    measured_examples: [...meas].sort((a, b) => b.usgs_magnitude - a.usgs_magnitude).slice(0, 8),
    question: "How loud do the Orb Studio radars write about an earthquake compared with what USGS measured?",
    method: `Radar stories of the last ${COHEN_S_DAYS} days whose headline names an earthquake are matched to USGS events (magnitude 2.5 and above, last week) by the place named in the headline. Loud = a strong word in the headline (word list, English, German, Russian) or at least ${COHEN_S_LOUD_OUTLETS} outlets at the peak. Loud for size = loud and USGS magnitude below ${COHEN_S_SMALL_MAG}. Size fits = magnitude ${COHEN_S_BIG_MAG} or more. Headlines whose place we cannot find in USGS are counted as unmeasured, not as loud. Magnitude is not damage: a modest quake under a city can matter more than a large one far at sea. Word rules, no AI.`,
    rule: "Before repeating a loud headline about an earthquake, state the magnitude USGS recorded and the place, and do not use stronger words than the measurement supports. A loud headline over a small magnitude is not proof that nothing happened: check the local reports.",
    bridge: "Crystal Library bridge 'size of the incident vs size of the alarm': S. Cohen (disproportion) + Kasperson (amplification) + Osgood (word colour) + the USGS instrument reading.",
    history_since: since ? new Date(+since).toISOString() : null,
    honour: COHEN_S, similar: "Media-analysis research on moral panics and disaster coverage compares coverage with event size after the fact; this sensor compares, live, each radar earthquake headline with the USGS reading, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
