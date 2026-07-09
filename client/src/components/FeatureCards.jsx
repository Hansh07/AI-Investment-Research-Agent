// ============================================================
// Feature Cards Component
// ============================================================
// Displays 6 feature cards in a responsive grid with
// glassmorphism styling and hover animations.
// ============================================================

import { motion } from 'framer-motion';
import {
  HiOutlineLightningBolt,
  HiOutlineGlobeAlt,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineTrendingUp,
  HiOutlineSparkles,
} from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';

const features = [
  {
    icon: HiOutlineSparkles,
    title: 'AI Analysis',
    description: 'Advanced LLM-powered analysis of company fundamentals, financials, and market positioning.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: HiOutlineGlobeAlt,
    title: 'Real-Time Research',
    description: 'Live web search gathers the latest company data, news, and market developments in real time.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Investment Scoring',
    description: 'Comprehensive 0-100 scoring system across financial health, growth, innovation, and more.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: HiOutlineShieldCheck,
    title: 'Risk Detection',
    description: 'Identifies and categorizes investment risks from Low to High with detailed reasoning.',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    icon: HiOutlineTrendingUp,
    title: 'Confidence Score',
    description: 'Measures how confident the AI is in its recommendation based on data availability.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: HiOutlineLightningBolt,
    title: 'Instant Results',
    description: 'Get comprehensive investment analysis in under 30 seconds with our high-speed AI pipeline.',
    gradient: 'from-yellow-500 to-orange-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function FeatureCards() {
  const { theme } = useTheme();

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2
            className={`text-3xl sm:text-4xl font-display font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Everything You Need to{' '}
            <span className="gradient-text">Make Smart Decisions</span>
          </h2>
          <p
            className={`text-lg max-w-2xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Our AI agent combines real-time search with advanced analysis to give you
            actionable investment insights.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className={`glass-card p-6 cursor-default group hover:border-blue-500/20 transition-all duration-300 glow-hover`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="text-white text-xl" />
              </div>
              <h3
                className={`text-lg font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                {feature.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
