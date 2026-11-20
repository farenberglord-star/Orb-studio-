import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import { buildQueue, boardFor, lineMs, safeLink, pickLang, krakenCells, ZONES, T } from "../public/studio-duo.js";
import { assembleDuo } from "../src/duo.js";

const seg = (over = {}) => ({
  headline: "H", source: "bbc.co.uk", link: "https://example.org/a",
  host: { read: "David reads the headline.", question: "Grok, how do you read this?", thanks: "Thanks, Grok." },
  guest: { status: "ok", text: "Here's the thing: the data show no link yet." }, ...over,
});

test("order of lines: read → question → answer → thanks → pause", () => {
  const q = buildQueue({ status: "ok", segments: [seg(), seg()] });
  assert.deepEqual(q.map((x) => x.kind), ["read", "question", "answer", "thanks", "pause", "read", "question", "answer", "thanks", "pause"]);
  assert.deepEqual(q.slice(0, 4).map((x) => x.who), ["david", "david", "grok", "david"]);
  assert.equal(q[2].text, "Here's the thing: the data show no link yet.");
  assert.equal(q[0].source, "bbc.co.uk"); assert.equal(q[0].link, "https://example.org/a");
  assert.equal(q[0].seg, 0); assert.equal(q[5].seg, 1);
});

test("guest offline: label instead of words, no thanks", () => {
  const q = buildQueue({ status: "ok", segments: [seg({ guest: { status: "offline", reason: "no_answer", text: null } })] });
  assert.deepEqual(q.map((x) => x.kind), ["read", "question", "label", "pause"]);
  assert.equal(q[2].label, "guestOff"); assert.equal(q[2].text, null);
  assert.ok(!q.some((x) => x.kind === "thanks" || x.kind === "answer"));
});

test("withheld answer is never shown, even if text is present", () => {
  const q = buildQueue({ status: "ok", segments: [seg({ guest: { status: "withheld", reason: "forecast_language", text: "Oil will rise." } })] });
  assert.equal(q[2].kind, "label"); assert.equal(q[2].label, "withheld");
  assert.ok(!JSON.stringify(q).includes("Oil will rise"));
});

test("empty / offline API: board, no invented lines", () => {
  for (const [d, b] of [[null, "noLink"], [undefined, "noLink"], ["<html>", "noLink"], [{}, "noLink"], [{ status: "preparing" }, "preparing"],
    [{ status: "grok_not_configured", segments: [] }, "guestOff"], [{ status: "no_headlines", segments: [] }, "noNews"], [{ status: "ok", segments: [] }, "noNews"]]) {
    assert.equal(boardFor(d), b); assert.deepEqual(buildQueue(d), []);
  }
  assert.equal(boardFor({ status: "ok", segments: [seg()] }), null);
});

test("real assembleDuo output without a Grok key gives the guest-off board", () => {
  const d = assembleDuo([], { grokConfigured: false });
  assert.equal(boardFor(d), "guestOff"); assert.deepEqual(buildQueue(d), []);
});

test("real assembleDuo output plays in order; missing reply becomes a label", () => {
  const d = assembleDuo([
    { headline: "A", source: "s", link: "https://a.example/x", read: "Read A", facts: [], reply: { ok: true, text: "Answer A" } },
    { headline: "B", source: "s", link: "https://b.example/x", read: "Read B", facts: [], reply: null },
  ], {});
  const q = buildQueue(d);
  assert.deepEqual(q.map((x) => x.kind), ["read", "question", "answer", "thanks", "pause", "read", "question", "label", "pause"]);
  assert.equal(q[2].text, "Answer A");
});

test("show time follows text length, within bounds", () => {
  assert.equal(lineMs(""), 2500); assert.equal(lineMs("x".repeat(5000)), 18000);
  assert.ok(lineMs("x".repeat(200)) > lineMs("x".repeat(80)));
  const q = buildQueue({ status: "ok", segments: [seg()] });
  assert.equal(q.at(-1).ms, 1500); assert.ok(q.every((x) => x.ms >= 1500));
});

