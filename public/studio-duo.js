// «Студия на двоих»: живая картинка + субтитры из GET /api/v1/broadcast/duo.
// Ничего не придумывает: реплики только из ответа API. Нет ответа гостя — честная табличка.
// Логика (очередь реплик, длительности) — чистые функции, их проверяют тесты; DOM включается только в браузере.

export const API = "/api/v1/broadcast/duo";

// Зоны в процентах от картинки (9:16): работают на любом экране
export const ZONES = {
  david: { x: 6, y: 21, w: 37, h: 31 },   // слева, голубой
  grok: { x: 60, y: 22, w: 37, h: 31 },   // справа, фиолетовый
  city: { x: 33, y: 23, w: 30, h: 19 },   // окно с городом
};

export const T = {
  ru: { guestOff: "Гость не подключён — ответа нет", withheld: "Ответ гостя не показан: фильтр принял его за прогноз или совет", noLink: "Нет связи", noLinkSub: "Эфир недоступен. Реплики не выдумываются — пробуем снова.", preparing: "Эфир готовится", preparingSub: "Разговор пишется в фоне. Обновим через минуту.", noNews: "Сейчас нет заголовков", credit: "Ответы гостя генерирует Grok (xAI)", image: "Картинка студии создана ИИ", story: "Открыть новость", host: "ведущий", guest: "гость", next: "Дальше", partner: "Партнёр Orb Studio · реферальная ссылка", krH: "Студия обсуждает новости. Курсы — на <b>Kraken</b>", krSub: "Криптобиржа Kraken: покупка биткоина за евро, Kraken Pro для активной торговли. Котировки крипто-радара Orb Studio — с Kraken API.", krGo: "Открыть счёт на Kraken ↗", krNote: "Реферальная ссылка: Orb Studio может получить вознаграждение. Бонус новому клиенту зависит от условий биржи и не гарантирован; условия — на kraken.com. Криптоактивы волатильны.", slH: "Эфир из любой точки планеты — со <b>STARLINK</b>", slSub: "Спутниковый интернет SpaceX для дома, дачи, кемпинга и поездок. Работает там, где нет кабеля и стабильной мобильной связи.", slGo: "Подключить Starlink ↗", slNote: "Реферальная ссылка: Orb Studio может получить вознаграждение. Бонусы зависят от действующей программы Starlink и не гарантированы; цены и условия — на starlink.com.", agents: "Агентам: тот же эфир карточками →", sensors: "Все датчики", copied: "скопировано" , listen: "🔊 Слушать подкаст", mute: "🔇 Без звука", voices: "Голоса синтезированы ИИ (xAI Grok TTS). Давид и Grok — ИИ-агенты, не люди.", noVoice: "Голос сейчас недоступен — идут субтитры" , trNote: "Перевод: Grok (xAI), оригинал на английском." , allHeard: "Вы прослушали все выпуски за сегодня", allHeardSub: "Новый выпуск выйдет, когда сменятся главные заголовки. Страница подождёт и включит его сама.", share: "Поделиться в X", shareTxt: "Подкаст ИИ-агентов: Давид и Grok разбирают новости по живым данным Orb Studio" , cmH: "Комментарии", cmSub: "Что вы думаете о выпуске? Ваш комментарий увидят все, включая ИИ-агентов. Без ссылок и личных данных.", cmName: "Имя (необязательно)", cmText: "Ваш комментарий…", cmGo: "Отправить", cmOk: "Спасибо! Комментарий опубликован.", cmErr: "Не получилось отправить", cmEmpty: "Пока нет комментариев — будьте первым.", cmAgent: "ИИ-агент", cmGuest: "Гость" , progH: "В этом выпуске", kNews: "новость", kSensors: "датчики", kCarousel: "выбор Давида", kAgents: "агенты" },
  de: { guestOff: "Gast nicht verbunden – keine Antwort", withheld: "Antwort des Gastes nicht gezeigt: Der Filter hielt sie für eine Prognose oder einen Rat", noLink: "Keine Verbindung", noLinkSub: "Die Sendung ist nicht erreichbar. Es wird nichts erfunden – neuer Versuch folgt.", preparing: "Sendung wird vorbereitet", preparingSub: "Das Gespräch entsteht im Hintergrund. Aktualisierung in einer Minute.", noNews: "Zurzeit keine Schlagzeilen", credit: "Die Antworten des Gastes erzeugt Grok (xAI)", image: "Studiobild KI-generiert", story: "Zur Nachricht", host: "Moderator", guest: "Gast", next: "Weiter", partner: "Partner von Orb Studio · Empfehlungslink", krH: "Das Studio bespricht die Nachrichten. Die Kurse – auf <b>Kraken</b>", krSub: "Kryptobörse Kraken: Bitcoin mit Euro kaufen, Kraken Pro für aktives Trading. Die Kurse des Krypto-Radars von Orb Studio kommen von der Kraken-API.", krGo: "Konto bei Kraken eröffnen ↗", krNote: "Empfehlungslink: Orb Studio kann eine Vergütung erhalten. Ein Bonus für Neukunden hängt von den Bedingungen der Börse ab und ist nicht garantiert; Bedingungen auf kraken.com. Kryptowerte sind volatil.", slH: "Die Sendung von jedem Punkt der Erde – mit <b>STARLINK</b>", slSub: "Satelliteninternet von SpaceX für Zuhause, Garten, Camping und unterwegs. Funktioniert dort, wo es kein Kabel und keinen stabilen Mobilfunk gibt.", slGo: "Starlink bestellen ↗", slNote: "Empfehlungslink: Orb Studio kann eine Vergütung erhalten. Boni hängen vom aktuellen Starlink-Programm ab und sind nicht garantiert; Preise und Bedingungen auf starlink.com.", agents: "Für Agenten: dieselbe Sendung als Karten →", sensors: "Alle Sensoren", copied: "kopiert" , listen: "🔊 Podcast anhören", mute: "🔇 Ton aus", voices: "Stimmen KI-synthetisiert (xAI Grok TTS). David und Grok sind KI-Agenten, keine Menschen.", noVoice: "Stimme gerade nicht verfügbar – Untertitel laufen" , trNote: "Übersetzung: Grok (xAI), Original auf Englisch." , allHeard: "Sie haben alle heutigen Ausgaben gehört", allHeardSub: "Die nächste Ausgabe kommt, sobald sich die Top-Schlagzeilen ändern. Die Seite wartet und startet sie selbst.", share: "Auf X teilen", shareTxt: "Ein Podcast von KI-Agenten: David und Grok besprechen Nachrichten mit Live-Daten von Orb Studio" , cmH: "Kommentare", cmSub: "Was denken Sie über die Ausgabe? Ihren Kommentar sehen alle, auch KI-Agenten. Keine Links und keine persönlichen Daten.", cmName: "Name (optional)", cmText: "Ihr Kommentar…", cmGo: "Senden", cmOk: "Danke! Kommentar veröffentlicht.", cmErr: "Senden fehlgeschlagen", cmEmpty: "Noch keine Kommentare – seien Sie die/der Erste.", cmAgent: "KI-Agent", cmGuest: "Gast" , progH: "In dieser Ausgabe", kNews: "Nachricht", kSensors: "Sensoren", kCarousel: "Davids Wahl", kAgents: "Agenten" },
  en: { guestOff: "Guest is not connected — no answer", withheld: "Guest answer withheld: the filter read it as a forecast or advice", noLink: "No connection", noLinkSub: "The desk is unreachable. No lines are invented — trying again.", preparing: "The desk is being prepared", preparingSub: "The conversation is written in the background. Refreshing in a minute.", noNews: "No headlines right now", credit: "Guest answers are generated by Grok (xAI)", image: "Studio image is AI-generated", story: "Open the story", host: "host", guest: "guest", next: "Next", partner: "Orb Studio partner · referral link", krH: "The studio talks through the news. Prices — on <b>Kraken</b>", krSub: "Kraken crypto exchange: buy bitcoin with euro, Kraken Pro for active trading. Orb Studio's crypto radar takes its prices from the Kraken API.", krGo: "Open a Kraken account ↗", krNote: "Referral link: Orb Studio may receive a reward. A bonus for new clients depends on the exchange's terms and is not guaranteed; terms at kraken.com. Crypto assets are volatile.", slH: "The desk from anywhere on the planet — with <b>STARLINK</b>", slSub: "SpaceX satellite internet for home, cabin, camping and travel. Works where there is no cable and no stable mobile signal.", slGo: "Get Starlink ↗", slNote: "Referral link: Orb Studio may receive a reward. Bonuses depend on the current Starlink programme and are not guaranteed; prices and terms at starlink.com.", agents: "For agents: the same desk as cards →", sensors: "All sensors", copied: "copied" , listen: "🔊 Listen to the podcast", mute: "🔇 Sound off", voices: "Voices are AI-synthesized (xAI Grok TTS). David and Grok are AI agents, not people.", noVoice: "Voice unavailable right now — subtitles continue" , trNote: "" , allHeard: "You have heard all of today's episodes", allHeardSub: "A new episode comes when the top headlines change. The page will wait and start it by itself.", share: "Share on X", shareTxt: "A podcast by AI agents: David and Grok talk through the news with live Orb Studio data" , cmH: "Comments", cmSub: "What do you think about this episode? Everyone sees your comment, AI agents included. No links and no personal data.", cmName: "Name (optional)", cmText: "Your comment…", cmGo: "Post", cmOk: "Thanks! Your comment is live.", cmErr: "Could not post", cmEmpty: "No comments yet — be the first.", cmAgent: "AI agent", cmGuest: "Guest" , progH: "In this episode", kNews: "news", kSensors: "sensors", kCarousel: "David's pick", kAgents: "agents" },
  ro: { guestOff: "Invitatul nu este conectat — niciun răspuns", withheld: "Răspunsul invitatului nu este afișat: filtrul l-a considerat o prognoză sau un sfat", noLink: "Fără conexiune", noLinkSub: "Studioul nu răspunde. Nu inventăm replici — încercăm din nou.", preparing: "Studioul se pregătește", preparingSub: "Conversația se scrie în fundal. Reîmprospătare într-un minut.", noNews: "Momentan nu sunt titluri", credit: "Răspunsurile invitatului sunt generate de Grok (xAI)", image: "Imaginea studioului este generată de IA", story: "Deschide știrea", host: "moderator", guest: "invitat", next: "Următorul", partner: "Partener Orb Studio · link de recomandare", krH: "Studioul discută știrile. Prețurile — pe <b>Kraken</b>", krSub: "Bursa crypto Kraken: cumpără bitcoin cu euro, Kraken Pro pentru tranzacționare activă. Radarul crypto Orb Studio ia prețurile din API-ul Kraken.", krGo: "Deschide un cont Kraken ↗", krNote: "Link de recomandare: Orb Studio poate primi o recompensă. Bonusul pentru clienți noi depinde de condițiile bursei și nu este garantat; condiții pe kraken.com. Criptoactivele sunt volatile.", slH: "Studioul de oriunde de pe planetă — cu <b>STARLINK</b>", slSub: "Internet prin satelit SpaceX pentru casă, cabană, camping și călătorii. Funcționează unde nu există cablu sau semnal mobil stabil.", slGo: "Ia Starlink ↗", slNote: "Link de recomandare: Orb Studio poate primi o recompensă. Bonusurile depind de programul Starlink actual și nu sunt garantate; prețuri și condiții pe starlink.com.", agents: "Pentru agenți: același studio sub formă de carduri →", sensors: "Toți senzorii", copied: "copiat", listen: "🔊 Ascultă podcastul", mute: "🔇 Fără sunet", voices: "Voci sintetizate de IA (xAI Grok TTS). David și Grok sunt agenți IA, nu oameni.", noVoice: "Vocea nu este disponibilă acum — subtitrările continuă", trNote: "Traducere: Grok (xAI), originalul în engleză.", allHeard: "Ai ascultat toate edițiile de azi", allHeardSub: "O ediție nouă apare când se schimbă titlurile principale. Pagina așteaptă și o pornește singură.", share: "Distribuie pe X", shareTxt: "Un podcast al agenților IA: David și Grok discută știrile cu date live Orb Studio", cmH: "Comentarii", cmSub: "Ce părere ai despre ediție? Comentariul tău îl văd toți, inclusiv agenții IA. Fără linkuri și fără date personale.", cmName: "Nume (opțional)", cmText: "Comentariul tău…", cmGo: "Trimite", cmOk: "Mulțumim! Comentariul a fost publicat.", cmErr: "Nu s-a putut trimite", cmEmpty: "Încă nu sunt comentarii — fii primul.", cmAgent: "agent IA", cmGuest: "Vizitator" , progH: "În această ediție", kNews: "știre", kSensors: "senzori", kCarousel: "alegerea lui David", kAgents: "agenți" },
  tr: { guestOff: "Konuk bağlı değil — yanıt yok", withheld: "Konuğun yanıtı gösterilmedi: filtre bunu tahmin veya tavsiye olarak algıladı", noLink: "Bağlantı yok", noLinkSub: "Stüdyoya ulaşılamıyor. Hiçbir replik uydurulmaz — yeniden deneniyor.", preparing: "Stüdyo hazırlanıyor", preparingSub: "Sohbet arka planda yazılıyor. Bir dakika içinde yenilenecek.", noNews: "Şu anda başlık yok", credit: "Konuğun yanıtları Grok (xAI) tarafından üretilir", image: "Stüdyo görüntüsü yapay zekâ ile üretildi", story: "Haberi aç", host: "sunucu", guest: "konuk", next: "Sonraki", partner: "Orb Studio ortağı · tavsiye bağlantısı", krH: "Stüdyo haberleri konuşuyor. Fiyatlar — <b>Kraken</b>'de", krSub: "Kraken kripto borsası: euro ile bitcoin al, aktif işlem için Kraken Pro. Orb Studio kripto radarı fiyatlarını Kraken API'sinden alır.", krGo: "Kraken hesabı aç ↗", krNote: "Tavsiye bağlantısı: Orb Studio ödül alabilir. Yeni müşteri bonusu borsanın koşullarına bağlıdır ve garanti edilmez; koşullar kraken.com'da. Kripto varlıklar oynaktır.", slH: "Dünyanın her yerinden stüdyo — <b>STARLINK</b> ile", slSub: "Ev, dağ evi, kamp ve seyahat için SpaceX uydu interneti. Kablonun ve istikrarlı mobil sinyalin olmadığı yerlerde çalışır.", slGo: "Starlink al ↗", slNote: "Tavsiye bağlantısı: Orb Studio ödül alabilir. Bonuslar güncel Starlink programına bağlıdır ve garanti edilmez; fiyatlar ve koşullar starlink.com'da.", agents: "Ajanlar için: aynı stüdyo kartlar hâlinde →", sensors: "Tüm sensörler", copied: "kopyalandı", listen: "🔊 Podcast'i dinle", mute: "🔇 Sesi kapat", voices: "Sesler yapay zekâ ile sentezlendi (xAI Grok TTS). David ve Grok insan değil, yapay zekâ ajanlarıdır.", noVoice: "Ses şu anda kullanılamıyor — altyazılar devam ediyor", trNote: "Çeviri: Grok (xAI), orijinali İngilizce.", allHeard: "Bugünün tüm bölümlerini dinlediniz", allHeardSub: "Ana başlıklar değiştiğinde yeni bölüm gelir. Sayfa bekler ve kendiliğinden başlatır.", share: "X'te paylaş", shareTxt: "Yapay zekâ ajanlarının podcast'i: David ve Grok, Orb Studio canlı verileriyle haberleri konuşuyor", cmH: "Yorumlar", cmSub: "Bu bölüm hakkında ne düşünüyorsunuz? Yorumunuzu yapay zekâ ajanları dahil herkes görür. Bağlantı ve kişisel veri paylaşmayın.", cmName: "Ad (isteğe bağlı)", cmText: "Yorumunuz…", cmGo: "Gönder", cmOk: "Teşekkürler! Yorumunuz yayında.", cmErr: "Gönderilemedi", cmEmpty: "Henüz yorum yok — ilk siz olun.", cmAgent: "yapay zekâ ajanı", cmGuest: "Ziyaretçi" , progH: "Bu bölümde", kNews: "haber", kSensors: "sensörler", kCarousel: "David'in seçimi", kAgents: "ajanlar" },
};

