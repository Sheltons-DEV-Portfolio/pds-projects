require('dotenv').config();
const { Pool } = require('pg');

// Initialize a new connection pool using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: process.env.DB_PORT,
    max: 20,   // Maximum number of clients in the pool
    idleTimeoutMillis: 30000,   // How long a client remains idle before being closed
    connectionTimeoutMillis: 2000,   // Timeout when aquiring a client
});

// Optional: Log when the pool connects to the DB successfully
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

// Handle unexpected errors on idle clients
pool.on('error', (err) => {
    console.error('Unexpected database error on idle client:', err);
    process.exit(-1);
});

// Export a helper function for running queries
module.exports = {
    query: (text, params) => pool.query(text, params),
    pool,
};