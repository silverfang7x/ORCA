import Groq from 'groq-sdk';
import { AgentState } from '@orca/shared';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

/**
 * Synthesizer Agent: Combines collected data from Weather/Ocean and Hazard/Geofence agents
 * to generate a clear, structured, genuinely informative safety advisory for fishermen.
 */
export async function synthesizerAgent(state: AgentState): Promise<Partial<AgentState>> {
  const sources: string[] = [];

  if (state.weatherData?.source) {
    sources.push(state.weatherData.source);
  }
  if (state.hazardData?.source) {
    sources.push(state.hazardData.source);
  }

  // Handle edge case where both weatherData and hazardData are undefined
  if (!state.weatherData && !state.hazardData) {
    return {
      finalAnswer: "VERDICT: UNABLE TO VERIFY\n\nI wasn't able to retrieve ocean telemetry or hazard data for this location right now. Please check back shortly before departing.",
      sources: []
    };
  }

  const query = state.translatedQuery || state.userQuery || 'Is it safe to fish?';
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
    return {
      finalAnswer: generateFallbackAnswer(state, query, sources),
      sources
    };
  }

  try {
    const groq = new Groq({ apiKey });

    const promptData = {
      userQuery: query,
      weatherOceanData: state.weatherData || 'Not requested or unavailable',
      hazardGeofenceData: state.hazardData || 'Not requested or unavailable'
    };

    const systemPrompt = `You are the Synthesizer Agent for ORCA (sponsored by ISRO), a specialized AI advisory system for fishermen, coastal citizens, swimmers, and maritime authorities.
Your task is to synthesize ocean weather telemetry and hazard spatial data into a clear, structured, genuinely informative safety advisory tailored specifically to the user's requested activity (e.g., swimming, fishing, beach activities, boating, or general ocean safety).

MANDATORY RESPONSE GUIDELINES:

1. DYNAMIC SAFETY VERDICT: Start with a bold, unambiguous safety verdict line matching the requested activity:
   - For Fishing/Sailing: "**VERDICT: SAFE TO FISH / SAIL**" or "**VERDICT: CAUTION ADVISED**" or "**VERDICT: UNSAFE / RESTRICTED ZONE**"
   - For Swimming/Beach: "**VERDICT: SAFE FOR SWIMMING**" or "**VERDICT: CAUTION ADVISED FOR SWIMMERS**" or "**VERDICT: UNSAFE FOR SWIMMING (HIGH SWELLS / RIPTIDES)**"
   - For Out-of-Scope Queries (unrelated to ocean/marine): Plainly state that ORCA is a coastal & marine safety platform and provide a brief friendly redirection.

2. SPECIFIC TELEMETRY NUMBERS: Always include exact numeric readings directly from the data:
   - Wave Height (in meters)
   - Wind Speed (in km/h)
   - Sea Surface Temperature (in °C)
   - Tide Forecast (high and low tide times)
   - Nearest Hazard Boundary & Distance

3. TAILORED PRACTICAL RECOMMENDATION: Give 1-2 practical recommendations matching the specific question (e.g., for swimming: wave height threshold advice, shore proximity, low tide currents; for fishing: low tide departure windows, life jackets).

4. DATA CITATIONS: Cite the data source for every claim (e.g. "[Source: Open-Meteo Marine API]", "[Source: Mock hazard dataset + Turf.js geofencing]").

Tone: Clear, friendly, informative, and authoritative. Answer the specific question asked directly.`;

    const userMessage = `User Query: "${query}"

Data Context:
${JSON.stringify(promptData, null, 2)}`;

    let responseContent = '';
    const synthStart = Date.now();

    for (const modelName of GROQ_MODELS) {
      try {
        const response = await groq.chat.completions.create(
          {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage }
            ],
            model: modelName,
            temperature: 0.2
          },
          { timeout: 5000 }
        );

        responseContent = response.choices[0]?.message?.content?.trim() || '';
        if (responseContent) {
          console.error(`[PERF TIMING] Synthesizer Groq call (${modelName}): ${Date.now() - synthStart}ms`);
          break;
        }
      } catch (err) {
        console.error(`[PERF TIMING ERROR] Synthesizer Groq model ${modelName} failed after ${Date.now() - synthStart}ms`);
        continue;
      }
    }

    const finalAnswer = responseContent || generateFallbackAnswer(state, query, sources);

    return {
      finalAnswer,
      sources
    };
  } catch (error) {
    console.error('[SynthesizerAgent] Error calling Groq API, using fallback:', error);
    return {
      finalAnswer: generateFallbackAnswer(state, query, sources),
      sources
    };
  }
}

