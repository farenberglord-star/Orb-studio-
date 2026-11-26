// «Спросить круглый стол» на странице /roundtable: ссылка на новость → паспорт новости → Claude спрашивает Gemini, Grok и DeepSeek.
// Выпуск приватный (открывается только по ссылке ?ask=<id>) и не трогает выпуски дня. Чужой текст — только через textContent.
// localStorage — лишь удобство: список своих выпусков в этом браузере (может быть пуст или недоступен).
const T = {
  ru: { h: "Спросить круглый стол", sub: "Дайте ссылку на новость. Orb Studio сначала разберёт её паспортом новости (что подтверждено, что не проверено, где мнения), потом модератор Claude перескажет её строго по паспорту и спросит Gemini, Grok и DeepSeek. Выпуск приватный: его откроет только тот, у кого ссылка, — ей можно поделиться.",
    ph: "Ссылка на новость", go: "На стол", busy: "Готовлю…", steps: ["Паспорт новости: читаю статью и ищу независимые источники", "Claude готовит пересказ и вопрос", "Отвечают Gemini, Grok и DeepSeek", "Claude подводит итог", "Перевод и голоса"],
    min: "Обычно 1–3 минуты. Можно закрыть страницу — выпуск будет по ссылке.", watch: "▶ Смотреть выпуск", share: "Поделиться", copy: "Скопировать ссылку", copied: "Ссылка скопирована", reused: "Эту новость уже приносили за последние сутки — вот тот же выпуск.",
    mine: "Мои выпуски в этом браузере", bad: "Нужна ссылка на новость (http или https).", net: "Нет связи с сервером. Попробуйте ещё раз.", fail: "Не получилось: ", pass: "Паспорт", brought: "Ваш выпуск",
    note: "Ответы — мнения ИИ-моделей, не приговоры и не советы. Не больше 3 новых выпусков в час с одного адреса. Выпуски круглого стола дня идут своим ходом.",
    R: { rate_limited: "лимит — 3 новых выпуска в час с одного адреса.", busy: "на сегодня лимит приватных выпусков исчерпан, попробуйте завтра.", not_configured: "сервис ещё не настроен.", guests_unavailable: "гости не ответили. Попробуйте позже.", timeout: "сборка не успела. Попробуйте ещё раз.", model_error: "сбой модели. Попробуйте ещё раз.", robots_disallow: "сайт просит роботов не читать страницу (robots.txt).", login_or_paywall: "статья за входом или подпиской — пейволлы мы не обходим.", captcha_or_paywall: "вместо статьи капча или пейволл — мы это не обходим.", blocked_by_site: "сайт отклонил запрос.", not_found: "страница не найдена.", no_article_text: "на странице не нашлось текста статьи.", own_site: "это ссылка на сам Orb Studio.", not_a_url: "это не ссылка.", nothing_to_check: "в статье нечего проверить." } },
  de: { h: "Den runden Tisch fragen", sub: "Geben Sie einen Link zu einer Nachricht. Orb Studio prüft sie zuerst mit dem Nachrichtenpass (was bestätigt ist, was ungeprüft, wo Meinungen stehen), dann erzählt Moderator Claude sie streng nach dem Pass nach und fragt Gemini, Grok und DeepSeek. Die Folge ist privat: Nur wer den Link hat, kann sie öffnen — und teilen.",
    ph: "Link zur Nachricht", go: "Auf den Tisch", busy: "Bereite vor …", steps: ["Nachrichtenpass: lese den Artikel und suche unabhängige Quellen", "Claude bereitet Zusammenfassung und Frage vor", "Gemini, Grok und DeepSeek antworten", "Claude zieht Bilanz", "Übersetzung und Stimmen"],
    min: "Meist 1–3 Minuten. Sie können die Seite schließen — die Folge bleibt unter dem Link.", watch: "▶ Folge ansehen", share: "Teilen", copy: "Link kopieren", copied: "Link kopiert", reused: "Diese Nachricht wurde in den letzten 24 Stunden schon gebracht — hier ist dieselbe Folge.",
    mine: "Meine Folgen in diesem Browser", bad: "Bitte einen Link zur Nachricht (http oder https).", net: "Keine Verbindung zum Server. Bitte erneut versuchen.", fail: "Hat nicht geklappt: ", pass: "Pass", brought: "Ihre Folge",
    note: "Antworten sind Ansichten von KI-Modellen, keine Urteile oder Ratschläge. Höchstens 3 neue Folgen pro Stunde und Adresse. Die runden Tische des Tages laufen unabhängig davon.",
    R: { rate_limited: "Limit: 3 neue Folgen pro Stunde und Adresse.", busy: "das Tageslimit privater Folgen ist erreicht, bitte morgen wieder.", not_configured: "der Dienst ist noch nicht eingerichtet.", guests_unavailable: "die Gäste haben nicht geantwortet. Bitte später.", timeout: "die Zusammenstellung kam nicht rechtzeitig. Bitte erneut.", model_error: "Modellfehler. Bitte erneut.", robots_disallow: "die Seite bittet Roboter, sie nicht zu lesen (robots.txt).", login_or_paywall: "der Artikel liegt hinter Login oder Abo — wir umgehen keine Bezahlschranken.", captcha_or_paywall: "statt des Artikels Captcha oder Bezahlschranke — das umgehen wir nicht.", blocked_by_site: "die Seite hat die Anfrage abgelehnt.", not_found: "Seite nicht gefunden.", no_article_text: "kein Artikeltext auf der Seite.", own_site: "das ist ein Link auf Orb Studio selbst.", not_a_url: "das ist kein Link.", nothing_to_check: "im Artikel gibt es nichts zu prüfen." } },
  en: { h: "Ask the round table", sub: "Give a link to a news story. Orb Studio first checks it with the news passport (what is confirmed, what is not verified, where the opinions are), then the moderator Claude retells it strictly by the passport and asks Gemini, Grok and DeepSeek. The episode is private: only people with the link can open it — and you can share it.",
    ph: "Link to the news story", go: "To the table", busy: "Preparing…", steps: ["News passport: reading the article and searching independent sources", "Claude prepares the recap and the question", "Gemini, Grok and DeepSeek answer", "Claude sums up", "Translation and voices"],
    min: "Usually 1–3 minutes. You can close the page — the episode stays at its link.", watch: "▶ Watch the episode", share: "Share", copy: "Copy link", copied: "Link copied", reused: "This story was brought in the last 24 hours — here is the same episode.",
    mine: "My episodes in this browser", bad: "Please give a link to a news story (http or https).", net: "No connection to the server. Please try again.", fail: "Did not work: ", pass: "Passport", brought: "Your episode",
    note: "Answers are views of AI models, not verdicts or advice. At most 3 new episodes per hour per address. The round tables of the day run on their own.",
    R: { rate_limited: "limit is 3 new episodes per hour per address.", busy: "today's limit of private episodes is reached, try tomorrow.", not_configured: "the service is not configured yet.", guests_unavailable: "the guests did not answer. Try later.", timeout: "building took too long. Try again.", model_error: "model error. Try again.", robots_disallow: "the site asks robots not to read the page (robots.txt).", login_or_paywall: "the article is behind a login or subscription — we do not bypass paywalls.", captcha_or_paywall: "a captcha or paywall instead of the article — we do not bypass it.", blocked_by_site: "the site refused the request.", not_found: "page not found.", no_article_text: "no article text on the page.", own_site: "that is a link to Orb Studio itself.", not_a_url: "that is not a link.", nothing_to_check: "nothing checkable in the article." } },
};
const STEP_I = { queued: 0, passport: 0, moderator: 1, guests: 2, closing: 3, translate: 4, done: 5 };
const API = "/api/v1/roundtable/ask", KEY = "orbRtAsks";

