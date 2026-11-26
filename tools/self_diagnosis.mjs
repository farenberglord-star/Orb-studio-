// Самодиагностика структуры Orb Studio: кристаллы → мостики → датчики → строки паспорта.
// Жёсткие нарушения (hard) — ошибка в проводке, тест падает. Мягкие (soft) — вопрос владельцу, тест не падает.
// Запуск: node tools/self_diagnosis.mjs  (печатает отчёт; --md пишет docs/self-diagnosis.md)
import { readFileSync, writeFileSync } from "node:fs";
import { CRYSTALS, CRYSTAL_ZONES } from "../src/crystals.js";
import { CRYSTAL_BRIDGES } from "../src/crystal_bridges.js";
import { SCIENTISTS } from "../src/scientists.js";
import { TIME_MACHINE } from "../src/timemachine.js";
import { PASSPORT_TABLE } from "../src/news.js";

export function diagnose(now = Date.now()) {
  const worker = readFileSync(new URL("../src/worker.js", import.meta.url), "utf8");
  const crystalIds = new Set(CRYSTALS.map((c) => c.id)), sensorIds = new Set(SCIENTISTS.map((s) => s.id));
  const known = new Set([...crystalIds, ...sensorIds, ...TIME_MACHINE.map((t) => t.id), "trackrecord"]);
  const hard = [], soft = [];
  const H = (rule, what) => hard.push({ rule, what }), S = (rule, what) => soft.push({ rule, what });
  // 1. Каждая карточка живёт в одной из 8 зон, id не повторяются.
  const seen = new Set();
  for (const c of CRYSTALS) { if (seen.has(c.id)) H("unique_card", c.id); seen.add(c.id); if (!CRYSTAL_ZONES.includes(c.zone)) H("card_zone", c.id + " → " + c.zone); }
  // 2. Мостик: карточки существуют, 2–6 штук, id уникальны, ожидающий имеет дату, статус выше idea называет число.
  const bseen = new Set(), noNumber = [], big = [];
  for (const b of CRYSTAL_BRIDGES) {
    if (bseen.has(b.id)) H("unique_bridge", b.id); bseen.add(b.id);
    for (const k of b.cards) if (!known.has(k)) H("bridge_card_exists", b.id + " → " + k);
    if (b.cards.length < 2 || b.cards.length > 6) big.push(b.id + "=" + b.cards.length);
    if (b.status === "waiting" && !/^2026-\d\d-\d\d$/.test(String(b.until || ""))) H("waiting_has_date", b.id);
    if (b.status === "waiting" && b.until && Date.parse(b.until) < now) S("waiting_overdue", b.id + " ждал до " + b.until);
    if (["sensor", "line", "covered"].includes(b.status) && !b.number && !b.sensor) noNumber.push(b.id);
    if (b.status === "sensor" && b.sensor && !sensorIds.has(b.sensor) && !worker.includes('name: "get_' + b.sensor + '"')) H("bridge_sensor_exists", b.id + " → " + b.sensor);
  }
  if (big.length) S("bridge_size_2_to_6", big.join(", "));
  if (noNumber.length) S("working_bridge_names_number", noNumber.length + " рабочих мостиков без поля number (правило CLAUDE.md), например " + noNumber.slice(0, 6).join(", "));
  // 3. Строка паспорта: кристаллы существуют; датчик «live» объявлен в воркере как MCP-инструмент.
  for (const t of PASSPORT_TABLE) {
    for (const k of t.crystals || []) if (!known.has(k)) H("passport_crystal_exists", t.line + " → " + k);
    if (t.status === "live" && t.sensor && t.sensor.tool && !worker.includes('name: "' + t.sensor.tool + '"')) H("passport_tool_registered", t.line + " → " + t.sensor.tool);
    if (t.status === "live" && !(t.crystals || []).length) S("live_line_without_crystal", t.line);
  }
  // 4. Датчики учёных: у каждого есть карточка или запись машины времени (честь имени).
  for (const s of SCIENTISTS) if (!known.has(s.id)) S("sensor_has_card", s.id);
  // 5. Карточка «covered» (покрыта) должна быть достижима: назван датчик или мостик.
  const inBridge = new Set(CRYSTAL_BRIDGES.flatMap((b) => b.cards));
  const orphans = CRYSTALS.filter((c) => !inBridge.has(c.id) && !sensorIds.has(c.id));
  const coveredNoRef = CRYSTALS.filter((c) => c.needs && c.needs.code === "covered" && !inBridge.has(c.id) && !sensorIds.has(c.id));
  if (coveredNoRef.length) S("covered_card_not_in_bridge_or_sensor", coveredNoRef.length + " карточек, например " + coveredNoRef.slice(0, 5).map((c) => c.id).join(", "));
  // 6. Баланс зон: разрыв между самой полной и самой пустой зоной.
  const zones = Object.fromEntries(CRYSTAL_ZONES.map((z) => [z, CRYSTALS.filter((c) => c.zone === z).length]));
  const vals = Object.values(zones), spread = Math.max(...vals) - Math.min(...vals);
  if (spread > 50) S("zone_balance", "разрыв " + spread + ": " + JSON.stringify(zones));
  // 7. Мостиков в зоне против карточек в зоне — где карточек много, а мостиков нет.
  const bz = Object.fromEntries(CRYSTAL_ZONES.map((z) => [z, CRYSTAL_BRIDGES.filter((b) => b.zone === z).length]));
  // 8. Логика статусов: мостик «работает», а все его карточки ждут идеи — или мостик «идея», а все карточки уже покрыты.
  const code = new Map(CRYSTALS.map((c) => [c.id, c.needs && c.needs.code]));
  const liar = [], stale = [];
  for (const b of CRYSTAL_BRIDGES) {
    const own = b.cards.filter((k) => code.has(k)); if (!own.length) continue;
    if (["sensor", "line", "covered"].includes(b.status) && own.every((k) => code.get(k) === "needs_idea")) liar.push(b.id);
    if (b.status === "idea" && own.every((k) => code.get(k) === "covered")) stale.push(b.id);
  }
  if (liar.length) S("working_bridge_but_all_cards_need_idea", liar.length + ": " + liar.slice(0, 6).join(", "));
  if (stale.length) S("idea_bridge_but_all_cards_covered", stale.length + ": " + stale.slice(0, 6).join(", "));
  return { cards: CRYSTALS.length, bridges: CRYSTAL_BRIDGES.length, sensors: SCIENTISTS.length, passport_lines: PASSPORT_TABLE.length, zones, bridges_per_zone: bz,
    no_number: noNumber, orphans: orphans.length, orphan_share_pct: Math.round((100 * orphans.length) / CRYSTALS.length), hard, soft };
}

