# Собирает немецкую и английскую версии главной из русской: public/index.html -> public/de/index.html, public/en/index.html
# Запуск после любой правки главной:  python3 tools/i18n_build.py
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from i18n_index import T, RADAR

ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
SITE = "https://orbstudio.org"
HREFLANG = (f'<link rel="alternate" hreflang="ru" href="{SITE}/ru/">\n'
            f'<link rel="alternate" hreflang="de" href="{SITE}/de/">\n'
            f'<link rel="alternate" hreflang="en" href="{SITE}/en/">\n'
            f'<link rel="alternate" hreflang="x-default" href="{SITE}/">\n')

def translate(src, col):
    # стили не трогаем: вырезаем, переводим остальное, возвращаем на место
    styles = []
    def keep(m): styles.append(m.group(0)); return f"\x00STYLE{len(styles)-1}\x00"
    s = re.sub(r"<style>.*?</style>", keep, src, flags=re.S)
    for ru, *tr in sorted(T, key=lambda x: -len(x[0])):
        out = tr[col]
        # прямой апостроф ломает JS-строки в одинарных кавычках — ставим типографский
        if not (ru.startswith("'") and ru.endswith("'")): out = out.replace("'", "\u2019")
        s = s.replace(ru, out)
    return re.sub(r"\x00STYLE(\d+)\x00", lambda m: styles[int(m.group(1))], s)

def build(lang, col):
    src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    s = translate(src, col)
    s = s.replace('<html lang="ru">', f'<html lang="{lang}">', 1)
    s = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{SITE}/{lang}/">', s, count=1)
    s = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{SITE}/{lang}/">', s, count=1)
    s = s.replace("</head>", HREFLANG + f"<script>window.I18N_RADAR={json.dumps(RADAR[lang], ensure_ascii=False)};</script>\n</head>", 1)
    os.makedirs(os.path.join(ROOT, lang), exist_ok=True)
    open(os.path.join(ROOT, lang, "index.html"), "w", encoding="utf-8").write(s)
    # проверка: какие русские строки остались (кроме таблицы I18N_RADAR и машинного блока)
    left = re.sub(r"<style>.*?</style>|window\.I18N_RADAR=.*?;</script>|<section id=\"machine-feed\">.*?</section>", "", s, flags=re.S)
    rest = sorted(set(m.strip() for m in re.findall(r"[^<>\"'`\n]*[А-Яа-яЁё][^<>\"'`\n]*", left)))
    print(f"{lang}: {len(s)} bytes, untranslated: {len(rest)}")
    for r in rest[:40]: print("   ", r[:120])

# русская версия тоже получает hreflang, чтобы поисковики видели все три
idx = os.path.join(ROOT, "index.html")
src = open(idx, encoding="utf-8").read()
if 'hreflang="x-default"' not in src:
    open(idx, "w", encoding="utf-8").write(src.replace("</head>", HREFLANG + "</head>", 1))
build("de", 0)
build("en", 1)
