// ============================================================
// Score Charts Component
// ============================================================
// Recharts visualizations:
// - Radar chart for multi-dimensional scoring
// - Bar chart for score comparison
// ============================================================

import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useTheme } from '../hooks/useTheme';

export default function ScoreCharts({ data }) {
  const { theme } = useTheme();

  // Radar chart data
  const radarData = [
    { category: 'Financial', score: data.financialHealth },
    { category: 'Growth', score: data.growth },
    { category: 'Market', score: data.marketPosition },
    { category: 'Innovation', score: data.innovation },
    { category: 'Confidence', score: data.confidence },
  ];

  // Bar chart data
  const barData = [
    { name: 'Financial', score: data.financialHealth, color: '#10b981' },
    { name: 'Growth', score: data.growth, color: '#3b82f6' },
    { name: 'Market', score: data.marketPosition, color: '#8b5cf6' },
    { name: 'Innovation', score: data.innovation, color: '#ec4899' },
    { name: 'Overall', score: data.overallScore, color: '#f59e0b' },
  ];

  const textColor = theme === 'dark' ? '#9ca3af' : '#6b7280';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="glass-card p-6"
    >
      <h3
        className={`text-lg font-semibold mb-6 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Score Breakdown
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart */}
        <div>
          <p
            className={`text-sm font-medium mb-3 text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Performance Radar
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: textColor, fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: textColor, fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div>
          <p
            className={`text-sm font-medium mb-3 text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            Score Distribution
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis
                dataKey="name"
                tick={{ fill: textColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: textColor, fontSize: 12 }}
                axisLine={{ stroke: gridColor }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1a2540' : '#fff',
                  border: `1px solid ${theme === 'dark' ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: theme === 'dark' ? '#e2e8f0' : '#1e293b',
                }}
              />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
