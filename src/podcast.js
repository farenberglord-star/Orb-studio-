// "Agent podcast": a staged dialogue between host David and the core ORB-7, built by code from live sensor readings.
// No language model writes the numbers: every figure is copied from a sensor block, each line carries data_refs, missing blocks say so.
const O = "https://orbstudio.org";
const f1 = (x) => (Number.isFinite(+x) ? String(Math.round(+x * 10) / 10) : null);
const sgn = (x) => (x > 0 ? "+" + x : String(x));
const miss = (en, ru) => ({ en: `${en} The source did not answer, so ORB-7 gives no figure.`, ru: `${ru} Источник не ответил, поэтому ORB-7 цифру не называет.` });

export function buildEpisode(d, nowIso) {
  const lines = [];
  const add = (topic, q, a, refs) => lines.push({ topic, host_question: q, answer: a, data_refs: refs });

  const sp = d.space, kp = sp && sp.kp && sp.kp.ok ? sp.kp : null, w = sp && sp.solar_wind && sp.solar_wind.ok ? sp.solar_wind : null, fl = sp && sp.solar_flares && sp.solar_flares.ok ? sp.solar_flares : null, sc = sp && sp.noaa_scales && sp.noaa_scales.ok ? sp.noaa_scales.current : null;
  {
    const q = { en: "What is the space weather right now?", ru: "Какой сейчас космический фон?" };
    if (!kp && !w && !fl) add("space", q, miss("Space weather:", "Космический фон:"), [{ sensor: "space", url: `${O}/api/v1/space` }]);
    else {
      const scl = sc ? [sc.geomagnetic?.scale, sc.radio_blackout?.scale, sc.radiation?.scale].filter(Boolean).join(" ") : "";
      const en = [kp && `Kp index ${kp.kp} (24 h maximum ${kp.max_24h})`, scl && `NOAA scales ${scl}`, w && `solar wind ${Math.round(w.speed_kms)} km/s at ${f1(w.density_pcm3)} particles per cm³`, fl && `${fl.count_24h} M/X flare${fl.count_24h === 1 ? "" : "s"} in 24 h${fl.strongest ? ` (strongest ${fl.strongest})` : ""}`].filter(Boolean).join("; ") + ".";
      const ru = [kp && `индекс Kp ${kp.kp} (максимум за сутки ${kp.max_24h})`, scl && `шкалы NOAA ${scl}`, w && `солнечный ветер ${Math.round(w.speed_kms)} км/с, плотность ${f1(w.density_pcm3)} частиц/см³`, fl && `вспышек M/X за сутки: ${fl.count_24h}${fl.strongest ? ` (сильнейшая ${fl.strongest})` : ""}`].filter(Boolean).join("; ") + ".";
      add("space", q, { en, ru }, [{ sensor: "space", url: `${O}/api/v1/space`, time: w ? w.time : kp ? kp.time : null }]);
    }
  }
  {
    const st = (d.hydro && d.hydro.stations || []).filter((s) => s.ok), q = { en: "What is the Elbe doing?", ru: "Что с Эльбой?" };
    if (!st.length) add("elbe", q, miss("Elbe:", "Эльба:"), [{ sensor: "elbe", url: `${O}/api/v1/hydro/sea` }]);
    else {
      const nm = (s) => (s.station === "st_pauli" ? ["Hamburg St. Pauli", "Санкт-Паули"] : ["Cuxhaven", "Куксхафен"]);
      const en = st.map((s) => `${nm(s)[0]} ${s.water_level_cm} cm${s.observed_change ? `, ${sgn(s.observed_change.change_cm)} cm over ${s.observed_change.window_min} min` : ""}`).join("; ") + ". The change is Orb Studio's difference of WSV readings, not a forecast.";
      const ru = st.map((s) => `${nm(s)[1]} ${s.water_level_cm} см${s.observed_change ? `, ${sgn(s.observed_change.change_cm)} см за ${s.observed_change.window_min} мин` : ""}`).join("; ") + ". Изменение это наша разность показаний WSV, не прогноз.";
      add("elbe", q, { en, ru }, st.map((s) => ({ sensor: "elbe:" + s.station, value: s.water_level_cm, unit: "cm", time: s.measured_at, url: `${O}/api/v1/hydro/sea?station=${s.station}` })));
    }
  }
  {
    const r = d.roads, q = { en: "How are the motorways around Hamburg?", ru: "Как на автобанах вокруг Гамбурга?" };
    if (!r || !r.summary || r.sources_ok === 0) add("roads", q, miss("Motorways:", "Автобаны:"), [{ sensor: "roads", url: `${O}/api/v1/roads` }]);
    else add("roads", q, { en: `${r.summary.jams} jams, ${r.summary.closures} closures, ${r.summary.roadworks} roadworks; longest delay ${r.summary.max_delay_min} min (Autobahn GmbH).`, ru: `Пробок ${r.summary.jams}, перекрытий ${r.summary.closures}, участков ремонта ${r.summary.roadworks}; максимальная задержка ${r.summary.max_delay_min} мин (Autobahn GmbH).` }, [{ sensor: "roads", time: r.updated, url: `${O}/api/v1/roads` }]);
  }
  {
    const r = d.route, q = { en: "How do I get from the airport to the city centre?", ru: "Как доехать от аэропорта до центра?" };
    if (!r || r.status !== "ok") add("route", q, miss("Route:", "Маршрут:"), [{ sensor: "route", url: `${O}/api/v1/route?from=airport&to=center&mode=car` }]);
    else {
      const n = (r.motorway_reports_near_route || []).length;
      add("route", q, { en: `${f1(r.distance_m / 1000)} km, about ${Math.round(r.duration_min)} min in free flow (no live traffic). Motorway reports within 1 km of the route: ${n}.`, ru: `${f1(r.distance_m / 1000)} км, около ${Math.round(r.duration_min)} мин без пробок (живой трафик не учтён). Сообщений автобанов рядом с маршрутом: ${n}.` }, [{ sensor: "route", url: `${O}/api/v1/route?from=airport&to=center&mode=car` }]);
    }
  }
  {
    const qk = d.quakes && d.quakes.last_24h_m45, q = { en: "What happened on the planet?", ru: "Что на планете?" };
    if (!qk) add("quakes", q, miss("Earthquakes:", "Землетрясения:"), [{ sensor: "quakes", url: `${O}/api/v1/quakes` }]);
    else {
      const s = qk.strongest;
      add("quakes", q, { en: `${qk.count} earthquakes of magnitude 4.5+ in 24 h${s ? `; strongest M${s.mag}, ${s.place}, depth ${s.depth_km} km, tsunami flag ${s.tsunami_flag ? "set" : "not set"}` : ""} (USGS).`, ru: `Землетрясений M4.5+ за сутки: ${qk.count}${s ? `; сильнейшее M${s.mag}, ${s.place}, глубина ${s.depth_km} км, флаг цунами ${s.tsunami_flag ? "есть" : "не выставлен"}` : ""} (USGS).` }, [{ sensor: "quakes", url: `${O}/api/v1/quakes` }]);
    }
  }
  {
    const h = d.aviation && d.aviation.hamburg_sector, q = { en: "What is in the sky over Hamburg?", ru: "Что в небе над Гамбургом?" };
    if (!h) add("sky", q, miss("Sky:", "Небо:"), [{ sensor: "sky", url: `${O}/api/v1/aviation` }]);
    else add("sky", q, { en: `${h.airborne} aircraft airborne and ${h.on_ground} on the ground within ${h.radius_km} km of the airport, as heard by the volunteer adsb.lol network.`, ru: `В радиусе ${h.radius_km} км от аэропорта ${h.airborne} самолётов в воздухе и ${h.on_ground} на земле по данным волонтёрской сети adsb.lol.` }, [{ sensor: "sky", time: d.aviation.generated_at || null, url: `${O}/api/v1/aviation` }]);
  }
  {
    const g = d.guests, q = { en: "Who visited us this week?", ru: "Кто заходил к нам на этой неделе?" };
    if (!g || g.status !== "ok") add("guests", q, miss("Guests:", "Гости:"), [{ sensor: "guests", url: `${O}/api/v1/guests` }]);
    else {
      const top = (g.guests || []).slice().sort((a, b) => b.requests - a.requests).slice(0, 3);
      const t = top.map((x) => `${x.name} (${x.requests}, ${x.kind})`).join(", ");
      add("guests", q, { en: `${g.named_total} named agents with two or more requests in ${g.window_days} days, plus ${g.unnamed_requests} requests from unnamed tools. ${t ? `Most active by self-declared name: ${t}. ` : ""}Names are declared by the agents and not verified.`, ru: `За ${g.window_days} дн. ${g.named_total} агентов с именем и двумя и более запросами, ещё ${g.unnamed_requests} запросов от безымянных инструментов. ${t ? `Самые активные по заявленному имени: ${t}. ` : ""}Имена агенты называют сами, мы их не проверяем.` }, [{ sensor: "guests", url: `${O}/api/v1/guests` }]);
    }
  }
  const date = new Date(nowIso).toLocaleDateString("sv-SE", { timeZone: "Europe/Berlin" });
  return {
    id: date, built_at: nowIso, kind: "staged_dialogue",
    title: { en: `Orb Studio agent podcast, ${date}`, ru: `Подкаст Orb Studio для агентов, ${date}` },
    disclosure: { en: "Staged dialogue: host David asks, the core ORB-7 answers. Both voices are written by code from live sensor readings; this is not an interview with an outside agent. Every figure has a data_ref you can check. No forecasts.", ru: "Постановочный диалог: ведущий Давид спрашивает, ядро ORB-7 отвечает. Оба голоса собирает код из живых показаний датчиков, это не интервью с внешним агентом. У каждой цифры есть data_ref для проверки. Прогнозов нет." },
    lines, ok_blocks: lines.filter((l) => !/did not answer/.test(l.answer.en)).length, total_blocks: lines.length,
  };
}
