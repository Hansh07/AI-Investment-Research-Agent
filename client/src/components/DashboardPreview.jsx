// ============================================================
// Dashboard Preview Component
// ============================================================
// A mock preview of the analysis dashboard shown on the
// landing page to give users a taste of the product.
// ============================================================

import { motion } from 'framer-motion';
import { useTheme } from '../hooks/useTheme';

export default function DashboardPreview() {
  const { theme } = useTheme();

  return (
    <section id="demo" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2
            className={`text-3xl sm:text-4xl font-display font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            See It In <span className="gradient-text">Action</span>
          </h2>
          <p
            className={`text-lg max-w-xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            A comprehensive investment analysis dashboard, powered by AI.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative"
        >
          {/* Glow effect behind the card */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl rounded-3xl" />

          <div
            className={`relative glass-card overflow-hidden shadow-glass-lg ${
              theme === 'dark' ? 'border-white/10' : 'border-gray-200'
            }`}
          >
            {/* Browser Chrome */}
            <div
              className={`flex items-center gap-2 px-4 py-3 border-b ${
                theme === 'dark' ? 'border-white/5' : 'border-gray-200'
              }`}
            >
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div
                className={`flex-1 text-center text-xs font-mono ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                investiq.ai/analyze
              </div>
            </div>

            {/* Mock Dashboard Content */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Recommendation Card */}
                <div className="sm:col-span-1 badge-invest rounded-xl p-5 text-center">
                  <p className="text-white/80 text-xs font-medium mb-1">Recommendation</p>
                  <p className="text-white text-2xl font-bold">INVEST</p>
                </div>

                {/* Score Card */}
                <div
                  className={`rounded-xl p-5 text-center border ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <p
                    className={`text-xs font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Overall Score
                  </p>
                  <p className="text-emerald-400 text-2xl font-bold">89/100</p>
                </div>

                {/* Confidence Card */}
                <div
                  className={`rounded-xl p-5 text-center border ${
                    theme === 'dark'
                      ? 'bg-white/5 border-white/10'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <p
                    className={`text-xs font-medium mb-1 ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Confidence
                  </p>
                  <p className="text-blue-400 text-2xl font-bold">87%</p>
                </div>
              </div>

              {/* Mock score bars */}
              <div className="space-y-3">
                {[
                  { label: 'Financial Health', width: '85%', color: 'bg-emerald-500' },
                  { label: 'Growth', width: '78%', color: 'bg-blue-500' },
                  { label: 'Market Position', width: '92%', color: 'bg-purple-500' },
                  { label: 'Innovation', width: '88%', color: 'bg-pink-500' },
                ].map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between mb-1">
                      <span
                        className={`text-xs font-medium ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        {bar.label}
                      </span>
                      <span
                        className={`text-xs font-mono ${
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        }`}
                      >
                        {bar.width.replace('%', '')}/100
                      </span>
                    </div>
                    <div
                      className={`h-2 rounded-full overflow-hidden ${
                        theme === 'dark' ? 'bg-white/5' : 'bg-gray-200'
                      }`}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: bar.width }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className={`h-full rounded-full ${bar.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
