import test from "node:test"; import assert from "node:assert/strict";
import { noiseAudit, kahnemanReport } from "../src/kahneman.js";
import { lzSize, novelty, zivReport } from "../src/ziv.js";
import { coxDurations, kmMedian, coxHR, coxReport } from "../src/cox.js";
const G = ["gemini", "grok", "deepseek"];
test("Kahneman: noise audit splits system noise into level and pattern noise", () => {
  const same = noiseAudit([{ scores: { gemini: 5, grok: 5, deepseek: 5 } }, { scores: { gemini: 7, grok: 7, deepseek: 7 } }], G);
  assert.equal(same.system_noise, 0); assert.equal(same.pattern_noise, 0);
  const lvl = noiseAudit([{ scores: { gemini: 6, grok: 4, deepseek: 5 } }, { scores: { gemini: 9, grok: 7, deepseek: 8 } }], G);
  assert.equal(lvl.pattern_noise, 0, "gemini is simply always 1 higher"); assert.equal(lvl.level_by_guest.gemini, 1); assert.equal(lvl.level_by_guest.grok, -1); assert.ok(lvl.system_noise > 0);
  const mix = noiseAudit([{ scores: { gemini: 9, grok: 2, deepseek: 5 } }, { scores: { gemini: 2, grok: 9, deepseek: 5 } }, { scores: { gemini: 5, grok: 5, deepseek: 5 } }], G);
  assert.ok(Math.abs(mix.system_noise ** 2 - (mix.level_noise ** 2 + mix.pattern_noise ** 2)) < 0.2, "system² = level² + pattern²"); assert.ok(mix.pattern_noise > mix.level_noise);
  assert.equal(noiseAudit([{ scores: { gemini: 5, grok: 5 } }], G).system_noise, null, "a topic without all three guests is not audited");
  const now = Date.parse("2026-11-22T15:00:00Z"), ep = (i, a) => ({ generated_at: "2026-11-21T10:00:00Z", topics: [{ headline: "H" + i, answers: Object.fromEntries(G.map((g, k) => [g, { status: "ok", importance: a[k], confidence: 6 }])) }] });
  const r = kahnemanReport([ep(1, [9, 2, 5]), ep(2, [5, 5, 5]), { generated_at: "2026-10-01T00:00:00Z", topics: [] }], G, now);
  assert.equal(r.topics_rated, 2); assert.equal(r.loudest_topics[0].headline, "H1"); assert.equal(r.loudest_topics[0].spread, 7); assert.match(r.how_to_read, /not who is right/);
  assert.equal(kahnemanReport([], G, now).audit.importance.system_noise, null);
});
test("Ziv: repeated headlines are not new, fresh ones are", async () => {
  assert.ok((await lzSize("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa")) < 30);
  const y = ["ECB keeps deposit rate unchanged at 2.5 percent", "Storm hits northern Germany, trains cancelled", "Bitcoin falls below 80000 dollars"];
  const same = await novelty(y, y), fresh = await novelty(y, ["Volcano erupts in Iceland, flights diverted", "New law on rental prices passes Bundestag", "Football: Hamburg wins derby 3-1"]);
  assert.ok(same < 0.25, "same headlines are mostly repeat: " + same); assert.ok(fresh > 0.6, "different headlines are mostly new: " + fresh); assert.equal(await novelty([], y), 1); assert.equal(await novelty(y, []), null);
  const r = await zivReport({ at: "2026-11-21T15:00:00Z", radars: { geo: y, web: y } }, { geo: y, web: ["Volcano erupts in Iceland, flights diverted", "New law on rental prices passes Bundestag"] });
  assert.equal(r.most_repeated, "geo"); assert.equal(r.most_new, "web"); assert.equal((await zivReport(null, { geo: y })).novelty_all, null);
});
test("Cox: censored lifetimes, Kaplan-Meier median and hazard ratio", () => {
  const now = Date.parse("2026-11-22T15:00:00Z"), h = 3600e3;
  const d = coxDurations([{ radar: "a", first_ts: now - 10 * h, last_ts: now - 6 * h }, { radar: "a", first_ts: now - 3 * h, last_ts: now - 10 * 60e3 }], now);
  assert.equal(d[0].e, 1); assert.equal(d[0].t, 4.5); assert.equal(d[1].e, 0, "still on the radar: censored"); assert.equal(d[1].t, 3);
  assert.equal(kmMedian([{ t: 1, e: 1 }, { t: 2, e: 1 }, { t: 3, e: 1 }, { t: 4, e: 0 }]), 2); assert.equal(kmMedian([{ t: 1, e: 0 }, { t: 2, e: 0 }]), null);
  const stories = [...[1, 1.5, 2, 2, 2.5, 3, 7, 1.2].map((x) => ({ radar: "fast", first_ts: now - 20 * h, last_ts: now - 20 * h + x * h })), ...[2.5, 6, 8, 9, 10, 12, 14, 5].map((x) => ({ radar: "slow", first_ts: now - 30 * h, last_ts: now - 30 * h + x * h }))];
  const r = coxReport(stories, ["fast", "slow", "none"], now), fast = r.radars[0], slow = r.radars[1];
  assert.ok(fast.hazard_ratio.hr > 1 && slow.hazard_ratio.hr < 1); assert.equal(fast.verdict, "shorter"); assert.equal(slow.verdict, "longer"); assert.ok(fast.median_hours < slow.median_hours);
  assert.equal(r.radars[2].verdict, "not_enough"); assert.equal(coxHR([{ t: 1, e: 1, radar: "x" }], (x) => x.radar === "x"), null);
  assert.equal(coxHR([...[1, 2, 3].map((t) => ({ t, e: 1, radar: "a" })), ...[10, 11, 12].map((t) => ({ t, e: 1, radar: "b" }))], (x) => x.radar === "a"), null, "complete separation has no finite estimate: no number, not a fake one");
});
import { readFileSync } from "node:fs";
test("three sensors are wired like the others: pages, SEO, Kraken strip, share, cards, discovery, cron, round-table scores", async () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"), rt = await import("../src/roundtable.js");
  assert.match(rt.rtGuestSystem("grok", "Russian"), /"importance":<0-10>,"confidence":<0-10>/);
  const d = rt.rtAssemble([{ i: 0, headline: "H" }], "intro", { gemini: { list: [{ i: 0, text: "x".repeat(40), importance: 7, confidence: "11" }] }, grok: { status: "off" }, deepseek: { list: [{ i: 0, text: "y".repeat(40), importance: "4" }] } }, null, { claude: "c" });
  assert.equal(d.topics[0].answers.gemini.importance, 7); assert.equal(d.topics[0].answers.gemini.confidence, null, "out of range is dropped"); assert.equal(d.topics[0].answers.deepseek.importance, 4);
  assert.match(w, /ctx\.waitUntil\(zivTick\(env, ctx\)/); assert.match(w, /ctx\.waitUntil\(coxTick\(env, ctx\)/);
  for (const id of ["kahneman", "ziv", "cox"]) {
    assert.match(w, new RegExp('p === "/api/v1/' + id + '"')); assert.match(w, new RegExp('name: "get_' + id + '"')); assert.match(w, new RegExp('"tools/' + id + '"'));
    for (const pre of ["", "de/", "en/"]) { const h = readFileSync(new URL("../public/" + pre + "tools/" + id + ".html", import.meta.url), "utf8");
      assert.match(h, new RegExp('fetch\\("/api/v1/' + id + '"')); assert.match(h, /href="\/go\/kraken\?from=/); assert.equal((h.match(/rel="alternate" hreflang=/g) || []).length, 4); assert.match(h, /application\/ld\+json/); assert.match(h, /tools\/scientists">/); assert.match(h, /src="\/share-x\.js"/); }
    for (const p of ["tools.html", "de/tools.html", "en/tools.html", "tools/scientists.html"]) assert.match(readFileSync(new URL("../public/" + p, import.meta.url), "utf8"), new RegExp("<h3>get_" + id + "</h3>"));
    assert.ok(readFileSync(new URL("../public/sitemap.xml", import.meta.url), "utf8").includes("<loc>https://orbstudio.org/en/tools/" + id + "</loc>"));
  }
});
