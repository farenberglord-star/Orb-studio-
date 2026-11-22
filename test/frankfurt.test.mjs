import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { frankfurtHeadline, frankfurtReport } from "../src/frankfurt.js";

test("headline classes in three languages", () => {
  assert.equal(frankfurtHeadline("Experts say a shocking truth could change everything").class, "nothing_to_check");
  assert.equal(frankfurtHeadline("Fed holds rates at 4.5% on Wednesday").class, "checkable");
  assert.equal(frankfurtHeadline("Nearly 40 Ukrainian drones taken down over Russian regions during day").class, "checkable");
  assert.equal(frankfurtHeadline("Якобы эксперты предупреждают о кризисе").class, "nothing_to_check");
  assert.equal(frankfurtHeadline("Something is happening").class, "thin");
  assert.equal(frankfurtHeadline("Pentagon says Russia could test a missile on Monday").class, "hedged");
});
test("report shares per radar", () => {
  const r = frankfurtReport([{ id: "geo", feed: [["1", "Fed holds rates at 4.5% on Wednesday", "AP"], ["2", "Experts say a shocking truth could change everything", "X"]] }]);
  assert.equal(r.headlines, 2); assert.equal(r.shares.nothing_to_check, 50); assert.equal(r.verdict, "much_unverifiable");
  assert.equal(r.examples.nothing_to_check[0].radar, "geo"); assert.equal(frankfurtReport([]).verdict, "no_data");
});
test("wiring and crystals needs", async () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/frankfurt"/); assert.match(w, /name: "get_frankfurt"/); assert.match(w, /checkability: \(\(\) =>/); assert.match(w, /"tools\/frankfurt"/);
  for (const f of ["tools/frankfurt.html", "de/tools/frankfurt.html", "en/tools/frankfurt.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=frankfurt/); assert.match(h, /share-x\.js/); assert.match(h, /Harry_Frankfurt/); }
  const { CRYSTALS } = await import("../src/crystals.js");
  assert.ok(!CRYSTALS.some((c) => c.id === "frankfurt"));
  for (const c of CRYSTALS) assert.ok(["ready", "needs_history", "needs_source", "covered", "blocked_analog", "blocked_rule", "needs_idea"].includes(c.needs.code), c.id);
  assert.equal(CRYSTALS.find((c) => c.id === "minker").needs.not_before, "2026-12-13");
});
