#!/usr/bin/env python3
"""Страницы раздела «Карты и агенты» (check_place): public/tools/maps.html (ru), public/de/tools/maps.html, public/en/tools/maps.html.
Запуск: python3 tools/maps_pages.py. Текст здесь, не руками в html. Честная пометка: Orb Studio не связан с Google."""
import html, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
EX = "https://orbstudio.org/api/v1/place?name=Museum%20f%C3%BCr%20Bergedorf&rating=4.5&reviews=1435&state=HH&lat=53.4896&lon=10.2124&hours=%5B%7B%22source%22%3A%22map%22%2C%22open%22%3A%2211%3A00%22%2C%22close%22%3A%2217%3A00%22%7D%2C%7B%22source%22%3A%22directory%22%2C%22open%22%3A%2210%3A00%22%2C%22close%22%3A%2218%3A00%22%7D%5D"

L = {
 "ru": dict(path="/tools/maps", lang="ru", file="tools/maps.html", loc="ru-RU",
  title="Можно ли верить карточке места на карте? · check_place · Orb Studio",
  desc="Агент рассказывает про замок, музей или магазин по карточке из карт. check_place проверяет её: праздник, звёзды вместе с числом оценок, расхождение часов, возраст отзывов. Не связан с Google.",
  eye="Карты · агенты · check_place", h1="Можно ли верить карточке места?",
  lead="Вы просите ИИ-агента проложить маршрут до замка, рассказать о нём и показать отзывы. Агент берёт карточку из карт, а мы проверяем её независимыми правилами и говорим, что подтверждено, а что нет.",
  indep_h="Честно о Google", indep="Orb Studio не связан с Google и не одобрен Google. Google Maps — товарный знак Google LLC. Мы не читаем, не копируем и не храним содержимое Google Maps и не используем его API: проверяем только то, что агент или человек сам передал в запросе. Ни логотипов, ни рейтингов, ни отзывов Google на этой странице нет.",
  what_h="Что проверяется", what=[
   ("Праздник, воскресенье, канун праздника", "Часы на карте часто «обычные». В праздник или воскресенье они могут быть другими. Календарь Германии считается по правилам для каждой земли.", "Ротемберг"),
   ("Звёзды вместе с числом оценок", "4,7 по 465 оценкам и 3,5 по 893 — разные вещи, а 5,0 по трём оценкам почти ничего не значит. Пороги и «подтяжка» к 4,0 — рабочее допущение, а не оценка заведения.", "Коэн"),
   ("Расхождение часов по источникам", "Если карта, справочник и сайт дают разные часы, мы это называем и просим уточнить у самого места.", "Гарсиа-Молина"),
   ("Возраст отзывов и всплеск за неделю", "Если большая часть отзывов старая или многие пришли за одну неделю, это повод присмотреться, но не вердикт.", "Хинкли, Кэмпбелл"),
   ("«Обычно мало людей»", "Это типичный уровень на этот час, а не то, как людно сейчас.", "Калман"),
   ("Чего агент не принёс", "Список полей, без которых проверка неполная: часы по источникам, даты отзывов, число оценок.", "—")],
  ex_h="Пример", ex="Музей в замке Бергедорф (Гамбург): карта дала одни часы, справочник другие. Ответ называет расхождение и подсказывает позвонить в музей перед поездкой.", ex_a="Открыть пример (JSON)",
  lim_h="Границы", lim=["Это не рекомендация «идти» или «не идти» и не оценка места.", "Аптеки, врачи, банки: только заметка и официальный источник (aponet.de, 116 117, сам банк).", "Одноразовые праздники и местные праздники не учитываются; пороги звёзд — рабочее допущение.", "Мы ничего не правим на картах: при расхождении человек сам может сообщить об ошибке в приложении."],
  ag_h="Для агентов", ag="MCP-инструмент check_place и REST /api/v1/place. Бесплатно, без ИИ, без поиска в сети. Передайте название, рейтинг и число оценок, часы по источникам, даты отзывов.",
  more="Ещё", m1="Праздник сегодня по землям (на немецком)", m2="Библиотека кристаллов: учёные, за которыми стоят проверки", m4="Условия на маршруте: темнота, воздух, предупреждения", m3="Подумай, прежде чем решить (think_it_through)"),
 "de": dict(path="/de/tools/maps", lang="de", file="de/tools/maps.html", loc="de-DE",
  title="Kann man der Karte eines Ortes trauen? · check_place · Orb Studio",
  desc="Ein KI-Assistent beschreibt ein Schloss, Museum oder Geschäft nach einer Kartenkarte. check_place prüft sie: Feiertag, Sterne mit Anzahl der Bewertungen, widersprüchliche Zeiten, Alter der Bewertungen. Nicht mit Google verbunden.",
  eye="Karten · Agenten · check_place", h1="Kann man der Karte eines Ortes trauen?",
  lead="Du bittest einen KI-Assistenten um die Route zu einem Schloss, eine Beschreibung und Bewertungen. Der Assistent nimmt die Karte aus einem Kartendienst; wir prüfen sie mit unabhängigen Regeln und sagen, was bestätigt ist und was nicht.",
  indep_h="Ehrlich zu Google", indep="Orb Studio ist nicht mit Google verbunden und nicht von Google empfohlen. Google Maps ist eine Marke von Google LLC. Wir lesen, kopieren und speichern keine Inhalte von Google Maps und nutzen keine API: Wir prüfen nur, was der Assistent oder die Person selbst in der Anfrage übergibt. Auf dieser Seite gibt es keine Google-Logos, -Bewertungen oder -Rezensionen.",
  what_h="Was geprüft wird", what=[
   ("Feiertag, Sonntag, Vorabend", "Die Zeiten auf der Karte sind oft die „üblichen“. An Feiertagen und Sonntagen können sie anders sein. Der Kalender für Deutschland wird nach festen Regeln je Bundesland berechnet.", "Rotemberg"),
   ("Sterne mit der Anzahl der Bewertungen", "4,7 bei 465 Bewertungen und 3,5 bei 893 sind verschiedene Dinge, und 5,0 bei drei Bewertungen sagt fast nichts. Schwellen und die Annäherung an 4,0 sind eine Arbeitsannahme, keine Bewertung des Ortes.", "Cohen"),
   ("Widersprüchliche Öffnungszeiten", "Wenn Karte, Verzeichnis und Webseite verschiedene Zeiten nennen, sagen wir das und bitten, beim Ort selbst nachzufragen.", "García-Molina"),
   ("Alter der Bewertungen und Häufung in einer Woche", "Sind die meisten Bewertungen alt oder kommen viele in einer Woche, ist das ein Anlass genauer hinzusehen, kein Urteil.", "Hinkley, Campbell"),
   ("„Meist wenig los“", "Das ist der typische Wert für diese Stunde, nicht der aktuelle Andrang.", "Kalman"),
   ("Was der Assistent nicht mitgebracht hat", "Liste der Felder, ohne die die Prüfung unvollständig bleibt: Zeiten je Quelle, Bewertungsdaten, Anzahl der Bewertungen.", "–")],
  ex_h="Beispiel", ex="Museum im Bergedorfer Schloss (Hamburg): Die Karte nannte andere Zeiten als ein Verzeichnis. Die Antwort benennt den Widerspruch und rät, vor der Fahrt im Museum anzurufen.", ex_a="Beispiel öffnen (JSON)",
  lim_h="Grenzen", lim=["Keine Empfehlung „hingehen“ oder „nicht hingehen“ und keine Bewertung des Ortes.", "Apotheken, Ärzte, Banken: nur ein Hinweis und die offizielle Quelle (aponet.de, 116 117, die Bank selbst).", "Einmalige und örtliche Feiertage sind nicht eingerechnet; die Schwellen bei den Sternen sind eine Arbeitsannahme.", "Wir ändern nichts auf Karten: Bei einem Widerspruch kann die Person den Fehler selbst in der App melden."],
  ag_h="Für Agenten", ag="MCP-Werkzeug check_place und REST /api/v1/place. Kostenlos, ohne KI, ohne Websuche. Übergib Name, Bewertung und Anzahl, Zeiten je Quelle, Bewertungsdaten.",
  more="Mehr", m4="Bedingungen auf der Route: Dunkelheit, Luft, Warnungen", m1="Feiertag heute nach Bundesland", m2="Kristall-Bibliothek: die Forschenden hinter den Prüfungen", m3="Think it through (think_it_through)"),
 "en": dict(path="/en/tools/maps", lang="en", file="en/tools/maps.html", loc="en-GB",
  title="Can you trust a map card for a place? · check_place · Orb Studio",
  desc="An AI assistant describes a castle, museum or shop from a map card. check_place checks it: public holiday, stars with the number of ratings, hours that disagree, review age. Not affiliated with Google.",
  eye="Maps · agents · check_place", h1="Can you trust a map card for a place?",
  lead="You ask an AI assistant for a route to a castle, a description and reviews. The assistant takes the card from a map service; we check it with independent rules and say what is confirmed and what is not.",
  indep_h="Plainly about Google", indep="Orb Studio is not affiliated with or endorsed by Google. Google Maps is a trademark of Google LLC. We do not read, copy or store Google Maps content and do not use its API: we check only what the assistant or the person passes in the request. There are no Google logos, ratings or reviews on this page.",
  what_h="What is checked", what=[
   ("Public holiday, Sunday, holiday eve", "Hours on a map are often the usual ones. On a holiday or a Sunday they may differ. The German calendar is computed by fixed rules for each state.", "Rotemberg"),
   ("Stars with the number of ratings", "4.7 from 465 ratings and 3.5 from 893 are different things, and 5.0 from three ratings says almost nothing. Thresholds and the pull toward 4.0 are a working assumption, not a verdict on the place.", "Cohen"),
   ("Hours that disagree between sources", "If the map, a directory and the website give different hours we say so and ask you to confirm with the place itself.", "García-Molina"),
   ("Review age and a burst in one week", "If most reviews are old or many arrive in a single week, that is a reason to look closer, not a verdict.", "Hinkley, Campbell"),
   ("'Usually not busy'", "That is the typical level for this hour, not how busy it is now.", "Kalman"),
   ("What the assistant did not bring", "A list of the fields without which the check stays incomplete: hours per source, review dates, number of ratings.", "-")],
  ex_h="Example", ex="The museum in Bergedorf Castle (Hamburg): the map gave different hours than a directory. The answer names the disagreement and suggests phoning the museum before travelling.", ex_a="Open the example (JSON)",
  lim_h="Limits", lim=["Not a recommendation to go or not to go, and no rating of the place.", "Pharmacies, doctors, banks: only a note and the official source (aponet.de, 116 117, the bank itself).", "One-off and local holidays are not modelled; the star thresholds are a working assumption.", "We never edit a map: when sources disagree, the person can report the mistake in the app."],
  ag_h="For agents", ag="MCP tool check_place and REST /api/v1/place. Free, no AI, no web search. Pass the name, rating and number of ratings, hours per source, review dates.",
  more="More", m4="Route conditions: darkness, air, warnings", m1="Public holiday today by state (in German)", m2="Crystal Library: the scientists behind the checks", m3="Think it through (think_it_through)"),
}

