// Датчик «Гамильтон» — в честь Маргарет Гамильтон (1936–2026), руководившей программой бортового ПО «Аполлона».
// Её принцип: при перегрузке система не падает, а отбрасывает второстепенное, сохраняет главное и честно сообщает, что отброшено.
// Датчик показывает это для самой Orb Studio: что работает полностью, что упрощено или устарело, и почему.
export const HAMILTON = {
  name: "Margaret Hamilton", years: "1936–2026",
  idea: "Under overload, keep the most important work running, drop the rest, and say clearly what was dropped and why (Apollo flight software, priority displays and restarts).",
  wiki: { ru: "https://ru.wikipedia.org/wiki/%D0%93%D0%B0%D0%BC%D0%B8%D0%BB%D1%8C%D1%82%D0%BE%D0%BD,_%D0%9C%D0%B0%D1%80%D0%B3%D0%B0%D1%80%D0%B5%D1%82_(%D1%83%D1%87%D1%91%D0%BD%D1%8B%D0%B9)",
    de: "https://de.wikipedia.org/wiki/Margaret_Hamilton_(Informatikerin)", en: "https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer)" },
  note: "Named in her honour. Orb Studio is not connected with Margaret Hamilton, her family or Hamilton Technologies.",
};
// Порядок важности: что система держит первым
export const HAMILTON_ORDER = ["music", "voice", "dj", "sensor_news", "radar_news", "regional", "self_check"];
const H = 3600e3;
export const HAMILTON_STALE = { sensor_news: 12 * H, radar_news: 6 * H, regional: 9 * H, self_check: 1.5 * H };
const age = (ts, now) => (Number.isFinite(ts) && ts > 0 ? now - ts : null);
// in: { health, sens: {stories, rejected, ts}, radarTs, regionTs, healthTs, air, now }
export function hamiltonReport(inp) {
  const now = inp.now || Date.now(), h = (inp.health && typeof inp.health === "object") ? inp.health : {}, info = h.info || {}, probs = Array.isArray(h.problems) ? h.problems : [];
  const out = [], add = (id, state, dropped, why, ts) => out.push({ id, priority: HAMILTON_ORDER.indexOf(id) + 1, state, dropped: dropped || [], why: why || [], updated: ts ? new Date(ts).toISOString() : null });
  const missing = probs.filter((p) => p.startsWith("track_missing:")).map((p) => p.slice(14));
  add("music", missing.length ? "degraded" : h.checked_at ? "full" : "unknown", missing, missing.length ? ["track_missing"] : [], inp.healthTs);
  const used = +info.voice_used, lim = +info.voice_limit;
  add("voice", !(lim > 0) ? "unknown" : used >= lim ? "down" : used >= 0.9 * lim ? "degraded" : "full", used >= 0.9 * lim ? ["speech_audio"] : [], used >= 0.9 * lim ? ["voice_budget_low"] : [], inp.healthTs);
  const links = +info.dj_links || 0, voiced = +info.dj_voiced || 0;
  add("dj", !links ? (probs.includes("dj_no_links") ? "down" : "unknown") : voiced < links ? "degraded" : "full", voiced < links ? ["dj_audio:" + (links - voiced)] : [], voiced < links ? ["dj_unvoiced"] : [], inp.healthTs);
  const s = inp.sens || {}, st = (s.stories && s.stories[inp.air]) || {}, rj = (s.rejected && s.rejected[inp.air]) || {};
  const dropped = Object.keys(rj), sa = age(s.ts, now);
  add("sensor_news", !Object.keys(st).length ? (dropped.length ? "down" : "unknown") : sa != null && sa > HAMILTON_STALE.sensor_news ? "stale" : dropped.length ? "degraded" : "full", dropped, dropped.map((k) => String(rj[k]).split(":")[0]), s.ts);
  for (const [id, ts] of [["radar_news", inp.radarTs], ["regional", inp.regionTs], ["self_check", inp.healthTs]]) { const a = age(ts, now);
    add(id, a == null ? "unknown" : a > HAMILTON_STALE[id] ? "stale" : "full", [], a != null && a > HAMILTON_STALE[id] ? ["not_updated"] : [], ts); }
  const worst = ["down", "degraded", "stale"].find((x) => out.some((c) => c.state === x)) || (out.every((c) => c.state === "full") ? "full" : "partial");
  return { sensor: "hamilton", status: worst, checked_at: new Date(now).toISOString(), air_language: inp.air, components: out, listeners_today: inp.listeners || null, honour: HAMILTON,
    how_to_read: "Components in priority order. full = works completely; degraded = works, something was dropped to keep it running (see dropped/why); stale = data older than its limit; down = not working now; unknown = no measurement yet." };
}
