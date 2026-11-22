// Датчик «Микрин» — в честь академика Евгения Микрина (умер в мае 2020 года, 64 года), генерального конструктора пилотируемых программ России.
// Под его руководством путь корабля до МКС сократили с двух суток (около 30 витков) до нескольких часов (четыре витка).
// Датчик меряет тот же путь для новости в эфире Orb Studio: от публикации у источника до текста Давида и до голоса.
export const MIKRIN = {
  name: "Evgeny Mikrin", died: "May 2020",
  idea: "Shorten the path: crewed and cargo ships to the ISS went from about two days (around 30 orbits) to a few hours (four orbits) under his leadership; Soyuz TMA-08M was the first crew on the short scheme in March 2013.",
  wiki: { ru: "https://ru.wikipedia.org/wiki/%D0%9C%D0%B8%D0%BA%D1%80%D0%B8%D0%BD,_%D0%95%D0%B2%D0%B3%D0%B5%D0%BD%D0%B8%D0%B9_%D0%90%D0%BD%D0%B0%D1%82%D0%BE%D0%BB%D1%8C%D0%B5%D0%B2%D0%B8%D1%87" },
  source: "https://rg.ru/2020/05/06/kakoj-vklad-vnes-v-programmy-osvoeniia-kosmosa-akademik-mikrin.html",
  note: "Named in his honour. Orb Studio is not connected with Evgeny Mikrin, his family or RSC Energia.",
};
export const MIKRIN_BLOCKS = ["radar_news", "regional", "studio"];
const min = (ms) => Math.round(ms / 60e3), med = (a) => { const s = [...a].sort((x, y) => x - y), n = s.length; return n ? (n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2) : null; };
const t = (x) => { const v = typeof x === "number" ? x : Date.parse(x); return Number.isFinite(v) && v > 0 ? v : null; };
// in: { blocks: { radar_news: { written_at, voiced_at, items: [{ headline, source, published_at }] }, ... }, now }
export function mikrinReport(inp) {
  const now = inp.now || Date.now(), out = [];
  for (const id of MIKRIN_BLOCKS) { const b = (inp.blocks || {})[id] || null, items = (b && Array.isArray(b.items)) ? b.items : [];
    const w = t(b && b.written_at), v = t(b && b.voiced_at), pubs = items.map((x) => t(x && x.published_at)).filter((p) => p && (!w || p <= w + 5 * 60e3));
    const lag = w ? pubs.map((p) => Math.max(0, w - p)) : [];
    out.push({ id, items: items.length, items_with_source_time: pubs.length,
      steps: [
        { id: "source_to_text", minutes_median: lag.length ? min(med(lag)) : null, minutes_min: lag.length ? min(Math.min(...lag)) : null, minutes_max: lag.length ? min(Math.max(...lag)) : null },
        { id: "text_to_voice", minutes: w && v ? min(Math.max(0, v - w)) : null, measured: id !== "studio" }, // голос студии этот датчик пока не меряет
      ],
      newest_news_age_minutes: pubs.length ? min(now - Math.max(...pubs)) : null, written_at: w ? new Date(w).toISOString() : null, voiced_at: v ? new Date(v).toISOString() : null });
  }
  const timed = out.filter((b) => b.steps[0].minutes_median != null), best = timed.sort((a, b) => a.steps[0].minutes_median - b.steps[0].minutes_median)[0] || null;
  return { sensor: "mikrin", checked_at: new Date(now).toISOString(), air_language: inp.air || null, blocks: out.sort((a, b) => MIKRIN_BLOCKS.indexOf(a.id) - MIKRIN_BLOCKS.indexOf(b.id)), shortest_path: best ? best.id : null, honour: MIKRIN,
    how_to_read: "How long a news story travels from publication at its source to David's text (source_to_text) and from the text to the voice (text_to_voice), per broadcast block. null means no measurement: the source gave no time, or the step has not happened yet. Fewer minutes = a shorter path." };
}
