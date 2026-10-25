/**
 * Medical Report Analysis Validation & Sanitization Service
 * Ensures AI responses conform strictly to the required schema,
 * eliminates fabricated values, and enforces medical safety principles.
 */

export const MEDICAL_DISCLAIMER =
  'SakhiMaa helps explain medical information in simple language. It does not provide a diagnosis or replace advice from your healthcare professional.';

/**
 * Validates and normalizes report analysis results from AI
 * @param {object} raw - Parsed JSON object from AI
 * @param {object} context - User context { journeyType, reportType, userNote }
 * @returns {object} Validated structured response
 */
export function validateAndSanitizeReportResponse(raw, context = {}) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('AI analysis produced an empty or invalid response.');
  }

  // 1. Report Type
  const reportType = (typeof raw.reportType === 'string' && raw.reportType.trim())
    ? raw.reportType.trim()
    : (context.reportType && context.reportType !== 'Unknown' ? context.reportType : 'Medical Laboratory Report');

  // 2. Report Date
  const reportDate = (typeof raw.reportDate === 'string' && raw.reportDate.trim() && raw.reportDate.toLowerCase() !== 'unknown' && raw.reportDate.toLowerCase() !== 'not found' && raw.reportDate.toLowerCase() !== 'null')
    ? raw.reportDate.trim()
    : null;

  // 3. Plain Language Summary
  const summary = (typeof raw.summary === 'string' && raw.summary.trim())
    ? raw.summary.trim()
    : 'This document was reviewed. Detailed parameter values and notes are explained below.';

  // 4. Validate findings array
  const rawFindings = Array.isArray(raw.findings) ? raw.findings : [];
  const findings = rawFindings
    .filter((f) => f && (f.testName || f.parameter))
    .map((f) => {
      const testName = (f.testName || f.parameter || '').trim();
      const rawVal = f.value !== undefined && f.value !== null ? String(f.value).trim() : null;
      const unit = f.unit ? String(f.unit).trim() : null;
      
      // Reference range: never fabricate! If missing or "N/A" / "not provided", set to null or explicit note
      let referenceRange = f.referenceRange ? String(f.referenceRange).trim() : null;
      if (referenceRange && (referenceRange.toLowerCase() === 'not provided' || referenceRange.toLowerCase() === 'n/a' || referenceRange.toLowerCase() === 'none' || referenceRange.toLowerCase() === 'null')) {
        referenceRange = null;
      }

      // Laboratory flag: explicitly indicated on report?
      let labFlag = f.laboratoryFlag ? String(f.laboratoryFlag).trim() : null;
      if (labFlag && (labFlag.toLowerCase() === 'none' || labFlag.toLowerCase() === 'null' || labFlag === '-')) {
        labFlag = null;
      }

      // Status
      let status = f.status ? String(f.status).toLowerCase().trim() : 'not_specified';
      const validStatuses = ['within_range', 'normal', 'low', 'high', 'abnormal', 'borderline', 'not_specified'];
      if (!validStatuses.includes(status)) {
        status = 'not_specified';
      }

      const explanation = (typeof f.explanation === 'string' && f.explanation.trim())
        ? f.explanation.trim()
        : `Reported value for ${testName}. Discuss with your doctor for stage-specific interpretation.`;

      return {
        testName,
        value: rawVal,
        unit,
        referenceRange,
        laboratoryFlag: labFlag,
        status,
        explanation,
      };
    });

  // 5. What these results mean
  let whatResultsMean = [];
  if (Array.isArray(raw.whatResultsMean)) {
    whatResultsMean = raw.whatResultsMean
      .filter((item) => item && (item.topic || item.title || item.explanation))
      .map((item) => ({
        title: item.title || item.topic || 'Medical Parameter Insight',
        explanation: item.explanation || item.description || '',
        relevance: item.relevance || item.pregnancyRelevance || item.postnatalRelevance || null,
      }));
  } else if (typeof raw.whatResultsMean === 'string' && raw.whatResultsMean.trim()) {
    whatResultsMean = [
      {
        title: 'Key Clinical Understandings',
        explanation: raw.whatResultsMean.trim(),
        relevance: null,
      },
    ];
  }

  // 6. Practical Questions for the Doctor
  let questionsForDoctor = [];
  if (Array.isArray(raw.questionsForDoctor)) {
    questionsForDoctor = raw.questionsForDoctor
      .filter((q) => typeof q === 'string' && q.trim())
      .map((q) => q.trim());
  }
  if (questionsForDoctor.length === 0) {
    questionsForDoctor = [
      'Could you help me understand what these test results mean for my current stage of pregnancy or recovery?',
      'Are there any specific values here that suggest we should run a follow-up test or adjust my care routine?',
      'Are these measurements within the expected range for someone at my exact weeks of pregnancy or postpartum healing?',
    ];
  }

  // 7. Safety guidance
  const rawSafety = raw.safetyGuidance || {};
  const safetyLevel = ['urgent', 'advisory', 'routine'].includes(rawSafety.level)
    ? rawSafety.level
    : 'routine';

  const safetyGuidance = {
    level: safetyLevel,
    message: typeof rawSafety.message === 'string' && rawSafety.message.trim()
      ? rawSafety.message.trim()
      : 'Always consult your healthcare provider or obstetrician to discuss your full clinical context and next steps.',
    reasons: Array.isArray(rawSafety.reasons) ? rawSafety.reasons.filter(Boolean) : [],
  };

  // 8. Limitations & Transparency
  let limitations = [];
  if (Array.isArray(raw.limitations)) {
    limitations = raw.limitations.filter((l) => typeof l === 'string' && l.trim());
  } else if (typeof raw.limitations === 'string' && raw.limitations.trim()) {
    limitations = [raw.limitations.trim()];
  }

  return {
    success: true,
    reportType,
    reportDate,
    summary,
    isReadSuccessfully: raw.isReadSuccessfully !== false,
    findings,
    whatResultsMean,
    questionsForDoctor,
    safetyGuidance,
    limitations,
    disclaimer: MEDICAL_DISCLAIMER,
  };
}
