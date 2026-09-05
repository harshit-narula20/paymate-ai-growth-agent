import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Failed to load data',
  message = 'Unable to connect to the backend server. Please verify the backend API is running on port 5000.',
  onRetry,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-rose-500/5 border border-rose-500/20 rounded-xl text-center ${className}`}>
      <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Retry Connection
        </Button>
      )}
    </div>
  );
}
