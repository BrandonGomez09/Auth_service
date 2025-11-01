import { DataSource } from 'typeorm';
import { databaseConfig } from './database.config';

export const AppDataSource = new DataSource({
  ...databaseConfig,
  type: 'postgres',
  entities: [
    __dirname + '/../database/schemas/**/*.ts',
    __dirname + '/../database/schemas/**/*.js'
  ],
  migrations: [
    __dirname + '/../database/migrations/**/*.ts',
    __dirname + '/../database/migrations/**/*.js'
  ]
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('✅ Database connection established successfully');
    }
  } catch (error) {
    console.error('❌ Error connecting to database:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('✅ Database connection closed successfully');
    }
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
    throw error;
  }
};