/* factor3d.js - "Тактический стол радаров" hologram for orbstudio.org/#radar (preview build, not deployed)
   window.OrbFactor3D = { init(el, opts) -> true/false, update({radars, details}), show(id), next(), stats(), destroy() }
   radars  = GET /api/v1/radars (object with radars[] or the bare array)
   details = { geo: GET /api/v1/radar/geo, politics: ..., ... }
   Queue: radars sorted by risk_index desc (ties: geo, politics, economy, budget, crypto, energy, justice, web).
   Each radar ~12 s (3 s per factor), laser erase -> next; after the last -> first again (loop counter +1).
   Every loop/radar pair gets its own deterministic look (camera, sweep, grid, lasers, blip order) - no random source.
   three.js r128 core only (cdnjs). Own bloom (as orbcore3d.js). textContent only, https links only.
   Missing field -> no element. Pauses when tab hidden / block offscreen. prefers-reduced-motion. touch-action: pan-y.
   opts.timeScale (default 1) exists only for the recording harness. */
(function () {
  "use strict";

  /* ================= KEYWORDS: headline -> factor (prefix match at word start, "=" suffix = whole word) =================
     Keys = fac_i18n[].en of the real API (13.11.2026). Titles arrive in EN/DE/RU, so every list mixes all three.
     A factor not listed here falls back to stems of its own ru/de/en names. */
  var KEYWORDS = {
    geo: {
      "Military": ["military", "army", "troop", "drone", "missile", "strike", "attack", "defence", "defense", "nato=", "war=", "soldier",
        "военн", "армия", "войск", "дрон", "беспилот", "удар", "атак", "militär", "armee", "truppe", "drohne", "angriff", "krieg", "bundeswehr"],
      "Sanctions": ["sanction", "embargo", "barring", "bars=", "ban=", "bans=", "export control", "tariff", "asset freeze",
        "санкц", "эмбарго", "запрет", "пошлин", "sanktion", "embargo", "verbot", "zoll", "zölle"],
      "Diplomacy": ["diplomat", "negotiat", "talks", "summit", "peace", "envoy", "treaty", "ceasefire", "foreign minister",
        "дипломат", "переговор", "саммит", "мирн", "посол", "verhandl", "gipfel", "frieden", "waffenruhe", "außenminister"],
      "Elections": ["election", "vote", "voting", "ballot", "poll=", "polls=", "campaign", "выбор", "голосов", "wahl", "abstimm", "stimmzettel"]
    },
    politics: {
      "Crises": ["crisis", "protest", "scandal", "impeach", "resign", "collapse", "unrest", "strike", "кризис", "протест", "скандал", "отставк", "импичмент",
        "krise", "protest", "streit", "rücktritt", "skandal"],
      "Elections": ["election", "vote", "voting", "ballot", "poll=", "polls=", "campaign", "candidate", "выбор", "голосов", "кандидат", "wahl", "umfrage", "kandidat"],
      "Government": ["government", "minister", "chancellor", "cabinet", "president", "coalition", "budget", "правительств", "министр", "канцлер", "кабинет", "коалиц",
        "regierung", "minister", "kanzler", "kabinett", "koalition", "haushalt"],
      "Laws": ["law=", "laws=", "bill=", "bills=", "legislat", "court", "senat", "parliament", "congress", "закон", "суд", "парламент", "дума",
        "gesetz", "bundestag", "gericht", "verfassung", "parlament"]
    },
    economy: {
      "Recession": ["recession", "slowdown", "downturn", "contraction", "crisis", "loss", "рецесс", "спад", "кризис", "rezession", "abschwung", "krise", "flaute"],
      "Rates": ["rate=", "rates=", "fed=", "fed’s", "fed's", "central bank", "ecb=", "inflation", "monetary", "hike", "mortgage", "yield",
        "ставк", "фрс", "цб=", "инфляц", "zins", "ezb", "notenbank", "geldpolitik", "inflation"],
      "Jobs": ["job=", "jobs=", "employment", "unemployment", "payroll", "labor", "labour", "layoff", "работ", "безработ", "занятост", "arbeit", "stellen", "beschäftig"],
      "Growth": ["growth", "gdp=", "output", "expansion", "рост", "ввп", "wachstum", "bip=", "konjunktur"]
    },
    budget: {
      "Inflation": ["inflation", "prices", "price=", "cpi=", "cost", "инфляц", "цен", "дорож", "preis", "teuer", "kosten"],
      "Energy": ["energy", "electricity", "power=", "heating", "gas=", "энерг", "электр", "газ=", "отоплен", "energie", "strom", "heiz", "gaspreis"],
      "Rent": ["rent=", "rents=", "housing", "landlord", "аренд", "жиль", "квартир", "miete", "wohn"],
      "Rates": ["rate=", "rates=", "interest", "ecb=", "fed=", "loan", "ставк", "кредит", "ипотек", "zins", "ezb", "geldpolitik", "kredit"]
    },
    crypto: {
      "Regulators": ["regulat", "sec=", "doj=", "crackdown", "seize", "police", "compliance", "lawsuit", "регулят", "закон", "изъят", "regulier", "aufsicht", "bafin", "beschlagnahm"],
      "Hacks": ["hack", "exploit", "stolen", "theft", "breach", "drain", "взлом", "кража", "украд", "diebstahl", "gestohlen"],
      "Volatility": ["volatil", "slide", "plunge", "surge", "rally", "liquidity", "crash", "price", "волатил", "обвал", "курс", "kurs", "absturz", "einbruch"],
      "Institutions": ["etf", "institution", "fund", "bank", "treasury", "whale", "outflow", "инвест", "институц", "фонд", "банк", "institution", "fonds", "bank"]
    },
    energy: {
      "Oil": ["oil=", "brent", "wti=", "crude", "refiner", "нефт", "брент", "öl=", "rohöl", "ölpreis", "raffinerie"],
      "Gas": ["gas=", "lng=", "natural gas", "газ", "спг", "gas=", "flüssiggas", "erdgas"],
      "OPEC+": ["opec", "saudi", "quota", "output", "production", "опек", "саудов", "квот", "добыч", "förder"],
      "Routes": ["hormuz", "shipping", "route", "strait", "pipeline", "tanker", "red sea", "маршрут", "пролив", "трубопровод", "танкер", "route", "pipeline", "tanker", "meerenge"]
    },
    justice: {
      "Organised crime": ["organi", "gang", "clan", "mafia", "cartel", "trafficking", "illegal", "организ", "банд", "клан", "мафи", "картел", "organisiert", "bande", "clan", "schmuggel", "illegal"],
      "Homicide and violence": ["kill", "murder", "shot", "shooting", "dead", "violence", "stabbing", "убий", "насил", "стрельб", "погиб",
        "tot=", "tote=", "toter=", "töt", "mord", "schüss", "schuss", "gewalt", "leiche"],
      "Sex crimes": ["sexual", "abuse", "rape", "сексуал", "изнасил", "домогат", "missbr", "sexual", "vergewalt"],
      "Theft and robbery": ["theft", "robbery", "stolen", "burglar", "steal", "краж", "ограбл", "граб", "diebstahl", "raub", "einbruch", "gestohlen"],
      "Corruption": ["corrupt", "brib", "fraud", "embezzl", "коррупц", "взятк", "мошенн", "korrupt", "bestech", "betrug"]
    },
    web: {
      "Blocking": ["block", "ban=", "bans=", "censor", "shutdown", "restrict", "firewall", "блокир", "запрет", "цензур", "sperr", "blockier", "zensur", "verbot"],
      "Courts": ["court", "lawsuit", "sue=", "sues=", "judge", "ruling", "суд", "иск=", "gericht", "klage", "urteil"],
      "Paid access": ["paywall", "subscription", "paid", "price", "dollar", "платн", "подписк", "bezahl", "abo=", "preis", "dollar"],
      "Openness": ["open", "free=", "transparen", "открыт", "свобод", "offen", "frei="]
    }
  };

  var ORDER = ["geo", "politics", "economy", "budget", "crypto", "energy", "justice", "web"];
  var NAMES = { ru: { geo: "Гео", politics: "Полит", economy: "Эконом", budget: "Бюджет", crypto: "Крипто", energy: "Энерго", justice: "Право", web: "Веб" },
    de: { geo: "Geo", politics: "Politik", economy: "Wirtsch", budget: "Budget", crypto: "Krypto", energy: "Energie", justice: "Justiz", web: "Web" },
    en: { geo: "Geo", politics: "Politics", economy: "Economy", budget: "Budget", crypto: "Crypto", energy: "Energy", justice: "Justice", web: "Web" } };
  var TXT = { ru: { nosig: "нет сигналов", nodata: "НЕТ ДАННЫХ", factor: "ФАКТОР", loop: "КРУГ", sig: "СИГН", src: "ИСТ", sweep: "РАЗВ", vs: "к пред.", paused: "ПАУЗА", upd: "ОБН", d24: "24ч" },
    de: { nosig: "keine Signale", nodata: "KEINE DATEN", factor: "FAKTOR", loop: "RUNDE", sig: "SIG", src: "QUL", sweep: "SWP", vs: "zum Vorwert", paused: "PAUSE", upd: "AKT", d24: "24h" },
    en: { nosig: "no signals", nodata: "NO DATA", factor: "FACTOR", loop: "LOOP", sig: "SIG", src: "SRC", sweep: "SWP", vs: "vs prev", paused: "PAUSE", upd: "UPD", d24: "24h" } };
  var SLOT = 3, WIPE = 1.1, PAUSE = 15, R = 1.6, RG0 = R + 0.10, RG1 = R + 0.30, WL = 4.8, MAXB = 12, MAXL = 12;

  var T, el, ren, scene, cam, ok = false, raf = 0, onScreen = true, io = null, ro = null, rmTimer = 0, listeners = [];
  var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var opts = { timeScale: 1 }, st = { frames: 0, tris: 0, calls: 0, fps: 0, hdr: false }, fpsT = [];
  var RT = {}, FS = {}, U = {}, M = {}, ui = {}, W = 4, H = 3, tall = false;
  var radarsIn = null, detailsIn = {}, queue = [], cur = null, rv = null, curF = -1, loopN = 0, failed = false, gotData = false;
  var clk = 0, rt = 0, lastNow = null, pauseRt = -1e9, facRt = 0, radRt = -1e9, sweep = 0, lastLang = "", dirty = true, rmKey = "";
  var camS = { az: 0, el: 1.0, d: 1, init: false }, V = null, Vprev = null, wipe = { mode: 0, pos: 0, dx: 1, dz: 0 }, emit = [], labelPos = null;

  function now() { return performance.now(); }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13; return (h >>> 0) / 4294967296; }
  function clamp(x, a, b) { return x < a ? a : x > b ? b : x; }
  function sm(a, b, x) { x = clamp((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); }
  function isStr(x) { return typeof x === "string" && x.trim() !== ""; }
  function num(x) { return typeof x === "number" && isFinite(x) ? x : null; }
  function https(u) { return isStr(u) && /^https:\/\/[^\s]+$/i.test(u) ? u : null; }
  function lang() { var l = (document.documentElement.lang || "ru").toLowerCase(); return l.indexOf("de") === 0 ? "de" : l.indexOf("en") === 0 ? "en" : "ru"; }
  function lvlCol(v) { return v == null ? "#7fd8b0" : v <= 44 ? "#3dffc4" : v < 65 ? "#ffb43a" : "#ff5050"; }
  function lvlRGB(v) { return v == null ? [0.4, 1, 0.7] : v <= 44 ? [0.2, 1.0, 0.72] : v < 65 ? [1.0, 0.62, 0.16] : [1.0, 0.22, 0.2]; }
  function on(t, ev, fn, o) { t.addEventListener(ev, fn, o); listeners.push([t, ev, fn, o]); }
  function div(cls, parent, tag) { var d = document.createElement(tag || "div"); if (cls) d.className = cls; (parent || ui.root).appendChild(d); return d; }
  function txt(n, s) { n.textContent = s == null ? "" : String(s); n.style.display = s == null || s === "" ? "none" : ""; }

  /* ---------- keyword matching ---------- */
  var BND = "a-z0-9а-яёäöüß", reCache = {};
  function kwRe(list) {
    var key = list.join("|"); if (reCache[key]) return reCache[key];
    var parts = list.map(function (k) { k = k.toLowerCase(); var whole = /=$/.test(k); k = k.replace(/=$/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); return k + (whole ? "(?![" + BND + "])" : ""); });
    return (reCache[key] = new RegExp("(^|[^" + BND + "])(" + parts.join("|") + ")", "i"));
  }
  function facKeywords(id, f) {
    var tab = KEYWORDS[id] || {}, k = isStr(f.en) ? f.en : null;
    if (k && tab[k]) return tab[k];
    var out = []; ["ru", "de", "en"].forEach(function (l) { if (isStr(f[l])) f[l].toLowerCase().split(/[^a-z0-9а-яёäöüß+]+/).forEach(function (w) { if (w.length >= 4) out.push(w.slice(0, 5)); }); });
    return out;
  }

  /* ---------- data model ---------- */
  function radarArr() { var r = radarsIn; if (r && !Array.isArray(r) && Array.isArray(r.radars)) r = r.radars; return Array.isArray(r) ? r : null; }
  function buildQueue() {
    var arr = radarArr(), L = lang(), seen = {}, q = [];
    function title(o) { if (!o) return null; var t = L === "de" ? o.title_de : L === "en" ? o.title_en : o.title; return isStr(t) ? t : null; }
    if (arr) arr.forEach(function (r) { if (!r || !isStr(r.id) || seen[r.id]) return; seen[r.id] = 1; var d = detailsIn[r.id] && typeof detailsIn[r.id] === "object" ? detailsIn[r.id] : null;
      q.push({ id: r.id, title: title(r) || title(d), ri: num(r.risk_index) != null ? num(r.risk_index) : d ? num(d.lvl) : null, d24: num(r.delta_24h), det: d }); });
    for (var k in detailsIn) if (!seen[k] && detailsIn[k] && typeof detailsIn[k] === "object" && (ORDER.indexOf(k) >= 0)) { var d = detailsIn[k]; q.push({ id: k, title: title(d), ri: num(d.lvl), d24: null, det: d }); }
    function oi(id) { var i = ORDER.indexOf(id); return i < 0 ? 99 : i; }
    q.sort(function (a, b) { var x = a.ri == null ? -1 : a.ri, y = b.ri == null ? -1 : b.ri; return y - x || oi(a.id) - oi(b.id); });
    return q;
  }
  function radarView(item) {
    var d = item.det || {}, L = lang(), facs = [], feed = [];
    if (Array.isArray(d.fac_i18n)) d.fac_i18n.forEach(function (f) { if (!f || typeof f !== "object") return; var n = isStr(f[L]) ? f[L] : isStr(f.en) ? f.en : isStr(f.ru) ? f.ru : null; var v = num(f.value);
      if (n == null && v == null) return; facs.push({ name: n, value: v == null ? null : clamp(v, 0, 100), re: kwRe(facKeywords(item.id, f)) }); });
    if (Array.isArray(d.feed)) d.feed.forEach(function (x) { if (!x || !isStr(x.title)) return; var p = isStr(x.published) ? Date.parse(x.published) : NaN;
      feed.push({ title: x.title.trim(), source: isStr(x.source) ? x.source : null, link: https(x.link), time: isStr(x.time) ? x.time : null, pub: isFinite(p) ? p : null, w: num(x.weight), sc: num(x.sources_confirming) }); });
    facs.forEach(function (f) { f.hits = feed.filter(function (x) { return f.re.test(" " + x.title); });
      f.top = f.hits.slice().sort(function (a, b) { return (b.w || 0) - (a.w || 0) || (b.sc || 0) - (a.sc || 0) || (b.pub || 0) - (a.pub || 0); })[0] || null; });
    var lvl = num(d.lvl) != null ? num(d.lvl) : item.ri, prev = num(d.prev);
    var sev = L === "ru" && isStr(d.severity) ? d.severity : null;
    return { id: item.id, title: item.title, lvl: lvl, prev: prev, sev: sev, d24: item.d24, facs: facs, feed: feed, upd: isStr(d.updated_at) ? Date.parse(d.updated_at) : null };
  }
  function variation(id, loop) {
    var k = id + "|" + loop, h = function (s) { return hash(k + "|" + s); };
    return { az: (h("az") - 0.5) * 1.1, el: 0.86 + h("el") * 0.36, d: 1 + h("d") * 0.1, drift: h("dr") < 0.5 ? -1 : 1,
      sdir: h("sd") < 0.5 ? 1 : -1, sper: 2.4 + h("sp") * 2.2, grid: Math.floor(h("g") * 3) % 3, gsc: 0.26 + h("gs") * 0.22, grot: h("gr") * 1.5708,
      le: Math.floor(h("le") * 4) % 4, lh: 2.4 + h("lh") * 1.4, lsp: 0.8 + h("ls") * 0.35, bseed: k, brot: h("br") * 6.2832, wd: h("wd") * 6.2832 };
  }

  /* ---------- shaders ---------- */
  var CUT = "uniform vec4 uCut;\nfloat cmask(vec2 p){ if(uCut.w<0.5) return 1.; if(uCut.w>2.5) return 0.; float s=dot(p,uCut.xy)-uCut.z; return uCut.w<1.5 ? smoothstep(0.06,-0.06,s) : smoothstep(-0.06,0.06,s); }\n";
  var NOISE = "float h21(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}\n" +
    "float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x),mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x),f.y);}\n";
  var VW = "varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }";
  var TABLE_FS = "uniform float uT,uSw,uDir,uR,uData; uniform vec4 uG0,uG1; uniform vec3 uAcc; varying vec3 vW;\n" + CUT + NOISE +
    "float aa(float d,float w){ float f=fwidth(d)*1.2+w; return 1.-smoothstep(0.,f,abs(d)); }\n" +
    "float grid(vec2 p, vec4 g){ float c=cos(g.z),s=sin(g.z); p=mat2(c,-s,s,c)*p; float sc=g.y, o=0.;\n" +
    " if(g.x<0.5){ vec2 q=p/sc; vec2 f=abs(fract(q)-0.5)-0.5; o=max(aa(f.x*sc,0.002),aa(f.y*sc,0.002)); vec2 m=abs(fract(q/4.)-0.5)-0.5; o+=0.8*max(aa(m.x*sc*4.,0.003),aa(m.y*sc*4.,0.003)); }\n" +
    " else if(g.x<1.5){ float r=length(p), a=atan(p.y,p.x); o=aa((fract(r/sc+0.5)-0.5)*sc,0.002); float sp=0.2618; o=max(o,aa((fract(a/sp+0.5)-0.5)*sp*r,0.002)*step(0.3,r)); }\n" +
    " else { for(int k=0;k<3;k++){ float an=float(k)*1.0472; vec2 d=vec2(cos(an),sin(an)); float t=dot(p,d)/sc; o=max(o,aa((fract(t+0.5)-0.5)*sc,0.002)); } }\n" +
    " return o; }\n" +
    "void main(){ vec2 p=vW.xz; float r=length(p); vec3 G=vec3(0.32,1.,0.55), A=vec3(1.,0.66,0.2);\n" +
    " vec3 col=vec3(0.006,0.018,0.012)*(1.-0.35*smoothstep(2.,5.5,r));\n" +
    " float rect=step(abs(p.x),4.5)*step(abs(p.y),3.4);\n" +
    " float cs=dot(p,uCut.xy)-uCut.z; float useNew = (uCut.w>0.5&&uCut.w<1.5) ? step(cs,0.) : 1.; vec4 g=mix(uG0,uG1,useNew);\n" +
    " float gl=grid(p,g)*rect*(1.-smoothstep(R1,R1+0.25,r)*0.)*(0.55-0.35*smoothstep(1.,4.5,r));\n" +
    " col+=mix(G,A,smoothstep(2.4,4.2,r))*gl*0.085;\n" +
    " float fx=aa(max(abs(p.x)-4.5,abs(p.y)-3.4),0.004)+0.6*aa(max(abs(p.x)-4.38,abs(p.y)-3.28),0.002);\n" +
    " float tk=0.; if(abs(abs(p.y)-3.34)<0.06&&abs(p.x)<4.4){ float f=fract(p.x*5.); tk=step(f,0.06)*(step(abs(abs(p.y)-3.34),0.025)+step(fract(p.x),0.02)); }\n" +
    " if(abs(abs(p.x)-4.44)<0.06&&abs(p.y)<3.3){ float f=fract(p.y*5.); tk+=step(f,0.06)*(step(abs(abs(p.x)-4.44),0.025)+step(fract(p.y),0.02)); }\n" +
    " col+=A*(fx*0.35+tk*0.22);\n" +
    " float disc=1.-smoothstep(uR-0.01,uR+0.01,r);\n" +
    " col=mix(col,vec3(0.004,0.03,0.016)+G*0.012*vn(p*30.+uT*3.),disc*0.85);\n" +
    " float rings=0.; for(int k=1;k<=4;k++){ rings+=aa(r-uR*float(k)*0.25,0.0015)*(k==4?1.4:0.55); }\n" +
    " float a=atan(p.x,-p.y); float tick=step(uR,r)*step(r,uR+0.07)*step(fract(a/0.08727+0.5),0.18)*(0.5+step(fract(a/0.5236+0.5),0.06)*1.5);\n" +
    "" +
    " float spk=0.; for(int k=0;k<12;k++){ float an=float(k)*0.5236; vec2 d=vec2(sin(an),-cos(an)); float t=dot(p,d); float n=abs(d.x*p.y-d.y*p.x); spk+=aa(n,0.001)*step(0.,t)*step(t,uR)*0.25; }\n" +
    " col+=G*(rings*0.32+spk*0.12)*(0.6+0.4*uData)+A*tick*0.4;\n" +
    " float ang=atan(p.y,p.x); float dd=mod((uSw-ang)*uDir,6.28318); float trail=exp(-dd*2.4)*disc; float beam=exp(-dd*dd*900.)*disc;\n" +
    " col+=G*(trail*0.22*(0.7+0.3*vn(vec2(r*18.,dd*6.)))+beam*1.6*(0.4+0.6*smoothstep(0.,uR,r)));\n" +
    " col+=G*exp(-r*r*60.)*0.5;\n" +
    " float cl=0.; if(uCut.w>0.5&&uCut.w<2.5){ cl=exp(-cs*cs*500.)*rect; col+=uAcc*cl*1.4+uAcc*exp(-abs(cs)*6.)*rect*0.05*step(0.,-cs*(uCut.w<1.5?1.:-1.)); }\n" +
    " col*=0.93+0.07*sin(vW.z*220.+uT*4.); col*=1.-smoothstep(0.,1.6,max(abs(p.x)-4.5,abs(p.y)-3.4));\n" +
    " gl_FragColor=vec4(col,1.); }";
  var GAUGE_FS = "uniform float uFill,uT,uOn; uniform vec3 uCol; uniform float uR0,uR1; varying vec3 vW;\n" + CUT +
    "void main(){ vec2 p=vW.xz; float r=length(p); float a=atan(p.x,-p.y); float f=fract(a/6.28318+1.);\n" +
    " float rr=(r-uR0)/(uR1-uR0); float band=smoothstep(0.,0.06,rr)*smoothstep(1.,0.94,rr);\n" +
    " float seg=step(fract(f*50.),0.82); float fine=step(fract(f*200.),0.35)*step(rr,0.18);\n" +
    " float fill=step(f,uFill); float tip=exp(-pow((f-uFill)*60.,2.))*step(0.001,uFill);\n" +
    " vec3 c=vec3(0.3,0.9,0.5)*band*(seg*0.07+fine*0.25);\n" +
    " c+=uCol*band*seg*fill*(0.55+0.9*smoothstep(uFill-0.25,uFill,f))*uOn;\n" +
    " c+=vec3(1.,0.95,0.8)*tip*band*2.2*uOn;\n" +
    " float edge=exp(-pow((rr-0.0)*40.,2.))+exp(-pow((rr-1.)*40.,2.)); c+=vec3(1.,0.66,0.2)*edge*0.25;\n" +
    " gl_FragColor=vec4(c*cmask(p),1.); }";
  var CURT_VS = "varying vec3 vW; varying float vH; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vH=uv.y; gl_Position=projectionMatrix*viewMatrix*w; }";
  var CURT_FS = "uniform float uFill,uT,uOn; uniform vec3 uCol; varying vec3 vW; varying float vH;\n" + CUT +
    "void main(){ vec2 p=vW.xz; float a=atan(p.x,-p.y); float f=fract(a/6.28318+1.); float fill=step(f,uFill);\n" +
    " float v=pow(1.-vH,2.2); float st=0.6+0.4*step(fract(f*120.),0.5); float sh=0.75+0.25*sin(vH*40.-uT*6.+f*30.);\n" +
    " float tip=exp(-pow((f-uFill)*70.,2.))*step(0.001,uFill);\n" +
    " vec3 c=uCol*fill*v*st*sh*0.42*uOn + vec3(1.,0.95,0.8)*tip*pow(1.-vH,1.2)*1.4*uOn;\n" +
    " gl_FragColor=vec4(c*cmask(p),1.); }";
  var BLIP_VS = "attribute float aSize,aRings,aAng,aBorn,aHi; uniform float uT,uSw,uDir,uPx; varying float vA,vFl,vRings,vCore,vHi; varying vec2 vP;\n" +
    "void main(){ vec4 w=modelMatrix*vec4(position,1.); vP=w.xz; vec4 mv=viewMatrix*w; gl_Position=projectionMatrix*mv;\n" +
    " vA=smoothstep(aBorn,aBorn+0.35,uT); float dd=mod((uSw-aAng)*uDir,6.28318); vFl=exp(-dd*1.8); vRings=aRings; vHi=aHi;\n" +
    " vCore=0.07+0.11*aSize; float D=0.34+0.05*aRings; gl_PointSize=D*uPx/-mv.z*(0.6+0.4*vA); }";
  var BLIP_FS = "uniform vec3 uCol; varying float vA,vFl,vRings,vCore,vHi; varying vec2 vP;\n" + CUT +
    "void main(){ vec2 q=gl_PointCoord-0.5; float d=length(q); if(d>0.5) discard; float D=0.34+0.05*vRings; float k=D; float dr=d*k; \n" +
    " float core=exp(-pow(dr/(vCore*0.5),2.)*2.)*1.6+exp(-dr/(vCore*0.9))*0.25;\n" +
    " float rg=0.; for(int i=0;i<6;i++){ if(float(i)<vRings){ float ri=vCore*0.5+0.035+float(i)*0.025; rg+=exp(-pow((dr-ri)*260.,2.))*(0.55-float(i)*0.06); } }\n" +
    " vec3 c=uCol*(core*(0.55+1.4*vFl)+rg*(0.35+0.9*vFl)) + vec3(1.,0.95,0.8)*core*vFl*0.6*(0.5+vHi);\n" +
    " gl_FragColor=vec4(c*vA*cmask(vP)*smoothstep(0.5,0.42,d),1.); }";
  var STEM_VS = "attribute float aBorn,aTop; uniform float uT; varying float vA,vTop; varying vec2 vP; void main(){ vec4 w=modelMatrix*vec4(position,1.); vP=w.xz; vA=smoothstep(aBorn,aBorn+0.35,uT); vTop=aTop; gl_Position=projectionMatrix*viewMatrix*w; }";
  var STEM_FS = "uniform vec3 uCol; varying float vA,vTop; varying vec2 vP;\n" + CUT + "void main(){ gl_FragColor=vec4(uCol*vA*(0.12+0.4*vTop)*cmask(vP),1.); }";
  var LAS_VS = "attribute vec2 aQ; attribute vec4 aC; varying vec2 vQ; varying vec4 vC; void main(){ vQ=aQ; vC=aC; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }";
  var LAS_FS = "varying vec2 vQ; varying vec4 vC; void main(){ float x=vQ.y; float i=exp(-x*x*9.)*0.7+exp(-x*x*90.)*1.6; float al=vC.a*(0.35+0.65*vQ.x)*smoothstep(0.,0.04,vQ.x); gl_FragColor=vec4(vC.rgb*i*al,1.); }";
  var PT_VS = "attribute float aS,aPh; uniform float uT,uPx; varying float vI; void main(){ vec3 p=position; p.y+=sin(uT*0.23+aPh*6.28)*0.08; p.x+=sin(uT*0.17+aPh*11.)*0.05; vec4 mv=modelViewMatrix*vec4(p,1.);\n" +
    " gl_Position=projectionMatrix*mv; vI=aS*(0.55+0.45*sin(uT*1.3+aPh*40.)); gl_PointSize=max(1.5,(0.018+aS*0.03)*uPx/-mv.z); }";
  var PT_FS = "uniform vec3 uCol; varying float vI; void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard; gl_FragColor=vec4(uCol*exp(-d*d*18.)*vI,1.); }";

  function addMat(u, vs, fs, opaque) {
    var m = new T.ShaderMaterial({ uniforms: u, vertexShader: vs, fragmentShader: fs, transparent: !opaque, depthWrite: false, depthTest: false, blending: opaque ? T.NoBlending : T.AdditiveBlending, side: T.DoubleSide });
    m.extensions = { derivatives: true }; return m;
  }
  function mk(geo, mat, order) { var m = new T.Mesh(geo, mat); m.renderOrder = order; m.frustumCulled = false; scene.add(m); return m; }

  /* ---------- scene ---------- */
  function buildScene() {
    U.cut = { value: new T.Vector4(1, 0, 0, 0) }; U.t = { value: 0 }; U.sw = { value: 0 }; U.dir = { value: 1 }; U.px = { value: 600 };
    var tg = new T.PlaneGeometry(18, 14, 1, 1); tg.rotateX(-Math.PI / 2);
    M.table = addMat({ uT: U.t, uSw: U.sw, uDir: U.dir, uR: { value: R }, uData: { value: 0 }, uG0: { value: new T.Vector4(0, 0.35, 0, 0) }, uG1: { value: new T.Vector4(0, 0.35, 0, 0) },
      uAcc: { value: new T.Color(1, 0.6, 0.2) }, uCut: U.cut }, VW, TABLE_FS.replace(/R1/g, R.toFixed(2)), true);
    mk(tg, M.table, 0);
    var gg = new T.RingGeometry(RG0, RG1, 160, 1); gg.rotateX(-Math.PI / 2); gg.translate(0, 0.01, 0);
    M.gauge = addMat({ uFill: { value: 0 }, uT: U.t, uOn: { value: 0 }, uCol: { value: new T.Color(1, 0.6, 0.2) }, uR0: { value: RG0 }, uR1: { value: RG1 }, uCut: U.cut }, VW, GAUGE_FS);
    mk(gg, M.gauge, 2);
    var cg = new T.CylinderGeometry(RG1 - 0.02, RG1 - 0.02, 0.42, 160, 1, true); cg.translate(0, 0.21, 0);
    M.curt = addMat({ uFill: M.gauge.uniforms.uFill, uT: U.t, uOn: M.gauge.uniforms.uOn, uCol: M.gauge.uniforms.uCol, uCut: U.cut }, CURT_VS, CURT_FS);
    mk(cg, M.curt, 3);
    // blips + stems
    var bg = new T.BufferGeometry(); bg.setAttribute("position", new T.BufferAttribute(new Float32Array(MAXB * 3), 3));
    ["aSize", "aRings", "aAng", "aBorn", "aHi"].forEach(function (a) { bg.setAttribute(a, new T.BufferAttribute(new Float32Array(MAXB), 1)); });
    bg.setDrawRange(0, 0);
    M.blip = addMat({ uT: U.t, uSw: U.sw, uDir: U.dir, uPx: U.px, uCol: { value: new T.Color(1, 0.7, 0.25) }, uCut: U.cut }, BLIP_VS, BLIP_FS);
    M.blipP = new T.Points(bg, M.blip); M.blipP.frustumCulled = false; M.blipP.renderOrder = 5; scene.add(M.blipP);
    var sg = new T.BufferGeometry(); sg.setAttribute("position", new T.BufferAttribute(new Float32Array(MAXB * 6), 3));
    sg.setAttribute("aBorn", new T.BufferAttribute(new Float32Array(MAXB * 2), 1)); sg.setAttribute("aTop", new T.BufferAttribute(new Float32Array(MAXB * 2), 1)); sg.setDrawRange(0, 0);
    M.stem = addMat({ uT: U.t, uCol: M.blip.uniforms.uCol, uCut: U.cut }, STEM_VS, STEM_FS);
    M.stemL = new T.LineSegments(sg, M.stem); M.stemL.frustumCulled = false; M.stemL.renderOrder = 4; scene.add(M.stemL);
    // lasers (ribbons)
    var lg = new T.BufferGeometry(), idx = [];
    lg.setAttribute("position", new T.BufferAttribute(new Float32Array(MAXL * 12), 3)); lg.setAttribute("aQ", new T.BufferAttribute(new Float32Array(MAXL * 8), 2)); lg.setAttribute("aC", new T.BufferAttribute(new Float32Array(MAXL * 16), 4));
    for (var i = 0; i < MAXL; i++) { var o = i * 4; idx.push(o, o + 1, o + 2, o + 2, o + 1, o + 3); var q = lg.attributes.aQ.array; q.set([0, -1, 0, 1, 1, -1, 1, 1], i * 8); }
    lg.setIndex(idx); M.las = mk(lg, addMat({}, LAS_VS, LAS_FS), 6); lg.setDrawRange(0, 0);
    // emitters + motes (one Points)
    var NM = 240, pg = new T.BufferGeometry(), pp = new Float32Array((NM + 4) * 3), ps = new Float32Array(NM + 4), ph = new Float32Array(NM + 4);
    for (i = 0; i < NM; i++) { pp[i * 3] = (hash("mx" + i) - 0.5) * 8.6; pp[i * 3 + 1] = 0.15 + hash("my" + i) * 2.4; pp[i * 3 + 2] = (hash("mz" + i) - 0.5) * 6.4; ps[i] = 0.12 + 0.5 * hash("ms" + i); ph[i] = hash("mp" + i); }
    for (i = NM; i < NM + 4; i++) { ps[i] = 7; ph[i] = 0.25 * (i - NM); }
    pg.setAttribute("position", new T.BufferAttribute(pp, 3)); pg.setAttribute("aS", new T.BufferAttribute(ps, 1)); pg.setAttribute("aPh", new T.BufferAttribute(ph, 1));
    M.motes = new T.Points(pg, addMat({ uT: U.t, uPx: U.px, uCol: { value: new T.Color(0.55, 1, 0.7) } }, PT_VS, PT_FS)); M.motes.frustumCulled = false; M.motes.renderOrder = 7; scene.add(M.motes); M.NM = NM;
  }

  /* ---------- UI ---------- */
  var CSS = ".of3{position:absolute;inset:0;overflow:hidden;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#9effc8;pointer-events:none;touch-action:pan-y;--u:6px}" +
    ".of3 canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y}" +
    ".of3-top{position:absolute;left:3.5%;right:3.5%;top:3%;display:flex;align-items:flex-end;gap:calc(var(--u)*1.6);text-shadow:0 0 calc(var(--u)*1.2) currentColor}" +
    ".of3-tt{flex:1;min-width:0}.of3-title{font-size:calc(var(--u)*3);letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#d8ffe8}" +
    ".of3-sev{font-size:calc(var(--u)*1.7);letter-spacing:.18em;text-transform:uppercase;opacity:.85;margin-top:calc(var(--u)*.4)}" +
    ".of3-lvl{text-align:right}.of3-num{font-size:calc(var(--u)*7.4);line-height:.9;font-weight:600}.of3-dl{font-size:calc(var(--u)*1.7);opacity:.9;white-space:nowrap}" +
    ".of3-tl{left:3.5%;top:17.5%}.of3-tr{right:3.5%;top:17.5%;text-align:right}.of3.tall .of3-tl,.of3.tall .of3-tr{top:13.5%}" +
    ".of3-shade{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(to top,rgba(0,0,0,.82),rgba(0,0,0,.55) 55%,transparent)}.of3-shade.t{top:0;bottom:auto;height:22%;background:linear-gradient(to bottom,rgba(0,0,0,.7),transparent)}" +
    ".of3-tel{position:absolute;font-size:calc(var(--u)*1.45);letter-spacing:.12em;color:#ffcf7a;opacity:.72;white-space:pre;line-height:1.5}" +
    ".of3-side{position:absolute;right:3.5%;top:27%;width:31%;text-shadow:0 0 calc(var(--u)*.9) currentColor}" +
    ".of3-fl{font-size:calc(var(--u)*1.5);letter-spacing:.2em;opacity:.7;color:#ffcf7a}.of3-cn{font-size:calc(var(--u)*2.6);color:#e8fff0;margin:calc(var(--u)*.3) 0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".of3-cv{font-size:calc(var(--u)*5.4);line-height:1;font-weight:600;margin-bottom:calc(var(--u)*1.4)}" +
    ".of3-row{display:grid;grid-template-columns:1fr auto;gap:0 calc(var(--u)*.8);font-size:calc(var(--u)*1.55);opacity:.5;margin:calc(var(--u)*.9) 0;transition:opacity .3s}" +
    ".of3-row.on{opacity:1;color:#fff}.of3-row span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    ".of3-bar{grid-column:1/3;height:calc(var(--u)*.55);background:rgba(120,255,190,.12);margin-top:calc(var(--u)*.35);position:relative}.of3-bar i{position:absolute;left:0;top:0;bottom:0;box-shadow:0 0 calc(var(--u)*1) currentColor}" +
    ".of3-mid{position:absolute;transform:translate(-50%,-50%);font-size:calc(var(--u)*2.1);letter-spacing:.24em;text-transform:uppercase;color:#ffcf7a;text-shadow:0 0 calc(var(--u)*1.4) currentColor;white-space:nowrap}" +
    ".of3-mid.nd{font-size:calc(var(--u)*3.6);color:#ffb43a}" +
    ".of3-bot{position:absolute;left:3.5%;right:3.5%;bottom:13.5%;font-size:calc(var(--u)*1.85);line-height:1.35;color:#e6fff0;text-shadow:0 0 calc(var(--u)*.8) rgba(120,255,190,.6)}" +
    ".of3-bot a,.of3-bot span.h{color:inherit;text-decoration:none;pointer-events:auto;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.of3-bot a:hover{text-decoration:underline}" +
    ".of3-meta{font-size:calc(var(--u)*1.45);letter-spacing:.12em;color:#ffcf7a;opacity:.8;margin-top:calc(var(--u)*.3)}" +
    ".of3-q{position:absolute;left:3.5%;right:3.5%;bottom:3%;display:flex;gap:calc(var(--u)*.6);pointer-events:auto}" +
    ".of3-q button{flex:1;min-width:0;background:rgba(10,30,20,.55);border:1px solid rgba(120,255,190,.22);color:#8fdcb4;font:inherit;font-size:calc(var(--u)*1.3);letter-spacing:.06em;padding:calc(var(--u)*.7) 0 calc(var(--u)*.5);cursor:pointer;border-radius:2px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;touch-action:pan-y;opacity:.55}" +
    ".of3-q button b{display:block;height:calc(var(--u)*.5);margin:0 18% calc(var(--u)*.5);background:currentColor;opacity:.5}" +
    ".of3-q button.on{opacity:1;color:#fff;border-color:currentColor;box-shadow:0 0 calc(var(--u)*1.6) rgba(120,255,190,.35) inset}.of3-q button.on b{opacity:1;box-shadow:0 0 calc(var(--u)*1.2) currentColor}" +
    ".of3.tall .of3-side{left:3.5%;right:3.5%;top:auto;bottom:24%;width:auto;display:grid;grid-template-columns:38% 1fr;gap:0 4%;align-items:end}.of3.tall .of3-cv{margin:0}" +
    ".of3.tall .of3-bars{display:grid;grid-template-columns:1fr 1fr;gap:0 6%}.of3.tall .of3-bot{bottom:11%}.of3.tall .of3-q{flex-wrap:wrap}.of3.tall .of3-q button{flex:0 0 calc(25% - var(--u)*.45)}" +
    ".of3.empty .of3-top,.of3.empty .of3-side,.of3.empty .of3-bot,.of3.empty .of3-tel{display:none}";
  function buildUI() {
    if (!document.getElementById("of3-css")) { var s = document.createElement("style"); s.id = "of3-css"; s.textContent = CSS; document.head.appendChild(s); }
    ui.root = document.createElement("div"); ui.root.className = "of3 empty"; el.appendChild(ui.root);
    ui.root.appendChild(ren.domElement);
    div("of3-shade"); div("of3-shade t"); ui.top = div("of3-top"); var tt = div("of3-tt", ui.top); ui.title = div("of3-title", tt); ui.sev = div("of3-sev", tt);
    var lv = div("of3-lvl", ui.top); ui.num = div("of3-num", lv); ui.dl = div("of3-dl", lv);
    ui.tl = div("of3-tel of3-tl"); ui.tr = div("of3-tel of3-tr");
    ui.side = div("of3-side"); var c = div("", ui.side); ui.fl = div("of3-fl", c); ui.cn = div("of3-cn", c); ui.cv = div("of3-cv", c); ui.bars = div("of3-bars", ui.side);
    ui.mid = div("of3-mid"); ui.bot = div("of3-bot"); ui.head = null; ui.meta = div("of3-meta", ui.bot); ui.q = div("of3-q");
  }
  function fmtTime(x, L) {
    if (x.pub != null) { try { return new Intl.DateTimeFormat(L === "en" ? "en-GB" : L, { timeZone: "Europe/Berlin", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date(x.pub)); } catch (e) {} }
    return x.time;
  }
  function renderQueue() {
    var L = lang(); ui.q.textContent = ""; ui.qb = {};
    queue.forEach(function (it, i) { var b = document.createElement("button"); b.type = "button"; var bar = document.createElement("b"); b.appendChild(bar);
      b.appendChild(document.createTextNode((NAMES[L][it.id] || it.id) + (it.ri != null ? " " + it.ri : ""))); if (it.title) b.title = it.title; b.setAttribute("aria-label", (it.title || it.id) + (it.ri != null ? " " + it.ri : ""));
      b.style.color = lvlCol(it.ri); b.addEventListener("click", function () { show(it.id); }); ui.q.appendChild(b); ui.qb[it.id] = b; });
    markQueue();
  }
  function markQueue() { for (var k in ui.qb) ui.qb[k].classList.toggle("on", !!(cur && cur.id === k)); }
  function renderHeader() {
    if (!rv) return; var L = lang(), X = TXT[L];
    txt(ui.title, rv.title); txt(ui.sev, rv.sev); ui.top.style.color = lvlCol(rv.lvl);
    txt(ui.num, rv.lvl); if (rv.lvl != null && rv.prev != null) { var d = Math.round((rv.lvl - rv.prev) * 10) / 10; txt(ui.dl, (d > 0 ? "▲ +" + d : d < 0 ? "▼ −" + Math.abs(d) : "= 0") + " " + X.vs); } else txt(ui.dl, null);
    ui.bars.textContent = ""; ui.rows = [];
    rv.facs.forEach(function (f, i) { var r = div("of3-row", ui.bars), n = div("", r, "span"), v = div("", r, "span"); txt(n, f.name); txt(v, f.value);
      if (f.value != null) { var b = div("of3-bar", r), fi = div("", b, "i"); fi.style.width = f.value + "%"; fi.style.background = lvlCol(f.value); fi.style.color = lvlCol(f.value); }
      ui.rows.push(r); });
    ui.side.style.display = rv.facs.length ? "" : "none";
  }
  function renderFactor() {
    var L = lang(), X = TXT[L], f = rv && rv.facs[curF];
    (ui.rows || []).forEach(function (r, i) { r.classList.toggle("on", i === curF); });
    if (ui.head && ui.head.parentNode) ui.head.parentNode.removeChild(ui.head); ui.head = null;
    if (!f) { txt(ui.fl, null); txt(ui.cn, null); txt(ui.cv, null); txt(ui.meta, null); } else {
      txt(ui.fl, X.factor + " " + (curF + 1) + "/" + rv.facs.length); txt(ui.cn, f.name); txt(ui.cv, f.value); ui.cv.style.color = lvlCol(f.value);
      var h = f.top; if (h) { ui.head = document.createElement(h.link ? "a" : "span"); ui.head.className = "h"; if (h.link) { ui.head.href = h.link; ui.head.target = "_blank"; ui.head.rel = "noopener noreferrer"; }
        ui.head.textContent = h.title; ui.bot.insertBefore(ui.head, ui.meta);
        var m = [h.source, fmtTime(h, L)].filter(function (x) { return isStr(x); }).join(" · "); txt(ui.meta, m || null); } else txt(ui.meta, null);
    }
    ui.midKind = !f ? (rv && rv.facs.length === 0 && rv.feed.length === 0 ? "nosig" : "") : f.hits.length ? "" : "nosig";
    telemetry();
  }
  function telemetry() {
    var X = TXT[lang()];
    if (!rv) { txt(ui.tl, null); txt(ui.tr, null); return; }
    var f = rv.facs[curF], l1 = ["RDR·" + rv.id.toUpperCase(), X.loop + " " + (loopN + 1)];
    if (rv.facs.length) l1.push("F" + (curF + 1) + "/" + rv.facs.length);
    var l2 = [X.sweep + " " + V.sper.toFixed(1) + "s " + (V.sdir > 0 ? "CCW" : "CW")]; if (rt < pauseRt) l2.push(X.paused);
    txt(ui.tl, l1.join("  ") + "\n" + l2.join("  "));
    var r1 = [], r2 = [];
    if (rv.d24 != null) r1.push(X.d24 + " " + (rv.d24 > 0 ? "+" : "") + rv.d24);
    if (f) { r1.push(X.sig + " " + f.hits.length + "/" + rv.feed.length); var mx = f.hits.reduce(function (a, x) { return x.sc != null && x.sc > a ? x.sc : a; }, -1); if (mx >= 0) r1.push(X.src + "≤" + mx); }
    if (rv.upd != null && isFinite(rv.upd)) { try { r2.push(X.upd + " " + new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" }).format(new Date(rv.upd))); } catch (e) {} }
    txt(ui.tr, r1.length || r2.length ? r1.join("  ") + (r2.length ? "\n" + r2.join("  ") : "") : null);
  }

  /* ---------- queue / state ---------- */
  function setRadar(i, manual) {
    if (!queue.length) return; i = ((i % queue.length) + queue.length) % queue.length;
    var it = queue[i]; Vprev = V; cur = { i: i, id: it.id, t0: clk }; rv = radarView(it); V = variation(it.id, loopN);
    if (!Vprev) Vprev = V; radRt = rt; curF = -1;
    M.table.uniforms.uG0.value.set(Vprev.grid, Vprev.gsc, Vprev.grot, 0); M.table.uniforms.uG1.value.set(V.grid, V.gsc, V.grot, 0);
    wipe.dx = Math.cos(V.wd); wipe.dz = Math.sin(V.wd); emitters();
    renderHeader(); markQueue(); setFactor(0); dirty = true;
  }
  function emitters() {
    // projectors stand on the far side / flanks of the table (seen from this radar's camera), never near the viewer
    emit = []; var OFF = [-1.75, -0.6, 0.6, 1.75];
    for (var k = 0; k < 4; k++) { var j = (k + V.le) % 4, a = hash(V.bseed + "e" + k), th = V.az + Math.PI + OFF[j] * V.lsp + (a - 0.5) * 0.25, rr = 4.3 + a * 0.8;
      emit.push(new T.Vector3(Math.sin(th) * rr, V.lh * (0.8 + 0.4 * hash(V.bseed + "h" + k)), Math.cos(th) * rr)); }
  }
  function setFactor(fi) {
    curF = rv.facs.length ? clamp(fi, 0, rv.facs.length - 1) : -1; facRt = rt;
    var f = rv.facs[curF], g = M.blipP.geometry, sgm = M.stemL.geometry, n = 0, list = f ? f.hits.slice(0, MAXB) : [];
    var order = list.map(function (x, i) { return { i: i, h: hash(V.bseed + "|" + curF + "|" + x.title) }; }).sort(function (a, b) { return a.h - b.h; });
    var P = g.attributes.position.array, S = g.attributes.aSize.array, RR = g.attributes.aRings.array, AN = g.attributes.aAng.array, B = g.attributes.aBorn.array, HI = g.attributes.aHi.array;
    var SP = sgm.attributes.position.array, SB = sgm.attributes.aBorn.array, ST = sgm.attributes.aTop.array, nowMs = Date.now();
    M.blipPos = [];
    order.forEach(function (o, rank) {
      var x = list[o.i], ang = hash(x.link || x.title) * 6.2832 + V.brot;
      var age = x.pub != null ? clamp(Math.log(1 + Math.max(0, (nowMs - x.pub) / 3600000)) / Math.log(49), 0, 1) : hash(x.title + "r");
      var rad = R * (0.2 + 0.72 * age), w = x.w != null ? clamp(x.w / 100, 0, 1) : 0.15, hgt = 0.08 + 0.32 * w;
      var px = Math.cos(ang) * rad, pz = Math.sin(ang) * rad, born = rt + (reduce ? -9 : 0.5 + rank * 0.24);
      P[n * 3] = px; P[n * 3 + 1] = hgt; P[n * 3 + 2] = pz; S[n] = w; RR[n] = x.sc != null ? clamp(Math.round(x.sc), 0, 6) : 0; AN[n] = Math.atan2(pz, px); B[n] = born; HI[n] = x === f.top ? 1 : 0;
      SP.set([px, 0, pz, px, hgt, pz], n * 6); SB[n * 2] = SB[n * 2 + 1] = born; ST[n * 2] = 0; ST[n * 2 + 1] = 1;
      M.blipPos.push({ p: new T.Vector3(px, hgt, pz), born: born }); n++;
    });
    for (var a in g.attributes) g.attributes[a].needsUpdate = true; for (a in sgm.attributes) sgm.attributes[a].needsUpdate = true;
    g.setDrawRange(0, n); sgm.setDrawRange(0, n * 2);
    var c = lvlRGB(f ? f.value : null); M.gauge.uniforms.uCol.value.setRGB(c[0], c[1], c[2]).convertSRGBToLinear();
    M.gauge.uniforms.uOn.value = f && f.value != null ? 1 : 0;
    renderFactor(); dirty = true;
  }
  function advance() { var i = cur.i + 1; if (i >= queue.length) { i = 0; loopN++; } setRadar(i); }
  function step(dt) {
    rt += dt; if (!queue.length || !cur) return;
    clk += dt * opts.timeScale;
    var nF = Math.max(1, rv.facs.length), total = nF * SLOT, t = clk - cur.t0, paused = rt < pauseRt;
    if (t >= total) { if (paused || queue.length < 2) { cur.t0 += total * Math.floor(t / total); if (rv.facs.length > 1 || queue.length < 2) setFactor(0); } else { advance(); return; } t = clk - cur.t0; }
    var fi = Math.min(Math.floor(t / SLOT), nF - 1); if (rv.facs.length && fi !== curF) setFactor(fi);
    var wE = WIPE * opts.timeScale;
    if (!reduce && !paused && queue.length > 1 && t > total - wE) { wipe.mode = 2; wipe.pos = -WL + 2 * WL * sm(total - wE, total, t); }
    else if (!reduce && rt - radRt < WIPE) { wipe.mode = 1; wipe.pos = -WL + 2 * WL * sm(0, WIPE, rt - radRt); }
    else { wipe.mode = 0; if (Vprev !== V) { Vprev = V; M.table.uniforms.uG0.value.copy(M.table.uniforms.uG1.value); } }
  }

  /* ---------- lasers ---------- */
  var tmpA, tmpB, tmpC, tmpD, nL = 0;
  function beam(A, B, w, r, g, b, a) {
    if (nL >= MAXL || a <= 0.003) return; var geo = M.las.geometry, P = geo.attributes.position.array, C = geo.attributes.aC.array;
    tmpC.subVectors(B, A); tmpD.addVectors(A, B).multiplyScalar(0.5).sub(cam.position).normalize(); tmpD.crossVectors(tmpC, tmpD).normalize();
    var o = nL * 12, wa = w * 0.5, wb = w;
    P[o] = A.x - tmpD.x * wa; P[o + 1] = A.y - tmpD.y * wa; P[o + 2] = A.z - tmpD.z * wa; P[o + 3] = A.x + tmpD.x * wa; P[o + 4] = A.y + tmpD.y * wa; P[o + 5] = A.z + tmpD.z * wa;
    P[o + 6] = B.x - tmpD.x * wb; P[o + 7] = B.y - tmpD.y * wb; P[o + 8] = B.z - tmpD.z * wb; P[o + 9] = B.x + tmpD.x * wb; P[o + 10] = B.y + tmpD.y * wb; P[o + 11] = B.z + tmpD.z * wb;
    for (var k = 0; k < 4; k++) C.set([r, g, b, a], nL * 16 + k * 4); nL++;
  }
  function lasers() {
    nL = 0; if (!emit.length) { M.las.geometry.setDrawRange(0, 0); return; }
    var f = rv && rv.facs[curF], G = [0.35, 1, 0.6], Am = [1, 0.62, 0.2];
    // sweep tip
    tmpA.set(Math.cos(sweep) * R, 0.0, Math.sin(sweep) * R); beam(emit[3], tmpA, 0.03, G[0], G[1], G[2], 0.28);
    if (f && f.value != null && wipe.mode !== 2) { var fv = M.gauge.uniforms.uFill.value, a = fv * 6.2832, k = clamp(1 - (rt - facRt - 0.9) / 0.8, 0.32, 1), c = M.gauge.uniforms.uCol.value;
      tmpA.set(Math.sin(a) * (RG0 + RG1) * 0.5, 0.02, -Math.cos(a) * (RG0 + RG1) * 0.5); beam(emit[0], tmpA, 0.045, c.r * 1.6, c.g * 1.6, c.b * 1.6, k); }
    if (M.blipPos && wipe.mode !== 2) M.blipPos.forEach(function (b, i) { var e = rt - b.born; if (e < -0.05 || e > 0.7) return; beam(emit[1 + (i % 2)], b.p, 0.035, Am[0], Am[1], Am[2], (1 - e / 0.7) * 1.1); });
    if (wipe.mode === 1 || wipe.mode === 2) { var half = Math.sqrt(Math.max(0, 2.1 * 2.1 - wipe.pos * wipe.pos)); if (half > 0.01) {
      var cx = wipe.dx * wipe.pos, cz = wipe.dz * wipe.pos; tmpA.set(cx - wipe.dz * half, 0, cz + wipe.dx * half); tmpB.set(cx + wipe.dz * half, 0, cz - wipe.dx * half);
      beam(emit[1], tmpA, 0.05, Am[0], Am[1], Am[2], 1); beam(emit[2], tmpB, 0.05, Am[0], Am[1], Am[2], 1); } }
    var geo = M.las.geometry; geo.attributes.position.needsUpdate = true; geo.attributes.aC.needsUpdate = true; geo.setDrawRange(0, nL * 6);
    var mp = M.motes.geometry.attributes.position; for (var j = 0; j < 4; j++) { mp.array.set([emit[j].x, emit[j].y, emit[j].z], (M.NM + j) * 3); } mp.needsUpdate = true;
  }

  /* ---------- camera ---------- */
  function placeCam(dt, snap) {
    var tv = V || { az: 0, el: 1.05, d: 1, drift: 1 }, k = snap || reduce ? 1 : 1 - Math.exp(-dt * 1.6);
    if (!camS.init) { camS.az = tv.az; camS.el = tv.el; camS.d = tv.d; camS.init = true; }
    camS.az += (tv.az - camS.az) * k; camS.el += (tv.el - camS.el) * k; camS.d += (tv.d - camS.d) * k;
    var az = camS.az + (reduce ? 0 : Math.sin(rt * 0.11) * 0.06 * tv.drift), elv = camS.el + (reduce ? 0 : Math.sin(rt * 0.07 + 1) * 0.03);
    var asp = W / H, fy = tall ? 0.47 : 0.6, fx = tall ? 0.88 : 0.56, cx = tall ? 0.5 : 0.355, cy = tall ? 0.385 : 0.5;
    var th = Math.tan(cam.fov * Math.PI / 360), d = (RG1 + 0.25) / (th * Math.min(fy, fx * asp)) * camS.d * (0.82 + 0.18 * Math.sin(elv));
    cam.position.set(Math.sin(az) * Math.cos(elv) * d, Math.sin(elv) * d, Math.cos(az) * Math.cos(elv) * d); cam.up.set(0, 1, 0); cam.lookAt(0, 0.05, 0);
    cam.setViewOffset(W, H, (0.5 - cx) * W, (0.5 - cy) * H, W, H); cam.updateMatrixWorld();
  }

  /* ---------- post (as orbcore3d) ---------- */
  function rtt(w, h, ms) { var o = { minFilter: T.LinearFilter, magFilter: T.LinearFilter, format: T.RGBAFormat, type: st.hdr ? T.HalfFloatType : T.UnsignedByteType, depthBuffer: false, stencilBuffer: false };
    var r = ms && T.WebGLMultisampleRenderTarget ? new T.WebGLMultisampleRenderTarget(w, h, o) : new T.WebGLRenderTarget(w, h, o); if (ms) r.samples = 4; return r; }
  var FSV = "varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position.xy,0.,1.); }";
  function fsMat(u, fs) { return new T.ShaderMaterial({ uniforms: u, vertexShader: FSV, fragmentShader: fs, depthTest: false, depthWrite: false }); }
  function setupPost() {
    var w2 = ren.capabilities.isWebGL2;
    st.hdr = !!(w2 ? ren.extensions.get("EXT_color_buffer_float") : (ren.extensions.get("OES_texture_half_float") && ren.extensions.get("EXT_color_buffer_half_float") && ren.extensions.get("OES_texture_half_float_linear")));
    RT.scene = rtt(4, 4, w2); RT.a1 = rtt(4, 4); RT.b1 = rtt(4, 4); RT.a2 = rtt(4, 4); RT.b2 = rtt(4, 4);
    FS.scene = new T.Scene(); FS.cam = new T.OrthographicCamera(-1, 1, 1, -1, 0, 1); FS.q = new T.Mesh(new T.PlaneGeometry(2, 2)); FS.q.frustumCulled = false; FS.scene.add(FS.q);
    FS.bright = fsMat({ t: { value: null }, uPx: { value: new T.Vector2() }, uTh: { value: st.hdr ? 0.6 : 0.42 } },
      "uniform sampler2D t; uniform vec2 uPx; uniform float uTh; varying vec2 vUv; void main(){ vec3 c=(texture2D(t,vUv-uPx).rgb+texture2D(t,vUv+uPx*vec2(1.,-1.)).rgb+texture2D(t,vUv+uPx*vec2(-1.,1.)).rgb+texture2D(t,vUv+uPx).rgb)*0.25; float l=max(c.r,max(c.g,c.b)); float k=max(l-uTh,0.)/max(l,1e-4); gl_FragColor=vec4(min(c*k,vec3(30.)),1.); }");
    FS.blur = fsMat({ t: { value: null }, uD: { value: new T.Vector2() } },
      "uniform sampler2D t; uniform vec2 uD; varying vec2 vUv; void main(){ vec3 c=texture2D(t,vUv).rgb*0.227; c+=(texture2D(t,vUv+uD*1.385).rgb+texture2D(t,vUv-uD*1.385).rgb)*0.316; c+=(texture2D(t,vUv+uD*3.231).rgb+texture2D(t,vUv-uD*3.231).rgb)*0.07; gl_FragColor=vec4(c,1.); }");
    FS.copy = fsMat({ t: { value: null } }, "uniform sampler2D t; varying vec2 vUv; void main(){ gl_FragColor=texture2D(t,vUv); }");
    FS.comp = fsMat({ tS: { value: null }, t1: { value: null }, t2: { value: null }, uExp: { value: 1.1 }, uT: U.t },
      "uniform sampler2D tS,t1,t2; uniform float uExp,uT; varying vec2 vUv; vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.,1.); }\n" +
      "void main(){ vec2 o=vec2(0.0012,0.); vec3 c=vec3(texture2D(tS,vUv+o).r,texture2D(tS,vUv).g,texture2D(tS,vUv-o).b)+texture2D(t1,vUv).rgb*0.6+texture2D(t2,vUv).rgb*0.75; vec2 q=vUv-0.5; c*=1.-dot(q,q)*0.9;\n" +
      " c*=0.96+0.04*sin(gl_FragCoord.y*1.7); c=aces(c*uExp); c=pow(c,vec3(1./2.2)); float d=fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453); c+=(d-0.5)/255.; gl_FragColor=vec4(c,1.); }");
  }
  function pass(m, target) { FS.q.material = m; ren.setRenderTarget(target); ren.render(FS.scene, FS.cam); }
  function blur2(a, b, k) { FS.blur.uniforms.t.value = a.texture; FS.blur.uniforms.uD.value.set(k / a.width, 0); pass(FS.blur, b); FS.blur.uniforms.t.value = b.texture; FS.blur.uniforms.uD.value.set(0, k / a.height); pass(FS.blur, a); }
  function renderAll() {
    ren.info.reset(); ren.setRenderTarget(RT.scene); ren.clear(); ren.render(scene, cam); var tri = ren.info.render.triangles;
    FS.bright.uniforms.t.value = RT.scene.texture; pass(FS.bright, RT.a1); blur2(RT.a1, RT.b1, 1);
    FS.copy.uniforms.t.value = RT.a1.texture; pass(FS.copy, RT.a2); blur2(RT.a2, RT.b2, 1.6);
    FS.comp.uniforms.tS.value = RT.scene.texture; FS.comp.uniforms.t1.value = RT.a1.texture; FS.comp.uniforms.t2.value = RT.a2.texture; pass(FS.comp, null);
    st.calls = ren.info.render.calls; st.tris = ren.info.render.triangles; st.sceneTris = tri;
  }
  function resize() {
    var w = Math.max(2, el.clientWidth), h = Math.max(2, el.clientHeight), pr = Math.min(window.devicePixelRatio || 1, 2);
    W = w; H = h; tall = w / h < 0.95; ui.root.classList.toggle("tall", tall); ui.root.style.setProperty("--u", (Math.min(w, h * 1.33) / 100).toFixed(2) + "px");
    ren.setPixelRatio(pr); ren.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
    var Wp = Math.floor(w * pr), Hp = Math.floor(h * pr);
    RT.scene.setSize(Wp, Hp); RT.a1.setSize(Wp >> 2, Hp >> 2); RT.b1.setSize(Wp >> 2, Hp >> 2); RT.a2.setSize(Wp >> 3, Hp >> 3); RT.b2.setSize(Wp >> 3, Hp >> 3);
    FS.bright.uniforms.uPx.value.set(1 / Wp, 1 / Hp); U.px.value = Hp / (2 * Math.tan(cam.fov * Math.PI / 360));
    dirty = true; if (reduce || !raf) frame(true);
  }

  /* ---------- frame ---------- */
  function frame(force) {
    raf = 0; if (!ok) return;
    var n = now(), dt = lastNow == null ? 0 : clamp((n - lastNow) / 1000, 0, 0.1); lastNow = n;
    if (lang() !== lastLang) { lastLang = lang(); if (gotData) { queue = buildQueue(); var keep = cur && cur.id; renderQueue(); if (cur) { rv = radarView(queue[cur.i] && queue[cur.i].id === keep ? queue[cur.i] : queue[0]); renderHeader(); renderFactor(); } } }
    if (!reduce) step(dt);
    var Vc = V || { sdir: 1, sper: 3.2 };
    if (!reduce) sweep += dt * 6.2832 / Vc.sper * Vc.sdir; else sweep = V ? V.brot : 0.9;
    U.t.value = rt; U.sw.value = sweep; U.dir.value = Vc.sdir;
    U.cut.value.set(wipe.dx, wipe.dz, wipe.pos, wipe.mode);
    var f = rv && rv.facs[curF], target = f && f.value != null ? f.value / 100 : 0;
    M.gauge.uniforms.uFill.value = reduce ? target : target * sm(0.15, 1.05, (rt - facRt) / Math.max(0.6, Math.min(1, opts.timeScale > 1 ? 0.6 : 1)));
    M.table.uniforms.uData.value = queue.length ? 1 : 0; var acc = lvlRGB(rv ? rv.lvl : null); M.table.uniforms.uAcc.value.setRGB(acc[0], acc[1] * 0.9, acc[2]);
    placeCam(dt, force && !camS.init); lasers();
    // centre label (no signals / no data)
    var kind = !gotData ? "" : failed || !queue.length ? "nodata" : ui.midKind || "";
    if (kind) { tmpA.set(0, 0.02, 0).project(cam); ui.mid.style.left = ((tmpA.x * 0.5 + 0.5) * 100).toFixed(2) + "%"; ui.mid.style.top = ((-tmpA.y * 0.5 + 0.5) * 100).toFixed(2) + "%"; }
    var X = TXT[lang()]; txt(ui.mid, kind ? X[kind] : null); ui.mid.classList.toggle("nd", kind === "nodata");
    if (!reduce && (st.frames % 30 === 0)) telemetry();
    renderAll(); st.frames++; dirty = false;
    var rn = now(); fpsT.push(rn); while (fpsT.length > 40) fpsT.shift(); if (fpsT.length > 2 && fpsT[fpsT.length - 1] > fpsT[0]) st.fps = Math.round((fpsT.length - 1) / ((fpsT[fpsT.length - 1] - fpsT[0]) / 1000) * 10) / 10;
    loop();
  }
  function loop() { if (!reduce && !raf && ren && ok && onScreen && !document.hidden) { if (lastNow != null && !raf) {} raf = requestAnimationFrame(function () { frame(false); }); } else if (!raf) lastNow = null; }
  function rmTick() { // reduced motion: no animation, factor/radar switch every 3 s / ~12 s while visible
    if (!ok || !onScreen || document.hidden || !queue.length || !cur) return;
    var paused = rt < pauseRt; rt += 1; clk += 1;
    var nF = Math.max(1, rv.facs.length), t = clk - cur.t0;
    if (t >= nF * SLOT) { if (paused || queue.length < 2) { cur.t0 = clk; setFactor(0); } else advance(); }
    else { var fi = Math.min(Math.floor(t / SLOT), nF - 1); if (rv.facs.length && fi !== curF) setFactor(fi); }
    var key = cur.id + "|" + curF; if (key !== rmKey) { rmKey = key; lastNow = null; frame(true); }
  }

  /* ---------- API ---------- */
  function init(target, o) {
    try {
      if (ok) destroy(); if (!target || !window.THREE) return false; T = window.THREE; el = target; opts = { timeScale: 1 };
      if (o && num(o.timeScale) && o.timeScale > 0) opts.timeScale = o.timeScale;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      el.style.touchAction = "pan-y";
      ren = new T.WebGLRenderer({ antialias: false, alpha: false, powerPreference: "high-performance" }); ren.setClearColor(0x000000, 1); ren.info.autoReset = false; ren.outputEncoding = T.LinearEncoding;
      scene = new T.Scene(); cam = new T.PerspectiveCamera(34, 4 / 3, 0.1, 60);
      tmpA = new T.Vector3(); tmpB = new T.Vector3(); tmpC = new T.Vector3(); tmpD = new T.Vector3();
      setupPost(); buildScene(); buildUI(); ok = true; lastLang = lang();
      if ("ResizeObserver" in window) { ro = new ResizeObserver(resize); ro.observe(el); } else on(window, "resize", resize);
      if ("IntersectionObserver" in window) { io = new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; if (onScreen) { lastNow = null; loop(); } }, { threshold: 0.02 }); io.observe(el); }
      on(document, "visibilitychange", function () { lastNow = null; loop(); });
      if (reduce) rmTimer = setInterval(rmTick, 1000);
      resize(); loop(); return true;
    } catch (e) { if (window.console) console.warn("[OrbFactor3D] init failed", e); try { destroy(); } catch (e2) {} ok = false; return false; }
  }
  function update(data) {
    if (!ok) return; gotData = true;
    try {
      data = data || {}; radarsIn = data.radars || null; detailsIn = data.details && typeof data.details === "object" ? data.details : {};
      var keep = cur && cur.id; queue = buildQueue(); failed = !queue.length;
    } catch (e) { queue = []; failed = true; }
    ui.root.classList.toggle("empty", !queue.length);
    renderQueue();
    if (!queue.length) { cur = null; rv = null; V = null; emit = []; M.blipP.geometry.setDrawRange(0, 0); M.stemL.geometry.setDrawRange(0, 0); M.gauge.uniforms.uOn.value = 0; wipe.mode = 0; telemetry(); }
    else { var j = -1; if (keep) queue.forEach(function (q, i) { if (q.id === keep) j = i; });
      if (j >= 0) { var t0 = cur.t0, fi = curF; cur.i = j; rv = radarView(queue[j]); renderHeader(); curF = -1; setFactor(Math.max(0, fi)); cur.t0 = t0; markQueue(); }
      else setRadar(0); }
    dirty = true; lastNow = null; frame(true);
  }
  function show(id, keepAuto) { if (!ok || !queue.length) return false; for (var i = 0; i < queue.length; i++) if (queue[i].id === id) { if (!keepAuto) pauseRt = rt + PAUSE; setRadar(i, true); rmKey = ""; if (reduce) { rmKey = cur.id + "|" + curF; frame(true); } return true; } return false; }
  function next() { if (!ok || !queue.length || !cur) return false; advance(); if (reduce) { rmKey = cur.id + "|" + curF; frame(true); } return true; }
  function stats() {
    var f = rv && rv.facs[curF];
    return { frames: st.frames, triangles: st.tris, sceneTriangles: st.sceneTris, calls: st.calls, fps: st.fps, hdr: st.hdr, state: !gotData ? "waiting" : queue.length ? "live" : "nodata",
      order: queue.map(function (q) { return q.id + ":" + q.ri; }), current: cur ? cur.id : null, factor: f ? f.name : null, factorIndex: curF, loop: loopN,
      signals: f ? f.hits.length : 0, feed: rv ? rv.feed.length : 0, paused: rt < pauseRt, wipe: wipe.mode,
      variation: V ? { camAz: +V.az.toFixed(2), camEl: +V.el.toFixed(2), sweep: (V.sdir > 0 ? "ccw " : "cw ") + V.sper.toFixed(2) + "s", grid: ["square", "polar", "tri"][V.grid], lasers: V.le } : null,
      lang: lang(), reducedMotion: reduce, timeScale: opts.timeScale };
  }
  function destroy() {
    if (raf) cancelAnimationFrame(raf); raf = 0; if (rmTimer) clearInterval(rmTimer); rmTimer = 0;
    if (io) io.disconnect(); if (ro) ro.disconnect(); io = ro = null; listeners.forEach(function (l) { l[0].removeEventListener(l[1], l[2], l[3]); }); listeners = [];
    if (scene) scene.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    for (var k in RT) RT[k].dispose(); for (k in FS) if (FS[k] && FS[k].isMaterial) FS[k].dispose(); if (FS.q) FS.q.geometry.dispose();
    if (ren) { ren.dispose(); } if (ui.root && ui.root.parentNode) ui.root.parentNode.removeChild(ui.root);
    ok = false; ren = null; scene = null; M = {}; RT = {}; FS = {}; ui = {}; queue = []; cur = null; rv = null; V = Vprev = null; camS.init = false; gotData = false; failed = false; loopN = 0; clk = rt = 0; lastNow = null; pauseRt = -1e9;
  }
  window.OrbFactor3D = { init: init, update: update, show: show, next: next, stats: stats, destroy: destroy };
})();
