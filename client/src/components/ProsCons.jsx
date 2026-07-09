// ============================================================
// Pros & Cons Component
// ============================================================
// Side-by-side display of investment pros and cons
// with icons and stagger animations.
// ============================================================

import { motion } from 'framer-motion';
import { HiOutlineCheckCircle, HiOutlineXCircle } from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';

export default function ProsCons({ pros, cons }) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-6"
    >
      <h3
        className={`text-lg font-semibold mb-5 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Pros & Cons
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pros */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineCheckCircle className="text-emerald-400 text-lg" />
            <span
              className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
              }`}
            >
              Strengths
            </span>
          </div>
          <ul className="space-y-2.5">
            {pros.map((pro, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className={`flex items-start gap-2.5 text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">✦</span>
                {pro}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineXCircle className="text-red-400 text-lg" />
            <span
              className={`text-sm font-semibold ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`}
            >
              Weaknesses
            </span>
          </div>
          <ul className="space-y-2.5">
            {cons.map((con, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className={`flex items-start gap-2.5 text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                <span className="text-red-400 mt-0.5 flex-shrink-0">✦</span>
                {con}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
