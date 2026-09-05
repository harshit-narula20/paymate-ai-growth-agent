import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, trim: true },
  segment: { 
    type: String, 
    enum: ['high_ltv', 'loyal', 'shoe_buyer', 'at_risk', 'inactive', 'new', 'failed_payment'],
    default: 'new',
    index: true 
  },
  totalSpent: { type: Number, default: 0, index: true },
  purchaseCount: { type: Number, default: 0, index: true },
  lastPurchaseDate: { type: Date, index: true },
  averageOrderValue: { type: Number, default: 0 },
  churnRisk: { 
    type: String, 
    enum: ['high', 'medium', 'low'], 
    default: 'low',
    index: true 
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

CustomerSchema.index({ churnRisk: 1, lastPurchaseDate: 1 });

export const Customer = mongoose.model('Customer', CustomerSchema);
