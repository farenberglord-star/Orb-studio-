// ================= Сводка для LLM: весь сайт в 1–2 тыс. токенов =================
// GET /api/v1/brief        — бесплатно: сводка, собранная не позже чем час назад (узкая проверка по нашим лентам).
// GET /api/v1/brief/fresh  — 0,01 USDC по x402 v2 (Base): сводка, собранная прямо сейчас, с широкой проверкой
//                            заголовков (сколько изданий пишут то же самое, Bing News за 2 дня).
// Агенту не нужно звать /radars, /radar/<id>, /sensors и /quakes по отдельности и разбирать большие JSON:
// один короткий текст с источниками и пометкой «подтверждено / один источник». Это экономия токенов и вызовов.
//
// Безопасность как у MIDI скрипки: модуль получает только cfg продажи (публичный адрес кошелька, фасилитатор),
// сводка собирается ДО settle, деньги списываются только если есть что отдать, повтор той же подписи не списывает дважды.
import { CORS } from "./violin-sale.js";
import { paidFlow, paymentRequiredFor } from "./x402-flow.js";

export const BRIEF_PRICE_ATOMIC = "10000"; // 0,01 USDC
export const BRIEF_PRICE_USD = 0.01;
export const BRIEF_FREE_MAX_AGE_MS = 60 * 60e3;
const ORIGIN = "https://orbstudio.org";
export const BRIEF_RESOURCE = ORIGIN + "/api/v1/brief/fresh";
const DESCRIPTION = "World brief for LLM agents, built at request time: all Orb Studio news radars (risk 0-100, 24h change, top headlines with how many outlets confirm each), markets (BTC/ETH/SOL, funding, stablecoins, ECB, inflation), German power price, Bitcoin network, internet outages, attention surges, earthquakes, sanctioned ships, in about 1-2k tokens with sources. Free version up to 1 hour old: " + ORIGIN + "/api/v1/brief";
export const VERDICT_RULE = "verdict = how many different outlets carry the same story: confirmed 3+, two_sources 2, single_source 1. It measures spread, not truth.";

export const verdictOf = (n) => (n == null ? null : n >= 3 ? "confirmed" : n === 2 ? "two_sources" : n >= 1 ? "single_source" : null);

