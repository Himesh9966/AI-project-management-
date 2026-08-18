/**
 * CONCEPTS USED:
 * - JWT Verification
 * - Express Request Object Augmentation (req.user)
 * - Middleware Interception & Authorization
 * - Standard HTTP Status Codes (401 Unauthorized, 403 Forbidden)
 *
 * PURPOSE:
 * Protects secure API routes by validating the presence and authenticity of a JWT token.
 *
 * RESPONSIBILITY:
 * Extracts the Bearer token, verifies its signature against the secret, and attaches
 * the decoded payload to the request object for downstream controllers.
 */

const jwt = require('jsonwebtoken');
const { sendError } = require('../utils/responseHelper');

/**
 * Middleware to require authentication for a route
 */
const requireAuth = (req, res, next) => {
  let token;

  // Extract token from Authorization header (Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 401, 'Authentication required. No token provided.');
  }

  try {
    const secret = process.env.JWT_SECRET;
    
    // Verify token signature and expiration
    const decoded = jwt.verify(token, secret);
    
    // Attach decoded user info to the request object
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 401, 'Authentication token expired. Please log in again.');
    }
    return sendError(res, 401, 'Invalid authentication token.');
  }
};

module.exports = {
  requireAuth
};
