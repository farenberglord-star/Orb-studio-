// Страница «Hat heute geöffnet? Feiertag heute» (/de/feiertag-heute): праздничный ли сегодня день в каждой земле Германии, воскресенье ли,
// ближайший праздник. Праздники считаются по правилам (src/place.js), без обращения к сети; страница собирается на сервере целиком.
// Цель — люди из поиска («Feiertag heute Hamburg», «Hat heute geöffnet»), а не только агенты. Только по-немецки.
import { holidayInfo } from "./place.js";

const TZ = "Europe/Berlin";
const DAY_FMT = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
export const LAENDER = [["BW", "Baden-Württemberg"], ["BY", "Bayern"], ["BE", "Berlin"], ["BB", "Brandenburg"], ["HB", "Bremen"], ["HH", "Hamburg"], ["HE", "Hessen"], ["MV", "Mecklenburg-Vorpommern"], ["NI", "Niedersachsen"], ["NW", "Nordrhein-Westfalen"], ["RP", "Rheinland-Pfalz"], ["SL", "Saarland"], ["SN", "Sachsen"], ["ST", "Sachsen-Anhalt"], ["SH", "Schleswig-Holstein"], ["TH", "Thüringen"]];
const longDay = (day) => new Date(Date.parse(day + "T12:00:00Z")).toLocaleDateString("de-DE", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const shortDay = (day) => new Date(Date.parse(day + "T12:00:00Z")).toLocaleDateString("de-DE", { timeZone: TZ, weekday: "short", day: "numeric", month: "numeric" });

export function feiertagModel(now = Date.now()) {
  const date = DAY_FMT.format(new Date(now));
  const rows = LAENDER.map(([code, name]) => ({ code, name, ...holidayInfo(date, code) }));
  const hh = rows.find((r) => r.code === "HH");
  return { date, label: longDay(date), rows, hh, holiday_states: rows.filter((r) => r.is_public_holiday).map((r) => r.name), sunday: hh.is_sunday, eve: hh.eve };
}

const FAQ = [
  ["Ist heute in Hamburg ein Feiertag?", "Die Tabelle oben zeigt es für jedes Bundesland. Die Feiertage werden nach festen Regeln berechnet (Ostern, feste Daten, Bußtag), nicht aus einer Datenbank abgefragt."],
  ["Haben Geschäfte am Feiertag und am Sonntag geöffnet?", "In der Regel nein: An gesetzlichen Feiertagen und an Sonntagen sind die meisten Geschäfte in Deutschland geschlossen. Ausnahmen sind zum Beispiel Tankstellen, Läden in Bahnhöfen, Bäckereien mit Sonderzeiten und verkaufsoffene Sonntage. Museen, Cafés und Restaurants haben oft geöffnet, aber nicht immer zu den üblichen Zeiten."],
  ["Gilt der Feiertag in ganz Deutschland?", "Nein. Nur einige gelten bundesweit (zum Beispiel Neujahr, Karfreitag, Ostermontag, 1. Mai, Christi Himmelfahrt, Pfingstmontag, 3. Oktober und beide Weihnachtstage). Andere, zum Beispiel Fronleichnam, Allerheiligen oder der Reformationstag, gelten nur in einzelnen Ländern; manche auch nur in Teilen eines Landes."],
  ["Was ist mit Heiligabend und Silvester?", "Beide sind keine gesetzlichen Feiertage. Viele Geschäfte und Dienste schließen an diesen Tagen aber früher; die Seite weist darauf hin."],
  ["Was ist nicht eingerechnet?", "Einmalige Feiertage, die nur in einem Jahr und einem Land galten, und örtliche Feste. Die Öffnungszeiten eines Ortes bestätigt nur der Ort selbst: offizielle Seite oder Telefon."],
];

export function feiertagHtml(m, origin = "https://orbstudio.org", updated = new Date()) {
  const url = origin + "/de/feiertag-heute";
  const hhTxt = m.hh.is_public_holiday ? `Heute ist in Hamburg ein Feiertag (${m.hh.holiday})` : m.hh.is_sunday ? "Heute ist Sonntag in Hamburg" : "Heute ist in Hamburg kein Feiertag";
  const title = `Hat heute geöffnet? Feiertag heute, ${m.label}: alle Bundesländer · Orb Studio`;
  const desc = `${hhTxt}. Feiertag heute in allen 16 Bundesländern, ob Sonntag ist und der nächste Feiertag – berechnet nach festen Regeln, täglich aktuell.`;
  const parts = [];
  parts.push(`<header><div class="eyebrow">Feiertage · Öffnungszeiten · Deutschland</div><h1>Hat heute geöffnet?</h1><p class="lead">${esc(m.label)}</p></header>`);
  const tiles = [];
  tiles.push(`<div class="tile ${m.hh.is_public_holiday ? "bad" : "good"}"><div class="k">Hamburg heute</div><div class="v">${m.hh.is_public_holiday ? esc(m.hh.holiday) : "kein Feiertag"}</div><div class="s">${esc(m.hh.weekday)}${m.hh.is_sunday ? " · Sonntag: die meisten Läden geschlossen" : ""}</div></div>`);
  tiles.push(`<div class="tile"><div class="k">Feiertag in Deutschland</div><div class="v">${m.holiday_states.length ? `${m.holiday_states.length} von 16 Ländern` : "in keinem Land"}</div><div class="s">${m.holiday_states.length ? esc(m.holiday_states.join(", ")) : "heute überall regulärer Werktag oder Sonntag"}</div></div>`);
  if (m.hh.next_holiday) tiles.push(`<div class="tile"><div class="k">Nächster Feiertag in Hamburg</div><div class="v">${esc(m.hh.next_holiday.name)}</div><div class="s">${esc(shortDay(m.hh.next_holiday.date))} · in ${m.hh.next_holiday.in_days} ${m.hh.next_holiday.in_days === 1 ? "Tag" : "Tagen"}</div></div>`);
  parts.push(`<div class="tiles">${tiles.join("")}</div>`);
  if (m.eve) parts.push(`<div class="card note">${esc(m.eve)} ist kein gesetzlicher Feiertag, aber viele Geschäfte und Dienste schließen heute früher.</div>`);
  const rows = m.rows.map((r) => `<tr class="${r.is_public_holiday ? "bad" : ""}"><td>${esc(r.name)}</td><td>${r.is_public_holiday ? "Feiertag: " + esc(r.holiday) + (r.partial_note ? ` (${esc(r.partial_note)})` : "") : "kein Feiertag"}</td><td class="dim">${r.next_holiday ? esc(r.next_holiday.name) + ", " + esc(shortDay(r.next_holiday.date)) : "–"}</td></tr>`).join("");
  parts.push(`<section class="card"><h2>Feiertag heute nach Bundesland</h2><table><thead><tr><th>Land</th><th>Heute</th><th>Nächster Feiertag</th></tr></thead><tbody>${rows}</tbody></table><p class="dim small">Gesetzliche Feiertage nach festen Regeln berechnet. Einmalige Feiertage und örtliche Feste sind nicht eingerechnet. Die Öffnungszeiten eines Ortes bestätigt nur der Ort selbst.</p></section>`);
  parts.push(`<section class="card"><h2>Für Agenten und Apps</h2><p>Ein KI-Assistent, der einen Ort aus einer Karte beschreibt, kann seine Angaben mit dem kostenlosen Werkzeug <code>check_place</code> prüfen lassen: <a href="/api/v1/place?name=Museum&state=HH">/api/v1/place</a>. Mehr dazu: <a href="/de/tools/maps">Orb Studio und Kartenkarten</a>.</p></section>`);
  parts.push(`<section class="card"><h2>Häufige Fragen</h2>${FAQ.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}</section>`);
  parts.push(`<footer class="dim small">Aktualisiert: ${esc(updated.toLocaleString("de-DE", { timeZone: TZ }))} (Berlin). Berechnet von Orb Studio, ohne externe Datenquelle. Keine Rechtsberatung; maßgeblich sind die Feiertagsgesetze der Länder.</footer>`);
  const ld = { "@context": "https://schema.org", "@graph": [
    { "@type": "WebPage", name: title, url, inLanguage: "de", dateModified: updated.toISOString(), description: desc, isPartOf: { "@type": "WebSite", name: "Orb Studio", url: origin + "/" } },
    { "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
  ] };
  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Orb Studio">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
:root{--bg:#05070e;--panel:#0b1222;--line:#1b2944;--fg:#e4ebf8;--dim:#8796b6;--holo:#6fe6ff;--up:#4fd8a4;--hot:#ff5d7a;--display:system-ui,sans-serif;--body:system-ui,sans-serif;--mono:ui-monospace,monospace;color-scheme:dark}
*{box-sizing:border-box}body{background:var(--bg);color:var(--fg);font-family:var(--body);margin:0;line-height:1.5}a{color:var(--holo)}
.wrap{max-width:860px;margin:0 auto;padding:16px max(16px,env(safe-area-inset-left,0px)) 28px;display:flex;flex-direction:column;gap:14px}
h1{font-size:26px;letter-spacing:.04em;margin:4px 0 0}h2{font-size:16px;letter-spacing:.06em;margin:0 0 8px;color:var(--holo)}h3{font-size:15px;margin:14px 0 2px}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--dim);text-transform:uppercase}.lead{color:var(--dim);margin:2px 0 0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}.card p{margin:4px 0}code{font-family:var(--mono);color:var(--holo)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px}.tile .k{font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--dim);text-transform:uppercase}
.tile .v{font-size:22px;margin-top:4px;font-weight:600}.tile .s{color:var(--dim);font-size:13px}.tile.good{border-color:var(--up)}.tile.good .v{color:var(--up)}.tile.bad{border-color:var(--hot)}.tile.bad .v{color:var(--hot)}
.note{border-color:var(--up)}
table{width:100%;border-collapse:collapse;font-size:14px}th{color:var(--dim);font-weight:400;text-align:left;padding:5px 6px}td{padding:5px 6px;border-top:1px solid var(--line)}
tr.bad td{color:var(--hot)}.dim{color:var(--dim)}.small{font-size:12px}
</style>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
</head>
<body><main class="wrap">
${parts.join("\n")}
</main></body>
</html>`;
}
