'use client';

import React, { useState } from 'react';
import { User, UserRole, TrendingDepartment } from '@/types';
import { Shield, UserPlus, LogIn, Key, Mail, User as UserIcon, Building2, CheckCircle2, Zap, Crown, Lock, Briefcase, Cpu, Check } from 'lucide-react';

interface AuthModalProps {
  onLogin: (email: string, role: UserRole) => void;
  onRegister: (newUser: { name: string; email: string; role: UserRole; department: string; jobTitle?: string; adminToken?: string }) => void;
  onClose: () => void;
  initialMode?: 'signin' | 'signup' | 'admin';
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

export const AuthModal: React.FC<AuthModalProps> = ({
  onLogin,
  onRegister,
  onClose,
  initialMode = 'admin',
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'admin'>(initialMode);

  // Sign In State
  const [loginEmail, setLoginEmail] = useState<string>('marcus.vance@company.internal');
  const [loginPassword, setLoginPassword] = useState<string>('lead123');

  // Employee Sign Up State
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('employee123');
  const [regRole, setRegRole] = useState<UserRole>('EMPLOYEE');
  const [regDepartment, setRegDepartment] = useState<string>(TRENDING_DEPARTMENTS[0]);
  const [regJobTitle, setRegJobTitle] = useState<string>('Principal AI/ML Research Scientist');

  // Admin Sign Up State (TL & Manager)
  const [adminName, setAdminName] = useState<string>('');
  const [adminEmail, setAdminEmail] = useState<string>('');
  const [adminRole, setAdminRole] = useState<UserRole>('TEAM_LEAD');
  const [adminPasscode, setAdminPasscode] = useState<string>('ADMIN2026');
  const [adminDepartment, setAdminDepartment] = useState<string>('Engineering Leadership & Ops');
  const [adminJobTitle, setAdminJobTitle] = useState<string>('Director of AI Systems & Infrastructure');

  const [successMsg, setSuccessMsg] = useState<string>('');

  // 1-Click Pre-fill Sample Admin Data for Team Lead
  const handlePrefillTeamLeadDemo = () => {
    setAdminName('Rachel Amber');
    setAdminEmail('rachel.amber@company.internal');
    setAdminRole('TEAM_LEAD');
    setAdminDepartment('Artificial Intelligence & ML');
    setAdminJobTitle('Principal AI Systems Lead');
    setAdminPasscode('ADMIN2026');
  };

  // 1-Click Pre-fill Sample Admin Data for Manager
  const handlePrefillManagerDemo = () => {
    setAdminName('Director Christian Vance');
    setAdminEmail('christian.vance@company.internal');
    setAdminRole('MANAGER');
    setAdminDepartment('Engineering Leadership & Ops');
    setAdminJobTitle('VP of Software Architecture & Operations');
    setAdminPasscode('ADMIN2026');
  };

  // 1-Click Pre-fill Employee Demo Data
  const handlePrefillEmployeeDemo = () => {
    setRegName('Jordan Hayes');
    setRegEmail('jordan.hayes@company.internal');
    setRegDepartment('Cloud Infrastructure & SRE');
    setRegJobTitle('Senior Site Reliability Engineer (SRE)');
    setRegPassword('employee123');
  };

  const handleQuickSelectCredential = (email: string, role: UserRole, pwd: string) => {
    setLoginEmail(email);
    setLoginPassword(pwd);
    onLogin(email, role);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let role: UserRole = 'EMPLOYEE';
    if (loginEmail.includes('marcus') || loginEmail.includes('lead') || loginEmail.includes('rachel')) role = 'TEAM_LEAD';
    if (loginEmail.includes('elena') || loginEmail.includes('manager') || loginEmail.includes('christian')) role = 'MANAGER';

    onLogin(loginEmail, role);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    onRegister({
      name: regName,
      email: regEmail,
      role: regRole,
      department: regDepartment,
      jobTitle: regJobTitle,
    });

    setSuccessMsg(`Account created for ${regName} (${regJobTitle})! Logging in...`);
    setTimeout(() => {
      onLogin(regEmail, regRole);
      onClose();
    }, 1200);
  };

  const handleAdminRegisterSubmit = (e: React.FormEvent) => {
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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-amber-500 via-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-100 text-base">ApexTracker Executive Admin Gateway</h3>
              <p className="text-xs text-slate-400">User-friendly registration portal for Team Leads and Managers</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 font-bold text-sm">
            ✕
          </button>
        </div>

        {/* 3-Way Tab Switcher */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-extrabold">
          <button
            onClick={() => setAuthMode('admin')}
            className={`w-1/3 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              authMode === 'admin'
                ? 'bg-linear-to-r from-amber-600 to-purple-600 text-white shadow-md'
                : 'text-amber-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>👑 Admin Sign Up</span>
          </button>

          <button
            onClick={() => setAuthMode('signup')}
            className={`w-1/3 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              authMode === 'signup'
                ? 'bg-linear-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Employee Register</span>
          </button>

          <button
            onClick={() => setAuthMode('signin')}
            className={`w-1/3 py-2 rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              authMode === 'signin'
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

        {/* MODE 1: ADMIN SIGN UP (TEAM LEADER & MANAGER) */}
        {authMode === 'admin' && (
          <form onSubmit={handleAdminRegisterSubmit} className="space-y-4">
            {/* Quick 1-Click Pre-fill Demo Buttons */}
            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>1-Click Fill Sample Admin Data</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">Fast Test</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={handlePrefillTeamLeadDemo}
                  className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 font-bold transition-all text-left truncate"
                >
                  ⚡ Fill Team Lead (Rachel)
                </button>
                <button
                  type="button"
                  onClick={handlePrefillManagerDemo}
                  className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-500/30 font-bold transition-all text-left truncate"
                >
                  ⚡ Fill Manager (Christian)
                </button>
              </div>
            </div>

            {/* Admin Capabilities Breakdown */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
              <span className="font-bold text-amber-400 block uppercase tracking-wider">Admin Rights Granted upon Registration:</span>
              <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400">
                <span className="flex items-center space-x-1 text-emerald-400">
                  <Check className="w-3 h-3" /> <span>Deadline Overrides</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <Check className="w-3 h-3" /> <span>War Room Alerts</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <Check className="w-3 h-3" /> <span>PostgreSQL DB Vault</span>
                </span>
                <span className="flex items-center space-x-1 text-emerald-400">
                  <Check className="w-3 h-3" /> <span>EOD Log Approvals</span>
                </span>
              </div>
            </div>

            {/* Form Fields */}
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

            {/* Department & Job Title */}
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
                  placeholder="e.g. Director of Engineering"
                  className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            {/* Admin Management Role Selection */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-1 flex items-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Select Admin Authority Level *</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAdminRole('TEAM_LEAD')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    adminRole === 'TEAM_LEAD'
                      ? 'bg-linear-to-r from-amber-600 to-indigo-600 text-white border-amber-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  🛡️ Team Lead (TL)
                </button>
                <button
                  type="button"
                  onClick={() => setAdminRole('MANAGER')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    adminRole === 'MANAGER'
                      ? 'bg-linear-to-r from-purple-600 to-amber-600 text-white border-purple-400 shadow-md'
                      : 'bg-slate-950 text-slate-400 border-slate-800'
                  }`}
                >
                  👑 Engineering Manager
                </button>
              </div>
            </div>

            {/* Passcode Security Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin Security Passcode *</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAdminPasscode('ADMIN2026')}
                  className="text-[10px] text-amber-400 hover:underline font-mono"
                >
                  Reset to ADMIN2026
                </button>
              </div>
              <input
                type="text"
                required
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs font-mono text-amber-300 outline-none"
              />
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

        {/* MODE 2: EMPLOYEE SIGN UP */}
        {authMode === 'signup' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                <span>Job Designation Specialization</span>
              </label>
              <input
                type="text"
                value={regJobTitle}
                onChange={(e) => setRegJobTitle(e.target.value)}
                placeholder="e.g. LLM RAG Specialist / SRE Engineer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
              />
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

        {/* MODE 3: SIGN IN */}
        {authMode === 'signin' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                Quick Test Credentials (Employee / TL / Manager):
              </span>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono max-h-48 overflow-y-auto pr-1">
                <button
                  onClick={() => handleQuickSelectCredential('marcus.vance@company.internal', 'TEAM_LEAD', 'lead123')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 hover:border-amber-500 text-left transition-all flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-amber-300">Marcus Vance (Team Lead)</p>
                    <p className="text-[10px] text-slate-400">Full-Stack & Frontend Platform</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Sign In</span>
                </button>

                <button
                  onClick={() => handleQuickSelectCredential('elena.rostova@company.internal', 'MANAGER', 'manager123')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-purple-500/30 hover:border-purple-500 text-left transition-all flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-purple-300">Elena Rostova (Manager)</p>
                    <p className="text-[10px] text-slate-400">Engineering Leadership & Ops</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">Sign In</span>
                </button>

                <button
                  onClick={() => handleQuickSelectCredential('maya.lin@company.internal', 'EMPLOYEE', 'employee123')}
                  className="p-2.5 rounded-xl bg-slate-950 border border-indigo-500/40 hover:border-indigo-400 text-left transition-all flex justify-between items-center"
                >
                  <div>
                    <p className="font-bold text-indigo-300">Dr. Maya Lin (AI/ML Scientist)</p>
                    <p className="text-[10px] text-slate-400">Artificial Intelligence & ML</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">Sign In</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg transition-all"
              >
                Sign In
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
