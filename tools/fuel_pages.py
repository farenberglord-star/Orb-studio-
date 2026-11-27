#!/usr/bin/env python3
"""Страница «Цены на топливо: Гамбург и пригороды» (киберпанк-виджет с паспортом данных): public/tools/fuel.html, public/de/tools/fuel.html, public/en/tools/fuel.html.
Данные: /api/v1/fuel-hamburg (src/fuel.js, Tankerkönig.de, CC BY 4.0). Меню берём у страниц Бэрд (тот же каркас), поэтому после правок меню:
  python3 tools/nav.py && python3 tools/i18n_pages.py && python3 tools/fuel_pages.py
Запуск: python3 tools/fuel_pages.py"""
import os, re, json, html
ROOT = os.path.join(os.path.dirname(__file__), "..", "public")

T = {
 "ru": dict(path="/tools/fuel", pre="", file="tools/fuel.html", lang="ru",
  title="Где сейчас дешевле заправиться в Гамбурге и пригородах? · Цены на топливо · Orb Studio",
  desc="Дизель, E5 и E10 на заправках Гамбурга, Харбурга, Буксте­худе и пригородов: самые низкие цены, медиана и паспорт данных — что отсеяно и почему. Данные Tankerkönig.de, CC BY 4.0.".replace("­", ""),
  eyebrow="Orb Studio · дорога · цены", h1="Цены на топливо: Гамбург и пригороды",
  lead="Дизель, E5 и E10 в радиусе 25 км вокруг центра Гамбурга и его южных пригородов. Перед показом каждая цена проходит паспорт данных: закрытые станции, пустые и невозможные цены отсеиваются, выбросы помечаются. Цены паспорт не меняет.",
  eyebrow_nav="Orb Studio · инструменты", lowest="минимум", median="медиана", passed="прошли паспорт", ph="ПАСПОРТ ДАННЫХ · что отсеяно и почему",
  loading="Загружаем цены…", err="Источник сейчас не ответил. Попробуйте через минуту.", notconf="Датчик ещё не подключён.",
  fetched="Данные получены", stale="Источник не ответил — показана последняя удачная копия.", best="лучшая цена",
  r_closed="закрыта", r_no_price="нет цены", r_out_of_range="цена вне правдоподобного диапазона", r_outlier="выброс: больше чем на 12 % от медианы", none="Ничего не отсеяно.",
  rules="Паспорт только фильтрует и помечает. Цены он не меняет: это данные Tankerkönig/MTS-K как есть. В списке нет отметки времени у каждой цены, поэтому проверки свежести здесь нет: мы показываем время получения списка (кэш до 6 минут).",
  src="Цены:", vis="Визитов:", share="Поделиться в X", agents="Для агентов", agents_t="То же отдаёт API: GET /api/v1/fuel-hamburg. Бесплатно, без ключа. Не финансовый и не маршрутный совет: цена на колонке может отличаться.",
  partners="Партнёры Orb Studio · реферальные ссылки", kr="Kraken — криптобиржа ↗", sl="Starlink — интернет везде ↗", unit="€/л", loc="ru-RU",
  more="Ещё", m1="Условия на маршруте", m1u="/tools/route-weather", m2="Все инструменты"),
 "de": dict(path="/de/tools/fuel", pre="/de", file="de/tools/fuel.html", lang="de",
  title="Wo tanke ich gerade am günstigsten in Hamburg und Umland? · Spritpreise · Orb Studio",
  desc="Diesel, E5 und E10 an Tankstellen in Hamburg, Harburg, Buxtehude und im Umland: niedrigste Preise, Median und Datenpass — was aussortiert wurde und warum. Daten von Tankerkönig.de, CC BY 4.0.",
  eyebrow="Orb Studio · unterwegs · Preise", h1="Spritpreise: Hamburg und Umland",
  lead="Diesel, E5 und E10 im Umkreis von 25 km um die Hamburger Mitte und die südlichen Vororte. Jeder Preis durchläuft vor der Anzeige den Datenpass: geschlossene Stationen, leere und unmögliche Preise fliegen raus, Ausreißer werden markiert. Der Pass ändert keinen Preis.",
  eyebrow_nav="Orb Studio · Werkzeuge", lowest="Bestpreis", median="Median", passed="geprüft", ph="DATENPASS · was aussortiert wurde und warum",
  loading="Preise werden geladen …", err="Die Quelle hat gerade nicht geantwortet. Bitte in einer Minute noch einmal versuchen.", notconf="Der Sensor ist noch nicht angeschlossen.",
  fetched="Daten abgerufen", stale="Die Quelle antwortet nicht — zuletzt gültige Kopie.", best="bester Preis",
  r_closed="geschlossen", r_no_price="kein Preis", r_out_of_range="Preis außerhalb des plausiblen Bereichs", r_outlier="Ausreißer: mehr als 12 % vom Median entfernt", none="Nichts aussortiert.",
  rules="Der Pass filtert und markiert nur. Preise werden nie verändert: Es sind Tankerkönig/MTS-K-Daten, wie sie sind. Die Liste enthält keinen Zeitstempel je Preis, deshalb gibt es hier keine Frische-Prüfung: Gezeigt wird der Abrufzeitpunkt (Cache bis zu 6 Minuten).",
  src="Preise:", vis="Besuche:", share="Auf X teilen", agents="Für Agenten", agents_t="Dasselbe liefert die API: GET /api/v1/fuel-hamburg. Kostenlos, ohne Schlüssel. Keine Finanz- oder Routenberatung: Der Preis an der Säule kann abweichen.",
  partners="Orb-Studio-Partner · Empfehlungslinks", kr="Kraken — Krypto-Börse ↗", sl="Starlink — Internet überall ↗", unit="€/l", loc="de-DE",
  more="Mehr", m1="Bedingungen auf der Route", m1u="/de/tools/route-weather", m2="Alle Werkzeuge"),
 "en": dict(path="/en/tools/fuel", pre="/en", file="en/tools/fuel.html", lang="en",
  title="Where is fuel cheapest right now in Hamburg and the suburbs? · Fuel prices · Orb Studio",
  desc="Diesel, E5 and E10 at petrol stations in Hamburg, Harburg, Buxtehude and the suburbs: lowest prices, median and a data passport — what was filtered out and why. Data from Tankerkönig.de, CC BY 4.0.",
  eyebrow="Orb Studio · on the road · prices", h1="Fuel prices: Hamburg and suburbs",
  lead="Diesel, E5 and E10 within 25 km of central Hamburg and its southern suburbs. Every price passes a data passport before it is shown: closed stations, empty and impossible prices are dropped, outliers are flagged. The passport never changes a price.",
  eyebrow_nav="Orb Studio · tools", lowest="lowest", median="median", passed="passed", ph="DATA PASSPORT · what was filtered and why",
  loading="Loading prices…", err="The source did not answer. Please try again in a minute.", notconf="The sensor is not connected yet.",
  fetched="Data fetched", stale="The source is not answering — showing the last good copy.", best="best price",
  r_closed="closed", r_no_price="no price", r_out_of_range="price outside plausible range", r_outlier="outlier: more than 12% from the median", none="Nothing was filtered out.",
  rules="The passport only filters and flags. It never changes a price: this is Tankerkönig/MTS-K data as reported. The list carries no timestamp per price, so there is no freshness check here: we show the time the list was fetched (cache up to 6 minutes).",
  src="Prices:", vis="Visits:", share="Share on X", agents="For agents", agents_t="The same data via API: GET /api/v1/fuel-hamburg. Free, no key. Not financial or route advice: the price at the pump may differ.",
  partners="Orb Studio partners · referral links", kr="Kraken — crypto exchange ↗", sl="Starlink — internet anywhere ↗", unit="€/l", loc="en-GB",
  more="More", m1="Route conditions", m1u="/en/tools/route-weather", m2="All tools"),
}

