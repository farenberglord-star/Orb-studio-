#!/usr/bin/env python3
"""Блок «Условия на маршруте» (пешком, велосипед, авто, Гамбург и окрестности): public/tools/route-weather.html (ru), de/, en/.
Запуск: python3 tools/route_weather_pages.py. Текст здесь, не руками в html. Данные: /api/v1/route?conditions=true (не прогноз)."""
import html, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
e = html.escape
PLACES = ["hauptbahnhof", "altona", "harburg", "bergedorf", "center", "airport", "finkenwerder", "messe", "volksparkstadion", "hafen", "buxtehude", "stade", "luebeck"]
L = {
 "ru": dict(path="/tools/route-weather", lang="ru", file="tools/route-weather.html", pre="",
  title="Какая погода, воздух и темнота на моём маршруте? · Условия на маршруте · Orb Studio",
  desc="Пешком, на велосипеде или на машине по Гамбургу и окрестностям: сколько пути в темноте, какой воздух по дороге и есть ли официальные предупреждения о погоде. Не прогноз.",
  eye="Дорога · пешком · велосипед · авто", h1="Условия на маршруте", lead="Куда едете и во сколько? Покажем время в пути, сколько пути придётся на тёмное время, худший индекс воздуха по трём точкам маршрута и официальные предупреждения Службы погоды.",
  places={"hauptbahnhof": "Hamburg Hauptbahnhof", "altona": "Altona", "harburg": "Harburg", "bergedorf": "Bergedorf", "center": "Центр (Ратуша)", "airport": "Аэропорт", "finkenwerder": "Финкенвердер", "messe": "Messe", "volksparkstadion": "Volksparkstadion", "hafen": "Порт (Landungsbrücken)", "buxtehude": "Buxtehude", "stade": "Stade", "luebeck": "Lübeck"},
  f_from="Откуда", f_to="Куда", f_mode="Как", modes={"foot": "Пешком", "bike": "Велосипед", "car": "Авто"}, f_time="Выезд (время по Берлину)", go="Показать",
  loading="Считаем…", err="Не получилось: источник не ответил. Попробуйте через минуту.", same="Выберите разные точки.",
  r_route="Путь", r_km="км", r_min="мин", r_dark="В темноте", r_dark_none="Весь путь при свете (закат в", r_dark_all="Весь путь после заката (закат был в", r_dark_part="мин после заката (закат в", r_air="Воздух", r_air_na="Индекс воздуха недоступен.", r_warn="Предупреждения Службы погоды (DWD, земля Гамбург)", r_warn_none="Сейчас нет активных предупреждений.", r_warn_n="активных предупреждений, высший уровень",
  r_note="Это не прогноз: воздух и предупреждения показаны на сейчас, время заката считается по часу выезда. Маршрут не привязан к районам предупреждений.",
  lim_h="Границы", lim=["Только Гамбург и окрестности (бесплатный маршрутизатор OpenStreetMap).", "Время в пути без учёта пробок в городе; для авто учитываются сообщения об автобанах.", "Это не совет ехать или не ехать и не оценка безопасности.", "Мы не ведём профиль и не сохраняем маршруты; запрос хранится в кэше до 5 минут."],
  ag_h="Для агентов", ag="То же отдаёт REST и MCP-инструмент get_route_context с параметром conditions.", more="Ещё", m1="Можно ли верить карточке места на карте?", m2="Библиотека кристаллов"),
 "de": dict(path="/de/tools/route-weather", lang="de", file="de/tools/route-weather.html", pre="/de",
  title="Wie sind Wetter, Luft und Dunkelheit auf meiner Route? · Bedingungen auf der Route · Orb Studio",
  desc="Zu Fuß, mit dem Rad oder Auto in Hamburg und Umgebung: wie viel der Strecke im Dunkeln liegt, wie die Luft unterwegs ist und ob amtliche Wetterwarnungen gelten. Keine Vorhersage.",
  eye="Unterwegs · zu Fuß · Rad · Auto", h1="Bedingungen auf der Route", lead="Wohin und wann? Wir zeigen Fahrzeit, wie viel der Strecke nach Sonnenuntergang liegt, den schlechtesten Luftindex an drei Punkten der Route und die amtlichen Warnungen des Deutschen Wetterdienstes.",
  places={"hauptbahnhof": "Hamburg Hauptbahnhof", "altona": "Altona", "harburg": "Harburg", "bergedorf": "Bergedorf", "center": "Zentrum (Rathaus)", "airport": "Flughafen", "finkenwerder": "Finkenwerder", "messe": "Messe", "volksparkstadion": "Volksparkstadion", "hafen": "Hafen (Landungsbrücken)", "buxtehude": "Buxtehude", "stade": "Stade", "luebeck": "Lübeck"},
  f_from="Von", f_to="Nach", f_mode="Wie", modes={"foot": "Zu Fuß", "bike": "Fahrrad", "car": "Auto"}, f_time="Abfahrt (Berliner Zeit)", go="Anzeigen",
  loading="Wird berechnet …", err="Das hat nicht geklappt: die Quelle hat nicht geantwortet. Bitte in einer Minute noch einmal.", same="Bitte zwei verschiedene Punkte wählen.",
  r_route="Strecke", r_km="km", r_min="Min.", r_dark="Im Dunkeln", r_dark_none="Die ganze Strecke bei Tageslicht (Sonnenuntergang um", r_dark_all="Die ganze Strecke nach Sonnenuntergang (Sonnenuntergang war um", r_dark_part="Min. nach Sonnenuntergang (Sonnenuntergang um", r_air="Luft", r_air_na="Luftindex nicht verfügbar.", r_warn="Warnungen des Deutschen Wetterdienstes (DWD, Land Hamburg)", r_warn_none="Derzeit keine aktiven Warnungen.", r_warn_n="aktive Warnungen, höchste Stufe",
  r_note="Keine Vorhersage: Luft und Warnungen gelten für jetzt, der Sonnenuntergang wird für die Abfahrtszeit berechnet. Die Route ist nicht den Warngebieten zugeordnet.",
  lim_h="Grenzen", lim=["Nur Hamburg und Umgebung (kostenloser OpenStreetMap-Router).", "Fahrzeit ohne Stau in der Stadt; beim Auto werden Meldungen zu Autobahnen berücksichtigt.", "Das ist keine Empfehlung zu fahren oder nicht zu fahren und keine Sicherheitsbewertung.", "Wir führen kein Profil und speichern keine Routen; die Anfrage liegt bis zu 5 Minuten im Zwischenspeicher."],
  ag_h="Für Agenten", ag="Dasselbe liefern REST und das MCP-Werkzeug get_route_context mit dem Parameter conditions.", more="Mehr", m1="Kann man der Ortskarte trauen?", m2="Kristall-Bibliothek"),
 "en": dict(path="/en/tools/route-weather", lang="en", file="en/tools/route-weather.html", pre="/en",
  title="What are the weather, air and darkness on my route? · Route conditions · Orb Studio",
  desc="On foot, by bike or by car around Hamburg: how much of the trip is after dark, how the air is along the way and whether official weather warnings apply. Not a forecast.",
  eye="On the road · foot · bike · car", h1="Route conditions", lead="Where to and when? We show travel time, how much of the trip falls after sunset, the worst air index at three points on the route and the official warnings of the German Weather Service.",
  places={"hauptbahnhof": "Hamburg Hauptbahnhof", "altona": "Altona", "harburg": "Harburg", "bergedorf": "Bergedorf", "center": "City centre (Rathaus)", "airport": "Airport", "finkenwerder": "Finkenwerder", "messe": "Messe", "volksparkstadion": "Volksparkstadion", "hafen": "Harbour (Landungsbrücken)", "buxtehude": "Buxtehude", "stade": "Stade", "luebeck": "Lübeck"},
  f_from="From", f_to="To", f_mode="How", modes={"foot": "On foot", "bike": "Bike", "car": "Car"}, f_time="Departure (Berlin time)", go="Show",
  loading="Working it out…", err="That did not work: the source did not answer. Please try again in a minute.", same="Please choose two different points.",
  r_route="Route", r_km="km", r_min="min", r_dark="In the dark", r_dark_none="The whole trip in daylight (sunset at", r_dark_all="The whole trip after sunset (sunset was at", r_dark_part="min after sunset (sunset at", r_air="Air", r_air_na="Air index not available.", r_warn="Warnings of the German Weather Service (DWD, state of Hamburg)", r_warn_none="No active warnings right now.", r_warn_n="active warnings, highest level",
  r_note="Not a forecast: air and warnings are for now, sunset is worked out for your departure time. The route is not matched to warning districts.",
  lim_h="Limits", lim=["Hamburg and surroundings only (free OpenStreetMap router).", "Travel time does not include city traffic; for cars, motorway reports are taken into account.", "This is not advice to go or not to go, and not a safety rating.", "We keep no profile and do not store routes; the request sits in a cache for up to 5 minutes."],
  ag_h="For agents", ag="The same comes from REST and the MCP tool get_route_context with the parameter conditions.", more="More", m1="Can you trust a place card on a map?", m2="Crystal Library"),
}
CSS = """:root{--bg:#05070e;--panel:#0b1222;--line:#1b2944;--fg:#e4ebf8;--dim:#8796b6;--holo:#6fe6ff;--up:#4fd8a4;--warn:#ffb454;--mono:ui-monospace,monospace;color-scheme:dark}
*{box-sizing:border-box}body{background:var(--bg);color:var(--fg);font-family:system-ui,sans-serif;margin:0;line-height:1.5}a{color:var(--holo)}
.wrap{max-width:760px;margin:0 auto;padding:16px max(16px,env(safe-area-inset-left,0px)) 28px;display:flex;flex-direction:column;gap:14px}
h1{font-size:26px;letter-spacing:.03em;margin:4px 0 0}h2{font-size:16px;letter-spacing:.05em;margin:0 0 8px;color:var(--holo)}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--dim);text-transform:uppercase}.lead{color:var(--dim);margin:2px 0 0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}.card p{margin:4px 0}.card ul{margin:4px 0;padding-left:20px}
form{display:grid;grid-template-columns:1fr 1fr;gap:10px}label{display:flex;flex-direction:column;gap:4px;font-size:12px;color:var(--dim);font-family:var(--mono);letter-spacing:.06em}
select,input,button{font:inherit;font-size:16px;color:var(--fg);background:#050b18;border:1px solid var(--line);border-radius:10px;padding:10px}
.seg{display:flex;gap:6px}.seg button{flex:1;padding:10px 6px;cursor:pointer}.seg button[aria-pressed=true]{border-color:var(--holo);color:var(--holo)}
.full{grid-column:1/-1}.go{background:var(--holo);color:#05121c;font-weight:600;border:0;cursor:pointer}.go:disabled{opacity:.6}
.res{display:none;gap:10px;flex-direction:column}.res.on{display:flex}.row{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}.k{font-family:var(--mono);font-size:11px;letter-spacing:.12em;color:var(--dim);text-transform:uppercase;min-width:110px}
.big{font-size:22px;font-weight:600}.bar{height:10px;border-radius:6px;background:#12203a;overflow:hidden;flex:1;min-width:140px}.bar i{display:block;height:100%;background:var(--warn)}
.ok{color:var(--up)}.bad{color:var(--warn)}.msg{color:var(--warn);min-height:1.2em}.small{font-size:12.5px;color:var(--dim)}
.more{display:flex;gap:8px;flex-wrap:wrap}.more a{font-family:var(--mono);font-size:12.5px;border:1px solid var(--line);border-radius:999px;padding:6px 11px;text-decoration:none}
@media(max-width:520px){form{grid-template-columns:1fr}}"""
JS = """(function(){var T=%s,$=function(i){return document.getElementById(i)},mode='bike',busy=false;
function berlinNow(){try{return new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hour12:false,timeZone:'Europe/Berlin'}).format(new Date())}catch(e){return '12:00'}}
$('time').value=berlinNow();$('to').selectedIndex=4;
Array.prototype.forEach.call(document.querySelectorAll('.seg button'),function(b){b.addEventListener('click',function(){mode=b.dataset.m;Array.prototype.forEach.call(document.querySelectorAll('.seg button'),function(x){x.setAttribute('aria-pressed',x===b?'true':'false')})})});
function el(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x!=null)n.textContent=x;return n}
function row(k,v){var r=el('div','row');r.appendChild(el('div','k',k));r.appendChild(v);return r}
$('f').addEventListener('submit',function(ev){ev.preventDefault();if(busy)return;var from=$('from').value,to=$('to').value,msg=$('msg'),res=$('res');msg.textContent='';
if(from===to){msg.textContent=T.same;return}
busy=true;$('go').disabled=true;msg.textContent=T.loading;
fetch('/api/v1/route?from='+encodeURIComponent(from)+'&to='+encodeURIComponent(to)+'&mode='+mode+'&conditions=true&time='+encodeURIComponent($('time').value||'12:00')).then(function(r){return r.json()}).then(function(d){
busy=false;$('go').disabled=false;if(d.status!=='ok'||!d.conditions){msg.textContent=T.err;res.className='res';return}msg.textContent='';res.textContent='';
var c=d.conditions,km=Math.round(d.distance_m/100)/10;
var big=el('div','big',km+' '+T.r_km+' · '+Math.round(d.duration_min)+' '+T.r_min);res.appendChild(row(T.r_route,big));
var dk=c.dark;if(dk&&dk.share!=null){var w=el('div','row');var bar=el('div','bar');var i=el('i');i.style.width=Math.round(dk.share*100)+'%%';bar.appendChild(i);w.appendChild(bar);
var tx=dk.share===0?T.r_dark_none+' '+dk.sunset+')':dk.share>=1?T.r_dark_all+' '+dk.sunset+')':Math.round(dk.minutes_after_sunset)+' '+T.r_dark_part+' '+dk.sunset+')';w.appendChild(el('span',dk.share>0?'bad':'ok',tx));res.appendChild(row(T.r_dark,w))}
var a=c.air,at=el('span',a&&a.status==='ok'&&a.worst_index>=3?'bad':'ok',a&&a.status==='ok'?(a.index_class&&a.index_class[T.l]||('index '+a.worst_index))+' ('+a.worst_index+(a.station?', '+a.station:'')+')':T.r_air_na);res.appendChild(row(T.r_air,at));
var wr=c.warnings,wt=wr&&wr.status!=='unavailable'?(wr.active_warnings>0?wr.active_warnings+' '+T.r_warn_n+' '+wr.max_level:T.r_warn_none):T.r_air_na;res.appendChild(row(T.r_warn,el('span',wr&&wr.active_warnings>0?'bad':'ok',wt)));
res.appendChild(el('p','small',T.r_note));res.className='res on'}).catch(function(){busy=false;$('go').disabled=false;msg.textContent=T.err})});})();"""

