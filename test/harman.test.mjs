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
test("holes in the layers (Reason): which passport checks fired on challenged stories", async () => {
  const { layersReport } = await import("../src/harman.js");
  const L = [];
  for (let i = 0; i < 12; i++) L.push({ s: { headline: "h" + i, radar: "geo" }, hit: { headline: "denied " + i }, fired: i < 8 ? ["few_voices"] : [] });
  for (let i = 0; i < 40; i++) L.push({ s: { headline: "r" + i }, hit: null, fired: i < 4 ? ["few_voices"] : [] });
  const r = layersReport(L); assert.equal(r.verdict, "measured"); assert.equal(r.passed_all_layers, 4);
  const c = r.checks.find((x) => x.check === "few_voices"); assert.equal(c.fired_on_challenged_pct, 67); assert.equal(c.fired_on_rest_pct, 10);
  assert.equal(layersReport(L.slice(0, 5)).verdict, "collecting");
});
test("passport lists the checks that fired", async () => {
  const { newsPassport } = await import("../src/passport.js");
  const p = newsPassport({ headline: "Leaked memo: minister says 'price war' coming", confirm: 1 });
  for (const id of ["few_voices", "found_document", "metaphor", "not_event"]) assert.ok(p.fired.includes(id), id);
  assert.deepEqual(newsPassport({ headline: "Parliament passes budget of 400 billion euros", confirm: 5 }).fired, []);
});
test("cry wolf: alarm rate and whether warned stories are challenged more", async () => {
  const { cryWolfReport } = await import("../src/harman.js");
  const stored = []; for (let i = 0; i < 60; i++) stored.push({ fired: i < 48 ? "few_voices" : "" });
  const L = []; for (let i = 0; i < 12; i++) L.push({ hit: {}, fired: ["few_voices"] }); for (let i = 0; i < 40; i++) L.push({ hit: i < 2 ? {} : null, fired: i < 20 ? ["vague"] : [] });
  const r = cryWolfReport(stored, L); assert.equal(r.alarm_rate_pct, 80); assert.equal(r.crying_wolf, true); assert.equal(r.verdict, "warnings_informative");
  assert.equal(r.by_check_pct.few_voices, 80); assert.equal(cryWolfReport(stored.slice(0, 10), []).crying_wolf, false);
});

test("checks telemetry: groups, text-only by design, collecting", async () => {
  const { checksTelemetry } = await import("../src/harman.js");
  const mk = (fired, hit) => ({ fired: fired.split(",").filter(Boolean), hit: hit ? {} : null, s: {} });
  const L = []; const stored = [];
  for (let i = 0; i < 40; i++) { const f = i < 20 ? "few_voices" : i < 22 ? "found_document" : i < 30 ? "tone" : ""; const h = f === "few_voices" ? i < 30 : f === "found_document" ? true : i === 25; stored.push({ fired: f }); L.push(mk(f, h)); }
  const r = checksTelemetry(stored, L), by = Object.fromEntries(r.checks.map((c) => [c.check, c]));
  assert.equal(r.verdict, "measured"); assert.equal(by.few_voices.group, "workhorse"); assert.equal(by.tone.group, "text_only_by_design"); assert.equal(by.found_document.confidence_effect, "blocks_high");
  assert.equal(checksTelemetry(stored.slice(0, 5), L.slice(0, 5)).verdict, "collecting"); assert.ok(r.not_measured.length === 2);
});