function run() {
  const box = document.getElementById("raBox"); if (!box) return;
  const L = ["ru", "de", "en"].includes((document.documentElement.lang || "").slice(0, 2)) ? document.documentElement.lang.slice(0, 2) : "en", t = T[L];
  const $ = (id) => document.getElementById(id), out = $("raOut"), form = $("raForm"), input = $("raUrl"), btn = $("raGo");
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
  $("raT").textContent = t.h; $("raSub").textContent = t.sub; input.placeholder = t.ph; input.setAttribute("aria-label", t.ph); btn.textContent = t.go; $("raNote").textContent = t.note;
  const pageOf = (id) => location.origin + "/" + L + "/roundtable?ask=" + id;
  const mine = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]").filter((x) => x && /^[0-9a-f]{18}$/.test(x.id)); } catch { return []; } };
  const remember = (id, headline) => { try { const l = [{ id, headline: String(headline || "").slice(0, 140), at: Date.now() }, ...mine().filter((x) => x.id !== id)].slice(0, 10); localStorage.setItem(KEY, JSON.stringify(l)); } catch {} showMine(); };
  function showMine() { const ul = $("raMine"), l = mine(); ul.textContent = ""; ul.hidden = !l.length; if (!l.length) return; ul.append(el("li", null, t.mine + ":"));
    for (const x of l) { const li = el("li"), a = el("a", null, x.headline || x.id); a.href = pageOf(x.id); li.append(a); ul.append(li); } }
  let poll = null, t0 = 0;
  function progress(step) {
    const k = STEP_I[step] ?? 0, w = el("div"), bar = el("div", "ra-bar"), fill = el("i"), ol = el("ol", "ra-steps");
    fill.style.width = Math.min(96, 8 + k * 20 + Math.min(12, (Date.now() - t0) / 15000)) + "%"; bar.append(fill);
    t.steps.forEach((s, i) => ol.append(el("li", i < k ? "ok" : i === k ? "on" : "", s)));
    w.append(bar, ol, el("p", "ra-note", t.min + " · " + Math.round((Date.now() - t0) / 1000) + " s")); out.textContent = ""; out.append(w);
  }
  function card(a) {
    out.textContent = ""; const e = a.episode, c = el("div", "ra-card");
    c.append(el("p", "ra-note", t.brought + (a.reused ? " · " + t.reused : "")));
    c.append(el("h3", null, e.headline || ""));
    if (e.passport_check) c.append(el("span", "ra-chip v-" + (e.passport_check.verdict || "none"), t.pass + ": " + (e.passport_check.label || e.passport_check.verdict || "")));
    if (e.moderator_recap) c.append(el("p", "ra-msg", "Claude: " + e.moderator_recap));
    const row = el("div", "ra-row"), url = pageOf(a.id);
    const w = el("a", "ra-btn", t.watch); w.href = url; row.append(w);
    const sh = el("button", "ra-btn ghost", t.share); sh.type = "button";
    const copy = async () => { try { await navigator.clipboard.writeText(url); sh.textContent = t.copied; setTimeout(() => { sh.textContent = t.share; }, 1600); } catch { prompt(t.copy, url); } };
    sh.addEventListener("click", async () => { if (navigator.share) { try { await navigator.share({ title: "Orb Studio · AI Round Table", text: e.headline || "", url }); return; } catch (err) { if (err && err.name === "AbortError") return; } } copy(); });
    const cp = el("button", "ra-btn ghost", t.copy); cp.type = "button"; cp.addEventListener("click", async () => { try { await navigator.clipboard.writeText(url); cp.textContent = t.copied; setTimeout(() => { cp.textContent = t.copy; }, 1600); } catch { prompt(t.copy, url); } });
    row.append(sh, cp); c.append(row); out.append(c); remember(a.id, e.headline);
  }
  function failed(a) { out.textContent = ""; out.append(el("p", "ra-msg", t.fail + ((t.R[a.reason]) || a.message || a.reason || ""))); }
  function busy(on) { btn.disabled = on; input.readOnly = on; btn.textContent = on ? t.busy : t.go; }
  function show(a) {
    if (!a) { failed({ reason: "", message: t.net }); busy(false); return; }
    if (a.status === "ok" && a.episode) { clearTimeout(poll); busy(false); card(a); return; }
    if (a.status === "failed" || a.status === "not_found") { clearTimeout(poll); busy(false); failed(a); return; }
    progress(a.step); clearTimeout(poll);
    if (Date.now() - t0 > 8 * 60e3) { busy(false); return; }
    poll = setTimeout(() => fetch(API + "?id=" + a.id).then((r) => r.json()).then(show).catch(() => { poll = setTimeout(() => show(a), 8000); }), 5000);
  }
  form.addEventListener("submit", (ev) => { ev.preventDefault(); const u = input.value.trim();
    if (!/^(https?:\/\/)?[^\s/]+\.[^\s]+/i.test(u)) { out.textContent = ""; out.append(el("p", "ra-msg", t.bad)); return; }
    busy(true); t0 = Date.now(); progress("queued");
    fetch(API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url: u, lang: L }) }).then((r) => r.json()).then(show).catch(() => show(null)); });
  showMine();
  // открыт приватный выпуск — карточка с кнопками «поделиться» сразу под сценой
  try { const id = new URLSearchParams(location.search).get("ask"); if (/^[0-9a-f]{18}$/.test(id || "")) { t0 = Date.now(); fetch(API + "?id=" + id).then((r) => r.json()).then((a) => { if (a && a.status !== "not_found") show(a); }).catch(() => {}); } } catch {}
  try { const b = new URLSearchParams(location.search).get("bring"); if (b) input.value = b.slice(0, 2000); } catch {}
}
if (typeof document !== "undefined") { if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run(); }
