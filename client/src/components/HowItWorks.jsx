// ============================================================
// How It Works Component
// ============================================================
// 4-step vertical timeline showing the analysis workflow.
// Animated with Framer Motion when scrolled into view.
// ============================================================

import { motion } from 'framer-motion';
import {
  HiOutlineSearch,
  HiOutlineDatabase,
  HiOutlineCog,
  HiOutlineCheckCircle,
} from 'react-icons/hi';
import { useTheme } from '../hooks/useTheme';

const steps = [
  {
    icon: HiOutlineSearch,
    title: 'Enter Company',
    description: 'Type any company name into the search bar — from Apple to startups.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: HiOutlineDatabase,
    title: 'AI Researches',
    description: 'Our AI agent searches the web in real-time for financial data, news, and market info.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: HiOutlineCog,
    title: 'Deep Analysis',
    description: 'The LLM analyzes all gathered data across 8 key investment criteria.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: HiOutlineCheckCircle,
    title: 'Get Recommendation',
    description: 'Receive a detailed INVEST or PASS recommendation with scores, pros, cons, and reasoning.',
    color: 'from-emerald-500 to-teal-500',
  },
];

export default function HowItWorks() {
  const { theme } = useTheme();

  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            How It <span className="gradient-text">Works</span>
          </h2>
          <p
            className={`text-lg max-w-xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Four simple steps from company name to investment recommendation.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className={`absolute left-8 top-0 bottom-0 w-px ${
              theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'
            }`}
          />

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="relative flex gap-6 pl-4"
              >
                {/* Step Number + Icon */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center z-10 relative shadow-lg`}
                  >
                    <step.icon className="text-white text-base" />
                  </div>
                </div>

                {/* Content */}
                <div
                  className={`glass-card p-5 flex-grow hover:border-blue-500/20 transition-colors duration-300`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        theme === 'dark'
                          ? 'bg-white/10 text-gray-400'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      Step {index + 1}
                    </span>
                    <h3
                      className={`text-lg font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>
                  <p
                    className={`text-sm leading-relaxed ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
