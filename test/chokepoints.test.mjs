import test from "node:test"; import assert from "node:assert/strict";
import { header, row, collect, summarize } from "../src/chokepoints.js";
const H = "date,year,month,day,portid,portname,n_container,n_dry_bulk,n_general_cargo,n_roro,n_tanker,n_cargo,n_total,capacity_container,capacity_dry_bulk,capacity_general_cargo,capacity_roro,capacity_tanker,capacity_cargo,capacity";
// Строки из живого файла HDX от 11.11.2026 (прислал Грок)
const REAL = ["2026-11-08 00:00:00+00:00,2026,11,8,chokepoint1,Suez Canal,16,7,3,0,17,26,43,1079142,265869,23272,0,795417,1368284,2163702",
  "2026-11-08 00:00:00+00:00,2026,11,8,chokepoint2,Panama Canal,8,2,0,1,11,11,22,325850,85816,0,6108,265215,417776,682991",
  "2026-11-08 00:00:00+00:00,2026,11,8,chokepoint6,Strait of Hormuz,0,1,1,0,1,2,3,0,0,792,0,0,792,792"];
test("header and real rows", () => {
  const h = header("﻿" + H); assert.ok(h);
  assert.deepEqual(row(REAL[2], h), { date: "2026-11-08", portid: "chokepoint6", name: "Strait of Hormuz", total: 3, tanker: 1 });
  assert.deepEqual(row(REAL[0], h), { date: "2026-11-08", portid: "chokepoint1", name: "Suez Canal", total: 43, tanker: 17 });
  assert.equal(header("a,b,c"), null);
});
const line = (d, name, total, tanker) => `${d} 00:00:00+00:00,0,0,0,cp,${name},0,0,0,0,${tanker},0,${total},0,0,0,0,0,0,0`;
const days = (from, n) => Array.from({ length: n }, (_, i) => new Date(Date.parse(from) - i * 864e5).toISOString().slice(0, 10));
test("collect stops at the cutoff; week vs a year earlier", () => {
  const recent = days("2026-11-08", 10), yearAgo = days("2025-11-08", 10);
  const lines = [H, ...recent.flatMap((d) => [line(d, "Strait of Hormuz", 3, 1), line(d, "Suez Canal", 40, 15)]), ...yearAgo.flatMap((d) => [line(d, "Strait of Hormuz", 100, 40), line(d, "Suez Canal", 40, 15)]),
    line("2024-01-01", "Strait of Hormuz", 999, 999)];
  const c = collect(lines); assert.equal(c.newest, "2026-11-08"); assert.equal(c.stop, true);
  const s = summarize(c.by, c.newest);
  assert.equal(s.ok, true); assert.equal(s.data_through, "2026-11-08");
  const hz = s.focus[0]; assert.equal(hz.key, "hormuz"); assert.equal(hz.ships_per_day_7d, 3); assert.equal(hz.ships_per_day_year_ago, 100); assert.equal(hz.change_vs_year_pct, -97); assert.equal(hz.tankers_per_day_7d, 1);
  assert.equal(s.focus[1].key, "suez"); assert.equal(s.focus[1].change_vs_year_pct, 0); assert.equal(hz.last_days.length, 7);
});
test("too few days → no average; broken input", () => {
  const c = collect([H, line("2026-11-08", "Strait of Hormuz", 3, 1), line("2026-11-07", "Strait of Hormuz", 2, 1)]);
  const s = summarize(c.by, c.newest); assert.equal(s.focus[0].ships_per_day_7d, null);
  assert.equal(summarize(null, null).ok, false); assert.equal(collect(["junk", "1,2,3"]).newest, null);
});
