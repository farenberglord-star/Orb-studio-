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

## Ждут проверки даты смерти
- Tadeusz Pszczołowski | 1922–? | answer_cost | «Zasady sprawnego działania» (1960) | праксеология: оценка действия по соотношению результата и затрат | каталог Академии военного искусства: 1922–1999; Лиана: 1922–2019 — расхождение | войдёт в economy_of_checking вместе с Котарбинским, когда дата подтвердится
- William Kent | ?–? | stale_data | «Data and Reality» (1978) | запись и реальный объект расходятся со временем | смерть известна (сын держит права), год не найден | нет даты
- Robert E. Burton | 1919–? | stale_data | Burton & Kebler, «The "Half-Life" of Some Scientific and Technical Literatures» (1960) | — | годы не найдены | полураспад покрыт карточкой Брукса
