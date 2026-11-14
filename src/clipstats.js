// Точность алгоритма эмоциональных тайм-кодов: голоса людей → precision, клипы людей → recall,
// сравнение со случайным угадыванием, перерасчёт порогов по данным (от 30 размеченных моментов)
// и смена камеры через Gemini (видит видео по ссылке YouTube). Ключ: секрет GEMINI_API_KEY.
import { fmtTimecode } from "./clips.js";

export const CALIBRATE_AT = 30;      // столько размеченных моментов нужно, чтобы верить порогам
export const HIT_S = 3, CLOSE_S = 10;
const PAUSE_NOW = 1.2, K_NOW = 0.25; // текущие пороги в findCandidates

// Голос решён, если голосов «есть реакция» и «нет» не поровну
export const decided = (q) => q.yes !== q.no && q.yes + q.no > 0;

// Чистая функция — проще тестировать. queue: [{video, t_s, yes, no, pause_s, rules, camera}], clips: из clips.json
export function accuracy(queue, clips) {
  const votes = queue.filter(decided);
  const yes = votes.filter((q) => q.yes > q.no).length, no = votes.length - yes;
  const checkedVideos = new Set(queue.map((q) => q.video));
  // recall: человеческие клипы из проверенных видео — нашёл ли алгоритм кандидата рядом
  const rec = clips.filter((c) => c.video && checkedVideos.has(c.video.id)).map((c) => {
    const near = queue.filter((q) => q.video === c.video.id).map((q) => ({ q, d: q.t_s - c.emotional_timecode_s }))
      .sort((a, b) => Math.abs(a.d) - Math.abs(b.d))[0];
    const d = near ? near.d : null;
    return { clip: c.id, human_s: c.emotional_timecode_s, human: fmtTimecode(c.emotional_timecode_s),
      nearest: near ? fmtTimecode(near.q.t_s) : null, delta_s: d,
      found: d != null && Math.abs(d) <= HIT_S ? "hit" : d != null && Math.abs(d) <= CLOSE_S ? "close" : "missed" };
  });
  // случайное угадывание: шанс попасть в ±3 с, если ткнуть в любую секунду окна клипа
  const chance = clips.length ? clips.reduce((s, c) => s + Math.min(1, (2 * HIT_S + 1) / Math.max(1, c.end_s - c.start_s)), 0) / clips.length : null;
  const labeled = clips.length + votes.length;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : null);
  return {
    precision: { confirmed: yes, rejected: no, decided: votes.length, pending: queue.length - votes.length, pct: pct(yes, votes.length),
      meaning: "Of the candidates people voted on, how many really had a reaction." },
    recall: { found: rec.filter((r) => r.found !== "missed").length, total: rec.length, pct: pct(rec.filter((r) => r.found !== "missed").length, rec.length), clips: rec,
      meaning: "Of the moments a human marked in checked videos, how many the algorithm found itself (±10 s)." },
    chance_hit_pct: chance == null ? null : +(chance * 100).toFixed(1),
    labeled, calibrate_at: CALIBRATE_AT,
    calibration: labeled >= CALIBRATE_AT ? calibrate(votes, rec) : { status: "collecting", have: labeled, need: CALIBRATE_AT,
      current: { pause_min_s: PAUSE_NOW, reaction_k: K_NOW } },
    camera: { checked: queue.filter((q) => q.camera).length, with_cut: queue.filter((q) => q.camera && q.camera.cut_s != null).length },
  };
}

// Перерасчёт по данным: какой порог паузы лучше всего отделяет «есть реакция» от «нет» (F1),
// и какая доля паузы точнее всего ставит секунду реакции (по клипам, где алгоритм был рядом)
export function calibrate(votes, rec) {
  const grid = []; for (let p = 1.0; p <= 3.01; p += 0.1) grid.push(+p.toFixed(1));
  const pos = votes.filter((q) => q.yes > q.no).length;
  let best = { pause_min_s: PAUSE_NOW, f1: -1 };
  for (const p of grid) {
    const kept = votes.filter((q) => (q.pause_s || 0) >= p), tp = kept.filter((q) => q.yes > q.no).length;
    const prec = kept.length ? tp / kept.length : 0, recl = pos ? tp / pos : 0, f1 = prec + recl ? (2 * prec * recl) / (prec + recl) : 0;
    if (f1 > best.f1 + 1e-9) best = { pause_min_s: p, f1: +f1.toFixed(3), precision: +prec.toFixed(2), recall: +recl.toFixed(2) };
  }
  // какие признаки чаще у подтверждённых: доля подтверждений среди кандидатов с признаком
  const rules = {};
  for (const q of votes) for (const r of q.rules || []) { const o = rules[r] || (rules[r] = { n: 0, yes: 0 }); o.n++; if (q.yes > q.no) o.yes++; }
  for (const k in rules) rules[k].pct = Math.round((rules[k].yes / rules[k].n) * 100);
  const ds = rec.filter((r) => r.delta_s != null && Math.abs(r.delta_s) <= CLOSE_S).map((r) => r.delta_s).sort((a, b) => a - b);
  const shift = ds.length ? ds[Math.floor(ds.length / 2)] : 0; // медианный сдвиг: + значит алгоритм ставит позже человека
  return { status: "ready", suggested: { pause_min_s: best.pause_min_s, timecode_shift_s: -shift }, fit: best, rules,
    current: { pause_min_s: PAUSE_NOW, reaction_k: K_NOW },
    note: "Suggested values are applied by hand after review, so one bad batch of votes cannot break the algorithm." };
}

