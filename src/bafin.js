// BaFin "Maßnahmen" RSS (official supervisory measures). Text is passed through unchanged; sector comes from the link path (Orb Studio heuristic).
export const BAFIN_FEED = "https://www.bafin.de/DE/service/rss/_function/RSS_Massnahmen.xml?nn=150166";
const ent = (s) => String(s).replace(/&(#x?[0-9a-f]+|amp|lt|gt|quot|apos);/gi, (m, e) => {
  const l = e.toLowerCase();
  if (l === "amp") return "&"; if (l === "lt") return "<"; if (l === "gt") return ">"; if (l === "quot") return '"'; if (l === "apos") return "'";
  const n = l[1] === "x" ? parseInt(l.slice(2), 16) : parseInt(l.slice(1), 10);
  return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : m;
});
const tag = (blk, t) => { const m = blk.match(new RegExp("<" + t + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + t + ">", "i")); if (!m) return ""; return ent(m[1].replace(/^\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*$/, "$1")).replace(/\s+/g, " ").trim(); };
export function sectorOf(link) {
  if (/\/VAG\//.test(link)) return "insurance";
  if (/\/60b_KWG_84_WpIG_und_57_GwG\//.test(link)) return "banking_aml";
  if (/\/40c_neu_124_WpHG\//.test(link)) return "securities_disclosure";
  return "other";
}
const PERSON = /_anonym|natürliche Person|natuerliche Person|Geschäftsleiter/i;
export function parseBafin(xml) {
  const blocks = typeof xml === "string" ? xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || [] : [];
  const seen = new Set(), items = []; let withheld = 0;
  for (const b of blocks) {
    const title = tag(b, "title"), url = tag(b, "link"), desc = tag(b, "description"), t = Date.parse(tag(b, "pubDate"));
    if (!title || !/^https:\/\/(www\.)?bafin\.de\//.test(url) || !Number.isFinite(t) || seen.has(url)) continue;
    seen.add(url);
    if (PERSON.test(url + " " + title + " " + desc)) { withheld++; continue; }
    items.push({ date: new Date(t).toISOString(), title, sector: sectorOf(url), url, source: "© Bundesanstalt für Finanzdienstleistungsaufsicht / www.bafin.de" });
  }
  if (!blocks.length) return { ok: false };
  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  const by = {}; for (const i of items) by[i.sector] = (by[i.sector] || 0) + 1;
  return { ok: true, latest_published: items[0] ? items[0].date : null, count_in_feed: items.length, withheld_personal_count: withheld, by_sector_in_feed: by, items };
}
