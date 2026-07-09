// ============================================================
// Global Error Handler Middleware
// ============================================================
// Catches any errors thrown in route handlers or middleware.
// Returns a friendly JSON error response instead of crashing.
// ============================================================

export const errorHandler = (err, req, res, _next) => {
  console.error('❌ Server Error:', err.message);

  // Determine status code (default to 500 if not set)
  const statusCode = err.statusCode || 500;

  // Build a user-friendly error response
  const response = {
    success: false,
    error: err.message || 'An unexpected error occurred',
  };

  // In development, include the stack trace for debugging
  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
