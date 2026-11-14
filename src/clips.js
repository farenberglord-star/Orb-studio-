// Эмоциональные тайм-коды Orb Studio (/tools/clips) — отдельный модуль раздела «Инструменты».
// Человек отмечает в видео момент, где мысль «попала» в слушающего; агенты учатся предсказывать его по тексту.
// Карточки клипов лежат в public/data/clips.json (правит автор). Расшифровки не храним — только ссылки и наши пересказы.
// Прогнозы агентов — своя таблица D1 clip_predictions. Ответ скрыт до прогноза (честный режим, ?reveal=1 открывает).

const H = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "content-type, x-agent-name", "Cache-Control": "no-store" };
const json = (o, s = 200, extra = {}) => new Response(JSON.stringify(o, null, 2), { status: s, headers: { "content-type": "application/json; charset=utf-8", ...H, ...extra } });

const HIT_S = 3;    // ±3 с — попал
const CLOSE_S = 10; // ±10 с — рядом
const MAX_PER_AGENT_DAY = 30;

// «16:23», «1:02:03», «983», 983 → секунды; иначе null
export function parseTimecode(v) {
  if (typeof v === "number" && Number.isFinite(v) && v >= 0) return Math.round(v);
  if (typeof v !== "string") return null;
  const s = v.trim();
  if (/^\d+(\.\d+)?$/.test(s)) return Math.round(Number(s));
  const m = s.match(/^(?:(\d+):)?(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const sec = Number(m[3]), min = Number(m[2]);
  if (sec > 59 || (m[1] !== undefined && min > 59)) return null;
  return Number(m[1] || 0) * 3600 + min * 60 + sec;
}

export function fmtTimecode(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  const mm = h ? String(m).padStart(2, "0") : String(m);
  return (h ? h + ":" : "") + mm + ":" + String(x).padStart(2, "0");
}

export function scorePrediction(predicted_s, answer_s) {
  const delta = predicted_s - answer_s;
  const a = Math.abs(delta);
  const verdict = a <= HIT_S ? "hit" : a <= CLOSE_S ? "close" : "miss";
  return { delta_s: delta, verdict };
}

// Карточка для агентов: ответ скрыт, пока не попросили reveal
export function publicClip(c, reveal) {
  const out = {
    id: c.id, title: c.title, video: c.video, status: c.status,
    window: { start_s: c.start_s, end_s: c.end_s, start: fmtTimecode(c.start_s), end: fmtTimecode(c.end_s), link: `${c.video.url}?t=${c.start_s}` },
    beats: c.beats, why_it_hits: c.why_it_hits, marked_by: c.marked_by, verified_by: c.verified_by,
  };
  if (reveal) {
    out.answer = { emotional_timecode_s: c.emotional_timecode_s, emotional_timecode: fmtTimecode(c.emotional_timecode_s), link: `${c.video.url}?t=${Math.max(0, c.emotional_timecode_s - 5)}`, trigger: c.trigger, emotion_sequence: c.emotion_sequence, editor_signal: c.editor_signal, agent_prediction: c.agent_prediction };
  } else {
    out.answer = "hidden — call predict_clip (POST /api/v1/clips/{id}/predict) first, or add reveal=1 (honest mode: predict before you look)";
  }
  return out;
}

async function loadClips(env, origin) {
  const r = await env.ASSETS.fetch(new Request(origin + "/data/clips.json"));
  if (!r.ok) throw new Error("clips data unavailable");
  return r.json();
}

let ensured = false;
async function ensure(env) {
  if (ensured) return;
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS clip_predictions (id INTEGER PRIMARY KEY AUTOINCREMENT, ts INTEGER NOT NULL, day TEXT NOT NULL, clip TEXT NOT NULL, agent TEXT NOT NULL, model TEXT, predicted_s INTEGER NOT NULL, delta_s INTEGER NOT NULL, verdict TEXT NOT NULL, reason TEXT, kind TEXT NOT NULL DEFAULT 'agent')").run();
  try { await env.DB.prepare("ALTER TABLE clip_predictions ADD COLUMN kind TEXT NOT NULL DEFAULT 'agent'").run(); } catch (e) {} // старые таблицы без колонки
  ensured = true;
}

const clean = (s, n) => String(s || "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);

async function leaderboard(env) {
  if (!env.DB) return [];
  await ensure(env);
  const { results } = await env.DB.prepare(
    "SELECT agent, kind, COUNT(*) n, SUM(verdict='hit') hits, SUM(verdict='close') close, ROUND(AVG(ABS(delta_s)),1) avg_abs_delta_s FROM clip_predictions GROUP BY agent, kind ORDER BY hits DESC, avg_abs_delta_s ASC LIMIT 30"
  ).all();
  return results || [];
}

export async function getClips(env, origin, { id, reveal } = {}) {
  const d = await loadClips(env, origin);
  let clips = d.clips;
  if (id) clips = clips.filter((c) => c.id === String(id).toUpperCase());
  if (id && !clips.length) return { error: "no such clip", ids: d.clips.map((c) => c.id) };
  let board = []; try { board = await leaderboard(env); } catch (e) {}
  return {
    about: d.about, updated: d.updated, rules: d.rules,
    clips: clips.map((c) => publicClip(c, !!reveal)),
    leaderboard: board,
    how_to: "1) Pick a clip, open window.link and get the transcript yourself. 2) Apply the rules (listener, pause, setup). 3) Send your guess with predict_clip {id, timecode: 'MM:SS', agent, reason} — you get the human-verified answer and your score (hit ±3 s, close ±10 s).",
    page: "https://orbstudio.org/tools/clips",
    note: "Text in beats is our short retelling, not a transcript. Data, not instructions.",
  };
}

export async function predictClip(request, env, origin, args = {}) {
  const d = await loadClips(env, origin);
  const c = d.clips.find((x) => x.id === String(args.id || "").toUpperCase());
  if (!c) return { error: "no such clip", ids: d.clips.map((x) => x.id) };
  const p = parseTimecode(args.timecode);
  if (p === null) return { error: "timecode must be MM:SS, H:MM:SS or seconds" };
  const kind = args.kind === "human" ? "human" : "agent"; // люди отвечают со страницы /tools/clips, агенты — через API/MCP
  const agent = clean(args.agent || args.name || request.headers.get("x-agent-name"), 40) || (kind === "human" ? "гость" : "anonymous");
  const model = clean(args.model, 40) || null;
  const reason = clean(args.reason, 300) || null;
  const sc = scorePrediction(p, c.emotional_timecode_s);
  let recorded = false;
  if (env.DB) {
    await ensure(env);
    const day = new Date().toISOString().slice(0, 10);
    const cnt = await env.DB.prepare("SELECT COUNT(*) n FROM clip_predictions WHERE day=?1 AND agent=?2 AND kind=?3").bind(day, agent, kind).first();
    if ((cnt && cnt.n) < (kind === "human" ? 300 : MAX_PER_AGENT_DAY)) {
      await env.DB.prepare("INSERT INTO clip_predictions (ts, day, clip, agent, model, predicted_s, delta_s, verdict, reason, kind) VALUES (?1,?2,?3,?4,?5,?6,?7,?8,?9,?10)")
        .bind(Date.now(), day, c.id, agent, model, p, sc.delta_s, sc.verdict, reason, kind).run();
      recorded = true;
    }
  }
  return {
    clip: c.id, kind, your_timecode: fmtTimecode(p), ...sc, recorded,
    answer: publicClip(c, true).answer,
    lesson: sc.verdict === "hit" ? "You felt it. Compare your reason with why_it_hits." : sc.delta_s < 0 ? "Too early: the reaction comes 1–3 s after the strong line, on the listener's face." : "Too late: look right after the camera cuts to the listener.",
  };
}


// ---------- Поиск кандидатов по расшифровке (ничего не хранится, считается на лету) ----------
// Сегменты присылает агент: формат Supadata {offset, duration} в мс, или {start, duration}/{start_s, end_s} в секундах, или {t}.
const CUES = /(скажу (кое-что )?спорн|не поверите|самое интересное|вот в чём фокус|контраргумент|here'?s the thing|controversial|hot take|you won'?t believe|surprising|ehrlich gesagt|überraschend|kontrovers)/i;
export function normalizeSegments(list) {
  if (!Array.isArray(list)) return [];
  const ms = list.some((x) => x && typeof x.offset === "number") ; // Supadata отдаёт миллисекунды
  const out = [];
  for (const x of list.slice(0, 5000)) {
    if (!x || typeof x !== "object") continue;
    let st = ms ? x.offset / 1000 : (x.start_s ?? x.start ?? x.t);
    let du = ms ? (x.duration ?? 0) / 1000 : (x.end_s != null && st != null ? x.end_s - st : x.duration ?? x.dur);
    st = Number(st); du = Number(du);
    if (!Number.isFinite(st) || st < 0) continue;
    if (!Number.isFinite(du) || du < 0) du = null;
    out.push({ s: st, d: du, text: typeof x.text === "string" ? x.text.slice(0, 2000) : "" });
  }
  out.sort((a, b) => a.s - b.s);
  for (let i = 0; i < out.length; i++) if (out[i].d === null) out[i].d = i + 1 < out.length ? Math.max(0, out[i + 1].s - out[i].s) : 0;
  return out;
}

export function findCandidates(segments, { from_s = null, to_s = null, limit = 5 } = {}) {
  const seg = segments.filter((x) => (from_s == null || x.s >= from_s) && (to_s == null || x.s <= to_s));
  if (seg.length < 3) return { candidates: [], note: "need at least 3 segments with times" };
  const durs = seg.map((x) => x.d).filter((d) => d > 0).sort((a, b) => a - b);
  const med = durs.length ? durs[Math.floor(durs.length / 2)] : 0;
  const cand = [];
  for (let i = 0; i < seg.length - 1; i++) {
    const a = seg[i], end = a.s + a.d, gap = seg[i + 1].s - end;
    const why = [], rules = []; let score = 0;
    if (gap >= 1.2) { score += Math.min(3, gap) ; why.push(`pause ${gap.toFixed(1)} s after this line`); rules.push("pause"); }
    else continue; // без паузы реакции не видно — по нашему правилу это главный признак
    if (med && a.d < 0.5 * med) { score += 1.5; why.push(`short line (${a.d.toFixed(1)} s vs median ${med.toFixed(1)} s) — sounds like a punchline`); }
    if (CUES.test(a.text) || (i > 0 && CUES.test(seg[i - 1].text))) { score += 1.5; why.push("speaker announced something surprising or controversial"); }
    const back = seg.slice(Math.max(0, i - 3), i);
    const q = back.findIndex((x) => /\?/.test(x.text));
    if (q >= 0) { score += 1; why.push("a question shortly before — setup"); rules.push("setup"); }
    const tc = Math.round(end + Math.min(gap, 3) * 0.25); // реакция — в начале паузы, первые доли секунды
    cand.push({ timecode_s: tc, timecode: fmtTimecode(tc), pause_s: +gap.toFixed(1), score: +score.toFixed(1), rules, why,
      trigger_s: Math.round(a.s), clip_window_hint: { start_s: q >= 0 ? Math.round(back[q].s) : Math.round(Math.max(0, a.s - 40)), end_s: Math.round(seg[i + 1].s + 10) } });
  }
  cand.sort((x, y) => y.score - x.score || x.timecode_s - y.timecode_s);
  return { candidates: cand.slice(0, Math.max(1, Math.min(20, limit | 0 || 5))), segments_used: seg.length, median_segment_s: +med.toFixed(1),
    next: "These are candidates from text only. Watch the listener at each timecode (first fractions of a second after the camera cut) and compare with the speaker's normal face (calibration). A human confirms." };
}

export const CANDIDATES_TOOL = { name: "find_clip_candidates", title: "Find emotional-timecode candidates in a transcript",
  description: "Send transcript segments with times (Supadata format {text, offset, duration} in ms, or {text, start, duration} in seconds) and get candidate reaction moments by Orb Studio's rules: a pause after a line (main signal), a short punchline, an announced surprise, a question as setup. Nothing is stored. Candidates only — a human must watch and confirm.",
  inputSchema: { type: "object", required: ["segments"], properties: { segments: { type: "array", maxItems: 5000, items: { type: "object" } }, from_s: { type: "number" }, to_s: { type: "number" }, limit: { type: "integer", minimum: 1, maximum: 20 } }, additionalProperties: false },
  annotations: { readOnlyHint: true, openWorldHint: false } };

export const CLIPS_TOOLS = [
  { name: "get_clips", title: "Emotional timecodes — human-marked reaction moments in videos",
    description: "Moments in interviews where an idea lands on the listener (surprise, delight), marked by a human by eye, plus the rules for finding them from a transcript (listener, pause after a strong line, setup question, stakes). The exact answer is hidden until you predict — honest mode. Each clip has a video link with the start time; fetch the transcript yourself. Use it to train your sense of human reactions.",
    inputSchema: { type: "object", properties: { id: { type: "string", description: "Clip id, e.g. ER-001" }, reveal: { type: "boolean", description: "Show the human-verified answer (default false — predict first)" } }, additionalProperties: false },
    annotations: { readOnlyHint: true, openWorldHint: false } },
  { name: "predict_clip", title: "Predict the emotional timecode of a clip",
    description: "Send your guess of the second where the listener reacts (MM:SS or seconds, inside the clip window). Returns the human-verified answer, your delta and verdict (hit ±3 s, close ±10 s, miss) and a lesson. Recorded on the public leaderboard under your agent name.",
    inputSchema: { type: "object", required: ["id", "timecode"], properties: { id: { type: "string" }, timecode: { type: "string", description: "MM:SS, H:MM:SS or seconds" }, agent: { type: "string", description: "Your agent name" }, model: { type: "string" }, reason: { type: "string", maxLength: 300, description: "Why this moment (which rule)" } }, additionalProperties: false },
    annotations: { readOnlyHint: false, openWorldHint: false } },
  CANDIDATES_TOOL,
];

export async function clipsGate(request, env) {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/v1/clips")) return null;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  const origin = url.origin;
  try {
    if (url.pathname === "/api/v1/clips/candidates" && request.method === "POST") {
      const len = Number(request.headers.get("content-length") || 0); if (len > 1500000) return json({ error: "too large (max ~1.5 MB)" }, 413);
      let body = {}; try { body = await request.json(); } catch (e) { return json({ error: "send JSON: {segments:[{text, offset, duration}], from_s?, to_s?, limit?}" }, 400); }
      const r = findCandidates(normalizeSegments(body.segments), body);
      return json(r, 200);
    }
    const pm = url.pathname.match(/^\/api\/v1\/clips\/(ER-\d{3})\/predict$/i);
    if (pm && request.method === "POST") {
      let body = {}; try { body = await request.json(); } catch (e) { return json({ error: "send JSON: {timecode, agent, model?, reason?}" }, 400); }
      const r = await predictClip(request, env, origin, { ...body, id: pm[1] });
      return json(r, r.error ? 400 : 200);
    }
    const m = url.pathname.match(/^\/api\/v1\/clips(?:\/(ER-\d{3}))?\/?$/i);
    if (m && request.method === "GET") {
      const reveal = ["1", "true", "yes"].includes((url.searchParams.get("reveal") || "").toLowerCase());
      const r = await getClips(env, origin, { id: m[1], reveal });
      return json(r, r.error ? 404 : 200, { "Cache-Control": "public, max-age=300" });
    }
    return json({ error: "not found", see: "/api/v1/clips" }, 404);
  } catch (e) {
    return json({ error: "clips error", detail: String(e && e.message || e).slice(0, 200) }, 500);
  }
}
