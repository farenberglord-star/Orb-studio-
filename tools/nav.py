# Единое меню Orb Studio на всех внутренних страницах — такое же, как вкладки на главной.
# Вставляет меню сразу после <body> (между метками <!--orb-nav--> … <!--/orb-nav-->) и стили в <head>.
# Запуск после правки меню или новой страницы:  python3 tools/nav.py && python3 tools/i18n_pages.py
import os, re
ROOT = os.path.join(os.path.dirname(__file__), "..", "public")

# (адрес, подпись, страница-файл) — порядок как на главной
NAV = [
    ("/", "Эфир", None), ("/#radar", "Радар", None), ("/#anchors", "Ведущие", None), ("/#agents", "Агентам", None),
    ("/orbi", "ORBI 🤖", "orbi"), ("/hall", "Почёт 🏆", "hall"), ("/indices", "Индексы 👻", "indices"), ("/music", "Музыка 🎵", "music"), ("/violin", "Скрипка 🎻", "violin"), ("/canvas", "Художник 🎨", "canvas"),
    ("/radar", "Импульсы 🌍", "radar"), ("/prices", "Цены 🧾", "prices"), ("/quality", "Качество 🔬", "quality"), ("/tariffs", "Тарифы 🏦", "tariffs"),
    ("/archive", "Архив 🗄", "archive"), ("/followups", "Потом 🕰", "followups"), ("/places", "Места 📍", "places"), ("/live", "Эфир 🎙", "live"),
    ("/sensors", "Датчики ⚡", "sensors"), ("/tools", "Инструменты 🧰", "tools"), ("/bridge", "Рубка 🧭", "bridge"),
]
PAGES = [p for _, _, p in NAV if p] + ["orb7"]

# Стили: одна строка вкладок, листается пальцем; текущая вкладка подсвечена и сама прокручивается в центр.
CSS = """<!--orb-nav-css--><style>
@view-transition{navigation:auto}
.onav{position:sticky;top:0;z-index:50;background:rgba(5,8,16,.9);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-bottom:1px solid rgba(120,160,220,.16);padding-top:env(safe-area-inset-top,0px)}
.onav-in{max-width:1180px;margin:0 auto;display:flex;align-items:center;gap:12px;padding:8px max(16px,env(safe-area-inset-right,0px)) 8px max(16px,env(safe-area-inset-left,0px))}
.onav-brand{font:700 14px/1 "Chakra Petch",system-ui,sans-serif;letter-spacing:.14em;color:#e8f1ff;text-decoration:none;display:flex;align-items:center;gap:8px;flex-shrink:0}
.onav-brand i{width:11px;height:11px;border-radius:50%;background:#5fe3ff;box-shadow:0 0 12px #5fe3ff;display:inline-block}
.onav-tabs{display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;scroll-snap-type:x proximity;min-width:0;flex:1;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 14px,#000 calc(100% - 22px),transparent);mask-image:linear-gradient(90deg,transparent 0,#000 14px,#000 calc(100% - 22px),transparent);padding:0 14px}
.onav-tabs::-webkit-scrollbar{display:none}
.onav-tabs a{font:12px/1 "JetBrains Mono",ui-monospace,monospace;white-space:nowrap;text-decoration:none;color:#8b9bb8;padding:8px 11px;border-radius:7px;border:1px solid transparent;scroll-snap-align:center;flex-shrink:0}
.onav-tabs a:hover,.onav-tabs a:focus-visible{color:#e8f1ff;border-color:rgba(120,160,220,.3);outline:none}
.onav-tabs a.on{color:#5fe3ff;border-color:rgba(95,227,255,.45);background:rgba(95,227,255,.07)}
.onav-lang{display:flex;gap:2px;flex-shrink:0;border:1px solid rgba(120,160,220,.22);border-radius:8px;padding:2px}
.onav-lang a{font:700 11px/1 "JetBrains Mono",ui-monospace,monospace;letter-spacing:.06em;text-decoration:none;color:#8b9bb8;padding:6px 7px;border-radius:6px}
.onav-lang a:hover,.onav-lang a:focus-visible{color:#e8f1ff;outline:none}
.onav-lang a.on{color:#05080f;background:#5fe3ff}
@media (max-width:560px){.onav-brand span{display:none}}
@media (prefers-reduced-motion:reduce){@view-transition{navigation:none}}
</style>
<script type="speculationrules">{"prefetch":[{"where":{"href_matches":"/*"},"eagerness":"moderate"}]}</script><!--/orb-nav-css-->"""

