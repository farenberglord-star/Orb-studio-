import { finalVerdict, hostOf } from "./verdict.js";
import { toneOf } from "./tone.js";
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
// Хафф («Как лгать при помощи статистики», 1954) и Мейер («Точная журналистика», 1973): цифра опроса — оценка, а не результат
export const POLL = /(?<![\p{L}])(polls?|polling|survey|surveys|umfrage\p{L}*|опрос\p{L}*)(?![\p{L}])/iu;
// Найда, Райс, Чуковский: смысл сдвигается при переводе — сравни с оригиналом
export const TRANSLATION = /(?<![\p{L}])(translat\p{L}*|interpreter\p{L}*|mistranslat\p{L}*|übersetz\p{L}*|dolmetsch\p{L}*|перевод\p{L}*|переводчик\p{L}*)(?![\p{L}])/iu;
export const FIRST_CLAIM = /(?<![\p{L}])(the first|world's first|first[- ]ever|der erste|die erste|das erste|erstmals|впервые|первый в мире|первым в)(?![\p{L}])/iu;
export const EXTRAORDINARY = /(?<![\p{L}])(record\p{L}*|unprecedented|first[- ]ever|historic|never before|biggest ever|shock\p{L}*|bombshell|rekord\p{L}*|beispiellos\p{L}*|erstmals|noch nie|historisch\p{L}*|schock\p{L}*|рекорд\p{L}*|беспрецедентн\p{L}*|впервые|никогда (?:ещё|прежде)|историческ\p{L}*|шок\p{L}*|сенсаци\p{L}*)(?![\p{L}])/iu;
// Деррида, Шлейермахер: слова в кавычках или «X: …» вне контекста могут значить другое. Валла, Добровский, Шаль: найденный или утёкший документ проверяют по дате, словам и происхождению.
export const QUOTED = /["“”«»„]|‘[^’]{3,}’|(?<![\p{L}])'[^']{3,}'(?![\p{L}])/u; // апостроф в «Trump’s» — не кавычка
export const FOUND_DOC = /(?<![\p{L}])(1[0-8]\d\d\s+(?:map|manuscript|letter|chart|scroll|painting|diary)s?|diar(?:y|ies)\b[^.;:]{0,40}\b(?:found|discovered)|(?:found|discovered|newly found) diar\p{L}*|Tagebüch\p{L}*[^.;:]{0,30}(?:aufgetaucht|entdeckt|gefunden)|дневник\p{L}*[^.;:]{0,30}(?:найден\p{L}*|обнаружен\p{L}*)|leak\p{L}*|unearthed|newly (?:found|discovered|released)|secret (?:letter|memo|files?|documents?|recording|tape)|documents? (?:show|reveal)\p{L}*|(?:audio|video) (?:recording|tape)s?|dossier|geleakt\p{L}*|aufgetaucht\p{L}*|Geheim(?:papier|dokument|akte)\p{L}*|Dokumente? (?:zeig|belegt)\p{L}*|Mitschnitt\p{L}*|утечк\p{L}*|утёкш\p{L}*|рассекреч\p{L}*|секретн\p{L}* (?:документ|письм|запис)\p{L}*|документы показ\p{L}*|аудиозапис\p{L}*|переписк\p{L}*|досье)(?![\p{L}])/iu;
// Макс Мюллер, «болезнь языка»: метафора, понятая буквально, становится выдуманным событием. Короткий свой список на трёх языках.
export const METAPHOR = /(?<![\p{L}])(price war|trade war|tariff war|chip war|currency war|bloodbath|meltdown|tsunami of|political earthquake|perfect storm|time bomb|nuclear option|free ?fall|firestorm|Preiskrieg\p{L}*|Handelskrieg\p{L}*|Zollkrieg\p{L}*|Währungskrieg\p{L}*|Blutbad|Kahlschlag|Tsunami (?:an|von)|politische\p{L}* Erdbeben|Zeitbombe|Kernschmelze|freie\p{L}* Fall|perfekte\p{L}* Sturm|ценов\p{L}* войн\p{L}*|торгов\p{L}* войн\p{L}*|тарифн\p{L}* войн\p{L}*|валютн\p{L}* войн\p{L}*|кровав\p{L}* бан\p{L}*|цунами (?:увольнений|банкротств|продаж|исков|жалоб)|политическ\p{L}* землетрясени\p{L}*|бомб\p{L}* замедленного действия|свободн\p{L}* падени\p{L}*|идеальн\p{L}* шторм\p{L}*)(?![\p{L}])/iu;
// Олпорт и Постман, «Психология слуха» (1947): сила слуха ≈ важность × неясность; Кэнтрил: кто проверял — не паниковал.
export const GRAVE = /(?<![\p{L}])(war|attack\p{L}*|strikes?|missiles?|explosions?|blasts?|crash\p{L}*|collaps\p{L}*|default\p{L}*|bankrupt\p{L}*|bank run|killed|dead|deaths?|hostages?|nuclear|evacuat\p{L}*|earthquake|flood\p{L}*|terror\p{L}*|shooting|Krieg\p{L}*|Angriff\p{L}*|Rakete\p{L}*|Explosion\p{L}*|Absturz|Einsturz|Pleite|Insolvenz|Tote\p{L}*|Geisel\p{L}*|Anschlag|Evakuierung|Erdbeben|Hochwasser|войн\p{L}*|атак\p{L}*|удар\p{L}*|ракет\p{L}*|взрыв\p{L}*|крушени\p{L}*|обрушени\p{L}*|дефолт\p{L}*|банкротств\p{L}*|погиб\p{L}*|жертв\p{L}*|заложник\p{L}*|ядерн\p{L}*|эвакуац\p{L}*|землетрясени\p{L}*|наводнени\p{L}*|теракт\p{L}*)(?![\p{L}])/iu;
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
  const meta = (headline.match(METAPHOR) || [])[0] || null;
  if (meta) say.push(`The headline uses a metaphor ('${meta}'): say in plain words what actually happened, and do not repeat the metaphor as if it were the fact.`);
  const tone = toneOf(headline);
  if (tone && tone.loaded) say.push(`The headline is emotionally loaded ('${tone.words.slice(0, 3).join("', '")}'): report the facts in neutral words — the heat belongs to the outlet, not to the event.`);
  const foundDoc = FOUND_DOC.test(headline);
  if (foundDoc) say.push("The story rests on a leaked or newly found document or recording: say that its date, wording and origin still need checking — a find that suits one side needs double checking, not less.");
  const grave = GRAVE.test(headline), unclear = chk.class === "nothing_to_check" || chk.class === "hedged" || chk.class === "thin";
  const rumourRisk = grave && (voices == null || voices <= 1) && unclear;
  if (rumourRisk) say.push("A grave topic, few outlets and unclear facts: this is how rumours are born (importance × ambiguity). Stick to what is confirmed, say what is not known yet, and point listeners to an independent source.");
  const amp0 = it && it.amplified;
  if (amp0 && amp0.first_source && (voices == null || voices >= 2)) say.push(`First carried by ${amp0.first_source}: if outlets repeat each other, credit the first source, not the number of retellings.`);
  const extraordinary = EXTRAORDINARY.test(headline);
  // тренировка на прошлом: «первый звуковой фильм» был первым лишь по одному определению — спроси, по какому (уверенность не трогаем)
  if (TRANSLATION.test(headline)) say.push("The story turns on a translation: quote the original wording, say who translated it, and compare language versions before choosing one.");
  const poll = POLL.test(headline);
  if (poll) say.push("The figure comes from a poll or survey: say who was asked, how many, when and with what margin of error — a poll is an estimate, not the result (Literary Digest 1936: 2.4 million answers, the wrong winner).");
  if (FIRST_CLAIM.test(headline)) say.push("The headline calls something 'the first': say by which definition it is first — many 'firsts' hold only for one way of counting.");
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
  const low = rumourRisk || (voices != null && voices <= 1) || chk.class === "nothing_to_check" || (age != null && age > 48) || (extraordinary && (voices == null || voices <= 2));
  const high = !low && !foundDoc && !poll && act.act === "event" && voices != null && voices >= 3 && chk.class === "checkable" && (age == null || age <= 24);
  // «Ризон», модель швейцарского сыра: какие слои паспорта подняли тревогу — чтобы потом видеть, какой слой пропустил оспоренную историю
  const fired = [
    age != null && age > 24 && "stale", act.act !== "event" && "not_event", voices != null && voices <= 1 && "few_voices",
    (chk.class === "nothing_to_check" || chk.class === "hedged") && "vague", (QUOTED.test(headline) || (act.act === "claim" && COLON_SPEAKER.test(headline))) && "quoted",
    foundDoc && "found_document", extraordinary && (voices == null || voices <= 2) && "extraordinary", rumourRisk && "rumour_risk",
    poll && "poll", meta && "metaphor", tone && tone.loaded && "tone", it && it.state_media && "state_media",
    amp && amp.outlets_peak >= 3 && amp.outlets_peak >= 2 * Math.max(1, amp.outlets_first) && "amplified",
  ].filter(Boolean);
  return {
    what: headline, status, voices, age_hours: age == null ? null : Math.round(age * 10) / 10,
    checkability: chk.class, speech_act: act.act, state_media: (it && it.state_media) || null,
    amplified: amp && amp.outlets_peak >= 3 && amp.outlets_peak >= 2 * Math.max(1, amp.outlets_first) ? { from: amp.outlets_first, to: amp.outlets_peak } : null,
    first_source: (amp && amp.first_source) || null, quoted: QUOTED.test(headline), found_document: foundDoc, metaphor: meta, tone: tone && tone.loaded ? tone : null, rumour_risk: rumourRisk,
    confidence: high ? "high" : low ? "low" : "medium", fired, say,
    verdict: finalVerdict({ headline, voices, debunk: (it && it.debunk) || 0, measured: (it && it.measured) || null, host: hostOf(it && it.link), act: act.act, rumourRisk, checkability: chk.class }),
    chain: evidenceChain({ act: act.act, voices, age, check: chk.class, first: (amp && amp.first_source) || null, quoted: QUOTED.test(headline), metaphor: !!meta, tone: !!(tone && tone.loaded) }),
    steps: ["freshness (Mikrin, Cox)", "independent voices (check_headline)", "speech act (Searle)", "checkability (Frankfurt)", "state media (Lyberg)", "retellings vs first source (Kasperson, Zajonc)", "extraordinary claims need stronger evidence (Hume, Laplace)", "quotes out of context (Derrida, Schleiermacher)", "found documents: date, wording, origin (Valla, Dobrovsky, Chasles)", "first source, not the count of retellings (Schleicher)", "metaphor is not the fact (Max Müller)", "loaded words: evaluation, potency, activity (Osgood, Elias)", "grave + few outlets + unclear = rumour risk (Allport, Cantril)", "do not amplify, say where facts stop (Kasperson, Lindley)"],
  };
}
// «Цепочка от увиденного до сказанного» — мостик Библиотеки кристаллов: Уигмор (схемы доказательств, 1913) + Джером Фрэнк
// («Суды под судом», 1949: факт держится на восприятии, памяти и пересказе) + Бернгейм + Отле. Звенья паспорта в порядке
// от события к заголовку; самое слабое звено называется отдельно. Уверенность паспорта цепочка не меняет — она её объясняет.
const LINK_ORDER = ["voices", "event", "checkable", "fresh", "wording"];
export function evidenceChain({ act, voices, age, check, first, quoted, metaphor, tone } = {}) {
  const links = [
    { link: "event", ru: "что произошло", value: act || null, weak: !!act && act !== "event", why: act && act !== "event" ? `the headline reports a ${act}, not an event` : null },
    { link: "first_source", ru: "кто первым сообщил", value: first || null, weak: false, why: first ? null : "first source not known" },
    { link: "voices", ru: "сколько независимых изданий", value: voices ?? null, weak: voices != null && voices <= 1, why: voices != null && voices <= 1 ? `only ${voices} outlet${voices === 1 ? "" : "s"}` : voices == null ? "not counted" : null },
    { link: "checkable", ru: "можно ли проверить", value: check || null, weak: check === "nothing_to_check", why: check === "nothing_to_check" ? "nothing in the headline can be checked" : null },
    { link: "fresh", ru: "насколько свежее", value: age == null ? null : Math.round(age * 10) / 10, weak: age != null && age > 24, why: age != null && age > 24 ? `${Math.round(age)} hours old` : null },
    { link: "wording", ru: "слова заголовка", value: [quoted && "quote", metaphor && "metaphor", tone && "loaded"].filter(Boolean), weak: !!(quoted || metaphor || tone), why: quoted || metaphor || tone ? "wording may shift the meaning" : null },
  ];
  const weak = LINK_ORDER.map((id) => links.find((l) => l.link === id)).find((l) => l && l.weak) || null;
  return { links, weakest: weak ? { link: weak.link, ru: weak.ru, why: weak.why } : null, note: "Chain from event to headline (Wigmore, Jerome Frank). The weakest link is the first reason to doubt; it does not change the confidence." };
}
export const PASSPORT_RULE = "News passport: every headline passes one chain of word rules before air — age, independent outlets, speech act (event / statement / promise / threat / demand), checkability, state media — and gets a confidence (high / medium / low) and plain 'say' lines for the host. No AI in the passport itself.";

// Один счёт изданий для паспорта: узкий (только наши ленты) и широкий (Bing News за 2 дня); берём больший.
// null — счёта нет вообще (не ноль). Так же считает confirmMany.
export function mergeVoices(narrow, wide) {
  const n = Number.isFinite(narrow) ? narrow : 0, w = Number.isFinite(wide) ? wide : 0;
  return Math.max(n, w) || null;
}
// Слегка переписанный заголовок: доля общих значимых слов (Жаккар) не ниже 70 %, как ECHO_SAME в echo.js. a, b — Set слов (sigOf).
export const PASSPORT_SAME = 0.7;
export function sigSimilar(a, b, min = PASSPORT_SAME) {
  if (!a || !b || a.size < 3 || b.size < 3) return false;
  let k = 0; for (const x of a) if (b.has(x)) k++;
  return k / (a.size + b.size - k) >= min;
}
