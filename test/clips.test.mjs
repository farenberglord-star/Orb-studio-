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
