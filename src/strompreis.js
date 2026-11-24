// Страница «Strompreis morgen» (/de/strompreis-morgen): биржевая цена электричества DE-LU на завтра по часам,
// самое дешёвое и самое дорогое окно в 3 часа, сравнение с сегодня. Данные — датчик power из /api/v1/sensors
// (Energy-Charts / SMARD, CC BY 4.0). Страница собирается на сервере целиком: поисковик и агент видят цифры без JavaScript.
// Цель — люди из поиска («Strompreis morgen», «günstigste Stunden Strom»), а не только агенты.

const TZ = "Europe/Berlin";
const DAY_FMT = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }); // один форматтер: в датчике сотни точек
const dayOf = (t) => DAY_FMT.format(new Date(t));
const hm = (t) => new Date(t).toLocaleTimeString("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
const nextDay = (day) => new Date(Date.parse(day + "T12:00:00Z") + 864e5).toISOString().slice(0, 10);
const longDay = (day) => new Date(Date.parse(day + "T12:00:00Z")).toLocaleDateString("de-DE", { timeZone: TZ, weekday: "long", day: "numeric", month: "long", year: "numeric" });
const ct = (eur) => (eur / 10).toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const eurF = (eur) => Math.round(eur).toLocaleString("de-DE");
const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const WINDOW_H = 3; // окно для стирки, зарядки машины и т. п.

// Почасовые средние из точек по 15 минут (ключ — час по UTC: смещение Берлина целое, переход на зимнее время не склеивает часы)
export function hourlyFromPoints(pts, days) {
  const by = new Map();
  for (const x of pts || []) { if (typeof x.p !== "number" || !days.includes(dayOf(x.t))) continue;
    const k = Math.floor(x.t / 3600e3); const a = by.get(k) || []; a.push(x.p); by.set(k, a); }
  return [...by.entries()].sort((a, b) => a[0] - b[0]).map(([k, a]) => ({ t: new Date(k * 3600e3).toISOString(), eur_mwh: +(a.reduce((s, v) => s + v, 0) / a.length).toFixed(2) }));
}

function windows(hours, w) {
  let cheap = null, dear = null;
  for (let i = 0; i + w <= hours.length; i++) {
    const sl = hours.slice(i, i + w);
    if (Date.parse(sl[w - 1].t) - Date.parse(sl[0].t) !== (w - 1) * 3600e3) continue; // только подряд идущие часы
    const avg = sl.reduce((s, h) => s + h.eur_mwh, 0) / w;
    const o = { from: sl[0].t, to: new Date(Date.parse(sl[w - 1].t) + 3600e3).toISOString(), avg_eur_mwh: +avg.toFixed(2) };
    if (!cheap || avg < cheap.avg_eur_mwh) cheap = o;
    if (!dear || avg > dear.avg_eur_mwh) dear = o;
  }
  return { cheap, dear };
}

// Что показывать: завтра, если цены уже опубликованы (≥ 20 часов), иначе сегодня с пометкой «завтра около 13 Uhr»
export function strompreisModel(power, now = Date.now()) {
  if (!power || typeof power.now_eur_mwh !== "number") return null;
  const today = dayOf(now), tomorrow = nextDay(today), all = Array.isArray(power.hourly) ? power.hourly : [];
  const tom = all.filter((h) => dayOf(h.t) === tomorrow), tod = all.filter((h) => dayOf(h.t) === today);
  const isTomorrow = tom.length >= 20 || (!all.length && power.tomorrow_published && !!power.tomorrow);
  const day = isTomorrow ? tomorrow : today, hours = isTomorrow ? tom : tod;
  const st = isTomorrow ? power.tomorrow : power.today;
  // сегодня: окна только из оставшихся часов (прошедшее дешёвое окно никому не поможет)
  const ahead = isTomorrow ? hours : hours.filter((h) => Date.parse(h.t) + 3600e3 > now);
  const { cheap, dear } = ahead.length >= WINDOW_H ? windows(ahead, WINDOW_H) : { cheap: null, dear: null };
  const vs = isTomorrow && power.tomorrow && power.today && power.today.avg_eur_mwh > 0
    ? +((power.tomorrow.avg_eur_mwh / power.today.avg_eur_mwh - 1) * 100).toFixed(1) : null;
  return { mode: isTomorrow ? "tomorrow" : "today", day, day_label: longDay(day), hours, stats: st || null, cheap, dear, vs_today_pct: vs,
    now_eur_mwh: power.now_eur_mwh, now_at: power.now_at, renewable_share_pct: power.renewables ? power.renewables.renewable_share_pct : null,
    source: power.source, source_url: power.source_url };
}

const FAQ = [
  ["Wann stehen die Strompreise für morgen fest?", "Die Day-Ahead-Auktion der Strombörse für Deutschland und Luxemburg läuft jeden Tag um 12 Uhr. Die Preise für den nächsten Tag sind meist gegen 13 Uhr öffentlich; diese Seite zeigt sie, sobald Energy-Charts sie liefert."],
  ["Ist das mein Strompreis zu Hause?", "Nein. Das ist der Großhandelspreis an der Börse ohne Netzentgelte, Steuern, Umlagen und Marge des Anbieters. Für Haushalte mit einem dynamischen Stromtarif zeigt er aber, zu welchen Stunden Strom günstiger oder teurer ist."],
  ["Wofür ist das günstigste 3-Stunden-Fenster gut?", "Für alles, was sich verschieben lässt: Waschmaschine, Trockner, Spülmaschine, E-Auto oder Wärmepumpe mit Speicher. Wer einen festen Tarif hat, spart dadurch nichts, entlastet aber das Netz zu teuren Spitzenzeiten."],
  ["Woher kommen die Daten?", "Von Energy-Charts (Fraunhofer ISE) mit Daten der Bundesnetzagentur | SMARD.de, Lizenz CC BY 4.0. Orb Studio rechnet daraus Stundenmittel und Fenster und aktualisiert die Seite alle 5 Minuten."],
];

export function strompreisHtml(m, origin = "https://orbstudio.org", updated = new Date()) {
  const url = origin + "/de/strompreis-morgen";
  const title = m && m.mode === "tomorrow" ? `Strompreis morgen, ${m.day_label}: günstigste Stunden · Orb Studio` : "Strompreis morgen und heute: günstigste Stunden an der Börse · Orb Studio";
  let desc = "Börsenstrompreis Deutschland (Day-Ahead DE-LU) für morgen nach Stunden: günstigstes und teuerstes 3-Stunden-Fenster in ct/kWh, alle 5 Minuten aktualisiert.";
  if (m && m.cheap) desc = `Strompreis ${m.mode === "tomorrow" ? "morgen" : "heute"}: am günstigsten ${hm(m.cheap.from)}–${hm(m.cheap.to)} Uhr (${ct(m.cheap.avg_eur_mwh)} ct/kWh Börse), am teuersten ${hm(m.dear.from)}–${hm(m.dear.to)} Uhr (${ct(m.dear.avg_eur_mwh)} ct/kWh). Day-Ahead DE-LU, alle Stunden.`;
  const parts = [];
  if (!m) parts.push(`<div class="card"><p>Die Börsendaten sind gerade nicht erreichbar. Bitte in ein paar Minuten neu laden.</p></div>`);
  else {
    const h1 = m.mode === "tomorrow" ? `Strompreis morgen` : `Strompreis heute`;
    const sub = m.mode === "tomorrow" ? esc(m.day_label) : `${esc(m.day_label)} · die Preise für morgen erscheinen meist gegen 13 Uhr`;
    parts.push(`<header><div class="eyebrow">Börse · Day-Ahead · Deutschland/Luxemburg</div><h1>${h1}</h1><p class="lead">${sub}</p></header>`);
    const tiles = [];
    const rest = m.mode === "today" ? " (ab jetzt)" : "";
    if (m.cheap) tiles.push(`<div class="tile good"><div class="k">Günstigste 3 Stunden${rest}</div><div class="v">${hm(m.cheap.from)}–${hm(m.cheap.to)}</div><div class="s">Ø ${ct(m.cheap.avg_eur_mwh)} ct/kWh · ${eurF(m.cheap.avg_eur_mwh)} €/MWh</div></div>`);
    if (m.dear) tiles.push(`<div class="tile bad"><div class="k">Teuerste 3 Stunden${rest}</div><div class="v">${hm(m.dear.from)}–${hm(m.dear.to)}</div><div class="s">Ø ${ct(m.dear.avg_eur_mwh)} ct/kWh · ${eurF(m.dear.avg_eur_mwh)} €/MWh</div></div>`);
    if (m.stats) tiles.push(`<div class="tile"><div class="k">Tagesmittel</div><div class="v">${ct(m.stats.avg_eur_mwh)} ct/kWh</div><div class="s">${m.vs_today_pct != null ? `${m.vs_today_pct > 0 ? "+" : ""}${m.vs_today_pct.toLocaleString("de-DE")} % gegenüber heute` : `min ${ct(m.stats.min_eur_mwh)} · max ${ct(m.stats.max_eur_mwh)} ct/kWh`}</div></div>`);
    tiles.push(`<div class="tile"><div class="k">Jetzt (${hm(m.now_at)})</div><div class="v">${ct(m.now_eur_mwh)} ct/kWh</div><div class="s">${m.renewable_share_pct != null ? `Wind, Sonne & Co.: ${m.renewable_share_pct} %` : `${eurF(m.now_eur_mwh)} €/MWh`}</div></div>`);
    parts.push(`<div class="tiles">${tiles.join("")}</div>`);
    if (m.stats && m.stats.negative_quarter_hours > 0) parts.push(`<div class="card note">Negative Preise: ${m.stats.negative_quarter_hours} Viertelstunden – dann bekommt der Abnehmer an der Börse sogar Geld für den Strom.</div>`);
    if (m.hours.length) {
      const mx = Math.max(...m.hours.map((h) => h.eur_mwh), 1), inW = (w, t) => w && t >= w.from && t < w.to;
      const rows = m.hours.map((h) => { const cls = inW(m.cheap, h.t) ? "good" : inW(m.dear, h.t) ? "bad" : h.eur_mwh < 0 ? "neg" : "";
        const end = new Date(Date.parse(h.t) + 3600e3).toISOString();
        return `<tr class="${cls}"><td>${hm(h.t)}–${hm(end)}</td><td class="n">${ct(h.eur_mwh)}</td><td class="n dim">${eurF(h.eur_mwh)}</td><td class="bar"><i style="width:${Math.max(0, Math.round((h.eur_mwh / mx) * 100))}%"></i></td></tr>`; }).join("");
      parts.push(`<section class="card"><h2>Alle Stunden ${m.mode === "tomorrow" ? "morgen" : "heute"}</h2><table><thead><tr><th>Uhrzeit</th><th class="n">ct/kWh</th><th class="n">€/MWh</th><th></th></tr></thead><tbody>${rows}</tbody></table><p class="dim small">Grün: günstigstes 3-Stunden-Fenster, rot: teuerstes. Stundenmittel aus Viertelstundenpreisen.</p></section>`);
    }
  }
  parts.push(`<section class="card"><h2>Häufige Fragen</h2>${FAQ.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join("")}</section>`);
  parts.push(`<footer class="dim small">Aktualisiert: ${esc(updated.toLocaleString("de-DE", { timeZone: TZ }))} (Berlin). Quelle: <a href="https://www.energy-charts.info" rel="noopener">Energy-Charts (Fraunhofer ISE)</a>, Daten Bundesnetzagentur | SMARD.de, CC BY 4.0. Maschinenlesbar: <a href="/api/v1/sensors">/api/v1/sensors</a> (Block power). Alle Sensoren: <a href="/de/sensors">orbstudio.org/de/sensors</a>. Kein Tarifvergleich und keine Beratung.</footer>`);
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
<link rel="alternate" type="application/json" href="/api/v1/sensors" title="Orb Studio sensors (JSON, block power)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700&family=IBM+Plex+Sans:wght@400;500&family=JetBrains+Mono:wght@400;600&display=swap">
<style>
:root{--bg:#05070e;--panel:#0b1222;--line:#1b2944;--fg:#e4ebf8;--dim:#8796b6;--holo:#6fe6ff;--up:#4fd8a4;--hot:#ff5d7a;--display:"Chakra Petch",system-ui,sans-serif;--body:"IBM Plex Sans",system-ui,sans-serif;--mono:"JetBrains Mono",ui-monospace,monospace;color-scheme:dark}
*{box-sizing:border-box}body{background:var(--bg);color:var(--fg);font-family:var(--body);margin:0;line-height:1.5}a{color:var(--holo)}
.wrap{max-width:860px;margin:0 auto;padding:16px max(16px,env(safe-area-inset-left,0px)) 28px;display:flex;flex-direction:column;gap:14px}
h1{font-family:var(--display);font-size:26px;letter-spacing:.06em;margin:4px 0 0}h2{font-family:var(--display);font-size:16px;letter-spacing:.08em;margin:0 0 8px;color:var(--holo)}h3{font-size:15px;margin:14px 0 2px}
.eyebrow{font-family:var(--mono);font-size:11px;letter-spacing:.16em;color:var(--dim);text-transform:uppercase}.lead{color:var(--dim);margin:2px 0 0}
.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px}.card p{margin:4px 0}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px}
.tile{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:14px}.tile .k{font-family:var(--mono);font-size:11px;letter-spacing:.1em;color:var(--dim);text-transform:uppercase}
.tile .v{font-family:var(--display);font-size:24px;margin-top:4px}.tile .s{color:var(--dim);font-size:13px}.tile.good{border-color:var(--up)}.tile.good .v{color:var(--up)}.tile.bad{border-color:var(--hot)}.tile.bad .v{color:var(--hot)}
.note{border-color:var(--up)}
table{width:100%;border-collapse:collapse;font-family:var(--mono);font-size:13px}th{color:var(--dim);font-weight:400;text-align:left;padding:4px 6px}td{padding:4px 6px;border-top:1px solid var(--line)}
.n{text-align:right;white-space:nowrap}.dim{color:var(--dim)}.small{font-size:12px}.bar{width:38%}.bar i{display:block;height:8px;border-radius:4px;background:var(--holo);opacity:.55}
tr.good td{color:var(--up)}tr.good .bar i{background:var(--up);opacity:1}tr.bad td{color:var(--hot)}tr.bad .bar i{background:var(--hot);opacity:1}tr.neg td{color:var(--up)}
@media (max-width:480px){.bar{width:28%}td,th{padding:4px 3px}}
</style>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, "\\u003c")}</script>
</head>
<body><main class="wrap">
<nav class="small"><a href="/de/">Orb Studio</a> › <a href="/de/sensors">Sensoren</a> › Strompreis morgen</nav>
${parts.join("\n")}
</main></body>
</html>`;
}
