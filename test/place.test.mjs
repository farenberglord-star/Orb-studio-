import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { checkPlace, holidayInfo, easter, ratingInfo, reviewAges, hoursInfo, normState } from "../src/place.js";

const NOW = Date.parse("2026-11-26T12:00:00Z");

test("check_place: Easter dates are right", () => {
  assert.equal(new Date(easter(2024)).toISOString().slice(0, 10), "2024-03-31");
  assert.equal(new Date(easter(2025)).toISOString().slice(0, 10), "2025-04-20");
  assert.equal(new Date(easter(2026)).toISOString().slice(0, 10), "2026-04-05");
});
test("check_place: holidays depend on the state", () => {
  assert.equal(holidayInfo("2026-10-31", "HH").is_public_holiday, true);   // Reformationstag
  assert.equal(holidayInfo("2026-10-31", "BY").is_public_holiday, false);
  assert.equal(holidayInfo("2026-11-01", "BY").holiday, "Allerheiligen");
  assert.equal(holidayInfo("2026-11-01", "HH").holiday, null);
  assert.equal(holidayInfo("2026-12-25", "HH").is_public_holiday, true);
  assert.equal(holidayInfo("2026-04-03", "HH").holiday, "Karfreitag");
  assert.equal(holidayInfo("2026-11-18", "SN").holiday, "Buß- und Bettag");
  assert.equal(holidayInfo("2026-11-25", "SN").holiday, null);
  assert.equal(holidayInfo("2026-05-14", "NW").holiday, "Christi Himmelfahrt");
  assert.equal(holidayInfo("2026-06-04", "NW").holiday, "Fronleichnam");
  assert.equal(holidayInfo("2026-06-04", "HH").holiday, null);
});
test("check_place: next holiday and eve are named, today (a Thursday) is not a holiday in Hamburg", () => {
  const h = holidayInfo("2026-11-26", "Hamburg");
  assert.equal(h.state, "HH"); assert.equal(h.weekday, "Donnerstag"); assert.equal(h.is_public_holiday, false);
  assert.equal(h.next_holiday.name, "1. Weihnachtstag"); assert.equal(h.next_holiday.in_days, 29);
  assert.equal(holidayInfo("2026-12-24", "HH").is_eve_of_holiday_closing_early, true);
  assert.equal(holidayInfo("2026-11-29", "HH").is_sunday, true);
  assert.equal(normState("nordrhein-westfalen"), "NW"); assert.equal(normState(""), "HH"); assert.equal(normState("Atlantis"), null);
});
test("check_place: rating is weighed by its count and says what it is", () => {
  const few = ratingInfo(5, 3), big = ratingInfo(4.5, 1435);
  assert.equal(few.size, "very_few"); assert.ok(few.shrunk_toward_4_0 < 4.2);
  assert.equal(big.size, "large"); assert.ok(big.shrunk_toward_4_0 > 4.4);
  assert.match(big.shrink_assumption, /working assumption/);
  assert.equal(ratingInfo(7, 10), null);
  assert.equal(ratingInfo(4.1, NaN).size, "unknown");
});
test("check_place: hours that disagree are named, agreeing copies are not proof", () => {
  const c = hoursInfo([{ source: "map", open: "11:00", close: "17:00" }, { source: "directory", open: "10:00", close: "18:00" }, { source: "site", open: "11:00", close: "17:00" }]);
  assert.equal(c.conflict, true); assert.equal(c.most_sources_agree, 2); assert.equal(c.distinct_versions, 2);
  const a = hoursInfo([{ source: "a", open: "9:00", close: "17:00" }, { source: "b", open: "09:00", close: "17:00" }]);
  assert.equal(a.conflict, false); assert.match(a.note, /not proof/);
  assert.equal(hoursInfo([{ source: "x", open: "25:00", close: "17:00" }]), null);
});
test("check_place: review ages count only what was passed and are not a verdict", () => {
  const old = reviewAges(["2022-01-01", "2022-02-01", "2023-05-05", "2026-10-01"], NOW);
  assert.equal(old.given, 4); assert.equal(old.share_last_12_months, 0.25);
  const burst = reviewAges(["2026-11-01", "2026-11-02", "2026-11-02", "2026-11-03", "2026-11-04", "2025-01-01"], NOW);
  assert.equal(burst.burst_sign, true); assert.match(burst.note, /never a verdict/);
  assert.equal(reviewAges([], NOW), null);
});
test("check_place: the castle scene end to end", () => {
  const r = checkPlace({ name: "Museum für Bergedorf und die Vierlande", lat: 53.4896, lon: 10.2124, rating: 4.5, reviews: 1435, state: "HH", date: "2026-11-26", hours: [{ source: "Google", open: "11:00", close: "17:00" }, { source: "ortsdienst", open: "10:00", close: "18:00" }] }, NOW);
  assert.equal(r.tool, "check_place"); assert.equal(r.holiday.is_public_holiday, false);
  assert.equal(r.hours.conflict, true); assert.ok(r.flags.some((f) => f.scientist === "García-Molina"));
  assert.ok(r.report_back && r.report_back.en); assert.ok(r.pointers.some((p) => p.tool === "get_roads"));
  assert.ok(r.not_provided.some((x) => /review dates/.test(x)));
  assert.match(r.limits, /does not read, copy or store Google Maps content/);
  assert.ok(!/you should (go|visit|skip)/i.test(JSON.stringify(r)));
});
test("check_place: Sunday, holiday and pharmacy get their notes; bad input is refused", () => {
  assert.ok(checkPlace({ name: "Lidl Harburg", date: "2026-11-29" }, NOW).flags.some((f) => /Sunday/.test(f.en)));
  assert.ok(checkPlace({ name: "Café", date: "2026-10-03" }, NOW).flags.some((f) => /public holiday/.test(f.en)));
  const ph = checkPlace({ name: "Unsere Apotheke in Buxtehude", category: "Apotheke" }, NOW);
  assert.ok(ph.notes.length === 1 && /never says whether to use them/.test(ph.notes[0].en));
  assert.ok(checkPlace({ name: "x" }, NOW).error);
  assert.ok(checkPlace({ name: "Café", date: "morgen" }, NOW).error);
  assert.ok(checkPlace({ name: "Café", state: "Atlantis" }, NOW).error);
  assert.ok(checkPlace({ name: "Café", crowd_text: "usually not busy" }, NOW).flags.some((f) => f.scientist === "Kalman"));
});
test("check_place: MCP tool, REST route and announcements are registered", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /name: "check_place"/); assert.match(w, /p === "\/api\/v1\/place"/); assert.match(w, /name === "check_place"/);
  assert.match(w, /tool: "check_place", url:/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /\(check_place\)/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /"check_place"/);
});

