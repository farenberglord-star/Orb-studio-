// «Паспорт новости»: одна цепочка проверок перед эфиром. Каждая новость проходит шаги в порядке зон библиотеки:
// 1) свежесть (Микрин/Кокс), 2) факт или слух (независимые голоса, Сёрл — речевой акт, Франкфурт — есть ли что проверить, госСМИ),
// 3) уверенность и 4) что не говорить (зоны 6–8: Касперсон — не раздувать риск, Линдли — не говорить с уверенностью, которой нет).
// Без ИИ, только правила. Ведущие говорят своими словами, но опираются на паспорт, а не на сырой заголовок.
import { searleHeadline } from "./searle.js";
import { frankfurtHeadline } from "./frankfurt.js";

export const PASSPORT_STATUS = { event: "reported_event", claim: "statement", promise: "plan_or_promise", threat: "threat_or_warning", demand: "demand", forecast: "forecast_or_speculation", question: "question_headline" };
// «Трамп: Иран …», «Kremlin: …» — заявление с двоеточием; прогнозы и догадки; заголовок-вопрос
const COLON_SPEAKER = /^\s*(?:[\p{Lu}][\p{L}.'’-]*)(?:\s+[\p{Lu}][\p{L}.'’-]*){0,3}\s*:\s+\S/u;
const FORECAST_RE = /(?<![\p{L}])(forecasts?|predicts?|predicted|expects?|expected|outlook|projects?|projected|sees|could|may|might|likely|odds|prognos\p{L}*|erwartet|rechnet mit|könnte|dürfte|прогноз\p{L}*|ожида\p{L}*|может|могут|вероятн\p{L}*)(?![\p{L}])|(?<![\p{L}])report\s*:|\bto (raise|cut|hike|lower) rates\b/iu;
function actOf(headline, searle) {
  const t = String(headline || "").trim();
  if (/\?\s*$/.test(t)) return "question";
  if (FORECAST_RE.test(t) && (searle.act === "event" || searle.act === "promise")) return "forecast"; // «X says … could» остаётся заявлением
  if (searle.act === "event" && COLON_SPEAKER.test(t)) return "claim";
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
  if (voices === 1) say.push("Only one outlet carries it so far: say so.");
  else if (voices === 0) say.push("No other outlet confirms it yet: treat it as unconfirmed.");
  if (age != null && age > 24) say.push(`Reported about ${Math.round(age)} hours ago: do not call it breaking or new.`);
  if (chk.class === "nothing_to_check") say.push("The headline is vague (no clear who, when or how many): do not add specifics and do not present it as established.");
  else if (chk.class === "hedged") say.push("The headline is hedged (" + chk.vague_words.slice(0, 3).join(", ") + "): keep the hedge.");
  const amp = it && it.amplified;
  if (amp && amp.outlets_peak >= 3 && amp.outlets_peak >= 2 * Math.max(1, amp.outlets_first)) say.push(`Retellings spread this story from ${amp.outlets_first} to ${amp.outlets_peak} outlets: repetition is not confirmation and makes it feel truer than it is — stick to what the first source said.`);
  if (it && it.state_media) say.push(`The source is state media (${it.state_media}): name it as such.`);
  say.push("Do not make the risk sound bigger than the source says, and say plainly where the known facts stop.");
  const low = (voices != null && voices <= 1) || chk.class === "nothing_to_check" || (age != null && age > 48);
  const high = !low && act.act === "event" && voices != null && voices >= 3 && chk.class === "checkable" && (age == null || age <= 24);
  return {
    what: headline, status, voices, age_hours: age == null ? null : Math.round(age * 10) / 10,
    checkability: chk.class, speech_act: act.act, state_media: (it && it.state_media) || null,
    amplified: amp && amp.outlets_peak >= 3 && amp.outlets_peak >= 2 * Math.max(1, amp.outlets_first) ? { from: amp.outlets_first, to: amp.outlets_peak } : null,
    confidence: high ? "high" : low ? "low" : "medium", say,
    steps: ["freshness (Mikrin, Cox)", "independent voices (check_headline)", "speech act (Searle)", "checkability (Frankfurt)", "state media (Lyberg)", "retellings vs first source (Kasperson, Zajonc)", "do not amplify, say where facts stop (Kasperson, Lindley)"],
  };
}
export const PASSPORT_RULE = "News passport: every headline passes one chain of word rules before air — age, independent outlets, speech act (event / statement / promise / threat / demand), checkability, state media — and gets a confidence (high / medium / low) and plain 'say' lines for the host. No AI in the passport itself.";
