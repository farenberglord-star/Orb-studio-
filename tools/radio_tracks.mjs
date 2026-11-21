#!/usr/bin/env node
// Музыкальная полка радио: все .m4a из public/media/radio попадают в оба списка треков (страница и сервер).
// Запуск: node tools/radio_tracks.mjs   — названия уже известных треков сохраняются, у новых берутся из имени файла.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
const root = new URL("../", import.meta.url), dir = new URL("public/media/radio/", root);
export const titleFromFile = (stem) => stem.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/(^|\s)\p{L}/gu, (m) => m.toUpperCase());
export const idFromFile = (stem) => stem.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
export function buildList(files, known, secOf) {
  const out = [], seen = new Set();
  for (const k of known) if (files.includes(k.file)) { out.push({ ...k, sec: secOf(k.file) }); seen.add(k.file); }
  for (const f of files.slice().sort()) if (!seen.has(f)) out.push({ id: idFromFile(f.replace(/\.m4a$/, "")), title: titleFromFile(f.replace(/\.m4a$/, "")), file: f, sec: secOf(f) });
  return out;
}
export const saleOriginals = (list, saleFiles) => list.map((t) => t.id).filter((id) => (saleFiles || []).includes(id + ".mp3"));
const render = (list, key) => list.map((t) => `  { id: ${JSON.stringify(t.id)}, title: ${JSON.stringify(t.title)}, ${key}: ${JSON.stringify("/media/radio/" + t.file)}, sec: ${t.sec} },`).join("\n");
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/^.*\//, ""))) {
  const page = new URL("public/radio.js", root), srv = new URL("src/radio.js", root), ps = readFileSync(page, "utf8"), ss = readFileSync(srv, "utf8");
  const re = (name) => new RegExp("(export const " + name + " = \\[\\n)([\\s\\S]*?)(\\];)"), nl = (t) => (t ? t + "\n" : "");
  const known = [...re("TRACKS").exec(ps)[2].matchAll(/id: ("[^"]*"), title: ("(?:[^"\\]|\\.)*"), src: "\/media\/radio\/([^"]+)"/g)].map((m) => ({ id: JSON.parse(m[1]), title: JSON.parse(m[2]), file: m[3] }));
  const files = readdirSync(dir).filter((f) => /^[a-z0-9-]+\.m4a$/.test(f));
  const secOf = (f) => Math.round(+execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", new URL(f, dir).pathname]).toString());
  const list = buildList(files, known, secOf);
  // исходные MP3 в закрытой папке продажи: трек с таким же именем продаётся оригиналом, остальные — файлом из эфира
  let saleDir = []; try { saleDir = readdirSync(new URL("public/_sale/", root)); } catch {}
  const originals = saleOriginals(list, saleDir);
  writeFileSync(page, ps.replace(re("TRACKS"), (_, a, b, c) => a + nl(render(list, "src")) + c));
  writeFileSync(srv, ss.replace(re("RADIO_TRACKS"), (_, a, b, c) => a + nl(render(list, "path")) + c).replace(re("SALE_ORIGINALS"), (_, a, b, c) => a + nl(originals.map((id) => "  " + JSON.stringify(id) + ",").join("\n")) + c));
  console.log("on sale: " + list.length + " tracks, originals: " + (originals.join(", ") || "none"));
  console.log(list.length + " tracks, " + Math.round(list.reduce((a, t) => a + t.sec, 0) / 60) + " min"); for (const t of list) console.log("  " + t.id + " · " + t.title + " · " + t.sec + " s");
}
