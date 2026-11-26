#!/usr/bin/env python3
"""Имена, которые Orb Studio уже знает (библиотека кристаллов, машина времени, учёные датчиков).
  python3 tools/scanner_names.py list          -> пишет docs/scanner-known-names.txt (это файл для Лианы и других сканеров)
  python3 tools/scanner_names.py check < names -> по строке на имя (можно «Имя | годы | …»): NEW или DUP:id
Сверка идёт по нормализованной фамилии и по полному имени, поэтому тёзок (Richter, Pearson…) помечает как DUP?: проверь годы."""
import importlib.util, re, sys, glob, unicodedata, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def load(p):
    spec = importlib.util.spec_from_file_location(os.path.basename(p)[:-3], os.path.join(ROOT, p)); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m
def norm(s):
    s = s.translate(str.maketrans({"œ": "oe", "Œ": "oe", "æ": "ae", "Æ": "ae", "ß": "ss", "ø": "o", "Ø": "o", "đ": "d", "Đ": "d", "ł": "l", "Ł": "l"}))  # лигатуры не раскладываются в NFKD (Ricœur → Ricoeur)
    s = unicodedata.normalize("NFKD", s); s = "".join(ch for ch in s if not unicodedata.combining(ch)).lower()
    return re.sub(r"[^a-zа-я0-9 ]+", " ", s).split()
def known():
    out = []  # (id, name, years, source)
    for r in load("tools/crystals_data.py").C:
        if isinstance(r[1], str): out.append((r[0], r[1], r[3], "library"))
    for r in load("tools/timemachine_data.py").TM: out.append((r[0], r[1], r[3], "time machine"))
    for f in glob.glob(os.path.join(ROOT, "src", "*.js")):
        for m in re.finditer(r'name:\s*"([^"]+)",\s*years:\s*"([^"]+)"', open(f, encoding="utf-8").read()):
            out.append((os.path.basename(f)[:-3], m.group(1), m.group(2), "sensor"))
    w = os.path.join(ROOT, "docs", "memory-waiting.md")  # проверенные без мостика — тоже «уже знаем»
    if os.path.exists(w):
        for m in re.finditer(r"^- ([^|\n]+?) \| ([^|\n]+?) \|", open(w, encoding="utf-8").read(), re.M):
            out.append(("waiting", m.group(1).strip(), m.group(2).strip(), "memory-waiting"))
    return out
SUFFIX = {"jr", "sr", "ii", "iii", "iv", "мл", "ст"}  # «Henry Kyburg Jr.» -> kyburg, а не jr
def surname(name): t = [w for w in norm(name) if len(w) > 1 and w not in SUFFIX]; return t[-1] if t else ""
def main():
    k = known()
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        def short(n, y):  # «Фамилия (год рождения)»: сканеру этого хватает, чтобы отличить тёзок
            sur = surname(n).capitalize(); b = re.search(r"\d{4}", y or ""); return f"{sur} ({b.group(0)})" if b else sur
        names = sorted({short(n, y) for _, n, y, _ in k if len(surname(n)) > 1}, key=str.lower)
        body = ", ".join(names)
        open(os.path.join(ROOT, "docs", "scanner-known-names.txt"), "w", encoding="utf-8").write(
            f"# Уже есть в Orb Studio ({len(names)} имён: библиотека кристаллов, машина времени, датчики). Этих не предлагать. Фамилия и год рождения; тёзку с другим годом рождения — можно.\n{body}\n")
        print(len(names), "names written"); return
    by_full = {}; by_sur = {}
    for i, n, y, s in k: by_full.setdefault(" ".join(norm(n)), []).append((i, y, s)); by_sur.setdefault(surname(n), []).append((i, n, y, s))
    for line in sys.stdin:
        raw = line.strip().strip("*-• ").split("|")[0].split("(")[0].strip()
        if not raw: continue
        full = " ".join(norm(raw)); sur = surname(raw)
        if full in by_full: print(f"DUP:{by_full[full][0][0]}\t{line.strip()[:60]}")
        elif sur in by_sur: i, n, y, s = by_sur[sur][0]; print(f"DUP?:{i} ({n} {y}, {s}) — тот же человек или тёзка?\t{raw}")
        else: print(f"NEW\t{raw}")
main()
