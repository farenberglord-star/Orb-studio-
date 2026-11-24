import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { levelVs30d, PARDUCCI_MIN_POINTS } from "../src/parducci.js";

test("percentile of the latest level among the month (Parducci)", () => {
  const rows = []; for (let i = 0; i < 400; i++) rows.push({ ts: i, k: i % 100, g: i < 390 ? null : 50 });
  rows[rows.length - 1].k = 95;
  const r = levelVs30d(rows, [["crypto", "k"], ["geo", "g"], ["web", "w"]]);
  assert.equal(r.crypto.verdict, "measured"); assert.ok(r.crypto.percentile_30d >= 94); assert.equal(r.crypto.reads_as, "top_10pct_of_month");
  assert.equal(r.geo.verdict, "collecting"); assert.equal(r.geo.points, 10); assert.equal(r.web.verdict, "no_history");
  assert.ok(PARDUCCI_MIN_POINTS > 100);
});
test("wired into /api/v1/radars", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /level_vs_30d/); assert.match(w, /levelVs30d/);
});