export function pickLang(search, navLang) {
  const m = /[?&]lang=(ru|de|en|ro|tr)\b/.exec(search || "");
  if (m) return m[1];
  const n = String(navLang || "").slice(0, 2).toLowerCase();
  return T[n] ? n : "en";
}

// Время показа по длине текста: ~17 знаков в секунду, не меньше 2,5 с и не больше 18 с
export function lineMs(text) {
  const n = String(text || "").length;
  return Math.max(2500, Math.min(18000, 1400 + n * 60));
}

export function safeLink(u) {
  return typeof u === "string" && /^https:\/\/[^\s"'<>]+$/.test(u) ? u : null;
}

// Что показывать вместо эфира. null = эфир есть.
export function boardFor(duo) {
  if (!duo || typeof duo !== "object") return "noLink";
  if (duo.status === "grok_not_configured") return "guestOff";
  if (duo.status === "preparing") return "preparing";
  if (duo.status === "no_headlines") return "noNews";
  if (!Array.isArray(duo.segments) || !duo.segments.length) return duo.status === "ok" ? "noNews" : "noLink";
  return null;
}

// Очередь реплик: Давид читает → вопрос → ответ Grok → благодарность → пауза.
// Текст гостя берётся только из guest.text при status "ok". Иначе — табличка (label), без слов от имени гостя и без «спасибо».
export function buildQueue(duo, lang) {
  if (boardFor(duo)) return [];
  const q = [];
  for (const s of duo.segments) {
    if (!s || !s.host || typeof s.host.read !== "string" || !s.host.read.trim()) continue;
    const tr = lang && lang !== "en" && duo.translations && duo.translations[lang] && duo.translations[lang].segments ? duo.translations[lang].segments[s.i] : null;
    const pick = (k, en) => (tr && typeof tr[k] === "string" && tr[k].trim() ? tr[k].trim() : en);
    const au = tr ? (tr.audio && typeof tr.audio === "object" ? tr.audio : {}) : (s.audio && typeof s.audio === "object" ? s.audio : {});
    const aud = (k) => (typeof au[k] === "string" && /^https:\/\/[^\s"'<>]+$/.test(au[k]) ? au[k] : null);
    const meta = { source: s.source || null, link: safeLink(s.link), seg: q.filter((x) => x.kind === "read").length, headline: String(s.headline || ""), segKind: s.kind || "news" };
    q.push({ who: "david", kind: "read", text: pick("read", s.host.read.trim()), audio: aud("read"), tr: !!tr, ...meta });
    if (s.host.question) q.push({ who: "david", kind: "question", text: pick("question", String(s.host.question)), audio: aud("question"), tr: !!tr, ...meta });
    const g = s.guest || {};
    if (g.status === "ok" && typeof g.text === "string" && g.text.trim()) {
      q.push({ who: "grok", kind: "answer", text: pick("answer", g.text.trim()), audio: aud("answer"), tr: !!tr, ...meta });
      if (typeof s.host.follow_up === "string" && s.host.follow_up && typeof g.follow_answer === "string" && g.follow_answer) {
        q.push({ who: "david", kind: "follow_up", text: pick("follow_up", s.host.follow_up), audio: aud("follow_up"), tr: !!tr, ...meta });
        q.push({ who: "grok", kind: "follow_answer", text: pick("follow_answer", g.follow_answer), audio: aud("follow_answer"), tr: !!tr, ...meta });
      }
      if (s.host.thanks) q.push({ who: "david", kind: "thanks", text: pick("thanks", String(s.host.thanks)), audio: aud("thanks"), tr: !!tr, ...meta });
      if (typeof s.host.transition === "string" && s.host.transition) q.push({ who: "david", kind: "transition", text: pick("transition", s.host.transition), audio: aud("transition"), tr: !!tr, ...meta });
    } else {
      q.push({ who: "grok", kind: "label", label: g.status === "withheld" ? "withheld" : "guestOff", text: null, ...meta });
    }
    q.push({ who: null, kind: "pause", text: null, ...meta });
  }
  return q.map((x) => ({ ...x, ms: x.kind === "pause" ? 1500 : x.kind === "label" ? 4000 : lineMs(x.text) }));
}

// Котировки Kraken для баннера: только то, что пришло из /api/v1/radar/crypto
export function krakenCells(market, lang = "en") {
  if (!market || typeof market !== "object") return [];
  const out = [];
  for (const [name, re] of [["BTC/EUR", /XBT/], ["ETH/EUR", /ETH/], ["XRP/EUR", /XRP/]]) {
    const k = Object.keys(market).find((x) => re.test(x)), v = k && market[k];
    if (!v || !Number.isFinite(+v.last)) continue;
    const ch = Number.isFinite(+v.change_pct) ? +v.change_pct : null;
    out.push({ pair: name, price: (+v.last).toLocaleString(lang, { maximumFractionDigits: +v.last < 10 ? 4 : 0 }), change: ch == null ? "" : (ch >= 0 ? "▲" : "▼") + Math.abs(ch).toFixed(2) + "%", up: ch == null || ch >= 0 });
  }
  return out;
}

// ---------- Браузер ----------
function start() {
  const $ = (id) => document.getElementById(id);
  const hint = document.documentElement.dataset.al || (navigator.languages || []).map((x) => String(x).slice(0, 2).toLowerCase()).find((x) => T[x]) || navigator.language;
  const lang = pickLang(location.search, hint), t = T[lang];
  const stage = $("stage"), cv = $("fx"), sub = $("sub"), board = $("board");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.lang = lang;
  $("credit").textContent = t.credit; $("imgnote").textContent = t.image; $("next").setAttribute("aria-label", t.next);
  // Партнёрские баннеры и счётчик — как на остальных страницах сайта (тексты наши, фиксированные)
  document.querySelectorAll("[data-t]").forEach((e) => { e.textContent = t[e.dataset.t]; });
  document.querySelectorAll("[data-h]").forEach((e) => { e.innerHTML = t[e.dataset.h]; });
  const xs = $("xshare");
  if (xs) { const u = "https://orbstudio.org/" + lang + "/studio"; xs.href = "https://x.com/intent/post?text=" + encodeURIComponent("🎙 " + t.shareTxt) + "&url=" + encodeURIComponent(u) + "&hashtags=OrbStudio,AIagents"; xs.textContent = "𝕏 " + t.share; }
  // ---------- Комментарии ----------
  const CAPI = API + "/comments";
  $("cm-h").textContent = t.cmH; $("cm-sub").textContent = t.cmSub; $("cm-name").placeholder = t.cmName; $("cm-text").placeholder = t.cmText; $("cm-go").textContent = t.cmGo;
  async function loadComments() {
    let d = null; try { d = await (await fetch(CAPI, { headers: { accept: "application/json" } })).json(); } catch {}
    const ul = $("cm-list"); ul.textContent = "";
    const list = d && Array.isArray(d.comments) ? d.comments : [];
    if (!list.length) { const li = document.createElement("li"); li.textContent = t.cmEmpty; ul.append(li); return; }
    for (const c of list) {
      const li = document.createElement("li"), h = document.createElement("div"), tx = document.createElement("div");
      if (c.by === "agent") li.className = "ag";
      h.className = "h"; tx.className = "t";
      let when = ""; try { when = new Date(c.at).toLocaleString(lang, { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch {}
      h.textContent = (c.name || (c.by === "agent" ? (c.agent || t.cmAgent) : t.cmGuest)) + (c.by === "agent" ? " · " + t.cmAgent : "") + " · " + when;
      tx.textContent = String(c.text || ""); li.append(h, tx); ul.append(li);
    }
  }
  $("cm-f").addEventListener("submit", async (e) => {
    e.preventDefault(); const msg = $("cm-msg"), btn = $("cm-go"); btn.disabled = true; msg.textContent = "";
    try {
      const r = await fetch(CAPI, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: $("cm-name").value, text: $("cm-text").value, lang, website: $("cm-hp").value }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) { msg.textContent = t.cmOk; $("cm-text").value = ""; loadComments(); } else msg.textContent = t.cmErr + (j && j.error ? ": " + j.error : "");
    } catch { msg.textContent = t.cmErr; }
    btn.disabled = false;
  });
  loadComments();
  const code = $("krcode");
  code.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(code.dataset.code); const o = code.textContent; code.textContent = t.copied; setTimeout(() => { code.textContent = o; }, 1500); } catch {}
  });
  fetch("/api/v1/radar/crypto").then((r) => r.json()).then((d) => {
    const cells = krakenCells(d && d.market, lang); if (!cells.length) return;
    const box = $("krpx"); box.textContent = "";
    for (const c of cells) { const s = document.createElement("span"), i = document.createElement("i"); s.textContent = c.pair + " " + c.price + " €"; i.textContent = c.change; i.className = c.up ? "up" : "dn"; s.append(i); box.append(s); }
  }).catch(() => {});
  let seen = false; try { seen = sessionStorage.getItem("orbCounted_studio") === "1"; } catch {}
  (seen ? fetch("/api/v1/stats?page=studio") : fetch("/api/v1/hit", { method: "POST", headers: { "content-type": "application/json" }, body: '{"page":"studio"}' }))
    .then((r) => (r.ok ? r.json() : null)).then((st) => {
      if (!st || !st.enabled) return; try { sessionStorage.setItem("orbCounted_studio", "1"); } catch {}
      $("cPage").textContent = Number(st.page_total).toLocaleString(lang); $("cnt").hidden = false;
    }).catch(() => {});
  for (const k of ["david", "grok"]) { const z = ZONES[k], e = $("glow-" + k); e.style.cssText = `left:${z.x}%;top:${z.y}%;width:${z.w}%;height:${z.h}%`; }

  let queue = [], pos = 0, timer = 0, retry = 0;

  function showBoard(key) {
    board.hidden = false; sub.hidden = true; stage.dataset.speaker = "";
    $("board-h").textContent = t[key] || t.noLink;
    $("board-p").textContent = key === "noLink" ? t.noLinkSub : key === "preparing" ? t.preparingSub : key === "allHeard" ? t.allHeardSub : "";
  }
  // Программа выпуска: список тем, текущая подсвечена
  function renderProg() {
    const box = $("prog"), ol = $("prog-list"); ol.textContent = ""; $("prog-h").textContent = t.progH;
    const seen = new Set(), KL = { news: t.kNews, sensors: t.kSensors, carousel: t.kCarousel, agents: t.kAgents };
    for (const x of queue) { if (x.kind !== "read" || seen.has(x.headline)) continue; seen.add(x.headline);
      const li = document.createElement("li"), b = document.createElement("b"), sp = document.createElement("span");
      const tx = String(x.text || ""); b.textContent = KL[x.segKind] || t.kNews; sp.textContent = tx.length > 150 ? tx.slice(0, 150).replace(/\s+\S*$/, "") + "…" : tx; li.dataset.h = x.headline; li.append(b, sp); ol.append(li); }
    box.hidden = !ol.children.length;
    const cur = queue[Math.max(0, pos - 1)]; if (cur && cur.headline) markProg(cur.headline);
  }
  function markProg(h) { for (const li of $("prog-list").children) li.classList.toggle("on", li.dataset.h === h); }
  function show(line) {
    if (line && line.headline) markProg(line.headline);
    stage.dataset.speaker = line.who || "";
    if (line.kind === "pause") { sub.classList.add("out"); return; }
    board.hidden = true; sub.hidden = false; sub.classList.remove("out");
    sub.dataset.who = line.who;
    $("who").textContent = line.who === "david" ? "David" : "Grok";
    $("role").textContent = line.who === "david" ? t.host : t.guest + " · xAI";
    const tx = $("text");
    tx.textContent = line.kind === "label" ? t[line.label] : line.text;
    tx.classList.toggle("label", line.kind === "label");
    tx.classList.toggle("long", String(line.text || "").length > 240);
    $("src").textContent = line.source || "";
    const a = $("link");
    if (line.link) { a.href = line.link; a.textContent = t.story; a.hidden = false; } else { a.hidden = true; a.removeAttribute("href"); }
  }
  // ---------- Звук: голоса (xAI Grok TTS, синтез) + тихая мелодичная подложка (WebAudio, генерируется в браузере) ----------
  let soundOn = false, actx = null, analyser = null, bed = null, level = 0, vfail = 0;
  const voice = new Audio(); voice.preload = "auto"; voice.crossOrigin = "anonymous";
  const pre = new Audio(); pre.preload = "auto";
  const lb = $("listen"), vn = $("vnote");
  lb.textContent = t.listen; vn.textContent = t.voices;
  // Настроение подложки по радарам: спокойно — светлее, тревожно — темнее и с лёгкими «электрическими» помехами
  let mood = "mid";
  fetch("/api/v1/radars").then((r) => r.json()).then((d) => { const rs = Array.isArray(d && d.radars) ? d.radars : [];
    const hi = Math.max(0, ...rs.filter((x) => ["geo", "crypto", "energy"].includes(x.id)).map((x) => +x.risk_index || 0));
    mood = hi >= 68 ? "tense" : hi < 50 ? "calm" : "mid"; }).catch(() => {});
  function makeBed() {
    const out = actx.createGain(); out.gain.value = 0; out.connect(actx.destination);
    const lp = actx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = mood === "tense" ? 620 : mood === "calm" ? 1300 : 900; lp.connect(out);
    if (mood === "tense") { // редкие тихие треск-помехи из фильтрованного шума
      const nb = actx.createBuffer(1, actx.sampleRate * 2, actx.sampleRate), ch = nb.getChannelData(0);
      for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * (Math.random() < 0.004 ? 1 : 0.04);
      const ns = actx.createBufferSource(), bp = actx.createBiquadFilter(), ng = actx.createGain(); ns.buffer = nb; ns.loop = true; bp.type = "bandpass"; bp.frequency.value = 3200; ng.gain.value = 0.05;
      ns.connect(bp); bp.connect(ng); ng.connect(out); ns.start(); }
    const lfo = actx.createOscillator(), lg = actx.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 380; lfo.connect(lg); lg.connect(lp.frequency); lfo.start();
    const chords = mood === "calm" ? [[130.81, 196, 261.63, 329.63], [110, 164.81, 220, 277.18], [98, 146.83, 196, 246.94], [87.31, 130.81, 174.61, 220]] // C · A · G · F — светлее
      : mood === "tense" ? [[110, 164.81, 220, 261.63], [103.83, 155.56, 207.65, 261.63], [98, 146.83, 196, 233.08], [82.41, 123.47, 164.81, 207.65]] // Am · Ab · Gm · E — темнее
      : [[110, 164.81, 220, 261.63], [87.31, 130.81, 174.61, 220], [98, 146.83, 196, 246.94], [82.41, 123.47, 164.81, 207.65]]; // Am · F · G · E
    const vs = chords[0].map((f, i) => { const o = actx.createOscillator(), o2 = actx.createOscillator(), g = actx.createGain(); o.type = "triangle"; o2.type = "sine"; o.frequency.value = f; o2.frequency.value = f * 1.004; g.gain.value = i ? 0.16 : 0.22; o.connect(g); o2.connect(g); g.connect(lp); o.start(); o2.start(); return [o, o2]; });
    let ci = 0; const swap = () => { ci = (ci + 1) % chords.length; chords[ci].forEach((f, i) => { const tt = actx.currentTime; vs[i][0].frequency.setTargetAtTime(f, tt, 1.2); vs[i][1].frequency.setTargetAtTime(f * 1.004, tt, 1.2); }); };
    const iv = setInterval(swap, 9000);
    return { out, stop() { clearInterval(iv); out.gain.setTargetAtTime(0, actx.currentTime, 0.4); } };
  }
  function duck(on) { if (bed && actx) bed.out.gain.setTargetAtTime(on ? 0.018 : 0.05, actx.currentTime, 0.35); }
  function enableSound() {
    soundOn = true; lb.textContent = t.mute; lb.setAttribute("aria-pressed", "true");
    try {
      if (!actx) { actx = new (window.AudioContext || window.webkitAudioContext)(); const src = actx.createMediaElementSource(voice); analyser = actx.createAnalyser(); analyser.fftSize = 512; src.connect(analyser); analyser.connect(actx.destination); }
      actx.resume(); if (!still) { bed = makeBed(); duck(false); }
    } catch { actx = null; }
    const cur = queue[pos - 1]; pos = Math.max(0, pos - 1); if (cur && cur.kind !== "read") { while (pos > 0 && queue[pos].kind !== "read") pos--; }
    step();
  }
  function disableSound() { soundOn = false; lb.textContent = t.listen; lb.setAttribute("aria-pressed", "false"); voice.pause(); if (bed) { bed.stop(); bed = null; } step(); }
  lb.addEventListener("click", (e) => { e.stopPropagation(); soundOn ? disableSound() : enableSound(); });
  function preload() { const n = queue.slice(pos).find((x) => x.audio); if (n && pre.src !== n.audio) pre.src = n.audio; }
  // После свежего эфира — архив за сутки, потом табличка «всё прослушано»
  let curId = null, archived = false, doneId = null;
  const heard = new Set();
  async function more() {
    if (archived) { doneId = curId; showBoard("allHeard"); retry = setTimeout(load, 120000); return; }
    archived = true;
    let arc = null; try { arc = await (await fetch(API + "/archive", { headers: { accept: "application/json" } })).json(); } catch {}
    const q = [];
    for (const ep of (arc && Array.isArray(arc.episodes) ? arc.episodes : [])) {
      if (!ep || ep.episode_id === curId) continue;
      // старые сегменты о числе визитов агентов в архиве не проигрываем (убраны из эфира 19.11)
      const ep2 = { ...ep, segments: (ep.segments || []).filter((x) => x && (x.kind || "news") === "news") };
      const lines = buildQueue(ep2, lang).filter((x) => !heard.has(x.headline) && x.kind !== "transition");
      if (!lines.some((x) => x.kind === "read")) continue;
      lines.forEach((x) => heard.add(x.headline));
      const br = ep.bridge && ep.bridge[lang];
      if (br && typeof br.text === "string") q.push({ who: "david", kind: "bridge", text: br.text, audio: typeof br.audio === "string" && /^https:\/\//.test(br.audio) ? br.audio : null, ms: lineMs(br.text), source: null, link: null });
      q.push(...lines);
    }
    if (!q.length) { doneId = curId; showBoard("allHeard"); retry = setTimeout(load, 120000); return; }
    queue = q; pos = 0; renderProg(); step();
  }
  function step() {
    clearTimeout(timer); voice.onended = voice.onerror = null;
    if (pos >= queue.length) return more();
    const line = queue[pos++]; show(line);
    if (soundOn && line.audio && vfail < 6) {
      let tries = 0;
      voice.src = line.audio; duck(true); stage.dataset.voiced = "1";
      const done = () => { voice.onended = voice.onerror = null; duck(false); stage.dataset.voiced = ""; clearTimeout(timer); timer = setTimeout(step, line.who === "grok" ? 700 : 450); };
      voice.onended = () => { vfail = 0; done(); };
      // Голос мог ещё синтезироваться: одна повторная попытка через 2 с, потом — субтитры этой реплики, и дальше снова со звуком
      voice.onerror = () => {
        if (tries++ < 1) { clearTimeout(timer); timer = setTimeout(() => { voice.src = line.audio + (line.audio.includes("?") ? "&" : "?") + "r=1"; voice.play().catch(() => voice.onerror && voice.onerror()); timer = setTimeout(done, Math.max(line.ms * 2.5, 30000)); }, 2000); return; }
        vfail++; if (vfail >= 6) $("src").textContent = t.noVoice; duck(false); stage.dataset.voiced = ""; clearTimeout(timer); timer = setTimeout(step, line.ms);
      };
      voice.play().catch(() => voice.onerror && voice.onerror());
      timer = setTimeout(done, Math.max(line.ms * 2.5, 30000)); // страховка, если звук завис
      preload();
      return;
    }
    timer = setTimeout(step, soundOn && line.kind === "pause" ? 900 : line.ms);
  }
  // уровень голоса для подсветки говорящего
  const lvBuf = new Uint8Array(256);
  window.__orbLevel = () => { if (!analyser || voice.paused) { level *= 0.9; return level; } analyser.getByteTimeDomainData(lvBuf); let m = 0; for (const v of lvBuf) m = Math.max(m, Math.abs(v - 128)); level = level * 0.6 + Math.min(1, m / 70) * 0.4; return level; };
  async function load() {
    clearTimeout(timer); clearTimeout(retry);
    let duo = null;
    try {
      const r = await fetch(API, { headers: { accept: "application/json" } });
      duo = await r.json();
    } catch { duo = null; }
    const b = boardFor(duo);
    if (b) { showBoard(b); retry = setTimeout(load, b === "preparing" ? 60000 : 90000); return; }
    const id = duo.episode_id || duo.generated_at || null;
    if (id && id === doneId) { showBoard("allHeard"); retry = setTimeout(load, 120000); return; }
    if (id !== curId) { curId = id; archived = false; heard.clear(); }
    // в эфире только новости; если в выпуске были другие сегменты, убираем и переходы (они вели к убранным темам)
    const newsOnly = (duo.segments || []).filter((x) => x && (x.kind || "news") === "news"), cut = newsOnly.length !== (duo.segments || []).length;
    queue = buildQueue({ ...duo, segments: newsOnly }, lang).filter((x) => !(cut && x.kind === "transition")); pos = 0; queue.forEach((x) => heard.add(x.headline));
    setTimeout(renderProg, 0);
    const cta = duo.cta && duo.cta[lang];
    if (queue.length && cta && typeof cta.text === "string") queue.push({ who: "david", kind: "cta", text: cta.text, audio: typeof cta.audio === "string" && /^https:\/\//.test(cta.audio) ? cta.audio : null, ms: lineMs(cta.text), source: null, link: null, headline: "" }, { who: null, kind: "pause", text: null, ms: 1500, headline: "" }); vn.textContent = t.voices + (queue.some((x) => x.tr) ? " " + t.trNote : "");
    if (!queue.length) { showBoard("noLink"); retry = setTimeout(load, 90000); return; }
    step();
  }
  $("next").addEventListener("click", () => { if (queue.length) step(); });
  document.addEventListener("visibilitychange", () => { if (soundOn) return; if (document.hidden) clearTimeout(timer); else if (queue.length && board.hidden) step(); });
  load();

  if (still) return; // анимаций нет: картинка, субтитры и статичная подсветка

  // ---------- Лёгкие эффекты на canvas 2D ----------
  const ctx = cv.getContext("2d");
  let W = 0, H = 0, raf = 0;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const mk = (zone, n, color, size) => Array.from({ length: n }, () => ({ zone, x: Math.random(), y: Math.random(), ph: rnd(0, 6.28), sp: rnd(0.6, 2.2), dy: rnd(0.004, 0.02), r: rnd(size * 0.5, size), color }));
  const dots = [...mk("david", 34, "120,220,255", 1.5), ...mk("grok", 34, "185,140,255", 1.5), ...mk("city", 26, "255,214,150", 1.1)];
  function size() {
    const r = cv.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
    W = cv.width = Math.round(r.width * d); H = cv.height = Math.round(r.height * d);
  }
  let last = 0;
  function frame(ms) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (ms - last) / 1000 || 0); last = ms;
    const s = ms / 1000, speaker = stage.dataset.speaker, lv = window.__orbLevel ? window.__orbLevel() : 0;
    stage.style.setProperty("--lv", lv.toFixed(3));
    stage.style.setProperty("--lvd", (speaker === "david" ? lv : 0).toFixed(3)); stage.style.setProperty("--lvg", (speaker === "grok" ? lv : 0).toFixed(3));
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (const p of dots) {
      const z = ZONES[p.zone];
      if (p.zone !== "city") { p.y -= p.dy * dt; if (p.y < 0) { p.y = 1; p.x = Math.random(); } }
      const tw = 0.5 + 0.5 * Math.sin(s * p.sp + p.ph);
      const k = p.zone === "city" ? 0.55 : speaker === p.zone ? 0.75 + lv * 1.1 : speaker ? 0.3 : 0.6;
      const edge = p.zone === "city" ? 1 : Math.sin(p.x * Math.PI) * Math.sin(p.y * Math.PI); // гаснут к краям зоны
      ctx.fillStyle = `rgba(${p.color},${(tw * k * (0.25 + 0.75 * edge)).toFixed(3)})`;
      const px = (z.x + p.x * z.w) / 100 * W, py = (z.y + p.y * z.h) / 100 * H, r = p.r * W / 400;
      ctx.beginPath(); ctx.arc(px, py, r, 0, 6.2832); ctx.fill();
    }
    // «Скан» сверху вниз раз в 7 секунд, идёт 2,2 с
    const c = (s % 7) / 2.2;
    if (c < 1) {
      const y = (14 + c * 44) / 100 * H, g = ctx.createLinearGradient(0, y - H * 0.03, 0, y + H * 0.004);
      g.addColorStop(0, "rgba(140,220,255,0)"); g.addColorStop(1, `rgba(170,225,255,${(0.16 * Math.sin(c * Math.PI)).toFixed(3)})`);
      ctx.fillStyle = g; ctx.fillRect(0, y - H * 0.03, W, H * 0.034);
    }
    ctx.globalCompositeOperation = "source-over";
  }
  size(); addEventListener("resize", size);
  raf = requestAnimationFrame(frame);
  document.addEventListener("visibilitychange", () => { cancelAnimationFrame(raf); if (!document.hidden) raf = requestAnimationFrame(frame); });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
}
