// Аудитор черновика агента: тот же набор словесных правил, что и паспорт новости, но для ЧУЖОГО ТЕКСТА (ответа агента).
// Не проверяет истинность: находит места, где черновик что-то утверждает без видимого в нём основания.
// Правила (по карточкам): число без источника (Фрэнкфурт), прогноз как факт (Сёрл), расплывчатый авторитет (Фрэнкфурт, Уилсон),
// «всегда/никогда» (Юм), «сейчас» без даты (Микрин), цитата без говорящего (Деррида), «первый» (Реньон), необычное без источника (Юм, Лаплас),
// призыв к сделке (Линдли), ложная ссылка на Orb Studio (Уилсон). ИИ внутри нет.
import { QUOTED, FIRST_CLAIM, EXTRAORDINARY } from "./passport.js";
import { dealPressure, namedSource, orbTopics } from "./passport-lab.js";

export const AUDIT_MAX_CHARS = 4000, AUDIT_MAX_SENTENCES = 50;
const ATTR = /(according to|(?<![\p{L}])per [\p{Lu}]|source:|(?<![\p{L}])via [\p{Lu}]|(?<![\p{L}])(?:says?|said|reports?|reported) |по данным|по информации|как сообщает|сообщает|заявил\p{L}*|утверждает|пишет|(?<![\p{L}])laut |nach Angaben|quelle:|https?:\/\/|\[\d+\]|\([\p{Lu}][\p{L}]+,? \d{4}\))/iu;
const NUM = /(?:[$€£]\s?\d|\d[\d\s.,]*\s?(?:%|\$|€|usd|eur|млн|млрд|тыс|million|billion|mn|bn|km|кг|kg|°)|(?<![\p{L}\d.])\d{2,}(?![\d.]*\s?(?:г\.|года|год|year)))/iu;
const YEARONLY = /^\D*(?:19|20)\d\d\D*$/u;
const FORECAST = /(will (?:rise|fall|reach|grow|drop|increase|decrease|exceed|hit|double|triple|collapse|surge|crash)|wird (?:steigen|fallen|sinken|erreichen)|(?:вырастет|упадёт|достигнет|снизится|вырастут|подорожает|подешевеет|удвоится|обвалится|будет (?:расти|падать))|expected to|is set to|ожидается|erwartet wird)/iu;
const HEDGE = /(may|might|could|likely|probably|possibly|perhaps|возможно|вероятно|может|скорее всего|könnte|vielleicht|wahrscheinlich)/iu;
const VAGUE = /(experts? (?:say|believe|agree)|studies (?:show|prove)|scientists (?:say|have proven)|many (?:people )?(?:think|believe)|some say|it is (?:well )?known|reportedly|allegedly|эксперты (?:считают|говорят|уверены)|исследования показывают|учёные доказали|многие (?:считают|думают)|как известно|якобы|angeblich|Experten (?:sagen|meinen)|Studien zeigen)/iu;
const ABSOLUTE = /(?<![\p{L}])(always|never|guaranteed|everyone|nobody|100 ?%|всегда|никогда|гарантирован\p{L}*|все знают|никто не|immer|niemals|garantiert|jeder weiß)(?![\p{L}])/iu;
const NOWWORD = /(?<![\p{L}])(currently|right now|as of now|today|latest|newest|most recent|сейчас|сегодня|в настоящее время|последн\p{L}* верси\p{L}*|aktuell|derzeit|neueste\p{L}*)(?![\p{L}])/iu;
const HINT = {
  money_push: ["Не подталкивай читателя к сделке: срочность, «гарантированно», «переведите» и «успейте» превращают ответ в рекламу или мошенничество.", "Do not push the reader to act with money: urgency, 'guaranteed', 'transfer' and 'hurry' turn an answer into a pitch or a scam."],
  false_attribution: ["Orb Studio названа источником, но такого мы не публикуем: убери ссылку или проверь по /api/v1/sensors.", "Orb Studio is named as the source but does not publish this: remove the attribution or check /api/v1/sensors."],
  future_as_fact: ["Это про будущее, а не событие: назови, чей это прогноз или план, и добавь «может/по оценке».", "This is about the future, not an event: say whose forecast or plan it is and add a hedge."],
  number_no_source: ["Число без источника: добавь, откуда оно, и на какую дату.", "A number without a source: add where it comes from and the date."],
  vague_authority: ["Расплывчатый авторитет («эксперты», «исследования»): назови кто, где, когда.", "Vague authority ('experts', 'studies'): name who, where, when."],
  absolute: ["«Всегда/никогда/все»: проверь, нет ли исключений, или смягчи.", "'Always/never/everyone': check for exceptions or soften."],
  stale_or_undated_now: ["«Сейчас/последний» без даты или с прошлым годом: укажи дату данных или проверь свежесть.", "'Now/latest' without a date or with a past year: give the data date or check freshness."],
  quote_no_speaker: ["Цитата без говорящего: скажи, кто это сказал и где.", "A quote without a speaker: say who said it and where."],
  first_claim: ["«Первый/впервые»: скажи, по какому определению это первое.", "'First': say by which definition it is first."],
  extraordinary_no_source: ["Необычное утверждение без источника: чем необычнее, тем сильнее нужны доказательства.", "An extraordinary claim without a source: the more extraordinary, the stronger the evidence must be."],
};
export const AUDIT_FLAGS = Object.keys(HINT);

