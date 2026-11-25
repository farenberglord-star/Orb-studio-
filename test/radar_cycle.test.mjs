import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
test("radar_life keeps last-sight passport lines and radar_cycle logs each cycle", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /"conf_l TEXT", "fired_l TEXT"/); assert.match(w, /fired_l = COALESCE\(excluded\.fired_l, fired_l\)/);
  assert.match(w, /CREATE TABLE IF NOT EXISTS radar_cycle/); assert.match(w, /INSERT OR IGNORE INTO radar_cycle/); assert.match(w, /DELETE FROM radar_cycle WHERE ts < /);
  const b = readFileSync(new URL("../src/crystal_bridges.js", import.meta.url), "utf8");
  assert.match(b, /B\("learning_loops".*"waiting"/); assert.match(b, /B\("growth_outruns_control".*"waiting"/);
});
