import { test } from "node:test";
import assert from "node:assert/strict";
import { youtubeId, judgePrice } from "../src/interview.js";

test("youtubeId", () => {
  assert.equal(youtubeId("https://www.youtube.com/watch?v=vZgN6kewPU0&t=10"), "vZgN6kewPU0");
  assert.equal(youtubeId("https://youtu.be/W2bdRW-EazA?is=x"), "W2bdRW-EazA");
  assert.equal(youtubeId("https://m.youtube.com/shorts/yclfMobOKR8"), "yclfMobOKR8");
  assert.equal(youtubeId("vZgN6kewPU0"), "vZgN6kewPU0");
  assert.equal(youtubeId("https://evil.example/watch?v=vZgN6kewPU0"), null);
  assert.equal(youtubeId("http://169.254.169.254/"), null);
});

const day = (d) => Date.parse(d + "T00:00:00Z") / 1000;
// [time, open, high, low, close, ...]
const candles = [[day("2025-03-11"), 0, 83000, 76000, 81000], [day("2025-10-06"), 0, 126000, 120000, 124000], [day("2025-12-31"), 0, 89000, 86000, 87700]];
test("judgePrice: target above not reached", () => {
  const r = judgePrice(candles, { direction: "above", target: 250000, deadline: "2025-12-31" }, "2025-03-11", "2026-11-14");
  assert.equal(r.status, "not_reached"); assert.equal(r.period_high, 126000); assert.equal(r.close_on_deadline, 87700);
});
test("judgePrice: reached, pending, no data", () => {
  assert.equal(judgePrice(candles, { direction: "above", target: 120000, deadline: "2025-12-31" }, "2025-03-11", "2026-11-14").status, "reached");
  assert.equal(judgePrice(null, { direction: "above", target: 1e6, deadline: "2030-12-31" }, "2025-03-11", "2026-11-14").status, "pending");
  assert.equal(judgePrice(candles, { direction: "above", target: 1, deadline: "2021-12-31" }, "2018-04-01", "2026-11-14").status, "no_data");
});
