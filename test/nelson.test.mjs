import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runVsMean, runsVs30d, NELSON_MIN_POINTS } from "../src/nelson.js";

test("a long run above the mean is flagged; ordinary alternation is not (Nelson)", () => {
  const flick = []; for (let i = 0; i < 400; i++) flick.push(i % 4 < 2 ? 40 : 60);
  const a = runVsMean(flick); assert.equal(a.verdict, "usual_run"); assert.equal(a.run_halfhours, 2);
  const drift = [...flick, ...Array(30).fill(30)];
  const b = runVsMean(drift); assert.equal(b.verdict, "long_run"); assert.equal(b.side, "below_mean"); assert.equal(b.run_halfhours, 30);
});
test("sticky radar: a run is long only against its own past runs", () => {
  const v = []; for (let k = 0; k < 20; k++) for (let i = 0; i < 20; i++) v.push(k % 2 ? 30 : 70);
  v.push(...Array(12).fill(70));
  assert.equal(runVsMean(v).verdict, "usual_run"); // 12 < its usual 20-point runs
});
test("collecting below a week; wired into /api/v1/radars", () => {
  assert.equal(runVsMean([1, 2, 3]).verdict, "collecting"); assert.equal(runVsMean([]).verdict, "no_history");
  assert.ok(NELSON_MIN_POINTS >= 300); assert.ok(runsVs30d([{ k: 1 }], [["crypto", "k"]]).crypto);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /run_vs_mean/); assert.match(w, /runsVs30d/);
});
