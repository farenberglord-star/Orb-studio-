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
