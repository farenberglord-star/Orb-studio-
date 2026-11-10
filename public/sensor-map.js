/* Orb Studio sensor map: embedded Natural Earth outline (no tiles, no external requests), DACH inset, live status on click. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var T = {
    ru: { eyebrow: "Живая карта источников", title: "Карта датчиков", lead: "Только живые датчики с настоящим местом или охватом. Метка стоит там, где измеряется явление, или там, где сидит учреждение-источник. Статус проверяется запросом к нашему API в момент клика.",
      world: "Мир", dach: "Германия · Австрия · Швейцария", map_label: "Карта датчиков", scope_de: "По всей Германии", scope_world: "По всему миру", pin_point: "Точка измерения", pin_area: "Район", pin_source: "Место источника (учреждение)",
      pick: "Выбери датчик на карте или в списке.", checking: "Проверяю…", status: "Статус", status_ok: "работает", status_cached: "работает (ответ из кэша)", status_degraded: "источник не ответил, показана копия", status_unavailable: "источник не отвечает", status_not_configured: "не настроен", status_unknown: "ответ получен",
      time_stand: "Состояние на", time_published: "Последняя публикация источника", time_generated: "Данные собраны", time_gasday: "Газовые сутки", time_measured: "Последнее измерение", source: "Источник", licence: "Лицензия", where: "Место", api: "API", mcp: "MCP-инструмент", all: "Все датчики", sensors_page: "Страница датчиков", llms: "Описание для агентов",
      fail: "Запрос не удался — цифры не выдумываю.", loc_point: "точка измерения", loc_area: "район", loc_source: "место учреждения-источника", loc_de: "вся Германия", loc_world: "весь мир", credit: "Границы: Natural Earth (общественное достояние). Города даны для ориентира.", open_api: "Открыть ответ API" },
    de: { eyebrow: "Lebendige Karte der Quellen", title: "Sensorkarte", lead: "Nur Live-Sensoren mit echtem Ort oder Geltungsbereich. Ein Pin steht dort, wo gemessen wird, oder am Sitz der Quellbehörde. Der Status wird beim Klick per Abfrage an unsere API geprüft.",
      world: "Welt", dach: "Deutschland · Österreich · Schweiz", map_label: "Sensorkarte", scope_de: "Deutschlandweit", scope_world: "Weltweit", pin_point: "Messpunkt", pin_area: "Gebiet", pin_source: "Sitz der Quelle (Behörde)",
      pick: "Sensor auf der Karte oder in der Liste wählen.", checking: "Prüfe …", status: "Status", status_ok: "läuft", status_cached: "läuft (Antwort aus dem Cache)", status_degraded: "Quelle antwortet nicht, Kopie wird gezeigt", status_unavailable: "Quelle antwortet nicht", status_not_configured: "nicht eingerichtet", status_unknown: "Antwort erhalten",
      time_stand: "Stand", time_published: "Letzte Veröffentlichung der Quelle", time_generated: "Daten erhoben", time_gasday: "Gastag", time_measured: "Letzte Messung", source: "Quelle", licence: "Lizenz", where: "Ort", api: "API", mcp: "MCP-Tool", all: "Alle Sensoren", sensors_page: "Sensorseite", llms: "Beschreibung für Agenten",
      fail: "Abfrage fehlgeschlagen — ich erfinde keine Zahlen.", loc_point: "Messpunkt", loc_area: "Gebiet", loc_source: "Sitz der Quellbehörde", loc_de: "ganz Deutschland", loc_world: "weltweit", credit: "Grenzen: Natural Earth (gemeinfrei). Städte dienen der Orientierung.", open_api: "API-Antwort öffnen" },
    en: { eyebrow: "Live map of sources", title: "Sensor map", lead: "Only live sensors with a real place or scope. A pin marks where something is measured, or where the source institution sits. Status is checked with a request to our API when you click.",
      world: "World", dach: "Germany · Austria · Switzerland", map_label: "Sensor map", scope_de: "Germany-wide", scope_world: "Worldwide", pin_point: "Measuring point", pin_area: "Area", pin_source: "Seat of the source (institution)",
      pick: "Pick a sensor on the map or in the list.", checking: "Checking…", status: "Status", status_ok: "running", status_cached: "running (answer from cache)", status_degraded: "source did not answer, showing a copy", status_unavailable: "source not answering", status_not_configured: "not configured", status_unknown: "answer received",
      time_stand: "As of", time_published: "Latest publication by the source", time_generated: "Data collected", time_gasday: "Gas day", time_measured: "Latest measurement", source: "Source", licence: "Licence", where: "Place", api: "API", mcp: "MCP tool", all: "All sensors", sensors_page: "Sensors page", llms: "Description for agents",
      fail: "Request failed — I don't invent numbers.", loc_point: "measuring point", loc_area: "area", loc_source: "seat of the source institution", loc_de: "all of Germany", loc_world: "worldwide", credit: "Borders: Natural Earth (public domain). Cities are for orientation.", open_api: "Open the API response" }
  };
  var CSS = ".osm{--bg:#05070e;--panel:#0b1222;--line:#1b2944;--fg:#e4ebf8;--dim:#8796b6;--holo:#6fe6ff;--warm:#ffb547;--hot:#ff5d7a;--up:#4fd8a4;--violet:#a99bff;font-family:'IBM Plex Sans',system-ui,sans-serif;color:var(--fg)}" +
    ".osm *{box-sizing:border-box}.osm a{color:var(--holo)}.osm h2{font:700 20px/1.2 'Chakra Petch',system-ui,sans-serif;letter-spacing:.1em;margin:4px 0 0}" +
    ".osm .eb{font:11px/1 'JetBrains Mono',ui-monospace,monospace;letter-spacing:.16em;color:var(--dim);text-transform:uppercase}.osm .ld{color:var(--dim);font-size:14px;line-height:1.5;margin:8px 0 0;max-width:68ch}" +
    ".osm .top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}.osm .lang{display:flex;gap:2px;border:1px solid var(--line);border-radius:8px;padding:2px}" +
    ".osm .lang button{font:12px 'JetBrains Mono',monospace;background:none;border:0;color:var(--dim);padding:6px 9px;border-radius:6px;cursor:pointer}.osm .lang button[aria-pressed=true]{color:var(--holo);background:rgba(111,230,255,.1)}" +
    ".osm .grid{display:grid;grid-template-columns:1fr;gap:14px;margin-top:14px}@media(min-width:900px){.osm .grid{grid-template-columns:1.35fr 1fr}}" +
    ".osm .grid>*{min-width:0}.osm .pn{position:relative;background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:12px;overflow:hidden}.osm .pn h3{font:11px/1 'JetBrains Mono',monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--dim);margin:0 0 8px}" +
    ".osm svg{display:block;width:100%;height:auto}.osm .sea{fill:#060a15}.osm .land{fill:#15233f;stroke:#2a3f6a;stroke-width:.5}.osm .dachw{fill:rgba(111,230,255,.28);stroke:var(--holo);stroke-width:.8;filter:drop-shadow(0 0 4px rgba(111,230,255,.7))}" +
    ".osm .nb{fill:#101a30;stroke:#243659;stroke-width:.6}.osm .dc{fill:#1b2e55;stroke:#4a6aa6;stroke-width:1}.osm .dc.hl{fill:rgba(111,230,255,.2);stroke:var(--holo);stroke-width:1.6}" +
    ".osm .city{fill:#52627f}.osm .cl{font:10px 'JetBrains Mono',monospace;fill:#6f7f9d}.osm .ring{fill:none;stroke:var(--holo);stroke-width:1.2;stroke-dasharray:3 3}" +
    ".osm .pin{cursor:pointer;outline:none}.osm .pin .pd{fill:var(--up);stroke:#04110c;stroke-width:1.5}.osm .pin.src .pd{fill:var(--warm)}.osm .pin .ph{fill:none;stroke:var(--up);stroke-width:1.2;opacity:.6}.osm .pin.src .ph{stroke:var(--warm)}" +
    ".osm .pin:hover .ph,.osm .pin:focus-visible .ph,.osm .pin.on .ph{opacity:1;stroke-width:2.2}.osm .pin.on .pd{stroke:#fff}.osm .ld2{stroke:#3a5486;stroke-width:1;stroke-dasharray:2 2}" +
    "@media(prefers-reduced-motion:no-preference){.osm .pin .ph{animation:osmp 2.6s ease-out infinite}@keyframes osmp{0%{r:8;opacity:.8}100%{r:15;opacity:0}}}" +
    ".osm .chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;align-items:center}.osm .chips b{font:11px 'JetBrains Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--dim);font-weight:400;margin-right:2px}" +
    ".osm .chip{font:12px 'JetBrains Mono',monospace;color:var(--fg);background:#0f1a30;border:1px solid var(--line);border-radius:999px;padding:6px 11px;cursor:pointer}.osm .chip:hover,.osm .chip:focus-visible,.osm .chip.on{border-color:var(--holo);color:var(--holo);outline:none}" +
    ".osm .legend{display:flex;gap:14px;flex-wrap:wrap;font-size:12px;color:var(--dim);margin-top:8px}.osm .legend i{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--up);margin-right:5px;vertical-align:-1px}.osm .legend i.s{background:var(--warm)}" +
    ".osm .card{min-height:150px}.osm .card h4{font:700 17px 'Chakra Petch',sans-serif;letter-spacing:.06em;margin:0 0 6px}.osm .card p{margin:6px 0;font-size:14px;line-height:1.5;color:var(--dim)}" +
    ".osm dl{display:grid;grid-template-columns:max-content 1fr;gap:5px 12px;margin:10px 0 0;font-size:13px}.osm dt{color:var(--dim);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.06em;text-transform:uppercase;padding-top:2px}.osm dd{margin:0;word-break:break-word}" +
    ".osm .st{display:inline-block;border-radius:999px;padding:2px 9px;font:12px 'JetBrains Mono',monospace;border:1px solid var(--up);color:var(--up)}.osm .st.w{border-color:var(--warm);color:var(--warm)}.osm .st.b{border-color:var(--hot);color:var(--hot)}.osm .st.g{border-color:var(--dim);color:var(--dim)}" +
    ".osm.compact svg{max-height:560px}.osm .lst{margin-top:14px;display:flex;flex-wrap:wrap;gap:6px}.osm .foot{margin-top:14px;font-size:12px;color:var(--dim);display:flex;gap:14px;flex-wrap:wrap}.osm code{font-family:'JetBrains Mono',monospace;font-size:12px;color:var(--holo)}";
  function el(n, a, kids) { var e = document.createElement(n); if (a) for (var k in a) { if (k === "text") e.textContent = a[k]; else e.setAttribute(k, a[k]); } (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function sv(n, a, kids) { var e = document.createElementNS(NS, n); if (a) for (var k in a) e.setAttribute(k, a[k]); (kids || []).forEach(function (c) { if (c) e.appendChild(c); }); return e; }
  function path(d, cls) { return sv("path", { d: d, "class": cls }); }
  // Equal Earth, same constants as tools/map_build.mjs
  var A1 = 1.340264, A2 = -0.081106, A3 = 0.000893, A4 = 0.003796, S3 = Math.sqrt(3), RAD = Math.PI / 180, WX = 2.7066299836960743, WY = 1.3173627591574133;
  function projWorld(W, lon, lat) { var th = Math.asin(S3 / 2 * Math.sin(lat * RAD)), t2 = th * th, t6 = t2 * t2 * t2, ws = W / (2 * WX);
    var x = 2 * S3 * lon * RAD * Math.cos(th) / (3 * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))), y = th * (A1 + A2 * t2 + t6 * (A3 + A4 * t2)); return [(x + WX) * ws, (WY - y) * ws]; }
  function mer(lat) { return Math.log(Math.tan(Math.PI / 4 + lat * RAD / 2)) / RAD; }
  function pickLang(o) { var q = (location.search.match(/[?&]lang=(ru|de|en)/) || [])[1]; if (q) return q; if (o && o.lang) return o.lang; var l = (document.documentElement.lang || navigator.language || "ru").slice(0, 2).toLowerCase(); return T[l] ? l : "en"; }
  function fmtTime(iso, lang, kind) { if (!iso) return null; var d = new Date(iso); if (isNaN(d)) return String(iso).slice(0, 32);
    var loc = { ru: "ru-RU", de: "de-DE", en: "en-GB" }[lang];
    return kind === "gasday" ? d.toLocaleDateString(loc, { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric" }) : d.toLocaleString(loc, { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " (Berlin)"; }
  function statusOf(d) { if (!d || typeof d !== "object") return "unknown"; if (typeof d.status === "string") { var s = d.status; if (s === "ok" || s === "cached" || s === "degraded" || s === "unavailable" || s === "not_configured") return s; if (d.ok === false) return "unavailable"; return "ok"; } if (d.ok === false) return "unavailable"; if (typeof d.sources_ok === "number") return d.sources_ok > 0 ? (d.sources_ok < d.sources_total ? "degraded" : "ok") : "unavailable"; return "unknown"; }
  function mount(root, opts) {
    opts = opts || {}; var lang = pickLang(opts), geo = null, man = null, sel = null, tok = 0, pins = [], pinEls = {};
    if (!document.getElementById("osm-css")) { var st = el("style", { id: "osm-css" }); st.textContent = CSS; document.head.appendChild(st); }
    root.classList.add("osm"); if (opts.compact) root.classList.add("compact"); root.textContent = "";
    var tx = function (k) { return T[lang][k] || k; };
    function render() {
      root.textContent = ""; pins = []; pinEls = {};
      var langs = el("div", { "class": "lang", role: "group", "aria-label": "Language" }, ["ru", "de", "en"].map(function (l) { var b = el("button", { type: "button", "aria-pressed": String(l === lang), text: l.toUpperCase() }); b.onclick = function () { lang = l; try { document.documentElement.lang = l; } catch (e) {} render(); if (sel) select(sel, true); }; return b; }));
      root.appendChild(el("div", { "class": "top" }, [el("div", null, [el("div", { "class": "eb", text: tx("eyebrow") }), el("h2", { text: tx("title") }), el("p", { "class": "ld", text: tx("lead") })]), opts.noLang ? null : langs]));
      var grid = el("div", { "class": "grid" }); root.appendChild(grid);
      var left = el("div", { "class": "pn" }), right = el("div", { "class": "pn" }); grid.appendChild(right); grid.appendChild(left);
      // DACH inset with pins
      var I = geo.inset, svg = sv("svg", { viewBox: "0 0 " + I.w + " " + I.h, role: "img", "aria-label": tx("dach") });
      svg.appendChild(sv("rect", { width: I.w, height: I.h, "class": "sea" })); svg.appendChild(path(I.rest, "nb")); ["DE", "AT", "CH"].forEach(function (c) { var p = path(I.dach[c], "dc"); p.setAttribute("data-c", c); svg.appendChild(p); });
      I.cities.forEach(function (c) { svg.appendChild(sv("circle", { cx: c.x, cy: c.y, r: 2.5, "class": "city" })); svg.appendChild(sv("text", c.n === "Hamburg" ? { x: c.x + 14, y: c.y + 24, "class": "cl" } : { x: c.x + 6, y: c.y + 3.5, "class": "cl" }, [])).textContent = c.n; });
      var items = [];
      man.sensors.forEach(function (s) { (s.pins || []).forEach(function (p) { var x = (p.lon - I.bbox.lon0) / (I.bbox.lon1 - I.bbox.lon0) * I.w, y = (mer(I.bbox.lat1) - mer(p.lat)) / (mer(I.bbox.lat1) - mer(I.bbox.lat0)) * I.h; items.push({ s: s, p: p, tx: x, ty: y, x: x, y: y }); }); });
      for (var it = 0; it < 40; it++) for (var i = 0; i < items.length; i++) for (var j = i + 1; j < items.length; j++) { var a = items[i], b = items[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 0.01; if (d < 26) { var k = (26 - d) / 2 / d; a.x -= dx * k; a.y -= dy * k; b.x += dx * k; b.y += dy * k; } }
      items.forEach(function (m) { if (Math.hypot(m.x - m.tx, m.y - m.ty) > 3) { svg.appendChild(sv("line", { x1: m.tx, y1: m.ty, x2: m.x, y2: m.y, "class": "ld2" })); svg.appendChild(sv("circle", { cx: m.tx, cy: m.ty, r: 2, fill: "#3a5486" })); } });
      items.forEach(function (m) { var nm = m.s.name[lang] + " · " + m.p.label, g = sv("g", { "class": "pin " + (m.p.kind === "source" ? "src" : ""), tabindex: 0, role: "button", "aria-label": nm, transform: "translate(" + m.x + " " + m.y + ")" });
        g.appendChild(sv("circle", { r: 16, fill: "transparent" })); g.appendChild(sv("circle", { r: 8, "class": "ph" })); g.appendChild(sv("circle", { r: 6, "class": "pd" })); var t = sv("title"); t.textContent = nm; g.appendChild(t);
        g.onclick = function () { select(m.s.id); }; g.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(m.s.id); } }; (pinEls[m.s.id] = pinEls[m.s.id] || []).push(g); svg.appendChild(g); });
      right.appendChild(el("h3", { text: tx("dach") })); right.appendChild(svg);
      right.appendChild(el("div", { "class": "legend" }, [el("span", null, [el("i"), document.createTextNode(tx("pin_point") + " / " + tx("pin_area"))]), el("span", null, [el("i", { "class": "s" }), document.createTextNode(tx("pin_source"))])]));
      // world with DACH glow
      var Wd = geo.world, ws = sv("svg", { viewBox: "0 0 " + Wd.w + " " + Wd.h, role: "img", "aria-label": tx("world") });
      ws.appendChild(sv("rect", { width: Wd.w, height: Wd.h, "class": "sea" })); ws.appendChild(path(Wd.rest, "land")); ["DE", "AT", "CH"].forEach(function (c) { ws.appendChild(path(Wd.dach[c], "dachw")); });
      var c0 = projWorld(Wd.w, 10.4, 47.6); ws.appendChild(sv("circle", { cx: c0[0], cy: c0[1], r: 13, "class": "ring" }));
      var wp = []; man.sensors.forEach(function (s) { (s.wpins || []).forEach(function (p) { var q = projWorld(Wd.w, p.lon, p.lat); wp.push({ s: s, p: p, x: q[0], y: q[1] }); }); });
      wp.forEach(function (m, i) { for (var j = 0; j < i; j++) if (Math.hypot(wp[j].x - m.x, wp[j].y - m.y) < 22) { m.x += 22; j = -1; } });
      wp.forEach(function (m) { var nm = m.s.name[lang] + " · " + m.p.label, g = sv("g", { "class": "pin src", tabindex: 0, role: "button", "aria-label": nm, transform: "translate(" + m.x + " " + m.y + ")" });
        g.appendChild(sv("circle", { r: 16, fill: "transparent" })); g.appendChild(sv("circle", { r: 9, "class": "ph" })); g.appendChild(sv("circle", { r: 6, "class": "pd" })); var t = sv("title"); t.textContent = nm; g.appendChild(t);
        g.onclick = function () { select(m.s.id); }; g.onkeydown = function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(m.s.id); } }; (pinEls[m.s.id] = pinEls[m.s.id] || []).push(g); ws.appendChild(g); });
      left.appendChild(el("h3", { text: tx("world") })); left.appendChild(ws);
      function chipRow(scope, label) { var row = el("div", { "class": "chips" }, [el("b", { text: label })]); man.sensors.filter(function (s) { return s.scope === scope; }).forEach(function (s) { var b = el("button", { type: "button", "class": "chip", "data-id": s.id, text: s.ico + " " + s.name[lang] }); b.onclick = function () { select(s.id); }; row.appendChild(b); }); return row; }
      left.appendChild(chipRow("de", tx("scope_de"))); left.appendChild(chipRow("world", tx("scope_world")));
      var card = el("div", { "class": "pn card", id: "osm-card", "aria-live": "polite" }); left.appendChild(card); card.style.marginTop = "12px";
      var lst = el("div", { "class": "lst" }); man.sensors.forEach(function (s) { var b = el("button", { type: "button", "class": "chip", "data-id": s.id, text: s.ico + " " + s.name[lang] }); b.onclick = function () { select(s.id); }; lst.appendChild(b); });
      root.appendChild(el("div", { "class": "chips" }, [el("b", { text: tx("all") })])); root.appendChild(lst);
      root.appendChild(el("div", { "class": "foot" }, [el("a", { href: "/sensors", text: tx("sensors_page") }), el("a", { href: "/llms.txt", text: tx("llms") }), el("span", { text: tx("credit") })]));
      card.appendChild(el("p", { text: tx("pick") }));
    }
    function mark(id) { Object.keys(pinEls).forEach(function (k) { pinEls[k].forEach(function (g) { g.classList.toggle("on", k === id); }); }); root.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c.getAttribute("data-id") === id); }); }
    function select(id, quiet) {
      sel = id; var s = man.sensors.filter(function (x) { return x.id === id; })[0]; if (!s) return; mark(id);
      var card = root.querySelector("#osm-card"), my = ++tok; card.textContent = ""; card.appendChild(el("h4", { text: s.ico + " " + s.name[lang] })); card.appendChild(el("p", { text: s.what[lang] })); card.appendChild(el("p", { text: tx("checking") }));
      var done = function (d, err) { if (my !== tok) return; card.textContent = ""; card.appendChild(el("h4", { text: s.ico + " " + s.name[lang] })); card.appendChild(el("p", { text: s.what[lang] }));
        var dl = el("dl"), row = function (k, v) { if (v == null || v === "") return; dl.appendChild(el("dt", { text: tx(k) })); dl.appendChild(typeof v === "string" ? el("dd", { text: v }) : el("dd", null, [v])); };
        if (err) { card.appendChild(el("p", { text: tx("fail") })); }
        else { var dd = s.sub ? d[s.sub] : d, stt = s.sub ? (dd && typeof dd === "object" ? (dd.stale === true ? "degraded" : "ok") : "unavailable") : statusOf(d), cls = stt === "ok" || stt === "cached" ? "st" : stt === "degraded" ? "st w" : stt === "unknown" ? "st g" : "st b";
          row("status", el("span", { "class": cls, text: tx("status_" + stt) })); var tm = s.time_key ? fmtTime(dd && dd[s.time_key], lang, s.time_kind) : null; if (tm) row("time_" + s.time_kind, tm);
          if (dd && typeof dd === "object") { row("source", typeof dd.source === "string" ? dd.source : null); row("licence", typeof dd.licence === "string" ? dd.licence : typeof dd.license === "string" ? dd.license : null); } }
        var ap = (s.pins || []).concat(s.wpins || []); var loc = ap.length ? ap.map(function (p) { return p.label; }).join(", ") + " · " + tx("loc_" + (ap[0].kind === "source" ? "source" : ap[0].kind)) : tx("loc_" + s.scope); row("where", loc);
        row("api", el("a", { href: s.api, target: "_blank", rel: "noopener", text: s.api })); row("mcp", el("code", { text: s.mcp })); card.appendChild(dl); };
      fetch(s.api, { headers: { Accept: "application/json" } }).then(function (r) { return r.json().then(function (j) { return j; }); }).then(function (d) { done(d, false); }).catch(function () { done(null, true); });
    }
    return Promise.all([fetch("/data/map-geo.json").then(function (r) { return r.json(); }), fetch("/data/sensor-map.json").then(function (r) { return r.json(); })]).then(function (r) { geo = r[0]; man = r[1]; render(); }).catch(function () { root.textContent = T[lang].fail; });
  }
  window.OrbSensorMap = { mount: mount };
})();
