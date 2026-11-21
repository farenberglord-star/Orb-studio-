import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { saleConfig, b64, unb64 } from "../src/violin-sale.js";
import { handleTrackSale, trackCatalog, trackPrice, trackSaleOn, SALE_TRACKS, TRACK_LICENSE_URL } from "../src/radio-track-sale.js";

const ENV = { X402_PAY_TO: "0xA91269022be3dc5208Ab3Da1eb288E261DE23DB5", X402_FACILITATOR_URL: "https://facilitator.example", RADIO_TRACK_SALE: "1", RADIO_TRACK_PRICE_USD: "0.25" };
const FILE = new Uint8Array(20000).fill(7).buffer;
const deps = (calls) => ({ ctx: { waitUntil: (p) => Promise.resolve(p).catch(() => {}) }, agent: "test-agent", hit: async () => {}, log: async (k, d) => { calls.log.push([k, d]); }, file: async (p) => { calls.file.push(p); return FILE; } });
const get = (id, headers = {}) => new Request("https://orbstudio.org/api/v1/radio/track/buy?id=" + id, { headers });
const withFacilitator = async (answers, fn) => { const real = globalThis.fetch, seen = []; globalThis.fetch = async (u, o) => { const op = String(u).split("/").pop(); seen.push(op); return new Response(JSON.stringify(answers[op]), { status: 200 }); }; try { return await fn(seen); } finally { globalThis.fetch = real; } };

test("track sale: switch off means nothing is sold and nothing is charged", async () => {
  const calls = { log: [], file: [] }, env = { ...ENV, RADIO_TRACK_SALE: "0" };
  assert.equal(trackSaleOn(env), false); assert.equal(trackSaleOn({}), false); assert.equal(trackSaleOn(ENV), true);
  const r = await handleTrackSale(get("orbit-city"), saleConfig(env), env, deps(calls));
  assert.equal(r.status, 503); assert.equal((await r.json()).status, "sale_not_open_yet"); assert.deepEqual(calls.file, []);
  assert.equal(trackCatalog(saleConfig(env), env).status, "sale_not_open_yet"); assert.equal(trackCatalog(saleConfig(ENV), ENV).status, "on_sale");
  assert.equal(trackCatalog(saleConfig({ ...ENV, X402_PAY_TO: "" }), ENV).status, "sale_not_open_yet", "no wallet, no sale");
});

test("track sale: price, catalogue and the 402 challenge", async () => {
  assert.deepEqual(trackPrice(ENV), { usd: 0.25, atomic: "250000" }); assert.equal(trackPrice({}).usd, 0.25); assert.equal(trackPrice({ RADIO_TRACK_PRICE_USD: "999" }).usd, 5); assert.equal(trackPrice({ RADIO_TRACK_PRICE_USD: "-1" }).usd, 0.01);
  const cat = trackCatalog(saleConfig(ENV), ENV); assert.equal(cat.tracks.length, Object.keys(SALE_TRACKS).length); assert.equal(cat.tracks.find((x) => x.id === "orbit-city").buy_url, "https://orbstudio.org/api/v1/radio/track/buy?id=orbit-city"); assert.equal(cat.license_url, TRACK_LICENSE_URL);
  assert.ok(!JSON.stringify(cat).includes("/_sale/"), "the catalogue never shows where the paid file lies");
  const calls = { log: [], file: [] }, r = await handleTrackSale(get("orbit-city"), saleConfig(ENV), ENV, deps(calls));
  assert.equal(r.status, 402); const pr = JSON.parse(unb64(r.headers.get("PAYMENT-REQUIRED")));
  assert.equal(pr.x402Version, 2); assert.equal(pr.accepts[0].amount, "250000"); assert.equal(pr.accepts[0].payTo, ENV.X402_PAY_TO); assert.equal(pr.accepts[0].network, "eip155:8453"); assert.equal(pr.resource.mimeType, "audio/mpeg");
  assert.match(pr.resource.description, /non-exclusive licence/); assert.deepEqual(calls.file, [], "the file is not touched before payment");
  for (const bad of ["nope", "", "__proto__", "ORBIT-CITY/../x"]) assert.equal((await handleTrackSale(get(encodeURIComponent(bad)), saleConfig(ENV), ENV, deps(calls))).status, 404);
  assert.equal((await handleTrackSale(new Request("https://orbstudio.org/api/v1/radio/track/buy?id=orbit-city", { method: "POST" }), saleConfig(ENV), ENV, deps(calls))).status, 405);
});

