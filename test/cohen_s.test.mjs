import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { loudWords, isQuakeHeadline, matchQuake, cohenStory, cohenReport } from "../src/cohen_s.js";

const now = Date.UTC(2026, 10, 24, 12), H = 3600e3;
const ev = [{ mag: 4.8, place: "30 km SSW of Sitka, Alaska", time: new Date(now - 5 * H).toISOString(), tsunami_flag: false }, { mag: 7.1, place: "Kamchatka, Russia", time: new Date(now - 6 * H).toISOString(), tsunami_flag: true }];
const row = (headline, n = 1) => ({ radar: "geo", headline, first_ts: now - 4 * H, n_first: 1, n_max: n });
test("words and quake detection", () => {
  assert.deepEqual(loudWords("Powerful earthquake shakes Alaska"), ["powerful"]); assert.deepEqual(loudWords("Quake near Sitka"), []);
  assert.ok(isQuakeHeadline("Erdbeben in Alaska")); assert.ok(isQuakeHeadline("Землетрясение на Камчатке")); assert.ok(!isQuakeHeadline("Parliament passes budget"));
});
test("matching by place", () => {
  assert.equal(matchQuake("Powerful earthquake shakes Alaska", ev, now - 4 * H).mag, 4.8); assert.equal(matchQuake("Earthquake strikes Kamchatka", ev).mag, 7.1); assert.equal(matchQuake("Earthquake in Chile", ev), null);
});
test("verdicts: loud for size, fits, quiet, no measurement; non-quake ignored", () => {
  assert.equal(cohenStory(row("Powerful earthquake shakes Alaska"), ev).verdict, "loud_for_size");
  assert.equal(cohenStory(row("Devastating earthquake hits Kamchatka"), ev).verdict, "size_fits");
  assert.equal(cohenStory(row("Quake near Sitka, Alaska"), ev).verdict, "quiet_for_size");
  assert.equal(cohenStory(row("Earthquake in Chile"), ev).verdict, "no_measurement");
  assert.equal(cohenStory(row("Parliament passes budget"), ev), null);
});
test("report: collecting, then share loud for size; unmeasured not counted as loud", () => {
  assert.equal(cohenReport([row("Powerful earthquake shakes Alaska")], ev, now).verdict, "collecting");
  const rows = [...Array(12)].map((_, i) => row(i < 6 ? "Powerful earthquake shakes Alaska" : "Quake near Sitka, Alaska")).concat([...Array(5)].map(() => row("Earthquake in Chile")));
  const r = cohenReport(rows, ev, now);
  assert.equal(r.measured, 12); assert.equal(r.unmeasured, 5); assert.equal(r.loud_for_size, 6); assert.equal(r.verdict, "often_loud_for_size");
  assert.equal(cohenReport(rows, [], now, null, false).verdict, "no_measurement_source"); assert.match(r.rule, /magnitude USGS recorded/);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/cohen-s"/); assert.match(w, /name: "get_cohen_s"/); assert.match(w, /tool: "get_cohen_s"/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_cohen_s/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /api\/v1\/cohen-s/);
});
