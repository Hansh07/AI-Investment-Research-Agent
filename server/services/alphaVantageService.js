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
    return { error: 'ALPHA_VANTAGE_API_KEY not set in process.env' };
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
    // Single API call: GLOBAL_QUOTE only (saves 2 API calls per analysis)
    // This maximizes the free-tier limit (25 analyses/day instead of 8)
    const quoteRes = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(cleanTicker)}&apikey=${apiKey}`);
    const quoteData = await quoteRes.json();

    if (quoteData['Note'] || quoteData['Information']) {
      const msg = quoteData['Note'] || quoteData['Information'];
      console.warn(`⚠️  Alpha Vantage rate limit hit: ${msg}`);
      return { error: `Rate limited: ${msg}`, raw: quoteData };
    }

    const quote = quoteData['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      console.warn(`⚠️  No stock quote found for "${cleanTicker}". Raw:`, quoteData);
      return { error: `No stock quote found for ${cleanTicker}`, raw: quoteData };
    }

    // Build stock data from GLOBAL_QUOTE (no Overview call needed)
    const stockData = {
      ticker: cleanTicker,
      price: parseFloat(quote['05. price']) || null,
      change: parseFloat(quote['09. change']) || null,
      changePercent: quote['10. change percent'] ? quote['10. change percent'].replace('%', '') : null,
      volume: parseInt(quote['06. volume']) || null,
      previousClose: parseFloat(quote['08. previous close']) || null,
      high: parseFloat(quote['03. high']) || null,
      low: parseFloat(quote['04. low']) || null,
      open: parseFloat(quote['02. open']) || null,

      // These fields require OVERVIEW endpoint (skipped to save API quota)
      marketCap: null,
      peRatio: null,
      eps: null,
      week52High: null,
      week52Low: null,
      sector: null,
      industry: null,
      description: null,
      dividendYield: null,
      beta: null,
    };

    console.log(`✅ Stock data fetched: ${cleanTicker} @ $${stockData.price} (${stockData.changePercent}%)`);
    // Cache the result
    stockCache.set(cleanTicker, { data: stockData, timestamp: Date.now() });
    stockCache.set(`${ticker}_resolved`, { data: stockData, timestamp: Date.now() });
    return stockData;
  } catch (error) {
    console.warn(`⚠️  Alpha Vantage request failed: ${error.message}`);
    return { error: `Request failed: ${error.message}` };
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
