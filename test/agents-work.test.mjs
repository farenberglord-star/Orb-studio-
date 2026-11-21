import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { agentsAtWork, isWorkAgent, isWorkPage } from "../src/agents-work.js";

test("agents at work: probes, catalogues, search crawlers and our own checks are not counted", () => {
  for (const n of ["Agent402", "Script · curl", "Script · lychee", "MCP · mcpbeat", "MCP · glimind-probe", "MCP · hostedmcp-liveness", "Script · PayAI-Bazaar", "Script · x402-observer", "Script · paywary", "Bot · SealKeeperBot", "MCP · Script · KitScout-LiveCheck",
    "Bot · agent-index", "Googlebot", "Bot · YandexBot", "Bot · OrbStudio-agent-buyer", "Script · OrbStudioAudit", "Script · ORB-Studio-demo", "Other bot", "Script", "Script · node", "", null]) assert.equal(isWorkAgent(n), false, String(n));
  for (const n of ["Meta-AI", "GPTBot", "ClaudeBot", "Apple", "Amazonbot", "MCP · browser", "MCP · Script · python-httpx2", "Script · okhttp", "MCP · Script · mcpcli"]) assert.equal(isWorkAgent(n), true, n);
  for (const p of ["/mcp/get_radars", "/mcp/prompt/ask_david", "/mcp/resource/sensors", "/api/v1/sensors", "/api/v1/radar/crypto", "/api/v1/roundtable", "/api/v1/radio/tracks", "/api/v1/broadcast/duo/audio"]) assert.equal(isWorkPage(p), true, p);
  for (const p of ["/mcp", "/mcp/server-card", "/api/v1/hit", "/api/v1/stats", "/api/v1/stats/studio", "/api/v1/violin/midi", "/api/v1/radio/track/buy", "/api/v1/.env", "/api/v1/env", "/api/v1/config/", "/api/v1/models", "/", "/robots.txt", "/sensors", null]) assert.equal(isWorkPage(p), false, String(p));
});

test("agents at work: totals for today and the week, top list with what each one used", () => {
  const rows = [
    { day: "2026-11-21", name: "Meta-AI", page: "/api/v1/broadcast/duo/audio", n: 49 }, { day: "2026-11-21", name: "Meta-AI", page: "/api/v1/hit", n: 11 }, { day: "2026-11-21", name: "Meta-AI", page: "/api/v1/roundtable", n: 4 },
    { day: "2026-11-20", name: "GPTBot", page: "/api/v1/quakes", n: 2 }, { day: "2026-11-20", name: "GPTBot", page: "/api/v1/space", n: 2 }, { day: "2026-11-20", name: "MCP · browser", page: "/mcp/get_agent_podcast", n: 5 },
    { day: "2026-11-21", name: "Agent402", page: "/api/v1/radio", n: 900 }, { day: "2026-11-21", name: "Script · curl", page: "/api/v1/radio/tracks", n: 36 }, { day: "2026-11-21", name: "Script · okhttp", page: "/api/v1/sensors", n: 2 },
    { day: "2026-11-21", name: "Script · x402-observer", page: "/api/v1/violin/midi", n: 2 }, { day: "2026-11-19", name: "Googlebot", page: "/api/v1/.env", n: 1 }, { day: "2026-11-21", name: "Apple", page: "/api/v1/radar/crypto", n: 0 },
  ];
  const r = agentsAtWork(rows, "2026-11-21");
  assert.deepEqual(r.today, { agents: 2, calls: 55 }); assert.deepEqual(r.last_7d, { agents: 4, calls: 64 });
  assert.deepEqual(r.top_7d.map((x) => [x.name, x.calls]), [["Meta-AI", 53], ["MCP · browser", 5], ["GPTBot", 4], ["Script · okhttp", 2]]);
  assert.deepEqual(r.top_7d[0].most_used, ["/api/v1/broadcast/duo/audio", "/api/v1/roundtable"]); assert.equal(r.top_7d[2].different_endpoints, 2);
  assert.match(r.rule, /our own checks/); assert.deepEqual(agentsAtWork(null, "x").today, { agents: 0, calls: 0 });
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"); assert.match(w, /agents_at_work: atWork/);
  const y = readFileSync(new URL("../.github/workflows/links.yml", import.meta.url), "utf8"); assert.match(y, /--exclude '\^https:\/\/orbstudio\.org\/go\/'/);
});
