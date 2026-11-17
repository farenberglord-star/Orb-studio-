import test from "node:test"; import assert from "node:assert/strict";
import { splitTitle, parseItem, summarize } from "../src/who.js";
// Элемент из живого ответа ВОЗ 17.11.2026 (прислал Грок), длинные HTML-поля сокращены
const real = { "Id": "ee6cef15-98b8-4e07-b49a-f9c64c82a380", "LastModified": "2026-11-14T08:56:18Z", "PublicationDate": "2026-11-13T13:48:47Z", "UrlName": "2026-DON626", "ItemDefaultUrl": "/2026-DON626",
  "Summary": "On 29 October 2026, the National IHR Focal Point of the State of Qatar notified WHO…", "PublicationDateAndTime": "2026-11-13T19:00:00Z", "UseOverrideTitle": true, "Title": "Middle East respiratory syndrome (MERS) – Qatar", "OverrideTitle": "Middle East respiratory syndrome (MERS) – Qatar", "DonId": "2026-DON626" };
const NOW = Date.parse("2026-11-17T10:20:00Z");
test("title split", () => {
  assert.deepEqual(splitTitle("Middle East respiratory syndrome (MERS) – Qatar"), { disease: "Middle East respiratory syndrome (MERS)", place: "Qatar" });
  assert.deepEqual(splitTitle("Mpox: recombinant virus with genomic elements of clades Ib and IIb - Global"), { disease: "Mpox: recombinant virus with genomic elements of clades Ib and IIb", place: "Global" });
  assert.deepEqual(splitTitle("Seasonal influenza"), { disease: "Seasonal influenza", place: null });
});
test("real item", () => {
  const e = parseItem(real);
  assert.deepEqual(e, { id: "2026-DON626", title: "Middle East respiratory syndrome (MERS) – Qatar", disease: "Middle East respiratory syndrome (MERS)", place: "Qatar", published: "2026-11-13T13:48:47.000Z", url: "https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON626" });
});
test("summary, order, 30 days, bad input", () => {
  const r = summarize({ value: [{ ...real, DonId: "2026-DON600", UrlName: "2026-DON600", PublicationDate: "2026-09-01T00:00:00Z" }, real, { Title: "x" }, { ...real }] }, NOW);
  assert.equal(r.ok, true); assert.equal(r.items.length, 2); assert.equal(r.items[0].id, "2026-DON626"); assert.equal(r.count_30d, 1); assert.equal(r.latest_published, "2026-11-13T13:48:47.000Z");
  assert.equal(summarize({}).ok, false); assert.equal(summarize(null).ok, false);
  assert.equal(parseItem({ ...real, UrlName: "../evil", DonId: null }).url, null);
});
