// Проверка одной покупки в браузере MetaMask. Подпись только по кнопке.
// Платёж на сервер продавца отсюда не отправляется.
export const BASE_CHAIN_ID = 8453;
export const BASE_CHAIN_HEX = "0x2105";
export const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const USDC_NAME = "USD Coin";
export const USDC_VERSION = "2";

const TYPES = {
  EIP712Domain: [
    { name: "name", type: "string" },
    { name: "version", type: "string" },
    { name: "chainId", type: "uint256" },
    { name: "verifyingContract", type: "address" },
  ],
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
};

const fail = (code) => { throw Object.assign(new Error(code), { code }); };
const same = (a, b) => String(a || "").toLowerCase() === String(b || "").toLowerCase();

export function resourceProblem(value) {
  let url;
  try { url = new URL(String(value || "")); } catch (e) { return "invalid_url"; }
  if (url.protocol !== "https:") return "not_https";
  if (url.username || url.password) return "url_credentials";
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (!host || host === "localhost" || host.endsWith(".local") || host.endsWith(".internal") || host.includes(":") || /^\d+\.\d+\.\d+\.\d+$/.test(host)) return "forbidden_host";
  if (url.href.length > 300 || /:/.test(url.pathname)) return "not_concrete";
  return "";
}

export function pageQuery(search) {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  for (const key of params.keys()) {
    if (key !== "resource" && key !== "preview") fail("forbidden_query");
    if (/sig|key|token|auth|secret/i.test(key)) fail("forbidden_query");
  }
  if (params.get("preview") === "1") return { preview: true, resource: "" };
  const resource = params.get("resource") || "";
  if (!resource) return { preview: false, resource: "" };
  const problem = resourceProblem(resource);
  if (problem) fail(problem);
  return { preview: false, resource: new URL(resource).href };
}

export function proposalFromChallenge(resource, challenge, now = Math.floor(Date.now() / 1000)) {
  const problem = resourceProblem(resource);
  if (problem) fail(problem);
  const req = challenge && challenge.accepts && challenge.accepts[0];
  if (!req || challenge.x402Version !== 2 || req.scheme !== "exact" || req.network !== "eip155:8453") fail("not_base_exact");
  if (!same(req.asset, USDC)) fail("not_base_usdc");
  if (!/^0x[0-9a-fA-F]{40}$/.test(req.payTo || "")) fail("bad_merchant");
  if (!/^\d+$/.test(String(req.amount || "")) || BigInt(req.amount) < 1n) fail("bad_amount");
  const timeout = Number(req.maxTimeoutSeconds);
  if (!Number.isInteger(timeout) || timeout < 1 || timeout > 120) fail("bad_timeout");
  if (req.extra && (req.extra.name !== USDC_NAME || String(req.extra.version) !== USDC_VERSION)) fail("seller_domain_rejected");
  return {
    resource: new URL(resource).href,
    merchant: req.payTo,
    network: "eip155:8453",
    asset: USDC,
    amount_atomic: String(req.amount),
    amount_usdc: (Number(req.amount) / 1e6).toFixed(6),
    timeout,
    valid_after: String(now),
    valid_before: String(now + timeout),
    domain_name: USDC_NAME,
    state: "approval_needed",
  };
}

export function typedData(proposal, from, nonce) {
  return {
    types: TYPES,
    primaryType: "TransferWithAuthorization",
    domain: { name: USDC_NAME, version: USDC_VERSION, chainId: BASE_CHAIN_ID, verifyingContract: USDC },
    message: {
      from,
      to: proposal.merchant,
      value: proposal.amount_atomic,
      validAfter: proposal.valid_after,
      validBefore: proposal.valid_before,
      nonce,
    },
  };
}

function nonceBytes() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return "0x" + [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function createReview() {
  let proposal = null;
  let account = "";
  let chainOk = false;
  let pending = null;
  return {
    payment: "blocked",
    view() {
      return proposal ? { ...proposal, account: account || null, chain_ok: chainOk, payment: "blocked" } : { payment: "blocked", state: "empty" };
    },
    async load(resource, fetchImpl) {
      const problem = resourceProblem(resource);
      if (problem) fail(problem);
      const response = await fetchImpl(resource, { method: "GET", redirect: "manual", headers: { accept: "application/json" } });
      if (response.status === 0 || (response.status >= 300 && response.status < 400)) fail("redirect_refused");
      if (response.status !== 402) fail("not_402");
      const header = response.headers.get("payment-required");
      const raw = header ? atob(header) : await response.text();
      if (raw.length > 100000) fail("too_large");
      proposal = proposalFromChallenge(resource, JSON.parse(raw));
      pending = null;
      return this.view();
    },
    showPreview() {
      const now = 1_700_000_000;
      proposal = proposalFromChallenge("https://orbstudio.org/api/v1/violin/midi", {
        x402Version: 2,
        accepts: [{ scheme: "exact", network: "eip155:8453", asset: USDC, payTo: "0x" + "11".repeat(20), amount: "10000", maxTimeoutSeconds: 120, extra: { name: USDC_NAME, version: USDC_VERSION } }],
      }, now);
      proposal.fixture = true;
      return this.view();
    },
    async connect(provider) {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      account = String(accounts && accounts[0] || "");
      if (!/^0x[0-9a-fA-F]{40}$/.test(account)) fail("no_account");
      return this.view();
    },
    async readChain(provider) {
      const hex = await provider.request({ method: "eth_chainId" });
      chainOk = String(hex).toLowerCase() === BASE_CHAIN_HEX;
      return { chain_ok: chainOk };
    },
    async switchChain(provider) {
      await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: BASE_CHAIN_HEX }] });
      return this.readChain(provider);
    },
    async sign(provider, { preview = false } = {}) {
      if (preview || (proposal && proposal.fixture)) fail("preview_blocked");
      if (!proposal || proposal.state !== "approval_needed") fail("no_proposal");
      if (!account) fail("not_connected");
      if (!chainOk) fail("wrong_chain");
      if (!pending) pending = { nonce: nonceBytes(), typed: null };
      pending.typed = typedData(proposal, account, pending.nonce);
      if (!same(pending.typed.message.from, account) || !same(pending.typed.message.to, proposal.merchant) || pending.typed.message.value !== proposal.amount_atomic) fail("review_mismatch");
      if (pending.typed.domain.verifyingContract !== USDC || pending.typed.domain.chainId !== BASE_CHAIN_ID) fail("domain_mismatch");
      const payload = JSON.stringify(pending.typed);
      await provider.request({ method: "eth_signTypedData_v4", params: [account, payload] });
      return { signed: true, submitted: false, payment: "blocked", stored: false };
    },
  };
}
