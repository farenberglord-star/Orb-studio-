// Экспериментальные проверки паспорта (лаборатория). НЕ подключены к newsPassport и не меняют уверенность Хармана:
// это отдельные подсказки рядом с паспортом, пока владелец не скажет «да».
// 1) Маркер опровержения (Kasperson, Frankfurt): статьи-опровержения повторяют заголовок, но это не подтверждения.
// 2) «Побуждение к сделке» (Hume, Lindley): два и больше сигнала из четырёх — это не новость.
const DEBUNK = /(?<![\p{L}])(fact[- ]?check\p{L}*|debunk\p{L}*|no evidence|fabricated|hoax|blatant lie|false claim|фейк\p{L}*|опроверг\p{L}*|опровергл\p{L}*|ложн\p{L}* информац\p{L}*|faktencheck\p{L}*|falschmeldung\p{L}*|erfunden\p{L}*|gefälscht\p{L}*|dementiert\p{L}*)(?![\p{L}])/iu;
const GAIN = /(\d[\d\s.,]*\s?%|guaranteed|гарантир\p{L}*|garantiert)/iu;
const ACT = /(?<![\p{L}])(transfer|send your|buy now|invest now|переведите|перевести|успейте|купите|jetzt kaufen|überweisen)(?![\p{L}])/iu;
const URGENT = /(?<![\p{L}])(urgent|hurry|limited|only \d+ hours|срочно|огранич\p{L}*|за \d+ минут|dringend|nur noch|23:59)(?![\p{L}])/iu;
const SECRET = /(?<![\p{L}])(insider|anonymous sources|secret(?:ly)?|exclusive|инсайд\p{L}*|анонимн\p{L}* источник\p{L}*|тайно|эксклюзив\p{L}*|geheim\p{L}*)(?![\p{L}])/iu;

export function dealPressure(text) {
  const t = String(text || "");
  const hits = [];
  if (GAIN.test(t) && /(рост|прибыл|growth|profit|gain|return|rise|\+)/iu.test(t) && /\d{3,}\s?%|guaranteed|гарантир|garantiert/iu.test(t)) hits.push("gain");
  if (ACT.test(t)) hits.push("act");
  if (URGENT.test(t)) hits.push("urgent");
  if (SECRET.test(t)) hits.push("secret");
  return { hits, push: hits.length >= 2 };
}

// results: [{ source, title, text }] — материалы, найденные по этой истории (их уже отобрал поиск изданий).
export function labCheck(headline, results = []) {
  const debunk = [], support = new Set();
  for (const r of results) {
    const dom = String(r.source || "").toLowerCase().replace(/^www\./, "");
    if (DEBUNK.test(`${r.title || ""} ${r.text || ""}`)) debunk.push(dom); else if (dom) support.add(dom);
  }
  const money = dealPressure(headline);
  const independent = support.size;
  let verdict = "check", why = "not enough independent outlets and no debunk found";
  if (money.push) { verdict = "not_news"; why = "pressure to act with money: " + money.hits.join(", "); }
  else if (debunk.length >= 1 && independent < 2) { verdict = "debunked"; why = `${debunk.length} fact-check item(s), ${independent} outlet(s) repeating it as news`; }
  else if (debunk.length >= 1) { verdict = "check"; why = "both reports and a debunk exist: read the debunk"; }
  else if (independent >= 3) { verdict = "reported"; why = `${independent} independent outlets, no debunk`; }
  return { verdict, why, independent_outlets: independent, debunk_items: debunk.length, deal_pressure: money.hits, confirm_for_passport: independent };
}

// Шаг 1 правила «названный источник» (Wilson: авторитет по теме): кто назван автором сообщения.
// Только находит имя; ничего не проверяет и не влияет на паспорт.
const NAME = "([\\p{Lu}][\\p{L}\\p{N}.&'’-]*(?:\\s+[\\p{Lu}][\\p{L}\\p{N}.&'’-]*){0,3})";
const SRC_PATTERNS = [
  new RegExp(`^${NAME}\\s+(?:сообщает|сообщили|сообщил|заявляет|заявила|заявил|пишет|пишут|публикует|опубликовал\\p{L}*|report(?:s|ed)|says|said|announces?|announced|publishes|published|meldet|berichtet|schreibt)(?![\\p{L}])`, "u"),
  new RegExp(`(?:[Пп]о данным|[Пп]о информации|[Aa]ccording to|[Ll]aut|[Nn]ach Angaben von|[Кк]ак сообщает|[Aa]s reported by)\\s+${NAME}`, "u"),
];
export function namedSource(text) {
  const t = String(text || "").trim().replace(/^["«„“]+/, "");
  for (const re of SRC_PATTERNS) { const m = t.match(re); if (m && m[1]) return m[1].replace(/[.,;:]+$/, "").trim(); }
  return null;
}