CSS = """<style>
.fx{--cy:#00f0ff;--mg:#ff2bd6;--gr:#39ff88;--am:#ffb800;--rd:#ff3b5c;font-family:ui-monospace,'JetBrains Mono',monospace}
.fx h1{font-family:'Chakra Petch',system-ui,sans-serif;font-size:clamp(22px,5vw,32px);letter-spacing:.06em;color:var(--cy);text-shadow:0 0 14px rgba(0,240,255,.6);margin:4px 0}
.fx .lead{color:#9aa6d0;max-width:70ch}
.fx-sel{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}
.fx-sel button{background:#0b0e1c;color:#6f78a8;border:1px solid #1b2145;padding:10px 16px;font:700 13px 'Chakra Petch',system-ui,sans-serif;letter-spacing:.08em;cursor:pointer;border-radius:0}
.fx-sel button[aria-pressed=true]{color:#05060d;background:var(--cy);border-color:var(--cy);box-shadow:0 0 16px rgba(0,240,255,.55)}
.fx-stat{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0}
.fx-stat div{background:#0b0e1c;border:1px solid #1b2145;padding:10px;text-align:center}
.fx-stat small{display:block;color:#6f78a8;font-size:10px;letter-spacing:.1em;text-transform:uppercase}
.fx-stat strong{font:700 clamp(15px,4vw,21px) 'Chakra Petch',system-ui,sans-serif;color:var(--gr);text-shadow:0 0 10px rgba(57,255,136,.45)}
.fx-card{display:grid;grid-template-columns:30px 1fr auto;gap:10px;align-items:center;background:#0b0e1c;border:1px solid #1b2145;border-left:3px solid var(--cy);padding:10px 12px;margin:8px 0}
.fx-card.best{border-left-color:var(--gr);box-shadow:0 0 18px rgba(57,255,136,.14)}
.fx-rank{font:700 16px 'Chakra Petch',system-ui,sans-serif;color:var(--mg)}
.fx-nm{font-weight:600}.fx-nm i{font-style:normal;color:#6f78a8;font-weight:400}
.fx-pr{font:700 clamp(18px,4.5vw,23px) 'Chakra Petch',system-ui,sans-serif;color:var(--cy);text-shadow:0 0 10px rgba(0,240,255,.45);text-align:right}
.fx-card.best .fx-pr{color:var(--gr)}
.fx-tag{display:inline-block;margin-left:6px;padding:0 5px;font-size:10px;border:1px solid var(--gr);color:var(--gr)}
.fx-pass{margin-top:18px;border:1px solid var(--mg);background:rgba(255,43,214,.04);padding:12px}
.fx-pass h2{font:700 13px 'Chakra Petch',system-ui,sans-serif;color:var(--mg);letter-spacing:.1em;margin:0 0 8px}
.fx-pass li{list-style:none;font-size:12px;padding:3px 0;border-bottom:1px dashed #1b2145}
.fx-pass ul{margin:0;padding:0}.fx-pass li em{color:var(--rd);font-style:normal}.fx-pass li u{text-decoration:none;color:var(--am)}
.fx-rules{font-size:11.5px;color:#8a92b8;margin:10px 0 0}
.fx-ban{display:flex;gap:8px;margin:10px 0}
.fx-ban a{flex:1;text-align:center;padding:9px 8px;font-size:12px;text-decoration:none;color:#cfd6ff;border:1px solid #1b2145;background:#0b0e1c;letter-spacing:.04em}
.fx-ban a:first-of-type{border-color:rgba(185,174,255,.5)}
.fx-st{min-height:1.4em;color:var(--am);font-size:12.5px}
.fx-foot{margin-top:16px;font-size:11.5px;color:#8a92b8;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between}
.fx-share{border:1px solid var(--cy);color:var(--cy);padding:6px 12px;text-decoration:none;font-size:12px}
</style>"""

