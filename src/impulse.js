// «Импульс» — главный датчик портала учёных: чей труд мир на самом деле берёт в работу.
// Считает вызовы датчиков учёных внешними программами (MCP и API) и посещения их страниц людьми. Без Claude, без голоса — только наш счётчик.
export const IMPULSE_OWN = /orbstudio|orb studio|lychee|playwright|headless|webdriver|puppeteer|selenium|lighthouse/i; // свои проверки и тесты — не считаются
// поисковики, каталоги и мониторы: видят датчик, но не пользуются им — считаются отдельно
export const IMPULSE_WATCHERS = /google|bing|apple|yandex|baidu|duckduck|petal|ahrefs|semrush|agent402|payai|x402|indexer|index\b|collector|observer|mcpbeat|uptime|monitor|probe|crawler|spider/i;
const DAY = 864e5, iso = (t) => new Date(t).toISOString().slice(0, 10);
export function impulseSensor(id, tool, api, rows, now) {
  const d7 = iso(now - 6 * DAY), d14 = iso(now - 13 * DAY), mine = rows.filter((r) => (r.kind === "agent" && (r.page === "/mcp/" + tool || r.page === api)) && !IMPULSE_OWN.test(r.name || ""));
  const use = mine.filter((r) => !IMPULSE_WATCHERS.test(r.name || "")), watch = mine.filter((r) => IMPULSE_WATCHERS.test(r.name || ""));
  const sum = (a) => a.reduce((s, r) => s + (+r.n || 0), 0), week = (a) => a.filter((r) => r.day >= d7), prev = (a) => a.filter((r) => r.day >= d14 && r.day < d7);
  const names = (a) => [...new Set(a.map((r) => String(r.name || "").replace(/^MCP · /, "")))].sort();
  const calls7 = sum(week(use)), callsPrev = sum(prev(use)), first = use.map((r) => r.day).sort()[0] || null;
  const views = rows.filter((r) => r.kind === "view" && r.page === id), views7 = sum(week(views));
  return { id, tool, calls_7d: calls7, calls_prev_7d: callsPrev, trend: calls7 > callsPrev ? "up" : calls7 < callsPrev ? "down" : calls7 ? "flat" : "none",
    programs_7d: names(week(use)).length, programs: names(week(use)).slice(0, 10), days_used_7d: new Set(week(use).map((r) => r.day)).size, first_external_use: first,
    via_mcp_7d: sum(week(use).filter((r) => r.page.startsWith("/mcp/"))), via_api_7d: sum(week(use).filter((r) => r.page.startsWith("/api/"))),
    watchers_7d: sum(week(watch)), watcher_names: names(week(watch)).slice(0, 10), human_views_7d: views7 };
}
// sensors: [{ id, tool, api }]
export function impulseReport(sensors, rows, now = Date.now()) {
  const list = sensors.map((s) => impulseSensor(s.id, s.tool, s.api, rows || [], now)).sort((a, b) => b.calls_7d - a.calls_7d || b.programs_7d - a.programs_7d || b.human_views_7d - a.human_views_7d);
  const leader = list.find((s) => s.calls_7d > 0) || null;
  return { sensor: "impulse", checked_at: new Date(now).toISOString(), period: "last 7 days vs the 7 days before", leader: leader ? leader.id : null, used_by_outside_agents: list.filter((s) => s.calls_7d > 0).length, sensors: list,
    excluded: "Our own checks and tests (Orb Studio scripts, link checker, headless browsers) are not counted. Search engines, catalogues and monitors are counted separately as watchers: they see a sensor but do not use it.",
    how_to_read: "calls_7d = calls by outside programs via MCP and API; programs_7d = how many different programs; days_used_7d = on how many days; trend compares with the week before; human_views_7d = page views by people. We do not know who stands behind a program, only its name." };
}
