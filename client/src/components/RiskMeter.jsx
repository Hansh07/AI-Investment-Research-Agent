// ============================================================
// Risk Meter Component
// ============================================================
// Visual risk level indicator (Low / Medium / High)
// with a gauge-style display.
// ============================================================

import { motion } from 'framer-motion';
import { HiOutlineShieldCheck, HiOutlineShieldExclamation, HiOutlineExclamation } from 'react-icons/hi';
import { getRiskColors } from '../utils/formatters';
import { useTheme } from '../hooks/useTheme';

export default function RiskMeter({ risk }) {
  const { theme } = useTheme();
  const colors = getRiskColors(risk);
  const riskLevels = ['Low', 'Medium', 'High'];
  const activeIndex = riskLevels.indexOf(risk);

  const Icon =
    risk === 'Low'
      ? HiOutlineShieldCheck
      : risk === 'High'
      ? HiOutlineExclamation
      : HiOutlineShieldExclamation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card p-6 flex flex-col items-center justify-center"
    >
      <p
        className={`text-sm font-medium mb-4 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}
      >
        Risk Level
      </p>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: 'spring' }}
        className={`w-16 h-16 rounded-2xl ${colors.bg} flex items-center justify-center mb-3`}
      >
        <Icon className={`text-2xl ${colors.text}`} />
      </motion.div>

      <p className={`text-2xl font-bold mb-3 ${colors.text}`}>{risk}</p>

      {/* Risk bar */}
      <div className="flex gap-1.5 w-full max-w-[120px]">
        {riskLevels.map((level, i) => (
          <motion.div
            key={level}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className={`h-2 flex-1 rounded-full ${
              i <= activeIndex
                ? i === 0
                  ? 'bg-emerald-500'
                  : i === 1
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
                : theme === 'dark'
                ? 'bg-white/10'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
