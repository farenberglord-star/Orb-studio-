// Условия на маршруте (пешком, велосипед, авто): три числа из уже работающих источников, без новых ключей.
// 1) сколько минут пути приходится на время после заката (формула NOAA из place.js, точность ±2 мин);
// 2) худший официальный индекс воздуха (UBA) по трём точкам маршрута: начало, середина, конец;
// 3) официальные предупреждения DWD для земли (по умолчанию HH), как есть; к районам предупреждений маршрут не привязан.
// Не прогноз: индекс воздуха и предупреждения — значения «сейчас», время заката — для даты и часа выезда.
export function samplePoints(line, n = 3) {
  if (!Array.isArray(line) || line.length < 2) return [];
  const cum = [0];
  for (let i = 1; i < line.length; i++) { const a = line[i - 1], b = line[i], dx = (b.lon - a.lon) * Math.cos(((a.lat + b.lat) / 2) * Math.PI / 180), dy = b.lat - a.lat; cum.push(cum[i - 1] + Math.hypot(dx, dy)); }
  const total = cum[cum.length - 1], out = [];
  for (let k = 0; k < n; k++) {
    const target = total * (k / (n - 1)); let i = cum.findIndex((c) => c >= target); if (i < 0) i = line.length - 1;
    out.push({ lat: Math.round(line[i].lat * 1e4) / 1e4, lon: Math.round(line[i].lon * 1e4) / 1e4 });
  }
  return out;
}
export function darkMinutes(sun, durationMin) {
  if (!sun || sun.polar || !Number.isFinite(sun.minutes_to_sunset) || !Number.isFinite(durationMin) || durationMin <= 0) return null;
  const m = sun.minutes_to_sunset, dark = m <= 0 ? durationMin : Math.max(0, durationMin - m);
  const d = Math.round(dark * 10) / 10;
  return { departure: sun.at_time, sunset: sun.sunset, minutes_after_sunset: d, share: Math.round((d / durationMin) * 100) / 100, note: "Counted from sunset only; a departure before sunrise is not counted as dark." };
}
export function worstAir(list) {
  const ok = (list || []).filter((a) => a && a.status === "ok" && Number.isFinite(a.index));
  if (!ok.length) return { status: "unavailable", checked: (list || []).length, note: "No official air index for the route points." };
  const w = ok.reduce((m, a) => (a.index > m.index ? a : m), ok[0]);
  return { status: "ok", worst_index: w.index, index_class: w.index_class || null, station: w.station || null, distance_km: w.distance_km ?? null, points_with_index: ok.length, points_checked: list.length };
}
export function dwdBrief(d, state) {
  if (!d || d.status === "unavailable" || d.ok === false) return { status: "unavailable", state };
  const st = (d.by_state || [])[0];
  return { status: d.status || "ok", state, active_warnings: d.active_warnings ?? 0, max_level: st ? st.max_level : 0, max_level_label: st ? st.max_level_label : null,
    severe_level3_plus: (d.severe_level3_plus || []).slice(0, 3).map((x) => ({ event: x.event, level: x.level, from: x.from, until: x.until })),
    note: "Official DWD warnings for the whole state, as published; the route is not matched to warning districts." };
}
export function conditionsSummary({ sun, durationMin, air, dwd, state, mode, weather }) {
  return { mode, dark: darkMinutes(sun, durationMin), air: worstAir(air), warnings: dwdBrief(dwd, state), ...(weather ? { weather } : {}),
    note: "Dark share is for the departure time you gave. Temperature, wind, air index and warnings are live values from now, not for later hours. This is a record of official values, not a forecast." };
}
