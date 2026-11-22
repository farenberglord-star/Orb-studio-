import test from "node:test"; import assert from "node:assert/strict"; import { readFileSync, existsSync } from "node:fs";
import { mikrinReport, MIKRIN, MIKRIN_BLOCKS } from "../src/mikrin.js";
import { radarCandidates, regionCandidates } from "../src/radio.js";
const now = Date.parse("2026-11-22T12:00:00Z"), m = 60e3, iso = (x) => new Date(x).toISOString();
test("Mikrin sensor: minutes from source to text and from text to voice, per block", () => {
  const r = mikrinReport({ now, air: "de", blocks: {
    radar_news: { written_at: iso(now - 60 * m), voiced_at: iso(now - 50 * m), items: [{ published_at: iso(now - 180 * m) }, { published_at: iso(now - 100 * m) }, { published_at: null }] },
    regional: { written_at: iso(now - 30 * m), voiced_at: null, items: [{ published_at: iso(now - 90 * m) }] } } });
  assert.deepEqual(r.blocks.map((b) => b.id), MIKRIN_BLOCKS);
  const rad = r.blocks[0]; assert.equal(rad.items, 3); assert.equal(rad.items_with_source_time, 2); assert.equal(rad.steps[0].minutes_median, 80); assert.equal(rad.steps[0].minutes_min, 40); assert.equal(rad.steps[0].minutes_max, 120);
  assert.equal(rad.steps[1].minutes, 10); assert.equal(rad.newest_news_age_minutes, 100);
  assert.equal(r.blocks[1].steps[1].minutes, null, "no voice yet is no measurement, not zero"); assert.equal(r.shortest_path, "regional");
  assert.equal(r.blocks[2].items, 0); assert.equal(r.blocks[2].steps[0].minutes_median, null);
  assert.equal(mikrinReport({ now, blocks: { studio: { written_at: iso(now), items: [{ published_at: iso(now + 3600e3) }] } } }).blocks[2].items_with_source_time, 0, "a publication time after the text is ignored");
});
test("source publication time is carried from the radar feed into radar news and regional interviews", () => {
  const pub = now - 2 * 3600e3, radars = [{ id: "economy", title: "Wirtschaft", feed: [["10:00", "Bundesbank meldet neue Zahlen zur Inflation in Deutschland", "dw.com", 9, "https://dw.com/x", pub]] }];
  assert.equal(radarCandidates(radars)[0].published_at, iso(pub));
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"), s = readFileSync(new URL("../src/radio.js", import.meta.url), "utf8");
  assert.match(s, /link: c\.link, published_at: c\.published_at \|\| null, text \}/); assert.match(w, /time: c\.time, published_at: c\.published_at \|\| null, radar: c\.radar/);
  assert.match(s, /time: f\[0\] \|\| null, published_at:/, "regional candidates carry it too");
});
test("Mikrin sensor: honour, pages in three languages with SEO, partner strip, share button, wired into the worker", () => {
  assert.match(MIKRIN.note, /not connected/); assert.match(MIKRIN.wiki.ru, /^https:\/\/ru\.wikipedia\.org\/wiki\//);
  for (const p of ["tools/mikrin.html", "de/tools/mikrin.html", "en/tools/mikrin.html", "tools/hamilton.html", "de/tools/hamilton.html", "en/tools/hamilton.html"]) {
    const u = new URL("../public/" + p, import.meta.url); assert.ok(existsSync(u), p); const h = readFileSync(u, "utf8");
    assert.match(h, /<link rel="canonical" href="https:\/\/orbstudio\.org\/(?:(?:de|en)\/)?tools\/(mikrin|hamilton)">/, p); assert.equal((h.match(/rel="alternate" hreflang=/g) || []).length, 4, p + " hreflang");
    const ld = JSON.parse(/<script type="application\/ld\+json">([^<]+)<\/script>/.exec(h)[1]); assert.equal(ld["@type"], "WebPage"); assert.equal(ld.about["@type"], "Person"); assert.equal(ld.mainEntity.isAccessibleForFree, true);
    assert.match(h, /class="pstrip"/); assert.match(h, /href="\/go\/kraken\?from=(mikrin|hamilton)" target="_blank" rel="sponsored noopener"/); assert.match(h, /src="\/share-x\.js"/); assert.ok(!/<img/.test(h)); }
  const sm = readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8"); for (const sid of ["hamilton", "mikrin"]) for (const pre of ["", "/de", "/en"]) assert.ok(sm.includes("<loc>https://orbstudio.org" + pre + "/tools/" + sid + "</loc>"), pre + sid);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"); assert.match(w, /p === "\/api\/v1\/mikrin"/); assert.match(w, /name: "get_mikrin"/); assert.match(w, /"tools\/hamilton", "tools\/mikrin"/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /\[Mikrin sensor\]\(https:\/\/orbstudio\.org\/api\/v1\/mikrin\)/);
});
