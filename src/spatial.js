// Схематическая пространственная сцена (/api/v1/spatial/scene).
// Только чтение. Координаты УСЛОВНЫЕ: узлы расставлены по кругу вокруг центра, это не измерения положения.
// Все числа в сцене взяты из реальных данных сайта; ничего не выдумывается.

const ROOT_NOTE = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
const DYN = { pp: 0.2, p: 0.35, mp: 0.5, mf: 0.65, f: 0.85, ff: 1 };

export function pitchToMidi(p) {
  const m = /^([A-G])([#b]?)(-?\d)$/.exec(String(p || ""));
  if (!m) return null;
  return 12 * (Number(m[3]) + 1) + ROOT_NOTE[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0);
}

const r2 = (x) => Math.round(x * 100) / 100;

// Ноты → точки [x = момент в долях (нормирован 0..1), y = высота (0..1 по диапазону G3–E7), z = динамика 0..1].
// Это визуализация партитуры, а не измеренное звуковое поле.
export function scorePoints(notes, maxPoints = 64) {
  if (!Array.isArray(notes) || !notes.length) return [];
  const total = notes.reduce((s, n) => s + (Number(n[1]) || 0), 0) || 1;
  let t = 0;
  const pts = [];
  for (const n of notes) {
    const midi = pitchToMidi(n[0]);
    const beats = Number(n[1]) || 0;
    if (midi != null) pts.push([r2(t / total), r2(Math.min(1, Math.max(0, (midi - 55) / (100 - 55)))), DYN[n[2]] ?? 0.65]);
    t += beats;
  }
  if (pts.length <= maxPoints) return pts;
  const step = pts.length / maxPoints;
  return Array.from({ length: maxPoints }, (_, i) => pts[Math.floor(i * step)]);
}

const NODES = ["emo", "violin", "court", "agents"];
export function ringLayout(radius = 1) {
  return Object.fromEntries(NODES.map((id, i) => {
    const a = (2 * Math.PI * i) / NODES.length;
    return [id, [r2(radius * Math.cos(a)), 0, r2(radius * Math.sin(a))]];
  }));
}

export function buildScene({ now = new Date(), emo = null, agentsToday = null, courtToday = null, piece = null } = {}) {
  const pos = ringLayout(1);
  return {
    node_id: "orbstudio_hamburg_main",
    timestamp: now.toISOString(),
    schematic: true,
    coordinate_note: "Schematic layout: nodes sit on a circle of radius 1 around the centre (0,0,0), units are arbitrary, y is up. The positions are NOT measured and say nothing about real locations; no GPS or address data is published.",
    center: { id: "orbstudio_hamburg_main", position: [0, 0, 0] },
    nodes: {
      emo: { position: pos.emo, kind: "desk_robot", status: emo ? emo.status : "unknown", online: emo ? !!emo.online : null, source: "https://orbstudio.org/api/v1/robot" },
      violin: { position: pos.violin, kind: "violin_of_the_day", day: piece ? piece.day : null, title: piece ? piece.title : null, key: piece ? piece.key : null, bpm: piece ? piece.bpm : null,
        score_points_note: "Points [time 0..1 across the piece, pitch height 0..1 over G3–E7, dynamic 0..1], taken from the note list. A visualisation of the score, not an acoustic measurement.",
        score_points: piece ? scorePoints(piece.notes) : [], source: "https://orbstudio.org/api/v1/violin" },
      court: { position: pos.court, kind: "court_activity", cases_today: courtToday, marker: { shape: "sphere", color: courtToday ? "#ffb547" : "#6fe6ff" },
        marker_note: "Colour shows only whether the court recorded cases today (amber) or not (cyan). It is not a reputation of any agent.", source: "https://orbstudio.org/api/v1/court" },
      agents: { position: pos.agents, kind: "agent_visits", agents_today: agentsToday, note: "Count of AI-agent requests recorded today (daily counter), not live connections.", source: "https://orbstudio.org/api/v1/hall-of-fame" },
    },
    read_only: true,
  };
}
