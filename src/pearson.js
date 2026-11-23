// Датчик «Пирсон» — в честь Эгона Пирсона (1895–1980): лемма Неймана — Пирсона (1933), у любой проверки две ошибки —
// ложная тревога и пропуск, и уменьшение одной увеличивает другую. Мостик «цена ошибки» (предложил Грок):
// Э. Пирсон + Сэвидж (вес исхода) + Снедекор (сравнивать с разбросом) + Уэддерберн (не выдумывать модель).
// Вопрос: в игре прогнозов Orb Studio («радар завтра выше или ниже?») кто чаще поднимает ложную тревогу («выше», а стало ниже),
// а кто чаще пропускает рост («ниже», а стало выше), и сколько ошибок сделано с высокой уверенностью?
export const PEARSON = {
  name: "Egon Pearson", years: "1895–1980",
  idea: "With Jerzy Neyman (1933) he showed that every test makes two kinds of error — a false alarm and a miss — and that lowering one raises the other.",
  wiki: { en: "https://en.wikipedia.org/wiki/Egon_Pearson", ru: "https://en.wikipedia.org/wiki/Egon_Pearson" },
  note: "Named in his honour. Orb Studio is not connected with any institution bearing his name.",
};
export const PEARSON_MIN = { group: 20, agent: 5 }, PEARSON_SURE = 80;
const pct = (a, b) => (b ? Math.round((100 * a) / b) : null);

// «тревога» = ответ «выше» (радары меряют напряжение: рост — это сигнал); ложная тревога — «выше», а стало ниже; пропуск — «ниже», а стало выше
export function errorProfile(rows) {
  const r = (rows || []).filter((x) => x && (x.dir === "up" || x.dir === "down") && (x.result === "up" || x.result === "down"));
  const hit = r.filter((x) => x.dir === "up" && x.result === "up").length, fa = r.filter((x) => x.dir === "up" && x.result === "down").length;
  const miss = r.filter((x) => x.dir === "down" && x.result === "up").length, cr = r.filter((x) => x.dir === "down" && x.result === "down").length;
  const wrong = fa + miss, sure = r.filter((x) => x.dir !== x.result && Number.isFinite(+x.prob) && x.prob !== null && +x.prob >= PEARSON_SURE).length;
  const upAns = hit + fa, upRes = hit + miss, n = r.length;
  return {
    answers: n, correct: hit + cr, correct_pct: pct(hit + cr, n),
    false_alarms: fa, misses: miss, false_alarm_rate_pct: pct(fa, fa + cr), miss_rate_pct: pct(miss, hit + miss),
    says_up_pct: pct(upAns, n), went_up_pct: pct(upRes, n), confident_errors: sure, confident_error_pct: pct(sure, wrong),
    lean: n < PEARSON_MIN.agent ? "too_few" : fa > 2 * miss && fa >= 2 ? "raises_false_alarms" : miss > 2 * fa && miss >= 2 ? "misses_rises" : "balanced",
  };
}
export function pearsonReport(rows, now = Date.now(), since = null) {
  const all = (rows || []).filter(Boolean), grp = (f) => errorProfile(all.filter(f));
  const groups = { humans: grp((x) => x.kind === "human"), ai_verified: grp((x) => x.kind === "agent" && x.verified), ai_unverified: grp((x) => x.kind === "agent" && !x.verified) };
  const by = {}; for (const x of all.filter((y) => y.kind === "agent" && y.verified)) (by[x.who] = by[x.who] || { name: x.name || x.who, rows: [] }).rows.push(x);
  const agents = Object.values(by).map((a) => ({ name: a.name, ...errorProfile(a.rows) })).filter((a) => a.answers >= PEARSON_MIN.agent).sort((a, b) => b.answers - a.answers).slice(0, 15);
  const total = errorProfile(all), ready = total.answers >= PEARSON_MIN.group;
  return {
    sensor: "pearson", verdict: !ready ? "collecting" : total.lean,
    all: total, groups, agents,
    question: "In the Orb Studio forecast game (will a radar be higher or lower tomorrow?), who raises false alarms — says 'higher' and it fell — and who misses rises — says 'lower' and it rose — and how many errors were made with high confidence?",
    method: `Resolved answers of the last 90 days. 'Higher' counts as the alarm, because the radars measure tension. False alarm = said higher, went lower; miss = said lower, went higher. Rates: false alarms among the days that went lower, misses among the days that went higher. Confident error = a wrong answer given with ${PEARSON_SURE}% confidence or more. Lean: one kind of error more than twice the other (at least two). Group verdict from ${PEARSON_MIN.group} answers, per agent from ${PEARSON_MIN.agent}. No AI.`,
    rule: "Say which error costs more here — a false alarm or a miss — and set your threshold for that; an agent that always says 'higher' never misses a rise but cries wolf.",
    caveat: "Up and down are symmetric in this game; which error costs more depends on who uses the forecast. The sensor shows the balance, it does not rank agents.",
    bridge: "Crystal Library bridge 'cost of error' (proposed by Grok): Egon Pearson (two kinds of error) + Savage (weigh outcomes by value) + Snedecor (compare with spread) + Wedderburn (assume only what you know).",
    history_since: since ? new Date(+since).toISOString() : null,
    honour: PEARSON, similar: "Confusion matrices, false-alarm and miss rates, ROC analysis and forecast verification scores (e.g. in meteorology) are standard; this sensor applies them live to an open forecast game between humans and AI agents.",
    generated_at: new Date(now).toISOString(),
  };
}
