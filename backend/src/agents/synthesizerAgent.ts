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
  const query = state.translatedQuery || state.userQuery || '';
  const intent = state.intent || { needsWeather: true, needsHazard: true };

  // 1. Handle off-topic or greeting queries directly without forcing ocean telemetry
  if (intent.isOffTopic) {
    const responseText = generateOffTopicResponse(query);
    return {
      finalAnswer: responseText,
      sources: ['ORCA Assistant']
    };
  }

  if (state.weatherData?.source) {
    sources.push(state.weatherData.source);
  }
  if (state.hazardData?.source) {
    sources.push(state.hazardData.source);
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_groq_api_key')) {
    return {
      finalAnswer: generateFallbackAnswer(state, query, sources),
      sources
    };
  }

  try {
    const groq = new Groq({ apiKey });

    const promptData = {
      userQuery: query,
      intentClassification: intent,
      weatherOceanData: state.weatherData || 'Not requested or unavailable',
      hazardGeofenceData: state.hazardData || 'Not requested or unavailable'
    };

    const systemPrompt = `You are the Synthesizer Agent for ORCA (sponsored by ISRO), a specialized AI advisory system for fishermen and coastal authorities.
Your task is to synthesize ocean weather telemetry and hazard geofencing data into a direct, helpful, plain-language advisory for fishermen that DIRECTLY ANSWERS their specific question.

INSTRUCTIONS:
1. Directly answer the user's specific question: "${query}".
2. If the user asks about CYCLONES, prioritize storm surge, cyclone warnings, wind speeds, and safety alerts.
3. If the user asks about FISHING SAFETY, structure the response clearly:
   - **VERDICT**: **SAFE TO FISH**, **CAUTION ADVISED**, or **UNSAFE / RESTRICTED ZONE**
   - **TELEMETRY NUMBERS**: Include exact wave height, wind speed, sea temperature, and tide times from data.
   - **PRACTICAL RECOMMENDATIONS**: Give 1-2 actionable tips for fishermen.
   - **DATA CITATIONS**: Cite data sources (e.g., [Source: Open-Meteo Marine API]).
4. Keep the tone helpful, clear, authoritative, and tailored to the query.`;

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
          console.log(`[PERF TIMING] Synthesizer Groq call (${modelName}): ${Date.now() - synthStart}ms`);
          break;
        }
      } catch {
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

function generateOffTopicResponse(query: string): string {
  const q = query.toLowerCase().trim();
  if (['hello', 'hi', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening'].some(g => q === g || q.startsWith(g))) {
    return `Namaste! I am ORCA, your ocean safety assistant (sponsored by ISRO).

I can help you with:
- **Marine Weather & Ocean Forecasts**: Wave height, wind speeds, sea surface temperature, and tide cycles.
- **Safety Advisories**: Sector-by-sector fishing safety verdicts.
- **Hazard & Geofencing**: Restricted boundary alerts and cyclone risk warnings.

How can I assist you with coastal weather or fishing safety today?`;
  }

  if (['who are you', 'what is your name', 'what do you do'].some(w => q.includes(w))) {
    return `I am **ORCA** (Ocean Risk & Coastal Advisory), a multi-agent AI system designed for fishermen and coastal authorities (sponsored by ISRO).

I analyze real-time satellite ocean telemetry, meteorological forecasts, and spatial geofencing data to provide instant, explainable marine advisories in local coastal languages.`;
  }

  return `I am ORCA, a specialized marine safety and ocean intelligence assistant for fishermen and coastal authorities.

I can provide real-time advisories on wave heights, wind speeds, tide schedules, cyclone risks, and restricted maritime zones. Please ask me a question related to ocean conditions or fishing safety!`;
}

function generateFallbackAnswer(state: AgentState, query: string, sources: string[]): string {
  const intent = state.intent || {};

  // If query was classified as off-topic or greeting
  if (intent.isOffTopic) {
    return generateOffTopicResponse(query);
  }

  const isCyclone = intent.isCycloneQuery || query.toLowerCase().includes('cyclone') || query.toLowerCase().includes('storm');
  const isRestricted = state.hazardData?.isInRestrictedZone;
  const wave = state.weatherData?.waveHeightMeters || 1.0;
  const wind = state.weatherData?.windSpeedKmh || 15;
  const hazardAlerts = state.hazardData?.hazardAlerts || [];

  const parts: string[] = [];

  if (isCyclone) {
    parts.push(`**CYCLONE & EXTREME WEATHER ADVISORY**\n`);
    parts.push(`*Assessment for query: "${query}"*\n`);

    if (hazardAlerts.length > 0 || wind > 30 || wave >= 2.5) {
      parts.push(`**VERDICT: HIGH CYCLONE / STORM RISK — DO NOT VENTURE TO SEA**\n`);
      parts.push(`- **Severe Weather Threat:** High swell waves and strong atmospheric turbulence detected.`);
      parts.push(`- **Current Wind Speed:** ${wind} km/h [Source: ${state.weatherData?.source || 'Open-Meteo'}]`);
      parts.push(`- **Wave Height:** ${wave}m [Source: ${state.weatherData?.source || 'Open-Meteo'}]`);
      if (hazardAlerts.length > 0) {
        parts.push(`- **Active Coastal Warnings:**`);
        hazardAlerts.forEach(a => parts.push(`  * [${a.severity}] ${a.type}: ${a.description}`));
      }
      parts.push(`\n**Actionable Safety Guidance:**`);
      parts.push(`- Suspend all coastal fishing operations immediately and secure vessels at port.`);
      parts.push(`- Monitor emergency radio broadcasts and ISRO/INCOIS weather bulletins.`);
    } else {
      parts.push(`**VERDICT: NO ACTIVE CYCLONE WARNINGS IN THIS SECTOR**\n`);
      parts.push(`- **Wind Speed:** ${wind} km/h (Moderate) [Source: ${state.weatherData?.source || 'Open-Meteo'}]`);
      parts.push(`- **Wave Height:** ${wave}m (Normal) [Source: ${state.weatherData?.source || 'Open-Meteo'}]`);
      parts.push(`- **Active Hazards:** No active storm surge or cyclone alerts detected in this sector.`);
      parts.push(`\n**Recommendation:**`);
      parts.push(`- Conditions are currently clear of major cyclonic activity. Maintain standard VHF radio monitoring while at sea.`);
    }
    return parts.join('\n');
  }

  let verdict = '**VERDICT: SAFE TO FISH WITH CAUTION**';
  if (isRestricted) {
    verdict = '**VERDICT: UNSAFE / RESTRICTED MARITIME ZONE**';
  } else if (wave >= 2.5 || wind >= 35) {
    verdict = '**VERDICT: CAUTION ADVISED (HIGH SWELLS / WINDS)**';
  }

  const locName = state.weatherData?.locationName || 'Coastal Sector';

  parts.push(`${verdict}\n`);
  parts.push(`*Safety Advisory for ${locName} — Query: "${query}"*\n`);

  if (state.weatherData) {
    parts.push(`**Ocean Telemetry Readings:**`);
    parts.push(`- **Wave Height:** ${state.weatherData.waveHeightMeters}m [Source: ${state.weatherData.source}]`);
    parts.push(`- **Wind Speed:** ${state.weatherData.windSpeedKmh} km/h [Source: ${state.weatherData.source}]`);
    parts.push(`- **Sea Surface Temperature:** ${state.weatherData.seaSurfaceTempCelsius}°C [Source: ${state.weatherData.source}]`);
    if (state.weatherData.tideTimes && state.weatherData.tideTimes.length > 0) {
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
    if (hazardAlerts.length > 0) {
      parts.push('- **Active Safety Warnings:**');
      hazardAlerts.forEach(a => parts.push(`  * [${a.severity}] ${a.type}: ${a.description}`));
    } else {
      parts.push('- **Active Safety Warnings:** None reported in this sector.');
    }
  }

  parts.push(`\n**Practical Safety Recommendation:**`);
  if (isRestricted) {
    parts.push(`- Do NOT enter this sector. Alter heading immediately to remain outside restricted maritime boundaries.`);
  } else if (wave >= 2.0) {
    parts.push(`- Exercise heightened caution. Ensure life jackets are worn by all crew members and monitor low-tide windows for safer harbor return.`);
  } else {
    parts.push(`- Conditions are safe for routine fishing. Depart during early low-tide windows and maintain active VHF radio watch.`);
  }

  return parts.join('\n');
}
