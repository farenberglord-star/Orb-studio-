import test from "node:test"; import assert from "node:assert/strict";
import { summarize, parseEvent, utc } from "../src/gdacs.js";
const NOW = Date.parse("2026-11-17T09:35:00Z");
// Форма по документации GDACS; события — из живой проверки Грока 17.11.2026 (AKVAN-26, засухи).
const F = (p, coords = [80.1, 15.2]) => ({ type: "Feature", geometry: { type: "Point", coordinates: coords }, properties: p });
const sample = { type: "FeatureCollection", features: [
  F({ eventtype: "TC", eventid: 1001234, episodeid: 7, name: "Tropical Cyclone AKVAN-26", alertlevel: "Orange", iscurrent: "true", fromdate: "2026-11-16T18:00:00", todate: "2026-11-17T06:00:00", datemodified: "2026-11-17T06:10:00",
    affectedcountries: [{ iso3: "IND", countryname: "India" }], severitydata: { severitytext: "Tropical Storm (maximum wind speed of 102 km/h)" }, url: { report: "https://www.gdacs.org/report.aspx?eventid=1001234&eventtype=TC" } }),
  F({ eventtype: "DR", eventid: 1018, episodeid: 30, name: "Drought in Europe", alertlevel: "Orange", iscurrent: "true", fromdate: "2025-12-21T00:00:00", todate: "2026-11-10T00:00:00",
    affectedcountries: [{ iso3: "DEU", countryname: "Germany" }, { iso3: "FRA", countryname: "France" }, { iso3: "POL", countryname: "Poland" }] }),
  F({ eventtype: "DR", eventid: 777, name: "Drought in South America", alertlevel: "Orange", iscurrent: "true", fromdate: "2022-09-21T00:00:00", affectedcountries: [{ iso3: "BRA", countryname: "Brazil" }] }),
  F({ eventtype: "EQ", eventid: 5, name: "Earthquake M 6.9", alertlevel: "Red", iscurrent: "true", fromdate: "2026-11-15T02:00:00", url: { report: "javascript:alert(1)" } }),
  F({ eventtype: "FL", eventid: 9, alertlevel: "Green", iscurrent: "true", fromdate: "2026-11-15T00:00:00" }),
  F({ eventtype: "XX", eventid: 10, alertlevel: "Red", fromdate: "2026-11-15T00:00:00" }),
  F({ eventtype: "TC", eventid: 1001234, episodeid: 7, name: "dup", alertlevel: "Orange", iscurrent: "true" }),
  F({ eventtype: "WF", eventid: 11, alertlevel: "Orange", iscurrent: "false", fromdate: "2026-10-01T00:00:00" }),
] };
test("time without a zone is UTC", () => {
  assert.equal(utc("2026-11-16T18:00:00"), "2026-11-16T18:00:00.000Z"); assert.equal(utc("2026-11-16T18:00:00Z"), "2026-11-16T18:00:00.000Z"); assert.equal(utc("x"), null);
});
test("fast and slow are separated; green, unknown types, closed and duplicate events are dropped", () => {
  const r = summarize(sample, NOW);
  assert.equal(r.ok, true);
  assert.deepEqual(r.counts, { fast: 2, slow: 2, red: 1, orange: 3, by_type: { EQ: 1, TC: 1, FL: 0, VO: 0, WF: 0, DR: 2 } });
  assert.deepEqual(r.fast.map((e) => e.type), ["EQ", "TC"]); // красные первыми
  assert.equal(r.fast[1].name, "Tropical Cyclone AKVAN-26"); assert.deepEqual(r.fast[1].countries, ["India"]);
  assert.equal(r.slow[0].name, "Drought in Europe"); assert.equal(r.slow[1].ongoing_days, 1518);
  assert.equal(r.latest_update, "2026-11-17T06:10:00.000Z");
});
test("unsafe links are dropped; empty list is zero alerts; garbage is no data", () => {
  assert.equal(summarize(sample, NOW).fast[0].url, null);
  const e = summarize({ type: "FeatureCollection", features: [] }, NOW); assert.equal(e.ok, true); assert.equal(e.counts.fast, 0);
  for (const j of [null, {}, "error", { features: "x" }]) assert.equal(summarize(j, NOW).ok, false);
  assert.equal(parseEvent(null), null);
});
test("camelCase fields are accepted too", () => {
  const e = parseEvent(F({ eventType: "VO", eventId: 3, eventName: "Etna", alertLevel: "orange", fromDate: "2026-11-17T00:00:00" }));
  assert.equal(e.type, "VO"); assert.equal(e.alert, "Orange"); assert.equal(e.name, "Etna");
});
test("real GDACS feature from 17.11.2026 (sent by Grok)", () => {
  const f = { "type": "Feature", "bbox": [87.3, 12.0, 87.3, 12.0], "geometry": {"type": "Point", "coordinates": [87.3, 12.0]}, "properties": { "eventtype": "TC", "eventid": 1001351, "episodeid": 3, "eventname": "AKVAN-26", "glide": "", "name": "Tropical Cyclone AKVAN-26", "description": "Tropical Cyclone AKVAN-26", "htmldescription": "Orange Tropical Cyclone AKVAN-26 in India from: 16 Nov 2026 to: 17 Nov 2026 .", "icon": "https://www.gdacs.org/images/gdacs_icons/maps/Orange/TC.png", "iconoverall": "https://www.gdacs.org/images/gdacs_icons/maps/Orange/TC.png", "url": { "geometry": "https://www.gdacs.org/gdacsapi/api/polygons/getgeometry?eventtype=TC&eventid=1001351&episodeid=3", "report": "https://www.gdacs.org/report.aspx?eventid=1001351&episodeid=3&eventtype=TC", "details": "https://www.gdacs.org/gdacsapi/api/events/geteventdata?eventtype=TC&eventid=1001351" }, "alertlevel": "Orange", "alertscore": 2, "episodealertlevel": "Orange", "episodealertscore": 2.0, "istemporary": "false", "iscurrent": "true", "country": "India", "fromdate": "2026-11-16T18:00:00", "todate": "2026-11-17T06:00:00", "datemodified": "2026-11-17T08:50:11", "iso3": "IND", "source": "JTWC", "sourceid": "", "polygonlabel": "Centroid", "Class": "Point_Centroid", "countryonland": "", "affectedcountries": [{"iso2": "IN", "iso3": "IND", "countryname": "India"}], "severitydata": { "severity": 92.592, "severitytext": "Tropical Storm (maximum wind speed of 93 km/h)", "severityunit": "km/h" } } };
  const r = summarize({ type: "FeatureCollection", features: [f] }, NOW);
  assert.equal(r.ok, true); assert.equal(r.counts.fast, 1);
  const e = r.fast[0];
  assert.deepEqual([e.id, e.type, e.alert, e.name, e.from, e.modified, e.severity, e.url], ["TC-1001351-3", "TC", "Orange", "Tropical Cyclone AKVAN-26", "2026-11-16T18:00:00.000Z", "2026-11-17T08:50:11.000Z", "Tropical Storm (maximum wind speed of 93 km/h)", "https://www.gdacs.org/report.aspx?eventid=1001351&episodeid=3&eventtype=TC"]);
  assert.deepEqual(e.countries, ["India"]); assert.deepEqual(e.point, { lon: 87.3, lat: 12 });
});
