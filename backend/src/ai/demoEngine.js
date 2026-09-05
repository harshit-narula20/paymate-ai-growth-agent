import { AnalyticsService } from '../services/analyticsService.js';
import { Customer, Product, Payment } from '../models/index.js';
import { logger } from '../utils/logger.js';

export class DemoAIEngine {
  /**
   * Deterministic Demo AI that analyzes actual MongoDB data
   */
  static async analyzeMerchantData(prompt = '') {
    logger.agent(`Demo AI Engine: Analyzing live MongoDB data for query: "${prompt}"`);

    const intent = this.detectIntent(prompt);
    const summary = await AnalyticsService.getDashboardSummary();
    const rawOpportunities = intent === 'churn'
      ? [await AnalyticsService.detectChurnPreventionOpportunities()]
      : intent === 'cross_sell'
        ? [await AnalyticsService.detectCrossSellOpportunities()]
        : intent === 'payment_recovery'
          ? [await AnalyticsService.detectPaymentRecoveryOpportunities()]
          : await AnalyticsService.generateAllOpportunities();

    const ranked = rawOpportunities.sort((a, b) => (
      (b.estimatedRevenue * b.confidence) - (a.estimatedRevenue * a.confidence)
    ));
    const answer = await this.buildAnswer(intent, ranked, summary);
    const agentInsight = answer.summary;

    return {
      provider: 'demo',
      mode: 'AI Mode: Demo',
      summary: agentInsight,
      opportunities: ranked,
      metricsSnapshot: summary,
      intent,
      answer
    };
  }

  static detectIntent(prompt = '') {
    const query = prompt.toLowerCase();
    if (/failed\s+payments?|failed\s+transactions?|payment\s+recover|recoverable\s+revenue|abandoned\s+checkout/.test(query)) return 'payment_recovery';
    if (/cross[- ]sell|cross selling|additional products?|another product|upsell/.test(query)) return 'cross_sell';
    if (/churn|likely to leave|customers? at risk|retention|retain/.test(query)) return 'churn';
    if (/biggest|best|highest\s+roi/.test(query) && /opportunit|growth/.test(query)) return 'biggest_opportunity';
    if (/increase revenue|grow revenue|revenue this week|make more money|growth opportunit/.test(query)) return 'revenue_growth';
    return 'general_growth';
  }

  static async getCustomerDetails(customerIds = []) {
    const customers = await Customer.find({ _id: { $in: customerIds } })
      .select('name email totalSpent averageOrderValue churnRisk lastPurchaseDate')
      .lean();
    return customers.map(customer => ({
      id: customer._id,
      name: customer.name,
      email: customer.email,
      totalSpent: customer.totalSpent,
      averageOrderValue: customer.averageOrderValue,
      churnRisk: customer.churnRisk,
      lastPurchaseDate: customer.lastPurchaseDate
    }));
  }

  static async buildAnswer(intent, opportunities, summary) {
    const opportunity = opportunities[0];
    const customerIds = opportunity?.targetCustomers || [];
    const customers = await this.getCustomerDetails(customerIds);
    const labels = {
      churn: 'Churn risk analysis',
      cross_sell: 'Cross-sell analysis',
      payment_recovery: 'Failed payment recovery',
      revenue_growth: 'Revenue growth analysis',
      biggest_opportunity: 'Biggest growth opportunity',
      general_growth: 'Growth opportunity analysis'
    };

    if (intent === 'churn') {
      const ltvAtRisk = customers.reduce((total, customer) => total + (customer.totalSpent || 0), 0);
      return {
        label: labels[intent],
        summary: `${summary.highRiskCustomerCount} high-risk customers are flagged for retention, with approximately ₹${ltvAtRisk.toLocaleString('en-IN')} in customer value at risk. ${opportunity?.description || ''}`,
        metrics: { highRiskCustomers: summary.highRiskCustomerCount, ltvAtRisk },
        recommendedAction: opportunity?.recommendedAction,
        customers,
        reasoning: 'Customers are prioritized using the existing high-LTV and high churn-risk business rules.'
      };
    }

    if (intent === 'cross_sell') {
      return {
        label: labels[intent],
        summary: `${customers.length} customers are suitable for an accessories cross-sell because they bought running shoes without premium accessories.`,
        metrics: { suitableCustomers: customers.length, estimatedOpportunity: opportunity?.estimatedRevenue || 0 },
        recommendedAction: opportunity?.recommendedAction,
        customers,
        recommendedProduct: 'Premium accessories (socks, insoles, or cleaner kits)',
        reasoning: opportunity?.reasoning
      };
    }

    if (intent === 'payment_recovery') {
      const failedPayments = await Payment.find({ status: 'failed' })
        .populate('customerId', 'name email')
        .populate('transactionId', 'totalAmount transactionDate')
        .sort({ amount: -1 })
        .limit(10)
        .lean();
      return {
        label: labels[intent],
        summary: `${summary.failedPaymentsCount} failed payments represent ₹${summary.recoverableRevenue.toLocaleString('en-IN')} in recoverable revenue. The highest-value failures should be contacted first.`,
        metrics: { failedTransactions: summary.failedPaymentsCount, recoverableRevenue: summary.recoverableRevenue, estimatedRecovery: opportunity?.estimatedRevenue || 0 },
        recommendedAction: opportunity?.recommendedAction,
        transactions: failedPayments.map(payment => ({
          id: payment.transactionId?._id || payment.transactionId,
          customerId: payment.customerId?._id,
          customerName: payment.customerId?.name || 'Unknown customer',
          amount: payment.amount,
          failureReason: payment.failureReason,
          transactionDate: payment.transactionId?.transactionDate || payment.createdAt
        })),
        reasoning: opportunity?.reasoning
      };
    }

    if (intent === 'biggest_opportunity') {
      return {
        label: labels[intent],
        summary: opportunity ? `${opportunity.title} is the highest-value opportunity at ₹${opportunity.estimatedRevenue.toLocaleString('en-IN')} estimated revenue, weighted by confidence.` : 'No active opportunity was found.',
        metrics: { estimatedOpportunity: opportunity?.estimatedRevenue || 0, confidence: opportunity?.confidence || 0 },
        recommendedAction: opportunity?.recommendedAction,
        opportunity,
        reasoning: opportunity?.reasoning
      };
    }

    if (intent === 'revenue_growth') {
      const potentialRevenue = opportunities.reduce((sum, item) => sum + item.estimatedRevenue, 0);
      const averageOpportunityValue = opportunities.length > 0
        ? Math.round(potentialRevenue / opportunities.length)
        : 0;

      return {
        label: labels[intent],
        summary: `PayMate identified ${opportunities.length} growth opportunities totaling ₹${potentialRevenue.toLocaleString('en-IN')} in potential revenue.`,
        metrics: { opportunities: opportunities.length, potentialRevenue, averageOpportunityValue },
        topOpportunities: opportunities.slice(0, 3).map(item => ({
          title: item.title,
          type: item.type,
          estimatedRevenue: item.estimatedRevenue,
          confidence: item.confidence
        })),
        recommendedAction: opportunity?.recommendedAction,
        reasoning: 'Opportunities are ranked by estimated revenue multiplied by deterministic confidence.'
      };
    }

    const potentialRevenue = opportunities.reduce((sum, item) => sum + item.estimatedRevenue, 0);
    return {
      label: labels[intent],
      summary: `PayMate identified ${opportunities.length} growth opportunities totaling ₹${potentialRevenue.toLocaleString('en-IN')} in potential revenue.`,
      metrics: { opportunities: opportunities.length, potentialRevenue },
      recommendedAction: opportunity?.recommendedAction,
      reasoning: 'Opportunities are ranked by estimated revenue multiplied by deterministic confidence.'
    };
  }

