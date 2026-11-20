import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { interviews, plan, TRACKS, T, episodeDate, fmt, sceneOrder, tickerItems, candleBoxes } from "../public/radio.js";
import { parseCandles } from "../src/radio.js";

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
  assert.match(html, /prefers-reduced-motion/);
  assert.match(html, /<canvas id="holo"/); assert.ok(!/<img[^>]+(logo|mark)/i.test(html), "no company logo files on the page");
  const js = readFileSync(new URL("../public/radio.js", import.meta.url), "utf8");
  assert.match(js, /David · Claude \(Anthropic\)/); assert.match(js, /" · xAI"/); assert.match(js, /getByteFrequencyData/); for (const l of ["ru", "de", "en"]) assert.match(T[l].pics, /Grok/);
  assert.ok(statSync(new URL("../public/media/radio/unit.webp", import.meta.url)).size < 200_000);
  assert.match(html, /go\/kraken\?from=radio/); assert.match(html, /go\/starlink\?from=radio/);
  assert.match(readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"), /new Set\(\["radio", "studio-listen"/);
});

test("scenes: market only with real candles; ticker holds only real headlines", () => {
  assert.deepEqual(sceneOrder(true), ["sky", "market", "david", "earth"]); assert.deepEqual(sceneOrder(false), ["sky", "david", "earth"]);
  assert.deepEqual(tickerItems(duo([seg(0), seg(0), seg(1, { kind: "carousel" }), seg(2, { source: null })])), ["H0 (s0)", "H2"]);
  for (const bad of [null, {}, { status: "preparing" }]) assert.deepEqual(tickerItems(bad), []);
});
test("candles: Kraken rows parsed as given, bad input rejected, boxes stay on screen", () => {
  const rows = Array.from({ length: 60 }, (_, i) => [1795000000 + i * 900, String(60000 + i), String(60050 + i), String(59950 + i), String(60010 + i), "0", "1.2", 5]);
  const d = parseCandles({ error: [], result: { XXBTZEUR: rows, last: 1 } });
  assert.equal(d.candles.length, 48); assert.equal(d.pair, "BTC/EUR"); assert.equal(d.interval_min, 15); assert.equal(d.last_price_eur, 60069); assert.match(d.source, /Kraken/);
  assert.deepEqual(d.candles[47], { t: (1795000000 + 59 * 900) * 1000, o: 60059, h: 60109, l: 60009, c: 60069 });
  for (const bad of [null, {}, { error: ["EGeneral"], result: { X: rows } }, { error: [], result: { X: rows.slice(0, 3) } }, { error: [], result: { X: [["a", "b"]] } }]) assert.equal(parseCandles(bad), null);
  const b = candleBoxes(d.candles, 480, 300);
  assert.equal(b.length, 48); assert.ok(b.every((x) => x.x >= 0 && x.x + x.w <= 480 && x.yh >= 0 && x.yl <= 300 && x.yh <= x.top && x.bot <= x.yl && x.up));
  assert.deepEqual(candleBoxes([], 10, 10), []); assert.deepEqual(candleBoxes(null, 10, 10), []);
});

import { radioCard, RADIO_TRACKS } from "../src/radio.js";
test("agent card: same tracks as the page, interviews only where the guest answered, programme in play order", () => {
  assert.deepEqual(RADIO_TRACKS.map((x) => [x.id, x.title, x.path, x.sec]), TRACKS.map((x) => [x.id, x.title, x.src, x.sec]));
  const d = duo([seg(0, { facts_used: [{ label: "L", value: "1", source: "S" }] }), seg(1, { guest: { status: "withheld", text: "Oil will rise" } }), seg(2, { link: "javascript:alert(1)", audio: { answer: "http://x/a" } })]);
  const c = radioCard(d, "https://orbstudio.org");
  assert.equal(c.status, "ok"); assert.equal(c.stage, "test broadcast"); assert.deepEqual(c.interviews.map((x) => x.headline), ["H0", "H2"]);
  assert.equal(c.interviews[0].guest.answer, "Answer 0"); assert.equal(c.interviews[0].audio.answer, "https://orbstudio.org/a/a0"); assert.equal(c.interviews[0].facts_used.length, 1);
  assert.equal(c.interviews[1].link, null); assert.equal(c.interviews[1].audio.answer, null);
  assert.ok(!JSON.stringify(c).includes("Oil will rise"));
  assert.deepEqual(c.programme.map((x) => x.type), ["music", "interview", "music", "interview", "music"]);
  assert.deepEqual(c.programme[1].play, ["https://orbstudio.org/a/r0", "https://orbstudio.org/a/a0"]);
  assert.ok(c.music.every((m) => /^https:\/\/orbstudio\.org\/media\/radio\//.test(m.audio) && /No third-party/.test(m.rights)));
  for (const bad of [null, {}, { status: "preparing" }]) { const m = radioCard(bad); assert.equal(m.status, "music_only"); assert.deepEqual(m.interviews, []); assert.deepEqual(m.programme.map((x) => x.type), ["music"]); }
});
