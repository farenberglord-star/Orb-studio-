import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { errorProfile, pearsonReport } from "../src/pearson.js";

const a = (dir, result, prob = 60, extra = {}) => ({ who: "x", name: "X", kind: "agent", verified: 1, dir, result, prob, ...extra });
test("false alarms, misses and confident errors are counted apart", () => {
  const p = errorProfile([a("up", "down", 90), a("up", "down"), a("up", "down"), a("up", "up"), a("down", "down"), a("down", "up")]);
  assert.equal(p.false_alarms, 3); assert.equal(p.misses, 1); assert.equal(p.confident_errors, 1);
  assert.equal(p.false_alarm_rate_pct, 75); assert.equal(p.miss_rate_pct, 50); assert.equal(p.lean, "raises_false_alarms"); assert.equal(p.says_up_pct, 67);
});
test("report: collecting with few answers; groups and per-agent lists", () => {
  const r = pearsonReport([a("up", "down"), a("up", "up", 70, { verified: 0 })]);
  assert.equal(r.verdict, "collecting"); assert.equal(r.groups.ai_unverified.answers, 1); assert.match(r.rule, /cries wolf/);
  const many = []; for (let i = 0; i < 24; i++) many.push(a(i % 2 ? "down" : "up", i % 3 ? "up" : "down", 60, { who: "w" + (i % 3), name: "W" + (i % 3) }));
  const s = pearsonReport(many); assert.notEqual(s.verdict, "collecting"); assert.ok(s.agents.length >= 1);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/pearson"/); assert.match(w, /name: "get_pearson"/); assert.match(w, /"tools\/pearson"/);
  for (const f of ["tools/pearson.html", "de/tools/pearson.html", "en/tools/pearson.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=pearson/); assert.match(h, /share-x\.js/); assert.match(h, /Egon_Pearson/); }
});
