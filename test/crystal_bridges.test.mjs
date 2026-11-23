import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CRYSTAL_BRIDGES, bridgesReport } from "../src/crystal_bridges.js";
import { CRYSTALS } from "../src/crystals.js";
import { SCIENTISTS as SCIENTIST_SENSORS } from "../src/scientists.js";
import { TIME_MACHINE } from "../src/timemachine.js";
import { CRYSTAL_ZONES } from "../src/crystals.js";

test("every bridge points to real cards, sensors or Time Machine entries", () => {
  const ids = new Set([...CRYSTALS.map((c) => c.id), ...SCIENTIST_SENSORS.map((s) => s.id), ...TIME_MACHINE.map((t) => t.id), "trackrecord"]), seen = new Set();
  for (const b of CRYSTAL_BRIDGES) {
    assert.ok(!seen.has(b.id), "duplicate " + b.id); seen.add(b.id); assert.ok(CRYSTAL_ZONES.includes(b.zone), b.id);
    for (const k of b.cards) assert.ok(ids.has(k), b.id + ": unknown card " + k);
    if (b.status === "waiting") assert.match(b.until, /^2026-\d\d-\d\d$/);
  }
  const r = bridgesReport(); assert.equal(r.working, r.counts.sensor + r.counts.line + r.counts.covered); assert.ok(r.working_pct > 50);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/crystal-bridges"/); assert.match(w, /name: "get_crystal_bridges"/);
});
