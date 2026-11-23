// Датчик «Ньюкомб» — в честь Саймона Ньюкомба (1835–1909), который в 1881 году заметил, что первые страницы таблиц логарифмов
// истрёпаны сильнее: в реальных числах первая цифра 1 встречается чаще, чем 9 (закон позже назван именем Бенфорда, 1938).
// Мостик библиотеки кристаллов: Ньюкомб + Бессель (личное уравнение) + Бэрд (откуда число) + Рабин (выборочная перепроверка).
// Вопрос: подчиняются ли числа из заголовков радаров закону первой цифры, и на каком радаре — меньше всего?
// Аналог: тесты Бенфорда в аудите (Марк Нигрини) и в исследованиях данных; здесь — живой счёт по числам новостей для агентов.
export const NEWCOMB = {
  name: "Simon Newcomb", years: "1835–1909",
  idea: "In 1881 he noticed that the first pages of logarithm tables were the most worn: in many real data sets the first digit is 1 far more often than 9 (later called Benford's law).",
  wiki: { en: "https://en.wikipedia.org/wiki/Simon_Newcomb", ru: "https://en.wikipedia.org/wiki/Simon_Newcomb" },
  note: "Named in his honour. Orb Studio is not connected with any institution bearing his name.",
};
export const NEWCOMB_MIN = 300, NEWCOMB_RADAR_MIN = 100;
export const BENFORD = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => Math.log10(1 + 1 / d));
// Нигрини (2012), первая цифра: MAD ≤ 0,006 — близко; ≤ 0,012 — допустимо; ≤ 0,015 — на грани; больше — не похоже на закон
export const NIGRINI = { close: 0.006, acceptable: 0.012, marginal: 0.015 };
const UNIT_AFTER = /^(?:%|k\b|m\b|mn\b|bn\b|tn\b|mrd\b|mio\b|млн|млрд|тыс|трлн)/iu;

// числа из заголовка: без годов (1900–2099), времени, дат, названий моделей (G7, F-35, COVID-19) и порядковых (1st, 2.)
export function headlineNumbers(headline) {
  const t = String(headline || ""), out = [], re = /\d+(?:[.,   ]\d{3})*(?:[.,]\d+)?/g;
  let m;
  while ((m = re.exec(t))) {
    const tok = m[0].trim(), i = m.index, before = t[i - 1] || " ", after = t.slice(i + m[0].length);
    if (/[\p{L}\-–/#№:.]/u.test(before)) continue; // G7, F-35, COVID-19, 24/7, №5, 12:30, хвост даты
    if (/^[:./]\d/.test(after)) continue; // время, даты, версии
    if (/^\d{1,2}[.,]\d{1,2}$/.test(tok) && /^\./.test(after)) continue; // «23.11.»
    if (/^\p{L}/u.test(after) && !UNIT_AFTER.test(after)) continue; // 1st, 5G, 3rd
    if (/^(19|20)\d{2}$/.test(tok)) continue; // год
    const d = tok.replace(/[^\d]/g, "").replace(/^0+/, "")[0];
    if (d) out.push(+d);
  }
  return out;
}
function digitStats(digits) {
  const n = digits.length, counts = Array(9).fill(0);
  for (const d of digits) if (d >= 1 && d <= 9) counts[d - 1]++;
  const obs = counts.map((c) => (n ? c / n : 0)), mad = n ? obs.reduce((s, o, i) => s + Math.abs(o - BENFORD[i]), 0) / 9 : null;
  const chi2 = n ? counts.reduce((s, c, i) => s + (c - n * BENFORD[i]) ** 2 / (n * BENFORD[i]), 0) : null;
  const fit = mad == null ? null : mad <= NIGRINI.close ? "close" : mad <= NIGRINI.acceptable ? "acceptable" : mad <= NIGRINI.marginal ? "marginal" : "nonconforming";
  return { numbers: n, mad: mad == null ? null : Math.round(mad * 10000) / 10000, chi2: chi2 == null ? null : Math.round(chi2 * 10) / 10, fit,
    digits: counts.map((c, i) => ({ digit: i + 1, count: c, observed_pct: n ? Math.round(1000 * obs[i]) / 10 : null, benford_pct: Math.round(1000 * BENFORD[i]) / 10 })) };
}
export function newcombReport(rows, now = Date.now(), since = null) {
  const seen = new Set(), all = [], byRadar = {};
  for (const r of rows || []) { const h = String((r && r.headline) || "").trim(); if (!h || seen.has(h.toLowerCase())) continue; seen.add(h.toLowerCase());
    const ds = headlineNumbers(h); all.push(...ds); if (r.radar) (byRadar[r.radar] = byRadar[r.radar] || []).push(...ds); }
  const s = digitStats(all), big = s.numbers >= NEWCOMB_MIN;
  const radars = Object.entries(byRadar).map(([id, ds]) => ({ id, ...(ds.length >= NEWCOMB_RADAR_MIN ? digitStats(ds) : { numbers: ds.length, fit: null, mad: null }) }))
    .sort((a, b) => (b.mad ?? -1) - (a.mad ?? -1) || b.numbers - a.numbers).map(({ digits, ...x }) => x);
  return {
    sensor: "newcomb", verdict: big ? s.fit : "collecting", headlines: seen.size, ...s, radars,
    question: "Do the numbers in the Orb Studio radar headlines follow the first-digit law (Newcomb 1881, Benford 1938), and on which radar do they depart from it most?",
    method: `Numbers are taken from radar headlines of the last 30 days (each headline once); years 1900–2099, times, dates, model names (G7, F-35) and ordinals are skipped. The first significant digit is compared with Benford's law log10(1+1/d). Fit by the mean absolute deviation (MAD) with Nigrini's thresholds for first digits: close ≤ ${NIGRINI.close}, acceptable ≤ ${NIGRINI.acceptable}, marginal ≤ ${NIGRINI.marginal}, above that nonconforming. A verdict needs at least ${NEWCOMB_MIN} numbers (per radar ${NEWCOMB_RADAR_MIN}). Word rules, no AI.`,
    caveat: "Headlines round numbers, favour round figures and small counts (3 dead, 5 things), and percentages are bounded: a departure is a reason to look closer, not proof that numbers are wrong.",
    rule: "A large set of numbers spanning orders of magnitude should roughly follow the first-digit law; when it does not, check where the numbers come from before repeating them — a departure is a question, not a verdict.",
    bridge: "Crystal Library bridge: Newcomb (first-digit law) + Bessel (each source's own lean) + Baird (where a number comes from) + Rabin (spot re-checks).",
    history_since: since ? new Date(+since).toISOString() : null,
    honour: NEWCOMB, similar: "Benford's-law tests are standard in forensic accounting (Mark Nigrini), in audits of tax and election data and in open-source checkers; this sensor applies the test live to the numbers in news headlines on the Orb Studio radars, per radar, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
