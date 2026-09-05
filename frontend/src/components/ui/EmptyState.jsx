import React from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = 'No items found',
  description = 'There are currently no records available in this section.',
  icon: Icon = Sparkles,
  actionLabel,
  onAction,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 bg-slate-900/40 border border-slate-800/60 rounded-xl text-center ${className}`}>
      <div className="p-3 bg-slate-800 text-slate-400 rounded-full mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
