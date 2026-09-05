import mongoose from 'mongoose';

const CampaignSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { 
    type: String, 
    enum: ['cross_sell', 'win_back', 'churn_prevention', 'payment_recovery', 'high_intent'], 
    required: true,
    index: true 
  },
  targetCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Customer' }],
  targetSegment: { type: String },
  channel: { type: String, enum: ['email', 'sms', 'whatsapp', 'in_app'], default: 'email' },
  message: { type: String, required: true },
  offer: {
    type: { type: String, enum: ['percentage', 'flat', 'free_shipping'], default: 'percentage' },
    value: { type: Number, default: 10 },
    code: { type: String }
  },
  status: { 
    type: String, 
    enum: ['draft', 'active', 'completed', 'cancelled'], 
    default: 'active',
    index: true 
  },
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
  estimatedRevenue: { type: Number, default: 0 },
  actualRevenue: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  roi: { type: Number, default: 0 },
  executedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

CampaignSchema.index({ status: 1, createdAt: -1 });

export const Campaign = mongoose.model('Campaign', CampaignSchema);
