import test from "node:test"; import assert from "node:assert/strict";
import { diagnose } from "../tools/self_diagnosis.mjs";
import { CRYSTALS } from "../src/crystals.js";
import { CRYSTAL_BRIDGES } from "../src/crystal_bridges.js";
import { PASSPORT_TABLE } from "../src/news.js";

const r = diagnose(Date.parse("2026-11-26T08:00:00Z"));

test("structure: no hard wiring faults (cards, bridges, sensors, passport lines all point to real things)", () => {
  assert.deepEqual(r.hard, [], JSON.stringify(r.hard, null, 1));
});
test("structure: all 8 zones have cards and at least one bridge", () => {
  for (const z of Object.keys(r.zones)) { assert.ok(r.zones[z] > 0, z + " has no cards"); assert.ok(r.bridges_per_zone[z] > 0, z + " has no bridges"); }
});
test("structure example: the similarity bridge ties real cards of the look_alike zone together", () => {
  const b = CRYSTAL_BRIDGES.find((x) => x.id === "same_story_measures"); assert.ok(b);
  const zones = new Set(b.cards.map((k) => (CRYSTALS.find((c) => c.id === k) || {}).zone));
  assert.deepEqual([...zones], ["look_alike"]);
});
test("structure example: every live passport line names a sensor tool and a crystal, so a reader can walk line → sensor → scientist", () => {
  for (const t of PASSPORT_TABLE.filter((x) => x.status === "live" && x.sensor && x.line !== "data_gaps")) {
    assert.ok(t.sensor.tool, t.line); assert.ok((t.crystals || []).length, t.line);
  }
});
test("structure example: a card whose idea is not yet a number says what is missing (needs note is not empty)", () => {
  const empty = CRYSTALS.filter((c) => c.needs && c.needs.code !== "covered" && !String(c.needs.note || "").trim());
  assert.ok(empty.length <= 5, "cards without a note on what is missing: " + empty.slice(0, 8).map((c) => c.id).join(", "));
});
test("structure: soft findings are reported, not failed (they are questions for the owner)", () => {
  assert.ok(Array.isArray(r.soft));
  if (process.env.SHOW_SOFT) console.log(r.soft);
});

import { readFileSync } from "node:fs";
test("structure ratchet: a working bridge (sensor / line / covered) without `number` must be on the old list; new ones need a number", () => {
  const old = new Set(readFileSync(new URL("../docs/bridges-without-number.txt", import.meta.url), "utf8").split("\n").filter(Boolean));
  const fresh = r.no_number.filter((id) => !old.has(id));
  assert.deepEqual(fresh, [], "add `number: \"what, from where, how often\"` to: " + fresh.join(", "));
});
