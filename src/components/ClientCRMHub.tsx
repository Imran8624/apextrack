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
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
      case 'STRATEGIC':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'GROWTH':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-700/40 text-slate-300 border-slate-600/40';
    }
  };

  const getHealthBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (score >= 75) return { label: 'Good', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    if (score >= 60) return { label: 'Attention', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'Critical Risk', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
  };

  const getStatusBadge = (status: ClientRequirementStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'IN_SCOPING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'APPROVED':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'IN_SPRINT':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/40 animate-pulse';
      case 'DELIVERED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'REJECTED':
        return 'bg-slate-700/40 text-slate-400 border-slate-600';
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
    <div className="space-y-6">
      {/* Top Banner: CRM Title & Executive Metrics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-600/10 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-500 text-white shadow-lg shadow-indigo-500/25">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <h1 className="text-xl font-extrabold text-slate-100 tracking-tight">
                  Client Relationship & Requirement CRM
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Anchored Pipeline
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized stakeholder requirement vault, SLA incident tracking, and contract continuity
              </p>
            </div>
          </div>

          {/* Action button */}
          {(currentRole === 'MANAGER' || currentRole === 'TEAM_LEAD' || currentRole === 'HR') && (
            <button
              onClick={() => setShowAddReqModal(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Anchor New Requirement</span>
            </button>
          )}
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 relative z-10">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Total Contract ARR</span>
              <div className="text-xl font-extrabold text-slate-100 mt-1">
                ${(totalACV / 1000000).toFixed(2)}M
              </div>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3" /> 100% active retention
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Portfolio Health</span>
              <div className="text-xl font-extrabold text-slate-100 mt-1">
                {avgHealth}%
              </div>
              <span className="text-[10px] text-indigo-400 font-medium">Weighted index score</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Scope Anchors</span>
              <div className="text-xl font-extrabold text-purple-300 mt-1">
                {inSprintReqsCount} Locked
              </div>
              <span className="text-[10px] text-purple-400 font-medium">In active engineering sprints</span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">SLA Incident Tickets</span>
              <div className="text-xl font-extrabold text-slate-100 mt-1">
                {openTicketsCount} Open
              </div>
              <span className="text-[10px] text-amber-400 font-medium">
                {tickets.filter((t) => t.severity === 'CRITICAL').length > 0 ? 'CRITICAL blocker alert' : 'Within SLA target'}
              </span>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/60 p-2 rounded-xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveSubTab('accounts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeSubTab === 'accounts'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Accounts & Contracts</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">{clients.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('requirements')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeSubTab === 'requirements'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Scope Anchors & Changes</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/30 text-purple-200">
              {requirements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeSubTab === 'tickets'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SLA Tickets & Escalations</span>
            {openTicketsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/30 text-amber-300">
                {openTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('contacts')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${
              activeSubTab === 'contacts'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <UsersRound className="w-4 h-4" />
            <span>Stakeholders Directory</span>
          </button>
        </div>

        {/* Search & Client Filter */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client, scope, contact..."
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 px-2 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Accounts</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SUB-TAB 1: CLIENT ACCOUNTS PORTFOLIO */}
      {activeSubTab === 'accounts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredClients.map((client) => {
            const healthMeta = getHealthBadge(client.healthScore);
            const linkedProject = projects.find((p) => p.id === client.activeProjectId);

            return (
              <div
                key={client.id}
                className="bg-slate-900 border border-slate-800/90 hover:border-slate-700/80 rounded-2xl p-5 shadow-xl transition-all space-y-4 relative group"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-extrabold text-slate-100">{client.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTierBadge(client.tier)}`}>
                        {client.tier}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{client.industry}</p>
                  </div>

                  {/* Health Score Pill */}
                  <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center space-x-1.5 ${healthMeta.color}`}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{client.healthScore}% Health</span>
                  </div>
                </div>

                {/* Account Details Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-2 border-y border-slate-800/70 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Annual ACV</span>
                    <span className="font-bold text-slate-200">${(client.contractValueAnnual / 1000).toLocaleString()}k/yr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">SLA Target</span>
                    <span className="font-bold text-slate-200">{client.slaUptimeTarget}% Uptime</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Account Lead</span>
                    <span className="font-bold text-indigo-300">{client.dedicatedLead}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">Linked Project</span>
                    <button
                      onClick={() => onSelectProject(client.activeProjectId)}
                      className="font-bold text-purple-400 hover:text-purple-300 truncate block text-left"
                    >
                      {linkedProject ? `[${linkedProject.code}]` : 'View'}
                    </button>
                  </div>
                </div>

                {/* Last Touchpoint & Sync */}
                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Next Executive Sync:
                    </span>
                    <span className="font-semibold text-slate-200">{client.nextSyncDate}</span>
                  </div>
                  <p className="text-slate-300 italic text-[11px] pt-1">
                    &ldquo;{client.lastTouchpointSummary}&rdquo;
                  </p>
                </div>

                {/* Primary Contacts Chips */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Key Stakeholders:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {client.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-slate-800/70 border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs flex items-center space-x-2"
                      >
                        <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-slate-200">{contact.name}</span>
                          <span className="text-[10px] text-slate-400 block">{contact.role}</span>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing {filteredRequirements.length} Anchored Requirements locked to Sprints & Tasks
            </span>
            <span className="text-indigo-400 font-medium">Stage 1 & 4 Context Protection Active</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredRequirements.map((req) => (
              <div
                key={req.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3.5 hover:border-slate-700/80 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {req.id.toUpperCase()}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-100">{req.title}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          req.priority === 'URGENT'
                            ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {req.priority} PRIORITY
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
                      <span className="text-purple-300 font-semibold">{req.clientName}</span>
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
                    <div className="flex items-center space-x-1.5 self-start">
                      <select
                        value={req.status}
                        onChange={(e) => onUpdateRequirementStatus(req.id, e.target.value as ClientRequirementStatus)}
                        className="bg-slate-950 border border-slate-700 text-xs text-slate-200 px-2.5 py-1 rounded-lg focus:outline-none focus:border-indigo-500"
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

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-xl border border-slate-800/60">
                  {req.description}
                </p>

                {/* Acceptance Criteria Checklist */}
                {req.acceptanceCriteria && req.acceptanceCriteria.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Client Acceptance Criteria:
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs">
                      {req.acceptanceCriteria.map((crit, idx) => (
                        <li key={idx} className="flex items-start space-x-2 text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                          <span>{crit}</span>
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((tkt) => {
              const isCritical = tkt.severity === 'CRITICAL' || tkt.severity === 'MODERATE';
              return (
                <div
                  key={tkt.id}
                  className={`bg-slate-900 border rounded-2xl p-5 shadow-xl space-y-3 transition-all ${
                    tkt.status === 'RESOLVED'
                      ? 'border-slate-800 opacity-60'
                      : isCritical
                      ? 'border-amber-500/40 shadow-amber-500/5'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                          {tkt.id.toUpperCase()}
                        </span>
                        <h3 className="text-base font-extrabold text-slate-100">{tkt.title}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tkt.severity === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {tkt.severity}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {tkt.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3 text-xs text-slate-400">
                        <span className="text-purple-300 font-semibold">{tkt.clientName}</span>
                        <span>•</span>
                        <span>Assigned Lead: {tkt.assignedLead}</span>
                        <span>•</span>
                        <span>Logged: {tkt.createdAt}</span>
                      </div>
                    </div>

                    {/* SLA countdown and Escalation actions */}
                    <div className="flex items-center space-x-2 self-start sm:self-auto">
                      <div className="text-right mr-2 hidden sm:block">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">SLA Target</span>
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> ~{Math.round(tkt.slaRemainingMinutes / 60)}h remaining
                        </span>
                      </div>

                      {tkt.status !== 'RESOLVED' && (
                        <>
                          <button
                            onClick={() => onEscalateTicketToWarRoom(tkt)}
                            className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-red-500/10 transition-all"
                            title="Trigger Emergency War Room for this client ticket"
                          >
                            <Flame className="w-3.5 h-3.5 text-red-400" />
                            <span>Escalate to War Room</span>
                          </button>

                          <button
                            onClick={() => onResolveTicket(tkt.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Mark Resolved</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.flatMap((c) =>
            c.contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-extrabold flex items-center justify-center text-base shadow-md shadow-indigo-500/20">
                    {contact.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-100">{contact.name}</h4>
                    <p className="text-xs text-indigo-400 font-medium">{contact.role}</p>
                    <span className="text-[11px] text-slate-400">{c.name}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${contact.email}`} className="hover:text-indigo-300 truncate">
                      {contact.email}
                    </a>
                  </div>
                  {contact.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{contact.phone}</span>
                    </div>
                  )}
                </div>

                {contact.isPrimary && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                      Primary Escalation Point of Contact
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-slate-100">Anchor New Client Requirement</h3>
              </div>
              <button
                onClick={() => setShowAddReqModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequirementSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Client Account
                </label>
                <select
                  value={reqClientId}
                  onChange={(e) => setReqClientId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.tier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Target Project
                </label>
                <select
                  value={reqProjectId}
                  onChange={(e) => setReqProjectId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      [{p.code}] {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Requirement Title
                </label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g., Sub-200ms latency for 8-person war rooms"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Detailed Description & Context
                </label>
                <textarea
                  required
                  rows={3}
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="Explain exactly what the client requested and technical constraints..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={reqPriority}
                    onChange={(e) => setReqPriority(e.target.value as Priority)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={reqHours}
                    onChange={(e) => setReqHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                    Release Sprint
                  </label>
                  <input
                    type="text"
                    value={reqSprint}
                    onChange={(e) => setReqSprint(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Acceptance Criteria (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={reqCriteria}
                  onChange={(e) => setReqCriteria(e.target.value)}
                  placeholder="Peer connection negotiation finishes under 180ms&#10;Screen share 1080p 30fps"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddReqModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
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
