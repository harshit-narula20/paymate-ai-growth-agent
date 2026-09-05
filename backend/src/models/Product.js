import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  inventory: { type: Number, default: 0 },
  salesCount: { type: Number, default: 0 },
  description: { type: String }
}, {
  timestamps: true
});

ProductSchema.index({ category: 1, salesCount: -1 });

export const Product = mongoose.model('Product', ProductSchema);
