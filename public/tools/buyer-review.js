// Проверка и оплата скрипки Orb Studio во встроенном браузере MetaMask.
// Подпись только по кнопке. Другие ресурсы не оплачиваются. Подпись остаётся в памяти вкладки.
export const BASE_CHAIN_ID = 8453;
export const BASE_CHAIN_HEX = "0x2105";
export const USDC = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
export const USDC_NAME = "USD Coin";
export const USDC_VERSION = "2";
// Скрипка продаётся только на этот адрес и не дороже 0,02 USDC: страница отказывается подписывать что-либо иное, даже если ответ сервера изменится.
export const VIOLIN_PAY_TO = "0xA91269022be3dc5208Ab3Da1eb288E261DE23DB5";
export const VIOLIN_MAX_ATOMIC = 20000n;

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

export function violinProblem(value) {
  const problem = resourceProblem(value);
  if (problem) return problem;
  const url = new URL(value);
  if (url.hostname !== "orbstudio.org" || url.pathname !== "/api/v1/violin/midi") return "external_payment_disabled";
  if ([...url.searchParams.keys()].some((key) => key !== "date")) return "forbidden_query";
  const date = url.searchParams.get("date");
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return "bad_date";
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
  const problem = violinProblem(resource);
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
    accepted: req,
  };
}

function paymentHeader(accepted, typed, signature) {
  return btoa(JSON.stringify({
    x402Version: 2,
    accepted,
    payload: {
      signature,
      authorization: {
        from: typed.message.from, to: typed.message.to, value: typed.message.value,
        validAfter: typed.message.validAfter, validBefore: typed.message.validBefore, nonce: typed.message.nonce,
      },
    },
  }));
}

function txFromReceipt(header) {
  if (!header) return null;
  try {
    const receipt = JSON.parse(atob(header));
    return receipt && receipt.success === true && /^0x[0-9a-fA-F]{64}$/.test(receipt.transaction || "") ? receipt.transaction : null;
  } catch (e) { return null; }
}

