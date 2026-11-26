import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { hourly, cusum, shewhartReport, SHEWHART_H } from "../src/shewhart.js";

const H = 3600e3, now = Date.UTC(2026, 10, 26, 12);
const series = (days, f) => { const out = []; for (let t = now - days * 864e5; t <= now; t += 1800e3) out.push({ ts: t, g: f(t) }); return out; };
const wiggle = (t) => 50 + ((t / 1800e3) % 7) - 3; // обычный разброс ±3

test("shewhart: steady radar is in control, a small lasting shift is caught", () => {
  const calm = cusum(hourly(series(10, wiggle), "g"), now);
  assert.equal(calm.verdict, "in_control");
  const shifted = series(10, (t) => wiggle(t) + (t > now - 30 * H ? 8 : 0)); // +8 пунктов 30 часов: меньше «скачка» в 10
  const r = cusum(hourly(shifted, "g"), now);
  assert.equal(r.verdict, "shift_up"); assert.ok(r.cusum_up > SHEWHART_H); assert.ok(r.new_level_estimate > r.mean_before);
  const down = cusum(hourly(series(10, (t) => wiggle(t) - (t > now - 30 * H ? 8 : 0)), "g"), now);
  assert.equal(down.verdict, "shift_down");
});

test("shewhart: short history is collecting, report lists shifted radars", () => {
  assert.equal(cusum(hourly(series(3, wiggle), "g"), now).verdict, "collecting");
  const rows = series(10, (t) => wiggle(t) + (t > now - 30 * H ? 8 : 0));
  const rep = shewhartReport(rows, [["geo", "g"], ["crypto", "k"]], now);
  assert.equal(rep.shifted.length, 1); assert.equal(rep.shifted[0].radar, "geo"); assert.equal(rep.radars.crypto.verdict, "collecting");
});

test("shewhart: wired into worker, llms.txt and agent.json", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/shewhart"/); assert.match(w, /name: "get_shewhart"/); assert.match(w, /tool: "get_shewhart"/); assert.match(w, /name === "get_shewhart"/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /get_shewhart/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /api\/v1\/shewhart/);
});
