# «Библиотека кристаллов»: учёные, ушедшие в 2020–2026 годах, найденные разведчиком Грок-ботом по английской Википедии.
# Поля: id, имя (en), имя (ru), годы, путь статьи en.wikipedia, слепая зона агента, мысль (en, ru, de), правило для агента (en — наше толкование).
# Даты смерти 2026 года сверены Claude с некрологами университетов и научных обществ (22.11.2026).
ZONES = ["stale_data", "one_model", "rumour_vs_fact", "measurement_error", "answer_cost", "side_effects", "look_alike", "own_limits"]
C = [
# --- 1. старые данные вместо свежих ---
("belnap", "Nuel Belnap", "Нуэль Белнап", "1930–2024", "Nuel_Belnap", "stale_data",
 "Temporal and branching-time logic: whether a statement is true depends on the moment it is made.", "Временна́я логика: истинность утверждения зависит от момента, когда оно сделано.", "Zeitlogik: ob eine Aussage wahr ist, hängt vom Zeitpunkt ab.",
 "Attach a time to every claim you repeat; a true sentence from yesterday may be false today."),
("astrom", "Karl Johan Åström", "Карл Юхан Острём", "1934–2026", "Karl_Johan_Åström", "stale_data",
 "Self-tuning (adaptive) control: the model is re-estimated with every new measurement.", "Самонастраивающиеся регуляторы: модель пересчитывается по каждому новому измерению.", "Selbsteinstellende Regler: das Modell wird mit jeder neuen Messung neu geschätzt.",
 "Update your estimate with each new data point instead of keeping the first one."),
("minker", "Jack Minker", "Джек Минкер", "1927–2021", "Jack_Minker", "stale_data",
 "Non-monotonic reasoning and deductive databases: a conclusion can be withdrawn when new facts arrive.", "Немонотонные рассуждения: вывод можно отозвать, когда приходят новые факты.", "Nichtmonotones Schließen: ein Schluss kann zurückgenommen werden, wenn neue Fakten kommen.",
 "Mark conclusions as 'holds until new facts arrive' and be ready to retract them."),
("groenendijk", "Jeroen Groenendijk", "Йерун Грунендейк", "1949–2023", "Jeroen_Groenendijk", "stale_data",
 "Dynamic semantics: the meaning of an utterance is the change it makes to the information state.", "Динамическая семантика: смысл высказывания — это то, как оно меняет состояние информации.", "Dynamische Semantik: Bedeutung ist die Änderung des Informationsstands.",
 "Read each new message as an update to what you knew, not as an isolated fact."),
("dagum", "Estelle Bee Dagum", "Эстель Би Дагум", "1935–2026", "Estelle_Bee_Dagum", "stale_data",
 "X-11-ARIMA: seasonal adjustment and real-time estimates of the trend of a time series.", "Метод X-11-ARIMA: сезонная корректировка и оценка тренда временного ряда в реальном времени.", "X-11-ARIMA: Saisonbereinigung und Echtzeit-Trendschätzung von Zeitreihen.",
 "Before calling a rise news, check whether it is the usual seasonal or daily rhythm."),
("lorden", "Gary Lorden", "Гэри Лорден", "1941–2023", "Gary_Lorden", "stale_data",
 "Quickest change detection: noticing as early as possible that data started to follow a different law.", "Быстрое обнаружение изменений: как можно раньше заметить, что данные начали подчиняться другим законам.", "Schnellste Änderungserkennung: früh bemerken, dass Daten einem anderen Gesetz folgen.",
 "Watch for a change of regime, not only for single outliers."),
("sims", "Christopher A. Sims", "Кристофер Симс", "1942–2026", "Christopher_A._Sims", "stale_data",
 "Vector autoregressions: models of many economic series updated as fresh data come in (Nobel prize 2011).", "Векторные авторегрессии: модели многих экономических рядов, которые обновляются по свежим данным (Нобелевская премия 2011).", "Vektorautoregressionen: Modelle vieler Wirtschaftsreihen, laufend mit frischen Daten aktualisiert (Nobelpreis 2011).",
 "Look at several related series together; one series alone hides how shocks spread."),
("ljung", "Greta M. Ljung", "Грета Льюнг", "1941–2024", "Greta_M._Ljung", "stale_data",
 "The Ljung–Box test: are a model's leftover errors still patterned, i.e. has the model stopped describing the data?", "Тест Льюнг–Бокса: остались ли в ошибках модели закономерности, то есть не перестала ли модель описывать данные.", "Ljung-Box-Test: zeigen die Restfehler eines Modells noch Muster?",
 "If your errors repeat in a pattern, your model is out of date."),
("tiao", "George C. Tiao", "Джордж Тяо", "1933–2026", "George_C._Tiao", "stale_data",
 "Time-series analysis and intervention analysis: measuring how an event changed a series.", "Анализ временных рядов и анализ вмешательств: как событие изменило ряд.", "Zeitreihen- und Interventionsanalyse: wie ein Ereignis eine Reihe verändert hat.",
 "Separate the effect of a single event from the ongoing trend before you explain a change."),
("cleveland", "William S. Cleveland", "Уильям Кливленд", "1943–2026", "William_S._Cleveland", "stale_data",
 "LOESS smoothing and the science of graphs: let the data show its local shape without a rigid formula.", "Сглаживание LOESS и наука о графиках: пусть данные показывают свою форму без жёсткой формулы.", "LOESS-Glättung und Grafikforschung: Daten ihre lokale Form zeigen lassen.",
 "Look at the smoothed local trend before drawing a straight line through the data."),
("welch", "Lloyd R. Welch", "Ллойд Уэлч", "1927–2023", "Lloyd_R._Welch", "stale_data",
 "The Baum–Welch algorithm: estimating the hidden state of a system from a stream of observations.", "Алгоритм Баума–Уэлча: оценка скрытого состояния системы по потоку наблюдений.", "Baum-Welch-Algorithmus: verborgenen Zustand aus einer Beobachtungsfolge schätzen.",
 "What you see is a noisy trace of a hidden state; estimate the state, do not just repeat the trace."),
("shumway", "Robert H. Shumway", "Роберт Шамвей", "1936–2025", "Robert_H._Shumway", "stale_data",
 "Time-series analysis, including state-space models and the handling of missing observations.", "Анализ временных рядов, в том числе модели пространства состояний и пропуски наблюдений.", "Zeitreihenanalyse, Zustandsraummodelle und fehlende Beobachtungen.",
 "A gap in a series is information too: say what is missing instead of filling it silently."),
("zdonik", "Stanley Zdonik", "Стэнли Здоник", "1947–2026", "Stanley_Zdonik", "stale_data",
 "Stream processing systems: data is a continuous flow to be processed as it arrives, not a frozen snapshot.", "Потоковая обработка данных: данные — непрерывный поток, а не застывший снимок.", "Datenstromsysteme: Daten als laufender Strom, nicht als eingefrorener Schnappschuss.",
 "Ask how old your snapshot is; the stream has moved on since."),
("belady", "László Bélády", "Ласло Белади", "1928–2021", "László_Bélády", "stale_data",
 "Cache replacement: the best item to evict is the one needed furthest in the future (Bélády's algorithm).", "Замещение в кэше: выбрасывать стоит то, что понадобится позже всего (алгоритм Белади).", "Cache-Ersetzung: verdränge, was am spätesten wieder gebraucht wird.",
 "Keep in your context what you will need next, drop what you will not."),
("roggen", "Ingar Roggen", "Ингар Рогген", "1934–2023", "Ingar_Roggen", "stale_data",
 "Logic of time in sociology: social facts are tied to moments and sequences.", "Логика времени в социологии: социальные факты привязаны к моментам и последовательностям.", "Zeitlogik in der Soziologie: soziale Tatsachen sind an Zeitpunkte gebunden.",
 "Keep the order of events; a correct fact in the wrong order misleads."),
("jury", "Eliahu I. Jury", "Элиаху Джури", "1923–2020", "Eliahu_I._Jury", "stale_data",
 "Digital signal processing and the Jury stability test for discrete-time systems.", "Цифровая обработка сигналов и критерий устойчивости Джури для дискретных систем.", "Digitale Signalverarbeitung und das Jury-Stabilitätskriterium.",
 "Check whether a sequence of updates settles down or keeps amplifying itself."),
("wonham", "W. M. Wonham", "Уолтер Уонэм", "1934–2023", "W._M._Wonham", "stale_data",
 "Stochastic filtering (the Wonham filter): updating the estimate of a state with each new noisy observation.", "Стохастическая фильтрация (фильтр Уонэма): оценка состояния обновляется по каждому новому шумному наблюдению.", "Stochastische Filterung (Wonham-Filter): Zustandsschätzung mit jeder verrauschten Beobachtung.",
 "Weigh each new observation by how noisy it is, then update; do not replace the estimate wholesale."),
("bonomi", "Andrea Bonomi", "Андреа Бономи", "1940–2025", "Andrea_Bonomi_(philosopher)", "stale_data",
 "Tense and aspect in language: how sentences are anchored to moments in time.", "Время и вид в языке: как высказывания привязаны к моменту.", "Tempus und Aspekt: wie Sätze an Zeitpunkte gebunden sind.",
 "'Is', 'was' and 'will be' are different claims; keep the tense of the source."),
# --- 2. одна модель вместо реальности ---
("rissanen", "Jorma Rissanen", "Йорма Риссанен", "1932–2020", "Jorma_Rissanen", "one_model",
 "Minimum description length: the best model is the one that describes the data most briefly.", "Принцип минимальной длины описания: лучшая модель описывает данные короче всех.", "Minimale Beschreibungslänge: das beste Modell beschreibt die Daten am kürzesten.",
 "Prefer the explanation that needs fewest extra assumptions to cover the facts."),
("schmeidler", "David Schmeidler", "Давид Шмейдлер", "1939–2022", "David_Schmeidler", "own_limits",
 "Decisions under ambiguity: there may be no single 'true' probability model.", "Решения в неопределённости: одной «настоящей» вероятностной модели может не быть.", "Entscheidungen bei Ambiguität: es gibt nicht immer ein einziges wahres Wahrscheinlichkeitsmodell.",
 "When probabilities are unknown, say so and give a range instead of one number."),
("mallows", "Colin Lingwood Mallows", "Колин Мэллоус", "1930–2023", "Colin_Lingwood_Mallows", "one_model",
 "Mallows's Cp: comparing regression models while penalising needless complexity.", "Критерий Cp: сравнение регрессионных моделей со штрафом за лишнюю сложность.", "Mallows' Cp: Regressionsmodelle vergleichen, unnötige Komplexität bestrafen.",
 "A model that fits everything perfectly may only be memorising noise."),
("leamer", None, None, None, None, "one_model", None, None, None, None),
("eicker", "Friedhelm Eicker", "Фридхельм Айкер", "1927–2022", "Friedhelm_Eicker", "one_model",
 "Robust (Eicker–Huber–White) standard errors: valid even when the assumed spread of the data is wrong.", "Робастные стандартные ошибки: верны, даже если модель разброса данных ошибочна.", "Robuste Standardfehler: gültig, auch wenn die angenommene Streuung falsch ist.",
 "State uncertainty in a way that survives a wrong assumption about the noise."),
("titterington", "Mike Titterington", "Майк Титтерингтон", "1945–2023", "Mike_Titterington", "one_model",
 "Finite mixture models: the same observations can come from several hidden groups.", "Модели смесей: одни и те же наблюдения могут происходить из нескольких скрытых групп.", "Mischungsmodelle: dieselben Beobachtungen können aus mehreren verborgenen Gruppen stammen.",
 "An average can hide two different groups; check whether the data is mixed."),
("morrison", "Margaret Morrison", "Маргарет Моррисон", "1954–2021", "Margaret_Morrison_(philosopher)", "one_model",
 "Models as mediators: a model stands between theory and the world; it is not the world itself.", "Модели как посредники: модель стоит между теорией и миром, а не является самим миром.", "Modelle als Vermittler: ein Modell steht zwischen Theorie und Welt.",
 "Say 'according to the model' when you report a model's output."),
("leonard", "Thomas H. Leonard", "Томас Леонард", "1948–2023", "Thomas_H._Leonard", "one_model",
 "Bayesian methods and the role of prior assumptions in the conclusion.", "Байесовские методы и роль исходных предположений в выводе.", "Bayes-Methoden und die Rolle der Vorannahmen.",
 "Name your starting assumptions; another start can lead to another conclusion."),
("friedman", "Michael Friedman", "Майкл Фридман", "1947–2025", "Michael_Friedman_(philosopher)", "one_model",
 "Dynamics of reason: the basic principles of science themselves change over time.", "Динамика разума: базовые принципы науки сами меняются со временем.", "Dynamik der Vernunft: die Grundprinzipien der Wissenschaft wandeln sich.",
 "Today's framework is not eternal; say which framework your answer assumes."),
("shapiro", "Samuel Sanford Shapiro", "Сэмюэл Шапиро", "1930–2023", "Samuel_Sanford_Shapiro", "one_model",
 "The Shapiro–Wilk test: can the data be treated as normally distributed at all?", "Тест Шапиро–Уилка: можно ли вообще считать данные нормально распределёнными.", "Shapiro-Wilk-Test: dürfen die Daten als normalverteilt gelten?",
 "Check the shape of the data before using averages and standard deviations."),
("deely", "John J. Deely", "Джон Дили", "1933–2025", "John_J._Deely", "one_model",
 "Empirical Bayes: estimates are built from many similar cases, not from one rigid assumption.", "Эмпирический байесовский подход: оценку строят по набору похожих случаев.", "Empirischer Bayes: Schätzungen aus vielen ähnlichen Fällen.",
 "Compare with similar past cases before judging one case."),
("glejser", "Herbert Glejser", "Герберт Глейзер", "1938–2024", "Herbert_Glejser", "one_model",
 "The Glejser test: does the model describe the spread of the data correctly?", "Тест Глейзера: правильно ли модель описывает разброс данных.", "Glejser-Test: beschreibt das Modell die Streuung richtig?",
 "Check whether your uncertainty grows with the size of the numbers."),
("hollander", "Myles Hollander", "Майлз Холландер", "1941–2025", "Myles_Hollander", "one_model",
 "Nonparametric statistics: conclusions without assuming a rigid model of the data.", "Непараметрическая статистика: выводы без жёсткой модели данных.", "Nichtparametrische Statistik: Schlüsse ohne starres Modell.",
 "Use ranks and counts when you do not know the true shape of the data."),
("massam", "Hélène Massam", "Элен Массам", "–2020", "Hélène_Massam", "one_model",
 "Graphical models: the structure of dependencies between variables can itself be uncertain.", "Графические модели: сама структура связей между переменными может быть неопределённой.", "Graphische Modelle: auch die Abhängigkeitsstruktur kann unsicher sein.",
 "Do not assume you know which factors are connected; that is part of the question."),
("dudley", "Richard M. Dudley", "Ричард Дадли", "1938–2020", "Richard_M._Dudley", "one_model",
 "Empirical processes: how far a sample can differ from the true distribution.", "Эмпирические процессы: насколько выборка может отличаться от настоящего распределения.", "Empirische Prozesse: wie weit eine Stichprobe von der wahren Verteilung abweicht.",
 "A sample is not the population; say how large the sample was."),
("kashyap", "Rangasami L. Kashyap", "Рангасами Кашьяп", "1938–2022", "Rangasami_L._Kashyap", "one_model",
 "Kashyap's criterion (KIC): choosing the best model among several candidates.", "Критерий Кашьяпа (KIC): выбор лучшей модели из нескольких кандидатов.", "Kashyap-Kriterium: Auswahl des besten Modells unter mehreren.",
 "Compare at least two candidate explanations before you settle on one."),
("athans", "Michael Athans", "Майкл Атанс", "1937–2020", "Michael_Athans", "one_model",
 "Robust control: a controller that still works when the model of the system is inaccurate.", "Робастное управление: регулятор работает, даже когда модель объекта неточна.", "Robuste Regelung: funktioniert auch bei ungenauem Modell.",
 "Prefer advice that still holds if your picture of the situation is somewhat wrong."),
("guesnerie", "Roger Guesnerie", "Роже Геснери", "1943–2026", "Roger_Guesnerie", "one_model",
 "Expectations and equilibria: with the same data, market expectations can settle on different equilibria.", "Ожидания и равновесия: при одних и тех же данных ожидания рынка могут прийти к разным равновесиям.", "Erwartungen und Gleichgewichte: gleiche Daten, verschiedene Gleichgewichte.",
 "The same facts can support several outcomes; do not present one as inevitable."),
# --- 3. слух вместо факта ---
("goldman", "Alvin Goldman", "Элвин Голдман", "1938–2024", "Alvin_Goldman", "rumour_vs_fact",
 "Social epistemology: how knowledge passes through testimony and the media, and when that chain is reliable.", "Социальная эпистемология: как знание передаётся через свидетельства и СМИ и когда эта цепочка надёжна.", "Soziale Erkenntnistheorie: Wissen durch Zeugnis und Medien.",
 "Ask how many independent witnesses stand behind a claim, not how many repeat it."),
("gettier", "Edmund Gettier", "Эдмунд Геттиер", "1927–2021", "Edmund_Gettier", "rumour_vs_fact",
 "Gettier cases: a justified true belief is not necessarily knowledge.", "Случаи Геттиера: обоснованное и верное мнение ещё не обязательно знание.", "Gettier-Fälle: gerechtfertigte wahre Meinung ist nicht unbedingt Wissen.",
 "Check the path to a conclusion, not only the conclusion; a right answer for the wrong reason is fragile."),
("woods", "John Woods", "Джон Вудс", "1937–2024", "John_Woods_(logician)", "rumour_vs_fact",
 "The logic of fallacies: common errors in the reasoning of real agents.", "Логика ошибок: типичные ошибки в рассуждениях реальных агентов.", "Logik der Fehlschlüsse bei realen Akteuren.",
 "Before trusting an argument, name the step where it could go wrong."),
("rescher", "Nicholas Rescher", "Николас Решер", "1928–2024", "Nicholas_Rescher", "rumour_vs_fact",
 "Coherence theory: a claim earns trust when it fits the rest of what is known.", "Теория когерентности: утверждению можно доверять, если оно согласуется с остальными известными фактами.", "Kohärenztheorie: Vertrauen, wenn eine Aussage zum übrigen Wissen passt.",
 "Check a surprising claim against what other independent sources say."),
("harding", "Sandra Harding", "Сандра Хардинг", "1935–2025", "Sandra_Harding", "rumour_vs_fact",
 "Standpoint epistemology: who the source is shapes what it can see.", "Эпистемология позиции: кто источник, влияет на то, что он может увидеть.", "Standpunkttheorie: die Position der Quelle prägt, was sie sieht.",
 "Note whose viewpoint a source represents and whose is missing."),
("bunge", "Mario Bunge", "Марио Бунге", "1919–2020", "Mario_Bunge", "rumour_vs_fact",
 "Scientific realism and the critique of pseudoscience.", "Научный реализм и критика псевдонауки.", "Wissenschaftlicher Realismus und Kritik der Pseudowissenschaft.",
 "Ask whether a claim could be tested and whether it fits established science."),
("laudan", "Larry Laudan", "Ларри Лаудан", "1941–2022", "Larry_Laudan", "rumour_vs_fact",
 "Against a simple line between 'science' and 'non-science': judge claims by their evidence, one by one.", "Против простого деления на «науку» и «не науку»: оценивать утверждения по их доказательствам.", "Gegen eine einfache Grenze zwischen Wissenschaft und Nichtwissenschaft.",
 "Judge each claim on its evidence, not on the label of its source."),
("agassi", "Joseph Agassi", "Йосеф Агасси", "1927–2023", "Joseph_Agassi", "rumour_vs_fact",
 "Critical rationalism (a student of Popper): science grows by criticising and testing ideas.", "Критический рационализм (ученик Поппера): наука растёт через критику и проверку идей.", "Kritischer Rationalismus (Popper-Schüler): Wissen wächst durch Kritik.",
 "Look for what would prove a claim wrong, not only for what supports it."),
("corcoran", "John Corcoran", "Джон Коркоран", "1937–2021", "John_Corcoran_(logician)", "rumour_vs_fact",
 "The difference between an argument and a proof.", "Чем аргумент отличается от доказательства.", "Unterschied zwischen Argument und Beweis.",
 "Do not call a persuasive argument a proof."),
("bealer", "George Bealer", "Джордж Билер", "1944–2025", "George_Bealer", "rumour_vs_fact",
 "Intuitions as evidence: how far an intuition can be trusted.", "Интуиция как свидетельство: насколько ей можно доверять.", "Intuitionen als Evidenz: wie weit man ihnen trauen kann.",
 "Treat 'it seems obvious' as a starting point to check, not as evidence."),
("frazier", "Kendrick Frazier", "Кендрик Фрейзер", "1942–2022", "Kendrick_Frazier", "rumour_vs_fact",
 "Editor of Skeptical Inquirer: public examination of paranormal and pseudoscientific claims.", "Редактор журнала Skeptical Inquirer: публичный разбор паранормальных и псевдонаучных заявлений.", "Herausgeber des Skeptical Inquirer: Prüfung pseudowissenschaftlicher Behauptungen.",
 "Extraordinary claims need extraordinary evidence; ask for it."),
("kripke", "Saul Kripke", "Сол Крипке", "1940–2022", "Saul_Kripke", "rumour_vs_fact",
 "Names refer to the thing itself, not to a description that happens to fit it.", "Имя указывает на сам объект, а не на случайное описание этого объекта.", "Namen bezeichnen das Ding selbst, nicht eine zufällige Beschreibung.",
 "Treat 'Kyiv', 'Kiev' and 'Kiew' as one place, and check which person a title like 'the president' means today."),
("latour", "Bruno Latour", "Бруно Латур", "1947–2022", "Bruno_Latour", "rumour_vs_fact",
 "How a scientific fact is built in labs, papers and citations — and how trust in science can be restored.", "Как в лаборатории рождается научный факт и как вернуть доверие к науке.", "Wie eine wissenschaftliche Tatsache entsteht und wie Vertrauen zurückkehrt.",
 "Before calling something a fact, find the chain of sources that made it one."),
("krausz", "Michael Krausz", "Майкл Краус", "1942–2025", "Michael_Krausz", "rumour_vs_fact",
 "Interpretation: one thing can admit several reasonable readings.", "Толкование: у одного и того же может быть несколько разумных толкований.", "Interpretation: mehrere vernünftige Lesarten sind möglich.",
 "When a text is ambiguous, give the main readings instead of picking one silently."),
("passeron", "Jean-Claude Passeron", "Жан-Клод Пассерон", "1930–2026", "Jean-Claude_Passeron", "rumour_vs_fact",
 "How the social sciences prove their claims, which always depend on context.", "Как социальные науки доказывают утверждения, которые всегда зависят от контекста.", "Wie Sozialwissenschaften ihre Aussagen belegen.",
 "Name the context (place, time, group) in which a social claim was shown."),
("tuomela", "Raimo Tuomela", "Раймо Туомела", "1940–2020", "Raimo_Tuomela", "rumour_vs_fact",
 "Philosophy of science and social action: from hypothesis and data to a justified conclusion.", "Философия науки и социального действия: как из гипотезы и данных получается обоснованный вывод.", "Vom Hypothese und Daten zum begründeten Schluss.",
 "Keep hypothesis, data and conclusion apart when you explain."),
("decruz", "Helen De Cruz", "Хелен Де Круз", "1978–2025", "Helen_De_Cruz", "rumour_vs_fact",
 "Experimental philosophy and the cognitive science of belief.", "Экспериментальная философия и когнитивная наука о верованиях.", "Experimentelle Philosophie und Kognitionswissenschaft des Glaubens.",
 "People's beliefs follow recognisable mental habits; check yours too."),
# --- 4. ошибки измерения ---
("higham", "Nicholas Higham", "Николас Хайэм", "1961–2024", "Nicholas_Higham", "measurement_error",
 "Accuracy and stability of numerical algorithms: rounding errors can grow through a calculation.", "Точность численных алгоритмов: ошибки округления могут нарастать по ходу расчёта.", "Genauigkeit numerischer Algorithmen: Rundungsfehler können wachsen.",
 "Do not report more digits than the inputs justify."),
("hambleton", "Ronald K. Hambleton", "Рональд Хамблтон", "1943–2022", "Ronald_K._Hambleton", "measurement_error",
 "Item response theory: how reliable a score from a test is.", "Теория ответа на задания: насколько надёжна оценка по тесту.", "Item-Response-Theorie: wie verlässlich ein Testwert ist.",
 "A score comes with a margin of error; quote it."),
("babuska", "Ivo Babuška", "Иво Бабушка", "1926–2023", "Ivo_Babuška", "measurement_error",
 "Adaptive numerical methods and a posteriori error estimates for finite elements.", "Адаптивные численные методы и апостериорные оценки погрешности метода конечных элементов.", "Adaptive numerische Verfahren und a-posteriori-Fehlerschätzung.",
 "After computing an answer, estimate how wrong it could be."),
("mislevy", "Robert J. Mislevy", "Роберт Мислеви", "1950–2025", "Robert_J._Mislevy", "measurement_error",
 "Evidence-centred design: an assessment is an argument from evidence, with its uncertainty.", "Доказательный подход к оценке: оценка — это вывод из свидетельств с учётом неопределённости.", "Evidenzbasiertes Design: Bewertung als Argument aus Evidenz.",
 "Say what evidence a judgement rests on and how strong it is."),
("mellenbergh", "Gideon J. Mellenbergh", "Гидеон Мелленберг", "1938–2021", "Gideon_J._Mellenbergh", "measurement_error",
 "Psychometrics, including finding test items that measure differently for different groups (item bias).", "Психометрия, в том числе поиск заданий, которые меряют разные группы по-разному.", "Psychometrie, auch verzerrte Testaufgaben.",
 "Check whether your measure treats all groups the same."),
("winkler", "William E. Winkler", "Уильям Уинклер", "1946–2022", "William_E._Winkler", "look_alike",
 "Record linkage: errors when matching records from different databases (Jaro–Winkler similarity).", "Сопоставление записей: ошибки при сопоставлении данных из разных баз (сходство Джаро–Уинклера).", "Datensatzverknüpfung: Fehler beim Abgleich von Datenbanken.",
 "Two records with similar names may be different people; say how sure the match is."),
("li_tianchu", "Li Tianchu", "Ли Тяньчу", "1945–2022", "Li_Tianchu", "measurement_error",
 "Metrology in China: measurement standards.", "Метрология в Китае: эталоны измерений.", "Metrologie in China: Messnormale.",
 "Every number needs a standard it can be traced to."),
("woodcock", "Richard Woodcock", "Ричард Вудкок", "1928–2024", "Richard_Woodcock", "measurement_error",
 "Psychometrics, the Rasch model and the Woodcock–Johnson tests.", "Психометрия, модель Раша и тесты Вудкока–Джонсона.", "Psychometrie, Rasch-Modell und Woodcock-Johnson-Tests.",
 "A scale is only meaningful if its steps are equal; check what one point means."),
("byrne", "Barbara M. Byrne", "Барбара Бирн", "1935–2020", "Barbara_M._Byrne", "measurement_error",
 "Validity: does an instrument measure what it promises to measure?", "Валидность: измеряет ли инструмент то, что обещает.", "Validität: misst ein Instrument, was es verspricht?",
 "Ask whether an index really measures what its name says."),
("bailar", "Barbara Bailar", "Барбара Бейлар", "1935–2023", "Barbara_Bailar", "measurement_error",
 "Census undercount: who is missed by a count, as in the 1990 US census.", "Недоучёт при переписи: кого пропускает подсчёт, как в переписи США 1990 года.", "Untererfassung bei der Volkszählung: wer fehlt.",
 "Ask who is not in the data before you generalise."),
("bhat", "U. Narayan Bhat", "Нараян Бхат", "1934–2021", "U._Narayan_Bhat", "measurement_error",
 "Queueing and reliability theory.", "Теория очередей и надёжности.", "Warteschlangen- und Zuverlässigkeitstheorie.",
 "Delays add up in a chain; estimate the wait, not only the speed of one step."),
("zupko", "Ronald Edward Zupko", "Рональд Зупко", "1938–2021", "Ronald_Edward_Zupko", "measurement_error",
 "History of weights and measures: units change between places and centuries.", "История мер и весов: единицы меняются от места к месту и от века к веку.", "Geschichte der Maße und Gewichte.",
 "Check the unit; the same word can mean different quantities."),
("hagenauer", None, None, None, None, "measurement_error", None, None, None, None),
("pless", "Vera Pless", "Вера Плесс", "1931–2020", "Vera_Pless", "measurement_error",
 "Error-correcting codes: redundancy lets a receiver detect and fix errors in transmission.", "Коды, исправляющие ошибки: избыточность позволяет найти и исправить ошибки передачи.", "Fehlerkorrigierende Codes: Redundanz erkennt und behebt Fehler.",
 "Confirm an important fact by a second, independent route."),
("skinner", "Chris Skinner", "Крис Скиннер", "1953–2020", "Chris_Skinner_(statistician)", "measurement_error",
 "Survey methods: handling missing answers, measurement error and complex samples.", "Методы опросов: пропуски, ошибки измерения и сложные выборки.", "Umfragemethoden: fehlende Antworten und Messfehler.",
 "Say how much is missing and how it could bias the result."),
("pollak", "Henry O. Pollak", "Генри Поллак", "1927–2026", "Henry_O._Pollak", "measurement_error",
 "Limits of a signal in time and frequency at once (prolate spheroidal wave functions, with Slepian and Landau).", "Пределы точности сигнала одновременно во времени и по частоте (с Слепяном и Ландау).", "Grenzen eines Signals in Zeit und Frequenz zugleich.",
 "Some quantities cannot be sharp in two respects at once; say which one you chose."),
# --- 5. цена ответа ---
("radner", "Roy Radner", "Рой Раднер", "1927–2022", "Roy_Radner", "answer_cost",
 "Bounded rationality and the economics of information: gathering information has a cost.", "Ограниченная рациональность и экономика информации: сбор сведений стоит денег и времени.", "Begrenzte Rationalität: Information hat ihren Preis.",
 "Stop gathering when more data would not change the answer."),
("whittle", "Peter Whittle", "Питер Уиттл", "1927–2021", "Peter_Whittle_(mathematician)", "answer_cost",
 "The Whittle index: how to share effort between options in a changing world (restless bandits).", "Индекс Уиттла: как распределять усилия между вариантами в меняющемся мире.", "Whittle-Index: Aufwand zwischen Optionen in einer sich ändernden Welt verteilen.",
 "Spend checks on the sources that change most and matter most."),
("berger", "Toby Berger", "Тоби Бергер", "1940–2022", "Toby_Berger", "answer_cost",
 "Rate-distortion theory: how many bits are needed to convey an answer with a given accuracy.", "Теория скорости и искажения: сколько бит нужно, чтобы передать ответ с заданной точностью.", "Raten-Verzerrungs-Theorie: Bits für eine gegebene Genauigkeit.",
 "Match the length of the answer to the accuracy the person needs."),
("woodroofe", "Michael Woodroofe", "Майкл Вудруф", "1940–2022", "Michael_Woodroofe", "answer_cost",
 "Sequential analysis: when there are enough observations to stop.", "Последовательный анализ: когда наблюдений уже достаточно и можно остановиться.", "Sequentialanalyse: wann genug Beobachtungen vorliegen.",
 "Decide in advance how much evidence is enough."),
("neil_jones", "Neil D. Jones", "Нил Джонс", "1941–2023", "Neil_D._Jones", "answer_cost",
 "Computational complexity and partial evaluation: specialising a program to the input it gets.", "Вычислительная сложность и частичные вычисления: программа подстраивается под свои входные данные.", "Komplexität und partielle Auswertung.",
 "Reuse what you already computed instead of starting from scratch."),
("wynn", "Henry Wynn", "Генри Уинн", "1945–2024", "Henry_Wynn", "answer_cost",
 "Optimal experimental design: how to spend a measurement budget wisely.", "Оптимальное планирование эксперимента: как разумно распределить бюджет измерений.", "Optimale Versuchsplanung: Messbudget klug verteilen.",
 "Choose the one question that would reduce your uncertainty most."),
("dreze", "Jacques Drèze", "Жак Дрез", "1929–2022", "Jacques_Drèze", "answer_cost",
 "Economic decisions under uncertainty.", "Экономические решения в условиях неопределённости.", "Wirtschaftliche Entscheidungen unter Unsicherheit.",
 "Make the decision robust to what you do not know."),
("herzberg", "Agnes M. Herzberg", "Агнес Герцберг", "1938–2026", "Agnes_M._Herzberg", "answer_cost",
 "Optimal design of experiments.", "Оптимальное планирование экспериментов.", "Optimale Versuchsplanung.",
 "Plan what to measure before measuring."),
("selman", "Alan Selman", "Алан Селман", "1941–2021", "Alan_Selman", "answer_cost",
 "Computational complexity theory.", "Теория вычислительной сложности.", "Komplexitätstheorie.",
 "Some questions are expensive to answer exactly; say when an approximation is used."),
("chow", "Yuan-Shih Chow", "Юань-Ши Чоу", "1924–2022", "Yuan-Shih_Chow", "answer_cost",
 "Optimal stopping: when to stop searching and answer.", "Оптимальная остановка: когда прекратить поиск и ответить.", "Optimales Stoppen: wann man aufhört zu suchen.",
 "Set a stopping rule for your search."),
("kersten", "Martin L. Kersten", "Мартин Керстен", "1953–2022", "Martin_L._Kersten", "answer_cost",
 "Column-store databases and query optimisation (MonetDB).", "Колоночные базы данных и оптимизация запросов (MonetDB).", "Spaltenorientierte Datenbanken und Abfrageoptimierung (MonetDB).",
 "Ask only for the fields you need."),
("wets", "Roger J-B Wets", "Роджер Уэтс", "1937–2025", "Roger_J-B_Wets", "answer_cost",
 "Stochastic programming: decisions when the input data is still random.", "Стохастическое программирование: решения, когда исходные данные ещё случайны.", "Stochastische Optimierung: Entscheidungen bei zufälligen Daten.",
 "Plan for several scenarios, not for the single expected one."),
("davis", "Martin Davis", "Мартин Дэвис", "1928–2023", "Martin_Davis_(mathematician)", "answer_cost",
 "The DPLL algorithm at the core of SAT solvers that check whether logical formulas can be satisfied.", "Алгоритм DPLL, на котором построены SAT-солверы, проверяющие выполнимость логических формул.", "DPLL-Algorithmus, Grundlage der SAT-Solver.",
 "Check whether a set of claims can all be true together before you combine them."),
("kirillova", "Faina Kirillova", "Фаина Кириллова", "1931–2024", "Faina_Kirillova", "answer_cost",
 "Optimal control theory.", "Теория оптимального управления.", "Optimale Steuerung.",
 "Define the goal and the cost before choosing the action."),
# --- партия 9 (22.11.2026) ---
("mitter", "Sanjoy K. Mitter", "Санджой Миттер", "1933–2023", "Sanjoy_K._Mitter", "stale_data",
 "Nonlinear filtering: estimating the state of a system from a stream of noisy observations.", "Нелинейная фильтрация: оценка состояния системы по потоку шумных наблюдений.", "Nichtlineare Filterung: Zustandsschätzung aus verrauschten Beobachtungen.",
 "Update your picture with each new noisy report, weighted by how reliable it is."),
("nagao", "Makoto Nagao", "Макото Нагао", "1936–2021", "Makoto_Nagao", "stale_data",
 "Example-based machine translation and digital libraries.", "Машинный перевод по примерам и цифровые библиотеки.", "Beispielbasierte maschinelle Übersetzung und digitale Bibliotheken.",
 "When translating a headline, compare with how the same phrase was rendered before."),
("sonnenschein", "Hugo F. Sonnenschein", "Хьюго Зонненшайн", "1940–2021", "Hugo_F._Sonnenschein", "one_model",
 "The Sonnenschein–Mantel–Debreu theorem: a general market model says almost nothing about how the market as a whole behaves.", "Теорема Зонненшайна–Мантеля–Дебрё: общая модель рынка почти ничего не говорит о поведении рынка в целом.", "Sonnenschein-Mantel-Debreu-Theorem: das allgemeine Marktmodell sagt wenig über das Gesamtverhalten.",
 "Do not infer how a whole system behaves from how a typical part behaves."),
("siljak", "Dragoslav D. Šiljak", "Драгослав Шиляк", "1933–2025", "Dragoslav_D._Šiljak", "one_model",
 "Decentralised control of large complex systems that stays stable when the model is inexact.", "Децентрализованное управление сложными системами, устойчивое при неточной модели.", "Dezentrale Regelung großer Systeme, stabil bei ungenauem Modell.",
 "Split a big question into parts that each still hold if one part of your model is wrong."),
("fox", "John Fox", "Джон Фокс", "1947–2025", "John_Fox_(sociologist)", "one_model",
 "Regression diagnostics and the R package car: checking whether a fitted model actually fits.", "Диагностика регрессии и пакет car для R: проверка, подходит ли модель к данным на самом деле.", "Regressionsdiagnostik und das R-Paket car.",
 "After fitting a model, look at the cases it explains worst."),
("burkov", "Vladimir Burkov", "Владимир Бурков", "1939–2025", "Vladimir_Burkov", "rumour_vs_fact",
 "Theory of active systems and mechanism design: rules under which it pays agents to report the truth.", "Теория активных систем и механизмов: правила, при которых агентам выгодно говорить правду.", "Theorie aktiver Systeme: Regeln, unter denen Ehrlichkeit sich lohnt.",
 "Prefer sources whose incentives reward accuracy; ask what a source gains from the claim."),
("antognazza", "Maria Rosa Antognazza", "Мария Роза Антоньяцца", "1964–2023", "Maria_Rosa_Antognazza", "rumour_vs_fact",
 "Knowledge and belief are different states, not just stronger and weaker versions of the same thing.", "Знание и убеждение — разные состояния, а не сильная и слабая версии одного и того же.", "Wissen und Glauben sind verschiedene Zustände.",
 "Say 'I believe' and 'it is known' in different words."),
("antiseri", "Dario Antiseri", "Дарио Антисери", "1940–2026", "Dario_Antiseri", "rumour_vs_fact",
 "Fallibilism (in the line of Popper): any knowledge may turn out to be wrong.", "Фаллибилизм (вслед за Поппером): любое знание может оказаться ошибочным.", "Fallibilismus (nach Popper): jedes Wissen kann sich als falsch erweisen.",
 "Hold every conclusion as revisable and say what would change it."),
("barlow", "Richard E. Barlow", "Ричард Барлоу", "1931–2024", "Richard_E._Barlow", "measurement_error",
 "Mathematical theory of reliability: how and when systems fail.", "Математическая теория надёжности: как и когда отказывают системы.", "Mathematische Zuverlässigkeitstheorie.",
 "A chain is as reliable as its weakest link; find it before trusting the chain."),
("borde", "Christian Bordé", "Кристиан Борде", "1943–2023", "Christian_Bordé", "measurement_error",
 "Optical clocks, atom interferometry and ultra-precise measurement; work towards the redefinition of SI units.", "Оптические часы, атомная интерферометрия и сверхточные измерения; работа над переопределением единиц СИ.", "Optische Uhren, Atominterferometrie und Präzisionsmessung.",
 "State how precise a number is, and do not mix values measured at different precision."),
("griffin", "Patrick Griffin", "Патрик Гриффин", "–2025", "Patrick_Griffin_(academic)", "measurement_error",
 "Assessment models and tests of skills.", "Модели оценивания и тесты навыков.", "Bewertungsmodelle und Kompetenztests.",
 "A test result estimates a skill; quote it with its uncertainty."),
("roberts", "John Roberts", "Джон Робертс", "1945–2026", "Donald_John_Roberts", "side_effects",
 "Games with incomplete information and the economics of organisations.", "Игры с неполной информацией и экономика организаций.", "Spiele mit unvollständiger Information und Organisationsökonomik.",
 "Act knowing that others know things you do not."),
("fishburn", "Peter C. Fishburn", "Питер Фишберн", "1936–2021", "Peter_C._Fishburn", "answer_cost",
 "Utility theory and decision making.", "Теория полезности и принятия решений.", "Nutzentheorie und Entscheidungsfindung.",
 "Make the trade-offs of a choice explicit."),
("morita", "Kenichi Morita", "Кэнъити Морита", "1949–2025", "Kenichi_Morita", "answer_cost",
 "Reversible computing: computation that loses no information.", "Обратимые вычисления: вычисления без потери информации.", "Reversible Berechnung ohne Informationsverlust.",
 "Keep enough of your steps to retrace how you reached an answer."),
# --- 2023 год (месячные страницы, 22.11.2026) ---
("schank", "Roger Schank", "Роджер Шенк", "1946–2023", "Roger_Schank", "stale_data",
 "Dynamic memory and case-based reasoning: understanding by recalling similar past cases and revising them.", "Динамическая память и рассуждение по прецедентам: понимание через похожие прошлые случаи, которые обновляются.", "Dynamisches Gedächtnis und fallbasiertes Schließen.",
 "Before judging a new story, recall similar past cases and say how this one differs."),
("newton_smith", "William Newton-Smith", "Уильям Ньютон-Смит", "1943–2023", "William_Newton-Smith", "stale_data",
 "The Structure of Time: philosophy of time and of scientific rationality.", "«Структура времени»: философия времени и научной рациональности.", "„The Structure of Time“: Philosophie der Zeit.",
 "Keep 'when it happened' apart from 'when it was reported'."),
("paul_david", "Paul A. David", "Пол Дэвид", "1935–2023", "Paul_A._David", "stale_data",
 "Path dependence: early choices like the QWERTY layout persist long after better options appear.", "Зависимость от пройденного пути: ранние решения вроде раскладки QWERTY держатся, хотя уже устарели.", "Pfadabhängigkeit: frühe Entscheidungen wie QWERTY bleiben bestehen.",
 "Ask whether a practice persists because it is best or only because it came first."),
("machamer", "Peter K. Machamer", "Питер Махамер", "1942–2023", "Peter_K._Machamer", "one_model",
 "Mechanistic explanation: explain by the parts and activities that produce an effect, not by one deductive law.", "Механистическое объяснение: объяснять через части и действия, которые дают эффект, а не через один закон.", "Mechanistische Erklärung: durch Teile und Tätigkeiten, nicht durch ein Gesetz.",
 "Explain a change by the concrete steps that produced it."),
("gintis", "Herbert Gintis", "Герберт Гинтис", "1940–2023", "Herbert_Gintis", "side_effects",
 "The Bounds of Reason: game theory needs a model of what players know and believe (epistemic game theory).", "«Границы разума»: теории игр нужна модель того, что игроки знают и во что верят.", "„The Bounds of Reason“: epistemische Spieltheorie.",
 "When predicting what actors do, state what you assume they know."),
("wilks", "Yorick Wilks", "Йорик Уилкс", "1939–2023", "Yorick_Wilks", "one_model",
 "Preference semantics: among several readings choose the most coherent one.", "Семантика предпочтений: из нескольких толкований выбирается самое согласованное.", "Präferenzsemantik: die kohärenteste Lesart wählen.",
 "When a phrase is ambiguous, pick the reading that fits the rest of the text, and say so."),
("hans_albert", "Hans Albert", "Ханс Альберт", "1921–2023", "Hans_Albert", "rumour_vs_fact",
 "The Münchhausen trilemma: no claim can be justified to the very end — every chain stops at an assumption, a circle or an infinite regress.", "Трилемма Мюнхгаузена: никакое утверждение нельзя обосновать до конца — цепочка упирается в допущение, круг или бесконечность.", "Münchhausen-Trilemma: keine Aussage lässt sich letztbegründen.",
 "Name the assumption your conclusion finally rests on."),
("scriven", "Michael Scriven", "Майкл Скрайвен", "1928–2023", "Michael_Scriven", "rumour_vs_fact",
 "Evaluation theory and critical thinking (formative versus summative evaluation).", "Теория оценивания и критическое мышление (формирующее и итоговое оценивание).", "Evaluationstheorie und kritisches Denken.",
 "Say by what criteria you judged something good or bad."),
("jarvie", "Ian Jarvie", "Иэн Джарви", "1937–2023", "Ian_Jarvie", "rumour_vs_fact",
 "Science as a social institution where members test each other's claims.", "Наука как сообщество, где участники проверяют утверждения друг друга.", "Wissenschaft als Gemeinschaft gegenseitiger Prüfung.",
 "Trust a claim more when independent people have tried to refute it."),
("van_emden", "Maarten van Emden", "Мартен ван Эмден", "1937–2023", "Maarten_van_Emden", "measurement_error",
 "Interval arithmetic and logic programming: compute with a number together with its error bounds.", "Интервальная арифметика и логическое программирование: число считается вместе с его погрешностью.", "Intervallarithmetik: rechnen mit Zahl und Fehlergrenzen.",
 "Carry error bounds through every calculation and report the interval."),
("markova", "Elena Vladimirovna Markova", "Елена Маркова", "1923–2023", "Elena_Vladimirovna_Markova", "measurement_error",
 "Design of experiments under non-uniform conditions.", "Планирование экспериментов при неоднородных условиях.", "Versuchsplanung unter ungleichen Bedingungen.",
 "Compare like with like: measurements taken under different conditions are not directly comparable."),
("fleming", "Wendell Fleming", "Уэнделл Флеминг", "1928–2023", "Wendell_Fleming", "answer_cost",
 "Optimal control of random processes (stochastic control).", "Оптимальное управление случайными процессами.", "Optimale Steuerung stochastischer Prozesse.",
 "Choose actions that work well across the random paths, not only the expected one."),
# --- 2024 год (месячные страницы, 22.11.2026) ---
("emerson", "E. Allen Emerson", "Аллен Эмерсон", "1954–2024", "E._Allen_Emerson", "stale_data",
 "Temporal logic and model checking (Turing award 2007): rules for what is true and when, checked automatically.", "Темпоральная логика и проверка моделей (премия Тьюринга 2007): правила о том, что истинно и когда, проверяемые автоматически.", "Temporallogik und Model Checking (Turing-Preis 2007).",
 "Write claims with their time condition ('until', 'since', 'always after') and check them against it."),
("stein", "Howard Stein", "Ховард Стайн", "1929–2024", "Howard_Stein_(philosopher)", "stale_data",
 "Foundations of the physics of space and time.", "Основания физики пространства и времени.", "Grundlagen der Physik von Raum und Zeit.",
 "Say in which frame (place, time, reference) a measurement holds."),
("jarke", "Matthias Jarke", "Маттиас Ярке", "1952–2024", "Matthias_Jarke", "stale_data",
 "Metadata and data quality in information systems (data warehouses).", "Метаданные и качество данных в информационных системах (хранилища данных).", "Metadaten und Datenqualität in Informationssystemen.",
 "Keep the metadata (source, time, unit) with every value you pass on."),
("basmann", "Robert Basmann", "Роберт Басман", "1926–2024", "Robert_Basmann", "one_model",
 "Simultaneous-equation models and identification: whether a model can be determined from the data at all.", "Системы одновременных уравнений и идентификация: можно ли вообще однозначно определить модель по данным.", "Simultane Gleichungsmodelle und Identifikation.",
 "Ask whether the data could tell your explanation apart from another one at all."),
("conway", "Richard W. Conway", "Ричард Конвей", "1931–2024", "Richard_W._Conway", "one_model",
 "Methodology of computer simulation.", "Методология компьютерного моделирования.", "Methodik der Computersimulation.",
 "A simulation shows what follows from its assumptions; report the assumptions with the result."),
("cleaveland", "Rance Cleaveland", "Рэнс Кливленд", "1961–2024", "Rance_Cleaveland", "one_model",
 "Verification tools that check automatically whether a system behaves as specified.", "Инструменты, которые автоматически проверяют, работает ли система как задумано.", "Werkzeuge zur automatischen Verifikation.",
 "Test your conclusion against the specification, not only against the example in front of you."),
("ruse", "Michael Ruse", "Майкл Руз", "1940–2024", "Michael_Ruse", "rumour_vs_fact",
 "The demarcation between science and non-science (and its role in court cases on creationism).", "Граница между наукой и ненаукой (и её роль в судебных делах о креационизме).", "Abgrenzung von Wissenschaft und Nichtwissenschaft.",
 "Ask whether a claim is testable and open to revision before calling it scientific."),
("depierris", "Graciela De Pierris", "Грасиела Де Пьеррис", "1950–2024", "Graciela_De_Pierris", "rumour_vs_fact",
 "Ideas, Evidence and Method: Hume's scepticism and the limits of evidence.", "«Идеи, свидетельства и метод»: скептицизм Юма и пределы свидетельств.", "„Ideas, Evidence, and Method“: Humes Skeptizismus.",
 "Past regularity is not proof of the next case; say when you rely on it."),
("cresswell", "Max Cresswell", "Макс Крессвелл", "1939–2024", "Max_Cresswell", "rumour_vs_fact",
 "Semantics of belief sentences and modal logic.", "Семантика высказываний об убеждениях и модальная логика.", "Semantik von Glaubenssätzen und Modallogik.",
 "'X believes that p' is a claim about X, not about p; do not report it as p."),
("schweder", "Tore Schweder", "Туре Шведер", "1943–2024", "Tore_Schweder", "measurement_error",
 "Confidence distributions: report the whole distribution of uncertainty of an estimate, not one number.", "Доверительные распределения: сообщать всё распределение неопределённости оценки, а не одно число.", "Konfidenzverteilungen: die ganze Unsicherheit einer Schätzung angeben.",
 "Give the range and how likely each part of it is, not only the point estimate."),
# --- 2025 год (месячные страницы, 22.11.2026; Сёрл получил датчик) ---
("lynch", "Clifford Lynch", "Клиффорд Линч", "1954–2025", "Clifford_Lynch", "stale_data",
 "Digital libraries and long-term preservation of digital information.", "Цифровые библиотеки и долгосрочное сохранение цифровой информации.", "Digitale Bibliotheken und Langzeitarchivierung.",
 "Cite a stable, archived version of a source, not only a link that may disappear."),
("kurtz", "Thomas G. Kurtz", "Томас Курц", "1941–2025", "Thomas_G._Kurtz", "stale_data",
 "Convergence and approximation of random (Markov) processes.", "Сходимость и приближение случайных (марковских) процессов.", "Konvergenz und Approximation stochastischer Prozesse.",
 "Check whether a running average has settled before treating it as stable."),
("gilyarevsky", "Ruggero Gilyarevsky", "Руджеро Гиляревский", "1929–2025", "Ruggero_Gilyarevsky", "stale_data",
 "Scientific information and communication (informatics as the science of information).", "Научная информация и коммуникация (информатика как наука об информации).", "Wissenschaftliche Information und Kommunikation.",
 "Note where and when a piece of information entered the chain you received it through."),
("abrial", "Jean-Raymond Abrial", "Жан-Раймон Абриаль", "1938–2025", "Jean-Raymond_Abrial", "one_model",
 "Formal methods: the Z notation and the B-Method for proving programs correct.", "Формальные методы: нотация Z и B-метод для доказательства правильности программ.", "Formale Methoden: Z-Notation und B-Methode.",
 "State precisely what must always hold, then check each step against it."),
("benacerraf", "Paul Benacerraf", "Пол Бенасерраф", "1930–2025", "Paul_Benacerraf", "one_model",
 "'What numbers could not be': the same facts admit several equally good models.", "«Чем числа быть не могут»: одни и те же факты допускают несколько равноправных моделей.", "„What Numbers Could Not Be“: gleiche Fakten, mehrere gleichwertige Modelle.",
 "If two explanations fit the facts equally well, say so instead of picking one."),
("maxwell", "Nicholas Maxwell", "Николас Максвелл", "1937–2025", "Nicholas_Maxwell", "rumour_vs_fact",
 "From Knowledge to Wisdom: inquiry should aim at helping people live well, not only at knowledge.", "«От знания к мудрости»: исследование должно помогать людям жить лучше, а не только накапливать знание.", "„From Knowledge to Wisdom“: Forschung soll helfen, gut zu leben.",
 "Ask what the person needs the answer for, not only what is true."),
("ellis", "Brian David Ellis", "Брайан Эллис", "1929–2025", "Brian_David_Ellis", "measurement_error",
 "Basic Concepts of Measurement: what makes a quantity measurable and a scale meaningful.", "«Основные понятия измерения»: что делает величину измеримой, а шкалу осмысленной.", "„Basic Concepts of Measurement“.",
 "Before comparing two numbers, check that they are on the same scale."),
("korte", "Bernhard Korte", "Бернхард Корте", "1938–2025", "Bernhard_Korte", "answer_cost",
 "Combinatorial optimisation (chip design, routing).", "Комбинаторная оптимизация (проектирование микросхем, маршрутизация).", "Kombinatorische Optimierung.",
 "Among many possible plans, search systematically for the cheapest one that meets all constraints."),
# --- 2026 год, январь–ноябрь (22.11.2026; все даты сверены с некрологами) ---
("hoare", "Tony Hoare", "Тони Хоар", "1934–2026", "Tony_Hoare", "one_model",
 "Hoare logic: prove a program correct by its preconditions and postconditions (Turing award 1980); also Quicksort and CSP.", "Логика Хоара: правильность программы доказывают через пред- и постусловия (премия Тьюринга 1980); также быстрая сортировка и CSP.", "Hoare-Logik: Korrektheit über Vor- und Nachbedingungen (Turing-Preis 1980).",
 "State what must be true before and after an answer, and check both."),
("morin", "Edgar Morin", "Эдгар Морен", "1921–2026", "Edgar_Morin", "one_model",
 "Complex thought: understanding requires linking parts and whole instead of reducing everything to one model.", "Сложное мышление: понять — значит связать части и целое, а не свести всё к одной модели.", "Komplexes Denken: Teile und Ganzes verbinden statt auf ein Modell zu reduzieren.",
 "Before explaining by one cause, list the other parts of the system that could matter."),
("smiley", "Timothy Smiley", "Тимоти Смайли", "1930–2026", "Timothy_Smiley", "one_model",
 "Multiple-conclusion logic and plural logic.", "Логика с несколькими выводами и логика множественного числа.", "Logik mit mehreren Konklusionen und Plurallogik.",
 "Sometimes the honest conclusion is 'one of these is true', not a single answer."),
("haack", "Susan Haack", "Сьюзен Хаак", "1945–2026", "Susan_Haack", "rumour_vs_fact",
 "Evidence and Inquiry: evidence works like a crossword — a claim is warranted by its own clues and by how well it fits the entries that cross it.", "«Evidence and Inquiry»: доказательства устроены как кроссворд — утверждение держится и на своих подсказках, и на том, как оно сходится с пересекающими словами.", "„Evidence and Inquiry“: Evidenz wie ein Kreuzworträtsel.",
 "Trust a claim when its own sources support it and it fits the other confirmed facts that cross it."),
("musgrave", "Alan Musgrave", "Алан Масгрейв", "1940–2026", "Alan_Musgrave", "rumour_vs_fact",
 "Scientific realism and critical rationalism against scepticism.", "Научный реализм и критический рационализм против скептицизма.", "Wissenschaftlicher Realismus und kritischer Rationalismus.",
 "Accept the best-tested explanation for now, while staying open to its refutation."),
("habermas", "Jürgen Habermas", "Юрген Хабермас", "1929–2026", "Jürgen_Habermas", "rumour_vs_fact",
 "Communicative action: a statement raises claims to truth, rightness and sincerity that can be challenged with reasons in public discourse.", "Коммуникативное действие: высказывание заявляет об истине, правильности и искренности, и это можно оспорить доводами в публичной дискуссии.", "Kommunikatives Handeln: Geltungsansprüche auf Wahrheit, Richtigkeit und Wahrhaftigkeit.",
 "Separate whether a statement is true, whether it is right and whether the speaker means it."),
("neumann", "Peter G. Neumann", "Питер Нойманн", "1932–2026", "Peter_G._Neumann", "measurement_error",
 "How computer systems fail: risks to the public in computers, collected in the RISKS Digest since 1985.", "Как ломаются компьютерные системы: риски для людей, собранные в рассылке RISKS Digest с 1985 года.", "Wie Computersysteme versagen: RISKS Digest seit 1985.",
 "Assume your own tools can fail; say which part of an answer depends on a system that could be wrong."),
("stearns", "Richard E. Stearns", "Ричард Стернс", "1936–2026", "Richard_E._Stearns", "answer_cost",
 "Foundations of computational complexity: measuring the time an algorithm needs (Turing award 1993, with Hartmanis).", "Основы теории вычислительной сложности: сколько времени требует алгоритм (премия Тьюринга 1993, вместе с Хартманисом).", "Grundlagen der Komplexitätstheorie (Turing-Preis 1993).",
 "Estimate how much work an answer needs before starting it."),
# --- 2021 год, февраль–декабрь (22.11.2026) ---
("ramsey", "James B. Ramsey", "Джеймс Рэмси", "1937–2021", "James_B._Ramsey", "one_model",
 "The Ramsey RESET test: does a regression model have the wrong functional form?", "Тест RESET Рэмси: не построена ли регрессионная модель в неправильной форме.", "Ramsey-RESET-Test: falsche funktionale Form?",
 "Check whether your explanation's shape (straight line, threshold, cycle) is right, not only its numbers."),
("van_eeden", "Constance van Eeden", "Констанс ван Эден", "1927–2021", "Constance_van_Eeden", "one_model",
 "Estimation under restricted parameter spaces and robust, distribution-free statistics.", "Оценивание при ограничениях на параметры и устойчивая статистика без заранее выбранной модели.", "Schätzung bei eingeschränkten Parametern, verteilungsfreie Statistik.",
 "Use what you know about the limits of a quantity (it cannot be negative, cannot exceed 100) when estimating it."),
("margolis", "Joseph Margolis", "Джозеф Марголис", "1924–2021", "Joseph_Margolis", "one_model",
 "Pragmatism without a single foundation: interpretation and knowledge change with history and culture.", "Прагматизм без единственного основания: толкование и знание меняются с историей и культурой.", "Pragmatismus ohne festes Fundament.",
 "Say from which tradition or context an interpretation comes."),
("boyd", "Richard Boyd", "Ричард Бойд", "1942–2021", "Richard_Boyd", "rumour_vs_fact",
 "Scientific realism: the success of mature theories is evidence that they are roughly true.", "Научный реализм: успех зрелых теорий — свидетельство того, что они примерно верны.", "Wissenschaftlicher Realismus.",
 "Give more weight to claims backed by theories that have predicted well before."),
("dunn", "J. Michael Dunn", "Майкл Данн", "1941–2021", "Jon_Michael_Dunn", "rumour_vs_fact",
 "Relevance logic and the Belnap–Dunn four-valued logic: besides true and false, information can be 'both' (contradictory sources) or 'neither' (no information).", "Логика релевантности и четырёхзначная логика Белнапа–Данна: кроме «истина» и «ложь» сведения бывают «и то и другое» (источники противоречат) или «ни то ни другое» (сведений нет).", "Relevanzlogik und vierwertige Logik nach Belnap und Dunn.",
 "When sources contradict, report 'both' with the sources instead of picking one; when there is no information, say 'neither', not 'false'."),
("blackwell", "Richard J. Blackwell", "Ричард Блэквелл", "1929–2021", "Richard_J._Blackwell", "rumour_vs_fact",
 "History of the Galileo affair: how authority and evidence collided.", "История дела Галилея: как столкнулись авторитет и доказательства.", "Geschichte des Galilei-Prozesses.",
 "Do not accept a claim only because an authority states it; ask for the evidence."),
("savitch", "Walter Savitch", "Уолтер Сэвич", "1943–2021", "Walter_Savitch", "answer_cost",
 "Savitch's theorem: how much memory a computation needs (nondeterministic space can be simulated with quadratic deterministic space).", "Теорема Сэвича: сколько памяти нужно на вычисление.", "Satz von Savitch: Speicherbedarf einer Berechnung.",
 "Keep in your context only what the next step needs."),
# --- 2020 год, январь–август и декабрь (22.11.2026; круг 2020–2026 закрыт) ---
("mellor", "Hugh Mellor", "Хью Меллор", "1938–2020", "Hugh_Mellor", "stale_data",
 "Real Time: the philosophy of time, and chances as objective probabilities.", "«Real Time»: философия времени и шансы как объективные вероятности.", "„Real Time“: Philosophie der Zeit, Chancen als objektive Wahrscheinlichkeiten.",
 "Distinguish the chance of an event from your confidence in a report about it."),
("curras", "Emilia Currás", "Эмилия Куррас", "1927–2020", "Emilia_Currás", "stale_data",
 "Foundations of information science: ontologies and thesauri that organise knowledge.", "Основы информационной науки: онтологии и тезаурусы, которые упорядочивают знание.", "Grundlagen der Informationswissenschaft: Ontologien und Thesauri.",
 "Use consistent terms for the same thing across sources before comparing them."),
("giere", "Ronald Giere", "Рональд Гир", "1938–2020", "Ronald_Giere", "one_model",
 "Scientific Perspectivism: every model sees the world from a perspective and shows only part of it.", "«Scientific Perspectivism»: каждая модель смотрит на мир с одной точки и видит только его часть.", "„Scientific Perspectivism“: jedes Modell zeigt nur einen Teil der Welt.",
 "Say from which perspective (sources, languages, regions) your picture is drawn."),
("richter", "Michael M. Richter", "Михаэль Рихтер", "1938–2020", "Michael_M._Richter", "one_model",
 "Case-based reasoning: solve a new problem from similar solved cases instead of one general model.", "Рассуждение по прецедентам: решать новую задачу по похожим решённым случаям, а не по одной общей модели.", "Fallbasiertes Schließen.",
 "Look for the most similar past case and check how far it really matches."),
("giorello", "Giulio Giorello", "Джулио Джорелло", "1945–2020", "Giulio_Giorello", "rumour_vs_fact",
 "Applied epistemology and the philosophy of science in public life.", "Прикладная эпистемология и философия науки в общественной жизни.", "Angewandte Erkenntnistheorie.",
 "Explain how a claim is known, not only what it says."),
("caws", "Peter Caws", "Питер Кос", "1931–2020", "Peter_Caws", "rumour_vs_fact",
 "Systematic philosophy of science: how theories, observations and values fit together.", "Систематическая философия науки: как сходятся теории, наблюдения и ценности.", "Systematische Wissenschaftsphilosophie.",
 "Keep observations, theory and value judgements apart in an answer."),
# --- немецкая Википедия, умершие 2020–2026 (23.11.2026); у семи нет статьи на английском ---
("freksa", "Christian Freksa", "Кристиан Фрекса", "1950–2020", "https://de.wikipedia.org/wiki/Christian_Freksa", "stale_data",
 "Qualitative reasoning about time and space from the order of events only (semi-intervals).", "Рассуждение о времени и пространстве, когда известен только порядок событий («полуинтервалы»).", "Qualitatives Schließen über Zeit und Raum aus der Reihenfolge (Semi-Intervalle).",
 "When exact times are unknown, reason from the order of events and say that you do."),
("rueger", "Bernhard Rüger", "Бернхард Рюгер", "1942–2025", "https://de.wikipedia.org/wiki/Bernhard_R%C3%BCger", "stale_data",
 "Separating trend and seasonality in time series.", "Выделение тренда и сезонности во временных рядах.", "Trend- und Saisonzerlegung von Zeitreihen.",
 "Before calling a change new, remove the usual seasonal pattern."),
("schloegl", "Christian Schlögl", "Кристиан Шлёгль", "1961–2024", "https://de.wikipedia.org/wiki/Christian_Schl%C3%B6gl", "stale_data",
 "Bibliometrics and the comparison of data sources (Web of Science versus Scopus).", "Библиометрия и сравнение источников данных (Web of Science и Scopus).", "Bibliometrie und Vergleich von Datenquellen (Web of Science, Scopus).",
 "The same count from two databases can differ; say which source you counted in."),
("bunke", "Olaf Bunke", "Олаф Бунке", "1935–2021", "https://de.wikipedia.org/wiki/Olaf_Bunke", "one_model",
 "Model choice and prediction in regression (a statistician from the GDR).", "Выбор модели и прогноз в регрессии (статистик из ГДР).", "Modellwahl und Vorhersage in der Regression (Statistiker aus der DDR).",
 "Choose a model by how well it predicts new cases, not by how well it fits the old ones."),
("kambartel", "Friedrich Kambartel", "Фридрих Камбартель", "1935–2022", "https://de.wikipedia.org/wiki/Friedrich_Kambartel", "rumour_vs_fact",
 "'Wahrheit und Begründung', 'Erfahrung und Struktur': truth and justification are different things.", "«Wahrheit und Begründung», «Erfahrung und Struktur»: истина и обоснование — разные вещи.", "„Wahrheit und Begründung“, „Erfahrung und Struktur“.",
 "Say separately whether a claim is well justified and whether it is true."),
("laitko", "Hubert Laitko", "Хуберт Лайтко", "1935–2024", "https://de.wikipedia.org/wiki/Hubert_Laitko", "rumour_vs_fact",
 "Methodology of scientific knowledge ('Wege des Erkennens').", "Методология научного познания («Wege des Erkennens»).", "Methodologie wissenschaftlicher Erkenntnis („Wege des Erkennens“).",
 "Describe the path by which a fact was found, not only the fact."),
("lahuti", "Delir Lahuti", "Делир Лахути", "1934–2022", "https://de.wikipedia.org/wiki/Delir_Lahuti", "rumour_vs_fact",
 "Evaluation of information retrieval systems (VINITI, Moscow).", "Оценка информационно-поисковых систем (ВИНИТИ, Москва).", "Bewertung von Informationsrecherchesystemen (WINITI, Moskau).",
 "A search result is a sample chosen by a system; ask what the system leaves out."),
("rinne", "Horst Rinne", "Хорст Ринне", "1939–2023", "https://de.wikipedia.org/wiki/Horst_Rinne", "measurement_error",
 "How inaccurate national accounts are, and how the reliability of data shows in its later revisions.", "Насколько неточно считают национальный продукт и как надёжность данных видна по их пересмотрам.", "Genauigkeit der Volkswirtschaftlichen Gesamtrechnung und Revisionen als Maß der Verlässlichkeit.",
 "Treat a first release of a statistic as provisional; say whether the number has been revised."),
("woeginger", "Gerhard Woeginger", "Герхард Вёгингер", "1964–2022", "https://de.wikipedia.org/wiki/Gerhard_Woeginger", "answer_cost",
 "Approximation and exact exponential algorithms for NP-hard problems.", "Приближённые и точные экспоненциальные алгоритмы для NP-трудных задач.", "Approximations- und exakte Exponentialalgorithmen für NP-schwere Probleme.",
 "For a hard question, a good approximate answer now can beat an exact one never; say which you give."),
("schnorr", "Claus Peter Schnorr", "Клаус Петер Шнорр", "1943–2025", "https://de.wikipedia.org/wiki/Claus_Peter_Schnorr", "answer_cost",
 "Complexity theory, algorithmic randomness and the Schnorr signature.", "Теория сложности, алгоритмическая случайность и подпись Шнорра.", "Komplexitätstheorie, algorithmischer Zufall, Schnorr-Signatur.",
 "Something that looks random may still have a pattern; test before assuming noise."),
# --- французская и польская Википедия, умершие 2020–2026 (23.11.2026); даты 2025–2026 сверены с некрологами ---
("trzesicki", "Kazimierz Trzęsicki", "Казимеж Тшенсицкий", "1947–2025", "https://pl.wikipedia.org/wiki/Kazimierz_Trz%C4%99sicki", "stale_data",
 "Tense logic and the question of determinism: are statements about the future already true or false?", "Логика грамматических времён и вопрос о детерминизме: истинны ли уже высказывания о будущем?", "Zeitlogik und Determinismus: sind Aussagen über die Zukunft schon wahr?",
 "Do not report a statement about the future as already true; keep its tense."),
("domanski", "Czesław Domański", "Чеслав Доманьский", "1943–2026", "https://pl.wikipedia.org/wiki/Czes%C5%82aw_Doma%C5%84ski", "one_model",
 "Founder of the Łódź school of nonparametric statistics: conclusions without a model chosen in advance.", "Основатель лодзинской школы непараметрической статистики: выводы без заранее выбранной модели.", "Begründer der Lodzer Schule der nichtparametrischen Statistik.",
 "When you do not know the shape of the data, use methods that do not assume one."),
("dowek", "Gilles Dowek", "Жиль Довек", "1966–2025", "https://fr.wikipedia.org/wiki/Gilles_Dowek", "one_model",
 "Formal proof checking and the logical framework Dedukti, which lets proofs from different systems be checked together.", "Формальная проверка доказательств и система Dedukti, в которой можно сверять доказательства из разных систем.", "Formale Beweisprüfung und das Logik-Framework Dedukti.",
 "Make your reasoning checkable step by step, so that another system could verify it."),
("vaduva", "Ion Văduva", "Ион Вэдува", "1936–2023", "https://fr.wikipedia.org/wiki/Ion_V%C4%83duva", "one_model",
 "Computer simulation and the estimation of distributions (Romanian school of probability).", "Компьютерное моделирование и оценка распределений (румынская школа теории вероятностей).", "Computersimulation und Schätzung von Verteilungen.",
 "Check a simulated result against the real data it is meant to imitate."),
("michel_meyer", "Michel Meyer", "Мишель Мейер", "1950–2022", "https://fr.wikipedia.org/wiki/Michel_Meyer_(philosophe)", "rumour_vs_fact",
 "'Découverte et justification en science' and problematology: thinking starts from questions; how a claim was found is not how it is justified.", "«Découverte et justification en science» и проблематология: мысль начинается с вопроса; как утверждение нашли — не то же, что его обоснование.", "„Découverte et justification en science“ und Problematologie.",
 "Say which question a claim answers, and keep how it was found apart from why it holds."),
("lecourt", "Dominique Lecourt", "Доминик Лекур", "1944–2022", "https://fr.wikipedia.org/wiki/Dominique_Lecourt", "rumour_vs_fact",
 "The Lysenko affair: how ideology presented itself as science.", "Дело Лысенко: как идеология выдавала себя за науку.", "Die Lyssenko-Affäre: wie Ideologie sich als Wissenschaft ausgab.",
 "Be wary when a scientific claim is backed mainly by political authority."),
("chajda", "Jan Chajda", "Ян Хайда", "1939–2022", "https://pl.wikipedia.org/wiki/Jan_Chajda", "measurement_error",
 "Technical metrology and measuring systems.", "Техническая метрология и измерительные системы.", "Technische Messtechnik und Messsysteme.",
 "Every measurement has an instrument and an uncertainty; name both."),
("ogryczak", "Włodzimierz Ogryczak", "Влодзимеж Огрычак", "1951–2020", "https://pl.wikipedia.org/wiki/W%C5%82odzimierz_Ogryczak", "answer_cost",
 "Multiple-criteria optimisation and decision support, including fair (equitable) solutions.", "Оптимизация по нескольким критериям и поддержка решений, в том числе справедливые решения.", "Mehrkriterielle Optimierung und Entscheidungsunterstützung.",
 "When goals conflict, show the trade-off instead of hiding it in one score."),
("vuillemin", "Jean Vuillemin", "Жан Вюйемен", "1947–2026", "https://fr.wikipedia.org/wiki/Jean_Vuillemin", "answer_cost",
 "With Rivest, a lower bound on how many queries an algorithm needs to test a graph property (Aanderaa–Karp–Rosenberg conjecture); binomial heaps.", "Вместе с Ривестом — нижняя граница числа запросов, нужных алгоритму, чтобы проверить свойство графа; биномиальные кучи.", "Mit Rivest: untere Schranke für Anfragen beim Testen von Grapheigenschaften.",
 "Some questions cannot be answered without looking at most of the data; recognise them before sampling."),
# --- итальянская и испанская Википедия, умершие 2020–2026 (23.11.2026); даты 2025–2026 сверены с некрологами ---
("galves", "Antonio Galves", "Антонио Галвес", "1947–2023", "Antonio_Galves", "stale_data",
 "Stochastic chains with memory of variable length: models that decide for themselves how far into the past to look.", "Случайные процессы с памятью переменной длины: модели сами решают, насколько далеко в прошлое смотреть.", "Stochastische Ketten mit variabler Gedächtnislänge.",
 "Use as much of the past as actually helps, no more and no less, and say how far back you looked."),
("da_costa", "Newton da Costa", "Ньютон да Коста", "1929–2024", "https://es.wikipedia.org/wiki/Newton_da_Costa", "one_model",
 "Paraconsistent logic and 'Science and Partial Truth': reasoning can stay sound with contradictory information, and theories can be partly true.", "Паранепротиворечивая логика и «Science and Partial Truth»: можно здраво рассуждать при противоречивых данных, а теории бывают частично истинны.", "Parakonsistente Logik und „Science and Partial Truth“.",
 "When sources contradict, do not conclude anything at all from the contradiction; mark the point as contested and reason around it."),
("lolli", "Gabriele Lolli", "Габриэле Лолли", "1942–2025", "https://it.wikipedia.org/wiki/Gabriele_Lolli", "one_model",
 "Foundations of mathematics; a view of science beyond realism and relativism.", "Основания математики; взгляд на науку за пределами реализма и релятивизма.", "Grundlagen der Mathematik; Wissenschaft jenseits von Realismus und Relativismus.",
 "Avoid both 'the model is reality' and 'every view is equally valid'."),
("parrini", "Paolo Parrini", "Паоло Паррини", "1943–2020", "https://it.wikipedia.org/wiki/Paolo_Parrini", "rumour_vs_fact",
 "Epistemology without dogmas ('Una filosofia senza dogmi', 'Conoscenza e realtà').", "Эпистемология без догм («Una filosofia senza dogmi», «Conoscenza e realtà»).", "Erkenntnistheorie ohne Dogmen.",
 "Hold no source as beyond question, including the ones you usually trust."),
("torretti", "Roberto Torretti", "Роберто Торретти", "1930–2022", "https://es.wikipedia.org/wiki/Roberto_Torretti", "rumour_vs_fact",
 "Philosophy of science and the Dictionary of Logic and Philosophy of Science.", "Философия науки и «Словарь логики и философии науки».", "Wissenschaftsphilosophie und Wörterbuch der Logik.",
 "Define your key terms before you argue with them."),
("alsina", "Claudi Alsina", "Клауди Алсина", "1952–2025", "https://es.wikipedia.org/wiki/Claudi_Alsina_Catal%C3%A0", "measurement_error",
 "Functional equations, fuzzy logic and the mathematics of measurement; popularisation of mathematics.", "Функциональные уравнения, нечёткая логика и математика измерений; популяризация математики.", "Funktionalgleichungen, Fuzzy-Logik und Mathematik des Messens.",
 "Some quantities are a matter of degree; give the degree instead of forcing yes or no."),
("perez_jimenez", "Mario de Jesús Pérez Jiménez", "Марио Перес Хименес", "1948–2025", "https://es.wikipedia.org/wiki/Mario_de_Jes%C3%BAs_P%C3%A9rez_Jim%C3%A9nez", "answer_cost",
 "Membrane computing (P systems); founder of the Natural Computing group in Seville.", "Мембранные вычисления (P-системы); основатель группы естественных вычислений в Севилье.", "Membranrechnen (P-Systeme), Gruppe Natural Computing in Sevilla.",
 "Many small parallel checks can be cheaper than one large sequential one."),
("gambarelli", "Gianfranco Gambarelli", "Джанфранко Гамбарелли", "1946–2026", "https://it.wikipedia.org/wiki/Gianfranco_Gambarelli", "side_effects",
 "Game theory and decision methods (power indices, friend of John Nash).", "Теория игр и методы принятия решений (индексы силы; друг Джона Нэша).", "Spieltheorie und Entscheidungsmethoden (Machtindizes).",
 "When several actors decide, weigh who can actually tip the outcome."),
# --- китайская, арабская, персидская, турецкая Википедия, умершие 2020–2026 (23.11.2026) ---
("elmasri", "Ramez Elmasri", "Рамез Эльмасри", "1950–2022", "https://ar.wikipedia.org/wiki/%D8%B1%D8%A7%D9%85%D8%B2_%D8%A7%D9%84%D9%85%D8%B5%D8%B1%D9%8A", "stale_data",
 "Database systems ('Fundamentals of Database Systems') and temporal databases that keep several versions of the data at once.", "Системы баз данных («Fundamentals of Database Systems») и временные базы, где одновременно хранятся несколько версий данных.", "Datenbanksysteme und temporale Datenbanken mit mehreren Datenversionen.",
 "Keep the version and time of the data you quote; yesterday's record and today's may both be 'the record'."),
("wang_peizhuang", "Wang Peizhuang", "Ван Пэйчжуан", "1936–2025", "https://zh.wikipedia.org/wiki/%E6%B1%AA%E5%9F%B9%E5%BA%84", "one_model",
 "Fuzzy mathematics in China: working with concepts that have no sharp boundaries.", "Нечёткая математика в Китае: как работать с понятиями без чётких границ.", "Fuzzy-Mathematik in China: Begriffe ohne scharfe Grenzen.",
 "Some categories have no sharp edge; say how strongly something belongs, not only whether it does."),
("al_hasadi", "Najib al-Hasadi", "Наджиб аль-Хасади", "1952–2025", "https://ar.wikipedia.org/wiki/%D9%86%D8%AC%D9%8A%D8%A8_%D8%A7%D9%84%D8%AD%D8%B5%D8%A7%D8%AF%D9%8A", "rumour_vs_fact",
 "Libyan philosopher of critical thinking: 'Doubting the sanctity of science', 'The book of fallacies', 'Sensors of critical thinking'.", "Ливийский философ критического мышления: «Сомнение в святости науки», «Книга заблуждений», «Датчики критического мышления».", "Libyscher Philosoph des kritischen Denkens.",
 "Question even the claims that come wrapped in the authority of science, and name the fallacy when you see one."),
("ning_jinsheng", "Ning Jinsheng", "Нин Цзиньшэн", "1932–2020", "https://zh.wikipedia.org/wiki/%E5%AE%81%E6%B4%A5%E7%94%9F", "measurement_error",
 "Geodesy: precise measurement of the Earth and its reference frames.", "Геодезия: точные измерения Земли и её систем отсчёта.", "Geodäsie: präzise Vermessung der Erde und ihrer Bezugssysteme.",
 "A position or a number means nothing without its reference frame; state it."),
# --- 2018–2019, 11 языков (23.11.2026; рамка расширена пользователем); Симпсон получил датчик ---
("rosenblatt", "Murray Rosenblatt", "Мюррей Розенблатт", "1926–2019", "Murray_Rosenblatt", "stale_data",
 "Time-series analysis, spectral estimation and kernel density estimation.", "Анализ временных рядов, спектральные оценки и ядерные оценки плотности.", "Zeitreihenanalyse, Spektral- und Kerndichteschätzung.",
 "Look for regular cycles in a series before treating a swing as news."),
("benzecri", "Jean-Paul Benzécri", "Жан-Поль Бензекри", "1932–2019", "https://fr.wikipedia.org/wiki/Jean-Paul_Benz%C3%A9cri", "one_model",
 "Data analysis 'from the data, not from the model': correspondence analysis.", "Анализ данных «от данных, а не от модели»: корреспондентный анализ.", "Datenanalyse „aus den Daten, nicht aus dem Modell“: Korrespondenzanalyse.",
 "Let the data show its structure before you impose a model on it."),
("gruenbaum", "Adolf Grünbaum", "Адольф Грюнбаум", "1923–2018", "Adolf_Gr%C3%BCnbaum", "rumour_vs_fact",
 "Critique of psychoanalysis and of Popper: what makes a theory actually testable.", "Критика психоанализа и Поппера: что делает теорию действительно проверяемой.", "Kritik der Psychoanalyse und Poppers: was eine Theorie prüfbar macht.",
 "Ask what observation would count against a claim; if none would, it is not being tested."),
("gayon", "Jean Gayon", "Жан Гайон", "1949–2018", "https://fr.wikipedia.org/wiki/Jean_Gayon", "rumour_vs_fact",
 "History and philosophy of science, especially of biology and heredity.", "История и философия науки, особенно биологии и наследственности.", "Geschichte und Philosophie der Wissenschaft, besonders der Biologie.",
 "Know the history of a scientific claim: how it was disputed and how it settled."),
("casari", "Ettore Casari", "Этторе Казари", "1933–2019", "https://it.wikipedia.org/wiki/Ettore_Casari", "rumour_vs_fact",
 "'La matematica della verità': logic and the mathematics of truth.", "«La matematica della verità»: логика и математика истины.", "„La matematica della verità“: Logik und Mathematik der Wahrheit.",
 "Keep 'true' for what is shown, and 'plausible' for what only seems so."),
("wuketits", "Franz M. Wuketits", "Франц Вукетиц", "1955–2018", "Franz_M._Wuketits", "rumour_vs_fact",
 "Evolutionary epistemology: our ways of knowing were shaped by evolution and carry its biases.", "Эволюционная эпистемология: наши способы познания сформированы эволюцией и несут её искажения.", "Evolutionäre Erkenntnistheorie.",
 "Expect your intuitions to favour vivid and threatening stories; correct for it."),
("turzeniecka", "Danuta Turzeniecka", "Данута Туженецка", "1931–2018", "https://pl.wikipedia.org/wiki/Danuta_Turzeniecka", "measurement_error",
 "Metrology and the evaluation of measurement uncertainty.", "Метрология и оценка неопределённости измерений.", "Messtechnik und Bewertung der Messunsicherheit.",
 "Report a measurement with its uncertainty, or do not compare it."),
("altman", "Doug Altman", "Дуг Альтман", "1948–2018", "Doug_Altman", "measurement_error",
 "Reliability of statistics in research and reporting standards; 'absence of evidence is not evidence of absence'.", "Надёжность статистики в исследованиях и стандарты отчётности; «отсутствие доказательств — не доказательство отсутствия».", "Verlässlichkeit von Statistik in der Forschung.",
 "'No evidence found' is not 'shown not to exist'; say which one you have."),
("lawrence_brown", "Lawrence D. Brown", "Лоуренс Браун", "1940–2018", "Lawrence_D._Brown", "answer_cost",
 "Statistical decision theory and minimax rules: choose the action whose worst case is least bad.", "Статистическая теория решений и минимакс: выбирать действие с наименее плохим худшим случаем.", "Statistische Entscheidungstheorie und Minimax.",
 "When the cost of being wrong is high, pick the answer whose worst case you can live with."),
# --- русская Википедия, 2018–2019 (23.11.2026) ---
('kalinichenko', 'Leonid Kalinichenko', 'Леонид Калиниченко', '1937–2018', 'https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D0%BB%D0%B8%D0%BD%D0%B8%D1%87%D0%B5%D0%BD%D0%BA%D0%BE%2C_%D0%9B%D0%B5%D0%BE%D0%BD%D0%B8%D0%B4_%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2%D0%B8%D1%87', 'stale_data',
 'Integration of heterogeneous databases: bringing different sources to one consistent picture.', 'Как сводить вместе разнородные базы данных в одну согласованную картину.', 'Integration heterogener Datenbanken.',
 'Before merging data from two sources, align their definitions, units and times.'),
('basharin', 'Gely Basharin', 'Гелий Башарин', '1927–2018', 'https://ru.wikipedia.org/wiki/%D0%91%D0%B0%D1%88%D0%B0%D1%80%D0%B8%D0%BD%2C_%D0%93%D0%B5%D0%BB%D0%B8%D0%B9_%D0%9F%D0%B0%D0%B2%D0%BB%D0%BE%D0%B2%D0%B8%D1%87', 'stale_data',
 'Queueing theory and delays in telecommunication networks.', 'Теория очередей и задержек в сетях связи.', 'Warteschlangen und Verzögerungen in Netzen.',
 'Every relay in a chain adds delay; estimate how old the news is by the time it reaches you.'),
('pospelov', 'Dmitry Pospelov', 'Дмитрий Поспелов', '1932–2019', 'https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D1%81%D0%BF%D0%B5%D0%BB%D0%BE%D0%B2%2C_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80%D0%BE%D0%B2%D0%B8%D1%87', 'one_model',
 'One of the founders of Soviet artificial intelligence: situational control and fuzzy systems — act on the recognised situation, not on one fixed model.', 'Один из отцов советского искусственного интеллекта: ситуационное управление и нечёткие системы — действовать по распознанной ситуации, а не по одной жёсткой модели.', 'Mitbegründer der sowjetischen KI: situative Steuerung und Fuzzy-Systeme.',
 'First classify the situation you are in, then choose the rule that fits it.'),
('palyutin', 'Evgeny Palyutin', 'Евгений Палютин', '1945–2018', 'https://ru.wikipedia.org/wiki/%D0%9F%D0%B0%D0%BB%D1%8E%D1%82%D0%B8%D0%BD%2C_%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2%D0%B8%D1%87', 'one_model',
 'Model theory: the same axioms can have many different models.', 'Теория моделей: у одних и тех же аксиом бывает много разных моделей.', 'Modelltheorie: dieselben Axiome haben viele Modelle.',
 'The same description can fit several different situations; check which one you face.'),
('minlos', 'Robert Minlos', 'Роберт Минлос', '1931–2018', 'https://ru.wikipedia.org/wiki/%D0%9C%D0%B8%D0%BD%D0%BB%D0%BE%D1%81%2C_%D0%A0%D0%BE%D0%B1%D0%B5%D1%80%D1%82_%D0%90%D0%B4%D0%BE%D0%BB%D1%8C%D1%84%D0%BE%D0%B2%D0%B8%D1%87', 'one_model',
 'Statistical physics and random fields: global order arising from many local random interactions.', 'Статистическая физика и случайные поля: общий порядок из множества местных случайных взаимодействий.', 'Statistische Physik und Zufallsfelder.',
 'A pattern across many sources can arise from local noise; check it before calling it a trend.'),
('stepin', 'Vyacheslav Stepin', 'Вячеслав Стёпин', '1934–2018', 'https://ru.wikipedia.org/wiki/%D0%A1%D1%82%D1%91%D0%BF%D0%B8%D0%BD%2C_%D0%92%D1%8F%D1%87%D0%B5%D1%81%D0%BB%D0%B0%D0%B2_%D0%A1%D0%B5%D0%BC%D1%91%D0%BD%D0%BE%D0%B2%D0%B8%D1%87', 'rumour_vs_fact',
 'The structure of a scientific theory and types of scientific rationality (classical, non-classical, post-non-classical).', 'Как устроена научная теория и какие бывают типы научной рациональности (классический, неклассический, постнеклассический).', 'Struktur wissenschaftlicher Theorien und Typen der Rationalität.',
 'Say which kind of evidence a claim rests on: observation, theory or expert consensus.'),
('ivin', 'Alexander Ivin', 'Александр Ивин', '1939–2018', 'https://ru.wikipedia.org/wiki/%D0%98%D0%B2%D0%B8%D0%BD%2C_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80_%D0%90%D1%80%D1%85%D0%B8%D0%BF%D0%BE%D0%B2%D0%B8%D1%87', 'rumour_vs_fact',
 "Theory of argumentation and the logic of evaluations: an evaluation ('good', 'bad') is not a statement of fact.", 'Теория аргументации и логика оценок: оценка («хорошо», «плохо») — не утверждение о факте.', 'Argumentationstheorie und Logik der Bewertungen.',
 'Separate the facts in a headline from the evaluation wrapped around them.'),
('rakitov', 'Anatoly Rakitov', 'Анатолий Ракитов', '1928–2019', 'https://ru.wikipedia.org/wiki/%D0%A0%D0%B0%D0%BA%D0%B8%D1%82%D0%BE%D0%B2%2C_%D0%90%D0%BD%D0%B0%D1%82%D0%BE%D0%BB%D0%B8%D0%B9_%D0%98%D0%BB%D1%8C%D0%B8%D1%87', 'rumour_vs_fact',
 'Information epistemology: knowledge in a society where information is produced and traded at scale.', '«Информационная эпистемология»: знание в обществе, где информацию производят и продают в огромных объёмах.', 'Informationelle Erkenntnistheorie.',
 'More information is not more knowledge; ask what a source adds that others do not.'),
('popovich', 'Myroslav Popovych', 'Мирослав Попович', '1930–2018', 'https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BF%D0%BE%D0%B2%D0%B8%D1%87%2C_%D0%9C%D0%B8%D1%80%D0%BE%D1%81%D0%BB%D0%B0%D0%B2_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B8%D1%87', 'rumour_vs_fact',
 'Logic and methodology of science (Kyiv school).', 'Логика и методология науки (киевская школа).', 'Logik und Methodologie der Wissenschaft (Kiewer Schule).',
 'State the method by which a conclusion was reached.'),
('kovalenko', 'Igor Kovalenko', 'Игорь Коваленко', '1935–2019', 'https://ru.wikipedia.org/wiki/%D0%9A%D0%BE%D0%B2%D0%B0%D0%BB%D0%B5%D0%BD%D0%BA%D0%BE%2C_%D0%98%D0%B3%D0%BE%D1%80%D1%8C_%D0%9D%D0%B8%D0%BA%D0%BE%D0%BB%D0%B0%D0%B5%D0%B2%D0%B8%D1%87', 'measurement_error',
 'Reliability theory and the analysis of rare events.', 'Теория надёжности и анализ редких событий.', 'Zuverlässigkeitstheorie und seltene Ereignisse.',
 'A rare event that has not happened in your data is not impossible; say how much data you have.'),
('golshtein', 'Evgeny Golshtein', 'Евгений Гольштейн', '1931–2018', 'https://ru.wikipedia.org/wiki/%D0%93%D0%BE%D0%BB%D1%8C%D1%88%D1%82%D0%B5%D0%B9%D0%BD%2C_%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B8%D1%87', 'answer_cost',
 'Mathematical programming and duality theory.', 'Математическое программирование и теория двойственности.', 'Mathematische Programmierung und Dualitätstheorie.',
 'Every limit you work under has a price; ask what relaxing it would gain.'),
('uspensky', 'Vladimir Uspensky', 'Владимир Успенский', '1930–2018', 'https://ru.wikipedia.org/wiki/%D0%A3%D1%81%D0%BF%D0%B5%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%2C_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B5%D0%B2%D0%B8%D1%87', 'answer_cost',
 'Theory of algorithms and Kolmogorov complexity (a student of Kolmogorov).', 'Теория алгоритмов и колмогоровская сложность (ученик Колмогорова).', 'Algorithmentheorie und Kolmogorow-Komplexität.',
 'The shortest faithful description is usually the best answer.'),
('boltyansky', 'Vladimir Boltyansky', 'Владимир Болтянский', '1925–2019', 'https://ru.wikipedia.org/wiki/%D0%91%D0%BE%D0%BB%D1%82%D1%8F%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%2C_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%93%D1%80%D0%B8%D0%B3%D0%BE%D1%80%D1%8C%D0%B5%D0%B2%D0%B8%D1%87', 'answer_cost',
 'Co-author of the maximum principle of optimal control (with Pontryagin, Gamkrelidze, Mishchenko).', 'Соавтор принципа максимума в теории оптимального управления (с Понтрягиным, Гамкрелидзе, Мищенко).', 'Mitautor des Maximumprinzips der optimalen Steuerung.',
 'Choose each step by its effect on the whole path to the goal.'),
# --- немецкая Википедия, 2018–2019 (23.11.2026) ---
('raessler', 'Susanne Rässler', 'Сюзанне Ресслер', '1962–2018', 'https://de.wikipedia.org/wiki/Susanne_R%C3%A4ssler', 'stale_data',
 'Statistical matching and multiple imputation: filling gaps in data and combining different sources honestly.', 'Статистическое сопоставление и множественное заполнение пропусков: честно сводить разные источники и заполнять пробелы.', 'Statistisches Matching und multiple Imputation.',
 'When you fill a gap in the data, say that it was filled and how uncertain the filled value is.'),
('manna', 'Zohar Manna', 'Зохар Манна', '1939–2018', 'https://de.wikipedia.org/wiki/Zohar_Manna', 'stale_data',
 'Temporal logic and verification of systems that change over time (with Amir Pnueli).', 'Временная логика и проверка систем, которые меняются во времени (вместе с Амиром Пнуэли).', 'Temporallogik und Verifikation zeitabhängiger Systeme.',
 'A statement that was true at one step may be false at the next; check it at the step you report.'),
('bucy', 'Richard S. Bucy', 'Ричард Бьюси', '1935–2019', 'https://de.wikipedia.org/wiki/Richard_S._Bucy', 'stale_data',
 'The Kalman–Bucy filter: updating an estimate continuously from fresh noisy measurements.', 'Фильтр Калмана–Бьюси: как непрерывно обновлять оценку по свежим шумным измерениям.', 'Kalman-Bucy-Filter.',
 'Blend each new noisy reading with your current estimate in proportion to how reliable each is.'),
('hampel', 'Frank Hampel', 'Франк Хампель', '1941–2018', 'https://de.wikipedia.org/wiki/Frank_Hampel', 'one_model',
 'Robust statistics and the influence function: how much a single outlier or a wrong model can move a conclusion.', 'Робастная статистика и функция влияния: насколько один выброс или неверная модель могут сдвинуть вывод.', 'Robuste Statistik und Einflussfunktion.',
 'Check how far your conclusion moves if you drop the single most extreme data point.'),
('troelstra', 'Anne Troelstra', 'Анне Трулстра', '1939–2019', 'https://de.wikipedia.org/wiki/Anne_Troelstra', 'one_model',
 'Intuitionistic logic: a claim counts as true only when it is constructed or proven, not just because its opposite was not proven.', 'Интуиционистская логика: утверждение считается верным, только когда оно построено или доказано, а не потому, что не доказано обратное.', 'Intuitionistische Logik.',
 "'Not disproved' is not 'proved'; keep a third answer: not settled."),
('hoering', 'Walter Hoering', 'Вальтер Хёринг', '1933–2019', 'https://de.wikipedia.org/wiki/Walter_Hoering', 'rumour_vs_fact',
 'Logic and philosophy of science.', 'Логика и теория науки.', 'Logik und Wissenschaftstheorie.',
 'Show the logical step from the evidence to the claim.'),
('detlefsen', 'Michael Detlefsen', 'Майкл Детлефсен', '1948–2019', 'https://de.wikipedia.org/wiki/Michael_Detlefsen', 'rumour_vs_fact',
 'Philosophy of mathematics: what a proof actually establishes and for whom.', 'Философия математики: что именно устанавливает доказательство и для кого.', 'Philosophie der Mathematik.',
 'Say what your argument proves and what it leaves open.'),
('harre', 'Rom Harré', 'Ром Харре', '1927–2019', 'https://de.wikipedia.org/wiki/Rom_Harr%C3%A9', 'rumour_vs_fact',
 'Philosophy of science: explanation by real causal powers and mechanisms, not only by regularities.', 'Теория науки: объяснение через реальные причинные силы и механизмы, а не только через закономерности.', 'Wissenschaftstheorie: Erklärung durch Kausalkräfte.',
 'A regular pattern is not yet an explanation; name the mechanism or say it is unknown.'),
('pfanzagl', 'Johann Pfanzagl', 'Иоганн Пфанцагль', '1928–2019', 'https://de.wikipedia.org/wiki/Johann_Pfanzagl', 'measurement_error',
 "'Theory of Measurement': when numbers assigned to things are meaningful, and which operations on them make sense.", '«Theory of Measurement»: когда числа, присвоенные вещам, имеют смысл и какие действия с ними допустимы.', '„Theory of Measurement“.',
 "Do only the arithmetic the scale allows: an index of 60 is not 'twice as' 30."),
('busch', 'Paul Busch', 'Пауль Буш', '1955–2018', 'https://de.wikipedia.org/wiki/Paul_Busch_(Physiker)', 'measurement_error',
 'Quantum theory of measurement: a measurement can disturb what it measures.', 'Квантовая теория измерения: измерение может возмущать то, что оно меряет.', 'Quantentheorie der Messung.',
 'Ask whether watching or reporting a thing changes it (a published index can move the market it describes).'),
('winograd', 'Shmuel Winograd', 'Шмуэль Виноград', '1936–2019', 'https://de.wikipedia.org/wiki/Shmuel_Winograd', 'answer_cost',
 "Complexity of computation: the minimum number of operations a task needs (Winograd's algorithms for fast multiplication and FFT).", 'Сложность вычислений: наименьшее число операций для задачи (алгоритмы Винограда для быстрого умножения и БПФ).', 'Komplexität: minimale Operationszahl (Winograd-Algorithmen).',
 'Find the fewest steps that still answer the question fully.'),
('guddat', 'Jürgen Guddat', 'Юрген Гуддат', '1941–2018', 'https://de.wikipedia.org/wiki/J%C3%BCrgen_Guddat', 'answer_cost',
 'Parametric optimisation: how the best solution changes when the conditions change.', 'Параметрическая оптимизация: как меняется лучшее решение, когда меняются условия.', 'Parametrische Optimierung.',
 'Say under which conditions your recommendation would change.'),
('skala', 'Heinz J. Skala', 'Хайнц Скала', '1942–2019', 'https://de.wikipedia.org/wiki/Heinz_J._Skala', 'answer_cost',
 'Decision theory under uncertainty.', 'Теория решений в условиях неопределённости.', 'Entscheidungstheorie unter Unsicherheit.',
 'Separate what you know, what you estimate and what you simply do not know.'),
# --- русская Википедия, 2015–2017 (23.11.2026) ---
('kalman', 'Rudolf E. Kálmán', 'Рудольф Калман', '1930–2016', 'https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D0%BB%D1%8C%D0%BC%D0%B0%D0%BD%2C_%D0%A0%D1%83%D0%B4%D0%BE%D0%BB%D1%8C%D1%84', 'stale_data',
 'The Kalman filter: update an estimate with each new measurement, weighting it by how noisy it is.', 'Фильтр Калмана: обновлять оценку с каждым новым измерением, взвешивая его по тому, насколько оно шумное.', 'Kalman-Filter: Schätzung mit jeder neuen Messung aktualisieren, gewichtet nach ihrem Rauschen.',
 'Do not replace your estimate with the latest noisy reading, and do not ignore it: blend them by reliability.'),
('forrester', 'Jay W. Forrester', 'Джей Форрестер', '1918–2016', 'https://ru.wikipedia.org/wiki/%D0%A4%D0%BE%D1%80%D1%80%D0%B5%D1%81%D1%82%D0%B5%D1%80%2C_%D0%94%D0%B6%D0%B5%D0%B9', 'stale_data',
 'System dynamics: delays and feedback loops make the picture in the head lag behind the real state of the system.', 'Системная динамика: задержки и обратные связи заставляют картину в голове отставать от реального состояния системы.', 'Systemdynamik: Verzögerungen und Rückkopplungen lassen das Bild im Kopf dem echten Zustand hinterherhinken.',
 'Say how old your picture of the system is and which delays sit between the event and your data.'),
('zadeh', 'Lotfi A. Zadeh', 'Лотфи Заде', '1921–2017', 'https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%B4%D0%B5%2C_%D0%9B%D0%BE%D1%82%D1%84%D0%B8', 'one_model',
 'Fuzzy logic: membership comes in degrees, not only yes or no.', 'Нечёткая логика: принадлежность бывает по степеням, а не только «да» или «нет».', 'Fuzzy-Logik: Zugehörigkeit hat Grade, nicht nur ja oder nein.',
 "Keep the degree: 'tense at 0.55' is not the same as 'tense'."),
('karpenko', 'Alexander S. Karpenko', 'Александр Карпенко', '1946–2017', 'https://ru.wikipedia.org/wiki/%D0%9A%D0%B0%D1%80%D0%BF%D0%B5%D0%BD%D0%BA%D0%BE%2C_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80_%D0%A1%D1%82%D0%B5%D0%BF%D0%B0%D0%BD%D0%BE%D0%B2%D0%B8%D1%87', 'one_model',
 'Many-valued logics: true and false are not the only possible values of a statement.', 'Многозначные логики: «истина» и «ложь» — не единственные возможные значения утверждения.', 'Mehrwertige Logiken: wahr und falsch sind nicht die einzigen Werte einer Aussage.',
 'Allow more than two answers: true, false, contested, unknown.'),
('bershtein', 'Leonid S. Bershtein', 'Леонид Берштейн', '1941–2015', 'https://ru.wikipedia.org/wiki/%D0%91%D0%B5%D1%80%D1%88%D1%82%D0%B5%D0%B9%D0%BD%2C_%D0%9B%D0%B5%D0%BE%D0%BD%D0%B8%D0%B4_%D0%A1%D0%B0%D0%BC%D0%BE%D0%B9%D0%BB%D0%BE%D0%B2%D0%B8%D1%87', 'one_model',
 'Intelligent systems that decide with incomplete and fuzzy data.', 'Интеллектуальные системы, которые принимают решения при неполных и нечётких данных.', 'Intelligente Systeme, die mit unvollständigen und unscharfen Daten entscheiden.',
 'When data are incomplete, say which part is missing and decide only as far as the rest allows.'),
('hintikka', 'Jaakko Hintikka', 'Яакко Хинтикка', '1929–2015', 'https://ru.wikipedia.org/wiki/%D0%A5%D0%B8%D0%BD%D1%82%D0%B8%D0%BA%D0%BA%D0%B0%2C_%D0%AF%D0%B0%D0%BA%D0%BA%D0%BE', 'own_limits',
 "Epistemic logic: 'knows that' and 'believes that' are different; inquiry as asking the right questions.", 'Эпистемическая логика: «знает, что» и «считает, что» — разные вещи; поиск как задавание правильных вопросов.', 'Epistemische Logik: „weiß, dass“ und „glaubt, dass“ sind verschieden; Forschung als Stellen der richtigen Fragen.',
 'Mark whether you know a thing or only believe it, and which question would turn belief into knowledge.'),
('voevodsky', 'Vladimir Voevodsky', 'Владимир Воеводский', '1966–2017', 'https://ru.wikipedia.org/wiki/%D0%92%D0%BE%D0%B5%D0%B2%D0%BE%D0%B4%D1%81%D0%BA%D0%B8%D0%B9%2C_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80%D0%BE%D0%B2%D0%B8%D1%87', 'rumour_vs_fact',
 "Univalent foundations: proofs checked by a computer, because even experts' proofs contain unnoticed errors.", 'Унивалентные основания: доказательства, которые проверяет компьютер, потому что и в доказательствах экспертов бывают незамеченные ошибки.', 'Univalente Grundlagen: computergeprüfte Beweise, weil auch Beweise von Fachleuten unbemerkte Fehler enthalten.',
 'Do not trust an argument because of who made it; check it mechanically where you can.'),
('pushkin', 'Sergey B. Pushkin', 'Сергей Пушкин', '1925–2015', 'https://ru.wikipedia.org/wiki/%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD%2C_%D0%A1%D0%B5%D1%80%D0%B3%D0%B5%D0%B9_%D0%91%D0%BE%D1%80%D0%B8%D1%81%D0%BE%D0%B2%D0%B8%D1%87', 'measurement_error',
 'Keeper of the state time standard (1967–2011): every clock is only as good as its chain back to the standard.', 'Хранитель государственного эталона времени (1967–2011): любые часы точны лишь настолько, насколько надёжна их цепочка до эталона.', 'Hüter des staatlichen Zeitnormals (1967–2011): jede Uhr ist nur so gut wie ihre Kette zum Normal.',
 'Give a time or a number together with the source it was set against.'),
('trakhtenbrot', 'Boris Trakhtenbrot', 'Борис Трахтенброт', '1921–2016', 'https://ru.wikipedia.org/wiki/%D0%A2%D1%80%D0%B0%D1%85%D1%82%D0%B5%D0%BD%D0%B1%D1%80%D0%BE%D1%82%2C_%D0%91%D0%BE%D1%80%D0%B8%D1%81_%D0%90%D0%B2%D1%80%D0%B0%D0%B0%D0%BC%D0%BE%D0%B2%D0%B8%D1%87', 'own_limits',
 'Limits of algorithms: some questions cannot be decided by any algorithm, and others only at a huge cost.', 'Пределы алгоритмов: на некоторые вопросы не ответит никакой алгоритм, на другие — только ценой огромных затрат.', 'Grenzen der Algorithmen: manche Fragen kann kein Algorithmus entscheiden, andere nur mit riesigem Aufwand.',
 'Before searching, ask whether the question can be settled at all with the data you can reach.'),
('sigal', 'Izrail Kh. Sigal', 'Израиль Сигал', '1938–2016', 'https://ru.wikipedia.org/wiki/%D0%A1%D0%B8%D0%B3%D0%B0%D0%BB%2C_%D0%98%D0%B7%D1%80%D0%B0%D0%B8%D0%BB%D1%8C_%D0%A5%D0%B0%D0%B8%D0%BC%D0%BE%D0%B2%D0%B8%D1%87', 'answer_cost',
 'Operations research: solving large discrete optimisation problems approximately and with bounded effort.', 'Исследование операций: приближённое решение больших дискретных задач оптимизации с ограниченными затратами.', 'Operations Research: große diskrete Optimierungsprobleme näherungsweise mit begrenztem Aufwand lösen.',
 'A good answer within budget beats a perfect one that is too expensive; say how far from optimal it may be.'),
('arrow', 'Kenneth Arrow', 'Кеннет Эрроу', '1921–2017', 'https://ru.wikipedia.org/wiki/%D0%AD%D1%80%D1%80%D0%BE%D1%83%2C_%D0%9A%D0%B5%D0%BD%D0%BD%D0%B5%D1%82', 'answer_cost',
 'Impossibility theorem and the economics of information: no voting rule is perfect, and information has a price and a value.', 'Теорема о невозможности и экономика информации: идеального правила голосования нет, а у информации есть цена и ценность.', 'Unmöglichkeitssatz und Informationsökonomie: keine Abstimmungsregel ist perfekt, Information hat Preis und Wert.',
 'Pay for more information only when it can change the decision.'),
('levenshtein', 'Vladimir Levenshtein', 'Владимир Левенштейн', '1935–2017', 'https://ru.wikipedia.org/wiki/%D0%9B%D0%B5%D0%B2%D0%B5%D0%BD%D1%88%D1%82%D0%B5%D0%B9%D0%BD%2C_%D0%92%D0%BB%D0%B0%D0%B4%D0%B8%D0%BC%D0%B8%D1%80_%D0%98%D0%BE%D1%81%D0%B8%D1%84%D0%BE%D0%B2%D0%B8%D1%87', 'look_alike',
 'Edit distance: how many single-letter changes turn one text into another — finds duplicates and misspelt names.', 'Расстояние редактирования: сколько замен букв превращают один текст в другой — находит дубли и имена с опечатками.', 'Editierdistanz: wie viele Buchstabenänderungen einen Text in einen anderen verwandeln – findet Dubletten und vertippte Namen.',
 'Two headlines that differ by a few letters are one story, not two confirmations.'),
('freivalds', 'Rūsiņš Freivalds', 'Русиньш Фрейвалдс', '1942–2016', 'https://ru.wikipedia.org/wiki/%D0%A4%D1%80%D0%B5%D0%B9%D0%B2%D0%B0%D0%BB%D0%B4%D1%81%2C_%D0%A0%D1%83%D1%81%D0%B8%D0%BD%D1%8C%D1%88_%D0%9C%D0%B0%D1%80%D1%82%D1%8B%D0%BD%D1%8C%D1%88', 'measurement_error',
 "Freivalds' algorithm: checking an answer at random is much cheaper than computing it again.", 'Алгоритм Фрейвалдса: случайная проверка ответа намного дешевле, чем повторное вычисление.', 'Freivalds-Algorithmus: eine zufällige Prüfung der Antwort ist viel billiger als neu zu rechnen.',
 'Spot-check a random sample of your results instead of trusting all or recomputing all.'),
('minsky', 'Marvin Minsky', 'Марвин Минский', '1927–2016', 'https://ru.wikipedia.org/wiki/%D0%9C%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%2C_%D0%9C%D0%B0%D1%80%D0%B2%D0%B8%D0%BD_%D0%9B%D0%B8', 'one_model',
 "'The Society of Mind': intelligence as a community of simple agents that disagree and negotiate.", '«Общество разума»: интеллект как сообщество простых агентов, которые спорят и договариваются.', '„The Society of Mind“: Intelligenz als Gemeinschaft einfacher Agenten, die streiten und verhandeln.',
 'Let different parts or models check each other instead of trusting a single voice.'),
('fodor', 'Jerry Fodor', 'Джерри Фодор', '1935–2017', 'https://ru.wikipedia.org/wiki/%D0%A4%D0%BE%D0%B4%D0%BE%D1%80%2C_%D0%94%D0%B6%D0%B5%D1%80%D1%80%D0%B8_%D0%90%D0%BB%D0%B0%D0%BD', 'rumour_vs_fact',
 'Modularity of mind and the language of thought: meaning lies beneath the surface of the words.', 'Модульность ума и язык мысли: смысл лежит под поверхностью слов.', 'Modularität des Geistes und Sprache des Denkens: Bedeutung liegt unter der Oberfläche der Wörter.',
 'Do not judge a text by its surface words alone; ask what it actually claims.'),
# --- немецкая Википедия, 2015–2017 (23.11.2026) ---
('takacs', 'Lajos Takács', 'Лайош Такач', '1924–2015', 'https://de.wikipedia.org/wiki/Lajos_Tak%C3%A1cs', 'stale_data',
 'Queueing theory and random processes: how long items wait in line before they are served.', 'Теория очередей и случайных процессов: сколько заявки ждут в очереди, прежде чем их обработают.', 'Warteschlangentheorie und stochastische Prozesse.',
 'Count the waiting time in each queue between the event and your answer.'),
('gottwald', 'Siegfried Gottwald', 'Зигфрид Готтвальд', '1943–2015', 'https://de.wikipedia.org/wiki/Siegfried_Gottwald', 'one_model',
 'Fuzzy sets and many-valued logic.', 'Нечёткие множества и многозначная логика.', 'Unscharfe Mengen und mehrwertige Logik.',
 'Keep degrees of truth instead of forcing every label to yes or no.'),
('weichselberger', 'Kurt Weichselberger', 'Курт Вайхзельбергер', '1929–2016', 'https://de.wikipedia.org/wiki/Kurt_Weichselberger', 'one_model',
 'Interval probability: when knowledge is thin, give a probability range, not one exact number.', 'Интервальная вероятность: когда знаний мало, давай диапазон вероятности, а не одно точное число.', 'Intervallwahrscheinlichkeit: bei dünnem Wissen eine Spanne statt einer exakten Zahl.',
 'With little data, report a lower and an upper probability.'),
('vopenka', 'Petr Vopěnka', 'Петр Вопенка', '1935–2015', 'https://de.wikipedia.org/wiki/Petr_Vop%C4%9Bnka', 'one_model',
 'Alternative set theory: the same reality can be described by different foundations.', 'Альтернативная теория множеств: одну и ту же реальность можно описать на разных основаниях.', 'Alternative Mengenlehre.',
 'Name the framework your answer depends on.'),
('janich', 'Peter Janich', 'Петер Яних', '1942–2016', 'https://de.wikipedia.org/wiki/Peter_Janich', 'rumour_vs_fact',
 'Methodical constructivism: science built up from the procedures of measuring and doing.', 'Методический конструктивизм: наука, выстроенная от процедур измерения и действия.', 'Methodischer Konstruktivismus.',
 'Say how a claim was obtained, not only what it says.'),
('kanitscheider', 'Bernulf Kanitscheider', 'Бернульф Канитшайдер', '1939–2017', 'https://de.wikipedia.org/wiki/Bernulf_Kanitscheider', 'rumour_vs_fact',
 'Philosophy of science and naturalism.', 'Теория науки и натурализм.', 'Wissenschaftstheorie und Naturalismus.',
 'Prefer claims that can be tested in the world.'),
('putnam', 'Hilary Putnam', 'Хилари Патнэм', '1926–2016', 'https://de.wikipedia.org/wiki/Hilary_Putnam', 'rumour_vs_fact',
 'Scientific realism and philosophy of language: what words refer to is fixed partly by the world and by experts, not by the speaker alone.', 'Научный реализм и философия языка: на что указывают слова, определяют отчасти мир и эксперты, а не только говорящий.', 'Wissenschaftlicher Realismus und Sprachphilosophie.',
 'When a term is technical, check what the experts mean by it.'),
('gy', 'Pierre Gy', 'Пьер Жи', '1924–2015', 'https://de.wikipedia.org/wiki/Pierre_Gy', 'measurement_error',
 'Theory of sampling: from a mixed, uneven mass a small sample gives a biased picture unless it is taken correctly.', 'Теория отбора проб: из неоднородной массы маленькая проба даёт искажённую картину, если её взять неправильно.', 'Probenahmetheorie.',
 'Ask how the sample was taken from an uneven whole before trusting it.'),
('rottlaender', 'Rolf C. A. Rottländer', 'Рольф Роттлендер', '1932–2016', 'https://de.wikipedia.org/wiki/Rolf_C._A._Rottl%C3%A4nder', 'look_alike',
 'Ancient units of length: the same unit name meant different lengths in different places.', 'Античные меры длины: одно и то же название меры означало разную длину в разных местах.', 'Antike Längenmaße.',
 'Check which definition of a unit a source uses.'),
('mueller_merbach', 'Heiner Müller-Merbach', 'Хайнер Мюллер-Мербах', '1936–2015', 'https://de.wikipedia.org/wiki/Heiner_M%C3%BCller-Merbach', 'answer_cost',
 'Operations research and its use in management.', 'Исследование операций и его применение в управлении.', 'Operations Research.',
 'Choose the cheapest procedure that still gives a usable answer.'),
('krabs', 'Werner Krabs', 'Вернер Крабс', '1934–2017', 'https://de.wikipedia.org/wiki/Werner_Krabs', 'side_effects',
 'Optimal control and game theory.', 'Оптимальное управление и теория игр.', 'Optimale Steuerung und Spieltheorie.',
 'Plan the sequence of steps, not only the next one.'),
('garfield', 'Eugene Garfield', 'Юджин Гарфилд', '1925–2017', 'https://de.wikipedia.org/wiki/Eugene_Garfield', 'rumour_vs_fact',
 'Science Citation Index: who cites whom shows how a claim spread and which sources it rests on.', 'Индекс научного цитирования: кто кого цитирует, показывает, как распространилось утверждение и на какие источники оно опирается.', 'Science Citation Index.',
 'Follow the citation back to the original source.'),
('dahlberg', 'Ingetraut Dahlberg', 'Ингетраут Дальберг', '1927–2017', 'https://de.wikipedia.org/wiki/Ingetraut_Dahlberg', 'answer_cost',
 'Universal classification of knowledge: subject headings and thesauri instead of flat search.', 'Универсальная классификация знаний: рубрики и тезаурусы вместо плоского поиска.', 'Universale Wissensklassifikation.',
 'Narrow the question to the right category before searching.'),
('dreyfus', 'Hubert Dreyfus', 'Хьюберт Дрейфус', '1929–2017', 'https://de.wikipedia.org/wiki/Hubert_Dreyfus', 'own_limits',
 'Critique of AI: a formal model is not the same as real skill and understanding.', 'Критика ИИ: формальная модель — не то же самое, что настоящее умение и понимание.', 'KI-Kritik: ein formales Modell ist nicht dasselbe wie echtes Können.',
 'Do not mistake a fluent formal answer for real competence; say where your model ends.'),
('robinson', 'John Alan Robinson', 'Джон Алан Робинсон', '1930–2016', 'https://de.wikipedia.org/wiki/John_Alan_Robinson', 'rumour_vs_fact',
 'The resolution principle: the basis of automated logical reasoning.', 'Метод резолюции: основа автоматического логического вывода.', 'Resolutionsprinzip.',
 'Make each step of a conclusion explicit so it can be checked.'),
('wille', 'Rudolf Wille', 'Рудольф Вилле', '1937–2017', 'https://de.wikipedia.org/wiki/Rudolf_Wille', 'look_alike',
 'Formal concept analysis: concepts as sets of objects that share sets of attributes.', 'Формальный анализ понятий: понятия как множества объектов с общими признаками.', 'Formale Begriffsanalyse.',
 'Define a category by the features its members share.'),
('henrichs', 'Norbert Henrichs', 'Норберт Хенрихс', '1935–2016', 'https://de.wikipedia.org/wiki/Norbert_Henrichs', 'answer_cost',
 'Text indexing without a fixed vocabulary.', 'Индексация текстов без заданного словаря.', 'Textindexierung ohne festes Vokabular.',
 'Index by the words the texts actually use.'),
# --- итальянская Википедия, январь–июнь 2015 (23.11.2026) ---
('malinvaud', 'Edmond Malinvaud', 'Эдмон Маленво', '1923–2015', 'https://it.wikipedia.org/wiki/Edmond_Malinvaud', 'one_model',
 'Econometrics and disequilibrium: statistical models of the economy hold only within limits, and markets need not clear.', 'Эконометрика и неравновесие: статистические модели экономики верны лишь в своих пределах, а рынки не обязаны приходить в равновесие.', 'Ökonometrie und Ungleichgewicht: Modelle gelten nur in ihren Grenzen.',
 'State the conditions under which your model holds, and what happens outside them.'),
('marquard', 'Odo Marquard', 'Одо Марквард', '1928–2015', 'https://it.wikipedia.org/wiki/Odo_Marquard', 'one_model',
 'Scepticism and pluralism: distrust single theories that claim the whole truth; keep several interpretations.', 'Скептицизм и плюрализм: не доверять единым теориям, претендующим на всю истину; держать несколько толкований.', 'Skepsis und Pluralismus gegenüber Theorien mit Anspruch auf die ganze Wahrheit.',
 'Offer at least one other reading before settling on yours.'),
('maris', 'Bernard Maris', 'Бернар Мари', '1946–2015', 'https://it.wikipedia.org/wiki/Bernard_Maris', 'one_model',
 'Critique of economic dogma: blind trust in closed macro models and market forecasts.', 'Критика экономического догматизма: слепая вера в закрытые макромодели и рыночные прогнозы.', 'Kritik am ökonomischen Dogmatismus und blindem Vertrauen in Marktprognosen.',
 'Do not present a forecast as a fact; say whose model it is.'),
('montagna', 'Franco Montagna', 'Франко Монтанья', '1948–2015', 'https://it.wikipedia.org/wiki/Franco_Montagna', 'rumour_vs_fact',
 'Provability logic, many-valued logics of uncertainty and the foundations of subjective probability.', 'Логика доказуемости, многозначные логики неопределённости и основания субъективной вероятности.', 'Beweisbarkeitslogik, mehrwertige Logiken und subjektive Wahrscheinlichkeit.',
 "Separate 'proven', 'probable' and 'believed'."),
('bruel', 'Per V. Brüel', 'Пер Вильгельм Брюэль', '1915–2015', 'https://it.wikipedia.org/wiki/Per_Vilhelm_Br%C3%BCel', 'measurement_error',
 'Precision acoustics and vibration measurement (co-founder of Brüel & Kjær): instruments must be calibrated to be trusted.', 'Прецизионные измерения звука и вибраций (сооснователь Brüel & Kjær): прибору можно верить, только если он откалиброван.', 'Präzisionsmessung von Schall und Schwingungen (Brüel & Kjær).',
 'Ask when the instrument behind a number was last calibrated.'),
('matousek', 'Jiří Matoušek', 'Иржи Матоушек', '1963–2015', 'https://it.wikipedia.org/wiki/Ji%C5%99%C3%AD_Matou%C5%A1ek_(matematico)', 'answer_cost',
 'Computational geometry and approximation: a small well-chosen sample can stand in for a huge set with bounded error.', 'Вычислительная геометрия и аппроксимация: маленькая хорошо выбранная выборка может заменить огромное множество с ограниченной ошибкой.', 'Algorithmische Geometrie: eine kleine gut gewählte Stichprobe ersetzt eine riesige Menge mit begrenztem Fehler.',
 'Use a small representative sample and state the error bound.'),
('nash', 'John F. Nash', 'Джон Нэш', '1928–2015', 'https://it.wikipedia.org/wiki/John_Nash', 'side_effects',
 'Nash equilibrium: in strategic situations the best move depends on what others do in response.', 'Равновесие Нэша: в стратегической ситуации лучший ход зависит от ответных ходов других.', 'Nash-Gleichgewicht: der beste Zug hängt von den Antworten der anderen ab.',
 'Before recommending a move, consider how the other side will respond.'),
('beck', 'Ulrich Beck', 'Ульрих Бек', '1944–2015', 'https://it.wikipedia.org/wiki/Ulrich_Beck', 'side_effects',
 'Risk society: modern decisions produce side effects and system risks no single actor foresees.', 'Общество риска: современные решения порождают побочные эффекты и системные риски, которых не предвидит ни один участник.', 'Risikogesellschaft: Entscheidungen erzeugen Nebenfolgen und Systemrisiken.',
 'Name the side effects of an action, not only its intended effect.'),
('lamfalussy', 'Alexandre Lamfalussy', 'Александр Ламфалусси', '1929–2015', 'https://it.wikipedia.org/wiki/Alexandre_Lamfalussy', 'measurement_error',
 'Macroprudential view: look for fragility of the whole system before a crisis, not only at each institution.', 'Макропруденциальный подход: искать хрупкость всей системы до кризиса, а не только у каждого участника по отдельности.', 'Makroprudenzielle Sicht: Fragilität des Gesamtsystems vor der Krise suchen.',
 'Check the whole system, not only its parts one by one.'),
# --- от Gemini (Лиана), 23.11.2026 ---
('schelling', 'Thomas Schelling', 'Томас Шеллинг', '1921–2016', 'https://en.wikipedia.org/wiki/Thomas_Schelling', 'side_effects',
 "'Micromotives and Macrobehavior' and focal points: individually sensible small choices add up to large effects nobody intended, and expectations shape what others do.", '«Микромотивы и макроповедение» и фокальные точки: разумные по отдельности маленькие решения складываются в большие последствия, которых никто не хотел, а ожидания меняют поведение других.', '„Micromotives and Macrobehavior“ und Fokalpunkte: kleine vernünftige Einzelentscheidungen ergeben große, ungewollte Folgen.',
 'Ask what happens when many agents follow the same advice at once.'),
# --- от Gemini (Лиана): январь–июнь 2016 (23.11.2026) ---
('naur', 'Peter Naur', 'Петер Наур', '1928–2016', 'https://en.wikipedia.org/wiki/Peter_Naur', 'own_limits',
 "'Programming as Theory Building': the real program is the theory in the developers' heads; code and documents without that theory cannot be safely changed.", '«Программирование как построение теории»: настоящая программа — это теория в головах разработчиков; код и документы без этой теории нельзя безопасно менять.', '„Programming as Theory Building“: das eigentliche Programm ist die Theorie in den Köpfen der Entwickler.',
 'Before changing something you did not build, say what you do not know about why it is the way it is.'),
('zeeman', 'Christopher Zeeman', 'Кристофер Зиман', '1925–2016', 'https://en.wikipedia.org/wiki/Christopher_Zeeman', 'one_model',
 'Catastrophe theory: smooth changes in conditions can cause sudden jumps in the state of a system.', 'Теория катастроф: плавное изменение условий может вызвать скачок в состоянии системы.', 'Katastrophentheorie: glatte Änderungen der Bedingungen können plötzliche Sprünge auslösen.',
 'Do not assume a straight line: say where a small change could flip the outcome.'),
('eco', 'Umberto Eco', 'Умберто Эко', '1932–2016', 'https://en.wikipedia.org/wiki/Umberto_Eco', 'look_alike',
 'Semiotics and the limits of interpretation: a text allows many readings, but not any reading.', 'Семиотика и пределы интерпретации: текст допускает много прочтений, но не любое.', 'Semiotik und Grenzen der Interpretation: ein Text erlaubt viele Lesarten, aber nicht jede.',
 'Offer readings the text supports, and say which ones it does not.'),
('shapley', 'Lloyd Shapley', 'Ллойд Шепли', '1923–2016', 'https://en.wikipedia.org/wiki/Lloyd_Shapley', 'one_model',
 'The Shapley value: a fair way to share the result among the participants who produced it together (the basis of SHAP explanations in AI).', 'Вектор Шепли: справедливый способ разделить результат между участниками, которые добились его вместе (основа объяснений SHAP в ИИ).', 'Shapley-Wert: faire Aufteilung eines gemeinsamen Ergebnisses (Grundlage von SHAP).',
 'When several causes act together, give each its share instead of naming one.'),
('mackay', 'David J. C. MacKay', 'Дэвид Маккей', '1967–2016', 'https://en.wikipedia.org/wiki/David_J._C._MacKay', 'measurement_error',
 "Information theory, Bayesian inference and 'Sustainable Energy – without the hot air': check claims by putting honest numbers with units on them.", 'Теория информации, байесовский вывод и «Устойчивая энергия — без пустых слов»: проверять утверждения, подставляя честные числа с единицами.', 'Informationstheorie, Bayes und „Sustainable Energy – without the hot air“: Behauptungen mit ehrlichen Zahlen prüfen.',
 'Put a number with a unit on a claim and compare it with the right scale.'),
('golomb', 'Solomon W. Golomb', 'Соломон Голомб', '1932–2016', 'https://en.wikipedia.org/wiki/Solomon_W._Golomb', 'answer_cost',
 'Golomb codes and shift-register sequences: short codes for frequent values.', 'Коды Голомба и последовательности регистров сдвига: короткие коды для частых значений.', 'Golomb-Codes und Schieberegisterfolgen.',
 'Give the frequent answer short and spend words only on the unusual.'),
('toffler', 'Alvin Toffler', 'Элвин Тоффлер', '1928–2016', 'https://en.wikipedia.org/wiki/Alvin_Toffler', 'answer_cost',
 "'Future Shock': information overload — too much change and information too fast overwhelms decisions.", '«Шок будущего»: информационная перегрузка — слишком много перемен и информации слишком быстро мешают принимать решения.', '„Der Zukunftsschock“: Informationsüberlastung.',
 'Give less, but what matters: cut the answer to what the reader can use.'),
# --- от Gemini (Лиана): 2012–2014 (23.11.2026) ---
('suppes', 'Patrick Suppes', 'Патрик Суппес', '1922–2014', 'https://en.wikipedia.org/wiki/Patrick_Suppes', 'measurement_error',
 "'Foundations of Measurement' and probabilistic causality: when qualitative observations can be turned into numbers on a scale.", '«Основания измерения» и вероятностная причинность: когда качественные наблюдения можно честно перевести в числа на шкале.', '„Foundations of Measurement“ und probabilistische Kausalität.',
 'Before turning an impression into a number, say what scale it is on.'),
('fillmore', 'Charles J. Fillmore', 'Чарльз Филлмор', '1929–2014', 'https://en.wikipedia.org/wiki/Charles_J._Fillmore', 'look_alike',
 'Frame semantics (FrameNet): the meaning of a word depends on the situation frame and the roles in it.', 'Фреймовая семантика (FrameNet): значение слова зависит от фрейма ситуации и ролей её участников.', 'Frame-Semantik (FrameNet): Wortbedeutung hängt vom Situationsrahmen ab.',
 'The same word in a different situation may mean a different thing; check the frame.'),
('lowe', 'E. J. Lowe', 'Э. Дж. Лоу', '1950–2014', 'https://en.wikipedia.org/wiki/E._J._Lowe', 'look_alike',
 'Criteria of identity: having the same properties is not the same as being one and the same thing.', 'Критерии тождества: иметь одинаковые свойства — не то же самое, что быть одним и тем же предметом.', 'Identitätskriterien: gleiche Eigenschaften sind nicht dasselbe wie numerische Identität.',
 'Two matching descriptions may still be two different things; name the criterion you use.'),
('hall', 'Stuart Hall', 'Стюарт Холл', '1932–2014', 'https://en.wikipedia.org/wiki/Stuart_Hall_(cultural_theorist)', 'side_effects',
 'Encoding/decoding: the receiver reads a message through their own codes, so what is meant and what is understood can differ.', 'Кодирование и декодирование: получатель читает сообщение через свои коды, и задуманное может разойтись с понятым.', 'Kodieren/Dekodieren: der Empfänger liest eine Botschaft mit eigenen Codes.',
 'Ask how different readers will understand your answer, not only what you meant.'),
('coase', 'Ronald Coase', 'Рональд Коуз', '1910–2013', 'https://en.wikipedia.org/wiki/Ronald_Coase', 'side_effects',
 'Transaction costs and the Coase theorem: side effects on others (externalities) and the cost of arranging things decide how problems get solved.', 'Транзакционные издержки и теорема Коуза: побочные эффекты для других (экстерналии) и цена договорённости определяют, как решаются проблемы.', 'Transaktionskosten und Coase-Theorem: Externalitäten und Verhandlungskosten.',
 'Name who else bears the cost of an action.'),
('box', 'George E. P. Box', 'Джордж Бокс', '1919–2013', 'https://en.wikipedia.org/wiki/George_E._P._Box', 'one_model',
 "'All models are wrong, but some are useful'; Box–Jenkins time-series models: check a model by what it leaves unexplained.", '«Все модели неверны, но некоторые полезны»; модели Бокса — Дженкинса: проверяй модель по тому, что она оставляет необъяснённым.', '„Alle Modelle sind falsch, aber manche sind nützlich“; Box-Jenkins.',
 'Say what your model is useful for and where it is wrong.'),
('lindley', 'Dennis Lindley', 'Деннис Линдли', '1923–2013', 'https://en.wikipedia.org/wiki/Dennis_Lindley', 'own_limits',
 "Coherent Bayesian decisions: degrees of belief must fit together, and never put probability zero or one on what you are not sure of (Cromwell's rule).", 'Когерентные байесовские решения: степени уверенности должны сходиться между собой, и нельзя ставить вероятность ноль или один тому, в чём не уверен (правило Кромвеля).', 'Kohärente Bayes-Entscheidungen; Cromwells Regel: nie 0 oder 1 ohne Gewissheit.',
 'Do not state certainty you do not have: keep a little probability for being wrong.'),
('buchanan', 'James M. Buchanan', 'Джеймс Бьюкенен', '1919–2013', 'https://en.wikipedia.org/wiki/James_M._Buchanan', 'side_effects',
 'Public choice: those who make rules act on their own incentives too, so rules have effects their designers did not announce.', 'Теория общественного выбора: те, кто пишет правила, тоже действуют по своим стимулам, поэтому у правил бывают последствия, которых авторы не объявляли.', 'Public Choice: auch Regelmacher folgen eigenen Anreizen.',
 'Ask whose incentives a rule or a recommendation serves.'),
('fogel', 'Robert Fogel', 'Роберт Фогель', '1926–2013', 'https://en.wikipedia.org/wiki/Robert_Fogel', 'one_model',
 'Cliometrics and the counterfactual: measure a cause by asking what would have happened without it.', 'Клиометрика и контрфактический анализ: измерять причину вопросом, что было бы без неё.', 'Kliometrie und kontrafaktische Analyse.',
 'Before calling something a cause, say what would have happened without it.'),
('klein', 'Lawrence Klein', 'Лоуренс Клейн', '1920–2013', 'https://en.wikipedia.org/wiki/Lawrence_Klein', 'one_model',
 'Large macro-econometric models (Klein–Goldberger, Project LINK): forecasts depend on the structure the model assumes.', 'Большие макроэконометрические модели (Клейна — Голдбергера, проект LINK): прогноз зависит от структуры, которую закладывает модель.', 'Makroökonometrische Modelle (Klein-Goldberger, LINK).',
 'Say which model a forecast comes from and what it assumes.'),
('geach', 'Peter Geach', 'Питер Гич', '1916–2013', 'https://en.wikipedia.org/wiki/Peter_Geach', 'look_alike',
 "Relative identity: 'the same' is only meaningful relative to a kind — the same word, the same edition, the same author.", 'Относительное тождество: «то же самое» имеет смысл только относительно рода — то же слово, то же издание, тот же автор.', 'Relative Identität: „dasselbe“ nur bezüglich einer Art.',
 "When you say 'the same', say the same what."),
('ostrom', 'Elinor Ostrom', 'Элинор Остром', '1933–2012', 'https://en.wikipedia.org/wiki/Elinor_Ostrom', 'side_effects',
 "'Governing the Commons': shared resources can be managed by their users with clear rules, monitoring and graduated sanctions.", '«Управляя общим»: общими ресурсами могут управлять сами пользователи — с ясными правилами, наблюдением и постепенными санкциями.', '„Die Verfassung der Allmende“: Selbstverwaltung gemeinsamer Ressourcen.',
 'When many agents use one shared resource, show how one use affects the others.'),
('thurston', 'William Thurston', 'Уильям Тёрстон', '1946–2012', 'https://en.wikipedia.org/wiki/William_Thurston', 'own_limits',
 "'On Proof and Progress in Mathematics': a formal proof is not the same as understanding; understanding is what is passed on.", '«О доказательстве и прогрессе в математике»: формальное доказательство — ещё не понимание; передаётся именно понимание.', '„On Proof and Progress in Mathematics“: Beweis ist nicht Verstehen.',
 'A correct-looking chain of steps is not understanding; say what you actually grasp.'),
('barcan_marcus', 'Ruth Barcan Marcus', 'Рут Баркан Маркус', '1921–2012', 'https://en.wikipedia.org/wiki/Ruth_Barcan_Marcus', 'look_alike',
 'Quantified modal logic and direct reference: a proper name points to its object directly, whatever descriptions change.', 'Кванторная модальная логика и прямая референция: имя собственное указывает на объект напрямую, как бы ни менялись описания.', 'Quantifizierte Modallogik und direkte Referenz.',
 'Tie a claim to the named person or thing, not to a description that may fit someone else.'),
('hirschman', 'Albert O. Hirschman', 'Альберт Хиршман', '1915–2012', 'https://en.wikipedia.org/wiki/Albert_O._Hirschman', 'side_effects',
 "'Exit, Voice, and Loyalty' and 'The Rhetoric of Reaction': how people respond when quality declines, and how arguments about unintended effects are used.", '«Выход, голос и верность» и «Риторика реакции»: как люди отвечают на ухудшение качества и как используют доводы о непреднамеренных последствиях.', '„Abwanderung und Widerspruch“ und „Denken gegen die Zukunft“.',
 'Ask whether people will leave or complain, and check claims of unintended effects instead of repeating them.'),
# --- от Грока: прицельный проход по зоне 8 (23.11.2026) ---
('feferman', 'Solomon Feferman', 'Соломон Феферман', '1928–2016', 'https://en.wikipedia.org/wiki/Solomon_Feferman', "own_limits",
 'Proof theory: what a formal system can and cannot prove about itself.', 'Теория доказательств: что формальная система может и чего не может доказать о самой себе.', 'Beweistheorie: was ein formales System über sich selbst beweisen kann.',
 'Do not use your own reasoning as the only proof that your reasoning is sound.'),
('smullyan', 'Raymond Smullyan', 'Рэймонд Смаллиан', '1919–2017', 'https://en.wikipedia.org/wiki/Raymond_Smullyan', "own_limits",
 "'Forever Undecided': incompleteness and what a reasoner can know about its own beliefs.", '«Forever Undecided»: неполнота и то, что рассуждающий может знать о собственных убеждениях.', '„Forever Undecided“: Unvollständigkeit und was ein Denkender über eigene Überzeugungen wissen kann.',
 'Some questions about yourself you cannot settle from inside; say so instead of guessing.'),
('takeuti', 'Gaisi Takeuti', 'Гайси Такэути', '1926–2017', 'https://en.wikipedia.org/wiki/Gaisi_Takeuti', "own_limits",
 'Proof theory and the consistency of mathematical systems.', 'Теория доказательств и непротиворечивость математических систем.', 'Beweistheorie und Widerspruchsfreiheit.',
 'State what your conclusion rests on and what would have to hold for it to be sound.'),
('rogers', 'Hartley Rogers Jr.', 'Хартли Роджерс-младший', '1926–2015', 'https://en.wikipedia.org/wiki/Hartley_Rogers_Jr.', "own_limits",
 'Theory of computability: which problems can be solved by any algorithm at all.', 'Теория вычислимости: какие задачи вообще может решить алгоритм.', 'Berechenbarkeitstheorie.',
 'Check whether a question is answerable in principle before trying to answer it.'),
('cooper', 'S. Barry Cooper', 'Барри Купер', '1943–2015', 'https://en.wikipedia.org/wiki/S._Barry_Cooper', "own_limits",
 "Degrees of unsolvability and Turing's questions: problems can be unsolvable in different degrees.", 'Степени неразрешимости и вопросы Тьюринга: задачи бывают неразрешимы в разной степени.', 'Grade der Unlösbarkeit und Turings Fragen.',
 'Say how far out of reach a question is, not only that it is hard.'),
('willard', 'Dan Willard', 'Дэн Уиллард', '1948–2023', 'https://en.wikipedia.org/wiki/Dan_Willard', "own_limits",
 'Self-verifying theories: weak systems that can prove their own consistency, at the price of giving up some power.', 'Самопроверяющиеся теории: слабые системы, которые могут доказать собственную непротиворечивость ценой отказа от части возможностей.', 'Selbstverifizierende Theorien: schwache Systeme, die ihre eigene Widerspruchsfreiheit beweisen können.',
 'To check yourself, narrow the claim until you can actually verify it.'),
('midgley', 'Mary Midgley', 'Мэри Миджли', '1919–2018', 'https://en.wikipedia.org/wiki/Mary_Midgley', "own_limits",
 'Critique of inflated promises of science and AI: a method that works in one field does not explain everything.', 'Критика завышенных обещаний науки и ИИ: метод, работающий в одной области, не объясняет всё.', 'Kritik an überzogenen Versprechen von Wissenschaft und KI.',
 'Do not stretch a method beyond the field where it was shown to work.'),
('lucas', 'John Lucas', 'Джон Лукас', '1929–2020', 'https://en.wikipedia.org/wiki/John_Lucas_(philosopher)', "own_limits",
 "'Minds, Machines and Gödel': an argument that a formal machine cannot fully replace a mathematician's insight.", '«Minds, Machines and Gödel»: аргумент о том, что формальная машина не может полностью заменить понимание математика.', '„Minds, Machines and Gödel“.',
 'Leave room for a human check where formal rules run out.'),
# --- от Gemini (Лиана): 2010–2011 (23.11.2026) ---
('mccarthy', 'John McCarthy', 'Джон Маккарти', '1927–2011', 'https://en.wikipedia.org/wiki/John_McCarthy_(computer_scientist)', 'side_effects',
 'The frame problem and non-monotonic reasoning: an action changes some things and leaves others; conclusions by default must be withdrawn when exceptions appear.', 'Проблема фрейма и немонотонные рассуждения: действие меняет одно и не меняет другое; выводы «по умолчанию» надо отзывать, когда появляются исключения.', 'Rahmenproblem und nichtmonotones Schließen.',
 'Say what your action changes and what it leaves unchanged, and drop a default conclusion when an exception appears.'),
('dummett', 'Michael Dummett', 'Майкл Даммит', '1925–2011', 'https://en.wikipedia.org/wiki/Michael_Dummett', 'own_limits',
 'Justificationist semantics: a statement is meaningful as far as we know how to justify it.', 'Обосновательная семантика: утверждение осмысленно настолько, насколько мы знаем, как его обосновать.', 'Rechtfertigungssemantik: eine Aussage hat Sinn, soweit wir wissen, wie man sie begründet.',
 'Do not assert what you have no way of justifying.'),
('garfinkel', 'Harold Garfinkel', 'Гарольд Гарфинкель', '1917–2011', 'https://en.wikipedia.org/wiki/Harold_Garfinkel', 'look_alike',
 'Ethnomethodology and indexicality: the same words mean different things in different unspoken contexts.', 'Этнометодология и индексикальность: одни и те же слова значат разное в разном невысказанном контексте.', 'Ethnomethodologie und Indexikalität.',
 'The same words in a different context may not mean the same; check the context before matching.'),
('goldratt', 'Eliyahu M. Goldratt', 'Элияху Голдратт', '1947–2011', 'https://en.wikipedia.org/wiki/Eliyahu_M._Goldratt', 'side_effects',
 "Theory of constraints: improving one link without regard to the system's bottleneck can make the whole worse.", 'Теория ограничений: улучшение одного звена без учёта узкого места системы может ухудшить целое.', 'Engpasstheorie: lokale Optimierung ohne Engpass verschlechtert das Ganze.',
 'Before optimising one step, find the bottleneck of the whole chain.'),
('mcmullin', 'Ernan McMullin', 'Эрнан Макмаллин', '1924–2011', 'https://en.wikipedia.org/wiki/Ernan_McMullin', 'own_limits',
 'Epistemic values of theory choice: predictive accuracy, coherence and fertility, not a smooth story fitted after the fact.', 'Эпистемические ценности выбора теорий: предсказательная точность, согласованность и плодотворность, а не гладкая история, подогнанная задним числом.', 'Epistemische Werte der Theoriewahl.',
 'Prefer an explanation that predicted something over one that fits any outcome after the fact.'),
('milner', 'Robin Milner', 'Робин Милнер', '1934–2010', 'https://en.wikipedia.org/wiki/Robin_Milner', 'look_alike',
 'Bisimulation and type inference: two processes are the same only if they behave the same in every situation, not because they look alike.', 'Бисимуляция и вывод типов: два процесса одинаковы, только если ведут себя одинаково в любой ситуации, а не потому, что похожи.', 'Bisimulation und Typinferenz.',
 'Call two things the same only when they behave the same, not when they look the same.'),
('dawes', 'Robyn Dawes', 'Робин Доус', '1936–2010', 'https://en.wikipedia.org/wiki/Robyn_Dawes', 'own_limits',
 "'The robust beauty of improper linear models': simple formulas beat expert intuition, which overrates its own insight.", '«Надёжная красота неправильных линейных моделей»: простые формулы выигрывают у интуиции экспертов, которая переоценивает свою проницательность.', 'Einfache lineare Modelle schlagen Experten-Intuition.',
 'Where a simple rule has a record, trust it over a convincing story.'),
('foot', 'Philippa Foot', 'Филиппа Фут', '1920–2010', 'https://en.wikipedia.org/wiki/Philippa_Foot', 'side_effects',
 'The trolley problem and the doctrine of double effect: separate the intended aim from foreseen side effects and judge them apart.', 'Проблема вагонетки и доктрина двойного эффекта: разделять задуманную цель и предвидимые побочные эффекты и оценивать их отдельно.', 'Trolley-Problem und Doppelwirkung.',
 'Name the foreseen side effects of an answer separately from its aim.'),
('turchin', 'Valentin Turchin', 'Валентин Турчин', '1931–2010', 'https://en.wikipedia.org/wiki/Valentin_Turchin', 'own_limits',
 "Metasystem transitions ('The Phenomenon of Science'): a control level above the rules watches where they stop working.", 'Метасистемные переходы («Феномен науки»): уровень контроля над правилами следит, где они перестают работать.', 'Metasystemübergänge („The Phenomenon of Science“).',
 'Keep a check above your own rules that notices when they no longer apply.'),
('mandelbrot', 'Benoit Mandelbrot', 'Бенуа Мандельброт', '1924–2010', 'https://en.wikipedia.org/wiki/Benoit_Mandelbrot', 'own_limits',
 "Fractals and heavy tails: 'wild' randomness, where rare huge jumps dominate, behaves differently from the calm bell curve.", 'Фракталы и тяжёлые хвосты: «дикая» случайность, где редкие огромные скачки решают всё, ведёт себя не так, как спокойная колоколообразная кривая.', 'Fraktale und schwere Ränder: „wilde“ Zufälligkeit.',
 'Do not give narrow ranges for markets with rare huge jumps.'),
('gardner', 'Martin Gardner', 'Мартин Гарднер', '1914–2010', 'https://en.wikipedia.org/wiki/Martin_Gardner', 'rumour_vs_fact',
 "'Fads and Fallacies in the Name of Science': sceptical checks against pseudoscience, coincidences and self-confirming explanations.", '«Причуды и заблуждения во имя науки»: скептическая проверка против лженауки, совпадений и самоподтверждающихся объяснений.', '„Fads and Fallacies“: Skepsis gegenüber Pseudowissenschaft.',
 'Treat a striking coincidence as a coincidence until shown otherwise.'),
# --- от Грока: прицельный проход по зонам 6 и 7 (23.11.2026) ---
('perrow', 'Charles Perrow', 'Чарльз Перроу', '1925–2019', 'https://en.wikipedia.org/wiki/Charles_Perrow', 'side_effects',
 "'Normal Accidents': in tightly coupled, complex systems small failures combine into accidents that nobody planned.", '«Нормальные аварии»: в сложных и тесно связанных системах мелкие сбои складываются в аварии, которых никто не планировал.', '„Normale Katastrophen“: in eng gekoppelten Systemen addieren sich kleine Fehler.',
 'Ask which other parts are tightly linked to the step you change.'),
('jervis', 'Robert Jervis', 'Роберт Джервис', '1940–2021', 'https://en.wikipedia.org/wiki/Robert_Jervis', 'side_effects',
 "'System Effects': in interconnected systems actions have indirect and delayed consequences that can reverse the intended result.", '«Эффекты системы»: во взаимосвязанных системах действия дают косвенные и запоздалые последствия, которые могут перевернуть задуманный результат.', '„System Effects“: indirekte und verzögerte Folgen.',
 'Look for the indirect and delayed effect, not only the direct one.'),
('rosenthal', 'Robert Rosenthal', 'Роберт Розенталь', '1933–2024', 'https://en.wikipedia.org/wiki/Robert_Rosenthal_(psychologist)', 'side_effects',
 'Expectancy effects (the Pygmalion effect): expectations change behaviour and can make a prediction come true.', 'Эффект ожиданий (эффект Пигмалиона): ожидания меняют поведение и могут сделать предсказание сбывшимся.', 'Erwartungseffekte (Pygmalion-Effekt).',
 'Remember that your forecast, once read, can change what people do.'),
('scott_jc', 'James C. Scott', 'Джеймс Скотт', '1936–2024', 'https://en.wikipedia.org/wiki/James_C._Scott', 'side_effects',
 "'Seeing Like a State': top-down schemes fail when they simplify away the local knowledge that made things work.", '«Благими намерениями государства»: схемы «улучшения сверху» проваливаются, когда упрощают местное знание, на котором всё держалось.', '„Seeing Like a State“: Pläne von oben scheitern an weggelassenem lokalem Wissen.',
 'Ask what local knowledge your simple plan leaves out.'),
('selten', 'Reinhard Selten', 'Райнхард Зельтен', '1930–2016', 'https://en.wikipedia.org/wiki/Reinhard_Selten', 'side_effects',
 'Subgame perfection and bounded rationality: a plan must hold at every later step, given how others will respond then.', 'Совершенство в подыграх и ограниченная рациональность: план должен выдерживать каждый следующий шаг с учётом того, как ответят другие.', 'Teilspielperfektheit und begrenzte Rationalität.',
 "Check that your advice still holds after the other side's next move."),
('shubik', 'Martin Shubik', 'Мартин Шубик', '1926–2018', 'https://en.wikipedia.org/wiki/Martin_Shubik', 'side_effects',
 'The dollar auction and strategic market games: rational step-by-step bidding can lead everyone into a loss.', 'Долларовый аукцион и стратегические рыночные игры: разумные пошаговые ставки могут завести всех в убыток.', 'Dollarauktion: schrittweise rationale Gebote führen alle in den Verlust.',
 'Before escalating, ask where the escalation ends for everyone.'),
('holling', 'C. S. Holling', 'Кроуфорд Холлинг', '1930–2019', 'https://en.wikipedia.org/wiki/C._S._Holling', 'side_effects',
 'Ecological resilience: optimising a system for efficiency can make it fragile to shocks.', 'Экологическая устойчивость: оптимизация системы ради эффективности может сделать её хрупкой к потрясениям.', 'Ökologische Resilienz.',
 'Ask whether making something more efficient also makes it more fragile.'),
('raiffa', 'Howard Raiffa', 'Говард Райфа', '1924–2016', 'https://en.wikipedia.org/wiki/Howard_Raiffa', 'side_effects',
 "Decision analysis and negotiation: structure a decision by options, uncertainties and the other party's interests.", 'Анализ решений и переговоры: строить решение из вариантов, неопределённостей и интересов другой стороны.', 'Entscheidungsanalyse und Verhandlung.',
 "Lay out the options and the other side's interests before recommending one."),
('apresyan', 'Yuri Apresyan', 'Юрий Апресян', '1930–2024', 'https://ru.wikipedia.org/wiki/%D0%90%D0%BF%D1%80%D0%B5%D1%81%D1%8F%D0%BD%2C_%D0%AE%D1%80%D0%B8%D0%B9_%D0%94%D0%B5%D1%80%D0%B5%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%D0%B8%D1%87', 'look_alike',
 'Systematic lexicography: synonyms differ in fine shades, and one word has several meanings.', 'Системная лексикография: синонимы различаются тонкими оттенками, а одно слово имеет несколько значений.', 'Systematische Lexikographie: Synonyme unterscheiden sich fein.',
 'Do not treat two near-synonyms as exactly the same; check the shade.'),
('paducheva', 'Elena Paducheva', 'Елена Падучева', '1935–2019', 'https://ru.wikipedia.org/wiki/%D0%9F%D0%B0%D0%B4%D1%83%D1%87%D0%B5%D0%B2%D0%B0%2C_%D0%95%D0%BB%D0%B5%D0%BD%D0%B0_%D0%92%D0%B8%D0%BA%D1%82%D0%BE%D1%80%D0%BE%D0%B2%D0%BD%D0%B0', 'look_alike',
 'Semantics of reference and aspect: the same sentence can refer to different things depending on context.', 'Семантика референции и вида: одно и то же предложение может указывать на разное в зависимости от контекста.', 'Semantik der Referenz.',
 'Ask what exactly a phrase refers to here before matching it with another.'),
('zaliznyak', 'Andrey Zaliznyak', 'Андрей Зализняк', '1935–2017', 'https://ru.wikipedia.org/wiki/%D0%97%D0%B0%D0%BB%D0%B8%D0%B7%D0%BD%D1%8F%D0%BA%2C_%D0%90%D0%BD%D0%B4%D1%80%D0%B5%D0%B9_%D0%90%D0%BD%D0%B0%D1%82%D0%BE%D0%BB%D1%8C%D0%B5%D0%B2%D0%B8%D1%87', 'look_alike',
 'The grammatical dictionary of Russian: all forms of one word belong together; different words can share one form.', 'Грамматический словарь русского языка: все формы одного слова — одно слово, а разные слова могут совпадать в одной форме.', 'Grammatisches Wörterbuch des Russischen.',
 'Group forms of one word together, and do not merge different words that share a form.'),
('saracevic', 'Tefko Saracevic', 'Тефко Сарачевич', '1930–2024', 'https://en.wikipedia.org/wiki/Tefko_Saracevic', 'look_alike',
 'Relevance in information retrieval: matching words is not the same as answering the need.', 'Релевантность в информационном поиске: совпадение слов — не то же самое, что ответ на потребность.', 'Relevanz im Information Retrieval.',
 'A result that shares the words may still not answer the question.'),
('kilgarriff', 'Adam Kilgarriff', 'Адам Килгаррифф', '1960–2015', 'https://en.wikipedia.org/wiki/Adam_Kilgarriff', 'look_alike',
 "Word senses from corpora ('I don't believe in word senses'): meanings are clusters of uses, not fixed boxes.", 'Значения слов по корпусам («Я не верю в значения слов»): значения — это скопления употреблений, а не жёсткие ящики.', 'Wortbedeutungen aus Korpora.',
 'Judge what a word means here from how it is used, not from a fixed list.'),
('kay', 'Martin Kay', 'Мартин Кей', '1935–2021', 'https://en.wikipedia.org/wiki/Martin_Kay', 'look_alike',
 'Computational linguistics and translation: machines should help humans where meaning is ambiguous, not decide alone.', 'Компьютерная лингвистика и перевод: машина должна помогать человеку там, где смысл неоднозначен, а не решать одна.', 'Computerlinguistik und Übersetzung.',
 'Where a meaning is ambiguous, show the options instead of picking one silently.'),
('rey', 'Alain Rey', 'Ален Рей', '1928–2020', 'https://en.wikipedia.org/wiki/Alain_Rey', 'look_alike',
 'Historical lexicography (Le Robert): words change meaning over time.', 'Историческая лексикография (словари Le Robert): слова меняют значение со временем.', 'Historische Lexikographie (Le Robert).',
 'Check whether a word meant the same thing when the source was written.'),
('hutchins', 'W. John Hutchins', 'Джон Хатчинс', '1939–2021', 'https://en.wikipedia.org/wiki/W._John_Hutchins', 'look_alike',
 'History of machine translation: the same word can have different translations, and early systems failed on ambiguity.', 'История машинного перевода: одно слово может переводиться по-разному, и первые системы спотыкались о неоднозначность.', 'Geschichte der maschinellen Übersetzung.',
 'When translating a key term, check that the translation keeps the meaning.'),
('hanks', 'Patrick Hanks', 'Патрик Хэнкс', '1940–2024', 'https://en.wikipedia.org/wiki/Patrick_Hanks', 'look_alike',
 "Corpus pattern analysis: a word's meaning is fixed by the pattern it occurs in.", 'Анализ корпусных шаблонов: значение слова задаётся шаблоном, в котором оно встречается.', 'Korpusmusteranalyse.',
 'Read the whole pattern around a word before deciding what it means.'),
('fensel', 'Dieter Fensel', 'Дитер Фензель', '1960–2024', 'https://en.wikipedia.org/wiki/Dieter_Fensel', 'look_alike',
 'Ontologies and the semantic web: shared, explicit definitions so that different systems mean the same thing by a term.', 'Онтологии и семантический веб: общие явные определения, чтобы разные системы понимали термин одинаково.', 'Ontologien und Semantic Web.',
 'Use an explicit shared definition when two sources use the same term.'),
('lyons', 'John Lyons', 'Джон Лайонз', '1932–2020', 'https://en.wikipedia.org/wiki/John_Lyons_(linguist)', 'look_alike',
 'Structural semantics: the meaning of a word is set by its relations to other words (synonymy, opposites, inclusion).', 'Структурная семантика: значение слова задаётся его отношениями с другими словами (синонимия, противоположность, включение).', 'Strukturelle Semantik.',
 'Check how two words relate (same, broader, opposite) before treating them as one.'),
# --- от Gemini (Лиана): 2008–2009 (23.11.2026) ---
('pnueli', 'Amir Pnueli', 'Амир Пнуэли', '1941–2009', 'https://en.wikipedia.org/wiki/Amir_Pnueli', 'side_effects',
 'Temporal logic of programs: check not only that a step is right now, but that nothing bad ever happens later (safety) and that the good thing eventually happens (liveness).', 'Темпоральная логика программ: проверять не только, что шаг верен сейчас, но и что ничего плохого не случится потом (безопасность) и хорошее в итоге произойдёт (живость).', 'Temporallogik: Sicherheit und Lebendigkeit über die Zeit prüfen.',
 'Check that your answer stays safe over the next steps, not only at this one.'),
('selfridge', 'Oliver Selfridge', 'Оливер Селфридж', '1926–2009', 'https://en.wikipedia.org/wiki/Oliver_Selfridge', 'look_alike',
 'Pandemonium: many feature detectors compete, and the loudest single match must not decide alone.', '«Пандемониум»: много детекторов признаков соревнуются, и самое громкое одиночное совпадение не должно решать в одиночку.', '„Pandemonium“: konkurrierende Merkmalsdetektoren.',
 'Do not call a match on one striking feature; let other features compete.'),
('ackoff', 'Russell L. Ackoff', 'Рассел Акофф', '1919–2009', 'https://en.wikipedia.org/wiki/Russell_L._Ackoff', 'side_effects',
 'Systems thinking: doing things right is not doing the right thing; improving a part can harm the whole.', 'Системное мышление: делать правильно — не то же, что делать правильное; улучшение части может навредить целому.', 'Systemdenken: Teile verbessern kann dem Ganzen schaden.',
 'Ask what the improvement does to the whole system, not only to the part.'),
('granger', 'Clive Granger', 'Клайв Грейнджер', '1934–2009', 'https://en.wikipedia.org/wiki/Clive_Granger', 'one_model',
 "Granger causality and cointegration: one series 'leads' another only if its past improves the forecast; two rising trends can correlate by accident.", 'Причинность по Грейнджеру и коинтеграция: один ряд «ведёт» другой, только если его прошлое улучшает прогноз; два растущих тренда могут совпадать случайно.', 'Granger-Kausalität und Kointegration.',
 "Before saying A drives B, check that A's past actually adds to predicting B, in both directions."),
('naess', 'Arne Næss', 'Арне Нэсс', '1912–2009', 'https://en.wikipedia.org/wiki/Arne_N%C3%A6ss', 'look_alike',
 'Interpretation and preciseness: make a vague statement more precise step by step instead of averaging its readings.', '«Интерпретация и точность»: уточнять размытое высказывание шаг за шагом, а не усреднять его прочтения.', '„Interpretation and Preciseness“.',
 'When a term has several readings, state the one you use.'),
('hymes', 'Dell Hymes', 'Делл Хаймс', '1927–2009', 'https://en.wikipedia.org/wiki/Dell_Hymes', 'side_effects',
 'Communicative competence: the same correct sentence works or fails depending on setting, participants and genre.', 'Коммуникативная компетенция: одна и та же правильная фраза срабатывает или нет в зависимости от обстановки, участников и жанра.', 'Kommunikative Kompetenz.',
 'Fit the answer to who hears it and where, not only to grammar.'),
('hurwicz', 'Leonid Hurwicz', 'Леонид Гурвич', '1917–2008', 'https://en.wikipedia.org/wiki/Leonid_Hurwicz', 'side_effects',
 'Mechanism design and incentive compatibility: rules work only if people gain by following them; the Hurwicz criterion weighs best and worst cases under ignorance.', 'Теория механизмов и совместимость стимулов: правила работают, только если людям выгодно им следовать; критерий Гурвича взвешивает лучший и худший случай при незнании.', 'Mechanismusdesign und Anreizverträglichkeit.',
 'Ask whether the people affected gain by following your advice, and weigh the best and worst case.'),
('weizenbaum', 'Joseph Weizenbaum', 'Джозеф Вейценбаум', '1923–2008', 'https://en.wikipedia.org/wiki/Joseph_Weizenbaum', 'own_limits',
 "ELIZA and 'Computer Power and Human Reason': fluent replies make people credit a machine with understanding it does not have.", 'ELIZA и «Возможности вычислительных машин и человеческий разум»: гладкие ответы заставляют людей приписывать машине понимание, которого нет.', 'ELIZA und „Die Macht der Computer und die Ohnmacht der Vernunft“.',
 'Do not let fluency stand in for understanding: say when you have no real basis.'),
('lorenz', 'Edward N. Lorenz', 'Эдвард Лоренц', '1917–2008', 'https://en.wikipedia.org/wiki/Edward_Norton_Lorenz', 'own_limits',
 'Chaos and the limit of predictability: in nonlinear systems tiny errors grow, so forecasts have a horizon.', 'Хаос и предел предсказуемости: в нелинейных системах крошечные ошибки растут, поэтому у прогнозов есть горизонт.', 'Chaos und Vorhersagehorizont.',
 'Do not give point forecasts beyond the horizon where small errors take over.'),
('lederberg', 'Joshua Lederberg', 'Джошуа Ледерберг', '1925–2008', 'https://en.wikipedia.org/wiki/Joshua_Lederberg', 'own_limits',
 'DENDRAL, the first expert system: generate candidate answers freely, then reject those that break known rules.', 'DENDRAL, первая экспертная система: свободно порождать варианты ответа, затем отбрасывать те, что нарушают известные правила.', 'DENDRAL: Hypothesen erzeugen, dann nach Regeln aussortieren.',
 'Generate options first, then strike out the ones that break hard facts.'),
('tilly', 'Charles Tilly', 'Чарльз Тилли', '1929–2008', 'https://en.wikipedia.org/wiki/Charles_Tilly', 'rumour_vs_fact',
 "'Why?': people explain by conventions, stories, codes and technical accounts; a smooth story is not a technical account.", '«Почему?»: люди объясняют через условности, истории, коды и технические отчёты; гладкая история — ещё не технический отчёт.', '„Why?“: Geschichten sind keine technischen Erklärungen.',
 'Do not pass off a neat story as a technical explanation.'),
('zajonc', 'Robert Zajonc', 'Роберт Зайонц', '1923–2008', 'https://en.wikipedia.org/wiki/Robert_Zajonc', 'rumour_vs_fact',
 'The mere-exposure effect: what we see often feels more true and more pleasant.', 'Эффект простого предъявления: то, что видишь часто, кажется вернее и приятнее.', 'Mere-Exposure-Effekt.',
 'Do not take a claim as truer because you have seen it many times.'),
# --- от Gemini (Лиана): 2000–2007, финал хронологии (23.11.2026) ---
('sparck_jones', 'Karen Spärck Jones', 'Карен Спарк Джонс', '1935–2007', 'https://en.wikipedia.org/wiki/Karen_Sp%C3%A4rck_Jones', 'look_alike',
 'Inverse document frequency: common words make texts look alike; rare, distinctive words show what really matches.', 'Обратная частота документа (IDF): частые слова делают тексты ложно похожими, совпадение показывают редкие различительные слова.', 'IDF: häufige Wörter täuschen Ähnlichkeit vor, seltene zeigen echte Übereinstimmung.',
 'Match on rare, distinctive words, not on common ones.'),
('watzlawick', 'Paul Watzlawick', 'Пауль Вацлавик', '1921–2007', 'https://en.wikipedia.org/wiki/Paul_Watzlawick', 'side_effects',
 'Axioms of communication: one cannot not communicate; every message has a content and a relationship level.', 'Аксиомы коммуникации: невозможно не коммуницировать; у каждого сообщения есть уровень содержания и уровень отношений.', 'Axiome der Kommunikation: man kann nicht nicht kommunizieren.',
 'Silence or evasion is also a message; think how it will be read.'),
('rorty', 'Richard Rorty', 'Ричард Рорти', '1931–2007', 'https://en.wikipedia.org/wiki/Richard_Rorty', 'own_limits',
 'Normal and abnormal discourse: when vocabularies clash, there may be no single neutral answer.', 'Нормальный и анормальный дискурс: когда сталкиваются разные словари понятий, единого нейтрального ответа может не быть.', 'Normaler und abnormaler Diskurs: unvereinbare Vokabulare.',
 'When two frameworks clash, say so instead of faking one objective answer.'),
('douglas_m', 'Mary Douglas', 'Мэри Дуглас', '1921–2007', 'https://en.wikipedia.org/wiki/Mary_Douglas', 'look_alike',
 "'Purity and Danger': anomalies are produced by the classification itself — matter out of place.", '«Чистота и опасность»: аномалии порождает сама система классификации — «вещь не на своём месте».', '„Reinheit und Gefährdung“: Anomalien entstehen durch die Klassifikation.',
 'Do not force an odd case into the nearest familiar category; say it does not fit.'),
('rapoport', 'Anatol Rapoport', 'Анатолий Рапопорт', '1911–2007', 'https://en.wikipedia.org/wiki/Anatol_Rapoport', 'side_effects',
 "Tit for tat in the repeated prisoner's dilemma, and Rapoport's rules: restate the other side's view fairly before criticising.", '«Око за око» в повторяющейся дилемме заключённого и правила Рапопорта: честно перескажи позицию другой стороны, прежде чем критиковать.', '„Tit for Tat“ und Rapoports Regeln fairer Kritik.',
 'Restate the strongest version of a view before answering it.'),
('friedman_m', 'Milton Friedman', 'Милтон Фридман', '1912–2006', 'https://en.wikipedia.org/wiki/Milton_Friedman', 'side_effects',
 'Long and variable lags: the effects of policy arrive late and unevenly, so reacting to short-term noise can destabilise.', 'Длинные и переменные лаги: последствия политики приходят поздно и неравномерно, поэтому реакция на краткосрочный шум раскачивает систему.', 'Lange und variable Wirkungsverzögerungen.',
 "Do not read today's move as the effect of yesterday's decision; effects come late."),
('galbraith', 'John Kenneth Galbraith', 'Джон Кеннет Гэлбрейт', '1908–2006', 'https://en.wikipedia.org/wiki/John_Kenneth_Galbraith', 'rumour_vs_fact',
 "'Conventional wisdom': ideas valued because they are familiar and comfortable, not because they are accurate.", '«Общепринятая мудрость»: идеи, ценимые за привычность и удобство, а не за точность.', '„Konventionelle Weisheit“: geschätzt, weil vertraut, nicht weil richtig.',
 'Do not treat a familiar phrase as true just because everyone repeats it.'),
('geertz', 'Clifford Geertz', 'Клиффорд Гирц', '1926–2006', 'https://en.wikipedia.org/wiki/Clifford_Geertz', 'look_alike',
 'Thick description: a twitch and a wink look the same; only context tells them apart.', 'Насыщенное описание: тик и подмигивание выглядят одинаково, различает их только контекст.', 'Dichte Beschreibung: Zucken und Zwinkern sehen gleich aus.',
 'Read the context before deciding that two identical-looking things mean the same.'),
('strawson', 'P. F. Strawson', 'Питер Стросон', '1919–2006', 'https://en.wikipedia.org/wiki/P._F._Strawson', 'own_limits',
 "'On Referring' and presupposition: a statement about something that does not exist is not simply false — the question itself fails.", '«О референции» и пресуппозиция: утверждение о несуществующем не просто ложно — проваливается сам вопрос.', '„On Referring“ und Präsupposition.',
 'If a question rests on a false premise, challenge the premise instead of answering yes or no.'),
('jacobs', 'Jane Jacobs', 'Джейн Джекобс', '1916–2006', 'https://en.wikipedia.org/wiki/Jane_Jacobs', 'side_effects',
 "'The Death and Life of Great American Cities': cities are organised complexity held together by local feedback; top-down plans break it.", '«Смерть и жизнь больших американских городов»: город — организованная сложность на местных обратных связях, которую ломают планы сверху.', '„Tod und Leben großer amerikanischer Städte“.',
 'Do not override local signals with one central scheme.'),
('koselleck', 'Reinhart Koselleck', 'Райнхарт Козеллек', '1923–2006', 'https://en.wikipedia.org/wiki/Reinhart_Koselleck', 'look_alike',
 'History of concepts: one word carries layers of meaning from different times.', 'История понятий: одно слово несёт пласты смыслов из разных времён.', 'Begriffsgeschichte: Wörter tragen Bedeutungsschichten verschiedener Zeiten.',
 'Check which layer of meaning a word has in this source and time.'),
('dantzig', 'George Dantzig', 'Джордж Данциг', '1914–2005', 'https://en.wikipedia.org/wiki/George_Dantzig', 'own_limits',
 'Linear programming and the simplex method: first check that the constraints can be met at all.', 'Линейное программирование и симплекс-метод: сначала проверь, совместимы ли ограничения вообще.', 'Lineare Optimierung: zuerst prüfen, ob die Bedingungen erfüllbar sind.',
 'If the requirements contradict each other, say the task has no solution instead of faking a compromise.'),
('breiman', 'Leo Breiman', 'Лео Брейман', '1928–2005', 'https://en.wikipedia.org/wiki/Leo_Breiman', 'one_model',
 "Random forests and 'The Two Cultures': judge a model by how well it predicts, and combine many models to reduce chance matches.", 'Случайный лес и «Две культуры»: оценивай модель по тому, как она предсказывает, и объединяй много моделей, чтобы уменьшить случайные совпадения.', 'Random Forests und „Two Cultures“.',
 'Trust the model that predicts well, not the one with the nicest story.'),
('ricoeur', 'Paul Ricœur', 'Поль Рикёр', '1913–2005', 'https://en.wikipedia.org/wiki/Paul_Ric%C5%93ur', 'look_alike',
 'Two kinds of identity: sameness (idem) and selfhood that persists through change (ipse); hermeneutics of trust and suspicion.', 'Два вида тождества: одинаковость (idem) и самость, сохраняющаяся в изменении (ipse); герменевтика доверия и подозрения.', 'Idem- und Ipse-Identität.',
 "Ask whether 'the same' means identical features or the same thing that has changed."),
('mayr', 'Ernst Mayr', 'Эрнст Майр', '1904–2005', 'https://en.wikipedia.org/wiki/Ernst_Mayr', 'one_model',
 'Population thinking: variation is real and the average is an abstraction; proximate and ultimate causes differ.', 'Популяционное мышление: изменчивость реальна, а среднее — абстракция; ближайшая и глубинная причины различаются.', 'Populationsdenken: Variation ist real, der Durchschnitt eine Abstraktion.',
 'Do not describe an individual case by the average of its group.'),
('edwards_w', 'Ward Edwards', 'Уорд Эдвардс', '1927–2005', 'https://en.wikipedia.org/wiki/Ward_Edwards', 'own_limits',
 'Behavioural decision theory and conservatism: people update too little when new evidence arrives.', 'Поведенческая теория решений и консерватизм: люди слишком слабо меняют мнение, когда приходят новые факты.', 'Verhaltensentscheidungstheorie und Konservatismus beim Lernen.',
 'Change your confidence as much as the new evidence warrants, no less.'),
('derrida', 'Jacques Derrida', 'Жак Деррида', '1930–2004', 'https://en.wikipedia.org/wiki/Jacques_Derrida', 'look_alike',
 'Iterability: a quote or a sign can be lifted into a new context, and its meaning shifts.', 'Итерабельность: цитату или знак можно перенести в новый контекст, и смысл сдвигается.', 'Iterabilität: Zitate verschieben ihren Sinn im neuen Kontext.',
 'Do not assume a quote keeps its meaning outside the context it was said in.'),
('maynard_smith', 'John Maynard Smith', 'Джон Мейнард Смит', '1920–2004', 'https://en.wikipedia.org/wiki/John_Maynard_Smith', 'side_effects',
 'Evolutionarily stable strategies and honest signals: a strategy is stable only if it survives others adapting to it.', 'Эволюционно стабильные стратегии и честные сигналы: стратегия устойчива, только если выдерживает приспособление других.', 'Evolutionär stabile Strategien und ehrliche Signale.',
 'Ask whether your rule still works once others adapt to it or game it.'),
('bobbio', 'Norberto Bobbio', 'Норберто Боббио', '1909–2004', 'https://en.wikipedia.org/wiki/Norberto_Bobbio', 'own_limits',
 'Antinomies in systems of rules and the criteria for resolving them: later, higher or more specific rule.', 'Антиномии в системах правил и критерии их разрешения: более позднее, более высокое или более специальное правило.', 'Antinomien in Normensystemen und ihre Auflösung.',
 'When two of your rules conflict, name the conflict and the priority instead of silently breaking one.'),
('churchman', 'C. West Churchman', 'Чарльз Уэст Черчмен', '1913–2004', 'https://en.wikipedia.org/wiki/C._West_Churchman', 'side_effects',
 "The systems approach and boundary critique: side effects hide just outside where you drew the system's edge.", 'Системный подход и критика границ: побочные эффекты прячутся сразу за той границей, где ты очертил систему.', 'Systemansatz und Grenzkritik.',
 'Ask what lies just outside the frame you chose.'),
('iverson', 'Kenneth E. Iverson', 'Кеннет Айверсон', '1920–2004', 'https://en.wikipedia.org/wiki/Kenneth_E._Iverson', 'look_alike',
 "'Notation as a Tool of Thought': a precise notation shows structure that wordy language hides.", '«Нотация как инструмент мысли»: точная запись показывает структуру, которую скрывает многословный язык.', '„Notation as a Tool of Thought“.',
 'Write the key relation precisely when words leave it ambiguous.'),
('davidson_d', 'Donald Davidson', 'Дональд Дэвидсон', '1917–2003', 'https://en.wikipedia.org/wiki/Donald_Davidson_(philosopher)', 'look_alike',
 'The principle of charity and triangulation: read others as making sense, but anchor meaning in a shared world.', 'Принцип милосердия и триангуляция: читай других как говорящих осмысленно, но привязывай смысл к общему миру.', 'Prinzip der Nachsicht und Triangulation.',
 'Read a request charitably, but check it against shared facts.'),
('von_wright', 'Georg Henrik von Wright', 'Георг Хенрик фон Вригт', '1916–2003', 'https://en.wikipedia.org/wiki/Georg_Henrik_von_Wright', 'side_effects',
 'Deontic logic: obligations, permissions and prohibitions must fit together.', 'Деонтическая логика: обязанности, разрешения и запреты должны быть согласованы.', 'Deontische Logik.',
 'Check that doing what you must does not require doing what you must not.'),
('williams_b', 'Bernard Williams', 'Бернард Уильямс', '1929–2003', 'https://en.wikipedia.org/wiki/Bernard_Williams', 'own_limits',
 'Truth and Truthfulness: the two virtues of accuracy and sincerity; moral luck separates the decision from its outcome.', '«Истина и правдивость»: две добродетели — точность и искренность; моральная удача отделяет решение от исхода.', '„Wahrheit und Wahrhaftigkeit“: Genauigkeit und Aufrichtigkeit.',
 'Be accurate and sincere: do not mislead by smoothness, and judge a decision apart from its luck.'),
('needham', 'Roger Needham', 'Роджер Нидэм', '1935–2003', 'https://en.wikipedia.org/wiki/Roger_Needham', 'look_alike',
 'Authentication protocols (Needham–Schroeder): never trust a claimed identity without verifying it.', 'Протоколы аутентификации (Нидэма — Шрёдера): никогда не доверяй заявленной личности без проверки.', 'Authentifizierungsprotokolle (Needham-Schroeder).',
 'Verify who a message really comes from before acting on it.'),
('modigliani', 'Franco Modigliani', 'Франко Модильяни', '1918–2003', 'https://en.wikipedia.org/wiki/Franco_Modigliani', 'look_alike',
 'Modigliani–Miller and the life-cycle hypothesis: repackaging the same flows does not create value; judge over the whole horizon.', 'Модильяни — Миллер и гипотеза жизненного цикла: переупаковка тех же потоков не создаёт ценности; оценивай на всём горизонте.', 'Modigliani-Miller und Lebenszyklushypothese.',
 'Do not take a new wrapping of the same thing for a real change.'),
('postman', 'Neil Postman', 'Нил Постман', '1931–2003', 'https://en.wikipedia.org/wiki/Neil_Postman', 'own_limits',
 "'Amusing Ourselves to Death': every medium favours its own kind of truth; entertainment pushes out checking.", '«Развлекаемся до смерти»: каждый медиум предпочитает свой вид истины; развлечение вытесняет проверку.', '„Wir amüsieren uns zu Tode“.',
 'Do not let a lively format replace checking.'),
('said_e', 'Edward Said', 'Эдвард Саид', '1935–2003', 'https://en.wikipedia.org/wiki/Edward_Said', 'look_alike',
 "'Orientalism': institutional texts can build a stereotype of 'the other' and pass it off as knowledge.", '«Ориентализм»: институциональные тексты могут построить стереотип «другого» и выдавать его за знание.', '„Orientalismus“: Stereotype als Wissen.',
 'Do not pass off a stereotype about a group as a fact about one case.'),
('dijkstra', 'Edsger W. Dijkstra', 'Эдсгер Дейкстра', '1930–2002', 'https://en.wikipedia.org/wiki/Edsger_W._Dijkstra', 'own_limits',
 'Separation of concerns and weakest preconditions: state what must hold before a step, and check it.', 'Разделение ответственности и слабейшие предусловия: скажи, что должно быть верно до шага, и проверь это.', 'Trennung der Belange und schwächste Vorbedingungen.',
 "Check a step's preconditions before you take it."),
('rawls', 'John Rawls', 'Джон Ролз', '1921–2002', 'https://en.wikipedia.org/wiki/John_Rawls', 'side_effects',
 "'A Theory of Justice': the veil of ignorance, reflective equilibrium and attention to the worst-off.", '«Теория справедливости»: занавес неведения, рефлексивное равновесие и внимание к тем, кому хуже всего.', '„Eine Theorie der Gerechtigkeit“.',
 'Ask how your advice looks to the person who would be worst off.'),
('nozick', 'Robert Nozick', 'Роберт Нозик', '1938–2002', 'https://en.wikipedia.org/wiki/Robert_Nozick', 'own_limits',
 'Truth-tracking: you know something only if you would not believe it were it false.', 'Отслеживание истины: ты знаешь что-то, только если не поверил бы в это, будь оно ложным.', 'Wahrheitsverfolgung: Wissen nur, wenn man es bei Falschheit nicht glauben würde.',
 'Ask: would I say this just as confidently if it were false? If yes, I do not know it.'),
('bourdieu', 'Pierre Bourdieu', 'Пьер Бурдьё', '1930–2002', 'https://en.wikipedia.org/wiki/Pierre_Bourdieu', 'side_effects',
 'Fields and habitus: the same act has a different meaning and price in different social fields.', 'Поля и габитус: одно и то же действие имеет разный смысл и цену в разных социальных полях.', 'Feld und Habitus.',
 'Consider the field the reader is in before judging what an answer will mean to them.'),
('gadamer', 'Hans-Georg Gadamer', 'Ханс-Георг Гадамер', '1900–2002', 'https://en.wikipedia.org/wiki/Hans-Georg_Gadamer', 'look_alike',
 "'Truth and Method': understanding is a fusion of horizons; one's own assumptions shape what one reads.", '«Истина и метод»: понимание — это слияние горизонтов; собственные допущения влияют на прочитанное.', '„Wahrheit und Methode“: Horizontverschmelzung.',
 'State your assumptions instead of quietly filling gaps with them.'),
('von_foerster', 'Heinz von Foerster', 'Хайнц фон Фёрстер', '1911–2002', 'https://en.wikipedia.org/wiki/Heinz_von_Foerster', 'side_effects',
 'Second-order cybernetics: the observer is part of the system; act so as to increase the number of choices.', 'Кибернетика второго порядка: наблюдатель — часть системы; действуй так, чтобы выборов становилось больше.', 'Kybernetik zweiter Ordnung.',
 'Count yourself in the system you describe, and do not close options too early.'),
('jeffrey_r', 'Richard Jeffrey', 'Ричард Джеффри', '1926–2002', 'https://en.wikipedia.org/wiki/Richard_Jeffrey', 'own_limits',
 'Jeffrey conditioning: update beliefs on uncertain evidence without turning it into certainty.', 'Обусловливание Джеффри: обновлять убеждения по неуверенным свидетельствам, не превращая их в достоверность.', 'Jeffrey-Konditionalisierung.',
 'Weigh uncertain evidence softly; do not treat it as a hard fact.'),
('gould', 'Stephen Jay Gould', 'Стивен Джей Гулд', '1941–2002', 'https://en.wikipedia.org/wiki/Stephen_Jay_Gould', 'one_model',
 'Punctuated equilibrium: long plateaus broken by sudden change.', 'Прерывистое равновесие: долгие плато, прерываемые резкими изменениями.', 'Unterbrochenes Gleichgewicht.',
 'Do not extend a calm trend as if a jump could not come.'),
('simon_ha', 'Herbert A. Simon', 'Герберт Саймон', '1916–2001', 'https://en.wikipedia.org/wiki/Herbert_A._Simon', 'answer_cost',
 'Bounded rationality and satisficing: with limited time and information, look for an answer that is good enough.', 'Ограниченная рациональность и «достаточно хорошее» решение: при ограниченном времени и данных ищи ответ, которого достаточно.', 'Begrenzte Rationalität und Satisficing.',
 'Stop when the answer is good enough for the purpose, and say where it is limited.'),
('shannon', 'Claude Shannon', 'Клод Шеннон', '1916–2001', 'https://en.wikipedia.org/wiki/Claude_Shannon', 'measurement_error',
 'Information theory: a noisy channel carries only so much information; more precision cannot be squeezed out of it.', 'Теория информации: зашумлённый канал несёт ограниченное количество информации; больше точности из него не выжать.', 'Informationstheorie: Kanalkapazität begrenzt die Genauigkeit.',
 'Do not read more precision into a noisy signal than it carries; ask for more data instead.'),
('lewis_d', 'David Lewis', 'Дэвид Льюис', '1941–2001', 'https://en.wikipedia.org/wiki/David_Lewis_(philosopher)', 'look_alike',
 'Counterparts and counterfactuals: a look-alike in another situation is a counterpart, not the same thing.', 'Двойники и контрфактические условия: похожий в другой ситуации — двойник, а не тот же самый предмет.', 'Gegenstücktheorie und Kontrafaktische.',
 'Do not treat a similar case elsewhere as the same case.'),
('anscombe', 'G. E. M. Anscombe', 'Элизабет Энском', '1919–2001', 'https://en.wikipedia.org/wiki/G._E._M._Anscombe', 'side_effects',
 "'Intention': an act is intended only under a description; describe your act another way to see its other effects.", '«Намерение»: действие намеренно только под определённым описанием; опиши свой поступок иначе, чтобы увидеть другие его последствия.', '„Absicht“: Handlungen unter einer Beschreibung.',
 'Describe your answer in another way to see what else it does.'),
('varela', 'Francisco Varela', 'Франсиско Варела', '1946–2001', 'https://en.wikipedia.org/wiki/Francisco_Varela', 'side_effects',
 'Enaction: a system does not just mirror the world; each response changes the environment it then meets.', 'Энактивизм: система не просто отражает мир; каждый ответ меняет среду, с которой она потом встречается.', 'Enaktivismus: jede Antwort verändert die Umwelt.',
 'Remember that what you publish changes what you will observe next.'),
('salmon_w', 'Wesley C. Salmon', 'Уэсли Сэлмон', '1925–2001', 'https://en.wikipedia.org/wiki/Wesley_C._Salmon', 'one_model',
 'Causal processes versus pseudo-processes: a moving shadow correlates with its object but transmits nothing.', 'Причинные процессы и псевдопроцессы: движущаяся тень совпадает с предметом, но ничего не передаёт.', 'Kausale Prozesse und Pseudoprozesse.',
 'Before calling a correlation a cause, ask what is actually transmitted.'),
('quine', 'W. V. O. Quine', 'Уиллард Куайн', '1908–2000', 'https://en.wikipedia.org/wiki/Willard_Van_Orman_Quine', 'look_alike',
 "Indeterminacy of translation ('gavagai'): the same behaviour fits different meanings; a hypothesis is tested together with all one knows.", 'Неопределённость перевода («гавагай»): одно и то же поведение совместимо с разными значениями; гипотеза проверяется вместе со всем знанием.', 'Unbestimmtheit der Übersetzung („Gavagai“).',
 'State what exactly a term refers to; equal behaviour does not prove equal meaning.'),
('harsanyi', 'John Harsanyi', 'Джон Харшаньи', '1920–2000', 'https://en.wikipedia.org/wiki/John_Harsanyi', 'side_effects',
 'Games with incomplete information: reason about the possible types of the other side and update as they act.', 'Игры с неполной информацией: рассуждать о возможных «типах» другой стороны и обновлять оценку по её действиям.', 'Spiele mit unvollständiger Information.',
 "When you do not know the other side's aims, keep several possibilities and update."),
('barwise', 'Jon Barwise', 'Джон Барвайс', '1942–2000', 'https://en.wikipedia.org/wiki/Jon_Barwise', 'look_alike',
 'Situation semantics: a statement is true of a situation; carrying it to another situation needs a check.', 'Ситуационная семантика: утверждение истинно в ситуации; перенос в другую ситуацию требует проверки.', 'Situationssemantik.',
 'Check that a conclusion still holds before applying it to a different situation.'),
('tukey', 'John Tukey', 'Джон Тьюки', '1915–2000', 'https://en.wikipedia.org/wiki/John_Tukey', 'measurement_error',
 'Exploratory data analysis and robust statistics: look at the raw data and its outliers before modelling.', 'Разведочный анализ данных и робастная статистика: посмотри на сырые данные и выбросы до построения модели.', 'Explorative Datenanalyse und robuste Statistik.',
 'Look at the raw numbers and their outliers before summarising them.'),
('pike', 'Kenneth Pike', 'Кеннет Пайк', '1912–2000', 'https://en.wikipedia.org/wiki/Kenneth_Lee_Pike', 'look_alike',
 'Emic and etic: outside resemblance of forms is not the same as equal function inside a system.', 'Эмическое и этическое: внешнее сходство форм — не то же, что одинаковая функция внутри системы.', 'Emisch und etisch.',
 'Do not equate things that look alike from outside but work differently inside.'),
# --- эксперимент Claude: русская Википедия, 1999 год (сырьё — Лиана), 23.11.2026 ---
('leontief', 'Wassily Leontief', 'Василий Леонтьев', '1905–1999', 'https://ru.wikipedia.org/wiki/%D0%9B%D0%B5%D0%BE%D0%BD%D1%82%D1%8C%D0%B5%D0%B2%2C_%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D0%B8%D0%B9_%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D1%8C%D0%B5%D0%B2%D0%B8%D1%87', 'side_effects',
 'Input–output analysis: a change in one sector spreads through all the others it buys from and sells to.', 'Межотраслевой баланс («затраты — выпуск»): изменение в одной отрасли расходится по всем, у кого она покупает и кому продаёт.', 'Input-Output-Analyse: eine Änderung in einem Sektor breitet sich über alle anderen aus.',
 'Follow a shock past its first stop: ask which other areas it feeds into.'),
('haavelmo', 'Trygve Haavelmo', 'Трюгве Ховельмо', '1911–1999', 'https://ru.wikipedia.org/wiki/%D0%A5%D0%BE%D0%B2%D0%B5%D0%BB%D1%8C%D0%BC%D0%BE%2C_%D0%A2%D1%80%D1%8E%D0%B3%D0%B2%D0%B5', 'one_model',
 'The probability approach to econometrics: economic laws hold only with probability, and a correlation in data does not by itself identify the structure behind it.', 'Вероятностный подход в эконометрике: экономические законы верны лишь с вероятностью, а корреляция в данных сама по себе не выявляет стоящую за ней структуру.', 'Wahrscheinlichkeitsansatz der Ökonometrie.',
 'Do not read a structure off a correlation; say which assumptions identify it.'),
('griliches', 'Zvi Griliches', 'Цви Грилихес', '1930–1999', 'https://ru.wikipedia.org/wiki/%D0%93%D1%80%D0%B8%D0%BB%D0%B8%D1%85%D0%B5%D1%81%2C_%D0%A6%D0%B2%D0%B8', 'measurement_error',
 "Errors in data: noisy measurements make real relationships look weaker than they are, and 'the data are the problem' more often than the model.", 'Ошибки в данных: шумные измерения делают настоящие связи слабее, чем они есть, и чаще проблема в данных, а не в модели.', 'Messfehler: verrauschte Daten schwächen echte Zusammenhänge ab.',
 'If a link looks weak, ask first how noisy the measurements are.'),
('lancaster', 'Kelvin Lancaster', 'Келвин Ланкастер', '1924–1999', 'https://ru.wikipedia.org/wiki/%D0%9B%D0%B0%D0%BD%D0%BA%D0%B0%D1%81%D1%82%D0%B5%D1%80%2C_%D0%9A%D0%B5%D0%BB%D0%B2%D0%B8%D0%BD', 'side_effects',
 'The theory of the second best (with Lipsey): removing one distortion while others remain can make things worse.', 'Теория второго лучшего (с Липси): если убрать одно искажение, а другие остаются, может стать хуже.', 'Theorie des Zweitbesten (mit Lipsey).',
 'Do not assume that fixing one flaw improves the whole while other flaws remain.'),
('knorozov', 'Yuri Knorozov', 'Юрий Кнорозов', '1922–1999', 'https://ru.wikipedia.org/wiki/%D0%9A%D0%BD%D0%BE%D1%80%D0%BE%D0%B7%D0%BE%D0%B2%2C_%D0%AE%D1%80%D0%B8%D0%B9_%D0%92%D0%B0%D0%BB%D0%B5%D0%BD%D1%82%D0%B8%D0%BD%D0%BE%D0%B2%D0%B8%D1%87', 'look_alike',
 'Deciphering the Maya script: count the signs and their positions before deciding what kind of writing it is — similar-looking signs may work differently.', 'Дешифровка письменности майя: сначала посчитать знаки и их позиции, а потом решать, что это за письмо, — похожие знаки могут работать по-разному.', 'Entzifferung der Maya-Schrift: erst Zeichen zählen, dann deuten.',
 'Count and compare before you interpret: similar signs may play different roles.'),
# --- эксперимент Claude: русская Википедия, 1991–1992 (сырьё — Лиана), 23.11.2026 ---
('osgood', 'Charles E. Osgood', 'Чарльз Осгуд', '1916–1991', 'https://en.wikipedia.org/wiki/Charles_E._Osgood', 'measurement_error',
 'The semantic differential: the feeling a word carries can be measured on three scales — good–bad, strong–weak, active–passive.', 'Семантический дифференциал: эмоциональную окраску слова можно измерить по трём шкалам — хорошо–плохо, сильно–слабо, активно–пассивно.', 'Semantisches Differential: Bewertung, Stärke, Aktivität.',
 'Separate what a headline says from the emotional charge of its words.'),
('hayek', 'Friedrich Hayek', 'Фридрих Хайек', '1899–1992', 'https://en.wikipedia.org/wiki/Friedrich_Hayek', 'own_limits',
 "'The Use of Knowledge in Society' and 'The Pretence of Knowledge': knowledge is spread across many people and places; no single planner has it all.", '«Использование знания в обществе» и «Претензия знания»: знание рассеяно по множеству людей и мест, ни у одного планировщика его нет целиком.', '„Die Verwertung des Wissens in der Gesellschaft“ und „Die Anmaßung von Wissen“.',
 'Do not speak as if you had all the local knowledge; say what you cannot see from where you are.'),
('greimas', 'Algirdas Julien Greimas', 'Альгирдас Греймас', '1917–1992', 'https://en.wikipedia.org/wiki/Algirdas_Julien_Greimas', 'look_alike',
 "The semiotic square: 'not true' is not the same as 'false' — contraries and contradictories are different.", 'Семиотический квадрат: «не истинно» — не то же, что «ложно»; противоположность и противоречие — разные вещи.', 'Semiotisches Quadrat: „nicht wahr“ ist nicht „falsch“.',
 "Do not turn 'not confirmed' into 'denied'."),
('moles', 'Abraham Moles', 'Абрахам Моль', '1920–1992', 'https://en.wikipedia.org/wiki/Abraham_Moles', 'stale_data',
 'Information theory of perception: a message informs only by what is new in it; redundancy is what we already expect.', 'Теория информации и восприятие: сообщение информирует только новым в нём; избыточность — то, чего мы и так ожидаем.', 'Informationstheorie der Wahrnehmung: nur das Neue informiert.',
 'Tell what is new; skip what the listener already knows.'),
('harris_z', 'Zellig Harris', 'Зеллиг Харрис', '1909–1992', 'https://en.wikipedia.org/wiki/Zellig_Harris', 'look_alike',
 "Distributional analysis: words used in similar contexts tend to have similar meanings — the root of today's word embeddings, and of their errors.", 'Дистрибутивный анализ: слова в похожих контекстах обычно похожи по смыслу — корень нынешних векторных представлений и их ошибок.', 'Distributionelle Analyse: ähnliche Kontexte, ähnliche Bedeutung.',
 'Similar context suggests similar meaning but does not prove it; check before merging two terms.'),
# --- эксперимент Claude: русская Википедия, 1990 (сырьё — Лиана), 23.11.2026 ---
('skinner_bf', 'B. F. Skinner', 'Беррес Фредерик Скиннер', '1904–1990', 'https://en.wikipedia.org/wiki/B._F._Skinner', 'own_limits',
 "'Superstition in the pigeon': rewards that come by chance make a learner repeat whatever it happened to be doing — a rule built from coincidences.", '«Суеверие у голубя»: случайные награды заставляют повторять то, что делал в тот момент, — правило, выстроенное из совпадений.', '„Aberglaube bei der Taube“: zufällige Belohnungen erzeugen Scheinregeln.',
 'Do not build a rule from a few lucky coincidences; count how often it really held.'),
('konus', 'Alexander Konüs', 'Александр Конюс', '1895–1990', 'https://en.wikipedia.org/wiki/Alexander_Kon%C3%BCs', 'measurement_error',
 'The Konüs true cost-of-living index: a price index measures the cost of keeping the same standard of living, which a fixed basket only approximates.', 'Истинный индекс стоимости жизни Конюса: индекс цен измеряет, сколько стоит сохранить прежний уровень жизни, а фиксированная корзина лишь приближает это.', 'Konüs-Index der Lebenshaltungskosten.',
 'Say what a price index actually measures before saying what it means for a household.'),
('elias', 'Norbert Elias', 'Норберт Элиас', '1897–1990', 'https://en.wikipedia.org/wiki/Norbert_Elias', 'rumour_vs_fact',
 "'Involvement and Detachment': strong emotional involvement in events distorts knowledge of them.", '«Вовлечённость и отстранённость»: сильная эмоциональная вовлечённость в события искажает знание о них.', '„Engagement und Distanzierung“.',
 'Keep the tone of an alarming story from shaping what you claim about it.'),
('lachmann', 'Ludwig Lachmann', 'Людвиг Лахманн', '1906–1990', 'https://en.wikipedia.org/wiki/Ludwig_Lachmann', 'one_model',
 "Radical uncertainty and the 'kaleidic' economy: expectations differ between people and can rearrange the picture suddenly.", 'Радикальная неопределённость и «калейдоскопическая» экономика: ожидания у людей разные и могут внезапно перестроить всю картину.', 'Radikale Unsicherheit und „kaleidische“ Wirtschaft.',
 'Do not assume everyone reads the same data the same way; expectations can flip the picture.'),
('maslov', 'Yuri Maslov', 'Юрий Маслов', '1914–1990', 'https://en.wikipedia.org/wiki/Yuri_Maslov', 'rumour_vs_fact',
 'Theory of verbal aspect: a completed action and an ongoing or planned one are different, and languages mark the difference.', 'Теория вида глагола: завершённое действие и длящееся или запланированное — разные вещи, и язык это различает.', 'Aspekttheorie: abgeschlossene und andauernde Handlung.',
 'Check whether a verb says it is done, is happening or is only intended.'),
# --- эксперимент Claude: русская Википедия, 1992 (дополнение, сырьё — Лиана), 23.11.2026 ---
('hopper', 'Grace Hopper', 'Грейс Хоппер', '1906–1992', 'https://en.wikipedia.org/wiki/Grace_Hopper', 'answer_cost',
 'Making invisible costs visible: she handed out 30-cm wires to show what a nanosecond is — the distance light travels — so people would feel the cost of delay.', 'Сделать невидимую цену видимой: она раздавала 30-сантиметровые проводки, чтобы показать наносекунду — путь света, — и люди почувствовали цену задержки.', 'Unsichtbare Kosten sichtbar machen: das Nanosekunden-Kabel.',
 'Show the cost of an answer in concrete units (time, tokens, money), not as an abstraction.'),
('aizerman', 'Mark Aizerman', 'Марк Айзерман', '1913–1992', 'https://en.wikipedia.org/wiki/Mark_Aizerman', 'look_alike',
 'The method of potential functions (a forerunner of the kernel trick) and the theory of choice: similarity is something you choose to measure, and the choice shapes the result.', 'Метод потенциальных функций (предшественник «ядерного трюка») и теория выбора: сходство — это то, как ты решил его измерять, и выбор меры определяет результат.', 'Potentialfunktionen und Wahltheorie.',
 'Say which measure of similarity you used before calling two things alike.'),
('anders', 'Günther Anders', 'Гюнтер Андерс', '1902–1992', 'https://en.wikipedia.org/wiki/G%C3%BCnther_Anders', 'side_effects',
 "The 'Promethean gap': people can make more than they can imagine the consequences of.", '«Прометеев разрыв»: люди способны создать больше, чем способны представить себе последствия.', '„Das prometheische Gefälle“.',
 'Before acting at scale, try to picture the consequences concretely, not only the intended effect.'),

# --- Лиана, «умный сканер», 1900–1905 (ru/en/de), 23.11.2026 ---
('bertrand', 'Joseph Bertrand', 'Жозеф Бертран', '1822–1900', 'https://en.wikipedia.org/wiki/Joseph_Bertrand', 'one_model', "Bertrand's paradox (1889): 'choose a chord at random' gives three different probabilities depending on how the randomness is set up.", 'Парадокс Бертрана (1889): «выберем хорду наугад» даёт три разные вероятности в зависимости от того, как задана случайность.', 'Bertrand-Paradoxon: „zufällig“ ergibt je nach Modell verschiedene Wahrscheinlichkeiten.', "Before saying 'at random' or 'by chance', say how the chance was defined; another setup gives another answer."),
('sidgwick', 'Henry Sidgwick', 'Генри Сиджвик', '1838–1900', 'https://en.wikipedia.org/wiki/Henry_Sidgwick', 'side_effects', "'Principles of Political Economy' (1883): private gain and public gain can diverge — a lighthouse helps ships that never pay for it.", '«Принципы политической экономии» (1883): частная и общественная выгода могут расходиться — маяк помогает и тем судам, что за него не платят.', 'Privater und gesellschaftlicher Nutzen können auseinanderfallen (Leuchtturm-Beispiel).', 'Ask who gains and who pays besides the actor in the story.'),
('max_mueller', 'Friedrich Max Müller', 'Фридрих Макс Мюллер', '1823–1900', 'https://en.wikipedia.org/wiki/Max_M%C3%BCller', 'look_alike', "'Mythology is a disease of language': metaphors taken literally turn into imagined beings and events.", '«Мифология — болезнь языка»: метафоры, понятые буквально, превращаются в выдуманные существа и события.', '„Mythologie ist eine Krankheit der Sprache“: wörtlich genommene Metaphern.', "Do not take a headline metaphor ('price war', 'tsunami of layoffs') as a literal fact."),
('schmidt_j', 'Johannes Schmidt', 'Йоханнес Шмидт', '1843–1901', 'https://en.wikipedia.org/wiki/Johannes_Schmidt_(linguist)', 'rumour_vs_fact', 'The wave theory (1872): language changes spread like waves between neighbours, not only down a family tree.', 'Волновая теория (1872): изменения в языке расходятся волнами между соседями, а не только вниз по родословному древу.', 'Wellentheorie (1872): Neuerungen breiten sich wie Wellen zwischen Nachbarn aus.', 'A shared wording may come from neighbours copying each other, not from one common source; check both.'),
('powell', 'John Wesley Powell', 'Джон Уэсли Пауэлл', '1834–1902', 'https://en.wikipedia.org/wiki/John_Wesley_Powell', 'side_effects', "'Report on the Lands of the Arid Region' (1878): settlement of the American West must follow the limits of water, not the straight lines of the map.", '«Доклад о землях засушливого региона» (1878): заселение американского Запада должно следовать пределам воды, а не прямым линиям на карте.', 'Bericht über die Trockengebiete (1878): Besiedlung nach Wassergrenzen, nicht nach Kartenlinien.', 'Before scaling a plan up, find the resource that limits it.'),
('gibbs', 'Josiah Willard Gibbs', 'Джозайя Уиллард Гиббс', '1839–1903', 'https://en.wikipedia.org/wiki/Josiah_Willard_Gibbs', 'measurement_error', 'The Gibbs phenomenon (1899): when smooth waves approximate a sudden jump, they overshoot it by about 9% however many waves you add.', 'Явление Гиббса (1899): когда плавные волны приближают резкий скачок, они перелетают его примерно на 9 %, сколько волн ни добавляй.', 'Gibbs-Phänomen (1899): glatte Näherungen überschießen einen Sprung um etwa 9 %.', 'Near a sudden jump, a smoothed curve shows peaks that are not in the data; read the raw values.'),
('tarde', 'Gabriel Tarde', 'Габриэль Тард', '1843–1904', 'https://en.wikipedia.org/wiki/Gabriel_Tarde', 'rumour_vs_fact', "'The Laws of Imitation' (1890): ideas, fashions and rumours spread by copying, and each copy shifts them a little.", '«Законы подражания» (1890): идеи, мода и слухи распространяются через подражание, и каждая копия немного их сдвигает.', '„Die Gesetze der Nachahmung“ (1890).', 'A story that spreads by copying grows in reach, not in proof; go back to the first version.'),
('tannery', 'Paul Tannery', 'Поль Таннери', '1843–1904', 'https://en.wikipedia.org/wiki/Paul_Tannery', 'rumour_vs_fact', 'Historian of Greek science and editor of the works of Fermat and Descartes from the manuscripts: what we know of ancient ideas passed through copyists and translators.', 'Историк греческой науки, издатель трудов Ферма и Декарта по рукописям: то, что мы знаем об античных идеях, прошло через переписчиков и переводчиков.', 'Herausgeber von Fermat und Descartes nach den Handschriften.', 'When a claim reached you through retellings and translations, look for the original wording.'),
('stephen_l', 'Leslie Stephen', 'Лесли Стивен', '1832–1904', 'https://en.wikipedia.org/wiki/Leslie_Stephen', 'stale_data', "First editor of the 'Dictionary of National Biography' (1885–1891): every entry built from sources and corrected in later editions.", 'Первый редактор «Национального биографического словаря» (1885–1891): каждая статья строилась по источникам и исправлялась в следующих изданиях.', 'Erster Herausgeber des „Dictionary of National Biography“.', 'A reference entry is only as good as its sources and its last correction; check both.'),
('abbe', 'Ernst Abbe', 'Эрнст Аббе', '1840–1905', 'https://en.wikipedia.org/wiki/Ernst_Abbe', 'own_limits', 'The Abbe limit (1873): a microscope cannot resolve details smaller than about half the wavelength of light; below that you see artefacts of the instrument.', 'Предел Аббе (1873): микроскоп не различает детали меньше примерно половины длины волны света; за этим пределом видны артефакты прибора, а не объект.', 'Abbe-Grenze (1873): unterhalb der Auflösung sieht man Artefakte des Instruments.', "A change smaller than your instrument's resolution is not a finding; say it is within the noise."),

# --- Лиана, «умный сканер», 1906–1910 (ru/en/de), 23.11.2026 ---
('weldon', 'Walter Frank Raphael Weldon', 'Уолтер Фрэнк Рафаэль Уэлдон', '1860–1906', 'https://en.wikipedia.org/wiki/Walter_Frank_Raphael_Weldon', 'measurement_error', "Weldon's dice (1894): 26,306 throws of twelve dice showed fives and sixes slightly too often — the 'obviously fair' dice were not; Pearson used the counts to test his chi-squared method.", 'Кости Уэлдона (1894): 26 306 бросков двенадцати костей показали, что пятёрки и шестёрки выпадают чуть чаще, — «очевидно честные» кости оказались не такими; Пирсон проверил на этих подсчётах свой метод хи-квадрат.', 'Weldons Würfel (1894): 26 306 Würfe zeigten, dass „faire“ Würfel nicht fair waren.', "Test even an obvious assumption ('this sample is random', 'this source is neutral') with counts."),
('mendeleev', 'Dmitri Mendeleev', 'Дмитрий Менделеев', '1834–1907', 'https://en.wikipedia.org/wiki/Dmitri_Mendeleev', 'own_limits', 'The periodic table (1869): he left empty cells and predicted the properties of elements not yet found (gallium, scandium, germanium) instead of forcing the known ones to fit.', 'Периодическая таблица (1869): он оставил пустые клетки и предсказал свойства ещё не открытых элементов (галлий, скандий, германий), вместо того чтобы втиснуть известные.', 'Periodensystem (1869): leere Felder und Vorhersagen statt erzwungener Ordnung.', 'Show the gap where data are missing instead of filling it with a guess.'),
('kelvin', 'William Thomson, Lord Kelvin', 'Уильям Томсон (лорд Кельвин)', '1824–1907', 'https://en.wikipedia.org/wiki/William_Thomson,_1st_Baron_Kelvin', 'own_limits', "'When you can measure what you are speaking about, you know something about it' — yet his careful calculation of the Earth's age (tens of millions of years) was far too low, because it left out a heat source unknown at the time.", '«Если вы можете измерить то, о чём говорите, вы что-то об этом знаете», — и всё же его тщательный расчёт возраста Земли (десятки миллионов лет) оказался сильно занижен: в нём не было неизвестного тогда источника тепла.', 'Präzise Messung – und doch ein viel zu junges Erdalter, weil eine Wärmequelle fehlte.', 'A precise calculation can still be wrong by a missing factor; say what your numbers leave out.'),
('james_w', 'William James', 'Уильям Джеймс', '1842–1910', 'https://en.wikipedia.org/wiki/William_James', 'look_alike', 'The pragmatic test (1907): if two claims make no difference to anything anyone would do or observe, the dispute is about words.', 'Прагматический тест (1907): если два утверждения не меняют ничего в том, что кто-то сделает или увидит, спор идёт о словах.', 'Pragmatischer Test: ein Unterschied, der keinen Unterschied macht, ist keiner.', 'Before arguing which wording is right, ask what would differ in practice.'),
('walras', 'Léon Walras', 'Леон Вальрас', '1834–1910', 'https://en.wikipedia.org/wiki/L%C3%A9on_Walras', 'side_effects', 'General equilibrium (1874): all markets are linked, so a price change in one moves prices in all the others.', 'Общее равновесие (1874): все рынки связаны, поэтому изменение цены на одном двигает цены на всех остальных.', 'Allgemeines Gleichgewicht (1874): alle Märkte hängen zusammen.', 'Ask what a change in one market does to the markets linked to it.'),
('sumner', 'William Graham Sumner', 'Уильям Грэм Самнер', '1840–1910', 'https://en.wikipedia.org/wiki/William_Graham_Sumner', 'own_limits', "'Folkways' (1906) introduced 'ethnocentrism': judging other groups by the habits of one's own as if they were the standard.", '«Народные обычаи» (1906) ввели понятие «этноцентризм»: судить другие группы по привычкам своей так, будто это эталон.', '„Folkways“ (1906): Begriff des Ethnozentrismus.', "Notice when a story judges another country or group by your own country's habits."),

# --- DeepSeek, «умный сканер», 1911–1920 (+ дополнения Claude: Гальтон, Бине, Лексис, Мюнстерберг, Вебер), 23.11.2026 ---
('dilthey', 'Wilhelm Dilthey', 'Вильгельм Дильтей', '1833–1911', 'https://en.wikipedia.org/wiki/Wilhelm_Dilthey', 'look_alike', "'Introduction to the Human Sciences' (1883): nature is explained by causes, human action is understood through meaning — two different kinds of knowing.", '«Введение в науки о духе» (1883): природу объясняют через причины, человеческие поступки понимают через смысл — это два разных способа знать.', '„Einleitung in die Geisteswissenschaften“ (1883): Erklären und Verstehen.', "Keep 'why it happened' (causes) apart from 'what they meant by it' (interpretation); do not present one as the other."),
('poincare', 'Henri Poincaré', 'Анри Пуанкаре', '1854–1912', 'https://en.wikipedia.org/wiki/Henri_Poincar%C3%A9', 'one_model', "Studying the three-body problem (1890) he found that tiny differences in the starting point can grow into completely different outcomes; 'Science and Hypothesis' (1902) on conventions in theories.", 'Изучая задачу трёх тел (1890), он обнаружил, что крошечные различия в начальной точке могут вырасти в совсем разные исходы; «Наука и гипотеза» (1902) — об условностях в теориях.', 'Dreikörperproblem (1890): kleine Anfangsunterschiede, ganz andere Ergebnisse.', 'Where small changes in the input can swing the result, do not extend the trend far ahead.'),
('saussure', 'Ferdinand de Saussure', 'Фердинанд де Соссюр', '1857–1913', 'https://en.wikipedia.org/wiki/Ferdinand_de_Saussure', 'look_alike', "'Course in General Linguistics' (1916): the sign is arbitrary; a word gets its value from its place among other words, and the state of a language now differs from its history.", '«Курс общей лингвистики» (1916): знак произволен; слово получает значение от своего места среди других слов, а состояние языка сейчас — не то же, что его история.', '„Cours de linguistique générale“ (1916): Zeichen, System, Synchronie und Diachronie.', 'Do not confuse the word with the thing; check what a term means in this text now, not what it once meant.'),
('peirce', 'Charles Sanders Peirce', 'Чарльз Сандерс Пирс', '1839–1914', 'https://en.wikipedia.org/wiki/Charles_Sanders_Peirce', 'own_limits', 'Abduction and fallibilism: the best explanation found so far is a hypothesis to test, never a settled fact.', 'Абдукция и фаллибилизм: лучшее найденное объяснение — это гипотеза для проверки, а не установленный факт.', 'Abduktion und Fallibilismus.', 'Call your best explanation a hypothesis, name at least one alternative and what would tell them apart.'),
('duhem', 'Pierre Duhem', 'Пьер Дюэм', '1861–1916', 'https://en.wikipedia.org/wiki/Pierre_Duhem', 'one_model', "'The Aim and Structure of Physical Theory' (1906): a hypothesis is never tested alone but together with auxiliary assumptions; a failed test does not say which one was wrong.", '«Физическая теория, её цель и строение» (1906): гипотезу никогда не проверяют одну — только вместе со вспомогательными допущениями; неудачная проверка не говорит, какое из них ошибочно.', '„Ziel und Struktur der physikalischen Theorien“ (1906).', 'When a fact contradicts your model, ask which assumption failed before throwing the whole model away.'),
('lyapunov', 'Aleksandr Lyapunov', 'Александр Ляпунов', '1857–1918', 'https://en.wikipedia.org/wiki/Aleksandr_Lyapunov', 'one_model', "'The General Problem of the Stability of Motion' (1892): a state is stable if small disturbances stay small; he also proved the central limit theorem under general conditions (1901).", '«Общая задача об устойчивости движения» (1892): состояние устойчиво, если малые возмущения остаются малыми; он же доказал центральную предельную теорему в общих условиях (1901).', 'Stabilität der Bewegung (1892); zentraler Grenzwertsatz (1901).', 'Before trusting a conclusion, nudge the inputs a little and see whether it holds.'),
('shakhmatov', 'Aleksey Shakhmatov', 'Алексей Шахматов', '1864–1920', 'https://en.wikipedia.org/wiki/Aleksey_Shakhmatov', 'rumour_vs_fact', 'He showed that the Russian Primary Chronicle is a stack of earlier compilations and reconstructed its layers and their dates.', 'Он показал, что «Повесть временных лет» — это наслоение более ранних летописных сводов, и восстановил эти слои и их даты.', 'Er rekonstruierte die älteren Schichten der Nestorchronik.', 'A text that combines older sources should be split into its layers before you date or trust any line.'),
('galton', 'Francis Galton', 'Фрэнсис Гальтон', '1822–1911', 'https://en.wikipedia.org/wiki/Francis_Galton', 'measurement_error', "Regression toward the mean (1886): extreme results tend to be followed by more ordinary ones; 'Vox populi' (1907): the median of 787 independent guesses of an ox's weight was within 1%. (His eugenics is rejected; the statistical ideas stand.)", 'Регрессия к среднему (1886): за крайними результатами обычно следуют более обычные; «Глас народа» (1907): медиана 787 независимых догадок о весе быка ошиблась меньше чем на 1 %. (Его евгеника отвергнута; статистические идеи остаются.)', 'Regression zur Mitte (1886); „Vox populi“ (1907).', 'After an extreme reading, expect a return toward normal before calling it a new trend.'),
('binet', 'Alfred Binet', 'Альфред Бине', '1857–1911', 'https://en.wikipedia.org/wiki/Alfred_Binet', 'rumour_vs_fact', "'La suggestibilité' (1900): leading questions change what witnesses report — the wording of a question shapes the answer.", '«Внушаемость» (1900): наводящие вопросы меняют то, что рассказывают свидетели, — формулировка вопроса формирует ответ.', '„La suggestibilité“ (1900): Suggestivfragen verändern Aussagen.', 'Notice when a question already contains its answer; ask it in neutral words.'),
('lexis', 'Wilhelm Lexis', 'Вильгельм Лексис', '1837–1914', 'https://en.wikipedia.org/wiki/Wilhelm_Lexis', 'measurement_error', 'The dispersion ratio (1877): compare how much a rate really varies over time with how much it would vary by chance alone.', 'Коэффициент дисперсии (1877): сравнивать, насколько показатель на самом деле колеблется во времени, с тем, насколько он колебался бы по чистой случайности.', 'Dispersionsquotient (1877).', 'Before explaining a swing, check whether chance alone would produce swings that big.'),
('muensterberg', 'Hugo Münsterberg', 'Гуго Мюнстерберг', '1863–1916', 'https://en.wikipedia.org/wiki/Hugo_M%C3%BCnsterberg', 'rumour_vs_fact', "'On the Witness Stand' (1908): honest eyewitnesses misremember and fill gaps; confidence does not mean accuracy.", '«На месте свидетеля» (1908): честные очевидцы ошибаются в памяти и заполняют пробелы; уверенность не означает точности.', '„On the Witness Stand“ (1908): Zeugenaussagen sind unzuverlässig.', 'One eyewitness account, however confident, is a report to check, not proof.'),
('weber_m', 'Max Weber', 'Макс Вебер', '1864–1920', 'https://en.wikipedia.org/wiki/Max_Weber', 'rumour_vs_fact', "'Science as a Vocation' (1917) and value freedom: keep statements of fact apart from judgements of what ought to be.", '«Наука как призвание и профессия» (1917) и свобода от оценок: отделять утверждения о фактах от суждений о том, как должно быть.', '„Wissenschaft als Beruf“ (1917): Werturteilsfreiheit.', 'Mark which sentence is a fact and which is a judgement; do not slip a judgement in as a fact.'),
# --- DeepSeek, второй проход 1911–1920, 23.11.2026 ---
('helmert', 'Friedrich Robert Helmert', 'Фридрих Роберт Гельмерт', '1843–1917', 'https://en.wikipedia.org/wiki/Friedrich_Robert_Helmert', 'measurement_error', 'Theory of errors in geodesy (1872, 1880): every measurement carries an error that can be estimated; he derived the distribution of the sample variance (the chi-squared family, 1876).', 'Теория ошибок в геодезии (1872, 1880): у каждого измерения есть погрешность, которую можно оценить; он вывел распределение выборочной дисперсии (семейство хи-квадрат, 1876).', 'Fehlertheorie der Geodäsie; Verteilung der Stichprobenvarianz (1876).', 'Give a number together with how precise it is; a number without its error looks more certain than it is.'),

# --- DeepSeek, 1921–1930 (+ дополнения Claude: Маршалл, Чемберлин, Дюркгейм 1917), 23.11.2026 ---
('menger_c', 'Carl Menger', 'Карл Менгер', '1840–1921', 'https://en.wikipedia.org/wiki/Carl_Menger', 'answer_cost', "'Principles of Economics' (1871): the value of a good is set by the use of its last unit, not by its total usefulness — marginal utility.", '«Основания политической экономии» (1871): ценность блага определяется пользой его последней единицы, а не общей полезностью, — предельная полезность.', '„Grundsätze der Volkswirtschaftslehre“ (1871): Grenznutzen.', 'Before fetching one more source, ask what that one more would change in the answer.'),
('venn', 'John Venn', 'Джон Венн', '1834–1923', 'https://en.wikipedia.org/wiki/John_Venn', 'one_model', "'The Logic of Chance' (1866): a probability is a frequency within a chosen group — and the same person belongs to many groups with different frequencies (the reference-class problem).", '«Логика случая» (1866): вероятность — это частота внутри выбранной группы, а один и тот же человек входит во многие группы с разными частотами (проблема референтного класса).', '„The Logic of Chance“ (1866): Wahrscheinlichkeit hängt von der Bezugsklasse ab.', 'Every percentage belongs to a group: say which group, and that another group would give another number.'),
('edgeworth', 'Francis Ysidro Edgeworth', 'Фрэнсис Исидро Эджуорт', '1845–1926', 'https://en.wikipedia.org/wiki/Francis_Ysidro_Edgeworth', 'measurement_error', 'His memoranda on index numbers (1887–89, the Marshall–Edgeworth index): a price index changes with the weights and the base you choose.', 'Его записки об индексах цен (1887–89, индекс Маршалла — Эджуорта): индекс меняется в зависимости от выбранных весов и базы.', 'Indexzahlen (1887–89): Gewichte und Basis bestimmen den Index.', 'When quoting an index, say what weights and base it uses; another choice gives another number.'),
('veblen', 'Thorstein Veblen', 'Торстейн Веблен', '1857–1929', 'https://en.wikipedia.org/wiki/Thorstein_Veblen', 'look_alike', "'The Theory of the Leisure Class' (1899): conspicuous consumption — things are bought to show status, so a high price can signal prestige rather than quality.", '«Теория праздного класса» (1899): показное потребление — вещи покупают, чтобы показать статус, поэтому высокая цена может означать престиж, а не качество.', '„Theorie der feinen Leute“ (1899): demonstrativer Konsum.', 'Do not read a high price, a famous name or wide popularity as proof of quality or truth.'),
('marshall_a', 'Alfred Marshall', 'Альфред Маршалл', '1842–1924', 'https://en.wikipedia.org/wiki/Alfred_Marshall', 'one_model', "'Principles of Economics' (1890): 'other things being equal' (ceteris paribus) — study one cause at a time while holding the rest fixed, knowing the rest never really stay fixed.", '«Принципы экономической науки» (1890): «при прочих равных» — изучать одну причину, держа остальное неизменным, помня, что в жизни остальное не стоит на месте.', '„Principles of Economics“ (1890): ceteris paribus.', 'When you explain a change by one cause, say what you held fixed and whether it really stayed fixed.'),
('chamberlin', 'Thomas Chrowder Chamberlin', 'Томас Чемберлин', '1843–1928', 'https://en.wikipedia.org/wiki/Thomas_Chrowder_Chamberlin', 'one_model', "'The Method of Multiple Working Hypotheses' (1890): keeping one favourite explanation makes you see only supporting facts; keep several alive and test them against each other.", '«Метод множественных рабочих гипотез» (1890): любимое единственное объяснение заставляет видеть только подтверждающие факты; держи в голове несколько и проверяй их друг против друга.', '„The Method of Multiple Working Hypotheses“ (1890).', 'Keep at least two explanations open until the facts rule one out.'),
('durkheim', 'Émile Durkheim', 'Эмиль Дюркгейм', '1858–1917', 'https://en.wikipedia.org/wiki/%C3%89mile_Durkheim', 'measurement_error', "'The Rules of Sociological Method' (1895): treat social facts as things — measure them from outside, with definitions fixed in advance, not from impressions.", '«Метод социологии» (1895): рассматривать социальные факты как вещи — измерять их извне, с заранее заданными определениями, а не по впечатлениям.', '„Die Regeln der soziologischen Methode“ (1895).', 'Fix the definition before counting; a count with a shifting definition measures the definition.'),

# --- Лиана, «умный сканер», 1911–1920 (сверка после DeepSeek), 23.11.2026 ---
('leskien', 'August Leskien', 'Август Лескин', '1840–1916', 'https://en.wikipedia.org/wiki/August_Leskien', 'own_limits', 'With the Neogrammarians (1876) he held that sound laws work without exceptions: an apparent exception points to another rule or to borrowing, not to chance.', 'Вместе с младограмматиками (1876) он утверждал, что звуковые законы действуют без исключений: кажущееся исключение указывает на другое правило или заимствование, а не на случай.', 'Junggrammatiker (1876): Ausnahmslosigkeit der Lautgesetze.', 'Treat an exception as a clue to a rule you have not found yet, before writing it off as noise.'),
('boehm_bawerk', 'Eugen von Böhm-Bawerk', 'Ойген фон Бём-Баверк', '1851–1914', 'https://en.wikipedia.org/wiki/Eugen_von_B%C3%B6hm-Bawerk', 'answer_cost', "'Capital and Interest' (1884–89): people value present goods above the same goods in the future, so time itself has a price.", '«Капитал и процент» (1884–89): люди ценят блага сейчас выше тех же благ в будущем, поэтому у самого времени есть цена.', '„Kapital und Kapitalzins“ (1884–89): Gegenwartsgüter werden höher bewertet.', 'Compare a cost now with a benefit later only after saying how much the waiting itself costs.'),
# --- Лиана, «умный сканер», 1921–1930 (вслепую, сверка), 23.11.2026 ---
('klein_f', 'Felix Klein', 'Феликс Клейн', '1849–1925', 'https://en.wikipedia.org/wiki/Felix_Klein', 'look_alike', 'The Erlangen programme (1872): a geometry is defined by what stays unchanged under its allowed transformations — the invariants.', 'Эрлангенская программа (1872): геометрию определяет то, что остаётся неизменным при её допустимых преобразованиях, — инварианты.', 'Erlanger Programm (1872): Invarianten unter Transformationen.', 'When the same story comes in different words, languages or framings, keep what stays the same in all of them as the fact.'),

# --- Лиана, «умный сканер», 1931–1940 (+ дополнения Claude: К. Пирсон, Борткевич, Госсет, Рамсей), 23.11.2026 ---
('wallas', 'Graham Wallas', 'Грэм Уоллас', '1858–1932', 'https://en.wikipedia.org/wiki/Graham_Wallas', 'rumour_vs_fact', "'Human Nature in Politics' (1908): political opinion is moved mostly by habit, images and emotion, not by reasoned argument.", '«Человеческая природа в политике» (1908): политическое мнение движут в основном привычка, образы и эмоции, а не доводы.', '„Human Nature in Politics“ (1908): Gewohnheit und Bilder statt Argumente.', 'Notice when a headline works by an image or an emotion instead of a claim you can check.'),
('follett', 'Mary Parker Follett', 'Мэри Паркер Фоллетт', '1868–1933', 'https://en.wikipedia.org/wiki/Mary_Parker_Follett', 'answer_cost', "'Constructive Conflict' (1925): a conflict can end in domination, compromise or integration — a solution that meets what both sides really need.", '«Конструктивный конфликт» (1925): конфликт может закончиться подчинением, компромиссом или интеграцией — решением, которое даёт обеим сторонам то, что им действительно нужно.', '„Constructive Conflict“ (1925): Integration statt Kompromiss.', 'Do not frame a dispute as only two options; ask what each side actually needs.'),
('schlick', 'Moritz Schlick', 'Мориц Шлик', '1882–1936', 'https://en.wikipedia.org/wiki/Moritz_Schlick', 'rumour_vs_fact', "The Vienna Circle's verification principle: the meaning of a statement lies in the way it could be checked against experience.", 'Принцип верификации Венского кружка: смысл утверждения — в том, как его можно проверить опытом.', 'Verifikationsprinzip des Wiener Kreises.', 'Ask what observation would show the claim true or false; if none could, say it cannot be checked.'),
('sapir', 'Edward Sapir', 'Эдвард Сепир', '1884–1939', 'https://en.wikipedia.org/wiki/Edward_Sapir', 'look_alike', 'Language as a guide to social reality (1929): the categories a language forces on its speakers shape what they notice and report.', 'Язык как путеводитель по социальной реальности (1929): категории, которые язык навязывает говорящим, определяют, что они замечают и сообщают.', 'Sprache als Leitfaden der sozialen Wirklichkeit (1929).', 'When the same news comes in several languages, check what each wording adds or leaves out.'),
('pearson_k', 'Karl Pearson', 'Карл Пирсон', '1857–1936', 'https://en.wikipedia.org/wiki/Karl_Pearson', 'one_model', "'The Grammar of Science' (1892) and the chi-squared test (1900): correlation measures how two things move together, not what causes what; a fit must be tested against chance. (His eugenics is rejected; the statistical tools stand.)", '«Грамматика науки» (1892) и критерий хи-квадрат (1900): корреляция показывает, как две вещи меняются вместе, а не что чем вызвано; согласие с моделью надо проверять против случайности. (Его евгеника отвергнута; статистические инструменты остаются.)', '„The Grammar of Science“ (1892); Chi-Quadrat-Test (1900).', 'A correlation is not a cause; test whether the pattern could be chance before explaining it.'),
('bortkiewicz', 'Ladislaus Bortkiewicz', 'Владислав Борткевич', '1868–1931', 'https://en.wikipedia.org/wiki/Ladislaus_Bortkiewicz', 'measurement_error', "'The Law of Small Numbers' (1898): deaths from horse kicks in the Prussian cavalry followed the Poisson law — rare events cluster by chance alone.", '«Закон малых чисел» (1898): число погибших от ударов копытом в прусской кавалерии подчинялось закону Пуассона — редкие события и по чистой случайности идут кучками.', '„Das Gesetz der kleinen Zahlen“ (1898).', 'With rare events, a bad week can be pure chance; compare with what chance alone would give.'),
('gosset', 'William Sealy Gosset', 'Уильям Сили Госсет', '1876–1937', 'https://en.wikipedia.org/wiki/William_Sealy_Gosset', 'measurement_error', "As 'Student' (1908), working at the Guinness brewery, he showed that small samples need wider error bands than large ones — the t-distribution.", 'Под псевдонимом «Стьюдент» (1908), работая на пивоварне Guinness, он показал, что маленьким выборкам нужны более широкие границы погрешности, чем большим, — t-распределение.', '„Student“ (1908): t-Verteilung für kleine Stichproben.', 'The fewer the observations, the wider the uncertainty you must state.'),
('ramsey_f', 'Frank Ramsey', 'Фрэнк Рамсей', '1903–1930', 'https://en.wikipedia.org/wiki/Frank_Ramsey_(mathematician)', 'own_limits', "'Truth and Probability' (1926): a degree of belief can be measured by the bets you would accept, and beliefs should hang together consistently.", '«Истина и вероятность» (1926): степень уверенности можно измерить ставками, которые ты готов принять, а убеждения должны быть согласованы между собой.', '„Truth and Probability“ (1926).', 'State your confidence as a number you would bet on, and keep it consistent across related claims.'),

# --- Лиана, 1941–1950 (без доступа к Википедии) + дополнения Claude: И. Фишер, Кейнс, Спирмен, Нейрат, Эддингтон, Уорф, 23.11.2026 ---
('whitehead', 'Alfred North Whitehead', 'Альфред Норт Уайтхед', '1861–1947', 'https://en.wikipedia.org/wiki/Alfred_North_Whitehead', 'one_model', "The 'fallacy of misplaced concreteness' ('Science and the Modern World', 1925): mistaking an abstraction — a model, a number, a category — for the concrete reality it was cut from.", '«Ошибка неуместной конкретности» («Наука и современный мир», 1925): принимать абстракцию — модель, число, категорию — за конкретную реальность, из которой её вырезали.', '„Fallacy of misplaced concreteness“ (1925).', 'Do not talk about an index or a model as if it were the world itself; say what it leaves out.'),
('schumpeter', 'Joseph Schumpeter', 'Йозеф Шумпетер', '1883–1950', 'https://en.wikipedia.org/wiki/Joseph_Schumpeter', 'one_model', "The 'Ricardian vice' ('History of Economic Analysis', 1954): drawing firm practical conclusions from a model whose convenient assumptions guarantee the answer.", '«Рикардианский порок» («История экономического анализа», 1954): делать твёрдые практические выводы из модели, удобные допущения которой заранее гарантируют ответ.', '„Ricardian vice“ (1954).', "Before acting on a model's conclusion, check whether its assumptions already built that conclusion in."),
('fisher_i', 'Irving Fisher', 'Ирвинг Фишер', '1867–1947', 'https://en.wikipedia.org/wiki/Irving_Fisher', 'own_limits', "'The Making of Index Numbers' (1922) — and in October 1929, days before the crash, he said stock prices had reached 'a permanently high plateau'.", '«Построение индексов» (1922) — и в октябре 1929 года, за несколько дней до краха, он заявил, что курсы акций вышли на «постоянно высокое плато».', 'Indexzahlen (1922) – und das „dauerhaft hohe Plateau“ kurz vor dem Crash 1929.', "Even a great expert's confident forecast can fail within days; report forecasts with their uncertainty, not as facts."),
('keynes', 'John Maynard Keynes', 'Джон Мейнард Кейнс', '1883–1946', 'https://en.wikipedia.org/wiki/John_Maynard_Keynes', 'side_effects', "'A Treatise on Probability' (1921) on the weight of evidence, and the 'beauty contest' (1936): investors guess what others will think, not what a thing is worth.", '«Трактат о вероятности» (1921) о весе свидетельств и «конкурс красоты» (1936): инвесторы угадывают, что подумают другие, а не сколько вещь стоит.', 'Wahrscheinlichkeit (1921) und der „Schönheitswettbewerb“ (1936).', 'A price can reflect what people expect others to think; do not read it as the value of the thing.'),
('spearman', 'Charles Spearman', 'Чарльз Спирмен', '1863–1945', 'https://en.wikipedia.org/wiki/Charles_Spearman', 'measurement_error', "'The proof and measurement of association' (1904): measurement error weakens the correlation you see, and he gave a correction for it; also rank correlation.", '«Доказательство и измерение связи» (1904): ошибка измерения ослабляет видимую корреляцию, и он дал поправку на это; а также ранговая корреляция.', 'Minderungskorrektur (1904): Messfehler schwächen Korrelationen.', 'A weak link between noisy measures may be a stronger link hidden by noise; say how noisy the measures are.'),
('neurath', 'Otto Neurath', 'Отто Нейрат', '1882–1945', 'https://en.wikipedia.org/wiki/Otto_Neurath', 'own_limits', "'Neurath's boat' (1932): we are like sailors rebuilding their ship at sea — we can replace one plank at a time, never all at once.", '«Корабль Нейрата» (1932): мы как моряки, перестраивающие корабль в открытом море, — можно менять по одной доске, но не всё сразу.', '„Neuraths Schiff“ (1932).', 'Correct one belief at a time against the others you keep fixed; say which ones you kept.'),
('eddington', 'Arthur Eddington', 'Артур Эддингтон', '1882–1944', 'https://en.wikipedia.org/wiki/Arthur_Eddington', 'measurement_error', "The fish-net parable ('The Philosophy of Physical Science', 1939): a net with two-inch mesh 'proves' there are no fish smaller than two inches — the instrument chooses what you can find.", 'Притча о сети («Философия физической науки», 1939): сеть с ячейкой в два дюйма «доказывает», что рыб меньше двух дюймов нет, — прибор решает, что ты можешь найти.', 'Fischnetz-Gleichnis (1939): das Netz bestimmt, was man fängt.', 'Before saying something does not exist, ask whether your sources could have caught it.'),
('whorf', 'Benjamin Lee Whorf', 'Бенджамин Ли Уорф', '1897–1941', 'https://en.wikipedia.org/wiki/Benjamin_Lee_Whorf', 'look_alike', "As a fire-insurance inspector he saw workers smoke near 'empty' petrol drums: the word 'empty' hid that the drums were full of explosive vapour.", 'Работая инспектором страховой компании, он видел, как рабочие курят у «пустых» бочек из-под бензина: слово «пустой» скрывало, что бочки полны взрывоопасных паров.', 'Brandschutz-Beobachtung: „leere“ Benzinfässer voller Dämpfe.', "Check whether a word in the headline ('empty', 'safe', 'cleared') hides the real state of things."),

# --- Лиана, 1951–1960 (без сети) + дополнения Claude: Боули, Р. фон Мизес, Торндайк (1949), 23.11.2026 ---
('wittgenstein', 'Ludwig Wittgenstein', 'Людвиг Витгенштейн', '1889–1951', 'https://en.wikipedia.org/wiki/Ludwig_Wittgenstein', 'look_alike', "'Philosophical Investigations' (1953): the meaning of a word is its use in a practice; things called by one word share only a 'family resemblance', not one common essence.", '«Философские исследования» (1953): значение слова — это его употребление в практике; вещи, названные одним словом, связаны лишь «семейным сходством», а не общей сущностью.', '„Philosophische Untersuchungen“ (1953): Bedeutung ist Gebrauch; Familienähnlichkeit.', "Read a key word ('crisis', 'deal', 'win') by how this source uses it, not by one fixed definition."),
('borel', 'Émile Borel', 'Эмиль Борель', '1871–1956', 'https://en.wikipedia.org/wiki/%C3%89mile_Borel', 'own_limits', "'Le hasard' and 'Les probabilités et la vie' (1943): events of small enough probability should be treated as practically impossible — but one must say how small, and on what scale of trials.", '«Случай» и «Вероятности и жизнь» (1943): события достаточно малой вероятности следует считать практически невозможными — но надо сказать, насколько малой и на каком числе испытаний.', '„Les probabilités et la vie“ (1943): Borels Gesetz des Zufalls.', "Before calling something 'impossible', say how unlikely it is and how many chances it had to happen."),
('reichenbach', 'Hans Reichenbach', 'Ханс Райхенбах', '1891–1953', 'https://en.wikipedia.org/wiki/Hans_Reichenbach', 'one_model', "The common cause principle ('The Direction of Time', 1956): when two things are correlated and neither causes the other, look for a third that causes both; he also separated the context of discovery from the context of justification.", 'Принцип общей причины («Направление времени», 1956): если две вещи связаны, но ни одна не вызывает другую, ищи третью, которая вызывает обе; он же отделил контекст открытия от контекста обоснования.', 'Prinzip der gemeinsamen Ursache (1956).', 'If two things move together, check for a third that drives both before linking them.'),
('von_neumann', 'John von Neumann', 'Джон фон Нейман', '1903–1957', 'https://en.wikipedia.org/wiki/John_von_Neumann', 'side_effects', "The minimax theorem (1928) and 'Theory of Games and Economic Behavior' (1944, with Morgenstern): judge a move by the best reply it leaves the other side.", 'Теорема о минимаксе (1928) и «Теория игр и экономическое поведение» (1944, с Моргенштерном): оценивай ход по лучшему ответу, который он оставляет другой стороне.', 'Minimax-Satz (1928) und Spieltheorie (1944).', 'When others will react, judge an action by their best response, not by its first effect.'),
('bowley', 'Arthur Lyon Bowley', 'Артур Лайон Боули', '1869–1957', 'https://en.wikipedia.org/wiki/Arthur_Lyon_Bowley', 'measurement_error', "'Livelihood and Poverty' (1915) pioneered random sampling of households: a sample speaks for a population only if every member had a known chance to be chosen.", '«Заработок и бедность» (1915) впервые применила случайную выборку домохозяйств: выборка говорит за всё население, только если у каждого был известный шанс в неё попасть.', '„Livelihood and Poverty“ (1915): Zufallsstichproben von Haushalten.', 'Ask how a survey chose its people before trusting its percentage for everyone.'),
('mises_r', 'Richard von Mises', 'Рихард фон Мизес', '1883–1953', 'https://en.wikipedia.org/wiki/Richard_von_Mises', 'measurement_error', 'The birthday problem (1939): in a room of just 23 people two share a birthday more often than not — coincidences are far more likely than they feel. He also founded the frequency theory of probability.', 'Задача о днях рождения (1939): уже среди 23 человек двое с одним днём рождения встречаются чаще, чем нет, — совпадения гораздо вероятнее, чем кажется. Он же создал частотную теорию вероятности.', 'Geburtstagsproblem (1939): Zufälle sind wahrscheinlicher als gefühlt.', 'Before calling a coincidence suspicious, count how many chances there were for some coincidence to happen.'),
('thorndike', 'Edward Thorndike', 'Эдвард Торндайк', '1874–1949', 'https://en.wikipedia.org/wiki/Edward_Thorndike', 'look_alike', "'A constant error in psychological ratings' (1920): the halo effect — one good or bad trait colours how all other traits are judged.", '«Постоянная ошибка в психологических оценках» (1920): эффект ореола — одна хорошая или плохая черта окрашивает оценку всех остальных.', 'Halo-Effekt (1920).', 'Judge each claim about a person or company on its own evidence, not on their reputation.'),

# --- Лиана, 1961–1970 (без сети) + дополнения Claude: Р. Фишер, Олпорт, Кэнтрил, Ричардсон (1953), 23.11.2026 ---
('buehler', 'Karl Bühler', 'Карл Бюлер', '1879–1963', 'https://en.wikipedia.org/wiki/Karl_B%C3%BChler', 'rumour_vs_fact', "The organon model ('Sprachtheorie', 1934): every message at once expresses the sender, appeals to the receiver and represents a state of affairs.", 'Модель органона («Теория языка», 1934): каждое сообщение одновременно выражает отправителя, обращается к адресату и изображает положение дел.', 'Organon-Modell („Sprachtheorie“, 1934): Ausdruck, Appell, Darstellung.', 'Separate what a headline says about the world from what it shows about the sender and what it wants from you.'),
('wiener', 'Norbert Wiener', 'Норберт Винер', '1894–1964', 'https://en.wikipedia.org/wiki/Norbert_Wiener', 'side_effects', "'Cybernetics' (1948): feedback — a system's output returns as its input; negative feedback steadies it, positive feedback can drive it out of control.", '«Кибернетика» (1948): обратная связь — выход системы возвращается на её вход; отрицательная обратная связь её успокаивает, положительная может разогнать до срыва.', '„Kybernetik“ (1948): Rückkopplung.', 'When your output can come back as input (a published signal that moves what it measures), say so and watch for runaway loops.'),
('carnap', 'Rudolf Carnap', 'Рудольф Карнап', '1891–1970', 'https://en.wikipedia.org/wiki/Rudolf_Carnap', 'one_model', "The requirement of total evidence (1947, 'Logical Foundations of Probability', 1950): a probability judgement must use all the relevant evidence available, not a convenient part of it.", 'Требование полноты свидетельств (1947, «Логические основания вероятности», 1950): вероятностное суждение должно опираться на все доступные относящиеся к делу данные, а не на удобную часть.', 'Forderung der totalen Evidenz (1947).', 'Do not answer from the evidence that suits you; say what relevant evidence you did not use.'),
('fisher_r', 'Ronald Fisher', 'Рональд Фишер', '1890–1962', 'https://en.wikipedia.org/wiki/Ronald_Fisher', 'measurement_error', "'The Design of Experiments' (1935), the lady tasting tea: decide the test and what counts as success before you look at the results, and randomise to keep chance honest.", '«Планирование экспериментов» (1935), леди, пробующая чай: реши, как будешь проверять и что считать успехом, до того как увидишь результаты, и рандомизируй, чтобы случай был честным.', '„The Design of Experiments“ (1935): Teetest der Lady.', 'Fix the test before looking at the outcome; a test chosen after seeing the data proves little.'),
('allport', 'Gordon Allport', 'Гордон Олпорт', '1897–1967', 'https://en.wikipedia.org/wiki/Gordon_Allport', 'rumour_vs_fact', "'The Psychology of Rumor' (1947, with Leo Postman): rumour strength grows with how important a matter is times how ambiguous the facts are; retold stories shrink, sharpen and bend to expectations.", '«Психология слуха» (1947, с Лео Постманом): сила слуха растёт с важностью темы, умноженной на неясность фактов; при пересказе история сжимается, заостряется и подгоняется под ожидания.', '„The Psychology of Rumor“ (1947): Gerücht = Wichtigkeit × Mehrdeutigkeit.', 'When a story is important and the facts are unclear, expect rumours: slow down and stick to what is confirmed.'),
('cantril', 'Hadley Cantril', 'Хэдли Кэнтрил', '1906–1969', 'https://en.wikipedia.org/wiki/Hadley_Cantril', 'rumour_vs_fact', "'The Invasion from Mars' (1940): listeners who checked other stations or sources after the 1938 radio play did not panic; those who did not check believed it.", '«Вторжение с Марса» (1940): слушатели, которые после радиопостановки 1938 года проверили другие станции и источники, не поддались панике; кто не проверил — поверил.', '„The Invasion from Mars“ (1940): wer nachprüfte, geriet nicht in Panik.', 'Before reacting to an alarming report, check one independent source.'),
('richardson_lf', 'Lewis Fry Richardson', 'Льюис Фрай Ричардсон', '1881–1953', 'https://en.wikipedia.org/wiki/Lewis_Fry_Richardson', 'measurement_error', 'The coastline paradox (published 1961): the measured length of a coast grows as the ruler gets shorter — some quantities have no single size without a stated scale. He also made the first numerical weather forecast (1922).', 'Парадокс береговой линии (опубликован в 1961): измеренная длина побережья растёт, когда линейка становится короче, — у некоторых величин нет одного размера без указанного масштаба. Он же сделал первый численный прогноз погоды (1922).', 'Küstenlinien-Paradox (1961): die Länge hängt vom Maßstab ab.', 'State the scale of a measurement; a number without its scale (per day, per hour, per region) cannot be compared.'),

# --- Грок, «закрываем век», 1971–1980, 23.11.2026 ---
('lakatos', 'Imre Lakatos', 'Имре Лакатос', '1922–1974', 'https://en.wikipedia.org/wiki/Imre_Lakatos', 'one_model', "'The Methodology of Scientific Research Programmes' (1970–78): a programme is progressive if it predicts new facts, degenerating if it only patches itself after each failure.", '«Методология научно-исследовательских программ» (1970–78): программа прогрессирует, если предсказывает новые факты, и вырождается, если только латает себя после каждой неудачи.', 'Methodologie wissenschaftlicher Forschungsprogramme (1970–78).', 'If a model needs a new excuse after every miss, say it is patching, not predicting.'),
('piaget', 'Jean Piaget', 'Жан Пиаже', '1896–1980', 'https://en.wikipedia.org/wiki/Jean_Piaget', 'own_limits', "Assimilation and accommodation ('The Origins of Intelligence in Children', 1936): new facts are first squeezed into old schemes; only when they do not fit is the scheme changed.", 'Ассимиляция и аккомодация («Происхождение интеллекта у детей», 1936): новые факты сначала втискивают в старые схемы; схему меняют, лишь когда они не помещаются.', 'Assimilation und Akkommodation (1936).', 'When a new fact does not fit your picture, change the picture instead of bending the fact.'),
('goedel', 'Kurt Gödel', 'Курт Гёдель', '1906–1978', 'https://en.wikipedia.org/wiki/Kurt_G%C3%B6del', 'own_limits', 'The incompleteness theorems (1931): any consistent formal system rich enough for arithmetic contains true statements it cannot prove, and cannot prove its own consistency.', 'Теоремы о неполноте (1931): любая непротиворечивая формальная система, достаточно богатая для арифметики, содержит истинные утверждения, которые не может доказать, и не может доказать собственную непротиворечивость.', 'Unvollständigkeitssätze (1931).', 'A system cannot fully check itself; for important claims, use a check from outside your own rules.'),
('savage', 'Leonard Jimmie Savage', 'Леонард Джимми Сэвидж', '1917–1971', 'https://en.wikipedia.org/wiki/Leonard_Jimmie_Savage', 'answer_cost', "'The Foundations of Statistics' (1954): rational choice weighs each outcome by its probability and its value — and works only in a 'small world' where the options and outcomes can be listed.", '«Основания статистики» (1954): разумный выбор взвешивает каждый исход по вероятности и ценности — и работает только в «малом мире», где варианты и исходы можно перечислить.', '„The Foundations of Statistics“ (1954): Entscheidung in der „kleinen Welt“.', 'Weigh outcomes by both chance and cost, and say when the situation is too open to list them all.'),
('frisch', 'Ragnar Frisch', 'Рагнар Фриш', '1895–1973', 'https://en.wikipedia.org/wiki/Ragnar_Frisch', 'one_model', "'Statistical Confluence Analysis' (1934): when the explaining variables move together, a regression cannot tell which one does the work — its coefficients become meaningless.", '«Статистический анализ слияния» (1934): когда объясняющие величины движутся вместе, регрессия не может сказать, какая из них работает, — её коэффициенты теряют смысл.', 'Konfluenzanalyse (1934): Multikollinearität.', 'When several causes rise and fall together, do not credit one of them; say they cannot be separated.'),
('phillips_w', 'Bill Phillips', 'Билл Филлипс', '1914–1975', 'https://en.wikipedia.org/wiki/William_Phillips_(economist)', 'one_model', 'The Phillips curve (1958): a stable trade-off between unemployment and wage inflation in a century of data — which broke down in the 1970s once policy tried to exploit it.', 'Кривая Филлипса (1958): устойчивая связь безработицы и роста зарплат за столетие данных — которая распалась в 1970-х, когда политика попыталась ею пользоваться.', 'Phillips-Kurve (1958) und ihr Zusammenbruch in den 1970ern.', 'A relationship found in past data can vanish once people start acting on it; say so before relying on it.'),
('snedecor', 'George W. Snedecor', 'Джордж Снедекор', '1881–1974', 'https://en.wikipedia.org/wiki/George_W._Snedecor', 'measurement_error', "'Statistical Methods' (1937) and the F-distribution (named by him after Fisher): a difference between groups means something only if it is large compared with the spread inside the groups.", '«Статистические методы» (1937) и F-распределение (названное им в честь Фишера): разница между группами что-то значит, только если она велика по сравнению с разбросом внутри групп.', '„Statistical Methods“ (1937); F-Verteilung.', 'Compare a difference between groups with the usual spread within them before calling it real.'),
('wedderburn_r', 'Robert Wedderburn', 'Роберт Уэддерберн', '1947–1975', 'https://en.wikipedia.org/wiki/Robert_Wedderburn_(statistician)', 'own_limits', 'Quasi-likelihood (1974): you can fit and test a model knowing only how the mean and the spread are related, without pretending to know the full distribution.', 'Квазиправдоподобие (1974): модель можно подогнать и проверить, зная только связь среднего и разброса, не притворяясь, что знаешь всё распределение.', 'Quasi-Likelihood (1974).', 'Assume only what you actually know about the data; do not invent a full model to look precise.'),
('lippmann', 'Walter Lippmann', 'Уолтер Липпман', '1889–1974', 'https://en.wikipedia.org/wiki/Walter_Lippmann', 'rumour_vs_fact', "'Public Opinion' (1922): people act on 'the pictures in our heads' — stereotypes and a pseudo-environment built from news — not on the world itself.", '«Общественное мнение» (1922): люди действуют по «картинкам в головах» — стереотипам и псевдосреде из новостей, — а не по самому миру.', '„Die öffentliche Meinung“ (1922): Bilder in unseren Köpfen.', 'Notice when a story fits a ready-made stereotype; check the facts that do not fit it.'),
('mcluhan', 'Marshall McLuhan', 'Маршалл Маклюэн', '1911–1980', 'https://en.wikipedia.org/wiki/Marshall_McLuhan', 'rumour_vs_fact', "'Understanding Media' (1964): 'the medium is the message' — the channel shapes what can be said and how it is taken.", '«Понимание медиа» (1964): «средство коммуникации есть сообщение» — канал определяет, что можно сказать и как это будет воспринято.', '„Die magischen Kanäle“ (1964): Das Medium ist die Botschaft.', "Remember what a headline's length and format leave out; a headline is not the full report."),
('barthes', 'Roland Barthes', 'Ролан Барт', '1915–1980', 'https://en.wikipedia.org/wiki/Roland_Barthes', 'look_alike', "'Mythologies' (1957): myth turns history into nature — a chosen way of presenting things comes to look like the way things simply are.", '«Мифологии» (1957): миф превращает историю в природу — выбранный способ подачи начинает выглядеть как естественный порядок вещей.', '„Mythen des Alltags“ (1957).', "Ask whether something presented as 'natural' or 'inevitable' is in fact someone's framing."),
('ryle', 'Gilbert Ryle', 'Гилберт Райл', '1900–1976', 'https://en.wikipedia.org/wiki/Gilbert_Ryle', 'look_alike', "'The Concept of Mind' (1949): the category mistake — a visitor sees the colleges and libraries and asks 'but where is the university?'", '«Понятие сознания» (1949): категориальная ошибка — гость осматривает колледжи и библиотеки и спрашивает: «А где же университет?»', '„Der Begriff des Geistes“ (1949): Kategorienfehler.', "Check that you are not treating a whole (a market, 'the West') as one more thing beside its parts."),
('polanyi_m', 'Michael Polanyi', 'Майкл Полани', '1891–1976', 'https://en.wikipedia.org/wiki/Michael_Polanyi', 'own_limits', "'The Tacit Dimension' (1966): 'we can know more than we can tell' — much expert knowledge cannot be fully written down as rules.", '«Неявное знание» (1966): «мы знаем больше, чем можем сказать» — многое из знания экспертов нельзя полностью записать в правила.', '„Implizites Wissen“ (1966).', 'Say when a judgement rests on rules you can state and when it rests on a hunch you cannot fully justify.'),
('bertalanffy', 'Ludwig von Bertalanffy', 'Людвиг фон Берталанфи', '1901–1972', 'https://en.wikipedia.org/wiki/Ludwig_von_Bertalanffy', 'one_model', "'General System Theory' (1968): open systems show equifinality — the same final state can be reached from different starting points and by different paths.", '«Общая теория систем» (1968): открытым системам свойственна эквифинальность — одно и то же конечное состояние достигается из разных начальных точек и разными путями.', '„General System Theory“ (1968): Äquifinalität.', 'Do not infer one cause from an outcome; the same result can have several different paths.'),
('stevens_ss', 'Stanley Smith Stevens', 'Стэнли Смит Стивенс', '1906–1973', 'https://en.wikipedia.org/wiki/Stanley_Smith_Stevens', 'measurement_error', "'On the Theory of Scales of Measurement' (1946): nominal, ordinal, interval and ratio scales — what you may compute depends on the scale (you cannot average ranks as if they were amounts).", '«О теории шкал измерения» (1946): номинальная, порядковая, интервальная и шкала отношений — что можно вычислять, зависит от шкалы (ранги нельзя усреднять как количества).', '„On the Theory of Scales of Measurement“ (1946).', 'Before averaging or comparing ratios, check what kind of scale the numbers are on.'),

# --- Грок, «закрываем век», 1993–1998 и часть 1981–1989 (файлы не приложены), 23.11.2026 ---
('popper', 'Karl Popper', 'Карл Поппер', '1902–1994', 'https://en.wikipedia.org/wiki/Karl_Popper', 'one_model', "'The Logic of Scientific Discovery' (1934/1959): a claim is scientific only if some observation could prove it false; confirmations are cheap, a failed risky prediction tells you most.", '«Логика научного открытия» (1934/1959): утверждение научно, только если какое-то наблюдение могло бы его опровергнуть; подтверждения дёшевы, больше всего говорит не сбывшееся рискованное предсказание.', '„Logik der Forschung“ (1934): Falsifizierbarkeit.', 'Ask what would show the claim wrong; a claim that fits every outcome tells nothing.'),
('kuhn', 'Thomas Kuhn', 'Томас Кун', '1922–1996', 'https://en.wikipedia.org/wiki/Thomas_Kuhn', 'one_model', "'The Structure of Scientific Revolutions' (1962): anomalies pile up unnoticed inside a reigning paradigm until it breaks.", '«Структура научных революций» (1962): аномалии незаметно копятся внутри господствующей парадигмы, пока она не ломается.', '„Die Struktur wissenschaftlicher Revolutionen“ (1962).', 'Keep a list of facts the usual explanation does not fit instead of filing them as noise.'),
('feyerabend', 'Paul Feyerabend', 'Пол Фейерабенд', '1924–1994', 'https://en.wikipedia.org/wiki/Paul_Feyerabend', 'one_model', "'Against Method' (1975): no single method has always produced progress; theories are tested best against rival theories, not only against facts.", '«Против метода» (1975): ни один метод не приводил к прогрессу всегда; теории лучше всего проверяются соперничающими теориями, а не только фактами.', '„Wider den Methodenzwang“ (1975).', 'Test an explanation against a serious rival, not only against the facts that fit it.'),
('tinbergen', 'Jan Tinbergen', 'Ян Тинберген', '1903–1994', 'https://en.wikipedia.org/wiki/Jan_Tinbergen', 'side_effects', "The Tinbergen rule ('On the Theory of Economic Policy', 1952): to reach several independent targets you need at least as many independent instruments.", 'Правило Тинбергена («О теории экономической политики», 1952): чтобы достичь нескольких независимых целей, нужно не меньше независимых инструментов.', 'Tinbergen-Regel (1952).', 'Be wary of a single measure promised to fix several problems at once.'),
('tversky', 'Amos Tversky', 'Амос Тверски', '1937–1996', 'https://en.wikipedia.org/wiki/Amos_Tversky', 'look_alike', "'Judgment under Uncertainty: Heuristics and Biases' (1974, with Kahneman): representativeness, availability and anchoring make people misjudge probabilities in predictable ways.", '«Суждение в условиях неопределённости: эвристики и искажения» (1974, с Канеманом): репрезентативность, доступность и якорение предсказуемо искажают оценку вероятностей.', 'Heuristiken und Verzerrungen (1974, mit Kahneman).', 'Before judging how likely something is, check you are not just recalling vivid or recent cases.'),
('hempel', 'Carl Gustav Hempel', 'Карл Густав Гемпель', '1905–1997', 'https://en.wikipedia.org/wiki/Carl_Gustav_Hempel', 'one_model', "The raven paradox (1945): if 'all ravens are black', every non-black non-raven (a white shoe) formally confirms it — not all confirmations are worth the same.", 'Парадокс ворона (1945): если «все вороны чёрные», то любая нечёрная не-ворона (белый ботинок) формально это подтверждает — не все подтверждения стоят одинаково.', 'Rabenparadoxon (1945).', 'Weigh evidence by how much it could have told against the claim, not by how many items agree.'),
('goodman', 'Nelson Goodman', 'Нельсон Гудмен', '1906–1998', 'https://en.wikipedia.org/wiki/Nelson_Goodman', 'one_model', "The new riddle of induction ('Fact, Fiction, and Forecast', 1955): 'grue' fits all past emeralds as well as 'green' — past data alone cannot pick the right pattern.", 'Новая загадка индукции («Факт, вымысел и прогноз», 1955): «зелубой» подходит ко всем прежним изумрудам так же, как «зелёный», — одни прошлые данные не выбирают верную закономерность.', '„Tatsache, Fiktion, Voraussage“ (1955): „grot“.', 'Many patterns fit the past equally well; say why you extend this one.'),
('church', 'Alonzo Church', 'Алонзо Чёрч', '1903–1995', 'https://en.wikipedia.org/wiki/Alonzo_Church', 'own_limits', "Church's theorem (1936): there is no general mechanical procedure that decides, for every statement of first-order logic, whether it is provable.", 'Теорема Чёрча (1936): нет общей механической процедуры, которая решала бы для каждого утверждения логики первого порядка, доказуемо ли оно.', 'Satz von Church (1936): Unentscheidbarkeit.', 'Some questions have no procedure that always answers them; say so instead of looping.'),
('asch', 'Solomon Asch', 'Соломон Аш', '1907–1996', 'https://en.wikipedia.org/wiki/Solomon_Asch', 'rumour_vs_fact', "The conformity experiments (1951–56): many people agreed with a group's plainly wrong judgement of line lengths; one dissenter broke the effect.", 'Опыты о конформизме (1951–56): многие соглашались с явно неверным мнением группы о длине линий; один несогласный разрушал эффект.', 'Konformitätsexperimente (1951–56).', 'A unanimous chorus is not evidence; one independent dissent is worth hearing.'),
('campbell_dt', 'Donald T. Campbell', 'Дональд Кэмпбелл', '1916–1996', 'https://en.wikipedia.org/wiki/Donald_T._Campbell', 'side_effects', "Campbell's law (1976): the more a quantitative indicator is used for social decisions, the more it is corrupted and distorts what it measures.", 'Закон Кэмпбелла (1976): чем больше количественный показатель используется для общественных решений, тем сильнее его искажают и тем сильнее он искажает то, что измеряет.', 'Campbells Gesetz (1976).', 'When a number becomes a target, expect it to drift from what it was meant to measure.'),
('olson_m', 'Mancur Olson', 'Мансур Олсон', '1932–1998', 'https://en.wikipedia.org/wiki/Mancur_Olson', 'side_effects', "'The Logic of Collective Action' (1965): small groups with concentrated gains organise more easily than large groups with spread-out costs.", '«Логика коллективных действий» (1965): малые группы с сосредоточенной выгодой организуются легче, чем большие группы с рассеянными издержками.', '„Die Logik des kollektiven Handelns“ (1965).', 'Ask who gains a lot from a decision and who loses a little each; the loud side is not always the larger one.'),
('minsky_h', 'Hyman Minsky', 'Хайман Мински', '1919–1996', 'https://en.wikipedia.org/wiki/Hyman_Minsky', 'side_effects', 'The financial instability hypothesis (1977–92): long calm periods encourage riskier borrowing, so stability itself breeds instability.', 'Гипотеза финансовой нестабильности (1977–92): долгие спокойные периоды поощряют более рискованные займы, так что стабильность сама порождает нестабильность.', 'Hypothese der finanziellen Instabilität (1977–92).', 'Do not read a long calm stretch as safety; ask what risk it is building up.'),
('vickrey', 'William Vickrey', 'Уильям Викри', '1914–1996', 'https://en.wikipedia.org/wiki/William_Vickrey', 'answer_cost', 'The second-price auction (1961): if the winner pays the second-highest bid, bidding your true value becomes the best strategy.', 'Аукцион второй цены (1961): если победитель платит вторую по величине ставку, лучшей стратегией становится называть свою настоящую цену.', 'Vickrey-Auktion (1961).', 'Design a question so that the honest answer is the best one to give.'),
('lotman', 'Yuri Lotman', 'Юрий Лотман', '1922–1993', 'https://en.wikipedia.org/wiki/Yuri_Lotman', 'look_alike', 'The semiosphere (1984): a text is understood through the cultural space around it; at the border between cultures, meanings are translated and changed.', 'Семиосфера (1984): текст понимается через окружающее его культурное пространство; на границе культур смыслы переводятся и меняются.', 'Semiosphäre (1984).', 'When a story crosses from one culture or language to another, check what its words meant at the source.'),
('winch', 'Peter Winch', 'Питер Уинч', '1926–1997', 'https://en.wikipedia.org/wiki/Peter_Winch', 'look_alike', "'The Idea of a Social Science' (1958): to describe what people do, you must first grasp the rules by which they themselves understand their actions.", '«Идея социальной науки» (1958): чтобы описать, что люди делают, сначала надо понять правила, по которым они сами понимают свои действия.', '„Die Idee der Sozialwissenschaft“ (1958).', "Before labelling another group's action, check what it means by their own rules."),
('jones_ee', 'Edward E. Jones', 'Эдвард Джонс', '1926–1993', 'https://en.wikipedia.org/wiki/Edward_E._Jones', 'one_model', "The correspondence bias (1967, with Harris): people explain others' actions by character even when the situation clearly forced them.", 'Ошибка соответствия (1967, с Харрисом): люди объясняют поступки других характером, даже когда их явно вынудила ситуация.', 'Korrespondenzverzerrung (1967).', "Before blaming a person's character, check what the situation forced them to do."),
('robinson_j', 'Joan Robinson', 'Джоан Робинсон', '1903–1983', 'https://en.wikipedia.org/wiki/Joan_Robinson', 'one_model', "'Marx, Marshall and Keynes' (1955): 'The purpose of studying economics is … to learn how to avoid being deceived by economists'; she coined 'monopsony' (1933).", '«Маркс, Маршалл и Кейнс» (1955): «цель изучения экономики — … научиться не давать экономистам себя обмануть»; она ввела понятие «монопсония» (1933).', '„Marx, Marshall and Keynes“ (1955).', "Treat an expert's model as a claim to check, not as a fact to repeat."),
('allen_rgd', 'R. G. D. Allen', 'Р. Дж. Д. Аллен', '1906–1983', 'https://en.wikipedia.org/wiki/R._G._D._Allen', 'measurement_error', "'Index Numbers in Theory and Practice' (1975): every index rests on choices of basket, weights and base period, and these choices change the result.", '«Индексы в теории и на практике» (1975): любой индекс опирается на выбор корзины, весов и базового периода, и этот выбор меняет результат.', '„Index Numbers in Theory and Practice“ (1975).', 'Say which basket, weights and base an index uses before comparing it over time.'),
('price_dds', 'Derek de Solla Price', 'Дерек де Солла Прайс', '1922–1983', 'https://en.wikipedia.org/wiki/Derek_J._de_Solla_Price', 'stale_data', "'Little Science, Big Science' (1963) and the half-life of literature: scientific knowledge ages, and most citations go to recent work.", '«Малая наука, большая наука» (1963) и период полураспада литературы: научное знание стареет, и большинство ссылок идёт на недавние работы.', '„Little Science, Big Science“ (1963): Halbwertszeit der Literatur.', 'Check how old a source is relative to how fast its field changes.'),

# --- Грок, уточнения: Дж. Вудворд (1971), К. Мурс (1994), 23.11.2026 ---
('woodward_j', 'Joan Woodward', 'Джоан Вудворд', '1916–1971', 'https://en.wikipedia.org/wiki/Joan_Woodward', 'one_model', "'Industrial Organization: Theory and Practice' (1965): there is no one best way to organise — the right structure depends on the technology and scale of production.", '«Промышленная организация: теория и практика» (1965): единственно правильного способа организации нет — подходящая структура зависит от технологии и масштаба производства.', '„Industrial Organization“ (1965): keine beste Organisationsform.', 'Do not carry a recipe that worked in one setting into another without checking what differs.'),
('mooers', 'Calvin Mooers', 'Кэлвин Мурс', '1919–1994', 'https://en.wikipedia.org/wiki/Calvin_Mooers', 'answer_cost', "Mooers' law (1959): an information system will not be used when getting the information is more trouble than doing without it.", 'Закон Мурса (1959): информационной системой не будут пользоваться, если получить сведения хлопотнее, чем обойтись без них.', 'Mooerssches Gesetz (1959).', 'Make the check cheap enough to be done; a check nobody runs protects nothing.'),

# --- Грок, «закрываем век», 1981–1989 (файл дошёл), 23.11.2026 ---
('neyman', 'Jerzy Neyman', 'Ежи Нейман', '1894–1981', 'https://en.wikipedia.org/wiki/Jerzy_Neyman', 'measurement_error', "'Outline of a Theory of Statistical Estimation' (1937): the confidence interval — give the range that would catch the true value in most repetitions, not one point.", '«Очерк теории статистического оценивания» (1937): доверительный интервал — укажи диапазон, который в большинстве повторений поймает истинное значение, а не одну точку.', 'Konfidenzintervall (1937).', 'Do not give a single estimate as the whole answer; give the range around it.'),
('mackie', 'J. L. Mackie', 'Джон Лесли Маки', '1917–1981', 'https://en.wikipedia.org/wiki/J._L._Mackie', 'one_model', "'The Cement of the Universe' (1974), the INUS condition: what we call 'the cause' is usually one necessary part of a set of conditions that together suffice.", '«Цемент вселенной» (1974), условие INUS: то, что мы называем «причиной», обычно лишь необходимая часть набора условий, которые вместе достаточны.', 'INUS-Bedingung (1974).', 'Do not present one factor as the whole cause; name the other conditions it needed.'),
('jenkins_g', 'Gwilym Jenkins', 'Гвилим Дженкинс', '1932–1982', 'https://en.wikipedia.org/wiki/Gwilym_Jenkins', 'one_model', "'Time Series Analysis: Forecasting and Control' (1970, with Box): identify a model, fit it, check its residuals — and repeat when new data arrive.", '«Анализ временных рядов: прогноз и управление» (1970, с Боксом): определи модель, подгони её, проверь остатки — и повтори, когда придут новые данные.', 'Box-Jenkins-Methode (1970).', 'A fitted trend is a model, not a law; re-check it on new data before extending it.'),
('goffman', 'Erving Goffman', 'Ирвинг Гофман', '1922–1982', 'https://en.wikipedia.org/wiki/Erving_Goffman', 'look_alike', "'Frame Analysis' (1974): the same strip of events reads differently in different frames — a joke, a rehearsal, a real threat.", '«Анализ фреймов» (1974): один и тот же отрезок событий читается по-разному в разных рамках — шутка, репетиция, настоящая угроза.', '„Rahmen-Analyse“ (1974).', 'Ask which frame a story is told in before treating a similar scene as the same event.'),
('kendall', 'Maurice Kendall', 'Морис Кендалл', '1907–1983', 'https://en.wikipedia.org/wiki/Maurice_Kendall', 'measurement_error', "'Rank Correlation Methods' (1948), Kendall's tau: measure agreement in order when the sizes of the numbers cannot be trusted.", '«Методы ранговой корреляции» (1948), тау Кендалла: измеряй согласие в порядке, когда самим величинам чисел нельзя доверять.', 'Rangkorrelation, Kendalls Tau (1948).', 'When only the order of values is reliable, compare orders, not amounts.'),
('tarski', 'Alfred Tarski', 'Альфред Тарский', '1901–1983', 'https://en.wikipedia.org/wiki/Alfred_Tarski', 'own_limits', 'The semantic theory of truth (1933, 1944): truth for a language cannot be defined inside that same language — only in a richer one above it.', 'Семантическая теория истины (1933, 1944): истинность для языка нельзя определить средствами того же языка — только в более богатом языке над ним.', 'Semantischer Wahrheitsbegriff (1933, 1944).', 'A source cannot certify itself; check its claims against something outside it.'),
('de_finetti', 'Bruno de Finetti', 'Бруно де Финетти', '1906–1985', 'https://en.wikipedia.org/wiki/Bruno_de_Finetti', 'own_limits', "'La prévision' (1937): a probability is the price at which you would bet; a set of prices that guarantees a sure loss (a Dutch book) is incoherent.", '«Предвидение» (1937): вероятность — это цена, по которой ты готов поставить; набор цен, гарантирующий верный проигрыш («голландская книга»), несогласован.', '„La prévision“ (1937): Dutch Book.', 'Keep your stated chances consistent: probabilities of all outcomes must add up.'),
('kuznets', 'Simon Kuznets', 'Саймон Кузнец', '1901–1985', 'https://en.wikipedia.org/wiki/Simon_Kuznets', 'measurement_error', "'National Income, 1929–1932' (1934), his report to Congress: 'The welfare of a nation can scarcely be inferred from a measurement of national income.'", '«Национальный доход, 1929–1932» (1934), его доклад Конгрессу: «О благосостоянии нации едва ли можно судить по измерению национального дохода».', 'Volkseinkommen 1929–1932 (1934).', 'Do not read a single headline number (GDP, an index) as how people are doing.'),
('cramer', 'Harald Cramér', 'Харальд Крамер', '1893–1985', 'https://en.wikipedia.org/wiki/Harald_Cram%C3%A9r', 'measurement_error', "'Mathematical Methods of Statistics' (1946) and the Cramér–Rao bound: no estimate from given data can be more precise than a certain limit.", '«Математические методы статистики» (1946) и граница Крамера — Рао: никакая оценка по данным не может быть точнее определённого предела.', 'Cramér-Rao-Schranke (1946).', 'Do not report more precision than your data can possibly give.'),
('kolmogorov', 'Andrey Kolmogorov', 'Андрей Колмогоров', '1903–1987', 'https://en.wikipedia.org/wiki/Andrey_Kolmogorov', 'own_limits', "'Grundbegriffe der Wahrscheinlichkeitsrechnung' (1933): the axioms of probability — a number is a probability only if it obeys them.", '«Основные понятия теории вероятностей» (1933): аксиомы вероятности — число является вероятностью, только если подчиняется им.', '„Grundbegriffe der Wahrscheinlichkeitsrechnung“ (1933).', "'Likely' is not a probability; give a number only if it is consistent and grounded."),
('grice', 'Paul Grice', 'Пол Грайс', '1913–1988', 'https://en.wikipedia.org/wiki/Paul_Grice', 'rumour_vs_fact', "'Logic and Conversation' (1967/1975): implicature — what is suggested goes beyond what is said ('some officials resigned' suggests not all).", '«Логика и речевое общение» (1967/1975): импликатура — подразумеваемое выходит за пределы сказанного («часть чиновников ушла» намекает, что не все).', '„Logik und Konversation“ (1967/1975): Implikatur.', 'Report what a headline says, not what it implies; the hint is not part of the fact.'),
('festinger', 'Leon Festinger', 'Леон Фестингер', '1919–1989', 'https://en.wikipedia.org/wiki/Leon_Festinger', 'own_limits', "'When Prophecy Fails' (1956) and cognitive dissonance (1957): when a prediction fails, believers often hold it more firmly instead of changing their view.", '«Когда пророчество не сбывается» (1956) и когнитивный диссонанс (1957): когда предсказание проваливается, верящие часто держатся за него крепче, вместо того чтобы изменить взгляд.', '„Wenn Prophezeiungen fehlschlagen“ (1956).', 'When your forecast fails, say so and update; do not explain the miss away.'),
('kahn_r', 'Richard Kahn', 'Ричард Кан', '1905–1989', 'https://en.wikipedia.org/wiki/Richard_Kahn,_Baron_Kahn', 'side_effects', "'The Relation of Home Investment to Unemployment' (1931): the multiplier — one round of spending sets off further rounds across the economy.", '«Связь внутренних инвестиций с безработицей» (1931): мультипликатор — один круг расходов запускает следующие круги по всей экономике.', 'Multiplikator (1931).', 'Follow a change past its first effect: one spending decision ripples through others.'),
]

