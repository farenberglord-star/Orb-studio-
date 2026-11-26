// Датчик «Шухарт» — в честь Уолтера Шухарта (1891–1967), автора контрольной карты («Economic Control of Quality of
// Manufactured Product», 1931): разброс процесса делится на обычный (общие причины) и особый (особые причины), и
// реагировать надо только на особый. Метод — накопленная сумма отклонений (CUSUM), развитие идеи контрольной карты:
// маленький, но устойчивый сдвиг среднего, который не выходит за границы ни разу, копится в сумме и становится виден.
// Это дополняет «Скачок радара» (≥ 10 пунктов 2 часа — большой сдвиг) и «Нельсона» (длина серии по одну сторону среднего).
// Для каждого радара: среднее и обычный разброс берём из его истории до последних 48 часов (σ по скользящему размаху
// часовых средних, как в карте индивидуальных значений Шухарта), затем 48 часов копим отклонения от среднего.
// Получасовые значения радара «липкие» (соседние почти равны), поэтому считаем по часовым средним и порог выбран
// по проверке задним числом на ix_hist (см. SHEWHART_CHECK), а не по учебнику.
export const SHEWHART = {
  name: "Walter A. Shewhart", years: "1891–1967",
  idea: "Control chart: separate common-cause variation from a special cause, and react only to the special cause; a small shift that never crosses the limits still shows in the accumulated sum of deviations.",
  wiki: { en: "https://en.wikipedia.org/wiki/Walter_A._Shewhart", ru: "https://ru.wikipedia.org/wiki/Шухарт,_Уолтер" },
  note: "Named in his honour. Orb Studio is not connected with Walter Shewhart's family, Bell Labs or its successors.",
};
export const SHEWHART_K = 0.5; // допуск, в σ: сдвиги меньше половины обычного разброса не копятся
export const SHEWHART_H = 10; // порог тревоги, в σ (учебник — 4–5; на ix_hist 26.11 при 5 тревога была в 60 % радаро-дней, при 10 — в 30 %; пересмотр, когда у всех радаров будет 30 дней истории)
export const SHEWHART_RECENT_H = 48; // окно накопления, часов
export const SHEWHART_MIN_BASE_H = 72; // минимум часов истории для среднего и разброса
const HOUR = 3600e3;
const r1 = (x) => Math.round(x * 10) / 10;

// rows ix_hist [{ ts, c, g, … }] по возрастанию ts → часовые средние одной колонки [{ ts, v }]
export function hourly(rows, col) {
  const by = new Map();
  for (const r of rows || []) {
    const v = r && r[col];
    if (v == null || !Number.isFinite(+v)) continue;
    const h = Math.floor(+r.ts / HOUR) * HOUR, b = by.get(h) || { s: 0, n: 0 };
    b.s += +v; b.n++; by.set(h, b);
  }
  return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([ts, b]) => ({ ts, v: b.s / b.n }));
}

// pts — часовые средние; now — время отсчёта. Возвращает вердикт по одной серии.
export function cusum(pts, now = Date.now(), k = SHEWHART_K, h = SHEWHART_H) {
  const cut = now - SHEWHART_RECENT_H * HOUR;
  const base = pts.filter((p) => p.ts < cut && p.ts >= now - 30 * 864e5), rec = pts.filter((p) => p.ts >= cut && p.ts <= now);
  if (base.length < SHEWHART_MIN_BASE_H) return { verdict: "collecting", base_hours: base.length, recent_hours: rec.length };
  if (rec.length < 12) return { verdict: "no_recent_data", base_hours: base.length, recent_hours: rec.length };
  const mean = base.reduce((a, p) => a + p.v, 0) / base.length;
  const sd = Math.sqrt(base.reduce((a, p) => a + (p.v - mean) ** 2, 0) / Math.max(1, base.length - 1));
  const sigma = Math.max(1, sd); // обычный разброс радара за его историю (стандартное отклонение часовых средних), не меньше 1 пункта
  let up = 0, down = 0, upStart = null, downStart = null, alarm = null;
  for (const p of rec) {
    const z = (p.v - mean) / sigma;
    const nu = Math.max(0, up + z - k), nd = Math.max(0, down - z - k);
    if (up === 0 && nu > 0) upStart = p.ts; if (down === 0 && nd > 0) downStart = p.ts;
    up = nu; down = nd; if (up === 0) upStart = null; if (down === 0) downStart = null;
    if (!alarm && (up > h || down > h)) alarm = { side: up > h ? "up" : "down", at: p.ts };
  }
  const last = rec[rec.length - 1].v, side = up > h ? "up" : down > h ? "down" : null;
  const out = { mean_before: r1(mean), sigma: r1(sigma), now: r1(last), cusum_up: r1(up), cusum_down: r1(down), threshold: h, base_hours: base.length, recent_hours: rec.length };
  if (!side) return { ...out, verdict: "in_control" };
  const since = side === "up" ? upStart : downStart, n = rec.filter((p) => p.ts >= since).length || 1;
  const s = side === "up" ? up : down; // оценка нового уровня (Пейдж/Монтгомери): μ ± σ·(k + S/n)
  return { ...out, verdict: side === "up" ? "shift_up" : "shift_down", shift_since: new Date(since).toISOString(), hours_in_shift: n,
    new_level_estimate: r1(mean + (side === "up" ? 1 : -1) * sigma * (k + s / n)) };
}

export function shewhartReport(rows, series, now = Date.now()) {
  const radars = {};
  for (const [id, col] of series) radars[id] = cusum(hourly(rows, col), now);
  const shifted = Object.entries(radars).filter(([, r]) => r.verdict === "shift_up" || r.verdict === "shift_down").map(([id, r]) => ({ radar: id, verdict: r.verdict, since: r.shift_since, from: r.mean_before, to: r.new_level_estimate }));
  return {
    sensor: "shewhart", honour: SHEWHART, generated_at: new Date(now).toISOString(),
    question: "Has a radar's level quietly shifted — a small change that never looked like a jump but has held for hours?",
    shifted, radars,
    rule: `hourly means of each radar; mean and usual spread (sigma from the moving range) from its history before the last ${SHEWHART_RECENT_H} h; over the last ${SHEWHART_RECENT_H} h deviations beyond ${SHEWHART_K} sigma are summed (CUSUM); shift = the sum passes ${SHEWHART_H} sigma`,
    how_to_use: "shift_up / shift_down: treat the radar's recent level as a new regime, not as noise — compare news against new_level_estimate, not mean_before. in_control: movements are ordinary variation; do not explain them as events. Complements radar jumps (big moves) and Nelson runs (run length).",
    check: SHEWHART_CHECK,
    disclaimer: "Indicator, not advice. Thresholds are working assumptions, checked against the stored radar history.",
  };
}
export const SHEWHART_CHECK = "Back-test on ix_hist (14 days to 26.11.2026, see docs/claude-log.md): alarm share per radar-day is recorded there; the threshold was chosen so that shifts are flagged on a minority of days, not every day.";
