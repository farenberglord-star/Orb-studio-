import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { simmelSlots, simmelReport } from "../src/simmel.js";

const t0 = Date.UTC(2026, 10, 25, 0), H = 18e5;
const mk = (n, moveFn) => { let v = 50; return [...Array(n)].map((_, i) => { v += moveFn(i); return { ts: t0 + i * H, g: v, k: v, b: v, p: v, e: v, n: v, j: v, w: v }; }); };
test("slots: flow counted per step, gaps and early steps skipped", () => {
  const ix = mk(3, () => 2), st = [t0 + 1, t0 + H - 1, t0 + H + 5];
  const s = simmelSlots(ix, st, null); assert.equal(s.length, 2); assert.equal(s[0].flow, 2); assert.equal(s[1].flow, 1); assert.equal(s[0].move, 2);
  assert.equal(simmelSlots([ix[0], { ...ix[2], ts: t0 + 5 * H }], st, null).length, 0);
  assert.equal(simmelSlots(ix, st, t0 + H).length, 1);
});
test("report: dulled when busy steps move less; collecting when short", () => {
  const n = 200, ix = mk(n, (i) => (i % 10 === 0 ? 0.5 : 2)), st = [];
  for (let i = 1; i < n; i++) { const c = i % 10 === 0 ? 20 : 1; for (let k = 0; k < c; k++) st.push(t0 + (i - 1) * H + 1 + k); }
  const r = simmelReport(ix, st); assert.equal(r.verdict, "dulled_under_flow"); assert.ok(r.ratio < 0.8); assert.ok(r.high_flow_slots >= 8);
  assert.equal(simmelReport(ix.slice(0, 20), st).verdict, "collecting"); assert.equal(simmelReport([], []).verdict, "collecting");
  const r2 = simmelReport(mk(n, () => 2), st); assert.equal(r2.verdict, "same_under_flow");
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/simmel"/); assert.match(w, /name: "get_simmel"/); assert.match(w, /tool: "get_simmel"/); assert.match(w, /name === "get_simmel"/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_simmel/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /api\/v1\/simmel/);
});
