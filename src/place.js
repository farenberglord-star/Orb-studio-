// «Проверь место» (check_place): агент приносит карточку места, как её показали Google Карты или другой сервис (название,
// координаты, рейтинг, число оценок, часы работы по источникам, даты отзывов), а мы проверяем её независимыми правилами.
// Мы сами НЕ ходим в Google Карты, ничего не скрейпим и не храним: берём только то, что передал агент.
// Не рекомендация «идти или не идти» и не оценка заведения. Для аптек, больниц, банков — только заметка и официальный источник.
// Orb Studio не связан с Google. Google Maps — товарный знак Google LLC.
export const PLACE_MAX_NAME = 120;
const MS_DAY = 86400000;

// ---------- праздники Германии: считаются по правилам, без обращения к сети ----------
const STATES = ["BW", "BY", "BE", "BB", "HB", "HH", "HE", "MV", "NI", "NW", "RP", "SL", "SN", "ST", "SH", "TH"];
const STATE_NAMES = { baden: "BW", württemberg: "BW", bayern: "BY", bavaria: "BY", berlin: "BE", brandenburg: "BB", bremen: "HB", hamburg: "HH", hessen: "HE", hesse: "HE", mecklenburg: "MV", niedersachsen: "NI", "lower saxony": "NI", nordrhein: "NW", westfalen: "NW", rheinland: "RP", saarland: "SL", sachsen: "SN", saxony: "SN", anhalt: "ST", schleswig: "SH", holstein: "SH", thüringen: "TH", thuringia: "TH" };
export function normState(s) {
  if (s == null || s === "") return "HH";
  const t = String(s).trim();
  if (STATES.includes(t.toUpperCase())) return t.toUpperCase();
  const l = t.toLowerCase();
  for (const [k, v] of Object.entries(STATE_NAMES)) if (l.includes(k)) return v;
  return null;
}
// Пасха по Гауссу (григорианская), UTC-дата
export function easter(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
  return Date.UTC(y, mo - 1, da);
}
const iso = (t) => new Date(t).toISOString().slice(0, 10);
const D = (y, m, d) => Date.UTC(y, m - 1, d);
const ALL = null; // во всех землях
// одноразовые праздники (8 мая 2025 в Берлине и т. п.) не моделируются: об этом сказано в ответе
export function holidaysOf(y) {
  const E = easter(y), add = (n) => E + n * MS_DAY;
  const bussbet = (() => { let t = D(y, 11, 22); while (new Date(t).getUTCDay() !== 3) t -= MS_DAY; return t; })(); // среда перед 23 ноября
  return [
    { t: D(y, 1, 1), name: "Neujahr", states: ALL },
    { t: D(y, 1, 6), name: "Heilige Drei Könige", states: ["BW", "BY", "ST"] },
    { t: D(y, 3, 8), name: "Internationaler Frauentag", states: ["BE", "MV"], from: 2019 },
    { t: add(-2), name: "Karfreitag", states: ALL },
    { t: add(0), name: "Ostersonntag", states: ["BB"] },
    { t: add(1), name: "Ostermontag", states: ALL },
    { t: D(y, 5, 1), name: "Tag der Arbeit", states: ALL },
    { t: add(39), name: "Christi Himmelfahrt", states: ALL },
    { t: add(49), name: "Pfingstsonntag", states: ["BB"] },
    { t: add(50), name: "Pfingstmontag", states: ALL },
    { t: add(60), name: "Fronleichnam", states: ["BW", "BY", "HE", "NW", "RP", "SL"], partial: "in Teilen von SN und TH" },
    { t: D(y, 8, 15), name: "Mariä Himmelfahrt", states: ["SL"], partial: "in Teilen von BY" },
    { t: D(y, 9, 20), name: "Weltkindertag", states: ["TH"], from: 2019 },
    { t: D(y, 10, 3), name: "Tag der Deutschen Einheit", states: ALL },
    { t: D(y, 10, 31), name: "Reformationstag", states: ["BB", "HB", "HH", "MV", "NI", "SN", "ST", "SH", "TH"], from: 2018 },
    { t: D(y, 11, 1), name: "Allerheiligen", states: ["BW", "BY", "NW", "RP", "SL"] },
    { t: bussbet, name: "Buß- und Bettag", states: ["SN"] },
    { t: D(y, 12, 25), name: "1. Weihnachtstag", states: ALL },
    { t: D(y, 12, 26), name: "2. Weihnachtstag", states: ALL },
  ].filter((h) => !h.from || y >= h.from).map((h) => ({ ...h, date: iso(h.t) }));
}
const inState = (h, st) => h.states === ALL || h.states.includes(st);
// не праздники, но магазины и сервисы часто закрываются раньше
const eves = (y) => [{ t: D(y, 12, 24), name: "Heiligabend" }, { t: D(y, 12, 31), name: "Silvester" }].map((h) => ({ ...h, date: iso(h.t) }));

