import { getHazardGeofenceData } from './hazardGeofenceAgent';
import { LocationQuery } from '../types';

async function runTestSuite() {
  console.log('=====================================================');
  console.log('  ORCA Hazard & Geofencing Agent Integration Tests   ');
  console.log('=====================================================\n');

  // Test 1: Inside restricted zone polygon (IMBL Buffer near Rameswaram: 9.35°N, 79.50°E)
  const restrictedZoneQuery: LocationQuery = {
    latitude: 9.35,
    longitude: 79.50,
    date: new Date().toISOString(),
  };

  console.log('[Test 1] Point inside restricted zone (Rameswaram IMBL Buffer)...');
  console.log(`Input Coordinates: Lat ${restrictedZoneQuery.latitude}°N, Lng ${restrictedZoneQuery.longitude}°E`);
  const result1 = await getHazardGeofenceData(restrictedZoneQuery);
  console.log('Output Result:', JSON.stringify(result1, null, 2));

  if (
    result1.isInRestrictedZone === true &&
    result1.nearestBoundaryName === 'India-Sri Lanka International Maritime Boundary Buffer'
  ) {
    console.log('✅ TEST 1 PASSED: Correctly identified restricted zone and boundary name.\n');
  } else {
    console.error('❌ TEST 1 FAILED: Expected isInRestrictedZone=true and boundary name match.\n');
  }

  console.log('-'.repeat(60) + '\n');

  // Test 2: Mid-Pacific coordinates (0.0°N, -160.0°E) - far from any hazard or boundary
  const midPacificQuery: LocationQuery = {
    latitude: 0.0,
    longitude: -160.0,
    date: new Date().toISOString(),
  };

  console.log('[Test 2] Point far from any hazard or zone (Mid-Pacific: 0.0°N, -160.0°E)...');
  const result2 = await getHazardGeofenceData(midPacificQuery);
  console.log('Output Result:', JSON.stringify(result2, null, 2));

  if (
    result2.isInRestrictedZone === false &&
    result2.nearestBoundaryName === null &&
    result2.hazardAlerts.length === 0
  ) {
    console.log('✅ TEST 2 PASSED: Safe ocean location returned empty alerts, false geofence, no crash.\n');
  } else {
    console.error('❌ TEST 2 FAILED: Unexpected non-empty result for mid-Pacific location.\n');
  }

  console.log('-'.repeat(60) + '\n');

  // Test 3: Near mock hazard entry (Kochi coast: 9.93°N, 76.26°E)
  const hazardQuery: LocationQuery = {
    latitude: 9.93,
    longitude: 76.26,
    date: new Date().toISOString(),
  };

  console.log('[Test 3] Point near mock hazard entry (Kochi Coast: 9.93°N, 76.26°E)...');
  const result3 = await getHazardGeofenceData(hazardQuery);
  console.log('Output Result:', JSON.stringify(result3, null, 2));

  if (result3.hazardAlerts.length > 0 && result3.hazardAlerts.some((a) => a.type === 'High Wave Alert')) {
    console.log('✅ TEST 3 PASSED: Successfully matched active High Wave Alert for Kochi coast.\n');
  } else {
    console.error('❌ TEST 3 FAILED: Hazard alert not detected for Kochi location.\n');
  }

  console.log('=====================================================');
  console.log('            ALL TEST VERIFICATIONS COMPLETE          ');
  console.log('=====================================================');
}

runTestSuite().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
