/**
 * Proposed aviation snapshot rules for a future Orb Studio sensor.
 * Pure functions only: no network, no credentials, no runtime wiring.
 *
 * OpenSky terms require a written agreement before operational or commercial
 * use, including an automated system. This module does not call OpenSky.
 * Quota arithmetic is not permission to fetch.
 */

export const CANONICAL_SITE_URL = "https://orbstudio.org/";
export const X_INTENT_ORIGIN = "https://x.com/intent/post";

export const HAMBURG = Object.freeze({
  lat: 53.6304,
  lon: 9.9882,
  radiusKm: 100,
  name: "Hamburg 100 km",
});

/** A position counts only when time_position is this close to the response time. */
export const MAX_POSITION_AGE_SECONDS = 60;
/** Snapshot age at or under this value is freshness "fresh". */
export const FRESH_SNAPSHOT_SECONDS = 360;
/** Above this age the snapshot is unusable: HTTP 503 and a null count. */
export const MAX_STALE_AGE_SECONDS = 900;
/** Candidate cadence after a license and a quota review. Not an approval to poll. */
export const PROPOSED_CADENCE_SECONDS = 300;

export const ANONYMOUS_CREDITS_PER_DAY = 400;
export const STANDARD_USER_CREDITS_PER_DAY = 4000;
export const ACTIVE_FEEDER_CREDITS_PER_DAY = 8000;
export const LICENSED_USER_CREDITS_PER_HOUR = 14400;
export const STATES_ALL_GLOBAL_CREDITS = 4;
export const BBOX_ONE_CREDIT_MAX_DEG2 = 25;

export const METHODOLOGY_ID = "bbox_then_geodesic_airborne_fresh_v1";

export const CLAIMS_NOT_MADE = Object.freeze([
  "flight_delays",
  "arrivals",
  "departures",
  "airspace_closures",
  "geopolitical_events",
  "all_civil_traffic",
  "global_traffic",
  "notam",
  "anomaly_without_baseline",
]);

const EARTH_KM = 6371.0088;

export function statesAllCreditCost(areaDeg2) {
  if (!Number.isFinite(areaDeg2) || areaDeg2 < 0) return null;
  if (areaDeg2 <= 25) return 1;
  if (areaDeg2 <= 100) return 2;
  if (areaDeg2 <= 400) return 3;
  return 4;
}

export function boundingBox(lat, lon, radiusKm) {
  const latRad = (lat * Math.PI) / 180;
  const kmLat = 111.13295 - 0.55982 * Math.cos(2 * latRad) + 0.00117 * Math.cos(4 * latRad);
  const kmLon = 111.41288 * Math.cos(latRad) - 0.0935 * Math.cos(3 * latRad) + 0.00012 * Math.cos(5 * latRad);
  const pad = 1.002;
  const dLat = (radiusKm * pad) / kmLat;
  const dLon = (radiusKm * pad) / kmLon;
  const k = 10000;
  const floor = (v) => Math.floor(v * k) / k;
  const ceil = (v) => Math.ceil(v * k) / k;
  return {
    lamin: floor(lat - dLat),
    lamax: ceil(lat + dLat),
    lomin: floor(lon - dLon),
    lomax: ceil(lon + dLon),
  };
}

export function boxAreaDeg2(box) {
  return (box.lamax - box.lamin) * (box.lomax - box.lomin);
}

export function haversineKm(lat1, lon1, lat2, lon2) {
  const r = Math.PI / 180;
  const dLat = (lat2 - lat1) * r;
  const dLon = (lon2 - lon1) * r;
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(lat1 * r) * Math.cos(lat2 * r) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function destination(lat, lon, distanceKm, bearingDeg) {
  const delta = distanceKm / EARTH_KM;
  const theta = (bearingDeg * Math.PI) / 180;
  const phi1 = (lat * Math.PI) / 180;
  const lambda1 = (lon * Math.PI) / 180;
  const phi2 = Math.asin(Math.sin(phi1) * Math.cos(delta) + Math.cos(phi1) * Math.sin(delta) * Math.cos(theta));
  const lambda2 = lambda1 + Math.atan2(
    Math.sin(theta) * Math.sin(delta) * Math.cos(phi1),
    Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2),
  );
  return { lat: (phi2 * 180) / Math.PI, lon: (lambda2 * 180) / Math.PI };
}

