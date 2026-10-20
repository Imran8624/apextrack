'use client';

import React, { useState, useRef } from 'react';
import { DailyReport, Project, UserRole, BlockerSeverity } from '@/types';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Check,
  ShieldAlert,
  Zap,
  FileCode,
  Image,
  Trash2,
  Paperclip,
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
      return <Image className="w-5 h-5 text-pink-500" />;
    }
    if (['ts', 'tsx', 'js', 'jsx', 'py', 'json', 'sql', 'html', 'css'].includes(ext || '')) {
      return <FileCode className="w-5 h-5 text-indigo-500" />;
    }
    return <FileText className="w-5 h-5 text-amber-500" />;
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
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">Critical Blocker</span>;
      case 'MODERATE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Moderate Issue</span>;
      case 'MINOR':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Minor Delay</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">No Blockers</span>;
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4 w-full min-w-0 overflow-hidden">
      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Daily EOD Work Reporting Module</h2>
            <p className="text-[11px] text-slate-500">Log progress, hours, and blocker details for dynamic deadline recalculation</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold shadow-xs">
          <button
            onClick={() => setActiveTab('submit')}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              activeTab === 'submit' ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submit EOD Log
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded-md text-xs transition-colors ${
              activeTab === 'history' ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Team Reports ({reports.length})
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {activeTab === 'submit' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleFillDemoData}
              className="px-2.5 py-1 rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200 flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Zap className="w-3 h-3 text-indigo-600" />
              <span>Fill Sample Data</span>
            </button>
          </div>

          {/* Project & Task Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Active Project *
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  setSelectedProjectId(e.target.value);
                  setSelectedTaskId('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-white text-slate-800">
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
                Associated Task (Optional)
              </label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:bg-white cursor-pointer"
              >
                <option value="">-- General Project Work --</option>
                {selectedProject?.tasks.map((t) => (
                  <option key={t.id} value={t.id} className="bg-white text-slate-800">
                    [{t.status}] {t.title} ({t.estimatedHours}h est)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hours Logged */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                <span>Logged Work Hours Today *</span>
              </label>
              <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
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
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Work Completed */}
          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1">
              Tasks Completed & Progress Notes *
            </label>
            <textarea
              rows={3}
              required
              placeholder="Detail work performed today, PR links, resolved bugs, or test results..."
              value={tasksCompleted}
              onChange={(e) => setTasksCompleted(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none"
            />
          </div>

          {/* Blocker Severity & Details */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center space-x-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />
                <span>Blockers & Impediments Severity</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['NONE', 'MINOR', 'MODERATE', 'CRITICAL'] as BlockerSeverity[]).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setBlockerSeverity(sev)}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-colors ${
                      blockerSeverity === sev
                        ? sev === 'CRITICAL'
                          ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-xs'
                          : sev === 'MODERATE'
                          ? 'bg-amber-50 text-amber-700 border-amber-300 shadow-xs'
                          : sev === 'MINOR'
                          ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {blockerSeverity !== 'NONE' && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-800 mb-1">
                  Blocker Details & Action Needed
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe technical hurdle, missing API access, dependency lock, or architectural blocker..."
                  value={blockerDetails}
                  onChange={(e) => setBlockerDetails(e.target.value)}
                  className="w-full bg-white border border-amber-200 rounded-lg p-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-amber-400 outline-none"
                />
              </div>
            )}
          </div>

          {/* Interactive Drag & Drop File Upload Area */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <UploadCloud className="w-3.5 h-3.5 text-indigo-600" />
                <span>EOD File Attachment / Debug Logs</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Drag & Drop or Browse</span>
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
                className={`border border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-indigo-500 bg-indigo-50/50'
                    : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                  <UploadCloud className="w-5 h-5 text-indigo-600" />
                  <p className="text-xs font-semibold text-slate-800">
                    {isDragging ? 'Drop file to upload' : 'Drag & drop file here, or browse from device'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Supports debug logs, code files, screenshots, PDFs (Up to 50 MB)
                  </p>
                </div>

                {/* Quick 1-Click Sample File Chips */}
                <div
                  className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-center gap-1.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="text-[9px] font-semibold uppercase text-slate-500">Demo Attachments:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFile({ name: 'webrtc_network_trace.log', size: '184 KB', type: 'log' })
                    }
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1 shadow-xs"
                  >
                    <span>network_trace.log</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFile({ name: 'api_proxy_blocker.png', size: '720 KB', type: 'image' })
                    }
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1 shadow-xs"
                  >
                    <span>blocker_screenshot.png</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAttachedFile({ name: 'database_migration_diff.sql', size: '42 KB', type: 'code' })
                    }
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1 shadow-xs"
                  >
                    <span>migration_diff.sql</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Attached File Preview Card */
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                    {getFileIcon(attachedFile.name)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-slate-900 truncate block">{attachedFile.name}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-mono bg-white text-slate-600 border border-slate-200 shrink-0">
                        {attachedFile.size}
                      </span>
                    </div>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Ready to attach</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200 shadow-xs"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="p-1 rounded-md bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200"
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
            className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Submitting...' : 'Submit EOD Report'}</span>
          </button>
        </form>
      ) : (
        /* Team History View */
        <div className="space-y-3 w-full min-w-0">
          <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-1">
            <span>Submitted EOD Reports Queue</span>
            <span>{currentRole !== 'EMPLOYEE' ? 'Manager Review Granted' : 'Read-Only Feed'}</span>
          </div>

          <div className="space-y-2.5 max-h-125 overflow-y-auto pr-1 w-full min-w-0">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white border border-slate-200 rounded-lg p-3 space-y-2.5 transition-colors min-w-0 overflow-hidden shadow-xs"
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-md bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs shrink-0">
                      {report.userName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-semibold text-xs text-slate-900 truncate">{report.userName}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono font-medium">
                          {report.userRole}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate">{report.projectName} • {report.submittedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    {getSeverityBadge(report.blockerSeverity)}
                    <span className="text-[10px] font-mono font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {report.hoursLogged}h
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200 wrap-break-word">
                  {report.tasksCompleted}
                </p>

                {report.blockerDetails && (
                  <div className="bg-amber-50/80 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900 space-y-0.5 wrap-break-word">
                    <span className="font-semibold text-amber-800 text-[10px] flex items-center space-x-1 uppercase tracking-wider">
                      <ShieldAlert className="w-3 h-3 text-amber-600" />
                      <span>Blocker Detail:</span>
                    </span>
                    <p className="wrap-break-word text-xs">{report.blockerDetails}</p>
                  </div>
                )}

                {report.fileAttachment && (
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 flex items-center justify-between text-xs min-w-0">
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <Paperclip className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span className="font-medium text-slate-800 truncate text-[11px]">{report.fileAttachment}</span>
                      {report.fileSize && (
                        <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-white text-slate-500 border border-slate-200 shrink-0">
                          {report.fileSize}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
                      Attached
                    </span>
                  </div>
                )}

                {/* Manager / TL Approval Action */}
                {(currentRole === 'TEAM_LEAD' || currentRole === 'MANAGER') && (
                  <div className="pt-1 flex justify-end">
                    {report.isApproved ? (
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Approved by Manager</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onApproveReport && onApproveReport(report.id)}
                        className="px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-semibold transition-colors"
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
