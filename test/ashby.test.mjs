import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { ashbyLines, ashbyReport } from "../src/ashby.js";

const t0 = Date.UTC(2026, 10, 25, 8);
test("lines: state lines are ignored, null stays null", () => {
  assert.deepEqual(ashbyLines("few_voices"), []); assert.deepEqual(ashbyLines("few_voices,stale"), []);
  assert.deepEqual(ashbyLines("few_voices,quoted,poll"), ["quoted", "poll"]); assert.deepEqual(ashbyLines(""), []); assert.equal(ashbyLines(null), null);
});
test("report: collecting, then verdict, per radar and per day", () => {
  const row = (radar, fired, i) => ({ radar, headline: "h" + i, first_ts: t0 + i * 6e4, fired });
  assert.equal(ashbyReport([row("geo", "", 0)]).verdict, "collecting");
  const rows = [...Array(40)].map((_, i) => row(i % 2 ? "crypto" : "geo", i < 30 ? "few_voices" : "few_voices,poll", i)).concat([row("geo", null, 99)]);
  const r = ashbyReport(rows);
  assert.equal(r.stories, 40); assert.equal(r.silent, 30); assert.equal(r.silent_pct, 75); assert.equal(r.verdict, "passport_silent_on_most");
  assert.equal(r.lines[0].line, "poll"); assert.equal(r.lines[0].stories, 10); assert.equal(r.radars.length, 2); assert.equal(r.by_day[0].stories, 40);
  assert.equal(r.silent_examples.length, 8); assert.match(r.rule, /not that the story was checked/);
  assert.equal(ashbyReport(rows.slice(0, 40).map((x, i) => ({ ...x, fired: i < 10 ? "" : "quoted" }))).verdict, "passport_speaks_on_most");
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/ashby"/); assert.match(w, /name: "get_ashby"/); assert.match(w, /tool: "get_ashby"/); assert.match(w, /name === "get_ashby"/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_ashby/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /api\/v1\/ashby/);
});
