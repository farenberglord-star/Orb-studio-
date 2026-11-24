// Тренировка на прошлом («день рождения психолога», 24.11.2026): заголовки — наш пересказ событий того дня в стиле газет,
// исход известен из истории. Тест фиксирует, что паспорт должен сказать. Пропуски паспорта помечены todo: когда правило
// починят, todo снимается. Число todo — мера того, сколько ещё «прокачивать». Источник: docs/claude-log.md, раздел тренировки.
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
// Партия Грока 24.11.2026: подлинные заголовки из газетных архивов (дата, газета), исход известен
const ARCHIVE = [
  { h: "PASSENGERS ARE REPORTED SAFE", v: 5, src: "Eugene Daily Guard, 15.04.1912 — Titanic; ~1500 died, two radio messages merged (Bartlett)", ok: (p) => p.confidence !== "high" && p.fired.includes("not_event") },
  { h: "Windshield Vandals Reported in Seattle", v: 2, src: "Seattle P-I, 15.04.1954 — ordinary wear (Sherif)", ok: (p) => p.fired.includes("not_event") },
  { h: "AMUNDSEN STANDS BY COOK; Believes He Was Honest", v: 2, src: "NYT 22.12.1909 — Cook's claim rejected (Lee Ross)", ok: (p) => p.fired.includes("not_event") },
  { h: "Is Beatle Paul McCartney Dead?", v: 1, src: "Times-Delphic 17.09.1969 — alive (Cartwright, Wegner)", ok: (p) => p.speech_act === "question" && p.confidence === "low" },
  { h: "HAS MAN REACHED THE POLE?", v: 3, src: "NYT 02.09.1909 — no proof found (Wegner)", ok: (p) => p.speech_act === "question" },
  { h: "DEWEY DEFEATS TRUMAN", v: 1, src: "Chicago Daily Tribune 03.11.1948 — Truman won (Einhorn)", ok: (p) => p.confidence === "low" },
  { h: "37 Who Saw Murder Didn't Call the Police", v: 1, src: "NYT 27.03.1964 — greatly exaggerated (Darley)", ok: (p) => p.confidence !== "high" },
  { h: '"ANESTHETIC PROWLER" ON LOOSE', v: 1, src: "Mattoon Journal-Gazette 02.09.1944 — no gas, no culprit (Schachter)", ok: (p) => p.confidence === "low" },
  { h: "Berlin's Wonderful Horse; He Can Do Almost Everything but Talk", v: 1, src: "NYT 04.09.1904 — Clever Hans read cues (Heider)", ok: (p) => p.confidence !== "high" },
  { h: "Radio Listeners in Panic, Taking War Drama as Fact", v: 5, src: "NYT 31.10.1938 — panic exaggerated (Milgram)", ok: (p) => p.fired.includes("tone") },
  { h: "DARWIN THEORY IS PROVED TRUE; English Scientists Say the Skull Found in Sussex Establishes Human Descent from Apes", v: 3, src: "NYT 22.12.1912 — Piltdown hoax, exposed 1953 (Kunda)", ok: (p) => p.fired.includes("not_event") },
  { h: "The Shuttle Explodes; 6 in Crew and High-School Teacher Are Killed 74 Seconds After Liftoff", v: 5, src: "NYT 29.01.1986 — true (Neisser: the memories, not the headline, went wrong)", ok: (p) => p.speech_act === "event" && p.confidence !== "low" },
];
for (const d of ARCHIVE) test(`archive drill: ${d.h}`, () => assert.ok(d.ok(P(d.h, d.v)), d.src));
// Партия Грока «исследователи новостей» 24.11.2026: подлинные заголовки
const MEDIA = [
  { h: "LANDON LEADS 4-3 IN LAST DIGEST POLL; Final Tabulation Gives Him 370 Electoral Votes to 161 for President Roosevelt", v: 3, src: "NYT 30.10.1936 — Roosevelt won 523 to 8 (Huff)", ok: (p) => p.confidence !== "high" && p.fired.includes("poll") && p.say.some((s) => /margin of error/.test(s)) },
  { h: "Radiation Is Released in Accident At Nuclear Plant in Pennsylvania", v: 5, src: "NYT 29.03.1979 — Three Mile Island, true (Gamson); English 'plant' must not read as German 'plant' (plans)", ok: (p) => p.speech_act === "event" },
  { h: "News Deliverers to Strike At Midnight on 11 Papers", v: 3, src: "NYT 30.06.1945 — a planned strike, not yet begun (Berelson)", ok: (p) => p.fired.includes("not_event") },
  { h: 'Group of Girls Puff at Cigarettes as a Gesture of "Freedom"', v: 2, src: "NYT 01.04.1929 — staged by Bernays for American Tobacco (Boorstin)", ok: (p) => p.fired.includes("quoted") },
];
for (const d of MEDIA) test(`media drill: ${d.h}`, () => assert.ok(d.ok(P(d.h, d.v)), d.src));
test("German 'plant' still reads as a plan, English 'drones to strike two ships' stays an event", () => {
  assert.ok(P("Regierung plant neue Steuer auf Kerosin", 3).fired.includes("not_event"));
  assert.equal(P("Ukraine used naval drones to strike two Russian ships", 3).speech_act, "event");
});
// Партия Грока «профессии проверки» 24.11.2026: подлинные заголовки
const CHECKERS = [
  { h: "1440 Map Depicts the New World", v: 3, src: "NYT 11.10.1965 — Vinland Map, anatase ink from the 1920s (McCrone)", ok: (p) => p.fired.includes("found_document") && p.confidence !== "high" },
  { h: "THE DIARIES OF HITLER ARE REPORTED FOUND BY GERMAN WEEKLY", v: 4, src: "NYT 23.04.1983 — forged (Langlois and Seignobos)", ok: (p) => p.fired.includes("found_document") && p.fired.includes("not_event") },
  { h: "SALES RISE RAPIDLY IN KREUGER STOCK; CONCERNS DECLARED SOUND", v: 3, src: "NYT 13.03.1932 — books 'grossly wrong' three weeks later (Ripley)", ok: (p) => p.fired.includes("not_event") },
  { h: "Polish and U.S. Translations Differ", v: 2, src: "NYT 01.01.1978 — Carter's Warsaw interpreter (Reiss)", ok: (p) => p.say.some((s) => /translation/.test(s)) },
  { h: "MARTIANS BUILD TWO IMMENSE CANALS IN TWO YEARS", v: 1, src: "NYT 27.08.1911 — 'canali' mistranslated, optical illusion (Nida)", ok: (p) => p.confidence === "low" },
  { h: "STORM MOVES ON JERSEY; It Will Hit Southern Part of State by Tonight, Bureau Reports", v: 4, src: "NYT 21.09.1938 — the hurricane hit Long Island and New England (G. K. Gilbert)", ok: (p) => p.fired.includes("not_event") },
];
for (const d of CHECKERS) test(`checkers drill: ${d.h}`, () => assert.ok(d.ok(P(d.h, d.v)), d.src));
