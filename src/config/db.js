import { Pool } from "pg";

// Validate environment variable
if (!process.env.DB_URI) {
  throw new Error("DB_URI is not defined in .env file");
}

const pool = new Pool({
  connectionString: process.env.DB_URI,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
  max: 10, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Test connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to Neon PostgreSQL");
    client.release();
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  }
})();

export default pool;