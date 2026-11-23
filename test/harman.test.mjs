import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { sameStory, harmanReport, CORRECTION_RE } from "../src/harman.js";

const H = 3600e3, now = Date.UTC(2026, 11, 10);
test("correction words and same-story matching", () => {
  assert.ok(CORRECTION_RE.test("Ministry denies report of bank collapse")); assert.ok(CORRECTION_RE.test("Regierung korrigiert Zahlen")); assert.ok(CORRECTION_RE.test("Минфин опроверг сообщения"));
  assert.ok(sameStory("Bank collapse reported in Cyprus after deposit freeze", "Cyprus central bank denies collapse, deposit freeze untrue"));
  assert.equal(sameStory("Bank collapse reported in Cyprus", "Football final postponed in Madrid"), false);
});
test("calibrated vs overconfident; collecting with few stories", () => {
  const rows = []; let k = 0;
  const add = (conf, challenged) => { const t = now - 100 * H - k * 60e3, h = `Storyword${k} alpha${k} beta${k} gamma${k} unique headline`; rows.push({ k: "s" + k, radar: "geo", headline: h, first_ts: t, conf, n_max: 1 }); if (challenged) rows.push({ k: "c" + k, radar: "geo", headline: `Officials deny Storyword${k} alpha${k} beta${k}`, first_ts: t + 5 * H }); k++; };
  for (let i = 0; i < 25; i++) add("high", i < 2); for (let i = 0; i < 25; i++) add("low", i < 10);
  const r = harmanReport(rows, now); assert.equal(r.verdict, "calibrated"); assert.equal(r.levels[0].challenged, 2); assert.equal(r.levels[2].challenged, 10);
  const rows2 = []; k = 0; const add2 = (conf, ch) => { const t = now - 100 * H - k * 60e3, h = `Storyword${k} alpha${k} beta${k} gamma${k} unique headline`; rows2.push({ k: "s" + k, headline: h, first_ts: t, conf }); if (ch) rows2.push({ k: "c" + k, headline: `Officials deny Storyword${k} alpha${k} beta${k}`, first_ts: t + H }); k++; };
  for (let i = 0; i < 25; i++) add2("high", i < 10); for (let i = 0; i < 25; i++) add2("low", i < 2);
  assert.equal(harmanReport(rows2, now).verdict, "overconfident");
  assert.equal(harmanReport(rows.slice(0, 5), now).verdict, "collecting");
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/harman"/); assert.match(w, /name: "get_harman"/); assert.match(w, /"tools\/harman"/); assert.match(w, /conf TEXT/);
  for (const f of ["tools/harman.html", "de/tools/harman.html", "en/tools/harman.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=harman/); assert.match(h, /share-x\.js/); assert.match(h, /Gilbert_Harman/); }
});
