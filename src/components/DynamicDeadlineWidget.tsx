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
          <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-rose-950/50 text-rose-300 border border-rose-800/60 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>DELAYED</span>
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-amber-950/50 text-amber-300 border border-amber-800/60 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>AT RISK</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-emerald-950/50 text-emerald-300 border border-emerald-800/60 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
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
    <div className="bg-[#161e2e] border border-[#232f3e] rounded-xl p-5 shadow-sm relative overflow-hidden space-y-5 w-full min-w-0">
      {/* Module Title Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232f3e] pb-3.5">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#232f3e] border border-[#2d3748] text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-100">Dynamic Deadline Calculation Engine</h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium uppercase tracking-wider bg-[#232f3e] text-slate-300 border border-[#2d3748]">
                Auto-Velocity
              </span>
            </div>
            <p className="text-xs text-slate-400">Recalculates completion date automatically based on daily EOD velocity</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {getRiskBadge(project.riskStatus)}

          {(currentRole === 'TEAM_LEAD' || currentRole === 'MANAGER') && (
            <button
              onClick={() => setShowOverrideModal(true)}
              className="px-2.5 py-1 rounded-md bg-[#232f3e] hover:bg-[#2d3748] text-slate-200 text-xs font-medium border border-[#2d3748] flex items-center space-x-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Override Deadline</span>
            </button>
          )}
        </div>
      </div>

      {/* Project Context & Key Velocity Indicators */}
      <div className="space-y-4">
        {/* Project Context & Client Account Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#0f141c] p-3 rounded-lg border border-[#232f3e] gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-slate-100">{project.name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-[#161e2e] text-slate-300 border border-[#232f3e]">
              {project.code}
            </span>
            {project.clientTier && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#232f3e] text-slate-300 border border-[#2d3748]">
                {project.clientTier}
              </span>
            )}
          </div>

          {project.clientName && (
            <div className="flex items-center space-x-3 text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> Client: <strong className="text-slate-200">{project.clientName}</strong>
              </span>
              {project.clientHealthScore && (
                <span className="px-2 py-0.2 rounded text-[10px] font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-800/50">
                  {project.clientHealthScore}% Health
                </span>
              )}
              {onNavigateToCRM && (
                <button
                  onClick={onNavigateToCRM}
                  className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 font-medium ml-1"
                >
                  <span>CRM</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Metrics Grid: 4 Compact Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Velocity Metric */}
          <div className="bg-[#0f141c] p-3.5 rounded-lg border border-[#232f3e] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Team Velocity Index
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-blue-400">{project.currentVelocity}x</span>
              <span className="text-xs text-slate-400">Target: {project.targetVelocity}x</span>
            </div>
            <p className="text-[11px] text-slate-400">Completed vs logged hours</p>
          </div>

          {/* Baseline Deadline */}
          <div className="bg-[#0f141c] p-3.5 rounded-lg border border-[#232f3e] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Baseline Target Date
            </span>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-base font-bold text-slate-200">{project.baselineFinishDate}</span>
            </div>
            <p className="text-[11px] text-slate-400">Original planned release</p>
          </div>

          {/* Dynamic Recalculated Deadline */}
          <div className="bg-[#0f141c] p-3.5 rounded-lg border border-blue-900/40 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-400 block">
              Calculated Finish Date
            </span>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <span className="text-base font-bold text-slate-100">{project.calculatedFinishDate}</span>
            </div>
            <p className="text-[11px] text-slate-400">Auto-updated from velocity</p>
          </div>

          {/* Effective Override Date */}
          <div className="bg-[#0f141c] p-3.5 rounded-lg border border-[#232f3e] space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
              Effective Finish Date
            </span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-base font-bold text-emerald-400">
                {project.overrideFinishDate || project.calculatedFinishDate}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {project.overrideFinishDate ? 'Manual Override Applied' : 'Following Auto-Engine'}
            </p>
          </div>
        </div>

        {/* Calculation Risk Explanation Banner */}
        <div className="bg-[#0f141c] p-3 rounded-lg border border-[#232f3e] flex items-start space-x-2.5 text-xs text-slate-300">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-200">Dynamic Velocity Projection: </span>
            <span>
              Remaining workload: <strong>{project.remainingHours} hours</strong>. At current velocity ({project.currentVelocity}x), the engine projects completion by <strong>{project.calculatedFinishDate}</strong>.
            </span>
            {project.overrideReason && (
              <p className="mt-1 text-slate-300 font-mono text-[11px]">
                Override Note: &quot;{project.overrideReason}&quot;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Manual Override Modal for TLs / Managers */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-[#0f141c]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161e2e] border border-[#232f3e] rounded-xl p-5 max-w-md w-full shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#232f3e] pb-3">
              <h4 className="font-bold text-slate-100 text-sm">Manual Deadline Override</h4>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOverrideSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Override Target Date *
                </label>
                <input
                  type="date"
                  required
                  value={overrideDate}
                  onChange={(e) => setOverrideDate(e.target.value)}
                  className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Justification / Scope Reduction Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain reason for manual deadline override (e.g. descoping feature X or adding backend headcount)..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md p-2.5 text-xs text-slate-200 focus:border-blue-500 outline-none"
                />
              </div>

              <div className="flex space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="w-1/2 py-2 rounded-md bg-[#232f3e] text-slate-300 text-xs font-semibold hover:bg-[#2d3748]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm"
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