// ---------- Смена камеры: Gemini смотрит окно кандидата ----------
const GEMINI = "https://generativelanguage.googleapis.com/v1beta/models/";
export async function cameraCuts(env, videoId, from_s, to_s) {
  if (!env.GEMINI_API_KEY) return { error: "GEMINI_API_KEY not set" };
  const model = env.GEMINI_MODEL || "gemini-3.5-flash";
  const prompt = `This is a fragment of an interview video from ${fmtTimecode(from_s)} to ${fmtTimecode(to_s)} (times of the full video).
List every camera cut (a change of shot) in this fragment. For each cut give the time in seconds of the FULL video, and who is on screen after it:
"speaker" (the person talking), "listener" (the person listening), "both", or "other".
Also list moments where the LISTENER's face visibly reacts (smile, laugh, raised eyebrows, surprise, nod): time in seconds of the full video and one word for the reaction.
Answer only JSON: {"cuts":[{"t":0,"to":"listener"}],"reactions":[{"t":0,"what":"smile"}]}`;
  const body = { contents: [{ parts: [
    { file_data: { file_uri: `https://www.youtube.com/watch?v=${videoId}` }, video_metadata: { start_offset: `${Math.max(0, Math.floor(from_s))}s`, end_offset: `${Math.ceil(to_s)}s`, fps: 2 } },
    { text: prompt } ] }], generationConfig: { responseMimeType: "application/json", temperature: 0 } };
  const r = await fetch(GEMINI + encodeURIComponent(model) + ":generateContent", { method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY }, body: JSON.stringify(body) });
  if (!r.ok) return { error: `gemini ${r.status}`, detail: (await r.text()).slice(0, 300) };
  const d = await r.json();
  let out; try { out = JSON.parse(((d.candidates || [])[0]?.content?.parts || []).map((p) => p.text || "").join("")); } catch (e) { return { error: "gemini answer is not JSON" }; }
  return { model, ...normalizeCuts(out, from_s, to_s) };
}

// Модель иногда считает время от начала фрагмента — тогда сдвигаем; всё вне окна выбрасываем
export function normalizeCuts(out, from_s, to_s) {
  const len = to_s - from_s, fix = (arr) => {
    const xs = (Array.isArray(arr) ? arr : []).map((x) => ({ ...x, t: Number(x && x.t) })).filter((x) => Number.isFinite(x.t));
    const relative = xs.length && xs.every((x) => x.t <= len + 1) && from_s > len + 1;
    return xs.map((x) => ({ ...x, t: Math.round((relative ? x.t + from_s : x.t) * 10) / 10 })).filter((x) => x.t >= from_s - 1 && x.t <= to_s + 1);
  };
  return { cuts: fix(out && out.cuts), reactions: fix(out && out.reactions) };
}

// Правило «реакция после смены камеры на слушающего»: ищем кадр слушающего в 4 с после сильной фразы
export function applyCamera(cand, cam) {
  const lineEnd = cand.timecode_s - Math.round(Math.min(cand.pause_s || 0, 3) * K_NOW);
  const cut = (cam.cuts || []).filter((c) => /listener|both/.test(c.to) && c.t >= lineEnd - 1 && c.t <= lineEnd + 4).sort((a, b) => a.t - b.t)[0];
  const react = (cam.reactions || []).filter((x) => x.t >= lineEnd - 1 && x.t <= lineEnd + 6).sort((a, b) => a.t - b.t)[0];
  const camera = { cut_s: cut ? cut.t : null, reaction_s: react ? react.t : null, reaction: react ? String(react.what || "").slice(0, 30) : null, model: cam.model };
  const out = { ...cand, camera };
  if (cut || react) {
    const t = Math.round(react ? react.t : cut.t + 0.5);
    out.timecode_text_s = cand.timecode_s; out.timecode_s = t; out.timecode = fmtTimecode(t);
    out.score = +((cand.score || 0) + (cut ? 2 : 0) + (react ? 2 : 0)).toFixed(1);
    out.rules = [...new Set([...(cand.rules || []), cut ? "camera" : null, react ? "face" : null].filter(Boolean))];
    out.why = [...(cand.why || []), cut ? `camera cuts to the listener at ${fmtTimecode(Math.round(cut.t))}` : null, react ? `listener's face: ${camera.reaction}` : null].filter(Boolean);
  }
  return out;
}
