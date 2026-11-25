# Паспорт новости: датчик → строка → кристалл (проверено по коду 25.11.2026)

Точка входа: `/api/v1/news?topic=` (MCP `get_news_by_topic`). Та же таблица в машинном виде: `/api/v1/news-passport-table` (источник — `src/news.js`, `PASSPORT_TABLE`).
Паспорт не вердикт: признаки и причины с цитатой; нет измерения — null. Учёный без строки здесь остаётся кристаллом библиотеки, без датчика.

scope: per_headline — к отдельной новости; headline_only — только если заголовок попал в выборку датчика (иначе null = «не смотрели», не «чисто»); aggregate — датчик о ленте целиком; topic — по теме вопроса; system — об Orb Studio.
status: live — в ответе сейчас; partial — частично; not_wired — датчик есть, к новости не подключён; missing — ни строки, ни данных.

| строка | датчик | кристаллы | scope | status | примечание |
|---|---|---|---|---|---|
| speech_act | get_searle | searle | per_headline | live | event / statement / promise / threat / demand / forecast / question |
| checkability | get_frankfurt | frankfurt | per_headline | live | who / when / how many / where, and vague words |
| state_media | get_lyberg | lyberg | per_headline | live | source is state media, named as such |
| retellings_vs_first_source | get_kasperson | kasperson, zajonc, howard | per_headline | live | outlets at first and at the peak; first source on our radars |
| independent_voices | check_headline | howard | per_headline | live | how many outlets carry it on the radars |
| freshness | get_mikrin | mikrin, cox | per_headline | partial | age from the source's publication time; Mikrin measures our own path to air for the broadcast blocks, not each headline |
| extraordinary_claim | — | hume, laplace | per_headline | live | record / unprecedented / first ever with few outlets |
| quoted_words | — | derrida, schleiermacher | per_headline | live | someone's words in the headline; say whose and where |
| found_document | — | valla | per_headline | live | leaked or newly found document or recording |
| metaphor | — | max_mueller | per_headline | live | figure of speech in place of a fact |
| loaded_words | — | osgood | per_headline | live | emotionally loaded words, quoted |
| rumour_risk | — | allport, cantril | per_headline | live | grave topic × few outlets × unclear facts |
| evidence_chain | — | wigmore, frank_j | per_headline | live | links from event to headline and the weakest one |
| retell_shape | get_schmidt | schmidt_j, schleicher, tarde | per_headline | live | chain or wave of outlets joining the story; null under three outlets |
| quake_loudness | get_cohen_s | cohen_s | headline_only | live | only earthquake headlines: wording against the USGS magnitude; null for everything else |
| science_signs | get_park | park | headline_only | live | only science and health headlines Park's sensor scanned, with the quoted words; null = not scanned, not clean |
| index_mover | get_polyak | polyak | headline_only | live | headline is among those that moved a radar index (hallucination, consensus) in the last 3 hours; null otherwise |
| source_core_or_tail | get_bradford | bradford_sc, lotka, pareto, lyberg | aggregate | not_wired | core and tail of outlets is a measure of the whole feed; per headline it could say 'only the tail carried it', not wired yet |
| said_then_did | get_promises | — | topic | partial | ECB and Fed statements against decisions; offered in topic_sensors when the topic is rates, not attached to a headline |
| radar_vs_price | get_trackrecord | — | topic | partial | how often BTC/ETH/XRP moved with or against the crypto radar; offered in topic_sensors for crypto topics |
| data_gaps | get_hamilton | — | system | live | what Orb Studio has switched off or has not refreshed right now (data_gaps); about us, not about the news |
| first_source_found | get_kasperson | tannery, kasperson | per_headline | partial | first source among our radars or null; null does not mean there is none |
| edited_after_publication | — | — | per_headline | missing | we do not store versions of a headline or article, so there is no measurement: always null, measured=false |
| call_to_action | — | allport | per_headline | live | call or demand words found in the headline, quoted; a sign, not a label |
| number_checkable | get_frankfurt | frankfurt | per_headline | live | the headline has a number, and whether who/when/where anchor it |

## Кандидаты из задания: что реально применимо к отдельной новости
- **Park** — применим только к научным и медицинским заголовкам, которые датчик просмотрел за последние 6 часов (Google News, не заголовки радаров). Совпадение по тексту заголовка → строка science_signs с цитатой. Нет совпадения → null («не просмотрено»).
- **Schmidt** — форма истории (цепь/волна) считается по радарной таблице radar_life (поле joins) и есть для каждой истории с тремя и более изданиями → строка retell_shape. Меньше трёх изданий → null. Страницы датчика в `public/tools/` нет (см. шаг Б первого задания).
- **Bradford** — мера всей ленты (доли ядра и хвоста). К отдельной новости можно привязать «только хвост нёс эту историю», но это отдельная доработка: **не подключён** (status not_wired).
- **Stanley Cohen** — только землетрясения (размер измеряет USGS). Другие события: null. Строка берётся из готовых списков датчика, поэтому у слабых землетрясений без совпадения тоже будет null.
- **Polyak** — индекс, а не новость. Подключён через новое поле contributors (какие заголовки сдвинули «галлюцинации» или «согласие» за 3 часа): строка index_mover только у этих заголовков.
- **Mikrin** — меряет наш собственный путь от публикации до эфира для блоков вещания, а не для заголовка. Для новости честно только возраст по времени публикации источника (freshness, partial).
- **trackrecord / promises** — тема, а не заголовок: предлагаются в `topic_sensors`, когда в запросе ставки ЕЦБ/ФРС или крипта.
- **Hamilton** — система: блок `data_gaps` (что у нас сейчас отключено или не обновлялось); он объясняет, почему строка может быть null.

## Строки, которых не хватало
- Первоисточник: first_source_found — из radar_life, иначе null с пометкой «не найден среди наших радаров, это не значит, что его нет».
- Правки после публикации: **не измеряем** (версий заголовков и статей мы не храним) → всегда null, measured=false. Чтобы это стало строкой, нужно хранить версии заголовков; это решение владельца.
- Призыв к действию: слова из заголовка (EN/DE/RU) в цитате; признак, не ярлык.
- Проверяема ли цифра: есть ли число в заголовке и закреплено ли оно «кто/когда/где» (Франкфурт).
- Эмоционально нагруженные слова — уже были (loaded_words, Осгуд), теперь с цитатой.
