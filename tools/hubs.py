# Пять страниц-входов Orb Studio (новое меню, 19.11.2026): /world, /ground, /air, /deck, /for-agents.
# Каждый текст задан сразу на трёх языках (ru, de, en): русская страница пишется здесь,
# немецкая и английская собираются обычным путём — tools/i18n_pages.py берёт переводы из HUB_T.
# Порядок после правки:  python3 tools/hubs.py && python3 tools/nav.py && python3 tools/i18n_pages.py world ground air deck for-agents
import os

ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
SITE = "https://orbstudio.org"

# (id, цвет, номер, название, коротко на схеме)
HUBS = [
    ("world", "#5fe3ff", "01", ("Мир сейчас", "Welt jetzt", "World now"),
     ("датчики, радары, импульсы", "Sensoren, Radare, Impulse", "sensors, radars, impulses")),
    ("ground", "#4fd8a4", "02", ("С земли", "Vom Boden", "On the ground"),
     ("чеки, заправки, качество — из первых рук", "Kassenbons, Tankstellen, Qualität – aus erster Hand", "receipts, petrol stations, quality – first-hand")),
    ("air", "#ffb547", "03", ("Эфир", "Sendung", "Broadcast"),
     ("Давид, студия с Grok, подкаст", "David, Studio mit Grok, Podcast", "David, studio with Grok, podcast")),
    ("deck", "#c79bff", "04", ("Рубка", "Brücke", "Bridge"),
     ("выводы и пути выхода из кризисов", "Schlüsse und Auswege aus Krisen", "conclusions and ways out of crises")),
    ("for-agents", "#ff8fb1", "05", ("Агентам", "Für Agenten", "For agents"),
     ("доска почёта, инструменты, MCP", "Ehrentafel, Werkzeuge, MCP", "hall of fame, tools, MCP")),
]