# Что нужно, чтобы карточка ожила (код, пояснение на en, для needs_history — дата, раньше которой истории не хватит).
# ready — данные и мысль есть, осталось проверить аналоги и построить; needs_history — копим записи; needs_source — нет открытого источника;
# covered — суть уже закрывает наш датчик (указан); blocked_analog — у других есть инструмент с той же сутью; blocked_rule — мешает наше правило (нет прогнозов);
# needs_idea — пока не придумано, как превратить мысль в живое число.
NEEDS = {
        "minker": ("needs_history", "record headlines with correction/update/denial words and link them to the original story", "2026-12-13"),
  "dagum": ("needs_history", "3–4 weeks of 30-minute index history to remove the daily and weekly rhythm", "2026-12-20"),
  "tiao": ("needs_history", "a few weeks of index history to measure how single events changed a series", "2026-12-20"),
  "latour": ("needs_source", "an open source of citation chains behind news claims"),
  "kripke": ("blocked_analog", "Wikidata already links names to entities; needs a new angle, e.g. one story naming a place differently across feeds"),
  "sims": ("blocked_rule", "'one series moves after another' is close to a forecast, which Orb Studio does not publish"),
  "guesnerie": ("blocked_rule", "multiple equilibria of expectations would need forecasts"),
}
for k in ["cleveland", "welch", "lorden", "wonham", "jury", "shumway", "astrom", "ljung"]: NEEDS[k] = ("covered", "the Polyak sensor already separates noise from real shifts", None, "polyak")
for k in ["rissanen"]: NEEDS[k] = ("covered", "the Ziv sensor already measures novelty by compression", None, "ziv")
for k in ["kashyap", "mallows", "athans", "schmeidler", "leonard", "eicker", "morrison"]: NEEDS[k] = ("covered", "the Leamer sensor already reports bounds over model choices", None, "leamer")
for k in ["goldman", "rescher"]: NEEDS[k] = ("covered", "check_headline already counts independent voices and agency echo", None, "kahneman")
for k in ["skinner", "bailar", "harding"]: NEEDS[k] = ("covered", "the Lyberg sensor already reports coverage gaps and silent feeds", None, "lyberg")
for k in ["pless", "zupko", "li_tianchu", "higham"]: NEEDS[k] = ("covered", "the Baird sensor already traces units and cross-checks numbers", None, "baird")
for k in ["radner", "woodroofe", "chow", "wynn", "herzberg", "whittle"]: NEEDS[k] = ("covered", "the Howard sensor already says when waiting for more information pays off", None, "howard")
for k in ["bunge", "laudan", "agassi", "frazier"]: NEEDS[k] = ("covered", "the Park sensor already flags warning signs of bogus science", None, "park")
for k in ["hambleton", "mislevy", "woodcock", "mellenbergh", "byrne"]: NEEDS[k] = ("covered", "the Kahneman sensor already audits the noise of AI judgements", None, "kahneman")
for k in ["belnap", "groenendijk", "bonomi", "roggen", "zdonik", "belady"]: NEEDS[k] = ("covered", "the Cox and Hagenauer sensors already show the age of stories and when labels go stale", None, "cox")

