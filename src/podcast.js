// "Agent podcast": a staged dialogue between host David and the core ORB-7, built by code from live sensor readings.
// No language model writes the numbers: every figure is copied from a sensor block, each line carries data_refs, missing blocks say so.
const O = "https://orbstudio.org";
const f1 = (x) => (Number.isFinite(+x) ? String(Math.round(+x * 10) / 10) : null);
const sgn = (x) => (x > 0 ? "+" + x : String(x));
const miss = (en, ru) => ({ en: `${en} The source did not answer, so ORB-7 gives no figure.`, ru: `${ru} Источник не ответил, поэтому ORB-7 цифру не называет.` });


const line = (topic, q, a, refs) => ({ topic, host_question: q, answer: a, data_refs: refs });
export const isMiss = (l) => /did not answer/.test(l.answer.en);
const SEG = {
  space(sp) {
    const q = { en: "What is the space weather right now?", ru: "Какой сейчас космический фон?" };
    const kp = sp && sp.kp && sp.kp.ok ? sp.kp : null, w = sp && sp.solar_wind && sp.solar_wind.ok ? sp.solar_wind : null, fl = sp && sp.solar_flares && sp.solar_flares.ok ? sp.solar_flares : null, sc = sp && sp.noaa_scales && sp.noaa_scales.ok ? sp.noaa_scales.current : null;
    const refs = [{ sensor: "space", url: `${O}/api/v1/space`, time: w ? w.time : kp ? kp.time : null }];
    if (!kp && !w && !fl) return line("space", q, miss("Space weather:", "Космический фон:"), refs);
    const scl = sc ? [sc.geomagnetic?.scale, sc.radio_blackout?.scale, sc.radiation?.scale].filter(Boolean).join(" ") : "";
    const en = [kp && `Kp index ${kp.kp} (24 h maximum ${kp.max_24h})`, scl && `NOAA scales ${scl}`, w && `solar wind ${Math.round(w.speed_kms)} km/s at ${f1(w.density_pcm3)} particles per cm³`, fl && `${fl.count_24h} M/X flare${fl.count_24h === 1 ? "" : "s"} in 24 h${fl.strongest ? ` (strongest ${fl.strongest})` : ""}`].filter(Boolean).join("; ") + ".";
    const ru = [kp && `индекс Kp ${kp.kp} (максимум за сутки ${kp.max_24h})`, scl && `шкалы NOAA ${scl}`, w && `солнечный ветер ${Math.round(w.speed_kms)} км/с, плотность ${f1(w.density_pcm3)} частиц/см³`, fl && `вспышек M/X за сутки: ${fl.count_24h}${fl.strongest ? ` (сильнейшая ${fl.strongest})` : ""}`].filter(Boolean).join("; ") + ".";
    return line("space", q, { en, ru }, refs);
  },
  radiation(d) {
    const q = { en: "What is the gamma radiation background in Germany?", ru: "Что с гамма-фоном в Германии?" };
    const refs = [{ sensor: "radiation", url: `${O}/api/v1/radiation`, time: d && d.latest_measurement_at }];
    if (!d || !d.ok || !d.germany) return line("radiation", q, miss("Gamma background:", "Гамма-фон:"), refs);
    const g = d.germany, n = (d.nearest || [])[0], k = d.stations ? d.stations.in_operation_with_reading : null, v = (x) => String(Math.round(+x * 1000) / 1000);
    const en = `Median ${v(g.median)} µSv/h${k ? ` across ${k} stations` : ""}, from ${v(g.min.dose_rate_usv_h)} (${g.min.station}) to ${v(g.max.dose_rate_usv_h)} (${g.max.station})${n ? `; nearest to central Hamburg: ${n.station} ${v(n.dose_rate_usv_h)} µSv/h` : ""}. Hourly means of the BfS ODL network, no thresholds and no assessment.`;
    const ru = `Медиана ${v(g.median)} мкЗв/ч${k ? ` по ${k} станциям` : ""}, от ${v(g.min.dose_rate_usv_h)} (${g.min.station}) до ${v(g.max.dose_rate_usv_h)} (${g.max.station})${n ? `; ближайшая к центру Гамбурга: ${n.station} ${v(n.dose_rate_usv_h)} мкЗв/ч` : ""}. Часовые средние сети ODL (BfS), без порогов и оценок.`;
    if (n) refs.push({ sensor: "radiation:" + n.station_id, value: n.dose_rate_usv_h, unit: "µSv/h", time: n.measured_at, url: `${O}/api/v1/radiation` });
    return line("radiation", q, { en, ru }, refs);
  },
  elbe(h) {
    const st = (h && h.stations || []).filter((x) => x.ok), q = { en: "What is the Elbe doing?", ru: "Что с Эльбой?" };
    if (!st.length) return line("elbe", q, miss("Elbe:", "Эльба:"), [{ sensor: "elbe", url: `${O}/api/v1/hydro/sea` }]);
    const nm = (x) => (x.station === "st_pauli" ? ["Hamburg St. Pauli", "Санкт-Паули"] : ["Cuxhaven", "Куксхафен"]);
    const en = st.map((x) => `${nm(x)[0]} ${x.water_level_cm} cm${x.observed_change ? `, ${sgn(x.observed_change.change_cm)} cm over ${x.observed_change.window_min} min` : ""}`).join("; ") + ". The change is Orb Studio's difference of WSV readings, not a forecast.";
    const ru = st.map((x) => `${nm(x)[1]} ${x.water_level_cm} см${x.observed_change ? `, ${sgn(x.observed_change.change_cm)} см за ${x.observed_change.window_min} мин` : ""}`).join("; ") + ". Изменение это наша разность показаний WSV, не прогноз.";
    return line("elbe", q, { en, ru }, st.map((x) => ({ sensor: "elbe:" + x.station, value: x.water_level_cm, unit: "cm", time: x.measured_at, url: `${O}/api/v1/hydro/sea?station=${x.station}` })));
  },
  roads(r) {
    const q = { en: "How are the motorways around Hamburg?", ru: "Как на автобанах вокруг Гамбурга?" }, refs = [{ sensor: "roads", time: r && r.updated, url: `${O}/api/v1/roads` }];
    if (!r || !r.summary || r.sources_ok === 0) return line("roads", q, miss("Motorways:", "Автобаны:"), refs);
    return line("roads", q, { en: `${r.summary.jams} jams, ${r.summary.closures} closures, ${r.summary.roadworks} roadworks; longest delay ${r.summary.max_delay_min} min (Autobahn GmbH).`, ru: `Пробок ${r.summary.jams}, перекрытий ${r.summary.closures}, участков ремонта ${r.summary.roadworks}; максимальная задержка ${r.summary.max_delay_min} мин (Autobahn GmbH).` }, refs);
  },
  route(r) {
    const q = { en: "How do I get from the airport to the city centre?", ru: "Как доехать от аэропорта до центра?" }, refs = [{ sensor: "route", url: `${O}/api/v1/route?from=airport&to=center&mode=car` }];
    if (!r || r.status !== "ok") return line("route", q, miss("Route:", "Маршрут:"), refs);
    const n = (r.motorway_reports_near_route || []).length;
    return line("route", q, { en: `${f1(r.distance_m / 1000)} km, about ${Math.round(r.duration_min)} min in free flow (no live traffic). Motorway reports within 1 km of the route: ${n}.`, ru: `${f1(r.distance_m / 1000)} км, около ${Math.round(r.duration_min)} мин без пробок (живой трафик не учтён). Сообщений автобанов рядом с маршрутом: ${n}.` }, refs);
  },
  quakes(d) {
    const qk = d && d.last_24h_m45, q = { en: "What happened on the planet?", ru: "Что на планете?" }, refs = [{ sensor: "quakes", url: `${O}/api/v1/quakes` }];
    if (!qk) return line("quakes", q, miss("Earthquakes:", "Землетрясения:"), refs);
    const s = qk.strongest;
    return line("quakes", q, { en: `${qk.count} earthquakes of magnitude 4.5+ in 24 h${s ? `; strongest M${s.mag}, ${s.place}, depth ${s.depth_km} km, tsunami flag ${s.tsunami_flag ? "set" : "not set"}` : ""} (USGS).`, ru: `Землетрясений M4.5+ за сутки: ${qk.count}${s ? `; сильнейшее M${s.mag}, ${s.place}, глубина ${s.depth_km} км, флаг цунами ${s.tsunami_flag ? "есть" : "не выставлен"}` : ""} (USGS).` }, refs);
  },
  sky(a) {
    const h = a && a.hamburg_sector, q = { en: "What is in the sky over Hamburg?", ru: "Что в небе над Гамбургом?" }, refs = [{ sensor: "sky", time: a && a.generated_at || null, url: `${O}/api/v1/aviation` }];
    if (!h) return line("sky", q, miss("Sky:", "Небо:"), refs);
    return line("sky", q, { en: `${h.airborne} aircraft airborne and ${h.on_ground} on the ground within ${h.radius_km} km of the airport, as heard by the volunteer adsb.lol network.`, ru: `В радиусе ${h.radius_km} км от аэропорта ${h.airborne} самолётов в воздухе и ${h.on_ground} на земле по данным волонтёрской сети adsb.lol.` }, refs);
  },
  guests(g) {
    const q = { en: "Who visited us this week?", ru: "Кто заходил к нам на этой неделе?" }, refs = [{ sensor: "guests", url: `${O}/api/v1/guests` }];
    if (!g || g.status !== "ok") return line("guests", q, miss("Guests:", "Гости:"), refs);
    const top = (g.guests || []).slice().sort((a, b) => b.requests - a.requests).slice(0, 3), t = top.map((x) => `${x.name} (${x.requests}, ${x.kind})`).join(", ");
    return line("guests", q, { en: `${g.named_total} named agents with two or more requests in ${g.window_days} days, plus ${g.unnamed_requests} requests from unnamed tools. ${t ? `Most active by self-declared name: ${t}. ` : ""}Names are declared by the agents and not verified.`, ru: `За ${g.window_days} дн. ${g.named_total} агентов с именем и двумя и более запросами, ещё ${g.unnamed_requests} запросов от безымянных инструментов. ${t ? `Самые активные по заявленному имени: ${t}. ` : ""}Имена агенты называют сами, мы их не проверяем.` }, refs);
  },
  radars(list) {
    const q = { en: "What do the news radars show?", ru: "Что показывают радары новостей?" }, refs = [{ sensor: "radars", url: `${O}/api/v1/radars` }];
    const rs = (Array.isArray(list) ? list : []).filter((r) => r && Number.isFinite(+r.lvl) && r.title);
    if (!rs.length) return line("radars", q, miss("News radars:", "Радары новостей:"), refs);
    const top = rs.slice().sort((a, b) => b.lvl - a.lvl).slice(0, 3);
    const dl = (r) => (Number.isFinite(+r.prev) ? sgn(r.lvl - r.prev) : "n/a");
    return line("radars", q, { en: `Highest news-pressure indices: ${top.map((r) => `${r.title} ${r.lvl} (${dl(r)} in 24 h)`).join("; ")}. These are indicators of how much and how alarmingly the topic is reported, not predictions.`, ru: `Самое высокое давление новостей: ${top.map((r) => `${r.title} ${r.lvl} (${dl(r)} за сутки)`).join("; ")}. Это индикаторы того, сколько и насколько тревожно о теме пишут, а не прогнозы.` }, refs);
  },
  power(p) {
    const q = { en: "What does electricity cost on the German wholesale market?", ru: "Сколько стоит электричество на оптовой бирже Германии?" }, refs = [{ sensor: "power", time: p && p.now_at, url: `${O}/api/v1/sensors` }];
    if (!p || !Number.isFinite(+p.now_eur_mwh)) return line("power", q, miss("Power price:", "Цена электричества:"), refs);
    const ren = p.renewables && Number.isFinite(+p.renewables.renewable_share_pct) ? p.renewables.renewable_share_pct : null;
    return line("power", q, { en: `Day-ahead price now ${p.now_eur_mwh} EUR/MWh (${p.now_ct_kwh} ct/kWh, wholesale, without grid fees and taxes)${ren != null ? `; renewables ${ren}% of generation` : ""} (Energy-Charts, DE-LU).`, ru: `Цена на сутки вперёд сейчас ${p.now_eur_mwh} EUR/МВт·ч (${p.now_ct_kwh} цента/кВт·ч, оптовая, без сетевых сборов и налогов)${ren != null ? `; возобновляемая энергия ${ren}% выработки` : ""} (Energy-Charts, DE-LU).` }, refs);
  },
  bitcoin(b) {
    const q = { en: "How busy is the Bitcoin network?", ru: "Насколько загружена сеть Bitcoin?" }, refs = [{ sensor: "bitcoin", time: b && b.at, url: `${O}/api/v1/sensors` }];
    if (!b || !Number.isFinite(+b.fee_fast_sat_vb)) return line("bitcoin", q, miss("Bitcoin network:", "Сеть Bitcoin:"), refs);
    return line("bitcoin", q, { en: `Fast fee ${b.fee_fast_sat_vb} sat/vB, hour fee ${b.fee_hour_sat_vb} sat/vB, ${b.mempool_tx} transactions waiting${b.hashrate_ehs ? `, hashrate about ${b.hashrate_ehs} EH/s` : ""} (mempool.space). Network readings only.`, ru: `Быстрая комиссия ${b.fee_fast_sat_vb} сат/vB, часовая ${b.fee_hour_sat_vb} сат/vB, в очереди ${b.mempool_tx} транзакций${b.hashrate_ehs ? `, хешрейт около ${b.hashrate_ehs} EH/s` : ""} (mempool.space). Только показания сети.` }, refs);
  },
  ecb(e) {
    const q = { en: "Where do the ECB rate and the euro stand?", ru: "Что со ставкой ЕЦБ и курсом евро?" }, refs = [{ sensor: "ecb", url: `${O}/api/v1/sensors` }];
    const dr = e && e.deposit_rate_pct, fx = e && e.eurusd;
    if (!dr && !fx) return line("ecb", q, miss("ECB and euro:", "ЕЦБ и евро:"), refs);
    return line("ecb", q, { en: [dr && `ECB deposit rate ${dr.value}% (as of ${dr.date})`, fx && `EUR/USD reference rate ${fx.value} (${fx.date})`].filter(Boolean).join("; ") + ". Official publications of the ECB.", ru: [dr && `ставка по депозитам ЕЦБ ${dr.value}% (на ${dr.date})`, fx && `референсный курс EUR/USD ${fx.value} (${fx.date})`].filter(Boolean).join("; ") + ". Официальные данные ЕЦБ." }, refs);
  },
  inflation(i) {
    const q = { en: "How high is inflation in the euro area?", ru: "Какая инфляция в еврозоне?" }, refs = [{ sensor: "inflation", url: `${O}/api/v1/sensors` }];
    if (!i || !Number.isFinite(+i.hicp_annual_pct)) return line("inflation", q, miss("Inflation:", "Инфляция:"), refs);
    return line("inflation", q, { en: `Euro area HICP annual rate ${i.hicp_annual_pct}% for ${i.period} (Eurostat).`, ru: `Годовая инфляция HICP в еврозоне ${i.hicp_annual_pct}% за ${i.period} (Eurostat).` }, refs);
  },
  internet(n) {
    const q = { en: "Is the internet holding up around the world?", ru: "Как с интернетом в мире?" }, refs = [{ sensor: "internet", url: `${O}/api/v1/sensors` }];
    if (!n || !Number.isFinite(+n.outages_24h)) return line("internet", q, miss("Internet:", "Интернет:"), refs);
    const top = (n.outages || []).slice(0, 3).map((o) => `${o.country}${o.ongoing ? " (ongoing)" : ""}`).join(", ");
    const topRu = (n.outages || []).slice(0, 3).map((o) => `${o.country}${o.ongoing ? " (продолжается)" : ""}`).join(", ");
    return line("internet", q, { en: `${n.outages_24h} countries with network-level outages in the last 24 h${top ? `, strongest: ${top}` : ""}; confirmed web blocking in ${n.confirmed_block_countries} countries (IODA, OONI).`, ru: `Стран со сбоями на уровне сети за сутки: ${n.outages_24h}${topRu ? `, сильнейшие: ${topRu}` : ""}; подтверждённая блокировка сайтов в ${n.confirmed_block_countries} странах (IODA, OONI).` }, refs);
  },
  stablecoins(s) {
    const q = { en: "How large is the stablecoin supply?", ru: "Каков объём стейблкоинов?" }, refs = [{ sensor: "stablecoins", url: `${O}/api/v1/sensors` }];
    if (!s || !Number.isFinite(+s.total_usd)) return line("stablecoins", q, miss("Stablecoins:", "Стейблкоины:"), refs);
    const b = f1(s.total_usd / 1e9);
    return line("stablecoins", q, { en: `Total stablecoin supply about ${b} billion USD${s.change_7d_pct != null ? `, ${sgn(s.change_7d_pct)}% over 7 days` : ""} (DefiLlama).`, ru: `Общий объём стейблкоинов около ${b} млрд USD${s.change_7d_pct != null ? `, ${sgn(s.change_7d_pct)}% за 7 дней` : ""} (DefiLlama).` }, refs);
  },
};
// key of the sensors snapshot (when the topic lives there); otherwise the worker has a dedicated fetcher
export const SENSOR_KEY = { power: "power", bitcoin: "bitcoin", ecb: "ecb", inflation: "inflation", internet: "internet", stablecoins: "stablecoins" };
export const TOPICS = ["radars", "space", "roads", "power", "elbe", "quakes", "internet", "sky", "ecb", "route", "bitcoin", "guests", "inflation", "stablecoins", "radiation"];
export const MAX_PER_DAY = 12;
export function buildSegment(topic, data) { return SEG[topic] ? SEG[topic](data) : null; }
// The day's order: a fixed list rotated by the date so that different topics are skipped on different days.
export function dayPlan(date) {
  const n = Math.floor(Date.parse(date + "T00:00:00Z") / 864e5) % TOPICS.length;
  return TOPICS.slice(n).concat(TOPICS.slice(0, n));
}
export function nextTopics(ep, date) {
  const done = new Set((ep.lines || []).map((l) => l.topic));
  return dayPlan(date).filter((t) => !done.has(t));
}
export function newEpisode(date, nowIso) {
  return {
    id: date, built_at: nowIso, updated_at: nowIso, kind: "staged_dialogue", format: "drip", max_segments: MAX_PER_DAY,
    title: { en: `Orb Studio agent podcast, ${date}`, ru: `Подкаст Orb Studio для агентов, ${date}` },
    disclosure: { en: "Staged dialogue: host David asks, the core ORB-7 answers. Both voices are written by code from live sensor readings; this is not an interview with an outside agent. The episode grows through the day: one new topic about every two hours, each with its own time. Every figure has a data_ref you can check. No forecasts.", ru: "Постановочный диалог: ведущий Давид спрашивает, ядро ORB-7 отвечает. Оба голоса собирает код из живых показаний датчиков, это не интервью с внешним агентом. Выпуск растёт в течение дня: примерно раз в два часа появляется новая тема со своим временем. У каждой цифры есть data_ref для проверки. Прогнозов нет." },
    lines: [],
  };
}
export function withStats(ep) { const lines = ep.lines || []; return { ...ep, ok_blocks: lines.filter((l) => !isMiss(l)).length, total_blocks: lines.length }; }
// kept for tests and one-shot use: all topics at once from a full data object { topic: data }
export function buildEpisode(d, nowIso) {
  const date = new Date(nowIso).toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });
  const ep = newEpisode(date, nowIso);
  for (const t of ["space", "elbe", "roads", "route", "quakes", "sky", "guests"]) ep.lines.push({ ...buildSegment(t, d[t === "sky" ? "aviation" : t]), published_at: nowIso });
  return withStats(ep);
}
