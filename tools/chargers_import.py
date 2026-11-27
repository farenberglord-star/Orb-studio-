#!/usr/bin/env python3
"""Ladesäulenregister der Bundesnetzagentur (CC BY 4.0, «Bundesnetzagentur.de») → клетки 0,5° в public/data/chargers/.
Запускается ежемесячно из .github/workflows/chargers.yml (в песочнице сеть закрыта). Колонки ищем по названиям заголовка, а не по номерам.
Использование: python3 tools/chargers_import.py [--dry]   (--dry: только напечатать заголовок и первые строки, ничего не писать)"""
import csv, io, json, math, os, re, sys, urllib.request, datetime

PAGE = "https://www.bundesnetzagentur.de/DE/Fachthemen/ElektrizitaetundGas/E-Mobilitaet/Ladesaeulenkarte/start.html"
UA = {"User-Agent": "OrbStudio/1.0 (+https://orbstudio.org/llms.txt)"}
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "public", "data", "chargers")
CELL = 0.5

def get(url, limit=None):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=240) as r:
        return r.read() if limit is None else r.read(limit)

def find_csv_url():
    html = get(PAGE).decode("utf-8", "replace")
    m = re.findall(r'(https?://[^"\']*Ladesaeulenregister_BNetzA_(\d{4}-\d{2}-\d{2})\.csv)', html)
    if not m:  # ссылка может быть относительной
        m2 = re.findall(r'(/[^"\']*Ladesaeulenregister_BNetzA_(\d{4}-\d{2}-\d{2})\.csv)', html)
        m = [("https://data.bundesnetzagentur.de" + u if not u.startswith("http") else u, d) for u, d in m2]
    if not m: raise SystemExit("CSV-Link auf der Seite nicht gefunden")
    return sorted(set(m), key=lambda x: x[1])[-1]

def num(s):
    s = (s or "").strip().replace(".", "").replace(",", ".") if "," in (s or "") else (s or "").strip()
    try: return float(s)
    except ValueError: return None

def norm(h): return re.sub(r"\s+", " ", h.strip().lower().replace("ä", "ae").replace("ö", "oe").replace("ü", "ue").replace("ß", "ss"))

def main():
    dry = "--dry" in sys.argv
    url, stand = find_csv_url()
    print("CSV:", url, "Stand:", stand, flush=True)
    raw = get(url)
    print("bytes:", len(raw), flush=True)
    for enc in ("utf-8-sig", "cp1252", "latin-1"):
        try: text = raw.decode(enc); break
        except UnicodeDecodeError: continue
    print("encoding:", enc)
    lines = text.splitlines()
    hi = next((i for i, l in enumerate(lines[:60]) if "breitengrad" in norm(l) and ("laengengrad" in norm(l))), None)
    print("--- erste 14 Zeilen ---")
    for l in lines[:14]: print(l[:300])
    if hi is None: raise SystemExit("Kopfzeile mit Breiten-/Längengrad nicht gefunden")
    delim = ";" if lines[hi].count(";") >= lines[hi].count(",") else ","
    rd = csv.reader(io.StringIO("\n".join(lines[hi:])), delimiter=delim)
    head = [norm(h) for h in next(rd)]
    print("Kopfzeile:", head)
    def col(*keys, exclude=()):
        for i, h in enumerate(head):
            if all(k in h for k in keys) and not any(e in h for e in exclude): return i
        return None
    ix = {"lat": col("breitengrad"), "lon": col("laengengrad"), "op": col("betreiber"), "str": col("strasse"), "nr": col("hausnummer"),
          "plz": col("postleitzahl"), "ort": col("ort", exclude=("kreis", "bundesland", "ortsteil")), "kw": col("nennleistung", "ladeeinrichtung"),
          "art": col("art der ladeeinrichtung"), "pts": col("anzahl ladepunkte"), "plug": col("steckertypen1"), "since": col("inbetriebnahme"), "status": col("status")}
    print("Spalten:", ix)
    if ix["lat"] is None or ix["lon"] is None: raise SystemExit("Koordinatenspalten fehlen")
    if dry:
        for _ in range(3): print(next(rd))
        return
    cells, n, bad = {}, 0, 0
    g = lambda r, k: (r[ix[k]].strip() if ix[k] is not None and ix[k] < len(r) else "")
    for r in rd:
        lat, lon = num(g(r, "lat")), num(g(r, "lon"))
        if lat is None or lon is None or not (47 < lat < 55.5 and 5.5 < lon < 15.5): bad += 1; continue
        kw = num(g(r, "kw")); art = g(r, "art").lower(); pts = num(g(r, "pts"))
        street = (g(r, "str") + " " + g(r, "nr")).strip()
        rec = [round(lat, 4), round(lon, 4), int(kw) if kw is not None else None, 1 if "schnell" in art else 0, int(pts) if pts else 1,
               g(r, "op")[:34], g(r, "plug")[:40], (street[:34] + ", " + g(r, "plz") + " " + g(r, "ort")[:22]).strip(", ")]
        st = g(r, "status")
        if st: rec.append(st[:20])
        key = "%d_%d" % (math.floor(lat / CELL), math.floor(lon / CELL))
        cells.setdefault(key, []).append(rec); n += 1
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT): os.remove(os.path.join(OUT, f))
    for key, recs in cells.items():
        with open(os.path.join(OUT, key + ".json"), "w", encoding="utf-8") as f: json.dump(recs, f, ensure_ascii=False, separators=(",", ":"))
    meta = {"stand": stand, "source": "Bundesnetzagentur.de, Ladesäulenregister", "licence": "CC BY 4.0", "cell_deg": CELL, "count": n, "skipped_no_coords": bad,
            "record": ["lat", "lon", "kw", "dc", "points", "operator", "plug", "address"] + (["status"] if ix["status"] is not None else []), "cells": len(cells)}
    with open(os.path.join(OUT, "meta.json"), "w", encoding="utf-8") as f: json.dump(meta, f, ensure_ascii=False)
    print("OK", meta)

if __name__ == "__main__": main()
