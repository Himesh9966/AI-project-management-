/**
 * CONCEPTS USED:
 * - Environment Variable Loading (dotenv)
 * - Process Signals & Graceful Shutdown
 * - Node.js HTTP Server Initialization
 * - Separation of Concerns (Server vs App)
 *
 * PURPOSE:
 * Entrypoint that boots the Node.js HTTP server and binds to the configured network port.
 *
 * RESPONSIBILITY:
 * Loads environment variables, starts listening for incoming TCP connections,
 * and manages process lifecycle events.
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 AI Project Mentor Server running on port ${PORT}`);
  console.log(`🌐 Healthcheck: http://localhost:${PORT}/health`);
  console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`====================================================`);
});

// Handle graceful process termination
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