export function splitSentences(text) {
  return String(text || "").replace(/\r/g, "").split(/\n+|(?<=[.!?…])\s+(?=[\p{Lu}"«„“(\d])/u).map((x) => x.trim()).filter((x) => x.length >= 12);
}
export function auditSentence(sent, now = Date.now()) {
  const flags = [], attributed = ATTR.test(sent), year = new Date(now).getUTCFullYear();
  const money = dealPressure(sent); if (money.push) flags.push("money_push");
  const src = namedSource(sent); if (src && /^orb studio$/i.test(src) && !orbTopics(sent).length) flags.push("false_attribution");
  if (FORECAST.test(sent) && !attributed && !HEDGE.test(sent)) flags.push("future_as_fact");
  if (NUM.test(sent) && !attributed && !YEARONLY.test(sent) && !money.push) flags.push("number_no_source");
  if (VAGUE.test(sent)) flags.push("vague_authority");
  if (ABSOLUTE.test(sent)) flags.push("absolute");
  if (NOWWORD.test(sent)) { const ys = [...sent.matchAll(/(?<!\d)((?:19|20)\d\d)(?!\d)/g)].map((m) => +m[1]); if (!ys.length || Math.max(...ys) <= year - 1) flags.push("stale_or_undated_now"); }
  if (QUOTED.test(sent) && !attributed) flags.push("quote_no_speaker");
  if (FIRST_CLAIM.test(sent) && !attributed) flags.push("first_claim");
  if (EXTRAORDINARY.test(sent) && !attributed) flags.push("extraordinary_no_source");
  const red = flags.includes("money_push") || flags.includes("false_attribution");
  return { flags, status: red ? "red" : flags.length ? "check" : "no_rule_fired", attributed };
}
export function auditDraft(raw, now = Date.now()) {
  const text = String(raw || "").slice(0, AUDIT_MAX_CHARS), all = splitSentences(text), truncated = all.length > AUDIT_MAX_SENTENCES, list = all.slice(0, AUDIT_MAX_SENTENCES);
  const items = list.map((s, i) => ({ n: i + 1, sentence: s.length > 220 ? s.slice(0, 217) + "…" : s, ...auditSentence(s, now) }));
  const counts = {}; let flagged = 0, red = 0;
  for (const it of items) { if (it.flags.length) flagged++; if (it.status === "red") red++; for (const f of it.flags) counts[f] = (counts[f] || 0) + 1; }
  const share = items.length ? Math.round((100 * flagged) / items.length) : 0;
  const risk = !items.length ? "empty" : red > 0 || share >= 50 ? "high" : share >= 20 ? "medium" : "low";
  const fix = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([f, n]) => ({ flag: f, count: n, ru: HINT[f][0], en: HINT[f][1] }));
  return {
    tool: "audit_draft", sentences_checked: items.length, flagged, red, flagged_pct: share, risk, flag_counts: counts, fix_first: fix,
    sentences: items.filter((x) => x.flags.length).concat(items.filter((x) => !x.flags.length).slice(0, 0)),
    clean_sentences: items.length - flagged, truncated,
    rule: "Word rules, no AI, no web search. It finds statements that carry no visible basis in the draft (number without source, forecast as fact, vague authority, undated 'now', quote without speaker, pressure to act with money). 'no_rule_fired' means no rule fired, not that the sentence is true. It does not check facts: for one claim use check_claim, for outlet counts check_headline.",
    limits: `Up to ${AUDIT_MAX_CHARS} characters and ${AUDIT_MAX_SENTENCES} sentences; sentences under 12 characters are skipped; English, German and Russian patterns.`,
  };
}
