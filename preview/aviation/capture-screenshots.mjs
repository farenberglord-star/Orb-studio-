import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const base = process.argv[2];
const outDir = process.argv[3];
if (!base || !outDir) {
  console.error("usage: node capture-screenshots.mjs <url> <outdir>");
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const chrome = "/usr/local/bin/google-chrome";
const profile = "/tmp/aviation-chrome-profile";
fs.rmSync(profile, { recursive: true, force: true });
const proc = spawn(chrome, [
  "--headless=new",
  "--disable-gpu",
  "--no-sandbox",
  "--hide-scrollbars",
  "--remote-debugging-port=9222",
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function debuggerUrl() {
  for (let i = 0; i < 50; i++) {
    try {
      const list = await fetch("http://127.0.0.1:9222/json/list").then((r) => r.json());
      const page = list.find((item) => item.type === "page");
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(100);
  }
  throw new Error("chrome debugging port did not open");
}

function client(ws) {
  let id = 0;
  const pending = new Map();
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(JSON.stringify(message.error)));
    else resolve(message.result);
  });
  return (method, params = {}) => new Promise((resolve, reject) => {
    const msgId = ++id;
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

async function shoot(send, width, mobile, file) {
  await send("Emulation.setDeviceMetricsOverride", {
    width, height: 800, deviceScaleFactor: mobile ? 2 : 1, mobile,
  });
  await send("Page.navigate", { url: base });
  for (let i = 0; i < 50; i++) {
    const state = await send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true });
    if (state.result.value === "complete") break;
    await sleep(100);
  }
  await sleep(200);
  const measured = await send("Runtime.evaluate", {
    expression: `({height: Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth})`,
    returnByValue: true,
  });
  const { height, overflow } = measured.result.value;
  if (overflow > 1) throw new Error(`${file} horizontal overflow ${overflow}px at ${width}px`);
  await send("Emulation.setDeviceMetricsOverride", {
    width, height, deviceScaleFactor: mobile ? 2 : 1, mobile,
  });
  await sleep(150);
  const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  fs.writeFileSync(path.join(outDir, file), Buffer.from(shot.data, "base64"));
  console.log(`${file} ${width}x${height} overflow ${overflow}`);
}

try {
  const ws = new WebSocket(await debuggerUrl());
  await new Promise((resolve, reject) => {
    ws.addEventListener("open", resolve);
    ws.addEventListener("error", reject);
  });
  const send = client(ws);
  await send("Page.enable");
  await shoot(send, 360, true, "aviation-preview-mobile.png");
  await shoot(send, 1280, false, "aviation-preview-desktop.png");
  const opened = await send("Runtime.evaluate", {
    expression: `(() => {
      window.open = (url) => { window.__opened = String(url); return {}; };
      const area = document.getElementById("share-text");
      const before = area.value;
      area.value = before + " Правка владельца.";
      document.getElementById("share-x").click();
      return { before, href: window.__opened, note: document.getElementById("share-note").textContent, banner: document.querySelector(".demo h1").textContent };
    })()`,
    returnByValue: true,
  });
  const share = opened.result.value;
  const intent = new URL(share.href);
  if (intent.origin + intent.pathname !== "https://x.com/intent/post") throw new Error("share target " + share.href);
  if (intent.searchParams.get("url") !== "https://orbstudio.org/") throw new Error("canonical missing");
  const text = intent.searchParams.get("text") || "";
  if (!text.startsWith(share.before) || !text.includes("Правка владельца.")) throw new Error("draft text was not editable");
  if (/вымысел|observed_airborne_count/i.test(text)) throw new Error("draft included a scenario or a live field");
  if (!share.note.includes("не отправляет")) throw new Error("share note missing");
  if (share.banner !== "ПРЕВЬЮ НЕ ПОДКЛЮЧЕНО") throw new Error("banner missing");
  console.log("share intent ok");
  ws.close();
} finally {
  proc.kill("SIGKILL");
}
