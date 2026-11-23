import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { TIME_MACHINE, TM_ERAS, timeMachineReport } from "../src/timemachine.js";
import { CRYSTAL_ZONES } from "../src/crystals.js";
test("every Time Machine card: era, zone, Wikipedia, idea in three languages, rule, bridge", () => {
  const ids = new Set();
  for (const c of TIME_MACHINE) {
    assert.ok(!ids.has(c.id), "duplicate " + c.id); ids.add(c.id);
    assert.ok(TM_ERAS[c.era], c.id); assert.ok(CRYSTAL_ZONES.includes(c.zone), c.id); assert.match(c.wiki, /^https:\/\/en\.wikipedia\.org\/wiki\/\S+$/);
    for (const l of ["en", "ru", "de"]) assert.ok(c.idea[l].length > 10, c.id + " " + l);
    assert.ok(c.rule.length > 15 && c.bridge.en.length > 10 && c.bridge.ru.length > 10, c.id);
  }
  assert.equal(timeMachineReport({ era: "1350-1600" }).cards.every((c) => c.era === "1350-1600"), true);
  assert.ok(timeMachineReport({ q: "Valla" }).count >= 1);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/timemachine"/); assert.match(w, /name: "get_time_machine"/); assert.match(w, /"tools\/timemachine"/);
  for (const f of ["tools/timemachine.html", "de/tools/timemachine.html", "en/tools/timemachine.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=timemachine/); assert.match(h, /id="valla"/); assert.match(h, /share-x\.js/); }
});
