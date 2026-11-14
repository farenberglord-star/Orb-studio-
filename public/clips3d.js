/* clips3d.js - "Emotional timecode" hologram for orbstudio.org/tools/clips
   three.js r128 (cdnjs) only, no examples/, no textures/models/fonts, no text in 3D.
   window.OrbClips3D = { init(el)->bool, update(data), stats(), show(i), destroy() }
   data = GET /api/v1/clips?reveal=1. Deterministic: hash-based phases only. */
(function () {
  "use strict";
  var T = window.THREE;
  var C = { bg: 0x03060d, holo: 0x6fe6ff, react: 0xff5d7a, phrase: 0xffb547, human: 0x4fd8a4, agent: 0xa99bff };
  var PLAY = 7.2, TAIL = 2.0, CYCLE = PLAY + TAIL;          // 9.2 s per clip
  var RAIL_X0 = -3.6, RAIL_X1 = 3.6, RAIL_Y = -1.45, RAIL_Z = 1.9, FLOOR = -0.9;
  var SPK = [-3, FLOOR, 0], LIS = [3, FLOOR, 0];
  var MAX_STEPS = 16, POOL = 160, STREAM_N = 900;
  function h(n) { var x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function hs(s) { var a = 7; s = String(s); for (var i = 0; i < s.length; i++) a = (a * 31 + s.charCodeAt(i)) % 1000003; return a; }
  function cl(x, a, b) { return x < a ? a : x > b ? b : x; }
  function sm(x) { x = cl(x, 0, 1); return x * x * (3 - 2 * x); }
  function num(v) { return typeof v === "number" && isFinite(v) ? v : null; }
  function col(c) { return new T.Color(c); }

  var S = null; // state

  /* ---------- data ---------- */
  function parse(d) {
    if (!d || !Array.isArray(d.clips)) return [];
    var lb = Array.isArray(d.leaderboard) ? d.leaderboard : [];
    var out = [];
    d.clips.forEach(function (c) {
      if (!c || !c.window) return;
      var s = num(c.window.start_s), e = num(c.window.end_s);
      if (s === null || e === null || e <= s) return;
      var beats = (Array.isArray(c.beats) ? c.beats : []).map(function (b) { return b && num(b.t); })
        .filter(function (t) { return t !== null && t >= s && t <= e; }).sort(function (a, b) { return a - b; }).slice(0, MAX_STEPS);
      var a = c.answer && typeof c.answer === "object" ? c.answer : null;
      var trig = a && a.trigger ? num(a.trigger.t) : null;
      var tc = a ? num(a.emotional_timecode_s) : null;
      if (trig !== null && (trig < s || trig > e)) trig = null;
      if (tc !== null && (tc < s || tc > e)) tc = null;
      var emo = a && Array.isArray(a.emotion_sequence) ? a.emotion_sequence.length : 0;
      // leaderboard: per clip if entries carry a clip id, else global; mean per kind
      var acc = { human: [], agent: [] };
      lb.forEach(function (r) {
        if (!r) return; var v = num(r.avg_abs_delta_s); if (v === null || v < 0) return;
        var cid = r.clip || r.clip_id || r.id_clip; if (cid && cid !== c.id) return;
        var k = String(r.kind || "").toLowerCase();
        if (/human|people|person|люд|чел/.test(k)) acc.human.push(v); else if (/agent|ai|bot|агент/.test(k)) acc.agent.push(v);
      });
      function mean(a) { if (!a.length) return null; var t = 0; a.forEach(function (x) { t += x; }); return t / a.length; }
      out.push({ id: String(c.id || ("clip" + out.length)), s: s, e: e, beats: beats, trig: trig, tc: tc, emo: emo,
        editor: !!(a && a.editor_signal), marked: c.marked_by === "human" ? "human" : c.marked_by === "agent" ? "agent" : null,
        lbH: mean(acc.human), lbA: mean(acc.agent) });
    });
    return out;
  }

  /* ---------- materials ---------- */
  var CRY_VS = "attribute vec3 aDir; uniform float uOpen; uniform float uTime; varying float vF; varying float vY;" +
    "void main(){ float sd=fract(sin(dot(aDir,vec3(12.9,78.2,37.7)))*43758.5);" +
    "vec3 p=position+aDir*uOpen*(0.55+0.6*sd); vec4 mv=modelViewMatrix*vec4(p,1.0);" +
    "vec3 n=normalize(normalMatrix*aDir); vF=1.0-abs(dot(n,normalize(-mv.xyz))); vY=p.y; gl_Position=projectionMatrix*mv; }";
  var CRY_FS = "uniform vec3 uColor; uniform vec3 uWarm; uniform float uWarmK; uniform float uGlow; uniform float uAlpha; uniform float uEdge; uniform float uTime;" +
    "varying float vF; varying float vY; void main(){ vec3 c=mix(uColor,uWarm,uWarmK);" +
    "float scan=0.85+0.15*sin(vY*38.0-uTime*3.0);" +
    "float a=uEdge>0.5? 0.9 : (0.10+0.85*pow(vF,2.2))*scan; gl_FragColor=vec4(c*a*uGlow*uAlpha,1.0); }";
  function cryMat(color, edge) {
    return new T.ShaderMaterial({ vertexShader: CRY_VS, fragmentShader: CRY_FS, transparent: true, depthWrite: false,
      blending: T.AdditiveBlending, side: T.DoubleSide,
      uniforms: { uColor: { value: col(color) }, uWarm: { value: col(C.phrase) }, uWarmK: { value: 0 }, uGlow: { value: 1 },
        uAlpha: { value: 1 }, uEdge: { value: edge ? 1 : 0 }, uOpen: { value: 0 }, uTime: { value: 0 } } });
  }
  function basic(color, op) { return new T.MeshBasicMaterial({ color: color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }); }
  function lineMat(color, op) { return new T.LineBasicMaterial({ color: color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false }); }

  /* ---------- crystal (abstract silhouette, no face) ---------- */
  function crystalGeo() {
    var tris = [], k, N = 8, top = [0, 1.75, 0], bot = [0, 0, 0], ring = [];
    for (k = 0; k < N; k++) { var a = k / N * Math.PI * 2 + 0.2; ring.push([Math.cos(a) * 0.55, 1.05, Math.sin(a) * 0.48]); }
    for (k = 0; k < N; k++) { var r0 = ring[k], r1 = ring[(k + 1) % N]; tris.push([top, r0, r1], [bot, r1, r0]); }
    var hc = [0, 2.2, 0], hr = 0.27, o = [[hr, 0, 0], [0, 0, hr], [-hr, 0, 0], [0, 0, -hr]];
    for (k = 0; k < 4; k++) { var p0 = o[k], p1 = o[(k + 1) % 4];
      var A = [hc[0] + p0[0], hc[1], hc[2] + p0[2]], B = [hc[0] + p1[0], hc[1], hc[2] + p1[2]];
      tris.push([[0, hc[1] + hr * 1.3, 0], A, B], [[0, hc[1] - hr * 1.2, 0], B, A]); }
    var pos = [], dir = [], lp = [], ld = [];
    tris.forEach(function (t) {
      var cx = (t[0][0] + t[1][0] + t[2][0]) / 3, cy = (t[0][1] + t[1][1] + t[2][1]) / 3, cz = (t[0][2] + t[1][2] + t[2][2]) / 3;
      var dx = cx, dy = cy - 1.1, dz = cz, l = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1; dx /= l; dy /= l; dz /= l;
      for (var i = 0; i < 3; i++) { pos.push(t[i][0], t[i][1], t[i][2]); dir.push(dx, dy, dz);
        var j = (i + 1) % 3; lp.push(t[i][0], t[i][1], t[i][2], t[j][0], t[j][1], t[j][2]); ld.push(dx, dy, dz, dx, dy, dz); }
    });
    var g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); g.setAttribute("aDir", new T.Float32BufferAttribute(dir, 3));
    var e = new T.BufferGeometry(); e.setAttribute("position", new T.Float32BufferAttribute(lp, 3)); e.setAttribute("aDir", new T.Float32BufferAttribute(ld, 3));
    return { g: g, e: e };
  }
  function crystal(geo, color) {
    var grp = new T.Group(), m1 = cryMat(color, false), m2 = cryMat(color, true);
    grp.add(new T.Mesh(geo.g, m1)); grp.add(new T.LineSegments(geo.e, m2)); grp.userData.mats = [m1, m2]; return grp;
  }
  function setCry(grp, k, v) { grp.userData.mats.forEach(function (m) { if (m.uniforms[k].value && m.uniforms[k].value.copy) m.uniforms[k].value.copy(v); else m.uniforms[k].value = v; }); }

  /* ---------- glow point pool (one draw call for all dots) ---------- */
  var PT_VS = "attribute float aSize; attribute float aAlpha; attribute vec3 aCol; uniform float uScale; varying float vA; varying vec3 vC;" +
    "void main(){ vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=min(aSize*uScale/max(-mv.z,0.1),256.0); vA=aAlpha; vC=aCol; gl_Position=projectionMatrix*mv; }";
  var PT_FS = "varying float vA; varying vec3 vC; void main(){ vec2 d=gl_PointCoord-0.5; float r=length(d)*2.0; if(r>1.0) discard;" +
    "float g=exp(-r*r*5.0)+0.6*exp(-r*r*40.0); gl_FragColor=vec4(vC*g*vA,1.0); }";
  function makePool() {
    var g = new T.BufferGeometry();
    g.setAttribute("position", new T.BufferAttribute(new Float32Array(POOL * 3), 3));
    g.setAttribute("aCol", new T.BufferAttribute(new Float32Array(POOL * 3), 3));
    g.setAttribute("aSize", new T.BufferAttribute(new Float32Array(POOL), 1));
    g.setAttribute("aAlpha", new T.BufferAttribute(new Float32Array(POOL), 1));
    var m = new T.ShaderMaterial({ vertexShader: PT_VS, fragmentShader: PT_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uScale: { value: 300 } } });
    var p = new T.Points(g, m); p.frustumCulled = false; p.userData.n = 0; return p;
  }
  function dot(x, y, z, c, size, a) {
    var p = S.pool, n = p.userData.n; if (n >= POOL || a <= 0.003) return; var g = p.geometry, cc = S.cc[c] || (S.cc[c] = col(c));
    g.attributes.position.array.set([x, y, z], n * 3); g.attributes.aCol.array.set([cc.r, cc.g, cc.b], n * 3);
    g.attributes.aSize.array[n] = size; g.attributes.aAlpha.array[n] = a; p.userData.n = n + 1;
  }

  /* ---------- voice stream particles ---------- */
  var ST_VS = "attribute float aS; attribute float aS2; uniform float uT; uniform float uW; uniform float uDen; uniform float uBri; uniform float uFade; uniform float uScale; varying float vA;" +
    "vec3 path(float u){ return vec3(mix(-2.6,2.6,u), 1.3+0.45*sin(3.14159*u), 0.0); }" +
    "void main(){ float u=fract(aS*7.13+uT*0.32*(0.75+0.5*aS2)); float an=aS*61.0+uT*1.7*(aS2-0.5); float r=0.05+0.17*aS2*(0.6+0.4*uDen);" +
    "vec3 p=path(u)+vec3(0.0,cos(an)*r,sin(an)*r)+0.025*vec3(sin(uW*2.3+aS*40.0),cos(uW*1.9+aS*31.0),0.0);" +
    "float vis=step(aS2,uDen); vA=vis*uBri*uFade*pow(sin(3.14159*u),0.6); vec4 mv=modelViewMatrix*vec4(p,1.0);" +
    "gl_PointSize=(0.05+0.05*aS)*uScale/max(-mv.z,0.1); gl_Position=projectionMatrix*mv; }";
  var ST_FS = "uniform vec3 uC; varying float vA; void main(){ vec2 d=gl_PointCoord-0.5; float r=length(d)*2.0; if(r>1.0) discard; gl_FragColor=vec4(uC*exp(-r*r*4.0)*vA,1.0); }";
  function makeStream() {
    var a = new Float32Array(STREAM_N), b = new Float32Array(STREAM_N), p = new Float32Array(STREAM_N * 3);
    for (var i = 0; i < STREAM_N; i++) { a[i] = h(i + 0.5); b[i] = h(i * 3.7 + 11.1); }
    var g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(p, 3)); g.setAttribute("aS", new T.BufferAttribute(a, 1)); g.setAttribute("aS2", new T.BufferAttribute(b, 1));
    var m = new T.ShaderMaterial({ vertexShader: ST_VS, fragmentShader: ST_FS, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      uniforms: { uT: { value: 0 }, uW: { value: 0 }, uDen: { value: 0.3 }, uBri: { value: 1 }, uFade: { value: 1 }, uScale: { value: 300 }, uC: { value: col(C.holo) } } });
    var pts = new T.Points(g, m); pts.frustumCulled = false; return pts;
  }

  /* ---------- ribbon (lightning) ---------- */
  function ribbon(n, color, op) {
    var g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(new Float32Array((n - 1) * 12 * 3), 3));
    var m = new T.Mesh(g, basic(color, op)); m.frustumCulled = false; m.userData.n = n; return m;
  }
  function setRibbon(m, pts, w) {
    var a = m.geometry.attributes.position.array, o = 0;
    function v(p, dy, dz) { a[o++] = p[0]; a[o++] = p[1] + dy; a[o++] = p[2] + dz; }
    for (var i = 0; i < pts.length - 1; i++) { var p = pts[i], q = pts[i + 1];
      v(p, -w, 0); v(q, -w, 0); v(q, w, 0); v(p, -w, 0); v(q, w, 0); v(p, w, 0);
      v(p, 0, -w); v(q, 0, -w); v(q, 0, w); v(p, 0, -w); v(q, 0, w); v(p, 0, w); }
    m.geometry.attributes.position.needsUpdate = true;
  }

  /* ---------- per-clip objects (stairs, scaffold, beams, rail marks) ---------- */
  function railX(c, t) { return RAIL_X0 + (RAIL_X1 - RAIL_X0) * (t - c.s) / (c.e - c.s); }
  function dispT(c, t) { return PLAY * (t - c.s) / (c.e - c.s); }
  function strength(c) { // reaction-strength proxy (API has no strength field)
    if (c.id === "ER-002") return { tiers: 7, posts: 16 };
    var gap = c.trig !== null && c.tc !== null ? c.tc - c.trig : 0;
    return { tiers: cl(1 + c.emo + (c.editor ? 1 : 0) + (gap >= 5 ? 1 : 0), 2, 5), posts: 8 };
  }
  function buildClip(c) {
    var g = S.clipGrp, shared = [S.slabGeo, S.slabEdge, S.beamGeo, S.beamHalo, S.unitBox];
    while (g.children.length) { g.children.pop().traverse(function (x) { if (x.material && x.material.dispose) x.material.dispose(); if (x.geometry && shared.indexOf(x.geometry) < 0) x.geometry.dispose(); }); } // Claude: освобождаем материалы, общие геометрии не трогаем
    S.slabs = [];
    var endRef = c.trig !== null ? c.trig : c.e;
    c.beats.forEach(function (t, i) {
      var u = cl((t - c.s) / Math.max(1e-6, endRef - c.s), 0, 1);
      var m = new T.Mesh(S.slabGeo, basic(C.holo, 0.25)), e = new T.LineSegments(S.slabEdge, lineMat(C.holo, 0.9));
      var grp = new T.Group(); grp.add(m); grp.add(e); grp.position.set(-2.2 + 3.9 * u, FLOOR + 0.12 + i * 0.26, 0);
      grp.userData = { t: t, m: m, e: e }; g.add(grp); S.slabs.push(grp);
    });
    // scaffold around listener ("stake")
    var st = strength(c), pos = [], ord = [], R = 1.35, tierH = 0.42, k, j, n = 0, segs = [];
    for (k = 0; k < st.tiers; k++) for (j = 0; j < st.posts; j++) {
      var a0 = j / st.posts * Math.PI * 2, a1 = (j + 1) / st.posts * Math.PI * 2, y0 = FLOOR + k * tierH, y1 = y0 + tierH;
      var r = R + 0.06 * k;
      segs.push([[Math.cos(a0) * r, y0, Math.sin(a0) * r], [Math.cos(a0) * r, y1, Math.sin(a0) * r], k]);
      segs.push([[Math.cos(a0) * r, y1, Math.sin(a0) * r], [Math.cos(a1) * r, y1, Math.sin(a1) * r], k + 0.5]);
      if (st.posts > 8 || (j + k) % 2 === 0) segs.push([[Math.cos(a0) * r, y0, Math.sin(a0) * r], [Math.cos(a1) * r, y1, Math.sin(a1) * r], k + 0.3]);
    }
    segs.forEach(function (s) { pos.push.apply(pos, s[0]); pos.push.apply(pos, s[1]); var o = s[2] / st.tiers; ord.push(o, o); });
    var sg = new T.BufferGeometry(); sg.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); sg.setAttribute("aO", new T.Float32BufferAttribute(ord, 1));
    var sm2 = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      uniforms: { uB: { value: 0 }, uC: { value: col(C.holo) }, uR: { value: col(C.react) }, uK: { value: 0 }, uA: { value: 0.5 } },
      vertexShader: "attribute float aO; varying float vO; void main(){ vO=aO; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: "uniform float uB; uniform vec3 uC; uniform vec3 uR; uniform float uK; uniform float uA; varying float vO; void main(){ float v=smoothstep(vO,vO+0.08,uB); if(v<=0.0) discard; gl_FragColor=vec4(mix(uC,uR,uK)*v*uA,1.0); }" });
    S.scaf = new T.LineSegments(sg, sm2); S.scaf.position.set(LIS[0], 0, LIS[2]); g.add(S.scaf);
    // leaderboard beams (only when data exists)
    S.beams = [];
    [["lbH", C.human, -1], ["lbA", C.agent, 1]].forEach(function (b) {
      var v = c[b[0]]; if (v === null || c.tc === null) return;
      var x = cl(railX(c, c.tc + b[2] * v), RAIL_X0, RAIL_X1);
      var core = new T.Mesh(S.beamGeo, basic(b[1], 0.75)), halo = new T.Mesh(S.beamHalo, basic(b[1], 0.12));
      [core, halo].forEach(function (m) { m.position.set(x, RAIL_Y + 0.8, RAIL_Z); g.add(m); });
      S.beams.push({ x: x, c: b[1], core: core, halo: halo });
    });
    // gap segment on rail (trigger -> reaction)
    if (c.trig !== null && c.tc !== null && c.tc > c.trig) {
      var x0 = railX(c, c.trig), x1 = railX(c, c.tc), gm = new T.Mesh(S.unitBox, basic(C.phrase, 0.5));
      gm.scale.set(x1 - x0, 0.035, 0.05); gm.position.set((x0 + x1) / 2, RAIL_Y + 0.03, RAIL_Z); g.add(gm);
    }
    // trust nodes (ER-002) seeds
    S.nodes = c.id === "ER-002" ? 50 : 0;
    S.mirror.visible = false;
  }

  /* ---------- camera ---------- */
  var CAM = { wide: [[0, 2.3, 9.6], [0, 0.5, 0]], spk: [[-1.0, 1.9, 6.6], [-2.2, 1.0, 0]], lis: [[1.0, 2.3, 7.6], [2.6, 1.3, 0]], mid: [[1.0, 2.2, 9.0], [1.2, 0.9, 0]] };
  function lerp3(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function blend(A, B, k) { return [lerp3(A[0], B[0], k), lerp3(A[1], B[1], k)]; }
  function camFor(c, d) {
    var dq = c.beats.length > 1 ? dispT(c, c.beats[1]) : PLAY * 0.15;
    var dtr = c.trig !== null ? dispT(c, c.trig) : PLAY;
    var dr = c.tc !== null ? dispT(c, c.tc) : null;
    var k = blend(CAM.wide, CAM.spk, sm((d - dq) / Math.max(0.5, dtr - dq)));
    if (dr !== null) k = blend(k, CAM.lis, sm((d - dr + 0.3) / 0.75));
    if (d < 0.6 && S.clips.length > 1) k = blend(CAM.lis, k, sm(d / 0.6));
    return k;
  }
  function applyCam(k) {
    var asp = S.w / S.h, f = asp < 1.5 ? cl(1.5 / asp, 1, 2.3) : 1, p = k[0], t = k[1];
    S.cam.position.set(t[0] + (p[0] - t[0]) * f, t[1] + (p[1] - t[1]) * f, t[2] + (p[2] - t[2]) * f);
    S.cam.lookAt(t[0] * (asp < 1 ? 0.6 : 1), t[1], t[2]);
  }

  /* ---------- frame ---------- */
  function phaseOf(c, d) {
    if (d >= PLAY) return c.tc !== null ? (c.emo > 1 ? "processing" : "reaction") : "tail";
    var cs = c.s + (c.e - c.s) * d / PLAY;
    if (c.tc !== null && cs >= c.tc) return (c.emo > 1 && d - dispT(c, c.tc) > 0.9) ? "processing" : "reaction";
    if (c.trig !== null && cs >= c.trig) return c.tc !== null && cs < c.tc ? "silence" : "phrase";
    if (c.beats.length > 1 && cs < c.beats[1]) return "question";
    return "build";
  }
  function frame(d, wall) {
    var c = S.clips[S.ci], i, U;
    S.pool.userData.n = 0;
    var ttime = wall;
    S.speaker.userData.mats.concat(S.listener.userData.mats, S.mirror.userData.mats).forEach(function (m) { m.uniforms.uTime.value = ttime; });
    if (!c) { // no data: dim idle crystals only
      setCry(S.speaker, "uGlow", 0.35); setCry(S.listener, "uGlow", 0.35); setCry(S.listener, "uOpen", 0);
      [S.stream, S.qbeam, S.bolt, S.boltCore, S.ring, S.scaf, S.mirror].forEach(function (o) { if (o) o.visible = false; });
      S.waves.forEach(function (w) { w.visible = false; }); applyCam(CAM.wide); S.phase = "nodata"; finishPool(); return;
    }
    var cs = c.s + (c.e - c.s) * Math.min(d, PLAY) / PLAY;
    var dtr = c.trig !== null ? dispT(c, c.trig) : null, dr = c.tc !== null ? dispT(c, c.tc) : null;
    var ra = dr !== null ? d - dr : -1;                  // display seconds since reaction
    var passed = 0; c.beats.forEach(function (t) { if (cs >= t) passed++; });
    var nb = Math.max(1, c.beats.length);
    // 3. question beam (listener -> speaker)
    var qEnd = c.beats.length > 1 ? dispT(c, c.beats[1]) : PLAY * 0.12, qa = d < qEnd + 0.4 ? (1 - sm((d - qEnd) / 0.4)) * sm(d / 0.25) : 0;
    S.qbeam.visible = qa > 0.01; S.qbeam.material.opacity = 0.22 * qa;
    if (qa > 0.01) for (i = 0; i < 2; i++) { U = ((d * 0.9 + i * 0.5) % 1); dot(2.7 - 5.4 * U, 1.45 + 0.1 * Math.sin(U * 3.14), 0, C.react, 0.35, 0.6 * qa); }
    // 4/5. voice stream
    var silent = dtr !== null && d >= dtr + 0.12;
    S.streamT = silent ? dtr + 0.12 : d; var den = 0.18 + 0.82 * passed / nb, beatPulse = 0;
    c.beats.forEach(function (t) { var x = d - dispT(c, t); if (x >= 0 && x < 0.5) beatPulse = Math.max(beatPulse, 1 - x / 0.5); });
    var st = S.stream.material.uniforms; S.stream.visible = d > 0.15;
    st.uT.value = S.streamT; st.uW.value = wall; st.uDen.value = den; st.uBri.value = (0.45 + 0.55 * passed / nb) * (1 + 0.6 * beatPulse);
    st.uFade.value = sm(d / 0.6) * (ra >= 0 ? 1 - sm(ra / 0.5) : silent ? 0.85 : 1) * (d > PLAY ? 1 - sm((d - PLAY) / 0.4) : 1);
    // stairs
    S.slabs.forEach(function (g, j) {
      var age = d - dispT(c, g.userData.t), on = age >= 0, pop = on ? sm(age / 0.35) : 0;
      g.visible = on; g.scale.set(pop, 1, pop);
      var last = j === passed - 1 ? 1 : 0.55; g.userData.m.material.opacity = 0.22 * last + 0.25 * (on ? Math.max(0, 1 - age / 0.5) : 0); g.userData.e.material.opacity = 0.9 * last;
    });
    // 6. lightning on trigger
    var la = dtr !== null && d >= dtr && d < dtr + 0.55 ? (1 - (d - dtr) / 0.55) : 0;
    S.bolt.visible = S.boltCore.visible = la > 0;
    if (la > 0) {
      var b = Math.floor(wall * 24), pts = [];
      for (i = 0; i < 28; i++) { U = i / 27; var j2 = (i === 0 || i === 27) ? 0 : 1;
        pts.push([-2.6 + 5.2 * U, 1.3 + 0.45 * Math.sin(Math.PI * U) + j2 * (h(b * 31 + i) - 0.5) * 0.36, j2 * (h(b * 17 + i * 3) - 0.5) * 0.3]); }
      setRibbon(S.bolt, pts, 0.07); setRibbon(S.boltCore, pts, 0.016);
      var fl = 0.55 + 0.45 * h(b); S.bolt.material.opacity = 0.35 * la * fl; S.boltCore.material.opacity = la * fl;
      U = cl((d - dtr) / 0.25, 0, 1); dot(-2.6 + 5.2 * U, 1.3 + 0.45 * Math.sin(Math.PI * U), 0, C.phrase, 1.0, la);
    }
    // 7. silence: empty ring
    var ringA = dtr !== null && d >= dtr + 0.1 ? (dr !== null ? (d < dr ? sm((d - dtr - 0.1) / 0.25) : 1 - sm(ra / 0.3)) : 1 - sm((d - dtr - 0.1) / 1.5)) : 0;
    S.ring.visible = ringA > 0.01; S.ring.material.opacity = 0.55 * ringA; S.ring.scale.setScalar(1 + 0.06 * Math.sin(wall * 3));
    // 8/9. reaction + processing
    var open = 0, glow = 0.85 + 0.25 * passed / nb, warm = 0, sc = 1;
    if (ra >= 0) {
      open = 0.7 * Math.exp(-ra * 2.6) * (1 - Math.exp(-ra * 28));
      glow = 1 + 2.6 * Math.exp(-ra * 3.2);
      if (c.emo > 1) { var pk = sm((ra - 0.8) / 0.7); warm = 0.55 * pk; sc = 1 - 0.07 * pk; glow = glow * (1 - pk) + 1.45 * pk; }
      dot(LIS[0], 1.2, 0, C.react, 6.5, 1.3 * Math.exp(-ra * 5)); dot(LIS[0], 1.2, 0, 0xffffff, 2.2, Math.exp(-ra * 8));
    }
    setCry(S.listener, "uOpen", open); setCry(S.listener, "uGlow", glow); setCry(S.listener, "uWarmK", warm);
    S.listener.scale.set(sc, sc, sc);
    setCry(S.speaker, "uGlow", 0.7 + 0.5 * passed / nb * (silent ? 0.6 : 1) + 0.4 * beatPulse);
    S.waves.forEach(function (w, j) { var age = ra - j * 0.16; w.visible = ra >= 0 && age >= 0 && age < 1.8;
      if (w.visible) { var s = 0.4 + 3.4 * sm(age / 1.8); w.scale.set(s, s, s); w.material.opacity = 0.9 * Math.pow(1 - age / 1.8, 2); } });
    dot(SPK[0], 1.2, 0, C.holo, 1.6, 0.25 + 0.2 * passed / nb); dot(LIS[0], 1.2, 0, C.react, 1.6, 0.25 + (ra >= 0 ? 0.3 : 0));
    // 13. mirror (ER-001)
    var mA = c.id === "ER-001" && ra >= 0.12 ? sm((ra - 0.12) / 0.6) : 0;
    S.mirror.visible = mA > 0.01; if (mA > 0) { setCry(S.mirror, "uAlpha", 0.38 * mA); setCry(S.mirror, "uWarmK", warm); S.mirror.rotation.y = wall * 0.25; }
    // 14. trust nodes (ER-002)
    if (S.nodes) { var fade = dtr !== null ? sm((d - dtr) / 0.5) : 0, appear = sm(d / 1.0);
      for (i = 0; i < S.nodes; i++) { var an = h(i * 7.1) * 6.283 + wall * (0.15 + 0.2 * h(i * 2.3)) * (i % 2 ? 1 : -1), el = (h(i * 5.3) - 0.5) * 1.6, rr = 1.0 + 0.35 * h(i * 9.7);
        var x = LIS[0] + Math.cos(an) * rr * Math.cos(el), y = 1.0 + Math.sin(el) * rr, z = Math.sin(an) * rr * Math.cos(el);
        if (i === 0) dot(LIS[0] + 0.85, 1.95 + 0.06 * Math.sin(wall * 2), 0.3, C.agent, 0.32 + 0.5 * fade, appear * (0.7 + 0.6 * fade));
        else dot(x, y, z, C.agent, 0.16, appear * 0.8 * (1 - fade)); } }
    // 15. scaffold (stake)
    var buildTo = dtr !== null ? dtr : PLAY; var su = S.scaf.material.uniforms; S.scaf.visible = true;
    su.uB.value = cl(d / Math.max(0.5, buildTo), 0, 1) * 1.05; su.uK.value = ra >= 0 ? Math.exp(-ra * 1.5) : 0; su.uA.value = 0.32 + (ra >= 0 ? 0.6 * Math.exp(-ra * 1.5) : 0);
    // 11. rail: cursor, beats, trigger, red dot, marked_by halo
    var cx = railX(c, cs);
    c.beats.forEach(function (t) { dot(railX(c, t), RAIL_Y + 0.02, RAIL_Z, C.holo, 0.16, 0.8); });
    if (c.trig !== null) dot(railX(c, c.trig), RAIL_Y + 0.02, RAIL_Z, C.phrase, 0.22 + (la > 0 ? 0.3 * la : 0), 0.95);
    if (c.tc !== null) { var rx = railX(c, c.tc), pulse = ra >= 0 ? 1 + 1.5 * Math.exp(-ra * 3) : 1;
      dot(rx, RAIL_Y + 0.02, RAIL_Z, C.react, 0.34 * pulse, 1); if (c.marked) dot(rx, RAIL_Y + 0.02, RAIL_Z, c.marked === "human" ? C.human : C.agent, 0.75, 0.35); }
    dot(cx, RAIL_Y + 0.02, RAIL_Z, 0xffffff, 0.3, 0.95); dot(cx, RAIL_Y + 0.02, RAIL_Z, C.holo, 0.8, 0.5);
    S.cursor.position.x = cx;
    // 12. beams
    S.beams.forEach(function (b, j) { var fl = 0.8 + 0.2 * Math.sin(wall * 4 + j); b.core.material.opacity = 0.7 * fl; dot(b.x, RAIL_Y + 0.02, RAIL_Z, b.c, 0.6, 0.8 * fl); });
    applyCam(S.reduced ? blend(CAM.mid, CAM.lis, 0.35) : camFor(c, d));
    S.phase = phaseOf(c, d); S.clipT = cs; finishPool();
  }
  function finishPool() { var g = S.pool.geometry; ["position", "aCol", "aSize", "aAlpha"].forEach(function (k) { g.attributes[k].needsUpdate = true; }); g.setDrawRange(0, S.pool.userData.n); }

  function render() {
    var sc = S.h * S.pr / (2 * Math.tan(S.cam.fov * Math.PI / 360));
    S.pool.material.uniforms.uScale.value = sc; S.stream.material.uniforms.uScale.value = sc;
    S.r.render(S.scene, S.cam); S.tri = S.r.info.render.triangles; S.calls = S.r.info.render.calls; S.pts = S.r.info.render.points;
  }
  function localD() {
    if (S.reduced) { var c = S.clips[S.ci]; return c && c.tc !== null ? dispT(c, c.tc) + 0.35 : PLAY; }
    return S.wt % CYCLE;
  }
  function tick(now) {
    S.raf = 0; if (!S || !S.running) return; now = performance.now();
    var dt = S.last ? Math.min(0.1, Math.max(0, (now - S.last) / 1000)) : 0; S.last = now; S.wt += dt;
    if (S.clips.length && !S.fixed) S.ci = Math.floor(S.wt / CYCLE) % S.clips.length;
    S.fpsAcc += dt; S.fpsN++; if (S.fpsAcc >= 1) { S.fps = Math.round(S.fpsN / S.fpsAcc); S.fpsAcc = 0; S.fpsN = 0; }
    var ci = S.ci; if (ci !== S.built) { S.built = ci; if (S.clips[ci]) buildClip(S.clips[ci]); }
    frame(localD(), S.wt); render(); S.raf = requestAnimationFrame(tick);
  }
  function drawOnce() { if (S.clips[S.ci] && S.built !== S.ci) { S.built = S.ci; buildClip(S.clips[S.ci]); } frame(localD(), S.wt); render(); }
  function sched() {
    if (!S) return; var run = !S.hidden && S.inView && !S.reduced;
    if (run && !S.running) { S.running = true; S.last = 0; S.raf = requestAnimationFrame(tick); }
    else if (!run && S.running) { S.running = false; if (S.raf) cancelAnimationFrame(S.raf); S.raf = 0; }
    if (!run) drawOnce();
  }
  function resize() {
    var w = Math.max(1, S.el.clientWidth || 640), hh = S.el.clientHeight || Math.round(w * 0.5625);
    S.w = w; S.h = hh; S.r.setSize(w, hh, false); S.cam.aspect = w / hh; S.cam.fov = w / hh < 1 ? 46 : 40; S.cam.updateProjectionMatrix();
    if (!S.running) drawOnce();
  }
  function overlay(on) {
    if (on && !S.ov) { var o = document.createElement("div"), lang = (document.documentElement.lang || "ru").slice(0, 2);
      o.textContent = lang === "en" ? "NO DATA" : lang === "de" ? "KEINE DATEN" : "НЕТ ДАННЫХ";
      o.style.cssText = "position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;font:600 14px/1 monospace;letter-spacing:.2em;color:#6fe6ff;opacity:.8;pointer-events:none";
      S.el.appendChild(o); S.ov = o; }
    if (!on && S.ov) { S.ov.remove(); S.ov = null; }
  }

  window.OrbClips3D = {
    init: function (el) {
      if (S || !el || !T) return !!S;
      var cv = document.createElement("canvas"), ok = false;
      try { ok = !!(window.WebGLRenderingContext && (cv.getContext("webgl") || cv.getContext("experimental-webgl"))); } catch (e) { ok = false; }
      if (!ok) return false;
      var r; try { r = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: false, powerPreference: "high-performance" }); } catch (e) { return false; }
      S = { el: el, r: r, cv: cv, clips: [], ci: 0, built: -1, wt: 0, streamT: 0, cc: {}, fps: 0, fpsAcc: 0, fpsN: 0, inView: true, hidden: document.hidden, running: false, slabs: [], beams: [], nodes: 0, phase: "nodata" };
      S.pr = Math.min(window.devicePixelRatio || 1, 2); r.setPixelRatio(S.pr); r.setClearColor(C.bg, 1);
      cv.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y"; if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.appendChild(cv);
      var sc = S.scene = new T.Scene(); S.cam = new T.PerspectiveCamera(40, 16 / 9, 0.1, 100);
      var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null; S.reduced = /[?&]reduced/.test(location.search) || !!(mq && mq.matches);
      if (mq && mq.addEventListener) mq.addEventListener("change", function () { S.reduced = mq.matches; sched(); });
      var geo = crystalGeo();
      S.speaker = crystal(geo, C.holo); S.speaker.position.set(SPK[0], SPK[1], SPK[2]); S.speaker.rotation.y = 0.5;
      S.listener = crystal(geo, C.react); S.listener.position.set(LIS[0], LIS[1], LIS[2]); S.listener.rotation.y = -0.5;
      S.mirror = crystal(geo, C.react); S.mirror.position.set(LIS[0], FLOOR + 4.9, 0); S.mirror.scale.set(0.7, -0.7, 0.7); S.mirror.visible = false;
      sc.add(S.speaker, S.listener, S.mirror);
      // floor grid (holo)
      var fp = [], k; for (k = 1; k <= 4; k++) for (var j = 0; j < 48; j++) { var a0 = j / 48 * 6.283, a1 = (j + 1) / 48 * 6.283, rr = k * 1.5; fp.push(Math.cos(a0) * rr, FLOOR, Math.sin(a0) * rr * 0.5, Math.cos(a1) * rr, FLOOR, Math.sin(a1) * rr * 0.5); }
      for (k = 0; k < 12; k++) { var a = k / 12 * 6.283; fp.push(0, FLOOR, 0, Math.cos(a) * 6, FLOOR, Math.sin(a) * 3); }
      var fg = new T.BufferGeometry(); fg.setAttribute("position", new T.Float32BufferAttribute(fp, 3)); sc.add(new T.LineSegments(fg, lineMat(C.holo, 0.07)));
      S.stream = makeStream(); sc.add(S.stream);
      var qg = new T.CylinderGeometry(0.012, 0.012, 5.4, 6, 1, true); qg.rotateZ(Math.PI / 2);
      S.qbeam = new T.Mesh(qg, basic(C.react, 0.2)); S.qbeam.position.set(0, 1.45, 0); sc.add(S.qbeam);
      S.bolt = ribbon(28, C.phrase, 0.3); S.boltCore = ribbon(28, 0xffe2a8, 1); sc.add(S.bolt, S.boltCore);
      S.ring = new T.Mesh(new T.RingGeometry(0.5, 0.53, 64), basic(C.phrase, 0.5)); S.ring.rotation.y = Math.PI / 2; S.ring.position.set(1.95, 1.3, 0); sc.add(S.ring);
      S.waves = []; for (k = 0; k < 4; k++) { var w = new T.Mesh(new T.RingGeometry(0.46, 0.5, 64), basic(C.react, 0.8)); w.position.set(LIS[0], 1.2, 0);
        if (k % 2 === 0) w.rotation.x = Math.PI / 2; else w.rotation.set(0.2, -0.5, 0); w.visible = false; S.waves.push(w); sc.add(w); }
      S.unitBox = new T.BoxGeometry(1, 1, 1); S.slabGeo = new T.BoxGeometry(0.62, 0.05, 0.62); S.slabEdge = new T.EdgesGeometry(S.slabGeo);
      S.beamGeo = new T.CylinderGeometry(0.02, 0.02, 1.6, 8, 1, true); S.beamHalo = new T.CylinderGeometry(0.11, 0.11, 1.6, 10, 1, true); // Claude: короче, чтобы лучи не перекрывали слушающего на крупном плане
      var rail = new T.Mesh(S.unitBox, basic(C.holo, 0.55)); rail.scale.set(RAIL_X1 - RAIL_X0, 0.02, 0.03); rail.position.set(0, RAIL_Y, RAIL_Z); sc.add(rail);
      var rb = new T.Mesh(new T.PlaneGeometry(RAIL_X1 - RAIL_X0 + 0.3, 0.32), basic(C.holo, 0.06)); rb.rotation.x = -Math.PI / 2; rb.position.set(0, RAIL_Y - 0.01, RAIL_Z); sc.add(rb);
      S.cursor = new T.Mesh(S.unitBox, basic(0xffffff, 0.6)); S.cursor.scale.set(0.012, 0.22, 0.012); S.cursor.position.set(RAIL_X0, RAIL_Y + 0.1, RAIL_Z); sc.add(S.cursor);
      S.clipGrp = new T.Group(); sc.add(S.clipGrp); S.scaf = new T.Object3D();
      S.scaf.material = { uniforms: { uB: {}, uK: {}, uA: {} } }; // placeholder until first clip
      S.pool = makePool(); sc.add(S.pool);
      S.onVis = function () { S.hidden = document.hidden; sched(); }; document.addEventListener("visibilitychange", S.onVis);
      if (window.IntersectionObserver) { S.io = new IntersectionObserver(function (e) { S.inView = e[0].isIntersecting; sched(); }, { threshold: 0.01 }); S.io.observe(el); }
      if (window.ResizeObserver) { S.ro = new ResizeObserver(resize); S.ro.observe(el); } else window.addEventListener("resize", resize);
      resize(); overlay(false); sched(); return true;
    },
    update: function (data) {
      if (!S) return; S.clips = parse(data); S.built = -1;
      if (S.ci >= S.clips.length) S.ci = 0; overlay(!S.clips.length); if (!S.running) drawOnce();
    },
    show: function (i) { if (!S || !S.clips.length) return; S.ci = ((i | 0) % S.clips.length + S.clips.length) % S.clips.length; S.wt = S.ci * CYCLE; if (!S.running) drawOnce(); },
    seek: function (sec) { if (!S) return; S.wt = Math.max(0, +sec || 0); if (S.clips.length) S.ci = Math.floor(S.wt / CYCLE) % S.clips.length; drawOnce(); }, // test/video hook
    stats: function () {
      if (!S) return { webgl: false };
      var c = S.clips[S.ci];
      return { webgl: true, clips: S.clips.length, clip: c ? c.id : null, phase: S.phase, clip_t_s: c ? Math.round(S.clipT * 10) / 10 : null,
        cycle_s: CYCLE, triangles: S.tri, calls: S.calls, points: S.pts, fps: S.fps, running: S.running, reduced: S.reduced, pixelRatio: S.pr,
        beams: S.beams.length, steps: S.slabs.length };
    },
    destroy: function () {
      if (!S) return; S.running = false; if (S.raf) cancelAnimationFrame(S.raf);
      document.removeEventListener("visibilitychange", S.onVis); S.io && S.io.disconnect(); S.ro && S.ro.disconnect();
      overlay(false); S.r.dispose(); S.cv.remove(); S = null;
    }
  };
})();