export function holidayInfo(dateStr, state) {
  const st = normState(state);
  if (!st) return { error: "unknown_state" };
  const t = Date.parse(dateStr + "T00:00:00Z");
  if (!Number.isFinite(t)) return { error: "bad_date" };
  const y = new Date(t).getUTCFullYear();
  const list = [...holidaysOf(y - 1), ...holidaysOf(y), ...holidaysOf(y + 1)].filter((h) => inState(h, st)).sort((a, b) => a.t - b.t);
  const today = list.find((h) => h.t === t) || null;
  const next = list.find((h) => h.t > t) || null;
  const eve = [...eves(y)].find((h) => h.t === t) || null;
  const dow = new Date(t).getUTCDay(); // 0 = воскресенье
  return {
    state: st, date: dateStr, weekday: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"][dow],
    is_public_holiday: !!today, holiday: today ? today.name : null, partial_note: today && today.partial ? today.partial : null,
    is_sunday: dow === 0, is_eve_of_holiday_closing_early: !!eve, eve: eve ? eve.name : null,
    next_holiday: next ? { name: next.name, date: next.date, in_days: Math.round((next.t - t) / MS_DAY) } : null,
  };
}

// ---------- рейтинг со счётчиком ----------
// Рабочее допущение (не закон природы): пороги и «подтяжка» к 4,0 — для сравнения мест, а не оценка заведения.
export const PRIOR_MEAN = 4.0, PRIOR_WEIGHT = 25;
export function ratingInfo(rating, reviews) {
  if (!Number.isFinite(rating) || rating < 0 || rating > 5) return null;
  const n = Number.isFinite(reviews) && reviews >= 0 ? Math.floor(reviews) : null;
  if (n == null) return { stars: rating, reviews: null, size: "unknown", note_en: "No number of ratings given: a star average alone says little.", note_ru: "Число оценок не передано: одни звёзды говорят мало.", note_de: "Keine Anzahl der Bewertungen angegeben: ein Sternedurchschnitt allein sagt wenig." };
  const size = n < 10 ? "very_few" : n < 50 ? "few" : n < 300 ? "solid" : "large";
  const shrunk = Math.round(((PRIOR_WEIGHT * PRIOR_MEAN + n * rating) / (PRIOR_WEIGHT + n)) * 100) / 100;
  const T = {
    very_few: ["Under 10 ratings: the average can swing on one or two people.", "Меньше 10 оценок: среднее качается от одного-двух человек.", "Unter 10 Bewertungen: der Durchschnitt hängt an ein, zwei Personen."],
    few: ["10 to 49 ratings: a hint, not yet a stable number.", "От 10 до 49 оценок: намёк, ещё не устойчивое число.", "10 bis 49 Bewertungen: ein Hinweis, noch keine stabile Zahl."],
    solid: ["50 to 299 ratings: a reasonably stable average; it still hides how opinions split.", "От 50 до 299 оценок: среднее довольно устойчиво, но не показывает, как разделились мнения.", "50 bis 299 Bewertungen: ein halbwegs stabiler Durchschnitt; er verbirgt, wie die Meinungen sich verteilen."],
    large: ["300 or more ratings: a large sample; age and mix of reviews matter more than count.", "300 и больше оценок: большая выборка; важнее возраст и состав отзывов, чем их число.", "300 und mehr Bewertungen: große Stichprobe; Alter und Mischung der Bewertungen zählen mehr als die Zahl."],
  }[size];
  return { stars: rating, reviews: n, size, shrunk_toward_4_0: shrunk, shrink_assumption: `working assumption: prior mean ${PRIOR_MEAN}, weight ${PRIOR_WEIGHT} ratings; for comparing places, not a verdict`, note_en: T[0], note_ru: T[1], note_de: T[2] };
}

