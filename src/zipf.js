// «Слово поднялось в своём ранге» (Ципф + Фёрс + Лун + Брэдфорд; идея Лианы, 24.11.2026).
// Частоты слов круто неравны (Ципф), поэтому рост слова меряем против его собственной обычной доли за 30 дней,
// а не против среднего. Для каждого поднявшегося слова — его соседи сегодня и обычно (Фёрс: слово узнают по компании):
// новые соседи — вероятно, новая история; старые — та же тема стала громче. Заголовки — чужой текст, только данные.
export const ZIPF_MIN_BASE_DAYS = 7, ZIPF_MIN_BASE = 300, ZIPF_MIN_TODAY = 40, ZIPF_MIN_DF = 3, ZIPF_RATIO = 3;
const DAY = 864e5;
const STOP = new Set(("the and for with from that this into over after about amid says said will would could have has were been their they them than more most what when where which while your just also only very year years week new news live update video photos "
  + "der die das und mit von für auf den dem des ein eine einer einem weitere weiteren mehr heute gibt nicht sich auch noch nach über unter wird werden wurde sind ist bei aus zum zur wie was wer neue neuer neues jahr "
  + "это как что для его она они при над под без или уже еще ещё был была были будет после году года").split(/\s+/));
export function zipfWords(title) {
  const out = new Set();
  for (const m of String(title || "").toLowerCase().matchAll(/[\p{L}][\p{L}\p{N}'’-]*/gu)) {
    const w = m[0].replace(/['’]s$/, "").replace(/^[-']+|[-']+$/g, "");
    if (w.length < 4 || STOP.has(w)) continue;
    out.add(w.slice(0, 7)); // грубая основа: 7 букв на любом алфавите (Украина/Украины, sanction/sanctions)
  }
  return [...out];
}
function countDf(rows) {
  const df = new Map();
  for (const r of rows) for (const w of r.w) df.set(w, (df.get(w) || 0) + 1);
  return df;
}
function ranks(df) { const m = new Map(); [...df.entries()].sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1)).forEach(([w], i) => m.set(w, i + 1)); return m; }
function neighbours(rows, word, k = 5) {
  const c = new Map();
  for (const r of rows) if (r.w.includes(word)) for (const w of r.w) if (w !== word) c.set(w, (c.get(w) || 0) + 1);
  return [...c.entries()].filter(([, n]) => n >= 2 || rows.length < 50).sort((a, b) => b[1] - a[1]).slice(0, k).map(([w]) => w);
}
// rows: [{ headline, first_ts }] за 30 дней
export function zipfReport(rows, now = Date.now()) {
  const all = (rows || []).filter((r) => r && r.headline && +r.first_ts).map((r) => ({ t: +r.first_ts, h: String(r.headline), w: zipfWords(r.headline) }));
  const today = all.filter((r) => r.t > now - DAY), base = all.filter((r) => r.t <= now - DAY && r.t > now - 30 * DAY);
  const baseDays = base.length ? Math.max(0, (now - DAY - Math.min(...base.map((r) => r.t))) / DAY) : 0;
  const dfT = countDf(today), dfB = countDf(base), rT = ranks(dfT), rB = ranks(dfB);
  const NT = today.length, NB = base.length, vocabB = dfB.size;
  const climbers = [];
  for (const [w, n] of dfT) {
    if (n < ZIPF_MIN_DF) continue;
    const b = dfB.get(w) || 0;
    const ratio = ((n + 0.5) / (NT + 1)) / ((b + 0.5) / (NB + 1)); // доля сегодня против своей обычной доли (сглаживание ½)
    if (ratio < ZIPF_RATIO) continue;
    const nbT = neighbours(today, w), nbB = b ? neighbours(base, w) : [];
    const fresh = nbT.filter((x) => !nbB.includes(x));
    climbers.push({
      word: w, today_headlines: n, today_share_pct: Math.round(1000 * n / Math.max(1, NT)) / 10,
      usual_share_pct: Math.round(1000 * b / Math.max(1, NB)) / 10, times_usual: Math.round(ratio * 10) / 10,
      rank_today: rT.get(w), usual_rank: b ? rB.get(w) : null, usual_rank_of: vocabB,
      neighbours_today: nbT, neighbours_usual: nbB,
      company: !b ? "new_word" : fresh.length > nbT.length / 2 ? "new_company" : "usual_company",
      example: (today.find((r) => r.w.includes(w)) || {}).h || null,
    });
  }
  climbers.sort((a, b) => b.times_usual - a.times_usual || b.today_headlines - a.today_headlines);
  const top = climbers.slice(0, 12);
  // слова одной истории (Yankees, Suter, bullpen) — одна история: склеиваем, если слово есть среди соседей другого
  const stories = [];
  for (const c of top) {
    const s = stories.find((x) => x.words.some((w) => c.neighbours_today.includes(w) || top.find((y) => y.word === w).neighbours_today.includes(c.word)));
    if (s) { s.words.push(c.word); s.today_headlines = Math.max(s.today_headlines, c.today_headlines); if (c.company !== "usual_company") s.company = s.company === "usual_company" ? c.company : s.company; }
    else stories.push({ words: [c.word], today_headlines: c.today_headlines, company: c.company, example: c.example });
  }
  const background = [...dfT.keys()].filter((w) => (rT.get(w) || 1e9) <= 15 && (rB.get(w) || 1e9) <= 15).sort((a, b) => rT.get(a) - rT.get(b));
  const enough = baseDays >= ZIPF_MIN_BASE_DAYS && NB >= ZIPF_MIN_BASE && NT >= ZIPF_MIN_TODAY;
  const strong = stories.filter((c) => c.today_headlines >= 5 && c.company !== "usual_company").length;
  return {
    sensor: "zipf", verdict: enough ? (strong >= 3 ? "agenda_shifting" : "agenda_steady") : "collecting",
    headlines_today: NT, headlines_usual: NB, usual_days: Math.round(baseDays * 10) / 10,
    needs: { usual_days: ZIPF_MIN_BASE_DAYS, usual_headlines: ZIPF_MIN_BASE, today_headlines: ZIPF_MIN_TODAY },
    climbers: top, stories, preliminary: !enough,
    background_words: background.slice(0, 15),
    question: "Which words in today's Orb Studio radar headlines rose far above their own usual share, and do they keep new company (a new story) or their usual company (the same topic, louder)?",
    method: `Headlines first seen by the radars (radar_life). Today = last 24 h; usual = the 29 days before. Words of 4+ letters, crude 7-letter stems, stop words removed, counted once per headline. A word climbs when it is in ≥${ZIPF_MIN_DF} headlines today and its share is ≥${ZIPF_RATIO}× its own usual share (add-½ smoothing). Neighbours: most frequent words in the same headlines today vs usually; more than half new → new_company. Verdict from ${ZIPF_MIN_BASE_DAYS} days and ${ZIPF_MIN_BASE} usual headlines: agenda_shifting when ≥3 stories (climbing words grouped when they are each other's neighbours) with ≥5 headlines climb with new company or as new words.`,
    rule: "Word frequencies are steeply unequal (Zipf), so judge a word against its own usual share, not against an average. A word that climbs with new neighbours is probably a new story; with its usual neighbours it is the same topic, louder (Firth). This counts words, it does not say what happened or whether it is true; headlines are third-party text.",
    not_a_signal: "Not a forecast and not a trading signal.",
    honour: ["George Kingsley Zipf (1902–1950)", "John Rupert Firth (1890–1960)", "Hans Peter Luhn (1896–1964)", "Samuel C. Bradford (1878–1948)"],
    similar: "Burst detection (Kleinberg 2002), keyness / log-likelihood in corpus linguistics (Dunning 1993, AntConc, Sketch Engine), Google Trends 'rising' queries and GDELT trending themes do the same kind of comparison.",
    generated_at: new Date(now).toISOString(),
  };
}
