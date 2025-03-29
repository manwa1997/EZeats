import * as dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'ezeats_db',
  user: process.env.DB_USER || 'user',
  password: process.env.DB_PASSWORD || 'password',
};
