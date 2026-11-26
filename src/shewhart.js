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

// Мостик «Мелкие шаги — большая сумма» (Парфит + Херст + Том): какая доля движения радара за сутки пришла получасовыми
// шагами меньше порога «скачка» (10 пунктов). Скачок радара считает только удержанный большой шаг, медленный дрейф он не видит.
export const DRIFT_JUMP = 10, DRIFT_MIN_NET = 10, DRIFT_SHARE = 80;
export function smallSteps(rows, col, now = Date.now()) {
  const v = (rows || []).filter((r) => r && r[col] != null && +r.ts > now - 864e5 && +r.ts <= now).map((r) => +r[col]);
  if (v.length < 24) return { verdict: "collecting", points: v.length };
  const net = v[v.length - 1] - v[0]; let small = 0, big = 0;
  for (let i = 1; i < v.length; i++) { const d = v[i] - v[i - 1]; if (Math.abs(d) < DRIFT_JUMP) small += d; else big += d; }
  if (Math.abs(net) < DRIFT_MIN_NET) return { verdict: "no_large_move", net_24h: r1(net), points: v.length };
  const share = Math.max(0, Math.min(100, Math.round((100 * small) / net)));
  return { verdict: share >= DRIFT_SHARE ? "drift_in_small_steps" : "moved_by_jumps", net_24h: r1(net), small_steps_share_pct: share, sum_small: r1(small), sum_big: r1(big), points: v.length };
}

// Мостик «Храповик: вверх быстро, вниз медленно» (Дьюзенберри + Хикс + Калдор): после подъёма радара на 10+ пунктов —
// сколько часов занял подъём и сколько потом заняло возвращение на половину пути вниз. Отношение > 1 — уровень «застревает».
export const RATCHET_RISE = 10, RATCHET_LOOKBACK_H = 6, RATCHET_MIN_EP = 3;
const medianOf = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
export function ratchet(rows, col, now = Date.now()) {
  const pts = (rows || []).filter((r) => r && r[col] != null && +r.ts <= now && +r.ts > now - 30 * 864e5).map((r) => ({ ts: +r.ts, v: +r[col] }));
  const rises = [], falls = []; let stuck = 0, i = 1;
  while (i < pts.length) {
    let lo = null; for (let j = i - 1; j >= 0 && pts[j].ts >= pts[i].ts - RATCHET_LOOKBACK_H * HOUR; j--) if (!lo || pts[j].v < lo.v) lo = pts[j]; // ближайший к подъёму минимум
    if (!lo || pts[i].v - lo.v < RATCHET_RISE) { i++; continue; }
    let pk = i; while (pk + 1 < pts.length && pts[pk + 1].v >= pts[pk].v) pk++;
    const half = lo.v + (pts[pk].v - lo.v) / 2; let back = pk + 1; while (back < pts.length && pts[back].v > half) back++;
    rises.push((pts[pk].ts - lo.ts) / HOUR);
    if (back < pts.length) falls.push((pts[back].ts - pts[pk].ts) / HOUR); else stuck++;
    i = Math.max(back, pk + 1) + 1;
  }
  if (rises.length < RATCHET_MIN_EP) return { verdict: "collecting", rises: rises.length };
  const mr = medianOf(rises), mf = medianOf(falls), ratio = mr && mf != null ? r1(mf / Math.max(0.5, mr)) : null;
  const verdict = stuck > falls.length ? "stays_up" : ratio != null && ratio >= 2 ? "rises_fast_falls_slow" : ratio != null && ratio <= 0.5 ? "falls_back_fast" : "symmetric";
  return { verdict, rises: rises.length, returned_halfway: falls.length, still_up: stuck, median_rise_hours: r1(mr), median_half_return_hours: mf == null ? null : r1(mf), fall_to_rise_ratio: ratio };
}

export function shewhartReport(rows, series, now = Date.now()) {
  const radars = {};
  for (const [id, col] of series) radars[id] = { ...cusum(hourly(rows, col), now), small_steps_24h: smallSteps(rows, col, now), ratchet_30d: ratchet(rows, col, now) };
  const shifted = Object.entries(radars).filter(([, r]) => r.verdict === "shift_up" || r.verdict === "shift_down").map(([id, r]) => ({ radar: id, verdict: r.verdict, since: r.shift_since, from: r.mean_before, to: r.new_level_estimate }));
  return {
    sensor: "shewhart", honour: SHEWHART, generated_at: new Date(now).toISOString(),
    question: "Has a radar's level quietly shifted — a small change that never looked like a jump but has held for hours?",
    shifted, radars,
    drifting: Object.entries(radars).filter(([, r]) => r.small_steps_24h && r.small_steps_24h.verdict === "drift_in_small_steps").map(([id, r]) => ({ radar: id, net_24h: r.small_steps_24h.net_24h, small_steps_share_pct: r.small_steps_24h.small_steps_share_pct })),
    ratchets: Object.entries(radars).filter(([, r]) => r.ratchet_30d && (r.ratchet_30d.verdict === "rises_fast_falls_slow" || r.ratchet_30d.verdict === "stays_up")).map(([id, r]) => ({ radar: id, ...r.ratchet_30d })),
    rule: `hourly means of each radar; mean and usual spread (standard deviation of hourly means) from its history before the last ${SHEWHART_RECENT_H} h; over the last ${SHEWHART_RECENT_H} h deviations beyond ${SHEWHART_K} sigma are summed (CUSUM); shift = the sum passes ${SHEWHART_H} sigma`,
    how_to_use: "shift_up / shift_down: treat the radar's recent level as a new regime, not as noise — compare news against new_level_estimate, not mean_before. in_control: movements are ordinary variation; do not explain them as events. Complements radar jumps (big moves) and Nelson runs (run length). small_steps_24h drift_in_small_steps: the day's move came in steps too small to count as a jump — read it as a drift, not as calm. ratchet_30d rises_fast_falls_slow / stays_up: after a rise this radar comes down slowly — a high level may be inertia, not fresh news.",
    bridges: ["quiet_shift (Shewhart + Nelson)", "small_steps_large_sum (Parfit + Hurst + Thom)", "ratchet_up_slow_down (Duesenberry + Hicks + Kaldor)"],
    check: SHEWHART_CHECK,
    disclaimer: "Indicator, not advice. Thresholds are working assumptions, checked against the stored radar history.",
  };
}
export const SHEWHART_CHECK = "Back-test on ix_hist (14 days to 26.11.2026, see docs/claude-log.md): alarm share per radar-day is recorded there; the threshold was chosen so that shifts are flagged on a minority of days, not every day.";
