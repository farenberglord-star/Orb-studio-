// Датчик «Харман» — в честь Гилберта Хармана (1938–2021), «Изменение взглядов» (Change in View, 1986): разумно пересматривать убеждения,
// когда приходят новые свидетельства, — и держать уверенность соразмерной тому, как часто её приходится пересматривать.
// Первый датчик зоны 8 («граница своего знания»), и он проверяет не новости, а нас самих: паспорт новости ставит каждой истории
// уверенность (high / medium / low) в момент, когда она впервые появилась на радаре. Через 72 часа видно, что с ней стало:
// появилось ли опровержение или поправка к той же истории. Если «высокая уверенность» опровергается не реже «низкой» — паспорт переоценивает себя.
import { DENY_RE } from "./echo.js";

export const HARMAN = {
  name: "Gilbert Harman", years: "1938–2021",
  idea: "'Change in View' (1986): revise beliefs when new evidence arrives, and keep confidence in proportion to how often it has to be revised.",
  wiki: { en: "https://en.wikipedia.org/wiki/Gilbert_Harman", ru: "https://en.wikipedia.org/wiki/Gilbert_Harman" },
  note: "Named in his honour. Orb Studio is not connected with Gilbert Harman, his family or Princeton University.",
};
export const HARMAN_WINDOW = 72 * 3600e3, HARMAN_MIN = 20;
export const CORRECTION_RE = new RegExp(DENY_RE.source.replace(/\)\(\?!\[\\p\{L\}\]\)$/, "") + "|retract\\p{L}*|correct(?:ion|ed|s)|clarif\\p{L}*|walks? back|u-turn|backtrack\\p{L}*|korrigiert\\p{L}*|richtigstell\\p{L}*|zurückgezogen|widerruf\\p{L}*|präzisiert|исправ\\p{L}*|уточн\\p{L}*|отозва\\p{L}*|дезинформац\\p{L}*)(?![\\p{L}])", "iu");
const content = (t) => new Set(String(t || "").toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, " ").split(/\s+/).filter((w) => w.length >= 5));
const pct = (a, b) => (b ? Math.round((100 * a) / b) : null);

