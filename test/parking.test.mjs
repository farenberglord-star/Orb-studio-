import test from "node:test"; import assert from "node:assert/strict";
import { parseKarlsruhe, parseLeipzig, parseCsv, berlinToIso, STALE_MIN } from "../src/parking.js";
const NOW = Date.parse("2026-11-10T20:40:00Z");
const ka = (p) => ({ type: "Feature", properties: { gemeinde: "Rastatt", parkhaus_name: "SchlossGalerie", gesamte_parkplaetze: 315, freie_parkplaetze: 284, echtzeit_status: "OK", echtzeit_belegung: "T", geschlossen: "F", stand_freieparkplaetze: "2026-11-10T20:29:00Z", betreiber_telefon: "+49 1", ...p } });
test("karlsruhe: live facility passes through, operator contact fields never appear", () => {
  const r = parseKarlsruhe({ features: [ka()] }, NOW), it = r.items[0];
  assert.equal(r.ok, true); assert.equal(it.city, "Rastatt"); assert.equal(it.free, 284); assert.equal(it.capacity, 315); assert.equal(it.live, true); assert.equal(it.occupancy, 0.1);
  assert.equal(it.updated_at, "2026-11-10T20:29:00Z"); assert.match(it.source, /Stadt Karlsruhe, CC BY 4\.0/); assert.ok(!JSON.stringify(it).includes("betreiber") && !JSON.stringify(it).includes("+49"));
});
test("karlsruhe: not real-time, closed or without time -> live false and no numbers", () => {
  for (const p of [{ echtzeit_belegung: "F" }, { geschlossen: "T" }, { echtzeit_status: "ERR" }, { stand_freieparkplaetze: null }]) {
    const it = parseKarlsruhe({ features: [ka(p)] }, NOW).items[0]; assert.equal(it.live, false); assert.equal(it.free, null); assert.equal(it.occupancy, null); assert.equal(it.capacity, 315);
  }
});
test("karlsruhe: stale timestamp (older than the limit) is not live", () => {
  const it = parseKarlsruhe({ features: [ka({ stand_freieparkplaetze: "2026-11-10T19:00:00Z" })] }, NOW).items[0];
  assert.equal(it.live, false); assert.equal(it.stale, true); assert.equal(it.free, null); assert.ok(it.age_min > STALE_MIN);
});
test("karlsruhe: empty or broken answer -> ok false", () => {
  for (const j of [null, {}, { features: [] }, { features: [{}] }, "x"]) assert.equal(parseKarlsruhe(j, NOW).ok, false);
});
const HEAD = "GmlId,objectid,id,parkingfacilityname,parkingfacilityoccupancy,parkingfacilitystatus,phenomenontime,totalnumoccupiedparkingspaces,totalnumvacantparkingspaces,totalparkingcapacity,parkingfacilityurl,resulttime";
const row = (n, occ, t, vac, cap) => `x.1,1,"id","${n}",${occ},"statusUnknown",${t},0,${vac},${cap},"https://a.b/?x=1,2&amp;y","${t}"`;
test("leipzig: local time without zone becomes Europe/Berlin ISO (winter +01:00, summer +02:00)", () => {
  assert.equal(berlinToIso("2026-11-10T21:25:00"), "2026-11-10T21:25:00+01:00"); assert.equal(berlinToIso("2026-07-01T12:00:00"), "2026-07-01T12:00:00+02:00");
  assert.equal(berlinToIso("2026-03-29T01:30:00"), "2026-03-29T01:30:00+01:00"); assert.equal(berlinToIso("2026-03-29T03:30:00"), "2026-03-29T03:30:00+02:00");
  assert.equal(berlinToIso("2026-10-25T03:30:00"), "2026-10-25T03:30:00+01:00"); assert.equal(berlinToIso("junk"), null);
});
test("leipzig: fresh row is live, stale rows (March / this morning) are not and show no numbers", () => {
  const csv = [HEAD, row("Messe", "0.2596", "2026-11-10T21:25:00", 519, 700), row("Knauthain", "0.0", "2026-03-09T04:20:00", 30, 30), row("Krakauer Straße", "0.0", "2026-11-10T05:14:08", 200, 200)].join("\n");
  const r = parseLeipzig(csv, NOW), [a, b, c] = r.items;
  assert.equal(r.ok, true); assert.equal(a.facility, "P+R Messe"); assert.equal(a.live, true); assert.equal(a.free, 519); assert.equal(a.occupancy, 0.26); assert.equal(a.updated_at, "2026-11-10T21:25:00+01:00");
  for (const x of [b, c]) { assert.equal(x.live, false); assert.equal(x.stale, true); assert.equal(x.free, null); assert.equal(x.occupancy, null); }
});
test("leipzig: quoted commas, doubled quotes, CRLF and BOM", () => {
  assert.deepEqual(parseCsv('\uFEFFa,b\r\n"x,1","y ""q"""\r\n'), [["a", "b"], ["x,1", 'y "q"']]);
});
test("leipzig: empty body, header only, wrong header -> ok false; source http error text -> ok false", () => {
  for (const s of ["", HEAD, "a,b\n1,2", '{"error":{"code":500,"message":"Internal Server Error"}}', null]) assert.equal(parseLeipzig(s, NOW).ok, false);
});
