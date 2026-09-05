import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Users,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Radio,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { OpportunityTypeBadge, PriorityBadge, StatusBadge, Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { Modal } from '../components/ui/Modal';

export function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [launchModalOpen, setLaunchModalOpen] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getOpportunityById(id);
      setOpportunity(res.data);
    } catch (err) {
      console.error('Failed to load opportunity:', err);
      setError(err.message || 'Opportunity not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleApproveAndLaunch = async () => {
    try {
      setExecuting(true);
      const res = await api.executeAgent(opportunity._id, {
        channel: opportunity.recommendedChannel || 'whatsapp'
      });
      setExecutionResult(res);
      fetchDetail();
    } catch (err) {
      console.error('Execution failed:', err);
      alert('Launch error: ' + (err.message || 'Check backend'));
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <LoadingState message="Loading opportunity analysis details..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDetail} />;
  if (!opportunity) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Back button */}
      <button
        onClick={() => navigate('/opportunities')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Opportunities
      </button>

      {/* Main Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <OpportunityTypeBadge type={opportunity.type} />
              <PriorityBadge priority={opportunity.priority} />
              <StatusBadge status={opportunity.status} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{opportunity.title}</h1>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">{opportunity.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="md"
              icon={Megaphone}
              onClick={() => navigate(`/campaigns?createFrom=${opportunity._id}`)}
            >
              Configure Campaign
            </Button>
            <Button
              variant="primary"
              size="md"
              icon={Zap}
              disabled={opportunity.status === 'executed'}
              onClick={() => {
                setExecutionResult(null);
                setLaunchModalOpen(true);
              }}
            >
              {opportunity.status === 'executed' ? 'Executed' : 'Approve & Launch'}
            </Button>
          </div>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Estimated Pipeline</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              ₹{(opportunity.estimatedRevenue || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Confidence Score</span>
            <p className="text-xl font-bold text-indigo-400 mt-1">
              {Math.round((opportunity.confidence || 0.8) * 100)}%
            </p>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Targeted Cohort</span>
            <p className="text-xl font-bold text-slate-100 mt-1">
              {opportunity.targetCustomerCount || opportunity.targetCustomers?.length || 0} Customers
            </p>
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Recommended Channel</span>
            <p className="text-xl font-bold text-slate-100 uppercase mt-1">
              {opportunity.recommendedChannel || 'WhatsApp'}
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Reasoning & Recommended Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>AI Strategic Reasoning</CardTitle>
            <CardDescription>Mathematical & behavioral logic from PayMate Engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs leading-relaxed text-slate-300">
            <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-slate-200">
              <p>{opportunity.reasoning || 'Customers exhibiting this behavioral cohort demonstrate high conversion elasticity when presented with tailored incentives.'}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                <span className="text-slate-400">Target Segment:</span>
                <span className="font-semibold text-white">{opportunity.targetSegment}</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-slate-800">
                <span className="text-slate-400">Recommended Offer:</span>
                <span className="font-semibold text-emerald-400">
                  {opportunity.offer?.value}{opportunity.offer?.type === 'percentage' ? '%' : ' INR'} OFF ({opportunity.offer?.code || 'GROWTH'})
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Action Plan</CardTitle>
            <CardDescription>Execution strategy and customer delivery specs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
              <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">Action Plan</span>
              <p className="text-slate-200 font-medium">{opportunity.recommendedAction}</p>
            </div>
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs space-y-1 text-slate-400">
              <p className="font-semibold text-slate-300">Autonomous Execution Details:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Dynamic multi-channel template rendering</li>
                <li>Single-use discount code attachment</li>
                <li>Simulated delivery & conversion tracking with AgentAction logging</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Target Customers Preview Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Target Cohort Customers</CardTitle>
            <CardDescription>Customers qualified in this opportunity segment ({opportunity.targetCustomers?.length || 0})</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/customers?segment=${opportunity.targetSegment}`)}
          >
            Explore Cohort in CRM
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-500 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Segment</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">AOV</th>
                  <th className="py-3 px-4">Last Purchase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {opportunity.targetCustomers?.slice(0, 8).map((c) => (
                  <tr key={c._id || c} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      {c.name || 'Sample Customer'}
                      <span className="block text-[11px] text-slate-500 font-normal">{c.email || 'customer@example.com'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="primary" size="sm">{c.segment || opportunity.targetSegment}</Badge>
                    </td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">
                      ₹{(c.totalSpent || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4">
                      ₹{(c.averageOrderValue || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {c.lastPurchaseDate ? new Date(c.lastPurchaseDate).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Launch Modal */}
      <Modal
        isOpen={launchModalOpen}
        onClose={() => setLaunchModalOpen(false)}
        title="Execute Autonomous Campaign"
      >
        <div className="space-y-4">
          {!executionResult ? (
            <>
              <p className="text-xs text-slate-300">
                Launch this campaign autonomously? PayMate will target <strong>{opportunity.targetCustomerCount || opportunity.targetCustomers?.length || 25} customers</strong> via <strong>{opportunity.recommendedChannel || 'WhatsApp'}</strong> with offer code <strong>{opportunity.offer?.code || 'GROWTH15'}</strong>.
              </p>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="ghost" onClick={() => setLaunchModalOpen(false)}>Cancel</Button>
                <Button variant="primary" loading={executing} icon={Zap} onClick={handleApproveAndLaunch}>
                  Approve & Launch
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
                  <p className="font-bold text-emerald-400 mt-0.5">{executionResult.results?.conversions}</p>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500">Revenue</span>
                  <p className="font-bold text-emerald-400 mt-0.5">₹{(executionResult.results?.actualRevenue || 0).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-2 bg-slate-950 border border-slate-800 rounded-lg">
                  <span className="text-slate-500">ROI</span>
                  <p className="font-bold text-indigo-400 mt-0.5">{executionResult.results?.roi}%</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <Button variant="primary" onClick={() => setLaunchModalOpen(false)}>Done</Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
