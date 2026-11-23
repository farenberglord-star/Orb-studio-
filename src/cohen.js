// Датчик «Коэн» — в честь Джейкоба Коэна (1923–1998): статистическая мощность и величина эффекта (1962, 1988; «Земля круглая (p < .05)», 1994).
// Мостик Грока «незначимо ≠ нет эффекта» для зоны 5: Коэн + Мурс (проверкой не пользуются, если она дороже, чем без неё) + Госсет + Ховард.
// Вопрос: какое самое маленькое изменение каждый датчик Orb Studio вообще способен заметить на тех данных, что у него есть сейчас?
// Если датчик говорит «ничего не нашёл», агент должен знать, значит ли это «нет эффекта» или «данных пока мало, чтобы его увидеть».
export const COHEN = {
  name: "Jacob Cohen", years: "1923–1998",
  idea: "Statistical power and effect size (1962, 1988): a study too small to detect an effect says nothing when it finds 'no significant effect'.",
  wiki: { en: "https://en.wikipedia.org/wiki/Jacob_Cohen_(statistician)", ru: "https://en.wikipedia.org/wiki/Jacob_Cohen_(statistician)" },
  note: "Named in his honour. Orb Studio is not connected with any institution bearing his name.",
};
export const Z_ALPHA = 1.96, Z_POWER = 0.84; // уровень 5 % (двусторонний) и мощность 80 % — обычный выбор Коэна
const r2 = (x) => (x == null || !Number.isFinite(x) ? null : Math.round(x * 100) / 100), pp = (x) => (x == null ? null : Math.round(x * 1000) / 10);

// доля против 50 %: на сколько процентных пунктов должна отличаться доля, чтобы её заметили с мощностью 80 %
export function mdeShare(n, p0 = 0.5) { return n > 0 ? (Z_ALPHA + Z_POWER) * Math.sqrt((p0 * (1 - p0)) / n) : null; }
// корреляция: наименьшая |r|, заметная с мощностью 80 % (через преобразование Фишера)
export function mdeCorrelation(n) { return n > 3 ? Math.tanh((Z_ALPHA + Z_POWER) / Math.sqrt(n - 3)) : null; }
// погрешность доли (95 %): ±
export function marginShare(n, p) { return n > 0 ? Z_ALPHA * Math.sqrt((Math.max(p, 0.01) * (1 - Math.min(p, 0.99))) / n) : null; }
// ожидаемое MAD первой цифры от одного только случайного шума при n числах (если данные точно по закону Бенфорда)
export function noiseMAD(n) { if (!(n > 0)) return null; let s = 0; for (let d = 1; d <= 9; d++) { const p = Math.log10(1 + 1 / d); s += Math.sqrt((2 / Math.PI) * (p * (1 - p)) / n); } return s / 9; }
const grade = (x, ok, weak) => (x == null ? "no_data" : x <= ok ? "fine" : x <= weak ? "coarse" : "blind");

export function cohenReport(src = {}, now = Date.now()) {
  const checks = [];
  for (const coin of ["BTC", "ETH"]) {
    const c = src.trackrecord && src.trackrecord.coins && src.trackrecord.coins[coin], n = c ? +c.days || 0 : 0, m = mdeShare(n), r = mdeCorrelation(n);
    checks.push({ sensor: "trackrecord", what: `${coin}: share of days the price went against the crypto radar`, n, unit: "days", smallest_detectable: pp(m), smallest_detectable_unit: "percentage points away from 50%", grade: grade(m, 0.1, 0.25),
      plain: n ? `With ${n} days, only a lean stronger than 50% ± ${pp(m)} points can be seen; anything smaller looks like 'no link'.` : "No days yet." });
    checks.push({ sensor: "who_leads_whom (planned)", what: `${coin}: correlation between radar change and next-day price change`, n, unit: "days", smallest_detectable: r2(r), smallest_detectable_unit: "|correlation|", grade: grade(r, 0.3, 0.5),
      plain: n > 3 ? `With ${n} days, only a correlation of about ${r2(r)} or stronger can be told from chance.` : "Too few days for any correlation." });
  }
  const pa = src.pearson && src.pearson.all, pn = pa ? +pa.answers || 0 : 0, pm = mdeShare(pn);
  checks.push({ sensor: "pearson", what: "Forecast game: accuracy against a coin toss", n: pn, unit: "answers", smallest_detectable: pp(pm), smallest_detectable_unit: "percentage points away from 50%", grade: grade(pm, 0.1, 0.25),
    plain: pn ? `With ${pn} answers, players must be right more than 50% + ${pp(pm)} points before skill can be told from luck.` : "No resolved answers yet." });
  const ka = src.kasperson || {}, kn = +ka.stories || 0, kp = kn ? (+ka.amplified || 0) / kn : 0, km = marginShare(kn, kp);
  checks.push({ sensor: "kasperson", what: "Share of radar stories that were amplified", n: kn, unit: "stories", smallest_detectable: pp(km), smallest_detectable_unit: "± percentage points (95%)", grade: grade(km, 0.03, 0.08),
    plain: kn ? `With ${kn} stories, the amplified share is known to about ± ${pp(km)} points.` : "No stories yet." });
  const nw = src.newcomb || {}, nn = +nw.numbers || 0, nm = noiseMAD(nn);
  checks.push({ sensor: "newcomb", what: "First-digit test: deviation (MAD) that noise alone would give", n: nn, unit: "numbers", smallest_detectable: nm == null ? null : Math.round(nm * 10000) / 10000, smallest_detectable_unit: "MAD from noise alone (Nigrini 'close' ≤ 0.006, 'nonconforming' > 0.015)", grade: grade(nm, 0.006, 0.015),
    plain: nn ? `With ${nn} numbers, chance alone already gives a MAD of about ${Math.round(nm * 10000) / 10000}; a measured MAD near that says nothing about the data.` : "No numbers yet." });
  const blind = checks.filter((c) => c.grade === "blind").length, coarse = checks.filter((c) => c.grade === "coarse").length;
  return {
    sensor: "cohen", verdict: blind >= Math.ceil(checks.length / 2) ? "mostly_blind_to_small_effects" : blind + coarse ? "some_checks_coarse" : "checks_fine",
    checks,
    question: "What is the smallest effect each Orb Studio sensor could detect with the data it has now — so that 'nothing found' can be told apart from 'too little data to see it'?",
    method: `For shares tested against 50%: smallest detectable lean = (${Z_ALPHA} + ${Z_POWER}) · √(0.25 / n) (two-sided 5% level, 80% power, Cohen's convention). For correlations: tanh((${Z_ALPHA} + ${Z_POWER}) / √(n − 3)) (Fisher transform). For a share's precision: ${Z_ALPHA} · √(p(1 − p) / n). For the first-digit test: the mean absolute deviation that sampling noise alone gives with n numbers. Grades: fine, coarse, blind (thresholds per check). No AI.`,
    rule: "Before reading 'no effect found' as 'there is no effect', say how big an effect the data could have shown; and keep the check cheap enough to be used (Mooers).",
    bridge: "Crystal Library bridge 'not significant ≠ no effect' (proposed by Grok): Cohen (power and effect size) + Mooers (a check nobody runs protects nothing) + Gosset (small samples need wider bands) + Howard (when more data pays off).",
    honour: COHEN, similar: "Power analysis and minimum detectable effect calculators (G*Power, A/B-testing tools) are standard in research and product testing; this sensor applies them live to the site's own sensors, so agents can read every 'nothing found' with its true resolution.",
    generated_at: new Date(now).toISOString(),
  };
}
