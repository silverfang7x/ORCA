import { LocationQuery, WeatherOceanData, AgentState } from '@orca/shared';

// TypeScript interfaces for Open-Meteo API JSON responses
interface OpenMeteoMarineResponse {
  latitude: number;
  longitude: number;
  hourly?: {
    time?: string[];
    wave_height?: (number | null)[];
    sea_surface_temperature?: (number | null)[];
    sea_level_height_msl?: (number | null)[];
  };
}

interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  hourly?: {
    time?: string[];
    wind_speed_10m?: (number | null)[];
  };
}

export interface ResolvedLocationQuery extends LocationQuery {
  locationName?: string;
}

const FALLBACK_WEATHER_DATA: WeatherOceanData = {
  waveHeightMeters: 1.0,
  seaSurfaceTempCelsius: 28,
  windSpeedKmh: 15,
  tideTimes: [],
  locationName: 'Coastal Sector',
  source: 'Open-Meteo Marine API (fallback values)',
};

/**
 * Extracts coastal location coordinates and target date from query text.
 */
export function extractLocationAndDateFromQuery(
  queryText: string,
  baseLocation?: LocationQuery
): ResolvedLocationQuery {
  const q = (queryText || '').toLowerCase();

  const LOCATIONS: { names: string[]; lat: number; lng: number; label: string }[] = [
    { names: ['kochi', 'cochin', 'eranakulam', 'ernakulam'], lat: 9.9312, lng: 76.2673, label: 'Kochi' },
    { names: ['munambam'], lat: 10.1812, lng: 76.1685, label: 'Munambam' },
    { names: ['vizhinjam', 'trivandrum', 'thiruvananthapuram'], lat: 8.3800, lng: 76.9900, label: 'Vizhinjam' },
    { names: ['chennai', 'madras'], lat: 13.0827, lng: 80.2707, label: 'Chennai' },
    { names: ['mumbai', 'bombay'], lat: 18.9220, lng: 72.8347, label: 'Mumbai' },
    { names: ['goa', 'panaji', 'panjim', 'vasco'], lat: 15.4989, lng: 73.8278, label: 'Goa' },
    { names: ['mangalore', 'mangaluru'], lat: 12.9141, lng: 74.8560, label: 'Mangalore' },
    { names: ['kozhikode', 'calicut', 'beypore'], lat: 11.2588, lng: 75.7804, label: 'Kozhikode' },
    { names: ['kollam', 'quilon'], lat: 8.8932, lng: 76.6141, label: 'Kollam' },
    { names: ['kanyakumari', 'cape comorin'], lat: 8.0883, lng: 77.5385, label: 'Kanyakumari' },
    { names: ['puducherry', 'pondicherry', 'pondy'], lat: 11.9416, lng: 79.8083, label: 'Puducherry' },
    { names: ['visakhapatnam', 'vizag'], lat: 17.6868, lng: 83.2185, label: 'Visakhapatnam' },
    { names: ['paradeep', 'paradip'], lat: 20.3164, lng: 86.6114, label: 'Paradeep' },
    { names: ['veraval', 'porbandar', 'gujarat'], lat: 20.9000, lng: 70.3667, label: 'Veraval' },
    { names: ['alappuzha', 'alleppey'], lat: 9.4981, lng: 76.3388, label: 'Alappuzha' }
  ];

  let matchedLat = baseLocation?.latitude ?? 9.9312;
  let matchedLng = baseLocation?.longitude ?? 76.2673;
  let locationName: string | undefined = undefined;

  for (const loc of LOCATIONS) {
    if (loc.names.some(n => q.includes(n))) {
      matchedLat = loc.lat;
      matchedLng = loc.lng;
      locationName = loc.label;
      break;
    }
  }

  let baseDate = new Date();
  if (baseLocation?.date) {
    const p = new Date(baseLocation.date);
    if (!isNaN(p.getTime())) baseDate = p;
  }

  if (q.includes('tomorrow')) {
    baseDate.setDate(baseDate.getDate() + 1);
  } else if (q.includes('day after tomorrow')) {
    baseDate.setDate(baseDate.getDate() + 2);
  }

  return {
    latitude: matchedLat,
    longitude: matchedLng,
    date: baseDate.toISOString(),
    locationName: locationName || 'Kochi Coast'
  };
}

