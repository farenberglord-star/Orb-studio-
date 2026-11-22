// СГЕНЕРИРОВАНО tools/crystals.py из tools/crystals_data.py — правьте данные там.
export const CRYSTAL_ZONES = ["stale_data", "one_model", "rumour_vs_fact", "measurement_error", "answer_cost"];
export const CRYSTAL_BUILT_ZONE = {"frankfurt": "rumour_vs_fact", "hamilton": "answer_cost", "mikrin": "stale_data", "polyak": "measurement_error", "park": "rumour_vs_fact", "kahneman": "measurement_error", "ziv": "stale_data", "cox": "stale_data", "halpern": "one_model", "howard": "answer_cost", "leamer": "one_model", "baird": "measurement_error", "lyberg": "measurement_error", "hagenauer": "measurement_error"};
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
"id": "rabin",
"name": "Michael O. Rabin",
"name_ru": "Михаэль Рабин",
"years": "1931–2026",
"wiki": "https://en.wikipedia.org/wiki/Michael_O._Rabin",
"zone": "answer_cost",
"idea": {
"en": "Computational complexity and randomised algorithms (Turing award 1976): randomness can make a hard check cheap.",
"ru": "Вычислительная сложность и вероятностные алгоритмы (премия Тьюринга 1976): случайность может сделать трудную проверку дешёвой.",
"de": "Komplexitätstheorie und randomisierte Algorithmen (Turing-Preis 1976)."
},
"rule": "A few random spot checks can tell a lot about a large set.",
"needs": {
"code": "ready",
"note": "random spot checks of the sensor numbers against their sources"
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
"id": "trevisan",
"name": "Luca Trevisan",
"name_ru": "Лука Тревизан",
"years": "1971–2024",
"wiki": "https://en.wikipedia.org/wiki/Luca_Trevisan",
"zone": "answer_cost",
"idea": {
"en": "Pseudorandomness and sublinear algorithms: getting an answer without reading all the data.",
"ru": "Псевдослучайность и сублинейные алгоритмы: ответ без просмотра всех данных.",
"de": "Pseudozufall und sublineare Algorithmen."
},
"rule": "A well-chosen sample can answer without reading everything; say that you sampled.",
"needs": {
"code": "ready",
"note": "the smallest sample of headlines that reproduces each index within ±5 points"
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
"id": "bertsekas",
"name": "Dimitri Bertsekas",
"name_ru": "Димитри Бертсекас",
"years": "1942–2026",
"wiki": "https://en.wikipedia.org/wiki/Dimitri_Bertsekas",
"zone": "answer_cost",
"idea": {
"en": "Dynamic programming and optimisation: minimising the total cost of a chain of decisions.",
"ru": "Динамическое программирование: как свести к минимуму суммарную стоимость цепочки решений.",
"de": "Dynamische Programmierung: Gesamtkosten einer Entscheidungskette minimieren."
},
"rule": "Plan the whole chain of steps; the cheapest first step is not always the cheapest path.",
"needs": {
"code": "ready",
"note": "measure the size in tokens of every Orb Studio tool answer and give the cheapest chain of calls for typical agent questions"
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
