import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { paretoSeries, paretoReport } from "../src/pareto.js";

const T0 = Date.UTC(2026, 10, 20), S = 18e5;
const mk = (vals) => vals.map((v, i) => ({ ts: T0 + i * S, c: v, g: v }));
test("few big jumps carry the movement → heavy tails; steady steps → even; short history → collecting", () => {
  const spiky = []; let v = 50; for (let i = 0; i < 200; i++) { v += i % 40 === 0 ? 30 : i % 8 === 4 ? (i % 16 === 4 ? 1 : -1) : 0; spiky.push(v); }
  const s = paretoSeries(mk(spiky), "c"); assert.equal(s.tail, "heavy_tails", JSON.stringify(s)); assert.ok(s.biggest_vs_median >= 10);
  const steady = []; v = 50; for (let i = 0; i < 200; i++) { v += i % 2 ? 2 : -2; steady.push(v); }
  assert.equal(paretoSeries(mk(steady), "c").tail, "even");
  assert.equal(paretoSeries(mk(steady.slice(0, 40)), "c").tail, "collecting");
});
test("gaps longer than ~48 minutes are not counted as one jump", () => {
  const rows = [{ ts: T0, c: 10 }, { ts: T0 + S, c: 11 }, { ts: T0 + 10 * S, c: 90 }];
  assert.equal(paretoSeries(rows, "c").steps, 1);
});
test("report and wiring", () => {
  const r = paretoReport([]); assert.equal(r.verdict, "collecting"); assert.match(r.rule, /few jumps/);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/pareto"/); assert.match(w, /name: "get_pareto"/); assert.match(w, /"tools\/pareto"/);
  for (const f of ["tools/pareto.html", "de/tools/pareto.html", "en/tools/pareto.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=pareto/); assert.match(h, /share-x\.js/); assert.match(h, /Vilfredo_Pareto/); }
});
