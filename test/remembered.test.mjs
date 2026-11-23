import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { crystalsRemembered, CRYSTALS } from "../src/crystals.js";

test("remembered: clicks and agent finds per scientist, 30 days, unknown ids ignored", () => {
  const now = Date.UTC(2026, 10, 23), a = CRYSTALS[0].id, b = CRYSTALS[1].id;
  const rows = [
    { day: "2026-11-23", page: "crystal:" + a, kind: "wiki_click", n: 2 }, { day: "2026-11-20", page: "crystal:" + a, kind: "found", n: 3 },
    { day: "2026-11-22", page: "crystal:" + b, kind: "found", n: 1 }, { day: "2026-09-01", page: "crystal:" + b, kind: "found", n: 50 },
    { day: "2026-11-22", page: "crystal:nobody", kind: "found", n: 9 }, { day: "2026-11-22", page: "tools", kind: "view", n: 9 },
  ];
  const r = crystalsRemembered(rows, [], now);
  assert.equal(r.scientists_remembered, 2); assert.equal(r.top[0].id, a);
  assert.equal(r.top[0].wiki_clicks_30d, 2); assert.equal(r.top[0].found_by_agents_30d, 3); assert.equal(r.top[0].days_30d, 2);
  assert.equal(r.top[1].found_by_agents_30d, 1);
  assert.equal(crystalsRemembered([], [], now).top.length, 0);
});
test("wiring: click beacon on the library, counter endpoint, finds, impulse", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /"\/api\/v1\/crystal-click"/); assert.match(w, /crystalsFound\(env, ctx, request, rep/); assert.match(w, /remembered: crystalsRemembered\(/);
  for (const f of ["tools/crystals.html", "de/tools/crystals.html", "en/tools/crystals.html"]) assert.match(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), /sendBeacon\("\/api\/v1\/crystal-click"/);
  for (const f of ["tools/impulse.html", "de/tools/impulse.html", "en/tools/impulse.html"]) assert.match(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), /d\.remembered/);
});
