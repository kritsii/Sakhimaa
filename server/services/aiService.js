import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateAndSanitizeReportResponse } from './validationService.js';

/**
 * Builds the comprehensive medical analysis prompt for SakhiMaa
 */
function buildSystemPrompt({ journeyType, reportType, userNote, extractedText }) {
  const journeyContext =
    journeyType === 'postnatal'
      ? 'The patient is in the POSTNATAL stage (recovering after delivery and caring for newborn).'
      : 'The patient is in the PREGNANCY stage (expectant mother).';

  return `
You are the Clinical Educational Assistant for "SakhiMaa", a supportive, compassionate maternal and newborn healthcare companion for pregnant and postnatal women.

Your goal is to carefully inspect the provided medical report (document and/or extracted text) and translate the medical terms, measurements, and findings into simple, reassuring, and clear everyday language.

PATIENT & REPORT CONTEXT:
- Maternal Journey: ${journeyContext}
- User-Selected Report Category: ${reportType || 'Not specified / Unknown'}
- Specific Question or Note from User: ${userNote ? `"${userNote}"` : 'None provided'}
${extractedText ? `\nEXTRACTED TEXT EXTRACT (FOR CONTEXT & VERIFICATION):\n"""\n${extractedText.slice(0, 8000)}\n"""\n` : ''}

CRITICAL MEDICAL SAFETY & ACCURACY RULES:
1. NEVER invent, fabricate, or assume values, units, or reference ranges that are not explicitly present in the document.
2. If a reference range is not stated in the report, set "referenceRange" to null and explicitly explain that this laboratory did not specify a reference range on the sheet. Do not guess or apply a universal range.
3. Preserve original values, decimal precision, units, and symbols exactly as printed.
4. Distinguish between laboratory-provided flags (e.g., "H", "L", "*", "OUT OF RANGE" printed by the lab analyzer) and your general educational explanation.
5. If the document is unreadable, blurred, or corrupted, set "isReadSuccessfully" to false, and detail what could not be read under "limitations".
6. Do NOT provide a definitive diagnosis or instruct the patient to start, stop, or adjust prescription medicines or dosages.
7. Frame explanations in a calm, trustworthy, supportive tone. Avoid alarmist or panicked language, but be clear and proactive about red flags (e.g. extremely low platelets, severe anemia < 7 g/dL, heavy proteinuria, critical liver enzymes).
8. Provide practical questions the mother can ask her obstetrician, gynaecologist, or paediatrician during her next appointment.

Return a STRICT JSON OBJECT with this EXACT schema:
{
  "reportType": "Identified Report Name (e.g., Complete Blood Count, Antenatal Thyroid Screen, Obstetric Ultrasound, Routine Urine Analysis)",
  "reportDate": "Date on report (YYYY-MM-DD or as printed) or null if not found",
  "summary": "2-3 empathetic, plain-language sentences summarizing what this report covers and its primary purpose.",
  "isReadSuccessfully": true,
  "findings": [
    {
      "testName": "Exact name of parameter/test (e.g., Haemoglobin, Platelets, TSH)",
      "value": "Exact reported value (e.g., 11.2)",
      "unit": "Exact unit (e.g., g/dL, 10^3/uL, mIU/L) or null",
      "referenceRange": "Exact reference range printed on report (e.g., 11.5 - 15.0) or null if omitted",
      "status": "within_range" | "low" | "high" | "abnormal" | "not_specified",
      "laboratoryFlag": "Lab-printed flag (e.g., 'L', 'H', '*') or null",
      "explanation": "Simple everyday explanation of what this test measures and what the number means."
    }
  ],
  "whatResultsMean": [
    {
      "title": "Topic or Category (e.g., Oxygen Carrying Capacity & Energy)",
      "explanation": "Plain language explanation of how these values connect.",
      "relevance": "Why this matters in pregnancy or postnatal healing."
    }
  ],
  "questionsForDoctor": [
    "Practical question 1 based on actual findings",
    "Practical question 2 based on actual findings",
    "Practical question 3 based on actual findings"
  ],
  "safetyGuidance": {
    "level": "routine" | "advisory" | "urgent",
    "message": "Clear advice on when and how to discuss this with her doctor.",
    "reasons": ["Specific findings or signs that warrant follow-up"]
  },
  "limitations": [
    "Any notes on unreadable sections, handwritten notes that could not be verified, or missing reference ranges."
  ]
}
`.trim();
}

/**
 * Executes analysis using Google Gemini API
 */
