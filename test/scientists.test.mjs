import test from "node:test"; import assert from "node:assert/strict"; import { readFileSync, existsSync } from "node:fs";
import { SCIENTISTS, scientistsIndex, scientistLine } from "../src/scientists.js";
test("portal of sensors in honour of scientists: every sensor listed with API, MCP tool, pages, analog check and live line", () => {
  const ix = scientistsIndex("https://orbstudio.org", { polyak: { series: [{ id: "consensus", verdict: "shift", direction: "down" }, { id: "geo_radar", verdict: "calm" }] }, mikrin: { shortest_path: "studio", blocks: [{ id: "studio", steps: [{ minutes_median: 47 }] }] } });
  assert.deepEqual(ix.sensors.map((s) => s.id), ["hamilton", "mikrin", "polyak", "park", "kahneman", "ziv", "cox", "halpern", "howard", "leamer", "baird", "lyberg", "hagenauer", "frankfurt"]); assert.match(ix.rule, /not used/);
  for (const s of ix.sensors) { assert.match(s.api, /^https:\/\/orbstudio\.org\/api\/v1\//); assert.match(s.mcp_tool, /^get_/); assert.ok(s.analog_check.similar && s.analog_check.difference && s.analog_check.date); assert.ok(s.wikipedia.ru); assert.match(s.note, /not connected/); }
  assert.deepEqual(ix.sensors[2].now.moving, [{ id: "consensus", verdict: "shift", direction: "down" }]); assert.equal(ix.sensors[1].now.minutes, 47); assert.equal(ix.sensors[0].now, null, "no reading is null, not invented");
  assert.equal(scientistLine("hamilton", { status: "degraded", components: [{ id: "dj", state: "degraded" }, { id: "music", state: "full" }] }).set_aside[0], "dj");
  assert.ok(!JSON.stringify(ix).match(/\bunique\b(?! is not)/i) || /'unique' is not used/.test(ix.rule));
});
test("portal pages, wiring, discovery: sitemap, llms.txt, agent card, tool cards, back links", () => {
  for (const p of ["tools/scientists.html", "de/tools/scientists.html", "en/tools/scientists.html"]) { const h = readFileSync(new URL("../public/" + p, import.meta.url), "utf8");
    const ld = JSON.parse(/<script type="application\/ld\+json">([^<]+)<\/script>/.exec(h)[1]); assert.equal(ld["@type"], "CollectionPage"); assert.equal(ld.mainEntity.itemListElement.length, SCIENTISTS.length);
    for (const s of SCIENTISTS) assert.match(h, new RegExp("<h3>get_" + s.id + "</h3>")); assert.match(h, /fetch\("\/api\/v1\/scientists"/); assert.equal((h.match(/rel="alternate" hreflang=/g) || []).length, 4); assert.match(h, /class="pstrip"/); }
  for (const s of SCIENTISTS) for (const pre of ["", "de/", "en/"]) assert.match(readFileSync(new URL("../public/" + pre + "tools/" + s.id + ".html", import.meta.url), "utf8"), /tools\/scientists">/, "sensor page links back to the portal");
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"); assert.match(w, /p === "\/api\/v1\/scientists"/); assert.match(w, /name: "list_scientist_sensors"/); assert.match(w, /"tools\/park", "tools\/scientists"/);
  const sm = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8"); for (const pre of ["", "/de", "/en"]) assert.ok(sm.includes("<loc>https://orbstudio.org" + pre + "/tools/scientists</loc>"));
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /\[Sensors in honour of scientists\]/);
  const card = JSON.parse(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8")); for (const k of ["scientists", "hamilton", "mikrin", "polyak"]) assert.match(card.endpoints[k], /^https:\/\/orbstudio\.org\/api\/v1\//);
  for (const p of ["tools.html", "de/tools.html", "en/tools.html"]) assert.match(readFileSync(new URL("../public/" + p, import.meta.url), "utf8"), /<h3>list_scientist_sensors<\/h3>/);
});
