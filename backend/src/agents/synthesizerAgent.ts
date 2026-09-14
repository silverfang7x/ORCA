import Groq from 'groq-sdk';
import { AgentState } from '@orca/shared';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'groq/compound'];

/**
 * Synthesizer Agent: Combines collected data from Weather/Ocean and Hazard/Geofence agents
 * to generate a clear, cited, natural-language advisory using Groq LLM.
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
      finalAnswer: "I wasn't able to retrieve conditions for this location right now - please try again",
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

    const systemPrompt = `You are the Synthesizer Agent for ORCA (sponsored by ISRO), a specialized AI advisory system for fishermen and coastal authorities.
Your task is to synthesize ocean weather conditions and hazard alert data into a concise, actionable, natural-language response.

Guidelines:
1. Answer the user's question directly using ONLY the provided weather and hazard data. Do NOT invent numbers, dates, or facts not present in the data.
2. Cite which data source each claim comes from (using the "source" field on the data objects, e.g. "[Source: Open-Meteo Marine API]").
3. If a specific piece of data needed to answer isn't available, state that clearly rather than guessing.
4. Keep the tone clear, direct, and appropriate for someone making a real safety decision - no conversational fluff.`;

    const userMessage = `User Query: "${query}"

Data Context:
${JSON.stringify(promptData, null, 2)}`;

    let responseContent = '';

    for (const modelName of GROQ_MODELS) {
      try {
        const response = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ],
          model: modelName,
          temperature: 0.2
        });

        responseContent = response.choices[0]?.message?.content?.trim() || '';
        if (responseContent) break;
      } catch (err) {
        // Try next model candidate
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
  parts.push(`Advisory for query: "${query}"\n`);

  if (state.weatherData) {
    parts.push(`Weather & Ocean Conditions [Source: ${state.weatherData.source}]:`);
    parts.push(`- Wave Height: ${state.weatherData.waveHeightMeters}m`);
    parts.push(`- Wind Speed: ${state.weatherData.windSpeedKmh} km/h`);
    parts.push(`- Sea Surface Temp: ${state.weatherData.seaSurfaceTempCelsius}°C`);
    if (state.weatherData.tideTimes.length > 0) {
      const tideStr = state.weatherData.tideTimes.map(t => `${t.type.toUpperCase()} tide at ${t.time}`).join(', ');
      parts.push(`- Tide Times: ${tideStr}`);
    }
  }

  if (state.hazardData) {
    parts.push(`\nHazard & Geofence Status [Source: ${state.hazardData.source}]:`);
    parts.push(`- In Restricted Zone: ${state.hazardData.isInRestrictedZone ? 'YES (RESTRICTED)' : 'No'}`);
    if (state.hazardData.nearestBoundaryName) {
      parts.push(`- Nearest Boundary: ${state.hazardData.nearestBoundaryName}`);
    }
    if (state.hazardData.hazardAlerts.length > 0) {
      parts.push('- Active Alerts:');
      state.hazardData.hazardAlerts.forEach(a => parts.push(`  * [${a.severity}] ${a.type}: ${a.description}`));
    } else {
      parts.push('- Active Alerts: None reported');
    }
  }

  return parts.join('\n');
}
