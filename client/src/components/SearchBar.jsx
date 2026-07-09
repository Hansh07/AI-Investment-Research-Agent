// ============================================================
// Search Bar Component
// ============================================================
// Glass-styled company search input with:
// - Animated focus ring
// - Submit button with gradient
// - Recent searches dropdown trigger
// ============================================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineSparkles } from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';

export default function SearchBar({ onAnalyze, loading, history, onSelectHistory }) {
  const [company, setCompany] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (company.trim() && !loading) {
      onAnalyze(company.trim());
      setShowHistory(false);
    }
  };

  const handleHistorySelect = (name) => {
    setCompany(name);
    setShowHistory(false);
    if (onSelectHistory) {
      onSelectHistory(name);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div
          className={`relative flex items-center gap-2 p-2 rounded-2xl border transition-all duration-300 ${
            theme === 'dark'
              ? 'bg-navy-800/80 border-white/10 focus-within:border-blue-500/50 focus-within:shadow-neon-blue'
              : 'bg-white border-gray-200 focus-within:border-blue-500/50 focus-within:shadow-lg'
          }`}
        >
          <HiOutlineSearch
            className={`ml-4 text-xl flex-shrink-0 ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}
          />

          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            onFocus={() => history?.length > 0 && setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            placeholder="Enter a company name (e.g., Apple, Tesla, NVIDIA)..."
            disabled={loading}
            className={`flex-1 py-3 px-2 text-base bg-transparent outline-none placeholder:text-gray-500 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          />

          <motion.button
            type="submit"
            disabled={!company.trim() || loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-neon-blue"
          >
            <HiOutlineSparkles />
            {loading ? 'Analyzing...' : 'Analyze'}
          </motion.button>
        </div>
      </motion.form>

      {/* Search History Dropdown */}
      {showHistory && history && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`absolute left-0 right-0 mt-2 rounded-xl border overflow-hidden z-20 ${
            theme === 'dark'
              ? 'bg-navy-800 border-white/10'
              : 'bg-white border-gray-200 shadow-lg'
          }`}
        >
          <div className="p-2">
            <p
              className={`text-xs font-medium px-3 py-1.5 ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              Recent Searches
            </p>
            {history.slice(0, 5).map((item) => (
              <button
                key={item.company}
                onMouseDown={() => handleHistorySelect(item.company)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-300 hover:bg-white/5'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{item.company}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    item.recommendation === 'INVEST'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {item.recommendation}
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
