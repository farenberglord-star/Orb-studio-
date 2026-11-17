// FAO Food Price Index (ФАО ООН): мировые цены на корзину продовольствия, раз в месяц, 2014–2016 = 100.
// Ссылка на CSV меняется с каждым выпуском, поэтому её ищем на официальной странице FAO. Только опубликованные числа, без прогнозов.
export const FAO_PAGE = "https://www.fao.org/worldfoodsituation/foodpricesindex/en/";
export const ATTRIBUTION = "FAO Food Price Index, Food and Agriculture Organization of the United Nations (https://www.fao.org/worldfoodsituation/foodpricesindex/en/).";
export const SUB = { food: ["food price index", "ffpi", "food"], meat: ["meat"], dairy: ["dairy"], cereals: ["cereals", "cereal"], oils: ["oils", "vegetable oils", "oil"], sugar: ["sugar"] };

// Из HTML страницы FAO — ссылка на CSV с месячными номинальными индексами (не рыбный индекс, не Excel).
export function findCsvUrl(html, base = FAO_PAGE) {
  const links = [];
  const re = /href\s*=\s*["']([^"']+\.csv(?:\?[^"']*)?)["']/gi;
  let m;
  while ((m = re.exec(String(html || "")))) { try { links.push(new URL(m[1].replace(/&amp;/g, "&"), base).toString()); } catch (e) {} }
  const ok = links.filter((u) => /^https:\/\/([a-z0-9-]+\.)*fao\.org\//i.test(u) && !/fish/i.test(u));
  return ok.find((u) => /food.?price|price.?ind|ffpi/i.test(u)) || ok[0] || null;
}

const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
// «1990-01», «1990-01-01», «01/1990», «1/1/1990», «Jan-90», «Jan 1990» → «1990-01».
export function month(v) {
  const s = String(v || "").trim().replace(/^"|"$/g, "");
  let m;
  if ((m = /^(\d{4})-(\d{1,2})(?:-\d{1,2})?$/.exec(s))) return fmt(+m[1], +m[2]);
  if ((m = /^(\d{1,2})\/(\d{4})$/.exec(s))) return fmt(+m[2], +m[1]);
  if ((m = /^(\d{1,2})\/\d{1,2}\/(\d{4})$/.exec(s))) return fmt(+m[2], +m[1]);
  if ((m = /^([A-Za-z]{3})[a-z]*[-\s](\d{2}|\d{4})$/.exec(s)) && MON[m[1].toLowerCase()]) { let y = +m[2]; if (y < 100) y += y >= 60 ? 1900 : 2000; return fmt(y, MON[m[1].toLowerCase()]); }
  return null;
}
const fmt = (y, mo) => (y >= 1960 && y <= 2100 && mo >= 1 && mo <= 12 ? `${y}-${String(mo).padStart(2, "0")}` : null);
const num = (v) => { const s = String(v == null ? "" : v).trim().replace(/^"|"$/g, "").replace(",", "."); if (!/^-?\d+(\.\d+)?$/.test(s)) return null; return +s; };
const cells = (line, sep = ",") => { const out = []; let cur = "", q = false; for (const ch of line) { if (ch === '"') q = !q; else if (ch === sep && !q) { out.push(cur); cur = ""; } else cur += ch; } out.push(cur); return out.map((x) => x.trim()); };

// CSV → [{month, food, meat, dairy, cereals, oils, sugar}], по возрастанию месяца. Шапку ищем по словам, служебные строки сверху пропускаем.
export function parseCsv(text) {
  const lines = String(text || "").replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  let hi = -1, cols = null, sep = ",";
  for (let i = 0; i < Math.min(lines.length, 15); i++) {
    sep = (lines[i].match(/;/g) || []).length > (lines[i].match(/,/g) || []).length ? ";" : ",";
    const c = cells(lines[i], sep).map((x) => x.toLowerCase().replace(/^"|"$/g, ""));
    if (c.some((x) => x.includes("food price index") || x === "ffpi") && c.some((x) => x.startsWith("meat") || x.startsWith("cereal"))) { hi = i; cols = c; break; }
  }
  if (hi < 0) return null;
  const idx = {}; idx.date = Math.max(0, cols.findIndex((x) => x === "date" || x === "month" || x === ""));
  for (const [k, names] of Object.entries(SUB)) idx[k] = cols.findIndex((x, i) => i !== idx.date && names.some((n) => x === n || (k !== "food" && x.startsWith(n)) || (k === "food" && x.includes("food price index"))));
  if (idx.food < 0) return null;
  const rows = [];
  for (const l of lines.slice(hi + 1)) {
    const c = cells(l, sep), mo = month(c[idx.date]); if (!mo) continue;
    const r = { month: mo }; for (const k of Object.keys(SUB)) r[k] = idx[k] >= 0 ? num(c[idx[k]]) : null;
    if (r.food != null) rows.push(r);
  }
  rows.sort((a, b) => a.month.localeCompare(b.month));
  const uniq = rows.filter((r, i) => i === rows.length - 1 || rows[i + 1].month !== r.month);
  return uniq.length ? uniq : null;
}
const r1 = (x) => Math.round(x * 10) / 10;
const pct = (a, b) => (a != null && b ? r1(((a - b) / b) * 100) : null);
export function summarize(rows, csvUrl = null) {
  if (!Array.isArray(rows) || rows.length < 2) return { ok: false, reason: "FAO CSV could not be read" };
  const last = rows[rows.length - 1], prev = rows[rows.length - 2];
  const [y, m] = last.month.split("-").map(Number), ya = rows.find((r) => r.month === `${y - 1}-${String(m).padStart(2, "0")}`) || null;
  const sub = {}; for (const k of ["meat", "dairy", "cereals", "oils", "sugar"]) sub[k] = { value: last[k], change_mm_pct: pct(last[k], prev[k]) };
  return { ok: true, month: last.month, value: last.food, change_mm_points: r1(last.food - prev.food), change_mm_pct: pct(last.food, prev.food), change_yy_pct: ya ? pct(last.food, ya.food) : null,
    subindices: sub, series: rows.slice(-13).map((r) => ({ month: r.month, value: r.food })), csv: csvUrl };
}
