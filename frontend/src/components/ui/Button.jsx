import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const base = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/30 focus:ring-indigo-500 border border-indigo-500/40",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 focus:ring-slate-500",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-600/30 focus:ring-emerald-500 border border-emerald-500/40",
    danger: "bg-rose-600 hover:bg-rose-500 text-white shadow-sm shadow-rose-600/30 focus:ring-rose-500 border border-rose-500/40",
    outline: "bg-transparent hover:bg-slate-800 text-slate-300 border border-slate-700 focus:ring-slate-500",
    ghost: "bg-transparent hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 focus:ring-slate-500",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1.5 gap-1.5",
    md: "text-sm px-3.5 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}
