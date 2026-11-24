import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { leamerReport, leamerSpecs, leamerBounds } from "../src/leamer.js";

const AGREE_RE = /\b(agree\w*|deal|ceasefire)\b/i, FIGHT_RE = /\b(clash\w*|war|attack\w*)\b/i, ODD_RE = /\b(bizarre|robot)\b/i;
const RES = { AGREE_RE, FIGHT_RE, ODD_RE };
const heads = [
  { radar: "geo", title: "Ceasefire deal agreed in the north", rank: 0 }, { radar: "geo", title: "Leaders agree on talks", rank: 1 },
  { radar: "geo", title: "War clashes continue despite deal", rank: 2 }, { radar: "econ", title: "Markets calm", rank: 0 },
  { radar: "econ", title: "Trade war fears", rank: 1 }, { radar: "ai", title: "Bizarre robot opens a shop", rank: 0 }];

test("base equals the published formulas", () => {
  const s = leamerSpecs(heads, RES, 1);
  assert.equal(s.base.consensus, Math.round(100 * 3 / 5)); // 3 agree (one mixed), 2 fight (one mixed)
  assert.equal(s.base.hallucination, Math.round(8 + 1 / 6 * 250 + 4));
});
test("specifications cover radars, words and mixed headlines", () => {
  const s = leamerSpecs(heads, RES, 0), k = s.specs.consensus.map((x) => x.kind + ":" + x.id);
  for (const e of ["without_radar:geo", "without_radar:econ", "without_word:deal", "without_word:war", "mixed_as_conflict:fight", "mixed_left_out:none", "top_headlines_only:4"]) assert.ok(k.includes(e), e);
  const noGeo = s.specs.consensus.find((x) => x.id === "geo"); assert.equal(noGeo.value, 0); // без гео — только «trade war»
});
test("bounds and verdict", () => {
  const b = leamerBounds(50, [{ kind: "a", id: "x", value: 45 }, { kind: "b", id: "y", value: 58 }]);
  assert.equal(b.low, 45); assert.equal(b.high, 58); assert.equal(b.verdict, "sensitive"); assert.equal(b.drivers[0].id, "y");
  assert.equal(leamerBounds(50, [{ value: 52 }]).verdict, "robust");
  const r = leamerReport(heads, RES, 0); assert.equal(r.indices.length, 2); assert.equal(r.verdict, "fragile");
  assert.equal(leamerReport([], RES, 0).verdict, "no_data");
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/leamer"/); assert.match(w, /name: "get_leamer"/); assert.match(w, /name === "get_leamer"/); assert.match(w, /"tools\/leamer"/); assert.match(w, /"howard", "leamer"/);
  for (const f of ["tools/leamer.html", "de/tools/leamer.html", "en/tools/leamer.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=leamer/); assert.match(h, /\/go\/starlink\?from=leamer/); assert.match(h, /share-x\.js/); assert.match(h, /Edward_E\._Leamer/); }
  for (const f of ["sitemap.xml", "llms.txt", ".well-known/agent.json", "share-x.js", "tools.html", "de/tools.html", "en/tools.html"]) assert.match(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), /leamer/);
});

test("Codd: no agree/conflict words is no data, not 0 (NULL ≠ 0)", () => {
  assert.equal(leamerBounds(null, [{ value: null }]).verdict, "no_data");
  const b = leamerBounds(60, [{ value: null }, { value: 55 }]);
  assert.equal(b.low, 55); assert.equal(b.specifications, 2);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /consNone \? null :/);
});
