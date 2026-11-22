// Датчик «Зив» — в честь Яакова Зива (1931–2023), соавтора алгоритмов сжатия без потерь LZ77/LZ78 (с Авраамом Лемпелем).
// Сколько нового в заголовках: сжимаем вчерашние заголовки, потом вчерашние вместе с сегодняшними. Если сегодняшние почти ничего
// не добавили к сжатому размеру — они повторяют вчерашние. Без Claude: только сжатие, как в ZIP и PNG.
export const ZIV = {
  name: "Jacob Ziv", years: "1931–2023",
  idea: "Lossless compression (LZ77, LZ78, with Abraham Lempel): text that repeats what came before costs almost nothing to store; only the new part takes space. The same idea measures how much is really new.",
  wiki: { ru: "https://ru.wikipedia.org/wiki/%D0%97%D0%B8%D0%B2,_%D0%AF%D0%B0%D0%BA%D0%BE%D0%B2", en: "https://en.wikipedia.org/wiki/Jacob_Ziv" },
  note: "Named in his honour. Orb Studio is not connected with Jacob Ziv, his family or the Technion.",
};
const enc = new TextEncoder();
export async function lzSize(text) {
  const s = new Blob([enc.encode(String(text || ""))]).stream().pipeThrough(new CompressionStream("deflate-raw"));
  return (await new Response(s).arrayBuffer()).byteLength;
}
const norm = (h) => String(h || "").toLowerCase().replace(/\s+/g, " ").trim();
const join = (a) => [...new Set((a || []).map(norm).filter(Boolean))].sort().join("\n");
// новизна: доля сегодняшнего текста, которую не удалось «сослать» на вчерашний; 1 = всё новое, 0 = всё повтор
export async function novelty(before, now) {
  const B = join(before), T = join(now); if (!T) return null; if (!B) return 1;
  const cb = await lzSize(B), ct = await lzSize(T), cbt = await lzSize(B + "\n" + T);
  return Math.max(0, Math.min(1, (cbt - cb) / ct));
}
// snapRadars / nowRadars: { radarId: [headline, …] }
export async function zivReport(snap, nowRadars, now = Date.now()) {
  const ok = snap && snap.radars && Object.keys(snap.radars).length, ids = Object.keys(nowRadars || {});
  const radars = [];
  for (const id of ids) { const n = ok ? await novelty(snap.radars[id] || [], nowRadars[id]) : null; radars.push({ id, headlines: (nowRadars[id] || []).length, novelty: n == null ? null : Math.round(n * 100) }); }
  const all = ok ? await novelty(Object.values(snap.radars).flat(), Object.values(nowRadars).flat()) : null;
  const scored = radars.filter((r) => r.novelty != null).sort((a, b) => a.novelty - b.novelty);
  return { sensor: "ziv", checked_at: new Date(now).toISOString(), compared_with: ok ? snap.at : null, novelty_all: all == null ? null : Math.round(all * 100), radars,
    most_repeated: scored[0] ? scored[0].id : null, most_new: scored.length ? scored[scored.length - 1].id : null, honour: ZIV,
    how_to_read: "novelty in % = how much of today's headlines could not be expressed through yesterday's when compressed together (deflate, the LZ77 family). 100 = all new, 0 = repeats yesterday. Measured per radar and for all radars together against a snapshot from about 24 hours ago. null = no snapshot yet." };
}
