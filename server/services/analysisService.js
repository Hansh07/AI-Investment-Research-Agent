// ============================================================
// Analysis Service — Orchestrator
// ============================================================
// This service coordinates the entire analysis workflow:
//   1. Search for company data (Tavily)
//   2. Run AI analysis (LangChain + Groq)
//   3. Validate the output
//   4. Return clean, validated data
//
// It's the "brain" of the backend — the controller calls this,
// and this service calls everything else.
// ============================================================

import { searchCompany } from './searchService.js';
import { runAnalysisChain } from '../chains/investmentChain.js';
import { validateAnalysisOutput } from '../utils/validator.js';

/**
 * Performs a complete investment analysis for a company.
 * @param {string} company - The company name to analyze
 * @returns {object} - Validated analysis result
 */
export async function analyzeCompany(company) {
  // Step 1: Search for company information using Tavily
  const searchResults = await searchCompany(company);

  // Step 2: Run the AI analysis chain (LangChain → Groq)
  const rawAnalysis = await runAnalysisChain(company, searchResults);

  // Step 3: Validate and normalize the AI output
  // This ensures all fields exist and have proper types/ranges
  const validatedAnalysis = validateAnalysisOutput(rawAnalysis);

  // Override the company name to match what the user typed
  validatedAnalysis.company = company;

  console.log(`✅ Analysis complete for "${company}" — Recommendation: ${validatedAnalysis.recommendation}`);

  return validatedAnalysis;
}
