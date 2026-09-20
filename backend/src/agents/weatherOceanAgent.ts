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

const FALLBACK_WEATHER_DATA: WeatherOceanData = {
  waveHeightMeters: 1.0,
  seaSurfaceTempCelsius: 28,
  windSpeedKmh: 15,
  tideTimes: [],
  source: 'Open-Meteo Marine API (fallback values)',
};

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

/**
 * Helper to return YYYY-MM-DD string shifted by days.
 */
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

/**
 * Finds the index in an Open-Meteo hourly.time array closest to midday (12:00) of the target date.
 */
function getMiddayIndexForDate(timeArray?: string[], targetDateStr?: string): number {
  if (!timeArray || timeArray.length === 0) return 0;

  if (targetDateStr) {
    const targetMiddayStr = `${targetDateStr}T12:00`;
    const exactIndex = timeArray.findIndex((t) => t.includes(targetMiddayStr));
    if (exactIndex !== -1) {
      return exactIndex;
    }
  }

  // Fallback: search any 12:00
  const fallbackIndex = timeArray.findIndex((t) => t.includes('12:00'));
  if (fallbackIndex !== -1) {
    return fallbackIndex;
  }

  return Math.min(12, timeArray.length - 1);
}

/**
 * Derives local high and low tide events from hourly sea_level_height_msl data.
 * Uses local peak/trough detection across consecutive hourly samples.
 */
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

    // Detect High Tide (local peak)
    if (curr > prev && curr >= next) {
      const eventDateStr = isoTimeStr.split('T')[0];
      const timePart = isoTimeStr.split('T')[1]?.substring(0, 5) || '00:00';

      tideEvents.push({
        time: timePart,
        type: 'high',
        dateStr: eventDateStr,
      });
    }
    // Detect Low Tide (local trough)
    else if (curr < prev && curr <= next) {
      const eventDateStr = isoTimeStr.split('T')[0];
      const timePart = isoTimeStr.split('T')[1]?.substring(0, 5) || '00:00';

      tideEvents.push({
        time: timePart,
        type: 'low',
        dateStr: eventDateStr,
      });
    }
  }

  // Filter events strictly to the target requested date
  return tideEvents
    .filter((event) => event.dateStr === targetDateStr)
    .map(({ time, type }) => ({ time, type }));
}

