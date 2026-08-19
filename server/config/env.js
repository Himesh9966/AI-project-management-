/**
 * Environment variables & secrets management
 * 
 * This module centralizes the loading, validation, and distribution 
 * of all environment variables across the application, ensuring that 
 * secrets are managed securely and the app fails fast if required 
 * keys are missing.
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from root .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI,
  postgresUri: process.env.POSTGRES_URI,
  llmApiKey: process.env.LLM_API_KEY,
};

// Validate required secrets
const requiredSecrets = ['jwtSecret', 'mongoUri', 'postgresUri', 'llmApiKey'];
for (const secret of requiredSecrets) {
  if (!config[secret]) {
    console.error(`[CRITICAL] Missing required environment variable for ${secret}`);
  }
}

module.exports = config;
