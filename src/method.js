// «Как Orb Studio проверяет новости»: три слоя правил одним конвейером (что выходит из слоя, то входит в следующий).
// Слой 1 — кого берём в Библиотеку кристаллов, слой 2 — как карточка становится инструментом, слой 3 — как новость идёт в эфир (паспорт новости).
export const METHOD_LAYERS = [
  { layer: 1, name: "Selection: who enters the Crystal Library", question: "Does this scientist deserve a card?", output: "a card: idea, rule, blind spot",
    rules: ["The scientist died in 1900–2026; the death is confirmed by a Wikipedia article, and for 2025–2026 also by an obituary.",
      "Not already in the library and not a namesake: full name, years and field are checked.",
      "The rule for agents follows from the scientist's own work, not invented on top of it.",
      "The idea fits one of the eight agent blind spots.",
      "No military or medical topics, no forecasts or trading signals, no claims of being 'first' or 'unique'."] },
  { layer: 2, name: "Crystallisation: how a card becomes a tool", question: "What can be made from the card?", output: "sensors, news-passport lines, rules for the hosts",
    rules: ["Covered or new: if a sensor already has the essence, the card links to it and no second sensor is built.",
      "Bridges: the new card is compared with old cards and with known bridges, including bridges between bridges.",
      "Measurable: a bridge is ripe only when the data already exist; otherwise it waits with a date.",
      "Form: the cheapest form that does the job — a sensor, a line in the news passport or a rule for the hosts.",
      "Honesty: similar tools are named openly; the output is a number or a rule, never a forecast.",
      "A new sensor is built only after the owner agrees."] },
  { layer: 3, name: "On air: the order in which a news item is checked", question: "What can be said about this news, and how?", output: "the news passport the hosts and agents rely on",
    rules: ["Freshness (blind spot 1): how old the story is; old news is not called new.",
      "Fact or rumour (3): independent outlets after echo and typos; event, statement, promise, threat or forecast; amplified by retellings or not.",
      "Numbers (4): every figure has a source, a unit and a time.",
      "One model (2): is an index move real or only a change in the mix of radars?",
      "Consequences and look-alikes (6, 7): do not make the risk bigger; do not merge similar with same.",
      "Limits of knowledge (8): where the facts stop, say 'not known yet'.",
      "Cost (5): keep what matters, do not overload the air."] },
];
export const METHOD_ZONES = ["Old data taken for fresh", "One model taken for reality", "Rumour taken for fact", "Measurement error", "Cost of the answer", "Consequences of the answer unseen", "Similar taken for the same", "Limits of one's own competence"];
export const METHOD_CONFLICT = "Layers do not compete: each answers its own question and feeds the next. Inside a layer the rule that rules something out comes first. When two rules pull different ways on air, the more cautious one wins (an event carried by one outlet is said as 'one outlet reports').";
export function methodReport(passports = [], now = Date.now()) {
  return { method: "orb-studio-news-check", layers: METHOD_LAYERS, blind_spots: METHOD_ZONES, conflicts: METHOD_CONFLICT,
    live_passports: passports, how_to_read: "live_passports: the news passport of today's top radar headlines, exactly as the hosts of the Orb Studio studio receive it. Word rules, no AI in the passport.",
    generated_at: new Date(now).toISOString() };
}
