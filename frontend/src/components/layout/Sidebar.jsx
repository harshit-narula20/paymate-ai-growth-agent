import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Sparkles,
  Users,
  Package,
  ArrowLeftRight,
  Megaphone,
  BarChart3,
  Activity,
  Settings,
  Zap,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Agent', path: '/agent', icon: Bot, highlight: true },
  { name: 'Opportunities', path: '/opportunities', icon: Sparkles },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
  { name: 'Campaigns', path: '/campaigns', icon: Megaphone },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Agent Activity', path: '/activity', icon: Activity },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function Sidebar({ className = '' }) {
  return (
    <aside className={`w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0 ${className}`}>
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-lg">
          <Zap className="w-5 h-5 fill-current" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-base tracking-tight text-white">PAYMATE</span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">AI</span>
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Growth Agent</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : item.highlight
                    ? 'text-indigo-400 hover:bg-indigo-950/40 hover:text-indigo-300 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.name}</span>
              {item.highlight && (
                <span className="ml-auto flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Merchant Pill */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
              AA
            </div>
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-200 truncate">Apex Athletics</p>
              <p className="text-[10px] text-slate-400 truncate">vikram@apexathletics.in</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
