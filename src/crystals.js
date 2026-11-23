// СГЕНЕРИРОВАНО tools/crystals.py из tools/crystals_data.py — правьте данные там.
export const CRYSTAL_ZONES = ["stale_data", "one_model", "rumour_vs_fact", "measurement_error", "answer_cost", "side_effects", "look_alike", "own_limits"];
export const CRYSTAL_BUILT_ZONE = {"simpson": "one_model", "searle": "rumour_vs_fact", "duckworth": "stale_data", "trevisan": "answer_cost", "bertsekas": "answer_cost", "rabin": "measurement_error", "frankfurt": "rumour_vs_fact", "hamilton": "answer_cost", "mikrin": "stale_data", "polyak": "measurement_error", "park": "rumour_vs_fact", "kahneman": "measurement_error", "ziv": "stale_data", "cox": "stale_data", "halpern": "one_model", "howard": "answer_cost", "leamer": "one_model", "baird": "measurement_error", "lyberg": "measurement_error", "hagenauer": "measurement_error", "kasperson": "side_effects", "newcomb": "measurement_error"};
export const CRYSTALS = [
{
"id": "belnap",
"name": "Nuel Belnap",
"name_ru": "Нуэль Белнап",
"years": "1930–2024",
"wiki": "https://en.wikipedia.org/wiki/Nuel_Belnap",
"zone": "stale_data",
"idea": {
"en": "Temporal and branching-time logic: whether a statement is true depends on the moment it is made.",
"ru": "Временна́я логика: истинность утверждения зависит от момента, когда оно сделано.",
"de": "Zeitlogik: ob eine Aussage wahr ist, hängt vom Zeitpunkt ab."
},
"rule": "Attach a time to every claim you repeat; a true sentence from yesterday may be false today.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "astrom",
"name": "Karl Johan Åström",
"name_ru": "Карл Юхан Острём",
"years": "1934–2026",
"wiki": "https://en.wikipedia.org/wiki/Karl_Johan_Åström",
"zone": "stale_data",
"idea": {
"en": "Self-tuning (adaptive) control: the model is re-estimated with every new measurement.",
"ru": "Самонастраивающиеся регуляторы: модель пересчитывается по каждому новому измерению.",
"de": "Selbsteinstellende Regler: das Modell wird mit jeder neuen Messung neu geschätzt."
},
"rule": "Update your estimate with each new data point instead of keeping the first one.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "minker",
"name": "Jack Minker",
"name_ru": "Джек Минкер",
"years": "1927–2021",
"wiki": "https://en.wikipedia.org/wiki/Jack_Minker",
"zone": "stale_data",
"idea": {
"en": "Non-monotonic reasoning and deductive databases: a conclusion can be withdrawn when new facts arrive.",
"ru": "Немонотонные рассуждения: вывод можно отозвать, когда приходят новые факты.",
"de": "Nichtmonotones Schließen: ein Schluss kann zurückgenommen werden, wenn neue Fakten kommen."
},
"rule": "Mark conclusions as 'holds until new facts arrive' and be ready to retract them.",
"needs": {
"code": "needs_history",
"note": "record headlines with correction/update/denial words and link them to the original story",
"not_before": "2026-12-13"
}
},
{
"id": "groenendijk",
"name": "Jeroen Groenendijk",
"name_ru": "Йерун Грунендейк",
"years": "1949–2023",
"wiki": "https://en.wikipedia.org/wiki/Jeroen_Groenendijk",
"zone": "stale_data",
"idea": {
"en": "Dynamic semantics: the meaning of an utterance is the change it makes to the information state.",
"ru": "Динамическая семантика: смысл высказывания — это то, как оно меняет состояние информации.",
"de": "Dynamische Semantik: Bedeutung ist die Änderung des Informationsstands."
},
"rule": "Read each new message as an update to what you knew, not as an isolated fact.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "dagum",
"name": "Estelle Bee Dagum",
"name_ru": "Эстель Би Дагум",
"years": "1935–2026",
"wiki": "https://en.wikipedia.org/wiki/Estelle_Bee_Dagum",
"zone": "stale_data",
"idea": {
"en": "X-11-ARIMA: seasonal adjustment and real-time estimates of the trend of a time series.",
"ru": "Метод X-11-ARIMA: сезонная корректировка и оценка тренда временного ряда в реальном времени.",
"de": "X-11-ARIMA: Saisonbereinigung und Echtzeit-Trendschätzung von Zeitreihen."
},
"rule": "Before calling a rise news, check whether it is the usual seasonal or daily rhythm.",
"needs": {
"code": "needs_history",
"note": "3–4 weeks of 30-minute index history to remove the daily and weekly rhythm",
"not_before": "2026-12-20"
}
},
{
"id": "lorden",
"name": "Gary Lorden",
"name_ru": "Гэри Лорден",
"years": "1941–2023",
"wiki": "https://en.wikipedia.org/wiki/Gary_Lorden",
"zone": "stale_data",
"idea": {
"en": "Quickest change detection: noticing as early as possible that data started to follow a different law.",
"ru": "Быстрое обнаружение изменений: как можно раньше заметить, что данные начали подчиняться другим законам.",
"de": "Schnellste Änderungserkennung: früh bemerken, dass Daten einem anderen Gesetz folgen."
},
"rule": "Watch for a change of regime, not only for single outliers.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "sims",
"name": "Christopher A. Sims",
"name_ru": "Кристофер Симс",
"years": "1942–2026",
"wiki": "https://en.wikipedia.org/wiki/Christopher_A._Sims",
"zone": "stale_data",
"idea": {
"en": "Vector autoregressions: models of many economic series updated as fresh data come in (Nobel prize 2011).",
"ru": "Векторные авторегрессии: модели многих экономических рядов, которые обновляются по свежим данным (Нобелевская премия 2011).",
"de": "Vektorautoregressionen: Modelle vieler Wirtschaftsreihen, laufend mit frischen Daten aktualisiert (Nobelpreis 2011)."
},
"rule": "Look at several related series together; one series alone hides how shocks spread.",
"needs": {
"code": "blocked_rule",
"note": "'one series moves after another' is close to a forecast, which Orb Studio does not publish"
}
},
{
"id": "ljung",
"name": "Greta M. Ljung",
"name_ru": "Грета Льюнг",
"years": "1941–2024",
"wiki": "https://en.wikipedia.org/wiki/Greta_M._Ljung",
"zone": "stale_data",
"idea": {
"en": "The Ljung–Box test: are a model's leftover errors still patterned, i.e. has the model stopped describing the data?",
"ru": "Тест Льюнг–Бокса: остались ли в ошибках модели закономерности, то есть не перестала ли модель описывать данные.",
"de": "Ljung-Box-Test: zeigen die Restfehler eines Modells noch Muster?"
},
"rule": "If your errors repeat in a pattern, your model is out of date.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "tiao",
"name": "George C. Tiao",
"name_ru": "Джордж Тяо",
"years": "1933–2026",
"wiki": "https://en.wikipedia.org/wiki/George_C._Tiao",
"zone": "stale_data",
"idea": {
"en": "Time-series analysis and intervention analysis: measuring how an event changed a series.",
"ru": "Анализ временных рядов и анализ вмешательств: как событие изменило ряд.",
"de": "Zeitreihen- und Interventionsanalyse: wie ein Ereignis eine Reihe verändert hat."
},
"rule": "Separate the effect of a single event from the ongoing trend before you explain a change.",
"needs": {
"code": "needs_history",
"note": "a few weeks of index history to measure how single events changed a series",
"not_before": "2026-12-20"
}
},
{
"id": "cleveland",
"name": "William S. Cleveland",
"name_ru": "Уильям Кливленд",
"years": "1943–2026",
"wiki": "https://en.wikipedia.org/wiki/William_S._Cleveland",
"zone": "stale_data",
"idea": {
"en": "LOESS smoothing and the science of graphs: let the data show its local shape without a rigid formula.",
"ru": "Сглаживание LOESS и наука о графиках: пусть данные показывают свою форму без жёсткой формулы.",
"de": "LOESS-Glättung und Grafikforschung: Daten ihre lokale Form zeigen lassen."
},
"rule": "Look at the smoothed local trend before drawing a straight line through the data.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "welch",
"name": "Lloyd R. Welch",
"name_ru": "Ллойд Уэлч",
"years": "1927–2023",
"wiki": "https://en.wikipedia.org/wiki/Lloyd_R._Welch",
"zone": "stale_data",
"idea": {
"en": "The Baum–Welch algorithm: estimating the hidden state of a system from a stream of observations.",
"ru": "Алгоритм Баума–Уэлча: оценка скрытого состояния системы по потоку наблюдений.",
"de": "Baum-Welch-Algorithmus: verborgenen Zustand aus einer Beobachtungsfolge schätzen."
},
"rule": "What you see is a noisy trace of a hidden state; estimate the state, do not just repeat the trace.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "shumway",
"name": "Robert H. Shumway",
"name_ru": "Роберт Шамвей",
"years": "1936–2025",
"wiki": "https://en.wikipedia.org/wiki/Robert_H._Shumway",
"zone": "stale_data",
"idea": {
"en": "Time-series analysis, including state-space models and the handling of missing observations.",
"ru": "Анализ временных рядов, в том числе модели пространства состояний и пропуски наблюдений.",
"de": "Zeitreihenanalyse, Zustandsraummodelle und fehlende Beobachtungen."
},
"rule": "A gap in a series is information too: say what is missing instead of filling it silently.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "zdonik",
"name": "Stanley Zdonik",
"name_ru": "Стэнли Здоник",
"years": "1947–2026",
"wiki": "https://en.wikipedia.org/wiki/Stanley_Zdonik",
"zone": "stale_data",
"idea": {
"en": "Stream processing systems: data is a continuous flow to be processed as it arrives, not a frozen snapshot.",
"ru": "Потоковая обработка данных: данные — непрерывный поток, а не застывший снимок.",
"de": "Datenstromsysteme: Daten als laufender Strom, nicht als eingefrorener Schnappschuss."
},
"rule": "Ask how old your snapshot is; the stream has moved on since.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "belady",
"name": "László Bélády",
"name_ru": "Ласло Белади",
"years": "1928–2021",
"wiki": "https://en.wikipedia.org/wiki/László_Bélády",
"zone": "stale_data",
"idea": {
"en": "Cache replacement: the best item to evict is the one needed furthest in the future (Bélády's algorithm).",
"ru": "Замещение в кэше: выбрасывать стоит то, что понадобится позже всего (алгоритм Белади).",
"de": "Cache-Ersetzung: verdränge, was am spätesten wieder gebraucht wird."
},
"rule": "Keep in your context what you will need next, drop what you will not.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "roggen",
"name": "Ingar Roggen",
"name_ru": "Ингар Рогген",
"years": "1934–2023",
"wiki": "https://en.wikipedia.org/wiki/Ingar_Roggen",
"zone": "stale_data",
"idea": {
"en": "Logic of time in sociology: social facts are tied to moments and sequences.",
"ru": "Логика времени в социологии: социальные факты привязаны к моментам и последовательностям.",
"de": "Zeitlogik in der Soziologie: soziale Tatsachen sind an Zeitpunkte gebunden."
},
"rule": "Keep the order of events; a correct fact in the wrong order misleads.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "jury",
"name": "Eliahu I. Jury",
"name_ru": "Элиаху Джури",
"years": "1923–2020",
"wiki": "https://en.wikipedia.org/wiki/Eliahu_I._Jury",
"zone": "stale_data",
"idea": {
"en": "Digital signal processing and the Jury stability test for discrete-time systems.",
"ru": "Цифровая обработка сигналов и критерий устойчивости Джури для дискретных систем.",
"de": "Digitale Signalverarbeitung und das Jury-Stabilitätskriterium."
},
"rule": "Check whether a sequence of updates settles down or keeps amplifying itself.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "wonham",
"name": "W. M. Wonham",
"name_ru": "Уолтер Уонэм",
"years": "1934–2023",
"wiki": "https://en.wikipedia.org/wiki/W._M._Wonham",
"zone": "stale_data",
"idea": {
"en": "Stochastic filtering (the Wonham filter): updating the estimate of a state with each new noisy observation.",
"ru": "Стохастическая фильтрация (фильтр Уонэма): оценка состояния обновляется по каждому новому шумному наблюдению.",
"de": "Stochastische Filterung (Wonham-Filter): Zustandsschätzung mit jeder verrauschten Beobachtung."
},
"rule": "Weigh each new observation by how noisy it is, then update; do not replace the estimate wholesale.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "bonomi",
"name": "Andrea Bonomi",
"name_ru": "Андреа Бономи",
"years": "1940–2025",
"wiki": "https://en.wikipedia.org/wiki/Andrea_Bonomi_(philosopher)",
"zone": "stale_data",
"idea": {
"en": "Tense and aspect in language: how sentences are anchored to moments in time.",
"ru": "Время и вид в языке: как высказывания привязаны к моменту.",
"de": "Tempus und Aspekt: wie Sätze an Zeitpunkte gebunden sind."
},
"rule": "'Is', 'was' and 'will be' are different claims; keep the tense of the source.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "rissanen",
"name": "Jorma Rissanen",
"name_ru": "Йорма Риссанен",
"years": "1932–2020",
"wiki": "https://en.wikipedia.org/wiki/Jorma_Rissanen",
"zone": "one_model",
"idea": {
"en": "Minimum description length: the best model is the one that describes the data most briefly.",
"ru": "Принцип минимальной длины описания: лучшая модель описывает данные короче всех.",
"de": "Minimale Beschreibungslänge: das beste Modell beschreibt die Daten am kürzesten."
},
"rule": "Prefer the explanation that needs fewest extra assumptions to cover the facts.",
"needs": {
"code": "covered",
"note": "the Ziv sensor already measures novelty by compression",
"covered_by": "ziv"
}
},
{
"id": "schmeidler",
"name": "David Schmeidler",
"name_ru": "Давид Шмейдлер",
"years": "1939–2022",
"wiki": "https://en.wikipedia.org/wiki/David_Schmeidler",
"zone": "own_limits",
"idea": {
"en": "Decisions under ambiguity: there may be no single 'true' probability model.",
"ru": "Решения в неопределённости: одной «настоящей» вероятностной модели может не быть.",
"de": "Entscheidungen bei Ambiguität: es gibt nicht immer ein einziges wahres Wahrscheinlichkeitsmodell."
},
"rule": "When probabilities are unknown, say so and give a range instead of one number.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "mallows",
"name": "Colin Lingwood Mallows",
"name_ru": "Колин Мэллоус",
"years": "1930–2023",
"wiki": "https://en.wikipedia.org/wiki/Colin_Lingwood_Mallows",
"zone": "one_model",
"idea": {
"en": "Mallows's Cp: comparing regression models while penalising needless complexity.",
"ru": "Критерий Cp: сравнение регрессионных моделей со штрафом за лишнюю сложность.",
"de": "Mallows' Cp: Regressionsmodelle vergleichen, unnötige Komplexität bestrafen."
},
"rule": "A model that fits everything perfectly may only be memorising noise.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "eicker",
"name": "Friedhelm Eicker",
"name_ru": "Фридхельм Айкер",
"years": "1927–2022",
"wiki": "https://en.wikipedia.org/wiki/Friedhelm_Eicker",
"zone": "one_model",
"idea": {
"en": "Robust (Eicker–Huber–White) standard errors: valid even when the assumed spread of the data is wrong.",
"ru": "Робастные стандартные ошибки: верны, даже если модель разброса данных ошибочна.",
"de": "Robuste Standardfehler: gültig, auch wenn die angenommene Streuung falsch ist."
},
"rule": "State uncertainty in a way that survives a wrong assumption about the noise.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "titterington",
"name": "Mike Titterington",
"name_ru": "Майк Титтерингтон",
"years": "1945–2023",
"wiki": "https://en.wikipedia.org/wiki/Mike_Titterington",
"zone": "one_model",
"idea": {
"en": "Finite mixture models: the same observations can come from several hidden groups.",
"ru": "Модели смесей: одни и те же наблюдения могут происходить из нескольких скрытых групп.",
"de": "Mischungsmodelle: dieselben Beobachtungen können aus mehreren verborgenen Gruppen stammen."
},
"rule": "An average can hide two different groups; check whether the data is mixed.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "morrison",
"name": "Margaret Morrison",
"name_ru": "Маргарет Моррисон",
"years": "1954–2021",
"wiki": "https://en.wikipedia.org/wiki/Margaret_Morrison_(philosopher)",
"zone": "one_model",
"idea": {
"en": "Models as mediators: a model stands between theory and the world; it is not the world itself.",
"ru": "Модели как посредники: модель стоит между теорией и миром, а не является самим миром.",
"de": "Modelle als Vermittler: ein Modell steht zwischen Theorie und Welt."
},
"rule": "Say 'according to the model' when you report a model's output.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "leonard",
"name": "Thomas H. Leonard",
"name_ru": "Томас Леонард",
"years": "1948–2023",
"wiki": "https://en.wikipedia.org/wiki/Thomas_H._Leonard",
"zone": "one_model",
"idea": {
"en": "Bayesian methods and the role of prior assumptions in the conclusion.",
"ru": "Байесовские методы и роль исходных предположений в выводе.",
"de": "Bayes-Methoden und die Rolle der Vorannahmen."
},
"rule": "Name your starting assumptions; another start can lead to another conclusion.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "friedman",
"name": "Michael Friedman",
"name_ru": "Майкл Фридман",
"years": "1947–2025",
"wiki": "https://en.wikipedia.org/wiki/Michael_Friedman_(philosopher)",
"zone": "one_model",
"idea": {
"en": "Dynamics of reason: the basic principles of science themselves change over time.",
"ru": "Динамика разума: базовые принципы науки сами меняются со временем.",
"de": "Dynamik der Vernunft: die Grundprinzipien der Wissenschaft wandeln sich."
},
"rule": "Today's framework is not eternal; say which framework your answer assumes.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "shapiro",
"name": "Samuel Sanford Shapiro",
"name_ru": "Сэмюэл Шапиро",
"years": "1930–2023",
"wiki": "https://en.wikipedia.org/wiki/Samuel_Sanford_Shapiro",
"zone": "one_model",
"idea": {
"en": "The Shapiro–Wilk test: can the data be treated as normally distributed at all?",
"ru": "Тест Шапиро–Уилка: можно ли вообще считать данные нормально распределёнными.",
"de": "Shapiro-Wilk-Test: dürfen die Daten als normalverteilt gelten?"
},
"rule": "Check the shape of the data before using averages and standard deviations.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "deely",
"name": "John J. Deely",
"name_ru": "Джон Дили",
"years": "1933–2025",
"wiki": "https://en.wikipedia.org/wiki/John_J._Deely",
"zone": "one_model",
"idea": {
"en": "Empirical Bayes: estimates are built from many similar cases, not from one rigid assumption.",
"ru": "Эмпирический байесовский подход: оценку строят по набору похожих случаев.",
"de": "Empirischer Bayes: Schätzungen aus vielen ähnlichen Fällen."
},
"rule": "Compare with similar past cases before judging one case.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "glejser",
"name": "Herbert Glejser",
"name_ru": "Герберт Глейзер",
"years": "1938–2024",
"wiki": "https://en.wikipedia.org/wiki/Herbert_Glejser",
"zone": "one_model",
"idea": {
"en": "The Glejser test: does the model describe the spread of the data correctly?",
"ru": "Тест Глейзера: правильно ли модель описывает разброс данных.",
"de": "Glejser-Test: beschreibt das Modell die Streuung richtig?"
},
"rule": "Check whether your uncertainty grows with the size of the numbers.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "hollander",
"name": "Myles Hollander",
"name_ru": "Майлз Холландер",
"years": "1941–2025",
"wiki": "https://en.wikipedia.org/wiki/Myles_Hollander",
"zone": "one_model",
"idea": {
"en": "Nonparametric statistics: conclusions without assuming a rigid model of the data.",
"ru": "Непараметрическая статистика: выводы без жёсткой модели данных.",
"de": "Nichtparametrische Statistik: Schlüsse ohne starres Modell."
},
"rule": "Use ranks and counts when you do not know the true shape of the data.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "massam",
"name": "Hélène Massam",
"name_ru": "Элен Массам",
"years": "–2020",
"wiki": "https://en.wikipedia.org/wiki/Hélène_Massam",
"zone": "one_model",
"idea": {
"en": "Graphical models: the structure of dependencies between variables can itself be uncertain.",
"ru": "Графические модели: сама структура связей между переменными может быть неопределённой.",
"de": "Graphische Modelle: auch die Abhängigkeitsstruktur kann unsicher sein."
},
"rule": "Do not assume you know which factors are connected; that is part of the question.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "dudley",
"name": "Richard M. Dudley",
"name_ru": "Ричард Дадли",
"years": "1938–2020",
"wiki": "https://en.wikipedia.org/wiki/Richard_M._Dudley",
"zone": "one_model",
"idea": {
"en": "Empirical processes: how far a sample can differ from the true distribution.",
"ru": "Эмпирические процессы: насколько выборка может отличаться от настоящего распределения.",
"de": "Empirische Prozesse: wie weit eine Stichprobe von der wahren Verteilung abweicht."
},
"rule": "A sample is not the population; say how large the sample was.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "kashyap",
"name": "Rangasami L. Kashyap",
"name_ru": "Рангасами Кашьяп",
"years": "1938–2022",
"wiki": "https://en.wikipedia.org/wiki/Rangasami_L._Kashyap",
"zone": "one_model",
"idea": {
"en": "Kashyap's criterion (KIC): choosing the best model among several candidates.",
"ru": "Критерий Кашьяпа (KIC): выбор лучшей модели из нескольких кандидатов.",
"de": "Kashyap-Kriterium: Auswahl des besten Modells unter mehreren."
},
"rule": "Compare at least two candidate explanations before you settle on one.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "athans",
"name": "Michael Athans",
"name_ru": "Майкл Атанс",
"years": "1937–2020",
"wiki": "https://en.wikipedia.org/wiki/Michael_Athans",
"zone": "one_model",
"idea": {
"en": "Robust control: a controller that still works when the model of the system is inaccurate.",
"ru": "Робастное управление: регулятор работает, даже когда модель объекта неточна.",
"de": "Robuste Regelung: funktioniert auch bei ungenauem Modell."
},
"rule": "Prefer advice that still holds if your picture of the situation is somewhat wrong.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "guesnerie",
"name": "Roger Guesnerie",
"name_ru": "Роже Геснери",
"years": "1943–2026",
"wiki": "https://en.wikipedia.org/wiki/Roger_Guesnerie",
"zone": "one_model",
"idea": {
"en": "Expectations and equilibria: with the same data, market expectations can settle on different equilibria.",
"ru": "Ожидания и равновесия: при одних и тех же данных ожидания рынка могут прийти к разным равновесиям.",
"de": "Erwartungen und Gleichgewichte: gleiche Daten, verschiedene Gleichgewichte."
},
"rule": "The same facts can support several outcomes; do not present one as inevitable.",
"needs": {
"code": "blocked_rule",
"note": "multiple equilibria of expectations would need forecasts"
}
},
{
"id": "goldman",
"name": "Alvin Goldman",
"name_ru": "Элвин Голдман",
"years": "1938–2024",
"wiki": "https://en.wikipedia.org/wiki/Alvin_Goldman",
"zone": "rumour_vs_fact",
"idea": {
"en": "Social epistemology: how knowledge passes through testimony and the media, and when that chain is reliable.",
"ru": "Социальная эпистемология: как знание передаётся через свидетельства и СМИ и когда эта цепочка надёжна.",
"de": "Soziale Erkenntnistheorie: Wissen durch Zeugnis und Medien."
},
"rule": "Ask how many independent witnesses stand behind a claim, not how many repeat it.",
"needs": {
"code": "covered",
"note": "check_headline already counts independent voices and agency echo",
"covered_by": "kahneman"
}
},
{
"id": "gettier",
"name": "Edmund Gettier",
"name_ru": "Эдмунд Геттиер",
"years": "1927–2021",
"wiki": "https://en.wikipedia.org/wiki/Edmund_Gettier",
"zone": "rumour_vs_fact",
"idea": {
"en": "Gettier cases: a justified true belief is not necessarily knowledge.",
"ru": "Случаи Геттиера: обоснованное и верное мнение ещё не обязательно знание.",
"de": "Gettier-Fälle: gerechtfertigte wahre Meinung ist nicht unbedingt Wissen."
},
"rule": "Check the path to a conclusion, not only the conclusion; a right answer for the wrong reason is fragile.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "woods",
"name": "John Woods",
"name_ru": "Джон Вудс",
"years": "1937–2024",
"wiki": "https://en.wikipedia.org/wiki/John_Woods_(logician)",
"zone": "rumour_vs_fact",
"idea": {
"en": "The logic of fallacies: common errors in the reasoning of real agents.",
"ru": "Логика ошибок: типичные ошибки в рассуждениях реальных агентов.",
"de": "Logik der Fehlschlüsse bei realen Akteuren."
},
"rule": "Before trusting an argument, name the step where it could go wrong.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "rescher",
"name": "Nicholas Rescher",
"name_ru": "Николас Решер",
"years": "1928–2024",
"wiki": "https://en.wikipedia.org/wiki/Nicholas_Rescher",
"zone": "rumour_vs_fact",
"idea": {
"en": "Coherence theory: a claim earns trust when it fits the rest of what is known.",
"ru": "Теория когерентности: утверждению можно доверять, если оно согласуется с остальными известными фактами.",
"de": "Kohärenztheorie: Vertrauen, wenn eine Aussage zum übrigen Wissen passt."
},
"rule": "Check a surprising claim against what other independent sources say.",
"needs": {
"code": "covered",
"note": "check_headline already counts independent voices and agency echo",
"covered_by": "kahneman"
}
},
{
"id": "harding",
"name": "Sandra Harding",
"name_ru": "Сандра Хардинг",
"years": "1935–2025",
"wiki": "https://en.wikipedia.org/wiki/Sandra_Harding",
"zone": "rumour_vs_fact",
"idea": {
"en": "Standpoint epistemology: who the source is shapes what it can see.",
"ru": "Эпистемология позиции: кто источник, влияет на то, что он может увидеть.",
"de": "Standpunkttheorie: die Position der Quelle prägt, was sie sieht."
},
"rule": "Note whose viewpoint a source represents and whose is missing.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already reports coverage gaps and silent feeds",
"covered_by": "lyberg"
}
},
{
"id": "bunge",
"name": "Mario Bunge",
"name_ru": "Марио Бунге",
"years": "1919–2020",
"wiki": "https://en.wikipedia.org/wiki/Mario_Bunge",
"zone": "rumour_vs_fact",
"idea": {
"en": "Scientific realism and the critique of pseudoscience.",
"ru": "Научный реализм и критика псевдонауки.",
"de": "Wissenschaftlicher Realismus und Kritik der Pseudowissenschaft."
},
"rule": "Ask whether a claim could be tested and whether it fits established science.",
"needs": {
"code": "covered",
"note": "the Park sensor already flags warning signs of bogus science",
"covered_by": "park"
}
},
{
"id": "laudan",
"name": "Larry Laudan",
"name_ru": "Ларри Лаудан",
"years": "1941–2022",
"wiki": "https://en.wikipedia.org/wiki/Larry_Laudan",
"zone": "rumour_vs_fact",
"idea": {
"en": "Against a simple line between 'science' and 'non-science': judge claims by their evidence, one by one.",
"ru": "Против простого деления на «науку» и «не науку»: оценивать утверждения по их доказательствам.",
"de": "Gegen eine einfache Grenze zwischen Wissenschaft und Nichtwissenschaft."
},
"rule": "Judge each claim on its evidence, not on the label of its source.",
"needs": {
"code": "covered",
"note": "the Park sensor already flags warning signs of bogus science",
"covered_by": "park"
}
},
{
"id": "agassi",
"name": "Joseph Agassi",
"name_ru": "Йосеф Агасси",
"years": "1927–2023",
"wiki": "https://en.wikipedia.org/wiki/Joseph_Agassi",
"zone": "rumour_vs_fact",
"idea": {
"en": "Critical rationalism (a student of Popper): science grows by criticising and testing ideas.",
"ru": "Критический рационализм (ученик Поппера): наука растёт через критику и проверку идей.",
"de": "Kritischer Rationalismus (Popper-Schüler): Wissen wächst durch Kritik."
},
"rule": "Look for what would prove a claim wrong, not only for what supports it.",
"needs": {
"code": "covered",
"note": "the Park sensor already flags warning signs of bogus science",
"covered_by": "park"
}
},
{
"id": "corcoran",
"name": "John Corcoran",
"name_ru": "Джон Коркоран",
"years": "1937–2021",
"wiki": "https://en.wikipedia.org/wiki/John_Corcoran_(logician)",
"zone": "rumour_vs_fact",
"idea": {
"en": "The difference between an argument and a proof.",
"ru": "Чем аргумент отличается от доказательства.",
"de": "Unterschied zwischen Argument und Beweis."
},
"rule": "Do not call a persuasive argument a proof.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "bealer",
"name": "George Bealer",
"name_ru": "Джордж Билер",
"years": "1944–2025",
"wiki": "https://en.wikipedia.org/wiki/George_Bealer",
"zone": "rumour_vs_fact",
"idea": {
"en": "Intuitions as evidence: how far an intuition can be trusted.",
"ru": "Интуиция как свидетельство: насколько ей можно доверять.",
"de": "Intuitionen als Evidenz: wie weit man ihnen trauen kann."
},
"rule": "Treat 'it seems obvious' as a starting point to check, not as evidence.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "frazier",
"name": "Kendrick Frazier",
"name_ru": "Кендрик Фрейзер",
"years": "1942–2022",
"wiki": "https://en.wikipedia.org/wiki/Kendrick_Frazier",
"zone": "rumour_vs_fact",
"idea": {
"en": "Editor of Skeptical Inquirer: public examination of paranormal and pseudoscientific claims.",
"ru": "Редактор журнала Skeptical Inquirer: публичный разбор паранормальных и псевдонаучных заявлений.",
"de": "Herausgeber des Skeptical Inquirer: Prüfung pseudowissenschaftlicher Behauptungen."
},
"rule": "Extraordinary claims need extraordinary evidence; ask for it.",
"needs": {
"code": "covered",
"note": "the Park sensor already flags warning signs of bogus science",
"covered_by": "park"
}
},
{
"id": "kripke",
"name": "Saul Kripke",
"name_ru": "Сол Крипке",
"years": "1940–2022",
"wiki": "https://en.wikipedia.org/wiki/Saul_Kripke",
"zone": "rumour_vs_fact",
"idea": {
"en": "Names refer to the thing itself, not to a description that happens to fit it.",
"ru": "Имя указывает на сам объект, а не на случайное описание этого объекта.",
"de": "Namen bezeichnen das Ding selbst, nicht eine zufällige Beschreibung."
},
"rule": "Treat 'Kyiv', 'Kiev' and 'Kiew' as one place, and check which person a title like 'the president' means today.",
"needs": {
"code": "blocked_analog",
"note": "Wikidata already links names to entities; needs a new angle, e.g. one story naming a place differently across feeds"
}
},
{
"id": "latour",
"name": "Bruno Latour",
"name_ru": "Бруно Латур",
"years": "1947–2022",
"wiki": "https://en.wikipedia.org/wiki/Bruno_Latour",
"zone": "rumour_vs_fact",
"idea": {
"en": "How a scientific fact is built in labs, papers and citations — and how trust in science can be restored.",
"ru": "Как в лаборатории рождается научный факт и как вернуть доверие к науке.",
"de": "Wie eine wissenschaftliche Tatsache entsteht und wie Vertrauen zurückkehrt."
},
"rule": "Before calling something a fact, find the chain of sources that made it one.",
"needs": {
"code": "needs_source",
"note": "an open source of citation chains behind news claims"
}
},
{
"id": "krausz",
"name": "Michael Krausz",
"name_ru": "Майкл Краус",
"years": "1942–2025",
"wiki": "https://en.wikipedia.org/wiki/Michael_Krausz",
"zone": "rumour_vs_fact",
"idea": {
"en": "Interpretation: one thing can admit several reasonable readings.",
"ru": "Толкование: у одного и того же может быть несколько разумных толкований.",
"de": "Interpretation: mehrere vernünftige Lesarten sind möglich."
},
"rule": "When a text is ambiguous, give the main readings instead of picking one silently.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "passeron",
"name": "Jean-Claude Passeron",
"name_ru": "Жан-Клод Пассерон",
"years": "1930–2026",
"wiki": "https://en.wikipedia.org/wiki/Jean-Claude_Passeron",
"zone": "rumour_vs_fact",
"idea": {
"en": "How the social sciences prove their claims, which always depend on context.",
"ru": "Как социальные науки доказывают утверждения, которые всегда зависят от контекста.",
"de": "Wie Sozialwissenschaften ihre Aussagen belegen."
},
"rule": "Name the context (place, time, group) in which a social claim was shown.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "tuomela",
"name": "Raimo Tuomela",
"name_ru": "Раймо Туомела",
"years": "1940–2020",
"wiki": "https://en.wikipedia.org/wiki/Raimo_Tuomela",
"zone": "rumour_vs_fact",
"idea": {
"en": "Philosophy of science and social action: from hypothesis and data to a justified conclusion.",
"ru": "Философия науки и социального действия: как из гипотезы и данных получается обоснованный вывод.",
"de": "Vom Hypothese und Daten zum begründeten Schluss."
},
"rule": "Keep hypothesis, data and conclusion apart when you explain.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "decruz",
"name": "Helen De Cruz",
"name_ru": "Хелен Де Круз",
"years": "1978–2025",
"wiki": "https://en.wikipedia.org/wiki/Helen_De_Cruz",
"zone": "rumour_vs_fact",
"idea": {
"en": "Experimental philosophy and the cognitive science of belief.",
"ru": "Экспериментальная философия и когнитивная наука о верованиях.",
"de": "Experimentelle Philosophie und Kognitionswissenschaft des Glaubens."
},
"rule": "People's beliefs follow recognisable mental habits; check yours too.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "higham",
"name": "Nicholas Higham",
"name_ru": "Николас Хайэм",
"years": "1961–2024",
"wiki": "https://en.wikipedia.org/wiki/Nicholas_Higham",
"zone": "measurement_error",
"idea": {
"en": "Accuracy and stability of numerical algorithms: rounding errors can grow through a calculation.",
"ru": "Точность численных алгоритмов: ошибки округления могут нарастать по ходу расчёта.",
"de": "Genauigkeit numerischer Algorithmen: Rundungsfehler können wachsen."
},
"rule": "Do not report more digits than the inputs justify.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and cross-checks numbers",
"covered_by": "baird"
}
},
{
"id": "hambleton",
"name": "Ronald K. Hambleton",
"name_ru": "Рональд Хамблтон",
"years": "1943–2022",
"wiki": "https://en.wikipedia.org/wiki/Ronald_K._Hambleton",
"zone": "measurement_error",
"idea": {
"en": "Item response theory: how reliable a score from a test is.",
"ru": "Теория ответа на задания: насколько надёжна оценка по тесту.",
"de": "Item-Response-Theorie: wie verlässlich ein Testwert ist."
},
"rule": "A score comes with a margin of error; quote it.",
"needs": {
"code": "covered",
"note": "the Kahneman sensor already audits the noise of AI judgements",
"covered_by": "kahneman"
}
},
{
"id": "babuska",
"name": "Ivo Babuška",
"name_ru": "Иво Бабушка",
"years": "1926–2023",
"wiki": "https://en.wikipedia.org/wiki/Ivo_Babuška",
"zone": "measurement_error",
"idea": {
"en": "Adaptive numerical methods and a posteriori error estimates for finite elements.",
"ru": "Адаптивные численные методы и апостериорные оценки погрешности метода конечных элементов.",
"de": "Adaptive numerische Verfahren und a-posteriori-Fehlerschätzung."
},
"rule": "After computing an answer, estimate how wrong it could be.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "mislevy",
"name": "Robert J. Mislevy",
"name_ru": "Роберт Мислеви",
"years": "1950–2025",
"wiki": "https://en.wikipedia.org/wiki/Robert_J._Mislevy",
"zone": "measurement_error",
"idea": {
"en": "Evidence-centred design: an assessment is an argument from evidence, with its uncertainty.",
"ru": "Доказательный подход к оценке: оценка — это вывод из свидетельств с учётом неопределённости.",
"de": "Evidenzbasiertes Design: Bewertung als Argument aus Evidenz."
},
"rule": "Say what evidence a judgement rests on and how strong it is.",
"needs": {
"code": "covered",
"note": "the Kahneman sensor already audits the noise of AI judgements",
"covered_by": "kahneman"
}
},
{
"id": "mellenbergh",
"name": "Gideon J. Mellenbergh",
"name_ru": "Гидеон Мелленберг",
"years": "1938–2021",
"wiki": "https://en.wikipedia.org/wiki/Gideon_J._Mellenbergh",
"zone": "measurement_error",
"idea": {
"en": "Psychometrics, including finding test items that measure differently for different groups (item bias).",
"ru": "Психометрия, в том числе поиск заданий, которые меряют разные группы по-разному.",
"de": "Psychometrie, auch verzerrte Testaufgaben."
},
"rule": "Check whether your measure treats all groups the same.",
"needs": {
"code": "covered",
"note": "the Kahneman sensor already audits the noise of AI judgements",
"covered_by": "kahneman"
}
},
{
"id": "winkler",
"name": "William E. Winkler",
"name_ru": "Уильям Уинклер",
"years": "1946–2022",
"wiki": "https://en.wikipedia.org/wiki/William_E._Winkler",
"zone": "look_alike",
"idea": {
"en": "Record linkage: errors when matching records from different databases (Jaro–Winkler similarity).",
"ru": "Сопоставление записей: ошибки при сопоставлении данных из разных баз (сходство Джаро–Уинклера).",
"de": "Datensatzverknüpfung: Fehler beim Abgleich von Datenbanken."
},
"rule": "Two records with similar names may be different people; say how sure the match is.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "li_tianchu",
"name": "Li Tianchu",
"name_ru": "Ли Тяньчу",
"years": "1945–2022",
"wiki": "https://en.wikipedia.org/wiki/Li_Tianchu",
"zone": "measurement_error",
"idea": {
"en": "Metrology in China: measurement standards.",
"ru": "Метрология в Китае: эталоны измерений.",
"de": "Metrologie in China: Messnormale."
},
"rule": "Every number needs a standard it can be traced to.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and cross-checks numbers",
"covered_by": "baird"
}
},
{
"id": "woodcock",
"name": "Richard Woodcock",
"name_ru": "Ричард Вудкок",
"years": "1928–2024",
"wiki": "https://en.wikipedia.org/wiki/Richard_Woodcock",
"zone": "measurement_error",
"idea": {
"en": "Psychometrics, the Rasch model and the Woodcock–Johnson tests.",
"ru": "Психометрия, модель Раша и тесты Вудкока–Джонсона.",
"de": "Psychometrie, Rasch-Modell und Woodcock-Johnson-Tests."
},
"rule": "A scale is only meaningful if its steps are equal; check what one point means.",
"needs": {
"code": "covered",
"note": "the Kahneman sensor already audits the noise of AI judgements",
"covered_by": "kahneman"
}
},
{
"id": "byrne",
"name": "Barbara M. Byrne",
"name_ru": "Барбара Бирн",
"years": "1935–2020",
"wiki": "https://en.wikipedia.org/wiki/Barbara_M._Byrne",
"zone": "measurement_error",
"idea": {
"en": "Validity: does an instrument measure what it promises to measure?",
"ru": "Валидность: измеряет ли инструмент то, что обещает.",
"de": "Validität: misst ein Instrument, was es verspricht?"
},
"rule": "Ask whether an index really measures what its name says.",
"needs": {
"code": "covered",
"note": "the Kahneman sensor already audits the noise of AI judgements",
"covered_by": "kahneman"
}
},
{
"id": "bailar",
"name": "Barbara Bailar",
"name_ru": "Барбара Бейлар",
"years": "1935–2023",
"wiki": "https://en.wikipedia.org/wiki/Barbara_Bailar",
"zone": "measurement_error",
"idea": {
"en": "Census undercount: who is missed by a count, as in the 1990 US census.",
"ru": "Недоучёт при переписи: кого пропускает подсчёт, как в переписи США 1990 года.",
"de": "Untererfassung bei der Volkszählung: wer fehlt."
},
"rule": "Ask who is not in the data before you generalise.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already reports coverage gaps and silent feeds",
"covered_by": "lyberg"
}
},
{
"id": "bhat",
"name": "U. Narayan Bhat",
"name_ru": "Нараян Бхат",
"years": "1934–2021",
"wiki": "https://en.wikipedia.org/wiki/U._Narayan_Bhat",
"zone": "measurement_error",
"idea": {
"en": "Queueing and reliability theory.",
"ru": "Теория очередей и надёжности.",
"de": "Warteschlangen- und Zuverlässigkeitstheorie."
},
"rule": "Delays add up in a chain; estimate the wait, not only the speed of one step.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "zupko",
"name": "Ronald Edward Zupko",
"name_ru": "Рональд Зупко",
"years": "1938–2021",
"wiki": "https://en.wikipedia.org/wiki/Ronald_Edward_Zupko",
"zone": "measurement_error",
"idea": {
"en": "History of weights and measures: units change between places and centuries.",
"ru": "История мер и весов: единицы меняются от места к месту и от века к веку.",
"de": "Geschichte der Maße und Gewichte."
},
"rule": "Check the unit; the same word can mean different quantities.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and cross-checks numbers",
"covered_by": "baird"
}
},
{
"id": "pless",
"name": "Vera Pless",
"name_ru": "Вера Плесс",
"years": "1931–2020",
"wiki": "https://en.wikipedia.org/wiki/Vera_Pless",
"zone": "measurement_error",
"idea": {
"en": "Error-correcting codes: redundancy lets a receiver detect and fix errors in transmission.",
"ru": "Коды, исправляющие ошибки: избыточность позволяет найти и исправить ошибки передачи.",
"de": "Fehlerkorrigierende Codes: Redundanz erkennt und behebt Fehler."
},
"rule": "Confirm an important fact by a second, independent route.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and cross-checks numbers",
"covered_by": "baird"
}
},
{
"id": "skinner",
"name": "Chris Skinner",
"name_ru": "Крис Скиннер",
"years": "1953–2020",
"wiki": "https://en.wikipedia.org/wiki/Chris_Skinner_(statistician)",
"zone": "measurement_error",
"idea": {
"en": "Survey methods: handling missing answers, measurement error and complex samples.",
"ru": "Методы опросов: пропуски, ошибки измерения и сложные выборки.",
"de": "Umfragemethoden: fehlende Antworten und Messfehler."
},
"rule": "Say how much is missing and how it could bias the result.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already reports coverage gaps and silent feeds",
"covered_by": "lyberg"
}
},
{
"id": "pollak",
"name": "Henry O. Pollak",
"name_ru": "Генри Поллак",
"years": "1927–2026",
"wiki": "https://en.wikipedia.org/wiki/Henry_O._Pollak",
"zone": "measurement_error",
"idea": {
"en": "Limits of a signal in time and frequency at once (prolate spheroidal wave functions, with Slepian and Landau).",
"ru": "Пределы точности сигнала одновременно во времени и по частоте (с Слепяном и Ландау).",
"de": "Grenzen eines Signals in Zeit und Frequenz zugleich."
},
"rule": "Some quantities cannot be sharp in two respects at once; say which one you chose.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "radner",
"name": "Roy Radner",
"name_ru": "Рой Раднер",
"years": "1927–2022",
"wiki": "https://en.wikipedia.org/wiki/Roy_Radner",
"zone": "answer_cost",
"idea": {
"en": "Bounded rationality and the economics of information: gathering information has a cost.",
"ru": "Ограниченная рациональность и экономика информации: сбор сведений стоит денег и времени.",
"de": "Begrenzte Rationalität: Information hat ihren Preis."
},
"rule": "Stop gathering when more data would not change the answer.",
"needs": {
"code": "covered",
"note": "the Howard sensor already says when waiting for more information pays off",
"covered_by": "howard"
}
},
{
"id": "whittle",
"name": "Peter Whittle",
"name_ru": "Питер Уиттл",
"years": "1927–2021",
"wiki": "https://en.wikipedia.org/wiki/Peter_Whittle_(mathematician)",
"zone": "answer_cost",
"idea": {
"en": "The Whittle index: how to share effort between options in a changing world (restless bandits).",
"ru": "Индекс Уиттла: как распределять усилия между вариантами в меняющемся мире.",
"de": "Whittle-Index: Aufwand zwischen Optionen in einer sich ändernden Welt verteilen."
},
"rule": "Spend checks on the sources that change most and matter most.",
"needs": {
"code": "covered",
"note": "the Howard sensor already says when waiting for more information pays off",
"covered_by": "howard"
}
},
{
"id": "berger",
"name": "Toby Berger",
"name_ru": "Тоби Бергер",
"years": "1940–2022",
"wiki": "https://en.wikipedia.org/wiki/Toby_Berger",
"zone": "answer_cost",
"idea": {
"en": "Rate-distortion theory: how many bits are needed to convey an answer with a given accuracy.",
"ru": "Теория скорости и искажения: сколько бит нужно, чтобы передать ответ с заданной точностью.",
"de": "Raten-Verzerrungs-Theorie: Bits für eine gegebene Genauigkeit."
},
"rule": "Match the length of the answer to the accuracy the person needs.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "woodroofe",
"name": "Michael Woodroofe",
"name_ru": "Майкл Вудруф",
"years": "1940–2022",
"wiki": "https://en.wikipedia.org/wiki/Michael_Woodroofe",
"zone": "answer_cost",
"idea": {
"en": "Sequential analysis: when there are enough observations to stop.",
"ru": "Последовательный анализ: когда наблюдений уже достаточно и можно остановиться.",
"de": "Sequentialanalyse: wann genug Beobachtungen vorliegen."
},
"rule": "Decide in advance how much evidence is enough.",
"needs": {
"code": "covered",
"note": "the Howard sensor already says when waiting for more information pays off",
"covered_by": "howard"
}
},
{
"id": "neil_jones",
"name": "Neil D. Jones",
"name_ru": "Нил Джонс",
"years": "1941–2023",
"wiki": "https://en.wikipedia.org/wiki/Neil_D._Jones",
"zone": "answer_cost",
"idea": {
"en": "Computational complexity and partial evaluation: specialising a program to the input it gets.",
"ru": "Вычислительная сложность и частичные вычисления: программа подстраивается под свои входные данные.",
"de": "Komplexität und partielle Auswertung."
},
"rule": "Reuse what you already computed instead of starting from scratch.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "wynn",
"name": "Henry Wynn",
"name_ru": "Генри Уинн",
"years": "1945–2024",
"wiki": "https://en.wikipedia.org/wiki/Henry_Wynn",
"zone": "answer_cost",
"idea": {
"en": "Optimal experimental design: how to spend a measurement budget wisely.",
"ru": "Оптимальное планирование эксперимента: как разумно распределить бюджет измерений.",
"de": "Optimale Versuchsplanung: Messbudget klug verteilen."
},
"rule": "Choose the one question that would reduce your uncertainty most.",
"needs": {
"code": "covered",
"note": "the Howard sensor already says when waiting for more information pays off",
"covered_by": "howard"
}
},
{
"id": "dreze",
"name": "Jacques Drèze",
"name_ru": "Жак Дрез",
"years": "1929–2022",
"wiki": "https://en.wikipedia.org/wiki/Jacques_Drèze",
"zone": "answer_cost",
"idea": {
"en": "Economic decisions under uncertainty.",
"ru": "Экономические решения в условиях неопределённости.",
"de": "Wirtschaftliche Entscheidungen unter Unsicherheit."
},
"rule": "Make the decision robust to what you do not know.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "herzberg",
"name": "Agnes M. Herzberg",
"name_ru": "Агнес Герцберг",
"years": "1938–2026",
"wiki": "https://en.wikipedia.org/wiki/Agnes_M._Herzberg",
"zone": "answer_cost",
"idea": {
"en": "Optimal design of experiments.",
"ru": "Оптимальное планирование экспериментов.",
"de": "Optimale Versuchsplanung."
},
"rule": "Plan what to measure before measuring.",
"needs": {
"code": "covered",
"note": "the Howard sensor already says when waiting for more information pays off",
"covered_by": "howard"
}
},
{
"id": "selman",
"name": "Alan Selman",
"name_ru": "Алан Селман",
"years": "1941–2021",
"wiki": "https://en.wikipedia.org/wiki/Alan_Selman",
"zone": "answer_cost",
"idea": {
"en": "Computational complexity theory.",
"ru": "Теория вычислительной сложности.",
"de": "Komplexitätstheorie."
},
"rule": "Some questions are expensive to answer exactly; say when an approximation is used.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "chow",
"name": "Yuan-Shih Chow",
"name_ru": "Юань-Ши Чоу",
"years": "1924–2022",
"wiki": "https://en.wikipedia.org/wiki/Yuan-Shih_Chow",
"zone": "answer_cost",
"idea": {
"en": "Optimal stopping: when to stop searching and answer.",
"ru": "Оптимальная остановка: когда прекратить поиск и ответить.",
"de": "Optimales Stoppen: wann man aufhört zu suchen."
},
"rule": "Set a stopping rule for your search.",
"needs": {
"code": "covered",
"note": "the Howard sensor already says when waiting for more information pays off",
"covered_by": "howard"
}
},
{
"id": "kersten",
"name": "Martin L. Kersten",
"name_ru": "Мартин Керстен",
"years": "1953–2022",
"wiki": "https://en.wikipedia.org/wiki/Martin_L._Kersten",
"zone": "answer_cost",
"idea": {
"en": "Column-store databases and query optimisation (MonetDB).",
"ru": "Колоночные базы данных и оптимизация запросов (MonetDB).",
"de": "Spaltenorientierte Datenbanken und Abfrageoptimierung (MonetDB)."
},
"rule": "Ask only for the fields you need.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "wets",
"name": "Roger J-B Wets",
"name_ru": "Роджер Уэтс",
"years": "1937–2025",
"wiki": "https://en.wikipedia.org/wiki/Roger_J-B_Wets",
"zone": "answer_cost",
"idea": {
"en": "Stochastic programming: decisions when the input data is still random.",
"ru": "Стохастическое программирование: решения, когда исходные данные ещё случайны.",
"de": "Stochastische Optimierung: Entscheidungen bei zufälligen Daten."
},
"rule": "Plan for several scenarios, not for the single expected one.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "davis",
"name": "Martin Davis",
"name_ru": "Мартин Дэвис",
"years": "1928–2023",
"wiki": "https://en.wikipedia.org/wiki/Martin_Davis_(mathematician)",
"zone": "answer_cost",
"idea": {
"en": "The DPLL algorithm at the core of SAT solvers that check whether logical formulas can be satisfied.",
"ru": "Алгоритм DPLL, на котором построены SAT-солверы, проверяющие выполнимость логических формул.",
"de": "DPLL-Algorithmus, Grundlage der SAT-Solver."
},
"rule": "Check whether a set of claims can all be true together before you combine them.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "kirillova",
"name": "Faina Kirillova",
"name_ru": "Фаина Кириллова",
"years": "1931–2024",
"wiki": "https://en.wikipedia.org/wiki/Faina_Kirillova",
"zone": "answer_cost",
"idea": {
"en": "Optimal control theory.",
"ru": "Теория оптимального управления.",
"de": "Optimale Steuerung."
},
"rule": "Define the goal and the cost before choosing the action.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "mitter",
"name": "Sanjoy K. Mitter",
"name_ru": "Санджой Миттер",
"years": "1933–2023",
"wiki": "https://en.wikipedia.org/wiki/Sanjoy_K._Mitter",
"zone": "stale_data",
"idea": {
"en": "Nonlinear filtering: estimating the state of a system from a stream of noisy observations.",
"ru": "Нелинейная фильтрация: оценка состояния системы по потоку шумных наблюдений.",
"de": "Nichtlineare Filterung: Zustandsschätzung aus verrauschten Beobachtungen."
},
"rule": "Update your picture with each new noisy report, weighted by how reliable it is.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "nagao",
"name": "Makoto Nagao",
"name_ru": "Макото Нагао",
"years": "1936–2021",
"wiki": "https://en.wikipedia.org/wiki/Makoto_Nagao",
"zone": "stale_data",
"idea": {
"en": "Example-based machine translation and digital libraries.",
"ru": "Машинный перевод по примерам и цифровые библиотеки.",
"de": "Beispielbasierte maschinelle Übersetzung und digitale Bibliotheken."
},
"rule": "When translating a headline, compare with how the same phrase was rendered before.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "sonnenschein",
"name": "Hugo F. Sonnenschein",
"name_ru": "Хьюго Зонненшайн",
"years": "1940–2021",
"wiki": "https://en.wikipedia.org/wiki/Hugo_F._Sonnenschein",
"zone": "one_model",
"idea": {
"en": "The Sonnenschein–Mantel–Debreu theorem: a general market model says almost nothing about how the market as a whole behaves.",
"ru": "Теорема Зонненшайна–Мантеля–Дебрё: общая модель рынка почти ничего не говорит о поведении рынка в целом.",
"de": "Sonnenschein-Mantel-Debreu-Theorem: das allgemeine Marktmodell sagt wenig über das Gesamtverhalten."
},
"rule": "Do not infer how a whole system behaves from how a typical part behaves.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "siljak",
"name": "Dragoslav D. Šiljak",
"name_ru": "Драгослав Шиляк",
"years": "1933–2025",
"wiki": "https://en.wikipedia.org/wiki/Dragoslav_D._Šiljak",
"zone": "one_model",
"idea": {
"en": "Decentralised control of large complex systems that stays stable when the model is inexact.",
"ru": "Децентрализованное управление сложными системами, устойчивое при неточной модели.",
"de": "Dezentrale Regelung großer Systeme, stabil bei ungenauem Modell."
},
"rule": "Split a big question into parts that each still hold if one part of your model is wrong.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "fox",
"name": "John Fox",
"name_ru": "Джон Фокс",
"years": "1947–2025",
"wiki": "https://en.wikipedia.org/wiki/John_Fox_(sociologist)",
"zone": "one_model",
"idea": {
"en": "Regression diagnostics and the R package car: checking whether a fitted model actually fits.",
"ru": "Диагностика регрессии и пакет car для R: проверка, подходит ли модель к данным на самом деле.",
"de": "Regressionsdiagnostik und das R-Paket car."
},
"rule": "After fitting a model, look at the cases it explains worst.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "burkov",
"name": "Vladimir Burkov",
"name_ru": "Владимир Бурков",
"years": "1939–2025",
"wiki": "https://en.wikipedia.org/wiki/Vladimir_Burkov",
"zone": "rumour_vs_fact",
"idea": {
"en": "Theory of active systems and mechanism design: rules under which it pays agents to report the truth.",
"ru": "Теория активных систем и механизмов: правила, при которых агентам выгодно говорить правду.",
"de": "Theorie aktiver Systeme: Regeln, unter denen Ehrlichkeit sich lohnt."
},
"rule": "Prefer sources whose incentives reward accuracy; ask what a source gains from the claim.",
"needs": {
"code": "covered",
"note": "applied: the Orb Studio forecast game now ranks agents by the Brier score (honest_confidence_30d in get_prediction), so stating the true confidence pays off"
}
},
{
"id": "antognazza",
"name": "Maria Rosa Antognazza",
"name_ru": "Мария Роза Антоньяцца",
"years": "1964–2023",
"wiki": "https://en.wikipedia.org/wiki/Maria_Rosa_Antognazza",
"zone": "rumour_vs_fact",
"idea": {
"en": "Knowledge and belief are different states, not just stronger and weaker versions of the same thing.",
"ru": "Знание и убеждение — разные состояния, а не сильная и слабая версии одного и того же.",
"de": "Wissen und Glauben sind verschiedene Zustände."
},
"rule": "Say 'I believe' and 'it is known' in different words.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "antiseri",
"name": "Dario Antiseri",
"name_ru": "Дарио Антисери",
"years": "1940–2026",
"wiki": "https://en.wikipedia.org/wiki/Dario_Antiseri",
"zone": "rumour_vs_fact",
"idea": {
"en": "Fallibilism (in the line of Popper): any knowledge may turn out to be wrong.",
"ru": "Фаллибилизм (вслед за Поппером): любое знание может оказаться ошибочным.",
"de": "Fallibilismus (nach Popper): jedes Wissen kann sich als falsch erweisen."
},
"rule": "Hold every conclusion as revisable and say what would change it.",
"needs": {
"code": "covered",
"note": "the Hagenauer sensor already shows which labels could flip",
"covered_by": "hagenauer"
}
},
{
"id": "barlow",
"name": "Richard E. Barlow",
"name_ru": "Ричард Барлоу",
"years": "1931–2024",
"wiki": "https://en.wikipedia.org/wiki/Richard_E._Barlow",
"zone": "measurement_error",
"idea": {
"en": "Mathematical theory of reliability: how and when systems fail.",
"ru": "Математическая теория надёжности: как и когда отказывают системы.",
"de": "Mathematische Zuverlässigkeitstheorie."
},
"rule": "A chain is as reliable as its weakest link; find it before trusting the chain.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "borde",
"name": "Christian Bordé",
"name_ru": "Кристиан Борде",
"years": "1943–2023",
"wiki": "https://en.wikipedia.org/wiki/Christian_Bordé",
"zone": "measurement_error",
"idea": {
"en": "Optical clocks, atom interferometry and ultra-precise measurement; work towards the redefinition of SI units.",
"ru": "Оптические часы, атомная интерферометрия и сверхточные измерения; работа над переопределением единиц СИ.",
"de": "Optische Uhren, Atominterferometrie und Präzisionsmessung."
},
"rule": "State how precise a number is, and do not mix values measured at different precision.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and cross-checks numbers",
"covered_by": "baird"
}
},
{
"id": "griffin",
"name": "Patrick Griffin",
"name_ru": "Патрик Гриффин",
"years": "–2025",
"wiki": "https://en.wikipedia.org/wiki/Patrick_Griffin_(academic)",
"zone": "measurement_error",
"idea": {
"en": "Assessment models and tests of skills.",
"ru": "Модели оценивания и тесты навыков.",
"de": "Bewertungsmodelle und Kompetenztests."
},
"rule": "A test result estimates a skill; quote it with its uncertainty.",
"needs": {
"code": "covered",
"note": "the Kahneman sensor already audits the noise of AI judgements",
"covered_by": "kahneman"
}
},
{
"id": "roberts",
"name": "John Roberts",
"name_ru": "Джон Робертс",
"years": "1945–2026",
"wiki": "https://en.wikipedia.org/wiki/Donald_John_Roberts",
"zone": "side_effects",
"idea": {
"en": "Games with incomplete information and the economics of organisations.",
"ru": "Игры с неполной информацией и экономика организаций.",
"de": "Spiele mit unvollständiger Information und Organisationsökonomik."
},
"rule": "Act knowing that others know things you do not.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "fishburn",
"name": "Peter C. Fishburn",
"name_ru": "Питер Фишберн",
"years": "1936–2021",
"wiki": "https://en.wikipedia.org/wiki/Peter_C._Fishburn",
"zone": "answer_cost",
"idea": {
"en": "Utility theory and decision making.",
"ru": "Теория полезности и принятия решений.",
"de": "Nutzentheorie und Entscheidungsfindung."
},
"rule": "Make the trade-offs of a choice explicit.",
"needs": {
"code": "covered",
"note": "the Howard sensor already says when waiting for more information pays off",
"covered_by": "howard"
}
},
{
"id": "morita",
"name": "Kenichi Morita",
"name_ru": "Кэнъити Морита",
"years": "1949–2025",
"wiki": "https://en.wikipedia.org/wiki/Kenichi_Morita",
"zone": "answer_cost",
"idea": {
"en": "Reversible computing: computation that loses no information.",
"ru": "Обратимые вычисления: вычисления без потери информации.",
"de": "Reversible Berechnung ohne Informationsverlust."
},
"rule": "Keep enough of your steps to retrace how you reached an answer.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "schank",
"name": "Roger Schank",
"name_ru": "Роджер Шенк",
"years": "1946–2023",
"wiki": "https://en.wikipedia.org/wiki/Roger_Schank",
"zone": "stale_data",
"idea": {
"en": "Dynamic memory and case-based reasoning: understanding by recalling similar past cases and revising them.",
"ru": "Динамическая память и рассуждение по прецедентам: понимание через похожие прошлые случаи, которые обновляются.",
"de": "Dynamisches Gedächtnis und fallbasiertes Schließen."
},
"rule": "Before judging a new story, recall similar past cases and say how this one differs.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "newton_smith",
"name": "William Newton-Smith",
"name_ru": "Уильям Ньютон-Смит",
"years": "1943–2023",
"wiki": "https://en.wikipedia.org/wiki/William_Newton-Smith",
"zone": "stale_data",
"idea": {
"en": "The Structure of Time: philosophy of time and of scientific rationality.",
"ru": "«Структура времени»: философия времени и научной рациональности.",
"de": "„The Structure of Time“: Philosophie der Zeit."
},
"rule": "Keep 'when it happened' apart from 'when it was reported'.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "paul_david",
"name": "Paul A. David",
"name_ru": "Пол Дэвид",
"years": "1935–2023",
"wiki": "https://en.wikipedia.org/wiki/Paul_A._David",
"zone": "stale_data",
"idea": {
"en": "Path dependence: early choices like the QWERTY layout persist long after better options appear.",
"ru": "Зависимость от пройденного пути: ранние решения вроде раскладки QWERTY держатся, хотя уже устарели.",
"de": "Pfadabhängigkeit: frühe Entscheidungen wie QWERTY bleiben bestehen."
},
"rule": "Ask whether a practice persists because it is best or only because it came first.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "machamer",
"name": "Peter K. Machamer",
"name_ru": "Питер Махамер",
"years": "1942–2023",
"wiki": "https://en.wikipedia.org/wiki/Peter_K._Machamer",
"zone": "one_model",
"idea": {
"en": "Mechanistic explanation: explain by the parts and activities that produce an effect, not by one deductive law.",
"ru": "Механистическое объяснение: объяснять через части и действия, которые дают эффект, а не через один закон.",
"de": "Mechanistische Erklärung: durch Teile und Tätigkeiten, nicht durch ein Gesetz."
},
"rule": "Explain a change by the concrete steps that produced it.",
"needs": {
"code": "covered",
"note": "the Halpern sensor already names the headlines that moved an index",
"covered_by": "halpern"
}
},
{
"id": "gintis",
"name": "Herbert Gintis",
"name_ru": "Герберт Гинтис",
"years": "1940–2023",
"wiki": "https://en.wikipedia.org/wiki/Herbert_Gintis",
"zone": "side_effects",
"idea": {
"en": "The Bounds of Reason: game theory needs a model of what players know and believe (epistemic game theory).",
"ru": "«Границы разума»: теории игр нужна модель того, что игроки знают и во что верят.",
"de": "„The Bounds of Reason“: epistemische Spieltheorie."
},
"rule": "When predicting what actors do, state what you assume they know.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "wilks",
"name": "Yorick Wilks",
"name_ru": "Йорик Уилкс",
"years": "1939–2023",
"wiki": "https://en.wikipedia.org/wiki/Yorick_Wilks",
"zone": "one_model",
"idea": {
"en": "Preference semantics: among several readings choose the most coherent one.",
"ru": "Семантика предпочтений: из нескольких толкований выбирается самое согласованное.",
"de": "Präferenzsemantik: die kohärenteste Lesart wählen."
},
"rule": "When a phrase is ambiguous, pick the reading that fits the rest of the text, and say so.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "hans_albert",
"name": "Hans Albert",
"name_ru": "Ханс Альберт",
"years": "1921–2023",
"wiki": "https://en.wikipedia.org/wiki/Hans_Albert",
"zone": "rumour_vs_fact",
"idea": {
"en": "The Münchhausen trilemma: no claim can be justified to the very end — every chain stops at an assumption, a circle or an infinite regress.",
"ru": "Трилемма Мюнхгаузена: никакое утверждение нельзя обосновать до конца — цепочка упирается в допущение, круг или бесконечность.",
"de": "Münchhausen-Trilemma: keine Aussage lässt sich letztbegründen."
},
"rule": "Name the assumption your conclusion finally rests on.",
"needs": {
"code": "covered",
"note": "the Hagenauer sensor already shows which labels could flip",
"covered_by": "hagenauer"
}
},
{
"id": "scriven",
"name": "Michael Scriven",
"name_ru": "Майкл Скрайвен",
"years": "1928–2023",
"wiki": "https://en.wikipedia.org/wiki/Michael_Scriven",
"zone": "rumour_vs_fact",
"idea": {
"en": "Evaluation theory and critical thinking (formative versus summative evaluation).",
"ru": "Теория оценивания и критическое мышление (формирующее и итоговое оценивание).",
"de": "Evaluationstheorie und kritisches Denken."
},
"rule": "Say by what criteria you judged something good or bad.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "jarvie",
"name": "Ian Jarvie",
"name_ru": "Иэн Джарви",
"years": "1937–2023",
"wiki": "https://en.wikipedia.org/wiki/Ian_Jarvie",
"zone": "rumour_vs_fact",
"idea": {
"en": "Science as a social institution where members test each other's claims.",
"ru": "Наука как сообщество, где участники проверяют утверждения друг друга.",
"de": "Wissenschaft als Gemeinschaft gegenseitiger Prüfung."
},
"rule": "Trust a claim more when independent people have tried to refute it.",
"needs": {
"code": "covered",
"note": "check_headline already counts independent voices and agency echo",
"covered_by": "kahneman"
}
},
{
"id": "van_emden",
"name": "Maarten van Emden",
"name_ru": "Мартен ван Эмден",
"years": "1937–2023",
"wiki": "https://en.wikipedia.org/wiki/Maarten_van_Emden",
"zone": "measurement_error",
"idea": {
"en": "Interval arithmetic and logic programming: compute with a number together with its error bounds.",
"ru": "Интервальная арифметика и логическое программирование: число считается вместе с его погрешностью.",
"de": "Intervallarithmetik: rechnen mit Zahl und Fehlergrenzen."
},
"rule": "Carry error bounds through every calculation and report the interval.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports low–high bounds of the indices",
"covered_by": "leamer"
}
},
{
"id": "markova",
"name": "Elena Vladimirovna Markova",
"name_ru": "Елена Маркова",
"years": "1923–2023",
"wiki": "https://en.wikipedia.org/wiki/Elena_Vladimirovna_Markova",
"zone": "measurement_error",
"idea": {
"en": "Design of experiments under non-uniform conditions.",
"ru": "Планирование экспериментов при неоднородных условиях.",
"de": "Versuchsplanung unter ungleichen Bedingungen."
},
"rule": "Compare like with like: measurements taken under different conditions are not directly comparable.",
"needs": {
"code": "covered",
"note": "the Duckworth sensor already compares like with like (same time of day)",
"covered_by": "duckworth"
}
},
{
"id": "fleming",
"name": "Wendell Fleming",
"name_ru": "Уэнделл Флеминг",
"years": "1928–2023",
"wiki": "https://en.wikipedia.org/wiki/Wendell_Fleming",
"zone": "answer_cost",
"idea": {
"en": "Optimal control of random processes (stochastic control).",
"ru": "Оптимальное управление случайными процессами.",
"de": "Optimale Steuerung stochastischer Prozesse."
},
"rule": "Choose actions that work well across the random paths, not only the expected one.",
"needs": {
"code": "covered",
"note": "the Howard sensor already says when waiting for more information pays off",
"covered_by": "howard"
}
},
{
"id": "emerson",
"name": "E. Allen Emerson",
"name_ru": "Аллен Эмерсон",
"years": "1954–2024",
"wiki": "https://en.wikipedia.org/wiki/E._Allen_Emerson",
"zone": "stale_data",
"idea": {
"en": "Temporal logic and model checking (Turing award 2007): rules for what is true and when, checked automatically.",
"ru": "Темпоральная логика и проверка моделей (премия Тьюринга 2007): правила о том, что истинно и когда, проверяемые автоматически.",
"de": "Temporallogik und Model Checking (Turing-Preis 2007)."
},
"rule": "Write claims with their time condition ('until', 'since', 'always after') and check them against it.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "stein",
"name": "Howard Stein",
"name_ru": "Ховард Стайн",
"years": "1929–2024",
"wiki": "https://en.wikipedia.org/wiki/Howard_Stein_(philosopher)",
"zone": "stale_data",
"idea": {
"en": "Foundations of the physics of space and time.",
"ru": "Основания физики пространства и времени.",
"de": "Grundlagen der Physik von Raum und Zeit."
},
"rule": "Say in which frame (place, time, reference) a measurement holds.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "jarke",
"name": "Matthias Jarke",
"name_ru": "Маттиас Ярке",
"years": "1952–2024",
"wiki": "https://en.wikipedia.org/wiki/Matthias_Jarke",
"zone": "stale_data",
"idea": {
"en": "Metadata and data quality in information systems (data warehouses).",
"ru": "Метаданные и качество данных в информационных системах (хранилища данных).",
"de": "Metadaten und Datenqualität in Informationssystemen."
},
"rule": "Keep the metadata (source, time, unit) with every value you pass on.",
"needs": {
"code": "covered",
"note": "the Baird sensor already keeps source, time and unit with every number",
"covered_by": "baird"
}
},
{
"id": "basmann",
"name": "Robert Basmann",
"name_ru": "Роберт Басман",
"years": "1926–2024",
"wiki": "https://en.wikipedia.org/wiki/Robert_Basmann",
"zone": "one_model",
"idea": {
"en": "Simultaneous-equation models and identification: whether a model can be determined from the data at all.",
"ru": "Системы одновременных уравнений и идентификация: можно ли вообще однозначно определить модель по данным.",
"de": "Simultane Gleichungsmodelle und Identifikation."
},
"rule": "Ask whether the data could tell your explanation apart from another one at all.",
"needs": {
"code": "covered",
"note": "the Leamer and Trevisan sensors already give the bounds and the sampling spread of the indices",
"covered_by": "leamer"
}
},
{
"id": "conway",
"name": "Richard W. Conway",
"name_ru": "Ричард Конвей",
"years": "1931–2024",
"wiki": "https://en.wikipedia.org/wiki/Richard_W._Conway",
"zone": "one_model",
"idea": {
"en": "Methodology of computer simulation.",
"ru": "Методология компьютерного моделирования.",
"de": "Methodik der Computersimulation."
},
"rule": "A simulation shows what follows from its assumptions; report the assumptions with the result.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "cleaveland",
"name": "Rance Cleaveland",
"name_ru": "Рэнс Кливленд",
"years": "1961–2024",
"wiki": "https://en.wikipedia.org/wiki/Rance_Cleaveland",
"zone": "one_model",
"idea": {
"en": "Verification tools that check automatically whether a system behaves as specified.",
"ru": "Инструменты, которые автоматически проверяют, работает ли система как задумано.",
"de": "Werkzeuge zur automatischen Verifikation."
},
"rule": "Test your conclusion against the specification, not only against the example in front of you.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "ruse",
"name": "Michael Ruse",
"name_ru": "Майкл Руз",
"years": "1940–2024",
"wiki": "https://en.wikipedia.org/wiki/Michael_Ruse",
"zone": "rumour_vs_fact",
"idea": {
"en": "The demarcation between science and non-science (and its role in court cases on creationism).",
"ru": "Граница между наукой и ненаукой (и её роль в судебных делах о креационизме).",
"de": "Abgrenzung von Wissenschaft und Nichtwissenschaft."
},
"rule": "Ask whether a claim is testable and open to revision before calling it scientific.",
"needs": {
"code": "covered",
"note": "the Park sensor already flags warning signs of bogus science",
"covered_by": "park"
}
},
{
"id": "depierris",
"name": "Graciela De Pierris",
"name_ru": "Грасиела Де Пьеррис",
"years": "1950–2024",
"wiki": "https://en.wikipedia.org/wiki/Graciela_De_Pierris",
"zone": "rumour_vs_fact",
"idea": {
"en": "Ideas, Evidence and Method: Hume's scepticism and the limits of evidence.",
"ru": "«Идеи, свидетельства и метод»: скептицизм Юма и пределы свидетельств.",
"de": "„Ideas, Evidence, and Method“: Humes Skeptizismus."
},
"rule": "Past regularity is not proof of the next case; say when you rely on it.",
"needs": {
"code": "covered",
"note": "the Hagenauer sensor already shows which labels could flip",
"covered_by": "hagenauer"
}
},
{
"id": "cresswell",
"name": "Max Cresswell",
"name_ru": "Макс Крессвелл",
"years": "1939–2024",
"wiki": "https://en.wikipedia.org/wiki/Max_Cresswell",
"zone": "rumour_vs_fact",
"idea": {
"en": "Semantics of belief sentences and modal logic.",
"ru": "Семантика высказываний об убеждениях и модальная логика.",
"de": "Semantik von Glaubenssätzen und Modallogik."
},
"rule": "'X believes that p' is a claim about X, not about p; do not report it as p.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "schweder",
"name": "Tore Schweder",
"name_ru": "Туре Шведер",
"years": "1943–2024",
"wiki": "https://en.wikipedia.org/wiki/Tore_Schweder",
"zone": "measurement_error",
"idea": {
"en": "Confidence distributions: report the whole distribution of uncertainty of an estimate, not one number.",
"ru": "Доверительные распределения: сообщать всё распределение неопределённости оценки, а не одно число.",
"de": "Konfidenzverteilungen: die ganze Unsicherheit einer Schätzung angeben."
},
"rule": "Give the range and how likely each part of it is, not only the point estimate.",
"needs": {
"code": "covered",
"note": "the Leamer and Trevisan sensors already give the bounds and the sampling spread of the indices",
"covered_by": "leamer"
}
},
{
"id": "lynch",
"name": "Clifford Lynch",
"name_ru": "Клиффорд Линч",
"years": "1954–2025",
"wiki": "https://en.wikipedia.org/wiki/Clifford_Lynch",
"zone": "stale_data",
"idea": {
"en": "Digital libraries and long-term preservation of digital information.",
"ru": "Цифровые библиотеки и долгосрочное сохранение цифровой информации.",
"de": "Digitale Bibliotheken und Langzeitarchivierung."
},
"rule": "Cite a stable, archived version of a source, not only a link that may disappear.",
"needs": {
"code": "covered",
"note": "the Rabin sensor already checks whether linked source pages still open and match",
"covered_by": "rabin"
}
},
{
"id": "kurtz",
"name": "Thomas G. Kurtz",
"name_ru": "Томас Курц",
"years": "1941–2025",
"wiki": "https://en.wikipedia.org/wiki/Thomas_G._Kurtz",
"zone": "stale_data",
"idea": {
"en": "Convergence and approximation of random (Markov) processes.",
"ru": "Сходимость и приближение случайных (марковских) процессов.",
"de": "Konvergenz und Approximation stochastischer Prozesse."
},
"rule": "Check whether a running average has settled before treating it as stable.",
"needs": {
"code": "covered",
"note": "the Trevisan sensor already shows when a sample settles",
"covered_by": "trevisan"
}
},
{
"id": "gilyarevsky",
"name": "Ruggero Gilyarevsky",
"name_ru": "Руджеро Гиляревский",
"years": "1929–2025",
"wiki": "https://en.wikipedia.org/wiki/Ruggero_Gilyarevsky",
"zone": "stale_data",
"idea": {
"en": "Scientific information and communication (informatics as the science of information).",
"ru": "Научная информация и коммуникация (информатика как наука об информации).",
"de": "Wissenschaftliche Information und Kommunikation."
},
"rule": "Note where and when a piece of information entered the chain you received it through.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "abrial",
"name": "Jean-Raymond Abrial",
"name_ru": "Жан-Раймон Абриаль",
"years": "1938–2025",
"wiki": "https://en.wikipedia.org/wiki/Jean-Raymond_Abrial",
"zone": "one_model",
"idea": {
"en": "Formal methods: the Z notation and the B-Method for proving programs correct.",
"ru": "Формальные методы: нотация Z и B-метод для доказательства правильности программ.",
"de": "Formale Methoden: Z-Notation und B-Methode."
},
"rule": "State precisely what must always hold, then check each step against it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "benacerraf",
"name": "Paul Benacerraf",
"name_ru": "Пол Бенасерраф",
"years": "1930–2025",
"wiki": "https://en.wikipedia.org/wiki/Paul_Benacerraf",
"zone": "one_model",
"idea": {
"en": "'What numbers could not be': the same facts admit several equally good models.",
"ru": "«Чем числа быть не могут»: одни и те же факты допускают несколько равноправных моделей.",
"de": "„What Numbers Could Not Be“: gleiche Fakten, mehrere gleichwertige Modelle."
},
"rule": "If two explanations fit the facts equally well, say so instead of picking one.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "maxwell",
"name": "Nicholas Maxwell",
"name_ru": "Николас Максвелл",
"years": "1937–2025",
"wiki": "https://en.wikipedia.org/wiki/Nicholas_Maxwell",
"zone": "rumour_vs_fact",
"idea": {
"en": "From Knowledge to Wisdom: inquiry should aim at helping people live well, not only at knowledge.",
"ru": "«От знания к мудрости»: исследование должно помогать людям жить лучше, а не только накапливать знание.",
"de": "„From Knowledge to Wisdom“: Forschung soll helfen, gut zu leben."
},
"rule": "Ask what the person needs the answer for, not only what is true.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "ellis",
"name": "Brian David Ellis",
"name_ru": "Брайан Эллис",
"years": "1929–2025",
"wiki": "https://en.wikipedia.org/wiki/Brian_David_Ellis",
"zone": "measurement_error",
"idea": {
"en": "Basic Concepts of Measurement: what makes a quantity measurable and a scale meaningful.",
"ru": "«Основные понятия измерения»: что делает величину измеримой, а шкалу осмысленной.",
"de": "„Basic Concepts of Measurement“."
},
"rule": "Before comparing two numbers, check that they are on the same scale.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and scales",
"covered_by": "baird"
}
},
{
"id": "korte",
"name": "Bernhard Korte",
"name_ru": "Бернхард Корте",
"years": "1938–2025",
"wiki": "https://en.wikipedia.org/wiki/Bernhard_Korte",
"zone": "answer_cost",
"idea": {
"en": "Combinatorial optimisation (chip design, routing).",
"ru": "Комбинаторная оптимизация (проектирование микросхем, маршрутизация).",
"de": "Kombinatorische Optimierung."
},
"rule": "Among many possible plans, search systematically for the cheapest one that meets all constraints.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already gives the cheapest call chains",
"covered_by": "bertsekas"
}
},
{
"id": "hoare",
"name": "Tony Hoare",
"name_ru": "Тони Хоар",
"years": "1934–2026",
"wiki": "https://en.wikipedia.org/wiki/Tony_Hoare",
"zone": "one_model",
"idea": {
"en": "Hoare logic: prove a program correct by its preconditions and postconditions (Turing award 1980); also Quicksort and CSP.",
"ru": "Логика Хоара: правильность программы доказывают через пред- и постусловия (премия Тьюринга 1980); также быстрая сортировка и CSP.",
"de": "Hoare-Logik: Korrektheit über Vor- und Nachbedingungen (Turing-Preis 1980)."
},
"rule": "State what must be true before and after an answer, and check both.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "morin",
"name": "Edgar Morin",
"name_ru": "Эдгар Морен",
"years": "1921–2026",
"wiki": "https://en.wikipedia.org/wiki/Edgar_Morin",
"zone": "one_model",
"idea": {
"en": "Complex thought: understanding requires linking parts and whole instead of reducing everything to one model.",
"ru": "Сложное мышление: понять — значит связать части и целое, а не свести всё к одной модели.",
"de": "Komplexes Denken: Teile und Ganzes verbinden statt auf ein Modell zu reduzieren."
},
"rule": "Before explaining by one cause, list the other parts of the system that could matter.",
"needs": {
"code": "covered",
"note": "the Leamer and Lyberg sensors already show how the picture depends on model choices and coverage",
"covered_by": "leamer"
}
},
{
"id": "smiley",
"name": "Timothy Smiley",
"name_ru": "Тимоти Смайли",
"years": "1930–2026",
"wiki": "https://en.wikipedia.org/wiki/Timothy_Smiley",
"zone": "one_model",
"idea": {
"en": "Multiple-conclusion logic and plural logic.",
"ru": "Логика с несколькими выводами и логика множественного числа.",
"de": "Logik mit mehreren Konklusionen und Plurallogik."
},
"rule": "Sometimes the honest conclusion is 'one of these is true', not a single answer.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "haack",
"name": "Susan Haack",
"name_ru": "Сьюзен Хаак",
"years": "1945–2026",
"wiki": "https://en.wikipedia.org/wiki/Susan_Haack",
"zone": "rumour_vs_fact",
"idea": {
"en": "Evidence and Inquiry: evidence works like a crossword — a claim is warranted by its own clues and by how well it fits the entries that cross it.",
"ru": "«Evidence and Inquiry»: доказательства устроены как кроссворд — утверждение держится и на своих подсказках, и на том, как оно сходится с пересекающими словами.",
"de": "„Evidence and Inquiry“: Evidenz wie ein Kreuzworträtsel."
},
"rule": "Trust a claim when its own sources support it and it fits the other confirmed facts that cross it.",
"needs": {
"code": "covered",
"note": "check_headline already counts independent voices (own clues) and the Frankfurt sensor checks anchors",
"covered_by": "frankfurt"
}
},
{
"id": "musgrave",
"name": "Alan Musgrave",
"name_ru": "Алан Масгрейв",
"years": "1940–2026",
"wiki": "https://en.wikipedia.org/wiki/Alan_Musgrave",
"zone": "rumour_vs_fact",
"idea": {
"en": "Scientific realism and critical rationalism against scepticism.",
"ru": "Научный реализм и критический рационализм против скептицизма.",
"de": "Wissenschaftlicher Realismus und kritischer Rationalismus."
},
"rule": "Accept the best-tested explanation for now, while staying open to its refutation.",
"needs": {
"code": "covered",
"note": "the Park sensor already flags warning signs of bogus science",
"covered_by": "park"
}
},
{
"id": "habermas",
"name": "Jürgen Habermas",
"name_ru": "Юрген Хабермас",
"years": "1929–2026",
"wiki": "https://en.wikipedia.org/wiki/Jürgen_Habermas",
"zone": "rumour_vs_fact",
"idea": {
"en": "Communicative action: a statement raises claims to truth, rightness and sincerity that can be challenged with reasons in public discourse.",
"ru": "Коммуникативное действие: высказывание заявляет об истине, правильности и искренности, и это можно оспорить доводами в публичной дискуссии.",
"de": "Kommunikatives Handeln: Geltungsansprüche auf Wahrheit, Richtigkeit und Wahrhaftigkeit."
},
"rule": "Separate whether a statement is true, whether it is right and whether the speaker means it.",
"needs": {
"code": "covered",
"note": "the Searle sensor already separates claims, promises and demands",
"covered_by": "searle"
}
},
{
"id": "neumann",
"name": "Peter G. Neumann",
"name_ru": "Питер Нойманн",
"years": "1932–2026",
"wiki": "https://en.wikipedia.org/wiki/Peter_G._Neumann",
"zone": "measurement_error",
"idea": {
"en": "How computer systems fail: risks to the public in computers, collected in the RISKS Digest since 1985.",
"ru": "Как ломаются компьютерные системы: риски для людей, собранные в рассылке RISKS Digest с 1985 года.",
"de": "Wie Computersysteme versagen: RISKS Digest seit 1985."
},
"rule": "Assume your own tools can fail; say which part of an answer depends on a system that could be wrong.",
"needs": {
"code": "covered",
"note": "the Hamilton and Baird sensors already show what the site postpones and which numbers broke",
"covered_by": "hamilton"
}
},
{
"id": "stearns",
"name": "Richard E. Stearns",
"name_ru": "Ричард Стернс",
"years": "1936–2026",
"wiki": "https://en.wikipedia.org/wiki/Richard_E._Stearns",
"zone": "answer_cost",
"idea": {
"en": "Foundations of computational complexity: measuring the time an algorithm needs (Turing award 1993, with Hartmanis).",
"ru": "Основы теории вычислительной сложности: сколько времени требует алгоритм (премия Тьюринга 1993, вместе с Хартманисом).",
"de": "Grundlagen der Komplexitätstheorie (Turing-Preis 1993)."
},
"rule": "Estimate how much work an answer needs before starting it.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already measures the cost of each answer",
"covered_by": "bertsekas"
}
},
{
"id": "harman",
"name": "Gilbert Harman",
"name_ru": "Гилберт Харман",
"years": "1938–2021",
"wiki": "https://en.wikipedia.org/wiki/Gilbert_Harman",
"zone": "stale_data",
"idea": {
"en": "Change in View: how to revise beliefs reasonably when new evidence arrives — change as little as needed, keep what still fits.",
"ru": "«Change in View»: как разумно менять мнение при новых данных — менять не больше необходимого и сохранять то, что ещё сходится.",
"de": "„Change in View“: Überzeugungen vernünftig revidieren."
},
"rule": "When new facts arrive, revise only the parts of your answer they touch, and say what changed.",
"needs": {
"code": "needs_history",
"note": "same data as Minker: headlines with correction/update/denial words linked to the original story",
"not_before": "2026-12-13"
}
},
{
"id": "ramsey",
"name": "James B. Ramsey",
"name_ru": "Джеймс Рэмси",
"years": "1937–2021",
"wiki": "https://en.wikipedia.org/wiki/James_B._Ramsey",
"zone": "one_model",
"idea": {
"en": "The Ramsey RESET test: does a regression model have the wrong functional form?",
"ru": "Тест RESET Рэмси: не построена ли регрессионная модель в неправильной форме.",
"de": "Ramsey-RESET-Test: falsche funktionale Form?"
},
"rule": "Check whether your explanation's shape (straight line, threshold, cycle) is right, not only its numbers.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "van_eeden",
"name": "Constance van Eeden",
"name_ru": "Констанс ван Эден",
"years": "1927–2021",
"wiki": "https://en.wikipedia.org/wiki/Constance_van_Eeden",
"zone": "one_model",
"idea": {
"en": "Estimation under restricted parameter spaces and robust, distribution-free statistics.",
"ru": "Оценивание при ограничениях на параметры и устойчивая статистика без заранее выбранной модели.",
"de": "Schätzung bei eingeschränkten Parametern, verteilungsfreie Statistik."
},
"rule": "Use what you know about the limits of a quantity (it cannot be negative, cannot exceed 100) when estimating it.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "margolis",
"name": "Joseph Margolis",
"name_ru": "Джозеф Марголис",
"years": "1924–2021",
"wiki": "https://en.wikipedia.org/wiki/Joseph_Margolis",
"zone": "one_model",
"idea": {
"en": "Pragmatism without a single foundation: interpretation and knowledge change with history and culture.",
"ru": "Прагматизм без единственного основания: толкование и знание меняются с историей и культурой.",
"de": "Pragmatismus ohne festes Fundament."
},
"rule": "Say from which tradition or context an interpretation comes.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "boyd",
"name": "Richard Boyd",
"name_ru": "Ричард Бойд",
"years": "1942–2021",
"wiki": "https://en.wikipedia.org/wiki/Richard_Boyd",
"zone": "rumour_vs_fact",
"idea": {
"en": "Scientific realism: the success of mature theories is evidence that they are roughly true.",
"ru": "Научный реализм: успех зрелых теорий — свидетельство того, что они примерно верны.",
"de": "Wissenschaftlicher Realismus."
},
"rule": "Give more weight to claims backed by theories that have predicted well before.",
"needs": {
"code": "covered",
"note": "the Park sensor already flags warning signs of bogus science",
"covered_by": "park"
}
},
{
"id": "dunn",
"name": "J. Michael Dunn",
"name_ru": "Майкл Данн",
"years": "1941–2021",
"wiki": "https://en.wikipedia.org/wiki/Jon_Michael_Dunn",
"zone": "rumour_vs_fact",
"idea": {
"en": "Relevance logic and the Belnap–Dunn four-valued logic: besides true and false, information can be 'both' (contradictory sources) or 'neither' (no information).",
"ru": "Логика релевантности и четырёхзначная логика Белнапа–Данна: кроме «истина» и «ложь» сведения бывают «и то и другое» (источники противоречат) или «ни то ни другое» (сведений нет).",
"de": "Relevanzlogik und vierwertige Logik nach Belnap und Dunn."
},
"rule": "When sources contradict, report 'both' with the sources instead of picking one; when there is no information, say 'neither', not 'false'.",
"needs": {
"code": "covered",
"note": "applied: check_headline now returns the Belnap–Dunn value of the outlets found (affirmed / denied / both / neither) as sources_agree",
"covered_by": "frankfurt"
}
},
{
"id": "blackwell",
"name": "Richard J. Blackwell",
"name_ru": "Ричард Блэквелл",
"years": "1929–2021",
"wiki": "https://en.wikipedia.org/wiki/Richard_J._Blackwell",
"zone": "rumour_vs_fact",
"idea": {
"en": "History of the Galileo affair: how authority and evidence collided.",
"ru": "История дела Галилея: как столкнулись авторитет и доказательства.",
"de": "Geschichte des Galilei-Prozesses."
},
"rule": "Do not accept a claim only because an authority states it; ask for the evidence.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "savitch",
"name": "Walter Savitch",
"name_ru": "Уолтер Сэвич",
"years": "1943–2021",
"wiki": "https://en.wikipedia.org/wiki/Walter_Savitch",
"zone": "answer_cost",
"idea": {
"en": "Savitch's theorem: how much memory a computation needs (nondeterministic space can be simulated with quadratic deterministic space).",
"ru": "Теорема Сэвича: сколько памяти нужно на вычисление.",
"de": "Satz von Savitch: Speicherbedarf einer Berechnung."
},
"rule": "Keep in your context only what the next step needs.",
"needs": {
"code": "covered",
"note": "the Bertsekas and Trevisan sensors already measure what an answer needs",
"covered_by": "bertsekas"
}
},
{
"id": "mellor",
"name": "Hugh Mellor",
"name_ru": "Хью Меллор",
"years": "1938–2020",
"wiki": "https://en.wikipedia.org/wiki/Hugh_Mellor",
"zone": "stale_data",
"idea": {
"en": "Real Time: the philosophy of time, and chances as objective probabilities.",
"ru": "«Real Time»: философия времени и шансы как объективные вероятности.",
"de": "„Real Time“: Philosophie der Zeit, Chancen als objektive Wahrscheinlichkeiten."
},
"rule": "Distinguish the chance of an event from your confidence in a report about it.",
"needs": {
"code": "covered",
"note": "the Cox and Howard sensors already separate how long stories live from how often they get confirmed",
"covered_by": "howard"
}
},
{
"id": "curras",
"name": "Emilia Currás",
"name_ru": "Эмилия Куррас",
"years": "1927–2020",
"wiki": "https://en.wikipedia.org/wiki/Emilia_Currás",
"zone": "stale_data",
"idea": {
"en": "Foundations of information science: ontologies and thesauri that organise knowledge.",
"ru": "Основы информационной науки: онтологии и тезаурусы, которые упорядочивают знание.",
"de": "Grundlagen der Informationswissenschaft: Ontologien und Thesauri."
},
"rule": "Use consistent terms for the same thing across sources before comparing them.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "giere",
"name": "Ronald Giere",
"name_ru": "Рональд Гир",
"years": "1938–2020",
"wiki": "https://en.wikipedia.org/wiki/Ronald_Giere",
"zone": "one_model",
"idea": {
"en": "Scientific Perspectivism: every model sees the world from a perspective and shows only part of it.",
"ru": "«Scientific Perspectivism»: каждая модель смотрит на мир с одной точки и видит только его часть.",
"de": "„Scientific Perspectivism“: jedes Modell zeigt nur einen Teil der Welt."
},
"rule": "Say from which perspective (sources, languages, regions) your picture is drawn.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already says from which languages and regions the radars see the world",
"covered_by": "lyberg"
}
},
{
"id": "richter",
"name": "Michael M. Richter",
"name_ru": "Михаэль Рихтер",
"years": "1938–2020",
"wiki": "https://en.wikipedia.org/wiki/Michael_M._Richter",
"zone": "one_model",
"idea": {
"en": "Case-based reasoning: solve a new problem from similar solved cases instead of one general model.",
"ru": "Рассуждение по прецедентам: решать новую задачу по похожим решённым случаям, а не по одной общей модели.",
"de": "Fallbasiertes Schließen."
},
"rule": "Look for the most similar past case and check how far it really matches.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "giorello",
"name": "Giulio Giorello",
"name_ru": "Джулио Джорелло",
"years": "1945–2020",
"wiki": "https://en.wikipedia.org/wiki/Giulio_Giorello",
"zone": "rumour_vs_fact",
"idea": {
"en": "Applied epistemology and the philosophy of science in public life.",
"ru": "Прикладная эпистемология и философия науки в общественной жизни.",
"de": "Angewandte Erkenntnistheorie."
},
"rule": "Explain how a claim is known, not only what it says.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "caws",
"name": "Peter Caws",
"name_ru": "Питер Кос",
"years": "1931–2020",
"wiki": "https://en.wikipedia.org/wiki/Peter_Caws",
"zone": "rumour_vs_fact",
"idea": {
"en": "Systematic philosophy of science: how theories, observations and values fit together.",
"ru": "Систематическая философия науки: как сходятся теории, наблюдения и ценности.",
"de": "Systematische Wissenschaftsphilosophie."
},
"rule": "Keep observations, theory and value judgements apart in an answer.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "freksa",
"name": "Christian Freksa",
"name_ru": "Кристиан Фрекса",
"years": "1950–2020",
"wiki": "https://de.wikipedia.org/wiki/Christian_Freksa",
"zone": "stale_data",
"idea": {
"en": "Qualitative reasoning about time and space from the order of events only (semi-intervals).",
"ru": "Рассуждение о времени и пространстве, когда известен только порядок событий («полуинтервалы»).",
"de": "Qualitatives Schließen über Zeit und Raum aus der Reihenfolge (Semi-Intervalle)."
},
"rule": "When exact times are unknown, reason from the order of events and say that you do.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "rueger",
"name": "Bernhard Rüger",
"name_ru": "Бернхард Рюгер",
"years": "1942–2025",
"wiki": "https://de.wikipedia.org/wiki/Bernhard_R%C3%BCger",
"zone": "stale_data",
"idea": {
"en": "Separating trend and seasonality in time series.",
"ru": "Выделение тренда и сезонности во временных рядах.",
"de": "Trend- und Saisonzerlegung von Zeitreihen."
},
"rule": "Before calling a change new, remove the usual seasonal pattern.",
"needs": {
"code": "covered",
"note": "the Duckworth sensor already compares with the same time of day",
"covered_by": "duckworth"
}
},
{
"id": "schloegl",
"name": "Christian Schlögl",
"name_ru": "Кристиан Шлёгль",
"years": "1961–2024",
"wiki": "https://de.wikipedia.org/wiki/Christian_Schl%C3%B6gl",
"zone": "stale_data",
"idea": {
"en": "Bibliometrics and the comparison of data sources (Web of Science versus Scopus).",
"ru": "Библиометрия и сравнение источников данных (Web of Science и Scopus).",
"de": "Bibliometrie und Vergleich von Datenquellen (Web of Science, Scopus)."
},
"rule": "The same count from two databases can differ; say which source you counted in.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already compares what the feeds cover",
"covered_by": "lyberg"
}
},
{
"id": "bunke",
"name": "Olaf Bunke",
"name_ru": "Олаф Бунке",
"years": "1935–2021",
"wiki": "https://de.wikipedia.org/wiki/Olaf_Bunke",
"zone": "one_model",
"idea": {
"en": "Model choice and prediction in regression (a statistician from the GDR).",
"ru": "Выбор модели и прогноз в регрессии (статистик из ГДР).",
"de": "Modellwahl und Vorhersage in der Regression (Statistiker aus der DDR)."
},
"rule": "Choose a model by how well it predicts new cases, not by how well it fits the old ones.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "kambartel",
"name": "Friedrich Kambartel",
"name_ru": "Фридрих Камбартель",
"years": "1935–2022",
"wiki": "https://de.wikipedia.org/wiki/Friedrich_Kambartel",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Wahrheit und Begründung', 'Erfahrung und Struktur': truth and justification are different things.",
"ru": "«Wahrheit und Begründung», «Erfahrung und Struktur»: истина и обоснование — разные вещи.",
"de": "„Wahrheit und Begründung“, „Erfahrung und Struktur“."
},
"rule": "Say separately whether a claim is well justified and whether it is true.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "laitko",
"name": "Hubert Laitko",
"name_ru": "Хуберт Лайтко",
"years": "1935–2024",
"wiki": "https://de.wikipedia.org/wiki/Hubert_Laitko",
"zone": "rumour_vs_fact",
"idea": {
"en": "Methodology of scientific knowledge ('Wege des Erkennens').",
"ru": "Методология научного познания («Wege des Erkennens»).",
"de": "Methodologie wissenschaftlicher Erkenntnis („Wege des Erkennens“)."
},
"rule": "Describe the path by which a fact was found, not only the fact.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "lahuti",
"name": "Delir Lahuti",
"name_ru": "Делир Лахути",
"years": "1934–2022",
"wiki": "https://de.wikipedia.org/wiki/Delir_Lahuti",
"zone": "rumour_vs_fact",
"idea": {
"en": "Evaluation of information retrieval systems (VINITI, Moscow).",
"ru": "Оценка информационно-поисковых систем (ВИНИТИ, Москва).",
"de": "Bewertung von Informationsrecherchesystemen (WINITI, Moskau)."
},
"rule": "A search result is a sample chosen by a system; ask what the system leaves out.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "rinne",
"name": "Horst Rinne",
"name_ru": "Хорст Ринне",
"years": "1939–2023",
"wiki": "https://de.wikipedia.org/wiki/Horst_Rinne",
"zone": "measurement_error",
"idea": {
"en": "How inaccurate national accounts are, and how the reliability of data shows in its later revisions.",
"ru": "Насколько неточно считают национальный продукт и как надёжность данных видна по их пересмотрам.",
"de": "Genauigkeit der Volkswirtschaftlichen Gesamtrechnung und Revisionen als Maß der Verlässlichkeit."
},
"rule": "Treat a first release of a statistic as provisional; say whether the number has been revised.",
"needs": {
"code": "needs_history",
"note": "Orb Studio records first and later values of every sensor number since 23.11.2026; how often and how much they are revised (similar idea for macro data: ALFRED vintages of the St. Louis Fed)",
"not_before": "2026-12-21"
}
},
{
"id": "woeginger",
"name": "Gerhard Woeginger",
"name_ru": "Герхард Вёгингер",
"years": "1964–2022",
"wiki": "https://de.wikipedia.org/wiki/Gerhard_Woeginger",
"zone": "answer_cost",
"idea": {
"en": "Approximation and exact exponential algorithms for NP-hard problems.",
"ru": "Приближённые и точные экспоненциальные алгоритмы для NP-трудных задач.",
"de": "Approximations- und exakte Exponentialalgorithmen für NP-schwere Probleme."
},
"rule": "For a hard question, a good approximate answer now can beat an exact one never; say which you give.",
"needs": {
"code": "covered",
"note": "the Trevisan and Bertsekas sensors already trade accuracy for cost",
"covered_by": "trevisan"
}
},
{
"id": "schnorr",
"name": "Claus Peter Schnorr",
"name_ru": "Клаус Петер Шнорр",
"years": "1943–2025",
"wiki": "https://de.wikipedia.org/wiki/Claus_Peter_Schnorr",
"zone": "answer_cost",
"idea": {
"en": "Complexity theory, algorithmic randomness and the Schnorr signature.",
"ru": "Теория сложности, алгоритмическая случайность и подпись Шнорра.",
"de": "Komplexitätstheorie, algorithmischer Zufall, Schnorr-Signatur."
},
"rule": "Something that looks random may still have a pattern; test before assuming noise.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "trzesicki",
"name": "Kazimierz Trzęsicki",
"name_ru": "Казимеж Тшенсицкий",
"years": "1947–2025",
"wiki": "https://pl.wikipedia.org/wiki/Kazimierz_Trz%C4%99sicki",
"zone": "stale_data",
"idea": {
"en": "Tense logic and the question of determinism: are statements about the future already true or false?",
"ru": "Логика грамматических времён и вопрос о детерминизме: истинны ли уже высказывания о будущем?",
"de": "Zeitlogik und Determinismus: sind Aussagen über die Zukunft schon wahr?"
},
"rule": "Do not report a statement about the future as already true; keep its tense.",
"needs": {
"code": "covered",
"note": "the Searle sensor already separates promises and plans from events",
"covered_by": "searle"
}
},
{
"id": "domanski",
"name": "Czesław Domański",
"name_ru": "Чеслав Доманьский",
"years": "1943–2026",
"wiki": "https://pl.wikipedia.org/wiki/Czes%C5%82aw_Doma%C5%84ski",
"zone": "one_model",
"idea": {
"en": "Founder of the Łódź school of nonparametric statistics: conclusions without a model chosen in advance.",
"ru": "Основатель лодзинской школы непараметрической статистики: выводы без заранее выбранной модели.",
"de": "Begründer der Lodzer Schule der nichtparametrischen Statistik."
},
"rule": "When you do not know the shape of the data, use methods that do not assume one.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "dowek",
"name": "Gilles Dowek",
"name_ru": "Жиль Довек",
"years": "1966–2025",
"wiki": "https://fr.wikipedia.org/wiki/Gilles_Dowek",
"zone": "one_model",
"idea": {
"en": "Formal proof checking and the logical framework Dedukti, which lets proofs from different systems be checked together.",
"ru": "Формальная проверка доказательств и система Dedukti, в которой можно сверять доказательства из разных систем.",
"de": "Formale Beweisprüfung und das Logik-Framework Dedukti."
},
"rule": "Make your reasoning checkable step by step, so that another system could verify it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "vaduva",
"name": "Ion Văduva",
"name_ru": "Ион Вэдува",
"years": "1936–2023",
"wiki": "https://fr.wikipedia.org/wiki/Ion_V%C4%83duva",
"zone": "one_model",
"idea": {
"en": "Computer simulation and the estimation of distributions (Romanian school of probability).",
"ru": "Компьютерное моделирование и оценка распределений (румынская школа теории вероятностей).",
"de": "Computersimulation und Schätzung von Verteilungen."
},
"rule": "Check a simulated result against the real data it is meant to imitate.",
"needs": {
"code": "covered",
"note": "the Trevisan sensor already simulates random samples of the headlines",
"covered_by": "trevisan"
}
},
{
"id": "michel_meyer",
"name": "Michel Meyer",
"name_ru": "Мишель Мейер",
"years": "1950–2022",
"wiki": "https://fr.wikipedia.org/wiki/Michel_Meyer_(philosophe)",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Découverte et justification en science' and problematology: thinking starts from questions; how a claim was found is not how it is justified.",
"ru": "«Découverte et justification en science» и проблематология: мысль начинается с вопроса; как утверждение нашли — не то же, что его обоснование.",
"de": "„Découverte et justification en science“ und Problematologie."
},
"rule": "Say which question a claim answers, and keep how it was found apart from why it holds.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "lecourt",
"name": "Dominique Lecourt",
"name_ru": "Доминик Лекур",
"years": "1944–2022",
"wiki": "https://fr.wikipedia.org/wiki/Dominique_Lecourt",
"zone": "rumour_vs_fact",
"idea": {
"en": "The Lysenko affair: how ideology presented itself as science.",
"ru": "Дело Лысенко: как идеология выдавала себя за науку.",
"de": "Die Lyssenko-Affäre: wie Ideologie sich als Wissenschaft ausgab."
},
"rule": "Be wary when a scientific claim is backed mainly by political authority.",
"needs": {
"code": "covered",
"note": "the Park sensor already flags warning signs of bogus science",
"covered_by": "park"
}
},
{
"id": "chajda",
"name": "Jan Chajda",
"name_ru": "Ян Хайда",
"years": "1939–2022",
"wiki": "https://pl.wikipedia.org/wiki/Jan_Chajda",
"zone": "measurement_error",
"idea": {
"en": "Technical metrology and measuring systems.",
"ru": "Техническая метрология и измерительные системы.",
"de": "Technische Messtechnik und Messsysteme."
},
"rule": "Every measurement has an instrument and an uncertainty; name both.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units, sources and cross-checks",
"covered_by": "baird"
}
},
{
"id": "ogryczak",
"name": "Włodzimierz Ogryczak",
"name_ru": "Влодзимеж Огрычак",
"years": "1951–2020",
"wiki": "https://pl.wikipedia.org/wiki/W%C5%82odzimierz_Ogryczak",
"zone": "answer_cost",
"idea": {
"en": "Multiple-criteria optimisation and decision support, including fair (equitable) solutions.",
"ru": "Оптимизация по нескольким критериям и поддержка решений, в том числе справедливые решения.",
"de": "Mehrkriterielle Optimierung und Entscheidungsunterstützung."
},
"rule": "When goals conflict, show the trade-off instead of hiding it in one score.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already shows the cost trade-offs of answers",
"covered_by": "bertsekas"
}
},
{
"id": "vuillemin",
"name": "Jean Vuillemin",
"name_ru": "Жан Вюйемен",
"years": "1947–2026",
"wiki": "https://fr.wikipedia.org/wiki/Jean_Vuillemin",
"zone": "answer_cost",
"idea": {
"en": "With Rivest, a lower bound on how many queries an algorithm needs to test a graph property (Aanderaa–Karp–Rosenberg conjecture); binomial heaps.",
"ru": "Вместе с Ривестом — нижняя граница числа запросов, нужных алгоритму, чтобы проверить свойство графа; биномиальные кучи.",
"de": "Mit Rivest: untere Schranke für Anfragen beim Testen von Grapheigenschaften."
},
"rule": "Some questions cannot be answered without looking at most of the data; recognise them before sampling.",
"needs": {
"code": "covered",
"note": "the Trevisan sensor already shows when an index needs almost all headlines",
"covered_by": "trevisan"
}
},
{
"id": "galves",
"name": "Antonio Galves",
"name_ru": "Антонио Галвес",
"years": "1947–2023",
"wiki": "https://en.wikipedia.org/wiki/Antonio_Galves",
"zone": "stale_data",
"idea": {
"en": "Stochastic chains with memory of variable length: models that decide for themselves how far into the past to look.",
"ru": "Случайные процессы с памятью переменной длины: модели сами решают, насколько далеко в прошлое смотреть.",
"de": "Stochastische Ketten mit variabler Gedächtnislänge."
},
"rule": "Use as much of the past as actually helps, no more and no less, and say how far back you looked.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already chooses its noise window from the data",
"covered_by": "polyak"
}
},
{
"id": "da_costa",
"name": "Newton da Costa",
"name_ru": "Ньютон да Коста",
"years": "1929–2024",
"wiki": "https://es.wikipedia.org/wiki/Newton_da_Costa",
"zone": "one_model",
"idea": {
"en": "Paraconsistent logic and 'Science and Partial Truth': reasoning can stay sound with contradictory information, and theories can be partly true.",
"ru": "Паранепротиворечивая логика и «Science and Partial Truth»: можно здраво рассуждать при противоречивых данных, а теории бывают частично истинны.",
"de": "Parakonsistente Logik und „Science and Partial Truth“."
},
"rule": "When sources contradict, do not conclude anything at all from the contradiction; mark the point as contested and reason around it.",
"needs": {
"code": "covered",
"note": "applied together with Dunn: check_headline marks contradictory sources as 'both' (sources_agree)",
"covered_by": "frankfurt"
}
},
{
"id": "lolli",
"name": "Gabriele Lolli",
"name_ru": "Габриэле Лолли",
"years": "1942–2025",
"wiki": "https://it.wikipedia.org/wiki/Gabriele_Lolli",
"zone": "one_model",
"idea": {
"en": "Foundations of mathematics; a view of science beyond realism and relativism.",
"ru": "Основания математики; взгляд на науку за пределами реализма и релятивизма.",
"de": "Grundlagen der Mathematik; Wissenschaft jenseits von Realismus und Relativismus."
},
"rule": "Avoid both 'the model is reality' and 'every view is equally valid'.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "parrini",
"name": "Paolo Parrini",
"name_ru": "Паоло Паррини",
"years": "1943–2020",
"wiki": "https://it.wikipedia.org/wiki/Paolo_Parrini",
"zone": "rumour_vs_fact",
"idea": {
"en": "Epistemology without dogmas ('Una filosofia senza dogmi', 'Conoscenza e realtà').",
"ru": "Эпистемология без догм («Una filosofia senza dogmi», «Conoscenza e realtà»).",
"de": "Erkenntnistheorie ohne Dogmen."
},
"rule": "Hold no source as beyond question, including the ones you usually trust.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "torretti",
"name": "Roberto Torretti",
"name_ru": "Роберто Торретти",
"years": "1930–2022",
"wiki": "https://es.wikipedia.org/wiki/Roberto_Torretti",
"zone": "rumour_vs_fact",
"idea": {
"en": "Philosophy of science and the Dictionary of Logic and Philosophy of Science.",
"ru": "Философия науки и «Словарь логики и философии науки».",
"de": "Wissenschaftsphilosophie und Wörterbuch der Logik."
},
"rule": "Define your key terms before you argue with them.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "alsina",
"name": "Claudi Alsina",
"name_ru": "Клауди Алсина",
"years": "1952–2025",
"wiki": "https://es.wikipedia.org/wiki/Claudi_Alsina_Catal%C3%A0",
"zone": "measurement_error",
"idea": {
"en": "Functional equations, fuzzy logic and the mathematics of measurement; popularisation of mathematics.",
"ru": "Функциональные уравнения, нечёткая логика и математика измерений; популяризация математики.",
"de": "Funktionalgleichungen, Fuzzy-Logik und Mathematik des Messens."
},
"rule": "Some quantities are a matter of degree; give the degree instead of forcing yes or no.",
"needs": {
"code": "covered",
"note": "the Hagenauer sensor already keeps the degree of each label instead of yes or no",
"covered_by": "hagenauer"
}
},
{
"id": "perez_jimenez",
"name": "Mario de Jesús Pérez Jiménez",
"name_ru": "Марио Перес Хименес",
"years": "1948–2025",
"wiki": "https://es.wikipedia.org/wiki/Mario_de_Jes%C3%BAs_P%C3%A9rez_Jim%C3%A9nez",
"zone": "answer_cost",
"idea": {
"en": "Membrane computing (P systems); founder of the Natural Computing group in Seville.",
"ru": "Мембранные вычисления (P-системы); основатель группы естественных вычислений в Севилье.",
"de": "Membranrechnen (P-Systeme), Gruppe Natural Computing in Sevilla."
},
"rule": "Many small parallel checks can be cheaper than one large sequential one.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "gambarelli",
"name": "Gianfranco Gambarelli",
"name_ru": "Джанфранко Гамбарелли",
"years": "1946–2026",
"wiki": "https://it.wikipedia.org/wiki/Gianfranco_Gambarelli",
"zone": "side_effects",
"idea": {
"en": "Game theory and decision methods (power indices, friend of John Nash).",
"ru": "Теория игр и методы принятия решений (индексы силы; друг Джона Нэша).",
"de": "Spieltheorie und Entscheidungsmethoden (Machtindizes)."
},
"rule": "When several actors decide, weigh who can actually tip the outcome.",
"needs": {
"code": "covered",
"note": "the Howard sensor already weighs when more information pays off",
"covered_by": "howard"
}
},
{
"id": "elmasri",
"name": "Ramez Elmasri",
"name_ru": "Рамез Эльмасри",
"years": "1950–2022",
"wiki": "https://ar.wikipedia.org/wiki/%D8%B1%D8%A7%D9%85%D8%B2_%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A",
"zone": "stale_data",
"idea": {
"en": "Database systems ('Fundamentals of Database Systems') and temporal databases that keep several versions of the data at once.",
"ru": "Системы баз данных («Fundamentals of Database Systems») и временные базы, где одновременно хранятся несколько версий данных.",
"de": "Datenbanksysteme und temporale Datenbanken mit mehreren Datenversionen."
},
"rule": "Keep the version and time of the data you quote; yesterday's record and today's may both be 'the record'.",
"needs": {
"code": "needs_history",
"note": "the same version history as Rinne: Orb Studio keeps first and later values of each sensor number since 23.11.2026",
"not_before": "2026-12-21"
}
},
{
"id": "wang_peizhuang",
"name": "Wang Peizhuang",
"name_ru": "Ван Пэйчжуан",
"years": "1936–2025",
"wiki": "https://zh.wikipedia.org/wiki/%E6%B1%AA%E5%9F%B9%E5%BA%84",
"zone": "one_model",
"idea": {
"en": "Fuzzy mathematics in China: working with concepts that have no sharp boundaries.",
"ru": "Нечёткая математика в Китае: как работать с понятиями без чётких границ.",
"de": "Fuzzy-Mathematik in China: Begriffe ohne scharfe Grenzen."
},
"rule": "Some categories have no sharp edge; say how strongly something belongs, not only whether it does.",
"needs": {
"code": "covered",
"note": "the Hagenauer sensor already keeps the degree of each label instead of yes or no",
"covered_by": "hagenauer"
}
},
{
"id": "al_hasadi",
"name": "Najib al-Hasadi",
"name_ru": "Наджиб аль-Хасади",
"years": "1952–2025",
"wiki": "https://ar.wikipedia.org/wiki/%D9%86%D8%AC%D9%8A%D8%A8_%D8%A7%D9%84%D8%AD%D8%B5%D8%A7%D8%AF%D9%8A",
"zone": "rumour_vs_fact",
"idea": {
"en": "Libyan philosopher of critical thinking: 'Doubting the sanctity of science', 'The book of fallacies', 'Sensors of critical thinking'.",
"ru": "Ливийский философ критического мышления: «Сомнение в святости науки», «Книга заблуждений», «Датчики критического мышления».",
"de": "Libyscher Philosoph des kritischen Denkens."
},
"rule": "Question even the claims that come wrapped in the authority of science, and name the fallacy when you see one.",
"needs": {
"code": "covered",
"note": "the Frankfurt and Park sensors already work as 'sensors of critical thinking' on the headlines",
"covered_by": "frankfurt"
}
},
{
"id": "ning_jinsheng",
"name": "Ning Jinsheng",
"name_ru": "Нин Цзиньшэн",
"years": "1932–2020",
"wiki": "https://zh.wikipedia.org/wiki/%E5%AE%81%E6%B4%A5%E7%94%9F",
"zone": "measurement_error",
"idea": {
"en": "Geodesy: precise measurement of the Earth and its reference frames.",
"ru": "Геодезия: точные измерения Земли и её систем отсчёта.",
"de": "Geodäsie: präzise Vermessung der Erde und ihrer Bezugssysteme."
},
"rule": "A position or a number means nothing without its reference frame; state it.",
"needs": {
"code": "covered",
"note": "the Baird sensor already gives every number its reference: source, time and unit",
"covered_by": "baird"
}
},
{
"id": "rosenblatt",
"name": "Murray Rosenblatt",
"name_ru": "Мюррей Розенблатт",
"years": "1926–2019",
"wiki": "https://en.wikipedia.org/wiki/Murray_Rosenblatt",
"zone": "stale_data",
"idea": {
"en": "Time-series analysis, spectral estimation and kernel density estimation.",
"ru": "Анализ временных рядов, спектральные оценки и ядерные оценки плотности.",
"de": "Zeitreihenanalyse, Spektral- und Kerndichteschätzung."
},
"rule": "Look for regular cycles in a series before treating a swing as news.",
"needs": {
"code": "covered",
"note": "the Duckworth sensor already compares with the same time of day",
"covered_by": "duckworth"
}
},
{
"id": "benzecri",
"name": "Jean-Paul Benzécri",
"name_ru": "Жан-Поль Бензекри",
"years": "1932–2019",
"wiki": "https://fr.wikipedia.org/wiki/Jean-Paul_Benz%C3%A9cri",
"zone": "one_model",
"idea": {
"en": "Data analysis 'from the data, not from the model': correspondence analysis.",
"ru": "Анализ данных «от данных, а не от модели»: корреспондентный анализ.",
"de": "Datenanalyse „aus den Daten, nicht aus dem Modell“: Korrespondenzanalyse."
},
"rule": "Let the data show its structure before you impose a model on it.",
"needs": {
"code": "covered",
"note": "the Simpson sensor already lets the per-radar structure show before the total",
"covered_by": "simpson"
}
},
{
"id": "gruenbaum",
"name": "Adolf Grünbaum",
"name_ru": "Адольф Грюнбаум",
"years": "1923–2018",
"wiki": "https://en.wikipedia.org/wiki/Adolf_Gr%C3%BCnbaum",
"zone": "rumour_vs_fact",
"idea": {
"en": "Critique of psychoanalysis and of Popper: what makes a theory actually testable.",
"ru": "Критика психоанализа и Поппера: что делает теорию действительно проверяемой.",
"de": "Kritik der Psychoanalyse und Poppers: was eine Theorie prüfbar macht."
},
"rule": "Ask what observation would count against a claim; if none would, it is not being tested.",
"needs": {
"code": "covered",
"note": "the Park and Frankfurt sensors already ask whether a claim gives anything to test",
"covered_by": "frankfurt"
}
},
{
"id": "gayon",
"name": "Jean Gayon",
"name_ru": "Жан Гайон",
"years": "1949–2018",
"wiki": "https://fr.wikipedia.org/wiki/Jean_Gayon",
"zone": "rumour_vs_fact",
"idea": {
"en": "History and philosophy of science, especially of biology and heredity.",
"ru": "История и философия науки, особенно биологии и наследственности.",
"de": "Geschichte und Philosophie der Wissenschaft, besonders der Biologie."
},
"rule": "Know the history of a scientific claim: how it was disputed and how it settled.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "casari",
"name": "Ettore Casari",
"name_ru": "Этторе Казари",
"years": "1933–2019",
"wiki": "https://it.wikipedia.org/wiki/Ettore_Casari",
"zone": "rumour_vs_fact",
"idea": {
"en": "'La matematica della verità': logic and the mathematics of truth.",
"ru": "«La matematica della verità»: логика и математика истины.",
"de": "„La matematica della verità“: Logik und Mathematik der Wahrheit."
},
"rule": "Keep 'true' for what is shown, and 'plausible' for what only seems so.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "wuketits",
"name": "Franz M. Wuketits",
"name_ru": "Франц Вукетиц",
"years": "1955–2018",
"wiki": "https://en.wikipedia.org/wiki/Franz_M._Wuketits",
"zone": "rumour_vs_fact",
"idea": {
"en": "Evolutionary epistemology: our ways of knowing were shaped by evolution and carry its biases.",
"ru": "Эволюционная эпистемология: наши способы познания сформированы эволюцией и несут её искажения.",
"de": "Evolutionäre Erkenntnistheorie."
},
"rule": "Expect your intuitions to favour vivid and threatening stories; correct for it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "turzeniecka",
"name": "Danuta Turzeniecka",
"name_ru": "Данута Туженецка",
"years": "1931–2018",
"wiki": "https://pl.wikipedia.org/wiki/Danuta_Turzeniecka",
"zone": "measurement_error",
"idea": {
"en": "Metrology and the evaluation of measurement uncertainty.",
"ru": "Метрология и оценка неопределённости измерений.",
"de": "Messtechnik und Bewertung der Messunsicherheit."
},
"rule": "Report a measurement with its uncertainty, or do not compare it.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units, sources and cross-checks",
"covered_by": "baird"
}
},
{
"id": "altman",
"name": "Doug Altman",
"name_ru": "Дуг Альтман",
"years": "1948–2018",
"wiki": "https://en.wikipedia.org/wiki/Doug_Altman",
"zone": "measurement_error",
"idea": {
"en": "Reliability of statistics in research and reporting standards; 'absence of evidence is not evidence of absence'.",
"ru": "Надёжность статистики в исследованиях и стандарты отчётности; «отсутствие доказательств — не доказательство отсутствия».",
"de": "Verlässlichkeit von Statistik in der Forschung."
},
"rule": "'No evidence found' is not 'shown not to exist'; say which one you have.",
"needs": {
"code": "covered",
"note": "check_headline already tells 'neither' (no information) from 'denied'",
"covered_by": "frankfurt"
}
},
{
"id": "lawrence_brown",
"name": "Lawrence D. Brown",
"name_ru": "Лоуренс Браун",
"years": "1940–2018",
"wiki": "https://en.wikipedia.org/wiki/Lawrence_D._Brown",
"zone": "answer_cost",
"idea": {
"en": "Statistical decision theory and minimax rules: choose the action whose worst case is least bad.",
"ru": "Статистическая теория решений и минимакс: выбирать действие с наименее плохим худшим случаем.",
"de": "Statistische Entscheidungstheorie und Minimax."
},
"rule": "When the cost of being wrong is high, pick the answer whose worst case you can live with.",
"needs": {
"code": "covered",
"note": "the Howard sensor already weighs waiting against being wrong",
"covered_by": "howard"
}
},
{
"id": "kalinichenko",
"name": "Leonid Kalinichenko",
"name_ru": "Леонид Калиниченко",
"years": "1937–2018",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%BA%D0%BE%2C_%D0%9B%D0%B5%D0%BE%D0%BD%D0%B8%D0%B4_%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2%D0%B8%D1%87",
"zone": "stale_data",
"idea": {
"en": "Integration of heterogeneous databases: bringing different sources to one consistent picture.",
"ru": "Как сводить вместе разнородные базы данных в одну согласованную картину.",
"de": "Integration heterogener Datenbanken."
},
"rule": "Before merging data from two sources, align their definitions, units and times.",
"needs": {
"code": "covered",
"note": "the Baird sensor already aligns units, sources and cross-checks",
"covered_by": "baird"
}
},
{
"id": "basharin",
"name": "Gely Basharin",
"name_ru": "Гелий Башарин",
"years": "1927–2018",
"wiki": "https://ru.wikipedia.org/wiki/%D0%91%D0%B0%D1%88%D0%B0%D1%80%D0%B8%D0%BD%2C_%D0%93%D0%B5%D0%BB%D0%B8%D0%B9_%D0%9F%D0%B0%D0%B2%D0%BB%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "stale_data",
"idea": {
"en": "Queueing theory and delays in telecommunication networks.",
"ru": "Теория очередей и задержек в сетях связи.",
"de": "Warteschlangen und Verzögerungen in Netzen."
},
"rule": "Every relay in a chain adds delay; estimate how old the news is by the time it reaches you.",
"needs": {
"code": "covered",
"note": "the Mikrin sensor already measures delays from source to air",
"covered_by": "mikrin"
}
},
{
"id": "pospelov",
"name": "Dmitry Pospelov",
"name_ru": "Дмитрий Поспелов",
"years": "1932–2019",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D1%81%D0%BF%D0%B5%D0%BB%D0%BE%D0%B2%2C_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "one_model",
"idea": {
"en": "One of the founders of Soviet artificial intelligence: situational control and fuzzy systems — act on the recognised situation, not on one fixed model.",
"ru": "Один из отцов советского искусственного интеллекта: ситуационное управление и нечёткие системы — действовать по распознанной ситуации, а не по одной жёсткой модели.",
"de": "Mitbegründer der sowjetischen KI: situative Steuerung und Fuzzy-Systeme."
},
"rule": "First classify the situation you are in, then choose the rule that fits it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "palyutin",
"name": "Evgeny Palyutin",
"name_ru": "Евгений Палютин",
"years": "1945–2018",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9F%D0%B0%D0%BB%D1%8E%D1%82%D0%B8%D0%BD%2C_%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2%D0%B8%D1%87",
"zone": "one_model",
"idea": {
"en": "Model theory: the same axioms can have many different models.",
"ru": "Теория моделей: у одних и тех же аксиом бывает много разных моделей.",
"de": "Modelltheorie: dieselben Axiome haben viele Modelle."
},
"rule": "The same description can fit several different situations; check which one you face.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already reports bounds over model choices",
"covered_by": "leamer"
}
},
{
"id": "minlos",
"name": "Robert Minlos",
"name_ru": "Роберт Минлос",
"years": "1931–2018",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9C%D0%B8%D0%BD%D0%BB%D0%BE%D1%81%2C_%D0%A0%D0%BE%D0%B1%D0%B5%D1%80%D1%82_%D0%90%D0%B4%D0%BE%D0%BB%D1%8C%D1%84%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "one_model",
"idea": {
"en": "Statistical physics and random fields: global order arising from many local random interactions.",
"ru": "Статистическая физика и случайные поля: общий порядок из множества местных случайных взаимодействий.",
"de": "Statistische Physik und Zufallsfelder."
},
"rule": "A pattern across many sources can arise from local noise; check it before calling it a trend.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates noise from real shifts",
"covered_by": "polyak"
}
},
{
"id": "stepin",
"name": "Vyacheslav Stepin",
"name_ru": "Вячеслав Стёпин",
"years": "1934–2018",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D1%91%D0%BF%D0%B8%D0%BD%2C_%D0%92%D1%8F%D1%87%D0%B5%D1%81%D0%BB%D0%B0%D0%B2_%D0%A1%D0%B5%D0%BC%D1%91%D0%BD%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "rumour_vs_fact",
"idea": {
"en": "The structure of a scientific theory and types of scientific rationality (classical, non-classical, post-non-classical).",
"ru": "Как устроена научная теория и какие бывают типы научной рациональности (классический, неклассический, постнеклассический).",
"de": "Struktur wissenschaftlicher Theorien und Typen der Rationalität."
},
"rule": "Say which kind of evidence a claim rests on: observation, theory or expert consensus.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "ivin",
"name": "Alexander Ivin",
"name_ru": "Александр Ивин",
"years": "1939–2018",
"wiki": "https://ru.wikipedia.org/wiki/%D0%98%D0%B2%D0%B8%D0%BD%2C_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80_%D0%90%D1%80%D1%85%D0%B8%D0%BF%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "rumour_vs_fact",
"idea": {
"en": "Theory of argumentation and the logic of evaluations: an evaluation ('good', 'bad') is not a statement of fact.",
"ru": "Теория аргументации и логика оценок: оценка («хорошо», «плохо») — не утверждение о факте.",
"de": "Argumentationstheorie und Logik der Bewertungen."
},
"rule": "Separate the facts in a headline from the evaluation wrapped around them.",
"needs": {
"code": "covered",
"note": "the Searle sensor already separates events from claims and other acts",
"covered_by": "searle"
}
},
{
"id": "rakitov",
"name": "Anatoly Rakitov",
"name_ru": "Анатолий Ракитов",
"years": "1928–2019",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A0%D0%B0%D0%BA%D0%B8%D1%82%D0%BE%D0%B2%2C_%D0%90%D0%BD%D0%B0%D1%82%D0%BE%D0%BB%D0%B8%D0%B9_%D0%98%D0%BB%D1%8C%D0%B8%D1%87",
"zone": "rumour_vs_fact",
"idea": {
"en": "Information epistemology: knowledge in a society where information is produced and traded at scale.",
"ru": "«Информационная эпистемология»: знание в обществе, где информацию производят и продают в огромных объёмах.",
"de": "Informationelle Erkenntnistheorie."
},
"rule": "More information is not more knowledge; ask what a source adds that others do not.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "popovich",
"name": "Myroslav Popovych",
"name_ru": "Мирослав Попович",
"years": "1930–2018",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BF%D0%BE%D0%B2%D0%B8%D1%87%2C_%D0%9C%D0%B8%D1%80%D0%BE%D1%81%D0%BB%D0%B0%D0%B2_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "rumour_vs_fact",
"idea": {
"en": "Logic and methodology of science (Kyiv school).",
"ru": "Логика и методология науки (киевская школа).",
"de": "Logik und Methodologie der Wissenschaft (Kiewer Schule)."
},
"rule": "State the method by which a conclusion was reached.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "kovalenko",
"name": "Igor Kovalenko",
"name_ru": "Игорь Коваленко",
"years": "1935–2019",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%B2%D0%B0%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE%2C_%D0%98%D0%B3%D0%BE%D1%80%D1%8C_%D0%9D%D0%B8%D0%BA%D0%BE%D0%BB%D0%B0%D0%B5%D0%B2%D0%B8%D1%87",
"zone": "measurement_error",
"idea": {
"en": "Reliability theory and the analysis of rare events.",
"ru": "Теория надёжности и анализ редких событий.",
"de": "Zuverlässigkeitstheorie und seltene Ereignisse."
},
"rule": "A rare event that has not happened in your data is not impossible; say how much data you have.",
"needs": {
"code": "covered",
"note": "the Hamilton sensor already shows what fails or is postponed",
"covered_by": "hamilton"
}
},
{
"id": "golshtein",
"name": "Evgeny Golshtein",
"name_ru": "Евгений Гольштейн",
"years": "1931–2018",
"wiki": "https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D0%BB%D1%8C%D1%88%D1%82%D0%B5%D0%B9%D0%BD%2C_%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B8%D1%87",
"zone": "answer_cost",
"idea": {
"en": "Mathematical programming and duality theory.",
"ru": "Математическое программирование и теория двойственности.",
"de": "Mathematische Programmierung und Dualitätstheorie."
},
"rule": "Every limit you work under has a price; ask what relaxing it would gain.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already gives the cheapest chains of calls",
"covered_by": "bertsekas"
}
},
{
"id": "uspensky",
"name": "Vladimir Uspensky",
"name_ru": "Владимир Успенский",
"years": "1930–2018",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A3%D1%81%D0%BF%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%2C_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2%D0%B8%D1%87",
"zone": "answer_cost",
"idea": {
"en": "Theory of algorithms and Kolmogorov complexity (a student of Kolmogorov).",
"ru": "Теория алгоритмов и колмогоровская сложность (ученик Колмогорова).",
"de": "Algorithmentheorie und Kolmogorow-Komplexität."
},
"rule": "The shortest faithful description is usually the best answer.",
"needs": {
"code": "covered",
"note": "the Ziv sensor already measures information by compression",
"covered_by": "ziv"
}
},
{
"id": "boltyansky",
"name": "Vladimir Boltyansky",
"name_ru": "Владимир Болтянский",
"years": "1925–2019",
"wiki": "https://ru.wikipedia.org/wiki/%D0%91%D0%BE%D0%BB%D1%82%D1%8F%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%2C_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B8%D1%87",
"zone": "answer_cost",
"idea": {
"en": "Co-author of the maximum principle of optimal control (with Pontryagin, Gamkrelidze, Mishchenko).",
"ru": "Соавтор принципа максимума в теории оптимального управления (с Понтрягиным, Гамкрелидзе, Мищенко).",
"de": "Mitautor des Maximumprinzips der optimalen Steuerung."
},
"rule": "Choose each step by its effect on the whole path to the goal.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already gives the cheapest chains of calls",
"covered_by": "bertsekas"
}
},
{
"id": "raessler",
"name": "Susanne Rässler",
"name_ru": "Сюзанне Ресслер",
"years": "1962–2018",
"wiki": "https://de.wikipedia.org/wiki/Susanne_R%C3%A4ssler",
"zone": "stale_data",
"idea": {
"en": "Statistical matching and multiple imputation: filling gaps in data and combining different sources honestly.",
"ru": "Статистическое сопоставление и множественное заполнение пропусков: честно сводить разные источники и заполнять пробелы.",
"de": "Statistisches Matching und multiple Imputation."
},
"rule": "When you fill a gap in the data, say that it was filled and how uncertain the filled value is.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already reports gaps and silent feeds",
"covered_by": "lyberg"
}
},
{
"id": "manna",
"name": "Zohar Manna",
"name_ru": "Зохар Манна",
"years": "1939–2018",
"wiki": "https://de.wikipedia.org/wiki/Zohar_Manna",
"zone": "stale_data",
"idea": {
"en": "Temporal logic and verification of systems that change over time (with Amir Pnueli).",
"ru": "Временная логика и проверка систем, которые меняются во времени (вместе с Амиром Пнуэли).",
"de": "Temporallogik und Verifikation zeitabhängiger Systeme."
},
"rule": "A statement that was true at one step may be false at the next; check it at the step you report.",
"needs": {
"code": "covered",
"note": "the Cox and Hagenauer sensors already show the age of stories and when labels go stale",
"covered_by": "cox"
}
},
{
"id": "bucy",
"name": "Richard S. Bucy",
"name_ru": "Ричард Бьюси",
"years": "1935–2019",
"wiki": "https://de.wikipedia.org/wiki/Richard_S._Bucy",
"zone": "stale_data",
"idea": {
"en": "The Kalman–Bucy filter: updating an estimate continuously from fresh noisy measurements.",
"ru": "Фильтр Калмана–Бьюси: как непрерывно обновлять оценку по свежим шумным измерениям.",
"de": "Kalman-Bucy-Filter."
},
"rule": "Blend each new noisy reading with your current estimate in proportion to how reliable each is.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already smooths the indices against noise",
"covered_by": "polyak"
}
},
{
"id": "hampel",
"name": "Frank Hampel",
"name_ru": "Франк Хампель",
"years": "1941–2018",
"wiki": "https://de.wikipedia.org/wiki/Frank_Hampel",
"zone": "one_model",
"idea": {
"en": "Robust statistics and the influence function: how much a single outlier or a wrong model can move a conclusion.",
"ru": "Робастная статистика и функция влияния: насколько один выброс или неверная модель могут сдвинуть вывод.",
"de": "Robuste Statistik und Einflussfunktion."
},
"rule": "Check how far your conclusion moves if you drop the single most extreme data point.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already shows how far an index moves without each radar or word",
"covered_by": "leamer"
}
},
{
"id": "troelstra",
"name": "Anne Troelstra",
"name_ru": "Анне Трулстра",
"years": "1939–2019",
"wiki": "https://de.wikipedia.org/wiki/Anne_Troelstra",
"zone": "one_model",
"idea": {
"en": "Intuitionistic logic: a claim counts as true only when it is constructed or proven, not just because its opposite was not proven.",
"ru": "Интуиционистская логика: утверждение считается верным, только когда оно построено или доказано, а не потому, что не доказано обратное.",
"de": "Intuitionistische Logik."
},
"rule": "'Not disproved' is not 'proved'; keep a third answer: not settled.",
"needs": {
"code": "covered",
"note": "check_headline already keeps 'neither' apart from 'denied' (sources_agree)",
"covered_by": "frankfurt"
}
},
{
"id": "hoering",
"name": "Walter Hoering",
"name_ru": "Вальтер Хёринг",
"years": "1933–2019",
"wiki": "https://de.wikipedia.org/wiki/Walter_Hoering",
"zone": "rumour_vs_fact",
"idea": {
"en": "Logic and philosophy of science.",
"ru": "Логика и теория науки.",
"de": "Logik und Wissenschaftstheorie."
},
"rule": "Show the logical step from the evidence to the claim.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "detlefsen",
"name": "Michael Detlefsen",
"name_ru": "Майкл Детлефсен",
"years": "1948–2019",
"wiki": "https://de.wikipedia.org/wiki/Michael_Detlefsen",
"zone": "rumour_vs_fact",
"idea": {
"en": "Philosophy of mathematics: what a proof actually establishes and for whom.",
"ru": "Философия математики: что именно устанавливает доказательство и для кого.",
"de": "Philosophie der Mathematik."
},
"rule": "Say what your argument proves and what it leaves open.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "harre",
"name": "Rom Harré",
"name_ru": "Ром Харре",
"years": "1927–2019",
"wiki": "https://de.wikipedia.org/wiki/Rom_Harr%C3%A9",
"zone": "rumour_vs_fact",
"idea": {
"en": "Philosophy of science: explanation by real causal powers and mechanisms, not only by regularities.",
"ru": "Теория науки: объяснение через реальные причинные силы и механизмы, а не только через закономерности.",
"de": "Wissenschaftstheorie: Erklärung durch Kausalkräfte."
},
"rule": "A regular pattern is not yet an explanation; name the mechanism or say it is unknown.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "pfanzagl",
"name": "Johann Pfanzagl",
"name_ru": "Иоганн Пфанцагль",
"years": "1928–2019",
"wiki": "https://de.wikipedia.org/wiki/Johann_Pfanzagl",
"zone": "measurement_error",
"idea": {
"en": "'Theory of Measurement': when numbers assigned to things are meaningful, and which operations on them make sense.",
"ru": "«Theory of Measurement»: когда числа, присвоенные вещам, имеют смысл и какие действия с ними допустимы.",
"de": "„Theory of Measurement“."
},
"rule": "Do only the arithmetic the scale allows: an index of 60 is not 'twice as' 30.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and scales",
"covered_by": "baird"
}
},
{
"id": "busch",
"name": "Paul Busch",
"name_ru": "Пауль Буш",
"years": "1955–2018",
"wiki": "https://de.wikipedia.org/wiki/Paul_Busch_(Physiker)",
"zone": "measurement_error",
"idea": {
"en": "Quantum theory of measurement: a measurement can disturb what it measures.",
"ru": "Квантовая теория измерения: измерение может возмущать то, что оно меряет.",
"de": "Quantentheorie der Messung."
},
"rule": "Ask whether watching or reporting a thing changes it (a published index can move the market it describes).",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "winograd",
"name": "Shmuel Winograd",
"name_ru": "Шмуэль Виноград",
"years": "1936–2019",
"wiki": "https://de.wikipedia.org/wiki/Shmuel_Winograd",
"zone": "answer_cost",
"idea": {
"en": "Complexity of computation: the minimum number of operations a task needs (Winograd's algorithms for fast multiplication and FFT).",
"ru": "Сложность вычислений: наименьшее число операций для задачи (алгоритмы Винограда для быстрого умножения и БПФ).",
"de": "Komplexität: minimale Operationszahl (Winograd-Algorithmen)."
},
"rule": "Find the fewest steps that still answer the question fully.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already gives the cheapest chains of calls",
"covered_by": "bertsekas"
}
},
{
"id": "guddat",
"name": "Jürgen Guddat",
"name_ru": "Юрген Гуддат",
"years": "1941–2018",
"wiki": "https://de.wikipedia.org/wiki/J%C3%BCrgen_Guddat",
"zone": "answer_cost",
"idea": {
"en": "Parametric optimisation: how the best solution changes when the conditions change.",
"ru": "Параметрическая оптимизация: как меняется лучшее решение, когда меняются условия.",
"de": "Parametrische Optimierung."
},
"rule": "Say under which conditions your recommendation would change.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already gives the cheapest chains of calls",
"covered_by": "bertsekas"
}
},
{
"id": "skala",
"name": "Heinz J. Skala",
"name_ru": "Хайнц Скала",
"years": "1942–2019",
"wiki": "https://de.wikipedia.org/wiki/Heinz_J._Skala",
"zone": "answer_cost",
"idea": {
"en": "Decision theory under uncertainty.",
"ru": "Теория решений в условиях неопределённости.",
"de": "Entscheidungstheorie unter Unsicherheit."
},
"rule": "Separate what you know, what you estimate and what you simply do not know.",
"needs": {
"code": "covered",
"note": "the Howard sensor already weighs when more information pays off",
"covered_by": "howard"
}
},
{
"id": "kalman",
"name": "Rudolf E. Kálmán",
"name_ru": "Рудольф Калман",
"years": "1930–2016",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D0%BB%D1%8C%D0%BC%D0%B0%D0%BD%2C_%D0%A0%D1%83%D0%B4%D0%BE%D0%BB%D1%8C%D1%84",
"zone": "stale_data",
"idea": {
"en": "The Kalman filter: update an estimate with each new measurement, weighting it by how noisy it is.",
"ru": "Фильтр Калмана: обновлять оценку с каждым новым измерением, взвешивая его по тому, насколько оно шумное.",
"de": "Kalman-Filter: Schätzung mit jeder neuen Messung aktualisieren, gewichtet nach ihrem Rauschen."
},
"rule": "Do not replace your estimate with the latest noisy reading, and do not ignore it: blend them by reliability.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already separates a one-off jump from a lasting shift in noisy indices",
"covered_by": "polyak"
}
},
{
"id": "forrester",
"name": "Jay W. Forrester",
"name_ru": "Джей Форрестер",
"years": "1918–2016",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A4%D0%BE%D1%80%D1%80%D0%B5%D1%81%D1%82%D0%B5%D1%80%2C_%D0%94%D0%B6%D0%B5%D0%B9",
"zone": "stale_data",
"idea": {
"en": "System dynamics: delays and feedback loops make the picture in the head lag behind the real state of the system.",
"ru": "Системная динамика: задержки и обратные связи заставляют картину в голове отставать от реального состояния системы.",
"de": "Systemdynamik: Verzögerungen und Rückkopplungen lassen das Bild im Kopf dem echten Zustand hinterherhinken."
},
"rule": "Say how old your picture of the system is and which delays sit between the event and your data.",
"needs": {
"code": "covered",
"note": "the Baird sensor already gives the age of every published number",
"covered_by": "baird"
}
},
{
"id": "zadeh",
"name": "Lotfi A. Zadeh",
"name_ru": "Лотфи Заде",
"years": "1921–2017",
"wiki": "https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%B4%D0%B5%2C_%D0%9B%D0%BE%D1%82%D1%84%D0%B8",
"zone": "one_model",
"idea": {
"en": "Fuzzy logic: membership comes in degrees, not only yes or no.",
"ru": "Нечёткая логика: принадлежность бывает по степеням, а не только «да» или «нет».",
"de": "Fuzzy-Logik: Zugehörigkeit hat Grade, nicht nur ja oder nein."
},
"rule": "Keep the degree: 'tense at 0.55' is not the same as 'tense'.",
"needs": {
"code": "covered",
"note": "the Hagenauer sensor already keeps the degree instead of rounding labels to yes or no",
"covered_by": "hagenauer"
}
},
{
"id": "karpenko",
"name": "Alexander S. Karpenko",
"name_ru": "Александр Карпенко",
"years": "1946–2017",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D1%80%D0%BF%D0%B5%D0%BD%D0%BA%D0%BE%2C_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80_%D0%A1%D1%82%D0%B5%D0%BF%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "one_model",
"idea": {
"en": "Many-valued logics: true and false are not the only possible values of a statement.",
"ru": "Многозначные логики: «истина» и «ложь» — не единственные возможные значения утверждения.",
"de": "Mehrwertige Logiken: wahr und falsch sind nicht die einzigen Werte einer Aussage."
},
"rule": "Allow more than two answers: true, false, contested, unknown.",
"needs": {
"code": "covered",
"note": "check_headline already returns four values: affirmed, denied, both, neither (sources_agree)",
"covered_by": "frankfurt"
}
},
{
"id": "bershtein",
"name": "Leonid S. Bershtein",
"name_ru": "Леонид Берштейн",
"years": "1941–2015",
"wiki": "https://ru.wikipedia.org/wiki/%D0%91%D0%B5%D1%80%D1%88%D1%82%D0%B5%D0%B9%D0%BD%2C_%D0%9B%D0%B5%D0%BE%D0%BD%D0%B8%D0%B4_%D0%A1%D0%B0%D0%BC%D0%BE%D0%B9%D0%BB%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "one_model",
"idea": {
"en": "Intelligent systems that decide with incomplete and fuzzy data.",
"ru": "Интеллектуальные системы, которые принимают решения при неполных и нечётких данных.",
"de": "Intelligente Systeme, die mit unvollständigen und unscharfen Daten entscheiden."
},
"rule": "When data are incomplete, say which part is missing and decide only as far as the rest allows.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "hintikka",
"name": "Jaakko Hintikka",
"name_ru": "Яакко Хинтикка",
"years": "1929–2015",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A5%D0%B8%D0%BD%D1%82%D0%B8%D0%BA%D0%BA%D0%B0%2C_%D0%AF%D0%B0%D0%BA%D0%BA%D0%BE",
"zone": "own_limits",
"idea": {
"en": "Epistemic logic: 'knows that' and 'believes that' are different; inquiry as asking the right questions.",
"ru": "Эпистемическая логика: «знает, что» и «считает, что» — разные вещи; поиск как задавание правильных вопросов.",
"de": "Epistemische Logik: „weiß, dass“ und „glaubt, dass“ sind verschieden; Forschung als Stellen der richtigen Fragen."
},
"rule": "Mark whether you know a thing or only believe it, and which question would turn belief into knowledge.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "voevodsky",
"name": "Vladimir Voevodsky",
"name_ru": "Владимир Воеводский",
"years": "1966–2017",
"wiki": "https://ru.wikipedia.org/wiki/%D0%92%D0%BE%D0%B5%D0%B2%D0%BE%D0%B4%D1%81%D0%BA%D0%B8%D0%B9%2C_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "rumour_vs_fact",
"idea": {
"en": "Univalent foundations: proofs checked by a computer, because even experts' proofs contain unnoticed errors.",
"ru": "Унивалентные основания: доказательства, которые проверяет компьютер, потому что и в доказательствах экспертов бывают незамеченные ошибки.",
"de": "Univalente Grundlagen: computergeprüfte Beweise, weil auch Beweise von Fachleuten unbemerkte Fehler enthalten."
},
"rule": "Do not trust an argument because of who made it; check it mechanically where you can.",
"needs": {
"code": "covered",
"note": "the Rabin sensor already re-checks random published headlines against their sources",
"covered_by": "rabin"
}
},
{
"id": "pushkin",
"name": "Sergey B. Pushkin",
"name_ru": "Сергей Пушкин",
"years": "1925–2015",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD%2C_%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B9_%D0%91%D0%BE%D1%80%D0%B8%D1%81%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "measurement_error",
"idea": {
"en": "Keeper of the state time standard (1967–2011): every clock is only as good as its chain back to the standard.",
"ru": "Хранитель государственного эталона времени (1967–2011): любые часы точны лишь настолько, насколько надёжна их цепочка до эталона.",
"de": "Hüter des staatlichen Zeitnormals (1967–2011): jede Uhr ist nur so gut wie ihre Kette zum Normal."
},
"rule": "Give a time or a number together with the source it was set against.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces every number to its source and time",
"covered_by": "baird"
}
},
{
"id": "trakhtenbrot",
"name": "Boris Trakhtenbrot",
"name_ru": "Борис Трахтенброт",
"years": "1921–2016",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A2%D1%80%D0%B0%D1%85%D1%82%D0%B5%D0%BD%D0%B1%D1%80%D0%BE%D1%82%2C_%D0%91%D0%BE%D1%80%D0%B8%D1%81_%D0%90%D0%B2%D1%80%D0%B0%D0%B0%D0%BC%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "own_limits",
"idea": {
"en": "Limits of algorithms: some questions cannot be decided by any algorithm, and others only at a huge cost.",
"ru": "Пределы алгоритмов: на некоторые вопросы не ответит никакой алгоритм, на другие — только ценой огромных затрат.",
"de": "Grenzen der Algorithmen: manche Fragen kann kein Algorithmus entscheiden, andere nur mit riesigem Aufwand."
},
"rule": "Before searching, ask whether the question can be settled at all with the data you can reach.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "sigal",
"name": "Izrail Kh. Sigal",
"name_ru": "Израиль Сигал",
"years": "1938–2016",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A1%D0%B8%D0%B3%D0%B0%D0%BB%2C_%D0%98%D0%B7%D1%80%D0%B0%D0%B8%D0%BB%D1%8C_%D0%A5%D0%B0%D0%B8%D0%BC%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "answer_cost",
"idea": {
"en": "Operations research: solving large discrete optimisation problems approximately and with bounded effort.",
"ru": "Исследование операций: приближённое решение больших дискретных задач оптимизации с ограниченными затратами.",
"de": "Operations Research: große diskrete Optimierungsprobleme näherungsweise mit begrenztem Aufwand lösen."
},
"rule": "A good answer within budget beats a perfect one that is too expensive; say how far from optimal it may be.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already gives the cheapest chains of calls",
"covered_by": "bertsekas"
}
},
{
"id": "arrow",
"name": "Kenneth Arrow",
"name_ru": "Кеннет Эрроу",
"years": "1921–2017",
"wiki": "https://ru.wikipedia.org/wiki/%D0%AD%D1%80%D1%80%D0%BE%D1%83%2C_%D0%9A%D0%B5%D0%BD%D0%BD%D0%B5%D1%82",
"zone": "answer_cost",
"idea": {
"en": "Impossibility theorem and the economics of information: no voting rule is perfect, and information has a price and a value.",
"ru": "Теорема о невозможности и экономика информации: идеального правила голосования нет, а у информации есть цена и ценность.",
"de": "Unmöglichkeitssatz und Informationsökonomie: keine Abstimmungsregel ist perfekt, Information hat Preis und Wert."
},
"rule": "Pay for more information only when it can change the decision.",
"needs": {
"code": "covered",
"note": "the Howard sensor already weighs when more information pays off",
"covered_by": "howard"
}
},
{
"id": "levenshtein",
"name": "Vladimir Levenshtein",
"name_ru": "Владимир Левенштейн",
"years": "1935–2017",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9B%D0%B5%D0%B2%D0%B5%D0%BD%D1%88%D1%82%D0%B5%D0%B9%D0%BD%2C_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%98%D0%BE%D1%81%D0%B8%D1%84%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "look_alike",
"idea": {
"en": "Edit distance: how many single-letter changes turn one text into another — finds duplicates and misspelt names.",
"ru": "Расстояние редактирования: сколько замен букв превращают один текст в другой — находит дубли и имена с опечатками.",
"de": "Editierdistanz: wie viele Buchstabenänderungen einen Text in einen anderen verwandeln – findet Dubletten und vertippte Namen."
},
"rule": "Two headlines that differ by a few letters are one story, not two confirmations.",
"needs": {
"code": "covered",
"note": "applied: check_headline now merges headlines that differ only by typos, other transliteration or small rewrites (independent_voices, why = typo_or_small_rewrite)"
}
},
{
"id": "freivalds",
"name": "Rūsiņš Freivalds",
"name_ru": "Русиньш Фрейвалдс",
"years": "1942–2016",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A4%D1%80%D0%B5%D0%B9%D0%B2%D0%B0%D0%BB%D0%B4%D1%81%2C_%D0%A0%D1%83%D1%81%D0%B8%D0%BD%D1%8C%D1%88_%D0%9C%D0%B0%D1%80%D1%82%D1%8B%D0%BD%D1%8C%D1%88",
"zone": "measurement_error",
"idea": {
"en": "Freivalds' algorithm: checking an answer at random is much cheaper than computing it again.",
"ru": "Алгоритм Фрейвалдса: случайная проверка ответа намного дешевле, чем повторное вычисление.",
"de": "Freivalds-Algorithmus: eine zufällige Prüfung der Antwort ist viel billiger als neu zu rechnen."
},
"rule": "Spot-check a random sample of your results instead of trusting all or recomputing all.",
"needs": {
"code": "covered",
"note": "the Rabin sensor already spot-checks a random sample instead of all",
"covered_by": "rabin"
}
},
{
"id": "minsky",
"name": "Marvin Minsky",
"name_ru": "Марвин Минский",
"years": "1927–2016",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9C%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%2C_%D0%9C%D0%B0%D1%80%D0%B2%D0%B8%D0%BD_%D0%9B%D0%B8",
"zone": "one_model",
"idea": {
"en": "'The Society of Mind': intelligence as a community of simple agents that disagree and negotiate.",
"ru": "«Общество разума»: интеллект как сообщество простых агентов, которые спорят и договариваются.",
"de": "„The Society of Mind“: Intelligenz als Gemeinschaft einfacher Agenten, die streiten und verhandeln."
},
"rule": "Let different parts or models check each other instead of trusting a single voice.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "fodor",
"name": "Jerry Fodor",
"name_ru": "Джерри Фодор",
"years": "1935–2017",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A4%D0%BE%D0%B4%D0%BE%D1%80%2C_%D0%94%D0%B6%D0%B5%D1%80%D1%80%D0%B8_%D0%90%D0%BB%D0%B0%D0%BD",
"zone": "rumour_vs_fact",
"idea": {
"en": "Modularity of mind and the language of thought: meaning lies beneath the surface of the words.",
"ru": "Модульность ума и язык мысли: смысл лежит под поверхностью слов.",
"de": "Modularität des Geistes und Sprache des Denkens: Bedeutung liegt unter der Oberfläche der Wörter."
},
"rule": "Do not judge a text by its surface words alone; ask what it actually claims.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "takacs",
"name": "Lajos Takács",
"name_ru": "Лайош Такач",
"years": "1924–2015",
"wiki": "https://de.wikipedia.org/wiki/Lajos_Tak%C3%A1cs",
"zone": "stale_data",
"idea": {
"en": "Queueing theory and random processes: how long items wait in line before they are served.",
"ru": "Теория очередей и случайных процессов: сколько заявки ждут в очереди, прежде чем их обработают.",
"de": "Warteschlangentheorie und stochastische Prozesse."
},
"rule": "Count the waiting time in each queue between the event and your answer.",
"needs": {
"code": "covered",
"note": "the Mikrin sensor already measures how long news waits on each step to the air",
"covered_by": "mikrin"
}
},
{
"id": "gottwald",
"name": "Siegfried Gottwald",
"name_ru": "Зигфрид Готтвальд",
"years": "1943–2015",
"wiki": "https://de.wikipedia.org/wiki/Siegfried_Gottwald",
"zone": "one_model",
"idea": {
"en": "Fuzzy sets and many-valued logic.",
"ru": "Нечёткие множества и многозначная логика.",
"de": "Unscharfe Mengen und mehrwertige Logik."
},
"rule": "Keep degrees of truth instead of forcing every label to yes or no.",
"needs": {
"code": "covered",
"note": "the Hagenauer sensor already keeps degrees instead of rounding labels",
"covered_by": "hagenauer"
}
},
{
"id": "weichselberger",
"name": "Kurt Weichselberger",
"name_ru": "Курт Вайхзельбергер",
"years": "1929–2016",
"wiki": "https://de.wikipedia.org/wiki/Kurt_Weichselberger",
"zone": "one_model",
"idea": {
"en": "Interval probability: when knowledge is thin, give a probability range, not one exact number.",
"ru": "Интервальная вероятность: когда знаний мало, давай диапазон вероятности, а не одно точное число.",
"de": "Intervallwahrscheinlichkeit: bei dünnem Wissen eine Spanne statt einer exakten Zahl."
},
"rule": "With little data, report a lower and an upper probability.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already gives bounds instead of one number; the track record sensor gives intervals",
"covered_by": "leamer"
}
},
{
"id": "vopenka",
"name": "Petr Vopěnka",
"name_ru": "Петр Вопенка",
"years": "1935–2015",
"wiki": "https://de.wikipedia.org/wiki/Petr_Vop%C4%9Bnka",
"zone": "one_model",
"idea": {
"en": "Alternative set theory: the same reality can be described by different foundations.",
"ru": "Альтернативная теория множеств: одну и ту же реальность можно описать на разных основаниях.",
"de": "Alternative Mengenlehre."
},
"rule": "Name the framework your answer depends on.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "janich",
"name": "Peter Janich",
"name_ru": "Петер Яних",
"years": "1942–2016",
"wiki": "https://de.wikipedia.org/wiki/Peter_Janich",
"zone": "rumour_vs_fact",
"idea": {
"en": "Methodical constructivism: science built up from the procedures of measuring and doing.",
"ru": "Методический конструктивизм: наука, выстроенная от процедур измерения и действия.",
"de": "Methodischer Konstruktivismus."
},
"rule": "Say how a claim was obtained, not only what it says.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "kanitscheider",
"name": "Bernulf Kanitscheider",
"name_ru": "Бернульф Канитшайдер",
"years": "1939–2017",
"wiki": "https://de.wikipedia.org/wiki/Bernulf_Kanitscheider",
"zone": "rumour_vs_fact",
"idea": {
"en": "Philosophy of science and naturalism.",
"ru": "Теория науки и натурализм.",
"de": "Wissenschaftstheorie und Naturalismus."
},
"rule": "Prefer claims that can be tested in the world.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "putnam",
"name": "Hilary Putnam",
"name_ru": "Хилари Патнэм",
"years": "1926–2016",
"wiki": "https://de.wikipedia.org/wiki/Hilary_Putnam",
"zone": "rumour_vs_fact",
"idea": {
"en": "Scientific realism and philosophy of language: what words refer to is fixed partly by the world and by experts, not by the speaker alone.",
"ru": "Научный реализм и философия языка: на что указывают слова, определяют отчасти мир и эксперты, а не только говорящий.",
"de": "Wissenschaftlicher Realismus und Sprachphilosophie."
},
"rule": "When a term is technical, check what the experts mean by it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "gy",
"name": "Pierre Gy",
"name_ru": "Пьер Жи",
"years": "1924–2015",
"wiki": "https://de.wikipedia.org/wiki/Pierre_Gy",
"zone": "measurement_error",
"idea": {
"en": "Theory of sampling: from a mixed, uneven mass a small sample gives a biased picture unless it is taken correctly.",
"ru": "Теория отбора проб: из неоднородной массы маленькая проба даёт искажённую картину, если её взять неправильно.",
"de": "Probenahmetheorie."
},
"rule": "Ask how the sample was taken from an uneven whole before trusting it.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already reports coverage gaps of the feed; Trevisan shows how many headlines are enough",
"covered_by": "lyberg"
}
},
{
"id": "rottlaender",
"name": "Rolf C. A. Rottländer",
"name_ru": "Рольф Роттлендер",
"years": "1932–2016",
"wiki": "https://de.wikipedia.org/wiki/Rolf_C._A._Rottl%C3%A4nder",
"zone": "look_alike",
"idea": {
"en": "Ancient units of length: the same unit name meant different lengths in different places.",
"ru": "Античные меры длины: одно и то же название меры означало разную длину в разных местах.",
"de": "Antike Längenmaße."
},
"rule": "Check which definition of a unit a source uses.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and scales",
"covered_by": "baird"
}
},
{
"id": "mueller_merbach",
"name": "Heiner Müller-Merbach",
"name_ru": "Хайнер Мюллер-Мербах",
"years": "1936–2015",
"wiki": "https://de.wikipedia.org/wiki/Heiner_M%C3%BCller-Merbach",
"zone": "answer_cost",
"idea": {
"en": "Operations research and its use in management.",
"ru": "Исследование операций и его применение в управлении.",
"de": "Operations Research."
},
"rule": "Choose the cheapest procedure that still gives a usable answer.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already gives the cheapest chains of calls",
"covered_by": "bertsekas"
}
},
{
"id": "krabs",
"name": "Werner Krabs",
"name_ru": "Вернер Крабс",
"years": "1934–2017",
"wiki": "https://de.wikipedia.org/wiki/Werner_Krabs",
"zone": "side_effects",
"idea": {
"en": "Optimal control and game theory.",
"ru": "Оптимальное управление и теория игр.",
"de": "Optimale Steuerung und Spieltheorie."
},
"rule": "Plan the sequence of steps, not only the next one.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "garfield",
"name": "Eugene Garfield",
"name_ru": "Юджин Гарфилд",
"years": "1925–2017",
"wiki": "https://de.wikipedia.org/wiki/Eugene_Garfield",
"zone": "rumour_vs_fact",
"idea": {
"en": "Science Citation Index: who cites whom shows how a claim spread and which sources it rests on.",
"ru": "Индекс научного цитирования: кто кого цитирует, показывает, как распространилось утверждение и на какие источники оно опирается.",
"de": "Science Citation Index."
},
"rule": "Follow the citation back to the original source.",
"needs": {
"code": "needs_source",
"note": "a citation graph for news sources would be needed"
}
},
{
"id": "dahlberg",
"name": "Ingetraut Dahlberg",
"name_ru": "Ингетраут Дальберг",
"years": "1927–2017",
"wiki": "https://de.wikipedia.org/wiki/Ingetraut_Dahlberg",
"zone": "answer_cost",
"idea": {
"en": "Universal classification of knowledge: subject headings and thesauri instead of flat search.",
"ru": "Универсальная классификация знаний: рубрики и тезаурусы вместо плоского поиска.",
"de": "Universale Wissensklassifikation."
},
"rule": "Narrow the question to the right category before searching.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "dreyfus",
"name": "Hubert Dreyfus",
"name_ru": "Хьюберт Дрейфус",
"years": "1929–2017",
"wiki": "https://de.wikipedia.org/wiki/Hubert_Dreyfus",
"zone": "own_limits",
"idea": {
"en": "Critique of AI: a formal model is not the same as real skill and understanding.",
"ru": "Критика ИИ: формальная модель — не то же самое, что настоящее умение и понимание.",
"de": "KI-Kritik: ein formales Modell ist nicht dasselbe wie echtes Können."
},
"rule": "Do not mistake a fluent formal answer for real competence; say where your model ends.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "robinson",
"name": "John Alan Robinson",
"name_ru": "Джон Алан Робинсон",
"years": "1930–2016",
"wiki": "https://de.wikipedia.org/wiki/John_Alan_Robinson",
"zone": "rumour_vs_fact",
"idea": {
"en": "The resolution principle: the basis of automated logical reasoning.",
"ru": "Метод резолюции: основа автоматического логического вывода.",
"de": "Resolutionsprinzip."
},
"rule": "Make each step of a conclusion explicit so it can be checked.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "wille",
"name": "Rudolf Wille",
"name_ru": "Рудольф Вилле",
"years": "1937–2017",
"wiki": "https://de.wikipedia.org/wiki/Rudolf_Wille",
"zone": "look_alike",
"idea": {
"en": "Formal concept analysis: concepts as sets of objects that share sets of attributes.",
"ru": "Формальный анализ понятий: понятия как множества объектов с общими признаками.",
"de": "Formale Begriffsanalyse."
},
"rule": "Define a category by the features its members share.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "henrichs",
"name": "Norbert Henrichs",
"name_ru": "Норберт Хенрихс",
"years": "1935–2016",
"wiki": "https://de.wikipedia.org/wiki/Norbert_Henrichs",
"zone": "answer_cost",
"idea": {
"en": "Text indexing without a fixed vocabulary.",
"ru": "Индексация текстов без заданного словаря.",
"de": "Textindexierung ohne festes Vokabular."
},
"rule": "Index by the words the texts actually use.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "malinvaud",
"name": "Edmond Malinvaud",
"name_ru": "Эдмон Маленво",
"years": "1923–2015",
"wiki": "https://it.wikipedia.org/wiki/Edmond_Malinvaud",
"zone": "one_model",
"idea": {
"en": "Econometrics and disequilibrium: statistical models of the economy hold only within limits, and markets need not clear.",
"ru": "Эконометрика и неравновесие: статистические модели экономики верны лишь в своих пределах, а рынки не обязаны приходить в равновесие.",
"de": "Ökonometrie und Ungleichgewicht: Modelle gelten nur in ihren Grenzen."
},
"rule": "State the conditions under which your model holds, and what happens outside them.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "marquard",
"name": "Odo Marquard",
"name_ru": "Одо Марквард",
"years": "1928–2015",
"wiki": "https://it.wikipedia.org/wiki/Odo_Marquard",
"zone": "one_model",
"idea": {
"en": "Scepticism and pluralism: distrust single theories that claim the whole truth; keep several interpretations.",
"ru": "Скептицизм и плюрализм: не доверять единым теориям, претендующим на всю истину; держать несколько толкований.",
"de": "Skepsis und Pluralismus gegenüber Theorien mit Anspruch auf die ganze Wahrheit."
},
"rule": "Offer at least one other reading before settling on yours.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "maris",
"name": "Bernard Maris",
"name_ru": "Бернар Мари",
"years": "1946–2015",
"wiki": "https://it.wikipedia.org/wiki/Bernard_Maris",
"zone": "one_model",
"idea": {
"en": "Critique of economic dogma: blind trust in closed macro models and market forecasts.",
"ru": "Критика экономического догматизма: слепая вера в закрытые макромодели и рыночные прогнозы.",
"de": "Kritik am ökonomischen Dogmatismus und blindem Vertrauen in Marktprognosen."
},
"rule": "Do not present a forecast as a fact; say whose model it is.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "montagna",
"name": "Franco Montagna",
"name_ru": "Франко Монтанья",
"years": "1948–2015",
"wiki": "https://it.wikipedia.org/wiki/Franco_Montagna",
"zone": "rumour_vs_fact",
"idea": {
"en": "Provability logic, many-valued logics of uncertainty and the foundations of subjective probability.",
"ru": "Логика доказуемости, многозначные логики неопределённости и основания субъективной вероятности.",
"de": "Beweisbarkeitslogik, mehrwertige Logiken und subjektive Wahrscheinlichkeit."
},
"rule": "Separate 'proven', 'probable' and 'believed'.",
"needs": {
"code": "covered",
"note": "check_headline already keeps affirmed, denied, both and neither apart (sources_agree)",
"covered_by": "frankfurt"
}
},
{
"id": "bruel",
"name": "Per V. Brüel",
"name_ru": "Пер Вильгельм Брюэль",
"years": "1915–2015",
"wiki": "https://it.wikipedia.org/wiki/Per_Vilhelm_Br%C3%BCel",
"zone": "measurement_error",
"idea": {
"en": "Precision acoustics and vibration measurement (co-founder of Brüel & Kjær): instruments must be calibrated to be trusted.",
"ru": "Прецизионные измерения звука и вибраций (сооснователь Brüel & Kjær): прибору можно верить, только если он откалиброван.",
"de": "Präzisionsmessung von Schall und Schwingungen (Brüel & Kjær)."
},
"rule": "Ask when the instrument behind a number was last calibrated.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces every number to its source and checks it against independent paths",
"covered_by": "baird"
}
},
{
"id": "matousek",
"name": "Jiří Matoušek",
"name_ru": "Иржи Матоушек",
"years": "1963–2015",
"wiki": "https://it.wikipedia.org/wiki/Ji%C5%99%C3%AD_Matou%C5%A1ek_(matematico)",
"zone": "answer_cost",
"idea": {
"en": "Computational geometry and approximation: a small well-chosen sample can stand in for a huge set with bounded error.",
"ru": "Вычислительная геометрия и аппроксимация: маленькая хорошо выбранная выборка может заменить огромное множество с ограниченной ошибкой.",
"de": "Algorithmische Geometrie: eine kleine gut gewählte Stichprobe ersetzt eine riesige Menge mit begrenztem Fehler."
},
"rule": "Use a small representative sample and state the error bound.",
"needs": {
"code": "covered",
"note": "the Trevisan sensor already shows how many headlines are enough for the barometer",
"covered_by": "trevisan"
}
},
{
"id": "nash",
"name": "John F. Nash",
"name_ru": "Джон Нэш",
"years": "1928–2015",
"wiki": "https://it.wikipedia.org/wiki/John_Nash",
"zone": "side_effects",
"idea": {
"en": "Nash equilibrium: in strategic situations the best move depends on what others do in response.",
"ru": "Равновесие Нэша: в стратегической ситуации лучший ход зависит от ответных ходов других.",
"de": "Nash-Gleichgewicht: der beste Zug hängt von den Antworten der anderen ab."
},
"rule": "Before recommending a move, consider how the other side will respond.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "beck",
"name": "Ulrich Beck",
"name_ru": "Ульрих Бек",
"years": "1944–2015",
"wiki": "https://it.wikipedia.org/wiki/Ulrich_Beck",
"zone": "side_effects",
"idea": {
"en": "Risk society: modern decisions produce side effects and system risks no single actor foresees.",
"ru": "Общество риска: современные решения порождают побочные эффекты и системные риски, которых не предвидит ни один участник.",
"de": "Risikogesellschaft: Entscheidungen erzeugen Nebenfolgen und Systemrisiken."
},
"rule": "Name the side effects of an action, not only its intended effect.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "lamfalussy",
"name": "Alexandre Lamfalussy",
"name_ru": "Александр Ламфалусси",
"years": "1929–2015",
"wiki": "https://it.wikipedia.org/wiki/Alexandre_Lamfalussy",
"zone": "measurement_error",
"idea": {
"en": "Macroprudential view: look for fragility of the whole system before a crisis, not only at each institution.",
"ru": "Макропруденциальный подход: искать хрупкость всей системы до кризиса, а не только у каждого участника по отдельности.",
"de": "Makroprudenzielle Sicht: Fragilität des Gesamtsystems vor der Krise suchen."
},
"rule": "Check the whole system, not only its parts one by one.",
"needs": {
"code": "covered",
"note": "the Simpson sensor already checks whether the whole index and its radars move the same way",
"covered_by": "simpson"
}
},
{
"id": "schelling",
"name": "Thomas Schelling",
"name_ru": "Томас Шеллинг",
"years": "1921–2016",
"wiki": "https://en.wikipedia.org/wiki/Thomas_Schelling",
"zone": "side_effects",
"idea": {
"en": "'Micromotives and Macrobehavior' and focal points: individually sensible small choices add up to large effects nobody intended, and expectations shape what others do.",
"ru": "«Микромотивы и макроповедение» и фокальные точки: разумные по отдельности маленькие решения складываются в большие последствия, которых никто не хотел, а ожидания меняют поведение других.",
"de": "„Micromotives and Macrobehavior“ und Fokalpunkte: kleine vernünftige Einzelentscheidungen ergeben große, ungewollte Folgen."
},
"rule": "Ask what happens when many agents follow the same advice at once.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "naur",
"name": "Peter Naur",
"name_ru": "Петер Наур",
"years": "1928–2016",
"wiki": "https://en.wikipedia.org/wiki/Peter_Naur",
"zone": "own_limits",
"idea": {
"en": "'Programming as Theory Building': the real program is the theory in the developers' heads; code and documents without that theory cannot be safely changed.",
"ru": "«Программирование как построение теории»: настоящая программа — это теория в головах разработчиков; код и документы без этой теории нельзя безопасно менять.",
"de": "„Programming as Theory Building“: das eigentliche Programm ist die Theorie in den Köpfen der Entwickler."
},
"rule": "Before changing something you did not build, say what you do not know about why it is the way it is.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "zeeman",
"name": "Christopher Zeeman",
"name_ru": "Кристофер Зиман",
"years": "1925–2016",
"wiki": "https://en.wikipedia.org/wiki/Christopher_Zeeman",
"zone": "one_model",
"idea": {
"en": "Catastrophe theory: smooth changes in conditions can cause sudden jumps in the state of a system.",
"ru": "Теория катастроф: плавное изменение условий может вызвать скачок в состоянии системы.",
"de": "Katastrophentheorie: glatte Änderungen der Bedingungen können plötzliche Sprünge auslösen."
},
"rule": "Do not assume a straight line: say where a small change could flip the outcome.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already tells a one-off jump from a lasting shift",
"covered_by": "polyak"
}
},
{
"id": "eco",
"name": "Umberto Eco",
"name_ru": "Умберто Эко",
"years": "1932–2016",
"wiki": "https://en.wikipedia.org/wiki/Umberto_Eco",
"zone": "look_alike",
"idea": {
"en": "Semiotics and the limits of interpretation: a text allows many readings, but not any reading.",
"ru": "Семиотика и пределы интерпретации: текст допускает много прочтений, но не любое.",
"de": "Semiotik und Grenzen der Interpretation: ein Text erlaubt viele Lesarten, aber nicht jede."
},
"rule": "Offer readings the text supports, and say which ones it does not.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "shapley",
"name": "Lloyd Shapley",
"name_ru": "Ллойд Шепли",
"years": "1923–2016",
"wiki": "https://en.wikipedia.org/wiki/Lloyd_Shapley",
"zone": "one_model",
"idea": {
"en": "The Shapley value: a fair way to share the result among the participants who produced it together (the basis of SHAP explanations in AI).",
"ru": "Вектор Шепли: справедливый способ разделить результат между участниками, которые добились его вместе (основа объяснений SHAP в ИИ).",
"de": "Shapley-Wert: faire Aufteilung eines gemeinsamen Ergebnisses (Grundlage von SHAP)."
},
"rule": "When several causes act together, give each its share instead of naming one.",
"needs": {
"code": "covered",
"note": "the Halpern sensor already names the headlines that moved an index",
"covered_by": "halpern"
}
},
{
"id": "mackay",
"name": "David J. C. MacKay",
"name_ru": "Дэвид Маккей",
"years": "1967–2016",
"wiki": "https://en.wikipedia.org/wiki/David_J._C._MacKay",
"zone": "measurement_error",
"idea": {
"en": "Information theory, Bayesian inference and 'Sustainable Energy – without the hot air': check claims by putting honest numbers with units on them.",
"ru": "Теория информации, байесовский вывод и «Устойчивая энергия — без пустых слов»: проверять утверждения, подставляя честные числа с единицами.",
"de": "Informationstheorie, Bayes und „Sustainable Energy – without the hot air“: Behauptungen mit ehrlichen Zahlen prüfen."
},
"rule": "Put a number with a unit on a claim and compare it with the right scale.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and scales of every number",
"covered_by": "baird"
}
},
{
"id": "golomb",
"name": "Solomon W. Golomb",
"name_ru": "Соломон Голомб",
"years": "1932–2016",
"wiki": "https://en.wikipedia.org/wiki/Solomon_W._Golomb",
"zone": "answer_cost",
"idea": {
"en": "Golomb codes and shift-register sequences: short codes for frequent values.",
"ru": "Коды Голомба и последовательности регистров сдвига: короткие коды для частых значений.",
"de": "Golomb-Codes und Schieberegisterfolgen."
},
"rule": "Give the frequent answer short and spend words only on the unusual.",
"needs": {
"code": "covered",
"note": "the Ziv sensor already measures how much is new versus repeated",
"covered_by": "ziv"
}
},
{
"id": "toffler",
"name": "Alvin Toffler",
"name_ru": "Элвин Тоффлер",
"years": "1928–2016",
"wiki": "https://en.wikipedia.org/wiki/Alvin_Toffler",
"zone": "answer_cost",
"idea": {
"en": "'Future Shock': information overload — too much change and information too fast overwhelms decisions.",
"ru": "«Шок будущего»: информационная перегрузка — слишком много перемен и информации слишком быстро мешают принимать решения.",
"de": "„Der Zukunftsschock“: Informationsüberlastung."
},
"rule": "Give less, but what matters: cut the answer to what the reader can use.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already measures answer size in tokens and the cheapest chains",
"covered_by": "bertsekas"
}
},
{
"id": "suppes",
"name": "Patrick Suppes",
"name_ru": "Патрик Суппес",
"years": "1922–2014",
"wiki": "https://en.wikipedia.org/wiki/Patrick_Suppes",
"zone": "measurement_error",
"idea": {
"en": "'Foundations of Measurement' and probabilistic causality: when qualitative observations can be turned into numbers on a scale.",
"ru": "«Основания измерения» и вероятностная причинность: когда качественные наблюдения можно честно перевести в числа на шкале.",
"de": "„Foundations of Measurement“ und probabilistische Kausalität."
},
"rule": "Before turning an impression into a number, say what scale it is on.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces units and scales",
"covered_by": "baird"
}
},
{
"id": "fillmore",
"name": "Charles J. Fillmore",
"name_ru": "Чарльз Филлмор",
"years": "1929–2014",
"wiki": "https://en.wikipedia.org/wiki/Charles_J._Fillmore",
"zone": "look_alike",
"idea": {
"en": "Frame semantics (FrameNet): the meaning of a word depends on the situation frame and the roles in it.",
"ru": "Фреймовая семантика (FrameNet): значение слова зависит от фрейма ситуации и ролей её участников.",
"de": "Frame-Semantik (FrameNet): Wortbedeutung hängt vom Situationsrahmen ab."
},
"rule": "The same word in a different situation may mean a different thing; check the frame.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "lowe",
"name": "E. J. Lowe",
"name_ru": "Э. Дж. Лоу",
"years": "1950–2014",
"wiki": "https://en.wikipedia.org/wiki/E._J._Lowe",
"zone": "look_alike",
"idea": {
"en": "Criteria of identity: having the same properties is not the same as being one and the same thing.",
"ru": "Критерии тождества: иметь одинаковые свойства — не то же самое, что быть одним и тем же предметом.",
"de": "Identitätskriterien: gleiche Eigenschaften sind nicht dasselbe wie numerische Identität."
},
"rule": "Two matching descriptions may still be two different things; name the criterion you use.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "hall",
"name": "Stuart Hall",
"name_ru": "Стюарт Холл",
"years": "1932–2014",
"wiki": "https://en.wikipedia.org/wiki/Stuart_Hall_(cultural_theorist)",
"zone": "side_effects",
"idea": {
"en": "Encoding/decoding: the receiver reads a message through their own codes, so what is meant and what is understood can differ.",
"ru": "Кодирование и декодирование: получатель читает сообщение через свои коды, и задуманное может разойтись с понятым.",
"de": "Kodieren/Dekodieren: der Empfänger liest eine Botschaft mit eigenen Codes."
},
"rule": "Ask how different readers will understand your answer, not only what you meant.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "coase",
"name": "Ronald Coase",
"name_ru": "Рональд Коуз",
"years": "1910–2013",
"wiki": "https://en.wikipedia.org/wiki/Ronald_Coase",
"zone": "side_effects",
"idea": {
"en": "Transaction costs and the Coase theorem: side effects on others (externalities) and the cost of arranging things decide how problems get solved.",
"ru": "Транзакционные издержки и теорема Коуза: побочные эффекты для других (экстерналии) и цена договорённости определяют, как решаются проблемы.",
"de": "Transaktionskosten und Coase-Theorem: Externalitäten und Verhandlungskosten."
},
"rule": "Name who else bears the cost of an action.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "box",
"name": "George E. P. Box",
"name_ru": "Джордж Бокс",
"years": "1919–2013",
"wiki": "https://en.wikipedia.org/wiki/George_E._P._Box",
"zone": "one_model",
"idea": {
"en": "'All models are wrong, but some are useful'; Box–Jenkins time-series models: check a model by what it leaves unexplained.",
"ru": "«Все модели неверны, но некоторые полезны»; модели Бокса — Дженкинса: проверяй модель по тому, что она оставляет необъяснённым.",
"de": "„Alle Modelle sind falsch, aber manche sind nützlich“; Box-Jenkins."
},
"rule": "Say what your model is useful for and where it is wrong.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already shows how far an index depends on the model choices",
"covered_by": "leamer"
}
},
{
"id": "lindley",
"name": "Dennis Lindley",
"name_ru": "Деннис Линдли",
"years": "1923–2013",
"wiki": "https://en.wikipedia.org/wiki/Dennis_Lindley",
"zone": "own_limits",
"idea": {
"en": "Coherent Bayesian decisions: degrees of belief must fit together, and never put probability zero or one on what you are not sure of (Cromwell's rule).",
"ru": "Когерентные байесовские решения: степени уверенности должны сходиться между собой, и нельзя ставить вероятность ноль или один тому, в чём не уверен (правило Кромвеля).",
"de": "Kohärente Bayes-Entscheidungen; Cromwells Regel: nie 0 oder 1 ohne Gewissheit."
},
"rule": "Do not state certainty you do not have: keep a little probability for being wrong.",
"needs": {
"code": "covered",
"note": "applied: the forecast game scores agents by the Brier rule (honest_confidence_30d in get_prediction), so overclaiming certainty costs"
}
},
{
"id": "buchanan",
"name": "James M. Buchanan",
"name_ru": "Джеймс Бьюкенен",
"years": "1919–2013",
"wiki": "https://en.wikipedia.org/wiki/James_M._Buchanan",
"zone": "side_effects",
"idea": {
"en": "Public choice: those who make rules act on their own incentives too, so rules have effects their designers did not announce.",
"ru": "Теория общественного выбора: те, кто пишет правила, тоже действуют по своим стимулам, поэтому у правил бывают последствия, которых авторы не объявляли.",
"de": "Public Choice: auch Regelmacher folgen eigenen Anreizen."
},
"rule": "Ask whose incentives a rule or a recommendation serves.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "fogel",
"name": "Robert Fogel",
"name_ru": "Роберт Фогель",
"years": "1926–2013",
"wiki": "https://en.wikipedia.org/wiki/Robert_Fogel",
"zone": "one_model",
"idea": {
"en": "Cliometrics and the counterfactual: measure a cause by asking what would have happened without it.",
"ru": "Клиометрика и контрфактический анализ: измерять причину вопросом, что было бы без неё.",
"de": "Kliometrie und kontrafaktische Analyse."
},
"rule": "Before calling something a cause, say what would have happened without it.",
"needs": {
"code": "covered",
"note": "the Halpern sensor already asks what the index would be without each headline",
"covered_by": "halpern"
}
},
{
"id": "klein",
"name": "Lawrence Klein",
"name_ru": "Лоуренс Клейн",
"years": "1920–2013",
"wiki": "https://en.wikipedia.org/wiki/Lawrence_Klein",
"zone": "one_model",
"idea": {
"en": "Large macro-econometric models (Klein–Goldberger, Project LINK): forecasts depend on the structure the model assumes.",
"ru": "Большие макроэконометрические модели (Клейна — Голдбергера, проект LINK): прогноз зависит от структуры, которую закладывает модель.",
"de": "Makroökonometrische Modelle (Klein-Goldberger, LINK)."
},
"rule": "Say which model a forecast comes from and what it assumes.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "geach",
"name": "Peter Geach",
"name_ru": "Питер Гич",
"years": "1916–2013",
"wiki": "https://en.wikipedia.org/wiki/Peter_Geach",
"zone": "look_alike",
"idea": {
"en": "Relative identity: 'the same' is only meaningful relative to a kind — the same word, the same edition, the same author.",
"ru": "Относительное тождество: «то же самое» имеет смысл только относительно рода — то же слово, то же издание, тот же автор.",
"de": "Relative Identität: „dasselbe“ nur bezüglich einer Art."
},
"rule": "When you say 'the same', say the same what.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "ostrom",
"name": "Elinor Ostrom",
"name_ru": "Элинор Остром",
"years": "1933–2012",
"wiki": "https://en.wikipedia.org/wiki/Elinor_Ostrom",
"zone": "side_effects",
"idea": {
"en": "'Governing the Commons': shared resources can be managed by their users with clear rules, monitoring and graduated sanctions.",
"ru": "«Управляя общим»: общими ресурсами могут управлять сами пользователи — с ясными правилами, наблюдением и постепенными санкциями.",
"de": "„Die Verfassung der Allmende“: Selbstverwaltung gemeinsamer Ressourcen."
},
"rule": "When many agents use one shared resource, show how one use affects the others.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "thurston",
"name": "William Thurston",
"name_ru": "Уильям Тёрстон",
"years": "1946–2012",
"wiki": "https://en.wikipedia.org/wiki/William_Thurston",
"zone": "own_limits",
"idea": {
"en": "'On Proof and Progress in Mathematics': a formal proof is not the same as understanding; understanding is what is passed on.",
"ru": "«О доказательстве и прогрессе в математике»: формальное доказательство — ещё не понимание; передаётся именно понимание.",
"de": "„On Proof and Progress in Mathematics“: Beweis ist nicht Verstehen."
},
"rule": "A correct-looking chain of steps is not understanding; say what you actually grasp.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "barcan_marcus",
"name": "Ruth Barcan Marcus",
"name_ru": "Рут Баркан Маркус",
"years": "1921–2012",
"wiki": "https://en.wikipedia.org/wiki/Ruth_Barcan_Marcus",
"zone": "look_alike",
"idea": {
"en": "Quantified modal logic and direct reference: a proper name points to its object directly, whatever descriptions change.",
"ru": "Кванторная модальная логика и прямая референция: имя собственное указывает на объект напрямую, как бы ни менялись описания.",
"de": "Quantifizierte Modallogik und direkte Referenz."
},
"rule": "Tie a claim to the named person or thing, not to a description that may fit someone else.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "hirschman",
"name": "Albert O. Hirschman",
"name_ru": "Альберт Хиршман",
"years": "1915–2012",
"wiki": "https://en.wikipedia.org/wiki/Albert_O._Hirschman",
"zone": "side_effects",
"idea": {
"en": "'Exit, Voice, and Loyalty' and 'The Rhetoric of Reaction': how people respond when quality declines, and how arguments about unintended effects are used.",
"ru": "«Выход, голос и верность» и «Риторика реакции»: как люди отвечают на ухудшение качества и как используют доводы о непреднамеренных последствиях.",
"de": "„Abwanderung und Widerspruch“ und „Denken gegen die Zukunft“."
},
"rule": "Ask whether people will leave or complain, and check claims of unintended effects instead of repeating them.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "feferman",
"name": "Solomon Feferman",
"name_ru": "Соломон Феферман",
"years": "1928–2016",
"wiki": "https://en.wikipedia.org/wiki/Solomon_Feferman",
"zone": "own_limits",
"idea": {
"en": "Proof theory: what a formal system can and cannot prove about itself.",
"ru": "Теория доказательств: что формальная система может и чего не может доказать о самой себе.",
"de": "Beweistheorie: was ein formales System über sich selbst beweisen kann."
},
"rule": "Do not use your own reasoning as the only proof that your reasoning is sound.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "smullyan",
"name": "Raymond Smullyan",
"name_ru": "Рэймонд Смаллиан",
"years": "1919–2017",
"wiki": "https://en.wikipedia.org/wiki/Raymond_Smullyan",
"zone": "own_limits",
"idea": {
"en": "'Forever Undecided': incompleteness and what a reasoner can know about its own beliefs.",
"ru": "«Forever Undecided»: неполнота и то, что рассуждающий может знать о собственных убеждениях.",
"de": "„Forever Undecided“: Unvollständigkeit und was ein Denkender über eigene Überzeugungen wissen kann."
},
"rule": "Some questions about yourself you cannot settle from inside; say so instead of guessing.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "takeuti",
"name": "Gaisi Takeuti",
"name_ru": "Гайси Такэути",
"years": "1926–2017",
"wiki": "https://en.wikipedia.org/wiki/Gaisi_Takeuti",
"zone": "own_limits",
"idea": {
"en": "Proof theory and the consistency of mathematical systems.",
"ru": "Теория доказательств и непротиворечивость математических систем.",
"de": "Beweistheorie und Widerspruchsfreiheit."
},
"rule": "State what your conclusion rests on and what would have to hold for it to be sound.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "rogers",
"name": "Hartley Rogers Jr.",
"name_ru": "Хартли Роджерс-младший",
"years": "1926–2015",
"wiki": "https://en.wikipedia.org/wiki/Hartley_Rogers_Jr.",
"zone": "own_limits",
"idea": {
"en": "Theory of computability: which problems can be solved by any algorithm at all.",
"ru": "Теория вычислимости: какие задачи вообще может решить алгоритм.",
"de": "Berechenbarkeitstheorie."
},
"rule": "Check whether a question is answerable in principle before trying to answer it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "cooper",
"name": "S. Barry Cooper",
"name_ru": "Барри Купер",
"years": "1943–2015",
"wiki": "https://en.wikipedia.org/wiki/S._Barry_Cooper",
"zone": "own_limits",
"idea": {
"en": "Degrees of unsolvability and Turing's questions: problems can be unsolvable in different degrees.",
"ru": "Степени неразрешимости и вопросы Тьюринга: задачи бывают неразрешимы в разной степени.",
"de": "Grade der Unlösbarkeit und Turings Fragen."
},
"rule": "Say how far out of reach a question is, not only that it is hard.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "willard",
"name": "Dan Willard",
"name_ru": "Дэн Уиллард",
"years": "1948–2023",
"wiki": "https://en.wikipedia.org/wiki/Dan_Willard",
"zone": "own_limits",
"idea": {
"en": "Self-verifying theories: weak systems that can prove their own consistency, at the price of giving up some power.",
"ru": "Самопроверяющиеся теории: слабые системы, которые могут доказать собственную непротиворечивость ценой отказа от части возможностей.",
"de": "Selbstverifizierende Theorien: schwache Systeme, die ihre eigene Widerspruchsfreiheit beweisen können."
},
"rule": "To check yourself, narrow the claim until you can actually verify it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "midgley",
"name": "Mary Midgley",
"name_ru": "Мэри Миджли",
"years": "1919–2018",
"wiki": "https://en.wikipedia.org/wiki/Mary_Midgley",
"zone": "own_limits",
"idea": {
"en": "Critique of inflated promises of science and AI: a method that works in one field does not explain everything.",
"ru": "Критика завышенных обещаний науки и ИИ: метод, работающий в одной области, не объясняет всё.",
"de": "Kritik an überzogenen Versprechen von Wissenschaft und KI."
},
"rule": "Do not stretch a method beyond the field where it was shown to work.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "lucas",
"name": "John Lucas",
"name_ru": "Джон Лукас",
"years": "1929–2020",
"wiki": "https://en.wikipedia.org/wiki/John_Lucas_(philosopher)",
"zone": "own_limits",
"idea": {
"en": "'Minds, Machines and Gödel': an argument that a formal machine cannot fully replace a mathematician's insight.",
"ru": "«Minds, Machines and Gödel»: аргумент о том, что формальная машина не может полностью заменить понимание математика.",
"de": "„Minds, Machines and Gödel“."
},
"rule": "Leave room for a human check where formal rules run out.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "mccarthy",
"name": "John McCarthy",
"name_ru": "Джон Маккарти",
"years": "1927–2011",
"wiki": "https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)",
"zone": "side_effects",
"idea": {
"en": "The frame problem and non-monotonic reasoning: an action changes some things and leaves others; conclusions by default must be withdrawn when exceptions appear.",
"ru": "Проблема фрейма и немонотонные рассуждения: действие меняет одно и не меняет другое; выводы «по умолчанию» надо отзывать, когда появляются исключения.",
"de": "Rahmenproblem und nichtmonotones Schließen."
},
"rule": "Say what your action changes and what it leaves unchanged, and drop a default conclusion when an exception appears.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "dummett",
"name": "Michael Dummett",
"name_ru": "Майкл Даммит",
"years": "1925–2011",
"wiki": "https://en.wikipedia.org/wiki/Michael_Dummett",
"zone": "own_limits",
"idea": {
"en": "Justificationist semantics: a statement is meaningful as far as we know how to justify it.",
"ru": "Обосновательная семантика: утверждение осмысленно настолько, насколько мы знаем, как его обосновать.",
"de": "Rechtfertigungssemantik: eine Aussage hat Sinn, soweit wir wissen, wie man sie begründet."
},
"rule": "Do not assert what you have no way of justifying.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "garfinkel",
"name": "Harold Garfinkel",
"name_ru": "Гарольд Гарфинкель",
"years": "1917–2011",
"wiki": "https://en.wikipedia.org/wiki/Harold_Garfinkel",
"zone": "look_alike",
"idea": {
"en": "Ethnomethodology and indexicality: the same words mean different things in different unspoken contexts.",
"ru": "Этнометодология и индексикальность: одни и те же слова значат разное в разном невысказанном контексте.",
"de": "Ethnomethodologie und Indexikalität."
},
"rule": "The same words in a different context may not mean the same; check the context before matching.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "goldratt",
"name": "Eliyahu M. Goldratt",
"name_ru": "Элияху Голдратт",
"years": "1947–2011",
"wiki": "https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt",
"zone": "side_effects",
"idea": {
"en": "Theory of constraints: improving one link without regard to the system's bottleneck can make the whole worse.",
"ru": "Теория ограничений: улучшение одного звена без учёта узкого места системы может ухудшить целое.",
"de": "Engpasstheorie: lokale Optimierung ohne Engpass verschlechtert das Ganze."
},
"rule": "Before optimising one step, find the bottleneck of the whole chain.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "mcmullin",
"name": "Ernan McMullin",
"name_ru": "Эрнан Макмаллин",
"years": "1924–2011",
"wiki": "https://en.wikipedia.org/wiki/Ernan_McMullin",
"zone": "own_limits",
"idea": {
"en": "Epistemic values of theory choice: predictive accuracy, coherence and fertility, not a smooth story fitted after the fact.",
"ru": "Эпистемические ценности выбора теорий: предсказательная точность, согласованность и плодотворность, а не гладкая история, подогнанная задним числом.",
"de": "Epistemische Werte der Theoriewahl."
},
"rule": "Prefer an explanation that predicted something over one that fits any outcome after the fact.",
"needs": {
"code": "covered",
"note": "the track record sensor already measures whether the radar matched what happened next",
"covered_by": "trackrecord"
}
},
{
"id": "milner",
"name": "Robin Milner",
"name_ru": "Робин Милнер",
"years": "1934–2010",
"wiki": "https://en.wikipedia.org/wiki/Robin_Milner",
"zone": "look_alike",
"idea": {
"en": "Bisimulation and type inference: two processes are the same only if they behave the same in every situation, not because they look alike.",
"ru": "Бисимуляция и вывод типов: два процесса одинаковы, только если ведут себя одинаково в любой ситуации, а не потому, что похожи.",
"de": "Bisimulation und Typinferenz."
},
"rule": "Call two things the same only when they behave the same, not when they look the same.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "dawes",
"name": "Robyn Dawes",
"name_ru": "Робин Доус",
"years": "1936–2010",
"wiki": "https://en.wikipedia.org/wiki/Robyn_Dawes",
"zone": "own_limits",
"idea": {
"en": "'The robust beauty of improper linear models': simple formulas beat expert intuition, which overrates its own insight.",
"ru": "«Надёжная красота неправильных линейных моделей»: простые формулы выигрывают у интуиции экспертов, которая переоценивает свою проницательность.",
"de": "Einfache lineare Modelle schlagen Experten-Intuition."
},
"rule": "Where a simple rule has a record, trust it over a convincing story.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "foot",
"name": "Philippa Foot",
"name_ru": "Филиппа Фут",
"years": "1920–2010",
"wiki": "https://en.wikipedia.org/wiki/Philippa_Foot",
"zone": "side_effects",
"idea": {
"en": "The trolley problem and the doctrine of double effect: separate the intended aim from foreseen side effects and judge them apart.",
"ru": "Проблема вагонетки и доктрина двойного эффекта: разделять задуманную цель и предвидимые побочные эффекты и оценивать их отдельно.",
"de": "Trolley-Problem und Doppelwirkung."
},
"rule": "Name the foreseen side effects of an answer separately from its aim.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "turchin",
"name": "Valentin Turchin",
"name_ru": "Валентин Турчин",
"years": "1931–2010",
"wiki": "https://en.wikipedia.org/wiki/Valentin_Turchin",
"zone": "own_limits",
"idea": {
"en": "Metasystem transitions ('The Phenomenon of Science'): a control level above the rules watches where they stop working.",
"ru": "Метасистемные переходы («Феномен науки»): уровень контроля над правилами следит, где они перестают работать.",
"de": "Metasystemübergänge („The Phenomenon of Science“)."
},
"rule": "Keep a check above your own rules that notices when they no longer apply.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "mandelbrot",
"name": "Benoit Mandelbrot",
"name_ru": "Бенуа Мандельброт",
"years": "1924–2010",
"wiki": "https://en.wikipedia.org/wiki/Benoit_Mandelbrot",
"zone": "own_limits",
"idea": {
"en": "Fractals and heavy tails: 'wild' randomness, where rare huge jumps dominate, behaves differently from the calm bell curve.",
"ru": "Фракталы и тяжёлые хвосты: «дикая» случайность, где редкие огромные скачки решают всё, ведёт себя не так, как спокойная колоколообразная кривая.",
"de": "Fraktale und schwere Ränder: „wilde“ Zufälligkeit."
},
"rule": "Do not give narrow ranges for markets with rare huge jumps.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "gardner",
"name": "Martin Gardner",
"name_ru": "Мартин Гарднер",
"years": "1914–2010",
"wiki": "https://en.wikipedia.org/wiki/Martin_Gardner",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Fads and Fallacies in the Name of Science': sceptical checks against pseudoscience, coincidences and self-confirming explanations.",
"ru": "«Причуды и заблуждения во имя науки»: скептическая проверка против лженауки, совпадений и самоподтверждающихся объяснений.",
"de": "„Fads and Fallacies“: Skepsis gegenüber Pseudowissenschaft."
},
"rule": "Treat a striking coincidence as a coincidence until shown otherwise.",
"needs": {
"code": "covered",
"note": "the Park sensor already checks science headlines for signs of pseudoscience",
"covered_by": "park"
}
},
{
"id": "perrow",
"name": "Charles Perrow",
"name_ru": "Чарльз Перроу",
"years": "1925–2019",
"wiki": "https://en.wikipedia.org/wiki/Charles_Perrow",
"zone": "side_effects",
"idea": {
"en": "'Normal Accidents': in tightly coupled, complex systems small failures combine into accidents that nobody planned.",
"ru": "«Нормальные аварии»: в сложных и тесно связанных системах мелкие сбои складываются в аварии, которых никто не планировал.",
"de": "„Normale Katastrophen“: in eng gekoppelten Systemen addieren sich kleine Fehler."
},
"rule": "Ask which other parts are tightly linked to the step you change.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "jervis",
"name": "Robert Jervis",
"name_ru": "Роберт Джервис",
"years": "1940–2021",
"wiki": "https://en.wikipedia.org/wiki/Robert_Jervis",
"zone": "side_effects",
"idea": {
"en": "'System Effects': in interconnected systems actions have indirect and delayed consequences that can reverse the intended result.",
"ru": "«Эффекты системы»: во взаимосвязанных системах действия дают косвенные и запоздалые последствия, которые могут перевернуть задуманный результат.",
"de": "„System Effects“: indirekte und verzögerte Folgen."
},
"rule": "Look for the indirect and delayed effect, not only the direct one.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "rosenthal",
"name": "Robert Rosenthal",
"name_ru": "Роберт Розенталь",
"years": "1933–2024",
"wiki": "https://en.wikipedia.org/wiki/Robert_Rosenthal_(psychologist)",
"zone": "side_effects",
"idea": {
"en": "Expectancy effects (the Pygmalion effect): expectations change behaviour and can make a prediction come true.",
"ru": "Эффект ожиданий (эффект Пигмалиона): ожидания меняют поведение и могут сделать предсказание сбывшимся.",
"de": "Erwartungseffekte (Pygmalion-Effekt)."
},
"rule": "Remember that your forecast, once read, can change what people do.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "scott_jc",
"name": "James C. Scott",
"name_ru": "Джеймс Скотт",
"years": "1936–2024",
"wiki": "https://en.wikipedia.org/wiki/James_C._Scott",
"zone": "side_effects",
"idea": {
"en": "'Seeing Like a State': top-down schemes fail when they simplify away the local knowledge that made things work.",
"ru": "«Благими намерениями государства»: схемы «улучшения сверху» проваливаются, когда упрощают местное знание, на котором всё держалось.",
"de": "„Seeing Like a State“: Pläne von oben scheitern an weggelassenem lokalem Wissen."
},
"rule": "Ask what local knowledge your simple plan leaves out.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "selten",
"name": "Reinhard Selten",
"name_ru": "Райнхард Зельтен",
"years": "1930–2016",
"wiki": "https://en.wikipedia.org/wiki/Reinhard_Selten",
"zone": "side_effects",
"idea": {
"en": "Subgame perfection and bounded rationality: a plan must hold at every later step, given how others will respond then.",
"ru": "Совершенство в подыграх и ограниченная рациональность: план должен выдерживать каждый следующий шаг с учётом того, как ответят другие.",
"de": "Teilspielperfektheit und begrenzte Rationalität."
},
"rule": "Check that your advice still holds after the other side's next move.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "shubik",
"name": "Martin Shubik",
"name_ru": "Мартин Шубик",
"years": "1926–2018",
"wiki": "https://en.wikipedia.org/wiki/Martin_Shubik",
"zone": "side_effects",
"idea": {
"en": "The dollar auction and strategic market games: rational step-by-step bidding can lead everyone into a loss.",
"ru": "Долларовый аукцион и стратегические рыночные игры: разумные пошаговые ставки могут завести всех в убыток.",
"de": "Dollarauktion: schrittweise rationale Gebote führen alle in den Verlust."
},
"rule": "Before escalating, ask where the escalation ends for everyone.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "holling",
"name": "C. S. Holling",
"name_ru": "Кроуфорд Холлинг",
"years": "1930–2019",
"wiki": "https://en.wikipedia.org/wiki/C._S._Holling",
"zone": "side_effects",
"idea": {
"en": "Ecological resilience: optimising a system for efficiency can make it fragile to shocks.",
"ru": "Экологическая устойчивость: оптимизация системы ради эффективности может сделать её хрупкой к потрясениям.",
"de": "Ökologische Resilienz."
},
"rule": "Ask whether making something more efficient also makes it more fragile.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "raiffa",
"name": "Howard Raiffa",
"name_ru": "Говард Райфа",
"years": "1924–2016",
"wiki": "https://en.wikipedia.org/wiki/Howard_Raiffa",
"zone": "side_effects",
"idea": {
"en": "Decision analysis and negotiation: structure a decision by options, uncertainties and the other party's interests.",
"ru": "Анализ решений и переговоры: строить решение из вариантов, неопределённостей и интересов другой стороны.",
"de": "Entscheidungsanalyse und Verhandlung."
},
"rule": "Lay out the options and the other side's interests before recommending one.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "apresyan",
"name": "Yuri Apresyan",
"name_ru": "Юрий Апресян",
"years": "1930–2024",
"wiki": "https://ru.wikipedia.org/wiki/%D0%90%D0%BF%D1%80%D0%B5%D1%81%D1%8F%D0%BD%2C_%D0%AE%D1%80%D0%B8%D0%B9_%D0%94%D0%B5%D1%80%D0%B5%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "look_alike",
"idea": {
"en": "Systematic lexicography: synonyms differ in fine shades, and one word has several meanings.",
"ru": "Системная лексикография: синонимы различаются тонкими оттенками, а одно слово имеет несколько значений.",
"de": "Systematische Lexikographie: Synonyme unterscheiden sich fein."
},
"rule": "Do not treat two near-synonyms as exactly the same; check the shade.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "paducheva",
"name": "Elena Paducheva",
"name_ru": "Елена Падучева",
"years": "1935–2019",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9F%D0%B0%D0%B4%D1%83%D1%87%D0%B5%D0%B2%D0%B0%2C_%D0%95%D0%BB%D0%B5%D0%BD%D0%B0_%D0%92%D0%B8%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2%D0%BD%D0%B0",
"zone": "look_alike",
"idea": {
"en": "Semantics of reference and aspect: the same sentence can refer to different things depending on context.",
"ru": "Семантика референции и вида: одно и то же предложение может указывать на разное в зависимости от контекста.",
"de": "Semantik der Referenz."
},
"rule": "Ask what exactly a phrase refers to here before matching it with another.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "zaliznyak",
"name": "Andrey Zaliznyak",
"name_ru": "Андрей Зализняк",
"years": "1935–2017",
"wiki": "https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%BB%D0%B8%D0%B7%D0%BD%D1%8F%D0%BA%2C_%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B9_%D0%90%D0%BD%D0%B0%D1%82%D0%BE%D0%BB%D1%8C%D0%B5%D0%B2%D0%B8%D1%87",
"zone": "look_alike",
"idea": {
"en": "The grammatical dictionary of Russian: all forms of one word belong together; different words can share one form.",
"ru": "Грамматический словарь русского языка: все формы одного слова — одно слово, а разные слова могут совпадать в одной форме.",
"de": "Grammatisches Wörterbuch des Russischen."
},
"rule": "Group forms of one word together, and do not merge different words that share a form.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "saracevic",
"name": "Tefko Saracevic",
"name_ru": "Тефко Сарачевич",
"years": "1930–2024",
"wiki": "https://en.wikipedia.org/wiki/Tefko_Saracevic",
"zone": "look_alike",
"idea": {
"en": "Relevance in information retrieval: matching words is not the same as answering the need.",
"ru": "Релевантность в информационном поиске: совпадение слов — не то же самое, что ответ на потребность.",
"de": "Relevanz im Information Retrieval."
},
"rule": "A result that shares the words may still not answer the question.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "kilgarriff",
"name": "Adam Kilgarriff",
"name_ru": "Адам Килгаррифф",
"years": "1960–2015",
"wiki": "https://en.wikipedia.org/wiki/Adam_Kilgarriff",
"zone": "look_alike",
"idea": {
"en": "Word senses from corpora ('I don't believe in word senses'): meanings are clusters of uses, not fixed boxes.",
"ru": "Значения слов по корпусам («Я не верю в значения слов»): значения — это скопления употреблений, а не жёсткие ящики.",
"de": "Wortbedeutungen aus Korpora."
},
"rule": "Judge what a word means here from how it is used, not from a fixed list.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "kay",
"name": "Martin Kay",
"name_ru": "Мартин Кей",
"years": "1935–2021",
"wiki": "https://en.wikipedia.org/wiki/Martin_Kay",
"zone": "look_alike",
"idea": {
"en": "Computational linguistics and translation: machines should help humans where meaning is ambiguous, not decide alone.",
"ru": "Компьютерная лингвистика и перевод: машина должна помогать человеку там, где смысл неоднозначен, а не решать одна.",
"de": "Computerlinguistik und Übersetzung."
},
"rule": "Where a meaning is ambiguous, show the options instead of picking one silently.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "rey",
"name": "Alain Rey",
"name_ru": "Ален Рей",
"years": "1928–2020",
"wiki": "https://en.wikipedia.org/wiki/Alain_Rey",
"zone": "look_alike",
"idea": {
"en": "Historical lexicography (Le Robert): words change meaning over time.",
"ru": "Историческая лексикография (словари Le Robert): слова меняют значение со временем.",
"de": "Historische Lexikographie (Le Robert)."
},
"rule": "Check whether a word meant the same thing when the source was written.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "hutchins",
"name": "W. John Hutchins",
"name_ru": "Джон Хатчинс",
"years": "1939–2021",
"wiki": "https://en.wikipedia.org/wiki/W._John_Hutchins",
"zone": "look_alike",
"idea": {
"en": "History of machine translation: the same word can have different translations, and early systems failed on ambiguity.",
"ru": "История машинного перевода: одно слово может переводиться по-разному, и первые системы спотыкались о неоднозначность.",
"de": "Geschichte der maschinellen Übersetzung."
},
"rule": "When translating a key term, check that the translation keeps the meaning.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "hanks",
"name": "Patrick Hanks",
"name_ru": "Патрик Хэнкс",
"years": "1940–2024",
"wiki": "https://en.wikipedia.org/wiki/Patrick_Hanks",
"zone": "look_alike",
"idea": {
"en": "Corpus pattern analysis: a word's meaning is fixed by the pattern it occurs in.",
"ru": "Анализ корпусных шаблонов: значение слова задаётся шаблоном, в котором оно встречается.",
"de": "Korpusmusteranalyse."
},
"rule": "Read the whole pattern around a word before deciding what it means.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "fensel",
"name": "Dieter Fensel",
"name_ru": "Дитер Фензель",
"years": "1960–2024",
"wiki": "https://en.wikipedia.org/wiki/Dieter_Fensel",
"zone": "look_alike",
"idea": {
"en": "Ontologies and the semantic web: shared, explicit definitions so that different systems mean the same thing by a term.",
"ru": "Онтологии и семантический веб: общие явные определения, чтобы разные системы понимали термин одинаково.",
"de": "Ontologien und Semantic Web."
},
"rule": "Use an explicit shared definition when two sources use the same term.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "lyons",
"name": "John Lyons",
"name_ru": "Джон Лайонз",
"years": "1932–2020",
"wiki": "https://en.wikipedia.org/wiki/John_Lyons_(linguist)",
"zone": "look_alike",
"idea": {
"en": "Structural semantics: the meaning of a word is set by its relations to other words (synonymy, opposites, inclusion).",
"ru": "Структурная семантика: значение слова задаётся его отношениями с другими словами (синонимия, противоположность, включение).",
"de": "Strukturelle Semantik."
},
"rule": "Check how two words relate (same, broader, opposite) before treating them as one.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "pnueli",
"name": "Amir Pnueli",
"name_ru": "Амир Пнуэли",
"years": "1941–2009",
"wiki": "https://en.wikipedia.org/wiki/Amir_Pnueli",
"zone": "side_effects",
"idea": {
"en": "Temporal logic of programs: check not only that a step is right now, but that nothing bad ever happens later (safety) and that the good thing eventually happens (liveness).",
"ru": "Темпоральная логика программ: проверять не только, что шаг верен сейчас, но и что ничего плохого не случится потом (безопасность) и хорошее в итоге произойдёт (живость).",
"de": "Temporallogik: Sicherheit und Lebendigkeit über die Zeit prüfen."
},
"rule": "Check that your answer stays safe over the next steps, not only at this one.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "selfridge",
"name": "Oliver Selfridge",
"name_ru": "Оливер Селфридж",
"years": "1926–2009",
"wiki": "https://en.wikipedia.org/wiki/Oliver_Selfridge",
"zone": "look_alike",
"idea": {
"en": "Pandemonium: many feature detectors compete, and the loudest single match must not decide alone.",
"ru": "«Пандемониум»: много детекторов признаков соревнуются, и самое громкое одиночное совпадение не должно решать в одиночку.",
"de": "„Pandemonium“: konkurrierende Merkmalsdetektoren."
},
"rule": "Do not call a match on one striking feature; let other features compete.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "ackoff",
"name": "Russell L. Ackoff",
"name_ru": "Рассел Акофф",
"years": "1919–2009",
"wiki": "https://en.wikipedia.org/wiki/Russell_L._Ackoff",
"zone": "side_effects",
"idea": {
"en": "Systems thinking: doing things right is not doing the right thing; improving a part can harm the whole.",
"ru": "Системное мышление: делать правильно — не то же, что делать правильное; улучшение части может навредить целому.",
"de": "Systemdenken: Teile verbessern kann dem Ganzen schaden."
},
"rule": "Ask what the improvement does to the whole system, not only to the part.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "granger",
"name": "Clive Granger",
"name_ru": "Клайв Грейнджер",
"years": "1934–2009",
"wiki": "https://en.wikipedia.org/wiki/Clive_Granger",
"zone": "one_model",
"idea": {
"en": "Granger causality and cointegration: one series 'leads' another only if its past improves the forecast; two rising trends can correlate by accident.",
"ru": "Причинность по Грейнджеру и коинтеграция: один ряд «ведёт» другой, только если его прошлое улучшает прогноз; два растущих тренда могут совпадать случайно.",
"de": "Granger-Kausalität und Kointegration."
},
"rule": "Before saying A drives B, check that A's past actually adds to predicting B, in both directions.",
"needs": {
"code": "needs_history",
"note": "bridge with the track record sensor: does the radar lead BTC/ETH or do prices lead the radar? needs a few weeks of hourly history",
"not_before": "2026-12-14"
}
},
{
"id": "naess",
"name": "Arne Næss",
"name_ru": "Арне Нэсс",
"years": "1912–2009",
"wiki": "https://en.wikipedia.org/wiki/Arne_N%C3%A6ss",
"zone": "look_alike",
"idea": {
"en": "Interpretation and preciseness: make a vague statement more precise step by step instead of averaging its readings.",
"ru": "«Интерпретация и точность»: уточнять размытое высказывание шаг за шагом, а не усреднять его прочтения.",
"de": "„Interpretation and Preciseness“."
},
"rule": "When a term has several readings, state the one you use.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "hymes",
"name": "Dell Hymes",
"name_ru": "Делл Хаймс",
"years": "1927–2009",
"wiki": "https://en.wikipedia.org/wiki/Dell_Hymes",
"zone": "side_effects",
"idea": {
"en": "Communicative competence: the same correct sentence works or fails depending on setting, participants and genre.",
"ru": "Коммуникативная компетенция: одна и та же правильная фраза срабатывает или нет в зависимости от обстановки, участников и жанра.",
"de": "Kommunikative Kompetenz."
},
"rule": "Fit the answer to who hears it and where, not only to grammar.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "hurwicz",
"name": "Leonid Hurwicz",
"name_ru": "Леонид Гурвич",
"years": "1917–2008",
"wiki": "https://en.wikipedia.org/wiki/Leonid_Hurwicz",
"zone": "side_effects",
"idea": {
"en": "Mechanism design and incentive compatibility: rules work only if people gain by following them; the Hurwicz criterion weighs best and worst cases under ignorance.",
"ru": "Теория механизмов и совместимость стимулов: правила работают, только если людям выгодно им следовать; критерий Гурвича взвешивает лучший и худший случай при незнании.",
"de": "Mechanismusdesign und Anreizverträglichkeit."
},
"rule": "Ask whether the people affected gain by following your advice, and weigh the best and worst case.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "weizenbaum",
"name": "Joseph Weizenbaum",
"name_ru": "Джозеф Вейценбаум",
"years": "1923–2008",
"wiki": "https://en.wikipedia.org/wiki/Joseph_Weizenbaum",
"zone": "own_limits",
"idea": {
"en": "ELIZA and 'Computer Power and Human Reason': fluent replies make people credit a machine with understanding it does not have.",
"ru": "ELIZA и «Возможности вычислительных машин и человеческий разум»: гладкие ответы заставляют людей приписывать машине понимание, которого нет.",
"de": "ELIZA und „Die Macht der Computer und die Ohnmacht der Vernunft“."
},
"rule": "Do not let fluency stand in for understanding: say when you have no real basis.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "lorenz",
"name": "Edward N. Lorenz",
"name_ru": "Эдвард Лоренц",
"years": "1917–2008",
"wiki": "https://en.wikipedia.org/wiki/Edward_Norton_Lorenz",
"zone": "own_limits",
"idea": {
"en": "Chaos and the limit of predictability: in nonlinear systems tiny errors grow, so forecasts have a horizon.",
"ru": "Хаос и предел предсказуемости: в нелинейных системах крошечные ошибки растут, поэтому у прогнозов есть горизонт.",
"de": "Chaos und Vorhersagehorizont."
},
"rule": "Do not give point forecasts beyond the horizon where small errors take over.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "lederberg",
"name": "Joshua Lederberg",
"name_ru": "Джошуа Ледерберг",
"years": "1925–2008",
"wiki": "https://en.wikipedia.org/wiki/Joshua_Lederberg",
"zone": "own_limits",
"idea": {
"en": "DENDRAL, the first expert system: generate candidate answers freely, then reject those that break known rules.",
"ru": "DENDRAL, первая экспертная система: свободно порождать варианты ответа, затем отбрасывать те, что нарушают известные правила.",
"de": "DENDRAL: Hypothesen erzeugen, dann nach Regeln aussortieren."
},
"rule": "Generate options first, then strike out the ones that break hard facts.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "tilly",
"name": "Charles Tilly",
"name_ru": "Чарльз Тилли",
"years": "1929–2008",
"wiki": "https://en.wikipedia.org/wiki/Charles_Tilly",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Why?': people explain by conventions, stories, codes and technical accounts; a smooth story is not a technical account.",
"ru": "«Почему?»: люди объясняют через условности, истории, коды и технические отчёты; гладкая история — ещё не технический отчёт.",
"de": "„Why?“: Geschichten sind keine technischen Erklärungen."
},
"rule": "Do not pass off a neat story as a technical explanation.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "zajonc",
"name": "Robert Zajonc",
"name_ru": "Роберт Зайонц",
"years": "1923–2008",
"wiki": "https://en.wikipedia.org/wiki/Robert_Zajonc",
"zone": "rumour_vs_fact",
"idea": {
"en": "The mere-exposure effect: what we see often feels more true and more pleasant.",
"ru": "Эффект простого предъявления: то, что видишь часто, кажется вернее и приятнее.",
"de": "Mere-Exposure-Effekt."
},
"rule": "Do not take a claim as truer because you have seen it many times.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor already shows which stories were repeated by many outlets; check_headline counts independent voices",
"covered_by": "kasperson"
}
},
{
"id": "sparck_jones",
"name": "Karen Spärck Jones",
"name_ru": "Карен Спарк Джонс",
"years": "1935–2007",
"wiki": "https://en.wikipedia.org/wiki/Karen_Sp%C3%A4rck_Jones",
"zone": "look_alike",
"idea": {
"en": "Inverse document frequency: common words make texts look alike; rare, distinctive words show what really matches.",
"ru": "Обратная частота документа (IDF): частые слова делают тексты ложно похожими, совпадение показывают редкие различительные слова.",
"de": "IDF: häufige Wörter täuschen Ähnlichkeit vor, seltene zeigen echte Übereinstimmung."
},
"rule": "Match on rare, distinctive words, not on common ones.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "watzlawick",
"name": "Paul Watzlawick",
"name_ru": "Пауль Вацлавик",
"years": "1921–2007",
"wiki": "https://en.wikipedia.org/wiki/Paul_Watzlawick",
"zone": "side_effects",
"idea": {
"en": "Axioms of communication: one cannot not communicate; every message has a content and a relationship level.",
"ru": "Аксиомы коммуникации: невозможно не коммуницировать; у каждого сообщения есть уровень содержания и уровень отношений.",
"de": "Axiome der Kommunikation: man kann nicht nicht kommunizieren."
},
"rule": "Silence or evasion is also a message; think how it will be read.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "rorty",
"name": "Richard Rorty",
"name_ru": "Ричард Рорти",
"years": "1931–2007",
"wiki": "https://en.wikipedia.org/wiki/Richard_Rorty",
"zone": "own_limits",
"idea": {
"en": "Normal and abnormal discourse: when vocabularies clash, there may be no single neutral answer.",
"ru": "Нормальный и анормальный дискурс: когда сталкиваются разные словари понятий, единого нейтрального ответа может не быть.",
"de": "Normaler und abnormaler Diskurs: unvereinbare Vokabulare."
},
"rule": "When two frameworks clash, say so instead of faking one objective answer.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "douglas_m",
"name": "Mary Douglas",
"name_ru": "Мэри Дуглас",
"years": "1921–2007",
"wiki": "https://en.wikipedia.org/wiki/Mary_Douglas",
"zone": "look_alike",
"idea": {
"en": "'Purity and Danger': anomalies are produced by the classification itself — matter out of place.",
"ru": "«Чистота и опасность»: аномалии порождает сама система классификации — «вещь не на своём месте».",
"de": "„Reinheit und Gefährdung“: Anomalien entstehen durch die Klassifikation."
},
"rule": "Do not force an odd case into the nearest familiar category; say it does not fit.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "rapoport",
"name": "Anatol Rapoport",
"name_ru": "Анатолий Рапопорт",
"years": "1911–2007",
"wiki": "https://en.wikipedia.org/wiki/Anatol_Rapoport",
"zone": "side_effects",
"idea": {
"en": "Tit for tat in the repeated prisoner's dilemma, and Rapoport's rules: restate the other side's view fairly before criticising.",
"ru": "«Око за око» в повторяющейся дилемме заключённого и правила Рапопорта: честно перескажи позицию другой стороны, прежде чем критиковать.",
"de": "„Tit for Tat“ und Rapoports Regeln fairer Kritik."
},
"rule": "Restate the strongest version of a view before answering it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "friedman_m",
"name": "Milton Friedman",
"name_ru": "Милтон Фридман",
"years": "1912–2006",
"wiki": "https://en.wikipedia.org/wiki/Milton_Friedman",
"zone": "side_effects",
"idea": {
"en": "Long and variable lags: the effects of policy arrive late and unevenly, so reacting to short-term noise can destabilise.",
"ru": "Длинные и переменные лаги: последствия политики приходят поздно и неравномерно, поэтому реакция на краткосрочный шум раскачивает систему.",
"de": "Lange und variable Wirkungsverzögerungen."
},
"rule": "Do not read today's move as the effect of yesterday's decision; effects come late.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "galbraith",
"name": "John Kenneth Galbraith",
"name_ru": "Джон Кеннет Гэлбрейт",
"years": "1908–2006",
"wiki": "https://en.wikipedia.org/wiki/John_Kenneth_Galbraith",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Conventional wisdom': ideas valued because they are familiar and comfortable, not because they are accurate.",
"ru": "«Общепринятая мудрость»: идеи, ценимые за привычность и удобство, а не за точность.",
"de": "„Konventionelle Weisheit“: geschätzt, weil vertraut, nicht weil richtig."
},
"rule": "Do not treat a familiar phrase as true just because everyone repeats it.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor and the news passport already flag stories that feel true because they are repeated",
"covered_by": "kasperson"
}
},
{
"id": "geertz",
"name": "Clifford Geertz",
"name_ru": "Клиффорд Гирц",
"years": "1926–2006",
"wiki": "https://en.wikipedia.org/wiki/Clifford_Geertz",
"zone": "look_alike",
"idea": {
"en": "Thick description: a twitch and a wink look the same; only context tells them apart.",
"ru": "Насыщенное описание: тик и подмигивание выглядят одинаково, различает их только контекст.",
"de": "Dichte Beschreibung: Zucken und Zwinkern sehen gleich aus."
},
"rule": "Read the context before deciding that two identical-looking things mean the same.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "strawson",
"name": "P. F. Strawson",
"name_ru": "Питер Стросон",
"years": "1919–2006",
"wiki": "https://en.wikipedia.org/wiki/P._F._Strawson",
"zone": "own_limits",
"idea": {
"en": "'On Referring' and presupposition: a statement about something that does not exist is not simply false — the question itself fails.",
"ru": "«О референции» и пресуппозиция: утверждение о несуществующем не просто ложно — проваливается сам вопрос.",
"de": "„On Referring“ und Präsupposition."
},
"rule": "If a question rests on a false premise, challenge the premise instead of answering yes or no.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "jacobs",
"name": "Jane Jacobs",
"name_ru": "Джейн Джекобс",
"years": "1916–2006",
"wiki": "https://en.wikipedia.org/wiki/Jane_Jacobs",
"zone": "side_effects",
"idea": {
"en": "'The Death and Life of Great American Cities': cities are organised complexity held together by local feedback; top-down plans break it.",
"ru": "«Смерть и жизнь больших американских городов»: город — организованная сложность на местных обратных связях, которую ломают планы сверху.",
"de": "„Tod und Leben großer amerikanischer Städte“."
},
"rule": "Do not override local signals with one central scheme.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "koselleck",
"name": "Reinhart Koselleck",
"name_ru": "Райнхарт Козеллек",
"years": "1923–2006",
"wiki": "https://en.wikipedia.org/wiki/Reinhart_Koselleck",
"zone": "look_alike",
"idea": {
"en": "History of concepts: one word carries layers of meaning from different times.",
"ru": "История понятий: одно слово несёт пласты смыслов из разных времён.",
"de": "Begriffsgeschichte: Wörter tragen Bedeutungsschichten verschiedener Zeiten."
},
"rule": "Check which layer of meaning a word has in this source and time.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "dantzig",
"name": "George Dantzig",
"name_ru": "Джордж Данциг",
"years": "1914–2005",
"wiki": "https://en.wikipedia.org/wiki/George_Dantzig",
"zone": "own_limits",
"idea": {
"en": "Linear programming and the simplex method: first check that the constraints can be met at all.",
"ru": "Линейное программирование и симплекс-метод: сначала проверь, совместимы ли ограничения вообще.",
"de": "Lineare Optimierung: zuerst prüfen, ob die Bedingungen erfüllbar sind."
},
"rule": "If the requirements contradict each other, say the task has no solution instead of faking a compromise.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "breiman",
"name": "Leo Breiman",
"name_ru": "Лео Брейман",
"years": "1928–2005",
"wiki": "https://en.wikipedia.org/wiki/Leo_Breiman",
"zone": "one_model",
"idea": {
"en": "Random forests and 'The Two Cultures': judge a model by how well it predicts, and combine many models to reduce chance matches.",
"ru": "Случайный лес и «Две культуры»: оценивай модель по тому, как она предсказывает, и объединяй много моделей, чтобы уменьшить случайные совпадения.",
"de": "Random Forests und „Two Cultures“."
},
"rule": "Trust the model that predicts well, not the one with the nicest story.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already recomputes each index under all reasonable model variants",
"covered_by": "leamer"
}
},
{
"id": "ricoeur",
"name": "Paul Ricœur",
"name_ru": "Поль Рикёр",
"years": "1913–2005",
"wiki": "https://en.wikipedia.org/wiki/Paul_Ric%C5%93ur",
"zone": "look_alike",
"idea": {
"en": "Two kinds of identity: sameness (idem) and selfhood that persists through change (ipse); hermeneutics of trust and suspicion.",
"ru": "Два вида тождества: одинаковость (idem) и самость, сохраняющаяся в изменении (ipse); герменевтика доверия и подозрения.",
"de": "Idem- und Ipse-Identität."
},
"rule": "Ask whether 'the same' means identical features or the same thing that has changed.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "mayr",
"name": "Ernst Mayr",
"name_ru": "Эрнст Майр",
"years": "1904–2005",
"wiki": "https://en.wikipedia.org/wiki/Ernst_Mayr",
"zone": "one_model",
"idea": {
"en": "Population thinking: variation is real and the average is an abstraction; proximate and ultimate causes differ.",
"ru": "Популяционное мышление: изменчивость реальна, а среднее — абстракция; ближайшая и глубинная причины различаются.",
"de": "Populationsdenken: Variation ist real, der Durchschnitt eine Abstraktion."
},
"rule": "Do not describe an individual case by the average of its group.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "edwards_w",
"name": "Ward Edwards",
"name_ru": "Уорд Эдвардс",
"years": "1927–2005",
"wiki": "https://en.wikipedia.org/wiki/Ward_Edwards",
"zone": "own_limits",
"idea": {
"en": "Behavioural decision theory and conservatism: people update too little when new evidence arrives.",
"ru": "Поведенческая теория решений и консерватизм: люди слишком слабо меняют мнение, когда приходят новые факты.",
"de": "Verhaltensentscheidungstheorie und Konservatismus beim Lernen."
},
"rule": "Change your confidence as much as the new evidence warrants, no less.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "derrida",
"name": "Jacques Derrida",
"name_ru": "Жак Деррида",
"years": "1930–2004",
"wiki": "https://en.wikipedia.org/wiki/Jacques_Derrida",
"zone": "look_alike",
"idea": {
"en": "Iterability: a quote or a sign can be lifted into a new context, and its meaning shifts.",
"ru": "Итерабельность: цитату или знак можно перенести в новый контекст, и смысл сдвигается.",
"de": "Iterabilität: Zitate verschieben ihren Sinn im neuen Kontext."
},
"rule": "Do not assume a quote keeps its meaning outside the context it was said in.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "maynard_smith",
"name": "John Maynard Smith",
"name_ru": "Джон Мейнард Смит",
"years": "1920–2004",
"wiki": "https://en.wikipedia.org/wiki/John_Maynard_Smith",
"zone": "side_effects",
"idea": {
"en": "Evolutionarily stable strategies and honest signals: a strategy is stable only if it survives others adapting to it.",
"ru": "Эволюционно стабильные стратегии и честные сигналы: стратегия устойчива, только если выдерживает приспособление других.",
"de": "Evolutionär stabile Strategien und ehrliche Signale."
},
"rule": "Ask whether your rule still works once others adapt to it or game it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "bobbio",
"name": "Norberto Bobbio",
"name_ru": "Норберто Боббио",
"years": "1909–2004",
"wiki": "https://en.wikipedia.org/wiki/Norberto_Bobbio",
"zone": "own_limits",
"idea": {
"en": "Antinomies in systems of rules and the criteria for resolving them: later, higher or more specific rule.",
"ru": "Антиномии в системах правил и критерии их разрешения: более позднее, более высокое или более специальное правило.",
"de": "Antinomien in Normensystemen und ihre Auflösung."
},
"rule": "When two of your rules conflict, name the conflict and the priority instead of silently breaking one.",
"needs": {
"code": "covered",
"note": "applied: Orb Studio's method resolves conflicting rules by priority — the more cautious rule wins (/tools/method)"
}
},
{
"id": "churchman",
"name": "C. West Churchman",
"name_ru": "Чарльз Уэст Черчмен",
"years": "1913–2004",
"wiki": "https://en.wikipedia.org/wiki/C._West_Churchman",
"zone": "side_effects",
"idea": {
"en": "The systems approach and boundary critique: side effects hide just outside where you drew the system's edge.",
"ru": "Системный подход и критика границ: побочные эффекты прячутся сразу за той границей, где ты очертил систему.",
"de": "Systemansatz und Grenzkritik."
},
"rule": "Ask what lies just outside the frame you chose.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "iverson",
"name": "Kenneth E. Iverson",
"name_ru": "Кеннет Айверсон",
"years": "1920–2004",
"wiki": "https://en.wikipedia.org/wiki/Kenneth_E._Iverson",
"zone": "look_alike",
"idea": {
"en": "'Notation as a Tool of Thought': a precise notation shows structure that wordy language hides.",
"ru": "«Нотация как инструмент мысли»: точная запись показывает структуру, которую скрывает многословный язык.",
"de": "„Notation as a Tool of Thought“."
},
"rule": "Write the key relation precisely when words leave it ambiguous.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "davidson_d",
"name": "Donald Davidson",
"name_ru": "Дональд Дэвидсон",
"years": "1917–2003",
"wiki": "https://en.wikipedia.org/wiki/Donald_Davidson_(philosopher)",
"zone": "look_alike",
"idea": {
"en": "The principle of charity and triangulation: read others as making sense, but anchor meaning in a shared world.",
"ru": "Принцип милосердия и триангуляция: читай других как говорящих осмысленно, но привязывай смысл к общему миру.",
"de": "Prinzip der Nachsicht und Triangulation."
},
"rule": "Read a request charitably, but check it against shared facts.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "von_wright",
"name": "Georg Henrik von Wright",
"name_ru": "Георг Хенрик фон Вригт",
"years": "1916–2003",
"wiki": "https://en.wikipedia.org/wiki/Georg_Henrik_von_Wright",
"zone": "side_effects",
"idea": {
"en": "Deontic logic: obligations, permissions and prohibitions must fit together.",
"ru": "Деонтическая логика: обязанности, разрешения и запреты должны быть согласованы.",
"de": "Deontische Logik."
},
"rule": "Check that doing what you must does not require doing what you must not.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "williams_b",
"name": "Bernard Williams",
"name_ru": "Бернард Уильямс",
"years": "1929–2003",
"wiki": "https://en.wikipedia.org/wiki/Bernard_Williams",
"zone": "own_limits",
"idea": {
"en": "Truth and Truthfulness: the two virtues of accuracy and sincerity; moral luck separates the decision from its outcome.",
"ru": "«Истина и правдивость»: две добродетели — точность и искренность; моральная удача отделяет решение от исхода.",
"de": "„Wahrheit und Wahrhaftigkeit“: Genauigkeit und Aufrichtigkeit."
},
"rule": "Be accurate and sincere: do not mislead by smoothness, and judge a decision apart from its luck.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "needham",
"name": "Roger Needham",
"name_ru": "Роджер Нидэм",
"years": "1935–2003",
"wiki": "https://en.wikipedia.org/wiki/Roger_Needham",
"zone": "look_alike",
"idea": {
"en": "Authentication protocols (Needham–Schroeder): never trust a claimed identity without verifying it.",
"ru": "Протоколы аутентификации (Нидэма — Шрёдера): никогда не доверяй заявленной личности без проверки.",
"de": "Authentifizierungsprotokolle (Needham-Schroeder)."
},
"rule": "Verify who a message really comes from before acting on it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "modigliani",
"name": "Franco Modigliani",
"name_ru": "Франко Модильяни",
"years": "1918–2003",
"wiki": "https://en.wikipedia.org/wiki/Franco_Modigliani",
"zone": "look_alike",
"idea": {
"en": "Modigliani–Miller and the life-cycle hypothesis: repackaging the same flows does not create value; judge over the whole horizon.",
"ru": "Модильяни — Миллер и гипотеза жизненного цикла: переупаковка тех же потоков не создаёт ценности; оценивай на всём горизонте.",
"de": "Modigliani-Miller und Lebenszyklushypothese."
},
"rule": "Do not take a new wrapping of the same thing for a real change.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "postman",
"name": "Neil Postman",
"name_ru": "Нил Постман",
"years": "1931–2003",
"wiki": "https://en.wikipedia.org/wiki/Neil_Postman",
"zone": "own_limits",
"idea": {
"en": "'Amusing Ourselves to Death': every medium favours its own kind of truth; entertainment pushes out checking.",
"ru": "«Развлекаемся до смерти»: каждый медиум предпочитает свой вид истины; развлечение вытесняет проверку.",
"de": "„Wir amüsieren uns zu Tode“."
},
"rule": "Do not let a lively format replace checking.",
"needs": {
"code": "covered",
"note": "applied: Grok and David must say 'not known yet' instead of covering gaps with smooth words"
}
},
{
"id": "said_e",
"name": "Edward Said",
"name_ru": "Эдвард Саид",
"years": "1935–2003",
"wiki": "https://en.wikipedia.org/wiki/Edward_Said",
"zone": "look_alike",
"idea": {
"en": "'Orientalism': institutional texts can build a stereotype of 'the other' and pass it off as knowledge.",
"ru": "«Ориентализм»: институциональные тексты могут построить стереотип «другого» и выдавать его за знание.",
"de": "„Orientalismus“: Stereotype als Wissen."
},
"rule": "Do not pass off a stereotype about a group as a fact about one case.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "dijkstra",
"name": "Edsger W. Dijkstra",
"name_ru": "Эдсгер Дейкстра",
"years": "1930–2002",
"wiki": "https://en.wikipedia.org/wiki/Edsger_W._Dijkstra",
"zone": "own_limits",
"idea": {
"en": "Separation of concerns and weakest preconditions: state what must hold before a step, and check it.",
"ru": "Разделение ответственности и слабейшие предусловия: скажи, что должно быть верно до шага, и проверь это.",
"de": "Trennung der Belange und schwächste Vorbedingungen."
},
"rule": "Check a step's preconditions before you take it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "rawls",
"name": "John Rawls",
"name_ru": "Джон Ролз",
"years": "1921–2002",
"wiki": "https://en.wikipedia.org/wiki/John_Rawls",
"zone": "side_effects",
"idea": {
"en": "'A Theory of Justice': the veil of ignorance, reflective equilibrium and attention to the worst-off.",
"ru": "«Теория справедливости»: занавес неведения, рефлексивное равновесие и внимание к тем, кому хуже всего.",
"de": "„Eine Theorie der Gerechtigkeit“."
},
"rule": "Ask how your advice looks to the person who would be worst off.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "nozick",
"name": "Robert Nozick",
"name_ru": "Роберт Нозик",
"years": "1938–2002",
"wiki": "https://en.wikipedia.org/wiki/Robert_Nozick",
"zone": "own_limits",
"idea": {
"en": "Truth-tracking: you know something only if you would not believe it were it false.",
"ru": "Отслеживание истины: ты знаешь что-то, только если не поверил бы в это, будь оно ложным.",
"de": "Wahrheitsverfolgung: Wissen nur, wenn man es bei Falschheit nicht glauben würde."
},
"rule": "Ask: would I say this just as confidently if it were false? If yes, I do not know it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "bourdieu",
"name": "Pierre Bourdieu",
"name_ru": "Пьер Бурдьё",
"years": "1930–2002",
"wiki": "https://en.wikipedia.org/wiki/Pierre_Bourdieu",
"zone": "side_effects",
"idea": {
"en": "Fields and habitus: the same act has a different meaning and price in different social fields.",
"ru": "Поля и габитус: одно и то же действие имеет разный смысл и цену в разных социальных полях.",
"de": "Feld und Habitus."
},
"rule": "Consider the field the reader is in before judging what an answer will mean to them.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "gadamer",
"name": "Hans-Georg Gadamer",
"name_ru": "Ханс-Георг Гадамер",
"years": "1900–2002",
"wiki": "https://en.wikipedia.org/wiki/Hans-Georg_Gadamer",
"zone": "look_alike",
"idea": {
"en": "'Truth and Method': understanding is a fusion of horizons; one's own assumptions shape what one reads.",
"ru": "«Истина и метод»: понимание — это слияние горизонтов; собственные допущения влияют на прочитанное.",
"de": "„Wahrheit und Methode“: Horizontverschmelzung."
},
"rule": "State your assumptions instead of quietly filling gaps with them.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "von_foerster",
"name": "Heinz von Foerster",
"name_ru": "Хайнц фон Фёрстер",
"years": "1911–2002",
"wiki": "https://en.wikipedia.org/wiki/Heinz_von_Foerster",
"zone": "side_effects",
"idea": {
"en": "Second-order cybernetics: the observer is part of the system; act so as to increase the number of choices.",
"ru": "Кибернетика второго порядка: наблюдатель — часть системы; действуй так, чтобы выборов становилось больше.",
"de": "Kybernetik zweiter Ordnung."
},
"rule": "Count yourself in the system you describe, and do not close options too early.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "jeffrey_r",
"name": "Richard Jeffrey",
"name_ru": "Ричард Джеффри",
"years": "1926–2002",
"wiki": "https://en.wikipedia.org/wiki/Richard_Jeffrey",
"zone": "own_limits",
"idea": {
"en": "Jeffrey conditioning: update beliefs on uncertain evidence without turning it into certainty.",
"ru": "Обусловливание Джеффри: обновлять убеждения по неуверенным свидетельствам, не превращая их в достоверность.",
"de": "Jeffrey-Konditionalisierung."
},
"rule": "Weigh uncertain evidence softly; do not treat it as a hard fact.",
"needs": {
"code": "covered",
"note": "the Hagenauer sensor already keeps soft degrees instead of hard labels",
"covered_by": "hagenauer"
}
},
{
"id": "gould",
"name": "Stephen Jay Gould",
"name_ru": "Стивен Джей Гулд",
"years": "1941–2002",
"wiki": "https://en.wikipedia.org/wiki/Stephen_Jay_Gould",
"zone": "one_model",
"idea": {
"en": "Punctuated equilibrium: long plateaus broken by sudden change.",
"ru": "Прерывистое равновесие: долгие плато, прерываемые резкими изменениями.",
"de": "Unterbrochenes Gleichgewicht."
},
"rule": "Do not extend a calm trend as if a jump could not come.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already tells a one-off jump from a lasting shift",
"covered_by": "polyak"
}
},
{
"id": "simon_ha",
"name": "Herbert A. Simon",
"name_ru": "Герберт Саймон",
"years": "1916–2001",
"wiki": "https://en.wikipedia.org/wiki/Herbert_A._Simon",
"zone": "answer_cost",
"idea": {
"en": "Bounded rationality and satisficing: with limited time and information, look for an answer that is good enough.",
"ru": "Ограниченная рациональность и «достаточно хорошее» решение: при ограниченном времени и данных ищи ответ, которого достаточно.",
"de": "Begrenzte Rationalität und Satisficing."
},
"rule": "Stop when the answer is good enough for the purpose, and say where it is limited.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already gives the cheapest chains that answer well enough",
"covered_by": "bertsekas"
}
},
{
"id": "shannon",
"name": "Claude Shannon",
"name_ru": "Клод Шеннон",
"years": "1916–2001",
"wiki": "https://en.wikipedia.org/wiki/Claude_Shannon",
"zone": "measurement_error",
"idea": {
"en": "Information theory: a noisy channel carries only so much information; more precision cannot be squeezed out of it.",
"ru": "Теория информации: зашумлённый канал несёт ограниченное количество информации; больше точности из него не выжать.",
"de": "Informationstheorie: Kanalkapazität begrenzt die Genauigkeit."
},
"rule": "Do not read more precision into a noisy signal than it carries; ask for more data instead.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "lewis_d",
"name": "David Lewis",
"name_ru": "Дэвид Льюис",
"years": "1941–2001",
"wiki": "https://en.wikipedia.org/wiki/David_Lewis_(philosopher)",
"zone": "look_alike",
"idea": {
"en": "Counterparts and counterfactuals: a look-alike in another situation is a counterpart, not the same thing.",
"ru": "Двойники и контрфактические условия: похожий в другой ситуации — двойник, а не тот же самый предмет.",
"de": "Gegenstücktheorie und Kontrafaktische."
},
"rule": "Do not treat a similar case elsewhere as the same case.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "anscombe",
"name": "G. E. M. Anscombe",
"name_ru": "Элизабет Энском",
"years": "1919–2001",
"wiki": "https://en.wikipedia.org/wiki/G._E._M._Anscombe",
"zone": "side_effects",
"idea": {
"en": "'Intention': an act is intended only under a description; describe your act another way to see its other effects.",
"ru": "«Намерение»: действие намеренно только под определённым описанием; опиши свой поступок иначе, чтобы увидеть другие его последствия.",
"de": "„Absicht“: Handlungen unter einer Beschreibung."
},
"rule": "Describe your answer in another way to see what else it does.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "varela",
"name": "Francisco Varela",
"name_ru": "Франсиско Варела",
"years": "1946–2001",
"wiki": "https://en.wikipedia.org/wiki/Francisco_Varela",
"zone": "side_effects",
"idea": {
"en": "Enaction: a system does not just mirror the world; each response changes the environment it then meets.",
"ru": "Энактивизм: система не просто отражает мир; каждый ответ меняет среду, с которой она потом встречается.",
"de": "Enaktivismus: jede Antwort verändert die Umwelt."
},
"rule": "Remember that what you publish changes what you will observe next.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "salmon_w",
"name": "Wesley C. Salmon",
"name_ru": "Уэсли Сэлмон",
"years": "1925–2001",
"wiki": "https://en.wikipedia.org/wiki/Wesley_C._Salmon",
"zone": "one_model",
"idea": {
"en": "Causal processes versus pseudo-processes: a moving shadow correlates with its object but transmits nothing.",
"ru": "Причинные процессы и псевдопроцессы: движущаяся тень совпадает с предметом, но ничего не передаёт.",
"de": "Kausale Prozesse und Pseudoprozesse."
},
"rule": "Before calling a correlation a cause, ask what is actually transmitted.",
"needs": {
"code": "needs_history",
"note": "bridge 'who leads whom' with Granger and the track record sensor: cause or shadow?",
"not_before": "2026-12-14"
}
},
{
"id": "quine",
"name": "W. V. O. Quine",
"name_ru": "Уиллард Куайн",
"years": "1908–2000",
"wiki": "https://en.wikipedia.org/wiki/Willard_Van_Orman_Quine",
"zone": "look_alike",
"idea": {
"en": "Indeterminacy of translation ('gavagai'): the same behaviour fits different meanings; a hypothesis is tested together with all one knows.",
"ru": "Неопределённость перевода («гавагай»): одно и то же поведение совместимо с разными значениями; гипотеза проверяется вместе со всем знанием.",
"de": "Unbestimmtheit der Übersetzung („Gavagai“)."
},
"rule": "State what exactly a term refers to; equal behaviour does not prove equal meaning.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "harsanyi",
"name": "John Harsanyi",
"name_ru": "Джон Харшаньи",
"years": "1920–2000",
"wiki": "https://en.wikipedia.org/wiki/John_Harsanyi",
"zone": "side_effects",
"idea": {
"en": "Games with incomplete information: reason about the possible types of the other side and update as they act.",
"ru": "Игры с неполной информацией: рассуждать о возможных «типах» другой стороны и обновлять оценку по её действиям.",
"de": "Spiele mit unvollständiger Information."
},
"rule": "When you do not know the other side's aims, keep several possibilities and update.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "barwise",
"name": "Jon Barwise",
"name_ru": "Джон Барвайс",
"years": "1942–2000",
"wiki": "https://en.wikipedia.org/wiki/Jon_Barwise",
"zone": "look_alike",
"idea": {
"en": "Situation semantics: a statement is true of a situation; carrying it to another situation needs a check.",
"ru": "Ситуационная семантика: утверждение истинно в ситуации; перенос в другую ситуацию требует проверки.",
"de": "Situationssemantik."
},
"rule": "Check that a conclusion still holds before applying it to a different situation.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "tukey",
"name": "John Tukey",
"name_ru": "Джон Тьюки",
"years": "1915–2000",
"wiki": "https://en.wikipedia.org/wiki/John_Tukey",
"zone": "measurement_error",
"idea": {
"en": "Exploratory data analysis and robust statistics: look at the raw data and its outliers before modelling.",
"ru": "Разведочный анализ данных и робастная статистика: посмотри на сырые данные и выбросы до построения модели.",
"de": "Explorative Datenanalyse und robuste Statistik."
},
"rule": "Look at the raw numbers and their outliers before summarising them.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already shows how far each radar or word moves an index",
"covered_by": "leamer"
}
},
{
"id": "pike",
"name": "Kenneth Pike",
"name_ru": "Кеннет Пайк",
"years": "1912–2000",
"wiki": "https://en.wikipedia.org/wiki/Kenneth_Lee_Pike",
"zone": "look_alike",
"idea": {
"en": "Emic and etic: outside resemblance of forms is not the same as equal function inside a system.",
"ru": "Эмическое и этическое: внешнее сходство форм — не то же, что одинаковая функция внутри системы.",
"de": "Emisch und etisch."
},
"rule": "Do not equate things that look alike from outside but work differently inside.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "leontief",
"name": "Wassily Leontief",
"name_ru": "Василий Леонтьев",
"years": "1905–1999",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9B%D0%B5%D0%BE%D0%BD%D1%82%D1%8C%D0%B5%D0%B2%2C_%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D0%B8%D0%B9_%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D1%8C%D0%B5%D0%B2%D0%B8%D1%87",
"zone": "side_effects",
"idea": {
"en": "Input–output analysis: a change in one sector spreads through all the others it buys from and sells to.",
"ru": "Межотраслевой баланс («затраты — выпуск»): изменение в одной отрасли расходится по всем, у кого она покупает и кому продаёт.",
"de": "Input-Output-Analyse: eine Änderung in einem Sektor breitet sich über alle anderen aus."
},
"rule": "Follow a shock past its first stop: ask which other areas it feeds into.",
"needs": {
"code": "needs_history",
"note": "bridge 'spill-over between radars' (Leontief + Granger + Haavelmo): only the geo and crypto radar levels are stored, and the geo radar barely moves (70–73 over 11 days); all eight radar levels need to be stored for a few weeks",
"not_before": "2026-12-21"
}
},
{
"id": "haavelmo",
"name": "Trygve Haavelmo",
"name_ru": "Трюгве Ховельмо",
"years": "1911–1999",
"wiki": "https://ru.wikipedia.org/wiki/%D0%A5%D0%BE%D0%B2%D0%B5%D0%BB%D1%8C%D0%BC%D0%BE%2C_%D0%A2%D1%80%D1%8E%D0%B3%D0%B2%D0%B5",
"zone": "one_model",
"idea": {
"en": "The probability approach to econometrics: economic laws hold only with probability, and a correlation in data does not by itself identify the structure behind it.",
"ru": "Вероятностный подход в эконометрике: экономические законы верны лишь с вероятностью, а корреляция в данных сама по себе не выявляет стоящую за ней структуру.",
"de": "Wahrscheinlichkeitsansatz der Ökonometrie."
},
"rule": "Do not read a structure off a correlation; say which assumptions identify it.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "griliches",
"name": "Zvi Griliches",
"name_ru": "Цви Грилихес",
"years": "1930–1999",
"wiki": "https://ru.wikipedia.org/wiki/%D0%93%D1%80%D0%B8%D0%BB%D0%B8%D1%85%D0%B5%D1%81%2C_%D0%A6%D0%B2%D0%B8",
"zone": "measurement_error",
"idea": {
"en": "Errors in data: noisy measurements make real relationships look weaker than they are, and 'the data are the problem' more often than the model.",
"ru": "Ошибки в данных: шумные измерения делают настоящие связи слабее, чем они есть, и чаще проблема в данных, а не в модели.",
"de": "Messfehler: verrauschte Daten schwächen echte Zusammenhänge ab."
},
"rule": "If a link looks weak, ask first how noisy the measurements are.",
"needs": {
"code": "covered",
"note": "the track record sensor already reports intervals; noisy radar readings make real links look weaker",
"covered_by": "trackrecord"
}
},
{
"id": "lancaster",
"name": "Kelvin Lancaster",
"name_ru": "Келвин Ланкастер",
"years": "1924–1999",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9B%D0%B0%D0%BD%D0%BA%D0%B0%D1%81%D1%82%D0%B5%D1%80%2C_%D0%9A%D0%B5%D0%BB%D0%B2%D0%B8%D0%BD",
"zone": "side_effects",
"idea": {
"en": "The theory of the second best (with Lipsey): removing one distortion while others remain can make things worse.",
"ru": "Теория второго лучшего (с Липси): если убрать одно искажение, а другие остаются, может стать хуже.",
"de": "Theorie des Zweitbesten (mit Lipsey)."
},
"rule": "Do not assume that fixing one flaw improves the whole while other flaws remain.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "knorozov",
"name": "Yuri Knorozov",
"name_ru": "Юрий Кнорозов",
"years": "1922–1999",
"wiki": "https://ru.wikipedia.org/wiki/%D0%9A%D0%BD%D0%BE%D1%80%D0%BE%D0%B7%D0%BE%D0%B2%2C_%D0%AE%D1%80%D0%B8%D0%B9_%D0%92%D0%B0%D0%BB%D0%B5%D0%BD%D1%82%D0%B8%D0%BD%D0%BE%D0%B2%D0%B8%D1%87",
"zone": "look_alike",
"idea": {
"en": "Deciphering the Maya script: count the signs and their positions before deciding what kind of writing it is — similar-looking signs may work differently.",
"ru": "Дешифровка письменности майя: сначала посчитать знаки и их позиции, а потом решать, что это за письмо, — похожие знаки могут работать по-разному.",
"de": "Entzifferung der Maya-Schrift: erst Zeichen zählen, dann deuten."
},
"rule": "Count and compare before you interpret: similar signs may play different roles.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "osgood",
"name": "Charles E. Osgood",
"name_ru": "Чарльз Осгуд",
"years": "1916–1991",
"wiki": "https://en.wikipedia.org/wiki/Charles_E._Osgood",
"zone": "measurement_error",
"idea": {
"en": "The semantic differential: the feeling a word carries can be measured on three scales — good–bad, strong–weak, active–passive.",
"ru": "Семантический дифференциал: эмоциональную окраску слова можно измерить по трём шкалам — хорошо–плохо, сильно–слабо, активно–пассивно.",
"de": "Semantisches Differential: Bewertung, Stärke, Aktivität."
},
"rule": "Separate what a headline says from the emotional charge of its words.",
"needs": {
"code": "needs_source",
"note": "bridge 'tone in three dimensions' (Osgood + Kasperson + news passport): needs an open evaluation–potency–activity word list in English, German and Russian that may be used live"
}
},
{
"id": "hayek",
"name": "Friedrich Hayek",
"name_ru": "Фридрих Хайек",
"years": "1899–1992",
"wiki": "https://en.wikipedia.org/wiki/Friedrich_Hayek",
"zone": "own_limits",
"idea": {
"en": "'The Use of Knowledge in Society' and 'The Pretence of Knowledge': knowledge is spread across many people and places; no single planner has it all.",
"ru": "«Использование знания в обществе» и «Претензия знания»: знание рассеяно по множеству людей и мест, ни у одного планировщика его нет целиком.",
"de": "„Die Verwertung des Wissens in der Gesellschaft“ und „Die Anmaßung von Wissen“."
},
"rule": "Do not speak as if you had all the local knowledge; say what you cannot see from where you are.",
"needs": {
"code": "covered",
"note": "applied: Grok, David and the round-table guests say 'not known yet' where the facts stop"
}
},
{
"id": "greimas",
"name": "Algirdas Julien Greimas",
"name_ru": "Альгирдас Греймас",
"years": "1917–1992",
"wiki": "https://en.wikipedia.org/wiki/Algirdas_Julien_Greimas",
"zone": "look_alike",
"idea": {
"en": "The semiotic square: 'not true' is not the same as 'false' — contraries and contradictories are different.",
"ru": "Семиотический квадрат: «не истинно» — не то же, что «ложно»; противоположность и противоречие — разные вещи.",
"de": "Semiotisches Quadrat: „nicht wahr“ ist nicht „falsch“."
},
"rule": "Do not turn 'not confirmed' into 'denied'.",
"needs": {
"code": "covered",
"note": "check_headline already keeps 'neither' apart from 'denied' (sources_agree, four values)",
"covered_by": "frankfurt"
}
},
{
"id": "moles",
"name": "Abraham Moles",
"name_ru": "Абрахам Моль",
"years": "1920–1992",
"wiki": "https://en.wikipedia.org/wiki/Abraham_Moles",
"zone": "stale_data",
"idea": {
"en": "Information theory of perception: a message informs only by what is new in it; redundancy is what we already expect.",
"ru": "Теория информации и восприятие: сообщение информирует только новым в нём; избыточность — то, чего мы и так ожидаем.",
"de": "Informationstheorie der Wahrnehmung: nur das Neue informiert."
},
"rule": "Tell what is new; skip what the listener already knows.",
"needs": {
"code": "covered",
"note": "the Ziv sensor already measures how much in the headlines is new",
"covered_by": "ziv"
}
},
{
"id": "harris_z",
"name": "Zellig Harris",
"name_ru": "Зеллиг Харрис",
"years": "1909–1992",
"wiki": "https://en.wikipedia.org/wiki/Zellig_Harris",
"zone": "look_alike",
"idea": {
"en": "Distributional analysis: words used in similar contexts tend to have similar meanings — the root of today's word embeddings, and of their errors.",
"ru": "Дистрибутивный анализ: слова в похожих контекстах обычно похожи по смыслу — корень нынешних векторных представлений и их ошибок.",
"de": "Distributionelle Analyse: ähnliche Kontexte, ähnliche Bedeutung."
},
"rule": "Similar context suggests similar meaning but does not prove it; check before merging two terms.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "skinner_bf",
"name": "B. F. Skinner",
"name_ru": "Беррес Фредерик Скиннер",
"years": "1904–1990",
"wiki": "https://en.wikipedia.org/wiki/B._F._Skinner",
"zone": "own_limits",
"idea": {
"en": "'Superstition in the pigeon': rewards that come by chance make a learner repeat whatever it happened to be doing — a rule built from coincidences.",
"ru": "«Суеверие у голубя»: случайные награды заставляют повторять то, что делал в тот момент, — правило, выстроенное из совпадений.",
"de": "„Aberglaube bei der Taube“: zufällige Belohnungen erzeugen Scheinregeln."
},
"rule": "Do not build a rule from a few lucky coincidences; count how often it really held.",
"needs": {
"code": "covered",
"note": "the track record sensor already refuses a conclusion with fewer than 8 days and shows the radar's ordinary noise",
"covered_by": "trackrecord"
}
},
{
"id": "konus",
"name": "Alexander Konüs",
"name_ru": "Александр Конюс",
"years": "1895–1990",
"wiki": "https://en.wikipedia.org/wiki/Alexander_Kon%C3%BCs",
"zone": "measurement_error",
"idea": {
"en": "The Konüs true cost-of-living index: a price index measures the cost of keeping the same standard of living, which a fixed basket only approximates.",
"ru": "Истинный индекс стоимости жизни Конюса: индекс цен измеряет, сколько стоит сохранить прежний уровень жизни, а фиксированная корзина лишь приближает это.",
"de": "Konüs-Index der Lebenshaltungskosten."
},
"rule": "Say what a price index actually measures before saying what it means for a household.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces what every published number measures, with its source and unit",
"covered_by": "baird"
}
},
{
"id": "elias",
"name": "Norbert Elias",
"name_ru": "Норберт Элиас",
"years": "1897–1990",
"wiki": "https://en.wikipedia.org/wiki/Norbert_Elias",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Involvement and Detachment': strong emotional involvement in events distorts knowledge of them.",
"ru": "«Вовлечённость и отстранённость»: сильная эмоциональная вовлечённость в события искажает знание о них.",
"de": "„Engagement und Distanzierung“."
},
"rule": "Keep the tone of an alarming story from shaping what you claim about it.",
"needs": {
"code": "needs_source",
"note": "joins the bridge 'tone in three dimensions' (Osgood): needs an open word list to measure how charged a headline is"
}
},
{
"id": "lachmann",
"name": "Ludwig Lachmann",
"name_ru": "Людвиг Лахманн",
"years": "1906–1990",
"wiki": "https://en.wikipedia.org/wiki/Ludwig_Lachmann",
"zone": "one_model",
"idea": {
"en": "Radical uncertainty and the 'kaleidic' economy: expectations differ between people and can rearrange the picture suddenly.",
"ru": "Радикальная неопределённость и «калейдоскопическая» экономика: ожидания у людей разные и могут внезапно перестроить всю картину.",
"de": "Radikale Unsicherheit und „kaleidische“ Wirtschaft."
},
"rule": "Do not assume everyone reads the same data the same way; expectations can flip the picture.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "maslov",
"name": "Yuri Maslov",
"name_ru": "Юрий Маслов",
"years": "1914–1990",
"wiki": "https://en.wikipedia.org/wiki/Yuri_Maslov",
"zone": "rumour_vs_fact",
"idea": {
"en": "Theory of verbal aspect: a completed action and an ongoing or planned one are different, and languages mark the difference.",
"ru": "Теория вида глагола: завершённое действие и длящееся или запланированное — разные вещи, и язык это различает.",
"de": "Aspekttheorie: abgeschlossene und andauernde Handlung."
},
"rule": "Check whether a verb says it is done, is happening or is only intended.",
"needs": {
"code": "covered",
"note": "the Searle sensor and the news passport already tell an event from a promise, plan or threat",
"covered_by": "searle"
}
},
{
"id": "hopper",
"name": "Grace Hopper",
"name_ru": "Грейс Хоппер",
"years": "1906–1992",
"wiki": "https://en.wikipedia.org/wiki/Grace_Hopper",
"zone": "answer_cost",
"idea": {
"en": "Making invisible costs visible: she handed out 30-cm wires to show what a nanosecond is — the distance light travels — so people would feel the cost of delay.",
"ru": "Сделать невидимую цену видимой: она раздавала 30-сантиметровые проводки, чтобы показать наносекунду — путь света, — и люди почувствовали цену задержки.",
"de": "Unsichtbare Kosten sichtbar machen: das Nanosekunden-Kabel."
},
"rule": "Show the cost of an answer in concrete units (time, tokens, money), not as an abstraction.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already shows the cost of every tool answer in tokens",
"covered_by": "bertsekas"
}
},
{
"id": "aizerman",
"name": "Mark Aizerman",
"name_ru": "Марк Айзерман",
"years": "1913–1992",
"wiki": "https://en.wikipedia.org/wiki/Mark_Aizerman",
"zone": "look_alike",
"idea": {
"en": "The method of potential functions (a forerunner of the kernel trick) and the theory of choice: similarity is something you choose to measure, and the choice shapes the result.",
"ru": "Метод потенциальных функций (предшественник «ядерного трюка») и теория выбора: сходство — это то, как ты решил его измерять, и выбор меры определяет результат.",
"de": "Potentialfunktionen und Wahltheorie."
},
"rule": "Say which measure of similarity you used before calling two things alike.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "anders",
"name": "Günther Anders",
"name_ru": "Гюнтер Андерс",
"years": "1902–1992",
"wiki": "https://en.wikipedia.org/wiki/G%C3%BCnther_Anders",
"zone": "side_effects",
"idea": {
"en": "The 'Promethean gap': people can make more than they can imagine the consequences of.",
"ru": "«Прометеев разрыв»: люди способны создать больше, чем способны представить себе последствия.",
"de": "„Das prometheische Gefälle“."
},
"rule": "Before acting at scale, try to picture the consequences concretely, not only the intended effect.",
"needs": {
"code": "needs_idea",
"note": "no live measurable form found yet"
}
},
{
"id": "bertrand",
"name": "Joseph Bertrand",
"name_ru": "Жозеф Бертран",
"years": "1822–1900",
"wiki": "https://en.wikipedia.org/wiki/Joseph_Bertrand",
"zone": "one_model",
"idea": {
"en": "Bertrand's paradox (1889): 'choose a chord at random' gives three different probabilities depending on how the randomness is set up.",
"ru": "Парадокс Бертрана (1889): «выберем хорду наугад» даёт три разные вероятности в зависимости от того, как задана случайность.",
"de": "Bertrand-Paradoxon: „zufällig“ ergibt je nach Modell verschiedene Wahrscheinlichkeiten."
},
"rule": "Before saying 'at random' or 'by chance', say how the chance was defined; another setup gives another answer.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already recomputes each index under all reasonable model variants",
"covered_by": "leamer"
}
},
{
"id": "sidgwick",
"name": "Henry Sidgwick",
"name_ru": "Генри Сиджвик",
"years": "1838–1900",
"wiki": "https://en.wikipedia.org/wiki/Henry_Sidgwick",
"zone": "side_effects",
"idea": {
"en": "'Principles of Political Economy' (1883): private gain and public gain can diverge — a lighthouse helps ships that never pay for it.",
"ru": "«Принципы политической экономии» (1883): частная и общественная выгода могут расходиться — маяк помогает и тем судам, что за него не платят.",
"de": "Privater und gesellschaftlicher Nutzen können auseinanderfallen (Leuchtturm-Beispiel)."
},
"rule": "Ask who gains and who pays besides the actor in the story.",
"needs": {
"code": "needs_idea",
"note": "name who bears costs or gains besides the actor in a story; no open way yet to measure it from headlines"
}
},
{
"id": "max_mueller",
"name": "Friedrich Max Müller",
"name_ru": "Фридрих Макс Мюллер",
"years": "1823–1900",
"wiki": "https://en.wikipedia.org/wiki/Max_M%C3%BCller",
"zone": "look_alike",
"idea": {
"en": "'Mythology is a disease of language': metaphors taken literally turn into imagined beings and events.",
"ru": "«Мифология — болезнь языка»: метафоры, понятые буквально, превращаются в выдуманные существа и события.",
"de": "„Mythologie ist eine Krankheit der Sprache“: wörtlich genommene Metaphern."
},
"rule": "Do not take a headline metaphor ('price war', 'tsunami of layoffs') as a literal fact.",
"needs": {
"code": "needs_source",
"note": "joins the bridge 'tone in three dimensions' (Osgood): needs an open list of news metaphors in English, German and Russian"
}
},
{
"id": "schmidt_j",
"name": "Johannes Schmidt",
"name_ru": "Йоханнес Шмидт",
"years": "1843–1901",
"wiki": "https://en.wikipedia.org/wiki/Johannes_Schmidt_(linguist)",
"zone": "rumour_vs_fact",
"idea": {
"en": "The wave theory (1872): language changes spread like waves between neighbours, not only down a family tree.",
"ru": "Волновая теория (1872): изменения в языке расходятся волнами между соседями, а не только вниз по родословному древу.",
"de": "Wellentheorie (1872): Neuerungen breiten sich wie Wellen zwischen Nachbarn aus."
},
"rule": "A shared wording may come from neighbours copying each other, not from one common source; check both.",
"needs": {
"code": "needs_history",
"note": "bridge 'tree or wave' (Schmidt + Schleicher + Tarde): radar_life keeps only the first source of a story; the times when each outlet joined are needed",
"not_before": "2026-12-21"
}
},
{
"id": "powell",
"name": "John Wesley Powell",
"name_ru": "Джон Уэсли Пауэлл",
"years": "1834–1902",
"wiki": "https://en.wikipedia.org/wiki/John_Wesley_Powell",
"zone": "side_effects",
"idea": {
"en": "'Report on the Lands of the Arid Region' (1878): settlement of the American West must follow the limits of water, not the straight lines of the map.",
"ru": "«Доклад о землях засушливого региона» (1878): заселение американского Запада должно следовать пределам воды, а не прямым линиям на карте.",
"de": "Bericht über die Trockengebiete (1878): Besiedlung nach Wassergrenzen, nicht nach Kartenlinien."
},
"rule": "Before scaling a plan up, find the resource that limits it.",
"needs": {
"code": "needs_idea",
"note": "find the limiting resource behind a plan in the news; no measurable form yet"
}
},
{
"id": "gibbs",
"name": "Josiah Willard Gibbs",
"name_ru": "Джозайя Уиллард Гиббс",
"years": "1839–1903",
"wiki": "https://en.wikipedia.org/wiki/Josiah_Willard_Gibbs",
"zone": "measurement_error",
"idea": {
"en": "The Gibbs phenomenon (1899): when smooth waves approximate a sudden jump, they overshoot it by about 9% however many waves you add.",
"ru": "Явление Гиббса (1899): когда плавные волны приближают резкий скачок, они перелетают его примерно на 9 %, сколько волн ни добавляй.",
"de": "Gibbs-Phänomen (1899): glatte Näherungen überschießen einen Sprung um etwa 9 %."
},
"rule": "Near a sudden jump, a smoothed curve shows peaks that are not in the data; read the raw values.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already tells a one-off jump from a lasting shift in raw index values",
"covered_by": "polyak"
}
},
{
"id": "tarde",
"name": "Gabriel Tarde",
"name_ru": "Габриэль Тард",
"years": "1843–1904",
"wiki": "https://en.wikipedia.org/wiki/Gabriel_Tarde",
"zone": "rumour_vs_fact",
"idea": {
"en": "'The Laws of Imitation' (1890): ideas, fashions and rumours spread by copying, and each copy shifts them a little.",
"ru": "«Законы подражания» (1890): идеи, мода и слухи распространяются через подражание, и каждая копия немного их сдвигает.",
"de": "„Die Gesetze der Nachahmung“ (1890)."
},
"rule": "A story that spreads by copying grows in reach, not in proof; go back to the first version.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor already shows how retellings spread a story from few to many outlets",
"covered_by": "kasperson"
}
},
{
"id": "tannery",
"name": "Paul Tannery",
"name_ru": "Поль Таннери",
"years": "1843–1904",
"wiki": "https://en.wikipedia.org/wiki/Paul_Tannery",
"zone": "rumour_vs_fact",
"idea": {
"en": "Historian of Greek science and editor of the works of Fermat and Descartes from the manuscripts: what we know of ancient ideas passed through copyists and translators.",
"ru": "Историк греческой науки, издатель трудов Ферма и Декарта по рукописям: то, что мы знаем об античных идеях, прошло через переписчиков и переводчиков.",
"de": "Herausgeber von Fermat und Descartes nach den Handschriften."
},
"rule": "When a claim reached you through retellings and translations, look for the original wording.",
"needs": {
"code": "covered",
"note": "applied: the news passport names the first source of a story and asks to credit it, not the count of retellings"
}
},
{
"id": "stephen_l",
"name": "Leslie Stephen",
"name_ru": "Лесли Стивен",
"years": "1832–1904",
"wiki": "https://en.wikipedia.org/wiki/Leslie_Stephen",
"zone": "stale_data",
"idea": {
"en": "First editor of the 'Dictionary of National Biography' (1885–1891): every entry built from sources and corrected in later editions.",
"ru": "Первый редактор «Национального биографического словаря» (1885–1891): каждая статья строилась по источникам и исправлялась в следующих изданиях.",
"de": "Erster Herausgeber des „Dictionary of National Biography“."
},
"rule": "A reference entry is only as good as its sources and its last correction; check both.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces every number to its source and time",
"covered_by": "baird"
}
},
{
"id": "abbe",
"name": "Ernst Abbe",
"name_ru": "Эрнст Аббе",
"years": "1840–1905",
"wiki": "https://en.wikipedia.org/wiki/Ernst_Abbe",
"zone": "own_limits",
"idea": {
"en": "The Abbe limit (1873): a microscope cannot resolve details smaller than about half the wavelength of light; below that you see artefacts of the instrument.",
"ru": "Предел Аббе (1873): микроскоп не различает детали меньше примерно половины длины волны света; за этим пределом видны артефакты прибора, а не объект.",
"de": "Abbe-Grenze (1873): unterhalb der Auflösung sieht man Artefakte des Instruments."
},
"rule": "A change smaller than your instrument's resolution is not a finding; say it is within the noise.",
"needs": {
"code": "covered",
"note": "the track record sensor already shows the radar's ordinary noise (radar_noise), so changes inside it are not findings",
"covered_by": "trackrecord"
}
},
{
"id": "weldon",
"name": "Walter Frank Raphael Weldon",
"name_ru": "Уолтер Фрэнк Рафаэль Уэлдон",
"years": "1860–1906",
"wiki": "https://en.wikipedia.org/wiki/Walter_Frank_Raphael_Weldon",
"zone": "measurement_error",
"idea": {
"en": "Weldon's dice (1894): 26,306 throws of twelve dice showed fives and sixes slightly too often — the 'obviously fair' dice were not; Pearson used the counts to test his chi-squared method.",
"ru": "Кости Уэлдона (1894): 26 306 бросков двенадцати костей показали, что пятёрки и шестёрки выпадают чуть чаще, — «очевидно честные» кости оказались не такими; Пирсон проверил на этих подсчётах свой метод хи-квадрат.",
"de": "Weldons Würfel (1894): 26 306 Würfe zeigten, dass „faire“ Würfel nicht fair waren."
},
"rule": "Test even an obvious assumption ('this sample is random', 'this source is neutral') with counts.",
"needs": {
"code": "needs_idea",
"note": "test whether the headlines chosen for the air are a fair sample of all radar headlines (by radar, outlet and language)"
}
},
{
"id": "mendeleev",
"name": "Dmitri Mendeleev",
"name_ru": "Дмитрий Менделеев",
"years": "1834–1907",
"wiki": "https://en.wikipedia.org/wiki/Dmitri_Mendeleev",
"zone": "own_limits",
"idea": {
"en": "The periodic table (1869): he left empty cells and predicted the properties of elements not yet found (gallium, scandium, germanium) instead of forcing the known ones to fit.",
"ru": "Периодическая таблица (1869): он оставил пустые клетки и предсказал свойства ещё не открытых элементов (галлий, скандий, германий), вместо того чтобы втиснуть известные.",
"de": "Periodensystem (1869): leere Felder und Vorhersagen statt erzwungener Ordnung."
},
"rule": "Show the gap where data are missing instead of filling it with a guess.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already reports coverage gaps of the feed instead of hiding them",
"covered_by": "lyberg"
}
},
{
"id": "kelvin",
"name": "William Thomson, Lord Kelvin",
"name_ru": "Уильям Томсон (лорд Кельвин)",
"years": "1824–1907",
"wiki": "https://en.wikipedia.org/wiki/William_Thomson,_1st_Baron_Kelvin",
"zone": "own_limits",
"idea": {
"en": "'When you can measure what you are speaking about, you know something about it' — yet his careful calculation of the Earth's age (tens of millions of years) was far too low, because it left out a heat source unknown at the time.",
"ru": "«Если вы можете измерить то, о чём говорите, вы что-то об этом знаете», — и всё же его тщательный расчёт возраста Земли (десятки миллионов лет) оказался сильно занижен: в нём не было неизвестного тогда источника тепла.",
"de": "Präzise Messung – und doch ein viel zu junges Erdalter, weil eine Wärmequelle fehlte."
},
"rule": "A precise calculation can still be wrong by a missing factor; say what your numbers leave out.",
"needs": {
"code": "covered",
"note": "applied: hosts say where the known facts stop; the Leamer sensor shows how far an index depends on what the model includes"
}
},
{
"id": "james_w",
"name": "William James",
"name_ru": "Уильям Джеймс",
"years": "1842–1910",
"wiki": "https://en.wikipedia.org/wiki/William_James",
"zone": "look_alike",
"idea": {
"en": "The pragmatic test (1907): if two claims make no difference to anything anyone would do or observe, the dispute is about words.",
"ru": "Прагматический тест (1907): если два утверждения не меняют ничего в том, что кто-то сделает или увидит, спор идёт о словах.",
"de": "Pragmatischer Test: ein Unterschied, der keinen Unterschied macht, ist keiner."
},
"rule": "Before arguing which wording is right, ask what would differ in practice.",
"needs": {
"code": "covered",
"note": "applied: check_headline merges headlines that differ only in wording (typo_or_small_rewrite), a difference that makes no difference"
}
},
{
"id": "walras",
"name": "Léon Walras",
"name_ru": "Леон Вальрас",
"years": "1834–1910",
"wiki": "https://en.wikipedia.org/wiki/L%C3%A9on_Walras",
"zone": "side_effects",
"idea": {
"en": "General equilibrium (1874): all markets are linked, so a price change in one moves prices in all the others.",
"ru": "Общее равновесие (1874): все рынки связаны, поэтому изменение цены на одном двигает цены на всех остальных.",
"de": "Allgemeines Gleichgewicht (1874): alle Märkte hängen zusammen."
},
"rule": "Ask what a change in one market does to the markets linked to it.",
"needs": {
"code": "needs_history",
"note": "bridge 'spill-over between radars' (Leontief + Walras + Quesnay): all eight radar levels are stored since 23.11.2026",
"not_before": "2026-12-21"
}
},
{
"id": "sumner",
"name": "William Graham Sumner",
"name_ru": "Уильям Грэм Самнер",
"years": "1840–1910",
"wiki": "https://en.wikipedia.org/wiki/William_Graham_Sumner",
"zone": "own_limits",
"idea": {
"en": "'Folkways' (1906) introduced 'ethnocentrism': judging other groups by the habits of one's own as if they were the standard.",
"ru": "«Народные обычаи» (1906) ввели понятие «этноцентризм»: судить другие группы по привычкам своей так, будто это эталон.",
"de": "„Folkways“ (1906): Begriff des Ethnozentrismus."
},
"rule": "Notice when a story judges another country or group by your own country's habits.",
"needs": {
"code": "needs_idea",
"note": "flag headlines that judge another country by local norms; no measurable form yet"
}
},
{
"id": "dilthey",
"name": "Wilhelm Dilthey",
"name_ru": "Вильгельм Дильтей",
"years": "1833–1911",
"wiki": "https://en.wikipedia.org/wiki/Wilhelm_Dilthey",
"zone": "look_alike",
"idea": {
"en": "'Introduction to the Human Sciences' (1883): nature is explained by causes, human action is understood through meaning — two different kinds of knowing.",
"ru": "«Введение в науки о духе» (1883): природу объясняют через причины, человеческие поступки понимают через смысл — это два разных способа знать.",
"de": "„Einleitung in die Geisteswissenschaften“ (1883): Erklären und Verstehen."
},
"rule": "Keep 'why it happened' (causes) apart from 'what they meant by it' (interpretation); do not present one as the other.",
"needs": {
"code": "needs_idea",
"note": "tell explanation from interpretation in headlines ('because' vs 'signals'); no measurable form yet"
}
},
{
"id": "poincare",
"name": "Henri Poincaré",
"name_ru": "Анри Пуанкаре",
"years": "1854–1912",
"wiki": "https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9",
"zone": "one_model",
"idea": {
"en": "Studying the three-body problem (1890) he found that tiny differences in the starting point can grow into completely different outcomes; 'Science and Hypothesis' (1902) on conventions in theories.",
"ru": "Изучая задачу трёх тел (1890), он обнаружил, что крошечные различия в начальной точке могут вырасти в совсем разные исходы; «Наука и гипотеза» (1902) — об условностях в теориях.",
"de": "Dreikörperproblem (1890): kleine Anfangsunterschiede, ganz andere Ergebnisse."
},
"rule": "Where small changes in the input can swing the result, do not extend the trend far ahead.",
"needs": {
"code": "needs_history",
"note": "bridge 'horizon and tails' (Lorenz + Mandelbrot + Poincaré): how far ahead the radar still tells anything",
"not_before": "2026-12-14"
}
},
{
"id": "saussure",
"name": "Ferdinand de Saussure",
"name_ru": "Фердинанд де Соссюр",
"years": "1857–1913",
"wiki": "https://en.wikipedia.org/wiki/Ferdinand_de_Saussure",
"zone": "look_alike",
"idea": {
"en": "'Course in General Linguistics' (1916): the sign is arbitrary; a word gets its value from its place among other words, and the state of a language now differs from its history.",
"ru": "«Курс общей лингвистики» (1916): знак произволен; слово получает значение от своего места среди других слов, а состояние языка сейчас — не то же, что его история.",
"de": "„Cours de linguistique générale“ (1916): Zeichen, System, Synchronie und Diachronie."
},
"rule": "Do not confuse the word with the thing; check what a term means in this text now, not what it once meant.",
"needs": {
"code": "covered",
"note": "applied: the passport flags metaphors and the echo check compares meanings, not spellings"
}
},
{
"id": "peirce",
"name": "Charles Sanders Peirce",
"name_ru": "Чарльз Сандерс Пирс",
"years": "1839–1914",
"wiki": "https://en.wikipedia.org/wiki/Charles_Sanders_Peirce",
"zone": "own_limits",
"idea": {
"en": "Abduction and fallibilism: the best explanation found so far is a hypothesis to test, never a settled fact.",
"ru": "Абдукция и фаллибилизм: лучшее найденное объяснение — это гипотеза для проверки, а не установленный факт.",
"de": "Abduktion und Fallibilismus."
},
"rule": "Call your best explanation a hypothesis, name at least one alternative and what would tell them apart.",
"needs": {
"code": "covered",
"note": "applied: hosts say where the facts stop and the passport keeps statements, forecasts and questions apart from events"
}
},
{
"id": "duhem",
"name": "Pierre Duhem",
"name_ru": "Пьер Дюэм",
"years": "1861–1916",
"wiki": "https://en.wikipedia.org/wiki/Pierre_Duhem",
"zone": "one_model",
"idea": {
"en": "'The Aim and Structure of Physical Theory' (1906): a hypothesis is never tested alone but together with auxiliary assumptions; a failed test does not say which one was wrong.",
"ru": "«Физическая теория, её цель и строение» (1906): гипотезу никогда не проверяют одну — только вместе со вспомогательными допущениями; неудачная проверка не говорит, какое из них ошибочно.",
"de": "„Ziel und Struktur der physikalischen Theorien“ (1906)."
},
"rule": "When a fact contradicts your model, ask which assumption failed before throwing the whole model away.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already shows which model choice moves an index",
"covered_by": "leamer"
}
},
{
"id": "lyapunov",
"name": "Aleksandr Lyapunov",
"name_ru": "Александр Ляпунов",
"years": "1857–1918",
"wiki": "https://en.wikipedia.org/wiki/Aleksandr_Lyapunov",
"zone": "one_model",
"idea": {
"en": "'The General Problem of the Stability of Motion' (1892): a state is stable if small disturbances stay small; he also proved the central limit theorem under general conditions (1901).",
"ru": "«Общая задача об устойчивости движения» (1892): состояние устойчиво, если малые возмущения остаются малыми; он же доказал центральную предельную теорему в общих условиях (1901).",
"de": "Stabilität der Bewegung (1892); zentraler Grenzwertsatz (1901)."
},
"rule": "Before trusting a conclusion, nudge the inputs a little and see whether it holds.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already recomputes each index under small changes of the model",
"covered_by": "leamer"
}
},
{
"id": "shakhmatov",
"name": "Aleksey Shakhmatov",
"name_ru": "Алексей Шахматов",
"years": "1864–1920",
"wiki": "https://en.wikipedia.org/wiki/Aleksey_Shakhmatov",
"zone": "rumour_vs_fact",
"idea": {
"en": "He showed that the Russian Primary Chronicle is a stack of earlier compilations and reconstructed its layers and their dates.",
"ru": "Он показал, что «Повесть временных лет» — это наслоение более ранних летописных сводов, и восстановил эти слои и их даты.",
"de": "Er rekonstruierte die älteren Schichten der Nestorchronik."
},
"rule": "A text that combines older sources should be split into its layers before you date or trust any line.",
"needs": {
"code": "covered",
"note": "applied: the news passport names the first source of a story"
}
},
{
"id": "galton",
"name": "Francis Galton",
"name_ru": "Фрэнсис Гальтон",
"years": "1822–1911",
"wiki": "https://en.wikipedia.org/wiki/Francis_Galton",
"zone": "measurement_error",
"idea": {
"en": "Regression toward the mean (1886): extreme results tend to be followed by more ordinary ones; 'Vox populi' (1907): the median of 787 independent guesses of an ox's weight was within 1%. (His eugenics is rejected; the statistical ideas stand.)",
"ru": "Регрессия к среднему (1886): за крайними результатами обычно следуют более обычные; «Глас народа» (1907): медиана 787 независимых догадок о весе быка ошиблась меньше чем на 1 %. (Его евгеника отвергнута; статистические идеи остаются.)",
"de": "Regression zur Mitte (1886); „Vox populi“ (1907)."
},
"rule": "After an extreme reading, expect a return toward normal before calling it a new trend.",
"needs": {
"code": "covered",
"note": "the Polyak sensor already tells a one-off jump from a lasting shift",
"covered_by": "polyak"
}
},
{
"id": "binet",
"name": "Alfred Binet",
"name_ru": "Альфред Бине",
"years": "1857–1911",
"wiki": "https://en.wikipedia.org/wiki/Alfred_Binet",
"zone": "rumour_vs_fact",
"idea": {
"en": "'La suggestibilité' (1900): leading questions change what witnesses report — the wording of a question shapes the answer.",
"ru": "«Внушаемость» (1900): наводящие вопросы меняют то, что рассказывают свидетели, — формулировка вопроса формирует ответ.",
"de": "„La suggestibilité“ (1900): Suggestivfragen verändern Aussagen."
},
"rule": "Notice when a question already contains its answer; ask it in neutral words.",
"needs": {
"code": "covered",
"note": "applied: hosts correct a false or leading premise in a question instead of answering yes or no"
}
},
{
"id": "lexis",
"name": "Wilhelm Lexis",
"name_ru": "Вильгельм Лексис",
"years": "1837–1914",
"wiki": "https://en.wikipedia.org/wiki/Wilhelm_Lexis",
"zone": "measurement_error",
"idea": {
"en": "The dispersion ratio (1877): compare how much a rate really varies over time with how much it would vary by chance alone.",
"ru": "Коэффициент дисперсии (1877): сравнивать, насколько показатель на самом деле колеблется во времени, с тем, насколько он колебался бы по чистой случайности.",
"de": "Dispersionsquotient (1877)."
},
"rule": "Before explaining a swing, check whether chance alone would produce swings that big.",
"needs": {
"code": "covered",
"note": "the track record sensor already reports the radar's ordinary noise (radar_noise)",
"covered_by": "trackrecord"
}
},
{
"id": "muensterberg",
"name": "Hugo Münsterberg",
"name_ru": "Гуго Мюнстерберг",
"years": "1863–1916",
"wiki": "https://en.wikipedia.org/wiki/Hugo_M%C3%BCnsterberg",
"zone": "rumour_vs_fact",
"idea": {
"en": "'On the Witness Stand' (1908): honest eyewitnesses misremember and fill gaps; confidence does not mean accuracy.",
"ru": "«На месте свидетеля» (1908): честные очевидцы ошибаются в памяти и заполняют пробелы; уверенность не означает точности.",
"de": "„On the Witness Stand“ (1908): Zeugenaussagen sind unzuverlässig."
},
"rule": "One eyewitness account, however confident, is a report to check, not proof.",
"needs": {
"code": "covered",
"note": "check_headline already counts independent voices; the passport says when only one outlet reports",
"covered_by": "frankfurt"
}
},
{
"id": "weber_m",
"name": "Max Weber",
"name_ru": "Макс Вебер",
"years": "1864–1920",
"wiki": "https://en.wikipedia.org/wiki/Max_Weber",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Science as a Vocation' (1917) and value freedom: keep statements of fact apart from judgements of what ought to be.",
"ru": "«Наука как призвание и профессия» (1917) и свобода от оценок: отделять утверждения о фактах от суждений о том, как должно быть.",
"de": "„Wissenschaft als Beruf“ (1917): Werturteilsfreiheit."
},
"rule": "Mark which sentence is a fact and which is a judgement; do not slip a judgement in as a fact.",
"needs": {
"code": "needs_idea",
"note": "mark value words in headlines (should, must, scandal, disgrace) apart from facts; joins the 'tone' bridge"
}
},
{
"id": "helmert",
"name": "Friedrich Robert Helmert",
"name_ru": "Фридрих Роберт Гельмерт",
"years": "1843–1917",
"wiki": "https://en.wikipedia.org/wiki/Friedrich_Robert_Helmert",
"zone": "measurement_error",
"idea": {
"en": "Theory of errors in geodesy (1872, 1880): every measurement carries an error that can be estimated; he derived the distribution of the sample variance (the chi-squared family, 1876).",
"ru": "Теория ошибок в геодезии (1872, 1880): у каждого измерения есть погрешность, которую можно оценить; он вывел распределение выборочной дисперсии (семейство хи-квадрат, 1876).",
"de": "Fehlertheorie der Geodäsie; Verteilung der Stichprobenvarianz (1876)."
},
"rule": "Give a number together with how precise it is; a number without its error looks more certain than it is.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already gives bounds instead of one number; the track record sensor gives intervals",
"covered_by": "leamer"
}
},
{
"id": "menger_c",
"name": "Carl Menger",
"name_ru": "Карл Менгер",
"years": "1840–1921",
"wiki": "https://en.wikipedia.org/wiki/Carl_Menger",
"zone": "answer_cost",
"idea": {
"en": "'Principles of Economics' (1871): the value of a good is set by the use of its last unit, not by its total usefulness — marginal utility.",
"ru": "«Основания политической экономии» (1871): ценность блага определяется пользой его последней единицы, а не общей полезностью, — предельная полезность.",
"de": "„Grundsätze der Volkswirtschaftslehre“ (1871): Grenznutzen."
},
"rule": "Before fetching one more source, ask what that one more would change in the answer.",
"needs": {
"code": "covered",
"note": "the Howard sensor already weighs when one more piece of information pays off",
"covered_by": "howard"
}
},
{
"id": "pareto",
"name": "Vilfredo Pareto",
"name_ru": "Вильфредо Парето",
"years": "1848–1923",
"wiki": "https://en.wikipedia.org/wiki/Vilfredo_Pareto",
"zone": "measurement_error",
"idea": {
"en": "'Cours d'économie politique' (1896–97): incomes follow a power law — a small share of people holds a large share of the total (the Pareto distribution behind the '80/20' rule).",
"ru": "«Курс политической экономии» (1896–97): доходы подчиняются степенному закону — небольшая доля людей держит большую долю всего (распределение Парето, отсюда «80/20»).",
"de": "Pareto-Verteilung (1896–97): wenige halten einen großen Teil."
},
"rule": "In lopsided data the average misleads; say how much of the total the top few carry.",
"needs": {
"code": "ready",
"note": "bridge 'heavy tails' (Pareto + Mandelbrot + Chebyshev + Lorenz): from ix_hist, what share of all radar movement came from the biggest 20% of half-hour jumps; data exist since 23.11.2026, needs the owner's yes for a sensor"
}
},
{
"id": "venn",
"name": "John Venn",
"name_ru": "Джон Венн",
"years": "1834–1923",
"wiki": "https://en.wikipedia.org/wiki/John_Venn",
"zone": "one_model",
"idea": {
"en": "'The Logic of Chance' (1866): a probability is a frequency within a chosen group — and the same person belongs to many groups with different frequencies (the reference-class problem).",
"ru": "«Логика случая» (1866): вероятность — это частота внутри выбранной группы, а один и тот же человек входит во многие группы с разными частотами (проблема референтного класса).",
"de": "„The Logic of Chance“ (1866): Wahrscheinlichkeit hängt von der Bezugsklasse ab."
},
"rule": "Every percentage belongs to a group: say which group, and that another group would give another number.",
"needs": {
"code": "needs_idea",
"note": "name the reference group behind every percentage in a headline; no reliable word rule yet"
}
},
{
"id": "frege",
"name": "Gottlob Frege",
"name_ru": "Готлоб Фреге",
"years": "1848–1925",
"wiki": "https://en.wikipedia.org/wiki/Gottlob_Frege",
"zone": "look_alike",
"idea": {
"en": "'On Sense and Reference' (1892): 'the morning star' and 'the evening star' name the same planet in different ways; one name can also cover different things.",
"ru": "«О смысле и значении» (1892): «утренняя звезда» и «вечерняя звезда» по-разному называют одну планету; и одно имя может обозначать разные вещи.",
"de": "„Über Sinn und Bedeutung“ (1892): Morgenstern und Abendstern."
},
"rule": "Check whether two names point to the same person or thing before merging or separating them.",
"needs": {
"code": "needs_source",
"note": "joins the bridge 'namesakes in the news': needs an open who-is-who base to tell one name from one person"
}
},
{
"id": "edgeworth",
"name": "Francis Ysidro Edgeworth",
"name_ru": "Фрэнсис Исидро Эджуорт",
"years": "1845–1926",
"wiki": "https://en.wikipedia.org/wiki/Francis_Ysidro_Edgeworth",
"zone": "measurement_error",
"idea": {
"en": "His memoranda on index numbers (1887–89, the Marshall–Edgeworth index): a price index changes with the weights and the base you choose.",
"ru": "Его записки об индексах цен (1887–89, индекс Маршалла — Эджуорта): индекс меняется в зависимости от выбранных весов и базы.",
"de": "Indexzahlen (1887–89): Gewichte und Basis bestimmen den Index."
},
"rule": "When quoting an index, say what weights and base it uses; another choice gives another number.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already recomputes each index under other weights",
"covered_by": "leamer"
}
},
{
"id": "veblen",
"name": "Thorstein Veblen",
"name_ru": "Торстейн Веблен",
"years": "1857–1929",
"wiki": "https://en.wikipedia.org/wiki/Thorstein_Veblen",
"zone": "look_alike",
"idea": {
"en": "'The Theory of the Leisure Class' (1899): conspicuous consumption — things are bought to show status, so a high price can signal prestige rather than quality.",
"ru": "«Теория праздного класса» (1899): показное потребление — вещи покупают, чтобы показать статус, поэтому высокая цена может означать престиж, а не качество.",
"de": "„Theorie der feinen Leute“ (1899): demonstrativer Konsum."
},
"rule": "Do not read a high price, a famous name or wide popularity as proof of quality or truth.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor and the passport already say that wide spread is not proof",
"covered_by": "kasperson"
}
},
{
"id": "marshall_a",
"name": "Alfred Marshall",
"name_ru": "Альфред Маршалл",
"years": "1842–1924",
"wiki": "https://en.wikipedia.org/wiki/Alfred_Marshall",
"zone": "one_model",
"idea": {
"en": "'Principles of Economics' (1890): 'other things being equal' (ceteris paribus) — study one cause at a time while holding the rest fixed, knowing the rest never really stay fixed.",
"ru": "«Принципы экономической науки» (1890): «при прочих равных» — изучать одну причину, держа остальное неизменным, помня, что в жизни остальное не стоит на месте.",
"de": "„Principles of Economics“ (1890): ceteris paribus."
},
"rule": "When you explain a change by one cause, say what you held fixed and whether it really stayed fixed.",
"needs": {
"code": "covered",
"note": "the Simpson sensor already checks whether the mix of radars changed under an index move",
"covered_by": "simpson"
}
},
{
"id": "chamberlin",
"name": "Thomas Chrowder Chamberlin",
"name_ru": "Томас Чемберлин",
"years": "1843–1928",
"wiki": "https://en.wikipedia.org/wiki/Thomas_Chrowder_Chamberlin",
"zone": "one_model",
"idea": {
"en": "'The Method of Multiple Working Hypotheses' (1890): keeping one favourite explanation makes you see only supporting facts; keep several alive and test them against each other.",
"ru": "«Метод множественных рабочих гипотез» (1890): любимое единственное объяснение заставляет видеть только подтверждающие факты; держи в голове несколько и проверяй их друг против друга.",
"de": "„The Method of Multiple Working Hypotheses“ (1890)."
},
"rule": "Keep at least two explanations open until the facts rule one out.",
"needs": {
"code": "covered",
"note": "applied: hosts keep statements, forecasts and questions apart from events and say where the facts stop"
}
},
{
"id": "durkheim",
"name": "Émile Durkheim",
"name_ru": "Эмиль Дюркгейм",
"years": "1858–1917",
"wiki": "https://en.wikipedia.org/wiki/%C3%89mile_Durkheim",
"zone": "measurement_error",
"idea": {
"en": "'The Rules of Sociological Method' (1895): treat social facts as things — measure them from outside, with definitions fixed in advance, not from impressions.",
"ru": "«Метод социологии» (1895): рассматривать социальные факты как вещи — измерять их извне, с заранее заданными определениями, а не по впечатлениям.",
"de": "„Die Regeln der soziologischen Methode“ (1895)."
},
"rule": "Fix the definition before counting; a count with a shifting definition measures the definition.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces what every published number measures",
"covered_by": "baird"
}
},
{
"id": "leskien",
"name": "August Leskien",
"name_ru": "Август Лескин",
"years": "1840–1916",
"wiki": "https://en.wikipedia.org/wiki/August_Leskien",
"zone": "own_limits",
"idea": {
"en": "With the Neogrammarians (1876) he held that sound laws work without exceptions: an apparent exception points to another rule or to borrowing, not to chance.",
"ru": "Вместе с младограмматиками (1876) он утверждал, что звуковые законы действуют без исключений: кажущееся исключение указывает на другое правило или заимствование, а не на случай.",
"de": "Junggrammatiker (1876): Ausnahmslosigkeit der Lautgesetze."
},
"rule": "Treat an exception as a clue to a rule you have not found yet, before writing it off as noise.",
"needs": {
"code": "covered",
"note": "the track record sensor already checks whether radar jumps revert or hold (radar_noise) before calling them noise",
"covered_by": "trackrecord"
}
},
{
"id": "boehm_bawerk",
"name": "Eugen von Böhm-Bawerk",
"name_ru": "Ойген фон Бём-Баверк",
"years": "1851–1914",
"wiki": "https://en.wikipedia.org/wiki/Eugen_von_B%C3%B6hm-Bawerk",
"zone": "answer_cost",
"idea": {
"en": "'Capital and Interest' (1884–89): people value present goods above the same goods in the future, so time itself has a price.",
"ru": "«Капитал и процент» (1884–89): люди ценят блага сейчас выше тех же благ в будущем, поэтому у самого времени есть цена.",
"de": "„Kapital und Kapitalzins“ (1884–89): Gegenwartsgüter werden höher bewertet."
},
"rule": "Compare a cost now with a benefit later only after saying how much the waiting itself costs.",
"needs": {
"code": "covered",
"note": "the Mikrin sensor already measures what each step of waiting costs on the way to the air",
"covered_by": "mikrin"
}
}
];
// Ответ API/MCP: карточки ожидающих учёных + учёные с живыми датчиками (из реестра SCIENTISTS)
export function crystalsReport(scientists, { zone = null, q = null } = {}, origin = "https://orbstudio.org") {
  const built = (scientists || []).map((s) => ({ id: s.id, name: s.honour.name, years: s.honour.years || null, wiki: (s.honour.wiki && (s.honour.wiki.en || s.honour.wiki.ru)) || null,
    zone: CRYSTAL_BUILT_ZONE[s.id] || null, idea: { en: s.principle }, rule: s.sensor, status: "has_sensor", sensor: { tool: s.tool, api: origin + s.api, page: origin + "/tools/" + s.id } }));
  const wait = CRYSTALS.map((c) => ({ ...c, status: "waiting_for_sensor", sensor: null }));
  let all = [...built, ...wait];
  if (zone && CRYSTAL_ZONES.includes(zone)) all = all.filter((c) => c.zone === zone);
  if (q) { const s = String(q).toLowerCase().slice(0, 80); all = all.filter((c) => [c.name, c.name_ru, c.idea && c.idea.en, c.rule].some((x) => x && String(x).toLowerCase().includes(s))); }
  const needs = {}; for (const c of wait) needs[c.needs.code] = (needs[c.needs.code] || 0) + 1;
  return { library: "crystals", count: all.length, with_sensor: all.filter((c) => c.status === "has_sensor").length, zones: CRYSTAL_ZONES,
    needs_summary: needs, ready_to_build: wait.filter((c) => c.needs.code === "ready").map((c) => ({ id: c.id, name: c.name, plan: c.needs.note })),
    history_due: wait.filter((c) => c.needs.code === "needs_history").map((c) => ({ id: c.id, name: c.name, not_before: c.needs.not_before, plan: c.needs.note })),
    crystals: all,
    about: "Ideas of scientists who died in 1900-2026, crystallised into rules for AI agents. Facts from open sources (Wikipedia in many languages; 2025-2026 deaths checked against obituaries). The 'rule' is Orb Studio's interpretation, not the scientist's words.",
    similar: "Mental-models MCP servers (thinking-models, Clear Thought) give agents reasoning principles; here each principle is tied to a real person, their article and Orb Studio's live sensors.",
    page: origin + "/tools/crystals" };
}

