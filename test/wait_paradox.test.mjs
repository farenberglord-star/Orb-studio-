import test from "node:test";
import assert from "node:assert/strict";
import { decodeTripUpdates, groupHeadways, waitParadox, MIN_GROUPS } from "../src/wait_paradox.js";

// минимальный кодировщик protobuf для теста (тот же формат, что у GTFS-Realtime)
const vi = (n) => { const o = []; while (n >= 128) { o.push((n % 128) | 128); n = Math.floor(n / 128); } o.push(n); return o; };
const tag = (f, w) => vi(f * 8 + w);
const ld = (f, bytes) => [...tag(f, 2), ...vi(bytes.length), ...bytes];
const s = (f, t) => ld(f, [...new TextEncoder().encode(t)]);
const n = (f, v) => [...tag(f, 0), ...vi(v)];
const stu = (stop, time, extra = []) => ld(2, [...s(4, stop), ...ld(2, n(2, time)), ...extra]);
const entity = (id, route, dir, stops, cancelled) => ld(2, [...s(1, id), ...ld(3, [...ld(1, [...s(1, "t" + id), ...s(5, route), ...n(6, dir), ...(cancelled ? n(4, 3) : [])]), ...stops.flatMap(([a, b]) => stu(a, b))])]);
const feed = (ents) => new Uint8Array([...ld(1, n(1, 1)), ...ents.flat()]);
const T0 = 1764240000; // 27.11.2025-ish, > 2^31 not needed but varint multi-byte

test("decode: route, direction, stop, arrival time, cancelled", () => {
  const t = decodeTripUpdates(feed([entity("1", "U2", 1, [["S1", T0], ["S2", T0 + 120]]), entity("2", "U2", 1, [["S1", T0 + 600]], true)]));
  assert.equal(t.length, 2);
  assert.deepEqual(t[0].stops.map((x) => [x.stop_id, x.time]), [["S1", T0], ["S2", T0 + 120]]);
  assert.equal(t[0].route_id, "U2"); assert.equal(t[0].direction, 1);
  assert.equal(t[1].cancelled, true);
  assert.deepEqual(decodeTripUpdates(feed([])), []);
  assert.throws(() => decodeTripUpdates(new Uint8Array([0x12, 0x50, 1, 2])));
});

test("even service gives ratio 1, bunching gives ratio above 1 (1 + CV²)", () => {
  const mk = (route, gaps) => { let t = T0; const e = [entity(route + "0", route, 0, [["A", t]])]; gaps.forEach((g, i) => { t += g * 60; e.push(entity(route + (i + 1), route, 0, [["A", t]])); }); return e; };
  const even = groupHeadways(decodeTripUpdates(feed(mk("E", [10, 10, 10, 10, 10]))));
  assert.equal(even[0].ratio, 1); assert.equal(even[0].expected_wait_min, 5);
  const bunch = groupHeadways(decodeTripUpdates(feed(mk("B", [2, 18, 2, 18, 2, 18]))));
  assert.equal(bunch[0].mean_headway_min, 10);
  assert.equal(bunch[0].expected_wait_min, 8.2); // E[H²]=164, 164/(2·10)
  assert.equal(bunch[0].ratio, 1.64); // 1 + CV², CV²=0.64
});

test("collecting until enough line/stop groups; ok summary lists worst first", () => {
  assert.equal(waitParadox([]).status, "collecting");
  const ents = []; for (let g = 0; g < MIN_GROUPS; g++) { let t = T0; const gaps = g % 2 ? [2, 18, 2, 18, 2, 18, 2, 18] : [10, 10, 10, 10, 10, 10, 10, 10]; ents.push(entity("g" + g + "x", "R" + g, 0, [["A", t]])); gaps.forEach((d, i) => { t += d * 60; ents.push(entity("g" + g + "y" + i, "R" + g, 0, [["A", t]])); }); }
  const r = waitParadox(decodeTripUpdates(feed(ents)));
  assert.equal(r.status, "ok"); assert.equal(r.groups, MIN_GROUPS);
  assert.ok(r.worst[0].ratio >= r.worst[r.worst.length - 1].ratio && r.worst[0].ratio > 1.5);
  assert.equal(r.share_ratio_over_1_25, 0.5);
  assert.match(r.source, /CC BY 4\.0/);
});
test("cancelled trips and skipped stops are left out; implausible gaps dropped", () => {
  const e = [entity("a", "X", 0, [["A", T0]]), entity("b", "X", 0, [["A", T0 + 600]], true), entity("c", "X", 0, [["A", T0 + 1200]]), entity("d", "X", 0, [["A", T0 + 1800]]), entity("e", "X", 0, [["A", T0 + 1800 + 3 * 3600]])];
  const g = groupHeadways(decodeTripUpdates(feed(e)));
  assert.equal(g.length, 0); // 4 trips left, but only 2 plausible gaps (< MIN)
});