// ---------- форматирование ----------
const num = (v) => (typeof v === "number" && isFinite(v) ? v : null);
function fmt(v, digits = 0) {
  const x = num(v); if (x == null) return null;
  return x.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
function pct(v, digits = 1) { const x = num(v); return x == null ? null : (x > 0 ? "+" : x < 0 ? "−" : "±") + Math.abs(x).toFixed(digits) + " %"; }
function signed(v) { const x = num(v); return x == null ? "?" : x > 0 ? "+" + x : x < 0 ? "−" + Math.abs(x) : "±0"; }
const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const join = (parts, sep = "; ") => parts.filter(Boolean).join(sep);
const iso = (d) => new Date(d).toISOString().replace(/\.\d+Z$/, "Z");
const hm = (t) => { const d = new Date(t); return isNaN(d) ? null : d.toISOString().slice(0, 16).replace("T", " ") + " UTC"; };

// ---------- сборка (чистая функция, без сети) ----------
// radars: как в allRadars (feed = [time, title, source, weight, link, ts]); counts[i][j] — сколько изданий у j-го заголовка i-го радара
// sensors: как /api/v1/sensors; quakes: как /api/v1/quakes; titles: { id: "English title" }
export function buildBrief({ radars = [], sensors = null, quakes = null, counts = null, titles = {}, tier = "delayed", wide = false, now = Date.now() }) {
  const L = [];
  const at = iso(now);
  L.push(`# Orb Studio world brief · ${at.slice(0, 16).replace("T", " ")} UTC · ${tier === "fresh" ? "fresh (built at request)" : "free (up to 1 h old)"}`);
  L.push("Indicators from open sources, not advice or forecasts. " + VERDICT_RULE + (wide ? " Checked against news search (2 days)." : " Counted in Orb Studio's own feeds only."));

  // радары
  const rOut = [];
  const sorted = radars.map((r, i) => ({ r, i })).sort((a, b) => (b.r.lvl || 0) - (a.r.lvl || 0));
  if (sorted.length) {
    L.push("", "## News radars (risk 0–100, change 24h)");
    for (const { r, i } of sorted) {
      const title = titles[r.id] || r.title || r.id, d = num(r.lvl) != null && num(r.prev) != null ? r.lvl - r.prev : null;
      L.push(`- ${title} [${r.id}]: ${r.lvl ?? "?"} (${signed(d)})`);
      const heads = [];
      for (const [j, f] of (r.feed || []).slice(0, 2).entries()) {
        const n = counts && counts[i] ? counts[i][j] ?? null : null, v = verdictOf(n);
        L.push(`  · "${clip(f[1], 140)}" — ${f[2] || "?"}${v ? `, ${v} (${n})` : ""}`);
        heads.push({ title: clip(f[1], 200), source: f[2] || null, link: f[4] || null, published: f[5] ? iso(f[5]) : null, sources_confirming: n, verdict: v });
      }
      rOut.push({ id: r.id, title, risk_index: r.lvl ?? null, delta_24h: d, headlines: heads });
    }
  }

  // рынки
  const s = sensors || {};
  const m = [];
  const coins = (s.volatility && s.volatility.coins) || {};
  const coinLine = ["BTC", "ETH", "SOL"].map((c) => { const x = coins[c]; if (!x || num(x.price_eur) == null) return null;
    return `${c} ${fmt(x.price_eur, x.price_eur < 100 ? 2 : 0)} EUR (24h ${pct(x.move_24h_pct) ?? "?"}${num(x.volatility_24h_vs_30d) != null ? `, volatility ${x.volatility_24h_vs_30d}× 30d` : ""})`; });
  if (coinLine.some(Boolean)) m.push(join(coinLine));
  const spikes = (s.volatility && Array.isArray(s.volatility.spikes_24h)) ? s.volatility.spikes_24h : null;
  if (spikes) m.push(`Volatility spikes 24h (hourly move ≥ 4 typical moves): ${spikes.length}` + (spikes.length ? " — " + spikes.slice(0, 3).map((x) => join([x.coin || x.asset, pct(x.move_pct ?? x.move_1h_pct), x.at || x.hour_end ? hm(x.at || x.hour_end) : null], " ")).join(", ") : ""));
  const dv = s.derivatives;
  if (dv && num(dv.funding_relative_pct) != null) m.push(join([`BTC perpetual funding ${dv.funding_relative_pct > 0 ? "+" : ""}${dv.funding_relative_pct.toFixed(4)} % per period (positive: longs pay shorts)`, num(dv.open_interest_btc) != null ? `open interest ${fmt(dv.open_interest_btc)} BTC (24h ${pct(dv.change_24h_pct) ?? "?"})` : null], ", "));
  const u = s.usdc, st = s.stablecoins;
  const stab = join([u && num(u.usdc_usd) != null ? `USDC/USD ${u.usdc_usd} (peg ${pct(u.peg_deviation_pct, 2)})` : null, st && num(st.total_usd) != null ? `stablecoins total ${fmt(st.total_usd / 1e9, 1)} bn USD (7d ${pct(st.change_7d_pct) ?? "?"})` : null]);
  if (stab) m.push(stab);
  const macro = join([s.ecb && s.ecb.deposit_rate_pct && num(s.ecb.deposit_rate_pct.value) != null ? `ECB deposit rate ${s.ecb.deposit_rate_pct.value} %` : null,
    s.ecb && s.ecb.eurusd && num(s.ecb.eurusd.value) != null ? `EUR/USD ${s.ecb.eurusd.value} (${s.ecb.eurusd.date})` : null,
    s.inflation && num(s.inflation.hicp_annual_pct) != null ? `euro area inflation ${s.inflation.hicp_annual_pct} % (${s.inflation.period})` : null]);
  if (macro) m.push(macro);
  if (m.length) { L.push("", "## Markets"); m.forEach((x) => L.push("- " + x)); }

  // энергия
  const p = s.power;
  if (p && num(p.now_eur_mwh) != null) {
    L.push("", "## Energy (Germany, wholesale day-ahead, not household tariff)");
    L.push("- " + join([`now ${fmt(p.now_eur_mwh)} EUR/MWh`, p.today && num(p.today.min_eur_mwh) != null ? `today ${fmt(p.today.min_eur_mwh)}–${fmt(p.today.max_eur_mwh)}, avg ${fmt(p.today.avg_eur_mwh)}` : null,
      p.today && p.today.negative_quarter_hours ? `${p.today.negative_quarter_hours} negative quarter-hours` : null,
      p.renewables && num(p.renewables.renewable_share_pct) != null ? `renewables ${p.renewables.renewable_share_pct} %` : null,
      p.cheapest_3h ? `cheapest 3 h from ${hm(p.cheapest_3h.from)}` : null]));
  }

  // сети
  const n = [];
  const bt = s.bitcoin;
  if (bt && num(bt.fee_fast_sat_vb) != null) n.push(join([`Bitcoin fees ${bt.fee_fast_sat_vb} sat/vB`, num(bt.mempool_tx) != null ? `mempool ${fmt(bt.mempool_tx)} tx` : null, num(bt.hashrate_ehs) != null ? `hashrate ${fmt(bt.hashrate_ehs)} EH/s` : null], ", "));
  const net = s.internet;
  if (net && num(net.outages_24h) != null) {
    const ong = (net.outages || []).filter((o) => o && o.ongoing).slice(0, 4).map((o) => `${o.country || o.cc} ${Math.round(o.hours || 0)} h`);
    n.push(`Internet outages (IODA, 24h): ${net.outages_24h}` + (ong.length ? `; ongoing: ${ong.join(", ")}` : ""));
    const blocks = (net.blocks || net.blocking || []);
    if (Array.isArray(blocks) && blocks.length) n.push("Confirmed web blocking (OONI, 24h): " + blocks.slice(0, 5).map((b) => b.country || b.cc || "?").join(", "));
  }
  if (n.length) { L.push("", "## Networks"); n.forEach((x) => L.push("- " + x)); }

  // внимание
  const att = s.attention && Array.isArray(s.attention.articles) ? s.attention.articles : [];
  const surge = att.filter((a) => num(a.ratio) != null && a.ratio >= 2.5).sort((a, b) => b.ratio - a.ratio).slice(0, 5);
  const top = att.filter((a) => num(a.ratio) != null).sort((a, b) => b.ratio - a.ratio).slice(0, 3);
  if (att.length) {
    L.push("", "## Attention (English Wikipedia views yesterday vs usual day; surge = 2.5×)");
    L.push("- " + (surge.length ? "Surges: " + surge.map((a) => `${a.article} ${a.ratio}×`).join(", ") : "No surges. Highest: " + top.map((a) => `${a.article} ${a.ratio}×`).join(", ")));
  }

  // землетрясения и санкции
  const q = quakes && quakes.last_24h_m45;
  const misc = [];
  if (q && num(q.count) != null) misc.push(`Earthquakes M4.5+ (USGS, 24h): ${q.count}` + (q.strongest ? `; strongest M${q.strongest.mag} ${q.strongest.place}${q.strongest.tsunami_flag ? " (tsunami flag)" : ""}` : "") + (q.m60_or_more ? `; M6+: ${q.m60_or_more}` : ""));
  const sh = s.sanctions && s.sanctions.uk_ships;
  if (sh && num(sh.ships_total) != null) misc.push(`UK sanctions list: ${fmt(sh.ships_total)} ships, ${signed(sh.added_7d)} in 7 days (${sh.report_date})`);
  if (misc.length) { L.push("", "## Other sensors"); misc.forEach((x) => L.push("- " + x)); }

  L.push("", `Full data: ${ORIGIN}/api/v1/radars · ${ORIGIN}/api/v1/radar/<id> · ${ORIGIN}/api/v1/sensors · ${ORIGIN}/api/v1/quakes · MCP ${ORIGIN}/mcp`);
  if (tier !== "fresh") L.push(`Fresh brief built at request with wide headline check: ${BRIEF_RESOURCE} (${BRIEF_PRICE_USD} USDC, x402 v2, Base).`);

  const text = L.join("\n");
  return { generated_at: at, tier, verification: wide ? "wide (own feeds + news search, 2 days)" : "narrow (own feeds)", approx_tokens: Math.ceil(text.length / 4), text, radars: rOut };
}

// ---------- x402 ----------
const BAZAAR = {
  info: { input: { type: "http", method: "GET", queryParams: { format: "json" } },
    output: { type: "json", example: { tier: "fresh", approx_tokens: 1400, text: "# Orb Studio world brief · … UTC · fresh\n## News radars (risk 0–100, change 24h)\n- Geo radar [geo]: 70 (±0)\n  · \"…\" — bbc.co.uk, confirmed (7)\n## Markets\n- BTC 58,637 EUR (24h −1.8 %) …", radars: [{ id: "geo", risk_index: 70, delta_24h: 0, headlines: [{ title: "…", source: "bbc.co.uk", sources_confirming: 7, verdict: "confirmed" }] }] } } },
  schema: { $schema: "https://json-schema.org/draft/2020-12/schema", type: "object",
    properties: { input: { type: "object", properties: { type: { type: "string", const: "http" }, method: { type: "string", enum: ["GET"] },
      queryParams: { type: "object", properties: { format: { type: "string", enum: ["json", "text"], description: "json (default) or text: plain markdown only" } } } }, required: ["type", "method"], additionalProperties: false },
      output: { type: "object", properties: { type: { type: "string" }, example: { type: "object" } }, required: ["type"] } },
    required: ["input"] },
};
const OFFER = { atomic: BRIEF_PRICE_ATOMIC, usd: BRIEF_PRICE_USD, resource: BRIEF_RESOURCE, description: DESCRIPTION, mimeType: "application/json", bazaar: BAZAAR,
  page: "/api/v1/brief/fresh", product: "brief", freeHint: ORIGIN + "/api/v1/brief (up to 1 hour old)" };
export const briefPaymentRequired = (cfg, error) => paymentRequiredFor(cfg, OFFER, error);

const wantText = (url) => url.searchParams.get("format") === "text";
function render(url, brief, extra = {}, headers = {}) {
  if (wantText(url)) return new Response(brief.text, { status: 200, headers: { ...CORS, "Content-Type": "text/markdown; charset=utf-8", ...headers } });
  return new Response(JSON.stringify({ ...brief, ...extra }, null, 2), { status: 200, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", ...headers } });
}

// deps: { ctx, agent, free() → brief (до часа), fresh() → brief (сейчас), hit(page, kind, name), log(kind, data) }
export async function handleBrief(request, cfg, deps) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "GET" && request.method !== "HEAD") return new Response(JSON.stringify({ error: "Use GET" }), { status: 405, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8" } });
  const url = new URL(request.url);
  if (!url.pathname.replace(/\/+$/, "").endsWith("/fresh")) {
    const b = await deps.free();
    const age = Math.max(0, Math.round((Date.now() - Date.parse(b.generated_at)) / 60000));
    return render(url, b, { age_minutes: age, fresh_version: cfg.open ? { url: BRIEF_RESOURCE, price_usdc: BRIEF_PRICE_USD, network: cfg.network, protocol: "x402 v2 (HTTP 402, USDC)", what: "built at request time, headlines checked against news search" } : undefined },
      { "Cache-Control": "public, max-age=300" });
  }
  return paidFlow(request, cfg, { ...OFFER, build: () => deps.fresh(), deliver: (b, receipt) => render(url, b, { receipt }) }, deps);
}
