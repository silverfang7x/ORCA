import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { AgentState, LocationQuery } from '@orca/shared';
import { plannerAgent } from './agents/plannerAgent';
import { weatherOceanAgent } from './agents/weatherOceanAgent';
import { hazardGeofenceAgent } from './agents/hazardGeofenceAgent';
import { synthesizerAgent } from './agents/synthesizerAgent';

export const OrcaStateAnnotation = Annotation.Root({
  userQuery: Annotation<string>({
    reducer: (x, y) => y ?? x ?? '',
    default: () => ''
  }),
  detectedLanguage: Annotation<string>({
    reducer: (x, y) => y ?? x ?? 'en',
    default: () => 'en'
  }),
  translatedQuery: Annotation<string>({
    reducer: (x, y) => y ?? x ?? '',
    default: () => ''
  }),
  location: Annotation<LocationQuery | undefined>({
    reducer: (x, y) => y ?? x,
    default: () => undefined
  }),
  intent: Annotation<{ needsWeather: boolean; needsHazard: boolean }>({
    reducer: (x, y) => y ?? x ?? { needsWeather: true, needsHazard: true },
    default: () => ({ needsWeather: true, needsHazard: true })
  }),
  weatherData: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => undefined
  }),
  hazardData: Annotation<any>({
    reducer: (x, y) => y ?? x,
    default: () => undefined
  }),
  finalAnswer: Annotation<string>({
    reducer: (x, y) => y ?? x ?? '',
    default: () => ''
  }),
  sources: Annotation<string[]>({
    reducer: (x, y) => y ?? x ?? [],
    default: () => []
  })
});

// Conditional router based on Planner classification intent
function routePlanner(state: typeof OrcaStateAnnotation.State): string[] | string {
  const { needsWeather, needsHazard } = state.intent || { needsWeather: true, needsHazard: true };
  const targets: string[] = [];

  if (needsWeather) targets.push('weatherAgent');
  if (needsHazard) targets.push('hazardAgent');

  if (targets.length === 0) {
    return 'synthesizer';
  }

  return targets;
}

const builder = new StateGraph(OrcaStateAnnotation)
  .addNode('planner', async (state) => {
    return await plannerAgent(state as AgentState);
  })
  .addNode('weatherAgent', async (state) => {
    return await weatherOceanAgent(state as AgentState);
  })
  .addNode('hazardAgent', async (state) => {
    return await hazardGeofenceAgent(state as AgentState);
  })
  .addNode('synthesizer', async (state) => {
    return await synthesizerAgent(state as AgentState);
  })
  .addEdge(START, 'planner')
  .addConditionalEdges('planner', routePlanner)
  .addEdge('weatherAgent', 'synthesizer')
  .addEdge('hazardAgent', 'synthesizer')
  .addEdge('synthesizer', END);

export const orcaGraph = builder.compile();

/**
 * Executes the full ORCA multi-agent LangGraph workflow.
 */
export async function runOrcaGraph(
  userQuery: string,
  location?: LocationQuery
): Promise<AgentState> {
  const initialState: Partial<typeof OrcaStateAnnotation.State> = {
    userQuery,
    translatedQuery: userQuery,
    detectedLanguage: 'en',
    location,
    intent: { needsWeather: true, needsHazard: true },
    sources: [],
    finalAnswer: ''
  };

  const finalState = await orcaGraph.invoke(initialState);
  return finalState as AgentState;
}
