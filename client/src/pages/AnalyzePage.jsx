// ============================================================
// Analyze Page
// ============================================================
// The main application page where users:
// 1. Enter a company name
// 2. See the loading experience
// 3. View the analysis dashboard
//
// Also includes a sidebar with search history.
// ============================================================

import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import SearchBar from '../components/SearchBar';
import LoadingExperience from '../components/LoadingExperience';
import AnalysisDashboard from '../components/AnalysisDashboard';
import SearchHistory from '../components/SearchHistory';
import ErrorState from '../components/ErrorState';
import { useAnalysis } from '../hooks/useAnalysis';
import { useSearchHistory } from '../hooks/useSearchHistory';
import { useTheme } from '../hooks/useTheme';

export default function AnalyzePage() {
  const { data, loading, error, currentStep, loadingSteps, analyze, reset } = useAnalysis();
  const { history, addToHistory, clearHistory } = useSearchHistory();
  const { theme } = useTheme();

  // When analysis completes, add to search history
  useEffect(() => {
    if (data) {
      addToHistory(data.company, data.recommendation);
    }
  }, [data, addToHistory]);

  const handleAnalyze = (company) => {
    reset();
    analyze(company);
  };

  return (
    <main className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1
            className={`text-3xl sm:text-4xl font-display font-bold mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}
          >
            Analyze a <span className="gradient-text">Company</span>
          </h1>
          <p
            className={`text-base max-w-xl mx-auto ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Enter a company name below and our AI agent will research and analyze it for investment potential.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar
            onAnalyze={handleAnalyze}
            loading={loading}
            history={history}
            onSelectHistory={handleAnalyze}
          />
        </div>

        {/* Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {loading && (
                <LoadingExperience
                  key="loading"
                  currentStep={currentStep}
                  steps={loadingSteps}
                />
              )}

              {error && !loading && (
                <ErrorState
                  key="error"
                  message={error}
                  onRetry={() => reset()}
                />
              )}

              {data && !loading && (
                <AnalysisDashboard key="dashboard" data={data} />
              )}
            </AnimatePresence>

            {/* Empty state */}
            {!loading && !error && !data && (
              <div className="flex flex-col items-center justify-center py-20">
                <div
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${
                    theme === 'dark' ? 'bg-white/5' : 'bg-gray-100'
                  }`}
                >
                  <span className="text-4xl">🔍</span>
                </div>
                <p
                  className={`text-lg font-medium mb-2 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  Ready to analyze
                </p>
                <p
                  className={`text-sm ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}
                >
                  Enter a company name above to get started
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: Search History */}
          {history.length > 0 && !loading && (
            <div className="lg:w-72 flex-shrink-0">
              <SearchHistory
                history={history}
                onSelect={handleAnalyze}
                onClear={clearHistory}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