test("links: https only; segments without a read line are skipped", () => {
  assert.equal(safeLink("javascript:alert(1)"), null); assert.equal(safeLink("http://a.b"), null); assert.equal(safeLink("https://a.b/c"), "https://a.b/c");
  const q = buildQueue({ status: "ok", segments: [seg({ link: "javascript:alert(1)" }), seg({ host: { read: " " } }), null] });
  assert.equal(q[0].link, null); assert.equal(q.filter((x) => x.kind === "read").length, 1);
});

test("language, zones and page weight", () => {
  assert.equal(pickLang("?lang=de", "ru-RU"), "de"); assert.equal(pickLang("", "ru-RU"), "ru"); assert.equal(pickLang("", "fr"), "en");
  for (const l of ["ru", "de", "en"]) assert.deepEqual(Object.keys(T[l]).sort(), Object.keys(T.ru).sort());
  assert.match(T.ru.credit, /Grok \(xAI\)/); assert.equal(T.ru.guestOff, "Гость не подключён — ответа нет");
  for (const z of Object.values(ZONES)) assert.ok(z.x >= 0 && z.y >= 0 && z.x + z.w <= 100 && z.y + z.h <= 100);
  const html = readFileSync(new URL("../public/studio.html", import.meta.url), "utf8");
  assert.ok(!/https?:\/\/(?!orbstudio\.org)[^"' ]+\.js/.test(html), "no external scripts");
  assert.match(html, /prefers-reduced-motion/);
  assert.ok(statSync(new URL("../public/media/studio-duo.webp", import.meta.url)).size < 150_000);
});

test("banners: referral links, labels and Kraken prices only from the API", () => {
  const html = readFileSync(new URL("../public/studio.html", import.meta.url), "utf8");
  assert.match(html, /href="\/go\/kraken\?from=studio"[^>]*rel="sponsored noopener"/);
  assert.match(html, /href="\/go\/starlink\?from=studio"[^>]*rel="sponsored noopener"/);
  assert.match(html, /src="\/banners\.js"/);
  for (const l of ["ru", "de", "en"]) for (const k of ["partner", "krNote", "slNote"]) assert.ok(T[l][k].length > 10);
  assert.deepEqual(krakenCells(null), []); assert.deepEqual(krakenCells({}), []);
  const c = krakenCells({ XXBTZEUR: { last: 61234.5, change_pct: -1.234 }, XETHZEUR: { last: "x" }, XXRPZEUR: { last: 0.5123, change_pct: 2 } }, "en");
  assert.deepEqual(c.map((x) => x.pair), ["BTC/EUR", "XRP/EUR"]);
  assert.equal(c[0].up, false); assert.equal(c[0].change, "▼1.23%"); assert.equal(c[1].price, "0.5123");
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /"interview", "studio"\]\)/);
});

test("episode date for viewers: DD.MM.YY in Berlin time, empty when unknown", async () => {
  const { episodeDate } = await import("../public/studio-duo.js");
  assert.equal(episodeDate("2026-11-20T10:19:23.247Z"), "20.11.26");
  assert.equal(episodeDate("2026-11-20T23:30:00Z"), "21.11.26", "after midnight in Berlin it is the next day");
  assert.equal(episodeDate("2026-07-01T21:59:00Z"), "01.07.26"); assert.equal(episodeDate(1795169963247), "20.11.26");
  for (const bad of [null, undefined, "", "soon", {}]) assert.equal(episodeDate(bad), "");
  const { readFileSync } = await import("node:fs");
  const html = readFileSync(new URL("../public/studio.html", import.meta.url), "utf8");
  assert.match(html, /<time class="epdate" id="epdate" hidden><\/time>/); assert.match(html, /prefers-reduced-motion:reduce\)\{\.epdate/);
});
