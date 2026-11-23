import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { extractNames, personLike, namesakes, fregeReport } from "../src/frege.js";

test("names from headlines, without leading titles", () => {
  assert.deepEqual(extractNames("President Donald Trump meets Friedrich Merz in Berlin"), ["Donald Trump", "Friedrich Merz"]);
  assert.deepEqual(extractNames("Kanzler Friedrich Merz trifft Ursula von der Leyen"), ["Friedrich Merz", "Ursula von der Leyen"]);
  assert.ok(extractNames("Bank collapse in Cyprus").length === 0);
  assert.deepEqual(extractNames("Bitcoin ETF Exodus Gathers Pace, Removing Key Source of Support"), []);
  assert.deepEqual(extractNames("Cathie Wood's ARK Invest pulls the plug on two planned crypto ETFs"), ["Cathie Wood"]);
});
test("person-like descriptions and namesakes", () => {
  assert.ok(personLike("German politician (born 1955)")); assert.ok(!personLike("city in Germany"));
  const r = namesakes("John Smith", [{ id: "Q1", label: "John Smith", description: "English explorer (1580–1631)" }, { id: "Q2", label: "John Smith", description: "British politician" }, { id: "Q3", label: "John Smith", description: "disambiguation page" }, { id: "Q4", label: "John Smithson", description: "actor" }]);
  assert.equal(r.people, 2);
});
test("report verdicts", () => {
  const checked = []; for (let i = 0; i < 25; i++) checked.push({ name: "N" + i, people: i < 10 ? 3 : 1, examples: [] });
  const r = fregeReport(checked); assert.equal(r.verdict, "many_namesakes"); assert.equal(r.ambiguous, 10); assert.equal(fregeReport(checked.slice(0, 5)).verdict, "collecting");
  assert.match(r.rule, /several people/);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/frege"/); assert.match(w, /name: "get_frege"/); assert.match(w, /"tools\/frege"/); assert.match(w, /wbsearchentities/);
  for (const f of ["tools/frege.html", "de/tools/frege.html", "en/tools/frege.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=frege/); assert.match(h, /share-x\.js/); assert.match(h, /Gottlob_Frege/); }
});
