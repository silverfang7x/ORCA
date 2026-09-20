import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_MODELS = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];

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

  console.error(`[Multilingual] translateToEnglish requested: "${text.slice(0, 40)}..." (sourceLang: ${lang})`);

  try {
    const bhashiniResult = await callBhashiniTwoStep(text, lang, 'en');
    if (bhashiniResult) {
      console.error(`[Multilingual SUCCESS] Bhashini translation to English succeeded: "${bhashiniResult.slice(0, 40)}..."`);
      return bhashiniResult;
    }
  } catch (err: any) {
    console.error('[Multilingual ERROR] Bhashini translateToEnglish flow failed:', err?.stack || err?.message || err);
  }

  console.error('[Multilingual Fallback] Invoking fallback engine for translateToEnglish...');
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

  console.error(`[Multilingual] translateFromEnglish requested: "${text.slice(0, 40)}..." (targetLang: ${lang})`);

  try {
    const bhashiniResult = await callBhashiniTwoStep(text, 'en', lang);
    if (bhashiniResult) {
      console.error(`[Multilingual SUCCESS] Bhashini translation from English succeeded: "${bhashiniResult.slice(0, 40)}..."`);
      return bhashiniResult;
    }
  } catch (err: any) {
    console.error('[Multilingual ERROR] Bhashini translateFromEnglish flow failed:', err?.stack || err?.message || err);
  }

  console.error('[Multilingual Fallback] Invoking fallback engine for translateFromEnglish...');
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

  console.error(`[Bhashini Step 0 Credentials Check] BHASHINI_USER_ID=${userId ? 'PRESENT (' + userId.slice(0, 6) + '...)' : 'MISSING'}, BHASHINI_ULCA_API_KEY=${apiKey ? 'PRESENT (' + apiKey.slice(0, 6) + '...)' : 'MISSING'}`);

  if (!userId || !apiKey || userId.includes('your_') || apiKey.includes('your_')) {
    const err = new Error('Bhashini credentials (BHASHINI_USER_ID, BHASHINI_ULCA_API_KEY) missing or set to placeholder in environment');
    console.error('[Bhashini Step 0 ERROR]:', err);
    throw err;
  }

  const cacheKey = `${sourceLang}-${targetLang}`;
  let config = pipelineConfigCache.get(cacheKey);

  if (!config) {
    console.error(`[Bhashini Step 1 Config Call START] Requesting pipeline config for pair ${cacheKey}...`);
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

    let response: Response;
    const configStart = Date.now();
    const configController = new AbortController();
    const configTimer = setTimeout(() => configController.abort(), 5000);
    try {
      response = await fetch(pipelineUrl, {
        method: 'POST',
        headers: {
          'userID': userId,
          'authorization': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: configController.signal
      });
      console.error(`[Bhashini Step 1 Config Response] HTTP Status: ${response.status} (Duration: ${Date.now() - configStart}ms)`);
    } catch (fetchErr: any) {
      console.error(`[Bhashini Step 1 Config EXCEPTION] Duration: ${Date.now() - configStart}ms, Error:`, fetchErr?.stack || fetchErr);
      throw fetchErr;
    } finally {
      clearTimeout(configTimer);
    }

    if (!response.ok) {
      console.error(`[Bhashini Step 1 Config RETRY] HTTP ${response.status} received. Retrying getModelsPipeline with ulcaApiKey header...`);
      const retryStart = Date.now();
      const retryController = new AbortController();
      const retryTimer = setTimeout(() => retryController.abort(), 5000);
      try {
        response = await fetch(pipelineUrl, {
          method: 'POST',
          headers: {
            'userID': userId,
            'ulcaApiKey': apiKey,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: retryController.signal
        });
        console.error(`[Bhashini Step 1 Config Retry Response] HTTP Status: ${response.status} (Duration: ${Date.now() - retryStart}ms)`);
      } catch (retryErr: any) {
        console.error(`[Bhashini Step 1 Config Retry EXCEPTION] Duration: ${Date.now() - retryStart}ms, Error:`, retryErr?.stack || retryErr);
        throw retryErr;
      } finally {
        clearTimeout(retryTimer);
      }
    }

    if (!response.ok) {
      const errText = await response.text();
      const configErr = new Error(`Bhashini getModelsPipeline failed with HTTP ${response.status}: ${errText}`);
      console.error('[Bhashini Step 1 Config FAILURE]:', configErr);
      throw configErr;
    }

    const data: any = await response.json();
    console.error(`[Bhashini Step 1 Config SUCCESS] Response keys:`, Object.keys(data));

    // Key Extraction Step
    console.error(`[Bhashini Key Extraction START] Extracting endpoint & auth key...`);
    const extractedEndpoint = data?.pipelineInferenceAPIEndPoint;
    const extractedConfig = data?.pipelineResponseConfig?.[0]?.config?.[0];

    const callbackUrl = extractedEndpoint?.callbackUrl || 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';
    const headerName = extractedEndpoint?.inferenceApiKey?.name || 'Authorization';
    const headerValue = extractedEndpoint?.inferenceApiKey?.value || apiKey;
    const serviceId = extractedConfig?.serviceId || 'ai4bharat/indictrans-v2-all-gpu--t4';

    config = {
      callbackUrl,
      headerName,
      headerValue,
      serviceId
    };

    console.error(`[Bhashini Key Extraction SUCCESS] callbackUrl=${config.callbackUrl}, headerName=${config.headerName}, headerValue=${config.headerValue ? 'PRESENT' : 'MISSING'}, serviceId=${config.serviceId}`);
    pipelineConfigCache.set(cacheKey, config);
  } else {
    console.error(`[Bhashini Step 1 Config] Using in-memory cached config for ${cacheKey}`);
  }

  // Step 2: Compute Inference call
  console.error(`[Bhashini Step 2 Translate Call START] Sending POST inference call to ${config.callbackUrl} for serviceId ${config.serviceId}...`);
  let computeRes: Response;
  const computeStart = Date.now();
  const computeController = new AbortController();
  const computeTimer = setTimeout(() => computeController.abort(), 5000);
  try {
    computeRes = await fetch(config.callbackUrl, {
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
      }),
      signal: computeController.signal
    });
    console.error(`[Bhashini Step 2 Translate Response] HTTP Status: ${computeRes.status} (Duration: ${Date.now() - computeStart}ms)`);
  } catch (compErr: any) {
    console.error(`[Bhashini Step 2 Translate EXCEPTION] Duration: ${Date.now() - computeStart}ms, Error:`, compErr?.stack || compErr);
    throw compErr;
  } finally {
    clearTimeout(computeTimer);
  }

  if (!computeRes.ok) {
    const compErrText = await computeRes.text();
    const translateErr = new Error(`Bhashini inference failed with HTTP status ${computeRes.status}: ${compErrText}`);
    console.error('[Bhashini Step 2 Translate FAILURE]:', translateErr);
    throw translateErr;
  }

  const computeData: any = await computeRes.json();
  const outputText = computeData?.pipelineResponse?.[0]?.output?.[0]?.target;
  if (!outputText) {
    const missingOutputErr = new Error(`Bhashini inference response missing output target text. Raw data: ${JSON.stringify(computeData)}`);
    console.error('[Bhashini Step 2 Translate FAILURE]:', missingOutputErr);
    throw missingOutputErr;
  }

  console.error(`[Bhashini Step 2 Translate SUCCESS] Translated output target: "${outputText.slice(0, 40)}..."`);
  return outputText;
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
  console.error(`[Multilingual Fallback] Triggering Google Translate fallback for "${text.slice(0, 30)}..." (${sourceLang} -> ${targetLang})`);

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
        if (result && result.trim()) {
          console.error(`[Multilingual Fallback Success] Google Translate returned: "${result.slice(0, 40)}..."`);
          return result;
        }
      }
    } else {
      console.error(`[Multilingual Fallback] Google Translate returned HTTP status ${gResponse.status}`);
    }
  } catch (err: any) {
    console.error('[Multilingual Fallback ERROR] Google Translate web endpoint exception:', err?.message || err);
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
          if (translated) {
            console.error(`[Multilingual Fallback Success] Groq LLM (${modelName}) returned translation`);
            return translated;
          }
        } catch {
          continue;
        }
      }
    } catch (err: any) {
      console.error('[Multilingual Fallback ERROR] LLM translation fallback exception:', err?.message || err);
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
          console.error(`[Multilingual Fallback Success] MyMemory API returned translation`);
          return translatedText;
        }
      }
    } catch {
      // Ignore
    }
  }

  console.error('[Multilingual Fallback Warning] All translation fallbacks exhausted, returning original text');
  return text;
}
