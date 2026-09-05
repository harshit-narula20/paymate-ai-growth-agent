import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import apiRouter from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';
import { Customer } from './models/index.js';
import { runSeed } from './seed/seed.js';

const app = express();

// Standard middleware
app.use(cors({
  origin: [config.frontendUrl, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging in dev
app.use((req, res, next) => {
  if (req.path !== '/api/health') {
    logger.info(`${req.method} ${req.originalUrl}`);
  }
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to PayMate - AI-Powered Autonomous Growth Agent for Commerce API',
    health: '/api/health',
    docs: '/api'
  });
});

// Mount API routes
app.use('/api', apiRouter);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Bootstrap server
async function startServer() {
  try {
    await connectDB();

    // Auto-seed if database is freshly started or empty
    const count = await Customer.countDocuments();
    if (count === 0) {
      logger.info('Database is empty (or using ephemeral in-memory instance). Running initial seed...');
      await runSeed();
    } else {
      logger.info(`Existing database detected with ${count} customers.`);
    }

    const server = app.listen(config.port, () => {
      logger.info(`🚀 PayMate Server running on http://localhost:${config.port}`);
      logger.info(`🤖 Autonomous Agent AI Engine Mode: [${config.aiProvider.toUpperCase()}]`);
      logger.info(`📊 Health check: http://localhost:${config.port}/api/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        logger.info('Server closed cleanly.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    return server;
  } catch (err) {
    logger.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start only if executed directly
if (process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('src/server.js')) {
  startServer();
}

export { app, startServer };
