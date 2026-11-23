import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { methodReport, METHOD_LAYERS, METHOD_ZONES } from "../src/method.js";
test("three layers, eight blind spots, live passports pass through", () => {
  assert.deepEqual(METHOD_LAYERS.map((l) => l.layer), [1, 2, 3]); assert.equal(METHOD_ZONES.length, 8);
  assert.ok(METHOD_LAYERS.every((l) => l.rules.length >= 5 && l.output && l.question));
  const r = methodReport([{ what: "h", status: "statement" }]); assert.equal(r.live_passports.length, 1); assert.match(r.conflicts, /more cautious one wins/);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/method"/); assert.match(w, /name: "get_method"/); assert.match(w, /"tools\/method"/);
  for (const f of ["tools/method.html", "de/tools/method.html", "en/tools/method.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=method/); assert.match(h, /fetch\("\/api\/v1\/method"/); assert.match(h, /<ol>/); }
});
