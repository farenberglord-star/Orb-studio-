import test from "node:test";
import assert from "node:assert/strict";
import { measureClaim } from "../src/measure.js";
const now = new Date().toISOString();
const SENS = {
  volatility: { coins: { BTC: { price_eur: 65000, hour_end: now } } },
  ecb: { source: "ECB", source_url: "u", eurusd: { value: 1.08, date: now }, deposit_rate_pct: { value: 2.0, date: now } },
  derivatives: { funding_relative_pct: 0.004, open_interest_usd: 9e9, at: now, source: "Kraken", source_url: "u" },
  bitcoin: { fee_fast_sat_vb: 3, at: now, source: "mempool", source_url: "u" },
  power: { now_ct_kwh: 8.5, now_at: now, source: "EC", source_url: "u" },
};
const one = (t) => measureClaim(t, SENS).find((x) => x.claimed != null);
test("measure: claims are compared with our sensors", () => {
  assert.equal(one("BTC funding rate is 0.004%").result, "match");
  assert.equal(one("Bitcoin funding rate is 0.05% right now").result, "mismatch");
  assert.equal(one("Bitcoin open interest is 9.2 billion dollars").result, "match");
  assert.equal(one("Bitcoin open interest fell to 3 billion").result, "mismatch");
  assert.equal(one("Bitcoin fast fee is 3 sat/vB").result, "match");
  assert.equal(one("ECB deposit rate is 2.0%").result, "match");
  assert.equal(one("Ставка ЕЦБ по депозиту 4%").result, "mismatch");
  assert.equal(one("EUR/USD stands at 1.08").result, "match");
  assert.equal(one("Electricity in Germany costs 8.4 ct/kWh now (day-ahead)").result, "match");
});
test("measure: no claimed number gives our value, stale sensor is not judged, unrelated text gives nothing", () => {
  const r = measureClaim("What is the bitcoin funding rate?", SENS); assert.equal(r[0].id, "btc_funding"); assert.equal(r[0].claimed, undefined); assert.equal(r[0].ours, 0.004);
  const old = { ...SENS, derivatives: { ...SENS.derivatives, at: "2026-01-01T00:00:00Z" } };
  const s = measureClaim("Bitcoin funding rate is 0.05%", old)[0]; assert.equal(s.stale, true); assert.equal(s.result, undefined);
  assert.deepEqual(measureClaim("Boeing deliveries fell 14% in October", SENS), []);
  assert.deepEqual(measureClaim("anything", null), []);
});

import { readFileSync } from "node:fs";
test("check_number: MCP tool, REST route and announcements are registered", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /name: "check_number"/); assert.match(w, /p === "\/api\/v1\/number"/); assert.match(w, /name === "check_number"/);
  assert.match(w, /tool: "check_number", url:/); assert.match(w, /New since 25\.11\.2026: check_number/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /\(check_number\)/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /"check_number"/);
});
