#!/usr/bin/env python3
# Страницы датчиков в честь учёных (Гамильтон, Микрин, …): три языка из шаблона раздела «Инструменты».
# Запуск: python3 tools/honour_pages.py — пересобирает public/tools/<id>.html, public/de/tools/<id>.html, public/en/tools/<id>.html
import re, json, html as H
TPL = {"ru": "public/tools.html", "de": "public/de/tools.html", "en": "public/en/tools.html"}
LOC = {"ru": "ru-RU", "de": "de-DE", "en": "en-GB"}
OG_LOCALE = {"ru": "ru_RU", "de": "de_DE", "en": "en_GB"}
STRIP = {"ru": ("Партнёры Orb Studio", "Kraken — криптобиржа", "Starlink — интернет везде", "реферальные ссылки"),
         "de": ("Partner von Orb Studio", "Kraken — Kryptobörse", "Starlink — Internet überall", "Empfehlungslinks"),
         "en": ("Orb Studio partners", "Kraken — crypto exchange", "Starlink — internet anywhere", "referral links")}
CSS = (".hm-list{list-style:none;padding:0;margin:0}.hm-list li{display:grid;grid-template-columns:1.6rem 1fr auto;gap:.15rem .6rem;padding:.6rem 0;border-bottom:1px solid rgba(255,255,255,.12)}"
       ".hm-list .n{opacity:.6}.hm-list .s{white-space:nowrap}.hm-list .w{grid-column:2/4;font-size:.92rem;opacity:.85}.hm-list .u{grid-column:2/4;font-size:.8rem;opacity:.6}.hm-st{font-size:1.15rem;margin:.2rem 0 .8rem}"
       ".pstrip{display:flex;flex-wrap:wrap;gap:.35rem .9rem;align-items:center;justify-content:center;margin:1.2rem 0 4.5rem;padding:.45rem .8rem;border:1px solid rgba(155,140,255,.35);border-radius:999px;font-size:.8rem;opacity:.85}"
       ".pstrip a{text-decoration:none}.pstrip small{opacity:.6}")
def page(sid, lg, c, wiki, render_js, cfg, person):
    s = open(TPL[lg]).read(); head = s[:s.index('<div class="wrap">')]
    path = ("" if lg == "ru" else "/" + lg) + "/tools/" + sid
    head = re.sub(r'<title>.*?</title>', '<title>' + H.escape(c["title"]) + '</title>', head, count=1, flags=re.S)
    for prop, val in [("name=\"description\"", c["desc"]), ("property=\"og:description\"", c["desc"]), ("property=\"og:title\"", c["title"]), ("property=\"og:url\"", "https://orbstudio.org" + path)]:
        head = re.sub(r'(<meta ' + re.escape(prop) + r' content=")[^"]*(")', lambda m: m.group(1) + H.escape(val) + m.group(2), head, count=1)
    head = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + "https://orbstudio.org" + path + m.group(2), head, count=1)
    head = re.sub(r'href="/(ru|de|en)/tools(?:/[a-z-]+)?"', lambda m: 'href="/' + m.group(1) + '/tools/' + sid + '"', head)
    head = re.sub(r'<link rel="alternate" hreflang[^>]*>\s*', '', head)
    alt = "".join(f'<link rel="alternate" hreflang="{l}" href="https://orbstudio.org/{l}/tools/{sid}">\n' for l in ("ru", "de", "en")) + f'<link rel="alternate" hreflang="x-default" href="https://orbstudio.org/tools/{sid}">\n'
    ld = {"@context": "https://schema.org", "@type": "WebPage", "name": c["title"], "description": c["desc"], "url": "https://orbstudio.org" + path, "inLanguage": lg,
          "isPartOf": {"@type": "WebSite", "name": "Orb Studio", "url": "https://orbstudio.org/"}, "about": person,
          "mainEntity": {"@type": "Dataset", "name": c["h1"], "description": c["desc"], "url": "https://orbstudio.org/api/v1/" + sid, "isAccessibleForFree": True,
                         "distribution": {"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": "https://orbstudio.org/api/v1/" + sid}}}
    head = head.replace('</head>', alt + '<meta property="og:locale" content="' + OG_LOCALE[lg] + '">\n<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>\n<style>' + CSS + '</style>\n</head>', 1)
    st = STRIP[lg]
    body = f'''<div class="wrap">
  <div>
    <div class="eyebrow">{H.escape(c["eye"])}</div>
    <h1>{H.escape(c["h1"])}</h1>
    <p class="lead">{H.escape(c["lead"])}</p>
  </div>
  <section class="panel" id="now">
    <h2>{H.escape(c["now_h"])}</h2>
    <p class="hm-st" id="hmStatus">{H.escape(cfg["loading"])}</p>
    <ol class="hm-list" id="hmRows"></ol>
    <p>{c["agents"]}</p>
  </section>
  <section class="panel" id="honour">
    <h2>{H.escape(c["honour_h"])}</h2>
    <p>{c["honour"].replace("{wiki}", wiki)}</p>
    <p><small>{H.escape(c["note"])}</small></p>
  </section>
  <aside class="pstrip" aria-label="{H.escape(st[0])}"><small>{H.escape(st[0])} · {H.escape(st[3])}</small><a href="/go/kraken?from={sid}" target="_blank" rel="sponsored noopener">{H.escape(st[1])} ↗</a><a href="/go/starlink?from={sid}" target="_blank" rel="sponsored noopener">{H.escape(st[2])} ↗</a></aside>
</div>
<script>
const HM={json.dumps(cfg, ensure_ascii=False)};
const esc=(t)=>String(t==null?"":t).replace(/[&<>"]/g,(m)=>({{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}})[m]);
const tm=(iso)=>{{if(!iso)return"—";const d=new Date(iso);return d.toLocaleString(HM.loc,{{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}});}};
const dur=(m)=>m==null?HM.nodata:(m<60?m+" "+HM.min:Math.floor(m/60)+" "+HM.h+(m%60?" "+(m%60)+" "+HM.min:""));
fetch("/api/v1/{sid}",{{headers:{{accept:"application/json"}}}}).then((r)=>r.ok?r.json():null).then((d)=>{{{render_js}}}).catch(()=>{{document.getElementById("hmStatus").textContent=HM.err;}});
</script>
<script type="module" src="/share-x.js"></script>
<script src="/backnav.js" defer></script>
</body>
</html>
'''
    return head + body

