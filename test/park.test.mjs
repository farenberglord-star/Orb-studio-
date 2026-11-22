import test from "node:test"; import assert from "node:assert/strict"; import { readFileSync, existsSync } from "node:fs";
import { checkPark, parkReport, parkUser, PARK, PARK_SIGNS, PARK_VISIBLE, PARK_TOOL } from "../src/park.js";
const items = [{ headline: "Doctors hate this ancient remedy that cures arthritis overnight" }, { headline: "Study finds coffee linked to longer life in large cohort" }, { headline: "Self-taught inventor says his engine defies physics" }];
test("Park sensor: only signs visible in the headline, with a quote that really is in the headline", () => {
  const out = { flags: [{ i: 0, signs: ["suppressed", "ancient"], quote: "Doctors hate this ancient remedy" }, { i: 1, signs: ["anecdotal"], quote: "one man's story" }, { i: 2, signs: ["lone_genius", "new_law", "media_first"], quote: "defies physics" }, { i: 9, signs: ["ancient"], quote: "x" }, { i: 0, signs: ["ancient"], quote: "ancient remedy" }] };
  const f = checkPark(out, items);
  assert.deepEqual(f.map((x) => x.i), [0, 2], "an invented quote, a wrong number and a duplicate are dropped");
  assert.deepEqual(f[1].signs, ["new_law"], "signs that cannot be seen from a headline, or that the quote does not state, are never kept");
  assert.equal(checkPark(null, items).length, 0); assert.equal(checkPark({ flags: [{ i: 0, signs: [], quote: "Doctors hate" }] }, items).length, 0);
  assert.equal(PARK_SIGNS.length, 7); assert.deepEqual(PARK_TOOL.input_schema.properties.flags.items.properties.signs.items.enum, PARK_VISIBLE);
  assert.match(parkUser(items), /^0\. Doctors hate/);
});
test("Park sensor: report counts signs, keeps invisible signs as null, says no verdict", () => {
  const now = Date.parse("2026-11-22T13:00:00Z");
  const r = parkReport({ generated_at: "2026-11-22T12:00:00Z", items, flags: [{ i: 0, signs: ["suppressed", "ancient"], quote: "Doctors hate" }] }, now);
  assert.equal(r.headlines_checked, 3); assert.equal(r.headlines_with_signs, 1); assert.equal(r.by_sign.suppressed, 1); assert.equal(r.by_sign.new_law, 0);
  assert.equal(r.by_sign.media_first, null); assert.equal(r.by_sign.limit_of_detection, null); assert.equal(r.stale, false); assert.match(r.how_to_read, /not a verdict/);
  assert.equal(parkReport(null, now).headlines_checked, 0);
  assert.equal(parkReport({ generated_at: "2026-11-21T00:00:00Z", items, flags: [] }, now).stale, true);
  assert.match(PARK.note, /not connected/); assert.match(PARK.years, /1931–2020/);
});
test("Park sensor: pages, wiring, discovery", () => {
  for (const p of ["tools/park.html", "de/tools/park.html", "en/tools/park.html"]) { const h = readFileSync(new URL("../public/" + p, import.meta.url), "utf8");
    assert.match(h, /fetch\("\/api\/v1\/park"/); assert.match(h, /class="pstrip"/); assert.match(h, /tools\/scientists">/); assert.equal((h.match(/rel="alternate" hreflang=/g) || []).length, 4); }
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/park"/); assert.match(w, /name: "get_park"/); assert.match(w, /ctx\.waitUntil\(parkWarm\(env, ctx\)/); assert.match(w, /"tools\/polyak", "tools\/park", "tools\/scientists"/);
  assert.match(w, /flags: checkPark\(out, list\)/, "only checked flags are stored");
  const sm = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8"); for (const pre of ["", "/de", "/en"]) assert.ok(sm.includes("<loc>https://orbstudio.org" + pre + "/tools/park</loc>"));
  assert.match(readFileSync(new URL("../public/tools/scientists.html", import.meta.url), "utf8"), /<h3>get_park<\/h3>/);
});

test("Park sensor: a failed check leaves its reason and retries once with fewer headlines", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /fail\("no_headlines", 0\)/); assert.match(w, /fail\("claude_no_answer", items\.length\)/); assert.match(w, /list = items\.slice\(0, 20\)/); assert.match(w, /r\.last_failure = f/);
});

test("Park sensor: real false flags of 22.11.2026 are dropped, clear signs stay", async () => {
  const { checkPark, parkReport, parkWordOk } = await import("../src/park.js");
  const real = [{ headline: "Ein unsichtbarer Begleiter: Forscher finden Himmelskörper, den es nicht geben dürfte" }, { headline: "Kartoffeln auf dem Mond: Wurm-Kompost bringt Durchbruch" },
    { headline: "Länger Leben: Forscher entdecken entscheidendes Kälte-Molekül" }, { headline: "Forscher entdecken mit Robotern eine Lösung" }];
  const bad = { flags: [{ i: 0, signs: ["new_law"], quote: "Himmelskörper, den es nicht geben dürfte" }, { i: 1, signs: ["anecdotal"], quote: "Wurm-Kompost bringt Durchbruch" }, { i: 2, signs: ["new_law"], quote: "Kälte-Molekül" }, { i: 3, signs: ["lone_genius"], quote: "Forscher entdecken mit Robotern eine Lösung" }] };
  assert.equal(checkPark(bad, real).length, 0, "ordinary science news is never flagged");
  assert.equal(parkReport({ generated_at: "2026-11-22T13:25:09Z", items: real, flags: bad.flags }).headlines_with_signs, 0, "flags stored before the filter are filtered on reading too");
  for (const [s, q] of [["ancient", "Ancient remedy"], ["suppressed", "doctors don't want you to know"], ["new_law", "engine defies physics"], ["lone_genius", "Self-taught inventor"], ["suppressed", "Pharma vertuscht"], ["new_law", "Perpetuum mobile"], ["ancient", "uraltes Hausmittel"]]) assert.ok(parkWordOk(s, q), s + ": " + q);
  for (const [s, q] of [["new_law", "Durchbruch"], ["lone_genius", "Forscher entdecken"], ["anecdotal", "Studie zeigt"]]) assert.ok(!parkWordOk(s, q), s + ": " + q);
});
