import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Megaphone,
  Zap,
  TrendingUp,
  CheckCircle2,
  Calendar,
  MessageSquare,
  Users,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { OpportunityTypeBadge, StatusBadge, Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

export function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [executing, setExecuting] = useState(false);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCampaignById(id);
      setCampaign(res.data);
    } catch (err) {
      console.error('Failed to load campaign:', err);
      setError(err.message || 'Campaign not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleExecute = async () => {
    try {
      setExecuting(true);
      await api.executeCampaign(id);
      fetchDetail();
    } catch (err) {
      console.error('Execution error:', err);
      alert('Execution failed: ' + (err.message || 'Check backend'));
    } finally {
      setExecuting(false);
    }
  };

  if (loading) return <LoadingState message="Loading campaign performance breakdown..." />;
  if (error) return <ErrorState message={error} onRetry={fetchDetail} />;
  if (!campaign) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <button
        onClick={() => navigate('/campaigns')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Campaigns
      </button>

      {/* Campaign Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <OpportunityTypeBadge type={campaign.type} />
              <StatusBadge status={campaign.status} />
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {campaign.channel || 'whatsapp'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{campaign.name}</h1>
            <p className="text-xs text-slate-400">
              Launched on {new Date(campaign.createdAt).toLocaleString()}
            </p>
          </div>

          {campaign.status !== 'completed' && (
            <Button
              variant="primary"
              size="md"
              icon={Zap}
              loading={executing}
              onClick={handleExecute}
            >
              Trigger Execution
            </Button>
          )}
        </div>

        {/* Financial Performance KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Actual Revenue</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              ₹{(campaign.actualRevenue || campaign.estimatedRevenue || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Conversions</span>
            <p className="text-2xl font-bold text-slate-100 mt-1">
              {campaign.conversions || 0} Orders
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Targeted Audience</span>
            <p className="text-2xl font-bold text-slate-100 mt-1">
              {campaign.targetCustomers?.length || 25} Customers
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">ROI Ratio</span>
            <p className="text-2xl font-bold text-indigo-400 mt-1">
              {campaign.roi ? `${campaign.roi}%` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Message Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Delivered Campaign Copy</CardTitle>
            <CardDescription>Personalized template sent to customers via {campaign.channel || 'WhatsApp'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span className="font-semibold text-indigo-400">Channel: {campaign.channel?.toUpperCase() || 'WHATSAPP'}</span>
                <Badge variant="success" size="sm">Delivered [SIMULATED]</Badge>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line">
                {campaign.message}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Promo Code Attached:</span>
                <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {campaign.offer?.code || 'GROWTH15'} ({campaign.offer?.value || 15}% OFF)
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Execution Metadata & Safeguards */}
        <Card>
          <CardHeader>
            <CardTitle>Execution Details</CardTitle>
            <CardDescription>Autonomous telemetry & dispatch parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Execution Badge</span>
              <span className="font-bold text-indigo-300">DEMO/SIMULATED</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Target Segment</span>
              <span className="font-semibold text-slate-200">{campaign.targetSegment || 'Targeted Cohort'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800">
              <span className="text-slate-400">Execution Timestamp</span>
              <span className="font-mono text-slate-300">{campaign.executedAt ? new Date(campaign.executedAt).toLocaleString() : 'Pending'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Opportunity Link</span>
              <span className="font-semibold text-indigo-400 cursor-pointer" onClick={() => campaign.opportunityId?._id && navigate(`/opportunities/${campaign.opportunityId._id}`)}>
                {campaign.opportunityId?.title || 'Linked Opportunity'} →
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