// «Чьи идеи вспоминают»: переходы людей с карточек в Википедию и находки карточек агентами (get_crystals с фильтром) за 30 дней.
// rows: строки hits с page = "crystal:<id>", kind = "wiki_click" | "found"
export function crystalsRemembered(rows, scientists = [], now = Date.now()) {
  const from = new Date(now - 29 * 864e5).toISOString().slice(0, 10), by = new Map();
  const names = new Map([...CRYSTALS.map((c) => [c.id, { name: c.name, name_ru: c.name_ru, years: c.years, zone: c.zone, wiki: c.wiki }]),
    ...(scientists || []).map((s) => [s.id, { name: s.honour.name, years: s.honour.years || null, zone: CRYSTAL_BUILT_ZONE[s.id] || null, sensor: "/tools/" + s.id }])]);
  for (const r of rows || []) {
    if (!r || r.day < from || !String(r.page).startsWith("crystal:")) continue;
    const id = String(r.page).slice(8); if (!names.has(id)) continue;
    const x = by.get(id) || { id, ...names.get(id), wiki_clicks_30d: 0, found_by_agents_30d: 0, days: new Set() };
    if (r.kind === "wiki_click") x.wiki_clicks_30d += +r.n || 0; else if (r.kind === "found") x.found_by_agents_30d += +r.n || 0; else continue;
    x.days.add(r.day); by.set(id, x);
  }
  const list = [...by.values()].map(({ days, ...x }) => ({ ...x, days_30d: days.size })).sort((a, b) => (b.wiki_clicks_30d + b.found_by_agents_30d) - (a.wiki_clicks_30d + a.found_by_agents_30d) || b.days_30d - a.days_30d);
  return { period: "last 30 days", scientists_remembered: list.length, of: names.size, top: list.slice(0, 20),
    how_to_read: "wiki_clicks_30d = how often people followed the link from a Crystal Library card to the scientist's Wikipedia article; found_by_agents_30d = how often an outside AI agent got this card from get_crystals or /api/v1/crystals with a filter (blind_spot or query; full unfiltered lists are not counted). Our own checks, robots and the owner are not counted. No personal data: only the card and the day." };
}
