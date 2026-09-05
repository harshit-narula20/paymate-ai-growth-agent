import { AnalyticsService } from '../services/analyticsService.js';
import { PayMateAgent } from '../ai/agent.js';

export class DashboardController {
  static async getSummary(req, res, next) {
    try {
      const summary = await AnalyticsService.getDashboardSummary();
      const aiMode = PayMateAgent.getAIMode();
      
      res.json({
        success: true,
        aiMode,
        data: summary
      });
    } catch (err) {
      next(err);
    }
  }

  static async getRevenueTrends(req, res, next) {
    try {
      const months = req.query.months ? parseInt(req.query.months, 10) : 6;
      const trends = await AnalyticsService.getRevenueTrends(months);
      
      res.json({
        success: true,
        data: trends
      });
    } catch (err) {
      next(err);
    }
  }
}
