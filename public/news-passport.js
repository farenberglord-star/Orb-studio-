/* «Проверить новость» на главной: поле для ссылки → паспорт новости (POST /api/v1/passport).
   Язык берётся из <html lang> (ru / de / en). Весь чужой текст выводится только через textContent, ссылки только http(s). */
(function () {
  "use strict";
  var box = document.getElementById("npBox"); if (!box) return;
  var L = (document.documentElement.lang || "ru").slice(0, 2); if (L !== "ru" && L !== "de" && L !== "en") L = "ru";
  var T = {
    ru: { go: "Проверить", busy: "Проверяю…", working: "Это занимает до минуты.", st: ["Читаю страницу", "Ищу независимые источники", "Сверяю числа и даты", "Собираю паспорт"], sec: "с", confirmed: "Подтверждено", exaggerated: "Преувеличено", opinions: "Мнения", unverified: "Не проверено", missing: "Чего не хватает", original: "Первоисточник", old: "Старое под видом нового", since: "уже было", sources: "Источники", copy: "Скопировать JSON", copied: "Скопировано", share: "Поделиться в X", again: "Проверено", cached: "из кэша (до 24 часов)", fresh: "проверено только что", nodate: "дата не найдена", pub: "опубликовано", counts: "проверяемых утверждений", of: "подтверждено", none: "Ничего не найдено", netErr: "Не удалось связаться с сервером. Попробуйте ещё раз.", badUrl: "Вставьте ссылку на новость (http или https).", linkNotChecked: "ссылка не проверялась", rule: "Паспорт показывает, насколько статья выдерживает сверку с независимыми источниками, найденными поиском в момент проверки. «Не проверено» значит, что независимый источник не найден, а не что утверждение ложно. Это не приговор об истине." },
    de: { go: "Prüfen", busy: "Prüfe …", working: "Das dauert bis zu einer Minute.", st: ["Lese die Seite", "Suche unabhängige Quellen", "Gleiche Zahlen und Daten ab", "Erstelle den Pass"], sec: "s", confirmed: "Bestätigt", exaggerated: "Übertrieben", opinions: "Meinungen", unverified: "Nicht geprüft", missing: "Was fehlt", original: "Ursprungsquelle", old: "Altes als neu verkauft", since: "gab es schon", sources: "Quellen", copy: "JSON kopieren", copied: "Kopiert", share: "Auf X teilen", again: "Geprüft", cached: "aus dem Cache (bis 24 Stunden)", fresh: "gerade geprüft", nodate: "Datum nicht gefunden", pub: "veröffentlicht", counts: "prüfbare Aussagen", of: "bestätigt", none: "Nichts gefunden", netErr: "Server nicht erreichbar. Bitte erneut versuchen.", badUrl: "Link zu einer Nachricht einfügen (http oder https).", linkNotChecked: "Link nicht geprüft", rule: "Der Pass zeigt, wie weit ein Artikel dem Abgleich mit unabhängigen Quellen standhält, die zum Zeitpunkt der Prüfung per Suche gefunden wurden. „Nicht geprüft“ heißt: keine unabhängige Quelle gefunden, nicht: falsch. Es ist kein Urteil über Wahrheit." },
    en: { go: "Check", busy: "Checking…", working: "This takes up to a minute.", st: ["Reading the page", "Searching independent sources", "Matching numbers and dates", "Building the passport"], sec: "s", confirmed: "Confirmed", exaggerated: "Exaggerated", opinions: "Opinions", unverified: "Not verified", missing: "What is missing", original: "Original source", old: "Old news presented as new", since: "already happened", sources: "Sources", copy: "Copy JSON", copied: "Copied", share: "Share on X", again: "Checked", cached: "from cache (up to 24 hours)", fresh: "checked just now", nodate: "date not found", pub: "published", counts: "checkable claims", of: "confirmed", none: "Nothing found", netErr: "Could not reach the server. Please try again.", badUrl: "Paste a link to a news article (http or https).", linkNotChecked: "link not checked", rule: "The passport shows how far an article holds up against independent sources found by search at the time of the check. “Not verified” means no independent source was found, not that the claim is false. It is not a verdict on truth." }
  }[L];
  var EN = { nothing_to_check: "nothing checkable found", contains_errors: "contains errors", partly_exaggerated: "partly exaggerated", mostly_confirmed: "mostly confirmed", partly_verified: "partly verified", mostly_unverified: "mostly unverified", not_checked: "not checked" };
  var form = document.getElementById("npForm"), input = document.getElementById("npUrl"), btn = document.getElementById("npGo"), out = document.getElementById("npOut");
  var lastJson = null, timer = null, ctl = null;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function safeHref(u) { return /^https?:\/\//i.test(String(u || "")) ? String(u) : null; }
  function link(url, text) { var h = safeHref(url); if (!h) return el("span", "np-nolink", text || ""); var a = el("a", null, text || h); a.href = h; a.target = "_blank"; a.rel = "noopener noreferrer nofollow ugc"; return a; }
  function srcLine(list) {
    if (!list || !list.length) return null; var p = el("p", "np-src"); p.appendChild(document.createTextNode(T.sources + ": "));
    list.forEach(function (s, i) { if (i) p.appendChild(document.createTextNode(" · ")); p.appendChild(link(s.url, (s.host || "") + (s.title ? " — " + s.title.slice(0, 70) : ""))); }); return p;
  }
  function section(cls, title, items, render) {
    if (!items || !items.length) return null; var s = el("section", "np-sec " + cls); s.appendChild(el("h3", null, title + " (" + items.length + ")"));
    var ul = el("ul"); items.forEach(function (it) { var li = el("li"); render(li, it); ul.appendChild(li); }); s.appendChild(ul); return s;
  }
  function claim(li, c) {
    var q = el("blockquote", "np-q", c.text); li.appendChild(q);
    if (c.who) li.appendChild(el("p", "np-who", c.who));
    if (c.note) li.appendChild(el("p", "np-note", c.note));
    var s = srcLine(c.sources); if (s) li.appendChild(s);
  }
  function setBusy(on, done) {
    btn.disabled = on; input.readOnly = on; btn.textContent = on ? T.busy : T.go; clearInterval(timer);
    if (!on) return;
    var t0 = Date.now(), w = el("div", "np-laser"), lab = el("p", "np-laser-l"), tr = el("div", "np-laser-t"), fill = el("i", "np-laser-f"), pct = el("span", "np-laser-p");
    tr.appendChild(fill); w.appendChild(lab); w.appendChild(tr); w.appendChild(pct); out.textContent = ""; out.appendChild(w);
    w.setAttribute("role", "progressbar"); w.setAttribute("aria-valuemin", "0"); w.setAttribute("aria-valuemax", "100");
    var tick = function () { var sec = (Date.now() - t0) / 1000, p = 93 * (1 - Math.exp(-sec / 24)), i = p < 22 ? 0 : p < 55 ? 1 : p < 80 ? 2 : 3;
      fill.style.width = p.toFixed(1) + "%"; pct.textContent = Math.round(p) + "%"; w.setAttribute("aria-valuenow", Math.round(p));
      lab.textContent = "▸ " + T.st[i] + " · " + T.working + " " + Math.round(sec) + " " + T.sec; };
    tick(); timer = setInterval(tick, 400);
  }
  function render(d) {
    out.textContent = ""; lastJson = d;
    var card = el("div", "np-card");
    if (d.status !== "ok") {
      card.appendChild(el("p", "np-chip np-v-not_checked", d.verdict_label || ""));
      card.appendChild(el("p", "np-msg", d.message || d.error || T.netErr)); out.appendChild(card); return;
    }
    var f = d.final || {}, head = el("div", "np-head");
    head.appendChild(el("p", "np-chip np-v-" + (f.verdict || "none"), f.label || d.verdict_label || ""));
    var meta = [d.source && d.source.name, d.published ? T.pub + " " + new Date(d.published).toLocaleString(L === "ru" ? "ru-RU" : L === "de" ? "de-DE" : "en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : T.nodate];
    head.appendChild(el("p", "np-meta", meta.filter(Boolean).join(" · "))); card.appendChild(head);
    if (d.title) card.appendChild(el("h3", "np-title", d.title));
    if (d.summary) card.appendChild(el("p", "np-sum", d.summary));
    if (f.counts) card.appendChild(el("p", "np-counts", f.counts.confirmed + " / " + f.counts.checkable + " " + T.counts + " — " + T.of + (f.counts.exaggerated + f.counts.contradicted ? " · " + T.exaggerated.toLowerCase() + ": " + (f.counts.exaggerated + f.counts.contradicted) : "") + (f.counts.unverified ? " · " + T.unverified.toLowerCase() + ": " + f.counts.unverified : "")));
    if (d.freshness && d.freshness.old_as_new) {
      var o = el("div", "np-old"); o.appendChild(el("strong", null, T.old + ": " + T.since + " " + d.freshness.earlier_date)); if (d.freshness.note) o.appendChild(el("p", "np-note", d.freshness.note)); var s0 = srcLine(d.freshness.sources); if (s0) o.appendChild(s0); card.appendChild(o);
    }
    [section("np-ok", "✓ " + T.confirmed, d.confirmed, claim), section("np-over", "⚠ " + T.exaggerated, d.exaggerated, claim), section("np-op", "💬 " + T.opinions, d.opinions, claim), section("np-unv", "? " + T.unverified, d.unverified, claim),
      section("np-miss", T.missing, d.missing, function (li, t) { li.textContent = t; })].forEach(function (s) { if (s) card.appendChild(s); });
    if (d.original_source) { var os = el("div", "np-orig"); os.appendChild(el("strong", null, T.original + ": ")); os.appendChild(d.original_source.url ? link(d.original_source.url, d.original_source.name || d.original_source.url) : el("span", null, d.original_source.name || "")); if (d.original_source.link_verified === false) os.appendChild(el("em", null, " (" + T.linkNotChecked + ")")); if (d.original_source.note) os.appendChild(el("p", "np-note", d.original_source.note)); card.appendChild(os); }
    var foot = el("div", "np-foot");
    foot.appendChild(el("span", "np-cache", (d.cache && d.cache.hit ? T.cached : T.fresh)));
    var cb = el("button", "np-btn", T.copy); cb.type = "button"; cb.addEventListener("click", function () { try { navigator.clipboard.writeText(JSON.stringify(lastJson, null, 2)).then(function () { cb.textContent = T.copied; setTimeout(function () { cb.textContent = T.copy; }, 1500); }); } catch (e) {} }); foot.appendChild(cb);
    var txt = "I checked a news article with the Orb Studio news passport: " + (EN[f.verdict] || "checked") + ". Paste any link and get facts, opinions, exaggerations and sources — free, for people and AI agents.";
    var x = el("a", "np-btn", T.share + " ↗"); x.href = "https://x.com/intent/post?text=" + encodeURIComponent(txt) + "&url=" + encodeURIComponent("https://orbstudio.org/en/"); x.target = "_blank"; x.rel = "noopener noreferrer"; foot.appendChild(x);
    card.appendChild(foot); card.appendChild(el("p", "np-rule", T.rule)); out.appendChild(card);
  }
  function run(u) {
    u = String(u || "").trim(); if (!/^(https?:\/\/)?[^\s/]+\.[^\s]+/i.test(u)) { out.textContent = ""; out.appendChild(el("p", "np-msg", T.badUrl)); return; }
    if (ctl) try { ctl.abort(); } catch (e) {} ctl = new AbortController(); var kill = setTimeout(function () { ctl.abort(); }, 130000); setBusy(true);
    fetch("/api/v1/passport", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: u, lang: L }), signal: ctl.signal })
      .then(function (r) { return r.json().catch(function () { return null; }); })
      .then(function (d) { if (!d) throw new Error("bad"); render(d); })
      .catch(function () { out.textContent = ""; out.appendChild(el("p", "np-msg", T.netErr)); })
      .then(function () { clearTimeout(kill); setBusy(false); });
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); run(input.value); });
  try { var q = new URLSearchParams(location.search).get("check"); if (q) input.value = q.slice(0, 2000); } catch (e) {}
})();
