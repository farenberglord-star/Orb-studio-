// «Подумай, прежде чем решить» (think_it_through): человек или его агент присылает вопрос текстом, в ответ идут 1–3 вопроса-подсказки
// из Библиотеки кристаллов, каждый с именами учёных, из чьих работ он взят. Словесные правила, без ИИ и без поиска в сети.
// Это НЕ ответ и НЕ рекомендация: инструмент не выбирает страну, систему, покупку или лечение и не даёт финансовых советов,
// а подсказывает, как проверить собственный вывод. Каждый вопрос — по зоне; зону выбирают слова вопроса (ru / en / de).
export const THINK_MAX_CHARS = 600;

// id — карточка библиотеки (проверяет тест); name — имя для людей, когда карточки в списке учёных нет (датчики)
const P = (zone, who, q) => ({ zone, who, q });
export const THINK_ZONES = {
  rumour_vs_fact: P("rumour_vs_fact",
    [{ id: "naroll_r", name: "Raoul Naroll" }, { id: "kish_l", name: "Leslie Kish" }, { name: "John Searle" }],
    { en: "Is this reported, or only retold? Ask who said it first, and whether the sources are independent reports or copies of one (similar cases may be copies; count independent voices, not outlets). Also: is it a statement of fact, a promise, a threat or a forecast?",
      ru: "Это сообщили или только пересказали? Спроси, кто сказал первым и независимы ли источники или это копии одного (похожие случаи могут быть копиями; считай независимые голоса, а не издания). И ещё: это утверждение о факте, обещание, угроза или прогноз?",
      de: "Ist das berichtet oder nur nacherzählt? Frag, wer es zuerst gesagt hat und ob die Quellen unabhängig sind oder Kopien einer einzigen (ähnliche Fälle können Kopien sein; zähle unabhängige Stimmen, nicht Medien). Und: Ist es eine Tatsachenaussage, ein Versprechen, eine Drohung oder eine Prognose?" }),
  stale_data: P("stale_data",
    [{ id: "rotemberg_jj", name: "Julio Rotemberg" }, { id: "garcia_molina_h", name: "Héctor García-Molina" }, { id: "hinkley_dv", name: "David Hinkley" }],
    { en: "Is this still true today? Check the date of the data. A jump in the market does not mean the price on the shelf has caught up, and a quiet source should be judged against its own usual rhythm, not against yours.",
      ru: "Это всё ещё так сегодня? Проверь дату данных. Скачок на рынке не значит, что цена на полке уже догнала, а молчание источника надо мерить его собственным ритмом, а не твоим.",
      de: "Stimmt das heute noch? Prüfe das Datum der Daten. Ein Sprung am Markt heißt nicht, dass der Regalpreis schon nachgezogen hat, und das Schweigen einer Quelle misst man an ihrem eigenen Rhythmus, nicht an deinem." }),
  one_model: P("one_model",
    [{ name: "Edward Leamer" }, { id: "schwarz_g", name: "Gideon Schwarz" }, { id: "akaike_h", name: "Hirotugu Akaike" }],
    { en: "Does your conclusion survive a small change of assumptions? Try one reasonable alternative and see whether the answer flips. And does a more complicated explanation earn its extra parts, or does a simpler one do almost as well?",
      ru: "Выдержит ли твой вывод небольшое изменение допущений? Попробуй одну разумную альтернативу и посмотри, перевернётся ли ответ. И заслуживает ли сложное объяснение своих лишних частей или простое почти так же хорошо?",
      de: "Hält dein Schluss einer kleinen Änderung der Annahmen stand? Probiere eine vernünftige Alternative und sieh, ob die Antwort kippt. Und verdient eine kompliziertere Erklärung ihre zusätzlichen Teile, oder reicht eine einfachere fast genauso?" }),
  answer_cost: P("answer_cost",
    [{ id: "mccall_jj", name: "John McCall" }, { id: "degroot_mh", name: "Morris DeGroot" }, { id: "chernoff_h", name: "Herman Chernoff" }],
    { en: "Is one more check worth its price? Keep collecting only while the next source could change your decision by more than it costs you; pick the next source for the most new information per effort.",
      ru: "Стоит ли ещё одна проверка своей цены? Продолжай собирать, пока следующий источник может изменить твоё решение сильнее, чем он тебе стоит; выбирай следующий источник по наибольшей новой информации на усилие.",
      de: "Lohnt sich eine weitere Prüfung? Sammle nur weiter, solange die nächste Quelle deine Entscheidung stärker ändern kann, als sie dich kostet; wähle die nächste Quelle nach dem größten neuen Informationsgewinn je Aufwand." }),
  measurement_error: P("measurement_error",
    [{ name: "Jacob Cohen" }, { id: "shewhart", name: "Walter Shewhart" }],
    { en: "Is the number steady, or is it noise? Ask how many cases it rests on. 'Not significant' does not mean 'no effect', and a single jump may be an ordinary swing, not a real change.",
      ru: "Число устойчивое или это шум? Спроси, на скольких случаях оно держится. «Незначимо» не значит «эффекта нет», а одиночный скачок может быть обычным колебанием, а не настоящей переменой.",
      de: "Ist die Zahl stabil oder Rauschen? Frag, auf wie vielen Fällen sie beruht. „Nicht signifikant“ heißt nicht „kein Effekt“, und ein einzelner Sprung kann eine gewöhnliche Schwankung sein, keine echte Änderung." }),
  own_limits: P("own_limits",
    [{ name: "Harry Frankfurt" }, { id: "lindley", name: "Dennis Lindley" }],
    { en: "How sure am I, and why? Say what you do not know and how you would find out. Confidence should match what you have actually checked, not how strongly it feels.",
      ru: "Насколько я уверен и почему? Скажи, чего ты не знаешь и как это выяснить. Уверенность должна соответствовать тому, что ты реально проверил, а не тому, как сильно это чувствуется.",
      de: "Wie sicher bin ich und warum? Sag, was du nicht weißt und wie du es herausfinden würdest. Sicherheit sollte dem entsprechen, was du wirklich geprüft hast, nicht dem Gefühl." }),
  side_effects: P("side_effects",
    [{ name: "Roger Kasperson" }, { id: "campbell_dt", name: "Donald Campbell" }],
    { en: "What else will it change? Retelling can amplify a risk beyond its size, and a measure that becomes a target gets bent. Ask who else is affected and what changes besides the goal.",
      ru: "Что ещё это изменит? Пересказ может раздуть риск сверх его размера, а мера, ставшая целью, искривляется. Спроси, кого ещё это затронет и что изменится помимо цели.",
      de: "Was ändert sich sonst noch? Nacherzählen kann ein Risiko über seine Größe hinaus verstärken, und eine Messgröße, die zum Ziel wird, wird verbogen. Frag, wen es noch betrifft und was sich außer dem Ziel ändert." }),
  look_alike: P("look_alike",
    [{ id: "wadati_k", name: "Kiyoo Wadati" }, { id: "tuldava_j", name: "Juhan Tuldava" }, { id: "altmann_g", name: "Gabriel Altmann" }],
    { en: "Is it the same thing, or only similar? Compare like with like: quakes by depth, texts by length. Before you put two cases in one pile, check the one thing that could make them different kinds.",
      ru: "Это то же самое или только похоже? Сравнивай равное с равным: толчки по глубине, тексты по длине. Прежде чем сложить два случая в одну кучу, проверь то, что может сделать их разными по роду.",
      de: "Ist es dasselbe oder nur ähnlich? Vergleiche Gleiches mit Gleichem: Beben nach Tiefe, Texte nach Länge. Bevor du zwei Fälle in einen Topf wirfst, prüfe das, was sie zu verschiedenen Arten machen könnte." }),
};