export function hamburgSector() {
  const box = boundingBox(HAMBURG.lat, HAMBURG.lon, HAMBURG.radiusKm);
  const areaDeg2 = boxAreaDeg2(box);
  return {
    ...HAMBURG,
    box,
    areaDeg2,
    statesAllCredits: statesAllCreditCost(areaDeg2),
    coverage: "receiver_coverage_bias_not_all_civil_or_global",
  };
}

export function sectorLines(sector = hamburgSector()) {
  const b = sector.box;
  return {
    center: `${sector.lat.toFixed(4)}, ${sector.lon.toFixed(4)}`,
    radiusKm: String(sector.radiusKm),
    lamin: b.lamin.toFixed(4),
    lamax: b.lamax.toFixed(4),
    lomin: b.lomin.toFixed(4),
    lomax: b.lomax.toFixed(4),
    areaDeg2: sector.areaDeg2.toFixed(2),
    credits: String(sector.statesAllCredits),
  };
}

function finite(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function parseStateVector(row) {
  if (!Array.isArray(row)) return null;
  return {
    time_position: finite(row[3]),
    longitude: finite(row[5]),
    latitude: finite(row[6]),
    on_ground: typeof row[8] === "boolean" ? row[8] : null,
  };
}

export function coordinateIsFresh(timePosition, sourceTime) {
  if (timePosition == null || sourceTime == null) return false;
  const age = sourceTime - timePosition;
  return age >= 0 && age <= MAX_POSITION_AGE_SECONDS;
}

export function insideSector(lat, lon, sector) {
  if (lat == null || lon == null) return false;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return false;
  const { box } = sector;
  if (lat < box.lamin || lat > box.lamax || lon < box.lomin || lon > box.lomax) return false;
  return haversineKm(sector.lat, sector.lon, lat, lon) <= sector.radiusKm + 1e-6;
}

/**
 * Count airborne rows with a fresh coordinate inside the sector.
 * An incomplete payload yields null, not zero. Identifiers are not returned.
 */
export function countObservedAirborne(response, sector = hamburgSector()) {
  const sourceTime = response && finite(response.time);
  const states = response && Array.isArray(response.states) ? response.states : null;
  if (sourceTime == null || states == null) {
    return { ok: false, reason: "incomplete_response", source_time: sourceTime, observed_airborne_count: null };
  }
  let observed = 0;
  for (const row of states) {
    const sv = parseStateVector(row);
    if (!sv || sv.on_ground !== false) continue;
    if (!coordinateIsFresh(sv.time_position, sourceTime)) continue;
    if (!insideSector(sv.latitude, sv.longitude, sector)) continue;
    observed += 1;
  }
  return { ok: true, reason: null, source_time: sourceTime, observed_airborne_count: observed };
}

export function classifySnapshotAge(ageSeconds) {
  if (ageSeconds == null || !Number.isFinite(ageSeconds) || ageSeconds < 0) return "unusable";
  if (ageSeconds <= FRESH_SNAPSHOT_SECONDS) return "fresh";
  if (ageSeconds <= MAX_STALE_AGE_SECONDS) return "stale";
  return "unusable";
}

function emptyReading(extra) {
  return {
    http_status: 503,
    usable: false,
    upstream_called: false,
    observed_airborne_count: null,
    source_time: null,
    fetched_at: null,
    last_success_at: null,
    data_age_seconds: null,
    freshness: "not_connected",
    stale: null,
    reason: "source_not_connected",
    sector: hamburgSector(),
    methodology: METHODOLOGY_ID,
    source_license_status: "blocked_written_agreement_required",
    claims_not_made: CLAIMS_NOT_MADE,
    music_reads_aviation: false,
    emo_reads_aviation: false,
    ...extra,
  };
}

/**
 * Read-side projector. Callers pass an already stored snapshot.
 * licenseApproved must be a human record of a written agreement, never inferred.
 * When the license is missing, a supplied count is discarded.
 */
export function projectAviation({
  nowMs = Date.now(),
  licenseApproved = false,
  connected = false,
  snapshot = null,
} = {}) {
  if (!licenseApproved || !connected) {
    return emptyReading({
      reason: !licenseApproved ? "license_not_approved" : "source_not_connected",
      freshness: "not_connected",
    });
  }
  const count = snapshot && finite(snapshot.observed_airborne_count);
  const sourceTime = snapshot && finite(snapshot.source_time);
  const fetchedAt = snapshot && typeof snapshot.fetched_at === "string" ? snapshot.fetched_at : null;
  const fetchedMs = fetchedAt ? Date.parse(fetchedAt) : NaN;
  if (count == null || sourceTime == null || !Number.isFinite(fetchedMs)) {
    return emptyReading({
      reason: "no_usable_snapshot",
      freshness: "unusable",
      source_license_status: "written_agreement_recorded",
      last_success_at: snapshot && typeof snapshot.last_success_at === "string" ? snapshot.last_success_at : null,
    });
  }
  const dataAge = Math.round(nowMs / 1000 - sourceTime);
  const freshness = classifySnapshotAge(dataAge);
  const shared = {
    upstream_called: false,
    source_time: sourceTime,
    fetched_at: fetchedAt,
    last_success_at: fetchedAt,
    data_age_seconds: dataAge,
    sector: hamburgSector(),
    methodology: METHODOLOGY_ID,
    source_license_status: "written_agreement_recorded",
    claims_not_made: CLAIMS_NOT_MADE,
    music_reads_aviation: false,
    emo_reads_aviation: false,
  };
  if (freshness === "unusable") {
    return {
      ...shared,
      http_status: 503,
      usable: false,
      observed_airborne_count: null,
      freshness: "unusable",
      stale: true,
      reason: "maximum_stale_age_exceeded",
    };
  }
  return {
    ...shared,
    http_status: 200,
    usable: true,
    observed_airborne_count: count,
    freshness,
    stale: freshness === "stale",
    reason: null,
  };
}

export function quotaArithmetic() {
  const callsPerDay = Math.floor(86400 / PROPOSED_CADENCE_SECONDS);
  return {
    permitted: false,
    proposed_cadence_seconds: PROPOSED_CADENCE_SECONDS,
    theoretical_calls_per_day_at_that_cadence: callsPerDay,
    anonymous_credits_per_day: ANONYMOUS_CREDITS_PER_DAY,
    anonymous_bucket: "ip",
    standard_user_credits_per_day: STANDARD_USER_CREDITS_PER_DAY,
    standard_user_auth: "oauth2_client_credentials",
    active_feeder_credits_per_day: ACTIVE_FEEDER_CREDITS_PER_DAY,
    licensed_user_credits_per_hour: LICENSED_USER_CREDITS_PER_HOUR,
    global_states_all_credits: STATES_ALL_GLOBAL_CREDITS,
    anonymous_global_calls_per_day_max: Math.floor(ANONYMOUS_CREDITS_PER_DAY / STATES_ALL_GLOBAL_CREDITS),
    note: "Credit arithmetic is not a license. Do not poll until a written agreement and a quota review both exist.",
  };
}

export const PREVIEW_SHARE_TEXT = "Превью Orb Studio: авиационный раздел не подключён. Это не наблюдение воздушного движения, не данные OpenSky и не сводка по Гамбургу.";

export const FUTURE_SHARE_TEMPLATE = [
  "Orb Studio, сектор Гамбург 100 км от 53.6304, 9.9882.",
  "Наблюдаемые борты в воздухе с валидной свежей координатой: {observed_airborne_count}.",
  "Время источника: {source_time}. Снято: {fetched_at}. Возраст: {data_age_seconds} с. Статус: {freshness}.",
  "Покрытие приёмников неполное: это не все гражданские борты и не мировая картина.",
  "Лицензия источника: {source_license_status}.",
  "Не задержки рейсов, не вылеты и прилёты, не закрытие неба.",
  CANONICAL_SITE_URL,
].join("\n");

export function xComposeIntent(text, pageUrl = CANONICAL_SITE_URL) {
  const params = new URLSearchParams();
  params.set("text", String(text));
  params.set("url", pageUrl);
  return `${X_INTENT_ORIGIN}?${params.toString()}`;
}

export function previewContract() {
  const reading = projectAviation({ licenseApproved: false, connected: false, snapshot: null });
  const lines = sectorLines(reading.sector);
  return {
    demonstration: true,
    connected: false,
    http_status: reading.http_status,
    freshness: reading.freshness,
    observed_airborne_count: reading.observed_airborne_count,
    source_time: reading.source_time,
    fetched_at: reading.fetched_at,
    last_success_at: reading.last_success_at,
    data_age_seconds: reading.data_age_seconds,
    stale: reading.stale,
    reason: reading.reason,
    methodology: reading.methodology,
    source_license_status: reading.source_license_status,
    upstream_called: reading.upstream_called,
    sector: lines,
    states_all_credit_if_a_call_were_allowed: reading.sector.statesAllCredits,
    quota: quotaArithmetic(),
    share_text: PREVIEW_SHARE_TEXT,
    canonical_url: CANONICAL_SITE_URL,
    x_intent_origin: X_INTENT_ORIGIN,
  };
}
