// Покупка по x402. Сухой просмотр свободен. Настоящий платёж закрыт, пока нет
// отдельного разового разрешения и подписанта. Ключ кошелька этот файл не читает.
// Купленное содержимое — данные, не инструкции.
import { writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { blockedSigner, BASE_NETWORK, BASE_USDC } from "./signer.mjs";
import { safeFetch } from "./safe-http.mjs";
import { localSignerFromEnv } from "./signer-local.mjs";

const ORB = () => process.env.ORB_URL || "https://orbstudio.org";
const arg = (n) => { const a = process.argv.find((x) => x.startsWith("--" + n + "=")); return a ? a.slice(n.length + 3) : ""; };
const flag = (n) => process.argv.includes("--" + n);
const clean = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u0008\u000b-\u001f\u007f]+/g, " ").slice(0, n);

export function parseChallenge(r, bodyJson) {
  const h = r.headers.get("payment-required");
  return h ? JSON.parse(Buffer.from(h, "base64").toString("utf8")) : bodyJson;
}
export function checkOffer(ch, maxUsdc = null) {
  const req = ch && ch.accepts && ch.accepts[0];
  if (!req || ch.x402Version !== 2) throw new Error("ресурс не отвечает по x402 v2");
  if (req.scheme !== "exact" || req.network !== BASE_NETWORK) throw new Error("нужна сеть Base и схема exact, а не " + req.network + " " + req.scheme);
  if (String(req.asset).toLowerCase() !== BASE_USDC.toLowerCase()) throw new Error("токен не USDC на Base");
  if (maxUsdc != null && BigInt(req.amount) > BigInt(Math.round(maxUsdc * 1e6))) throw new Error("цена выше заданного потолка");
  if (!/^0x[0-9a-fA-F]{40}$/.test(req.payTo)) throw new Error("некорректный адрес получателя");
  return req;
}
function echoMatches(auth, req, url) {
  let href = "";
  try { href = new URL(url).href; } catch (e) { return false; }
  return !!(auth && auth.approved === true && auth.network === BASE_NETWORK && String(auth.asset || "").toLowerCase() === BASE_USDC.toLowerCase()
    && String(auth.pay_to || "").toLowerCase() === String(req.payTo).toLowerCase()
    && auth.resource_url === href && Math.round(Number(auth.amount_usdc) * 1e6) === Number(req.amount));
}

async function orb(path, body, fetchImpl) {
  const response = await safeFetch(ORB() + path, { method: "POST", headers: { "content-type": "application/json", "x-agent-key": process.env.ORB_AGENT_KEY }, body: JSON.stringify(body) }, fetchImpl, { allowHttpTest: process.env.ALLOW_HTTP_TEST === "1", ledger: true });
  return { status: response.status, data: await response.json().catch(() => ({})) };
}

