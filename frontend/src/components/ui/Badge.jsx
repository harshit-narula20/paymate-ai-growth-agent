import React from 'react';

export function Badge({ children, variant = 'default', size = 'md', className = '' }) {
  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    primary: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
}

export function OpportunityTypeBadge({ type }) {
  const config = {
    cross_sell: { label: 'Cross-Sell', variant: 'purple' },
    win_back: { label: 'Win-Back', variant: 'warning' },
    churn_prevention: { label: 'Churn Prevention', variant: 'danger' },
    payment_recovery: { label: 'Payment Recovery', variant: 'cyan' },
    high_intent: { label: 'High Intent', variant: 'success' },
  };

  const item = config[type] || { label: type, variant: 'default' };
  return <Badge variant={item.variant}>{item.label}</Badge>;
}

export function PriorityBadge({ priority }) {
  const map = {
    high: { label: 'High Priority', variant: 'danger' },
    medium: { label: 'Medium Priority', variant: 'warning' },
    low: { label: 'Low Priority', variant: 'default' },
  };
  const item = map[priority] || { label: priority, variant: 'default' };
  return <Badge variant={item.variant} size="sm">{item.label}</Badge>;
}

export function StatusBadge({ status }) {
  const map = {
    identified: { label: 'Identified', variant: 'primary' },
    approved: { label: 'Approved', variant: 'warning' },
    executed: { label: 'Executed', variant: 'success' },
    active: { label: 'Active', variant: 'success' },
    completed: { label: 'Completed', variant: 'success' },
    failed: { label: 'Failed', variant: 'danger' },
    pending: { label: 'Pending', variant: 'warning' },
    in_progress: { label: 'In Progress', variant: 'primary' },
    recovered: { label: 'Recovered', variant: 'success' },
  };
  const item = map[status] || { label: status, variant: 'default' };
  return <Badge variant={item.variant} size="sm">{item.label}</Badge>;
}
