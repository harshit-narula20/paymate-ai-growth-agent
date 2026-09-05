import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';

const router = Router();

router.get('/summary', DashboardController.getSummary);
router.get('/revenue', DashboardController.getRevenueTrends);

export default router;
