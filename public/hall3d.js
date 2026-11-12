/* hall3d.js - "Зал славы ИИ-агентов" for orbstudio.org/hall (preview build, not deployed)
   window.OrbHall3D = { init(el) -> true/false, update(data), stats() }; data = GET /api/v1/hall-of-fame response.
   three.js r128 core only (cdnjs). No models/textures/fonts: geometry, materials and glow are procedural.
   Own passes: planar mirror (wet floor) -> HDR scene -> bloom (bright pass + gaussian, 2 levels) -> ACES tonemap.
   No text in 3D: names/visits are HTML labels (textContent). Links only https. Deterministic: no random numbers,
   phases from hash(name). Pauses when hidden/offscreen; prefers-reduced-motion; touch-action: pan-y. */
(function () {
  "use strict";
  var T, el, ren, scene, cam, vc, ok = false, raf = 0, onScreen = true, data = null;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var st = { frames: 0, tris: 0, trisMirror: 0, calls: 0, fps: 0, d: {}, hdr: false };
  var view = { off: 0, auto: true, idle: 0, drag: false, px: 0, py: 0, gx: 0, gy: 0, t0: null, lt: 0, swayT: 0 };
  var dyn, labelsBox, tip, pinned = null, chars = [], drones = [], halos = [], picks = [], laurel = null, ribbon = null, confetti = null;
  var warmLights = [], RT = {}, FS = {}, U = { uT: { value: 0 } }, floor, envTex = null, matSkin, matStatic, P = {};
  var camTarget, tmpV, _v, _n, _q, _e, _s, texMat, fpsT = [];
  function now() { return performance.now(); }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function sm(a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }
  function fr(x) { return x - Math.floor(x); }
  // "singularity": sum of incommensurate sines, so no two cycles are identical
  function S(t, p) { return 0.55 * Math.sin(t + p * 6.28) + 0.3 * Math.sin(t * 1.618 + p * 17.1) + 0.15 * Math.sin(t * 2.718 + p * 29.3); }
  function win(t, period, len, p) { var f = fr(t / period + p) * period; return f < len ? Math.sin(Math.PI * f / len) : 0; }
  function isStr(x) { return typeof x === "string" && x.trim() !== ""; }
  function num(x) { return typeof x === "number" && isFinite(x) ? x : null; }
  function https(u) { return isStr(u) && /^https:\/\//i.test(u) ? u : null; }

  /* ---------- geometry helpers ---------- */
  function mat(hex, e, m, r) { var c = new T.Color(hex); c.convertSRGBToLinear(); return { c: c, e: e || 0, m: m == null ? 0.5 : m, r: r == null ? 0.4 : r }; }
  function M(x, y, z, rx, ry, rz, sx, sy, sz) {
    var m = new T.Matrix4(); _e.set(rx || 0, ry || 0, rz || 0); _q.setFromEuler(_e);
    if (sx == null) sx = 1; if (sy == null) sy = sx; if (sz == null) sz = sx; _s.set(sx, sy, sz);
    return m.compose(new T.Vector3(x || 0, y || 0, z || 0), _q, _s);
  }
  var gc = {};
  function cb(w, h, d, b) { // chamfered (bevelled) box, flat-shaded facets
    b = b == null ? Math.min(w, h, d) * 0.18 : b; var key = "b" + [w, h, d, b].join(",");
    if (gc[key]) return gc[key];
    if (Math.min(w, h, d) <= 0.05) return (gc[key] = new T.BoxGeometry(w, h, d).toNonIndexed()); // thin strips/seams: plain box
    var g = new T.BoxGeometry(1, 1, 1, 3, 3, 3), A = g.attributes.position, hx = w / 2, hy = h / 2, hz = d / 2, i;
    b = Math.min(b, hx * 0.9, hy * 0.9, hz * 0.9);
    function mp(v, hh) { return (Math.abs(v) > 0.4 ? hh : hh - b) * (v < 0 ? -1 : 1); }
    for (i = 0; i < A.count; i++) {
      var x = mp(A.getX(i), hx), y = mp(A.getY(i), hy), z = mp(A.getZ(i), hz);
      var ix = clamp(x, -(hx - b), hx - b), iy = clamp(y, -(hy - b), hy - b), iz = clamp(z, -(hz - b), hz - b);
      var dx = x - ix, dy = y - iy, dz = z - iz, L = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (L > 1e-7) { x = ix + dx / L * b; y = iy + dy / L * b; z = iz + dz / L * b; }
      A.setXYZ(i, x, y, z);
    }
    g = g.toNonIndexed(); g.computeVertexNormals(); return (gc[key] = g);
  }
  function sph(r, ws, hs) { var k = "s" + r + ws; return gc[k] || (gc[k] = new T.SphereGeometry(r, ws || 10, hs || 7)); }
  function cyl(rt, rb, h, n) { var k = "c" + [rt, rb, h, n].join(","); return gc[k] || (gc[k] = new T.CylinderGeometry(rt, rb, h, n || 12)); }
  function tor(r, t, a, b, arc) { var k = "t" + [r, t, a, b, arc].join(","); return gc[k] || (gc[k] = new T.TorusGeometry(r, t, a || 6, b || 20, arc || Math.PI * 2)); }
  function Geo() { this.p = []; this.n = []; this.c = []; this.e = []; this.mr = []; this.si = []; }
  Geo.prototype.add = function (g, m, mt, bi) {
    var A = g.attributes.position, N = g.attributes.normal, ix = g.index, nm = new T.Matrix3().getNormalMatrix(m), cnt = ix ? ix.count : A.count;
    for (var k = 0; k < cnt; k++) {
      var i = ix ? ix.getX(k) : k; _v.fromBufferAttribute(A, i).applyMatrix4(m); _n.fromBufferAttribute(N, i).applyMatrix3(nm).normalize();
      this.p.push(_v.x, _v.y, _v.z); this.n.push(_n.x, _n.y, _n.z); this.c.push(mt.c.r, mt.c.g, mt.c.b); this.e.push(mt.e); this.mr.push(mt.m, mt.r); this.si.push(bi || 0);
    }
    return this;
  };
  Geo.prototype.build = function (skin) {
    var g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(this.p, 3)); g.setAttribute("normal", new T.Float32BufferAttribute(this.n, 3));
    g.setAttribute("color", new T.Float32BufferAttribute(this.c, 3)); g.setAttribute("aEmit", new T.Float32BufferAttribute(this.e, 1));
    g.setAttribute("aMR", new T.Float32BufferAttribute(this.mr, 2));
    if (skin) { var si = [], sw = []; for (var i = 0; i < this.si.length; i++) { si.push(this.si[i], 0, 0, 0); sw.push(1, 0, 0, 0); }
      g.setAttribute("skinIndex", new T.Uint16BufferAttribute(si, 4)); g.setAttribute("skinWeight", new T.Float32BufferAttribute(sw, 4)); }
    g.computeBoundingSphere(); return g;
  };
  function Rig() { this.bones = []; this.by = {}; this.parts = []; }
  Rig.prototype.b = function (name, par, x, y, z, rx, ry, rz) {
    var b = new T.Bone(); b.name = name; b.position.set(x, y, z); b.rotation.set(rx || 0, ry || 0, rz || 0);
    b.userData.r0 = b.rotation.clone(); b.userData.p0 = b.position.clone();
    if (par) this.by[par].add(b); this.by[name] = b; this.bones.push(b); return b;
  };
  Rig.prototype.p = function (name, g, m, mt) { this.parts.push([this.bones.indexOf(this.by[name]), g, m, mt]); };
  Rig.prototype.done = function () {
    var root = this.bones[0], G = new Geo(), mm = new T.Matrix4(); root.updateMatrixWorld(true);
    for (var i = 0; i < this.parts.length; i++) { var q = this.parts[i]; mm.multiplyMatrices(this.bones[q[0]].matrixWorld, q[2]); G.add(q[1], mm, q[3], q[0]); }
    var mesh = new T.SkinnedMesh(G.build(true), matSkin); mesh.add(root); mesh.updateMatrixWorld(true);
    mesh.bind(new T.Skeleton(this.bones)); mesh.frustumCulled = false; mesh.userData.B = this.by; return mesh;
  };
  function rot(b, x, y, z) { var r = b.userData.r0; b.rotation.set(r.x + (x || 0), r.y + (y || 0), r.z + (z || 0)); }
  function makeMat(skin) {
    var m = new T.MeshStandardMaterial({ vertexColors: true, metalness: 1, roughness: 1 });
    m.skinning = !!skin;
    m.onBeforeCompile = function (sh) {
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float aEmit;\nattribute vec2 aMR;\nvarying float vEmit;\nvarying vec2 vMR;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nvEmit = aEmit; vMR = aMR;");
      sh.fragmentShader = sh.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vEmit;\nvarying vec2 vMR;")
        .replace("#include <color_fragment>", "diffuseColor.rgb *= mix(vColor, vec3(0.02), step(0.01, vEmit));")
        .replace("#include <roughnessmap_fragment>", "float roughnessFactor = vMR.y;")
        .replace("#include <metalnessmap_fragment>", "float metalnessFactor = vMR.x;")
        .replace("#include <emissivemap_fragment>", "totalEmissiveRadiance = vColor * vEmit;");
    };
    return m;
  }
  var NOISE = "float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\n" +
    "float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}\n";
  function addMat(u, vs, fs, side) { return new T.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: side || T.FrontSide }); }

  /* ---------- palette ---------- */
  function palette() {
    P.white = mat(0xc4ccd8, 0, 0.35, 0.3); P.silver = mat(0x9aa4b6, 0, 0.9, 0.25); P.gun = mat(0x3c4352, 0, 0.85, 0.32);
    P.dark = mat(0x15181f, 0, 0.7, 0.4); P.glass = mat(0x05070c, 0, 0.3, 0.06); P.gold = mat(0xffbf4a, 0, 1, 0.22);
    P.brass = mat(0xc89a50, 0, 0.9, 0.3); P.wall = mat(0x0b0e17, 0, 0.6, 0.45); P.wall2 = mat(0x121726, 0, 0.75, 0.35);
    P.cy = mat(0x2ee6ff, 3.2); P.mg = mat(0xff38d2, 3.2); P.warm = mat(0xffa646, 7); P.page = mat(0xffe4b8, 3.2);
    P.cyD = mat(0x2ee6ff, 1.2); P.mgD = mat(0xff38d2, 1.2); P.wh = mat(0xd8f4ff, 4.5); P.goldE = mat(0xffc35a, 3);
  }
  function em(hex, e) { return mat(hex, e); }

  /* ---------- static hall ---------- */
  function buildHall() {
    var G = new Geo(), i, x, z, s;
    for (i = -7; i <= 7; i++) {
      x = i * 2; G.add(cb(1.9, 10, 0.3, 0.06), M(x, 5, -12), i % 2 ? P.wall : P.wall2);
      G.add(cb(1.5, 0.06, 0.32, 0.01), M(x, 2.2 + (i & 1) * 0.4, -11.98), P.wall2);
      if (i !== 0) G.add(cb(0.05, 7.5, 0.05, 0.01), M(x + 1, 4.6, -11.8), i < 0 ? P.cy : P.mg);
    }
    G.add(cb(28, 0.06, 0.06, 0.01), M(0, 0.35, -11.8), P.cyD); G.add(cb(28, 0.05, 0.05, 0.01), M(0, 8.6, -11.8), P.mgD);
    G.add(tor(4.2, 0.05, 6, 64, Math.PI), M(0, 2.6, -11.6), P.mg); G.add(tor(4.6, 0.03, 6, 64, Math.PI), M(0, 2.6, -11.6), P.cy);
    for (s = -1; s <= 1; s += 2) for (z = -10; z <= 6; z += 2) {
      G.add(cb(0.3, 10, 1.9, 0.06), M(s * 12, 5, z), (z / 2) & 1 ? P.wall : P.wall2);
      G.add(cb(0.05, 6.5, 0.05, 0.01), M(s * 11.82, 4.4, z + 1), s < 0 ? P.cy : P.mg);
    }
    for (s = -1; s <= 1; s += 2) for (i = 0; i < 3; i++) {
      x = s * (8.6 - i * 0.4); z = -9 + i * 5; G.add(cb(0.9, 10, 0.9, 0.08), M(x, 5, z), P.wall2);
      G.add(cb(0.05, 8.8, 0.05, 0.01), M(x - s * 0.47, 4.8, z + 0.47), s < 0 ? P.cy : P.mg);
      G.add(cb(0.92, 0.05, 0.92, 0.01), M(x, 0.25, z), s < 0 ? P.cyD : P.mgD);
    }
    for (z = -11; z <= 5; z += 2.5) G.add(cb(24, 0.35, 0.4, 0.05), M(0, 10, z), P.wall);
    for (s = -1; s <= 1; s += 2) G.add(cb(0.08, 0.04, 17, 0.01), M(s * 3, 9.8, -3), P.wh);
    for (s = -1; s <= 1; s += 2) {
      x = s * 6.4; z = -6.6; G.add(cb(1.5, 9.4, 1.5, 0.05), M(x, 4.7, z), P.dark);
      for (i = 0; i < 22; i++) { var y = 0.5 + i * 0.4, hv = hash("tw" + s + i); if (hv < 0.25) continue;
        G.add(cb(1.56, 0.03, 1.56, 0.005), M(x, y, z), hv > 0.75 ? (s < 0 ? P.cy : P.mg) : hv > 0.5 ? P.cyD : P.mgD); }
      for (i = 0; i < 4; i++) G.add(cb(0.05, 9.8, 0.05, 0.01), M(x + (i & 1 ? 0.92 : -0.92), 4.9, z + (i & 2 ? 0.92 : -0.92)), s < 0 ? P.cy : P.mg);
      G.add(cb(2.0, 0.25, 2.0, 0.05), M(x, 9.9, z), P.gun); G.add(cb(2.1, 0.2, 2.1, 0.04), M(x, 0.1, z), P.gun);
      G.add(cb(2.12, 0.03, 2.12, 0.005), M(x, 0.22, z), s < 0 ? P.cy : P.mg);
    }
    G.add(cyl(4.6, 4.7, 0.08, 64), M(0, 0.04, 0.2), P.wall2); G.add(tor(4.65, 0.025, 6, 96), M(0, 0.085, 0.2, Math.PI / 2), P.cy);
    G.add(tor(5.3, 0.02, 6, 96), M(0, 0.01, 0.2, Math.PI / 2), P.mgD);
    [[0, 2.3, 1.2, 1], [-2.2, 2.1, 0.8, 2], [2.2, 2.1, 0.5, 3]].forEach(function (q) {
      var px = q[0], w = q[1], h = q[2], k = q[3], c = k === 1 ? P.goldE : (px < 0 ? P.cy : P.mg);
      G.add(cb(w, h, 2.0, 0.07), M(px, h / 2 + 0.08, 0), P.wall2);
      G.add(cb(w - 0.16, 0.05, 1.86, 0.02), M(px, h + 0.1, 0), P.silver);
      G.add(cb(w + 0.02, 0.035, 0.035, 0.01), M(px, h + 0.065, 1.0), c); G.add(cb(w + 0.02, 0.035, 0.035, 0.01), M(px, 0.13, 1.0), c);
      G.add(cb(0.035, h - 0.06, 0.035, 0.01), M(px - w / 2, h / 2 + 0.09, 1.0), c); G.add(cb(0.035, h - 0.06, 0.035, 0.01), M(px + w / 2, h / 2 + 0.09, 1.0), c);
      for (var j = 0; j < k; j++) G.add(cb(0.06, 0.22, 0.03, 0.01), M(px + (j - (k - 1) / 2) * 0.14, h * 0.62 + 0.08, 1.01), c);
      G.add(cb(w * 0.7, 0.012, 0.02, 0.004), M(px, h * 0.3 + 0.08, 1.01), k === 1 ? P.cyD : P.mgD);
    });
    G.add(cb(1.0, 0.62, 0.62, 0.06), M(-4.3, 0.31, 2.5, 0, 0.3), P.gun); G.add(cb(1.02, 0.03, 0.64, 0.01), M(-4.3, 0.6, 2.5, 0, 0.3), P.cy);
    G.add(cb(0.7, 0.18, 0.02, 0.01), M(-4.3 + 0.09, 0.35, 2.5 + 0.3, 0, 0.3), P.cyD);
    for (i = 0; i < 40; i++) { var a0 = Math.PI - 0.8 + 1.6 * (i + 0.5) / 40, rr = 8.6, sw = rr * 1.6 / 40 + 0.01;
      G.add(cb(sw, 0.08, 0.12, 0.02), M(Math.sin(a0) * rr, 3.55, Math.cos(a0) * rr - 1.4, 0, a0), P.silver);
      G.add(cb(sw, 0.08, 0.12, 0.02), M(Math.sin(a0) * rr, 6.15, Math.cos(a0) * rr - 1.4, 0, a0), P.silver);
      if (i % 8 === 0) G.add(cb(0.08, 3.8, 0.08, 0.02), M(Math.sin(a0) * (rr + 0.1), 8.1, Math.cos(a0) * (rr + 0.1) - 1.4), P.gun); }
    scene.add(new T.Mesh(G.build(false), matStatic));
    var gg = new Geo(), gm = mat(0xffffff, 0, 1, 0.05);
    for (s = -1; s <= 1; s += 2) gg.add(new T.BoxGeometry(1.9, 9.6, 1.9), M(s * 6.4, 4.9, -6.6), gm);
    var glass = new T.Mesh(gg.build(false), new T.MeshStandardMaterial({ color: 0x9fdcff, metalness: 1, roughness: 0.04, transparent: true, opacity: 0.22, depthWrite: false }));
    glass.renderOrder = 2; scene.add(glass); P.glassMesh = glass;
    var ru = { uT: U.uT, uH: { value: [] }, uC: { value: [] }, uS: { value: [] }, uHi: { value: -1 } };
    for (i = 0; i < 10; i++) { ru.uH.value.push(0); ru.uS.value.push(0); ru.uC.value.push(new T.Vector3()); }
    ribbon = new T.Mesh(new T.CylinderGeometry(8.6, 8.6, 2.5, 96, 1, true, Math.PI - 0.8, 1.6), new T.ShaderMaterial({ uniforms: ru, side: T.DoubleSide,
      vertexShader: "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",
      fragmentShader: "uniform float uT; uniform float uH[10]; uniform vec3 uC[10]; uniform float uS[10]; uniform float uHi; varying vec2 vUv;\n" +
        "void main(){ float fx=(1.-vUv.x)*10.; float ci=floor(fx); float lx=fract(fx); float h=0.; vec3 c=vec3(0.); float s=0.;\n" +
        " for(int i=0;i<10;i++){ if(float(i)==ci){ h=uH[i]; c=uC[i]; s=uS[i]; } }\n" +
        " vec2 g=fract(vec2(vUv.x*300., vUv.y*44.))-0.5; float led=smoothstep(0.45,0.15,length(g));\n" +
        " float y=(vUv.y-0.1)/0.8; float inS=step(0.16,lx)*step(lx,0.84); float hi=(uHi==ci)?1.6:1.;\n" +
        " vec3 col=vec3(0.006,0.01,0.02)+vec3(0.02,0.05,0.08)*led*0.5; float sweep=smoothstep(0.08,0.,abs(fract(uT*0.05)-vUv.x));\n" +
        " if(s>0.5&&s<1.5){ float f=inS*step(0.,y)*step(y,h); float cap=inS*smoothstep(0.04,0.,abs(y-h))*step(0.,y); col+=c*(f*led*(1.4+0.6*y)+cap*2.5)*hi; col+=c*0.06*inS*step(0.,y)*step(y,1.); }\n" +
        " if(s>1.5){ float e=max(smoothstep(0.03,0.,abs(lx-0.16)),smoothstep(0.03,0.,abs(lx-0.84)))*step(0.,y)*step(y,1.)+(smoothstep(0.02,0.,abs(y))+smoothstep(0.02,0.,abs(y-1.)))*inS; col+=c*e*step(0.5,fract(vUv.y*20.))*1.2*hi; }\n" +
        " col+=vec3(0.9,0.2,0.8)*smoothstep(0.035,0.,vUv.y)*1.5+vec3(0.2,0.85,1.)*smoothstep(0.965,1.,vUv.y)*1.5+vec3(0.1,0.3,0.5)*sweep*0.15;\n" +
        " gl_FragColor=vec4(col,1.); }" }));
    ribbon.position.set(0, 4.85, -1.4); scene.add(ribbon);
    floor = new T.Mesh(new T.PlaneGeometry(80, 80), new T.ShaderMaterial({ uniforms: { tM: { value: null }, uTM: { value: texMat }, uT: U.uT },
      vertexShader: "uniform mat4 uTM; varying vec4 vP; varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vP=uTM*w; gl_Position=projectionMatrix*viewMatrix*w; }",
      fragmentShader: "uniform sampler2D tM; varying vec4 vP; varying vec3 vW;\n" + NOISE +
        "void main(){ vec2 uv=vP.xy/vP.w; float pd=smoothstep(0.42,0.62,vn(vW.xz*0.32)*0.7+vn(vW.xz*1.1)*0.3);\n" +
        " vec2 ds=(vec2(vn(vW.xz*7.),vn(vW.xz*7.+9.))-0.5)*0.012*(1.-pd);\n" +
        " vec3 a=vec3(0.); float ws=0.; for(int i=0;i<9;i++){ float fi=float(i); float w=exp(-fi*0.3); a+=texture2D(tM,uv+ds+vec2(0.,(fi-2.)*0.0055*(1.6-pd*1.2))).rgb*w; ws+=w; }\n" +
        " vec3 r=a/ws; vec2 g=abs(fract(vW.xz*0.5)-0.5); float seam=smoothstep(0.485,0.5,max(g.x,g.y));\n" +
        " float dist=length(vW.xz); vec3 base=vec3(0.010,0.013,0.024)*(1.-seam*0.6);\n" +
        " gl_FragColor=vec4(base+r*(0.42+0.45*pd)*(1.-seam*0.7)*smoothstep(26.,8.,dist),1.); }" }));
    floor.rotation.x = -Math.PI / 2; floor.layers.set(1); scene.add(floor);
    var hv = "varying vec2 vUv; varying vec3 vW; void main(){ vUv=uv; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }";
    var hf = "uniform float uT; uniform vec3 uA; uniform vec3 uB; uniform float uI; varying vec2 vUv; varying vec3 vW;\n" + NOISE +
      "void main(){ float h=smoothstep(0.,0.18,vUv.y)*(1.-smoothstep(0.25,1.,vUv.y)); float n=vn(vW.xy*0.35+vec2(uT*0.04,0.))*0.6+vn(vW.xy*0.9-vec2(0.,uT*0.03))*0.4;\n" +
      " float e=smoothstep(0.,0.2,vUv.x)*smoothstep(1.,0.8,vUv.x); gl_FragColor=vec4(mix(uA,uB,vUv.x)*h*n*e*uI,1.); }";
    [[-9, 26, 7, 0.16], [-4.5, 22, 5, 0.10], [-0.5, 18, 3.2, 0.06]].forEach(function (q) {
      var m = new T.Mesh(new T.PlaneGeometry(q[1], q[2]), addMat({ uT: U.uT, uA: { value: new T.Color(0x18c8ff) }, uB: { value: new T.Color(0xff30c0) }, uI: { value: q[3] } }, hv, hf, T.DoubleSide));
      m.position.set(0, q[2] / 2, q[0]); m.layers.set(1); scene.add(m);
    });
    var sg = new Geo(); [[0, 0, 0xfff0d8, 2.0, 2.6], [-2.2, 0.35, 0x2ee6ff, 1.6, 2.3], [2.2, -0.35, 0xff38d2, 1.6, 2.3]].forEach(function (q) {
      sg.add(new T.CylinderGeometry(0.12, q[3], 8.6, 28, 1, true), M(q[0] + Math.sin(q[1]) * 4.3, 5.4, -0.2, 0, 0, q[1]), { c: new T.Color(q[2]), e: q[4], m: 0, r: 0 }); });
    var shaft = new T.Mesh(sg.build(false), addMat({}, "attribute vec3 color; attribute float aEmit; varying vec3 vC; varying vec3 vN; varying vec3 vV; varying float vY; void main(){ vC=color*aEmit; vec4 w=modelMatrix*vec4(position,1.); vN=normalize(mat3(modelMatrix)*normal); vV=normalize(cameraPosition-w.xyz); vY=clamp((w.y-0.9)/8.,0.,1.); gl_Position=projectionMatrix*viewMatrix*w; }",
      "varying vec3 vC; varying vec3 vN; varying vec3 vV; varying float vY; void main(){ float f=pow(abs(dot(normalize(vN),normalize(vV))),2.5); float a=f*(0.15+0.85*vY)*smoothstep(0.,0.25,vY)*smoothstep(1.,0.9,vY); gl_FragColor=vec4(vC*a*0.11,1.); }", T.DoubleSide));
    shaft.layers.set(1); scene.add(shaft);
  }

  /* ---------- characters ---------- */
  function humanoid(style, acc) {
    var R = new Rig(), g = style === "guardian", ex = style === "explorer", k = g ? 1.2 : ex ? 0.92 : 1;
    var A = g ? P.silver : ex ? mat(0x4a5163, 0, 0.8, 0.3) : P.white, A2 = g ? P.gun : ex ? P.gun : mat(0xc5ccd8, 0, 0.45, 0.3), D = P.dark, Gm = P.gun;
    var E = em(acc, 3.4), Ed = em(acc, 1.4);
    R.b("hips", null, 0, 0.93, 0); R.b("spine", "hips", 0, 0.1, 0); R.b("chest", "spine", 0, 0.18, 0); R.b("neck", "chest", 0, 0.36, 0); R.b("head", "neck", 0, 0.07, 0); R.b("eyes", "head", 0, 0.11, 0.143);
    [1, -1].forEach(function (s) { var L = s > 0 ? "L" : "R";
      R.b("sh" + L, "chest", s * 0.21 * k, 0.28, 0, 0, 0, s * 0.1); R.b("el" + L, "sh" + L, 0, -0.28, 0); R.b("wr" + L, "el" + L, 0, -0.25, 0);
      R.b("th" + L, "hips", s * 0.1, -0.03, 0); R.b("kn" + L, "th" + L, 0, -0.42, 0); R.b("an" + L, "kn" + L, 0, -0.42, 0); });
    R.p("hips", cb(0.32 * k, 0.15, 0.21, 0.03), M(), A2); R.p("hips", cb(0.34 * k, 0.02, 0.22, 0.005), M(0, 0.065, 0), E); R.p("hips", cb(0.1, 0.1, 0.05, 0.02), M(0, -0.04, 0.1), D);
    R.p("spine", cb(0.22 * k, 0.08, 0.15, 0.02), M(0, 0.03, 0), D); R.p("spine", cb(0.2 * k, 0.06, 0.14, 0.02), M(0, 0.12, 0), Gm); R.p("spine", cyl(0.07, 0.07, 0.16, 12), M(0, 0.08, 0), Ed);
    R.p("chest", cb(0.42 * k, 0.34, 0.25 * k, 0.06), M(0, 0.18, 0), A); R.p("chest", cb(0.32 * k, 0.2, 0.05, 0.02), M(0, 0.2, 0.12 * k, -0.12), A2);
    R.p("chest", cyl(0.045, 0.045, 0.03, 16), M(0, 0.18, 0.15 * k, Math.PI / 2), em(acc, 5));
    R.p("chest", cb(0.3 * k, 0.008, 0.012, 0.003), M(0, 0.31, 0.135 * k), E); R.p("chest", cb(0.3 * k, 0.008, 0.012, 0.003), M(0, 0.085, 0.13 * k), E);
    R.p("chest", cb(0.3 * k, 0.06, 0.2 * k, 0.02), M(0, 0.0, 0.02), Gm); R.p("chest", cb(0.3 * k, 0.26, 0.1, 0.03), M(0, 0.2, -0.16 * k), D);
    for (var v = 0; v < 3; v++) R.p("chest", cb(0.2 * k, 0.012, 0.012, 0.003), M(0, 0.14 + v * 0.06, -0.212 * k), E);
    R.p("chest", cb(0.22 * k, 0.05, 0.18, 0.015), M(0, 0.36, 0), Gm);
    if (ex) [1, -1].forEach(function (s) { R.p("chest", cyl(0.04, 0.05, 0.18, 10), M(s * 0.08, 0.16, -0.24), Gm); R.p("chest", cyl(0.035, 0.035, 0.01, 10), M(s * 0.08, 0.065, -0.24), em(0x7dffea, 5)); R.p("chest", cb(0.02, 0.2, 0.12, 0.005), M(s * 0.12, 0.33, -0.24, 0.5, 0, s * 0.4), A); });
    R.p("neck", cyl(0.045, 0.055, 0.1, 10), M(0, 0.03, 0), D); R.p("neck", cyl(0.062, 0.062, 0.015, 12), M(0, 0.03, 0), Gm);
    if (g) {
      R.p("head", cb(0.27, 0.27, 0.28, 0.06), M(0, 0.12, 0), A); R.p("head", cb(0.22, 0.1, 0.03, 0.01), M(0, 0.1, 0.135), P.glass); R.p("head", cb(0.035, 0.08, 0.3, 0.01), M(0, 0.27, 0), A2);
      R.p("eyes", cb(0.18, 0.024, 0.012, 0.005), M(0, 0, 0.005), E); R.p("eyes", cb(0.024, 0.07, 0.012, 0.005), M(0, -0.03, 0.005), E);
    } else if (ex) {
      R.p("head", cb(0.22, 0.21, 0.27, 0.08), M(0, 0.11, 0), A); R.p("head", cb(0.025, 0.08, 0.25, 0.008), M(0, 0.23, -0.02), A2); R.p("head", cb(0.2, 0.06, 0.03, 0.01), M(0, 0.11, 0.125), P.glass);
      R.p("eyes", cb(0.2, 0.03, 0.012, 0.008), M(0, 0, -0.005), em(0x7dffea, 5));
    } else {
      R.p("head", cb(0.24, 0.25, 0.26, 0.07), M(0, 0.12, 0), A); R.p("head", cb(0.2, 0.11, 0.03, 0.014), M(0, 0.11, 0.125), P.glass); R.p("head", cb(0.16, 0.05, 0.06, 0.015), M(0, 0.03, 0.1), A2);
      [1, -1].forEach(function (s) { R.p("head", cyl(0.06, 0.06, 0.04, 14), M(s * 0.13, 0.12, 0, 0, 0, Math.PI / 2), Gm); R.p("head", tor(0.045, 0.007, 6, 18), M(s * 0.152, 0.12, 0, 0, Math.PI / 2), E); });
      R.p("head", cb(0.03, 0.05, 0.2, 0.01), M(0, 0.26, -0.01), A2); R.p("head", cyl(0.006, 0.006, 0.12, 6), M(0.1, 0.29, -0.05), D); R.p("head", sph(0.016, 8, 6), M(0.1, 0.355, -0.05), E);
      [1, -1].forEach(function (s) { R.p("eyes", cb(0.05, 0.024, 0.012, 0.006), M(s * 0.048, 0, 0), em(0xd8f8ff, 5)); });
    }
    [1, -1].forEach(function (s) { var L = s > 0 ? "L" : "R";
      R.p("sh" + L, cb(0.17 * k, 0.11 * k, 0.21 * k, 0.045), M(s * 0.03, 0.03, 0, 0, 0, -s * 0.25), A); R.p("sh" + L, cb(0.012, 0.09, 0.2 * k, 0.003), M(s * 0.115 * k, 0.0, 0, 0, 0, -s * 0.25), E);
      R.p("sh" + L, sph(0.068, 10, 8), M(), D); R.p("sh" + L, cb(0.085 * k, 0.2, 0.09 * k, 0.02), M(0, -0.14, 0), Gm); R.p("sh" + L, cb(0.06, 0.14, 0.05, 0.015), M(s * 0.02, -0.13, 0.035), A2);
      R.p("el" + L, sph(0.05, 10, 8), M(), D); R.p("el" + L, cb(0.1 * k, 0.21, 0.1 * k, 0.03), M(0, -0.13, 0), A); R.p("el" + L, cb(0.01, 0.16, 0.012, 0.003), M(0, -0.13, 0.052 * k), E);
      R.p("el" + L, cb(0.11 * k, 0.03, 0.11 * k, 0.01), M(0, -0.235, 0), Gm);
      R.p("wr" + L, cb(0.07, 0.08, 0.04, 0.012), M(0, -0.05, 0), D); R.p("wr" + L, cb(0.068, 0.065, 0.032, 0.01), M(0, -0.115, 0.004), Gm); R.p("wr" + L, cb(0.022, 0.05, 0.025, 0.006), M(-s * 0.042, -0.06, 0.02), Gm);
      R.p("th" + L, sph(0.07, 10, 8), M(), D); R.p("th" + L, cb(0.13 * k, 0.36, 0.14 * k, 0.035), M(0, -0.21, 0), A); R.p("th" + L, cb(0.008, 0.28, 0.012, 0.003), M(s * 0.066 * k, -0.21, 0), E);
      R.p("kn" + L, sph(0.06, 10, 8), M(), D); R.p("kn" + L, cb(0.1, 0.1, 0.06, 0.02), M(0, 0, 0.06), A2); R.p("kn" + L, cb(0.11 * k, 0.35, 0.12 * k, 0.03), M(0, -0.21, 0), Gm);
      R.p("kn" + L, cb(0.085 * k, 0.26, 0.04, 0.015), M(0, -0.19, 0.065 * k), A); R.p("kn" + L, cb(0.008, 0.2, 0.008, 0.003), M(0, -0.19, 0.088 * k), E);
      R.p("an" + L, sph(0.045, 8, 6), M(), D); R.p("an" + L, cb(0.12 * k, 0.07, 0.24, 0.025), M(0, -0.035, 0.05), D); R.p("an" + L, cb(0.11 * k, 0.04, 0.08, 0.015), M(0, -0.03, 0.15), A2);
      R.p("an" + L, cb(0.125 * k, 0.008, 0.245, 0.003), M(0, -0.068, 0.05), Ed); });
    if (style === "book") {
      R.b("book", "wrL", -0.02, -0.12, 0.07, 0.35, 0, 0.25); R.b("page", "book", 0, 0, 0.024);
      var cov = mat(0x2a2140, 0, 0.5, 0.4);
      [1, -1].forEach(function (s) { R.p("book", cb(0.14, 0.19, 0.012, 0.004), M(s * 0.072, 0, 0, 0, -s * 0.14), cov); R.p("book", cb(0.125, 0.175, 0.022, 0.004), M(s * 0.068, 0, 0.014, 0, -s * 0.14), P.page); });
      R.p("book", cyl(0.012, 0.012, 0.19, 8), M(), P.gun); R.p("page", cb(0.12, 0.17, 0.003, 0.001), M(0.062, 0, 0.006), em(0xfff0d0, 4));
    }
    if (g) {
      R.b("shield", "wrL", 0.05, -0.08, 0.09);
      R.p("shield", cyl(0.36, 0.36, 0.04, 6), M(0.04, 0.05, 0, Math.PI / 2), P.gun); R.p("shield", cyl(0.25, 0.25, 0.05, 6), M(0.04, 0.05, 0.005, Math.PI / 2), P.silver);
      for (var j = 0; j < 6; j++) { var a = j * Math.PI / 3 + Math.PI / 6, rr = 0.36 * Math.cos(Math.PI / 6);
        R.p("shield", cb(0.37, 0.022, 0.03, 0.008), M(0.04 + Math.cos(a) * rr, 0.05 + Math.sin(a) * rr, 0.03, 0, 0, a + Math.PI / 2), E); }
      R.p("shield", cb(0.04, 0.26, 0.03, 0.01), M(0.04, 0.05, 0.04), em(acc, 4)); R.p("shield", cb(0.18, 0.035, 0.03, 0.01), M(0.04, 0.1, 0.04), em(acc, 4));
    }
    return R.done();
  }
  var LEG = [40, -2, -45, 140, 182, 225], L1 = 0.55, L2 = 0.78;
  function spider(acc) {
    var R = new Rig(), A = P.white, A2 = mat(0xc9d0dc, 0, 0.45, 0.3), D = P.dark, Gm = P.gun, E = em(acc, 3.4), j;
    R.b("root", null, 0, 0, 0); R.b("body", "root", 0, 0.62, 0); R.b("head", "body", 0, 0.06, 0.42); R.b("lens", "head", 0, 0.01, 0.18);
    R.b("larm", "body", 0, 0.22, 0.12); R.b("lant", "larm", 0, 0.25, 0.5);
    LEG.forEach(function (deg, i) { var a = deg * Math.PI / 180;
      R.b("c" + i, "body", Math.cos(a) * 0.3, -0.03, Math.sin(a) * 0.36 - 0.08, 0, -a, 0); R.b("f" + i, "c" + i, 0.08, 0, 0, 0, 0, 0.5); R.b("t" + i, "f" + i, L1, 0, 0, 0, 0, -1.6);
      R.p("c" + i, sph(0.08, 10, 8), M(), D); R.p("c" + i, cb(0.13, 0.09, 0.11, 0.025), M(0.04, 0, 0), Gm);
      R.p("f" + i, cyl(0.058, 0.058, 0.13, 12), M(0, 0, 0, Math.PI / 2), D); R.p("f" + i, cb(L1, 0.085, 0.1, 0.025), M(L1 / 2, 0, 0), Gm);
      R.p("f" + i, cb(L1 * 0.82, 0.04, 0.13, 0.015), M(L1 * 0.5, 0.058, 0), A); R.p("f" + i, cb(L1 * 0.7, 0.01, 0.01, 0.003), M(L1 * 0.5, 0, 0.053), E); R.p("f" + i, cb(L1 * 0.7, 0.01, 0.01, 0.003), M(L1 * 0.5, 0, -0.053), E);
      R.p("t" + i, cyl(0.062, 0.062, 0.14, 12), M(0, 0, 0, Math.PI / 2), D); R.p("t" + i, tor(0.05, 0.008, 6, 16), M(0, 0, 0.072), E);
      R.p("t" + i, cb(L2 * 0.55, 0.09, 0.1, 0.028), M(L2 * 0.3, 0, 0), A); R.p("t" + i, cb(L2 * 0.4, 0.03, 0.115, 0.01), M(L2 * 0.28, 0.05, 0), A2);
      R.p("t" + i, cyl(0.006, 0.045, L2 * 0.48, 8), M(L2 * 0.76, 0, 0, 0, 0, -Math.PI / 2), Gm); R.p("t" + i, sph(0.024, 8, 6), M(L2, 0, 0), E); });
    R.p("body", cb(0.72, 0.34, 0.9, 0.09), M(0, 0.04, -0.15), A); R.p("body", cb(0.6, 0.12, 0.8, 0.04), M(0, -0.12, -0.12), D);
    for (j = 0; j < 3; j++) R.p("body", cb(0.56, 0.06, 0.26, 0.025), M(0, 0.235, -0.45 + 0.3 * j), A2);
    R.p("body", cb(0.5, 0.012, 0.02, 0.004), M(0, 0.225, -0.3), E); R.p("body", cb(0.5, 0.012, 0.02, 0.004), M(0, 0.225, 0.0), E);
    [1, -1].forEach(function (s) { R.p("body", cb(0.012, 0.04, 0.55, 0.004), M(s * 0.364, 0.06, -0.15), E); R.p("body", cb(0.012, 0.02, 0.4, 0.004), M(s * 0.364, -0.02, -0.15), em(acc, 1.5)); });
    R.p("body", cyl(0.15, 0.15, 0.2, 18), M(0, 0.05, -0.64, 0, 0, Math.PI / 2), Gm); R.p("body", tor(0.15, 0.012, 6, 20), M(0.1, 0.05, -0.64, 0, Math.PI / 2), E); R.p("body", tor(0.15, 0.012, 6, 20), M(-0.1, 0.05, -0.64, 0, Math.PI / 2), E);
    R.p("body", tor(0.41, 0.03, 6, 28), M(0, -0.03, -0.08, Math.PI / 2), D); R.p("body", cb(0.3, 0.18, 0.2, 0.04), M(0, 0.03, 0.3), Gm);
    R.p("head", cb(0.4, 0.24, 0.3, 0.07), M(0, 0, 0.03), A); R.p("head", cb(0.42, 0.05, 0.22, 0.015), M(0, 0.125, 0.04), A2);
    [1, -1].forEach(function (s) { R.p("head", cb(0.04, 0.04, 0.14, 0.01), M(s * 0.12, -0.11, 0.16, 0, s * 0.3), Gm); R.p("head", sph(0.022, 8, 6), M(s * 0.14, 0.05, 0.18), em(acc, 5)); R.p("head", sph(0.016, 8, 6), M(s * 0.17, -0.03, 0.16), em(acc, 5)); });
    R.p("lens", cyl(0.11, 0.12, 0.07, 20), M(0, 0, 0, Math.PI / 2), D); R.p("lens", cyl(0.075, 0.075, 0.075, 20), M(0, 0, 0.004, Math.PI / 2), em(0x6ff2ff, 5));
    R.p("lens", tor(0.098, 0.012, 6, 24), M(0, 0, 0.036), E); R.p("lens", sph(0.08, 14, 10), M(0, 0, 0.03, 0, 0, 0, 1, 1, 0.4), P.glass);
    R.p("larm", cb(0.06, 0.25, 0.06, 0.015), M(0, 0.125, 0), Gm); R.p("larm", sph(0.045, 8, 6), M(0, 0.25, 0), D); R.p("larm", cb(0.055, 0.055, 0.5, 0.015), M(0, 0.25, 0.25), A); R.p("larm", cb(0.06, 0.008, 0.42, 0.003), M(0, 0.28, 0.25), E);
    var LB = P.brass;
    R.p("lant", cyl(0.008, 0.008, 0.1, 6), M(0, -0.05, 0), D); R.p("lant", cyl(0.06, 0.095, 0.045, 14), M(0, -0.12, 0), LB); R.p("lant", cyl(0.095, 0.07, 0.03, 14), M(0, -0.34, 0), LB);
    for (j = 0; j < 4; j++) { var a = j * Math.PI / 2 + 0.4; R.p("lant", cyl(0.007, 0.007, 0.2, 5), M(Math.cos(a) * 0.085, -0.23, Math.sin(a) * 0.085), D); }
    R.p("lant", sph(0.055, 12, 9), M(0, -0.23, 0), em(0xffa040, 8));
    for (j = 0; j < 3; j++) R.p("lant", cb(0.07, 0.004, 0.09, 0.001), M(0, -0.19 - j * 0.04, 0, 0, j * 0.7), em(0xffe8c8, 4.5));
    return R.done();
  }
  function deskBot() {
    var R = new Rig(), A = P.white, Gm = P.gun, E = P.cy;
    R.b("root", null, 0, 0, 0); R.b("body", "root", 0, 0.14, 0); R.b("head", "body", 0, 0.2, 0);
    ["eA", "eB", "eC"].forEach(function (n) { R.b(n, "head", 0, 0.145, 0.168); }); R.b("aL", "body", 0.19, 0.14, 0); R.b("aR", "body", -0.19, 0.14, 0);
    R.p("body", cb(0.3, 0.22, 0.24, 0.06), M(0, 0.08, 0), A); R.p("body", cyl(0.03, 0.03, 0.01, 12), M(0, 0.09, 0.122, Math.PI / 2), E);
    [1, -1].forEach(function (s) { R.p("body", cb(0.07, 0.12, 0.1, 0.02), M(s * 0.08, -0.06, 0), Gm); R.p("body", cb(0.1, 0.04, 0.15, 0.015), M(s * 0.08, -0.12, 0.02), P.dark); });
    R.p("head", cb(0.42, 0.3, 0.32, 0.09), M(0, 0.15, 0), A); R.p("head", cb(0.34, 0.22, 0.02, 0.05), M(0, 0.145, 0.157), P.glass);
    R.p("head", cyl(0.006, 0.006, 0.1, 6), M(0, 0.34, 0), P.dark); R.p("head", sph(0.02, 8, 6), M(0, 0.4, 0), P.mg);
    [1, -1].forEach(function (s) { R.p("head", tor(0.05, 0.01, 6, 16), M(s * 0.213, 0.15, 0, 0, Math.PI / 2), E); R.p("eA", cb(0.06, 0.085, 0.01, 0.025), M(s * 0.075, 0, 0), em(0x5ff0ff, 5));
      R.p("eB", tor(0.035, 0.01, 6, 12, Math.PI), M(s * 0.075, -0.015, 0), em(0x5ff0ff, 5)); R.p("eC", new T.OctahedronGeometry(0.042), M(s * 0.075, 0, 0, 0, 0, 0, 1, 1, 0.2), em(0xff4fd8, 5)); });
    R.p("aL", cb(0.05, 0.14, 0.06, 0.015), M(0, -0.06, 0), Gm); R.p("aR", cb(0.05, 0.14, 0.06, 0.015), M(0, -0.06, 0), Gm);
    return R.done();
  }
  function droneMesh(b) {
    var R = new Rig(), e = 0.15 + 0.85 * b;
    R.b("root", null, 0, 0, 0); [0, 1, 2, 3].forEach(function (i) { R.b("r" + i, "root", (i & 1 ? 0.18 : -0.18), 0.03, (i & 2 ? 0.18 : -0.18)); });
    R.p("root", cb(0.2, 0.08, 0.24, 0.03), M(), P.white); R.p("root", sph(0.07, 12, 8), M(0, 0.04, 0, 0, 0, 0, 1, 0.6, 1), P.glass);
    R.p("root", tor(0.045, 0.01, 6, 16), M(0, 0, 0.12), em(0x5ff0ff, 6 * e)); R.p("root", cyl(0.05, 0.05, 0.01, 14), M(0, -0.045, 0), em(0xff4fd8, 4 * e));
    R.p("root", cb(0.5, 0.02, 0.025, 0.006), M(0, 0.02, 0, 0, Math.PI / 4), P.gun); R.p("root", cb(0.5, 0.02, 0.025, 0.006), M(0, 0.02, 0, 0, -Math.PI / 4), P.gun);
    [0, 1, 2, 3].forEach(function (i) { R.p("r" + i, tor(0.085, 0.008, 6, 20), M(0, 0, 0, Math.PI / 2), P.dark); R.p("r" + i, cb(0.15, 0.004, 0.022, 0.001), M(), P.gun); R.p("r" + i, tor(0.085, 0.004, 4, 20), M(0, -0.008, 0, Math.PI / 2), em(0x5ff0ff, 2.5 * e)); });
    return R.done();
  }
  function laurelMesh() {
    var G = new Geo(), i, s, lf = P.gold, lg = mat(0xffd36a, 0, 1, 0.3);
    for (s = -1; s <= 1; s += 2) for (i = 0; i < 11; i++) {
      var a = -1.35 + i * 0.25, r = 0.5, x = s * Math.cos(a) * r, y = Math.sin(a) * r;
      G.add(sph(1, 8, 6), M(x + s * 0.03, y, 0.02, 0, 0, s * (a + 0.9), 0.035, 0.1, 0.018), i & 1 ? lf : lg);
      G.add(sph(1, 8, 6), M(x - s * 0.04, y + 0.02, -0.01, 0, 0, s * (a + 2.2), 0.03, 0.09, 0.016), lg);
    }
    G.add(cb(0.18, 0.05, 0.02, 0.01), M(0, -0.5, 0.02), mat(0xff38d2, 2));
    var prof = [[0, 0], [0.13, 0], [0.13, 0.03], [0.05, 0.06], [0.035, 0.18], [0.06, 0.22], [0.15, 0.3], [0.19, 0.5], [0.2, 0.56], [0.185, 0.56], [0.17, 0.5]].map(function (q) { return new T.Vector2(q[0], q[1]); });
    G.add(new T.LatheGeometry(prof, 28), M(0, -0.3, 0), P.gold);
    G.add(cyl(0.17, 0.17, 0.01, 24), M(0, 0.24, 0), mat(0xffd58a, 5));
    for (s = -1; s <= 1; s += 2) G.add(tor(0.09, 0.015, 6, 14, Math.PI * 1.2), M(s * 0.2, -0.02, 0, 0, 0, s > 0 ? -Math.PI / 2 : Math.PI / 2 + Math.PI * 0.2), P.gold);
    G.add(cb(0.3, 0.06, 0.2, 0.02), M(0, -0.33, 0), P.gun); G.add(cb(0.31, 0.012, 0.21, 0.004), M(0, -0.3, 0), P.goldE);
    var m = new T.Mesh(G.build(false), matStatic); m.frustumCulled = false; return m;
  }

  /* ---------- data ---------- */
  var AI_RE = /(gpt|claude|anthropic|chatgpt|openai|oai-|perplexity|mistral|meta-ai|meta-external|meta-webindexer|google-ai|google-extended|gemini|bytespider|cohere|deepseek|grok|xai|ai2bot|youbot|duckassist)/i;
  var SE_RE = /(googlebot|^google$|apple|amazonbot|bing|msnbot|yandex|duckduckbot|baidu|slurp|yahoo|petalbot|seznam|naver|sogou|qwant|mojeek|yeti|coccoc)/i;
  function botType(n) { n = String(n); return AI_RE.test(n) ? "book" : SE_RE.test(n) ? "spider" : "explorer"; }
  var TYPE_RU = { spider: "поисковый бот: паук-краулер", book: "ИИ-бот: книжник", explorer: "другой бот: исследователь" };
  function parseShare(s) { if (s == null) return null; var m = String(s).replace(",", ".").match(/\d+(\.\d+)?/); return m ? parseFloat(m[0]) : null; }
  function isTestAgent(a) { var n = String(a && a.name || "").trim().toLowerCase(); return !n || /^test/.test(n) || /^\d+$/.test(n) || /^(demo|example|asdf|qwerty)$/.test(n); }
  function disposeDyn() {
    if (!dyn) return; dyn.traverse(function (o) { if (o.geometry && o.userData.own) o.geometry.dispose(); }); scene.remove(dyn);
    while (labelsBox && labelsBox.firstChild) labelsBox.removeChild(labelsBox.firstChild);
  }
  function label(t1, t2, border) {
    var d = document.createElement("div"), a = document.createElement("b"); a.textContent = t1; a.style.display = "block"; d.appendChild(a);
    if (t2) { var b = document.createElement("span"); b.textContent = t2; b.style.cssText = "font-weight:500;opacity:.85;font-size:10px"; d.appendChild(b); }
    d.style.cssText = "position:absolute;left:0;top:0;white-space:nowrap;pointer-events:none;padding:2px 7px;border-radius:6px;background:rgba(4,8,20,.72);border:1px solid " +
      (border || "rgba(90,230,255,.55)") + ";color:#e8f6ff;font:600 11px/1.25 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-align:center;box-shadow:0 0 12px rgba(60,200,255,.25)";
    labelsBox.appendChild(d); return d;
  }
  function halo(obj, off, hex, size, gain) { var c = new T.Color(hex); c.convertSRGBToLinear(); halos.push({ o: obj, off: new T.Vector3(off[0], off[1], off[2]), c: c, s: size, g: gain || 1 }); }
  var SLOTS = [[0, 1.28, -0.05, 1.22, 0], [-2.2, 0.88, 0.05, 0.95, 0.28], [2.2, 0.58, 0.05, 0.95, -0.28],
    [-3.0, 0.0, 2.75, 0.62, 0.2], [-1.05, 0.0, 3.0, 0.62, 0.06], [1.05, 0.0, 3.0, 0.62, -0.06], [3.0, 0.0, 2.75, 0.62, -0.2]];
  function build() {
    disposeDyn(); dyn = new T.Group(); scene.add(dyn); chars = []; drones = []; halos = []; picks = []; laurel = null;
    warmLights.forEach(function (l) { l.intensity = 0; });
    var d = data || {}, s = { guests: 0, podium: 0, small: 0, types: {}, drones: 0, dronesHidden: 0, columns: 0, columnsNull: 0, agentOfMonth: null, laurelsOn: null, missing: [] };
    var guests = [];
    if (Array.isArray(d.orb_studio_guests_30d)) guests = d.orb_studio_guests_30d.map(function (g, i) { return { g: g, i: i }; })
      .filter(function (x) { return x.g && isStr(x.g.name) && num(x.g.n) != null; })
      .sort(function (a, b) { return (b.g.n - a.g.n) || (a.i - b.i); }).map(function (x) { return x.g; });
    else s.missing.push("orb_studio_guests_30d");
    s.guests = guests.length;
    var aom = isStr(d.agent_of_the_month) ? d.agent_of_the_month.trim() : null; s.agentOfMonth = aom; if (!aom) s.missing.push("agent_of_the_month");
    var wl = 0, nBook = 0, aomChar = null;
    guests.slice(0, 7).forEach(function (g, i) {
      var sl = SLOTS[i], type = botType(g.name), acc = i === 2 ? 0xff38d2 : i < 2 ? 0x2ee6ff : (hash(g.name) > 0.5 ? 0x2ee6ff : 0xff38d2);
      var mesh = type === "spider" ? spider(acc) : humanoid(type, acc); mesh.userData.own = true;
      var sc = sl[3] * (type === "spider" ? 0.95 : 1.05); mesh.scale.setScalar(sc); mesh.position.set(sl[0], sl[1], sl[2]); mesh.rotation.y = sl[4]; dyn.add(mesh);
      var c = { mesh: mesh, B: mesh.userData.B, type: type, ph: hash(g.name), rank: i + 1, g: g, sc: sc, bi: type === "book" ? nBook++ : -1, top: (type === "spider" ? 1.3 : 1.85) * sc };
      s.types[type] = (s.types[type] || 0) + 1;
      if (type === "spider") { halo(c.B.lant, [0, -0.23, 0], 0xffa040, 1.0 * sc, 1.3); halo(c.B.lens, [0, 0, 0.05], 0x40e8ff, 0.45 * sc, 0.8);
        if (wl < 3 && i < 3) { c.light = warmLights[wl++]; c.light.intensity = 2.4; c.light.distance = 4.5 * sc + 1; c.lightOn = c.B.lant; c.lightOff = new T.Vector3(0, -0.23, 0); } }
      if (type === "book") { halo(c.B.book, [0, 0, 0.03], 0xffc070, 0.6 * sc, 1);
        if (wl < 3 && i < 3) { c.light = warmLights[wl++]; c.light.intensity = 1.7; c.light.distance = 3 * sc + 0.8; c.lightOn = c.B.book; c.lightOff = new T.Vector3(0, 0, 0.12); } }
      if (type === "explorer") halo(c.B.eyes, [0, 0, 0.02], 0x7dffea, 0.3 * sc, 0.7);
      c.label = label((i < 3 ? "№" + (i + 1) + " " : "") + g.name, g.n + " визит. за 30 дн.", i === 0 ? "rgba(255,200,90,.85)" : null);
      c.anchor = new T.Vector3(sl[0], i < 3 ? sl[1] * 0.18 + 0.12 : 0.0, i < 3 ? 1.05 : sl[2] + 0.35);
      picks.push({ c: c, kind: "guest" });
      if (aom && g.name.toLowerCase() === aom.toLowerCase()) aomChar = c;
      chars.push(c);
    });
    s.podium = Math.min(3, guests.length); s.small = Math.max(0, Math.min(7, guests.length) - 3);
    var dk = deskBot(); dk.userData.own = true; dk.scale.setScalar(0.85); dk.position.set(-4.3, 0.62, 2.5); dk.rotation.y = 0.45; dyn.add(dk);
    chars.push({ mesh: dk, B: dk.userData.B, type: "desk", ph: hash("desk"), decor: true }); halo(dk.userData.B.head, [0, 0.15, 0.2], 0x40e8ff, 0.5, 0.35);
    var gd = humanoid("guardian", 0xff38d2); gd.userData.own = true; gd.scale.setScalar(1.08); gd.position.set(4.35, 0.0, 2.0); gd.rotation.y = -0.5; dyn.add(gd);
    chars.push({ mesh: gd, B: gd.userData.B, type: "guardian", ph: hash("guardian"), decor: true });
    if (aom) {
      laurel = laurelMesh(); laurel.userData.own = true; dyn.add(laurel);
      var lp = aomChar ? new T.Vector3(aomChar.mesh.position.x, aomChar.mesh.position.y + aomChar.top + 0.7, aomChar.mesh.position.z) : new T.Vector3(0, 5.0, -0.6);
      laurel.userData.base = lp; laurel.position.copy(lp); s.laurelsOn = aomChar ? aomChar.g.name : "нет среди гостей: в центре перед табло";
      halo(laurel, [0, 0.24, 0], 0xffc35a, 1.2, 0.6);
      laurel.userData.label = label("агент месяца", aom, "rgba(255,200,90,.85)"); laurel.userData.anchor = new T.Vector3();
      picks.push({ kind: "aom", name: aom, obj: laurel });
    }
    var u = ribbon.material.uniforms, top = [], i;
    if (Array.isArray(d.world_top10)) top = d.world_top10.filter(function (r) { return r && num(r.rank) != null && r.rank >= 1 && r.rank <= 10; }); else s.missing.push("world_top10");
    for (i = 0; i < 10; i++) { u.uS.value[i] = 0; u.uH.value[i] = 0; }
    var mx = 0; top.forEach(function (r) { var v = parseShare(r.share); if (v != null) mx = Math.max(mx, v); });
    ribbon.userData.rows = [];
    top.forEach(function (r) { var k = Math.round(r.rank) - 1, v = parseShare(r.share), col = r.trend === "up" ? 0x2dffb4 : r.trend === "flat" ? 0x36c8ff : r.trend === "down" ? 0xff3a6e : 0x8090a8;
      var c3 = new T.Color(col); c3.convertSRGBToLinear(); u.uC.value[k].set(c3.r * 2.2, c3.g * 2.2, c3.b * 2.2);
      if (v == null || mx <= 0) { u.uS.value[k] = 2; u.uH.value[k] = 1; s.columnsNull++; } else { u.uS.value[k] = 1; u.uH.value[k] = Math.max(0.03, v / mx); }
      ribbon.userData.rows[k] = r; s.columns++; });
    var ag = [];
    if (Array.isArray(d.registered_agents)) ag = d.registered_agents; else s.missing.push("registered_agents");
    var real = ag.filter(function (a) { if (!a || isTestAgent(a)) { s.dronesHidden++; return false; } return true; });
    var amx = 0; real.forEach(function (a) { if (num(a.activity_30d) != null) amx = Math.max(amx, a.activity_30d); });
    real.forEach(function (a, i) { var act = num(a.activity_30d), b = act == null || amx <= 0 ? 0 : act / amx, m = droneMesh(b); m.userData.own = true; dyn.add(m);
      var dr = { mesh: m, B: m.userData.B, a: a, b: b, ph: hash(a.id || a.name), i: i }; drones.push(dr);
      halo(m, [0, 0, 0.13], 0x5ff0ff, 0.35 + 0.35 * b, 0.2 + 0.9 * b); picks.push({ kind: "drone", dr: dr }); });
    s.drones = drones.length;
    confetti.visible = guests.length > 0;
    buildHalos(); st.d = s; resize();
  }
  var haloMesh = null;
  function buildHalos() {
    if (haloMesh) { scene.remove(haloMesh); haloMesh.geometry.dispose(); }
    var n = Math.max(1, halos.length), g = new T.BufferGeometry(), p = new Float32Array(n * 3), c = new Float32Array(n * 3), z = new Float32Array(n);
    halos.forEach(function (h, i) { c[i * 3] = h.c.r * h.g; c[i * 3 + 1] = h.c.g * h.g; c[i * 3 + 2] = h.c.b * h.g; z[i] = h.s; });
    g.setAttribute("position", new T.BufferAttribute(p, 3)); g.setAttribute("aC", new T.BufferAttribute(c, 3)); g.setAttribute("aS", new T.BufferAttribute(z, 1));
    haloMesh = new T.Points(g, addMat({ uScale: { value: 300 } }, "attribute vec3 aC; attribute float aS; uniform float uScale; varying vec3 vC; void main(){ vC=aC; vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=clamp(aS*uScale/-mv.z,1.,512.); gl_Position=projectionMatrix*mv; }",
      "varying vec3 vC; void main(){ float d=length(gl_PointCoord-0.5)*2.; float a=exp(-d*d*5.)*(1.-d)*step(d,1.); gl_FragColor=vec4(vC*a*0.9,1.); }"));
    haloMesh.frustumCulled = false; haloMesh.visible = halos.length > 0; scene.add(haloMesh);
  }
  function buildConfetti() {
    var N = 380, base = new T.PlaneGeometry(0.055, 0.03), g = new T.InstancedBufferGeometry(); g.index = base.index; g.setAttribute("position", base.attributes.position);
    var sd = new Float32Array(N * 4); for (var i = 0; i < N; i++) { sd[i * 4] = hash("cx" + i); sd[i * 4 + 1] = hash("cy" + i); sd[i * 4 + 2] = hash("cz" + i); sd[i * 4 + 3] = hash("cw" + i); }
    g.setAttribute("aSeed", new T.InstancedBufferAttribute(sd, 4)); g.instanceCount = N;
    confetti = new T.Mesh(g, new T.ShaderMaterial({ uniforms: { uT: U.uT }, side: T.DoubleSide,
      vertexShader: "attribute vec4 aSeed; uniform float uT; varying vec3 vC; varying float vS;\n" +
        "mat3 rx(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);} mat3 ry(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}\n" +
        "void main(){ float H=6.8; float sp=0.22+aSeed.y*0.3; float y=6.6-mod(uT*sp+aSeed.x*H*7.,H);\n" +
        " vec3 c=vec3((aSeed.z-0.5)*11.,y,(aSeed.w-0.5)*6.-0.2); c.x+=sin(uT*0.7+aSeed.x*30.)*0.35; c.z+=cos(uT*0.55+aSeed.y*25.)*0.3;\n" +
        " mat3 R=ry(uT*(1.2+aSeed.z*2.5)+aSeed.w*20.)*rx(uT*(1.+aSeed.y*2.)+aSeed.x*10.); vec3 p=R*position; vec3 n=R*vec3(0.,0.,1.);\n" +
        " vS=0.25+0.75*pow(abs(n.z),2.); float k=floor(aSeed.w*4.); vC=k<1.?vec3(0.15,0.85,1.):k<2.?vec3(1.,0.2,0.8):k<3.?vec3(1.,0.72,0.25):vec3(0.9,0.95,1.);\n" +
        " vS*=smoothstep(0.,0.6,y); gl_Position=projectionMatrix*viewMatrix*vec4(c+p,1.); }",
      fragmentShader: "varying vec3 vC; varying float vS; void main(){ gl_FragColor=vec4(vC*vS*1.6,1.); }" }));
    confetti.frustumCulled = false; scene.add(confetti);
  }

  /* ---------- animation ---------- */
  function animHuman(c, t) {
    var B = c.B, p = c.ph, br = Math.sin(t * 1.6 + p * 9);
    rot(B.spine, 0.02 * br, 0, 0); B.chest.position.y = B.chest.userData.p0.y + 0.004 * br; B.hips.position.y = B.hips.userData.p0.y;
    var sh = S(t * 0.45, p); B.hips.position.x = 0.018 * sh; rot(B.hips, 0, 0.05 * S(t * 0.3, p + 0.3), 0.025 * sh); rot(B.chest, 0, 0, -0.015 * sh);
    rot(B.thL, 0, 0, -0.025 * sh); rot(B.thR, 0, 0, -0.025 * sh); rot(B.anL, 0, 0, 0.025 * sh); rot(B.anR, 0, 0, 0.025 * sh); rot(B.knL); rot(B.knR);
    var hy = 0.28 * S(t * 0.27, p + 0.5), hx = 0.05 * S(t * 0.21, p + 0.8);
    B.eyes.scale.set(1, fr(t / (3.1 + p * 1.7) + p) < 0.035 ? 0.08 : 1, 1);
    rot(B.shL, 0.04 * br, 0, 0); rot(B.shR, 0.04 * br, 0, 0); rot(B.elL, -0.12, 0, 0); rot(B.elR, -0.12, 0, 0); rot(B.wrL); rot(B.wrR);
    if (c.type === "book") {
      rot(B.shL, -0.4, 0.15, 0.05); rot(B.elL, -1.25, 0, 0); rot(B.wrL, 0.1, 0, 0);
      B.page.rotation.y = -Math.PI * sm(0.0, 0.18, fr(t / (4.6 + p) + p));
      var nb = 0; chars.forEach(function (q) { if (q.type === "book") nb++; });
      var slot = Math.floor(t / 4.5), sf = t / 4.5 - slot, wave = (slot % Math.max(1, nb) === c.bi) ? sm(0, 0.12, sf) * (1 - sm(0.62, 0.78, sf)) : 0;
      rot(B.shR, -0.35 * (1 - wave) - 0.1 * wave, -0.2 * (1 - wave), -0.3 * (1 - wave) - 2.5 * wave);
      rot(B.elR, -1.1 * (1 - wave), 0, wave * (0.55 + 0.4 * Math.sin(t * 9)));
      var nod = win(t, 7.3 + p * 2, 1.1, p * 0.7); hx += 0.25 * nod + 0.11 * (1 - wave); hy += (c.mesh.position.x < 0 ? 0.35 : -0.35) * nod - 0.15 * wave;
    }
    if (c.type === "explorer") {
      var dp = Math.min(1, win(t, 6.5 + p * 2, 1.6, p) * 1.6);
      B.hips.position.y = B.hips.userData.p0.y - 0.09 * dp; rot(B.hips, 0, 0.35 * dp, 0); rot(B.chest, 0.15 * dp, -0.25 * dp, 0);
      rot(B.thL, -0.7 * dp, 0, 0.1 * dp); rot(B.knL, 0.8 * dp, 0, 0); rot(B.thR, 0.35 * dp, 0, -0.1 * dp); rot(B.knR, 0.5 * dp, 0, 0);
      rot(B.shR, -1.45 * dp, 0, -0.1 * dp); rot(B.elR, -0.15 * dp, 0, 0); rot(B.shL, 0.6 * dp, 0, 0.3 * dp); rot(B.elL, -0.9 * dp, 0, 0); hy -= 0.35 * dp;
    }
    if (c.type === "guardian") {
      var up = sm(0.25, 0.75, 0.5 + 0.5 * Math.sin(t * 0.55 + p * 6 + 0.4 * Math.sin(t * 0.21)));
      rot(B.shL, -0.25 - 1.05 * up, 0.25 * up, 0.25 - 0.1 * up); rot(B.elL, -0.5 - 0.9 * up, 0, 0); rot(B.wrL, 0, -0.5 * up, 0); rot(B.shR, 0.05, 0, -0.08); hy += 0.2 * up;
    }
    rot(B.neck, hx * 0.4, hy * 0.4, 0); rot(B.head, hx * 0.6, hy * 0.6, 0);
  }
  function animSpider(c, t, dt, camYaw) {
    var B = c.B, p = c.ph, body = B.body;
    if (!c.legs) { c.legs = LEG.map(function (deg) { var a = deg * Math.PI / 180; return { a: a, yaw: 0, hip: new T.Vector3(Math.cos(a) * 0.3, -0.03, Math.sin(a) * 0.36 - 0.08) }; }); c.byaw = 0; }
    var crouch = sm(0.15, 0.95, 0.5 + 0.5 * S(t * 0.6, p));
    body.position.y = 0.62 - 0.13 * crouch + 0.008 * Math.sin(t * 1.7 + p);
    var want = clamp(camYaw - c.mesh.rotation.y, -0.6, 0.6) + 0.22 * S(t * 0.25, p + 0.2); c.byaw += (want - c.byaw) * Math.min(1, dt * 1.5);
    body.rotation.set(0.04 * crouch - 0.03, c.byaw, 0.02 * Math.sin(t * 0.8 + p));
    rot(B.head, -0.08 * S(t * 0.4, p), 0.18 * S(t * 0.33, p + 0.4), 0.05 * S(t * 0.5, p));
    var pulse = 1 + 0.12 * Math.sin(t * 3.1 + p * 5) + 0.06 * Math.sin(t * 7.3); B.lens.scale.set(pulse, pulse, 1);
    rot(B.larm, 0.05 * Math.sin(t * 0.7 + p), 0, 0.05 * Math.sin(t * 0.5));
    rot(B.lant, 0.22 * Math.sin(t * 1.3 + p) - B.larm.rotation.x - body.rotation.x, 0, 0.18 * Math.sin(t * 1.05 + p * 3) - B.larm.rotation.z - body.rotation.z);
    var cy = Math.cos(c.byaw), sy = Math.sin(c.byaw);
    c.legs.forEach(function (L, i) {
      var sf = fr(t * 0.32 + i * 0.37 + p), lift = 0;
      if (sf < 0.14) { lift = Math.sin(sf / 0.14 * Math.PI) * 0.11; L.yaw += (c.byaw - L.yaw) * Math.min(1, dt * 6); }
      var fa = L.a - L.yaw, rf = 1.08 + 0.04 * Math.sin(t * 0.4 + i), fx = Math.cos(fa) * rf, fz = Math.sin(fa) * rf * 0.92 - 0.06, fy = lift;
      var hx = L.hip.x * cy + L.hip.z * sy, hz = -L.hip.x * sy + L.hip.z * cy, hy = body.position.y + L.hip.y;
      var vx = fx - hx, vy = fy - hy, vz = fz - hz, th = Math.atan2(-vz, vx);
      B["c" + i].rotation.set(0, th - c.byaw, 0);
      var dd = Math.sqrt(vx * vx + vz * vz) - 0.08, D = clamp(Math.sqrt(dd * dd + vy * vy), 0.25, L1 + L2 - 0.01), ph = Math.atan2(vy, dd);
      B["f" + i].rotation.set(0, 0, ph + Math.acos(clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1)));
      B["t" + i].rotation.set(0, 0, -(Math.PI - Math.acos(clamp((L1 * L1 + L2 * L2 - D * D) / (2 * L1 * L2), -1, 1))));
    });
  }
  function animDesk(c, t) {
    var B = c.B, cyc = fr(t / 3.2), on = cyc < 0.45, hop = on ? Math.abs(Math.sin(cyc / 0.45 * Math.PI * 2)) : 0;
    B.body.position.y = B.body.userData.p0.y + 0.09 * hop; rot(B.head, 0, 0.3 * Math.sin(t * 0.7), 0.12 * Math.sin(t * 2.3) * (on ? 1 : 0.3));
    var mode = Math.floor(t / 3.2) % 3, bl = fr(t / 2.7) < 0.05 ? 0.1 : 1;
    B.eA.scale.set(mode === 0 ? 1 : 1e-4, mode === 0 ? bl : 1e-4, 1); B.eB.scale.setScalar(mode === 1 ? 1 : 1e-4); B.eC.scale.setScalar(mode === 2 ? 1 + 0.15 * Math.sin(t * 8) : 1e-4);
    rot(B.aL, 0, 0, 0.3 + 1.6 * hop); rot(B.aR, 0, 0, -0.3 - 1.6 * hop);
  }
  function animDrone(dr, t) {
    var p = dr.ph, r = 4.4 + 0.8 * S(t * 0.13, p), a = t * (0.16 + 0.05 * p) + dr.i * 2.1 + p * 6.28;
    var x = Math.sin(a) * r, z = Math.cos(a) * r * 0.55 - 0.8, y = 3.1 + 0.5 * S(t * 0.4, p + 0.3);
    var visit = sm(0, 0.6, win(t + p * 30, 19, 5, 0)), tx = dr.i % 2 ? 0.75 : -0.75;
    x += (tx - x) * visit; y += (2.8 - y) * visit; z += (1.0 - z) * visit;
    var m = dr.mesh, px = m.position.x, pz = m.position.z; m.position.set(x, y + 0.04 * Math.sin(t * 3 + p * 9), z);
    m.rotation.set(clamp((z - pz) * 6, -0.3, 0.3), a + Math.PI / 2, clamp(-(x - px) * 6, -0.3, 0.3));
    for (var i = 0; i < 4; i++) dr.B["r" + i].rotation.y = t * 30 * (i & 1 ? 1 : -1);
  }

  /* ---------- tooltip / picking ---------- */
  function showTip(lines, link, px, py) {
    while (tip.firstChild) tip.removeChild(tip.firstChild);
    lines.forEach(function (l, i) { var dv = document.createElement("div"); dv.textContent = l; if (i === 0) dv.style.cssText = "font-weight:700;margin-bottom:2px"; tip.appendChild(dv); });
    if (link) { var a = document.createElement("a"); a.href = link; a.target = "_blank"; a.rel = "noopener"; a.textContent = "профиль агента"; a.style.color = "#7fe3ff"; tip.appendChild(a); }
    tip.style.display = "block"; var w = el.clientWidth, h = el.clientHeight;
    tip.style.left = Math.min(w - 250, Math.max(6, px + 12)) + "px"; tip.style.top = Math.min(h - tip.offsetHeight - 6, Math.max(6, py + 12)) + "px";
  }
  function hideTip() { tip.style.display = "none"; if (ribbon) ribbon.material.uniforms.uHi.value = -1; }
  var ray, ndc;
  function project(v, out) { tmpV.copy(v).project(cam); out.x = (tmpV.x * 0.5 + 0.5) * el.clientWidth; out.y = (-tmpV.y * 0.5 + 0.5) * el.clientHeight; return tmpV.z < 1; }
  function pickAt(px, py) {
    var best = null, bd = 1e9, o = { x: 0, y: 0 }, w = new T.Vector3();
    picks.forEach(function (pk) {
      var r = 30;
      if (pk.kind === "guest") { w.copy(pk.c.mesh.position); w.y += pk.c.top * 0.5; r = 110 * pk.c.sc * el.clientHeight / 600; }
      else if (pk.kind === "drone") { w.copy(pk.dr.mesh.position); r = 26; } else { w.copy(pk.obj.position); r = 40; }
      if (!project(w, o)) return; var dd = Math.hypot(o.x - px, o.y - py); if (dd < r && dd < bd) { bd = dd; best = pk; }
    });
    if (best) return best;
    ndc.set(px / el.clientWidth * 2 - 1, -(py / el.clientHeight) * 2 + 1); ray.setFromCamera(ndc, cam);
    var hit = ray.intersectObject(ribbon, false)[0];
    if (hit && hit.uv) { var k = Math.floor((1 - hit.uv.x) * 10), row = ribbon.userData.rows && ribbon.userData.rows[k]; if (row) return { kind: "col", row: row, k: k }; }
    return null;
  }
  function tipFor(pk, px, py) {
    hideTip(); if (!pk) { view.dirty = true; loop(); return; }
    var TR = { up: "растёт", flat: "стабильно", down: "падает" }, L;
    if (pk.kind === "guest") { var g = pk.c.g; L = [(pk.c.rank <= 3 ? "№" + pk.c.rank + " " : "Гость №" + pk.c.rank + " ") + g.name, "визитов на Orb Studio за 30 дней: " + g.n];
      if (isStr(g.last_day)) L.push("последний визит: " + g.last_day); L.push(TYPE_RU[pk.c.type]); if (laurel && st.d.laurelsOn === g.name) L.push("агент месяца"); showTip(L, null, px, py); }
    else if (pk.kind === "drone") { var a = pk.dr.a; L = ["Дрон: " + String(a.name)]; if (isStr(a.model)) L.push("модель: " + a.model); if (num(a.activity_30d) != null) L.push("активность за 30 дней: " + a.activity_30d); showTip(L, https(a.profile_url), px, py); }
    else if (pk.kind === "aom") showTip(["Агент месяца", pk.name], null, px, py);
    else { var r = pk.row; L = ["Мир №" + r.rank + ": " + (isStr(r.name) ? r.name : "?")]; if (isStr(r.operator)) L.push("оператор: " + r.operator);
      L.push("доля: " + (r.share == null ? "нет данных (пустой контур)" : String(r.share))); if (TR[r.trend]) L.push("тренд: " + TR[r.trend]);
      if (isStr(data && data.metric)) L.push(String(data.metric)); ribbon.material.uniforms.uHi.value = pk.k; showTip(L, null, px, py); }
    view.dirty = true; loop();
  }
  function bindControls(cv) {
    cv.style.touchAction = "pan-y"; var id = null;
    cv.addEventListener("pointerdown", function (e) { id = e.pointerId; view.sx = e.clientX; view.sy = e.clientY; view.moved = false; view.drag = false; });
    cv.addEventListener("pointermove", function (e) {
      var rc = cv.getBoundingClientRect(), px = e.clientX - rc.left, py = e.clientY - rc.top;
      if (e.pointerType === "mouse") { view.px = clamp(px / rc.width * 2 - 1, -1, 1); view.py = clamp(py / rc.height * 2 - 1, -1, 1); }
      if (id === e.pointerId) { var dx = e.clientX - view.sx, dy = e.clientY - view.sy;
        if (!view.drag && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) { view.drag = true; view.auto = false; try { cv.setPointerCapture(e.pointerId); } catch (x) {} }
        if (view.drag) { view.off = clamp(view.off - dx * 0.003, -0.26, 0.26); view.sx = e.clientX; view.sy = e.clientY; view.moved = true; view.idle = now(); hideTip(); pinned = null; loop(); }
      } else if (e.pointerType === "mouse" && !pinned) { var pk = pickAt(px, py); el.style.cursor = pk ? "pointer" : ""; tipFor(pk, px, py); }
    });
    function end(e) { if (id !== e.pointerId) return; id = null;
      if (!view.moved && e.type === "pointerup") { var rc = cv.getBoundingClientRect(), px = e.clientX - rc.left, py = e.clientY - rc.top, pk = pickAt(px, py); pinned = pk; tipFor(pk, px, py); }
      view.drag = false; view.idle = now(); }
    cv.addEventListener("pointerup", end); cv.addEventListener("pointercancel", end);
    cv.addEventListener("pointerleave", function (e) { view.px = 0; view.py = 0; if (e.pointerType === "mouse" && !pinned) hideTip(); });
  }

  /* ---------- render pipeline ---------- */
  function rt(w, h, depth, ms) {
    var o = { minFilter: T.LinearFilter, magFilter: T.LinearFilter, format: T.RGBAFormat, type: st.hdr ? T.HalfFloatType : T.UnsignedByteType, depthBuffer: !!depth, stencilBuffer: false };
    var r = ms && T.WebGLMultisampleRenderTarget ? new T.WebGLMultisampleRenderTarget(w, h, o) : new T.WebGLRenderTarget(w, h, o); if (ms) r.samples = 4; return r;
  }
  var FSV = "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }";
  function fsMat(u, fs) { return new T.ShaderMaterial({ uniforms: u, vertexShader: FSV, fragmentShader: fs, depthTest: false, depthWrite: false }); }
  function setupPost() {
    var w2 = ren.capabilities.isWebGL2;
    st.hdr = !!(w2 ? ren.extensions.get("EXT_color_buffer_float") : (ren.extensions.get("OES_texture_half_float") && ren.extensions.get("EXT_color_buffer_half_float") && ren.extensions.get("OES_texture_half_float_linear")));
    RT.scene = rt(4, 4, true, w2); RT.mir = rt(4, 4, true, false); RT.a1 = rt(4, 4); RT.b1 = rt(4, 4); RT.a2 = rt(4, 4); RT.b2 = rt(4, 4);
    FS.scene = new T.Scene(); FS.cam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1); FS.q = new T.Mesh(new T.PlaneGeometry(2, 2)); FS.q.frustumCulled = false; FS.scene.add(FS.q);
    FS.bright = fsMat({ t: { value: null }, uPx: { value: new T.Vector2() }, uTh: { value: st.hdr ? 1.7 : 0.8 } },
      "uniform sampler2D t; uniform vec2 uPx; uniform float uTh; varying vec2 vUv; void main(){ vec3 c=(texture2D(t,vUv-uPx).rgb+texture2D(t,vUv+uPx*vec2(1.,-1.)).rgb+texture2D(t,vUv+uPx*vec2(-1.,1.)).rgb+texture2D(t,vUv+uPx).rgb)*0.25; float l=max(c.r,max(c.g,c.b)); float k=max(l-uTh,0.)/max(l,1e-4); gl_FragColor=vec4(min(c*k,vec3(30.)),1.); }");
    FS.blur = fsMat({ t: { value: null }, uD: { value: new T.Vector2() } },
      "uniform sampler2D t; uniform vec2 uD; varying vec2 vUv; void main(){ vec3 c=texture2D(t,vUv).rgb*0.227; c+=(texture2D(t,vUv+uD*1.385).rgb+texture2D(t,vUv-uD*1.385).rgb)*0.316; c+=(texture2D(t,vUv+uD*3.231).rgb+texture2D(t,vUv-uD*3.231).rgb)*0.07; gl_FragColor=vec4(c,1.); }");
    FS.copy = fsMat({ t: { value: null } }, "uniform sampler2D t; varying vec2 vUv; void main(){ gl_FragColor=texture2D(t,vUv); }");
    FS.comp = fsMat({ tS: { value: null }, t1: { value: null }, t2: { value: null }, uExp: { value: 0.82 } },
      "uniform sampler2D tS,t1,t2; uniform float uExp; varying vec2 vUv; vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.,1.); }\n" +
      "void main(){ vec3 c=texture2D(tS,vUv).rgb+texture2D(t1,vUv).rgb*0.5+texture2D(t2,vUv).rgb*0.75; vec2 q=vUv-0.5; c*=1.-dot(q,q)*0.85;\n" +
      " c=aces(c*uExp); c=pow(c,vec3(1./2.2)); float d=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453); c+=(d-0.5)/255.; gl_FragColor=vec4(c,1.); }");
  }
  function pass(m, target) { FS.q.material = m; ren.setRenderTarget(target); ren.render(FS.scene, FS.cam); }
  function blur2(a, b, k) { FS.blur.uniforms.t.value = a.texture; FS.blur.uniforms.uD.value.set(k / a.width, 0); pass(FS.blur, b); FS.blur.uniforms.t.value = b.texture; FS.blur.uniforms.uD.value.set(0, k / a.height); pass(FS.blur, a); }
  function renderAll() {
    ren.info.reset();
    vc.position.set(cam.position.x, -cam.position.y, cam.position.z); vc.up.set(0, 1, 0); vc.lookAt(camTarget.x, -camTarget.y, camTarget.z);
    vc.fov = cam.fov; vc.aspect = cam.aspect; vc.updateProjectionMatrix(); vc.updateMatrixWorld();
    texMat.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1); texMat.multiply(vc.projectionMatrix); texMat.multiply(vc.matrixWorldInverse);
    P.glassMesh.visible = false; ren.setRenderTarget(RT.mir); ren.render(scene, vc); st.trisMirror = ren.info.render.triangles; P.glassMesh.visible = true;
    floor.material.uniforms.tM.value = RT.mir.texture;
    ren.setRenderTarget(RT.scene); ren.render(scene, cam); st.tris = ren.info.render.triangles - st.trisMirror;
    FS.bright.uniforms.t.value = RT.scene.texture; pass(FS.bright, RT.a1); blur2(RT.a1, RT.b1, 1);
    FS.copy.uniforms.t.value = RT.a1.texture; pass(FS.copy, RT.a2); blur2(RT.a2, RT.b2, 1.5);
    FS.comp.uniforms.tS.value = RT.scene.texture; FS.comp.uniforms.t1.value = RT.a1.texture; FS.comp.uniforms.t2.value = RT.a2.texture; pass(FS.comp, null);
    st.calls = ren.info.render.calls;
  }
  function resize() {
    if (!ren) return; var w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight), pr = Math.min(window.devicePixelRatio || 1, 1.5);
    ren.setPixelRatio(pr); ren.setSize(w, h, false); var W = Math.floor(w * pr), H = Math.floor(h * pr);
    RT.scene.setSize(W, H); RT.mir.setSize(W >> 1, H >> 1); RT.a1.setSize(W >> 2, H >> 2); RT.b1.setSize(W >> 2, H >> 2); RT.a2.setSize(W >> 3, H >> 3); RT.b2.setSize(W >> 3, H >> 3);
    FS.bright.uniforms.uPx.value.set(1 / W, 1 / H);
    cam.aspect = w / h; cam.fov = cam.aspect < 1 ? 50 : 36; cam.updateProjectionMatrix();
    if (haloMesh) haloMesh.material.uniforms.uScale.value = H * 0.5 * cam.projectionMatrix.elements[5];
    loop();
  }
  function frame() {
    raf = 0; if (!onScreen || document.hidden || !ren) return;
    var tn = now() / 1000; if (view.t0 == null) view.t0 = tn; var dt = Math.min(0.1, Math.max(0, tn - (view.lt || tn))); view.lt = tn;
    var t = reduce ? 6.0 : tn - view.t0 + 2.0; U.uT.value = t;
    if (!view.drag && !view.auto && !reduce && now() - view.idle > 4000) view.auto = true;
    if (view.auto && !reduce) { view.swayT += dt; var tg = 0.26 * Math.sin(view.swayT * 0.11); view.off += (tg - view.off) * Math.min(1, dt * 0.8); }
    var kk = reduce ? 1 : Math.min(1, dt * 3); view.gx += (view.px - view.gx) * kk; view.gy += (view.py - view.gy) * kk;
    var portrait = cam.aspect < 1, dist = portrait ? 12.4 : 11.2, ly = portrait ? 2.05 : 1.95, ch = portrait ? 2.6 : 2.45, yaw = view.off;
    camTarget.set(view.gx * 0.35, ly - view.gy * 0.18, 0);
    cam.position.set(Math.sin(yaw) * dist, ch, Math.cos(yaw) * dist + 0.2); cam.lookAt(camTarget);
    var camYaw = Math.atan2(cam.position.x, cam.position.z);
    chars.forEach(function (c) { if (c.type === "spider") animSpider(c, t, reduce ? 1 : dt, camYaw); else if (c.type === "desk") animDesk(c, t); else animHuman(c, t); });
    drones.forEach(function (d) { animDrone(d, t); });
    if (laurel) { var b = laurel.userData.base; laurel.position.set(b.x, b.y + 0.06 * Math.sin(t * 1.2), b.z); laurel.rotation.y = 0.35 * Math.sin(t * 0.4); }
    scene.updateMatrixWorld();
    chars.forEach(function (c) { if (c.light) c.lightOn.localToWorld(c.light.position.copy(c.lightOff)); });
    if (haloMesh && halos.length) { var pa = haloMesh.geometry.attributes.position; halos.forEach(function (h, i) { h.o.localToWorld(tmpV.copy(h.off)); pa.setXYZ(i, tmpV.x, tmpV.y, tmpV.z); }); pa.needsUpdate = true; }
    var o = { x: 0, y: 0 };
    chars.forEach(function (c) { if (!c.label) return; var vis = project(c.anchor, o); c.label.style.display = vis ? "block" : "none"; var hw = (c.label.offsetWidth || 90) / 2 + 4; o.x = clamp(o.x, hw, el.clientWidth - hw); c.label.style.transform = "translate(" + Math.round(o.x) + "px," + Math.round(o.y) + "px) translate(-50%,0)"; });
    if (laurel) { var ap = laurel.userData.anchor.copy(laurel.position); ap.y += 0.62; project(ap, o); laurel.userData.label.style.transform = "translate(" + Math.round(o.x) + "px," + Math.round(o.y) + "px) translate(-50%,-100%)"; }
    renderAll(); st.frames++;
    var rn = performance.now(); fpsT.push(rn); while (fpsT.length > 40) fpsT.shift(); if (fpsT.length > 2 && fpsT[fpsT.length - 1] > fpsT[0]) st.fps = Math.round((fpsT.length - 1) / ((fpsT[fpsT.length - 1] - fpsT[0]) / 1000) * 10) / 10;
    if (!reduce) loop();
  }
  function loop() { if (!raf && ren && onScreen && !document.hidden) raf = requestAnimationFrame(frame); }
  function buildEnv() { // environment map rendered from the hall itself (PMREMGenerator, r128 core)
    var pm = new T.PMREMGenerator(ren), hid = [];
    // PMREM renders into an RGBE target: hide custom-shader/additive objects (they would corrupt the RGBE alpha channel)
    scene.traverse(function (o) { if (o.visible && o.material && (o.material.isShaderMaterial || o.material.transparent)) { hid.push(o); o.visible = false; } });
    scene.position.set(0, -1.6, -1);
    try { envTex = pm.fromScene(scene, 0.03, 0.1, 80).texture; } catch (x) { envTex = null; }
    scene.position.set(0, 0, 0); hid.forEach(function (o) { o.visible = true; }); pm.dispose();
    [matSkin, matStatic, P.glassMesh.material].forEach(function (m) { m.envMap = envTex; m.envMapIntensity = m === P.glassMesh.material ? 1.0 : 0.55; m.needsUpdate = true; });
  }
  function init(target) {
    try {
      if (ok) return true; T = window.THREE; if (!T || !target) return false;
      el = target; if (getComputedStyle(el).position === "static") el.style.position = "relative";
      try { ren = new T.WebGLRenderer({ antialias: false, powerPreference: "high-performance" }); } catch (x) { ren = null; }
      if (!ren) return false;
      ren.setClearColor(0x020308, 1); ren.info.autoReset = false; ren.outputEncoding = T.LinearEncoding; ren.toneMapping = T.NoToneMapping;
      var cv = ren.domElement; cv.style.cssText = "display:block;width:100%;height:100%"; el.appendChild(cv);
      _v = new T.Vector3(); _n = new T.Vector3(); _q = new T.Quaternion(); _e = new T.Euler(); _s = new T.Vector3(); tmpV = new T.Vector3(); camTarget = new T.Vector3(); texMat = new T.Matrix4();
      scene = new T.Scene(); scene.fog = new T.Fog(0x03040b, 16, 42);
      cam = new T.PerspectiveCamera(36, 1.6, 0.1, 120); cam.layers.enable(1); vc = new T.PerspectiveCamera(36, 1.6, 0.1, 120);
      ray = new T.Raycaster(); ndc = new T.Vector2();
      palette(); matSkin = makeMat(true); matStatic = makeMat(false);
      scene.add(new T.HemisphereLight(0x3a4c80, 0x080410, 0.55));
      [[0x30e0ff, 3.2, 26, -6, 5, -3.5], [0xff3ad0, 3.2, 26, 6, 5, -3.5], [0x30e0ff, 1.4, 14, -5, 2, 4], [0xff3ad0, 1.4, 14, 5, 2, 4]].forEach(function (q) { var l = new T.PointLight(q[0], q[1], q[2], 1.4); l.position.set(q[3], q[4], q[5]); scene.add(l); });
      var key = new T.DirectionalLight(0xb8c8ff, 0.55); key.position.set(1.5, 7, 9); scene.add(key);
      var top = new T.SpotLight(0xfff0dd, 1.0, 16, 0.5, 0.6, 1.2); top.position.set(0, 9.5, 0.5); top.target.position.set(0, 1, 0); scene.add(top); scene.add(top.target);
      for (var i = 0; i < 3; i++) { var w = new T.PointLight(0xffa850, 0, 4, 1.6); warmLights.push(w); scene.add(w); }
      tip = document.createElement("div");
      tip.style.cssText = "position:absolute;display:none;max-width:260px;padding:8px 10px;border-radius:8px;background:rgba(6,10,26,.94);border:1px solid rgba(255,80,220,.45);color:#eef4ff;font:12px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;z-index:5;box-shadow:0 6px 24px rgba(0,0,0,.5)";
      labelsBox = document.createElement("div"); labelsBox.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:4";
      el.appendChild(labelsBox); el.appendChild(tip);
      setupPost(); buildHall(); buildConfetti(); buildEnv(); bindControls(cv);
      if (window.ResizeObserver) new ResizeObserver(resize).observe(el); else window.addEventListener("resize", resize);
      if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; loop(); }, { threshold: 0.02 }).observe(el);
      document.addEventListener("visibilitychange", loop);
      ok = true; build(); return true;
    } catch (err) { if (window.console) console.warn("[OrbHall3D] init failed", err); return false; }
  }
  function update(d) {
    data = (d && typeof d === "object") ? d : null; if (!ok) return;
    try { build(); } catch (err) { if (window.console) console.warn("[OrbHall3D] update failed", err); try { data = null; build(); } catch (e2) {} }
  }
  function stats() { var s = st.d || {}; return { frames: st.frames, triangles: st.tris, trianglesMirrorPass: st.trisMirror, calls: st.calls, fps: st.fps, hdr: st.hdr,
    guests: s.guests, podium: s.podium, small: s.small, types: s.types, drones: s.drones, dronesHidden: s.dronesHidden, columns: s.columns, columnsNull: s.columnsNull,
    agentOfMonth: s.agentOfMonth, laurelsOn: s.laurelsOn, missing: (s.missing || []).slice(), reducedMotion: reduce }; }
  window.OrbHall3D = { init: init, update: update, stats: stats };
})();
