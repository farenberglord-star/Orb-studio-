// Датчик «Сёрл» — в честь Джона Сёрла (1932–2025), автора теории речевых актов: «утверждать», «обещать»,
// «угрожать», «требовать» — это разные действия. Заголовок «X пригрозил пошлинами» — не факт введения пошлин.
// Для каждого заголовка определяем, что он сообщает: совершившееся событие, обещание или план, угрозу или
// предупреждение, требование или призыв, или чьё-то заявление. Правила по словам, без ИИ.
export const SEARLE = {
  name: "John Searle", years: "1932–2025",
  idea: "Speech acts: asserting, promising, threatening and demanding are different acts — a promise or a threat is not an event that happened.",
  wiki: { en: "https://en.wikipedia.org/wiki/John_Searle", ru: "https://en.wikipedia.org/wiki/John_Searle" },
  note: "Named in his honour. Orb Studio is not connected with John Searle, his family or the University of California, Berkeley.",
};
const B = (s) => new RegExp(`(?<![\\p{L}])(${s})(?![\\p{L}])`, "iu");
export const SEARLE_ACTS = {
  threat: B("threaten\\p{L}*|warns?|warned|warning|ultimatum|vows? (to )?retaliat\\p{L}*|droht|drohen|drohte|warnt|warnte|ultimatum|угрож\\p{L}*|пригрозил\\p{L}*|предупред\\p{L}*|ультиматум\\p{L}*"),
  demand: B("demands?|demanded|calls? (for|on)|called (for|on)|urges?|urged|asks?|asked|fordert|forderte|ruft (zu|auf)|appelliert|verlangt|потребовал\\p{L}*|требует|призвал\\p{L}*|призывает|попросил\\p{L}*|настаива\\p{L}*"),
  promise: B("to (?:strike|walk out|go on strike)\\s+(?:at|on|from|over|for|next|tomorrow)|announc(?:es|ed|ing)\\s+(?:\\S+\\s+){0,3}(?:plans?|measures?|controls?|bans?|tax(?:es)?|tariffs?|sanctions?|cuts?|reforms?|programmes?|programs?|package)|vows?|vowed|pledges?|pledged|promises?|promised|plans?|planned|to (visit|meet|sign|launch|introduce|impose|raise|cut|send|hold)|will|would|set to|is to|are to|aims? to|intends?|expected to|kündigt|kündigte|angekündigt|verspricht|versprach|plant\\s+(?:die|den|das|eine?n?|neue\\p{L}*|offenbar|nun|jetzt|weitere\\p{L}*|bis)|will|wollen|soll|sollen|будет|будут|пообещал\\p{L}*|обещает|планиру\\p{L}*|намерен\\p{L}*|намерева\\p{L}*|собира\\p{L}*|готов\\p{L}* к"),
  claim: B("declared (?:sound|safe|solvent|healthy|stable|secure)|für (?:solide|sicher|stabil) erklärt|признан\\p{L}* (?:надёжн\\p{L}*|устойчив\\p{L}*|безопасн\\p{L}*)|(?:is|are|was|were) reported|reportedly|reported (?:in|to|at|near|from)|berichten zufolge|сообщается|по сообщениям|believes?|believed|stands? by|glaubt|считает|declar(?:es|ed|ing)\\s+(?:its\\s+|their\\s+|his\\s+|her\\s+)?(?:neutrality|neutral|support|opposition|readiness|willingness|intention|solidarity)|says?|said|claims?|claimed|insists?|denies|denied|accuses?|accused|sagt|sagte|behauptet|bestreitet|wirft vor|заявил\\p{L}*|сообщил\\p{L}*|якобы|по данным|по словам|назвал\\p{L}*|опроверг\\p{L}*|уверен\\p{L}*|заявляет|утвержда\\p{L}*|отрица\\p{L}*|обвинил\\p{L}*"),
};
// порядок важен: угроза и требование сильнее обещания, обещание сильнее простого «сказал»
export function searleHeadline(title) {
  const t = String(title || ""), hits = Object.entries(SEARLE_ACTS).filter(([, re]) => re.test(t)).map(([k]) => k);
  const act = hits[0] || "event";
  return { act, signals: hits, happened: act === "event" ? "reported_as_event" : act === "claim" ? "someone_says_so" : "not_yet" };
}
export const SEARLE_EXPLAIN = {
  event: "reported as something that happened — still check it, but it is an event claim",
  claim: "someone says or denies something — report it as their statement, not as the fact itself",
  promise: "a promise, plan or announced intention — it has not happened yet",
  threat: "a threat or warning — a possible future, not an event",
  demand: "a demand, request or call — it says what someone wants, not what happened",
};
// Уровень абстракции Флеша («Measuring the Level of Abstraction», 1950): доля конкретных слов — чисел, дат, имён и мест.
// Заголовок с подробностями (кто, где, сколько, когда) проверить легче, чем общий пересказ. Считаем грубо, по форме слов.
const MONTHS = /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember|январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр|monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i;
export function concreteness(title) {
  const words = String(title || "").replace(/[«»"“”„()]/g, " ").split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w));
  if (words.length < 3) return null;
  const de = /[äöüß]|\b(der|die|das|und|mit|für|nicht|ein|eine|im|zum|zur|fordern|fordert)\b/i.test(title); // в немецком все существительные с заглавной — их не считаем
  let k = 0;
  words.forEach((w, i) => { const c = w.replace(/^[^\p{L}\d]+|[^\p{L}\d]+$/gu, ""); if (!c) return;
    if (/\d/.test(c) || MONTHS.test(c) || (!de && i > 0 && /^\p{Lu}/u.test(c) && !/^\p{Lu}+$/u.test(c.slice(0, 2))) || (i > 0 && /^\p{Lu}{2,5}$/u.test(c))) k++; });
  return Math.round((100 * k) / words.length);
}
export function searleReport(radars, now = Date.now()) {
  const rs = (radars || []).filter((r) => r && Array.isArray(r.feed));
  if (!rs.length) return { sensor: "searle", verdict: "no_data", radars: [], generated_at: new Date(now).toISOString() };
  const all = [], per = rs.map((r) => {
    const items = r.feed.map((f) => ({ headline: f[1], source: f[2] || null, ...searleHeadline(f[1]) })); all.push(...items.map((x) => ({ ...x, radar: r.id })));
    const c = (k) => items.filter((x) => x.act === k).length;
    return { id: r.id, headlines: items.length, event: c("event"), claim: c("claim"), promise: c("promise"), threat: c("threat"), demand: c("demand") };
  });
  const n = all.length, pct = (k) => (n ? Math.round(100 * all.filter((x) => x.act === k).length / n) : null);
  const shares = { event: pct("event"), claim: pct("claim"), promise: pct("promise"), threat: pct("threat"), demand: pct("demand") };
  const notYet = shares.promise + shares.threat + shares.demand;
  return {
    sensor: "searle", verdict: notYet >= 40 ? "mostly_words_not_deeds" : notYet >= 20 ? "many_words_not_deeds" : "mostly_events",
    headlines: n, shares, not_yet_happened_pct: notYet, explain: SEARLE_EXPLAIN, radars: per,
    concreteness_by_act: Object.fromEntries(["event", "claim", "promise", "threat", "demand"].map((k) => { const v = all.filter((x) => x.act === k).map((x) => concreteness(x.headline)).filter((x) => x != null); return [k, v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null]; })),
    concreteness_note: "Flesch's level of abstraction (1950), roughly: share of concrete words (numbers, dates, names, places) per 100 words of the headline, averaged by speech act. A low share means a general retelling with few checkable details. German headlines: capitalised nouns are not counted, only numbers, dates and abbreviations.",
    examples: { threat: all.filter((x) => x.act === "threat").slice(0, 5), promise: all.filter((x) => x.act === "promise").slice(0, 5), demand: all.filter((x) => x.act === "demand").slice(0, 5) },
    question: "How much of what the Orb Studio radars carry is something that happened, and how much is only a promise, a threat, a demand or someone's statement?",
    method: "Each top radar headline is matched against word lists in English, German and Russian for four speech acts: threat or warning (threatens, warns, droht, угрожает), demand or call (demands, urges, fordert, потребовал), promise or plan (vows, pledges, plans, will, kündigt an, пообещал, намерен) and claim (says, denies, behauptet, заявил). The strongest act found counts (threat > demand > promise > claim); a headline with none is reported as an event. Word rules, no AI: 'will' in a quote or 'warns' in a weather story are counted too.",
    rule: "Do not retell a promise, threat or demand as if it had happened: 'X threatens tariffs' is not 'X imposed tariffs'. Report a claim as the speaker's statement.",
    honour: SEARLE, similar: "Research speech-act classifiers for tweets (Tweet Acts, MIT, 2016) and for rumour detection in Persian texts (2019) label acts in social media; this sensor labels live news headlines for agents and adds the act to check_headline.",
    generated_at: new Date(now).toISOString(),
  };
}