function generateFallbackAnswer(state: AgentState, query: string, sources: string[]): string {
  const parts: string[] = [];
  const lowerQuery = query.toLowerCase();
  const isSwimmingQuery = lowerQuery.includes('swim') || lowerQuery.includes('bath') || lowerQuery.includes('beach');
  const isRestricted = state.hazardData?.isInRestrictedZone;
  const wave = state.weatherData?.waveHeightMeters || 1.0;

  let verdict = '';
  if (isSwimmingQuery) {
    if (isRestricted || wave >= 2.0) {
      verdict = '**VERDICT: UNSAFE FOR SWIMMING (HIGH SWELLS / HAZARD ZONE)**';
    } else if (wave >= 1.5) {
      verdict = '**VERDICT: CAUTION ADVISED FOR SWIMMING**';
    } else {
      verdict = '**VERDICT: SAFE FOR SWIMMING WITH CAUTION**';
    }
  } else {
    if (isRestricted) {
      verdict = '**VERDICT: UNSAFE / RESTRICTED MARITIME ZONE**';
    } else if (wave >= 2.5) {
      verdict = '**VERDICT: CAUTION ADVISED (HIGH SWELLS)**';
    } else {
      verdict = '**VERDICT: SAFE TO FISH WITH CAUTION**';
    }
  }

  parts.push(`${verdict}\n`);
  parts.push(`*Advisory for query: "${query}"*\n`);

  if (state.weatherData) {
    parts.push(`**Ocean Telemetry Readings:**`);
    parts.push(`- **Wave Height:** ${state.weatherData.waveHeightMeters}m [Source: ${state.weatherData.source}]`);
    parts.push(`- **Wind Speed:** ${state.weatherData.windSpeedKmh} km/h [Source: ${state.weatherData.source}]`);
    parts.push(`- **Sea Surface Temperature:** ${state.weatherData.seaSurfaceTempCelsius}°C [Source: ${state.weatherData.source}]`);
    if (state.weatherData.tideTimes.length > 0) {
      const tideStr = state.weatherData.tideTimes.map(t => `${t.type.toUpperCase()} tide at ${t.time}`).join(', ');
      parts.push(`- **Tide Cycle:** ${tideStr} [Source: ${state.weatherData.source}]`);
    }
  }

  if (state.hazardData) {
    parts.push(`\n**Hazard & Geofence Proximity:**`);
    parts.push(`- **Restricted Zone Intersection:** ${state.hazardData.isInRestrictedZone ? 'YES (RESTRICTED)' : 'No'} [Source: ${state.hazardData.source}]`);
    if (state.hazardData.nearestBoundaryName) {
      parts.push(`- **Nearest Boundary:** ${state.hazardData.nearestBoundaryName} [Source: ${state.hazardData.source}]`);
    }
    if (state.hazardData.hazardAlerts.length > 0) {
      parts.push('- **Active Safety Warnings:**');
      state.hazardData.hazardAlerts.forEach(a => parts.push(`  * [${a.severity}] ${a.type}: ${a.description}`));
    } else {
      parts.push('- **Active Safety Warnings:** None reported in this sector.');
    }
  }

  parts.push(`\n**Practical Safety Recommendation:**`);
  if (isSwimmingQuery) {
    if (wave >= 1.5 || isRestricted) {
      parts.push(`- Avoid entering deep waters. Strong wave swells (${wave}m) and tidal currents pose a drowning risk.`);
    } else {
      parts.push(`- Swimming is permitted near designated shallow beach zones. Remain within guarded areas and monitor changing tide currents.`);
    }
  } else {
    if (isRestricted) {
      parts.push(`- Do NOT enter this sector. Alter heading immediately to remain outside restricted maritime boundaries.`);
    } else if (wave >= 2.0) {
      parts.push(`- Exercise heightened caution. Ensure life jackets are worn by all crew members and monitor low-tide windows for safer harbor return.`);
    } else {
      parts.push(`- Conditions are safe for routine fishing. Depart during early low-tide windows and maintain active VHF radio watch.`);
    }
  }

  return parts.join('\n');
}
