import { runOrcaGraph } from './graph';

async function testGraphExecution() {
  console.log('=== ORCA LangGraph End-to-End Workflow Test ===\n');

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString();
  const query = 'Is it safe to fish near Kochi tomorrow?';
  const location = {
    latitude: 9.9312,
    longitude: 76.2673,
    date: tomorrowStr
  };

  console.log(`Executing runOrcaGraph with query: "${query}"`);
  console.log('Location:', location);
  console.log('\nRunning multi-agent pipeline...\n');

  const finalState = await runOrcaGraph(query, location);

  console.log('=' .repeat(60));
  console.log('Agent Intent Classified:', JSON.stringify(finalState.intent, null, 2));
  console.log('\nWeather Data Received:', JSON.stringify(finalState.weatherData, null, 2));
  console.log('\nHazard Data Received:', JSON.stringify(finalState.hazardData, null, 2));
  console.log('\nCited Sources:', JSON.stringify(finalState.sources, null, 2));
  console.log('\nFinal Natural Language Answer:\n', finalState.finalAnswer);
  console.log('=' .repeat(60));
}

testGraphExecution().catch((err) => {
  console.error('Graph end-to-end test failed:', err);
});
