import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Sparkles,
  Send,
  Zap,
  TrendingUp,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  Users,
  Megaphone,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { OpportunityTypeBadge, PriorityBadge, Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { LoadingState } from '../components/ui/LoadingState';

const SUGGESTED_PROMPTS = [
  "Find my biggest growth opportunity.",
  "Which customers are most likely to churn?",
  "How can I increase revenue this week?",
  "Find customers suitable for cross-selling.",
  "Which failed payments should I prioritize?"
];

export function AgentPage() {
  const navigate = useNavigate();
  const [promptInput, setPromptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [agentResult, setAgentResult] = useState(null);
  const [error, setError] = useState('');
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const handleAskAgent = async (promptToUse) => {
    const query = promptToUse || promptInput;
    if (!query) return;

    try {
      setLoading(true);
      setError('');
      setAgentResult(null);
      setExecutionResult(null);
      const res = await api.analyzeAgent(query);
      setAgentResult(res);
    } catch (err) {
      console.error('Agent analysis error:', err);
      setError(err.message || 'Unable to contact the AI Agent. Check that the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Initial auto-scan on mount if no result
  useEffect(() => {
    handleAskAgent('Find my biggest growth opportunity.');
  }, []);

  const handleOpenLaunchModal = (opp) => {
    setSelectedOpportunity(opp);
    setExecutionResult(null);
    setLaunchModalOpen(true);
  };

  const handleApproveAndLaunch = async () => {
    if (!selectedOpportunity) return;
    try {
      setExecuting(true);
      const res = await api.executeAgent(selectedOpportunity._id, {
        channel: selectedOpportunity.recommendedChannel || 'whatsapp'
      });
      setExecutionResult(res);
      // Refresh current agent results
      handleAskAgent(promptInput || 'Find my biggest growth opportunity.');
    } catch (err) {
      console.error('Campaign launch error:', err);
      alert('Launch failed: ' + (err.message || 'Check backend logs'));
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Agent Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border border-indigo-500/30 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30 text-white">
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">PayMate Autonomous Growth Agent</h1>
                <Badge variant="primary" size="sm">{agentResult?.mode || 'AI Mode: Demo'}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Continuously analyzes live customers, transactions, and failed payments to discover high-ROI interventions.
              </p>
            </div>
          </div>
        </div>

        {/* Prompt Input Box */}
        <div className="mt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAgent();
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Ask PayMate (e.g. 'Find my biggest growth opportunity' or 'Which customers are at churn risk?')..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3.5 pl-11 pr-28 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-inner"
            />
            <MessageSquare className="w-4 h-4 text-slate-500 absolute left-4" />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              disabled={loading}
              icon={Send}
              className="absolute right-2 shadow-sm"
            >
              Analyze
            </Button>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Suggested:
            </span>
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                disabled={loading}
                onClick={() => {
                  setPromptInput(prompt);
                  handleAskAgent(prompt);
                }}
                className="text-xs text-slate-400 hover:text-indigo-300 bg-slate-800/60 hover:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700/60 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <LoadingState message="PayMate Agent is querying live MongoDB collections and generating strategic recommendations..." />
      )}

      {error && !loading && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-sm text-rose-300">
          <strong className="block text-rose-200">Agent analysis failed</strong>
          <span>{error}</span>
        </div>
      )}

      {/* Agent Analysis Results */}
      {!loading && agentResult && (
        <div className="space-y-6">
          {agentResult.answer && (
            <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-400">Agent Answer</p>
                  <h2 className="text-lg font-bold text-white mt-1">{agentResult.answer.label}</h2>
                </div>
                <Badge variant="primary" size="sm">Detected: {agentResult.intent?.replaceAll('_', ' ')}</Badge>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{agentResult.answer.summary}</p>

              {agentResult.answer.metrics && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(agentResult.answer.metrics).map(([key, value]) => (
                    <div key={key} className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                      <span className="text-[11px] text-slate-500 capitalize">{key.replaceAll(/([A-Z])/g, ' $1')}</span>
                      <p className="text-base font-bold text-emerald-400 mt-1">
                        {typeof value === 'number' && (key.toLowerCase().includes('revenue') || key.toLowerCase().includes('opportunity'))
                          ? `₹${value.toLocaleString('en-IN')}`
                          : typeof value === 'number' && key === 'confidence'
                            ? `${Math.round(value * 100)}%`
                            : value}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {agentResult.answer.recommendedProduct && (
                <p className="text-xs text-slate-300"><span className="font-semibold text-indigo-300">Recommended product:</span> {agentResult.answer.recommendedProduct}</p>
              )}
              {agentResult.answer.recommendedAction && (
                <p className="text-xs text-slate-300"><span className="font-semibold text-indigo-300">Recommended action:</span> {agentResult.answer.recommendedAction}</p>
              )}
              {agentResult.intent === 'revenue_growth' && agentResult.answer.topOpportunities?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2">Top opportunities</p>
                  <div className="space-y-2">
                    {agentResult.answer.topOpportunities.map(opportunity => (
                      <div key={opportunity.type} className="flex items-center justify-between gap-3 text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                        <span className="text-slate-300">{opportunity.title}</span>
                        <span className="font-semibold text-emerald-300 whitespace-nowrap">₹{opportunity.estimatedRevenue.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {agentResult.answer.reasoning && (
                <p className="text-xs text-slate-400 leading-relaxed">{agentResult.answer.reasoning}</p>
              )}

              {agentResult.answer.customers?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2">Relevant customers</p>
                  <div className="flex flex-wrap gap-2">
                    {agentResult.answer.customers.map(customer => (
                      <span key={customer.id} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        {customer.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {agentResult.answer.transactions?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-300 mb-2">Highest-priority failed transactions</p>
                  <div className="space-y-2">
                    {agentResult.answer.transactions.slice(0, 5).map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                        <span className="text-slate-300">{transaction.customerName} <span className="text-slate-500">({transaction.failureReason || 'failed'})</span></span>
                        <span className="font-semibold text-rose-300">₹{transaction.amount.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Agent High-Level Insight Callout */}
          {agentResult.summary && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Agent Reasoning</h4>
                <p className="text-sm text-slate-200 mt-1 leading-relaxed">{agentResult.summary}</p>
              </div>
            </div>
          )}

          {/* Opportunities Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-100">
                Discovered Opportunities ({agentResult.opportunities?.length || 0})
              </h2>
              <span className="text-xs text-slate-400">Ranked by Expected ROI & Confidence</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agentResult.opportunities?.map((opp, index) => (
                <Card key={opp._id || index} className="flex flex-col justify-between border-slate-800 hover:border-slate-700 transition-all">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            ★ Top Opportunity
                          </span>
                        )}
                        <OpportunityTypeBadge type={opp.type} />
                      </div>
                      <PriorityBadge priority={opp.priority || 'high'} />
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-base font-bold text-slate-100">{opp.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{opp.description}</p>
                    </div>

                    {/* Metrics Banner */}
                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg text-xs">
                      <div>
                        <span className="text-slate-500 text-[11px]">Estimated Revenue</span>
                        <p className="text-lg font-bold text-emerald-400">
                          ₹{(opp.estimatedRevenue || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-500 text-[11px]">Agent Confidence</span>
                        <p className="text-lg font-bold text-indigo-400">
                          {Math.round((opp.confidence || 0.8) * 100)}%
                        </p>
                      </div>
                    </div>

                    {/* Why PayMate Recommends This */}
                    {opp.reasoning && (
                      <div className="text-xs p-3 bg-indigo-950/20 border border-indigo-500/20 rounded-lg">
                        <span className="font-semibold text-indigo-300 block mb-1">Why PayMate recommends this:</span>
                        <p className="text-slate-300 leading-relaxed">{opp.reasoning}</p>
                      </div>
                    )}

                    {/* Recommended Action */}
                    <div className="text-xs space-y-1">
                      <span className="font-medium text-slate-400">Recommended Action:</span>
                      <p className="font-medium text-slate-200">{opp.recommendedAction}</p>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Users}
                      onClick={() => navigate(`/customers?segment=${opp.targetSegment || ''}`)}
                    >
                      View Customers
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={Megaphone}
                        onClick={() => navigate(`/opportunities/${opp._id || ''}`)}
                      >
                        Details
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Zap}
                        onClick={() => handleOpenLaunchModal(opp)}
                      >
                        Approve & Launch
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campaign Approval & Launch Modal */}
      <Modal
        isOpen={launchModalOpen}
        onClose={() => setLaunchModalOpen(false)}
        title="Merchant Approval: Launch Autonomous Campaign"
        maxWidth="max-w-2xl"
      >
        {selectedOpportunity && (
          <div className="space-y-5">
            {!executionResult ? (
              <>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">Target Opportunity</span>
                    <OpportunityTypeBadge type={selectedOpportunity.type} />
                  </div>
                  <h4 className="text-sm font-bold text-white">{selectedOpportunity.title}</h4>
                  <p className="text-xs text-slate-400">{selectedOpportunity.description}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs text-center">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-500">Target Segment</span>
                    <p className="font-bold text-slate-200 mt-1">{selectedOpportunity.targetSegment}</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-500">Est. Revenue</span>
                    <p className="font-bold text-emerald-400 mt-1">₹{(selectedOpportunity.estimatedRevenue || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-500">Channel</span>
                    <p className="font-bold text-indigo-400 uppercase mt-1">{selectedOpportunity.recommendedChannel || 'WhatsApp'}</p>
                  </div>
                </div>

                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs text-amber-300">
                  ⚠️ <strong>Human-in-the-Loop Safeguard:</strong> Approving triggers the autonomous execution engine.
                  This simulates customer delivery, records the campaign, and creates an audit entry in AgentAction.
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button variant="ghost" onClick={() => setLaunchModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    loading={executing}
                    icon={Zap}
                    onClick={handleApproveAndLaunch}
                  >
                    Confirm & Execute Campaign
                  </Button>
                </div>
              </>
            ) : (
              /* Simulation Execution Results View */
              <div className="space-y-5 animate-in fade-in">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Campaign Launched Successfully!</h4>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold">
                    {executionResult.executionBadge}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-400">Targeted</span>
                    <p className="text-base font-bold text-slate-200 mt-0.5">
                      {executionResult.results?.targetedCustomers}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-400">Conversions</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      {executionResult.results?.conversions}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-400">Revenue Generated</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      ₹{(executionResult.results?.actualRevenue || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-400">ROI</span>
                    <p className="text-base font-bold text-indigo-400 mt-0.5">
                      {executionResult.results?.roi}%
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-400">
                  <p>AgentAction audit entry recorded in MongoDB. Opportunity marked as executed and Campaign metrics stored.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setLaunchModalOpen(false);
                      navigate('/campaigns');
                    }}
                  >
                    View All Campaigns
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setLaunchModalOpen(false);
                      navigate('/activity');
                    }}
                  >
                    View Agent Audit Feed
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
