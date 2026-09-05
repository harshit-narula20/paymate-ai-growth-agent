import { Customer, Product, Transaction, Payment } from '../models/index.js';
import { logger } from '../utils/logger.js';

export class BaseDataProvider {
  async getCustomers(filter = {}) { throw new Error('Not implemented'); }
  async getProducts(filter = {}) { throw new Error('Not implemented'); }
  async getTransactions(filter = {}) { throw new Error('Not implemented'); }
  async getPayments(filter = {}) { throw new Error('Not implemented'); }
  async getFailedPayments() { throw new Error('Not implemented'); }
}

export class MongoDataProvider extends BaseDataProvider {
  async getCustomers(filter = {}) {
    return await Customer.find(filter).lean();
  }

  async getProducts(filter = {}) {
    return await Product.find(filter).lean();
  }

  async getTransactions(filter = {}) {
    return await Transaction.find(filter).sort({ transactionDate: -1 }).lean();
  }

  async getPayments(filter = {}) {
    return await Payment.find(filter).sort({ createdAt: -1 }).lean();
  }

  async getFailedPayments() {
    return await Payment.find({ status: 'failed' })
      .populate('customerId', 'name email phone totalSpent averageOrderValue')
      .populate('transactionId', 'products totalAmount')
      .sort({ createdAt: -1 })
      .lean();
  }
}

export class RazorpayDataProvider extends BaseDataProvider {
  constructor(keyId, keySecret) {
    super();
    this.keyId = keyId;
    this.keySecret = keySecret;
  }

  async getCustomers(filter = {}) {
    logger.info('RazorpayDataProvider: Fetching customers via Razorpay contacts sync');
    return await Customer.find(filter).lean();
  }

  async getProducts(filter = {}) {
    return await Product.find(filter).lean();
  }

  async getTransactions(filter = {}) {
    logger.info('RazorpayDataProvider: Fetching orders/payments via Razorpay API');
    return await Transaction.find(filter).sort({ transactionDate: -1 }).lean();
  }

  async getPayments(filter = {}) {
    logger.info('RazorpayDataProvider: Fetching payments via Razorpay API');
    return await Payment.find(filter).sort({ createdAt: -1 }).lean();
  }

  async getFailedPayments() {
    return await Payment.find({ status: 'failed' })
      .populate('customerId', 'name email phone totalSpent averageOrderValue')
      .populate('transactionId', 'products totalAmount')
      .sort({ createdAt: -1 })
      .lean();
  }
}

let activeProvider = new MongoDataProvider();

export function getDataProvider() {
  return activeProvider;
}

export function setDataProvider(provider) {
  activeProvider = provider;
}