def nav_html(cur):
    tabs = "".join(f'<a href="{h}"{" class=\"on\" aria-current=\"page\"" if p == cur else ""}>{t}</a>' for h, t, p in NAV)
    return ('<!--orb-nav--><header class="onav"><div class="onav-in"><a class="onav-brand" href="/" aria-label="Orb Studio — главная"><i></i><span>ORB STUDIO</span></a>'
            f'<nav class="onav-tabs" aria-label="Разделы Orb Studio">{tabs}</nav></div></header>'
            '<script>(function(){var a=document.querySelector(".onav-tabs a.on");if(a)a.scrollIntoView({block:"nearest",inline:"center"})})()</script><!--/orb-nav-->')

def put(s, start, end, block, anchor, after=True):
    if start in s:
        return re.sub(re.escape(start) + ".*?" + re.escape(end), lambda m: block, s, count=1, flags=re.S)
    assert anchor in s, anchor
    return s.replace(anchor, anchor + block if after else block + anchor, 1)

def main():
    for p in PAGES:
        path = os.path.join(ROOT, p + ".html")
        s = open(path, encoding="utf-8").read()
        s = put(s, "<!--orb-nav-css-->", "<!--/orb-nav-css-->", CSS, "</head>", after=False)
        s = put(s, "<!--orb-nav-->", "<!--/orb-nav-->", nav_html(p), "<body>")
        open(path, "w", encoding="utf-8").write(s)
        print("nav:", p)




# ---- переключатель языка RU / DE / EN: ссылки на ту же страницу на другом языке (если перевод есть), иначе на главную языка ----
import glob
def _translated():
    w = open(os.path.join(ROOT, "..", "src", "worker.js"), encoding="utf-8").read()
    m = re.search(r"const TRANSLATED_PAGES = new Set\(\[(.*?)\]\)", w)
    return set(re.findall(r'"([a-z0-9-]+)"', m.group(1)))

def lang_html(name, cur):
    tr = _translated()
    have = {l: {os.path.basename(f)[:-5] for f in glob.glob(os.path.join(ROOT, l, "*.html"))} for l in ("de", "en")}
    out = []
    for l, label in (("ru", "RU"), ("de", "DE"), ("en", "EN")):
        if l == "ru":
            href = ("/ru/" + name) if name in tr else "/" + name
        else:
            href = f"/{l}/{name}" if name in have[l] else f"/{l}/"
        on = ' class="on" aria-current="true"' if l == cur else ""
        out.append(f'<a href="{href}" hreflang="{l}" lang="{l}"{on}>{label}</a>')
    return '<!--orb-lang--><div class="onav-lang" role="group" aria-label="Language / Sprache / Язык">' + "".join(out) + '</div><!--/orb-lang-->'

def lang_all():
    for path in sorted(glob.glob(os.path.join(ROOT, "*.html")) + glob.glob(os.path.join(ROOT, "de", "*.html")) + glob.glob(os.path.join(ROOT, "en", "*.html"))):
        s = open(path, encoding="utf-8").read()
        if "<!--orb-nav-->" not in s: continue
        rel = os.path.relpath(path, ROOT).split(os.sep)
        cur, name = (rel[0], rel[1][:-5]) if len(rel) == 2 else ("ru", rel[0][:-5])
        s = put(s, "<!--orb-nav-css-->", "<!--/orb-nav-css-->", CSS, "</head>", after=False)
        blk = lang_html(name, cur)
        if "<!--orb-lang-->" in s:
            s = re.sub(r"<!--orb-lang-->.*?<!--/orb-lang-->", lambda m: blk, s, count=1, flags=re.S)
        else:
            assert "</nav></div></header>" in s, path
            s = s.replace("</nav></div></header>", "</nav>" + blk + "</div></header>", 1)
        open(path, "w", encoding="utf-8").write(s)
        print("lang:", os.path.relpath(path, ROOT))

if __name__ == "__main__":
    main()
    lang_all()