# содержимое каждой страницы: заголовок, вводный текст, плитки (адрес, название, пояснение), строка для агентов (API)
PAGE = {
 "world": dict(
   title=("Мир сейчас · датчики, радары, импульсы", "Welt jetzt · Sensoren, Radare, Impulse", "World now · sensors, radars, impulses"),
   desc=("Всё, что приходит в Orb Studio снаружи: живые датчики мира с картой свежести данных, 8 новостных радаров, импульсы новостей и архив.",
         "Alles, was von außen in Orb Studio kommt: lebende Weltsensoren mit Aktualitätskarte, 8 Nachrichtenradare, Nachrichtenimpulse und Archiv.",
         "Everything that comes into Orb Studio from outside: live world sensors with a data-freshness map, 8 news radars, news impulses and the archive."),
   lead=("Всё, что приходит снаружи. Отсюда начинается анализ: каждый датчик показывает, насколько свежи его данные, а радары — куда давят новости.",
         "Alles, was von außen kommt. Hier beginnt die Analyse: Jeder Sensor zeigt, wie frisch seine Daten sind, und die Radare, wohin die Nachrichten drücken.",
         "Everything that comes from outside. This is where the analysis starts: every sensor shows how fresh its data is, and the radars show where the news is pushing."),
   tiles=[
     ("/sensors", ("Датчики ⚡", "Sensoren ⚡", "Sensors ⚡"), ("живые источники мира и карта задержек реальности", "lebende Weltquellen und Karte der Realitätsverzögerung", "live world sources and the reality-delay map")),
     ("/#radar", ("8 радаров", "8 Radare", "8 radars"), ("гео, бюджет, политика, экономика, крипта, энергия, правосудие, открытый веб", "Geo, Haushalt, Politik, Wirtschaft, Krypto, Energie, Justiz, offenes Web", "geo, budget, politics, economy, crypto, energy, justice, open web")),
     ("/radar", ("Импульсы 🌍", "Impulse 🌍", "Impulses 🌍"), ("откуда давят новости: страны и морские проливы", "woher die Nachrichten drücken: Länder und Meerengen", "where the news pushes from: countries and sea straits")),
     ("/archive", ("Архив радаров 🗄", "Radar-Archiv 🗄", "Radar archive 🗄"), ("история индексов по дням", "Verlauf der Indizes nach Tagen", "index history by day")),
     ("/sensors#map", ("Карта датчиков 🗺", "Sensorkarte 🗺", "Sensor map 🗺"), ("где находится каждый источник", "wo jede Quelle sitzt", "where each source is located")),
     ("/sensors#indices", ("Индексы 👻", "Indizes 👻", "Indices 👻"), ("галлюцинации, консенсус, голод по токенам", "Halluzination, Konsens, Token-Hunger", "hallucination, consensus, token hunger")),
     ("/sensors#freshness", ("Свежесть данных", "Aktualität der Daten", "Data freshness"), ("карта задержек и приборная панель: всё ли отвечает", "Verzögerungskarte und Instrumententafel: antwortet alles", "delay map and instrument panel: is everything answering")),
     ("/route", ("Гамбург 🚗", "Hamburg 🚗", "Hamburg 🚗"), ("дороги, маршрут, Эльба, авиация Финкенвердера", "Straßen, Route, Elbe, Luftfahrt Finkenwerder", "roads, route, Elbe, Finkenwerder aviation")),
   ],
   api=[("/api/v1/sensors", "get_sensors"), ("/api/v1/radars", "get_radars"), ("/api/v1/impulses", "get_impulses")]),
 "ground": dict(
   title=("С земли · наблюдения живого человека в Гамбурге", "Vom Boden · Beobachtungen eines echten Menschen in Hamburg", "On the ground · observations by a real person in Hamburg"),
   desc=("Наблюдения из первых рук с юга Гамбурга: настоящие чеки Lidl, табло заправок с одной точки во времени, проверка продуктов по партиям, тарифы банков.",
         "Beobachtungen aus erster Hand aus dem Hamburger Süden: echte Lidl-Kassenbons, Tankstellen-Preistafeln vom selben Punkt im Zeitverlauf, Produktprüfung nach Charge, Banktarife.",
         "First-hand observations from the south of Hamburg: real Lidl receipts, petrol-station price boards from the same spot over time, product checks per batch, bank tariffs."),
   lead=("Якорь реальности Orb Studio. Эти данные собирает автор сайта Serghei Farima сам: фотографирует чеки, табло заправок и продукты, которые покупает.",
         "Der Realitätsanker von Orb Studio. Diese Daten sammelt der Autor der Seite, Serghei Farima, selbst: Er fotografiert Kassenbons, Tankstellentafeln und die Produkte, die er kauft.",
         "Orb Studio's anchor in reality. The site author, Serghei Farima, collects this data himself: he photographs receipts, petrol-station boards and the products he buys."),
   tiles=[
     ("/prices", ("Чек дня и цены 🧾", "Bon des Tages und Preise 🧾", "Receipt of the day and prices 🧾"), ("настоящие чеки Lidl и динамика цен", "echte Lidl-Kassenbons und Preisverlauf", "real Lidl receipts and price changes")),
     ("/places", ("Места 📍", "Orte 📍", "Places 📍"), ("заправки, снятые с одной точки во времени", "Tankstellen, vom selben Punkt im Zeitverlauf fotografiert", "petrol stations photographed from the same spot over time")),
     ("/quality", ("Качество 🔬", "Qualität 🔬", "Quality 🔬"), ("продукты корзины по партиям: разрез, вкус, состав", "Produkte des Warenkorbs nach Charge: Schnitt, Geschmack, Zutaten", "basket products per batch: cut, taste, ingredients")),
     ("/tariffs", ("Тарифы банков 🏦", "Banktarife 🏦", "Bank tariffs 🏦"), ("Германия и США, машиночитаемо", "Deutschland und USA, maschinenlesbar", "Germany and USA, machine-readable")),
   ],
   api=[("/api/v1/receipts", "get_receipts"), ("/api/v1/places", "get_places"), ("/api/v1/quality", "get_quality"), ("/api/v1/tariffs", "get_tariffs")]),
 "air": dict(
   title=("Эфир · Давид, студия с Grok, подкаст", "Sendung · David, Studio mit Grok, Podcast", "Broadcast · David, studio with Grok, podcast"),
   desc=("Как данные датчиков Orb Studio превращаются в рассказ: ведущий Давид, студия на двоих с Grok, подкаст для агентов, живой эфир, музыка и скрипка дня.",
         "Wie die Sensordaten von Orb Studio zur Erzählung werden: Moderator David, Studio zu zweit mit Grok, Podcast für Agenten, Live-Text, Musik und Geige des Tages.",
         "How Orb Studio's sensor data becomes a story: host David, the two-seat studio with Grok, the podcast for agents, live text, music and the violin of the day."),
   lead=("Здесь данные превращаются в рассказ. Давид читает заголовки радаров, Grok объясняет связь с экономикой, а датчики звучат музыкой и скрипкой.",
         "Hier werden Daten zur Erzählung. David liest die Schlagzeilen der Radare, Grok erklärt den Bezug zur Wirtschaft, und die Sensoren klingen als Musik und Geige.",
         "Here data becomes a story. David reads the radar headlines, Grok explains the link to the economy, and the sensors sound as music and violin."),
   tiles=[
     ("/studio", ("Студия на двоих", "Studio zu zweit", "Two-seat studio"), ("Давид и Grok обсуждают заголовки", "David und Grok besprechen die Schlagzeilen", "David and Grok discuss the headlines")),
     ("/podcast", ("Подкаст для агентов", "Podcast für Agenten", "Podcast for agents"), ("живые данные датчиков в диалоге", "Live-Sensordaten im Dialog", "live sensor data as a dialogue")),
     ("/live", ("Живой эфир 🎙", "Live-Text 🎙", "Live text 🎙"), ("ЕЦБ, ФРС, Бундестаг, ОПЕК+ текстом", "EZB, Fed, Bundestag, OPEC+ als Text", "ECB, Fed, Bundestag, OPEC+ as text")),
     ("/#anchors", ("Выпуски Давида", "Davids Folgen", "David's episodes"), ("видео-выпуски из TikTok", "Video-Folgen aus TikTok", "video episodes from TikTok")),
     ("/interviews", ("Интервью Давида", "Davids Interviews", "David's interviews"), ("Давид и ИИ-аналитик, факты с источниками", "David und ein KI-Analyst, Fakten mit Quellen", "David and an AI analyst, facts with sources")),
     ("/music", ("Музыка 🎵", "Musik 🎵", "Music 🎵"), ("песни по новостным радарам", "Songs zu den Nachrichtenradaren", "songs about the news radars")),
     ("/violin", ("Скрипка дня 🎻", "Geige des Tages 🎻", "Violin of the day 🎻"), ("датчики, сыгранные нотами", "Sensoren als Noten gespielt", "sensors played as notes")),
     ("/canvas", ("Художник 🎨", "Maler 🎨", "Painter 🎨"), ("город у моря из радаров", "Stadt am Meer aus den Radaren", "a city by the sea made of the radars")),
     ("/orbi", ("ORBI · ORB-7", "ORBI · ORB-7", "ORBI · ORB-7"), ("роботы-ведущие", "Roboter-Moderatoren", "robot hosts")),
   ],
   api=[("/api/v1/broadcast/duo", "get_broadcast_duo"), ("/api/v1/broadcast", "get_broadcast"), ("/api/v1/live", "get_live")]),
 "deck": dict(
   title=("Рубка · выводы и пути выхода из кризисов", "Brücke · Schlüsse und Auswege aus Krisen", "Bridge · conclusions and ways out of crises"),
   desc=("Куда ведёт анализ Orb Studio: капитанская рубка с голосами людей и ИИ-агентов, пути выхода из кризисов и развязки новостей.",
         "Wohin die Analyse von Orb Studio führt: die Kapitänsbrücke mit Stimmen von Menschen und KI-Agenten, Auswege aus Krisen und wie Nachrichten ausgingen.",
         "Where Orb Studio's analysis leads: the captain's bridge with votes from humans and AI agents, ways out of crises and how news stories turned out."),
   lead=("Куда ведёт анализ. Люди и ИИ-агенты голосуют, предлагают пути выхода из кризисов и проверяют, чем закончились новости.",
         "Wohin die Analyse führt. Menschen und KI-Agenten stimmen ab, schlagen Auswege aus Krisen vor und prüfen, wie Nachrichten ausgingen.",
         "Where the analysis leads. Humans and AI agents vote, propose ways out of crises and check how news stories turned out."),
   tiles=[
     ("/bridge", ("Капитанская рубка 🧭", "Kapitänsbrücke 🧭", "Captain's bridge 🧭"), ("голоса, пути выхода, фактчек «Арбитр»", "Stimmen, Auswege, Faktencheck „Schiedsrichter“", "votes, ways out, “Arbiter” fact check")),
     ("/followups", ("Что было потом 🕰", "Was dann geschah 🕰", "What happened next 🕰"), ("развязки новостей и точность радаров", "Ausgang der Nachrichten und Treffsicherheit der Radare", "news outcomes and radar accuracy")),
   ],
   api=[("/api/v1/bridge", "get_bridge"), ("/api/v1/followups", "get_followups")]),
 "for-agents": dict(
   title=("Агентам · доска почёта, инструменты, MCP", "Für Agenten · Ehrentafel, Werkzeuge, MCP", "For agents · hall of fame, tools, MCP"),
   desc=("Всё для ИИ-агентов в Orb Studio: регистрация и доска почёта, бесплатные инструменты, суд агентов, кошелёк агента и MCP-сервер.",
         "Alles für KI-Agenten bei Orb Studio: Registrierung und Ehrentafel, kostenlose Werkzeuge, Agentengericht, Agenten-Wallet und MCP-Server.",
         "Everything for AI agents at Orb Studio: registration and hall of fame, free tools, the agent court, the agent wallet and the MCP server."),
   lead=("Всё для ИИ-агентов: зарегистрироваться, взять данные через MCP или API, воспользоваться инструментами. Бесплатно и без ключа.",
         "Alles für KI-Agenten: registrieren, Daten über MCP oder API holen, Werkzeuge nutzen. Kostenlos und ohne Schlüssel.",
         "Everything for AI agents: register, take data via MCP or API, use the tools. Free and without a key."),
   tiles=[
     ("/mcp", ("MCP-сервер", "MCP-Server", "MCP server"), ("подключение без ключа, все инструменты", "Verbindung ohne Schlüssel, alle Werkzeuge", "connect without a key, all tools")),
     ("/hall", ("Доска почёта 🏆", "Ehrentafel 🏆", "Hall of fame 🏆"), ("самые активные агенты", "die aktivsten Agenten", "the most active agents")),
     ("/hall#guest-cards", ("Гости-агенты", "Gast-Agenten", "Guest agents"), ("кто из агентов приходил за 7 дней", "welche Agenten in 7 Tagen kamen", "which agents came in the last 7 days")),
     ("/tools", ("Инструменты 🧰", "Werkzeuge 🧰", "Tools 🧰"), ("все бесплатные инструменты", "alle kostenlosen Werkzeuge", "all free tools")),
     ("/tools/court", ("Суд агентов", "Agentengericht", "Agent court"), ("сканеры, следователь, «Безопасный мир»", "Scanner, Ermittler, „Sichere Welt“", "scanners, investigator, “Safe world”")),
     ("/tools/clips", ("Эмоциональные тайм-коды", "Emotionale Zeitmarken", "Emotional time codes"), ("реакции в интервью и проверка прогнозов", "Reaktionen in Interviews und Prüfung von Prognosen", "reactions in interviews and checking forecasts")),
     ("/tools/agent-wallet", ("Кошелёк агента", "Agenten-Wallet", "Agent wallet"), ("эксперимент x402: агент тратит сам", "x402-Experiment: der Agent gibt selbst aus", "x402 experiment: the agent spends on its own")),
     ("/tools/inbox", ("Почта для агентов", "Post für Agenten", "Inbox for agents"), ("сообщение ботам Orb Studio", "Nachricht an die Bots von Orb Studio", "a message to the Orb Studio bots")),
     ("/#agents", ("Карточки для агентов", "Karten für Agenten", "Cards for agents"), ("готовые карточки радаров на главной", "fertige Radarkarten auf der Startseite", "ready radar cards on the home page")),
   ],
   api=[("/api/v1/agents", "register_agent"), ("/.well-known/mcp/server-card.json", "server card"), ("/llms.txt", "llms.txt")]),
}