NEEDS["burkov"] = ("covered", "applied: the Orb Studio forecast game now ranks agents by the Brier score (honest_confidence_30d in get_prediction), so stating the true confidence pays off")
NEEDS["duckworth"] = ("ready", "compare today's partial-day index with the same hour of past days, not with full days")
for k in ["mitter"]: NEEDS[k] = ("covered", "the Polyak sensor already separates noise from real shifts", None, "polyak")
for k in ["sonnenschein", "siljak", "fox"]: NEEDS[k] = ("covered", "the Leamer sensor already reports bounds over model choices", None, "leamer")
for k in ["borde"]: NEEDS[k] = ("covered", "the Baird sensor already traces units and cross-checks numbers", None, "baird")
for k in ["griffin"]: NEEDS[k] = ("covered", "the Kahneman sensor already audits the noise of AI judgements", None, "kahneman")
for k in ["fishburn"]: NEEDS[k] = ("covered", "the Howard sensor already says when waiting for more information pays off", None, "howard")
for k in ["antiseri"]: NEEDS[k] = ("covered", "the Hagenauer sensor already shows which labels could flip", None, "hagenauer")

for k in ["newton_smith"]: NEEDS[k] = ("covered", "the Cox and Hagenauer sensors already show the age of stories and when labels go stale", None, "cox")
for k in ["machamer"]: NEEDS[k] = ("covered", "the Halpern sensor already names the headlines that moved an index", None, "halpern")
for k in ["hans_albert"]: NEEDS[k] = ("covered", "the Hagenauer sensor already shows which labels could flip", None, "hagenauer")
for k in ["jarvie"]: NEEDS[k] = ("covered", "check_headline already counts independent voices and agency echo", None, "kahneman")
for k in ["van_emden"]: NEEDS[k] = ("covered", "the Leamer sensor already reports low–high bounds of the indices", None, "leamer")
for k in ["markova"]: NEEDS[k] = ("covered", "the Duckworth sensor already compares like with like (same time of day)", None, "duckworth")
for k in ["fleming"]: NEEDS[k] = ("covered", "the Howard sensor already says when waiting for more information pays off", None, "howard")

