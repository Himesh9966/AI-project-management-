/**
 * CONCEPTS USED:
 * - PostgreSQL Connection Pooling (pg.Pool)
 * - Relational Database Management
 * - Asynchronous Resource Acquisition
 * - Fault-tolerant Connection Probing
 *
 * PURPOSE:
 * Initializes and exports the PostgreSQL connection pool for relational data operations.
 *
 * RESPONSIBILITY:
 * Manages reusable database client connections, executes parameterized queries,
 * and monitors PostgreSQL server health.
 */

const { Pool } = require('pg');

const config = require('./env');

const pool = new Pool({
  connectionString: config.postgresUri,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err.message);
});

/**
 * Test PostgreSQL connectivity and log status
 * @returns {Promise<boolean>}
 */
const connectPostgres = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() AS current_time');
    client.release();
    console.log(`🐘 PostgreSQL Connected successfully at: ${result.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ PostgreSQL Connection Warning: ${error.message}`);
    console.log('ℹ️  Note: Ensure PostgreSQL is running on port 5432 or check POSTGRES_URI in .env');
    return false;
  }
};

/**
 * Execute parameterized query safely
 * @param {string} text - SQL query string
 * @param {Array} params - Array of parameter values to prevent SQL Injection
 */
const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
  connectPostgres
};
