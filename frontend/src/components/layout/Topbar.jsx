import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Sparkles, Store, Cpu, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { Button } from '../ui/Button';

export function Topbar({ onTriggerAnalyze }) {
  const navigate = useNavigate();
  const [health, setHealth] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    api.getHealth()
      .then(data => setHealth(data))
      .catch(err => {
        console.warn('Backend health check error:', err);
        setHealth({ aiMode: 'AI Mode: Demo', status: 'offline' });
      });
  }, []);

  const handleQuickAnalyze = async () => {
    try {
      setAnalyzing(true);
      await api.analyzeAgent('Find high-impact revenue opportunities');
      if (onTriggerAnalyze) onTriggerAnalyze();
      navigate('/opportunities');
    } catch (err) {
      console.error('Quick analyze error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const isDemo = health?.aiMode?.includes('Demo');

  return (
    <header className="h-16 bg-slate-900/90 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
      {/* Left: Merchant Profile context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Store className="w-4 h-4 text-indigo-400" />
          <span className="font-medium text-slate-200">Apex Athletics & Commerce</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Footwear & Sports Apparel</span>
        </div>
      </div>

      {/* Right: AI Agent Live Badges & Quick Action */}
      <div className="flex items-center gap-3">
        {/* Agent Active Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>AI Agent Active</span>
        </div>

        {/* AI Provider Mode Pill */}
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
          isDemo 
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
            : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
        }`}>
          <Cpu className="w-3.5 h-3.5" />
          <span>{health?.aiMode || 'AI Mode: Demo'}</span>
        </div>

        {/* Trigger Autonomous Analysis Button */}
        <Button
          variant="primary"
          size="sm"
          icon={Sparkles}
          loading={analyzing}
          onClick={handleQuickAnalyze}
          className="shadow-sm font-semibold"
        >
          Scan Opportunities
        </Button>
      </div>
    </header>
  );
}
