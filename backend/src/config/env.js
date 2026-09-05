import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongodbUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paymate',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  aiProvider: process.env.AI_PROVIDER || (process.env.OPENAI_API_KEY ? 'openai' : 'demo'),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development'
};
