import test from "node:test"; import assert from "node:assert/strict";
import { reduceDawum, summarizePolls } from "../src/polls.js";
const raw = { Database: { Last_Update: "2026-11-09T12:00:00+01:00" }, Parliaments: { 0: { Shortcut: "Bundestag" }, 1: { Shortcut: "Bayern" } },
  Institutes: { 1: { Name: "INSA" }, 2: { Name: "Forsa" }, 3: { Name: "Old" } }, Parties: { 1: { Shortcut: "CDU/CSU", Name: "Union" }, 2: { Shortcut: "AfD", Name: "AfD" }, 3: { Shortcut: "SPD", Name: "SPD" } },
  Surveys: {
    a: { Parliament_ID: "0", Institute_ID: "1", Date: "2026-11-05", Surveyed_Persons: 1200, Survey_Period: { Date_Start: "2026-11-01", Date_End: "2026-11-04" }, Results: { 1: 26, 2: 26, 3: 14 } },
    b: { Parliament_ID: "0", Institute_ID: "2", Date: "2026-11-03", Results: { 1: 28, 2: 24, 3: 15 } },
    c: { Parliament_ID: "0", Institute_ID: "3", Date: "2026-06-01", Results: { 1: 40, 2: 5, 3: 5 } },
    d: { Parliament_ID: "0", Institute_ID: "1", Date: "2026-10-20", Results: { 1: 99, 2: 0, 3: 1 } },
    e: { Parliament_ID: "1", Institute_ID: "1", Date: "2026-11-01", Results: { 1: 40, 2: 15, 3: 8 } },
    bad: { Parliament_ID: "0", Institute_ID: "1", Date: "yesterday", Results: { 1: 50 } },
    x: { Parliament_ID: "0", Institute_ID: "2", Date: "2026-10-01", Results: { 1: "abc", 2: 120 } } } };
const NOW = Date.parse("2026-11-10T08:00:00Z");
test("reduce keeps valid polls and rejects bad structure", () => {
  const f = reduceDawum(raw); assert.equal(f.surveys.length, 6); assert.equal(reduceDawum({}), null); assert.equal(reduceDawum(null), null);
  assert.deepEqual(f.surveys.find((s) => s.id === "x").results, {});
});
test("latest poll per institute inside the window, simple mean, min, max", () => {
  const s = summarizePolls(reduceDawum(raw), "Bundestag", NOW);
  assert.equal(s.ok, true); assert.equal(s.institutes_used, 2);
  const u = s.parties.find((p) => p.party === "CDU/CSU"); assert.equal(u.mean, 27); assert.equal(u.min, 26); assert.equal(u.max, 28);
  assert.equal(s.parties[0].party, "CDU/CSU"); assert.equal(s.parties.find((p) => p.party === "AfD").mean, 25);
  assert.equal(s.polls[0].institute, "INSA"); assert.equal(s.polls[0].surveyed_persons, 1200);
});
test("parliament lookup is case-insensitive; unknown is a bad request; stale is explicit", () => {
  assert.equal(summarizePolls(reduceDawum(raw), "bayern", NOW).parliament, "Bayern");
  assert.equal(summarizePolls(reduceDawum(raw), "Mars", NOW).bad_request, true);
  const old = summarizePolls(reduceDawum(raw), "Bundestag", Date.parse("2027-03-01"));
  assert.equal(old.ok, false); assert.match(old.reason, /no poll/);
  assert.equal(summarizePolls(null).ok, false);
});
