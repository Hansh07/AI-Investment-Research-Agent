// ============================================================
// useAnalysis Hook
// ============================================================
// Manages the entire analysis lifecycle:
// - API call state (loading, error, data)
// - Loading step progression for the loading experience
// - Error handling with user-friendly messages
// ============================================================

import { useState, useCallback, useRef } from 'react';
import { analyzeCompanyAPI } from '../services/api';

// Loading steps shown to the user during analysis
const LOADING_STEPS = [
  { label: 'Searching company information...', duration: 2000 },
  { label: 'Analyzing financial data...', duration: 3000 },
  { label: 'Reading latest news...', duration: 2500 },
  { label: 'Generating recommendation...', duration: 3000 },
  { label: 'Finalizing report...', duration: 1500 },
];

export function useAnalysis() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef(null);

  // Start the loading step animation
  const startLoadingSteps = useCallback(() => {
    let step = 0;
    setCurrentStep(0);

    intervalRef.current = setInterval(() => {
      step += 1;
      if (step < LOADING_STEPS.length) {
        setCurrentStep(step);
      } else {
        clearInterval(intervalRef.current);
      }
    }, 2500);
  }, []);

  // Stop the loading animation
  const stopLoadingSteps = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Main analysis function
  const analyze = useCallback(async (company) => {
    setLoading(true);
    setError(null);
    setData(null);
    startLoadingSteps();

    try {
      const result = await analyzeCompanyAPI(company);

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      // Extract a user-friendly error message
      const message =
        err.response?.data?.error ||
        err.message ||
        'Something went wrong. Please check your connection and try again.';
      setError(message);
    } finally {
      stopLoadingSteps();
      setLoading(false);
    }
  }, [startLoadingSteps, stopLoadingSteps]);

  // Reset everything
  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    setCurrentStep(0);
    stopLoadingSteps();
  }, [stopLoadingSteps]);

  return {
    data,
    loading,
    error,
    currentStep,
    loadingSteps: LOADING_STEPS,
    analyze,
    reset,
  };
}