def page(k):
    t = L[k]; url = "https://orbstudio.org" + t["path"]
    alts = "\n".join(f'<link rel="alternate" hreflang="{x}" href="https://orbstudio.org{L[x]["path"]}">' for x in ("ru", "de", "en")) + f'\n<link rel="alternate" hreflang="x-default" href="https://orbstudio.org{L["en"]["path"]}">'
    ld = {"@context": "https://schema.org", "@type": "WebPage", "name": t["title"], "url": url, "inLanguage": t["lang"], "description": t["desc"], "isPartOf": {"@type": "WebSite", "name": "Orb Studio", "url": "https://orbstudio.org"}}
    opts = lambda: "".join(f'<option value="{p}">{e(t["places"][p])}</option>' for p in PLACES)
    modes = "".join(f'<button type="button" data-m="{m}" aria-pressed="{"true" if m == "bike" else "false"}">{e(t["modes"][m])}</button>' for m in ("foot", "bike", "car"))
    tj = json.dumps({"loading": t["loading"], "err": t["err"], "same": t["same"], "r_route": t["r_route"], "r_km": t["r_km"], "r_min": t["r_min"], "r_dark": t["r_dark"], "r_dark_none": t["r_dark_none"], "r_dark_all": t["r_dark_all"], "r_dark_part": t["r_dark_part"], "r_air": t["r_air"], "r_air_na": t["r_air_na"], "r_warn": t["r_warn"], "r_warn_none": t["r_warn_none"], "r_warn_n": t["r_warn_n"], "r_note": t["r_note"], "l": t["lang"]}, ensure_ascii=False).replace("</", "<\\/")
    lim = "".join(f"<li>{e(x)}</li>" for x in t["lim"])
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
<section class="card"><form id="f">
<label>{e(t['f_from'])}<select id="from">{opts()}</select></label>
<label>{e(t['f_to'])}<select id="to">{opts()}</select></label>
<label class="full">{e(t['f_mode'])}<div class="seg">{modes}</div></label>
<label class="full">{e(t['f_time'])}<input id="time" type="time" required></label>
<button class="go full" id="go" type="submit">{e(t['go'])}</button>
</form><p class="msg" id="msg" role="status"></p></section>
<section class="card res" id="res" aria-live="polite"></section>
<section class="card"><h2>{e(t['lim_h'])}</h2><ul>{lim}</ul></section>
<section class="card"><h2>{e(t['ag_h'])}</h2><p>{e(t['ag'])}</p><p><code>https://orbstudio.org/api/v1/route?from=harburg&amp;to=center&amp;mode=bike&amp;conditions=true&amp;time=16:30</code></p></section>
<section class="card"><h2>{e(t['more'])}</h2><div class="more"><a href="{t['pre']}/tools/maps">{e(t['m1'])}</a><a href="{t['pre']}/tools/crystals">{e(t['m2'])}</a></div></section>
</main>
<script>{JS % tj}</script>
</body>
</html>
"""

for k in L:
    p = ROOT / "public" / L[k]["file"]; p.parent.mkdir(parents=True, exist_ok=True); p.write_text(page(k), encoding="utf-8"); print("wrote", p.relative_to(ROOT))
