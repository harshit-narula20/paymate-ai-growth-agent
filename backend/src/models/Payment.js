import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true, index: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  status: { 
    type: String, 
    enum: ['success', 'failed', 'pending', 'retrying', 'recovered'], 
    default: 'success',
    index: true 
  },
  failureReason: { 
    type: String, 
    enum: ['insufficient_funds', 'gateway_timeout', 'expired_card', 'bank_declined', 'authentication_failed', null],
    default: null 
  },
  retryCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

PaymentSchema.index({ status: 1, createdAt: -1 });

export const Payment = mongoose.model('Payment', PaymentSchema);
