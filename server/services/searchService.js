// ============================================================
// Tavily Search Service
// ============================================================
// Uses the Tavily Search API to gather real-time information
// about a company. We make multiple focused searches to get
// comprehensive data:
//   1. Company overview + financials
//   2. Recent news + developments
//   3. Market position + competitors
//
// The results are combined into a single text block that
// gets passed to the LLM for analysis.
// ============================================================

import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

/**
 * Searches for company information using Tavily API.
 * @param {string} company - The company name to research
 * @returns {string} - Combined search results as formatted text
 */
export async function searchCompany(company) {
  // Initialize the Tavily search tool (reduced to 2 results to stay within LLM rate limits)
  const searchTool = new TavilySearchResults({
    apiKey: process.env.TAVILY_API_KEY,
    maxResults: 2,
  });

  // Define search queries for different aspects of the company
  const queries = [
    `${company} company financial performance revenue profit 2024 2025`,
    `${company} company latest news developments 2025`,
    `${company} market position competitors industry analysis`,
  ];

  console.log(`🔍 Searching for information about "${company}"...`);

  // Run all searches in parallel for speed
  const searchPromises = queries.map(async (query) => {
    try {
      const results = await searchTool.invoke(query);
      return results;
    } catch (error) {
      console.warn(`⚠️  Search failed for query: "${query}" — ${error.message}`);
      return '[]';
    }
  });

  const results = await Promise.all(searchPromises);

  // Parse and format results into readable text
  let formattedResults = '';

  results.forEach((result, index) => {
    const category = ['Financial Overview', 'Recent News', 'Market Position'][index];
    formattedResults += `\n--- ${category} ---\n`;

    try {
      const parsed = typeof result === 'string' ? JSON.parse(result) : result;
      if (Array.isArray(parsed)) {
        parsed.forEach((item) => {
          formattedResults += `\nSource: ${item.url || 'N/A'}\n`;
          // Limit length of individual search snippets to prevent exceeding TPM limit
          const snippet = item.content || 'No content available';
          formattedResults += `${snippet.slice(0, 600)}\n`;
        });
      } else {
        formattedResults += `${String(result).slice(0, 600)}\n`;
      }
    } catch {
      formattedResults += `${String(result).slice(0, 600)}\n`;
    }
  });

  console.log(`✅ Search complete. Collected ${formattedResults.length} characters of data.`);
  return formattedResults;
}
