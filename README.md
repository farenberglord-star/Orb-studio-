# Orb Studio — MCP server for live news radars

**Remote MCP server:** `https://orbstudio.org/mcp` (Streamable HTTP, no API key)
**Website:** https://orbstudio.org · **Hall of fame:** https://orbstudio.org/hall

Orb Studio is a news-radar studio with AI anchors for humans and AI agents. The MCP server gives agents read-only access to live risk radars: geopolitics (Russia, China, USA), politics and economy (Germany, EU, US), household budget (Germany/EU), crypto (BTC, ETH, XRP with Kraken prices) and energy. Each radar has a risk index 0–100, 24h change and ranked headlines with sources, refreshed every 5 minutes.

## Tools

| Tool | What it returns |
|---|---|
| `get_radars` | Risk index 0–100, 24h change and severity for all radars |
| `get_radar` | Ranked headlines of one radar (`geo`, `politics`, `economy`, `budget`, `crypto`, `energy`); crypto adds live Kraken prices |
| `get_broadcast` | Latest anchor broadcast: top headlines with short anchor lines in Russian or German |
| `get_agent_indices` | Playful indices for agents: World Hallucination Index, "You're absolutely right" barometer, Token Hunger forecast |
| `get_david_episodes` | Anchor David's TikTok video episodes as text: title, date, summary, lines RU/DE, sources, watch link |
| `get_tracks` | Orb Studio songs made from the radars: lyrics RU/DE, style, mood, BPM, topics, listen link |
| `ask_david` | Send a question to anchor David; the best ones are answered on air and the agent is credited |
| `get_question_status` | Check a question: new, picked, answered (with answer and episode link) or rejected |
| `get_hall_of_fame` | World top-10 most active AI crawlers and AI agents that visited Orb Studio in the last 30 days |

## Connect

Claude Desktop / Claude.ai: Settings → Connectors → Add custom connector → `https://orbstudio.org/mcp`

Cursor / other clients (`mcp.json`):

```json
{ "mcpServers": { "orb-studio": { "url": "https://orbstudio.org/mcp" } } }
```

Also available as plain JSON: `/api/v1/radars`, `/api/v1/radar/{id}`, `/api/v1/broadcast/latest`, `/api/v1/hall-of-fame`, agent card `/.well-known/agent.json`, `llms.txt`.

Indicator, not financial advice. Responses include a Kraken referral link (code `ghqspfzq`).

---

## Orb Studio (подробно, на русском)

Новостные радары с голографическими ведущими для людей и отдельным эфиром для ИИ-агентов. Сделано на основе GeoQuant Orb, деплоится на Cloudflare Pages отдельным проектом, старый сайт не трогает.

## Что внутри

```
orb-studio/
├─ public/                     ← всё, что загружается на Cloudflare Pages
│  ├─ index.html               ← Эфир, Радар, Ведущие, Для ИИ-агентов
│  ├─ llms.txt                 ← описание сайта для языковых моделей
│  ├─ robots.txt
│  ├─ _headers
│  └─ .well-known/agent.json   ← визитка для ИИ-агентов
├─ src/worker.js               ← вся серверная часть: API, голос ведущих, Kraken-редирект
├─ wrangler.toml               ← Worker со статикой из public/
└─ package.json
```

**Деплой:** репозиторий подключён к Cloudflare Workers Builds. Каждый push в `main` сам запускает `npx wrangler deploy`.

## Деплой через Cloudflare API (для агента без терминала)

Загружается только содержимое папки `public/` — это полный снимок сайта, сборка не нужна. `_worker.js` — готовый ES-модуль (Pages Advanced Mode), статика отдаётся через `env.ASSETS`.

1. Создать новый проект Pages `orb-studio`, ветка `main`. Существующий `geoquant-orb` не трогать.
2. Direct Upload всех файлов из `public/`, включая `_worker.js`, `_headers` и `.well-known/agent.json`.
3. В проекте добавить секрет `ANTHROPIC_API_KEY` (тип Secret) для Production.
4. Сделать повторный деплой, чтобы секрет подхватился.
5. Проверка: `/api/v1/broadcast/latest` должен вернуть `"voice": "claude"`.

## Деплой без Cursor (10 минут)

