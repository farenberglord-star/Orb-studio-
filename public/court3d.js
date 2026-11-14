/* court3d.js v2 - "Hall of Justice" for orbstudio.org/tools/court
   Classical courtroom (marble, fluted columns, gold, dark wood) + restrained data hologram inside it.
   three.js r128 (cdnjs) only, no examples/, no textures/models/fonts, no text in 3D. All patterns procedural.
   window.OrbCourt3D = { init(el, {onCase, onVerdict, reduced})->bool, update(court, feed), stats(), show(i), seek(s), destroy() }
   court = GET /api/v1/court, feed = GET /api/v1/court/feed (optional). Deterministic: hash phases only.
   Every new case fires onCase(info) and el "orbcourt:case" (detail = info); verdict fires onVerdict + "orbcourt:verdict". */
(function () {
  "use strict";
  var T = window.THREE;
  var C = { bg: 0x050507, holo: 0x6fe6ff, charge: 0xff5d7a, evid: 0xffb547, appeal: 0x4fd8a4, gold: 0xd4a85a };
  var CY = 9.0, T_LAND = 1.8, T_EVID = 2.0, T_TILT = 3.8, T_STRIKE = 5.8, T_FADE = 8.3, T_REDUCED = 6.4;
  var ACC = [0, 0, -8.9], BENCH_Z = -12.9, MED = [0, 5.35, -17.55], MAX_SLABS = 8, MAX_PRIORS = 30, MAX_CASES = 60;
  var COLZ = [8, 4.5, 1, -2.5, -6, -9.5, -13], COLX = 5.0;
  var SHAPES = { SCAN_ADMIN: "oct", SCAN_SECRETS: "ico", SCAN_EXPLOIT: "tet", PROMPT_INJECTION: "dod" };
  var TINTS = { SCAN_ADMIN: 0xff7a5d, SCAN_SECRETS: 0xff5d7a, SCAN_EXPLOIT: 0xff3d6a, PROMPT_INJECTION: 0xd06dff };
  function hs(s) { var a = 7; s = String(s); for (var i = 0; i < s.length; i++) a = (a * 31 + s.charCodeAt(i)) % 1000003; return a; }
  function h(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function cl(x, a, b) { return x < a ? a : x > b ? b : x; }
  function sm(x) { x = cl(x, 0, 1); return x * x * (3 - 2 * x); }
  function num(v) { return typeof v === "number" && isFinite(v) ? v : null; }
  function str(v) { return typeof v === "string" && v.length ? v : null; }
  function col(c) { return new T.Color(c); }
  var S = null;

  /* ---------- data (only real fields; missing -> null -> element absent) ---------- */
  function globRe(p) { return new RegExp("^" + p.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$"); }
  function parse(court, feed) {
    var D = { ok: false, code: [], last7: {}, total: null, appeals: null, perDay: null, days: null, evidence: [], cases: [] };
    if (court && typeof court === "object") {
      if (court.code && typeof court.code === "object") Object.keys(court.code).forEach(function (k) { D.code.push(k); });
      var l7 = court.last_7_days || {}, ins = court.insights || {};
      var bc = ins.by_charge && typeof ins.by_charge === "object" ? ins.by_charge : l7;
      Object.keys(bc).forEach(function (k) { var v = num(bc[k]); if (v !== null) D.last7[k] = v; });
      D.total = num(ins.total_7d); D.appeals = num(ins.appeals_7d);
      if (Array.isArray(ins.per_day) && ins.per_day.length) {
        D.perDay = ins.per_day.slice(-7).map(num); D.days = Array.isArray(ins.days) ? ins.days.slice(-7) : null;
      }
      (Array.isArray(ins.top_evidence) ? ins.top_evidence : []).slice(0, MAX_SLABS).forEach(function (e) {
        if (!e || !str(e.path) || num(e.n) === null) return;
        D.evidence.push({ path: e.path, n: e.n, charge: str(e.charge), re: globRe(e.path) });
      });
      (Array.isArray(court.cases) ? court.cases : []).forEach(function (c) { if (c && str(c.case_id)) D.cases.push(norm(c, false)); });
    }
    if (feed && Array.isArray(feed.items)) {
      var seen = {}; D.cases.forEach(function (c) { seen[c.id] = 1; });
      feed.items.forEach(function (it) {
        if (!it || !str(it.id) || seen[it.id]) return; seen[it.id] = 1;
        var tags = Array.isArray(it.tags) ? it.tags : [], m = /«([^»]+)»/.exec(it.content_text || "");
        D.cases.push(norm({ case_id: it.id, filed_at: it.date_published, charge: tags[0], verdict: tags[1],
          evidence: m ? m[1] : null, title: it.title, url: it.url, content_text: it.content_text }, true));
      });
    }
    D.cases = D.cases.slice(0, MAX_CASES);
    D.ok = D.cases.length > 0 || D.total !== null;
    return D;
  }
  function norm(c, fromFeed) {
    var o = { id: c.case_id, charge: str(c.charge), verdict: str(c.verdict), evidence: str(c.evidence),
      priors: num(c.priors_same_day), restricted: c.access_restricted === true, fine: c.fine == null ? null : c.fine,
      appeal: c.appeal == null ? null : c.appeal, fp: str(c.fingerprint), source: fromFeed ? "feed" : "court", raw: c };
    return o;
  }

  /* ---------- helpers ---------- */
  var GLOW_TEX = null;
  function glowTex() {
    if (GLOW_TEX) return GLOW_TEX;
    var cv = document.createElement("canvas"); cv.width = cv.height = 64; var g = cv.getContext("2d");
    var gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,0.5)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64); GLOW_TEX = new T.CanvasTexture(cv); return GLOW_TEX;
  }
  function sprite(color, size, op) {
    var s = new T.Sprite(new T.SpriteMaterial({ map: glowTex(), color: color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, fog: false }));
    s.scale.set(size, size, 1); return s;
  }
  function basic(color, op) { return new T.MeshBasicMaterial({ color: color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false }); }
  function lineMat(color, op) { return new T.LineBasicMaterial({ color: color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, fog: false }); }
  // manual geometry merge (no examples/): list of [geometry, matrix]
  function Merger() { this.p = []; this.n = []; }
  Merger.prototype.add = function (geo, m) {
    var g = geo.index ? geo.toNonIndexed() : geo; if (!g.attributes.normal) g.computeVertexNormals();
    var P = g.attributes.position, N = g.attributes.normal, nm = new T.Matrix3().getNormalMatrix(m), v = new T.Vector3(), i;
    for (i = 0; i < P.count; i++) {
      v.fromBufferAttribute(P, i).applyMatrix4(m); this.p.push(v.x, v.y, v.z);
      v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); this.n.push(v.x, v.y, v.z);
    }
    if (g !== geo) g.dispose(); geo.dispose(); return this;
  };
  Merger.prototype.box = function (w, hh, d, x, y, z, ry, rx) { return this.add(new T.BoxGeometry(w, hh, d), mat4(x, y, z, ry || 0, rx || 0)); };
  Merger.prototype.geo = function () { var g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(this.p, 3)); g.setAttribute("normal", new T.Float32BufferAttribute(this.n, 3)); return g; };
  function mat4(x, y, z, ry, rx, rz, s) { var m = new T.Matrix4(); m.compose(new T.Vector3(x, y, z), new T.Quaternion().setFromEuler(new T.Euler(rx || 0, ry || 0, rz || 0)), new T.Vector3(s || 1, s || 1, s || 1)); return m; }

  /* ---------- holo shaders ---------- */
  var FRES_VS = "varying float vF; varying float vY; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0);" +
    "vec3 n=normalize(normalMatrix*normal); vF=1.0-abs(dot(n,normalize(-mv.xyz))); vY=position.y; gl_Position=projectionMatrix*mv; }";
  var FRES_FS = "uniform vec3 uColor; uniform float uGlow; uniform float uTime; varying float vF; varying float vY;" +
    "void main(){ float scan=0.8+0.2*sin(vY*34.0-uTime*2.4); float a=(0.06+0.85*pow(vF,2.2))*scan; gl_FragColor=vec4(uColor*a*uGlow,1.0); }";
  function fresMat(color) {
    return new T.ShaderMaterial({ vertexShader: FRES_VS, fragmentShader: FRES_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      side: T.DoubleSide, uniforms: { uColor: { value: col(color) }, uGlow: { value: 1 }, uTime: { value: 0 } } });
  }
  // marble floor with fake reflection (mirrored hall shows through), light pools, procedural veins
  var FLOOR_VS = "varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }";
  var FLOOR_FS = [
    "uniform float uDay[7]; uniform float uColZ[7]; uniform float uPulse; uniform vec3 uAccC; uniform float uAccK; uniform vec3 uAccP; uniform float uDim; uniform float uFlick;",
    "varying vec3 vW;",
    "float hh(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }",
    "float nz(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f); return mix(mix(hh(i),hh(i+vec2(1,0)),f.x),mix(hh(i+vec2(0,1)),hh(i+vec2(1,1)),f.x),f.y); }",
    "float fbm(vec2 p){ float a=0.0, s=0.5; for(int i=0;i<5;i++){ a+=s*nz(p); p*=2.03; s*=0.5; } return a; }",
    "void main(){",
    "  vec2 p=vW.xz; vec2 tile=floor(p/2.0); vec2 q=p+hh(tile)*7.0;",
    "  float f=fbm(q*0.55); float v=abs(sin((q.x*0.8+q.y*0.45)*1.2+f*7.0));",
    "  float vein=pow(1.0-v,24.0)*0.55+pow(1.0-v,6.0)*0.10;",
    "  vec3 base=mix(vec3(0.075,0.078,0.088),vec3(0.17,0.17,0.18),f*0.9)+vein*vec3(0.55,0.55,0.57);",
    "  vec2 g=abs(fract(p/2.0)-0.5); float seam=smoothstep(0.492,0.5,max(g.x,g.y));",
    "  base*=1.0-0.55*seam;",
    "  vec3 L=vec3(0.0);",
    "  for(int i=0;i<7;i++){ float d=length(vec2(p.x*0.75,p.y-uColZ[i])); L+=vec3(1.0,0.78,0.48)*uDay[i]*exp(-d*d*0.55); }",
    "  for(int s=0;s<2;s++){ float sx=s==0?-6.9:6.9; float dx=abs(p.x-sx); L+=vec3(1.0,0.66,0.33)*0.35*uFlick*exp(-dx*0.9)*(0.6+0.4*sin(p.y*0.9+1.3)); }",
    "  float db=length(vec2(p.x*0.35,p.y+11.2)); L+=vec3(1.0,0.8,0.45)*(0.25+1.4*uPulse)*exp(-db*db*0.25);",
    "  float da=length(p-uAccP.xz); L+=uAccC*uAccK*exp(-da*da*1.4);",
    "  vec3 c=base*(0.35+L*1.1)*uDim + L*0.06;",
    "  vec3 vd=normalize(cameraPosition-vW); float fres=pow(1.0-clamp(vd.y,0.0,1.0),3.0);",
    "  float a=mix(0.86,0.42,fres)*(0.9+0.1*f);",
    "  float fogf=smoothstep(30.0,4.0,length(cameraPosition-vW)); gl_FragColor=vec4(c*fogf,a*mix(1.0,0.97,1.0-fogf));",
    "}"].join("\n");
  var FLAME_VS = "attribute float aPh; attribute float aK; uniform float uTime; uniform float uPr; varying float vA; varying float vK;" +
    "void main(){ float fl=0.82+0.10*sin(uTime*7.3+aPh)+0.08*sin(uTime*13.7+aPh*2.1); vA=fl; vK=aK; vec4 mv=modelViewMatrix*vec4(position,1.0);" +
    "gl_PointSize=uPr*(aK>1.5?140.0:520.0)*fl/(-mv.z); gl_Position=projectionMatrix*mv; }";
  var FLAME_FS = "uniform vec3 uColor; uniform float uBoost; varying float vA; varying float vK; void main(){ vec2 d=gl_PointCoord-0.5; float r=length(d)*2.0;" +
    "float a=pow(max(0.0,1.0-r),2.2); vec3 c=vK>1.5? uColor*vec3(1.0,0.92,0.75)*vK*0.5 : mix(uColor,vec3(1.0,0.95,0.8),pow(max(0.0,1.0-r),6.0));" +
    "gl_FragColor=vec4(c*a*vA*uBoost,1.0); }";

  /* ---------- static hall (merged per material) ---------- */
  function buildHall() {
    var sc = S.scene, g = S.g, i, j, k;
    var stone = new Merger(), dark = new Merger(), gold = new Merger(), wood = new Merger();
    // dais: three steps + platform
    stone.box(13, 0.3, 0.6, 0, 0.15, -11.0); stone.box(13, 0.6, 0.6, 0, 0.3, -11.6); stone.box(15, 0.9, 6.0, 0, 0.45, -15.0);
    gold.box(13.02, 0.03, 0.03, 0, 0.3, -10.7); gold.box(13.02, 0.03, 0.03, 0, 0.6, -11.3); gold.box(15.02, 0.03, 0.03, 0, 0.9, -11.9);
    // walls
    dark.box(16, 10.5, 0.4, 0, 5.0, -18.2); [-1, 1].forEach(function (sd) { dark.box(0.4, 10.5, 31, sd * 7.9, 5.0, -2.5); });
    dark.box(16, 10.5, 0.4, 0, 5.0, 13.2);
    // back wall raised panels + gold frames
    [-6.1, -3.9, 3.9, 6.1].forEach(function (x) { [2.2, 5.6].forEach(function (y) {
      dark.box(1.7, 2.8, 0.12, x, y, -17.95);
      gold.box(1.8, 0.04, 0.04, x, y + 1.45, -17.88); gold.box(1.8, 0.04, 0.04, x, y - 1.45, -17.88);
      gold.box(0.04, 2.9, 0.04, x - 0.9, y, -17.88); gold.box(0.04, 2.9, 0.04, x + 0.9, y, -17.88); }); });
    // pilasters at back corners and around medallion
    [-7.4, -2.6, 2.6, 7.4].forEach(function (x) { stone.box(0.7, 9.0, 0.3, x, 4.5, -17.85); gold.box(0.8, 0.25, 0.36, x, 8.85, -17.82); gold.box(0.8, 0.2, 0.36, x, 1.0, -17.82); });
    // medallion ring + blank plaque
    gold.add(new T.TorusGeometry(1.95, 0.11, 8, 56), mat4(MED[0], MED[1], MED[2] + 0.12));
    gold.add(new T.TorusGeometry(1.7, 0.035, 6, 72), mat4(MED[0], MED[1], MED[2] + 0.12));
    dark.add(new T.CircleGeometry(1.92, 48), mat4(MED[0], MED[1], MED[2] + 0.06));
    gold.box(0.08, 2.2, 0.08, MED[0], MED[1] - 0.25, MED[2] + 0.2); // scale post
    gold.add(new T.ConeGeometry(0.42, 0.3, 16, 1), mat4(MED[0], MED[1] - 1.42, MED[2] + 0.2));
    gold.add(new T.SphereGeometry(0.11, 10, 8), mat4(MED[0], MED[1] + 0.9, MED[2] + 0.2));
    gold.box(4.2, 0.62, 0.1, 0, 8.25, -17.9); dark.box(3.9, 0.42, 0.06, 0, 8.25, -17.84);
    // side wall panels + sconce brackets
    var SCZ = [6.25, 2.75, -0.75, -4.25, -7.75, -11.25], flames = [], fph = [], fk = [];
    [-1, 1].forEach(function (sd) {
      SCZ.forEach(function (z, n) {
        dark.box(0.1, 3.0, 2.3, sd * 7.66, 2.4, z); gold.box(0.05, 0.04, 2.4, sd * 7.6, 3.95, z); gold.box(0.05, 0.04, 2.4, sd * 7.6, 0.9, z);
        gold.box(0.5, 0.05, 0.05, sd * 7.5, 4.62, z); gold.box(0.16, 0.5, 0.1, sd * 7.68, 4.5, z);
        gold.add(new T.CylinderGeometry(0.16, 0.05, 0.22, 10), mat4(sd * 7.3, 4.8, z));
        flames.push(sd * 7.3, 5.02, z); fph.push(h(n * 7 + (sd + 1) * 31) * 6.28); fk.push(1);
      });
    });
    // columns: fluted shaft, gold base + Corinthian-like capital
    var shaft = new T.CylinderGeometry(0.38, 0.42, 7.0, 72, 1, true), sp = shaft.attributes.position;
    for (i = 0; i < sp.count; i++) { var x = sp.getX(i), z = sp.getZ(i), th = Math.atan2(z, x), f = 1 - 0.065 * (0.5 + 0.5 * Math.cos(th * 20)); sp.setX(i, x * f); sp.setZ(i, z * f); }
    shaft.computeVertexNormals();
    var baseP = [[0.001, 0], [0.62, 0], [0.62, 0.22], [0.56, 0.26], [0.58, 0.36], [0.52, 0.46], [0.47, 0.5], [0.44, 0.62]].map(function (a) { return new T.Vector2(a[0], a[1]); });
    var capP = [[0.40, 0], [0.47, 0.06], [0.43, 0.12], [0.46, 0.35], [0.55, 0.62], [0.66, 0.78], [0.72, 0.84], [0.001, 0.84]].map(function (a) { return new T.Vector2(a[0], a[1]); });
    var baseG = new T.LatheGeometry(baseP, 20), capG = new T.LatheGeometry(capP, 20);
    COLZ.forEach(function (z, n) { [-1, 1].forEach(function (sd) {
      var x = sd * COLX;
      stone.add(shaft.clone(), mat4(x, 0.62 + 3.5, z));
      gold.box(1.25, 0.18, 1.25, x, 0.09, z); gold.add(baseG.clone(), mat4(x, 0.18, z));
      gold.add(capG.clone(), mat4(x, 7.62, z)); gold.box(1.5, 0.2, 1.5, x, 8.56, z);
      for (k = 0; k < 4; k++) { var a = k * Math.PI / 2 + Math.PI / 4; // volutes
        gold.add(new T.TorusGeometry(0.11, 0.04, 4, 8), mat4(x + Math.cos(a) * 0.62, 8.3, z + Math.sin(a) * 0.62, -a + Math.PI / 2)); }
      for (k = 0; k < 8; k++) { var b = k * Math.PI / 4; // acanthus leaves
        gold.add(new T.SphereGeometry(0.16, 5, 3), (function () { var m = mat4(x + Math.cos(b) * 0.47, 7.95, z + Math.sin(b) * 0.47, -b, 0, 0); m.scale(new T.Vector3(0.45, 1.5, 0.8)); return m; })()); }
    }); });
    // entablature over the colonnades
    [-1, 1].forEach(function (sd) { stone.box(1.6, 0.55, 23.5, sd * COLX, 8.93, -2.5); gold.box(1.64, 0.06, 23.55, sd * COLX, 8.66, -2.5); gold.box(1.64, 0.05, 23.55, sd * COLX, 9.2, -2.5); });
    // coffered ceiling: beams grid + gold lower edges; recess back plane
    dark.box(16, 0.2, 31, 0, 10.35, -2.5);
    var cx = [-7.5, -6, -4, -2, 0, 2, 4, 6, 7.5], czs = []; for (k = 12; k >= -18; k -= 2) czs.push(k);
    cx.forEach(function (x) { stone.box(0.32, 0.9, 31, x, 9.8, -2.5); gold.box(0.03, 0.03, 31, x - 0.17, 9.35, -2.5); gold.box(0.03, 0.03, 31, x + 0.17, 9.35, -2.5); });
    czs.forEach(function (z) { stone.box(16, 0.9, 0.32, 0, 9.8, z); gold.box(16, 0.03, 0.03, 0, 9.35, z - 0.17); gold.box(16, 0.03, 0.03, 0, 9.35, z + 0.17); });
    var downs = [];
    for (i = 0; i < cx.length - 1; i++) for (j = 0; j < czs.length - 1; j++) { var dx = (cx[i] + cx[i + 1]) / 2, dz = (czs[j] + czs[j + 1]) / 2;
      if (Math.abs(dx) < 1.5 && Math.abs(dz + 3) < 1.5) continue; downs.push(dx, 10.2, dz); }
    // centre ceiling medallion
    gold.add(new T.TorusGeometry(1.0, 0.07, 8, 48), mat4(0, 10.15, -3, 0, Math.PI / 2));
    gold.add(new T.TorusGeometry(0.6, 0.05, 8, 40), mat4(0, 10.15, -3, 0, Math.PI / 2));
    for (k = 0; k < 12; k++) { var c = k * Math.PI / 6; gold.add(new T.SphereGeometry(0.14, 6, 4), (function () { var m = mat4(Math.cos(c) * 0.8, 10.15, -3 + Math.sin(c) * 0.8, -c); m.scale(new T.Vector3(1.6, 0.4, 0.6)); return m; })()); }
    gold.add(new T.SphereGeometry(0.22, 12, 8), mat4(0, 10.1, -3));
    // judges' bench, 5 high-backed chairs
    wood.box(10, 1.5, 1.0, 0, 1.65, BENCH_Z); wood.box(10.4, 0.1, 1.3, 0, 2.45, BENCH_Z - 0.05);
    for (k = 0; k < 5; k++) { var px = -4 + k * 2;
      gold.box(1.5, 0.03, 0.03, px, 2.1, BENCH_Z + 0.52); gold.box(1.5, 0.03, 0.03, px, 1.15, BENCH_Z + 0.52);
      gold.box(0.03, 0.95, 0.03, px - 0.75, 1.62, BENCH_Z + 0.52); gold.box(0.03, 0.95, 0.03, px + 0.75, 1.62, BENCH_Z + 0.52);
      var tall = k === 2 ? 0.5 : 0;
      wood.box(0.9, 0.12, 0.8, px, 1.45, BENCH_Z - 1.4); wood.box(0.95, 2.5 + tall, 0.14, px, 2.2 + tall / 2, BENCH_Z - 1.85);
      wood.box(0.1, 0.6, 0.7, px - 0.45, 1.75, BENCH_Z - 1.4); wood.box(0.1, 0.6, 0.7, px + 0.45, 1.75, BENCH_Z - 1.4);
      gold.box(1.0, 0.1, 0.18, px, 3.47 + tall, BENCH_Z - 1.85);
    }
    gold.box(10.42, 0.04, 0.04, 0, 2.5, BENCH_Z + 0.6);
    // public benches both sides of the aisle
    for (j = 0; j < 9; j++) { var bz = 7.2 - j * 1.45; [-1, 1].forEach(function (sd) { var bx = sd * 2.85;
      wood.box(3.0, 0.08, 0.46, bx, 0.48, bz); wood.box(3.0, 0.5, 0.06, bx, 0.86, bz + 0.25, 0, -0.12);
      wood.box(0.07, 1.0, 0.56, bx - 1.5, 0.5, bz + 0.03); wood.box(0.07, 1.0, 0.56, bx + 1.5, 0.5, bz + 0.03);
      wood.box(3.0, 0.42, 0.04, bx, 0.62, bz - 0.24); }); }
    // wooden railing before the well (gap for the aisle)
    [-1, 1].forEach(function (sd) {
      wood.box(3.5, 0.09, 0.14, sd * 2.95, 1.0, -6.3); wood.box(3.5, 0.08, 0.1, sd * 2.95, 0.12, -6.3);
      for (k = 0; k <= 12; k++) wood.add(new T.CylinderGeometry(0.035, 0.045, 0.85, 6), mat4(sd * (1.2 + k * 0.29), 0.56, -6.3));
      wood.box(0.16, 1.15, 0.16, sd * 1.2, 0.58, -6.3); gold.add(new T.SphereGeometry(0.09, 8, 6), mat4(sd * 1.2, 1.22, -6.3));
    });
    // gold floor inlay under the accused + aisle inlay lines
    gold.add(new T.RingGeometry(1.15, 1.22, 64), mat4(ACC[0], 0.012, ACC[2], 0, -Math.PI / 2));
    gold.add(new T.RingGeometry(1.42, 1.45, 64), mat4(ACC[0], 0.012, ACC[2], 0, -Math.PI / 2));
    [-1, 1].forEach(function (sd) { gold.box(0.05, 0.01, 17.2, sd * 1.15, 0.006, 0.5); });
    shaft.dispose(); baseG.dispose(); capG.dispose();
    // materials (lit) + mirrored copies under the floor for the reflection
    var mats = {
      stone: new T.MeshStandardMaterial({ color: 0x2c2b2e, roughness: 0.5, metalness: 0.05 }),
      dark: new T.MeshStandardMaterial({ color: 0x141316, roughness: 0.65, metalness: 0.05 }),
      gold: new T.MeshStandardMaterial({ color: C.gold, roughness: 0.32, metalness: 0.75, emissive: 0x24170a, emissiveIntensity: 1 }),
      wood: new T.MeshStandardMaterial({ color: 0x1f0f07, roughness: 0.4, metalness: 0.08 })
    };
    g.hallMats = mats;
    var geos = { stone: stone.geo(), dark: dark.geo(), gold: gold.geo(), wood: wood.geo() };
    g.mirror = new T.Group(); g.mirror.scale.y = -1; sc.add(g.mirror);
    Object.keys(geos).forEach(function (k2) {
      sc.add(new T.Mesh(geos[k2], mats[k2]));
      var mm = mats[k2].clone(); mm.side = T.BackSide; g.mirror.add(new T.Mesh(geos[k2], mm));
    });
    // floor
    var fu = { uDay: { value: [0, 0, 0, 0, 0, 0, 0] }, uColZ: { value: COLZ.slice() }, uPulse: { value: 0 }, uAccC: { value: col(C.charge) }, uAccK: { value: 0 },
      uAccP: { value: new T.Vector3(ACC[0], 0, ACC[2]) }, uDim: { value: 1 }, uFlick: { value: 1 } };
    var fl = new T.Mesh(new T.PlaneGeometry(15.4, 25.6), new T.ShaderMaterial({ vertexShader: FLOOR_VS, fragmentShader: FLOOR_FS, uniforms: fu, transparent: true, depthWrite: true }));
    fl.rotation.x = -Math.PI / 2; fl.position.z = 0.2; sc.add(fl); g.floor = fl;
    // flames + ceiling downlights as one point cloud
    var fp = flames.slice(), ph = fph.slice(), kk = fk.slice();
    for (i = 0; i < downs.length; i += 3) { fp.push(downs[i], downs[i + 1], downs[i + 2]); ph.push(h(i + 5) * 6.28); kk.push(2); }
    var pg = new T.BufferGeometry(); pg.setAttribute("position", new T.Float32BufferAttribute(fp, 3)); pg.setAttribute("aPh", new T.Float32BufferAttribute(ph, 1)); pg.setAttribute("aK", new T.Float32BufferAttribute(kk, 1));
    g.flames = new T.Points(pg, new T.ShaderMaterial({ vertexShader: FLAME_VS, fragmentShader: FLAME_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPr: { value: S.pr }, uColor: { value: col(0xffb35a) }, uBoost: { value: 1 } } }));
    sc.add(g.flames);
    // lights
    sc.add(new T.AmbientLight(0x2a2018, 0.45)); sc.add(new T.HemisphereLight(0x5a4630, 0x0a0806, 0.3));
    g.sconceL = []; [[-5.9, 4.6, 4.5], [5.9, 4.6, 4.5], [-5.9, 4.6, -6], [5.9, 4.6, -6]].forEach(function (p, n) {
      var l = new T.PointLight(0xffa850, 1.1, 13, 2); l.position.set(p[0], p[1], p[2]); sc.add(l); g.sconceL.push({ l: l, ph: h(n + 40) * 6.28 }); });
    g.benchL = new T.PointLight(0xffc878, 1.4, 16, 2); g.benchL.position.set(0, 4.2, -10.5); sc.add(g.benchL);
    g.medL = new T.PointLight(0xffc070, 1.2, 9, 2); g.medL.position.set(0, 4.0, -15.2); sc.add(g.medL);
    g.ceilL = new T.PointLight(0xffd090, 0.9, 16, 2); g.ceilL.position.set(0, 8.2, 2); sc.add(g.ceilL);
    // gold balance scale (animated) in the back medallion
    var goldM = mats.gold;
    g.beam = new T.Group(); g.beam.position.set(MED[0], MED[1] + 0.75, MED[2] + 0.28); sc.add(g.beam);
    var bm = new Merger(); bm.box(2.5, 0.07, 0.07, 0, 0, 0); bm.add(new T.SphereGeometry(0.07, 8, 6), mat4(-1.25, 0, 0)); bm.add(new T.SphereGeometry(0.07, 8, 6), mat4(1.25, 0, 0));
    g.beam.add(new T.Mesh(bm.geo(), goldM));
    g.pans = [];
    [-1, 1].forEach(function (sd, n) {
      var hang = new T.Group(); hang.position.x = sd * 1.25; g.beam.add(hang);
      var pm = new Merger(); for (k = 0; k < 3; k++) { var a = k / 3 * Math.PI * 2;
        var cyl = new T.CylinderGeometry(0.012, 0.012, 1.05, 4); var dir = new T.Vector3(Math.cos(a) * 0.36, -1.0, Math.sin(a) * 0.12);
        var q = new T.Quaternion().setFromUnitVectors(new T.Vector3(0, 1, 0), dir.clone().normalize()); var m = new T.Matrix4().compose(dir.clone().multiplyScalar(0.5), q, new T.Vector3(1, 1, 1)); pm.add(cyl, m); }
      pm.add(new T.LatheGeometry([new T.Vector2(0.001, -0.12), new T.Vector2(0.25, -0.1), new T.Vector2(0.4, 0.0), new T.Vector2(0.42, 0.02)], 24), mat4(0, -1.0, 0));
      hang.add(new T.Mesh(pm.geo(), goldM));
      var glow = sprite(n ? C.appeal : C.charge, 1.1, 0); glow.position.y = -0.85; hang.add(glow);
      g.pans.push({ hang: hang, glow: glow });
    });
    g.benchFlash = sprite(C.gold, 6.0, 0); g.benchFlash.position.set(0, 2.9, BENCH_Z + 0.2); sc.add(g.benchFlash);
    g.medFlash = sprite(C.gold, 5.5, 0); g.medFlash.position.set(MED[0], MED[1], MED[2] + 0.4); sc.add(g.medFlash);
  }

  /* ---------- hologram layer ---------- */
  function polyGeo(kind, r) {
    if (kind === "oct") return new T.OctahedronGeometry(r, 0);
    if (kind === "tet") return new T.TetrahedronGeometry(r * 1.15, 0);
    if (kind === "dod") return new T.DodecahedronGeometry(r, 0);
    return new T.IcosahedronGeometry(r, 0);
  }
  function buildHolo() {
    var sc = S.scene, g = S.g, k, i;
    g.ring = new T.Mesh(new T.RingGeometry(0.9, 0.98, 64), basic(C.charge, 0)); g.ring.rotation.x = -Math.PI / 2; g.ring.position.set(ACC[0], 0.03, ACC[2]); sc.add(g.ring);
    g.halo = new T.Mesh(new T.RingGeometry(1.28, 1.33, 64), basic(C.charge, 0)); g.halo.rotation.x = -Math.PI / 2; g.halo.position.set(ACC[0], 0.035, ACC[2]); sc.add(g.halo);
    // article sectors: one mesh, vertex colours updated per frame
    g.sectors = null;
    g.acc = new T.Group(); sc.add(g.acc); g.accMeshes = {};
    ["oct", "ico", "tet", "dod"].forEach(function (kd) {
      var geo = polyGeo(kd, 0.62), grp = new T.Group(), m = fresMat(C.holo); grp.add(new T.Mesh(geo, m));
      var e = new T.LineSegments(new T.EdgesGeometry(geo), lineMat(C.charge, 0.9)); grp.add(e);
      grp.visible = false; g.acc.add(grp); g.accMeshes[kd] = { grp: grp, mat: m, edge: e };
    });
    g.core = sprite(C.charge, 1.4, 0); sc.add(g.core);
    var pp = new Float32Array(MAX_PRIORS * 3), pg = new T.BufferGeometry(); pg.setAttribute("position", new T.BufferAttribute(pp, 3));
    g.priors = new T.Points(pg, new T.PointsMaterial({ color: C.charge, size: 0.1, transparent: true, opacity: 0.8, blending: T.AdditiveBlending, depthWrite: false, fog: false })); g.priors.frustumCulled = false; sc.add(g.priors);
    var cg = new T.BufferGeometry(), cp2 = []; for (k = 0; k < 12; k++) { var a = k / 12 * Math.PI * 2; cp2.push(Math.cos(a) * 0.95, 0, Math.sin(a) * 0.95, Math.cos(a) * 0.95, 2.6, Math.sin(a) * 0.95); }
    cg.setAttribute("position", new T.Float32BufferAttribute(cp2, 3)); g.cage = new T.LineSegments(cg, lineMat(C.charge, 0.6)); g.cage.position.set(ACC[0], 0, ACC[2]); g.cage.visible = false; sc.add(g.cage);
    // evidence glow points (one per tablet)
    // evidence tablets: one dynamic merged mesh (8 top_evidence + 1 own), vertex colours = brightness
    var tb = new T.BoxGeometry(0.62, 0.86, 0.03).toNonIndexed(); g.tabBase = tb.attributes.position.array.slice(); tb.dispose(); g.tabVN = g.tabBase.length / 3;
    var tgeo = new T.BufferGeometry(); tgeo.setAttribute("position", new T.BufferAttribute(new Float32Array(g.tabVN * (MAX_SLABS + 1) * 3), 3));
    tgeo.setAttribute("color", new T.BufferAttribute(new Float32Array(g.tabVN * (MAX_SLABS + 1) * 3), 3));
    g.tabs = new T.Mesh(tgeo, new T.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false }));
    g.tabs.frustumCulled = false; sc.add(g.tabs);
    var tg = new T.BufferGeometry(); tg.setAttribute("position", new T.BufferAttribute(new Float32Array((MAX_SLABS + 1) * 3), 3));
    tg.setAttribute("aA", new T.BufferAttribute(new Float32Array(MAX_SLABS + 1), 1));
    g.tabGlow = new T.Points(tg, new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uPr: { value: S.pr }, uColor: { value: col(C.evid) } },
      vertexShader: "attribute float aA; uniform float uPr; varying float vA; void main(){ vA=aA; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=uPr*1100.0/(-mv.z); gl_Position=projectionMatrix*mv; }",
      fragmentShader: "uniform vec3 uColor; varying float vA; void main(){ float r=length(gl_PointCoord-0.5)*2.0; gl_FragColor=vec4(uColor*pow(max(0.0,1.0-r),2.5)*vA,1.0); }" }));
    g.tabGlow.frustumCulled = false; sc.add(g.tabGlow);
    var lg = new T.BufferGeometry(); lg.setAttribute("position", new T.BufferAttribute(new Float32Array(6), 3)); g.link = new T.Line(lg, lineMat(C.evid, 0)); g.link.frustumCulled = false; sc.add(g.link);
    // verdict: soft gavel ring on the floor
    g.wave = new T.Mesh(new T.RingGeometry(0.95, 1.0, 96), basic(C.gold, 0)); g.wave.rotation.x = -Math.PI / 2; g.wave.position.set(0, 0.95, BENCH_Z + 0.9); sc.add(g.wave);
    g.wave2 = new T.Mesh(new T.RingGeometry(0.97, 1.0, 96), basic(C.gold, 0)); g.wave2.rotation.x = -Math.PI / 2; g.wave2.position.set(ACC[0], 0.04, ACC[2]); sc.add(g.wave2);
  }
  function rebuildData() {
    var g = S.g, D = S.D, i;
    var days = g.floor.material.uniforms.uDay.value;
    for (i = 0; i < 7; i++) days[i] = 0.18; // neutral downlight when per_day is absent
    if (D.perDay) { var mx = 1, n = D.perDay.length; D.perDay.forEach(function (v) { if (v !== null && v > mx) mx = v; });
      for (i = 0; i < n && i < 7; i++) { var v = D.perDay[i]; days[i] = v === null ? 0.05 : 0.12 + 0.55 * v / mx; } } // index 0 = oldest = entrance
    S.dayK = days.slice();
    if (g.sectors) { S.scene.remove(g.sectors); g.sectors.geometry.dispose(); g.sectors.material.dispose(); g.sectors = null; }
    var codes = D.code.length ? D.code : Object.keys(D.last7), tot = 0; codes.forEach(function (k) { tot += D.last7[k] || 0; });
    g.sectorInfo = [];
    if (codes.length) {
      var m = new Merger(), span = Math.PI * 2 / codes.length, cnt = [];
      codes.forEach(function (k, j) { var rg = new T.RingGeometry(1.0, 1.1, 16, 1, j * span + 0.06, span - 0.12); var before = m.p.length; m.add(rg, mat4(0, 0, 0, 0, -Math.PI / 2)); cnt.push([before / 3, m.p.length / 3]);
        g.sectorInfo.push({ k: k, tint: col(TINTS[k] || C.charge), base: 0.06 + (tot ? 0.3 * (D.last7[k] || 0) / tot : 0), r: cnt[j] }); });
      var geo = m.geo(); geo.setAttribute("color", new T.Float32BufferAttribute(new Float32Array(m.p.length), 3));
      g.sectors = new T.Mesh(geo, new T.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false }));
      g.sectors.position.set(ACC[0], 0.032, ACC[2]); S.scene.add(g.sectors);
    }
    g.slabList = []; var nmax = 1; D.evidence.forEach(function (e) { if (e.n > nmax) nmax = e.n; });
    D.evidence.forEach(function (e, j) {
      var sd = j % 2 ? 1 : -1, row = Math.floor(j / 2), k = e.n / nmax;
      g.slabList.push({ e: e, k: k, pos: new T.Vector3(ACC[0] + sd * (1.9 + row * 0.78), 1.35 + 0.45 * (row % 2) + 0.15 * h(j + 3), ACC[2] + 0.3 - row * 0.35), ry: -sd * (0.3 + row * 0.1), ph: h(j + 21) * 6.28 });
    });
    g.floor.material.uniforms.uDim.value = D.ok ? 1 : 0.55;
  }

  /* ---------- per-frame ---------- */
  var _m = new T.Matrix4(), _q = new T.Quaternion(), _e = new T.Euler(), _s = new T.Vector3(), _c = new T.Color();
  function caseAt(t) { var n = S.D.cases.length; if (!n) return null; var i = Math.floor(t / CY) % n; return { i: i, c: S.D.cases[i], lt: t - Math.floor(t / CY) * CY }; }
  function emit(name, cb, info) { try { if (cb) cb(info); } catch (e) {} try { S.el.dispatchEvent(new CustomEvent(name, { detail: info })); } catch (e) {} }
  function infoFor(ci) { var c = ci.c; return { index: ci.i, total: S.D.cases.length, case_id: c.id, charge: c.charge, verdict: c.verdict, evidence: c.evidence,
      priors_same_day: c.priors, source: c.source, matched_evidence: c.match ? c.match.e.path : null, case: c.raw }; }
  function setTab(i, pos, ry, scale, colorHex, k) {
    _e.set(-0.08, ry, 0); _q.setFromEuler(_e); _s.set(scale, scale, scale); _m.compose(pos, _q, _s); _c.setHex(colorHex).multiplyScalar(Math.min(k, 1.3) * 0.2);
    var g = S.g, P = g.tabs.geometry.attributes.position.array, Cc = g.tabs.geometry.attributes.color.array, B = g.tabBase, o = i * g.tabVN * 3, v = new T.Vector3();
    for (var j = 0; j < g.tabVN; j++) { v.set(B[j * 3], B[j * 3 + 1], B[j * 3 + 2]).applyMatrix4(_m); P[o + j * 3] = v.x; P[o + j * 3 + 1] = v.y; P[o + j * 3 + 2] = v.z;
      var edge = (Math.abs(B[j * 3]) > 0.3 || Math.abs(B[j * 3 + 1]) > 0.42) ? 1 : 1; Cc[o + j * 3] = _c.r * edge; Cc[o + j * 3 + 1] = _c.g * edge; Cc[o + j * 3 + 2] = _c.b * edge; }
    var gp = S.g.tabGlow.geometry.attributes; gp.position.setXYZ(i, pos.x, pos.y, pos.z + 0.02); gp.aA.setX(i, Math.min(k, 1.3) * 0.35);
  }
  function frame(t) {
    var g = S.g, D = S.D, ci = caseAt(t), tm = t, i;
    g.flames.material.uniforms.uTime.value = tm;
    var flick = 0;
    g.sconceL.forEach(function (s) { var f = 0.86 + 0.09 * Math.sin(tm * 7.3 + s.ph) + 0.05 * Math.sin(tm * 12.9 + s.ph * 1.7); s.l.intensity = 1.1 * f; flick += f / 4; });
    g.floor.material.uniforms.uFlick.value = flick;
    Object.keys(g.accMeshes).forEach(function (k) { g.accMeshes[k].grp.visible = false; });
    g.cage.visible = false; g.link.material.opacity = 0; g.priors.visible = false; g.core.material.opacity = 0;
    g.wave.material.opacity = 0; g.wave2.material.opacity = 0; g.benchFlash.material.opacity = 0; g.medFlash.material.opacity = 0; g.halo.material.opacity = 0; g.ring.material.opacity = 0;
    var tilt = 0, lt = 0, c = null, pulse = 0, accK = 0, ev = 0, dolly = 0;
    if (ci) {
      c = ci.c; lt = ci.lt;
      if (ci.i !== S.lastCase) {
        S.lastCase = ci.i; S.struck = false; c.match = null;
        if (c.evidence) for (i = 0; i < g.slabList.length; i++) if (g.slabList[i].e.re.test(c.evidence)) { c.match = g.slabList[i]; break; }
        emit("orbcourt:case", S.opts.onCase, infoFor(ci));
      }
      if (lt >= T_STRIKE && !S.struck) { S.struck = true; if (c.verdict) emit("orbcourt:verdict", S.opts.onVerdict, infoFor(ci)); }
      var shape = SHAPES[c.charge] || ["oct", "ico", "tet", "dod"][hs(c.charge || c.id) % 4], am = g.accMeshes[shape];
      var tint = TINTS[c.charge] || C.charge, ph = (hs(c.fp || c.id) % 628) / 100;
      var land = sm(lt / T_LAND), fade = 1 - sm((lt - T_FADE) / (CY - T_FADE)), strikeK = lt >= T_STRIKE ? Math.exp(-(lt - T_STRIKE) * 2.2) : 0;
      am.grp.visible = true; am.edge.material.color.setHex(tint); am.mat.uniforms.uColor.value.setHex(C.holo).lerp(_c.setHex(tint), 0.45);
      am.mat.uniforms.uTime.value = tm; am.mat.uniforms.uGlow.value = 1.0 * land * fade; am.edge.material.opacity = 0.85 * land * fade;
      var y = 1.85 + 0.05 * Math.sin(tm * 1.5 + ph);
      g.acc.position.set(ACC[0], y, ACC[2]); g.acc.rotation.set(0.3 * Math.sin(ph), tm * 0.45 + ph, 0.15);
      g.acc.scale.setScalar((0.2 + 0.8 * land) * (1 + 0.12 * strikeK));
      g.core.position.copy(g.acc.position); g.core.material.color.setHex(tint); g.core.material.opacity = 0.35 * land * fade;
      g.ring.material.opacity = 0.55 * land * fade; accK = 0.8 * land * fade; g.floor.material.uniforms.uAccC.value.setHex(tint);
      if (c.priors !== null && c.priors > 0) {
        var np = Math.min(MAX_PRIORS, c.priors), pa = g.priors.geometry.attributes.position.array;
        for (i = 0; i < np; i++) { var a = i / np * Math.PI * 2 + tm * 0.7, rr = 0.8 + 0.1 * Math.sin(i * 2.3); pa[i * 3] = ACC[0] + Math.cos(a) * rr * 1.3; pa[i * 3 + 1] = y + 0.2 * Math.sin(a * 2 + i); pa[i * 3 + 2] = ACC[2] + Math.sin(a) * rr * 1.3; }
        g.priors.geometry.attributes.position.needsUpdate = true; g.priors.geometry.setDrawRange(0, np); g.priors.visible = true; g.priors.material.opacity = 0.75 * land * fade;
      }
      ev = sm((lt - T_EVID) / 0.8) * fade;
      g.cage.visible = c.restricted && land > 0.5;
      if (c.verdict) {
        var tot = D.total !== null ? D.total : 1, ap = D.appeals !== null ? D.appeals : 0;
        tilt = (0.08 + 0.16 * (tot - ap) / Math.max(1, tot + ap)) * sm((lt - T_TILT) / 1.6) * (lt > T_FADE ? 1 - sm((lt - T_FADE) / 0.7) : 1);
        if (lt >= T_STRIKE) {
          var w = (lt - T_STRIKE) / 2.2;
          if (w <= 1) { g.wave.scale.setScalar(0.6 + w * 3.0); g.wave.material.opacity = 0.0;
            var w2 = cl(w * 1.15, 0, 1); g.wave2.scale.setScalar(1.0 + w2 * 5.5); g.wave2.material.opacity = 0.8 * (1 - w2); }
          pulse = strikeK; g.benchFlash.material.opacity = 0.55 * strikeK; g.medFlash.material.opacity = 0.45 * strikeK;
          if (c.verdict === "PROBATION") g.halo.material.opacity = 0.5 * sm((lt - T_STRIKE - 0.4) / 0.6) * fade;
        }
      }
      if (g.sectors) { var ca = g.sectors.geometry.attributes.color; g.sectorInfo.forEach(function (s) { var kk = s.k === c.charge ? s.base + 0.6 * ev : s.base * 0.6;
          for (var v = s.r[0]; v < s.r[1]; v++) ca.setXYZ(v, s.tint.r * kk, s.tint.g * kk, s.tint.b * kk); }); ca.needsUpdate = true; }
      dolly = sm((lt - 0.2) / 4.8) * (1 - sm((lt - 6.9) / 2.0));
    } else if (g.sectors) { var ca2 = g.sectors.geometry.attributes.color; g.sectorInfo.forEach(function (s) { for (var v = s.r[0]; v < s.r[1]; v++) ca2.setXYZ(v, s.tint.r * s.base * 0.4, s.tint.g * s.base * 0.4, s.tint.b * s.base * 0.4); }); ca2.needsUpdate = true; }
    // evidence tablets
    var n = g.slabList.length;
    g.slabList.forEach(function (s, j) {
      var hit = c && c.match === s ? ev : 0, p = s.pos.clone(); p.y += 0.04 * Math.sin(tm * 0.8 + s.ph);
      var k = ci ? (0.35 + 0.65 * s.k) * (0.45 + 0.55 * ev) + 1.2 * hit : 0.15 + 0.25 * s.k;
      setTab(j, p, s.ry, 0.65 + 0.5 * s.k, C.evid, k);
    });
    if (c && c.evidence) { var op = new T.Vector3(ACC[0] + 1.05, 1.0 + 0.6 * ev, ACC[2] + 0.9); setTab(n, op, -0.25, 0.9, C.evid, 1.4 * ev);
      if (c.match) { var lp = g.link.geometry.attributes.position.array, mp = c.match.pos; lp[0] = op.x; lp[1] = op.y; lp[2] = op.z; lp[3] = mp.x; lp[4] = mp.y; lp[5] = mp.z;
        g.link.geometry.attributes.position.needsUpdate = true; g.link.material.opacity = 0.55 * ev; } }
    else setTab(n, new T.Vector3(0, -50, 0), 0, 0.01, 0, 0);
    g.tabs.geometry.attributes.position.needsUpdate = true; g.tabs.geometry.attributes.color.needsUpdate = true; g.tabs.geometry.setDrawRange(0, (n + 1) * g.tabVN);
    g.tabGlow.geometry.attributes.position.needsUpdate = true; g.tabGlow.geometry.attributes.aA.needsUpdate = true; g.tabGlow.geometry.setDrawRange(0, n + 1);
    // scales tilt (+ = left / charge pan down); appeal = green glow on the right pan
    g.beam.rotation.z = tilt; g.pans.forEach(function (p) { p.hang.rotation.z = -tilt; });
    g.pans[0].glow.material.opacity = 0.7 * (tilt > 0 ? tilt / 0.24 : 0);
    var appeal = (c && c.appeal != null) ? 1 : (D.appeals !== null && D.appeals > 0 ? Math.min(1, 0.3 + Math.log(1 + D.appeals) / 3) : 0);
    g.pans[1].glow.material.opacity = 0.8 * appeal;
    g.benchL.intensity = 1.4 + 5.0 * pulse; g.medL.intensity = 1.2 + 3.0 * pulse;
    g.hallMats.gold.emissiveIntensity = 1 + 1.2 * pulse;
    var fu = g.floor.material.uniforms; fu.uPulse.value = pulse; fu.uAccK.value = accK;
    // per_day downlights breathe subtly (deterministic)
    for (i = 0; i < 7; i++) fu.uDay.value[i] = S.dayK[i] * (0.94 + 0.06 * Math.sin(tm * 0.6 + i * 0.9));
    // camera: one-point perspective down the aisle; dolly toward the bench each case, then back
    var asp = S.w / Math.max(1, S.h), port = asp < 1;
    var z0 = port ? 12.6 : 12.0, z1 = port ? 3.8 : 3.4;
    var cz = z0 + (z1 - z0) * dolly, cy = (port ? 3.1 : 3.2) - 0.5 * dolly;
    S.cam.position.set(0.08 * Math.sin(tm * 0.07), cy, cz);
    S.cam.lookAt(0, 2.5 + 0.1 * dolly, -16);
  }

  /* ---------- loop / lifecycle ---------- */
  function render() { S.ren.render(S.scene, S.cam); S.tri = S.ren.info.render.triangles; S.calls = S.ren.info.render.calls; }
  function drawOnce() { if (!S) return; frame(S.reduced ? (S.redT || 0) : S.wt); render(); }
  function tick() {
    if (!S || !S.running) return; S.raf = requestAnimationFrame(tick);
    var now = performance.now(), dt = Math.min(0.1, (now - (S.lt || now)) / 1000); S.lt = now; S.wt += dt;
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
    clearTimeout(S.redTimer); if (!S.D.cases.length) { S.redT = T_REDUCED; drawOnce(); return; }
    S.redT = S.redIdx * CY + T_REDUCED; drawOnce();
    if (!S.hidden && S.inView) S.redTimer = setTimeout(function () { S.redIdx = (S.redIdx + 1) % Math.max(1, S.D.cases.length); reducedStep(); }, CY * 1000);
  }
  function overlay(on) {
    if (on && !S.ov) {
      var o = document.createElement("div"), lang = (document.documentElement.lang || "ru").slice(0, 2).toLowerCase();
      o.textContent = lang === "en" ? "NO DATA" : lang === "de" ? "KEINE DATEN" : "НЕТ ДАННЫХ";
      o.style.cssText = "position:absolute;left:0;right:0;top:38%;text-align:center;color:#d4a85a;opacity:.85;font:600 14px/1 system-ui,sans-serif;letter-spacing:.3em;pointer-events:none;text-shadow:0 0 8px #000";
      S.el.appendChild(o); S.ov = o;
    } else if (!on && S.ov) { S.ov.remove(); S.ov = null; }
  }
  function resize() {
    var w = S.el.clientWidth || 640, hh = S.el.clientHeight || 360; S.w = w; S.h = hh;
    S.ren.setSize(w, hh, false); S.cam.aspect = w / hh; S.cam.fov = w / hh < 1 ? 64 : 46; S.cam.updateProjectionMatrix(); drawOnce();
  }
  window.OrbCourt3D = {
    init: function (el, opts) {
      if (S) this.destroy(); if (!T || !el) return false;
      var cv = document.createElement("canvas"), ctx;
      try { ctx = cv.getContext("webgl", { antialias: true, alpha: false }) || cv.getContext("experimental-webgl"); } catch (e) { ctx = null; }
      if (!ctx) return false;
      var ren; try { ren = new T.WebGLRenderer({ canvas: cv, context: ctx, antialias: true }); } catch (e) { return false; }
      S = { el: el, opts: opts || {}, ren: ren, scene: new T.Scene(), cam: new T.PerspectiveCamera(46, 16 / 9, 0.1, 80), D: parse(null), wt: 0, lastCase: -1, g: {},
        hidden: document.hidden, inView: true, running: false, fps: 0, fc: 0, fpsT: 0, tri: 0, calls: 0, redIdx: 0 };
      S.pr = Math.min(2, window.devicePixelRatio || 1); ren.setPixelRatio(S.pr); ren.setClearColor(C.bg, 1);
      ren.outputEncoding = T.sRGBEncoding; ren.toneMapping = T.ACESFilmicToneMapping; ren.toneMappingExposure = 1.0; ren.physicallyCorrectLights = false;
      cv.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y"; if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.insertBefore(cv, el.firstChild); S.cv = cv; S.scene.fog = new T.Fog(0x050404, 14, 34);
      buildHall(); buildHolo(); rebuildData();
      var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
      S.reduced = S.opts.reduced === true || !!(mq && mq.matches);
      if (mq && mq.addEventListener && S.opts.reduced !== true) { S.onMq = function () { S.reduced = mq.matches; sched(); }; mq.addEventListener("change", S.onMq); S.mq = mq; }
      S.onVis = function () { S.hidden = document.hidden; sched(); }; document.addEventListener("visibilitychange", S.onVis);
      if (window.IntersectionObserver) { S.io = new IntersectionObserver(function (e) { S.inView = e[0].isIntersecting; sched(); }, { threshold: 0.01 }); S.io.observe(el); }
      if (window.ResizeObserver) { S.ro = new ResizeObserver(resize); S.ro.observe(el); } else { S.onRs = resize; window.addEventListener("resize", resize); }
      resize(); sched(); return true;
    },
    update: function (court, feed) { if (!S) return; S.D = parse(court, feed); S.lastCase = -1; S.redIdx = 0; rebuildData(); overlay(!S.D.ok); sched(); drawOnce(); },
    show: function (i) { if (!S || !S.D.cases.length) return; var n = S.D.cases.length; S.wt = (((i | 0) % n) + n) % n * CY; S.redIdx = Math.floor(S.wt / CY); if (S.reduced) reducedStep(); else drawOnce(); },
    seek: function (sec) { if (!S) return; S.wt = Math.max(0, +sec || 0); var rd = S.reduced; S.reduced = false; drawOnce(); S.reduced = rd; },
    stats: function () {
      if (!S) return null; var ci = caseAt(S.wt);
      return { cases: S.D.cases.length, case: ci ? ci.c.id : null, cycle_s: CY, ok: S.D.ok, slabs: S.g.slabList.length, per_day: !!S.D.perDay,
        triangles: S.tri, calls: S.calls, fps: S.fps, running: S.running, reduced: S.reduced, pixelRatio: S.pr };
    },
    destroy: function () {
      if (!S) return; S.running = false; cancelAnimationFrame(S.raf); clearTimeout(S.redTimer);
      document.removeEventListener("visibilitychange", S.onVis); S.io && S.io.disconnect(); S.ro && S.ro.disconnect();
      if (S.onRs) window.removeEventListener("resize", S.onRs); if (S.mq && S.onMq) S.mq.removeEventListener("change", S.onMq);
      S.scene.traverse(function (x) { if (x.geometry) x.geometry.dispose(); if (x.material) { if (x.material.map) x.material.map.dispose(); x.material.dispose(); } });
      GLOW_TEX = null; S.ren.dispose(); S.cv.remove(); overlay(false); S = null;
    }
  };
})();
