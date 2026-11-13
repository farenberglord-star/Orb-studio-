/* orbcore3d.js - "Ядро эфира ORB-7" for the orbstudio.org main page (preview build, not deployed)
   window.OrbCore3D = { init(el) -> true/false, update({radars, broadcast, impulses}), speak(level 0..1), stats(), destroy() }
   radars    = GET /api/v1/radars response (or its radars[] array)
   broadcast = GET /api/v1/broadcast/latest response
   impulses  = GET /api/v1/impulses response (or its impulses[] array)
   three.js r128 core only (cdnjs). No models/textures/fonts: everything is procedural shaders.
   Own post: HDR scene -> bright pass -> 2-level gaussian bloom -> ACES. All HTML text via textContent, links https only.
   Deterministic (no random numbers): phases/directions from hash(id / headline). Pauses when hidden/offscreen;
   prefers-reduced-motion; touch-action: pan-y. No data -> calm core without orbits, no errors. */
(function () {
  "use strict";
  var T, el, ren, scene, cam, ok = false, raf = 0, onScreen = true, io = null, ro = null, rmTimer = 0;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var st = { frames: 0, tris: 0, calls: 0, fps: 0, hdr: false, d: {} };
  var view = { off: 0, auto: true, idle: 0, drag: false, px: 0, py: 0, gx: 0, gy: 0, t0: null, lt: 0, sw: 0, sx: 0, sy: 0, o0: 0, pid: null };
  var RT = {}, FS = {}, U = {}, objs = {}, dyn = null, ui = {}, fpsT = [], listeners = [];
  var model = { radars: [], items: [], imp: [], anchor: null, live: false }, seq = [], seqT0 = 0, curKey = -1, typed = -1;
  var spk = { target: 0, v: 0, last: -1e9 }, coreCol, coreTgt, tmpC, tmpV, tmpV2, cv0, risk0 = null;
  var ORDER = ["geo", "politics", "economy", "budget", "crypto", "energy", "justice", "web"];
  var HUE = { geo: 352, politics: 318, economy: 212, budget: 146, crypto: 268, energy: 36, justice: 28, web: 186 };
  // 3 tilted belts; every orbit has its own radius, so no two orbits can ever cross
  var SLOT = { geo: [0, 1.72], politics: [0, 1.94], economy: [0, 2.16], budget: [1, 2.52], crypto: [1, 2.74], energy: [1, 2.96], justice: [2, 3.32], web: [2, 3.56] };
  var BELT = [[0.30, 0.15], [-0.40, 1.05], [0.58, -0.85]]; // [tilt, yaw]
  var CYC = 6.5, FLY = 1.35, CORE_R = 1.15;

  function now() { return performance.now(); }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function isStr(x) { return typeof x === "string" && x.trim() !== ""; }
  function num(x) { return typeof x === "number" && isFinite(x) ? x : null; }
  function https(u) { return isStr(u) && /^https:\/\/[^\s]+$/i.test(u) ? u : null; }
  function lang() { var l = (document.documentElement.lang || "ru").toLowerCase(); return l.indexOf("de") === 0 ? "de" : l.indexOf("en") === 0 ? "en" : "ru"; }
  function hsl(h, s, l, out) { out = out || new T.Color(); out.setHSL(h / 360, s, l); out.convertSRGBToLinear(); return out; }
  function on(t, ev, fn, o) { t.addEventListener(ev, fn, o); listeners.push([t, ev, fn, o]); }

  /* ---------- shaders ---------- */
  var NOISE = "float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\n" +
    "float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}\n";
  function addMat(u, vs, fs, side, extra) {
    var m = new T.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs, transparent: true, depthWrite: false, depthTest: false, blending: T.AdditiveBlending, side: side || T.FrontSide });
    if (extra) for (var k in extra) m[k] = extra[k]; return m;
  }
  function mk(geo, mat, order, parent) { var m = new T.Mesh(geo, mat); m.renderOrder = order; m.frustumCulled = false; (parent || scene).add(m); return m; }

  function buildStatic() {
    U = { uT: { value: 0 }, uCol: { value: new T.Color() }, uFlash: { value: 0 }, uSpk: { value: 0 }, uBreath: { value: 0 }, uAmp: { value: 0.3 },
      uScale: { value: 400 }, uCalm: { value: 1 } };
    // backdrop: deep space with faint nebula tinted by the core colour
    objs.bg = mk(new T.SphereGeometry(60, 24, 12), new T.ShaderMaterial({ uniforms: U, side: T.BackSide, depthWrite: false, depthTest: false,
      vertexShader: "varying vec3 vD; void main(){ vD=normalize(position); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",
      fragmentShader: "uniform vec3 uCol; uniform float uT; varying vec3 vD;\n" + NOISE +
        "void main(){ vec2 p=vec2(atan(vD.x,vD.z)*1.6, vD.y*3.); float n=vn(p*1.3+uT*0.01)*0.6+vn(p*3.1-uT*0.015)*0.4;\n" +
        " vec3 c=mix(vec3(0.004,0.006,0.016),vec3(0.010,0.016,0.040),0.5+0.5*vD.y); c+=uCol*pow(n,3.)*0.05+vec3(0.02,0.0,0.05)*pow(vn(p*0.7+3.),4.)*0.6; gl_FragColor=vec4(c,1.); }" }), -20);
    // stars
    var N = 700, sp = new Float32Array(N * 3), sa = new Float32Array(N), i;
    for (i = 0; i < N; i++) { var u = hash("su" + i) * 2 - 1, th = hash("st" + i) * 6.2832, r = 30 + hash("sr" + i) * 14, q = Math.sqrt(1 - u * u);
      sp[i * 3] = r * q * Math.cos(th); sp[i * 3 + 1] = r * u; sp[i * 3 + 2] = r * q * Math.sin(th); sa[i] = hash("sa" + i); }
    var sg = new T.BufferGeometry(); sg.setAttribute("position", new T.BufferAttribute(sp, 3)); sg.setAttribute("aS", new T.BufferAttribute(sa, 1));
    objs.stars = new T.Points(sg, addMat(U, "uniform float uT,uScale; attribute float aS; varying float vA; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vA=(0.25+0.75*aS)*(0.6+0.4*sin(uT*(0.7+aS*2.)+aS*40.)); gl_PointSize=max(1.,(0.06+0.1*aS)*uScale/-mv.z); gl_Position=projectionMatrix*mv; }",
      "varying float vA; void main(){ vec2 q=gl_PointCoord-0.5; float d=dot(q,q)*4.; gl_FragColor=vec4(vec3(0.7,0.8,1.)*vA*(1.-d)*1.2,1.); }"));
    objs.stars.renderOrder = -19; objs.stars.frustumCulled = false; scene.add(objs.stars);
    // radar scope behind the core (bearing 0 = north = up), range rings, ticks, sweep
    objs.scope = mk(new T.PlaneGeometry(11, 11), addMat(U, "varying vec2 vP; void main(){ vP=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }",
      "uniform vec3 uCol; uniform float uT,uCalm; varying vec2 vP;\n" +
      "float ln(float x,float w){ return 1.-smoothstep(0.,w,abs(x)); }\n" +
      "void main(){ float r=length(vP); if(r>5.4) discard; float a=atan(vP.x,vP.y); float b=fract(a/6.28318+1.);\n" +
      " float rings=0.; rings+=ln(r-1.72,0.012)*0.5+ln(r-2.52,0.012)*0.5+ln(r-3.32,0.012)*0.5+ln(r-4.4,0.02)*1.2;\n" +
      " float tk=fract(b*72.); float t1=step(4.45,r)*step(r,4.62)*(1.-smoothstep(0.,0.05,min(tk,1.-tk)));\n" +
      " float tc=fract(b*4.); float t2=step(4.4,r)*step(r,5.0)*(1.-smoothstep(0.,0.004,min(tc,1.-tc)));\n" +
      " float spokes=0.; float ts=fract(b*12.); spokes=(1.-smoothstep(0.,0.002*6.28/max(r,0.3)*3.,min(ts,1.-ts)/1.))*step(1.3,r)*step(r,4.4)*0.25;\n" +
      " float sw=fract(b-uT*0.07); float sweep=(exp(-sw*45.)*0.55+exp(-sw*12.)*0.05)*smoothstep(0.999,0.985,sw)*step(r,4.4)*smoothstep(1.0,1.6,r)*(1.-uCalm*0.6);\n" +
      " vec3 base=mix(vec3(0.12,0.5,0.9),uCol,0.2); float f=smoothstep(5.4,3.8,r);\n" +
      " vec3 c=base*(rings*0.32+t1*0.5+t2*0.9+spokes*0.18)*f + base*sweep*0.22 + uCol*sweep*ln(r-4.4,0.05)*0.5;\n" +
      " gl_FragColor=vec4(c*0.55,1.); }"), -15);
    objs.scope.position.set(0, 0, -1.7);
    // halo + speaker ripples + absorption shockwave (camera-facing quad)
    var hv = "uniform float uScale; varying vec2 vUv; void main(){ vUv=uv; vec4 mv=modelViewMatrix*vec4(0.,0.,0.,1.); mv.xy+=position.xy; gl_Position=projectionMatrix*mv; }";
    objs.halo = mk(new T.PlaneGeometry(10, 10), addMat(U, hv,
      "uniform vec3 uCol; uniform float uT,uFlash,uSpk,uAmp,uBreath; varying vec2 vUv;\n" +
      "float ring(float d,float r,float w){ return exp(-pow((d-r)/w,2.)); }\n" +
      "void main(){ float d=length(vUv-0.5)*2.; float g=0.45*exp(-d*10.)+0.10*exp(-d*4.)+0.012*exp(-d*1.6); g*=0.8+uAmp*0.6+uBreath*6.;\n" +
      " float sp=0.; for(int k=0;k<3;k++){ float f=fract(uT*0.85+float(k)/3.); sp+=ring(d,0.24+f*0.55,0.012+f*0.02)*(1.-f)*(1.-f); }\n" +
      " float sh=ring(d,0.235+(1.-uFlash)*0.62,0.02+0.05*(1.-uFlash))*uFlash*uFlash;\n" +
      " vec3 c=uCol*(g*(1.+uFlash*1.6+uSpk*0.8)+sp*uSpk*1.6+sh*2.2); c+=vec3(1.)*exp(-d*18.)*(0.25+uFlash); gl_FragColor=vec4(c,1.); }"), -10);
    // shell (back + front faces), shared uniforms
    var shellV = "uniform float uT,uSpk,uBreath; varying vec3 vN,vV,vP; void main(){ vec3 p=position; vP=position/" + CORE_R.toFixed(2) + ";\n" +
      " float k=1.+uBreath+uSpk*(0.05+0.035*sin(vP.y*10.-uT*16.)); p*=k; vec4 mv=modelViewMatrix*vec4(p,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }";
    var shellF = "uniform vec3 uCol; uniform float uT,uFlash,uSpk,uAmp,uSide; varying vec3 vN,vV,vP;\n" + NOISE +
      "float gl(float x,float w){ float f=fract(x); return 1.-smoothstep(0.,w,min(f,1.-f)); }\n" +
      "void main(){ float f=1.-abs(dot(normalize(vN),normalize(vV))); float rim=pow(f,2.4);\n" +
      " float lon=atan(vP.z,vP.x)/6.28318+uT*0.012, lat=asin(clamp(vP.y,-1.,1.))/3.14159;\n" +
      " float grid=max(gl(lon*36.,0.035),gl(lat*18.,0.05))*(0.35+0.65*smoothstep(0.85,0.95,abs(sin(lat*3.14159*6.))));\n" +
      " vec2 hc=vec2(lon*48.,lat*24.); float cell=step(0.86,h21(floor(hc)+floor(uT*1.3)))*gl(hc.x,0.18)*0.0+step(0.93,h21(floor(hc)+floor(uT*0.8)))*0.6;\n" +
      " float band=exp(-pow((vP.y-(fract(uT*0.16)*2.6-1.3))*7.,2.));\n" +
      " float scan=0.5+0.5*sin(vP.y*90.-uT*3.);\n" +
      " vec3 c=uCol*(rim*(0.9+0.7*uAmp)+grid*(0.35+0.6*f)+cell*0.3*(0.3+f)+band*(0.2+0.5*f)) *(0.85+0.15*scan) + vec3(0.9,0.97,1.)*pow(f,6.)*0.6;\n" +
      " c*=uSide*(1.+uFlash*1.8+uSpk*0.6); gl_FragColor=vec4(c,1.); }";
    var sgeo = new T.SphereGeometry(CORE_R, 64, 40);
    var Ub = Object.assign({}, U, { uSide: { value: 0.32 } }), Uf = Object.assign({}, U, { uSide: { value: 1 } });
    objs.shellB = mk(sgeo, addMat(Ub, shellV, shellF, T.BackSide), -8);
    // particle cloud swirling inside the shell
    var PN = 1600, pa = new Float32Array(PN * 3), pp = new Float32Array(PN * 3);
    for (i = 0; i < PN; i++) { var rr = 0.25 + 0.83 * Math.pow(hash("pr" + i), 0.6); pa[i * 3] = rr; pa[i * 3 + 1] = Math.acos(hash("pu" + i) * 2 - 1); pa[i * 3 + 2] = hash("pt" + i) * 6.2832; }
    var pg = new T.BufferGeometry(); pg.setAttribute("position", new T.BufferAttribute(pp, 3)); pg.setAttribute("aSeed", new T.BufferAttribute(pa, 3));
    objs.parts = new T.Points(pg, addMat(U, "uniform float uT,uScale,uBreath,uSpk,uFlash; attribute vec3 aSeed; varying float vA; varying float vR;\n" +
      "void main(){ float r=aSeed.x*(1.+uBreath*1.4+uSpk*0.08)*(1.-uFlash*0.12); float th=aSeed.z+uT*(0.32/(r+0.25)); float ph=aSeed.y+0.25*sin(uT*0.3+aSeed.z*3.);\n" +
      " vec3 p=vec3(r*sin(ph)*cos(th),r*cos(ph),r*sin(ph)*sin(th)); vec4 mv=modelViewMatrix*vec4(p,1.); vR=aSeed.x;\n" +
      " vA=0.5+0.5*sin(uT*2.+aSeed.z*17.); gl_PointSize=max(1.,(0.035+0.02*vA)*uScale/-mv.z); gl_Position=projectionMatrix*mv; }",
      "uniform vec3 uCol; uniform float uFlash; varying float vA; varying float vR; void main(){ vec2 q=gl_PointCoord-0.5; float d=1.-dot(q,q)*4.; if(d<0.) discard;\n" +
      " vec3 c=mix(vec3(1.),uCol,smoothstep(0.2,0.9,vR))*(0.4+vA)*d*(1.+uFlash); gl_FragColor=vec4(c*0.4,1.); }"));
    objs.parts.renderOrder = -7; objs.parts.frustumCulled = false; scene.add(objs.parts);
    // inner geometric lattice: geodesic + counter-rotating inner polyhedron + glowing nodes
    objs.lat = new T.Group(); scene.add(objs.lat); objs.lat2 = new T.Group(); scene.add(objs.lat2);
    var lineV = "uniform float uT; varying float vF; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec4 c=modelViewMatrix*vec4(0.,0.,0.,1.); vF=clamp(0.55+(mv.z-c.z)*0.6,0.15,1.2); gl_Position=projectionMatrix*mv; }";
    var lineF = "uniform vec3 uCol; uniform float uFlash,uAmp,uSpk,uK; varying float vF; void main(){ gl_FragColor=vec4(mix(uCol,vec3(1.),0.35)*vF*uK*(1.+uFlash*2.+uSpk),1.); }";
    var lg = new T.EdgesGeometry(new T.IcosahedronGeometry(0.9, 1)), lg2 = new T.EdgesGeometry(new T.OctahedronGeometry(0.52, 0));
    var l1 = new T.LineSegments(lg, addMat(Object.assign({}, U, { uK: { value: 1.1 } }), lineV, lineF)); l1.renderOrder = -6; l1.frustumCulled = false; objs.lat.add(l1);
    var l2 = new T.LineSegments(lg2, addMat(Object.assign({}, U, { uK: { value: 1.6 } }), lineV, lineF)); l2.renderOrder = -6; l2.frustumCulled = false; objs.lat2.add(l2);
    var ip = new T.IcosahedronGeometry(0.9, 1).attributes.position, seen = {}, nv = [];
    for (i = 0; i < ip.count; i++) { var key = [ip.getX(i), ip.getY(i), ip.getZ(i)].map(function (x) { return x.toFixed(3); }).join(); if (!seen[key]) { seen[key] = 1; nv.push(ip.getX(i), ip.getY(i), ip.getZ(i)); } }
    var ng = new T.BufferGeometry(); ng.setAttribute("position", new T.Float32BufferAttribute(nv, 3));
    var nodes = new T.Points(ng, addMat(U, "uniform float uScale; varying float vF; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vec4 c=modelViewMatrix*vec4(0.,0.,0.,1.); vF=clamp(0.5+(mv.z-c.z)*0.7,0.1,1.2); gl_PointSize=0.16*uScale/-mv.z; gl_Position=projectionMatrix*mv; }",
      "uniform vec3 uCol; uniform float uFlash; varying float vF; void main(){ vec2 q=gl_PointCoord-0.5; float d=dot(q,q)*4.; if(d>1.) discard; gl_FragColor=vec4(mix(uCol,vec3(1.),0.6)*vF*(exp(-d*5.)*1.6)*(1.+uFlash),1.); }"));
    nodes.renderOrder = -6; nodes.frustumCulled = false; objs.lat.add(nodes);
    // nucleus
    objs.nuc = mk(new T.SphereGeometry(0.22, 28, 18), addMat(U, "uniform float uBreath,uSpk; varying vec3 vN,vV; void main(){ vec4 mv=modelViewMatrix*vec4(position*(1.+uBreath*3.+uSpk*0.35),1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }",
      "uniform vec3 uCol; uniform float uFlash,uSpk,uAmp; varying vec3 vN,vV; void main(){ float f=abs(dot(normalize(vN),normalize(vV))); vec3 c=mix(uCol,vec3(1.),0.55+0.4*f)*(0.9+1.6*f*f*f)*(0.7+uAmp*0.5+uFlash*1.5+uSpk*1.2); gl_FragColor=vec4(c,1.); }"), -5);
    objs.shellF = mk(sgeo, addMat(Uf, shellV, shellF), -4);
    // news shard + trail
    objs.shard = mk(new T.OctahedronGeometry(0.15, 0), addMat(U, "varying vec3 vN,vV; void main(){ vec4 mv=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }",
      "uniform vec3 uSh; varying vec3 vN,vV; void main(){ float f=1.-abs(dot(normalize(vN),normalize(vV))); gl_FragColor=vec4(mix(vec3(1.),uSh,f)*(2.2+3.*f),1.); }"), 6);
    objs.shard.material.uniforms = Object.assign({}, U, { uSh: { value: new T.Color(1, 1, 1) } }); objs.shard.scale.set(0.55, 0.55, 2.4); objs.shard.visible = false;
    var TN = 36, tg = new T.BufferGeometry(), tpos = new Float32Array(TN * 3), tk = new Float32Array(TN);
    for (i = 0; i < TN; i++) tk[i] = i / (TN - 1);
    tg.setAttribute("position", new T.BufferAttribute(tpos, 3)); tg.setAttribute("aK", new T.BufferAttribute(tk, 1));
    objs.trail = new T.Points(tg, addMat(objs.shard.material.uniforms, "uniform float uScale; attribute float aK; varying float vK; void main(){ vK=aK; vec4 mv=modelViewMatrix*vec4(position,1.); gl_PointSize=max(1.,(0.26*(1.-aK)+0.03)*uScale/-mv.z); gl_Position=projectionMatrix*mv; }",
      "uniform vec3 uSh; varying float vK; void main(){ vec2 q=gl_PointCoord-0.5; float d=dot(q,q)*4.; if(d>1.) discard; gl_FragColor=vec4(mix(vec3(1.),uSh,vK*0.8+0.2)*exp(-d*4.)*(1.-vK)*1.8,1.); }"));
    objs.trail.renderOrder = 5; objs.trail.frustumCulled = false; objs.trail.visible = false; scene.add(objs.trail);
  }

  /* ---------- data ---------- */
  function arr(x, k) { return Array.isArray(x) ? x : (x && Array.isArray(x[k]) ? x[k] : []); }
  function normalize(d) {
    var m = { radars: [], items: [], imp: [], anchor: null, greeting: null, signoff: null, live: false, missing: [], dup: 0, impSkipped: 0, itemsSkipped: 0, unknown: 0 };
    if (!d || typeof d !== "object") return m;
    var seenR = {};
    arr(d.radars, "radars").forEach(function (r) {
      if (!r || !isStr(r.id)) return; var id = r.id.trim().toLowerCase(); if (!HUE.hasOwnProperty(id)) { m.unknown++; return; } if (seenR[id]) return; seenR[id] = 1;
      var ri = num(r.risk_index); m.radars.push({ id: id, title: isStr(r.title) ? r.title : null, title_de: isStr(r.title_de) ? r.title_de : null, title_en: isStr(r.title_en) ? r.title_en : null,
        risk: ri == null ? null : clamp(ri, 0, 100), delta: num(r.delta_24h), updated: isStr(r.updated_at) ? r.updated_at : null });
    });
    ORDER.forEach(function (id) { if (!seenR[id]) m.missing.push("radar:" + id); });
    var b = d.broadcast && typeof d.broadcast === "object" ? d.broadcast : null;
    if (b) {
      m.anchor = isStr(b.anchor) ? b.anchor : null;
      ["greeting", "signoff"].forEach(function (k) { var g = b[k]; if (isStr(g)) m[k] = { ru: g, de: g, en: g }; else if (g && typeof g === "object" && (isStr(g.ru) || isStr(g.de) || isStr(g.en))) m[k] = g; });
      arr(b.items, "items").forEach(function (it) {
        if (!it || typeof it !== "object") return;
        var lines = { ru: isStr(it.line_ru) ? it.line_ru : null, de: isStr(it.line_de) ? it.line_de : null, en: isStr(it.line_en) ? it.line_en : null };
        var head = isStr(it.headline) ? it.headline : null;
        if (!lines.ru && !lines.de && !lines.en && !head) { m.itemsSkipped++; return; }
        var rid = isStr(it.radar) ? it.radar.trim().toLowerCase() : null; if (rid && !HUE.hasOwnProperty(rid)) rid = null;
        m.items.push({ radar: rid, lines: lines, headline: head, source: isStr(it.source) ? it.source : null, time: isStr(it.time) ? it.time : null, link: https(it.link), risk: num(it.risk_index),
          key: head || lines.en || lines.ru || lines.de });
      });
    }
    var seenI = {}, locals = 0;
    arr(d.impulses, "impulses").forEach(function (p) {
      if (!p || typeof p !== "object") return; var rid = isStr(p.radar) ? p.radar.trim().toLowerCase() : null, s = num(p.strength);
      if (!rid || !HUE.hasOwnProperty(rid) || s == null) { m.impSkipped++; return; }
      var bd = num(p.bearing_deg), loc = p.local === true;
      if (!loc && bd == null) { m.impSkipped++; return; }
      var k = rid + "|" + (loc ? "L|" + (p.to_name || p.from_name || p.id || "") : Math.round(bd)); if (seenI[k]) { seenI[k].s = Math.max(seenI[k].s, clamp(s, 0, 1)); m.dup++; return; }
      var o = { radar: rid, s: clamp(s, 0, 1), local: loc, bearing: loc ? null : ((bd % 360) + 360) % 360, id: isStr(p.id) ? p.id : k, li: loc ? locals++ : -1 };
      seenI[k] = o; m.imp.push(o);
    });
    m.live = m.radars.length > 0 || m.items.length > 0;
    return m;
  }
  function radarById(id) { for (var i = 0; i < model.radars.length; i++) if (model.radars[i].id === id) return model.radars[i]; return null; }
  function titleOf(r, L) { return (L === "de" ? r.title_de : L === "en" ? r.title_en : r.title) || r.title || r.title_en || r.title_de || null; }

  /* ---------- dynamic (data-driven) objects ---------- */
  function disposeDyn() {
    if (!dyn) return; dyn.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); }); scene.remove(dyn); dyn = null; objs.orb = objs.sats = objs.imp = null;
  }
  function beltMatrix(b) { var m = new T.Matrix4(), q = new T.Matrix4(); m.makeRotationY(BELT[b][1]); m.multiply(q.makeRotationZ(BELT[b][0])); m.multiply(q.makeRotationX(Math.PI / 2)); return m; }
  function mergeGeos(list) { // list of [BufferGeometry(non-indexed or indexed), {attrName: [values per vertex...] or scalar arrays}]
    var P = [], N = [], UV = [], ex = {}, i, k;
    list.forEach(function (it) {
      var g = it[0].index ? it[0].toNonIndexed() : it[0], A = g.attributes.position, Nn = g.attributes.normal, Uv = g.attributes.uv;
      for (i = 0; i < A.count; i++) { P.push(A.getX(i), A.getY(i), A.getZ(i)); N.push(Nn.getX(i), Nn.getY(i), Nn.getZ(i)); UV.push(Uv.getX(i), Uv.getY(i));
        for (k in it[1]) { ex[k] = ex[k] || []; var v = it[1][k]; if (v.length) for (var j = 0; j < v.length; j++) ex[k].push(v[j]); else ex[k].push(v); } }
      if (g !== it[0]) g.dispose(); it[0].dispose();
    });
    var out = new T.BufferGeometry(); out.setAttribute("position", new T.Float32BufferAttribute(P, 3)); out.setAttribute("normal", new T.Float32BufferAttribute(N, 3)); out.setAttribute("uv", new T.Float32BufferAttribute(UV, 2));
    for (k in ex) out.setAttribute(k, new T.Float32BufferAttribute(ex[k], ex[k].length / (P.length / 3))); return out;
  }
  function build() {
    disposeDyn(); dyn = new T.Group(); scene.add(dyn);
    var orbList = [], sats = [], c = new T.Color();
    objs.orbs = [];
    model.radars.forEach(function (r) {
      var sl = SLOT[r.id], m = beltMatrix(sl[0]), g = new T.TorusGeometry(sl[1], r.risk == null ? 0.008 : 0.014, 4, 180); g.applyMatrix4(m);
      hsl(HUE[r.id], 0.9, 0.6, c); var start = hash("start" + r.id), dir = r.delta == null ? 0 : r.delta > 0 ? 1 : r.delta < 0 ? -1 : 0;
      orbList.push([g, { aCol: [c.r, c.g, c.b], aRisk: r.risk == null ? -1 : r.risk / 100, aStart: start, aIdx: objs.orbs.length, aDir: dir }]);
      var speed = r.delta == null ? 0 : 0.012 + 0.11 * Math.pow(Math.min(Math.abs(r.delta), 40) / 40, 0.7);
      objs.orbs.push({ r: r, m: m, rad: sl[1], start: start, dir: dir, speed: r.delta === 0 ? 0 : speed, ph: hash("ph" + r.id), col: c.clone(), sat: r.delta != null });
    });
    if (orbList.length) {
      var og = mergeGeos(orbList), n = objs.orbs.length;
      objs.orb = mk(og, addMat({ uT: U.uT, uHead: { value: new Float32Array(8) } },
        "uniform float uHead[8]; attribute vec3 aCol; attribute float aRisk,aStart,aIdx,aDir; varying vec3 vCol; varying float vRisk,vStart,vDir,vHead,vA,vF,vE;\n" +
        "void main(){ vCol=aCol; vRisk=aRisk; vStart=aStart; vDir=aDir; vA=uv.x; int ix=int(aIdx+0.5); float h=0.; for(int i=0;i<8;i++){ if(i==ix) h=uHead[i]; } vHead=h;\n" +
        " vec4 mv=modelViewMatrix*vec4(position,1.); vec4 cc=viewMatrix*vec4(0.,0.,0.,1.); float behind=step(mv.z,cc.z); float lat=length(mv.xy-cc.xy);\n" +
        " vF=mix(1.,0.45,behind*smoothstep(0.,0.6,cc.z-mv.z))*mix(1.,0.22,behind*(1.-smoothstep(" + (CORE_R * 0.9).toFixed(2) + "," + (CORE_R * 1.08).toFixed(2) + ",lat)));\n" +
        " vE=pow(1.-abs(dot(normalize(normalMatrix*normal),normalize(-mv.xyz))),1.5); gl_Position=projectionMatrix*mv; }",
        "uniform float uT; varying vec3 vCol; varying float vRisk,vStart,vDir,vHead,vA,vF,vE;\n" +
        "void main(){ float a=vA; float base, arc=0., tail=0., cap=0.;\n" +
        " if(vRisk<0.){ base=0.16*step(0.5,fract(a*90.)); } else { base=0.16; float rel=fract(a-vStart); arc=step(rel,vRisk)*(0.55+0.45*rel/max(vRisk,0.01)); cap=exp(-pow((rel-vRisk)*160.,2.))*step(0.001,vRisk)*1.6; arc*=0.85+0.15*sin(rel*220.-uT*3.); }\n" +
        " if(vDir!=0.){ float d=fract((vHead-a)*vDir); tail=exp(-d*14.)*1.4; }\n" +
        " vec3 tc = vDir>0. ? mix(vCol,vec3(1.,0.97,0.9),0.55) : mix(vCol*0.55,vec3(0.25,0.4,0.95),0.45);\n" +
        " vec3 c=vCol*(base+arc*1.25+cap)*(0.6+0.6*vE)+tc*tail; gl_FragColor=vec4(c*vF,1.); }"), 2, dyn);
      // satellites: one glow point per radar with known delta
      var sp = new Float32Array(objs.orbs.length * 3), scol = new Float32Array(objs.orbs.length * 3), ssz = new Float32Array(objs.orbs.length);
      objs.orbs.forEach(function (o, i) { scol[i * 3] = o.col.r; scol[i * 3 + 1] = o.col.g; scol[i * 3 + 2] = o.col.b; ssz[i] = o.sat ? 1 : 0; });
      var sg = new T.BufferGeometry(); sg.setAttribute("position", new T.BufferAttribute(sp, 3)); sg.setAttribute("aCol", new T.BufferAttribute(scol, 3)); sg.setAttribute("aSz", new T.BufferAttribute(ssz, 1));
      objs.sats = new T.Points(sg, addMat({ uScale: U.uScale, uT: U.uT }, "uniform float uScale,uT; attribute vec3 aCol; attribute float aSz; varying vec3 vCol; varying float vF;\n" +
        "void main(){ vCol=aCol; vec4 mv=modelViewMatrix*vec4(position,1.); vec4 cc=viewMatrix*vec4(0.,0.,0.,1.); float behind=step(mv.z,cc.z); vF=mix(1.,0.25,behind*(1.-smoothstep(1.,1.2,length(mv.xy-cc.xy))));\n" +
        " gl_PointSize=aSz*0.55*uScale/-mv.z; gl_Position=projectionMatrix*mv; }",
        "varying vec3 vCol; varying float vF; void main(){ vec2 q=gl_PointCoord-0.5; float d=dot(q,q)*4.; if(d>1.) discard; vec3 c=(mix(vec3(1.),vCol,smoothstep(0.,0.12,d))*exp(-d*7.)*3.+vCol*exp(-d*2.5)*0.35)*vF; gl_FragColor=vec4(c,1.); }"));
      objs.sats.renderOrder = 3; objs.sats.frustumCulled = false; dyn.add(objs.sats);
    }
    // impulses: arcs from bearing (0 = north = up), local -> ring around the core
    var impList = [];
    model.imp.forEach(function (p) {
      hsl(HUE[p.radar], 0.9, 0.62, c); var g, ph = hash("imp" + p.id);
      if (p.local) {
        g = new T.TorusGeometry(CORE_R + 0.16 + 0.07 * p.li, 0.006 + 0.016 * p.s, 4, 120);
        var mm = new T.Matrix4().makeRotationX(Math.PI / 2 + (hash("lx" + p.id) - 0.5) * 1.4); mm.premultiply(new T.Matrix4().makeRotationY(hash("ly" + p.id) * 6.28)); g.applyMatrix4(mm);
      } else {
        var b = p.bearing * Math.PI / 180, dx = Math.sin(b), dy = Math.cos(b), side = (hash("side" + p.id) - 0.5) * 0.6;
        var s0 = new T.Vector3(dx * 4.45, dy * 4.45, -1.7), e0 = new T.Vector3(dx * (CORE_R + 0.02), dy * (CORE_R + 0.02), 0.25),
          c0 = new T.Vector3(dx * 2.7 - dy * side, dy * 2.7 + dx * side, 1.5);
        g = new T.TubeGeometry(new T.QuadraticBezierCurve3(s0, c0, e0), 48, 0.006 + 0.022 * p.s, 5, false);
      }
      impList.push([g, { aCol: [c.r, c.g, c.b], aS: p.s, aPh: ph, aK: p.local ? 1 : 0 }]);
    });
    if (impList.length) {
      objs.imp = mk(mergeGeos(impList), addMat({ uT: U.uT },
        "attribute vec3 aCol; attribute float aS,aPh,aK; varying vec3 vCol; varying float vS,vPh,vK,vU,vE; void main(){ vCol=aCol; vS=aS; vPh=aPh; vK=aK; vU=uv.x; vec4 mv=modelViewMatrix*vec4(position,1.);\n" +
        " vE=1.-abs(dot(normalize(normalMatrix*normal),normalize(-mv.xyz))); gl_Position=projectionMatrix*mv; }",
        "uniform float uT; varying vec3 vCol; varying float vS,vPh,vK,vU,vE; void main(){ float i;\n" +
        " if(vK<0.5){ float p=pow(fract(vU*2.2-uT*(0.35+0.5*vS)+vPh),8.); i=(0.07+p*1.9)*smoothstep(0.,0.15,vU)*(0.6+0.6*vU); }\n" +
        " else { i=0.28+0.9*step(0.55,fract(vU*28.-uT*0.25*(vPh>0.5?1.:-1.)+vPh)); }\n" +
        " i*=(0.35+0.95*vS)*(0.55+0.7*(1.-vE)); gl_FragColor=vec4(mix(vCol,vec3(1.),0.25*(1.-vE))*i,1.); }"), 1, dyn);
    }
    // timeline: greeting -> items -> signoff
    seq = []; if (model.greeting) seq.push({ kind: "g", txt: model.greeting });
    model.items.forEach(function (it) { seq.push({ kind: "n", it: it }); });
    if (model.signoff && model.items.length) seq.push({ kind: "s", txt: model.signoff });
    seqT0 = view.lt || 0; curKey = -1; typed = -1;
    buildLegend();
    U.uCalm.value = model.live ? 0 : 1;
    st.d = { radars: model.radars.length, orbitsNoData: model.radars.filter(function (r) { return r.risk == null; }).length, satellites: objs.orbs.filter(function (o) { return o.sat; }).length,
      items: model.items.length, itemsSkipped: model.itemsSkipped, impulseArcs: model.imp.filter(function (p) { return !p.local; }).length, impulseLocal: model.imp.filter(function (p) { return p.local; }).length,
      impulsesSkipped: model.impSkipped, impulsesMerged: model.dup, unknownRadars: model.unknown, missing: model.missing, state: model.live ? "live" : "calm" };
    if (reduce) { frame(true); }
    loop();
  }

  /* ---------- HTML layer ---------- */
  function div(css, parent, tag) { var d = document.createElement(tag || "div"); if (css) d.style.cssText = css; (parent || ui.root).appendChild(d); return d; }
  function buildUI() {
    ui.root = div("position:absolute;inset:0;pointer-events:none;z-index:3;font:12px/1.35 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#e6f1ff;overflow:hidden", el);
    ui.badge = div("position:absolute;left:12px;top:10px;display:flex;align-items:center;gap:6px;padding:3px 9px 3px 7px;border-radius:999px;background:rgba(6,10,24,.62);border:1px solid rgba(255,255,255,.14);font-weight:700;letter-spacing:.08em;font-size:11px;backdrop-filter:blur(3px)");
    ui.dot = div("width:7px;height:7px;border-radius:50%;background:#ff3b5c;box-shadow:0 0 8px #ff3b5c", ui.badge); ui.btxt = div("", ui.badge, "span"); ui.anchor = div("opacity:.6;font-weight:600;letter-spacing:.12em", ui.badge, "span");
    ui.legend = div("position:absolute;display:grid;gap:2px 8px;padding:7px 8px;font-size:11px;border-radius:10px;background:rgba(5,9,22,.55);border:1px solid rgba(140,180,255,.14);backdrop-filter:blur(3px)");
    ui.lt = div("position:absolute;left:0;right:0;bottom:0;padding:22px 14px 12px;background:linear-gradient(to top,rgba(2,4,12,.92),rgba(2,4,12,.65) 60%,rgba(2,4,12,0));opacity:0;transition:opacity .5s");
    ui.ltTop = div("display:flex;align-items:center;gap:8px;margin-bottom:4px;font-size:11px;color:#9fb3d6", ui.lt);
    ui.chip = div("padding:1px 8px;border-radius:5px;font-weight:700;letter-spacing:.04em;color:#fff;border:1px solid;white-space:nowrap", ui.ltTop, "span");
    ui.meta = div("white-space:nowrap;overflow:hidden;text-overflow:ellipsis", ui.ltTop, "span");
    ui.line = div("font-size:14px;line-height:1.38;color:#f2f7ff;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:2.76em;text-shadow:0 1px 6px rgba(0,0,0,.7)", ui.lt);
    ui.caret = null;
  }
  function layoutUI() {
    var portrait = el.clientWidth / Math.max(1, el.clientHeight) < 1, s = ui.legend.style;
    if (portrait) { s.left = "10px"; s.right = "10px"; s.top = "40px"; s.bottom = ""; s.gridTemplateColumns = "repeat(2,minmax(0,1fr))"; }
    else { s.left = ""; s.right = "10px"; s.top = "10px"; s.bottom = ""; s.gridTemplateColumns = "1fr"; s.maxWidth = "205px"; }
    ui.portrait = portrait;
  }
  function buildLegend() {
    var L = lang(); while (ui.legend.firstChild) ui.legend.removeChild(ui.legend.firstChild);
    ui.legend.style.display = model.radars.length ? "grid" : "none";
    ORDER.forEach(function (id) {
      var r = radarById(id); if (!r) return;
      var row = div("display:flex;align-items:center;gap:6px;min-width:0;white-space:nowrap", ui.legend);
      var col = "hsl(" + HUE[id] + ",90%,62%)";
      div("flex:none;width:8px;height:8px;border-radius:50%;background:" + (r.risk == null ? "transparent;border:1px dashed " + col : col + ";box-shadow:0 0 6px " + col), row);
      var t = div("flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;color:#b9c8e4;font-size:11px", row, "span"); t.textContent = titleOf(r, L) || id; t.title = t.textContent;
      var v = div("flex:none;font-weight:700;font-variant-numeric:tabular-nums;min-width:20px;text-align:right", row, "span");
      v.textContent = r.risk == null ? "—" : String(Math.round(r.risk)); if (r.risk == null) v.style.opacity = ".45";
      if (r.delta != null) { var dd = div("flex:none;font-size:10px;font-variant-numeric:tabular-nums;min-width:28px;text-align:right;color:" + (r.delta > 0 ? "#ffd0a0" : r.delta < 0 ? "#a8c4ff" : "#8a97ad"), row, "span");
        dd.textContent = r.delta > 0 ? "▲" + r.delta : r.delta < 0 ? "▼" + Math.abs(r.delta) : "±0"; }
    });
    ui.btxt.textContent = model.live ? "LIVE" : ({ ru: "НЕТ ДАННЫХ", de: "KEINE DATEN", en: "NO DATA" })[L];
    ui.dot.style.background = model.live ? "#ff3b5c" : "#59667d"; ui.dot.style.boxShadow = model.live ? "0 0 8px #ff3b5c" : "none";
    ui.anchor.textContent = model.anchor ? model.anchor.toUpperCase() : ""; ui.anchor.style.display = model.anchor ? "" : "none";
    if (!seq.length) ui.lt.style.opacity = "0";
  }
  function showEntry(e) { // set chip/meta for current entry; returns full line text
    var L = lang(); while (ui.meta.firstChild) ui.meta.removeChild(ui.meta.firstChild);
    if (e.kind !== "n") { ui.chip.style.display = "none"; return e.txt[L] || e.txt.ru || e.txt.en || e.txt.de || ""; }
    var it = e.it, r = it.radar ? radarById(it.radar) : null;
    if (it.radar) { ui.chip.style.display = ""; var col = "hsl(" + HUE[it.radar] + ",90%,60%)"; ui.chip.style.borderColor = col; ui.chip.style.background = "hsla(" + HUE[it.radar] + ",90%,45%,.28)";
      ui.chip.textContent = (r && titleOf(r, L)) || it.radar; } else ui.chip.style.display = "none";
    var parts = [];
    if (it.source) { if (it.link) { var a = document.createElement("a"); a.href = it.link; a.target = "_blank"; a.rel = "noopener noreferrer nofollow"; a.textContent = it.source;
      a.style.cssText = "color:#9fdcff;text-decoration:none;pointer-events:auto"; ui.meta.appendChild(a); } else { var s = document.createElement("span"); s.textContent = it.source; ui.meta.appendChild(s); } parts.push(1); }
    if (it.time) { var tm = document.createElement("span"); tm.textContent = (parts.length ? " · " : "") + it.time; ui.meta.appendChild(tm); }
    return it.lines[L] || it.lines.ru || it.lines.en || it.lines.de || it.headline || "";
  }

  /* ---------- post pipeline (as in hall3d) ---------- */
  function rt(w, h, depth, ms) {
    var o = { minFilter: T.LinearFilter, magFilter: T.LinearFilter, format: T.RGBAFormat, type: st.hdr ? T.HalfFloatType : T.UnsignedByteType, depthBuffer: !!depth, stencilBuffer: false };
    var r = ms && T.WebGLMultisampleRenderTarget ? new T.WebGLMultisampleRenderTarget(w, h, o) : new T.WebGLRenderTarget(w, h, o); if (ms) r.samples = 4; return r;
  }
  var FSV = "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }";
  function fsMat(u, fs) { return new T.ShaderMaterial({ uniforms: u, vertexShader: FSV, fragmentShader: fs, depthTest: false, depthWrite: false }); }
  function setupPost() {
    var w2 = ren.capabilities.isWebGL2;
    st.hdr = !!(w2 ? ren.extensions.get("EXT_color_buffer_float") : (ren.extensions.get("OES_texture_half_float") && ren.extensions.get("EXT_color_buffer_half_float") && ren.extensions.get("OES_texture_half_float_linear")));
    RT.scene = rt(4, 4, false, w2); RT.a1 = rt(4, 4); RT.b1 = rt(4, 4); RT.a2 = rt(4, 4); RT.b2 = rt(4, 4);
    FS.scene = new T.Scene(); FS.cam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1); FS.q = new T.Mesh(new T.PlaneGeometry(2, 2)); FS.q.frustumCulled = false; FS.scene.add(FS.q);
    FS.bright = fsMat({ t: { value: null }, uPx: { value: new T.Vector2() }, uTh: { value: st.hdr ? 1.15 : 0.6 } },
      "uniform sampler2D t; uniform vec2 uPx; uniform float uTh; varying vec2 vUv; void main(){ vec3 c=(texture2D(t,vUv-uPx).rgb+texture2D(t,vUv+uPx*vec2(1.,-1.)).rgb+texture2D(t,vUv+uPx*vec2(-1.,1.)).rgb+texture2D(t,vUv+uPx).rgb)*0.25; float l=max(c.r,max(c.g,c.b)); float k=max(l-uTh,0.)/max(l,1e-4); gl_FragColor=vec4(min(c*k,vec3(30.)),1.); }");
    FS.blur = fsMat({ t: { value: null }, uD: { value: new T.Vector2() } },
      "uniform sampler2D t; uniform vec2 uD; varying vec2 vUv; void main(){ vec3 c=texture2D(t,vUv).rgb*0.227; c+=(texture2D(t,vUv+uD*1.385).rgb+texture2D(t,vUv-uD*1.385).rgb)*0.316; c+=(texture2D(t,vUv+uD*3.231).rgb+texture2D(t,vUv-uD*3.231).rgb)*0.07; gl_FragColor=vec4(c,1.); }");
    FS.copy = fsMat({ t: { value: null } }, "uniform sampler2D t; varying vec2 vUv; void main(){ gl_FragColor=texture2D(t,vUv); }");
    FS.comp = fsMat({ tS: { value: null }, t1: { value: null }, t2: { value: null }, uExp: { value: 0.95 } },
      "uniform sampler2D tS,t1,t2; uniform float uExp; varying vec2 vUv; vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.,1.); }\n" +
      "void main(){ vec3 c=texture2D(tS,vUv).rgb+texture2D(t1,vUv).rgb*0.5+texture2D(t2,vUv).rgb*0.55; vec2 q=vUv-0.5; c*=1.-dot(q,q)*0.9;\n" +
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
  function resize() {
    if (!ren) return; var w = Math.max(1, el.clientWidth), h = Math.max(1, el.clientHeight), pr = Math.min(window.devicePixelRatio || 1, 1.5);
    ren.setPixelRatio(pr); ren.setSize(w, h, false); var W = Math.floor(w * pr), H = Math.floor(h * pr);
    RT.scene.setSize(W, H); RT.a1.setSize(W >> 2, H >> 2); RT.b1.setSize(W >> 2, H >> 2); RT.a2.setSize(W >> 3, H >> 3); RT.b2.setSize(W >> 3, H >> 3);
    FS.bright.uniforms.uPx.value.set(1 / W, 1 / H);
    cam.aspect = w / h; var portrait = cam.aspect < 1; cam.fov = portrait ? 47 : 34;
    // shift the core away from the legend / lower third without parallax: view offset
    if (portrait) cam.setViewOffset(w, h, 0, -h * 0.02, w, h); else cam.setViewOffset(w, h, w * 0.11, h * 0.06, w, h);
    cam.updateProjectionMatrix(); U.uScale.value = H * 0.5 * cam.projectionMatrix.elements[5];
    layoutUI(); if (reduce) frame(true); loop();
  }

  /* ---------- controls ---------- */
  function bindControls(cv) {
    cv.style.touchAction = "pan-y"; el.style.touchAction = "pan-y";
    on(cv, "pointerdown", function (e) { view.pid = e.pointerId; view.sx = e.clientX; view.sy = e.clientY; view.o0 = view.off; view.drag = false; });
    on(cv, "pointermove", function (e) {
      var rc = cv.getBoundingClientRect();
      if (e.pointerType === "mouse") { view.px = clamp((e.clientX - rc.left) / rc.width * 2 - 1, -1, 1); view.py = clamp((e.clientY - rc.top) / rc.height * 2 - 1, -1, 1); }
      if (view.pid === e.pointerId) { var dx = e.clientX - view.sx, dy = e.clientY - view.sy;
        if (!view.drag && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) { view.drag = true; view.auto = false; try { cv.setPointerCapture(e.pointerId); } catch (x) {} }
        if (view.drag) { view.off = view.o0 + dx / rc.width * 3.2; view.idle = now(); if (reduce) frame(true); } }
      if (e.pointerType === "mouse" && reduce) frame(true);
    });
    function end(e) { if (view.pid !== e.pointerId) return; view.pid = null; view.drag = false; view.idle = now(); }
    on(cv, "pointerup", end); on(cv, "pointercancel", end);
    on(cv, "pointerleave", function () { view.px = 0; view.py = 0; });
  }

  /* ---------- frame ---------- */
  function frame(force) {
    raf = 0; if (!ren || ((!onScreen || document.hidden) && force !== true)) return;
    var tn = now() / 1000; if (view.t0 == null) view.t0 = tn; var dt = Math.min(0.1, Math.max(0, tn - (view.lt || tn))); view.lt = tn;
    var t = reduce ? 3.0 : tn - view.t0 + 1.0, ts = tn - view.t0; U.uT.value = t;
    // camera: slow orbit sway + pointer gaze + drag
    if (!view.drag && !view.auto && !reduce && now() - view.idle > 5000) view.auto = true;
    if (view.auto && !reduce) { view.sw += dt; var tg = 0.42 * Math.sin(view.sw * 0.09) ; view.off += (tg - view.off) * Math.min(1, dt * 0.6); }
    var kk = reduce ? 1 : Math.min(1, dt * 2.5); view.gx += (view.px - view.gx) * kk; view.gy += (view.py - view.gy) * kk;
    var dist = cam.aspect < 1 ? 11.6 : 12.2, yaw = view.off + view.gx * 0.12, el0 = 0.2 + view.gy * 0.07;
    cam.position.set(Math.sin(yaw) * Math.cos(el0) * dist, Math.sin(el0) * dist, Math.cos(yaw) * Math.cos(el0) * dist); cam.lookAt(0, 0, 0);
    // timeline
    var e = null, tau = 0, k = -1;
    if (seq.length) { var el2 = reduce ? (Math.floor(now() / 1000 / CYC) * CYC) : ts - seqT0; if (el2 < 0) el2 = 0; k = Math.floor(el2 / CYC); tau = reduce ? 9 : el2 - k * CYC; k = k % seq.length; e = seq[k]; }
    var isNews = e && e.kind === "n", absorbT = isNews ? FLY : 0.25;
    // core colour / pulse
    var curRadar = null;
    if (e && tau >= absorbT && isNews) curRadar = e.it.radar; else if (e && isNews && k >= 0) { var pv = seq[(k - 1 + seq.length) % seq.length]; curRadar = pv && pv.kind === "n" ? pv.it.radar : null; }
    if (curRadar) hsl(HUE[curRadar], 0.88, 0.6, coreTgt); else hsl(200, 0.45, 0.72, coreTgt);
    var lr = reduce ? 1 : Math.min(1, dt * 2.2); coreCol.r += (coreTgt.r - coreCol.r) * lr; coreCol.g += (coreTgt.g - coreCol.g) * lr; coreCol.b += (coreTgt.b - coreCol.b) * lr; U.uCol.value.copy(coreCol);
    var rk = null; if (curRadar) { var rr = radarById(curRadar); rk = rr && rr.risk != null ? rr.risk : null; if (rk == null && isNews && e.it.radar === curRadar && e.it.risk != null) rk = clamp(e.it.risk, 0, 100); }
    var ampT = rk == null ? 0.25 : rk / 100; U.uAmp.value += (ampT - U.uAmp.value) * lr;
    var amp = U.uAmp.value, bf = 0.16 + 0.42 * amp; U.uBreath.value = reduce ? 0 : (0.01 + 0.035 * amp) * (0.5 + 0.5 * Math.sin(t * 6.2832 * bf));
    U.uFlash.value = (e && isNews && tau >= absorbT && !reduce) ? Math.exp(-(tau - absorbT) * 2.6) : 0;
    if (now() - spk.last > 400) spk.target = 0; spk.v += (spk.target - spk.v) * (reduce ? 1 : Math.min(1, dt * 14)); U.uSpk.value = spk.v;
    objs.lat.rotation.set(0.35, t * 0.12, 0.1 * Math.sin(t * 0.2)); objs.lat2.rotation.set(t * 0.21, -t * 0.27, 0.4);
    var sc = 1 + U.uBreath.value + spk.v * 0.06; objs.lat.scale.setScalar(sc); objs.lat2.scale.setScalar(1 + U.uBreath.value * 2 + spk.v * 0.15);
    // satellites
    if (objs.orb) {
      var hd = objs.orb.material.uniforms.uHead.value, sp = objs.sats.geometry.attributes.position;
      objs.orbs.forEach(function (o, i) { var h = o.start + o.ph * 0.0 + (reduce ? 0.3 : t * o.speed * o.dir) + o.ph; h = h - Math.floor(h); hd[i] = h;
        var a = h * 6.28318; tmpV.set(Math.cos(a) * o.rad, Math.sin(a) * o.rad, 0).applyMatrix4(o.m); sp.setXYZ(i, tmpV.x, tmpV.y, tmpV.z); });
      sp.needsUpdate = true;
    }
    // shard flight
    var showShard = isNews && tau < FLY && !reduce;
    objs.shard.visible = objs.trail.visible = showShard;
    if (showShard) {
      var hs = hash(e.it.key), th = hs * 6.2832, s0 = tmpV.set(Math.cos(th) * 6.6, Math.sin(th) * 4.3, 2.2), side = (hash("c" + e.it.key) - 0.5) * 3;
      var cx = s0.x * 0.5 - Math.sin(th) * side, cy = s0.y * 0.5 + Math.cos(th) * side, cz = 2.6;
      var u = tau / FLY; u = u * u * (3 - 2 * u) * 0.35 + u * u * 0.65;
      var bez = function (q, out) { var a1 = (1 - q) * (1 - q), b1 = 2 * (1 - q) * q, c1 = q * q; return out.set(a1 * s0.x + b1 * cx, a1 * s0.y + b1 * cy, a1 * s0.z + b1 * cz); };
      bez(u, objs.shard.position); bez(Math.min(1, u + 0.02), tmpV2); objs.shard.lookAt(tmpV2);
      if (e.it.radar) hsl(HUE[e.it.radar], 0.9, 0.62, objs.shard.material.uniforms.uSh.value); else objs.shard.material.uniforms.uSh.value.setRGB(1, 1, 1);
      var tpa = objs.trail.geometry.attributes.position; for (var j = 0; j < tpa.count; j++) { bez(Math.max(0, u - j * 0.012), tmpC); tpa.setXYZ(j, tmpC.x, tmpC.y, tmpC.z); } tpa.needsUpdate = true;
    }
    // lower third typing
    if (e) {
      var key = k + "|" + lang();
      if (tau >= absorbT && curKey !== key) { curKey = key; ui.full = showEntry(e); typed = -1; ui.lt.style.opacity = "1"; }
      if (curKey === key && ui.full != null) { var n = reduce ? ui.full.length : Math.min(ui.full.length, Math.floor((tau - absorbT) * Math.max(38, ui.full.length / 3.2)));
        if (n !== typed) { typed = n; ui.line.textContent = ui.full.slice(0, n) + (n < ui.full.length ? "▍" : ""); } }
    } else if (ui.lt.style.opacity !== "0") ui.lt.style.opacity = "0";
    renderAll(); st.frames++;
    var rn = performance.now(); fpsT.push(rn); while (fpsT.length > 40) fpsT.shift(); if (fpsT.length > 2 && fpsT[fpsT.length - 1] > fpsT[0]) st.fps = Math.round((fpsT.length - 1) / ((fpsT[fpsT.length - 1] - fpsT[0]) / 1000) * 10) / 10;
    if (!reduce) loop();
  }
  function loop() { if (!reduce && !raf && ren && onScreen && !document.hidden) raf = requestAnimationFrame(frame); }

  /* ---------- API ---------- */
  function init(target) {
    try {
      if (ok) return true; T = window.THREE; if (!T || !target) return false;
      el = target; if (getComputedStyle(el).position === "static") el.style.position = "relative";
      try { ren = new T.WebGLRenderer({ antialias: false, powerPreference: "high-performance" }); } catch (x) { ren = null; }
      if (!ren) return false;
      ren.setClearColor(0x010208, 1); ren.info.autoReset = false; ren.outputEncoding = T.LinearEncoding; ren.toneMapping = T.NoToneMapping; ren.sortObjects = true;
      var cv = ren.domElement; cv.style.cssText = "display:block;width:100%;height:100%;touch-action:pan-y"; el.appendChild(cv);
      tmpV = new T.Vector3(); tmpV2 = new T.Vector3(); tmpC = new T.Vector3(); coreCol = hsl(200, 0.45, 0.72); coreTgt = coreCol.clone();
      scene = new T.Scene(); cam = new T.PerspectiveCamera(34, 1.45, 0.1, 150);
      setupPost(); buildStatic(); buildUI(); bindControls(cv);
      if (window.ResizeObserver) { ro = new ResizeObserver(resize); ro.observe(el); } else on(window, "resize", resize);
      if ("IntersectionObserver" in window) { io = new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; loop(); }, { threshold: 0.02 }); io.observe(el); }
      on(document, "visibilitychange", loop);
      if (reduce) rmTimer = setInterval(function () { if (onScreen && !document.hidden) frame(true); }, 1000);
      ok = true; resize(); build(); return true;
    } catch (err) { if (window.console) console.warn("[OrbCore3D] init failed", err); return false; }
  }
  function update(d) {
    try { model = normalize(d); } catch (x) { model = normalize(null); }
    if (!ok) return;
    try { build(); } catch (err) { if (window.console) console.warn("[OrbCore3D] update failed", err); try { model = normalize(null); build(); } catch (e2) {} }
  }
  function speak(level) { var l = num(level); spk.target = l == null ? 0 : clamp(l, 0, 1); spk.last = now(); if (reduce && ok) frame(true); }
  function stats() { var s = st.d || {}; return { frames: st.frames, triangles: st.tris, calls: st.calls, fps: st.fps, hdr: st.hdr, state: s.state, radars: s.radars, orbitsNoData: s.orbitsNoData,
    satellites: s.satellites, items: s.items, itemsSkipped: s.itemsSkipped, impulseArcs: s.impulseArcs, impulseLocal: s.impulseLocal, impulsesSkipped: s.impulsesSkipped,
    impulsesMerged: s.impulsesMerged, unknownRadars: s.unknownRadars, missing: (s.missing || []).slice(), lang: lang(), reducedMotion: reduce, speak: Math.round(spk.v * 100) / 100 }; }
  function destroy() {
    if (!ok) return; ok = false; if (raf) cancelAnimationFrame(raf); raf = 0; if (rmTimer) clearInterval(rmTimer);
    if (io) io.disconnect(); if (ro) ro.disconnect(); listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); }); listeners = [];
    disposeDyn(); scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    for (var k in RT) RT[k].dispose(); for (k in FS) if (FS[k] && FS[k].isMaterial) FS[k].dispose(); FS.q.geometry.dispose();
    ren.dispose(); if (ren.domElement.parentNode) ren.domElement.parentNode.removeChild(ren.domElement); if (ui.root && ui.root.parentNode) ui.root.parentNode.removeChild(ui.root);
    ren = null; scene = null; objs = {}; RT = {}; FS = {};
  }
  window.OrbCore3D = { init: init, update: update, speak: speak, stats: stats, destroy: destroy };
})();
