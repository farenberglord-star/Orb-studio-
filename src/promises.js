// Реестр обещаний («Сёрл»: обещание, план, требование и угроза описывают будущее, а не событие; «Остин»: слова что-то делают только если за ними идёт дело).
// Идея владельца: нам нужны новости, где подтвердилось, что это случилось. Паспорт видит «пообещали» и ставит серый,
// а реестр через неделю проверяет, появилась ли та же история как событие у двух и более изданий. Только отчёт: паспорт не меняется.
import { searleHeadline } from "./searle.js";
import { sameStory } from "./harman.js";

export const FUTURE_ACTS = ["promise", "demand", "threat"];
export const PROMISE_MATURE = 7 * 864e5, PROMISE_MIN = 20;
const pct = (a, b) => (b ? Math.round((100 * a) / b) : null);

// rows: [{ k, radar, source, headline, first_ts, last_ts, n_max }] — истории радаров (radar_life)
export function promiseReport(rows, now = Date.now()) {
  const list = (rows || []).filter((r) => r && r.headline && Number.isFinite(+r.first_ts)).map((r) => ({ ...r, act: searleHeadline(r.headline).act }));
  const events = list.filter((r) => r.act === "event");
  const promises = list.filter((r) => FUTURE_ACTS.includes(r.act));
  const since = list.length ? Math.min(...list.map((r) => +r.first_ts)) : null;
  const words = (t) => [...new Set(String(t || "").toLowerCase().replace(/[^\p{L}\p{N} ]+/gu, " ").split(/\s+/).filter((w) => w.length >= 5).map((w) => w.slice(0, 6)))];
  const index = new Map(); events.forEach((e, i) => { for (const w of words(e.headline)) { if (!index.has(w)) index.set(w, []); index.get(w).push(i); } }); // индекс слов: не сравниваем каждого с каждым
  const rec = [];
  for (const p of promises) {
    const age = now - +p.first_ts, matured = age >= PROMISE_MATURE;
    const cand = new Set(); for (const w of words(p.headline)) for (const i of index.get(w) || []) cand.add(i);
    const hit = [...cand].map((i) => events[i]).filter((e) => e.k !== p.k && +e.first_ts > +p.first_ts && sameStory(p.headline, e.headline));
    const srcs = new Set(hit.map((e) => String(e.source || e.radar || "")).filter(Boolean));
    const strong = hit.some((e) => (+e.n_max || 0) >= 2) || srcs.size >= 2;
    const outcome = strong ? "followed_by_event" : !matured ? "open" : hit.length ? "one_weak_report" : "silence";
    rec.push({ k: p.k, radar: p.radar, act: p.act, headline: p.headline, age_days: Math.round(age / 864e4) / 10, outcome, later: hit[0] ? hit[0].headline : null });
  }
  const tally = (get) => { const o = {}; for (const x of rec) { const key = get(x); const t = o[key] = o[key] || { promises: 0, matured: 0, followed: 0, silence: 0, weak: 0, open: 0 }; t.promises++; if (x.outcome === "open") t.open++; else { t.matured++; if (x.outcome === "followed_by_event") t.followed++; else if (x.outcome === "silence") t.silence++; else t.weak++; } } for (const t of Object.values(o)) t.followed_pct = t.matured >= PROMISE_MIN ? pct(t.followed, t.matured) : null; return o; };
  const matured = rec.filter((x) => x.outcome !== "open"), followed = matured.filter((x) => x.outcome === "followed_by_event").length;
  const ready = matured.length >= PROMISE_MIN;
  return {
    sensor: "promise_ledger", since: since ? new Date(since).toISOString() : null, stories: list.length, future_stories: promises.length,
    share_of_all_pct: pct(promises.length, list.length), matured: matured.length, followed_by_event: followed,
    followed_pct: ready ? pct(followed, matured.length) : null, verdict: ready ? "measured" : "collecting",
    by_act: tally((x) => x.act), by_radar: tally((x) => x.radar),
    examples: { followed: rec.filter((x) => x.outcome === "followed_by_event").slice(0, 6), silence: rec.filter((x) => x.outcome === "silence").slice(0, 6) },
    method: `A story counts as a promise when its headline is a promise/plan, demand or threat (Searle word rules). After ${PROMISE_MATURE / 864e5} days it is 'followed_by_event' if a later radar story about the same subject is worded as an event and carried by 2+ outlets, 'one_weak_report' if only one outlet, 'silence' if none.`,
    caveat: "Matching is by shared key words, so a followed promise can be missed (reworded) and an unrelated story can match; the share is a rough floor of follow-through, good for comparing radars and speech acts with each other, not an exact rate. radar_life keeps 30 days.",
  };
}