# ---------------- Датчики ----------------
HAMILTON_RENDER = '''if(!d||!Array.isArray(d.components)){document.getElementById("hmStatus").textContent=HM.err;return;}
  document.getElementById("hmStatus").textContent=HM.status_h[d.status]||d.status;
  document.getElementById("hmRows").innerHTML=d.components.map((c)=>{const what=(c.dropped||[]).map((x)=>HM.topic[x]||x).join(", "),why=(c.why||[]).map((x)=>HM.why[x]||x).join("; ");
    return "<li><span class=\\"n\\">"+c.priority+"</span><b>"+esc(HM.comp[c.id]||c.id)+"</b><span class=\\"s\\">"+esc(HM.state[c.state]||c.state)+"</span>"+(what||why?"<span class=\\"w\\">"+esc(what)+(what&&why?" — ":"")+esc(why)+"</span>":"")+"<span class=\\"u\\">"+esc(HM.upd)+": "+esc(tm(c.updated))+"</span></li>";}).join("");'''
MIKRIN_RENDER = '''if(!d||!Array.isArray(d.blocks)){document.getElementById("hmStatus").textContent=HM.err;return;}
  const best=d.blocks.find((b)=>b.id===d.shortest_path);document.getElementById("hmStatus").textContent=best?HM.best+": "+(HM.comp[best.id]||best.id)+" — "+dur(best.steps[0].minutes_median):HM.nobest;
  document.getElementById("hmRows").innerHTML=d.blocks.map((b,i)=>{const s1=b.steps[0],s2=b.steps[1];
    const range=s1.minutes_median==null||s1.minutes_min===s1.minutes_max?"":" ("+HM.range+" "+dur(s1.minutes_min)+" – "+dur(s1.minutes_max)+")";
    return "<li><span class=\\"n\\">"+(i+1)+"</span><b>"+esc(HM.comp[b.id]||b.id)+"</b><span class=\\"s\\">"+esc(dur(s1.minutes_median))+"</span>"+
      "<span class=\\"w\\">"+esc(HM.s1)+": "+esc(dur(s1.minutes_median)+range)+"<br>"+esc(HM.s2)+": "+esc(s2.minutes!=null?dur(s2.minutes):s2.measured===false?HM.nodata:HM.notyet)+"<br>"+esc(HM.age)+": "+esc(dur(b.newest_news_age_minutes))+"</span>"+
      "<span class=\\"u\\">"+esc(HM.timed)+": "+b.items_with_source_time+" / "+b.items+" · "+esc(HM.upd)+": "+esc(tm(b.written_at))+"</span></li>";}).join("");'''
