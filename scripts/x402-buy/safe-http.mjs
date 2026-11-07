import { resourceUrlProblem } from "../../src/agent-wallet.js";

export function targetProblem(url, { allowHttpTest = false } = {}) {
  let u;
  try { u = new URL(url); } catch (e) { return "invalid url"; }
  if (u.protocol === "http:" && allowHttpTest && (u.hostname === "127.0.0.1" || u.hostname === "localhost")) return "";
  return resourceUrlProblem(url);
}

export async function safeFetch(url, init = {}, fetchImpl = fetch, opts = {}) {
  const problem = targetProblem(url, opts);
  if (problem) throw Object.assign(new Error(problem), { code: "forbidden_target" });
  const headers = new Headers(init.headers || {});
  if (!opts.ledger) { headers.delete("x-agent-key"); headers.delete("x-approval-key"); }
  if (!opts.payment) headers.delete("payment-signature");
  const response = await fetchImpl(new URL(url).href, { ...init, headers, redirect: "manual" });
  if (response.status === 0 || (response.status >= 300 && response.status < 400)) {
    throw Object.assign(new Error("redirect refused"), { code: "redirect_refused" });
  }
  return response;
}
