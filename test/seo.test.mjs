import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { explicitLang, barePath, isLocalizable, localHref, canonicalUrl, fixAlternate, alternateTags, isTestAgentName } from "../src/seo.js";

const TR = new Set(["world", "air", "about", "podcast", "tools/clips"]), O = "https://orbstudio.org";
test("links keep the language of the address", () => {
  assert.equal(localHref("/world", "ru", TR), "/ru/world"); assert.equal(localHref("/", "en", TR), "/en/"); assert.equal(localHref("/studio", "en", TR), "/en/studio");
  assert.equal(localHref("/air#duo", "de", TR), "/de/air#duo"); assert.equal(localHref("/podcast?x=1", "ru", TR), "/ru/podcast?x=1"); assert.equal(localHref("/tools/clips.html", "en", TR), "/en/tools/clips");
  assert.equal(localHref("/radio", "ru", TR), "/ru/radio"); assert.equal(localHref("/tools/inbox", "de", TR), "/de/tools/inbox");
  for (const h of ["/de/world", "/ru/", "/en", "/api/v1/pulse", "/go/kraken?from=x", "/media/a.webp", "/mcp", "/llms.txt", "/openapi.json", "/unknown-page", "//evil.example/x", "https://example.org/world", "#top", "mailto:a@b.c", "", null])
    assert.equal(localHref(h, "ru", TR), null, String(h));
  assert.equal(localHref("/world", "ro", TR), null); assert.equal(localHref("/world", null, TR), null);
});
test("address helpers", () => {
  assert.deepEqual(["/ru/", "/ru", "/de/about", "/en/tools/clips.html", "/about", "/", "/russia"].map(explicitLang), ["ru", "ru", "de", "en", null, null, null]);
  assert.deepEqual(["/ru/", "/ru", "/de/about", "/en/tools/clips.html", "/about/", "/"].map(barePath), ["/", "/", "/about", "/tools/clips", "/about", "/"]);
  assert.equal(isLocalizable("/", TR), true); assert.equal(isLocalizable("/about", TR), true); assert.equal(isLocalizable("/roundtable", TR), true); assert.equal(isLocalizable("/secret", TR), false);
  assert.equal(canonicalUrl(O, "/ru/about"), O + "/ru/about"); assert.equal(canonicalUrl(O, "/ru"), O + "/ru/"); assert.equal(canonicalUrl(O, "/en/studio.html"), O + "/en/studio"); assert.equal(canonicalUrl(O, "/about"), null);
});
test("hreflang: Russian version lives under /ru, x-default has no language", () => {
  assert.equal(fixAlternate("ru", O + "/about", O), O + "/ru/about"); assert.equal(fixAlternate("ru", O + "/", O), O + "/ru/"); assert.equal(fixAlternate("ru", O + "/ru/about", O), null);
  assert.equal(fixAlternate("x-default", O + "/en/podcast", O), O + "/podcast"); assert.equal(fixAlternate("x-default", O + "/podcast", O), null);
  assert.equal(fixAlternate("de", O + "/de/about", O), null); assert.equal(fixAlternate("ru", "https://other.example/about", O), null);
  const t = alternateTags(O, "/studio");
  for (const l of ["ru", "de", "en"]) assert.ok(t.includes(`hreflang="${l}" href="${O}/${l}/studio"`)); assert.ok(t.includes(`hreflang="x-default" href="${O}/studio"`));
});
test("test entries are hidden from the public agent list, real names stay", () => {
  for (const n of ["test", "Test 2", "111", "audit-fixturexxx", "demo", "asdf", "xxx"]) assert.equal(isTestAgentName(n), true, n);
  for (const n of ["Palantir Hunter", "Grok Bot", "Tester of Bridges", "Agent 111", "Claude"]) assert.equal(isTestAgentName(n), false, n);
});
test("sitemap: Russian pages, round table and localized studios are listed; dates only where a file backs them", () => {
  const sm = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  for (const u of ["/ru/about", "/ru/podcast", "/roundtable", "/de/studio", "/en/studio", "/ru/studio", "/ru/roundtable"]) assert.ok(sm.includes("<loc>" + O + u + "</loc>"), u);
  assert.ok(!sm.includes(O + "/radio<"), "the test radio is noindex and stays out");
  const urls = sm.match(/<url>.*?<\/url>/gs); assert.equal(new Set(urls.map((x) => /<loc>([^<]+)/.exec(x)[1])).size, urls.length, "no duplicates");
  for (const d of sm.match(/<lastmod>[^<]+/g)) assert.match(d, /^<lastmod>20\d\d-\d\d-\d\d$/);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /\(studio\|roundtable\|radio\|tools\\\/inbox\)/); assert.match(w, /try \{ asset = seoRewrite\(asset, url, studioLang\); \} catch/);
});

