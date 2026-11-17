import test from "node:test"; import assert from "node:assert/strict";
import { weeks, gdeltUrl, wikiUrl, gdeltPoints, gdeltRow, wikiRow, buildNoise, GDELT_TOPICS, GDELT_SCOPES, WIKI_ARTICLES } from "../src/safeworld.js";
const W = weeks(Date.parse("2026-11-17T07:10:00Z"));
const days = (a, b, f) => { const o = []; for (let d = Date.parse(a); d <= Date.parse(b); d += 864e5) o.push(f(new Date(d).toISOString().slice(0, 10).replace(/-/g, ""))); return o; };
test("two full weeks ending yesterday (UTC)", () => {
  assert.deepEqual([W.prev[0], W.prev[6], W.week[0], W.week[6]], ["20261103", "20261109", "20261110", "20261116"]);
  assert.equal(W.start, "20261103000000"); assert.equal(W.end, "20261117000000");
});
test("urls", () => {
  const u = gdeltUrl(GDELT_TOPICS[1], GDELT_SCOPES[0], "TimelineVolRaw", W);
  assert.match(u, /query=%22human%20trafficking%22%20sourcecountry%3AGM&mode=TimelineVolRaw&format=json&startdatetime=20261103000000&enddatetime=20261117000000$/);
  assert.match(wikiUrl(WIKI_ARTICLES[4], W), /ru\.wikipedia\/all-access\/user\/%D0%A2.+\/daily\/2026110300\/2026111600$/);
});
test("empty or broken GDELT answer is no data, not zero", () => {
  for (const j of [{}, null, "Please limit requests", { timeline: [] }, { timeline: [{ data: [] }] }]) assert.equal(gdeltPoints(j), null);
  const r = gdeltRow(GDELT_TOPICS[0], GDELT_SCOPES[0], {}, {}, W);
  assert.equal(r.articles, null); assert.equal(r.prev_articles, null); assert.equal(r.tone, null);
});
test("sub-day GDELT bins are summed per week; tone is the mean", () => {
  const vol = { timeline: [{ series: "Article Count", data: [
    ...days("2026-11-03", "2026-11-09", (d) => ({ date: d + "T000000Z", value: 2 })),
    ...days("2026-11-10", "2026-11-16", (d) => ({ date: d + "T000000Z", value: 3 })), ...days("2026-11-10", "2026-11-16", (d) => ({ date: d + "T120000Z", value: 1 })),
    { date: "20261117T000000Z", value: 99 }] }] };
  const tone = { timeline: [{ series: "Average Tone", data: [{ date: "20261110T000000Z", value: -4 }, { date: "20261111T000000Z", value: -2 }, { date: "20261105T000000Z", value: 9 }] }] };
  const r = gdeltRow(GDELT_TOPICS[0], GDELT_SCOPES[1], vol, tone, W);
  assert.deepEqual([r.articles, r.prev_articles, r.tone, r.country], [28, 14, -3, null]);
});
test("wikipedia week sums; missing article is null", () => {
  const items = days("2026-11-03", "2026-11-16", (d) => ({ timestamp: d + "00", views: d >= "20261110" ? 10 : 5 }));
  const r = wikiRow(WIKI_ARTICLES[0], { items }, W);
  assert.deepEqual([r.views, r.prev_views, r.article], [70, 35, "Menschenhandel"]);
  assert.equal(wikiRow(WIKI_ARTICLES[2], { type: "not_found" }, W).views, null);
});
test("totals and ok flag", () => {
  const g = [{ topic: "a", country: "DE", articles: 5, prev_articles: 4 }, { topic: "a", country: null, articles: 50, prev_articles: 40 }, { topic: "b", country: null, articles: null, prev_articles: null }];
  const w = [{ views: 100, prev_views: 90 }, { views: null, prev_views: null }];
  const n = buildNoise(g, w, W, Date.parse("2026-11-17T07:10:00Z"));
  assert.equal(n.ok, true); assert.deepEqual(n.totals, { articles_world: 50, prev_articles_world: 40, wiki_views: 100, prev_wiki_views: 90 });
  assert.deepEqual(n.week, { from: "2026-11-10", to: "2026-11-16" });
  const e = buildNoise([{ country: null, articles: null }], [{ views: null }], W);
  assert.equal(e.ok, false); assert.equal(e.totals.articles_world, null); assert.equal(e.totals.wiki_views, null);
});
