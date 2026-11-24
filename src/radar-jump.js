// Детектор аномалий: «скачок радара» (value_radar_jump).
// Раньше: итог вчерашнего дня против ТЕКУЩЕГО значения сегодня (оно перезаписывается каждые 5 минут).
// Внутри дня радар часто мигает (меняется набор заголовков) и возвращается — например, бюджет проваливается
// с 57 до 23 и к вечеру снова 57. Детектор принимал это мигание за скачок (24.11.2026: 12 ложных из 12 у budget/energy).
// Теперь: скачок засчитывается, только если сдвиг ≥ 10 пунктов держится все последние 2 часа
// (каждая получасовая запись ix_hist за 2 часа отличается от вчерашнего итога на ≥ 10 в одну и ту же сторону).
// Мостик «шум или сдвиг» (Поляк + Гальтон + шум радара): мигание — не сдвиг.

export const JUMP_POINTS = 10;
export const HOLD_MS = 2 * 3600e3;
export const MIN_READINGS = 4; // 4 получаса = 2 часа
// колонки ix_hist → радары (как в записи ix_hist)
export const IX_COL = { geo: "g", crypto: "k", budget: "b", politics: "p", economy: "e", energy: "n", justice: "j", web: "w" };
export const JUMP_RULE = `radar risk index moved >= ${JUMP_POINTS} points from yesterday's final value and stayed there for the last 2 hours (every half-hour reading); short flicker that comes back is not a jump`;

// hist — historyIndex(): { risk_index_history: { id: [{ day, risk_index }] } }; ix — строки ix_hist { ts, g, k, … } за последние часы
export function radarJumpSignals(hist, ix, now = Date.now()) {
  const out = [];
  if (!hist || !hist.risk_index_history) return out;
  const recent = (ix || []).filter((r) => r && +r.ts > now - HOLD_MS - 15 * 60e3 && +r.ts <= now);
  for (const [id, ser] of Object.entries(hist.risk_index_history)) {
    const col = IX_COL[id];
    if (!col || !ser || ser.length < 2) continue; // без получасовой истории не судим (раньше такие тоже давали ложные скачки)
    const a = ser[ser.length - 2], b = ser[ser.length - 1];
    if (!a || !b || a.risk_index == null || b.risk_index == null) continue;
    const vals = recent.map((r) => r[col]).filter((v) => typeof v === "number");
    if (vals.length < MIN_READINGS) continue;
    const base = a.risk_index, up = vals.every((v) => v - base >= JUMP_POINTS), down = vals.every((v) => base - v >= JUMP_POINTS);
    if (!up && !down) continue;
    out.push({ type: "value_radar_jump", sensor: `/api/v1/radar/${id}`, radar: id, from: base, to: b.risk_index, from_day: a.day, to_day: b.day,
      held_hours: 2, readings: vals.length, range_2h: [Math.min(...vals), Math.max(...vals)], rule: JUMP_RULE });
  }
  return out;
}