CSS = """:root{--bg:#05070e;--panel:#0b1222;--line:#1b2944;--fg:#e4ebf8;--dim:#8796b6;--holo:#6fe6ff;--up:#4fd8a4;--mono:ui-monospace,monospace;color-scheme:dark}
*{box-sizing:border-box}body{background:var(--bg);color:var(--fg);font-family:system-ui,sans-serif;margin:0;line-height:1.5}a{color:var(--holo)}
.wrap{max-width:860px;margin:0 auto;padding:16px max(16px,env(safe-area-inset-left,0px)) 28px;display:flex;flex-direction:column;gap:14px}
h1{font-size:26px;letter-spacing:.03em;margin:4px 0 0}h2{font-size:16px;letter-spacing:.05em;margin:0 0 8px;color:var(--holo)}h3{font-size:15px;margin:12px 0 2px}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--dim);text-transform:uppercase}.lead{color:var(--dim);margin:2px 0 0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}.card p{margin:4px 0}.card ul{margin:4px 0;padding-left:20px}
.indep{border-color:var(--up)}.who{font-family:var(--mono);font-size:12px;color:var(--up)}code{font-family:var(--mono);color:var(--holo);word-break:break-all}
.more{display:flex;gap:8px;flex-wrap:wrap}.more a{font-family:var(--mono);font-size:12.5px;border:1px solid var(--line);border-radius:999px;padding:6px 11px;text-decoration:none}"""

