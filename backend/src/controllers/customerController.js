import { Customer, Transaction, Payment } from '../models/index.js';

export class CustomerController {
  static async getCustomers(req, res, next) {
    try {
      const { segment, churnRisk, sort = '-totalSpent', page = 1, limit = 50, search } = req.query;

      const filter = {};
      if (segment) filter.segment = segment;
      if (churnRisk) filter.churnRisk = churnRisk;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const pageNum = Math.max(1, parseInt(page, 10));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
      const skip = (pageNum - 1) * limitNum;

      const [customers, total] = await Promise.all([
        Customer.find(filter).sort(sort).skip(skip).limit(limitNum).lean(),
        Customer.countDocuments(filter)
      ]);

      res.json({
        success: true,
        data: customers,
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

  static async getCustomerById(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id).lean();

      if (!customer) {
        return res.status(404).json({ success: false, error: { message: 'Customer not found' } });
      }

      const [transactions, payments] = await Promise.all([
        Transaction.find({ customerId: id }).sort({ transactionDate: -1 }).limit(20).lean(),
        Payment.find({ customerId: id }).sort({ createdAt: -1 }).limit(20).lean()
      ]);

      res.json({
        success: true,
        data: {
          ...customer,
          transactions,
          payments
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
