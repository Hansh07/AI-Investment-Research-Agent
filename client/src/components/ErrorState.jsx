// ============================================================
// Error State Component
// ============================================================
// Displays a user-friendly error message with a retry button.
// Used when API calls fail or companies can't be found.
// ============================================================

import { motion } from 'framer-motion';
import { HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';

export default function ErrorState({ message, onRetry }) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6"
      >
        <HiOutlineExclamationCircle className="text-red-400 text-4xl" />
      </motion.div>

      <h3
        className={`text-xl font-semibold mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}
      >
        Something went wrong
      </h3>

      <p
        className={`text-sm text-center max-w-md mb-8 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        {message || 'An unexpected error occurred. Please try again.'}
      </p>

      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRetry}
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-neon-blue"
        >
          <HiOutlineRefresh className="text-lg" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
}
