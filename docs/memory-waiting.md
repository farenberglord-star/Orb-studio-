# Память: учёные, проверенные, но ещё без мостика

Правило (с 26.11.2026): карточку в библиотеке заводим, только если она сразу входит хотя бы в один мостик (можно idea с ясным `needs`). Остальные проверенные учёные живут здесь: никто не забыт, проверка не теряется. Когда для человека находится мостик — переносим в `tools/crystals_data.py` и удаляем строку отсюда.
Имена отсюда попадают в `docs/scanner-known-names.txt` (`python3 tools/scanner_names.py list`), чтобы сканеры не предлагали их снова.

Формат строки: `- Имя Фамилия | годы | зона | работа (год) | правило | источник смерти | что мешает мостику`

## Проверены (смерть подтверждена источником)
- Kazimierz Ajdukiewicz | 1890–1963 | one_model | «Obraz świata i aparatura pojęciowa» (1934) | картина мира зависит от выбранного понятийного аппарата; смена аппарата меняет и ответы | en.wikipedia.org/wiki/Kazimierz_Ajdukiewicz | нет числа; возможно рядом с leamer (model_not_world), но связь пока натянута
- Genrich Altshuller | 1926–1998 | one_model | «Алгоритм изобретения» (1969) | при противоречии двух параметров не соглашайся на компромисс, а назови противоречие и ищи способ его снять | en.wikipedia.org/wiki/Genrikh_Altshuller | нет числа; возможное правило ведущих: две строки паспорта тянут уверенность в разные стороны — назвать, а не усреднять (владелец: патентная инспекция — не военная тема)
- James Martin | 1933–2013 | stale_data | «Principles of Data-Base Management» (1976) | — | theregister.co.uk 2013/06/28 | правило Лианы («окно валютности») в книге не подтверждено
- Philip Converse | 1928–2014 | one_model | «The Nature of Belief Systems in Mass Publics» (1964) | ответы одних и тех же людей неустойчивы между волнами опроса («неустановки») | casbs.stanford.edu (некролог) | нет числа на наших данных
- George A. Miller | 1920–2012 | own_limits | «The Magical Number Seven, Plus or Minus Two» (1956) | рабочая память удерживает около 7±2 элементов | — (сверить при открытии зоны) | зона own_limits закрыта
- Arthur C. Pigou | 1877–1959 | side_effects | «The Economics of Welfare» (1920) | частные и общественные издержки расходятся | — (сверить при открытии зоны) | зона side_effects закрыта
- Norman R. F. Maier | 1900–1977 | side_effects | «Reasoning in Humans: I. On Direction» (1930) | привычное направление решения мешает найти новое | — (сверить при открытии зоны) | зона side_effects закрыта
- Roman Suszko | 1919–1979 | rumour_vs_fact | «Non-Fregean Logic and Theories» (1968) | истинность высказывания и тождество описываемых ситуаций — разные вещи | en.wikipedia.org/wiki/Roman_Suszko | связь со «слухом и фактом» слабая
- Adam Schaff | 1913–2006 | rumour_vs_fact | «Wstęp do semantyki» (1960) | — | pl.wikipedia.org/wiki/Adam_Schaff | правило — общий пересказ; речевые акты покрыты датчиком searle

- Emil Post | 1897–1954 | one_model | «Introduction to a General Theory of Elementary Propositions» (1921) | полнота системы связок проверяется выразимостью всех функций | en.wikipedia.org/wiki/Emil_Leon_Post | правило не даёт агенту действия; нет числа
- Stanisław Leśniewski | 1886–1939 | one_model | «Podstawy ogólnej teoryi mnogości. I» (1916) | мереология: логический класс и реальное целое из частей — разные вещи | en.wikipedia.org/wiki/Stanis%C5%82aw_Le%C5%9Bniewski | нет числа; связь с одной моделью слабая

- Ágnes Heller | 1929–2019 | rumour_vs_fact | «A mindennapi élet» (1970; англ. «Everyday Life», 1984) | повседневное мышление смешивает оценку и знание | en.wikipedia.org/wiki/%C3%81gnes_Heller | правило Лианы — пересказ; «оценка ≠ факт» уже у Оссовской (мостик tone)

- Rensis Likert | 1903–1981 | one_model | «A Technique for the Measurement of Attitudes» (1932) | суммарный балл имеет смысл, только если пункты шкалы согласованы между собой (анализ пунктов) | en.wikipedia.org/wiki/Rensis_Likert | нет числа: согласованность частей индекса радара сейчас не считается (возможная пара — «Лимер»)
- Fritz Machlup | 1902–1983 | answer_cost | «The Production and Distribution of Knowledge in the United States» (1962) | производство знания — отрасль с затратами; ценность нового знания сверяется с затратами | en.wikipedia.org/wiki/Fritz_Machlup | правило — пересказ; работа про долю знания в экономике, не про цену одной проверки

