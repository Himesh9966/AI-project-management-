/**
 * CONCEPTS USED:
 * - RESTful Response Standardization
 * - HTTP Status Codes
 * - Pure Helper Functions
 *
 * PURPOSE:
 * Provides consistent formatting for successful and error API responses.
 *
 * RESPONSIBILITY:
 * Formats JSON payload with standard status, data, and error message structures.
 */

/**
 * Send standard success response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} data
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send standard error response
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} errors
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};

module.exports = {
  sendSuccess,
  sendError
};
