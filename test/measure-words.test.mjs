import test from "node:test";
import assert from "node:assert/strict";
import { measureClaim } from "../src/measure.js";

const sens = { ecb: { source: "ECB", source_url: "x", deposit_rate_pct: { value: 2.5, date: new Date().toISOString().slice(0, 10) }, eurusd: { value: 1.1, date: new Date().toISOString().slice(0, 10) } },
  volatility: { coins: { BTC: { price_eur: 80000, hour_end: new Date().toISOString() } } } };

test("'2 percent' / '2 процента' count as a percentage claim, not as 'no number'", () => {
  for (const t of ["The ECB deposit rate is 2 percent", "Ставка ЕЦБ по депозитам 2 процента", "Der EZB Einlagesatz liegt bei 2 Prozent"]) {
    const r = measureClaim(t, sens).find((x) => x.id === "ecb_deposit_rate");
    assert.ok(r && r.claimed === 2 && r.result === "mismatch", t);
  }
  assert.equal(measureClaim("The ECB deposit rate is 2.5 percent", sens).find((x) => x.id === "ecb_deposit_rate").result, "match");
});
test("'Bitcoin costs about 90000 dollars' is judged against our price", () => {
  const r = measureClaim("Bitcoin costs about 90000 dollars today", sens).find((x) => x.id === "crypto_price_btc");
  assert.ok(r && r.claimed === 90000);
});
