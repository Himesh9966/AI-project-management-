/**
 * CONCEPTS USED:
 * - Express Middleware Pipeline
 * - Request Lifecycle Logging
 * - HTTP Status & Latency Monitoring
 *
 * PURPOSE:
 * Intercepts incoming HTTP requests to log method, URL, status code, and response time.
 *
 * RESPONSIBILITY:
 * Formats and outputs structured request logs in development and production environments.
 */

const morgan = require('morgan');

// Use concise colored dev format in development, combined Apache format in production
const loggingMiddleware = process.env.NODE_ENV === 'production'
  ? morgan('combined')
  : morgan(':method :url :status :res[content-length] - :response-time ms');

module.exports = loggingMiddleware;