for k in ["emerson", "stein"]: NEEDS[k] = ("covered", "the Cox and Hagenauer sensors already show the age of stories and when labels go stale", None, "cox")
for k in ["jarke"]: NEEDS[k] = ("covered", "the Baird sensor already keeps source, time and unit with every number", None, "baird")
for k in ["basmann", "schweder"]: NEEDS[k] = ("covered", "the Leamer and Trevisan sensors already give the bounds and the sampling spread of the indices", None, "leamer")
for k in ["ruse"]: NEEDS[k] = ("covered", "the Park sensor already flags warning signs of bogus science", None, "park")
for k in ["depierris"]: NEEDS[k] = ("covered", "the Hagenauer sensor already shows which labels could flip", None, "hagenauer")

for k in ["lynch"]: NEEDS[k] = ("covered", "the Rabin sensor already checks whether linked source pages still open and match", None, "rabin")
for k in ["kurtz"]: NEEDS[k] = ("covered", "the Trevisan sensor already shows when a sample settles", None, "trevisan")
for k in ["benacerraf"]: NEEDS[k] = ("covered", "the Leamer sensor already reports bounds over model choices", None, "leamer")
for k in ["ellis"]: NEEDS[k] = ("covered", "the Baird sensor already traces units and scales", None, "baird")
for k in ["korte"]: NEEDS[k] = ("covered", "the Bertsekas sensor already gives the cheapest call chains", None, "bertsekas")

