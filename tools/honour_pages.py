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
    <p><a href="{("" if lg == "ru" else "/" + lg)}/tools/scientists">{H.escape(PORTAL[lg]["all"])} →</a></p>
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
PORTAL = {
 "ru": dict(title="Датчики в честь учёных · Orb Studio", h1="Датчики в честь учёных", eye="Orb Studio · инструменты · портал", all="Все датчики в честь учёных",
   desc="Математика, знания, импульс: каждый датчик Orb Studio берёт одну идею учёного и применяет её к живым данным. Бесплатно для людей и любых ИИ-агентов: API, MCP, страницы на трёх языках.",
   lead="Математика, знания, импульс. Каждый датчик берёт одну идею учёного и применяет её к живым данным Orb Studio — так их труды продолжают работать. Датчиками бесплатно пользуются люди и любые ИИ-агенты, без ключа.",
   rule="Правило портала: датчик делаем, только если в проверке не нашлось инструмента с той же сутью. Похожие инструменты называем открыто, слово «уникальный» не пишем.",
   idea="Идея", does="Датчик", similar="Похожие инструменты", diff="Отличие", checked="проверено", open="Открыть датчик", wiki="Википедия", now="Сейчас",
   connect_h="Как подключить агента", connect='MCP-сервер: <code>https://orbstudio.org/mcp</code> (инструменты <code>list_scientist_sensors</code>, <code>get_hamilton</code>, <code>get_mikrin</code>, <code>get_polyak</code>, <code>get_park</code>). Список датчиков в JSON: <code>GET /api/v1/scientists</code>. Бесплатно, без ключа.',
   live={"hamilton_ok":"всё работает полностью","hamilton_set":"отложено: {x}","mikrin":"самый короткий путь — {x}","mikrin_none":"замеров пока нет","polyak_calm":"все индексы спокойны","polyak_move":"заметное движение: {x}","park":"проверено заголовков: {n}, с признаками: {m}"}),
 "de": dict(title="Sensoren zu Ehren von Wissenschaftlern · Orb Studio", h1="Sensoren zu Ehren von Wissenschaftlern", eye="Orb Studio · Werkzeuge · Portal", all="Alle Sensoren zu Ehren von Wissenschaftlern",
   desc="Mathematik, Wissen, Impuls: Jeder Sensor von Orb Studio nimmt eine Idee einer Wissenschaftlerin oder eines Wissenschaftlers und wendet sie auf Live-Daten an. Kostenlos für Menschen und alle KI-Agenten: API, MCP, Seiten in drei Sprachen.",
   lead="Mathematik, Wissen, Impuls. Jeder Sensor nimmt eine Idee einer Wissenschaftlerin oder eines Wissenschaftlers und wendet sie auf die Live-Daten von Orb Studio an – so arbeitet ihr Werk weiter. Menschen und alle KI-Agenten nutzen die Sensoren kostenlos, ohne Schlüssel.",
   rule="Regel des Portals: Ein Sensor entsteht nur, wenn eine Prüfung kein Werkzeug mit demselben Kern findet. Ähnliche Werkzeuge nennen wir offen, das Wort „einzigartig“ verwenden wir nicht.",
   idea="Idee", does="Sensor", similar="Ähnliche Werkzeuge", diff="Unterschied", checked="geprüft", open="Sensor öffnen", wiki="Wikipedia", now="Jetzt",
   connect_h="So verbinden Sie einen Agenten", connect='MCP-Server: <code>https://orbstudio.org/mcp</code> (Werkzeuge <code>list_scientist_sensors</code>, <code>get_hamilton</code>, <code>get_mikrin</code>, <code>get_polyak</code>, <code>get_park</code>). Liste der Sensoren als JSON: <code>GET /api/v1/scientists</code>. Kostenlos, ohne Schlüssel.',
   live={"hamilton_ok":"alles läuft vollständig","hamilton_set":"zurückgestellt: {x}","mikrin":"kürzester Weg – {x}","mikrin_none":"noch keine Messung","polyak_calm":"alle Indizes ruhig","polyak_move":"merkliche Bewegung: {x}","park":"geprüfte Schlagzeilen: {n}, mit Warnzeichen: {m}"}),
 "en": dict(title="Sensors in honour of scientists · Orb Studio", h1="Sensors in honour of scientists", eye="Orb Studio · tools · portal", all="All sensors in honour of scientists",
   desc="Mathematics, knowledge, momentum: each Orb Studio sensor takes one idea of a scientist and applies it to live data. Free for people and any AI agent: API, MCP, pages in three languages.",
   lead="Mathematics, knowledge, momentum. Each sensor takes one idea of a scientist and applies it to the live data of Orb Studio, so their work keeps working. People and any AI agent use the sensors for free, with no key.",
   rule="Rule of the portal: a sensor is made only when a check finds no tool with the same essence. Similar tools are named openly; the word “unique” is not used.",
   idea="Idea", does="Sensor", similar="Similar tools", diff="Difference", checked="checked", open="Open the sensor", wiki="Wikipedia", now="Now",
   connect_h="How to connect an agent", connect='MCP server: <code>https://orbstudio.org/mcp</code> (tools <code>list_scientist_sensors</code>, <code>get_hamilton</code>, <code>get_mikrin</code>, <code>get_polyak</code>, <code>get_park</code>). List of sensors as JSON: <code>GET /api/v1/scientists</code>. Free, no key.',
   live={"hamilton_ok":"everything works fully","hamilton_set":"set aside: {x}","mikrin":"shortest path – {x}","mikrin_none":"no measurement yet","polyak_calm":"all indices calm","polyak_move":"noticeable movement: {x}","park":"headlines checked: {n}, with signs: {m}"}),
}
PORTAL_ITEMS = {
 "hamilton": {"ru": ("Маргарет Гамильтон (1936–2026), программная инженерия", "При перегрузке держать главное, откладывать второстепенное и говорить, что отложено.", "MCP-проверки статуса сервисов (StatusGator, API Status Check, OutageDeck)", "описывает только Orb Studio и говорит, что отложено и почему, а не просто «работает / упал»", "что в Orb Studio работает полностью, что отложено ради главного и почему"),
              "de": ("Margaret Hamilton (1936–2026), Software Engineering", "Bei Überlastung das Wichtigste weiterlaufen lassen, Nebensächliches zurückstellen und sagen, was zurückgestellt wurde.", "Statusprüfungen von Diensten für Agenten (StatusGator, API Status Check, OutageDeck)", "beschreibt nur Orb Studio und sagt, was zurückgestellt wurde und warum – nicht nur „läuft / ausgefallen“", "was bei Orb Studio vollständig läuft, was zugunsten des Wichtigsten zurückgestellt wurde und warum"),
              "en": ("Margaret Hamilton (1936–2026), software engineering", "Under overload keep the main work running, set the rest aside and say what was set aside.", "service status checks for agents (StatusGator, API Status Check, OutageDeck)", "describes only Orb Studio and says what was set aside and why, not just up/down", "what in Orb Studio works fully, what was set aside to keep the main things running, and why")},
 "mikrin": {"ru": ("Евгений Микрин (умер в 2020), управление космическими кораблями", "Сократить путь: до МКС не за двое суток, а за несколько часов.", "задержка доставки в коммерческих новостных API (Webz.io, Opoint)", "путь новости внутри эфира Orb Studio по шагам, до синтезированного голоса", "за сколько новость доходит от источника до текста Давида и до голоса"),
            "de": ("Jewgeni Mikrin (gest. 2020), Steuerung von Raumschiffen", "Den Weg verkürzen: zur ISS nicht in zwei Tagen, sondern in wenigen Stunden.", "Zustellverzögerung kommerzieller Nachrichten-APIs (Webz.io, Opoint)", "der Weg einer Nachricht in der Sendung von Orb Studio, Schritt für Schritt bis zur synthetischen Stimme", "wie lange eine Nachricht von der Quelle bis zu Davids Text und bis zur Stimme braucht"),
            "en": ("Evgeny Mikrin (died 2020), spacecraft control", "Shorten the path: to the ISS in a few hours instead of two days.", "delivery latency of commercial news APIs (Webz.io, Opoint)", "the path of a story inside the Orb Studio broadcast, step by step, up to the synthetic voice", "how long a story travels from its source to David's text and to the voice")},
 "polyak": {"ru": ("Борис Поляк (1935–2023), оптимизация", "Инерция прошлых шагов (тяжёлый шарик) и усреднение в шуме (Поляка — Юдицкого).", "скользящие средние и поиск аномалий вообще", "для индексов Orb Studio и с ответом одним словом: спокойно, скачок или сдвиг", "разовый скачок или устойчивый сдвиг индексов Orb Studio, только по прошлым значениям"),
            "de": ("Boris Poljak (1935–2023), Optimierung", "Schwung früherer Schritte (Heavy Ball) und Mittelung im Rauschen (Poljak–Juditsky).", "gleitende Durchschnitte und Anomalieerkennung allgemein", "für die Indizes von Orb Studio, mit einer Antwort in einem Wort: ruhig, Sprung oder Verschiebung", "einmaliger Sprung oder anhaltende Verschiebung der Orb-Studio-Indizes, nur aus vergangenen Werten"),
            "en": ("Boris Polyak (1935–2023), optimization", "Inertia of past steps (heavy ball) and averaging under noise (Polyak–Juditsky).", "moving averages and anomaly detection in general", "applied to the Orb Studio indices with a one-word answer: calm, jump or shift", "a one-off jump or a sustained shift in the Orb Studio indices, from past readings only")},
}
PORTAL_RENDER = """if(!d||!Array.isArray(d.sensors))return;for(const s of d.sensors){const el=document.querySelector('[data-now="'+s.id+'"]');if(!el||!s.now)continue;let t="";
  if(s.id==="hamilton")t=s.now.set_aside&&s.now.set_aside.length?P.live.hamilton_set.replace("{x}",s.now.set_aside.map((x)=>P.names[x]||x).join(", ")):P.live.hamilton_ok;
  else if(s.id==="mikrin")t=s.now.minutes!=null?P.live.mikrin.replace("{x}",s.now.minutes+" "+P.min):P.live.mikrin_none;
  else if(s.id==="park")t=P.live.park.replace("{n}",s.now.checked).replace("{m}",s.now.with_signs);
  else if(s.id==="polyak")t=s.now.moving&&s.now.moving.length?P.live.polyak_move.replace("{x}",s.now.moving.map((m)=>(P.names[m.id]||m.id)+" "+(m.direction==="up"?"↑":"↓")).join(", ")):P.live.polyak_calm;
  el.textContent=P.now+": "+t;}"""
