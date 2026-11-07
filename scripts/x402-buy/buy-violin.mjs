// Покупка MIDI дня на orbstudio.org по протоколу x402 v2 (Base mainnet, USDC, ~0,01 USD).
// Нужна, чтобы один раз провести настоящий платёж через PayAI: так адрес попадает в каталог (Bazaar) фасилитатора.
//
// Безопасность:
//  - Ключ НИКОГДА не печатается и не передаётся. Он лежит только в файле .x402-buyer.key (права 600) или в переменной X402_BUYER_KEY.
//  - По умолчанию это сухой прогон: подписи и платежа нет. Платёж только с флагом --pay.
//  - Скрипт откажется платить больше 0,02 USDC и платить не на тот адрес/сеть, что ждёт сайт.
//
// Команды:
//   node buy-violin.mjs --new-wallet      создать новый одноразовый кошелёк; печатает только публичный адрес
//   node buy-violin.mjs                   сухой прогон: показать, что сайт просит, ничего не подписывать
//   node buy-violin.mjs --pay             заплатить и сохранить файл orb-violin.mid
import { existsSync, readFileSync, writeFileSync, chmodSync } from "node:fs";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { randomBytes } from "node:crypto";

const BASE_URL = process.env.ORB_URL || "https://orbstudio.org";
const PATH = "/api/v1/violin/midi";
const KEY_FILE = new URL("./.x402-buyer.key", import.meta.url);
const EXPECT = { network: "eip155:8453", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", payTo: "0xA91269022be3dc5208Ab3Da1eb288E261DE23DB5", maxAmount: 20000n };

const args = new Set(process.argv.slice(2));
const day = (process.argv.find((a) => a.startsWith("--date=")) || "").slice(7);

function loadKey() {
  const k = process.env.X402_BUYER_KEY || (existsSync(KEY_FILE) ? readFileSync(KEY_FILE, "utf8").trim() : "");
  if (!/^0x[0-9a-fA-F]{64}$/.test(k)) return null;
  return k;
}

export function buildPayment(challenge, account, now = Math.floor(Date.now() / 1000), nonce = "0x" + randomBytes(32).toString("hex")) {
  const req = challenge.accepts[0];
  const authorization = { from: account.address, to: req.payTo, value: req.amount, validAfter: String(now - 60), validBefore: String(now + (req.maxTimeoutSeconds || 120)), nonce };
  const typed = {
    domain: { name: req.extra?.name || "USD Coin", version: req.extra?.version || "2", chainId: Number(req.network.split(":")[1]), verifyingContract: req.asset },
    types: { TransferWithAuthorization: [
      { name: "from", type: "address" }, { name: "to", type: "address" }, { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" }, { name: "validBefore", type: "uint256" }, { name: "nonce", type: "bytes32" } ] },
    primaryType: "TransferWithAuthorization",
    message: { from: authorization.from, to: authorization.to, value: BigInt(authorization.value), validAfter: BigInt(authorization.validAfter), validBefore: BigInt(authorization.validBefore), nonce },
  };
  return { typed, authorization, req };
}

export function checkChallenge(challenge) {
  const req = challenge && challenge.accepts && challenge.accepts[0];
  if (!req || challenge.x402Version !== 2) throw new Error("не x402 v2");
  if (req.scheme !== "exact" || req.network !== EXPECT.network) throw new Error("сеть/схема не те: " + req.scheme + " " + req.network);
  if (req.asset.toLowerCase() !== EXPECT.asset.toLowerCase()) throw new Error("токен не USDC на Base: " + req.asset);
  if (req.payTo.toLowerCase() !== EXPECT.payTo.toLowerCase()) throw new Error("получатель не наш: " + req.payTo);
  if (BigInt(req.amount) > EXPECT.maxAmount) throw new Error("сумма больше 0,02 USDC: " + req.amount);
  return req;
}

async function getChallenge(url) {
  const r = await fetch(url, { headers: { "User-Agent": "OrbStudio-x402-buyer/1.0" } });
  if (r.status !== 402) throw new Error("ожидался 402, пришёл " + r.status + " " + (await r.text()).slice(0, 200));
  const header = r.headers.get("payment-required");
  return header ? JSON.parse(Buffer.from(header, "base64").toString("utf8")) : await r.json();
}

async function main() {
  if (args.has("--new-wallet")) {
    if (existsSync(KEY_FILE) || process.env.X402_BUYER_KEY) { console.log("Кошелёк уже есть. Адрес:", privateKeyToAccount(loadKey()).address); return; }
    const k = generatePrivateKey();
    writeFileSync(KEY_FILE, k + "\n", { mode: 0o600 }); try { chmodSync(KEY_FILE, 0o600); } catch (e) {}
    console.log("Новый кошелёк создан. Публичный адрес (его можно показывать и пополнять):", privateKeyToAccount(k).address);
    console.log("Приватный ключ сохранён только в файле .x402-buyer.key. Не показывай и не отправляй его никому.");
    return;
  }
  const url = BASE_URL + PATH + (day ? "?date=" + day : "");
  const challenge = await getChallenge(url);
  const req = checkChallenge(challenge);
  console.log(`Сайт просит: ${Number(req.amount) / 1e6} USDC в сети Base, получатель ${req.payTo}.`);
  if (!args.has("--pay")) { console.log("Сухой прогон: ничего не подписано и не отправлено. Для платежа добавь --pay."); return; }
  const key = loadKey(); if (!key) throw new Error("нет ключа: сначала node buy-violin.mjs --new-wallet и пополни адрес USDC на Base");
  const account = privateKeyToAccount(key);
  const { typed, authorization } = buildPayment(challenge, account);
  const signature = await account.signTypedData(typed);
  const payload = { x402Version: 2, resource: challenge.resource, accepted: req, payload: { signature, authorization }, extensions: challenge.extensions };
  const header = Buffer.from(JSON.stringify(payload)).toString("base64");
  const r = await fetch(url, { headers: { "PAYMENT-SIGNATURE": header, "User-Agent": "OrbStudio-x402-buyer/1.0" } });
  if (r.status === 202) { console.log("Платёж в обработке (202). Повтори ту же команду через минуту: подпись одноразовая, второго списания не будет."); return; }
  if (r.status !== 200) { console.log("Не вышло, статус", r.status, (await r.text()).slice(0, 400)); process.exitCode = 1; return; }
  writeFileSync(new URL("./orb-violin.mid", import.meta.url), Buffer.from(await r.arrayBuffer()));
  const tx = r.headers.get("payment-response");
  console.log("Готово: файл orb-violin.mid сохранён.", tx ? "Ответ об оплате: " + Buffer.from(tx, "base64").toString("utf8").slice(0, 300) : "");
}

import { pathToFileURL } from "node:url";
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e) => { console.error("Ошибка:", String(e.message || e)); process.exit(1); });
