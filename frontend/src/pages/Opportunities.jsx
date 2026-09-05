import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Zap,
  Users,
  Eye,
  Megaphone,
  CheckCircle2,
  Filter,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { OpportunityTypeBadge, PriorityBadge, StatusBadge, Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';

export function Opportunities() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [launchModalOpen, setLaunchModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getOpportunities(selectedType !== 'all' ? { type: selectedType } : {});
      setOpportunities(res.data || []);
    } catch (err) {
      console.error('Failed to load opportunities:', err);
      setError(err.message || 'Error fetching opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, [selectedType]);

  const handleLaunchModal = (opp) => {
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
      fetchOpportunities();
    } catch (err) {
      console.error('Execution error:', err);
      alert('Launch failed: ' + (err.message || 'Check backend server'));
    } finally {
      setExecuting(false);
    }
  };

  const handleCreateCampaign = (opp) => {
    navigate(`/campaigns?createFrom=${opp._id}`);
  };

  const types = [
    { key: 'all', label: 'All Opportunities' },
    { key: 'cross_sell', label: 'Cross-Sell' },
    { key: 'win_back', label: 'Win-Back' },
    { key: 'payment_recovery', label: 'Payment Recovery' },
    { key: 'churn_prevention', label: 'Churn Prevention' },
    { key: 'high_intent', label: 'High Intent' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Growth Opportunities
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic revenue leakages and expansion vectors detected by PayMate Agent
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchOpportunities}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" icon={Zap} onClick={() => navigate('/agent')}>
            New AI Scan
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {types.map((t) => (
          <button
            key={t.key}
            onClick={() => setSelectedType(t.key)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              selectedType === t.key
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <LoadingState message="Loading opportunities..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchOpportunities} />
      ) : opportunities.length === 0 ? (
        <EmptyState
          title="No Opportunities Found"
          description="Run an AI scan to discover new revenue opportunities across your store."
          actionLabel="Run Scan Now"
          onAction={() => navigate('/agent')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <Card key={opp._id} hover={true} className="flex flex-col justify-between border-slate-800 hover:border-slate-700">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <OpportunityTypeBadge type={opp.type} />
                  <div className="flex items-center gap-1.5">
                    <PriorityBadge priority={opp.priority} />
                    <StatusBadge status={opp.status} />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{opp.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{opp.description}</p>
                </div>

                {/* Metrics Box */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950/80 border border-slate-800/80 rounded-lg text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Est. Revenue</span>
                    <p className="text-base font-bold text-emerald-400 mt-0.5">
                      ₹{(opp.estimatedRevenue || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Confidence</span>
                    <p className="text-base font-bold text-indigo-400 mt-0.5">
                      {Math.round((opp.confidence || 0.8) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="text-xs space-y-1">
                  <span className="text-slate-400 font-medium">Recommended Action:</span>
                  <p className="text-slate-200 line-clamp-2 font-medium">{opp.recommendedAction}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Eye}
                  onClick={() => navigate(`/opportunities/${opp._id}`)}
                >
                  Details
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Megaphone}
                    onClick={() => handleCreateCampaign(opp)}
                  >
                    Campaign
                  </Button>
                  <Button
                    variant={opp.status === 'executed' ? 'outline' : 'primary'}
                    size="sm"
                    icon={Zap}
                    disabled={opp.status === 'executed'}
                    onClick={() => handleLaunchModal(opp)}
                  >
                    {opp.status === 'executed' ? 'Executed' : 'Approve & Launch'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Execution Modal */}
      <Modal
        isOpen={launchModalOpen}
        onClose={() => setLaunchModalOpen(false)}
        title="Autonomous Campaign Execution"
      >
        {selectedOpportunity && (
          <div className="space-y-4">
            {!executionResult ? (
              <>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-1">
                  <span className="text-slate-500">Selected Opportunity:</span>
                  <p className="font-bold text-slate-200">{selectedOpportunity.title}</p>
                  <p className="text-slate-400">Target Segment: {selectedOpportunity.targetSegment}</p>
                  <p className="text-emerald-400 font-semibold">Estimated Pipeline: ₹{(selectedOpportunity.estimatedRevenue || 0).toLocaleString('en-IN')}</p>
                </div>

                <p className="text-xs text-slate-300">
                  Are you sure you want to approve and execute this campaign autonomously? PayMate will generate personalized copy, deliver across {selectedOpportunity.recommendedChannel || 'WhatsApp'}, and record results.
                </p>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <Button variant="ghost" onClick={() => setLaunchModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" loading={executing} icon={Zap} onClick={handleApproveAndLaunch}>
                    Launch Now
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4 text-center">
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-1" />
                  <p className="font-bold text-sm text-white">Campaign Successfully Executed</p>
                  <span className="text-xs font-semibold">{executionResult.executionBadge}</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-500">Conversions</span>
                    <p className="font-bold text-emerald-400 text-sm mt-0.5">{executionResult.results?.conversions}</p>
                  </div>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-500">Revenue</span>
                    <p className="font-bold text-emerald-400 text-sm mt-0.5">₹{(executionResult.results?.actualRevenue || 0).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                    <span className="text-slate-500">ROI</span>
                    <p className="font-bold text-indigo-400 text-sm mt-0.5">{executionResult.results?.roi}%</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                  <Button variant="primary" onClick={() => setLaunchModalOpen(false)}>
                    Done
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