/**
 * Fetches real weather and ocean data from Open-Meteo Marine & Forecast APIs with 10s AbortController timeouts and fallbacks.
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

    console.error(`[weatherOceanAgent FETCH] Requesting Marine URL: ${marineUrl}`);
    console.error(`[weatherOceanAgent FETCH] Requesting Forecast URL: ${forecastUrl}`);

    const tWeatherStart = Date.now();
    const [marineResResult, forecastResResult] = await Promise.allSettled([
      fetchWithTimeout(marineUrl, 5000),
      fetchWithTimeout(forecastUrl, 5000),
    ]);
    console.error(`[PERF TIMING] Weather Agent Open-Meteo API Calls: ${Date.now() - tWeatherStart}ms`);

    let marineData: OpenMeteoMarineResponse | null = null;
    let forecastData: OpenMeteoForecastResponse | null = null;

    let marineErr: Error | null = null;
    let forecastErr: Error | null = null;

    if (marineResResult.status === 'fulfilled' && marineResResult.value.ok) {
      marineData = (await marineResResult.value.json()) as OpenMeteoMarineResponse;
      console.error(`[weatherOceanAgent SUCCESS] Marine API returned ${marineData?.hourly?.time?.length || 0} hourly samples`);
    } else {
      if (marineResResult.status === 'rejected') {
        marineErr = marineResResult.reason instanceof Error ? marineResResult.reason : new Error(String(marineResResult.reason));
        console.error('[weatherOceanAgent ERROR] Marine API fetch rejected/timed out:', marineResResult.reason?.message || marineResResult.reason);
      } else {
        const bodyText = await marineResResult.value.text().catch(() => 'Unable to read body');
        marineErr = new Error(`Marine API HTTP ${marineResResult.value.status} ${marineResResult.value.statusText}: ${bodyText}`);
        console.error(`[weatherOceanAgent ERROR] Marine API returned HTTP ${marineResResult.value.status} ${marineResResult.value.statusText}: ${bodyText}`);
      }
    }

    if (forecastResResult.status === 'fulfilled' && forecastResResult.value.ok) {
      forecastData = (await forecastResResult.value.json()) as OpenMeteoForecastResponse;
      console.error(`[weatherOceanAgent SUCCESS] Forecast API returned ${forecastData?.hourly?.time?.length || 0} hourly samples`);
    } else {
      if (forecastResResult.status === 'rejected') {
        forecastErr = forecastResResult.reason instanceof Error ? forecastResResult.reason : new Error(String(forecastResResult.reason));
        console.error('[weatherOceanAgent ERROR] Forecast API fetch rejected/timed out:', forecastResResult.reason?.message || forecastResResult.reason);
      } else {
        const bodyText = await forecastResResult.value.text().catch(() => 'Unable to read body');
        forecastErr = new Error(`Forecast API HTTP ${forecastResResult.value.status} ${forecastResResult.value.statusText}: ${bodyText}`);
        console.error(`[weatherOceanAgent ERROR] Forecast API returned HTTP ${forecastResResult.value.status} ${forecastResResult.value.statusText}: ${bodyText}`);
      }
    }

    // If both API calls failed completely to return hourly data, fallback immediately
    if (!marineData?.hourly && !forecastData?.hourly) {
      const err = marineErr || forecastErr || new Error(`Both Marine API and Forecast API failed to return data`);
      console.error("OPEN-METEO FETCH FAILED:", err);
      return FALLBACK_WEATHER_DATA;
    }

    const marineTimeArray = marineData?.hourly?.time;
    const marineMiddayIdx = getMiddayIndexForDate(marineTimeArray, targetDateStr);

    const waveHeightRaw = marineData?.hourly?.wave_height?.[marineMiddayIdx];
    const sstRaw = marineData?.hourly?.sea_surface_temperature?.[marineMiddayIdx];

    const forecastTimeArray = forecastData?.hourly?.time;
    const forecastMiddayIdx = getMiddayIndexForDate(forecastTimeArray, targetDateStr);
    const windSpeedRaw = forecastData?.hourly?.wind_speed_10m?.[forecastMiddayIdx];

    // Safely extract rounded values or fallback to default estimates
    const waveHeightMeters = typeof waveHeightRaw === 'number' ? Number(waveHeightRaw.toFixed(1)) : 1.0;
    const seaSurfaceTempCelsius = typeof sstRaw === 'number' ? Number(sstRaw.toFixed(1)) : 28;
    const windSpeedKmh = typeof windSpeedRaw === 'number' ? Number(windSpeedRaw.toFixed(1)) : 15;

    // Derive high and low tide peak events from sea_level_height_msl hourly data
    const tideTimes = detectTideEvents(
      marineData?.hourly?.time,
      marineData?.hourly?.sea_level_height_msl,
      targetDateStr
    );

    const isPartialFallback = !marineData?.hourly || !forecastData?.hourly;
    if (isPartialFallback) {
      const err = marineErr || forecastErr || new Error(`Partial Open-Meteo failure: marineData.hourly=${!!marineData?.hourly}, forecastData.hourly=${!!forecastData?.hourly}`);
      console.error("OPEN-METEO FETCH FAILED:", err);
    }

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
  } catch (error: any) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error("OPEN-METEO FETCH FAILED:", err);
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
    const queryLocation: LocationQuery = state.location || {
      latitude: 9.9312,
      longitude: 76.2673,
      date: new Date().toISOString(),
    };
    const weatherData = await getWeatherOceanData(queryLocation);
    return { weatherData };
  } else {
    return await getWeatherOceanData(input as LocationQuery);
  }
}
