import test from "node:test"; import assert from "node:assert/strict";
import { parseBafin, sectorOf } from "../src/bafin.js";
const it = (title, link, d) => `<item><title><![CDATA[${title}]]></title><link>${link}</link><pubDate>${d}</pubDate><description>Beschreibung &amp; Text</description></item>`;
const xml = `<?xml version="1.0"?><rss version="2.0"><channel><ttl>60</ttl>`
 + it("Maßnahme gegen die Muster Versicherung AG", "https://www.bafin.de/DE/Aufsicht/VAG/x_1.html", "Mon, 09 Nov 2026 06:00:00 +0100")
 + it("Bußgeld wegen Geldwäsche gegen Muster Bank", "https://www.bafin.de/DE/Aufsicht/60b_KWG_84_WpIG_und_57_GwG/b_2.html", "Fri, 06 Nov 2026 06:00:00 +0100")
 + it("Maßnahme gegen Herrn X", "https://www.bafin.de/DE/Aufsicht/40c_neu_124_WpHG/c_anonym_3.html", "Thu, 05 Nov 2026 06:00:00 +0100")
 + it("Maßnahme gegen einen Geschäftsleiter", "https://www.bafin.de/DE/Aufsicht/other/d_4.html", "Thu, 05 Nov 2026 07:00:00 +0100")
 + it("Doppelt", "https://www.bafin.de/DE/Aufsicht/VAG/x_1.html", "Mon, 09 Nov 2026 06:00:00 +0100")
 + it("Fremder Link", "https://evil.example/x", "Mon, 09 Nov 2026 06:00:00 +0100")
 + it("Sonstiges", "https://www.bafin.de/DE/Aufsicht/y_5.html", "Wed, 04 Nov 2026 06:00:00 +0100")
 + `</channel></rss>`;
test("parse, sectors, dedupe, withhold natural persons", () => {
  const r = parseBafin(xml);
  assert.equal(r.ok, true); assert.equal(r.count_in_feed, 3); assert.equal(r.withheld_personal_count, 2);
  assert.equal(r.latest_published, "2026-11-09T05:00:00.000Z");
  assert.deepEqual(r.items.map((x) => x.sector), ["insurance", "banking_aml", "other"]);
  assert.deepEqual(r.by_sector_in_feed, { insurance: 1, banking_aml: 1, other: 1 });
  assert.match(r.items[0].source, /bafin\.de/); assert.equal(r.items[0].title, "Maßnahme gegen die Muster Versicherung AG");
});
test("sectorOf and bad input", () => {
  assert.equal(sectorOf("https://www.bafin.de/DE/Aufsicht/40c_neu_124_WpHG/a.html"), "securities_disclosure");
  assert.equal(parseBafin("<html>no feed</html>").ok, false); assert.equal(parseBafin(null).ok, false);
  assert.equal(parseBafin("<rss><channel></channel></rss>").ok, false);
});
