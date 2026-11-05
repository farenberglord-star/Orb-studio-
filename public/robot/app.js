import { SERVICE_UUID, CHAR_UUID, Reassembler, Sequencer, hexToBytes, bytesToHex, chunks, validateSteps } from "/robot/framing.js?v=o1";

const $ = (id) => document.getElementById(id);
let ws = null, wsTries = 0, relayOk = false, stopRelay = false;
const log = (m) => { const l = $("log"); l.textContent = new Date().toLocaleTimeString("ru-RU") + "  " + m + "\n" + l.textContent.slice(0, 20000); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const setSt = (id, ok, txt) => { $(id).textContent = txt; $(id).className = "st" + (ok ? " ok" : ""); };
const warn = (txt) => { $("warn").textContent = txt; $("warn").style.display = txt ? "block" : "none"; };

// ---- pairing token: from #k=... once, then remembered on this tablet ----
// (a) legacy link #k=...  (b) device token from code pairing. Both stored as emoPairToken.
let token = new URLSearchParams(location.hash.slice(1)).get("k");
if (token) { localStorage.setItem("orbEmoToken", token); history.replaceState(null, "", location.pathname); }
else token = localStorage.getItem("orbEmoToken");
// per-tab pairing secret: proves to the relay that this page asked for the code
let pairSecret = sessionStorage.getItem("orbEmoPairSecret");
if (!pairSecret) { const b = new Uint8Array(24); crypto.getRandomValues(b); pairSecret = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join(""); sessionStorage.setItem("orbEmoPairSecret", pairSecret); }
let pairTimer = null;
function showCode(code, exp) {
  $("pair").style.display = "block";
  $("code").textContent = code.slice(0, 3) + " " + code.slice(3);
  clearInterval(pairTimer);
  const tick = () => { const s = Math.max(0, Math.round((exp - Date.now()) / 1000)); $("codeTtl").textContent = s ? `Код действует ещё ${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}` : "Код истёк, получаю новый…"; };
  tick(); pairTimer = setInterval(tick, 1000);
}
function hideCode() { $("pair").style.display = "none"; clearInterval(pairTimer); }

// ---- diagnostics to the relay (GET /api/diag) ----
const diagQueue = [];
function diag(ev, detail) {
  const m = { type: "diag", ev, detail: detail == null ? null : String(detail).slice(0, 200), vis: document.visibilityState, at: Date.now() };
  if (relayOk && ws && ws.readyState === 1) ws.send(JSON.stringify(m));
  else { diagQueue.push(m); if (diagQueue.length > 50) diagQueue.shift(); }
}
const withTimeout = (p, ms, msg) => Promise.race([p, new Promise((_, bad) => setTimeout(() => bad(new Error(msg)), ms))]);

// ---- Bluetooth ----
let dev = null, chr = null, wantBle = localStorage.getItem("emoWantBle") === "1", wakeLock = null;
let linking = null, reconnectTimer = null, bleTries = 0, bleDrops = 0, lastBleIo = 0, busy = 0, keepaliveFails = 0;
let presets = null;
const rx = new Reassembler();
const seq = new Sequencer(1 + Math.floor(Math.random() * 200));
let waiting = null; // {ok, bad, expect}
const bleUp = () => !!(chr && dev && dev.gatt.connected);

function onNotify(ev) {
  lastBleIo = Date.now();
  const v = ev.target.value;
  const r = rx.push(new Uint8Array(v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength)));
  if (!r) return;
  if (r.type === "event") { send({ type: "event", hex: r.hex }); return; }
  if (!waiting) return;                       // late reply (e.g. to a dance): ignore
  const t = r.type === "response" && r.json && r.json.type;
  if (waiting.expect && t && t !== waiting.expect) { log("пропущен чужой ответ " + t); return; }
  const w = waiting; waiting = null; w.ok(r);
}
async function write(bytes) {
  try { await chr.writeValueWithoutResponse(bytes); }
  catch (e) { for (const c of chunks(bytes, 20)) await chr.writeValueWithoutResponse(c); }
  lastBleIo = Date.now();
}
function expectedReply(bytes) {
  try { const t = JSON.parse(new TextDecoder().decode(bytes.slice(4))).type; return /_req$/.test(t) ? t.replace(/_req$/, "_rsp") : null; } catch { return null; }
}
function waitReply(ms, expect) {
  return new Promise((ok, bad) => {
    const t = setTimeout(() => { if (waiting && waiting.ok === done) waiting = null; bad(new Error("EMO не ответил")); }, ms);
    const done = (r) => { clearTimeout(t); ok(r); };
    waiting = { ok: done, bad: (e) => { clearTimeout(t); bad(e); }, expect };
  });
}