  /**
   * Generate dynamic personalized campaign content based on opportunity and actual product catalog
   */
  static async generateCampaignContent(opportunity, merchantName = 'Apex Athletics') {
    logger.agent(`Demo AI Engine: Generating campaign copy for opportunity "${opportunity.title}"...`);

    const offerCode = opportunity.offer?.code || 'GROWTH20';
    const offerValue = opportunity.offer?.value || 15;
    const discountText = opportunity.offer?.type === 'percentage' ? `${offerValue}% OFF` : `₹${offerValue} OFF`;

    let subject = '';
    let message = '';
    let callToAction = 'Claim Offer Now';

    switch (opportunity.type) {
      case 'cross_sell':
        subject = `Complete Your Kit: Exclusive ${discountText} on Premium Accessories ⚡`;
        message = `Hey {{customer_name}}, since you recently stepped up your game with new running shoes, we picked the perfect performance accessories to keep you running at your peak. Use code ${offerCode} for ${discountText} on our moisture-wicking socks, ergonomic insoles, and shoe-care kits. Available for 48 hours!`;
        callToAction = 'Shop Complementary Gear';
        break;

      case 'payment_recovery':
        subject = `Your order at ${merchantName} couldn't be completed — Quick 1-click restore`;
        message = `Hi {{customer_name}}, we noticed your recent transaction of ₹{{amount}} didn't go through due to a banking gateway timeout. Don't worry, your cart is reserved. We've applied ${discountText} with code ${offerCode}. Tap below to complete checkout instantly via UPI, Card, or NetBanking.`;
        callToAction = 'Complete Payment (1-Click)';
        break;

      case 'win_back':
        subject = `We Miss You at ${merchantName}! Here's a VIP Gift Inside 🎁`;
        message = `Hello {{customer_name}}, it's been a while since your last visit. We've dropped our newest seasonal lineup and want to welcome you back with an exclusive ${discountText} discount. Use code ${offerCode} at checkout.`;
        callToAction = 'Explore New Arrivals';
        break;

      case 'churn_prevention':
        subject = `VIP Recognition: An Exclusive Reward for Your Loyalty 🌟`;
        message = `Dear {{customer_name}}, as one of our most valued patrons at ${merchantName}, we want to ensure you always experience our best. Enjoy a personal credit of ${discountText} with voucher ${offerCode}, plus complimentary expedited shipping on your next order.`;
        callToAction = 'Access VIP Perks';
        break;

      case 'high_intent':
      default:
        subject = `Early Access: Members-Only Bundle Savings 🚀`;
        message = `Hi {{customer_name}}, because of your frequent support, you've unlocked priority access to our exclusive Performance Pack. Enjoy ${discountText} using code ${offerCode} and double loyalty reward points today only!`;
        callToAction = 'Unlock Bundle';
        break;
    }

    return {
      provider: 'demo',
      mode: 'AI Mode: Demo',
      subject,
      message,
      callToAction,
      recommendedSendingTime: 'Optimized: 11:30 AM or 7:15 PM IST',
      offer: opportunity.offer
    };
  }
}
