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
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const kanbanColumns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'TODO', title: 'To Do', color: 'border-slate-700 bg-slate-900/50' },
    { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-indigo-500/50 bg-indigo-950/20' },
    { status: 'IN_REVIEW', title: 'In Review', color: 'border-purple-500/50 bg-purple-950/20' },
    { status: 'BLOCKED', title: 'Blocked', color: 'border-amber-500/50 bg-amber-950/20' },
    { status: 'DONE', title: 'Done', color: 'border-emerald-500/50 bg-emerald-950/20' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Header & Sub-view Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Project Analytics & Visual Diagrams</h2>
            <p className="text-xs text-slate-400">Interactive Gantt timeline, Burndown curves, Kanban, & Employee File Explorer</p>
          </div>
        </div>

        <div className="flex flex-wrap bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold gap-1">
          <button
            onClick={() => setAnalyticsView('gantt')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              analyticsView === 'gantt' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Gantt
          </button>
          <button
            onClick={() => setAnalyticsView('burndown')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              analyticsView === 'burndown' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Burndown & Velocity
          </button>
          <button
            onClick={() => setAnalyticsView('kanban')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              analyticsView === 'kanban' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setAnalyticsView('files')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              analyticsView === 'files'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md font-bold'
                : 'text-indigo-400 hover:text-indigo-200 hover:bg-slate-900'
            }`}
          >
            <Folder className="w-3.5 h-3.5" />
            <span>📁 Employee File Explorer</span>
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

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 overflow-x-auto">
            <div className="min-w-[700px] space-y-4">
              {/* Gantt Header Columns */}
              <div className="grid grid-cols-12 text-xs font-bold text-slate-400 uppercase border-b border-slate-800 pb-2">
                <div className="col-span-4">Task Name & Assignee</div>
                <div className="col-span-2">Est. / Logged</div>
                <div className="col-span-6">Timeline & Completion Progress Bar</div>
              </div>

              {/* Gantt Rows */}
              {project.tasks.map((task) => (
                <div key={task.id} className="grid grid-cols-12 items-center text-xs py-2 hover:bg-slate-900/60 rounded-lg px-1 transition-all">
                  <div className="col-span-4 space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-200">{task.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <UserIcon className="w-3 h-3 text-indigo-400" />
                      <span>{task.assigneeName || 'Unassigned'}</span>
                    </p>
                  </div>

                  <div className="col-span-2 text-slate-300 font-mono">
                    {task.loggedHours}h / {task.estimatedHours}h
                  </div>

                  <div className="col-span-6 space-y-1">
                    <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex relative">
                      <div
                        style={{ width: `${task.progressPercent}%` }}
                        className={`h-full transition-all duration-500 ${
                          task.status === 'DONE'
                            ? 'bg-emerald-500'
                            : task.status === 'BLOCKED'
                            ? 'bg-amber-500'
                            : 'bg-indigo-500'
                        }`}
                      />
                      <span className="absolute inset-0 text-[10px] font-bold flex items-center justify-center text-slate-200 drop-shadow">
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
        <div className="space-y-6">
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Sprint Burndown (Ideal vs Actual Remaining Hours)
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityTrend}>
                  <defs>
                    <linearGradient id="idealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="idealBurndown" name="Ideal Burndown (hrs)" stroke="#6366f1" fillOpacity={1} fill="url(#idealGrad)" />
                  <Area type="monotone" dataKey="actualBurndown" name="Actual Remaining (hrs)" stroke="#ec4899" fillOpacity={1} fill="url(#actualGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Daily Logged Work Hours & Velocity Multiplier
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="loggedHours" name="Logged Hours" stroke="#10b981" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="velocity" name="Velocity Multiplier" stroke="#f59e0b" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: Interactive Kanban Board */}
      {analyticsView === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {kanbanColumns.map((col) => {
            const columnTasks = project.tasks.filter((t) => t.status === col.status);
            return (
              <div key={col.status} className={`p-3 rounded-xl border ${col.color} space-y-3 min-h-[350px]`}>
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">{col.title}</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-slate-900 border border-slate-800 rounded-xl p-3 space-y-2 hover:border-indigo-500/50 transition-all shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-xs text-slate-100">{task.title}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold border ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2">{task.description}</p>

                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <span>{task.loggedHours}h / {task.estimatedHours}h</span>
                        <span className="text-indigo-400">{task.assigneeName?.split(' ')[0]}</span>
                      </div>

                      {/* Status Transition Button */}
                      <div className="pt-1 flex justify-end">
                        <select
                          value={task.status}
                          onChange={(e) => onTaskStatusChange(task.id, e.target.value as TaskStatus)}
                          className="bg-slate-950 text-[10px] font-bold text-slate-300 border border-slate-800 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                        >
                          <option value="TODO">Move: To Do</option>
                          <option value="IN_PROGRESS">Move: In Progress</option>
                          <option value="IN_REVIEW">Move: In Review</option>
                          <option value="BLOCKED">Move: Blocked</option>
                          <option value="DONE">Move: Done</option>
                        </select>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="text-center text-[11px] text-slate-600 py-8 italic">
                      No tasks in {col.title}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 4: Employee Code & Deliverables Explorer */}
      {analyticsView === 'files' && (
        <div className="space-y-6">
          {/* Employee Worker Pills Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              Select Employee / Worker Directory:
            </label>
            <div className="flex flex-wrap gap-2">
              {users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => {
                    setSelectedUserId(u.id);
                    if (u.workingFiles && u.workingFiles.length > 0) {
                      setSelectedFileId(u.workingFiles[0].id);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 border ${
                    selectedUserId === u.id
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{u.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900/60 font-mono">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Worker Info Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 text-base">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-100">{selectedUser.name} &apos;s Working Workspace</h4>
                <p className="text-xs text-slate-400">{selectedUser.department} • {selectedUser.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-xs">
              <span className="bg-indigo-500/10 text-indigo-300 px-3 py-1 rounded-lg border border-indigo-500/20 font-semibold">
                Committed Files: {userFiles.length}
              </span>
            </div>
          </div>

          {/* Directory Explorer & Code Preview Dual Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[420px]">
            {/* Left Column: File Tree Directory */}
            <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between overflow-y-auto space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2 px-1 flex items-center space-x-1.5">
                <Folder className="w-4 h-4 text-indigo-400" />
                <span>Submitted Working Folder & Files</span>
              </div>

              <div className="space-y-1.5 flex-1 overflow-y-auto pr-1">
                {userFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all space-y-1 ${
                      (activeFile?.id || selectedFileId) === file.id
                        ? 'bg-indigo-950/40 border-indigo-500/60 text-white shadow-md'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <FileCode className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                        <span className="font-bold truncate text-slate-100">{file.fileName}</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold">
                        +{file.linesAdded}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono flex justify-between items-center pt-0.5">
                      <span className="truncate">{file.filePath}</span>
                      <span className="text-slate-500 whitespace-nowrap">{file.lastUpdated}</span>
                    </div>
                  </button>
                ))}

                {userFiles.length === 0 && (
                  <div className="text-center text-slate-500 text-xs py-12 italic">
                    No files committed by {selectedUser.name} yet.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Code Viewer / Diff Box */}
            <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between overflow-hidden">
              {activeFile ? (
                <div className="flex flex-col h-full space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
                    <div className="flex items-center space-x-2 font-mono text-indigo-300 font-bold">
                      <Terminal className="w-4 h-4 text-indigo-400" />
                      <span>{activeFile.filePath}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono uppercase font-bold">
                      {activeFile.language}
                    </span>
                  </div>

                  {activeFile.taskTitle && (
                    <div className="text-[11px] text-slate-400 bg-slate-900 p-2 rounded-lg border border-slate-800">
                      Linked Task: <strong className="text-slate-200">{activeFile.taskTitle}</strong>
                    </div>
                  )}

                  <div className="flex-1 bg-slate-900 rounded-xl p-3 border border-slate-800 font-mono text-xs text-slate-300 overflow-auto whitespace-pre leading-relaxed">
                    {activeFile.codeSnippet}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-500 text-xs italic">
                  Select a file from the left directory tree to inspect code snippet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