POLYAK_RENDER = """if(!d||!Array.isArray(d.series)){document.getElementById("hmStatus").textContent=HM.err;return;}
  const n=d.series.filter((s)=>s.verdict==="jump"||s.verdict==="shift").length;document.getElementById("hmStatus").textContent=n?HM.some.replace("{n}",n):HM.allcalm;
  const f=(x)=>x==null?HM.nodata:Number(x).toLocaleString(HM.loc,{maximumFractionDigits:1});
  document.getElementById("hmRows").innerHTML=d.series.map((s,i)=>{const v=(HM.verdict[s.verdict]||s.verdict)+(s.direction?" "+(s.direction==="up"?"↑":"↓"):"");
    const w=s.verdict==="unknown"?esc(HM.few)+": "+s.readings_24h:esc(HM.last)+": "+esc(f(s.last))+" · "+esc(HM.avg)+": "+esc(f(s.polyak_average_24h))+" · "+esc(HM.avg3)+": "+esc(f(s.average_last_3h))+"<br>"+esc(HM.inertia)+": "+esc((s.inertia_per_6h>0?"+":"")+f(s.inertia_per_6h))+" · "+esc(HM.thr)+": ±"+esc(f(s.noise_threshold));
    return "<li><span class=\\"n\\">"+(i+1)+"</span><b>"+esc(HM.comp[s.id]||s.id)+"</b><span class=\\"s\\">"+esc(v)+"</span><span class=\\"w\\">"+w+"</span><span class=\\"u\\">"+esc(HM.readings)+": "+s.readings_24h+"</span></li>";}).join("");"""
