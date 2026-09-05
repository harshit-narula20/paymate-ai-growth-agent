import { PayMateAgent } from '../ai/agent.js';
import { CampaignExecutionService } from '../services/campaignExecutionService.js';
import { AgentAction } from '../models/index.js';

export class AgentController {
  /**
   * POST /api/agent/analyze
   * Autonomous discovery and analysis of store opportunities
   */
  static async analyze(req, res, next) {
    try {
      const { prompt } = req.body || {};
      const result = await PayMateAgent.analyzeBusinessData(prompt);

      res.json({
        success: true,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/agent/recommend
   * Generate campaign recommendation for an opportunity
   */
  static async recommend(req, res, next) {
    try {
      const { opportunityId } = req.body;
      if (!opportunityId) {
        return res.status(400).json({ success: false, error: { message: 'opportunityId is required' } });
      }

      const result = await PayMateAgent.generateRecommendation(opportunityId);

      res.json({
        success: true,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * POST /api/agent/execute
   * Execute an approved opportunity campaign autonomously
   */
  static async execute(req, res, next) {
    try {
      const { opportunityId, overrides } = req.body;
      if (!opportunityId) {
        return res.status(400).json({ success: false, error: { message: 'opportunityId is required' } });
      }

      const result = await CampaignExecutionService.executeOpportunity(opportunityId, overrides);

      res.json({
        success: true,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/agent/actions
   * Retrieve audit log of all autonomous agent actions
   */
  static async getActions(req, res, next) {
    try {
      const { limit = 50, actionType } = req.query;
      const filter = {};
      if (actionType) filter.actionType = actionType;

      const actions = await AgentAction.find(filter)
        .populate('opportunityId', 'title type estimatedRevenue')
        .populate('campaignId', 'name status roi actualRevenue conversions')
        .sort({ executedAt: -1 })
        .limit(parseInt(limit, 10))
        .lean();

      res.json({
        success: true,
        data: actions,
        total: actions.length
      });
    } catch (err) {
      next(err);
    }
  }
}
