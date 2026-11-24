// Паспорт крипторынка — одна запись, по которой криптофинансист решает не «куда пойдёт цена», а «сколько и как торговать сейчас».
// Сводит датчики Orb Studio в режим рынка (спокойно / нервно / шторм) по правилу метода «побеждает более осторожное»:
// режим = худший из признаков; признак, который не удалось прочитать, считается «нервно».
// Пороги волатильности и радара — из правил самих датчиков (шум радара, всплеск z ≥ 4, скачок, державшийся 2 ч);
// пороги факторов, деривативов и стейблкоинов — рабочие допущения, их проверяют по журналу сделок.
// Это не сигнал купить или продать: паспорт меняет только размер новой сделки и тип ордера.
export const REGIMES = ["calm", "nervous", "storm"];
const RANK = { calm: 0, nervous: 1, storm: 2 };
export const SIZE_PCT = { calm: 100, nervous: 50, storm: 0 };
export const RISK_PCT = { calm: 1, nervous: 0.5, storm: 0 };
const ORDER = {
  calm: { ru: "лимитный ордер; стоп сразу после входа", en: "limit order; stop right after entry" },
  nervous: { ru: "только лимитный ордер; стоп обязателен; половина плана", en: "limit orders only; stop required; half of the plan" },
  storm: { ru: "новых сделок нет; проверить стопы у открытых позиций", en: "no new trades; check the stops of open positions" },
};
const RU = { calm: "спокойно", nervous: "нервно", storm: "шторм" };
const GRAVE = /\b(hack|hacked|exploit|drained|stolen|ban|bans|banned|delist|insolven|bankrupt|halt|halts|halted|frozen|freeze|suspend|suspends|suspended|collapse|depeg|lawsuit|charged|sues|sued)\w*/i;
const worst = (a) => a.reduce((w, x) => (RANK[x] > RANK[w] ? x : w), "calm");
const r2 = (x) => (x == null || !Number.isFinite(+x) ? null : Math.round(+x * 100) / 100);

