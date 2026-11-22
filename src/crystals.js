// СГЕНЕРИРОВАНО tools/crystals.py из tools/crystals_data.py — правьте данные там.
export const CRYSTAL_ZONES = ["stale_data", "one_model", "rumour_vs_fact", "measurement_error", "answer_cost"];
export const CRYSTAL_BUILT_ZONE = {"searle": "rumour_vs_fact", "duckworth": "stale_data", "trevisan": "answer_cost", "bertsekas": "answer_cost", "rabin": "measurement_error", "frankfurt": "rumour_vs_fact", "hamilton": "answer_cost", "mikrin": "stale_data", "polyak": "measurement_error", "park": "rumour_vs_fact", "kahneman": "measurement_error", "ziv": "stale_data", "cox": "stale_data", "halpern": "one_model", "howard": "answer_cost", "leamer": "one_model", "baird": "measurement_error", "lyberg": "measurement_error", "hagenauer": "measurement_error"};
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
"zone": "one_model",
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
"zone": "measurement_error",
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
"zone": "answer_cost",
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
"zone": "one_model",
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
    about: "Ideas of scientists who died in 2020-2026, crystallised into rules for AI agents. Facts from open sources (English Wikipedia; 2026 deaths checked against obituaries). The 'rule' is Orb Studio's interpretation, not the scientist's words.",
    similar: "Mental-models MCP servers (thinking-models, Clear Thought) give agents reasoning principles; here each principle is tied to a real person, their article and Orb Studio's live sensors.",
    page: origin + "/tools/crystals" };
}
