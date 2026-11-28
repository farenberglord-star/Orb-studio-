// «Новости по теме с паспортом»: одна точка входа для агента. Новость + паспорт, где у каждой строки названы датчик и кристалл (учёный), который её дал.
// Паспорт не говорит «правда» или «фейк»: он называет признаки и причины со словами из заголовка; чего не измерили — null, а не «чисто».
// Связка: кристалл (идея учёного → правило) → мостик → датчик → строка паспорта → агент. Учёный без строки здесь остаётся кристаллом библиотеки.
import { askTokens, askHit, INJECTION, UNTRUSTED_NOTE } from "./ask.js";
import { frankfurtHeadline } from "./frankfurt.js";

// scope: per_headline — применимо к отдельной новости; headline_only — только если заголовок попал в выборку датчика (иначе null: «не смотрели», не «чисто»);
// aggregate — датчик о ленте в целом (отдельной новости не касается); topic — по теме вопроса; system — о самом Orb Studio.
// status: live — строка в ответе сейчас; partial — частично; not_wired — датчик есть, к отдельной новости не подключён; missing — строки нет и данных нет.
export const PASSPORT_TABLE = [
  { line: "speech_act", scope: "per_headline", status: "live", sensor: { tool: "get_searle", page: "/tools/searle" }, crystals: ["searle"], note: "event / statement / promise / threat / demand / forecast / question" },
  { line: "checkability", scope: "per_headline", status: "live", sensor: { tool: "get_frankfurt", page: "/tools/frankfurt" }, crystals: ["frankfurt"], note: "who / when / how many / where, and vague words" },
  { line: "state_media", scope: "per_headline", status: "live", sensor: { tool: "get_lyberg", page: "/tools/lyberg" }, crystals: ["lyberg"], note: "source is state media, named as such" },
  { line: "retellings_vs_first_source", scope: "per_headline", status: "live", sensor: { tool: "get_kasperson", page: "/tools/kasperson" }, crystals: ["kasperson", "zajonc", "howard"], note: "outlets at first and at the peak; first source on our radars" },
  { line: "independent_voices", scope: "per_headline", status: "live", sensor: { tool: "check_headline", page: "/api/v1/check" }, crystals: ["howard"], note: "how many outlets carry it on the radars" },
  { line: "freshness", scope: "per_headline", status: "partial", sensor: { tool: "get_mikrin", page: "/tools/mikrin" }, crystals: ["mikrin", "cox"], note: "age from the source's publication time; Mikrin measures our own path to air for the broadcast blocks, not each headline" },
  { line: "extraordinary_claim", scope: "per_headline", status: "live", sensor: null, crystals: ["hume", "laplace"], note: "record / unprecedented / first ever with few outlets" },
  { line: "quoted_words", scope: "per_headline", status: "live", sensor: null, crystals: ["derrida", "schleiermacher"], note: "someone's words in the headline; say whose and where" },
  { line: "found_document", scope: "per_headline", status: "live", sensor: null, crystals: ["valla"], note: "leaked or newly found document or recording" },
  { line: "metaphor", scope: "per_headline", status: "live", sensor: null, crystals: ["max_mueller"], note: "figure of speech in place of a fact" },
  { line: "loaded_words", scope: "per_headline", status: "live", sensor: null, crystals: ["osgood"], note: "emotionally loaded words, quoted" },
  { line: "rumour_risk", scope: "per_headline", status: "live", sensor: null, crystals: ["allport", "cantril"], note: "grave topic × few outlets × unclear facts" },
  { line: "evidence_chain", scope: "per_headline", status: "live", sensor: null, crystals: ["wigmore", "frank_j"], note: "links from event to headline and the weakest one" },
  { line: "retell_shape", scope: "per_headline", status: "live", sensor: { tool: "get_schmidt", page: "/api/v1/schmidt" }, crystals: ["schmidt_j", "schleicher", "tarde"], note: "chain or wave of outlets joining the story; null under three outlets" },
  { line: "quake_loudness", scope: "headline_only", status: "live", sensor: { tool: "get_cohen_s", page: "/api/v1/cohen-s" }, crystals: ["cohen_s"], note: "only earthquake headlines: wording against the USGS magnitude; null for everything else" },
  { line: "science_signs", scope: "headline_only", status: "live", sensor: { tool: "get_park", page: "/tools/park" }, crystals: ["park"], note: "only science and health headlines Park's sensor scanned, with the quoted words; null = not scanned, not clean" },
  { line: "index_mover", scope: "headline_only", status: "live", sensor: { tool: "get_polyak", page: "/tools/polyak" }, crystals: ["polyak"], note: "headline is among those that moved a radar index (hallucination, consensus) in the last 3 hours; null otherwise" },
  { line: "source_core_or_tail", scope: "aggregate", status: "not_wired", sensor: { tool: "get_bradford", page: "/api/v1/bradford" }, crystals: ["bradford_sc", "lotka", "pareto", "lyberg"], note: "core and tail of outlets is a measure of the whole feed; per headline it could say 'only the tail carried it', not wired yet" },
  { line: "said_then_did", scope: "topic", status: "partial", sensor: { tool: "get_promises", page: "/api/v1/promises" }, crystals: [], note: "ECB and Fed statements against decisions; offered in topic_sensors when the topic is rates, not attached to a headline" },
  { line: "radar_vs_price", scope: "topic", status: "partial", sensor: { tool: "get_trackrecord", page: "/tools/trackrecord" }, crystals: [], note: "how often BTC/ETH/XRP moved with or against the crypto radar; offered in topic_sensors for crypto topics" },
  { line: "data_gaps", scope: "system", status: "live", sensor: { tool: "get_hamilton", page: "/tools/hamilton" }, crystals: [], note: "what Orb Studio has switched off or has not refreshed right now (data_gaps); about us, not about the news" },
  { line: "first_source_found", scope: "per_headline", status: "partial", sensor: { tool: "get_kasperson", page: "/tools/kasperson" }, crystals: ["tannery", "kasperson"], note: "first source among our radars or null; null does not mean there is none" },
  { line: "edited_after_publication", scope: "per_headline", status: "missing", sensor: null, crystals: [], note: "we do not store versions of a headline or article, so there is no measurement: always null, measured=false" },
  { line: "call_to_action", scope: "per_headline", status: "live", sensor: null, crystals: ["allport"], note: "call or demand words found in the headline, quoted; a sign, not a label" },
  { line: "number_checkable", scope: "per_headline", status: "live", sensor: { tool: "get_frankfurt", page: "/tools/frankfurt" }, crystals: ["frankfurt"], note: "the headline has a number, and whether who/when/where anchor it" },
];
const BY_LINE = Object.fromEntries(PASSPORT_TABLE.map((t) => [t.line, t]));
const src = (line) => { const t = BY_LINE[line]; return { sensor: t.sensor, crystals: t.crystals, method: "/tools/method" }; };

