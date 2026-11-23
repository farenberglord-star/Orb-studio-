// Эхо агентств (эвристика доступности, Канеман): 5 изданий с одним текстом dpa — это один голос, а не пять.
// Чистая функция: на вход издания с заголовком, анонсом и названием, на выход — группы и число независимых голосов.

// Агентства: метка в анонсе «Berlin (dpa) –», «(Reuters) -», в подписи или само издание — агентство.
export const AGENCIES = [
  ["dpa", /(?<![\p{L}])(dpa|dpa-AFX|Deutsche Presse-Agentur)(?![\p{L}])/iu],
  ["Reuters", /(?<![\p{L}])Reuters(?![\p{L}])/iu],
  ["AP", /(?<![\p{L}])(AP|Associated Press)(?![\p{L}])/u],
  ["AFP", /(?<![\p{L}])(AFP|Agence France-Presse)(?![\p{L}])/u],
  ["Bloomberg", /(?<![\p{L}])Bloomberg(?![\p{L}])/iu],
  ["epd", /\((epd|KNA)\)/u],
  ["APA", /\(APA\)/u],
  ["ТАСС", /(?<![\p{L}])(ТАСС|TASS)(?![\p{L}])/u],
  ["РИА Новости", /(?<![\p{L}])(РИА Новости|RIA Novosti)(?![\p{L}])/iu],
  ["Интерфакс", /(?<![\p{L}])(Интерфакс|Interfax)(?![\p{L}])/iu],
];
// Метка агентства в начале анонса или в скобках — это подпись. Простое упоминание «по данным Reuters» в заголовке тоже считаем.
export function agencyOf(o) {
  const head = String(o.description || "").slice(0, 160), src = String(o.source || ""), title = String(o.title || "");
  for (const [name, re] of AGENCIES) if (re.test(src) || re.test(head) || re.test(title)) return name;
  return null;
}
function words(t) {
  return new Set(String(t || "").toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, " ").split(/\s+/).filter((w) => w.length >= 3));
}
function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let k = 0; for (const x of a) if (b.has(x)) k++;
  return k / (a.size + b.size - k);
}
export const ECHO_SAME = 0.7; // доля общих слов, начиная с которой два заголовка — один текст
// Расстояние Левенштейна (Владимир Левенштейн, 1935–2017): сколько замен, вставок и удалений букв превращают одну строку в другую.
export function levenshtein(a, b, max = Infinity) {
  a = String(a); b = String(b); if (a === b) return 0;
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let best = i;
    for (let j = 1; j <= b.length; j++) { cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); if (cur[j] < best) best = cur[j]; }
    if (best > max) return max + 1; prev = cur;
  }
  return prev[b.length];
}
// слова совпадают, если одинаковы или (от 5 букв) отличаются одной буквой: опечатка, другая транслитерация, окончание
const near = (x, y) => x === y || (x.length >= 5 && y.length >= 5 && levenshtein(x, y, 1) <= 1);
function fuzzyJaccard(a, b) {
  if (!a.size || !b.size) return 0;
  const rest = [...b]; let k = 0;
  for (const x of a) { const i = rest.findIndex((y) => near(x, y)); if (i >= 0) { k++; rest.splice(i, 1); } }
  return k / (a.size + b.size - k);
}
export const ECHO_TYPO = 0.85; // похожесть строк по Левенштейну, начиная с которой два заголовка — один текст с опечатками
function charSim(a, b) {
  const x = String(a || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim(), y = String(b || "").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const L = Math.max(x.length, y.length); if (!L) return 0;
  const cap = Math.floor(L * (1 - ECHO_TYPO)); return 1 - Math.min(levenshtein(x, y, cap), cap + 1) / L;
}

// outlets: [{outlet, title, description}] → независимые голоса.
export function echoGroups(outlets) {
  const n = outlets.length, parent = [...Array(n).keys()];
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const join = (a, b) => { parent[find(a)] = find(b); };
  const ag = outlets.map((o) => agencyOf({ ...o, source: o.outlet })), ws = outlets.map((o) => words(o.title)), why = new Map();
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (ag[i] && ag[i] === ag[j]) join(i, j);
    else if (jaccard(ws[i], ws[j]) >= ECHO_SAME) join(i, j);
    else if (fuzzyJaccard(ws[i], ws[j]) >= ECHO_SAME || charSim(outlets[i].title, outlets[j].title) >= ECHO_TYPO) { join(i, j); why.set(i, 1); why.set(j, 1); }
  }
  const groups = new Map();
  for (let i = 0; i < n; i++) { const r = find(i); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(i); }
  const echoes = [];
  for (const idx of groups.values()) {
    if (idx.length < 2) continue;
    const agency = idx.map((i) => ag[i]).find(Boolean) || null;
    echoes.push({ agency, why: agency ? "same_agency" : idx.some((i) => why.has(i)) ? "typo_or_small_rewrite" : "near_identical_title", outlets: idx.map((i) => outlets[i].outlet), title: outlets[idx[0]].title });
  }
  echoes.sort((a, b) => b.outlets.length - a.outlets.length);
  const independent = groups.size;
  const verdict = n === 0 ? "none" : n === 1 ? "single" : independent === 1 ? "one_voice" : independent < n ? "partly_echo" : "independent";
  return { outlets_found: n, independent_voices: independent, echo_groups: echoes, verdict,
    agencies: [...new Set(ag.filter(Boolean))] };
}

