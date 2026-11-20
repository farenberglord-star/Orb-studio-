import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { interviews, plan, TRACKS, T, episodeDate, fmt } from "../public/radio.js";

const seg = (i, over = {}) => ({ i, kind: "news", headline: "H" + i, source: "s" + i, link: "https://example.org/" + i,
  host: { read: "Read " + i, question: "Grok, q" + i + "?", thanks: "Thanks " + i, transition: "And now to the next." },
  guest: { status: "ok", text: "Answer " + i }, audio: { read: "https://orbstudio.org/a/r" + i, answer: "https://orbstudio.org/a/a" + i }, ...over });
const duo = (segs) => ({ status: "ok", generated_at: "2026-11-20T10:19:23Z", segments: segs });

test("interviews: one per headline, real lines in order, no transitions", () => {
  const iv = interviews(duo([seg(0), seg(1)]), "en");
  assert.equal(iv.length, 2);
  assert.deepEqual(iv[0].lines.map((x) => x.kind), ["read", "question", "answer", "thanks"]);
  assert.deepEqual(iv[0].lines.map((x) => x.who), ["david", "david", "grok", "david"]);
  assert.equal(iv[0].lines[2].text, "Answer 0"); assert.equal(iv[0].lines[2].audio, "https://orbstudio.org/a/a0");
  assert.equal(iv[0].at, "2026-11-20T10:19:23Z"); assert.equal(iv[1].link, "https://example.org/1");
});
test("interviews: silent guest, non-news segments and broken data are left out", () => {
  const iv = interviews(duo([seg(0, { guest: { status: "offline", text: null } }), seg(1, { kind: "carousel" }), seg(2, { guest: { status: "withheld", text: "Oil will rise" } }), seg(3)]), "en");
  assert.deepEqual(iv.map((x) => x.headline), ["H3"]);
  for (const bad of [null, {}, { status: "preparing" }, { status: "ok", segments: [] }]) assert.deepEqual(interviews(bad, "en"), []);
});
test("plan: track, interview, track, interview, track; heard news is not repeated", () => {
  const iv = interviews(duo([seg(0), seg(1), seg(2)]), "en");
  const p = plan(iv, new Set(), 0);
  assert.deepEqual(p.items.map((x) => x.type), ["track", "talk", "track", "talk", "track"]);
  assert.deepEqual(p.items.filter((x) => x.type === "talk").map((x) => x.iv.headline), ["H0", "H1"]);
  assert.deepEqual(p.items.filter((x) => x.type === "track").map((x) => x.track.id), [TRACKS[0].id, TRACKS[1].id, TRACKS[2].id]);
  const p2 = plan(iv, new Set(["H0", "H1"]), p.trackAt);
  assert.deepEqual(p2.items.filter((x) => x.type === "talk").map((x) => x.iv.headline), ["H2"]);
  assert.equal(p2.items[0].track.id, TRACKS[0].id, "tracks keep rotating");
});
test("plan: nothing new or no data means music only", () => {
  const iv = interviews(duo([seg(0)]), "en");
  for (const p of [plan(iv, new Set(["H0"])), plan([], new Set()), plan(null, null)]) { assert.deepEqual(p.items.map((x) => x.type), ["track"]); assert.equal(p.fresh, 0); }
});
test("tracks are our own files; texts, date and page", () => {
  for (const tr of TRACKS) { assert.match(tr.src, /^\/media\/radio\/[a-z0-9-]+\.m4a$/); assert.ok(statSync(new URL("../public" + tr.src, import.meta.url)).size > 100_000); }
  for (const l of ["ru", "de", "en"]) { assert.deepEqual(Object.keys(T[l]).sort(), Object.keys(T.ru).sort()); assert.match(T[l].ai, /Grok \(xAI\)/); assert.match(T[l].by, /Suno/); }
  assert.equal(episodeDate("2026-11-20T10:19:23Z"), "20.11.26"); assert.equal(episodeDate(null), ""); assert.equal(fmt(267), "4:27");
  const html = readFileSync(new URL("../public/radio.html", import.meta.url), "utf8");
  assert.ok(!/<script[^>]+src="https?:/.test(html), "no external scripts"); assert.match(html, /name="robots" content="noindex"/);
  assert.match(html, /\.air\{left:15\.93%;top:8\.85%;width:69\.07%;height:31\.77%/); assert.match(html, /\.deck\{left:18\.7%;top:64\.38%;width:63\.33%;height:19\.48%/);
  assert.ok(statSync(new URL("../public/media/radio/unit.webp", import.meta.url)).size < 200_000);
  assert.match(html, /go\/kraken\?from=radio/); assert.match(html, /go\/starlink\?from=radio/);
  assert.match(readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"), /new Set\(\["radio", "studio-listen"/);
});
