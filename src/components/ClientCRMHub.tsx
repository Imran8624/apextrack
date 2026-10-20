'use client';

import React, { useState } from 'react';
import {
  ClientAccount,
  ClientRequirement,
  ClientTicket,
  UserRole,
  Project,
  Priority,
  ClientRequirementStatus,
  ClientTier,
} from '@/types';
import {
  Building2,
  UsersRound,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  FileText,
  AlertTriangle,
  Flame,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Sparkles,
  Layers,
  ArrowUpRight,
  UserCheck,
} from 'lucide-react';

interface ClientCRMHubProps {
  currentRole: UserRole;
  clients: ClientAccount[];
  requirements: ClientRequirement[];
  tickets: ClientTicket[];
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (projectId: string) => void;
  onCreateRequirement: (req: Omit<ClientRequirement, 'id' | 'requestedDate'>) => void;
  onUpdateRequirementStatus: (id: string, status: ClientRequirementStatus) => void;
  onEscalateTicketToWarRoom: (ticket: ClientTicket) => void;
  onResolveTicket: (ticketId: string) => void;
  onSelectClientChatDM?: (clientEmail: string) => void;
}

export const ClientCRMHub: React.FC<ClientCRMHubProps> = ({
  currentRole,
  clients,
  requirements,
  tickets,
  projects,
  activeProjectId,
  onSelectProject,
  onCreateRequirement,
  onUpdateRequirementStatus,
  onEscalateTicketToWarRoom,
  onResolveTicket,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'requirements' | 'tickets' | 'contacts'>('accounts');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [selectedClientFilter, setSelectedClientFilter] = useState<string>('ALL');

  // Modal State for New Client Requirement
  const [showAddReqModal, setShowAddReqModal] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqClientId, setReqClientId] = useState(clients[0]?.id || '');
  const [reqProjectId, setReqProjectId] = useState(activeProjectId || projects[0]?.id || '');
  const [reqPriority, setReqPriority] = useState<Priority>('HIGH');
  const [reqHours, setReqHours] = useState(24);
  const [reqRequester, setReqRequester] = useState('');
  const [reqSprint, setReqSprint] = useState('Sprint 15');
  const [reqCriteria, setReqCriteria] = useState('');

  // Computed Portfolio Metrics
  const totalACV = clients.reduce((sum, c) => sum + c.contractValueAnnual, 0);
  const avgHealth = Math.round(clients.reduce((sum, c) => sum + c.healthScore, 0) / (clients.length || 1));
  const openTicketsCount = tickets.filter((t) => t.status !== 'RESOLVED').length;
  const inSprintReqsCount = requirements.filter((r) => r.status === 'IN_SPRINT' || r.status === 'APPROVED').length;

  const getTierBadge = (tier: ClientTier) => {
    switch (tier) {
      case 'ENTERPRISE':
        return 'bg-purple-950/50 text-purple-300 border-purple-800/50';
      case 'STRATEGIC':
        return 'bg-blue-950/50 text-blue-300 border-blue-800/50';
      case 'GROWTH':
        return 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50';
      default:
        return 'bg-[#232f3e] text-slate-300 border-slate-700/60';
    }
  };

  const getHealthBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-300 bg-emerald-950/50 border-emerald-800/50' };
    if (score >= 75) return { label: 'Good', color: 'text-blue-300 bg-blue-950/50 border-blue-800/50' };
    if (score >= 60) return { label: 'Attention', color: 'text-amber-300 bg-amber-950/50 border-amber-800/50' };
    return { label: 'Critical Risk', color: 'text-rose-300 bg-rose-950/50 border-rose-800/50' };
  };

  const getStatusBadge = (status: ClientRequirementStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-950/50 text-blue-300 border-blue-800/50';
      case 'IN_SCOPING':
        return 'bg-amber-950/50 text-amber-300 border-amber-800/50';
      case 'APPROVED':
        return 'bg-blue-900/60 text-blue-200 border-blue-700/50';
      case 'IN_SPRINT':
        return 'bg-purple-950/60 text-purple-300 border-purple-800/50';
      case 'DELIVERED':
        return 'bg-emerald-950/50 text-emerald-300 border-emerald-800/50';
      case 'REJECTED':
        return 'bg-[#232f3e] text-slate-400 border-slate-700';
    }
  };

  const handleCreateRequirementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim()) return;

    const client = clients.find((c) => c.id === reqClientId);
    const project = projects.find((p) => p.id === reqProjectId);

    const criteriaList = reqCriteria
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    onCreateRequirement({
      clientId: reqClientId,
      clientName: client?.name || 'Client',
      projectId: reqProjectId,
      projectName: project?.name || 'Project',
      title: reqTitle,
      description: reqDesc,
      priority: reqPriority,
      status: 'APPROVED',
      estimatedImpactHours: reqHours,
      requestedByContactName: reqRequester || client?.contacts[0]?.name || 'Stakeholder',
      targetReleaseSprint: reqSprint,
      acceptanceCriteria: criteriaList.length ? criteriaList : ['Zero regression on existing client endpoints'],
    });

    setReqTitle('');
    setReqDesc('');
    setReqCriteria('');
    setShowAddReqModal(false);
  };

  // Filtered lists
  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTierFilter === 'ALL' || c.tier === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  const filteredRequirements = requirements.filter((r) => {
    const matchesClient = selectedClientFilter === 'ALL' || r.clientId === selectedClientFilter;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClient && matchesSearch;
  });

  const filteredTickets = tickets.filter((t) => {
    const matchesClient = selectedClientFilter === 'ALL' || t.clientId === selectedClientFilter;
    return matchesClient;
  });

  return (
    <div className="space-y-4 w-full min-w-0">
      {/* Top Banner: CRM Title & Executive Metrics */}
      <div className="bg-[#161e2e] border border-[#232f3e] rounded-lg p-4 sm:p-5 shadow-sm relative overflow-hidden min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#232f3e] pb-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-md bg-[#232f3e] border border-[#2d3748] text-blue-400 flex items-center justify-center font-bold shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-slate-100 tracking-tight truncate">
                  Client Relationship & Requirement CRM
                </h1>
                <span className="text-[10px] px-2 py-0.2 rounded font-semibold uppercase tracking-wider bg-purple-950/50 text-purple-300 border border-purple-800/50 shrink-0">
                  Anchored Pipeline
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                Centralized stakeholder requirement vault, SLA incident tracking, and contract continuity
              </p>
            </div>
          </div>

          {/* Action button */}
          {(currentRole === 'MANAGER' || currentRole === 'TEAM_LEAD' || currentRole === 'HR') && (
            <button
              onClick={() => setShowAddReqModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-[#ec7211] hover:bg-[#eb5f07] text-[#0f141c] font-bold text-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Anchor New Requirement</span>
            </button>
          )}
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 min-w-0">
          <div className="bg-[#0f141c] border border-[#232f3e] rounded-md p-3 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">Total Contract ARR</span>
              <div className="text-base font-bold text-slate-100 mt-0.5">
                ${(totalACV / 1000000).toFixed(2)}M
              </div>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3 shrink-0" /> 100% active retention
              </span>
            </div>
            <div className="w-8 h-8 rounded bg-[#232f3e] border border-[#2d3748] flex items-center justify-center text-emerald-400 shrink-0 ml-2">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#0f141c] border border-[#232f3e] rounded-md p-3 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">Portfolio Health</span>
              <div className="text-base font-bold text-slate-100 mt-0.5">
                {avgHealth}%
              </div>
              <span className="text-[10px] text-blue-400 font-medium">Weighted index score</span>
            </div>
            <div className="w-8 h-8 rounded bg-[#232f3e] border border-[#2d3748] flex items-center justify-center text-blue-400 shrink-0 ml-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#0f141c] border border-[#232f3e] rounded-md p-3 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">Active Scope Anchors</span>
              <div className="text-base font-bold text-purple-300 mt-0.5">
                {inSprintReqsCount} Locked
              </div>
              <span className="text-[10px] text-purple-400 font-medium">In engineering sprints</span>
            </div>
            <div className="w-8 h-8 rounded bg-[#232f3e] border border-[#2d3748] flex items-center justify-center text-purple-400 shrink-0 ml-2">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-[#0f141c] border border-[#232f3e] rounded-md p-3 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate">SLA Incident Tickets</span>
              <div className="text-base font-bold text-slate-100 mt-0.5">
                {openTicketsCount} Open
              </div>
              <span className="text-[10px] text-amber-400 font-medium truncate block">
                {tickets.filter((t) => t.severity === 'CRITICAL').length > 0 ? 'CRITICAL blocker alert' : 'Within SLA target'}
              </span>
            </div>
            <div className="w-8 h-8 rounded bg-[#232f3e] border border-[#2d3748] flex items-center justify-center text-amber-400 shrink-0 ml-2">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-[#161e2e] p-2 rounded-lg border border-[#232f3e] min-w-0">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1 md:pb-0 min-w-0">
          <button
            onClick={() => setActiveSubTab('accounts')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'accounts'
                ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f141c]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Accounts & Contracts</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#0f141c] text-slate-300 font-mono">{clients.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('requirements')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'requirements'
                ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f141c]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Scope Anchors</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-950/60 text-purple-300 font-mono">
              {requirements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'tickets'
                ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f141c]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SLA Tickets</span>
            {openTicketsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-950/60 text-amber-300 font-mono">
                {openTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('contacts')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'contacts'
                ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f141c]'
            }`}
          >
            <UsersRound className="w-3.5 h-3.5" />
            <span>Stakeholders Directory</span>
          </button>
        </div>

        {/* Search & Client Filter */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="relative flex-1 md:w-52">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search scope, contact..."
              className="w-full bg-[#0f141c] border border-[#232f3e] text-xs text-slate-200 pl-7 pr-2.5 py-1.5 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
            className="bg-[#0f141c] border border-[#232f3e] text-xs text-slate-300 px-2 py-1.5 rounded-md focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Accounts</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#161e2e]">
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>


      {/* SUB-TAB 1: CLIENT ACCOUNTS PORTFOLIO */}
      {activeSubTab === 'accounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full min-w-0">
          {filteredClients.map((client) => {
            const healthMeta = getHealthBadge(client.healthScore);
            const linkedProject = projects.find((p) => p.id === client.activeProjectId);

            return (
              <div
                key={client.id}
                className="bg-[#161e2e] border border-[#232f3e] rounded-lg p-4 shadow-sm transition-colors space-y-3.5 min-w-0 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-100 truncate">{client.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded border shrink-0 ${getTierBadge(client.tier)}`}>
                        {client.tier}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 truncate">{client.industry}</p>
                  </div>

                  {/* Health Score Pill */}
                  <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center space-x-1 shrink-0 ${healthMeta.color}`}>
                    <ShieldCheck className="w-3 h-3" />
                    <span>{client.healthScore}% Health</span>
                  </div>
                </div>

                {/* Account Details Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-y border-[#232f3e] text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Annual ACV</span>
                    <span className="font-semibold text-slate-200 text-xs">${(client.contractValueAnnual / 1000).toLocaleString()}k/yr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">SLA Target</span>
                    <span className="font-semibold text-slate-200 text-xs">{client.slaUptimeTarget}% Uptime</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Account Lead</span>
                    <span className="font-semibold text-blue-300 text-xs truncate block">{client.dedicatedLead}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Linked Project</span>
                    <button
                      onClick={() => onSelectProject(client.activeProjectId)}
                      className="font-semibold text-purple-300 hover:underline truncate block text-left text-xs"
                    >
                      {linkedProject ? `[${linkedProject.code}]` : 'View'}
                    </button>
                  </div>
                </div>

                {/* Last Touchpoint & Sync */}
                <div className="bg-[#0f141c] rounded-md p-2.5 border border-[#232f3e] text-xs space-y-1 min-w-0">
                  <div className="flex items-center justify-between text-slate-400 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-400" /> Next Executive Sync:
                    </span>
                    <span className="font-semibold text-slate-200">{client.nextSyncDate}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] pt-0.5 break-words">
                    &ldquo;{client.lastTouchpointSummary}&rdquo;
                  </p>
                </div>

                {/* Primary Contacts Chips */}
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Key Stakeholders:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {client.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-[#0f141c] border border-[#232f3e] rounded-md px-2 py-1 text-xs flex items-center space-x-1.5 max-w-full"
                      >
                        <div className="w-4 h-4 rounded bg-[#232f3e] text-blue-300 flex items-center justify-center font-bold text-[9px] shrink-0">
                          {contact.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="font-medium text-slate-200 text-xs truncate block">{contact.name}</span>
                          <span className="text-[9px] text-slate-400 block truncate">{contact.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 2: CENTRALIZED SCOPE ANCHORS & CLIENT REQUIREMENTS */}
      {activeSubTab === 'requirements' && (
        <div className="space-y-3 w-full min-w-0">
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>
              Showing {filteredRequirements.length} Anchored Requirements locked to Sprints & Tasks
            </span>
            <span className="text-blue-400 font-mono">Stage 1 & 4 Context Protection Active</span>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full min-w-0">
            {filteredRequirements.map((req) => (
              <div
                key={req.id}
                className="bg-[#161e2e] border border-[#232f3e] rounded-lg p-4 shadow-sm space-y-3 transition-colors min-w-0 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 min-w-0">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#0f141c] text-slate-300 border border-[#232f3e]">
                        {req.id.toUpperCase()}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 truncate">{req.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded border shrink-0 ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded border shrink-0 ${
                          req.priority === 'URGENT'
                            ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                            : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span className="text-purple-300 font-medium">{req.clientName}</span>
                      <span>•</span>
                      <span>Target: {req.targetReleaseSprint}</span>
                      <span>•</span>
                      <span>Impact: ~{req.estimatedImpactHours}h dev effort</span>
                      <span>•</span>
                      <span>Requested by: {req.requestedByContactName}</span>
                    </div>
                  </div>

                  {/* Status update controls for Leads and Managers */}
                  {(currentRole === 'MANAGER' || currentRole === 'TEAM_LEAD') && (
                    <div className="flex items-center space-x-1.5 self-start shrink-0">
                      <select
                        value={req.status}
                        onChange={(e) => onUpdateRequirementStatus(req.id, e.target.value as ClientRequirementStatus)}
                        className="bg-[#0f141c] border border-[#232f3e] text-xs text-slate-200 px-2 py-1 rounded-md focus:outline-none focus:border-blue-500"
                      >
                        <option value="NEW">NEW</option>
                        <option value="IN_SCOPING">IN_SCOPING</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="IN_SPRINT">IN_SPRINT</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#0f141c] p-2.5 rounded-md border border-[#232f3e] break-words">
                  {req.description}
                </p>

                {/* Acceptance Criteria Checklist */}
                {req.acceptanceCriteria && req.acceptanceCriteria.length > 0 && (
                  <div className="space-y-1.5 pt-1 min-w-0">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Client Acceptance Criteria:
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                      {req.acceptanceCriteria.map((crit, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5 text-slate-300 break-words">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                          <span className="break-words">{crit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: SLA TICKETS & INCIDENTS */}
      {activeSubTab === 'tickets' && (
        <div className="space-y-3 w-full min-w-0">
          <div className="grid grid-cols-1 gap-3 w-full min-w-0">
            {filteredTickets.map((tkt) => {
              const isCritical = tkt.severity === 'CRITICAL' || tkt.severity === 'MODERATE';
              return (
                <div
                  key={tkt.id}
                  className={`bg-[#161e2e] border rounded-lg p-4 shadow-sm space-y-2.5 transition-colors min-w-0 overflow-hidden ${
                    tkt.status === 'RESOLVED'
                      ? 'border-[#232f3e] opacity-60'
                      : isCritical
                      ? 'border-amber-700/60'
                      : 'border-[#232f3e]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-[#0f141c] text-slate-300 border border-[#232f3e]">
                          {tkt.id.toUpperCase()}
                        </span>
                        <h3 className="text-sm font-bold text-slate-100 truncate">{tkt.title}</h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded border shrink-0 ${
                            tkt.severity === 'CRITICAL'
                              ? 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                              : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                          }`}
                        >
                          {tkt.severity}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0f141c] text-slate-400 border border-[#232f3e] shrink-0">
                          {tkt.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span className="text-purple-300 font-medium">{tkt.clientName}</span>
                        <span>•</span>
                        <span>Assigned Lead: {tkt.assignedLead}</span>
                        <span>•</span>
                        <span>Logged: {tkt.createdAt}</span>
                      </div>
                    </div>

                    {/* SLA countdown and Escalation actions */}
                    <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                      <div className="text-right mr-2 hidden sm:block">
                        <span className="text-[9px] text-slate-400 uppercase font-semibold block">SLA Target</span>
                        <span className="text-xs font-semibold text-amber-300 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> ~{Math.round(tkt.slaRemainingMinutes / 60)}h remaining
                        </span>
                      </div>

                      {tkt.status !== 'RESOLVED' && (
                        <>
                          <button
                            onClick={() => onEscalateTicketToWarRoom(tkt)}
                            className="px-2.5 py-1.5 rounded-md bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-semibold flex items-center space-x-1 transition-colors"
                            title="Trigger Emergency War Room for this client ticket"
                          >
                            <Flame className="w-3.5 h-3.5 text-rose-400" />
                            <span>War Room</span>
                          </button>

                          <button
                            onClick={() => onResolveTicket(tkt.id)}
                            className="px-2.5 py-1.5 rounded-md bg-[#232f3e] hover:bg-[#2d3748] text-emerald-300 border border-emerald-800/60 text-xs font-semibold flex items-center space-x-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Resolve</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: STAKEHOLDERS DIRECTORY */}
      {activeSubTab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 w-full min-w-0">
          {clients.flatMap((c) =>
            c.contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-[#161e2e] border border-[#232f3e] rounded-lg p-3.5 shadow-sm space-y-2.5 min-w-0 overflow-hidden"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-md bg-[#232f3e] text-blue-300 font-bold flex items-center justify-center text-xs shrink-0 border border-[#2d3748]">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-100 truncate">{contact.name}</h4>
                    <p className="text-[11px] text-blue-400 font-medium truncate">{contact.role}</p>
                    <span className="text-[10px] text-slate-400 truncate block">{c.name}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#232f3e] space-y-1 text-xs text-slate-300 min-w-0">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:text-blue-300 truncate text-[11px]">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-1.5 min-w-0">
                      <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="text-[11px] truncate">{contact.phone}</span>
                    </div>
                  )}
                </div>

                {contact.isPrimary && (
                  <div className="pt-0.5">
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-blue-950/60 text-blue-300 border border-blue-800/50">
                      Primary Escalation Lead
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* MODAL: ANCHOR NEW CLIENT REQUIREMENT */}
      {showAddReqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000]/70 p-4">
          <div className="bg-[#161e2e] border border-[#232f3e] rounded-lg max-w-lg w-full p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#232f3e] pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-bold text-slate-100">Anchor New Client Requirement</h3>
              </div>
              <button
                onClick={() => setShowAddReqModal(false)}
                className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-[#0f141c] border border-[#232f3e] text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequirementSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Client Account
                </label>
                <select
                  value={reqClientId}
                  onChange={(e) => setReqClientId(e.target.value)}
                  className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id} className="bg-[#161e2e]">
                      {c.name} ({c.tier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Target Project
                </label>
                <select
                  value={reqProjectId}
                  onChange={(e) => setReqProjectId(e.target.value)}
                  className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#161e2e]">
                      [{p.code}] {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Requirement Title
                </label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g., Sub-200ms latency for 8-person war rooms"
                  className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Detailed Description & Context
                </label>
                <textarea
                  required
                  rows={3}
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="Explain exactly what client requested and technical constraints..."
                  className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={reqPriority}
                    onChange={(e) => setReqPriority(e.target.value as Priority)}
                    className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={reqHours}
                    onChange={(e) => setReqHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-300 uppercase mb-1">
                    Release Sprint
                  </label>
                  <input
                    type="text"
                    value={reqSprint}
                    onChange={(e) => setReqSprint(e.target.value)}
                    className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-300 uppercase mb-1">
                  Acceptance Criteria (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={reqCriteria}
                  onChange={(e) => setReqCriteria(e.target.value)}
                  placeholder="Peer connection negotiation finishes under 180ms&#10;Screen share 1080p 30fps"
                  className="w-full bg-[#0f141c] border border-[#232f3e] rounded-md px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#232f3e]">
                <button
                  type="button"
                  onClick={() => setShowAddReqModal(false)}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-300 hover:bg-[#0f141c] border border-[#232f3e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-md bg-[#ec7211] hover:bg-[#eb5f07] text-[#0f141c] font-bold text-xs"
                >
                  Anchor Requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
