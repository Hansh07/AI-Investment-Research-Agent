// ============================================================
// Analysis Service — Orchestrator
// ============================================================
// This service coordinates the entire analysis workflow:
//   1. Search for company data (Tavily) + Fetch stock data (Alpha Vantage)
//   2. Run AI analysis (LangChain + Groq)
//   3. Validate the output
//   4. Return clean, validated data with real market data
//
// It's the "brain" of the backend — the controller calls this,
// and this service calls everything else.
// ============================================================

import { searchCompany } from './searchService.js';
import { fetchStockData } from './alphaVantageService.js';
import { runAnalysisChain } from '../chains/investmentChain.js';
import { validateAnalysisOutput } from '../utils/validator.js';

/**
 * Performs a complete investment analysis for a company.
 * @param {string} company - The company name to analyze
 * @returns {object} - Validated analysis result with stock data
 */
export async function analyzeCompany(company) {
  // Step 1: Search for company information using Tavily
  const searchResults = await searchCompany(company);

  // Step 2: Run the AI analysis chain to get the recommendation + ticker symbol
  const rawAnalysis = await runAnalysisChain(company, searchResults);

  // Step 3: Now fetch real stock data using the AI-determined ticker
  const ticker = rawAnalysis.ticker || company;
  // Use AI's company name for better search accuracy (e.g., "Tata Consultancy Services" instead of "tcs")
  const aiCompanyName = rawAnalysis.company || company;
  const stockData = await fetchStockData(ticker, aiCompanyName).catch(() => null);

  if (stockData && !stockData.error) {
    console.log(`📈 Stock data fetched for ${stockData.ticker}`);
    
    const parseOrNull = (val) => {
      if (val === undefined || val === null || String(val).toUpperCase() === 'N/A') return null;
      const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ''));
      return isNaN(parsed) ? null : parsed;
    };

    // Enrich the quote data with AI-extracted fundamentals if missing (common for Yahoo Finance fallback/international stocks)
    stockData.marketCap = stockData.marketCap || rawAnalysis.marketCap || null;
    stockData.peRatio = stockData.peRatio || parseOrNull(rawAnalysis.peRatio);
    stockData.eps = stockData.eps || parseOrNull(rawAnalysis.eps);
    stockData.beta = stockData.beta || parseOrNull(rawAnalysis.beta);
    
    if (stockData.dividendYield === null && rawAnalysis.dividendYield) {
      const parsedYield = parseOrNull(rawAnalysis.dividendYield);
      stockData.dividendYield = parsedYield !== null ? parsedYield / 100 : null;
    }
    
    stockData.sector = stockData.sector || rawAnalysis.sector || null;
    stockData.industry = stockData.industry || rawAnalysis.industry || null;
    stockData.week52High = stockData.week52High || parseOrNull(rawAnalysis.week52High);
    stockData.week52Low = stockData.week52Low || parseOrNull(rawAnalysis.week52Low);
  }

  // Step 4: Validate and normalize the AI output
  const validatedAnalysis = validateAnalysisOutput(rawAnalysis);

  // Override the company name to match what the user typed
  validatedAnalysis.company = company;

  // Attach stock data for the frontend to display
  validatedAnalysis.stockData = stockData || null;

  console.log(`✅ Analysis complete for "${company}" — Recommendation: ${validatedAnalysis.recommendation}`);

  return validatedAnalysis;
}

