import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { bairdReport, bairdTime, BAIRD_ITEMS } from "../src/baird.js";

const real = JSON.parse(readFileSync(new URL("./fixtures/sensors-2026-11-22.json", import.meta.url), "utf8"));
const at = Date.parse(real.updated);

test("real sensors of 22.11.2026: every number has a passport and the routes agree", () => {
  const r = bairdReport(real, at);
  assert.equal(r.total, BAIRD_ITEMS.length);
  for (const x of r.numbers) { assert.ok(x.source, x.id + " source"); assert.ok(x.measured_at, x.id + " time"); assert.notEqual(x.status, "fail", x.id); }
  for (const c of r.cross_checks) assert.equal(c.status, "agree", c.id + " " + c.diff_pct);
});
test("time formats", () => {
  assert.equal(new Date(bairdTime("2026-10")).toISOString().slice(0, 10), "2026-10-31");
  assert.equal(new Date(bairdTime("20-Nov-2026")).getUTCDate(), 20);
  assert.equal(bairdTime(""), null);
});
test("unit error, stale value and broken route are caught", () => {
  const d = structuredClone(real);
  d.power.now_ct_kwh = d.power.now_eur_mwh; // ct перепутали с EUR/MWh
  d.ecb.eurusd.value = 109.9; // курс в сотнях
  const r = bairdReport(d, at + 3 * 3600e3);
  assert.equal(r.verdict, "broken_chain");
  assert.equal(r.cross_checks.find((c) => c.id === "power_unit_conversion").status, "disagree");
  assert.ok(r.numbers.find((x) => x.id === "ecb_eurusd").problems.includes("out_of_range"));
  assert.ok(r.numbers.find((x) => x.id === "btc_fee_fast").problems.includes("stale"));
  assert.equal(bairdReport(null).verdict, "no_data");
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/baird"/); assert.match(w, /name: "get_baird"/); assert.match(w, /name === "get_baird"/); assert.match(w, /"tools\/baird"/); assert.match(w, /"leamer", "baird"/);
  for (const f of ["tools/baird.html", "de/tools/baird.html", "en/tools/baird.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=baird/); assert.match(h, /\/go\/starlink\?from=baird/); assert.match(h, /share-x\.js/); assert.match(h, /Kenneth_M\._Baird/); }
  for (const f of ["sitemap.xml", "llms.txt", ".well-known/agent.json", "share-x.js", "tools.html", "de/tools.html", "en/tools.html"]) assert.match(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), /baird/);
});
