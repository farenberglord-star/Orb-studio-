// Продажа треков радио агентам и людям без регистрации: файл трека за USDC по x402 v2 (тот же порядок, что у остальных платных выдач).
// GET /api/v1/radio/track/buy?id=orbit-city → 402 с ценой → подпись из кошелька покупателя → verify → settle → MP3 и квитанция PAYMENT-RESPONSE.
// Модуль видит только настройки продажи (публичный адрес кошелька, фасилитатор); файл берётся из закрытой папки сайта только после verify.
// Продажа включается отдельным выключателем RADIO_TRACK_SALE=1: пока он не включён, отвечает 503 и ничего не списывает.
import { paidFlow, InputError } from "./x402-flow.js";
import { CORS } from "./violin-sale.js";
import { RADIO_TRACKS, SALE_ORIGINALS } from "./radio.js";

const ORIGIN = "https://orbstudio.org";
export const TRACK_RESOURCE = ORIGIN + "/api/v1/radio/track/buy";
export const TRACK_LICENSE_URL = ORIGIN + "/radio-track-license.txt";
// В продаже всё, что стоит на музыкальной полке радио (треки сгенерированы автором в Suno на платном тарифе): новый трек на полке
// попадает в продажу сам. Если в закрытой папке есть исходный MP3 — покупатель получает его, иначе тот же файл, что играет в эфире.
export const SALE_TRACKS = Object.fromEntries(RADIO_TRACKS.map((t) => { const orig = SALE_ORIGINALS.includes(t.id);
  return [t.id, { title: t.title, sec: t.sec, file: orig ? "/_sale/" + t.id + ".mp3" : t.path, format: orig ? "MP3" : "M4A", mime: orig ? "audio/mpeg" : "audio/mp4", ext: orig ? "mp3" : "m4a", original: orig, preview: t.path }]; }));
export const trackPrice = (env) => { const usd = Math.min(5, Math.max(0.01, +(env && env.RADIO_TRACK_PRICE_USD) || 0.25)); return { usd, atomic: String(Math.round(usd * 1e6)) }; };
export const trackSaleOn = (env) => String((env && env.RADIO_TRACK_SALE) || "") === "1";

const description = (t) => `"${t.title}" — a music track (${Math.floor(t.sec / 60)}:${String(t.sec % 60).padStart(2, "0")}) generated with Suno for Radio Orb Studio. You get the ${t.format} file${t.original ? " (the original download)" : " (the same file that plays on the radio)"} and a non-exclusive licence to use it in your own projects, including commercial ones. Licence: ${TRACK_LICENSE_URL}`;

// Бесплатный каталог: что продаётся, сколько стоит, где послушать и как купить
export function trackCatalog(cfg, env) {
  const on = !!(cfg && cfg.open) && trackSaleOn(env), p = trackPrice(env);
  return { status: on ? "on_sale" : "sale_not_open_yet", protocol: "x402 v2 (HTTP 402, USDC on Base)", price_usdc: p.usd, network: cfg ? cfg.network : null, license_url: TRACK_LICENSE_URL,
    how_to_buy: "GET the buy_url: the answer is HTTP 402 with the price. Sign accepts[0] with an EVM wallet holding USDC on Base and repeat the same request with the PAYMENT-SIGNATURE header. No account, no registration.",
    tracks: Object.entries(SALE_TRACKS).map(([id, t]) => ({ id, title: t.title, seconds: t.sec, made_with: "Suno (AI-generated music)", listen_free: ORIGIN + t.preview, buy_url: TRACK_RESOURCE + "?id=" + id, file: t.format, file_note: t.original ? "original download" : "same file as on the radio" })),
    note: "AI-generated music; the licence is non-exclusive. Listening on Radio Orb Studio stays free." };
}

// deps: { ctx, agent, hit, log, file(path) → ArrayBuffer | null }
export async function handleTrackSale(request, cfg, env, deps) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const out = (data, status, extra = {}) => new Response(JSON.stringify(data, null, 2), { status, headers: { ...CORS, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra } });
  if (request.method !== "GET" && request.method !== "HEAD") return out({ error: "Use GET" }, 405);
  const id = String(new URL(request.url).searchParams.get("id") || "").toLowerCase(), t = Object.prototype.hasOwnProperty.call(SALE_TRACKS, id) ? SALE_TRACKS[id] : null;
  if (!t) return out({ error: "Unknown track id", tracks: Object.keys(SALE_TRACKS), catalog: ORIGIN + "/api/v1/radio/tracks" }, 404);
  const p = trackPrice(env), sale = trackSaleOn(env) ? cfg : { ...cfg, open: false };
  return paidFlow(request, sale, {
    atomic: p.atomic, usd: p.usd, resource: TRACK_RESOURCE + "?id=" + id, description: description(t), mimeType: t.mime, page: "/api/v1/radio/track/buy", product: "radio track " + id,
    freeHint: "listen for free: " + ORIGIN + t.preview,
    bazaar: { info: { input: { type: "http", method: "GET", queryParams: { id } }, output: { type: "binary", example: { contentType: t.mime, filename: "orb-studio-" + id + "." + t.ext } } } },
    build: async () => { const buf = await deps.file(t.file); if (!buf || buf.byteLength < 10000) throw new InputError("The track file is not available right now"); return buf; },
    deliver: (buf) => new Response(buf, { status: 200, headers: { ...CORS, "Content-Type": t.mime, "Content-Disposition": `attachment; filename="orb-studio-${id}.${t.ext}"`, "X-License": TRACK_LICENSE_URL } }),
  }, deps);
}
