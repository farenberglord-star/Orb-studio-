/* bank3d.js: «Улица банков», 3D hologram for orbstudio.org/tariffs
   three.js r128 (cdnjs). No other scripts, models, textures, logos or fonts.
   window.OrbBank3D = { init(el) -> true/false, update(data), stats() }
   data = response of GET /api/v1/tariffs (the page fetches it and passes it in).
   Rules: no invented values (null = no element / empty frame), honest status, no text in 3D,
   no recommendations, deterministic (no Math.random), pause when hidden/offscreen, reduced motion. */
(function () {
  "use strict";
  var T = null, ren = null, scene = null, cam = null, mirrorCam = null, rt = null, clock = null, root = null, world = null, dyn = null;
  var el = null, tip = null, raf = 0, onScreen = true, data = null, ok = false;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var G = { uTime: { value: 0 }, uFogCol: null, uReduce: { value: reduce ? 1 : 0 }, uHi: { value: -1 } };
  var orbit = { a: 0.42, e: 0.26, r: 27, auto: !reduce, drag: false, idle: 0, sx: 0, sy: 0, moved: false };
  var anim = { melts: [], rings: [] }, picks = [], hover = null, pinned = null;
  var st = { frames: 0, tris: 0, trisMirror: 0, calls: 0, banks: 0, cards: 0, status: {}, nulls: [], changes: 0 };
  var K_RATE = 0.9, FEE_H = 0.3, FEE_MAX = 15, LOT = 2.4, Z_DE = -3.7, Z_US = 3.7, CURB = 2.4;
  var HH = /hamburg|harburg|haspa/i;
  var LANG = ((document.documentElement && document.documentElement.lang) || "en").slice(0, 2);
  var TX = {
    en: { checking: "Checking account", savings: "Savings account", fee: "Monthly fee", waive: "Fee waived if", rate: "Rate", promo: "promo", months: "mo.", after: "after promo", giro: "with Girokonto", max: "promo up to", fx: "FX fee", od: "Overdraft rate", ins: "Deposit insurance", nd: "no data", st: "Status", checked: "checked", doc: "document", src: "source", sOk: "ok, verified", sStale: "stale, last verified values", sCheck: "check, source gives no date", sBlocked: "blocked, the bank's site gave no data", ch: "Change", sndr: "FDIC national average, savings", snrc: "FDIC national rate cap, savings", none: "none" },
    de: { checking: "Girokonto", savings: "Sparkonto", fee: "Monatliche Gebühr", waive: "Entfällt, wenn", rate: "Zins", promo: "Aktion", months: "Mon.", after: "danach", giro: "mit Girokonto", max: "Aktion bis", fx: "Fremdwährung", od: "Dispozins", ins: "Einlagensicherung", nd: "keine Daten", st: "Status", checked: "geprüft", doc: "Dokument", src: "Quelle", sOk: "ok, geprüft", sStale: "veraltet, zuletzt geprüfte Werte", sCheck: "prüfen, Quelle ohne Datum", sBlocked: "blockiert, Bankseite lieferte keine Daten", ch: "Änderung", sndr: "FDIC-Landesdurchschnitt, Sparkonto", snrc: "FDIC-Zinsobergrenze, Sparkonto", none: "keine" },
    ru: { checking: "Текущий счёт", savings: "Сберегательный счёт", fee: "Плата в месяц", waive: "Можно не платить, если", rate: "Ставка", promo: "промо", months: "мес.", after: "после промо", giro: "с Girokonto", max: "промо до", fx: "Комиссия за валюту", od: "Ставка овердрафта", ins: "Страхование вкладов", nd: "нет данных", st: "Статус", checked: "проверено", doc: "документ", src: "источник", sOk: "ok, проверено", sStale: "устарело, последние проверенные значения", sCheck: "проверить, источник без даты", sBlocked: "заблокировано, сайт банка не дал данные", ch: "Изменение", sndr: "Средняя ставка FDIC по США, сбережения", snrc: "Потолок ставки FDIC, сбережения", none: "нет" }
  };
  var L = TX[LANG] || TX.en;

  function num(v) { return (typeof v === "number" && isFinite(v)) ? v : null; }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
  function days(a, b) { var x = Date.parse(a), y = Date.parse(b); return (isNaN(x) || isNaN(y)) ? null : (y - x) / 864e5; }
  function stCode(s) { return s === "stale" ? 1 : s === "check" ? 2 : s === "blocked" ? 3 : s === "ok" ? 0 : 4; }

  var FOG = "uniform vec3 uFogCol; varying float vFogD; vec3 fogit(vec3 c){ float f = 1.0 - exp(-pow(vFogD * 0.022, 2.0)); return mix(c, uFogCol, clamp(f,0.0,1.0)); }";

  function glowMat(col, opac) { return new T.MeshBasicMaterial({ color: col, transparent: true, opacity: opac, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }); }
  function lineMat(col, opac) { return new T.LineBasicMaterial({ color: col, transparent: true, opacity: opac, blending: T.AdditiveBlending, depthWrite: false }); }
  function reflect(o) { o.traverse(function (c) { c.layers.enable(1); }); return o; }
  function edges(geo, col, opac) { return new T.LineSegments(new T.EdgesGeometry(geo), lineMat(col, opac)); }
  function dashedBox(w, h, d, col) {
    var g = new T.BoxGeometry(w, h, d); g.translate(0, h / 2, 0);
    var ls = new T.LineSegments(new T.EdgesGeometry(g), new T.LineDashedMaterial({ color: col, dashSize: 0.12, gapSize: 0.1, transparent: true, opacity: 0.75 }));
    ls.computeLineDistances(); return ls;
  }

  /* ================= static street (decor) ================= */
  function buildStatic() {
    G.uFogCol = { value: new T.Color(0x0a1024) };
    // sky dome: dusk gradient + stars (decor)
    var sky = new T.Mesh(new T.SphereGeometry(140, 32, 16), new T.ShaderMaterial({
      uniforms: { uTime: G.uTime, uReduce: G.uReduce },
      vertexShader: "varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform float uTime, uReduce; varying vec3 vD; float h(vec3 p){ return fract(sin(dot(p, vec3(12.9898,78.233,37.719))) * 43758.5453); }" +
        // round stars of different size, colour and twinkle; each grid cell holds at most one star at a hashed offset
        "vec3 stars(vec3 d, float S, float dens, float sz){ vec3 q = d * S, g = floor(q); float r = h(g); if (r < dens) return vec3(0.0);" +
        " vec3 p = g + 0.5 + (vec3(h(g + 1.7), h(g + 4.3), h(g + 8.9)) - 0.5) * 0.7; float e = length(q - p);" +
        " float b = pow(h(g + 2.1), 3.0); float core = exp(-e * e * (90.0 / sz)) + 0.25 * exp(-e * e * (14.0 / sz)) * b;" +
        " float tw = uReduce > 0.5 ? 1.0 : 0.72 + 0.28 * sin(uTime * (1.3 + 3.0 * h(g + 6.6)) + r * 60.0);" +
        " vec3 col = mix(vec3(0.68,0.78,1.0), vec3(1.0,0.82,0.62), smoothstep(0.55, 1.0, h(g + 5.5)));" +
        " return col * core * (0.35 + 1.1 * b) * tw; }" +
        "void main(){ float y = vD.y; vec3 top = vec3(0.008,0.014,0.045), hor = vec3(0.06,0.05,0.14), glow = vec3(0.30,0.14,0.30);" +
        " vec3 c = mix(hor, top, smoothstep(0.0, 0.5, y)); c += glow * exp(-abs(y) * 9.0) * 0.6;" +
        " vec3 mwN = normalize(vec3(0.42, 0.50, 0.76)); float mw = exp(-pow(dot(vD, mwN) * 5.0, 2.0));" + // faint Milky Way band (decor)
        " float mwN2 = h(floor(vD * 90.0)) * 0.5 + h(floor(vD * 23.0)) * 0.5; c += vec3(0.11,0.08,0.17) * mw * (0.45 + 0.55 * mwN2) * smoothstep(-0.02, 0.2, y);" +
        " float vis = smoothstep(-0.01, 0.06, y) * (0.55 + 0.45 * smoothstep(0.0, 0.25, y));" +
        " c += (stars(vD, 160.0, 0.93, 1.6) + stars(vD, 330.0, 0.90, 1.0) + stars(vD, 330.0, 0.80, 0.8) * mw) * vis;" +
        " gl_FragColor = vec4(c, 1.0); }",
      side: T.DoubleSide, depthWrite: false   // DoubleSide: the mirror pass flips winding, BackSide alone vanished from the reflection
    }));
    root.add(reflect(sky));

    // reflective wet pavement with lamp pools, lane markings and CAD grid (decor; reflection = real mirror pass)
    var pav = new T.Mesh(new T.PlaneGeometry(90, 50, 1, 1), new T.ShaderMaterial({
      uniforms: { uTime: G.uTime, uFogCol: G.uFogCol, uRefl: { value: rt.texture }, uTM: { value: new T.Matrix4() }, uCurb: { value: CURB } },
      vertexShader: "uniform mat4 uTM; varying vec4 vP; varying vec3 vW; varying float vFogD; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vP = uTM * w; vec4 mv = viewMatrix * w; vFogD = -mv.z; gl_Position = projectionMatrix * mv; }",
      fragmentShader: FOG + "uniform sampler2D uRefl; uniform float uTime, uCurb; varying vec4 vP; varying vec3 vW;" +
        "float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }" +
        "float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x), mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x), f.y); }" +
        "float ln(float x, float w){ return 1.0 - smoothstep(0.0, w, abs(x)); }" +
        "void main(){ float az = abs(vW.z); bool walk = az > uCurb;" +
        " float wet = n(vW.xz * vec2(0.6, 2.5)) * 0.6 + n(vW.xz * 3.0) * 0.4;" +
        " vec2 dist = vec2(n(vW.xz * 4.0) - 0.5, n(vW.xz * 4.0 + 7.0) - 0.5) * 0.04 * (1.2 - wet);" +
        " vec3 r = texture2DProj(uRefl, vec4(vP.xy + dist * vP.w, vP.zw)).rgb;" +
        " vec3 V = normalize(cameraPosition - vW); float fres = 0.35 + 0.65 * pow(1.0 - V.y, 3.0);" +
        " vec3 base = walk ? vec3(0.035,0.04,0.06) : vec3(0.018,0.02,0.032);" +
        " if (walk) { vec2 t = abs(fract(vW.xz / 0.6) - 0.5); base += vec3(0.03,0.04,0.06) * smoothstep(0.47, 0.5, max(t.x, t.y)); }" +
        " float lx = abs(mod(vW.x + 1.5, 3.0) - 1.5); float pool = exp(-(lx*lx + pow(az - uCurb + 0.3, 2.0)) * 0.9);" +
        " vec3 c = base + vec3(1.0,0.78,0.5) * pool * 0.16;" +
        " c += r * (walk ? 0.35 : 0.72) * fres * (0.55 + 0.6 * wet);" +
        " float dash = step(0.5, fract(vW.x / 1.6)) * ln(vW.z, 0.04); c += vec3(0.75,0.8,0.9) * dash * 0.25;" +
        " c += vec3(0.3,0.9,1.0) * ln(az - uCurb, 0.025) * 0.5;" +
        " vec2 gg = abs(fract(vW.xz) - 0.5); float grid = max(ln(gg.x - 0.5, 0.012), ln(gg.y - 0.5, 0.012)); c += vec3(0.2,0.6,0.9) * grid * 0.06;" +
        " gl_FragColor = vec4(fogit(c), 1.0); }"
    }));
    pav.rotation.x = -Math.PI / 2; root.add(pav); anim.pav = pav;

    // street lamps (decor): instanced poles + glowing heads, both curbs every 3 units
    var lx = []; for (var x = -15; x <= 15.01; x += 3) { lx.push([x, -CURB - 0.3]); lx.push([x, CURB + 0.3]); }
    var poleG = new T.CylinderGeometry(0.025, 0.035, 2.3, 6, 1); poleG.translate(0, 1.15, 0);
    var poles = new T.InstancedMesh(poleG, new T.MeshBasicMaterial({ color: 0x1a2236, side: T.DoubleSide }), lx.length);
    var headG = new T.SphereGeometry(0.07, 10, 8), heads = new T.InstancedMesh(headG, new T.MeshBasicMaterial({ color: 0xffe2b0, side: T.DoubleSide }), lx.length);
    var m = new T.Matrix4(), hp = [];
    lx.forEach(function (p, i) { m.makeTranslation(p[0], 0, p[1]); poles.setMatrixAt(i, m); m.makeTranslation(p[0], 2.32, p[1] * 0.96); heads.setMatrixAt(i, m); hp.push(p[0], 2.32, p[1] * 0.96); });
    root.add(reflect(poles)); root.add(reflect(heads));
    var hg = new T.BufferGeometry(); hg.setAttribute("position", new T.Float32BufferAttribute(hp, 3));
    var halo = new T.Points(hg, new T.ShaderMaterial({
      uniforms: { uPx: { value: 1 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: "uniform float uPx; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = 260.0 * uPx / -mv.z; gl_Position = projectionMatrix * mv; }",
      fragmentShader: "void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(vec3(1.0,0.8,0.55) * exp(-d * d * 22.0) * 0.55, 1.0); }"
    }));
    root.add(reflect(halo)); anim.halo = halo;
    buildAndromeda();
  }

  /* ================= Andromeda hologram (DECOR, carries no tariff data) =================
     Real J2000 positions (rounded) of the main stars of the constellation Andromeda, gnomonic projection
     around RA 0.55h / Dec +38.8°, 0.24 units per degree. Depth = log10(distance in ly) — only for parallax.
     Stick figure = common simplified scheme. M31 drawn 1.5× its apparent size so it is visible. */
  var AND_STARS = [ // id, RA h, Dec °, mag, colour (spectral class), distance ly
    ["a", 0.1397, 29.09, 2.06, 0xbfd4ff, 97], ["b", 1.1622, 35.62, 2.05, 0xffb070, 197], ["g", 2.0650, 42.33, 2.10, 0xffc488, 350],
    ["d", 0.6555, 30.86, 3.27, 0xffcc90, 101], ["p", 0.6147, 33.72, 4.36, 0xb8ccff, 600], ["m", 0.9458, 38.50, 3.87, 0xf2f4ff, 120],
    ["n", 0.8303, 41.08, 4.53, 0xbcd0ff, 680], ["e", 0.6425, 29.32, 4.37, 0xfff0d0, 155], ["o", 23.032, 42.33, 3.62, 0xc0d2ff, 690],
    ["l", 23.626, 46.46, 3.82, 0xffe0b0, 85], ["k", 23.673, 44.33, 4.14, 0xd0dcff, 168], ["i", 23.636, 43.27, 4.29, 0xc4d6ff, 500],
    ["51", 1.633, 48.63, 3.57, 0xffc488, 177], ["f", 1.158, 47.24, 4.25, 0xc4d6ff, 720]
  ];
  var AND_LINES = [["a", "d"], ["d", "b"], ["b", "g"], ["b", "m"], ["m", "n"], ["d", "e"], ["d", "p"], ["p", "i"], ["i", "k"], ["k", "l"], ["i", "o"]];
  var HOLO_Y = 8.7, HOLO_K = 0.55, HOLO_S = 0.24, HOLO_W = 4.7, HOLO_H = 2.8;   // chart units; the whole hologram is scaled by HOLO_K
  function skyXY(raH, dec) {
    var D = Math.PI / 180, a0 = 0.55 * 15 * D, d0 = 38.8 * D, a = (raH > 12 ? raH - 24 : raH) * 15 * D, d = dec * D, da = a - a0;
    var cc = Math.sin(d0) * Math.sin(d) + Math.cos(d0) * Math.cos(d) * Math.cos(da);
    var X = Math.cos(d) * Math.sin(da) / cc, Y = (Math.cos(d0) * Math.sin(d) - Math.sin(d0) * Math.cos(d) * Math.cos(da)) / cc;
    return [-X / D * HOLO_S, Y / D * HOLO_S];   // east to the left, as seen looking up
  }
  function rng(seed) { var s = Math.floor(hash(seed) * 4294967296) >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = Math.imul(s ^ (s >>> 15), 1 | s); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function buildAndromeda() {
    var holo = new T.Group(); holo.position.set(0, HOLO_Y, 0); holo.scale.setScalar(HOLO_K); anim.holo = holo;
    var pts = { p: [], c: [], s: [], k: [] }, ln = { p: [], c: [] }, byId = {};
    function P(x, y, z, col, size, kind) { pts.p.push(x, y, z); var cc = new T.Color(col); pts.c.push(cc.r, cc.g, cc.b); pts.s.push(size); pts.k.push(kind); }
    function Ls(a, b, col, k) { ln.p.push(a[0], a[1], a[2], b[0], b[1], b[2]); var cc = new T.Color(col); k = k == null ? 1 : k; ln.c.push(cc.r * k, cc.g * k, cc.b * k, cc.r * k, cc.g * k, cc.b * k); }
    function inside(x, y) { return Math.abs(x) <= HOLO_W && Math.abs(y) <= HOLO_H; }
    // stars
    AND_STARS.forEach(function (s) {
      var xy = skyXY(s[1], s[2]), z = -(Math.log(s[5]) / Math.LN10 - 2.3) * 0.55, v = [xy[0], xy[1], z];
      byId[s[0]] = v; P(v[0], v[1], v[2], s[4], 560 * Math.pow(0.72, s[3] - 2), 1);
    });
    // stick figure + faint "drop lines" to the chart plane (3ds Max-like depth guides)
    AND_LINES.forEach(function (l) { Ls(byId[l[0]], byId[l[1]], 0x7ff6ff, 0.8); });
    AND_STARS.forEach(function (s) { var v = byId[s[0]]; if (Math.abs(v[2]) > 0.05) Ls(v, [v[0], v[1], 0], 0x4fa8ff, 0.35); });
    // AutoCAD-style drafting: graticule (RA every 1h, Dec every 5°), frame with ticks and corner brackets
    for (var ra = -1; ra <= 2; ra++) for (var dd = 24; dd < 54; dd += 1) { var u = skyXY(ra, dd), w = skyXY(ra, dd + 1); if (inside(u[0], u[1]) && inside(w[0], w[1])) Ls([u[0], u[1], 0], [w[0], w[1], 0], 0x2f6aa8, 0.55); }
    for (var dc = 30; dc <= 50; dc += 5) for (var rr = -1.6; rr < 2.6; rr += 0.1) { var u2 = skyXY(rr, dc), w2 = skyXY(rr + 0.1, dc); if (inside(u2[0], u2[1]) && inside(w2[0], w2[1])) Ls([u2[0], u2[1], 0], [w2[0], w2[1], 0], 0x2f6aa8, 0.55); }
    var fw = HOLO_W, fh = HOLO_H, FR = 0x4fe3d0;
    [[-fw, -fh, fw, -fh], [fw, -fh, fw, fh], [fw, fh, -fw, fh], [-fw, fh, -fw, -fh]].forEach(function (e) { Ls([e[0], e[1], 0], [e[2], e[3], 0], FR, 0.45); });
    for (var tx = -fw; tx <= fw + 1e-6; tx += HOLO_S) { var big = Math.abs(Math.round(tx / HOLO_S) % 5) === 0, tl = big ? 0.16 : 0.07; Ls([tx, -fh, 0], [tx, -fh + tl, 0], FR, 0.6); Ls([tx, fh, 0], [tx, fh - tl, 0], FR, 0.6); }
    for (var ty = -fh; ty <= fh + 1e-6; ty += HOLO_S) { var big2 = Math.abs(Math.round(ty / HOLO_S) % 5) === 0, tl2 = big2 ? 0.16 : 0.07; Ls([-fw, ty, 0], [-fw + tl2, ty, 0], FR, 0.6); Ls([fw, ty, 0], [fw - tl2, ty, 0], FR, 0.6); }
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) { var x0 = c[0] * (fw + 0.12), y0 = c[1] * (fh + 0.12); Ls([x0, y0, 0], [x0 - c[0] * 0.5, y0, 0], 0xe8fbff, 1); Ls([x0, y0, 0], [x0, y0 - c[1] * 0.5, 0], 0xe8fbff, 1); });
    // UCS icon (AutoCAD): X red, Y green, with arrow heads, bottom-left corner
    var ux = -fw + 0.35, uy = -fh + 0.35;
    Ls([ux, uy, 0], [ux + 0.6, uy, 0], 0xff4a4a, 1); Ls([ux + 0.6, uy, 0], [ux + 0.5, uy + 0.05, 0], 0xff4a4a, 1); Ls([ux + 0.6, uy, 0], [ux + 0.5, uy - 0.05, 0], 0xff4a4a, 1);
    Ls([ux, uy, 0], [ux, uy + 0.6, 0], 0x4aff6a, 1); Ls([ux, uy + 0.6, 0], [ux + 0.05, uy + 0.5, 0], 0x4aff6a, 1); Ls([ux, uy + 0.6, 0], [ux - 0.05, uy + 0.5, 0], 0x4aff6a, 1);
    Ls([ux - 0.04, uy - 0.04, 0], [ux + 0.04, uy - 0.04, 0], 0xe8fbff, 0.8); Ls([ux + 0.04, uy - 0.04, 0], [ux + 0.04, uy + 0.04, 0], 0xe8fbff, 0.8);
    // dimension line (AutoCAD style) from Alpheratz to Almach, below the figure: extension lines, dim line, arrowheads
    var A = byId.a, Gm = byId.g, dy = -fh + 0.55, AM = 0xffb84a;
    Ls([A[0], A[1] - 0.12, 0], [A[0], dy - 0.1, 0], AM, 0.5); Ls([Gm[0], Gm[1] - 0.12, 0], [Gm[0], dy - 0.1, 0], AM, 0.5);
    Ls([A[0], dy, 0], [Gm[0], dy, 0], AM, 0.9);
    var dir = Gm[0] < A[0] ? -1 : 1;
    Ls([A[0], dy, 0], [A[0] + dir * 0.14, dy + 0.045, 0], AM, 0.9); Ls([A[0], dy, 0], [A[0] + dir * 0.14, dy - 0.045, 0], AM, 0.9);
    Ls([Gm[0], dy, 0], [Gm[0] - dir * 0.14, dy + 0.045, 0], AM, 0.9); Ls([Gm[0], dy, 0], [Gm[0] - dir * 0.14, dy - 0.045, 0], AM, 0.9);
    // M31 (+ M32, M110): particle galaxy, deterministic PRNG, inclined disk with two arms and a bulge
    var m = skyXY(0.7122, 41.27), R = rng("M31"), PA = 35 * Math.PI / 180, semi = 1.6 * 1.5 * HOLO_S, incl = 0.32;
    var ma = [-Math.sin(PA), Math.cos(PA)], mi = [Math.cos(PA), Math.sin(PA)], NM = 2600;
    function gal(cx, cy, n, sm, inc, bulge, seed) {
      var r2 = rng(seed);
      for (var i = 0; i < n; i++) {
        var u, v, isB = r2() < bulge;
        if (isB) { var rb = Math.sqrt(-2 * Math.log(1 - r2() * 0.999)) * 0.13, tb = r2() * 6.2832; u = Math.cos(tb) * rb; v = Math.sin(tb) * rb; }
        else { var rd = -Math.log(1 - r2() * 0.985) * 0.3, arm = (r2() < 0.5 ? 0 : Math.PI), th = arm + rd * 4.2 + (r2() - 0.5) * (0.9 - Math.min(0.6, rd * 0.6)); u = Math.cos(th) * rd; v = Math.sin(th) * rd; }
        var x = cx + (ma[0] * u + mi[0] * v * inc) * sm, y = cy + (ma[1] * u + mi[1] * v * inc) * sm, z = (r2() - 0.5) * 0.05 * sm;
        var col = isB ? 0xffe2b0 : (r2() < 0.18 ? 0xff9ac8 : 0xa8c8ff);
        P(x, y, z, col, isB ? 40 + r2() * 30 : 20 + r2() * 24, 2);
      }
    }
    gal(m[0], m[1], NM, semi, incl, 0.28, "M31"); gal(skyXY(0.7117, 40.865)[0], skyXY(0.7117, 40.865)[1], 140, 0.06, 0.8, 1, "M32"); gal(skyXY(0.6731, 41.685)[0], skyXY(0.6731, 41.685)[1], 200, 0.1, 0.55, 1, "M110");
    // AutoCAD crosshair + pickbox on M31
    Ls([m[0] - 0.9, m[1], 0], [m[0] - 0.12, m[1], 0], 0xe8fbff, 0.45); Ls([m[0] + 0.12, m[1], 0], [m[0] + 0.9, m[1], 0], 0xe8fbff, 0.45);
    Ls([m[0], m[1] - 0.9, 0], [m[0], m[1] - 0.12, 0], 0xe8fbff, 0.45); Ls([m[0], m[1] + 0.12, 0], [m[0], m[1] + 0.9, 0], 0xe8fbff, 0.45);
    [[-1, -1, 1, -1], [1, -1, 1, 1], [1, 1, -1, 1], [-1, 1, -1, -1]].forEach(function (e) { Ls([m[0] + e[0] * 0.05, m[1] + e[1] * 0.05, 0], [m[0] + e[2] * 0.05, m[1] + e[3] * 0.05, 0], 0xe8fbff, 0.8); });
    // points
    var pg = new T.BufferGeometry();
    pg.setAttribute("position", new T.Float32BufferAttribute(pts.p, 3)); pg.setAttribute("aCol", new T.Float32BufferAttribute(pts.c, 3));
    pg.setAttribute("aSize", new T.Float32BufferAttribute(pts.s, 1)); pg.setAttribute("aKind", new T.Float32BufferAttribute(pts.k, 1));
    var pm = new T.ShaderMaterial({
      uniforms: { uPx: { value: 1 }, uTime: G.uTime, uReduce: G.uReduce }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: "attribute vec3 aCol; attribute float aSize, aKind; uniform float uPx, uTime, uReduce; varying vec3 vC; varying float vK, vTw;" +
        "void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = clamp(aSize * uPx / -mv.z, 1.0, 64.0); vC = aCol; vK = aKind;" +
        " vTw = uReduce > 0.5 ? 1.0 : 0.8 + 0.2 * sin(uTime * 2.3 + position.x * 17.0 + position.y * 11.0); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "varying vec3 vC; varying float vK, vTw; void main(){ vec2 d = gl_PointCoord - 0.5; float r2 = dot(d, d);" +
        " if (vK < 1.5) { float core = exp(-r2 * 140.0), halo = exp(-r2 * 18.0) * 0.32; float sp = (exp(-abs(d.x) * 70.0) * exp(-abs(d.y) * 7.0) + exp(-abs(d.y) * 70.0) * exp(-abs(d.x) * 7.0)) * 0.35;" +
        "   gl_FragColor = vec4((mix(vC, vec3(1.0), 0.45) * core * 1.4 + vC * (halo + sp)) * vTw, 1.0); }" +
        " else { float g = exp(-r2 * 30.0); gl_FragColor = vec4(vC * g * 0.5, 1.0); } }"
    });
    var stars = new T.Points(pg, pm); holo.add(reflect(stars)); anim.holoPts = stars;
    var lg = new T.BufferGeometry(); lg.setAttribute("position", new T.Float32BufferAttribute(ln.p, 3)); lg.setAttribute("color", new T.Float32BufferAttribute(ln.c, 3));
    holo.add(reflect(new T.LineSegments(lg, new T.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, blending: T.AdditiveBlending, depthWrite: false }))));
    // 3ds Max-style rotate gizmo around M31: X/Y/Z rings (red/green/blue) + grey screen ring
    var giz = new T.Group(); giz.position.set(m[0], m[1], 0);
    [[0xff4a4a, [0, Math.PI / 2, 0]], [0x4aff6a, [Math.PI / 2, 0, 0]], [0x4a8cff, [0, 0, 0]]].forEach(function (g) {
      var c = new T.LineLoop(new T.BufferGeometry().setFromPoints(new T.EllipseCurve(0, 0, 0.78, 0.78, 0, Math.PI * 2).getPoints(64)), lineMat(g[0], 0.55)); c.rotation.set(g[1][0], g[1][1], g[1][2]); giz.add(c);
    });
    giz.add(new T.LineLoop(new T.BufferGeometry().setFromPoints(new T.EllipseCurve(0, 0, 0.9, 0.9, 0, Math.PI * 2).getPoints(72)), lineMat(0x9aa6b8, 0.3)));
    holo.add(reflect(giz)); anim.gizmo = giz;
    // lasers: street projector under the hologram, one beam per star + M31; travelling pulses (static with reduced motion)
    var lp = [], lt = [], ls = [], E = [0, (-HOLO_Y + 0.05) / HOLO_K, 0], tgt = AND_STARS.map(function (s) { return byId[s[0]]; }).concat([[m[0], m[1], 0]]);
    tgt.forEach(function (t, j) {
      var sd = hash("laser" + j), SEG = 24;
      for (var k = 0; k < SEG; k++) { var a = k / SEG, b = (k + 1) / SEG; lp.push(E[0] + (t[0] - E[0]) * a, E[1] + (t[1] - E[1]) * a, E[2] + (t[2] - E[2]) * a, E[0] + (t[0] - E[0]) * b, E[1] + (t[1] - E[1]) * b, E[2] + (t[2] - E[2]) * b); lt.push(a, b); ls.push(sd, sd); }
    });
    var bg = new T.BufferGeometry(); bg.setAttribute("position", new T.Float32BufferAttribute(lp, 3)); bg.setAttribute("aT", new T.Float32BufferAttribute(lt, 1)); bg.setAttribute("aSeed", new T.Float32BufferAttribute(ls, 1));
    holo.add(reflect(new T.LineSegments(bg, new T.ShaderMaterial({
      uniforms: { uTime: G.uTime, uReduce: G.uReduce }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: "attribute float aT, aSeed; varying float vT, vS; void main(){ vT = aT; vS = aSeed; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform float uTime, uReduce; varying float vT, vS; void main(){ float p = uReduce > 0.5 ? 0.0 : exp(-pow((fract(vT - uTime * 0.3 - vS) - 0.5) * 16.0, 2.0));" +
        " vec3 c = vec3(0.35,1.0,0.75) * (0.07 + 0.08 * vT + 0.75 * p); gl_FragColor = vec4(c, 1.0); }"
    }))));
    root.add(holo);
    // projector on the road (decor): base disk + emitter ring
    var pb = new T.CylinderGeometry(0.28, 0.34, 0.06, 20); pb.translate(0, 0.03, 0);
    root.add(reflect(new T.Mesh(pb, new T.MeshBasicMaterial({ color: 0x0c1a24 }))));
    root.add(reflect(new T.LineSegments(new T.EdgesGeometry(pb), lineMat(0x5dffb0, 0.7))));
    var er = new T.Mesh(new T.TorusGeometry(0.16, 0.012, 6, 32), glowMat(0x7dffc8, 0.9)); er.rotation.x = Math.PI / 2; er.position.y = 0.07; root.add(reflect(er));
    st.holo = { stars: AND_STARS.length, figure_lines: AND_LINES.length, galaxy_points: NM + 340 };
  }

  /* ================= data scene (batched: few draw calls) ================= */
  var BRAND = [ // widely known brand colours, used only to tint the decorative name sign (no logo shapes)
    [/^ING\b/i, 0xff6200], [/comdirect/i, 0xfff04a], [/haspa|sparkasse/i, 0xff2a2a], [/\bDKB\b/i, 0x2f8fff], [/trade republic/i, 0xf2f4f8],
    [/commerzbank/i, 0xffcc00], [/\bC24\b/i, 0x35c8ff], [/\bN26\b/i, 0x3fd6b6], [/volksbank/i, 0x2f7dff], [/chase/i, 0x2f8cff],
    [/bank of america/i, 0xff3348], [/\bally\b/i, 0xb05cff], [/wells fargo/i, 0xff3a3a], [/capital one/i, 0xff4a3a]
  ];
  function brand(b) { for (var i = 0; i < BRAND.length; i++) if (BRAND[i][0].test(b)) return BRAND[i][1]; return 0x9fe8ff; }
  function shortName(b) { var s = String(b).replace(/\s*\(.*\)\s*$/, ""); return s.length > 40 ? s.slice(0, 40) : s; }

  function Batch(spec) { this.spec = spec; this.pos = []; this.nor = []; this.uv = []; this.a = {}; for (var k in spec.attrs) this.a[k] = []; }
  Batch.prototype.add = function (geo, mtx, vals) {
    var g = geo.index ? geo.toNonIndexed() : geo; if (mtx) g.applyMatrix4(mtx);
    var p = g.attributes.position.array, n = p.length / 3, i, k, j;
    for (i = 0; i < p.length; i++) this.pos.push(p[i]);
    if (this.spec.normal) { var nn = g.attributes.normal ? g.attributes.normal.array : null; for (i = 0; i < n * 3; i++) this.nor.push(nn ? nn[i] : 0); }
    if (this.spec.uv) { var uu = g.attributes.uv ? g.attributes.uv.array : null; for (i = 0; i < n * 2; i++) this.uv.push(uu ? uu[i] : 0); }
    for (k in this.spec.attrs) { var sz = this.spec.attrs[k], v = vals[k], arr = this.a[k]; for (i = 0; i < n; i++) for (j = 0; j < sz; j++) arr.push(v == null ? 0 : (sz === 1 ? v : v[j])); }
    if (g !== geo) g.dispose(); geo.dispose();
  };
  Batch.prototype.geometry = function () {
    if (!this.pos.length) return null;
    var g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(this.pos, 3));
    if (this.spec.normal) g.setAttribute("normal", new T.Float32BufferAttribute(this.nor, 3));
    if (this.spec.uv) g.setAttribute("uv", new T.Float32BufferAttribute(this.uv, 2));
    for (var k in this.spec.attrs) g.setAttribute(k, new T.Float32BufferAttribute(this.a[k], this.spec.attrs[k]));
    g.computeBoundingSphere(); return g;
  };
  function M(x, y, z, rx, sy) { var m = new T.Matrix4().makeTranslation(x, y, z); if (rx) m.multiply(new T.Matrix4().makeRotationX(rx)); if (sy != null) m.multiply(new T.Matrix4().makeScale(1, sy, 1)); return m; }
  function cv3(c, k) { var cc = new T.Color(c); k = k == null ? 1 : k; return [cc.r * k, cc.g * k, cc.b * k]; }

  var FACADE_V = "attribute vec3 aCol; attribute float aBright, aStatus, aSeed, aH, aBank; varying vec3 vW, vN, vC; varying float vB, vS, vSeed, vH, vBank, vFogD;" +
    "void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; vN = normalize(mat3(modelMatrix) * normal); vC = aCol; vB = aBright; vS = aStatus; vSeed = aSeed; vH = aH; vBank = aBank; vec4 mv = viewMatrix * w; vFogD = -mv.z; gl_Position = projectionMatrix * mv; }";
  var STATUS_GLSL = "float flick(float seed){ return uReduce > 0.5 ? 1.0 : (0.6 + 0.4 * step(0.35, fract(sin(floor(uTime * 7.0 + seed * 31.0)) * 43758.5))); }" +
    "float pulse(float seed){ return uReduce > 0.5 ? 0.5 : 0.5 + 0.5 * sin(uTime * 2.6 + seed * 6.0); }";
  function facadeBatchMat(alpha, add) {
    return new T.ShaderMaterial({
      uniforms: { uTime: G.uTime, uFogCol: G.uFogCol, uReduce: G.uReduce, uHi: G.uHi, uAlpha: { value: alpha } },
      vertexShader: FACADE_V,
      fragmentShader: FOG + "uniform float uTime, uReduce, uHi, uAlpha; varying vec3 vW, vN, vC; varying float vB, vS, vSeed, vH, vBank;" + STATUS_GLSL +
        "void main(){ vec3 V = normalize(cameraPosition - vW); vec3 N = normalize(vN); float fr = pow(1.0 - abs(dot(N, V)), 2.2); float top = step(0.5, abs(N.y));" +
        " float fl = 1.0 - smoothstep(0.0, 0.02, 0.11 - abs(fract(vW.y / 0.22) - 0.5) * 0.22);" +
        " float mu = 1.0 - smoothstep(0.0, 0.012, 0.09 - abs(fract((vW.x + vW.z) / 0.18) - 0.5) * 0.18);" +
        " float scan = uReduce > 0.5 ? 0.0 : exp(-pow((vW.y - mod(uTime * 0.7 + vSeed * 9.0, vH + 1.5) + 0.5) * 9.0, 2.0));" +
        " float cell = (1.0 - fl) * (1.0 - mu) * (1.0 - top);" +
        " vec3 c = vC * (0.10 + 0.6 * fr + 0.55 * fl * (1.0 - top) + 0.35 * mu * (1.0 - top) + 0.16 * top) + vC * cell * 0.1 * (0.5 + 0.5 * fract(sin(dot(floor(vec2(vW.x + vW.z, vW.y) / vec2(0.18, 0.22)), vec2(12.9, 78.2)) + vSeed) * 4375.5)) + vC * scan * 0.6;" +
        " c *= vB;" +
        " if (vS > 0.5 && vS < 1.5) { float g = dot(c, vec3(0.33)); c = mix(c, vec3(g) * vec3(0.8,0.9,1.1), 0.45) * 0.62 * flick(vSeed); }" +
        " if (vS > 1.5 && vS < 2.5) { c = mix(c, vec3(1.0, 0.62, 0.12) * (0.25 + 0.6 * fr + 0.2 * fl), 0.45 + 0.35 * pulse(vSeed)); }" +
        " if (abs(vBank - uHi) < 0.5) c += vC * 0.3; gl_FragColor = vec4(fogit(c), uAlpha); }",
      transparent: alpha < 1, depthWrite: alpha >= 1, side: T.DoubleSide, blending: add ? T.AdditiveBlending : T.NormalBlending
    });
  }

  function clearDyn() {
    if (!dyn) return;
    world.remove(dyn);
    dyn.traverse(function (c) { if (c.geometry) c.geometry.dispose(); if (c.material) [].concat(c.material).forEach(function (mm) { if (mm.uniforms && mm.uniforms.uAtlas && mm.uniforms.uAtlas.value) mm.uniforms.uAtlas.value.dispose(); mm.dispose(); }); });
    dyn = null;
  }
  function lotsFor(list, side) {
    if (side === "DE") {
      var hh = list.filter(function (b) { return HH.test(b.bank); }), rest = list.filter(function (b) { return !HH.test(b.bank); });
      var seq = rest.concat(hh.length ? [null] : [], hh), n = seq.length, x0 = -(n - 1) * LOT / 2, out = [];
      seq.forEach(function (b, i) { if (b) out.push({ b: b, x: x0 + i * LOT, hh: HH.test(b.bank) }); });
      return out;
    }
    var step = list.length > 1 ? Math.min(5.2, 24 / (list.length - 1)) : 0, xs = -(list.length - 1) * step / 2;
    return list.map(function (b, i) { return { b: b, x: xs + i * step, hh: false }; });
  }
  function pick(o, info) { o.userData.pick = info; picks.push(o); return o; }
  var B = null, bankInfo = [];

  function build() {
    clearDyn(); picks = []; anim.melts = []; anim.rings = []; hover = null; pinned = null; hideTip(); bankInfo = []; G.uHi.value = -1;
    st.banks = 0; st.cards = 0; st.status = {}; st.nulls = []; st.changes = 0;
    dyn = new T.Group(); world.add(dyn);
    B = {
      facade: new Batch({ normal: true, attrs: { aCol: 3, aBright: 1, aStatus: 1, aSeed: 1, aH: 1, aBank: 1 } }),
      glass: new Batch({ normal: true, attrs: { aCol: 3, aBright: 1, aStatus: 1, aSeed: 1, aH: 1, aBank: 1 } }),
      column: new Batch({ normal: true, attrs: { aCol: 3, aBright: 1, aStatus: 1, aSeed: 1, aH: 1, aBank: 1 } }),
      glow: new Batch({ attrs: { color: 3, aBank: 1 } }),
      lines: new Batch({ attrs: { color: 3 } }),
      od: new Batch({ uv: true, attrs: { aI: 1 } }),
      sign: new Batch({ attrs: { aCenter: 3, aCorner: 2, aRect: 4, aCol: 3, aStatus: 1, aSeed: 1 } }),
      beam: new Batch({ uv: true, attrs: { aCol: 3, aStatus: 1, aSeed: 1 } })
    };
    var d = data, cards = (d && Array.isArray(d.cards)) ? d.cards : [];
    var byBank = {}, order = [];
    cards.forEach(function (c) {
      if (!c || typeof c !== "object" || typeof c.bank !== "string") return;
      st.cards++; st.status[c.status || "none"] = (st.status[c.status || "none"] || 0) + 1;
      var key = (c.country === "US" ? "US" : c.country === "DE" ? "DE" : "?") + "|" + c.bank;
      if (!byBank[key]) { byBank[key] = { bank: c.bank, country: c.country, cards: [] }; order.push(key); }
      byBank[key].cards.push(c);
    });
    order.sort();
    var de = [], us = [];
    order.forEach(function (k) { var b = byBank[k]; b.cards.sort(function (a, z) { return String(a.id) < String(z.id) ? -1 : 1; }); if (b.country === "DE") de.push(b); else if (b.country === "US") us.push(b); });
    var lots = lotsFor(de, "DE").map(function (l) { l.z = Z_DE; l.s = -1; return l; }).concat(lotsFor(us, "US").map(function (l) { l.z = Z_US; l.s = 1; return l; }));

    var hhLots = lots.filter(function (l) { return l.hh; });
    if (hhLots.length) {
      var xa = hhLots[0].x - LOT / 2 + 0.1, xb = hhLots[hhLots.length - 1].x + LOT / 2 - 0.1;
      var pg = new T.BoxGeometry(xb - xa, 0.06, 2.6); pg.translate((xa + xb) / 2, 0.03, Z_DE);
      dyn.add(reflect(new T.Mesh(pg, new T.MeshBasicMaterial({ color: 0x07131c })))); B.lines.add(new T.EdgesGeometry(pg), null, { color: cv3(0x4fe3d0, 0.55) });
    }
    var bankPos = {};
    lots.forEach(function (l) { st.banks++; bankPos[l.b.bank] = l; bankInfo.push({ bank: l.b.bank, cards: l.b.cards }); l.idx = bankInfo.length; buildBank(l); });
    buildSigns(lots);
    buildBaseline(d);
    buildChanges(d, bankPos);
    finishBatches();
  }

  function finishBatches() {
    var g;
    if ((g = B.facade.geometry())) dyn.add(pick(reflect(new T.Mesh(g, facadeBatchMat(1, false))), "batch"));
    if ((g = B.glass.geometry())) dyn.add(pick(reflect(new T.Mesh(g, facadeBatchMat(0.75, false))), "batch"));
    if ((g = B.column.geometry())) dyn.add(pick(reflect(new T.Mesh(g, facadeBatchMat(0.55, true))), "batch"));
    if ((g = B.glow.geometry())) dyn.add(pick(reflect(new T.Mesh(g, new T.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }))), "batch"));
    if ((g = B.lines.geometry())) dyn.add(reflect(new T.LineSegments(g, new T.LineBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false }))));
    if ((g = B.od.geometry())) dyn.add(new T.Mesh(g, new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: "attribute float aI; varying vec2 vU; varying vec3 vW; varying float vI; void main(){ vU = uv; vI = aI; vW = (modelMatrix * vec4(position,1.0)).xyz; gl_Position = projectionMatrix * viewMatrix * vec4(vW,1.0); }",
      fragmentShader: "varying vec2 vU; varying vec3 vW; varying float vI; void main(){ vec2 q = vU - 0.5; float r = exp(-dot(q,q) * 9.0); vec2 t = abs(fract(vW.xz / 0.3) - 0.5); float crack = 1.0 - smoothstep(0.0, 0.06, min(0.5 - t.x, 0.5 - t.y)); gl_FragColor = vec4(vec3(1.0,0.08,0.06) * r * vI * (0.25 + 0.9 * crack), 1.0); }"
    })));
    if ((g = B.beam.geometry())) dyn.add(reflect(new T.Mesh(g, new T.ShaderMaterial({
      uniforms: { uTime: G.uTime, uReduce: G.uReduce }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
      vertexShader: "attribute vec3 aCol; attribute float aStatus, aSeed; varying vec2 vU; varying vec3 vC; varying float vS, vSeed; void main(){ vU = uv; vC = aCol; vS = aStatus; vSeed = aSeed; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: "uniform float uTime, uReduce; varying vec2 vU; varying vec3 vC; varying float vS, vSeed;" + STATUS_GLSL +
        "void main(){ float a = 0.11 * pow(vU.y, 1.5) * (0.55 + 0.45 * step(0.5, fract(vU.x * 24.0))); float sl = 0.65 + 0.35 * sin((vU.y * 30.0 - (uReduce > 0.5 ? 0.0 : uTime * 1.2)) * 3.14159); vec3 c = vC * a * sl;" +
        " if (vS > 0.5 && vS < 1.5) c *= 0.45 * flick(vSeed); if (vS > 1.5 && vS < 2.5) c = mix(c, vec3(1.0,0.62,0.12) * a, 0.5 + 0.4 * pulse(vSeed)); if (vS > 2.5) c = vec3(0.5) * a * 0.5; gl_FragColor = vec4(c, 1.0); }"
    }))));
    if (B.signTex && (g = B.sign.geometry())) {
      var sm = new T.ShaderMaterial({
        uniforms: { uTime: G.uTime, uReduce: G.uReduce, uAtlas: { value: B.signTex }, uFogCol: G.uFogCol }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
        vertexShader: "attribute vec3 aCenter, aCol; attribute vec2 aCorner; attribute vec4 aRect; attribute float aStatus, aSeed; varying vec2 vU; varying vec3 vC; varying float vS, vSeed, vFogD, vY;" +
          "void main(){ vec3 toC = cameraPosition - aCenter; vec2 h = normalize(toC.xz + vec2(1e-4)); vec3 right = vec3(h.y, 0.0, -h.x);" + // cylindrical billboard: always readable from both sides
          " vec3 p = aCenter + right * aCorner.x + vec3(0.0, aCorner.y, 0.0); vU = aRect.xy + (aCorner / vec2(" + SIGN_W.toFixed(3) + ", " + SIGN_H.toFixed(3) + ") + 0.5) * aRect.zw; vY = aCorner.y / " + SIGN_H.toFixed(3) + " + 0.5;" +
          " vC = aCol; vS = aStatus; vSeed = aSeed; vec4 mv = viewMatrix * vec4(p, 1.0); vFogD = -mv.z; gl_Position = projectionMatrix * mv; }",
        fragmentShader: FOG + "uniform sampler2D uAtlas; uniform float uTime, uReduce; varying vec2 vU; varying vec3 vC; varying float vS, vSeed, vY;" + STATUS_GLSL +
          "void main(){ vec4 t = texture2D(uAtlas, vU); float core = t.r, halo = t.g;" +
          " float sl = 0.78 + 0.22 * sin(gl_FragCoord.y * 1.4);" +   // hologram scan lines (screen space)
          " float band = uReduce > 0.5 ? 0.0 : 0.35 * exp(-pow((vY - fract(uTime * 0.25 + vSeed)) * 8.0, 2.0));" +
          " vec3 c = (vC * halo * 1.1 + mix(vC, vec3(1.0), 0.5) * core * 1.25) * sl * (1.0 + band);" +
          " if (vS > 0.5 && vS < 1.5) c *= 0.4 * flick(vSeed);" +
          " if (vS > 1.5 && vS < 2.5) c = mix(c, vec3(1.0,0.62,0.12) * (core + halo * 0.6), 0.45 + 0.4 * pulse(vSeed));" +
          " if (vS > 2.5) c = vec3(0.62,0.65,0.7) * core * 0.8;" +
          " gl_FragColor = vec4(fogit(c) * (1.0 - smoothstep(60.0, 90.0, vFogD)), 1.0); }"
      });
      dyn.add(reflect(new T.Mesh(g, sm)));
    }
    B = null;
  }

  var SIGN_W = 2.5, SIGN_H = 0.5;
  function signStatus(cards) {
    var s = cards.map(function (c) { return c.status; });
    if (s.length && s.every(function (x) { return x === "blocked"; })) return 3;
    if (s.indexOf("stale") >= 0) return 1; if (s.indexOf("check") >= 0) return 2; return 0;
  }
  function buildSigns(lots) {
    if (!lots.length) return;
    var CW = 1024, CH = 205, cols = 2, rows = Math.ceil(lots.length / cols), H = 128; while (H < rows * CH) H *= 2;
    var cvs = document.createElement("canvas"); cvs.width = CW * cols; cvs.height = H; var x = cvs.getContext("2d");
    if (!x) return;
    x.fillStyle = "#000"; x.fillRect(0, 0, cvs.width, cvs.height);
    lots.forEach(function (l, i) {
      var ox = (i % cols) * CW, oy = Math.floor(i / cols) * CH, name = shortName(l.b.bank), sStat = signStatus(l.b.cards), hollow = sStat === 3;
      var size = 96; x.font = "700 " + size + "px sans-serif"; var lines = [name];
      if (x.measureText(name).width > CW - 120) { var sp = name.lastIndexOf(" ", Math.floor(name.length / 2) + 6); if (sp > 0) lines = [name.slice(0, sp), name.slice(sp + 1)]; size = 70; }
      x.font = "700 " + size + "px sans-serif"; var mw = Math.max.apply(null, lines.map(function (s) { return x.measureText(s).width; }));
      if (mw > CW - 120) { size = Math.floor(size * (CW - 120) / mw); x.font = "700 " + size + "px sans-serif"; }
      x.textAlign = "center"; x.textBaseline = "middle"; x.lineJoin = "round";
      var cy = oy + CH / 2, lh = size * 1.05;
      // green channel = soft halo, red channel = crisp core (tinted in the shader by brand colour and status)
      lines.forEach(function (s, k) {
        var y = cy + (k - (lines.length - 1) / 2) * lh;
        x.save(); x.shadowColor = "rgb(0,255,0)"; x.shadowBlur = 30; x.strokeStyle = "rgb(0,230,0)"; x.lineWidth = hollow ? 5 : 14; x.strokeText(s, ox + CW / 2, y); x.restore();
        x.globalCompositeOperation = "lighter";
        if (hollow) { x.strokeStyle = "rgb(255,0,0)"; x.lineWidth = 3; x.strokeText(s, ox + CW / 2, y); }
        else { x.fillStyle = "rgb(255,0,0)"; x.fillText(s, ox + CW / 2, y); }
        x.globalCompositeOperation = "source-over";
      });
      // thin neon frame (decor), dashed when hollow
      x.save(); x.globalCompositeOperation = "lighter"; x.strokeStyle = "rgb(150,90,0)"; x.lineWidth = 4; if (hollow) x.setLineDash([14, 12]);
      x.strokeRect(ox + 22, oy + 18, CW - 44, CH - 36); x.restore();
      var top = l.top + 0.95 + (l.s < 0 && (i % 2) ? 0.62 : 0), seed = hash(l.b.bank), col = cv3(hollow ? 0x9aa0aa : brand(l.b.bank));
      var rect = [ox / cvs.width, 1 - (oy + CH) / cvs.height, CW / cvs.width, CH / cvs.height];
      var q = new T.PlaneGeometry(SIGN_W, SIGN_H), corners = [];
      var qn = q.toNonIndexed(); var pa = qn.attributes.position.array; for (var k = 0; k < pa.length; k += 3) corners.push(pa[k], pa[k + 1]);
      q.dispose(); qn.dispose();
      var cornerArr = corners, n = cornerArr.length / 2, s = B.sign;
      for (var v = 0; v < n; v++) {
        s.pos.push(l.x, top, l.z); s.a.aCenter.push(l.x, top, l.z); s.a.aCorner.push(cornerArr[v * 2], cornerArr[v * 2 + 1]);
        s.a.aRect.push(rect[0], rect[1], rect[2], rect[3]); s.a.aCol.push(col[0], col[1], col[2]); s.a.aStatus.push(sStat); s.a.aSeed.push(seed);
      }
      // projector: small emitter on the roof + slow scan-line beam up to the sign (decor)
      var bh = top - SIGN_H / 2 - l.roof;
      if (bh > 0.05) {
        var bg = new T.CylinderGeometry(0.75, 0.06, bh, 16, 1, true); bg.translate(0, bh / 2, 0);
        B.beam.add(bg, M(l.x, l.roof, l.z), { aCol: col, aStatus: sStat, aSeed: seed });
        var em = new T.CylinderGeometry(0.09, 0.12, 0.06, 10); B.glow.add(em, M(l.x, l.roof + 0.03, l.z), { color: cv3(hollow ? 0x707780 : brand(l.b.bank), 0.9) });
      }
    });
    var tex = new T.CanvasTexture(cvs); tex.minFilter = T.LinearMipMapLinearFilter; tex.generateMipmaps = true; tex.anisotropy = 4;
    B.signTex = tex;
  }

  function buildBank(l) {
    var b = l.b, X = l.x, Z = l.z, idx = l.idx;
    var chk = b.cards.filter(function (c) { return c.product === "checking"; }), sav = b.cards.filter(function (c) { return c.product === "savings"; });
    var hasBoth = chk.length && sav.length, face = -l.s, info = bankInfo[idx - 1];
    l.top = 0.4; l.roof = 0.12;
    var plot = new T.BoxGeometry(LOT - 0.35, 0.02, 2.3); B.lines.add(new T.EdgesGeometry(plot), M(X, 0.01, Z), { color: cv3(0x3a5a8a, 0.5) }); plot.dispose();
    chk.forEach(function (c, i) {
      var sc = stCode(c.status), fee = num(c.fee_monthly), seed = hash(c.id || b.bank);
      var tx = X + (hasBoth ? -0.45 : 0) + i * 0.2, w = 1.15, dpt = 1.3;
      if (sc === 3 || fee === null) {
        var fr = dashedBox(w, 1.4, dpt, sc === 3 ? 0x8a8f99 : 0x9ab0d0); fr.position.set(tx, 0, Z); dyn.add(reflect(fr));
        var hit = new T.Mesh(new T.BoxGeometry(w, 1.4, dpt), new T.MeshBasicMaterial({ visible: false })); hit.position.set(tx, 0.7, Z); dyn.add(pick(hit, info));
        if (fee === null) st.nulls.push(c.id + ".fee_monthly");
        l.top = Math.max(l.top, 1.4); l.roof = Math.max(l.roof, 1.4); return;
      }
      var tFee = clamp(fee / FEE_MAX, 0, 1);
      var col = new T.Color(0x7fe9ff).lerp(new T.Color(0x6a46ff), tFee), bright = fee === 0 ? 0.7 : 1.1 - 0.45 * tFee;
      var h = fee === 0 ? 0.32 : 0.55 + fee * FEE_H, vals = { aCol: [col.r, col.g, col.b], aBright: bright, aStatus: sc, aSeed: seed, aH: h, aBank: idx };
      var geo = new T.BoxGeometry(w, h, dpt); geo.translate(0, h / 2, 0);
      B.lines.add(new T.EdgesGeometry(geo), M(tx, 0, Z), { color: cv3(col.clone().lerp(new T.Color(0xffffff), 0.3), sc === 1 ? 0.5 : 0.8) });
      B.facade.add(geo, M(tx, 0, Z), vals);
      var roof = h;
      if (fee === 0) { // zero fee: clean bright crown OUTLINE (distinct from "no data"), roof itself stays dark
        var rg = new T.BoxGeometry(w + 0.1, 0.02, dpt + 0.1); B.lines.add(new T.EdgesGeometry(rg), M(tx, h + 0.02, Z), { color: cv3(0xe8fbff, 1) }); B.lines.add(new T.EdgesGeometry(rg), M(tx, h + 0.06, Z), { color: cv3(0xe8fbff, 0.5) }); rg.dispose();
      } else {
        var ch = Math.min(0.5, h * 0.12), cg = new T.BoxGeometry(w * 0.6, ch, dpt * 0.6); cg.translate(0, h + ch / 2, 0);
        B.lines.add(new T.EdgesGeometry(cg), M(tx, 0, Z), { color: cv3(col, 0.6) }); B.facade.add(cg, M(tx, 0, Z), vals); roof = h + ch;
      }
      var wv = Array.isArray(c.fee_monthly_waived_if) ? c.fee_monthly_waived_if.length : 0;
      if (wv > 0 && fee > 0) {
        var ph = Math.min(0.32, (h * 0.6) / wv);
        for (var k = 0; k < Math.min(wv, 8); k++) B.glow.add(new T.PlaneGeometry(0.22, ph * 0.7), M(tx - w * 0.18, h * 0.2 + ph * (k + 0.5), Z + face * (dpt / 2 + 0.006)), { color: cv3(0xfff1c8, sc === 1 ? 0.55 : 0.9), aBank: idx });
      }
      var fx = num(c.fx_fee_pct);
      if (fx !== null) {
        var p0 = new T.Vector3(tx, 0.02, Z + face * (dpt / 2 + 0.05)), p2 = new T.Vector3(tx, 0.02, (-l.s) * (CURB + 0.05)), p1 = new T.Vector3(tx, 6.4, (p0.z + p2.z) / 2);
        var rad = fx === 0 ? 0.007 : 0.014 + fx * 0.032, tf = clamp(fx / 2.5, 0, 1);
        var acol = fx === 0 ? new T.Color(0xeaffff) : new T.Color().setHSL(0.14 * (1 - tf), 1, 0.5);
        B.glow.add(new T.TubeGeometry(new T.QuadraticBezierCurve3(p0, p1, p2), 48, rad, 6, false), null, { color: cv3(acol, fx === 0 ? 0.9 : (sc === 1 ? 0.4 : 0.6)), aBank: idx });
      }
      var od = num(c.overdraft_rate);
      if (od !== null) { var og = new T.PlaneGeometry(1.8, 1.4); B.od.add(og, M(tx, 0.015, Z + face * (dpt / 2 + 0.75), -Math.PI / 2), { aI: clamp(od / 12, 0, 1.2) }); }
      l.top = Math.max(l.top, roof + 0.1); l.roof = Math.max(l.roof, roof);
    });
    sav.forEach(function (c, i) {
      var sc = stCode(c.status), rate = num(c.rate), seed = hash(c.id || b.bank);
      var sx = X + (hasBoth ? 0.62 : 0) + i * 0.3, sz = Z + face * 0.35;
      var domeG = new T.SphereGeometry(0.42, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2);
      var baseG = new T.CylinderGeometry(0.5, 0.55, 0.12, 24); B.lines.add(new T.EdgesGeometry(baseG), M(sx, 0.06, sz), { color: cv3(0x6fd8ff, 0.5) }); baseG.dispose();
      if (sc === 3 || rate === null) {
        B.lines.add(new T.WireframeGeometry(domeG), M(sx, 0.12, sz), { color: cv3(sc === 3 ? 0x8a8f99 : 0xb8c6dc, 0.45) });
        if (sc === 2) B.glass.add(domeG.clone(), M(sx, 0.12, sz), { aCol: [1, 0.63, 0.19], aBright: 0.35, aStatus: 2, aSeed: seed, aH: 0.5, aBank: idx });
        var hit = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 0.6, 8), new T.MeshBasicMaterial({ visible: false })); hit.position.set(sx, 0.3, sz); dyn.add(pick(hit, info));
        if (rate === null) st.nulls.push(c.id + ".rate");
        domeG.dispose(); l.top = Math.max(l.top, 0.7); l.roof = Math.max(l.roof, 0.55); return;
      }
      var col = new T.Color(0x5ff7d0), cvv = [col.r, col.g, col.b];
      B.glass.add(domeG, M(sx, 0.12, sz), { aCol: cvv, aBright: 1, aStatus: sc, aSeed: seed, aH: 0.5, aBank: idx });
      var after = num(c.rate_after_promo), isPromo = c.rate_type === "promo";
      var hBase = (isPromo && after !== null) ? after * K_RATE : rate * K_RATE;
      var colG = new T.CylinderGeometry(0.07, 0.11, 1, 12, 1, true); colG.translate(0, 0.5, 0);
      B.column.add(colG, M(sx, 0, sz, 0, Math.max(0.001, hBase)), { aCol: cvv, aBright: 1, aStatus: sc, aSeed: seed, aH: hBase, aBank: idx });
      B.glow.add(new T.TorusGeometry(0.2, 0.012, 6, 32), M(sx, hBase, sz, Math.PI / 2), { color: cv3(col, sc === 1 ? 0.5 : 0.9), aBank: idx });
      var top = rate * K_RATE;
      if (isPromo && after !== null && rate > after) {
        var pG = new T.CylinderGeometry(0.13, 0.13, 1, 14, 1, true); pG.translate(0, -1, 0);
        var pm = new T.ShaderMaterial({
          uniforms: { uTime: G.uTime }, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide,
          vertexShader: "varying vec2 vU; void main(){ vU = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
          fragmentShader: "varying vec2 vU; void main(){ float s = step(0.5, fract((vU.x * 6.0 + vU.y * 3.0))); vec3 c = vec3(1.0,0.72,0.3) * (0.35 + 0.35 * s) * (0.4 + 0.6 * vU.y); gl_FragColor = vec4(c, 1.0); }"
        });
        var pl = new T.Mesh(pG, pm); pl.position.set(sx, top, sz); pl.scale.y = top - hBase; dyn.add(reflect(pl));
        var pc = new T.Mesh(new T.TorusGeometry(0.2, 0.01, 6, 32), glowMat(0xffc070, 0.85)); pc.rotation.x = Math.PI / 2; pc.position.set(sx, top, sz); dyn.add(reflect(pc));
        anim.melts.push({ m: pl, c: pc, top: top, base: hBase });
      }
      var giro = num(c.promo_rate_with_giro);
      if (giro !== null) { B.glow.add(new T.TorusGeometry(0.27, 0.006, 4, 32), M(sx, giro * K_RATE, sz, Math.PI / 2), { color: cv3(0xffe0a0, 0.7), aBank: idx }); top = Math.max(top, giro * K_RATE); }
      l.top = Math.max(l.top, top + 0.25); l.roof = Math.max(l.roof, Math.max(0.55, top));
    });
  }

  function buildBaseline(d) {
    var us = d && d.baseline && d.baseline.us, s = us && us.series;
    if (!s) return;
    var xa = -14, xb = 14;
    [["SNDR", 0x9fd8ff, 0.14], ["SNRC", 0xc9a0ff, 0.12]].forEach(function (p) {
      var v = s[p[0]] && num(s[p[0]].value);
      if (v === null) { st.nulls.push("baseline.us." + p[0]); return; }
      var y = v * K_RATE, w = xb - xa, dpt = 0.5;
      var g = new T.PlaneGeometry(w, dpt, 40, 1); g.rotateX(-Math.PI / 2); g.translate(0, y, CURB + 0.3);
      dyn.add(pick(new T.Mesh(g, glowMat(p[1], p[2])), { baseline: p[0], value: v, date: s[p[0]].date, label: p[0] === "SNDR" ? L.sndr : L.snrc, src: us.source_url, checked: us.checked_at }));
      B.lines.add(new T.WireframeGeometry(g), null, { color: cv3(p[1], 0.12) }); B.lines.add(new T.EdgesGeometry(g), null, { color: cv3(p[1], 0.7) });
    });
  }

  function buildChanges(d, bankPos) {
    var ch = d && Array.isArray(d.changes) ? d.changes : [], ref = d && d.updated_at;
    var perBank = {};
    ch.forEach(function (c) {
      if (!c || typeof c.bank !== "string" || !bankPos[c.bank]) return;
      var l = bankPos[c.bank], k = perBank[c.bank] = (perBank[c.bank] || 0) + 1;
      var age = days(c.date, ref); var rec = age === null ? 0.3 : 0.25 + 0.75 * Math.exp(-Math.max(0, age) / 4);
      var o = num(c.old), n = num(c.new), dir = 0, f = String(c.field || "");
      if (o !== null && n !== null && n !== o) { var up = n > o; if (/fee/.test(f)) dir = up ? -1 : 1; else if (/rate/.test(f)) dir = up ? 1 : -1; }
      var r = new T.Mesh(new T.TorusGeometry(dir ? 0.95 : 1.05, 0.014, 6, 56), glowMat(dir > 0 ? 0x7dffc0 : dir < 0 ? 0xffb070 : 0xa8c8ff, rec));
      r.rotation.x = Math.PI / 2; r.position.set(l.x, 0.05, l.z); dyn.add(reflect(r)); st.changes++;
      anim.rings.push({ m: r, dir: dir, top: Math.max(0.6, l.roof), rec: rec, ph: (k - 1) * 0.37 + hash(c.date + f) * 0.2 });
    });
  }

  /* ================= tooltip (HTML, textContent only) ================= */
  function fmt(v, unit) { return v === null ? L.nd : (Math.round(v * 100) / 100).toString() + (unit || ""); }
  function hideTip() { if (tip) tip.style.display = "none"; }
  function addRow(box, k, v, cls) { var r = document.createElement("div"); if (cls) r.style.cssText = cls; var b = document.createElement("span"); b.style.opacity = "0.7"; b.textContent = k + ": "; r.appendChild(b); r.appendChild(document.createTextNode(v)); box.appendChild(r); }
  function safeUrl(u) { return (typeof u === "string" && /^https:\/\/[^\s"'<>]+$/i.test(u)) ? u : null; }
  function link(box, u) { var s = safeUrl(u); if (!s) return; var a = document.createElement("a"); a.href = s; a.target = "_blank"; a.rel = "noopener noreferrer nofollow"; a.textContent = L.src + " ↗"; a.style.cssText = "color:#8fe9ff;display:inline-block;margin-top:2px"; box.appendChild(a); }
  function showTip(info, px, py) {
    if (!tip) return; while (tip.firstChild) tip.removeChild(tip.firstChild);
    var h = document.createElement("div"); h.style.cssText = "font-weight:600;margin-bottom:4px"; tip.appendChild(h);
    if (info.baseline) {
      h.textContent = info.label; addRow(tip, info.baseline, fmt(info.value, "%")); if (info.date) addRow(tip, "date", String(info.date)); if (info.checked) addRow(tip, L.checked, String(info.checked)); link(tip, info.src);
    } else {
      h.textContent = info.bank;
      info.cards.forEach(function (c) {
        var box = document.createElement("div"); box.style.cssText = "border-top:1px solid rgba(140,200,255,.25);padding-top:4px;margin-top:4px"; tip.appendChild(box);
        var t = document.createElement("div"); t.style.opacity = "0.9"; t.textContent = (c.product === "savings" ? L.savings : L.checking) + (c.name ? " · " + c.name : ""); box.appendChild(t);
        var cur = typeof c.currency === "string" ? " " + c.currency : "";
        if (c.product === "checking") {
          addRow(box, L.fee, fmt(num(c.fee_monthly), num(c.fee_monthly) === null ? "" : cur));
          if (Array.isArray(c.fee_monthly_waived_if)) addRow(box, L.waive, c.fee_monthly_waived_if.length ? c.fee_monthly_waived_if.slice(0, 4).join("; ") : L.none);
          if ("fx_fee_pct" in c) addRow(box, L.fx, fmt(num(c.fx_fee_pct), "%"));
          if ("overdraft_rate" in c) addRow(box, L.od, fmt(num(c.overdraft_rate), "%"));
        } else {
          var r = num(c.rate), a = num(c.rate_after_promo);
          addRow(box, L.rate, fmt(r, "%") + (c.rate_type === "promo" && r !== null ? " (" + L.promo + (num(c.promo_months) !== null ? ", " + c.promo_months + " " + L.months : "") + ")" : ""));
          if (c.rate_type === "promo" && a !== null) addRow(box, L.after, fmt(a, "%"));
          if (num(c.promo_rate_with_giro) !== null) addRow(box, L.giro, fmt(c.promo_rate_with_giro, "%"));
          if (num(c.promo_max_amount) !== null) addRow(box, L.max, c.promo_max_amount.toLocaleString() + cur);
          if (typeof c.deposit_insurance === "string") addRow(box, L.ins, c.deposit_insurance);
        }
        var sl = { ok: L.sOk, stale: L.sStale, check: L.sCheck, blocked: L.sBlocked }[c.status] || String(c.status || L.nd);
        addRow(box, L.st, sl, c.status === "ok" ? "" : "color:" + (c.status === "check" ? "#ffc060" : c.status === "blocked" ? "#b0b4bc" : "#9fb0c8"));
        addRow(box, L.checked, c.checked_at ? String(c.checked_at) : L.nd);
        if (c.doc_date) addRow(box, L.doc, String(c.doc_date));
        link(box, c.source_url);
      });
    }
    tip.style.display = "block";
    var W = el.clientWidth, H = el.clientHeight, tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = clamp(px + 14, 6, Math.max(6, W - tw - 6)) + "px"; tip.style.top = clamp(py - th / 2, 6, Math.max(6, H - th - 6)) + "px";
  }
  var ray = null, ndc = null;
  function pickAt(px, py) {
    if (!picks.length) return null;
    var W = el.clientWidth, H = el.clientHeight; ndc.set(px / W * 2 - 1, -(py / H) * 2 + 1); ray.setFromCamera(ndc, cam);
    var hit = ray.intersectObjects(picks, false);
    for (var i = 0; i < hit.length; i++) {
      var o = hit[i].object, pk = o.userData.pick;
      if (pk === "batch") { var ab = o.geometry.attributes.aBank; if (!ab || !hit[i].face) continue; var id = Math.round(ab.getX(hit[i].face.a)); if (id > 0 && bankInfo[id - 1]) return bankInfo[id - 1]; continue; }
      if (pk) return pk;
    }
    return null;
  }
  function setHover(info) {
    if (hover === info) return; hover = info;
    var i = info ? bankInfo.indexOf(info) : -1; G.uHi.value = i >= 0 ? i + 1 : -1;
    el.style.cursor = info ? "pointer" : "";
  }

  /* ================= controls: horizontal drag rotates; vertical swipe scrolls (touch-action: pan-y) ================= */
  function bindControls(cv) {
    cv.style.touchAction = "pan-y";
    var id = null;
    cv.addEventListener("pointerdown", function (e) { id = e.pointerId; orbit.sx = e.clientX; orbit.sy = e.clientY; orbit.moved = false; orbit.drag = false; });
    cv.addEventListener("pointermove", function (e) {
      var rc = cv.getBoundingClientRect(), px = e.clientX - rc.left, py = e.clientY - rc.top;
      if (id === e.pointerId) {
        var dx = e.clientX - orbit.sx, dy = e.clientY - orbit.sy;
        if (!orbit.drag && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) { orbit.drag = true; orbit.auto = false; try { cv.setPointerCapture(e.pointerId); } catch (x) {} }
        if (orbit.drag) { orbit.a -= dx * 0.006; if (e.pointerType === "mouse") orbit.e = clamp(orbit.e + dy * 0.003, 0.08, 0.75); orbit.sx = e.clientX; orbit.sy = e.clientY; orbit.moved = true; orbit.idle = performance.now(); hideTip(); pinned = null; }
      } else if (e.pointerType === "mouse" && !pinned) {
        var inf = pickAt(px, py); setHover(inf); if (inf) showTip(inf, px, py); else hideTip();
      }
    });
    function end(e) {
      if (id !== e.pointerId) return; id = null;
      if (!orbit.moved && e.type === "pointerup") { var rc = cv.getBoundingClientRect(), px = e.clientX - rc.left, py = e.clientY - rc.top, inf = pickAt(px, py); setHover(inf); if (inf) { pinned = inf; showTip(inf, px, py); } else { pinned = null; hideTip(); } }
      orbit.drag = false; orbit.idle = performance.now();
    }
    cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
    cv.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse" && !pinned) { setHover(null); hideTip(); } });
  }

  /* ================= render loop ================= */
  var R = null, bias = null;
  function resize() {
    if (!ren) return; var w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight);
    var pr = Math.min(window.devicePixelRatio || 1, 1.75); ren.setPixelRatio(pr); ren.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix(); rt.setSize(Math.round(w * pr * 0.5), Math.round(h * pr * 0.5));
    if (anim.halo) anim.halo.material.uniforms.uPx.value = h * pr / 600;
    if (anim.holoPts) anim.holoPts.material.uniforms.uPx.value = h * pr / 600;
  }
  function frame() {
    raf = 0; if (!onScreen || document.hidden || !ren) return;
    var t = clock.getElapsedTime(), now = performance.now(); G.uTime.value = t;
    if (!orbit.drag && !orbit.auto && !reduce && now - orbit.idle > 4000) orbit.auto = true;
    var dt = Math.min(0.1, t - (orbit.lt || t)); orbit.lt = t; if (orbit.auto && !reduce) orbit.a += dt * 0.1;   // time-based: ~0.1 rad/s
    cam.position.set(Math.sin(orbit.a) * orbit.r * Math.cos(orbit.e), 0.6 + Math.sin(orbit.e) * orbit.r, Math.cos(orbit.a) * orbit.r * Math.cos(orbit.e));
    cam.lookAt(0, 2.7, 0); cam.updateMatrixWorld();   // a bit higher than before: room for the sky and the Andromeda hologram
    if (anim.holo) anim.holo.rotation.y = orbit.a;   // hologram always faces the viewer (yaw only)
    if (anim.gizmo && !reduce) { anim.gizmo.rotation.y = t * 0.35; anim.gizmo.rotation.x = 0.35 * Math.sin(t * 0.21); }
    anim.melts.forEach(function (m) { var f = reduce ? 0 : clamp(((t * 0.16 + m.top) % 1) * 1.25 - 0.1, 0, 1); var e = f * f * (3 - 2 * f); var y = m.top - (m.top - m.base) * e; m.m.position.y = y; m.m.scale.y = Math.max(0.001, y - m.base); m.c.position.y = y; m.c.material.opacity = 0.85 * (1 - e * 0.6); });
    anim.rings.forEach(function (r) {
      var f = reduce ? 0.5 : (t * 0.22 + r.ph) % 1;
      if (r.dir > 0) { r.m.position.y = 0.1 + f * (r.top - 0.1); r.m.material.opacity = r.rec * Math.sin(f * Math.PI); }
      else if (r.dir < 0) { r.m.position.y = r.top - f * (r.top - 0.1); r.m.material.opacity = r.rec * Math.sin(f * Math.PI); }
      else { r.m.position.y = 0.06; r.m.scale.setScalar(1 + f * 0.6); r.m.material.opacity = r.rec * (1 - f) * 0.8; }
    });
    // mirror pass for the wet pavement
    mirrorCam.projectionMatrix.copy(cam.projectionMatrix); mirrorCam.projectionMatrixInverse.copy(cam.projectionMatrixInverse);
    mirrorCam.matrix.copy(R).multiply(cam.matrixWorld); mirrorCam.matrixWorld.copy(mirrorCam.matrix); mirrorCam.matrixWorldInverse.copy(mirrorCam.matrixWorld).invert();
    anim.pav.material.uniforms.uTM.value.copy(bias).multiply(mirrorCam.projectionMatrix).multiply(mirrorCam.matrixWorldInverse);
    ren.setRenderTarget(rt); ren.clear(); ren.render(scene, mirrorCam); var t1 = ren.info.render.triangles, c1 = ren.info.render.calls;
    ren.setRenderTarget(null); ren.render(scene, cam);
    st.trisMirror = t1; st.tris = ren.info.render.triangles; st.calls = ren.info.render.calls + c1; st.frames++;
    loop();
  }
  function loop() { if (!raf && ren && onScreen && !document.hidden) raf = requestAnimationFrame(frame); }

  function init(target) {
    try {
      if (ok) return true;
      T = window.THREE; if (!T || !target) return false;
      var cv = document.createElement("canvas"), gl = null;
      try { gl = cv.getContext("webgl", { antialias: true }) || cv.getContext("experimental-webgl"); } catch (x) { gl = null; }
      if (!gl) return false;
      el = target; if (getComputedStyle(el).position === "static") el.style.position = "relative";
      ren = new T.WebGLRenderer({ canvas: cv, context: gl, antialias: true });
      ren.setClearColor(0x05070f, 1); ren.outputEncoding = T.sRGBEncoding;
      cv.style.cssText = "display:block;width:100%;height:100%"; el.appendChild(cv);
      scene = new T.Scene(); root = new T.Group(); world = new T.Group(); scene.add(root); scene.add(world);
      cam = new T.PerspectiveCamera(36, 1.6, 0.1, 400); cam.layers.enable(1);
      mirrorCam = new T.PerspectiveCamera(); mirrorCam.matrixAutoUpdate = false; mirrorCam.layers.set(1);
      rt = new T.WebGLRenderTarget(512, 320, { minFilter: T.LinearFilter, magFilter: T.LinearFilter });
      R = new T.Matrix4().makeScale(1, -1, 1); bias = new T.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);
      ray = new T.Raycaster(); ndc = new T.Vector2(); clock = new T.Clock();
      tip = document.createElement("div");
      tip.style.cssText = "position:absolute;display:none;max-width:300px;padding:8px 10px;border-radius:8px;background:rgba(6,12,28,.92);border:1px solid rgba(120,200,255,.35);color:#e6f2ff;font:12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;z-index:5;box-shadow:0 6px 24px rgba(0,0,0,.45);pointer-events:auto";
      el.appendChild(tip);
      buildStatic(); bindControls(cv); resize();
      if (window.ResizeObserver) new ResizeObserver(resize).observe(el); else window.addEventListener("resize", resize);
      if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; loop(); }, { threshold: 0.02 }).observe(el);
      document.addEventListener("visibilitychange", loop);
      ok = true; if (data) build(); loop(); return true;
    } catch (err) { if (window.console) console.warn("[OrbBank3D] init failed", err); return false; }
  }
  function update(d) {
    data = (d && typeof d === "object") ? d : null;
    if (!ok) return;
    try { build(); } catch (err) { if (window.console) console.warn("[OrbBank3D] update failed", err); try { data = null; build(); } catch (e2) {} }
  }
  function stats() {
    return { frames: st.frames, triangles_main: st.tris, triangles_mirror: st.trisMirror, triangles_total: st.tris + st.trisMirror, calls: st.calls, banks: st.banks, cards: st.cards, status: st.status, nulls: st.nulls.slice(), changes_drawn: st.changes, decor_andromeda: st.holo || null, reducedMotion: reduce };
  }
  window.OrbBank3D = { init: init, update: update, stats: stats };
})();
