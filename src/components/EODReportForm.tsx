'use client';

import React, { useState, useRef } from 'react';
import { DailyReport, Project, UserRole, BlockerSeverity } from '@/types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertOctagon,
  Clock,
  User,
  Check,
  ShieldAlert,
  Zap,
  FileCode,
  Image,
  File,
  Trash2,
  Paperclip,
  Download
} from 'lucide-react';

interface EODReportFormProps {
  projects: Project[];
  reports: DailyReport[];
  currentRole: UserRole;
  onSubmitReport: (reportData: Partial<DailyReport>) => void;
  onApproveReport?: (reportId: string) => void;
}

export const EODReportForm: React.FC<EODReportFormProps> = ({
  projects,
  reports,
  currentRole,
  onSubmitReport,
  onApproveReport,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [hoursLogged, setHoursLogged] = useState<number>(7.5);
  const [tasksCompleted, setTasksCompleted] = useState<string>('');
  const [blockerDetails, setBlockerDetails] = useState<string>('');
  const [blockerSeverity, setBlockerSeverity] = useState<BlockerSeverity>('NONE');
  const [attachedFile, setAttachedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(ext || '')) {
      return <Image className="w-5 h-5 text-pink-400" />;
    }
    if (['ts', 'tsx', 'js', 'jsx', 'py', 'json', 'sql', 'html', 'css'].includes(ext || '')) {
      return <FileCode className="w-5 h-5 text-indigo-400" />;
    }
    return <FileText className="w-5 h-5 text-amber-400" />;
  };

  const processFile = (file: File) => {
    const sizeInKb = file.size / 1024;
    const formattedSize =
      sizeInKb > 1024 ? `${(sizeInKb / 1024).toFixed(1)} MB` : `${Math.round(sizeInKb)} KB`;
    setAttachedFile({
      name: file.name,
      size: formattedSize,
      type: file.type || file.name.split('.').pop() || 'unknown',
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleFillDemoData = () => {
    setTasksCompleted('Completed WebRTC stream integration and unit tests for video grid canvas.');
    setHoursLogged(8.0);
    setBlockerSeverity('MODERATE');
    setBlockerDetails('ICE candidate gathering timing out on corporate proxy firewall.');
    setAttachedFile({
      name: 'webrtc_network_trace.log',
      size: '184 KB',
      type: 'log',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasksCompleted.trim()) return;

    setIsSubmitting(true);

    const targetTask = selectedProject?.tasks.find(t => t.id === selectedTaskId);

    onSubmitReport({
      projectId: selectedProjectId,
      projectName: selectedProject?.name,
      taskId: selectedTaskId || undefined,
      taskTitle: targetTask?.title || undefined,
      hoursLogged: Number(hoursLogged),
      tasksCompleted,
      blockerDetails: blockerDetails.trim() ? blockerDetails : undefined,
      blockerSeverity,
      fileAttachment: attachedFile?.name || undefined,
      fileSize: attachedFile?.size || undefined,
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage('EOD Report submitted successfully! Dynamic project velocity updated.');
      setTasksCompleted('');
      setBlockerDetails('');
      setBlockerSeverity('NONE');
      setAttachedFile(null);
      setTimeout(() => setSuccessMessage(''), 4000);
    }, 400);
  };

  const getSeverityBadge = (severity: BlockerSeverity) => {
    switch (severity) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/60 text-rose-300 border border-rose-800/60">Critical Blocker</span>;
      case 'MODERATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950/60 text-amber-300 border border-amber-800/60">Moderate Issue</span>;
      case 'MINOR':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-950/60 text-blue-300 border border-blue-800/60">Minor Delay</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">No Blockers</span>;
    }
  };

  return (
    <div className="bg-[#161e2e] border border-[#232f3e] rounded-lg p-4 sm:p-5 shadow-sm space-y-4 w-full min-w-0 overflow-hidden">
      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232f3e] pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-md bg-[#232f3e] text-blue-400 border border-[#2d3748] flex items-center justify-center font-bold">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100">Daily EOD Work Reporting Module</h2>
            <p className="text-[11px] text-slate-400">Log progress, hours, and blocker details for dynamic deadline recalculation</p>
          </div>
        </div>

        <div className="flex bg-[#0f141c] p-0.5 rounded-md border border-[#232f3e] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              activeTab === 'submit' ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Submit EOD Log
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded text-xs transition-colors ${
              activeTab === 'history' ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Team Reports ({reports.length})
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-md bg-[#0f1d19] border border-emerald-900/50 text-emerald-300 text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {activeTab === 'submit' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleFillDemoData}
              className="px-2.5 py-1 rounded bg-[#0f141c] hover:bg-[#232f3e] text-slate-300 text-[11px] font-semibold border border-[#232f3e] flex items-center space-x-1.5 transition-colors"
            >
              <Zap className="w-3 h-3 text-blue-400" />
              <span>Fill Sample Data</span>
            </button>
          </div>

          {/* Project & Task Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Active Project *
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setSelectedTaskId('');
                }}
                className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#161e2e]">
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
                Associated Task (Optional)
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-3 py-2 text-xs text-slate-200 outline-none focus:border-blue-500 cursor-pointer"
              >
                <option value="">-- General Project Work --</option>
                {selectedProject?.tasks.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#161e2e]">
                    [{t.status}] {t.title} ({t.estimatedHours}h est)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hours Logged */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Logged Work Hours Today *</span>
              </label>
              <span className="text-xs font-mono font-bold text-slate-200 bg-[#0f141c] px-2.5 py-0.5 rounded border border-[#232f3e]">
                {hoursLogged} Hours
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="16.0"
              step="0.5"
              value={hoursLogged}
              onChange={(e) => setHoursLogged(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-[#0f141c] rounded-lg appearance-none cursor-pointer accent-[#ec7211]"
            />
          </div>

          {/* Work Completed */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1">
              Tasks Completed & Progress Notes *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail work performed today, PR links, resolved bugs, or test results..."
              value={tasksCompleted}
              onChange={(e) => setTasksCompleted(e.target.value)}
              className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Blocker Severity & Details */}
          <div className="bg-[#0f141c] p-3 rounded-md border border-[#232f3e] space-y-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center space-x-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                <span>Blockers & Impediments Severity</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['NONE', 'MINOR', 'MODERATE', 'CRITICAL'] as BlockerSeverity[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setBlockerSeverity(sev)}
                    className={`py-1.5 px-2.5 rounded-md text-xs font-semibold border transition-colors ${
                      blockerSeverity === sev
                        ? sev === 'CRITICAL'
                          ? 'bg-rose-950/70 text-rose-200 border-rose-700'
                          : sev === 'MODERATE'
                          ? 'bg-amber-950/70 text-amber-200 border-amber-700'
                          : sev === 'MINOR'
                          ? 'bg-blue-950/70 text-blue-200 border-blue-700'
                          : 'bg-emerald-950/70 text-emerald-200 border-emerald-700'
                        : 'bg-[#161e2e] text-slate-400 border-[#232f3e] hover:text-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {blockerSeverity !== 'NONE' && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-300 mb-1">
                  Blocker Details & Action Needed
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe technical hurdle, missing API access, dependency lock, or architectural blocker..."
                  value={blockerDetails}
                  onChange={(e) => setBlockerDetails(e.target.value)}
                  className="w-full bg-[#161e2e] border border-amber-900/60 rounded-md p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* Interactive Drag & Drop File Upload Area */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-blue-400" />
                <span>EOD File Attachment / Debug Logs</span>
              </span>
              <span className="text-[10px] text-slate-500 font-normal">Drag & Drop or Browse</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              className="hidden"
            />

            {!attachedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragEnter={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border border-dashed rounded-md p-4 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-500 bg-[#152336]'
                    : 'border-[#232f3e] hover:border-slate-500 bg-[#0f141c]'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                  <UploadCloud className="w-5 h-5 text-blue-400" />
                  <p className="text-xs font-semibold text-slate-200">
                    {isDragging ? 'Drop file to upload' : 'Drag & drop file here, or browse from device'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Supports debug logs, code files, screenshots, PDFs (Up to 50 MB)
                  </p>
                </div>

                {/* Quick 1-Click Sample File Chips */}
                <div
                  className="mt-3 pt-2.5 border-t border-[#232f3e] flex flex-wrap items-center justify-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[9px] font-semibold uppercase text-slate-500">Demo Attachments:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFile({ name: 'webrtc_network_trace.log', size: '184 KB', type: 'log' })
                    }
                    className="text-[10px] px-2 py-0.5 rounded bg-[#161e2e] hover:bg-[#232f3e] text-slate-300 border border-[#232f3e] flex items-center space-x-1"
                  >
                    <span>network_trace.log</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFile({ name: 'api_proxy_blocker.png', size: '720 KB', type: 'image' })
                    }
                    className="text-[10px] px-2 py-0.5 rounded bg-[#161e2e] hover:bg-[#232f3e] text-slate-300 border border-[#232f3e] flex items-center space-x-1"
                  >
                    <span>blocker_screenshot.png</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFile({ name: 'database_migration_diff.sql', size: '42 KB', type: 'code' })
                    }
                    className="text-[10px] px-2 py-0.5 rounded bg-[#161e2e] hover:bg-[#232f3e] text-slate-300 border border-[#232f3e] flex items-center space-x-1"
                  >
                    <span>migration_diff.sql</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Attached File Preview Card */
              <div className="bg-[#0f141c] p-2.5 rounded-md border border-[#232f3e] flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded bg-[#161e2e] border border-[#232f3e] flex items-center justify-center shrink-0">
                    {getFileIcon(attachedFile.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-100 truncate block">{attachedFile.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-[#161e2e] text-slate-400 border border-[#232f3e] shrink-0">
                        {attachedFile.size}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Ready to attach</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-1 rounded bg-[#161e2e] hover:bg-[#232f3e] text-slate-300 text-[10px] font-semibold border border-[#232f3e]"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="p-1 rounded bg-[#161e2e] hover:bg-rose-950/60 text-slate-400 hover:text-rose-300 border border-[#232f3e]"
                    title="Remove file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-md bg-[#ec7211] hover:bg-[#eb5f07] text-[#0f141c] font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit EOD Report'}</span>
          </button>
        </form>
      ) : (
        /* Team History View */
        <div className="space-y-3 w-full min-w-0">
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-1">
            <span>Submitted EOD Reports Queue</span>
            <span>{currentRole !== 'EMPLOYEE' ? 'Manager Review Granted' : 'Read-Only Feed'}</span>
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1 w-full min-w-0">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-[#0f141c] border border-[#232f3e] rounded-md p-3 space-y-2.5 transition-colors min-w-0 overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-7 h-7 rounded bg-[#161e2e] border border-[#232f3e] flex items-center justify-center font-bold text-blue-300 text-xs shrink-0">
                      {report.userName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-xs text-slate-200 truncate">{report.userName}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#161e2e] text-slate-400 font-mono">
                          {report.userRole}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate">{report.projectName} • {report.submittedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {getSeverityBadge(report.blockerSeverity)}
                    <span className="text-[10px] font-mono font-semibold text-slate-300 bg-[#161e2e] px-2 py-0.5 rounded border border-[#232f3e]">
                      {report.hoursLogged}h
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#161e2e] p-2.5 rounded border border-[#232f3e] break-words">
                  {report.tasksCompleted}
                </p>

                {report.blockerDetails && (
                  <div className="bg-[#1a1712] border border-amber-900/50 p-2.5 rounded text-xs text-amber-200/90 space-y-0.5 break-words">
                    <span className="font-semibold text-amber-300 text-[10px] flex items-center space-x-1 uppercase tracking-wider">
                      <ShieldAlert className="w-3 h-3 text-amber-400" />
                      <span>Blocker Detail:</span>
                    </span>
                    <p className="break-words text-xs">{report.blockerDetails}</p>
                  </div>
                )}

                {report.fileAttachment && (
                  <div className="bg-[#161e2e] p-2 rounded border border-[#232f3e] flex items-center justify-between text-xs min-w-0">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <Paperclip className="w-3 h-3 text-blue-400 shrink-0" />
                      <span className="font-medium text-slate-200 truncate text-[11px]">{report.fileAttachment}</span>
                      {report.fileSize && (
                        <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-[#0f141c] text-slate-400 shrink-0">
                          {report.fileSize}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.2 rounded border border-emerald-800/40 shrink-0">
                      Attached
                    </span>
                  </div>
                )}

                {/* Manager / TL Approval Action */}
                {(currentRole === 'TEAM_LEAD' || currentRole === 'MANAGER') && (
                  <div className="pt-1 flex justify-end">
                    {report.isApproved ? (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>Approved by Manager</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveReport && onApproveReport(report.id)}
                        className="px-2.5 py-1 rounded bg-[#232f3e] hover:bg-[#2d3748] text-emerald-300 border border-emerald-800/50 text-[11px] font-semibold transition-colors"
                      >
                        Approve Report
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