// Призыв к действию: только слова из самого заголовка, в цитате; это признак для проверки, не ярлык
const CTA = /(?<![\p{L}])(must|should|urges?|urged|calls? (?:on|for)|demands?|appeals?|needs? to|stop|join|act now|share this|fordert\p{L}*|müssen|muss|appelliert\p{L}*|stoppt|stoppen|jetzt handeln|призыва\p{L}*|требу\p{L}*|должен|должны|остановить\p{L}*|срочно|нужно)(?![\p{L}])/iu;
export const callToAction = (headline) => { const m = String(headline || "").match(CTA); return m ? m[0] : null; };

// ex: добавки, которые считает Worker: { schmidt, cohen, park, mover } — каждая либо объект, либо null (не измерено)
export function passportLines(p, ex = {}) {
  const L = [], add = (line, value, evidence, extra = {}) => L.push({ line, value, evidence: evidence ?? null, ...src(line), ...extra });
  const h = p.what || "";
  add("speech_act", p.speech_act, null, { reading: p.status });
  add("checkability", p.checkability, null);
  add("state_media", p.state_media || null, p.state_media ? "source is state media" : null);
  add("retellings_vs_first_source", p.amplified ? { from_outlets: p.amplified.from, to_outlets: p.amplified.to } : null, p.amplified ? "outlets grew from " + p.amplified.from + " to " + p.amplified.to : null);
  add("independent_voices", p.voices, p.voices == null ? "not counted for this headline" : null);
  add("freshness", p.age_hours, p.age_hours == null ? "no publication time from the source" : null);
  add("extraordinary_claim", p.fired.includes("extraordinary") ? true : null, null);
  add("quoted_words", p.quoted ? true : null, null);
  add("found_document", p.found_document ? true : null, null);
  add("metaphor", p.metaphor || null, p.metaphor || null);
  add("loaded_words", p.tone ? p.tone.words : null, p.tone ? p.tone.words.join(", ") : null);
  add("rumour_risk", p.rumour_risk ? true : null, null);
  add("evidence_chain", p.chain && p.chain.weakest ? p.chain.weakest.link : null, p.chain && p.chain.weakest ? p.chain.weakest.why : null);
  add("retell_shape", ex.schmidt || null, ex.schmidt ? `${ex.schmidt.outlets} outlets, median lag ${ex.schmidt.median_lag_min} min` : "fewer than three outlets or not on the radars: not measured");
  add("quake_loudness", ex.cohen || null, ex.cohen ? `USGS magnitude ${ex.cohen.usgs_magnitude ?? "n/a"}, loud words: ${(ex.cohen.loud_words || []).join(", ") || "none"}` : "not an earthquake headline or no USGS match: not measured");
  add("science_signs", ex.park || null, ex.park ? "quote: " + ex.park.quote : "not scanned by the sensor: not measured, not clean");
  add("index_mover", ex.mover || null, ex.mover ? ex.mover.what : null);
  const cta = callToAction(h);
  add("call_to_action", cta ? true : null, cta, { note: "a sign of a call or demand, quoted from the headline; not a verdict" });
  const anchors = h ? frankfurtHeadline(h).anchors : null;
  add("number_checkable", anchors ? { has_number: !!anchors.how_many, anchored: p.checkability === "checkable" } : null, anchors && anchors.how_many ? "the headline contains a number" : null);
  add("first_source_found", p.first_source || null, p.first_source ? null : "first source not found among our radars; this does not mean there is none");
  add("edited_after_publication", null, "not measured: no versions of headlines or articles are kept", { measured: false });
  return L;
}

