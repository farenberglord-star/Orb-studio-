// СГЕНЕРИРОВАНО tools/timemachine.py из tools/timemachine_data.py — правьте данные там.
export const TM_ERAS = {"1350-1600": {"en": "Renaissance and the age of discovery, 1350–1600", "ru": "Возрождение и великие открытия, 1350–1600", "de": "Renaissance und Entdeckungen, 1350–1600"}, "1601-1700": {"en": "Seventeenth century", "ru": "XVII век", "de": "17. Jahrhundert"}, "1701-1800": {"en": "Eighteenth century", "ru": "XVIII век", "de": "18. Jahrhundert"}, "1801-1900": {"en": "Nineteenth century", "ru": "XIX век", "de": "19. Jahrhundert"}};
export const TIME_MACHINE = [
{
"id": "buridan",
"name": "Jean Buridan",
"name_ru": "Жан Буридан",
"years": "c. 1301 – c. 1358",
"wiki": "https://en.wikipedia.org/wiki/Jean_Buridan",
"zone": "answer_cost",
"idea": {
"en": "'Buridan's ass': between two equally good options, refusing to choose is itself the worst choice.",
"ru": "«Буриданов осёл»: между двумя одинаково хорошими вариантами отказ выбирать — сам худший выбор.",
"de": "„Buridans Esel“: zwischen zwei gleich guten Optionen ist Nichtwählen die schlechteste Wahl."
},
"rule": "When options are equally good, pick one and say they were equal instead of stalling.",
"era": "1350-1600",
"bridge": {
"en": "Bertsekas sensor: the cheapest chain that answers well enough.",
"ru": "Датчик Бертсекаса: самый дешёвый путь, которого достаточно."
}
},
{
"id": "autrecourt",
"name": "Nicholas of Autrecourt",
"name_ru": "Николай из Отрекура",
"years": "c. 1299 – 1369",
"wiki": "https://en.wikipedia.org/wiki/Nicholas_of_Autrecourt",
"zone": "one_model",
"idea": {
"en": "Only contradiction is certain: that one thing causes another can never be proven from seeing them together.",
"ru": "Достоверно только противоречие: то, что одно вызывает другое, нельзя доказать, видя их вместе.",
"de": "Nur der Widerspruch ist gewiss: Ursache lässt sich aus Zusammentreffen nicht beweisen."
},
"rule": "Seeing two things together is not proof that one causes the other.",
"era": "1350-1600",
"bridge": {
"en": "Granger, Salmon and Haavelmo in the library: correlation is not structure — 650 years earlier.",
"ru": "Грейнджер, Сэлмон и Ховельмо в библиотеке: совпадение — не причина, на 650 лет раньше."
}
},
{
"id": "oresme",
"name": "Nicole Oresme",
"name_ru": "Николай Орем",
"years": "c. 1320 – 1382",
"wiki": "https://en.wikipedia.org/wiki/Nicole_Oresme",
"zone": "one_model",
"idea": {
"en": "He showed that the daily motion of the heavens could be explained just as well by the Earth turning: the same appearances fit two models.",
"ru": "Он показал, что суточное движение неба так же хорошо объясняется вращением Земли: одни и те же наблюдения подходят к двум моделям.",
"de": "Dieselben Beobachtungen passen zu zwei Modellen: Himmel dreht sich oder die Erde."
},
"rule": "If the data fit two models equally well, say both; do not present one as the truth.",
"era": "1350-1600",
"bridge": {
"en": "Leamer sensor: report the range over all reasonable models.",
"ru": "Датчик Лимера: вилка по всем разумным моделям."
}
},
{
"id": "madhava",
"name": "Madhava of Sangamagrama",
"name_ru": "Мадхава из Сангамаграмы",
"years": "c. 1340 – c. 1425",
"wiki": "https://en.wikipedia.org/wiki/Madhava_of_Sangamagrama",
"zone": "answer_cost",
"idea": {
"en": "Infinite series cut off after a few terms, with a correction term that estimates what was left out.",
"ru": "Бесконечные ряды, оборванные после нескольких членов, с поправкой, оценивающей отброшенное.",
"de": "Unendliche Reihen abgebrochen, mit einem Korrekturglied für den Rest."
},
"rule": "When you stop early, estimate what you left out.",
"era": "1350-1600",
"bridge": {
"en": "Trevisan sensor: how many headlines are enough, and how big the error is.",
"ru": "Датчик Тревизана: сколько заголовков достаточно и какова ошибка."
}
},
{
"id": "al_kashi",
"name": "Jamshid al-Kashi",
"name_ru": "Джемшид аль-Каши",
"years": "c. 1380 – 1429",
"wiki": "https://en.wikipedia.org/wiki/Jamsh%C4%ABd_al-K%C4%81sh%C4%AB",
"zone": "answer_cost",
"idea": {
"en": "He first decided how precise π must be — a circle the size of the universe accurate to a hair's width — and then computed exactly that many digits.",
"ru": "Сначала он решил, какая точность числа π нужна — круг размером со вселенную с точностью до волоса, — и вычислил ровно столько знаков.",
"de": "Erst die nötige Genauigkeit festlegen, dann genau so viele Stellen rechnen."
},
"rule": "Decide how precise the answer must be for its purpose before computing it.",
"era": "1350-1600",
"bridge": {
"en": "Hopper and Bertsekas: show and limit the cost of precision.",
"ru": "Хоппер и Бертсекас: показать и ограничить цену точности."
}
},
{
"id": "valla",
"name": "Lorenzo Valla",
"name_ru": "Лоренцо Валла",
"years": "c. 1407 – 1457",
"wiki": "https://en.wikipedia.org/wiki/Lorenzo_Valla",
"zone": "rumour_vs_fact",
"idea": {
"en": "He proved the 'Donation of Constantine' a forgery from its language: words and titles in it did not exist at the time it claimed to be written.",
"ru": "Он доказал подложность «Константинова дара» по языку: в нём есть слова и титулы, которых не было в то время, когда он будто бы написан.",
"de": "Er entlarvte die „Konstantinische Schenkung“ durch Anachronismen der Sprache."
},
"rule": "Check whether a source's words fit the date it claims; anachronisms reveal fakes.",
"era": "1350-1600",
"bridge": {
"en": "Koselleck, Alain Rey and Derrida: words carry the time they were written in. Bridge across six centuries: date-checking by language.",
"ru": "Козеллек, Ален Рей и Деррида: слова несут время, когда написаны. Мост через шесть веков: проверка даты по языку."
}
},
{
"id": "cusa",
"name": "Nicholas of Cusa",
"name_ru": "Николай Кузанский",
"years": "1401 – 1464",
"wiki": "https://en.wikipedia.org/wiki/Nicholas_of_Cusa",
"zone": "own_limits",
"idea": {
"en": "'On Learned Ignorance': knowing the limits of one's knowledge is the highest knowledge.",
"ru": "«Об учёном незнании»: знать пределы своего знания — высшее знание.",
"de": "„Die belehrte Unwissenheit“."
},
"rule": "Know and say where your knowledge ends.",
"era": "1350-1600",
"bridge": {
"en": "Weizenbaum, Hayek and the hosts' rule 'say not known yet'.",
"ru": "Вейценбаум, Хайек и правило ведущих «говори „неизвестно“»."
}
},
{
"id": "toscanelli",
"name": "Paolo dal Pozzo Toscanelli",
"name_ru": "Паоло Тосканелли",
"years": "1397 – 1482",
"wiki": "https://en.wikipedia.org/wiki/Paolo_dal_Pozzo_Toscanelli",
"zone": "measurement_error",
"idea": {
"en": "His map put Asia far too close across the Atlantic; Columbus sailed on its confident error.",
"ru": "Его карта сильно приблизила Азию через Атлантику; Колумб поплыл, доверившись уверенной ошибке.",
"de": "Seine Karte setzte Asien viel zu nah; Kolumbus segelte auf diesem Irrtum."
},
"rule": "A confident number is not a correct one: check the measurement behind it before acting.",
"era": "1350-1600",
"bridge": {
"en": "Baird sensor: trace every number to its source and check it independently.",
"ru": "Датчик Бэрда: проследить каждое число до источника и сверить независимо."
}
},
{
"id": "pacioli",
"name": "Luca Pacioli",
"name_ru": "Лука Пачоли",
"years": "c. 1447 – 1517",
"wiki": "https://en.wikipedia.org/wiki/Luca_Pacioli",
"zone": "measurement_error",
"idea": {
"en": "Double-entry bookkeeping: every entry is matched by an opposite one, so errors show up when the books do not balance.",
"ru": "Двойная запись: у каждой записи есть встречная, и ошибка видна, когда книги не сходятся.",
"de": "Doppelte Buchführung: jede Buchung hat eine Gegenbuchung."
},
"rule": "Check a figure by a second, independent path; if they disagree, one is wrong.",
"era": "1350-1600",
"bridge": {
"en": "Baird sensor's cross-checks of the same number by independent paths.",
"ru": "Сверка чисел независимыми путями в датчике Бэрда."
}
},
{
"id": "copernicus",
"name": "Nicolaus Copernicus",
"name_ru": "Николай Коперник",
"years": "1473 – 1543",
"wiki": "https://en.wikipedia.org/wiki/Nicolaus_Copernicus",
"zone": "one_model",
"idea": {
"en": "The heliocentric model replaced one trusted for centuries; he also explained how debased coin drives good coin out of circulation.",
"ru": "Гелиоцентрическая модель сменила ту, которой верили веками; он же объяснил, как порченая монета вытесняет полноценную.",
"de": "Das heliozentrische Modell ersetzte ein jahrhundertealtes."
},
"rule": "A model trusted for a long time can still be wrong; keep checking it against what you observe.",
"era": "1350-1600",
"bridge": {
"en": "Simpson and Polyak sensors: is the index really moving, or is the model fooling us?",
"ru": "Датчики Симпсона и Поляка: индекс правда движется или нас обманывает модель?"
}
},
{
"id": "frisius",
"name": "Gemma Frisius",
"name_ru": "Гемма Фризиус",
"years": "1508 – 1555",
"wiki": "https://en.wikipedia.org/wiki/Gemma_Frisius",
"zone": "measurement_error",
"idea": {
"en": "Triangulation and finding longitude with a clock: fix a position from two independent references.",
"ru": "Триангуляция и долгота по часам: определять положение по двум независимым ориентирам.",
"de": "Triangulation und Längenbestimmung mit der Uhr."
},
"rule": "Fix a fact from two independent sources, not one.",
"era": "1350-1600",
"bridge": {
"en": "check_headline counts independent voices, not outlets.",
"ru": "Проверка заголовков считает независимые голоса, а не издания."
}
},
{
"id": "cardano",
"name": "Gerolamo Cardano",
"name_ru": "Джероламо Кардано",
"years": "1501 – 1576",
"wiki": "https://en.wikipedia.org/wiki/Gerolamo_Cardano",
"zone": "measurement_error",
"idea": {
"en": "'The Book on Games of Chance': count the equally possible cases to measure a chance.",
"ru": "«Книга об азартных играх»: чтобы измерить шанс, сосчитай равновозможные случаи.",
"de": "„Liber de ludo aleae“: gleich mögliche Fälle zählen."
},
"rule": "Count the cases before you call something likely.",
"era": "1350-1600",
"bridge": {
"en": "Track record sensor: count the days before trusting a pattern; Wilson intervals.",
"ru": "«Счёт попаданий»: посчитай дни, прежде чем верить закономерности."
}
},
{
"id": "montaigne",
"name": "Michel de Montaigne",
"name_ru": "Мишель де Монтень",
"years": "1533 – 1592",
"wiki": "https://en.wikipedia.org/wiki/Michel_de_Montaigne",
"zone": "own_limits",
"idea": {
"en": "'Que sais-je?' — what do I know? Doubt as a method of honest judgement.",
"ru": "«Что я знаю?» — сомнение как способ честного суждения.",
"de": "„Que sais-je?“ – Zweifel als Methode."
},
"rule": "Ask what you actually know before you judge.",
"era": "1350-1600",
"bridge": {
"en": "Nozick and Strawson in the library: would I say this if it were false?",
"ru": "Нозик и Стросон в библиотеке: сказал бы я это, будь оно ложным?"
}
},
{
"id": "mercator",
"name": "Gerardus Mercator",
"name_ru": "Герард Меркатор",
"years": "1512 – 1594",
"wiki": "https://en.wikipedia.org/wiki/Gerardus_Mercator",
"zone": "measurement_error",
"idea": {
"en": "His projection keeps compass courses straight but inflates areas near the poles: every map distorts something on purpose.",
"ru": "Его проекция сохраняет курсы по компасу прямыми, но раздувает площади у полюсов: любая карта что-то искажает ради своей цели.",
"de": "Jede Karte verzerrt etwas – Mercator bewahrt Kurse, verzerrt Flächen."
},
"rule": "Know what your representation distorts, and say it when you use it.",
"era": "1350-1600",
"bridge": {
"en": "Lyberg sensor: what the radars do not see; every index is a projection.",
"ru": "Датчик Люберга: чего не видят радары; любой индекс — проекция."
}
},
{
"id": "bodin",
"name": "Jean Bodin",
"name_ru": "Жан Боден",
"years": "1530 – 1596",
"wiki": "https://en.wikipedia.org/wiki/Jean_Bodin",
"zone": "one_model",
"idea": {
"en": "He explained the great price rise of his century by the flood of American silver, against the popular blame on greed: look for the cause in the data, not in the culprit.",
"ru": "Он объяснил великий рост цен своего века притоком американского серебра, а не жадностью, как говорили: ищи причину в данных, а не в виноватом.",
"de": "Preisrevolution durch Silberzufluss, nicht durch Gier."
},
"rule": "Before blaming a person, check whether the numbers point to a different cause.",
"era": "1350-1600",
"bridge": {
"en": "Halpern and Simpson sensors: what actually moved the index.",
"ru": "Датчики Халперна и Симпсона: что на самом деле сдвинуло индекс."
}
},
{
"id": "darmesteter",
"name": "Arsène Darmesteter",
"name_ru": "Арсен Дармстетер",
"years": "1846 – 1888",
"wiki": "https://en.wikipedia.org/wiki/Ars%C3%A8ne_Darmesteter",
"zone": "look_alike",
"idea": {
"en": "'The Life of Words': words change their meaning over time.",
"ru": "«Жизнь слов»: слова со временем меняют значение.",
"de": "„La vie des mots“: Wörter ändern ihre Bedeutung."
},
"rule": "Check what a word meant when the source was written.",
"era": "1801-1900",
"bridge": {
"en": "Koselleck and Alain Rey in the library; with Valla, a bridge of five centuries.",
"ru": "Козеллек и Ален Рей в библиотеке; вместе с Валлой — мост через пять веков."
}
},
{
"id": "schall_von_bell",
"name": "Johann Adam Schall von Bell",
"name_ru": "Адам Шалль фон Белль",
"years": "1591 – 1666",
"wiki": "https://en.wikipedia.org/wiki/Johann_Adam_Schall_von_Bell",
"zone": "one_model",
"idea": {
"en": "In 1644 the Chinese court settled the dispute between rival astronomical methods by a public test: whose eclipse prediction came true. His method won and reformed the calendar.",
"ru": "В 1644 году китайский двор решил спор соперничающих астрономических методов публичной проверкой: чьё предсказание затмения сбудется. Победил его метод, и календарь реформировали.",
"de": "1644 entschied der chinesische Hof den Streit der Methoden durch eine öffentliche Probe: wessen Finsternis-Vorhersage eintraf."
},
"rule": "Settle a dispute between models by a check against what happens, not by authority.",
"era": "1601-1700",
"bridge": {
"en": "Track record sensor and the forecast game scored by the Brier rule: models are judged by what came true.",
"ru": "«Счёт попаданий» и игра прогнозов по правилу Брайера: модели судят по тому, что сбылось."
}
},
{
"id": "song_yingxing",
"name": "Song Yingxing",
"name_ru": "Сун Инсин",
"years": "1587 – c. 1666",
"wiki": "https://en.wikipedia.org/wiki/Song_Yingxing",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Tiangong Kaiwu' (The Exploitation of the Works of Nature): he described crafts from what he saw in workshops and fields, and mocked scholars who wrote without looking.",
"ru": "«Тяньгун кайу»: он описывал ремёсла по тому, что видел в мастерских и полях, и смеялся над учёными, которые писали, не глядя.",
"de": "„Tiangong Kaiwu“: Handwerk beschrieben nach eigener Beobachtung."
},
"rule": "Prefer what was observed over what was only written about; say which one you have.",
"era": "1601-1700",
"bridge": {
"en": "Frankfurt sensor: is there something checkable in the claim; Baird: where did the number come from.",
"ru": "Датчик Франкфурта: есть ли в утверждении что проверить; Бэрд: откуда взялось число."
}
},
{
"id": "bacon",
"name": "Francis Bacon",
"name_ru": "Фрэнсис Бэкон",
"years": "1561 – 1626",
"wiki": "https://en.wikipedia.org/wiki/Francis_Bacon",
"zone": "own_limits",
"idea": {
"en": "The idols of the mind (tribe, cave, marketplace, theatre) and the 'table of absence': we see what confirms us, so look for the cases where the effect is missing.",
"ru": "Идолы разума (рода, пещеры, рынка, театра) и «таблица отсутствия»: мы видим то, что нас подтверждает, поэтому ищи случаи, где эффекта нет.",
"de": "Idole des Geistes und die „Tafel der Abwesenheit“."
},
"rule": "Look for the cases that would prove you wrong, not only the ones that agree.",
"era": "1601-1700",
"bridge": {
"en": "Kahneman sensor (noise in judgements) and the forecast game: count the misses, not only the hits.",
"ru": "Датчик Канемана (шум суждений) и игра прогнозов: считай промахи, а не только попадания."
}
},
{
"id": "casaubon",
"name": "Isaac Casaubon",
"name_ru": "Исаак Казобон",
"years": "1559 – 1614",
"wiki": "https://en.wikipedia.org/wiki/Isaac_Casaubon",
"zone": "rumour_vs_fact",
"idea": {
"en": "He dated the 'Hermetic' texts, believed to be older than Moses, to late antiquity by their language and references — the second great unmasking by anachronism after Valla.",
"ru": "Он датировал «Герметический корпус», который считали древнее Моисея, поздней античностью по языку и упоминаниям — второе великое разоблачение по анахронизму после Валлы.",
"de": "Er datierte die „hermetischen“ Schriften anhand ihrer Sprache in die Spätantike."
},
"rule": "Date a source by what it mentions and how it speaks, not by what it claims about itself.",
"era": "1601-1700",
"bridge": {
"en": "With Valla, Koselleck and Darmesteter: a bridge of four centuries for checking the date of a source.",
"ru": "С Валлой, Козеллеком и Дармстетером: мост через четыре века для проверки даты источника."
}
},
{
"id": "kepler",
"name": "Johannes Kepler",
"name_ru": "Иоганн Кеплер",
"years": "1571 – 1630",
"wiki": "https://en.wikipedia.org/wiki/Johannes_Kepler",
"zone": "one_model",
"idea": {
"en": "He gave up his own circular orbit for Mars because it missed Tycho Brahe's observations by eight arcminutes — and found the ellipse.",
"ru": "Он отказался от собственной круговой орбиты Марса, потому что она расходилась с наблюдениями Тихо Браге на восемь угловых минут, — и нашёл эллипс.",
"de": "Er verwarf seine Kreisbahn wegen acht Bogenminuten Abweichung von Tycho Brahes Daten."
},
"rule": "When good data disagree with your elegant model, change the model.",
"era": "1601-1700",
"bridge": {
"en": "Leamer and Breiman: trust what predicts, not what looks nicest.",
"ru": "Лимер и Брейман: верь тому, что предсказывает, а не тому, что красивее."
}
},
{
"id": "galileo",
"name": "Galileo Galilei",
"name_ru": "Галилео Галилей",
"years": "1564 – 1642",
"wiki": "https://en.wikipedia.org/wiki/Galileo_Galilei",
"zone": "rumour_vs_fact",
"idea": {
"en": "He looked through the telescope and reported what he saw, against what authorities had written: observation over authority.",
"ru": "Он посмотрел в телескоп и сообщил, что видел, вопреки написанному авторитетами: наблюдение важнее авторитета.",
"de": "Beobachtung vor Autorität: was das Fernrohr zeigt."
},
"rule": "Weigh a claim by the evidence behind it, not by who says it.",
"era": "1601-1700",
"bridge": {
"en": "check_headline and the news passport: status and outlets, not the speaker's rank.",
"ru": "Проверка заголовков и паспорт новости: статус и число изданий, а не ранг говорящего."
}
},
{
"id": "pascal",
"name": "Blaise Pascal",
"name_ru": "Блез Паскаль",
"years": "1623 – 1662",
"wiki": "https://en.wikipedia.org/wiki/Blaise_Pascal",
"zone": "answer_cost",
"idea": {
"en": "With Fermat he solved the 'problem of points': divide the stakes of an unfinished game by the chances of what would have happened — the birth of expected value.",
"ru": "Вместе с Ферма он решил «задачу об очках»: делить ставку прерванной игры по шансам того, что могло бы произойти, — рождение математического ожидания.",
"de": "Mit Fermat das „Problem der Punkte“: Erwartungswert."
},
"rule": "Weigh outcomes by their chances, not only by how good or bad they would be.",
"era": "1601-1700",
"bridge": {
"en": "Track record sensor and the forecast game: chances, intervals and the Brier score.",
"ru": "«Счёт попаданий» и игра прогнозов: шансы, интервалы и правило Брайера."
}
},
{
"id": "descartes",
"name": "René Descartes",
"name_ru": "Рене Декарт",
"years": "1596 – 1650",
"wiki": "https://en.wikipedia.org/wiki/Ren%C3%A9_Descartes",
"zone": "own_limits",
"idea": {
"en": "'Discourse on the Method': accept nothing as true that you do not clearly know; divide each difficulty into parts; check that nothing is left out.",
"ru": "«Рассуждение о методе»: не принимать за истину то, чего ясно не знаешь; делить трудность на части; проверять, что ничего не упущено.",
"de": "„Abhandlung über die Methode“: Zweifel, Zerlegen, Vollständigkeit prüfen."
},
"rule": "Split a hard question into parts and check at the end that nothing is missing.",
"era": "1601-1700",
"bridge": {
"en": "Hamilton sensor (what works, what was set aside) and the three layers of the method.",
"ru": "Датчик Гамильтон (что работает, что отложено) и три слоя метода."
}
},
{
"id": "huygens",
"name": "Christiaan Huygens",
"name_ru": "Христиан Гюйгенс",
"years": "1629 – 1695",
"wiki": "https://en.wikipedia.org/wiki/Christiaan_Huygens",
"zone": "measurement_error",
"idea": {
"en": "'On Reasoning in Games of Chance', the first printed book on probability: the value of an uncertain outcome can be calculated.",
"ru": "«О расчётах в азартных играх», первая печатная книга о вероятности: ценность неопределённого исхода можно вычислить.",
"de": "„De ratiociniis in ludo aleae“: das erste gedruckte Wahrscheinlichkeitsbuch."
},
"rule": "Put a number on uncertainty instead of calling it 'possible'.",
"era": "1601-1700",
"bridge": {
"en": "Hagenauer sensor: soft degrees instead of hard labels.",
"ru": "Датчик Хагенауэра: степени вместо жёстких ярлыков."
}
},
{
"id": "petty",
"name": "William Petty",
"name_ru": "Уильям Петти",
"years": "1623 – 1687",
"wiki": "https://en.wikipedia.org/wiki/William_Petty",
"zone": "measurement_error",
"idea": {
"en": "'Political Arithmetick': speak 'in terms of number, weight or measure' instead of opinion — the start of statistics about people.",
"ru": "«Политическая арифметика»: говорить «числом, весом и мерой», а не мнением, — начало статистики о людях.",
"de": "„Politische Arithmetik“: in Zahl, Gewicht und Maß sprechen."
},
"rule": "Back a claim about society with a number, its source and its unit.",
"era": "1601-1700",
"bridge": {
"en": "Baird sensor: the passport of every number.",
"ru": "Датчик Бэрда: паспорт каждого числа."
}
},
{
"id": "napier",
"name": "John Napier",
"name_ru": "Джон Непер",
"years": "1550 – 1617",
"wiki": "https://en.wikipedia.org/wiki/John_Napier",
"zone": "answer_cost",
"idea": {
"en": "Logarithms: a long multiplication becomes an addition — a tool that cut the cost of computing for three centuries.",
"ru": "Логарифмы: долгое умножение превращается в сложение — инструмент, удешевивший вычисления на три века.",
"de": "Logarithmen: Multiplikation wird Addition."
},
"rule": "Look for the transformation that makes the job cheap before doing it the long way.",
"era": "1601-1700",
"bridge": {
"en": "Bertsekas sensor: the cheap chain of calls instead of the naive one.",
"ru": "Датчик Бертсекаса: дешёвая цепочка вызовов вместо наивной."
}
},
{
"id": "mersenne",
"name": "Marin Mersenne",
"name_ru": "Марен Мерсенн",
"years": "1588 – 1648",
"wiki": "https://en.wikipedia.org/wiki/Marin_Mersenne",
"zone": "rumour_vs_fact",
"idea": {
"en": "He ran Europe's network of scientific letters and asked others to repeat experiments before believing them.",
"ru": "Он вёл сеть научной переписки Европы и просил других повторить опыт, прежде чем ему поверить.",
"de": "Er bat andere, Experimente zu wiederholen, bevor man ihnen glaubte."
},
"rule": "Trust a result more when independent others have repeated it.",
"era": "1601-1700",
"bridge": {
"en": "check_headline: independent voices, not copies; Rabin sensor: random re-checks.",
"ru": "Проверка заголовков: независимые голоса, а не копии; датчик Рабина: случайная перепроверка."
}
},
{
"id": "arnauld",
"name": "Antoine Arnauld",
"name_ru": "Антуан Арно",
"years": "1612 – 1694",
"wiki": "https://en.wikipedia.org/wiki/Antoine_Arnauld",
"zone": "side_effects",
"idea": {
"en": "'Port-Royal Logic': fear of a harm should depend not only on how grave it is but on how probable — people fear thunder more than they should.",
"ru": "«Логика Пор-Рояля»: страх перед вредом должен зависеть не только от его тяжести, но и от вероятности — люди боятся грома больше, чем следует.",
"de": "„Logik von Port-Royal“: Furcht nach Schwere und Wahrscheinlichkeit."
},
"rule": "Weigh a risk by its probability as well as its size before you alarm anyone.",
"era": "1601-1700",
"bridge": {
"en": "Kasperson sensor and the passport line 'do not make the risk sound bigger': a root of 1662.",
"ru": "Датчик Касперсона и строка паспорта «не раздувай риск»: корень 1662 года."
}
},
{
"id": "bernoulli_jacob",
"name": "Jacob Bernoulli",
"name_ru": "Якоб Бернулли",
"years": "1655 – 1705",
"wiki": "https://en.wikipedia.org/wiki/Jacob_Bernoulli",
"zone": "measurement_error",
"idea": {
"en": "'Ars Conjectandi' and the law of large numbers: with more observations the observed share comes close to the true chance — and he asked how many are enough for 'moral certainty'.",
"ru": "«Искусство предположений» и закон больших чисел: чем больше наблюдений, тем ближе наблюдаемая доля к истинной вероятности, — и он спросил, сколько их нужно для «моральной достоверности».",
"de": "„Ars Conjectandi“ und das Gesetz der großen Zahlen."
},
"rule": "Ask how many observations a conclusion needs before you draw it.",
"era": "1701-1800",
"bridge": {
"en": "Track record (no conclusion under 8 days) and Trevisan (how many headlines are enough).",
"ru": "«Счёт попаданий» (без вывода при меньше 8 днях) и Тревизан (сколько заголовков достаточно)."
}
},
{
"id": "bayes",
"name": "Thomas Bayes",
"name_ru": "Томас Байес",
"years": "c. 1701 – 1761",
"wiki": "https://en.wikipedia.org/wiki/Thomas_Bayes",
"zone": "own_limits",
"idea": {
"en": "Bayes' theorem: update how strongly you believe something by how much more likely the new evidence is if it is true than if it is false.",
"ru": "Теорема Байеса: меняй уверенность ровно настолько, насколько новое свидетельство вероятнее при истинности, чем при ложности.",
"de": "Satz von Bayes: Überzeugung nach der Beweiskraft neuer Daten anpassen."
},
"rule": "Update your confidence by the strength of the new evidence, no more and no less.",
"era": "1701-1800",
"bridge": {
"en": "Howard (wait or speak), Hagenauer (soft degrees), Edwards and Jeffrey in the library.",
"ru": "Ховард (ждать или говорить), Хагенауэр (степени), Эдвардс и Джеффри в библиотеке."
}
},
{
"id": "hume",
"name": "David Hume",
"name_ru": "Дэвид Юм",
"years": "1711 – 1776",
"wiki": "https://en.wikipedia.org/wiki/David_Hume",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Of Miracles': weigh a report against how improbable the event is — the more extraordinary the claim, the stronger the evidence must be. And the problem of induction: past patterns do not guarantee the future.",
"ru": "«О чудесах»: соизмеряй свидетельство с невероятностью события — чем необычнее утверждение, тем сильнее должны быть доказательства. И проблема индукции: прошлые закономерности не гарантируют будущего.",
"de": "„Über Wunder“: je außergewöhnlicher die Behauptung, desto stärker der Beleg."
},
"rule": "The more extraordinary a claim, the more independent evidence it needs before you repeat it.",
"era": "1701-1800",
"bridge": {
"en": "News passport: a 'record' or 'unprecedented' story carried by one outlet deserves extra caution.",
"ru": "Паспорт новости: история про «рекорд» или «беспрецедентное» от одного издания требует особой осторожности."
}
},
{
"id": "de_moivre",
"name": "Abraham de Moivre",
"name_ru": "Абрахам де Муавр",
"years": "1667 – 1754",
"wiki": "https://en.wikipedia.org/wiki/Abraham_de_Moivre",
"zone": "measurement_error",
"idea": {
"en": "'The Doctrine of Chances' and the normal approximation: the uncertainty of an average shrinks with the square root of the number of observations.",
"ru": "«Учение о шансах» и нормальное приближение: неопределённость среднего уменьшается как корень из числа наблюдений.",
"de": "„The Doctrine of Chances“: Unsicherheit schrumpft mit der Wurzel aus n."
},
"rule": "Four times the data halves the uncertainty, not quarters it.",
"era": "1701-1800",
"bridge": {
"en": "Trevisan sensor and the Wilson intervals of the track record.",
"ru": "Датчик Тревизана и интервалы Уилсона в «Счёте попаданий»."
}
},
{
"id": "bernoulli_daniel",
"name": "Daniel Bernoulli",
"name_ru": "Даниил Бернулли",
"years": "1700 – 1782",
"wiki": "https://en.wikipedia.org/wiki/Daniel_Bernoulli",
"zone": "answer_cost",
"idea": {
"en": "The St Petersburg paradox and expected utility: the value of a gain depends on what you already have, not only on its size.",
"ru": "Петербургский парадокс и ожидаемая полезность: ценность выигрыша зависит от того, что у тебя уже есть, а не только от его размера.",
"de": "Sankt-Petersburg-Paradoxon und Erwartungsnutzen."
},
"rule": "Judge what a result is worth to this person, not only its raw size.",
"era": "1701-1800",
"bridge": {
"en": "Pascal and Huygens before him; Kahneman and Tversky after.",
"ru": "До него Паскаль и Гюйгенс; после — Канеман и Тверски."
}
},
{
"id": "condorcet",
"name": "Marquis de Condorcet",
"name_ru": "Мари Жан Антуан Кондорсе",
"years": "1743 – 1794",
"wiki": "https://en.wikipedia.org/wiki/Marquis_de_Condorcet",
"zone": "rumour_vs_fact",
"idea": {
"en": "The jury theorem: a majority of voters is more likely right than any one of them — but only if they judge independently.",
"ru": "Теорема о жюри: большинство вероятнее право, чем любой отдельный голосующий, — но только если они судят независимо.",
"de": "Jury-Theorem: die Mehrheit irrt seltener – nur bei unabhängigen Urteilen."
},
"rule": "Many agreeing sources count only if they are independent of each other.",
"era": "1701-1800",
"bridge": {
"en": "check_headline counts independent voices after removing agency echo — the condition of Condorcet's theorem; Mersenne's repeated experiments.",
"ru": "Проверка заголовков считает независимые голоса без эха агентств — это и есть условие теоремы Кондорсе; повтор опыта у Мерсенна."
}
},
{
"id": "halley",
"name": "Edmond Halley",
"name_ru": "Эдмунд Галлей",
"years": "1656 – 1742",
"wiki": "https://en.wikipedia.org/wiki/Edmond_Halley",
"zone": "one_model",
"idea": {
"en": "He predicted the comet's return for 1758 and died before it came; the prediction came true and proved the model. He also built the first life table from real records.",
"ru": "Он предсказал возвращение кометы в 1758 году и не дожил до него; предсказание сбылось и доказало модель. Он же составил первую таблицу смертности по реальным записям.",
"de": "Er sagte die Rückkehr des Kometen für 1758 voraus; die Vorhersage bestätigte das Modell."
},
"rule": "A model earns trust by a dated prediction that later comes true.",
"era": "1701-1800",
"bridge": {
"en": "Schall von Bell's eclipse test, the track record sensor and the forecast game.",
"ru": "Проверка затмением у Шалля фон Белля, «Счёт попаданий» и игра прогнозов."
}
},
{
"id": "bayle",
"name": "Pierre Bayle",
"name_ru": "Пьер Бейль",
"years": "1647 – 1706",
"wiki": "https://en.wikipedia.org/wiki/Pierre_Bayle",
"zone": "rumour_vs_fact",
"idea": {
"en": "The 'Historical and Critical Dictionary': its notes list the errors of earlier dictionaries and authorities, one by one.",
"ru": "«Исторический и критический словарь»: в примечаниях он перечисляет ошибки прежних словарей и авторитетов, одну за другой.",
"de": "„Historisches und kritisches Wörterbuch“: Fehler früherer Werke."
},
"rule": "Check what a reference work says against its own sources; reference works copy each other's errors.",
"era": "1701-1800",
"bridge": {
"en": "Rabin sensor (random re-checks) and Kasperson (copies spread errors).",
"ru": "Датчик Рабина (случайная перепроверка) и Касперсон (копии разносят ошибки)."
}
},
{
"id": "leibniz",
"name": "Gottfried Wilhelm Leibniz",
"name_ru": "Готфрид Вильгельм Лейбниц",
"years": "1646 – 1716",
"wiki": "https://en.wikipedia.org/wiki/Gottfried_Wilhelm_Leibniz",
"zone": "one_model",
"idea": {
"en": "'Calculemus!' — let us calculate: turn a dispute into a computation that anyone can check.",
"ru": "«Calculemus!» — давайте посчитаем: превратить спор в вычисление, которое может проверить любой.",
"de": "„Calculemus!“ – Streit in eine prüfbare Rechnung verwandeln."
},
"rule": "Where you can, replace an argument by a calculation others can repeat.",
"era": "1701-1800",
"bridge": {
"en": "The method page and every sensor's open 'method' field: anyone can recompute.",
"ru": "Страница метода и открытое поле «method» у каждого датчика: пересчитать может любой."
}
},
{
"id": "lambert",
"name": "Johann Heinrich Lambert",
"name_ru": "Иоганн Генрих Ламберт",
"years": "1728 – 1777",
"wiki": "https://en.wikipedia.org/wiki/Johann_Heinrich_Lambert",
"zone": "measurement_error",
"idea": {
"en": "Theory of errors and 'Neues Organon': combine many imperfect measurements to find the most probable value, and separate appearance from truth.",
"ru": "Теория ошибок и «Новый органон»: объединять много неточных измерений, чтобы найти наиболее вероятное значение, и отделять видимость от истины.",
"de": "Fehlertheorie und „Neues Organon“."
},
"rule": "Combine several imperfect measurements instead of trusting one.",
"era": "1701-1800",
"bridge": {
"en": "Baird (independent paths) and Polyak (averaging against noise).",
"ru": "Бэрд (независимые пути) и Поляк (усреднение против шума)."
}
},
{
"id": "smith",
"name": "Adam Smith",
"name_ru": "Адам Смит",
"years": "1723 – 1790",
"wiki": "https://en.wikipedia.org/wiki/Adam_Smith",
"zone": "side_effects",
"idea": {
"en": "'The Wealth of Nations': individual choices add up to results nobody intended — the 'invisible hand' and its failures.",
"ru": "«Богатство народов»: решения отдельных людей складываются в результаты, которых никто не задумывал, — «невидимая рука» и её сбои.",
"de": "„Der Wohlstand der Nationen“: ungewollte Gesamtergebnisse."
},
"rule": "Ask what the sum of many people following your advice will do.",
"era": "1701-1800",
"bridge": {
"en": "Schelling and Merton in the library: micromotives and unintended consequences.",
"ru": "Шеллинг и Мёртон в библиотеке: микромотивы и непреднамеренные последствия."
}
},
{
"id": "quesnay",
"name": "François Quesnay",
"name_ru": "Франсуа Кенэ",
"years": "1694 – 1774",
"wiki": "https://en.wikipedia.org/wiki/Fran%C3%A7ois_Quesnay",
"zone": "side_effects",
"idea": {
"en": "The 'Tableau économique': the first chart of how money flows between sectors — ancestor of Leontief's input–output.",
"ru": "«Экономическая таблица»: первая схема того, как деньги текут между отраслями, — предок межотраслевого баланса Леонтьева.",
"de": "„Tableau économique“: Vorläufer der Input-Output-Analyse."
},
"rule": "Follow a change through the flows it feeds, not just its first stop.",
"era": "1701-1800",
"bridge": {
"en": "Leontief's bridge 'spill-over between radars', waiting for the history of all eight radars.",
"ru": "Мостик Леонтьева «перенос между радарами», ждёт истории всех восьми радаров."
}
},
{
"id": "condillac",
"name": "Étienne Bonnot de Condillac",
"name_ru": "Этьен Бонно де Кондильяк",
"years": "1714 – 1780",
"wiki": "https://en.wikipedia.org/wiki/%C3%89tienne_Bonnot_de_Condillac",
"zone": "look_alike",
"idea": {
"en": "'A science is a well-made language': unclear words make unclear thinking.",
"ru": "«Наука — это хорошо устроенный язык»: неясные слова рождают неясное мышление.",
"de": "„Eine Wissenschaft ist eine gut gemachte Sprache.“"
},
"rule": "Define your key words before reasoning with them.",
"era": "1701-1800",
"bridge": {
"en": "Naess, Quine and Iverson in the library.",
"ru": "Нэсс, Куайн и Айверсон в библиотеке."
}
},
{
"id": "saccheri",
"name": "Giovanni Girolamo Saccheri",
"name_ru": "Джованни Джироламо Саккери",
"years": "1667 – 1733",
"wiki": "https://en.wikipedia.org/wiki/Giovanni_Girolamo_Saccheri",
"zone": "own_limits",
"idea": {
"en": "Trying to prove Euclid's parallel axiom, he derived consistent non-Euclidean results — and rejected them as 'repugnant'. He found the new geometry and refused to see it.",
"ru": "Пытаясь доказать аксиому параллельных Евклида, он получил непротиворечивые неевклидовы следствия — и отверг их как «отвратительные». Он нашёл новую геометрию и отказался её видеть.",
"de": "Er fand nichteuklidische Ergebnisse und verwarf sie als „widerwärtig“."
},
"rule": "Do not reject a result only because it contradicts what you expected.",
"era": "1701-1800",
"bridge": {
"en": "The opposite of Kepler: one gave up his model for the data, the other gave up the data for his model.",
"ru": "Противоположность Кеплеру: тот отказался от модели ради данных, этот — от данных ради модели."
}
},
{
"id": "kant",
"name": "Immanuel Kant",
"name_ru": "Иммануил Кант",
"years": "1724 – 1804",
"wiki": "https://en.wikipedia.org/wiki/Immanuel_Kant",
"zone": "own_limits",
"idea": {
"en": "The antinomies of pure reason: beyond experience, reason can prove both a claim and its opposite equally well.",
"ru": "Антиномии чистого разума: за пределами опыта разум одинаково убедительно доказывает и утверждение, и его противоположность.",
"de": "Antinomien der reinen Vernunft: jenseits der Erfahrung lassen sich These und Gegenthese gleich gut beweisen."
},
"rule": "If two opposite answers sound equally convincing, the question is beyond your data: say so.",
"era": "1801-1900",
"bridge": {
"en": "Lindley and the 'say it is not known' rule; the own_limits zone of the passport.",
"ru": "Линдли и правило «говори „неизвестно“»; зона 8 паспорта."
}
},
{
"id": "laplace",
"name": "Pierre-Simon Laplace",
"name_ru": "Пьер-Симон Лаплас",
"years": "1749 – 1827",
"wiki": "https://en.wikipedia.org/wiki/Pierre-Simon_Laplace",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Philosophical Essay on Probabilities' (1814): the weight of evidence for an extraordinary claim must be proportioned to its strangeness; probability is common sense reduced to calculation.",
"ru": "«Опыт философии теории вероятностей» (1814): вес доказательств необычного утверждения должен быть соразмерен его странности; вероятность — это здравый смысл, сведённый к расчёту.",
"de": "„Essai philosophique sur les probabilités“: Belege müssen der Seltsamkeit einer Behauptung entsprechen."
},
"rule": "The stranger the claim, the more independent confirmation it needs before you repeat it as fact.",
"era": "1801-1900",
"bridge": {
"en": "Hume's 'Of Miracles' one century earlier; the EXTRAORDINARY line of the news passport.",
"ru": "Юм «О чудесах» веком раньше; строка EXTRAORDINARY в паспорте новости."
}
},
{
"id": "fourier",
"name": "Joseph Fourier",
"name_ru": "Жозеф Фурье",
"years": "1768 – 1830",
"wiki": "https://en.wikipedia.org/wiki/Joseph_Fourier",
"zone": "measurement_error",
"idea": {
"en": "Any signal can be split into regular waves of different periods (1822).",
"ru": "Любой сигнал можно разложить на правильные волны разных периодов (1822).",
"de": "Jedes Signal lässt sich in regelmäßige Wellen zerlegen (1822)."
},
"rule": "Before calling a change news, check whether it is just the usual daily or weekly rhythm.",
"era": "1801-1900",
"bridge": {
"en": "Radar noise in the track record: a half-hour jump may be the daily cycle of news, not an event.",
"ru": "Шум радара в «Счёте попаданий»: скачок за полчаса может быть суточным ритмом новостей, а не событием."
}
},
{
"id": "abel",
"name": "Niels Henrik Abel",
"name_ru": "Нильс Хенрик Абель",
"years": "1802 – 1829",
"wiki": "https://en.wikipedia.org/wiki/Niels_Henrik_Abel",
"zone": "own_limits",
"idea": {
"en": "He proved that the general equation of the fifth degree has no formula in radicals (1824): some searches end with a proof that there is nothing to find.",
"ru": "Он доказал, что общее уравнение пятой степени не решается в радикалах (1824): иные поиски заканчиваются доказательством, что искать нечего.",
"de": "Er bewies die Unlösbarkeit der allgemeinen Gleichung fünften Grades durch Radikale."
},
"rule": "When an answer cannot exist with the data you have, say that instead of producing one.",
"era": "1801-1900",
"bridge": {
"en": "Arrow's impossibility theorem in the library; Ruffini before him.",
"ru": "Теорема Эрроу о невозможности в библиотеке; до Абеля — Руффини."
}
},
{
"id": "dobrovsky",
"name": "Josef Dobrovský",
"name_ru": "Йосеф Добровский",
"years": "1753 – 1829",
"wiki": "https://en.wikipedia.org/wiki/Josef_Dobrovsk%C3%BD",
"zone": "rumour_vs_fact",
"idea": {
"en": "He declared the 'Green Mountain Manuscript', hailed as an ancient Czech treasure, a modern forgery (1824) — against patriotic enthusiasm.",
"ru": "Он объявил «Зеленогорскую рукопись», которую чтили как древнее чешское сокровище, современной подделкой (1824) — вопреки патриотическому восторгу.",
"de": "Er erklärte die gefeierte Grünberger Handschrift zur Fälschung (1824)."
},
"rule": "A text that flatters what readers want to believe needs more checking, not less.",
"era": "1801-1900",
"bridge": {
"en": "Valla → Casaubon → Dobrovský → Darmesteter: dating a text by its words; Zajonc in the library (the familiar feels true).",
"ru": "Валла → Казобон → Добровский → Дармстетер: датировка текста по словам; Зайонц в библиотеке (привычное кажется правдой)."
}
},
{
"id": "bentham",
"name": "Jeremy Bentham",
"name_ru": "Иеремия Бентам",
"years": "1748 – 1832",
"wiki": "https://en.wikipedia.org/wiki/Jeremy_Bentham",
"zone": "rumour_vs_fact",
"idea": {
"en": "'The Book of Fallacies' (1824): a catalogue of arguments used to avoid the question — appeal to authority, to the wisdom of ancestors, to fear of novelty.",
"ru": "«Книга заблуждений» (1824): каталог доводов, которыми уходят от вопроса, — ссылка на авторитет, на мудрость предков, на страх перед новым.",
"de": "„Das Buch der Trugschlüsse“ (1824): Argumente, die der Frage ausweichen."
},
"rule": "Notice when an argument answers who said it instead of whether it is true.",
"era": "1801-1900",
"bridge": {
"en": "Strawson's 'false premise' bridge and Schopenhauer's stratagems.",
"ru": "Мостик Стросона «ложная посылка» и уловки Шопенгауэра."
}
},
{
"id": "malthus",
"name": "Thomas Robert Malthus",
"name_ru": "Томас Роберт Мальтус",
"years": "1766 – 1834",
"wiki": "https://en.wikipedia.org/wiki/Thomas_Robert_Malthus",
"zone": "one_model",
"idea": {
"en": "Population grows geometrically, food arithmetically (1798) — a forecast that failed because farming productivity changed.",
"ru": "Население растёт в геометрической прогрессии, пища — в арифметической (1798); прогноз не сбылся, потому что изменилась производительность земледелия.",
"de": "Bevölkerung wächst geometrisch, Nahrung arithmetisch – die Prognose scheiterte."
},
"rule": "A trend extended into the future assumes nothing else changes; say that assumption out loud.",
"era": "1801-1900",
"bridge": {
"en": "Lorenz and Mandelbrot in the library; Halley's dated prediction as the opposite test.",
"ru": "Лоренц и Мандельброт в библиотеке; датированный прогноз Галлея как проверка наоборот."
}
},
{
"id": "schleiermacher",
"name": "Friedrich Schleiermacher",
"name_ru": "Фридрих Шлейермахер",
"years": "1768 – 1834",
"wiki": "https://en.wikipedia.org/wiki/Friedrich_Schleiermacher",
"zone": "look_alike",
"idea": {
"en": "Hermeneutics: a sentence is understood only through the whole text and the situation of its author — the hermeneutic circle.",
"ru": "Герменевтика: фразу понимают только через весь текст и положение автора — герменевтический круг.",
"de": "Hermeneutik: ein Satz versteht sich nur aus dem Ganzen und der Lage des Autors."
},
"rule": "Before quoting a sentence, read the paragraph around it.",
"era": "1801-1900",
"bridge": {
"en": "Derrida and Geertz in the library: the 'quote out of context' bridge.",
"ru": "Деррида и Гирц в библиотеке: мостик «цитата вне контекста»."
}
},
{
"id": "humboldt_w",
"name": "Wilhelm von Humboldt",
"name_ru": "Вильгельм фон Гумбольдт",
"years": "1767 – 1835",
"wiki": "https://en.wikipedia.org/wiki/Wilhelm_von_Humboldt",
"zone": "look_alike",
"idea": {
"en": "Each language carries its own view of the world; a translation never maps word to word.",
"ru": "Каждый язык несёт своё видение мира; перевод никогда не ложится слово в слово.",
"de": "Jede Sprache trägt eine eigene Weltansicht; Übersetzung ist nie Wort für Wort."
},
"rule": "When the same story arrives in several languages, compare meanings, not words.",
"era": "1801-1900",
"bridge": {
"en": "The echo check across ru/de/en and Levenshtein; the radio speaking three languages.",
"ru": "Проверка эха на трёх языках и Левенштейн; радио на трёх языках."
}
},
{
"id": "poisson",
"name": "Siméon Denis Poisson",
"name_ru": "Симеон Дени Пуассон",
"years": "1781 – 1840",
"wiki": "https://en.wikipedia.org/wiki/Sim%C3%A9on_Denis_Poisson",
"zone": "measurement_error",
"idea": {
"en": "'Research on the probability of judgments' (1837): rare independent events still come in clusters by pure chance — the distribution later named after him.",
"ru": "«Исследования о вероятности приговоров» (1837): редкие независимые события по чистой случайности всё равно идут кучками — распределение, позже названное его именем.",
"de": "Seltene unabhängige Ereignisse häufen sich zufällig (Poisson-Verteilung)."
},
"rule": "Three rare events in one week are not yet a pattern; check how often chance alone gives that.",
"era": "1801-1900",
"bridge": {
"en": "Skinner's 'pigeon superstition' bridge and radar noise.",
"ru": "Мостик Скиннера «суеверие голубя» и шум радара."
}
},
{
"id": "bessel",
"name": "Friedrich Bessel",
"name_ru": "Фридрих Бессель",
"years": "1784 – 1846",
"wiki": "https://en.wikipedia.org/wiki/Friedrich_Bessel",
"zone": "measurement_error",
"idea": {
"en": "The 'personal equation' (1823): every observer has a steady bias of his own; it can be measured and removed.",
"ru": "«Личное уравнение» (1823): у каждого наблюдателя своё постоянное смещение; его можно измерить и вычесть.",
"de": "Die „persönliche Gleichung“: jeder Beobachter hat seine eigene feste Abweichung."
},
"rule": "Know each source's usual lean before comparing what two sources report.",
"era": "1801-1900",
"bridge": {
"en": "Griliches (measurement error) and Lyberg (state media) in the library.",
"ru": "Грилихес (ошибка измерения) и Люберг (госСМИ) в библиотеке."
}
},
{
"id": "bastiat",
"name": "Frédéric Bastiat",
"name_ru": "Фредерик Бастиа",
"years": "1801 – 1850",
"wiki": "https://en.wikipedia.org/wiki/Fr%C3%A9d%C3%A9ric_Bastiat",
"zone": "side_effects",
"idea": {
"en": "'What is seen and what is not seen' (1850): the broken window gives the glazier work — and hides what the money would otherwise have bought.",
"ru": "«Что видно и чего не видно» (1850): разбитое окно даёт работу стекольщику — и прячет то, на что деньги пошли бы иначе.",
"de": "„Was man sieht und was man nicht sieht“ (1850)."
},
"rule": "For every visible effect, name the unseen one: what did not happen because of it?",
"era": "1801-1900",
"bridge": {
"en": "Smith and Merton (unintended consequences); the side_effects zone; Jevons's paradox.",
"ru": "Смит и Мёртон (непреднамеренные последствия); зона 6; парадокс Джевонса."
}
},
{
"id": "lobachevsky",
"name": "Nikolai Lobachevsky",
"name_ru": "Николай Лобачевский",
"years": "1792 – 1856",
"wiki": "https://en.wikipedia.org/wiki/Nikolai_Lobachevsky",
"zone": "own_limits",
"idea": {
"en": "He accepted the strange consequences that Saccheri had rejected and built a consistent non-Euclidean geometry (1829).",
"ru": "Он принял странные следствия, которые отверг Саккери, и построил непротиворечивую неевклидову геометрию (1829).",
"de": "Er nahm an, was Saccheri verworfen hatte: nichteuklidische Geometrie (1829)."
},
"rule": "If a strange result follows without contradiction, keep it and test it instead of rejecting it.",
"era": "1801-1900",
"bridge": {
"en": "Saccheri a century earlier; Kepler's choice of data over the beautiful model.",
"ru": "Саккери веком раньше; выбор Кеплера — данные важнее красивой модели."
}
},
{
"id": "dirichlet",
"name": "Peter Gustav Lejeune Dirichlet",
"name_ru": "Петер Густав Лежён Дирихле",
"years": "1805 – 1859",
"wiki": "https://en.wikipedia.org/wiki/Peter_Gustav_Lejeune_Dirichlet",
"zone": "look_alike",
"idea": {
"en": "The pigeonhole principle (1834): put more things into fewer boxes and some box must hold two.",
"ru": "Принцип ящиков (1834): разложи больше предметов по меньшему числу ящиков — в каком-то окажется два.",
"de": "Schubfachprinzip (1834)."
},
"rule": "Where there are more people than names, namesakes are certain: confirm identity by more than a name.",
"era": "1801-1900",
"bridge": {
"en": "The 'namesakes in the news' bridge (Levenshtein, Geach, Winkler).",
"ru": "Мостик «тёзки в новостях» (Левенштейн, Гич, Уинклер)."
}
},
{
"id": "schopenhauer",
"name": "Arthur Schopenhauer",
"name_ru": "Артур Шопенгауэр",
"years": "1788 – 1860",
"wiki": "https://en.wikipedia.org/wiki/Arthur_Schopenhauer",
"zone": "rumour_vs_fact",
"idea": {
"en": "'Eristic Dialectic': 38 tricks for winning an argument regardless of truth — extending the opponent's claim, shifting the question, appeal to authority.",
"ru": "«Эристическая диалектика»: 38 уловок, чтобы выиграть спор независимо от истины, — расширить тезис противника, подменить вопрос, сослаться на авторитет.",
"de": "„Eristische Dialektik“: 38 Kunstgriffe, um recht zu behalten."
},
"rule": "In a debate, answer the claim that was made, not a bigger version of it.",
"era": "1801-1900",
"bridge": {
"en": "Bentham's fallacies and Strawson's 'false premise' bridge; the round table.",
"ru": "Заблуждения Бентама и мостик Стросона «ложная посылка»; круглый стол."
}
},
{
"id": "schleicher",
"name": "August Schleicher",
"name_ru": "Август Шлейхер",
"years": "1821 – 1868",
"wiki": "https://en.wikipedia.org/wiki/August_Schleicher",
"zone": "rumour_vs_fact",
"idea": {
"en": "The family tree of languages (1853): sister languages are traced back to a common ancestor by their shared changes.",
"ru": "Родословное древо языков (1853): родственные языки возводят к общему предку по общим изменениям.",
"de": "Stammbaumtheorie (1853): Sprachen auf einen gemeinsamen Vorfahren zurückführen."
},
"rule": "When many texts share the same wording, draw their family tree and find the first one.",
"era": "1801-1900",
"bridge": {
"en": "The echo check (agency copies) and radar_life (first count of outlets); Condorcet's independence.",
"ru": "Проверка эха (копии агентств) и radar_life (первое число изданий); независимость по Кондорсе."
}
},
{
"id": "dal",
"name": "Vladimir Dal",
"name_ru": "Владимир Даль",
"years": "1801 – 1872",
"wiki": "https://en.wikipedia.org/wiki/Vladimir_Dal",
"zone": "stale_data",
"idea": {
"en": "The 'Explanatory Dictionary of the Living Great Russian Language' (1863–1866), gathered from speakers in his travels, not from books.",
"ru": "«Толковый словарь живого великорусского языка» (1863–1866), собранный со слов людей в поездках, а не из книг.",
"de": "Wörterbuch der lebenden russischen Sprache, aus dem Volksmund gesammelt."
},
"rule": "Take how words are used now from current speech, not from an old dictionary.",
"era": "1801-1900",
"bridge": {
"en": "Song Yingxing (describe what you see); Alain Rey and Darmesteter.",
"ru": "Сун Инсин (описывать увиденное); Ален Рей и Дармстетер."
}
},
{
"id": "mill",
"name": "John Stuart Mill",
"name_ru": "Джон Стюарт Милль",
"years": "1806 – 1873",
"wiki": "https://en.wikipedia.org/wiki/John_Stuart_Mill",
"zone": "one_model",
"idea": {
"en": "'A System of Logic' (1843): methods of agreement, difference and concomitant variation for finding causes.",
"ru": "«Система логики» (1843): методы сходства, различия и сопутствующих изменений для поиска причин.",
"de": "„System der Logik“: Methoden der Übereinstimmung, des Unterschieds und der Begleitveränderung."
},
"rule": "Two things moving together is only concomitant variation; check the case where one moves without the other.",
"era": "1801-1900",
"bridge": {
"en": "Granger and Salmon: the 'who leads whom' bridge of the track record (waits until ~14.12).",
"ru": "Грейнджер и Сэлмон: мостик «кто кого ведёт» в «Счёте попаданий» (ждёт до ~14.12)."
}
},
{
"id": "cournot",
"name": "Antoine Augustin Cournot",
"name_ru": "Антуан Огюстен Курно",
"years": "1801 – 1877",
"wiki": "https://en.wikipedia.org/wiki/Antoine_Augustin_Cournot",
"zone": "one_model",
"idea": {
"en": "Chance is the meeting of independent chains of causes (1843): a coincidence is real but explains nothing.",
"ru": "Случай — это встреча независимых цепочек причин (1843): совпадение реально, но ничего не объясняет.",
"de": "Zufall ist das Zusammentreffen unabhängiger Kausalketten (1843)."
},
"rule": "Do not read a cause into two events that only happened at the same time.",
"era": "1801-1900",
"bridge": {
"en": "Mill, Granger and Salmon; the 'cause or shadow' bridge.",
"ru": "Милль, Грейнджер и Сэлмон; мостик «причина или тень»."
}
},
{
"id": "babbage",
"name": "Charles Babbage",
"name_ru": "Чарлз Бэббидж",
"years": "1791 – 1871",
"wiki": "https://en.wikipedia.org/wiki/Charles_Babbage",
"zone": "measurement_error",
"idea": {
"en": "He designed calculating engines because printed tables were full of copying errors; asked whether wrong figures put in would give right answers, he could not grasp the confusion of ideas behind the question.",
"ru": "Он придумал вычислительные машины, потому что печатные таблицы были полны ошибок переписчиков; на вопрос, выйдут ли верные ответы, если ввести неверные числа, он ответил, что не может понять путаницы мыслей, стоящей за таким вопросом.",
"de": "Rechenmaschinen gegen Fehler in Tafeln; falsche Zahlen ergeben keine richtigen Antworten."
},
"rule": "A careful calculation on bad input gives a confident wrong answer: check the input first.",
"era": "1801-1900",
"bridge": {
"en": "Griliches and radar noise; Bayle's errors copied from book to book.",
"ru": "Грилихес и шум радара; ошибки, которые Бейль находил переписанными из книги в книгу."
}
},
{
"id": "jevons",
"name": "William Stanley Jevons",
"name_ru": "Уильям Стенли Джевонс",
"years": "1835 – 1882",
"wiki": "https://en.wikipedia.org/wiki/William_Stanley_Jevons",
"zone": "one_model",
"idea": {
"en": "Two ideas: the Jevons paradox (more efficient coal engines raised coal use, 1865) and his own mistake — tying trade cycles to the sunspot cycle because the periods looked alike.",
"ru": "Две идеи: парадокс Джевонса (более экономные паровые машины увеличили расход угля, 1865) и его собственная ошибка — связь торговых циклов с солнечными пятнами, потому что периоды казались похожими.",
"de": "Jevons-Paradoxon und sein Irrtum: Konjunktur und Sonnenflecken."
},
"rule": "Two cycles with a similar period are not yet cause and effect.",
"era": "1801-1900",
"bridge": {
"en": "Cournot and Mill in this era; Skinner's pigeon and Granger in the library.",
"ru": "Курно и Милль в этой эпохе; голубь Скиннера и Грейнджер в библиотеке."
}
},
{
"id": "chasles",
"name": "Michel Chasles",
"name_ru": "Мишель Шаль",
"years": "1793 – 1880",
"wiki": "https://en.wikipedia.org/wiki/Michel_Chasles",
"zone": "own_limits",
"idea": {
"en": "A great geometer, he bought some 27,000 forged letters (1861–1869) — Pascal 'anticipating' Newton, even Cleopatra — all written in modern French.",
"ru": "Великий геометр, он купил около 27 000 поддельных писем (1861–1869) — Паскаль, «опередивший» Ньютона, даже Клеопатра, — и все на современном французском.",
"de": "Der große Geometer kaufte 27 000 gefälschte Briefe, sogar von Kleopatra – auf Französisch."
},
"rule": "Expertise in one field does not protect you in another; a find that flatters your side needs double checking.",
"era": "1801-1900",
"bridge": {
"en": "The anti-example to Valla, Casaubon and Dobrovský: the anachronism was in plain sight.",
"ru": "Антипример к Валле, Казобону и Добровскому: анахронизм был на виду."
}
},
{
"id": "fechner",
"name": "Gustav Fechner",
"name_ru": "Густав Теодор Фехнер",
"years": "1801 – 1887",
"wiki": "https://en.wikipedia.org/wiki/Gustav_Fechner",
"zone": "measurement_error",
"idea": {
"en": "The Weber–Fechner law (1860): we feel changes relative to the level we start from, not in absolute amounts.",
"ru": "Закон Вебера — Фехнера (1860): мы ощущаем изменение относительно исходного уровня, а не в абсолютных величинах.",
"de": "Weber-Fechner-Gesetz (1860): wir empfinden relative, nicht absolute Änderungen."
},
"rule": "Report a change against its usual size and base, not only as a raw number.",
"era": "1801-1900",
"bridge": {
"en": "radar_now.vs_typical in the track record; Daniel Bernoulli's utility a century earlier.",
"ru": "radar_now.vs_typical в «Счёте попаданий»; полезность Даниила Бернулли веком раньше."
}
},
{
"id": "chebyshev",
"name": "Pafnuty Chebyshev",
"name_ru": "Пафнутий Чебышёв",
"years": "1821 – 1894",
"wiki": "https://en.wikipedia.org/wiki/Pafnuty_Chebyshev",
"zone": "own_limits",
"idea": {
"en": "Chebyshev's inequality (1867): whatever the shape of the distribution, at most 1/k² of values lie more than k standard deviations from the mean.",
"ru": "Неравенство Чебышёва (1867): какова бы ни была форма распределения, не больше 1/k² значений лежат дальше k стандартных отклонений от среднего.",
"de": "Tschebyschow-Ungleichung (1867): gilt für jede Verteilung."
},
"rule": "When you do not know the shape of the data, use a bound that holds for any shape.",
"era": "1801-1900",
"bridge": {
"en": "Mandelbrot's heavy tails and Lorenz: the 'tails' bridge.",
"ru": "Тяжёлые хвосты Мандельброта и Лоренц: мостик «хвосты»."
}
},
{
"id": "verner",
"name": "Karl Verner",
"name_ru": "Карл Вернер",
"years": "1846 – 1896",
"wiki": "https://en.wikipedia.org/wiki/Karl_Verner",
"zone": "own_limits",
"idea": {
"en": "Verner's law (1875): the exceptions to Grimm's sound law were not noise — they followed the position of the old stress.",
"ru": "Закон Вернера (1875): исключения из закона Гримма оказались не шумом — они следовали месту древнего ударения.",
"de": "Vernersches Gesetz (1875): Ausnahmen zu Grimm folgten dem alten Akzent."
},
"rule": "Before dismissing exceptions as noise, check whether they follow a rule of their own.",
"era": "1801-1900",
"bridge": {
"en": "Saccheri and Lobachevsky; radar noise (do jumps revert or not).",
"ru": "Саккери и Лобачевский; шум радара (откатываются ли скачки)."
}
}
];
export function timeMachineReport({ era = null, zone = null, q = null } = {}, origin = "https://orbstudio.org") {
  let all = TIME_MACHINE;
  if (era && TM_ERAS[era]) all = all.filter((c) => c.era === era);
  if (zone) all = all.filter((c) => c.zone === zone);
  if (q) { const s = String(q).toLowerCase().slice(0, 80); all = all.filter((c) => [c.name, c.name_ru, c.idea.en, c.rule].some((x) => x && x.toLowerCase().includes(s))); }
  const eras = Object.keys(TM_ERAS).map((k) => ({ id: k, title: TM_ERAS[k].en, cards: TIME_MACHINE.filter((c) => c.era === k).length }));
  return { library: "time_machine", count: all.length, eras, cards: all,
    about: "Orb Studio's Time Machine: ideas of scientists from any era, chosen by one test — does the idea give an AI agent a rule today and build a bridge to the Crystal Library or a live sensor? 'bridge' names that link across the centuries. The rule is Orb Studio's interpretation, not the scientist's words.",
    how_built: "Raw death lists of a chosen year or period come from Gemini (Russian Wikipedia); Claude selects and finds the bridges.", page: origin + "/tools/timemachine", library_page: origin + "/tools/crystals" };
}