def build(code):
    t = T[code]
    base = open(os.path.join(ROOT, *( ([] if code == "ru" else [code]) + ["tools", "baird.html"] )), encoding="utf-8").read()
    nav_css = re.search(r"<!--orb-nav-css-->.*?<!--/orb-nav-css-->", base, re.S).group(0)
    nav = re.search(r"<!--orb-nav-->.*?<!--/orb-nav-->", base, re.S).group(0).replace("/tools/baird", "/tools/fuel")
    root = "https://orbstudio.org"
    E = lambda x: html.escape(x, quote=True)
    ld = json.dumps({"@context": "https://schema.org", "@type": "WebPage", "name": t["title"], "url": root + t["path"], "inLanguage": t["lang"], "description": t["desc"]}, ensure_ascii=False)
    js_t = json.dumps({k: t[k] for k in ("loading", "err", "notconf", "fetched", "stale", "best", "r_closed", "r_no_price", "r_out_of_range", "r_outlier", "none", "unit", "loc", "lowest", "median", "passed")}, ensure_ascii=False)
    share = "https://x.com/intent/post?text=" + "Hamburg fuel prices, filtered by a data passport (closed stations, empty and impossible prices dropped, nothing altered) - ORB Fuel Radar. Data: Tankerkoenig.de CC BY 4.0".replace(" ", "%20") + "&url=" + root + "/en/tools/fuel"
    out = f"""<!doctype html>
<html lang="{t['lang']}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(t['title'])}</title>
<meta name="description" content="{E(t['desc'])}">
<link rel="canonical" href="{root}{t['path']}">
<link rel="alternate" hreflang="ru" href="{root}/tools/fuel">
<link rel="alternate" hreflang="de" href="{root}/de/tools/fuel">
<link rel="alternate" hreflang="en" href="{root}/en/tools/fuel">
<link rel="alternate" hreflang="x-default" href="{root}/en/tools/fuel">
<meta property="og:url" content="{root}{t['path']}">
<meta property="og:site_name" content="Orb Studio">
<meta property="og:title" content="{E(t['title'])}">
<meta property="og:description" content="{E(t['desc'])}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>:root{{--bg:#05060d;--panel:#0b0e1c;--line:#1b2145;--fg:#cfd6ff;--dim:#8a92b8;--holo:#00f0ff;color-scheme:dark}}
*{{box-sizing:border-box}}body{{background:radial-gradient(1000px 500px at 85% -10%,rgba(80,30,150,.25),transparent),radial-gradient(800px 400px at -10% 5%,rgba(0,240,255,.07),transparent),var(--bg);color:var(--fg);font-family:system-ui,sans-serif;margin:0;line-height:1.5}}a{{color:var(--holo)}}
.wrap{{max-width:860px;margin:0 auto;padding:14px max(16px,env(safe-area-inset-left,0px)) 40px}}.eyebrow{{font-family:ui-monospace,monospace;font-size:11px;letter-spacing:.16em;color:#6f78a8;text-transform:uppercase}}</style>
{CSS}
{nav_css}
<script type="application/ld+json">{ld}</script>
</head>
<body>{nav}
<main class="wrap fx">
<header><div class="eyebrow">{E(t['eyebrow'])}</div><h1>{E(t['h1'])}</h1><p class="lead">{E(t['lead'])}</p></header>
<div class="fx-ban" aria-label="{E(t['partners'])}"><a href="/go/kraken?from=fuel" target="_blank" rel="sponsored noopener">{E(t['kr'])}</a><a href="/go/starlink?from=fuel" target="_blank" rel="sponsored noopener">{E(t['sl'])}</a></div>
<div class="fx-sel" role="group" id="sel"><button type="button" data-f="diesel" aria-pressed="true">DIESEL</button><button type="button" data-f="e5" aria-pressed="false">E5</button><button type="button" data-f="e10" aria-pressed="false">E10</button></div>
<div class="fx-st" id="st" role="status">{E(t['loading'])}</div>
<div class="fx-stat"><div><small>{E(t['lowest'])}</small><strong id="smin">–</strong></div><div><small>{E(t['median'])}</small><strong id="smed">–</strong></div><div><small>{E(t['passed'])}</small><strong id="sok">–</strong></div></div>
<div id="list"></div>
<section class="fx-pass"><h2>{E(t['ph'])}</h2><ul id="plog"></ul><p class="fx-rules">{E(t['rules'])}</p></section>
<section class="fx-pass" style="border-color:#1b2145;background:none"><h2 style="color:var(--holo)">{E(t['agents'])}</h2><p class="fx-rules" style="margin:0">{E(t['agents_t'])}</p></section>
<div class="fx-foot"><span>{E(t['src'])} <a href="https://www.tankerkoenig.de" target="_blank" rel="noopener">Tankerkönig.de</a> · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a> · <span id="when"></span></span><span>{E(t['vis'])} <b id="vc">—</b></span><a class="fx-share" href="{share}" target="_blank" rel="noopener">{E(t['share'])}</a></div>
<div class="fx-ban" style="margin-top:14px"><a href="{t['m1u']}">{E(t['m1'])}</a><a href="{t['pre']}/tools">{E(t['m2'])}</a></div>
</main>
<script>(function(){{
var T={js_t},fuel='diesel',D=null;
function $(i){{return document.getElementById(i)}}
function el(tag,cls,txt){{var n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n}}
function fmt(x){{return x==null?'–':x.toLocaleString(T.loc,{{minimumFractionDigits:3,maximumFractionDigits:3}})+' €'}}
function render(){{
  if(!D||D.status!=='ok'){{return}}
  var f=D.fuels[fuel],list=$('list');list.textContent='';
  $('smin').textContent=fmt(f.lowest);$('smed').textContent=fmt(f.median);$('sok').textContent=f.stations_passed+' / '+f.stations_total;
  f.top.forEach(function(s,i){{
    var c=el('div','fx-card'+(i?'':' best')),r=el('div','fx-rank',String(i+1)),m=el('div'),n=el('div','fx-nm',s.name+' ');
    n.appendChild(el('i',null,'· '+s.street+(s.street&&s.place?', ':'')+s.place));if(!i)n.appendChild(el('span','fx-tag',T.best));
    m.appendChild(n);c.appendChild(r);c.appendChild(m);c.appendChild(el('div','fx-pr',fmt(s.price)));list.appendChild(c)}});
  var log=$('plog');log.textContent='';var any=false;
  ['closed','no_price','out_of_range','outlier'].forEach(function(k){{var n=f.rejected[k];if(!n)return;any=true;var li=el('li');li.appendChild(el('em',null,'✕ '));li.appendChild(document.createTextNode(n+' × '));li.appendChild(el('u',null,T['r_'+k]));log.appendChild(li)}});
  f.rejected_examples.forEach(function(e){{var li=el('li');li.appendChild(el('em',null,'✕ '));li.appendChild(document.createTextNode(e.name+(e.place?' · '+e.place:'')+(e.price!=null?' · '+fmt(e.price):'')+' — '));li.appendChild(el('u',null,T['r_'+e.reason]));log.appendChild(li)}});
  if(!any)log.appendChild(el('li',null,T.none));
}}
Array.prototype.forEach.call(document.querySelectorAll('#sel button'),function(b){{b.addEventListener('click',function(){{fuel=b.dataset.f;Array.prototype.forEach.call(document.querySelectorAll('#sel button'),function(x){{x.setAttribute('aria-pressed',x===b?'true':'false')}});render()}})}});
fetch('/api/v1/fuel-hamburg',{{headers:{{accept:'application/json'}}}}).then(function(r){{return r.json()}}).then(function(d){{
  D=d;if(d.status!=='ok'){{$('st').textContent=d.reason==='not_configured'?T.notconf:T.err;return}}
  $('st').textContent=d.stale?T.stale:'';
  try{{$('when').textContent=T.fetched+' '+new Date(d.fetched_at).toLocaleTimeString(T.loc,{{hour:'2-digit',minute:'2-digit'}})}}catch(e){{}}
  render()}}).catch(function(){{$('st').textContent=T.err}});
try{{var first=!sessionStorage.getItem('orbCounted_fuel');if(first)sessionStorage.setItem('orbCounted_fuel','1');
(first?fetch('/api/v1/hit',{{method:'POST',headers:{{'content-type':'application/json'}},body:JSON.stringify({{page:'fuel',lang:'{t['lang']}',auto:!!navigator.webdriver}})}}):fetch('/api/v1/stats?page=fuel')).then(function(r){{return r.json()}}).then(function(s){{if(s&&s.page_total!=null)$('vc').textContent=s.page_total}}).catch(function(){{}})}}catch(e){{}}
}})();</script>
</body>
</html>
"""
    path = os.path.join(ROOT, *t["file"].split("/"))
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w", encoding="utf-8").write(out)
    print("written", t["file"])

if __name__ == "__main__":
    for c in T: build(c)
