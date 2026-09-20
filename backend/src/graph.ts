import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { AgentState, LocationQuery } from '@orca/shared';
import { plannerAgent } from './agents/plannerAgent';
import { weatherOceanAgent } from './agents/weatherOceanAgent';
import { hazardGeofenceAgent } from './agents/hazardGeofenceAgent';
import { synthesizerAgent } from './agents/synthesizerAgent';
import { detectLanguage, translateToEnglish, translateFromEnglish } from './multilingual';

export interface AgentProgressEvent {
  agent: 'planner' | 'weather' | 'hazard' | 'synthesizer' | 'multilingual';
  agentName: string;
  status: 'started' | 'completed' | 'failed';
  description: string;
  durationMs?: number;
  timestamp: string;
}

export type ProgressCallback = (event: AgentProgressEvent) => void;

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
  preferredLanguage: Annotation<string | undefined>({
    reducer: (x, y) => y ?? x,
    default: () => undefined
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
 * Executes the full ORCA multi-agent workflow with optional real-time progress callbacks.
 */
export async function runOrcaGraph(
  userQuery: string,
  location?: LocationQuery,
  onProgress?: ProgressCallback,
  preferredLanguage?: string
): Promise<AgentState> {
  const emit = (
    agent: AgentProgressEvent['agent'],
    agentName: string,
    status: AgentProgressEvent['status'],
    description: string,
    durationMs?: number
  ) => {
    onProgress?.({
      agent,
      agentName,
      status,
      description,
      durationMs,
      timestamp: new Date().toISOString()
    });
  };

  const overallStart = Date.now();

  // 1. Multilingual Detection & Translation
  const t0 = Date.now();
  emit('multilingual', 'Multilingual Layer', 'started', 'Detecting query language and analyzing script range...');
  const detectedLang = await detectLanguage(userQuery);
  const targetLang = (preferredLanguage && preferredLanguage !== 'en') ? preferredLanguage : detectedLang;

  const translatedQuery = detectedLang === 'en' 
    ? userQuery 
    : await translateToEnglish(userQuery, detectedLang);
  const t1 = Date.now();
  emit(
    'multilingual',
    'Multilingual Layer',
    'completed',
    `Detected language "${detectedLang.toUpperCase()}". Target output language "${targetLang.toUpperCase()}". ${detectedLang !== 'en' ? 'Query translated to English.' : 'Query is in English.'}`,
    t1 - t0
  );

  // 2. Planner Agent
  const t2 = Date.now();
  const latStr = location?.latitude ? location.latitude.toFixed(2) : '9.93';
  const lngStr = location?.longitude ? location.longitude.toFixed(2) : '76.26';
  emit('planner', 'Planner Agent', 'started', `Analyzing query intent for coastal position (${latStr}°N, ${lngStr}°E)...`);

  const initialState: Partial<typeof OrcaStateAnnotation.State> = {
    userQuery,
    translatedQuery,
    detectedLanguage: detectedLang,
    preferredLanguage,
    location,
    intent: { needsWeather: true, needsHazard: true },
    sources: [],
    finalAnswer: ''
  };

  const plannerResult = await plannerAgent(initialState as AgentState);
  const t3 = Date.now();
  const weatherReq = plannerResult.intent?.needsWeather ?? true;
  const hazardReq = plannerResult.intent?.needsHazard ?? true;
  emit(
    'planner',
    'Planner Agent',
    'completed',
    `Classified intent: Weather & Ocean Agent = ${weatherReq ? 'REQUIRED' : 'SKIPPED'}, Hazard & Geofence Agent = ${hazardReq ? 'REQUIRED' : 'SKIPPED'}.`,
    t3 - t2
  );

  let currentState: AgentState = {
    ...initialState,
    ...plannerResult
  } as AgentState;

  // 3. Sub-Agents Execution (Weather & Hazard)
  const subAgentPromises: Promise<any>[] = [];

  if (weatherReq) {
    subAgentPromises.push((async () => {
      const tw0 = Date.now();
      emit('weather', 'Weather & Ocean Agent', 'started', 'Fetching real-time marine wave, wind, and sea surface temperature telemetry...');
      const weatherRes = (await weatherOceanAgent(currentState)) as any;
      const tw1 = Date.now();
      const weatherData = weatherRes.weatherData || weatherRes;
      const wave = weatherData?.waveHeightMeters;
      const waveDesc = wave ? `Wave height ${wave}m, Sea temp ${weatherData.seaSurfaceTempCelsius}°C.` : 'Marine data fetched.';
      emit('weather', 'Weather & Ocean Agent', 'completed', `Fetched ocean telemetry from Open-Meteo: ${waveDesc}`, tw1 - tw0);
      return weatherRes.weatherData ? weatherRes : { weatherData: weatherRes };
    })());
  }

  if (hazardReq) {
    subAgentPromises.push((async () => {
      const th0 = Date.now();
      emit('hazard', 'Hazard & Geofence Agent', 'started', 'Executing Turf.js point-in-polygon spatial evaluation against active hazard polygons and boundaries...');
      const hazardRes = (await hazardGeofenceAgent(currentState)) as any;
      const th1 = Date.now();
      const hazardData = hazardRes.hazardData || hazardRes;
      const isRestricted = hazardData?.isInRestrictedZone;
      const hazDesc = isRestricted
        ? 'ALERT: Position intersects active restricted maritime hazard zone!'
        : 'Spatial check complete: Position is clear of restricted maritime zones.';
      emit('hazard', 'Hazard & Geofence Agent', 'completed', hazDesc, th1 - th0);
      return hazardRes.hazardData ? hazardRes : { hazardData: hazardRes };
    })());
  }

  const subAgentResults = await Promise.all(subAgentPromises);
  for (const res of subAgentResults) {
    currentState = { ...currentState, ...res };
  }

  // 4. Synthesizer Agent
  const ts0 = Date.now();
  emit('synthesizer', 'Synthesizer Agent', 'started', 'Synthesizing ocean telemetry and hazard spatial data into explainable advisory...');
  const synthRes = await synthesizerAgent(currentState);
  const ts1 = Date.now();
  const sourceCount = synthRes.sources?.length || 0;
  emit('synthesizer', 'Synthesizer Agent', 'completed', `Synthesized safe advisory with ${sourceCount} cited data sources.`, ts1 - ts0);

  currentState = { ...currentState, ...synthRes };

  // 5. Final Answer Regional Translation if required
  if (targetLang !== 'en' && currentState.finalAnswer) {
    const tr0 = Date.now();
    emit('multilingual', 'Multilingual Layer', 'started', `Translating final safety advisory to regional language (${targetLang.toUpperCase()})...`);
    const translatedAnswer = await translateFromEnglish(currentState.finalAnswer, targetLang);
    const tr1 = Date.now();
    currentState.finalAnswer = translatedAnswer;
    emit('multilingual', 'Multilingual Layer', 'completed', `Translated response into ${targetLang.toUpperCase()}.`, tr1 - tr0);
  }

  const totalMs = Date.now() - overallStart;
  console.error(`[PERF TIMING] Total End-to-End Pipeline Duration: ${totalMs}ms`);

  return currentState;
}