export function cryptoPassport({ radar, sensors, anomalies, noise, radarHist, now = Date.now() } = {}) {
  const checks = [], add = (id, level, value, ru, en) => checks.push({ id, level, value, say_ru: ru, say_en: en });
  const s = sensors || {};
  // 1. волатильность BTC/ETH/XRP за 24 ч против 30 дней и всплески за 6 ч
  const vc = (s.volatility && s.volatility.coins) || {}, vols = ["BTC", "ETH", "XRP"].map((c) => vc[c] && +vc[c].volatility_24h_vs_30d).filter(Number.isFinite);
  const spikes6 = ((s.volatility && s.volatility.spikes_24h) || []).filter((x) => ["BTC", "ETH", "XRP"].includes(x.coin) && now - Date.parse(x.hour_end) <= 6 * 3600e3);
  if (!vols.length) add("volatility", "nervous", null, "волатильность не прочитана — считаем «нервно»", "volatility not read — counted as nervous");
  else { const m = Math.max(...vols), lv = spikes6.length || m > 2 ? "storm" : m >= 1.3 ? "nervous" : "calm";
    add("volatility", lv, { max_24h_vs_30d: r2(m), spikes_last_6h: spikes6.length }, `волатильность ${r2(m)}× обычной${spikes6.length ? `, всплесков за 6 ч: ${spikes6.length}` : ""}`, `volatility ${r2(m)}× usual${spikes6.length ? `, spikes in 6 h: ${spikes6.length}` : ""}`); }
  // 2. крипто-радар: сдвиг за 24 ч против своего обычного хода
  const typ = noise && Number.isFinite(+noise.typical_24h_change) ? +noise.typical_24h_change : 4, big = noise && Number.isFinite(+noise.large_24h_change_p90) ? +noise.large_24h_change_p90 : 8;
  if (!radar || radar.lvl == null) add("radar", "nervous", null, "крипто-радар не прочитан — считаем «нервно»", "crypto radar not read — counted as nervous");
  else {
    const ch = radar.prev != null ? radar.lvl - radar.prev : 0, a = Math.abs(ch);
    // «шторм» по радару — только если крупный сдвиг держится все последние 2 часа (4 получасовые записи), как у детектора аномалий
    const h = (radarHist || []).filter((x) => x && x.k != null), past = h.filter((x) => +x.ts <= now - 24 * 3600e3).pop(), last4 = h.slice(-4);
    const held = past && last4.length === 4 && last4.every((x) => Math.abs(+x.k - +past.k) > big);
    const lv = a <= typ ? "calm" : held ? "storm" : "nervous";
    add("radar", lv, { level: radar.lvl, change_24h: ch, typical_24h_change: typ, large_24h_change: big, large_move_held_2h: !!held },
      `крипто-радар ${radar.lvl} (${ch >= 0 ? "+" : ""}${ch} за 24 ч; обычный ход ±${typ})`, `crypto radar ${radar.lvl} (${ch >= 0 ? "+" : ""}${ch} in 24 h; usual move ±${typ})`);
  }
  // 3. факторы «Взломы» и «Регуляторы» + подтверждённая тяжёлая новость за 6 ч
  const fac = Object.fromEntries(((radar && radar.fac) || []).map((x) => [String(x[0]), +x[1]])), hot = Math.max(fac["Взломы"] || 0, fac["Регуляторы"] || 0);
  const feed = (radar && radar.feed) || [], ver = (radar && radar.verify) || [];
  const grave = feed.map((f, i) => ({ title: f[1], source: f[2], n: ver[i], pub: f[5] || null })).filter((x) => GRAVE.test(x.title) && x.n >= 3 && (!x.pub || now - +x.pub <= 6 * 3600e3));
  if (!radar || !radar.fac) add("hacks_regulators", "nervous", null, "факторы радара не прочитаны — считаем «нервно»", "radar factors not read — counted as nervous");
  else { const lv = hot > 80 && grave.length ? "storm" : hot >= 60 ? "nervous" : "calm";
    add("hacks_regulators", lv, { hacks: fac["Взломы"] ?? null, regulators: fac["Регуляторы"] ?? null, confirmed_grave_headlines: grave.length },
      `взломы ${fac["Взломы"] ?? "?"}, регуляторы ${fac["Регуляторы"] ?? "?"}${grave.length ? `; подтверждённых тяжёлых новостей: ${grave.length}` : ""}`,
      `hacks ${fac["Взломы"] ?? "?"}, regulators ${fac["Регуляторы"] ?? "?"}${grave.length ? `; confirmed grave headlines: ${grave.length}` : ""}`); }
  // 4. деривативы Kraken Futures BTC: рост открытого интереса и сильный фандинг
  const d = s.derivatives || {}, oi = Number.isFinite(+d.change_24h_pct) ? +d.change_24h_pct : null, fu = Number.isFinite(+d.funding_relative_pct) ? +d.funding_relative_pct : null;
  if (oi == null) add("derivatives", "nervous", null, "деривативы не прочитаны — считаем «нервно»", "derivatives not read — counted as nervous");
  else { const lv = oi > 10 && fu != null && Math.abs(fu) >= 0.01 ? "storm" : oi >= 5 ? "nervous" : "calm";
    add("derivatives", lv, { open_interest_change_24h_pct: r2(oi), funding_relative_pct: fu }, `открытый интерес BTC ${oi >= 0 ? "+" : ""}${r2(oi)} % за 24 ч`, `BTC open interest ${oi >= 0 ? "+" : ""}${r2(oi)}% in 24 h`); }
  // 5. привязка USDC
  const u = s.usdc || {}, dev = Number.isFinite(+u.peg_deviation_pct) ? Math.abs(+u.peg_deviation_pct) : null;
  if (dev == null) add("stablecoin_peg", "nervous", null, "привязка USDC не прочитана — считаем «нервно»", "USDC peg not read — counted as nervous");
  else { const lv = dev > 0.5 ? "storm" : dev > 0.1 ? "nervous" : "calm"; add("stablecoin_peg", lv, { usdc_peg_deviation_pct: r2(u.peg_deviation_pct) }, `USDC отклонение от доллара ${r2(u.peg_deviation_pct)} %`, `USDC peg deviation ${r2(u.peg_deviation_pct)}%`); }
  // 6. детектор аномалий: резкие сдвиги показаний датчиков
  const sig = ((anomalies && anomalies.signals) || []).filter((x) => String(x.type || "").startsWith("value_"));
  if (!anomalies || anomalies.enabled === false) add("anomalies", "nervous", null, "детектор аномалий не прочитан — считаем «нервно»", "anomaly detector not read — counted as nervous");
  else { const lv = sig.length >= 2 ? "storm" : sig.length === 1 ? "nervous" : "calm"; add("anomalies", lv, { value_signals: sig.length, types: sig.map((x) => x.type) }, sig.length ? `резких сдвигов датчиков: ${sig.length}` : "резких сдвигов датчиков нет", sig.length ? `sharp sensor shifts: ${sig.length}` : "no sharp sensor shifts"); }

  const regime = worst(checks.map((c) => c.level)), drivers = checks.filter((c) => c.level === regime && regime !== "calm").map((c) => c.id);
  const top = feed.slice(0, 3).map((f, i) => ({ headline: f[1], source: f[2], sources_confirming: ver[i] ?? null }));
  return {
    sensor: "crypto_passport", generated_at: new Date(now).toISOString(), valid_minutes: 30,
    regime, regime_ru: RU[regime], drivers,
    new_trade_size_pct_of_plan: SIZE_PCT[regime], max_risk_per_trade_pct_of_capital: RISK_PCT[regime], order: ORDER[regime],
    checks, top_crypto_headlines: top,
    rule: "Regime = the worst of six checks; an unread check counts as nervous (the more cautious rule wins). The passport changes only the size of a new trade and the order type, never the direction.",
    not_a_signal: "Not a buy or sell signal and not a forecast. Whether the crypto radar leads prices is not yet measurable (see /api/v1/cohen, /api/v1/trackrecord). Not financial advice.",
    thresholds: { volatility: "calm < 1.3× the 30-day level, nervous 1.3–2×, storm > 2× or a spike (z ≥ 4) in the last 6 h", radar: `calm within the usual 24-h move, nervous above it, storm only if a large move (> p90) held for the last 2 hours`, hacks_regulators: "calm < 60, nervous 60–80 or above, storm > 80 with a grave headline confirmed by 3+ outlets in 6 h", derivatives: "calm OI < +5%/24 h, nervous +5–10%, storm > +10% with |funding| ≥ 0.01", stablecoin_peg: "calm ≤ 0.1%, nervous 0.1–0.5%, storm > 0.5%", anomalies: "calm none, nervous one value_* signal, storm two or more", assumption: "Factor, derivatives and stablecoin thresholds are working assumptions, to be reviewed against the trade journal after four weeks." },
    sources: { radar: "https://orbstudio.org/api/v1/radar/crypto", sensors: "https://orbstudio.org/api/v1/sensors", anomalies: "https://orbstudio.org/api/v1/anomalies", noise: "https://orbstudio.org/api/v1/trackrecord" },
  };
}
// когда режим последний раз менялся — по сохранённой истории паспортов
export function regimeHistory(rows) {
  const list = (rows || []).filter((r) => r && REGIMES.includes(r.regime)).sort((a, b) => a.ts - b.ts), changes = [];
  for (const r of list) if (!changes.length || changes[changes.length - 1].regime !== r.regime) changes.push({ at: new Date(+r.ts).toISOString(), regime: r.regime });
  const hours = { calm: 0, nervous: 0, storm: 0 }; for (const r of list) hours[r.regime] += 0.5;
  return { since: list.length ? new Date(+list[0].ts).toISOString() : null, changes: changes.slice(-20).reverse(), last_change: changes.length ? changes[changes.length - 1].at : null, hours_by_regime_7d: hours };
}
