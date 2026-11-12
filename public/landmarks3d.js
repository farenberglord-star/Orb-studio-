/* Orb Studio · достопримечательность смены: каждые 3 часа в центре голограммы появляется новое здание.
   Какое — решают данные: категория по самому высокому радару, конкретное здание — по номеру смены.
   Свет окон = индекс этого радара, цвет = цвет радара, высота = общее напряжение. Здания построены кодом, без моделей и фото. */
(function () {
  "use strict";
  var T;
  function V(x, y, z) { return new T.Vector3(x, y, z); }
  // линии собираем в один буфер — так быстро и в стиле голограммы
  function Lines() { this.p = []; }
  Lines.prototype.seg = function (a, b) { this.p.push(a, b); return this; };
  Lines.prototype.poly = function (pts, closed) { for (var i = 0; i < pts.length - 1; i++) this.seg(pts[i], pts[i + 1]); if (closed) this.seg(pts[pts.length - 1], pts[0]); return this; };
  Lines.prototype.ring = function (cx, y, cz, rx, rz, n, rot) { var a = []; for (var i = 0; i < n; i++) { var t = (rot || 0) + i / n * Math.PI * 2; a.push(V(cx + Math.cos(t) * rx, y, cz + Math.sin(t) * rz)); } return this.poly(a, true); };
  Lines.prototype.box = function (x, y, z, w, h, d) { var g = new T.EdgesGeometry(new T.BoxGeometry(w, h, d)), a = g.attributes.position.array; for (var i = 0; i < a.length; i += 6) this.seg(V(a[i] + x, a[i + 1] + y + h / 2, a[i + 2] + z), V(a[i + 3] + x, a[i + 4] + y + h / 2, a[i + 5] + z)); g.dispose(); return this; };
  Lines.prototype.mesh = function (color, op) { return new T.LineSegments(new T.BufferGeometry().setFromPoints(this.p), new T.LineBasicMaterial({ color: color, transparent: true, opacity: op || 0.9, blending: T.AdditiveBlending, depthWrite: false })); };

  // окна-точки на фасаде: горит доля lit
  function dots(g, rnd, lit, color, faces) {
    var pos = [];
    faces.forEach(function (f) { for (var r = 0; r < f.rows; r++) for (var c = 0; c < f.cols; c++) if (rnd() < lit) {
      var u = (c + 0.5) / f.cols - 0.5, v = (r + 0.5) / f.rows;
      pos.push(f.o.x + f.u.x * u + f.v.x * v, f.o.y + f.u.y * u + f.v.y * v, f.o.z + f.u.z * u + f.v.z * v); } });
    var bg = new T.BufferGeometry(); bg.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.add(new T.Points(bg, new T.PointsMaterial({ color: color, size: 0.09, transparent: true, opacity: 0.95, blending: T.AdditiveBlending, depthWrite: false })));
  }
  function face(o, u, v, cols, rows) { return { o: o, u: u, v: v, cols: cols, rows: rows }; }

  var B = {};
  // Эйфелева башня, Париж: изогнутые опоры, три уровня, арки
  B.eiffel = function (g, ctx) {
    var L = new Lines(), H = 8.6 * ctx.k, w = function (y) { return 0.18 + 2.1 * Math.exp(-y / (H * 0.2)); }, N = 40, prev = null;
    for (var i = 0; i <= N; i++) { var y = i / N * H, s = w(y), cur = [V(-s, y, -s), V(s, y, -s), V(s, y, s), V(-s, y, s)];
      if (prev) for (var c = 0; c < 4; c++) { L.seg(prev[c], cur[c]); if (i % 2 === 0) { L.seg(prev[c], cur[(c + 1) % 4]); L.seg(prev[(c + 1) % 4], cur[c]); } }
      if (i % 5 === 0) L.poly(cur, true); prev = cur; }
    [0.13, 0.42].forEach(function (f) { var y = f * H, s = w(y) + 0.25; L.poly([V(-s, y, -s), V(s, y, -s), V(s, y, s), V(-s, y, s)], true); });
    for (var a = 0; a < 4; a++) { var pts = [], ang = a * Math.PI / 2; for (var j = 0; j <= 16; j++) { var t = j / 16 * Math.PI, s0 = w(0) * 0.62; pts.push(V(Math.cos(ang) * (s0 * Math.cos(t)) + Math.sin(ang) * w(0) * 0.0, Math.sin(t) * H * 0.09, 0).applyAxisAngle(V(0, 1, 0), ang).add(V(Math.sin(ang) * w(0) * 0.92, 0, Math.cos(ang) * w(0) * 0.92))); } L.poly(pts); }
    L.seg(V(0, H, 0), V(0, H + 0.7 * ctx.k, 0));
    g.add(L.mesh(ctx.col, 0.85));
    var lights = []; for (var q = 0; q < 140; q++) if (ctx.rnd() < ctx.lit) { var yy = ctx.rnd() * H * 0.95, ss = w(yy), sd = Math.floor(ctx.rnd() * 4), tt = ctx.rnd() * 2 - 1;
      lights.push(sd < 2 ? (sd ? ss : -ss) : tt * ss, yy, sd < 2 ? tt * ss : (sd === 2 ? ss : -ss)); }
    var bg = new T.BufferGeometry(); bg.setAttribute("position", new T.Float32BufferAttribute(lights, 3));
    g.add(new T.Points(bg, new T.PointsMaterial({ color: 0xfff1c0, size: 0.08, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false })));
    return H + 0.7;
  };
  // Эльбская филармония, Гамбург: кирпичный склад + стеклянная «волна» с пиками
  B.elbphilharmonie = function (g, ctx) {
    var L = new Lines(), k = ctx.k, W = 6.4, D = 2.3, h1 = 2.4 * k, h2 = 2.6 * k, peaks = [1.25, 0.6, 1.0, 0.45, 0.85];
    L.box(0, 0, 0, W, h1, D);
    for (var f = 1; f < 8; f++) L.seg(V(-W / 2, f * h1 / 8, D / 2), V(W / 2, f * h1 / 8, D / 2));
    var G = new Lines(); G.box(0, h1, 0, W, h2, D);
    for (var f2 = 1; f2 < 9; f2++) G.seg(V(-W / 2, h1 + f2 * h2 / 9, D / 2), V(W / 2, h1 + f2 * h2 / 9, D / 2));
    var roof = function (x) { var t = (x + W / 2) / W * (peaks.length - 1), i = Math.min(peaks.length - 2, Math.floor(t)), fr = t - i; return h1 + h2 + (peaks[i] * (1 - fr) + peaks[i + 1] * fr) * k * Math.sin(Math.PI * (fr * 0.5 + 0.25)) ; };
    for (var zi = 0; zi <= 4; zi++) { var z = -D / 2 + zi / 4 * D, pts = []; for (var xi = 0; xi <= 40; xi++) { var x = -W / 2 + xi / 40 * W; pts.push(V(x, roof(x), z)); } G.poly(pts); }
    for (var xj = 0; xj <= 12; xj++) { var x2 = -W / 2 + xj / 12 * W; G.seg(V(x2, h1 + h2, -D / 2), V(x2, roof(x2), -D / 2)).seg(V(x2, roof(x2), -D / 2), V(x2, roof(x2), D / 2)).seg(V(x2, h1 + h2, D / 2), V(x2, roof(x2), D / 2)); }
    g.add(L.mesh(new T.Color(0xff8a5c), 0.75), G.mesh(ctx.col, 0.9));
    dots(g, ctx.rnd, ctx.lit, ctx.col, [face(V(0, h1 + 0.1, D / 2 + 0.01), V(W, 0, 0), V(0, h2 - 0.2, 0), 30, 9), face(V(0, 0.1, D / 2 + 0.01), V(W, 0, 0), V(0, h1 - 0.2, 0), 26, 7)]);
    return h1 + h2 + 1.3 * k;
  };
  // Рейхстаг (Бундестаг), Берлин: корпус, угловые башни, портик, стеклянный купол со спиральным пандусом
  B.reichstag = function (g, ctx) {
    var L = new Lines(), k = ctx.k, W = 6.6, D = 4, H = 2.2 * k;
    L.box(0, 0, 0, W, H, D);
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (c) { L.box(c[0] * (W / 2 - 0.55), 0, c[1] * (D / 2 - 0.55), 1.1, H * 1.25, 1.1); });
    for (var i = 0; i < 6; i++) { var x = -1.25 + i * 0.5; L.seg(V(x, 0.2, D / 2 + 0.5), V(x, H * 0.92, D / 2 + 0.5)); }
    L.poly([V(-1.5, H * 0.92, D / 2 + 0.5), V(0, H * 1.2, D / 2 + 0.5), V(1.5, H * 0.92, D / 2 + 0.5)], true);
    var C = new Lines(), R = 1.35 * k, y0 = H;
    for (var m = 0; m < 16; m++) { var a = m / 16 * Math.PI * 2, pts = []; for (var j = 0; j <= 10; j++) { var t = j / 10 * Math.PI / 2; pts.push(V(Math.cos(a) * Math.cos(t) * R, y0 + Math.sin(t) * R, Math.sin(a) * Math.cos(t) * R)); } C.poly(pts); }
    for (var r = 1; r < 6; r++) { var tt = r / 6 * Math.PI / 2; C.ring(0, y0 + Math.sin(tt) * R, 0, Math.cos(tt) * R, Math.cos(tt) * R, 32); }
    var hel = []; for (var s = 0; s <= 120; s++) { var u = s / 120, ang = u * Math.PI * 4, rr = R * 0.9 * Math.cos(u * Math.PI / 2.3); hel.push(V(Math.cos(ang) * rr, y0 + u * R * 0.85, Math.sin(ang) * rr)); } C.poly(hel);
    C.seg(V(0, y0, 0), V(0, y0 + R * 0.75, 0));
    g.add(L.mesh(new T.Color(0xd8e2f0), 0.7), C.mesh(ctx.col, 0.95));
    dots(g, ctx.rnd, ctx.lit, 0xfff1c0, [face(V(0, 0.2, D / 2 + 0.01), V(W - 2.4, 0, 0), V(0, H - 0.4, 0), 18, 4)]);
    return y0 + R + 0.4;
  };
  // Спасская башня, Москва: ярусы, шатёр, звезда, часы, стена с «ласточкиными хвостами»
  B.spasskaya = function (g, ctx) {
    var L = new Lines(), k = ctx.k, y = 0, tiers = [[1.8, 2.6], [1.5, 0.9], [1.25, 0.8], [1.05, 0.7]];
    tiers.forEach(function (t, i) { var h = t[1] * k; if (i < 2) L.box(0, y, 0, t[0], h, t[0]); else { L.ring(0, y, 0, t[0] * 0.6, t[0] * 0.6, 8, Math.PI / 8).ring(0, y + h, 0, t[0] * 0.6, t[0] * 0.6, 8, Math.PI / 8); for (var e = 0; e < 8; e++) { var a = Math.PI / 8 + e / 8 * Math.PI * 2; L.seg(V(Math.cos(a) * t[0] * 0.6, y, Math.sin(a) * t[0] * 0.6), V(Math.cos(a) * t[0] * 0.6, y + h, Math.sin(a) * t[0] * 0.6)); } } y += h; });
    var tip = y + 2.4 * k; for (var e2 = 0; e2 < 8; e2++) { var a2 = Math.PI / 8 + e2 / 8 * Math.PI * 2; L.seg(V(Math.cos(a2) * 0.6, y, Math.sin(a2) * 0.6), V(0, tip, 0)); }
    var cy = 2.6 * k + 0.45; L.ring(0, 0, 0, 0, 0, 3); var ck = []; for (var q = 0; q <= 32; q++) { var aa = q / 32 * Math.PI * 2; ck.push(V(Math.cos(aa) * 0.42, cy + Math.sin(aa) * 0.42, 0.91)); } L.poly(ck);
    L.seg(V(0, cy, 0.91), V(0.25, cy + 0.15, 0.91)).seg(V(0, cy, 0.91), V(0, cy + 0.32, 0.91));
    [-1, 1].forEach(function (sd) { var x0 = sd * 0.9, x1 = sd * 4.2, hw = 1.4 * k; L.box((x0 + x1) / 2, 0, 0, Math.abs(x1 - x0), hw, 0.6); for (var mi = 0; mi < 8; mi++) { var mx = x0 + (x1 - x0) * (mi + 0.5) / 8; L.poly([V(mx - 0.15, hw, 0.3), V(mx - 0.15, hw + 0.3, 0.3), V(mx, hw + 0.2, 0.3), V(mx + 0.15, hw + 0.3, 0.3), V(mx + 0.15, hw, 0.3)]); } });
    g.add(L.mesh(ctx.col, 0.9));
    var S = new Lines(), sr = 0.32, st = []; for (var p = 0; p < 10; p++) { var ra = p % 2 ? sr * 0.45 : sr, an = Math.PI / 2 + p / 10 * Math.PI * 2; st.push(V(Math.cos(an) * ra, tip + 0.35 + Math.sin(an) * ra, 0)); } S.poly(st, true);
    g.add(S.mesh(new T.Color(0xff4d5e), 1));
    dots(g, ctx.rnd, ctx.lit, 0xfff1c0, [face(V(0, 0.15, 0.91), V(1.5, 0, 0), V(0, 1.6 * k, 0), 4, 5)]);
    return tip + 0.8;
  };

  // каталог: категория по самому высокому радару, здание — по номеру смены (каждые 3 часа другое)
  var CATALOG = {
    geo: ["spasskaya", "eiffel", "reichstag"],
    politics: ["reichstag", "spasskaya", "eiffel"],
    economy: ["elbphilharmonie", "eiffel", "reichstag"],
    budget: ["elbphilharmonie", "reichstag", "eiffel"],
    crypto: ["eiffel", "elbphilharmonie", "spasskaya"],
    energy: ["eiffel", "spasskaya", "elbphilharmonie"],
    web: ["eiffel", "elbphilharmonie", "reichstag"],
  };
  function pick(card) {
    var rs = (card.inputs && card.inputs.radars) || [], top = rs.slice().sort(function (a, b) { return b.risk_index - a.risk_index; })[0] || { id: "geo", risk_index: 50 };
    var list = CATALOG[top.id] || CATALOG.geo, n = Math.floor(Date.parse((card.slot || "").replace("Z", ":00Z")) / 108e5) || 0;
    var q = new URLSearchParams(location.search).get("landmark");
    return { id: q && B[q] ? q : list[n % list.length], radar: top };
  }
  window.OrbLandmarks = {
    list: Object.keys(B),
    add: function (THREE, parent, card, rnd, hue) {
      T = THREE; var p = pick(card), g = new T.Group();
      var k = 0.85 + ((card.state && card.state.tension) || 50) / 250;
      var col = new T.Color().setHSL(hue(p.radar.id) / 360, 0.85, 0.62);
      var h = B[p.id](g, { k: k, lit: p.radar.risk_index / 100, col: col, rnd: rnd });
      parent.add(g); return { group: g, id: p.id, height: h };
    },
  };
})();
