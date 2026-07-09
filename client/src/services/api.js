// ============================================================
// API Service
// ============================================================
// Axios instance configured with the backend base URL.
// Provides a clean interface for making API calls.
// ============================================================

import axios from 'axios';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 120000, // 2 minutes — AI analysis can take a while
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Analyze a company for investment potential.
 * @param {string} company - The company name
 * @returns {Promise<object>} - Analysis result
 */
export async function analyzeCompanyAPI(company) {
  const response = await api.post('/analyze', { company });
  return response.data;
}

/**
 * Health check for the backend server.
 * @returns {Promise<object>} - Server status
 */
export async function healthCheck() {
  const response = await api.get('/health');
  return response.data;
}

export default api;