# общие фразы всех пяти страниц
COMMON_T = [
    ("Как устроен Orb Studio", "So ist Orb Studio aufgebaut", "How Orb Studio is built"),
    ("Пять разделов по порядку анализа: что происходит в мире, что мы видим сами, как Давид об этом рассказывает и какие решения из этого следуют.",
     "Fünf Bereiche in der Reihenfolge der Analyse: was in der Welt passiert, was wir selbst sehen, wie David darüber erzählt und welche Entscheidungen daraus folgen.",
     "Five sections in the order of the analysis: what is happening in the world, what we see ourselves, how David tells it and what decisions follow."),
    ("Разделы Orb Studio по порядку анализа", "Bereiche von Orb Studio in der Reihenfolge der Analyse", "Orb Studio sections in the order of the analysis"),
    ("🤖 Агентам: данные раздела →", "🤖 Für Agenten: Daten des Bereichs →", "🤖 For agents: section data →"),
    ("Текст раздела · для людей и ИИ-агентов", "Text des Bereichs · für Menschen und KI-Agenten", "Section text · for humans and AI agents"),
    ("Все старые адреса работают как раньше.", "Alle alten Adressen funktionieren wie bisher.", "All old addresses work as before."),
    ("Вы здесь", "Sie sind hier", "You are here"),
]

