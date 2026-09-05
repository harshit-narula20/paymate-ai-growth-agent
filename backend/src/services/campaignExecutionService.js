import { Opportunity, Campaign, AgentAction, Customer, Payment, Transaction } from '../models/index.js';
import { DemoAIEngine } from '../ai/demoEngine.js';
import { logger } from '../utils/logger.js';

export class CampaignExecutionService {
  /**
   * Execute campaign when an opportunity is approved by the merchant
   */
  static async executeOpportunity(opportunityId, overrides = {}) {
    logger.agent(`Executing approved Opportunity ID: ${opportunityId}`);

    // 1. Validate Opportunity
    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      throw new Error(`Opportunity not found: ${opportunityId}`);
    }

    if (opportunity.status === 'executed') {
      throw new Error(`Opportunity has already been executed`);
    }

    // 2. Retrieve Target Customers
    let customerIds = opportunity.targetCustomers || [];
    if (!customerIds.length) {
      // Fallback query based on target segment
      const customers = await Customer.find({ segment: opportunity.targetSegment }).limit(50).lean();
      customerIds = customers.map(c => c._id);
    }

    const targetedCustomerDocs = await Customer.find({ _id: { $in: customerIds } }).lean();
    const targetedCount = targetedCustomerDocs.length || 25;

    // 3. Generate Campaign Content
    const campaignCopy = await DemoAIEngine.generateCampaignContent(opportunity);

    // 4. Create Campaign Document
    const campaign = new Campaign({
      name: overrides.name || `Autonomous Campaign: ${opportunity.title}`,
      type: opportunity.type,
      targetCustomers: customerIds,
      targetSegment: opportunity.targetSegment,
      channel: overrides.channel || opportunity.recommendedChannel || 'whatsapp',
      message: overrides.message || campaignCopy.message,
      offer: overrides.offer || opportunity.offer || { type: 'percentage', value: 15, code: 'GROWTH15' },
      status: 'active',
      opportunityId: opportunity._id,
      estimatedRevenue: opportunity.estimatedRevenue
    });

    await campaign.save();

    // 5. Create Initial AgentAction (Execution Started)
    const action = await AgentAction.create({
      opportunityId: opportunity._id,
      campaignId: campaign._id,
      actionType: 'execute_campaign',
      input: {
        opportunityTitle: opportunity.title,
        channel: campaign.channel,
        targetedCount,
        offer: campaign.offer
      },
      status: 'in_progress'
    });

    // 6. Simulate Campaign Execution & Deliveries
    // realistic conversion calculations based on channel and type
    const channelMultipliers = { whatsapp: 1.25, email: 1.0, sms: 0.9, in_app: 1.15 };
    const baseRates = {
      cross_sell: 0.16,
      win_back: 0.12,
      payment_recovery: 0.44,
      churn_prevention: 0.22,
      high_intent: 0.25
    };

    const multiplier = channelMultipliers[campaign.channel] || 1.0;
    const baseRate = baseRates[opportunity.type] || 0.15;
    const effectiveConversionRate = Math.min(0.65, baseRate * multiplier * (0.9 + Math.random() * 0.2));

    const conversions = Math.max(1, Math.round(targetedCount * effectiveConversionRate));
    
    // Revenue calculated with realistic slight deviation from estimated
    const varianceFactor = 0.92 + Math.random() * 0.18; // 92% to 110% of estimate
    const actualRevenue = Math.round(opportunity.estimatedRevenue * varianceFactor);

    // Channel costs (INR)
    const costPerMessage = campaign.channel === 'whatsapp' ? 0.75 : campaign.channel === 'sms' ? 0.25 : 0.10;
    const campaignCost = Math.max(10, Math.round(targetedCount * costPerMessage));
    const roi = Number((((actualRevenue - campaignCost) / campaignCost) * 100).toFixed(1));

    // 7. If payment recovery, simulate recovering some failed payments
    let recoveredTransactionsCount = 0;
    if (opportunity.type === 'payment_recovery') {
      const failedPayments = await Payment.find({ status: 'failed' }).limit(conversions);
      for (const p of failedPayments) {
        p.status = 'recovered';
        await p.save();
        await Transaction.findByIdAndUpdate(p.transactionId, { paymentStatus: 'completed' });
        recoveredTransactionsCount++;
      }
      logger.agent(`Simulated payment recovery: restored ${recoveredTransactionsCount} failed payments.`);
    }

    // 8. Update Opportunity
    opportunity.status = 'executed';
    await opportunity.save();

    // 9. Update Campaign
    campaign.status = 'completed';
    campaign.actualRevenue = actualRevenue;
    campaign.conversions = conversions;
    campaign.roi = roi;
    campaign.executedAt = new Date();
    await campaign.save();

    // 10. Complete AgentAction
    const executionOutput = {
      simulationMode: true,
      executionBadge: 'DEMO/SIMULATED',
      targetedCustomers: targetedCount,
      channel: campaign.channel,
      conversions,
      actualRevenue,
      campaignCost,
      roi,
      recoveredTransactionsCount,
      completedAt: new Date()
    };

    action.output = executionOutput;
    action.status = 'completed';
    await action.save();

    logger.agent(`Campaign execution finished successfully: ${conversions} conversions, ₹${actualRevenue.toLocaleString('en-IN')} revenue (ROI: ${roi}%). [DEMO/SIMULATED]`);

    return {
      success: true,
      simulationMode: true,
      executionBadge: 'DEMO/SIMULATED',
      campaign,
      opportunity,
      agentAction: action,
      results: executionOutput
    };
  }
}
