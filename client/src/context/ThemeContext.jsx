// ============================================================
// Theme Context
// ============================================================
// Provides dark/light mode toggle across the entire app.
// Persists the user's preference in localStorage.
// ============================================================

import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved preference, default to dark
    const saved = localStorage.getItem('investiq-theme');
    return saved || 'dark';
  });

  useEffect(() => {
    // Apply theme class to body element
    document.body.className = theme;
    localStorage.setItem('investiq-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
