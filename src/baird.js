// Датчик «Бэрд» — в честь Кеннета Бэрда (1923–2022), канадского метролога, создателя лазерных эталонов длины,
// участника переопределения метра (1983). Принцип метрологии: число чего-то стоит, только если прослеживается
// до эталона — известно, откуда оно, когда измерено, в каких единицах и сходится ли с независимым путём.
// Паспорт каждого числа датчиков Orb Studio: источник, время замера, возраст, единица, правдоподобие, сверка.
export const BAIRD = {
  name: "Kenneth M. Baird", years: "1923–2022",
  idea: "Metrological traceability: a measured value is meaningful only with an unbroken chain to a reference — source, time, unit and uncertainty — and when independent routes agree.",
  wiki: { en: "https://en.wikipedia.org/wiki/Kenneth_M._Baird", ru: "https://en.wikipedia.org/wiki/Kenneth_M._Baird" },
  note: "Named in his honour. Orb Studio is not connected with Kenneth Baird, his family or the National Research Council of Canada.",
};
const get = (o, p) => p.split(".").reduce((a, k) => (a == null ? undefined : a[k]), o);
// group — ключ блока в /api/v1/sensors; at — где лежит время замера; max_h — через сколько часов число считается устаревшим
// kind: primary — взято у источника как есть; derived — пересчитано Orb Studio из данных источника
export const BAIRD_ITEMS = [
  { id: "btc_futures_mark", group: "derivatives", path: "derivatives.mark_usd", at: "derivatives.at", unit: "USD per BTC", range: [1000, 1e6], max_h: 1, kind: "primary" },
  { id: "btc_funding", group: "derivatives", path: "derivatives.funding_relative_pct", at: "derivatives.at", unit: "% per funding period", range: [-1, 1], max_h: 1, kind: "primary" },
  { id: "btc_open_interest", group: "derivatives", path: "derivatives.open_interest_btc", at: "derivatives.at", unit: "BTC", range: [10, 1e6], max_h: 1, kind: "primary" },
  { id: "btc_spot_eur", group: "volatility", path: "volatility.coins.BTC.price_eur", at: "volatility.coins.BTC.hour_end", unit: "EUR per BTC (hourly close)", range: [1000, 1e6], max_h: 2, kind: "primary" },
  { id: "btc_move_z", group: "volatility", path: "volatility.coins.BTC.z_1h", at: "volatility.coins.BTC.hour_end", unit: "standard deviations (1 h move vs 30 days)", range: [-30, 30], max_h: 2, kind: "derived" },
  { id: "usdc_usd", group: "usdc", path: "usdc.usdc_usd", at: "usdc.at", unit: "USD per USDC", range: [0.8, 1.2], max_h: 1, kind: "primary" },
  { id: "usdc_eur", group: "usdc", path: "usdc.usdc_eur", at: "usdc.at", unit: "EUR per USDC", range: [0.6, 1.4], max_h: 1, kind: "primary" },
  { id: "ecb_deposit_rate", group: "ecb", path: "ecb.deposit_rate_pct.value", at: "ecb.deposit_rate_pct.date", unit: "% per year", range: [-2, 15], max_h: 24 * 4, kind: "primary" },
  { id: "ecb_eurusd", group: "ecb", path: "ecb.eurusd.value", at: "ecb.eurusd.date", unit: "USD per EUR (ECB reference rate)", range: [0.5, 2], max_h: 24 * 4, kind: "primary" },
  { id: "btc_fee_fast", group: "bitcoin", path: "bitcoin.fee_fast_sat_vb", at: "bitcoin.at", unit: "sat/vB", range: [0, 5000], max_h: 1, kind: "primary" },
  { id: "btc_hashrate", group: "bitcoin", path: "bitcoin.hashrate_ehs", at: "bitcoin.at", unit: "EH/s", range: [10, 1e5], max_h: 6, kind: "primary" },
  { id: "euro_inflation", group: "inflation", path: "inflation.hicp_annual_pct", at: "inflation.period", unit: "% year on year (HICP)", range: [-5, 30], max_h: 24 * 50, kind: "primary" },
  { id: "stablecoin_supply", group: "stablecoins", path: "stablecoins.total_usd", at: "stablecoins.date", unit: "USD", range: [1e10, 5e12], max_h: 24 * 2, kind: "primary" },
  { id: "power_now", group: "power", path: "power.now_eur_mwh", at: "power.now_at", unit: "EUR/MWh (DE-LU day-ahead)", range: [-500, 4000], max_h: 1, kind: "primary" },
  { id: "power_now_ct", group: "power", path: "power.now_ct_kwh", at: "power.now_at", unit: "ct/kWh (converted from EUR/MWh)", range: [-50, 400], max_h: 1, kind: "derived" },
  { id: "renewable_share", group: "power", path: "power.renewables.renewable_share_pct", at: "power.renewables.at", unit: "% of generation", range: [0, 100], max_h: 2, kind: "primary" },
  { id: "internet_outages", group: "internet", path: "internet.outages_24h", at: "internet.at", unit: "outages in 24 h", range: [0, 2000], max_h: 3, kind: "derived" },
  { id: "sanctioned_ships_uk", group: "sanctions", path: "sanctions.uk_ships.ships_total", at: "sanctions.uk_ships.report_date", unit: "ships", range: [1, 1e4], max_h: 24 * 14, kind: "primary" },
];
// Независимые пути к одной величине: если не сходятся — где-то ошибка единиц, курса или времени
export const BAIRD_CROSS = [
  { id: "btc_usd_two_routes", what: "BTC in USD: Kraken Futures mark price vs Kraken spot EUR × ECB EUR/USD", tol_pct: 3,
    a: (d) => get(d, "derivatives.mark_usd"), b: (d) => { const e = get(d, "volatility.coins.BTC.price_eur"), x = get(d, "ecb.eurusd.value"); return e && x ? e * x : null; } },
  { id: "eurusd_two_routes", what: "EUR/USD: ECB reference rate vs Kraken USDC/USD ÷ USDC/EUR", tol_pct: 1.5,
    a: (d) => get(d, "ecb.eurusd.value"), b: (d) => { const u = get(d, "usdc.usdc_usd"), e = get(d, "usdc.usdc_eur"); return u && e ? u / e : null; } },
  { id: "power_unit_conversion", what: "power price: ct/kWh × 10 must equal EUR/MWh", tol_pct: 0.5,
    a: (d) => get(d, "power.now_eur_mwh"), b: (d) => { const c = get(d, "power.now_ct_kwh"); return c == null ? null : c * 10; } },
];
// время замера: ISO, дата «2026-11-22», месяц «2026-10» (конец месяца), «20-Nov-2026»
export function bairdTime(v) {
  if (v == null || v === "") return null;
  const s = String(v); if (/^\d{4}-\d{2}$/.test(s)) { const [y, m] = s.split("-").map(Number); return Date.UTC(y, m, 0, 23, 59); }
  const m = s.match(/^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/); if (m) { const mi = "janfebmaraprmayjunjulaugsepoctnovdec".indexOf(m[2].toLowerCase()) / 3; if (mi >= 0) return Date.UTC(+m[3], mi, +m[1], 23, 59); }
  const t = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(s) ? s + "T23:59:00Z" : s); return Number.isFinite(t) ? t : null;
}
const r1 = (x) => Math.round(x * 10) / 10;
export function bairdItem(d, it, now) {
  const v = get(d, it.path), t = bairdTime(get(d, it.at)), g = d[it.group] || {};
  const out = { id: it.id, value: typeof v === "number" ? v : null, unit: it.unit, kind: it.kind, source: g.source || (g.uk_ships && g.uk_ships.source) || null, source_url: g.source_url || (g.uk_ships && g.uk_ships.source_url) || null,
    measured_at: t ? new Date(t).toISOString() : null, age_h: t ? r1(Math.max(0, now - t) / 3600e3) : null, max_age_h: it.max_h };
  const problems = [];
  if (out.value == null) problems.push("missing");
  else if (out.value < it.range[0] || out.value > it.range[1]) problems.push("out_of_range");
  if (!t) problems.push("no_time"); else if (out.age_h > it.max_h) problems.push("stale");
  if (!out.source) problems.push("no_source");
  if (g.stale === true) problems.push("source_reported_stale");
  return { ...out, plausible_range: it.range, status: problems.length ? (problems.includes("missing") || problems.includes("out_of_range") ? "fail" : "warn") : "traced", problems };
}
export function bairdCross(d, c) {
  const a = c.a(d), b = c.b(d);
  if (!(a > 0) || !(b > 0)) return { id: c.id, what: c.what, status: "not_checked", a: a ?? null, b: b ?? null };
  const diff = Math.round(1e4 * Math.abs(a - b) / ((a + b) / 2)) / 100;
  return { id: c.id, what: c.what, a: +a.toPrecision(6), b: +b.toPrecision(6), diff_pct: diff, tolerance_pct: c.tol_pct, status: diff <= c.tol_pct ? "agree" : "disagree" };
}
export function bairdReport(d, now = Date.now()) {
  if (!d || typeof d !== "object") return { sensor: "baird", verdict: "no_data", numbers: [], cross_checks: [], generated_at: new Date(now).toISOString() };
  const numbers = BAIRD_ITEMS.map((it) => bairdItem(d, it, now)), cross = BAIRD_CROSS.map((c) => bairdCross(d, c));
  const fail = numbers.filter((x) => x.status === "fail").length + cross.filter((x) => x.status === "disagree").length, warn = numbers.filter((x) => x.status === "warn").length;
  return {
    sensor: "baird", verdict: fail ? "broken_chain" : warn ? "partly_traced" : "traced",
    traced: numbers.filter((x) => x.status === "traced").length, warnings: warn, failures: fail, total: numbers.length,
    numbers, cross_checks: cross,
    question: "Can each number the Orb Studio sensors publish be traced to its source, with time, unit and an independent cross-check?",
    method: "For every number of /api/v1/sensors: source and link, time of measurement, age against the refresh it should have (stale above max_age_h), unit, a plausible range (out_of_range means a unit or parsing error is likely), and whether it is taken from the source as is (primary) or computed by Orb Studio (derived). Cross-checks reach the same quantity by two independent routes and compare them within a tolerance.",
    rule: "This checks the chain from source to number, not whether markets or sources are right. When you quote a number, quote its time and unit; do not quote a stale or failed one as current.",
    honour: BAIRD, similar: "Data lineage and provenance standards (W3C PROV, OpenLineage) trace data inside companies; Wikidata keeps a reference per statement. This sensor publishes a live traceability passport for every sensor number, with independent cross-checks, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
