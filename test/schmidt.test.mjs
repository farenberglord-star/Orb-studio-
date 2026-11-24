import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { schmidtShape, schmidtReport } from "../src/schmidt.js";

const M = 60e3, t0 = Date.UTC(2026, 10, 24, 8);
const j = (...mins) => mins.map((m, i) => ["o" + i, t0 + m * M]);
test("shape: wave, cascade, mixed, too few outlets", () => {
  assert.equal(schmidtShape(j(0, 5, 10, 20)).shape, "wave");
  assert.equal(schmidtShape(j(0, 90, 200, 400)).shape, "cascade");
  assert.equal(schmidtShape(j(0, 10, 20, 100, 200)).shape, "mixed");
  assert.equal(schmidtShape(j(0, 5)), null); assert.equal(schmidtShape("not json"), null); assert.equal(schmidtShape(null), null);
  assert.equal(schmidtShape(JSON.stringify(j(0, 5, 10))).outlets, 3);
});
test("report: collecting, then verdict, per radar", () => {
  const row = (radar, joins, i) => ({ radar, headline: "h" + i, source: "A", joins: JSON.stringify(joins) });
  assert.equal(schmidtReport([row("geo", j(0, 90, 200), 0)]).verdict, "collecting");
  const rows = [...Array(40)].map((_, i) => row(i % 2 ? "crypto" : "geo", i < 30 ? j(0, 90, 200, 400) : j(0, 5, 10), i));
  const r = schmidtReport(rows);
  assert.equal(r.stories, 40); assert.equal(r.cascade, 30); assert.equal(r.wave, 10); assert.equal(r.verdict, "mostly_cascades");
  assert.equal(r.longest_cascades[0].last_lag_min, 400); assert.match(r.rule, /independent confirmations/);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/schmidt"/); assert.match(w, /name: "get_schmidt"/); assert.match(w, /tool: "get_schmidt"/); assert.match(w, /joins: undefined/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_schmidt/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /api\/v1\/schmidt/);
});
