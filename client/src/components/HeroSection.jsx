// ============================================================
// Hero Section Component
// ============================================================
// The main hero area of the landing page with:
// - Animated gradient blobs in the background
// - Large heading with gradient text
// - Description text
// - CTA buttons (Analyze Now + Watch Demo)
// ============================================================

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlinePlay } from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';

export default function HeroSection() {
  const { theme } = useTheme();

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Gradient Blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* Grid overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
            Powered by AI Research Agent
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
        >
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            AI-Powered{' '}
          </span>
          <span className="gradient-text">Investment</span>
          <br />
          <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
            Research
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          Enter any company name and let our AI research agent analyze financials,
          market position, risks, and opportunities — delivering professional
          investment insights in seconds.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            to="/analyze"
            className="group flex items-center gap-2 px-8 py-3.5 text-base font-semibold text-white rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-neon-blue hover:shadow-neon-purple"
          >
            Analyze Now
            <HiOutlineArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <button
            onClick={() => {
              const el = document.querySelector('#demo');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex items-center gap-2 px-8 py-3.5 text-base font-semibold rounded-xl border transition-all duration-300 ${
              theme === 'dark'
                ? 'text-gray-300 border-white/10 hover:bg-white/5'
                : 'text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            <HiOutlinePlay className="text-lg" />
            Watch Demo
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className={`flex items-center justify-center gap-8 sm:gap-16 mt-16 pt-8 border-t ${
            theme === 'dark' ? 'border-white/5' : 'border-gray-200'
          }`}
        >
          {[
            { value: '50+', label: 'Companies Analyzed' },
            { value: '95%', label: 'Accuracy Rate' },
            { value: '<30s', label: 'Analysis Time' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </p>
              <p
                className={`text-xs sm:text-sm mt-1 ${
                  theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
