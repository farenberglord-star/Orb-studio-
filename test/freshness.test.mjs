import test from "node:test"; import assert from "node:assert/strict";
import { CATALOG, toMs, row, build, cadenceClass } from "../src/freshness.js";
const NOW = Date.parse("2026-11-17T08:40:00Z");
const c = (id) => CATALOG.find((x) => x.id === id);
test("dates: day = end of day, month = end of month, year = end of year, UK format", () => {
  assert.equal(new Date(toMs("2026-11-15")).toISOString(), "2026-11-15T23:59:59.999Z");
  assert.equal(new Date(toMs("2026-10")).toISOString(), "2026-10-31T23:59:59.999Z");
  assert.equal(new Date(toMs("2025")).toISOString(), "2025-12-31T23:59:59.999Z");
  assert.equal(new Date(toMs("12-Nov-2026")).toISOString(), "2026-11-12T23:59:59.999Z");
  assert.equal(toMs("2026-11-17T09:35:00+01:00"), Date.parse("2026-11-17T08:35:00Z"));
  for (const v of [null, "", "soon", "17.11.2026", 12345]) assert.equal(toMs(v), null);
});
test("statuses", () => {
  assert.equal(row(c("radiation_de"), { latest_measurement_at: "2026-11-17T08:00:00Z" }, NOW).status, "on_time");
  assert.equal(row(c("radiation_de"), { latest_measurement_at: "2026-11-17T02:00:00Z" }, NOW).status, "late");
  const s = row(c("radiation_de"), { latest_measurement_at: "2026-11-16T20:00:00Z" }, NOW); assert.equal(s.status, "stale"); assert.equal(s.age_h, 12.7);
  assert.equal(row(c("radiation_de"), null, NOW).status, "no_data");
  assert.equal(row(c("radiation_de"), { ok: false }, NOW).status, "no_data");
  assert.equal(row(c("internet"), { internet: {} }, NOW).status, "unknown"); // старая копия без поля at
  assert.equal(row(c("internet"), { internet: { at: "2026-11-17T08:30:00Z" } }, NOW).status, "on_time");
  const e = row(c("bafin"), { ok: true, latest_published: "2026-11-12T05:00:00.000Z" }, NOW); assert.equal(e.status, "event"); assert.equal(e.age_h, 123.7);
});
test("real shapes from the live site", () => {
  const sensors = { inflation: { period: "2026-10" }, ecb: { deposit_rate_pct: { date: "2026-11-17" }, eurusd: { date: "2026-11-16" } }, sanctions: { uk_ships: { report_date: "12-Nov-2026" } }, power: { now_at: "2026-11-17T07:00:00.000Z" } };
  assert.equal(row(c("inflation_ea"), sensors, NOW).status, "on_time");
  assert.equal(row(c("ecb_rate"), sensors, NOW).data_time, "2026-11-16T23:59:59.999Z");
  assert.equal(row(c("sanctions_uk_ships"), sensors, NOW).status, "on_time");
  assert.equal(row(c("power_price_de"), sensors, NOW).status, "on_time");
  const sw = row(c("safeworld_official"), { figures: [{ year: "2025" }, { year: "2022 или последний доступный год" }, { year: "2024" }] }, NOW);
  assert.equal(sw.data_time, "2025-12-31T23:59:59.999Z"); assert.equal(sw.status, "on_time"); assert.equal(sw.cadence, "years");
  assert.equal(row(c("safeworld_noise"), { ok: false, status: "no_data" }, NOW).status, "no_data");
  assert.equal(row(c("radars"), { radars: [{ updated_at: "2026-11-17T08:31:29Z" }, { updated_at: "2026-11-17T08:20:00Z" }] }, NOW).data_time, "2026-11-17T08:20:00.000Z");
});
test("future timestamps never give a negative age; summary adds up; sorted by age", () => {
  assert.equal(row(c("stablecoins"), { stablecoins: { date: "2026-11-17" } }, NOW).age_h, 0);
  const b = build({ quakes: { feed_generated: "2026-11-17T08:40:23Z" }, gas: { ok: true, gas_day: "2026-11-15" } }, NOW);
  assert.equal(Object.values(b.summary).reduce((a, x) => a + x, 0), CATALOG.length);
  assert.equal(b.sensors[0].id, "earthquakes");
  const ages = b.sensors.map((r) => r.age_h).filter((x) => x != null); assert.deepEqual(ages, [...ages].sort((x, y) => x - y));
  assert.equal(cadenceClass(1), "minutes"); assert.equal(cadenceClass(72), "days"); assert.equal(cadenceClass(1200), "months"); assert.equal(cadenceClass(null), "irregular");
});
test("every catalog entry has three names and a known source key", () => {
  const keys = new Set(["outbreaks", "displacement", "food", "disasters", "radars", "sensors", "quakes", "space", "radiation", "flood", "elbe", "weather_at", "gas", "polls", "party", "roads", "parking", "aviation", "bafin", "prices", "tariffs", "safeworld", "noise"]);
  for (const x of CATALOG) { assert.ok(x.name.ru && x.name.de && x.name.en, x.id); assert.ok(keys.has(x.src), x.id); }
  assert.equal(new Set(CATALOG.map((x) => x.id)).size, CATALOG.length);
});
test("precision keeps what the source gave", async () => {
  const { precision } = await import("../src/freshness.js");
  assert.deepEqual(["2025", "2026-10", "2026-11-15", "12-Nov-2026", "2026-11-17T08:00:00Z"].map(precision), ["year", "month", "day", "day", "time"]);
  const r = row(c("safeworld_official"), { figures: [{ year: "2025" }, { year: "2024" }] }, NOW); assert.equal(r.data_precision, "year"); assert.equal(r.source_value, "2025");
  assert.equal(row(c("radars"), { radars: [{ updated_at: "2026-11-17T08:31:29Z" }] }, NOW).data_precision, "time");
});
test("radars: internal array and public object both work", () => {
  const arr = [{ updated_at: "2026-11-17T08:31:29Z" }, { updated_at: "2026-11-17T08:20:00Z" }];
  assert.equal(row(c("radars"), arr, NOW).status, "on_time");
  assert.equal(row(c("radars"), { radars: arr }, NOW).data_time, "2026-11-17T08:20:00.000Z");
});
test("stored observations rebuild the same rows; a silent source keeps aging", async () => {
  const { observe, buildFromObs } = await import("../src/freshness.js");
  const o = observe(c("radiation_de"), { latest_measurement_at: "2026-11-17T08:00:00Z" });
  assert.deepEqual(o, { responded: true, raw: "2026-11-17T08:00:00Z" });
  const later = buildFromObs({ radiation_de: o }, NOW + 10 * 3600e3);
  assert.equal(later.sensors.find((r) => r.id === "radiation_de").status, "stale");
  assert.equal(later.sensors.find((r) => r.id === "gas_storage").status, "no_data");
  assert.deepEqual(observe(c("radiation_de"), null), { responded: false, raw: null });
});
