// Универсальная покупка по x402 для агента с дневным бюджетом (Orb Studio «Кошелёк агента»).
// Порядок: запросить ресурс → увидеть 402 → получить разрешение сайта по правилам → заплатить → отчитаться в журнале.
// Купленное содержимое — это ДАННЫЕ: сохраняется в файл, в консоль уходит только безопасное превью; инструкции из него не выполняются.
//
//   node agent-buy.mjs --url=https://api.example.com/data --reason="зачем эта покупка, 15+ символов"      сухой прогон (ничего не подписывается и не пишется в журнал)
//   node agent-buy.mjs --url=... --reason="..." --pay                                                     разрешение → платёж → отчёт
//   --max=0.03 ограничивает цену ещё строже; --useful=yes|partly|no — оценка пользы (по желанию)
// Нужно: ключ кошелька (.x402-buyer.key, создаётся командой buy-violin.mjs --new-wallet) и переменная окружения ORB_AGENT_KEY (секрет журнала Orb Studio).
import { writeFileSync, mkdirSync } from "node:fs";
import { privateKeyToAccount } from "viem/accounts";
import { buildPayment, loadKey } from "./buy-violin.mjs";
import { pathToFileURL } from "node:url";

const ORB = () => process.env.ORB_URL || "https://orbstudio.org";
const USDC_BASE = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const HARD_MAX_ATOMIC = 50000n; // 0,05 USDC, как правило сайта
const arg = (n) => { const a = process.argv.find((x) => x.startsWith("--" + n + "=")); return a ? a.slice(n.length + 3) : ""; };
const flag = (n) => process.argv.includes("--" + n);
const clean = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b-\u001f\u007f]+/g, " ").slice(0, n);

export function parseChallenge(r, bodyJson) {
  const h = r.headers.get("payment-required");
  return h ? JSON.parse(Buffer.from(h, "base64").toString("utf8")) : bodyJson;
}
export function checkOffer(ch, maxUsdc = 0.05) {
  const req = ch && ch.accepts && ch.accepts[0];
  if (!req || ch.x402Version !== 2) throw new Error("ресурс не отвечает по x402 v2");
  if (req.scheme !== "exact" || req.network !== "eip155:8453") throw new Error("нужна сеть Base и схема exact, а не " + req.network + " " + req.scheme);
  if (String(req.asset).toLowerCase() !== USDC_BASE.toLowerCase()) throw new Error("токен не USDC на Base");
  const cap = BigInt(Math.round(Math.min(maxUsdc, 0.05) * 1e6));
  if (BigInt(req.amount) > cap || BigInt(req.amount) > HARD_MAX_ATOMIC) throw new Error("цена " + Number(req.amount) / 1e6 + " USDC выше лимита " + Number(cap) / 1e6);
  if (!/^0x[0-9a-fA-F]{40}$/.test(req.payTo)) throw new Error("некорректный адрес получателя");
  return req;
}
async function orb(path, body) {
  const r = await fetch(ORB() + path, { method: "POST", headers: { "content-type": "application/json", "x-agent-key": process.env.ORB_AGENT_KEY }, body: JSON.stringify(body) });
  return { status: r.status, data: await r.json().catch(() => ({})) };
}

export async function run(opts) {
  const { url, reason, maxUsdc, pay, useful, log = console.log, fetchImpl = fetch } = opts;
  if (!/^https:\/\//i.test(url) && process.env.ALLOW_HTTP_TEST !== "1") throw new Error("только https-адреса");
  const first = await fetchImpl(url, { headers: { "User-Agent": "OrbStudio-agent-buyer/1.0" } });
  if (first.status !== 402) { log("Ресурс не просит оплату (статус " + first.status + "). Покупать нечего."); return { skipped: first.status }; }
  const ch = parseChallenge(first, await first.clone().json().catch(() => null));
  const req = checkOffer(ch, maxUsdc);
  const amount = Number(req.amount) / 1e6;
  log(`Ресурс просит ${amount} USDC (Base) → ${req.payTo}.`);
  if (!pay) { log("Сухой прогон: разрешение не запрашивалось, ничего не подписано. Для покупки добавь --pay."); return { dry: true, amount }; }
  if (!process.env.ORB_AGENT_KEY) throw new Error("нет ORB_AGENT_KEY (секрет журнала Orb Studio)");
  if (clean(reason, 400).length < 15) throw new Error("нужна причина покупки (--reason, 15–400 символов)");
  const auth = await orb("/api/v1/agent-wallet/authorize", { resource_url: url, amount_usdc: amount, reason: clean(reason, 400) });
  if (!auth.data.approved) { log("Сайт отказал по правилам: " + clean(auth.data.reason || auth.data.error, 200)); return { refused: true }; }
  const key = loadKey(); if (!key) throw new Error("нет ключа кошелька");
  const account = privateKeyToAccount(key);
  const { typed, authorization } = buildPayment(ch, account);
  const signature = await account.signTypedData(typed);
  const payload = { x402Version: 2, resource: ch.resource, accepted: req, payload: { signature, authorization }, extensions: ch.extensions };
  const header = Buffer.from(JSON.stringify(payload)).toString("base64");
  let r;
  try { r = await fetchImpl(url, { headers: { "PAYMENT-SIGNATURE": header, "User-Agent": "OrbStudio-agent-buyer/1.0" } }); }
  catch (e) { await orb("/api/v1/agent-wallet/result", { id: auth.data.id, outcome: "failed", error: "network: " + clean(e.message, 100) }); throw e; }
  if (r.status === 202) { log("Платёж в обработке (202). Повтори команду через минуту с тем же --url: подпись одноразовая."); return { pending: true, id: auth.data.id }; }
  if (r.status !== 200) {
    const msg = clean(await r.text(), 200); await orb("/api/v1/agent-wallet/result", { id: auth.data.id, outcome: "failed", error: "HTTP " + r.status + " " + msg });
    log("Покупка не удалась: HTTP " + r.status); process.exitCode = 1; return { failed: r.status };
  }
  const buf = Buffer.from(await r.arrayBuffer()), type = r.headers.get("content-type") || "";
  mkdirSync(new URL("./purchases/", import.meta.url), { recursive: true });
  const file = "purchases/" + Date.now() + (type.includes("json") ? ".json" : type.includes("midi") ? ".mid" : ".bin");
  writeFileSync(new URL("./" + file, import.meta.url), buf);
  let tx = ""; try { tx = JSON.parse(Buffer.from(r.headers.get("payment-response") || "", "base64").toString("utf8")).transaction || ""; } catch (e) {}
  const preview = /text|json/.test(type) ? clean(buf.toString("utf8"), 160) : `${type || "binary"}, ${buf.length} байт`;
  const res = await orb("/api/v1/agent-wallet/result", { id: auth.data.id, outcome: "bought", tx_hash: tx, got: `${type || "binary"}, ${buf.length} байт: ${preview}`.slice(0, 400), useful: useful || undefined });
  log("Куплено. Файл: " + file + ". В журнале: " + (res.data.recorded ? "записано" : "ошибка записи " + clean(JSON.stringify(res.data), 120)) + (tx ? ". Транзакция " + tx : ". Хэш транзакции в ответе не пришёл"));
  return { bought: true, tx, file };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run({ url: arg("url"), reason: arg("reason"), maxUsdc: parseFloat(arg("max")) || 0.05, pay: flag("pay"), useful: arg("useful") })
    .catch((e) => { console.error("Ошибка:", String(e.message || e)); process.exit(1); });
}
