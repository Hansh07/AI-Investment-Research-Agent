// ============================================================
// Footer Component
// ============================================================
// Clean footer with branding, links, and disclaimer.
// ============================================================

import { RiRobot2Line } from 'react-icons/ri';
import { FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer
      className={`border-t ${
        theme === 'dark'
          ? 'border-white/5 bg-navy-900/50'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <RiRobot2Line className="text-white text-sm" />
              </div>
              <span className="text-lg font-display font-bold gradient-text">
                InvestIQ AI
              </span>
            </div>
            <p
              className={`text-sm max-w-md ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              AI-powered investment research that analyzes companies using real-time
              data and delivers professional recommendations with confidence scoring.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4
              className={`text-sm font-semibold mb-4 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              Product
            </h4>
            <ul className="space-y-2">
              {['Features', 'How It Works', 'Pricing', 'API'].map((item) => (
                <li key={item}>
                  <span
                    className={`text-sm cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4
              className={`text-sm font-semibold mb-4 ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
              }`}
            >
              Company
            </h4>
            <ul className="space-y-2">
              {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                <li key={item}>
                  <span
                    className={`text-sm cursor-pointer transition-colors ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between mt-12 pt-8 border-t ${
            theme === 'dark' ? 'border-white/5' : 'border-gray-200'
          }`}
        >
          <p
            className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
            }`}
          >
            © {new Date().getFullYear()} InvestIQ AI. For educational purposes only. Not
            financial advice.
          </p>

          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            {[FiGithub, FiTwitter, FiLinkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className={`transition-colors ${
                  theme === 'dark'
                    ? 'text-gray-500 hover:text-white'
                    : 'text-gray-400 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
