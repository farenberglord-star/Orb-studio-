// «Агенты по делу»: кто из роботов реально брал данные или вызывал инструменты, без проверяльщиков каталогов, поисковых обходчиков и наших собственных проверок.
// Это счёт обращений, а не людей и не «намерений»: правило простое и записано здесь целиком.

// Проверяльщики и каталоги (заходят убедиться, что сервис жив, и уходят), поисковики, наши собственные роботы и скрипты
export const WORK_SCANNER = /agent402|payai|lychee|x402|402explorer|prob(?:e|er)\b|indexer|collector|observer|census|mcpbeat|liveness|livecheck|verification|conformance|-check|uptime|monitor|crawler|registry|catalog|recorder|scout|scanner|trust|referee|payability|paywary|allow402|\betl\b|sealkeeper|keptvow|brickblue|economyreport|agent-index|histor\b|mcphere|googlebot|bingbot|baidu|yandex|semrush|ahrefs|commoncrawl|rankshark|twitterbot|reflectionbot|zerobot|^script$|^script · (?:curl|node|google)$|^other bot$|unverified|link in text|selftest|orb-?studio/i;
// Что считается «делом»: вызов инструмента, сценария или ресурса MCP либо запрос данных /api/v1/…
// Не считаются: счётчики и статистика, карточка сервера, запрос цены платного файла без покупки и перебор адресов в поисках чужих секретов.
const NOT_WORK = /^\/mcp\/server-card$|^\/api\/v1\/(?:hit|stats)(?:\/|$)|^\/api\/v1\/violin\/midi$|^\/api\/v1\/radio\/track\/buy$|\/\.?env\b|\/config\/?$|\/models$/i;
export const isWorkPage = (page) => typeof page === "string" && (/^\/mcp\/[a-z]/i.test(page) || /^\/api\/v1\/[a-z]/i.test(page)) && !NOT_WORK.test(page);
export const isWorkAgent = (name) => typeof name === "string" && name.trim() !== "" && !WORK_SCANNER.test(name);

// rows: [{ day, name, page, n }] за последние дни; today — сегодняшняя дата YYYY-MM-DD
export function agentsAtWork(rows, today) {
  const by = new Map(), t = { calls: 0, names: new Set() }, w = { calls: 0, names: new Set() };
  for (const r of rows || []) { const n = +r.n || 0; if (n <= 0 || !isWorkAgent(r.name) || !isWorkPage(r.page)) continue;
    w.calls += n; w.names.add(r.name); if (r.day === today) { t.calls += n; t.names.add(r.name); }
    const a = by.get(r.name) || { name: r.name, calls: 0, pages: new Map() }; a.calls += n; a.pages.set(r.page, (a.pages.get(r.page) || 0) + n); by.set(r.name, a); }
  const top = [...by.values()].sort((a, b) => b.calls - a.calls).slice(0, 10).map((a) => ({ name: a.name, calls: a.calls, different_endpoints: a.pages.size, most_used: [...a.pages.entries()].sort((x, y) => y[1] - x[1]).slice(0, 3).map((x) => x[0]) }));
  return { today: { agents: t.names.size, calls: t.calls }, last_7d: { agents: w.names.size, calls: w.calls }, top_7d: top,
    rule: "Counted: MCP tool, prompt and resource calls and /api/v1 data requests. Not counted: catalogue and liveness probes, search-engine crawlers, our own checks, price requests for paid files without a purchase, hit and stats counters." };
}
