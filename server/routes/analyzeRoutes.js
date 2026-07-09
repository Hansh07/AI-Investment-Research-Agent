// ============================================================
// API Routes
// ============================================================
// Defines the Express routes for the analysis API.
// Currently has one route: POST /api/analyze
// ============================================================

import { Router } from 'express';
import { handleAnalyze } from '../controllers/analyzeController.js';

export const analyzeRoutes = Router();

// POST /api/analyze — Analyze a company for investment potential
analyzeRoutes.post('/analyze', handleAnalyze);
