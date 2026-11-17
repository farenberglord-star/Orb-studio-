// Морские узкие места: суточные проходы судов по данным IMF PortWatch (UN Global Platform, спутниковый AIS), набор на HDX.
// Файл обновляется раз в неделю, данные отстают на несколько дней. Скачиваем не чаще раза в неделю, только суммы, со ссылкой на источник, без логотипа IMF.
// Берём счётчики судов (n_total, n_tanker); тоннаж (capacity) не показываем: в нём бывают пропуски при ненулевом числе судов.
export const HDX_CSV = "https://data.humdata.org/dataset/91d28bb8-986d-430c-961c-6a24ecbd66ee/resource/cbd17f06-8ab2-4ba4-a666-f7a4bcc9ea3f/download/daily-chokepoint-transit-calls-and-shipment-volume-estimates.csv";
export const ATTRIBUTION = "Source: IMF PortWatch (UN Global Platform), daily chokepoint transit calls, via the Humanitarian Data Exchange (https://data.humdata.org/organization/portwatch). AIS-based estimates.";
export const FOCUS = [ // порядок показа; ищем по названию в файле
  { key: "hormuz", match: /hormuz/i }, { key: "bab_el_mandeb", match: /bab.?el.?mandeb/i }, { key: "suez", match: /suez/i }, { key: "cape_good_hope", match: /good hope/i },
  { key: "malacca", match: /malacca/i }, { key: "panama", match: /panama/i }, { key: "bosporus", match: /bospor/i },
];
export const KEEP_DAYS = 400;
const DAY = 864e5;
const day = (v) => { const m = /^(\d{4}-\d{2}-\d{2})/.exec(String(v || "").trim()); return m ? m[1] : null; };
const int = (v) => { const s = String(v == null ? "" : v).trim(); return /^\d+$/.test(s) ? +s : null; };

// Построчный разбор. Файл идёт от новых дат к старым: как только дата старше cutoff, можно остановиться (возвращаем stop:true).
export function header(line) {
  const c = line.replace(/^﻿/, "").split(",").map((x) => x.trim().toLowerCase());
  const idx = (n) => c.indexOf(n);
  const h = { date: idx("date"), portid: idx("portid"), portname: idx("portname"), n_total: idx("n_total"), n_tanker: idx("n_tanker") };
  return h.date >= 0 && h.portname >= 0 && h.n_total >= 0 ? h : null;
}
export function row(line, h) {
  const c = line.split(","); const d = day(c[h.date]); if (!d) return null;
  return { date: d, portid: (c[h.portid] || "").trim(), name: (c[h.portname] || "").trim(), total: int(c[h.n_total]), tanker: h.n_tanker >= 0 ? int(c[h.n_tanker]) : null };
}
// lines — массив строк файла (с шапкой). Возвращает компактные ряды по узким местам: { name: [{date,total,tanker}] }, только последние KEEP_DAYS дней.
export function collect(lines) {
  let h = null, newest = null, cutoff = null; const by = {};
  for (const l of lines) {
    if (!l || !l.trim()) continue;
    if (!h) { h = header(l); continue; }
    const r = row(l, h); if (!r || !r.name || r.total == null) continue;
    if (!newest) { newest = r.date; cutoff = new Date(Date.parse(newest) - KEEP_DAYS * DAY).toISOString().slice(0, 10); }
    if (r.date < cutoff) return { by, newest, stop: true, header: !!h };
    (by[r.name] = by[r.name] || []).push({ date: r.date, total: r.total, tanker: r.tanker });
  }
  return { by, newest, stop: false, header: !!h };
}
const avg = (a) => (a.length ? Math.round((a.reduce((s, x) => s + x, 0) / a.length) * 10) / 10 : null);
const pct = (a, b) => (a != null && b ? Math.round(((a - b) / b) * 1000) / 10 : null);
// Последние 7 дней против тех же 7 дней год назад. Если в окне меньше 5 дней с данными — значение не считаем (null).
export function summarize(by, newest) {
  if (!by || !newest) return { ok: false, reason: "chokepoint file could not be read" };
  const end = Date.parse(newest), win = (from, to) => (s) => s.filter((x) => { const t = Date.parse(x.date); return t > from && t <= to; });
  const out = [];
  for (const [name, series] of Object.entries(by)) {
    const now7 = win(end - 7 * DAY, end)(series), ago7 = win(end - 372 * DAY, end - 365 * DAY)(series);
    const t = now7.length >= 5 ? avg(now7.map((x) => x.total)) : null, ty = ago7.length >= 5 ? avg(ago7.map((x) => x.total)) : null;
    const k = now7.filter((x) => x.tanker != null), ky = ago7.filter((x) => x.tanker != null);
    const tk = k.length >= 5 ? avg(k.map((x) => x.tanker)) : null, tky = ky.length >= 5 ? avg(ky.map((x) => x.tanker)) : null;
    const f = FOCUS.find((x) => x.match.test(name));
    out.push({ name, key: f ? f.key : null, days: now7.length, ships_per_day_7d: t, ships_per_day_year_ago: ty, change_vs_year_pct: pct(t, ty),
      tankers_per_day_7d: tk, tankers_per_day_year_ago: tky, last_days: series.slice(0, 7).map((x) => ({ date: x.date, ships: x.total, tankers: x.tanker })) });
  }
  if (!out.length) return { ok: false, reason: "no chokepoints in the file" };
  const rank = (x) => { const i = FOCUS.findIndex((f) => f.key === x.key); return i < 0 ? 99 : i; };
  out.sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
  return { ok: true, data_through: newest, window: "last 7 days of data vs the same 7 days one year earlier", focus: out.filter((x) => x.key), others: out.filter((x) => !x.key) };
}
