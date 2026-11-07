import assert from "node:assert/strict";
import { detectLandings, summarize, parseStates, regionOf, EDHI } from "../src/aviation.js";
const T = 1e12, M = 6 * 60e3;
const st = (id, o) => ({ icao24: id, callsign: "AIB" + id, lat: EDHI.lat, lon: EDHI.lon, alt: 100, ground: false, vr: -3, ...o });

// 1) снижение за 8 км, потом на земле у полосы → посадка (on_ground)
let r = detectLandings(null, [st("a1", { lat: EDHI.lat + 0.07, alt: 900 })], T);
assert.equal(r.landings.length, 0);
r = detectLandings(r.state, [st("a1", { ground: true, alt: 0, vr: 0 })], T + M);
assert.equal(r.landings.length, 1); assert.equal(r.landings[0].evidence, "on_ground");
// повторный опрос — тот же самолёт на земле, второй посадки нет
r = detectLandings(r.state, [st("a1", { ground: true, alt: 0 })], T + 2 * M);
assert.equal(r.landings.length, 0);

// 2) сразу на земле без захода (вышел из ангара) → не посадка
r = detectLandings(null, [st("b1", { ground: true, alt: 0 })], T);
assert.equal(r.landings.length, 0);
r = detectLandings(r.state, [st("b1", { ground: true, alt: 0 })], T + M);
assert.equal(r.landings.length, 0);

// 3) взлёт (набор высоты) не создаёт «заход»
r = detectLandings(null, [st("c1", { alt: 600, vr: 8, lat: EDHI.lat + 0.05 })], T);
assert.deepEqual(r.state.approach, {});

// 4) пропал с эфира у полосы на малой высоте → вероятная посадка
r = detectLandings(null, [st("d1", { alt: 120, vr: -2 })], T);
r = detectLandings(r.state, [], T + M);
assert.equal(r.landings.length, 1); assert.equal(r.landings[0].evidence, "signal_lost_at_field");

// 5) старый заход (>25 мин) не даёт посадку
r = detectLandings(null, [st("e1", { lat: EDHI.lat + 0.05, alt: 700 })], T);
r = detectLandings(r.state, [st("e1", { ground: true, alt: 0 })], T + 30 * 60e3);
assert.equal(r.landings.length, 0);

// сводка и регионы
const j = { states: [["x1","DLH1","DE",1,1,10.0,53.6,9000,false,200,0,0,null,9100],["x2","UAL1","US",1,1,-100,40,10000,false,230,0,0,null,10000],["x3","T1","DE",1,1,9.9,53.6,0,true,0,0,0,null,0],["bad","","",1,1,null,null,0,false]] };
const s = summarize(parseStates(j));
assert.equal(s.airborne_seen, 2); assert.equal(s.on_ground_seen, 1);
assert.equal(s.regional_airborne.Europe, 1); assert.equal(s.regional_airborne.NorthAmerica, 1);
assert.equal(s.hamburg_sector.airborne, 1); assert.equal(s.hamburg_sector.on_ground, 1);
assert.equal(regionOf(25, 50), "MiddleEast");
console.log("aviation: ok");
