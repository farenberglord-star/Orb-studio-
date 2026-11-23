// «Паспорт новости»: одна цепочка проверок перед эфиром. Каждая новость проходит шаги в порядке зон библиотеки:
// 1) свежесть (Микрин/Кокс), 2) факт или слух (независимые голоса, Сёрл — речевой акт, Франкфурт — есть ли что проверить, госСМИ),
// 3) уверенность и 4) что не говорить (зоны 6–8: Касперсон — не раздувать риск, Линдли — не говорить с уверенностью, которой нет).
// Без ИИ, только правила. Ведущие говорят своими словами, но опираются на паспорт, а не на сырой заголовок.
import { searleHeadline } from "./searle.js";
import { frankfurtHeadline } from "./frankfurt.js";
import { regionsOf } from "./lyberg.js";

export const PASSPORT_STATUS = { event: "reported_event", claim: "statement", promise: "plan_or_promise", threat: "threat_or_warning", demand: "demand", forecast: "forecast_or_speculation", question: "question_headline" };
// «Трамп: Иран …», «Kremlin: …» — заявление с двоеточием; прогнозы и догадки; заголовок-вопрос
const COLON_SPEAKER = /^\s*(?:[\p{Lu}][\p{L}.'’-]*)(?:\s+[\p{Lu}][\p{L}.'’-]*){0,3}\s*:\s+\S/u;
const FORECAST_RE = /(?<![\p{L}])(forecasts?|predicts?|predicted|expects?|expected|outlook|projects?|projected|sees|could|may|might|likely|odds|prognos\p{L}*|erwartet|rechnet mit|könnte|dürfte|прогноз\p{L}*|ожида\p{L}*|может|могут|вероятн\p{L}*)(?![\p{L}])|(?<![\p{L}])report\s*:|\bto (raise|cut|hike|lower) rates\b/iu;
const SPEAKERS = /trump|putin|selensk|zelensk|merz|macron|scholz|starmer|xi\b|erdo|netan|biden|vance|lavrov|peskov|kremlin|white house|трамп|путин|зеленск|мерц|макрон|эрдоган|нетаньях|лавров|песков|кремл|белый дом/i;
// Юм, «О чудесах»: чем необычнее утверждение, тем сильнее нужны доказательства. Слова «рекорд», «беспрецедентный», «впервые», «шок» на трёх языках.
export const EXTRAORDINARY = /(?<![\p{L}])(record\p{L}*|unprecedented|first[- ]ever|historic|never before|biggest ever|shock\p{L}*|bombshell|rekord\p{L}*|beispiellos\p{L}*|erstmals|noch nie|historisch\p{L}*|schock\p{L}*|рекорд\p{L}*|беспрецедентн\p{L}*|впервые|никогда (?:ещё|прежде)|историческ\p{L}*|шок\p{L}*|сенсаци\p{L}*)(?![\p{L}])/iu;
// Деррида, Шлейермахер: слова в кавычках или «X: …» вне контекста могут значить другое. Валла, Добровский, Шаль: найденный или утёкший документ проверяют по дате, словам и происхождению.
export const QUOTED = /["“”«»„]|‘[^’]{3,}’|(?<![\p{L}])'[^']{3,}'(?![\p{L}])/u; // апостроф в «Trump’s» — не кавычка
export const FOUND_DOC = /(?<![\p{L}])(leak\p{L}*|unearthed|newly (?:found|discovered|released)|secret (?:letter|memo|files?|documents?|recording|tape)|documents? (?:show|reveal)\p{L}*|(?:audio|video) (?:recording|tape)s?|dossier|geleakt\p{L}*|aufgetaucht\p{L}*|Geheim(?:papier|dokument|akte)\p{L}*|Dokumente? (?:zeig|belegt)\p{L}*|Mitschnitt\p{L}*|утечк\p{L}*|утёкш\p{L}*|рассекреч\p{L}*|секретн\p{L}* (?:документ|письм|запис)\p{L}*|документы показ\p{L}*|аудиозапис\p{L}*|переписк\p{L}*|досье)(?![\p{L}])/iu;
function actOf(headline, searle) {
  const t = String(headline || "").trim();
  if (/\?\s*$/.test(t)) return "question";
  if (FORECAST_RE.test(t) && (searle.act === "event" || searle.act === "promise")) return "forecast"; // «X says … could» остаётся заявлением
  if (searle.act === "event" && COLON_SPEAKER.test(t)) { const head = t.split(":")[0]; if (SPEAKERS.test(head) || !regionsOf(head).length) return "claim"; } // «Turkey: …» — место, а не говорящий
  return searle.act;
}

export function newsPassport(it, now = Date.now()) {
  const headline = String((it && it.headline) || ""), se = searleHeadline(headline), act = { act: actOf(headline, se) }, chk = frankfurtHeadline(headline);
  const pub = it && it.published_at ? Date.parse(it.published_at) : NaN, age = Number.isFinite(pub) ? Math.max(0, (now - pub) / 3600e3) : null;
  const voices = it && Number.isFinite(+it.confirm) && it.confirm !== null ? +it.confirm : null;
  const status = PASSPORT_STATUS[act.act] || "reported_event", say = [];
  if (act.act === "question") say.push("The headline asks a question: do not turn it into an answer or a fact.");
  else if (act.act === "forecast") say.push("This is a forecast or a guess by someone: name whose it is, do not present it as what will happen.");
  else if (act.act === "threat") say.push("This is a threat or warning, not something that happened: do not say it was done.");
  else if (act.act === "demand") say.push("This is a demand or a call, not a decision: say who wants it.");
  else if (act.act === "promise") say.push("This is a plan, promise or announcement: it has not happened yet.");
  else if (act.act === "claim") say.push("This is someone's statement: attribute it ('X says'), do not present it as the fact itself.");
  if (QUOTED.test(headline) || (act.act === "claim" && COLON_SPEAKER.test(headline))) say.push("The headline carries someone's words: out of context they can mean something else — say whose words they are and where they were said, and do not build the story on the quote alone.");
  const foundDoc = FOUND_DOC.test(headline);
  if (foundDoc) say.push("The story rests on a leaked or newly found document or recording: say that its date, wording and origin still need checking — a find that suits one side needs double checking, not less.");
  const amp0 = it && it.amplified;
  if (amp0 && amp0.first_source && (voices == null || voices >= 2)) say.push(`First carried by ${amp0.first_source}: if outlets repeat each other, credit the first source, not the number of retellings.`);
  const extraordinary = EXTRAORDINARY.test(headline);
  if (extraordinary && (voices == null || voices <= 2)) say.push("The headline makes an extraordinary claim (record, unprecedented, first ever) and few outlets carry it: the more extraordinary the claim, the stronger the evidence must be — present it as reported, not as established.");
  if (voices === 1) say.push("Only one outlet carries it so far: say so.");
  else if (voices === 0) say.push("No other outlet confirms it yet: treat it as unconfirmed.");
  if (age != null && age > 24) say.push(`Reported about ${Math.round(age)} hours ago: do not call it breaking or new.`);
  if (chk.class === "nothing_to_check") say.push("The headline is vague (no clear who, when or how many): do not add specifics and do not present it as established.");
  else if (chk.class === "hedged") say.push("The headline is hedged (" + chk.vague_words.slice(0, 3).join(", ") + "): keep the hedge.");
  const amp = it && it.amplified;
  if (amp && amp.outlets_peak >= 3 && amp.outlets_peak >= 2 * Math.max(1, amp.outlets_first)) say.push(`Retellings spread this story from ${amp.outlets_first} to ${amp.outlets_peak} outlets: repetition is not confirmation and makes it feel truer than it is — stick to what the first source said.`);
  if (it && it.state_media) say.push(`The source is state media (${it.state_media}): name it as such.`);
  say.push("Do not make the risk sound bigger than the source says, and say plainly where the known facts stop.");
  const low = (voices != null && voices <= 1) || chk.class === "nothing_to_check" || (age != null && age > 48) || (extraordinary && (voices == null || voices <= 2));
  const high = !low && !foundDoc && act.act === "event" && voices != null && voices >= 3 && chk.class === "checkable" && (age == null || age <= 24);
  return {
    what: headline, status, voices, age_hours: age == null ? null : Math.round(age * 10) / 10,
    checkability: chk.class, speech_act: act.act, state_media: (it && it.state_media) || null,
    amplified: amp && amp.outlets_peak >= 3 && amp.outlets_peak >= 2 * Math.max(1, amp.outlets_first) ? { from: amp.outlets_first, to: amp.outlets_peak } : null,
    first_source: (amp && amp.first_source) || null, quoted: QUOTED.test(headline), found_document: foundDoc,
    confidence: high ? "high" : low ? "low" : "medium", say,
    steps: ["freshness (Mikrin, Cox)", "independent voices (check_headline)", "speech act (Searle)", "checkability (Frankfurt)", "state media (Lyberg)", "retellings vs first source (Kasperson, Zajonc)", "extraordinary claims need stronger evidence (Hume, Laplace)", "quotes out of context (Derrida, Schleiermacher)", "found documents: date, wording, origin (Valla, Dobrovsky, Chasles)", "first source, not the count of retellings (Schleicher)", "do not amplify, say where facts stop (Kasperson, Lindley)"],
  };
}
export const PASSPORT_RULE = "News passport: every headline passes one chain of word rules before air — age, independent outlets, speech act (event / statement / promise / threat / demand), checkability, state media — and gets a confidence (high / medium / low) and plain 'say' lines for the host. No AI in the passport itself.";
