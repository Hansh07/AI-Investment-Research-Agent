// ============================================================
// Stock Quote Component
// ============================================================
// Displays real-time stock market data from Alpha Vantage:
//   - Current price and daily change
//   - Market cap, P/E ratio, EPS
//   - 52-week range with visual bar
//   - Volume and sector info
// ============================================================

import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export default function StockQuote({ stockData }) {
  const { theme } = useTheme();

  if (!stockData || stockData.error || !stockData.price) return null;

  const isPositive = stockData.change >= 0;

  // Detect if this is a non-US stock (e.g., TCS.BSE, RELIANCE.NSE)
  const isInternational = stockData.ticker && (stockData.ticker.includes('.') || stockData.ticker.includes(':'));
  const currencySymbol = isInternational && (stockData.ticker.endsWith('.BSE') || stockData.ticker.endsWith('.NSE')) ? '₹' : '$';

  // Calculate position in 52-week range (0-100%)
  const rangePercent =
    stockData.week52High && stockData.week52Low && stockData.price
      ? ((stockData.price - stockData.week52Low) / (stockData.week52High - stockData.week52Low)) * 100
      : 50;

  const formatPrice = (n) => (n != null ? `${currencySymbol}${Number(n).toFixed(2)}` : 'N/A');
  const formatLargeNum = (n) => {
    if (!n) return 'N/A';
    const num = parseInt(n);
    if (num >= 1e12) return `${currencySymbol}${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${currencySymbol}${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${currencySymbol}${(num / 1e6).toFixed(2)}M`;
    return `${currencySymbol}${num.toLocaleString()}`;
  };
  const formatVolume = (n) => {
    if (!n) return 'N/A';
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
    return n.toLocaleString();
  };

  const allMetrics = [
    { label: 'Market Cap', value: stockData.marketCap ? formatLargeNum(stockData.marketCap) : null },
    { label: 'P/E Ratio', value: stockData.peRatio || null },
    { label: 'EPS', value: stockData.eps ? `${currencySymbol}${stockData.eps.toFixed(2)}` : null },
    { label: 'Volume', value: stockData.volume ? formatVolume(stockData.volume) : null },
    { label: 'Beta', value: stockData.beta || null },
    { label: 'Div Yield', value: stockData.dividendYield ? `${(stockData.dividendYield * 100).toFixed(2)}%` : null },
  ];

  // Only show metrics that have real values
  const metrics = allMetrics.filter(m => m.value !== null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="glass-card p-6"
    >
      {/* Header: Ticker + Price */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
              }`}
            >
              {stockData.ticker}
            </span>
            {stockData.sector && (
              <span
                className={`text-xs px-2 py-0.5 rounded-md ${
                  theme === 'dark' ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {stockData.sector}
              </span>
            )}
          </div>
          <p
            className={`text-sm mt-1.5 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            Real-Time Market Data
          </p>
        </div>
        <div className="text-right">
          <p
            className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            {formatPrice(stockData.price)}
          </p>
          <p
            className={`text-sm font-semibold ${
              isPositive ? 'text-emerald-500' : 'text-red-500'
            }`}
          >
            {isPositive ? '+' : ''}
            {stockData.change != null ? `${currencySymbol}${stockData.change.toFixed(2)}` : ''}{' '}
            ({isPositive ? '+' : ''}
            {stockData.changePercent || '0'}%)
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`text-center p-2.5 rounded-xl ${
              theme === 'dark' ? 'bg-white/5' : 'bg-gray-50'
            }`}
          >
            <p
              className={`text-xs mb-1 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              {m.label}
            </p>
            <p
              className={`text-sm font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* 52-Week Range */}
      {stockData.week52Low != null && stockData.week52High != null && (
        <div>
          <p
            className={`text-xs font-medium mb-2 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            52-Week Range
          </p>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {formatPrice(stockData.week52Low)}
            </span>
            <div className="flex-1 relative">
              <div
                className={`h-2 rounded-full ${
                  theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
                }`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, rangePercent))}%` }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
              {/* Current price marker */}
              <motion.div
                initial={{ left: 0 }}
                animate={{ left: `${Math.min(100, Math.max(0, rangePercent))}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute -top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-md transform -translate-x-1/2"
                style={{ top: '-3px' }}
              />
            </div>
            <span
              className={`text-xs font-medium ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {formatPrice(stockData.week52High)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
