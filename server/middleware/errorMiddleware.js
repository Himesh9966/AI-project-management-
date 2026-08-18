/**
 * CONCEPTS USED:
 * - Centralized Error Handling
 * - Express Error Middleware (4 parameters)
 * - HTTP Status Codes
 * - Information Leak Prevention
 *
 * PURPOSE:
 * Catches unhandled synchronous and asynchronous errors across all routes.
 *
 * RESPONSIBILITY:
 * Formats errors into standardized JSON responses, logs diagnostic stack traces internally,
 * and prevents leaking sensitive secrets or stack traces to clients.
 */

const { sendError } = require('../utils/responseHelper');

/**
 * Global Error Handler Middleware
 * Note: Express requires all 4 parameters (err, req, res, next) to recognize it as error middleware.
 */
const errorMiddleware = (err, req, res, next) => {
  // Log full error details for server-side diagnostics
  console.error(`[SERVER ERROR] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.isOperational ? err.message : (statusCode === 500 ? 'An unexpected server error occurred' : err.message);

  const errors = process.env.NODE_ENV === 'development'
    ? { detail: err.message, stack: err.stack }
    : undefined;

  return sendError(res, statusCode, message, errors);
};

/**
 * 404 Route Not Found Middleware
 */
const notFoundMiddleware = (req, res, next) => {
  return sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
};

module.exports = {
  errorMiddleware,
  notFoundMiddleware
};
