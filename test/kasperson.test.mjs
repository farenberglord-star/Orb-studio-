import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { kaspersonStory, kaspersonReport } from "../src/kasperson.js";

const H = 3600e3, now = Date.UTC(2026, 10, 23, 12);
const row = (radar, headline, a, b) => ({ radar, headline, source: "X", first_ts: now - 10 * H, last_ts: now - 2 * H, n_first: a, n_max: b });
test("a story from 1 outlet to 6 is amplified; 2 to 3 is not", () => {
  const s = kaspersonStory(row("geo", "Trump threatens tariffs on EU cars", 1, 6));
  assert.equal(s.factor, 6); assert.equal(s.amplified, true); assert.equal(s.speech_act, "threat"); assert.equal(s.hours_on_radar, 8);
  assert.equal(kaspersonStory(row("geo", "x", 2, 3)).amplified, false); assert.equal(kaspersonStory(row("geo", "x", 1, 1)).grew, false);
});
test("report: collecting with few stories, shares by radar and speech act", () => {
  assert.equal(kaspersonReport([row("geo", "a", 1, 4)], now).verdict, "collecting");
  const rows = [...Array(40)].map((_, i) => row(i % 2 ? "crypto" : "geo", i < 5 ? "Iran threatens to close Hormuz" : "Parliament passes budget", 1, i < 5 ? 5 : 1));
  const r = kaspersonReport(rows, now);
  assert.equal(r.stories, 40); assert.equal(r.amplified, 5); assert.equal(r.verdict, "much_amplification");
  assert.equal(r.by_speech_act.find((a) => a.act === "threat").amplified_pct, 100); assert.equal(r.most_amplified[0].factor, 5);
  assert.match(r.rule, /does not mean more facts/);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/kasperson"/); assert.match(w, /name: "get_kasperson"/); assert.match(w, /"tools\/kasperson"/);
  for (const f of ["tools/kasperson.html", "de/tools/kasperson.html", "en/tools/kasperson.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=kasperson/); assert.match(h, /share-x\.js/); assert.match(h, /Roger_Kasperson/); }
});
