// «Карта задержек реальности»: насколько свежа каждая цифра Orb Studio.
// Для каждого датчика — время, к которому относятся данные источника (не время нашего запроса, где источник его сообщает),
// возраст в часах, обычный для источника предел и статус. Это не оценка качества источника, а честная отметка: живое, дневное, месячное или годовое.
// Чистые функции: данные собирает worker.js (freshnessData).

const H = 3600e3;
// expect_h — какой возраст данных у источника нормален, если всё идёт по расписанию (частота обновления + обычная задержка публикации).
// kind: measure — регулярный замер; event — лента событий (возраст = время последнего события, «опоздания» нет); manual — ручной ввод.
export const CATALOG = [
  { id: "radars", src: "radars", endpoint: "/api/v1/radars", expect_h: 1, kind: "measure", source: "Orb Studio news radars (RSS of news outlets)",
    name: { ru: "Новостные радары", de: "Nachrichten-Radare", en: "News radars" }, get: (d) => oldest((Array.isArray(d) ? d : d && d.radars || []).map((r) => r && r.updated_at)) }, // внутри воркера — массив, в /api/v1/radars — {radars}
  { id: "crypto_derivatives", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 1, kind: "measure", source: "Kraken Futures",
    name: { ru: "Крипто-деривативы", de: "Krypto-Derivate", en: "Crypto derivatives" }, get: (d) => blk(d, "derivatives", "at") },
  { id: "crypto_volatility", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 1, kind: "measure", source: "Kraken",
    name: { ru: "Волатильность крипты", de: "Krypto-Volatilität", en: "Crypto volatility" }, get: (d) => blk(d, "volatility", "at") },
  { id: "usdc", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 1, kind: "measure", source: "Kraken",
    name: { ru: "USDC (курс)", de: "USDC (Kurs)", en: "USDC (rate)" }, get: (d) => blk(d, "usdc", "at") },
  { id: "bitcoin_network", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 1, kind: "measure", source: "mempool.space",
    name: { ru: "Сеть биткоина", de: "Bitcoin-Netzwerk", en: "Bitcoin network" }, get: (d) => blk(d, "bitcoin", "at") },
  { id: "stablecoins", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 48, kind: "measure", source: "DefiLlama",
    name: { ru: "Стейблкоины (объём)", de: "Stablecoins (Volumen)", en: "Stablecoins (supply)" }, get: (d) => blk(d, "stablecoins", "date") },
  { id: "ecb_rate", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 96, kind: "measure", source: "ECB Data Portal",
    name: { ru: "Ставка ЕЦБ и EUR/USD", de: "EZB-Zins und EUR/USD", en: "ECB rate and EUR/USD" }, get: (d) => oldest([sub(d, "ecb", "deposit_rate_pct", "date"), sub(d, "ecb", "eurusd", "date")]) },
  { id: "inflation_ea", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 50 * 24, kind: "measure", source: "Eurostat HICP",
    name: { ru: "Инфляция еврозоны", de: "Inflation Euroraum", en: "Euro area inflation" }, get: (d) => blk(d, "inflation", "period") },
  { id: "power_price_de", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 2, kind: "measure", source: "Energy-Charts (Fraunhofer ISE)",
    name: { ru: "Цена электричества (DE)", de: "Strompreis (DE)", en: "Power price (DE)" }, get: (d) => blk(d, "power", "now_at") },
  { id: "internet", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 3, kind: "measure", source: "IODA, OONI",
    name: { ru: "Сбои и блокировки интернета", de: "Internet-Ausfälle und Sperren", en: "Internet outages and blocking" }, get: (d) => blk(d, "internet", "at") }, // конец суточного окна IODA/OONI
  { id: "sanctions_uk_ships", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 14 * 24, kind: "measure", source: "UK Sanctions List (FCDO)",
    name: { ru: "Санкции против судов (UK)", de: "Sanktionen gegen Schiffe (UK)", en: "Ship sanctions (UK)" }, get: (d) => sub(d, "sanctions", "uk_ships", "report_date") },
  { id: "wiki_attention_en", src: "sensors", endpoint: "/api/v1/sensors", expect_h: 48, kind: "measure", source: "Wikimedia Pageviews",
    name: { ru: "Внимание к темам (en.wikipedia)", de: "Aufmerksamkeit (en.wikipedia)", en: "Topic attention (en.wikipedia)" }, get: (d) => blk(d, "attention", "day") },
  { id: "earthquakes", src: "quakes", endpoint: "/api/v1/quakes", expect_h: 1, kind: "measure", source: "USGS",
    name: { ru: "Землетрясения", de: "Erdbeben", en: "Earthquakes" }, get: (d) => d && d.feed_generated },
  { id: "disasters", src: "disasters", endpoint: "/api/v1/disasters", expect_h: null, kind: "event", source: "GDACS (UN, European Commission)",
    name: { ru: "Катастрофы по миру", de: "Katastrophen weltweit", en: "Disasters worldwide" }, get: (d) => d && d.latest_update },
  { id: "food_prices_world", src: "food", endpoint: "/api/v1/food-prices", expect_h: 70 * 24, kind: "measure", source: "FAO Food Price Index",
    name: { ru: "Мировые цены на еду (FAO)", de: "Weltweite Lebensmittelpreise (FAO)", en: "World food prices (FAO)" }, get: (d) => d && d.ok !== false && d.month },
  { id: "outbreaks", src: "outbreaks", endpoint: "/api/v1/outbreaks", expect_h: null, kind: "event", source: "WHO Disease Outbreak News",
    name: { ru: "Вспышки болезней (ВОЗ)", de: "Krankheitsausbrüche (WHO)", en: "Disease outbreaks (WHO)" }, get: (d) => d && d.latest_published },
  { id: "displacement", src: "displacement", endpoint: "/api/v1/displacement", expect_h: 365 * 24, kind: "measure", source: "UNHCR Refugee Data Finder",
    name: { ru: "Вынужденно перемещённые (УВКБ)", de: "Vertriebene (UNHCR)", en: "Forcibly displaced (UNHCR)" }, get: (d) => d && d.ok !== false && d.as_of },
  { id: "chokepoints", src: "chokepoints", endpoint: "/api/v1/chokepoints", expect_h: 17 * 24, // файл HDX раз в неделю + опоздание данных ~9 дней: нормальный возраст 9–16 дней
    kind: "measure", source: "IMF PortWatch (via HDX)",
    name: { ru: "Морские узкие места (Ормуз и др.)", de: "Meerengen (Hormus u. a.)", en: "Maritime chokepoints (Hormuz etc.)" }, get: (d) => d && d.ok !== false && d.data_through },
  { id: "space_weather", src: "space", endpoint: "/api/v1/space", expect_h: 1, kind: "measure", source: "NOAA SWPC",
    name: { ru: "Космическая погода", de: "Weltraumwetter", en: "Space weather" }, get: (d) => d && d.solar_wind && d.solar_wind.time },
  { id: "radiation_de", src: "radiation", endpoint: "/api/v1/radiation", expect_h: 4, kind: "measure", source: "BfS ODL",
    name: { ru: "Гамма-фон (DE)", de: "Gamma-Ortsdosisleistung (DE)", en: "Gamma dose rate (DE)" }, get: (d) => d && d.latest_measurement_at },
  { id: "flood_de", src: "flood", endpoint: "/api/v1/hydro/flood-warnings", expect_h: 3, kind: "measure", source: "LHP (hochwasserzentralen.de)",
    name: { ru: "Паводковые предупреждения (DE)", de: "Hochwasserwarnungen (DE)", en: "Flood warnings (DE)" }, get: (d) => d && d.stand },
  { id: "elbe", src: "elbe", endpoint: "/api/v1/hydro/sea", expect_h: 2, kind: "measure", source: "PEGELONLINE (WSV)",
    name: { ru: "Уровень Эльбы", de: "Elbe-Pegel", en: "Elbe water level" }, get: (d) => newest((d && d.stations || []).map((s) => s && s.measured_at)) },
  { id: "weather_at", src: "weather_at", endpoint: "/api/v1/weather-at", expect_h: 2, kind: "measure", source: "GeoSphere Austria (TAWES)",
    name: { ru: "Погода Австрии", de: "Wetter Österreich", en: "Austria weather" }, get: (d) => d && d.observed_at },
  { id: "gas_storage", src: "gas", endpoint: "/api/v1/gas/storage", expect_h: 72, kind: "measure", source: "GIE AGSI+",
    name: { ru: "Газовые хранилища", de: "Gasspeicher", en: "Gas storage" }, get: (d) => d && d.gas_day },
  { id: "party_polls", src: "parties", endpoint: "/api/v1/party-polls", expect_h: 7 * 24, kind: "measure", source: "DAWUM",
    name: { ru: "Parteien-Radar (опросы по партиям)", de: "Parteien-Radar (Umfragen je Partei)", en: "Parteien-Radar (polls per party)" }, get: (d) => d && d.database_updated_at },
  { id: "polls_de", src: "polls", endpoint: "/api/v1/polls", expect_h: 7 * 24, kind: "measure", source: "DAWUM",
    name: { ru: "Опросы (Sonntagsfrage)", de: "Umfragen (Sonntagsfrage)", en: "Polls (Sonntagsfrage)" }, get: (d) => d && d.database_updated_at },
  { id: "party_attention", src: "party", endpoint: "/api/v1/polls/attention", expect_h: 48, kind: "measure", source: "Wikimedia Pageviews",
    name: { ru: "Внимание к партиям", de: "Aufmerksamkeit für Parteien", en: "Party attention" }, get: (d) => d && d.day },
  { id: "roads_hamburg", src: "roads", endpoint: "/api/v1/roads", expect_h: 1, kind: "measure", source: "Autobahn GmbH",
    name: { ru: "Автобаны вокруг Гамбурга", de: "Autobahnen um Hamburg", en: "Motorways around Hamburg" }, get: (d) => d && d.updated },
  { id: "parking", src: "parking", endpoint: "/api/v1/parking-de", expect_h: 1, kind: "measure", source: "Karlsruhe, Leipzig open data",
    name: { ru: "Парковки", de: "Parkhäuser", en: "Parking" }, get: (d) => newest((d && d.items || []).map((x) => x && x.updated_at)) },
  { id: "aviation_hamburg", src: "aviation", endpoint: "/api/v1/aviation", expect_h: 1, kind: "measure", source: "adsb.lol (ADS-B)",
    name: { ru: "Небо над Гамбургом", de: "Himmel über Hamburg", en: "Sky over Hamburg" }, get: (d) => d && d.generated_at },
  { id: "bafin", src: "bafin", endpoint: "/api/v1/finance/bafin-measures", expect_h: null, kind: "event", source: "BaFin",
    name: { ru: "Меры надзора BaFin", de: "BaFin-Maßnahmen", en: "BaFin measures" }, get: (d) => d && d.latest_published },
  { id: "prices_hamburg", src: "prices", endpoint: "/api/v1/prices", expect_h: null, kind: "manual", source: "photos of receipts and price tags",
    name: { ru: "Цены в Гамбурге (чеки)", de: "Preise Hamburg (Belege)", en: "Hamburg prices (receipts)" }, get: (d) => newest((d && d.entries || []).map((x) => x && x.day)) },
  { id: "bank_tariffs", src: "tariffs", endpoint: "/api/v1/tariffs", expect_h: null, kind: "manual", source: "banks' official documents",
    name: { ru: "Тарифы банков", de: "Bankentgelte", en: "Bank tariffs" }, get: (d) => d && d.updated_at },
  { id: "safeworld_official", src: "safeworld", endpoint: "/safeworld-data.json", expect_h: 548 * 24, kind: "measure", source: "BKA, Eurostat, UNODC, NCMEC",
    name: { ru: "Безопасный мир (официальная статистика)", de: "Sichere Welt (amtliche Statistik)", en: "Safe World (official statistics)" },
    get: (d) => newest((d && d.figures || []).map((f) => f && /^\d{4}$/.test(String(f.year)) ? String(f.year) : null)) },
  { id: "safeworld_noise", src: "noise", endpoint: "/api/v1/safeworld/noise", expect_h: 9 * 24, kind: "measure", source: "GDELT, Wikimedia Pageviews",
    name: { ru: "Безопасный мир (внимание СМИ)", de: "Sichere Welt (Medienaufmerksamkeit)", en: "Safe World (media attention)" }, get: (d) => d && d.ok && d.week && d.week.to },
];