def portal(lg):
    P = PORTAL[lg]; s = open(TPL[lg]).read(); head = s[:s.index('<div class="wrap">')]; pre = "" if lg == "ru" else "/" + lg; path = pre + "/tools/scientists"
    head = re.sub(r'<title>.*?</title>', '<title>' + H.escape(P["title"]) + '</title>', head, count=1, flags=re.S)
    for prop, val in [("name=\"description\"", P["desc"]), ("property=\"og:description\"", P["desc"]), ("property=\"og:title\"", P["title"]), ("property=\"og:url\"", "https://orbstudio.org" + path)]:
        head = re.sub(r'(<meta ' + re.escape(prop) + r' content=")[^"]*(")', lambda m: m.group(1) + H.escape(val) + m.group(2), head, count=1)
    head = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + "https://orbstudio.org" + path + m.group(2), head, count=1)
    head = re.sub(r'href="/(ru|de|en)/tools(?:/[a-z-]+)?"', lambda m: 'href="/' + m.group(1) + '/tools/scientists"', head)
    head = re.sub(r'<link rel="alternate" hreflang[^>]*>\s*', '', head)
    alt = "".join('<link rel="alternate" hreflang="%s" href="https://orbstudio.org/%s/tools/scientists">\n' % (l, l) for l in ("ru", "de", "en")) + '<link rel="alternate" hreflang="x-default" href="https://orbstudio.org/tools/scientists">\n'
    items = []
    for i, (sid, S) in enumerate(SENSORS.items()):
        items.append({"@type": "ListItem", "position": i + 1, "item": {"@type": "Dataset", "name": S["L"][lg]["h1"], "description": S["L"][lg]["desc"], "url": "https://orbstudio.org" + pre + "/tools/" + sid, "isAccessibleForFree": True, "about": S["person"],
          "distribution": {"@type": "DataDownload", "encodingFormat": "application/json", "contentUrl": "https://orbstudio.org/api/v1/" + sid}}})
    ld = {"@context": "https://schema.org", "@type": "CollectionPage", "name": P["title"], "description": P["desc"], "url": "https://orbstudio.org" + path, "inLanguage": lg, "isPartOf": {"@type": "WebSite", "name": "Orb Studio", "url": "https://orbstudio.org/"},
          "mainEntity": {"@type": "ItemList", "itemListElement": items}}
    head = head.replace('</head>', alt + '<meta property="og:locale" content="' + OG_LOCALE[lg] + '">\n<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + '</script>\n<style>' + CSS + '.sci{display:grid;gap:.9rem}.sci .card p{margin:.35rem 0}.sci .who{opacity:.8;font-size:.92rem}.sci .now{font-size:.9rem;opacity:.85}.sci small{opacity:.7}</style>\n</head>', 1)
    cards = []
    for sid, S in SENSORS.items():
        c = S["L"][lg]; who, idea, sim, diff, does = PORTAL_ITEMS[sid][lg]; wiki = S["wiki"].get(lg) or S["wiki"]["ru"]
        cards.append('    <div class="card"><h3>get_%s</h3><p><b>%s</b></p><p class="who">%s</p>\n      <p><b>%s:</b> %s</p><p><b>%s:</b> %s.</p>\n      <p><small>%s: %s. %s: %s (%s 22.11.2026).</small></p>\n      <p class="now" data-now="%s"></p>\n      <p><a href="%s/tools/%s">%s</a> · <a href="%s" rel="noopener">%s</a> · <code>/api/v1/%s</code></p></div>' % (
            sid, H.escape(c["h1"]), H.escape(who), H.escape(P["idea"]), H.escape(idea), H.escape(P["does"]), H.escape(does[:1].upper() + does[1:]),
            H.escape(P["similar"]), H.escape(sim), H.escape(P["diff"]), H.escape(diff), H.escape(P["checked"]), sid, pre, sid, H.escape(P["open"]), wiki, H.escape(P["wiki"]), sid))
    st = STRIP[lg]
    body = ('<div class="wrap">\n  <div>\n    <div class="eyebrow">' + H.escape(P["eye"]) + '</div>\n    <h1>' + H.escape(P["h1"]) + '</h1>\n    <p class="lead">' + H.escape(P["lead"]) + '</p>\n    <p><small>' + H.escape(P["rule"]) + '</small></p>\n  </div>\n'
      '  <section class="panel sci">\n' + "\n".join(cards) + '\n  </section>\n  <section class="panel">\n    <h2>' + H.escape(P["connect_h"]) + '</h2>\n    <p>' + P["connect"] + '</p>\n  </section>\n'
      '  <aside class="pstrip" aria-label="' + H.escape(st[0]) + '"><small>' + H.escape(st[0]) + ' · ' + H.escape(st[3]) + '</small><a href="/go/kraken?from=scientists" target="_blank" rel="sponsored noopener">' + H.escape(st[1]) + ' ↗</a><a href="/go/starlink?from=scientists" target="_blank" rel="sponsored noopener">' + H.escape(st[2]) + ' ↗</a></aside>\n</div>\n'
      '<script>\nconst P=' + json.dumps({"live": P["live"], "now": P["now"], "min": SENSORS["mikrin"]["L"][lg]["cfg"]["min"], "names": {**SENSORS["hamilton"]["L"][lg]["cfg"]["comp"], **SENSORS["polyak"]["L"][lg]["cfg"]["comp"]}}, ensure_ascii=False) + ';\nfetch("/api/v1/scientists",{headers:{accept:"application/json"}}).then((r)=>r.ok?r.json():null).then((d)=>{' + PORTAL_RENDER + '}).catch(()=>{});\n</script>\n'
      '<script type="module" src="/share-x.js"></script>\n<script src="/backnav.js" defer></script>\n</body>\n</html>\n')
    return head + body

PARK_RENDER = """if(!d||typeof d.headlines_checked!=="number"){document.getElementById("hmStatus").textContent=HM.err;return;}
  if(!d.headlines_checked){document.getElementById("hmStatus").textContent=HM.wait;return;}
  document.getElementById("hmStatus").textContent=HM.sum.replace("{n}",d.headlines_checked).replace("{m}",d.headlines_with_signs)+(d.stale?" · "+HM.stale:"");
  const signs=Object.keys(HM.sign).map((id,i)=>{const n=d.by_sign[id];return "<li><span class=\\"n\\">"+(i+1)+"</span><b>"+esc(HM.sign[id])+"</b><span class=\\"s\\">"+(n==null?esc(HM.invisible):n)+"</span></li>";}).join("");
  const fl=(d.flagged||[]).map((f)=>"<li><span class=\\"n\\">!</span><b>"+(f.link?"<a href=\\""+esc(f.link)+"\\" rel=\\"noopener nofollow\\">"+esc(f.headline)+"</a>":esc(f.headline))+"</b><span class=\\"s\\"></span><span class=\\"w\\">"+esc(f.signs.map((s)=>HM.sign[s]||s).join(", "))+" — «"+esc(f.quote)+"»</span><span class=\\"u\\">"+esc(f.source||"")+" · "+esc(tm(f.published_at))+"</span></li>").join("");
  document.getElementById("hmRows").innerHTML=signs+(fl?"<li class=\\"w\\" style=\\"display:block;border:0;padding-top:1rem\\"><b>"+esc(HM.flagged)+"</b></li>"+fl:"<li style=\\"display:block\\"><small>"+esc(HM.noflags)+"</small></li>")+"<li style=\\"display:block;border:0\\"><small>"+esc(HM.upd)+": "+esc(tm(d.generated_at))+"</small></li>";"""
SENSORS["park"] = dict(render=PARK_RENDER,
   wiki={"ru": "https://ru.wikipedia.org/wiki/%D0%9F%D0%B0%D1%80%D0%BA,_%D0%A0%D0%BE%D0%B1%D0%B5%D1%80%D1%82_%D0%9B%D0%B8", "en": "https://en.wikipedia.org/wiki/Robert_L._Park"},
   person={"@type": "Person", "name": "Robert L. Park", "sameAs": ["https://en.wikipedia.org/wiki/Robert_L._Park", "https://ru.wikipedia.org/wiki/%D0%9F%D0%B0%D1%80%D0%BA,_%D0%A0%D0%BE%D0%B1%D0%B5%D1%80%D1%82_%D0%9B%D0%B8"]},
   L={
 "ru": dict(title="Датчик Парк · Orb Studio", desc="Признаки лженауки в сегодняшних научных заголовках — с точной цитатой слов из заголовка. Датчик назван в честь физика Роберта Парка (1931–2020), автора «Семи признаков лженауки».",
   eye="Orb Studio · инструменты · датчик", h1="Датчик Парк",
   lead="Раз в 6 часов Claude просматривает научные и медицинские заголовки и отмечает только те признаки лженауки, которые видны в самом заголовке, с точной цитатой. Отметка — повод проверить новость перед пересказом, а не приговор ей.",
   honour_h="В честь Роберта Л. Парка (1931–2020)",
   honour='Роберт Ли Парк — американский физик, профессор Мэрилендского университета, много лет возглавлял вашингтонское бюро Американского физического общества и вёл еженедельную колонку «What’s New». Его книга «Вуду-наука» (2000) рассказывает, как люди обманываются и обманывают именем науки. В 2003 году он описал семь признаков лженауки: открытие объявляют сразу прессе; «учёные мужи его замалчивают»; эффект на грани обнаружения; доказательства — отдельные случаи; «знание древних»; автор работал в одиночку; нужен новый закон природы. <a href="{wiki}" rel="noopener">Статья в Википедии</a>.',
   note="Датчик назван в его честь; Orb Studio не связана с Робертом Парком, его семьёй, Мэрилендским университетом или Американским физическим обществом.",
   now_h="Заголовки сейчас", agents="Для агентов: <code>GET /api/v1/park</code> или MCP-инструмент <code>get_park</code>. Бесплатно, без ключа.",
   cfg=dict(sign={"media_first":"Сразу прессе, минуя коллег","suppressed":"«Учёные замалчивают»","limit_of_detection":"Эффект на грани обнаружения","anecdotal":"Доказательства — отдельные случаи","ancient":"«Знание древних»","lone_genius":"Одиночка против науки","new_law":"Нужен новый закон природы"},
     sum="Проверено заголовков: {n} · с признаками: {m}", stale="выпуск давно не обновлялся", invisible="не видно по заголовку", flagged="Заголовки с признаками", noflags="Сейчас ни в одном заголовке признаков не видно.", upd="Проверено", wait="Первая проверка ещё не прошла: датчик проверяет заголовки раз в 6 часов.", loading="Загружаем…", err="Датчик сейчас не ответил.")),
 "de": dict(title="Park-Sensor · Orb Studio", desc="Warnzeichen für Pseudowissenschaft in den heutigen Wissenschaftsschlagzeilen – mit wörtlichem Zitat aus der Schlagzeile. Benannt nach dem Physiker Robert Park (1931–2020), Autor der „Sieben Warnzeichen für Pseudowissenschaft“.",
   eye="Orb Studio · Werkzeuge · Sensor", h1="Park-Sensor",
   lead="Alle 6 Stunden liest Claude Wissenschafts- und Gesundheitsschlagzeilen und markiert nur die Warnzeichen für Pseudowissenschaft, die in der Schlagzeile selbst zu sehen sind – mit wörtlichem Zitat. Eine Markierung ist ein Grund, die Meldung vor dem Weitererzählen zu prüfen, kein Urteil.",
   honour_h="Zu Ehren von Robert L. Park (1931–2020)",
   honour='Robert Lee Park war ein US-amerikanischer Physiker, Professor an der University of Maryland, leitete viele Jahre das Washingtoner Büro der American Physical Society und schrieb die wöchentliche Kolumne „What’s New“. Sein Buch „Voodoo Science“ (2000) zeigt, wie man sich im Namen der Wissenschaft täuscht und getäuscht wird. 2003 beschrieb er sieben Warnzeichen für Pseudowissenschaft: direkt an die Presse; „das Establishment unterdrückt es“; Effekt an der Nachweisgrenze; Belege sind Einzelfälle; „altes Wissen“; Einzelgänger; ein neues Naturgesetz ist nötig. <a href="{wiki}" rel="noopener">Artikel in der Wikipedia (Englisch)</a>.',
   note="Der Sensor ist nach ihm benannt; Orb Studio steht in keiner Verbindung zu Robert Park, seiner Familie, der University of Maryland oder der American Physical Society.",
   now_h="Schlagzeilen jetzt", agents="Für Agenten: <code>GET /api/v1/park</code> oder das MCP-Werkzeug <code>get_park</code>. Kostenlos, ohne Schlüssel.",
   cfg=dict(sign={"media_first":"Direkt an die Presse","suppressed":"„Wird unterdrückt“","limit_of_detection":"Effekt an der Nachweisgrenze","anecdotal":"Belege sind Einzelfälle","ancient":"„Altes Wissen“","lone_genius":"Einzelgänger gegen die Wissenschaft","new_law":"Neues Naturgesetz nötig"},
     sum="Geprüfte Schlagzeilen: {n} · mit Warnzeichen: {m}", stale="Ausgabe lange nicht aktualisiert", invisible="aus der Schlagzeile nicht erkennbar", flagged="Schlagzeilen mit Warnzeichen", noflags="Derzeit zeigt keine Schlagzeile ein Warnzeichen.", upd="Geprüft", wait="Die erste Prüfung steht noch aus: der Sensor prüft alle 6 Stunden.", loading="Wird geladen…", err="Der Sensor hat gerade nicht geantwortet.")),
 "en": dict(title="Park sensor · Orb Studio", desc="Warning signs of bogus science in today’s science headlines – with the exact words quoted from the headline. Named in honour of physicist Robert Park (1931–2020), author of “The seven warning signs of bogus science”.",
   eye="Orb Studio · tools · sensor", h1="Park sensor",
   lead="Every 6 hours Claude reads science and health headlines and marks only the warning signs of bogus science that are visible in the headline itself, with the exact quote. A flag is a reason to check a story before retelling it, not a verdict.",
   honour_h="In honour of Robert L. Park (1931–2020)",
   honour='Robert Lee Park was an American physicist, professor at the University of Maryland, for many years head of the Washington office of the American Physical Society and author of the weekly column “What’s New”. His book “Voodoo Science” (2000) shows how people fool themselves and others in the name of science. In 2003 he described seven warning signs of bogus science: pitched straight to the media; a powerful establishment is said to suppress it; the effect is at the limit of detection; the evidence is anecdotal; it is credible because it is ancient; the discoverer worked in isolation; it needs a new law of nature. <a href="{wiki}" rel="noopener">Wikipedia article</a>.',
   note="The sensor is named in his honour; Orb Studio is not connected with Robert Park, his family, the University of Maryland or the American Physical Society.",
   now_h="Headlines now", agents="For agents: <code>GET /api/v1/park</code> or the MCP tool <code>get_park</code>. Free, no key.",
   cfg=dict(sign={"media_first":"Pitched straight to the media","suppressed":"“Suppressed by the establishment”","limit_of_detection":"Effect at the limit of detection","anecdotal":"Anecdotal evidence","ancient":"“Ancient wisdom”","lone_genius":"Lone genius against science","new_law":"Needs a new law of nature"},
     sum="Headlines checked: {n} · with signs: {m}", stale="issue not updated for a long time", invisible="not visible from a headline", flagged="Headlines with signs", noflags="No headline shows a sign right now.", upd="Checked", wait="The first check has not run yet: the sensor checks every 6 hours.", loading="Loading…", err="The sensor did not answer just now."))})
PORTAL_ITEMS["park"] = {"ru": ("Роберт Л. Парк (1931–2020), физика, наука и лженаука", "Семь признаков лженауки.", "MCP Anti-Bullshit (разбор отдельного утверждения), исследовательские детекторы преувеличений в научных новостях, SciLens", "регулярная проверка живого потока новостей по семи признакам Парка, с точными словами из заголовка", "признаки лженауки в сегодняшних научных заголовках, с точной цитатой"),
  "de": ("Robert L. Park (1931–2020), Physik, Wissenschaft und Pseudowissenschaft", "Sieben Warnzeichen für Pseudowissenschaft.", "Anti-Bullshit MCP (Prüfung einer einzelnen Behauptung), Forschungsdetektoren für Übertreibungen in Wissenschaftsnachrichten, SciLens", "eine regelmäßige Prüfung eines laufenden Nachrichtenstroms auf Parks sieben Zeichen, mit wörtlichem Zitat", "Warnzeichen für Pseudowissenschaft in heutigen Wissenschaftsschlagzeilen, mit wörtlichem Zitat"),
  "en": ("Robert L. Park (1931–2020), physics, science and pseudoscience", "The seven warning signs of bogus science.", "Anti-Bullshit MCP (analysis of a single claim), research detectors of exaggeration in science news, SciLens", "a regular check of a live news stream on Park’s seven signs, with the exact words from the headline", "warning signs of bogus science in today’s science headlines, with the exact quote")}

if __name__ == "__main__":
    for sid, S in SENSORS.items():
        for lg, c in S["L"].items():
            cfg = dict(c["cfg"], loc=LOC[lg]); wiki = S["wiki"].get(lg) or S["wiki"]["ru"]
            out = ("public/" if lg == "ru" else "public/" + lg + "/") + "tools/" + sid + ".html"
            open(out, "w").write(page(sid, lg, c, wiki, S["render"], cfg, S["person"])); print(out)
    for lg in ("ru", "de", "en"):
        out = ("public/" if lg == "ru" else "public/" + lg + "/") + "tools/scientists.html"; open(out, "w").write(portal(lg)); print(out)
