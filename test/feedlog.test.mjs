import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FEED_COLS, newFeedStats, failReason, feedReport } from "../src/feedlog.js";

test("failReason separates timeout from other errors", () => {
  assert.equal(failReason({ name: "TimeoutError" }), "timeout");
  assert.equal(failReason({ name: "AbortError" }), "timeout");
  assert.equal(failReason(new Error("x")), "error");
  assert.equal(failReason(null), "error");
});

test("newFeedStats has every counter the journal sums", () => {
  const st = newFeedStats();
  for (const c of FEED_COLS) if (c !== "runs" && c !== "empty_radars") assert.equal(st[c], 0, c);
});

test("feedReport sums a day and counts troubled slots", () => {
  const now = 1_000_000_000_000;
  const rows = [
    { ts: now - 30 * 3600e3, runs: 5, asked: 50, fresh: 40, fetched: 10, ok: 10 },
    { ts: now - 3 * 3600e3, runs: 5, asked: 50, fresh: 30, fetched: 20, ok: 18, timeout: 2 },
    { ts: now - 1 * 3600e3, runs: 5, asked: 50, fresh: 20, fetched: 30, ok: 20, timeout: 6, http: 1, empty: 3, skipped: 9, empty_radars: 2 },
  ];
  const r = feedReport(rows, now, 24);
  assert.equal(r.slots, 2);
  assert.equal(r.network_calls, 50);
  assert.equal(r.network_failed, 12);
  assert.equal(r.share_failed_of_network, 0.24);
  assert.equal(r.skipped_by_budget, 9);
  assert.equal(r.radars_without_feed, 2);
  assert.equal(r.slots_with_trouble, 2);
  assert.equal(feedReport([], now).share_failed_of_network, null);
});

test("worker counts feed outcomes and writes the journal", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /await feedLogWrite\(env, fc, data\)/);
  assert.match(w, /\/api\/v1\/feed-health/);
  assert.match(w, /st\.skipped\+\+/);
});
