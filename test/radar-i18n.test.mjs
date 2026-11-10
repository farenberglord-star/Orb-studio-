import test from "node:test";
import assert from "node:assert/strict";
import { radarI18n, RADAR_LEAD_I18N, RADAR_FAC_I18N } from "../src/radar-i18n.js";

const TITLES = { geo: ["Geo-Radar", "Geo radar"] };

test("radarI18n adds German and English titles", () => {
  const o = radarI18n({ id: "geo", title: "Гео-радар" }, false, TITLES);
  assert.equal(o.title_de, "Geo-Radar");
  assert.equal(o.title_en, "Geo radar");
  assert.equal(o.lead_de, undefined);
});

test("full mode adds leads and factor names with the Russian original kept", () => {
  const o = radarI18n({ id: "geo", title: "Гео-радар", fac: [["Военные", 100], ["Санкции", 20]] }, true, TITLES);
  assert.match(o.lead_de, /Russland/);
  assert.match(o.lead_en, /Russia/);
  assert.deepEqual(o.fac_i18n[0], { ru: "Военные", de: "Militär", en: "Military", value: 100 });
});

test("unknown radar and unknown factor fall back to the originals", () => {
  const o = radarI18n({ id: "x", title: "Т", fac: [["Нечто", 5]] }, true, {});
  assert.equal(o.title_de, "Т");
  assert.equal(o.fac_i18n[0].de, "Нечто");
});

test("every radar has a lead", () => {
  for (const id of ["geo", "budget", "politics", "economy", "crypto", "energy", "justice", "web"]) assert.ok(RADAR_LEAD_I18N[id], id);
  assert.ok(RADAR_FAC_I18N["Блокировки"]);
});

import { headlinesDe } from "../src/radar-i18n.js";

function mockEnv(handler) {
  const store = new Map();
  globalThis.caches = { default: { match: async (k) => (store.has(k.url) ? new Response(store.get(k.url)) : undefined), put: async (k, r) => { store.set(k.url, await r.text()); } } };
  globalThis.fetch = handler;
}

test("headlinesDe translates once and then serves from cache", async () => {
  let calls = 0;
  mockEnv(async () => { calls++; return new Response(JSON.stringify({ content: [{ type: "tool_use", input: { de: ["Eins", "Zwei"] } }] })); });
  const env = { ANTHROPIC_API_KEY: "k" };
  const a = await headlinesDe(env, "https://x.test", "geo", ["One", "Two"]);
  const b = await headlinesDe(env, "https://x.test", "geo", ["One", "Two"]);
  assert.deepEqual(a, ["Eins", "Zwei"]);
  assert.deepEqual(b, a);
  assert.equal(calls, 1);
});

test("headlinesDe returns null on a wrong count, an API error or no key", async () => {
  mockEnv(async () => new Response(JSON.stringify({ content: [{ type: "tool_use", input: { de: ["nur eins"] } }] })));
  assert.equal(await headlinesDe({ ANTHROPIC_API_KEY: "k" }, "https://x.test", "geo", ["a", "b"]), null);
  mockEnv(async () => new Response("no", { status: 500 }));
  assert.equal(await headlinesDe({ ANTHROPIC_API_KEY: "k" }, "https://x.test", "geo", ["c"]), null);
  assert.equal(await headlinesDe({}, "https://x.test", "geo", ["d"]), null);
});
