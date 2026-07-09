// ============================================================
// News Timeline Component
// ============================================================
// Displays recent company news/events in a timeline format.
// ============================================================

import { motion } from 'framer-motion';
import { HiOutlineNewspaper } from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';

export default function NewsTimeline({ news }) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <HiOutlineNewspaper
          className={`text-lg ${
            theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
          }`}
        />
        <h3
          className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          Recent News & Developments
        </h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div
          className={`absolute left-3 top-2 bottom-2 w-px ${
            theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
          }`}
        />

        <div className="space-y-4">
          {news.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex gap-4 pl-1"
            >
              {/* Dot */}
              <div
                className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center border-2 ${
                  theme === 'dark'
                    ? 'border-blue-500/50 bg-navy-900'
                    : 'border-blue-400 bg-white'
                }`}
              >
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              </div>

              {/* Content */}
              <p
                className={`text-sm leading-relaxed pb-2 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              >
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
