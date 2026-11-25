import test from "node:test";
import assert from "node:assert/strict";
import { promiseReport } from "../src/promises.js";
const D = 864e5, now = Date.parse("2026-11-25T12:00:00Z");
const row = (k, headline, days, extra = {}) => ({ k, radar: "p", source: "A", headline, first_ts: now - days * D, last_ts: now - days * D, n_max: 1, ...extra });
test("promise ledger: followed / silence / open", () => {
  const rows = [
    row("a", "Minister will raise pension payments next year", 20),
    row("b", "Government raised pension payments after parliament vote", 10, { n_max: 3 }),
    row("c", "Mayor plans to close central bridge for repairs", 20),
    row("d", "Chancellor promises tax relief for families", 2),
  ];
  const r = promiseReport(rows, now), by = Object.fromEntries(r.examples.followed.concat(r.examples.silence).map((x) => [x.k, x.outcome]));
  assert.equal(by.a, "followed_by_event"); assert.equal(by.c, "silence");
  assert.equal(r.future_stories, 3); assert.equal(r.matured, 2); assert.equal(r.followed_by_event, 1);
  assert.equal(r.verdict, "collecting"); assert.equal(r.followed_pct, null);
});
