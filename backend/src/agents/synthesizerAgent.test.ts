import { synthesizerAgent } from './synthesizerAgent';
import { AgentState, WeatherOceanData, HazardGeofenceData } from '@orca/shared';

async function runTest() {
  console.log('=== ORCA Synthesizer Agent Test Suite ===\n');

  // Mock data matching shared types
  const mockWeatherData: WeatherOceanData = {
    waveHeightMeters: 1.8,
    seaSurfaceTempCelsius: 28.5,
    windSpeedKmh: 24.0,
    tideTimes: [
      { time: '06:15 AM', type: 'high' },
      { time: '12:45 PM', type: 'low' }
    ],
    source: 'Open-Meteo Marine API'
  };

  const mockHazardData: HazardGeofenceData = {
    hazardAlerts: [
      {
        type: 'Rough Sea Warning',
        severity: 'Medium',
        description: 'Squally weather with wind speed reaching 40-50 kmph expected off Kerala coast.'
      }
    ],
    isInRestrictedZone: false,
    nearestBoundaryName: 'International Maritime Boundary Line (IMBL)',
    source: 'Turf.js Geofence System'
  };

  // Test Case 1: Full Data (Weather + Hazard)
  console.log('[Test Case 1] Full Data (Weather & Hazard populated)');
  const stateWithData: AgentState = {
    userQuery: 'Is it safe to fish near Kochi tomorrow?',
    detectedLanguage: 'en',
    translatedQuery: 'Is it safe to fish near Kochi tomorrow?',
    intent: { needsWeather: true, needsHazard: true },
    weatherData: mockWeatherData,
    hazardData: mockHazardData,
    finalAnswer: '',
    sources: []
  };

  const result1 = await synthesizerAgent(stateWithData);
  console.log('Generated Final Answer:\n', result1.finalAnswer);
  console.log('\nCited Sources:', result1.sources);
  console.log('-'.repeat(60) + '\n');

  // Test Case 2: Edge Case - Both weatherData and hazardData are undefined
  console.log('[Test Case 2] Edge Case (Both weatherData and hazardData undefined)');
  const emptyState: AgentState = {
    userQuery: 'Is it safe to fish near Kochi tomorrow?',
    detectedLanguage: 'en',
    translatedQuery: 'Is it safe to fish near Kochi tomorrow?',
    intent: { needsWeather: true, needsHazard: true },
    weatherData: undefined,
    hazardData: undefined,
    finalAnswer: '',
    sources: []
  };

  const result2 = await synthesizerAgent(emptyState);
  console.log('Generated Final Answer:\n', result2.finalAnswer);
  console.log('\nCited Sources:', result2.sources);
  console.log('=' .repeat(60));
}

runTest().catch((err) => {
  console.error('Test execution failed:', err);
});
