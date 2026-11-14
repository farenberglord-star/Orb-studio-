import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseTimecode, fmtTimecode, scorePrediction, publicClip } from "../src/clips.js";

test("parseTimecode", () => {
  assert.equal(parseTimecode("16:23"), 983);
  assert.equal(parseTimecode("1:02:03"), 3723);
  assert.equal(parseTimecode(983), 983);
  assert.equal(parseTimecode("983"), 983);
  assert.equal(parseTimecode("16:75"), null);
  assert.equal(parseTimecode("abc"), null);
  assert.equal(parseTimecode(-5), null);
});

test("fmtTimecode", () => {
  assert.equal(fmtTimecode(1600), "26:40");
  assert.equal(fmtTimecode(3723), "1:02:03");
});

test("scorePrediction", () => {
  assert.deepEqual(scorePrediction(985, 983), { delta_s: 2, verdict: "hit" });
  assert.deepEqual(scorePrediction(975, 983), { delta_s: -8, verdict: "close" });
  assert.equal(scorePrediction(1000, 983).verdict, "miss");
});

test("clips.json is valid and answers stay hidden", () => {
  const d = JSON.parse(readFileSync(new URL("../public/data/clips.json", import.meta.url), "utf8"));
  assert.ok(d.rules.length >= 5);
  const ids = new Set();
  for (const c of d.clips) {
    assert.match(c.id, /^ER-\d{3}$/);
    assert.ok(!ids.has(c.id)); ids.add(c.id);
    assert.ok(c.start_s < c.emotional_timecode_s && c.emotional_timecode_s <= c.end_s, c.id + " answer inside window");
    const hidden = publicClip(c, false);
    assert.equal(typeof hidden.answer, "string");
    assert.ok(!JSON.stringify(hidden).includes('"emotional_timecode_s"'));
    assert.equal(publicClip(c, true).answer.emotional_timecode_s, c.emotional_timecode_s);
  }
});

import { normalizeSegments, findCandidates } from "../src/clips.js";
// Тайминги — настоящие (Supadata, мс) вокруг клипа ER-002; текст заменён на свой (чужую расшифровку не храним).
const ER002 = [
  { offset: 924919, duration: 21719, text: "Есть ли что-то, что ты доверил агентам на 100%? Да, проверка фактов" },
  { offset: 944480, duration: 19159, text: "доверяю одному агенту, а не пятидесяти" },
  { offset: 961279, duration: 16721, text: "обычный чат. Сейчас скажу кое-что спорное" },
  { offset: 976360, duration: 6479, text: "мы перегибаем с агентами" },
  { offset: 985000, duration: 19319, text: "объяснение про олимпиаду" },
  { offset: 1001720, duration: 20799, text: "дальше" },
];
test("candidates: ER-002 found by pause rule near the human answer", () => {
  const r = findCandidates(normalizeSegments(ER002));
  const top = r.candidates[0];
  assert.ok(Math.abs(top.timecode_s - 983) <= 3, "top candidate " + top.timecode + " should be within ±3 s of 16:23");
  assert.ok(top.rules.includes("pause"));
});
test("candidates: no pause → no candidate (ER-001 was visual-only)", () => {
  const r = findCandidates(normalizeSegments([{ offset: 1575679, duration: 18841, text: "a" }, { offset: 1592679, duration: 19521, text: "b" }, { offset: 1609320, duration: 20000, text: "c" }]));
  assert.equal(r.candidates.length, 0);
});
test("normalizeSegments accepts seconds", () => {
  const s = normalizeSegments([{ start: 10, duration: 2, text: "x" }, { start: 5, text: "y" }]);
  assert.equal(s[0].s, 5); assert.equal(s[0].d, 5); assert.equal(s[1].d, 2);
});
