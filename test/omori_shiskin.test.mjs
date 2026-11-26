import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { omoriSequences, omoriReport, kmBetween, gutenbergRichter } from "../src/omori.js";
import { shiskinReport } from "../src/shiskin.js";

const D = 864e5, H = 3600e3, now = Date.UTC(2026, 10, 26, 12);
test("omori: smaller quakes within 100 km after an M6+ are aftershocks; decay checked on the past", () => {
  assert.ok(kmBetween({ lat: 0, lon: 0 }, { lat: 0, lon: 1 }) > 100);
  const main = { mag: 6.8, place: "50 km S of Testville, Japan", time: new Date(now - 20 * D).toISOString(), lat: 35, lon: 140 };
  const ev = [main];
  for (let i = 0; i < 12; i++) ev.push({ mag: 4.0, place: "near Testville, Japan", time: new Date(now - 20 * D + (i + 1) * 1.5 * H).toISOString(), lat: 35.1, lon: 140.1 }); // сутки 1
  for (let i = 0; i < 12; i++) ev.push({ mag: 3.5, place: "near Testville, Japan", time: new Date(now - 19 * D + (i + 1) * 18 * H).toISOString(), lat: 35.2, lon: 140.2 }); // сутки 2–10
  ev.push({ mag: 5.0, place: "far away, Chile", time: new Date(now - 10 * D).toISOString(), lat: -30, lon: -70 });
  const s = omoriSequences(ev, now);
  assert.equal(s.length, 1); assert.equal(s[0].aftershocks, 24); assert.equal(s[0].decay, "omori_like");
  const r = omoriReport([{ radar: "geo", headline: "Strong earthquake hits Testville, Japan", first_ts: now - 12 * D }], ev, now);
  assert.equal(r.aftershock_headlines, 1); assert.equal(r.examples[0].verdict, "aftershock");
  assert.equal(omoriReport([], [], now, false).verdict, "no_measurement_source");
});

test("shiskin: silence is suspicious only in hours when the outlet usually publishes", () => {
  const rows = [];
  for (let d = 1; d <= 14; d++) for (let h = 1; h <= 6; h++) rows.push({ source: "busy.com", first_ts: now - d * D - h * H + 600e3 }); // каждый день в эти 6 часов
  for (let d = 1; d <= 14; d++) for (let h = 1; h <= 3; h++) rows.push({ source: "night.com", first_ts: now - d * D + 12 * H - h * H }); // публикует в другие часы
  const r = shiskinReport(rows, now);
  const busy = r.outlets.find((x) => x.outlet === "busy.com"), night = r.outlets.find((x) => x.outlet === "night.com");
  assert.equal(busy.state, "suspicious_silence"); assert.equal(night.state, "usual_quiet_hour"); assert.equal(r.verdict, "suspicious_silence");
  assert.equal(shiskinReport(rows.slice(0, 10), now).verdict, "collecting");
});

test("omori and shiskin wired into worker, llms.txt and agent.json", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  for (const n of ["omori", "shiskin"]) { assert.match(w, new RegExp(`name: "get_${n}"`)); assert.match(w, new RegExp(`tool: "get_${n}"`)); assert.match(w, new RegExp(`name === "get_${n}"`)); assert.match(w, new RegExp(`p === "/api/v1/${n}"`)); }
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_omori[\s\S]*get_shiskin|get_shiskin[\s\S]*get_omori/);
  const a = readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"); assert.match(a, /api\/v1\/omori/); assert.match(a, /api\/v1\/shiskin/);
});

test("omori: Gutenberg-Richter b near 1 on a synthetic catalogue; Båth gap per sequence", () => {
  const ev = []; let k = 0;
  for (let m = 4.5; m < 7.5; m += 0.1) { const n = Math.round(1000 * Math.pow(10, -(m - 4.5))); for (let i = 0; i < n; i++) ev.push({ mag: Math.round(m * 10) / 10, place: "x", time: new Date(now - ((k++ % 29) + 0.5) * D).toISOString(), lat: 0, lon: 0 }); }
  const g = gutenbergRichter(ev, now);
  assert.ok(g.b_value > 0.85 && g.b_value < 1.15, String(g.b_value));
  const main = { mag: 6.5, place: "A", time: new Date(now - 5 * D).toISOString(), lat: 10, lon: 10 };
  const s = omoriSequences([main, { mag: 6.3, place: "A", time: new Date(now - 4 * D).toISOString(), lat: 10.1, lon: 10.1 }], now);
  assert.equal(s[0].bath, "unusually_large_aftershock");
});