function linkUp() {
  if (linking) return linking;
  linking = (async () => {
    setSt("stBle", false, "Робот EMO: подключаюсь…");
    try {
      const server = await withTimeout(dev.gatt.connect(), 15000, "нет ответа на подключение (15 с)");
      const svc = await withTimeout(server.getPrimaryService(SERVICE_UUID), 10000, "нет сервиса EMO");
      const c = await withTimeout(svc.getCharacteristic(CHAR_UUID), 10000, "нет характеристики EMO");
      c.removeEventListener("characteristicvaluechanged", onNotify);
      c.addEventListener("characteristicvaluechanged", onNotify);
      await withTimeout(c.startNotifications(), 10000, "не включились уведомления");
      chr = c; rx.reset(); bleTries = 0; keepaliveFails = 0; lastBleIo = Date.now();
      localStorage.setItem("emoDeviceId", dev.id); localStorage.setItem("emoWantBle", "1");
      setSt("stBle", true, "Робот EMO: подключён (" + (dev.name || "EMO") + ")");
      log("EMO подключён " + (dev.name || "")); diag("ble_connected", dev.name); sendStatus();
      enableAlerts();
    } catch (e) {
      chr = null;
      try { dev.gatt.disconnect(); } catch {}   // cancels a hung connect on Android
      throw e;
    } finally { linking = null; }
  })();
  return linking;
}
function scheduleReconnect(now = false) {
  if (!wantBle || !dev || reconnectTimer || linking || bleUp()) return;
  const wait = now ? 300 : Math.min(1000 * 2 ** Math.min(bleTries, 5), 30000);
  bleTries++;
  setSt("stBle", false, `Робот EMO: связь потеряна, переподключаюсь (попытка ${bleTries}${wait > 1000 ? ", через " + Math.round(wait / 1000) + " с" : ""})…` + (bleTries > 6 ? " Проверьте, что EMO включён и рядом." : ""));
  reconnectTimer = setTimeout(async () => {
    reconnectTimer = null;
    if (!wantBle || bleUp()) return;
    try { await linkUp(); }
    catch (e) { log("повтор не удался: " + e.message); diag("ble_reconnect_failed", e.message); scheduleReconnect(); }
  }, wait);
}
function onBleLost() {
  if (linking) return;                         // our own cancel inside linkUp
  chr = null; rx.reset(); bleDrops++;
  if (waiting) { const w = waiting; waiting = null; w.bad(new Error("связь с EMO прервалась")); }
  log("EMO отключился (" + bleDrops + "-й раз)"); diag("ble_disconnected", "drops=" + bleDrops); sendStatus();
  scheduleReconnect();
}
function useDevice(d) {
  if (dev && dev !== d) dev.removeEventListener("gattserverdisconnected", onBleLost);
  dev = d;
  dev.removeEventListener("gattserverdisconnected", onBleLost);
  dev.addEventListener("gattserverdisconnected", onBleLost);
}
async function keepAwake() {
  if (!("wakeLock" in navigator) || document.visibilityState !== "visible" || (wakeLock && !wakeLock.released)) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => { diag("wakelock_released"); if (document.visibilityState === "visible") setTimeout(keepAwake, 1000); });
  } catch (e) { diag("wakelock_failed", e.message); }
}
$("connect").onclick = async () => {
  keepAwake();
  try {
    const all = new URLSearchParams(location.search).has("all"); // ?all=1 — показать все устройства (если EMO называется иначе)
    const d = await navigator.bluetooth.requestDevice(all ? { acceptAllDevices: true, optionalServices: [SERVICE_UUID] } : { filters: [{ services: [SERVICE_UUID] }, { namePrefix: "EMO" }, { namePrefix: "Emo" }, { namePrefix: "emo" }], optionalServices: [SERVICE_UUID] });
    diag("ble_chosen", (d && d.name) || "без имени");
    useDevice(d); wantBle = true; bleTries = 0;
    clearTimeout(reconnectTimer); reconnectTimer = null;
    await linkUp();
  } catch (e) {
    log("ошибка подключения: " + e.message); diag("ble_connect_error", e.message);
    if (dev && wantBle) scheduleReconnect(); else setSt("stBle", false, "Робот EMO: ошибка — " + e.message);
  }
};
$("disc").onclick = () => {
  wantBle = false; localStorage.setItem("emoWantBle", "0");
  clearTimeout(reconnectTimer); reconnectTimer = null;
  if (dev && dev.gatt.connected) dev.gatt.disconnect();
  setSt("stBle", false, "Робот EMO: отключён"); sendStatus();
};
document.addEventListener("click", keepAwake);
document.addEventListener("visibilitychange", () => {
  diag(document.visibilityState === "visible" ? "page_visible" : "page_hidden");
  if (document.visibilityState !== "visible") return;
  keepAwake();
  if (!ws || ws.readyState > 1) connectRelay();
keepAwake();
restoreDevice();
  if (wantBle && dev && !bleUp()) { clearTimeout(reconnectTimer); reconnectTimer = null; bleTries = 0; scheduleReconnect(true); }
});
// remembered robot: reconnect after a page reload without the chooser (Chrome getDevices)
async function restoreDevice() {
  if (!navigator.bluetooth || !navigator.bluetooth.getDevices || !wantBle) return;
  try {
    const list = await navigator.bluetooth.getDevices();
    const id = localStorage.getItem("emoDeviceId");
    const d = list.find((x) => x.id === id) || list.find((x) => (x.name || "").startsWith("EMO"));
    if (!d) { diag("restore_none", list.length); return; }
    useDevice(d); log("найден сохранённый робот " + (d.name || "")); diag("restore_found", d.name);
    try { await linkUp(); } catch (e) { log("автоподключение: " + e.message); scheduleReconnect(); }
  } catch (e) { diag("restore_failed", e.message); }
}
// keepalive: a light state query when the link has been quiet; two misses in a row -> force reconnect
setInterval(async () => {
  if (!bleUp() || busy || Date.now() - lastBleIo < 20000 || !presets) return;
  try { await runSteps(validateSteps(presets.version.steps), true); keepaliveFails = 0; }
  catch (e) {
    keepaliveFails++; diag("keepalive_failed", e.message + " x" + keepaliveFails);
    if (keepaliveFails >= 2 && dev) { keepaliveFails = 0; log("EMO не отвечает, переподключаюсь"); try { dev.gatt.disconnect(); } catch {} }
  }
}, 25000);
function enableAlerts() {
  if (!presets || !presets.alerts_on) return;
  runSteps(validateSteps(presets.alerts_on.steps), true).then(() => log("события EMO включены")).catch((e) => log("события: " + e.message));
}

