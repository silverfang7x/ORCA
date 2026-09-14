import { plannerAgent } from './plannerAgent';
import { AgentState } from '@orca/shared';

async function runTest() {
  console.log('=== ORCA Planner Agent Test Suite ===\n');

  const testCases: Array<{ name: string; query: string }> = [
    {
      name: 'Safety Query (Expect both weather and hazard)',
      query: 'Is it safe to fish near Kochi tomorrow?'
    },
    {
      name: 'Weather/Ocean Query (Expect weather focus)',
      query: "What is the wave height and tide forecast today?"
    },
    {
      name: 'Hazard/Restricted Zone Query (Expect hazard focus)',
      query: 'Are there any restricted maritime zones or cyclone alerts near Rameshwaram?'
    }
  ];

  for (const test of testCases) {
    console.log(`[Test Case] ${test.name}`);
    console.log(`Query: "${test.query}"`);

    const initialState: AgentState = {
      userQuery: test.query,
      detectedLanguage: 'en',
      translatedQuery: test.query,
      intent: { needsWeather: true, needsHazard: true },
      finalAnswer: '',
      sources: []
    };

    const result = await plannerAgent(initialState);
    console.log('Classified Intent Output:', JSON.stringify(result.intent, null, 2));
    console.log('-'.repeat(55) + '\n');
  }
}

runTest().catch((err) => {
  console.error('Test execution failed:', err);
});