// та же ли это история: не меньше 40 % значимых слов исходного заголовка (и хотя бы два слова) есть в другом
export function sameStory(a, b) {
  const A = content(a), B = content(b); if (A.size < 2 || !B.size) return false;
  let k = 0; for (const w of A) if (B.has(w) || [...B].some((x) => x.length >= 6 && w.length >= 6 && (x.startsWith(w.slice(0, 6)) || w.startsWith(x.slice(0, 6))))) k++;
  return k >= 2 && k / A.size >= 0.4;
}
export function harmanReport(rows, now = Date.now(), since = null) {
  const all = (rows || []).filter((r) => r && r.headline && Number.isFinite(+r.first_ts));
  const corr = all.filter((r) => CORRECTION_RE.test(r.headline));
  const done = all.filter((r) => r.conf && +r.first_ts <= now - HARMAN_WINDOW && !CORRECTION_RE.test(r.headline));
  const levels = {}, examples = [], layered = [];
  for (const s of done) {
    const t0 = +s.first_ts, hit = corr.find((c) => c.k !== s.k && +c.first_ts >= t0 && +c.first_ts <= t0 + HARMAN_WINDOW && sameStory(s.headline, c.headline));
    const L = (levels[s.conf] = levels[s.conf] || { stories: 0, challenged: 0, widened: 0 });
    L.stories++; if (hit) { L.challenged++; if (examples.length < 6) examples.push({ confidence: s.conf, headline: s.headline, radar: s.radar, later: hit.headline }); }
    if (+s.n_max >= 3) L.widened++;
    if (s.fired != null) layered.push({ s, hit, fired: String(s.fired).split(",").filter(Boolean) });
  }
  const out = ["high", "medium", "low"].map((c) => { const L = levels[c] || { stories: 0, challenged: 0, widened: 0 }; return { confidence: c, ...L, challenged_pct: pct(L.challenged, L.stories), widened_pct: pct(L.widened, L.stories) }; });
  const ready = out.filter((x) => x.stories >= HARMAN_MIN), hi = out[0], lo = out[2];
  const verdict = ready.length < 2 ? "collecting" : hi.stories >= HARMAN_MIN && lo.stories >= HARMAN_MIN && hi.challenged_pct > lo.challenged_pct ? "overconfident"
    : ready.every((x, i, a) => i === 0 || a[i - 1].challenged_pct <= x.challenged_pct + 2) ? "calibrated" : "mixed";
  return {
    sensor: "harman", verdict, levels: out, examples, layers: layersReport(layered), cry_wolf: cryWolfReport(all.filter((r) => r.fired != null && !CORRECTION_RE.test(r.headline)), layered),
    stories_resolved: done.length, stories_waiting: all.filter((r) => r.conf && +r.first_ts > now - HARMAN_WINDOW).length, corrections_seen: corr.length,
    question: "Is the Orb Studio news passport honest about its own confidence — are stories it rated 'high' challenged less often than those it rated 'low'?",
    method: `The passport's confidence (high / medium / low) is stored when a story first appears on a radar. ${HARMAN_WINDOW / 3600e3} hours later, the story counts as challenged if another radar headline with denial, retraction or correction words (denies, retracts, corrects, dementiert, korrigiert, опроверг, исправ…) appeared in that window and shares at least 40% of its key words. Widened = 3+ outlets at the peak. Calibrated = the challenged share does not fall as confidence rises; overconfident = 'high' is challenged more often than 'low'. A verdict needs ${HARMAN_MIN} resolved stories in at least two levels. Word rules, no AI.`,
    rule: "Check your own confidence against what later happened; if your 'sure' is overturned as often as your 'unsure', lower it.",
    caveat: "Most corrections never reach a headline, so the challenged share is a floor, not the full error rate; it compares levels with each other.",
    bridge: "Crystal Library: Harman (belief revision) + Festinger (failed predictions are explained away) + Lindley and Brier (honest confidence) + the news passport — the first sensor of zone 8, own limits.",
    history_since: since ? new Date(+since).toISOString() : null,
    honour: HARMAN, similar: "Calibration and reliability diagrams are standard in weather and forecast verification; this sensor checks the calibration of a live news-checking rule set against later corrections, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}

// «Ризон» (модель швейцарского сыра): по оспоренным историям — какие проверки паспорта подняли тревогу при первом появлении,
// а какие истории прошли сквозь все слои молча. Проверка, которая чаще срабатывает на оспоренных, чем на остальных, — работающий слой.
export const REASON_MIN = 10;
const LAYER_OF = { stale: "1 freshness", not_event: "3 fact or claim", few_voices: "3 fact or claim", quoted: "3 fact or claim", found_document: "3 fact or claim",
  extraordinary: "3 fact or claim", rumour_risk: "3 fact or claim", state_media: "3 fact or claim", amplified: "3 fact or claim", vague: "4 checkability", metaphor: "7 look-alike", tone: "7 look-alike" };
export function layersReport(layered) {
  const ch = layered.filter((x) => x.hit), rest = layered.filter((x) => !x.hit), share = (a, id) => (a.length ? Math.round((100 * a.filter((x) => x.fired.includes(id)).length) / a.length) : null);
  const checks = Object.keys(LAYER_OF).map((id) => ({ check: id, layer: LAYER_OF[id], fired_on_challenged_pct: share(ch, id), fired_on_rest_pct: share(rest, id) }))
    .filter((c) => c.fired_on_challenged_pct || c.fired_on_rest_pct);
  const passed = ch.filter((x) => !x.fired.length);
  return {
    stories_with_layers: layered.length, challenged: ch.length, verdict: ch.length < REASON_MIN ? "collecting" : "measured",
    passed_all_layers: passed.length, passed_all_layers_pct: ch.length ? Math.round((100 * passed.length) / ch.length) : null,
    passed_examples: passed.slice(0, 5).map((x) => ({ headline: x.s.headline, radar: x.s.radar, later: x.hit.headline })),
    checks,
    rule: "For each later-challenged story, look at which passport checks raised a warning at first sight; a check that fires more often on challenged stories than on the rest is a working layer, and stories that passed every layer silently show the hole to close.",
    bridge: "Crystal Library bridge 'holes in the layers': Reason ('Human Error', 1990, the Swiss-cheese model) + Bobbio (rule conflicts) + Harman.",
    since: "2026-11-24 (checks are stored from this day)", min_challenged: REASON_MIN,
  };
}

// «Крик „волк“» — мостик Пирсон (цена ложной тревоги) + Харман + Несселроуд; опора — Брезниц, «Cry Wolf» (1984), карточка ждёт некролога.
// Если тревожная строка стоит почти в каждом паспорте, её перестают замечать. Считаем, как часто паспорт тревожит,
// и (когда накопятся оспоренные истории) — оспаривают ли предупреждённые истории чаще, чем молчаливые.
export const WOLF_HIGH = 70;
export function cryWolfReport(stored, layered) {
  const n = stored.length, warned = stored.filter((r) => String(r.fired).length > 0).length;
  const per = {}; for (const r of stored) for (const id of String(r.fired).split(",").filter(Boolean)) per[id] = (per[id] || 0) + 1;
  const w = layered.filter((x) => x.fired.length), q = layered.filter((x) => !x.fired.length), rate = (a) => (a.length ? Math.round((100 * a.filter((x) => x.hit).length) / a.length) : null);
  const ch = layered.filter((x) => x.hit).length, alarm = n ? Math.round((100 * warned) / n) : null;
  return {
    stories: n, warned, alarm_rate_pct: alarm, crying_wolf: alarm != null && n >= 50 && alarm >= WOLF_HIGH,
    by_check_pct: Object.fromEntries(Object.entries(per).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, Math.round((100 * v) / n)])),
    challenged_when_warned_pct: rate(w), challenged_when_silent_pct: rate(q),
    verdict: ch < REASON_MIN ? "collecting" : rate(w) > rate(q) ? "warnings_informative" : "warnings_not_informative",
    rule: `If most passports carry a warning, warnings stop being noticed (cry wolf). Keep warnings for the stories that are later challenged more often; a check that fires on most stories but not more often on challenged ones should be narrowed. crying_wolf = warnings on ${WOLF_HIGH}% or more of at least 50 stories.`,
    bridge: "Crystal Library bridge 'cry wolf': E. Pearson (cost of a false alarm) + Harman + Nesselroade; Breznitz's 'Cry Wolf: The Psychology of False Alarms' (1984) joins when his death is confirmed by an obituary.",
  };
}
