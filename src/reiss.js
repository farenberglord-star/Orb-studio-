// «Одна новость на трёх языках» — мостик Библиотеки кристаллов: Райс («Возможности и границы критики перевода», 1971:
// перевод оценивают только сравнением с оригиналом) + Найда (смысл, а не слова) + Кондорсе (независимые голоса).
// Радары читают одни и те же события по-английски, по-немецки и по-русски. Здесь находим пары заголовков на разных
// языках об одной истории (общие «якоря»: страны, города, люди, ведомства и числа — словарь на трёх языках) и
// сравниваем, как они её подают: событие или заявление, одни ли числа, есть ли накал только в одной версии.
import { newsPassport } from "./passport.js";

export const REISS_MIN = 20;
// понятие → основы в en / de / ru (сравнение по началу слова в нижнем регистре)
const C = (id, ...stems) => ({ id, stems, topic: false }), T = (id, ...stems) => ({ id, stems, topic: true });
export const ANCHORS = [
  C("ukraine", "ukrain", "украин"), C("russia", "russia", "russland", "russisch", "росси", "российск", "рф"), C("kyiv", "kyiv", "kiew", "киев"),
  C("zaporizhzhia", "zaporizh", "saporisch", "запорож"), C("kharkiv", "kharkiv", "charkiw", "харьков"), C("odesa", "odesa", "odessa", "одесс"),
  C("crimea", "crimea", "krim", "крым"), C("donetsk", "donetsk", "donezk", "донецк"), C("moscow", "moscow", "moskau", "москв"),
  C("germany", "german", "deutschland", "deutsch", "германи", "немецк"), C("berlin", "berlin", "берлин"), C("hamburg", "hamburg", "гамбург"),
  C("france", "france", "french", "frankreich", "франци"), C("britain", "britain", "british", "großbritannien", "британи"), C("poland", "poland", "polish", "polen", "польш"),
  C("usa", "u.s.", "usa", "united states", "american", "vereinigte staaten", "сша", "американ"), C("china", "china", "chinese", "chines", "кита"),
  C("iran", "iran", "иран"), C("israel", "israel", "израил"), C("gaza", "gaza", "сектор газа", "газе", "газы"), C("lebanon", "leban", "libanon", "ливан"), C("syria", "syria", "syrien", "сири"),
  C("turkey", "turkey", "turkish", "türkei", "турци"), C("libya", "libya", "libyen", "ливи"), C("benghazi", "benghazi", "bengasi", "бенгази"), C("estonia", "estonia", "estland", "эстони"), C("baltic", "baltic", "ostsee", "балти"),
  C("eu", "eu", "european union", "europäische union", "ес", "евросоюз"), C("nato", "nato", "нато"), C("un", "un", "united nations", "vereinte nationen", "оон"),
  C("ecb", "ecb", "ezb", "ецб"), C("fed", "fed", "federal reserve", "фрс"), T("bitcoin", "bitcoin", "биткоин", "биткойн"),
  C("trump", "trump", "трамп"), C("putin", "putin", "путин"), C("zelensky", "zelensk", "selensk", "зеленск"), C("merz", "merz", "мерц"),
  C("macron", "macron", "макрон"), C("xi", "xi jinping", "си цзиньпин"), C("netanyahu", "netanyahu", "netanjahu", "нетаньях"), C("erdogan", "erdogan", "erdoğan", "эрдоган"),
  T("drone", "drone", "drohne", "дрон", "беспилотн"), T("missile", "missile", "rakete", "ракет"), T("refinery", "refiner", "raffinerie", "нпз", "нефтеперераб"),
  T("ship", "ship", "vessel", "tanker", "schiff", "tanker", "судн", "корабл", "танкер"), T("sanctions", "sanction", "sanktion", "санкци"), T("ceasefire", "ceasefire", "truce", "waffenruhe", "waffenstillstand", "перемири"),
  T("killed", "killed", "dead", "death", "tote", "getötet", "погиб", "убит"), T("injured", "injur", "wounded", "verletzt", "ранен", "пострада"),
  T("inflation", "inflation", "инфляц"), T("interest", "interest rate", "leitzins", "zins", "ставк"), T("oil", "oil", "öl", "нефт"), T("gas", "gas", "газ"),
  T("election", "election", "wahl", "выбор"), T("budget", "budget", "haushalt", "бюджет"), T("strike_labour", "strike", "streik", "забастовк"),
];
const norm = (s) => String(s || "").toLowerCase().replace(/ё/g, "е");
export function langOf(h) {
  const t = String(h || "");
  if (/[Ѐ-ӿ]/.test(t)) return "ru";
  if (/[äöüß]/i.test(t) || /(?<![\p{L}])(der|die|das|und|mit|für|nach|bei|auf|ist|wird|gegen|nicht|soll|neue[nrs]?|vor|zum|zur)(?![\p{L}])/iu.test(t)) return "de";
  return "en";
}
export function anchorsOf(h, kind = "all") {
  const t = norm(h), words = t.match(/[\p{L}\p{N}.]+/gu) || [], out = new Set();
  for (const a of ANCHORS) { if ((kind === "entity" && a.topic) || (kind === "topic" && !a.topic)) continue; for (const s of a.stems) {
    if (s.includes(" ") || s.includes(".") ? t.includes(s) : words.some((w) => w.startsWith(s) && (s.length >= 4 || w === s || w.length <= s.length + 3))) { out.add(a.id); break; }
  } }
  return out;
}
export function numbersOf(h) { return new Set((String(h || "").match(/\d[\d.,]*\d|\d/g) || []).map((x) => x.replace(/[.,]/g, "")).filter((x) => x.length >= 1 && !/^(19|20)\d\d$/.test(x))); }
// одна история на разных языках: общие «кто и где» (страны, города, люди, ведомства) плюс общая тема или число.
// Одни темы (инфляция, ставка) без общих «кто и где» — это разные новости одной рубрики.
const shared = (A, B) => { let k = 0; for (const x of A) if (B.has(x)) k++; return k; };
export function sameStoryAcross(a, b) {
  const e = shared(anchorsOf(a, "entity"), anchorsOf(b, "entity")), t = shared(anchorsOf(a, "topic"), anchorsOf(b, "topic"));
  const n = shared(new Set([...numbersOf(a)].filter((x) => x.length >= 2)), new Set([...numbersOf(b)].filter((x) => x.length >= 2)));
  return e >= 3 || (e >= 2 && (t >= 1 || n >= 1)) || (e >= 1 && t >= 1 && n >= 1);
}
export function compareVersions(a, b) {
  const pa = newsPassport({ headline: a.headline, confirm: 3 }), pb = newsPassport({ headline: b.headline, confirm: 3 }), diffs = [];
  if (pa.speech_act !== pb.speech_act) diffs.push("speech_act");
  const NA = numbersOf(a.headline), NB = numbersOf(b.headline);
  if (NA.size && NB.size && ![...NA].some((x) => NB.has(x))) diffs.push("numbers");
  if (pa.fired.includes("tone") !== pb.fired.includes("tone")) diffs.push("tone");
  if (pa.fired.includes("metaphor") !== pb.fired.includes("metaphor")) diffs.push("metaphor");
  if (pa.fired.includes("quoted") !== pb.fired.includes("quoted")) diffs.push("quoted");
  return { diffs, acts: [pa.speech_act, pb.speech_act] };
}
export function reissReport(rows, now = Date.now()) {
  const items = (rows || []).filter((r) => r && r.headline).map((r) => ({ ...r, lang: langOf(r.headline) }));
  const langs = { en: 0, de: 0, ru: 0 }; for (const r of items) langs[r.lang]++;
  const pairs = [], used = new Set();
  for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
    const a = items[i], b = items[j];
    if (a.lang === b.lang || Math.abs(+a.first_ts - +b.first_ts) > 36 * 3600e3) continue;
    const key = [a.k, b.lang].join("|"); if (used.has(key)) continue;
    if (!sameStoryAcross(a.headline, b.headline)) continue;
    used.add(key); const c = compareVersions(a, b);
    pairs.push({ a: { lang: a.lang, headline: a.headline, source: a.source || null, radar: a.radar || null }, b: { lang: b.lang, headline: b.headline, source: b.source || null, radar: b.radar || null }, ...c });
  }
  const withDiff = pairs.filter((p) => p.diffs.length), by = {};
  for (const p of withDiff) for (const d of p.diffs) by[d] = (by[d] || 0) + 1;
  return {
    sensor: "reiss", verdict: pairs.length < REISS_MIN ? "collecting" : withDiff.length / pairs.length >= 0.3 ? "versions_often_differ" : "versions_mostly_agree",
    headlines: items.length, by_language: langs, cross_language_pairs: pairs.length, pairs_with_differences: withDiff.length,
    differences_pct: pairs.length ? Math.round((100 * withDiff.length) / pairs.length) : null, by_difference: by,
    examples: withDiff.slice(0, 10),
    question: "When the same story appears on the Orb Studio radars in English, German and Russian headlines, do the versions tell it the same way — event or statement, the same numbers, the same heat?",
    method: `Headlines of the last 48 hours are tagged by language (Cyrillic → ru; German letters or function words → de; otherwise en). Two headlines in different languages, first seen within 36 hours of each other, count as one story when they share anchors from a three-language list (countries, cities, people, institutions, topics such as drones or sanctions) — at least three, or two in short headlines, or one plus the same number. Each pair is compared with the news passport: speech act, numbers, loaded words, metaphor, quotes. Verdict from ${REISS_MIN} pairs. No machine translation, no AI.`,
    rule: "When language versions of a story differ — event in one, statement in another; different numbers; heat in only one — name the difference and the outlets instead of picking one version.",
    caveat: "Anchor matching is coarse: two different events in the same place on the same day can pair up, and a story told with no shared anchor is missed. Differences may come from the outlets, not from translation.",
    bridge: "Crystal Library bridge 'one story in three languages': Katharina Reiss (translation criticism needs the original) + Eugene Nida (meaning, not words) + Condorcet (independent voices).",
    similar: "Cross-lingual news clustering (for example the Europe Media Monitor, GDELT) groups stories across languages; this reports, for the Orb Studio radars, how often the language versions of one story differ in what the news passport sees, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
