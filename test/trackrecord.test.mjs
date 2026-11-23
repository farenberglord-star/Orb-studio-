import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { trackSamples, trackStats, trackReport, wilson, priceAt, radarAt } from "../src/trackrecord.js";

const H = 3600e3, D = 864e5, now = Date.UTC(2026, 10, 23, 9, 0);
// радар каждые 30 минут: в чётные дни падает на 3 пункта, в нечётные растёт на 3; цена идёт против радара
function world(days, against = true) {
  const rows = [], candles = [], start = now - days * D;
  let v = 60;
  for (let t = start; t <= now; t += 30 * 60e3) { const d = Math.floor((t - start) / D); v = 60 + (d % 2 ? 3 : 0); rows.push({ ts: t, v }); }
  for (let t = start - D; t <= now; t += H) { const d = Math.floor((t - start + 12 * H) / D); const up = d % 2 ? -1 : 1; candles.push([t, 100 + (against ? up : -up)]); }
  return { rows, candles };
}
test("helpers", () => {
  assert.equal(radarAt([{ ts: 0, v: 1 }, { ts: 30 * 60e3, v: 2 }], 20 * 60e3), 2);
  assert.equal(radarAt([{ ts: 0, v: 1 }], 2 * H), null);
  assert.equal(priceAt([[0, 10], [H, 11], [2 * H, 12]], 2 * H), 11); // свеча 2ч ещё не закрылась
  const [lo, hi] = wilson(5, 10); assert.ok(lo < 0.5 && hi > 0.5);
  assert.equal(wilson(0, 0), null);
});
test("samples do not overlap and need history on both sides", () => {
  const { rows, candles } = world(20), s = trackSamples(rows, candles, { now, hourUtc: 12 });
  assert.ok(s.length >= 17 && s.length <= 20);
  for (let i = 1; i < s.length; i++) assert.equal(Date.parse(s[i].at) - Date.parse(s[i - 1].at), D);
  assert.ok(s.every((x) => Math.abs(x.radar_change) === 3));
});
test("against vs with", () => {
  const mk = (n, sign) => Array.from({ length: n }, (_, i) => { const dr = i % 2 ? 3 : -3; return { radar_change: dr, next_day_pct: sign * -Math.sign(dr) * 1.5 }; });
  const sa = trackStats(mk(20, 1)), b3 = sa.buckets.find((b) => b.bucket === "3-5");
  assert.equal(b3.with_radar, 0); assert.equal(b3.against_radar, 20); assert.equal(b3.verdict, "price_moved_against_radar_more_often");
  assert.equal(b3.mean_next_day_pct_when_radar_fell, 1.5); assert.equal(b3.mean_next_day_pct_when_radar_rose, -1.5);
  assert.equal(trackStats(mk(20, -1)).buckets.find((b) => b.bucket === "3-5").verdict, "price_moved_with_radar_more_often");
  assert.equal(sa.buckets.find((b) => b.bucket === "6+").verdict, "too_few_days");
  const mixed = [...mk(6, 1), ...mk(6, -1)]; assert.equal(trackStats(mixed).buckets.find((b) => b.bucket === "3-5").verdict, "no_clear_link");
});
test("few days: no conclusion, collecting", () => {
  const { rows, candles } = world(5), r = trackReport(rows, { BTC: candles, ETH: candles }, { now });
  assert.equal(r.verdict, "collecting"); assert.equal(r.coins.BTC.buckets.find((b) => b.bucket === "3-5").verdict, "too_few_days");
  assert.match(r.rule, /not a forecast and not a trading signal/); assert.equal(r.radar_now.change, rows[rows.length - 1].v - radarAt(rows, rows[rows.length - 1].ts - D));
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/trackrecord"/); assert.match(w, /name: "get_trackrecord"/); assert.match(w, /"tools\/trackrecord"/); assert.match(w, /"simpson", "trackrecord", "kasperson", "method", "timemachine"\]/);
  for (const f of ["tools/trackrecord.html", "de/tools/trackrecord.html", "en/tools/trackrecord.html"]) {
    const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8");
    assert.match(h, /\/go\/kraken\?from=trackrecord/); assert.match(h, /\/go\/starlink\?from=trackrecord/); assert.match(h, /share-x\.js/); assert.match(h, /fetch\("\/api\/v1\/trackrecord"/); assert.match(h, /page:"trackrecord"/);
  }
  const sm = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  for (const pre of ["", "/de", "/en"]) assert.ok(sm.includes("<loc>https://orbstudio.org" + pre + "/tools/trackrecord</loc>"));
});
test("radar noise (Griliches bridge): typical daily move, flicker that comes back", async () => {
  const { radarNoise } = await import("../src/trackrecord.js");
  const now = Date.UTC(2026, 10, 23, 12), rows = [];
  for (let i = 0; i < 400; i++) rows.push({ ts: now - (400 - i) * 30 * 60e3, v: 65 + (i % 48 < 24 ? 2 : -2) + (i % 37 === 0 ? 8 : 0) });
  const n = radarNoise(rows, now);
  assert.equal(n.verdict, "measured"); assert.ok(n.typical_24h_change >= 0); assert.ok(n.jumps_30min_5plus_pct > 0); assert.ok(n.jumps_reverted_within_1h_pct >= 30, String(n.jumps_reverted_within_1h_pct));
  assert.equal(radarNoise(rows.slice(0, 20), now).verdict, "collecting");
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"); assert.match(w, /lv\("budget"\), lv\("politics"\)/);
});
