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
