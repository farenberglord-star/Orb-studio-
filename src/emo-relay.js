// Мост к роботу EMO внутри orb-studio (перенесён из отдельного воркера emo-relay и начат с нуля: новая привязка, новые ключи).
// Планшет рядом с роботом открывает https://orbstudio.org/robot/ , подключает EMO по Bluetooth и держит WebSocket с этим объектом.
// Команды приходят только от самого воркера orb-studio (готовые наборы из presets.json), снаружи объект недоступен.
import { DurableObject } from "cloudflare:workers";

const MAX_STEPS = 20, MAX_HEX = 1024, MAX_SLEEP_MS = 3000;
export function validateSteps(steps) {
  if (!Array.isArray(steps) || steps.length < 1 || steps.length > MAX_STEPS) throw new Error(`steps must be an array of 1..${MAX_STEPS}`);
  return steps.map((s, i) => {
    if (!s || typeof s !== "object") throw new Error(`step ${i}: not an object`);
    const label = typeof s.label === "string" ? s.label.slice(0, 60) : "";
    if (s.kind === "sleep") { if (!Number.isInteger(s.ms) || s.ms < 0 || s.ms > MAX_SLEEP_MS) throw new Error(`step ${i}: bad ms`); return { kind: "sleep", ms: s.ms, label }; }
    if (s.kind !== "request" && s.kind !== "command") throw new Error(`step ${i}: bad kind`);
    if (typeof s.hex !== "string" || !s.hex.length || s.hex.length > MAX_HEX || s.hex.length % 2 || !/^[0-9a-fA-F]+$/.test(s.hex)) throw new Error(`step ${i}: bad hex`);
    const out = { kind: s.kind, hex: s.hex.toLowerCase(), label };
    if (s.kind === "request" && s.noreply === true) out.noreply = true;
    return out;
  });
}
function jobTimeoutMs(steps) { let t = 5000; for (const s of steps) t += s.kind === "sleep" ? s.ms : s.kind === "request" ? (s.noreply ? 2500 : 10000) : 1000; return Math.min(t, 60000); }
const enc = new TextEncoder();
async function sha256hex(s) { const d = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(String(s)))); return Array.from(d, (x) => x.toString(16).padStart(2, "0")).join(""); }
function ctEqual(a, b) { if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
function randomCode() { const b = new Uint32Array(1); for (;;) { crypto.getRandomValues(b); if (b[0] < 4294e6) return String(b[0] % 1e6).padStart(6, "0"); } }
function randomToken() { const b = new Uint8Array(32); crypto.getRandomValues(b); return btoa(String.fromCharCode(...b)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
const validPs = (ps) => typeof ps === "string" && ps.length >= 20 && ps.length <= 200;
const CODE_TTL_MS = 10 * 60e3, MAX_PENDING = 3, MAX_BAD = 5, MAX_REQ = 10, REQ_WIN = 10 * 60e3, STALE_MS = 45e3, MAX_EVENTS = 300, MAX_DIAG = 200;
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });

class Pairing {
  constructor(kv) { this.kv = kv; }
  async _pending() { const t = Date.now(); return ((await this.kv.get("pairing:pending")) || []).filter((p) => p.exp > t && p.bad < MAX_BAD); }
  async _save(l) { await this.kv.put("pairing:pending", l); }
  async request(ps) {
    if (!validPs(ps)) return { ok: false, error: "bad pairing secret" };
    const t = Date.now(), psh = await sha256hex(ps), list = await this._pending(), mine = list.find((p) => p.psh === psh);
    if (mine) return { ok: true, code: mine.code, exp: mine.exp };
    const log = ((await this.kv.get("pairing:reqlog")) || []).filter((x) => x > t - REQ_WIN);
    if (log.length >= MAX_REQ) return { ok: false, error: "too many pairing requests, try again in 10 minutes", retry: true };
    if (list.filter((p) => !p.token).length >= MAX_PENDING) return { ok: false, error: "too many pending codes, try again later", retry: true };
    let code; do code = randomCode(); while (list.some((p) => p.code === code));
    list.push({ code, psh, exp: t + CODE_TTL_MS, bad: 0, token: null }); log.push(t);
    await this._save(list); await this.kv.put("pairing:reqlog", log);
    return { ok: true, code, exp: t + CODE_TTL_MS };
  }
  async approve(code) {
    const list = await this._pending(), c = String(code || "").trim();
    const hit = /^\d{6}$/.test(c) ? list.find((p) => !p.token && ctEqual(p.code, c)) : null;
    if (!hit) { for (const p of list) p.bad += 1; await this._save(list.filter((p) => p.bad < MAX_BAD)); return { ok: false, status: 404, error: "unknown, expired or locked code" }; }
    const token = randomToken(); hit.token = token; await this._save(list);
    await this.kv.put("pairing:device", { h: await sha256hex(token), since: Date.now() });
    return { ok: true, token, psh: hit.psh };
  }
  async poll(ps) {
    if (!validPs(ps)) return { state: "unknown" };
    const psh = await sha256hex(ps), list = await this._pending(), p = list.find((x) => x.psh === psh);
    if (!p) return { state: "unknown" };
    if (!p.token) return { state: "pending", code: p.code, exp: p.exp };
    await this._save(list.filter((x) => x !== p)); return { state: "paired", token: p.token };
  }
  async consume(token) { const list = await this._pending(), left = list.filter((x) => x.token !== token); if (left.length !== list.length) await this._save(left); }
  async isDevice(token) { if (typeof token !== "string" || token.length < 32) return false; const d = await this.kv.get("pairing:device"); return !!d && ctEqual(d.h, await sha256hex(token)); }
}

export class EmoRelay extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.pending = new Map(); this.pairing = new Pairing(ctx.storage);
    ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('{"type":"ping"}', '{"type":"pong"}'));
  }
  page() { for (const ws of this.ctx.getWebSockets()) { const a = ws.deserializeAttachment(); if (a && a.auth) return { ws, a }; } return null; }
  status() {
    const p = this.page(), now = Date.now(), fresh = !!p && now - p.a.seen < STALE_MS;
    return { ok: true, relay_connected: fresh, robot_connected: fresh && !!p.a.ble, device_name: p ? p.a.name : null, page_last_seen_s: p ? Math.round((now - p.a.seen) / 1000) : null };
  }
  async fetch(req) {
    const p = new URL(req.url).pathname;
    if (p === "/ws") {
      const pair = new WebSocketPair();
      const unauth = this.ctx.getWebSockets().filter((w) => !(w.deserializeAttachment() || {}).auth);
      for (const w of unauth.slice(0, Math.max(0, unauth.length - 4))) try { w.close(4002, "too many"); } catch {}
      this.ctx.acceptWebSocket(pair[1]); pair[1].serializeAttachment({ auth: false, since: Date.now() });
      return new Response(null, { status: 101, webSocket: pair[0] });
    }
    if (p === "/status") return J(this.status());
    if (p === "/events") return J({ ok: true, events: (await this.ctx.storage.get("events")) || [] });
    if (p === "/diag") return J({ ok: true, diag: (await this.ctx.storage.get("diag")) || [] });
    if (p === "/report") { let m = {}; try { m = JSON.parse(await req.text()); } catch {} const cut = (v, n) => typeof v === "string" ? v.slice(0, n) : null;
      await this.addDiag("client_" + (cut(m.ev, 30) || "report"), [cut(m.msg, 300), "build " + cut(m.b, 20), cut(m.ua, 160)].filter(Boolean).join(" | "), true); return J({ ok: true }); }
    if (p === "/say") { // сообщение агента: показать на планшете и прочитать вслух
      const st = this.status(); if (!st.relay_connected) return J({ ...st, ok: false, error: "tablet page is not connected" }, 503);
      const m = await req.json(); try { this.page().ws.send(JSON.stringify({ type: "say", id: m.id, by: m.by, text: m.text, kind: m.kind || "say" })); } catch (e) { return J({ ok: false, error: "send failed" }, 502); }
      return J({ ok: true });
    }
    if (p === "/verify") { const m = await req.json(); return J({ ok: await this.pairing.isDevice(m.token) }); }
    if (p === "/cmd") return this.cmd(await req.json());
    if (p === "/approve") return this.approve(await req.json());
    return J({ ok: false, error: "not found" }, 404);
  }
  async cmd({ steps, label }) {
    const st = this.status();
    if (!st.relay_connected) return J({ ...st, ok: false, error: "tablet page is not connected" }, 503);
    if (!st.robot_connected) return J({ ...st, ok: false, error: "EMO is not connected on the tablet" }, 409);
    try { steps = validateSteps(steps); } catch (e) { return J({ ok: false, error: e.message }, 400); }
    const id = crypto.randomUUID(), timeout = jobTimeoutMs(steps);
    const result = await new Promise((resolve) => {
      const timer = setTimeout(() => { this.pending.delete(id); resolve(null); }, timeout);
      this.pending.set(id, (m) => { clearTimeout(timer); this.pending.delete(id); resolve(m); });
      try { this.page().ws.send(JSON.stringify({ type: "job", id, steps, label })); } catch (e) { clearTimeout(timer); this.pending.delete(id); resolve({ ok: false, error: "send failed: " + e.message }); }
    });
    if (!result) return J({ ok: false, error: `timeout after ${timeout} ms waiting for tablet` }, 504);
    return J({ ok: !!result.ok, error: result.error || null, results: result.results || [] }, result.ok ? 200 : 502);
  }
  async approve({ code }) {
    const r = await this.pairing.approve(code);
    if (!r.ok) return J({ ok: false, error: r.error }, r.status);
    let delivered = false, revoked = 0;
    for (const w of this.ctx.getWebSockets()) {
      const a = w.deserializeAttachment() || {};
      if (a.auth) { try { w.close(4003, "device revoked by a new pairing"); revoked++; } catch {} }
      else if (a.psh === r.psh) { try { w.send(JSON.stringify({ type: "paired", token: r.token })); delivered = true; } catch {} }
    }
    return J({ ok: true, delivered, previous_device_sessions_closed: revoked });
  }
  async webSocketMessage(ws, msg) {
    let m; try { m = JSON.parse(typeof msg === "string" ? msg : new TextDecoder().decode(msg)); } catch { return; }
    const a = ws.deserializeAttachment() || {};
    if (!a.auth) {
      if (m.type === "pair_request" || m.type === "pair_poll") {
        const polled = await this.pairing.poll(m.ps);
        if (polled.state === "paired") { ws.send(JSON.stringify({ type: "paired", token: polled.token })); return; }
        if (polled.state === "pending") { ws.send(JSON.stringify({ type: "pair_code", code: polled.code, exp: polled.exp })); return; }
        if (m.type === "pair_poll") { ws.send(JSON.stringify({ type: "pair_expired" })); return; }
        if (a.reqs >= 3) { ws.close(4004, "too many pairing requests"); return; }
        const r = await this.pairing.request(m.ps); a.reqs = (a.reqs || 0) + 1;
        await this.addDiag("pair_" + (r.ok ? "code_issued" : "refused"), r.ok ? null : r.error, true);
        if (r.ok) { a.psh = await sha256hex(m.ps); ws.send(JSON.stringify({ type: "pair_code", code: r.code, exp: r.exp })); }
        else ws.send(JSON.stringify({ type: "pair_error", error: r.error, retry: !!r.retry }));
        ws.serializeAttachment(a); return;
      }
      if (m.type === "hello" && await this.pairing.isDevice(m.k)) {
        await this.pairing.consume(m.k);
        for (const w of this.ctx.getWebSockets()) if (w !== ws && (w.deserializeAttachment() || {}).auth) try { w.close(4000, "replaced by a newer page"); } catch {}
        ws.serializeAttachment({ auth: true, since: Date.now(), seen: Date.now(), ble: false, name: null });
        ws.send(JSON.stringify({ type: "welcome" })); await this.addDiag("relay_page_connected", "device");
      } else { await this.addDiag("hello_rejected", m.type === "hello" ? "bad key" : "got " + String(m.type).slice(0, 20), true); ws.close(4001, "unauthorized"); }
      return;
    }
    a.seen = Date.now();
    if (m.type === "status") { a.ble = !!m.ble; a.name = typeof m.name === "string" ? m.name.slice(0, 40) : null; }
    else if (m.type === "result" && typeof m.id === "string") { const r = this.pending.get(m.id); if (r) r(m); }
    else if (m.type === "event" && typeof m.hex === "string" && /^[0-9a-f]{2,80}$/.test(m.hex)) {
      const ev = (await this.ctx.storage.get("events")) || [];
      if (m.hex.slice(6, 10) === "0200") { const last = [...ev].reverse().find((e) => e.hex.slice(6, 10) === "0200"); if (last && last.hex === m.hex) { ws.serializeAttachment(a); return; } }
      ev.push({ t: new Date().toISOString(), hex: m.hex }); await this.ctx.storage.put("events", ev.slice(-MAX_EVENTS));
    } else if (m.type === "diag" && typeof m.ev === "string") {
      const d = (await this.ctx.storage.get("diag")) || [];
      d.push({ t: new Date().toISOString(), ev: m.ev.slice(0, 40), detail: typeof m.detail === "string" ? m.detail.slice(0, 200) : null });
      await this.ctx.storage.put("diag", d.slice(-MAX_DIAG));
    }
    ws.serializeAttachment(a);
  }
  async addDiag(ev, detail, untrusted = false) {
    if (untrusted) { const now = Date.now(); this.unauthLog = (this.unauthLog || []).filter((t) => now - t < 6e5); if (this.unauthLog.length >= 40) return; this.unauthLog.push(now); }
    const d = (await this.ctx.storage.get("diag")) || [];
    d.push({ t: new Date().toISOString(), ev, detail: detail || null }); await this.ctx.storage.put("diag", d.slice(-MAX_DIAG));
  }
  async webSocketClose(ws, code, reason) { const a = ws.deserializeAttachment() || {}; if (a.auth) await this.addDiag("relay_page_closed", `code ${code}${reason ? " " + reason : ""}`); try { ws.close(code, reason); } catch {} }
}
