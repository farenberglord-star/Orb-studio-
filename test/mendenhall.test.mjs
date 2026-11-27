import test from "node:test";
import assert from "node:assert/strict";
import { wordLengths, curveDistance, mendenhallReport } from "../src/mendenhall.js";

test("mendenhall: word lengths are counted and capped at 15", () => {
  const w = wordLengths("Ein Haus am See Verfassungsgerichtsentscheidung");
  assert.equal(w.words, 5); assert.equal(w.counts[2], 2); assert.equal(w.counts[14], 1);
});
test("mendenhall: distance is 0 for equal curves and 2 for disjoint", () => {
  const a = new Array(15).fill(0); a[2] = 1; const b = new Array(15).fill(0); b[9] = 1;
  assert.equal(curveDistance(a, a), 0); assert.equal(curveDistance(a, b), 2); assert.equal(curveDistance(null, b), null);
});
test("mendenhall: an outlet whose last day reads unlike its own other days gets a ratio above 1", () => {
  const now = Date.UTC(2026, 10, 27, 12), rows = [];
  const short = "Der Hund lief um die Ecke", long = "Bundesregierung verschärft Sicherheitsmaßnahmen umfassend";
  for (const o of ["a.de", "b.de", "c.de", "d.de"]) for (let d = 0; d < 7; d++) for (let i = 0; i < 30; i++)
    rows.push({ source: o, headline: (o === "a.de" && d === 0 ? long : short) + (i % (d + 2) ? "" : " heute morgen"), first_ts: now - d * 864e5 - (i + 1) * 60e3 });
  const r = mendenhallReport(rows, now);
  assert.equal(r.verdict, "measured"); assert.equal(r.most_unlike_its_usual[0].outlet, "a.de");
  assert.ok(r.most_unlike_its_usual[0].distance > 0.5);
});
test("mendenhall: collecting with little data", () => {
  assert.equal(mendenhallReport([{ source: "x", headline: "Eins zwei drei", first_ts: Date.now() - 1000 }]).verdict, "collecting");
});
test("mendenhall: wired into worker, llms.txt and agent.json", async () => {
  const { readFileSync } = await import("node:fs");
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /name: "get_mendenhall"/); assert.match(w, /tool: "get_mendenhall"/); assert.match(w, /name === "get_mendenhall"/); assert.match(w, /p === "\/api\/v1\/mendenhall"/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_mendenhall/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /api\/v1\/mendenhall/);
});
