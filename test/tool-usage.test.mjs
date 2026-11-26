import test from "node:test"; import assert from "node:assert/strict";
import { toolUsageReport } from "../src/tool-usage.js";
test("tool usage: scanners are separated, unused tools listed, 80 % share counted", () => {
  const rows = [
    { page: "/mcp/get_harman", name: "MCP · claude-code", n: 6 }, { page: "/mcp/get_harman", name: "MCP · Agent402 scanner", n: 50 },
    { page: "/mcp/get_news_by_topic", name: "MCP · cursor", n: 3 }, { page: "/mcp/get_zipf", name: "MCP · mcpbeat", n: 9 }, { page: "/api/v1/robot", name: "x", n: 99 },
  ];
  const r = toolUsageReport(rows, ["get_harman", "get_news_by_topic", "get_zipf", "get_ashby"], 14, Date.parse("2026-11-26T08:00:00Z"));
  assert.equal(r.calls_non_scanner, 9); assert.equal(r.tools_used, 2); assert.deepEqual(r.unused.sort(), ["get_ashby", "get_zipf"]);
  assert.equal(r.top[0].tool, "get_harman"); assert.equal(r.top[0].calls, 56); assert.equal(r.tools_for_80_pct_of_calls, 2);
  assert.equal(toolUsageReport([], ["a"]).tools_for_80_pct_of_calls, null);
});
