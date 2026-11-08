import assert from "node:assert/strict";
import { courtGate } from "../src/court.js";
import { canonicalJson } from "../src/court-signing.js";
const keyStore = new Map(); let cases = [];
const env = { DB: { prepare(sql) { const o = { a: [], bind(...a) { o.a = a; return o; },
  async run() { if (/INSERT OR IGNORE INTO shared/.test(sql) && !keyStore.has("k")) keyStore.set("k", o.a[0]); return {}; },
  async first() { if (/FROM shared/.test(sql)) return keyStore.has("k") ? { v: keyStore.get("k") } : null; if (/FROM court_cases WHERE id=/.test(sql)) return cases.find((c) => c.id === o.a[0]) || null; return null; },
  async all() { if (/WHERE day=\?1 AND fp=\?2/.test(sql)) return { results: cases.filter((c) => c.day === o.a[0] && c.fp === o.a[1]) }; return { results: [] }; } }; return o; } } };
const ctx = { waitUntil: () => {} };
const get = (path, ip = "203.0.113.7") => courtGate(new Request("https://orbstudio.org" + path, { headers: { "cf-connecting-ip": ip } }), env, ctx);
// зеркало без записей
let r = await get("/api/v1/court/me"); assert.equal(r.status, 200);
let d = await r.json(); assert.equal(d.status, "NO_CASES_TODAY"); assert.equal(d.view, "mirror"); assert.match(d.fingerprint_today, /^[0-9a-f]{8}$/); assert.ok(d.signature && d.signature.alg === "Ed25519");
assert.equal(r.headers.get("cache-control"), "private, no-store"); assert.ok(!("trust_score" in d) && !("score" in d));
assert.match(d.note, /not a reputation score/);
// появляется дело с тем же отпечатком
const day = new Date().toISOString().slice(0, 10);
cases = [{ id: "ORB-2026-ABC123", ts: Date.now(), day, fp: d.fingerprint_today, defendant: "x", charge: "SCAN_ADMIN", evidence: "/.env", verdict: "WARNING", priors: 0 }];
r = await get("/api/v1/court/me"); d = await r.json(); assert.equal(d.status, "CASES_FILED_TODAY"); assert.equal(d.cases_today[0].case_id, "ORB-2026-ABC123");
// другой адрес не видит чужих дел
d = await (await get("/api/v1/court/me", "198.51.100.9")).json(); assert.equal(d.status, "NO_CASES_TODAY");
// подпись проверяется открытым ключом, подделка нет
const k = await (await get("/.well-known/orb-court-key.json")).json(); assert.ok(!("d" in k.jwk));
const pub = await crypto.subtle.importKey("jwk", k.jwk, { name: "Ed25519" }, false, ["verify"]);
const check = async (doc) => { const { signature, ...rest } = doc; const raw = Uint8Array.from(atob(signature.value.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0)); return crypto.subtle.verify({ name: "Ed25519" }, pub, raw, new TextEncoder().encode(canonicalJson(rest))); };
d = await (await get("/api/v1/court/me")).json(); assert.equal(await check(d), true); d.status = "NO_CASES_TODAY"; assert.equal(await check(d), false);
// карточка дела подписана
const cr = await get("/api/v1/court/case/ORB-2026-ABC123"); const card = await cr.json(); if (!card.case_id) console.log(cr.status, JSON.stringify(card).slice(0, 300)); assert.equal(card.case_id, "ORB-2026-ABC123"); assert.equal(await check(card), true);
console.log("court-mirror: ok");
