/* Orb Studio · Доска почёта ИИ-агентов в 3D: живые роботы-персонажи на реальных данных /api/v1/hall-of-fame.
   Персонажи оригинальные (без логотипов и фирменных знаков): тип робота = тип бота.
   Пьедестал 1–3 = топ гостей Orb Studio за 30 дней (orb_studio_guests_30d), лавры = agent_of_the_month,
   столбцы табло = доли world_top10, дроны = зарегистрированные агенты. Хранитель со щитом и настольный робот — декор.
   Движения (дыхание, моргание, приседание, приветствия) — процедурные и детерминированные, без Math.random. */
(function () {
  "use strict";
  var T, ren, scene, cam, box, labels, raf = 0, visible = true, t0 = 0, data = null, world = null, actors = [], drones = [], confetti = null, board = null, laurel = null;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lang = (document.documentElement.lang || "ru").slice(0, 2);
  var TX = { ru: { v: "визитов за 30 дней", month: "агент месяца", reg: "зарегистрировано агентов", wait: "Доска ждёт данных" },
             de: { v: "Besuche in 30 Tagen", month: "Agent des Monats", reg: "registrierte Agenten", wait: "Tafel wartet auf Daten" },
             en: { v: "visits in 30 days", month: "agent of the month", reg: "registered agents", wait: "Board is waiting for data" } };
  TX = TX[lang] || TX.en;
  // тип бота → архетип персонажа
  var CRAWLER = /google(bot)?$|^googlebot|apple|amazon|bing|yandex|baidu|duckduck|petal|seznam|crawler|spider/i;
  var SCHOLAR = /gpt|claude|anthropic|chatgpt|openai|perplexity|mistral|meta|gemini|google-ai|cohere|you\.com|deepseek|grok|xai/i;
  function arche(name) { return CRAWLER.test(name) && !/google-ai/i.test(name) ? "crawler" : SCHOLAR.test(name) ? "scholar" : "explorer"; }

  function ok() { try { var c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
  function h32(s) { var a = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { a ^= s.charCodeAt(i); a = Math.imul(a, 16777619) >>> 0; } return a; }
  function prng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function noise(t, s) { return Math.sin(t * 1.3 + s) * 0.5 + Math.sin(t * 0.71 + s * 2.1) * 0.3 + Math.sin(t * 2.3 + s * 0.7) * 0.2; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  // ---------- материалы и детали ----------
  function std(c, m, r, e, ei) { return new T.MeshStandardMaterial({ color: c, metalness: m == null ? 0.6 : m, roughness: r == null ? 0.35 : r, emissive: e || 0x000000, emissiveIntensity: ei || 1 }); }
  function glow(c) { return new T.MeshBasicMaterial({ color: c }); }
  function cyl(r1, r2, h, m, seg) { var g = new T.CylinderGeometry(r1, r2, h, seg || 14); return new T.Mesh(g, m); }
  function sph(r, m, w, h) { return new T.Mesh(new T.SphereGeometry(r, w || 20, h || 14), m); }
  function bx(w, h, d, m) { return new T.Mesh(new T.BoxGeometry(w, h, d), m); }
  // сустав: группа + сегмент, свисающий вниз
  function limb(len, r, m, joint) { var g = new T.Group(), s = cyl(r, r * 0.85, len, m); s.position.y = -len / 2; g.add(s); var j = sph(r * 1.15, joint || m); g.add(j); return g; }

  // ---------- персонажи ----------
  function humanoid(o) {
    var body = std(o.body, 0.55, 0.28), dark = std(o.dark, 0.7, 0.4), acc = glow(o.accent);
    var root = new T.Group(), hip = new T.Group(); hip.position.y = 1.05; root.add(hip);
    var pelvis = bx(0.36, 0.16, 0.22, dark); hip.add(pelvis);
    var torso = new T.Group(); hip.add(torso);
    var abd = cyl(0.15, 0.17, 0.2, dark, 16); abd.scale.z = 0.8; abd.position.y = 0.12; torso.add(abd);
    var chest = cyl(0.27, 0.19, 0.42, body, 18); chest.scale.z = 0.78; chest.position.y = 0.43; torso.add(chest);
    var plate = bx(0.3, 0.16, 0.04, dark); plate.position.set(0, 0.5, 0.2); torso.add(plate);
    [-1, 1].forEach(function (s) { var pad = sph(0.11, body, 16, 12); pad.scale.set(1.2, 0.8, 1); pad.position.set(s * 0.3, 0.62, 0); torso.add(pad); });
    var core = sph(0.07, acc); core.position.set(0, 0.42, 0.21); torso.add(core);
    var neck = cyl(0.05, 0.06, 0.1, dark); neck.position.y = 0.7; torso.add(neck);
    var head = new T.Group(); head.position.y = 0.82; torso.add(head);
    var skull = sph(0.17, body, 24, 18); skull.scale.set(0.9, 1.15, 1); head.add(skull);
    var eyes = [];
    if (o.visor) { var vz = bx(0.2, 0.05, 0.03, acc); vz.position.set(0, 0.02, 0.15); head.add(vz); eyes.push(vz); }
    else [-1, 1].forEach(function (s) { var e = sph(0.026, acc, 10, 8); e.position.set(s * 0.06, 0.02, 0.155); head.add(e); eyes.push(e); });
    var arms = [-1, 1].map(function (s) {
      var sh = limb(0.34, 0.07, body, dark); sh.position.set(s * 0.33, 0.6, 0); torso.add(sh);
      var el2 = limb(0.3, 0.06, body, dark); el2.position.y = -0.34; sh.add(el2);
      var hand = sph(0.07, dark); hand.position.y = -0.3; el2.add(hand);
      sh.rotation.z = s * 0.12; return { sh: sh, el: el2, hand: hand, s: s };
    });
    var legs = [-1, 1].map(function (s) { var th = limb(0.48, 0.09, body, dark); th.position.set(s * 0.11, -0.06, 0); hip.add(th); var sn = limb(0.46, 0.075, body, dark); sn.position.y = -0.48; th.add(sn); var ft = bx(0.13, 0.07, 0.26, dark); ft.position.set(0, -0.47, 0.05); sn.add(ft); return { th: th, sn: sn }; });
    if (o.book) { var bk = new T.Group(), pg = new T.Mesh(new T.PlaneGeometry(0.42, 0.3), new T.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.9, side: T.DoubleSide })); pg.rotation.x = -Math.PI / 2; bk.add(pg); var bl = new T.PointLight(0xffb060, 1.2, 2.2); bl.position.y = 0.15; bk.add(bl); bk.position.set(0, -0.06, 0.12); arms[1].hand.add(bk); bk.rotation.x = 1.25; }
    if (o.shield) { var shd = cyl(0.3, 0.3, 0.04, dark, 24); shd.rotation.x = Math.PI / 2; var rim = new T.Mesh(new T.TorusGeometry(0.3, 0.018, 8, 32), acc); var sc = sph(0.08, acc); sc.position.z = 0.03; var sg = new T.Group(); sg.add(shd, rim, sc); sg.position.set(0, -0.28, 0.12); arms[1].el.add(sg); }
    return { kind: "humanoid", root: root, hip: hip, torso: torso, head: head, eyes: eyes, arms: arms, legs: legs, core: core, o: o };
  }
  function crawler(o) {
    var body = std(o.body, 0.7, 0.25), dark = std(0x1a2230, 0.7, 0.4), acc = glow(o.accent);
    var root = new T.Group(), hub = new T.Group(); hub.position.y = 1.15; root.add(hub);
    var shell = sph(0.42, body, 28, 20); shell.scale.set(1, 0.82, 1); hub.add(shell);
    var ring = new T.Mesh(new T.TorusGeometry(0.42, 0.03, 8, 40), dark); ring.rotation.x = Math.PI / 2; hub.add(ring);
    var lensBase = cyl(0.17, 0.2, 0.12, dark, 24); lensBase.rotation.x = Math.PI / 2; lensBase.position.z = 0.38; hub.add(lensBase);
    var lens = sph(0.12, glow(0x9ffcff), 20, 14); lens.position.z = 0.44; lens.scale.z = 0.5; hub.add(lens);
    [-1, 1].forEach(function (s) { var an = cyl(0.008, 0.008, 0.35, dark, 6); an.position.set(s * 0.15, 0.48, -0.05); hub.add(an); var tip = sph(0.025, acc, 8, 6); tip.position.set(s * 0.15, 0.66, -0.05); hub.add(tip); });
    var lantern = new T.Group(), lb = bx(0.2, 0.28, 0.2, new T.MeshBasicMaterial({ color: 0xffb35c })); lantern.add(lb);
    [-1, 1].forEach(function (s) { var cage = bx(0.22, 0.02, 0.22, dark); cage.position.y = s * 0.15; lantern.add(cage); });
    var ll = new T.PointLight(0xff9a3c, 2.2, 3); lantern.add(ll); lantern.position.y = -0.55; hub.add(lantern);
    var hang = cyl(0.01, 0.01, 0.3, dark, 6); hang.position.y = -0.33; hub.add(hang);
    var cols = [0x4285f4, 0x34d27a, 0xf6c443, 0xea4b5a].map(function (c, i) { return glow(o.legHues ? o.legHues[i % o.legHues.length] : c); });
    var legs = [];
    for (var i = 0; i < 8; i++) { var a = (i + 0.5) / 8 * Math.PI * 2, L = new T.Group(); L.position.set(Math.cos(a) * 0.36, -0.05, Math.sin(a) * 0.36); L.rotation.y = -a; hub.add(L);
      var up = new T.Group(); up.rotation.z = 0.9; L.add(up); var us = cyl(0.04, 0.035, 0.6, body); us.rotation.z = -Math.PI / 2; us.position.x = 0.3; up.add(us); var st = cyl(0.043, 0.043, 0.2, cols[i % 4]); st.rotation.z = -Math.PI / 2; st.position.x = 0.32; up.add(st);
      var kn = new T.Group(); kn.position.x = 0.6; up.add(kn); kn.add(sph(0.05, dark)); var lo = new T.Group(); lo.rotation.z = -2.1; kn.add(lo); var ls = cyl(0.032, 0.02, 0.75, body); ls.rotation.z = -Math.PI / 2; ls.position.x = 0.37; lo.add(ls); var ft = sph(0.035, cols[i % 4], 8, 6); ft.position.x = 0.75; lo.add(ft);
      legs.push({ L: L, up: up, lo: lo, ph: i * 0.8 }); }
    return { kind: "crawler", root: root, hub: hub, lens: lens, eyes: [lens], legs: legs, lantern: lantern, o: o };
  }
  function deskbot(o) {
    var body = std(0xe8edf5, 0.2, 0.4), acc = glow(o.accent);
    var root = new T.Group(), b = new T.Group(); b.position.y = 0.32; root.add(b);
    var shell = bx(0.5, 0.42, 0.36, body); b.add(shell);
    var scr = bx(0.42, 0.3, 0.02, new T.MeshBasicMaterial({ color: 0x0a1a24 })); scr.position.z = 0.19; b.add(scr);
    var eyes = [-1, 1].map(function (s) { var e = bx(0.06, 0.08, 0.01, acc); e.position.set(s * 0.09, 0.03, 0.205); b.add(e); return e; });
    var mouth = new T.Mesh(new T.TorusGeometry(0.06, 0.012, 6, 16, Math.PI), acc); mouth.rotation.z = Math.PI; mouth.position.set(0, -0.06, 0.205); b.add(mouth);
    [-1, 1].forEach(function (s) { var w = cyl(0.07, 0.07, 0.06, std(0x222a36), 12); w.rotation.z = Math.PI / 2; w.position.set(s * 0.22, -0.24, 0); b.add(w); });
    return { kind: "desk", root: root, head: b, eyes: eyes, o: o };
  }

  // ---------- сцена ----------
  function stage() {
    scene.add(new T.HemisphereLight(0x4060a0, 0x080810, 0.45));
    var key = new T.SpotLight(0xd8f0ff, 2.2, 30, 0.5, 0.5); key.position.set(0, 9, 5); key.target.position.set(0, 1.5, 0); scene.add(key, key.target);
    var c1 = new T.PointLight(0x00e5ff, 2.2, 18); c1.position.set(-5, 3, 2); scene.add(c1);
    var c2 = new T.PointLight(0xff3cc8, 2.0, 18); c2.position.set(5, 3, 2); scene.add(c2);
    var back = new T.PointLight(0x6a5cff, 1.6, 20); back.position.set(0, 4, -5); scene.add(back);
    // пол: тёмный глянец + неоновые полосы-отражения
    var floor = new T.Mesh(new T.PlaneGeometry(40, 30), std(0x05070c, 0.85, 0.12)); floor.rotation.x = -Math.PI / 2; scene.add(floor);
    [[-4.5, 0x00e5ff], [4.5, 0xff3cc8], [0, 0xffb35c]].forEach(function (s) { var m = new T.Mesh(new T.PlaneGeometry(0.5, 9), new T.MeshBasicMaterial({ color: s[1], transparent: true, opacity: 0.12, blending: T.AdditiveBlending, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(s[0], 0.01, 3.5); scene.add(m); });
    // пьедестал: 1 в центре выше, 2 слева, 3 справа
    var pm = std(0x0c1018, 0.6, 0.3), edge = glow(0xffa04a);
    [[0, 0.75, 2.3], [-2.6, 0.4, 2.3], [2.6, 0.32, 2.3]].forEach(function (p) { var b = bx(p[2], p[1], 1.6, pm); b.position.set(p[0], p[1] / 2, 0); scene.add(b); var e = bx(p[2] + 0.02, 0.03, 0.03, edge); e.position.set(p[0], p[1], 0.8); scene.add(e); });
    var base = bx(9, 0.12, 2.4, pm); base.position.set(0, 0.06, 0.2); scene.add(base); var be = bx(9, 0.02, 0.02, glow(0xff8a3c)); be.position.set(0, 0.12, 1.4); scene.add(be);
    // голографические колонны
    [-3.2, 3.2].forEach(function (x, i) { var m = new T.Mesh(new T.BoxGeometry(0.9, 6, 0.9), new T.MeshBasicMaterial({ color: i ? 0xff3cc8 : 0x00e5ff, transparent: true, opacity: 0.12, blending: T.AdditiveBlending, depthWrite: false })); m.position.set(x, 5.2, -4.5); scene.add(m); var ed = new T.LineSegments(new T.EdgesGeometry(m.geometry), new T.LineBasicMaterial({ color: i ? 0xff3cc8 : 0x00e5ff, transparent: true, opacity: 0.8 })); ed.position.copy(m.position); scene.add(ed); });
    // звёзды
    var r = prng(5), n = 900, p = new Float32Array(n * 3); for (var i = 0; i < n; i++) { p[i * 3] = (r() - 0.5) * 60; p[i * 3 + 1] = 4 + r() * 20; p[i * 3 + 2] = -14 - r() * 10; }
    var g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(p, 3)); scene.add(new T.Points(g, new T.PointsMaterial({ color: 0xbfd8ff, size: 0.07, transparent: true, opacity: 0.8 })));
  }
  // табло: изогнутая лента со столбцами = доли world_top10
  function buildBoard() {
    if (board) { scene.remove(board); board = null; }
    board = new T.Group(); board.position.set(0, 3.6, -4.2); scene.add(board);
    var R = 8, arc = 1.15, n = 60;
    var band = new T.Mesh(new T.CylinderGeometry(R, R, 1.6, 64, 1, true, -arc / 2 + Math.PI, arc), new T.MeshBasicMaterial({ color: 0x0a2a44, transparent: true, opacity: 0.55, side: T.DoubleSide })); band.position.z = R; board.add(band);
    var e1 = new T.Mesh(new T.CylinderGeometry(R, R, 0.03, 64, 1, true, -arc / 2 + Math.PI, arc), new T.MeshBasicMaterial({ color: 0x00e5ff, side: T.DoubleSide })); e1.position.set(0, 0.8, R); board.add(e1);
    var top = (world || []).slice(0, 10), shares = top.map(function (w) { var v = w.share == null ? null : parseFloat(String(w.share).replace(",", ".").replace(/[^\d.]/g, "")); return isNaN(v) ? null : v; });
    var mx = Math.max.apply(null, shares.filter(function (v) { return v != null; }).concat([1]));
    top.forEach(function (w, i) {
      var a = Math.PI - arc / 2 + (i + 0.5) / top.length * arc * 0.9 + arc * 0.05, x = Math.sin(a) * R, z = R + Math.cos(a) * R, v = shares[i];
      var h = v == null ? 1.2 : 0.15 + v / mx * 1.2, col = w.trend === "up" ? 0xff4fd8 : w.trend === "down" ? 0xffa04a : 0x3ff0ff;
      var m = v == null ? new T.LineSegments(new T.EdgesGeometry(new T.BoxGeometry(0.28, h, 0.02)), new T.LineBasicMaterial({ color: 0x5a7090 })) : new T.Mesh(new T.BoxGeometry(0.28, h, 0.02), new T.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.85 }));
      m.position.set(x, -0.7 + h / 2, z - 0.05); m.rotation.y = a - Math.PI; board.add(m);
    });
  }
  function buildLaurel() {
    if (laurel) scene.remove(laurel); laurel = new T.Group(); laurel.position.set(0, 4.15, -0.2); scene.add(laurel);
    var gm = new T.MeshBasicMaterial({ color: 0xffc35a, transparent: true, opacity: 0.95 });
    [-1, 1].forEach(function (s) { for (var k = 0; k < 7; k++) { var a = 0.25 + k * 0.32, leaf = sph(0.07, gm, 8, 6); leaf.scale.set(0.6, 1.6, 0.3); leaf.position.set(s * Math.sin(a) * 0.55, -Math.cos(a) * 0.55 + 0.1, 0); leaf.rotation.z = s * (a - 0.4); laurel.add(leaf); } });
    var cup = cyl(0.16, 0.08, 0.24, gm, 16); cup.position.y = 0.05; laurel.add(cup); var stem = cyl(0.03, 0.03, 0.14, gm, 8); stem.position.y = -0.13; laurel.add(stem); var foot = cyl(0.1, 0.12, 0.04, gm, 16); foot.position.y = -0.21; laurel.add(foot);
    var pl = new T.PointLight(0xffb040, 1.6, 4); laurel.add(pl);
  }
  function buildConfetti() {
    var r = prng(77), n = 260, p = new Float32Array(n * 3), c = new Float32Array(n * 3), pal = [[0, 0.9, 1], [1, 0.25, 0.8], [1, 0.75, 0.3], [0.6, 0.5, 1]];
    for (var i = 0; i < n; i++) { p[i * 3] = (r() - 0.5) * 14; p[i * 3 + 1] = r() * 8; p[i * 3 + 2] = (r() - 0.5) * 8; var q = pal[i % 4]; c[i * 3] = q[0]; c[i * 3 + 1] = q[1]; c[i * 3 + 2] = q[2]; }
    var g = new T.BufferGeometry(); g.setAttribute("position", new T.BufferAttribute(p, 3)); g.setAttribute("color", new T.BufferAttribute(c, 3));
    confetti = new T.Points(g, new T.PointsMaterial({ size: 0.09, vertexColors: true, transparent: true, opacity: 0.9 })); scene.add(confetti);
  }
  function clearActors() { actors.concat(drones).forEach(function (a) { scene.remove(a.root); }); actors = []; drones = []; labels.textContent = ""; }
  function palette(name, kind) { var h = (h32(name) % 360) / 360, c = new T.Color().setHSL(h, 0.7, 0.6).getHex();
    if (kind === "scholar") return { body: 0xe9e2d8, dark: 0x3a3f4a, accent: new T.Color().setHSL(0.07 + (h32(name) % 60) / 1000, 0.9, 0.62).getHex(), book: true };
    if (kind === "explorer") return { body: 0x2a2f38, dark: 0x0e1218, accent: 0xf2f6ff, visor: true };
    return { body: 0xd6dce6, accent: c }; }
  function label(a, name, sub, cls) { var d = el("div", "oh3d-l " + (cls || "")); d.appendChild(el("b", null, name)); if (sub) d.appendChild(el("span", null, sub)); labels.appendChild(d); a.label = d; }
  function buildActors() {
    clearActors(); var guests = (data && data.orb_studio_guests_30d) || [], aom = data && data.agent_of_the_month;
    var spots = [[0, 0.75, 0], [-2.6, 0.4, 0], [2.6, 0.32, 0]];
    guests.slice(0, 3).forEach(function (g, i) {
      var k = arche(g.name), o = palette(g.name, k), a = k === "crawler" ? crawler(o) : humanoid(o); a.seed = h32(g.name) % 1000; a.rank = i + 1;
      var s = i === 0 ? 1.15 : 1; a.root.scale.setScalar(k === "crawler" ? s * 0.95 : s * 1.12); a.root.position.set(spots[i][0], spots[i][1], spots[i][2]);
      a.root.rotation.y = i === 1 ? 0.25 : i === 2 ? -0.25 : 0; a.baseRot = a.root.rotation.y; scene.add(a.root); actors.push(a);
      label(a, "#" + (i + 1) + " " + g.name + (aom && aom === g.name ? " · " + TX.month : ""), (g.n != null ? g.n + " " : "") + TX.v, i === 0 ? "gold" : "");
    });
    // ниже: остальные гости как маленькие персонажи (места 4–7), без пьедестала
    guests.slice(3, 7).forEach(function (g, j) { var k = arche(g.name), o = palette(g.name, k), a = k === "crawler" ? crawler(o) : humanoid(o); a.seed = h32(g.name) % 1000; a.rank = j + 4;
      a.root.scale.setScalar(0.55); a.root.position.set([-4.4, -3.6, 3.6, 4.4][j], 0.12, 1.3); a.baseRot = [0.5, 0.35, -0.35, -0.5][j]; a.root.rotation.y = a.baseRot; scene.add(a.root); actors.push(a); label(a, g.name, g.n != null ? String(g.n) : "", "small"); });
    // декор: настольный робот и хранитель
    var d = deskbot({ accent: 0x3ff0ff }); d.seed = 11; d.root.position.set(-1.35, 0.12, 1.15); d.root.rotation.y = 0.35; d.baseRot = 0.35; scene.add(d.root); actors.push(d);
    var gd = humanoid({ body: 0x3a4250, dark: 0x161a22, accent: 0xff9a3c, shield: true, visor: true }); gd.seed = 23; gd.root.scale.setScalar(0.8); gd.root.position.set(4.9, 0.12, -1.2); gd.baseRot = -0.6; gd.root.rotation.y = -0.6; gd.guard = true; scene.add(gd.root); actors.push(gd);
    // дроны = зарегистрированные агенты
    var reg = (data && data.registered_agents) || [];
    reg.forEach(function (ag, i) { var g = new T.Group(), c = new T.Color().setHSL((h32(ag.id || ag.name) % 360) / 360, 0.8, 0.6).getHex();
      g.add(sph(0.1, std(0xcfd8e6, 0.6, 0.3))); var ey = sph(0.04, glow(c), 8, 6); ey.position.z = 0.09; g.add(ey); var rr = new T.Mesh(new T.TorusGeometry(0.17, 0.012, 6, 24), glow(c)); rr.rotation.x = Math.PI / 2; g.add(rr);
      var dr = { root: g, seed: h32(ag.id || ag.name) % 1000, i: i, ring: rr }; g.position.set(-4.8 + i * 0.5, 2.2, 1.5); scene.add(g); drones.push(dr); label(dr, ag.name, ag.model || "", "small drone"); });
    if (reg.length) { var cnt = el("div", "oh3d-count"); cnt.textContent = reg.length + " · " + TX.reg; labels.appendChild(cnt); }
  }

  // ---------- оживление ----------
  function animate(t) {
    actors.forEach(function (a) {
      var s = a.seed || 0, tt = reduce ? 0 : t;
      // моргание: короткое схлопывание глаз раз в несколько секунд
      var bl = ((tt + s * 0.37) % (3.2 + (s % 7) * 0.3)) < 0.12 ? 0.12 : 1; a.eyes.forEach(function (e) { e.scale.y = bl; });
      if (a.kind === "crawler") {
        var crouch = Math.sin(tt * 0.9 + s) * 0.5 + 0.5; a.hub.position.y = 1.15 - crouch * 0.22; a.root.rotation.y = a.baseRot + noise(tt * 0.35, s) * 0.45;
        a.legs.forEach(function (L) { L.up.rotation.z = 0.9 + crouch * 0.25 + Math.sin(tt * 2.2 + L.ph) * 0.06; L.lo.rotation.z = -2.1 - crouch * 0.3; });
        a.lantern.rotation.z = Math.sin(tt * 1.4 + s) * 0.12; a.lens.scale.x = a.lens.scale.y = 1 + Math.sin(tt * 3 + s) * 0.08 * bl;
      } else if (a.kind === "desk") {
        a.head.rotation.z = Math.sin(tt * 1.1) * 0.12; a.head.position.y = 0.32 + Math.abs(Math.sin(tt * 2.2)) * 0.05; a.root.rotation.y = a.baseRot + Math.sin(tt * 0.5) * 0.3;
      } else {
        var br = Math.sin(tt * 1.6 + s) * 0.015; a.torso.scale.y = 1 + br; a.hip.position.y = 1.05 + br;
        a.head.rotation.y = noise(tt * 0.4, s) * 0.5; a.head.rotation.x = noise(tt * 0.3, s + 5) * 0.12;
        a.torso.rotation.y = noise(tt * 0.25, s + 9) * 0.18; a.root.rotation.y = a.baseRot + noise(tt * 0.15, s + 3) * 0.12;
        if (a.core) a.core.scale.setScalar(1 + Math.sin(tt * 2.4 + s) * 0.18);
        // приветствие: правая рука машет по своему циклу; книжник листает, хранитель поднимает щит
        var cyc = (tt + s * 0.13) % 9, wave = cyc < 2.6 ? Math.sin(cyc / 2.6 * Math.PI) : 0, R = a.arms[a.o.book || a.o.shield ? 0 : 1], L = a.arms[a.o.book || a.o.shield ? 1 : 0];
        R.sh.rotation.z = R.s * (0.12 + wave * 2.3); R.sh.rotation.x = -wave * 0.3; R.el.rotation.z = R.s * wave * (0.6 + Math.sin(tt * 9) * 0.35);
        if (a.o.book) { L.sh.rotation.x = -0.35 + Math.sin(tt * 0.8 + s) * 0.05; L.sh.rotation.z = L.s * 0.18; L.el.rotation.x = -1.25; }
        else if (a.o.shield) { L.sh.rotation.x = -0.6 - (Math.sin(tt * 0.6 + s) * 0.5 + 0.5) * 0.5; L.el.rotation.x = -1.0; }
        else { L.sh.rotation.x = Math.sin(tt * 1.6 + s) * 0.08; L.sh.rotation.z = L.s * 0.12; }
        a.legs.forEach(function (lg, k) { lg.th.rotation.x = Math.sin(tt * 0.8 + s + k) * 0.03; });
      }
    });
    drones.forEach(function (d) { var s = d.seed, tt = reduce ? 0 : t; d.root.position.set(-4.6 + d.i * 0.62 + noise(tt * 0.4, s) * 0.5, 2.3 + noise(tt * 0.6, s + 4) * 0.35 + d.i % 2 * 0.3, 1.4 + noise(tt * 0.3, s + 8) * 0.4); d.ring.rotation.z = tt * 3; });
    if (laurel) { laurel.rotation.y = reduce ? 0 : t * 0.6; laurel.position.y = 4.15 + Math.sin(t * 1.2) * 0.06; }
    if (confetti && !reduce) { var p = confetti.geometry.attributes.position; for (var i = 1; i < p.array.length; i += 3) { p.array[i] -= 0.012 + (i % 5) * 0.002; p.array[i - 1] += Math.sin(t + i) * 0.003; if (p.array[i] < 0) p.array[i] = 8; } p.needsUpdate = true; }
  }
  var v3 = null;
  function placeLabels() {
    if (!v3) v3 = new T.Vector3(); var W = box.clientWidth, H = box.clientHeight;
    actors.concat(drones).forEach(function (a) { if (!a.label) return; a.root.updateMatrixWorld(); v3.set(0, a.kind === "crawler" ? -0.15 : a.drone || a.ring ? -0.3 : -0.05, 0).applyMatrix4(a.root.matrixWorld); if (a.ring) v3.y += 0.0; v3.project(cam);
      var x = (v3.x * 0.5 + 0.5) * W, y = (-v3.y * 0.5 + 0.5) * H; a.label.style.transform = "translate(" + x.toFixed(0) + "px," + (y + (a.ring ? -34 : 6)).toFixed(0) + "px) translate(-50%,0)"; });
  }

  function css() {
    if (document.getElementById("oh3d-css")) return; var s = el("style"); s.id = "oh3d-css";
    s.textContent = ".oh3d-labels{position:absolute;inset:0;pointer-events:none;font-family:ui-monospace,SFMono-Regular,Menlo,monospace}.oh3d-l{position:absolute;left:0;top:0;display:flex;flex-direction:column;align-items:center;gap:1px;padding:4px 9px;border-radius:8px;background:rgba(3,10,20,.72);border:1px solid rgba(111,230,255,.45);color:#dff6ff;font-size:11.5px;white-space:nowrap;box-shadow:0 0 12px rgba(80,190,255,.25)}.oh3d-l b{font-weight:600}.oh3d-l span{font-size:10px;color:#8fb0cc}.oh3d-l.gold{border-color:#ffc35a;box-shadow:0 0 16px rgba(255,180,80,.45);font-size:13px}.oh3d-l.small{font-size:10px;padding:2px 7px}.oh3d-l.drone{opacity:.85}.oh3d-count{position:absolute;left:12px;bottom:10px;font-size:10.5px;color:#8fb0cc;letter-spacing:.06em}.oh3d-wait{position:absolute;left:50%;top:45%;transform:translate(-50%,-50%);color:#7fe9ff;font:13px ui-monospace,monospace;letter-spacing:.12em}";
    document.head.appendChild(s);
  }
  function resize() { if (!ren) return; var w = box.clientWidth || 600, h = box.clientHeight || 400; ren.setSize(w, h, false); ren.domElement.style.width = "100%"; ren.domElement.style.height = "100%"; cam.aspect = w / h; cam.fov = w / h < 1 ? 62 : 42; cam.updateProjectionMatrix(); }
  function init(e) {
    if (!window.THREE || !ok()) return false; T = window.THREE; box = e; css();
    ren = new T.WebGLRenderer({ antialias: true, powerPreference: "high-performance" }); ren.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); ren.setClearColor(0x03040b, 1);
    if ("outputEncoding" in ren) ren.outputEncoding = T.sRGBEncoding;
    box.appendChild(ren.domElement); ren.domElement.style.touchAction = "pan-y";
    labels = el("div", "oh3d-labels"); box.appendChild(labels); labels.appendChild(el("div", "oh3d-wait", TX.wait));
    scene = new T.Scene(); scene.fog = new T.FogExp2(0x03040b, 0.035);
    cam = new T.PerspectiveCamera(42, 1.6, 0.1, 120); stage(); buildConfetti(); resize(); new ResizeObserver(resize).observe(box);
    if ("IntersectionObserver" in window) new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) loop(); }, { threshold: 0.05 }).observe(box);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) loop(); });
    box.addEventListener("pointermove", function (ev) { var r = box.getBoundingClientRect(); box._px = (ev.clientX - r.left) / r.width - 0.5; box._py = (ev.clientY - r.top) / r.height - 0.5; });
    t0 = performance.now(); loop(); return true;
  }
  function update(d) { data = d && typeof d === "object" ? d : null; if (!data) return; world = data.world_top10 || []; buildBoard(); if (data.agent_of_the_month) buildLaurel(); buildActors(); }
  function loop() {
    if (raf || !ren) return;
    var tick = function (now) { raf = 0; if (!visible || document.hidden) return; var t = (now - t0) / 1000;
      var px = box._px || 0, py = box._py || 0, sway = reduce ? 0 : Math.sin(t * 0.12) * 0.18, narrow = cam.aspect < 1;
      var a = sway + px * 0.25, R = narrow ? 11.5 : 9.2, y = (narrow ? 2.4 : 1.7) - py * 0.6;
      cam.position.set(Math.sin(a) * R, y, Math.cos(a) * R); cam.lookAt(0, narrow ? 2.0 : 1.75, 0);
      animate(t); ren.render(scene, cam); placeLabels(); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
  }
  function stats() { var i = ren ? ren.info.render : {}; return { triangles: i.triangles, calls: i.calls, heroes: actors.filter(function (a) { return a.rank && a.rank <= 3; }).map(function (a) { return a.kind; }), actors: actors.length, drones: drones.length, bars: world ? world.length : 0 }; }
  window.OrbHall3D = { init: init, update: update, stats: stats };
})();
