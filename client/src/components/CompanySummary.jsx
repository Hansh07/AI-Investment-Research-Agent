// ============================================================
// Company Summary Component
// ============================================================
// Displays the company's business overview and detailed
// sub-scores for financial health, growth, market position,
// and innovation as animated progress bars.
// ============================================================

import { motion } from 'framer-motion';
import { getScoreColor } from '../utils/formatters';
import { useTheme } from '../hooks/useTheme';

export default function CompanySummary({ data }) {
  const { theme } = useTheme();

  const metrics = [
    { label: 'Financial Health', value: data.financialHealth, color: 'bg-emerald-500' },
    { label: 'Growth', value: data.growth, color: 'bg-blue-500' },
    { label: 'Market Position', value: data.marketPosition, color: 'bg-purple-500' },
    { label: 'Innovation', value: data.innovation, color: 'bg-pink-500' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card p-6"
    >
      <h3
        className={`text-lg font-semibold mb-4 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Company Overview
      </h3>

      <p
        className={`text-sm leading-relaxed mb-6 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}
      >
        {data.summary}
      </p>

      {/* Sub-score bars */}
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={metric.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span
                className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                {metric.label}
              </span>
              <span className={`text-sm font-bold ${getScoreColor(metric.value)}`}>
                {metric.value}/100
              </span>
            </div>
            <div
              className={`h-2.5 rounded-full overflow-hidden ${
                theme === 'dark' ? 'bg-white/5' : 'bg-gray-200'
              }`}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${metric.value}%` }}
                transition={{ duration: 1.5, delay: 0.5 + index * 0.15, ease: 'easeOut' }}
                className={`h-full rounded-full ${metric.color}`}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
