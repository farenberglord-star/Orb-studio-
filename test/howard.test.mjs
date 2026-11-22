import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { howardReport, howardAtAge, howardHint, HOWARD_MIN } from "../src/howard.js";

const H = 3600e3, now = Date.parse("2026-12-10T12:00:00Z");
// 12 историй с 1 изданием: 8 подтвердились через 4 ч, 4 ушли через 3 ч без подтверждения
const mk = (i, conf) => ({ first_ts: now - 48 * H + i * 60e3, last_ts: now - 48 * H + (conf ? 20 : 3) * H, n_first: 1, n_max: conf ? 4 : 1, t3: conf ? now - 48 * H + i * 60e3 + 4 * H : null });
const rows = [...Array(8)].map((_, i) => mk(i, true)).concat([...Array(4)].map((_, i) => mk(i + 8, false)));

test("share and wait at age 0", () => {
  const s = howardAtAge(rows, now, 0);
  assert.equal(s.decided, 12); assert.equal(s.confirmed_later, 8); assert.equal(s.p_confirm, 67); assert.equal(s.median_wait_h, 4);
});
test("age 3–6 h: stories that faded at 3 h do not reach this age", () => {
  const s = howardAtAge(rows, now, 3);
  assert.equal(s.faded, 0); assert.equal(s.confirmed_later, 8); assert.equal(s.median_wait_h, 1);
});
test("confirmed at start and young open stories are left out", () => {
  const extra = [{ first_ts: now - 5 * H, last_ts: now, n_first: 4, n_max: 4, t3: now - 5 * H }, { first_ts: now - 0.5 * H, last_ts: now, n_first: 1, n_max: 1, t3: null }];
  const r = howardReport(rows.concat(extra), now);
  assert.equal(r.started_confirmed, 1); assert.equal(r.by_age[0].open, 1); assert.equal(r.verdict, "worth_waiting");
});
test("too little history -> collecting", () => {
  const r = howardReport(rows.slice(0, HOWARD_MIN - 1), now);
  assert.equal(r.verdict, "collecting"); assert.equal(r.by_age[0].p_confirm, null);
  assert.equal(howardReport([], now).verdict, "collecting");
});
test("hint only for 1–2 voices", () => {
  const r = howardReport(rows, now);
  assert.equal(howardHint(r, 0.5, 1).advice, "worth_waiting");
  assert.equal(howardHint(r, 0.5, 3), null); assert.equal(howardHint(r, 0.5, 0), null);
  assert.equal(howardHint(r, 7, 2).age_bucket, "6–12");
});
test("wiring: worker, scientists, pages, discovery", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /p === "\/api\/v1\/howard"/); assert.match(w, /name: "get_howard"/); assert.match(w, /name === "get_howard"/);
  assert.match(w, /"tools\/howard"/); assert.match(w, /"halpern", "howard"/);
  assert.match(w, /ALTER TABLE radar_life ADD COLUMN/); assert.match(w, /howardHint\(hrep/);
  assert.match(readFileSync(new URL("../src/scientists.js", import.meta.url), "utf8"), /id: "howard"/);
  for (const f of ["tools/howard.html", "de/tools/howard.html", "en/tools/howard.html"]) {
    const h = readFileSync(new URL("../public/" + f, import.meta.url), "utf8");
    assert.match(h, /\/go\/kraken\?from=howard/); assert.match(h, /\/go\/starlink\?from=howard/); assert.match(h, /hreflang="de"/); assert.match(h, /share-x\.js/);
    assert.match(h, /Ronald_A\._Howard/);
  }
  for (const f of ["sitemap.xml", "llms.txt", ".well-known/agent.json", "share-x.js", "tools.html", "de/tools.html", "en/tools.html"]) assert.match(readFileSync(new URL("../public/" + f, import.meta.url), "utf8"), /howard/);
});
