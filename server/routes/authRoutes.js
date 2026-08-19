/**
 * CONCEPTS USED:
 * - Express Router
 * - RESTful Endpoint Definitions
 * - Middleware Chaining
 *
 * PURPOSE:
 * Maps HTTP routes and methods to specific authentication controller functions.
 *
 * RESPONSIBILITY:
 * Defines public endpoints (/register, /login) and protected endpoints (/me) by binding
 * them to their respective controllers and inserting the authMiddleware where needed.
 */

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected Routes (Require JWT Token)
router.get('/me', requireAuth, getMe);

module.exports = router;