async function analyzeWithGemini({ fileBuffer, mimeType, extractedText, context }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file or environment.'
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // List of models to try in order of preference
  const candidateModels = [
    process.env.GEMINI_MODEL,
    'gemini-3.5-flash-lite',
    'gemini-3.5-flash',
    'gemini-3.8-flash',
  ].filter(Boolean);

  const promptText = buildSystemPrompt({
    journeyType: context.journeyType,
    reportType: context.reportType,
    userNote: context.userNote,
    extractedText,
  });

  // Prepare multimodal parts
  const contentsParts = [];

  // If we have a raw image or PDF file buffer, pass it as inlineData
  if (fileBuffer && mimeType) {
    let effectiveMime = mimeType;
    if (effectiveMime === 'image/jpg') effectiveMime = 'image/jpeg';

    if (
      effectiveMime === 'application/pdf' ||
      effectiveMime.startsWith('image/')
    ) {
      contentsParts.push({
        inlineData: {
          data: fileBuffer.toString('base64'),
          mimeType: effectiveMime,
        },
      });
    }
  }

  // Add the text prompt
  contentsParts.push({ text: promptText });

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1, // Low temperature for high factual accuracy
        },
      });

      const result = await model.generateContent(contentsParts);
      const response = await result.response;
      const responseText = response.text();

      if (!responseText) {
        throw new Error('Empty response received from AI model.');
      }

      // Parse JSON
      let parsed;
      try {
        parsed = JSON.parse(responseText);
      } catch (parseErr) {
        // Fallback: extract JSON between code fences or brackets
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Failed to parse AI output as JSON: ' + parseErr.message);
        }
      }

      return validateAndSanitizeReportResponse(parsed, context);
    } catch (err) {
      console.warn(`Attempt with Gemini model ${modelName} failed:`, err.message);
      lastError = err;
      // If error indicates API key invalid or quota, no need to retry all models
      if (err.message?.includes('API_KEY_INVALID') || err.message?.includes('PERMISSION_DENIED')) {
        break;
      }
    }
  }

  throw new Error(`AI Analysis failed: ${lastError?.message || 'Unable to connect to AI provider.'}`);
}

/**
 * Executes analysis using OpenAI API
 */
async function analyzeWithOpenAI({ fileBuffer, mimeType, extractedText, context }) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file or environment.'
    );
  }

  const modelName = process.env.OPENAI_MODEL || 'gpt-4o-mini';
  const promptText = buildSystemPrompt({
    journeyType: context.journeyType,
    reportType: context.reportType,
    userNote: context.userNote,
    extractedText,
  });

  const messages = [
    {
      role: 'system',
      content: 'You are a compassionate clinical educational assistant for SakhiMaa. You output strict JSON only.',
    },
  ];

  const userContent = [{ type: 'text', text: promptText }];

  // If image, add base64 image URL
  if (fileBuffer && mimeType && mimeType.startsWith('image/')) {
    const b64 = fileBuffer.toString('base64');
    userContent.push({
      type: 'image_url',
      image_url: {
        url: `data:${mimeType};base64,${b64}`,
      },
    });
  }

  messages.push({
    role: 'user',
    content: userContent,
  });

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: modelName,
      messages,
      response_format: { type: 'json_object' },
      temperature: 0.1,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errorBody}`);
  }

  const data = await res.json();
  const rawText = data.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error('OpenAI returned an empty completion.');
  }

  const parsed = JSON.parse(rawText);
  return validateAndSanitizeReportResponse(parsed, context);
}

/**
 * Main analysis coordinator: determines configured provider and runs analysis
 */
export async function analyzeReport({ fileBuffer, mimeType, extractedText, context }) {
  const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

  if (provider === 'openai') {
    return analyzeWithOpenAI({ fileBuffer, mimeType, extractedText, context });
  }

  // Default to Gemini
  return analyzeWithGemini({ fileBuffer, mimeType, extractedText, context });
}

/**
 * Returns the status of the AI configuration
 */
export function getAiConfigStatus() {
  const hasGemini = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const provider = process.env.AI_PROVIDER || 'gemini';

  const isConfigured = provider === 'openai' ? hasOpenAI : hasGemini;

  return {
    isConfigured,
    provider,
    model: provider === 'openai'
      ? (process.env.OPENAI_MODEL || 'gpt-4o-mini')
      : (process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'),
    hasGeminiKey: hasGemini,
    hasOpenAiKey: hasOpenAI,
  };
}
