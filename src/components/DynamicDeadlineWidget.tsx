'use client';

import React, { useState } from 'react';
import { Project, UserRole, ProjectRisk } from '@/types';
import { TrendingUp, Calendar, AlertTriangle, ShieldCheck, Edit3, Clock, CheckCircle, Info, Zap, Building2, ArrowUpRight } from 'lucide-react';

interface DynamicDeadlineWidgetProps {
  project: Project;
  currentRole: UserRole;
  onOverrideDeadline: (projectId: string, newDate: string, reason: string) => void;
  onNavigateToCRM?: () => void;
}

export const DynamicDeadlineWidget: React.FC<DynamicDeadlineWidgetProps> = ({
  project,
  currentRole,
  onOverrideDeadline,
  onNavigateToCRM,
}) => {
  const [showOverrideModal, setShowOverrideModal] = useState<boolean>(false);
  const [overrideDate, setOverrideDate] = useState<string>(project.calculatedFinishDate);
  const [overrideReason, setOverrideReason] = useState<string>('');

  const getRiskBadge = (risk: ProjectRisk) => {
    switch (risk) {
      case 'DELAYED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 flex items-center space-x-1.5 shadow-md shadow-red-500/10">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>DELAYED</span>
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center space-x-1.5 shadow-md shadow-amber-500/10">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>AT RISK</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center space-x-1.5 shadow-md shadow-emerald-500/10">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ON TRACK</span>
          </span>
        );
    }
  };

  const handleOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideDate) return;
    onOverrideDeadline(project.id, overrideDate, overrideReason);
    setShowOverrideModal(false);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background Accent Gradient */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />

      {/* Module Title Header Banner */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-100">Dynamic Deadline Calculation Engine</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                Auto-Velocity Algorithm
              </span>
            </div>
            <p className="text-xs text-slate-400">Mathematical engine automatically recalculating finish date based on daily EOD velocity</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {getRiskBadge(project.riskStatus)}

          {(currentRole === 'TEAM_LEAD' || currentRole === 'MANAGER') && (
            <button
              onClick={() => setShowOverrideModal(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center space-x-1.5 transition-all shadow-md"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Override Deadline</span>
            </button>
          )}
        </div>
      </div>

      {/* Project Context & Key Velocity Indicators */}
      <div className="relative z-10 space-y-6">
        {/* Project Context & Client Account Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-sm text-slate-100">{project.name}</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-slate-800 text-slate-300">
              {project.code}
            </span>
            {project.clientTier && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {project.clientTier}
              </span>
            )}
          </div>

          {project.clientName && (
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Client: <strong className="text-slate-100">{project.clientName}</strong>
              </span>
              {project.clientHealthScore && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                  {project.clientHealthScore}% Health
                </span>
              )}
              {onNavigateToCRM && (
                <button
                  onClick={onNavigateToCRM}
                  className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-2 ml-1"
                >
                  <span>CRM Hub</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Velocity Metric */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Team Velocity Index
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-black text-indigo-400">{project.currentVelocity}x</span>
              <span className="text-xs text-slate-400">Target: {project.targetVelocity}x</span>
            </div>
            <p className="text-[11px] text-slate-400">Ratio of completed tasks vs logged hours</p>
          </div>

          {/* Baseline Deadline */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Baseline Target Date
            </span>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-slate-400" />
              <span className="text-lg font-bold text-slate-200">{project.baselineFinishDate}</span>
            </div>
            <p className="text-[11px] text-slate-400">Original planned sprint release</p>
          </div>

          {/* Dynamic Recalculated Deadline */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-indigo-500/30 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block">
              Calculated Finish Date
            </span>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-indigo-400" />
              <span className="text-lg font-extrabold text-white">{project.calculatedFinishDate}</span>
            </div>
            <p className="text-[11px] text-indigo-300">Auto-updated from daily EOD velocity</p>
          </div>

          {/* Effective Override Date */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              Effective Finish Date
            </span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <span className="text-lg font-extrabold text-emerald-400">
                {project.overrideFinishDate || project.calculatedFinishDate}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {project.overrideFinishDate ? 'Manual TL Override Applied' : 'Following Auto-Engine'}
            </p>
          </div>
        </div>

        {/* Calculation Risk Explanation Banner */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 flex items-start space-x-3 text-xs text-slate-300">
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-slate-200">Dynamic Deadline Engine Insight: </span>
            <span>
              Remaining work is estimated at <strong>{project.remainingHours} hours</strong>. At current team velocity ({project.currentVelocity}x), the engine calculates completion by <strong>{project.calculatedFinishDate}</strong>.
            </span>
            {project.overrideReason && (
              <p className="mt-1 text-indigo-300 font-semibold">
                TL/Manager Override Note: &quot;{project.overrideReason}&quot;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Manual Override Modal for TLs / Managers */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h4 className="font-bold text-slate-100 text-base">Manual Deadline Override (TL/Manager)</h4>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="text-slate-400 hover:text-slate-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOverrideSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Override Target Date *
                </label>
                <input
                  type="date"
                  required
                  value={overrideDate}
                  onChange={(e) => setOverrideDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Justification / Scope Reduction Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain reason for manual deadline override (e.g. descoping feature X or adding backend headcount)..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Apply Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
