'use client';

import React, { useState } from 'react';
import { UserRole, Project, User, ShiftHandover } from '@/types';
import { WORKFLOW_PROBLEM_STEPS, WorkflowStepComparison } from '@/lib/mockData';
import {
  GitMerge,
  ArrowRight,
  ArrowDown,
  AlertOctagon,
  CheckCircle2,
  Clock,
  UserCheck,
  FileText,
  ShieldAlert,
  Sparkles,
  Zap,
  Repeat,
  PlusCircle,
  HelpCircle,
  AlertTriangle,
  Send,
  Layers,
  Building2,
  Flame,
  Check
} from 'lucide-react';

interface WorkflowContinuityHubProps {
  currentRole: UserRole;
  currentUser: User;
  projects: Project[];
  activeProjectId: string;
  handovers: ShiftHandover[];
  onAcceptHandover: (handoverId: string) => void;
  onCreateHandover: (newHandover: Omit<ShiftHandover, 'id' | 'createdTime' | 'status'>) => void;
}

export const WorkflowContinuityHub: React.FC<WorkflowContinuityHubProps> = ({
  currentRole,
  currentUser,
  projects,
  activeProjectId,
  handovers,
  onAcceptHandover,
  onCreateHandover,
}) => {
  const [viewMode, setViewMode] = useState<'comparison' | 'handovers'>('comparison');
  const [selectedStepIndex, setSelectedStepIndex] = useState<number>(4); // Step 5: Information stays with individual
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Handover Form State
  const [formTaskId, setFormTaskId] = useState<string>('');
  const [formReqSummary, setFormReqSummary] = useState<string>('');
  const [formShiftFrom, setFormShiftFrom] = useState<string>('Morning Shift (09:00 - 17:00)');
  const [formShiftTo, setFormShiftTo] = useState<string>('Evening Shift (17:00 - 01:00)');
  const [formProgress, setFormProgress] = useState<string>('');
  const [formQuestions, setFormQuestions] = useState<string>('');
  const [formNextSteps, setFormNextSteps] = useState<string>('');
  const [formGotchas, setFormGotchas] = useState<string>('');

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const task = activeProject.tasks.find((t) => t.id === formTaskId) || activeProject.tasks[0];

    const questionsArray = formQuestions
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q.length > 0);

    onCreateHandover({
      projectId: activeProject.id,
      projectName: activeProject.name,
      taskId: task ? task.id : 't-custom',
      taskTitle: task ? task.title : 'General Project Architecture',
      clientRequirementSummary: formReqSummary || 'Client requested urgent sprint deliverable with strict zero-regression criteria.',
      outgoingEmployeeId: currentUser.id,
      outgoingEmployeeName: currentUser.name,
      outgoingEmployeeRole: currentUser.role,
      shiftFrom: formShiftFrom,
      shiftTo: formShiftTo,
      progressSummary: formProgress || 'Finished core logic refactoring and integration tests.',
      criticalQuestionsOrChanges: questionsArray.length > 0 ? questionsArray : ['Verified acceptance criteria with QA.'],
      nextStepsForIncoming: formNextSteps || 'Inspect remaining edge cases and prepare pull request.',
      gotchasAndWatchouts: formGotchas || 'Check environment variables before running migrations.',
    });

    setShowCreateModal(false);
    // Reset form
    setFormTaskId('');
    setFormReqSummary('');
    setFormProgress('');
    setFormQuestions('');
    setFormNextSteps('');
    setFormGotchas('');
  };

  const selectedStep = WORKFLOW_PROBLEM_STEPS[selectedStepIndex];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Value Proposition & Problem Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>The Tribal Knowledge Crisis</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Apex Continuity Engine</span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Solving the Broken Workflow & Shift Handover Trap
              </h2>
            </div>

            {/* View Switcher Pills */}
            <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                  viewMode === 'comparison'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span>Workflow Problem vs. Solution</span>
              </button>

              <button
                onClick={() => setViewMode('handovers')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-2 ${
                  viewMode === 'handovers'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitMerge className="w-4 h-4" />
                <span>Active Shift Pass-Down Cards ({handovers.length})</span>
              </button>
            </div>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-4xl">
            In traditional organizations, <strong>client requirements get scattered</strong>, questions remain in personal chats, and whenever an employee ends their shift or moves to another project, the next engineer inherits zero context—costing hours of reverse-engineering and causing project delays. ApexTracker replaces this breakdown with <strong>structured handover protocols and anchored living context</strong>.
          </p>

          {/* 3 High-Impact Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Shift Handover Ramp-up</p>
                <p className="text-lg font-black text-white">90 seconds <span className="text-xs font-normal text-emerald-400">(-96% time saved)</span></p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Knowledge Retention</p>
                <p className="text-lg font-black text-white">99.4% <span className="text-xs font-normal text-indigo-400">Zero context lost</span></p>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium">Prevented Deadline Slippage</p>
                <p className="text-lg font-black text-white">100% On-Track <span className="text-xs font-normal text-purple-400">Dynamic engine</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE 8-STEP BREAKDOWN COMPARISON */}
      {viewMode === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: The 8-Step Interactive Pipeline Flow */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  <span>The 8-Stage Workflow Breakdown Sequence</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Click any step below to see why it breaks and how ApexTracker eliminates the risk</p>
              </div>
              <span className="text-[11px] font-mono text-slate-500">Interactive Flow</span>
            </div>

            <div className="space-y-2.5">
              {WORKFLOW_PROBLEM_STEPS.map((step, idx) => {
                const isSelected = selectedStepIndex === idx;
                const isCriticalPoint = idx === 4 || idx === 5; // Information stays with individual / Shift change

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => setSelectedStepIndex(idx)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between group ${
                      isSelected
                        ? isCriticalPoint
                          ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/50 scale-[1.01]'
                          : 'bg-indigo-950/40 border-indigo-500 shadow-lg shadow-indigo-950/50 scale-[1.01]'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                          isSelected
                            ? isCriticalPoint
                              ? 'bg-rose-500 text-white'
                              : 'bg-indigo-600 text-white'
                            : isCriticalPoint
                            ? 'bg-rose-500/20 text-rose-300'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {step.stepNumber}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                            {step.traditionalStep}
                          </span>
                          {isCriticalPoint && (
                            <span className="text-[10px] px-2 py-0.2 rounded-full font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                              Failure Point
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                          {step.traditionalConsequence}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] hidden sm:inline font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {step.apexSolutionTitle}
                      </span>
                      <ArrowRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-indigo-400 translate-x-1' : 'text-slate-600'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Step Deep-Dive Comparison Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xs">
                    #{selectedStep.stepNumber}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">
                      Stage Audit & Comparison
                    </span>
                    <h4 className="text-base font-extrabold text-white">
                      {selectedStep.traditionalStep}
                    </h4>
                  </div>
                </div>

                {selectedStep.status === 'critical' ? (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    High Vulnerability
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Fully Automated
                  </span>
                )}
              </div>

              {/* What Happens Traditionally (The Breakdown) */}
              <div className="bg-rose-950/30 border border-rose-500/30 rounded-2xl p-4.5 space-y-2">
                <div className="flex items-center space-x-2 text-rose-300 font-bold text-xs">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  <span>Traditional Broken Workflow</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedStep.traditionalConsequence}
                </p>
                <div className="pt-1 text-[11px] text-rose-400 font-mono">
                  Impact: Context friction, lost decisions, 3-5 hr dev delay
                </div>
              </div>

              {/* How ApexTracker Fixes It */}
              <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4.5 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ApexTracker Solution: {selectedStep.apexSolutionTitle}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedStep.apexSolutionDescription}
                </p>
                <div className="pt-1 text-[11px] text-emerald-400 font-mono">
                  Result: Zero context lost • Immediate continuity • Auto-logged
                </div>
              </div>

              {/* Quick Action Button */}
              <button
                onClick={() => setViewMode('handovers')}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
              >
                <span>View Live Shift Handover Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Why This Matters Box */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-bold text-slate-200 block text-xs">💡 Engineering Management Note:</span>
              <p>
                Unstructured workflows are responsible for over <strong>70% of software project delivery slippage</strong>. By binding the client requirement to the task, enforcing public question logs, and generating automated shift handover cards, ApexTracker eliminates the information silos that derail projects.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE SHIFT HANDOVERS CONSOLE */}
      {viewMode === 'handovers' && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
                <GitMerge className="w-5 h-5 text-indigo-400" />
                <span>Shift Handover Protocol & Pass-Down Cards</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Zero-friction transfer of context, questions, client changes, and next steps between shifts & team members.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Create Shift Handover Brief</span>
            </button>
          </div>

          {/* Handover Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {handovers.map((handover) => {
              const isPending = handover.status === 'PENDING_PICKUP';

              return (
                <div
                  key={handover.id}
                  className={`bg-slate-900 rounded-3xl p-6 border transition-all duration-200 space-y-5 shadow-xl flex flex-col justify-between ${
                    isPending
                      ? 'border-amber-500/40 shadow-amber-950/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-4">
                    {/* Header: Project & Shift Transition */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 block font-bold">
                          {handover.projectName}
                        </span>
                        <h4 className="text-base font-extrabold text-white mt-0.5">
                          {handover.taskTitle}
                        </h4>
                      </div>

                      {isPending ? (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          <span>Needs Pickup</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1 shrink-0">
                          <Check className="w-3 h-3" />
                          <span>Accepted</span>
                        </span>
                      )}
                    </div>

                    {/* Shift Routing Badges */}
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Outgoing Shift</span>
                        <span className="font-extrabold text-white text-xs">{handover.outgoingEmployeeName}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">{handover.shiftFrom}</span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 mx-2" />

                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Shift</span>
                        <span className="font-extrabold text-indigo-300 text-xs">
                          {handover.incomingEmployeeName || 'Any Available Engineer'}
                        </span>
                        <span className="text-[10px] text-slate-400 block font-mono">{handover.shiftTo}</span>
                      </div>
                    </div>

                    {/* Client Requirement Context */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center space-x-1">
                        <FileText className="w-3 h-3 text-indigo-400" />
                        <span>Client Requirement Specification:</span>
                      </span>
                      <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        {handover.clientRequirementSummary}
                      </p>
                    </div>

                    {/* Progress Completed & Code Touched */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Work Completed in this Shift:</span>
                      </span>
                      <p className="text-xs text-slate-300">
                        {handover.progressSummary}
                      </p>
                    </div>

                    {/* Questions & Changes Logged (The Critical Silo Breaker) */}
                    {handover.criticalQuestionsOrChanges.length > 0 && (
                      <div className="space-y-1.5 bg-amber-950/20 border border-amber-500/30 p-3 rounded-2xl">
                        <span className="text-[10px] uppercase font-bold text-amber-300 tracking-wider flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" />
                          <span>Questions, Client Changes & Issues Logged:</span>
                        </span>
                        <ul className="space-y-1">
                          {handover.criticalQuestionsOrChanges.map((q, idx) => (
                            <li key={idx} className="text-xs text-amber-200/90 flex items-start space-x-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Steps for Incoming Engineer */}
                    <div className="bg-indigo-950/30 border border-indigo-500/30 p-3 rounded-2xl space-y-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider flex items-center space-x-1">
                        <ArrowRight className="w-3 h-3 text-indigo-400" />
                        <span>Immediate Next Steps for Incoming Shift:</span>
                      </span>
                      <p className="text-xs text-indigo-100 font-medium">
                        {handover.nextStepsForIncoming}
                      </p>
                    </div>

                    {/* Watchouts & Gotchas */}
                    {handover.gotchasAndWatchouts && (
                      <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <strong className="text-rose-400">⚠️ Watchout:</strong> {handover.gotchasAndWatchouts}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Action Buttons */}
                  <div className="border-t border-slate-800 pt-4 flex items-center justify-between mt-4">
                    <span className="text-[11px] text-slate-500 font-mono">
                      Logged {handover.createdTime}
                    </span>

                    {isPending ? (
                      <button
                        onClick={() => onAcceptHandover(handover.id)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center space-x-1.5"
                      >
                        <UserCheck className="w-4 h-4" />
                        <span>Claim & Accept Shift Handover</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Claimed by {handover.incomingEmployeeName || currentUser.name} ({handover.acceptedTime || 'Just now'})</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CREATE NEW SHIFT HANDOVER MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 block tracking-wider">
                  Prevent Knowledge Loss
                </span>
                <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
                  <GitMerge className="w-5 h-5 text-indigo-400" />
                  <span>Create Shift Handover & Pass-Down Card</span>
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-950 border border-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Task Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Active Task Being Handed Over *
                </label>
                <select
                  required
                  value={formTaskId}
                  onChange={(e) => setFormTaskId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 outline-none cursor-pointer"
                >
                  <option value="">Select task...</option>
                  {activeProject.tasks.map((task) => (
                    <option key={task.id} value={task.id} className="bg-slate-900 text-slate-200">
                      [{task.status}] {task.title} ({task.estimatedHours}h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Transition Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Your Current Shift *
                  </label>
                  <input
                    type="text"
                    required
                    value={formShiftFrom}
                    onChange={(e) => setFormShiftFrom(e.target.value)}
                    placeholder="e.g. Morning Shift (09:00 - 17:00)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Next Shift Taking Over *
                  </label>
                  <input
                    type="text"
                    required
                    value={formShiftTo}
                    onChange={(e) => setFormShiftTo(e.target.value)}
                    placeholder="e.g. Evening Shift (17:00 - 01:00)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              {/* Client Requirement Context */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Client Requirement / Core Acceptance Criteria *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formReqSummary}
                  onChange={(e) => setFormReqSummary(e.target.value)}
                  placeholder="State the exact client requirement so the incoming dev doesn't have to guess or check old emails..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none"
                />
              </div>

              {/* Work Completed */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                  What Did You Complete in this Shift? *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formProgress}
                  onChange={(e) => setFormProgress(e.target.value)}
                  placeholder="List code files changed, tests passed, or progress made..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none"
                />
              </div>

              {/* Critical Questions / Client Changes (The Silo Breaker) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
                  Questions, Client Adjustments, or Blockers Encountered (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={formQuestions}
                  onChange={(e) => setFormQuestions(e.target.value)}
                  placeholder="e.g. Client changed required video bitrate to 720p.&#10;Database migration needs --skip-seed flag."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none"
                />
              </div>

              {/* Next Steps for Incoming Dev */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">
                    Next Action for Next Engineer *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formNextSteps}
                    onChange={(e) => setFormNextSteps(e.target.value)}
                    placeholder="Exact place where they should start coding..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-rose-400 mb-1">
                    Watchout / Gotchas
                  </label>
                  <textarea
                    rows={2}
                    value={formGotchas}
                    onChange={(e) => setFormGotchas(e.target.value)}
                    placeholder="Things that could trip them up..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Publish Shift Handover Card</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