- Jacob Wolfowitz | 1910–1981 | one_model | Wald & Wolfowitz, «On a Test Whether Two Samples are from the Same Population» (1940) | число серий роста и падения против случайного | en.wikipedia.org/wiki/Jacob_Wolfowitz | покрыто «Нельсоном» и Дурбином — Уотсоном (липкость); мостика нового нет

- C. R. Rao | 1920–2023 | one_model | «Diversity and dissimilarity coefficients: a unified approach» (1982) | разнообразие с учётом расстояния между категориями (квадратичная энтропия) | en.wikipedia.org/wiki/C._R._Rao | нужны метки страны/языка/агентства у изданий — их пока нет

## Ждут проверки даты смерти
- Tadeusz Pszczołowski | 1922–? | answer_cost | «Zasady sprawnego działania» (1960) | праксеология: оценка действия по соотношению результата и затрат | каталог Академии военного искусства: 1922–1999; Лиана: 1922–2019 — расхождение | войдёт в economy_of_checking вместе с Котарбинским, когда дата подтвердится
- William Kent | ?–? | stale_data | «Data and Reality» (1978) | запись и реальный объект расходятся со временем | смерть известна (сын держит права), год не найден | нет даты
- Robert E. Burton | 1919–? | stale_data | Burton & Kebler, «The "Half-Life" of Some Scientific and Technical Literatures» (1960) | — | годы не найдены | полураспад покрыт карточкой Брукса
- Alexander M. Mood | 1913–? | stale_data | «Introduction to the Theory of Statistics» (1950), медианный тест | равенство медиан выборок | Лиана: 2009, не подтверждено | медианный лаг перепечаток уже даёт датчик «Шмидт»
- C. K. Chow | ?–? | answer_cost | «An Optimum Character Recognition System Using Decision Functions» (1957), правило отказа от ответа | при заданной цене ошибки лучше отказаться от решения, чем ошибиться | годы не найдены (Лиана: «Вен Чинг Чоу, 1928–2020» — не подтверждено; Chow 1924 в библиотеке — тёзка Юань-Ши Чоу) | войдёт в say_not_known, когда подтвердятся годы
- Thomas Willett | ?–? | rumour_vs_fact | «A Cross-Linguistic Survey of the Grammaticization of Evidentiality» (1988) | типы свидетельств: прямое, косвенное, слух | годы не найдены | идея уже в мостике named_or_anonymous через Чейфа
- Markus Båth | 1916–? | look_alike | «Lateral inhomogeneities of the upper mantle» (Tectonophysics, 1965), закон Бота | сильнейший афтершок примерно на 1,2 магнитуды слабее главного толчка | год смерти не найден (EGU: медаль Гутенберга 1998; Лиана: 2003, по памяти) | закон уже считается в датчике «Омори» (bath_gap) — карточка, когда подтвердится год
- Donald L. Shaw | 1936?–? | one_model | «The Agenda-Setting Function of Mass Media» (1972, с М. Маккомбсом) | о чём много пишут, то кажется важным | жив или нет — не подтверждено | Маккомбс уже в библиотеке; карточка Шоу — когда подтвердится
- Mikhail Bakhtin | 1895–1975 | rumour_vs_fact | «Марксизм и философия языка» (1929, издана под именем Волошинова) | формы передачи чужой речи | en.wikipedia.org/wiki/Mikhail_Bakhtin | авторство спорно — карточка у Волошинова как у автора издания; собственная работа Бахтина с правилом для агента пока не выбрана
- Tibor Braun | 1932–2022 | one_model | «Editorial gatekeeping patterns in international science journals» (Scientometrics, 1982, с Зсиндели и Шубертом; статью не открывал) | концентрация редакционного контроля | некролог Scientometrics: умер 27.09.2022 | у нас нет данных о редакторах, только об изданиях; мера концентрации источников уже есть (Херфиндаль, Реньи)
- Ivan Fellegi | род. 1935, жив (Statistics Canada, 2025) | answer_cost | «A Theory for Record Linkage» (JASA, 1969, с Алан Сантер) | три решения при заданных ошибках: совпало, не совпало, неясно | жив или нет — не подтверждено; годы Сантера не найдены | идея близка к Ньюкому (newcombe_h) и к склейке заголовков (sameStory)
- Anthony Pettitt | ?–? | stale_data | «A Non-Parametric Approach to the Change-Point Problem» (Applied Statistics, 1979) | один сдвиг уровня без предположения о нормальности | жив или нет — не подтверждено | метод для «Шухарта», карточка после подтверждения
