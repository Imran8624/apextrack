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
import { BarChart3, User as UserIcon, Folder, FileCode, Terminal } from 'lucide-react';

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
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const kanbanColumns: { status: TaskStatus; title: string; color: string }[] = [
    { status: 'TODO', title: 'To Do', color: 'border-slate-200 bg-slate-50/80' },
    { status: 'IN_PROGRESS', title: 'In Progress', color: 'border-blue-200 bg-blue-50/50' },
    { status: 'IN_REVIEW', title: 'In Review', color: 'border-purple-200 bg-purple-50/50' },
    { status: 'BLOCKED', title: 'Blocked', color: 'border-amber-200 bg-amber-50/50' },
    { status: 'DONE', title: 'Done', color: 'border-emerald-200 bg-emerald-50/50' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 w-full min-w-0 overflow-hidden">
      {/* Header & Sub-view Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold shadow-xs">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Project Analytics & Visual Diagrams</h2>
            <p className="text-[11px] text-slate-500">Interactive Gantt timeline, Burndown curves, Kanban, & Employee File Explorer</p>
          </div>
        </div>

        <div className="flex flex-wrap bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold gap-1">
          <button
            onClick={() => setAnalyticsView('gantt')}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              analyticsView === 'gantt' ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Interactive Gantt
          </button>
          <button
            onClick={() => setAnalyticsView('burndown')}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              analyticsView === 'burndown' ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Burndown & Velocity
          </button>
          <button
            onClick={() => setAnalyticsView('kanban')}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
              analyticsView === 'kanban' ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setAnalyticsView('files')}
            className={`px-3 py-1.5 rounded-md text-xs transition-colors flex items-center space-x-1.5 ${
              analyticsView === 'files'
                ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
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
          <div className="flex justify-between items-center text-xs font-semibold text-slate-500">
            <span>Sprint Schedule & Task Progress Bars</span>
            <span>Calculated Finish Date: <strong className="text-indigo-600">{project.calculatedFinishDate}</strong></span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto">
            <div className="min-w-[650px] space-y-3">
              {/* Gantt Header Columns */}
              <div className="grid grid-cols-12 text-[11px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 pb-2">
                <div className="col-span-4">Task Name & Assignee</div>
                <div className="col-span-2">Est. / Logged</div>
                <div className="col-span-6">Timeline & Completion Progress Bar</div>
              </div>

              {/* Gantt Rows */}
              {project.tasks.map((task) => (
                <div key={task.id} className="grid grid-cols-12 items-center text-xs py-2 hover:bg-white rounded-md px-1 transition-colors border-b border-slate-100 last:border-none">
                  <div className="col-span-4 space-y-0.5 min-w-0">
                    <div className="flex items-center space-x-2 min-w-0">
                      <span className="font-semibold text-slate-800 truncate">{task.title}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border shrink-0 ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 flex items-center space-x-1 truncate">
                      <UserIcon className="w-3 h-3 text-indigo-500 shrink-0" />
                      <span className="truncate">{task.assigneeName || 'Unassigned'}</span>
                    </p>
                  </div>

                  <div className="col-span-2 text-slate-700 font-mono text-xs">
                    {task.loggedHours}h / {task.estimatedHours}h
                  </div>

                  <div className="col-span-6 space-y-1">
                    <div className="w-full bg-slate-200 h-3.5 rounded overflow-hidden flex relative border border-slate-300">
                      <div
                        style={{ width: `${task.progressPercent}%` }}
                        className={`h-full transition-all duration-300 ${
                          task.status === 'DONE'
                            ? 'bg-emerald-500'
                            : task.status === 'BLOCKED'
                            ? 'bg-amber-500'
                            : 'bg-indigo-600'
                        }`}
                      />
                      <span className="absolute inset-0 text-[9px] font-mono font-bold flex items-center justify-center text-white drop-shadow-xs">
                        {task.progressPercent}% ({task.status})
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
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
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Sprint Burndown (Ideal vs Actual Remaining Hours)
            </h4>
            <div className="h-60 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={velocityTrend}>
                  <defs>
                    <linearGradient id="idealGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="idealBurndown" name="Ideal Burndown (hrs)" stroke="#4f46e5" fillOpacity={1} fill="url(#idealGrad)" />
                  <Area type="monotone" dataKey="actualBurndown" name="Actual Remaining (hrs)" stroke="#f59e0b" fillOpacity={1} fill="url(#actualGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-indigo-700">
              Daily Logged Work Hours & Velocity Multiplier
            </h4>
            <div className="h-44 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={velocityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '0.5rem', fontSize: '11px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="loggedHours" name="Logged Hours" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="velocity" name="Velocity Multiplier" stroke="#6366f1" strokeWidth={2} />
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
                <div key={col.status} className={`p-2.5 rounded-lg border ${col.color} space-y-2.5 min-h-[350px] flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200/80 pb-1.5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-800">{col.title}</h4>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-600 border border-slate-200 font-semibold shadow-xs">
                        {columnTasks.length}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {columnTasks.map((task) => (
                        <div
                          key={task.id}
                          className="bg-white border border-slate-200 rounded-lg p-2.5 space-y-1.5 hover:border-slate-300 transition-colors shadow-xs"
                        >
                          <div className="flex justify-between items-start gap-1">
                            <span className="font-semibold text-xs text-slate-900 truncate">{task.title}</span>
                            <span className={`px-1.5 py-0.2 rounded text-[9px] font-semibold border shrink-0 ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-tight">{task.description}</p>

                          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                            <span>{task.loggedHours}h / {task.estimatedHours}h</span>
                            <span className="text-indigo-600 font-medium truncate">{task.assigneeName?.split(' ')[0]}</span>
                          </div>

                          {/* Status Transition Button */}
                          <div className="pt-1 flex justify-end">
                            <select
                              value={task.status}
                              onChange={(e) => onTaskStatusChange(task.id, e.target.value as TaskStatus)}
                              className="bg-slate-50 text-[10px] font-semibold text-slate-700 border border-slate-200 rounded px-1.5 py-0.5 outline-none cursor-pointer focus:border-indigo-500 focus:bg-white"
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
                        <div className="text-center text-[10px] text-slate-400 py-8 italic">
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
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500">
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
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 border ${
                    selectedUserId === u.id
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <UserIcon className="w-3 h-3" />
                  <span>{u.name}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 font-mono text-slate-600">
                    {u.role}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Worker Info Banner */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 min-w-0">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-600 text-xs shrink-0 shadow-xs">
                {selectedUser.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-xs text-slate-900 truncate">{selectedUser.name}&apos;s Workspace</h4>
                <p className="text-[11px] text-slate-500 truncate">{selectedUser.department} • {selectedUser.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs shrink-0">
              <span className="bg-white text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 text-[11px] font-mono shadow-xs">
                Committed Files: {userFiles.length}
              </span>
            </div>
          </div>

          {/* Directory Explorer & Code Preview Dual Pane */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[380px] w-full min-w-0">
            {/* Left Column: File Tree Directory */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col justify-between overflow-y-auto space-y-2 min-w-0">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-2 px-1 flex items-center space-x-1.5">
                <Folder className="w-3.5 h-3.5 text-indigo-600" />
                <span>Submitted Working Folder & Files</span>
              </div>

              <div className="space-y-1.5 flex-1 overflow-y-auto pr-1 min-w-0">
                {userFiles.map((file) => (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left p-2 rounded-lg text-xs font-medium border transition-colors space-y-1 min-w-0 ${
                      (activeFile?.id || selectedFileId) === file.id
                        ? 'bg-white border-indigo-300 text-indigo-900 shadow-xs'
                        : 'bg-white/80 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between min-w-0">
                      <div className="flex items-center space-x-1.5 truncate min-w-0">
                        <FileCode className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="font-semibold truncate text-slate-900 text-xs">{file.fileName}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-mono font-bold shrink-0 ml-1">
                        +{file.linesAdded}
                      </span>
                    </div>

                    <div className="text-[10px] text-slate-400 font-mono flex justify-between items-center pt-0.5 min-w-0">
                      <span className="truncate">{file.filePath}</span>
                      <span className="text-slate-400 whitespace-nowrap shrink-0 ml-1">{file.lastUpdated}</span>
                    </div>
                  </button>
                ))}

                {userFiles.length === 0 && (
                  <div className="text-center text-slate-400 text-xs py-10 italic">
                    No files committed by {selectedUser.name} yet.
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Code Viewer / Diff Box */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-3 flex flex-col justify-between overflow-hidden min-w-0 shadow-xs">
              {activeFile ? (
                <div className="flex flex-col h-full space-y-2 min-w-0">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-xs min-w-0">
                    <div className="flex items-center space-x-1.5 font-mono text-indigo-300 font-semibold truncate min-w-0">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{activeFile.filePath}</span>
                    </div>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono uppercase font-semibold shrink-0">
                      {activeFile.language}
                    </span>
                  </div>

                  {activeFile.taskTitle && (
                    <div className="text-[10px] text-slate-400 bg-slate-800/60 p-1.5 rounded border border-slate-700/50 truncate">
                      Linked Task: <strong className="text-slate-200">{activeFile.taskTitle}</strong>
                    </div>
                  )}

                  <div className="flex-1 bg-slate-950 rounded p-2.5 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-auto whitespace-pre leading-relaxed min-w-0">
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
