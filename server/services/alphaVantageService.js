// ============================================================
// Stock Data Service
// ============================================================
// Fetches real-time stock market data with fallback strategy:
//   1. Try Alpha Vantage (works locally, may be blocked on cloud IPs)
//   2. Fall back to Yahoo Finance chart API (no key needed, works everywhere)
//
// This data supplements the Tavily search results and gives
// the AI concrete financial numbers to analyze.
// ============================================================

// Simple in-memory cache to avoid burning rate-limited API calls
// Key: ticker symbol, Value: { data, timestamp }
const stockCache = new Map();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetches stock data with Alpha Vantage → Yahoo Finance fallback.
 * @param {string} ticker - Stock ticker symbol (e.g., AAPL, TSLA)
 * @param {string} companyName - Company name for logging
 * @returns {object|null} - Stock data object or null if unavailable
 */
export async function fetchStockData(ticker, companyName = '') {
  // Clean the ticker (remove exchange prefix if present)
  let cleanTicker = ticker.includes(':') ? ticker.split(':')[1] : ticker;

  // Check cache first
  const cached = stockCache.get(cleanTicker) || stockCache.get(`${cleanTicker}_resolved`);
  if (cached && (Date.now() - cached.timestamp) < CACHE_TTL_MS) {
    console.log(`📈 Using cached stock data for "${cached.data.ticker}" ($${cached.data.price})`);
    return cached.data;
  }

  // Strategy 1: Try Alpha Vantage
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (apiKey) {
    const avResult = await fetchFromAlphaVantage(cleanTicker, apiKey);
    if (avResult && !avResult.error) {
      stockCache.set(cleanTicker, { data: avResult, timestamp: Date.now() });
      stockCache.set(`${ticker}_resolved`, { data: avResult, timestamp: Date.now() });
      return avResult;
    }
    console.warn(`⚠️  Alpha Vantage failed: ${avResult?.error || 'unknown'} — trying Yahoo Finance...`);
  }

  // Strategy 2: Fall back to Yahoo Finance (no API key needed, works on cloud)
  const yahooResult = await fetchFromYahoo(cleanTicker);
  if (yahooResult && !yahooResult.error) {
    stockCache.set(cleanTicker, { data: yahooResult, timestamp: Date.now() });
    stockCache.set(`${ticker}_resolved`, { data: yahooResult, timestamp: Date.now() });
    return yahooResult;
  }

  console.warn(`⚠️  Both Alpha Vantage and Yahoo Finance failed for "${cleanTicker}".`);
  return yahooResult || { error: 'All stock data sources failed' };
}

/**
 * Fetch from Alpha Vantage GLOBAL_QUOTE endpoint.
 */
async function fetchFromAlphaVantage(ticker, apiKey) {
  try {
    console.log(`📈 Trying Alpha Vantage for "${ticker}"...`);
    const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${apiKey}`);
    const data = await res.json();

    if (data['Note'] || data['Information']) {
      return { error: data['Note'] || data['Information'] };
    }

    const quote = data['Global Quote'];
    if (!quote || Object.keys(quote).length === 0) {
      return { error: `No quote found for ${ticker}` };
    }

    console.log(`✅ Alpha Vantage: ${ticker} @ $${quote['05. price']}`);
    return {
      ticker,
      price: parseFloat(quote['05. price']) || null,
      change: parseFloat(quote['09. change']) || null,
      changePercent: quote['10. change percent'] ? quote['10. change percent'].replace('%', '') : null,
      volume: parseInt(quote['06. volume']) || null,
      previousClose: parseFloat(quote['08. previous close']) || null,
      high: parseFloat(quote['03. high']) || null,
      low: parseFloat(quote['04. low']) || null,
      open: parseFloat(quote['02. open']) || null,
      marketCap: null, peRatio: null, eps: null,
      week52High: null, week52Low: null,
      sector: null, industry: null, description: null,
      dividendYield: null, beta: null,
    };
  } catch (err) {
    return { error: `Alpha Vantage error: ${err.message}` };
  }
}

/**
 * Fetch from Yahoo Finance v8 chart API (no API key needed).
 * Works reliably from cloud hosting (Render, Railway, etc.)
 */
async function fetchFromYahoo(ticker) {
  try {
    console.log(`📈 Trying Yahoo Finance for "${ticker}"...`);
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=1d&interval=1d`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });
    const data = await res.json();

    const result = data?.chart?.result?.[0];
    if (!result) {
      return { error: `Yahoo Finance: no data for ${ticker}` };
    }

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose;
    const change = prevClose ? (price - prevClose) : null;
    const changePercent = prevClose ? ((change / prevClose) * 100).toFixed(4) : null;

    console.log(`✅ Yahoo Finance: ${ticker} @ $${price}`);
    return {
      ticker: meta.symbol || ticker,
      price: price || null,
      change: change ? parseFloat(change.toFixed(2)) : null,
      changePercent: changePercent,
      volume: meta.regularMarketVolume || null,
      previousClose: prevClose || null,
      high: meta.regularMarketDayHigh || null,
      low: meta.regularMarketDayLow || null,
      open: meta.regularMarketOpen || null,
      marketCap: null, peRatio: null, eps: null,
      week52High: meta.fiftyTwoWeekHigh || null,
      week52Low: meta.fiftyTwoWeekLow || null,
      sector: null, industry: null, description: null,
      dividendYield: null, beta: null,
    };
  } catch (err) {
    return { error: `Yahoo Finance error: ${err.message}` };
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
--- Real-Time Financial Data ---
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
