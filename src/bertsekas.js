// Датчик «Бертсекас» — в честь Димитри Бертсекаса (1942–2026), профессора MIT, автора книг по динамическому
// программированию и оптимизации: дешевле всего не каждый шаг по отдельности, а вся цепочка решений. Здесь — сколько
// токенов стоит ответ каждого инструмента Orb Studio и какая цепочка вызовов дешевле всего отвечает на типовой вопрос агента.
export const BERTSEKAS = {
  name: "Dimitri Bertsekas", years: "1942–2026",
  idea: "Dynamic programming: minimise the total cost of a chain of decisions, not the cost of each step alone.",
  wiki: { en: "https://en.wikipedia.org/wiki/Dimitri_Bertsekas", ru: "https://en.wikipedia.org/wiki/Dimitri_Bertsekas" },
  note: "Named in his honour. Orb Studio is not connected with Dimitri Bertsekas, his family or MIT.",
};
export const tokensOf = (obj) => Math.ceil(JSON.stringify(obj ?? null).length / 4);
// Типовые вопросы агента: дешёвая цепочка и «наивная» (прочитать всё подряд). Обе отвечают на вопрос.
export const BERTSEKAS_RECIPES = [
  { id: "is_index_solid", question: "Is this Orb Studio index number solid enough to quote?", cheap: ["get_hagenauer"], naive: ["get_agent_indices", "get_leamer", "get_polyak", "get_radars"] },
  { id: "where_number_from", question: "Where does this sensor number come from and is it fresh?", cheap: ["get_baird"], naive: ["get_sensors", "get_hagenauer"] },
  { id: "what_radars_miss", question: "What do the radars not see right now?", cheap: ["get_lyberg"], naive: ["get_radars", "get_sensors"] },
  { id: "why_index_moved", question: "Why did an index move in the last hours?", cheap: ["get_polyak", "get_halpern"], naive: ["get_agent_indices", "get_radars", "get_halpern"] },
  { id: "which_thinking_rule", question: "Which reasoning rule applies to this blind spot?", cheap: ["get_crystals"], naive: ["list_scientist_sensors", "get_crystals"] },
  { id: "headline_checkable", question: "Is there anything checkable in today's headlines?", cheap: ["get_frankfurt"], naive: ["get_radars", "get_frankfurt"] },
];
export function bertsekasReport(sizes, now = Date.now()) {
  const tools = Object.entries(sizes || {}).filter(([, v]) => Number.isFinite(v)).map(([tool, tokens]) => ({ tool, tokens })).sort((a, b) => a.tokens - b.tokens);
  const cost = (chain) => chain.reduce((a, t) => a + (Number.isFinite(sizes[t]) ? sizes[t] : NaN), 0);
  const recipes = BERTSEKAS_RECIPES.map((r) => { const c = cost(r.cheap), nv = cost(r.naive); return { ...r, cheap_tokens: Number.isFinite(c) ? c : null, naive_tokens: Number.isFinite(nv) ? nv : null, saved_pct: Number.isFinite(c) && Number.isFinite(nv) && nv > 0 ? Math.round(100 * (1 - c / nv)) : null }; });
  return {
    sensor: "bertsekas", verdict: tools.length ? "measured" : "no_data", tools, recipes,
    question: "How many tokens does each Orb Studio tool answer cost an agent, and which chain of calls answers a typical question most cheaply?",
    method: "Every 6 hours the sensor calls each read-only Orb Studio MCP tool that needs no input and measures the size of its answer (JSON characters / 4 ≈ tokens). For typical agent questions it compares a cheap chain of calls with a naive one (read everything) that also answers the question. check_headline and other tools that need input or call outside services are not measured.",
    rule: "Call the cheapest chain that answers your question; read raw headlines (get_radars) only when you need the headlines themselves.",
    honour: BERTSEKAS, similar: "Tool routers and tool search for agents (in MCP clients, Composio and others) choose which tool to call; LLM cost calculators price tokens. This sensor publishes the measured answer size of every tool of one site and the cheapest call chains for typical questions.",
    generated_at: new Date(now).toISOString(),
  };
}
