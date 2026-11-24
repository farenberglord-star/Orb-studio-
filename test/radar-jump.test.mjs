import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { radarJumpSignals } from "../src/radar-jump.js";

const NOW = Date.parse("2026-11-24T12:00:00Z");
const hist = (y, t) => ({ risk_index_history: { budget: [{ day: "2026-11-23", risk_index: y }, { day: "2026-11-24", risk_index: t }] } });
const ix = (vals) => vals.map((v, i) => ({ ts: NOW - (vals.length - 1 - i) * 18e5, b: v }));

test("flicker that comes back is not a jump (the 24.11 false alarms: budget 57 → 23 for a moment)", () => {
  assert.deepEqual(radarJumpSignals(hist(57, 23), ix([57, 56, 23, 58, 57]), NOW), []);
});
test("a move of 10+ held for 2 hours is a jump, in either direction", () => {
  const up = radarJumpSignals(hist(57, 70), ix([69, 70, 71, 70, 70]), NOW);
  assert.equal(up.length, 1); assert.equal(up[0].radar, "budget"); assert.equal(up[0].from, 57); assert.deepEqual(up[0].range_2h, [69, 71]);
  assert.equal(radarJumpSignals(hist(57, 40), ix([45, 44, 40, 41, 42]), NOW).length, 1);
});
test("one reading back near yesterday cancels it; too few readings or no half-hour column: no verdict", () => {
  assert.deepEqual(radarJumpSignals(hist(57, 70), ix([70, 70, 60, 70, 70]), NOW), []);
  assert.deepEqual(radarJumpSignals(hist(57, 70), ix([70, 70, 70]), NOW), []);
  assert.deepEqual(radarJumpSignals({ risk_index_history: { "bridge-info": [{ day: "a", risk_index: 15 }, { day: "b", risk_index: 40 }] } }, ix([40, 40, 40, 40]), NOW), []);
  assert.deepEqual(radarJumpSignals(null, [], NOW), []);
});
test("old readings outside the 2-hour window do not count", () => {
  const rows = ix([70, 70, 70, 70]).map((r) => ({ ...r, ts: r.ts - 5 * 3600e3 }));
  assert.deepEqual(radarJumpSignals(hist(57, 70), rows, NOW), []);
});
test("worker uses the held-jump rule instead of comparing with the live value", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /radarJumpSignals\(hist, ix, now\)/); assert.ok(!w.includes("between two daily snapshots"));
});