def page(k):
    t = L[k]; e = html.escape
    url = "https://orbstudio.org" + t["path"]
    alts = "\n".join(f'<link rel="alternate" hreflang="{x}" href="https://orbstudio.org{L[x]["path"]}">' for x in L) + f'\n<link rel="alternate" hreflang="x-default" href="https://orbstudio.org{L["en"]["path"]}">'
    what = "".join(f'<h3>{e(a)}</h3><p>{e(b)}</p><p class="who">{e(c)}</p>' for a, b, c in t["what"])
    lim = "".join(f"<li>{e(x)}</li>" for x in t["lim"])
    pre = "" if k == "ru" else "/" + k
    ld = {"@context": "https://schema.org", "@type": "WebPage", "name": t["title"], "url": url, "inLanguage": t["lang"], "description": t["desc"], "isPartOf": {"@type": "WebSite", "name": "Orb Studio", "url": "https://orbstudio.org/"}}
    return f"""<!doctype html>
<html lang="{t['lang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{e(t['title'])}</title>
<meta name="description" content="{e(t['desc'])}">
<link rel="canonical" href="{url}">
{alts}
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="Orb Studio">
<meta property="og:title" content="{e(t['title'])}">
<meta property="og:description" content="{e(t['desc'])}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>{CSS}</style>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace('<', '\\u003c')}</script>
</head>
<body><main class="wrap">
<header><div class="eyebrow">{e(t['eye'])}</div><h1>{e(t['h1'])}</h1><p class="lead">{e(t['lead'])}</p></header>
<section class="card indep"><h2>{e(t['indep_h'])}</h2><p>{e(t['indep'])}</p></section>
<section class="card"><h2>{e(t['what_h'])}</h2>{what}</section>
<section class="card"><h2>{e(t['ex_h'])}</h2><p>{e(t['ex'])}</p><p><a href="{EX}" rel="nofollow">{e(t['ex_a'])}</a></p></section>
<section class="card"><h2>{e(t['lim_h'])}</h2><ul>{lim}</ul></section>
<section class="card"><h2>{e(t['ag_h'])}</h2><p>{e(t['ag'])}</p><p><code>https://orbstudio.org/api/v1/place?name=...</code></p></section>
<section class="card"><h2>{e(t['more'])}</h2><div class="more"><a href="/de/feiertag-heute">{e(t['m1'])}</a><a href="{pre}/tools/crystals">{e(t['m2'])}</a><a href="{pre}/tools/route-weather">{e(t['m4'])}</a><a href="/api/v1/think?q=">{e(t['m3'])}</a></div></section>
</main></body>
</html>
"""

for k in L:
    p = ROOT / "public" / L[k]["file"]; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(page(k), encoding="utf-8"); print("wrote", p.relative_to(ROOT))
