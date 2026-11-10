import test from "node:test"; import assert from "node:assert/strict";
import { parseGas } from "../src/gas.js";
const mk = (day, full, extra = {}) => ({ gasDayStart: day, full: String(full), gasInStorage: "180.5", workingGasVolume: "250", injection: "100", withdrawal: "900", trend: "-0.31", status: "C", ...extra });
test("latest day, flow and 7-day change", () => {
  const r = parseGas({ data: [mk("2026-11-09", 71.2), mk("2026-11-02", 74.9), mk("2026-11-08", 71.5)] });
  assert.equal(r.ok, true); assert.equal(r.gas_day, "2026-11-09"); assert.equal(r.full_percent, 71.2);
  assert.equal(r.net_flow, "WITHDRAWING"); assert.equal(r.data_status, "C"); assert.equal(r.trend_pp_day, -0.31); assert.equal(r.observed_change_7d.change_pp, -3.7);
  assert.equal(r.series.length, 3); assert.equal(r.series[0].day, "2026-11-02");
});
test("no 7-day point and bad input", () => {
  assert.equal(parseGas({ data: [mk("2026-11-09", 71)] }).observed_change_7d, null);
  assert.equal(parseGas({ data: [{ gasDayStart: "2026-11-09", full: "-" }] }).ok, false);
  assert.equal(parseGas(null).ok, false); assert.equal(parseGas({ data: "x" }).ok, false);
});
