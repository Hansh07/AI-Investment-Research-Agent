// ============================================================
// Alpha Vantage Service
// ============================================================
// Fetches real-time stock market data from Alpha Vantage API:
//   - Global Quote: current price, change %, volume
//   - Company Overview: market cap, P/E, EPS, sector, 52-week range
//
// This data supplements the Tavily search results and gives
// the AI concrete financial numbers to analyze.
// ============================================================

// Simple in-memory cache to avoid burning rate-limited API calls
// Key: ticker symbol, Value: { data, timestamp }
const stockCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches stock data from Alpha Vantage for a given ticker symbol.
 * Results are cached for 10 minutes to stay within free-tier rate limits.
 * @param {string} ticker - Stock ticker symbol (e.g., AAPL, TSLA)
 * @param {string} companyName - Company name for disambiguation (e.g., "Tata Consultancy Services")
 * @returns {object|null} - Stock data object or null if unavailable
 */
export async function fetchStockData(ticker, companyName = '') {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

  if (!apiKey) {
    console.warn('⚠️  ALPHA_VANTAGE_API_KEY not set, skipping stock data fetch.');
    return null;
  }

  // Clean the ticker (remove exchange prefix if present, e.g. "NASDAQ:AAPL" → "AAPL")
  let cleanTicker = ticker.includes(':') ? ticker.split(':')[1] : ticker;

  // Check cache first (try both raw ticker and resolved ticker)
  const cached = stockCache.get(cleanTicker) || stockCache.get(`${cleanTicker}_resolved`);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
    console.log(`📈 Using cached stock data for "${cached.data.ticker}" ($${cached.data.price})`);
    return cached.data;
  }

  console.log(`📈 Fetching stock data for "${cleanTicker}" (${companyName}) from Alpha Vantage...`);

  try {
    // Step 1: Use SYMBOL_SEARCH to find the best ticker match
    // This resolves "TCS" → "TCS.BSE" for Tata Consultancy Services
    const searchQuery = companyName || cleanTicker;
    const searchRes = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(searchQuery)}&apikey=${apiKey}`);
    const searchData = await searchRes.json();

    if (searchData['Note'] || searchData['Information']) {
      console.warn(`⚠️  Alpha Vantage rate limit on search: ${searchData['Note'] || searchData['Information']}`);
      return null;
    }

    const matches = searchData['bestMatches'] || [];
    if (matches.length > 0) {
      // Find the best match — prefer exact ticker match, otherwise use the first result
      const exactMatch = matches.find(m => m['1. symbol'] === cleanTicker);
      const bestMatch = exactMatch || matches[0];
      const resolvedTicker = bestMatch['1. symbol'];
      const matchName = bestMatch['2. name'];
      console.log(`🔍 Symbol search: "${searchQuery}" → ${resolvedTicker} (${matchName})`);
      cleanTicker = resolvedTicker;
    }

    // Wait 1.5s between API calls for free-tier rate limits
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 2: Fetch Global Quote
    const quoteRes = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(cleanTicker)}&apikey=${apiKey}`);
    const quoteData = await quoteRes.json();

    if (quoteData['Note'] || quoteData['Information']) {
      console.warn(`⚠️  Alpha Vantage rate limit hit: ${quoteData['Note'] || quoteData['Information']}`);
      return null;
    }

    const quote = quoteData['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      console.warn(`⚠️  No stock quote found for "${cleanTicker}".`);
      return null;
    }

    // Wait 1.5s before the third call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 3: Fetch Company Overview
    const overviewRes = await fetch(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${encodeURIComponent(cleanTicker)}&apikey=${apiKey}`);
    const overviewData = await overviewRes.json();

    if (overviewData['Note'] || overviewData['Information']) {
      console.warn(`⚠️  Alpha Vantage Overview rate limited — will still use quote data.`);
    }

    const overviewKeys = Object.keys(overviewData).filter(k => k !== 'Note' && k !== 'Information');
    console.log(`📋 Overview data fields: ${overviewKeys.length > 0 ? overviewKeys.slice(0, 5).join(', ') + '...' : 'none'}`);

    // Build a clean, structured stock data object
    const stockData = {
      ticker: cleanTicker,
      price: parseFloat(quote['05. price']) || null,
      change: parseFloat(quote['09. change']) || null,
      changePercent: quote['10. change percent'] ? quote['10. change percent'].replace('%', '') : null,
      volume: parseInt(quote['06. volume']) || null,
      previousClose: parseFloat(quote['08. previous close']) || null,

      // Company Overview fields
      marketCap: overviewData['MarketCapitalization'] || null,
      peRatio: parseFloat(overviewData['PERatio']) || null,
      eps: parseFloat(overviewData['EPS']) || null,
      week52High: parseFloat(overviewData['52WeekHigh']) || null,
      week52Low: parseFloat(overviewData['52WeekLow']) || null,
      sector: overviewData['Sector'] || null,
      industry: overviewData['Industry'] || null,
      description: overviewData['Description'] || null,
      dividendYield: parseFloat(overviewData['DividendYield']) || null,
      beta: parseFloat(overviewData['Beta']) || null,
    };

    console.log(`✅ Stock data fetched: ${cleanTicker} @ $${stockData.price} (${stockData.changePercent}%)`);
    // Cache the result under both the original and resolved ticker
    stockCache.set(cleanTicker, { data: stockData, timestamp: Date.now() });
    stockCache.set(`${ticker}_resolved`, { data: stockData, timestamp: Date.now() });
    return stockData;
  } catch (error) {
    console.warn(`⚠️  Alpha Vantage request failed: ${error.message}`);
    return null;
  }
}

/**
 * Formats stock data into a readable string for the AI prompt.
 * @param {object} stockData - The stock data object from fetchStockData
 * @returns {string} - Formatted text
 */
export function formatStockDataForPrompt(stockData) {
  if (!stockData) return '';

  const formatNum = (n) => (n !== null && n !== undefined ? n.toLocaleString() : 'N/A');
  const formatPrice = (n) => (n !== null && n !== undefined ? `$${n.toFixed(2)}` : 'N/A');
  const formatMarketCap = (n) => {
    if (!n) return 'N/A';
    const num = parseInt(n);
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${formatNum(num)}`;
  };

  return `
--- Real-Time Financial Data (Alpha Vantage) ---
Ticker: ${stockData.ticker}
Current Price: ${formatPrice(stockData.price)}
Price Change: ${stockData.change !== null ? `$${stockData.change.toFixed(2)} (${stockData.changePercent}%)` : 'N/A'}
Volume: ${formatNum(stockData.volume)}
Market Cap: ${formatMarketCap(stockData.marketCap)}
P/E Ratio: ${stockData.peRatio || 'N/A'}
EPS: ${stockData.eps ? `$${stockData.eps.toFixed(2)}` : 'N/A'}
52-Week High: ${formatPrice(stockData.week52High)}
52-Week Low: ${formatPrice(stockData.week52Low)}
Sector: ${stockData.sector || 'N/A'}
Industry: ${stockData.industry || 'N/A'}
Beta: ${stockData.beta || 'N/A'}
Dividend Yield: ${stockData.dividendYield ? `${(stockData.dividendYield * 100).toFixed(2)}%` : 'N/A'}
`;
}
