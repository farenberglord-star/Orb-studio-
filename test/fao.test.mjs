import test from "node:test"; import assert from "node:assert/strict";
import { findCsvUrl, month, parseCsv, summarize } from "../src/fao.js";
test("csv link: food index, not fish, relative links resolved", () => {
  const html = `<a href="/fishery/static/fishpriceindex/FAO_fish_price_index_Sep2026.csv">fish</a>
    <a href="/media/docs/worldfoodsituationlibraries/default-document-library/food_price_indices_data_nov.xlsx">Excel</a>
    <a href="/media/docs/worldfoodsituationlibraries/default-document-library/food_price_indices_data_csv_nov.csv?sfvrsn=1&amp;x=2">CSV</a>`;
  assert.equal(findCsvUrl(html), "https://www.fao.org/media/docs/worldfoodsituationlibraries/default-document-library/food_price_indices_data_csv_nov.csv?sfvrsn=1&x=2");
  assert.equal(findCsvUrl('<a href="https://evil.example/food_price.csv">x</a>'), null);
  assert.equal(findCsvUrl(""), null);
});
test("month formats", () => {
  assert.deepEqual(["1990-01", "2026-09-01", "09/2026", "9/1/2026", "Sep-26", "Sep 2026", "Jan-90", "x", "13/2026"].map(month), ["1990-01", "2026-09", "2026-09", "2026-09", "2026-09", "2026-09", "1990-01", null, null]);
});
// Сентябрь 2026 = 136,0, рост на 2,0 пункта к пересмотренному августу (пресс-релиз FAO от 02.10.2026). Остальные значения тестовые.
const CSV = `"FAO Food Price Index"
"2014-2016 = 100"
Date,Food Price Index,Meat,Dairy,Cereals,Oils,Sugar
2025-09,128.8,127.8,142.0,105.6,167.9,99.4
2026-07,133.1,131.0,125.0,112.0,180.0,105.0
2026-08,134.0,131.5,124.1,113.2,182.4,107.5
2026-09,136.0,131.9,123.0,115.0,186.0,114.0
,,,,,,
"Note: the meat index of the last month is provisional"`;
test("parse and summarize", () => {
  const rows = parseCsv(CSV); assert.equal(rows.length, 4); assert.equal(rows[3].month, "2026-09");
  const s = summarize(rows, "https://www.fao.org/x.csv");
  assert.equal(s.ok, true); assert.equal(s.value, 136); assert.equal(s.change_mm_points, 2); assert.equal(s.change_mm_pct, 1.5); assert.equal(s.change_yy_pct, 5.6);
  assert.equal(s.subindices.sugar.value, 114); assert.equal(s.subindices.sugar.change_mm_pct, 6); assert.equal(s.series.length, 4);
});
test("other header layouts and broken input", () => {
  const alt = `Month;FFPI;Meat;Dairy;Cereals;Vegetable Oils;Sugar\n09/2026;136,0;131,9;123,0;115,0;186,0;114,0\n08/2026;134,0;;;;;`;
  const r = parseCsv(alt); assert.equal(r[1].food, 136); assert.equal(r[1].oils, 186); assert.equal(r[0].meat, null);
  assert.equal(parseCsv("hello,world\n1,2"), null); assert.equal(parseCsv(""), null);
  assert.equal(summarize(null).ok, false); assert.equal(summarize([{ month: "2026-09", food: 1 }]).ok, false);
});
