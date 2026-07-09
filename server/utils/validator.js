// ============================================================
// Input & Output Validators
// ============================================================
// validateCompanyInput: Checks that the user provided a valid company name
// validateAnalysisOutput: Ensures the AI response has all required fields
// ============================================================

/**
 * Validates the company name from the request body.
 * Rules: must be a non-empty string, 1-100 characters.
 */
export function validateCompanyInput(company) {
  if (!company || typeof company !== 'string') {
    return { valid: false, message: 'Please provide a company name.' };
  }

  const trimmed = company.trim();

  if (trimmed.length === 0) {
    return { valid: false, message: 'Company name cannot be empty.' };
  }

  if (trimmed.length > 100) {
    return { valid: false, message: 'Company name is too long (max 100 characters).' };
  }

  return { valid: true, value: trimmed };
}

/**
 * Validates the structured JSON output from the AI.
 * Ensures all required fields exist and have reasonable values.
 * If a field is missing, a sensible default is provided.
 */
export function validateAnalysisOutput(data) {
  const requiredFields = [
    'company',
    'recommendation',
    'overallScore',
    'confidence',
    'risk',
    'financialHealth',
    'growth',
    'marketPosition',
    'innovation',
    'summary',
    'pros',
    'cons',
    'news',
    'explanation',
    'beginnerExplanation',
  ];

  const defaults = {
    company: 'Unknown',
    recommendation: 'PASS',
    overallScore: 50,
    confidence: 50,
    risk: 'Medium',
    financialHealth: 50,
    growth: 50,
    marketPosition: 50,
    innovation: 50,
    summary: 'Analysis could not be fully completed.',
    pros: ['Data limited'],
    cons: ['Insufficient data for full analysis'],
    news: ['No recent news available'],
    explanation: 'The AI was unable to provide a full analysis.',
    beginnerExplanation: 'We could not fully analyze this company.',
  };

  // Fill in any missing fields with defaults
  const validated = { ...defaults };
  for (const field of requiredFields) {
    if (data[field] !== undefined && data[field] !== null) {
      validated[field] = data[field];
    }
  }

  // Clamp numeric scores to 0-100 range
  const numericFields = ['overallScore', 'confidence', 'financialHealth', 'growth', 'marketPosition', 'innovation'];
  for (const field of numericFields) {
    const val = Number(validated[field]);
    validated[field] = isNaN(val) ? 50 : Math.max(0, Math.min(100, val));
  }

  // Ensure arrays are actually arrays
  if (!Array.isArray(validated.pros)) validated.pros = [String(validated.pros)];
  if (!Array.isArray(validated.cons)) validated.cons = [String(validated.cons)];
  if (!Array.isArray(validated.news)) validated.news = [String(validated.news)];

  // Normalize recommendation to INVEST or PASS
  const rec = String(validated.recommendation).toUpperCase().trim();
  validated.recommendation = rec === 'INVEST' ? 'INVEST' : 'PASS';

  // Normalize risk to Low, Medium, or High
  const riskMap = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };
  validated.risk = riskMap[String(validated.risk).toUpperCase()] || 'Medium';

  return validated;
}
