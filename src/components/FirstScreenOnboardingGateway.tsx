'use client';

import React, { useState } from 'react';
import { UserRole, TrendingDepartment } from '@/types';
import { Crown, UserPlus, HelpCircle, LogIn, Shield, Zap, CheckCircle2, Lock, PhoneCall, Database, Clock, Building2, Briefcase, Mail, User as UserIcon, X } from 'lucide-react';

interface FirstScreenOnboardingGatewayProps {
  currentRole: UserRole;
  currentUserName: string;
  onLogin: (email: string, role: UserRole) => void;
  onRegister: (newUser: { name: string; email: string; role: UserRole; department: string; jobTitle?: string; adminToken?: string }) => void;
  onClose: () => void;
}

const TRENDING_DEPARTMENTS: TrendingDepartment[] = [
  'Artificial Intelligence & ML',
  'Full-Stack & Frontend Platform',
  'Cloud Infrastructure & SRE',
  'Cybersecurity & Compliance',
  'Product Experience & Design',
  'Data Engineering & Analytics',
  'Engineering Leadership & Ops',
];

export const FirstScreenOnboardingGateway: React.FC<FirstScreenOnboardingGatewayProps> = ({
  currentRole,
  currentUserName,
  onLogin,
  onRegister,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'admin' | 'employee' | 'guide' | 'signin'>('admin');


  // Admin Registration State
  const [adminName, setAdminName] = useState<string>('');
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminRole, setAdminRole] = useState<UserRole>('TEAM_LEAD');
  const [adminPasscode, setAdminPasscode] = useState<string>('ADMIN2026');
  const [adminDepartment, setAdminDepartment] = useState<string>('Engineering Leadership & Ops');
  const [adminJobTitle, setAdminJobTitle] = useState<string>('Director of AI Systems & Infrastructure');

  // Employee Registration State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regDepartment, setRegDepartment] = useState<string>(TRENDING_DEPARTMENTS[0]);
  const [regJobTitle, setRegJobTitle] = useState<string>('Principal AI/ML Research Scientist');

  // Sign In State
  const [loginEmail, setLoginEmail] = useState<string>('marcus.vance@company.internal');

  const [successMsg, setSuccessMsg] = useState<string>('');

  const handlePrefillTeamLeadDemo = () => {
    setAdminName('Rachel Amber');
    setAdminEmail('rachel.amber@company.internal');
    setAdminRole('TEAM_LEAD');
    setAdminDepartment('Artificial Intelligence & ML');
    setAdminJobTitle('Principal AI Systems Lead');
    setAdminPasscode('ADMIN2026');
  };

  const handlePrefillManagerDemo = () => {
    setAdminName('Director Christian Vance');
    setAdminEmail('christian.vance@company.internal');
    setAdminRole('MANAGER');
    setAdminDepartment('Engineering Leadership & Ops');
    setAdminJobTitle('VP of Software Architecture & Operations');
    setAdminPasscode('ADMIN2026');
  };

  const handlePrefillEmployeeDemo = () => {
    setRegName('Jordan Hayes');
    setRegEmail('jordan.hayes@company.internal');
    setRegDepartment('Cloud Infrastructure & SRE');
    setRegJobTitle('Senior Site Reliability Engineer (SRE)');
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminEmail.trim()) return;

    onRegister({
      name: adminName,
      email: adminEmail,
      role: adminRole,
      department: adminDepartment,
      jobTitle: adminJobTitle,
      adminToken: adminPasscode,
    });

    setSuccessMsg(`Executive ${adminRole} Account registered for ${adminName}! Full Admin Privileges Granted.`);
    setTimeout(() => {
      onLogin(adminEmail, adminRole);
      onClose();
    }, 1200);
  };

  const handleEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    onRegister({
      name: regName,
      email: regEmail,
      role: 'EMPLOYEE',
      department: regDepartment,
      jobTitle: regJobTitle,
    });

    setSuccessMsg(`Employee Account created for ${regName} (${regJobTitle})!`);
    setTimeout(() => {
      onLogin(regEmail, 'EMPLOYEE');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-linear-to-tr from-amber-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-black text-slate-100 text-lg sm:text-xl">ApexTracker Welcome Gateway</h2>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  1st Screen Onboarding
                </span>
              </div>
              <p className="text-xs text-slate-400">Admin Sign Up, Employee Registration & Feature Guide Portal</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all"
            title="Close Gateway & Enter Dashboard"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fast 1-Click Demo Profiles */}
        <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-400">
            <span>⚡ 1-Click Instant Demo Login (Zero Setup Required):</span>
            <span className="text-[10px] text-slate-500 font-mono">Select persona</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
            <button
              onClick={() => {
                onLogin('marcus.vance@company.internal', 'TEAM_LEAD');
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 border border-amber-500/30 hover:border-amber-400 text-amber-300 transition-all text-left"
            >
              🛡️ Marcus (TL)
              <span className="text-[10px] text-slate-400 block font-normal">Team Lead</span>
            </button>
            <button
              onClick={() => {
                onLogin('alex.rivers@company.internal', 'EMPLOYEE');
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 transition-all text-left"
            >
              👤 Alex (Dev)
              <span className="text-[10px] text-slate-400 block font-normal">Engineer</span>
            </button>
            <button
              onClick={() => {
                onLogin('claire.hr@company.internal', 'HR');
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 border border-pink-500/30 hover:border-pink-400 text-pink-300 transition-all text-left"
            >
              🎓 Claire (HR)
              <span className="text-[10px] text-slate-400 block font-normal">Compliance</span>
            </button>
            <button
              onClick={() => {
                onLogin('elena.rostova@company.internal', 'MANAGER');
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-900 border border-purple-500/30 hover:border-purple-400 text-purple-300 transition-all text-left"
            >
              👑 Elena (VP)
              <span className="text-[10px] text-slate-400 block font-normal">Manager</span>
            </button>
          </div>
        </div>

        {/* 4-Way Tab Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-extrabold gap-1">
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'admin'
                ? 'bg-linear-to-r from-amber-600 to-purple-600 text-white shadow-md'
                : 'text-amber-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>👑 Admin</span>
          </button>

          <button
            onClick={() => setActiveTab('employee')}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'employee'
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>👤 Register</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'guide'
                ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                : 'text-emerald-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>💡 Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('signin')}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'signin'
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: ADMIN SIGN UP */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                  <Zap className="w-4 h-4" />
                  <span>1-Click Fill Sample Admin Data</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Fast Test</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={handlePrefillTeamLeadDemo}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold transition-all text-left truncate"
                >
                  ⚡ Fill Team Lead (Rachel)
                </button>
                <button
                  type="button"
                  onClick={handlePrefillManagerDemo}
                  className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-bold transition-all text-left truncate"
                >
                  ⚡ Fill Manager (Christian)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <UserIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rachel Amber"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Corporate Email *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rachel.amber@company.internal"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Department *</span>
                </label>
                <select
                  value={adminDepartment}
                  onChange={(e) => setAdminDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-slate-200 outline-none cursor-pointer"
                >
                  {TRENDING_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>Job Designation Title</span>
                </label>
                <input
                  type="text"
                  value={adminJobTitle}
                  onChange={(e) => setAdminJobTitle(e.target.value)}
                  placeholder="e.g. Director of AI Systems"
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Management Role *</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdminRole('TEAM_LEAD')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      adminRole === 'TEAM_LEAD'
                        ? 'bg-linear-to-r from-amber-600 to-indigo-600 text-white border-amber-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    🛡️ Team Lead
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdminRole('MANAGER')}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition-all ${
                      adminRole === 'MANAGER'
                        ? 'bg-linear-to-r from-purple-600 to-amber-600 text-white border-purple-400 shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    👑 Manager
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Passcode *</span>
                </label>
                <input
                  type="text"
                  required
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-300 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-amber-600 via-purple-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-amber-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <Crown className="w-4 h-4" />
              <span>Complete Admin Registration ({adminRole === 'TEAM_LEAD' ? 'Team Lead' : 'Manager'})</span>
            </button>
          </form>
        )}

        {/* TAB 2: EMPLOYEE SIGN UP */}
        {activeTab === 'employee' && (
          <form onSubmit={handleEmployeeSubmit} className="space-y-4">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handlePrefillEmployeeDemo}
                className="px-3 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 flex items-center space-x-1 transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>⚡ 1-Click Fill Sample Employee Data</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <UserIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Email Address *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jordan.hayes@company.internal"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Department *</span>
                </label>
                <select
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none cursor-pointer"
                >
                  {TRENDING_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept} className="bg-slate-900 text-slate-200">
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Job Designation Title</span>
                </label>
                <input
                  type="text"
                  value={regJobTitle}
                  onChange={(e) => setRegJobTitle(e.target.value)}
                  placeholder="e.g. Senior WebRTC Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Employee Account</span>
            </button>
          </form>
        )}

        {/* TAB 3: USER GUIDE & FEATURE HELP */}
        {activeTab === 'guide' && (
          <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-indigo-400 flex items-center space-x-2 text-sm">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>1. Dynamic Deadline Calculation Engine</span>
              </h4>
              <p className="text-slate-400 text-xs">
                Log daily EOD work hours and tasks. The mathematical engine automatically recalculates project completion finish dates based on team velocity!
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-amber-400 flex items-center space-x-2 text-sm">
                <PhoneCall className="w-4 h-4 text-amber-400" />
                <span>2. Pinned Contacts & 1-on-1 Video Calling</span>
              </h4>
              <p className="text-slate-400 text-xs">
                Pin team members to keep them at the top of your sidebar. Click &quot;Call Only [Name]&quot; to start a direct 1-on-1 WebRTC video/audio stream!
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
              <h4 className="font-bold text-purple-400 flex items-center space-x-2 text-sm">
                <Database className="w-4 h-4 text-purple-400" />
                <span>3. PostgreSQL Communication Database Vault</span>
              </h4>
              <p className="text-slate-400 text-xs">
                Team Leads and Managers can toggle the 🗄️ Database Vault button in the Chat Suite to inspect raw PostgreSQL message tables and channel records.
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg transition-all"
            >
              Start Exploring ApexTracker Platform →
            </button>
          </div>
        )}

        {/* TAB 4: SIGN IN */}
        {activeTab === 'signin' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Quick Test Credentials (Pre-seeded Accounts):
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    onLogin('marcus.vance@company.internal', 'TEAM_LEAD');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 hover:border-amber-500 text-left transition-all flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-amber-300">Marcus Vance (Team Lead)</p>
                    <p className="text-[10px] text-slate-400">Full-Stack & Frontend Platform</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Sign In</span>
                </button>

                <button
                  onClick={() => {
                    onLogin('elena.rostova@company.internal', 'MANAGER');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 hover:border-purple-500 text-left transition-all flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-purple-300">Elena Rostova (Manager)</p>
                    <p className="text-[10px] text-slate-400">Engineering Leadership & Ops</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Sign In</span>
                </button>

                <button
                  onClick={() => {
                    onLogin('alex.rivers@company.internal', 'EMPLOYEE');
                    onClose();
                  }}
                  className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 hover:border-indigo-400 text-left transition-all flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-indigo-300">Alex Rivers (Employee)</p>
                    <p className="text-[10px] text-slate-400">Full-Stack & Frontend Platform</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">Sign In</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
