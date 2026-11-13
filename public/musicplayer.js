/* OrbMusicPlayer - one-window music player for orbstudio.org/music (preview build, not deployed).
   Hologram (OrbMusic3D) fills the window; the official TikTok Embed Player v1 sits in a small,
   always-visible window bottom-right. Queue loops; new tracks from load() join automatically.
   Text only via textContent; links https only; postMessage origin checked.
   window.OrbMusicPlayer = { init(el, {onTrack, onState}) -> bool, load(music), play(i), next(), prev(), toggle(), stats(), destroy() } */
(function () {
  "use strict";
  var TT_ORIGIN = "https://www.tiktok.com";
  var TT_PARAMS = "controls=1&progress_bar=1&play_button=1&volume_control=1&fullscreen_button=0&timestamp=0&loop=0&music_info=0&description=0&rel=0&native_context_menu=0&closed_caption=0";
  var READY_TIMEOUT = 12000, START_TIMEOUT = 7000;
  var I18N = {
    ru: { listen: "▶ Слушать", next: "▶ Следующий трек", open: "Открыть в TikTok", lyrics: "Текст песни", hide: "Скрыть текст", nodata: "НЕТ ДАННЫХ", notempo: "темп не указан", bpm: "BPM", loading: "загрузка…", prev: "Предыдущий трек", nextT: "Следующий трек", play: "Играть", pause: "Пауза", queue: "Очередь", tt: "Видео TikTok",
      radars: { geo: "Гео", politics: "Политика", economy: "Экономика", budget: "Бюджет", crypto: "Крипто", energy: "Энергетика", justice: "Правосудие", web: "Веб" } },
    de: { listen: "▶ Anhören", next: "▶ Nächster Titel", open: "In TikTok öffnen", lyrics: "Songtext", hide: "Text ausblenden", nodata: "KEINE DATEN", notempo: "Tempo nicht angegeben", bpm: "BPM", loading: "lädt…", prev: "Vorheriger Titel", nextT: "Nächster Titel", play: "Abspielen", pause: "Pause", queue: "Warteschlange", tt: "TikTok-Video",
      radars: { geo: "Geo", politics: "Politik", economy: "Wirtschaft", budget: "Haushalt", crypto: "Krypto", energy: "Energie", justice: "Justiz", web: "Web" } },
    en: { listen: "▶ Listen", next: "▶ Next track", open: "Open in TikTok", lyrics: "Lyrics", hide: "Hide lyrics", nodata: "NO DATA", notempo: "tempo not specified", bpm: "BPM", loading: "loading…", prev: "Previous track", nextT: "Next track", play: "Play", pause: "Pause", queue: "Queue", tt: "TikTok video",
      radars: { geo: "Geo", politics: "Politics", economy: "Economy", budget: "Budget", crypto: "Crypto", energy: "Energy", justice: "Justice", web: "Web" } }
  };
  var HUE = { geo: 352, politics: 318, economy: 212, budget: 146, crypto: 268, energy: 36, justice: 28, web: 186 };
  var CSS = [
    ".omp{color:#dff7f4;font:14px/1.35 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;touch-action:pan-y}",
    ".omp-stage{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border-radius:14px;background:#000;border:1px solid rgba(120,220,210,.18);touch-action:pan-y}",
    ".omp-holo{position:absolute;inset:0}",
    ".omp-top{position:absolute;left:3%;top:4%;max-width:58%;pointer-events:none;text-shadow:0 0 12px rgba(0,0,0,.9)}",
    ".omp-title{font-size:clamp(17px,2.4vw,30px);font-weight:650;letter-spacing:.01em;color:#f2fffd}",
    ".omp-meta{margin-top:.35em;font:600 12px/1.3 ui-monospace,Menlo,monospace;letter-spacing:.08em;color:#8fe9de;text-transform:uppercase}",
    ".omp-style{margin-top:.3em;font-size:12.5px;color:#b8d9d6;opacity:.9}",
    ".omp-rad{margin-top:.55em;display:flex;flex-wrap:wrap;gap:4px 10px;font:11px ui-monospace,Menlo,monospace;color:#cfe}",
    ".omp-rad span{display:inline-flex;align-items:center;gap:5px}.omp-rad i{width:7px;height:7px;border-radius:50%;display:inline-block;box-shadow:0 0 8px currentColor}",
    ".omp-mid{position:absolute;left:0;right:24%;top:0;bottom:0;display:flex;align-items:center;justify-content:center;pointer-events:none}",
    ".omp-big{pointer-events:auto;font:650 clamp(15px,1.8vw,20px) system-ui,sans-serif;color:#021;background:linear-gradient(180deg,#9ff8ee,#41d6c7);border:0;border-radius:999px;padding:.75em 1.6em;cursor:pointer;box-shadow:0 0 28px rgba(80,240,220,.45)}",
    ".omp-big:focus-visible,.omp button:focus-visible,.omp a:focus-visible{outline:2px solid #fff;outline-offset:2px}",
    ".omp-nodata{font:700 clamp(18px,3vw,34px) ui-monospace,Menlo,monospace;letter-spacing:.35em;color:#7fd9cf;opacity:.85;text-shadow:0 0 18px rgba(80,220,200,.6)}",
    ".omp-bot{position:absolute;left:3%;right:27%;bottom:4%;display:flex;flex-direction:column;gap:8px}",
    ".omp-ctl{display:flex;gap:8px}",
    ".omp-ctl button{width:42px;height:42px;border-radius:50%;border:1px solid rgba(140,240,225,.45);background:rgba(0,20,22,.55);color:#dffffa;font-size:16px;cursor:pointer;backdrop-filter:blur(4px)}",
    ".omp-ctl button.pp{width:50px;height:50px;margin-top:-4px;font-size:19px;border-color:#7ff3e4}",
    ".omp-q{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px}.omp-q::-webkit-scrollbar{display:none}",
    ".omp-chip{position:relative;flex:0 0 auto;max-width:170px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font:12px system-ui,sans-serif;color:#bfe;background:rgba(0,18,20,.6);border:1px solid rgba(120,220,210,.25);border-radius:8px;padding:6px 10px;cursor:pointer}",
    ".omp-chip.on{color:#021;background:#8ff5e8;border-color:#bffff7;box-shadow:0 0 16px rgba(110,245,230,.55)}",
    ".omp-chip b{position:absolute;left:0;bottom:0;height:2px;background:#fff;width:0}",
    ".omp-tt{position:absolute;right:2%;bottom:4%;width:22%;aspect-ratio:9/16;max-height:88%;border-radius:10px;overflow:hidden;background:#050b0c;border:1px solid rgba(140,240,225,.35);box-shadow:0 0 24px rgba(60,200,190,.25)}",
    ".omp-tt iframe{position:absolute;inset:0;width:100%;height:100%;border:0}",
    ".omp-open{position:absolute;left:8%;right:8%;top:5%;display:none;text-align:center;font:600 12px system-ui,sans-serif;color:#021;background:#8ff5e8;border-radius:8px;padding:8px 6px;text-decoration:none;z-index:2}",
    ".omp-ttph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:10px;font:11px ui-monospace,monospace;color:#6fb9b1;letter-spacing:.06em}",
    ".omp-below{margin-top:10px}",
    ".omp-lb{font:600 13px system-ui,sans-serif;color:#bff;background:transparent;border:1px solid rgba(120,220,210,.35);border-radius:8px;padding:7px 14px;cursor:pointer}",
    ".omp-ly{margin-top:10px;padding:14px 16px;border-left:2px solid rgba(120,220,210,.4);white-space:pre-wrap;color:#d6ecea;font-size:14px;line-height:1.55}",
    ".omp-ly .tag{color:#78b8b1;font-size:12px;font-family:ui-monospace,Menlo,monospace}.omp-ly .gap{height:.7em}",
    "@media (max-width:700px){.omp-stage{aspect-ratio:4/5}.omp-top{max-width:92%}.omp-tt{width:30%}.omp-bot{right:35%}.omp-mid{right:0;align-items:flex-start;padding-top:46%}.omp-chip{max-width:120px}}",
    "@media (prefers-reduced-motion:reduce){.omp *{transition:none!important}}"
  ].join("\n");

  var root, ui = {}, cb = {}, tracks = [], idx = 0, started = false, playing = false, wantPlay = false, ifr = null, ttReady = false, ttFailed = false;
  var readyTimer = 0, startTimer = 0, lyrOpen = false, has3d = false, embed = true, listeners = [], lastErr = null, lastState = null;
  function on(t, e, f) { t.addEventListener(e, f); listeners.push([t, e, f]); }
  function lang() { var l = (document.documentElement.getAttribute("lang") || "ru").toLowerCase().slice(0, 2); return I18N[l] ? l : "en"; }
  function X() { return I18N[lang()]; }
  function mk(tag, cls, parent, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = String(text); if (parent) parent.appendChild(n); return n; }
  function txt(n, s) { n.textContent = s == null ? "" : String(s); n.style.display = s == null || s === "" ? "none" : ""; }
  function https(u) { try { var x = new URL(String(u)); return x.protocol === "https:" ? x.href : null; } catch (e) { return null; } }
  function validId(id) { return /^\d{6,25}$/.test(String(id == null ? "" : id)); }
  function fmtDate(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(d || "")); if (!m) return null; return lang() === "en" ? m[1] + "-" + m[2] + "-" + m[3] : m[3] + "." + m[2] + "." + m[1]; }
  function setState(s) { if (lastState === s) return; lastState = s; if (has3d) window.OrbMusic3D.setState(s); ui.pp.textContent = s === "playing" ? "⏸" : "▶"; ui.pp.setAttribute("aria-label", s === "playing" ? X().pause : X().play); if (cb.onState) try { cb.onState(s); } catch (e) {} }
  function show(n, v) { n.style.display = v ? "" : "none"; }

  function build(el) {
    if (!document.getElementById("omp-css")) { var s = document.createElement("style"); s.id = "omp-css"; s.textContent = CSS; document.head.appendChild(s); }
    root = el; root.classList.add("omp"); root.textContent = "";
    ui.stage = mk("div", "omp-stage", root); ui.holo = mk("div", "omp-holo", ui.stage);
    ui.top = mk("div", "omp-top", ui.stage); ui.title = mk("div", "omp-title", ui.top); ui.meta = mk("div", "omp-meta", ui.top); ui.style = mk("div", "omp-style", ui.top); ui.rad = mk("div", "omp-rad", ui.top);
    ui.mid = mk("div", "omp-mid", ui.stage); ui.listen = mk("button", "omp-big", ui.mid); ui.nextBig = mk("button", "omp-big", ui.mid); ui.nodata = mk("div", "omp-nodata", ui.mid);
    ui.listen.type = ui.nextBig.type = "button";
    ui.bot = mk("div", "omp-bot", ui.stage); ui.ctl = mk("div", "omp-ctl", ui.bot);
    ui.prev = mk("button", "", ui.ctl, "⏮"); ui.pp = mk("button", "pp", ui.ctl, "▶"); ui.next = mk("button", "", ui.ctl, "⏭"); ui.q = mk("div", "omp-q", ui.bot);
    [ui.prev, ui.pp, ui.next].forEach(function (b) { b.type = "button"; });
    ui.tt = mk("div", "omp-tt", ui.stage); ui.ttph = mk("div", "omp-ttph", ui.tt); ui.open = mk("a", "omp-open", ui.tt); ui.open.target = "_blank"; ui.open.rel = "noopener noreferrer";
    ui.below = mk("div", "omp-below", root); ui.lb = mk("button", "omp-lb", ui.below); ui.lb.type = "button"; ui.ly = mk("div", "omp-ly", ui.below); ui.ly.hidden = true;
    on(ui.listen, "click", function () { play(idx); });
    on(ui.nextBig, "click", function () { show(ui.nextBig, false); wantPlay = true; mountTT(true); });
    on(ui.prev, "click", function () { prev(); }); on(ui.next, "click", function () { next(); }); on(ui.pp, "click", function () { toggle(); });
    on(ui.lb, "click", function () { lyrOpen = !lyrOpen; renderLyrics(); });
    on(window, "message", onMsg);
    labels(); show(ui.nextBig, false); show(ui.nodata, false); show(ui.listen, false);
  }
  function labels() { var x = X(); ui.listen.textContent = x.listen; ui.nextBig.textContent = x.next; ui.nodata.textContent = x.nodata; ui.open.textContent = x.open;
    ui.prev.setAttribute("aria-label", x.prev); ui.next.setAttribute("aria-label", x.nextT); ui.q.setAttribute("aria-label", x.queue); ui.tt.setAttribute("aria-label", x.tt); }

  /* ---------- TikTok embed ---------- */
  function post(type, value) { if (!ifr || !ifr.contentWindow) return; var m = { type: type, "x-tiktok-player": true }; if (value !== undefined) m.value = value; try { ifr.contentWindow.postMessage(m, TT_ORIGIN); } catch (e) {} }
  function clearTimers() { clearTimeout(readyTimer); clearTimeout(startTimer); readyTimer = startTimer = 0; }
  function failTT() { ttFailed = true; var t = tracks[idx], u = t && https(t.tiktok_url); if (u) { ui.open.href = u; show(ui.open, true); } }
  function mountTT(autoplay) {
    clearTimers(); ttReady = false; ttFailed = false; show(ui.open, false); var t = tracks[idx];
    if (ifr) { ifr.parentNode && ifr.parentNode.removeChild(ifr); ifr = null; }
    if (!t) return;
    var u = https(t.tiktok_url); if (u) ui.open.href = u;
    if (!embed) { ui.ttph.textContent = "TikTok · " + t.id; return; }
    ui.ttph.textContent = X().loading;
    ifr = document.createElement("iframe");
    ifr.src = TT_ORIGIN + "/player/v1/" + encodeURIComponent(t.id) + "?" + TT_PARAMS + "&autoplay=" + (autoplay ? 1 : 0);
    ifr.setAttribute("allow", "autoplay; fullscreen; encrypted-media; picture-in-picture");
    ifr.setAttribute("referrerpolicy", "strict-origin-when-cross-origin"); ifr.setAttribute("title", X().tt + ": " + (t.title || t.id)); ifr.setAttribute("loading", "eager");
    on(ifr, "error", failTT); ui.tt.appendChild(ifr);
    readyTimer = setTimeout(function () { if (!ttReady) failTT(); }, READY_TIMEOUT);
    if (autoplay) startTimer = setTimeout(function () { if (wantPlay && lastErr !== "ok" && !playing) show(ui.nextBig, true); }, READY_TIMEOUT + START_TIMEOUT);
  }
  function onMsg(e) {
    if (e.origin !== TT_ORIGIN || !ifr || e.source !== ifr.contentWindow) return;
    var d = e.data; if (typeof d === "string") { try { d = JSON.parse(d); } catch (er) { return; } }
    if (!d || typeof d !== "object" || d["x-tiktok-player"] !== true || typeof d.type !== "string") return;
    switch (d.type) {
      case "onPlayerReady": ttReady = true; clearTimeout(readyTimer); show(ui.open, false); ui.ttph.textContent = "";
        if (wantPlay) { post("play"); post("unMute"); clearTimeout(startTimer); startTimer = setTimeout(function () { if (wantPlay && !playing) show(ui.nextBig, true); }, START_TIMEOUT); } break;
      case "onStateChange":
        if (d.value === 1) { playing = true; lastErr = "ok"; clearTimeout(startTimer); show(ui.nextBig, false); setState("playing"); }
        else if (d.value === 2) { playing = false; if (started) setState("paused"); }
        else if (d.value === 0) { playing = false; next(true); }
        break;
      case "onCurrentTime": var v = d.value || {}; if (typeof v.currentTime === "number") { if (has3d && window.OrbMusic3D.sync) window.OrbMusic3D.sync(v.currentTime);
          var ch = ui.q.children[idx]; if (ch && ch.firstChild && typeof v.duration === "number" && v.duration > 0) ch.firstChild.style.width = Math.min(100, v.currentTime / v.duration * 100).toFixed(1) + "%"; } break;
      case "onPlayerError": var c = d.value && d.value.errorCode; lastErr = c;
        if (c === 3002) show(ui.nextBig, true); else failTT(); break;
    }
  }

  /* ---------- rendering ---------- */
  function renderQueue() {
    ui.q.textContent = "";
    tracks.forEach(function (t, i) { var c = mk("button", "omp-chip" + (i === idx ? " on" : ""), ui.q); c.type = "button"; mk("b", "", c); c.appendChild(document.createTextNode((i + 1) + " · " + shortTitle(t.title || ""))); c.setAttribute("title", t.title || "");
      if (i === idx) c.setAttribute("aria-current", "true"); on(c, "click", function () { play(i); }); });
    var on0 = ui.q.children[idx]; if (on0 && on0.scrollIntoView && ui.q.scrollWidth > ui.q.clientWidth) ui.q.scrollLeft = on0.offsetLeft - 20;
  }
  function shortTitle(s) { var i = s.indexOf(" ("); return i > 0 ? s.slice(0, i) : s; }
  function renderInfo() {
    var t = tracks[idx], x = X(); ui.rad.textContent = "";
    if (!t) { txt(ui.title, null); txt(ui.meta, null); txt(ui.style, null); return; }
    txt(ui.title, t.title || null);
    var bpm = typeof t.bpm === "number" ? t.bpm + " " + x.bpm : x.notempo, d = fmtDate(t.date);
    txt(ui.meta, [d, bpm].filter(Boolean).join("  ·  "));
    txt(ui.style, typeof t.style === "string" && t.style ? t.style : null);
    (Array.isArray(t.radars) ? t.radars : []).forEach(function (r) { if (!HUE.hasOwnProperty(r)) return; var s = mk("span", "", ui.rad), i = mk("i", "", s); i.style.background = i.style.color = "hsl(" + HUE[r] + ",90%,60%)"; s.appendChild(document.createTextNode(x.radars[r])); });
    show(ui.rad, ui.rad.childNodes.length > 0);
  }
  function lyricLines(t) {
    var L = t && t.lyrics; if (!L) return null; if (typeof L === "string") return L.split("\n"); if (Array.isArray(L)) return L;
    if (typeof L === "object") { var l = lang(), keys = Object.keys(L).filter(function (k) { return Array.isArray(L[k]) || typeof L[k] === "string"; }); if (!keys.length) return null;
      var k = keys.indexOf(l) >= 0 ? l : (Array.isArray(t.languages) && keys.indexOf(t.languages[0]) >= 0 ? t.languages[0] : keys[0]); return typeof L[k] === "string" ? L[k].split("\n") : L[k]; }
    return null;
  }
  function renderLyrics() {
    var lines = lyricLines(tracks[idx]); show(ui.lb, !!(lines && lines.length)); ui.lb.textContent = lyrOpen ? X().hide : X().lyrics; ui.lb.setAttribute("aria-expanded", lyrOpen ? "true" : "false");
    ui.ly.textContent = ""; ui.ly.hidden = !(lyrOpen && lines && lines.length); if (ui.ly.hidden) return;
    lines.forEach(function (s) { s = String(s == null ? "" : s); if (!s.trim()) { mk("div", "gap", ui.ly); return; } mk("div", /^\s*[\[(]/.test(s) ? "tag" : "", ui.ly, s); });
  }
  function select(i, autoplay) {
    if (!tracks.length) return; idx = ((i % tracks.length) + tracks.length) % tracks.length; var t = tracks[idx];
    playing = false; show(ui.nextBig, false); renderQueue(); renderInfo(); renderLyrics();
    if (has3d) window.OrbMusic3D.setTrack(t);
    mountTT(autoplay);
    if (cb.onTrack) try { cb.onTrack(t, idx); } catch (e) {}
  }

  /* ---------- public ---------- */
  function load(music) {
    var list = music && Array.isArray(music.tracks) ? music.tracks.filter(function (t) { return t && validId(t.id); }) : [];
    var curId = tracks[idx] ? String(tracks[idx].id) : null, first = !tracks.length;
    var seen = {}; tracks = list.filter(function (t) { var k = String(t.id); if (seen[k]) return false; seen[k] = 1; return true; });
    if (!tracks.length) { idx = 0; show(ui.nodata, true); show(ui.listen, false); renderQueue(); renderInfo(); renderLyrics(); if (has3d) window.OrbMusic3D.setTrack(null); mountTT(false); setState("idle"); return false; }
    show(ui.nodata, false);
    if (first || curId == null) { show(ui.listen, !started); select(0, false); setState(started ? lastState : "idle"); return true; }
    var ni = -1; tracks.forEach(function (t, i) { if (String(t.id) === curId) ni = i; });
    if (ni >= 0) { idx = ni; tracks[idx] = tracks[ni]; renderQueue(); renderInfo(); renderLyrics(); } // new tracks join the queue, current keeps playing
    else select(Math.min(idx, tracks.length - 1), started);
    return true;
  }
  function play(i) { if (!tracks.length) return; started = true; wantPlay = true; show(ui.listen, false); select(i == null ? idx : i, true); setState("playing"); }
  function next(auto) { if (!tracks.length) return; if (!started) { select(idx + 1, false); return; } play(idx + 1); }
  function prev() { if (!tracks.length) return; if (!started) { select(idx - 1, false); return; } play(idx - 1); }
  function toggle() {
    if (!tracks.length) return; if (!started) { play(idx); return; }
    if (lastState === "playing") { wantPlay = false; post("pause"); setState("paused"); }
    else { wantPlay = true; if (ttReady) { post("play"); post("unMute"); } else if (!ttFailed) mountTT(true); setState("playing"); }
  }
  function init(el, opts) {
    if (!el) return false; destroy(); opts = opts || {}; cb = { onTrack: opts.onTrack, onState: opts.onState }; embed = opts.embed !== false;
    build(el); has3d = !!(window.OrbMusic3D && window.OrbMusic3D.init(ui.holo)); lastState = null; setState("idle"); return true;
  }
  function destroy() { clearTimers(); listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2]); }); listeners = []; if (has3d) window.OrbMusic3D.destroy(); has3d = false;
    if (root) { root.textContent = ""; root.classList.remove("omp"); } ifr = null; tracks = []; idx = 0; started = playing = wantPlay = false; }
  function stats() { return { tracks: tracks.length, index: idx, id: tracks[idx] ? tracks[idx].id : null, started: started, playing: playing, state: lastState, ttReady: ttReady, ttFailed: ttFailed, lastError: lastErr, hologram: has3d ? window.OrbMusic3D.stats() : null }; }
  window.OrbMusicPlayer = { init: init, load: load, play: play, next: function () { next(); }, prev: prev, toggle: toggle, stats: stats, destroy: destroy };
})();
