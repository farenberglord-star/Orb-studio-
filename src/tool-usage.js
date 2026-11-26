// Кто что вызывает: счёт вызовов MCP-инструментов по таблице hits (page «/mcp/<имя>», kind «agent», name «MCP · клиент»).
// Для владельца: какие инструменты агенты реально берут, какие — нет. Сканеры каталогов (Agent402 и т. п.) отделены от остальных.
// Только счёт вызовов, без содержимого запросов.
export const TOOL_SCANNER = /agent402|payai|lychee|x402-|x402lens|probe|indexer|collector|observer|mcpbeat|uptime|monitor|googlebot|bingbot|applebot|yandex|baidu|ahrefs|semrush|petal|duckduck|^script · curl$/i;
export function toolUsageReport(rows, toolNames, days = 14, now = Date.now()) {
  const by = {};
  for (const r of rows || []) {
    const m = /^\/mcp\/(.+)$/.exec(String(r.page || "")); if (!m) continue;
    const t = (by[m[1]] = by[m[1]] || { tool: m[1], calls: 0, calls_non_scanner: 0, clients: new Set() });
    const scanner = TOOL_SCANNER.test(String(r.name || "")), n = +r.n || 0;
    t.calls += n; if (!scanner) { t.calls_non_scanner += n; t.clients.add(String(r.name || "").replace(/^MCP · /, "").slice(0, 40)); }
  }
  const names = new Set([...(toolNames || []), ...Object.keys(by)]);
  const list = [...names].map((n) => { const t = by[n]; return { tool: n, calls: t ? t.calls : 0, calls_non_scanner: t ? t.calls_non_scanner : 0, distinct_clients: t ? t.clients.size : 0 }; })
    .sort((a, b) => b.calls_non_scanner - a.calls_non_scanner || b.calls - a.calls || a.tool.localeCompare(b.tool));
  const used = list.filter((x) => x.calls_non_scanner > 0), unused = list.filter((x) => x.calls_non_scanner === 0);
  const total = used.reduce((s, x) => s + x.calls_non_scanner, 0);
  let acc = 0, top = 0; for (const x of used) { if (acc >= 0.8 * total) break; acc += x.calls_non_scanner; top++; }
  return { days, generated_at: new Date(now).toISOString(), tools_total: list.length, tools_used: used.length, tools_unused: unused.length,
    calls_non_scanner: total, tools_for_80_pct_of_calls: total ? top : null,
    top: used.slice(0, 15), unused: unused.map((x) => x.tool),
    note: "Calls by MCP clients that are not catalog scanners, from the hits table. A call is a request for data, not proof that the agent changed an answer; that needs the agent's own report. Tools never called in the period are candidates to freeze, not to delete." };
}