// слова-триггеры по зонам (ru / en / de), нижний регистр
const TRIG = {
  rumour_vs_fact: /правд|слух|новост|источник|фейк|достоверн|пересказ|сообщил|заявил|проверить|анализир|информаци|true|rumou?r|news|source|fake|verify|fact[- ]?check|claim|analy[sz]e|information|stimmt|gerücht|nachricht|quelle|überprüf|analysier|information/iu,
  stale_data: /сейчас|актуальн|устарел|свеж|по состоянию|ещё так|current|still|up to date|outdated|latest|stale|aktuell|veraltet|noch immer|immer noch/iu,
  one_model: /выбр|сравни|какую|какой|какая|страну|систем|лучше|vs|choose|compare|which (?:country|system|option)|better|best|system|welche[sn]? (?:land|system)|wähl|vergleich|besser/iu,
  answer_cost: /хватит|достаточно|сколько ещё|ещё проверить|стоит ли ещё|enough|how much more|worth (?:checking|asking)|more research|genug|noch prüfen|lohnt/iu,
  measurement_error: /число|цифр|процент|статистик|опрос|среднее|\d+\s?%|number|percent|statistic|poll|survey|average|zahl|prozent|statistik|umfrage|durchschnitt/iu,
  own_limits: /не знаю|не уверен|сомнева|как реагир|что делать|как относиться|i don't know|not sure|unsure|doubt|how (?:should|do) i (?:react|respond)|what should i do|weiß nicht|unsicher|zweifel|wie (?:soll|reagier)|was soll ich/iu,
  side_effects: /что будет|последств|если я|побочн|повлияет|what (?:will|would) happen|consequence|side effect|impact|affect|was passiert|folgen|nebenwirk|auswirk/iu,
  look_alike: /то же самое|похож|одно и то же|такой же|same as|similar|the same|look[s]? like|dasselbe|ähnlich|gleich/iu,
};
const ORDER = ["rumour_vs_fact", "one_model", "own_limits", "stale_data", "answer_cost", "measurement_error", "side_effects", "look_alike"];
const DEFAULT_ZONES = ["own_limits", "one_model", "stale_data"];

