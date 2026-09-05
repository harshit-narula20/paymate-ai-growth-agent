import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'Loading data...', minHeight = 'min-h-[250px]' }) {
  return (
    <div className={`flex flex-col items-center justify-center ${minHeight} p-8 text-center`}>
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-3" />
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}

export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="animate-pulse border-b border-slate-800/60">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-slate-800 rounded w-full"></div>
        </td>
      ))}
    </tr>
  );
}
