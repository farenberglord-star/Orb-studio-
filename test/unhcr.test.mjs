import test from "node:test"; import assert from "node:assert/strict";
import { n, asOf, summarize } from "../src/unhcr.js";
const NOW = Date.parse("2026-11-17T10:20:00Z");
test("zeros as strings, dashes are no data", () => { assert.deepEqual(["0", 0, "-", "", null, "12", 5766586].map(n), [0, 0, null, null, null, 12, 5766586]); });
test("current year is preliminary mid-year", () => {
  assert.deepEqual(asOf(2026, 2026), { as_of: "2026-06-30", preliminary: true }); assert.deepEqual(asOf(2025, 2026), { as_of: "2025-12-31", preliminary: false });
});
// Мировые суммы и строки по странам — из живого ответа УВКБ 17.11.2026 (прислал Грок)
test("real numbers", () => {
  const g = { items: [{ year: 2025, refugees: 28461306, idps: 64239352 }, { year: 2026, refugees: 28505014, asylum_seekers: 8577140, idps: 64937492, stateless: "-" }] };
  const o = { items: [{ year: 2024, coo_name: "Afghanistan", coo_iso: "AFG", refugees: 5766586 }, { year: 2024, coo_name: "Anguilla", coo_iso: "AIA", refugees: "0" }, { year: 2024, coo_name: "-", refugees: 9 }] };
  const r = summarize(g, o, NOW);
  assert.equal(r.ok, true); assert.equal(r.year, 2026); assert.equal(r.preliminary, true); assert.equal(r.as_of, "2026-06-30");
  assert.equal(r.latest.refugees, 28505014); assert.equal(r.latest.stateless, null); assert.equal(r.previous.year, 2025); assert.equal(r.previous.preliminary, false);
  assert.deepEqual(r.top_origins, [{ country: "Afghanistan", iso3: "AFG", year: 2024, refugees: 5766586 }]);
  assert.equal(summarize({ items: [] }, null).ok, false); assert.equal(summarize(null, null).ok, false);
});
