import { test } from "node:test";
import assert from "node:assert/strict";
import { T, shareText, playable, pickLang } from "../public/roundtable.js";

test("пост в X по-английски и короче 280 знаков вместе со ссылкой", () => {
  const d = { topics: [{ headline: "Citi raises Brent forecast for 2026 and sees 150 dollar oil if the Hormuz disruption persists for months" }, { headline: "Trump, Xi and Putin are all at the Asia summit while Merz walks out of the coalition committee" }] };
  const s = shareText(d);
  assert.ok(s.startsWith("🎙 AI Round Table"));
  assert.ok([...s].length + 1 + 23 + " #OrbStudio #AI".length <= 280);
});
test("гость не подключён — табличка один раз, а не в каждой теме", () => {
  const lines = [{ part: "absent", who: "deepseek", status: "off", topic: 0 }, { part: "answer", who: "grok", text: "x", topic: 0 }, { part: "absent", who: "deepseek", status: "off", topic: 1 }, { part: "absent", who: "grok", status: "withheld", topic: 1 }];
  const out = playable(lines, T.ru);
  assert.equal(out.filter((x) => x.who === "deepseek").length, 1);
  assert.match(out[0].text, /DeepSeek/);
  assert.ok(out.some((x) => x.label && /Grok/.test(x.text)));
});
test("язык: ?lang= главнее, иначе подсказка, иначе английский", () => {
  assert.equal(pickLang("?lang=tr", "de"), "tr");
  assert.equal(pickLang("", "ro-RO"), "ro");
  assert.equal(pickLang("", "fr"), "en");
  for (const l of Object.keys(T)) for (const k of ["listen", "off", "withheld", "done", "krH", "slH", "cmH"]) assert.ok(T[l][k], l + "." + k);
});

test("episode date for viewers: DD.MM.YY in Berlin time, empty when unknown", async () => {
  const { episodeDate } = await import("../public/roundtable.js");
  assert.equal(episodeDate("2026-11-20T10:19:23.247Z"), "20.11.26");
  assert.equal(episodeDate("2026-11-20T23:30:00Z"), "21.11.26", "after midnight in Berlin it is the next day");
  assert.equal(episodeDate("2026-07-01T21:59:00Z"), "01.07.26"); assert.equal(episodeDate(1795169963247), "20.11.26");
  for (const bad of [null, undefined, "", "soon", {}]) assert.equal(episodeDate(bad), "");
  const { readFileSync } = await import("node:fs");
  const html = readFileSync(new URL("../public/roundtable.html", import.meta.url), "utf8");
  assert.match(html, /<time class="epdate" id="epdate" hidden><\/time>/); assert.match(html, /prefers-reduced-motion:reduce\)\{\.epdate/);
});
