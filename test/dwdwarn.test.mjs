import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseDwd, summarizeDwd } from "../src/dwdwarn.js";

const now = Date.UTC(2026, 10, 25, 9), H = 36e5;
const w = (o) => ({ state: "Hamburg", stateShort: "HH", regionName: "Stadt Hamburg", level: 2, event: "WINDBÖEN", headline: "Amtliche WARNUNG vor WINDBÖEN", start: now - H, end: now + H, ...o });
const doc = { time: now, warnings: { "102000000": [w({}), w({ level: 3, event: "ORKANBÖEN", headline: "Amtliche UNWETTERWARNUNG" })], "108111000": [w({ state: "Baden-Württemberg", stateShort: "BW", regionName: "Stuttgart", level: 4, event: "STURM", end: now + 2 * H })], "109": [w({ end: now - 1 }), w({ start: now + H })], "x": [null, { level: "?" }] }, copyright: "Copyright Deutscher Wetterdienst" };
test("parse: plain JSON and JSONP wrapper, garbage rejected", () => {
  assert.equal(parseDwd(JSON.stringify(doc)).ok, true);
  const p = parseDwd("warnWetter.loadWarnings(" + JSON.stringify(doc) + ");"); assert.equal(p.ok, true); assert.equal(p.items.length, 5);
  assert.equal(parseDwd("<html>").ok, false); assert.equal(parseDwd("").ok, false); assert.equal(parseDwd('{"warnings":[]}').ok, false);
});
test("summary: only active warnings, levels, states, severe groups", () => {
  const s = summarizeDwd(parseDwd(JSON.stringify(doc)), now);
  assert.equal(s.active_warnings, 3); assert.equal(s.regions_with_warning, 2);
  assert.deepEqual(s.levels.map((l) => [l.level, l.warnings]), [[4, 1], [3, 1], [2, 1]]);
  assert.equal(s.by_state[0].state, "Baden-Württemberg"); assert.equal(s.by_state[0].max_level, 4);
  assert.equal(s.severe_level3_plus[0].event, "STURM"); assert.equal(s.severe_level3_plus.length, 2);
  const h = summarizeDwd(parseDwd(JSON.stringify(doc)), now, "hh"); assert.equal(h.active_warnings, 2); assert.equal(h.state_filter, "hh");
  assert.equal(summarizeDwd({ ok: false }).ok, false);
});
test("wiring", () => {
  const src = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(src, /\/api\/v1\/weather\/warnings-de/); assert.match(src, /name: "get_dwd_warnings"/); assert.match(src, /name === "get_dwd_warnings"/); assert.match(src, /tool: "get_dwd_warnings"/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_dwd_warnings/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /warnings-de/);
});