for k in ["morin"]: NEEDS[k] = ("covered", "the Leamer and Lyberg sensors already show how the picture depends on model choices and coverage", None, "leamer")
for k in ["haack"]: NEEDS[k] = ("covered", "check_headline already counts independent voices (own clues) and the Frankfurt sensor checks anchors", None, "frankfurt")
for k in ["musgrave"]: NEEDS[k] = ("covered", "the Park sensor already flags warning signs of bogus science", None, "park")
for k in ["habermas"]: NEEDS[k] = ("covered", "the Searle sensor already separates claims, promises and demands", None, "searle")
for k in ["neumann"]: NEEDS[k] = ("covered", "the Hamilton and Baird sensors already show what the site postpones and which numbers broke", None, "hamilton")
for k in ["stearns"]: NEEDS[k] = ("covered", "the Bertsekas sensor already measures the cost of each answer", None, "bertsekas")

NEEDS["dunn"] = ("needs_idea", "group headlines by story and mark stories whose sources confirm and deny at once ('both') or say nothing ('neither')")
for k in ["ramsey", "van_eeden"]: NEEDS[k] = ("covered", "the Leamer sensor already reports bounds over model choices", None, "leamer")
for k in ["boyd"]: NEEDS[k] = ("covered", "the Park sensor already flags warning signs of bogus science", None, "park")
for k in ["savitch"]: NEEDS[k] = ("covered", "the Bertsekas and Trevisan sensors already measure what an answer needs", None, "bertsekas")