/**
 * Executes a fetch request with a configurable AbortController timeout.
 */
async function fetchWithTimeout(url: string, timeoutMs = 5000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

function getDateStringWithOffset(dateInput?: string, dayOffset = 0): string {
  let baseDate = new Date();
  if (dateInput) {
    const parsed = new Date(dateInput);
    if (!isNaN(parsed.getTime())) {
      baseDate = parsed;
    }
  }

  const targetDate = new Date(baseDate);
  targetDate.setUTCDate(targetDate.getUTCDate() + dayOffset);
  return targetDate.toISOString().split('T')[0];
}

function getMiddayIndexForDate(timeArray?: string[], targetDateStr?: string): number {
  if (!timeArray || timeArray.length === 0) return 0;

  if (targetDateStr) {
    const targetMiddayStr = `${targetDateStr}T12:00`;
    const exactIndex = timeArray.findIndex((t) => t.includes(targetMiddayStr));
    if (exactIndex !== -1) {
      return exactIndex;
    }
  }

  const fallbackIndex = timeArray.findIndex((t) => t.includes('12:00'));
  if (fallbackIndex !== -1) {
    return fallbackIndex;
  }

  return Math.min(12, timeArray.length - 1);
}

function detectTideEvents(
  times?: string[],
  seaLevelValues?: (number | null)[],
  targetDateStr?: string
): { time: string; type: 'high' | 'low' }[] {
  if (!times || !seaLevelValues || times.length < 3 || seaLevelValues.length < 3 || !targetDateStr) {
    return [];
  }

  const tideEvents: { time: string; type: 'high' | 'low'; dateStr: string }[] = [];

  for (let i = 1; i < seaLevelValues.length - 1; i++) {
    const prev = seaLevelValues[i - 1];
    const curr = seaLevelValues[i];
    const next = seaLevelValues[i + 1];

    if (typeof prev !== 'number' || typeof curr !== 'number' || typeof next !== 'number') {
      continue;
    }

    const isoTimeStr = times[i];
    if (!isoTimeStr) continue;

    if (curr > prev && curr >= next) {
      const eventDateStr = isoTimeStr.split('T')[0];
      const timePart = isoTimeStr.split('T')[1]?.substring(0, 5) || '00:00';

      tideEvents.push({
        time: timePart,
        type: 'high',
        dateStr: eventDateStr,
      });
    } else if (curr < prev && curr <= next) {
      const eventDateStr = isoTimeStr.split('T')[0];
      const timePart = isoTimeStr.split('T')[1]?.substring(0, 5) || '00:00';

      tideEvents.push({
        time: timePart,
        type: 'low',
        dateStr: eventDateStr,
      });
    }
  }

  return tideEvents
    .filter((event) => event.dateStr === targetDateStr)
    .map(({ time, type }) => ({ time, type }));
}

/**
 * Fetches real weather and ocean data from Open-Meteo Marine & Forecast APIs.
 */
export async function getWeatherOceanData(query: LocationQuery): Promise<WeatherOceanData> {
  if (!query || typeof query.latitude !== 'number' || typeof query.longitude !== 'number') {
    return FALLBACK_WEATHER_DATA;
  }

  const targetDateStr = getDateStringWithOffset(query.date, 0);
  const startDateStr = getDateStringWithOffset(query.date, -1);
  const endDateStr = getDateStringWithOffset(query.date, 1);

  try {
    const marineUrl = `https://marine-api.open-meteo.com/v1/marine?latitude=${query.latitude}&longitude=${query.longitude}&hourly=wave_height,sea_surface_temperature,sea_level_height_msl&start_date=${startDateStr}&end_date=${endDateStr}`;
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${query.latitude}&longitude=${query.longitude}&hourly=wind_speed_10m&wind_speed_unit=kmh&start_date=${targetDateStr}&end_date=${targetDateStr}`;

    const tWeatherStart = Date.now();
    const [marineResResult, forecastResResult] = await Promise.allSettled([
      fetchWithTimeout(marineUrl, 5000),
      fetchWithTimeout(forecastUrl, 5000),
    ]);
    console.log(`[PERF TIMING] Weather Agent Open-Meteo API Calls: ${Date.now() - tWeatherStart}ms`);

    let marineData: OpenMeteoMarineResponse | null = null;
    let forecastData: OpenMeteoForecastResponse | null = null;

    if (marineResResult.status === 'fulfilled' && marineResResult.value.ok) {
      marineData = (await marineResResult.value.json()) as OpenMeteoMarineResponse;
    }

    if (forecastResResult.status === 'fulfilled' && forecastResResult.value.ok) {
      forecastData = (await forecastResResult.value.json()) as OpenMeteoForecastResponse;
    }

    if (!marineData?.hourly && !forecastData?.hourly) {
      return FALLBACK_WEATHER_DATA;
    }

    const marineTimeArray = marineData?.hourly?.time;
    const marineMiddayIdx = getMiddayIndexForDate(marineTimeArray, targetDateStr);

    const waveHeightRaw = marineData?.hourly?.wave_height?.[marineMiddayIdx];
    const sstRaw = marineData?.hourly?.sea_surface_temperature?.[marineMiddayIdx];

    const forecastTimeArray = forecastData?.hourly?.time;
    const forecastMiddayIdx = getMiddayIndexForDate(forecastTimeArray, targetDateStr);
    const windSpeedRaw = forecastData?.hourly?.wind_speed_10m?.[forecastMiddayIdx];

    const waveHeightMeters = typeof waveHeightRaw === 'number' ? Number(waveHeightRaw.toFixed(1)) : 1.0;
    const seaSurfaceTempCelsius = typeof sstRaw === 'number' ? Number(sstRaw.toFixed(1)) : 28;
    const windSpeedKmh = typeof windSpeedRaw === 'number' ? Number(windSpeedRaw.toFixed(1)) : 15;

    const tideTimes = detectTideEvents(
      marineData?.hourly?.time,
      marineData?.hourly?.sea_level_height_msl,
      targetDateStr
    );

    const isPartialFallback = !marineData?.hourly || !forecastData?.hourly;
    const source = isPartialFallback
      ? 'Open-Meteo Marine API (fallback values)'
      : 'Open-Meteo Marine API';

    return {
      waveHeightMeters,
      seaSurfaceTempCelsius,
      windSpeedKmh,
      tideTimes,
      source,
    };
  } catch (error) {
    console.error('[weatherOceanAgent] Exception during execution, returning safe fallback:', error);
    return FALLBACK_WEATHER_DATA;
  }
}

/**
 * Primary export matching LangGraph node and location query callers.
 */
export async function weatherOceanAgent(
  input: AgentState | LocationQuery
): Promise<WeatherOceanData | Partial<AgentState>> {
  if (input && typeof (input as any).userQuery !== 'undefined') {
    const state = input as AgentState;
    const queryText = state.translatedQuery || state.userQuery || '';
    const queryLocation = extractLocationAndDateFromQuery(queryText, state.location);
    const weatherData = await getWeatherOceanData(queryLocation);
    weatherData.locationName = queryLocation.locationName;
    return { weatherData };
  } else {
    const queryLocation = input as LocationQuery;
    const weatherData = await getWeatherOceanData(queryLocation);
    return weatherData;
  }
}
