// «Ядро и хвост изданий» — мостик Библиотеки кристаллов: Сэмюэл Брэдфорд (закон рассеяния, «Документация», 1948: статьи по теме
// сидят в небольшом ядре журналов и длинном хвосте многих других) + Альфред Лотка (немногие активные авторы дают большую часть объёма,
// 1926) + Парето + Люберг (сеть решает улов). Для заголовков радаров за 7 дней: сколько изданий дают каждую треть заголовков
// (зоны Брэдфорда), какую долю дают 5 и 10 крупнейших, и какие истории нёс только хвост — что мы потеряли бы, читая одно ядро.
import { storyStems, commonStems } from "./duo.js";
export const BRADFORD_MIN = 300;
const outletOf = (s) => String(s || "unknown").trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/+$/, "");
export function bradfordReport(rows, now = Date.now()) {
  const items = (rows || []).filter((r) => r && r.headline).map((r) => ({ headline: r.headline, outlet: outletOf(r.source), radar: r.radar || null }));
  const per = {}; for (const r of items) per[r.outlet] = (per[r.outlet] || 0) + 1;
  const ranked = Object.entries(per).sort((a, b) => b[1] - a[1]), N = items.length, share = (k) => (N ? Math.round((100 * ranked.slice(0, k).reduce((s, x) => s + x[1], 0)) / N) : null);
  // зоны Брэдфорда: три группы изданий с примерно равным числом заголовков
  const zones = [[], [], []]; let acc = 0;
  for (const [o, n] of ranked) { const z = Math.min(2, Math.floor((3 * acc) / Math.max(1, N))); zones[z].push(o); acc += n; }
  const zoneOf = {}; zones.forEach((z, i) => z.forEach((o) => (zoneOf[o] = i)));
  const mult = zones[0].length && zones[1].length ? Math.round((10 * zones[1].length) / zones[0].length) / 10 : null;
  // истории только хвоста: заголовки третьей зоны, которых нет ни у одного издания первых двух зон (по общим основам слов)
  const common = commonStems(items.map((r) => r.headline), 0.02, 5), stems = items.map((r) => storyStems(r.headline));
  const same = (A, B) => { let k = 0; for (const w of A) if (B.has(w)) k += common.has(w) ? 0.5 : 1; return k >= 3 || (k >= 2 && k >= 0.5 * Math.min(A.size, B.size)); };
  const coreIdx = items.map((r, i) => (zoneOf[r.outlet] < 2 ? i : -1)).filter((i) => i >= 0), tailIdx = items.map((r, i) => (zoneOf[r.outlet] === 2 ? i : -1)).filter((i) => i >= 0);
  const tailOnly = tailIdx.filter((i) => !coreIdx.some((j) => same(stems[i], stems[j])));
  const byRadar = {}; for (const i of tailOnly) { const r = items[i].radar || "?"; byRadar[r] = (byRadar[r] || 0) + 1; }
  const tailOnlyPct = tailIdx.length ? Math.round((100 * tailOnly.length) / tailIdx.length) : null;
  return {
    sensor: "bradford", verdict: N < BRADFORD_MIN ? "collecting" : share(10) >= 50 ? "core_heavy" : "spread",
    headlines: N, outlets: ranked.length, top5_share_pct: share(5), top10_share_pct: share(10),
    top_outlets: ranked.slice(0, 10).map(([outlet, headlines]) => ({ outlet, headlines })),
    zones: zones.map((z, i) => ({ zone: i + 1, outlets: z.length, headlines: z.reduce((s, o) => s + per[o], 0) })), bradford_multiplier: mult,
    tail_headlines: tailIdx.length, tail_only_headlines: tailOnly.length, tail_only_pct: tailOnlyPct, tail_only_by_radar: byRadar,
    tail_only_examples: tailOnly.slice(0, 8).map((i) => ({ headline: items[i].headline, outlet: items[i].outlet, radar: items[i].radar })),
    question: "How concentrated are the outlets behind the Orb Studio radar headlines, and what would an agent miss by reading only the core outlets?",
    method: `Radar headlines first seen in the last 7 days are counted per outlet. Outlets are sorted by count and split into three zones with about a third of the headlines each (Bradford zones); the multiplier is how many times more outlets zone 2 needs than zone 1. A zone-3 headline is 'tail only' when no zone-1 or zone-2 headline shares its story by common word stems (stems found in 2%+ of the headlines count half). core_heavy when the ten largest outlets give half of all headlines or more. Verdict from ${BRADFORD_MIN} headlines. No AI.`,
    rule: "Reading only the core outlets misses part of the news; when a story comes only from small outlets, say so and how many carry it — it may be early, local or wrong.",
    caveat: "The outlets are the ones the radars subscribe to, not the whole press; 'tail only' matching is by shared words in the same language, so a story told by the core in another language counts as tail only.",
    bridge: "Crystal Library bridge 'core and long tail of outlets': Samuel C. Bradford (law of scattering, 1948) + Alfred J. Lotka (1926) + Pareto + Lyberg.",
    similar: "Bradford's and Lotka's laws are standard in bibliometrics (journals, authors); media-concentration studies count outlet shares. This applies them live to the outlets behind the Orb Studio radars, for agents.",
    generated_at: new Date(now).toISOString(),
  };
}
