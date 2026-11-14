import test from "node:test";
import assert from "node:assert/strict";
import { accuracy, calibrate, normalizeCuts, applyCamera } from "../src/clipstats.js";

const clips = [
  { id: "ER-001", video: { id: "W2bdRW-EazA" }, start_s: 1507, end_s: 1605, emotional_timecode_s: 1600 },
  { id: "ER-002", video: { id: "W2bdRW-EazA" }, start_s: 940, end_s: 990, emotional_timecode_s: 983 },
];
const queue = [794, 983, 2388, 2607].map((t) => ({ video: "W2bdRW-EazA", t_s: t, yes: 0, no: 0, pause_s: 1.5, rules: ["pause"] }));

test("recall: ER-002 found, ER-001 missed; chance level for ±3 s", () => {
  const a = accuracy(queue, clips);
  assert.equal(a.recall.found, 1); assert.equal(a.recall.total, 2); assert.equal(a.recall.pct, 50);
  assert.equal(a.recall.clips.find((c) => c.clip === "ER-001").found, "missed");
  assert.equal(a.recall.clips.find((c) => c.clip === "ER-002").found, "hit");
  assert.equal(a.chance_hit_pct, +(((7 / 98 + 7 / 50) / 2) * 100).toFixed(1));
  assert.equal(a.precision.decided, 0); assert.equal(a.calibration.status, "collecting");
});

test("precision from votes; ties are not decided", () => {
  const q = queue.map((x, i) => ({ ...x, yes: [2, 0, 1, 1][i], no: [0, 1, 1, 0][i] }));
  const a = accuracy(q, clips);
  assert.equal(a.precision.decided, 3); assert.equal(a.precision.confirmed, 2); assert.equal(a.precision.pct, 67);
});

test("calibrate picks the pause threshold that separates yes from no", () => {
  const votes = [];
  for (let i = 0; i < 20; i++) votes.push({ pause_s: 2 + (i % 5) * 0.2, yes: 1, no: 0, rules: ["pause"] });
  for (let i = 0; i < 20; i++) votes.push({ pause_s: 1.2 + (i % 5) * 0.1, yes: 0, no: 1, rules: ["pause"] });
  const c = calibrate(votes, []);
  assert.equal(c.status, "ready"); assert.ok(c.suggested.pause_min_s > 1.6 && c.suggested.pause_min_s <= 2.0, String(c.suggested.pause_min_s));
  assert.equal(c.fit.f1, 1);
});

test("camera: relative times are shifted, listener cut moves the timecode", () => {
  const cam = normalizeCuts({ cuts: [{ t: 3.5, to: "listener" }, { t: 9, to: "speaker" }], reactions: [] }, 979, 991);
  assert.deepEqual(cam.cuts.map((c) => c.t), [982.5, 988]);
  const n = applyCamera({ timecode_s: 983, pause_s: 2.2, score: 2.2, rules: ["pause"], why: [] }, { ...cam, model: "m" });
  assert.equal(n.camera.cut_s, 982.5); assert.equal(n.timecode_s, 983); assert.ok(n.rules.includes("camera")); assert.equal(n.timecode_text_s, 983);
  const none = applyCamera({ timecode_s: 983, pause_s: 2.2, score: 2.2 }, { cuts: [], reactions: [] });
  assert.equal(none.timecode_s, 983); assert.equal(none.camera.cut_s, null);
});
