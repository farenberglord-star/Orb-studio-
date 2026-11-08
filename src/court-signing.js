// Подпись Ed25519 для отчётов Судебной палаты. Подписывается весь ответ (без поля "signature"), поэтому любой может проверить,
// что отчёт выпущен Orb Studio и не изменён, без обращения к нашей базе. Подписывается только то, что суд и так публикует (без личных данных).
// Ключ: если задан секрет COURT_SIGNING_KEY (JWK закрытого ключа Ed25519 в виде JSON), берётся он; иначе пара создаётся при первом запросе
// и закрытая часть хранится только в таблице shared (ключ court-signing-key), наружу не отдаётся ни одним адресом.
const ALG = { name: "Ed25519" };
const b64u = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

export function canonicalJson(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v === undefined ? null : v);
  if (Array.isArray(v)) return "[" + v.map(canonicalJson).join(",") + "]";
  return "{" + Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => JSON.stringify(k) + ":" + canonicalJson(v[k])).join(",") + "}";
}

let cache = null;
async function importPair(privJwk) {
  const pubJwk = { kty: "OKP", crv: "Ed25519", x: privJwk.x };
  const priv = await crypto.subtle.importKey("jwk", { ...privJwk, key_ops: ["sign"] }, ALG, false, ["sign"]);
  const kidBuf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(privJwk.x));
  return { priv, pubJwk, kid: "orb-court-" + b64u(kidBuf).slice(0, 10) };
}
export async function loadSigner(env) {
  if (cache) return cache;
  let jwk = null;
  if (env.COURT_SIGNING_KEY) { try { jwk = JSON.parse(env.COURT_SIGNING_KEY); } catch (e) {} }
  if (!jwk && env.DB) {
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS shared (k TEXT PRIMARY KEY, v TEXT NOT NULL, ts INTEGER NOT NULL)").run();
    let row = await env.DB.prepare("SELECT v FROM shared WHERE k='court-signing-key'").first();
    if (!row) {
      const kp = await crypto.subtle.generateKey(ALG, true, ["sign", "verify"]);
      const fresh = await crypto.subtle.exportKey("jwk", kp.privateKey);
      // INSERT OR IGNORE: если два запроса создали пару одновременно, побеждает первая, остальные читают её же
      await env.DB.prepare("INSERT OR IGNORE INTO shared (k, v, ts) VALUES ('court-signing-key', ?1, ?2)").bind(JSON.stringify({ kty: fresh.kty, crv: fresh.crv, x: fresh.x, d: fresh.d }), Date.now()).run();
      row = await env.DB.prepare("SELECT v FROM shared WHERE k='court-signing-key'").first();
    }
    jwk = JSON.parse(row.v);
  }
  if (!jwk || !jwk.d) return null;
  cache = await importPair(jwk);
  return cache;
}
export async function signedBody(env, body) {
  const s = await loadSigner(env).catch(() => null);
  if (!s) return body;
  const signed_at = new Date().toISOString(), payload = { ...body, signed_at };
  const sig = await crypto.subtle.sign(ALG, s.priv, new TextEncoder().encode(canonicalJson(payload)));
  return { ...payload, signature: { alg: "Ed25519", kid: s.kid, value: b64u(sig), signed_at, public_key: "https://orbstudio.org/.well-known/orb-court-key.json", how_to_verify: "Remove the \"signature\" field, keep \"signed_at\" in the body, serialise the rest as canonical JSON (object keys sorted alphabetically at every level, no whitespace, JSON.stringify scalars) and verify the Ed25519 signature (base64url) with the public key." } };
}
export async function publicKeyDoc(env) {
  const s = await loadSigner(env).catch(() => null);
  if (!s) return { error: "signing key is not available" };
  return { kid: s.kid, alg: "Ed25519", jwk: s.pubJwk, use: "Verifies the \"signature\" field of https://orbstudio.org/api/v1/court responses.", note: "The key signs the court's public report only. It says the report was issued by Orb Studio and not altered. It does not certify anything about any agent's reputation." };
}
