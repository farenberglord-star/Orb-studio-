// Тренировка на прошлом («день рождения психолога», 24.11.2026): заголовки — наш пересказ событий того дня в стиле газет,
// исход известен из истории. Тест фиксирует, что паспорт должен сказать. Пропуски паспорта помечены todo: когда правило
// починят, todo снимается. Число todo — мера того, сколько ещё «прокачивать». Источник: CLAUDE.md, раздел тренировки.
import { test } from "node:test";
import assert from "node:assert/strict";
import { newsPassport } from "../src/passport.js";
const P = (h, v) => newsPassport({ headline: h, confirm: v });
const DRILL = [
  { h: "US Treasury to issue smaller banknotes by spring 1928, Mellon says", v: 5, then: "issued July 1929", ok: (p) => p.confidence !== "high" && p.fired.includes("not_event") },
  { h: "Britain breaks off relations with Soviet Union; Moscow warns of war danger", v: 5, then: "no war; relations restored 1929", ok: (p) => p.fired.includes("not_event") },
  { h: "Fighting breaks out in Shanghai as Japanese marines land", v: 5, then: "fighting until the 5 May ceasefire", ok: (p) => p.speech_act === "event" },
  { h: "General Ding Chao's forces take Harbin", v: 2, then: "lost to the Japanese army within a week", ok: (p) => p.confidence !== "high" },
  { h: "Hitler opens Olympic Games in Berlin before 100,000", v: 5, then: "the opening happened (the showcase is beyond the headline)", ok: (p) => p.speech_act === "event" },
  { h: "About 5,000 Maori marchers reach Parliament in Wellington", v: 3, then: "true; Waitangi Tribunal the same year", ok: (p) => p.confidence !== "low" },
  { h: "Treasury releases first dollar coin without silver", v: 2, then: "true by specification", ok: (p) => p.confidence !== "low" },
  { h: "France declares neutrality in Spanish Civil War", v: 4, then: "a declaration; non-intervention was broken by others", ok: (p) => p.fired.includes("not_event") },
  { h: "Trudeau announces wage and price controls to fight inflation", v: 5, then: "in force 1975–1978, effect disputed", ok: (p) => p.fired.includes("not_event") },
  { h: "Sudden crisis in Berlin: Chancellor Brüning resigns", v: 5, then: "built up over months", ok: (p) => p.fired.includes("tone") || p.fired.includes("extraordinary") },
  { h: "Al Jolson signed for The Jazz Singer, the first talking picture", v: 3, then: "'first' only by one definition", ok: (p) => p.say.some((s) => /definition/i.test(s)) },
];
for (const d of DRILL) test(`history drill: ${d.h}`, d.todo ? { todo: d.todo } : {}, () => assert.ok(d.ok(P(d.h, d.v)), `${d.then}`));
