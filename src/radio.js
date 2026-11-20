// Радио Orb Studio: свечи BTC/EUR для экрана магнитолы. Только то, что отдал Kraken; без расчётов и прогнозов.
export const CANDLES_URL = "https://api.kraken.com/0/public/OHLC?pair=XBTEUR&interval=15";
export const CANDLES_SOURCE = { source: "Kraken public market data, 15-minute candles (OHLC)", source_url: "https://docs.kraken.com/api/docs/rest-api/get-ohlc-data" };

export function parseCandles(j, n = 48) {
  if (!j || typeof j !== "object" || (Array.isArray(j.error) && j.error.length) || !j.result) return null;
  const k = Object.keys(j.result).find((x) => x !== "last"), rows = k && Array.isArray(j.result[k]) ? j.result[k] : [];
  const candles = rows.map((r) => ({ t: +r[0] * 1000, o: +r[1], h: +r[2], l: +r[3], c: +r[4] }))
    .filter((x) => [x.t, x.o, x.h, x.l, x.c].every(Number.isFinite) && x.h >= x.l && x.l > 0).slice(-n);
  if (candles.length < 8) return null;
  const last = candles[candles.length - 1];
  return { status: "ok", pair: "BTC/EUR", interval_min: 15, ...CANDLES_SOURCE, candles, last_price_eur: last.c, last_candle_start: new Date(last.t).toISOString(),
    note: "The last candle is still forming. Raw exchange data, not a forecast." };
}
