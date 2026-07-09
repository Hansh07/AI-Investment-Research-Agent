// ============================================================
// Explanation Card Component
// ============================================================
// Shows the AI's detailed reasoning with an "Explain Like I'm 15"
// toggle that switches between expert and beginner explanations.
// ============================================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineLightBulb, HiOutlineAcademicCap } from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';

export default function ExplanationCard({ explanation, beginnerExplanation }) {
  const [isSimple, setIsSimple] = useState(false);
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          className={`text-lg font-semibold ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          {isSimple ? '🧒 Simple Explanation' : '📊 Analysis'}
        </h3>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsSimple(!isSimple)}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-300 ${
            isSimple
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : theme === 'dark'
              ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          {isSimple ? (
            <>
              <HiOutlineAcademicCap />
              Expert Mode
            </>
          ) : (
            <>
              <HiOutlineLightBulb />
              Explain Like I'm 15
            </>
          )}
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={isSimple ? 'simple' : 'expert'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`text-sm leading-relaxed ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}
        >
          {isSimple ? beginnerExplanation : explanation}
        </motion.p>
      </AnimatePresence>
    </motion.div>
  );
}