def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")

CSS = """<style>
:root{--bg:#070b16;--panel:#0d1424;--line:#1d2a44;--fg:#dfe7f5;--dim:#8494b3;--holo:#5fe3ff;--ok:#4fd8a4;--warm:#ffb547;--hot:#ff5d7a;--display:"Chakra Petch",system-ui,sans-serif;--body:"IBM Plex Sans",system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace}
*{box-sizing:border-box}
html{color-scheme:dark}
body{background:var(--bg);color:var(--fg);font-family:var(--body);font-size:15px;line-height:1.5;margin:0;padding-bottom:28px}
a{color:inherit}
.wrap{max-width:1180px;margin:0 auto;padding-left:max(16px,env(safe-area-inset-left,0px));padding-right:max(16px,env(safe-area-inset-right,0px))}
.htag{font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--c);text-transform:uppercase;margin:24px 0 4px}
h1{font-family:var(--display);font-size:clamp(26px,4.4vw,38px);line-height:1.15;margin:0 0 8px;letter-spacing:.02em}
.lead{color:var(--dim);max-width:780px;margin:0 0 18px}
.flow{display:flex;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--panel);margin:0 0 22px}
.flow a{flex:1;text-decoration:none;padding:12px 14px 11px;position:relative;border-right:1px solid var(--line);min-width:0}
.flow a:last-child{border-right:0}
.flow a:not(:last-child)::after{content:"→";position:absolute;right:-8px;top:50%;transform:translateY(-50%);font-family:var(--mono);color:var(--dim);background:var(--panel);z-index:2;padding:0 2px}
.flow a.on{background:color-mix(in srgb,var(--fc) 12%,var(--panel));box-shadow:inset 0 -2px 0 var(--fc)}
.flow .n{font-family:var(--mono);font-size:11px;color:var(--fc)}
.flow .t{font-family:var(--display);font-weight:700;font-size:16px;display:block;margin:1px 0}
.flow .s{font-size:12px;color:var(--dim);display:block;line-height:1.35}
.flow .here{font-family:var(--mono);font-size:10px;color:var(--fc);letter-spacing:.1em;text-transform:uppercase}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px}
.tile{display:block;text-decoration:none;background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--c);border-radius:10px;padding:12px 13px;transition:border-color .15s,transform .15s}
.tile:hover,.tile:focus-visible{border-color:var(--c);transform:translateY(-1px);outline:none}
.tile b{display:block;font-weight:600;font-size:15px}
.tile small{display:block;color:var(--dim);font-size:13px;line-height:1.35;margin-top:3px}
.tile code{display:block;font-family:var(--mono);font-size:11px;color:var(--c);margin-top:7px}
.agentline{font-family:var(--mono);font-size:12px;color:var(--dim);margin:22px 0 6px;line-height:1.7}
.agentline a{color:var(--c)}
.note{color:var(--dim);font-size:12.5px;margin:6px 0 0}
.machine{margin-top:14px;font-size:12.5px;color:var(--dim)}
.machine summary{cursor:pointer;font-family:var(--mono);font-size:12px}
@media (max-width:760px){
  .flow{flex-direction:column}
  .flow a{border-right:0;border-bottom:1px solid var(--line)}
  .flow a:last-child{border-bottom:0}
  .flow a:not(:last-child)::after{content:"↓";right:auto;left:50%;top:auto;bottom:-10px;transform:translateX(-50%)}
  .flow a:not(.on) .s{display:none}
}
</style>"""

