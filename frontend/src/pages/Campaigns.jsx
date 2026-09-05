import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Megaphone,
  Plus,
  TrendingUp,
  Eye,
  Zap,
  CheckCircle2,
  Calendar,
  DollarSign
} from 'lucide-react';
import { api } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { OpportunityTypeBadge, StatusBadge, Badge } from '../components/ui/Badge';
import { LoadingState, SkeletonRow } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { Modal } from '../components/ui/Modal';

export function Campaigns() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const createFromOppId = searchParams.get('createFrom');

  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: '',
    type: 'cross_sell',
    channel: 'whatsapp',
    message: '',
    offerValue: 15,
    offerCode: 'GROWTH15'
  });

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCampaigns();
      setCampaigns(res.data || []);
    } catch (err) {
      console.error('Failed to load campaigns:', err);
      setError(err.message || 'Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    if (createFromOppId) {
      api.getOpportunityById(createFromOppId).then(res => {
        const opp = res.data;
        if (opp) {
          setForm({
            name: `Autonomous: ${opp.title}`,
            type: opp.type,
            channel: opp.recommendedChannel || 'whatsapp',
            message: `Hi {{name}}, unlock ${opp.offer?.value || 15}% off with code ${opp.offer?.code || 'GROWTH15'}. Limited time only!`,
            offerValue: opp.offer?.value || 15,
            offerCode: opp.offer?.code || 'GROWTH15'
          });
          setCreateModalOpen(true);
        }
      }).catch(console.error);
    }
  }, [createFromOppId]);

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await api.createCampaign({
        name: form.name,
        type: form.type,
        channel: form.channel,
        message: form.message,
        offer: {
          type: 'percentage',
          value: Number(form.offerValue),
          code: form.offerCode
        },
        status: 'active'
      });
      setCreateModalOpen(false);
      fetchCampaigns();
    } catch (err) {
      console.error('Error creating campaign:', err);
      alert('Creation failed: ' + (err.message || 'Check backend'));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-indigo-400" /> Marketing & Recovery Campaigns
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous growth and retention campaigns generated and executed by PayMate
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => {
            setForm({
              name: 'New Custom Growth Campaign',
              type: 'cross_sell',
              channel: 'whatsapp',
              message: 'Exclusive limited time offer inside for you!',
              offerValue: 15,
              offerCode: 'GROWTH15'
            });
            setCreateModalOpen(true);
          }}
        >
          Create Campaign
        </Button>
      </div>

      {/* Campaigns Table */}
      {loading ? (
        <LoadingState message="Loading campaign registry..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCampaigns} />
      ) : campaigns.length === 0 ? (
        <EmptyState
          title="No Campaigns Executed Yet"
          description="Approve and launch an opportunity to see autonomous campaigns and live ROI tracking here."
          actionLabel="View Opportunities"
          onAction={() => navigate('/opportunities')}
        />
      ) : (
        <Card className="overflow-hidden p-0 border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-500 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Campaign Name</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Channel</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Targeted</th>
                  <th className="py-3.5 px-4">Conversions</th>
                  <th className="py-3.5 px-4">Actual Revenue</th>
                  <th className="py-3.5 px-4">ROI</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {campaigns.map((camp) => (
                  <tr
                    key={camp._id}
                    onClick={() => navigate(`/campaigns/${camp._id}`)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-semibold text-slate-100">
                      {camp.name}
                      <span className="block text-[11px] text-slate-500 font-normal">
                        Created {new Date(camp.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <OpportunityTypeBadge type={camp.type} />
                    </td>
                    <td className="py-3.5 px-4 uppercase font-semibold text-indigo-400 text-[11px]">
                      {camp.channel || 'whatsapp'}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={camp.status} />
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      {camp.targetCustomers?.length || 25}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {camp.conversions || 0}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      ₹{(camp.actualRevenue || camp.estimatedRevenue || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-400">
                      {camp.roi ? `${camp.roi}%` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        icon={Eye}
                        onClick={() => navigate(`/campaigns/${camp._id}`)}
                      >
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create Campaign Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Growth Campaign"
      >
        <form onSubmit={handleCreateCampaign} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Campaign Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Campaign Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="cross_sell">Cross-Sell</option>
                <option value="win_back">Win-Back</option>
                <option value="churn_prevention">Churn Prevention</option>
                <option value="payment_recovery">Payment Recovery</option>
                <option value="high_intent">High Intent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Channel</label>
              <select
                value={form.channel}
                onChange={(e) => setForm({ ...form, channel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="whatsapp">WhatsApp (High Conversion)</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="in_app">In-App Banner</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Discount Value (%)</label>
              <input
                type="number"
                value={form.offerValue}
                onChange={(e) => setForm({ ...form, offerValue: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Offer Promo Code</label>
              <input
                type="text"
                value={form.offerCode}
                onChange={(e) => setForm({ ...form, offerCode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Message Template</label>
            <textarea
              rows={3}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="ghost" onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={creating}>Create Campaign</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
