'use client';

import React, { useState } from 'react';
import { Project, TaskStatus, VelocityLogEntry, User, WorkingFile } from '@/types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { BarChart3, User as UserIcon, Folder, FileCode, Clock, CheckCircle2, AlertCircle, FileText, ChevronRight, Terminal, Plus, Minus, Code2 } from 'lucide-react';

interface ProjectAnalyticsProps {
  project: Project;
  velocityTrend: VelocityLogEntry[];
  users: User[];
  onTaskStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

export const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({
  project,
  velocityTrend,
  users,
  onTaskStatusChange,
}) => {
  const [analyticsView, setAnalyticsView] = useState<'gantt' | 'burndown' | 'kanban' | 'files'>('gantt');

  // Employee File Explorer State
  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || 'u-1');
  const selectedUser = users.find((u) => u.id === selectedUserId) || users[0];
  const userFiles: WorkingFile[] = selectedUser?.workingFiles || [];
  const [selectedFileId, setSelectedFileId] = useState<string>(userFiles[0]?.id || '');

  const activeFile = userFiles.find((f) => f.id === selectedFileId) || userFiles[0];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-rose-950/60 text-rose-300 border-rose-800/60';
      case 'HIGH':
        return 'bg-amber-950/60 text-amber-300 border-amber-800/60';
      case 'MEDIUM':
        return 'bg-blue-950/60 text-blue-300 border-blue-800/60';
      default:
        return 'bg-[#232f3e] text-slate-300 border-slate-700/60';
    }
  };

  const kanbanColumns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'TODO', title: 'To Do', color: 'border-[#232f3e] bg-[#0f141c]' },
    { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-blue-900/60 bg-[#121c2c]' },
    { status: 'IN_REVIEW', title: 'In Review', color: 'border-purple-900/60 bg-[#181628]' },
    { status: 'BLOCKED', title: 'Blocked', color: 'border-amber-900/60 bg-[#1e1a14]' },
    { status: 'DONE', title: 'Done', color: 'border-emerald-900/60 bg-[#0f1d19]' },
  ];

  return (
    <div className="bg-[#161e2e] border border-[#232f3e] rounded-lg p-4 sm:p-5 shadow-sm space-y-4 w-full min-w-0 overflow-hidden">
      {/* Header & Sub-view Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232f3e] pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-[#232f3e] text-blue-400 border border-[#2d3748] flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Project Analytics & Visual Diagrams</h2>
            <p className="text-[11px] text-slate-400">Interactive Gantt timeline, Burndown curves, Kanban, & Employee File Explorer</p>
          </div>
        </div>

        <div className="flex flex-wrap bg-[#0f141c] p-1 rounded-md border border-[#232f3e] text-xs font-semibold gap-1">
          <button
            onClick={() => setAnalyticsView('gantt')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              analyticsView === 'gantt' ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Gantt
          </button>
          <button
            onClick={() => setAnalyticsView('burndown')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              analyticsView === 'burndown' ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Burndown & Velocity
          </button>
          <button
            onClick={() => setAnalyticsView('kanban')}
            className={`px-3 py-1.5 rounded text-xs transition-colors ${
              analyticsView === 'kanban' ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setAnalyticsView('files')}
            className={`px-3 py-1.5 rounded text-xs transition-colors flex items-center space-x-1.5 ${
              analyticsView === 'files'
                ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>File Explorer</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Interactive Gantt Chart */}
      {analyticsView === 'gantt' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
            <span>Sprint Schedule & Task Progress Bars</span>
            <span>Calculated Finish Date: <strong className="text-indigo-400">{project.calculatedFinishDate}</strong></span>
          </div>

          <div className="bg-[#0f141c] border border-[#232f3e] rounded-md p-3 overflow-x-auto">
            <div className="min-w-[650px] space-y-3">
              {/* Gantt Header Columns */}
              <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-[#232f3e] pb-2">
                <div className="col-span-4">Task Name & Assignee</div>
                <div className="col-span-2">Est. / Logged</div>
                <div className="col-span-6">Timeline & Completion Progress Bar</div>
              </div>

              {/* Gantt Rows */}
              {project.tasks.map((task) => (
                <div key={task.id} className="grid grid-cols-12 items-center text-xs py-2 hover:bg-[#161e2e] rounded px-1 transition-colors">
                  <div className="col-span-4 space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-semibold text-slate-200 truncate">{task.title}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border shrink-0 ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-1 truncate">
                      <UserIcon className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="truncate">{task.assigneeName || 'Unassigned'}</span>
                    </p>
                  </div>

                  <div className="col-span-2 text-slate-300 font-mono text-xs">
                    {task.loggedHours}h / {task.estimatedHours}h
                  </div>

                  <div className="col-span-6 space-y-1">
                    <div className="w-full bg-[#161e2e] h-3.5 rounded overflow-hidden flex relative border border-[#232f3e]">
                      <div
                        style={{ width: `${task.progressPercent}%` }}
                        className={`h-full transition-all duration-300 ${
                          task.status === 'DONE'
                            ? 'bg-emerald-600'
                            : task.status === 'BLOCKED'
                            ? 'bg-amber-600'
                            : 'bg-blue-600'
                        }`}
                      />
                      <span className="absolute inset-0 text-[9px] font-mono font-bold flex items-center justify-center text-white">
                        {task.progressPercent}% ({task.status})
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Start: {task.startDate}</span>
                      <span>Due: {task.dueDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Burndown & Velocity Chart */}
      {analyticsView === 'burndown' && (
        <div className="space-y-4 w-full min-w-0">
          <div className="bg-[#0f141c] border border-[#232f3e] rounded-md p-3.5 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Sprint Burndown (Ideal vs Actual Remaining Hours)
            </h4>
            <div className="h-60 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityTrend}>
                  <defs>
                    <linearGradient id="idealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232f3e" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#161e2e', borderColor: '#232f3e', borderRadius: '0.375rem', fontSize: '11px', color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="idealBurndown" name="Ideal Burndown (hrs)" stroke="#3b82f6" fillOpacity={1} fill="url(#idealGrad)" />
                  <Area type="monotone" dataKey="actualBurndown" name="Actual Remaining (hrs)" stroke="#f59e0b" fillOpacity={1} fill="url(#actualGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#0f141c] border border-[#232f3e] rounded-md p-3.5 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Daily Logged Work Hours & Velocity Multiplier
            </h4>
            <div className="h-44 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#232f3e" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#161e2e', borderColor: '#232f3e', borderRadius: '0.375rem', fontSize: '11px', color: '#e2e8f0' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="loggedHours" name="Logged Hours" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="velocity" name="Velocity Multiplier" stroke="#60a5fa" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Interactive Kanban Board */}
      {analyticsView === 'kanban' && (
        <div className="overflow-x-auto pb-2 min-w-0">
          <div className="grid grid-cols-5 gap-3 min-w-[720px]">
            {kanbanColumns.map((col) => {
              const columnTasks = project.tasks.filter((t) => t.status === col.status);
              return (
                <div key={col.status} className={`p-2.5 rounded-md border ${col.color} space-y-2.5 min-h-[350px] flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-[#232f3e] pb-1.5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-200">{col.title}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0f141c] text-slate-400 border border-[#232f3e]">
                        {columnTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {columnTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-[#161e2e] border border-[#232f3e] rounded-md p-2.5 space-y-1.5 hover:border-slate-600 transition-colors shadow-sm"
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-semibold text-xs text-slate-100 truncate">{task.title}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border shrink-0 ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-tight">{task.description}</p>

                          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-[#232f3e]">
                            <span>{task.loggedHours}h / {task.estimatedHours}h</span>
                            <span className="text-blue-400 truncate">{task.assigneeName?.split(' ')[0]}</span>
                          </div>

                          {/* Status Transition Button */}
                          <div className="pt-1 flex justify-end">
                            <select
                              value={task.status}
                              onChange={(e) => onTaskStatusChange(task.id, e.target.value as TaskStatus)}
                              className="bg-[#0f141c] text-[10px] font-semibold text-slate-300 border border-[#232f3e] rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-blue-500"
                            >
                              <option value="TODO">To Do</option>
                              <option value="IN_PROGRESS">In Progress</option>
                              <option value="IN_REVIEW">In Review</option>
                              <option value="BLOCKED">Blocked</option>
                              <option value="DONE">Done</option>
                            </select>
                          </div>
                        </div>
                      ))}

                      {columnTasks.length === 0 && (
                        <div className="text-center text-[10px] text-slate-500 py-8 italic">
                          No tasks
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 4: Employee Code & Deliverables Explorer */}
      {analyticsView === 'files' && (
        <div className="space-y-4 w-full min-w-0">
          {/* Employee Worker Pills Selector */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Select Employee / Worker Directory:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSelectedUserId(u.id);
                    if (u.workingFiles && u.workingFiles.length > 0) {
                      setSelectedFileId(u.workingFiles[0].id);
                    }
                  }}
                  className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 border ${
                    selectedUserId === u.id
                      ? 'bg-[#232f3e] text-white border-[#3b82f6]/40'
                      : 'bg-[#0f141c] text-slate-400 border-[#232f3e] hover:text-slate-200'
                  }`}
                >
                  <UserIcon className="w-3 h-3" />
                  <span>{u.name}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#0f141c] font-mono text-slate-400">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Worker Info Banner */}
          <div className="bg-[#0f141c] p-3 rounded-md border border-[#232f3e] flex flex-wrap items-center justify-between gap-3 min-w-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded bg-[#232f3e] border border-[#2d3748] flex items-center justify-center font-bold text-blue-400 text-xs shrink-0">
                {selectedUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-xs text-slate-100 truncate">{selectedUser.name}&apos;s Workspace</h4>
                <p className="text-[11px] text-slate-400 truncate">{selectedUser.department} • {selectedUser.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs shrink-0">
              <span className="bg-[#232f3e] text-slate-300 px-2 py-0.5 rounded border border-[#2d3748] text-[11px] font-mono">
                Committed Files: {userFiles.length}
              </span>
            </div>
          </div>

          {/* Directory Explorer & Code Preview Dual Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[380px] w-full min-w-0">
            {/* Left Column: File Tree Directory */}
            <div className="lg:col-span-5 bg-[#0f141c] border border-[#232f3e] rounded-md p-3 flex flex-col justify-between overflow-y-auto space-y-2 min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-[#232f3e] pb-2 px-1 flex items-center space-x-1.5">
                <Folder className="w-3.5 h-3.5 text-blue-400" />
                <span>Submitted Working Folder & Files</span>
              </div>

              <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 min-w-0">
                {userFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left p-2 rounded-md text-xs font-medium border transition-colors space-y-1 min-w-0 ${
                      (activeFile?.id || selectedFileId) === file.id
                        ? 'bg-[#152336] border-blue-600/70 text-white'
                        : 'bg-[#161e2e] border-[#232f3e] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between min-w-0">
                      <div className="flex items-center space-x-1.5 truncate min-w-0">
                        <FileCode className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="font-semibold truncate text-slate-100 text-xs">{file.fileName}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0 ml-1">
                        +{file.linesAdded}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono flex justify-between items-center pt-0.5 min-w-0">
                      <span className="truncate">{file.filePath}</span>
                      <span className="text-slate-500 whitespace-nowrap shrink-0 ml-1">{file.lastUpdated}</span>
                    </div>
                  </button>
                ))}

                {userFiles.length === 0 && (
                  <div className="text-center text-slate-500 text-xs py-10 italic">
                    No files committed by {selectedUser.name} yet.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Code Viewer / Diff Box */}
            <div className="lg:col-span-7 bg-[#0f141c] border border-[#232f3e] rounded-md p-3 flex flex-col justify-between overflow-hidden min-w-0">
              {activeFile ? (
                <div className="flex flex-col h-full space-y-2 min-w-0">
                  <div className="flex items-center justify-between border-b border-[#232f3e] pb-1.5 text-xs min-w-0">
                    <div className="flex items-center space-x-1.5 font-mono text-blue-300 font-semibold truncate min-w-0">
                      <Terminal className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span className="truncate">{activeFile.filePath}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#232f3e] text-slate-400 font-mono uppercase font-semibold shrink-0">
                      {activeFile.language}
                    </span>
                  </div>

                  {activeFile.taskTitle && (
                    <div className="text-[10px] text-slate-400 bg-[#161e2e] p-1.5 rounded border border-[#232f3e] truncate">
                      Linked Task: <strong className="text-slate-200">{activeFile.taskTitle}</strong>
                    </div>
                  )}

                  <div className="flex-1 bg-[#161e2e] rounded p-2.5 border border-[#232f3e] font-mono text-[11px] text-slate-300 overflow-auto whitespace-pre leading-relaxed min-w-0">
                    {activeFile.codeSnippet}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs italic">
                  Select a file from directory tree to inspect code snippet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
