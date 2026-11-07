// Авиамост: открытые ADS-B данные OpenSky Network (без ключа). Только чтение, никаких выдуманных коэффициентов.
// Данные: самолёты, которые видят приёмники сообщества OpenSky. Это не «все самолёты мира»: покрытие неравномерно
// (плотное в Европе и США, слабое над океанами и частью Азии), поэтому числа — «замечено в эфире», а не перепись неба.

export const OPENSKY = "https://opensky-network.org/api/states/all";
export const HAMBURG = { lat: 53.6304, lon: 9.9882 };        // аэропорт HAM
export const EDHI = { lat: 53.5353, lon: 9.8353, name: "Hamburg-Finkenwerder (EDHI, Airbus)" };
export const REGIONS = {                                       // грубые рамки, чтобы сводка была воспроизводимой
  Europe: { lat: [35, 72], lon: [-12, 34] },
  MiddleEast: { lat: [12, 42], lon: [34, 63] },
  Asia: { lat: [-10, 60], lon: [63, 150] },
  NorthAmerica: { lat: [15, 72], lon: [-170, -50] },
};

export function km(la1, lo1, la2, lo2) {
  const r = Math.PI / 180, dLa = (la2 - la1) * r, dLo = (lo2 - lo1) * r;
  const a = Math.sin(dLa / 2) ** 2 + Math.cos(la1 * r) * Math.cos(la2 * r) * Math.sin(dLo / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(a));
}

export function parseStates(j) {
  const out = [];
  for (const s of (j && j.states) || []) {
    if (!Array.isArray(s) || s[5] == null || s[6] == null) continue;
    out.push({ icao24: String(s[0] || ""), callsign: String(s[1] || "").trim(), lon: +s[5], lat: +s[6],
      alt: s[7] == null ? (s[13] == null ? null : +s[13]) : +s[7], ground: !!s[8], vr: s[11] == null ? null : +s[11] });
  }
  return out;
}

export function regionOf(lat, lon) {
  for (const [name, b] of Object.entries(REGIONS)) if (lat >= b.lat[0] && lat <= b.lat[1] && lon >= b.lon[0] && lon < b.lon[1]) return name;
  return "Other";
}

export function summarize(states, radiusKm = 100) {
  const regional = { Europe: 0, MiddleEast: 0, Asia: 0, NorthAmerica: 0, Other: 0 };
  let airborne = 0, onGround = 0, hamAir = 0, hamGround = 0;
  for (const s of states) {
    const near = km(s.lat, s.lon, HAMBURG.lat, HAMBURG.lon) <= radiusKm;
    if (s.ground) { onGround++; if (near) hamGround++; continue; }
    airborne++; regional[regionOf(s.lat, s.lon)]++;
    if (near) hamAir++;
  }
  return { airborne_seen: airborne, on_ground_seen: onGround, regional_airborne: regional,
    hamburg_sector: { radius_km: radiusKm, center: "HAM 53.6304N 9.9882E", airborne: hamAir, on_ground: hamGround } };
}

export async function fetchOpenSky(bbox, timeoutMs = 9000) {
  const q = bbox ? `?lamin=${bbox.lamin}&lomin=${bbox.lomin}&lamax=${bbox.lamax}&lomax=${bbox.lomax}` : "";
  const r = await fetch(OPENSKY + q, { signal: AbortSignal.timeout(timeoutMs), headers: { "User-Agent": "OrbStudio/1.0 (+https://orbstudio.org/llms.txt)", Accept: "application/json" } });
  if (!r.ok) { const e = new Error("opensky http " + r.status); e.status = r.status; throw e; }
  return parseStates(await r.json());
}

// ---- Посадки в Финкенвердере ----
// Опрос раз в 6 минут. Посадка = самолёт был замечен низко и со снижением в 18 км от аэродрома, а затем
// на земле у аэродрома (признак ADS-B on_ground) или пропал с сигнала у самой полосы (тогда evidence = signal_lost_at_field).
// Самолёт, который сразу появился на земле, посадкой не считается (мог выкатиться из ангара).
export const EDHI_BBOX = { lamin: 53.37, lamax: 53.70, lomin: 9.55, lomax: 10.12 };
const APPROACH_KM = 18, FIELD_KM = 3, WINDOW_MS = 25 * 60e3;

export function detectLandings(prev, states, now) {
  const st = { approach: { ...((prev && prev.approach) || {}) }, ground: [] };
  const was = new Set((prev && prev.ground) || []), present = new Map(states.map((s) => [s.icao24, s]));
  const landings = [];
  for (const s of states) {
    const d = km(s.lat, s.lon, EDHI.lat, EDHI.lon);
    if (s.ground) {
      if (d < FIELD_KM) {
        st.ground.push(s.icao24);
        const a = st.approach[s.icao24];
        if (a && now - a.t <= WINDOW_MS && !was.has(s.icao24)) landings.push({ t: now, icao24: s.icao24, callsign: s.callsign || a.callsign || null, evidence: "on_ground" });
        delete st.approach[s.icao24];
      }
    } else if (d < APPROACH_KM && s.alt != null && s.alt < 1800 && ((s.vr != null && s.vr < -0.5) || s.alt < 300)) {
      st.approach[s.icao24] = { t: now, d: Math.round(d * 10) / 10, alt: Math.round(s.alt), callsign: s.callsign };
    }
  }
  for (const [id, a] of Object.entries(st.approach)) {
    if (now - a.t > WINDOW_MS) { delete st.approach[id]; continue; }
    // пропал с эфира сразу у полосы на малой высоте — вероятная посадка с выключенным транспондером
    if (a.t < now && !present.has(id) && a.alt < 250 && a.d < 3.5) {
      landings.push({ t: now, icao24: id, callsign: a.callsign || null, evidence: "signal_lost_at_field" });
      delete st.approach[id];
    }
  }
  return { state: st, landings };
}
