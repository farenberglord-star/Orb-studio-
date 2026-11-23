import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { mdeShare, mdeCorrelation, noiseMAD, cohenReport } from "../src/cohen.js";

test("smallest detectable effects shrink with more data", () => {
  assert.equal(Math.round(mdeShare(100) * 1000) / 1000, 0.14); assert.ok(mdeShare(10) > 0.4);
  assert.ok(mdeCorrelation(10) > 0.75 && mdeCorrelation(200) < 0.2); assert.equal(mdeCorrelation(3), null);
  assert.ok(noiseMAD(130) > 0.015 && noiseMAD(5000) < 0.004);
});
test("report: 10 days and 4 answers are blind to small effects", () => {
  const r = cohenReport({ trackrecord: { coins: { BTC: { days: 10 }, ETH: { days: 10 } } }, pearson: { all: { answers: 4 } }, kasperson: { stories: 292, amplified: 3 }, newcomb: { numbers: 130 } });
  assert.equal(r.verdict, "mostly_blind_to_small_effects");
  assert.equal(r.checks.find((c) => c.sensor === "kasperson").grade, "fine"); assert.equal(r.checks.find((c) => c.sensor === "pearson").grade, "blind");
  assert.match(r.rule, /how big an effect/);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/cohen"/); assert.match(w, /name: "get_cohen"/); assert.match(w, /"tools\/cohen"/);
  for (const f of ["tools/cohen.html", "de/tools/cohen.html", "en/tools/cohen.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=cohen/); assert.match(h, /share-x\.js/); assert.match(h, /Jacob_Cohen/); }
});
