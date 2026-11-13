/* OrbMusic3D - music player hologram for orbstudio.org/music (preview build, not deployed).
   three.js r128 (cdnjs) only, no examples/. Own glow (point-sprite shader). No random calls:
   every phase comes from a hash of the track id. Text: none (HTML overlay lives in musicplayer.js).
   window.OrbMusic3D = { init(el) -> bool, setTrack(track|null), setState("playing"|"paused"|"idle"),
                         sync(seconds) [optional, beat phase from player time], stats(), destroy() } */
(function () {
  "use strict";

  /* ================= EXTENDABLE DICTIONARIES ================= */
  // Scene elements, matched at word start (case-insensitive) in title + style + topics.
  // "=word" means whole word only. Add words freely; element names are fixed.
  var KEYWORDS = {
    sonar:     ["sonar", "radar", "ping", "sensor", "сонар", "радар", "датчик"],
    tanker:    ["tanker", "oil", "brent", "hormuz", "hormus", "petrol", "fuel", "crude", "танкер", "нефт", "ормуз", "öl", "tank"],
    crypto:    ["bitcoin", "crypto", "=btc", "blockchain", "binance", "kraken", "mempool", "hashrate", "wallet", "биткоин", "крипт", "krypto"],
    morse:     ["morse", "морзе"],
    grid:      ["power", "energy", "electric", "grid", "strom", "energie", "энерг", "электр"],
    vessels:   ["sanction", "ship", "fleet", "vessel", "санкци", "судн", "флот", "schiff", "sanktion"],
    voice:     ["vocoder", "spoken", "vocal", "voice", "вокодер", "голос", "stimme"],
    redzone:   ["war", "attack", "missile", "fire", "burn", "drone", "conflict", "strike", "войн", "пожар", "атак", "krieg", "angriff"],
    network:   ["internet", "web", "cable", "outage", "=ai", "network", "интернет", "кабел", "kabel", "netz"],
    satellite: ["satellite", "orbit", "спутник", "satellit"]
  };
  // Mood words -> palette / motion. p primary, s secondary, a accent, w warm flash.
  var MOODS = {
    cold:     { p: [0.22, 0.95, 0.88], s: [0.22, 0.5, 1.0] },
    tense:    { a: [1.0, 0.16, 0.22], red: 1 },
    dark:     { dim: 0.92 },
    driving:  { speed: 1.3 },
    building: { speed: 1.15 },
    euphoric: { w: [1.0, 0.7, 0.28], burst: 1 },
    hypnotic: { s: [0.55, 0.32, 1.0], spiral: 1, speed: 0.8 },
    calm:     { speed: 0.7 }
  };
  var STYLE_TINT = { synthwave: [1.0, 0.28, 0.82], industrial: [0.62, 0.85, 1.0], melodic: [0.45, 0.75, 1.0], cinematic: [0.4, 0.6, 1.0] };
  var RADAR_HUE = { geo: 352, politics: 318, economy: 212, budget: 146, crypto: 268, energy: 36, justice: 28, web: 186 };
  var DEFAULT_BPM = 120;

  var T = null, ren, scene, cam, el0, cv, pts, bg, geo, U = {}, raf = 0, io = null, ro = null, onScreen = true;
  var N = 12000, A = {}, B = {}, cur = { id: null, seed: 0.5, bpm: DEFAULT_BPM, els: [], camAz: 0, camEl: 0.3 };
  var vOff = 0, state = "idle", beatPh = 0, tAnim = 0, lastNow = null, mixT = 1, mixDur = 2.6, dimNow = 0.55, sinceSync = 99, syncTarget = null;
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var listeners = [];
  function on(t, e, f, o) { t.addEventListener(e, f, o); listeners.push([t, e, f, o]); }

  /* ================= hashing / deterministic PRNG ================= */
  function hashStr(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return h >>> 0; }
  function prng(seed) { var a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hsl(h, s, l) { var c = new (T.Color)(); c.setHSL(h / 360, s, l); return [c.r, c.g, c.b]; }
  function mixc(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function sc(a, k) { return [a[0] * k, a[1] * k, a[2] * k]; }

  function matchWord(text, kw) {
    var whole = kw.charAt(0) === "="; if (whole) kw = kw.slice(1);
    var i = -1;
    while ((i = text.indexOf(kw, i + 1)) >= 0) {
      var pre = i === 0 ? " " : text.charAt(i - 1), post = text.charAt(i + kw.length) || " ";
      var wb = function (ch) { return !/[a-z0-9а-яёäöüß]/.test(ch); };
      if (wb(pre) && (!whole || wb(post))) return true;
    }
    return false;
  }
  function analyse(tr) {
    var text = [tr.title, tr.style].concat(Array.isArray(tr.topics) ? tr.topics : []).filter(function (x) { return typeof x === "string"; }).join(" | ").toLowerCase();
    var els = [];
    Object.keys(KEYWORDS).forEach(function (k) { for (var i = 0; i < KEYWORDS[k].length; i++) if (matchWord(text, KEYWORDS[k][i])) { els.push(k); break; } });
    var mood = (typeof tr.mood === "string" ? tr.mood : "").toLowerCase(), style = (typeof tr.style === "string" ? tr.style : "").toLowerCase();
    var pal = { p: [0.3, 0.9, 0.85], s: [0.3, 0.55, 1.0], a: [1.0, 0.55, 0.25], w: [1.0, 0.8, 0.45], red: 0, burst: 0, spiral: 0, speed: 1, dim: 1, moods: [] };
    Object.keys(MOODS).forEach(function (m) { if (matchWord(mood, m)) { var o = MOODS[m]; pal.moods.push(m); for (var k in o) { if (k === "speed" || k === "dim") pal[k] *= o[k]; else pal[k] = o[k]; } } });
    Object.keys(STYLE_TINT).forEach(function (s) { if (style.indexOf(s) >= 0) { pal.s = mixc(pal.s, STYLE_TINT[s], 0.75); pal.moods.push("style:" + s); } });
    if (pal.spiral) els.push("spiral"); if (pal.burst) els.push("burst");
    var radars = (Array.isArray(tr.radars) ? tr.radars : []).filter(function (r) { return RADAR_HUE.hasOwnProperty(r); });
    return { els: els, pal: pal, radars: radars };
  }

  /* ================= particle builders (CPU, deterministic) ================= */
  // kinds: 0 core 1 orbit 2 sonar 3 sea 4 ship/scanner 5 coin 6 chain 7 morse 8 grid 9 voice 10 redzone 11 dust 12 spiral 13 burst 14 network 15 satellite
  var CY = 0.25;
  function Builder(dst, n) { this.d = dst; this.i = 0; this.n = n; }
  Builder.prototype.push = function (x, y, z, c, s, k, a0, a1, a2, a3) {
    if (this.i >= this.n) return false; var i = this.i++, d = this.d;
    d.pos[i * 3] = x; d.pos[i * 3 + 1] = y; d.pos[i * 3 + 2] = z; d.col[i * 3] = c[0]; d.col[i * 3 + 1] = c[1]; d.col[i * 3 + 2] = c[2];
    d.sk[i * 2] = s; d.sk[i * 2 + 1] = k; d.aux[i * 4] = a0 || 0; d.aux[i * 4 + 1] = a1 || 0; d.aux[i * 4 + 2] = a2 || 0; d.aux[i * 4 + 3] = a3 || 0; return true;
  };
  function poly(b, pts, cnt, fn) { // sample a polyline evenly
    var L = 0, seg = []; for (var i = 1; i < pts.length; i++) { var l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], (pts[i][2] || 0) - (pts[i - 1][2] || 0)); seg.push(l); L += l; }
    for (var j = 0; j < cnt; j++) { var u = (j + 0.5) / cnt * L, s = 0; while (s < seg.length - 1 && u > seg[s]) { u -= seg[s]; s++; } var t = seg[s] ? u / seg[s] : 0, p = pts[s], q = pts[s + 1];
      fn(p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, (p[2] || 0) + ((q[2] || 0) - (p[2] || 0)) * t, j / cnt); }
  }
  var BUILD = {
    core: function (b, n, r, P, an) {
      var v = Math.floor(r() * 3), nuc = Math.floor(n * 0.2), sh = n - nuc, R = 0.85, hot = mixc(P.p, [1, 1, 1], 0.55);
      for (var i = 0; i < nuc; i++) { var u = r(), w = r() * 2 - 1, a = r() * 6.283, rr = 0.28 * Math.pow(u, 0.6), q = Math.sqrt(1 - w * w); b.push(Math.cos(a) * q * rr, w * rr, Math.sin(a) * q * rr, hot, 0.05 + 0.07 * (1 - u), 0); }
      if (v === 0) { for (var j = 0; j < sh; j++) { var y = 1 - 2 * (j + 0.5) / sh, q2 = Math.sqrt(1 - y * y), ph = j * 2.39996; b.push(Math.cos(ph) * q2 * R, y * R, Math.sin(ph) * q2 * R, mixc(P.p, P.s, 0.5 + 0.5 * y), 0.045, 0); } }
      else if (v === 1) { var lat = 9, mer = 12, per = Math.floor(sh / (lat + mer)); for (var l = 0; l < lat; l++) { var la = -1.2 + 2.4 * l / (lat - 1); for (var k = 0; k < per; k++) { var a2 = k / per * 6.283; b.push(Math.cos(a2) * Math.cos(la) * R, Math.sin(la) * R, Math.sin(a2) * Math.cos(la) * R, mixc(P.p, P.s, l / lat), 0.04, 0); } }
        for (var m = 0; m < mer; m++) { var mo = m / mer * 3.1416; for (var k2 = 0; k2 < per; k2++) { var a3 = k2 / per * 6.283; b.push(Math.cos(mo) * Math.sin(a3) * R, Math.cos(a3) * R, Math.sin(mo) * Math.sin(a3) * R, P.p, 0.04, 0); } } }
      else { var rings = 3, pr = Math.floor(sh * 0.7 / rings); for (var g = 0; g < rings; g++) { var tl = g * 1.047 + r() * 0.3; for (var k3 = 0; k3 < pr; k3++) { var a4 = k3 / pr * 6.283, x = Math.cos(a4) * R, z = Math.sin(a4) * R; b.push(x, z * Math.sin(tl), z * Math.cos(tl) * Math.cos(g) + x * Math.sin(g) * 0.0, g === 1 ? P.s : P.p, 0.05, 0); } }
        var rest = sh - pr * rings; for (var j2 = 0; j2 < rest; j2++) { var y2 = 1 - 2 * (j2 + 0.5) / rest, q3 = Math.sqrt(1 - y2 * y2), p2 = j2 * 2.39996; b.push(Math.cos(p2) * q3 * R * 0.62, y2 * R * 0.62, Math.sin(p2) * q3 * R * 0.62, P.s, 0.035, 0); } }
    },
    orbits: function (b, n, r, P, an) {
      var k = an.radars.length; if (!k) return; var per = Math.floor(n / k);
      an.radars.forEach(function (id, i) { var c = hsl(RADAR_HUE[id], 0.9, 0.6), rad = 1.3 + i * 0.19, tilt = (r() - 0.5) * 1.3, az = r() * 3.1416, sp = (0.22 + r() * 0.22) * (r() < 0.5 ? -1 : 1), off = r();
        for (var j = 0; j < per; j++) { var a = j / per * 6.283; b.push(Math.cos(a) * rad, (r() - 0.5) * 0.02, Math.sin(a) * rad, c, 0.05, 1, tilt, az, sp, off); } });
    },
    sonar: function (b, n, r, P) { var per = Math.floor(n / 4), cx = (r() - 0.5) * 1.0, cz = (r() - 0.5) * 0.8, mr = 4.2 + r() * 1.2, c = mixc(P.p, [1, 1, 1], 0.15);
      for (var g = 0; g < 4; g++) for (var j = 0; j < per; j++) { var a = j / per * 6.283; b.push(Math.cos(a), 0, Math.sin(a), c, 0.055, 2, g, cx, cz, mr); } },
    sea: function (b, n, r, P) { var cols = Math.round(Math.sqrt(n * 2.1)), rows = Math.floor(n / cols);
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) { var X = -6.8 + 13.6 * (x + (y % 2) * 0.5) / cols, Z = -4.0 + 6.8 * y / rows, f = Math.max(0, 1 - Math.hypot(X / 7.5, (Z + 0.6) / 4.2));
        b.push(X, -1.55, Z, sc(mixc(P.s, P.p, f), 0.4 + 0.9 * f), 0.05, 3); } },
    ships: function (b, n, r, P, an, scanner) {
      var cnt = scanner ? 2 + Math.floor(r() * 2) : 2 + Math.floor(r() * 2), per = Math.floor(n / cnt);
      for (var s = 0; s < cnt; s++) {
        var L = scanner ? 0.9 : 1.6, dir = r() < 0.5 ? -1 : 1, sp = dir * (0.12 + r() * 0.1) * (scanner ? 1.3 : 1), cx = -6 + (s + r() * 0.6) * 12 / cnt, cz = scanner ? 0.4 + r() * 1.6 : -2.6 + r() * 2.0;
        var h = scanner ? 0.16 : 0.2, out;
        if (!scanner) out = [[-L / 2, 0], [-L / 2 + 0.05, -h * 0.6], [L / 2 - 0.15, -h * 0.6], [L / 2, h * 0.15], [-L / 2, h * 0.15], [-L / 2, 0], [-L / 2 + 0.1, h * 0.15], [-L / 2 + 0.1, h * 1.6], [-L / 2 + 0.38, h * 1.6], [-L / 2 + 0.38, h * 0.15], [-L / 2 + 0.2, h * 1.6], [-L / 2 + 0.22, h * 2.4], [-L / 2 + 0.3, h * 2.4], [-L / 2 + 0.3, h * 1.6]];
        else out = [[-L / 2, h * 0.2], [-L / 2 + 0.08, -h * 0.6], [L / 2 - 0.1, -h * 0.6], [L / 2, h * 0.25], [-L / 2, h * 0.2], [-L / 2 + 0.15, h * 0.2], [-L / 2 + 0.15, h * 1.2], [L / 2 - 0.3, h * 1.2], [L / 2 - 0.3, h * 0.2], [L / 2 - 0.2, h * 0.2], [L / 2 - 0.2, h * 1.8], [L / 2 - 0.08, h * 1.8], [L / 2 - 0.08, h * 0.25]];
        var main = scanner ? Math.floor(per * 0.7) : per, col = scanner ? mixc(P.p, P.s, 0.3) : mixc(P.p, [1, 0.9, 0.7], 0.25);
        var pipes = scanner ? 0 : Math.floor(main * 0.15);
        poly(b, out.map(function (q) { return [q[0] * dir, q[1], 0]; }), main - pipes, function (x, y, z) { b.push(x, y + 0.12, (r() - 0.5) * 0.12, col, 0.04, 4, sp, cx, cz, 0); });
        for (var pp = 0; pp < pipes; pp++) { var px = (-L / 2 + 0.45 + (L - 0.65) * pp / pipes) * dir; b.push(px, h * 0.15 + 0.14, (pp % 2 ? 0.05 : -0.05), sc(col, 0.8), 0.03, 4, sp, cx, cz, 0); }
        if (scanner) { var sn = per - main, sc2 = mixc(P.s, [1, 1, 1], 0.2); for (var q = 0; q < sn; q++) { var u = q / sn, side = q % 3; var yy = side === 2 ? 0.75 : -0.08 + u * 0.83, zz = side === 0 ? -0.32 : side === 1 ? 0.32 : -0.32 + 0.64 * u; b.push(0, yy, zz, sc2, 0.035, 4, sp, cx, cz, 1); } }
      }
    },
    coins: function (b, n, r, P, an, side) { var cnt = 4 + Math.floor(r() * 3), per = Math.floor(n / cnt), gold = [1.0, 0.76, 0.32];
      for (var c = 0; c < cnt; c++) { var cx = side * (2.9 + r() * 1.9), cy = -0.4 + r() * 2.3, cz = -1.2 + r() * 1.8, ph = r() * 6.283, R = 0.26 + r() * 0.1;
        for (var j = 0; j < per; j++) { var u = j / per, x, y; if (u < 0.55) { var a = u / 0.55 * 6.283; x = Math.cos(a) * R; y = Math.sin(a) * R; } else if (u < 0.75) { var a2 = (u - 0.55) / 0.2 * 6.283; x = Math.cos(a2) * R * 0.78; y = Math.sin(a2) * R * 0.78; }
          else { var v = (u - 0.75) / 0.25 * 6, e = Math.floor(v), t = v - e, a0 = e * 1.0472 + 0.5236, a1 = a0 + 1.0472; x = (Math.cos(a0) * (1 - t) + Math.cos(a1) * t) * R * 0.45; y = (Math.sin(a0) * (1 - t) + Math.sin(a1) * t) * R * 0.45; }
          b.push(x, y, 0, u < 0.75 ? gold : mixc(gold, [1, 1, 1], 0.4), 0.04, 5, cx, cy, cz, ph); } } },
    chain: function (b, n, r, P, an, side) { var cnt = 5 + Math.floor(r() * 3), link = Math.floor(n * 0.15 / (cnt - 1)), per = Math.floor((n - link * (cnt - 1)) / cnt), c = hsl(268, 0.85, 0.66), S = 0.17, cs = [];
      for (var i = 0; i < cnt; i++) { var u = i / (cnt - 1); cs.push([side * (1.2 + u * 3.4), 2.0 + u * 0.7 + Math.sin(u * 3) * 0.25, -2.6 + u * 0.8]); }
      var E = [[0, 1], [1, 3], [3, 2], [2, 0], [4, 5], [5, 7], [7, 6], [6, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
      cs.forEach(function (cc, i) { var rot = r() * 1.5, V = []; for (var v = 0; v < 8; v++) { var x = (v & 1 ? S : -S), y = (v & 2 ? S : -S), z = (v & 4 ? S : -S); V.push([cc[0] + x * Math.cos(rot) - z * Math.sin(rot), cc[1] + y, cc[2] + x * Math.sin(rot) + z * Math.cos(rot)]); }
        var pe = Math.floor(per / 12); E.forEach(function (e) { poly(b, [V[e[0]], V[e[1]]], pe, function (x, y, z) { b.push(x, y, z, c, 0.035, 6, i / cnt); }); });
        if (i < cnt - 1) poly(b, [cc, cs[i + 1]], link, function (x, y, z, t) { b.push(x, y, z, sc(c, 0.6), 0.025, 6, (i + t) / cnt); }); });
    },
    morse: function (b, n, r, P, an, side, seq) { var units = [], i, c = mixc(P.p, [1, 1, 1], 0.35);
      for (i = 0; i < seq.length && units.length < 240; i++) { var ch = seq.charAt(i); if (ch === ".") units.push(1, 0); else if (ch === "-") units.push(1, 1, 1, 0); else if (ch === " ") units.push(0, 0); else if (ch === "/") units.push(0, 0, 0, 0, 0); }
      if (!units.length) return; var on = units.filter(function (u) { return u; }).length, base = units.length, perOn = Math.max(1, Math.floor((n - base) / on)), R = 3.3, a0 = -1.95, a1 = 1.95, y = 1.75;
      for (i = 0; i < units.length; i++) { var u = i / units.length, a = a0 + (a1 - a0) * u; b.push(Math.sin(a) * R, y, Math.cos(a) * R, sc(c, 0.4), 0.025, 7, u, 0);
        if (units[i]) for (var k = 0; k < perOn; k++) { var u2 = (i + k / perOn) / units.length, a2 = a0 + (a1 - a0) * u2; b.push(Math.sin(a2) * R, y + (k % 2 ? 0.015 : -0.015), Math.cos(a2) * R, c, 0.05, 7, u2, 1); } } },
    grid: function (b, n, r, P) { var tw = 5 + Math.floor(r() * 2), z = -4.3 + r() * 0.5, c = mixc(hsl(36, 0.95, 0.6), P.p, 0.25), xs = [], i, tp = Math.floor(n * 0.3 / tw), cp = Math.floor(n * 0.7 / ((tw - 1) * 3));
      for (i = 0; i < tw; i++) xs.push(-6.2 + 12.4 * i / (tw - 1) + (r() - 0.5) * 0.5);
      xs.forEach(function (x) { poly(b, [[x, -1.55, z], [x, 1.1, z]], Math.floor(tp * 0.7), function (X, Y, Z) { b.push(X, Y, Z, sc(c, 0.9), 0.05, 8, 0, 1); }); poly(b, [[x - 0.55, 1.0, z], [x + 0.55, 1.0, z]], tp - Math.floor(tp * 0.7), function (X, Y, Z) { b.push(X, Y, Z, sc(c, 0.9), 0.05, 8, 0, 1); }); });
      for (i = 0; i < tw - 1; i++) for (var w = 0; w < 3; w++) { var ox = (w - 1) * 0.5; for (var k = 0; k < cp; k++) { var t = k / cp, X = xs[i] + ox + (xs[i + 1] - xs[i]) * t, Y = 1.0 - Math.sin(t * 3.1416) * 0.35; b.push(X, Y, z, c, 0.05, 8, (i + t) / (tw - 1), 0); } } },
    voice: function (b, n, r, P) { var st = 3, per = Math.floor(n / st), cs = [P.p, P.s, [1, 1, 1]];
      for (var s = 0; s < st; s++) for (var j = 0; j < per; j++) { var u = j / per, x = -4.8 + 9.6 * u, env = Math.exp(-x * x / 7) * 0.8 + 0.2; b.push(x, -0.62 + (s - 1) * 0.04, 1.4, sc(cs[s], 0.85), 0.035, 9, s, env); } },
    redzone: function (b, n, r, P) { var zn = 2 + Math.floor(r() * 3), per = Math.floor(n / zn);
      for (var z = 0; z < zn; z++) { var cx = -4.8 + 9.6 * (z + 0.2 + r() * 0.6) / zn, cz = -3.0 + r() * 3.6, R = 0.7 + r() * 0.6, ring = Math.floor(per / 4);
        for (var g = 0; g < 4; g++) for (var j = 0; j < ring; j++) { var a = j / ring * 6.283; b.push(Math.cos(a), 0, Math.sin(a), P.a, 0.05, 10, cx, cz, R, g * 0.25 + r() * 0.02); } } },
    dust: function (b, n, r, P) { for (var j = 0; j < n; j++) b.push(-7.5 + r() * 15, -1.5 + r() * 5.5, -5.5 + r() * 9, sc(mixc(P.p, P.s, r()), 0.35 + r() * 0.35), 0.02 + r() * 0.035, 11); },
    spiral: function (b, n, r, P) { var arms = 2 + Math.floor(r() * 3), tw = 1.1 + r() * 0.8;
      for (var j = 0; j < n; j++) { var arm = j % arms, u = Math.pow(r(), 0.8), rr = 1.15 + u * 3.2, a = arm * 6.283 / arms + rr * tw + (r() - 0.5) * 0.35 * (1 - u * 0.5);
        b.push(Math.cos(a) * rr, -0.45 + (r() - 0.5) * 0.12 * (1 + u), Math.sin(a) * rr, sc(mixc(P.s, P.p, u), 1.25 - u * 0.5), 0.045 + 0.03 * (1 - u), 12); } },
    burst: function (b, n, r, P) { var rays = 28 + Math.floor(r() * 14), per = Math.floor(n / rays);
      for (var k = 0; k < rays; k++) { var w = r() * 2 - 1, a = r() * 6.283, q = Math.sqrt(1 - w * w), d = [Math.cos(a) * q, w * 0.7, Math.sin(a) * q];
        for (var j = 0; j < per; j++) { var t = 1.0 + Math.pow(j / per, 0.7) * (1.4 + r() * 0.8); b.push(d[0] * t, d[1] * t, d[2] * t, mixc(P.w, [1, 1, 1], 0.2 * (1 - j / per)), 0.045 * (1 - 0.6 * j / per), 13); } } },
    network: function (b, n, r, P) { var nn = 22 + Math.floor(r() * 8), nodes = [], c = mixc(hsl(186, 0.85, 0.6), P.s, 0.3), np = 4, i;
      for (i = 0; i < nn; i++) { var a = -2.6 + 5.2 * r(), el = 0.18 + r() * 0.9, R = 4.6 + r() * 0.6; nodes.push([Math.sin(a) * Math.cos(el) * R, CY + Math.sin(el) * R * 0.75, -Math.abs(Math.cos(a)) * Math.cos(el) * R - 0.5]); }
      var edges = []; nodes.forEach(function (p, i) { var d = nodes.map(function (q, j) { return [Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]), j]; }).sort(function (x, y) { return x[0] - y[0]; }); for (var k = 1; k <= 2; k++) if (d[k][1] > i) edges.push([i, d[k][1]]); });
      var ep = Math.max(2, Math.floor((n - nn * np) / Math.max(1, edges.length)));
      nodes.forEach(function (p, i) { for (var k = 0; k < np; k++) b.push(p[0] + (r() - 0.5) * 0.05, p[1] + (r() - 0.5) * 0.05, p[2], mixc(c, [1, 1, 1], 0.4), 0.075, 14, i / nn, 1, 0); });
      edges.forEach(function (e, k) { var ph = r(); poly(b, [nodes[e[0]], nodes[e[1]]], ep, function (x, y, z, t) { b.push(x, y, z, sc(c, 0.7), 0.025, 14, ph, 0, t); }); }); },
    satellite: function (b, n, r, P) { var cnt = 2 + Math.floor(r() * 2), per = Math.floor(n / cnt), c = mixc(P.p, [1, 1, 1], 0.45);
      for (var s = 0; s < cnt; s++) { var R = 3.0 + r() * 0.8, tilt = 0.35 + r() * 0.6, sp = (0.14 + r() * 0.1) * (r() < 0.5 ? -1 : 1), ph = r() * 6.283;
        for (var j = 0; j < per; j++) { var u = j / per, x, y, z; if (u < 0.25) { x = (r() - 0.5) * 0.12; y = (r() - 0.5) * 0.12; z = (r() - 0.5) * 0.12; } else { var sd = u < 0.625 ? -1 : 1, v = ((u - 0.25) % 0.375) / 0.375; x = sd * (0.12 + v * 0.38); y = 0; z = ((j % 5) / 4 - 0.5) * 0.14; }
          b.push(x, y, z, u < 0.25 ? c : sc(P.s, 1.1), 0.035, 15, R, tilt, sp, ph); } } }
  };
  var WEIGHT = { orbits: 0, sonar: 760, tanker: 2600, crypto: 1500, morse: 620, grid: 900, vessels: 800, voice: 720, redzone: 760, network: 760, satellite: 220, spiral: 1700, burst: 650 };

  function morseSeq(tr) {
    var L = tr.lyrics, lines = [];
    if (L && typeof L === "object" && !Array.isArray(L)) Object.keys(L).forEach(function (k) { if (Array.isArray(L[k])) lines = lines.concat(L[k]); });
    else if (Array.isArray(L)) lines = L; else if (typeof L === "string") lines = L.split("\n");
    var m = lines.filter(function (s) { return typeof s === "string" && /^[.\-\/ ]{8,}$/.test(s.trim()); });
    if (m.length) return m.slice(0, 3).join(" / ");
    var tab = { a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".", f: "..-.", g: "--.", h: "....", i: "..", j: ".---", k: "-.-", l: ".-..", m: "--", n: "-.", o: "---", p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-", u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..", 0: "-----", 1: ".----", 2: "..---", 3: "...--", 4: "....-", 5: ".....", 6: "-....", 7: "--...", 8: "---..", 9: "----." };
    return String(tr.title || "").toLowerCase().split("").map(function (ch) { return ch === " " ? "/" : tab[ch] || ""; }).filter(Boolean).join(" ");
  }

  function layout(dst, tr) {
    var empty = !tr, b = new Builder(dst, N), seed = empty ? 7 : hashStr(tr.id), r = prng(seed);
    var an = empty ? { els: [], pal: { p: [0.3, 0.55, 0.55], s: [0.25, 0.35, 0.45], a: [0.6, 0.3, 0.3], w: [0.7, 0.6, 0.5], speed: 0.6, dim: 0.7, moods: [] }, radars: [] } : analyse(tr);
    var P = an.pal, side = r() < 0.5 ? -1 : 1, els = an.els.slice();
    if (els.indexOf("vessels") >= 0 && els.indexOf("tanker") < 0) els.push("sea");
    var core = Math.round(N * 0.12), minDust = Math.round(N * 0.06), orb = an.radars.length * Math.round(N * 0.022), want = 0;
    els.forEach(function (e) { want += WEIGHT[e] || (e === "sea" ? 1700 : 0); });
    var avail = N - core - minDust - orb, k = want > avail ? avail / want : Math.min(1.25, N / 12000);
    BUILD.core(b, core, r, P, an); BUILD.orbits(b, orb, r, P, an);
    els.forEach(function (e) { var n = Math.floor((WEIGHT[e] || 1700) * k);
      if (e === "tanker") { BUILD.sea(b, Math.floor(n * 0.62), r, P); BUILD.ships(b, n - Math.floor(n * 0.62), r, P, an, false); }
      else if (e === "sea") BUILD.sea(b, n, r, P);
      else if (e === "vessels") BUILD.ships(b, n, r, P, an, true);
      else if (e === "crypto") { BUILD.coins(b, Math.floor(n * 0.5), r, P, an, -1); BUILD.chain(b, n - Math.floor(n * 0.5), r, P, an, 1); }
      else if (e === "morse") BUILD.morse(b, n, r, P, an, side, morseSeq(tr));
      else if (BUILD[e]) BUILD[e](b, n, r, P, an); });
    if (empty) { var ring = Math.round(N * 0.05); for (var j = 0; j < ring; j++) { var a = j / ring * 6.283; b.push(Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2, P.s, 0.035, 1, 0.25, 0.4, 0.05, 0); } }
    BUILD.dust(b, N - b.i, r, P);
    // shuffle so the hand-over between two tracks scatters across the whole image
    var idx = new Uint32Array(N); for (var i = 0; i < N; i++) idx[i] = i; var rr = prng(seed ^ 0x9e3779b9);
    for (i = N - 1; i > 0; i--) { var q = Math.floor(rr() * (i + 1)), t = idx[i]; idx[i] = idx[q]; idx[q] = t; }
    var tmp = { pos: dst.pos.slice(), col: dst.col.slice(), sk: dst.sk.slice(), aux: dst.aux.slice() };
    for (i = 0; i < N; i++) { var s = idx[i]; for (var c = 0; c < 3; c++) { dst.pos[i * 3 + c] = tmp.pos[s * 3 + c]; dst.col[i * 3 + c] = tmp.col[s * 3 + c]; } dst.sk[i * 2] = tmp.sk[s * 2]; dst.sk[i * 2 + 1] = tmp.sk[s * 2 + 1]; for (c = 0; c < 4; c++) dst.aux[i * 4 + c] = tmp.aux[s * 4 + c]; }
    var h2 = prng(seed ^ 0x51ed27);
    return { seed: seed, els: els, pal: P, radars: an.radars, camAz: (h2() - 0.5) * 0.9, camEl: 0.2 + h2() * 0.2, camDist: 1 + h2() * 0.12, spin: h2() < 0.5 ? -1 : 1 };
  }

  /* ================= shaders ================= */
  var VS = [
    "attribute vec3 aPosB; attribute vec4 aAuxA, aAuxB, aSK; attribute vec3 aColA, aColB; attribute float aPh;",
    "uniform float uT, uMix, uBeat, uBar, uBeatPh, uPx, uDim, uScat, uSpin, uSpd;",
    "varying vec3 vC; varying float vI;",
    "const vec3 C = vec3(0., " + CY.toFixed(2) + ", 0.);",
    "mat2 r2(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }",
    "float seaY(vec2 p){ return 0.07*sin(p.x*1.1+uT*0.9)+0.05*sin(p.y*2.3-uT*1.3+p.x*0.4); }",
    "vec3 anim(vec3 p, float k, vec4 a, inout float br){",
    " if(k<0.5){ p.xz=r2(uT*0.15*uSpin)*p.xz; p*=1.+0.07*uBeat; br*=1.+0.7*uBeat; return p+C; }",
    " if(k<1.5){ float ang=atan(p.z,p.x), rr=length(p.xz), g=ang+uT*a.z; vec3 q=vec3(cos(g)*rr,p.y,sin(g)*rr); q.yz=r2(a.x)*q.yz; q.xz=r2(a.y)*q.xz;",
    "   float h=mod(-ang*sign(a.z)+a.w*6.283+uT*abs(a.z)*1.7,6.2832); br*=0.3+1.7*exp(-h*1.6)+0.35*uBeat; return q+C; }",
    " if(k<2.5){ float f=fract(uBeatPh*0.25*0.5+a.x*0.25); float r=a.w*f; br*=(1.-f)*(1.-f)*1.8*smoothstep(0.,0.06,f)*(1.+0.5*uBar); return vec3(a.y+p.x*r,-1.5,a.z+p.z*r); }",
    " if(k<3.5){ float y=seaY(p.xz); br*=0.7+y*6.+0.3*uBeat; return vec3(p.x,p.y+y,p.z); }",
    " if(k<4.5){ float x=mod(a.y+uT*a.x+6.8,13.6)-6.8; br*=smoothstep(6.8,5.6,abs(x)); vec3 q=p; if(a.w>0.5){ q.x+=sin(uT*1.3+a.y*3.)*0.5; br*=1.3+0.6*uBeat; }",
    "   return vec3(x+q.x,-1.55+seaY(vec2(x,a.z))+q.y,a.z+q.z); }",
    " if(k<5.5){ float g=uT*1.1+a.w; vec3 q=vec3(p.x*cos(g),p.y,p.x*sin(g)); br*=0.55+0.6*abs(cos(g))+0.6*uBeat; return q+a.xyz+vec3(0.,0.12*sin(uT*0.7+a.w*3.),0.); }",
    " if(k<6.5){ float d=fract(a.x-uT*0.16); br*=0.35+1.8*exp(-pow((d-0.5)*9.,2.))+0.3*uBar; return p+vec3(0.,0.05*sin(uT*0.8+a.x*6.),0.); }",
    " if(k<7.5){ float d=fract(uT*0.06-a.x); br*= a.y>0.5 ? 0.3+2.2*exp(-d*22.)+0.25*uBeat : 0.5; return p; }",
    " if(k<8.5){ if(a.y>0.5){ br*=0.6+0.3*uBar; return p; } float f=fract(a.x*2.-uBeatPh*0.25); br*=0.3+2.*pow(f,10.); return p; }",
    " if(k<9.5){ float x=p.x; float w=sin(x*3.1-uT*4.+a.x*1.7)*0.6+sin(x*7.3+uT*6.1+a.x)*0.3+sin(x*13.+uT*9.)*0.15; float o=a.y*(0.18+0.4*uBeat)*w; br*=0.55+abs(o)*4.; return vec3(x,p.y+o,p.z); }",
    " if(k<10.5){ float f=fract(uT*0.32+a.w); float r=a.z*(0.15+0.85*f); br*=(1.-f)*1.5+0.5*uBar; return vec3(a.x+p.x*r,-1.5,a.y+p.z*r); }",
    " if(k<11.5){ p.y+=sin(uT*0.1+aPh*6.28)*0.15; p.x+=sin(uT*0.07+aPh*9.)*0.2; br*=0.5+0.5*sin(uT*0.9+aPh*30.); return p; }",
    " if(k<12.5){ float rr=length(p.xz); p.xz=r2(uT*0.11*uSpin+0.25/rr)*p.xz; br*=0.6+0.5*sin(rr*3.-uT*1.4)+0.2*uBeat; return p+C; }",
    " if(k<13.5){ p*=1.+0.35*uBar; br*=0.12+2.4*uBar*uBar+0.25*uBeat; return p+C; }",
    " if(k<14.5){ if(a.y>0.5){ br*=0.5+1.2*pow(0.5+0.5*sin(uT*1.7+a.x*40.),6.)+0.3*uBeat; return p; } float f=fract(a.z-uT*0.3+a.x); br*=0.2+1.6*exp(-(1.-f)*14.); return p; }",
    " float g=a.w+uT*a.z; vec3 c=vec3(cos(g)*a.x,0.,sin(g)*a.x); c.yz=r2(a.y)*c.yz; vec3 q=p; q.xz=r2(-g)*q.xz; br*=1.+0.4*uBeat; return c+q+C;",
    "}",
    "void main(){ float bA=1., bB=1.; vec3 pa=anim(position,aSK.z,aAuxA,bA); vec3 pb=anim(aPosB,aSK.w,aAuxB,bB);",
    " float e=clamp(uMix*1.6-aPh*0.6,0.,1.); e=e*e*(3.-2.*e); float s=sin(e*3.14159);",
    " vec3 dir=normalize(vec3(sin(aPh*91.7),cos(aPh*53.3)*0.8,sin(aPh*27.1+1.))+0.0001);",
    " vec3 p=mix(pa,pb,e)+dir*s*uScat*(0.8+2.2*fract(aPh*13.7)); p.xz=r2(s*uScat*0.5*(aPh-0.5))*p.xz;",
    " float sz=mix(aSK.x,aSK.y,e)*(1.-0.35*s*uScat); vC=mix(aColA,aColB,e); vI=mix(bA,bB,e)*(1.+1.3*s*uScat)*uDim*(1.+0.18*uBeat);",
    " if(uScat<0.01){ float fa=1.-smoothstep(0.,0.5,e), fb=smoothstep(0.5,1.,e); vI*=max(fa,fb); }",
    " vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=sz<0.001?0.:clamp(sz*uPx/-mv.z,1.,52.); }"
  ].join("\n");
  var FS = "uniform float uT, uFl; varying vec3 vC; varying float vI;\n" +
    "void main(){ vec2 q=gl_PointCoord-0.5; float d=dot(q,q)*4.; if(d>1.) discard; float g=exp(-d*6.5)+exp(-d*2.)*0.22;\n" +
    " float sl=0.84+0.16*sin(gl_FragCoord.y*1.6+uT*2.);\n" +
    " gl_FragColor=vec4((vC*g*sl*uFl+vec3(1.)*exp(-d*28.)*0.22)*vI*(1.-smoothstep(0.7,1.,d)),1.); }";
  var BGV = "varying vec2 vU; void main(){ vU=position.xy*0.5+0.5; gl_Position=vec4(position.xy,0.9999,1.); }";
  var BGF = "uniform vec3 uP,uS,uA; uniform float uT,uBeat,uAsp,uDim,uRed; varying vec2 vU;\n" +
    "float h(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }\n" +
    "void main(){ vec2 u=vU*2.-1.; u.x*=uAsp; float r=length(u-vec2(0.,0.12));\n" +
    " vec3 c=uS*0.07*smoothstep(1.9,0.,r)+uP*0.07*exp(-r*r*2.5)*(1.+uBeat*0.9);\n" +
    " float hz=-0.12; if(u.y<hz){ float z=0.4/(hz-u.y); vec2 g=vec2(u.x*z*1.2, z+uT*0.12); vec2 f=abs(fract(g)-0.5); vec2 w=fwidth(g)*1.3;\n" +
    "  float ln=max(1.-smoothstep(0.,w.x,0.5-f.x),1.-smoothstep(0.,w.y,0.5-f.y)); c+=uP*0.07*ln*smoothstep(9.,1.,z)*smoothstep(0.,0.25,hz-u.y); }\n" +
    " c+=uA*uRed*0.05*smoothstep(0.4,1.6,length(u*vec2(0.6,1.)))*(0.7+0.3*uBeat);\n" +
    " c*=uDim*smoothstep(2.2,0.5,length(u*vec2(0.75,1.))); c+=(h(gl_FragCoord.xy+fract(uT)*91.)-0.5)*0.012;\n" +
    " gl_FragColor=vec4(max(c,0.),1.); }";

  /* ================= engine ================= */
  function alloc() { return { pos: new Float32Array(N * 3), col: new Float32Array(N * 3), sk: new Float32Array(N * 2), aux: new Float32Array(N * 4) }; }
  function upload() {
    var a = geo.attributes, sk = a.aSK.array;
    a.position.array.set(A.pos); a.aPosB.array.set(B.pos); a.aColA.array.set(A.col); a.aColB.array.set(B.col); a.aAuxA.array.set(A.aux); a.aAuxB.array.set(B.aux);
    for (var i = 0; i < N; i++) { sk[i * 4] = A.sk[i * 2]; sk[i * 4 + 1] = B.sk[i * 2]; sk[i * 4 + 2] = A.sk[i * 2 + 1]; sk[i * 4 + 3] = B.sk[i * 2 + 1]; }
    ["position", "aPosB", "aColA", "aColB", "aAuxA", "aAuxB", "aSK"].forEach(function (k) { a[k].needsUpdate = true; });
  }
  function build() {
    scene = new T.Scene(); cam = new T.PerspectiveCamera(38, 16 / 9, 0.1, 80);
    geo = new T.BufferGeometry(); A = alloc(); B = alloc();
    var ph = new Float32Array(N); for (var i = 0; i < N; i++) ph[i] = (hashStr("p" + i) % 100000) / 100000;
    geo.setAttribute("position", new T.BufferAttribute(new Float32Array(N * 3), 3)); geo.setAttribute("aPosB", new T.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute("aColA", new T.BufferAttribute(new Float32Array(N * 3), 3)); geo.setAttribute("aColB", new T.BufferAttribute(new Float32Array(N * 3), 3));
    geo.setAttribute("aAuxA", new T.BufferAttribute(new Float32Array(N * 4), 4)); geo.setAttribute("aAuxB", new T.BufferAttribute(new Float32Array(N * 4), 4));
    geo.setAttribute("aSK", new T.BufferAttribute(new Float32Array(N * 4), 4)); geo.setAttribute("aPh", new T.BufferAttribute(ph, 1));
    ["t", "mix", "beat", "bar", "beatPh", "px", "dim", "scat", "spin", "fl"].forEach(function (k) { U[k] = { value: 0 }; }); U.mix.value = 1; U.spin.value = 1; U.fl.value = 1;
    var m = new T.ShaderMaterial({ uniforms: { uT: U.t, uMix: U.mix, uBeat: U.beat, uBar: U.bar, uBeatPh: U.beatPh, uPx: U.px, uDim: U.dim, uScat: U.scat, uSpin: U.spin, uSpd: { value: 1 }, uFl: U.fl },
      vertexShader: VS, fragmentShader: FS, transparent: true, depthWrite: false, depthTest: false, blending: T.AdditiveBlending });
    pts = new T.Points(geo, m); pts.frustumCulled = false; scene.add(pts);
    U.bgP = { value: new T.Color() }; U.bgS = { value: new T.Color() }; U.bgA = { value: new T.Color() }; U.asp = { value: 1.78 }; U.red = { value: 0 };
    var bm = new T.ShaderMaterial({ uniforms: { uP: U.bgP, uS: U.bgS, uA: U.bgA, uT: U.t, uBeat: U.beat, uAsp: U.asp, uDim: U.dim, uRed: U.red }, vertexShader: BGV, fragmentShader: BGF, depthTest: false, depthWrite: false });
    bm.extensions = { derivatives: true };
    bg = new T.Mesh(new T.PlaneGeometry(2, 2), bm); bg.frustumCulled = false; bg.renderOrder = -1; scene.add(bg);
    var L = layout(B, null); A.pos.set(B.pos); A.col.set(B.col); A.sk.set(B.sk); A.aux.set(B.aux); applyMeta(L, null); upload();
  }
  function applyMeta(L, tr) {
    cur.id = tr ? String(tr.id) : null; cur.els = L.els; cur.pal = L.pal; cur.radars = L.radars; cur.camAz = L.camAz; cur.camEl = L.camEl; cur.camDist = L.camDist; cur.seed = L.seed;
    var b = tr && typeof tr.bpm === "number" && tr.bpm > 30 && tr.bpm < 260 ? tr.bpm : null; cur.bpm = b || DEFAULT_BPM; cur.bpmGiven = !!b;
    U.spin.value = L.spin * L.pal.speed; U.bgP.value.setRGB(L.pal.p[0], L.pal.p[1], L.pal.p[2]); U.bgS.value.setRGB(L.pal.s[0], L.pal.s[1], L.pal.s[2]); U.bgA.value.setRGB(L.pal.a[0], L.pal.a[1], L.pal.a[2]); U.red.value = L.pal.red ? 1 : 0;
  }
  function setTrack(tr) {
    if (!ren) return false; if (tr && (tr.id == null || tr.id === "")) tr = null;
    var id = tr ? String(tr.id) : null; if (id === cur.id && mixT >= 1) return true;
    // freeze the current image as the "from" state
    var a = geo.attributes; A.pos.set(B.pos); A.col.set(B.col); A.sk.set(B.sk); A.aux.set(B.aux);
    var L = layout(B, tr); applyMeta(L, tr); upload(); mixT = 0; mixDur = reduce ? 1.2 : 2.6; U.scat.value = reduce ? 0 : 1; kick(); return true;
  }
  function setState(s) { if (s !== "playing" && s !== "paused" && s !== "idle") return; state = s; kick(); }
  function sync(sec) { if (typeof sec === "number" && isFinite(sec) && cur.bpmGiven) { syncTarget = sec * cur.bpm / 60; sinceSync = 0; } }

  function resize() {
    if (!ren || !el0) return; var w = Math.max(1, el0.clientWidth), h = Math.max(1, el0.clientHeight), mob = Math.min(w, h) < 520;
    var pr = Math.min(window.devicePixelRatio || 1, mob ? 1.5 : 1.75); ren.setPixelRatio(pr); ren.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix(); U.asp.value = w / h; U.px.value = 1.15 * h * pr / (2 * Math.tan(19 * Math.PI / 180)); vOff = w >= h ? 0.11 : 0; if (vOff) cam.setViewOffset(w, h, w * vOff, 0, w, h); else cam.clearViewOffset(); kick();
  }
  function frame(now) {
    var dt = lastNow == null ? 0 : Math.min(0.1, (now - lastNow) / 1000); lastNow = now;
    if (reduce) dt = 0;
    var rate = state === "playing" ? 1 : state === "paused" ? 0.22 : 0.32;
    tAnim += dt * rate * (cur.pal ? cur.pal.speed : 1);
    if (state === "playing") { beatPh += dt * cur.bpm / 60; if (syncTarget != null) { var d = syncTarget - beatPh; if (Math.abs(d) > 2) beatPh = syncTarget; else beatPh += d * 0.1; syncTarget += dt * cur.bpm / 60; } }
    var bf = beatPh - Math.floor(beatPh), onBar = Math.floor(beatPh) % 4 === 0;
    var beat = state === "playing" && !reduce ? Math.exp(-bf * 6) : 0, bar = state === "playing" && !reduce && onBar ? Math.exp(-bf * 3.5) : 0;
    var tgtDim = state === "playing" ? 1 : state === "paused" ? 0.62 + (reduce ? 0 : 0.2 * Math.sin(now / 1000 * 1.25)) : 0.5;
    dimNow += (tgtDim - dimNow) * (reduce ? 1 : Math.min(1, dt * 2.5));
    if (mixT < 1) { mixT = Math.min(1, mixT + (reduce ? (now - (frame.lt || now)) / 1000 : dt) / mixDur); }
    frame.lt = now;
    U.t.value = tAnim; U.beat.value = beat; U.bar.value = bar; U.beatPh.value = state === "playing" ? beatPh : tAnim * 0.5; U.mix.value = mixT; U.dim.value = dimNow * (cur.pal ? cur.pal.dim : 1);
    U.fl.value = reduce ? 1 : 0.94 + 0.06 * ((hashStr("f" + Math.floor(now / 70)) % 1000) / 1000);
    var az = cur.camAz + (reduce ? 0 : Math.sin(tAnim * 0.05) * 0.14), el = cur.camEl + (reduce ? 0 : Math.sin(tAnim * 0.037) * 0.04);
    var dist = 10.2 * (cur.camDist || 1) * Math.max(1, 1.15 / cam.aspect);
    cam.position.set(Math.sin(az) * Math.cos(el) * dist, Math.sin(el) * dist + 0.2, Math.cos(az) * Math.cos(el) * dist); cam.lookAt(0, cam.aspect < 1 ? 0.15 : -0.05, 0);
    ren.info.reset(); ren.render(scene, cam);
  }
  function visible() { return onScreen && document.visibilityState !== "hidden"; }
  function loop() { var now = performance.now(); raf = 0; if (!ren || !visible()) { lastNow = null; return; } frame(now); if (!reduce || mixT < 1) raf = requestAnimationFrame(loop); }
  function kick() { if (ren && !raf && visible()) raf = requestAnimationFrame(loop); }

  function init(el) {
    try {
      if (ren) destroy(); T = window.THREE; if (!T || !el) return false;
      cv = document.createElement("canvas"); cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y";
      if (getComputedStyle(el).position === "static") el.style.position = "relative"; el.style.touchAction = "pan-y";
      var gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" }) || cv.getContext("experimental-webgl"); if (!gl) return false;
      el.appendChild(cv); el0 = el;
      var mob = Math.min(el.clientWidth || 800, el.clientHeight || 450) < 520 || (window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
      N = mob ? 7000 : 12000;
      ren = new T.WebGLRenderer({ canvas: cv, context: gl, antialias: false, alpha: false }); ren.setClearColor(0x000000, 1); ren.info.autoReset = false;
      build(); resize();
      if ("ResizeObserver" in window) { ro = new ResizeObserver(resize); ro.observe(el); } else on(window, "resize", resize);
      if ("IntersectionObserver" in window) { io = new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; lastNow = null; kick(); }, { threshold: 0.02 }); io.observe(el); }
      on(document, "visibilitychange", function () { lastNow = null; kick(); });
      kick(); return true;
    } catch (e) { try { destroy(); } catch (e2) {} return false; }
  }
  function destroy() {
    if (raf) cancelAnimationFrame(raf); raf = 0; if (io) io.disconnect(); if (ro) ro.disconnect(); io = ro = null;
    listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); }); listeners = [];
    if (scene) scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    if (ren) { ren.dispose(); ren = null; } if (cv && cv.parentNode) cv.parentNode.removeChild(cv); cv = null; el0 = null; cur.id = null; mixT = 1;
  }
  function stats() {
    var i = ren ? ren.info.render : { calls: 0, triangles: 0, points: 0 };
    return { trackId: cur.id, state: state, bpm: cur.bpm, bpmGiven: !!cur.bpmGiven, elements: cur.els.slice(), radars: (cur.radars || []).slice(), moods: cur.pal ? cur.pal.moods.slice() : [],
      seed: cur.seed, particles: N, drawCalls: i.calls, triangles: i.triangles, points: i.points, transition: +mixT.toFixed(3), reducedMotion: reduce, running: !!raf };
  }
  window.OrbMusic3D = { init: init, setTrack: setTrack, setState: setState, sync: sync, stats: stats, destroy: destroy, KEYWORDS: KEYWORDS, MOODS: MOODS };
})();
