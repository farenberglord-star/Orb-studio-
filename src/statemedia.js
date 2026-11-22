// Государственные СМИ (под контролем правительства, не общественные вещатели вроде BBC или DW).
// Их заголовки радары читают, чтобы видеть официальную позицию Москвы и Пекина, но всегда с пометкой —
// на сайте, в API и в эфире Давид называет источник государственным.
export const STATE_MEDIA = [
  { id: "tass", re: /(?<![\p{L}])(tass|тасс)(?![\p{L}])|tass\.(com|ru)/iu, country: "RU", name: { en: "TASS", de: "TASS", ru: "ТАСС" }, kind: { en: "Russian state news agency", de: "russische staatliche Nachrichtenagentur", ru: "российское государственное агентство" } },
  { id: "ria", re: /(?<![\p{L}])(ria novosti|риа новости)(?![\p{L}])|ria\.ru/iu, country: "RU", name: { en: "RIA Novosti", de: "RIA Nowosti", ru: "РИА Новости" }, kind: { en: "Russian state news agency", de: "russische staatliche Nachrichtenagentur", ru: "российское государственное агентство" } },
  { id: "rt", re: /(?<![\p{L}])(rt|russia today)(?![\p{L}])|(?<![\p{L}.])rt\.com/iu, country: "RU", name: { en: "RT", de: "RT", ru: "RT" }, kind: { en: "Russian state broadcaster", de: "russischer Staatssender", ru: "российский государственный канал" } },
  { id: "cgtn", re: /(?<![\p{L}])cgtn(?![\p{L}])|cgtn\.com/iu, country: "CN", name: { en: "CGTN", de: "CGTN", ru: "CGTN" }, kind: { en: "Chinese state broadcaster", de: "chinesischer Staatssender", ru: "китайский государственный канал" } },
  { id: "xinhua", re: /(?<![\p{L}])(xinhua|синьхуа)(?![\p{L}])|xinhuanet\.com|news\.cn/iu, country: "CN", name: { en: "Xinhua", de: "Xinhua", ru: "Синьхуа" }, kind: { en: "Chinese state news agency", de: "chinesische staatliche Nachrichtenagentur", ru: "китайское государственное агентство" } },
  { id: "chinadaily", re: /(?<![\p{L}])china daily(?![\p{L}])|chinadaily\.com\.cn/iu, country: "CN", name: { en: "China Daily", de: "China Daily", ru: "China Daily" }, kind: { en: "Chinese state newspaper", de: "chinesische Staatszeitung", ru: "китайская государственная газета" } },
  { id: "globaltimes", re: /(?<![\p{L}])global times(?![\p{L}])|globaltimes\.cn/iu, country: "CN", name: { en: "Global Times", de: "Global Times", ru: "Global Times" }, kind: { en: "Chinese state newspaper", de: "chinesische Staatszeitung", ru: "китайская государственная газета" } },
];
export function stateMediaOf(source, link) {
  const s = String(source || ""), l = String(link || "");
  for (const m of STATE_MEDIA) if (m.re.test(s) || m.re.test(l)) return m;
  return null;
}
// поля для API: { state_media: "TASS — Russian state news agency" }
export function stateTag(source, link) { const m = stateMediaOf(source, link); return m ? { state_media: `${m.name.en} — ${m.kind.en}`, state_media_country: m.country } : {}; }
