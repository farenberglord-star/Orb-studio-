import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { simpsonDecompose, simpsonReport } from "../src/simpson.js";
const H = (r, t, n) => Array.from({ length: n }, () => ({ radar: r, headline: t }));
const part = (h) => (h.headline === "deal" ? "num" : "den");
test("paradox: total up while every radar goes down", () => {
  const then = [...H("geo", "war", 8), ...H("geo", "deal", 2), ...H("econ", "deal", 6), ...H("econ", "war", 4)];
  const now = [...H("geo", "war", 3), ...H("econ", "deal", 10), ...H("econ", "war", 9)];
  const r = simpsonDecompose(now, then, part);
  assert.ok(r.change > 0); assert.ok(r.within_radars < 0); assert.equal(r.verdict, "paradox"); assert.equal(r.radars_down, 2);
});
test("consistent and no change", () => {
  const then = [...H("geo", "war", 8), ...H("geo", "deal", 2)], now = [...H("geo", "war", 4), ...H("geo", "deal", 6)];
  assert.equal(simpsonDecompose(now, then, part).verdict, "consistent");
  assert.equal(simpsonDecompose(then, then, part).verdict, "no_change");
  assert.equal(simpsonReport(now, [], [{ id: "consensus", part }]).verdict, "collecting");
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/simpson"/); assert.match(w, /name: "get_simpson"/); assert.match(w, /"tools\/simpson"/);
  for (const f of ["tools/simpson.html", "de/tools/simpson.html", "en/tools/simpson.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=simpson/); assert.match(h, /share-x\.js/); assert.match(h, /Edward_H\._Simpson/); }
});

test("one radar against the total is not yet a paradox", () => {
  const then = [...H("a", "war", 6), ...H("a", "deal", 1), ...H("b", "war", 5), ...H("b", "deal", 5)];
  const now = [...H("a", "war", 5), ...H("a", "deal", 2), ...H("b", "war", 8), ...H("b", "deal", 2)];
  assert.notEqual(simpsonDecompose(now, then, part).verdict, "paradox");
});
