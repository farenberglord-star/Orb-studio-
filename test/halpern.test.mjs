import test from "node:test"; import assert from "node:assert/strict";
import { explainIndex, halpernReport } from "../src/halpern.js";
const AG = /\b(deal|agree\w*)\b/i, FI = /\b(war|clash\w*|attack\w*)\b/i;
const cons = { id: "consensus", tag: (t) => (AG.test(t) ? "agree" : FI.test(t) ? "fight" : null), value: (set) => { const a = set.filter((h) => AG.test(h.headline)).length, f = set.filter((h) => FI.test(h.headline)).length; return Math.round(100 * a / Math.max(1, a + f)); } };
const H = (k, headline) => ({ k, headline, source: "s", radar: "geo" });
test("Halpern: the smallest set of headlines that, had it not happened, keeps the index where it was", () => {
  const then = [H(1, "Trade deal signed"), H(2, "Leaders agree on climate"), H(3, "Border clash"), H(4, "Weather nice")];
  const now = [H(1, "Trade deal signed"), H(2, "Leaders agree on climate"), H(3, "Border clash"), H(5, "Missile attack on port"), H(6, "War fears grow"), H(4, "Weather nice")];
  const r = explainIndex(cons, now, then);
  assert.equal(r.value_then, 67); assert.equal(r.value_now, 40); assert.equal(r.verdict, "explained");
  assert.deepEqual(r.causes.map((c) => c.headline).sort(), ["Missile attack on port", "War fears grow"]); assert.ok(r.causes.every((c) => c.role === "entered" && c.kind === "fight"));
  const left = explainIndex(cons, [H(3, "Border clash")], [H(3, "Border clash"), H(1, "Trade deal signed")]);
  assert.equal(left.causes[0].role, "left", "a calming headline that disappeared is a cause too");
  assert.equal(explainIndex(cons, then, then).verdict, "no_shift"); assert.equal(explainIndex(cons, then, then).causes.length, 0);
  assert.ok(r.made_of_now.length >= 4 && r.made_of_now.every((h) => h.kind));
  const c = halpernReport([cons], now, [], {}); assert.equal(c.indices[0].verdict, "collecting"); assert.equal(c.indices[0].value_now, 40); assert.match(c.how_to_read, /smallest set/);
});
