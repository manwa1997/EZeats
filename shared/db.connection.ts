// shared/db.connection.ts
import { createConnection } from 'typeorm';
import { dbConfig } from './db.config';  // Import the configuration

export const connectToDatabase = async () => {
  try {
    const connection = await createConnection({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [/* Your entities here */],
      synchronize: true,
    });

    console.log('Database connected successfully');
    return connection;
  } catch (error) {
    console.error('Database connection error:', error);
    throw new Error('Failed to connect to the database');
  }
};
