import mongoose from 'mongoose';

const MerchantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  businessName: { type: String, default: 'Apex Athletics & Commerce' },
  businessType: { type: String, default: 'e-commerce' },
  currency: { type: String, default: 'INR' },
  settings: {
    autonomousExecution: { type: Boolean, default: false },
    minConfidenceThreshold: { type: Number, default: 0.75 },
    preferredChannels: { type: [String], default: ['email', 'whatsapp'] }
  },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

export const Merchant = mongoose.model('Merchant', MerchantSchema);
