import { Transaction } from '../models/index.js';

export class TransactionController {
  static async getTransactions(req, res, next) {
    try {
      const { paymentStatus, paymentMethod, page = 1, limit = 50 } = req.query;

      const filter = {};
      if (paymentStatus) filter.paymentStatus = paymentStatus;
      if (paymentMethod) filter.paymentMethod = paymentMethod;

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
      const skip = (pageNum - 1) * limitNum;

      const [transactions, total] = await Promise.all([
        Transaction.find(filter)
          .populate('customerId', 'name email phone segment')
          .sort({ transactionDate: -1 })
          .skip(skip)
          .limit(limitNum)
          .lean(),
        Transaction.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: transactions,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum)
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
