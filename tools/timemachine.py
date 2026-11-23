# Генератор «Машины времени»: src/timemachine.js (API и MCP) и страницы tools/timemachine (ru/de/en). Данные — tools/timemachine_data.py.
import json, html as H, sys
sys.path.insert(0, "tools")
from timemachine_data import TM, ERAS
import honour_pages as HP
from crystals import Z
cards = [dict(id=c[0], name=c[1], name_ru=c[2], years=c[3], wiki=c[4], zone=c[5], idea={"en": c[6], "ru": c[7], "de": c[8]}, rule=c[9], era=c[10], bridge={"en": c[11], "ru": c[12]}) for c in TM]
js = "// СГЕНЕРИРОВАНО tools/timemachine.py из tools/timemachine_data.py — правьте данные там.\n"
js += "export const TM_ERAS = " + json.dumps({k: {"en": v[0], "ru": v[1], "de": v[2]} for k, v in ERAS.items()}, ensure_ascii=False) + ";\n"
js += "export const TIME_MACHINE = " + json.dumps(cards, ensure_ascii=False, indent=0) + ";\n"
js += '''export function timeMachineReport({ era = null, zone = null, q = null } = {}, origin = "https://orbstudio.org") {
  let all = TIME_MACHINE;
  if (era && TM_ERAS[era]) all = all.filter((c) => c.era === era);
  if (zone) all = all.filter((c) => c.zone === zone);
  if (q) { const s = String(q).toLowerCase().slice(0, 80); all = all.filter((c) => [c.name, c.name_ru, c.idea.en, c.rule].some((x) => x && x.toLowerCase().includes(s))); }
  const eras = Object.keys(TM_ERAS).map((k) => ({ id: k, title: TM_ERAS[k].en, cards: TIME_MACHINE.filter((c) => c.era === k).length }));
  return { library: "time_machine", count: all.length, eras, cards: all,
    about: "Orb Studio's Time Machine: ideas of scientists from any era, chosen by one test — does the idea give an AI agent a rule today and build a bridge to the Crystal Library or a live sensor? 'bridge' names that link across the centuries. The rule is Orb Studio's interpretation, not the scientist's words.",
    how_built: "Raw death lists of a chosen year or period come from Gemini (Russian Wikipedia); Claude selects and finds the bridges.", page: origin + "/tools/timemachine", library_page: origin + "/tools/crystals" };
}
'''
open("src/timemachine.js", "w").write(js)
T = {"ru": dict(title="Машина времени · Orb Studio", desc="Идеи учёных любых эпох как правила для ИИ-агентов — и мосты через века к Библиотеке кристаллов и живым датчикам Orb Studio.", h1="Машина времени",
   lead="Мы прыгаем по годам — 1888-й, Возрождение, завтра XVIII век — и спрашиваем у каждой эпохи одно: даёт ли идея учёного правило ИИ-агенту сегодня и с чем из нашей библиотеки она складывает мост. Лоренцо Валла в 1440 году разоблачил подделку по словам, которых тогда ещё не было, — тот же приём нужен агенту, проверяющему дату источника.",
   now_h="Учёные по эпохам", honour_h="Как работает Машина времени", honour="Сырой список умерших за выбранный год или период из русской Википедии приносит Лиана (Gemini). Claude отбирает тех, из чьей работы следует правило для агента, и ищет мост: с какими карточками Библиотеки кристаллов и датчиками сайта старая идея работает вместе. Библиотека кристаллов хранит память о недавно ушедших учёных; Машина времени — о тех, чьи идеи прошли века.",
   note="Orb Studio не связана с этими учёными и их наследниками. Годы раннего периода приблизительны — так, как они указаны в Википедии.", rule="Правило для агента", bridge="Мост через века", wiki="Википедия", cnt="Учёных: {n}, эпох: {e}."),
 "de": dict(title="Zeitmaschine · Orb Studio", desc="Ideen von Forschenden aller Epochen als Regeln für KI-Agenten – und Brücken über die Jahrhunderte zur Kristall-Bibliothek und zu den Live-Sensoren von Orb Studio.", h1="Zeitmaschine",
   lead="Wir springen durch die Jahre – 1888, die Renaissance, bald das 18. Jahrhundert – und fragen jede Epoche nur eins: Gibt die Idee einem KI-Agenten heute eine Regel, und welche Brücke schlägt sie zu unserer Bibliothek? Lorenzo Valla entlarvte 1440 eine Fälschung an Wörtern, die es damals noch nicht gab – genau das braucht ein Agent, der das Datum einer Quelle prüft.",
   now_h="Forschende nach Epochen", honour_h="So arbeitet die Zeitmaschine", honour="Die Rohliste der Verstorbenen eines Jahres oder Zeitraums aus der russischen Wikipedia bringt Liana (Gemini). Claude wählt aus, wessen Werk eine Regel für Agenten ergibt, und sucht die Brücke zu Karten der Kristall-Bibliothek und zu Live-Sensoren. Die Kristall-Bibliothek erinnert an kürzlich verstorbene Forschende; die Zeitmaschine an Ideen, die Jahrhunderte überdauert haben.",
   note="Orb Studio steht in keiner Verbindung zu diesen Forschenden und ihren Erben. Frühe Lebensdaten sind ungefähr, wie in der Wikipedia angegeben.", rule="Regel für Agenten", bridge="Brücke über die Jahrhunderte", wiki="Wikipedia", cnt="Forschende: {n}, Epochen: {e}."),
 "en": dict(title="Time Machine · Orb Studio", desc="Ideas of scientists from any era as rules for AI agents – and bridges across the centuries to the Crystal Library and Orb Studio's live sensors.", h1="Time Machine",
   lead="We jump through the years – 1888, the Renaissance, soon the 18th century – and ask each era one thing: does a scientist's idea give an AI agent a rule today, and what bridge does it build to our library? In 1440 Lorenzo Valla exposed a forgery by words that did not yet exist at its claimed date – exactly what an agent needs when it checks the date of a source.",
   now_h="Scientists by era", honour_h="How the Time Machine works", honour="Liana (Gemini) brings the raw death list of a chosen year or period from Russian Wikipedia. Claude picks those whose work gives an agent a rule and looks for the bridge: which Crystal Library cards and live sensors the old idea works with. The Crystal Library remembers recently departed scientists; the Time Machine remembers ideas that lasted for centuries.",
   note="Orb Studio is not connected with these scientists or their heirs. Early dates are approximate, as given in Wikipedia.", rule="Rule for agents", bridge="Bridge across the centuries", wiki="Wikipedia", cnt="Scientists: {n}, eras: {e}.")}
