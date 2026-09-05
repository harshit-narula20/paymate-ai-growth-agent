import { Payment } from '../models/index.js';
import { getDataProvider } from '../services/dataProvider.js';

export class PaymentController {
  static async getFailedPayments(req, res, next) {
    try {
      const provider = getDataProvider();
      const failedPayments = await provider.getFailedPayments();

      const totalRecoverable = failedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      res.json({
        success: true,
        data: failedPayments,
        totalCount: failedPayments.length,
        totalRecoverable
      });
    } catch (err) {
      next(err);
    }
  }

  static async getPayments(req, res, next) {
    try {
      const { status, limit = 50 } = req.query;
      const filter = {};
      if (status) filter.status = status;

      const payments = await Payment.find(filter)
        .populate('customerId', 'name email phone segment')
        .populate('transactionId', 'totalAmount paymentMethod')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit, 10))
        .lean();

      res.json({
        success: true,
        data: payments,
        total: payments.length
      });
    } catch (err) {
      next(err);
    }
  }
}
