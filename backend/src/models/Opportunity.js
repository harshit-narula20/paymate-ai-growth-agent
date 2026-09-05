import mongoose from 'mongoose';

const OpportunitySchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['cross_sell', 'win_back', 'churn_prevention', 'payment_recovery', 'high_intent'], 
    required: true,
    index: true 
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetSegment: { type: String, required: true },
  targetCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  targetCustomerCount: { type: Number, default: 0 },
  estimatedRevenue: { type: Number, required: true },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  priority: { 
    type: String, 
    enum: ['high', 'medium', 'low'], 
    default: 'medium',
    index: true 
  },
  recommendedAction: { type: String, required: true },
  recommendedChannel: { 
    type: String, 
    enum: ['email', 'sms', 'whatsapp', 'in_app'], 
    default: 'email' 
  },
  offer: {
    type: { type: String, enum: ['percentage', 'flat', 'free_shipping'], default: 'percentage' },
    value: { type: Number, default: 10 },
    code: { type: String }
  },
  reasoning: { type: String },
  status: { 
    type: String, 
    enum: ['identified', 'approved', 'executed', 'dismissed'], 
    default: 'identified',
    index: true 
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

OpportunitySchema.index({ status: 1, priority: 1 });

export const Opportunity = mongoose.model('Opportunity', OpportunitySchema);
