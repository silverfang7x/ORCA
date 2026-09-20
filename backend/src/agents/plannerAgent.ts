import Groq from 'groq-sdk';
import { AgentState } from '@orca/shared';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

/**
 * Rule-based classifier fallback when LLM calls fail or API key is not present/invalid.
 */
export function classifyQueryWithRules(queryText: string) {
  const q = queryText.toLowerCase().trim();

  // Greetings & casual conversation
  const greetings = ['hello', 'hi', 'hey', 'namaste', 'good morning', 'good afternoon', 'good evening', 'who are you', 'what is your name', 'thanks', 'thank you'];
  if (greetings.some(g => q === g || q.startsWith(g + ' ') || q.startsWith(g + '!'))) {
    return { needsWeather: false, needsHazard: false, isOffTopic: true, isCycloneQuery: false };
  }

  // Non-maritime / general knowledge queries
  const offTopicPatterns = ['capital of', 'tell me a joke', '2+2', 'recipe', 'who won', 'president', 'movie', 'code', 'python', 'javascript'];
  if (offTopicPatterns.some(p => q.includes(p))) {
    return { needsWeather: false, needsHazard: false, isOffTopic: true, isCycloneQuery: false };
  }

  // Cyclone / Extreme storm specific
  if (q.includes('cyclone') || q.includes('storm') || q.includes('typhoon') || q.includes('hurricane')) {
    return { needsWeather: true, needsHazard: true, isOffTopic: false, isCycloneQuery: true };
  }

  // Weather / Tide / Fishing safety
  const weatherKeywords = ['weather', 'wave', 'wind', 'tide', 'temp', 'temperature', 'sea', 'ocean', 'fish', 'fishing', 'safe', 'safety', 'kochi', 'chennai', 'mumbai', 'goa', 'harbour', 'harbor', 'port', 'boat'];
  const relatesToMaritime = weatherKeywords.some(k => q.includes(k));

  if (!relatesToMaritime && q.length < 30) {
    return { needsWeather: false, needsHazard: false, isOffTopic: true, isCycloneQuery: false };
  }

  return { needsWeather: true, needsHazard: true, isOffTopic: false, isCycloneQuery: false };
}

/**
 * Planner Agent: Analyzes user query using Groq LLM with rule fallback.
 */
export async function plannerAgent(state: AgentState): Promise<Partial<AgentState>> {
  const query = state.translatedQuery || state.userQuery || '';

  if (!query.trim()) {
    return { intent: { needsWeather: true, needsHazard: true, isOffTopic: false, isCycloneQuery: false } };
  }

  const ruleIntent = classifyQueryWithRules(query);

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_groq_api_key')) {
    console.warn('[PlannerAgent] GROQ_API_KEY is not configured or placeholder. Using rule-based intent classification.');
    return { intent: ruleIntent };
  }

  try {
    const groq = new Groq({ apiKey });
    const systemPrompt = `You are the Planner Agent for ORCA, a multi-agent AI system for fishermen and coastal authorities.
Analyze the user query and output ONLY valid JSON matching this exact structure:
{
  "needsWeather": boolean,
  "needsHazard": boolean,
  "isOffTopic": boolean,
  "isCycloneQuery": boolean
}

Classification Rules:
- "isOffTopic": true if query is a greeting ("hello"), casual chat, non-maritime question, or unrelated topic.
- "isCycloneQuery": true if query asks about cyclones, storms, typhoons, or extreme weather events.
- "needsWeather": true if query asks about ocean weather, wind, wave height, sea temperature, fishing advisory, or tides.
- "needsHazard": true if query asks about safety warnings, geofences, restricted zones, cyclones, or danger alerts.
- Set both needsWeather & needsHazard to false if isOffTopic is true.`;

    let content = '';
    const tStart = Date.now();
    for (const modelName of GROQ_MODELS) {
      try {
        const response = await groq.chat.completions.create(
          {
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: query }
            ],
            model: modelName,
            temperature: 0.1,
            response_format: { type: 'json_object' }
          },
          { timeout: 5000 }
        );
        content = response.choices[0]?.message?.content || '';
        if (content) {
          console.log(`[PERF TIMING] Planner Agent Groq Call (${modelName}): ${Date.now() - tStart}ms`);
          break;
        }
      } catch {
        continue;
      }
    }

    if (!content) {
      console.log(`[PERF TIMING] Planner Agent Groq Call failed: using rule-based classification.`);
      return { intent: ruleIntent };
    }

    const parsed = JSON.parse(content);
    return {
      intent: {
        needsWeather: typeof parsed.needsWeather === 'boolean' ? parsed.needsWeather : ruleIntent.needsWeather,
        needsHazard: typeof parsed.needsHazard === 'boolean' ? parsed.needsHazard : ruleIntent.needsHazard,
        isOffTopic: typeof parsed.isOffTopic === 'boolean' ? parsed.isOffTopic : ruleIntent.isOffTopic,
        isCycloneQuery: typeof parsed.isCycloneQuery === 'boolean' ? parsed.isCycloneQuery : ruleIntent.isCycloneQuery,
      }
    };
  } catch (error) {
    console.error('[PlannerAgent] Exception during intent classification, using rule fallback:', error);
    return { intent: ruleIntent };
  }
}