// ---- jobs (one at a time) ----
let chain = Promise.resolve();
function runSteps(steps, quiet = false) {
  const p = chain.then(async () => {
    busy++;
    try {
      const results = [];
      for (const s of steps) {
        if (s.kind === "sleep") { await sleep(s.ms); continue; }
        if (!bleUp()) throw Object.assign(new Error("EMO не подключён"), { results });
        const bytes = seq.apply(hexToBytes(s.hex));
        if (s.kind === "request") {
          const resp = waitReply(s.noreply ? 1500 : 9000, expectedReply(bytes));
          resp.catch(() => {});
          await write(bytes);
          let r = null;
          try { r = await resp; }
          catch (e) { if (!s.noreply) { e.results = results; throw e; } }
          if (r === null) results.push({ label: s.label, ok: true, response: null, note: "команда отправлена, EMO не отвечает на неё (это нормально)" });
          else results.push({ label: s.label, ok: r.type === "response", response: r.type === "response" ? r.json : null, error: r.type === "error" ? r.error : null });
        } else {
          await write(bytes);
          results.push({ label: s.label, ok: true });
        }
      }
      return results;
    } finally { busy--; }
  });
  chain = p.catch(() => {});
  return p;
}

// ---- relay WebSocket ----
function send(m) { if (ws && ws.readyState === 1 && relayOk) ws.send(JSON.stringify(m)); }
function sendStatus() { send({ type: "status", ble: bleUp(), name: dev ? dev.name || null : null }); }
function connectRelay() {
  if (stopRelay) return;
  if (ws && ws.readyState <= 1) return;
  try { ws = new WebSocket((location.protocol === "https:" ? "wss://" : "ws://") + location.host + "/robot/ws"); }
  catch (e) { report("ws_error", e.message); setTimeout(connectRelay, 5000); return; }
  ws.onopen = () => {
    if (token) ws.send(JSON.stringify({ type: "hello", k: token }));
    else { setSt("stRelay", false, "Связь с Orb Studio: ждёт подтверждения кода"); ws.send(JSON.stringify({ type: "pair_request", ps: pairSecret })); }
  };
  ws.onmessage = async (ev) => {
    let m; try { m = JSON.parse(ev.data); } catch { return; }
    if (m.type === "pair_code") { showCode(m.code, m.exp); log("код для Orb Studio: " + m.code); return; }
    if (m.type === "pair_expired") { ws.send(JSON.stringify({ type: "pair_request", ps: pairSecret })); return; }
    if (m.type === "pair_error") { log("код не выдан: " + m.error); $("codeTtl").textContent = "Не удалось получить код, повторю через минуту"; $("pair").style.display = "block"; setTimeout(() => { if (!token && ws && ws.readyState === 1) ws.send(JSON.stringify({ type: "pair_request", ps: pairSecret })); }, 60000); return; }
    if (m.type === "paired") {
      token = m.token; localStorage.setItem("orbEmoToken", token); hideCode();
      log("Orb Studio подтвердил код, планшет привязан");
      ws.send(JSON.stringify({ type: "hello", k: token })); return;
    }
    if (m.type === "welcome") { hideCode(); while (diagQueue.length) ws.send(JSON.stringify(diagQueue.shift())); relayOk = true; wsTries = 0; setSt("stRelay", true, "Связь с Orb Studio: есть"); log("связь с Orb Studio установлена"); sendStatus(); return; }
    if (m.type === "say") { showMsg(m); return; }
    if (m.type === "job") {
      log("команда от Orb Studio: " + (m.label || "") + " (" + (m.steps || []).length + " шаг.)");
      let res;
      try { const steps = validateSteps(m.steps); res = { type: "result", id: m.id, ok: true, results: await runSteps(steps) }; log("выполнено"); }
      catch (e) { res = { type: "result", id: m.id, ok: false, error: e.message, results: e.results || [] }; log("ошибка: " + e.message); }
      send(res);
    }
  };
  ws.onclose = (ev) => {
    relayOk = false;
    if (ev.code === 4003) {
      // a newer code was approved (maybe in another tab): don't touch the shared localStorage, just stop
      stopRelay = true; setSt("stRelay", false, "Связь с Orb Studio: подтверждён другой код. Обновите страницу, чтобы привязать этот планшет снова");
      log("привязка заменена новым кодом"); return;
    }
    if (ev.code === 4001) {
      // stored key no longer valid: forget it (only if nobody replaced it meanwhile) and show a new code
      if (localStorage.getItem("orbEmoToken") === token) localStorage.removeItem("orbEmoToken");
      token = localStorage.getItem("orbEmoToken");
      log("ключ не подошёл, получаю новый код");
      setTimeout(connectRelay, 1000); return;
    }
    if (ev.code === 4004) { stopRelay = true; setSt("stRelay", false, "Связь с Orb Studio: слишком много запросов кода — обновите страницу позже"); return; }
    if (ev.code === 4000) { stopRelay = true; setSt("stRelay", false, "Связь с Orb Studio: страница открыта в другом месте"); log("эту страницу заменила другая вкладка"); return; }
    setSt("stRelay", false, "Связь с Orb Studio: восстанавливаю…");
    const wait = Math.min(1000 * 2 ** wsTries++, 15000);
    setTimeout(connectRelay, wait);
  };
  ws.onerror = () => {};
}
setInterval(() => { if (!token && ws && ws.readyState === 1) ws.send(JSON.stringify({ type: "pair_poll", ps: pairSecret })); }, 15000);
setInterval(() => { if (relayOk) { ws.send('{"type":"ping"}'); sendStatus(); } }, 10000);

