/* Orb Studio · canvas3d.js — «Мегаполис у моря», голограмма на реальных датчиках (версия Grok, превью).
   Интерфейс сохранён: window.Orb3D = { init(el) → true/false, update(card) }.
   Дополнительно (необязательно): Orb3D.setFeeds({sensors, aviation, impulses}), Orb3D.stats().
   Данные: /api/v1/canvas (карточка приходит через update), /api/v1/sensors, /api/v1/aviation, /api/v1/impulses
   (запрашиваются относительными URL, same-origin). Нет данных — нет элемента, без ошибок.
   Детерминизм: всё, что зависит от данных, сидируется card.slot; раскладка города — фиксированным сидом,
   чтобы город не «прыгал» между сменами. Math.random не используется. Текста в сцене нет.
   Таблица «данные → элемент» — MAPPING.md. */
(function () {
  "use strict";
  var ORDER = ["geo", "politics", "economy", "budget", "crypto", "energy", "web"];
  var HUE = { geo: 352, politics: 318, economy: 212, budget: 146, crypto: 268, energy: 36, web: 186 };
  var HAMBURG = { lat: 53.55, lon: 9.99 };
  var R = 12;                       // радиус проекционного диска
  var T, ren, scene, cam, box, clock, raf = 0, onScreen = true, started = false;
  var reduce = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var orbit = { a: 0.42, e: 0.36, r: 25, auto: !reduce, drag: false, px: 0, py: 0, idle: 0 };
  var card = null, feeds = { sensors: null, aviation: null, impulses: null };
  var stat = { buildings: 0, traffic: 0, packets: 0, aircraft: 0, parked: 0, impulses: 0, outageBlocks: 0, ships: 0, turbinesSpinning: 0, bolts: 0 };
  var U = null;                     // общие uniform'ы
  var dyn = null;                   // группа, пересобираемая при update()
  var anim = {};                    // ссылки для анимации
  var staticBuilt = false;

  /* ---------------- утилиты ---------------- */
  function num(v) { return (typeof v === "number" && isFinite(v)) ? v : null; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rng(str) { var a = 2166136261; for (var i = 0; i < str.length; i++) { a ^= str.charCodeAt(i); a = Math.imul(a, 16777619) >>> 0; }
    return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hsl(h, s, l) { return new T.Color().setHSL((((h % 360) + 360) % 360) / 360, s, l); }
  function get(o, path) { var p = path.split("."); for (var i = 0; i < p.length; i++) { if (o == null) return null; o = o[p[i]]; } return o === undefined ? null : o; }
  function webgl() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
  function coastZ(x) { return 2.7 + 0.25 * Math.sin(x * 0.6); }          // береговая линия (суша z < coast)
  function onPeninsula(x, z) { return x > 3.0 && x < 10.4 && z > 2.9 && z < 6.1; } // остров аэропорта
  function inDisc(x, z, m) { return x * x + z * z < (R - (m || 0)) * (R - (m || 0)); }
  function disposeTree(o) { o.traverse(function (c) { if (c.geometry) c.geometry.dispose(); if (c.material) [].concat(c.material).forEach(function (m) { m.dispose(); }); }); }

  /* ---------------- астрономия по времени смены (Гамбург) ---------------- */
  var RAD = Math.PI / 180;
  function astro(date) {
    var d = (date.getTime() - Date.UTC(2000, 0, 1, 12)) / 864e5, e = (23.439 - 0.00000036 * d) * RAD;
    function altaz(ra, dec) {
      var lst = ((18.697374558 + 24.06570982441908 * d) * 15 + HAMBURG.lon) * RAD, ha = lst - ra, lat = HAMBURG.lat * RAD;
      var alt = Math.asin(Math.sin(lat) * Math.sin(dec) + Math.cos(lat) * Math.cos(dec) * Math.cos(ha));
      var az = Math.atan2(-Math.sin(ha), Math.tan(dec) * Math.cos(lat) - Math.sin(lat) * Math.cos(ha));
      return new T.Vector3(Math.sin(az) * Math.cos(alt), Math.sin(alt), -Math.cos(az) * Math.cos(alt)); // север = −z, восток = +x
    }
    var g = (357.529 + 0.98560028 * d) * RAD, q = 280.459 + 0.98564736 * d;
    var sl = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) * RAD;
    var sun = altaz(Math.atan2(Math.cos(e) * Math.sin(sl), Math.cos(sl)), Math.asin(Math.sin(e) * Math.sin(sl)));
    var L = (218.316 + 13.176396 * d) * RAD, M = (134.963 + 13.064993 * d) * RAD, F = (93.272 + 13.229350 * d) * RAD;
    var ml = L + 6.289 * RAD * Math.sin(M), mb = 5.128 * RAD * Math.sin(F);
    var mra = Math.atan2(Math.sin(ml) * Math.cos(e) - Math.tan(mb) * Math.sin(e), Math.cos(ml));
    var mdec = Math.asin(Math.sin(mb) * Math.cos(e) + Math.cos(mb) * Math.sin(e) * Math.sin(ml));
    var moon = altaz(mra, mdec), illum = (1 - Math.cos(ml - sl)) / 2;
    return { sun: sun, moon: moon, illum: illum };
  }

  /* ---------------- шейдерные куски ---------------- */
  var NOISE = [
    "float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    "float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);",
    "  return mix(mix(h21(i), h21(i+vec2(1.0,0.0)), f.x), mix(h21(i+vec2(0.0,1.0)), h21(i+vec2(1.0,1.0)), f.x), f.y); }",
    "float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*vnoise(p); p = p*2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }"].join("\n");

  function holoUniforms() {
    return {
      uTime: { value: 0 }, uNight: { value: 0 }, uBright: { value: 1 }, uSun: { value: new T.Vector3(0, 1, 0) },
      uSunCol: { value: new T.Color(1, 1, 1) }, uAmb: { value: new T.Color(0.3, 0.35, 0.45) }, uFlick: { value: 1 },
      uFlash: { value: 0 }, uMoon: { value: new T.Vector3(0, 1, 0) }, uMoonIllum: { value: 0.5 }, uTension: { value: 0.5 },
      uStorm: { value: 0 }, uTurb: { value: 0.3 }, uSkyTop: { value: new T.Color() }, uSkyHor: { value: new T.Color() },
      uWave: { value: 0.1 }, uFogCol: { value: new T.Color() }, uFogDen: { value: 0.01 }, uCityGlow: { value: new T.Color(0, 0, 0) }
    };
  }
  // ручной туман (одинаковый для всех своих шейдеров)
  var FOG_F = "vec3 applyFog(vec3 c, float dist){ float f = 1.0 - exp(-uFogDen*uFogDen*dist*dist); return mix(c, uFogCol, clamp(f,0.0,1.0)); }";

  /* ---------------- init ---------------- */
  function init(el) {
    try {
      if (!window.THREE || !el || !webgl()) return false;
      T = window.THREE; box = el; clock = new T.Clock();
      ren = new T.WebGLRenderer({ antialias: (window.devicePixelRatio || 1) < 2, alpha: false, powerPreference: "high-performance" });
      ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      ren.setClearColor(0x02040a, 1);
      ren.domElement.style.display = "block";
      el.appendChild(ren.domElement);
      scene = new T.Scene();
      cam = new T.PerspectiveCamera(42, 4 / 5, 0.1, 400);
      U = holoUniforms();
      buildStatic();
      bind(); resize();
      if (window.ResizeObserver) new ResizeObserver(resize).observe(el); else window.addEventListener("resize", resize);
      if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { onScreen = e[0].isIntersecting; if (onScreen) loop(); }, { threshold: 0.02 }).observe(el);
      document.addEventListener("visibilitychange", function () { if (!document.hidden) loop(); });
      started = true;
      fetchFeeds();
      setInterval(function () { if (!document.hidden) fetchFeeds(); }, 10 * 60 * 1000);
      loop();
      return true;
    } catch (err) { if (window.console) console.warn("[Orb3D] init failed", err); return false; }
  }

  function apiBase() { return (typeof window.ORB3D_API_BASE === "string") ? window.ORB3D_API_BASE : ""; }
  function fetchFeeds() {
    if (!window.fetch) return;
    ["sensors", "aviation", "impulses"].forEach(function (k) {
      fetch(apiBase() + "/api/v1/" + k, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (j) { feeds[k] = j; if (card) rebuild(); })
        .catch(function () { /* нет данных — элемент просто не строится */ });
    });
  }

  function resize() { if (!ren) return; var w = box.clientWidth || 400, h = box.clientHeight || Math.round(w * 1.25); ren.setSize(w, h, false); ren.domElement.style.width = "100%"; ren.domElement.style.height = "100%"; cam.aspect = w / h; cam.updateProjectionMatrix(); }

  function bind() {
    var c = ren.domElement; c.style.touchAction = "pan-y"; c.style.cursor = "grab";
    c.addEventListener("pointerdown", function (e) { orbit.drag = true; orbit.auto = false; orbit.px = e.clientX; orbit.py = e.clientY; c.style.cursor = "grabbing"; try { c.setPointerCapture(e.pointerId); } catch (x) {} loop(); });
    function up() { if (orbit.drag) { orbit.drag = false; orbit.idle = performance.now(); c.style.cursor = "grab"; } }
    c.addEventListener("pointerup", up); c.addEventListener("pointercancel", up);
    c.addEventListener("pointermove", function (e) { if (!orbit.drag) return; orbit.a -= (e.clientX - orbit.px) * 0.006; orbit.e = clamp(orbit.e + (e.clientY - orbit.py) * 0.004, 0.08, 1.2); orbit.px = e.clientX; orbit.py = e.clientY; });
    c.addEventListener("wheel", function (e) { e.preventDefault(); orbit.r = clamp(orbit.r + e.deltaY * 0.01, 13, 36); }, { passive: false });
  }

  /* ============================ СТАТИКА ============================ */
  function addMat(color, op) { return new T.MeshBasicMaterial({ color: color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }); }
  function lineMat(color, op) { return new T.LineBasicMaterial({ color: color, transparent: true, opacity: op, blending: T.AdditiveBlending, depthWrite: false }); }
  function segs(arr, mat) { var g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(arr, 3)); return new T.LineSegments(g, mat); }

  function buildStatic() {
    /* --- небо: градиент по солнцу, солнце, луна с фазой, звёзды, облака (fbm) --- */
    var skyMat = new T.ShaderMaterial({
      uniforms: U, side: T.BackSide, depthWrite: false,
      vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); vec4 p = projectionMatrix*modelViewMatrix*vec4(position,1.0); gl_Position = p.xyww; }",
      fragmentShader: [
        "uniform float uTime, uNight, uTension, uStorm, uTurb, uFlash, uMoonIllum, uFogDen; uniform vec3 uSun, uMoon, uSunCol, uSkyTop, uSkyHor, uFogCol, uCityGlow;",
        "varying vec3 vDir;", NOISE,
        "void main(){",
        "  vec3 d = normalize(vDir); float el = d.y;",
        "  vec3 col = mix(uSkyHor, uSkyTop, pow(clamp(el,0.0,1.0), 0.55));",
        "  float sd = max(dot(d, uSun), 0.0);",
        "  col += uSunCol * (pow(sd, 6.0)*0.35 + pow(sd, 64.0)*0.5) * (1.0 - uNight*0.9);",          // ореол
        "  float day = 1.0 - uNight;",
        // звёзды (ночью, где нет облаков)
        "  vec2 sc = vec2(atan(d.z, d.x), asin(clamp(el,-1.0,1.0))) * 90.0; vec2 ci = floor(sc); float hs = h21(ci);",
        "  float star = step(0.993, hs) * smoothstep(0.22, 0.0, length(fract(sc)-0.5)) * (0.6 + 0.4*sin(uTime*2.0 + hs*80.0));",
        "  col += vec3(0.85,0.9,1.0) * star * uNight * smoothstep(0.02, 0.15, el);",
        // луна: диск с фазой (освещённая сторона — к солнцу)
        "  float md = dot(d, uMoon); float mr = 0.028;",
        "  if (md > cos(mr) && uMoon.y > -0.05){",
        "    vec3 t1 = normalize(uSun - uMoon*dot(uSun,uMoon) + vec3(1e-4)); vec3 t2 = normalize(cross(uMoon, t1));",
        "    vec3 off = d - uMoon*md; float u = dot(off,t1)/mr, v = dot(off,t2)/mr;",
        "    float term = (1.0 - 2.0*uMoonIllum) * sqrt(max(0.0, 1.0 - v*v));",
        "    float lit = smoothstep(term-0.06, term+0.06, u);",
        "    col = mix(col, vec3(0.9,0.92,0.85)*(0.12 + 0.88*lit), (0.35 + 0.65*uNight) * smoothstep(1.0, 0.92, length(vec2(u,v))));",
        "  }",
        "  col += vec3(0.85,0.9,1.0) * pow(max(md,0.0), 40.0) * 0.12 * uNight;",
        // солнечный диск
        "  col += uSunCol * smoothstep(0.9993, 0.9997, sd) * 3.0 * step(-0.02, uSun.y);",
        // облака: покрытие = напряжение, ход = турбулентность, шторм — над морем (+z)
        "  if (el > 0.0){",
        "    vec2 p = d.xz / (el + 0.12) * 0.9 + vec2(uTime*0.006*(0.3+uTurb), uTime*0.002);",
        "    float n = fbm(p*1.3);",
        "    float stormSea = uStorm * (0.55 + 0.45*smoothstep(-0.2, 0.6, d.z));",
        "    float cover = clamp(uTension*0.95 + stormSea*0.35, 0.0, 1.0);",
        "    float c = smoothstep(1.0 - cover*0.85 - 0.1, 1.0 - cover*0.85 + 0.25, n) * smoothstep(0.0, 0.12, el);",
        "    vec3 cDay = mix(vec3(0.97,0.97,0.98), vec3(0.2,0.21,0.25), clamp(uTension*0.9 + stormSea*0.6, 0.0, 1.0));",
        "    cDay *= mix(vec3(1.0), uSunCol, 0.35) * (0.75 + 0.25*pow(sd,4.0));",
        "    vec3 cNight = vec3(0.11,0.115,0.14) + uCityGlow*1.6*(1.0-el)*(1.0-el);",
        "    float dens = smoothstep(1.0 - cover*0.85, 1.0 - cover*0.85 + 0.45, n);",
        "    vec3 cc = mix(cDay, cNight, uNight) * (1.05 - 0.5*dens*(0.4+cover)) * (0.85 + 0.3*fbm(p*3.1+7.0));",
        "    cc += vec3(0.75,0.75,1.0) * uFlash * (0.6 + stormSea);",
        "    col = mix(col, cc, c*0.95);",
        "  }",
        "  col += uCityGlow * smoothstep(0.35, 0.0, abs(el)) * 0.5;",                 // засветка города у горизонта
        "  col = mix(col, uFogCol, clamp(uFogDen*14.0, 0.0, 0.7) * smoothstep(0.25, 0.0, abs(el)));", // дымка у горизонта
        "  gl_FragColor = vec4(col, 1.0);",
        "}"].join("\n")
    });
    var sky = new T.Mesh(new T.SphereGeometry(150, 48, 24), skyMat); sky.renderOrder = -10; sky.frustumCulled = false; scene.add(sky);

    /* --- земля: тёмная плита + инженерная сетка (крупная/мелкая, как в CAD) --- */
    var groundMat = new T.ShaderMaterial({
      uniforms: U, extensions: { derivatives: true },
      vertexShader: "varying vec3 vW; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }",
      fragmentShader: [
        "uniform float uNight, uFogDen; uniform vec3 uFogCol, uSunCol, uAmb, uCityGlow; varying vec3 vW;", FOG_F,
        "float grid(vec2 p, float s){ vec2 g = abs(fract(p/s - 0.5) - 0.5) / fwidth(p/s); return 1.0 - min(min(g.x, g.y), 1.0); }",
        "void main(){",
        "  float r = length(vW.xz); if (r > " + (R + 0.6).toFixed(1) + ") discard;",
        "  bool pen = vW.x > 3.0 && vW.x < 10.4 && vW.z > 2.9 && vW.z < 6.1; if (vW.z > 2.7 + 0.25*sin(vW.x*0.6) + 0.05 && !pen) discard;",
        "  vec3 base = mix(vec3(0.16,0.18,0.2)*(uAmb*1.6 + uSunCol*0.25), vec3(0.015,0.02,0.03), uNight);",
        "  float g1 = grid(vW.xz, 0.5), g2 = grid(vW.xz, 2.5);",
        "  vec3 lineC = vec3(0.25,0.85,1.0);",
        "  vec3 col = base + lineC*(g1*0.05 + g2*0.14)*(0.5 + 0.5*uNight) + uCityGlow*0.08;",
        "  gl_FragColor = vec4(applyFog(col, length(vW - cameraPosition)), 1.0);",
        "}"].join("\n")
    });
    var ground = new T.Mesh(new T.CircleGeometry(R + 0.6, 96), groundMat); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.01; scene.add(ground);
    // корпус проектора
    var body = new T.Mesh(new T.CylinderGeometry(R + 0.7, R + 1.1, 0.8, 96, 1, true), new T.MeshBasicMaterial({ color: 0x050a14 })); body.position.y = -0.42; scene.add(body);
    var rim = new T.Mesh(new T.RingGeometry(R + 0.55, R + 0.8, 128), addMat(0x56e8ff, 0.6)); rim.rotation.x = -Math.PI / 2; rim.position.y = 0.01; scene.add(rim);
    // засечки по ободу, как размерная шкала в CAD: каждые 5°, длинные каждые 30°
    var tk = []; for (var a = 0; a < 360; a += 5) { var l = a % 30 === 0 ? 0.45 : 0.18, c = Math.cos(a * RAD), s = Math.sin(a * RAD); tk.push(c * (R + 0.85), 0.02, s * (R + 0.85), c * (R + 0.85 + l), 0.02, s * (R + 0.85 + l)); }
    // перекрестие осей
    tk.push(-R - 1.5, 0.02, 0, R + 1.5, 0.02, 0, 0, 0.02, -R - 1.5, 0, 0.02, R + 1.5);
    anim.ticks = segs(tk, lineMat(0x7ff3ff, 0.45)); scene.add(anim.ticks);

    /* --- море: волны в вершинном шейдере; амплитуда = турбулентность --- */
    var sg = new T.PlaneGeometry(2 * R + 1, 2 * R + 1, 150, 150); sg.rotateX(-Math.PI / 2);
    var seaMat = new T.ShaderMaterial({
      uniforms: U, transparent: false, extensions: { derivatives: true },
      vertexShader: [
        "uniform float uTime, uWave; varying vec3 vW; varying vec3 vN;",
        "float wv(vec2 p, vec2 dir, float k, float sp){ return sin(dot(p, dir)*k + uTime*sp); }",
        "void main(){ vec3 p = position;",
        "  float a = uWave; vec2 q = p.xz;",
        "  float h = a*(0.55*wv(q, normalize(vec2(0.3,1.0)), 2.2, 1.5) + 0.3*wv(q, normalize(vec2(-0.8,0.6)), 4.6, 2.2) + 0.15*wv(q, normalize(vec2(1.0,0.2)), 8.2, 3.1));",
        "  float e = 0.05; vec2 qx = q + vec2(e,0.0), qz = q + vec2(0.0,e);",
        "  float hx = a*(0.55*wv(qx, normalize(vec2(0.3,1.0)), 2.2, 1.5) + 0.3*wv(qx, normalize(vec2(-0.8,0.6)), 4.6, 2.2) + 0.15*wv(qx, normalize(vec2(1.0,0.2)), 8.2, 3.1));",
        "  float hz = a*(0.55*wv(qz, normalize(vec2(0.3,1.0)), 2.2, 1.5) + 0.3*wv(qz, normalize(vec2(-0.8,0.6)), 4.6, 2.2) + 0.15*wv(qz, normalize(vec2(1.0,0.2)), 8.2, 3.1));",
        "  vN = normalize(vec3(h - hx, e, h - hz)); p.y = h;",
        "  vec4 w = modelMatrix*vec4(p,1.0); vW = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }"].join("\n"),
      fragmentShader: [
        "uniform float uNight, uFogDen, uStorm, uFlash, uWave; uniform vec3 uSun, uSunCol, uSkyTop, uSkyHor, uFogCol, uMoon, uCityGlow; varying vec3 vW; varying vec3 vN;", FOG_F,
        "float grid(vec2 p, float s){ vec2 g = abs(fract(p/s - 0.5) - 0.5) / fwidth(p/s); return 1.0 - min(min(g.x, g.y), 1.0); }",
        "void main(){",
        "  float r = length(vW.xz); if (r > " + R.toFixed(1) + ") discard;",
        "  float coast = 2.7 + 0.25*sin(vW.x*0.6); if (vW.z < coast) discard; if (vW.x > 3.0 && vW.x < 10.4 && vW.z > 2.9 && vW.z < 6.1) discard;",
        "  vec3 n = normalize(vN); vec3 v = normalize(cameraPosition - vW);",
        "  float fr = 0.04 + 0.96*pow(1.0 - max(dot(n, v), 0.0), 5.0);",
        "  vec3 deep = mix(vec3(0.04,0.13,0.18), vec3(0.005,0.012,0.02), uNight) * (1.0 - 0.4*uStorm);",
        "  vec3 refl = mix(uSkyHor, uSkyTop, 0.35) + uCityGlow*1.2;",
        "  vec3 col = mix(deep, refl, fr*0.85) + uCityGlow*0.5*(0.5+0.5*n.x);",
        "  vec3 hv = normalize(uSun + v); col += uSunCol * pow(max(dot(n,hv),0.0), 180.0) * 2.0 * step(0.0, uSun.y) * (1.0-uNight);",
        "  vec3 hm = normalize(uMoon + v); col += vec3(0.7,0.75,0.8) * pow(max(dot(n,hm),0.0), 220.0) * 0.8 * uNight * step(0.0, uMoon.y);",
        "  col += vec3(0.8,0.85,1.0)*uFlash*0.25;",
        "  col += vec3(0.3,0.9,1.0) * grid(vW.xz, 1.0) * (0.05 + 0.1*uNight);",                     // голографическая сетка поверх воды
        "  col += vec3(0.7,0.85,0.9) * smoothstep(0.55, 1.0, n.y < 0.98 ? (1.0-n.y)*6.0*uWave : 0.0) * 0.15;", // барашки при сильной волне
        "  gl_FragColor = vec4(applyFog(col, length(vW - cameraPosition)), 1.0);",
        "}"].join("\n")
    });
    var sea = new T.Mesh(sg, seaMat); sea.position.y = 0.02; scene.add(sea);
    // береговая линия
    var cl = []; for (var x = -R; x < R; x += 0.2) { var z0 = coastZ(x), z1 = coastZ(x + 0.2); if (inDisc(x, z0) && inDisc(x + 0.2, z1)) cl.push(x, 0.05, z0, x + 0.2, 0.05, z1); }
    scene.add(segs(cl, lineMat(0x8ff6ff, 0.55)));

    /* --- остров аэропорта: плита, ВПП, рулёжка, терминал, вышка --- */
    var ap = new T.Group(); scene.add(ap); anim.airport = ap;
    var slab = new T.Mesh(new T.BoxGeometry(7.4, 0.12, 3.2), new T.MeshBasicMaterial({ color: 0x0b1118 })); slab.position.set(6.7, 0.02, 4.5); ap.add(slab);
    ap.add(edges(new T.BoxGeometry(7.4, 0.12, 3.2), 6.7, 0.02, 4.5, 0x8ff6ff, 0.5));
    var rw = new T.Mesh(new T.PlaneGeometry(6.2, 0.34), new T.MeshBasicMaterial({ color: 0x05080c })); rw.rotation.x = -Math.PI / 2; rw.position.set(6.7, 0.09, 5.2); ap.add(rw);
    var cm = []; for (var k = 0; k < 14; k++) { var xx = 3.9 + k * 0.42; cm.push(xx, 0.095, 5.2, xx + 0.2, 0.095, 5.2); }      // осевая разметка
    cm.push(3.6, 0.095, 5.03, 9.8, 0.095, 5.03, 3.6, 0.095, 5.37, 9.8, 0.095, 5.37);                                             // кромки
    cm.push(4.2, 0.095, 4.55, 9.2, 0.095, 4.55, 4.2, 0.095, 4.55, 4.0, 0.095, 5.03, 9.2, 0.095, 4.55, 9.4, 0.095, 5.03);         // рулёжка
    ap.add(segs(cm, lineMat(0xdfefff, 0.5)));
    var term = new T.BoxGeometry(3.0, 0.36, 0.6); ap.add(solid(term, 6.6, 0.26, 3.55, 0x9fdcff));
    var tw = new T.CylinderGeometry(0.09, 0.13, 1.1, 8); ap.add(solid(tw, 4.0, 0.63, 3.7, 0x9fdcff));
    var cab = new T.CylinderGeometry(0.24, 0.18, 0.2, 8); ap.add(solid(cab, 4.0, 1.28, 3.7, 0xbff0ff));
    // огни ВПП (белые кромки, зелёный порог, красный торец) + огни подхода над морем
    var lp = [], lc = [], lph = [];
    for (k = 0; k <= 30; k++) { var lx = 3.6 + k * (6.2 / 30); [5.03, 5.37].forEach(function (lz) { lp.push(lx, 0.12, lz); lc.push(1, 0.95, 0.85); lph.push(-1); }); }
    [5.08, 5.2, 5.32].forEach(function (lz) { lp.push(3.58, 0.12, lz); lc.push(0.3, 1, 0.5); lph.push(-1); lp.push(9.82, 0.12, lz); lc.push(1, 0.25, 0.25); lph.push(-1); });
    for (k = 1; k <= 9; k++) { lp.push(3.6 - k * 0.32, 0.14, 5.2); lc.push(1, 1, 1); lph.push(k / 9); }                         // «бегущий огонь» подхода
    anim.rwLights = points(lp, lc, lph, 0.22); ap.add(anim.rwLights);

    /* --- порт: краны и контейнеры (декор, не данные) --- */
    var pr = rng("orb-port"), cont = new T.InstancedMesh(new T.BoxGeometry(0.22, 0.09, 0.09), new T.MeshBasicMaterial({ color: 0xffffff }), 140), m4 = new T.Matrix4();
    for (k = 0; k < 140; k++) { var px = -5.8 + (k % 20) * 0.24, pz = 2.35 - Math.floor(k / 20) % 4 * 0.11, py = 0.05 + Math.floor(k / 80) * 0.09; m4.makeTranslation(px, py, pz - (pr() < 0.15 ? 0.3 : 0)); cont.setMatrixAt(k, m4); cont.setColorAt(k, hsl([200, 20, 350, 160, 40][k % 5], 0.35, 0.22)); }
    scene.add(cont);
    var cr = []; for (k = 0; k < 4; k++) { var cx = -5.6 + k * 1.3, cz = 2.85; cr.push(cx, 0, cz, cx, 1.0, cz, cx + 0.3, 0, cz, cx + 0.3, 1.0, cz, cx - 0.2, 1.0, cz, cx + 0.5, 1.0, cz + 0.9, cx, 1.0, cz, cx + 0.3, 1.0, cz, cx, 0.5, cz, cx + 0.3, 0.5, cz); }
    scene.add(segs(cr, lineMat(0xffc27a, 0.55)));
    // маяк на молу (строение статично; луч — данные)
    anim.lhPos = new T.Vector3(-8.6, 0, 4.4);
    var mole = []; mole.push(-8.6, 0.06, 4.4, -6.4, 0.06, 3.1); scene.add(segs(mole, lineMat(0x8ff6ff, 0.5)));
    scene.add(solid(new T.CylinderGeometry(0.12, 0.2, 1.3, 10), -8.6, 0.65, 4.4, 0xfff1c8));

    /* --- проектор: скан-луч (декор) --- */
    anim.scan = new T.Group(); scene.add(anim.scan);
    anim.scanRing = new T.Mesh(new T.CylinderGeometry(R, R, 0.04, 128, 1, true), addMat(0x6ff3ff, 0.35)); anim.scan.add(anim.scanRing);
    var sd = new T.Mesh(new T.CircleGeometry(R, 64), addMat(0x2fd8ff, 0.025)); sd.rotation.x = -Math.PI / 2; anim.scan.add(sd);

    // центр: подиум для достопримечательностей смены (landmarks3d.js)
    var plaza = new T.Mesh(new T.RingGeometry(1.55, 1.75, 64), addMat(0x8ff6ff, 0.45)); plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.03; scene.add(plaza);
    anim.landmarkSlot = new T.Group(); scene.add(anim.landmarkSlot);
    anim.staticPointMats = (anim.pointMats || []).slice();
    staticBuilt = true;
  }

  function edges(geo, x, y, z, color, op) { var e = new T.LineSegments(new T.EdgesGeometry(geo), lineMat(color, op)); e.position.set(x, y, z); return e; }
  function solid(geo, x, y, z, color) {
    var g = new T.Group(); g.position.set(x, y, z);
    g.add(new T.Mesh(geo, new T.MeshBasicMaterial({ color: 0x07101a })));
    g.add(new T.LineSegments(new T.EdgesGeometry(geo), lineMat(color, 0.85)));
    return g;
  }
  // точечные огни: aPh < 0 — горит постоянно, иначе мигает со своей фазой
  function points(pos, colArr, ph, size, blink) {
    var g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setAttribute("aCol", new T.Float32BufferAttribute(colArr, 3));
    g.setAttribute("aPh", new T.Float32BufferAttribute(ph, 1));
    var m = new T.ShaderMaterial({
      uniforms: { uTime: U.uTime, uSize: { value: size }, uPx: { value: 1 }, uRate: { value: blink || 1.0 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: "attribute vec3 aCol; attribute float aPh; uniform float uTime, uSize, uPx, uRate; varying vec3 vC; varying float vA;" +
        "void main(){ vC = aCol; float on = 1.0; if (aPh >= 0.0){ float f = fract(uTime*uRate - aPh); on = f < 0.18 ? 1.0 : 0.06; } vA = on;" +
        " vec4 mv = modelViewMatrix*vec4(position,1.0); gl_PointSize = uSize*uPx*300.0/max(1.0,-mv.z); gl_Position = projectionMatrix*mv; }",
      fragmentShader: "varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord-0.5); float a = smoothstep(0.5, 0.0, d); gl_FragColor = vec4(vC*a*vA, a*vA); }"
    });
    anim.pointMats = anim.pointMats || []; anim.pointMats.push(m);
    var p = new T.Points(g, m); p.frustumCulled = false; return p;
  }

  /* ============================ ДИНАМИКА (из данных) ============================ */
  function update(c) {
    try {
      if (!T || !c || typeof c !== "object") return;
      card = c; rebuild();
    } catch (err) { if (window.console) console.warn("[Orb3D] update failed", err); }
  }

  function rebuild() {
    if (!staticBuilt || !card) return;
    if (dyn) { scene.remove(dyn); disposeTree(dyn); }
    dyn = new T.Group(); scene.add(dyn);
    anim.pointMats = (anim.staticPointMats || []).slice(); anim.aircraft = null; anim.ships = null; anim.turbines = null; anim.bolts = []; anim.beam = null; anim.beacon = null; anim.arcs = []; anim.rings = []; anim.lightsAir = null;
    for (var k in stat) stat[k] = 0;
    var c = card, st = c.state || {}, se = c.scene_elements || {}, inp = c.inputs || {};
    var slot = typeof c.slot === "string" ? c.slot : "no-slot";
    var rnd = rng(slot);
    var radars = {}; (Array.isArray(inp.radars) ? inp.radars : []).forEach(function (r) { if (r && r.id) radars[r.id] = r; });
    var order = (Array.isArray(c.towers_left_to_right) && c.towers_left_to_right.length) ? c.towers_left_to_right : ORDER;
    // у смены есть свой снимок датчиков — город из архива строится ровно таким, каким был; у старых смен — текущие датчики
    var F = (c.feeds && typeof c.feeds === "object") ? c.feeds : {};
    var S = F.sensors || feeds.sensors || {}, A = F.aviation || feeds.aviation || {}, I = F.impulses || feeds.impulses || {};

    /* --- небо и свет по реальному времени смены --- */
    var when = slot !== "no-slot" ? new Date(slot) : new Date();
    if (isNaN(when.getTime())) when = new Date();
    var ast = astro(when), sunY = ast.sun.y;
    var night = 1 - clamp((sunY + 0.1) / 0.22, 0, 1);                  // 0 — день, 1 — ночь
    var dusk = Math.exp(-Math.abs(sunY) * 9);
    U.uSun.value.copy(ast.sun); U.uMoon.value.copy(ast.moon); U.uMoonIllum.value = ast.illum; U.uNight.value = night;
    var tension = num(st.tension), turb = num(st.turbulence), fracture = num(st.fracture), intensity = num(st.intensity);
    U.uTension.value = tension === null ? 0 : tension / 100;
    U.uTurb.value = turb === null ? 0 : turb / 100;
    U.uStorm.value = (typeof c.art_style === "string" && /storm/i.test(c.art_style)) ? 1 : 0;
    var tn = U.uTension.value;
    var sunCol = new T.Color(1, 0.97, 0.92).lerp(new T.Color(1, 0.55, 0.25), clamp(dusk * 1.2, 0, 1));
    U.uSunCol.value.copy(sunCol);
    var dayTop = new T.Color(0.16, 0.36, 0.72).lerp(new T.Color(0.32, 0.36, 0.42), tn * 0.5);
    var dayHor = new T.Color(0.66, 0.76, 0.88).lerp(new T.Color(0.55, 0.57, 0.6), tn * 0.5);
    var duskHor = new T.Color(0.95, 0.5, 0.28), duskTop = new T.Color(0.18, 0.2, 0.42);
    var nightTop = new T.Color(0.006, 0.01, 0.028), nightHor = new T.Color(0.02, 0.035, 0.07);
    if (U.uStorm.value) { dayTop.lerp(new T.Color(0.07, 0.08, 0.1), 0.8); dayHor.lerp(new T.Color(0.2, 0.21, 0.24), 0.75); }
    var top = dayTop.clone().lerp(duskTop, clamp(dusk, 0, 1) * 0.7).lerp(nightTop, night);
    var hor = dayHor.clone().lerp(duskHor, clamp(dusk, 0, 1) * 0.8 * (1 - tn * 0.5)).lerp(nightHor, night);
    U.uSkyTop.value.copy(top); U.uSkyHor.value.copy(hor);
    U.uAmb.value.copy(hor.clone().multiplyScalar((0.6 + 0.4 * (1 - night)) * (U.uStorm.value ? 0.7 : 1)));
    if (U.uStorm.value) U.uSunCol.value.multiplyScalar(0.45);
    // туман = state.fracture (data-art, не погода)
    var fogD = fracture === null ? 0.012 : 0.008 + (fracture / 100) * 0.03;
    U.uFogDen.value = fogD; U.uFogCol.value.copy(hor.clone().lerp(new T.Color(0.5, 0.55, 0.6), (1 - night) * 0.3));
    U.uWave.value = turb === null ? 0.03 : 0.025 + (turb / 100) * 0.13;

    /* --- энергосеть: яркость города = цена электроэнергии (дороже → тусклее), относительно диапазона дня --- */
    var pNow = num(get(S, "power.now_eur_mwh")), pMin = num(get(S, "power.today.min_eur_mwh")), pMax = num(get(S, "power.today.max_eur_mwh"));
    var bright = 1;
    if (pNow !== null && pMin !== null && pMax !== null && pMax > pMin) bright = 1 - 0.5 * clamp((pNow - pMin) / (pMax - pMin), 0, 1);
    U.uBright.value = bright;
    // засветка неба городом (ночью): цвет главного радара × state.intensity × яркость сети
    var maxR = null; order.forEach(function (id) { var r = radars[id]; if (r && num(r.risk_index) !== null && (!maxR || r.risk_index > maxR.risk_index)) maxR = r; });
    var glow = new T.Color(0, 0, 0);
    if (maxR) glow = hsl(HUE[maxR.id] || 200, 0.6, 0.5).lerp(new T.Color(1, 0.7, 0.45), 0.5).multiplyScalar(0.32 * (intensity === null ? 0.5 : intensity / 100) * bright * night);
    U.uCityGlow.value.copy(glow);

    /* --- 7 районов: сотни зданий; доля горящих окон = risk_index радара района --- */
    var outages = Array.isArray(get(S, "internet.outages")) ? get(S, "internet.outages") : [];
    buildCity(order, radars, se, outages, rnd, slot);

    /* --- улицы и поток машин: густота и скорость = state.turbulence --- */
    if (turb !== null) buildTraffic(turb / 100);

    /* --- провода между башнями и пакеты данных: количество = bitcoin.mempool_tx --- */
    var mem = num(get(S, "bitcoin.mempool_tx"));
    buildCables(mem);

    /* --- маяк: lighthouse_beam (0 = тёмный) --- */
    var beam = num(se.lighthouse_beam);
    buildLighthouse(beam === null ? 0 : beam);

    /* --- корабли: scene_elements.ships --- */
    var ships = num(se.ships); if (ships) buildShips(Math.round(clamp(ships, 0, 24)), rnd);

    /* --- ветряки: доля вращающихся = power.renewables.renewable_share_pct --- */
    var ren_ = num(get(S, "power.renewables.renewable_share_pct")); if (ren_ !== null) buildTurbines(ren_);

    /* --- молнии: scene_elements.lightning --- */
    var nl = num(se.lightning); if (nl) buildLightning(Math.round(clamp(nl, 0, 12)), rnd);

    /* --- самолёты: hamburg_sector.airborne в небе, on_ground — на перроне --- */
    var air = num(get(A, "hamburg_sector.airborne")), gnd = num(get(A, "hamburg_sector.on_ground"));
    if (air !== null || gnd !== null) buildAircraft(air || 0, gnd || 0, rnd);

    /* --- импульсы новостей: дуги со стороны bearing_deg, толщина = strength --- */
    var imp = Array.isArray(I.impulses) ? I.impulses : [];
    if (imp.length) buildImpulses(imp, rnd);

    /* --- достопримечательности смены в центре (landmarks3d.js, если подключён) --- */
    mountLandmarks(c);
  }

  /* ---------------- город ---------------- */
  function cityMaterial() {
    return new T.ShaderMaterial({
      uniforms: U, extensions: { derivatives: true },
      vertexShader: [
        "attribute vec3 aOff; attribute vec3 aSize; attribute float aRot; attribute vec4 aInfo;",
        "varying vec3 vL; varying vec3 vNl; varying vec3 vW; varying vec3 vSz; varying vec4 vInfo; varying vec3 vNw;",
        "void main(){",
        "  vec3 l = position * aSize; vL = l; vSz = aSize; vNl = normal; vInfo = aInfo;",
        "  float c = cos(aRot), s = sin(aRot);",
        "  vec3 w = vec3(c*l.x + s*l.z, l.y, -s*l.x + c*l.z) + aOff;",
        "  vNw = vec3(c*normal.x + s*normal.z, normal.y, -s*normal.x + c*normal.z);",
        "  vW = w; gl_Position = projectionMatrix*viewMatrix*vec4(w,1.0); }"].join("\n"),
      fragmentShader: [
        "uniform float uTime, uNight, uBright, uFlick, uFogDen, uFlash; uniform vec3 uSun, uSunCol, uAmb, uFogCol, uSkyHor, uSkyTop;",
        "varying vec3 vL; varying vec3 vNl; varying vec3 vW; varying vec3 vSz; varying vec4 vInfo; varying vec3 vNw;", FOG_F,
        "float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
        "vec3 hue2rgb(float h){ return clamp(abs(mod(h*6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0); }",
        "void main(){",
        "  float lit = vInfo.x; float hue = vInfo.y; float seed = vInfo.z; float flag = vInfo.w;",
        "  bool roof = abs(vNl.y) > 0.5;",
        "  float u = abs(vNl.x) > 0.5 ? vL.z : vL.x; float hw = abs(vNl.x) > 0.5 ? vSz.z*0.5 : vSz.x*0.5;",
        "  float v = vL.y;",
        "  vec3 n = normalize(vNw); vec3 view = normalize(cameraPosition - vW);",
        "  float diff = max(dot(n, uSun), 0.0) * step(0.0, uSun.y);",
        "  vec3 albedo = mix(vec3(0.13,0.16,0.21), vec3(0.32,0.34,0.38), h21(vec2(seed, 3.1)));",
        "  float fr = pow(1.0 - max(dot(n, view), 0.0), 3.0);",
        "  vec3 col = albedo*(uAmb*0.8 + uSunCol*diff*1.3)*(1.0-uNight) + mix(uSkyHor, uSkyTop, 0.5)*fr*0.45*(1.0-uNight);",
        "  col += vec3(0.012,0.016,0.026)*uNight;",
        "  vec3 hc = mix(vec3(1.0,0.82,0.55), hue2rgb(hue), 0.55);",
        "  if (!roof){",
        "    vec2 cell = vec2(u/0.085, v/0.075); vec2 f = fract(cell); vec2 id = floor(cell);",
        "    float win = step(0.18,f.x)*step(f.x,0.82)*step(0.22,f.y)*step(f.y,0.78);",
        "    float hsh = h21(id + vec2(seed*13.7, seed*7.3));",
        "    float on = step(hsh, lit*uBright);",
        "    if (flag > 1.5 && flag < 2.5) on *= step(0.5, fract(sin(floor(uTime*6.0) + seed*91.0)*437.5));", // сбой сети: мерцание
        "    if (flag > 0.5 && flag < 1.5) on *= 0.12;",                                              // сбой сети: погашено
        "    col = mix(col, mix(uSkyHor, uSkyTop, 0.6)*0.45 + col*0.3, win*(1.0-uNight)*0.7);",
        "    col += win*on*hc*(0.25 + 1.15*uNight);",
        "  } else { col *= 0.7; }",
        // кромки (как каркас в CAD): по расстоянию до рёбер грани
        "  float eu = hw - abs(u), ev = min(v, vSz.y - v);",
        "  if (roof){ eu = min(vSz.x*0.5 - abs(vL.x), vSz.z*0.5 - abs(vL.z)); ev = 1.0; }",
        "  float ew = fwidth(eu) * 1.2 + 0.004;",
        "  float edge = 1.0 - smoothstep(0.0, ew, min(eu, ev));",
        "  float hero = step(3.5, flag);",
        "  vec3 ec = mix(vec3(0.35,0.9,1.0), hue2rgb(hue), 0.35 + hero*0.5);",
        "  col += edge*ec*(0.18 + 0.5*uNight + hero*0.6)*uFlick;",
        "  col += vec3(0.7,0.7,1.0)*uFlash*0.15;",
        "  gl_FragColor = vec4(applyFog(col, length(vW - cameraPosition)), 1.0);",
        "}"].join("\n")
    });
  }

  function buildCity(order, radars, se, outages, rnd, slot) {
    var lay = rng("orb-megacity-layout-v1");   // фиксированная раскладка — город не прыгает между сменами
    var N = order.length || 7, span = 210, a0 = 195;  // районы: дуга от запада (слева) к востоку (справа)
    var rings = [3.3, 6.0, 8.7];
    var list = [];
    function streetClear(r, phiDeg) {
      for (var i = 0; i < rings.length; i++) if (Math.abs(r - rings[i]) < 0.22) return false;
      for (var j = 0; j <= N; j++) { var b = a0 - j * span / N; if (Math.abs(phiDeg - b) * RAD * r < 0.22) return false; }
      return true;
    }
    // пятна сбоев сети: каждой стране из internet.outages — квартал (детерминированно по слоту и коду страны)
    var spots = outages.slice(0, 12).map(function (o, i) {
      var rr = rng(slot + "|" + (o && o.cc || i)); var phi = (a0 - rr() * span) * RAD, r = 3.6 + rr() * 6.5;
      return { x: Math.cos(phi) * r, z: -Math.sin(phi) * r, ongoing: !!(o && o.ongoing) };
    });
    stat.outageBlocks = spots.length;
    var heroes = [];
    order.forEach(function (id, di) {
      var r = radars[id], risk = r ? num(r.risk_index) : null;
      var hue = (HUE[id] !== undefined ? HUE[id] : 200) / 360;
      var lit = risk === null ? 0 : clamp(risk, 0, 100) / 100;
      var phiC = a0 - (di + 0.5) * span / N;
      // башня-радар района: высота = risk_index (как на текущем сайте)
      if (risk !== null) {
        var hx = Math.cos(phiC * RAD) * 4.6, hz = -Math.sin(phiC * RAD) * 4.6, H = 1.4 + risk * 0.075;
        heroes.push({ id: id, x: hx, z: hz, h: H, hue: hue * 360 });
        list.push([hx, 0, hz, 1.0, H * 0.62, 1.0, phiC * RAD, lit, hue, 31 + di, 4]);
        list.push([hx, H * 0.62, hz, 0.78, H * 0.26, 0.78, phiC * RAD, lit, hue, 41 + di, 4]);
        list.push([hx, H * 0.88, hz, 0.52, H * 0.12, 0.52, phiC * RAD, lit, hue, 51 + di, 4]);
      }
      for (var rr_ = 2.35; rr_ < R - 0.4; rr_ += 0.46) {
        var step = 0.46 / rr_ / RAD;
        for (var ph = a0 - di * span / N + step * 0.5; ph > a0 - (di + 1) * span / N; ph -= step) {
          var jr = rr_ + (lay() - 0.5) * 0.16, jp = ph + (lay() - 0.5) * step * 0.3;
          var x = Math.cos(jp * RAD) * jr, z = -Math.sin(jp * RAD) * jr;
          var skip = lay();
          if (!streetClear(jr, jp)) continue;
          if (z > coastZ(x) - 0.35 || !inDisc(x, z, 0.5)) continue;
          if (Math.abs(x - 4.0) < 1.2 && z > 1.9) continue;                 // у вышки аэропорта
          if (x < -5.0 && z > 1.6) continue;                                    // порт
          if (Math.hypot(x - (Math.cos(phiC * RAD) * 4.6), z + Math.sin(phiC * RAD) * 4.6) < 0.8) continue; // площадка башни-радара
          if (skip < 0.12) continue;
          var down = clamp(1 - (jr - 2.3) / 9.5, 0, 1);                          // выше ближе к центру (декор раскладки)
          var hgt = 0.18 + Math.pow(lay(), 2.2) * (0.6 + 3.2 * down * down) + down * 0.3;
          var w = 0.22 + lay() * 0.16, d = 0.22 + lay() * 0.16;
          var flag = 0;
          for (var s = 0; s < spots.length; s++) if (Math.hypot(x - spots[s].x, z - spots[s].z) < 0.75) { flag = spots[s].ongoing ? 2 : 1; break; }
          list.push([x, 0, z, w, hgt, d, jp * RAD, lit, hue, lay() * 100, flag]);
        }
      }
    });
    var n = list.length; stat.buildings = n;
    var geo = new T.InstancedBufferGeometry(); var bg = new T.BoxGeometry(1, 1, 1); bg.translate(0, 0.5, 0);
    geo.index = bg.index; geo.attributes.position = bg.attributes.position; geo.attributes.normal = bg.attributes.normal;
    var off = new Float32Array(n * 3), size = new Float32Array(n * 3), rot = new Float32Array(n), info = new Float32Array(n * 4);
    list.forEach(function (b, i) { off.set([b[0], b[1], b[2]], i * 3); size.set([b[3], b[4], b[5]], i * 3); rot[i] = b[6]; info.set([b[7], b[8], b[9], b[10]], i * 4); });
    geo.setAttribute("aOff", new T.InstancedBufferAttribute(off, 3)); geo.setAttribute("aSize", new T.InstancedBufferAttribute(size, 3));
    geo.setAttribute("aRot", new T.InstancedBufferAttribute(rot, 1)); geo.setAttribute("aInfo", new T.InstancedBufferAttribute(info, 4));
    geo.instanceCount = n;
    var mesh = new T.Mesh(geo, cityMaterial()); mesh.frustumCulled = false; dyn.add(mesh);
    anim.heroes = heroes;
    // шпили и маячок на крыше (rooftop_beacon)
    var sp = []; heroes.forEach(function (h) { sp.push(h.x, h.h, h.z, h.x, h.h + 0.8, h.z); });
    dyn.add(segs(sp, lineMat(0xd8f6ff, 0.8)));
    var redP = [], redC = [], redPh = [];
    heroes.forEach(function (h, i) { redP.push(h.x, h.h + 0.82, h.z); redC.push(1, 0.15, 0.15); redPh.push(i * 0.13); });
    if (redP.length) dyn.add(points(redP, redC, redPh, 0.18, 0.75));
    var bId = typeof se.rooftop_beacon === "string" ? se.rooftop_beacon : null;
    heroes.forEach(function (h) {
      if (h.id !== bId) return;
      var bm = new T.Mesh(new T.SphereGeometry(0.22, 16, 12), new T.MeshBasicMaterial({ color: hsl(h.hue, 1, 0.65), transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
      var halo = new T.Mesh(new T.SphereGeometry(0.38, 16, 12), new T.MeshBasicMaterial({ color: hsl(h.hue, 1, 0.6), transparent: true, opacity: 0.25, blending: T.AdditiveBlending, depthWrite: false }));
      bm.position.set(h.x, h.h + 1.05, h.z); halo.position.copy(bm.position); dyn.add(bm, halo); anim.beacon = { a: bm, b: halo };
    });
    // улицы (кольца + радиальные), подсветка = яркость сети
    var st = [];
    rings.forEach(function (r) { for (var p = a0; p > a0 - span; p -= 2) { var x0 = Math.cos(p * RAD) * r, z0 = -Math.sin(p * RAD) * r, x1 = Math.cos((p - 2) * RAD) * r, z1 = -Math.sin((p - 2) * RAD) * r; if (z0 < coastZ(x0) && z1 < coastZ(x1)) st.push(x0, 0.03, z0, x1, 0.03, z1); } });
    for (var j = 0; j <= N; j++) { var b = (a0 - j * span / N) * RAD; for (var q = 2.2; q < R - 0.5; q += 0.5) { var xa = Math.cos(b) * q, za = -Math.sin(b) * q, xb = Math.cos(b) * (q + 0.5), zb = -Math.sin(b) * (q + 0.5); if (za < coastZ(xa) && zb < coastZ(xb)) st.push(xa, 0.03, za, xb, 0.03, zb); } }
    anim.streets = segs(st, lineMat(0xffd9a0, (0.18 + 0.3 * U.uNight.value) * U.uBright.value)); dyn.add(anim.streets);
    anim.roadDef = { rings: rings, a0: a0, span: span, N: N };
  }

  /* ---------------- трафик ---------------- */
  function buildTraffic(t) {
    var rd = anim.roadDef; if (!rd) return;
    var count = Math.round(120 + t * 1100), lay = rng("orb-traffic");
    var pa = new Float32Array(count * 3), road = new Float32Array(count * 4), ph = new Float32Array(count), dir = new Float32Array(count);
    for (var i = 0; i < count; i++) {
      var ring = lay() < 0.55;
      if (ring) { var ri = Math.floor(lay() * rd.rings.length); road.set([0, rd.rings[ri] + (lay() < 0.5 ? -0.05 : 0.05), (rd.a0 - rd.span) * RAD, rd.a0 * RAD], i * 4); }
      else { var j = Math.floor(lay() * (rd.N + 1)); road.set([1, (rd.a0 - j * rd.span / rd.N) * RAD + (lay() < 0.5 ? -0.01 : 0.01), 2.2, R - 0.6], i * 4); }
      ph[i] = lay() * 100; dir[i] = lay() < 0.5 ? 1 : -1;
    }
    var g = new T.BufferGeometry();
    g.setAttribute("position", new T.BufferAttribute(pa, 3)); g.setAttribute("aRoad", new T.BufferAttribute(road, 4));
    g.setAttribute("aPh", new T.BufferAttribute(ph, 1)); g.setAttribute("aDir", new T.BufferAttribute(dir, 1));
    var m = new T.ShaderMaterial({
      uniforms: { uTime: U.uTime, uSpeed: { value: 0.25 + t * 1.3 }, uPx: { value: 1 }, uBright: U.uBright, uNight: U.uNight }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: [
        "attribute vec4 aRoad; attribute float aPh; attribute float aDir; uniform float uTime, uSpeed, uPx; varying vec3 vC;",
        "void main(){ vec3 p; float s = aPh + uTime*uSpeed*aDir;",
        "  if (aRoad.x < 0.5){ float r = aRoad.y; float len = aRoad.w - aRoad.z; float a = aRoad.z + mod(s/r, len); p = vec3(cos(a)*r, 0.06, -sin(a)*r); }",
        "  else { float len = aRoad.w - aRoad.z; float r = aRoad.z + mod(s, len); p = vec3(cos(aRoad.y)*r, 0.06, -sin(aRoad.y)*r); }",
        "  float coast = 2.7 + 0.25*sin(p.x*0.6); if (p.z > coast - 0.05) p.y = -50.0;",
        "  vC = aDir > 0.0 ? vec3(1.0,0.92,0.75) : vec3(1.0,0.2,0.15);",
        "  vec4 mv = modelViewMatrix*vec4(p,1.0); gl_PointSize = 0.13*uPx*300.0/max(1.0,-mv.z); gl_Position = projectionMatrix*mv; }"].join("\n"),
      fragmentShader: "uniform float uBright, uNight; varying vec3 vC; void main(){ float a = smoothstep(0.5,0.0,length(gl_PointCoord-0.5)); float k = (0.5 + 0.8*uNight)*(0.5+0.5*uBright); gl_FragColor = vec4(vC*a*k, a*k); }"
    });
    anim.pointMats.push(m);
    var p = new T.Points(g, m); p.frustumCulled = false; dyn.add(p); stat.traffic = count;
  }

  /* ---------------- провода и пакеты данных (mempool) ---------------- */
  function buildCables(mem) {
    var H = anim.heroes || []; if (H.length < 2) return;
    var ends = [];
    for (var i = 0; i < H.length - 1; i++) ends.push([H[i], H[i + 1]]);
    var center = { x: 0, z: 0, h: 3.2 };
    H.forEach(function (h) { ends.push([h, center]); });
    var P0 = [], P1 = [], P2 = [], ln = [];
    ends.forEach(function (e) {
      var a = new T.Vector3(e[0].x, e[0].h * 0.9, e[0].z), b = new T.Vector3(e[1].x, e[1].h * 0.9, e[1].z);
      var m = a.clone().add(b).multiplyScalar(0.5); m.y -= a.distanceTo(b) * 0.12;   // провис провода
      P0.push(a); P1.push(m); P2.push(b);
      var crv = new T.QuadraticBezierCurve3(a, m, b), pts = crv.getPoints(24);
      for (var k = 0; k < pts.length - 1; k++) ln.push(pts[k].x, pts[k].y, pts[k].z, pts[k + 1].x, pts[k + 1].y, pts[k + 1].z);
    });
    dyn.add(segs(ln, lineMat(0x7ff3ff, 0.22)));
    if (mem === null) return;
    var count = Math.round(clamp(mem / 200, 0, 600)); stat.packets = count; if (!count) return;
    var lay = rng("orb-packets"), cid = new Float32Array(count), ph = new Float32Array(count), pa = new Float32Array(count * 3);
    for (i = 0; i < count; i++) { cid[i] = Math.floor(lay() * ends.length); ph[i] = lay(); }
    var g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(pa, 3)); g.setAttribute("aC", new T.BufferAttribute(cid, 1)); g.setAttribute("aPh", new T.BufferAttribute(ph, 1));
    var nC = ends.length;
    var m = new T.ShaderMaterial({
      uniforms: { uTime: U.uTime, uP0: { value: P0 }, uP1: { value: P1 }, uP2: { value: P2 }, uPx: { value: 1 } }, transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexShader: [
        "#define NC " + nC, "uniform vec3 uP0[NC]; uniform vec3 uP1[NC]; uniform vec3 uP2[NC]; uniform float uTime, uPx; attribute float aC; attribute float aPh; varying float vA;",
        "void main(){ int c = int(aC + 0.5); vec3 a = vec3(0.0), m = vec3(0.0), b = vec3(0.0);",
        "  for (int i = 0; i < NC; i++){ if (i == c){ a = uP0[i]; m = uP1[i]; b = uP2[i]; } }",
        "  float t = fract(aPh + uTime*0.12); float it = 1.0 - t;",
        "  vec3 p = it*it*a + 2.0*it*t*m + t*t*b; vA = sin(t*3.14159);",
        "  vec4 mv = modelViewMatrix*vec4(p,1.0); gl_PointSize = 0.09*uPx*300.0/max(1.0,-mv.z); gl_Position = projectionMatrix*mv; }"].join("\n"),
      fragmentShader: "varying float vA; void main(){ float a = smoothstep(0.5,0.0,length(gl_PointCoord-0.5))*vA; gl_FragColor = vec4(vec3(0.55,1.0,0.95)*a, a); }"
    });
    anim.pointMats.push(m);
    var p = new T.Points(g, m); p.frustumCulled = false; dyn.add(p);
  }

  /* ---------------- маяк ---------------- */
  function buildLighthouse(beam) {
    var pos = anim.lhPos, pw = Math.min(1, beam / 40);
    var lamp = new T.Mesh(new T.SphereGeometry(0.13, 12, 10), new T.MeshBasicMaterial({ color: pw > 0 ? 0xfff2c4 : 0x223040 }));
    lamp.position.set(pos.x, 1.4, pos.z); dyn.add(lamp);
    if (pw <= 0) return;
    var len = 6 + pw * 8, g = new T.ConeGeometry(0.5 + pw * 1.4, len, 24, 1, true); g.translate(0, -len / 2, 0); g.rotateZ(Math.PI / 2);
    var m = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, uniforms: { uS: { value: 0.12 + pw * 0.4 }, uL: { value: len }, uNight: U.uNight },
      vertexShader: "uniform float uL; varying float vD; void main(){ vD = position.x/uL; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: "uniform float uS, uNight; varying float vD; void main(){ float a = (1.0-clamp(vD,0.0,1.0))*uS*(0.35+0.65*uNight); gl_FragColor = vec4(vec3(1.0,0.95,0.8)*a, a); }" });
    var piv = new T.Group(); piv.position.set(pos.x, 1.4, pos.z); piv.add(new T.Mesh(g, m)); dyn.add(piv); anim.beam = piv;
  }

  /* ---------------- корабли ---------------- */
  function buildShips(n, rnd) {
    var hull = new T.BoxGeometry(0.62, 0.1, 0.16); hull.translate(0, 0.05, 0);
    var sup = new T.BoxGeometry(0.16, 0.14, 0.12); sup.translate(-0.18, 0.17, 0);
    var mesh = new T.InstancedMesh(hull, new T.MeshBasicMaterial({ color: 0x05070a }), n), mesh2 = new T.InstancedMesh(sup, new T.MeshBasicMaterial({ color: 0x080b10 }), n);
    var list = [], lp = [], lc = [], lph = [];
    for (var i = 0; i < n; i++) {
      var x, z, tries = 0;
      do { x = -10 + rnd() * 12; z = 4.0 + rnd() * 6.5; tries++; } while ((!inDisc(x, z, 0.8) || onPeninsula(x, z)) && tries < 20);
      list.push({ x: x, z: z, v: 0.02 + rnd() * 0.05, ph: rnd() * 6, ry: (rnd() - 0.5) * 0.5 });
      lp.push(x, 0.32, z); lc.push(1, 1, 0.9); lph.push(-1);
    }
    mesh.frustumCulled = mesh2.frustumCulled = false; dyn.add(mesh, mesh2);
    var lights = points(lp, lc, lph, 0.12); dyn.add(lights);
    anim.ships = { list: list, a: mesh, b: mesh2, lights: lights }; stat.ships = n;
  }

  /* ---------------- ветряки ---------------- */
  function buildTurbines(share) {
    var N = 20, spin = Math.round(N * clamp(share, 0, 100) / 100); stat.turbinesSpinning = spin;
    var mast = [], list = [], lp = [], lc = [], lph = [];
    for (var i = 0; i < N; i++) {
      var x = -6.5 + (i % 10) * 0.95 + (Math.floor(i / 10) ? 0.45 : 0), z = 9.3 + Math.floor(i / 10) * 0.9;
      if (!inDisc(x, z, 0.3)) continue;
      mast.push(x, 0, z, x, 0.9, z); list.push({ x: x, z: z, on: i < spin || (spin > 0 && i % Math.max(1, Math.round(N / spin)) === 0 && list.filter(function (l) { return l.on; }).length < spin) });
      lp.push(x, 0.92, z); lc.push(1, 0.2, 0.2); lph.push(0.3);
    }
    // ровно spin вращающихся
    list.forEach(function (l, k) { l.on = k < spin; });
    dyn.add(segs(mast, lineMat(0xdfefff, 0.5)));
    var blade = new T.BoxGeometry(0.02, 0.32, 0.01); blade.translate(0, 0.21, 0);
    var inst = new T.InstancedMesh(blade, addMat(0xdfefff, 0.55), list.length * 3); inst.frustumCulled = false; dyn.add(inst);
    dyn.add(points(lp, lc, lph, 0.1, 0.5));
    anim.turbines = { list: list, mesh: inst };
  }

  /* ---------------- молнии ---------------- */
  function buildLightning(n, rnd) {
    for (var b = 0; b < n; b++) {
      var x = -9 + rnd() * 15, z = 5 + rnd() * 5, y = 9.5, path = new T.CurvePath(), prev = new T.Vector3(x, y, z), branches = [];
      while (y > 0.35) {
        x += (rnd() - 0.5) * 0.9; y -= 0.25 + rnd() * 0.45; z += (rnd() - 0.5) * 0.3;
        var nxt = new T.Vector3(x, Math.max(y, 0.3), z); path.add(new T.LineCurve3(prev, nxt));
        if (rnd() < 0.12 && y > 3) branches.push([nxt.clone(), new T.Vector3(x + (rnd() - 0.5) * 2.2, y - 1.4 - rnd(), z)]);
        prev = nxt;
      }
      var m = addMat(0xf2f5ff, 0), m2 = addMat(0x9fb4ff, 0), segsN = path.curves.length;
      dyn.add(new T.Mesh(new T.TubeGeometry(path, segsN * 2, 0.018, 3, false), m));
      dyn.add(new T.Mesh(new T.TubeGeometry(path, segsN, 0.07, 4, false), m2));
      branches.forEach(function (br) { dyn.add(new T.Mesh(new T.TubeGeometry(new T.LineCurve3(br[0], br[1]), 3, 0.01, 3, false), m)); });
      anim.bolts.push({ m: m, m2: m2, period: 5 + rnd() * 6, off: rnd() * 10 });
    }
    stat.bolts = n;
  }

  /* ---------------- самолёты и аэропорт ---------------- */
  function buildAircraft(nAir, nGnd, rnd) {
    nAir = Math.round(clamp(nAir, 0, 40)); nGnd = Math.round(clamp(nGnd, 0, 14));
    var shape = new T.BufferGeometry();
    var v = [ 0.22, 0, 0, -0.2, 0, 0.03, -0.2, 0, -0.03,   0.02, 0, 0, -0.06, 0, 0.2, -0.06, 0, -0.2,   -0.16, 0, 0, -0.21, 0.08, 0, -0.21, 0, 0 ];
    shape.setAttribute("position", new T.Float32BufferAttribute(v, 3)); shape.computeVertexNormals();
    var total = nAir + nGnd; if (!total) return;
    var mesh = new T.InstancedMesh(shape, new T.MeshBasicMaterial({ color: 0xe8f4ff, side: T.DoubleSide }), total); mesh.frustumCulled = false; dyn.add(mesh);
    var list = [];
    var thr = new T.Vector3(3.6, 0.12, 5.2), end = new T.Vector3(9.8, 0.12, 5.2);
    for (var i = 0; i < nAir; i++) {
      var kind = i % 4;   // 0 — заход на посадку, 1 — взлёт, 2,3 — транзит/зона ожидания (маршруты схематичны: API даёт только число)
      list.push({ kind: kind, ph: rnd(), sp: 0.018 + rnd() * 0.012, alt: 4.8 + rnd() * 4, rad: 7.5 + rnd() * 5, a0: rnd() * Math.PI * 2, dir: rnd() < 0.5 ? 1 : -1 });
    }
    for (i = 0; i < nGnd; i++) list.push({ kind: 9, x: 5.25 + (i % 7) * 0.32, z: 3.98 + Math.floor(i / 7) * 0.32 });
    var lp = new Float32Array(total * 3 * 3), lc = [], lph = [];
    for (i = 0; i < total; i++) { lc.push(1, 0.15, 0.15, 0.2, 1, 0.3, 1, 1, 1); lph.push(-1, -1, (i * 0.37) % 1); }
    var lg = new T.BufferGeometry(); lg.setAttribute("position", new T.BufferAttribute(lp, 3)); lg.setAttribute("aCol", new T.Float32BufferAttribute(lc, 3)); lg.setAttribute("aPh", new T.Float32BufferAttribute(lph, 1));
    var lights = points([], [], [], 0.2, 1.1); lights.geometry.dispose(); lights.geometry = lg; dyn.add(lights);
    anim.aircraft = { list: list, mesh: mesh, lights: lights, thr: thr, end: end };
    stat.aircraft = nAir; stat.parked = nGnd;
  }
  var _m4, _q, _v, _s, _e;
  function aircraftPose(a, t, out) {
    var thr = anim.aircraft.thr, end = anim.aircraft.end;
    if (a.kind === 9) { out.p.set(a.x, 0.12, a.z); out.yaw = -Math.PI / 2; out.pitch = 0; return; }
    var f = (a.ph + t * a.sp) % 1;
    if (a.kind === 0) {           // заход с запада над морем, касание у порога
      var start = new T.Vector3(-17, 4.5, 5.2);
      if (f < 0.8) { var k = f / 0.8; out.p.lerpVectors(start, thr, k); out.p.y = 4.5 * (1 - k) + 0.12; }
      else { var k2 = (f - 0.8) / 0.2; out.p.lerpVectors(thr, end, k2 * 0.7); out.p.y = 0.12; }
      out.yaw = 0; out.pitch = f < 0.8 ? -0.12 : 0;
    } else if (a.kind === 1) {    // взлёт на восток с набором
      if (f < 0.25) { out.p.lerpVectors(thr, end, f / 0.25 * 0.8); out.p.y = 0.12; out.pitch = 0; }
      else { var k3 = (f - 0.25) / 0.75; out.p.set(end.x - 1.2 + k3 * 14, 0.12 + k3 * k3 * 9 + k3 * 2, 5.2 - k3 * k3 * 6); out.pitch = 0.2; }
      out.yaw = 0;
    } else {                       // транзит по большому кругу над городом
      var ang = a.a0 + a.dir * f * Math.PI * 2;
      out.p.set(Math.cos(ang) * a.rad, a.alt, Math.sin(ang) * a.rad);
      out.yaw = -ang - a.dir * Math.PI / 2; out.pitch = 0;
    }
  }

  /* ---------------- импульсы новостей ---------------- */
  function buildImpulses(list, rnd) {
    var heroes = {}; (anim.heroes || []).forEach(function (h) { heroes[h.id] = h; });
    var dupe = {};
    list.slice(0, 16).forEach(function (im, i) {
      var s = num(im && im.strength); if (s === null) return; s = clamp(s, 0, 1);
      var hue = HUE[im.radar] !== undefined ? HUE[im.radar] : 190;
      var b = num(im.bearing_deg);
      if (!im.local && b !== null) {
        var key = Math.round(b); dupe[key] = (dupe[key] || 0) + 1;
        var bb = (b + (dupe[key] - 1) * 4) * RAD;                    // одинаковые направления чуть разводим
        var start = new T.Vector3(Math.sin(bb) * 15, 0.8, -Math.cos(bb) * 15);  // 0° = север (−z), 90° = восток (+x)
        var endP = new T.Vector3(0, 3.2, 0), mid = start.clone().multiplyScalar(0.45); mid.y = 9 + s * 3;
        var curve = new T.QuadraticBezierCurve3(start, mid, endP);
        var g = new T.TubeGeometry(curve, 48, 0.01 + s * 0.045, 6, false);
        var m = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uTime: U.uTime, uC: { value: hsl(hue, 0.9, 0.62) }, uOff: { value: rnd() }, uS: { value: s } },
          vertexShader: "varying float vU; void main(){ vU = uv.x; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
          fragmentShader: "uniform float uTime, uOff, uS; uniform vec3 uC; varying float vU; void main(){ float p = fract(uTime*0.18 + uOff); float pulse = exp(-pow((vU - p)*12.0, 2.0)); float a = (0.08 + 0.14*uS)*smoothstep(0.0,0.08,vU) + pulse*(0.5+0.4*uS); gl_FragColor = vec4(uC*a, a); }" });
        dyn.add(new T.Mesh(g, m)); stat.impulses++;
      } else if (im.local) {
        var h = heroes[im.radar]; if (!h) return;                   // местный импульс — кольцо у башни своего радара
        var ring = new T.Mesh(new T.RingGeometry(0.4, 0.4 + 0.04 + s * 0.08, 48), new T.MeshBasicMaterial({ color: hsl(hue, 0.9, 0.62), transparent: true, opacity: 0.6, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
        ring.rotation.x = -Math.PI / 2; ring.position.set(h.x, 0.05, h.z); dyn.add(ring); anim.rings.push({ m: ring, s: s, off: rnd() }); stat.impulses++;
      }
    });
  }

  /* ---------------- достопримечательности (landmarks3d.js) ---------------- */
  function mountLandmarks(c) {
    var slotG = anim.landmarkSlot; while (slotG.children.length) { var ch = slotG.children.pop(); disposeTree(ch); }
    var api = window.OrbLandmarks || window.Landmarks3D || window.OrbLandmarks3D;
    if (!api) return;
    var fn = api.build || api.create || api.mount || api.update;
    if (typeof fn !== "function") return;
    try {
      var res = fn.call(api, slotG, c, T, { center: new T.Vector3(0, 0, 0), radius: 1.5 });
      if (res && res.isObject3D && res !== slotG && res.parent !== slotG) slotG.add(res);
    } catch (err) { if (window.console) console.warn("[Orb3D] landmarks failed", err); }
  }

  /* ============================ АНИМАЦИЯ ============================ */
  function loop() {
    if (raf || !ren) return;
    var tick = function () {
      raf = 0;
      if (!onScreen || document.hidden) return;                 // вне экрана / вкладка скрыта — рендер стоит
      var t = clock.getElapsedTime(), now = performance.now();
      if (!orbit.drag && !orbit.auto && !reduce && now - orbit.idle > 4000) orbit.auto = true;
      if (orbit.auto && !reduce) orbit.a += 0.0012;
      cam.position.set(Math.sin(orbit.a) * orbit.r * Math.cos(orbit.e), 1.5 + Math.sin(orbit.e) * orbit.r, Math.cos(orbit.a) * orbit.r * Math.cos(orbit.e));
      cam.lookAt(0, 2.0, 0.6);
      U.uTime.value = t;
      var fl = reduce ? 1 : 0.93 + 0.04 * Math.sin(t * 9.1) + 0.03 * Math.sin(t * 23.7);
      U.uFlick.value = fl;
      var px = ren.getPixelRatio() * (box.clientHeight || 500) / 900;
      if (anim.pointMats) anim.pointMats.forEach(function (m) { if (m.uniforms.uPx) m.uniforms.uPx.value = px; });
      if (anim.scan) { var sy = reduce ? 6 : (t * 1.4) % 14; anim.scan.position.y = sy; anim.scanRing.material.opacity = (reduce ? 0.12 : 0.35) * (1 - sy / 14); }
      if (anim.beam) anim.beam.rotation.y = t * (reduce ? 0.15 : 0.55);
      if (anim.beacon) { var pb = 0.5 + 0.5 * Math.sin(t * (reduce ? 1 : 3)); anim.beacon.b.scale.setScalar(0.8 + pb * 0.6); anim.beacon.b.material.opacity = 0.12 + pb * 0.25; }
      (anim.rings || []).forEach(function (r) { var f = reduce ? 0.5 : (t * 0.35 + r.off) % 1; r.m.scale.setScalar(1 + f * (2 + r.s * 4)); r.m.material.opacity = 0.6 * (1 - f); });
      // молнии: вспышки по детерминированному расписанию; при reduced-motion — без вспышек (тусклые статичные)
      var flash = 0;
      (anim.bolts || []).forEach(function (b) {
        if (reduce) { b.m.opacity = 0.25; b.m2.opacity = 0.05; return; }
        var ph = (t + b.off) % b.period, on = ph < 0.12 || (ph > 0.25 && ph < 0.33);
        b.m.opacity = on ? 1 : 0; b.m2.opacity = on ? 0.25 : 0; if (on) flash = 1;
      });
      U.uFlash.value = flash * 0.8;
      // корабли
      if (anim.ships) {
        _m4 = _m4 || new T.Matrix4(); _q = _q || new T.Quaternion(); _v = _v || new T.Vector3(); _s = _s || new T.Vector3(1, 1, 1); _e = _e || new T.Euler();
        var la = anim.ships.lights.geometry.attributes.position;
        anim.ships.list.forEach(function (s, i) {
          var x = s.x + ((t * s.v + s.ph) % 4) - 2, y = Math.sin(t * 1.3 + s.ph) * U.uWave.value * 0.6;
          _v.set(x, y, s.z); _e.set(Math.sin(t * 1.1 + s.ph) * 0.4 * U.uWave.value, s.ry, Math.sin(t * 1.3 + s.ph) * 0.5 * U.uWave.value); _q.setFromEuler(_e);
          _m4.compose(_v, _q, _s); anim.ships.a.setMatrixAt(i, _m4); anim.ships.b.setMatrixAt(i, _m4);
          la.setXYZ(i, x - 0.18, y + 0.3, s.z);
        });
        anim.ships.a.instanceMatrix.needsUpdate = anim.ships.b.instanceMatrix.needsUpdate = true; la.needsUpdate = true;
      }
      // ветряки
      if (anim.turbines) {
        _m4 = _m4 || new T.Matrix4(); _q = _q || new T.Quaternion(); _v = _v || new T.Vector3(); _s = _s || new T.Vector3(1, 1, 1); _e = _e || new T.Euler();
        var idx = 0;
        anim.turbines.list.forEach(function (tb, k) {
          var ang = tb.on ? (reduce ? 0.3 : t * 1.6 + k) : k * 0.7;
          for (var bl = 0; bl < 3; bl++) { _v.set(tb.x, 0.9, tb.z + 0.03); _e.set(0, 0, ang + bl * 2.094); _q.setFromEuler(_e); _m4.compose(_v, _q, _s); anim.turbines.mesh.setMatrixAt(idx++, _m4); }
        });
        anim.turbines.mesh.instanceMatrix.needsUpdate = true;
      }
      // самолёты + огни
      if (anim.aircraft) {
        _m4 = _m4 || new T.Matrix4(); _q = _q || new T.Quaternion(); _s = _s || new T.Vector3(1, 1, 1); _e = _e || new T.Euler();
        var lpos = anim.aircraft.lights.geometry.attributes.position, pose = { p: new T.Vector3(), yaw: 0, pitch: 0 };
        anim.aircraft.list.forEach(function (a, i) {
          aircraftPose(a, reduce ? 0 : t, pose);
          _e.set(0, pose.yaw, pose.pitch, "YXZ"); _q.setFromEuler(_e); _m4.compose(pose.p, _q, _s); anim.aircraft.mesh.setMatrixAt(i, _m4);
          var cy = Math.cos(pose.yaw), sy = Math.sin(pose.yaw);
          lpos.setXYZ(i * 3, pose.p.x - sy * 0.2 - 0.06 * cy, pose.p.y, pose.p.z - cy * 0.2 + 0.06 * sy);
          lpos.setXYZ(i * 3 + 1, pose.p.x + sy * 0.2 - 0.06 * cy, pose.p.y, pose.p.z + cy * 0.2 + 0.06 * sy);
          lpos.setXYZ(i * 3 + 2, pose.p.x, pose.p.y + 0.05, pose.p.z);
        });
        anim.aircraft.mesh.instanceMatrix.needsUpdate = true; lpos.needsUpdate = true;
      }
      ren.render(scene, cam);
      frames++;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }
  var frames = 0;

  function stats() {
    var tri = 0;
    if (ren) tri = ren.info.render.triangles;
    var o = { frames: frames, triangles_last_frame: tri, calls: ren ? ren.info.render.calls : 0, feeds: { sensors: !!feeds.sensors, aviation: !!feeds.aviation, impulses: !!feeds.impulses } };
    for (var k in stat) o[k] = stat[k];
    return o;
  }

  window.Orb3D = {
    init: init,
    update: update,
    setFeeds: function (f) { if (!f) return; ["sensors", "aviation", "impulses"].forEach(function (k) { if (k in f) feeds[k] = f[k]; }); if (card) rebuild(); },
    stats: stats
  };
})();