// чувствительные темы: инструмент не рекомендует и не оценивает, а только даёт вопросы
const SENSITIVE = {
  money: /инвест|акци|крипт|биткоин|купить|продать|кредит|ипотек|invest|stock|crypto|bitcoin|buy|sell|loan|mortgage|aktie|kredit|kaufen|verkaufen/iu,
  health: /лечени|лекарств|диагноз|симптом|болезн|treatment|medicine|drug|diagnos|symptom|disease|behandlung|medikament|krankheit/iu,
  politics: /страну|политическ|партия|выбор[аыов]|правительств|страны|country|political|party|election|government|vote|land |politisch|partei|wahl|regierung/iu,
};
const NOTE = {
  base: { en: "These are questions to check your own conclusion, not an answer and not a recommendation. Word rules, no AI, no web search.",
    ru: "Это вопросы для проверки твоего собственного вывода, а не ответ и не рекомендация. Словесные правила, без ИИ и без поиска в сети.",
    de: "Das sind Fragen, um deinen eigenen Schluss zu prüfen, keine Antwort und keine Empfehlung. Wortregeln, keine KI, keine Websuche." },
  money: { en: "Money questions: this is not financial advice and not a trade signal.", ru: "Денежные вопросы: это не финансовый совет и не сигнал к сделке.", de: "Geldfragen: Das ist keine Finanzberatung und kein Handelssignal." },
  health: { en: "Health questions: this is not medical advice; for symptoms or treatment ask a doctor or pharmacist.", ru: "Вопросы здоровья: это не медицинский совет; про симптомы и лечение спрашивай врача или фармацевта.", de: "Gesundheitsfragen: Das ist kein medizinischer Rat; bei Symptomen oder Behandlung frag Arzt oder Apotheker." },
  politics: { en: "Countries, parties and political or economic systems: Orb Studio does not rate or recommend them; it only helps you test how you reached your own view.", ru: "Страны, партии, политические и экономические системы: Orb Studio их не оценивает и не рекомендует, а только помогает проверить, как ты пришёл к своему взгляду.", de: "Länder, Parteien, politische und wirtschaftliche Systeme: Orb Studio bewertet oder empfiehlt sie nicht, sondern hilft nur zu prüfen, wie du zu deiner Sicht gekommen bist." },
};
const POINTERS = {
  rumour_vs_fact: [{ tool: "check_claim", en: "paste the exact claim to see how it is built and how widely it is carried", ru: "вставь само утверждение: как оно устроено и как широко повторяется", de: "füge die Aussage ein: wie sie gebaut ist und wie weit sie verbreitet ist" },
    { tool: "check_news_url", en: "or give the article link", ru: "или дай ссылку на статью", de: "oder gib den Artikellink" }],
  measurement_error: [{ tool: "check_number", en: "check a single number for plausibility", ru: "проверь отдельное число на правдоподобие", de: "prüfe eine einzelne Zahl auf Plausibilität" }],
  stale_data: [{ tool: "get_freshness", en: "see how fresh the Orb Studio data are", ru: "посмотри, насколько свежи данные Orb Studio", de: "sieh, wie frisch die Orb-Studio-Daten sind" }],
};

export function detectLang(text) {
  const t = String(text || "");
  if (/[Ѐ-ӿ]/.test(t)) return "ru";
  if (/[äöüß]|(?<![\p{L}])(und|nicht|ich|wie|ist|der|die|das|welche[sn]?)(?![\p{L}])/iu.test(t)) return "de";
  return "en";
}

export function thinkItThrough(input, langOverride) {
  const text = String(input || "").replace(/[​-‏‪-‮⁠﻿]/g, " ").replace(/\s+/g, " ").trim().slice(0, THINK_MAX_CHARS);
  if (text.length < 8) return { error: "Give the question as text, at least 8 characters.", tool: "think_it_through" };
  const lang = ["ru", "en", "de"].includes(langOverride) ? langOverride : detectLang(text);
  const hits = ORDER.map((z) => ({ z, n: (text.match(new RegExp(TRIG[z].source, "giu")) || []).length })).filter((h) => h.n > 0).sort((a, b) => b.n - a.n || ORDER.indexOf(a.z) - ORDER.indexOf(b.z));
  const matched = hits.length > 0;
  const zones = (matched ? hits.map((h) => h.z) : DEFAULT_ZONES).slice(0, 3);
  const questions = zones.map((z) => ({ zone: z, question: THINK_ZONES[z].q[lang], scientists: THINK_ZONES[z].who.map((w) => w.name), cards: THINK_ZONES[z].who.filter((w) => w.id).map((w) => w.id) }));
  const notes = [NOTE.base[lang]];
  for (const k of Object.keys(SENSITIVE)) if (SENSITIVE[k].test(text)) notes.push(NOTE[k][lang]);
  const pointers = [];
  for (const z of zones) for (const p of POINTERS[z] || []) pointers.push({ tool: p.tool, hint: p[lang] });
  return { tool: "think_it_through", lang, matched_by_words: matched, questions, notes, pointers: pointers.slice(0, 3), see: "https://orbstudio.org/tools/crystals", rule: NOTE.base.en };
}