for k in ["mellor"]: NEEDS[k] = ("covered", "the Cox and Howard sensors already separate how long stories live from how often they get confirmed", None, "howard")
for k in ["giere"]: NEEDS[k] = ("covered", "the Lyberg sensor already says from which languages and regions the radars see the world", None, "lyberg")

NEEDS["rinne"] = ("needs_history", "Orb Studio records first and later values of every sensor number since 23.11.2026; how often and how much they are revised (similar idea for macro data: ALFRED vintages of the St. Louis Fed)", "2026-12-21")
for k in ["rueger"]: NEEDS[k] = ("covered", "the Duckworth sensor already compares with the same time of day", None, "duckworth")
for k in ["schloegl"]: NEEDS[k] = ("covered", "the Lyberg sensor already compares what the feeds cover", None, "lyberg")
for k in ["bunke"]: NEEDS[k] = ("covered", "the Leamer sensor already reports bounds over model choices", None, "leamer")
for k in ["woeginger"]: NEEDS[k] = ("covered", "the Trevisan and Bertsekas sensors already trade accuracy for cost", None, "trevisan")
for k in ["schnorr"]: NEEDS[k] = ("covered", "the Polyak sensor already separates noise from real shifts", None, "polyak")

for k in ["trzesicki"]: NEEDS[k] = ("covered", "the Searle sensor already separates promises and plans from events", None, "searle")
for k in ["domanski"]: NEEDS[k] = ("covered", "the Leamer sensor already reports bounds over model choices", None, "leamer")
for k in ["vaduva"]: NEEDS[k] = ("covered", "the Trevisan sensor already simulates random samples of the headlines", None, "trevisan")
for k in ["lecourt"]: NEEDS[k] = ("covered", "the Park sensor already flags warning signs of bogus science", None, "park")
for k in ["chajda"]: NEEDS[k] = ("covered", "the Baird sensor already traces units, sources and cross-checks", None, "baird")
for k in ["ogryczak"]: NEEDS[k] = ("covered", "the Bertsekas sensor already shows the cost trade-offs of answers", None, "bertsekas")
for k in ["vuillemin"]: NEEDS[k] = ("covered", "the Trevisan sensor already shows when an index needs almost all headlines", None, "trevisan")

