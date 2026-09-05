import { Router } from 'express';
import mongoose from 'mongoose';
import { PayMateAgent } from '../ai/agent.js';
import dashboardRoutes from './dashboardRoutes.js';
import customerRoutes from './customerRoutes.js';
import productRoutes from './productRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import paymentRoutes from './paymentRoutes.js';
import opportunityRoutes from './opportunityRoutes.js';
import campaignRoutes from './campaignRoutes.js';
import agentRoutes from './agentRoutes.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';

  res.json({
    status: 'ok',
    service: 'PayMate AI Growth Agent API',
    timestamp: new Date().toISOString(),
    aiMode: PayMateAgent.getAIMode(),
    database: {
      status: dbStatus,
      connected: dbState === 1
    }
  });
});

// Mount domain routes
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/customers', customerRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/transactions', transactionRoutes);
apiRouter.use('/payments', paymentRoutes);
apiRouter.use('/opportunities', opportunityRoutes);
apiRouter.use('/campaigns', campaignRoutes);
apiRouter.use('/agent', agentRoutes);

export default apiRouter;
