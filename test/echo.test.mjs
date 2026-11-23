import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { echoGroups, agencyOf } from "../src/echo.js";

test("agency tag in snippet, source or headline", () => {
  assert.equal(agencyOf({ description: "Berlin (dpa) - Die Bundesregierung will..." }), "dpa");
  assert.equal(agencyOf({ source: "Reuters" }), "Reuters");
  assert.equal(agencyOf({ title: "Fed holds rates, AP reports" }), "AP");
  assert.equal(agencyOf({ title: "Apple opens a new store", description: "The company said..." }), null);
  assert.equal(agencyOf({ title: "MAP of the region" }), null);
});

test("five reprints of one dpa text are one voice", () => {
  const o = ["Spiegel", "Zeit", "Stern", "NDR", "SZ"].map((x, i) => ({ outlet: x, title: "Regierung plant neue Regeln für Mieten " + i, description: "Berlin (dpa) - Die Regierung..." }));
  const r = echoGroups(o);
  assert.equal(r.outlets_found, 5); assert.equal(r.independent_voices, 1); assert.equal(r.verdict, "one_voice");
  assert.equal(r.echo_groups[0].agency, "dpa"); assert.equal(r.echo_groups[0].outlets.length, 5);
});

test("near-identical headlines without tag merge; own headlines stay apart", () => {
  const r = echoGroups([
    { outlet: "A", title: "Bahn streicht Hunderte Züge wegen Sturm im Norden" },
    { outlet: "B", title: "Bahn streicht Hunderte Züge wegen Sturm im Norden – Live" },
    { outlet: "C", title: "Orkan legt Fernverkehr zwischen Hamburg und Berlin lahm" },
  ]);
  assert.equal(r.independent_voices, 2); assert.equal(r.verdict, "partly_echo");
  assert.equal(r.echo_groups[0].why, "near_identical_title");
});

test("independent outlets", () => {
  const r = echoGroups([{ outlet: "A", title: "One thing happened today here" }, { outlet: "B", title: "Totally different wording about it" }]);
  assert.equal(r.verdict, "independent"); assert.equal(r.independent_voices, 2);
  assert.equal(echoGroups([]).verdict, "none");
});

test("check_headline uses independent voices for its verdict", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /import \{ echoGroups, agencyOf, ECHO_EXPLAIN, ECHO_RULE, fourValued \} from "\.\/echo\.js"/);
  assert.match(w, /v = echo\.independent_voices, verdict = .*v >= 3 \? "confirmed"/);
  assert.match(w, /independent_voices: echo\.independent_voices/);
  assert.match(w, /chk-v6-/); assert.match(w, /sources_agree: searched \? fourValued\(raws\)/);
});

import { fourValued } from "../src/echo.js";
test("Belnap-Dunn four values over outlets", () => {
  assert.equal(fourValued([]).value, "neither");
  assert.equal(fourValued([{ outlet: "A", title: "Minister resigns" }, { outlet: "B", title: "Minister resigns after scandal" }]).value, "affirmed");
  assert.equal(fourValued([{ outlet: "A", title: "Minister resigns" }, { outlet: "B", title: "Ministry denies minister resigned" }]).value, "both");
  assert.equal(fourValued([{ outlet: "A", title: "Kreml dementiert Bericht" }]).value, "denied");
  assert.equal(fourValued([{ outlet: "A", title: "МИД опроверг сообщения" }, { outlet: "B", title: "Сообщения о встрече" }]).value, "both");
});
