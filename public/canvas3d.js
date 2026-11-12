/* Orb Studio · Художник в 3D: голограмма «город у моря» по реальным полям /api/v1/canvas.
   7 башен = 7 радаров (высота и горящие окна = индекс), море = турбулентность, туман = напряжение,
   луч маяка = внимание в Википедии, корабли = санкционный список, молнии = всплески волатильности,
   маячок на крыше = радар, который сильнее всех сдвинулся за сутки. Текста в сцене нет. */
(function () {
  "use strict";
  var ORDER = ["geo", "politics", "economy", "budget", "crypto", "energy", "web"];
  var HUE = { geo: 352, politics: 318, economy: 212, budget: 146, crypto: 268, energy: 36, web: 186 };
  var T, scene, cam, ren, box, city, sea, seaBase, clock, raf = 0, visible = true, data = null;
  var anim = { scan: null, beam: null, beacon: null, ships: [], bolts: [], rain: null, wins: [], flash: 0, nextBolt: 0 };
  var orbit = { a: -0.5, e: 0.32, r: 21, auto: true, drag: false, px: 0, py: 0, idle: 0 };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rng(str) { var a = 2166136261; for (var i = 0; i < str.length; i++) { a ^= str.charCodeAt(i); a = Math.imul(a, 16777619) >>> 0; }
    return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function col(h, s, l) { return new T.Color().setHSL(((h % 360) + 360) % 360 / 360, s, l); }
  function css(c) { return "#" + c.getHexString(); }

  function ok() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }

  function init(el) {
    if (!window.THREE || !ok()) return false;
    T = window.THREE; box = el; clock = new T.Clock();
    ren = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    ren.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    ren.setClearColor(0x02040a, 1);
    el.appendChild(ren.domElement);
    scene = new T.Scene();
    scene.fog = new T.FogExp2(0x050914, 0.03);
    cam = new T.PerspectiveCamera(40, 1, 0.1, 200);
    // проектор голограммы: светящийся диск и сетка
    var ring = new T.Mesh(new T.RingGeometry(10.6, 11, 96), new T.MeshBasicMaterial({ color: 0x6fe6ff, transparent: true, opacity: 0.55, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = -0.02; scene.add(ring);
    var disc = new T.Mesh(new T.CircleGeometry(10.6, 96), new T.MeshBasicMaterial({ color: 0x0b2236, transparent: true, opacity: 0.35, depthWrite: false }));
    disc.rotation.x = -Math.PI / 2; disc.position.y = -0.03; scene.add(disc);
    var grid = new T.PolarGridHelper(10.6, 24, 8, 96, 0x1f5f80, 0x123a52); grid.material.transparent = true; grid.material.opacity = 0.35; grid.position.y = -0.01; scene.add(grid);
    // скан-плоскость, бегущая снизу вверх
    var scan = new T.Mesh(new T.PlaneGeometry(22, 22), new T.MeshBasicMaterial({ color: 0x6fe6ff, transparent: true, opacity: 0.06, side: T.DoubleSide, blending: T.AdditiveBlending, depthWrite: false }));
    scan.rotation.x = -Math.PI / 2; scene.add(scan); anim.scan = scan;
    city = new T.Group(); scene.add(city);
    bind(); resize();
    new ResizeObserver(resize).observe(el);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) loop(); }, { threshold: 0.05 }).observe(el);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) loop(); });
    loop();
    return true;
  }

  function resize() { if (!ren) return; var w = box.clientWidth || 400, h = box.clientHeight || 500; ren.setSize(w, h, false); ren.domElement.style.width = "100%"; ren.domElement.style.height = "100%"; cam.aspect = w / h; cam.updateProjectionMatrix(); orbit.r = Math.max(orbit.r, w / h < 1 ? 27 : 22); }

  function bind() {
    var c = ren.domElement; c.style.touchAction = "pan-y"; c.style.cursor = "grab";
    c.addEventListener("pointerdown", function (e) { orbit.drag = true; orbit.auto = false; orbit.px = e.clientX; orbit.py = e.clientY; c.style.cursor = "grabbing"; });
    window.addEventListener("pointerup", function () { if (orbit.drag) { orbit.drag = false; orbit.idle = performance.now(); c.style.cursor = "grab"; } });
    window.addEventListener("pointermove", function (e) { if (!orbit.drag) return; orbit.a -= (e.clientX - orbit.px) * 0.006; orbit.e = Math.max(0.08, Math.min(1.1, orbit.e + (e.clientY - orbit.py) * 0.004)); orbit.px = e.clientX; orbit.py = e.clientY; });
    c.addEventListener("wheel", function (e) { e.preventDefault(); orbit.r = Math.max(12, Math.min(34, orbit.r + e.deltaY * 0.01)); }, { passive: false });
  }

  // текстура окон: сетка, горит доля = индекс радара
  function windowsTex(hue, lit, rnd, rows) {
    var cv = document.createElement("canvas"), cols = 5; cv.width = 128; cv.height = Math.max(64, rows * 24);
    var g = cv.getContext("2d"); g.clearRect(0, 0, cv.width, cv.height);
    var cw = cv.width / cols, rh = cv.height / rows;
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
      var on = rnd() < lit, wx = x * cw + cw * 0.18, wy = y * rh + rh * 0.22;
      if (on) { var c = col(hue + (rnd() - 0.5) * 18, 0.95, 0.6 + rnd() * 0.15); g.fillStyle = css(c); g.shadowColor = css(c); g.shadowBlur = 8; }
      else { g.fillStyle = "rgba(60,90,130,.18)"; g.shadowBlur = 0; }
      g.fillRect(wx, wy, cw * 0.64, rh * 0.5);
    }
    var t = new T.CanvasTexture(cv); t.anisotropy = 4; return t;
  }

  function clear(o) { while (o.children.length) { var c = o.children.pop(); clear(c); if (c.geometry) c.geometry.dispose(); if (c.material) { [].concat(c.material).forEach(function (m) { if (m.map) m.map.dispose(); m.dispose(); }); } } }

  function build(card) {
    if (!T || !card || !card.inputs) return;
    data = card; clear(city); anim.ships = []; anim.bolts = []; anim.wins = []; anim.beam = null; anim.beacon = null; anim.rain = null;
    var rnd = rng(card.slot || "x"), st = card.state || {}, se = card.scene_elements || {};
    var ten = (st.tension || 0) / 100, tu = (st.turbulence || 0) / 100;
    var lv = {}; (card.inputs.radars || []).forEach(function (r) { lv[r.id] = r; });
    var mainHue = HUE[(card.inputs.radars || []).slice().sort(function (a, b) { return b.risk_index - a.risk_index; })[0].id] || 200;
    scene.fog.density = 0.018 + ten * 0.03;
    scene.fog.color = col(230, 0.35, 0.03 + (1 - ten) * 0.03);
    ren.setClearColor(scene.fog.color, 1);
    // свечение горизонта цветом главного радара
    var glow = new T.Mesh(new T.SphereGeometry(60, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshBasicMaterial({ color: col(mainHue, 0.7, 0.08 + (card.state.intensity || 50) / 1400), side: T.BackSide, transparent: true, opacity: 0.9, depthWrite: false }));
    city.add(glow);
    // башни по дуге, как на картине: слева направо
    var ids = ORDER.filter(function (id) { return lv[id]; }), n = ids.length;
    ids.forEach(function (id, i) {
      var r = lv[id], hue = HUE[id], h = 1.6 + r.risk_index * 0.075, w = 1.15, d = 1.15;
      var x = (i - (n - 1) / 2) * 1.75, z = (window.OrbLandmarks ? -4.2 : -1.5) + Math.pow((i - (n - 1) / 2) / ((n - 1) / 2), 2) * (window.OrbLandmarks ? 2.6 : 1.6);
      var g = new T.Group(); g.position.set(x, 0, z); city.add(g);
      var c = col(hue, 0.85, 0.6);
      var geo = new T.BoxGeometry(w, h, d); geo.translate(0, h / 2, 0);
      var tex = windowsTex(hue, r.risk_index / 100, rnd, Math.max(6, Math.round(h * 4)));
      var shell = new T.Mesh(geo, new T.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.07, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
      var win = new T.Mesh(geo, new T.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0.95, blending: T.AdditiveBlending, depthWrite: false }));
      var edges = new T.LineSegments(new T.EdgesGeometry(geo), new T.LineBasicMaterial({ color: c, transparent: true, opacity: 0.9, blending: T.AdditiveBlending }));
      g.add(shell, win, edges); anim.wins.push({ m: win.material, e: edges.material, ph: rnd() * 6 });
      // крыши: антенна, шпиль, уступ — разнообразие силуэта
      var k = Math.floor(rnd() * 4); // силуэт крыши меняется от смены к смене
      if (k === 2) { var sp = new T.ConeGeometry(0.62, 1.1, 4); sp.rotateY(Math.PI / 4); sp.translate(0, h + 0.55, 0); g.add(new T.LineSegments(new T.EdgesGeometry(sp), edges.material)); }
      if (k === 1) { var tp = new T.BoxGeometry(0.7, 0.6, 0.7); tp.translate(0, h + 0.3, 0); g.add(new T.LineSegments(new T.EdgesGeometry(tp), edges.material)); }
      if (k === 0 || k === 3) { var an = new T.BufferGeometry().setFromPoints([new T.Vector3(0, h, 0), new T.Vector3(0, h + 1.1, 0)]); g.add(new T.Line(an, edges.material));
        var red = new T.Mesh(new T.SphereGeometry(0.07, 8, 8), new T.MeshBasicMaterial({ color: 0xff5566 })); red.position.y = h + 1.12; g.add(red); anim.wins.push({ red: red, ph: rnd() * 6 }); }
      // световой столб-отражение в «воде»
      var refl = new T.Mesh(new T.PlaneGeometry(w * 0.8, 2 + r.risk_index / 25), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.05 + r.risk_index / 900, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
      refl.rotation.x = -Math.PI / 2; refl.position.set(0, 0.01, d / 2 + 1 + r.risk_index / 50); g.add(refl);
      if (se.rooftop_beacon === id) {
        var bc = new T.Mesh(new T.SphereGeometry(0.22, 16, 16), new T.MeshBasicMaterial({ color: col(hue, 1, 0.7), transparent: true, blending: T.AdditiveBlending }));
        var halo = new T.Mesh(new T.SphereGeometry(0.6, 16, 16), new T.MeshBasicMaterial({ color: col(hue, 1, 0.6), transparent: true, opacity: 0.25, blending: T.AdditiveBlending, depthWrite: false }));
        bc.position.y = halo.position.y = h + (k === 2 ? 1.5 : 1.0); g.add(bc, halo); anim.beacon = { a: bc, b: halo };
      }
    });
    // достопримечательность смены за городом: выбор по главному радару и номеру смены
    if (window.OrbLandmarks) { try { var lm = OrbLandmarks.add(T, city, card, rnd, function (id) { return HUE[id] || 200; }); lm.group.position.set(0, 0, 0.9); lm.group.scale.setScalar(Math.min(1.3, 9.5 / (lm.height || 8))); anim.lm = lm; } catch (e) {} }
    // море: голографическая сетка волн перед городом
    var sg = new T.PlaneGeometry(21, 9, 84, 36); sg.rotateX(-Math.PI / 2); sg.translate(0, 0, 4.2);
    sea = new T.Mesh(sg, new T.MeshBasicMaterial({ color: col(mainHue, 0.5, 0.55), wireframe: true, transparent: true, opacity: 0.07 + tu * 0.1, blending: T.AdditiveBlending, depthWrite: false }));
    seaBase = sg.attributes.position.array.slice(); sea.userData = { geo: sg, tu: tu }; city.add(sea);
    // маяк справа и луч = внимание в Википедии
    var lh = new T.Group(); lh.position.set(7.6, 0, 1.6); city.add(lh);
    var tg = new T.CylinderGeometry(0.22, 0.38, 2.6, 12); tg.translate(0, 1.3, 0);
    lh.add(new T.LineSegments(new T.EdgesGeometry(tg), new T.LineBasicMaterial({ color: 0xfff1c0, transparent: true, opacity: 0.8, blending: T.AdditiveBlending })));
    var beamPow = Math.min(1, (se.lighthouse_beam || 0) / 40);
    var lamp = new T.Mesh(new T.SphereGeometry(0.16, 12, 12), new T.MeshBasicMaterial({ color: beamPow > 0 ? 0xfff4c8 : 0x334455 })); lamp.position.y = 2.7; lh.add(lamp);
    if (beamPow > 0) {
      var bg = new T.ConeGeometry(0.9 + beamPow * 1.6, 9, 24, 1, true); bg.translate(0, -4.5, 0); bg.rotateZ(Math.PI / 2);
      var beam = new T.Mesh(bg, new T.MeshBasicMaterial({ color: 0xfff1c0, transparent: true, opacity: 0.05 + beamPow * 0.12, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide }));
      var piv = new T.Group(); piv.position.y = 2.7; piv.add(beam); lh.add(piv); anim.beam = piv;
    }
    // корабли = санкционный список (1 на 100 судов)
    for (var s = 0; s < (se.ships || 0); s++) {
      var sh = new T.Group(), hb = new T.BoxGeometry(0.7, 0.14, 0.24), cb = new T.BoxGeometry(0.22, 0.18, 0.18); cb.translate(-0.1, 0.16, 0);
      var lm = new T.LineBasicMaterial({ color: 0x8aa0c0, transparent: true, opacity: 0.6 });
      sh.add(new T.LineSegments(new T.EdgesGeometry(hb), lm), new T.LineSegments(new T.EdgesGeometry(cb), lm));
      var rl = new T.Mesh(new T.SphereGeometry(0.04, 6, 6), new T.MeshBasicMaterial({ color: 0xff5a5a })); rl.position.set(-0.1, 0.3, 0); sh.add(rl);
      sh.position.set(-8 + rnd() * 16, 0.08, 2.6 + rnd() * 5.5); sh.rotation.y = (rnd() - 0.5) * 0.6; city.add(sh);
      anim.ships.push({ o: sh, ph: rnd() * 6, v: 0.05 + rnd() * 0.08 });
    }
    // тучи = напряжение: облако частиц над городом
    var cN = Math.round(300 + ten * 1400), cp = new Float32Array(cN * 3);
    for (var q = 0; q < cN; q++) { cp[q * 3] = (rnd() - 0.5) * 26; cp[q * 3 + 1] = 8 + rnd() * 3.5 - ten * 1.5; cp[q * 3 + 2] = -6 + rnd() * 10; }
    var cg = new T.BufferGeometry(); cg.setAttribute("position", new T.BufferAttribute(cp, 3));
    var clouds = new T.Points(cg, new T.PointsMaterial({ color: col(240, 0.15, 0.35 - ten * 0.15), size: 0.16, transparent: true, opacity: 0.35 + ten * 0.3, depthWrite: false }));
    city.add(clouds); anim.clouds = clouds;
    // дождь в шторм
    if (/storm|Шторм/i.test(card.art_style || "") || (st.tension || 0) >= 65) {
      var rN = 900, rp = new Float32Array(rN * 3);
      for (var u = 0; u < rN; u++) { rp[u * 3] = (rnd() - 0.5) * 24; rp[u * 3 + 1] = rnd() * 10; rp[u * 3 + 2] = -6 + rnd() * 14; }
      var rgm = new T.BufferGeometry(); rgm.setAttribute("position", new T.BufferAttribute(rp, 3));
      anim.rain = new T.Points(rgm, new T.PointsMaterial({ color: 0x9fb4d6, size: 0.05, transparent: true, opacity: 0.5, depthWrite: false })); city.add(anim.rain);
    }
    // молнии = всплески волатильности
    for (var b = 0; b < Math.min(8, se.lightning || 0); b++) {
      var pts = [], bx = (rnd() - 0.5) * 16, by = 10, bz = -4 + rnd() * 4; pts.push(new T.Vector3(bx, by, bz));
      while (by > 3) { bx += (rnd() - 0.5) * 1.2; by -= 0.6 + rnd() * 0.9; pts.push(new T.Vector3(bx, by, bz)); }
      var bl = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0xe9e4ff, transparent: true, opacity: 0, blending: T.AdditiveBlending }));
      city.add(bl); anim.bolts.push(bl);
    }
    anim.nextBolt = 0;
  }

  function loop() {
    if (raf || !ren) return;
    var tick = function () {
      raf = 0;
      if (!visible || document.hidden) return;
      var t = clock.getElapsedTime(), now = performance.now();
      if (!orbit.drag && !orbit.auto && now - orbit.idle > 4000) orbit.auto = true;
      if (orbit.auto && !reduce) orbit.a += 0.0016;
      cam.position.set(Math.sin(orbit.a) * orbit.r * Math.cos(orbit.e), 2 + Math.sin(orbit.e) * orbit.r, Math.cos(orbit.a) * orbit.r * Math.cos(orbit.e));
      cam.lookAt(0.6, 3.4, 0);
      if (anim.scan) { var sy = (t * 1.6) % 11; anim.scan.position.y = sy; anim.scan.material.opacity = 0.07 * (1 - sy / 11); }
      // мерцание голограммы
      var fl = 0.92 + Math.sin(t * 9.1) * 0.03 + (Math.random() < 0.012 ? -0.25 : 0);
      anim.wins.forEach(function (w) { if (w.m) { w.m.opacity = 0.95 * fl; w.e.opacity = (0.75 + Math.sin(t * 1.3 + w.ph) * 0.15) * fl; } if (w.red) w.red.visible = Math.sin(t * 2.2 + w.ph) > -0.2; });
      if (sea && seaBase) {
        var pa = sea.userData.geo.attributes.position.array, tu = sea.userData.tu, amp = 0.03 + tu * 0.18;
        for (var i = 0; i < pa.length; i += 3) { var x = seaBase[i], z = seaBase[i + 2]; pa[i + 1] = Math.sin(x * 0.9 + t * 1.4) * amp * 0.6 + Math.sin(z * 1.7 - t * 1.9 + x * 0.3) * amp; }
        sea.userData.geo.attributes.position.needsUpdate = true;
      }
      if (anim.beam) anim.beam.rotation.y = t * 0.6;
      if (anim.beacon) { var pb = 0.5 + Math.sin(t * 3) * 0.5; anim.beacon.b.scale.setScalar(0.8 + pb * 0.6); anim.beacon.b.material.opacity = 0.12 + pb * 0.25; }
      anim.ships.forEach(function (s) { s.o.position.y = 0.08 + Math.sin(t * 1.5 + s.ph) * 0.04; s.o.position.x += s.v * 0.01; if (s.o.position.x > 9) s.o.position.x = -9; s.o.rotation.z = Math.sin(t * 1.2 + s.ph) * 0.05; });
      if (anim.clouds) anim.clouds.rotation.y = t * 0.01;
      if (anim.rain) { var rp = anim.rain.geometry.attributes.position; for (var r = 1; r < rp.array.length; r += 3) { rp.array[r] -= 0.18; if (rp.array[r] < 0) rp.array[r] = 10; } rp.needsUpdate = true; }
      if (anim.bolts.length) {
        if (t > anim.nextBolt) { var bo = anim.bolts[Math.floor(Math.random() * anim.bolts.length)]; bo.material.opacity = 1; anim.flash = 1; anim.nextBolt = t + 1.5 + Math.random() * 4; }
        anim.bolts.forEach(function (b) { b.material.opacity *= 0.88; });
        anim.flash *= 0.85; if (anim.flash > 0.02) ren.setClearColor(new T.Color(scene.fog.color).lerp(new T.Color(0x3a3560), anim.flash * 0.6), 1); else ren.setClearColor(scene.fog.color, 1);
      }
      ren.render(scene, cam);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  window.Orb3D = { init: init, update: build };
})();
