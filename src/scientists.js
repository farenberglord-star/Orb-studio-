// Портал «Датчики в честь учёных»: одна идея учёного → один датчик на живых данных Orb Studio.
// Правило (22.11.2026): датчик делаем, только если в проверке не нашлось инструмента с той же сутью; слово «уникальный» не пишем.
import { HAMILTON } from "./hamilton.js";
import { MIKRIN } from "./mikrin.js";
import { POLYAK } from "./polyak.js";
import { PARK } from "./park.js";
import { KAHNEMAN } from "./kahneman.js";
import { ZIV } from "./ziv.js";
import { COX } from "./cox.js";
import { HALPERN } from "./halpern.js";
import { HOWARD } from "./howard.js";
import { LEAMER } from "./leamer.js";
import { BAIRD } from "./baird.js";
import { LYBERG } from "./lyberg.js";
import { HAGENAUER } from "./hagenauer.js";
import { FRANKFURT } from "./frankfurt.js";
import { DUCKWORTH } from "./duckworth.js";
import { TREVISAN } from "./trevisan.js";
import { BERTSEKAS } from "./bertsekas.js";
import { RABIN } from "./rabin.js";
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
  { id: "park", honour: PARK, field: "physics, science and pseudoscience", tool: "get_park", api: "/api/v1/park",
    principle: "The seven warning signs of bogus science.",
    sensor: "Warning signs of bogus science in today's science headlines, each with the exact quoted words.",
    analog_check: { date: "2026-11-22", similar: "Anti-Bullshit MCP (analysis of a single claim), research detectors of exaggeration in science news, SciLens (quality of science news articles)", difference: "a regular check of a live news stream on Park's seven signs, with the exact words from the headline" } },
  { id: "kahneman", honour: KAHNEMAN, field: "psychology of judgement and decision", tool: "get_kahneman", api: "/api/v1/kahneman",
    principle: "Noise: judgements of the same case are scattered; system noise = level noise + pattern noise.",
    sensor: "A noise audit of three AI guests rating the same news for importance and confidence.",
    analog_check: { date: "2026-11-22", similar: "MCP 'councils' that ask several models a question (llm-council, model-council-mcp, llm-deliberate-mcp, mcp-rubber-duck)", difference: "a regular noise audit of three models on live news, split into level and pattern noise, instead of a way to ask" } },
  { id: "ziv", honour: ZIV, field: "information theory, data compression", tool: "get_ziv", api: "/api/v1/ziv",
    principle: "Lossless compression: what repeats costs almost nothing, only the new part takes space.",
    sensor: "How much of today's radar headlines is really new against yesterday's, measured by LZ compression.",
    analog_check: { date: "2026-11-22", similar: "research on duplicate news detection (Microsoft Research) and normalized compression distance", difference: "a live daily novelty reading for agents on the Orb Studio radars, without a language model" } },
  { id: "cox", honour: COX, field: "statistics, survival analysis", tool: "get_cox", api: "/api/v1/cox",
    principle: "Proportional hazards: how a factor changes the risk of an event at any moment, using also cases where it has not happened yet.",
    sensor: "How long a news story lives on each Orb Studio radar: Kaplan–Meier median and Cox hazard ratio.",
    analog_check: { date: "2026-11-22", similar: "article lifespan analytics for publishers (Chartbeat) and research on the half-life of news (Oxford Internet Institute)", difference: "a live survival reading per radar for agents, with censoring and hazard ratios" } },
  { id: "halpern", honour: HALPERN, field: "logic, knowledge and causality", tool: "get_halpern", api: "/api/v1/halpern",
    principle: "Actual causality: a cause is what, had it been different, would have changed the outcome – the smallest such set.",
    sensor: "Which headlines moved an Orb Studio index in the last 6 hours, and what the index is made of now.",
    analog_check: { date: "2026-11-22", similar: "root-cause analysis of metric changes in monitoring systems (for example Datadog) and feature attribution libraries such as SHAP", difference: "a counterfactual test over the live Orb Studio indices that names the very headlines, with source and radar" } },
  { id: "howard", honour: HOWARD, field: "decision analysis, value of information", tool: "get_howard", api: "/api/v1/howard",
    principle: "Value of information: learn more before deciding only when it could change the decision; otherwise act now.",
    sensor: "Retell now or wait: how often stories carried by 1-2 outlets were later carried by 3+ outlets, and after how many hours, by the age of the story.",
    analog_check: { date: "2026-11-22", similar: "corroborate-mcp (counts corroborating sources now), Reuters News Tracer (internal credibility score for tweets), news fact-check MCP servers", difference: "uses the site's own history to say how often and how soon unconfirmed stories got confirmed, as a wait-or-tell hint for agents" } },
  { id: "leamer", honour: LEAMER, field: "econometrics, specification uncertainty", tool: "get_leamer", api: "/api/v1/leamer",
    principle: "Extreme bounds: a conclusion is credible only if it survives the reasonable choices of the model; report the range, not one number.",
    sensor: "How fragile the Orb Studio indices are: each one recomputed under every reasonable alternative choice, with low-high bounds and the choices that move it most.",
    analog_check: { date: "2026-11-22", similar: "extreme bounds analysis (R package ExtremeBounds), specification curve analysis (Simonsohn et al.), multiverse analysis", difference: "runs live on the site's own published indices and names the radar or keyword the number depends on most" } },
  { id: "baird", honour: BAIRD, field: "metrology, measurement standards", tool: "get_baird", api: "/api/v1/baird",
    principle: "Traceability: a measured value counts only with an unbroken chain to its reference - source, time, unit - and when independent routes agree.",
    sensor: "A live passport for every sensor number of the site: source, time, age, unit, plausible range, primary or derived, and cross-checks by independent routes.",
    analog_check: { date: "2026-11-22", similar: "data lineage and provenance standards (W3C PROV, OpenLineage), Wikidata references per statement", difference: "a public, live passport per published number for agents, with staleness, unit sanity and independent cross-checks" } },
  { id: "lyberg", honour: LYBERG, field: "survey statistics, data quality", tool: "get_lyberg", api: "/api/v1/lyberg",
    principle: "Total survey error: coverage, nonresponse, measurement and processing errors add up and are reported together, not only sampling noise.",
    sensor: "What the radars do not see: languages and world regions covered or missing, feeds that did not answer, items dropped in processing, with a ready caveat for agents.",
    analog_check: { date: "2026-11-22", similar: "Ground News Blindspot (stories covered by one political side), Media Cloud and GDELT source-coverage dashboards for researchers", difference: "a live total-error report of one news feed for agents: language and region coverage, nonresponse per feed and processing losses" } },
  { id: "hagenauer", honour: HAGENAUER, field: "information theory, soft-decision decoding", tool: "get_hagenauer", api: "/api/v1/hagenauer",
    principle: "Soft decisions: keep how reliable a decision is instead of rounding a noisy signal to 0 or 1.",
    sensor: "Margin to the next threshold for every label the site publishes, with the label it would flip to, sorted from the shakiest.",
    analog_check: { date: "2026-11-22", similar: "decision margins, calibrated confidence and conformal prediction inside machine-learning models", difference: "applied live to every published label of a public site, across all its sensors, for agents" } },
  { id: "frankfurt", honour: FRANKFURT, field: "moral philosophy, philosophy of language", tool: "get_frankfurt", api: "/api/v1/frankfurt",
    principle: "On Bullshit: talk that does not care about truth leaves nothing to check.",
    sensor: "Checkable anchors (who, when, how many, where) and vague formulas in every radar headline, with shares per radar; the same verdict in check_headline.",
    analog_check: { date: "2026-11-22", similar: "retext-intensify and SEO vague-language detectors (weasel words in a text), ClaimBuster (check-worthiness of sentences), research on vagueness and fake news", difference: "counts checkable anchors live across a news feed per radar and adds the verdict to every check_headline answer" } },
  { id: "duckworth", honour: DUCKWORTH, field: "statistics, fair comparison", tool: "get_duckworth", api: "/api/v1/duckworth",
    principle: "When a match is interrupted, reset the target by the resources actually available, not by the full game.",
    sensor: "Each index now against the same time of day yesterday and over 7 days, next to the naive 24-hour average; how much of a change is only the daily rhythm.",
    analog_check: { date: "2026-11-22", similar: "seasonal adjustment (X-13ARIMA-SEATS, STL) and same-period comparisons in analytics dashboards", difference: "a live same-time-of-day comparison for the site's own indices, with the rhythm effect stated" } },
  { id: "trevisan", honour: TREVISAN, field: "theory of computation, sublinear algorithms", tool: "get_trevisan", api: "/api/v1/trevisan",
    principle: "A well-chosen random sample can answer without reading all the data.",
    sensor: "The smallest random sample of radar headlines that reproduces each index within ±5 points, with the tokens an agent saves.",
    analog_check: { date: "2026-11-22", similar: "sample-size calculators, sublinear and property-testing algorithms", difference: "measured live on the site's own headlines and indices, with the token saving for agents" } },
  { id: "bertsekas", honour: BERTSEKAS, field: "optimisation, dynamic programming", tool: "get_bertsekas", api: "/api/v1/bertsekas",
    principle: "Minimise the total cost of the whole chain of decisions, not each step alone.",
    sensor: "Measured answer size in tokens of every Orb Studio tool and the cheapest call chains for typical agent questions.",
    analog_check: { date: "2026-11-22", similar: "tool routers and tool search in MCP clients and Composio, LLM token cost calculators", difference: "measured answer sizes of one site's tools and ready cheapest chains for typical questions" } },
  { id: "rabin", honour: RABIN, field: "theory of computation, randomised algorithms", tool: "get_rabin", api: "/api/v1/rabin",
    principle: "A few random checks can tell almost as much about a large set as checking everything.",
    sensor: "Random hourly spot checks of radar headlines against the source pages: matches, partly, differs or unreachable.",
    analog_check: { date: "2026-11-22", similar: "link checkers and uptime monitors, feed validators, NewsDiffs-style edit trackers", difference: "random sampling of a live news feed comparing its headlines with the source pages" } },
];
// live: { hamilton: report, mikrin: report, polyak: report } — краткая строка состояния для каждого датчика
export function scientistLine(id, r) {
  if (!r) return null;
  if (id === "hamilton") return { status: r.status, set_aside: (r.components || []).filter((c) => c.state !== "full" && c.state !== "unknown").map((c) => c.id) };
  if (id === "mikrin") { const b = (r.blocks || []).find((x) => x.id === r.shortest_path); return { shortest_path: r.shortest_path || null, minutes: b ? b.steps[0].minutes_median : null }; }
  if (id === "halpern") { const c = (r.indices || []).find((x) => x.id === "consensus"); return c ? { verdict: c.verdict, shift: c.shift, causes: (c.causes || []).length } : null; }
  if (id === "duckworth") { const g = (r.series || []).find((x) => x.id === "consensus"); return { verdict: r.verdict, rhythm_effect: g ? g.rhythm_effect : null }; }
  if (id === "trevisan") { const c = (r.indices || []).find((x) => x.id === "consensus"); return c ? { enough: c.enough_headlines, of: c.of } : { enough: null }; }
  if (id === "bertsekas") return { tools: (r.tools || []).length, recipes: (r.recipes || []).length };
  if (id === "rabin") return { verdict: r.verdict, checks: r.checks, differs_pct: r.shares ? r.shares.differs : null };
  if (id === "frankfurt") return { verdict: r.verdict, nothing_to_check_pct: r.shares ? r.shares.nothing_to_check : null, checkable_pct: r.shares ? r.shares.checkable : null };
  if (id === "hagenauer") return { verdict: r.verdict, on_edge: r.on_edge, total: r.total };
  if (id === "lyberg") return { verdict: r.verdict, main_language: r.coverage ? r.coverage.main_language : null, regions_not_seen: r.coverage ? r.coverage.regions_not_seen.length : null, silent: r.nonresponse ? r.nonresponse.silent : null };
  if (id === "baird") return { verdict: r.verdict, traced: r.traced, total: r.total, failures: r.failures };
  if (id === "leamer") { const c = (r.indices || []).find((x) => x.id === "consensus"); return c ? { verdict: r.verdict, value: c.value, low: c.low, high: c.high } : null; }
  if (id === "howard") { const b = (r.by_age || [])[0]; return { verdict: r.verdict, tracked: r.stories_tracked, p_confirm: b ? b.p_confirm : null, median_wait_h: b ? b.median_wait_h : null }; }
  if (id === "kahneman") return { topics_rated: r.topics_rated, system_noise: r.audit && r.audit.importance ? r.audit.importance.system_noise : null };
  if (id === "ziv") return { novelty_all: r.novelty_all };
  if (id === "cox") return { median_hours_all: r.median_hours_all, stories: r.stories };
  if (id === "park") return { checked: r.headlines_checked, with_signs: r.headlines_with_signs };
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
