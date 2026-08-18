/**
 * CONCEPTS USED:
 * - JSON Web Tokens (JWT)
 * - Cryptographic Signing & Authentication
 * - Environment Variable configuration
 *
 * PURPOSE:
 * Generates secure authentication tokens for authenticated users.
 *
 * RESPONSIBILITY:
 * Encodes the user ID and role into a signed JWT string that expires based on config.
 */

const jwt = require('jsonwebtoken');

/**
 * Generate a signed JWT
 * @param {string|number} userId - Database ID of the user
 * @param {string} role - User role (e.g., 'STUDENT', 'MENTOR')
 * @returns {string} - Signed JWT token
 */
const generateToken = (userId, role) => {
  const payload = {
    id: userId,
    role: role
  };

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateToken;
