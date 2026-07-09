// ============================================================
// Score Card Component
// ============================================================
// Displays the overall score with an animated circular gauge.
// ============================================================

import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { getScoreColor, getScoreLabel } from '../utils/formatters';
import { useTheme } from '../hooks/useTheme';

export default function ScoreCard({ score }) {
  const { theme } = useTheme();
  const colorClass = getScoreColor(score);
  const label = getScoreLabel(score);

  // SVG circle gauge parameters
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card p-6 flex flex-col items-center justify-center"
    >
      <p
        className={`text-sm font-medium mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        Overall Score
      </p>

      {/* Circular Gauge */}
      <div className="relative w-32 h-32 mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            strokeWidth="8"
          />
          {/* Animated progress circle */}
          <motion.circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="url(#scoreGradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${colorClass}`}>
            <AnimatedCounter target={score} />
          </span>
          <span
            className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            / 100
          </span>
        </div>
      </div>

      <span
        className={`text-sm font-semibold ${colorClass}`}
      >
        {label}
      </span>
    </motion.div>
  );
}
