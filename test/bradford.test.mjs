import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { bradfordReport } from "../src/bradford.js";
import { sameStoryAcross, commonAnchors } from "../src/reiss.js";
import { sameStory, commonStems, dropSameStory } from "../src/duo.js";

test("Bradford zones: a few core outlets, a long tail; tail-only stories are found", () => {
  const rows = [];
  for (let i = 0; i < 120; i++) rows.push({ source: "big.com", headline: `Central bank holds rates steady, meeting ${i}`, radar: "economy" });
  for (let i = 0; i < 120; i++) rows.push({ source: `mid${i % 6}.com`, headline: `Central bank holds rates steady, analysts ${i}`, radar: "economy" });
  for (let i = 0; i < 120; i++) rows.push({ source: `https://www.small${i}.org/`, headline: `Village bridge reopens after flood repair number ${i}`, radar: "budget" });
  const r = bradfordReport(rows);
  assert.equal(r.verdict, "core_heavy"); assert.equal(r.zones[0].outlets, 1); assert.ok(r.zones[2].outlets > r.zones[1].outlets);
  assert.ok(r.tail_only_pct >= 90); assert.equal(r.top_outlets[0].outlet, "big.com"); assert.ok(!r.top_outlets.some((o) => /https?:/.test(o.outlet)));
  assert.equal(bradfordReport(rows.slice(0, 50)).verdict, "collecting");
});
test("rare shared word weighs more (Spärck Jones): common anchors count half in Reiss", () => {
  const pool = [...Array(40)].map((_, i) => `Fed official says US inflation still high ${i}`);
  const common = commonAnchors(pool);
  assert.ok(common.has("fed") && common.has("inflation"));
  assert.equal(sameStoryAcross("Fed-Mitglied Williams sagt, die Inflation sei zu hoch", "Gold outlook as Fed and inflation data weigh", common), false);
  assert.equal(sameStoryAcross("Война в Украине: двое погибших и 40 раненых при ударе по Запорожью", "2 killed, 33 injured in Russian attack on residential building in Zaporizhzhia", common), true);
  assert.equal(sameStoryAcross("Трамп: Иран за неделю выпустил рекордное число ракет и дронов", "Brent declines as Trump gives diplomacy with Iran more time", common), false);
});
test("short anchors match whole words only (UN is not 'under', EU is not 'Europe')", () => {
  assert.equal(sameStoryAcross("Gold may remain under pressure in Europe", "ООН и ЕС обсудили", null), false);
});
test("duo dedupe: a stem in a quarter of the episode's headlines counts half", () => {
  const hs = ["Yankees sign Brent Suter to $4 million contract", "Brent crude falls as Iran talks continue", "Brent oil slips after OPEC meeting", "Oil prices: Brent steady"];
  const c = commonStems(hs); assert.ok(c.has("brent"));
  assert.equal(sameStory(hs[0], hs[1], c), false);
  assert.equal(dropSameStory(hs.map((headline) => ({ headline }))).length >= 3, true);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8"); assert.match(w, /\/api\/v1\/bradford/); assert.match(w, /get_bradford/);
});
