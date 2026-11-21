import { test } from "node:test";
import assert from "node:assert/strict";
import { langDecision } from "../src/langredir.js";

const pick = (req, ok) => { const al = (req.headers.get("accept-language") || "").slice(0, 2).toLowerCase(); return ok.includes(al) ? al : "en"; };
const deps = { isAgent: (ua) => /bot|crawl/i.test(ua), pickSite: (r) => pick(r, ["ru", "de", "en"]), pickStudio: (r) => pick(r, ["ru", "de", "en"]), translated: new Set(["world", "sensors", "tools/court"]) };
const UA = "Mozilla/5.0 (Linux; Android 14) Chrome/131 Mobile";
const req = (u, h = {}) => new Request(u, { headers: { accept: "text/html", "user-agent": UA, ...h } });
const D = (u, h) => langDecision(req(u, h), new URL(u), deps);

test("русский телефон + немецкая ссылка из WhatsApp → русская версия", () => {
  assert.deepEqual(D("https://orbstudio.org/de/", { "accept-language": "ru-RU,ru;q=0.9" }), { redirect: "https://orbstudio.org/ru/" });
  assert.deepEqual(D("https://orbstudio.org/de/world?x=1", { "accept-language": "ru" }), { redirect: "https://orbstudio.org/ru/world?x=1" });
});
test("румынский и турецкий телефон: и студии, и остальной сайт — английский", () => {
  assert.deepEqual(D("https://orbstudio.org/de/roundtable", { "accept-language": "ro-RO" }), { redirect: "https://orbstudio.org/en/roundtable" });
  assert.equal(D("https://orbstudio.org/en/studio", { "accept-language": "tr" }), null, "Turkish is no longer a site language: the visitor stays on the English page"); assert.equal(D("https://orbstudio.org/ro/studio", { "accept-language": "ro" }), null);
  assert.deepEqual(D("https://orbstudio.org/de/world", { "accept-language": "ro-RO" }), { redirect: "https://orbstudio.org/en/world" });
});
test("язык совпадает — без перенаправления", () => {
  assert.equal(D("https://orbstudio.org/de/", { "accept-language": "de-DE" }), null);
});
test("выбор на сайте запоминается и уважается", () => {
  assert.deepEqual(D("https://orbstudio.org/de/world", { "accept-language": "ru", referer: "https://orbstudio.org/world" }), { setCookie: "de" });
  assert.equal(D("https://orbstudio.org/de/world", { "accept-language": "ru", cookie: "a=1; orb_lang=de" }), null);
  assert.deepEqual(D("https://orbstudio.org/en/world", { "accept-language": "ru", cookie: "orb_lang=de" }), { redirect: "https://orbstudio.org/de/world" });
});
test("роботы, агенты, не-HTML и страницы без перевода — не трогаем", () => {
  assert.equal(D("https://orbstudio.org/de/", { "accept-language": "ru", "user-agent": "Googlebot/2.1" }), null);
  assert.equal(langDecision(new Request("https://orbstudio.org/de/", { headers: { accept: "application/json", "user-agent": UA, "accept-language": "ru" } }), new URL("https://orbstudio.org/de/"), deps), null);
  assert.equal(D("https://orbstudio.org/de/unknown-page", { "accept-language": "ru" }), null);
  assert.equal(D("https://orbstudio.org/world", { "accept-language": "de" }), null); // без языка в адресе — работает старая логика
});