NEEDS["dunn"] = ("covered", "applied: check_headline now returns the Belnap–Dunn value of the outlets found (affirmed / denied / both / neither) as sources_agree", None, "frankfurt")
for k in ["da_costa"]: NEEDS[k] = ("covered", "applied together with Dunn: check_headline marks contradictory sources as 'both' (sources_agree)", None, "frankfurt")
for k in ["galves"]: NEEDS[k] = ("covered", "the Polyak sensor already chooses its noise window from the data", None, "polyak")
for k in ["lolli"]: NEEDS[k] = ("covered", "the Leamer sensor already reports bounds over model choices", None, "leamer")
for k in ["alsina"]: NEEDS[k] = ("covered", "the Hagenauer sensor already keeps the degree of each label instead of yes or no", None, "hagenauer")
for k in ["gambarelli"]: NEEDS[k] = ("covered", "the Howard sensor already weighs when more information pays off", None, "howard")

NEEDS["elmasri"] = ("needs_history", "the same version history as Rinne: Orb Studio keeps first and later values of each sensor number since 23.11.2026", "2026-12-21")
for k in ["wang_peizhuang"]: NEEDS[k] = ("covered", "the Hagenauer sensor already keeps the degree of each label instead of yes or no", None, "hagenauer")
for k in ["al_hasadi"]: NEEDS[k] = ("covered", "the Frankfurt and Park sensors already work as 'sensors of critical thinking' on the headlines", None, "frankfurt")
for k in ["ning_jinsheng"]: NEEDS[k] = ("covered", "the Baird sensor already gives every number its reference: source, time and unit", None, "baird")

