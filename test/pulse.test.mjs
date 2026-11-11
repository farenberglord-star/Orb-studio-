import test from "node:test"; import assert from "node:assert/strict";
import { snapshot, diff, mergeEvents, sinceMs, PULSE_SENSORS } from "../src/pulse.js";
const gas = (day, p = 58.5) => ({ ok: true, gas_day: day, full_percent: p, net_flow: "WITHDRAWING" });
const bafin = (...u) => ({ ok: true, items: u.map((x, i) => ({ url: "https://b/" + x, title: "T" + x, sector: "insurance", date: "2026-11-11T05:00:00.000Z" })) });
const flood = (n, hc, items = []) => ({ ok: true, active_count: n, highest_class: hc, highest_class_name: hc ? "Hochwasser" : null, items });
const q = (...ids) => ({ significant_week: { events: ids.map((i) => ({ url: "https://u/" + i, mag: 6.4, place: "P" + i, time: "2026-11-09T03:34:59.466Z" })) } });
const sp = (g, r = "R0", sr = "S0") => ({ noaa_scales: { ok: true, current: { geomagnetic: { scale: g }, radio_blackout: { scale: r }, radiation: { scale: sr } } } });
const snaps = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, snapshot(k, v)]));
const ALL = (o = {}) => snaps({ gas: gas("2026-11-09"), bafin: bafin("a", "b"), flood: flood(0, null), quakes: q("1"), space: sp("G0"), ...o });
test("first run records a baseline and emits no events", () => {
  const r = diff({}, ALL(), 1e12); assert.equal(r.events.length, 0); assert.deepEqual(Object.keys(r.state).sort(), Object.keys(PULSE_SENSORS).sort());
});
test("no change -> no events", () => {
  const a = diff({}, ALL()).state; assert.equal(diff(a, ALL()).events.length, 0);
});
test("new gas day, new BaFin measure, new significant quake, flood change, NOAA scale change each produce one event", () => {
  const a = diff({}, ALL()).state;
  const r = diff(a, ALL({ gas: gas("2026-11-10", 58.1), bafin: bafin("c", "a", "b"), quakes: q("2", "1"), flood: flood(2, 4, [{ name: "Rhein" }, { name: "Elbe" }]), space: sp("G1") }), 1.8e12);
  const by = Object.fromEntries(r.events.map((e) => [e.sensor, e]));
  assert.equal(r.events.length, 5); assert.equal(by.gas.type, "new_gas_day"); assert.equal(by.gas.source_time, "2026-11-10"); assert.match(by.bafin.summary, /Tc/); assert.equal(by.quakes.data.mag, 6.4);
  assert.equal(by.flood.data.active_count, 2); assert.match(by.space.summary, /G0\/R0\/S0 -> G1\/R0\/S0/); assert.ok(r.events.every((e) => e.detected_at && e.id));
});
test("source error keeps previous state and emits nothing; recovery with same data emits nothing", () => {
  const a = diff({}, ALL()).state, bad = diff(a, { ...ALL(), gas: snapshot("gas", { ok: false }), bafin: null }); assert.equal(bad.events.length, 0); assert.deepEqual(bad.state.gas, a.gas); assert.deepEqual(bad.state.bafin, a.bafin);
  assert.equal(diff(bad.state, ALL()).events.length, 0);
});
test("snapshot rejects broken or empty answers", () => {
  for (const [k, d] of [["gas", {}], ["gas", null], ["bafin", { ok: true }], ["flood", { ok: false }], ["quakes", {}], ["space", { noaa_scales: { ok: false } }]]) assert.equal(snapshot(k, d), null);
});
test("a removed item is not an event; at most 5 new items per sensor", () => {
  const a = diff({}, ALL({ bafin: bafin("a", "b") })).state;
  assert.equal(diff(a, ALL({ bafin: bafin("a") })).events.length, 0);
  const many = diff(a, ALL({ bafin: bafin(..."cdefghij".split(""), "a", "b") })); assert.equal(many.events.filter((e) => e.sensor === "bafin").length, 5);
});
test("mergeEvents dedupes, newest first, keeps the limit; sinceMs parses ISO, seconds and ms", () => {
  const e = (id) => ({ id }); let log = mergeEvents([], [e("1"), e("2")]); assert.deepEqual(log.map((x) => x.id), ["2", "1"]); log = mergeEvents(log, [e("2"), e("3")]); assert.deepEqual(log.map((x) => x.id), ["3", "2", "1"]); assert.equal(mergeEvents(log, [e("4")], 3).length, 3);
  const now = Date.parse("2026-11-11T12:00:00Z"); assert.equal(sinceMs("2026-11-11T11:00:00Z", now), Date.parse("2026-11-11T11:00:00Z")); assert.equal(sinceMs("1794128400", now), 1794128400000); assert.equal(sinceMs(String(now - 1000), now), now - 1000);
  assert.ok(Number.isNaN(sinceMs("junk", now))); assert.equal(sinceMs("", now), null);
});
import { etagBasis } from "../src/pulse.js";
test("etag basis ignores per-request timing fields at any depth, but not data", () => {
  const a = { checked_at: "t1", live_count: 3, items: [{ facility: "x", free: 4, age_min: 3 }], referral: { a: 1 } }, b = { checked_at: "t2", live_count: 3, items: [{ facility: "x", free: 4, age_min: 9 }], referral: { a: 2 } };
  assert.equal(JSON.stringify(etagBasis(a)), JSON.stringify(etagBasis(b)));
  assert.notEqual(JSON.stringify(etagBasis(a)), JSON.stringify(etagBasis({ ...b, live_count: 4 })));
});
