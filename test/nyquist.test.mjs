import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { nyquistReport } from "../src/nyquist.js";

test("nyquist: a radar that changes on most records is undersampled, a slow one is not", () => {
  const now = Date.UTC(2026, 10, 26, 12), rows = [];
  for (let i = 0; i < 200; i++) rows.push({ ts: now - (200 - i) * 1800e3, g: 50 + (i % 2) * 6, k: 40 + Math.floor(i / 8) });
  const r = nyquistReport(rows, [["geo", "g"], ["crypto", "k"], ["web", "w"]], now);
  assert.equal(r.radars.geo.verdict, "undersampled"); assert.ok(r.radars.geo.back_and_forth_per_day > 10);
  assert.equal(r.radars.crypto.verdict, "sampled_enough"); assert.equal(r.radars.web.verdict, "collecting");
  assert.equal(r.verdict, "some_radars_undersampled");
});

test("nyquist wired into worker, llms.txt, agent.json and the portal", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /name: "get_nyquist"/); assert.match(w, /tool: "get_nyquist"/); assert.match(w, /name === "get_nyquist"/); assert.match(w, /p === "\/api\/v1\/nyquist"/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_nyquist/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /api\/v1\/nyquist/);
  assert.match(readFileSync(new URL("../public/tools/scientists.html", import.meta.url), "utf8"), /get_nyquist/);
});
