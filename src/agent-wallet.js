// «Кошелёк агента»: публичный журнал покупок ИИ-агента с небольшим дневным бюджетом (USDC на Base) и сервер правил.
// Деньги и ключ живут не здесь: агент (Грок-бот) платит сам. Сайт даёт разрешение по правилам (authorize), принимает итог (result)
// и показывает журнал всем. Баланс кошелька — главный лимит, правила ниже — второй.
const KEY = "agent-wallet-ledger", MAX_ENTRIES = 400;
const H = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, x-agent-key", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };

export function walletRules(env) {
  const num = (v, d) => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 ? n : d; };
  return { per_purchase_usdc: num(env.AGENT_MAX_PURCHASE_USD, 0.05), daily_usdc: num(env.AGENT_DAILY_CAP_USD, 2), network: "Base (eip155:8453)", asset: "USDC",
    allowed_hosts: (env.AGENT_ALLOWED_HOSTS || "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean) };
}
const day = (t) => new Date(t).toISOString().slice(0, 10);
const round = (n) => Math.round(n * 1e6) / 1e6;
const json = (d, s = 200) => new Response(JSON.stringify(d, null, 2), { status: s, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": s === 200 ? "public, max-age=60" : "no-store", ...H } });

function eq(a, b) { a = String(a || ""); b = String(b || ""); if (a.length !== b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r === 0; }
const clip = (s, n) => String(s == null ? "" : s).replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, n);

export function summarizeLedger(entries, now = Date.now()) {
  const done = entries.filter((e) => e.outcome === "bought");
  const today = day(now);
  const spentToday = done.filter((e) => day(e.t) === today).reduce((a, e) => a + (e.amount_usdc || 0), 0);
  const reserved = entries.filter((e) => e.outcome === "approved" && now - e.t < 30 * 60e3 && day(e.t) === today).reduce((a, e) => a + (e.amount_usdc || 0), 0);
  const spentTotal = done.reduce((a, e) => a + (e.amount_usdc || 0), 0);
  const hosts = {}; for (const e of done) hosts[e.host] = (hosts[e.host] || 0) + 1;
  return { spent_today_usdc: round(spentToday), reserved_usdc: round(reserved), spent_total_usdc: round(spentTotal), purchases: done.length,
    refused: entries.filter((e) => e.outcome === "refused").length, failed: entries.filter((e) => e.outcome === "failed").length,
    top_sellers: Object.entries(hosts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([host, n]) => ({ host, purchases: n })) };
}

export function decide(rules, entries, req, now = Date.now()) {
  let u; try { u = new URL(String(req.resource_url || "")); } catch (e) { return { ok: false, reason: "resource_url is not a valid URL" }; }
  if (u.protocol !== "https:") return { ok: false, reason: "only https resources" };
  if (/^(localhost|127\.|10\.|192\.168\.|169\.254\.|\[)/i.test(u.hostname) || /^\d+\.\d+\.\d+\.\d+$/.test(u.hostname)) return { ok: false, reason: "host must be a public domain name" };
  const amount = Number(req.amount_usdc);
  if (!(amount > 0)) return { ok: false, reason: "amount_usdc must be a positive number" };
  if (amount > rules.per_purchase_usdc) return { ok: false, reason: `over the per-purchase cap of ${rules.per_purchase_usdc} USDC` };
  if (rules.allowed_hosts.length && !rules.allowed_hosts.includes(u.hostname.toLowerCase())) return { ok: false, reason: "host is not on the allowed list" };
  if (clip(req.reason, 400).length < 15) return { ok: false, reason: "reason (15–400 characters) is required: say why this purchase" };
  const s = summarizeLedger(entries, now);
  if (s.spent_today_usdc + s.reserved_usdc + amount > rules.daily_usdc + 1e-9) return { ok: false, reason: `over the daily cap of ${rules.daily_usdc} USDC (spent ${s.spent_today_usdc}, reserved ${s.reserved_usdc})` };
  return { ok: true, host: u.hostname.toLowerCase(), amount: round(amount) };
}

export async function agentWallet(request, env, deps) {
  const { sharedGet, sharedPut } = deps, url = new URL(request.url);
  if (!url.pathname.startsWith("/api/v1/agent-wallet")) return null;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  const rules = walletRules(env), load = async () => (await sharedGet(env, KEY, 1e13)) || [];
  if (url.pathname === "/api/v1/agent-wallet" && request.method === "GET") {
    const entries = await load(), s = summarizeLedger(entries);
    const addr = env.AGENT_WALLET_ADDRESS && /^0x[0-9a-fA-F]{40}$/.test(env.AGENT_WALLET_ADDRESS) ? env.AGENT_WALLET_ADDRESS : null;
    return json({
      title: "Agent wallet: an AI agent with a small daily budget and a public purchase log",
      status: addr ? "active" : "wallet_not_set_yet",
      wallet: addr ? { address: addr, network: rules.network, explorer: "https://basescan.org/address/" + addr, note: "Every payment is verifiable on-chain; tx hashes in the log are reported by the agent, check them at the explorer." } : null,
      rules: { per_purchase_usdc: rules.per_purchase_usdc, daily_usdc: rules.daily_usdc, allowed_hosts: rules.allowed_hosts.length ? rules.allowed_hosts : "any public https host",
        enforcement: "The wallet balance is the hard limit (topped up by hand, no auto top-up). Orb Studio also approves each purchase against these caps before the agent pays." },
      summary: s, entries: entries.slice(-50).reverse().map(({ host, ...e }) => ({ host, ...e })),
      how_it_works: "1) The agent asks POST /api/v1/agent-wallet/authorize with the resource, price and its reason. 2) If approved, it pays over x402. 3) It reports the outcome with POST /api/v1/agent-wallet/result. Write calls need a secret key; reading is open.",
      page: "https://orbstudio.org/tools/agent-wallet",
    });
  }
  if (request.method !== "POST") return json({ error: "use GET to read the log; POST /authorize and /result need the agent key" }, 405);
  if (!env.AGENT_LEDGER_KEY) return json({ error: "agent ledger key is not configured" }, 503);
  if (!eq(request.headers.get("x-agent-key"), env.AGENT_LEDGER_KEY)) return json({ error: "bad or missing x-agent-key" }, 401);
  let b = {}; try { b = await request.json(); } catch (e) { return json({ error: "JSON body required" }, 400); }
  const entries = await load(), now = Date.now();
  if (url.pathname === "/api/v1/agent-wallet/authorize") {
    const d = decide(rules, entries, b, now), id = "AW-" + now.toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 5).toUpperCase();
    const base = { id, t: now, resource_url: clip(b.resource_url, 300), amount_usdc: Number(b.amount_usdc) || 0, reason: clip(b.reason, 400) };
    if (!d.ok) { entries.push({ ...base, host: (() => { try { return new URL(base.resource_url).hostname; } catch (e) { return ""; } })(), outcome: "refused", refusal: d.reason }); await sharedPut(env, KEY, entries.slice(-MAX_ENTRIES)); return json({ approved: false, reason: d.reason }); }
    entries.push({ ...base, host: d.host, amount_usdc: d.amount, outcome: "approved" });
    await sharedPut(env, KEY, entries.slice(-MAX_ENTRIES));
    return json({ approved: true, id, amount_usdc: d.amount, note: "Pay now over x402, then POST /api/v1/agent-wallet/result with this id. The reservation expires in 30 minutes." });
  }
  if (url.pathname === "/api/v1/agent-wallet/result") {
    const e = entries.find((x) => x.id === String(b.id || ""));
    if (!e) return json({ error: "unknown id" }, 404);
    if (e.outcome !== "approved") return json({ error: "this id is already closed: " + e.outcome }, 409);
    const ok = b.outcome === "bought";
    const tx = clip(b.tx_hash, 80);
    if (ok && !/^0x[0-9a-fA-F]{64}$/.test(tx)) return json({ error: "outcome bought requires tx_hash (0x + 64 hex)" }, 400);
    e.outcome = ok ? "bought" : "failed";
    if (ok) e.tx_hash = tx, e.tx_url = "https://basescan.org/tx/" + tx;
    e.got = clip(b.got || b.result_summary, 500); e.useful = ["yes", "partly", "no"].includes(b.useful) ? b.useful : undefined; e.closed_at = now;
    if (!ok) e.failure = clip(b.error || b.got, 200);
    await sharedPut(env, KEY, entries.slice(-MAX_ENTRIES));
    return json({ recorded: true, id: e.id, outcome: e.outcome });
  }
  return json({ error: "unknown path" }, 404);
}