// ---- manual test buttons (bytes generated from protocol.py into presets.json) ----
fetch("/robot/presets.json?v=o1").then((r) => r.json()).then((p) => {
  presets = p;
  if (bleUp()) enableAlerts();
  for (const [name, p] of Object.entries(presets)) {
    const b = document.createElement("button");
    b.className = "sec" + (name === "stop" ? " stop" : ""); b.textContent = p.label;
    b.onclick = async () => {
      try { const r = await runSteps(validateSteps(p.steps)); log(p.label + ": " + JSON.stringify(r.map((x) => x.response || x.error || "ok")).slice(0, 300)); }
      catch (e) { log(p.label + ": ошибка — " + e.message); }
    };
    $("tests").appendChild(b);
  }
});

// ---- start: relay first, every optional API isolated ----
function report(ev, msg) { try { (window.__emoReport || (() => {}))(ev, msg); } catch {} }
const safe = (name, fn) => { try { const r = fn(); if (r && r.catch) r.catch((e) => report("init_" + name, e && e.message)); } catch (e) { report("init_" + name, e && e.message); } };
safe("relay", connectRelay);
window.__emoStarted = true;
safe("bt_check", () => { if (!navigator.bluetooth) { warn("Этот браузер не умеет Bluetooth. Откройте ссылку в Google Chrome (на Android) и включите Bluetooth и Геолокацию."); $("connect").disabled = true; } });
safe("wakelock", keepAwake);
safe("restore", restoreDevice);

