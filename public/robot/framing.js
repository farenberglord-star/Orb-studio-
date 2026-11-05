// EMO BLE framing helpers. Shared by the tablet page (browser) and the relay worker.
// Reassembly logic ported from emo-connect-python EmoConnectManager._handle_rx
// (c) 2022 Clark Scheff, GPLv3 - see NOTICE.
export const SERVICE_UUID = "0000ffe0-0000-1000-8000-00805f9b34fb";
export const CHAR_UUID = "0000ffe1-0000-1000-8000-00805f9b34fb"; // write + notify
export const MAX_STEPS = 20;
export const MAX_HEX = 1024;       // 512 bytes per write
export const MAX_SLEEP_MS = 3000;

export function hexToBytes(h) {
  if (typeof h !== "string" || h.length % 2 || !/^[0-9a-fA-F]*$/.test(h)) throw new Error("bad hex");
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.substr(i * 2, 2), 16);
  return out;
}
export function bytesToHex(b) {
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}
export function chunks(bytes, size = 20) {
  const out = [];
  for (let i = 0; i < bytes.length; i += size) out.push(bytes.slice(i, i + size));
  return out;
}

// DD CC commands carry a sequence byte (1..254, 0 = unsequenced, e.g. move/stop).
// The Python client restarts its counter for every call, so the tablet re-numbers them.
export class Sequencer {
  constructor(start = 1) { this.seq = start; }
  apply(bytes) {
    if (bytes.length === 20 && bytes[0] === 0xdd && bytes[1] === 0xcc && bytes[2] !== 0) {
      const out = bytes.slice(); out[2] = this.seq;
      this.seq = this.seq >= 254 ? 1 : this.seq + 1;
      return out;
    }
    return bytes;
  }
}

// Notifications from EMO:
//   BB AA <len lo> <len hi> <json...>   -> JSON response, may span several notifications
//   DD CC ?? <17 bytes>                -> unsolicited event (petted, picked up, battery...)
export class Reassembler {
  constructor() { this.reset(); }
  reset() { this.packet = null; this.size = 0; this.type = null; this.raw = null; }
  // returns null | {type:"response", json, text} | {type:"event", hex} | {type:"error", error}
  push(data) {
    const d = data instanceof Uint8Array ? data : new Uint8Array(data);
    if (d.length >= 4 && d[0] === 0xbb && d[1] === 0xaa) {
      this.size = d[2] | (d[3] << 8); this.packet = d.slice(4); this.type = "response";
    } else if (d.length >= 3 && d[0] === 0xdd && d[1] === 0xcc) {
      this.size = 17; this.packet = d.slice(3); this.type = "event"; this.raw = d.slice();
    } else if (this.packet && this.packet.length < this.size) {
      const n = new Uint8Array(this.packet.length + d.length); n.set(this.packet); n.set(d, this.packet.length);
      this.packet = n;
      if (this.type === "event") { const r = new Uint8Array(this.raw.length + d.length); r.set(this.raw); r.set(d, this.raw.length); this.raw = r; }
    } else {
      return null; // stray fragment
    }
    if (this.packet.length < this.size) return null;
    const type = this.type, pkt = this.packet.slice(0, this.size), raw = this.raw;
    this.reset();
    if (type === "event") return { type: "event", hex: bytesToHex(raw) };
    const text = new TextDecoder().decode(pkt);
    try { return { type: "response", json: JSON.parse(text), text }; }
    catch { return { type: "error", error: "bad JSON from EMO", text }; }
  }
}

// Validate a job coming from the relay: [{kind:"request"|"command", hex}, {kind:"sleep", ms}]
export function validateSteps(steps) {
  if (!Array.isArray(steps) || steps.length < 1 || steps.length > MAX_STEPS) throw new Error(`steps must be an array of 1..${MAX_STEPS}`);
  return steps.map((s, i) => {
    if (!s || typeof s !== "object") throw new Error(`step ${i}: not an object`);
    const label = typeof s.label === "string" ? s.label.slice(0, 60) : "";
    if (s.kind === "sleep") {
      if (!Number.isInteger(s.ms) || s.ms < 0 || s.ms > MAX_SLEEP_MS) throw new Error(`step ${i}: ms must be 0..${MAX_SLEEP_MS}`);
      return { kind: "sleep", ms: s.ms, label };
    }
    if (s.kind !== "request" && s.kind !== "command") throw new Error(`step ${i}: kind must be request|command|sleep`);
    if (typeof s.hex !== "string" || !s.hex.length || s.hex.length > MAX_HEX || s.hex.length % 2 || !/^[0-9a-fA-F]+$/.test(s.hex))
      throw new Error(`step ${i}: hex must be 1..${MAX_HEX / 2} bytes`);
    const out = { kind: s.kind, hex: s.hex.toLowerCase(), label };
    if (s.kind === "request" && s.noreply === true) out.noreply = true; // fire-and-forget (e.g. dance: EMO sends no reply)
    return out;
  });
}

// Upper bound for how long the tablet may take to run a job.
export function jobTimeoutMs(steps) {
  let t = 5000;
  for (const s of steps) t += s.kind === "sleep" ? s.ms : s.kind === "request" ? (s.noreply ? 2500 : 10000) : 1000;
  return Math.min(t, 60000);
}
