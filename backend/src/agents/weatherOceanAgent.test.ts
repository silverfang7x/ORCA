import { getWeatherOceanData } from './weatherOceanAgent';
import { LocationQuery } from '@orca/shared';

/**
 * Returns tomorrow's date formatted as ISO string.
 */
function getTomorrowISOString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString();
}

async function runWeatherOceanAgentTests() {
  console.log('=====================================================');
  console.log('  ORCA Weather & Ocean Agent Integration Test Suite  ');
  console.log('=====================================================\n');

  const tomorrowISO = getTomorrowISOString();

  // Test Case 1: Kochi (Latitude 9.93, Longitude 76.26, Tomorrow's date)
  const kochiQuery: LocationQuery = {
    latitude: 9.93,
    longitude: 76.26,
    date: tomorrowISO,
  };

  console.log('[Test 1] Kochi Location Query (9.93°N, 76.26°E, Tomorrow)...');
  const result1 = await getWeatherOceanData(kochiQuery);
  console.log('Result Output:', JSON.stringify(result1, null, 2));

  if (
    typeof result1.waveHeightMeters === 'number' &&
    typeof result1.seaSurfaceTempCelsius === 'number' &&
    typeof result1.windSpeedKmh === 'number' &&
    Array.isArray(result1.tideTimes) &&
    typeof result1.source === 'string'
  ) {
    console.log('✅ TEST 1 PASSED: Valid WeatherOceanData shape returned for Kochi.\n');
  } else {
    console.error('❌ TEST 1 FAILED: Invalid shape returned for Kochi.\n');
  }

  console.log('-'.repeat(60) + '\n');

  // Test Case 2: Chennai (Latitude 13.08, Longitude 80.27, Tomorrow's date)
  const chennaiQuery: LocationQuery = {
    latitude: 13.08,
    longitude: 80.27,
    date: tomorrowISO,
  };

  console.log('[Test 2] Chennai Location Query (13.08°N, 80.27°E, Tomorrow)...');
  const result2 = await getWeatherOceanData(chennaiQuery);
  console.log('Result Output:', JSON.stringify(result2, null, 2));

  if (
    typeof result2.waveHeightMeters === 'number' &&
    typeof result2.seaSurfaceTempCelsius === 'number' &&
    typeof result2.windSpeedKmh === 'number' &&
    Array.isArray(result2.tideTimes) &&
    typeof result2.source === 'string'
  ) {
    console.log('✅ TEST 2 PASSED: Valid WeatherOceanData shape returned for Chennai.\n');
  } else {
    console.error('❌ TEST 2 FAILED: Invalid shape returned for Chennai.\n');
  }

  console.log('-'.repeat(60) + '\n');

  // Test Case 3: Invalid location (Latitude 999, Longitude 999) - Confirm Fallback Path
  const invalidQuery: LocationQuery = {
    latitude: 999,
    longitude: 999,
    date: tomorrowISO,
  };

  console.log('[Test 3] Invalid Coordinates (999°N, 999°E) - Fallback Path Test...');
  const result3 = await getWeatherOceanData(invalidQuery);
  console.log('Result Output:', JSON.stringify(result3, null, 2));

  if (
    result3.waveHeightMeters === 1.0 &&
    result3.seaSurfaceTempCelsius === 28 &&
    result3.windSpeedKmh === 15 &&
    Array.isArray(result3.tideTimes) &&
    result3.tideTimes.length === 0 &&
    result3.source.includes('fallback')
  ) {
    console.log('✅ TEST 3 PASSED: Fallback path correctly triggered without crashing.\n');
  } else {
    console.error('❌ TEST 3 FAILED: Unexpected fallback response format.\n');
  }

  console.log('=====================================================');
  console.log('          ALL TEST VERIFICATIONS COMPLETED           ');
  console.log('=====================================================');
}

runWeatherOceanAgentTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
