// ============================================================
// useSearchHistory Hook
// ============================================================
// Manages search history in localStorage.
// Stores the last 10 searches with timestamps.
// ============================================================

import { useState, useCallback } from 'react';

const STORAGE_KEY = 'investiq-search-history';
const MAX_HISTORY = 10;

export function useSearchHistory() {
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Add a new search to history
  const addToHistory = useCallback((company, recommendation) => {
    setHistory((prev) => {
      // Remove duplicate if exists
      const filtered = prev.filter(
        (item) => item.company.toLowerCase() !== company.toLowerCase()
      );

      // Add new entry at the top
      const newHistory = [
        {
          company,
          recommendation,
          timestamp: new Date().toISOString(),
        },
        ...filtered,
      ].slice(0, MAX_HISTORY);

      // Persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  // Clear all history
  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