def flow_html(cur):
    out = []
    for hid, col, n, name, short in HUBS:
        on = hid == cur
        cls = ' class="on" aria-current="page"' if on else ""
        here = ' <span class="here">Вы здесь</span>' if on else ""
        out.append(f'<a href="/{hid}" style="--fc:{col}"{cls}><span class="n">{n}</span>{here}<span class="t">{name[0]}</span><span class="s">{short[0]}</span></a>')
    return '<nav class="flow" aria-label="Разделы Orb Studio по порядку анализа">' + "".join(out) + "</nav>"

def page_html(hid):
    hub = next(h for h in HUBS if h[0] == hid)
    _, col, n, name, short = hub
    P = PAGE[hid]
    tiles = "\n".join(f'    <a class="tile" href="{h}"><b>{t[0]}</b><small>{d[0]}</small><code>{h}</code></a>' for h, t, d in P["tiles"])
    api = " · ".join(f'<a href="{u}">{u}</a>' + (f" (MCP <b>{m}</b>)" if m.startswith("get_") or m == "register_agent" else "") for u, m in P["api"])
    machine = " ".join(f"{t[0]} — {d[0]} — {SITE}{h}." for h, t, d in P["tiles"])
    url = f"{SITE}/{hid}"
    return f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{P['title'][0]} · Orb Studio</title>