// Датчики по теме вопроса (то, что к отдельной новости не привязано)
const TOPIC_SENSORS = [
  [/ecb|fed\b|federal reserve|zins|ezb|ставк|ецб|фрс/i, "said_then_did"],
  [/bitcoin|btc|ether|xrp|crypto|krypto|биткоин|крипт/i, "radar_vs_price"],
  [/earthquake|erdbeben|землетряс|usgs/i, "quake_loudness"],
  [/study|science|studie|forsch|исследован|учёные|ученые|health|gesundheit|здоров/i, "science_signs"],
];
export function topicSensors(topic) {
  const t = String(topic || "");
  return [...new Set(TOPIC_SENSORS.filter(([re]) => re.test(t)).map(([, l]) => l))].map((l) => ({ line: l, ...src(l), note: BY_LINE[l].note }));
}

// items: [{ headline, source, link, radar, confirm, published_at, state_media, amplified, ... }] — как в passportOf; pass: newsPassport
export function newsByTopic(topic, items, pass, extrasFor = () => ({}), now = Date.now(), max = 8) {
  const q = String(topic || "").replace(/\s+/g, " ").trim().slice(0, 200), toks = askTokens(q);
  const scored = (items || []).map((it) => ({ it, n: toks.length ? askHit(it.headline, toks) : 0 })).filter((x) => !toks.length || x.n)
    .sort((a, b) => b.n - a.n || (b.it.confirm || 0) - (a.it.confirm || 0));
  const seen = new Set(), out = [];
  for (const { it } of scored) { const k = String(it.headline).toLowerCase().slice(0, 60); if (seen.has(k)) continue; seen.add(k);
    const p = pass(it, now), lines = passportLines(p, extrasFor(it, p));
    out.push({ headline: it.headline, looks_like_instructions: INJECTION.test(String(it.headline || "")), source: it.source || null, outlet_link: it.link || null, radar: it.radar, published_at: it.published_at || null,
      passport: { confidence: p.confidence, status: p.status, say: p.say.slice(0, 4), fired: p.fired, lines } });
    if (out.length >= max) break; }
  return { topic: q || null, words_searched: toks, checked_at: new Date(now).toISOString(), found: out.length, items: out,
    topic_sensors: topicSensors(q), data_notice: UNTRUSTED_NOTE,
    table: "/api/v1/news-passport-table", method: "/tools/method",
    how_to_read: "Each item is a radar headline with its passport. A passport is not a verdict of true or false: it lists signs and reasons with the words that triggered them. Every line names the sensor and the scientist cards behind it. null means not measured or no sign found by the word rules, never 'clean'. confidence (high / medium / low) is how safe it is to repeat the headline as a fact. No AI is used. Not a forecast." };
}
export const newsTable = () => ({ lines: PASSPORT_TABLE, counts: PASSPORT_TABLE.reduce((a, t) => ((a[t.status] = (a[t.status] || 0) + 1), a), {}),
  rule: "A scientist without a line in this table stays a card of the Crystal Library, with no sensor. A new line needs a measurable number from our data and the owner's yes.", page: "/tools/method" });
