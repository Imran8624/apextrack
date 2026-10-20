'use client';

import React, { useState } from 'react';
import { UserRole, Project, User } from '@/types';
import {
  Shield,
  AlertTriangle,
  Activity,
  Zap,
  FolderGit2,
  UserPlus,
  Crown,
  GitMerge,
  GraduationCap,
  MessageSquare,
  FileSpreadsheet,
  BarChart3,
  HelpCircle,
  Menu,
  X,
  ChevronDown,
  Building2
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  currentUser?: User;
  onRoleChange: (role: UserRole) => void;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onTriggerWarRoom?: () => void;
  isWarRoomActive?: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal: (mode?: 'signin' | 'signup' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  currentUser,
  onRoleChange,
  projects,
  activeProjectId,
  onSelectProject,
  onTriggerWarRoom,
  isWarRoomActive,
  activeTab,
  setActiveTab,
  onOpenAuthModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState<boolean>(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState<boolean>(false);

  const primaryNavItems = [
    { id: 'dashboard', label: 'Overview', icon: Activity },
    { id: 'crm', label: 'Client CRM', icon: Building2, badge: 'SLA' },
    { id: 'continuity', label: 'Shift Continuity', icon: GitMerge, badge: 'Zero-Loss' },
    { id: 'learning', label: 'Learning & Certs', icon: GraduationCap, badge: 'LCE' },
    { id: 'chat', label: 'Channels & DMs', icon: MessageSquare },
  ];

  const secondaryNavItems = [
    { id: 'reporting', label: 'EOD Reports', icon: FileSpreadsheet },
    { id: 'analytics', label: 'Analytics & Gantt', icon: BarChart3 },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  const roleMeta: Record<UserRole, { label: string; name: string; icon: string; badgeColor: string }> = {
    EMPLOYEE: {
      label: 'Employee',
      name: 'Alex Rivers (Dev)',
      icon: '👤',
      badgeColor: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40',
    },
    TEAM_LEAD: {
      label: 'Team Lead',
      name: 'Marcus Vance (Lead)',
      icon: '🛡️',
      badgeColor: 'bg-amber-600/20 text-amber-300 border-amber-500/40',
    },
    MANAGER: {
      label: 'Manager',
      name: 'Elena Rostova (VP Ops)',
      icon: '👑',
      badgeColor: 'bg-purple-600/20 text-purple-300 border-purple-500/40',
    },
    HR: {
      label: 'HR / Learning',
      name: 'Claire Underwood (HR)',
      icon: '🎓',
      badgeColor: 'bg-pink-600/20 text-pink-300 border-pink-500/40',
    },
  };

  return (
    <header className="bg-slate-900/95 border-b border-slate-800 text-slate-100 sticky top-0 z-40 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & App Title */}
          <div
            className="flex items-center space-x-3 cursor-pointer flex-shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  ApexTracker
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  Enterprise
                </span>
              </div>
              <p className="text-xs text-slate-400">Project Intelligence & Continuity</p>
            </div>
          </div>

          {/* Active Project Selector */}
          <div className="hidden lg:flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-indigo-500/30 shadow-inner">
            <FolderGit2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-400 leading-tight">Project</span>
              <select
                value={activeProjectId}
                onChange={(e) => onSelectProject(e.target.value)}
                className="bg-transparent text-xs font-extrabold text-slate-100 border-none outline-none cursor-pointer focus:ring-0 p-0"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-slate-200">
                    [{p.code}] {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Nav Tabs: Primary Hubs + Clean More Menu */}
          <nav className="hidden xl:flex items-center space-x-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800/80">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && !isActive && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Compact More Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 flex items-center space-x-1 ${
                  secondaryNavItems.some((s) => s.id === activeTab)
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span>
                  {secondaryNavItems.find((s) => s.id === activeTab)?.label || 'More'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    {secondaryNavItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setMoreDropdownOpen(false);
                          }}
                          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-indigo-600 text-white font-black'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Controls: Single Role Persona Dropdown & Actions */}
          <div className="flex items-center space-x-2">
            {/* Sleek Role Persona Selector Dropdown (Replaces 4 crowded buttons) */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${roleMeta[currentRole].badgeColor} hover:brightness-110`}
                title="Change active viewing persona"
              >
                <span>{roleMeta[currentRole].icon}</span>
                <span className="font-extrabold">{roleMeta[currentRole].name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <div className="px-2 py-1.5 border-b border-slate-800/80 mb-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                        Switch Active Role Persona
                      </span>
                    </div>
                    {(['EMPLOYEE', 'TEAM_LEAD', 'MANAGER', 'HR'] as UserRole[]).map((role) => {
                      const meta = roleMeta[role];
                      const isCurrent = currentRole === role;
                      return (
                        <button
                          key={role}
                          onClick={() => {
                            onRoleChange(role);
                            setRoleDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                            isCurrent
                              ? 'bg-indigo-600/30 text-white border border-indigo-500/40'
                              : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            <span className="text-base">{meta.icon}</span>
                            <div>
                              <span className="block text-xs font-black">{meta.label}</span>
                              <span className="block text-[10px] text-slate-400">{meta.name}</span>
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-black uppercase bg-indigo-500/20 text-indigo-300">Active</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Welcome / Guide Button */}
            <button
              onClick={() => onOpenAuthModal('admin')}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/80 flex-shrink-0"
              title="Open Welcome Gateway & Onboarding Guide"
            >
              <HelpCircle className="w-4 h-4 text-indigo-400" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-slate-800 space-y-3 animate-in slide-in-from-top-2 duration-150">

            {/* Project Selector for mobile */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">Active Project</span>
              <select
                value={activeProjectId}
                onChange={(e) => {
                  onSelectProject(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-slate-900 text-xs font-bold text-slate-100 p-2 rounded-lg border border-slate-800 outline-none"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{p.code}] {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Nav Tabs List */}
            <div className="grid grid-cols-2 gap-2">
              {allNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'bg-slate-950 text-slate-300 border border-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-indigo-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Role switchers for mobile */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Switch Active RBAC View</span>
              <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
                <button
                  onClick={() => onRoleChange('EMPLOYEE')}
                  className={`p-2 rounded-lg text-center ${currentRole === 'EMPLOYEE' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  Employee
                </button>
                <button
                  onClick={() => onRoleChange('TEAM_LEAD')}
                  className={`p-2 rounded-lg text-center ${currentRole === 'TEAM_LEAD' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  Lead
                </button>
                <button
                  onClick={() => onRoleChange('MANAGER')}
                  className={`p-2 rounded-lg text-center ${currentRole === 'MANAGER' ? 'bg-purple-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  Manager
                </button>
                <button
                  onClick={() => onRoleChange('HR')}
                  className={`p-2 rounded-lg text-center ${currentRole === 'HR' ? 'bg-pink-600 text-white' : 'bg-slate-900 text-slate-400'}`}
                >
                  HR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
