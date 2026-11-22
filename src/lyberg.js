// Датчик «Люберг» — в честь Ларса Люберга (1944–2021), шведского статистика, одного из авторов подхода
// «полная ошибка опроса» (total survey error): ошибка данных — это не только случайный шум, но и охват,
// неответ и обработка. Здесь то же для радаров Orb Studio: каких языков и регионов в лентах нет (охват),
// какие ленты не ответили (неответ), сколько заголовков отброшено как дубли, старьё или не по теме (обработка).
export const LYBERG = {
  name: "Lars Lyberg", years: "1944–2021",
  idea: "Total survey error: data error is not only sampling noise — coverage, nonresponse, measurement and processing errors add up and must be reported together.",
  wiki: { en: "https://en.wikipedia.org/wiki/Lars_Lyberg", ru: "https://en.wikipedia.org/wiki/Lars_Lyberg" },
  note: "Named in his honour. Orb Studio is not connected with Lars Lyberg, his family or Statistics Sweden.",
};
export function langOf(t) {
  const s = String(t || "");
  if (/[а-яё]/i.test(s)) return "ru";
  if (/[äöüß]/i.test(s) || /(?<!\p{L})(der|die|das|und|mit|für|nicht|ist|im|auf|bei|nach|vor|wird|sich|ein|eine)(?!\p{L})/iu.test(s)) return "de";
  if (/[éèêàâçñóíúãõ]/i.test(s)) return "other";
  return "en";
}
// регионы мира по упоминаниям в заголовках (грубо, по ключевым словам)
export const LYBERG_REGIONS = {
  europe: /(?<!\p{L})(eu|europe\p{L}*|europ\p{L}*|german\p{L}*|deutsch\p{L}*|berlin|france|french|paris|frankreich|ital\p{L}*|spain|spanien|poland|polen|britain|british|uk|london|brussels|brüssel|европ\p{L}*|герман\p{L}*)(?!\p{L})/iu,
  russia_ukraine: /(?<!\p{L})(russia\p{L}*|russland|russisch\p{L}*|kremlin|kreml|moscow|moskau|putin|ukrain\p{L}*|kyiv|kiew|zelensk\p{L}*|росси\p{L}*|украин\p{L}*|кремл\p{L}*|путин\p{L}*)(?!\p{L})/iu,
  middle_east: /(?<!\p{L})(iran\p{L}*|israel\p{L}*|gaza|lebanon|libanon|syria\p{L}*|syrien|saudi\p{L}*|yemen|jemen|iraq|irak|hormuz|qatar|katar|turkey|türkei|иран\p{L}*|израил\p{L}*)(?!\p{L})/iu,
  asia: /(?<!\p{L})(china|chinese|chines\p{L}*|beijing|peking|taiwan|japan\p{L}*|tokyo|korea\p{L}*|india\p{L}*|indien|pakistan|vietnam|indonesia\p{L}*|philippin\p{L}*|китай\p{L}*|япони\p{L}*|инди\p{L}*)(?!\p{L})/iu,
  africa: /(?<!\p{L})(africa\p{L}*|afrika\p{L}*|nigeria\p{L}*|kenya|kenia|ethiopia|äthiopien|sudan|egypt|ägypten|congo|kongo|sahel|mali|somalia|libya|libyen|morocco|marokko|южн\p{L}* африк\p{L}*|африк\p{L}*)(?!\p{L})/iu,
  latin_america: /(?<!\p{L})(brazil\p{L}*|brasilien|mexic\p{L}*|mexiko|argentin\p{L}*|venezuela\p{L}*|colombia|kolumbien|chile|peru|cuba|kuba|latin america|lateinamerika|бразил\p{L}*|мексик\p{L}*|венесуэл\p{L}*)(?!\p{L})/iu,
  north_america: /(?<!\p{L})(america\p{L}*|amerika\p{L}*|trump|washington|white house|weißes haus|pentagon|congress|kongress|canada|kanada|сша|америк\p{L}*|трамп\p{L}*)(?!\p{L})/iu,
};
const host = (u) => { try { const h = new URL(u).hostname.replace(/^www\./, ""); return h; } catch { return String(u).slice(0, 60); } };
// Статистика одного радара при сборке: ленты, сколько пришло, сколько отброшено на каждом шаге, языки и издания оставшихся
export function lybergRadar(feeds, lists, steps, kept, pool = []) {
  const per = feeds.map((u, i) => ({ feed: host(u), items: (lists[i] || []).length }));
  const langs = { en: 0, de: 0, ru: 0, other: 0 }; for (const it of kept) langs[langOf(it.title)]++;
  const outlets = new Set(kept.map((it) => String(it.source || "").toLowerCase()).filter(Boolean));
  const NA = /(?<![\p{L}.])(US|U\.S\.|USA|Fed)(?![\p{L}])/u;
  const in_feeds = Object.fromEntries(Object.entries(LYBERG_REGIONS).map(([k, re]) => [k, pool.filter((it) => re.test(it.title || "") || (k === "north_america" && NA.test(it.title || ""))).length]));
  return { regions_in_feeds: in_feeds, feeds: per.length, answered: per.filter((f) => f.items > 0).length, silent: per.filter((f) => !f.items).map((f) => f.feed),
    raw: steps.raw, duplicates: steps.raw - steps.unique, too_old: steps.unique - steps.fresh, off_topic: steps.fresh - steps.on_topic, kept: kept.length, languages: langs, outlets: outlets.size };
}
const pct = (a, b) => (b ? Math.round(100 * a / b) : null);
export function lybergReport(radars, now = Date.now()) {
  const rs = (radars || []).filter((r) => r && r.lyberg);
  if (!rs.length) return { sensor: "lyberg", verdict: "no_data", radars: [], generated_at: new Date(now).toISOString() };
  const heads = rs.flatMap((r) => (r.feed || []).map((f) => f[1]));
  const L = { en: 0, de: 0, ru: 0, other: 0 }; for (const r of rs) for (const k in L) L[k] += r.lyberg.languages[k] || 0;
  const keptAll = Object.values(L).reduce((a, b) => a + b, 0);
  const NA = /(?<![\p{L}.])(US|U\.S\.|USA|Fed)(?![\p{L}])/u, hit = (k, re, h) => re.test(h) || (k === "north_america" && NA.test(h));
  const regions = Object.fromEntries(Object.entries(LYBERG_REGIONS).map(([k, re]) => [k, heads.filter((h) => hit(k, re, h)).length]));
  const inFeeds = {}; for (const r of rs) for (const [k, v] of Object.entries(r.lyberg.regions_in_feeds || {})) inFeeds[k] = (inFeeds[k] || 0) + v;
  const blind = Object.keys(regions).filter((k) => !regions[k]), buried = blind.filter((k) => inFeeds[k] > 0), absent = blind.filter((k) => !(inFeeds[k] > 0));
  const feeds = rs.reduce((a, r) => a + r.lyberg.feeds, 0), answered = rs.reduce((a, r) => a + r.lyberg.answered, 0);
  const raw = rs.reduce((a, r) => a + r.lyberg.raw, 0), dup = rs.reduce((a, r) => a + r.lyberg.duplicates, 0), old = rs.reduce((a, r) => a + r.lyberg.too_old, 0), off = rs.reduce((a, r) => a + r.lyberg.off_topic, 0);
  const top = Object.entries(L).sort((a, b) => b[1] - a[1])[0];
  const nonresp = feeds - answered, verdict = nonresp > feeds / 4 || absent.length >= 3 || blind.length >= 4 ? "large_gaps" : nonresp || blind.length ? "some_gaps" : "covered";
  return {
    sensor: "lyberg", verdict,
    coverage: { languages: L, languages_pct: Object.fromEntries(Object.entries(L).map(([k, v]) => [k, pct(v, keptAll)])), main_language: top ? top[0] : null,
      regions_in_top_headlines: regions, regions_not_seen: blind, regions_in_feeds_last_72h: inFeeds, regions_in_feeds_but_not_top: buried, regions_absent_from_feeds: absent, headlines_checked: heads.length },
    nonresponse: { feeds, answered, silent: nonresp, silent_feeds: rs.flatMap((r) => r.lyberg.silent.map((f) => ({ radar: r.id, feed: f }))) },
    processing: { items_received: raw, duplicates_removed: dup, older_than_72h_removed: old, off_topic_removed: off, kept: rs.reduce((a, r) => a + r.lyberg.kept, 0) },
    radars: rs.map((r) => ({ id: r.id, ...r.lyberg })),
    caveat_for_agents: `When you cite Orb Studio radars, say they read ${feeds} feeds (${answered} answered now), mostly in ${top ? top[0] : "?"} (${pct(top ? top[1] : 0, keptAll)} % of kept headlines)` + (blind.length ? `, and that the top headlines now mention none of: ${blind.join(", ")}` + (buried.length ? ` (${buried.join(", ")} is in the feeds but not among the top headlines)` : "") + "." : "."),
    question: "What do the Orb Studio radars not see right now: which languages and regions are missing, which feeds did not answer, what was dropped in processing?",
    method: "Counted at every radar build (every few minutes): items received per feed (0 = no answer or empty), items dropped as duplicates, as older than 72 h and as off topic, and the language of the kept headlines (Cyrillic → ru, umlauts or German function words → de, other accented Latin → other, else en). Regions are counted by keywords in the radars' top headlines (a region with 0 mentions is 'not seen') and in all on-topic items of the last 72 h, to tell 'in the feeds but not on top' from 'absent from the feeds'. Keyword language and region detection is rough.",
    rule: "This measures what the radars cover, not what happens in the world: a region not seen means our feeds do not carry it now, not that nothing happens there.",
    honour: LYBERG, similar: "Ground News 'Blindspot' shows stories covered by only one political side; Media Cloud and GDELT offer source-coverage dashboards for researchers. This sensor is a live coverage, nonresponse and processing report of one news feed, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
