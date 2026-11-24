// Датчик «Фреге» — в честь Готлоба Фреге (1848–1925), «О смысле и значении» (1892): одно имя может указывать на разных людей,
// и разные имена — на одного. Мостик «тёзки в новостях»: Фреге + Гич (тождество) + Дирихле (людей больше, чем имён — тёзки неизбежны) + Левенштейн.
// Первый собственный датчик зоны 7 («похожее ≠ то же»). Источник — Викиданные (Wikidata, CC0): для имён людей из заголовков радаров
// датчик ищет, сколько разных людей с ровно таким именем знает Викиданные. Если двое и больше — имя в новости нужно уточнять
// (страна, должность, годы), прежде чем связывать с ним факты.
export const FREGE = {
  name: "Gottlob Frege", years: "1848–1925",
  idea: "'On Sense and Reference' (1892): one name can point to different people, and different names to the same one.",
  wiki: { en: "https://en.wikipedia.org/wiki/Gottlob_Frege", ru: "https://en.wikipedia.org/wiki/Gottlob_Frege" },
  note: "Named in his honour. Orb Studio is not connected with any institution bearing his name. Data: Wikidata (CC0).",
};
export const FREGE_MIN = 20;
const PARTICLE = "(?:von|van|der|den|de|da|di|du|del|la|le|al|el|bin|ibn|ben|zu|af|mac)";
const NAME_LAT = new RegExp(`(?<![\\p{L}])\\p{Lu}[\\p{Ll}'’-]+(?:\\s+${PARTICLE}){0,2}(?:\\s+\\p{Lu}[\\p{Ll}'’-]+){1,2}(?![\\p{L}])`, "gu");
// слова, с которых начинаются заголовки и которые не имена (англ., нем., рус.)
const STOP = /^(the|a|an|new|breaking|live|update|report|watch|why|how|what|who|when|where|after|before|as|in|on|at|for|from|with|over|under|german|germany|european|eu|us|uk|russia|russian|china|chinese|ukraine|ukrainian|iran|israel|india|japan|france|french|british|american|president|chancellor|minister|prime|pm|ceo|chief|king|queen|pope|der|die|das|ein|eine|neue|neuer|neues|deutsche|deutschland|bundes\p{L}*|kanzler|minister\p{L}*|präsident\p{L}*|nach|vor|mit|für|bei|im|am|zum|zur|в|на|и|после|глава|президент|министр|премьер|канцлер|новый|новая)$/iu;
const PERSON_DESC = /(politician|statesman|stateswoman|secretary|leader|chairman|chairwoman|premier|head of state|spokes\p{L}*|footballer|football|soccer|player|actor|actress|singer|rapper|journalist|presenter|businessman|businesswoman|entrepreneur|executive|economist|banker|scientist|physicist|chemist|engineer|writer|author|novelist|poet|lawyer|judge|diplomat|official|civil servant|minister|president|senator|governor|mayor|general|officer|athlete|tennis|cyclist|boxer|coach|manager|musician|composer|conductor|artist|painter|director|producer|model|activist|priest|bishop|monarch|prince|princess|historian|philosopher|professor|researcher|\b(?:born|died)\b|\(\d{4}|\d{4}\s*[–-]\s*\d{4})/iu;

export function extractNames(headline) {
  const t = String(headline || ""), out = new Set(), w = t.split(/\s+/).filter((x) => /^\p{L}/u.test(x));
  if (w.length >= 5 && w.filter((x) => /^\p{Lu}/u.test(x)).length / w.length > 0.85) return []; // Заголовок В Стиле Title Case — имена не отличить
  for (const m of t.matchAll(NAME_LAT)) {
    let parts = m[0].replace(/['’]s$/u, "").split(/\s+/); while (parts.length && STOP.test(parts[0])) parts = parts.slice(1);
    while (parts.length && STOP.test(parts[parts.length - 1])) parts = parts.slice(0, -1);
    if (parts.length >= 2 && parts.length <= 5 && !/[\u0400-\u04ff]/.test(parts.join("")) && parts.every((p) => p.length >= 2)) out.add(parts.join(" "));
  }
  return [...out];
}
// Русские имена в заголовках стоят в падежах («с Си Цзиньпином», «Путину»). Мостик «не найдено ≠ нет» (Тульвинг):
// запись находится ключом той формы, в какой её записали, — поэтому пробуем исходную форму и две догадки об именительном падеже.
const NAME_CYR = /(?<![\p{L}])[А-ЯЁ][а-яё-]+(?:\s+[А-ЯЁ][а-яё-]+){1,2}(?![\p{L}])/gu;
const STOP_RU = /^(под|над|при|из|для|у|о|об|от|до|за|власти|жители|война|глава|президент|премьер|министр|канцлер|новый|новая|новые|главное|срочно|видео|фото|итоги|онлайн|в|на|и|после|россия|украина|сша|германия|европа|ес|нато|минфин|минобороны|мид|госдума|кремль|киев|москва|берлин)$/i;
const masc = (w) => (/(ск|цк)(ому|ого|им|ом)$/u.test(w) ? w.replace(/(ск|цк)(ому|ого|им|ом)$/u, "$1ий") : w.length > 3 ? w.replace(/(ыми|ими|ого|его|ому|ему|ым|им|ом|ем|у|ю|а|е)$/u, "") : w);
const fem = (w) => (/(ск|цк)(ой|ую)$/u.test(w) ? w.replace(/(ск|цк)(ой|ую)$/u, "$1ая") : w.length > 3 ? w.replace(/ией$/u, "ия").replace(/ии$/u, "ия").replace(/ой$/u, "а").replace(/ей$/u, "я").replace(/(у|е|ы)$/u, "а") : w);
export function ruNominative(name) {
  const p = String(name).split(/\s+/);
  return [...new Set([p.join(" "), p.map(masc).join(" "), p.map(fem).join(" ")])].filter((x) => x.split(" ").every((w) => w.length >= 2));
}
export function extractNamesRu(headline) {
  const t = String(headline || ""), out = new Set();
  for (const m of t.matchAll(NAME_CYR)) {
    let parts = m[0].split(/\s+/); while (parts.length && STOP_RU.test(parts[0])) parts = parts.slice(1);
    while (parts.length && STOP_RU.test(parts[parts.length - 1])) parts = parts.slice(0, -1);
    if (parts.length >= 2 && parts.length <= 3) out.add(parts.join(" "));
  }
  return [...out];
}
export function personLike(desc) { return PERSON_DESC.test(String(desc || "")); }
// результат поиска Викиданных → люди с ровно таким именем (или таким же псевдонимом)
export function namesakes(name, results) {
  const n = String(name).toLowerCase();
  const people = (results || []).filter((r) => r && (String(r.label || "").toLowerCase() === n || (r.match && String(r.match.text || "").toLowerCase() === n)) && personLike(r.description));
  return { name, people: people.length, examples: people.slice(0, 4).map((r) => ({ id: r.id, description: r.description || "" })) };
}
export function fregeReport(checked, now = Date.now(), meta = {}) {
  const ok = (checked || []).filter((c) => c && c.people >= 1), amb = ok.filter((c) => c.people >= 2).sort((a, b) => b.people - a.people);
  const share = ok.length ? Math.round((100 * amb.length) / ok.length) : null;
  return {
    sensor: "frege", verdict: ok.length < FREGE_MIN ? "collecting" : share >= 30 ? "many_namesakes" : share >= 10 ? "some_namesakes" : "few_namesakes",
    names_found: (checked || []).length, people_names: ok.length, ambiguous: amb.length, ambiguous_pct: share, ambiguous_names: amb.slice(0, 12),
    question: "How many of the people named in the Orb Studio radar headlines share their exact name with other people known to Wikidata — so that the name alone does not tell who is meant?",
    method: `Person-like names (two to four capitalised words, without leading words such as 'President' or 'Kanzler') are taken from radar headlines of the last 48 hours. Each is looked up in Wikidata (wbsearchentities, results cached for 7 days); a match counts when its label or alias is exactly the name and its description reads as a person (an occupation or life years). Two or more such people = an ambiguous name. Verdict from ${FREGE_MIN} person names. No AI. Data: Wikidata, CC0.`,
    rule: "A name in a headline may belong to several people; confirm who is meant by role, country or date before linking facts to them.",
    caveat: "Wikidata knows mostly people with a public record; a name with one match here can still have namesakes elsewhere. Descriptions are in English as given by Wikidata.",
    bridge: "Crystal Library bridge 'namesakes in the news': Frege (sense and reference) + Geach (identity) + Dirichlet (more people than names) + Levenshtein (near-identical spellings).",
    source: "Wikidata (https://www.wikidata.org), CC0", ...meta,
    honour: FREGE, similar: "Entity-linking tools (OpenTapioca, spaCy entity linker, Google Knowledge Graph, DBpedia Spotlight) map names in text to knowledge-base entries; this sensor reports live, for news headlines on the radars, how often a name is shared by several people, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
