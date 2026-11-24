// СГЕНЕРИРОВАНО tools/crystals.py из tools/crystals_data.py — правьте данные там.
export const CRYSTAL_ZONES = ["stale_data", "one_model", "rumour_vs_fact", "measurement_error", "answer_cost", "side_effects", "look_alike", "own_limits"];
export const CRYSTAL_BUILT_ZONE = {"simpson": "one_model", "searle": "rumour_vs_fact", "duckworth": "stale_data", "trevisan": "answer_cost", "bertsekas": "answer_cost", "rabin": "measurement_error", "frankfurt": "rumour_vs_fact", "hamilton": "answer_cost", "mikrin": "stale_data", "polyak": "measurement_error", "park": "rumour_vs_fact", "kahneman": "measurement_error", "ziv": "stale_data", "cox": "stale_data", "halpern": "one_model", "howard": "answer_cost", "leamer": "one_model", "baird": "measurement_error", "lyberg": "measurement_error", "hagenauer": "measurement_error", "kasperson": "side_effects", "newcomb": "measurement_error", "pareto": "measurement_error", "pearson": "measurement_error", "cohen": "measurement_error", "harman": "own_limits", "frege": "look_alike"};
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
"code": "covered",
"note": "applied: the news passport marks emotionally loaded headlines with Orb Studio's own short word list, each word rated for evaluation, potency and activity (field tone; a 'say' line asks for neutral words)"
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
"code": "covered",
"note": "applied with Osgood: the news passport flags loaded headlines (field tone) so hosts report the facts without the heat"
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
"code": "covered",
"note": "applied: the news passport flags news metaphors in English, German and Russian with its own short list (field metaphor)"
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
"code": "covered",
"note": "applied with Osgood: value words in headlines (scandal, disaster, triumph) are flagged apart from facts (field tone)"
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
},
{
"id": "klein_f",
"name": "Felix Klein",
"name_ru": "Феликс Клейн",
"years": "1849–1925",
"wiki": "https://en.wikipedia.org/wiki/Felix_Klein",
"zone": "look_alike",
"idea": {
"en": "The Erlangen programme (1872): a geometry is defined by what stays unchanged under its allowed transformations — the invariants.",
"ru": "Эрлангенская программа (1872): геометрию определяет то, что остаётся неизменным при её допустимых преобразованиях, — инварианты.",
"de": "Erlanger Programm (1872): Invarianten unter Transformationen."
},
"rule": "When the same story comes in different words, languages or framings, keep what stays the same in all of them as the fact.",
"needs": {
"code": "covered",
"note": "applied: check_headline compares the same story across outlets and languages and keeps what they share (independent_voices)"
}
},
{
"id": "wallas",
"name": "Graham Wallas",
"name_ru": "Грэм Уоллас",
"years": "1858–1932",
"wiki": "https://en.wikipedia.org/wiki/Graham_Wallas",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Human Nature in Politics' (1908): political opinion is moved mostly by habit, images and emotion, not by reasoned argument.",
"ru": "«Человеческая природа в политике» (1908): политическое мнение движут в основном привычка, образы и эмоции, а не доводы.",
"de": "„Human Nature in Politics“ (1908): Gewohnheit und Bilder statt Argumente."
},
"rule": "Notice when a headline works by an image or an emotion instead of a claim you can check.",
"needs": {
"code": "covered",
"note": "applied with Osgood: the news passport flags emotional images in headlines (field tone) apart from checkable claims"
}
},
{
"id": "follett",
"name": "Mary Parker Follett",
"name_ru": "Мэри Паркер Фоллетт",
"years": "1868–1933",
"wiki": "https://en.wikipedia.org/wiki/Mary_Parker_Follett",
"zone": "answer_cost",
"idea": {
"en": "'Constructive Conflict' (1925): a conflict can end in domination, compromise or integration — a solution that meets what both sides really need.",
"ru": "«Конструктивный конфликт» (1925): конфликт может закончиться подчинением, компромиссом или интеграцией — решением, которое даёт обеим сторонам то, что им действительно нужно.",
"de": "„Constructive Conflict“ (1925): Integration statt Kompromiss."
},
"rule": "Do not frame a dispute as only two options; ask what each side actually needs.",
"needs": {
"code": "covered",
"note": "applied: hosts present the main viewpoints on contested issues and name who else gains or pays"
}
},
{
"id": "schlick",
"name": "Moritz Schlick",
"name_ru": "Мориц Шлик",
"years": "1882–1936",
"wiki": "https://en.wikipedia.org/wiki/Moritz_Schlick",
"zone": "rumour_vs_fact",
"idea": {
"en": "The Vienna Circle's verification principle: the meaning of a statement lies in the way it could be checked against experience.",
"ru": "Принцип верификации Венского кружка: смысл утверждения — в том, как его можно проверить опытом.",
"de": "Verifikationsprinzip des Wiener Kreises."
},
"rule": "Ask what observation would show the claim true or false; if none could, say it cannot be checked.",
"needs": {
"code": "covered",
"note": "the Frankfurt sensor already tells checkable headlines from vague ones",
"covered_by": "frankfurt"
}
},
{
"id": "sapir",
"name": "Edward Sapir",
"name_ru": "Эдвард Сепир",
"years": "1884–1939",
"wiki": "https://en.wikipedia.org/wiki/Edward_Sapir",
"zone": "look_alike",
"idea": {
"en": "Language as a guide to social reality (1929): the categories a language forces on its speakers shape what they notice and report.",
"ru": "Язык как путеводитель по социальной реальности (1929): категории, которые язык навязывает говорящим, определяют, что они замечают и сообщают.",
"de": "Sprache als Leitfaden der sozialen Wirklichkeit (1929)."
},
"rule": "When the same news comes in several languages, check what each wording adds or leaves out.",
"needs": {
"code": "covered",
"note": "applied: the echo check compares the same story across ru/de/en and the passport flags metaphors"
}
},
{
"id": "pearson_k",
"name": "Karl Pearson",
"name_ru": "Карл Пирсон",
"years": "1857–1936",
"wiki": "https://en.wikipedia.org/wiki/Karl_Pearson",
"zone": "one_model",
"idea": {
"en": "'The Grammar of Science' (1892) and the chi-squared test (1900): correlation measures how two things move together, not what causes what; a fit must be tested against chance. (His eugenics is rejected; the statistical tools stand.)",
"ru": "«Грамматика науки» (1892) и критерий хи-квадрат (1900): корреляция показывает, как две вещи меняются вместе, а не что чем вызвано; согласие с моделью надо проверять против случайности. (Его евгеника отвергнута; статистические инструменты остаются.)",
"de": "„The Grammar of Science“ (1892); Chi-Quadrat-Test (1900)."
},
"rule": "A correlation is not a cause; test whether the pattern could be chance before explaining it.",
"needs": {
"code": "needs_history",
"note": "bridge 'who leads whom' (Granger + Pearson + Mill): correlation of radar and prices first, cause later",
"not_before": "2026-12-14"
}
},
{
"id": "bortkiewicz",
"name": "Ladislaus Bortkiewicz",
"name_ru": "Владислав Борткевич",
"years": "1868–1931",
"wiki": "https://en.wikipedia.org/wiki/Ladislaus_Bortkiewicz",
"zone": "measurement_error",
"idea": {
"en": "'The Law of Small Numbers' (1898): deaths from horse kicks in the Prussian cavalry followed the Poisson law — rare events cluster by chance alone.",
"ru": "«Закон малых чисел» (1898): число погибших от ударов копытом в прусской кавалерии подчинялось закону Пуассона — редкие события и по чистой случайности идут кучками.",
"de": "„Das Gesetz der kleinen Zahlen“ (1898)."
},
"rule": "With rare events, a bad week can be pure chance; compare with what chance alone would give.",
"needs": {
"code": "covered",
"note": "the track record sensor already refuses conclusions from few days and shows ordinary noise",
"covered_by": "trackrecord"
}
},
{
"id": "gosset",
"name": "William Sealy Gosset",
"name_ru": "Уильям Сили Госсет",
"years": "1876–1937",
"wiki": "https://en.wikipedia.org/wiki/William_Sealy_Gosset",
"zone": "measurement_error",
"idea": {
"en": "As 'Student' (1908), working at the Guinness brewery, he showed that small samples need wider error bands than large ones — the t-distribution.",
"ru": "Под псевдонимом «Стьюдент» (1908), работая на пивоварне Guinness, он показал, что маленьким выборкам нужны более широкие границы погрешности, чем большим, — t-распределение.",
"de": "„Student“ (1908): t-Verteilung für kleine Stichproben."
},
"rule": "The fewer the observations, the wider the uncertainty you must state.",
"needs": {
"code": "covered",
"note": "the track record sensor already gives Wilson intervals that widen with fewer days",
"covered_by": "trackrecord"
}
},
{
"id": "ramsey_f",
"name": "Frank Ramsey",
"name_ru": "Фрэнк Рамсей",
"years": "1903–1930",
"wiki": "https://en.wikipedia.org/wiki/Frank_Ramsey_(mathematician)",
"zone": "own_limits",
"idea": {
"en": "'Truth and Probability' (1926): a degree of belief can be measured by the bets you would accept, and beliefs should hang together consistently.",
"ru": "«Истина и вероятность» (1926): степень уверенности можно измерить ставками, которые ты готов принять, а убеждения должны быть согласованы между собой.",
"de": "„Truth and Probability“ (1926)."
},
"rule": "State your confidence as a number you would bet on, and keep it consistent across related claims.",
"needs": {
"code": "covered",
"note": "applied: the forecast game scores agents by the Brier rule, so honest degrees of belief pay off"
}
},
{
"id": "whitehead",
"name": "Alfred North Whitehead",
"name_ru": "Альфред Норт Уайтхед",
"years": "1861–1947",
"wiki": "https://en.wikipedia.org/wiki/Alfred_North_Whitehead",
"zone": "one_model",
"idea": {
"en": "The 'fallacy of misplaced concreteness' ('Science and the Modern World', 1925): mistaking an abstraction — a model, a number, a category — for the concrete reality it was cut from.",
"ru": "«Ошибка неуместной конкретности» («Наука и современный мир», 1925): принимать абстракцию — модель, число, категорию — за конкретную реальность, из которой её вырезали.",
"de": "„Fallacy of misplaced concreteness“ (1925)."
},
"rule": "Do not talk about an index or a model as if it were the world itself; say what it leaves out.",
"needs": {
"code": "covered",
"note": "applied: every sensor states its method and what it leaves out; hosts say where the facts stop"
}
},
{
"id": "schumpeter",
"name": "Joseph Schumpeter",
"name_ru": "Йозеф Шумпетер",
"years": "1883–1950",
"wiki": "https://en.wikipedia.org/wiki/Joseph_Schumpeter",
"zone": "one_model",
"idea": {
"en": "The 'Ricardian vice' ('History of Economic Analysis', 1954): drawing firm practical conclusions from a model whose convenient assumptions guarantee the answer.",
"ru": "«Рикардианский порок» («История экономического анализа», 1954): делать твёрдые практические выводы из модели, удобные допущения которой заранее гарантируют ответ.",
"de": "„Ricardian vice“ (1954)."
},
"rule": "Before acting on a model's conclusion, check whether its assumptions already built that conclusion in.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already shows how far an index depends on the model choices",
"covered_by": "leamer"
}
},
{
"id": "fisher_i",
"name": "Irving Fisher",
"name_ru": "Ирвинг Фишер",
"years": "1867–1947",
"wiki": "https://en.wikipedia.org/wiki/Irving_Fisher",
"zone": "own_limits",
"idea": {
"en": "'The Making of Index Numbers' (1922) — and in October 1929, days before the crash, he said stock prices had reached 'a permanently high plateau'.",
"ru": "«Построение индексов» (1922) — и в октябре 1929 года, за несколько дней до краха, он заявил, что курсы акций вышли на «постоянно высокое плато».",
"de": "Indexzahlen (1922) – und das „dauerhaft hohe Plateau“ kurz vor dem Crash 1929."
},
"rule": "Even a great expert's confident forecast can fail within days; report forecasts with their uncertainty, not as facts.",
"needs": {
"code": "covered",
"note": "applied: Orb Studio gives no forecasts; the forecast game scores confident misses by the Brier rule"
}
},
{
"id": "keynes",
"name": "John Maynard Keynes",
"name_ru": "Джон Мейнард Кейнс",
"years": "1883–1946",
"wiki": "https://en.wikipedia.org/wiki/John_Maynard_Keynes",
"zone": "side_effects",
"idea": {
"en": "'A Treatise on Probability' (1921) on the weight of evidence, and the 'beauty contest' (1936): investors guess what others will think, not what a thing is worth.",
"ru": "«Трактат о вероятности» (1921) о весе свидетельств и «конкурс красоты» (1936): инвесторы угадывают, что подумают другие, а не сколько вещь стоит.",
"de": "Wahrscheinlichkeit (1921) und der „Schönheitswettbewerb“ (1936)."
},
"rule": "A price can reflect what people expect others to think; do not read it as the value of the thing.",
"needs": {
"code": "needs_history",
"note": "bridge 'published radar moves the market' (Rosenthal + Bush + Keynes's beauty contest)",
"not_before": "2026-12-21"
}
},
{
"id": "spearman",
"name": "Charles Spearman",
"name_ru": "Чарльз Спирмен",
"years": "1863–1945",
"wiki": "https://en.wikipedia.org/wiki/Charles_Spearman",
"zone": "measurement_error",
"idea": {
"en": "'The proof and measurement of association' (1904): measurement error weakens the correlation you see, and he gave a correction for it; also rank correlation.",
"ru": "«Доказательство и измерение связи» (1904): ошибка измерения ослабляет видимую корреляцию, и он дал поправку на это; а также ранговая корреляция.",
"de": "Minderungskorrektur (1904): Messfehler schwächen Korrelationen."
},
"rule": "A weak link between noisy measures may be a stronger link hidden by noise; say how noisy the measures are.",
"needs": {
"code": "covered",
"note": "the track record sensor already reports radar noise next to any link with prices",
"covered_by": "trackrecord"
}
},
{
"id": "neurath",
"name": "Otto Neurath",
"name_ru": "Отто Нейрат",
"years": "1882–1945",
"wiki": "https://en.wikipedia.org/wiki/Otto_Neurath",
"zone": "own_limits",
"idea": {
"en": "'Neurath's boat' (1932): we are like sailors rebuilding their ship at sea — we can replace one plank at a time, never all at once.",
"ru": "«Корабль Нейрата» (1932): мы как моряки, перестраивающие корабль в открытом море, — можно менять по одной доске, но не всё сразу.",
"de": "„Neuraths Schiff“ (1932)."
},
"rule": "Correct one belief at a time against the others you keep fixed; say which ones you kept.",
"needs": {
"code": "covered",
"note": "applied: the method resolves rule conflicts one at a time, the more cautious rule wins"
}
},
{
"id": "eddington",
"name": "Arthur Eddington",
"name_ru": "Артур Эддингтон",
"years": "1882–1944",
"wiki": "https://en.wikipedia.org/wiki/Arthur_Eddington",
"zone": "measurement_error",
"idea": {
"en": "The fish-net parable ('The Philosophy of Physical Science', 1939): a net with two-inch mesh 'proves' there are no fish smaller than two inches — the instrument chooses what you can find.",
"ru": "Притча о сети («Философия физической науки», 1939): сеть с ячейкой в два дюйма «доказывает», что рыб меньше двух дюймов нет, — прибор решает, что ты можешь найти.",
"de": "Fischnetz-Gleichnis (1939): das Netz bestimmt, was man fängt."
},
"rule": "Before saying something does not exist, ask whether your sources could have caught it.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already reports which regions and languages the feeds cannot see",
"covered_by": "lyberg"
}
},
{
"id": "whorf",
"name": "Benjamin Lee Whorf",
"name_ru": "Бенджамин Ли Уорф",
"years": "1897–1941",
"wiki": "https://en.wikipedia.org/wiki/Benjamin_Lee_Whorf",
"zone": "look_alike",
"idea": {
"en": "As a fire-insurance inspector he saw workers smoke near 'empty' petrol drums: the word 'empty' hid that the drums were full of explosive vapour.",
"ru": "Работая инспектором страховой компании, он видел, как рабочие курят у «пустых» бочек из-под бензина: слово «пустой» скрывало, что бочки полны взрывоопасных паров.",
"de": "Brandschutz-Beobachtung: „leere“ Benzinfässer voller Dämpfe."
},
"rule": "Check whether a word in the headline ('empty', 'safe', 'cleared') hides the real state of things.",
"needs": {
"code": "needs_idea",
"note": "a small list of state words that hide danger (empty, safe, cleared, contained) for the passport; no tested list yet"
}
},
{
"id": "wittgenstein",
"name": "Ludwig Wittgenstein",
"name_ru": "Людвиг Витгенштейн",
"years": "1889–1951",
"wiki": "https://en.wikipedia.org/wiki/Ludwig_Wittgenstein",
"zone": "look_alike",
"idea": {
"en": "'Philosophical Investigations' (1953): the meaning of a word is its use in a practice; things called by one word share only a 'family resemblance', not one common essence.",
"ru": "«Философские исследования» (1953): значение слова — это его употребление в практике; вещи, названные одним словом, связаны лишь «семейным сходством», а не общей сущностью.",
"de": "„Philosophische Untersuchungen“ (1953): Bedeutung ist Gebrauch; Familienähnlichkeit."
},
"rule": "Read a key word ('crisis', 'deal', 'win') by how this source uses it, not by one fixed definition.",
"needs": {
"code": "covered",
"note": "applied: the passport flags metaphors and the echo check compares meanings across wordings"
}
},
{
"id": "borel",
"name": "Émile Borel",
"name_ru": "Эмиль Борель",
"years": "1871–1956",
"wiki": "https://en.wikipedia.org/wiki/%C3%89mile_Borel",
"zone": "own_limits",
"idea": {
"en": "'Le hasard' and 'Les probabilités et la vie' (1943): events of small enough probability should be treated as practically impossible — but one must say how small, and on what scale of trials.",
"ru": "«Случай» и «Вероятности и жизнь» (1943): события достаточно малой вероятности следует считать практически невозможными — но надо сказать, насколько малой и на каком числе испытаний.",
"de": "„Les probabilités et la vie“ (1943): Borels Gesetz des Zufalls."
},
"rule": "Before calling something 'impossible', say how unlikely it is and how many chances it had to happen.",
"needs": {
"code": "covered",
"note": "applied: the passport asks for stronger evidence for extraordinary claims (Hume, Laplace)"
}
},
{
"id": "reichenbach",
"name": "Hans Reichenbach",
"name_ru": "Ханс Райхенбах",
"years": "1891–1953",
"wiki": "https://en.wikipedia.org/wiki/Hans_Reichenbach",
"zone": "one_model",
"idea": {
"en": "The common cause principle ('The Direction of Time', 1956): when two things are correlated and neither causes the other, look for a third that causes both; he also separated the context of discovery from the context of justification.",
"ru": "Принцип общей причины («Направление времени», 1956): если две вещи связаны, но ни одна не вызывает другую, ищи третью, которая вызывает обе; он же отделил контекст открытия от контекста обоснования.",
"de": "Prinzip der gemeinsamen Ursache (1956)."
},
"rule": "If two things move together, check for a third that drives both before linking them.",
"needs": {
"code": "needs_history",
"note": "bridge 'who leads whom' (Granger + Salmon + Reichenbach): a common driver of radar and prices (e.g. the same news) must be ruled out",
"not_before": "2026-12-14"
}
},
{
"id": "von_neumann",
"name": "John von Neumann",
"name_ru": "Джон фон Нейман",
"years": "1903–1957",
"wiki": "https://en.wikipedia.org/wiki/John_von_Neumann",
"zone": "side_effects",
"idea": {
"en": "The minimax theorem (1928) and 'Theory of Games and Economic Behavior' (1944, with Morgenstern): judge a move by the best reply it leaves the other side.",
"ru": "Теорема о минимаксе (1928) и «Теория игр и экономическое поведение» (1944, с Моргенштерном): оценивай ход по лучшему ответу, который он оставляет другой стороне.",
"de": "Minimax-Satz (1928) und Spieltheorie (1944)."
},
"rule": "When others will react, judge an action by their best response, not by its first effect.",
"needs": {
"code": "needs_history",
"note": "bridge 'published radar moves the market' (Rosenthal + Keynes + von Neumann): reactions to a published signal",
"not_before": "2026-12-21"
}
},
{
"id": "bowley",
"name": "Arthur Lyon Bowley",
"name_ru": "Артур Лайон Боули",
"years": "1869–1957",
"wiki": "https://en.wikipedia.org/wiki/Arthur_Lyon_Bowley",
"zone": "measurement_error",
"idea": {
"en": "'Livelihood and Poverty' (1915) pioneered random sampling of households: a sample speaks for a population only if every member had a known chance to be chosen.",
"ru": "«Заработок и бедность» (1915) впервые применила случайную выборку домохозяйств: выборка говорит за всё население, только если у каждого был известный шанс в неё попасть.",
"de": "„Livelihood and Poverty“ (1915): Zufallsstichproben von Haushalten."
},
"rule": "Ask how a survey chose its people before trusting its percentage for everyone.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor already reports who the feeds cannot see",
"covered_by": "lyberg"
}
},
{
"id": "mises_r",
"name": "Richard von Mises",
"name_ru": "Рихард фон Мизес",
"years": "1883–1953",
"wiki": "https://en.wikipedia.org/wiki/Richard_von_Mises",
"zone": "measurement_error",
"idea": {
"en": "The birthday problem (1939): in a room of just 23 people two share a birthday more often than not — coincidences are far more likely than they feel. He also founded the frequency theory of probability.",
"ru": "Задача о днях рождения (1939): уже среди 23 человек двое с одним днём рождения встречаются чаще, чем нет, — совпадения гораздо вероятнее, чем кажется. Он же создал частотную теорию вероятности.",
"de": "Geburtstagsproblem (1939): Zufälle sind wahrscheinlicher als gefühlt."
},
"rule": "Before calling a coincidence suspicious, count how many chances there were for some coincidence to happen.",
"needs": {
"code": "covered",
"note": "the track record sensor already refuses conclusions from a few coincidences",
"covered_by": "trackrecord"
}
},
{
"id": "thorndike",
"name": "Edward Thorndike",
"name_ru": "Эдвард Торндайк",
"years": "1874–1949",
"wiki": "https://en.wikipedia.org/wiki/Edward_Thorndike",
"zone": "look_alike",
"idea": {
"en": "'A constant error in psychological ratings' (1920): the halo effect — one good or bad trait colours how all other traits are judged.",
"ru": "«Постоянная ошибка в психологических оценках» (1920): эффект ореола — одна хорошая или плохая черта окрашивает оценку всех остальных.",
"de": "Halo-Effekt (1920)."
},
"rule": "Judge each claim about a person or company on its own evidence, not on their reputation.",
"needs": {
"code": "needs_idea",
"note": "flag headlines whose claim rests on a name's reputation; no word rule yet"
}
},
{
"id": "buehler",
"name": "Karl Bühler",
"name_ru": "Карл Бюлер",
"years": "1879–1963",
"wiki": "https://en.wikipedia.org/wiki/Karl_B%C3%BChler",
"zone": "rumour_vs_fact",
"idea": {
"en": "The organon model ('Sprachtheorie', 1934): every message at once expresses the sender, appeals to the receiver and represents a state of affairs.",
"ru": "Модель органона («Теория языка», 1934): каждое сообщение одновременно выражает отправителя, обращается к адресату и изображает положение дел.",
"de": "Organon-Modell („Sprachtheorie“, 1934): Ausdruck, Appell, Darstellung."
},
"rule": "Separate what a headline says about the world from what it shows about the sender and what it wants from you.",
"needs": {
"code": "covered",
"note": "the Searle sensor and the passport already separate what a headline reports from what it demands or threatens",
"covered_by": "searle"
}
},
{
"id": "wiener",
"name": "Norbert Wiener",
"name_ru": "Норберт Винер",
"years": "1894–1964",
"wiki": "https://en.wikipedia.org/wiki/Norbert_Wiener",
"zone": "side_effects",
"idea": {
"en": "'Cybernetics' (1948): feedback — a system's output returns as its input; negative feedback steadies it, positive feedback can drive it out of control.",
"ru": "«Кибернетика» (1948): обратная связь — выход системы возвращается на её вход; отрицательная обратная связь её успокаивает, положительная может разогнать до срыва.",
"de": "„Kybernetik“ (1948): Rückkopplung."
},
"rule": "When your output can come back as input (a published signal that moves what it measures), say so and watch for runaway loops.",
"needs": {
"code": "needs_history",
"note": "bridge 'published radar moves the market' (Rosenthal + Keynes + von Neumann + Wiener feedback)",
"not_before": "2026-12-21"
}
},
{
"id": "carnap",
"name": "Rudolf Carnap",
"name_ru": "Рудольф Карнап",
"years": "1891–1970",
"wiki": "https://en.wikipedia.org/wiki/Rudolf_Carnap",
"zone": "one_model",
"idea": {
"en": "The requirement of total evidence (1947, 'Logical Foundations of Probability', 1950): a probability judgement must use all the relevant evidence available, not a convenient part of it.",
"ru": "Требование полноты свидетельств (1947, «Логические основания вероятности», 1950): вероятностное суждение должно опираться на все доступные относящиеся к делу данные, а не на удобную часть.",
"de": "Forderung der totalen Evidenz (1947)."
},
"rule": "Do not answer from the evidence that suits you; say what relevant evidence you did not use.",
"needs": {
"code": "covered",
"note": "applied: hosts say where the facts stop and check_headline reports all outlets found, not a chosen few"
}
},
{
"id": "fisher_r",
"name": "Ronald Fisher",
"name_ru": "Рональд Фишер",
"years": "1890–1962",
"wiki": "https://en.wikipedia.org/wiki/Ronald_Fisher",
"zone": "measurement_error",
"idea": {
"en": "'The Design of Experiments' (1935), the lady tasting tea: decide the test and what counts as success before you look at the results, and randomise to keep chance honest.",
"ru": "«Планирование экспериментов» (1935), леди, пробующая чай: реши, как будешь проверять и что считать успехом, до того как увидишь результаты, и рандомизируй, чтобы случай был честным.",
"de": "„The Design of Experiments“ (1935): Teetest der Lady."
},
"rule": "Fix the test before looking at the outcome; a test chosen after seeing the data proves little.",
"needs": {
"code": "covered",
"note": "the track record sensor fixed its buckets and threshold before collecting results",
"covered_by": "trackrecord"
}
},
{
"id": "allport",
"name": "Gordon Allport",
"name_ru": "Гордон Олпорт",
"years": "1897–1967",
"wiki": "https://en.wikipedia.org/wiki/Gordon_Allport",
"zone": "rumour_vs_fact",
"idea": {
"en": "'The Psychology of Rumor' (1947, with Leo Postman): rumour strength grows with how important a matter is times how ambiguous the facts are; retold stories shrink, sharpen and bend to expectations.",
"ru": "«Психология слуха» (1947, с Лео Постманом): сила слуха растёт с важностью темы, умноженной на неясность фактов; при пересказе история сжимается, заостряется и подгоняется под ожидания.",
"de": "„The Psychology of Rumor“ (1947): Gerücht = Wichtigkeit × Mehrdeutigkeit."
},
"rule": "When a story is important and the facts are unclear, expect rumours: slow down and stick to what is confirmed.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor and the passport already flag stories that spread wider than their first source",
"covered_by": "kasperson"
}
},
{
"id": "cantril",
"name": "Hadley Cantril",
"name_ru": "Хэдли Кэнтрил",
"years": "1906–1969",
"wiki": "https://en.wikipedia.org/wiki/Hadley_Cantril",
"zone": "rumour_vs_fact",
"idea": {
"en": "'The Invasion from Mars' (1940): listeners who checked other stations or sources after the 1938 radio play did not panic; those who did not check believed it.",
"ru": "«Вторжение с Марса» (1940): слушатели, которые после радиопостановки 1938 года проверили другие станции и источники, не поддались панике; кто не проверил — поверил.",
"de": "„The Invasion from Mars“ (1940): wer nachprüfte, geriet nicht in Panik."
},
"rule": "Before reacting to an alarming report, check one independent source.",
"needs": {
"code": "covered",
"note": "check_headline already looks for independent outlets for any headline",
"covered_by": "frankfurt"
}
},
{
"id": "richardson_lf",
"name": "Lewis Fry Richardson",
"name_ru": "Льюис Фрай Ричардсон",
"years": "1881–1953",
"wiki": "https://en.wikipedia.org/wiki/Lewis_Fry_Richardson",
"zone": "measurement_error",
"idea": {
"en": "The coastline paradox (published 1961): the measured length of a coast grows as the ruler gets shorter — some quantities have no single size without a stated scale. He also made the first numerical weather forecast (1922).",
"ru": "Парадокс береговой линии (опубликован в 1961): измеренная длина побережья растёт, когда линейка становится короче, — у некоторых величин нет одного размера без указанного масштаба. Он же сделал первый численный прогноз погоды (1922).",
"de": "Küstenlinien-Paradox (1961): die Länge hängt vom Maßstab ab."
},
"rule": "State the scale of a measurement; a number without its scale (per day, per hour, per region) cannot be compared.",
"needs": {
"code": "covered",
"note": "the Baird sensor already gives the unit and time scale of every number",
"covered_by": "baird"
}
},
{
"id": "lakatos",
"name": "Imre Lakatos",
"name_ru": "Имре Лакатос",
"years": "1922–1974",
"wiki": "https://en.wikipedia.org/wiki/Imre_Lakatos",
"zone": "one_model",
"idea": {
"en": "'The Methodology of Scientific Research Programmes' (1970–78): a programme is progressive if it predicts new facts, degenerating if it only patches itself after each failure.",
"ru": "«Методология научно-исследовательских программ» (1970–78): программа прогрессирует, если предсказывает новые факты, и вырождается, если только латает себя после каждой неудачи.",
"de": "Methodologie wissenschaftlicher Forschungsprogramme (1970–78)."
},
"rule": "If a model needs a new excuse after every miss, say it is patching, not predicting.",
"needs": {
"code": "covered",
"note": "the track record sensor scores the radar by hits, not by explanations after the fact",
"covered_by": "trackrecord"
}
},
{
"id": "piaget",
"name": "Jean Piaget",
"name_ru": "Жан Пиаже",
"years": "1896–1980",
"wiki": "https://en.wikipedia.org/wiki/Jean_Piaget",
"zone": "own_limits",
"idea": {
"en": "Assimilation and accommodation ('The Origins of Intelligence in Children', 1936): new facts are first squeezed into old schemes; only when they do not fit is the scheme changed.",
"ru": "Ассимиляция и аккомодация («Происхождение интеллекта у детей», 1936): новые факты сначала втискивают в старые схемы; схему меняют, лишь когда они не помещаются.",
"de": "Assimilation und Akkommodation (1936)."
},
"rule": "When a new fact does not fit your picture, change the picture instead of bending the fact.",
"needs": {
"code": "covered",
"note": "applied: hosts say when a fact does not fit and keep several explanations open"
}
},
{
"id": "goedel",
"name": "Kurt Gödel",
"name_ru": "Курт Гёдель",
"years": "1906–1978",
"wiki": "https://en.wikipedia.org/wiki/Kurt_G%C3%B6del",
"zone": "own_limits",
"idea": {
"en": "The incompleteness theorems (1931): any consistent formal system rich enough for arithmetic contains true statements it cannot prove, and cannot prove its own consistency.",
"ru": "Теоремы о неполноте (1931): любая непротиворечивая формальная система, достаточно богатая для арифметики, содержит истинные утверждения, которые не может доказать, и не может доказать собственную непротиворечивость.",
"de": "Unvollständigkeitssätze (1931)."
},
"rule": "A system cannot fully check itself; for important claims, use a check from outside your own rules.",
"needs": {
"code": "covered",
"note": "the Rabin sensor re-checks published headlines against outside sources",
"covered_by": "rabin"
}
},
{
"id": "savage",
"name": "Leonard Jimmie Savage",
"name_ru": "Леонард Джимми Сэвидж",
"years": "1917–1971",
"wiki": "https://en.wikipedia.org/wiki/Leonard_Jimmie_Savage",
"zone": "answer_cost",
"idea": {
"en": "'The Foundations of Statistics' (1954): rational choice weighs each outcome by its probability and its value — and works only in a 'small world' where the options and outcomes can be listed.",
"ru": "«Основания статистики» (1954): разумный выбор взвешивает каждый исход по вероятности и ценности — и работает только в «малом мире», где варианты и исходы можно перечислить.",
"de": "„The Foundations of Statistics“ (1954): Entscheidung in der „kleinen Welt“."
},
"rule": "Weigh outcomes by both chance and cost, and say when the situation is too open to list them all.",
"needs": {
"code": "covered",
"note": "the Howard sensor already weighs the value of more information",
"covered_by": "howard"
}
},
{
"id": "frisch",
"name": "Ragnar Frisch",
"name_ru": "Рагнар Фриш",
"years": "1895–1973",
"wiki": "https://en.wikipedia.org/wiki/Ragnar_Frisch",
"zone": "one_model",
"idea": {
"en": "'Statistical Confluence Analysis' (1934): when the explaining variables move together, a regression cannot tell which one does the work — its coefficients become meaningless.",
"ru": "«Статистический анализ слияния» (1934): когда объясняющие величины движутся вместе, регрессия не может сказать, какая из них работает, — её коэффициенты теряют смысл.",
"de": "Konfluenzanalyse (1934): Multikollinearität."
},
"rule": "When several causes rise and fall together, do not credit one of them; say they cannot be separated.",
"needs": {
"code": "covered",
"note": "the Simpson and Halpern sensors already separate what moved an index",
"covered_by": "halpern"
}
},
{
"id": "phillips_w",
"name": "Bill Phillips",
"name_ru": "Билл Филлипс",
"years": "1914–1975",
"wiki": "https://en.wikipedia.org/wiki/William_Phillips_(economist)",
"zone": "one_model",
"idea": {
"en": "The Phillips curve (1958): a stable trade-off between unemployment and wage inflation in a century of data — which broke down in the 1970s once policy tried to exploit it.",
"ru": "Кривая Филлипса (1958): устойчивая связь безработицы и роста зарплат за столетие данных — которая распалась в 1970-х, когда политика попыталась ею пользоваться.",
"de": "Phillips-Kurve (1958) und ihr Zusammenbruch in den 1970ern."
},
"rule": "A relationship found in past data can vanish once people start acting on it; say so before relying on it.",
"needs": {
"code": "needs_history",
"note": "bridge 'published radar moves the market' (Rosenthal + Keynes + Wiener + Phillips: a link breaks once people act on it)",
"not_before": "2026-12-21"
}
},
{
"id": "snedecor",
"name": "George W. Snedecor",
"name_ru": "Джордж Снедекор",
"years": "1881–1974",
"wiki": "https://en.wikipedia.org/wiki/George_W._Snedecor",
"zone": "measurement_error",
"idea": {
"en": "'Statistical Methods' (1937) and the F-distribution (named by him after Fisher): a difference between groups means something only if it is large compared with the spread inside the groups.",
"ru": "«Статистические методы» (1937) и F-распределение (названное им в честь Фишера): разница между группами что-то значит, только если она велика по сравнению с разбросом внутри групп.",
"de": "„Statistical Methods“ (1937); F-Verteilung."
},
"rule": "Compare a difference between groups with the usual spread within them before calling it real.",
"needs": {
"code": "covered",
"note": "the track record sensor already compares changes with the radar's ordinary noise",
"covered_by": "trackrecord"
}
},
{
"id": "wedderburn_r",
"name": "Robert Wedderburn",
"name_ru": "Роберт Уэддерберн",
"years": "1947–1975",
"wiki": "https://en.wikipedia.org/wiki/Robert_Wedderburn_(statistician)",
"zone": "own_limits",
"idea": {
"en": "Quasi-likelihood (1974): you can fit and test a model knowing only how the mean and the spread are related, without pretending to know the full distribution.",
"ru": "Квазиправдоподобие (1974): модель можно подогнать и проверить, зная только связь среднего и разброса, не притворяясь, что знаешь всё распределение.",
"de": "Quasi-Likelihood (1974)."
},
"rule": "Assume only what you actually know about the data; do not invent a full model to look precise.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already gives bounds instead of one assumed model",
"covered_by": "leamer"
}
},
{
"id": "lippmann",
"name": "Walter Lippmann",
"name_ru": "Уолтер Липпман",
"years": "1889–1974",
"wiki": "https://en.wikipedia.org/wiki/Walter_Lippmann",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Public Opinion' (1922): people act on 'the pictures in our heads' — stereotypes and a pseudo-environment built from news — not on the world itself.",
"ru": "«Общественное мнение» (1922): люди действуют по «картинкам в головах» — стереотипам и псевдосреде из новостей, — а не по самому миру.",
"de": "„Die öffentliche Meinung“ (1922): Bilder in unseren Köpfen."
},
"rule": "Notice when a story fits a ready-made stereotype; check the facts that do not fit it.",
"needs": {
"code": "covered",
"note": "applied with Osgood: the news passport flags loaded framings in headlines (field tone)"
}
},
{
"id": "mcluhan",
"name": "Marshall McLuhan",
"name_ru": "Маршалл Маклюэн",
"years": "1911–1980",
"wiki": "https://en.wikipedia.org/wiki/Marshall_McLuhan",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Understanding Media' (1964): 'the medium is the message' — the channel shapes what can be said and how it is taken.",
"ru": "«Понимание медиа» (1964): «средство коммуникации есть сообщение» — канал определяет, что можно сказать и как это будет воспринято.",
"de": "„Die magischen Kanäle“ (1964): Das Medium ist die Botschaft."
},
"rule": "Remember what a headline's length and format leave out; a headline is not the full report.",
"needs": {
"code": "covered",
"note": "applied: the passport says when a headline is vague and adds what it leaves out"
}
},
{
"id": "barthes",
"name": "Roland Barthes",
"name_ru": "Ролан Барт",
"years": "1915–1980",
"wiki": "https://en.wikipedia.org/wiki/Roland_Barthes",
"zone": "look_alike",
"idea": {
"en": "'Mythologies' (1957): myth turns history into nature — a chosen way of presenting things comes to look like the way things simply are.",
"ru": "«Мифологии» (1957): миф превращает историю в природу — выбранный способ подачи начинает выглядеть как естественный порядок вещей.",
"de": "„Mythen des Alltags“ (1957)."
},
"rule": "Ask whether something presented as 'natural' or 'inevitable' is in fact someone's framing.",
"needs": {
"code": "needs_idea",
"note": "flag framings that present a choice as 'inevitable' or 'natural'; no tested word list yet"
}
},
{
"id": "ryle",
"name": "Gilbert Ryle",
"name_ru": "Гилберт Райл",
"years": "1900–1976",
"wiki": "https://en.wikipedia.org/wiki/Gilbert_Ryle",
"zone": "look_alike",
"idea": {
"en": "'The Concept of Mind' (1949): the category mistake — a visitor sees the colleges and libraries and asks 'but where is the university?'",
"ru": "«Понятие сознания» (1949): категориальная ошибка — гость осматривает колледжи и библиотеки и спрашивает: «А где же университет?»",
"de": "„Der Begriff des Geistes“ (1949): Kategorienfehler."
},
"rule": "Check that you are not treating a whole (a market, 'the West') as one more thing beside its parts.",
"needs": {
"code": "needs_idea",
"note": "flag headlines that treat a whole ('the market', 'the West') as one actor; no tested rule yet"
}
},
{
"id": "polanyi_m",
"name": "Michael Polanyi",
"name_ru": "Майкл Полани",
"years": "1891–1976",
"wiki": "https://en.wikipedia.org/wiki/Michael_Polanyi",
"zone": "own_limits",
"idea": {
"en": "'The Tacit Dimension' (1966): 'we can know more than we can tell' — much expert knowledge cannot be fully written down as rules.",
"ru": "«Неявное знание» (1966): «мы знаем больше, чем можем сказать» — многое из знания экспертов нельзя полностью записать в правила.",
"de": "„Implizites Wissen“ (1966)."
},
"rule": "Say when a judgement rests on rules you can state and when it rests on a hunch you cannot fully justify.",
"needs": {
"code": "covered",
"note": "applied: hosts say where the facts stop and the confidence they really have"
}
},
{
"id": "bertalanffy",
"name": "Ludwig von Bertalanffy",
"name_ru": "Людвиг фон Берталанфи",
"years": "1901–1972",
"wiki": "https://en.wikipedia.org/wiki/Ludwig_von_Bertalanffy",
"zone": "one_model",
"idea": {
"en": "'General System Theory' (1968): open systems show equifinality — the same final state can be reached from different starting points and by different paths.",
"ru": "«Общая теория систем» (1968): открытым системам свойственна эквифинальность — одно и то же конечное состояние достигается из разных начальных точек и разными путями.",
"de": "„General System Theory“ (1968): Äquifinalität."
},
"rule": "Do not infer one cause from an outcome; the same result can have several different paths.",
"needs": {
"code": "needs_history",
"note": "bridge 'who leads whom' (Granger + Reichenbach + Bertalanffy: several paths to one outcome)",
"not_before": "2026-12-14"
}
},
{
"id": "stevens_ss",
"name": "Stanley Smith Stevens",
"name_ru": "Стэнли Смит Стивенс",
"years": "1906–1973",
"wiki": "https://en.wikipedia.org/wiki/Stanley_Smith_Stevens",
"zone": "measurement_error",
"idea": {
"en": "'On the Theory of Scales of Measurement' (1946): nominal, ordinal, interval and ratio scales — what you may compute depends on the scale (you cannot average ranks as if they were amounts).",
"ru": "«О теории шкал измерения» (1946): номинальная, порядковая, интервальная и шкала отношений — что можно вычислять, зависит от шкалы (ранги нельзя усреднять как количества).",
"de": "„On the Theory of Scales of Measurement“ (1946)."
},
"rule": "Before averaging or comparing ratios, check what kind of scale the numbers are on.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces the unit and scale of every number",
"covered_by": "baird"
}
},
{
"id": "popper",
"name": "Karl Popper",
"name_ru": "Карл Поппер",
"years": "1902–1994",
"wiki": "https://en.wikipedia.org/wiki/Karl_Popper",
"zone": "one_model",
"idea": {
"en": "'The Logic of Scientific Discovery' (1934/1959): a claim is scientific only if some observation could prove it false; confirmations are cheap, a failed risky prediction tells you most.",
"ru": "«Логика научного открытия» (1934/1959): утверждение научно, только если какое-то наблюдение могло бы его опровергнуть; подтверждения дёшевы, больше всего говорит не сбывшееся рискованное предсказание.",
"de": "„Logik der Forschung“ (1934): Falsifizierbarkeit."
},
"rule": "Ask what would show the claim wrong; a claim that fits every outcome tells nothing.",
"needs": {
"code": "covered",
"note": "the track record sensor scores the radar by predictions that could fail",
"covered_by": "trackrecord"
}
},
{
"id": "kuhn",
"name": "Thomas Kuhn",
"name_ru": "Томас Кун",
"years": "1922–1996",
"wiki": "https://en.wikipedia.org/wiki/Thomas_Kuhn",
"zone": "one_model",
"idea": {
"en": "'The Structure of Scientific Revolutions' (1962): anomalies pile up unnoticed inside a reigning paradigm until it breaks.",
"ru": "«Структура научных революций» (1962): аномалии незаметно копятся внутри господствующей парадигмы, пока она не ломается.",
"de": "„Die Struktur wissenschaftlicher Revolutionen“ (1962)."
},
"rule": "Keep a list of facts the usual explanation does not fit instead of filing them as noise.",
"needs": {
"code": "covered",
"note": "the Polyak sensor flags lasting shifts; radar_noise separates anomalies from noise",
"covered_by": "polyak"
}
},
{
"id": "feyerabend",
"name": "Paul Feyerabend",
"name_ru": "Пол Фейерабенд",
"years": "1924–1994",
"wiki": "https://en.wikipedia.org/wiki/Paul_Feyerabend",
"zone": "one_model",
"idea": {
"en": "'Against Method' (1975): no single method has always produced progress; theories are tested best against rival theories, not only against facts.",
"ru": "«Против метода» (1975): ни один метод не приводил к прогрессу всегда; теории лучше всего проверяются соперничающими теориями, а не только фактами.",
"de": "„Wider den Methodenzwang“ (1975)."
},
"rule": "Test an explanation against a serious rival, not only against the facts that fit it.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already tests each index against rival model variants",
"covered_by": "leamer"
}
},
{
"id": "tinbergen",
"name": "Jan Tinbergen",
"name_ru": "Ян Тинберген",
"years": "1903–1994",
"wiki": "https://en.wikipedia.org/wiki/Jan_Tinbergen",
"zone": "side_effects",
"idea": {
"en": "The Tinbergen rule ('On the Theory of Economic Policy', 1952): to reach several independent targets you need at least as many independent instruments.",
"ru": "Правило Тинбергена («О теории экономической политики», 1952): чтобы достичь нескольких независимых целей, нужно не меньше независимых инструментов.",
"de": "Tinbergen-Regel (1952)."
},
"rule": "Be wary of a single measure promised to fix several problems at once.",
"needs": {
"code": "covered",
"note": "applied: hosts name who else gains or pays besides the main actor"
}
},
{
"id": "tversky",
"name": "Amos Tversky",
"name_ru": "Амос Тверски",
"years": "1937–1996",
"wiki": "https://en.wikipedia.org/wiki/Amos_Tversky",
"zone": "look_alike",
"idea": {
"en": "'Judgment under Uncertainty: Heuristics and Biases' (1974, with Kahneman): representativeness, availability and anchoring make people misjudge probabilities in predictable ways.",
"ru": "«Суждение в условиях неопределённости: эвристики и искажения» (1974, с Канеманом): репрезентативность, доступность и якорение предсказуемо искажают оценку вероятностей.",
"de": "Heuristiken und Verzerrungen (1974, mit Kahneman)."
},
"rule": "Before judging how likely something is, check you are not just recalling vivid or recent cases.",
"needs": {
"code": "covered",
"note": "the Kahneman sensor already measures noise between AI judges",
"covered_by": "kahneman"
}
},
{
"id": "hempel",
"name": "Carl Gustav Hempel",
"name_ru": "Карл Густав Гемпель",
"years": "1905–1997",
"wiki": "https://en.wikipedia.org/wiki/Carl_Gustav_Hempel",
"zone": "one_model",
"idea": {
"en": "The raven paradox (1945): if 'all ravens are black', every non-black non-raven (a white shoe) formally confirms it — not all confirmations are worth the same.",
"ru": "Парадокс ворона (1945): если «все вороны чёрные», то любая нечёрная не-ворона (белый ботинок) формально это подтверждает — не все подтверждения стоят одинаково.",
"de": "Rabenparadoxon (1945)."
},
"rule": "Weigh evidence by how much it could have told against the claim, not by how many items agree.",
"needs": {
"code": "covered",
"note": "check_headline counts independent voices, not reprints",
"covered_by": "frankfurt"
}
},
{
"id": "goodman",
"name": "Nelson Goodman",
"name_ru": "Нельсон Гудмен",
"years": "1906–1998",
"wiki": "https://en.wikipedia.org/wiki/Nelson_Goodman",
"zone": "one_model",
"idea": {
"en": "The new riddle of induction ('Fact, Fiction, and Forecast', 1955): 'grue' fits all past emeralds as well as 'green' — past data alone cannot pick the right pattern.",
"ru": "Новая загадка индукции («Факт, вымысел и прогноз», 1955): «зелубой» подходит ко всем прежним изумрудам так же, как «зелёный», — одни прошлые данные не выбирают верную закономерность.",
"de": "„Tatsache, Fiktion, Voraussage“ (1955): „grot“."
},
"rule": "Many patterns fit the past equally well; say why you extend this one.",
"needs": {
"code": "covered",
"note": "the Leamer sensor shows how far conclusions depend on the chosen model",
"covered_by": "leamer"
}
},
{
"id": "church",
"name": "Alonzo Church",
"name_ru": "Алонзо Чёрч",
"years": "1903–1995",
"wiki": "https://en.wikipedia.org/wiki/Alonzo_Church",
"zone": "own_limits",
"idea": {
"en": "Church's theorem (1936): there is no general mechanical procedure that decides, for every statement of first-order logic, whether it is provable.",
"ru": "Теорема Чёрча (1936): нет общей механической процедуры, которая решала бы для каждого утверждения логики первого порядка, доказуемо ли оно.",
"de": "Satz von Church (1936): Unentscheidbarkeit."
},
"rule": "Some questions have no procedure that always answers them; say so instead of looping.",
"needs": {
"code": "covered",
"note": "applied: hosts say plainly when something cannot be known yet"
}
},
{
"id": "asch",
"name": "Solomon Asch",
"name_ru": "Соломон Аш",
"years": "1907–1996",
"wiki": "https://en.wikipedia.org/wiki/Solomon_Asch",
"zone": "rumour_vs_fact",
"idea": {
"en": "The conformity experiments (1951–56): many people agreed with a group's plainly wrong judgement of line lengths; one dissenter broke the effect.",
"ru": "Опыты о конформизме (1951–56): многие соглашались с явно неверным мнением группы о длине линий; один несогласный разрушал эффект.",
"de": "Konformitätsexperimente (1951–56)."
},
"rule": "A unanimous chorus is not evidence; one independent dissent is worth hearing.",
"needs": {
"code": "covered",
"note": "check_headline already merges echoes and counts independent outlets",
"covered_by": "frankfurt"
}
},
{
"id": "campbell_dt",
"name": "Donald T. Campbell",
"name_ru": "Дональд Кэмпбелл",
"years": "1916–1996",
"wiki": "https://en.wikipedia.org/wiki/Donald_T._Campbell",
"zone": "side_effects",
"idea": {
"en": "Campbell's law (1976): the more a quantitative indicator is used for social decisions, the more it is corrupted and distorts what it measures.",
"ru": "Закон Кэмпбелла (1976): чем больше количественный показатель используется для общественных решений, тем сильнее его искажают и тем сильнее он искажает то, что измеряет.",
"de": "Campbells Gesetz (1976)."
},
"rule": "When a number becomes a target, expect it to drift from what it was meant to measure.",
"needs": {
"code": "needs_history",
"note": "bridge 'published radar moves the market' (Campbell + Phillips + Rosenthal: an indicator that becomes a target drifts)",
"not_before": "2026-12-21"
}
},
{
"id": "olson_m",
"name": "Mancur Olson",
"name_ru": "Мансур Олсон",
"years": "1932–1998",
"wiki": "https://en.wikipedia.org/wiki/Mancur_Olson",
"zone": "side_effects",
"idea": {
"en": "'The Logic of Collective Action' (1965): small groups with concentrated gains organise more easily than large groups with spread-out costs.",
"ru": "«Логика коллективных действий» (1965): малые группы с сосредоточенной выгодой организуются легче, чем большие группы с рассеянными издержками.",
"de": "„Die Logik des kollektiven Handelns“ (1965)."
},
"rule": "Ask who gains a lot from a decision and who loses a little each; the loud side is not always the larger one.",
"needs": {
"code": "needs_idea",
"note": "say whose concentrated gain and whose spread-out cost a decision has; no measurable form yet"
}
},
{
"id": "minsky_h",
"name": "Hyman Minsky",
"name_ru": "Хайман Мински",
"years": "1919–1996",
"wiki": "https://en.wikipedia.org/wiki/Hyman_Minsky",
"zone": "side_effects",
"idea": {
"en": "The financial instability hypothesis (1977–92): long calm periods encourage riskier borrowing, so stability itself breeds instability.",
"ru": "Гипотеза финансовой нестабильности (1977–92): долгие спокойные периоды поощряют более рискованные займы, так что стабильность сама порождает нестабильность.",
"de": "Hypothese der finanziellen Instabilität (1977–92)."
},
"rule": "Do not read a long calm stretch as safety; ask what risk it is building up.",
"needs": {
"code": "covered",
"note": "the Pareto sensor warns that calm stretches may hide rare big jumps",
"covered_by": "pareto"
}
},
{
"id": "vickrey",
"name": "William Vickrey",
"name_ru": "Уильям Викри",
"years": "1914–1996",
"wiki": "https://en.wikipedia.org/wiki/William_Vickrey",
"zone": "answer_cost",
"idea": {
"en": "The second-price auction (1961): if the winner pays the second-highest bid, bidding your true value becomes the best strategy.",
"ru": "Аукцион второй цены (1961): если победитель платит вторую по величине ставку, лучшей стратегией становится называть свою настоящую цену.",
"de": "Vickrey-Auktion (1961)."
},
"rule": "Design a question so that the honest answer is the best one to give.",
"needs": {
"code": "covered",
"note": "applied: the forecast game scores by the Brier rule, so the honest probability is the best answer"
}
},
{
"id": "lotman",
"name": "Yuri Lotman",
"name_ru": "Юрий Лотман",
"years": "1922–1993",
"wiki": "https://en.wikipedia.org/wiki/Yuri_Lotman",
"zone": "look_alike",
"idea": {
"en": "The semiosphere (1984): a text is understood through the cultural space around it; at the border between cultures, meanings are translated and changed.",
"ru": "Семиосфера (1984): текст понимается через окружающее его культурное пространство; на границе культур смыслы переводятся и меняются.",
"de": "Semiosphäre (1984)."
},
"rule": "When a story crosses from one culture or language to another, check what its words meant at the source.",
"needs": {
"code": "covered",
"note": "applied: the echo check compares the same story across ru/de/en"
}
},
{
"id": "winch",
"name": "Peter Winch",
"name_ru": "Питер Уинч",
"years": "1926–1997",
"wiki": "https://en.wikipedia.org/wiki/Peter_Winch",
"zone": "look_alike",
"idea": {
"en": "'The Idea of a Social Science' (1958): to describe what people do, you must first grasp the rules by which they themselves understand their actions.",
"ru": "«Идея социальной науки» (1958): чтобы описать, что люди делают, сначала надо понять правила, по которым они сами понимают свои действия.",
"de": "„Die Idee der Sozialwissenschaft“ (1958)."
},
"rule": "Before labelling another group's action, check what it means by their own rules.",
"needs": {
"code": "needs_idea",
"note": "check a label for another group against that group's own terms; no measurable form yet"
}
},
{
"id": "jones_ee",
"name": "Edward E. Jones",
"name_ru": "Эдвард Джонс",
"years": "1926–1993",
"wiki": "https://en.wikipedia.org/wiki/Edward_E._Jones",
"zone": "one_model",
"idea": {
"en": "The correspondence bias (1967, with Harris): people explain others' actions by character even when the situation clearly forced them.",
"ru": "Ошибка соответствия (1967, с Харрисом): люди объясняют поступки других характером, даже когда их явно вынудила ситуация.",
"de": "Korrespondenzverzerrung (1967)."
},
"rule": "Before blaming a person's character, check what the situation forced them to do.",
"needs": {
"code": "needs_idea",
"note": "flag headlines that blame a person where the facts point to circumstances; no word rule yet"
}
},
{
"id": "robinson_j",
"name": "Joan Robinson",
"name_ru": "Джоан Робинсон",
"years": "1903–1983",
"wiki": "https://en.wikipedia.org/wiki/Joan_Robinson",
"zone": "one_model",
"idea": {
"en": "'Marx, Marshall and Keynes' (1955): 'The purpose of studying economics is … to learn how to avoid being deceived by economists'; she coined 'monopsony' (1933).",
"ru": "«Маркс, Маршалл и Кейнс» (1955): «цель изучения экономики — … научиться не давать экономистам себя обмануть»; она ввела понятие «монопсония» (1933).",
"de": "„Marx, Marshall and Keynes“ (1955)."
},
"rule": "Treat an expert's model as a claim to check, not as a fact to repeat.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already shows how far an index depends on model choices",
"covered_by": "leamer"
}
},
{
"id": "allen_rgd",
"name": "R. G. D. Allen",
"name_ru": "Р. Дж. Д. Аллен",
"years": "1906–1983",
"wiki": "https://en.wikipedia.org/wiki/R._G._D._Allen",
"zone": "measurement_error",
"idea": {
"en": "'Index Numbers in Theory and Practice' (1975): every index rests on choices of basket, weights and base period, and these choices change the result.",
"ru": "«Индексы в теории и на практике» (1975): любой индекс опирается на выбор корзины, весов и базового периода, и этот выбор меняет результат.",
"de": "„Index Numbers in Theory and Practice“ (1975)."
},
"rule": "Say which basket, weights and base an index uses before comparing it over time.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces what every number measures and its base",
"covered_by": "baird"
}
},
{
"id": "price_dds",
"name": "Derek de Solla Price",
"name_ru": "Дерек де Солла Прайс",
"years": "1922–1983",
"wiki": "https://en.wikipedia.org/wiki/Derek_J._de_Solla_Price",
"zone": "stale_data",
"idea": {
"en": "'Little Science, Big Science' (1963) and the half-life of literature: scientific knowledge ages, and most citations go to recent work.",
"ru": "«Малая наука, большая наука» (1963) и период полураспада литературы: научное знание стареет, и большинство ссылок идёт на недавние работы.",
"de": "„Little Science, Big Science“ (1963): Halbwertszeit der Literatur."
},
"rule": "Check how old a source is relative to how fast its field changes.",
"needs": {
"code": "covered",
"note": "the Baird sensor already gives the age of every number; the passport flags old news",
"covered_by": "baird"
}
},
{
"id": "woodward_j",
"name": "Joan Woodward",
"name_ru": "Джоан Вудворд",
"years": "1916–1971",
"wiki": "https://en.wikipedia.org/wiki/Joan_Woodward",
"zone": "one_model",
"idea": {
"en": "'Industrial Organization: Theory and Practice' (1965): there is no one best way to organise — the right structure depends on the technology and scale of production.",
"ru": "«Промышленная организация: теория и практика» (1965): единственно правильного способа организации нет — подходящая структура зависит от технологии и масштаба производства.",
"de": "„Industrial Organization“ (1965): keine beste Organisationsform."
},
"rule": "Do not carry a recipe that worked in one setting into another without checking what differs.",
"needs": {
"code": "covered",
"note": "the Leamer sensor already shows how far a result depends on the setting chosen",
"covered_by": "leamer"
}
},
{
"id": "mooers",
"name": "Calvin Mooers",
"name_ru": "Кэлвин Мурс",
"years": "1919–1994",
"wiki": "https://en.wikipedia.org/wiki/Calvin_Mooers",
"zone": "answer_cost",
"idea": {
"en": "Mooers' law (1959): an information system will not be used when getting the information is more trouble than doing without it.",
"ru": "Закон Мурса (1959): информационной системой не будут пользоваться, если получить сведения хлопотнее, чем обойтись без них.",
"de": "Mooerssches Gesetz (1959)."
},
"rule": "Make the check cheap enough to be done; a check nobody runs protects nothing.",
"needs": {
"code": "covered",
"note": "the Bertsekas sensor already shows the cheapest chains of calls, so checks stay cheap",
"covered_by": "bertsekas"
}
},
{
"id": "neyman",
"name": "Jerzy Neyman",
"name_ru": "Ежи Нейман",
"years": "1894–1981",
"wiki": "https://en.wikipedia.org/wiki/Jerzy_Neyman",
"zone": "measurement_error",
"idea": {
"en": "'Outline of a Theory of Statistical Estimation' (1937): the confidence interval — give the range that would catch the true value in most repetitions, not one point.",
"ru": "«Очерк теории статистического оценивания» (1937): доверительный интервал — укажи диапазон, который в большинстве повторений поймает истинное значение, а не одну точку.",
"de": "Konfidenzintervall (1937)."
},
"rule": "Do not give a single estimate as the whole answer; give the range around it.",
"needs": {
"code": "covered",
"note": "the track record sensor already gives Wilson intervals, not single rates",
"covered_by": "trackrecord"
}
},
{
"id": "mackie",
"name": "J. L. Mackie",
"name_ru": "Джон Лесли Маки",
"years": "1917–1981",
"wiki": "https://en.wikipedia.org/wiki/J._L._Mackie",
"zone": "one_model",
"idea": {
"en": "'The Cement of the Universe' (1974), the INUS condition: what we call 'the cause' is usually one necessary part of a set of conditions that together suffice.",
"ru": "«Цемент вселенной» (1974), условие INUS: то, что мы называем «причиной», обычно лишь необходимая часть набора условий, которые вместе достаточны.",
"de": "INUS-Bedingung (1974)."
},
"rule": "Do not present one factor as the whole cause; name the other conditions it needed.",
"needs": {
"code": "covered",
"note": "the Halpern sensor already names the combination of headlines that moved an index",
"covered_by": "halpern"
}
},
{
"id": "jenkins_g",
"name": "Gwilym Jenkins",
"name_ru": "Гвилим Дженкинс",
"years": "1932–1982",
"wiki": "https://en.wikipedia.org/wiki/Gwilym_Jenkins",
"zone": "one_model",
"idea": {
"en": "'Time Series Analysis: Forecasting and Control' (1970, with Box): identify a model, fit it, check its residuals — and repeat when new data arrive.",
"ru": "«Анализ временных рядов: прогноз и управление» (1970, с Боксом): определи модель, подгони её, проверь остатки — и повтори, когда придут новые данные.",
"de": "Box-Jenkins-Methode (1970)."
},
"rule": "A fitted trend is a model, not a law; re-check it on new data before extending it.",
"needs": {
"code": "covered",
"note": "the Polyak sensor re-checks shifts on new data",
"covered_by": "polyak"
}
},
{
"id": "goffman",
"name": "Erving Goffman",
"name_ru": "Ирвинг Гофман",
"years": "1922–1982",
"wiki": "https://en.wikipedia.org/wiki/Erving_Goffman",
"zone": "look_alike",
"idea": {
"en": "'Frame Analysis' (1974): the same strip of events reads differently in different frames — a joke, a rehearsal, a real threat.",
"ru": "«Анализ фреймов» (1974): один и тот же отрезок событий читается по-разному в разных рамках — шутка, репетиция, настоящая угроза.",
"de": "„Rahmen-Analyse“ (1974)."
},
"rule": "Ask which frame a story is told in before treating a similar scene as the same event.",
"needs": {
"code": "covered",
"note": "the Searle sensor and passport already tell event, threat, promise and question apart",
"covered_by": "searle"
}
},
{
"id": "kendall",
"name": "Maurice Kendall",
"name_ru": "Морис Кендалл",
"years": "1907–1983",
"wiki": "https://en.wikipedia.org/wiki/Maurice_Kendall",
"zone": "measurement_error",
"idea": {
"en": "'Rank Correlation Methods' (1948), Kendall's tau: measure agreement in order when the sizes of the numbers cannot be trusted.",
"ru": "«Методы ранговой корреляции» (1948), тау Кендалла: измеряй согласие в порядке, когда самим величинам чисел нельзя доверять.",
"de": "Rangkorrelation, Kendalls Tau (1948)."
},
"rule": "When only the order of values is reliable, compare orders, not amounts.",
"needs": {
"code": "covered",
"note": "the Baird sensor already traces what scale each number is on",
"covered_by": "baird"
}
},
{
"id": "tarski",
"name": "Alfred Tarski",
"name_ru": "Альфред Тарский",
"years": "1901–1983",
"wiki": "https://en.wikipedia.org/wiki/Alfred_Tarski",
"zone": "own_limits",
"idea": {
"en": "The semantic theory of truth (1933, 1944): truth for a language cannot be defined inside that same language — only in a richer one above it.",
"ru": "Семантическая теория истины (1933, 1944): истинность для языка нельзя определить средствами того же языка — только в более богатом языке над ним.",
"de": "Semantischer Wahrheitsbegriff (1933, 1944)."
},
"rule": "A source cannot certify itself; check its claims against something outside it.",
"needs": {
"code": "covered",
"note": "the Rabin sensor re-checks headlines against outside sources",
"covered_by": "rabin"
}
},
{
"id": "de_finetti",
"name": "Bruno de Finetti",
"name_ru": "Бруно де Финетти",
"years": "1906–1985",
"wiki": "https://en.wikipedia.org/wiki/Bruno_de_Finetti",
"zone": "own_limits",
"idea": {
"en": "'La prévision' (1937): a probability is the price at which you would bet; a set of prices that guarantees a sure loss (a Dutch book) is incoherent.",
"ru": "«Предвидение» (1937): вероятность — это цена, по которой ты готов поставить; набор цен, гарантирующий верный проигрыш («голландская книга»), несогласован.",
"de": "„La prévision“ (1937): Dutch Book."
},
"rule": "Keep your stated chances consistent: probabilities of all outcomes must add up.",
"needs": {
"code": "covered",
"note": "applied: the forecast game scores by the Brier rule, so incoherent confidence costs"
}
},
{
"id": "kuznets",
"name": "Simon Kuznets",
"name_ru": "Саймон Кузнец",
"years": "1901–1985",
"wiki": "https://en.wikipedia.org/wiki/Simon_Kuznets",
"zone": "measurement_error",
"idea": {
"en": "'National Income, 1929–1932' (1934), his report to Congress: 'The welfare of a nation can scarcely be inferred from a measurement of national income.'",
"ru": "«Национальный доход, 1929–1932» (1934), его доклад Конгрессу: «О благосостоянии нации едва ли можно судить по измерению национального дохода».",
"de": "Volkseinkommen 1929–1932 (1934)."
},
"rule": "Do not read a single headline number (GDP, an index) as how people are doing.",
"needs": {
"code": "covered",
"note": "the Baird sensor already says what each published number does and does not measure",
"covered_by": "baird"
}
},
{
"id": "cramer",
"name": "Harald Cramér",
"name_ru": "Харальд Крамер",
"years": "1893–1985",
"wiki": "https://en.wikipedia.org/wiki/Harald_Cram%C3%A9r",
"zone": "measurement_error",
"idea": {
"en": "'Mathematical Methods of Statistics' (1946) and the Cramér–Rao bound: no estimate from given data can be more precise than a certain limit.",
"ru": "«Математические методы статистики» (1946) и граница Крамера — Рао: никакая оценка по данным не может быть точнее определённого предела.",
"de": "Cramér-Rao-Schranke (1946)."
},
"rule": "Do not report more precision than your data can possibly give.",
"needs": {
"code": "covered",
"note": "the track record sensor already reports uncertainty that grows with fewer days",
"covered_by": "trackrecord"
}
},
{
"id": "kolmogorov",
"name": "Andrey Kolmogorov",
"name_ru": "Андрей Колмогоров",
"years": "1903–1987",
"wiki": "https://en.wikipedia.org/wiki/Andrey_Kolmogorov",
"zone": "own_limits",
"idea": {
"en": "'Grundbegriffe der Wahrscheinlichkeitsrechnung' (1933): the axioms of probability — a number is a probability only if it obeys them.",
"ru": "«Основные понятия теории вероятностей» (1933): аксиомы вероятности — число является вероятностью, только если подчиняется им.",
"de": "„Grundbegriffe der Wahrscheinlichkeitsrechnung“ (1933)."
},
"rule": "'Likely' is not a probability; give a number only if it is consistent and grounded.",
"needs": {
"code": "covered",
"note": "applied: the forecast game asks for a number, scored by the Brier rule"
}
},
{
"id": "grice",
"name": "Paul Grice",
"name_ru": "Пол Грайс",
"years": "1913–1988",
"wiki": "https://en.wikipedia.org/wiki/Paul_Grice",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Logic and Conversation' (1967/1975): implicature — what is suggested goes beyond what is said ('some officials resigned' suggests not all).",
"ru": "«Логика и речевое общение» (1967/1975): импликатура — подразумеваемое выходит за пределы сказанного («часть чиновников ушла» намекает, что не все).",
"de": "„Logik und Konversation“ (1967/1975): Implikatur."
},
"rule": "Report what a headline says, not what it implies; the hint is not part of the fact.",
"needs": {
"code": "needs_idea",
"note": "flag headlines whose quantifiers (some, several, up to) imply more than they state; joins the Frankfurt checkability rules"
}
},
{
"id": "festinger",
"name": "Leon Festinger",
"name_ru": "Леон Фестингер",
"years": "1919–1989",
"wiki": "https://en.wikipedia.org/wiki/Leon_Festinger",
"zone": "own_limits",
"idea": {
"en": "'When Prophecy Fails' (1956) and cognitive dissonance (1957): when a prediction fails, believers often hold it more firmly instead of changing their view.",
"ru": "«Когда пророчество не сбывается» (1956) и когнитивный диссонанс (1957): когда предсказание проваливается, верящие часто держатся за него крепче, вместо того чтобы изменить взгляд.",
"de": "„Wenn Prophezeiungen fehlschlagen“ (1956)."
},
"rule": "When your forecast fails, say so and update; do not explain the miss away.",
"needs": {
"code": "covered",
"note": "the Pearson sensor and the Brier score keep missed forecasts on record",
"covered_by": "pearson"
}
},
{
"id": "kahn_r",
"name": "Richard Kahn",
"name_ru": "Ричард Кан",
"years": "1905–1989",
"wiki": "https://en.wikipedia.org/wiki/Richard_Kahn,_Baron_Kahn",
"zone": "side_effects",
"idea": {
"en": "'The Relation of Home Investment to Unemployment' (1931): the multiplier — one round of spending sets off further rounds across the economy.",
"ru": "«Связь внутренних инвестиций с безработицей» (1931): мультипликатор — один круг расходов запускает следующие круги по всей экономике.",
"de": "Multiplikator (1931)."
},
"rule": "Follow a change past its first effect: one spending decision ripples through others.",
"needs": {
"code": "needs_history",
"note": "bridge 'spill-over between radars' (Leontief + Walras + Kahn multiplier)",
"not_before": "2026-12-21"
}
},
{
"id": "tulving",
"name": "Endel Tulving",
"name_ru": "Эндель Тульвинг",
"years": "1927–2023",
"wiki": "https://en.wikipedia.org/wiki/Endel_Tulving",
"zone": "own_limits",
"idea": {
"en": "Encoding specificity (Tulving and Thomson, 1973): a memory is found only by a cue that matches how it was stored; a failed search does not prove the memory is absent.",
"ru": "Принцип специфичности кодирования (Тульвинг и Томсон, 1973): запись находится только по ключу, совпадающему с тем, как её записали; неудачный поиск не доказывает, что её нет.",
"de": "Prinzip der Enkodierungsspezifität (1973)."
},
"rule": "When a search finds nothing, say which key you searched with; try the form in which the record was likely stored before calling it absent.",
"needs": {
"code": "needs_idea",
"note": "bridge 'not found ≠ not there' (Tulving + Frege + Levenshtein): look names up in the form they were stored — e.g. Russian names in the nominative for the Frege sensor"
}
},
{
"id": "naatanen",
"name": "Risto Näätänen",
"name_ru": "Ристо Наатанен",
"years": "1939–2023",
"wiki": "https://en.wikipedia.org/wiki/Risto_N%C3%A4%C3%A4t%C3%A4nen",
"zone": "measurement_error",
"idea": {
"en": "Mismatch negativity (1978): perception flags a deviation from the standard it has just learned, even without attention — change is judged against the recent baseline.",
"ru": "Негативность рассогласования (1978): восприятие отмечает отклонение от только что выученного стандарта даже без внимания — изменение судят по недавнему фону.",
"de": "Mismatch Negativity (1978)."
},
"rule": "Judge a change against the recent ordinary level of the same series, not against an absolute number.",
"needs": {
"code": "covered",
"note": "the radar noise block and vs_typical already judge a change against the radar's recent ordinary level",
"covered_by": "trackrecord"
}
},
{
"id": "schaie",
"name": "K. Warner Schaie",
"name_ru": "К. Уорнер Шайи",
"years": "1928–2023",
"wiki": "https://en.wikipedia.org/wiki/K._Warner_Schaie",
"zone": "stale_data",
"idea": {
"en": "Seattle Longitudinal Study (from 1956): a cross-section of ages at one moment confounds age with generation; following the same people over time separates them.",
"ru": "Сиэтлское лонгитюдное исследование (с 1956): срез по возрастам в один момент путает возраст с поколением; разделить их можно, только следя за одними и теми же людьми.",
"de": "Seattle-Längsschnittstudie (ab 1956)."
},
"rule": "Do not read a difference between groups at one moment as a change over time; compare the same units across time.",
"needs": {
"code": "covered",
"note": "the Simpson sensor already separates change within radars from change in composition",
"covered_by": "simpson"
}
},
{
"id": "kintsch",
"name": "Walter Kintsch",
"name_ru": "Вальтер Кинч",
"years": "1932–2023",
"wiki": "https://en.wikipedia.org/wiki/Walter_Kintsch",
"zone": "one_model",
"idea": {
"en": "Construction–integration model (1988): comprehension first builds many candidate readings, then keeps those that fit together.",
"ru": "Модель построения и интеграции (1988): понимание сначала строит много вариантов прочтения, потом оставляет согласованные.",
"de": "Konstruktions-Integrations-Modell (1988)."
},
"rule": "Before settling on one reading of a headline, list the plausible readings and keep the one the other facts support.",
"needs": {
"code": "covered",
"note": "applied: hosts keep several working hypotheses (Chamberlin rule)"
}
},
{
"id": "vroom",
"name": "Victor Vroom",
"name_ru": "Виктор Врум",
"years": "1932–2023",
"wiki": "https://en.wikipedia.org/wiki/Victor_Vroom",
"zone": "answer_cost",
"idea": {
"en": "'Work and Motivation' (1964), expectancy theory: effort follows expectancy × instrumentality × value — people act when they expect the action to work and the result to matter.",
"ru": "«Работа и мотивация» (1964), теория ожиданий: усилие = ожидание × инструментальность × ценность — человек действует, если верит, что действие сработает и результат важен.",
"de": "„Work and Motivation“ (1964), Erwartungstheorie."
},
"rule": "Offer a check only when it is likely to change the answer and the answer matters; say when a check is not worth its cost.",
"needs": {
"code": "covered",
"note": "the Cohen sensor and Mooers' law: a check is shown with the effect it can detect",
"covered_by": "cohen"
}
},
{
"id": "parducci",
"name": "Allen Parducci",
"name_ru": "Аллен Пардуччи",
"years": "1925–2023",
"wiki": "https://en.wikipedia.org/wiki/Allen_Parducci",
"zone": "measurement_error",
"idea": {
"en": "Range–frequency theory (1963, 1965): a judged value depends on the range and the distribution of the whole set it is compared with.",
"ru": "Теория диапазона и частоты (1963, 1965): оценка зависит от диапазона и распределения всего набора, с которым сравнивают.",
"de": "Bereichs-Häufigkeits-Theorie (1963, 1965)."
},
"rule": "When you call a level high or low, say against which set and range — the same number can be high in a quiet month and low in a busy one.",
"needs": {
"code": "covered",
"note": "applied: /api/v1/radars gives each radar level as a percentile of its own 30-day half-hourly values (level_vs_30d)"
}
},
{
"id": "baron_r",
"name": "Reuben M. Baron",
"name_ru": "Рубен М. Барон",
"years": "1936–2023",
"wiki": "https://en.wikipedia.org/wiki/Reuben_M._Baron",
"zone": "look_alike",
"idea": {
"en": "The moderator–mediator distinction (Baron and Kenny, 1986): 'through what' an effect works and 'under which condition' it holds are different roles.",
"ru": "Различие медиатора и модератора (Барон и Кенни, 1986): «через что» действует влияние и «при каком условии» оно есть — разные роли.",
"de": "Moderator–Mediator-Unterscheidung (1986)."
},
"rule": "Say whether a factor carries an effect or only changes when the effect appears; do not call a condition a cause.",
"needs": {
"code": "needs_history",
"note": "bridge 'who leads whom' (Baron + Reichenbach + Granger: carrier vs condition)",
"not_before": "2026-12-14"
}
},
{
"id": "bregman",
"name": "Albert Bregman",
"name_ru": "Альберт Брегман",
"years": "1936–2023",
"wiki": "https://en.wikipedia.org/wiki/Albert_Bregman",
"zone": "look_alike",
"idea": {
"en": "'Auditory Scene Analysis' (1990): a mixture of signals is not one source; perception must separate the streams before naming them.",
"ru": "«Анализ слуховой сцены» (1990): смесь сигналов — не один источник; сначала разделить потоки, потом называть.",
"de": "„Auditory Scene Analysis“ (1990)."
},
"rule": "Before counting voices for a story, separate the independent sources from copies of one source.",
"needs": {
"code": "covered",
"note": "the echo check and first_source already separate independent outlets from copies",
"covered_by": "kasperson"
}
},
{
"id": "markova_i",
"name": "Ivana Marková",
"name_ru": "Ивана Маркова",
"years": "1938–2024",
"wiki": "https://en.wikipedia.org/wiki/Ivana_Markova",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Dialogicality and Social Representations' (2003): knowledge lives in dialogue; one statement is a turn, not the end of the conversation.",
"ru": "«Диалогичность и социальные представления» (2003): знание живёт в диалоге; одно утверждение — реплика, а не конец разговора.",
"de": "„Dialogicality and Social Representations“ (2003)."
},
"rule": "Treat a first statement as one turn; look for the reply, the correction or the denial before calling the matter settled.",
"needs": {
"code": "covered",
"note": "the Harman sensor waits 72 hours for replies and corrections",
"covered_by": "harman"
}
},
{
"id": "shulman",
"name": "Lee Shulman",
"name_ru": "Ли Шулман",
"years": "1938–2024",
"wiki": "https://en.wikipedia.org/wiki/Lee_Shulman",
"zone": "look_alike",
"idea": {
"en": "Pedagogical content knowledge (1986): knowing a subject and knowing how to explain it are different kinds of knowledge.",
"ru": "Педагогическое знание предмета (1986): знать предмет и уметь его объяснить — разные знания.",
"de": "Fachdidaktisches Wissen (1986)."
},
"rule": "A clear explanation is not proof of correct content, and correct content may still be explained badly; check them separately.",
"needs": {
"code": "covered",
"note": "applied: rule 'smoothness ≠ understanding' (Weizenbaum) in the host prompts"
}
},
{
"id": "nesselroade",
"name": "John Nesselroade",
"name_ru": "Джон Несселроуд",
"years": "1936–2024",
"wiki": "https://en.wikipedia.org/wiki/John_Nesselroade",
"zone": "measurement_error",
"idea": {
"en": "Intraindividual variability and change (1970, 1991): short-term fluctuation within one unit, lasting change over time, differences between units and measurement noise are four different things.",
"ru": "Внутрииндивидуальная изменчивость и изменение (1970, 1991): колебания внутри одной единицы, устойчивое изменение во времени, различия между единицами и шум измерения — четыре разные вещи.",
"de": "Intraindividuelle Variabilität (1970, 1991)."
},
"rule": "Before calling a move a shift, check whether it is the series' ordinary flicker, a lasting change, a difference between series or noise.",
"needs": {
"code": "covered",
"note": "the radar noise block separates flicker from a shift",
"covered_by": "trackrecord"
}
},
{
"id": "flavell",
"name": "John H. Flavell",
"name_ru": "Джон Х. Флейвелл",
"years": "1928–2025",
"wiki": "https://en.wikipedia.org/wiki/John_H._Flavell",
"zone": "look_alike",
"idea": {
"en": "Appearance–reality distinction and false belief (1986, 1993): how a thing looks is not what it is, and knowing this is itself a skill.",
"ru": "Различие видимости и реальности, ложное убеждение (1986, 1993): как вещь выглядит — ещё не то, какова она; знать это — отдельное умение.",
"de": "Schein und Wirklichkeit (1986, 1993)."
},
"rule": "Report what a headline or a chart looks like and what it actually shows as two separate statements.",
"needs": {
"code": "covered",
"note": "applied: passport lines 'metaphor ≠ fact' and 'loaded words' separate how a headline looks from what it states"
}
},
{
"id": "reber",
"name": "Arthur S. Reber",
"name_ru": "Артур С. Ребер",
"years": "1940–2025",
"wiki": "https://en.wikipedia.org/wiki/Arthur_S._Reber",
"zone": "own_limits",
"idea": {
"en": "Implicit learning of artificial grammars (1967): people can follow a rule they cannot state.",
"ru": "Неявное научение искусственным грамматикам (1967): человек может следовать правилу, которое не умеет назвать.",
"de": "Implizites Lernen künstlicher Grammatiken (1967)."
},
"rule": "If you cannot state the rule behind a judgement, say that it is a pattern you cannot fully explain.",
"needs": {
"code": "covered",
"note": "applied: hosts say when a judgement rests on a pattern they cannot fully state (Polanyi rule)"
}
},
{
"id": "reason_j",
"name": "James Reason",
"name_ru": "Джеймс Ризон",
"years": "1938–2025",
"wiki": "https://en.wikipedia.org/wiki/James_Reason",
"zone": "side_effects",
"idea": {
"en": "'Human Error' (1990), the layered-defence ('Swiss cheese') model: a failure usually passes through holes lined up in several layers, not one culprit.",
"ru": "«Ошибка человека» (1990), модель «швейцарского сыра»: сбой обычно проходит через выстроившиеся дыры в нескольких слоях защиты, а не по вине одного.",
"de": "„Human Error“ (1990), Schweizer-Käse-Modell."
},
"rule": "When a check fails, ask which layers let it through, not who is to blame.",
"needs": {
"code": "covered",
"note": "the Harman sensor now shows, for later-challenged stories, which passport checks fired at first sight and which stories passed every layer (block layers)",
"covered_by": "harman"
}
},
{
"id": "mandler_j",
"name": "Jean Mandler",
"name_ru": "Джин Мандлер",
"years": "1929–2025",
"wiki": "https://en.wikipedia.org/wiki/Jean_Mandler",
"zone": "one_model",
"idea": {
"en": "'Stories, Scripts, and Scenes' (1984): memory keeps the schema, not the exact words; retellings drift toward the expected script.",
"ru": "«Истории, сценарии и сцены» (1984): память хранит схему, а не дословный текст; пересказ сползает к ожидаемому сценарию.",
"de": "„Stories, Scripts, and Scenes“ (1984)."
},
"rule": "When a retelling fits a familiar script too neatly, go back to the exact original words.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor and the quote-out-of-context line catch retellings that drift",
"covered_by": "kasperson"
}
},
{
"id": "smallwood",
"name": "Jonathan Smallwood",
"name_ru": "Джонатан Смоллвуд",
"years": "1975–2025",
"wiki": "https://en.wikipedia.org/wiki/Jonathan_Smallwood",
"zone": "own_limits",
"idea": {
"en": "'The Restless Mind' (Smallwood and Schooler, 2006): attention drifts from the task while the work seems to continue.",
"ru": "«Беспокойный ум» (Смоллвуд и Скулер, 2006): внимание уходит с задачи, пока кажется, что работа идёт.",
"de": "„The Restless Mind“ (2006)."
},
"rule": "Before finishing an answer, check that it still answers the question that was asked.",
"needs": {
"code": "covered",
"note": "applied: host rule — answer the question in the first sentence, come back if you drift (Grok, David, round table)"
}
},
{
"id": "das_jp",
"name": "J. P. Das",
"name_ru": "Джаганнатх Прасад Дас",
"years": "1931–2025",
"wiki": "https://en.wikipedia.org/wiki/Jagannath_Prasad_Das_(psychologist)",
"zone": "one_model",
"idea": {
"en": "PASS theory (Das, Naglieri and Kirby, 1994): intelligence is several processes — planning, attention, simultaneous and successive — not one number.",
"ru": "Теория PASS (Дас, Наглиери, Кирби, 1994): интеллект — несколько процессов (планирование, внимание, одновременная и последовательная обработка), а не одно число.",
"de": "PASS-Theorie (1994)."
},
"rule": "Do not compress several measures into one number without showing the parts it hides.",
"needs": {
"code": "needs_history",
"note": "bridge 'one number or several' (Das + Goldberg + Spearman + Leontief): how many independent dimensions the 8 radars have — ix_hist keeps all 8 since 23.11",
"not_before": "2026-12-21"
}
},
{
"id": "collins_am",
"name": "Allan M. Collins",
"name_ru": "Аллан М. Коллинз",
"years": "1937–2026",
"wiki": "https://en.wikipedia.org/wiki/Allan_M._Collins",
"zone": "look_alike",
"idea": {
"en": "Spreading activation (Collins and Loftus, 1975): thinking of one concept activates its neighbours; nearness in memory is not identity.",
"ru": "Распространяющаяся активация (Коллинз и Лофтус, 1975): мысль о понятии будит соседние; близость в памяти — не тождество.",
"de": "Aktivierungsausbreitung (1975)."
},
"rule": "A related word in a headline is not the same story; check that two items share the facts, not only the associations.",
"needs": {
"code": "needs_idea",
"note": "bridge 'similar context ≠ same meaning' (Collins + Harris + Kilgarriff)"
}
},
{
"id": "deci",
"name": "Edward L. Deci",
"name_ru": "Эдвард Л. Деси",
"years": "1942–2026",
"wiki": "https://en.wikipedia.org/wiki/Edward_L._Deci",
"zone": "side_effects",
"idea": {
"en": "'Intrinsic Motivation and Self-Determination' (Deci and Ryan, 1985): an external reward can weaken the motive it was meant to support.",
"ru": "«Внутренняя мотивация и самодетерминация» (Деси и Райан, 1985): внешняя награда может ослабить тот мотив, который должна была поддержать.",
"de": "„Intrinsic Motivation and Self-Determination“ (1985)."
},
"rule": "When points or rankings are attached to answers, check whether they changed what is being answered.",
"needs": {
"code": "needs_history",
"note": "bridge 'the reward changes the answer' (Deci + Campbell + Burkov): does scoring change agents' answers in the forecast game",
"not_before": "2026-12-21"
}
},
{
"id": "klahr",
"name": "David Klahr",
"name_ru": "Дэвид Клар",
"years": "1940–2026",
"wiki": "https://en.wikipedia.org/wiki/David_Klahr",
"zone": "one_model",
"idea": {
"en": "Dual-space search (Klahr and Dunbar, 1988): scientific discovery searches both a space of hypotheses and a space of experiments.",
"ru": "Поиск в двух пространствах (Клар и Данбар, 1988): открытие ищет и в пространстве гипотез, и в пространстве опытов.",
"de": "Suche in zwei Räumen (1988)."
},
"rule": "Name the hypothesis and the observation that would test it together; a hypothesis without a test is not yet a finding.",
"needs": {
"code": "covered",
"note": "applied: Fisher rule 'state the test before the data' in the track record and forecast game",
"covered_by": "trackrecord"
}
},
{
"id": "goldberg_l",
"name": "Lewis Goldberg",
"name_ru": "Льюис Голдберг",
"years": "1932–2026",
"wiki": "https://en.wikipedia.org/wiki/Lewis_Goldberg",
"zone": "one_model",
"idea": {
"en": "The Big-Five factor structure (1990): personality description needs several independent dimensions, not one scale.",
"ru": "Структура «Большой пятёрки» (1990): описание личности требует нескольких независимых измерений, а не одной шкалы.",
"de": "Fünf-Faktoren-Struktur (1990)."
},
"rule": "Check how many independent dimensions a set of indicators really has before summing them.",
"needs": {
"code": "needs_history",
"note": "bridge 'one number or several' (Goldberg + Das + Spearman)",
"not_before": "2026-12-21"
}
},
{
"id": "bartlett",
"name": "Frederic Bartlett",
"name_ru": "Фредерик Бартлетт",
"years": "1886–1969",
"wiki": "https://en.wikipedia.org/wiki/Frederic_Bartlett",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Remembering' (1932), serial reproduction: passed from person to person, a story is shortened and reshaped to fit what the teller expects.",
"ru": "«Воспоминание» (1932), серийное воспроизведение: передаваясь от человека к человеку, история укорачивается и подгоняется под ожидания рассказчика.",
"de": "„Remembering“ (1932), serielle Reproduktion."
},
"rule": "Check a retold story against its first version, not against the latest copy.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor and the first-source line check retellings against the first version",
"covered_by": "kasperson"
}
},
{
"id": "stern_w",
"name": "William Stern",
"name_ru": "Вильям Штерн",
"years": "1871–1938",
"wiki": "https://en.wikipedia.org/wiki/William_Stern_(psychologist)",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Zur Psychologie der Aussage' (1902): honest, confident witnesses still err in details; confidence does not guarantee accuracy.",
"ru": "«К психологии показаний» (1902): честный и уверенный свидетель всё равно ошибается в деталях; уверенность не гарантирует точности.",
"de": "„Zur Psychologie der Aussage“ (1902)."
},
"rule": "Treat an eyewitness detail as one report, however confident the witness sounds.",
"needs": {
"code": "covered",
"note": "the Harman sensor checks whether confident passports are challenged less",
"covered_by": "harman"
}
},
{
"id": "ebbinghaus",
"name": "Hermann Ebbinghaus",
"name_ru": "Герман Эббингауз",
"years": "1850–1909",
"wiki": "https://en.wikipedia.org/wiki/Hermann_Ebbinghaus",
"zone": "stale_data",
"idea": {
"en": "'Über das Gedächtnis' (1885), the forgetting curve: without rehearsal most detail is lost within hours and days.",
"ru": "«О памяти» (1885), кривая забывания: без повторения большая часть деталей теряется за часы и дни.",
"de": "„Über das Gedächtnis“ (1885), Vergessenskurve."
},
"rule": "A late retelling is not the original record; go back to what was written at the time.",
"needs": {
"code": "covered",
"note": "passport freshness checks (stale after 24 h) and the first-source line"
}
},
{
"id": "neisser",
"name": "Ulric Neisser",
"name_ru": "Ульрик Найссер",
"years": "1928–2012",
"wiki": "https://en.wikipedia.org/wiki/Ulric_Neisser",
"zone": "own_limits",
"idea": {
"en": "'Phantom flashbulbs' (Neisser and Harsch, 1992): vivid, confident memories of how one heard shocking news are often wrong.",
"ru": "«Фантомные вспышки» (Найссер и Харш, 1992): яркие уверенные воспоминания о том, как человек узнал шокирующую новость, часто ошибочны.",
"de": "„Phantom flashbulbs“ (1992)."
},
"rule": "Do not take vividness or certainty of a memory as evidence that it is accurate.",
"needs": {
"code": "covered",
"note": "the Harman sensor: confidence is checked against later corrections",
"covered_by": "harman"
}
},
{
"id": "brown_r",
"name": "Roger Brown",
"name_ru": "Роджер Браун",
"years": "1925–1997",
"wiki": "https://en.wikipedia.org/wiki/Roger_Brown_(psychologist)",
"zone": "own_limits",
"idea": {
"en": "'Flashbulb memories' (Brown and Kulik, 1977): shocking news leaves memories that feel photographic.",
"ru": "«Память-вспышка» (Браун и Кулик, 1977): шокирующая новость оставляет воспоминание, которое кажется фотографическим.",
"de": "„Flashbulb memories“ (1977)."
},
"rule": "The feeling of remembering exactly is not a check; compare with records from the time.",
"needs": {
"code": "covered",
"note": "the Harman sensor: confidence is checked against later corrections",
"covered_by": "harman"
}
},
{
"id": "schachter",
"name": "Stanley Schachter",
"name_ru": "Стэнли Шехтер",
"years": "1922–1997",
"wiki": "https://en.wikipedia.org/wiki/Stanley_Schachter",
"zone": "rumour_vs_fact",
"idea": {
"en": "'A field experiment on rumor transmission and distortion' (Schachter and Burdick, 1955): a hint without explanation in an unclear, important situation starts rumours.",
"ru": "«Полевой эксперимент о передаче и искажении слухов» (Шехтер и Бёрдик, 1955): намёк без объяснения в неясной и важной ситуации запускает слухи.",
"de": "Feldexperiment zur Gerüchteübertragung (1955)."
},
"rule": "When a story hints at something without saying what, say what is actually known and what is not.",
"needs": {
"code": "covered",
"note": "applied: the passport's rumour-risk and vague-headline lines"
}
},
{
"id": "cartwright_d",
"name": "Dorwin Cartwright",
"name_ru": "Дорвин Картрайт",
"years": "1915–2008",
"wiki": "https://en.wikipedia.org/wiki/Dorwin_Cartwright",
"zone": "rumour_vs_fact",
"idea": {
"en": "'A study of a rumor: its origin and spread' (Festinger, Cartwright and others, 1948): rumours grow from uncertainty and travel among people who share one worry.",
"ru": "«Исследование слуха: происхождение и распространение» (Фестингер, Картрайт и др., 1948): слух растёт из неясности и идёт среди людей с одной тревогой.",
"de": "„A study of a rumor“ (1948)."
},
"rule": "Before repeating an alarming claim, look for an official answer; name it if there is one.",
"needs": {
"code": "covered",
"note": "applied: the passport's rumour-risk line asks for confirmed facts and an independent source"
}
},
{
"id": "einhorn",
"name": "Hillel J. Einhorn",
"name_ru": "Хиллел Эйнхорн",
"years": "1941–1987",
"wiki": "https://en.wikipedia.org/wiki/Hillel_J._Einhorn",
"zone": "own_limits",
"idea": {
"en": "'Confidence in judgment: persistence of the illusion of validity' (Einhorn and Hogarth, 1978): confidence persists when there is no feedback about accuracy.",
"ru": "«Уверенность в суждении: стойкость иллюзии обоснованности» (Эйнхорн и Хогарт, 1978): уверенность держится, когда нет обратной связи о точности.",
"de": "Illusion der Validität (1978)."
},
"rule": "Keep a record of how often your confident calls were right; without it confidence is not evidence.",
"needs": {
"code": "covered",
"note": "the Pearson sensor and Brier scores keep confident calls on record",
"covered_by": "pearson"
}
},
{
"id": "brunswik",
"name": "Egon Brunswik",
"name_ru": "Эгон Брунсвик",
"years": "1903–1955",
"wiki": "https://en.wikipedia.org/wiki/Egon_Brunswik",
"zone": "measurement_error",
"idea": {
"en": "The lens model ('Perception and the Representative Design of Psychological Experiments', 1956): judge cues by how strongly each is actually tied to the fact.",
"ru": "Модель линзы («Восприятие и репрезентативный план экспериментов», 1956): оценивай признаки по тому, насколько каждый на деле связан с фактом.",
"de": "Linsenmodell (1956)."
},
"rule": "Weigh each warning sign by how often it has really gone with a later correction.",
"needs": {
"code": "covered",
"note": "the Harman sensor's layers block weighs each passport check by how often it fired on later-challenged stories",
"covered_by": "harman"
}
},
{
"id": "bruner",
"name": "Jerome Bruner",
"name_ru": "Джером Брунер",
"years": "1915–2016",
"wiki": "https://en.wikipedia.org/wiki/Jerome_Bruner",
"zone": "one_model",
"idea": {
"en": "'Interference in visual recognition' (Bruner and Potter, 1964): an early guess from blurred data makes the right answer harder to see once the data clear.",
"ru": "«Интерференция при зрительном узнавании» (Брунер и Поттер, 1964): ранняя догадка по размытым данным мешает увидеть верный ответ, когда данные проясняются.",
"de": "Interferenz beim Erkennen (1964)."
},
"rule": "Hold early readings of a breaking story loosely; revisit them when fuller reports arrive.",
"needs": {
"code": "covered",
"note": "applied: hosts keep several working hypotheses (Chamberlin rule)"
}
},
{
"id": "wegner",
"name": "Daniel Wegner",
"name_ru": "Дэниел Вегнер",
"years": "1948–2013",
"wiki": "https://en.wikipedia.org/wiki/Daniel_Wegner",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Incrimination through innuendo' (Wegner and others, 1981): a question or denial in a headline ('Is X guilty?') still leaves belief in X.",
"ru": "«Обвинение через намёк» (Вегнер и др., 1981): вопрос или отрицание в заголовке («Виновен ли X?») всё равно оставляет веру в X.",
"de": "„Incrimination through innuendo“ (1981)."
},
"rule": "Do not repeat a question headline as if the question itself were information.",
"needs": {
"code": "covered",
"note": "applied: the passport's question-headline line ('do not turn it into an answer')"
}
},
{
"id": "ross_l",
"name": "Lee Ross",
"name_ru": "Ли Росс",
"years": "1942–2021",
"wiki": "https://en.wikipedia.org/wiki/Lee_Ross",
"zone": "own_limits",
"idea": {
"en": "'Perseverance in self-perception and social perception' (Ross, Lepper and Hubbard, 1975): a belief survives the discrediting of the evidence it was built on.",
"ru": "«Стойкость самовосприятия и социального восприятия» (Росс, Леппер, Хаббард, 1975): убеждение переживает опровержение тех доказательств, на которых построено.",
"de": "Überzeugungs-Persistenz (1975)."
},
"rule": "When a story is corrected, say so plainly and drop the claim; do not keep the conclusion without its evidence.",
"needs": {
"code": "ready",
"note": "bridge 'a correction does not erase': for later-challenged stories, does the original keep being carried after the correction appeared (radar_life last_ts) — data in hand"
}
},
{
"id": "kunda",
"name": "Ziva Kunda",
"name_ru": "Зива Кунда",
"years": "1955–2004",
"wiki": "https://en.wikipedia.org/wiki/Ziva_Kunda",
"zone": "own_limits",
"idea": {
"en": "'The case for motivated reasoning' (1990): when a conclusion is wanted, supporting evidence is accepted easily and opposing evidence is checked harder.",
"ru": "«Аргументы в пользу мотивированного рассуждения» (1990): когда вывод желанен, доводы «за» принимаются легко, а «против» проверяются строже.",
"de": "„The case for motivated reasoning“ (1990)."
},
"rule": "Apply the same standard of proof to welcome and unwelcome news.",
"needs": {
"code": "covered",
"note": "applied: one standard of proof for all news (rule conflict: the cautious rule wins)"
}
},
{
"id": "milgram",
"name": "Stanley Milgram",
"name_ru": "Стэнли Милгрэм",
"years": "1933–1984",
"wiki": "https://en.wikipedia.org/wiki/Stanley_Milgram",
"zone": "look_alike",
"idea": {
"en": "'Note on the drawing power of crowds of different size' (Milgram, Bickman and Berkowitz, 1969): the more people look one way, the more join them.",
"ru": "«Заметка о притягательности толп разного размера» (Милгрэм, Бикман, Берковиц, 1969): чем больше людей смотрит в одну сторону, тем больше присоединяется.",
"de": "Anziehungskraft von Menschenmengen (1969)."
},
"rule": "The number of people or outlets repeating a story is not evidence that it is true.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor and the echo check: repetition is not confirmation",
"covered_by": "kasperson"
}
},
{
"id": "darley",
"name": "John M. Darley",
"name_ru": "Джон Дарли",
"years": "1938–2018",
"wiki": "https://en.wikipedia.org/wiki/John_M._Darley",
"zone": "side_effects",
"idea": {
"en": "'Bystander intervention in emergencies' (Darley and Latané, 1968): with many witnesses each feels less responsible.",
"ru": "«Вмешательство свидетелей в чрезвычайных ситуациях» (Дарли и Латане, 1968): при многих свидетелях каждый меньше чувствует ответственность.",
"de": "Zuschauereffekt (1968)."
},
"rule": "When a story counts witnesses, ask who counted them and from which source.",
"needs": {
"code": "covered",
"note": "applied: few-voices line — a striking count from one outlet stays unconfirmed"
}
},
{
"id": "moscovici",
"name": "Serge Moscovici",
"name_ru": "Серж Московичи",
"years": "1925–2014",
"wiki": "https://en.wikipedia.org/wiki/Serge_Moscovici",
"zone": "one_model",
"idea": {
"en": "'The group as a polarizer of attitudes' (Moscovici and Zavalloni, 1969): discussion in a group shifts the shared view towards the extreme.",
"ru": "«Группа как поляризатор установок» (Московичи и Заваллони, 1969): обсуждение в группе сдвигает общее мнение к краю.",
"de": "Gruppenpolarisierung (1969)."
},
"rule": "In a panel discussion, check whether the shared view moved further than the evidence did.",
"needs": {
"code": "needs_idea",
"note": "bridge 'the panel drifts to the edge' (Moscovici + Asch + round table): does the AI round table end further than its sources"
}
},
{
"id": "allport_f",
"name": "Floyd Henry Allport",
"name_ru": "Флойд Олпорт",
"years": "1890–1979",
"wiki": "https://en.wikipedia.org/wiki/Floyd_Henry_Allport",
"zone": "look_alike",
"idea": {
"en": "Pluralistic ignorance ('Students' Attitudes', Katz and Allport, 1931): people wrongly believe that most others think differently from them.",
"ru": "Плюралистическое невежество («Установки студентов», Кац и Олпорт, 1931): люди ошибочно считают, что большинство думает иначе, чем они.",
"de": "Pluralistische Ignoranz (1931)."
},
"rule": "Do not say what 'most people think' without a survey that measured it.",
"needs": {
"code": "needs_idea",
"note": "bridge 'what most people think' (F. Allport + Lee Ross): flag 'most people think' claims without a survey"
}
},
{
"id": "white_dm",
"name": "David Manning White",
"name_ru": "Дэвид Мэннинг Уайт",
"years": "1917–1993",
"wiki": "https://en.wikipedia.org/wiki/David_Manning_White",
"zone": "stale_data",
"idea": {
"en": "'The \"Gate Keeper\": A Case Study in the Selection of News' (1950): one wire editor's choices decided which stories readers ever saw.",
"ru": "«„Привратник“: изучение отбора новостей» (1950): выбор одного редактора ленты решал, какие истории читатели вообще увидят.",
"de": "„The Gate Keeper“ (1950)."
},
"rule": "Say which sources and filters chose the stories you show; what was left out is part of the picture.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor shows which feeds and regions chose the stories",
"covered_by": "lyberg"
}
},
{
"id": "galtung",
"name": "Johan Galtung",
"name_ru": "Йохан Галтунг",
"years": "1930–2024",
"wiki": "https://en.wikipedia.org/wiki/Johan_Galtung",
"zone": "stale_data",
"idea": {
"en": "'The Structure of Foreign News' (Galtung and Ruge, 1965): the more negative, unexpected and close to elite nations and people an event is, the likelier it becomes news.",
"ru": "«Структура зарубежных новостей» (Галтунг и Руге, 1965): чем событие негативнее, неожиданнее и ближе к «элитным» странам и людям, тем вероятнее оно станет новостью.",
"de": "„The Structure of Foreign News“ (1965)."
},
"rule": "The radars show what passed the news filter, not a sample of the world; say what kind of event the filter leaves out.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor shows which regions and feeds the radars hear and which stay silent",
"covered_by": "lyberg"
}
},
{
"id": "gans",
"name": "Herbert J. Gans",
"name_ru": "Герберт Ганс",
"years": "1927–2025",
"wiki": "https://en.wikipedia.org/wiki/Herbert_J._Gans",
"zone": "stale_data",
"idea": {
"en": "'Deciding What's News' (1979): what reaches the news is what known, authoritative sources supply within newsroom routine, not everything that matters.",
"ru": "«Как решают, что считать новостью» (1979): в новости попадает то, что дают знакомые авторитетные источники в рамках рутины редакции, а не всё важное.",
"de": "„Deciding What's News“ (1979)."
},
"rule": "Ask whose sources the story rests on; an official source makes a story easy to get, not necessarily true.",
"needs": {
"code": "covered",
"note": "applied: the first-source and state-media lines name who supplied the story"
}
},
{
"id": "luhmann",
"name": "Niklas Luhmann",
"name_ru": "Никлас Луман",
"years": "1927–1998",
"wiki": "https://en.wikipedia.org/wiki/Niklas_Luhmann",
"zone": "one_model",
"idea": {
"en": "'Die Realität der Massenmedien' (1996): mass media select by their own selectors — novelty, conflict, numbers, locality, norm violation.",
"ru": "«Реальность массмедиа» (1996): СМИ отбирают по своим селекторам — новизна, конфликт, числа, близость, нарушение норм.",
"de": "„Die Realität der Massenmedien“ (1996)."
},
"rule": "Treat a news item as the result of selection; ask which selector picked it.",
"needs": {
"code": "covered",
"note": "the Lyberg sensor and the first-source line show selection",
"covered_by": "lyberg"
}
},
{
"id": "mccombs",
"name": "Maxwell McCombs",
"name_ru": "Максвелл Маккомбс",
"years": "1938–2024",
"wiki": "https://en.wikipedia.org/wiki/Maxwell_McCombs",
"zone": "look_alike",
"idea": {
"en": "'The Agenda-Setting Function of Mass Media' (McCombs and Shaw, 1972): what media cover more often and more prominently, audiences rank as most important.",
"ru": "«Функция установления повестки дня» (Маккомбс и Шоу, 1972): то, что СМИ подают чаще и крупнее, аудитория считает самым важным.",
"de": "„The Agenda-Setting Function of Mass Media“ (1972)."
},
"rule": "Do not take the volume of coverage as a measure of importance.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor: retellings are not confirmation",
"covered_by": "kasperson"
}
},
{
"id": "gitlin",
"name": "Todd Gitlin",
"name_ru": "Тодд Гитлин",
"years": "1943–2022",
"wiki": "https://en.wikipedia.org/wiki/Todd_Gitlin",
"zone": "one_model",
"idea": {
"en": "'The Whole World Is Watching' (1980): once chosen, a media frame is reproduced and decides what counts as the main point.",
"ru": "«Весь мир смотрит» (1980): однажды выбранная рамка воспроизводится и решает, что считать главным.",
"de": "„The Whole World Is Watching“ (1980)."
},
"rule": "Notice the frame a story arrives in and ask what another frame would make the main point.",
"needs": {
"code": "covered",
"note": "applied: hosts keep several working hypotheses (Chamberlin rule)"
}
},
{
"id": "lang_k",
"name": "Kurt Lang and Gladys Engel Lang",
"name_ru": "Курт и Глэдис Ланг",
"years": "1924–2019",
"wiki": "https://en.wikipedia.org/wiki/Kurt_Lang_and_Gladys_Engel_Lang",
"zone": "look_alike",
"idea": {
"en": "'The Unique Perspective of Television and Its Effect' (1953): observers on the street saw a calm crowd while the broadcast showed constant enthusiasm — coverage is an assembly, not the event.",
"ru": "«Особая перспектива телевидения и её влияние» (1953): наблюдатели на улице видели спокойную толпу, а эфир показывал сплошной восторг — репортаж это монтаж, а не само событие.",
"de": "„The Unique Perspective of Television“ (1953)."
},
"rule": "Separate what the coverage shows from what witnesses on the spot report.",
"needs": {
"code": "covered",
"note": "applied: passport line 'looks ≠ is' (metaphor, loaded words)"
}
},
{
"id": "cohen_s",
"name": "Stanley Cohen",
"name_ru": "Стэнли Коэн",
"years": "1942–2013",
"wiki": "https://en.wikipedia.org/wiki/Stanley_Cohen_(sociologist)",
"zone": "side_effects",
"idea": {
"en": "'Folk Devils and Moral Panics' (1972): a small incident, amplified by stereotyped coverage, becomes a 'threat to society'.",
"ru": "«Народные дьяволы и моральные паники» (1972): небольшой инцидент, раздутый стереотипной подачей, превращается в «угрозу обществу».",
"de": "„Folk Devils and Moral Panics“ (1972)."
},
"rule": "Compare the size of the incident with the size of the alarm; report the incident, not the panic.",
"needs": {
"code": "needs_idea",
"note": "bridge 'size of the incident vs size of the alarm' (S. Cohen + Kasperson + tone): a loaded headline about a small count — needs a way to read the size of the incident"
}
},
{
"id": "gamson",
"name": "William A. Gamson",
"name_ru": "Уильям Гэмсон",
"years": "1934–2021",
"wiki": "https://en.wikipedia.org/wiki/William_A._Gamson",
"zone": "one_model",
"idea": {
"en": "'Media Discourse and Public Opinion on Nuclear Power' (Gamson and Modigliani, 1989): one event is told through competing frames.",
"ru": "«Медийный дискурс и мнение о ядерной энергетике» (Гэмсон и Модильяни, 1989): одно событие подают через конкурирующие рамки.",
"de": "Medien-Frames (1989)."
},
"rule": "Name the competing frames of a story instead of adopting the first one.",
"needs": {
"code": "covered",
"note": "applied: hosts name competing readings (Chamberlin rule)"
}
},
{
"id": "boorstin",
"name": "Daniel J. Boorstin",
"name_ru": "Дэниел Бурстин",
"years": "1914–2004",
"wiki": "https://en.wikipedia.org/wiki/Daniel_J._Boorstin",
"zone": "rumour_vs_fact",
"idea": {
"en": "'The Image' (1961), pseudo-events: many 'events' are staged in order to be reported.",
"ru": "«Образ» (1961), псевдособытия: многие «события» устроены ради того, чтобы о них написали.",
"de": "„The Image“ (1961), Pseudo-Ereignisse."
},
"rule": "Ask who organised an event and why; a staged event is still worth reporting as staged.",
"needs": {
"code": "needs_idea",
"note": "bridge 'staged for the cameras' (Boorstin + Searle): flag announced photo-ops, launches and ceremonies as pseudo-events"
}
},
{
"id": "epstein_ej",
"name": "Edward Jay Epstein",
"name_ru": "Эдвард Джей Эпстайн",
"years": "1935–2024",
"wiki": "https://en.wikipedia.org/wiki/Edward_Jay_Epstein",
"zone": "side_effects",
"idea": {
"en": "'News from Nowhere' (1973): television news is shaped by budgets, crew logistics and a pre-set story line, not only by the event.",
"ru": "«Новости из ниоткуда» (1973): телевизионную новость формируют бюджет, логистика съёмочных групп и заранее заданная «история», а не только событие.",
"de": "„News from Nowhere“ (1973)."
},
"rule": "Where only one crew or outlet was present, say that the picture depends on where they could be.",
"needs": {
"code": "covered",
"note": "applied: few-voices line — one crew, one picture"
}
},
{
"id": "rosten",
"name": "Leo Rosten",
"name_ru": "Лео Ростен",
"years": "1908–1997",
"wiki": "https://en.wikipedia.org/wiki/Leo_Rosten",
"zone": "rumour_vs_fact",
"idea": {
"en": "'The Washington Correspondents' (1937): capital news depends heavily on official sources and the outlet's own stance.",
"ru": "«Вашингтонские корреспонденты» (1937): столичная новость сильно зависит от чиновников-источников и позиции своей редакции.",
"de": "„The Washington Correspondents“ (1937)."
},
"rule": "Name the official source behind a capital story and look for a non-official one.",
"needs": {
"code": "covered",
"note": "applied: first-source and state-media lines"
}
},
{
"id": "merton",
"name": "Robert K. Merton",
"name_ru": "Роберт Мертон",
"years": "1910–2003",
"wiki": "https://en.wikipedia.org/wiki/Robert_K._Merton",
"zone": "look_alike",
"idea": {
"en": "'Mass Communication, Popular Taste and Organized Social Action' (Lazarsfeld and Merton, 1948): media coverage itself confers status — being covered makes something look important.",
"ru": "«Массовая коммуникация, вкусы и организованное действие» (Лазарсфельд и Мертон, 1948): само освещение придаёт статус — то, о чём пишут, кажется важным.",
"de": "Statuszuweisung durch Medien (1948)."
},
"rule": "Coverage is not proof of significance; say what makes the story matter apart from being covered.",
"needs": {
"code": "covered",
"note": "the Kasperson sensor: coverage is not proof",
"covered_by": "kasperson"
}
},
{
"id": "lazarsfeld",
"name": "Paul Lazarsfeld",
"name_ru": "Пол Лазарсфельд",
"years": "1901–1976",
"wiki": "https://en.wikipedia.org/wiki/Paul_Lazarsfeld",
"zone": "one_model",
"idea": {
"en": "'The People's Choice' (Lazarsfeld, Berelson and Gaudet, 1944): campaigns mostly reinforce existing views; influence flows through opinion leaders.",
"ru": "«Выбор народа» (Лазарсфельд, Берелсон, Годе, 1944): кампании чаще укрепляют сложившиеся взгляды; влияние идёт через лидеров мнений.",
"de": "„The People's Choice“ (1944)."
},
"rule": "Do not assume a headline changes minds; say who repeats it and to whom.",
"needs": {
"code": "covered",
"note": "the first-source line and the Kasperson sensor",
"covered_by": "kasperson"
}
},
{
"id": "katz_e",
"name": "Elihu Katz",
"name_ru": "Элиху Кац",
"years": "1926–2021",
"wiki": "https://en.wikipedia.org/wiki/Elihu_Katz",
"zone": "side_effects",
"idea": {
"en": "'Personal Influence' (Katz and Lazarsfeld, 1955): messages reach people through personal opinion leaders, not only directly.",
"ru": "«Личное влияние» (Кац и Лазарсфельд, 1955): сообщение доходит до людей через знакомых лидеров мнений, а не только напрямую.",
"de": "„Personal Influence“ (1955)."
},
"rule": "A story's reach includes retellings by trusted people; track the first source, not the loudest relay.",
"needs": {
"code": "covered",
"note": "the first-source line and the Kasperson sensor",
"covered_by": "kasperson"
}
},
{
"id": "berelson",
"name": "Bernard Berelson",
"name_ru": "Бернард Берелсон",
"years": "1912–1979",
"wiki": "https://en.wikipedia.org/wiki/Bernard_Berelson",
"zone": "own_limits",
"idea": {
"en": "'What \"Missing the Newspaper\" Means' (1949): people read papers partly out of ritual — reading is not the same as learning.",
"ru": "«Что значит „скучать по газете“» (1949): газету читают и по привычке, как ритуал — прочитать ещё не значит узнать.",
"de": "„What Missing the Newspaper Means“ (1949)."
},
"rule": "Do not assume the audience took in the facts because it saw the headline; repeat the key fact plainly.",
"needs": {
"code": "covered",
"note": "applied: hosts repeat the key fact plainly"
}
},
{
"id": "gerbner",
"name": "George Gerbner",
"name_ru": "Джордж Гербнер",
"years": "1919–2005",
"wiki": "https://en.wikipedia.org/wiki/George_Gerbner",
"zone": "measurement_error",
"idea": {
"en": "'Living with Television: The Violence Profile' (Gerbner and Gross, 1976): heavy viewers see the world as more dangerous than statistics show.",
"ru": "«Жизнь с телевидением: профиль насилия» (Гербнер и Гросс, 1976): кто много смотрит, видит мир опаснее, чем по статистике.",
"de": "„Living with Television“ (1976)."
},
"rule": "Check the feeling of danger a news stream creates against base-rate statistics.",
"needs": {
"code": "needs_idea",
"note": "bridge 'the stream feels more dangerous' (Gerbner + Pareto + base rates): compare radar alarm levels with base-rate statistics"
}
},
{
"id": "greenberg_b",
"name": "Bradley S. Greenberg",
"name_ru": "Брэдли Гринберг",
"years": "1934–2018",
"wiki": "https://en.wikipedia.org/wiki/Bradley_S._Greenberg",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Person-to-Person Communication in the Diffusion of News Events' (1964): for the biggest stories many people first hear from others, with distortions.",
"ru": "«Межличностная передача в распространении новостей» (1964): о самых громких событиях многие узнают сначала от людей, с искажениями.",
"de": "Nachrichtendiffusion (1964)."
},
"rule": "For a big breaking story, expect early retellings to be distorted; anchor on the first written report.",
"needs": {
"code": "covered",
"note": "the first-source line anchors on the first written report"
}
},
{
"id": "huff",
"name": "Darrell Huff",
"name_ru": "Даррелл Хафф",
"years": "1913–2001",
"wiki": "https://en.wikipedia.org/wiki/Darrell_Huff",
"zone": "measurement_error",
"idea": {
"en": "'How to Lie with Statistics' (1954): a sample with built-in bias gives a confident but wrong figure.",
"ru": "«Как лгать при помощи статистики» (1954): выборка со встроенным смещением даёт уверенную, но неверную цифру.",
"de": "„How to Lie with Statistics“ (1954)."
},
"rule": "Before repeating a poll figure, ask who was sampled and how.",
"needs": {
"code": "covered",
"note": "applied: passport poll line (who was asked, how many, margin of error)"
}
},
{
"id": "meyer_p",
"name": "Philip Meyer",
"name_ru": "Филип Мейер",
"years": "1930–2023",
"wiki": "https://en.wikipedia.org/wiki/Philip_Meyer",
"zone": "measurement_error",
"idea": {
"en": "'Precision Journalism' (1973): a number in the news must be checked by its method — when, how and whom, and with what margin of error.",
"ru": "«Точная журналистика» (1973): цифру в новости проверяют методом — когда, как и кого опрашивали, какова погрешность.",
"de": "„Precision Journalism“ (1973)."
},
"rule": "Report a survey figure together with its method and margin of error.",
"needs": {
"code": "covered",
"note": "applied: passport poll line (method and margin of error)"
}
},
{
"id": "macdougall",
"name": "Curtis D. MacDougall",
"name_ru": "Кёртис Макдугалл",
"years": "1903–1985",
"wiki": "https://en.wikipedia.org/wiki/Curtis_D._MacDougall",
"zone": "own_limits",
"idea": {
"en": "'Hoaxes' (1940): the press confidently prints falsehoods and seldom corrects them loudly.",
"ru": "«Мистификации» (1940): пресса уверенно печатает ложное и редко громко исправляет.",
"de": "„Hoaxes“ (1940)."
},
"rule": "Look for whether a correction was published, and give it the same prominence as the claim.",
"needs": {
"code": "covered",
"note": "the Harman sensor looks for corrections after 72 hours",
"covered_by": "harman"
}
},
{
"id": "osborn",
"name": "Albert S. Osborn",
"name_ru": "Альберт Осборн",
"years": "1855–1946",
"wiki": "https://en.wikipedia.org/wiki/Albert_S._Osborn",
"zone": "measurement_error",
"idea": {
"en": "'Questioned Documents' (1910): disputed handwriting is compared with enough known genuine samples, allowing for their natural variation — one similar sample is not enough.",
"ru": "«Спорные документы» (1910): спорный почерк сравнивают с достаточным числом заведомо подлинных образцов с учётом их изменчивости — одного похожего мало.",
"de": "„Questioned Documents“ (1910)."
},
"rule": "Check a quote against several verified statements of the source, not against one that sounds similar.",
"needs": {
"code": "covered",
"note": "applied: quote-out-of-context line asks whose words and where they are from"
}
},
{
"id": "mccrone",
"name": "Walter McCrone",
"name_ru": "Уолтер Маккроун",
"years": "1916–2002",
"wiki": "https://en.wikipedia.org/wiki/Walter_McCrone",
"zone": "stale_data",
"idea": {
"en": "Analysis of the Vinland Map for Yale (1974): the ink contained anatase, a pigment made only from the 1920s — material that could not exist at the claimed date.",
"ru": "Анализ «Карты Винланда» для Йеля (1974): в чернилах нашёлся анатаз, пигмент 1920-х годов, — материал, которого не могло быть на заявленную дату.",
"de": "Analyse der Vinland-Karte (1974)."
},
"rule": "Ask whether every detail of a found document — material, term, format — was possible at its claimed date.",
"needs": {
"code": "covered",
"note": "applied: found-document line (date, wording, origin); passport now flags dated artefacts such as '1440 map'"
}
},
{
"id": "langlois",
"name": "Charles-Victor Langlois and Charles Seignobos",
"name_ru": "Шарль-Виктор Ланглуа и Шарль Сеньобос",
"years": "1863–1929",
"wiki": "https://en.wikipedia.org/wiki/Charles-Victor_Langlois",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Introduction aux études historiques' (1898): first external criticism — who made the document, when and where it came from — then criticism of its content.",
"ru": "«Введение в изучение истории» (1898): сначала внешняя критика — кто, когда и откуда, — потом критика содержания.",
"de": "„Introduction aux études historiques“ (1898)."
},
"rule": "Before retelling a 'find', establish where the document came from and the chain it passed through.",
"needs": {
"code": "covered",
"note": "applied: found-document and first-source lines"
}
},
{
"id": "bernheim",
"name": "Ernst Bernheim",
"name_ru": "Эрнст Бернгейм",
"years": "1850–1942",
"wiki": "https://en.wikipedia.org/wiki/Ernst_Bernheim",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Lehrbuch der historischen Methode' (1889): remains of an event (documents, objects) are distinguished from traditions about it (retellings); a retelling is weaker evidence.",
"ru": "«Учебник исторического метода» (1889): остатки события (документы, вещи) отличают от преданий о нём (пересказов); пересказ — более слабое свидетельство.",
"de": "„Lehrbuch der historischen Methode“ (1889)."
},
"rule": "'According to someone' is weaker than 'according to the document'; say which one the story rests on.",
"needs": {
"code": "covered",
"note": "applied: 'according to' and 'reportedly' read as claims (Searle)"
}
},
{
"id": "bloch",
"name": "Marc Bloch",
"name_ru": "Марк Блок",
"years": "1886–1944",
"wiki": "https://en.wikipedia.org/wiki/Marc_Bloch",
"zone": "rumour_vs_fact",
"idea": {
"en": "'The Historian's Craft' (published 1949): the most reliable witnesses are 'witnesses in spite of themselves' — sources that did not set out to tell anything.",
"ru": "«Ремесло историка» (издано в 1949): надёжнее всего «свидетели поневоле» — источники, которые не собирались ничего сообщать.",
"de": "„Apologie pour l'histoire“ (1949)."
},
"rule": "Give more weight to incidental traces — data, timetables, logs — than to statements made for effect.",
"needs": {
"code": "needs_idea",
"note": "bridge 'witnesses in spite of themselves' (Bloch + Wikipedia attention + volatility): incidental data traces as a check on statements"
}
},
{
"id": "nida",
"name": "Eugene Nida",
"name_ru": "Юджин Найда",
"years": "1914–2011",
"wiki": "https://en.wikipedia.org/wiki/Eugene_Nida",
"zone": "look_alike",
"idea": {
"en": "'Toward a Science of Translating' (1964): word-for-word correspondence can shift the meaning; translate the meaning.",
"ru": "«К науке о переводе» (1964): дословное соответствие может сдвинуть смысл; переводить нужно смысл.",
"de": "„Toward a Science of Translating“ (1964)."
},
"rule": "In a translated story, check what the original term meant in the source language.",
"needs": {
"code": "covered",
"note": "applied: passport translation line (quote the original, compare language versions)"
}
},
{
"id": "reiss",
"name": "Katharina Reiss",
"name_ru": "Катарина Райс",
"years": "1923–2018",
"wiki": "https://en.wikipedia.org/wiki/Katharina_Reiss",
"zone": "look_alike",
"idea": {
"en": "'Möglichkeiten und Grenzen der Übersetzungskritik' (1971): a translation can only be judged against the original, allowing for the type and purpose of the text.",
"ru": "«Возможности и границы критики перевода» (1971): перевод оценивают только сравнением с оригиналом, с учётом типа и цели текста.",
"de": "„Möglichkeiten und Grenzen der Übersetzungskritik“ (1971)."
},
"rule": "When language versions of a story differ, find the original and compare.",
"needs": {
"code": "covered",
"note": "applied: /api/v1/reiss and get_reiss compare the English, German and Russian headlines of one story (speech act, numbers, loaded words)"
}
},
{
"id": "newmark",
"name": "Peter Newmark",
"name_ru": "Питер Ньюмарк",
"years": "1916–2011",
"wiki": "https://en.wikipedia.org/wiki/Peter_Newmark",
"zone": "look_alike",
"idea": {
"en": "'Approaches to Translation' (1981): semantic translation stays with the original, communicative translation with the reader.",
"ru": "«Подходы к переводу» (1981): семантический перевод держится оригинала, коммуникативный — читателя.",
"de": "„Approaches to Translation“ (1981)."
},
"rule": "A close quote and a reader-friendly paraphrase are different things; the second is already an interpretation.",
"needs": {
"code": "covered",
"note": "applied: passport translation line"
}
},
{
"id": "chukovsky",
"name": "Korney Chukovsky",
"name_ru": "Корней Чуковский",
"years": "1882–1969",
"wiki": "https://en.wikipedia.org/wiki/Korney_Chukovsky",
"zone": "look_alike",
"idea": {
"en": "'Высокое искусство' (1941; 'Принципы художественного перевода', 1919): literalism distorts meaning, and translators write their own style into the text.",
"ru": "«Высокое искусство» (1941; «Принципы художественного перевода», 1919): буквализм искажает смысл, а переводчик вписывает в текст свой стиль.",
"de": "„Hohe Kunst“ (1941)."
},
"rule": "Compare the tone and evaluative words of a translation with the original.",
"needs": {
"code": "covered",
"note": "applied: loaded-word line in three languages (tone)"
}
},
{
"id": "montgomery_rh",
"name": "Robert H. Montgomery",
"name_ru": "Роберт Монтгомери",
"years": "1872–1953",
"wiki": "https://en.wikipedia.org/wiki/Robert_Hiester_Montgomery",
"zone": "measurement_error",
"idea": {
"en": "'Auditing Theory and Practice' (1912): assets are verified independently, not only from the company's own papers.",
"ru": "«Теория и практика аудита» (1912): активы проверяют независимо, а не только по бумагам компании.",
"de": "„Auditing Theory and Practice“ (1912)."
},
"rule": "Confirm a figure a company gives about itself with an independent source.",
"needs": {
"code": "covered",
"note": "applied: company self-claims ('declared sound') read as claims"
}
},
{
"id": "ripley",
"name": "William Z. Ripley",
"name_ru": "Уильям Рипли",
"years": "1867–1941",
"wiki": "https://en.wikipedia.org/wiki/William_Z._Ripley",
"zone": "measurement_error",
"idea": {
"en": "'Main Street and Wall Street' (1927): holding structures without full audited accounts hide the real position.",
"ru": "«Мейн-стрит и Уолл-стрит» (1927): холдинговые схемы без полной проверенной отчётности скрывают настоящее положение.",
"de": "„Main Street and Wall Street“ (1927)."
},
"rule": "'Sound' without published audited accounts is a claim, not a fact.",
"needs": {
"code": "covered",
"note": "applied: 'declared sound / solvent' read as a claim, not a fact"
}
},
{
"id": "briloff",
"name": "Abraham J. Briloff",
"name_ru": "Абрахам Брилофф",
"years": "1917–2013",
"wiki": "https://en.wikipedia.org/wiki/Abraham_J._Briloff",
"zone": "measurement_error",
"idea": {
"en": "'Unaccountable Accounting' (1972): profit can be 'drawn' by lawful choices of accounting methods.",
"ru": "«Неподотчётный учёт» (1972): прибыль можно «нарисовать» законным выбором учётных приёмов.",
"de": "„Unaccountable Accounting“ (1972)."
},
"rule": "In 'record profit' news, look for the accounting standard and one-off items.",
"needs": {
"code": "covered",
"note": "applied: extraordinary-claim line (record profit + few outlets)"
}
},
{
"id": "gilbert_gk",
"name": "Grove Karl Gilbert",
"name_ru": "Гроув Карл Гилберт",
"years": "1843–1918",
"wiki": "https://en.wikipedia.org/wiki/Grove_Karl_Gilbert",
"zone": "answer_cost",
"idea": {
"en": "'Finley's Tornado Predictions' (1884): a forecaster who always says 'no tornado' scores a high hit rate; skill must be measured against chance.",
"ru": "«Прогнозы торнадо Финли» (1884): прогноз «торнадо не будет» всегда даёт высокий процент попаданий; мастерство надо мерить с поправкой на случайность.",
"de": "„Finley's Tornado Predictions“ (1884)."
},
"rule": "Judge a forecaster by skill above chance over the whole record, not by the share of hits.",
"needs": {
"code": "covered",
"note": "the Pearson sensor and Brier score judge forecasts by skill, not hit share",
"covered_by": "pearson"
}
},
{
"id": "brinton",
"name": "Willard C. Brinton",
"name_ru": "Уиллард Бринтон",
"years": "1880–1957",
"wiki": "https://en.wikipedia.org/wiki/Willard_C._Brinton",
"zone": "measurement_error",
"idea": {
"en": "'Graphic Methods for Presenting Facts' (1914): a scale starts at zero; comparing areas instead of lengths exaggerates differences.",
"ru": "«Графические методы представления фактов» (1914): шкала начинается с нуля; сравнение площадями вместо длин преувеличивает разницу.",
"de": "„Graphic Methods for Presenting Facts“ (1914)."
},
"rule": "Check where the zero is on a chart and whether areas stand in for lengths.",
"needs": {
"code": "covered",
"note": "the Baird sensor checks scale and units",
"covered_by": "baird"
}
},
{
"id": "bertin",
"name": "Jacques Bertin",
"name_ru": "Жак Бертен",
"years": "1918–2010",
"wiki": "https://en.wikipedia.org/wiki/Jacques_Bertin",
"zone": "measurement_error",
"idea": {
"en": "'Sémiologie graphique' (1967): size is for quantity, hue for difference in kind — not for 'more or less'.",
"ru": "«Графическая семиология» (1967): размер — для количества, оттенок цвета — для различия по роду, а не для «больше-меньше».",
"de": "„Sémiologie graphique“ (1967)."
},
"rule": "If a map uses hue to mean 'more or less', ask for the numbers.",
"needs": {
"code": "covered",
"note": "the Baird sensor checks scale and units",
"covered_by": "baird"
}
},
{
"id": "turner_ba",
"name": "Barry A. Turner",
"name_ru": "Барри Тёрнер",
"years": "1937–1995",
"wiki": "https://en.wikipedia.org/wiki/Barry_Turner_(sociologist)",
"zone": "side_effects",
"idea": {
"en": "'Man-made Disasters' (1978): a disaster has an incubation period — small signals that contradict the accepted picture pile up unnoticed for months or years.",
"ru": "«Рукотворные катастрофы» (1978): у катастрофы есть инкубационный период — мелкие сигналы, противоречащие привычной картине, месяцами и годами копятся незамеченными.",
"de": "„Man-made Disasters“ (1978): Katastrophen haben eine Inkubationszeit unbemerkter Warnsignale."
},
"rule": "A 'sudden' crisis usually had earlier signals; look for them before calling it sudden.",
"needs": {
"code": "needs_idea",
"note": "incubation: look back in radar_life for earlier headlines that hinted at a later crisis"
}
},
{
"id": "rasmussen_j",
"name": "Jens Rasmussen",
"name_ru": "Йенс Расмуссен",
"years": "1926–2018",
"wiki": "https://en.wikipedia.org/wiki/Jens_Rasmussen_(human_factors_expert)",
"zone": "side_effects",
"idea": {
"en": "'Risk management in a dynamic society' (1997): pressure for efficiency and less effort makes a system drift, step by step, toward the edge of safe operation.",
"ru": "«Управление риском в динамичном обществе» (1997): давление экономии и меньших усилий шаг за шагом сдвигает систему к границе безопасной работы.",
"de": "„Risk management in a dynamic society“ (1997): Effizienzdruck lässt Systeme schrittweise an die Sicherheitsgrenze driften."
},
"rule": "A long calm under cost pressure is not proof of safety; ask how close to the edge the system has drifted.",
"needs": {
"code": "covered",
"note": "the Pareto sensor and radar noise show that long calm does not exclude big jumps",
"covered_by": "pareto"
}
},
{
"id": "wildavsky",
"name": "Aaron Wildavsky",
"name_ru": "Аарон Уилдавски",
"years": "1930–1993",
"wiki": "https://en.wikipedia.org/wiki/Aaron_Wildavsky",
"zone": "side_effects",
"idea": {
"en": "'Searching for Safety' (1988): safety comes both from anticipation and from resilience; removing every small failure can weaken the ability to cope with a large one.",
"ru": "«В поисках безопасности» (1988): безопасность даёт и предупреждение, и устойчивость; устранив все мелкие сбои, можно ослабить способность справиться с крупным.",
"de": "„Searching for Safety“ (1988): Vorbeugung und Widerstandskraft; wer jeden kleinen Fehler ausschließt, schwächt die Anpassung."
},
"rule": "When a measure promises to remove a risk entirely, ask what it does to the system's ability to recover.",
"needs": {
"code": "needs_idea",
"note": "resilience vs anticipation: host rule candidate"
}
},
{
"id": "starr_c",
"name": "Chauncey Starr",
"name_ru": "Чонси Старр",
"years": "1912–2007",
"wiki": "https://en.wikipedia.org/wiki/Chauncey_Starr",
"zone": "answer_cost",
"idea": {
"en": "'Social Benefit versus Technological Risk' (Science, 1969): people accept far higher risks they choose themselves than risks imposed on them, at similar benefit.",
"ru": "«Общественная польза против технологического риска» (Science, 1969): риск, выбранный самим человеком, люди принимают в разы охотнее, чем навязанный, при сопоставимой пользе.",
"de": "„Social Benefit versus Technological Risk“ (1969): Freiwillige Risiken werden weit eher akzeptiert als auferlegte."
},
"rule": "Compare risks per hour of exposure, and say whether a risk is chosen or imposed — the public reaction depends on it.",
"needs": {
"code": "needs_idea",
"note": "chosen vs imposed risk: could split the Kasperson amplification by risk type"
}
},
{
"id": "siebert_h",
"name": "Horst Siebert",
"name_ru": "Хорст Зиберт",
"years": "1938–2009",
"wiki": "https://de.wikipedia.org/wiki/Horst_Siebert",
"zone": "side_effects",
"idea": {
"en": "'Der Kobra-Effekt' (2001): an incentive or ban designed without regard to how people respond invites them to game the rule and can worsen the original problem.",
"ru": "«Эффект кобры» (2001): стимул или запрет, придуманный без учёта того, как ответят люди, побуждает обыгрывать само правило и может усугубить исходную проблему.",
"de": "„Der Kobra-Effekt“ (2001): Anreize ohne Blick auf das Verhalten verschlimmern das Problem."
},
"rule": "When a reward or ban is announced, ask how people can game it before reporting the intended effect.",
"needs": {
"code": "covered",
"note": "applied: host rule — when a reward, subsidy, quota, ban or target is announced, ask how it can be gamed before the intended effect"
}
},
{
"id": "adams_j",
"name": "John Adams",
"name_ru": "Джон Адамс",
"years": "1938–2024",
"wiki": "https://en.wikipedia.org/wiki/John_Adams_(geographer)",
"zone": "side_effects",
"idea": {
"en": "'Risk' (1995), the risk thermostat: people adjust their behaviour to the risk they feel, so a safety measure can be partly used up by riskier behaviour.",
"ru": "«Риск» (1995), «термостат риска»: люди подстраивают поведение под ощущаемую опасность, и защитная мера может частично «съедаться» более рискованным поведением.",
"de": "„Risk“ (1995), Risiko-Thermostat: Schutzmaßnahmen werden teils durch riskanteres Verhalten aufgezehrt."
},
"rule": "An announced safety measure is not yet a result; wait for outcomes and ask how behaviour changed.",
"needs": {
"code": "covered",
"note": "applied: Searle reads 'announces measures/controls/bans' as a promise, not a result"
}
},
{
"id": "wilde_g",
"name": "Gerald J. S. Wilde",
"name_ru": "Джеральд Уайлд",
"years": "1932–2019",
"wiki": "https://en.wikipedia.org/wiki/Gerald_J._S._Wilde",
"zone": "side_effects",
"idea": {
"en": "Risk homeostasis ('Target Risk', 1994): people keep a target level of risk; better technology alone shifts behaviour rather than accident rates.",
"ru": "Гомеостаз риска («Целевой риск», 1994): люди держат свой целевой уровень риска; одна лишь лучшая техника меняет поведение, а не частоту аварий.",
"de": "Risikohomöostase („Target Risk“, 1994): Technik allein senkt die Unfallrate kaum."
},
"rule": "Judge a safety measure by outcomes per unit of exposure, not by its intention.",
"needs": {
"code": "covered",
"note": "applied: an announced measure is read as a promise, not an outcome"
}
},
{
"id": "kletz",
"name": "Trevor Kletz",
"name_ru": "Тревор Клетц",
"years": "1922–2013",
"wiki": "https://en.wikipedia.org/wiki/Trevor_Kletz",
"zone": "look_alike",
"idea": {
"en": "'What Went Wrong?' and 'Lessons from Disaster' (1993): organisations have no memory — when people leave, old accidents recur for the same reasons.",
"ru": "«Что пошло не так?» и «Уроки катастроф» (1993): у организаций нет памяти — когда люди уходят, старые аварии повторяются по тем же причинам.",
"de": "„Lessons from Disaster“ (1993): Organisationen haben kein Gedächtnis — alte Unfälle wiederholen sich."
},
"rule": "Before calling an accident new or unprecedented, look for the earlier one with the same cause.",
"needs": {
"code": "covered",
"note": "applied: extraordinary-claim and 'first by what definition?' lines"
}
},
{
"id": "white_gf",
"name": "Gilbert F. White",
"name_ru": "Гилберт Уайт",
"years": "1911–2006",
"wiki": "https://en.wikipedia.org/wiki/Gilbert_F._White",
"zone": "side_effects",
"idea": {
"en": "'Human Adjustment to Floods' (1945): levees give a sense of safety, building moves into the floodplain, and losses from the rarer big flood grow (the levee effect).",
"ru": "«Приспособление человека к наводнениям» (1945): дамбы дают чувство безопасности, застройка идёт в пойму, и ущерб от редкого большого паводка растёт («эффект дамбы»).",
"de": "„Human Adjustment to Floods“ (1945): Deiche locken Bebauung in die Aue — der seltene große Schaden wächst."
},
"rule": "Protection against frequent small losses can raise the rare large one; report both.",
"needs": {
"code": "covered",
"note": "applied: 'who else pays' rule names the losses outside the intended effect"
}
},
{
"id": "shewhart",
"name": "Walter A. Shewhart",
"name_ru": "Уолтер Шухарт",
"years": "1891–1967",
"wiki": "https://en.wikipedia.org/wiki/Walter_A._Shewhart",
"zone": "measurement_error",
"idea": {
"en": "'Economic Control of Quality of Manufactured Product' (1931), the control chart: tell the chance variation of a stable process from an assignable (special) cause.",
"ru": "«Экономический контроль качества продукции» (1931), контрольная карта: отличай случайный разброс стабильного процесса от особой причины.",
"de": "„Economic Control of Quality“ (1931): zufällige Streuung von besonderen Ursachen unterscheiden."
},
"rule": "A reading inside the usual band is not yet a signal; name the band before calling a change.",
"needs": {
"code": "covered",
"note": "radar_noise in the track record names the usual daily band of the crypto radar",
"covered_by": "trackrecord"
}
},
{
"id": "deming",
"name": "W. Edwards Deming",
"name_ru": "Уильям Эдвардс Деминг",
"years": "1900–1993",
"wiki": "https://en.wikipedia.org/wiki/W._Edwards_Deming",
"zone": "side_effects",
"idea": {
"en": "'The New Economics' (1993), the funnel experiment: adjusting a stable process after every deviation makes the spread larger, not smaller.",
"ru": "«Новая экономика» (1993), эксперимент с воронкой: если подкручивать стабильный процесс после каждого отклонения, разброс растёт, а не падает.",
"de": "„The New Economics“ (1993), Trichterexperiment: Nachjustieren nach jeder Abweichung vergrößert die Streuung."
},
"rule": "Do not change a threshold or a position after every single deviation; fix the rule in advance.",
"needs": {
"code": "covered",
"note": "applied: a radar jump counts only if it holds for 2 hours; alarm thresholds are fixed in advance"
}
},
{
"id": "juran",
"name": "Joseph M. Juran",
"name_ru": "Джозеф Джуран",
"years": "1904–2008",
"wiki": "https://en.wikipedia.org/wiki/Joseph_M._Juran",
"zone": "answer_cost",
"idea": {
"en": "'Quality Control Handbook' (1951): he applied the Pareto principle to quality — the vital few causes behind most of the defects.",
"ru": "«Справочник по контролю качества» (1951): применил принцип Парето к качеству — немногие важные причины дают большую часть брака.",
"de": "„Quality Control Handbook“ (1951): die „lebenswichtigen Wenigen“ verursachen die meisten Fehler."
},
"rule": "Spend checking effort on the few sources that cause most of the errors, not equally on all.",
"needs": {
"code": "covered",
"note": "the Pareto sensor shows the share of movement from the biggest jumps",
"covered_by": "pareto"
}
},
{
"id": "ishikawa",
"name": "Kaoru Ishikawa",
"name_ru": "Каору Исикава",
"years": "1915–1989",
"wiki": "https://en.wikipedia.org/wiki/Kaoru_Ishikawa",
"zone": "one_model",
"idea": {
"en": "'Guide to Quality Control' (1968), the cause-and-effect (fishbone) diagram: lay a symptom out across several classes of possible causes.",
"ru": "«Руководство по контролю качества» (1968), диаграмма «рыбья кость»: раскладывай симптом по нескольким классам возможных причин.",
"de": "„Guide to Quality Control“ (1968), Ursache-Wirkungs-Diagramm."
},
"rule": "Before naming the cause of a move, list several classes of causes and do not stop at the first plausible one.",
"needs": {
"code": "covered",
"note": "applied: several working hypotheses rule for the hosts"
}
},
{
"id": "taguchi",
"name": "Genichi Taguchi",
"name_ru": "Гэнити Тагути",
"years": "1924–2012",
"wiki": "https://en.wikipedia.org/wiki/Genichi_Taguchi",
"zone": "measurement_error",
"idea": {
"en": "'Introduction to Quality Engineering' (1986), the loss function: loss grows as soon as a value leaves its target, even inside the tolerance.",
"ru": "«Введение в инженерию качества» (1986), функция потерь: потери растут, как только значение уходит от цели, даже внутри допуска.",
"de": "„Introduction to Quality Engineering“ (1986), Verlustfunktion."
},
"rule": "'Within limits' is not 'on target'; say how far a reading sits from its usual level.",
"needs": {
"code": "covered",
"note": "applied: level_vs_30d shows where a radar sits in its own 30-day range"
}
},
{
"id": "shingo",
"name": "Shigeo Shingo",
"name_ru": "Сигео Синго",
"years": "1909–1990",
"wiki": "https://en.wikipedia.org/wiki/Shigeo_Shingo",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Zero Quality Control: Source Inspection and the Poka-yoke System' (1986): catch an error at the step where it arises; final inspection is not enough.",
"ru": "«Нулевой контроль качества: проверка у источника и система пока-ёкэ» (1986): ошибку ловят на шаге, где она возникает; финальной приёмки недостаточно.",
"de": "„Zero Quality Control“ (1986): Fehler an der Quelle abfangen, Endkontrolle reicht nicht."
},
"rule": "Check a claim at its first source, not at the last retelling.",
"needs": {
"code": "covered",
"note": "applied: first-source line of the news passport"
}
},
{
"id": "nelson_ls",
"name": "Lloyd S. Nelson",
"name_ru": "Ллойд Нельсон",
"years": "1922–2013",
"wiki": "https://en.wikipedia.org/wiki/Lloyd_S._Nelson",
"zone": "measurement_error",
"idea": {
"en": "'The Shewhart Control Chart — Tests for Special Causes' (Journal of Quality Technology, 1984): a long run on one side of the mean is a signal even when no point leaves the limits.",
"ru": "«Контрольная карта Шухарта — тесты на особые причины» (1984): длинная серия по одну сторону среднего — сигнал, даже если ни одна точка не вышла за границы.",
"de": "„Tests for Special Causes“ (1984): lange Serien auf einer Seite des Mittels sind ein Signal."
},
"rule": "A slow drift can hide inside the usual band; count how long a reading has stayed on one side of its mean.",
"needs": {
"code": "covered",
"note": "applied: run_vs_mean in /api/v1/radars — half-hours in a row on one side of the 30-day mean against past runs"
}
},
{
"id": "akao",
"name": "Yoji Akao",
"name_ru": "Ёдзи Акао",
"years": "1928–2016",
"wiki": "https://en.wikipedia.org/wiki/Yoji_Akao",
"zone": "side_effects",
"idea": {
"en": "Quality function deployment (with Shigeru Mizuno, 1978): first spell out what users need, then choose the measurable characteristic.",
"ru": "Развёртывание функции качества (с Сигэру Мидзуно, 1978): сначала разложи, что нужно пользователю, потом выбирай измеримую характеристику.",
"de": "Quality Function Deployment (1978): erst den Bedarf, dann die Messgröße."
},
"rule": "Do not let a convenient internal metric stand in for what people actually need.",
"needs": {
"code": "needs_history",
"note": "with the Campbell-law bridge: does a published metric drift from what it was meant to show",
"not_before": "2026-12-21"
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