for lg in ("ru", "de", "en"):
    t = T[lg]; groups = []
    for era, names in ERAS.items():
        li = []
        for c in [c for c in cards if c["era"] == era]:
            nm = c["name_ru"] if lg == "ru" else c["name"]; br = c["bridge"]["ru" if lg == "ru" else "en"]
            li.append('      <li class="cr" id="%s"><b>%s (%s)</b><p>%s</p><p><small>%s: %s</small></p><p><small>%s: %s</small> · <small>%s</small> · <a href="%s" rel="noopener">%s</a></p></li>' % (c["id"], H.escape(nm), H.escape(c["years"]), H.escape(c["idea"][lg]), H.escape(t["rule"]), H.escape(c["rule"]), H.escape(t["bridge"]), H.escape(br), H.escape(Z[lg][c["zone"]]), c["wiki"], t["wiki"]))
        groups.append('    <h3 id="era-%s">%s</h3>\n    <ul class="crl">\n%s\n    </ul>' % (era, H.escape(names[{"en": 0, "ru": 1, "de": 2}[lg]]), "\n".join(li)))
    c = dict(title=t["title"], desc=t["desc"], eye={"ru": "Orb Studio · инструменты · машина времени", "de": "Orb Studio · Werkzeuge · Zeitmaschine", "en": "Orb Studio · tools · time machine"}[lg], h1=t["h1"], lead=t["lead"], now_h=t["now_h"], honour_h=t["honour_h"], honour=H.escape(t["honour"]), note=t["note"],
             agents={"ru": "Для агентов: <code>GET /api/v1/timemachine</code> (фильтры <code>?era=</code>, <code>?zone=</code>, <code>?q=</code>) или MCP-инструмент <code>get_time_machine</code>. Бесплатно, без ключа.", "de": "Für Agenten: <code>GET /api/v1/timemachine</code> (Filter <code>?era=</code>, <code>?zone=</code>, <code>?q=</code>) oder das MCP-Werkzeug <code>get_time_machine</code>. Kostenlos, ohne Schlüssel.", "en": "For agents: <code>GET /api/v1/timemachine</code> (filters <code>?era=</code>, <code>?zone=</code>, <code>?q=</code>) or the MCP tool <code>get_time_machine</code>. Free, no key."}[lg])
    person = {"@type": "ItemList", "name": t["h1"], "numberOfItems": len(cards), "itemListElement": [{"@type": "Person", "name": x["name"], "sameAs": [x["wiki"]]} for x in cards]}
    s = HP.page("timemachine", lg, c, "", 'document.getElementById("hmStatus").textContent=HM.cnt;', dict(HP.LD[lg], cnt=t["cnt"].format(n=len(cards), e=len(ERAS)), loc=HP.LOC[lg]), person)
    s = s.replace('<ol class="hm-list" id="hmRows"></ol>', '<div id="hmRows">\n' + "\n".join(groups) + '\n  </div>', 1)
    s = s.replace('</style>\n</head>', '.crl{list-style:none;padding:0;margin:.4rem 0 1.2rem;display:grid;gap:.6rem}.cr{border:1px solid rgba(255,255,255,.12);border-radius:10px;padding:.6rem .8rem}.cr p{margin:.3rem 0}</style>\n</head>', 1)
    s = s.replace('/tools/scientists">', '/tools/crystals">', 1)
    out = ("public/" if lg == "ru" else "public/" + lg + "/") + "tools/timemachine.html"; open(out, "w").write(s); print(out, len(cards))
