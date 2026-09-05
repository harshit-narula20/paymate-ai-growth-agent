import React, { useState, useEffect } from 'react';
import {
  Activity,
  Bot,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  Filter,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { LoadingState } from '../components/ui/LoadingState';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';

export function AgentActivity() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAgentActions({ limit: 50 });
      setActions(res.data || []);
    } catch (err) {
      console.error('Failed to load agent actions:', err);
      setError(err.message || 'Error fetching agent activity');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const getActionIcon = (type) => {
    switch (type) {
      case 'analyze_data':
        return <Bot className="w-4 h-4 text-indigo-400" />;
      case 'generate_recommendation':
        return <Sparkles className="w-4 h-4 text-purple-400" />;
      case 'execute_campaign':
        return <Zap className="w-4 h-4 text-emerald-400" />;
      case 'recover_payment':
        return <CheckCircle2 className="w-4 h-4 text-cyan-400" />;
      default:
        return <Activity className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" /> Autonomous Agent Activity Feed
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable audit log of all autonomous evaluations, recommendations, and campaign dispatches
          </p>
        </div>
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={fetchActions}>
          Refresh Feed
        </Button>
      </div>

      {/* Activity Timeline */}
      {loading ? (
        <LoadingState message="Loading agent activity log from MongoDB..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchActions} />
      ) : actions.length === 0 ? (
        <EmptyState title="No Agent Actions Logged" description="Run an autonomous analysis from the AI Agent page to start logging activity." />
      ) : (
        <Card className="p-0 overflow-hidden border-slate-800">
          <div className="divide-y divide-slate-800/80">
            {actions.map((act) => (
              <div key={act._id} className="p-5 hover:bg-slate-900/60 transition-colors flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                  {getActionIcon(act.actionType)}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-100 capitalize">
                        {act.actionType?.replace(/_/g, ' ')}
                      </span>
                      <Badge variant="primary" size="sm">
                        {act.aiProvider || 'demo'}
                      </Badge>
                      <Badge variant="success" size="sm">
                        {act.status}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      {new Date(act.executedAt).toLocaleString()}
                    </span>
                  </div>

                  {/* Summary / Output snippet */}
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {act.output?.summary ||
                     act.output?.subject ||
                     (act.output?.conversions ? `Dispatched campaign resulting in ${act.output.conversions} conversions and ₹${act.output.actualRevenue?.toLocaleString('en-IN')} revenue (ROI: ${act.output.roi}%). [DEMO/SIMULATED]` : 'Autonomous scan evaluated store metrics and customer cohorts.')}
                  </p>

                  {/* Context Metadata */}
                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 font-mono">
                    {act.opportunityId && (
                      <span>Opportunity: {act.opportunityId.title || act.opportunityId}</span>
                    )}
                    {act.campaignId && (
                      <span>Campaign: {act.campaignId.name || act.campaignId}</span>
                    )}
                    <span>ID: #{act._id.slice(-8)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
