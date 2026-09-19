import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'openai/gpt-oss-120b', 'groq/compound'];

interface PipelineConfigCacheItem {
  callbackUrl: string;
  headerName: string;
  headerValue: string;
  serviceId: string;
}

// In-memory cache for Bhashini pipeline configurations indexed by "sourceLang-targetLang"
const pipelineConfigCache = new Map<string, PipelineConfigCacheItem>();

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
 * Uses two-step Bhashini ULCA/Dhruva API with in-memory caching and fallback engine.
 */
export async function translateToEnglish(text: string, sourceLang: string): Promise<string> {
  if (!text || !text.trim()) return '';
  const lang = (sourceLang || 'en').toLowerCase();
  if (lang === 'en' || lang.startsWith('en-')) return text;

  try {
    const bhashiniResult = await callBhashiniTwoStep(text, lang, 'en');
    if (bhashiniResult) return bhashiniResult;
  } catch (err) {
    console.warn('[Multilingual] Bhashini API flow failed, using fallback engine:', err);
  }

  return await translateWithFallback(text, lang, 'en');
}

/**
 * Translates text from English to targetLang.
 * Uses two-step Bhashini ULCA/Dhruva API with in-memory caching and fallback engine.
 */
export async function translateFromEnglish(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return '';
  const lang = (targetLang || 'en').toLowerCase();
  if (lang === 'en' || lang.startsWith('en-')) return text;

  try {
    const bhashiniResult = await callBhashiniTwoStep(text, 'en', lang);
    if (bhashiniResult) return bhashiniResult;
  } catch (err) {
    console.warn('[Multilingual] Bhashini API flow failed, using fallback engine:', err);
  }

  return await translateWithFallback(text, 'en', lang);
}

/**
 * Two-Step Bhashini ULCA / Dhruva translation flow:
 * 1. Step 1 (getModelsPipeline): Request pipeline config, extract callbackUrl, inferenceApiKey, serviceId (cached in memory).
 * 2. Step 2 (Inference Compute): POST to callbackUrl with inference key as auth header.
 */
async function callBhashiniTwoStep(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string | null> {
  const userId = process.env.BHASHINI_USER_ID;
  const apiKey = process.env.BHASHINI_ULCA_API_KEY;

  if (!userId || !apiKey || userId.includes('your_') || apiKey.includes('your_')) {
    throw new Error('Bhashini credentials (BHASHINI_USER_ID, BHASHINI_ULCA_API_KEY) not configured');
  }

  const cacheKey = `${sourceLang}-${targetLang}`;
  let config = pipelineConfigCache.get(cacheKey);

  if (!config) {
    // Step 1: Get pipeline config
    const pipelineUrl = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';
    const payload = {
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
      pipelineRequestConfig: {
        pipelineId: '64392f96daac500b55c543cd'
      }
    };

    let response = await fetch(pipelineUrl, {
      method: 'POST',
      headers: {
        'userID': userId,
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      // Fallback header strategy if gateway prefers authorization header only
      response = await fetch(pipelineUrl, {
        method: 'POST',
        headers: {
          'userID': userId,
          'ulcaApiKey': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    if (!response.ok) {
      throw new Error(`Bhashini getModelsPipeline failed with HTTP ${response.status}`);
    }

    const data: any = await response.json();
    const extractedEndpoint = data?.pipelineInferenceAPIEndPoint;
    const extractedConfig = data?.pipelineResponseConfig?.[0]?.config?.[0];

    config = {
      callbackUrl: extractedEndpoint?.callbackUrl || 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
      headerName: extractedEndpoint?.inferenceApiKey?.name || 'Authorization',
      headerValue: extractedEndpoint?.inferenceApiKey?.value || apiKey,
      serviceId: extractedConfig?.serviceId || 'ai4bharat/indictrans-v2-all-gpu--t4'
    };

    pipelineConfigCache.set(cacheKey, config);
  }

  // Step 2: Compute Inference call
  const computeRes = await fetch(config.callbackUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      [config.headerName]: config.headerValue
    },
    body: JSON.stringify({
      pipelineTasks: [
        {
          taskType: 'translation',
          config: {
            language: {
              sourceLanguage: sourceLang,
              targetLanguage: targetLang
            },
            serviceId: config.serviceId
          }
        }
      ],
      inputData: {
        input: [{ source: text }]
      }
    })
  });

  if (!computeRes.ok) {
    throw new Error(`Bhashini inference failed with HTTP status ${computeRes.status}`);
  }

  const computeData: any = await computeRes.json();
  const outputText = computeData?.pipelineResponse?.[0]?.output?.[0]?.target;
  return outputText || null;
}

/**
 * Fallback translation engine:
 * Uses Google Translate's free unofficial endpoint as primary fallback,
 * with secondary Groq LLM / MyMemory endpoints.
 */
async function translateWithFallback(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  // Primary fallback: Google Translate web endpoint
  try {
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${encodeURIComponent(sourceLang)}&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(text)}`;
    const gResponse = await fetch(gUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    if (gResponse.ok) {
      const gData: any = await gResponse.json();
      if (Array.isArray(gData?.[0])) {
        const result = gData[0].map((item: any) => item[0]).join('');
        if (result && result.trim()) return result;
      }
    }
  } catch (err) {
    console.warn('[Multilingual] Google Translate web fallback error:', err);
  }

  // Secondary fallback: Groq LLM translation
  const apiKey = process.env.GROQ_API_KEY;
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
      console.warn('[Multilingual] LLM translation fallback error:', err);
    }
  }

  // Tertiary fallback: MyMemory API
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
      // Ignore
    }
  }

  return text; // Gracefully return original text if all translation channels fail
}