for k in ["rosenblatt"]: NEEDS[k] = ("covered", "the Duckworth sensor already compares with the same time of day", None, "duckworth")
for k in ["benzecri"]: NEEDS[k] = ("covered", "the Simpson sensor already lets the per-radar structure show before the total", None, "simpson")
for k in ["gruenbaum"]: NEEDS[k] = ("covered", "the Park and Frankfurt sensors already ask whether a claim gives anything to test", None, "frankfurt")
for k in ["turzeniecka"]: NEEDS[k] = ("covered", "the Baird sensor already traces units, sources and cross-checks", None, "baird")
for k in ["altman"]: NEEDS[k] = ("covered", "check_headline already tells 'neither' (no information) from 'denied'", None, "frankfurt")
for k in ["lawrence_brown"]: NEEDS[k] = ("covered", "the Howard sensor already weighs waiting against being wrong", None, "howard")

for k in ["kalinichenko"]: NEEDS[k] = ("covered", "the Baird sensor already aligns units, sources and cross-checks", None, "baird")
for k in ["basharin"]: NEEDS[k] = ("covered", "the Mikrin sensor already measures delays from source to air", None, "mikrin")
for k in ["palyutin"]: NEEDS[k] = ("covered", "the Leamer sensor already reports bounds over model choices", None, "leamer")
for k in ["minlos"]: NEEDS[k] = ("covered", "the Polyak sensor already separates noise from real shifts", None, "polyak")
for k in ["ivin"]: NEEDS[k] = ("covered", "the Searle sensor already separates events from claims and other acts", None, "searle")
for k in ["kovalenko"]: NEEDS[k] = ("covered", "the Hamilton sensor already shows what fails or is postponed", None, "hamilton")
for k in ["golshtein", "boltyansky"]: NEEDS[k] = ("covered", "the Bertsekas sensor already gives the cheapest chains of calls", None, "bertsekas")
for k in ["uspensky"]: NEEDS[k] = ("covered", "the Ziv sensor already measures information by compression", None, "ziv")

for k in ["raessler"]: NEEDS[k] = ("covered", "the Lyberg sensor already reports gaps and silent feeds", None, "lyberg")
for k in ["manna"]: NEEDS[k] = ("covered", "the Cox and Hagenauer sensors already show the age of stories and when labels go stale", None, "cox")
for k in ["bucy"]: NEEDS[k] = ("covered", "the Polyak sensor already smooths the indices against noise", None, "polyak")
for k in ["hampel"]: NEEDS[k] = ("covered", "the Leamer sensor already shows how far an index moves without each radar or word", None, "leamer")
for k in ["troelstra"]: NEEDS[k] = ("covered", "check_headline already keeps 'neither' apart from 'denied' (sources_agree)", None, "frankfurt")
for k in ["pfanzagl"]: NEEDS[k] = ("covered", "the Baird sensor already traces units and scales", None, "baird")
for k in ["winograd", "guddat"]: NEEDS[k] = ("covered", "the Bertsekas sensor already gives the cheapest chains of calls", None, "bertsekas")
for k in ["skala"]: NEEDS[k] = ("covered", "the Howard sensor already weighs when more information pays off", None, "howard")

NEEDS["kalman"] = ("covered", "the Polyak sensor already separates a one-off jump from a lasting shift in noisy indices", None, "polyak")
NEEDS["forrester"] = ("covered", "the Baird sensor already gives the age of every published number", None, "baird")
NEEDS["zadeh"] = ("covered", "the Hagenauer sensor already keeps the degree instead of rounding labels to yes or no", None, "hagenauer")
NEEDS["karpenko"] = ("covered", "check_headline already returns four values: affirmed, denied, both, neither (sources_agree)", None, "frankfurt")
NEEDS["voevodsky"] = ("covered", "the Rabin sensor already re-checks random published headlines against their sources", None, "rabin")
NEEDS["freivalds"] = ("covered", "the Rabin sensor already spot-checks a random sample instead of all", None, "rabin")
NEEDS["pushkin"] = ("covered", "the Baird sensor already traces every number to its source and time", None, "baird")
NEEDS["sigal"] = ("covered", "the Bertsekas sensor already gives the cheapest chains of calls", None, "bertsekas")
NEEDS["arrow"] = ("covered", "the Howard sensor already weighs when more information pays off", None, "howard")
NEEDS["levenshtein"] = ("covered", "applied: check_headline now merges headlines that differ only by typos, other transliteration or small rewrites (independent_voices, why = typo_or_small_rewrite)")

NEEDS["takacs"] = ("covered", "the Mikrin sensor already measures how long news waits on each step to the air", None, "mikrin")
NEEDS["gottwald"] = ("covered", "the Hagenauer sensor already keeps degrees instead of rounding labels", None, "hagenauer")
NEEDS["weichselberger"] = ("covered", "the Leamer sensor already gives bounds instead of one number; the track record sensor gives intervals", None, "leamer")
NEEDS["gy"] = ("covered", "the Lyberg sensor already reports coverage gaps of the feed; Trevisan shows how many headlines are enough", None, "lyberg")
NEEDS["rottlaender"] = ("covered", "the Baird sensor already traces units and scales", None, "baird")
NEEDS["mueller_merbach"] = ("covered", "the Bertsekas sensor already gives the cheapest chains of calls", None, "bertsekas")
NEEDS["garfield"] = ("needs_source", "a citation graph for news sources would be needed")

NEEDS["montagna"] = ("covered", "check_headline already keeps affirmed, denied, both and neither apart (sources_agree)", None, "frankfurt")
NEEDS["bruel"] = ("covered", "the Baird sensor already traces every number to its source and checks it against independent paths", None, "baird")
NEEDS["matousek"] = ("covered", "the Trevisan sensor already shows how many headlines are enough for the barometer", None, "trevisan")
NEEDS["lamfalussy"] = ("covered", "the Simpson sensor already checks whether the whole index and its radars move the same way", None, "simpson")

NEEDS["zeeman"] = ("covered", "the Polyak sensor already tells a one-off jump from a lasting shift", None, "polyak")
NEEDS["shapley"] = ("covered", "the Halpern sensor already names the headlines that moved an index", None, "halpern")
NEEDS["mackay"] = ("covered", "the Baird sensor already traces units and scales of every number", None, "baird")
NEEDS["golomb"] = ("covered", "the Ziv sensor already measures how much is new versus repeated", None, "ziv")
NEEDS["toffler"] = ("covered", "the Bertsekas sensor already measures answer size in tokens and the cheapest chains", None, "bertsekas")

NEEDS["suppes"] = ("covered", "the Baird sensor already traces units and scales", None, "baird")
NEEDS["box"] = ("covered", "the Leamer sensor already shows how far an index depends on the model choices", None, "leamer")
NEEDS["fogel"] = ("covered", "the Halpern sensor already asks what the index would be without each headline", None, "halpern")
NEEDS["lindley"] = ("covered", "applied: the forecast game scores agents by the Brier rule (honest_confidence_30d in get_prediction), so overclaiming certainty costs")

NEEDS["gardner"] = ("covered", "the Park sensor already checks science headlines for signs of pseudoscience", None, "park")
NEEDS["mcmullin"] = ("covered", "the track record sensor already measures whether the radar matched what happened next", None, "trackrecord")


NEEDS["zajonc"] = ("covered", "the Kasperson sensor already shows which stories were repeated by many outlets; check_headline counts independent voices", None, "kasperson")
NEEDS["granger"] = ("needs_history", "bridge with the track record sensor: does the radar lead BTC/ETH or do prices lead the radar? needs a few weeks of hourly history", "2026-12-14")

NEEDS["galbraith"] = ("covered", "the Kasperson sensor and the news passport already flag stories that feel true because they are repeated", None, "kasperson")
NEEDS["breiman"] = ("covered", "the Leamer sensor already recomputes each index under all reasonable model variants", None, "leamer")
NEEDS["gould"] = ("covered", "the Polyak sensor already tells a one-off jump from a lasting shift", None, "polyak")
NEEDS["simon_ha"] = ("covered", "the Bertsekas sensor already gives the cheapest chains that answer well enough", None, "bertsekas")
NEEDS["jeffrey_r"] = ("covered", "the Hagenauer sensor already keeps soft degrees instead of hard labels", None, "hagenauer")
NEEDS["tukey"] = ("covered", "the Leamer sensor already shows how far each radar or word moves an index", None, "leamer")
NEEDS["postman"] = ("covered", "applied: Grok and David must say 'not known yet' instead of covering gaps with smooth words")
NEEDS["bobbio"] = ("covered", "applied: Orb Studio's method resolves conflicting rules by priority — the more cautious rule wins (/tools/method)")
NEEDS["salmon_w"] = ("needs_history", "bridge 'who leads whom' with Granger and the track record sensor: cause or shadow?", "2026-12-14")

NEEDS["leontief"] = ("needs_history", "bridge 'spill-over between radars' (Leontief + Granger + Haavelmo): only the geo and crypto radar levels are stored, and the geo radar barely moves (70–73 over 11 days); all eight radar levels need to be stored for a few weeks", "2026-12-21")
NEEDS["griliches"] = ("covered", "the track record sensor already reports intervals; noisy radar readings make real links look weaker", None, "trackrecord")

NEEDS["osgood"] = ("covered", "applied: the news passport marks emotionally loaded headlines with Orb Studio's own short word list, each word rated for evaluation, potency and activity (field tone; a 'say' line asks for neutral words)")
NEEDS["greimas"] = ("covered", "check_headline already keeps 'neither' apart from 'denied' (sources_agree, four values)", None, "frankfurt")
NEEDS["moles"] = ("covered", "the Ziv sensor already measures how much in the headlines is new", None, "ziv")
NEEDS["hayek"] = ("covered", "applied: Grok, David and the round-table guests say 'not known yet' where the facts stop")

NEEDS["skinner_bf"] = ("covered", "the track record sensor already refuses a conclusion with fewer than 8 days and shows the radar's ordinary noise", None, "trackrecord")
NEEDS["konus"] = ("covered", "the Baird sensor already traces what every published number measures, with its source and unit", None, "baird")
NEEDS["maslov"] = ("covered", "the Searle sensor and the news passport already tell an event from a promise, plan or threat", None, "searle")
NEEDS["elias"] = ("covered", "applied with Osgood: the news passport flags loaded headlines (field tone) so hosts report the facts without the heat")

NEEDS["hopper"] = ("covered", "the Bertsekas sensor already shows the cost of every tool answer in tokens", None, "bertsekas")

NEEDS["bertrand"] = ("covered", "the Leamer sensor already recomputes each index under all reasonable model variants", None, "leamer")
NEEDS["sidgwick"] = ("needs_idea", "name who bears costs or gains besides the actor in a story; no open way yet to measure it from headlines")
NEEDS["max_mueller"] = ("covered", "applied: the news passport flags news metaphors in English, German and Russian with its own short list (field metaphor)")
NEEDS["schmidt_j"] = ("needs_history", "bridge 'tree or wave' (Schmidt + Schleicher + Tarde): radar_life keeps only the first source of a story; the times when each outlet joined are needed", "2026-12-21")
NEEDS["powell"] = ("needs_idea", "find the limiting resource behind a plan in the news; no measurable form yet")
NEEDS["gibbs"] = ("covered", "the Polyak sensor already tells a one-off jump from a lasting shift in raw index values", None, "polyak")
NEEDS["tarde"] = ("covered", "the Kasperson sensor already shows how retellings spread a story from few to many outlets", None, "kasperson")
NEEDS["tannery"] = ("covered", "applied: the news passport names the first source of a story and asks to credit it, not the count of retellings")
NEEDS["stephen_l"] = ("covered", "the Baird sensor already traces every number to its source and time", None, "baird")
NEEDS["abbe"] = ("covered", "the track record sensor already shows the radar's ordinary noise (radar_noise), so changes inside it are not findings", None, "trackrecord")
NEEDS["weldon"] = ("needs_idea", "test whether the headlines chosen for the air are a fair sample of all radar headlines (by radar, outlet and language)")
NEEDS["mendeleev"] = ("covered", "the Lyberg sensor already reports coverage gaps of the feed instead of hiding them", None, "lyberg")
NEEDS["kelvin"] = ("covered", "applied: hosts say where the known facts stop; the Leamer sensor shows how far an index depends on what the model includes")
NEEDS["james_w"] = ("covered", "applied: check_headline merges headlines that differ only in wording (typo_or_small_rewrite), a difference that makes no difference")
NEEDS["walras"] = ("needs_history", "bridge 'spill-over between radars' (Leontief + Walras + Quesnay): all eight radar levels are stored since 23.11.2026", "2026-12-21")
NEEDS["sumner"] = ("needs_idea", "flag headlines that judge another country by local norms; no measurable form yet")
NEEDS["dilthey"] = ("needs_idea", "tell explanation from interpretation in headlines ('because' vs 'signals'); no measurable form yet")
NEEDS["poincare"] = ("needs_history", "bridge 'horizon and tails' (Lorenz + Mandelbrot + Poincaré): how far ahead the radar still tells anything", "2026-12-14")
NEEDS["saussure"] = ("covered", "applied: the passport flags metaphors and the echo check compares meanings, not spellings")
NEEDS["peirce"] = ("covered", "applied: hosts say where the facts stop and the passport keeps statements, forecasts and questions apart from events")
NEEDS["duhem"] = ("covered", "the Leamer sensor already shows which model choice moves an index", None, "leamer")
NEEDS["lyapunov"] = ("covered", "the Leamer sensor already recomputes each index under small changes of the model", None, "leamer")
NEEDS["shakhmatov"] = ("covered", "applied: the news passport names the first source of a story")
NEEDS["galton"] = ("covered", "the Polyak sensor already tells a one-off jump from a lasting shift", None, "polyak")
NEEDS["binet"] = ("covered", "applied: hosts correct a false or leading premise in a question instead of answering yes or no")
NEEDS["lexis"] = ("covered", "the track record sensor already reports the radar's ordinary noise (radar_noise)", None, "trackrecord")
NEEDS["muensterberg"] = ("covered", "check_headline already counts independent voices; the passport says when only one outlet reports", None, "frankfurt")
NEEDS["weber_m"] = ("covered", "applied with Osgood: value words in headlines (scandal, disaster, triumph) are flagged apart from facts (field tone)")
NEEDS["helmert"] = ("covered", "the Leamer sensor already gives bounds instead of one number; the track record sensor gives intervals", None, "leamer")
NEEDS["menger_c"] = ("covered", "the Howard sensor already weighs when one more piece of information pays off", None, "howard")
NEEDS["venn"] = ("needs_idea", "name the reference group behind every percentage in a headline; no reliable word rule yet")
NEEDS["edgeworth"] = ("covered", "the Leamer sensor already recomputes each index under other weights", None, "leamer")
NEEDS["veblen"] = ("covered", "the Kasperson sensor and the passport already say that wide spread is not proof", None, "kasperson")
NEEDS["marshall_a"] = ("covered", "the Simpson sensor already checks whether the mix of radars changed under an index move", None, "simpson")
NEEDS["chamberlin"] = ("covered", "applied: hosts keep statements, forecasts and questions apart from events and say where the facts stop")
NEEDS["durkheim"] = ("covered", "the Baird sensor already traces what every published number measures", None, "baird")
NEEDS["leskien"] = ("covered", "the track record sensor already checks whether radar jumps revert or hold (radar_noise) before calling them noise", None, "trackrecord")
NEEDS["boehm_bawerk"] = ("covered", "the Mikrin sensor already measures what each step of waiting costs on the way to the air", None, "mikrin")
NEEDS["klein_f"] = ("covered", "applied: check_headline compares the same story across outlets and languages and keeps what they share (independent_voices)")
NEEDS["wallas"] = ("covered", "applied with Osgood: the news passport flags emotional images in headlines (field tone) apart from checkable claims")
NEEDS["follett"] = ("covered", "applied: hosts present the main viewpoints on contested issues and name who else gains or pays")
NEEDS["schlick"] = ("covered", "the Frankfurt sensor already tells checkable headlines from vague ones", None, "frankfurt")
NEEDS["sapir"] = ("covered", "applied: the echo check compares the same story across ru/de/en and the passport flags metaphors")
NEEDS["pearson_k"] = ("needs_history", "bridge 'who leads whom' (Granger + Pearson + Mill): correlation of radar and prices first, cause later", "2026-12-14")
NEEDS["bortkiewicz"] = ("covered", "the track record sensor already refuses conclusions from few days and shows ordinary noise", None, "trackrecord")
NEEDS["gosset"] = ("covered", "the track record sensor already gives Wilson intervals that widen with fewer days", None, "trackrecord")
NEEDS["ramsey_f"] = ("covered", "applied: the forecast game scores agents by the Brier rule, so honest degrees of belief pay off")
NEEDS["whitehead"] = ("covered", "applied: every sensor states its method and what it leaves out; hosts say where the facts stop")
NEEDS["schumpeter"] = ("covered", "the Leamer sensor already shows how far an index depends on the model choices", None, "leamer")
NEEDS["fisher_i"] = ("covered", "applied: Orb Studio gives no forecasts; the forecast game scores confident misses by the Brier rule")
NEEDS["keynes"] = ("needs_history", "bridge 'published radar moves the market' (Rosenthal + Bush + Keynes's beauty contest)", "2026-12-21")
NEEDS["spearman"] = ("covered", "the track record sensor already reports radar noise next to any link with prices", None, "trackrecord")
NEEDS["neurath"] = ("covered", "applied: the method resolves rule conflicts one at a time, the more cautious rule wins")
NEEDS["eddington"] = ("covered", "the Lyberg sensor already reports which regions and languages the feeds cannot see", None, "lyberg")
NEEDS["whorf"] = ("needs_idea", "a small list of state words that hide danger (empty, safe, cleared, contained) for the passport; no tested list yet")
NEEDS["wittgenstein"] = ("covered", "applied: the passport flags metaphors and the echo check compares meanings across wordings")
NEEDS["borel"] = ("covered", "applied: the passport asks for stronger evidence for extraordinary claims (Hume, Laplace)")
NEEDS["reichenbach"] = ("needs_history", "bridge 'who leads whom' (Granger + Salmon + Reichenbach): a common driver of radar and prices (e.g. the same news) must be ruled out", "2026-12-14")
NEEDS["von_neumann"] = ("needs_history", "bridge 'published radar moves the market' (Rosenthal + Keynes + von Neumann): reactions to a published signal", "2026-12-21")
NEEDS["bowley"] = ("covered", "the Lyberg sensor already reports who the feeds cannot see", None, "lyberg")
NEEDS["mises_r"] = ("covered", "the track record sensor already refuses conclusions from a few coincidences", None, "trackrecord")
NEEDS["thorndike"] = ("needs_idea", "flag headlines whose claim rests on a name's reputation; no word rule yet")
NEEDS["buehler"] = ("covered", "the Searle sensor and the passport already separate what a headline reports from what it demands or threatens", None, "searle")
NEEDS["wiener"] = ("needs_history", "bridge 'published radar moves the market' (Rosenthal + Keynes + von Neumann + Wiener feedback)", "2026-12-21")
NEEDS["carnap"] = ("covered", "applied: hosts say where the facts stop and check_headline reports all outlets found, not a chosen few")
NEEDS["fisher_r"] = ("covered", "the track record sensor fixed its buckets and threshold before collecting results", None, "trackrecord")
NEEDS["allport"] = ("covered", "the Kasperson sensor and the passport already flag stories that spread wider than their first source", None, "kasperson")
NEEDS["cantril"] = ("covered", "check_headline already looks for independent outlets for any headline", None, "frankfurt")
NEEDS["richardson_lf"] = ("covered", "the Baird sensor already gives the unit and time scale of every number", None, "baird")
NEEDS["lakatos"] = ("covered", "the track record sensor scores the radar by hits, not by explanations after the fact", None, "trackrecord")
NEEDS["piaget"] = ("covered", "applied: hosts say when a fact does not fit and keep several explanations open")
NEEDS["goedel"] = ("covered", "the Rabin sensor re-checks published headlines against outside sources", None, "rabin")
NEEDS["savage"] = ("covered", "the Howard sensor already weighs the value of more information", None, "howard")
NEEDS["frisch"] = ("covered", "the Simpson and Halpern sensors already separate what moved an index", None, "halpern")
NEEDS["phillips_w"] = ("needs_history", "bridge 'published radar moves the market' (Rosenthal + Keynes + Wiener + Phillips: a link breaks once people act on it)", "2026-12-21")
NEEDS["snedecor"] = ("covered", "the track record sensor already compares changes with the radar's ordinary noise", None, "trackrecord")
NEEDS["wedderburn_r"] = ("covered", "the Leamer sensor already gives bounds instead of one assumed model", None, "leamer")
NEEDS["lippmann"] = ("covered", "applied with Osgood: the news passport flags loaded framings in headlines (field tone)")
NEEDS["mcluhan"] = ("covered", "applied: the passport says when a headline is vague and adds what it leaves out")
NEEDS["barthes"] = ("needs_idea", "flag framings that present a choice as 'inevitable' or 'natural'; no tested word list yet")
NEEDS["ryle"] = ("needs_idea", "flag headlines that treat a whole ('the market', 'the West') as one actor; no tested rule yet")
NEEDS["polanyi_m"] = ("covered", "applied: hosts say where the facts stop and the confidence they really have")
NEEDS["bertalanffy"] = ("needs_history", "bridge 'who leads whom' (Granger + Reichenbach + Bertalanffy: several paths to one outcome)", "2026-12-14")
NEEDS["stevens_ss"] = ("covered", "the Baird sensor already traces the unit and scale of every number", None, "baird")
NEEDS["popper"] = ("covered", "the track record sensor scores the radar by predictions that could fail", None, "trackrecord")
NEEDS["kuhn"] = ("covered", "the Polyak sensor flags lasting shifts; radar_noise separates anomalies from noise", None, "polyak")
NEEDS["feyerabend"] = ("covered", "the Leamer sensor already tests each index against rival model variants", None, "leamer")
NEEDS["tinbergen"] = ("covered", "applied: hosts name who else gains or pays besides the main actor")
NEEDS["tversky"] = ("covered", "the Kahneman sensor already measures noise between AI judges", None, "kahneman")
NEEDS["hempel"] = ("covered", "check_headline counts independent voices, not reprints", None, "frankfurt")
NEEDS["goodman"] = ("covered", "the Leamer sensor shows how far conclusions depend on the chosen model", None, "leamer")
NEEDS["church"] = ("covered", "applied: hosts say plainly when something cannot be known yet")
NEEDS["asch"] = ("covered", "check_headline already merges echoes and counts independent outlets", None, "frankfurt")
NEEDS["campbell_dt"] = ("needs_history", "bridge 'published radar moves the market' (Campbell + Phillips + Rosenthal: an indicator that becomes a target drifts)", "2026-12-21")
NEEDS["olson_m"] = ("needs_idea", "say whose concentrated gain and whose spread-out cost a decision has; no measurable form yet")
NEEDS["minsky_h"] = ("covered", "the Pareto sensor warns that calm stretches may hide rare big jumps", None, "pareto")
NEEDS["vickrey"] = ("covered", "applied: the forecast game scores by the Brier rule, so the honest probability is the best answer")
NEEDS["lotman"] = ("covered", "applied: the echo check compares the same story across ru/de/en")
NEEDS["winch"] = ("needs_idea", "check a label for another group against that group's own terms; no measurable form yet")
NEEDS["jones_ee"] = ("needs_idea", "flag headlines that blame a person where the facts point to circumstances; no word rule yet")
NEEDS["robinson_j"] = ("covered", "the Leamer sensor already shows how far an index depends on model choices", None, "leamer")
NEEDS["allen_rgd"] = ("covered", "the Baird sensor already traces what every number measures and its base", None, "baird")
NEEDS["price_dds"] = ("covered", "the Baird sensor already gives the age of every number; the passport flags old news", None, "baird")
NEEDS["woodward_j"] = ("covered", "the Leamer sensor already shows how far a result depends on the setting chosen", None, "leamer")
NEEDS["mooers"] = ("covered", "the Bertsekas sensor already shows the cheapest chains of calls, so checks stay cheap", None, "bertsekas")
NEEDS["neyman"] = ("covered", "the track record sensor already gives Wilson intervals, not single rates", None, "trackrecord")
NEEDS["mackie"] = ("covered", "the Halpern sensor already names the combination of headlines that moved an index", None, "halpern")
NEEDS["jenkins_g"] = ("covered", "the Polyak sensor re-checks shifts on new data", None, "polyak")
NEEDS["goffman"] = ("covered", "the Searle sensor and passport already tell event, threat, promise and question apart", None, "searle")
NEEDS["kendall"] = ("covered", "the Baird sensor already traces what scale each number is on", None, "baird")
NEEDS["tarski"] = ("covered", "the Rabin sensor re-checks headlines against outside sources", None, "rabin")
NEEDS["de_finetti"] = ("covered", "applied: the forecast game scores by the Brier rule, so incoherent confidence costs")
NEEDS["kuznets"] = ("covered", "the Baird sensor already says what each published number does and does not measure", None, "baird")
NEEDS["cramer"] = ("covered", "the track record sensor already reports uncertainty that grows with fewer days", None, "trackrecord")
NEEDS["kolmogorov"] = ("covered", "applied: the forecast game asks for a number, scored by the Brier rule")
NEEDS["grice"] = ("needs_idea", "flag headlines whose quantifiers (some, several, up to) imply more than they state; joins the Frankfurt checkability rules")
NEEDS["festinger"] = ("covered", "the Pearson sensor and the Brier score keep missed forecasts on record", None, "pearson")
NEEDS["kahn_r"] = ("needs_history", "bridge 'spill-over between radars' (Leontief + Walras + Kahn multiplier)", "2026-12-21")
