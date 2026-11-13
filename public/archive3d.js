/* archive3d.js - "Хребет дней" (ridge of days) hologram banner for orbstudio.org/archive (preview build, not deployed)
   window.OrbArchive3D = { init(el, opts) -> true/false, update(data), selectDay("YYYY-MM-DD"), stats(), destroy() }
   data = { history: GET /api/v1/history, days: { "YYYY-MM-DD": GET /api/v1/history?date=YYYY-MM-DD, ... } }
          or { day: <one day response> } to add headlines for one day later; a bare /api/v1/history response is also accepted.
   When a day is selected whose headlines are not loaded yet, el fires CustomEvent "orbarchive:needday" {detail:{date}}
   and "orbarchive:select" {detail:{date}} on every selection. opts.autoplay (default true): next day every 2.5 s,
   paused for 15 s after a user tap/click.
   three.js r128 core only (cdnjs). Own bloom. Deterministic (no random). textContent only, https links only.
   Missing day = gap in the ridge (never interpolated). Pauses when hidden/offscreen; prefers-reduced-motion; touch-action: pan-y. */
(function () {
  "use strict";
  var T, el, ren, scene, cam, ok = false, raf = 0, onScreen = true, io = null, ro = null, rmTimer = 0, listeners = [];
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var st = { frames: 0, tris: 0, calls: 0, fps: 0, hdr: false, d: {} }, fpsT = [];
  var view = { off: 0, auto: true, idle: 0, drag: false, px: 0, py: 0, gx: 0, gy: 0, t0: null, lt: 0, sw: 0, pid: null, sx: 0, sy: 0, o0: 0, moved: false };
  var RT = {}, FS = {}, U = {}, objs = {}, dyn = null, ui = {}, opts = { autoplay: true };
  var hist = null, dayCache = {}, model = null, sel = -1, selT = -1e9, sliceX = 0, userT = -1e9, asked = {}, burst = null, lastLang = "";
  var ORDER = ["geo", "politics", "economy", "budget", "crypto", "energy", "justice", "web"]; // back -> front
  var HUE = { geo: 352, politics: 318, economy: 212, budget: 146, crypto: 268, energy: 36, justice: 28, web: 186 };
  var NAMES = { ru: { geo: "Гео", politics: "Политика", economy: "Экономика", budget: "Бюджет", crypto: "Крипто", energy: "Энергия", justice: "Правосудие", web: "Веб" },
    de: { geo: "Geo", politics: "Politik", economy: "Wirtschaft", budget: "Budget", crypto: "Krypto", energy: "Energie", justice: "Justiz", web: "Offenes Web" },
    en: { geo: "Geo", politics: "Politics", economy: "Economy", budget: "Budget", crypto: "Crypto", energy: "Energy", justice: "Justice", web: "Open web" } };
  var TXT = { ru: { title: "АРХИВ · ХРЕБЕТ ДНЕЙ", sel: "ВЫБРАН ДЕНЬ", none: "НЕТ ДАННЫХ", days: "дн." }, de: { title: "ARCHIV · TAGESKAMM", sel: "GEWÄHLTER TAG", none: "KEINE DATEN", days: "Tage" },
    en: { title: "ARCHIVE · RIDGE OF DAYS", sel: "SELECTED DAY", none: "NO DATA", days: "days" } };
  var AUTO = 2.5, MAXD = 30, YS = 4.0;

  function now() { return performance.now(); }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function sm(a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }
  function isStr(x) { return typeof x === "string" && x.trim() !== ""; }
  function num(x) { return typeof x === "number" && isFinite(x) ? x : null; }
  function https(u) { return isStr(u) && /^https:\/\/[^\s]+$/i.test(u) ? u : null; }
  function isDay(s) { return isStr(s) && /^\d{4}-\d{2}-\d{2}$/.test(s); }
  function lang() { var l = (document.documentElement.lang || "ru").toLowerCase(); return l.indexOf("de") === 0 ? "de" : l.indexOf("en") === 0 ? "en" : "ru"; }
  function hsl(h, s, l, out) { out = out || new T.Color(); out.setHSL(h / 360, s, l); out.convertSRGBToLinear(); return out; }
  function on(t, ev, fn, o) { t.addEventListener(ev, fn, o); listeners.push([t, ev, fn, o]); }
  function dayMs(d) { return Date.UTC(+d.slice(0, 4), +d.slice(5, 7) - 1, +d.slice(8, 10)); }
  function msDay(ms) { return new Date(ms).toISOString().slice(0, 10); }
  function addMat(u, vs, fs, extra) {
    var m = new T.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false, depthTest: false, blending: T.AdditiveBlending, side: T.DoubleSide });
    if (extra) for (var k in extra) m[k] = extra[k]; return m;
  }
  function mk(geo, mat, order, parent) { var m = new T.Mesh(geo, mat); m.renderOrder = order; m.frustumCulled = false; (parent || scene).add(m); return m; }
  var NOISE = "float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\n" +
    "float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}\n";

  /* ---------- data ---------- */
  function normalize() {
    var m = { days: [], series: {}, rows: [], missing: [], unknown: [], live: false, gaps: {} };
    var H = hist && hist.risk_index_history && typeof hist.risk_index_history === "object" ? hist.risk_index_history : null;
    if (!H) return m;
    var set = {}, k;
    for (k in H) {
      if (!HUE.hasOwnProperty(k)) { m.unknown.push(k); continue; }
      if (!Array.isArray(H[k])) continue; var s = {};
      H[k].forEach(function (p) { if (p && isDay(p.day)) { var v = num(p.risk_index); if (v != null) { s[p.day] = clamp(v, 0, 100); set[p.day] = 1; } } });
      m.series[k] = s;
    }
    if (Array.isArray(hist.snapshot_days)) hist.snapshot_days.forEach(function (d) { if (isDay(d)) set[d] = 1; });
    var ds = Object.keys(set).sort(); if (!ds.length) return m;
    // full calendar range so that a day without any data stays a visible gap
    var a = dayMs(ds[0]), b = dayMs(ds[ds.length - 1]); if ((b - a) / 864e5 > MAXD - 1) a = b - (MAXD - 1) * 864e5;
    for (var t = a; t <= b; t += 864e5) m.days.push(msDay(t));
    m.rows = ORDER.filter(function (id) { return m.series[id] && Object.keys(m.series[id]).length; });
    ORDER.forEach(function (id) { if (m.rows.indexOf(id) < 0) m.missing.push(id); else { var g = m.days.filter(function (d) { return m.series[id][d] == null; }); if (g.length) m.gaps[id] = g.length; } });
    m.live = m.rows.length > 0;
    return m;
  }
  function val(id, i) { if (!model || i < 0 || i >= model.days.length || !model.series[id]) return null; var v = model.series[id][model.days[i]]; return v == null ? null : v; }
  function dayHasData(i) { for (var r = 0; r < model.rows.length; r++) if (val(model.rows[r], i) != null) return true; return false; }
  function topHeadlines(d) {
    var D = dayCache[d]; if (!D) return null; var out = [], seen = {};
    (Array.isArray(D.radars) ? D.radars : []).forEach(function (r) {
      if (!r || !isStr(r.id)) return; (Array.isArray(r.headlines) ? r.headlines : []).forEach(function (h) {
        if (!h || !isStr(h.title) || seen[h.title]) return; seen[h.title] = 1;
        out.push({ radar: HUE.hasOwnProperty(r.id) ? r.id : null, title: h.title, source: isStr(h.source) ? h.source : null, link: https(h.link), w: num(h.weight) == null ? -1 : h.weight, rt: isStr(r.title) ? r.title : null });
      });
    });
    if (!out.length) (Array.isArray(D.candidates) ? D.candidates : []).forEach(function (c) {
      if (!c || !isStr(c.headline) || seen[c.headline]) return; seen[c.headline] = 1;
      out.push({ radar: HUE.hasOwnProperty(c.radar) ? c.radar : null, title: c.headline, source: isStr(c.source) ? c.source : null, link: https(c.link), w: -1, rt: isStr(c.radar_title) ? c.radar_title : null });
    });
    out.sort(function (a, b) { return b.w - a.w || (a.title < b.title ? -1 : 1); });
    // prefer different radars among the top 3
    var pick = [], used = {}; out.forEach(function (h) { if (pick.length < 3 && !used[h.radar]) { pick.push(h); used[h.radar] = 1; } });
    out.forEach(function (h) { if (pick.length < 3 && pick.indexOf(h) < 0) pick.push(h); });
    return pick;
  }

  /* ---------- layout ---------- */
  function L() { var p = cam && cam.aspect < 1; return { W: p ? 7.4 : 12.4, dz: p ? 0.6 : 0.85, p: p }; }
  function X(i) { var l = L(), n = model.days.length; return n < 2 ? 0 : -l.W / 2 + l.W * i / (n - 1); }
  function Z(r) { var l = L(), n = ORDER.length; return (r - (n - 1) / 2) * l.dz; }

  /* ---------- static scene ---------- */
  function buildStatic() {
    U = { uT: { value: 0 }, uScale: { value: 400 }, uSel: { value: 0 }, uFlash: { value: 0 }, uCalm: { value: 1 } };
    mk(new T.SphereGeometry(70, 24, 12), new T.ShaderMaterial({ uniforms: U, side: T.BackSide, depthWrite: false, depthTest: false,
      vertexShader: "varying vec3 vD; void main(){ vD=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",
      fragmentShader: "uniform float uT; varying vec3 vD;\n" + NOISE + "void main(){ vec2 p=vec2(atan(vD.x,vD.z)*1.5,vD.y*3.); float n=vn(p*1.2+uT*0.01)*0.6+vn(p*2.7)*0.4;\n" +
        " vec3 c=mix(vec3(0.003,0.005,0.012),vec3(0.008,0.014,0.035),0.5+0.5*vD.y)+vec3(0.02,0.03,0.07)*pow(n,3.)*0.5; gl_FragColor=vec4(c,1.); }" }), -20);
    var N = 600, sp = new Float32Array(N * 3), sa = new Float32Array(N), i;
    for (i = 0; i < N; i++) { var u = hash("su" + i) * 1.6 - 0.4, th = hash("st" + i) * 6.2832, r = 35 + hash("sr" + i) * 14, q = Math.sqrt(1 - u * u);
      sp[i * 3] = r * q * Math.cos(th); sp[i * 3 + 1] = r * u; sp[i * 3 + 2] = r * q * Math.sin(th); sa[i] = hash("sa" + i); }
    var sg = new T.BufferGeometry(); sg.setAttribute("position", new T.BufferAttribute(sp, 3)); sg.setAttribute("aS", new T.BufferAttribute(sa, 1));
    var stars = new T.Points(sg, addMat(U, "uniform float uT,uScale; attribute float aS; varying float vA; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vA=(0.2+0.8*aS)*(0.6+0.4*sin(uT*(0.6+aS*2.)+aS*40.)); gl_PointSize=max(1.,(0.07+0.1*aS)*uScale/-mv.z); gl_Position=projectionMatrix*mv; }",
      "varying float vA; void main(){ vec2 q=gl_PointCoord-0.5; float d=dot(q,q)*4.; gl_FragColor=vec4(vec3(0.6,0.75,1.)*vA*(1.-d),1.); }"));
    stars.renderOrder = -19; stars.frustumCulled = false; scene.add(stars);
  }

  /* ---------- data-driven scene ---------- */
  function disposeDyn() { if (!dyn) return; dyn.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); scene.remove(dyn); dyn = null; }
  function build() {
    disposeDyn(); dyn = new T.Group(); scene.add(dyn); objs = {};
    model = normalize(); var l = L(), c = new T.Color();
    U.uCalm.value = model.live ? 0 : 1;
    var nD = model.days.length, x0 = nD ? X(0) : -l.W / 2, x1 = nD ? X(nD - 1) : l.W / 2, z0 = Z(0) - 0.5, z1 = Z(ORDER.length - 1) + 0.5;
    // floor: holographic grid, one column per day, one lane per radar
    var fw = (x1 - x0) + 1.6, fd = (z1 - z0) + 1.2;
    var floor = mk(new T.PlaneGeometry(fw, fd), addMat(Object.assign({}, U, { uN: { value: Math.max(1, nD - 1) }, uX0: { value: x0 }, uX1: { value: x1 }, uZ0: { value: Z(0) }, uDZ: { value: l.dz }, uNR: { value: ORDER.length } }),
      "varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }",
      "uniform float uT,uN,uX0,uX1,uZ0,uDZ,uNR,uSel,uCalm; varying vec3 vW;\n" +
      "float ln(float x,float w){ return 1.-smoothstep(0.,w,abs(x)); }\n" +
      "void main(){ float fx=(vW.x-uX0)/(uX1-uX0)*uN; float gx=ln(fract(fx+0.5)-0.5,0.03*uN/14.)*step(-0.01,fx)*step(fx,uN+0.01);\n" +
      " float fz=(vW.z-uZ0)/uDZ; float gz=ln(fract(fz+0.5)-0.5,0.03)*step(-0.5,fz)*step(fz,uNR-0.5);\n" +
      " float edge=smoothstep(0.,0.6,min(min(vW.x-uX0+0.8,uX1+0.8-vW.x),min(vW.z-uZ0+0.95,uZ0+uDZ*(uNR-1.)+0.95-vW.z)));\n" +
      " float sx=exp(-pow((vW.x-uSel)*3.,2.))*(1.-uCalm); float scan=0.5+0.5*sin(vW.z*3.-uT*1.5);\n" +
      " vec3 c=vec3(0.15,0.45,0.9)*(gx*0.22*(1.-uCalm)+gz*0.12)*(0.8+0.2*scan)+vec3(0.5,0.85,1.)*sx*0.25*(gz+0.25); gl_FragColor=vec4(c*edge,1.); }"), -10, dyn);
    floor.rotation.x = -Math.PI / 2; floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2 + 0.1);
    objs.floor = floor;
    if (!model.live) { finishBuild(); return; }
    // ridges: screen-facing glowing ribbons (core + halo) + hologram walls; runs split at missing days
    var LP = [], LT = [], LS = [], LC = [], LU = [], LR = [], LI = [], WP = [], WC = [], WU = [], WI = [], DOTP = [], DOTC = [], SUB = 10, segs = 0, isolated = 0;
    model.rows.forEach(function (id) {
      var r = ORDER.indexOf(id), z = Z(r), ph = hash("ph" + id); hsl(HUE[id], 0.92, 0.6, c);
      var runs = [], cur = [];
      for (var i = 0; i < nD; i++) { var v = val(id, i); if (v == null) { if (cur.length) runs.push(cur); cur = []; } else cur.push(i); }
      if (cur.length) runs.push(cur);
      runs.forEach(function (run) {
        if (run.length === 1) { isolated++; DOTP.push(X(run[0]), val(id, run[0]) / 100 * YS, z); DOTC.push(c.r, c.g, c.b); return; }
        segs++;
        var pts = [];
        for (var j = 0; j < run.length - 1; j++) { var i0 = run[j], i1 = run[j + 1], a = val(id, i0), b = val(id, i1);
          for (var s = 0; s < SUB; s++) { var f = s / SUB, e = f * f * (3 - 2 * f); pts.push([X(i0) + (X(i1) - X(i0)) * f, (a + (b - a) * e) / 100 * YS, z]); } }
        var last = run[run.length - 1]; pts.push([X(last), val(id, last) / 100 * YS, z]);
        var base = LP.length / 3, wb = WP.length / 3;
        pts.forEach(function (p, k) {
          var pn = pts[Math.min(k + 1, pts.length - 1)], pp = pts[Math.max(k - 1, 0)], tx = pn[0] - pp[0], ty = pn[1] - pp[1], tl = Math.sqrt(tx * tx + ty * ty) || 1;
          var u = k / (pts.length - 1), xn = (p[0] - X(0)) / Math.max(1e-3, X(nD - 1) - X(0));
          for (var sd = -1; sd <= 1; sd += 2) { LP.push(p[0], p[1], p[2]); LT.push(tx / tl, ty / tl, 0); LS.push(sd); LC.push(c.r, c.g, c.b); LU.push(xn); LR.push(ph); }
          WP.push(p[0], p[1], p[2], p[0], 0, p[2]); WC.push(c.r, c.g, c.b, c.r, c.g, c.b); WU.push(xn, p[1] / YS, ph, 1, xn, p[1] / YS, ph, 0);
          if (k < pts.length - 1) { var q = base + k * 2; LI.push(q, q + 1, q + 2, q + 1, q + 3, q + 2); var w = wb + k * 2; WI.push(w, w + 1, w + 2, w + 1, w + 3, w + 2); }
        });
      });
    });
    if (WP.length) {
      var wg = new T.BufferGeometry(); wg.setAttribute("position", new T.Float32BufferAttribute(WP, 3)); wg.setAttribute("aCol", new T.Float32BufferAttribute(WC, 3));
      wg.setAttribute("aU", new T.Float32BufferAttribute(WU, 4)); wg.setIndex(WI);
      objs.walls = mk(wg, addMat(U, "attribute vec3 aCol; attribute vec4 aU; varying vec3 vCol; varying vec4 vU; varying float vY; void main(){ vCol=aCol; vU=aU; vY=position.y; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",
        "uniform float uT,uSel; varying vec3 vCol; varying vec4 vU; varying float vY;\n" + NOISE +
        "void main(){ float top=vU.w; float g=pow(top,2.4)*0.24+top*0.035; float lines=smoothstep(0.82,1.,sin(vY*" + (Math.PI * 100 / YS / 10).toFixed(3) + ")*0.5+0.5)*0.04*top;\n" +
        " float scan=0.75+0.25*sin(vY*60.-uT*4.+vU.z*20.); float fl=0.85+0.15*vn(vec2(uT*3.+vU.z*50.,vU.x*30.));\n" +
        " gl_FragColor=vec4(vCol*(g+lines)*scan*fl,1.); }"), 0, dyn);
    }
    if (LP.length) {
      var lg = new T.BufferGeometry(); lg.setAttribute("position", new T.Float32BufferAttribute(LP, 3)); lg.setAttribute("aTan", new T.Float32BufferAttribute(LT, 3));
      lg.setAttribute("aSide", new T.Float32BufferAttribute(LS, 1)); lg.setAttribute("aCol", new T.Float32BufferAttribute(LC, 3)); lg.setAttribute("aU", new T.Float32BufferAttribute(LU, 1));
      lg.setAttribute("aPh", new T.Float32BufferAttribute(LR, 1)); lg.setIndex(LI);
      objs.lines = mk(lg, addMat(Object.assign({}, U, { uW: { value: 0.16 } }),
        "uniform float uW; attribute vec3 aTan,aCol; attribute float aSide,aU,aPh; varying vec3 vCol; varying float vS,vU,vPh,vX;\n" +
        "void main(){ vCol=aCol; vS=aSide; vU=aU; vPh=aPh; vX=position.x; vec4 a=modelViewMatrix*vec4(position,1.); vec4 b=modelViewMatrix*vec4(position+aTan,1.);\n" +
        " vec3 n=normalize(cross(normalize(b.xyz-a.xyz),normalize(a.xyz))); a.xyz+=n*aSide*uW; gl_Position=projectionMatrix*a; }",
        "uniform float uT,uSel; varying vec3 vCol; varying float vS,vU,vPh,vX;\n" + NOISE +
        "void main(){ float d=abs(vS); float core=exp(-d*d*70.)*1.5, halo=exp(-d*d*7.)*0.28;\n" +
        " float fl=0.82+0.18*sin(uT*7.3+vPh*40.+vU*25.)*sin(uT*2.1+vPh*13.); fl*=1.-0.55*step(0.965,h21(vec2(floor(uT*9.),vPh*97.)));\n" +
        " float spark=pow(fract(vU*1.6-uT*0.12+vPh),40.)*2.5; float near=exp(-pow((vX-uSel)*2.2,2.))*0.7;\n" +
        " vec3 c=mix(vCol,vec3(1.),core*0.35)*(core*(1.+spark+near)+halo*(1.+near))*fl; gl_FragColor=vec4(c,1.); }"), 2, dyn);
    }
    // isolated single-day values: a dot only (no line, nothing to connect)
    if (DOTP.length) {
      var dg = new T.BufferGeometry(); dg.setAttribute("position", new T.Float32BufferAttribute(DOTP, 3)); dg.setAttribute("aCol", new T.Float32BufferAttribute(DOTC, 3));
      var dm = new T.Points(dg, addMat(U, "uniform float uScale; attribute vec3 aCol; varying vec3 vCol; void main(){ vCol=aCol; vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=0.3*uScale/-mv.z; gl_Position=projectionMatrix*mv; }",
        "varying vec3 vCol; void main(){ vec2 q=gl_PointCoord-0.5; float d=dot(q,q)*4.; if(d>1.) discard; gl_FragColor=vec4(vCol*exp(-d*5.)*1.6,1.); }"));
      dm.renderOrder = 3; dm.frustumCulled = false; dyn.add(dm);
    }
    // selected-day slice: glowing vertical plane across all lanes
    var sh = YS * 1.08, sd2 = (z1 - z0);
    objs.slice = mk(new T.PlaneGeometry(sd2, sh), addMat(U, "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",
      "uniform float uT,uFlash; varying vec2 vUv;\n" +
      "void main(){ float ex=min(vUv.x,1.-vUv.x), ey=min(vUv.y,1.-vUv.y); float edge=exp(-ex*60.)+exp(-(1.-vUv.y)*80.)*0.9+exp(-vUv.y*80.)*0.6;\n" +
      " float scan=smoothstep(0.9,1.,sin(vUv.y*120.-uT*6.)*0.5+0.5)*0.12; float band=exp(-pow((vUv.y-fract(uT*0.35))*14.,2.))*0.35;\n" +
      " float fill=0.05+0.08*vUv.y; vec3 c=vec3(0.55,0.85,1.)*(edge*0.9+scan+band+fill)*(1.+uFlash*1.8); gl_FragColor=vec4(c,1.); }"), 4, dyn);
    objs.slice.rotation.y = Math.PI / 2; objs.slice.position.set(0, sh / 2, (z0 + z1) / 2);
    // glowing dots of the selected day on every ridge (positions updated per frame)
    var n8 = model.rows.length, dp = new Float32Array(n8 * 3), dc = new Float32Array(n8 * 3), dv = new Float32Array(n8);
    model.rows.forEach(function (id, k) { hsl(HUE[id], 0.92, 0.62, c); dc[k * 3] = c.r; dc[k * 3 + 1] = c.g; dc[k * 3 + 2] = c.b; });
    var sg = new T.BufferGeometry(); sg.setAttribute("position", new T.BufferAttribute(dp, 3)); sg.setAttribute("aCol", new T.BufferAttribute(dc, 3)); sg.setAttribute("aV", new T.BufferAttribute(dv, 1));
    objs.dots = new T.Points(sg, addMat(U, "uniform float uScale,uT,uFlash; attribute vec3 aCol; attribute float aV; varying vec3 vCol; varying float vV; void main(){ vCol=aCol; vV=aV; vec4 mv=modelViewMatrix*vec4(position,1.);\n" +
      " gl_PointSize=aV*(0.62+0.08*sin(uT*4.)+uFlash*0.5)*uScale/-mv.z; gl_Position=projectionMatrix*mv; }",
      "uniform float uFlash; varying vec3 vCol; varying float vV; void main(){ vec2 q=gl_PointCoord-0.5; float d=dot(q,q)*4.; if(d>1.) discard;\n" +
      " vec3 c=mix(vec3(1.),vCol,smoothstep(0.,0.1,d))*exp(-d*9.)*4.+vCol*exp(-d*3.)*0.5+vCol*smoothstep(0.03,0.,abs(d-0.45))*0.8; gl_FragColor=vec4(c,1.); }"));
    objs.dots.renderOrder = 5; objs.dots.frustumCulled = false; dyn.add(objs.dots);
    // burst particles rising from the slice
    var BN = 220, bp = new Float32Array(BN * 3), bs = new Float32Array(BN * 3);
    for (var b2 = 0; b2 < BN; b2++) { bs[b2 * 3] = hash("bz" + b2); bs[b2 * 3 + 1] = hash("bv" + b2); bs[b2 * 3 + 2] = hash("bx" + b2); }
    var bg = new T.BufferGeometry(); bg.setAttribute("position", new T.BufferAttribute(bp, 3)); bg.setAttribute("aSeed", new T.BufferAttribute(bs, 3));
    objs.burst = new T.Points(bg, addMat(Object.assign({}, U, { uAge: { value: 99 }, uZ0: { value: z0 }, uZ1: { value: z1 } }),
      "uniform float uScale,uAge,uSel,uZ0,uZ1; attribute vec3 aSeed; varying float vA; void main(){ float a=uAge-aSeed.y*0.25; vA=a<0.?0.:exp(-a*1.1)*(1.-smoothstep(1.6,2.4,a));\n" +
      " vec3 p=vec3(uSel+(aSeed.z-0.5)*0.35*(1.+a), " + (YS * 0.15).toFixed(2) + "+a*(1.4+aSeed.y*2.2), mix(uZ0,uZ1,aSeed.x)); vec4 mv=modelViewMatrix*vec4(p,1.);\n" +
      " gl_PointSize=(0.08+0.06*aSeed.x)*uScale/-mv.z*step(0.001,vA); gl_Position=projectionMatrix*mv; }",
      "varying float vA; void main(){ vec2 q=gl_PointCoord-0.5; float d=dot(q,q)*4.; if(d>1.) discard; gl_FragColor=vec4(vec3(0.7,0.9,1.)*exp(-d*4.)*vA*2.,1.); }"));
    objs.burst.renderOrder = 6; objs.burst.frustumCulled = false; dyn.add(objs.burst);
    st.d = { segments: segs, isolatedDots: isolated };
    finishBuild();
  }
  function finishBuild() {
    buildLabels(); buildLegend();
    var target = sel >= 0 && model.days[sel] ? model.days[sel] : null;
    sel = -1; if (model.live) { var i = target ? model.days.indexOf(target) : -1; if (i < 0 || !dayHasData(i)) i = lastDataDay(); setSel(i, false); sliceX = X(i); }
    else { ui.date.textContent = ""; }
    st.d = Object.assign(st.d || {}, { state: model.live ? "live" : "calm", days: model.days.length, rows: model.rows.length, missing: model.missing.slice(), unknown: model.unknown.slice(), gaps: model.gaps });
    if (reduce) frame(true); loop();
  }
  function lastDataDay() { for (var i = model.days.length - 1; i >= 0; i--) if (dayHasData(i)) return i; return -1; }

  /* ---------- HTML layer ---------- */
  function div(css, parent, tag) { var d = document.createElement(tag || "div"); if (css) d.style.cssText = css; (parent || ui.root).appendChild(d); return d; }
  function buildUI() {
    ui.root = div("position:absolute;inset:0;pointer-events:none;z-index:3;font:12px/1.35 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#e6f1ff;overflow:hidden", el);
    ui.title = div("position:absolute;left:14px;top:12px;font-size:11px;letter-spacing:.16em;color:#7fd6ff;font-weight:600;text-shadow:0 0 10px rgba(80,200,255,.5)");
    ui.dateBox = div("position:absolute;right:14px;top:10px;text-align:right");
    ui.dateLbl = div("font-size:10px;letter-spacing:.16em;color:#8fb2d8", ui.dateBox); ui.date = div("font-size:24px;font-weight:700;letter-spacing:.02em;color:#fff;text-shadow:0 0 14px rgba(120,200,255,.75);font-variant-numeric:tabular-nums", ui.dateBox);
    ui.axis = div("position:absolute;inset:0"); ui.cards = div("position:absolute;inset:0");
    ui.legend = div("position:absolute;left:12px;right:12px;bottom:10px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:3px 12px;padding:7px 10px;border-radius:10px;background:rgba(3,6,16,.55);border:1px solid rgba(120,170,255,.12);backdrop-filter:blur(3px)");
    ui.labels = []; ui.cardEls = [];
  }
  function buildLabels() {
    while (ui.axis.firstChild) ui.axis.removeChild(ui.axis.firstChild); ui.labels = [];
    model.days.forEach(function (d, i) { var s = div("position:absolute;left:0;top:0;font-size:10px;color:#7f93b4;white-space:nowrap;font-variant-numeric:tabular-nums", ui.axis); s.textContent = d.slice(8, 10) + "." + d.slice(5, 7); ui.labels.push(s); });
  }
  function buildLegend() {
    var Lg = lang(), N = NAMES[Lg]; while (ui.legend.firstChild) ui.legend.removeChild(ui.legend.firstChild); ui.leg = {};
    ui.title.textContent = TXT[Lg].title + (model.live ? " · " + model.days.length + " " + TXT[Lg].days : "");
    ui.dateLbl.textContent = model.live ? TXT[Lg].sel : TXT[Lg].none;
    ui.legend.style.display = model.live ? "grid" : "none";
    model.rows.forEach(function (id) {
      var row = div("display:flex;align-items:center;gap:6px;min-width:0;white-space:nowrap", ui.legend), col = "hsl(" + HUE[id] + ",92%,62%)";
      var dot = div("flex:none;width:8px;height:8px;border-radius:2px;background:" + col + ";box-shadow:0 0 6px " + col, row);
      var v = div("flex:none;font-weight:700;min-width:20px;text-align:right;font-variant-numeric:tabular-nums", row, "span");
      var nm = div("flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;color:#aebfdc", row, "span"); nm.textContent = N[id];
      var dl = div("flex:none;font-size:10px;color:#8a97ad;font-variant-numeric:tabular-nums", row, "span");
      ui.leg[id] = { v: v, d: dl, dot: dot };
    });
    lastLang = Lg;
  }
  function fmtDate(d) { return d.slice(8, 10) + "." + d.slice(5, 7) + "." + d.slice(0, 4); }
  function setSel(i, user) {
    if (!model || !model.live || i < 0 || i >= model.days.length) return;
    var changed = i !== sel; sel = i; var d = model.days[i];
    if (changed) { selT = view.lt || 0; if (!reduce) U.uFlash.value = 1; burst = null; }
    ui.date.textContent = fmtDate(d);
    model.rows.forEach(function (id) {
      var e = ui.leg[id]; if (!e) return; var v = val(id, i), pv = val(id, i - 1);
      e.v.textContent = v == null ? "—" : String(Math.round(v)); e.v.style.opacity = v == null ? ".45" : "1"; e.dot.style.opacity = v == null ? ".35" : "1";
      e.d.textContent = v != null && pv != null ? (v > pv ? "▲" + Math.round(v - pv) : v < pv ? "▼" + Math.round(pv - v) : "±0") : "";
    });
    if (changed) { try { el.dispatchEvent(new CustomEvent("orbarchive:select", { detail: { date: d } })); } catch (x) {}
      if (!dayCache[d] && !asked[d]) { asked[d] = 1; try { el.dispatchEvent(new CustomEvent("orbarchive:needday", { detail: { date: d } })); } catch (x) {} } }
    if (user) userT = now();
  }
  function makeCards(list) {
    ui.cardEls.forEach(function (c) { if (c.parentNode) c.parentNode.removeChild(c); }); ui.cardEls = [];
    var Lg = lang();
    (list || []).forEach(function (h) {
      var c = div("position:absolute;left:0;top:0;max-width:300px;padding:7px 10px 8px;border-radius:9px;background:rgba(4,10,26,.62);border:1px solid rgba(140,200,255,.25);box-shadow:0 0 18px rgba(60,160,255,.18);opacity:0;will-change:transform,opacity", ui.cards);
      var top = div("display:flex;gap:6px;align-items:center;font-size:10px;color:#9fb3d6;margin-bottom:2px;white-space:nowrap;overflow:hidden", c);
      if (h.radar) { var ch = div("flex:none;padding:0 6px;border-radius:4px;font-weight:700;color:#fff;border:1px solid hsl(" + HUE[h.radar] + ",92%,60%);background:hsla(" + HUE[h.radar] + ",92%,45%,.3)", top, "span"); ch.textContent = NAMES[Lg][h.radar]; }
      if (h.source) { var so = div("overflow:hidden;text-overflow:ellipsis", top, "span"); so.textContent = h.source; }
      var t;
      if (h.link) { t = document.createElement("a"); t.href = h.link; t.target = "_blank"; t.rel = "noopener noreferrer nofollow"; t.style.cssText = "pointer-events:auto;color:#eef6ff;text-decoration:none"; c.appendChild(t); }
      else t = div("color:#eef6ff", c);
      t.style.display = "-webkit-box"; t.style.webkitLineClamp = "2"; t.style.webkitBoxOrient = "vertical"; t.style.overflow = "hidden"; t.style.fontSize = (cam.aspect < 1 ? "11.5px" : "12.5px"); t.style.lineHeight = "1.3";
      t.textContent = h.title; ui.cardEls.push(c);
    });
  }

  /* ---------- post (as orbcore3d) ---------- */
  function rt(w, h, ms) { var o = { minFilter: T.LinearFilter, magFilter: T.LinearFilter, format: T.RGBAFormat, type: st.hdr ? T.HalfFloatType : T.UnsignedByteType, depthBuffer: false, stencilBuffer: false };
    var r = ms && T.WebGLMultisampleRenderTarget ? new T.WebGLMultisampleRenderTarget(w, h, o) : new T.WebGLRenderTarget(w, h, o); if (ms) r.samples = 4; return r; }
  var FSV = "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }";
  function fsMat(u, fs) { return new T.ShaderMaterial({ uniforms: u, vertexShader: FSV, fragmentShader: fs, depthTest: false, depthWrite: false }); }
  function setupPost() {
    var w2 = ren.capabilities.isWebGL2;
    st.hdr = !!(w2 ? ren.extensions.get("EXT_color_buffer_float") : (ren.extensions.get("OES_texture_half_float") && ren.extensions.get("EXT_color_buffer_half_float") && ren.extensions.get("OES_texture_half_float_linear")));
    RT.scene = rt(4, 4, w2); RT.a1 = rt(4, 4); RT.b1 = rt(4, 4); RT.a2 = rt(4, 4); RT.b2 = rt(4, 4);
    FS.scene = new T.Scene(); FS.cam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1); FS.q = new T.Mesh(new T.PlaneGeometry(2, 2)); FS.q.frustumCulled = false; FS.scene.add(FS.q);
    FS.bright = fsMat({ t: { value: null }, uPx: { value: new T.Vector2() }, uTh: { value: st.hdr ? 0.75 : 0.5 } },
      "uniform sampler2D t; uniform vec2 uPx; uniform float uTh; varying vec2 vUv; void main(){ vec3 c=(texture2D(t,vUv-uPx).rgb+texture2D(t,vUv+uPx*vec2(1.,-1.)).rgb+texture2D(t,vUv+uPx*vec2(-1.,1.)).rgb+texture2D(t,vUv+uPx).rgb)*0.25; float l=max(c.r,max(c.g,c.b)); float k=max(l-uTh,0.)/max(l,1e-4); gl_FragColor=vec4(min(c*k,vec3(30.)),1.); }");
    FS.blur = fsMat({ t: { value: null }, uD: { value: new T.Vector2() } },
      "uniform sampler2D t; uniform vec2 uD; varying vec2 vUv; void main(){ vec3 c=texture2D(t,vUv).rgb*0.227; c+=(texture2D(t,vUv+uD*1.385).rgb+texture2D(t,vUv-uD*1.385).rgb)*0.316; c+=(texture2D(t,vUv+uD*3.231).rgb+texture2D(t,vUv-uD*3.231).rgb)*0.07; gl_FragColor=vec4(c,1.); }");
    FS.copy = fsMat({ t: { value: null } }, "uniform sampler2D t; varying vec2 vUv; void main(){ gl_FragColor=texture2D(t,vUv); }");
    FS.comp = fsMat({ tS: { value: null }, t1: { value: null }, t2: { value: null }, uExp: { value: 1.0 } },
      "uniform sampler2D tS,t1,t2; uniform float uExp; varying vec2 vUv; vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.,1.); }\n" +
      "void main(){ vec3 c=texture2D(tS,vUv).rgb+texture2D(t1,vUv).rgb*0.55+texture2D(t2,vUv).rgb*0.65; vec2 q=vUv-0.5; c*=1.-dot(q,q)*0.8;\n" +
      " c=aces(c*uExp); c=pow(c,vec3(1./2.2)); float d=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453); c+=(d-0.5)/255.; gl_FragColor=vec4(c,1.); }");
  }
  function pass(m, target) { FS.q.material = m; ren.setRenderTarget(target); ren.render(FS.scene, FS.cam); }
  function blur2(a, b, k) { FS.blur.uniforms.t.value = a.texture; FS.blur.uniforms.uD.value.set(k / a.width, 0); pass(FS.blur, b); FS.blur.uniforms.t.value = b.texture; FS.blur.uniforms.uD.value.set(0, k / a.height); pass(FS.blur, a); }
  function renderAll() {
    ren.info.reset(); ren.setRenderTarget(RT.scene); ren.clear(); ren.render(scene, cam); st.tris = ren.info.render.triangles;
    FS.bright.uniforms.t.value = RT.scene.texture; pass(FS.bright, RT.a1); blur2(RT.a1, RT.b1, 1);
    FS.copy.uniforms.t.value = RT.a1.texture; pass(FS.copy, RT.a2); blur2(RT.a2, RT.b2, 1.6);
    FS.comp.uniforms.tS.value = RT.scene.texture; FS.comp.uniforms.t1.value = RT.a1.texture; FS.comp.uniforms.t2.value = RT.a2.texture; pass(FS.comp, null);
    st.calls = ren.info.render.calls;
  }
  var lastP = null;
  function resize() {
    if (!ren) return; var w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight), pr = Math.min(window.devicePixelRatio || 1, 1.5);
    ren.setPixelRatio(pr); ren.setSize(w, h, false); var W = Math.floor(w * pr), H = Math.floor(h * pr);
    RT.scene.setSize(W, H); RT.a1.setSize(W >> 2, H >> 2); RT.b1.setSize(W >> 2, H >> 2); RT.a2.setSize(W >> 3, H >> 3); RT.b2.setSize(W >> 3, H >> 3);
    FS.bright.uniforms.uPx.value.set(1 / W, 1 / H);
    cam.aspect = w / h; var p = cam.aspect < 1; cam.fov = p ? 44 : 32; cam.updateProjectionMatrix(); U.uScale.value = H * 0.5 * cam.projectionMatrix.elements[5];
    ui.legend.style.gridTemplateColumns = p ? "repeat(2,minmax(0,1fr))" : "repeat(4,minmax(0,1fr))"; ui.date.style.fontSize = p ? "20px" : "24px";
    if (lastP !== null && lastP !== p && hist) build(); lastP = p;
    if (reduce) frame(true); loop();
  }

  /* ---------- controls ---------- */
  var tmpV;
  function project(x, y, z, o) { tmpV.set(x, y, z).project(cam); o.x = (tmpV.x * 0.5 + 0.5) * el.clientWidth; o.y = (-tmpV.y * 0.5 + 0.5) * el.clientHeight; return tmpV.z < 1; }
  function pickDay(px) { if (!model || !model.live) return -1; var best = -1, bd = 1e9, o = {}, zf = Z(ORDER.length - 1) + 0.6;
    for (var i = 0; i < model.days.length; i++) { if (!dayHasData(i)) continue; project(X(i), 0, zf, o); var d = Math.abs(o.x - px); if (d < bd) { bd = d; best = i; } } return best; }
  function bindControls(cv) {
    cv.style.touchAction = "pan-y"; el.style.touchAction = "pan-y";
    on(cv, "pointerdown", function (e) { view.pid = e.pointerId; view.sx = e.clientX; view.sy = e.clientY; view.o0 = view.off; view.drag = false; view.moved = false; });
    on(cv, "pointermove", function (e) {
      var rc = cv.getBoundingClientRect();
      if (e.pointerType === "mouse") { view.px = clamp((e.clientX - rc.left) / rc.width * 2 - 1, -1, 1); view.py = clamp((e.clientY - rc.top) / rc.height * 2 - 1, -1, 1); }
      if (view.pid === e.pointerId) { var dx = e.clientX - view.sx, dy = e.clientY - view.sy; if (Math.abs(dx) + Math.abs(dy) > 6) view.moved = true;
        if (!view.drag && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) { view.drag = true; view.auto = false; try { cv.setPointerCapture(e.pointerId); } catch (x) {} }
        if (view.drag) { view.off = clamp(view.o0 + dx / rc.width * 1.6, -0.9, 0.9); view.idle = now(); if (reduce) frame(true); } }
    });
    function end(e) { if (view.pid !== e.pointerId) return; view.pid = null;
      if (!view.moved && e.type === "pointerup") { var rc = cv.getBoundingClientRect(), i = pickDay(e.clientX - rc.left); if (i >= 0) { setSel(i, true); if (reduce) frame(true); } }
      view.drag = false; view.idle = now(); }
    on(cv, "pointerup", end); on(cv, "pointercancel", end);
    on(cv, "pointerleave", function () { view.px = 0; view.py = 0; });
  }

  /* ---------- frame ---------- */
  var oP = {};
  function frame(force) {
    raf = 0; if (!ren || ((!onScreen || document.hidden) && force !== true)) return;
    var tn = now() / 1000; if (view.t0 == null) view.t0 = tn; var dt = Math.min(0.1, Math.max(0, tn - (view.lt || tn))); view.lt = tn;
    var t = reduce ? 3 : tn - view.t0 + 1; U.uT.value = t;
    if (lastLang !== lang() && model) { buildLegend(); if (sel >= 0) { var s0 = sel; sel = -1; setSel(s0, false); } }
    // auto-advance (paused 15 s after a user tap)
    if (model && model.live && opts.autoplay !== false && !reduce && now() - userT > 15000 && tn - selT > AUTO) {
      var n = model.days.length, i = sel; for (var k = 0; k < n; k++) { i = (i + 1) % n; if (dayHasData(i)) break; } setSel(i, false);
    }
    // camera: slow orbit + gaze + drag
    if (!view.drag && !view.auto && !reduce && now() - view.idle > 6000) view.auto = true;
    if (view.auto && !reduce) { view.sw += dt; var tg = 0.2 * Math.sin(view.sw * 0.1); view.off += (tg - view.off) * Math.min(1, dt * 0.5); }
    var kk = reduce ? 1 : Math.min(1, dt * 2.5); view.gx += (view.px - view.gx) * kk; view.gy += (view.py - view.gy) * kk;
    var p = cam.aspect < 1, dist = p ? 15.6 : 17.0, yaw = -0.36 + view.off + view.gx * 0.06, elv = (p ? 0.36 : 0.3) + view.gy * 0.04, ty = p ? 1.25 : 1.35;
    cam.position.set(Math.sin(yaw) * Math.cos(elv) * dist, ty + Math.sin(elv) * dist, Math.cos(yaw) * Math.cos(elv) * dist); cam.lookAt(p ? 0.3 : 0.4, ty, 0);
    cam.updateMatrixWorld();
    if (model && model.live && sel >= 0) {
      var tx = X(sel); sliceX += (tx - sliceX) * (reduce ? 1 : Math.min(1, dt * 6)); U.uSel.value = sliceX;
      objs.slice.position.x = sliceX; var age = tn - selT; U.uFlash.value = reduce ? 0 : Math.exp(-age * 2.5);
      objs.burst.material.uniforms.uAge.value = reduce ? 99 : age;
      var dp = objs.dots.geometry.attributes.position, dv = objs.dots.geometry.attributes.aV;
      model.rows.forEach(function (id, r) { var v = val(id, sel); dp.setXYZ(r, sliceX, v == null ? 0 : v / 100 * YS, Z(ORDER.indexOf(id))); dv.setX(r, v == null ? 0 : 1); });
      dp.needsUpdate = true; dv.needsUpdate = true;
      // headline burst: real headlines of the selected day float up (max 3)
      var d = model.days[sel];
      if (!burst || burst.d !== d || (!burst.list && dayCache[d])) { var list = topHeadlines(d); burst = { d: d, list: list, t: list ? tn : 0 }; makeCards(list); }
      if (burst.list && ui.cardEls.length) {
        project(sliceX, YS * 1.08, 0, oP); var W = el.clientWidth, a = reduce ? 1 : tn - burst.t, life = opts.autoplay !== false && now() - userT > 15000 ? AUTO : 30;
        var cy = p ? 58 : 42; ui.cardEls.forEach(function (c, j) {
          var cw = Math.min(300, W * (p ? 0.8 : 0.42)); c.style.width = cw + "px";
          var aj = a - j * 0.12, ch = c.offsetHeight || 54, op = reduce ? 1 : sm(0, 0.35, aj) * (1 - sm(life - 0.35, life, a));
          var rise = reduce ? 0 : (1 - sm(0, 0.8, aj)) * 26 + aj * 4;
          var x = clamp(oP.x - cw / 2, 10, W - cw - 10), y = cy + rise; cy += ch + 6;
          c.style.opacity = op.toFixed(3); c.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px)";
        });
      }
      // axis labels
      var zf = Z(ORDER.length - 1) + 0.75, minGap = p ? 34 : 40, lastX = -1e9, o = {}, lgTop = ui.legend.offsetTop - 16;
      for (var li = 0; li < ui.labels.length; li++) { var lb = ui.labels[li]; project(X(li), 0, zf, o); var show = li === sel || (o.x - lastX > minGap && Math.abs(o.x - (project(X(sel), 0, zf, oP), oP.x)) > minGap * 0.8);
        if (show && li !== sel) lastX = o.x; if (o.y > lgTop) show = false; lb.style.display = show ? "block" : "none";
        lb.style.color = li === sel ? "#ffffff" : dayHasData(li) ? "#7f93b4" : "#4a5670"; lb.style.fontWeight = li === sel ? "700" : "400";
        lb.style.transform = "translate(" + Math.round(o.x) + "px," + Math.round(o.y + 4) + "px) translate(-50%,0)"; }
    }
    renderAll(); st.frames++;
    var rn = performance.now(); fpsT.push(rn); while (fpsT.length > 40) fpsT.shift(); if (fpsT.length > 2 && fpsT[fpsT.length - 1] > fpsT[0]) st.fps = Math.round((fpsT.length - 1) / ((fpsT[fpsT.length - 1] - fpsT[0]) / 1000) * 10) / 10;
    if (!reduce) loop();
  }
  function loop() { if (!reduce && !raf && ren && onScreen && !document.hidden) raf = requestAnimationFrame(frame); }

  /* ---------- API ---------- */
  function init(target, o) {
    try {
      if (ok) return true; T = window.THREE; if (!T || !target) return false; if (o && typeof o === "object") for (var k in o) opts[k] = o[k];
      el = target; if (getComputedStyle(el).position === "static") el.style.position = "relative";
      try { ren = new T.WebGLRenderer({ antialias: false, powerPreference: "high-performance" }); } catch (x) { ren = null; }
      if (!ren) return false;
      ren.setClearColor(0x010208, 1); ren.info.autoReset = false; ren.outputEncoding = T.LinearEncoding; ren.toneMapping = T.NoToneMapping;
      var cv = ren.domElement; cv.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y"; el.appendChild(cv);
      tmpV = new T.Vector3(); scene = new T.Scene(); cam = new T.PerspectiveCamera(32, 1.7, 0.1, 160);
      setupPost(); buildStatic(); buildUI(); bindControls(cv);
      if (window.ResizeObserver) { ro = new ResizeObserver(resize); ro.observe(el); } else on(window, "resize", resize);
      if ("IntersectionObserver" in window) { io = new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; loop(); }, { threshold: 0.02 }); io.observe(el); }
      on(document, "visibilitychange", loop);
      if (reduce) rmTimer = setInterval(function () { if (onScreen && !document.hidden) frame(true); }, 1500);
      ok = true; resize(); build(); return true;
    } catch (err) { if (window.console) console.warn("[OrbArchive3D] init failed", err); return false; }
  }
  function addDay(D) { if (D && typeof D === "object" && isDay(D.day)) dayCache[D.day] = D; }
  function update(d) {
    try {
      if (!d || typeof d !== "object") { hist = null; }
      else if (d.risk_index_history) hist = d;
      else {
        if ("history" in d) hist = d.history && typeof d.history === "object" ? d.history : null;
        if (d.days && typeof d.days === "object") for (var k in d.days) addDay(d.days[k]);
        if (d.day) { addDay(d.day); if (!("history" in d)) { burst = null; return; } }
      }
    } catch (x) { hist = null; }
    if (!ok) return;
    try { build(); } catch (err) { if (window.console) console.warn("[OrbArchive3D] update failed", err); try { hist = null; build(); } catch (e2) {} }
  }
  function selectDay(date, keepAuto) { if (!ok || !model || !isDay(date)) return false; var i = model.days.indexOf(date); if (i < 0 || !dayHasData(i)) return false; setSel(i, !keepAuto); if (reduce) frame(true); return true; }
  function stats() { var s = st.d || {}; return { frames: st.frames, triangles: st.tris, calls: st.calls, fps: st.fps, hdr: st.hdr, state: s.state, days: s.days, rows: s.rows, segments: s.segments, isolatedDots: s.isolatedDots,
    gaps: s.gaps, missing: s.missing, unknownSeries: s.unknown, selected: model && sel >= 0 ? model.days[sel] : null, headlinesShown: burst && burst.list ? burst.list.length : 0, daysCached: Object.keys(dayCache).length, lang: lang(), reducedMotion: reduce }; }
  function destroy() {
    if (!ok) return; ok = false; if (raf) cancelAnimationFrame(raf); raf = 0; if (rmTimer) clearInterval(rmTimer);
    if (io) io.disconnect(); if (ro) ro.disconnect(); listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); }); listeners = [];
    disposeDyn(); scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    for (var k in RT) RT[k].dispose(); for (k in FS) if (FS[k] && FS[k].isMaterial) FS[k].dispose(); FS.q.geometry.dispose();
    ren.dispose(); if (ren.domElement.parentNode) ren.domElement.parentNode.removeChild(ren.domElement); if (ui.root && ui.root.parentNode) ui.root.parentNode.removeChild(ui.root);
    ren = null; scene = null; objs = {}; RT = {}; FS = {};
  }
  window.OrbArchive3D = { init: init, update: update, selectDay: selectDay, stats: stats, destroy: destroy };
})();
