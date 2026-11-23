// СГЕНЕРИРОВАНО tools/timemachine.py из tools/timemachine_data.py — правьте данные там.
export const TM_ERAS = {"1350-1600": {"en": "Renaissance and the age of discovery, 1350–1600", "ru": "Возрождение и великие открытия, 1350–1600", "de": "Renaissance und Entdeckungen, 1350–1600"}, "1601-1700": {"en": "Seventeenth century", "ru": "XVII век", "de": "17. Jahrhundert"}, "1801-1900": {"en": "Nineteenth century", "ru": "XIX век", "de": "19. Jahrhundert"}};
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
