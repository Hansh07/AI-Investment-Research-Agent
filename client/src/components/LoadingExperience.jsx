// ============================================================
// Loading Experience Component
// ============================================================
// Multi-step loading animation shown while the AI is working.
// Shows progress through 5 stages with smooth transitions.
// ============================================================

import { motion } from 'framer-motion';
import { HiOutlineCheck } from 'react-icons/hi';
import { RiRobot2Line } from 'react-icons/ri';
import { useTheme } from '../hooks/useTheme';

export default function LoadingExperience({ currentStep, steps }) {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-lg mx-auto py-20"
    >
      {/* AI Thinking Animation */}
      <div className="flex flex-col items-center mb-12">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-neon-purple mb-6"
        >
          <RiRobot2Line className="text-white text-3xl" />
        </motion.div>

        <h3
          className={`text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}
        >
          AI is analyzing...
        </h3>
        <p
          className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          This usually takes 15-30 seconds
        </p>
      </div>

      {/* Step Progress */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isComplete = index < currentStep;
          const isActive = index === currentStep;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-xl border transition-all duration-500 ${
                isActive
                  ? theme === 'dark'
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-blue-50 border-blue-200'
                  : isComplete
                  ? theme === 'dark'
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-emerald-50 border-emerald-200'
                  : theme === 'dark'
                  ? 'bg-white/[0.02] border-white/5'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              {/* Status Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isComplete
                    ? 'bg-emerald-500'
                    : isActive
                    ? 'bg-blue-500'
                    : theme === 'dark'
                    ? 'bg-white/10'
                    : 'bg-gray-200'
                }`}
              >
                {isComplete ? (
                  <HiOutlineCheck className="text-white text-sm" />
                ) : isActive ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <span
                    className={`text-xs font-medium ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-sm font-medium ${
                  isComplete
                    ? 'text-emerald-400'
                    : isActive
                    ? theme === 'dark'
                      ? 'text-blue-300'
                      : 'text-blue-600'
                    : theme === 'dark'
                    ? 'text-gray-500'
                    : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