// ---- сообщения от ИИ-агентов: показать крупно, прочитать вслух, дать ответить ----
function speak(text) {
  try {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = /[а-яё]/i.test(text) ? "ru-RU" : /[äöüß]/i.test(text) ? "de-DE" : "en-US"; u.rate = 0.95;
    speechSynthesis.cancel(); speechSynthesis.speak(u);
  } catch (e) {}
}
function chime() {
  try {
    const c = new (window.AudioContext || window.webkitAudioContext)();
    [660, 880, 990].forEach((f, i) => { const o = c.createOscillator(), g = c.createGain(), t0 = c.currentTime + i * 0.18; o.frequency.value = f; o.connect(g); g.connect(c.destination);
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.3, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.3); o.start(t0); o.stop(t0 + 0.32); });
  } catch (e) {}
}
function showMsg(m) {
  const box = $("msgs"); if (!box) return;
  const card = document.createElement("div"); card.className = "msg" + (m.kind === "signal" ? " sig" : "");
  const t = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  card.innerHTML = '<div class="who"></div><div class="txt"></div>' + (m.kind === "signal" ? "" : '<div class="rep"><input type="text" maxlength="300" placeholder="Ответить агенту…"><button type="button">Ответить</button></div>');
  card.querySelector(".who").textContent = "🤖 " + m.by + " · " + t;
  card.querySelector(".txt").textContent = m.kind === "signal" ? "📡 прислал сигнал" : m.kind === "ask" ? "🗣 Hey EMO, " + m.text : m.text;
  box.prepend(card); document.body.classList.add("flash"); setTimeout(() => document.body.classList.remove("flash"), 1200);
  chime();
  if (m.kind === "ask") setTimeout(() => askEmo(m.text), 900);
  else if (m.kind !== "signal") setTimeout(() => speak(m.text), 900);
  log("сообщение от " + m.by);
  const b = card.querySelector(".rep button");
  if (b) b.onclick = async () => {
    const inp = card.querySelector(".rep input"), text = inp.value.trim(); if (!text) return;
    b.disabled = true;
    try {
      const r = await fetch("/robot/reply", { method: "POST", headers: { "content-type": "application/json", "X-Robot-Token": token || "" }, body: JSON.stringify({ id: m.id, text }) });
      if (r.ok) { const d = document.createElement("div"); d.className = "sent"; d.textContent = "✓ ответ отправлен: " + text; card.querySelector(".rep").replaceWith(d); }
      else { b.disabled = false; log("ответ не ушёл: " + r.status); }
    } catch (e) { b.disabled = false; }
  };
}

// «Hey EMO» отдельно, пауза, потом вопрос — так EMO успевает проснуться и слушать; отвечает сам робот своим голосом
function askEmo(q) {
  try {
    if (!("speechSynthesis" in window)) return;
    speechSynthesis.cancel();
    const wake = new SpeechSynthesisUtterance("Hey EMO"); wake.lang = "en-US"; wake.rate = 0.9; wake.volume = 1;
    wake.onend = () => setTimeout(() => { const u = new SpeechSynthesisUtterance(q); u.lang = "en-US"; u.rate = 0.9; u.volume = 1; speechSynthesis.speak(u); }, 1300);
    speechSynthesis.speak(wake);
  } catch (e) {}
}
