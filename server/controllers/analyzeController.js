// ============================================================
// Analyze Controller
// ============================================================
// Handles the /api/analyze endpoint logic:
//   1. Validates the incoming request
//   2. Calls the analysis service
//   3. Returns the result or an error
//
// Controllers are thin — they just connect routes to services.
// ============================================================

import { analyzeCompany } from '../services/analysisService.js';
import { validateCompanyInput } from '../utils/validator.js';

/**
 * POST /api/analyze
 * Request body: { company: "Apple" }
 * Response: { success: true, data: { ... analysis ... } }
 */
export async function handleAnalyze(req, res, next) {
  try {
    // Validate input
    const { company } = req.body;
    const validation = validateCompanyInput(company);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.message,
      });
    }

    console.log(`\n📊 New analysis request: "${validation.value}"`);

    // Run the full analysis pipeline
    const analysis = await analyzeCompany(validation.value);

    // Return successful response
    return res.json({
      success: true,
      data: analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Pass errors to the global error handler
    console.error(`❌ Analysis failed: ${error.message}`);
    next(error);
  }
}
