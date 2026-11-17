// УВКБ ООН (UNHCR Refugee Data Finder API, без ключа): вынужденно перемещённые по миру.
// Поле refugees — беженцы под мандатом УВКБ (с людьми в похожем положении), а не все беженцы мира: без беженцев Палестины под мандатом БАПОР
// и без «других нуждающихся в международной защите». Поэтому сумма не равна общему числу вынужденно перемещённых из отчётов УВКБ.
// Год, совпадающий с текущим, — предварительные данные на середину года (Mid-Year Trends выходит в октябре–ноябре); прошлые годы — на конец года.
export const API = "https://api.unhcr.org/population/v1/population/";
export const ATTRIBUTION = "UNHCR Refugee Data Finder (https://www.unhcr.org/refugee-statistics/), population statistics API.";
export const FIELDS = ["refugees", "asylum_seekers", "idps", "stateless", "ooc", "oip", "returned_refugees", "returned_idps"];
// «0» строкой — ноль; «-» и пусто — нет данных (не ноль).
export const n = (v) => { if (v == null || v === "-" || v === "") return null; const x = Number(v); return Number.isFinite(x) ? x : null; };
export function asOf(year, nowYear) { return year >= nowYear ? { as_of: `${year}-06-30`, preliminary: true } : { as_of: `${year}-12-31`, preliminary: false }; }
// global: ответ без разбивки (строка на год); origins: ответ с coo_all=true за один год.
export function summarize(global, origins, now = Date.now()) {
  const rows = global && Array.isArray(global.items) ? global.items : null;
  if (!rows || !rows.length) return { ok: false, reason: "UNHCR answer has no rows" };
  const nowYear = new Date(now).getUTCFullYear();
  const years = rows.map((r) => ({ year: Number(r.year), ...Object.fromEntries(FIELDS.map((f) => [f, n(r[f])])) })).filter((r) => Number.isFinite(r.year)).sort((a, b) => a.year - b.year);
  if (!years.length) return { ok: false, reason: "UNHCR rows without a year" };
  const last = years[years.length - 1], prev = years.length > 1 ? years[years.length - 2] : null;
  const o = origins && Array.isArray(origins.items) ? origins.items : [];
  const top = o.map((r) => ({ country: String(r.coo_name || "").slice(0, 60), iso3: String(r.coo_iso || r.coo || "").slice(0, 3), year: Number(r.year), refugees: n(r.refugees) }))
    .filter((r) => r.country && r.country !== "-" && r.refugees != null && r.refugees > 0).sort((a, b) => b.refugees - a.refugees).slice(0, 5);
  return { ok: true, year: last.year, ...asOf(last.year, nowYear), latest: last, previous: prev ? { year: prev.year, ...asOf(prev.year, nowYear), ...prev } : null,
    top_origins: top, top_origins_year: top[0] ? top[0].year : null };
}
