import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { hourlyFromPoints, strompreisModel, strompreisHtml } from "../src/strompreis.js";

// 24.11.2026 15:00 Berlin (UTC+1); завтра — 25.11, сутки по Берлину начинаются в 23:00 UTC
const NOW = Date.parse("2026-11-24T14:00:00Z");
const hoursOf = (startIso, prices) => prices.map((p, i) => ({ t: new Date(Date.parse(startIso) + i * 3600e3).toISOString(), eur_mwh: p }));
const TOM = [210, 205, 200, 150, 140, 145, 230, 260, 280, 270, 250, 240, 230, 225, 235, 260, 330, 360, 355, 300, 270, 250, 230, 220];
const power = (hourly) => ({ now_eur_mwh: 240, now_at: "2026-11-24T14:00:00.000Z", today: { avg_eur_mwh: 240, min_eur_mwh: 180, max_eur_mwh: 331, negative_quarter_hours: 0 },
  tomorrow: { avg_eur_mwh: 252, min_eur_mwh: 140, max_eur_mwh: 360, negative_quarter_hours: 0 }, tomorrow_published: true, renewables: { renewable_share_pct: 32 }, hourly });

test("hourly means from quarter hours, grouped by hour and limited to the asked Berlin days", () => {
  const t0 = Date.parse("2026-11-24T23:00:00Z"); // 00:00 Berlin 25.11
  const pts = [0, 1, 2, 3].map((i) => ({ t: t0 + i * 900e3, p: 100 + i * 10 })).concat([{ t: t0 - 900e3, p: 999 }]);
  assert.deepEqual(hourlyFromPoints(pts, ["2026-11-25"]), [{ t: "2026-11-24T23:00:00.000Z", eur_mwh: 115 }]);
});

test("tomorrow: cheapest and dearest 3-hour windows, change against today", () => {
  const m = strompreisModel(power(hoursOf("2026-11-24T23:00:00Z", TOM)), NOW);
  assert.equal(m.mode, "tomorrow"); assert.equal(m.day, "2026-11-25"); assert.equal(m.hours.length, 24);
  assert.equal(m.cheap.from, "2026-11-25T02:00:00.000Z"); assert.equal(m.cheap.avg_eur_mwh, 145); // 03–06 Uhr Berlin
  assert.equal(m.dear.from, "2026-11-25T15:00:00.000Z"); assert.equal(m.dear.avg_eur_mwh, 348.33); // 16–19 Uhr Berlin
  assert.equal(m.vs_today_pct, 5);
});

test("before publication the page shows today and says when tomorrow comes", () => {
  const m = strompreisModel({ ...power(hoursOf("2026-11-23T23:00:00Z", TOM)), tomorrow: null, tomorrow_published: false }, NOW);
  assert.equal(m.mode, "today");
  assert.ok(Date.parse(m.cheap.from) >= Date.parse("2026-11-24T14:00:00Z"), "today: windows only from the remaining hours");
  assert.match(strompreisHtml(m), /gegen 13 Uhr/);
  assert.equal(strompreisModel(null), null);
  assert.match(strompreisHtml(null), /nicht erreichbar/);
});

test("page: German only, numbers in ct/kWh, windows in Berlin time, valid JSON-LD with FAQ", () => {
  const h = strompreisHtml(strompreisModel(power(hoursOf("2026-11-24T23:00:00Z", TOM)), NOW), "https://orbstudio.org", new Date(NOW));
  assert.ok(!/[Ѐ-ӿ]/.test(h), "no Cyrillic");
  assert.match(h, /<html lang="de">/); assert.match(h, /<link rel="canonical" href="https:\/\/orbstudio.org\/de\/strompreis-morgen">/);
  assert.match(h, /03:00–06:00/); assert.match(h, /14,5 ct\/kWh/); assert.match(h, /16:00–19:00/);
  assert.match(h, /\+5 % gegenüber heute/); assert.match(h, /Mittwoch, 25\. November 2026/);
  assert.equal((h.match(/<tr class="good">/g) || []).length, 3);
  const ld = JSON.parse(/<script type="application\/ld\+json">(.*?)<\/script>/s.exec(h)[1]);
  assert.equal(ld["@graph"][1]["@type"], "FAQPage"); assert.ok(ld["@graph"][1].mainEntity.length >= 4);
  assert.match(h, /ohne Netzentgelte, Steuern, Umlagen/, "says it is not the household price");
});

test("worker serves the page, sensor carries hourly prices, sitemap and llms.txt point to it", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /hourly: hourlyFromPoints\(pts, \[today, tomorrow\]\)/);
  assert.match(w, /strompreisHtml\(strompreisModel\(pw\), url\.origin\)/);
  assert.ok(readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8").includes("<loc>https://orbstudio.org/de/strompreis-morgen</loc>"));
  assert.ok(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8").includes("https://orbstudio.org/de/strompreis-morgen"));
});
