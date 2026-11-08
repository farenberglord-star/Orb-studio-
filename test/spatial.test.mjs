import test from "node:test";
import assert from "node:assert/strict";
import { pitchToMidi, scorePoints, ringLayout, buildScene } from "../src/spatial.js";

test("pitch → midi", () => { assert.equal(pitchToMidi("A4"), 69); assert.equal(pitchToMidi("C#5"), 73); assert.equal(pitchToMidi("r"), null); });
test("score points: normalised, rests skipped, capped", () => {
  const notes = [["G3", 1, "p"], ["r", 1], ["A4", 2, "ff"], ["E7", 1, "mf"]];
  const p = scorePoints(notes);
  assert.equal(p.length, 3);
  for (const [x, y, z] of p) for (const v of [x, y, z]) assert.ok(v >= 0 && v <= 1);
  assert.equal(p[0][0], 0);
  const many = Array.from({ length: 300 }, () => ["A4", 1, "mf"]);
  assert.equal(scorePoints(many, 64).length, 64);
});
test("ring layout: 4 nodes at radius 1, y = 0", () => {
  const l = ringLayout(1);
  assert.equal(Object.keys(l).length, 4);
  for (const [x, y, z] of Object.values(l)) { assert.equal(y, 0); assert.ok(Math.abs(Math.hypot(x, z) - 1) < 0.02); }
});
test("scene: schematic flag, real values only, no gps, no reputation", () => {
  const s = buildScene({ now: new Date("2026-11-08T12:00:00Z"), emo: { status: "ready", online: true }, agentsToday: 7, courtToday: 0, piece: { day: "2026-11-08", title: "T", key: "D", bpm: 80, notes: [["A4", 1, "mf"]] } });
  assert.equal(s.schematic, true);
  assert.equal(s.node_id, "orbstudio_hamburg_main");
  assert.equal(s.nodes.agents.agents_today, 7);
  assert.equal(s.nodes.court.marker.color, "#6fe6ff");
  assert.equal(s.nodes.emo.status, "ready");
  const txt = JSON.stringify(s);
  assert.ok(!/CLEAN|WARNING|latitude|longitude/i.test(txt));
});
test("scene with missing data stays honest (nulls, not invented numbers)", () => {
  const s = buildScene({});
  assert.equal(s.nodes.emo.status, "unknown");
  assert.equal(s.nodes.agents.agents_today, null);
  assert.deepEqual(s.nodes.violin.score_points, []);
});
