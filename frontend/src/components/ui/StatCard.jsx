import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendType = 'positive', // positive, negative, neutral
  badge,
  className = '',
  highlight = false,
}) {
  return (
    <div className={`relative overflow-hidden bg-slate-900 border rounded-xl p-5 shadow-sm transition-all ${
      highlight ? 'border-indigo-500/40 bg-gradient-to-b from-indigo-950/20 to-slate-900' : 'border-slate-800'
    } ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg ${highlight ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-400'}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-slate-100 tracking-tight">{value}</span>
        {badge}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          {trend && (
            <span className={`inline-flex items-center font-medium ${
              trendType === 'positive' ? 'text-emerald-400' : trendType === 'negative' ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {trendType === 'positive' ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
