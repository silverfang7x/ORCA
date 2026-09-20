import Groq from 'groq-sdk';
import { AgentState } from '@orca/shared';
import dotenv from 'dotenv';

dotenv.config();

const DEFAULT_INTENT = { needsWeather: true, needsHazard: true };
const GROQ_MODELS = ['openai/gpt-oss-20b', 'qwen/qwen3.8-27b', 'groq/compound-mini'];

/**
 * Planner Agent: Analyzes the user's query using Groq LLM
 * and classifies intent to decide which specialized agents should be executed.
 */
export async function plannerAgent(state: AgentState): Promise<Partial<AgentState>> {
  const query = state.translatedQuery || state.userQuery || '';

  if (!query.trim()) {
    return { intent: DEFAULT_INTENT };
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'your_groq_api_key_here') {
    console.warn('[PlannerAgent] GROQ_API_KEY is not configured. Defaulting to both weather & hazard intent.');
    return { intent: DEFAULT_INTENT };
  }

  try {
    const groq = new Groq({ apiKey });
    const systemPrompt = `You are the Planner Agent for ORCA, a multi-agent AI system for fishermen and coastal authorities.
Analyze the user query and output ONLY valid JSON matching this exact structure:
{
  "needsWeather": boolean,
  "needsHazard": boolean
}

Classification Rules:
- "needsWeather": true if query relates to weather, wind, wave height, sea surface temperature, sea conditions, fishing advisory, or tides.
- "needsHazard": true if query relates to safety, hazard warnings, restricted maritime zones, boundary lines, cyclones, or danger alerts.
- Set BOTH to true if query asks about overall fishing safety or general advice (e.g. "is it safe to fish near Kochi tomorrow?").`;

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
      } catch (err: any) {
        console.error(`[GROQ ERROR - PlannerAgent] Model ${modelName} failed after ${Date.now() - tStart}ms:`, JSON.stringify({
          message: err?.message,
          status: err?.status,
          error: err?.error,
          name: err?.name,
          stack: err?.stack
        }, null, 2));
        continue;
      }
    }

    if (!content) {
      console.error(`[GROQ ERROR - PlannerAgent ALL MODELS EXHAUSTED] Could not complete classification for query: "${query}"`);
      return { intent: DEFAULT_INTENT };
    }

    const parsed = JSON.parse(content);
    const needsWeather = typeof parsed.needsWeather === 'boolean' ? parsed.needsWeather : true;
    const needsHazard = typeof parsed.needsHazard === 'boolean' ? parsed.needsHazard : true;

    return {
      intent: {
        needsWeather,
        needsHazard
      }
    };
  } catch (error: any) {
    console.error('[GROQ ERROR - PlannerAgent EXCEPTION]:', JSON.stringify({
      message: error?.message,
      status: error?.status,
      error: error?.error,
      name: error?.name,
      stack: error?.stack
    }, null, 2));
    return { intent: DEFAULT_INTENT };
  }
}
