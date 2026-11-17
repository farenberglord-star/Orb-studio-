/* safeworld3d.js v1.1 - «Безопасный мир» / Sichere Welt / Safe World banner for orbstudio.org (court section)
   Calm protective hologram: translucent shield-dome over a wireframe Earth, one light pillar per verified figure
   (height = log10(value), conditional scale), clearance-rate arcs (AQ) at pillar bases, gentle pulses.
   three.js r128 (cdnjs) only. No textures, models, fonts, logos, images, people. No 3D text: captions are HTML overlays (textContent only).
   window.OrbSafe3D = { init(el, opts)->bool, update(data), stats(), show(i), seek(s), destroy() }
   opts: { caption:true, lang:"ru"|"de"|"en", reduced:bool, onFigure(fn) }. data = safeworld-data.json shape (later GET /api/v1/safeworld).
   Text fields: <name>_de / <name>_en are used when present, else <name>_ru (label, unit, year, definition, note, extra.label).
   Missing value -> «нет данных». The module never fills in numbers by itself. Fires el event "orbsafe:figure" (detail = figure). */
(function () {
  "use strict";
  var T = window.THREE;
  var C = { bg: 0x03070f, holo: 0x6fe6ff, dome: 0x8fd8ff, earth: 0x0a2236, de: 0x6fe6ff, missing: 0xf1cf8a, world: 0xb39dff, signals: 0x7fb2ff, none: 0x5a6b78 };
  var CY = 7.0, BASE_Y = -1.9, DOME_R = 4.0, EARTH_R = 1.45, EARTH_Y = 0.15, RING_R = 2.85, LOG_MIN = 3, LOG_MAX = 7.5;
  var L = {
    ru: { nd: "нет данных", nodata: "НЕТ ДАННЫХ", upd: "обновлено", tz: "Берлин", aq: "раскрываемость (AQ)", aqm: "закрыто (AQ)", src: "Источник", per: "период", approx: "около ", mln: " млн" },
    de: { nd: "keine Daten", nodata: "KEINE DATEN", upd: "aktualisiert", tz: "Berlin", aq: "Aufklärungsquote", aqm: "erledigt (AQ)", src: "Quelle", per: "Zeitraum", approx: "ca. ", mln: " Mio." },
    en: { nd: "no data", nodata: "NO DATA", upd: "updated", tz: "Berlin", aq: "clearance rate (AQ)", aqm: "closed (AQ)", src: "Source", per: "period", approx: "approx. ", mln: " million" }
  };
  function h(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function cl(x, a, b) { return x < a ? a : x > b ? b : x; }
  function sm(x) { x = cl(x, 0, 1); return x * x * (3 - 2 * x); }
  function num(v) { return typeof v === "number" && isFinite(v) ? v : null; }
  function str(v) { return typeof v === "string" && v.length ? v : null; }
  var S = null;

  /* ---------- data: only what the JSON really contains ---------- */
  function parse(data) {
    var D = { ok: false, figs: [], updated: null, title: {}, scale: null };
    var arr = Array.isArray(data) ? data : data && Array.isArray(data.figures) ? data.figures : null;
    if (data && !Array.isArray(data)) {
      D.updated = str(data.updated); D.scale = str(data.scale_note_ru);
      D.title = { ru: str(data.title_ru), de: str(data.title_de), en: str(data.title_en) };
    }
    (arr || []).forEach(function (f) {
      if (!f || typeof f !== "object" || !str(f.id)) return;
      var ex = f.extra && typeof f.extra === "object" ? { label_ru: str(f.extra.label_ru), value: num(f.extra.value), approx: f.extra.approx === true } : null;
      D.figs.push({ id: f.id, group: str(f.group) || "none", label_ru: str(f.label_ru), label_de: str(f.label_de), label_en: str(f.label_en),
        value: num(f.value), approx: f.approx === true, unit_ru: str(f.unit_ru), year: str(f.year) || (num(f.year) !== null ? String(f.year) : null),
        aq: num(f.aq), extra: ex, definition_ru: str(f.definition_ru), source: str(f.source), url: str(f.url), license: str(f.license), note_ru: str(f.note_ru), raw: f });
    });
    D.figs = D.figs.slice(0, 12); D.ok = D.figs.length > 0; return D;
  }
  function fmt(v, approx, lg) {
    var l = L[lg] || L.ru; if (v === null) return l.nd;
    var loc = lg === "en" ? "en-US" : lg === "de" ? "de-DE" : "ru-RU", s;
    if (v >= 1e6) s = (Math.round(v / 1e5) / 10).toLocaleString(loc) + l.mln; else s = v.toLocaleString(loc);
    return (approx ? l.approx : "") + s;
  }
  function berlin(iso, lg) {
    if (!iso) return null; var d = new Date(iso); if (isNaN(d)) return null;
    try { return new Intl.DateTimeFormat(lg === "en" ? "en-GB" : lg === "de" ? "de-DE" : "ru-RU", { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(d); }
    catch (e) { return null; }
  }

  /* ---------- scene ---------- */
  var GLOW = null;
  function glowTex() {
    if (GLOW) return GLOW; var c = document.createElement("canvas"); c.width = c.height = 64; var g = c.getContext("2d");
    var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); GLOW = new T.CanvasTexture(c); return GLOW;
  }
  function addM(o) { var p = { transparent: true, depthWrite: false, blending: T.AdditiveBlending }; for (var k in o) p[k] = o[k]; return p; }
  function lineMat(c, op) { return new T.LineBasicMaterial(addM({ color: c, opacity: op })); }
  function circle(r, n) { var p = []; for (var i = 0; i <= n; i++) { var a = i / n * Math.PI * 2; p.push(Math.cos(a) * r, 0, Math.sin(a) * r); } var g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(p, 3)); return g; }

  function buildStatic() {
    var sc = S.scene, g = S.g;
    /* starfield (procedural points) */
    var sp = []; for (var i = 0; i < 260; i++) { var u = h(i * 3.1) * 2 - 1, a = h(i * 7.7) * Math.PI * 2, r = 18 + h(i * 1.3) * 8, q = Math.sqrt(1 - u * u); sp.push(Math.cos(a) * q * r, u * r * 0.7 + 3, Math.sin(a) * q * r); }
    var sg = new T.BufferGeometry(); sg.setAttribute("position", new T.Float32BufferAttribute(sp, 3));
    sc.add(new T.Points(sg, new T.PointsMaterial(addM({ color: 0x9fc8ff, size: 0.06, opacity: 0.55, sizeAttenuation: true }))));
    /* earth */
    g.earth = new T.Group(); g.earth.position.y = EARTH_Y; sc.add(g.earth);
    g.earth.add(new T.Mesh(new T.SphereGeometry(EARTH_R * 0.985, 28, 18), new T.MeshBasicMaterial({ color: C.earth, transparent: true, opacity: 0.92 })));
    g.earth.add(new T.LineSegments(new T.WireframeGeometry(new T.IcosahedronGeometry(EARTH_R, 3)), lineMat(C.holo, 0.16)));
    for (var k = -2; k <= 2; k++) { var la = k * 0.45, c = new T.Line(circle(EARTH_R * Math.cos(la) * 1.003, 64), lineMat(C.holo, k === 0 ? 0.45 : 0.22)); c.position.y = EARTH_R * Math.sin(la); g.earth.add(c); }
    for (var m = 0; m < 6; m++) { var mc = new T.Line(circle(EARTH_R * 1.003, 64), lineMat(C.holo, 0.18)); mc.rotation.x = Math.PI / 2; mc.rotation.z = m * Math.PI / 6; mc.rotation.order = "ZXY"; g.earth.add(mc); }
    /* procedural "lights" on the sphere (abstract, not geography) */
    var lp = []; for (var j = 0; j < 220; j++) { var uu = h(j * 5.3 + 2) * 1.6 - 0.8, aa = h(j * 9.1 + 4) * Math.PI * 2, qq = Math.sqrt(1 - uu * uu), rr = EARTH_R * 1.01; lp.push(Math.cos(aa) * qq * rr, uu * rr, Math.sin(aa) * qq * rr); }
    var lg = new T.BufferGeometry(); lg.setAttribute("position", new T.Float32BufferAttribute(lp, 3));
    g.earth.add(new T.Points(lg, new T.PointsMaterial(addM({ color: 0xbff4ff, size: 0.05, opacity: 0.7 }))));
    var halo = new T.Sprite(new T.SpriteMaterial(addM({ map: glowTex(), color: C.holo, opacity: 0.22 }))); halo.scale.set(EARTH_R * 3.6, EARTH_R * 3.6, 1); g.earth.add(halo);
    /* base platform */
    g.base = new T.Group(); g.base.position.y = BASE_Y; sc.add(g.base);
    [1.2, 2.0, RING_R, 3.45, DOME_R].forEach(function (r, i) { g.base.add(new T.Line(circle(r, 96), lineMat(C.holo, i === 4 ? 0.55 : 0.2))); });
    var disc = new T.Mesh(new T.CircleGeometry(DOME_R, 48), new T.MeshBasicMaterial(addM({ color: 0x0b3550, opacity: 0.35, side: T.DoubleSide }))); disc.rotation.x = -Math.PI / 2; g.base.add(disc);
    var tk = []; for (var t = 0; t < 72; t++) { var ta = t / 72 * Math.PI * 2, r1 = DOME_R + 0.05, r2 = DOME_R + (t % 6 ? 0.14 : 0.3); tk.push(Math.cos(ta) * r1, 0, Math.sin(ta) * r1, Math.cos(ta) * r2, 0, Math.sin(ta) * r2); }
    var tg = new T.BufferGeometry(); tg.setAttribute("position", new T.Float32BufferAttribute(tk, 3)); g.base.add(new T.LineSegments(tg, lineMat(C.holo, 0.35)));
    /* shield dome: soft shell + upper-hemisphere wire lattice */
    g.dome = new T.Group(); g.dome.position.y = BASE_Y; sc.add(g.dome);
    g.domeShell = new T.Mesh(new T.SphereGeometry(DOME_R, 40, 14, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshBasicMaterial(addM({ color: C.dome, opacity: 0.05, side: T.DoubleSide })));
    g.dome.add(g.domeShell);
    var wp = new T.WireframeGeometry(new T.IcosahedronGeometry(DOME_R, 2)).attributes.position.array, keep = [];
    for (var w = 0; w < wp.length; w += 6) if (wp[w + 1] > -0.01 && wp[w + 4] > -0.01) for (var z = 0; z < 6; z++) keep.push(wp[w + z]);
    var wg = new T.BufferGeometry(); wg.setAttribute("position", new T.Float32BufferAttribute(keep, 3));
    g.domeWire = new T.LineSegments(wg, lineMat(C.dome, 0.13)); g.dome.add(g.domeWire);
    /* pulse bands that rise slowly over the dome */
    g.bands = []; for (var b = 0; b < 3; b++) { var bl = new T.Line(circle(1, 96), lineMat(C.dome, 0.0)); g.dome.add(bl); g.bands.push(bl); }
    /* ground ripple for the active figure */
    g.ripple = []; for (var p = 0; p < 2; p++) { var rl = new T.Line(circle(1, 48), lineMat(C.holo, 0)); g.base.add(rl); g.ripple.push(rl); }
    /* link arc from active pillar to the earth */
    var ag = new T.BufferGeometry(); ag.setAttribute("position", new T.Float32BufferAttribute(new Float32Array(33 * 3), 3));
    g.arc = new T.Line(ag, lineMat(C.holo, 0)); sc.add(g.arc);
    g.pillars = new T.Group(); sc.add(g.pillars);
  }
  function clearPillars() {
    var g = S.g; while (g.pillars.children.length) { var o = g.pillars.children.pop(); o.traverse(function (x) { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose(); }); }
    S.pil = [];
  }
  function buildPillars() {
    clearPillars(); var n = S.D.figs.length; if (!n) return;
    S.D.figs.forEach(function (f, i) {
      var a = -Math.PI / 2 + (i / n) * Math.PI * 2, x = Math.cos(a) * RING_R, z = Math.sin(a) * RING_R;
      var colr = f.value === null ? C.none : (C[f.group] || C.holo);
      var hgt = f.value === null ? 0.12 : 0.35 + cl((Math.log(Math.max(1, f.value)) / Math.LN10 - LOG_MIN) / (LOG_MAX - LOG_MIN), 0, 1) * 1.9;
      var gp = new T.Group(); gp.position.set(x, BASE_Y, z); S.g.pillars.add(gp);
      var col = new T.Mesh(new T.CylinderGeometry(0.075, 0.1, 1, 6, 1, true), new T.MeshBasicMaterial(addM({ color: colr, opacity: 0.35, side: T.DoubleSide })));
      col.scale.y = hgt; col.position.y = hgt / 2; gp.add(col);
      var core = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 1, 4, 1, true), new T.MeshBasicMaterial(addM({ color: 0xffffff, opacity: 0.5 })));
      core.scale.y = hgt; core.position.y = hgt / 2; gp.add(core);
      var node = new T.Mesh(new T.OctahedronGeometry(0.11, 0), new T.MeshBasicMaterial(addM({ color: colr, opacity: 0.9 }))); node.position.y = hgt + 0.14; gp.add(node);
      var gl = new T.Sprite(new T.SpriteMaterial(addM({ map: glowTex(), color: colr, opacity: 0.35 }))); gl.scale.set(0.7, 0.7, 1); gl.position.y = hgt + 0.14; gp.add(gl);
      var base = new T.Line(circle(0.24, 32), lineMat(colr, 0.45)); gp.add(base);
      if (f.aq !== null) { /* clearance-rate arc: share of a full circle = AQ % */
        var arc = new T.Mesh(new T.RingGeometry(0.3, 0.36, 40, 1, Math.PI / 2, -cl(f.aq, 0, 100) / 100 * Math.PI * 2), new T.MeshBasicMaterial(addM({ color: colr, opacity: 0.6, side: T.DoubleSide })));
        arc.rotation.x = -Math.PI / 2; arc.position.y = 0.01; gp.add(arc);
      }
      S.pil.push({ g: gp, col: col, node: node, glow: gl, h: hgt, x: x, z: z, c: colr, ph: h(i + 1) * 6 });
    });
  }

  /* ---------- caption overlay (HTML, textContent only) ---------- */
  function mk(tag, css, parent) { var e = document.createElement(tag); if (css) e.style.cssText = css; if (parent) parent.appendChild(e); return e; }
  function buildCaption() {
    if (S.opts.caption === false) return;
    var el = S.el, sh = "text-shadow:0 0 6px #03070f,0 0 2px #03070f;";
    var top = mk("div", "position:absolute;left:12px;right:12px;top:10px;pointer-events:none;font:600 12px/1.3 system-ui,sans-serif;letter-spacing:.14em;color:#bfefff;text-transform:uppercase;" + sh, el);
    var t1 = mk("div", "", top), t2 = mk("div", "font-weight:400;letter-spacing:.02em;text-transform:none;opacity:.7;margin-top:2px;font-size:11px", top);
    var dots = mk("div", "position:absolute;right:12px;top:12px;display:flex;gap:5px;pointer-events:none", el);
    var cap = mk("div", "position:absolute;left:10px;right:10px;bottom:10px;padding:10px 12px;border:1px solid rgba(111,230,255,.22);border-radius:10px;background:rgba(3,10,20,.62);font:13px/1.35 system-ui,sans-serif;color:#dff4ff;opacity:0;transition:opacity .6s;" + sh, el);
    var lab = mk("div", "font-weight:600;font-size:13px;color:#bfefff", cap);
    var val = mk("div", "font:700 26px/1.15 system-ui,sans-serif;margin:3px 0 1px;letter-spacing:.01em", cap);
    var meta = mk("div", "font-size:12px;opacity:.9", cap), ext = mk("div", "font-size:12px;opacity:.9", cap);
    var def = mk("div", "font-size:12px;opacity:.78;margin-top:4px", cap), note = mk("div", "font-size:11.5px;opacity:.7;font-style:italic;margin-top:2px", cap);
    var src = mk("div", "font-size:11.5px;opacity:.85;margin-top:5px;word-break:break-word", cap);
    var srcT = mk("span", "", src), a = mk("a", "color:#8fe3ff;text-decoration:underline", src); a.target = "_blank"; a.rel = "noopener noreferrer";
    S.cap = { top: top, t1: t1, t2: t2, dots: dots, box: cap, lab: lab, val: val, meta: meta, ext: ext, def: def, note: note, srcT: srcT, a: a };
  }
  function setTop() {
    if (!S.cap) return; var lg = S.lang, l = L[lg], D = S.D;
    topText();
    var b = berlin(D.updated, lg); S.cap.t2.textContent = l.upd + ": " + (b ? b + " (" + l.tz + ")" : l.nd);
    var d = S.cap.dots; while (d.firstChild) d.removeChild(d.firstChild);
    S.dotEls = D.figs.map(function (f) { return mk("span", "width:6px;height:6px;border-radius:50%;background:#" + (f.value === null ? C.none : (C[f.group] || C.holo)).toString(16).padStart(6, "0") + ";opacity:.35;transition:opacity .4s", d); });
    topText();
  }
  function topText() { /* narrow screens: one title only, and the title never runs under the dots */
    if (!S.cap) return; var lg = S.lang, D = S.D;
    S.cap.t1.textContent = (D.title[lg] || D.title.ru || "Безопасный мир") + (lg === "ru" && D.title.de && S.w >= 700 ? " · " + D.title.de : "");
    S.cap.top.style.right = (22 + S.cap.dots.offsetWidth) + "px";
  }
  function tx(o, key) { return o && typeof o === "object" ? (str(o[key + "_" + S.lang]) || str(o[key + "_ru"])) : null; }
  function fill(i) {
    var f = S.D.figs[i]; if (!f || !S.cap) return; var lg = S.lang, l = L[lg], nd = l.nd, c = S.cap, nar = S.w < 700;
    var loc = lg === "en" ? "en-US" : lg === "de" ? "de-DE" : "ru-RU", unit = tx(f.raw, "unit");
    c.lab.textContent = tx(f.raw, "label") || nd;
    c.val.textContent = fmt(f.value, f.approx, lg) + (f.value !== null && unit ? " " + unit : "");
    c.val.style.fontSize = nar ? "21px" : "26px";
    var aqL = f.group === "missing" ? l.aqm : l.aq;
    c.meta.textContent = l.per + ": " + (tx(f.raw, "year") || f.year || nd) + (f.aq !== null ? " · " + aqL + ": " + f.aq.toLocaleString(loc) + " %" : "");
    c.ext.textContent = f.extra ? (tx(f.raw.extra, "label") || nd) + ": " + fmt(f.extra.value, f.extra.approx, lg) : "";
    c.def.textContent = tx(f.raw, "definition") || nd; c.note.textContent = tx(f.raw, "note") || "";
    var ok = !!f.url && /^https:\/\//.test(f.url), bare = ok ? f.url.replace(/^https:\/\//, "") : "";
    c.srcT.textContent = l.src + ": " + (f.source || nd) + (ok ? " · " : "");
    if (ok) { c.a.textContent = nar ? bare.split(/[\/?#]/)[0] : bare.split(/[?#]/)[0].slice(0, 60) + (f.url.length > 68 ? "…" : ""); c.a.href = f.url; c.a.style.display = ""; }
    else { c.a.textContent = ""; c.a.removeAttribute("href"); c.a.style.display = "none"; }
  }
  function measureCap() { /* tallest caption over all figures: the scene is lifted by that much, so the active pillar stays visible */
    S.capMax = 0; if (!S.cap) return;
    for (var i = 0; i < S.D.figs.length; i++) { fill(i); S.capMax = Math.max(S.capMax, S.cap.box.offsetHeight); }
    if (S.act >= 0) fill(S.act);
  }
  function caption(i) {
    var f = S.D.figs[i]; if (!f) return;
    if (S.opts.onFigure) try { S.opts.onFigure(f.raw); } catch (e) {}
    try { S.el.dispatchEvent(new CustomEvent("orbsafe:figure", { detail: f.raw })); } catch (e) {}
    if (S.dotEls) S.dotEls.forEach(function (d, k) { d.style.opacity = k === i ? "1" : ".35"; });
    if (!S.cap) return; fill(i); S.cap.box.style.opacity = "1";
  }
  function overlay(on) {
    if (on && !S.ov) { var o = mk("div", "position:absolute;left:0;right:0;top:44%;text-align:center;color:#bfefff;opacity:.85;font:600 14px/1 system-ui,sans-serif;letter-spacing:.3em;pointer-events:none;text-shadow:0 0 8px #000", S.el); o.textContent = L[S.lang].nodata; S.ov = o; if (S.cap) S.cap.box.style.opacity = "0"; }
    else if (!on && S.ov) { S.ov.remove(); S.ov = null; }
  }

  /* ---------- animation (deterministic from time t) ---------- */
  function frame(t) {
    var g = S.g, n = S.pil.length, act = n ? Math.floor(t / CY) % n : -1, lt = t - Math.floor(t / CY) * CY;
    if (act !== S.act) { S.act = act; if (act >= 0) caption(act); }
    g.earth.rotation.y = t * 0.06;
    var br = 0.5 + 0.5 * Math.sin(t * 0.55);
    g.domeShell.material.opacity = 0.04 + 0.025 * br; g.domeWire.material.opacity = 0.1 + 0.06 * br;
    g.bands.forEach(function (b, i) { var p = ((t * 0.07 + i / 3) % 1), y = p * DOME_R * 0.97, r = Math.sqrt(Math.max(0, DOME_R * DOME_R - y * y)); b.position.y = y; b.scale.set(r, 1, r); b.material.opacity = 0.32 * Math.sin(p * Math.PI) * (1 - p * 0.5); });
    S.pil.forEach(function (p, i) {
      var on = i === act, k = on ? sm(lt / 0.8) * (1 - sm((lt - CY + 0.8) / 0.8)) : 0, w = 0.5 + 0.5 * Math.sin(t * 1.1 + p.ph);
      p.col.material.opacity = 0.22 + 0.06 * w + 0.4 * k; p.glow.material.opacity = 0.22 + 0.1 * w + 0.5 * k;
      var s = 1 + 0.35 * k; p.node.scale.set(s, s, s); p.node.rotation.y = t * 0.6 + p.ph; p.glow.scale.set(0.7 + 0.5 * k, 0.7 + 0.5 * k, 1);
    });
    var A = S.pil[act];
    g.ripple.forEach(function (r, i) {
      if (!A) { r.material.opacity = 0; return; } var q = ((lt / 2.6) + i * 0.5) % 1; r.position.set(A.x, 0.005, A.z); r.scale.set(0.3 + q * 1.1, 1, 0.3 + q * 1.1);
      r.material.color.setHex(A.c); r.material.opacity = 0.5 * (1 - q) * sm(lt / 0.6);
    });
    if (A) { /* soft arc from active node to the earth surface, drawn progressively */
      var pa = g.arc.geometry.attributes.position, v = S.v, top = v[0].set(A.x, BASE_Y + A.h + 0.14, A.z), dir = v[1].set(A.x, 0, A.z).normalize();
      var end = v[2].set(dir.x * EARTH_R * 1.02, EARTH_Y + 0.35, dir.z * EARTH_R * 1.02), mid = v[3].copy(top).lerp(end, 0.5); mid.y += 0.9;
      var prog = sm((lt - 0.4) / 1.4);
      for (var j = 0; j <= 32; j++) { var u = (j / 32) * prog, a1 = v[4].copy(top).lerp(mid, u), a2 = v[5].copy(mid).lerp(end, u), pt = a1.lerp(a2, u); pa.setXYZ(j, pt.x, pt.y, pt.z); }
      pa.needsUpdate = true; g.arc.material.color.setHex(A.c); g.arc.material.opacity = 0.55 * sm(lt / 0.5) * (1 - sm((lt - CY + 0.7) / 0.7));
    } else g.arc.material.opacity = 0;
    /* camera: slow orbit, biased towards active pillar */
    var por = S.w / S.h < 1, dist = por ? 12.2 : 10.4, ay = 0.35 + 0.18 * Math.sin(t * 0.05);
    if (A) { var aa = Math.atan2(A.z, A.x); S.camA = S.camA === undefined ? aa : S.camA; var dA = Math.atan2(Math.sin(aa - S.camA), Math.cos(aa - S.camA)); S.camA += dA * Math.min(1, S.dt * 0.6); }
    var ca = (S.camA !== undefined ? S.camA : 0) + 0.32 * Math.sin(t * 0.08);
    S.cam.position.set(Math.cos(ca) * dist * Math.cos(ay), (por ? 2.3 : 1.9) + Math.sin(ay) * 2, Math.sin(ca) * dist * Math.cos(ay));
    S.cam.lookAt(0, por ? -0.35 : -0.15, 0);
  }

  /* ---------- loop / lifecycle (same pattern as court3d.js) ---------- */
  function render() { S.ren.render(S.scene, S.cam); S.tri = S.ren.info.render.triangles; S.calls = S.ren.info.render.calls; }
  function drawOnce() { if (!S) return; S.dt = 10; frame(S.reduced ? (S.redT || 0) : S.wt); render(); }
  function tick() {
    if (!S || !S.running) return; S.raf = requestAnimationFrame(tick);
    var now = performance.now(), dt = Math.min(0.1, (now - (S.lt || now)) / 1000); S.lt = now; S.wt += dt; S.dt = dt;
    S.fc++; if (now - S.fpsT > 1000) { S.fps = Math.round(S.fc * 1000 / (now - S.fpsT)); S.fc = 0; S.fpsT = now; }
    frame(S.wt); render();
  }
  function sched() {
    if (!S) return; var run = !S.hidden && S.inView && !S.reduced;
    if (run && !S.running) { S.running = true; S.lt = performance.now(); S.fpsT = S.lt; S.fc = 0; S.raf = requestAnimationFrame(tick); }
    else if (!run && S.running) { S.running = false; cancelAnimationFrame(S.raf); }
    if (S.reduced) reducedStep();
  }
    function reducedStep() {
    clearTimeout(S.redTimer); var n = Math.max(1, S.pil.length); S.redT = S.redIdx * CY + CY * 0.5; drawOnce();
    if (!S.hidden && S.inView && S.pil.length) S.redTimer = setTimeout(function () { S.redIdx = (S.redIdx + 1) % n; reducedStep(); }, CY * 1000);
  }
  function resize() {
    var w = S.el.clientWidth || 640, hh = S.el.clientHeight || 360; S.w = w; S.h = hh;
    S.ren.setSize(w, hh, false); S.cam.aspect = w / hh; var por = w / hh < 1, wide = w >= 700 && !por; S.cam.fov = por ? 58 : 42;
    /* keep the hologram clear of the caption: portrait -> scene moves up, wide -> scene moves right, caption sits left */
    if (S.cap) { S.cap.box.style.right = wide ? "auto" : "10px"; S.cap.box.style.maxWidth = wide ? "44%" : "none"; }
    topText(); measureCap();
    if (S.cap && wide) S.cam.setViewOffset(w, hh, -w * 0.2, hh * 0.03, w, hh); else if (S.cap && por) S.cam.setViewOffset(w, hh, 0, hh * cl(S.capMax / hh / 2 + 0.02, 0.15, 0.26), w, hh); else S.cam.clearViewOffset();
    S.cam.updateProjectionMatrix(); drawOnce();
  }
  window.OrbSafe3D = {
    init: function (el, opts) {
      if (S) this.destroy(); if (!T || !el) return false;
      var cv = document.createElement("canvas"), ctx;
      try { ctx = cv.getContext("webgl", { antialias: true, alpha: false }) || cv.getContext("experimental-webgl"); } catch (e) { ctx = null; }
      if (!ctx) return false;
      var ren; try { ren = new T.WebGLRenderer({ canvas: cv, context: ctx, antialias: true }); } catch (e) { return false; }
      opts = opts || {}; var lg = (opts.lang || document.documentElement.lang || "ru").slice(0, 2).toLowerCase(); if (!L[lg]) lg = "ru";
      S = { el: el, opts: opts, lang: lg, ren: ren, scene: new T.Scene(), cam: new T.PerspectiveCamera(42, 16 / 9, 0.1, 80), D: parse(null), wt: 0, act: -2, g: {}, pil: [],
        hidden: document.hidden, inView: true, running: false, fps: 0, fc: 0, fpsT: 0, tri: 0, calls: 0, redIdx: 0, dt: 0, capMax: 0 };
      S.v = [0, 1, 2, 3, 4, 5].map(function () { return new T.Vector3(); });
      S.pr = Math.min(2, window.devicePixelRatio || 1); ren.setPixelRatio(S.pr); ren.setClearColor(C.bg, 1);
      cv.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y;cursor:pointer"; if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.insertBefore(cv, el.firstChild); S.cv = cv; S.scene.fog = new T.Fog(C.bg, 16, 34);
      buildStatic(); buildCaption();
      S.onClick = function () { if (!S || !S.pil.length) return; OrbSafe3D.show((S.act < 0 ? 0 : S.act) + 1); }; cv.addEventListener("click", S.onClick);
      var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
      S.reduced = opts.reduced === true || !!(mq && mq.matches);
      if (mq && mq.addEventListener && opts.reduced !== true) { S.onMq = function () { S.reduced = mq.matches; sched(); }; mq.addEventListener("change", S.onMq); S.mq = mq; }
      S.onVis = function () { S.hidden = document.hidden; sched(); }; document.addEventListener("visibilitychange", S.onVis);
      if (window.IntersectionObserver) { S.io = new IntersectionObserver(function (e) { S.inView = e[0].isIntersecting; sched(); }, { threshold: 0.01 }); S.io.observe(el); }
      if (window.ResizeObserver) { S.ro = new ResizeObserver(resize); S.ro.observe(el); } else { S.onRs = resize; window.addEventListener("resize", resize); }
      overlay(true); resize(); sched(); return true;
    },
    update: function (data) { if (!S) return; S.D = parse(data); S.act = -2; S.redIdx = 0; buildPillars(); setTop(); overlay(!S.D.ok); resize(); sched(); },
    show: function (i) { if (!S || !S.pil.length) return; var n = S.pil.length; i = (((i | 0) % n) + n) % n; S.wt = i * CY + 0.01; S.redIdx = i; if (S.reduced) reducedStep(); else drawOnce(); },
    seek: function (sec) { if (!S) return; S.wt = Math.max(0, +sec || 0); var rd = S.reduced; S.reduced = false; drawOnce(); S.reduced = rd; },
    stats: function () {
      if (!S) return null; var f = S.D.figs[S.act];
      return { figures: S.D.figs.length, active: f ? f.id : null, cycle_s: CY, ok: S.D.ok, missing_values: S.D.figs.filter(function (x) { return x.value === null; }).length,
        triangles: S.tri, calls: S.calls, fps: S.fps, running: S.running, reduced: S.reduced, pixelRatio: S.pr, lang: S.lang };
    },
    destroy: function () {
      if (!S) return; S.running = false; cancelAnimationFrame(S.raf); clearTimeout(S.redTimer);
      document.removeEventListener("visibilitychange", S.onVis); S.io && S.io.disconnect(); S.ro && S.ro.disconnect(); S.cv.removeEventListener("click", S.onClick);
      if (S.onRs) window.removeEventListener("resize", S.onRs); if (S.mq && S.onMq) S.mq.removeEventListener("change", S.onMq);
      S.scene.traverse(function (x) { if (x.geometry) x.geometry.dispose(); if (x.material) x.material.dispose(); });
      if (GLOW) { GLOW.dispose(); GLOW = null; } S.ren.dispose(); S.cv.remove(); overlay(false);
      if (S.cap) { S.cap.top.remove(); S.cap.dots.remove(); S.cap.box.remove(); } S = null;
    }
  };
})();