/**
 * CONCEPTS USED:
 * - Express Controller Layer (Separation of HTTP Parsing from Business/Data Logic)
 * - Password Hashing (bcrypt)
 * - Data Validation
 * - Promise/Async Error Handling
 * - HTTP Status Codes
 *
 * PURPOSE:
 * Handles incoming HTTP requests for authentication operations (Registration, Login, Profile).
 *
 * RESPONSIBILITY:
 * Extracts request bodies, validates input, calls SQL query helpers to interact with PostgreSQL,
 * hashes passwords, generates JWTs, and sends standardized JSON responses.
 */

const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/responseHelper');
const { findUserByEmail, createUser, findUserById } = require('../sql/queries');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Basic Validation
    if (!name || !email || !password) {
      return sendError(res, 400, 'Please provide name, email, and password.');
    }

    if (password.length < 6) {
      return sendError(res, 400, 'Password must be at least 6 characters long.');
    }

    // 2. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return sendError(res, 409, 'User with this email already exists.');
    }

    // 3. Hash password securely
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Save user to PostgreSQL
    const requestedRole = (role && role.toUpperCase() === 'MENTOR') ? 'MENTOR' : 'STUDENT';
    const newUser = await createUser(name, email, passwordHash, requestedRole);

    // 5. Generate JWT token
    const token = generateToken(newUser.id, newUser.role);

    // 6. Return success response (excluding password hash)
    return sendSuccess(res, 201, 'User registered successfully', {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    });
  } catch (error) {
    next(error); // Pass to global error middleware
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password.');
    }

    // 1. Fetch user by email
    const user = await findUserByEmail(email);
    if (!user) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials.');
    }

    // 3. Generate Token
    const token = generateToken(user.id, user.role);

    return sendSuccess(res, 200, 'Login successful', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user profile
 * @access  Private (Requires JWT)
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is populated by the authMiddleware
    const userId = req.user.id;
    
    const user = await findUserById(userId);
    if (!user) {
      return sendError(res, 404, 'User profile not found.');
    }

    return sendSuccess(res, 200, 'Profile retrieved successfully', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe
};
