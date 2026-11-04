// Художник Orb Studio: рисует картину по числам из /api/v1/canvas (поле render + palette).
// Одни и те же числа и seed → одна и та же картина (своя таблица случайных чисел, без Math.random).
(function () {
  function rng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  // гладкий шум для потока мазков
  function noise(seed) {
    var r = rng(seed ^ 0x9e3779b9), p = new Uint8Array(512), i, j, t;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { j = Math.floor(r() * (i + 1)); t = p[i]; p[i] = p[j]; p[j] = t; }
    for (i = 0; i < 256; i++) p[i + 256] = p[i];
    var g = function (h, x, y) { var a = (h & 7) * Math.PI / 4; return Math.cos(a) * x + Math.sin(a) * y; };
    var f = function (t) { return t * t * t * (t * (t * 6 - 15) + 10); };
    return function (x, y) {
      var X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y);
      var u = f(x), v = f(y), aa = p[p[X] + Y], ab = p[p[X] + Y + 1], ba = p[p[X + 1] + Y], bb = p[p[X + 1] + Y + 1];
      var l1 = g(aa, x, y) + u * (g(ba, x - 1, y) - g(aa, x, y)), l2 = g(ab, x, y - 1) + u * (g(bb, x - 1, y - 1) - g(ab, x, y - 1));
      return l1 + v * (l2 - l1);
    };
  }
  function hsl(h, s, l, a) { return "hsla(" + Math.round(h) + "," + Math.round(s) + "%," + Math.round(l) + "%," + a + ")"; }

  window.orbCanvasDraw = function (cv, card) {
    var R = card.render, st = card.state, pal = card.palette, W = cv.width, H = cv.height, c = cv.getContext("2d");
    var rnd = rng(R.seed), nz = noise(R.seed), sat = R.saturation, calm = R.style === "calm" || R.style === "impression";
    var tu = st.turbulence / 100, fr = st.fracture / 100, it = st.intensity / 100, ten = st.tension / 100;
    var pick = function () { var x = rnd(), s = 0; for (var i = 0; i < pal.length; i++) { s += pal[i].weight; if (x <= s) return pal[i]; } return pal[0]; };
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalCompositeOperation = "source-over"; c.globalAlpha = 1;

    // 1. фон: главный цвет → цвет-акцент, темнее при высоком напряжении
    var bg = c.createLinearGradient(0, 0, W * (0.3 + rnd() * 0.4), H);
    bg.addColorStop(0, hsl(R.main.hue, sat * 0.55, 9 - ten * 4, 1));
    bg.addColorStop(0.55, hsl((R.main.hue + R.accent.hue) / 2, sat * 0.35, 5, 1));
    bg.addColorStop(1, hsl(R.accent.hue, sat * 0.5, 7 - ten * 3, 1));
    c.fillStyle = bg; c.fillRect(0, 0, W, H);

    // 2. разброс радаров: мягкие пятна (спокойно) или острые осколки (напряжённо)
    c.globalCompositeOperation = "lighter";
    for (var k = 0; k < R.shards; k++) {
      var p = pick(), x = rnd() * W, y = rnd() * H, r = (0.18 + rnd() * 0.32) * Math.min(W, H) * (calm ? 1.1 : 0.8);
      if (calm) {
        var g = c.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, hsl(p.hue, sat, 55, 0.20 + p.weight * 0.5)); g.addColorStop(1, hsl(p.hue, sat, 40, 0));
        c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
      } else {
        var n = 3 + Math.floor(rnd() * 3), a0 = rnd() * Math.PI * 2;
        c.beginPath();
        for (var q = 0; q < n; q++) { var a = a0 + q * (Math.PI * 2 / n) + (rnd() - 0.5) * 0.9, rr = r * (0.5 + rnd() * 0.7); c[q ? "lineTo" : "moveTo"](x + Math.cos(a) * rr, y + Math.sin(a) * rr); }
        c.closePath(); c.fillStyle = hsl(p.hue, sat, 45 + fr * 10, 0.07 + p.weight * 0.35); c.fill();
        c.strokeStyle = hsl(p.hue, sat, 70, 0.10 + fr * 0.15); c.lineWidth = 1 + fr * 1.5; c.stroke();
      }
    }

    // 3. поток мазков: число и кривизна растут с турбулентностью (обычное наложение, чтобы мазки не сливались в белые жгуты)
    c.globalCompositeOperation = "source-over";
    var scale = (calm ? 1.4 : 2.2 + tu * 3) / Math.min(W, H), curl = 1 + tu * 2.5, count = Math.round((700 + tu * 2300) * (W * H) / (1080 * 1350));
    var steps = calm ? 26 : 18 + Math.round(tu * 30), stepLen = Math.min(W, H) * (calm ? 0.006 : 0.005 + tu * 0.004);
    c.lineCap = "round";
    for (var s = 0; s < count; s++) {
      var pp = pick(), px = rnd() * W, py = rnd() * H, lw = (calm ? 1.2 : 0.6) + rnd() * (calm ? 3.2 : 1.6 + tu * 1.4);
      c.strokeStyle = hsl(pp.hue + (rnd() - 0.5) * 18, sat + 10, 46 + rnd() * 20 + it * 6, (calm ? 0.10 : 0.12) + rnd() * (0.18 + tu * 0.12));
      c.lineWidth = lw; c.beginPath(); c.moveTo(px, py);
      for (var z = 0; z < steps; z++) {
        var ang = nz(px * scale, py * scale) * Math.PI * 2 * curl + (calm ? 0 : (rnd() - 0.5) * tu * 0.9);
        px += Math.cos(ang) * stepLen; py += Math.sin(ang) * stepLen; c.lineTo(px, py);
        if (px < -20 || py < -20 || px > W + 20 || py > H + 20) break;
      }
      c.stroke();
    }

    // 4. всплески волатильности: резкие светлые линии через весь холст
    c.globalCompositeOperation = "lighter";
    for (var l = 0; l < R.lines; l++) {
      var ax = rnd() * W, ay = -H * 0.05, ang2 = Math.PI * (0.32 + rnd() * 0.36), len = Math.hypot(W, H) * 1.2;
      var ln = c.createLinearGradient(ax, ay, ax + Math.cos(ang2) * len, ay + Math.sin(ang2) * len);
      ln.addColorStop(0, hsl(R.accent.hue, sat, 85, 0)); ln.addColorStop(0.45, hsl(R.accent.hue, sat, 82, 0.75)); ln.addColorStop(1, hsl(R.accent.hue, sat, 85, 0));
      c.strokeStyle = ln; c.lineWidth = 1.2 + rnd() * 2.2; c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax + Math.cos(ang2) * len, ay + Math.sin(ang2) * len); c.stroke();
    }

    // 5. внимание в Википедии: светящееся пятно
    if (R.glow) {
      var gx = W * (0.25 + rnd() * 0.5), gy = H * (0.22 + rnd() * 0.5), gr = Math.min(W, H) * (0.08 + R.glow.size / 100 * 0.22);
      var gg = c.createRadialGradient(gx, gy, 0, gx, gy, gr);
      gg.addColorStop(0, "rgba(255,255,255,.85)"); gg.addColorStop(0.18, hsl(R.accent.hue, sat, 75, 0.55)); gg.addColorStop(1, hsl(R.accent.hue, sat, 50, 0));
      c.fillStyle = gg; c.beginPath(); c.arc(gx, gy, gr, 0, Math.PI * 2); c.fill();
    }

    // 6. зерно и виньетка
    c.globalCompositeOperation = "source-over";
    var gn = Math.round(W * H / 900);
    for (var d = 0; d < gn; d++) { c.fillStyle = "rgba(255,255,255," + (rnd() * 0.05).toFixed(3) + ")"; c.fillRect(rnd() * W, rnd() * H, 1.2, 1.2); }
    var vg = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.hypot(W, H) * 0.62);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0," + (0.35 + ten * 0.25) + ")");
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
  };
})();
