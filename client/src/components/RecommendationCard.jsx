// ============================================================
// Recommendation Card Component
// ============================================================
// Large, prominent card showing INVEST or PASS with
// confidence percentage and animated entrance.
// ============================================================

import { motion } from 'framer-motion';
import AnimatedCounter from './AnimatedCounter';
import { useTheme } from '../hooks/useTheme';

export default function RecommendationCard({ recommendation, confidence }) {
  const isInvest = recommendation === 'INVEST';
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className={`relative overflow-hidden rounded-2xl p-8 text-center ${
        isInvest ? 'badge-invest' : 'badge-pass'
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <div className="relative z-10">
        <p className="text-white/70 text-sm font-medium mb-2 uppercase tracking-wider">
          Recommendation
        </p>
        <motion.h2
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-5xl font-display font-bold text-white mb-4"
        >
          {recommendation}
        </motion.h2>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
          <span className="text-white/80 text-sm">Confidence:</span>
          <span className="text-white text-lg font-bold">
            <AnimatedCounter target={confidence} suffix="%" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
