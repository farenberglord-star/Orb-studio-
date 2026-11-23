// «Тон в трёх измерениях» — свой маленький словарь Orb Studio (не научная норма, а короткий открытый список).
// Осгуд (1957): у слова три измерения — оценка (хорошо/плохо), сила (сильно/слабо), активность (быстро/медленно).
// Элиас (накал мешает знанию), Уоллас и Липпман (образ вместо довода), Вебер (факт ≠ оценка).
// У каждого слова: e — оценка (−1 плохо, +1 хорошо), p — сила (1 обычная, 2 сильная), a — активность (1 спокойное, 2 резкое).
// Буквальные слова тем (война, взрыв, землетрясение) сюда не входят: это предмет новости, а не накал. Метафоры — в METAPHOR паспорта.
const W = (re, e, p, a) => ({ re: new RegExp(`(?<![\\p{L}])(?:${re})(?![\\p{L}])`, "iu"), e, p, a });
export const TONE_WORDS = [
  // English
  W("catastroph\\p{L}*", -1, 2, 2), W("disaster\\p{L}*", -1, 2, 1), W("chaos|chaotic", -1, 2, 2), W("horror\\p{L}*|horrific\\p{L}*|horrendous", -1, 2, 1),
  W("devastat\\p{L}*", -1, 2, 2), W("nightmare\\p{L}*", -1, 2, 1), W("carnage|mayhem", -1, 2, 2), W("apocalyp\\p{L}*|doom\\p{L}*", -1, 2, 1),
  W("shock|shocks|shocked|shocking\\p{L}*", -1, 2, 2), W("stun|stuns|stunned", 0, 2, 2), W("panic\\p{L}*", -1, 2, 2), W("outrage\\p{L}*|fury|furious\\p{L}*", -1, 2, 2),
  W("scandal\\p{L}*", -1, 1, 1), W("brutal\\p{L}*|savage\\p{L}*", -1, 2, 2), W("slam|slams|slammed|slamming", -1, 1, 2), W("plunge|plunges|plunged|plunging|plummet\\p{L}*", -1, 1, 2),
  W("soar|soars|soared|soaring|skyrocket\\p{L}*", 1, 1, 2), W("frenzy|frenzied", -1, 1, 2), W("explosive", 0, 2, 2), W("dramatic\\p{L}*", 0, 1, 2),
  W("massive|huge|gigantic", 0, 1, 1), W("historic", 1, 1, 1), W("humiliat\\p{L}*", -1, 2, 1), W("crushing", -1, 2, 2),
  W("triumph\\p{L}*", 1, 2, 2), W("miracle\\p{L}*", 1, 2, 1), W("sensational\\p{L}*|stunning", 1, 2, 2), W("euphori\\p{L}*", 1, 2, 2),
  // Deutsch
  W("Katastroph\\p{L}*", -1, 2, 2), W("Chaos|chaotisch\\p{L}*", -1, 2, 2), W("Horror\\p{L}*", -1, 2, 1), W("Schock\\p{L}*|schockier\\p{L}*", -1, 2, 2),
  W("Panik\\p{L}*", -1, 2, 2), W("Wut\\p{L}*|wütend\\p{L}*|Empörung|empört\\p{L}*", -1, 2, 2), W("Skandal\\p{L}*", -1, 1, 1), W("Drama|dramatisch\\p{L}*", 0, 1, 2),
  W("brutal\\p{L}*", -1, 2, 2), W("massiv\\p{L}*|gigantisch\\p{L}*", 0, 1, 1), W("Albtraum\\p{L}*|Alptraum\\p{L}*", -1, 2, 1), W("Desaster\\p{L}*|Debakel\\p{L}*|Fiasko\\p{L}*", -1, 2, 1),
  W("Klatsche|Ohrfeige", -1, 1, 2), W("Eklat\\p{L}*", -1, 1, 2), W("Triumph\\p{L}*", 1, 2, 2), W("Sensation\\p{L}*|sensationell\\p{L}*", 1, 2, 2),
  W("Wahnsinn\\p{L}*|irre[nrs]?", 0, 2, 2), W("explodier\\p{L}*", 0, 1, 2), W("Horrorzahlen|Hammer", 0, 2, 2),
  // Русский
  W("катастроф\\p{L}*", -1, 2, 2), W("хаос\\p{L}*", -1, 2, 2), W("ужас\\p{L}*", -1, 2, 1), W("шок|шока|шоке|шоком|шокир\\p{L}*", -1, 2, 2),
  W("паник\\p{L}*", -1, 2, 2), W("ярост\\p{L}*|возмущ\\p{L}*", -1, 2, 2), W("скандал\\p{L}*", -1, 1, 1), W("драматич\\p{L}*", 0, 1, 2),
  W("кошмар\\p{L}*", -1, 2, 1), W("разгром\\p{L}*", -1, 2, 2), W("провал\\p{L}*|фиаско", -1, 2, 1), W("обвал\\p{L}*|рухн\\p{L}*", -1, 1, 2),
  W("взл[её]т\\p{L}*|взлетел\\p{L}*", 1, 1, 2), W("триумф\\p{L}*", 1, 2, 2), W("сенсаци\\p{L}*", 1, 2, 2), W("беспредел\\p{L}*|истери\\p{L}*", -1, 2, 2),
];
export function toneOf(headline) {
  const t = String(headline || ""), hits = [];
  const seen = new Set();
  for (const w of TONE_WORDS) { const m = t.match(w.re); if (m && !seen.has(m[0].toLowerCase())) { seen.add(m[0].toLowerCase()); hits.push({ word: m[0], e: w.e, p: w.p, a: w.a }); } }
  if (!hits.length) return null;
  const sum = (k) => hits.reduce((s, h) => s + h[k], 0), strong = hits.some((h) => h.p === 2);
  const ev = sum("e");
  return {
    words: hits.map((h) => h.word), loaded: hits.length >= 2 || strong,
    evaluation: ev < 0 ? "negative" : ev > 0 ? "positive" : "mixed", potency: strong ? "strong" : "moderate", activity: hits.some((h) => h.a === 2) ? "sharp" : "calm",
  };
}
export const TONE_NOTE = "Orb Studio's own short word list (about 70 entries in English, German and Russian), each marked for evaluation, potency and activity after Osgood; not a scientific norm. Literal topic words (war, explosion, earthquake) are not counted.";
