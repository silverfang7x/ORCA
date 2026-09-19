import { detectLanguage, translateToEnglish, translateFromEnglish } from './multilingual';
import { runOrcaGraph } from './graph';

async function testMultilingualPipeline() {
  console.log('=== ORCA Multilingual Detection & Translation Test Suite ===\n');

  // Explicit test requested: English -> Hindi -> English
  const originalEnglish = 'Is it safe to fish tomorrow?';
  console.log(`[Test 1] Original English Phrase: "${originalEnglish}"`);
  
  const translatedHindi = await translateFromEnglish(originalEnglish, 'hi');
  console.log(`[Test 1] Translated to Hindi (via Bhashini): "${translatedHindi}"`);
  
  const backToEnglish = await translateToEnglish(translatedHindi, 'hi');
  console.log(`[Test 1] Translated back to English (via Bhashini): "${backToEnglish}"\n`);

  const hindiQuery = 'क्या कल कोच्चि के पास मछली पकड़ना सुरक्षित है?';
  const location = {
    latitude: 9.9312,
    longitude: 76.2673,
    date: '2026-09-16'
  };

  console.log(`[Test 2] Original Hindi Query: "${hindiQuery}"`);

  // Step 1: Test Language Detection
  const detectedLang = await detectLanguage(hindiQuery);
  console.log(`Detected Language Code: "${detectedLang}"`);

  // Step 2: Test Translation to English
  const englishQuery = await translateToEnglish(hindiQuery, detectedLang);
  console.log(`Translated to English: "${englishQuery}"`);

  // Step 3: Run full Graph with Hindi Query
  console.log('\nRunning full Orca Graph end-to-end with Hindi Query...');
  const resultState = await runOrcaGraph(hindiQuery, location);

  console.log('\n' + '='.repeat(65));
  console.log('Detected Language in Graph State:', resultState.detectedLanguage);
  console.log('Translated Query in Graph State:', resultState.translatedQuery);
  console.log('Cited Sources:', resultState.sources);
  console.log('\nFinal Answer (Translated back to Hindi):\n', resultState.finalAnswer);
  console.log('='.repeat(65));
}

testMultilingualPipeline().catch((err) => {
  console.error('Multilingual test failed:', err);
});
