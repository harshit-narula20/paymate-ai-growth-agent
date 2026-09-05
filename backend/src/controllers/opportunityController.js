import { Opportunity } from '../models/index.js';

export class OpportunityController {
  static async getOpportunities(req, res, next) {
    try {
      const { status, priority, type } = req.query;
      const filter = {};
      if (status) filter.status = status;
      if (priority) filter.priority = priority;
      if (type) filter.type = type;

      const opportunities = await Opportunity.find(filter)
        .sort({ priority: 1, estimatedRevenue: -1 })
        .populate('targetCustomers', 'name email phone segment')
        .lean();

      res.json({
        success: true,
        data: opportunities,
        total: opportunities.length
      });
    } catch (err) {
      next(err);
    }
  }

  static async getOpportunityById(req, res, next) {
    try {
      const { id } = req.params;
      const opportunity = await Opportunity.findById(id)
        .populate('targetCustomers', 'name email phone segment totalSpent averageOrderValue lastPurchaseDate')
        .lean();

      if (!opportunity) {
        return res.status(404).json({ success: false, error: { message: 'Opportunity not found' } });
      }

      res.json({
        success: true,
        data: opportunity
      });
    } catch (err) {
      next(err);
    }
  }

  static async updateOpportunityStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const opportunity = await Opportunity.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!opportunity) {
        return res.status(404).json({ success: false, error: { message: 'Opportunity not found' } });
      }

      res.json({
        success: true,
        data: opportunity
      });
    } catch (err) {
      next(err);
    }
  }
}
