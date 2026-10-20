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
      badgeColor: 'bg-[#1e293b] text-slate-200 border-[#2d3748]',
    },
    TEAM_LEAD: {
      label: 'Team Lead',
      name: 'Marcus Vance (Lead)',
      icon: '🛡️',
      badgeColor: 'bg-[#23241d] text-amber-300 border-amber-900/60',
    },
    MANAGER: {
      label: 'Manager',
      name: 'Elena Rostova (VP)',
      icon: '👑',
      badgeColor: 'bg-[#241d2e] text-purple-300 border-purple-900/60',
    },
    HR: {
      label: 'HR / Learning',
      name: 'Claire Underwood',
      icon: '🎓',
      badgeColor: 'bg-[#1b2333] text-blue-300 border-blue-900/60',
    },
  };

  return (
    <header className="bg-[#161e2e] border-b border-[#232f3e] text-slate-200 sticky top-0 z-40 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-2">
          {/* Logo & App Title */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="w-8 h-8 rounded-md bg-[#232f3e] border border-[#2d3748] flex items-center justify-center text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-tight text-slate-100">
                  ApexTracker
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-medium bg-[#232f3e] text-slate-300 border border-[#2d3748]">
                  Console
                </span>
              </div>
            </div>
          </div>

          {/* Active Project Selector */}
          <div className="hidden md:flex items-center space-x-2 bg-[#0f141c] px-2.5 py-1 rounded-md border border-[#232f3e] shrink-0">
            <FolderGit2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={activeProjectId}
              onChange={(e) => onSelectProject(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-200 border-none outline-none cursor-pointer focus:ring-0 p-0"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#161e2e] text-slate-200">
                  [{p.code}] {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Nav Tabs: Scrollable without breaking bounds */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#0f141c] p-1 rounded-md border border-[#232f3e] overflow-x-auto no-scrollbar min-w-0">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#161e2e]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Compact More Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1 ${
                  secondaryNavItems.some((s) => s.id === activeTab)
                    ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#161e2e]'
                }`}
              >
                <span>
                  {secondaryNavItems.find((s) => s.id === activeTab)?.label || 'More'}
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {moreDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMoreDropdownOpen(false)} />
                  <div className="absolute left-0 mt-1.5 w-44 bg-[#161e2e] border border-[#232f3e] rounded-md p-1 shadow-xl z-50">
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
                          className={`w-full flex items-center space-x-2 px-2.5 py-1.5 rounded text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-[#232f3e] text-white font-bold'
                              : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 text-blue-400" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          {/* Right Controls: War Room Escalation, Role Persona, and Help */}
          <div className="flex items-center space-x-2 shrink-0">
            {/* War Room Escalation Button */}
            {onTriggerWarRoom && (
              <button
                onClick={onTriggerWarRoom}
                className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/60 text-xs font-semibold transition-colors"
                title="Trigger Emergency War Room"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span>War Room</span>
              </button>
            )}

            {/* Role Persona Dropdown */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className={`flex items-center space-x-1.5 px-2 py-1 rounded-md border text-xs font-medium transition-all ${roleMeta[currentRole].badgeColor}`}
                title="Change active viewing persona"
              >
                <span>{roleMeta[currentRole].icon}</span>
                <span className="font-semibold hidden sm:inline">{roleMeta[currentRole].label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {roleDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleDropdownOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-60 bg-[#161e2e] border border-[#232f3e] rounded-md p-1.5 shadow-xl z-50">
                    <div className="px-2 py-1 border-b border-[#232f3e] mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors text-left ${
                            isCurrent
                              ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40'
                              : 'text-slate-300 hover:bg-[#1e293b] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">{meta.icon}</span>
                            <div>
                              <span className="block text-xs font-bold">{meta.label}</span>
                              <span className="block text-[10px] text-slate-400">{meta.name}</span>
                            </div>
                          </div>
                          {isCurrent && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-blue-950 text-blue-300 border border-blue-800">
                              Active
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Help / Guide */}
            <button
              onClick={() => onOpenAuthModal('admin')}
              className="p-1.5 rounded-md bg-[#232f3e] hover:bg-[#2d3748] text-slate-300 hover:text-white transition-colors border border-[#2d3748] shrink-0"
              title="Open Welcome Gateway & Onboarding Guide"
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-md bg-[#232f3e] border border-[#2d3748] text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
