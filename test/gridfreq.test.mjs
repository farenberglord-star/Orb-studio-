import test from "node:test";
import assert from "node:assert/strict";
import { summarizeFrequency, fetchFrequency } from "../src/gridfreq.js";

const T0 = 1794960000; // начало суток UTC
const mk = (vals, start = T0) => ({ unix_seconds: vals.map((_, i) => start + i), data: vals, deprecated: false });
const NOW = (T0 + 7200 + 90) * 1000;

test("итог: последнее значение, возраст, окна 1 и 15 минут, минимум и максимум за сутки", () => {
  const v = Array.from({ length: 7201 }, (_, i) => 50 + (i === 100 ? 0.07 : i === 5000 ? -0.12 : 0.001 * ((i % 5) - 2)));
  const s = summarizeFrequency(mk(v), NOW);
  assert.equal(s.ok, true); assert.equal(s.unit, "Hz");
  assert.equal(s.latest.at, new Date((T0 + 7200) * 1000).toISOString()); assert.equal(s.latest.age_min, 1.5);
  assert.equal(s.latest.deviation_mhz, Math.round((v[7200] - 50) * 1000));
  assert.equal(s.last_minute.samples, 60); assert.equal(s.last_15_min.samples, 900);
  assert.equal(s.today_utc.max_hz, 50.07); assert.equal(s.today_utc.min_hz, 49.88);
  assert.equal(s.today_utc.max_at, new Date((T0 + 100) * 1000).toISOString());
  assert.equal(s.today_utc.share_outside_standard_range_pct, Math.round(2 / 7201 * 1000) / 10);
  assert.ok(s.last_hour_per_minute.length >= 60 && s.last_hour_per_minute.length <= 61); assert.ok(s.last_hour_per_minute.every((m) => Math.abs(m.mean_hz - 50) < 0.01));
});

test("пропуски, нечисла и немыслимые значения выбрасываются, а не превращаются в ноль", () => {
  const s = summarizeFrequency(mk([50, null, "x", NaN, 0, 49.99, 120, 50.01]), NOW);
  assert.equal(s.ok, true); assert.equal(s.today_utc.samples, 3); assert.equal(s.latest.hz, 50.01);
  assert.equal(summarizeFrequency(mk([null, null]), NOW).ok, false);
  assert.equal(summarizeFrequency(null, NOW).ok, false);
  assert.equal(summarizeFrequency({ unix_seconds: [1], data: [] }, NOW).ok, false);
});

test("разная длина массивов: берём общую часть", () => {
  const j = { unix_seconds: [T0, T0 + 1, T0 + 2], data: [50, 50.01] };
  assert.equal(summarizeFrequency(j, NOW).today_utc.samples, 2);
});

test("запрос: 429 и странный ответ дают ошибку, а не пустой результат", async () => {
  await assert.rejects(fetchFrequency(async () => ({ ok: false, status: 429 })), /rate limit/);
  await assert.rejects(fetchFrequency(async () => ({ ok: true, json: async () => ({ message: "x" }) })), /unexpected/);
  const j = await fetchFrequency(async () => ({ ok: true, json: async () => mk([50]) })); assert.equal(j.data.length, 1);
});