function blk(d, k, f) { const b = d && d[k]; return b && typeof b === "object" ? b[f] : null; }
function sub(d, k, s, f) { const b = d && d[k] && d[k][s]; return b && typeof b === "object" ? b[f] : null; }

const MON = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };
// Время, к которому относятся данные. Дата без времени — конец этого дня (UTC), месяц — конец месяца, год — конец года.
export function toMs(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim();
  let m;
  if ((m = /^(\d{4})$/.exec(s))) return Date.UTC(+m[1] + 1, 0, 1) - 1;
  if ((m = /^(\d{4})-(\d{2})$/.exec(s))) return Date.UTC(+m[1], +m[2], 1) - 1;
  if ((m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s))) return Date.UTC(+m[1], +m[2] - 1, +m[3] + 1) - 1;
  if ((m = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/.exec(s)) && MON[m[2].toLowerCase()] != null) return Date.UTC(+m[3], MON[m[2].toLowerCase()], +m[1] + 1) - 1;
  if (!/^\d{4}-\d{2}-\d{2}T/.test(s)) return null;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : null;
}
// Точность метки источника: year, month, day или time — чтобы не показывать «01.01.2026, 00:59» вместо «2025».
export function precision(v) {
  const s = String(v == null ? "" : v).trim();
  return /^\d{4}$/.test(s) ? "year" : /^\d{4}-\d{2}$/.test(s) ? "month" : /^\d{4}-\d{2}-\d{2}$/.test(s) || /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(s) ? "day" : "time";
}
function pick(a, better) { let best = null, bt = null; for (const v of a) { const t = toMs(v); if (t != null && (bt == null || better(t, bt))) { best = v; bt = t; } } return best; }
function oldest(a) { return pick(a, (x, y) => x < y); }
function newest(a) { return pick(a, (x, y) => x > y); }

