'use client';

import React, { useState } from 'react';
import { UserRole, Project, User, ShiftHandover } from '@/types';
import { WORKFLOW_PROBLEM_STEPS } from '@/lib/mockData';
import {
  GitMerge,
  ArrowRight,
  AlertOctagon,
  CheckCircle2,
  Clock,
  UserCheck,
  FileText,
  ShieldAlert,
  Sparkles,
  Repeat,
  PlusCircle,
  AlertTriangle,
  Send,
  Layers,
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
    setFormTaskId('');
    setFormReqSummary('');
    setFormProgress('');
    setFormQuestions('');
    setFormNextSteps('');
    setFormGotchas('');
  };

  const selectedStep = WORKFLOW_PROBLEM_STEPS[selectedStepIndex];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Value Proposition & Problem Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 w-full min-w-0">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 flex items-center space-x-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>The Tribal Knowledge Crisis</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Apex Continuity Engine</span>
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Solving the Broken Workflow & Shift Handover Trap
              </h2>
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('comparison')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  viewMode === 'comparison'
                    ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Problem vs. Solution</span>
              </button>

              <button
                onClick={() => setViewMode('handovers')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  viewMode === 'handovers'
                    ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>Active Shift Handovers ({handovers.length})</span>
              </button>
            </div>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed max-w-4xl">
            In traditional organizations, <strong>client requirements get scattered</strong>, questions remain in personal chats, and whenever an employee ends their shift or moves to another project, the next engineer inherits zero context—costing hours of reverse-engineering and causing project delays. ApexTracker replaces this breakdown with <strong>structured handover protocols and anchored living context</strong>.
          </p>

          {/* 3 High-Impact Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-emerald-600 flex items-center justify-center font-bold shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Shift Handover Ramp-up</p>
                <p className="text-sm font-bold text-slate-900">90 seconds <span className="text-[11px] font-semibold text-emerald-600">(-96% time saved)</span></p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Knowledge Retention</p>
                <p className="text-sm font-bold text-slate-900">99.4% <span className="text-[11px] font-semibold text-indigo-600">Zero context lost</span></p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-purple-600 flex items-center justify-center font-bold shadow-xs">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 font-medium">Prevented Deadline Slippage</p>
                <p className="text-sm font-bold text-slate-900">100% On-Track <span className="text-[11px] font-semibold text-purple-600">Dynamic engine</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE 8-STEP BREAKDOWN COMPARISON */}
      {viewMode === 'comparison' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full min-w-0">
          {/* Left: The 8-Step Interactive Pipeline Flow */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>The 8-Stage Workflow Breakdown Sequence</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Click any step below to see why traditional workflows fail and how ApexTracker eliminates the risk</p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Protocol View</span>
            </div>

            <div className="space-y-2">
              {WORKFLOW_PROBLEM_STEPS.map((step, idx) => {
                const isSelected = selectedStepIndex === idx;
                const isCriticalPoint = idx === 4 || idx === 5; // Information stays with individual / Shift change

                return (
                  <div
                    key={step.stepNumber}
                    onClick={() => setSelectedStepIndex(idx)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between group min-w-0 ${
                      isSelected
                        ? isCriticalPoint
                          ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                          : 'bg-indigo-50/80 border-indigo-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                          isSelected
                            ? isCriticalPoint
                              ? 'bg-rose-600 text-white'
                              : 'bg-indigo-600 text-white'
                            : isCriticalPoint
                            ? 'bg-rose-100 text-rose-700 border border-rose-200'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {step.stepNumber}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-semibold truncate ${isSelected ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                            {step.traditionalStep}
                          </span>
                          {isCriticalPoint && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider bg-rose-100 text-rose-700 border border-rose-200">
                              Failure Point
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {step.traditionalConsequence}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0 ml-2">
                      <span className="text-[10px] hidden sm:inline font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                        {step.apexSolutionTitle}
                      </span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Step Deep-Dive Comparison Card */}
          <div className="lg:col-span-5 space-y-4 min-w-0">
            <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs border border-indigo-200">
                    #{selectedStep.stepNumber}
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider font-semibold">
                      Stage Audit & Comparison
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {selectedStep.traditionalStep}
                    </h4>
                  </div>
                </div>

                {selectedStep.status === 'critical' ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                    High Vulnerability
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Automated
                  </span>
                )}
              </div>

              {/* What Happens Traditionally (The Breakdown) */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-lg p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-rose-700 font-semibold text-xs">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                  <span>Traditional Broken Workflow</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedStep.traditionalConsequence}
                </p>
                <div className="pt-1 text-[10px] text-rose-600 font-mono font-medium">
                  Impact: Context friction, lost decisions, 3-5 hr dev delay
                </div>
              </div>

              {/* How ApexTracker Fixes It */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-lg p-3.5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Apex Solution: {selectedStep.apexSolutionTitle}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {selectedStep.apexSolutionDescription}
                </p>
                <div className="pt-1 text-[10px] text-emerald-600 font-mono font-medium">
                  Result: Zero context lost • Immediate continuity • Auto-logged
                </div>
              </div>

              {/* Quick Action Button */}
              <button
                onClick={() => setViewMode('handovers')}
                className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-2 shadow-xs"
              >
                <span>View Live Shift Handover Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Why This Matters Box */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <span className="font-semibold text-slate-900 block text-xs">Engineering Management Standard:</span>
              <p className="leading-relaxed">
                Unstructured workflows cause over 70% of project delivery slippage. Binding client specifications directly to task context and generating immutable handover summaries prevents tribal knowledge loss.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ACTIVE SHIFT HANDOVERS CONSOLE */}
      {viewMode === 'handovers' && (
        <div className="space-y-4 w-full min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <GitMerge className="w-4 h-4 text-indigo-600" />
                <span>Shift Handover Protocol & Pass-Down Cards</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Structured transfer of context, logged questions, client updates, and next steps between shifts.
              </p>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 shrink-0 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Shift Handover Brief</span>
            </button>
          </div>

          {/* Handover Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full min-w-0">
            {handovers.map((handover) => {
              const isPending = handover.status === 'PENDING_PICKUP';

              return (
                <div
                  key={handover.id}
                  className={`bg-white rounded-xl p-4 border transition-colors space-y-3.5 flex flex-col justify-between min-w-0 overflow-hidden shadow-xs ${
                    isPending
                      ? 'border-amber-300 ring-1 ring-amber-300/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="space-y-3 min-w-0">
                    {/* Header: Project & Shift Transition */}
                    <div className="flex items-start justify-between gap-2 min-w-0">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-600 block font-semibold truncate">
                          {handover.projectName}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                          {handover.taskTitle}
                        </h4>
                      </div>

                      {isPending ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200 flex items-center space-x-1 shrink-0">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Needs Pickup</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1 shrink-0">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Accepted</span>
                        </span>
                      )}
                    </div>

                    {/* Shift Routing Badges */}
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs min-w-0">
                      <div className="min-w-0">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Outgoing Shift</span>
                        <span className="font-semibold text-slate-900 text-xs truncate block">{handover.outgoingEmployeeName}</span>
                        <span className="text-[10px] text-slate-500 block font-mono truncate">{handover.shiftFrom}</span>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mx-2" />

                      <div className="text-right min-w-0">
                        <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Shift</span>
                        <span className="font-semibold text-indigo-700 text-xs truncate block">
                          {handover.incomingEmployeeName || 'Any Available Engineer'}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono truncate">{handover.shiftTo}</span>
                      </div>
                    </div>

                    {/* Client Requirement Context */}
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center space-x-1">
                        <FileText className="w-3 h-3 text-indigo-600" />
                        <span>Client Requirement Specification:</span>
                      </span>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 break-words">
                        {handover.clientRequirementSummary}
                      </p>
                    </div>

                    {/* Progress Completed & Code Touched */}
                    <div className="space-y-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Work Completed in this Shift:</span>
                      </span>
                      <p className="text-xs text-slate-700 break-words">
                        {handover.progressSummary}
                      </p>
                    </div>

                    {/* Questions & Changes Logged (The Critical Silo Breaker) */}
                    {handover.criticalQuestionsOrChanges.length > 0 && (
                      <div className="space-y-1 bg-amber-50/80 border border-amber-200 p-2.5 rounded-lg min-w-0">
                        <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center space-x-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Questions, Client Changes & Issues Logged:</span>
                        </span>
                        <ul className="space-y-1">
                          {handover.criticalQuestionsOrChanges.map((q, idx) => (
                            <li key={idx} className="text-xs text-amber-900 flex items-start space-x-1.5 break-words">
                              <span className="text-amber-600 font-bold">•</span>
                              <span className="break-words">{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Next Steps for Incoming Engineer */}
                    <div className="bg-indigo-50/70 border border-indigo-200 p-2.5 rounded-lg space-y-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-indigo-800 tracking-wider flex items-center space-x-1">
                        <ArrowRight className="w-3 h-3 text-indigo-600" />
                        <span>Immediate Next Steps for Incoming Shift:</span>
                      </span>
                      <p className="text-xs text-slate-700 break-words">
                        {handover.nextStepsForIncoming}
                      </p>
                    </div>

                    {/* Watchouts & Gotchas */}
                    {handover.gotchasAndWatchouts && (
                      <div className="text-[11px] text-slate-700 bg-rose-50/70 p-2 rounded-lg border border-rose-200 break-words">
                        <strong className="text-rose-700">⚠️ Watchout:</strong> {handover.gotchasAndWatchouts}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Action Buttons */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-3">
                    <span className="text-[10px] text-slate-400 font-mono">
                      Logged {handover.createdTime}
                    </span>

                    {isPending ? (
                      <button
                        onClick={() => onAcceptHandover(handover.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Claim Handover</span>
                      </button>
                    ) : (
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Claimed by {handover.incomingEmployeeName || currentUser.name}</span>
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-5 sm:p-6 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-400 block tracking-wider font-semibold">
                  Prevent Knowledge Loss
                </span>
                <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                  <GitMerge className="w-4 h-4 text-indigo-600" />
                  <span>Create Shift Handover & Pass-Down Card</span>
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3.5">
              {/* Task Selector */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Active Task Being Handed Over *
                </label>
                <select
                  required
                  value={formTaskId}
                  onChange={(e) => setFormTaskId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none cursor-pointer focus:border-indigo-500 focus:bg-white"
                >
                  <option value="">Select task...</option>
                  {activeProject.tasks.map((task) => (
                    <option key={task.id} value={task.id} className="bg-white text-slate-800">
                      [{task.status}] {task.title} ({task.estimatedHours}h)
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift Transition Times */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Your Current Shift *
                  </label>
                  <input
                    type="text"
                    required
                    value={formShiftFrom}
                    onChange={(e) => setFormShiftFrom(e.target.value)}
                    placeholder="e.g. Morning Shift (09:00 - 17:00)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Next Shift Taking Over *
                  </label>
                  <input
                    type="text"
                    required
                    value={formShiftTo}
                    onChange={(e) => setFormShiftTo(e.target.value)}
                    placeholder="e.g. Evening Shift (17:00 - 01:00)"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Client Requirement Context */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Client Requirement / Core Acceptance Criteria *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formReqSummary}
                  onChange={(e) => setFormReqSummary(e.target.value)}
                  placeholder="State the exact client requirement so incoming dev doesn't have to guess or check old emails..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* Work Completed */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  What Did You Complete in this Shift? *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formProgress}
                  onChange={(e) => setFormProgress(e.target.value)}
                  placeholder="List code files changed, tests passed, or progress made..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* Critical Questions / Client Changes (The Silo Breaker) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                  Questions, Client Adjustments, or Blockers Encountered (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={formQuestions}
                  onChange={(e) => setFormQuestions(e.target.value)}
                  placeholder="e.g. Client changed required video bitrate to 720p.&#10;Database migration needs --skip-seed flag."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              {/* Next Steps for Incoming Dev */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Next Action for Next Engineer *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formNextSteps}
                    onChange={(e) => setFormNextSteps(e.target.value)}
                    placeholder="Exact place where they should start coding..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                    Watchout / Gotchas
                  </label>
                  <textarea
                    rows={2}
                    value={formGotchas}
                    onChange={(e) => setFormGotchas(e.target.value)}
                    placeholder="Things that could trip them up..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
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
