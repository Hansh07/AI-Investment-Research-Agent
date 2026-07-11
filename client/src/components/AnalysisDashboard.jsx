// ============================================================
// Analysis Dashboard Component
// ============================================================
// Main dashboard container that assembles all analysis
// sub-components into a cohesive layout.
// ============================================================

import { motion } from 'framer-motion';
import RecommendationCard from './RecommendationCard';
import ScoreCard from './ScoreCard';
import RiskMeter from './RiskMeter';
import ConfidenceMeter from './ConfidenceMeter';
import CompanySummary from './CompanySummary';
import ProsCons from './ProsCons';
import NewsTimeline from './NewsTimeline';
import ExplanationCard from './ExplanationCard';
import ScoreCharts from './ScoreCharts';
import ReportActions from './ReportActions';
import TradingViewWidget from './TradingViewWidget';
import StockQuote from './StockQuote';
import { useTheme } from '../hooks/useTheme';

export default function AnalysisDashboard({ data }) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-6xl mx-auto"
    >
      {/* Company Name Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2
          className={`text-3xl sm:text-4xl font-display font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {data.company}
        </h2>
        <p
          className={`text-sm ${
            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
          }`}
        >
          AI-generated investment analysis · {new Date().toLocaleDateString()}
        </p>
      </motion.div>

      {/* Top Row: Recommendation + Score + Risk + Confidence */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="sm:col-span-2 lg:col-span-1">
          <RecommendationCard
            recommendation={data.recommendation}
            confidence={data.confidence}
          />
        </div>
        <ScoreCard score={data.overallScore} />
        <RiskMeter risk={data.risk} />
        <ConfidenceMeter confidence={data.confidence} />
      </div>

      {/* Stock Quote — Real-Time Market Data */}
      {data.stockData && (
        <div className="mb-6">
          <StockQuote stockData={data.stockData} />
        </div>
      )}

      {/* Middle Row: Summary + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <CompanySummary data={data} />
        <ProsCons pros={data.pros} cons={data.cons} />
      </div>

      {/* Real-time TradingView Chart */}
      <div className="mb-6 glass-card p-6">
        <h3
          className={`text-lg font-semibold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          📈 Real-Time Market Chart ({data.ticker})
        </h3>
        <TradingViewWidget symbol={data.ticker} />
      </div>

      {/* Charts */}
      <div className="mb-6">
        <ScoreCharts data={data} />
      </div>

      {/* Bottom Row: Explanation + News */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ExplanationCard
          explanation={data.explanation}
          beginnerExplanation={data.beginnerExplanation}
        />
        <NewsTimeline news={data.news} />
      </div>

      {/* Report Actions */}
      <div className="flex justify-center">
        <ReportActions data={data} />
      </div>
    </motion.div>
  );
}
