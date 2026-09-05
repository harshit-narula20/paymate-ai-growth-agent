import { Customer, Product, Transaction, Payment, Opportunity, Campaign, AgentAction } from '../models/index.js';
import { AnalyticsService } from '../services/analyticsService.js';
import { getDataProvider } from '../services/dataProvider.js';
import { logger } from '../utils/logger.js';

export const agentTools = {
  async getCustomerData({ segment, limit = 50 } = {}) {
    const filter = segment ? { segment } : {};
    return await Customer.find(filter).limit(Number(limit)).lean();
  },

  async getTransactionData({ status = 'completed', limit = 50 } = {}) {
    const filter = status ? { paymentStatus: status } : {};
    return await Transaction.find(filter).sort({ transactionDate: -1 }).limit(Number(limit)).lean();
  },

  async getProductData({ category } = {}) {
    const filter = category ? { category } : {};
    return await Product.find(filter).lean();
  },

  async getFailedPayments() {
    return await Payment.find({ status: 'failed' })
      .populate('customerId', 'name email phone totalSpent averageOrderValue')
      .populate('transactionId', 'products totalAmount')
      .sort({ createdAt: -1 })
      .lean();
  },

  async getCustomerSegments() {
    const aggregation = await Customer.aggregate([
      {
        $group: {
          _id: '$segment',
          count: { $sum: 1 },
          totalSpent: { $sum: '$totalSpent' },
          avgSpend: { $avg: '$totalSpent' },
          avgOrderValue: { $avg: '$averageOrderValue' }
        }
      }
    ]);
    return aggregation;
  },

  async calculateCustomerLifetimeValue() {
    const summary = await AnalyticsService.getDashboardSummary();
    return {
      averageCLV: summary.customerLifetimeValue,
      repeatPurchaseRate: summary.repeatPurchaseRate,
      totalCustomers: summary.customerCount
    };
  },

  async identifyCrossSellOpportunities() {
    return await AnalyticsService.detectCrossSellOpportunities();
  },

  async identifyChurnRisk() {
    return await AnalyticsService.detectChurnPreventionOpportunities();
  },

  async identifyWinBackOpportunities() {
    return await AnalyticsService.detectWinBackOpportunities();
  },

  async identifyPaymentRecoveryOpportunities() {
    return await AnalyticsService.detectPaymentRecoveryOpportunities();
  },

  async estimateRevenueOpportunity({ opportunityType, targetCount, avgBasketValue }) {
    const rates = {
      cross_sell: 0.16,
      win_back: 0.12,
      payment_recovery: 0.45,
      churn_prevention: 0.25,
      high_intent: 0.22
    };
    const rate = rates[opportunityType] || 0.15;
    const estimated = Math.round(Number(targetCount) * Number(avgBasketValue) * rate);
    return {
      opportunityType,
      targetCount,
      estimatedConversionRate: rate,
      estimatedRevenue: estimated
    };
  },

  async createCampaign(campaignData) {
    const campaign = new Campaign(campaignData);
    await campaign.save();
    return campaign;
  }
};

export const toolDefinitions = [
  {
    type: 'function',
    function: {
      name: 'getCustomerData',
      description: 'Fetch customer profiles filtered by segment',
      parameters: {
        type: 'object',
        properties: {
          segment: { type: 'string', description: 'Customer segment e.g. shoe_buyer, inactive, high_ltv' },
          limit: { type: 'number', description: 'Max records' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getFailedPayments',
      description: 'Fetch all failed payment transactions with customer and error details',
      parameters: { type: 'object', properties: {} }
    }
  },
  {
    type: 'function',
    function: {
      name: 'getCustomerSegments',
      description: 'Get aggregated counts and spending for all customer segments',
      parameters: { type: 'object', properties: {} }
    }
  },
  {
    type: 'function',
    function: {
      name: 'identifyCrossSellOpportunities',
      description: 'Analyze cross-sell opportunities such as accessories for shoe buyers',
      parameters: { type: 'object', properties: {} }
    }
  },
  {
    type: 'function',
    function: {
      name: 'identifyWinBackOpportunities',
      description: 'Analyze inactive high-value customers for win-back campaigns',
      parameters: { type: 'object', properties: {} }
    }
  },
  {
    type: 'function',
    function: {
      name: 'identifyPaymentRecoveryOpportunities',
      description: 'Analyze failed checkouts and calculate recoverable revenue',
      parameters: { type: 'object', properties: {} }
    }
  }
];
