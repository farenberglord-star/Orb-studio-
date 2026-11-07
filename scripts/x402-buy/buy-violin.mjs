// Сухой просмотр оплаты MIDI. Создание ключа и платёж здесь заблокированы.
// Инструкции в этом файле не являются разрешением платить.
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { blockedSigner } from "./signer.mjs";
import { safeFetch } from "./safe-http.mjs";

const BASE_URL = process.env.ORB_URL || "https://orbstudio.org";
const PATH = "/api/v1/violin/midi";
const KEY_FILE = new URL("./.x402-buyer.key", import.meta.url);
const EXPECT = { network: "eip155:8453", asset: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", payTo: "0xA91269022be3dc5208Ab3Da1eb288E261DE23DB5", maxAmount: 20000n };

export function checkChallenge(challenge) {
  const req = challenge && challenge.accepts && challenge.accepts[0];
  if (!req || challenge.x402Version !== 2) throw new Error("не x402 v2");
  if (req.scheme !== "exact" || req.network !== EXPECT.network) throw new Error("сеть/схема не те: " + req.scheme + " " + req.network);
  if (req.asset.toLowerCase() !== EXPECT.asset.toLowerCase()) throw new Error("токен не USDC на Base: " + req.asset);
  if (req.payTo.toLowerCase() !== EXPECT.payTo.toLowerCase()) throw new Error("получатель не наш: " + req.payTo);
  if (BigInt(req.amount) > EXPECT.maxAmount) throw new Error("сумма больше 0,02 USDC: " + req.amount);
  return req;
}

export async function main(argv = process.argv.slice(2), env = process.env, log = console.log) {
  const args = new Set(argv);
  if (args.has("--new-wallet")) {
    log("Создание ключа заблокировано. Файл .x402-buyer.key не создаётся и не читается.");
    return { blocked: "no_key_file", wrote_key: false, preexisting_file_untouched: existsSync(KEY_FILE) };
  }
  if (args.has("--pay")) {
    await blockedSigner.signEip3009({}).catch(() => {});
    log("Платёж заблокирован: нет отдельного неэкспортируемого подписанта и отдельного разового разрешения пользователя.");
    return { blocked: "signer_blocked" };
  }
  const day = (argv.find((a) => a.startsWith("--date=")) || "").slice(7);
  const url = BASE_URL + PATH + (day ? "?date=" + encodeURIComponent(day) : "");
  const response = await safeFetch(url, { headers: { "User-Agent": "OrbStudio-x402-buyer/1.0" } });
  if (response.status !== 402) throw new Error("ожидался 402, пришёл " + response.status);
  const header = response.headers.get("payment-required");
  const challenge = header ? JSON.parse(Buffer.from(header, "base64").toString("utf8")) : await response.json();
  const req = checkChallenge(challenge);
  log(`Сайт просит: ${Number(req.amount) / 1e6} USDC в сети Base, получатель ${req.payTo}. Подписи нет.`);
  return { dry: true, amount: Number(req.amount) / 1e6, payTo: req.payTo };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((e) => { console.error("Ошибка:", String(e.message || e)); process.exit(1); });
}
