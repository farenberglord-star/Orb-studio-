import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { alphaNominal, krippendorffReport } from "../src/krippendorff.js";
import { kendallStory, kendallReport } from "../src/kendall_dg.js";
import { smallSteps, ratchet } from "../src/shewhart.js";

test("krippendorff: alpha is 1 for full agreement, low when labels split", () => {
  assert.equal(alphaNominal([["event", "event"], ["claim", "claim"], ["threat", "threat"]]).alpha, 1);
  const r = alphaNominal([["event", "claim"], ["claim", "event"], ["event", "event"], ["claim", "claim"]]);
  assert.ok(r.alpha < 0.4);
  assert.equal(alphaNominal([["event", "event"]]).reason, "one_category_only");
});

test("krippendorff: AC1 stays high when one category dominates", async () => {
  const { gwetAC1 } = await import("../src/krippendorff.js");
  const units = [...Array(18)].map(() => ["event", "event"]).concat([["event", "claim"], ["event", "claim"]]);
  assert.ok(gwetAC1(units) > 0.8); assert.ok(alphaNominal(units).alpha < 0.4);
});

test("krippendorff: same event at two outlets is grouped without chaining", () => {
  const t = Date.UTC(2026, 10, 26, 8);
  const rows = [];
  const w = ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot", "golf", "hotel", "india", "juliet", "kilo", "lima", "mike", "november", "oscar", "papa", "quebec", "romeo", "sierra", "tango"];
  const topic = ["harbour", "glacier", "orchard", "vaccine", "cinema", "railway", "lottery", "stadium", "library", "factory", "volcano", "airport", "satellite", "festival", "museum", "pipeline", "forest", "election", "hospital", "bridge"];
  for (let i = 0; i < 20; i++) {
    rows.push({ radar: "geo", source: "a.com", headline: `${w[i]}town opens new ${topic[i]} quarter`, first_ts: t + i * 60e3 });
    rows.push({ radar: "geo", source: "b.com", headline: `New ${topic[i]} quarter opens in ${w[i]}town`, first_ts: t + i * 60e3 + 1000 });
  }
  const r = krippendorffReport(rows, t + 3600e3);
  assert.equal(r.events_with_2plus_outlets, 20); assert.equal(r.verdict, "collecting"); // одна категория — альфа не определена
});

test("kendall: a promise that stopped gaining outlets is saturated, not settled", () => {
  const now = Date.UTC(2026, 10, 26, 20), H = 3600e3;
  const joins = JSON.stringify([["x", now - 12 * H], ["y", now - 11 * H], ["z", now - 10 * H]]);
  const s = kendallStory({ radar: "politics", source: "x", headline: "Minister plans to raise tariffs next year", first_ts: now - 12 * H, last_ts: now - 600e3, joins }, now);
  assert.equal(s.state, "saturated_not_settled");
  const e = kendallStory({ radar: "politics", source: "x", headline: "Parliament approved the tariff law", first_ts: now - 12 * H, last_ts: now - 600e3, joins }, now);
  assert.equal(e.state, "saturated_event");
  assert.equal(kendallStory({ source: "x", headline: "h", first_ts: now - 2 * H, last_ts: now, joins }, now), null);
  assert.equal(kendallReport([], now).verdict, "collecting");
});

test("shewhart extras: drift in small steps and ratchet", () => {
  const now = Date.UTC(2026, 10, 26, 12), rows = [];
  for (let i = 0; i <= 48; i++) rows.push({ ts: now - (48 - i) * 1800e3, g: 40 + i * 0.5 }); // +24 мелкими шагами
  assert.equal(smallSteps(rows, "g", now).verdict, "drift_in_small_steps");
  const up = []; let t = now - 10 * 864e5;
  for (let k = 0; k < 4; k++) { for (const v of [20, 20, 35, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 20, 20]) { up.push({ ts: t, g: v }); t += 1800e3; } }
  assert.equal(ratchet(up, "g", t).verdict, "rises_fast_falls_slow");
});

test("new sensors wired into worker, llms.txt and agent.json", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  for (const n of ["krippendorff", "kendall_rumour"]) { assert.match(w, new RegExp(`name: "get_${n}"`)); assert.match(w, new RegExp(`tool: "get_${n}"`)); assert.match(w, new RegExp(`name === "get_${n}"`)); }
  assert.match(w, /p === "\/api\/v1\/krippendorff"/); assert.match(w, /p === "\/api\/v1\/kendall-rumour"/);
  const l = readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"); assert.match(l, /get_krippendorff/); assert.match(l, /get_kendall_rumour/);
  const a = readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"); assert.match(a, /api\/v1\/krippendorff/); assert.match(a, /api\/v1\/kendall-rumour/);
});