SENSORS = {
 "hamilton": dict(render=HAMILTON_RENDER,
   wiki={"ru": "https://ru.wikipedia.org/wiki/%D0%93%D0%B0%D0%BC%D0%B8%D0%BB%D1%8C%D1%82%D0%BE%D0%BD,_%D0%9C%D0%B0%D1%80%D0%B3%D0%B0%D1%80%D0%B5%D1%82_(%D1%83%D1%87%D1%91%D0%BD%D1%8B%D0%B9)", "de": "https://de.wikipedia.org/wiki/Margaret_Hamilton_(Informatikerin)", "en": "https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer)"},
   person={"@type": "Person", "name": "Margaret Hamilton", "birthDate": "1936-08-17", "deathDate": "2026-09-30", "sameAs": ["https://en.wikipedia.org/wiki/Margaret_Hamilton_(software_engineer)", "https://de.wikipedia.org/wiki/Margaret_Hamilton_(Informatikerin)"]},
   L={
 "ru": dict(title="Датчик Гамильтон · Orb Studio", desc="Что в Orb Studio работает полностью, что отброшено ради главного и почему. Датчик назван в честь Маргарет Гамильтон (1936–2026), руководившей программой бортового ПО «Аполлона».",
   eye="Orb Studio · инструменты · датчик", h1="Датчик Гамильтон",
   lead="Когда система перегружена, она не должна падать: главное продолжает работать, второстепенное откладывается, а людям честно говорят, что именно отложено. Этот датчик показывает это для самой Orb Studio, по порядку важности.",
   honour_h="В честь Маргарет Гамильтон (1936–2026)",
   honour='Маргарет Гамильтон руководила в MIT командой, которая написала бортовые программы «Аполлона». При посадке «Аполлона-11» компьютер был перегружен, но её система отбросила второстепенные задачи, оставила главные и подала сигнал тревоги — посадку не отменили. Она ввела в оборот выражение «программная инженерия» и всю жизнь занималась тем, как предотвращать ошибки ещё до их появления. Умерла 30 сентября 2026 года. <a href="{wiki}" rel="noopener">Статья в Википедии</a>.',
   note="Датчик назван в её честь; Orb Studio не связана с Маргарет Гамильтон, её семьёй или компанией Hamilton Technologies.",
   now_h="Состояние сейчас", agents="Для агентов: <code>GET /api/v1/hamilton</code> или MCP-инструмент <code>get_hamilton</code>. Бесплатно, без ключа.",
   cfg=dict(upd="Обновлено", comp={"music":"Музыка","voice":"Голос","dj":"Связки Давида","sensor_news":"Новости с датчиков","radar_news":"Новости радаров","regional":"Интервью по регионам","self_check":"Автопроверка"},
     state={"full":"✅ полностью","degraded":"⚠️ упрощено","stale":"⏳ устарело","down":"⛔ отключено","unknown":"· нет замера"},
     why={"track_missing":"нет файла трека","voice_budget_low":"почти кончился дневной лимит голоса — дальше субтитры","dj_unvoiced":"голос ещё не создан — появится при первом слушателе","unit_not_in_words":"единица не словами — новость не прошла проверку","claude_no_answer":"Claude не ответил","number_not_in_sensor_lines":"число не совпало с данными датчика","not_updated":"давно не обновлялось","wrong_language":"не тот язык","too_short":"слишком коротко","too_long":"слишком длинно"},
     topic={"crypto":"крипта","money":"деньги и энергия","world":"мир"}, loading="Загружаем…", err="Датчик сейчас не ответил.",
     status_h={"full":"Всё работает полностью","degraded":"Работает, часть отложена","stale":"Работает, часть данных устарела","down":"Часть отключена","partial":"Работает, не всё измерено"})),
 "de": dict(title="Hamilton-Sensor · Orb Studio", desc="Was bei Orb Studio vollständig läuft, was zugunsten des Wichtigsten zurückgestellt wurde und warum. Benannt nach Margaret Hamilton (1936–2026), Leiterin der Apollo-Bordsoftware.",
   eye="Orb Studio · Werkzeuge · Sensor", h1="Hamilton-Sensor",
   lead="Ein überlastetes System darf nicht abstürzen: Das Wichtigste läuft weiter, Nebensächliches wird zurückgestellt, und man sagt ehrlich, was zurückgestellt wurde. Dieser Sensor zeigt das für Orb Studio selbst, nach Wichtigkeit geordnet.",
   honour_h="Zu Ehren von Margaret Hamilton (1936–2026)",
   honour='Margaret Hamilton leitete am MIT das Team, das die Bordsoftware für Apollo schrieb. Bei der Landung von Apollo 11 war der Rechner überlastet; ihr System verwarf Nebenaufgaben, behielt die wichtigen und gab Alarm – die Landung wurde nicht abgebrochen. Sie prägte den Begriff „Software Engineering“ und widmete ihr Leben der Frage, wie man Fehler verhindert, bevor sie entstehen. Sie starb am 30. September 2026. <a href="{wiki}" rel="noopener">Artikel in der Wikipedia</a>.',
   note="Der Sensor ist nach ihr benannt; Orb Studio steht in keiner Verbindung zu Margaret Hamilton, ihrer Familie oder Hamilton Technologies.",
   now_h="Zustand jetzt", agents="Für Agenten: <code>GET /api/v1/hamilton</code> oder das MCP-Werkzeug <code>get_hamilton</code>. Kostenlos, ohne Schlüssel.",
   cfg=dict(upd="Aktualisiert", comp={"music":"Musik","voice":"Stimme","dj":"Davids Moderationen","sensor_news":"Sensor-Nachrichten","radar_news":"Radar-Nachrichten","regional":"Regionale Interviews","self_check":"Selbstprüfung"},
     state={"full":"✅ vollständig","degraded":"⚠️ vereinfacht","stale":"⏳ veraltet","down":"⛔ aus","unknown":"· keine Messung"},
     why={"track_missing":"Datei des Titels fehlt","voice_budget_low":"Tageslimit der Stimme fast erreicht – danach Untertitel","dj_unvoiced":"Stimme noch nicht erzeugt – kommt mit dem ersten Hörer","unit_not_in_words":"Einheit nicht ausgeschrieben – Meldung hat die Prüfung nicht bestanden","claude_no_answer":"Claude hat nicht geantwortet","number_not_in_sensor_lines":"Zahl stimmt nicht mit den Sensordaten überein","not_updated":"lange nicht aktualisiert","wrong_language":"falsche Sprache","too_short":"zu kurz","too_long":"zu lang"},
     topic={"crypto":"Krypto","money":"Geld und Energie","world":"Welt"}, loading="Wird geladen…", err="Der Sensor hat gerade nicht geantwortet.",
     status_h={"full":"Alles läuft vollständig","degraded":"Läuft, einiges zurückgestellt","stale":"Läuft, einige Daten veraltet","down":"Ein Teil ist aus","partial":"Läuft, nicht alles gemessen"})),
 "en": dict(title="Hamilton sensor · Orb Studio", desc="What in Orb Studio works fully, what was set aside to keep the main things running, and why. Named in honour of Margaret Hamilton (1936–2026), who led the Apollo flight software team.",
   eye="Orb Studio · tools · sensor", h1="Hamilton sensor",
   lead="An overloaded system must not crash: the most important work keeps running, the rest is set aside, and people are told honestly what was set aside. This sensor shows that for Orb Studio itself, in order of priority.",
   honour_h="In honour of Margaret Hamilton (1936–2026)",
   honour='Margaret Hamilton led the MIT team that wrote the onboard software for Apollo. During the Apollo 11 landing the computer was overloaded; her system dropped lower-priority tasks, kept the essential ones and raised an alarm, and the landing went ahead. She gave currency to the term “software engineering” and spent her life on preventing errors before they happen. She died on 30 September 2026. <a href="{wiki}" rel="noopener">Wikipedia article</a>.',
   note="The sensor is named in her honour; Orb Studio is not connected with Margaret Hamilton, her family or Hamilton Technologies.",
   now_h="State now", agents="For agents: <code>GET /api/v1/hamilton</code> or the MCP tool <code>get_hamilton</code>. Free, no key.",
   cfg=dict(upd="Updated", comp={"music":"Music","voice":"Voice","dj":"David's links","sensor_news":"Sensor news","radar_news":"Radar news","regional":"Regional interviews","self_check":"Self-check"},
     state={"full":"✅ full","degraded":"⚠️ simplified","stale":"⏳ stale","down":"⛔ off","unknown":"· no reading"},
     why={"track_missing":"track file missing","voice_budget_low":"daily voice limit nearly used — subtitles next","dj_unvoiced":"voice not made yet — comes with the first listener","unit_not_in_words":"unit not written in words — story failed the check","claude_no_answer":"Claude did not answer","number_not_in_sensor_lines":"a number did not match the sensor data","not_updated":"not updated for a long time","wrong_language":"wrong language","too_short":"too short","too_long":"too long"},
     topic={"crypto":"crypto","money":"money and energy","world":"world"}, loading="Loading…", err="The sensor did not answer just now.",
     status_h={"full":"Everything works fully","degraded":"Works, some parts set aside","stale":"Works, some data stale","down":"A part is off","partial":"Works, not everything measured"}))}),
 "mikrin": dict(render=MIKRIN_RENDER,
   wiki={"ru": "https://ru.wikipedia.org/wiki/%D0%9C%D0%B8%D0%BA%D1%80%D0%B8%D0%BD,_%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%90%D0%BD%D0%B0%D1%82%D0%BE%D0%BB%D1%8C%D0%B5%D0%B2%D0%B8%D1%87"},
   person={"@type": "Person", "name": "Evgeny Mikrin", "alternateName": "Евгений Анатольевич Микрин", "sameAs": ["https://ru.wikipedia.org/wiki/%D0%9C%D0%B8%D0%BA%D1%80%D0%B8%D0%BD,_%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%90%D0%BD%D0%B0%D1%82%D0%BE%D0%BB%D1%8C%D0%B5%D0%B2%D0%B8%D1%87"]},
   L={
 "ru": dict(title="Датчик Микрин · Orb Studio", desc="За сколько новость доходит от источника до эфира Orb Studio: от публикации до текста Давида и до голоса. Датчик назван в честь академика Евгения Микрина, сократившего полёт до МКС с двух суток до нескольких часов.",
   eye="Orb Studio · инструменты · датчик", h1="Датчик Микрин",
   lead="Чем короче путь, тем свежее новость. Датчик меряет, сколько времени новость идёт от публикации у источника до текста Давида и от текста до голоса, отдельно для каждого блока эфира.",
   honour_h="В честь академика Евгения Микрина",
   honour='Евгений Анатольевич Микрин — академик РАН, генеральный конструктор пилотируемых программ России. Его программы и системы управления позволили «Бурану» сесть полностью автоматически, он делал системы управления для модулей МКС, «Союзов» и «Прогрессов». Под его руководством полёт до МКС сократили с двух суток (около 30 витков) до нескольких часов (четыре витка): первым по короткой схеме в марте 2013 года долетел «Союз ТМА-08М», а в апреле 2020 года «Прогресс МС-14» дошёл до станции за 3 часа 20 минут. Умер в мае 2020 года, ему было 64. <a href="{wiki}" rel="noopener">Статья в Википедии</a>.',
   note="Датчик назван в его честь; Orb Studio не связана с Евгением Микриным, его семьёй или РКК «Энергия».",
   now_h="Путь новости сейчас", agents="Для агентов: <code>GET /api/v1/mikrin</code> или MCP-инструмент <code>get_mikrin</code>. Бесплатно, без ключа.",
   cfg=dict(comp={"radar_news":"Новости радаров","regional":"Интервью по регионам","studio":"Студия на двоих"}, s1="Источник → текст Давида", s2="Текст → голос", age="Самой свежей новости сейчас", range="от", timed="Новостей со временем публикации", upd="Текст написан",
     best="Самый короткий путь", nobest="Пока нет замеров: источники не дали время публикации", nodata="нет данных", notyet="голос ещё не создан", min="мин", h="ч", loading="Загружаем…", err="Датчик сейчас не ответил.")),
 "de": dict(title="Mikrin-Sensor · Orb Studio", desc="Wie lange eine Nachricht von der Quelle bis in die Sendung von Orb Studio braucht: von der Veröffentlichung bis zu Davids Text und bis zur Stimme. Benannt nach dem Akademiemitglied Jewgeni Mikrin, der den Flug zur ISS von zwei Tagen auf wenige Stunden verkürzte.",
   eye="Orb Studio · Werkzeuge · Sensor", h1="Mikrin-Sensor",
   lead="Je kürzer der Weg, desto frischer die Nachricht. Der Sensor misst, wie lange eine Nachricht von der Veröffentlichung bei der Quelle bis zu Davids Text und vom Text bis zur Stimme braucht – für jeden Teil der Sendung einzeln.",
   honour_h="Zu Ehren von Jewgeni Mikrin",
   honour='Jewgeni Anatoljewitsch Mikrin war Mitglied der Russischen Akademie der Wissenschaften und Generalkonstrukteur der bemannten Raumfahrtprogramme Russlands. Seine Software und Steuerung ließen die Raumfähre „Buran“ vollautomatisch landen; er entwickelte Steuersysteme für ISS-Module, Sojus- und Progress-Raumschiffe. Unter seiner Leitung wurde der Flug zur ISS von zwei Tagen (etwa 30 Erdumläufe) auf wenige Stunden (vier Umläufe) verkürzt: Als erste Besatzung flog im März 2013 Sojus TMA-08M nach dem kurzen Schema, im April 2020 erreichte Progress MS-14 die Station in 3 Stunden 20 Minuten. Er starb im Mai 2020 mit 64 Jahren. <a href="{wiki}" rel="noopener">Artikel in der Wikipedia (Russisch)</a>.',
   note="Der Sensor ist nach ihm benannt; Orb Studio steht in keiner Verbindung zu Jewgeni Mikrin, seiner Familie oder RKK Energija.",
   now_h="Weg der Nachricht jetzt", agents="Für Agenten: <code>GET /api/v1/mikrin</code> oder das MCP-Werkzeug <code>get_mikrin</code>. Kostenlos, ohne Schlüssel.",
   cfg=dict(comp={"radar_news":"Radar-Nachrichten","regional":"Regionale Interviews","studio":"Studio zu zweit"}, s1="Quelle → Davids Text", s2="Text → Stimme", age="Die frischeste Nachricht ist jetzt", range="von", timed="Nachrichten mit Veröffentlichungszeit", upd="Text geschrieben",
     best="Kürzester Weg", nobest="Noch keine Messung: die Quellen nannten keine Veröffentlichungszeit", nodata="keine Daten", notyet="Stimme noch nicht erzeugt", min="Min.", h="Std.", loading="Wird geladen…", err="Der Sensor hat gerade nicht geantwortet.")),
 "en": dict(title="Mikrin sensor · Orb Studio", desc="How long a news story travels from its source to the Orb Studio broadcast: from publication to David's text and to the voice. Named in honour of academician Evgeny Mikrin, who cut the flight to the ISS from two days to a few hours.",
   eye="Orb Studio · tools · sensor", h1="Mikrin sensor",
   lead="The shorter the path, the fresher the news. The sensor measures how long a story travels from publication at its source to David's text and from the text to the voice, for each part of the broadcast separately.",
   honour_h="In honour of Evgeny Mikrin",
   honour='Evgeny Anatolyevich Mikrin was a member of the Russian Academy of Sciences and General Designer of Russia’s crewed space programmes. His software and control system let the Buran shuttle land fully automatically, and he built control systems for ISS modules and the Soyuz and Progress ships. Under his leadership the flight to the ISS was cut from about two days (around 30 orbits) to a few hours (four orbits): Soyuz TMA-08M was the first crew on the short scheme in March 2013, and in April 2020 Progress MS-14 reached the station in 3 hours 20 minutes. He died in May 2020, aged 64. <a href="{wiki}" rel="noopener">Wikipedia article (in Russian)</a>.',
   note="The sensor is named in his honour; Orb Studio is not connected with Evgeny Mikrin, his family or RSC Energia.",
   now_h="Path of the news now", agents="For agents: <code>GET /api/v1/mikrin</code> or the MCP tool <code>get_mikrin</code>. Free, no key.",
   cfg=dict(comp={"radar_news":"Radar news","regional":"Regional interviews","studio":"Two-seat studio"}, s1="Source → David's text", s2="Text → voice", age="The freshest story is now", range="from", timed="Stories with a publication time", upd="Text written",
     best="Shortest path", nobest="No measurement yet: the sources gave no publication time", nodata="no data", notyet="voice not made yet", min="min", h="h", loading="Loading…", err="The sensor did not answer just now."))}),
 "polyak": dict(render=POLYAK_RENDER,
   wiki={"ru": "https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BB%D1%8F%D0%BA,_%D0%91%D0%BE%D1%80%D0%B8%D1%81_%D0%A2%D0%B5%D0%BE%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D0%B8%D1%87"},
   person={"@type": "Person", "name": "Boris Polyak", "alternateName": "Борис Теодорович Поляк", "birthDate": "1935-05-04", "deathDate": "2023-02-03", "sameAs": ["https://ru.wikipedia.org/wiki/%D0%9F%D0%BE%D0%BB%D1%8F%D0%BA,_%D0%91%D0%BE%D1%80%D0%B8%D1%81_%D0%A2%D0%B5%D0%BE%D0%B4%D0%BE%D1%80%D0%BE%D0%B2%D0%B8%D1%87", "https://www.ipu.ru/en/node/74437"]},
   L={
 "ru": dict(title="Датчик Поляк · Orb Studio", desc="Разовый скачок или устойчивый сдвиг: датчик разводит их для индексов Orb Studio по прошлым значениям, без прогнозов. Назван в честь математика Бориса Поляка (1935–2023), автора метода тяжёлого шарика и усреднения Поляка — Юдицкого.",
   eye="Orb Studio · инструменты · датчик", h1="Датчик Поляк",
   lead="Одно резкое значение — ещё не перемена. Датчик сравнивает последнее значение каждого индекса со средним за сутки и со средним за последние три часа и говорит одним словом: спокойно, разовый скачок или устойчивый сдвиг. Только прошлые замеры, никаких прогнозов.",
   honour_h="В честь Бориса Теодоровича Поляка (1935–2023)",
   honour='Борис Теодорович Поляк — математик, профессор МФТИ, главный научный сотрудник Института проблем управления РАН, с 1997 по 2013 год руководил лабораторией адаптивных и робастных систем. Его метод тяжёлого шарика учитывает инерцию прошлых шагов, и из него выросли «импульсные» методы, которыми сегодня обучают нейросети. Его усреднение (Поляка — Юдицкого) делает оценку в шуме устойчивой, а его именем названы также шаг Поляка и условие Поляка — Лоясиевича. Шесть монографий, более 400 статей и докладов, Золотая медаль EURO (2012), премия Хачияна INFORMS (2021). <a href="{wiki}" rel="noopener">Статья в Википедии</a>.',
   note="Датчик назван в его честь; Orb Studio не связана с Борисом Поляком, его семьёй или Институтом проблем управления РАН.",
   now_h="Индексы сейчас", agents="Для агентов: <code>GET /api/v1/polyak</code> или MCP-инструмент <code>get_polyak</code>. Бесплатно, без ключа.",
   cfg=dict(comp={"hallucination":"Индекс галлюцинаций мира","consensus":"Барометр «Ты абсолютно прав!»","token_hunger":"Токеновый голод","geo_radar":"Гео-радар"}, verdict={"calm":"спокойно","jump":"разовый скачок","shift":"устойчивый сдвиг","unknown":"мало данных"},
     last="сейчас", avg="среднее за сутки", avg3="за 3 часа", inertia="инерция за 6 ч", thr="порог шума", few="замеров за сутки", readings="Замеров за сутки", some="Заметное движение у индексов: {n}", allcalm="Все индексы спокойны", nodata="нет данных", loading="Загружаем…", err="Датчик сейчас не ответил.")),
 "de": dict(title="Poljak-Sensor · Orb Studio", desc="Einmaliger Sprung oder anhaltende Verschiebung: Der Sensor unterscheidet das für die Indizes von Orb Studio anhand vergangener Werte, ohne Prognosen. Benannt nach dem Mathematiker Boris Poljak (1935–2023), Urheber der Heavy-Ball-Methode und der Poljak-Juditsky-Mittelung.",
   eye="Orb Studio · Werkzeuge · Sensor", h1="Poljak-Sensor",
   lead="Ein einzelner Ausreißer ist noch keine Veränderung. Der Sensor vergleicht den letzten Wert jedes Index mit dem Tagesmittel und dem Mittel der letzten drei Stunden und sagt es in einem Wort: ruhig, einmaliger Sprung oder anhaltende Verschiebung. Nur vergangene Messwerte, keine Prognosen.",
   honour_h="Zu Ehren von Boris Poljak (1935–2023)",
   honour='Boris Teodorowitsch Poljak war Mathematiker, Professor am Moskauer Institut für Physik und Technologie und leitender Wissenschaftler am Institut für Steuerungswissenschaften der Russischen Akademie der Wissenschaften; von 1997 bis 2013 leitete er das Labor für adaptive und robuste Systeme. Seine Heavy-Ball-Methode berücksichtigt den Schwung früherer Schritte – aus ihr gingen die Momentum-Verfahren hervor, mit denen heute neuronale Netze trainiert werden. Seine Mittelung (Poljak–Juditsky) macht Schätzungen im Rauschen stabil; nach ihm sind auch die Poljak-Schrittweite und die Poljak-Łojasiewicz-Bedingung benannt. Sechs Monografien, über 400 Artikel und Vorträge, EURO-Goldmedaille (2012), Khachiyan-Preis von INFORMS (2021). <a href="{wiki}" rel="noopener">Artikel in der Wikipedia (Russisch)</a>.',
   note="Der Sensor ist nach ihm benannt; Orb Studio steht in keiner Verbindung zu Boris Poljak, seiner Familie oder dem Institut für Steuerungswissenschaften.",
   now_h="Indizes jetzt", agents="Für Agenten: <code>GET /api/v1/polyak</code> oder das MCP-Werkzeug <code>get_polyak</code>. Kostenlos, ohne Schlüssel.",
   cfg=dict(comp={"hallucination":"Welt-Halluzinationsindex","consensus":"Barometer „Du hast absolut recht!“","token_hunger":"Token-Hunger","geo_radar":"Geo-Radar"}, verdict={"calm":"ruhig","jump":"einmaliger Sprung","shift":"anhaltende Verschiebung","unknown":"zu wenig Daten"},
     last="jetzt", avg="Tagesmittel", avg3="3 Stunden", inertia="Schwung pro 6 Std.", thr="Rauschschwelle", few="Messwerte in 24 Std.", readings="Messwerte in 24 Std.", some="Merkliche Bewegung bei Indizes: {n}", allcalm="Alle Indizes ruhig", nodata="keine Daten", loading="Wird geladen…", err="Der Sensor hat gerade nicht geantwortet.")),
 "en": dict(title="Polyak sensor · Orb Studio", desc="A one-off jump or a sustained shift: the sensor tells them apart for the Orb Studio indices from past readings, with no forecasts. Named in honour of mathematician Boris Polyak (1935–2023), author of the heavy-ball method and Polyak–Juditsky averaging.",
   eye="Orb Studio · tools · sensor", h1="Polyak sensor",
   lead="One sharp reading is not yet a change. The sensor compares the last reading of each index with the 24-hour average and with the average of the last three hours, and says it in one word: calm, one-off jump or sustained shift. Past readings only, no forecasts.",
   honour_h="In honour of Boris Polyak (1935–2023)",
   honour='Boris Teodorovich Polyak was a mathematician, professor at the Moscow Institute of Physics and Technology and chief researcher at the Institute of Control Sciences of the Russian Academy of Sciences, where he headed the Laboratory of Adaptive and Robust Systems from 1997 to 2013. His heavy-ball method keeps the inertia of past steps; the momentum methods used to train neural networks today grew out of it. His averaging (Polyak–Juditsky) makes estimates under noise stable, and the Polyak step size and the Polyak–Łojasiewicz condition also carry his name. Six monographs, over 400 papers and talks, the EURO Gold Medal (2012) and the INFORMS Khachiyan Prize (2021). <a href="{wiki}" rel="noopener">Wikipedia article (in Russian)</a>.',
   note="The sensor is named in his honour; Orb Studio is not connected with Boris Polyak, his family or the Institute of Control Sciences.",
   now_h="Indices now", agents="For agents: <code>GET /api/v1/polyak</code> or the MCP tool <code>get_polyak</code>. Free, no key.",
   cfg=dict(comp={"hallucination":"World Hallucination Index","consensus":"You're Absolutely Right Barometer","token_hunger":"Token Hunger Index","geo_radar":"Geo radar"}, verdict={"calm":"calm","jump":"one-off jump","shift":"sustained shift","unknown":"too few readings"},
     last="now", avg="24-hour average", avg3="last 3 hours", inertia="inertia per 6 h", thr="noise threshold", few="readings in 24 h", readings="Readings in 24 h", some="Noticeable movement in indices: {n}", allcalm="All indices calm", nodata="no data", loading="Loading…", err="The sensor did not answer just now."))}),
}
if __name__ == "__main__":
    for sid, S in SENSORS.items():
        for lg, c in S["L"].items():
            cfg = dict(c["cfg"], loc=LOC[lg]); wiki = S["wiki"].get(lg) or S["wiki"]["ru"]
            out = ("public/" if lg == "ru" else "public/" + lg + "/") + "tools/" + sid + ".html"
            open(out, "w").write(page(sid, lg, c, wiki, S["render"], cfg, S["person"])); print(out)
