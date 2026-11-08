import assert from "node:assert/strict";
import { canonicalJson, signedBody, publicKeyDoc } from "../src/court-signing.js";
// простая имитация D1 для таблицы shared
const store = new Map();
const env = { DB: { prepare(sql) { return { bind(...a) { this.a = a; return this; },
  async run() { if (/INSERT OR IGNORE/.test(sql) && !store.has("court-signing-key")) store.set("court-signing-key", this.a[0]); return {}; },
  async first() { return store.has("court-signing-key") ? { v: store.get("court-signing-key") } : null; } }; } } };
assert.equal(canonicalJson({ b: 1, a: { d: [2, { z: 1, y: null }], c: "x" } }), '{"a":{"c":"x","d":[2,{"y":null,"z":1}]},"b":1}');
const body = { court: "t", last_7_days: { PROBE: 3 }, cases: [{ id: "ORB-1", n: 1 }] };
// без базы и без ключа отчёт отдаётся без подписи, а не ломается
assert.deepEqual(await signedBody({}, body), body);
const out = await signedBody(env, body);
assert.equal(out.signature.alg, "Ed25519"); assert.ok(out.signed_at);
const doc = await publicKeyDoc(env); assert.equal(doc.alg, "Ed25519"); assert.ok(!("d" in doc.jwk), "закрытая часть не публикуется");
assert.equal(doc.kid, out.signature.kid);
const { signature, ...rest } = out;
const pub = await crypto.subtle.importKey("jwk", doc.jwk, { name: "Ed25519" }, false, ["verify"]);
const raw = Uint8Array.from(atob(signature.value.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));
assert.equal(await crypto.subtle.verify({ name: "Ed25519" }, pub, raw, new TextEncoder().encode(canonicalJson(rest))), true);
assert.equal(await crypto.subtle.verify({ name: "Ed25519" }, pub, raw, new TextEncoder().encode(canonicalJson({ ...rest, last_7_days: { PROBE: 4 } }))), false, "изменённый отчёт не проходит проверку");
console.log("court-signing: ok");
