// Журнал исходов лент по 30-минутным слотам (Эрланг: нагрузка и ожидание).
// worker.js считает исходы в fc.st при каждом обновлении радаров и складывает в таблицу feed_log;
// здесь — чистая часть: пустая статистика, склейка причин и отчёт за сутки.
export const FEED_COLS = ["runs", "asked", "fresh", "fetched", "ok", "timeout", "http", "empty", "skipped", "stale", "none", "empty_radars"];
export const newFeedStats = () => ({ asked: 0, fresh: 0, fetched: 0, ok: 0, timeout: 0, http: 0, empty: 0, skipped: 0, stale: 0, none: 0 });

// Причина неудачи из ошибки fetch: таймаут отличаем от остальных
export const failReason = (e) => (e && (e.name === "TimeoutError" || e.name === "AbortError") ? "timeout" : "error");

// Отчёт: rows — строки feed_log (slot, ts, runs, asked, ...). Доли считаем от числа живых запросов к сети (fetched).
export function feedReport(rows, now, hours = 24) {
  const since = now - hours * 3600e3;
  const use = (rows || []).filter((r) => r.ts >= since);
  const sum = (k) => use.reduce((a, r) => a + (r[k] || 0), 0);
  const fetched = sum("fetched");
  const asked = sum("asked");
  const share = (n, d) => (d > 0 ? Math.round((n / d) * 1000) / 1000 : null);
  const bad = use.filter((r) => (r.timeout || 0) + (r.http || 0) + (r.empty || 0) + (r.skipped || 0) + (r.empty_radars || 0) > 0);
  return {
    hours, slots: use.length, runs: sum("runs"),
    requests: asked, from_cache: sum("fresh"), network_calls: fetched,
    network_failed: sum("timeout") + sum("http") + sum("empty"),
    timeout: sum("timeout"), http: sum("http"), empty: sum("empty"),
    skipped_by_budget: sum("skipped"), served_stale: sum("stale"), no_data: sum("none"),
    radars_without_feed: sum("empty_radars"),
    share_failed_of_network: share(sum("timeout") + sum("http") + sum("empty"), fetched),
    share_skipped_of_requests: share(sum("skipped"), asked),
    slots_with_trouble: bad.length,
    trouble: bad.slice(-12).map((r) => ({ ts: new Date(r.ts).toISOString(), timeout: r.timeout || 0, http: r.http || 0, empty: r.empty || 0, skipped: r.skipped || 0, empty_radars: r.empty_radars || 0 })),
    note: "none before the journal started (25.11.2026); a counted failure is a feed that gave no items in time, not proof the publisher is down",
  };
}
