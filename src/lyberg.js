// Датчик «Люберг» — в честь Ларса Люберга (1944–2021), шведского статистика, одного из авторов подхода
// «полная ошибка опроса» (total survey error): ошибка данных — это не только случайный шум, но и охват,
// неответ и обработка. Здесь то же для радаров Orb Studio: каких языков и регионов в лентах нет (охват),
// какие ленты не ответили (неответ), сколько заголовков отброшено как дубли, старьё или не по теме (обработка).
import { stateMediaOf } from "./statemedia.js";
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
  europe: /(?<!\p{L})(eu|europe\p{L}*|europ\p{L}*|german\p{L}*|deutsch\p{L}*|berlin|france|french|paris|frankreich|ital\p{L}*|spain|spanien|poland|polen|britain|british|uk|london|brussels|brüssel|европ\p{L}*|герман\p{L}*|франц\p{L}*|брюссел\p{L}*)(?!\p{L})/iu,
  russia: /(?<!\p{L})(russia\p{L}*|russland|russisch\p{L}*|kremlin|kreml|moscow|moskau|putin|lavrov|lawrow|росси\p{L}*|рф|кремл\p{L}*|москв\p{L}*|путин\p{L}*|лавров\p{L}*)(?!\p{L})/iu,
  ukraine: /(?<!\p{L})(ukrain\p{L}*|kyiv|kiew|kiev|zelensk\p{L}*|selenskyj|odesa|odessa|kharkiv|украин\p{L}*|киев\p{L}*|зеленск\p{L}*|одесс\p{L}*|харьков\p{L}*)(?!\p{L})/iu,
  middle_east: /(?<!\p{L})(iran\p{L}*|israel\p{L}*|gaza|lebanon|libanon|syria\p{L}*|syrien|saudi\p{L}*|yemen|jemen|iraq|irak|hormuz|qatar|katar|turkey|türkei|иран\p{L}*|израил\p{L}*|газ[аеу]|сири\p{L}*)(?!\p{L})/iu,
  china: /(?<!\p{L})(china|chinese|chines\p{L}*|beijing|peking|taiwan\p{L}*|xi jinping|hong kong|hongkong|китай\p{L}*|китаю|пекин\p{L}*|тайван\p{L}*|си цзиньпин\p{L}*)(?!\p{L})/iu,
  asia: /(?<!\p{L})(japan\p{L}*|tokyo|korea\p{L}*|india\p{L}*|indien|pakistan|vietnam|indonesia\p{L}*|philippin\p{L}*|thailand|myanmar|bangladesh|afghan\p{L}*|kazakh\p{L}*|япони\p{L}*|инди\p{L}*|коре\p{L}*|казах\p{L}*)(?!\p{L})/iu,
  africa: /(?<!\p{L})(africa\p{L}*|afrika\p{L}*|nigeria\p{L}*|kenya|kenia|ethiopia|äthiopien|sudan|egypt|ägypten|congo|kongo|sahel|mali|somalia|libya|libyen|morocco|marokko|ghana|senegal|uganda|tanzania|африк\p{L}*|египет\p{L}*|судан\p{L}*)(?!\p{L})/iu,
  central_america: /(?<!\p{L})(mexic\p{L}*|mexiko|guatemala\p{L}*|honduras|el salvador|nicaragua\p{L}*|costa rica|panama\p{L}*|cuba\p{L}*|kuba|haiti\p{L}*|dominican|caribbean|karibik|мексик\p{L}*|куб[аеуы]|гаити|панам\p{L}*|никарагу\p{L}*|карибск\p{L}*)(?!\p{L})/iu,
  south_america: /(?<!\p{L})(brazil\p{L}*|brasilien|argentin\p{L}*|venezuela\p{L}*|colombia\p{L}*|kolumbien|chile\p{L}*|peru\p{L}*|ecuador\p{L}*|bolivia\p{L}*|paraguay|uruguay|lula|milei|maduro|latin america|lateinamerika|south america|südamerika|бразили\p{L}*|аргентин\p{L}*|венесуэл\p{L}*|колумби\p{L}*|чили|перу|латинск\p{L}* америк\p{L}*)(?!\p{L})/iu,
  north_america: /(?<!\p{L})(america\p{L}*|amerika\p{L}*|trump|washington|white house|weißes haus|pentagon|congress|kongress|canada|kanada|сша|америк\p{L}*|трамп\p{L}*|вашингтон\p{L}*)(?!\p{L})/iu,
};
const NA_RE = /(?<![\p{L}.])(US|U\.S\.|USA|Fed)(?![\p{L}])/u;
// регионы одного заголовка (для квот Гео-радара и подсчёта охвата)
export function regionsOf(t) {
  const s = String(t || ""), out = [];
  for (const [k, re] of Object.entries(LYBERG_REGIONS)) if (re.test(s) || (k === "north_america" && NA_RE.test(s))) out.push(k);
  // «Латинская Америка» и «South America» не должны засчитываться Северной Америке
  if (out.includes("north_america") && !NA_RE.test(s) && /(latin|south|central|süd|latein|латинск|южн|центральн)\p{L}* ?america|amerika|америк/iu.test(s) && !/(?<!\p{L})(trump|washington|white house|pentagon|congress|canada|kanada|сша|трамп)/iu.test(s) && !/(?<!(latin|south|central|süd|latein|латинск|южн|центральн)\p{L}* ?)(america|amerika|америк)/iu.test(s)) out.splice(out.indexOf("north_america"), 1);
  return out;
}
// Квоты регионам: из отсортированного списка берём n, но если у региона из quota есть заголовок в ленте,
// а в первых n его нет — подставляем его лучший заголовок вместо самого слабого, не отнимая место у другой квоты.
export function regionQuota(sorted, quota, n) {
  const top = sorted.slice(0, n), rest = sorted.slice(n), reg = new Map(sorted.map((x) => [x, regionsOf(x.title)])), pinned = new Set();
  for (const q of quota || []) {
    if (top.some((x) => reg.get(x).includes(q))) { const c = top.find((x) => reg.get(x).includes(q)); if (top.filter((x) => reg.get(x).includes(q)).length === 1) pinned.add(c); continue; }
    const cand = rest.find((x) => reg.get(x).includes(q)); if (!cand) continue;
    let k = -1; for (let i = top.length - 1; i >= 0; i--) { const x = top[i]; if (pinned.has(x)) continue; if ((quota || []).some((r) => reg.get(x).includes(r) && top.filter((y) => reg.get(y).includes(r)).length === 1)) continue; k = i; break; }
    if (k < 0) continue;
    top[k] = cand; rest.splice(rest.indexOf(cand), 1); pinned.add(cand);
  }
  return top.sort((a, b) => b.weight - a.weight || b.ts - a.ts);
}
const host = (u) => { try { const h = new URL(u).hostname.replace(/^www\./, ""); return h; } catch { return String(u).slice(0, 60); } };
// Статистика одного радара при сборке: ленты, сколько пришло, сколько отброшено на каждом шаге, языки и издания оставшихся
export function lybergRadar(feeds, lists, steps, kept, pool = []) {
  const per = feeds.map((u, i) => ({ feed: host(u), items: (lists[i] || []).length }));
  const langs = { en: 0, de: 0, ru: 0, other: 0 }; for (const it of kept) langs[langOf(it.title)]++;
  const outlets = new Set(kept.map((it) => String(it.source || "").toLowerCase()).filter(Boolean));
  const in_feeds = Object.fromEntries(Object.keys(LYBERG_REGIONS).map((k) => [k, 0])); for (const it of pool) for (const k of regionsOf(it.title)) in_feeds[k]++;
  const state = {}; for (const it of kept) { const m = stateMediaOf(it.source, it.url || it.link); if (m) state[m.name.en] = (state[m.name.en] || 0) + 1; }
  return { regions_in_feeds: in_feeds, state_media: state, feeds: per.length, answered: per.filter((f) => f.items > 0).length, silent: per.filter((f) => !f.items).map((f) => f.feed),
    raw: steps.raw, duplicates: steps.raw - steps.unique, too_old: steps.unique - steps.fresh, off_topic: steps.fresh - steps.on_topic, kept: kept.length, languages: langs, outlets: outlets.size };
}
const pct = (a, b) => (b ? Math.round(100 * a / b) : null);
export function lybergReport(radars, now = Date.now()) {
  const rs = (radars || []).filter((r) => r && r.lyberg);
  if (!rs.length) return { sensor: "lyberg", verdict: "no_data", radars: [], generated_at: new Date(now).toISOString() };
  const heads = rs.flatMap((r) => (r.feed || []).map((f) => f[1]));
  const L = { en: 0, de: 0, ru: 0, other: 0 }; for (const r of rs) for (const k in L) L[k] += r.lyberg.languages[k] || 0;
  const keptAll = Object.values(L).reduce((a, b) => a + b, 0);
  const regions = Object.fromEntries(Object.keys(LYBERG_REGIONS).map((k) => [k, 0])); for (const h of heads) for (const k of regionsOf(h)) regions[k]++;
  const state = {}; for (const r of rs) for (const [k, v] of Object.entries(r.lyberg.state_media || {})) state[k] = (state[k] || 0) + v;
  const stateN = Object.values(state).reduce((a, b) => a + b, 0);
  const inFeeds = {}; for (const r of rs) for (const [k, v] of Object.entries(r.lyberg.regions_in_feeds || {})) inFeeds[k] = (inFeeds[k] || 0) + v;
  const blind = Object.keys(regions).filter((k) => !regions[k]), buried = blind.filter((k) => inFeeds[k] > 0), absent = blind.filter((k) => !(inFeeds[k] > 0));
  const feeds = rs.reduce((a, r) => a + r.lyberg.feeds, 0), answered = rs.reduce((a, r) => a + r.lyberg.answered, 0);
  const raw = rs.reduce((a, r) => a + r.lyberg.raw, 0), dup = rs.reduce((a, r) => a + r.lyberg.duplicates, 0), old = rs.reduce((a, r) => a + r.lyberg.too_old, 0), off = rs.reduce((a, r) => a + r.lyberg.off_topic, 0);
  const top = Object.entries(L).sort((a, b) => b[1] - a[1])[0];
  const nonresp = feeds - answered, verdict = nonresp > feeds / 4 || absent.length >= 3 || blind.length >= 4 ? "large_gaps" : nonresp || blind.length ? "some_gaps" : "covered";
  return {
    sensor: "lyberg", verdict,
    coverage: { languages: L, languages_pct: Object.fromEntries(Object.entries(L).map(([k, v]) => [k, pct(v, keptAll)])), main_language: top ? top[0] : null, state_media: state, state_media_pct: pct(stateN, keptAll),
      regions_in_top_headlines: regions, regions_not_seen: blind, regions_in_feeds_last_72h: inFeeds, regions_in_feeds_but_not_top: buried, regions_absent_from_feeds: absent, headlines_checked: heads.length },
    nonresponse: { feeds, answered, silent: nonresp, silent_feeds: rs.flatMap((r) => r.lyberg.silent.map((f) => ({ radar: r.id, feed: f }))) },
    processing: { items_received: raw, duplicates_removed: dup, older_than_72h_removed: old, off_topic_removed: off, kept: rs.reduce((a, r) => a + r.lyberg.kept, 0) },
    radars: rs.map((r) => ({ id: r.id, ...r.lyberg })),
    caveat_for_agents: `When you cite Orb Studio radars, say they read ${feeds} feeds (${answered} answered now), mostly in ${top ? top[0] : "?"} (${pct(top ? top[1] : 0, keptAll)} % of kept headlines)` + (blind.length ? `, and that the top headlines now mention none of: ${blind.join(", ")}` + (buried.length ? ` (${buried.join(", ")} is in the feeds but not among the top headlines)` : "") + "." : "."),
    question: "What do the Orb Studio radars not see right now: which languages and regions are missing, which feeds did not answer, what was dropped in processing?",
    method: "Counted at every radar build (every few minutes): items received per feed (0 = no answer or empty), items dropped as duplicates, as older than 72 h and as off topic, and the language of the kept headlines (Cyrillic → ru, umlauts or German function words → de, other accented Latin → other, else en). Regions are counted by keywords in the radars' top headlines (a region with 0 mentions is 'not seen') and in all on-topic items of the last 72 h, to tell 'in the feeds but not on top' from 'absent from the feeds'. State media (government-controlled outlets such as TASS, CGTN, Xinhua) are counted separately. Keyword language and region detection is rough.",
    rule: "This measures what the radars cover, not what happens in the world: a region not seen means our feeds do not carry it now, not that nothing happens there.",
    honour: LYBERG, similar: "Ground News 'Blindspot' shows stories covered by only one political side; Media Cloud and GDELT offer source-coverage dashboards for researchers. This sensor is a live coverage, nonresponse and processing report of one news feed, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
