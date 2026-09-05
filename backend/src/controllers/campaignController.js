import { Campaign } from '../models/index.js';
import { CampaignExecutionService } from '../services/campaignExecutionService.js';

export class CampaignController {
  static async getCampaigns(req, res, next) {
    try {
      const { status, type } = req.query;
      const filter = {};
      if (status) filter.status = status;
      if (type) filter.type = type;

      const campaigns = await Campaign.find(filter)
        .populate('opportunityId', 'title estimatedRevenue')
        .sort({ createdAt: -1 })
        .lean();

      res.json({
        success: true,
        data: campaigns,
        total: campaigns.length
      });
    } catch (err) {
      next(err);
    }
  }

  static async getCampaignById(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await Campaign.findById(id)
        .populate('opportunityId')
        .populate('targetCustomers', 'name email phone segment')
        .lean();

      if (!campaign) {
        return res.status(404).json({ success: false, error: { message: 'Campaign not found' } });
      }

      res.json({
        success: true,
        data: campaign
      });
    } catch (err) {
      next(err);
    }
  }

  static async createCampaign(req, res, next) {
    try {
      const campaign = new Campaign(req.body);
      await campaign.save();

      res.status(201).json({
        success: true,
        data: campaign
      });
    } catch (err) {
      next(err);
    }
  }

  static async executeCampaignById(req, res, next) {
    try {
      const { id } = req.params;
      const campaign = await Campaign.findById(id);

      if (!campaign) {
        return res.status(404).json({ success: false, error: { message: 'Campaign not found' } });
      }

      if (!campaign.opportunityId) {
        return res.status(400).json({ success: false, error: { message: 'Campaign does not have an associated Opportunity' } });
      }

      const result = await CampaignExecutionService.executeOpportunity(campaign.opportunityId, {
        name: campaign.name,
        channel: campaign.channel,
        message: campaign.message,
        offer: campaign.offer
      });

      res.json({
        success: true,
        ...result
      });
    } catch (err) {
      next(err);
    }
  }
}
