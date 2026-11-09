import test from "node:test"; import assert from "node:assert/strict";
import { buildEpisode } from "../src/podcast.js";
const full = {
  space: { kp: { ok: true, kp: 2.67, max_24h: 4, time: "t" }, noaa_scales: { ok: true, current: { geomagnetic: { scale: "G0" }, radio_blackout: { scale: "R0" }, radiation: { scale: "S0" } } }, solar_wind: { ok: true, speed_kms: 704.68, density_pcm3: 1.54, time: "t" }, solar_flares: { ok: true, count_24h: 2, strongest: "M1.1" } },
  hydro: { stations: [{ station: "st_pauli", ok: true, water_level_cm: 649, measured_at: "x", observed_change: { change_cm: 55, window_min: 60 } }, { station: "cuxhaven", ok: true, water_level_cm: 596, observed_change: { change_cm: -53, window_min: 62 } }] },
  roads: { updated: "u", summary: { jams: 2, closures: 4, roadworks: 55, max_delay_min: 2 } },
  route: { status: "ok", distance_m: 12105, duration_min: 23.2, motorway_reports_near_route: [] },
  quakes: { last_24h_m45: { count: 16, strongest: { mag: 6.4, place: "Solomon Islands", depth_km: 17, tsunami_flag: false } } },
  aviation: { generated_at: "g", hamburg_sector: { radius_km: 100, airborne: 21, on_ground: 6 } },
  guests: { status: "ok", window_days: 7, named_total: 227, unnamed_requests: 7510, guests: [{ name: "lychee", requests: 2120, kind: "script" }, { name: "mcpbeat", requests: 602, kind: "mcp" }, { name: "x", requests: 5, kind: "bot" }] },
};
test("full episode copies numbers", () => {
  const e = buildEpisode(full, "2026-11-09T13:50:00Z");
  assert.equal(e.lines.length, 7); assert.equal(e.id, "2026-11-09"); assert.equal(e.ok_blocks, 7);
  const all = JSON.stringify(e);
  for (const x of ["2.67", "705 km/s", "649 cm", "+55 cm", "-53 cm", "55 roadworks", "12.1 km", "M6.4", "21 aircraft", "227 named", "lychee (2120, script)"]) assert.ok(all.includes(x), x);
  assert.ok(e.lines.every((l) => l.data_refs.length >= 1 && l.answer.en && l.answer.ru));
});
test("missing sources are admitted, nothing invented", () => {
  const e = buildEpisode({}, "2026-11-09T13:50:00Z");
  assert.equal(e.ok_blocks, 0); assert.equal(e.total_blocks, 7);
  assert.ok(e.lines.every((l) => /did not answer/.test(l.answer.en) && !/\d/.test(l.answer.en.replace(/ORB-7/g, "").replace(/Space weather:|Elbe:|Motorways:|Route:|Earthquakes:|Sky:|Guests:/g, ""))));
});
test("partial space block", () => {
  const e = buildEpisode({ ...full, space: { kp: { ok: true, kp: 5, max_24h: 5 }, solar_wind: { ok: false } } }, "2026-11-09T13:50:00Z");
  assert.ok(e.lines[0].answer.en.includes("Kp index 5")); assert.ok(!e.lines[0].answer.en.includes("solar wind"));
});

test("roads with no readable source is not reported as zero", () => {
  const e = buildEpisode({ ...full, roads: { updated: "u", sources_ok: 0, summary: { jams: 0, closures: 0, roadworks: 0, max_delay_min: 0 } } }, "2026-11-09T13:50:00Z");
  const l = e.lines.find((x) => x.topic === "roads");
  assert.ok(/did not answer/.test(l.answer.en)); assert.ok(!/0 jams/.test(l.answer.en));
});
test("guests without names", () => {
  const e = buildEpisode({ ...full, guests: { status: "ok", window_days: 7, named_total: 0, unnamed_requests: 5, guests: [] } }, "2026-11-09T13:50:00Z");
  assert.ok(!e.lines.find((x) => x.topic === "guests").answer.en.includes("Most active"));
});
