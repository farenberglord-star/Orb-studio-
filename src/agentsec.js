// Радар агентской безопасности: опубликованные уязвимости в пакетах MCP и популярных агентских библиотек.
// Источник: GitHub Advisory Database (REST, без ключа, лицензия CC-BY 4.0). Только факты «что опубликовано и когда»: ни оценок, ни индексов, ни прогнозов.
// Список пакетов наш и неполный: отсутствие записи не означает, что пакет безопасен.

export const WATCH = {
  npm: ["@modelcontextprotocol/sdk", "@modelcontextprotocol/server", "@modelcontextprotocol/node", "@modelcontextprotocol/hono", "@modelcontextprotocol/inspector", "@modelcontextprotocol/server-filesystem", "langchain", "@langchain/core", "@langchain/community", "llamaindex"],
  pip: ["mcp", "fastmcp", "mcp-server-git", "langchain", "langchain-core", "langchain-community", "langgraph", "llama-index", "crewai", "pyautogen"],
};
export const ATTRIBUTION = "GitHub Advisory Database (https://github.com/advisories), licensed CC-BY 4.0 (https://creativecommons.org/licenses/by/4.0/). Orb Studio reduced each record to a short list of fields and shortened the summary; nothing else was changed.";
const KEEP = 25, DAY = 864e5;

export function advisoriesUrl(eco, now = Date.now()) {
  return "https://api.github.com/advisories?ecosystem=" + eco + "&affects=" + encodeURIComponent(WATCH[eco].join(",")).replace(/%2C/g, ",").replace(/%40/g, "@").replace(/%2F/g, "/") + "&per_page=30&sort=published&direction=desc";
}
export async function fetchAdvisories(fetcher = fetch) {
  const out = {};
  for (const eco of Object.keys(WATCH)) {
    const r = await fetcher(advisoriesUrl(eco), { headers: { accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28", "user-agent": "orbstudio.org (open data dashboard)" }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error("github advisories " + r.status + (r.status === 403 || r.status === 429 ? " (rate limit)" : ""));
    const j = await r.json();
    if (!Array.isArray(j)) throw new Error("github advisories: unexpected answer");
    out[eco] = j;
  }
  return out;
}

const clean = (t, n) => String(t == null ? "" : t).replace(/<[^>]*(>|$)/g, "").replace(/[\u0000-\u001f\u007f­᠎​-‏‪-‮⁠-⁤⁦-⁩﻿]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
const okUrl = (u) => (typeof u === "string" && /^https:\/\/github\.com\/advisories\/GHSA-[0-9a-z-]+$/i.test(u) ? u : null);

// Записи из ответа GitHub в короткий вид; в список попадают только пакеты из нашего списка.
export function parseAdvisories(byEco) {
  const seen = new Map();
  for (const eco of Object.keys(byEco || {})) {
    const watch = new Set(WATCH[eco] || []);
    for (const a of Array.isArray(byEco[eco]) ? byEco[eco] : []) {
      if (!a || typeof a.ghsa_id !== "string" || !/^GHSA-[0-9a-z-]+$/i.test(a.ghsa_id) || !a.published_at) continue;
      const pk = [];
      for (const v of Array.isArray(a.vulnerabilities) ? a.vulnerabilities : []) {
        const p = v && v.package; if (!p || p.ecosystem !== eco || !watch.has(p.name)) continue;
        pk.push({ ecosystem: eco, name: clean(p.name, 80), vulnerable_range: clean(v.vulnerable_version_range, 60) || null, first_patched: clean(v.first_patched_version, 30) || null });
      }
      if (!pk.length) continue;
      const prev = seen.get(a.ghsa_id);
      if (prev) { for (const p of pk) if (!prev.packages.some((x) => x.ecosystem === p.ecosystem && x.name === p.name)) prev.packages.push(p); continue; }
      seen.set(a.ghsa_id, { id: a.ghsa_id, published_at: new Date(a.published_at).toISOString(), updated_at: a.updated_at ? new Date(a.updated_at).toISOString() : null,
        severity: ["low", "medium", "high", "critical"].includes(a.severity) ? a.severity : null, summary: clean(a.summary, 160), url: okUrl(a.html_url) || ("https://github.com/advisories/" + a.ghsa_id),
        withdrawn: !!a.withdrawn_at, packages: pk.slice(0, 6) });
    }
  }
  return [...seen.values()].sort((x, y) => (x.published_at < y.published_at ? 1 : -1));
}

export function summarizeAdvisories(byEco, now = new Date()) {
  const all = parseAdvisories(byEco).filter((x) => !x.withdrawn), t = now.getTime();
  const within = (d) => all.filter((x) => t - Date.parse(x.published_at) <= d * DAY);
  const bySev = (l) => { const o = { critical: 0, high: 0, medium: 0, low: 0 }; for (const x of l) if (x.severity) o[x.severity]++; return o; };
  const w7 = within(7), w30 = within(30);
  return {
    published_last_7d: { count: w7.length, by_severity: bySev(w7) },
    published_last_30d: { count: w30.length, by_severity: bySev(w30) },
    latest: all.slice(0, KEEP),
    latest_published_at: all[0] ? all[0].published_at : null,
    watched_packages: WATCH,
    computed_at: now.toISOString(),
  };
}
