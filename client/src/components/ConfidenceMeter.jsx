// ============================================================
// Confidence Meter Component
// ============================================================
// Animated circular confidence gauge.
// ============================================================

import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { useTheme } from '../hooks/useTheme';

export default function ConfidenceMeter({ confidence }) {
  const { theme } = useTheme();

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  const getColor = () => {
    if (confidence >= 80) return '#10b981';
    if (confidence >= 60) return '#3b82f6';
    if (confidence >= 40) return '#eab308';
    return '#ef4444';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass-card p-6 flex flex-col items-center justify-center"
    >
      <p
        className={`text-sm font-medium mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        AI Confidence
      </p>

      <div className="relative w-24 h-24 mb-3">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}
            strokeWidth="6"
          />
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 2, ease: 'easeOut' }}
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={`text-xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            <AnimatedCounter target={confidence} suffix="%" />
          </span>
        </div>
      </div>

      <span
        className={`text-xs ${
          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}
      >
        Based on data quality
      </span>
    </motion.div>
  );
}
