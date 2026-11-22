import test from "node:test"; import assert from "node:assert/strict"; import { readFileSync } from "node:fs";
import { impulseReport, IMPULSE_OWN, IMPULSE_WATCHERS } from "../src/impulse.js";
const now = Date.parse("2026-11-22T14:00:00Z"), S = [{ id: "hamilton", tool: "get_hamilton", api: "/api/v1/hamilton" }, { id: "park", tool: "get_park", api: "/api/v1/park" }];
test("Impulse: outside use counted, own checks excluded, watchers apart, ranking and trend", () => {
  const rows = [
    { day: "2026-11-22", page: "/mcp/get_park", kind: "agent", name: "MCP · Claude-User", n: 3 }, { day: "2026-11-21", page: "/api/v1/park", kind: "agent", name: "ChatGPT-User", n: 2 },
    { day: "2026-11-12", page: "/api/v1/park", kind: "agent", name: "ChatGPT-User", n: 1 }, { day: "2026-11-22", page: "/mcp/get_park", kind: "agent", name: "MCP · OrbStudio-agent-buyer", n: 9 },
    { day: "2026-11-22", page: "/api/v1/hamilton", kind: "agent", name: "Apple", n: 1 }, { day: "2026-11-22", page: "hamilton", kind: "view", name: "ru", n: 4 },
    { day: "2026-11-22", page: "/api/v1/parking-de", kind: "agent", name: "Claude-Agent", n: 5 } ];
  const r = impulseReport(S, rows, now), park = r.sensors.find((s) => s.id === "park"), ham = r.sensors.find((s) => s.id === "hamilton");
  assert.equal(r.leader, "park"); assert.equal(r.sensors[0].id, "park");
  assert.equal(park.calls_7d, 5, "own checks and other endpoints are not counted"); assert.equal(park.programs_7d, 2); assert.equal(park.days_used_7d, 2); assert.equal(park.via_mcp_7d, 3); assert.equal(park.via_api_7d, 2);
  assert.equal(park.calls_prev_7d, 1); assert.equal(park.trend, "up"); assert.equal(park.first_external_use, "2026-11-12");
  assert.equal(ham.calls_7d, 0, "a search engine is a watcher, not a user"); assert.equal(ham.watchers_7d, 1); assert.deepEqual(ham.watcher_names, ["Apple"]); assert.equal(ham.human_views_7d, 4); assert.equal(ham.trend, "none");
  assert.equal(impulseReport(S, [], now).leader, null); assert.ok(IMPULSE_OWN.test("lychee/0.15")); assert.ok(IMPULSE_WATCHERS.test("Googlebot"));
});
test("Impulse: wired as the main sensor — tools card first, portal block, page, view counting, discovery", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/impulse"/); assert.match(w, /name: "get_impulse"/); assert.match(w, /"tools\/scientists", "tools\/impulse"[,\]]/); assert.match(w, /"scientists", "impulse"[,\]]/, "page views of sensor pages are counted");
  for (const p of ["tools.html", "de/tools.html", "en/tools.html"]) { const h = readFileSync(new URL("../public/" + p, import.meta.url), "utf8"); assert.ok(h.indexOf("<h3>get_impulse</h3>") < h.indexOf("<h3>list_scientist_sensors</h3>"), p + ": Impulse comes first"); }
  for (const p of ["tools/impulse.html", "de/tools/impulse.html", "en/tools/impulse.html"]) { const h = readFileSync(new URL("../public/" + p, import.meta.url), "utf8"); assert.match(h, /fetch\("\/api\/v1\/impulse"/); assert.match(h, /orbCounted_impulse/); assert.match(h, /class="pstrip"/); }
  for (const p of ["tools/scientists.html", "tools/park.html"]) assert.match(readFileSync(new URL("../public/" + p, import.meta.url), "utf8"), /\/api\/v1\/hit/);
  assert.match(readFileSync(new URL("../public/tools/scientists.html", import.meta.url), "utf8"), /id="impLine"/);
  const sm = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8"); for (const pre of ["", "/de", "/en"]) assert.ok(sm.includes("<loc>https://orbstudio.org" + pre + "/tools/impulse</loc>"));
});
