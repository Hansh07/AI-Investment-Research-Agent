// ============================================================
// InvestIQ AI — Express Server Entry Point
// ============================================================
// This is the main server file. It sets up Express with:
// - CORS for cross-origin requests from the React frontend
// - JSON body parsing
// - Rate limiting to prevent API abuse
// - Error handling middleware
// - API routes for company analysis
// ============================================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeRoutes } from './routes/analyzeRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
// Allow requests from the frontend client(s)
const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(',') 
  : '*';

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Apply rate limiting to API routes (10 requests per minute)
app.use('/api', apiLimiter);

// ── Routes ──────────────────────────────────────────────────
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InvestIQ AI server is running' });
});

// Company analysis routes
app.use('/api', analyzeRoutes);

// ── Error Handling ──────────────────────────────────────────
// Global error handler (must be registered last)
app.use(errorHandler);

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 InvestIQ AI server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/analyze\n`);
});
