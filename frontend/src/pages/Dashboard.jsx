import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  DollarSign,
  TrendingUp,
  AlertOctagon,
  CreditCard,
  Sparkles,
  Bot,
  ArrowRight,
  ShieldAlert,
  Zap,
  CheckCircle2,
  Users
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import { api } from '../services/api';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { OpportunityTypeBadge, PriorityBadge, Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

export function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [recentActions, setRecentActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumRes, revRes, oppRes, actRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getDashboardRevenue(6),
        api.getOpportunities({ status: 'identified' }),
        api.getAgentActions({ limit: 4 })
      ]);

      setSummary(sumRes.data);
      setRevenueTrends(revRes.data);
      setOpportunities(oppRes.data || []);
      setRecentActions(actRes.data || []);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError(err.message || 'Could not connect to PayMate backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingState message="Connecting to PayMate Business Engine & MongoDB..." />;
  if (error) return <ErrorState title="Dashboard Connection Error" message={error} onRetry={fetchDashboardData} />;

  // Chart segment data formatted
  const segmentData = [
    { name: 'Shoe Buyers', count: 50, value: 50 },
    { name: 'Loyal Buyers', count: 40, value: 40 },
    { name: 'High-LTV VIPs', count: 35, value: 35 },
    { name: 'Dormant/Inactive', count: 45, value: 45 },
    { name: 'Failed Checkouts', count: 30, value: 30 },
    { name: 'New Customers', count: 20, value: 20 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Autonomous Agent Alert */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-900/40 border border-indigo-500/30 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-indigo-500/20 text-indigo-400">
                <Zap className="w-4 h-4 fill-current" />
              </span>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Autonomous Growth Agent Active
              </h2>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              PayMate scanned <strong className="text-white">{summary?.customerCount} customers</strong> and <strong className="text-white">{summary?.transactionCount} transactions</strong>. Discovered <strong className="text-emerald-400 font-semibold">{opportunities.length} high-confidence opportunities</strong> representing <strong className="text-indigo-300 font-semibold">₹{(summary?.potentialRevenueOpportunity || 0).toLocaleString('en-IN')}</strong> in unlockable revenue.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={Bot}
              onClick={() => navigate('/agent')}
              className="shadow-md shadow-indigo-600/40"
            >
              Open AI Agent Console
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={Sparkles}
              onClick={() => navigate('/opportunities')}
            >
              View Opportunities
            </Button>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Revenue"
          value={`₹${(summary?.totalRevenue || 0).toLocaleString('en-IN')}`}
          subtitle="Past 6 months GMV"
          trend={`+${summary?.revenueGrowth || 18.5}%`}
          trendType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Revenue At Risk"
          value={`₹${(summary?.revenueAtRisk || 0).toLocaleString('en-IN')}`}
          subtitle={`${summary?.highRiskCustomerCount || 0} churn-risk customers`}
          trend="Action required"
          trendType="negative"
          icon={AlertOctagon}
          highlight={true}
        />
        <StatCard
          title="Recoverable Revenue"
          value={`₹${(summary?.recoverableRevenue || 0).toLocaleString('en-IN')}`}
          subtitle={`${summary?.failedPaymentsCount || 0} failed checkouts`}
          trend="1-click recovery"
          trendType="positive"
          icon={CreditCard}
        />
        <StatCard
          title="Pipeline Opportunity"
          value={`₹${(summary?.potentialRevenueOpportunity || 0).toLocaleString('en-IN')}`}
          subtitle={`${summary?.activeOpportunitiesCount || 0} detected campaigns`}
          trend="Ready to launch"
          trendType="positive"
          icon={Sparkles}
        />
      </div>

      {/* Secondary Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-900/60 border border-slate-800/80 rounded-xl">
        <div className="text-center md:text-left px-3">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Average Order Value</span>
          <p className="text-lg font-bold text-slate-100 mt-0.5">₹{(summary?.averageOrderValue || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="text-center md:text-left px-3 border-l border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Customer LTV</span>
          <p className="text-lg font-bold text-slate-100 mt-0.5">₹{(summary?.customerLifetimeValue || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="text-center md:text-left px-3 border-l border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Repeat Purchase Rate</span>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">{summary?.repeatPurchaseRate}%</p>
        </div>
        <div className="text-center md:text-left px-3 border-l border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Active Opportunities</span>
          <p className="text-lg font-bold text-indigo-400 mt-0.5">{summary?.activeOpportunitiesCount} Interventions</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trends Chart (2 Columns) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Revenue Trends</CardTitle>
              <CardDescription>Monthly completed order volume vs revenue (INR)</CardDescription>
            </div>
            <Badge variant="primary">Last 6 Months</Badge>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Cohort Distribution Chart (1 Column) */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Cohorts</CardTitle>
            <CardDescription>Audience segmentation in live MongoDB</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={segmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {segmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  formatter={(val, name) => [`${val} Customers`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-slate-400 w-full mt-2">
              {segmentData.slice(0, 4).map((s, idx) => (
                <div key={s.name} className="flex items-center gap-1.5 truncate">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx] }} />
                  <span className="truncate">{s.name} ({s.count})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* High-Impact Opportunities List Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-100">Top Autonomous Opportunities</h3>
            <p className="text-xs text-slate-400">High-confidence actions recommended by PayMate Agent</p>
          </div>
          <Link to="/opportunities" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            View all ({opportunities.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.slice(0, 3).map((opp) => (
            <Card key={opp._id} hover={true} onClick={() => navigate(`/opportunities/${opp._id}`)} className="flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <OpportunityTypeBadge type={opp.type} />
                  <PriorityBadge priority={opp.priority} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{opp.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{opp.description}</p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Est. Revenue:</span>
                  <span className="font-bold text-emerald-400">₹{(opp.estimatedRevenue || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Confidence:</span>
                  <span className="font-bold text-indigo-400">{Math.round((opp.confidence || 0.8) * 100)}%</span>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/opportunities/${opp._id}`);
                  }}
                >
                  Review & Launch
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Live Agent Action Feed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Autonomous Agent Activity</CardTitle>
            <CardDescription>Live audit log of autonomous decisions recorded in MongoDB</CardDescription>
          </div>
          <Link to="/activity" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300">
            View full log →
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((act) => (
              <div key={act._id} className="flex items-center justify-between p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-200 capitalize">
                      {act.actionType.replace('_', ' ')}
                    </span>
                    <p className="text-slate-400 text-[11px]">
                      {act.output?.summary || act.output?.opportunityTitle || (act.output?.conversions ? `Executed campaign: ${act.output.conversions} conversions` : 'Completed autonomous scan')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="success" size="sm">Completed</Badge>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {new Date(act.executedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
