import mongoose from 'mongoose';

const AgentActionSchema = new mongoose.Schema({
  opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign' },
  actionType: { 
    type: String, 
    enum: [
      'analyze_data', 
      'identify_opportunity', 
      'generate_recommendation', 
      'execute_campaign', 
      'recover_payment', 
      'sync_razorpay'
    ], 
    required: true,
    index: true 
  },
  input: { type: mongoose.Schema.Types.Mixed },
  output: { type: mongoose.Schema.Types.Mixed },
  status: { 
    type: String, 
    enum: ['pending', 'in_progress', 'completed', 'failed'], 
    default: 'completed',
    index: true 
  },
  aiProvider: { type: String, default: 'demo' },
  executedAt: { type: Date, default: Date.now, index: true }
}, {
  timestamps: true
});

AgentActionSchema.index({ opportunityId: 1, executedAt: -1 });

export const AgentAction = mongoose.model('AgentAction', AgentActionSchema);
