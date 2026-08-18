/**
 * CONCEPTS USED:
 * - MongoDB Connection Pooling via Mongoose
 * - Async/Await & Event Emitters
 * - Connection Lifecycle Management
 * - Resilient Error Handling
 *
 * PURPOSE:
 * Establishes and manages the connection to MongoDB for non-relational document storage.
 *
 * RESPONSIBILITY:
 * Initializes Mongoose connection, handles connection events (error, disconnected),
 * and provides a clean interface for application startup.
 */

const mongoose = require('mongoose');

let isConnected = false;

/**
 * Connect to MongoDB instance
 * @returns {Promise<typeof mongoose>}
 */
const connectMongoDB = async () => {
  if (isConnected) {
    console.log('⚡ MongoDB is already connected.');
    return mongoose;
  }

  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ai_project_mentor';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true
    });

    isConnected = !!conn.connections[0].readyState;
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Warning: ${error.message}`);
    console.log('ℹ️  Note: Ensure MongoDB is running locally on port 27017, or specify MONGO_URI in .env');
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('⚠️ MongoDB connection disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
});

module.exports = {
  connectMongoDB,
  mongoose
};