// ---------- возраст отзывов ----------
export function reviewAges(dates, now = Date.now()) {
  if (!Array.isArray(dates)) return null;
  const ts = dates.map((d) => Date.parse(String(d))).filter((t) => Number.isFinite(t) && t <= now + MS_DAY).slice(0, 60);
  if (!ts.length) return null;
  ts.sort((a, b) => a - b);
  const last12 = ts.filter((t) => now - t <= 365 * MS_DAY).length;
  let best = 0; for (let i = 0, j = 0; i < ts.length; i++) { while (ts[i] - ts[j] > 7 * MS_DAY) j++; best = Math.max(best, i - j + 1); }
  const r = { given: ts.length, newest_days_ago: Math.floor((now - ts[ts.length - 1]) / MS_DAY), oldest_days_ago: Math.floor((now - ts[0]) / MS_DAY), share_last_12_months: Math.round((last12 / ts.length) * 100) / 100, largest_share_in_one_week: Math.round((best / ts.length) * 100) / 100 };
  r.burst_sign = ts.length >= 5 && r.largest_share_in_one_week >= 0.4;
  r.note = "Only the review dates the agent passed are counted; a sign to look closer, never a verdict on the place or its reviewers.";
  return r;
}

// ---------- часы по источникам ----------
const HM = /^([01]?\d|2[0-3]):([0-5]\d)$/;
export function hoursInfo(items) {
  if (!Array.isArray(items)) return null;
  const rows = [];
  for (const it of items.slice(0, 6)) {
    if (!it || typeof it !== "object") continue;
    const source = String(it.source || "?").slice(0, 60).replace(/[\u0000-\u001f​-‏‪-‮⁦-⁩]/g, "");
    if (it.closed === true) { rows.push({ source, closed: true }); continue; }
    const o = HM.exec(String(it.open || "")), c = HM.exec(String(it.close || ""));
    if (o && c) rows.push({ source, open: `${o[1].padStart(2, "0")}:${o[2]}`, close: `${c[1].padStart(2, "0")}:${c[2]}` });
  }
  if (!rows.length) return null;
  const key = (r) => (r.closed ? "closed" : r.open + "-" + r.close);
  const groups = {}; for (const r of rows) (groups[key(r)] ||= []).push(r.source);
  const agree = Math.max(...Object.values(groups).map((g) => g.length));
  const distinct = Object.keys(groups).length;
  return { sources: rows.length, distinct_versions: distinct, most_sources_agree: agree, versions: Object.entries(groups).map(([k, s]) => ({ hours: k, sources: s })), conflict: distinct > 1, note: distinct > 1 ? "Sources disagree about today's hours; confirm with the place itself (official site or phone) before travelling." : (rows.length > 1 ? "All given sources agree for this date; agreement of copies is not proof, check who the original source is." : "One source only: agreement cannot be checked.") };
}

const TOPIC = /apothek|pharmac|аптек|krankenhaus|klinik|hospital|больниц|клиник|arzt|doctor|врач|bank|geldautomat|atm|банк|банкомат/i;
const ROAD = /tankstelle|gas station|fuel|азс|заправк|parkhaus|parking|парковк|ladestation|charging|зарядн/i;

