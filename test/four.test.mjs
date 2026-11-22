import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { duckworthSeries, duckworthReport } from "../src/duckworth.js";
import { trevisanReport } from "../src/trevisan.js";
import { bertsekasReport, tokensOf } from "../src/bertsekas.js";
import { rabinMatch, pageTitles, rabinPick, rabinReport } from "../src/rabin.js";

const D = 864e5, now = Date.parse("2026-11-22T09:00:00Z");
test("Duckworth: a morning value compared with mornings, not with the whole day", () => {
  const pts = []; for (let t = now - 8 * D; t <= now; t += 18e5) { const h = new Date(t).getUTCHours(); pts.push({ ts: t, v: h < 12 ? 40 : 60 }); }
  const s = duckworthSeries(pts, now);
  assert.equal(s.vs_same_time_median_7d, 0); assert.ok(s.vs_average_last_24h < -5); assert.equal(s.verdict, "rhythm_matters");
  assert.equal(duckworthSeries(pts.slice(-50), now).verdict, "collecting"); assert.equal(duckworthReport({}).verdict, "collecting");
});
test("Trevisan: deterministic, enough headlines below the full set for a stable index", () => {
  const hs = []; for (let i = 0; i < 64; i++) hs.push({ title: i % 2 ? "deal agreed " + i : "war clash " + i });
  const R = { AGREE_RE: /deal/, FIGHT_RE: /war/, ODD_RE: /bizarre/ }, a = trevisanReport(hs, R), b = trevisanReport(hs, R);
  assert.deepEqual(a.indices, b.indices); const c = a.indices.find((x) => x.id === "consensus");
  assert.equal(c.value, 50); assert.ok(c.enough_headlines < 64); assert.ok(c.tokens_enough < c.tokens_full);
  assert.equal(trevisanReport([], R).verdict, "no_data");
});
test("Bertsekas: cheap chain is cheaper than the naive one", () => {
  const r = bertsekasReport({ get_hagenauer: 2000, get_agent_indices: 1500, get_leamer: 1800, get_polyak: 900, get_radars: 9000, get_baird: 3000, get_sensors: 8000 });
  const x = r.recipes.find((q) => q.id === "is_index_solid"); assert.equal(x.cheap_tokens, 2000); assert.ok(x.saved_pct > 80);
  assert.equal(tokensOf({ a: "12345678" }), 4); assert.equal(bertsekasReport({}).verdict, "no_data");
});
test("Rabin: title matching, link picking skips redirects, report shares", () => {
  assert.equal(rabinMatch("Russia strikes Kyiv after Trump-Putin meeting", pageTitles('<meta property="og:title" content="Russia strikes Kyiv days after Trump-Putin meeting">')).verdict, "matches");
  assert.equal(rabinMatch("Russia strikes Kyiv after Trump-Putin meeting", pageTitles("<title>Weather</title>")).verdict, "differs");
  const p = rabinPick([{ id: "geo", feed: [["1", "A", "x", 1, "https://news.google.com/x"], ["2", "B", "y", 1, "https://bbc.co.uk/b"]] }], 3); assert.equal(p.length, 1); assert.equal(p[0].link, "https://bbc.co.uk/b");
  const at = new Date(now).toISOString(), checks = [...Array(12)].map((_, i) => ({ at, verdict: i < 10 ? "matches" : "differs", headline: "h" + i }));
  const r = rabinReport(checks, now); assert.equal(r.shares.matches, 83); assert.equal(r.verdict, "some_differ"); assert.equal(rabinReport([], now).verdict, "collecting");
});
test("wiring: routes, MCP, cron, Brier, pages", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  for (const id of ["duckworth", "trevisan", "bertsekas", "rabin"]) { assert.match(w, new RegExp(`p === "/api/v1/${id}"`)); assert.match(w, new RegExp(`name: "get_${id}"`)); assert.match(w, new RegExp(`"tools/${id}"`));
    for (const f of [`tools/${id}.html`, `de/tools/${id}.html`, `en/tools/${id}.html`]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, new RegExp(`/go/kraken\\?from=${id}`)); assert.match(h, /share-x\.js/); } }
  assert.match(w, /ctx\.waitUntil\(rabinTick\(env, ctx\)/); assert.match(w, /honest_confidence_30d: honest/); assert.match(w, /\(p - o\) \* \(p - o\)/);
});
