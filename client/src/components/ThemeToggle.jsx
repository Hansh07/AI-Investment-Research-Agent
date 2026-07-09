// ============================================================
// Theme Toggle Component
// ============================================================
// Animated dark/light mode toggle button.
// ============================================================

import { motion } from 'framer-motion';
import { HiOutlineSun, HiOutlineMoon } from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-colors duration-200 ${
        theme === 'dark'
          ? 'text-yellow-400 hover:bg-white/10'
          : 'text-indigo-600 hover:bg-gray-200'
      }`}
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
      </motion.div>
    </motion.button>
  );
}
