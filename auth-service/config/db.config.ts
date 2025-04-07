// auth-service/config/db.config.ts
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),  // Ensure it's always a number
    database: process.env.DB_NAME || 'ezeats',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '1234',
  };
  
