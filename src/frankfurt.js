// Датчик «Франкфурт» — в честь Гарри Франкфурта (1929–2023), автора эссе «On Bullshit» (1986, книга 2005):
// болтун не лжёт — ему всё равно, правда это или нет. Признак такой речи — в ней нечего проверить.
// Для каждого заголовка ищем «якоря проверки» (кто, когда, сколько, где) и размытые формулы («эксперты считают», «якобы»).
// Без ИИ: правила по словам. Это мера проверяемости заголовка, а не правды.
import { regionsOf } from "./lyberg.js";
export const FRANKFURT = {
  name: "Harry Frankfurt", years: "1929–2023",
  idea: "On Bullshit: the bullshitter is not a liar — he does not care whether what he says is true. Such talk leaves nothing to check.",
  wiki: { en: "https://en.wikipedia.org/wiki/Harry_Frankfurt", ru: "https://en.wikipedia.org/wiki/Harry_Frankfurt" },
  note: "Named in his honour. Orb Studio is not connected with Harry Frankfurt, his family or Princeton University.",
};
const NUM = /(?<![\p{L}])(\d[\d.,]*|one|two|three|four|five|six|seven|eight|nine|ten|dozens?|hundreds?|thousands?|millions?|billions?|half|zwei|drei|vier|fünf|zehn|hundert|tausend|millionen?|milliarden?|hälfte|два|две|три|четыре|пять|десят\p{L}*|сот\p{L}*|тысяч\p{L}*|миллион\p{L}*|миллиард\p{L}*|половин\p{L}*)(?![\p{L}])|%|€|\$|£/iu;
const TIME = /(?<![\p{L}])(today|tonight|yesterday|tomorrow|this (week|month|year)|last (week|month|year)|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|june|july|august|september|october|november|december|heute|gestern|morgen|montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonntag|januar|februar|märz|juni|juli|oktober|dezember|сегодня|вчера|завтра|понедельник\p{L}*|вторник\p{L}*|сред[аеу]|четверг\p{L}*|пятниц\p{L}*|суббот\p{L}*|воскресень\p{L}*|январ\p{L}*|феврал\p{L}*|март\p{L}*|апрел\p{L}*|ма[йяе]|июн\p{L}*|июл\p{L}*|август\p{L}*|сентябр\p{L}*|октябр\p{L}*|ноябр\p{L}*|декабр\p{L}*|20[0-3]\d)(?![\p{L}])/iu;
const SAYS = /(?<![\p{L}])(says?|said|tells?|told|announce[sd]?|confirm(s|ed)?|sagt|sagte|erklärt|bestätigt|kündigt|заявил\p{L}*|сообщил\p{L}*|подтвердил\p{L}*|объявил\p{L}*)(?![\p{L}])/iu;
const VAGUE = /(?<![\p{L}])(experts? (say|believe|warn|fear)|some (say|believe)|sources? (say|said)|insiders?|reportedly|allegedly|rumou?rs?|is said to|are said to|could|may|might|seemingly|apparently|mysterious|shocking truth|you won'?t believe|experten|angeblich|berichten zufolge|gerüchte?|soll(en)? (sein|haben)|könnte|könnten|offenbar|эксперт\p{L}*|якобы|по слухам|слух\p{L}*|источник\p{L}* (сообщ|говор)\p{L}*|по некоторым данным|может|могут|возможно|вероятно|по мнению)(?![\p{L}])/iu;
// имя собственное: слово с заглавной буквы не в начале заголовка, или аббревиатура из 2+ заглавных
function actors(t) {
  const words = String(t || "").replace(/["«»“”„'’]/g, " ").split(/\s+/).filter(Boolean);
  return words.slice(1).filter((w) => /^[A-ZÄÖÜА-ЯЁ][\p{L}\-]{1,}/u.test(w) || /^[A-ZА-ЯЁ]{2,}$/u.test(w.replace(/[^\p{L}]/gu, ""))).map((w) => w.replace(/[^\p{L}\-]/gu, "")).filter((w) => w.length > 1);
}
export function frankfurtHeadline(title) {
  const t = String(title || ""), a = { who: actors(t).length > 0, when: TIME.test(t), how_many: NUM.test(t), where: regionsOf(t).length > 0 };
  const anchors = Object.values(a).filter(Boolean).length, vague = [...new Set((t.match(new RegExp(VAGUE.source, "giu")) || []).map((w) => w.toLowerCase()))];
  const attributed = a.who && SAYS.test(t);
  const cls = vague.length && anchors < 2 && !attributed ? "nothing_to_check" : vague.length ? "hedged" : anchors >= 2 ? "checkable" : "thin";
  return { class: cls, anchors: a, anchor_count: anchors, vague_words: vague, attributed };
}
export const FRANKFURT_EXPLAIN = {
  checkable: "at least two anchors (who / when / how many / where) and no vague formula — you can check it",
  hedged: "has anchors but also a vague or speculative formula (could, reportedly, experts say) — repeat it with that hedge",
  thin: "fewer than two anchors — little to check; say what is missing",
  nothing_to_check: "a vague formula and almost no anchors — nothing checkable; do not repeat it as news",
};
export function frankfurtReport(radars, now = Date.now()) {
  const rs = (radars || []).filter((r) => r && Array.isArray(r.feed));
  if (!rs.length) return { sensor: "frankfurt", verdict: "no_data", radars: [], generated_at: new Date(now).toISOString() };
  const all = [], per = rs.map((r) => {
    const items = r.feed.map((f) => ({ headline: f[1], source: f[2] || null, ...frankfurtHeadline(f[1]) })); all.push(...items.map((x) => ({ ...x, radar: r.id })));
    const c = (k) => items.filter((x) => x.class === k).length;
    return { id: r.id, headlines: items.length, checkable: c("checkable"), hedged: c("hedged"), thin: c("thin"), nothing_to_check: c("nothing_to_check") };
  });
  const n = all.length, c = (k) => all.filter((x) => x.class === k).length, pct = (k) => (n ? Math.round(100 * c(k) / n) : null);
  const shares = { checkable: pct("checkable"), hedged: pct("hedged"), thin: pct("thin"), nothing_to_check: pct("nothing_to_check") };
  return {
    sensor: "frankfurt", verdict: shares.nothing_to_check >= 15 ? "much_unverifiable" : shares.nothing_to_check > 0 || shares.thin >= 30 ? "some_unverifiable" : "mostly_checkable",
    headlines: n, shares, explain: FRANKFURT_EXPLAIN, radars: per,
    examples: { nothing_to_check: all.filter((x) => x.class === "nothing_to_check").slice(0, 6), hedged: all.filter((x) => x.class === "hedged").slice(0, 6), thin: all.filter((x) => x.class === "thin").slice(0, 4) },
    question: "How much of what the Orb Studio radars carry right now can actually be checked — who, when, how many, where — and how much is vague talk?",
    method: "Each top headline of every radar is searched for four anchors: who (a proper name or acronym after the first word), when (day, date, month, year, today/yesterday), how many (a number or number word, %, currency) and where (a country or region). Vague formulas are listed words in English, German and Russian (experts say, reportedly, allegedly, could, may; angeblich, könnte, soll; якобы, по слухам, может). checkable = 2+ anchors and no vague formula; hedged = anchors plus a vague formula; thin = fewer than 2 anchors; nothing_to_check = a vague formula, under 2 anchors and no named speaker. Word rules, no AI; capitalised words can be mistaken for names.",
    rule: "This measures whether a headline gives you something to check, not whether it is true: a checkable headline can be false and a vague one can turn out right. Do not repeat a nothing_to_check headline as news.",
    honour: FRANKFURT, similar: "retext-intensify and SEO 'vague language detectors' flag hedges and weasel words in a text; ClaimBuster scores whether a sentence is worth fact-checking; research combines vagueness detection with fake-news models. This sensor counts checkable anchors live across a news feed and adds the same verdict to check_headline.",
    generated_at: new Date(now).toISOString(),
  };
}
