// Датчик «Найквист» — в честь Гарри Найквиста (1889–1976), «Certain Topics in Telegraph Transmission Theory» (1928): чтобы
// следить за сигналом, его надо опрашивать хотя бы вдвое чаще, чем он меняется; при более редком опросе ряд показывает
// колебания, которых нет (наложение частот). Мостик «Опрос достаточно частый для того, как меняется» (Найквист + Шеннон + Микрин).
// Мы записываем индекс каждого радара раз в 30 минут (ix_hist). Если значение меняется почти на каждом шаге, мы опрашиваем
// его реже, чем по Найквисту: между двумя записями оно успевает сдвинуться, и отдельный получасовой скачок — не тренд.
export const NYQUIST = {
  name: "Harry Nyquist", years: "1889–1976",
  idea: "Sampling theorem (1928): to follow a signal, sample it at least twice as often as it can change; slower sampling shows changes that are not there.",
  wiki: { en: "https://en.wikipedia.org/wiki/Harry_Nyquist", ru: "https://ru.wikipedia.org/wiki/Найквист,_Гарри" },
  note: "Named in his honour. Orb Studio is not connected with Harry Nyquist's family or Nokia Bell Labs.",
};
export const NYQ_GAP = 45 * 60e3, NYQ_MIN_STEPS = 96, NYQ_LIMIT = 0.5; // 0,5: меньше двух записей на одно изменение
const r2 = (x) => Math.round(x * 100) / 100;

// rows: ix_hist [{ ts, c, g, … }] по возрастанию; series: [[id, col]]
export function nyquistReport(rows, series, now = Date.now()) {
  const radars = {};
  for (const [id, col] of series) {
    const v = (rows || []).filter((r) => r && r[col] != null && +r.ts <= now);
    let steps = 0, changed = 0, bigFlips = 0;
    for (let i = 1; i < v.length; i++) {
      if (+v[i].ts - +v[i - 1].ts > NYQ_GAP) continue; // пропуск в записи — не шаг
      steps++; const d = v[i][col] - v[i - 1][col];
      if (d !== 0) changed++;
      if (i >= 2 && +v[i - 1].ts - +v[i - 2].ts <= NYQ_GAP) { const d0 = v[i - 1][col] - v[i - 2][col]; if (Math.abs(d) >= 5 && Math.abs(d0) >= 5 && Math.sign(d) !== Math.sign(d0)) bigFlips++; } // туда-обратно за час
    }
    if (steps < NYQ_MIN_STEPS) { radars[id] = { verdict: "collecting", steps }; continue; }
    const share = changed / steps;
    radars[id] = { verdict: share > NYQ_LIMIT ? "undersampled" : "sampled_enough", change_share: r2(share), samples_per_change: changed ? r2(steps / changed) : null,
      back_and_forth_per_day: r2((bigFlips / steps) * 48), steps };
  }
  const under = Object.entries(radars).filter(([, r]) => r.verdict === "undersampled").map(([id, r]) => ({ radar: id, change_share: r.change_share, samples_per_change: r.samples_per_change }));
  const any = Object.values(radars).some((r) => r.verdict !== "collecting");
  return {
    sensor: "nyquist", honour: NYQUIST, generated_at: new Date(now).toISOString(),
    verdict: !any ? "collecting" : under.length ? "some_radars_undersampled" : "all_sampled_enough",
    question: "Do we record each radar often enough for how fast it changes, or can a single half-hour move be an artefact of sampling?",
    undersampled: under, radars,
    rule: `ix_hist records each radar every 30 minutes. change_share = share of consecutive records that differ; above ${NYQ_LIMIT} there are fewer than two records per change, which is below the Nyquist rate: the radar moves between records. back_and_forth_per_day = how often it jumps 5+ points and straight back within an hour.`,
    how_to_use: "undersampled: do not read one half-hour move of this radar as a trend; wait for several records or look at the hourly view (Shewhart). sampled_enough: half-hour moves are real steps of the series.",
    limits: "Radar indices only (the other sensors are read on request, not on a fixed schedule). A value can change because the set of headlines changed, not because the world did.",
    disclaimer: "Indicator, not advice.",
  };
}
