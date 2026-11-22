import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { lybergRadar, lybergReport, langOf } from "../src/lyberg.js";

test("language of a headline", () => {
  assert.equal(langOf("Кремль ответил на санкции"), "ru");
  assert.equal(langOf("Regierung einigt sich auf Haushalt"), "de"); // без умлаутов, но по служебным словам
  assert.equal(langOf("Streit über die Rente geht weiter"), "de");
  assert.equal(langOf("Markets rally after Fed decision"), "en");
  assert.equal(langOf("Brésil : la réforme passe"), "other");
});
test("radar stats: feeds, silence and processing losses", () => {
  const feeds = ["https://www.bbc.co.uk/a.rss", "https://news.google.com/rss/x", "https://silent.example/rss"];
  const lists = [[{ title: "A" }, { title: "B" }], [{ title: "C" }], []];
  const s = lybergRadar(feeds, lists, { raw: 3, unique: 3, fresh: 2, on_topic: 2 }, [{ title: "Putin meets Xi", source: "BBC" }, { title: "Die Bahn streikt", source: "NDR" }]);
  assert.equal(s.answered, 2); assert.deepEqual(s.silent, ["silent.example"]); assert.equal(s.too_old, 1); assert.equal(s.languages.de, 1); assert.equal(s.outlets, 2);
});
test("report: blind regions, caveat, pronoun 'us' is not the USA", () => {
  const mk = (id, heads, silent) => ({ id, feed: heads.map((h) => ["10:00", h]), lyberg: { feeds: 3, answered: 3 - silent, silent: silent ? ["x.example"] : [], raw: 10, duplicates: 2, too_old: 1, off_topic: 1, kept: heads.length, languages: { en: heads.length, de: 0, ru: 0, other: 0 }, outlets: 3 } });
  const r = lybergReport([mk("geo", ["Putin warns Europe", "China and Japan talks"], 1), mk("econ", ["Tell us what you think", "Iran oil exports rise"], 0)]);
  assert.ok(r.coverage.regions_not_seen.includes("north_america"));
  assert.ok(r.coverage.regions_not_seen.includes("africa"));
  assert.equal(r.nonresponse.silent, 1); assert.equal(r.verdict, "large_gaps");
  assert.match(r.caveat_for_agents, /6 feeds \(5 answered now\), mostly in en/);
  assert.equal(lybergReport([]).verdict, "no_data");
  const b = mk("x", ["Putin warns Europe"], 0); b.lyberg.regions_in_feeds = { south_america: 3 };
  const rb = lybergReport([b]); assert.deepEqual(rb.coverage.regions_in_feeds_but_not_top, ["south_america"]); assert.match(rb.caveat_for_agents, /south_america is in the feeds but not among the top/);
  assert.equal(lybergRadar(["https://a.example/r"], [[{ title: "Brazil votes" }]], { raw: 1, unique: 1, fresh: 1, on_topic: 1 }, [], [{ title: "Brazil votes" }, { title: "Lula in Mexico" }]).regions_in_feeds.south_america, 2);
  assert.equal(lybergReport([mk("a", ["Fed holds rates as US jobs grow"], 0)]).coverage.regions_in_top_headlines.north_america, 1);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/lyberg"/); assert.match(w, /name: "get_lyberg"/); assert.match(w, /name === "get_lyberg"/); assert.match(w, /"tools\/lyberg"/); assert.match(w, /lyberg: lybergRadar\(def\.feeds, lists/);
  for (const f of ["tools/lyberg.html", "de/tools/lyberg.html", "en/tools/lyberg.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=lyberg/); assert.match(h, /\/go\/starlink\?from=lyberg/); assert.match(h, /share-x\.js/); assert.match(h, /Lars_Lyberg/); }
  for (const f of ["sitemap.xml", "llms.txt", ".well-known/agent.json", "share-x.js", "tools.html", "de/tools.html", "en/tools.html"]) assert.match(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), /lyberg/);
});

import { regionQuota, regionsOf } from "../src/lyberg.js";
import { stateMediaOf, stateTag } from "../src/statemedia.js";
test("regions: China, Russia, Central and South America apart", () => {
  assert.deepEqual(regionsOf("Putin meets Xi in Beijing").sort(), ["china", "russia"]);
  assert.deepEqual(regionsOf("Latin America braces for storm"), ["south_america"]);
  assert.ok(regionsOf("Cuba blackout spreads").includes("central_america"));
  assert.deepEqual(regionsOf("Tell us what you think"), []);
});
test("quota: a region present in the feed gets one of the top slots, without pushing out another quota region", () => {
  const it = (t, w) => ({ title: t, weight: w, ts: 0 });
  const sorted = [it("Russia strikes Kyiv", 90), it("Pentagon drill", 90), it("Trump tariffs on EU", 70), it("Iran talks", 60), it("Brazil election result", 20), it("Nigeria floods", 15)];
  const top = regionQuota(sorted, ["russia", "north_america", "south_america", "africa"], 4);
  const regs = top.flatMap((x) => regionsOf(x.title));
  for (const q of ["russia", "north_america", "south_america", "africa"]) assert.ok(regs.includes(q), q);
  assert.equal(top.length, 4);
});
test("state media are recognised and labelled; public broadcasters are not", () => {
  assert.equal(stateMediaOf("TASS", "https://tass.com/world/1").id, "tass");
  assert.equal(stateMediaOf("cgtn.com", "").id, "cgtn");
  assert.equal(stateMediaOf("BBC News", "https://www.bbc.co.uk/x"), null);
  assert.equal(stateMediaOf("Deutsche Welle", "https://www.dw.com/ru/x"), null);
  assert.equal(stateMediaOf("Sports Report", "https://sport.com/x"), null);
  assert.match(stateTag("TASS", "").state_media, /Russian state news agency/);
});
