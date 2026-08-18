/**
 * CONCEPTS USED:
 * - Express Application Initialization
 * - Middleware Pipeline Configuration
 * - Cross-Origin Resource Sharing (CORS)
 * - REST API Routing Architecture
 * - Centralized Error Handling
 *
 * PURPOSE:
 * Configures the Express application instance, registers global middlewares,
 * mounts API routes, and binds error handling layers.
 *
 * RESPONSIBILITY:
 * Encapsulates the application lifecycle and middleware chain separate from server network listening.
 */

const express = require('express');
const cors = require('cors');
const loggingMiddleware = require('./middleware/loggingMiddleware');
const { errorMiddleware, notFoundMiddleware } = require('./middleware/errorMiddleware');
const { sendSuccess } = require('./utils/responseHelper');

const app = express();

// 1. Cross-Origin Resource Sharing
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// 2. Request Parsing Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 3. HTTP Request Logging
app.use(loggingMiddleware);

// 4. Base Healthcheck Route
app.get('/health', (req, res) => {
  return sendSuccess(res, 200, 'AI Project Mentor Server is healthy and running', {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const standaloneTaskRoutes = require('./routes/standaloneTaskRoutes');

// 5. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/tasks', standaloneTaskRoutes);
// app.use('/api/ai', aiRoutes);

// 6. 404 Route Handler
app.use(notFoundMiddleware);

// 7. Centralized Error Handling Middleware
app.use(errorMiddleware);

module.exports = app;
