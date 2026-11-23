import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { headlineNumbers, newcombReport, BENFORD } from "../src/newcomb.js";

test("numbers from headlines: years, times, dates, model names and ordinals are skipped", () => {
  assert.deepEqual(headlineNumbers("Bitcoin falls 5% to $91,200 as 2026 ends"), [5, 9]);
  assert.deepEqual(headlineNumbers("G7 meets at 12:30 on 23.11.2026; F-35 deal worth 8 bn"), [8]);
  assert.deepEqual(headlineNumbers("1st time: 3 000 Jobs weg, 0.7 % weniger"), [3, 7]);
  assert.deepEqual(headlineNumbers("Потери 1,5 млрд рублей, COVID-19 и 24/7"), [1]);
});
test("Benford-like digits fit closely; uniform digits do not; few numbers = collecting", () => {
  assert.equal(Math.round(BENFORD[0] * 1000), 301);
  const rows = []; let k = 0; const w = (n) => n.toString(36).replace(/\d/g, (c) => "qwertyuiop"[c]);
  for (let d = 1; d <= 9; d++) for (let i = 0; i < Math.round(BENFORD[d - 1] * 600); i++) rows.push({ radar: k % 2 ? "geo" : "crypto", headline: `Story ${w(k++)} costs ${d}${String(k % 100).padStart(2, "0")} euros` });
  const r = newcombReport(rows); assert.equal(r.verdict, "close"); assert.ok(r.numbers >= 590); assert.ok(r.radars.every((x) => x.fit === "close" || x.fit === "acceptable"));
  const u = []; for (let i = 0; i < 450; i++) u.push({ radar: "geo", headline: `Item ${w(i)} has ${(i % 9) + 1} parts` });
  assert.equal(newcombReport(u).verdict, "nonconforming");
  assert.equal(newcombReport(u.slice(0, 50)).verdict, "collecting");
  assert.match(newcombReport(u).caveat, /not proof/);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/newcomb"/); assert.match(w, /name: "get_newcomb"/); assert.match(w, /"tools\/newcomb"/);
  for (const f of ["tools/newcomb.html", "de/tools/newcomb.html", "en/tools/newcomb.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=newcomb/); assert.match(h, /share-x\.js/); assert.match(h, /Simon_Newcomb/); }
});
