// ============================================================
// Navbar Component
// ============================================================
// Sticky glass-morphism navigation bar with:
// - Logo and brand name
// - Navigation links (smooth scroll on landing page)
// - Theme toggle
// - CTA button
// ============================================================

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { FiGithub } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../hooks/useTheme';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { theme } = useTheme();
  const isLanding = location.pathname === '/';

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Demo', href: '#demo' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

  const handleNavClick = (href) => {
    setMobileOpen(false);
    if (isLanding && href.startsWith('#')) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass-nav"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-neon-blue group-hover:shadow-neon-purple transition-shadow duration-300">
              <RiRobot2Line className="text-white text-lg" />
            </div>
            <span className="text-xl font-display font-bold gradient-text">
              InvestIQ AI
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {isLanding &&
              navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {link.label}
                </button>
              ))}

            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm font-medium transition-colors duration-200 ${
                theme === 'dark'
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiGithub className="text-lg" />
            </a>

            <ThemeToggle />

            <Link
              to="/analyze"
              className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-neon-blue hover:shadow-neon-purple"
            >
              Analyze Company
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {mobileOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${
              theme === 'dark'
                ? 'border-white/10 bg-navy-900/95'
                : 'border-gray-200 bg-white/95'
            } backdrop-blur-xl`}
          >
            <div className="px-4 py-4 space-y-3">
              {isLanding &&
                navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.href)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                      theme === 'dark'
                        ? 'text-gray-300 hover:bg-white/5'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              <Link
                to="/analyze"
                onClick={() => setMobileOpen(false)}
                className="block w-full text-center px-4 py-2.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"
              >
                Analyze Company
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