import { descriptionClaims, nearbySummary, normRoads, routeSummary, sunInfo, namesakeSummary } from "../src/place.js";

test("check_place: absolute claims in a description are listed, a year counts as a visible basis, never a verdict", () => {
  const c = descriptionClaims("Das einzige Schloss Hamburgs. Gebaut 1250. Der beste Park der Stadt, laut Reiseführer.");
  assert.equal(c.absolute_claims.length, 2); assert.equal(c.without_visible_source, 1);
  assert.ok(c.absolute_claims.find((x) => x.word === "beste").has_visible_source);
  assert.match(c.note, /not a check that the claim is true/);
  assert.equal(descriptionClaims("short"), null); assert.equal(descriptionClaims(42), null);
  assert.equal(descriptionClaims("Единственный замок города. Построен в 1250 году.").without_visible_source, 1);
});
test("check_place: nearby warnings are passed through and flagged only from level 3", () => {
  const dwd = { status: "ok", issued_at: "2026-11-27T08:00:00Z", active_warnings: 4, levels: [{ level: 3, label: "Unwetter", warnings: 1 }, { level: 1, label: "Wetterwarnung", warnings: 3 }], severe_level3_plus: [{ event: "STURM", level: 3, level_label: "Unwetter", regions: 2 }] };
  const n = nearbySummary(dwd, { stand: "t", active_count: 2, highest_class: 1, highest_class_name: "Hinweis" }, "HH");
  assert.equal(n.weather.max_level, 3); assert.equal(n.weather.severe[0].event, "STURM"); assert.match(n.flood.note, /all of Germany/);
  const r = checkPlace({ name: "Strandcafé", state: "HH" }, NOW, { dwd });
  assert.ok(r.flags.some((f) => /weather warning level 3/.test(f.en))); assert.equal(r.nearby.state, "HH");
  assert.ok(!checkPlace({ name: "Strandcafé", state: "HH" }, NOW, { dwd: { ...dwd, levels: [{ level: 2, label: "Markante", warnings: 1 }] } }).flags.some((f) => /weather warning/.test(f.en)));
  assert.equal(nearbySummary({ status: "unavailable" }, null, "HH").weather.status, "unavailable");
});
test("check_place: motorways named by the agent are looked up, others are called not covered", () => {
  assert.deepEqual(normRoads("A7, a 1,x9,A7,B75"), ["A7", "A1", "B75"]);
  const feed = { roads: ["A7"], updated: "t", jams: [{ road: "A7", delay_min: 25, title: "Stau Elbtunnel", direction: "S" }], closures: [{ road: "A7", title: "Sperrung", direction: "N", blocked: true }], roadworks: [] };
  const rt = routeSummary(feed, ["A7", "A1"]);
  assert.equal(rt.per_road[0].jams, 1); assert.equal(rt.per_road[0].max_delay_min, 25); assert.deepEqual(rt.not_covered, ["A1"]);
  assert.match(rt.note, /whole route are not seen/);
  assert.equal(routeSummary(null, ["A7"]).status, "unavailable"); assert.equal(routeSummary(feed, []), null);
  const r = checkPlace({ name: "Museum", roads: "A7" }, NOW, { roads: feed });
  assert.ok(r.flags.some((f) => /A7: 1 closure/.test(f.en)));
  assert.equal(checkPlace({ name: "Museum", roads: "A7" }, NOW, {}).route.per_road, undefined);
});
test("check_place: wiring merges live data in the worker and writes no place data anywhere", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /async function placeAnswer\(env, a\)/); assert.match(w, /await placeAnswer\(env, args\)/); assert.match(w, /await placeAnswer\(env, \{ name: g\("name"\)/);
  const fn = w.slice(w.indexOf("async function placeAnswer"), w.indexOf("// ================= Капитанская рубка"));
  assert.ok(!/DB\.|prepare\(|console\.|sharedPut|logHit|bumpHit/.test(fn), "placeAnswer must not store or log place data");
  const src = readFileSync(new URL("../src/place.js", import.meta.url), "utf8");
  assert.ok(!/fetch\(|DB\.|console\./.test(src), "place.js stays pure");
});

test("check_place: sunset is computed from position and date, flagged within 90 minutes, silent without position", () => {
  const s = sunInfo(53.4859, 10.2347, "2026-11-27", Date.parse("2026-11-27T14:00:00Z"));
  assert.match(s.sunrise, /^0[78]:/); assert.match(s.sunset, /^16:/); assert.ok(s.minutes_to_sunset > 0 && s.minutes_to_sunset < 90);
  const j = sunInfo(53.4859, 10.2347, "2026-06-21"); assert.match(j.sunset, /^21:/); assert.ok(j.daylight_hours > 16);
  assert.equal(sunInfo(NaN, 10, "2026-06-21"), null); assert.equal(sunInfo(70, 10, "2026-06-21"), null);
  const r = checkPlace({ name: "Park", lat: 53.4859, lon: 10.2347, date: "2026-11-27" }, Date.parse("2026-11-27T14:00:00Z"));
  assert.ok(r.flags.some((f) => /Sunset is in/.test(f.en))); assert.match(r.sun.method, /NOAA/);
  assert.equal(checkPlace({ name: "Park" }, NOW).sun, null);
});

test("check_place: namesakes come from Wikidata entities with the same label, nearest first, flagged when several", () => {
  const ents = [
    { id: "Q1", label: "Schloss Bergedorf", description: "castle in Hamburg", lat: 53.4859, lon: 10.2347 },
    { id: "Q2", label: "Schloß Bergedorf", description: "other place", lat: 50.1, lon: 8.6 },
    { id: "Q3", label: "Schloss Bergedorf", description: "dup of Q1", lat: 53.4861, lon: 10.2349 },
    { id: "Q4", label: "Something else", description: "x", lat: 1, lon: 1 }, { id: "bad", label: "Schloss Bergedorf", lat: 1, lon: 1 },
  ];
  const n = namesakeSummary("schloss bergedorf", ents, 53.4859, 10.2347);
  assert.equal(n.same_name_places, 1); assert.equal(n.nearest_is_at_given_position, true); assert.equal(n.places[0].distance_km, 0);
  const two = namesakeSummary("Schloss Bergedorf", [...ents, { id: "Q9", label: "Schloss Bergedorf", description: "elsewhere", lat: 48.1, lon: 11.5 }], 53.4859, 10.2347);
  assert.equal(two.same_name_places, 2); assert.ok(two.places[0].distance_km < two.places[1].distance_km);
  assert.equal(namesakeSummary("Nope", ents, 53, 10).same_name_places, 0);
  assert.equal(namesakeSummary("x", null, 53, 10).status, "unavailable");
  const r = checkPlace({ name: "Schloss Bergedorf", lat: 53.4859, lon: 10.2347 }, NOW, { namesakes: [...ents, { id: "Q9", label: "Schloss Bergedorf", description: "e", lat: 48.1, lon: 11.5 }] });
  assert.ok(r.flags.some((f) => f.zone === "look_alike" && /matches 2 places/.test(f.en)));
  assert.equal(checkPlace({ name: "Schloss Bergedorf" }, NOW).namesakes, null);
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  const h = w.slice(w.indexOf("async function wikidataPlaces"), w.indexOf("async function placeAnswer"));
  assert.match(h, /User-Agent/); assert.ok(!/DB\.|prepare\(|console\.|sharedPut|caches\./.test(h), "namesake lookup must not store or cache place names");
});