if (process.argv[1] && process.argv[1].endsWith("self_diagnosis.mjs")) {
  const r = diagnose();
  const lines = [`# Самодиагностика структуры (${new Date().toISOString().slice(0, 10)})`, "",
    `Карточек ${r.cards}, мостиков ${r.bridges}, датчиков учёных ${r.sensors}, строк паспорта ${r.passport_lines}.`,
    `Карточек вне мостиков и датчиков: ${r.orphans} (${r.orphan_share_pct} %).`, "",
    "## Зоны (карточек / мостиков)", ...Object.keys(r.zones).map((z) => `- ${z}: ${r.zones[z]} / ${r.bridges_per_zone[z]}`), "",
    `## Жёсткие нарушения: ${r.hard.length}`, ...r.hard.map((x) => `- ${x.rule}: ${x.what}`), "",
    `## Вопросы владельцу (мягкие): ${r.soft.length}`, ...r.soft.map((x) => `- ${x.rule}: ${x.what}`), ""];
  const out = lines.join("\n");
  if (process.argv.includes("--md")) {
    const bs = new Map(CRYSTAL_BRIDGES.map((b) => [b.id, b]));
    writeFileSync(new URL("../docs/bridges-without-number.txt", import.meta.url), r.no_number.join("\n") + "\n");
    writeFileSync(new URL("../docs/bridges-without-number.md", import.meta.url), ["# Рабочие мостики без поля number (на " + new Date().toISOString().slice(0, 10) + ")", "",
      "Правило CLAUDE.md: у мостика выше idea указывать number — что мерить, откуда, как часто. Новые такие мостики тест отклоняет; эти оставлены списком (docs/bridges-without-number.txt), по одному снимаются, когда число найдено.", "",
      ...r.no_number.map((id) => "- **" + id + "** (" + bs.get(id).status + "): " + String((bs.get(id).line || bs.get(id).needs || "—")).slice(0, 160))].join("\n") + "\n");
  }
  if (process.argv.includes("--md")) writeFileSync(new URL("../docs/self-diagnosis.md", import.meta.url), out);
  console.log(out);
}
