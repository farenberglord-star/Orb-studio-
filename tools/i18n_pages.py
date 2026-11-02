# Собирает немецкую и английскую версии внутренних страниц: public/<page>.html -> public/de/<page>.html, public/en/<page>.html
# Запуск после правки любой из этих страниц:  python3 tools/i18n_pages.py [page ...]
# Язык выбирает воркер по языку браузера (TRANSLATED_PAGES в src/worker.js) — список страниц там и здесь должен совпадать.
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from i18n_pages_t import COMMON, PAGES, CODE

ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
SITE = "https://orbstudio.org"
# фрагмент меняем только целиком: слева и справа граница тега, кавычки, перевода строки или ${…}
LB = r"(?:(?<=[<>\"'`\n}])|^)"
RB = r"(?=[<>\"'`\n]|\$\{|$)"

def translate(src, page, col):
    keep = []
    def hold(m): keep.append(m.group(0)); return f"\x00K{len(keep)-1}\x00"
    s = re.sub(r"<style>.*?</style>|<script type=\"application/ld\+json\">.*?</script>", hold, src, flags=re.S)
    table = {ru: tr for ru, *tr in COMMON}
    table.update({ru: tr for ru, *tr in PAGES.get(page, [])})
    for ru in sorted(table, key=len, reverse=True):
        out = table[ru][col]
        if "'" not in ru: out = out.replace("'", "’")  # прямой апостроф ломает JS-строки в одинарных кавычках
        s = re.sub(LB + r"(\s*)" + re.escape(ru) + r"(\s*)" + RB, lambda m: m.group(1) + out + m.group(2), s, flags=re.M)
    for ru, de, en in CODE.get(page, []):
        s = s.replace(ru, (de, en)[col])
    return re.sub(r"\x00K(\d+)\x00", lambda m: keep[int(m.group(1))], s)

def hreflang(page):
    return (f'<link rel="alternate" hreflang="ru" href="{SITE}/ru/{page}">\n'
            f'<link rel="alternate" hreflang="de" href="{SITE}/de/{page}">\n'
            f'<link rel="alternate" hreflang="en" href="{SITE}/en/{page}">\n'
            f'<link rel="alternate" hreflang="x-default" href="{SITE}/{page}">\n')

def build(page):
    path = os.path.join(ROOT, page + ".html")
    src = open(path, encoding="utf-8").read()
    if 'hreflang="x-default"' not in src:
        src = src.replace("</head>", hreflang(page) + "</head>", 1)
        open(path, "w", encoding="utf-8").write(src)
    for lang, col in (("de", 0), ("en", 1)):
        s = translate(src, page, col)
        s = s.replace('<html lang="ru">', f'<html lang="{lang}">', 1)
        s = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{SITE}/{lang}/{page}">', s, count=1)
        s = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{SITE}/{lang}/{page}">', s, count=1)
        s = s.replace('content="ru_RU"', f'content="{"de_DE" if lang == "de" else "en_GB"}"')
        os.makedirs(os.path.join(ROOT, lang), exist_ok=True)
        open(os.path.join(ROOT, lang, page + ".html"), "w", encoding="utf-8").write(s)
        left = re.sub(r"<style>.*?</style>|<script type=\"application/ld\+json\">.*?</script>", "", s, flags=re.S)
        rest = sorted(set(m.strip() for m in re.findall(r"[^<>\"'`\n]*[А-Яа-яЁё][^<>\"'`\n]*", left)))
        print(f"{lang}/{page}: {len(s)} bytes, untranslated: {len(rest)}")
        for r in rest[:60]: print("   ", r[:150])

for p in (sys.argv[1:] or list(PAGES)):
    build(p)
