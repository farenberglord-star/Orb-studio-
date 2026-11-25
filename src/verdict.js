// Итог паспорта: подтверждено / опровергнуто / не проверено (зелёный / красный / серый).
// Добавляется РЯДОМ с confidence и ничего в нём не меняет — калибровка «Хармана» остаётся сравнимой с прошлым.
// Главная мысль: «medium» значило «ничего не знаю», но выглядело как «нормально». Здесь серое — это честное «не проверено»,
// зелёное — только при опоре на факты (независимые издания или измерение нашим датчиком), красное — при опровержении.
// Если правила тянут в разные стороны, побеждает более осторожное: красное сильнее зелёного.
import { DEBUNK, dealPressure, namedSource, orbTopics } from "./passport-lab.js";

export const SATIRE_HOSTS = ["panorama.pub", "theonion.com", "babylonbee.com", "der-postillon.com", "dailymash.co.uk", "duffelblog.com", "waterfordwhispersnews.com", "newsthump.com", "clickhole.com"];
export const hostOf = (link) => { try { return new URL(String(link)).hostname.toLowerCase().replace(/^www\./, ""); } catch { return null; } };
export const isDebunkText = (s) => DEBUNK.test(String(s || ""));

const COINS = [["BTC", /биткоин\p{L}*|bitcoin|(?<![\p{L}])btc(?![\p{L}])/iu], ["ETH", /эфир\p{L}*|ethereum|(?<![\p{L}])eth(?![\p{L}])/iu], ["XRP", /(?<![\p{L}])xrp(?![\p{L}])|ripple/iu], ["SOL", /solana|(?<![\p{L}])sol(?![\p{L}])/iu]];
const PRICE_WORDS = /курс|цена|стоит|стоимост|price|trad(?:es|ing) at|kurs|kostet|за один|per (?:one )?(?:coin|bitcoin)|сейчас|now/iu;
const SCALE = /^\s*(?:млн|млрд|million|billion|mn|bn|тыс|thousand|k\b)/iu;
export function parseNum(s) { let t = String(s).replace(/[\s  ]/g, ""); if (/^\d{1,3}([.,]\d{3})+$/.test(t) && !/^0[.,]/.test(t)) t = t.replace(/[.,]/g, ""); else t = t.replace(",", "."); const n = parseFloat(t); return Number.isFinite(n) ? n : null; }
// Сверка названной цены монеты с нашим датчиком (/api/v1/sensors: часовая цена в EUR с Kraken, EUR/USD от ЕЦБ).
export function measuredCrypto(text, sens) {
  const t = String(text || ""), coin = (COINS.find(([, re]) => re.test(t)) || [])[0];
  if (!coin || !PRICE_WORDS.test(t)) return null;
  const cs = sens && sens.volatility && sens.volatility.coins && sens.volatility.coins[coin];
  if (!cs || !Number.isFinite(+cs.price_eur)) return null;
  const hourEnd = Date.parse(cs.hour_end); if (Number.isFinite(hourEnd) && Date.now() - hourEnd > 3 * 3600e3) return null; // датчик старый — не судим
  const eurusd = sens.ecb && sens.ecb.eurusd && +sens.ecb.eurusd.value;
  let m, cur = null, claimed = null;
  const re1 = /(?:\$|usd\s?|us\$)\s?(\d[\d\s .,]*\d|\d)(?!\d)/iu, re2 = /(\d[\d\s .,]*\d|\d)\s?(\$|usd|долл\p{L}*|dollars?)/iu, re3 = /(?:€|eur\s?)\s?(\d[\d\s .,]*\d|\d)|(\d[\d\s .,]*\d|\d)\s?(€|eur|евро|euros?)/iu;
  if ((m = t.match(re1))) { cur = "USD"; claimed = parseNum(m[1]); if (SCALE.test(t.slice(m.index + m[0].length))) return null; }
  else if ((m = t.match(re2))) { cur = "USD"; claimed = parseNum(m[1]); }
  else if ((m = t.match(re3))) { cur = "EUR"; claimed = parseNum(m[1] || m[2]); if (SCALE.test(t.slice(m.index + m[0].length))) return null; }
  if (claimed == null || claimed <= 0) return null;
  let ours; if (cur === "EUR") ours = +cs.price_eur; else { if (!Number.isFinite(eurusd) || eurusd <= 0) return null; ours = +cs.price_eur * eurusd; }
  const diff = claimed / ours - 1;
  return { coin, currency: cur, claimed, ours: Math.round(ours), diff_pct: Math.round(diff * 1000) / 10, hour_end: cs.hour_end || null,
    result: Math.abs(diff) <= 0.04 ? "match" : Math.abs(diff) >= 0.12 ? "mismatch" : "close_not_exact" };
}

