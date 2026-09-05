import mongoose from 'mongoose';

const TransactionProductSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name: { type: String, required: true },
  category: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 }
}, { _id: false });

const TransactionSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  products: [TransactionProductSchema],
  totalAmount: { type: Number, required: true, min: 0 },
  paymentStatus: { 
    type: String, 
    enum: ['completed', 'failed', 'pending', 'refunded'], 
    default: 'completed',
    index: true 
  },
  paymentMethod: { 
    type: String, 
    enum: ['card', 'upi', 'netbanking', 'wallet', 'razorpay'], 
    default: 'card' 
  },
  transactionDate: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

TransactionSchema.index({ customerId: 1, transactionDate: -1 });
TransactionSchema.index({ paymentStatus: 1, transactionDate: -1 });

export const Transaction = mongoose.model('Transaction', TransactionSchema);
