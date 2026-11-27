import test from "node:test";
import assert from "node:assert/strict";
import { diceCoef, diceReport } from "../src/dice.js";

test("dice: coefficient is 1 for equal sets, 0 for disjoint, null for empty", () => {
  assert.equal(diceCoef(["a", "b"], ["a", "b"]), 1);
  assert.equal(diceCoef(["a"], ["b"]), 0);
  assert.equal(diceCoef([], ["b"]), null);
  assert.equal(diceCoef(["a", "b", "c"], ["a", "b", "d"]), 0.67);
});
test("dice: collecting with few events; flags near-identical headlines and names the earlier outlet", () => {
  const t = Date.UTC(2026, 10, 27, 10);
  const rows = [
    { source: "alpha.de", headline: "Bundesbank senkt Wachstumsprognose drastisch wegen Exporteinbruch", first_ts: t },
    { source: "beta.de", headline: "Bundesbank senkt Wachstumsprognose drastisch wegen Exporteinbruch", first_ts: t + 600e3 },
  ];
  const r = diceReport(rows, t + 3600e3);
  assert.equal(r.sensor, "dice"); assert.equal(r.verdict, "collecting");
  assert.equal(r.examples.length, 1); assert.equal(r.examples[0].earlier.outlet, "alpha.de"); assert.equal(r.examples[0].later.outlet, "beta.de");
});
test("dice: wired into worker, llms.txt and agent.json", async () => {
  const { readFileSync } = await import("node:fs");
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /name: "get_dice"/); assert.match(w, /tool: "get_dice"/); assert.match(w, /name === "get_dice"/); assert.match(w, /p === "\/api\/v1\/dice"/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_dice/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /api\/v1\/dice/);
});
