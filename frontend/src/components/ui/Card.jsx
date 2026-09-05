import React from 'react';

export function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-slate-900/90 border border-slate-800/80 rounded-xl p-6 shadow-sm backdrop-blur-sm ${
        hover ? 'hover:border-slate-700 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200 cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return <div className={`flex flex-col space-y-1.5 mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
  return <h3 className={`text-base font-semibold text-slate-100 tracking-tight ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
  return <p className={`text-xs text-slate-400 ${className}`}>{children}</p>;
}

export function CardContent({ children, className = '' }) {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return <div className={`mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between ${className}`}>{children}</div>;
}
