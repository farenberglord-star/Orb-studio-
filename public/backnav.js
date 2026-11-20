/* Orb Studio: кнопки «← Назад» и «⌂ Главная» на всех страницах, кроме главной.
   «Назад» — на предыдущую страницу сайта; если человек пришёл со стороны (X, WhatsApp, поиск) — на главную.
   Над нижними панелями (dock) поднимается сам; на страницах-студиях (#stage) стоит сверху по центру. */
(function () {
  try {
    if (window.top !== window.self || /[?&]embed=1\b/.test(location.search)) return;
    var p = location.pathname.replace(/\/index\.html$/, "/").replace(/\/+$/, "") || "/";
    if (/^\/(ru|de|en)?$/.test(p) || p === "/" || /^\/admin/.test(p)) return;
    if (document.getElementById("orb-back")) return;
    var L = String(document.documentElement.lang || "ru").slice(0, 2).toLowerCase();
    var T = { ru: ["Назад", "Главная"], de: ["Zurück", "Start"], en: ["Back", "Home"], ro: ["Înapoi", "Acasă"], tr: ["Geri", "Ana sayfa"], ja: ["戻る", "ホーム"] }[L] || ["Back", "Home"];
    var home = { de: "/de/", en: "/en/" }[L] || "/";
    var stage = !!document.getElementById("stage");
    var css = document.createElement("style");
    css.textContent =
      "#orb-back{position:fixed;z-index:60;display:flex;gap:2px;padding:3px;border-radius:999px;background:rgba(5,8,16,.82);border:1px solid rgba(120,200,255,.35);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);box-shadow:0 4px 18px rgba(0,0,0,.45);font:600 13px/1 system-ui,-apple-system,'Segoe UI',sans-serif}" +
      "#orb-back a{display:flex;align-items:center;gap:5px;color:#dfeaff;text-decoration:none;padding:8px 12px;border-radius:999px;min-height:20px;white-space:nowrap}" +
      "#orb-back a:hover,#orb-back a:focus-visible{background:rgba(95,227,255,.16);color:#fff;outline:none}" +
      "#orb-back a:focus-visible{box-shadow:0 0 0 2px #5fe3ff}" +
      "#orb-back .ic{font-size:15px;line-height:1}" +
      "#orb-back.bot{left:max(12px,env(safe-area-inset-left,0px));bottom:calc(var(--orb-back-lift,0px) + max(14px,env(safe-area-inset-bottom,0px)))}" +
      "#orb-back.inl{position:relative;display:inline-flex;vertical-align:middle;margin:0 8px 0 0;padding:2px;pointer-events:auto;letter-spacing:0;text-transform:none;font-size:12px;box-shadow:none}" +
      "#orb-back.inl .tx{display:none}#orb-back.inl a{padding:6px 9px}#orb-back.inl .ic{font-size:14px}" +
      ".orb-back-row{display:flex;align-items:center;flex-wrap:wrap;row-gap:4px}" +
      "@media print{#orb-back{display:none}}";
    document.head.appendChild(css);
    var nav = document.createElement("nav");
    nav.id = "orb-back"; nav.className = stage ? "inl" : "bot"; nav.setAttribute("aria-label", T[0] + " / " + T[1]);
    var back = document.createElement("a"); back.href = home; back.innerHTML = '<span class="ic" aria-hidden="true">←</span><span class="tx"></span>'; back.lastChild.textContent = T[0]; back.title = T[0]; back.setAttribute("aria-label", T[0]);
    var hm = document.createElement("a"); hm.href = home; hm.innerHTML = '<span class="ic" aria-hidden="true">⌂</span><span class="tx"></span>'; hm.lastChild.textContent = T[1]; hm.title = T[1]; hm.setAttribute("aria-label", T[1]);
    back.addEventListener("click", function (e) {
      var same = false; try { same = !!document.referrer && new URL(document.referrer).origin === location.origin; } catch (x) {}
      if (same && history.length > 1) { e.preventDefault(); history.back(); }
    });
    nav.appendChild(back); nav.appendChild(hm);
    // в студиях — компактные значки прямо перед надписью ORB STUDIO в верхнем левом углу сцены
    var put = function () {
      if (!document.body) return;
      var br = stage && document.querySelector("#stage .top .brand");
      if (br) { var row = document.createElement("div"); row.className = "orb-back-row"; br.parentNode.insertBefore(row, br); row.appendChild(nav); row.appendChild(br); }
      else { if (stage) nav.className = "bot"; document.body.appendChild(nav); }
      lift();
    };
    // поднять над нижними закреплёнными панелями (dock и т. п.)
    var lift = function () {
      if (stage) return;
      var h = 0;
      document.querySelectorAll("body *").forEach(function (el) {
        if (el === nav || nav.contains(el)) return;
        var cs = getComputedStyle(el); if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden") return;
        var r = el.getBoundingClientRect(); if (r.height < 10 || r.height > innerHeight * 0.5 || r.width < innerWidth * 0.5) return;
        if (Math.abs(r.bottom - innerHeight) < 4) h = Math.max(h, r.height);
      });
      nav.style.setProperty("--orb-back-lift", h ? Math.round(h) + "px" : "0px");
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", put); else put();
    addEventListener("load", lift); addEventListener("resize", lift); setTimeout(lift, 2500);
  } catch (e) {}
})();
