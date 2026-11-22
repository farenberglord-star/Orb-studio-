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

// outlets: [{outlet, title, description}] → независимые голоса.
export function echoGroups(outlets) {
  const n = outlets.length, parent = [...Array(n).keys()];
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  const join = (a, b) => { parent[find(a)] = find(b); };
  const ag = outlets.map((o) => agencyOf({ ...o, source: o.outlet })), ws = outlets.map((o) => words(o.title));
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    if (ag[i] && ag[i] === ag[j]) join(i, j);
    else if (jaccard(ws[i], ws[j]) >= ECHO_SAME) join(i, j);
  }
  const groups = new Map();
  for (let i = 0; i < n; i++) { const r = find(i); if (!groups.has(r)) groups.set(r, []); groups.get(r).push(i); }
  const echoes = [];
  for (const idx of groups.values()) {
    if (idx.length < 2) continue;
    const agency = idx.map((i) => ag[i]).find(Boolean) || null;
    echoes.push({ agency, why: agency ? "same_agency" : "near_identical_title", outlets: idx.map((i) => outlets[i].outlet), title: outlets[idx[0]].title });
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
  one_voice: "all outlets carry one text (same agency or near-identical headline): this is one source repeated, not independent confirmation",
  partly_echo: "some outlets repeat the same agency text or headline; count independent_voices, not outlets_found",
  independent: "the outlets wrote their own headlines and no shared agency tag was found",
};
export const ECHO_RULE = "Independent voices = groups of outlets after merging those with the same agency tag (dpa, Reuters, AP, AFP, Bloomberg, epd/KNA, APA, TASS, RIA, Interfax) in the source name, the first lines of the snippet or the headline, and those whose headlines share at least 70% of words. It is a lower estimate of copying: an agency text rewritten in new words is not detected, and two outlets quoting the same agency on different points are merged. Idea: Daniel Kahneman's availability heuristic — a story repeated by many outlets feels more certain than one source deserves.";