import { PAGE_META, pageMeta, ogTags } from "../src/seo.js";
import { SENS_W } from "../src/sensors_i18n.js";
import { assembleDuo } from "../src/duo.js";
test("studio, round table and radio have a title and description in three languages", () => {
  for (const pg of ["studio", "roundtable", "radio"]) for (const l of ["ru", "de", "en"]) { const m = pageMeta("/" + pg, l); assert.ok(m.title.includes("Orb Studio") && m.desc.length > 60, pg + l); }
  assert.equal(pageMeta("/studio", "ru").title, "Студия на двоих · Orb Studio"); assert.equal(pageMeta("/roundtable", "de").title, "KI-Runder Tisch · Orb Studio");
  assert.equal(pageMeta("/studio", "tr"), PAGE_META.studio.en, "no translation: English"); assert.equal(pageMeta("/about", "ru"), null);
  const og = ogTags({ title: 'A "quoted" <title>', desc: "D & E" }, "https://orbstudio.org/ru/studio");
  assert.ok(og.includes('og:title" content="A &quot;quoted&quot; &lt;title>"') && og.includes('content="D &amp; E"') && og.includes('og:url" content="https://orbstudio.org/ru/studio"')); assert.equal(ogTags(null, "x"), "");
});
test("sensors text block: same keys in three languages, no Russian in German and English", () => {
  const keys = Object.keys(SENS_W.ru).sort();
  for (const l of ["de", "en"]) { assert.deepEqual(Object.keys(SENS_W[l]).sort(), keys);
    const all = Object.values(SENS_W[l]).map((v) => (typeof v === "function" ? v(1, 2, 3, 4) : v)).join(" "); assert.ok(!/[Ѐ-ӿ]/.test(all), l + " has Cyrillic"); }
  assert.equal(SENS_W.en.chipRoads(6, 18, 2, 40), "jams 6 (up to 18 min) · closures 2 · roadworks 40"); assert.equal(SENS_W.de.topics(7, 55), "7 Themen · Mittel 55"); assert.equal(SENS_W.ru.chipRoads(6, 0, 2, 40), "пробок 6 · перекрытий 2 · строек 40");
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /sensorsMachine\(env, ctx, radars, lang\)/); assert.match(w, /violinMachine\(c, lang\)/);
});
test("tariffs and violin pages in German and English carry no Russian text block", () => {
  const num = (t) => (t.replace(/(?<=\d)[  ,](?=\d{3}\b)/g, "").replace(/,/g, ".").match(/\d+(?:\.\d+)?/g) || []).sort();
  const get = (f) => /<p id="machineText">(.*?)<\/p>/s.exec(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"))[1];
  const ru = get("tariffs.html");
  for (const f of ["en/tariffs.html", "de/tariffs.html"]) { const t = get(f); assert.ok(!/[Ѐ-ӿ]/.test(t), f); assert.deepEqual(num(t), num(ru), f + ": the numbers are the same as in the Russian original"); }
  for (const f of ["en/violin.html", "de/violin.html"]) assert.match(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), /d\.about\.en\|\|d\.about\.ru/);
});
test("desk segments carry the publication time with a date", () => {
  const d = assembleDuo([{ headline: "A", source: "s", time: "23:45", published_at: "2026-11-19T22:45:00.000Z", read: "R", facts: [], reply: { ok: true, text: "T" } }, { headline: "B", read: "R", facts: [], reply: { ok: true, text: "T" } }], {});
  assert.equal(d.segments[0].published_at, "2026-11-19T22:45:00.000Z"); assert.equal(d.segments[0].card.published_at, "2026-11-19T22:45:00.000Z"); assert.equal(d.segments[0].time, "23:45"); assert.equal(d.segments[1].published_at, null);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /published_at: Number\.isFinite\(f\[5\]\)/); assert.match(w, /\|\| 0\) >= 1 && cands\.length > 4/);
});