export const ECHO_EXPLAIN = {
  none: "no outlets to compare",
  single: "only one outlet",
  one_voice: "all outlets carry one text (same agency, near-identical headline, or the same headline with typos or small changes): this is one source repeated, not independent confirmation",
  partly_echo: "some outlets repeat the same agency text or headline; count independent_voices, not outlets_found",
  independent: "the outlets wrote their own headlines and no shared agency tag was found",
};
export const ECHO_RULE = "Independent voices = groups of outlets after merging those with the same agency tag (dpa, Reuters, AP, AFP, Bloomberg, epd/KNA, APA, TASS, RIA, Interfax) in the source name, the first lines of the snippet or the headline, and those whose headlines share at least 70% of words — counting words that differ by one letter as the same (typos, other transliteration, endings), or whose headlines as strings are at least 85% alike by Levenshtein edit distance (Vladimir Levenshtein, 1935–2017). It is a lower estimate of copying: an agency text rewritten in new words is not detected, and two outlets quoting the same agency on different points are merged. Idea: Daniel Kahneman's availability heuristic — a story repeated by many outlets feels more certain than one source deserves.";

// Четырёхзначная оценка Белнапа–Данна (и паранепротиворечивость да Косты): сведения бывают «подтверждают»,
// «опровергают», «и то и другое» (источники противоречат) и «ни то ни другое» (сведений нет). По заголовкам изданий.
export const DENY_RE = /(?<![\p{L}])(den(y|ies|ied)|rejects?|rejected|refutes?|refuted|debunk\p{L}*|false|fake|hoax|untrue|no evidence|not true|dementiert\p{L}*|weist zurück|wies zurück|falschmeldung|fake news|widerlegt|bestreitet|bestritt|опроверг\p{L}*|отрица\p{L}*|фейк\p{L}*|ложн\p{L}*|не соответству\p{L}*|неправд\p{L}*)(?![\p{L}])/iu;
export function fourValued(outlets) {
  const n = (outlets || []).length;
  if (!n) return { value: "neither", affirm: 0, deny: 0, explain: "no outlet carries it: absence of information, not evidence that it is false" };
  const deny = outlets.filter((o) => DENY_RE.test(String(o.title || ""))).map((o) => o.outlet), affirm = n - deny.length;
  const value = deny.length && affirm ? "both" : deny.length ? "denied" : "affirmed";
  return { value, affirm, deny: deny.length, denying_outlets: deny.slice(0, 6),
    explain: { both: "some outlets carry the story and some deny or call it false: report it as contested, with both sides", denied: "the outlets found report it as denied or false", affirmed: "the outlets found carry it and none of their headlines deny it (this is not proof that it is true)" }[value],
    rule: "Belnap–Dunn four values: affirmed / denied / both (contradictory sources) / neither (no information). Denial words in headlines in English, German and Russian; word rules, no AI. Named after J. Michael Dunn (1941–2021) and Newton da Costa (1929–2024)." };
}