// inp: { headline, voices, debunk, measured, host, source, act, rumourRisk, checkability }
export function finalVerdict(inp = {}) {
  const h = String(inp.headline || ""), voices = Number.isFinite(+inp.voices) && inp.voices !== null ? +inp.voices : null, debunk = +inp.debunk || 0;
  const mk = (state, kind, ru, en, extra) => ({ state, color: state === "confirmed" ? "green" : state === "refuted" ? "red" : "grey", kind, ru, en, ...(extra || {}) });
  if (inp.host && SATIRE_HOSTS.includes(inp.host)) return mk("refuted", "satire", "Источник заявляет себя сатирой: это не новость", "The source declares itself satire: not news");
  const money = dealPressure(h);
  if (money.push) return mk("refuted", "money_push", "Призыв к сделке с деньгами (" + money.hits.join(", ") + "): это не новость", "Pressure to act with money (" + money.hits.join(", ") + "): not news");
  if (debunk >= 1 && (voices == null || voices < 2)) return mk("refuted", "debunked", `Есть опровержения (${debunk}), а как новость это почти никто не повторяет`, `Debunked (${debunk} item(s)); almost nobody repeats it as news`);
  const named = namedSource(h), orb = named && /^orb studio$/i.test(named);
  if (orb) {
    const topics = orbTopics(h);
    if (!topics.length) return mk("refuted", "false_attribution", "Названа Orb Studio, но такого мы не публикуем", "Orb Studio is named, but we do not publish this");
  }
  const ms = inp.measured;
  if (ms && ms.result === "mismatch") return mk("refuted", "measured_mismatch", `Наш датчик показывает другое: ${ms.label || ms.coin} ≈ ${ms.ours} ${ms.unit || ms.currency}, в заметке ${ms.claimed} (${ms.diff_pct > 0 ? "+" : ""}${ms.diff_pct} %)`, `Our sensor disagrees: ${ms.label || ms.coin} ≈ ${ms.ours} ${ms.unit || ms.currency}, the claim says ${ms.claimed} (${ms.diff_pct} %)`, { measured: ms });
  if (ms && ms.result === "match") return mk("confirmed", "measured_match", `Совпадает с нашим датчиком: ${ms.label || ms.coin} ≈ ${ms.ours} ${ms.unit || ms.currency}`, `Matches our sensor: ${ms.label || ms.coin} ≈ ${ms.ours} ${ms.unit || ms.currency}`, { measured: ms });
  if (ms && ms.result === "close_not_exact") return mk("unverified", "measured_close", "Рядом с нашим датчиком, но не точно: сверь по бирже", "Near our sensor but not exact: check the exchange", { measured: ms });
  if (debunk >= 1) return mk("unverified", "reported_and_debunked", "И повторяют, и опровергают: сначала прочти опровержение", "Both reported and debunked: read the debunk first");
  if (voices != null && voices >= 3 && inp.checkability === "checkable" && inp.act === "event" && !inp.rumourRisk) return mk("confirmed", "independent_outlets", `${voices} независимых изданий, есть что проверить, опровержений нет`, `${voices} independent outlets, checkable, no debunk found`);
  if (voices != null && voices >= 3) return mk("unverified", "reported_not_event", "Много изданий пересказывают, но это не проверяемое событие (заявление, прогноз или расплывчато)", "Many outlets repeat it, but it is not a checkable event (statement, forecast or vague)");
  return mk("unverified", voices == null ? "no_outlet_count" : "few_outlets", voices == null ? "Число независимых изданий неизвестно: не проверено" : `Мало независимых изданий (${voices}): не проверено`, voices == null ? "Number of independent outlets unknown: unverified" : `Few independent outlets (${voices}): unverified`);
}
