import { test } from "node:test"; import assert from "node:assert/strict"; import { readFileSync } from "node:fs";
import { matches, schelerReport, SCHELER_MIN_EVENTS } from "../src/scheler.js";
const H = 36e5, now = Date.UTC(2026, 11, 1);
test("match: place and weather type", () => {
  const ev = { state: "Hamburg", event: "STURMBÖEN" };
  assert.ok(matches(ev, "Sturm über Hamburg: Fähren fallen aus"));
  assert.ok(matches(ev, "Storm warning for Hamburg as gusts hit the coast"));
  assert.ok(matches(ev, "Unwetter in Deutschland: DWD warnt"));
  assert.ok(!matches(ev, "Hamburg wins the cup"));
  assert.ok(!matches(ev, "Sturm in Bayern"));
  assert.ok(!matches({ state: "Hamburg", event: "FROST" }, "Sturm über Hamburg"));
});
test("report: collecting below minimum, then shares", () => {
  const ev = (i, s) => ({ k: "e" + i, state: s, event: "STURMBÖEN", level: 3, first_ts: now - 48 * H - i * 72 * H });
  const few = schelerReport([ev(1, "Hamburg")], [], now, now - 99 * H);
  assert.equal(few.verdict, "collecting"); assert.equal(few.share_unreported, null);
  const evs = Array.from({ length: SCHELER_MIN_EVENTS }, (_, i) => ev(i, "Hamburg"));
  const heads = [{ headline: "Sturm über Hamburg", first_ts: evs[0].first_ts + 2 * H }, { headline: "Sturm in Hamburg legt Bahn lahm", first_ts: evs[1].first_ts + H }];
  const r = schelerReport(evs, heads, now, now - 99 * H);
  assert.equal(r.reported, 2); assert.equal(r.unreported, 8); assert.equal(r.verdict, "mostly_unreported"); assert.equal(r.share_unreported, 0.8);
  assert.equal(schelerReport([{ ...ev(1, "Hamburg"), first_ts: now - 2 * H }], [], now).events_open, 1);
});
test("wiring", () => {
  const w = readFileSync("src/worker.js", "utf8");
  for (const s of ["/api/v1/scheler", 'name: "get_scheler"', 'name === "get_scheler"', 'tool: "get_scheler"', "measured_events"]) assert.ok(w.includes(s), s);
  assert.ok(readFileSync("public/llms.txt", "utf8").includes("get_scheler"));
  assert.ok(readFileSync("public/.well-known/agent.json", "utf8").includes('"scheler"'));
});
