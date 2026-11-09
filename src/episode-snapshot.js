// Снимок данных радаров на дату выпуска Давида. Снимок дневной (сохраняется раз в сутки), поэтому
// он показывает состояние радаров в день выпуска, а не в минуту записи. Если снимка за день нет, поле null.

export function episodeSnapshot(snap, day) {
  if (!snap || !Array.isArray(snap.radars) || !snap.radars.length) return null;
  return {
    day,
    saved_at: snap.saved_at || null,
    precision: "daily snapshot: state of the Orb Studio radars saved once on the episode's date, not at the minute of recording",
    radars: snap.radars.map((r) => ({
      id: r.id, title: r.title, risk_index: r.risk_index, delta_24h: r.delta_24h,
      top_headline: r.headlines && r.headlines[0] ? { title: r.headlines[0].title, source: r.headlines[0].source, link: r.headlines[0].link || null } : null,
    })),
    full_snapshot: `https://orbstudio.org/api/v1/history?date=${day}`,
  };
}
