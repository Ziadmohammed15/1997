import postgres from 'postgres';
import { config } from 'dotenv';

// Load environment variables
config();

// Database connection configuration
const connectionConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 10, // Maximum number of connections
  idle_timeout: 30, // Connection timeout in seconds
  connect_timeout: 30, // Connection timeout in seconds
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Create SQL client instance
const sql = postgres(process.env.DATABASE_URL || connectionConfig);

// Export the SQL client
export default sql;

// Helper function to test the connection
export const testConnection = async () => {
  try {
    await sql`SELECT 1`;
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// Cleanup function to close connections
export const closeConnection = async () => {
  try {
    await sql.end();
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
};