// Класс частоты по нормальному возрасту.
export function cadenceClass(expect_h) {
  if (expect_h == null) return "irregular";
  return expect_h <= 2 ? "minutes" : expect_h <= 96 ? "days" : expect_h <= 60 * 24 ? "months" : "years";
}

// Наблюдение: ответил ли источник и какую метку времени дал. Хранится между запросами (маленькое), из него строится строка карты.
export function observe(c, d) {
  if (!d || (typeof d === "object" && d.ok === false && c.id !== "safeworld_noise")) return { responded: false, raw: null };
  let raw = null;
  try { raw = c.get(d); } catch (e) { raw = null; }
  return { responded: true, raw: raw == null ? null : String(raw).slice(0, 40) };
}
// d — ответ источника (null — источник не ответил). Статусы: on_time, late (до 2× нормы), stale, unknown (источник не сообщает время), no_data, event.
export function row(c, d, now = Date.now()) { return rowFrom(c, observe(c, d), now); }
export function rowFrom(c, o, now = Date.now()) {
  const base = { id: c.id, name: c.name, source: c.source, endpoint: c.endpoint, kind: c.kind, expect_h: c.expect_h, cadence: cadenceClass(c.expect_h) };
  if (!o || !o.responded) return { ...base, data_time: null, age_h: null, status: "no_data" };
  const raw = o.raw, at = Number.isFinite(o.checked) ? Math.min(o.checked, now) : now; // возраст — на момент последней проверки источника
  const t = toMs(raw);
  if (t == null) return { ...base, data_time: null, age_h: null, status: c.id === "safeworld_noise" ? "no_data" : "unknown" };
  const age_h = Math.max(0, Math.round(((at - t) / H) * 10) / 10);
  const status = c.expect_h == null ? "event" : age_h <= c.expect_h ? "on_time" : age_h <= 2 * c.expect_h ? "late" : "stale";
  return { ...base, data_time: new Date(t).toISOString(), data_precision: precision(raw), source_value: String(raw).slice(0, 40), checked_at: new Date(at).toISOString(), age_h, status };
}