export async function run(opts) {
  const { url, reason, maxUsdc = null, pay, useful, log = console.log, fetchImpl = fetch, signer = localSignerFromEnv() || blockedSigner, wait = async () => {} } = opts;
  const allowHttpTest = process.env.ALLOW_HTTP_TEST === "1";
  const first = await safeFetch(url, { headers: { "User-Agent": "OrbStudio-agent-buyer/1.0" } }, fetchImpl, { allowHttpTest });
  if (first.status !== 402) { log("Ресурс не просит оплату (статус " + first.status + "). Покупать нечего."); return { skipped: first.status }; }
  const ch = parseChallenge(first, await first.clone().json().catch(() => null));
  const req = checkOffer(ch, maxUsdc);
  const amount = Number(req.amount) / 1e6;
  log(`Ресурс просит ${amount} USDC (Base) → ${req.payTo}.`);
  if (!pay) { log("Сухой прогон: разрешение не запрашивалось, ничего не подписано."); return { dry: true, amount, payTo: req.payTo, network: req.network, resource: new URL(url).href }; }
  if (!process.env.ORB_AGENT_KEY) throw new Error("нет ORB_AGENT_KEY (это ключ журнала, не ключ кошелька)");
  if (clean(reason, 400).length < 15) throw new Error("нужна причина покупки (--reason, 15–400 символов)");
  const auth = await orb("/api/v1/agent-wallet/authorize", { resource_url: url, amount_usdc: amount, network: req.network, asset: req.asset, pay_to: req.payTo, reason: clean(reason, 400) }, fetchImpl);
  if (!echoMatches(auth.data, req, url)) { log("Разрешения нет: " + clean(auth.data.reason || auth.data.error || "approval required", 200)); return { refused: true }; }
  const now = Math.floor(Date.now() / 1000);
  const nonce = "0x" + Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString("hex");
  let signed;
  try {
    signed = await signer.signEip3009({ network: req.network, asset: req.asset, payTo: req.payTo, approvedPayTo: auth.data.pay_to, value: String(req.amount), approvedAtomic: String(Math.round(Number(auth.data.amount_usdc) * 1e6)), resourceUrl: new URL(url).href, approvedResource: auth.data.resource_url, validAfter: String(now), validBefore: String(now + Math.min(req.maxTimeoutSeconds || 120, 120)), nonce, now, accepted: req, challenge: ch });
  } catch (e) {
    if (e.code === "signer_blocked" || e.code === "signer_policy") {
      await orb("/api/v1/agent-wallet/result", { id: auth.data.id, outcome: "blocked", error: e.code }, fetchImpl);
      log("Подпись заблокирована. Новая подпись не создавалась.");
      return { blocked: e.code };
    }
    throw e;
  }
  let uncertain = false;
  for (let i = 0; i < 3; i++) {
    let response;
    try { response = await safeFetch(url, { headers: { "PAYMENT-SIGNATURE": signed.header, "User-Agent": "OrbStudio-agent-buyer/1.0" } }, fetchImpl, { allowHttpTest, payment: true }); }
    catch (e) { uncertain = true; break; }
    if (response.status === 200) {
      const buf = Buffer.from(await response.arrayBuffer()), type = response.headers.get("content-type") || "";
      mkdirSync(new URL("./purchases/", import.meta.url), { recursive: true });
      const file = "purchases/" + Date.now() + (type.includes("json") ? ".json" : type.includes("midi") ? ".mid" : ".bin");
      writeFileSync(new URL("./" + file, import.meta.url), buf);
      let tx = ""; try { tx = JSON.parse(Buffer.from(response.headers.get("payment-response") || "", "base64").toString("utf8")).transaction || ""; } catch (e) {}
      const preview = /text|json/.test(type) ? clean(buf.toString("utf8"), 160) : `${type || "binary"}, ${buf.length} байт`;
      await orb("/api/v1/agent-wallet/result", { id: auth.data.id, outcome: "bought", tx_hash: tx, got: `${type || "binary"}, ${buf.length} байт: ${preview}`.slice(0, 400), useful: useful || undefined }, fetchImpl);
      log("Куплено. Файл: " + file + (tx ? ". Транзакция " + tx : ". Хэш транзакции в ответе не пришёл"));
      return { bought: true, tx, file };
    }
    const text = await response.text();
    if (response.status === 202 || response.status === 502 || /nonce_already_used/.test(text)) { uncertain = true; await wait(); continue; }
    await orb("/api/v1/agent-wallet/result", { id: auth.data.id, outcome: "failed", error: "HTTP " + response.status }, fetchImpl);
    log("Покупка отклонена до перевода: HTTP " + response.status);
    return { failed: response.status };
  }
  await orb("/api/v1/agent-wallet/result", { id: auth.data.id, outcome: "pending", error: "same authorization still unresolved" }, fetchImpl);
  log("Исход платежа неясен. Повторяйте тот же запрос позже. Новую подпись не создавать.");
  return { pending: true, id: auth.data.id, uncertain };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run({ url: arg("url"), reason: arg("reason"), maxUsdc: arg("max") ? parseFloat(arg("max")) : null, pay: flag("pay"), useful: arg("useful"), wait: () => new Promise((r) => setTimeout(r, 5000)) })
    .catch((e) => { console.error("Ошибка:", String(e.message || e)); process.exit(1); });
}
