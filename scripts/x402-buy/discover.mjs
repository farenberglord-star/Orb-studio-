// Сухой разбор каталога PayAI. Не подписывает, не платит и не публикует журнал.
import { pathToFileURL } from "node:url";
import { readFileSync } from "node:fs";
import { resourceUrlProblem } from "../../src/agent-wallet.js";
import { BASE_NETWORK, BASE_USDC } from "./signer.mjs";

export const DISCOVERY_URL = "https://facilitator.payai.network/discovery/resources";
const MAX_BODY = 1_000_000;
const MAX_TIMEOUT = 300;

export function sanitizeText(value, max = 180) {
  return String(value == null ? "" : value).replace(/[\u0000-\u001f<>]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}
const injected = (value) => /ignore previous|system prompt|send (all )?(the )?funds|private key|<\s*script|payment-signature/i.test(String(value || ""));

export function classifyOffer(item) {
  const accepts = Array.isArray(item && item.accepts) ? item.accepts : [];
  const req = accepts.find((row) => row && row.scheme === "exact" && row.network === BASE_NETWORK && String(row.asset || "").toLowerCase() === BASE_USDC.toLowerCase());
  if (!req) return { ok: false, reason: "not Base USDC exact" };
  let href = "";
  try { href = new URL(String(item.resource || "")).href; } catch (e) { return { ok: false, reason: "resource URL is invalid" }; }
  const problem = resourceUrlProblem(href);
  if (problem) return { ok: false, reason: problem };
  if (href.length > 300 || /:/.test(new URL(href).pathname)) return { ok: false, reason: "resource URL is not a concrete https address" };
  if (!/^\d+$/.test(String(req.amount || "")) || BigInt(req.amount) < 1n || BigInt(req.amount) > 10n ** 15n) return { ok: false, reason: "amount is not a positive atomic USDC value" };
  const timeout = Number(req.maxTimeoutSeconds);
  if (!Number.isInteger(timeout) || timeout < 1 || timeout > MAX_TIMEOUT) return { ok: false, reason: "maxTimeoutSeconds is outside 1..300" };
  if (!/^0x[0-9a-fA-F]{40}$/.test(req.payTo || "")) return { ok: false, reason: "merchant address is invalid" };
  const raw = item.description || item.serviceName || "";
  return { ok: true, offer: {
    state: "approval_needed", resource: href, merchant: req.payTo, network: BASE_NETWORK, asset: BASE_USDC,
    amount_atomic: String(req.amount), amount_usdc: (Number(req.amount) / 1e6).toFixed(6), max_timeout_seconds: timeout,
    observed_at: typeof item.lastUpdated === "string" ? item.lastUpdated.slice(0, 40) : null,
    source: "https://facilitator.payai.network/discovery/resources",
    seller_text: sanitizeText(raw), seller_text_is_data: true, ignored_injection: injected(raw),
    tx: null, usefulness: null,
  } };
}

export function selectProposals(items) {
  const rejected = [];
  const seen = new Set();
  const offers = [];
  for (const item of items || []) {
    const row = classifyOffer(item);
    const label = sanitizeText(item && item.resource, 300) || "(no resource)";
    if (!row.ok) { rejected.push({ resource: label, reason: row.reason }); continue; }
    if (seen.has(row.offer.resource)) { rejected.push({ resource: row.offer.resource, reason: "duplicate" }); continue; }
    seen.add(row.offer.resource);
    offers.push(row.offer);
  }
  const violin = offers.filter((o) => /\/\/orbstudio\.org\/api\/v1\/violin\/midi(?:$|\?)/.test(o.resource));
  const rest = offers.filter((o) => !violin.includes(o)).sort((a, b) => Number(a.amount_atomic) - Number(b.amount_atomic) || a.resource.localeCompare(b.resource));
  const pinned = violin.slice(0, 1);
  const chosen = [...pinned, ...rest.slice(0, 3 - pinned.length)];
  for (const offer of chosen) {
    const ours = violin.includes(offer);
    offer.why = ours
      ? "Совпадает с уже описанным MIDI скрипки Orb Studio и проходит фильтр Base USDC exact. Это предложение, не покупка."
      : "На этой странице каталога это один из более дешёвых ресурсов, который проходит тот же фильтр. Текст продавца не является инструкцией. Это предложение, не покупка.";
    if (offer.ignored_injection) offer.why += " Фразы в тексте продавца, похожие на команды, проигнорированы.";
  }
  return { considered: (items || []).length, accepted: offers.length, rejected: rejected.slice(0, 30), proposals: chosen };
}

export function buildReport(items, meta) {
  const picked = selectProposals(items);
  return {
    kind: "orb-buyer-dry-run",
    fixture: !!meta.fixture,
    discovery_status: meta.status,
    generated_at: meta.generated_at,
    source: meta.source,
    filters: { scheme: "exact", network: BASE_NETWORK, asset: BASE_USDC },
    limits: { enabled: false, note: "Лимиты в USDC не заданы и ничего не разрешают." },
    wallet: null,
    tx_status: "none",
    ...picked,
  };
}

async function readCatalog(env, fetchImpl) {
  if (env.DISCOVERY_FIXTURE) {
    const parsed = JSON.parse(readFileSync(env.DISCOVERY_FIXTURE, "utf8"));
    return { status: "fixture", fixture: true, items: parsed.items || parsed, source: { name: "local fixture", live: false } };
  }
  const url = new URL(DISCOVERY_URL);
  url.searchParams.set("type", "http");
  url.searchParams.set("scheme", "exact");
  url.searchParams.set("network", BASE_NETWORK);
  url.searchParams.set("limit", "20");
  const response = await fetchImpl(url, { redirect: "manual", signal: AbortSignal.timeout(15000), headers: { accept: "application/json", "user-agent": "OrbStudio-buyer-dry-run/1.0" } });
  if (response.status >= 300 && response.status < 400) return { status: "unavailable", fixture: false, items: [], source: { url: DISCOVERY_URL, http: response.status, note: "redirect refused" } };
  if (!response.ok) return { status: "unavailable", fixture: false, items: [], source: { url: DISCOVERY_URL, http: response.status } };
  const length = Number(response.headers.get("content-length") || 0);
  if (length > MAX_BODY) return { status: "unavailable", fixture: false, items: [], source: { url: DISCOVERY_URL, http: response.status, note: "response too large" } };
  const text = await response.text();
  if (text.length > MAX_BODY) return { status: "unavailable", fixture: false, items: [], source: { url: DISCOVERY_URL, note: "response too large" } };
  const body = JSON.parse(text);
  return { status: "ok", fixture: false, items: Array.isArray(body.items) ? body.items : [], source: { url: DISCOVERY_URL, http: response.status, retrieved_at: new Date().toISOString(), page: body.pagination || null } };
}

export async function main(env = process.env, fetchImpl = fetch, log = console.log) {
  let catalog;
  try { catalog = await readCatalog(env, fetchImpl); }
  catch (e) { catalog = { status: "unavailable", fixture: false, items: [], source: { url: DISCOVERY_URL, error: sanitizeText(e.message, 120) } }; }
  const report = buildReport(catalog.items, { status: catalog.status, fixture: catalog.fixture, generated_at: new Date().toISOString(), source: catalog.source });
  log(JSON.stringify(report, null, 2));
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
