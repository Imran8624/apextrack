'use client';

import React from 'react';
import { UserRole } from '@/types';
import { Crown, UserPlus, LogIn, Shield, Zap, CheckCircle2, Lock, ArrowRight, Star, Cpu } from 'lucide-react';

interface AdminRegistrationHeroProps {
  currentRole: UserRole;
  currentUserName: string;
  currentUserJobTitle?: string;
  onOpenAuthModal: (mode?: 'signin' | 'signup' | 'admin') => void;
  onQuickRoleSwitch: (role: UserRole) => void;
  onNavigateToTab?: (tab: string) => void;
}

export const AdminRegistrationHero: React.FC<AdminRegistrationHeroProps> = ({
  currentRole,
  currentUserName,
  currentUserJobTitle,
  onOpenAuthModal,
  onQuickRoleSwitch,
  onNavigateToTab,
}) => {
  const [showWorkflowDetails, setShowWorkflowDetails] = React.useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);

  if (isCollapsed) {
    return (
      <div className="bg-linear-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-2xl px-5 py-3 shadow-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-black text-xs shadow-md">
            {currentUserName.charAt(0)}
          </div>
          <div>
            <span className="text-xs font-black text-white">{currentUserName} ({currentRole})</span>
            <span className="text-[10px] text-slate-400 block">{currentUserJobTitle || 'Team Member'}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => onQuickRoleSwitch('EMPLOYEE')}
            className={`px-2.5 py-1 rounded-lg transition-all ${currentRole === 'EMPLOYEE' ? 'bg-indigo-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
          >
            Employee
          </button>
          <button
            onClick={() => onQuickRoleSwitch('TEAM_LEAD')}
            className={`px-2.5 py-1 rounded-lg transition-all ${currentRole === 'TEAM_LEAD' ? 'bg-amber-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
          >
            Lead
          </button>
          <button
            onClick={() => onQuickRoleSwitch('MANAGER')}
            className={`px-2.5 py-1 rounded-lg transition-all ${currentRole === 'MANAGER' ? 'bg-purple-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
          >
            Manager
          </button>
          <button
            onClick={() => onQuickRoleSwitch('HR')}
            className={`px-2.5 py-1 rounded-lg transition-all ${currentRole === 'HR' ? 'bg-pink-600 text-white shadow' : 'bg-slate-950 text-slate-400 hover:text-white'}`}
          >
            HR
          </button>
          <button
            onClick={() => setIsCollapsed(false)}
            className="px-3 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 text-xs font-extrabold hover:bg-indigo-600/30 ml-2"
          >
            Expand Banner ▼
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linear-to-r from-slate-900 via-indigo-950/60 to-purple-950/60 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
      {/* Minimize Button */}
      <button
        onClick={() => setIsCollapsed(true)}
        className="absolute top-4 right-4 z-20 px-3 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-bold border border-slate-800 transition-all flex items-center space-x-1"
        title="Minimize executive hero to compact bar"
      >
        <span>Minimize Banner ▲</span>
      </button>

      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Welcome & Session Identity Info */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
              <Crown className="w-3.5 h-3.5" />
              <span>ApexTracker Executive Platform</span>
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Session Portal v2.0
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            Admin Registration & Executive Management Portal
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            Register as a <strong>Team Leader (TL)</strong> or <strong>Engineering Manager</strong> to gain instant dynamic deadline override authority, WebRTC emergency war room triggers, and PostgreSQL database audit vault access.
          </p>

          {/* Active Session Status Card */}
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shadow-md">
                {currentUserName.charAt(0)}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wider">
                  Active Session Profile
                </span>
                <span className="font-extrabold text-sm text-white block">
                  {currentUserName} ({currentRole})
                </span>
                <span className="text-xs text-slate-400 block">{currentUserJobTitle || 'Team Member'}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenAuthModal('admin')}
                className="px-4 py-2 rounded-xl bg-linear-to-r from-amber-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 text-white font-black text-xs shadow-lg shadow-amber-600/30 transition-all flex items-center space-x-1.5"
              >
                <Crown className="w-4 h-4" />
                <span>Admin Sign Up</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('signup')}
                className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-bold text-xs border border-indigo-500/40 transition-all flex items-center space-x-1.5"
              >
                <UserPlus className="w-4 h-4" />
                <span>Employee Register</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 1-Click Fast Launch Action Cards */}
        <div className="lg:col-span-5 space-y-3 bg-slate-950/90 p-5 rounded-2xl border border-slate-800 shadow-2xl">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>1st-Page Fast Role Switch & Registration</span>
          </span>

          <div className="space-y-2">
            <button
              onClick={() => {
                onQuickRoleSwitch('TEAM_LEAD');
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                currentRole === 'TEAM_LEAD'
                  ? 'bg-linear-to-r from-amber-950/80 to-slate-900 border-amber-400 text-white shadow-md'
                  : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center font-bold text-amber-300 text-xs">
                  TL
                </div>
                <div>
                  <p className="font-bold text-xs text-amber-300">Switch to Team Lead (Marcus)</p>
                  <p className="text-[10px] text-slate-400">Full deadline override & call controls</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>

            <button
              onClick={() => {
                onQuickRoleSwitch('MANAGER');
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                currentRole === 'MANAGER'
                  ? 'bg-linear-to-r from-purple-950/80 to-slate-900 border-purple-400 text-white shadow-md'
                  : 'bg-slate-900/80 border-slate-800 hover:border-purple-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center font-bold text-purple-300 text-xs">
                  MGR
                </div>
                <div>
                  <p className="font-bold text-xs text-purple-300">Switch to Manager (Elena)</p>
                  <p className="text-[10px] text-slate-400">Executive report approvals & DB vault</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-400" />
            </button>

            <button
              onClick={() => {
                onQuickRoleSwitch('EMPLOYEE');
              }}
              className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                currentRole === 'EMPLOYEE'
                  ? 'bg-linear-to-r from-indigo-950/80 to-slate-900 border-indigo-400 text-white shadow-md'
                  : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center font-bold text-indigo-300 text-xs">
                  EMP
                </div>
                <div>
                  <p className="font-bold text-xs text-indigo-300">Switch to Employee (Alex / Maya)</p>
                  <p className="text-[10px] text-slate-400">Daily EOD logging & 1-on-1 DM chat</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-indigo-400" />
            </button>
          </div>
        </div>
      </div>

      {/* CORE MISSION BANNER: Solving Unstructured Workflows & Knowledge Fragmentation */}
      <div className="border-t border-indigo-500/20 pt-4">
        <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-indigo-500/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="text-sm font-extrabold text-white">
                The Problem ApexTracker Solves: Unstructured Workflows & Shift Knowledge Fragmentation
              </h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowWorkflowDetails(!showWorkflowDetails)}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors underline"
              >
                {showWorkflowDetails ? 'Hide Problem Breakdown' : 'Show 8-Step Breakdown'}
              </button>
              {onNavigateToTab && (
                <button
                  onClick={() => onNavigateToTab('continuity')}
                  className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1"
                >
                  <span>Launch Shift Continuity Hub →</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Flowchart Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-center text-[11px] font-mono">
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-indigo-400 font-bold block mb-1">1. Requirement</span>
              <span className="text-slate-300 text-[10px] leading-tight block">Client gives requirement</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-indigo-400 font-bold block mb-1">2. Assign</span>
              <span className="text-slate-300 text-[10px] leading-tight block">Employee receives task</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-indigo-400 font-bold block mb-1">3. Start</span>
              <span className="text-slate-300 text-[10px] leading-tight block">Work starts</span>
            </div>
            <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800">
              <span className="text-amber-400 font-bold block mb-1">4. Questions</span>
              <span className="text-slate-300 text-[10px] leading-tight block">Questions / changes / issues</span>
            </div>
            <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/40">
              <span className="text-rose-400 font-bold block mb-1">5. Silo Trap</span>
              <span className="text-rose-200 text-[10px] leading-tight block">Info stays with individual</span>
            </div>
            <div className="bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/40">
              <span className="text-rose-400 font-bold block mb-1">6. Shift End</span>
              <span className="text-rose-200 text-[10px] leading-tight block">Employee changes shift</span>
            </div>
            <div className="bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/40">
              <span className="text-amber-400 font-bold block mb-1">7. Confusion</span>
              <span className="text-slate-300 text-[10px] leading-tight block">New dev has to relearn</span>
            </div>
            <div className="bg-rose-950/60 p-2.5 rounded-xl border border-rose-500/60">
              <span className="text-rose-400 font-bold block mb-1">8. Cost</span>
              <span className="text-rose-300 text-[10px] leading-tight font-bold block">Time lost & delays</span>
            </div>
          </div>

          {showWorkflowDetails && (
            <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-2 bg-slate-900/60 p-4 rounded-xl">
              <p className="leading-relaxed">
                <strong>Why traditional teams suffer:</strong> When questions, edge-case decisions, and client alterations remain in personal notes, any shift handoff costs 3–5 hours of re-discovery and leads to regression mistakes.
              </p>
              <p className="text-emerald-400 font-medium">
                <strong>ApexTracker Solution:</strong> All task questions are publicly threaded, EOD blocker reports are logged daily, and the <strong>Structured Shift Pass-Down Protocol</strong> transfers all context to the incoming shift engineer in under 90 seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
