import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  ShoppingBag,
  Sparkles,
  Zap,
  CreditCard,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, StatusBadge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { Modal } from '../components/ui/Modal';

export function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [generatedOffer, setGeneratedOffer] = useState(null);
  const [generatingOffer, setGeneratingOffer] = useState(false);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getCustomerById(id);
      setCustomer(res.data);
    } catch (err) {
      console.error('Failed to load customer:', err);
      setError(err.message || 'Customer profile not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomer();
  }, [id]);

  const handleGenerateOffer = async () => {
    try {
      setGeneratingOffer(true);
      // Simulate generating tailored 1-on-1 incentive
      setTimeout(() => {
        let code = 'RECOVER10';
        let discount = 15;
        let message = `Hi ${customer.name}, we appreciate your loyalty! Here is an exclusive 15% discount for your next order.`;

        if (customer.churnRisk === 'high') {
          code = 'COMEBACK25';
          discount = 25;
          message = `Hi ${customer.name}, we noticed you haven't visited recently! Enjoy 25% off anything in store with voucher code ${code}.`;
        } else if (customer.segment === 'shoe_buyer') {
          code = 'GEARUP20';
          discount = 20;
          message = `Hi ${customer.name}, complete your running gear! Take 20% off all socks, insoles, and cleaner kits with code ${code}.`;
        }

        setGeneratedOffer({
          code,
          discount,
          message,
          channel: 'whatsapp'
        });
        setGeneratingOffer(false);
        setOfferModalOpen(true);
      }, 600);
    } catch (err) {
      setGeneratingOffer(false);
      alert('Error generating offer: ' + err.message);
    }
  };

  if (loading) return <LoadingState message="Loading customer profile & transaction history..." />;
  if (error) return <ErrorState message={error} onRetry={fetchCustomer} />;
  if (!customer) return null;

  // AI Recommendation text based on segment & churn risk
  const getAIRecommendation = () => {
    if (customer.segment === 'failed_payment') {
      return {
        title: 'Immediate 1-Click Payment Recovery',
        text: 'Customer abandoned checkout due to banking gateway decline. Trigger 1-click WhatsApp payment link to restore cart.',
        action: 'Send 1-Click Recovery Link'
      };
    }
    if (customer.churnRisk === 'high' || customer.segment === 'inactive') {
      return {
        title: 'Personalized Win-Back Incentive',
        text: 'High historical purchase value but dormant for >60 days. Recommend sending 20% "We Miss You" reactivation voucher.',
        action: 'Generate Win-Back Voucher'
      };
    }
    if (customer.segment === 'shoe_buyer') {
      return {
        title: 'Complementary Accessory Cross-Sell',
        text: 'Customer has purchased footwear but 0 accessories. Offer 15% discount bundle on running socks and arch insoles.',
        action: 'Recommend Gear Bundle'
      };
    }
    return {
      title: 'VIP Loyalty Tier Upgrade',
      text: 'Consistent buyer with high repeat frequency. Invite to Apex VIP Club for early drop access and priority shipping.',
      action: 'Generate VIP Invitation'
    };
  };

  const aiRec = getAIRecommendation();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <button
        onClick={() => navigate('/customers')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </button>

      {/* Customer Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xl font-bold text-indigo-400">
              {customer.name?.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">{customer.name}</h1>
                <Badge variant="primary" size="sm">{customer.segment?.replace('_', ' ')}</Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-1 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {customer.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {customer.phone}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Customer since {new Date(customer.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={Sparkles}
            loading={generatingOffer}
            onClick={handleGenerateOffer}
          >
            Generate AI Offer
          </Button>
        </div>

        {/* Profile Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Spent</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              ₹{(customer.totalSpent || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Total Orders</span>
            <p className="text-2xl font-bold text-slate-100 mt-1">
              {customer.purchaseCount || 0}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Average Order Value</span>
            <p className="text-2xl font-bold text-slate-100 mt-1">
              ₹{(customer.averageOrderValue || 0).toLocaleString('en-IN')}
            </p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Churn Risk</span>
            <div className="mt-1">
              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                customer.churnRisk === 'high' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              }`}>
                {customer.churnRisk?.toUpperCase() || 'LOW'} CHURN RISK
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Box */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/30 border border-indigo-500/30 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider">AI Recommendation</h3>
            <p className="text-sm font-semibold text-white mt-0.5">{aiRec.title}</p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">{aiRec.text}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          icon={Zap}
          onClick={handleGenerateOffer}
          className="shrink-0"
        >
          {aiRec.action}
        </Button>
      </div>

      {/* Order / Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction & Order History ({customer.transactions?.length || 0})</CardTitle>
          <CardDescription>All purchase orders and checkout attempts recorded for this customer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 uppercase text-[10px] tracking-wider text-slate-500 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {customer.transactions?.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(tx.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {tx.products?.map(p => p.name).join(', ') || 'Apex Sport Item'}
                    </td>
                    <td className="py-3 px-4 font-bold text-emerald-400">
                      ₹{tx.totalAmount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 uppercase text-slate-400 font-mono text-[11px]">
                      {tx.paymentMethod}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={tx.paymentStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 1-on-1 Offer Modal */}
      <Modal
        isOpen={offerModalOpen}
        onClose={() => setOfferModalOpen(false)}
        title="Personalized 1-on-1 AI Offer"
      >
        {generatedOffer && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Channel: WhatsApp</span>
                <Badge variant="success" size="sm">Offer Code: {generatedOffer.code}</Badge>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">{generatedOffer.message}</p>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <Button variant="ghost" onClick={() => setOfferModalOpen(false)}>Close</Button>
              <Button
                variant="primary"
                onClick={() => {
                  alert(`Dispatched personalized offer ${generatedOffer.code} to ${customer.phone}! [DEMO/SIMULATED]`);
                  setOfferModalOpen(false);
                }}
              >
                Send via WhatsApp [SIMULATED]
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
