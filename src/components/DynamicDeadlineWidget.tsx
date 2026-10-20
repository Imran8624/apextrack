'use client';

import React, { useState } from 'react';
import { Project, UserRole, ProjectRisk } from '@/types';
import { TrendingUp, Calendar, AlertTriangle, ShieldCheck, Edit3, Clock, CheckCircle, Info, Building2, ArrowUpRight } from 'lucide-react';

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
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>DELAYED</span>
          </span>
        );
      case 'AT_RISK':
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>AT RISK</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
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
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs relative space-y-5 w-full min-w-0">
      {/* Module Title Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-xs">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">Dynamic Deadline Calculation Engine</h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200">
                Auto-Velocity
              </span>
            </div>
            <p className="text-xs text-slate-500">Recalculates completion date automatically based on daily EOD velocity</p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {getRiskBadge(project.riskStatus)}

          {(currentRole === 'TEAM_LEAD' || currentRole === 'MANAGER') && (
            <button
              onClick={() => setShowOverrideModal(true)}
              className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Override Deadline</span>
            </button>
          )}
        </div>
      </div>

      {/* Project Context & Key Velocity Indicators */}
      <div className="space-y-4">
        {/* Project Context & Client Account Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200 gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-sm text-slate-900">{project.name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-white text-slate-700 border border-slate-200">
              {project.code}
            </span>
            {project.clientTier && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {project.clientTier}
              </span>
            )}
          </div>

          {project.clientName && (
            <div className="flex items-center space-x-3 text-xs text-slate-700">
              <span className="flex items-center gap-1.5 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-slate-500" /> Client: <strong className="text-slate-900">{project.clientName}</strong>
              </span>
              {project.clientHealthScore && (
                <span className="px-2 py-0.2 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {project.clientHealthScore}% Health
                </span>
              )}
              {onNavigateToCRM && (
                <button
                  onClick={onNavigateToCRM}
                  className="inline-flex items-center space-x-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold ml-1"
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
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Team Velocity Index
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-indigo-600">{project.currentVelocity}x</span>
              <span className="text-xs text-slate-500">Target: {project.targetVelocity}x</span>
            </div>
            <p className="text-[11px] text-slate-500">Completed vs logged hours</p>
          </div>

          {/* Baseline Deadline */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Baseline Target Date
            </span>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-base font-bold text-slate-900">{project.baselineFinishDate}</span>
            </div>
            <p className="text-[11px] text-slate-500">Original planned release</p>
          </div>

          {/* Dynamic Recalculated Deadline */}
          <div className="bg-indigo-50/50 p-3.5 rounded-lg border border-indigo-200 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-700 block">
              Calculated Finish Date
            </span>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span className="text-base font-bold text-indigo-900">{project.calculatedFinishDate}</span>
            </div>
            <p className="text-[11px] text-indigo-600/80">Auto-updated from velocity</p>
          </div>

          {/* Effective Override Date */}
          <div className="bg-slate-50/80 p-3.5 rounded-lg border border-slate-200 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
              Effective Finish Date
            </span>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span className="text-base font-bold text-emerald-700">
                {project.overrideFinishDate || project.calculatedFinishDate}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {project.overrideFinishDate ? 'Manual Override Applied' : 'Following Auto-Engine'}
            </p>
          </div>
        </div>

        {/* Calculation Risk Explanation Banner */}
        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-start space-x-2.5 text-xs text-slate-700">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900">Dynamic Velocity Projection: </span>
            <span>
              Remaining workload: <strong>{project.remainingHours} hours</strong>. At current velocity ({project.currentVelocity}x), the engine projects completion by <strong>{project.calculatedFinishDate}</strong>.
            </span>
            {project.overrideReason && (
              <p className="mt-1 text-slate-600 font-mono text-[11px]">
                Override Note: &quot;{project.overrideReason}&quot;
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Manual Override Modal for TLs / Managers */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 max-w-md w-full shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-sm">Manual Deadline Override</h4>
              <button
                onClick={() => setShowOverrideModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleOverrideSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Override Target Date *
                </label>
                <input
                  type="date"
                  required
                  value={overrideDate}
                  onChange={(e) => setOverrideDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                  Justification / Scope Reduction Notes *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain reason for manual deadline override (e.g. descoping feature X or adding backend headcount)..."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md p-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white outline-none"
                />
              </div>

              <div className="flex space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="w-1/2 py-2 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
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
