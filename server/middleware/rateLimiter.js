// ============================================================
// Rate Limiter Middleware
// ============================================================
// Prevents API abuse by limiting each IP to 10 requests per minute.
// This is important because each request triggers:
//   1. A Tavily search (costs money per search)
//   2. A Groq LLM call (has rate limits on free tier)
// ============================================================

import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10,             // Max 10 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please wait a minute before trying again.',
  },
});
