// Цены на топливо: Гамбург и пригороды. Данные: Tankerkönig.de (MTS-K, Bundeskartellamt), CC BY 4.0, «Tankerkönig.de».
// Условия API: атрибуция CC BY 4.0 со ссылкой на tankerkoenig.de; радиус не больше 25 км; без массового обхода;
// опрос не чаще раза в 5 минут (общий кэш в D1 на 6 минут для всех посетителей); сырой набор оптом дальше не отдаём.
// Ключ TANKERKOENIG_KEY живёт только в секретах воркера и никогда не попадает в ответ.
// «Паспорт данных»: только фильтрует и помечает, цены не меняет.
export const FUEL_ATTRIBUTION = "Tankerkönig.de, CC BY 4.0";
export const FUEL_CENTER = { lat: 53.5, lng: 9.98 }; // Гамбург и южные пригороды (Харбург, Букстехуде, Винзен)
export const FUEL_RADIUS_KM = 25;                   // потолок условий API
export const FUEL_TTL_MS = 6 * 60e3;                // не чаще раза в 5 минут
export const FUEL_KEY = "fuel-hamburg-v1";
export const FUEL_TYPES = ["diesel", "e5", "e10"];
export const FUEL_RANGE = { diesel: [1.2, 2.6], e5: [1.3, 2.8], e10: [1.25, 2.75] }; // рабочие допущения паспорта
export const FUEL_OUTLIER = 0.12;                   // отклонение от медианы соседей, при котором цена считается выбросом
export const FUEL_TOP = 10;

const median = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const clean = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, n);

// Паспорт одного вида топлива. Вход — станции Tankerkönig (type=all). Выход: что прошло и что отсеяно с причиной.
export function fuelPassport(stations, fuel) {
  const rejected = { closed: 0, no_price: 0, out_of_range: 0, outlier: 0 };
  const examples = [];
  const note = (s, reason, v) => { rejected[reason]++; if (examples.length < 6) examples.push({ name: clean(s.brand || s.name, 40), place: clean(s.place, 30), reason, price: typeof v === "number" ? v : null }); };
  const ok = [];
  for (const s of Array.isArray(stations) ? stations : []) {
    if (!s || typeof s !== "object") continue;
    const v = s[fuel];
    if (s.isOpen === false) { note(s, "closed", v); continue; }
    if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) { note(s, "no_price", v); continue; }
    const [lo, hi] = FUEL_RANGE[fuel];
    if (v < lo || v > hi) { note(s, "out_of_range", v); continue; }
    ok.push(s);
  }
  const med0 = ok.length ? median(ok.map((s) => s[fuel])) : null;
  const kept = [];
  for (const s of ok) { if (Math.abs(s[fuel] - med0) / med0 > FUEL_OUTLIER) note(s, "outlier", s[fuel]); else kept.push(s); }
  kept.sort((a, b) => a[fuel] - b[fuel]);
  const total = (Array.isArray(stations) ? stations : []).length;
  return {
    fuel, stations_total: total, stations_passed: kept.length, rejected, rejected_examples: examples,
    median: kept.length ? Math.round(median(kept.map((s) => s[fuel])) * 1000) / 1000 : null,
    lowest: kept.length ? kept[0][fuel] : null,
    top: kept.slice(0, FUEL_TOP).map((s) => ({ name: clean(s.brand || s.name, 40), place: clean(s.place, 30), street: clean(s.street, 40), price: s[fuel] })),
  };
}

export function fuelReport(stations, fetchedAt) {
  const r = { status: "ok", area: "Hamburg and suburbs (25 km around central Hamburg and its southern outskirts)", fetched_at: new Date(fetchedAt).toISOString(), cache_minutes: 6,
    source: { name: "Tankerkönig.de", url: "https://www.tankerkoenig.de", license: "CC BY 4.0", origin: "Markttransparenzstelle für Kraftstoffe (MTS-K), Bundeskartellamt" },
    attribution: FUEL_ATTRIBUTION, fuels: {},
    passport: { rules: ["closed stations are dropped", "missing or zero prices are dropped", "prices outside a plausible range are dropped", "prices more than 12% from the median of all stations are flagged as outliers and dropped"],
      note: "The passport only filters and flags; it never changes a price. The station list carries no timestamp per price, so no freshness check is possible here. Orb Studio shows the time the list was fetched.",
      thresholds: { range_eur: FUEL_RANGE, outlier_share: FUEL_OUTLIER } },
    not_advice: "Prices as reported by MTS-K; they can change within minutes. Check the price at the pump." };
  for (const f of FUEL_TYPES) r.fuels[f] = fuelPassport(stations, f);
  return r;
}

// Загрузка: общий кэш D1 (sharedGet/sharedPut), при сбое источника — последняя удачная копия (до 3 часов) с пометкой stale.
export async function fuelData(env, deps) {
  const { sharedGet, sharedPut } = deps;
  const fresh = await sharedGet(env, FUEL_KEY, FUEL_TTL_MS);
  if (fresh && fresh.stations) return { ...fuelReport(fresh.stations, fresh.at), cached: true };
  if (!env || !env.TANKERKOENIG_KEY) return { status: "unavailable", reason: "not_configured", attribution: FUEL_ATTRIBUTION };
  try {
    const u = `https://creativecommons.tankerkoenig.de/json/list.php?lat=${FUEL_CENTER.lat}&lng=${FUEL_CENTER.lng}&rad=${FUEL_RADIUS_KM}&sort=dist&type=all&apikey=${encodeURIComponent(env.TANKERKOENIG_KEY)}`;
    const r = await fetch(u, { headers: { "User-Agent": "Orb Studio (https://orbstudio.org)", Accept: "application/json" }, signal: AbortSignal.timeout(9000) });
    if (!r.ok) throw new Error("http " + r.status);
    const j = await r.json();
    if (!j || j.ok !== true || !Array.isArray(j.stations)) throw new Error("api not ok");
    const stations = j.stations.map((s) => ({ name: s.name, brand: s.brand, street: s.street, place: s.place, isOpen: s.isOpen, diesel: s.diesel, e5: s.e5, e10: s.e10 }));
    const at = Date.now();
    await sharedPut(env, FUEL_KEY, { stations, at });
    return { ...fuelReport(stations, at), cached: false };
  } catch (e) {
    const old = await sharedGet(env, FUEL_KEY, 3 * 3600e3);
    if (old && old.stations) return { ...fuelReport(old.stations, old.at), cached: true, stale: true };
    return { status: "unavailable", reason: "source_down", attribution: FUEL_ATTRIBUTION };
  }
}