function publicResult(state, extra = {}) {
  return { state, tx: null, payment: state === "bought" ? "submitted" : "uncertain", stored: false, resign: false, ...extra };
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

export function createReview({ now = () => Math.floor(Date.now() / 1000) } = {}) {
  let proposal = null;
  let account = "";
  let chainOk = false;
  let pending = null;
  const view = () => proposal ? {
    resource: proposal.resource, merchant: proposal.merchant, network: proposal.network, asset: proposal.asset,
    amount_atomic: proposal.amount_atomic, amount_usdc: proposal.amount_usdc, timeout: proposal.timeout,
    domain_name: proposal.domain_name, state: pending && pending.submitted ? pending.state : proposal.state,
    account: account || null, chain_ok: chainOk, fixture: !!proposal.fixture, payment: pending && pending.submitted ? "submitted" : "not_sent", tx: pending && pending.tx || null,
  } : { payment: "not_sent", state: "empty" };
  async function submit(fetchImpl) {
    const target = proposal.resource;
    if (violinProblem(target)) fail("external_payment_disabled");
    let response;
    try {
      response = await fetchImpl(target, { method: "GET", redirect: "manual", signal: AbortSignal.timeout(20000), headers: { accept: "*/*", "PAYMENT-SIGNATURE": pending.header } });
    } catch (e) {
      pending.submitted = true; pending.state = "pending";
      return publicResult("pending", { submitted: true });
    }
    if (response.url && response.url !== target) { pending.submitted = true; pending.state = "pending"; return publicResult("pending", { submitted: true }); }
    if (response.status === 0 || (response.status >= 300 && response.status < 400)) { pending.submitted = true; pending.state = "pending"; return publicResult("pending", { submitted: true }); }
    if (response.status === 200) {
      const announced = Number(response.headers.get("content-length") || 0);
      if (announced > 2_000_000) { pending.submitted = true; pending.state = "pending"; return publicResult("pending", { submitted: true }); }
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.length > 2_000_000) { pending.submitted = true; pending.state = "pending"; return publicResult("pending", { submitted: true }); }
      const tx = txFromReceipt(response.headers.get("payment-response"));
      pending.submitted = true; pending.state = "bought"; pending.tx = tx; pending.file = bytes; pending.type = response.headers.get("content-type") || "application/octet-stream";
      pending.header = "";
      return publicResult("bought", { submitted: true, tx, bytes: bytes.length, type: pending.type, file: bytes });
    }
    pending.submitted = true; pending.state = "pending";
    return publicResult("pending", { submitted: true });
  }
  return {
    view,
    needsGuard() { return !!(pending && pending.submitted && pending.state === "pending"); },
    async load(resource, fetchImpl) {
      const problem = violinProblem(resource);
      if (problem) fail(problem);
      if (pending && pending.submitted) fail("pending_keep_same_authorization");
      const response = await fetchImpl(resource, { method: "GET", redirect: "manual", headers: { accept: "application/json" } });
      if (response.status === 0 || (response.status >= 300 && response.status < 400)) fail("redirect_refused");
      if (response.status !== 402) fail("not_402");
      const header = response.headers.get("payment-required");
      const raw = header ? atob(header) : await response.text();
      if (raw.length > 100000) fail("too_large");
      const next = proposalFromChallenge(resource, JSON.parse(raw), now());
      if (!same(next.merchant, VIOLIN_PAY_TO)) fail("merchant_not_pinned");
      if (BigInt(next.amount_atomic) > VIOLIN_MAX_ATOMIC) fail("amount_over_pinned_max");
      proposal = next;
      pending = null;
      return view();
    },
    showPreview() {
      proposal = proposalFromChallenge("https://orbstudio.org/api/v1/violin/midi", {
        x402Version: 2,
        accepts: [{ scheme: "exact", network: "eip155:8453", asset: USDC, payTo: "0x" + "11".repeat(20), amount: "10000", maxTimeoutSeconds: 120, extra: { name: USDC_NAME, version: USDC_VERSION } }],
      }, 1_700_000_000);
      proposal.fixture = true;
      return view();
    },
    async connect(provider) {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      const next = String(accounts && accounts[0] || "");
      if (!/^0x[0-9a-fA-F]{40}$/.test(next)) fail("no_account");
      if (pending && pending.submitted && account && !same(account, next)) fail("account_changed");
      account = next;
      return view();
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
    async sign(provider, fetchImpl, { preview = false } = {}) {
      if (preview || (proposal && proposal.fixture)) fail("preview_blocked");
      if (!proposal) fail("no_proposal");
      if (violinProblem(proposal.resource)) fail("external_payment_disabled");
      if (pending && pending.submitted) {
        if (pending.state === "bought") return publicResult("bought", { submitted: true, tx: pending.tx, bytes: pending.file ? pending.file.length : 0, type: pending.type, file: pending.file });
        const result = await submit(fetchImpl);
        if (now() >= Number(pending.typed.message.validBefore)) result.expired = true;
        return result;
      }
      if (!account) fail("not_connected");
      if (!chainOk) fail("wrong_chain");
      if (!pending) pending = { nonce: nonceBytes(), typed: null, header: "", submitted: false, state: "approval_needed" };
      pending.typed = typedData(proposal, account, pending.nonce);
      if (!same(pending.typed.message.from, account) || !same(pending.typed.message.to, proposal.merchant) || pending.typed.message.value !== proposal.amount_atomic) fail("review_mismatch");
      if (pending.typed.domain.verifyingContract !== USDC || pending.typed.domain.chainId !== BASE_CHAIN_ID || pending.typed.domain.name !== USDC_NAME) fail("domain_mismatch");
      if (now() >= Number(pending.typed.message.validBefore)) fail("expired_before_submit");
      let signature;
      try { signature = await provider.request({ method: "eth_signTypedData_v4", params: [account, JSON.stringify(pending.typed)] }); }
      catch (e) { pending = null; fail("wallet_rejected"); }
      if (typeof signature !== "string" || !/^0x[0-9a-fA-F]{130}$/.test(signature)) { pending = null; fail("wallet_rejected"); }
      pending.header = paymentHeader(proposal.accepted, pending.typed, signature);
      pending.submitted = true;
      return submit(fetchImpl);
    },
  };
}
