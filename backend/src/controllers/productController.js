import { Product } from '../models/index.js';

export class ProductController {
  static async getProducts(req, res, next) {
    try {
      const { category, sort = '-salesCount' } = req.query;
      const filter = {};
      if (category) filter.category = category;

      const products = await Product.find(filter).sort(sort).lean();
      const categories = await Product.distinct('category');

      res.json({
        success: true,
        data: products,
        categories,
        total: products.length
      });
    } catch (err) {
      next(err);
    }
  }
}
