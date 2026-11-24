import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { langOf, sameStoryAcross, compareVersions, reissReport } from "../src/reiss.js";

test("language tags and cross-language story matching (Reiss, Nida)", () => {
  assert.equal(langOf("Russian ship hit in Benghazi"), "en"); assert.equal(langOf("Fed kämpft gegen Inflation"), "de"); assert.equal(langOf("Удар по Киеву"), "ru");
  assert.ok(sameStoryAcross("Poland says Russian missiles hit its territory", "Все упавшие в Польше объекты оказались российскими ракетами"));
  assert.ok(sameStoryAcross("Blast on Russian ship in Benghazi a suspected drone attack", "На российском военном корабле в Бенгази произошли взрывы"));
  assert.equal(sameStoryAcross("Inflation rises in Japan", "Bitcoin ETFs shed $1.8B"), false);
});
test("versions differ: statement in one language, event in another", () => {
  const c = compareVersions({ headline: "Poland says Russian missiles hit its territory" }, { headline: "Все упавшие в Польше объекты оказались российскими ракетами" });
  assert.ok(c.diffs.includes("speech_act"));
  const rows = []; for (let i = 0; i < 25; i++) { rows.push({ k: "e" + i, headline: `Poland says Russian missiles hit Warsaw ${100 + i}`, first_ts: 1 }); rows.push({ k: "r" + i, headline: `Российские ракеты упали в Варшаве и Польше ${100 + i}`, first_ts: 2 }); }
  const r = reissReport(rows); assert.ok(r.cross_language_pairs >= 20); assert.notEqual(r.verdict, "collecting");
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/reiss"/); assert.match(w, /name: "get_reiss"/);
});
