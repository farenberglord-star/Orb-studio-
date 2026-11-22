// Портал «Датчики в честь учёных»: одна идея учёного → один датчик на живых данных Orb Studio.
// Правило (22.11.2026): датчик делаем, только если в проверке не нашлось инструмента с той же сутью; слово «уникальный» не пишем.
import { HAMILTON } from "./hamilton.js";
import { MIKRIN } from "./mikrin.js";
import { POLYAK } from "./polyak.js";
export const SCIENTISTS = [
  { id: "hamilton", honour: HAMILTON, field: "software engineering", tool: "get_hamilton", api: "/api/v1/hamilton",
    principle: "Under overload keep the main work running, set the rest aside and say what was set aside.",
    sensor: "What in Orb Studio works fully, what was set aside to keep the main things running, and why.",
    analog_check: { date: "2026-11-22", similar: "service status checks for agents (StatusGator, API Status Check, OutageDeck)", difference: "describes only Orb Studio and says what was set aside and why, not just up/down" } },
  { id: "mikrin", honour: MIKRIN, field: "spacecraft control", tool: "get_mikrin", api: "/api/v1/mikrin",
    principle: "Shorten the path: from about two days to the ISS to a few hours.",
    sensor: "How long a news story travels from its source to David's text and to the voice in the Orb Studio broadcast.",
    analog_check: { date: "2026-11-22", similar: "delivery latency of commercial news APIs (Webz.io, Opoint)", difference: "the path inside the Orb Studio broadcast, step by step, up to the synthetic voice" } },
  { id: "polyak", honour: POLYAK, field: "optimization", tool: "get_polyak", api: "/api/v1/polyak",
    principle: "Inertia of past steps (heavy ball) and averaging under noise (Polyak–Juditsky).",
    sensor: "Whether a change in the Orb Studio indices is a one-off jump or a sustained shift; past readings only.",
    analog_check: { date: "2026-11-22", similar: "moving averages and anomaly detection in general", difference: "applied to the Orb Studio indices with a one-word verdict: calm, jump or shift" } },
];
// live: { hamilton: report, mikrin: report, polyak: report } — краткая строка состояния для каждого датчика
export function scientistLine(id, r) {
  if (!r) return null;
  if (id === "hamilton") return { status: r.status, set_aside: (r.components || []).filter((c) => c.state !== "full" && c.state !== "unknown").map((c) => c.id) };
  if (id === "mikrin") { const b = (r.blocks || []).find((x) => x.id === r.shortest_path); return { shortest_path: r.shortest_path || null, minutes: b ? b.steps[0].minutes_median : null }; }
  if (id === "polyak") return { moving: (r.series || []).filter((s) => s.verdict === "jump" || s.verdict === "shift").map((s) => ({ id: s.id, verdict: s.verdict, direction: s.direction })) };
  return null;
}
export function scientistsIndex(origin, live = {}) {
  return { portal: "Orb Studio — sensors in honour of scientists", page: origin + "/tools/scientists", free: true, no_key: true, mcp: origin + "/mcp",
    rule: "A sensor is made only when a check finds no tool with the same essence; similar tools are named openly. The word 'unique' is not used.",
    sensors: SCIENTISTS.map((s) => ({ id: s.id, scientist: s.honour.name, years: s.honour.years || null, died: s.honour.died || null, field: s.field, principle: s.principle, sensor: s.sensor,
      api: origin + s.api, mcp_tool: s.tool, pages: { ru: origin + "/tools/" + s.id, de: origin + "/de/tools/" + s.id, en: origin + "/en/tools/" + s.id }, wikipedia: s.honour.wiki, note: s.honour.note,
      analog_check: s.analog_check, now: scientistLine(s.id, live[s.id]) })) };
}
