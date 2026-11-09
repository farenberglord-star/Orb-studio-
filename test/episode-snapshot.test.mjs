import test from "node:test";
import assert from "node:assert/strict";
import { episodeSnapshot } from "../src/episode-snapshot.js";

const snap = { day: "2026-11-05", saved_at: "2026-11-05T09:00:00.000Z", radars: [
  { id: "crypto", title: "Crypto", risk_index: 42, delta_24h: -3, headlines: [{ title: "H1", source: "S", link: "https://x.example/1" }, { title: "H2" }] },
  { id: "energy", title: "Energy", risk_index: 17, delta_24h: 0, headlines: [] }] };

test("snapshot of an episode day: radars, top headline, honest precision note", () => {
  const s = episodeSnapshot(snap, "2026-11-05");
  assert.equal(s.radars.length, 2);
  assert.equal(s.radars[0].top_headline.title, "H1");
  assert.equal(s.radars[1].top_headline, null);
  assert.match(s.precision, /daily snapshot/);
  assert.equal(s.full_snapshot, "https://orbstudio.org/api/v1/history?date=2026-11-05");
});
test("no snapshot for that day → null, nothing invented", () => {
  assert.equal(episodeSnapshot(null, "2026-11-05"), null);
  assert.equal(episodeSnapshot({ radars: [] }, "2026-11-05"), null);
});
