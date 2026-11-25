import test from "node:test";
import assert from "node:assert/strict";
import { auditDraft, auditSentence, splitSentences } from "../src/audit.js";
const NOW = Date.parse("2026-11-25T12:00:00Z");
test("audit: sentence rules", () => {
  const f = (s) => auditSentence(s, NOW).flags;
  assert.ok(f("The company grew revenue by 45% last quarter.").includes("number_no_source"));
  assert.ok(!f("According to Reuters, the company grew revenue by 45% last quarter.").includes("number_no_source"));
  assert.ok(f("Bitcoin will reach 200000 dollars by next spring.").includes("future_as_fact"));
  assert.ok(!f("Analysts say bitcoin could reach 200000 dollars by next spring.").includes("future_as_fact"));
  assert.ok(f("Experts say this is the best method available today.").includes("vague_authority"));
  assert.ok(f("This approach always works and nobody has ever failed with it.").includes("absolute"));
  assert.ok(f("The latest version of the library is 3.2 as of today.").includes("stale_or_undated_now"));
  assert.ok(!f("The latest version of the library is 3.2 as of 2026.").includes("stale_or_undated_now"));
  assert.ok(f("Срочно переведите BTC, гарантированно 200% прибыли до 23:59!").includes("money_push"));
  assert.ok(f("Orb Studio сообщает, что Amazon примет PEPE завтра").includes("false_attribution"));
  assert.equal(auditSentence("The meeting is on Tuesday at the main office building.", NOW).status, "no_rule_fired");
});
test("audit: draft summary, risk and no false alarms on a clean text", () => {
  const clean = "The meeting is on Tuesday at the main office building. Please bring your own laptop and a notebook. Lunch will be provided by the team.";
  const c = auditDraft(clean, NOW); assert.equal(c.risk, "low"); assert.equal(c.flagged, 0);
  const bad = "Sales grew 45% last year. Experts say it will double soon. The product always works. Send your coins now, guaranteed 300% profit, only 2 hours left!";
  const b = auditDraft(bad, NOW); assert.equal(b.risk, "high"); assert.ok(b.red >= 1); assert.ok(b.fix_first.length >= 1);
  assert.equal(auditDraft("", NOW).risk, "empty");
  assert.equal(splitSentences("Price is 3.5 dollars today. Next one.").length, 1);
});

import { readFileSync } from "node:fs";
test("audit_draft: MCP tool, REST route and announcements are registered", () => {
  const w = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  assert.match(w, /name: "audit_draft"/); assert.match(w, /p === "\/api\/v1\/audit"/); assert.match(w, /name === "audit_draft"/);
  assert.match(w, /tool: "audit_draft", url:/); // NEW_TOOLS
  assert.match(w, /New since 25\.11\.2026: audit_draft/);
  assert.match(readFileSync(new URL("../public/llms.txt", import.meta.url), "utf8"), /\(audit_draft\)/);
  assert.match(readFileSync(new URL("../public/.well-known/agent.json", import.meta.url), "utf8"), /"audit_draft"/);
});