export const STATUSES = ["on_time", "late", "stale", "unknown", "no_data", "event"];
export function build(sources, now = Date.now()) { return buildFromObs(Object.fromEntries(CATALOG.map((c) => [c.id, observe(c, sources ? sources[c.src] : null)])), now); }
// obs: { id: {responded, raw} } — например, сохранённые наблюдения, обновляемые по очереди.
export function buildFromObs(obs, now = Date.now()) {
  const rows = CATALOG.map((c) => rowFrom(c, obs ? obs[c.id] : null, now));
  const summary = Object.fromEntries(STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length]));
  const byCad = Object.fromEntries(["minutes", "days", "months", "years", "irregular"].map((k) => [k, rows.filter((r) => r.cadence === k).length]));
  rows.sort((a, b) => (a.age_h == null) - (b.age_h == null) || (a.age_h || 0) - (b.age_h || 0));
  // Готовый ответ на вопрос агента «какие датчики можно брать прямо сейчас»: только по времени данных, не по точности
  const ids = (f) => rows.filter(f).map((r) => r.id);
  const answer = { question: "Which Orb Studio sensors can I rely on right now?",
    use_now: ids((r) => r.status === "on_time" || r.status === "event"),
    check_age_first: ids((r) => r.status === "late"),
    do_not_rely_on: ids((r) => r.status === "stale" || r.status === "no_data" || r.status === "unknown"),
    note: "Timeliness only: on_time and event sensors are fresh for their own source; late sensors are up to twice their normal age; stale, unknown and no_data have no trustworthy time. Fresh does not mean accurate." };
  return {
    schema: "orb.freshness.v1", checked_at: new Date(now).toISOString(), answer, summary, by_cadence: byCad, sensors: rows,
    rule: "Sources are re-checked in turns (a few per call and every 6 minutes by a scheduled job). age_h is measured at checked_at, the moment Orb Studio last asked the source. If a source does not answer, its last time stamp stays and checked_at moves on, so the age keeps growing. data_precision says what the source gave (time, day, month or year); source_value is that label as published. data_time is the time the source's data refers to (a date alone = end of that day UTC, a month = end of month, a year = end of year). age_h = hours since data_time. expect_h = the age that is normal for this source when it runs on schedule (update interval plus usual publication delay). on_time: age <= expect_h; late: up to 2x; stale: more; unknown: the source does not say when its data was measured; no_data: the source did not answer; event: event feed or manual input, age only, no lateness.",
    note: "Read every Orb Studio number together with its age: a live price, a daily gas day and a yearly crime statistic describe different moments. This map judges timeliness only, not accuracy.",
    page: "https://orbstudio.org/sensors#freshness",
  };
}