export function checkPlace(input, now = Date.now()) {
  const a = input && typeof input === "object" ? input : {};
  const name = String(a.name || "").replace(/[\u0000-\u001f​-‏‪-‮⁦-⁩]/g, "").trim().slice(0, PLACE_MAX_NAME);
  if (name.length < 2) return { error: "name_required", note: "Give the place name (2–120 characters)." };
  let date = a.date ? String(a.date).slice(0, 10) : new Date(now + 3600e3).toISOString().slice(0, 10); // Берлин ≈ UTC+1, для даты достаточно
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date + "T00:00:00Z"))) return { error: "bad_date", note: "date must be YYYY-MM-DD." };
  const hol = holidayInfo(date, a.state);
  if (hol.error) return { error: hol.error, note: "state: a German state code like HH, BY, NW or its name (default HH)." };
  const lat = a.lat != null ? Number(a.lat) : null, lon = a.lon != null ? Number(a.lon) : null;
  const hasPos = Number.isFinite(lat) && Number.isFinite(lon) && Math.abs(lat) <= 90 && Math.abs(lon) <= 180;
  const rating = a.rating != null ? ratingInfo(Number(a.rating), a.reviews != null ? Number(a.reviews) : NaN) : null;
  const ages = reviewAges(a.review_dates, now);
  const hours = hoursInfo(a.hours);
  const text = [name, a.category, a.crowd_text].filter(Boolean).join(" ");
  const flags = [];
  const say = (en, ru, de, scientist, zone) => flags.push({ zone, scientist, en, ru, de });
  if (hol.is_public_holiday) say(`Today is a public holiday in ${hol.state} (${hol.holiday}): opening hours often differ from the map's usual hours.`, `Сегодня праздник в земле ${hol.state} (${hol.holiday}): часы работы часто не такие, как обычные на карте.`, `Heute ist in ${hol.state} ein Feiertag (${hol.holiday}): die Öffnungszeiten weichen oft von den üblichen Kartenzeiten ab.`, "Rotemberg", "stale_data");
  else if (hol.is_sunday) say("Today is Sunday: most shops in Germany are closed; museums, cafés and restaurants are usually the exception.", "Сегодня воскресенье: большинство магазинов в Германии закрыто; музеи, кафе и рестораны обычно работают.", "Heute ist Sonntag: die meisten Geschäfte in Deutschland sind geschlossen; Museen, Cafés und Restaurants meist nicht.", "Rotemberg", "stale_data");
  if (hol.is_eve_of_holiday_closing_early) say(`${hol.eve} is not a public holiday, but many places close early.`, `${hol.eve} не праздничный день, но многие места закрываются раньше.`, `${hol.eve} ist kein gesetzlicher Feiertag, aber viele Orte schließen früher.`, "Rotemberg", "stale_data");
  if (rating && (rating.size === "very_few" || rating.size === "few" || rating.size === "unknown")) say(rating.note_en, rating.note_ru, rating.note_de, "Cohen", "measurement_error");
  if (hours && hours.conflict) say(hours.note, "Источники расходятся по часам на эту дату: перед поездкой уточните у самого места (официальный сайт или телефон).", "Die Quellen widersprechen sich bei den heutigen Zeiten: vor der Fahrt beim Ort selbst bestätigen (offizielle Seite oder Telefon).", "García-Molina", "stale_data");
  if (ages && ages.share_last_12_months < 0.5) say("Fewer than half of the review dates given are from the last 12 months: the place may have changed since.", "Меньше половины переданных дат отзывов приходится на последние 12 месяцев: место могло измениться.", "Weniger als die Hälfte der genannten Bewertungsdaten liegt in den letzten 12 Monaten: der Ort kann sich verändert haben.", "Hinkley", "stale_data");
  if (ages && ages.burst_sign) say("Many of the review dates fall in one week: a sign to look closer (campaign, event, or an ordinary busy week), not a verdict.", "Много переданных дат отзывов приходится на одну неделю: повод присмотреться (кампания, событие или просто оживлённая неделя), а не вердикт.", "Viele der genannten Bewertungsdaten liegen in einer Woche: ein Anlass genauer hinzusehen, kein Urteil.", "Campbell", "rumour_vs_fact");
  if (a.crowd_text) say("A line like 'usually not busy' is the typical level for this hour, not how busy it is now.", "Строка вроде «обычно невысокая загруженность» — типичный уровень на этот час, а не то, как людно сейчас.", "Eine Zeile wie „meist wenig los“ ist der typische Wert für diese Stunde, nicht der aktuelle Andrang.", "Kalman", "stale_data");
  const missing = [];
  if (!a.hours) missing.push("hours per source for the date (source, open, close)");
  if (!ages) missing.push("review dates (up to 60 ISO dates)");
  if (rating && rating.reviews == null) missing.push("number of ratings");
  if (!a.rating) missing.push("rating and number of ratings");
  const notes = [];
  if (TOPIC.test(text)) notes.push({ en: "Health and money places: this check never says whether to use them. For opening hours and emergency service use the official source (pharmacy emergency service: aponet.de or 116 117 for medical on-call in Germany; bank: the bank itself).", ru: "Места про здоровье и деньги: проверка не говорит, пользоваться ли ими. Часы и дежурства — только по официальному источнику (аптеки: aponet.de; врачебный дежурный: 116 117; банк: сам банк).", de: "Orte rund um Gesundheit und Geld: diese Prüfung sagt nie, ob man sie nutzen soll. Zeiten und Notdienst nur über die offizielle Quelle (Apotheken: aponet.de; ärztlicher Bereitschaftsdienst: 116 117; Bank: die Bank selbst)." });
  const pointers = [];
  if (hasPos && lat > 47 && lat < 55.5 && lon > 5.5 && lon < 15.5) { pointers.push({ tool: "get_dwd_warnings", why: "official weather warnings for the state", url: "https://orbstudio.org/api/v1/weather/warnings-de?state=" + hol.state }); pointers.push({ tool: "get_flood_warnings", why: "flood warnings, relevant for places by a river or the coast", url: "https://orbstudio.org/api/v1/hydro/flood-warnings" }); }
  if (hasPos && lat > 53.3 && lat < 53.8 && lon > 9.6 && lon < 10.4) pointers.push({ tool: "get_roads", why: "jams, closures and roadworks on the motorways around Hamburg", url: "https://orbstudio.org/api/v1/roads" });
  if (ROAD.test(text)) pointers.push({ tool: "get_parking_de", why: "live parking occupancy where we have it (Karlsruhe region, Leipzig P+R)", url: "https://orbstudio.org/api/v1/parking-de" });
  pointers.push({ tool: "check_claim", why: "for any description claim like 'only', 'oldest', 'best' on the place's page", url: "https://orbstudio.org/api/v1/check-claim?claim=" });
  const report = {
    tool: "check_place", place: name, date, holiday: hol, rating, review_ages: ages, hours,
    position_given: hasPos, flags, flag_count: flags.length, not_provided: missing, notes, pointers: pointers.slice(0, 5),
    report_back: flags.some((f) => f.zone === "stale_data" && /disagree|расходятся|widersprechen/.test(f.en + f.ru + f.de)) ? { en: "If you are sure which version is right, the person can report the mistake in the map app (menu: report a map error or edit the place). We never edit anything.", ru: "Если вы точно знаете, какая версия верна, человек может сообщить об ошибке в самом приложении карт (меню: ошибка на карте или изменить место). Мы сами ничего не правим.", de: "Wenn du sicher weißt, welche Version stimmt, kann die Person den Fehler in der Karten-App melden (Menü: Kartenfehler melden oder Ort bearbeiten). Wir ändern selbst nichts." } : null,
    limits: "Works only on the fields the agent passes; Orb Studio does not read, copy or store Google Maps content. One-off holidays (a single year, a single state) are not modelled. Thresholds for rating size are working assumptions. Not a recommendation to go or not to go.",
    rule: "Show what was checked and what was not; hours and reviews come from the agent, holidays from fixed rules. Orb Studio is not affiliated with Google; Google Maps is a trademark of Google LLC.",
    see: "https://orbstudio.org/tools/crystals",
  };
  return report;
}
