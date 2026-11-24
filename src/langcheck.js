// Проверка языка реплики эфира: русский текст — кириллица, немецкий — без английских служебных слов.
// Нужна, чтобы перевод, который модель вернула непереведённым (английским), не попал в эфир на другом языке.
const EN = new Set("the and of to in is are was were that with for has have had from this it its as at by on be been will would their they he she we you not but which who about after over into more than also his her our your said says".split(" "));
const DE = new Set("der die das und ist sind war nicht von mit den dem des zu ein eine einen einem einer auf für im es sich auch aus bei nach wie über oder dass wird werden hat haben ich du wir ihr sie aber noch nur schon wenn dann so".split(" "));
export function langOk(text, lg) {
  const s = String(text || "").trim(); if (!s) return true;
  const letters = (s.match(/\p{L}/gu) || []).length; if (letters < 25) return true;
  if (lg === "ru") { const cyr = (s.match(/[Ѐ-ӿ]/g) || []).length; return cyr / letters >= 0.6; }
  if (lg === "de" || lg === "en") {
    const w = s.toLowerCase().match(/[a-zäöüß]+/g) || []; let e = 0, d = 0;
    for (const x of w) { if (EN.has(x)) e++; if (DE.has(x)) d++; }
    if ((e + d) < 3) return true;
    return lg === "de" ? d >= e : e >= d;
  }
  return true;
}
export const DUO_FIELDS = ["read", "question", "follow_up", "thanks", "transition", "answer", "follow_answer"];
// Перевод сегмента годен, если все непустые реплики на нужном языке и обязательные на месте
export function segOk(tr, lg, src) {
  if (!tr) return false;
  for (const k of DUO_FIELDS) { if (src && src[k] && !String(tr[k] || "").trim()) return false; if (!langOk(tr[k], lg)) return false; }
  return true;
}
