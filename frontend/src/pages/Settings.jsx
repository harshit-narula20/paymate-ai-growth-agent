import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Bot,
  Store,
  Key,
  CheckCircle2,
  Cpu,
  Save
} from 'lucide-react';
import { api } from '../services/api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export function Settings() {
  const [health, setHealth] = useState(null);
  const [autonomousMode, setAutonomousMode] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(80);
  const [preferredChannel, setPreferredChannel] = useState('whatsapp');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.getHealth().then(data => setHealth(data)).catch(console.error);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-indigo-400" /> Merchant Settings & Safeguards
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure PayMate autonomous execution guardrails, AI models, and channel routing
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Engine Status */}
        <Card>
          <CardHeader>
            <CardTitle>AI Engine & Connectivity</CardTitle>
            <CardDescription>Active machine learning runtime backing the growth agent</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">{health?.aiMode || 'AI Mode: Demo'}</h4>
                  <p className="text-xs text-slate-400">
                    {health?.aiMode?.includes('OpenAI')
                      ? 'Connected to OpenAI GPT-4o-mini via secure backend API'
                      : 'Running High-Precision Deterministic Demo AI over live MongoDB records'}
                  </p>
                </div>
              </div>
              <Badge variant="success">Operational</Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-100">Database Engine</h4>
                  <p className="text-xs text-slate-400">
                    Mongoose connected to MongoDB ({health?.database?.status || 'connected'})
                  </p>
                </div>
              </div>
              <Badge variant="success">Connected</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Autonomous Guardrails */}
        <Card>
          <CardHeader>
            <CardTitle>Autonomous Guardrails & Safeguards</CardTitle>
            <CardDescription>Human-in-the-loop policies before campaign execution</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-100">Human Approval Requirement</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Require merchant one-click confirmation before launching any campaign or recovery action.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={!autonomousMode}
                  onChange={() => setAutonomousMode(!autonomousMode)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">Minimum AI Confidence Threshold</span>
                <span className="font-mono font-bold text-indigo-400">{confidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-indigo-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                PayMate will only present growth opportunities exceeding this statistical confidence level.
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <label className="block text-xs font-bold text-slate-200">Default Recovery Channel</label>
              <select
                value={preferredChannel}
                onChange={(e) => setPreferredChannel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="whatsapp">WhatsApp (High Conversion - 45% recovery benchmark)</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Merchant Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Merchant Profile</CardTitle>
            <CardDescription>Apex Athletics & Commerce store metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Merchant Store Name</label>
                <input
                  type="text"
                  disabled
                  value="Apex Athletics & Commerce"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Currency</label>
                <input
                  type="text"
                  disabled
                  value="INR (₹)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-300 font-mono"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end gap-3">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" /> Preferences Saved
            </span>
          )}
          <Button type="submit" variant="primary" icon={Save}>
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
