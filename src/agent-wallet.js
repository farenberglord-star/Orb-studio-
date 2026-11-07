// «Кошелёк агента»: публичный журнал покупок ИИ-агента с небольшим дневным бюджетом (USDC на Base) и сервер правил.
// Деньги и ключ живут не здесь: агент (Грок-бот) платит сам. Сайт даёт разрешение по правилам (authorize), принимает итог (result)
// и показывает журнал всем. Баланс кошелька — главный лимит, правила ниже — второй.
const KEY = "agent-wallet-ledger", APPROVALS = "agent-wallet-approvals", MAX_ENTRIES = 400;
const BASE_USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const BASE_NETWORK = "eip155:8453";
const H = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "content-type, x-agent-key, x-approval-key", "Access-Control-Allow-Methods": "GET, POST, OPTIONS" };

export function walletRules(env) {
  const num = (v, d) => { const n = parseFloat(v); return Number.isFinite(n) && n > 0 ? n : d; };
  return { limits_enabled: env.AGENT_LIMITS_ENABLED === "1", per_purchase_usdc: num(env.AGENT_MAX_PURCHASE_USD, 0.05), daily_usdc: num(env.AGENT_DAILY_CAP_USD, 2), network: "Base (eip155:8453)", asset: "USDC",
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

export function resourceUrlProblem(value) {
  let u; try { u = new URL(String(value || "")); } catch (e) { return "resource_url is not a valid URL"; }
  if (u.protocol !== "https:") return "only https resources";
  if (u.username || u.password) return "credentials in URL are not allowed";
  const h = u.hostname.toLowerCase().replace(/\.$/, "");
  if (!h || h === "localhost" || h.endsWith(".local") || h.endsWith(".internal") || h.includes(":") || h.startsWith("[")) return "host must be a public domain name";
  if (/^\d+\.\d+\.\d+\.\d+$/.test(h)) return "host must be a public domain name";
  if (!/^[a-z0-9.-]+$/.test(h) || !h.includes(".")) return "host must be a public domain name";
  return "";
}
const atomic = (n) => { const x = Number(n); return Number.isFinite(x) ? Math.round(x * 1e6) : 0; };
export function approvalMatches(approval, req) {
  if (!approval || approval.state !== "open") return false;
  if (resourceUrlProblem(approval.resource_url) || resourceUrlProblem(req.resource_url)) return false;
  if (new URL(approval.resource_url).href !== new URL(req.resource_url).href) return false;
  if (approval.network !== BASE_NETWORK || req.network !== BASE_NETWORK) return false;
  if (String(approval.asset || "").toLowerCase() !== BASE_USDC.toLowerCase() || String(req.asset || "").toLowerCase() !== BASE_USDC.toLowerCase()) return false;
  if (!/^0x[0-9a-fA-F]{40}$/.test(approval.pay_to || "") || String(approval.pay_to).toLowerCase() !== String(req.pay_to || "").toLowerCase()) return false;
  const amount = atomic(approval.amount_usdc);
  return amount > 0 && amount === atomic(req.amount_usdc);
}

export function decide(rules, entries, req, now = Date.now()) {
  const problem = resourceUrlProblem(req.resource_url);
  if (problem) return { ok: false, reason: problem };
  const u = new URL(req.resource_url);
  const amount = Number(req.amount_usdc);
  if (!(amount > 0)) return { ok: false, reason: "amount_usdc must be a positive number" };
  if (rules.limits_enabled && amount > rules.per_purchase_usdc) return { ok: false, reason: `over the per-purchase cap of ${rules.per_purchase_usdc} USDC` };
  if (rules.allowed_hosts.length && !rules.allowed_hosts.includes(u.hostname.toLowerCase())) return { ok: false, reason: "host is not on the allowed list" };
  if (clip(req.reason, 400).length < 15) return { ok: false, reason: "reason (15–400 characters) is required: say why this purchase" };
  if (entries.some((e) => e.outcome === "pending" && e.resource_url === u.href)) return { ok: false, reason: "an earlier payment for this resource is still unresolved; do not sign a new authorization" };
  const s = summarizeLedger(entries, now);
  if (rules.limits_enabled && s.spent_today_usdc + s.reserved_usdc + amount > rules.daily_usdc + 1e-9) return { ok: false, reason: `over the daily cap of ${rules.daily_usdc} USDC (spent ${s.spent_today_usdc}, reserved ${s.reserved_usdc})` };
  return { ok: false, screened: true, host: u.hostname.toLowerCase(), amount: round(amount), href: u.href, reason: "one-time user approval required" };
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
      rules: { limits_enabled: rules.limits_enabled, per_purchase_usdc: rules.limits_enabled ? rules.per_purchase_usdc : null, daily_usdc: rules.limits_enabled ? rules.daily_usdc : null, allowed_hosts: rules.allowed_hosts.length ? rules.allowed_hosts : "any public https host",
        enforcement: "Budget caps are not a purchase approval. Each real payment needs a separate one-time approval of the merchant, network, resource and total. No automatic top-up." },
      summary: s, entries: entries.slice(-50).reverse().map(({ host, ...e }) => ({ host, ...e })),
      how_it_works: "1) The user records a one-time approval of merchant, network, resource and total. 2) The agent asks POST /api/v1/agent-wallet/authorize. Budget alone is refused. 3) It pays only after that exact approval, then POST /api/v1/agent-wallet/result. The ledger key cannot create an approval.",
      page: "https://orbstudio.org/tools/agent-wallet",
    });
  }
  if (request.method !== "POST") return json({ error: "use GET to read the log; POST /approve needs the approval key, /authorize and /result need the ledger key" }, 405);
  let b = {}; try { b = await request.json(); } catch (e) { return json({ error: "JSON body required" }, 400); }
  const now = Date.now();
  if (url.pathname === "/api/v1/agent-wallet/approve") {
    if (!env.AGENT_APPROVAL_KEY || !env.AGENT_LEDGER_KEY || eq(env.AGENT_APPROVAL_KEY, env.AGENT_LEDGER_KEY)) return json({ error: "approval key is not configured", blocked: true }, 503);
    if (!eq(request.headers.get("x-approval-key"), env.AGENT_APPROVAL_KEY)) return json({ error: "bad or missing x-approval-key" }, 401);
    const proposal = { resource_url: b.resource_url, network: b.network, asset: b.asset, pay_to: b.pay_to, amount_usdc: b.amount_usdc, state: "open" };
    if (!approvalMatches(proposal, proposal)) return json({ error: "approval must be exact https resource, eip155:8453, Base USDC, merchant address and positive total" }, 400);
    const href = new URL(proposal.resource_url).href;
    const approvals = (await sharedGet(env, APPROVALS, 1e13)) || [];
    const id = "AP-" + crypto.randomUUID();
    approvals.push({ id, t: now, state: "open", resource_url: href, network: BASE_NETWORK, asset: BASE_USDC, pay_to: proposal.pay_to, amount_usdc: atomic(proposal.amount_usdc) / 1e6 });
    await sharedPut(env, APPROVALS, approvals.slice(-MAX_ENTRIES));
    return json({ recorded: true, id, state: "open" });
  }
  if (!env.AGENT_LEDGER_KEY) return json({ error: "agent ledger key is not configured" }, 503);
  if (!eq(request.headers.get("x-agent-key"), env.AGENT_LEDGER_KEY)) return json({ error: "bad or missing x-agent-key" }, 401);
  const entries = await load();
  if (url.pathname === "/api/v1/agent-wallet/authorize") {
    const d = decide(rules, entries, b, now), id = "AW-" + crypto.randomUUID();
    const href = (() => { try { return new URL(b.resource_url).href; } catch (e) { return clip(b.resource_url, 300); } })();
    const base = { id, t: now, resource_url: href, amount_usdc: Number(b.amount_usdc) || 0, reason: clip(b.reason, 400) };
    const refuse = async (reason) => { entries.push({ ...base, host: d.host || "", outcome: "refused", refusal: reason }); await sharedPut(env, KEY, entries.slice(-MAX_ENTRIES)); return json({ approved: false, reason }); };
    if (!d.screened) return refuse(d.reason);
    const approvals = (await sharedGet(env, APPROVALS, 1e13)) || [];
    const match = approvals.find((a) => approvalMatches(a, { ...b, resource_url: href }));
    if (!match) return refuse("one-time user approval required");
    match.state = "reserved"; match.reserved_by = id;
    entries.push({ ...base, host: d.host, amount_usdc: d.amount, outcome: "approved", approval_id: match.id, pay_to: match.pay_to, network: BASE_NETWORK, asset: BASE_USDC });
    await sharedPut(env, APPROVALS, approvals);
    await sharedPut(env, KEY, entries.slice(-MAX_ENTRIES));
    return json({ approved: true, id, amount_usdc: d.amount, network: BASE_NETWORK, asset: BASE_USDC, pay_to: match.pay_to, resource_url: href, note: "One payment only. On 202 or an uncertain settle, repeat the same signed authorization. Do not sign a new one." });
  }
  if (url.pathname === "/api/v1/agent-wallet/result") {
    const e = entries.find((x) => x.id === String(b.id || ""));
    if (!e) return json({ error: "unknown id" }, 404);
    const tx = clip(b.tx_hash, 80);
    const approvals = (await sharedGet(env, APPROVALS, 1e13)) || [];
    const release = () => { const a = approvals.find((x) => x.id === e.approval_id); if (a && a.state === "reserved") a.state = "open"; };
    const consume = () => { const a = approvals.find((x) => x.id === e.approval_id); if (a) a.state = "used"; };
    if (e.outcome === "pending") {
      if (b.outcome !== "bought") return json({ error: "a pending payment cannot be cleared by the agent; do not sign a new authorization" }, 409);
      if (!/^0x[0-9a-fA-F]{64}$/.test(tx)) return json({ error: "outcome bought requires tx_hash (0x + 64 hex)" }, 400);
      e.outcome = "bought"; e.tx_hash = tx; e.tx_url = "https://basescan.org/tx/" + tx; e.closed_at = now; consume();
    } else if (e.outcome === "approved") {
      if (b.outcome === "bought") {
        if (!/^0x[0-9a-fA-F]{64}$/.test(tx)) return json({ error: "outcome bought requires tx_hash (0x + 64 hex)" }, 400);
        e.outcome = "bought"; e.tx_hash = tx; e.tx_url = "https://basescan.org/tx/" + tx; e.closed_at = now; consume();
      } else if (b.outcome === "pending") { e.outcome = "pending"; e.failure = clip(b.error, 200); consume(); }
      else if (b.outcome === "blocked" || b.outcome === "failed") { e.outcome = b.outcome === "blocked" ? "blocked" : "failed"; e.failure = clip(b.error || b.got, 200); e.closed_at = now; release(); }
      else return json({ error: "outcome must be bought, pending, failed or blocked" }, 400);
    } else return json({ error: "this id is already closed: " + e.outcome }, 409);
    e.got = clip(b.got || b.result_summary, 500); e.useful = ["yes", "partly", "no"].includes(b.useful) ? b.useful : undefined;
    await sharedPut(env, APPROVALS, approvals);
    await sharedPut(env, KEY, entries.slice(-MAX_ENTRIES));
    return json({ recorded: true, id: e.id, outcome: e.outcome });
  }
  return json({ error: "unknown path" }, 404);
}
