// ============================================================
// Search History Sidebar Component
// ============================================================
// Shows recent searches with recommendation badges.
// Persisted in localStorage via useSearchHistory hook.
// ============================================================

import { motion } from 'framer-motion';
import { HiOutlineClock, HiOutlineTrash } from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';
import { formatTimeAgo } from '../utils/formatters';

export default function SearchHistory({ history, onSelect, onClear }) {
  const { theme } = useTheme();

  if (!history || history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`glass-card p-4 rounded-xl`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HiOutlineClock
            className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
          />
          <h3
            className={`text-sm font-semibold ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Recent Searches
          </h3>
        </div>
        <button
          onClick={onClear}
          className={`text-xs flex items-center gap-1 transition-colors ${
            theme === 'dark'
              ? 'text-gray-500 hover:text-red-400'
              : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <HiOutlineTrash size={14} />
          Clear
        </button>
      </div>

      <div className="space-y-1.5">
        {history.map((item, index) => (
          <motion.button
            key={`${item.company}-${index}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(item.company)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-colors ${
              theme === 'dark'
                ? 'hover:bg-white/5'
                : 'hover:bg-gray-100'
            }`}
          >
            <div>
              <p
                className={`text-sm font-medium ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                }`}
              >
                {item.company}
              </p>
              <p
                className={`text-xs ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {formatTimeAgo(item.timestamp)}
              </p>
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                item.recommendation === 'INVEST'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {item.recommendation}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