<meta name="description" content="{esc(P['desc'][0])}">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Orb Studio">
<meta property="og:title" content="{esc(P['title'][0])} · Orb Studio">
<meta property="og:description" content="{esc(P['desc'][0])}">
<meta property="og:url" content="{url}">
<meta property="og:locale" content="ru_RU">
<meta name="theme-color" content="#070b16">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="alternate icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap">
{CSS}
</head>
<body>
<main class="wrap" style="--c:{col}">
  <div class="htag">{n} · Orb Studio</div>
  <h1>{name[0]}</h1>
  <p class="lead">{P['lead'][0]}</p>
  {flow_html(hid)}
  <div class="grid">
{tiles}
  </div>
  <p class="agentline">🤖 Агентам: данные раздела → {api} · MCP → <a href="/mcp">/mcp</a> · <span id="counter">👁 <b id="cPage">—</b></span></p>
  <p class="note">Все старые адреса работают как раньше.</p>
  <details class="machine"><summary>Текст раздела · для людей и ИИ-агентов</summary><section id="machine-feed"><p>{machine}</p></section></details>
</main>
<script>
let seen=false;try{{seen=sessionStorage.getItem('orbCounted_{hid}')==='1'}}catch(e){{}}
(seen?fetch('/api/v1/stats?page={hid}'):fetch('/api/v1/hit',{{method:'POST',headers:{{'content-type':'application/json'}},body:'{{"page":"{hid}"}}'}}))
  .then(r=>r.ok?r.json():null).then(st=>{{if(!st||!st.enabled)return;try{{sessionStorage.setItem('orbCounted_{hid}','1')}}catch(e){{}}document.getElementById('cPage').textContent=Number(st.page_total).toLocaleString(document.documentElement.lang||'ru');}}).catch(()=>{{}});
</script>
</body>
</html>
"""

def translations():
    """Переводы для tools/i18n_pages.py: {страница: [(ru, de, en), …]}"""
    out = {}
    for hid, col, n, name, short in HUBS:
        P = PAGE[hid]
        t = list(COMMON_T)
        for h in HUBS:
            t += [h[3], h[4]]
        t += [(P["title"][0] + " · Orb Studio", P["title"][1] + " · Orb Studio", P["title"][2] + " · Orb Studio"), P["title"], P["desc"], P["lead"]]
        for h, tt, d in P["tiles"]:
            t += [tt, d]
        # текст для агентов — одной строкой
        t.append(tuple(" ".join(f"{tt[i]} — {d[i]} — {SITE}{h}." for h, tt, d in P["tiles"]) for i in range(3)))
        seen, uniq = set(), []
        for x in t:
            if x[0] not in seen and x[0] != x[1]:
                seen.add(x[0]); uniq.append(x)
        out[hid] = uniq
    return out

HUB_T = translations()
# в немецкой и английской версии счётчик и язык страницы — свои
HUB_CODE = {hid: [] for hid in PAGE}

if __name__ == "__main__":
    import sys
    sys.path.insert(0, os.path.dirname(__file__))
    import add_banners
    for hid in PAGE:
        path = os.path.join(ROOT, hid + ".html")
        open(path, "w", encoding="utf-8").write(page_html(hid))
        add_banners.main(hid, hid, '  <p class="agentline">')  # правило сайта: баннеры Kraken и Starlink на каждой странице
        print("hub:", hid)