test("track sale: the file is delivered only after verify and settle", async () => {
  const cfg = saleConfig(ENV), calls = { log: [], file: [] };
  const ch = await handleTrackSale(get("orbit-city"), cfg, ENV, deps(calls)), accepted = JSON.parse(unb64(ch.headers.get("PAYMENT-REQUIRED"))).accepts[0];
  const sig = b64(JSON.stringify({ x402Version: 2, accepted, payload: { signature: "0xabc" } }));
  const tx = "0x" + "ab".repeat(32);
  await withFacilitator({ verify: { isValid: true, payer: "0x1111111111111111111111111111111111111111" }, settle: { success: true, transaction: tx, network: "eip155:8453", payer: "0x1111111111111111111111111111111111111111" } }, async (seen) => {
    const r = await handleTrackSale(get("orbit-city", { "PAYMENT-SIGNATURE": sig }), cfg, ENV, deps(calls));
    assert.equal(r.status, 200); assert.equal(r.headers.get("Content-Type"), "audio/mpeg"); assert.match(r.headers.get("Content-Disposition"), /orb-studio-orbit-city\.mp3/); assert.equal(r.headers.get("X-License"), TRACK_LICENSE_URL);
    assert.equal((await r.arrayBuffer()).byteLength, 20000); assert.equal(JSON.parse(unb64(r.headers.get("PAYMENT-RESPONSE"))).transaction, tx);
    assert.deepEqual(seen, ["verify", "settle"]); assert.deepEqual(calls.file, ["/_sale/orbit-city.mp3"]);
    await new Promise((s) => setTimeout(s, 5)); assert.equal(calls.log[0][0], "sale"); assert.equal(calls.log[0][1].usdc, 0.25); assert.equal(calls.log[0][1].product, "radio track orbit-city");
  });
  const c2 = { log: [], file: [] };
  await withFacilitator({ verify: { isValid: false, invalidReason: "insufficient_funds" }, settle: { success: true } }, async (seen) => {
    const r = await handleTrackSale(get("orbit-city", { "PAYMENT-SIGNATURE": sig }), cfg, ENV, deps(c2));
    assert.equal(r.status, 402); assert.deepEqual(seen, ["verify"]); assert.deepEqual(c2.file, []); assert.deepEqual(c2.log, []);
  });
  const wrong = b64(JSON.stringify({ x402Version: 2, accepted: { ...accepted, amount: "1" }, payload: {} }));
  await withFacilitator({}, async (seen) => { assert.equal((await handleTrackSale(get("orbit-city", { "PAYMENT-SIGNATURE": wrong }), cfg, ENV, deps(c2))).status, 402); assert.deepEqual(seen, [], "a cheaper payment never reaches the facilitator"); });
});

test("track sale: the paid file cannot be fetched directly; switch and price are in the config", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"), toml = readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
  assert.match(w, /url\.pathname\.startsWith\("\/_sale\/"\)\) return json\(\{ error: "Not found" \}/); assert.ok(w.indexOf('startsWith("/_sale/")') < w.indexOf('"/api/v1/radio/track/buy"'));
  assert.match(toml, /"\/_sale", "\/_sale\/\*"\]/); assert.match(toml, /^RADIO_TRACK_SALE = "[01]"$/m, "the switch is always written out in the config"); assert.match(toml, /^RADIO_TRACK_PRICE_USD = "0\.25"$/m);
  for (const t of Object.values(SALE_TRACKS)) { assert.ok(statSync(new URL("../public" + t.file, import.meta.url)).size > 500_000); assert.ok(statSync(new URL("../public" + t.preview, import.meta.url)).size > 100_000); }
  const lic = readFileSync(new URL("../public/radio-track-license.txt", import.meta.url), "utf8"); assert.match(lic, /non-exclusive/); assert.match(lic, /cannot be returned/); assert.ok(!/DRAFT/.test(lic) || /^RADIO_TRACK_SALE = "0"$/m.test(toml), "an open sale does not run on a draft licence");
});

test("track sale: every track on the radio shelf is on sale by itself; originals are used when they exist", async () => {
  const { RADIO_TRACKS, SALE_ORIGINALS } = await import("../src/radio.js"), { saleOriginals } = await import("../tools/radio_tracks.mjs");
  assert.deepEqual(Object.keys(SALE_TRACKS), RADIO_TRACKS.map((t) => t.id), "the sale list is the shelf, nothing is listed by hand");
  for (const [id, t] of Object.entries(SALE_TRACKS)) { assert.equal(t.original, SALE_ORIGINALS.includes(id)); assert.equal(t.file, t.original ? "/_sale/" + id + ".mp3" : t.preview); assert.equal(t.format, t.original ? "MP3" : "M4A"); }
  assert.deepEqual(saleOriginals([{ id: "a" }, { id: "b" }, { id: "c" }], ["b.mp3", "zzz.mp3", "c.wav"]), ["b"]);
  const calls = { log: [], file: [] }, r = await handleTrackSale(get("autobahn-3"), saleConfig(ENV), ENV, deps(calls)), pr = JSON.parse(unb64(r.headers.get("PAYMENT-REQUIRED")));
  assert.equal(r.status, 402); assert.equal(pr.resource.mimeType, "audio/mp4"); assert.match(pr.resource.description, /the same file that plays on the radio/);
  assert.match(JSON.parse(unb64((await handleTrackSale(get("quiet-frequency"), saleConfig(ENV), ENV, deps(calls))).headers.get("PAYMENT-REQUIRED"))).resource.description, /the original download/);
  const g = readFileSync(new URL("../tools/radio_tracks.mjs", import.meta.url), "utf8"); assert.match(g, /re\("SALE_ORIGINALS"\)/);
});