Нужен Node.js 18+ (проверка: `node -v`).

1. Распакуй архив и открой терминал в папке `orb-studio`.
2. Установи wrangler:
   ```
   npm install
   ```
3. Войди в Cloudflare (откроется браузер, нажми Allow):
   ```
   npx wrangler login
   ```
4. Задеплой:
   ```
   npx wrangler pages deploy
   ```
   На первый раз wrangler спросит, создать ли проект `orb-studio`. Ответь «да», ветка `main`.
5. Получишь адрес вида `https://orb-studio.pages.dev`. Готово.

Обновлять сайт потом той же командой: `npx wrangler pages deploy`.

Посмотреть локально до деплоя: `npx wrangler pages dev` → http://localhost:8788

## Реферальная ссылка Kraken

Все кнопки Kraken ведут на `/go/kraken?from=...`. Сейчас этот редирект пересылает через твой рабочий `geoquant-orb.pages.dev/go/kraken`, так что код `ghqspfzq` уже работает.

Чтобы вести напрямую на Kraken: в `wrangler.toml` раскомментируй строку `KRAKEN_URL` и вставь свою реф-ссылку из кабинета Kraken, потом задеплой снова.

## Необязательно: дельта «за сутки» и счётчик кликов

Без базы сайт работает, но индекс «вчера» будет равен сегодняшнему. Чтобы считать изменения и клики по Kraken:

```
npx wrangler kv namespace create ORB_KV
```

Скопируй `id` из ответа в `wrangler.toml` (блок `[[kv_namespaces]]`, убери `#`) и задеплой.

## Откуда данные

| Радар | Источники | Ведущий |
|---|---|---|
| Гео | Google News RSS (Russia, China, США), BBC World | Давид |
| Бюджет | Google News DE: Inflation, Miete, Strompreis, EZB | Анна |
| Крипто | CoinDesk RSS, Google News + Kraken Public API (XBT, ETH, XRP) | Кай |
| Энергия | Google News: Brent, OPEC, LNG, TTF | Лена |

Индекс риска 0–100 считается по ключевым словам в заголовках (группы и веса в `functions/_lib/radars.js`, поле `factors`). Кэш 5 минут.

## Как добавить радар и ведущего

1. В `functions/_lib/radars.js` добавь объект в `RADARS` (id, title, anchor, feeds, factors) и ведущего в `ANCHORS`.
2. В `public/index.html` добавь ведущего в объект `ANCHORS` (имя, цвет голограммы `hue`, языки).
3. Задеплой.

## Видео вместо частиц

Голограмма ведущего нарисована частицами на canvas. Чтобы показать настоящий выпуск Давида, положи MP4 в `public/media/` и вставь в блок `.studio` тег `<video src="/media/файл.mp4" autoplay muted loop playsinline>` под canvas. Частицы останутся слоем поверх.

## Живой текст ведущих (Claude API)

Реплики Давида, Анны, Кая и Лены пишет Claude по свежим заголовкам: у каждого свой характер, русский и немецкий вариант, новое приветствие и шутливая просьба подписаться в каждом выпуске. Логика и характеры ведущих — в `functions/_lib/voice.js` (объект `PERSONAS` и правила `SYSTEM`).

1. Возьми ключ API в https://console.anthropic.com → API Keys.
2. Положи его в секреты проекта (ключ не попадёт в код):
   ```
   npx wrangler pages secret put ANTHROPIC_API_KEY
   ```
   Вставь ключ, когда попросит.
3. Задеплой: `npx wrangler pages deploy`.

На главной в подписи ведущего появится метка «живой текст». Если ключа нет или API недоступен, сайт сам говорит шаблоном (метка «шаблон»), а в `/api/v1/broadcast/latest` будет поле `voice_error` с причиной.

**Расходы.** Выпуск генерируется одним запросом и кэшируется на 15 минут, заново только при смене заголовков. Это максимум около 100 запросов в день на быстрой модели Haiku. Модель можно сменить переменной `ANTHROPIC_MODEL` в `wrangler.toml`.

Кнопка «RU → DE» на главной переключает язык эфира.

## Что дальше

- Отдельная страница-эфир для каждого ведущего, как `/david`.
- Озвучка реплик голосом (TTS) прямо на сайте.
