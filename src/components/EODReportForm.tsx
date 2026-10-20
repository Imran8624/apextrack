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
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">🚨 Critical Blocker</span>;
      case 'MODERATE':
        return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">⚠️ Moderate Issue</span>;
      case 'MINOR':
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">ℹ️ Minor Delay</span>;
      default:
        return <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">✓ No Blockers</span>;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">Daily EOD Work Reporting Module</h2>
            <p className="text-xs text-slate-400">Log progress, hours, and blocker details for dynamic deadline recalculation</p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'submit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Submit EOD Log
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Team Reports History ({reports.length})
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-medium flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {activeTab === 'submit' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleFillDemoData}
              className="px-3 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center space-x-1 transition-all"
            >
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>⚡ 1-Click Fill Demo Sample Data</span>
            </button>
          </div>

          {/* Project & Task Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Active Project *
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setSelectedTaskId('');
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Associated Task (Optional)
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="">-- General Project Work --</option>
                {selectedProject?.tasks.map((t) => (
                  <option key={t.id} value={t.id}>
                    [{t.status}] {t.title} ({t.estimatedHours}h est)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hours Logged */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Logged Work Hours Today *</span>
              </label>
              <span className="text-sm font-extrabold text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20">
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
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Work Completed */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Tasks Completed & Progress Notes *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail work performed today, PR links, resolved bugs, or test results..."
              value={tasksCompleted}
              onChange={(e) => setTasksCompleted(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>

          {/* Blocker Severity & Details */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center space-x-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <span>Blockers & Impediments Severity</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['NONE', 'MINOR', 'MODERATE', 'CRITICAL'] as BlockerSeverity[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setBlockerSeverity(sev)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      blockerSeverity === sev
                        ? sev === 'CRITICAL'
                          ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                          : sev === 'MODERATE'
                          ? 'bg-amber-600 text-white border-amber-500 shadow-md shadow-amber-600/30'
                          : sev === 'MINOR'
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-600/30'
                          : 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {blockerSeverity !== 'NONE' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  Blocker Details & Action Needed
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe technical hurdle, missing API access, dependency lock, or architectural blocker..."
                  value={blockerDetails}
                  onChange={(e) => setBlockerDetails(e.target.value)}
                  className="w-full bg-slate-900 border border-amber-500/30 rounded-xl p-3 text-sm text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* Interactive Drag & Drop File Upload Area */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                <span>EOD File Attachment / Debug Logs / Screenshots</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Drag & Drop or Browse</span>
            </label>

            {/* Hidden native file input */}
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
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  isDragging
                    ? 'border-indigo-400 bg-indigo-950/50 ring-4 ring-indigo-500/20 scale-[1.01]'
                    : 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/60 hover:bg-slate-950'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-2.5 pointer-events-none">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                      isDragging ? 'bg-indigo-600 text-white scale-110' : 'bg-indigo-500/10 text-indigo-400'
                    }`}
                  >
                    <UploadCloud className="w-6 h-6 animate-pulse" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-200">
                      {isDragging ? 'Drop file to upload instantly' : 'Drag & drop file here, or '}
                      {!isDragging && (
                        <span className="text-indigo-400 hover:underline">browse from device</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Supports debug logs, code files, screenshots, PDFs, and archives (Up to 50 MB)
                    </p>
                  </div>
                </div>

                {/* Quick 1-Click Sample File Chips */}
                <div
                  className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[10px] font-bold uppercase text-slate-500">Quick Demo Attachments:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFile({ name: 'webrtc_network_trace.log', size: '184 KB', type: 'log' })
                    }
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 flex items-center space-x-1 transition-all"
                  >
                    <span>📄 webrtc_network_trace.log</span>
                    <span className="text-[9px] text-slate-400">(184 KB)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFile({ name: 'api_proxy_blocker.png', size: '720 KB', type: 'image' })
                    }
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 flex items-center space-x-1 transition-all"
                  >
                    <span>🖼️ api_proxy_blocker.png</span>
                    <span className="text-[9px] text-slate-400">(720 KB)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFile({ name: 'database_migration_diff.sql', size: '42 KB', type: 'code' })
                    }
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 flex items-center space-x-1 transition-all"
                  >
                    <span>⚡ database_migration_diff.sql</span>
                    <span className="text-[9px] text-slate-400">(42 KB)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Attached File Preview Card */
              <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/40 flex items-center justify-between shadow-lg animate-in fade-in zoom-in-95">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    {getFileIcon(attachedFile.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white truncate block">{attachedFile.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0">
                        {attachedFile.size}
                      </span>
                    </div>
                    <span className="text-xs text-emerald-400 font-medium flex items-center space-x-1 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready to attach with this EOD report</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
                  >
                    Change File
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-all"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isSubmitting ? 'Submitting & Recalculating Deadline...' : 'Submit EOD Report'}</span>
          </button>
        </form>
      ) : (
        /* Team History View */
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            <span>Submitted EOD Reports Queue</span>
            <span>{currentRole !== 'EMPLOYEE' ? 'Manager Review Access Granted' : 'Read-Only Feed'}</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 text-sm">
                      {report.userName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-slate-200">{report.userName}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-semibold">
                          {report.userRole}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{report.projectName} • {report.submittedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getSeverityBadge(report.blockerSeverity)}
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
                      {report.hoursLogged} hrs
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
                  {report.tasksCompleted}
                </p>

                {report.blockerDetails && (
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg text-xs text-amber-300 space-y-1">
                    <span className="font-bold flex items-center space-x-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                      <span>Blocker Detail:</span>
                    </span>
                    <p>{report.blockerDetails}</p>
                  </div>
                )}

                {report.fileAttachment && (
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <Paperclip className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-bold text-slate-200">{report.fileAttachment}</span>
                      {report.fileSize && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-800 text-slate-400">
                          {report.fileSize}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Attached</span>
                    </span>
                  </div>
                )}

                {/* Manager / TL Approval Action */}
                {(currentRole === 'TEAM_LEAD' || currentRole === 'MANAGER') && (
                  <div className="pt-2 flex justify-end">
                    {report.isApproved ? (
                      <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Approved by Manager</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveReport && onApproveReport(report.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
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
