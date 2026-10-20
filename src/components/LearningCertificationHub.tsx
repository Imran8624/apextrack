'use client';

import React, { useState } from 'react';
import { UserRole, User, Course, CourseEnrollment, Certificate, Task } from '@/types';
import {
  GraduationCap,
  Award,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Search,
  PlusCircle,
  FileCheck2,
  Sparkles,
  BookOpen,
  ArrowRight,
  Shield,
  HelpCircle,
  RefreshCw,
  Send,
  Building2,
  Download,
  Share2,
  QrCode,
  Flame,
  Check,
  X,
  UserCheck,
  AlertTriangle,
  Lock,
  ChevronRight
} from 'lucide-react';

interface LearningCertificationHubProps {
  currentRole: UserRole;
  currentUser: User;
  users: User[];
  courses: Course[];
  enrollments: CourseEnrollment[];
  certificates: Certificate[];
  tasks: Task[];
  onTakeAssessment: (courseId: string) => void;
  onPassCourse: (courseId: string, score: number) => void;
  onFailCourse: (courseId: string, score: number) => void;
  onAssignCourse: (userId: string, courseId: string, dueDateDays: number) => void;
  onSendReminder: (enrollmentId: string) => void;
}

export const LearningCertificationHub: React.FC<LearningCertificationHubProps> = ({
  currentRole,
  currentUser,
  users,
  courses,
  enrollments,
  certificates,
  tasks,
  onTakeAssessment,
  onPassCourse,
  onFailCourse,
  onAssignCourse,
  onSendReminder,
}) => {
  // Elevated access check for TL, Manager, HR
  const isElevated = currentRole === 'TEAM_LEAD' || currentRole === 'MANAGER' || currentRole === 'HR';

  // Navigation tab inside the Hub
  const [activeTab, setActiveTab] = useState<'my-courses' | 'compliance' | 'ledger' | 'prerequisites'>('my-courses');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Active Assessment Quiz State
  const [activeQuizCourse, setActiveQuizCourse] = useState<Course | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  // Active Certificate View Modal
  const [viewingCertificate, setViewingCertificate] = useState<Certificate | null>(null);

  // Verification Code Search tool
  const [verifyCodeInput, setVerifyCodeInput] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<Certificate | null | 'NOT_FOUND'>(null);

  // Assign Course Modal State
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [assignTargetUserId, setAssignTargetUserId] = useState<string>('');
  const [assignCourseId, setAssignCourseId] = useState<string>('');
  const [assignDueDays, setAssignDueDays] = useState<number>(7);

  // Start Assessment
  const handleStartQuiz = (course: Course) => {
    setActiveQuizCourse(course);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizPassed(false);
  };

  // Submit Quiz
  const handleSubmitQuiz = () => {
    if (!activeQuizCourse) return;

    let correctCount = 0;
    activeQuizCourse.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / activeQuizCourse.questions.length) * 100);
    const passed = scorePercentage >= activeQuizCourse.passScorePercentage;

    setQuizScore(scorePercentage);
    setQuizPassed(passed);
    setQuizSubmitted(true);

    if (passed) {
      onPassCourse(activeQuizCourse.id, scorePercentage);
    } else {
      onFailCourse(activeQuizCourse.id, scorePercentage);
    }
  };

  // Handle Verify Code
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    const found = certificates.find(
      (c) => c.verificationCode.trim().toUpperCase() === verifyCodeInput.trim().toUpperCase()
    );
    setVerificationResult(found || 'NOT_FOUND');
  };

  // Compliance Stats Calculation
  const totalEnrollments = enrollments.length;
  const passedEnrollments = enrollments.filter((e) => e.status === 'PASSED').length;
  const failedEnrollments = enrollments.filter((e) => e.status === 'FAILED').length;
  const inProgressEnrollments = enrollments.filter((e) => e.status === 'IN_PROGRESS' || e.status === 'NOT_STARTED').length;
  const complianceRate = totalEnrollments > 0 ? Math.round((passedEnrollments / totalEnrollments) * 100) : 100;

  // Filtered Enrollments for Current User (Employee View)
  const myEnrollments = enrollments.filter((e) => e.userId === currentUser.id);

  // Filtered Enrollments for Compliance Ledger (elevated view)
  const filteredAllEnrollments = enrollments.filter((e) => {
    const matchesSearch =
      e.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.userDepartment && e.userDepartment.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <span>Learning & Certification Engine (LCE)</span>
                </span>
                {isElevated && (
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-mono bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
                    <Shield className="w-3.5 h-3.5 text-amber-600" />
                    <span>Elevated Access: {currentRole}</span>
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Enterprise Technical Training, Assessments & Verifiable Credentials
              </h2>
            </div>

            {/* Hub Tab Switcher */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveTab('my-courses')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'my-courses'
                    ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>My Courses ({myEnrollments.length})</span>
              </button>

              {isElevated && (
                <>
                  <button
                    onClick={() => setActiveTab('compliance')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                      activeTab === 'compliance'
                        ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>HR Compliance & Delays</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('ledger')}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                      activeTab === 'ledger'
                        ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Certificate Ledger ({certificates.length})</span>
                  </button>
                </>
              )}

              <button
                onClick={() => setActiveTab('prerequisites')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  activeTab === 'prerequisites'
                    ? 'bg-white text-indigo-700 border border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Task Prerequisites</span>
              </button>
            </div>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-4xl">
            ApexTracker seamlessly links engineering certifications directly to project task assignments and dynamic deadline calculations. Team members certify their technical expertise through real assessments, generating verifiable certificates while protecting project velocity against uncertified skill gaps.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Available Courses</span>
              <span className="text-lg font-bold text-slate-900">{courses.length} Standardized</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Organization Compliance</span>
              <span className="text-lg font-bold text-emerald-700">{complianceRate}% Cleared</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">Verifiable Certificates</span>
              <span className="text-lg font-bold text-indigo-700">{certificates.length} Issued</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Stalled / Retake Needed</span>
              <span className="text-lg font-bold text-rose-700">{failedEnrollments} Action Required</span>
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: MY COURSES & CERTIFICATIONS (EMPLOYEE & ALL USERS) */}
      {activeTab === 'my-courses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>My Assigned Courses & Assessment Portal</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Complete assessments with $\ge 80\%$ score to unlock official digital credentials and task eligibility.
              </p>
            </div>

            {isElevated && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center space-x-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Assign Course to Team Member</span>
              </button>
            )}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const enrollment = enrollments.find(
                (e) => e.courseId === course.id && e.userId === currentUser.id
              );
              const userCert = certificates.find(
                (c) => c.courseId === course.id && c.userId === currentUser.id
              );
              const status = enrollment ? enrollment.status : 'NOT_STARTED';

              return (
                <div
                  key={course.id}
                  className={`bg-slate-900 rounded-3xl p-6 border transition-all duration-200 flex flex-col justify-between space-y-5 shadow-xl relative overflow-hidden ${
                    status === 'PASSED'
                      ? 'border-emerald-500/40 shadow-emerald-950/20'
                      : status === 'FAILED'
                      ? 'border-rose-500/40 shadow-rose-950/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md font-bold bg-slate-950 text-indigo-400 border border-indigo-500/30">
                        {course.code}
                      </span>

                      {status === 'PASSED' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Passed ({enrollment?.score}%)</span>
                        </span>
                      ) : status === 'FAILED' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1">
                          <AlertOctagon className="w-3 h-3" />
                          <span>Failed ({enrollment?.score}%)</span>
                        </span>
                      ) : status === 'IN_PROGRESS' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>In Progress</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400">
                          Not Started
                        </span>
                      )}
                    </div>

                    <h4 className="font-extrabold text-white text-base leading-snug">
                      {course.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.skillsAcquired.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 border border-slate-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Prerequisite Association */}
                    {course.prerequisiteForTaskType && (
                      <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 text-[11px] text-amber-300 flex items-center space-x-2">
                        <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Prerequisite for: <strong>{course.prerequisiteForTaskType}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      Pass Threshold: {course.passScorePercentage}%
                    </span>

                    {status === 'PASSED' && userCert ? (
                      <button
                        onClick={() => setViewingCertificate(userCert)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold text-xs border border-emerald-500/40 transition-all flex items-center space-x-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>View Certificate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartQuiz(course)}
                        className="px-4 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center space-x-1.5"
                      >
                        <span>{status === 'FAILED' ? 'Retake Exam' : 'Take Assessment'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* User Certificate Vault Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4">
            <h4 className="text-base font-extrabold text-white flex items-center space-x-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span>Personal Verifiable Credentials Vault ({certificates.filter(c => c.userId === currentUser.id).length})</span>
            </h4>

            {certificates.filter((c) => c.userId === currentUser.id).length === 0 ? (
              <p className="text-xs text-slate-400">
                You haven&apos;t earned any certificates yet. Clear any assessment with a passing score to generate your first credential.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certificates
                  .filter((c) => c.userId === currentUser.id)
                  .map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => setViewingCertificate(cert)}
                      className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-white">{cert.courseTitle}</p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Code: {cert.verificationCode} • Issued {cert.issuedAt}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-indigo-400" />
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: HR COMPLIANCE & FAILURE/DELAY MONITORING (TL, MANAGER, HR) */}
      {activeTab === 'compliance' && isElevated && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <span>HR Compliance, Failure & Overdue Monitoring Panel</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full cross-departmental view of course completion rates, active enrollments, and failure remediation.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="PASSED">Passed Only</option>
                <option value="FAILED">Failed / Delays Only</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="NOT_STARTED">Not Started</option>
              </select>

              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-md"
              >
                + Assign Course
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
            <input
              type="text"
              placeholder="Search by employee name, course title, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-200 outline-none"
            />
          </div>

          {/* Compliance Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Employee</th>
                    <th className="py-3 px-4">Course & Code</th>
                    <th className="py-3 px-4">Status & Score</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Assigned By</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredAllEnrollments.map((enrollment) => {
                    const isFailed = enrollment.status === 'FAILED';
                    const isPassed = enrollment.status === 'PASSED';

                    return (
                      <tr key={enrollment.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-extrabold text-white block">{enrollment.userName}</span>
                            <span className="text-[10px] text-slate-400">{enrollment.userDepartment}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div>
                            <span className="font-bold text-slate-200 block">{enrollment.courseTitle}</span>
                            <span className="text-[10px] font-mono text-indigo-400">{enrollment.courseCode}</span>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          {isPassed ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              Passed ({enrollment.score}%)
                            </span>
                          ) : isFailed ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                              Failed ({enrollment.score}%) - Remedial Needed
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              {enrollment.status}
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-slate-400 font-mono">
                          {enrollment.dueDate || 'No Due Date'}
                        </td>

                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {enrollment.assignedByName || 'System Automated'}
                        </td>

                        <td className="py-3 px-4 text-right">
                          {isFailed ? (
                            <button
                              onClick={() => onSendReminder(enrollment.id)}
                              className="px-3 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[11px] border border-rose-500/40 transition-all flex items-center space-x-1 ml-auto"
                            >
                              <Send className="w-3 h-3" />
                              <span>Remind / Escalate</span>
                            </button>
                          ) : isPassed && enrollment.certificateId ? (
                            <button
                              onClick={() => {
                                const cert = certificates.find((c) => c.id === enrollment.certificateId);
                                if (cert) setViewingCertificate(cert);
                              }}
                              className="px-3 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-[11px] border border-indigo-500/40 transition-all flex items-center space-x-1 ml-auto"
                            >
                              <Award className="w-3 h-3" />
                              <span>Verify Cert</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onSendReminder(enrollment.id)}
                              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] transition-all ml-auto"
                            >
                              Send Reminder
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATE LEDGER & VERIFICATION DIRECTORY (TL, MANAGER, HR) */}
      {activeTab === 'ledger' && isElevated && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-indigo-400" />
                <span>Enterprise Certificate Ledger & Validation Vault</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Cryptographically unique credential validator and central audit register.
              </p>
            </div>
          </div>

          {/* Certificate Verification Code Form */}
          <form
            onSubmit={handleVerifyCode}
            className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center gap-3"
          >
            <div className="relative flex-1 w-full">
              <QrCode className="w-4 h-4 absolute left-3.5 top-3 text-indigo-400" />
              <input
                type="text"
                required
                placeholder="Enter Verification Code (e.g. CERT-APEX-88412)..."
                value={verifyCodeInput}
                onChange={(e) => setVerifyCodeInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Verify Authenticity</span>
            </button>
          </form>

          {/* Verification Result Banner */}
          {verificationResult && verificationResult !== 'NOT_FOUND' && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-extrabold text-white block">
                    Valid Certificate Verified: {verificationResult.verificationCode}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    Issued to {verificationResult.userName} for &quot;{verificationResult.courseTitle}&quot; (Score: {verificationResult.score}%) on {verificationResult.issuedAt}.
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingCertificate(verificationResult)}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-black text-xs shrink-0"
              >
                Inspect Official PDF
              </button>
            </div>
          )}

          {verificationResult === 'NOT_FOUND' && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2 animate-fadeIn">
              <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
              <span>No certificate found matching &quot;{verifyCodeInput}&quot;. Please verify the verification code.</span>
            </div>
          )}

          {/* Certificates Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setViewingCertificate(cert)}
                className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-5 shadow-xl cursor-pointer transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {cert.verificationCode}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Issued {cert.issuedAt}</span>
                </div>

                <div>
                  <h4 className="font-extrabold text-white text-sm group-hover:text-indigo-300 transition-colors">
                    {cert.courseTitle}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">Recipient: <strong className="text-white">{cert.userName}</strong></p>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-black">Score: {cert.score}%</span>
                  <span className="text-indigo-400 font-bold flex items-center space-x-1">
                    <span>View Certificate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TASK PREREQUISITES & ELIGIBILITY ENFORCEMENT */}
      {activeTab === 'prerequisites' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-white flex items-center space-x-2">
                <Lock className="w-5 h-5 text-indigo-400" />
                <span>Task Prerequisites & Skill Guardrails</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ApexTracker locks high-risk project tasks to certified team members to protect velocity and code reliability.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task) => {
              const hasReq = !!task.requiredCourseId;
              const assigneeCert = task.assigneeId
                ? certificates.find(
                    (c) => c.userId === task.assigneeId && c.courseId === task.requiredCourseId
                  )
                : null;
              const isEligible = !hasReq || !!assigneeCert;

              return (
                <div
                  key={task.id}
                  className={`bg-slate-900 rounded-3xl p-6 border space-y-4 shadow-xl ${
                    hasReq && !isEligible
                      ? 'border-amber-500/50 shadow-amber-950/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">
                        Task [{task.id}]
                      </span>
                      <h4 className="font-extrabold text-white text-base mt-0.5">{task.title}</h4>
                    </div>

                    {hasReq ? (
                      isEligible ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Prereq Cleared</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1 shrink-0">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Certification Missing</span>
                        </span>
                      )
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] text-slate-400 bg-slate-950 border border-slate-800">
                        Open Assignment
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300">{task.description}</p>

                  <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Assignee:</span>
                      <strong className="text-white">{task.assigneeName || 'Unassigned'}</strong>
                    </div>

                    {hasReq && (
                      <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                        <span className="text-amber-400 font-bold">Mandatory Course:</span>
                        <span className="text-indigo-300 font-mono text-[11px]">{task.requiredCourseTitle}</span>
                      </div>
                    )}

                    {assigneeCert && (
                      <div className="flex justify-between items-center text-emerald-400 font-mono text-[11px]">
                        <span>Cert Verification:</span>
                        <span>{assigneeCert.verificationCode}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ASSESSMENT QUIZ MODAL */}
      {activeQuizCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">
                  Assessment Exam • {activeQuizCourse.code}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
                  {activeQuizCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuizCourse(null)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Quiz Body */}
            {!quizSubmitted ? (
              <div className="space-y-6">
                <p className="text-xs text-slate-400">
                  Answer the following questions carefully. You must achieve at least{' '}
                  <strong className="text-indigo-300">{activeQuizCourse.passScorePercentage}%</strong> to earn your certificate.
                </p>

                <div className="space-y-5">
                  {activeQuizCourse.questions.map((q, qIndex) => (
                    <div key={q.id} className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-white block">
                        {qIndex + 1}. {q.question}
                      </span>

                      <div className="space-y-2">
                        {q.options.map((option, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === optIdx;

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                              className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center space-x-3 ${
                                isSelected
                                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                                  isSelected ? 'border-indigo-400 bg-indigo-600 text-white' : 'border-slate-700'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setActiveQuizCourse(null)}
                    className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < activeQuizCourse.questions.length}
                    className="px-6 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Assessment for Grading</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Quiz Result Review */
              <div className="space-y-6 text-center py-4">
                <div
                  className={`w-16 h-16 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl ${
                    quizPassed ? 'bg-emerald-600 shadow-emerald-600/30' : 'bg-rose-600 shadow-rose-600/30'
                  }`}
                >
                  {quizPassed ? <Award className="w-8 h-8" /> : <AlertOctagon className="w-8 h-8" />}
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white">
                    {quizPassed ? '🎉 Assessment Cleared!' : 'Assessment Not Cleared'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Your Score: <strong className="text-lg text-white">{quizScore}%</strong> (Passing threshold was {activeQuizCourse.passScorePercentage}%)
                  </p>
                </div>

                {quizPassed ? (
                  <p className="text-xs text-emerald-300 max-w-md mx-auto">
                    Congratulations! Your digital certificate has been automatically generated, cryptographically stamped, and broadcast to the team lead and HR compliance ledger.
                  </p>
                ) : (
                  <p className="text-xs text-rose-300 max-w-md mx-auto">
                    You did not meet the minimum required threshold. Real-time alert has been logged, and remedial coaching notes are ready. You can retake the assessment anytime.
                  </p>
                )}

                <div className="flex items-center justify-center space-x-3 pt-4">
                  {!quizPassed ? (
                    <button
                      onClick={() => handleStartQuiz(activeQuizCourse)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                    >
                      Retake Exam Now
                    </button>
                  ) : null}

                  <button
                    onClick={() => setActiveQuizCourse(null)}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VERIFIABLE PDF CERTIFICATE DISPLAY MODAL */}
      {viewingCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <button
              onClick={() => setViewingCertificate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            {/* Certificate Template Card */}
            <div className="bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 border-4 border-amber-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                <span>APEX PROJECT INTELLIGENCE</span>
                <span>VERIFIED ID: {viewingCertificate.verificationCode}</span>
              </div>

              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-amber-500 to-amber-700 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-amber-500/30">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">
                  Certificate of Technical Competency
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {viewingCertificate.userName}
                </h3>
                <p className="text-xs text-slate-300">
                  has demonstrated exemplary proficiency and successfully cleared all rigorous engineering assessments for
                </p>
                <h4 className="text-base sm:text-lg font-black text-amber-300 pt-1">
                  {viewingCertificate.courseTitle}
                </h4>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Final Score</span>
                  <strong className="text-emerald-400 font-black text-sm">{viewingCertificate.score}%</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Date Issued</span>
                  <strong className="text-white text-xs">{viewingCertificate.issuedAt}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Authorized Lead</span>
                  <strong className="text-white text-xs">{viewingCertificate.signatoryName}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400 font-mono text-[11px]">
                Valid throughout enterprise tenancy • Audit-Ready
              </span>
              <button
                onClick={() => setViewingCertificate(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
              >
                Close Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN COURSE MODAL (ELEVATED TL, HR, MANAGER) */}
      {showAssignModal && isElevated && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="font-extrabold text-white text-base flex items-center space-x-2">
                <PlusCircle className="w-5 h-5 text-indigo-400" />
                <span>Assign Technical Course</span>
              </h4>
              <button
                onClick={() => setShowAssignModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Employee *</label>
                <select
                  value={assignTargetUserId}
                  onChange={(e) => setAssignTargetUserId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                >
                  <option value="">Select team member...</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role}) - {u.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Select Course *</label>
                <select
                  value={assignCourseId}
                  onChange={(e) => setAssignCourseId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                >
                  <option value="">Select course...</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      [{c.code}] {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Deadline Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={assignDueDays}
                  onChange={(e) => setAssignDueDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-950 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!assignTargetUserId || !assignCourseId}
                  onClick={() => {
                    onAssignCourse(assignTargetUserId, assignCourseId, assignDueDays);
                    setShowAssignModal(false);
                    setAssignTargetUserId('');
                    setAssignCourseId('');
                  }}
                  className="px-5 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white font-extrabold disabled:opacity-50"
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
