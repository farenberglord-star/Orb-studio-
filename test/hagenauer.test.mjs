import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { soft, band, hagenauerReport } from "../src/hagenauer.js";

test("band and margin", () => {
  assert.equal(band(24, [25, 50, 75]), 0); assert.equal(band(25, [25, 50, 75]), 1);
  const x = soft({ id: "c", sensor: "s", value: 24, cuts: [25, 50, 75], labels: ["a", "b", "c", "d"], unit: "p", edge: 2 });
  assert.equal(x.label, "a"); assert.equal(x.margin, 1); assert.equal(x.flips_to, "b"); assert.equal(x.softness, "on_edge");
  const y = soft({ id: "r", sensor: "s", value: 58, cuts: [45, 70], labels: ["calm", "tense", "alarming"], unit: "p", edge: 2 });
  assert.equal(y.softness, "firm"); assert.equal(y.flips_to, "alarming");
});
test("report collects labels from every sensor and sorts shakiest first", () => {
  const src = {
    indices: { indices: [{ id: "consensus", value: 24 }, { id: "hallucination", value: 20 }, { id: "token_hunger", value: 7100 }] },
    radars: [{ id: "geo", lvl: 71, feed: [["1", "A story", "BBC"], ["2", "B story", "DW"]], verify: [2, 4] }],
    leamer: { indices: [{ id: "consensus", range: 14 }] },
    baird: { numbers: [{ id: "ecb_eurusd", age_h: 90, max_age_h: 96 }, { id: "btc_fee_fast", age_h: 0.1, max_age_h: 1 }] },
    lyberg: { nonresponse: { silent: 0, feeds: 53 }, coverage: { regions_absent_from_feeds: [] } },
    howard: { by_age: [{ p_confirm: null }] },
    polyak: { series: [{ id: "consensus", verdict: "jump", last: 17, average_last_3h: 10, polyak_average_24h: 11.8, noise_threshold: 2 }] },
  };
  const r = hagenauerReport(src);
  assert.equal(r.labels[0].softness, "on_edge");
  const ids = r.labels.map((x) => x.id);
  for (const id of ["index_consensus", "index_token_hunger", "radar_geo", "leamer_consensus", "baird_ecb_eurusd", "lyberg_silent_feeds", "polyak_consensus"]) assert.ok(ids.includes(id), id);
  assert.equal(r.labels.find((x) => x.id === "baird_ecb_eurusd").softness, "on_edge"); assert.equal(r.labels.find((x) => x.id === "baird_btc_fee_fast").softness, "firm");
  assert.equal(r.headlines_one_outlet_from_confirmed[0].headline, "A story");
  assert.equal(r.labels.find((x) => x.id === "polyak_consensus").label, "moving");
  assert.equal(hagenauerReport({}).total, 0);
});
test("wiring", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/hagenauer"/); assert.match(w, /name: "get_hagenauer"/); assert.match(w, /name === "get_hagenauer"/); assert.match(w, /"tools\/hagenauer"/);
  for (const f of ["tools/hagenauer.html", "de/tools/hagenauer.html", "en/tools/hagenauer.html"]) { const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8"); assert.match(h, /\/go\/kraken\?from=hagenauer/); assert.match(h, /\/go\/starlink\?from=hagenauer/); assert.match(h, /share-x\.js/); assert.match(h, /Joachim_Hagenauer/); }
  for (const f of ["sitemap.xml", "llms.txt", ".well-known/agent.json", "share-x.js", "tools.html", "de/tools.html", "en/tools.html"]) assert.match(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), /hagenauer/);
});
