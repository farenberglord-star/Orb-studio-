import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { cryptoPassport, regimeHistory } from "../src/crypto-passport.js";

const NOW = Date.parse("2026-11-24T13:00:00Z");
const base = () => ({
  radar: { lvl: 66, prev: 64, fac: [["Регуляторы", 40], ["Взломы", 30], ["Волатильность", 27]], feed: [["12:00", "Bitcoin steady", "coindesk.com", 50, "x", NOW - 3600e3]], verify: [4] },
  sensors: { volatility: { coins: { BTC: { volatility_24h_vs_30d: 1.0 }, ETH: { volatility_24h_vs_30d: 1.1 }, XRP: { volatility_24h_vs_30d: 0.9 } }, spikes_24h: [] },
    derivatives: { change_24h_pct: 1, funding_relative_pct: 0.0003 }, usdc: { peg_deviation_pct: -0.02 } },
  anomalies: { enabled: true, signals: [] }, noise: { typical_24h_change: 4, large_24h_change_p90: 8 }, radarHist: [], now: NOW,
});
test("all checks calm → calm, full size, never a direction", () => {
  const p = cryptoPassport(base());
  assert.equal(p.regime, "calm"); assert.equal(p.new_trade_size_pct_of_plan, 100); assert.equal(p.checks.length, 6);
  assert.doesNotMatch(JSON.stringify(p.order) + p.rule, /\b(buy|sell|long|short)\b(?! signal)/i);
  assert.match(p.not_a_signal, /Not a buy or sell signal/);
});
test("the worst check decides; an unread check counts as nervous", () => {
  const a = base(); a.sensors.volatility.coins.ETH.volatility_24h_vs_30d = 1.67;
  assert.equal(cryptoPassport(a).regime, "nervous"); assert.deepEqual(cryptoPassport(a).drivers, ["volatility"]);
  const b = base(); delete b.sensors.usdc; const pb = cryptoPassport(b); assert.equal(pb.regime, "nervous"); assert.equal(pb.new_trade_size_pct_of_plan, 50);
  const c = base(); c.sensors.volatility.spikes_24h = [{ coin: "BTC", hour_end: new Date(NOW - 2 * 3600e3).toISOString(), z: 7 }];
  assert.equal(cryptoPassport(c).regime, "storm"); assert.equal(cryptoPassport(c).new_trade_size_pct_of_plan, 0);
  const d = base(); d.sensors.usdc.peg_deviation_pct = -0.8; assert.equal(cryptoPassport(d).regime, "storm");
});
test("radar storm only when a large move held for two hours (as the anomaly detector)", () => {
  const a = base(); a.radar.lvl = 76; a.radar.prev = 64;
  assert.equal(cryptoPassport(a).checks.find((x) => x.id === "radar").level, "nervous");
  a.radarHist = [{ ts: NOW - 25 * 3600e3, k: 64 }, ...[4, 3, 2, 1].map((h) => ({ ts: NOW - h * 18e5, k: 76 }))];
  assert.equal(cryptoPassport(a).checks.find((x) => x.id === "radar").level, "storm");
});
test("hacks factor > 80 is storm only with a confirmed grave headline in 6 h", () => {
  const a = base(); a.radar.fac = [["Взломы", 85], ["Регуляторы", 40]];
  assert.equal(cryptoPassport(a).checks.find((x) => x.id === "hacks_regulators").level, "nervous");
  a.radar.feed = [["12:00", "Exchange hacked, withdrawals suspended", "coindesk.com", 90, "x", NOW - 3600e3]]; a.radar.verify = [3];
  assert.equal(cryptoPassport(a).regime, "storm");
});
test("regime history and wiring", () => {
  const h = regimeHistory([{ ts: 1, regime: "calm" }, { ts: 2, regime: "calm" }, { ts: 3, regime: "nervous" }]);
  assert.equal(h.changes.length, 2); assert.equal(h.changes[0].regime, "nervous"); assert.equal(h.hours_by_regime_7d.calm, 1);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /\/api\/v1\/crypto-passport/); assert.match(w, /get_crypto_passport/); assert.match(w, /cryptoPassportRecord/);
});
import { ruinTable, longestDownStreak } from "../src/crypto-passport.js";
import { newsPassport } from "../src/passport.js";
import { afterCorrectionReport, CORRECTION_RE } from "../src/harman.js";
test("ruin grows with the share at risk (Lundberg): 10 losses cost ~10x more at 5% than at 0.5%", () => {
  assert.equal(longestDownStreak([5, 4, 3, 4, 3, 2, 1, 0]), 4);
  const t = ruinTable({ BTC: 7, ETH: 9, XRP: null });
  const r05 = t.capital_left_pct.find((x) => x.risk_per_trade_pct === 0.5), r5 = t.capital_left_pct.find((x) => x.risk_per_trade_pct === 5);
  assert.equal(r05.after_10_losses, 95.1); assert.equal(r5.after_10_losses, 59.9); assert.ok("after_9_losses" in r5);
  assert.match(t.caveat, /Not a forecast/);
  assert.ok(cryptoPassport({ ...base(), streaks: { BTC: 7 } }).ruin.capital_left_pct.length === 4);
});
test("evidence chain names the weakest link and does not change confidence (Wigmore, Jerome Frank)", () => {
  const p = newsPassport({ headline: "Minister says new tax plan will cut prices", confirm: 1 });
  assert.equal(p.chain.weakest.link, "voices"); assert.equal(p.chain.links.length, 6);
  const q = newsPassport({ headline: "Earthquake of magnitude 6.1 hits central Italy", confirm: 5, published_at: new Date().toISOString() });
  assert.ok(!q.chain.weakest || q.chain.weakest.link !== "voices");
});
test("a correction does not erase (Lee Ross): story still seen 6 h after the correction counts as kept going", () => {
  const now = Date.parse("2026-11-24T12:00:00Z"), h = 3600e3;
  const st = { k: "a", headline: "Exchange reports massive hack of customer wallets overnight", first_ts: now - 40 * h, last_ts: now - 2 * h };
  const c = { k: "b", headline: "Exchange denies massive hack of customer wallets, says funds safe", first_ts: now - 30 * h, last_ts: now - 30 * h };
  assert.ok(CORRECTION_RE.test(c.headline));
  const r = afterCorrectionReport([st, c], [c], now);
  assert.equal(r.stories_with_correction, 1); assert.equal(r.kept_going_after, 1); assert.equal(r.verdict, "collecting");
});
