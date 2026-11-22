import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { searleHeadline, searleReport } from "../src/searle.js";

test("speech acts in three languages", () => {
  assert.equal(searleHeadline("Trump threatens 50% tariffs on EU goods").act, "threat");
  assert.equal(searleHeadline("Russia strikes Kyiv overnight, 3 killed").act, "event");
  assert.equal(searleHeadline("Zelensky urges allies to send more air defence").act, "demand");
  assert.equal(searleHeadline("EU plans new sanctions package").act, "promise");
  assert.equal(searleHeadline("Kremlin says talks with Kyiv stalled").act, "claim");
  assert.equal(searleHeadline("Merz kündigt Rentenreform an").act, "promise");
  assert.equal(searleHeadline("Китай пригрозил ответными мерами").act, "threat");
});
test("report: share not happened yet", () => {
  const r = searleReport([{ id: "geo", feed: [["1", "Trump threatens tariffs", "AP"], ["2", "Quake hits Peru", "BBC"]] }]);
  assert.equal(r.not_yet_happened_pct, 50); assert.equal(r.shares.event, 50); assert.equal(r.examples.threat[0].radar, "geo");
  assert.equal(searleReport([]).verdict, "no_data");
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/searle"/); assert.match(w, /name: "get_searle"/); assert.match(w, /speech_act: \(\(\) =>/); assert.match(w, /"tools\/searle"/);
  for (const f of ["tools/searle.html", "de/tools/searle.html", "en/tools/searle.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=searle/); assert.match(h, /share-x\.js/); assert.match(h, /John_Searle/); }
});
