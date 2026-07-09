// ============================================================
// App — Root Component
// ============================================================
// Sets up React Router with two routes:
// - / (Landing Page)
// - /analyze (Analysis Page)
// Wraps everything in ThemeProvider for dark/light mode.
// ============================================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}
