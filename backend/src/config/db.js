import mongoose from 'mongoose';
import { config } from './env.js';
import { logger } from '../utils/logger.js';

let mongodInstance = null;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    // Attempt connecting to specified URI first (local or remote MongoDB)
    logger.info(`Attempting to connect to MongoDB: ${config.mongodbUri}`);
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    logger.info('✅ Successfully connected to MongoDB server');
    return mongoose.connection;
  } catch (err) {
    logger.warn(`Could not connect to external MongoDB (${err.message}). Initializing embedded In-Memory MongoDB Server for standalone execution...`);
    
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      
      await mongoose.connect(memUri);
      logger.info(`✅ Connected to Embedded In-Memory MongoDB Server at: ${memUri}`);
      return mongoose.connection;
    } catch (memErr) {
      logger.error('❌ Failed to start In-Memory MongoDB Server:', memErr.message);
      throw memErr;
    }
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
    mongodInstance = null;
  }
  logger.info('MongoDB disconnected');
}
