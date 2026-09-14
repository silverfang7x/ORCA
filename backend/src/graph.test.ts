import { runOrcaGraph } from './graph';

async function testGraphExecution() {
  console.log('=== ORCA LangGraph End-to-End Workflow Test ===\n');

  const query = 'Is it safe to fish near Kochi tomorrow?';
  const location = {
    latitude: 9.9312,
    longitude: 76.2673,
    date: '2026-09-16'
  };

  console.log(`Executing runOrcaGraph with query: "${query}"`);
  console.log('Location:', location);
  console.log('\nRunning multi-agent pipeline...\n');

  const finalState = await runOrcaGraph(query, location);

  console.log('=' .repeat(60));
  console.log('Agent Intent Classified:', finalState.intent);
  console.log('\nWeather Data Received:', finalState.weatherData);
  console.log('\nHazard Data Received:', finalState.hazardData);
  console.log('\nCited Sources:', finalState.sources);
  console.log('\nFinal Natural Language Answer:\n', finalState.finalAnswer);
  console.log('=' .repeat(60));
}

testGraphExecution().catch((err) => {
  console.error('Graph end-to-end test failed:', err);
});
