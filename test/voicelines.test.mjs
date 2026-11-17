import test from "node:test";
import assert from "node:assert/strict";
import { asLines } from "../src/voicelines.js";
test("asLines: массив, строка JSON, объект, мусор", () => {
  const a = [{ i: 0, ru: "а" }, { i: 1, ru: "б" }];
  assert.deepEqual(asLines(a), a);
  assert.deepEqual(asLines(JSON.stringify(a)), a);
  assert.deepEqual(asLines({ 0: a[0], 1: a[1] }), a);
  assert.deepEqual(asLines("не json"), []);
  assert.deepEqual(asLines(undefined), []);
  assert.deepEqual(asLines([null, 5, a[0]]), [a[0]]);
});
