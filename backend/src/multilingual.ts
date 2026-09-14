import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'groq/compound'];

/**
 * Detects the language of an input string.
 * Uses script/Unicode inspection for Indian languages with fallback to default 'en'.
 */
export async function detectLanguage(text: string): Promise<string> {
  if (!text || !text.trim()) return 'en';

  const cleaned = text.trim();

  // Malayalam script range
  if (/[\u0D00-\u0D7F]/.test(cleaned)) return 'ml';
  // Devanagari (Hindi, Marathi) script range
  if (/[\u0900-\u097F]/.test(cleaned)) return 'hi';
  // Tamil script range
  if (/[\u0B80-\u0BFF]/.test(cleaned)) return 'ta';
  // Telugu script range
  if (/[\u0C00-\u0C7F]/.test(cleaned)) return 'te';
  // Kannada script range
  if (/[\u0C80-\u0CFF]/.test(cleaned)) return 'kn';
  // Bengali script range
  if (/[\u0980-\u09FF]/.test(cleaned)) return 'bn';
  // Gujarati script range
  if (/[\u0A80-\u0AFF]/.test(cleaned)) return 'gu';

  return 'en';
}

/**
 * Translates text to English from sourceLang.
 * Uses Bhashini API if configured, with free web endpoint & LLM fallbacks.
 */
export async function translateToEnglish(text: string, sourceLang: string): Promise<string> {
  if (!text || !text.trim()) return '';
  const lang = (sourceLang || 'en').toLowerCase();
  if (lang === 'en' || lang.startsWith('en-')) return text;

  // Try Bhashini if API key configured
  const apiKey = process.env.BHASHINI_API_KEY;
  if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_bhashini_api_key_here') {
    try {
      const bhashiniResult = await callBhashiniApi(text, lang, 'en', apiKey);
      if (bhashiniResult) return bhashiniResult;
    } catch (err) {
      console.warn('[Multilingual] Bhashini API failed, falling back to free translation engine:', err);
    }
  }

  return await translateWithFallback(text, lang, 'en');
}

/**
 * Translates text from English to targetLang.
 * Uses Bhashini API if configured, with free web endpoint & LLM fallbacks.
 */
export async function translateFromEnglish(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return '';
  const lang = (targetLang || 'en').toLowerCase();
  if (lang === 'en' || lang.startsWith('en-')) return text;

  // Try Bhashini if API key configured
  const apiKey = process.env.BHASHINI_API_KEY;
  if (apiKey && apiKey.trim() !== '' && apiKey !== 'your_bhashini_api_key_here') {
    try {
      const bhashiniResult = await callBhashiniApi(text, 'en', lang, apiKey);
      if (bhashiniResult) return bhashiniResult;
    } catch (err) {
      console.warn('[Multilingual] Bhashini API failed, falling back to free translation engine:', err);
    }
  }

  return await translateWithFallback(text, 'en', lang);
}

/**
 * Helper to call Bhashini API
 */
async function callBhashiniApi(
  text: string,
  sourceLang: string,
  targetLang: string,
  apiKey: string
): Promise<string | null> {
  const url = 'https://dhruva-api.bhashini.gov.in/services/inference/translation';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: 'translation',
          config: {
            language: {
              sourceLanguage: sourceLang,
              targetLanguage: targetLang
            }
          }
        }
      ],
      inputData: {
        input: [{ source: text }]
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Bhashini API error HTTP status ${response.status}`);
  }

  const data: any = await response.json();
  const outputText = data?.pipelineResponse?.[0]?.output?.[0]?.target;
  return outputText || null;
}

/**
 * Fallback translation engine:
 * Uses Groq LLM if GROQ_API_KEY is available (handles long text seamlessly),
 * or MyMemory / Google Translate free web endpoints for shorter phrases.
 */
async function translateWithFallback(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  // Primary fallback: Groq LLM translation (ideal for long responses and markdown preservation)
  if (apiKey && apiKey.trim() !== '' && !apiKey.includes('your_groq_api_key')) {
    try {
      const groq = new Groq({ apiKey });
      const systemPrompt = `You are a professional translator for ORCA, a marine safety advisory platform.
Translate the following text accurately from ${sourceLang} to ${targetLang}.
Preserve all formatting, bullet points, numbers, source citations (e.g. [Source: ...]), and safety structure.
Output ONLY the translated text without any preamble or commentary.`;

      for (const modelName of GROQ_MODELS) {
        try {
          const res = await groq.chat.completions.create({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: text }
            ],
            model: modelName,
            temperature: 0.1
          });
          const translated = res.choices[0]?.message?.content?.trim();
          if (translated) return translated;
        } catch {
          continue;
        }
      }
    } catch (err) {
      console.warn('[Multilingual] LLM translation fallback encountered error:', err);
    }
  }

  // Secondary fallback: MyMemory API (for shorter texts)
  if (text.length <= 400) {
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`;
      const response = await fetch(url);
      if (response.ok) {
        const data: any = await response.json();
        const translatedText = data?.responseData?.translatedText;
        if (translatedText && !translatedText.includes('QUERY LENGTH LIMIT EXCEEDED')) {
          return translatedText;
        }
      }
    } catch {
      // Ignore and proceed to Google Translate
    }
  }

  // Tertiary fallback: Google Translate web endpoint
  try {
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const gResponse = await fetch(gUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    if (gResponse.ok) {
      const gData: any = await gResponse.json();
      if (Array.isArray(gData?.[0])) {
        return gData[0].map((item: any) => item[0]).join('');
      }
    }
  } catch (err) {
    console.error('[Multilingual] Web fallback translation error:', err);
  }

  return text; // Gracefully return original text if all translation channels fail
}
