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
  DollarSign,
  FileText,
  Flame,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowUpRight,
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
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'STRATEGIC':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'GROWTH':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getHealthBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (score >= 75) return { label: 'Good', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (score >= 60) return { label: 'Attention', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Critical Risk', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const getStatusBadge = (status: ClientRequirementStatus) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'IN_SCOPING':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'APPROVED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'IN_SPRINT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-slate-100 text-slate-600 border-slate-200';
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
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs relative overflow-hidden min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Building2 className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight truncate">
                  Client Relationship & Requirement CRM
                </h1>
                <span className="text-[10px] px-2 py-0.2 rounded font-semibold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 shrink-0">
                  Anchored Pipeline
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                Centralized stakeholder requirement vault, SLA incident tracking, and contract continuity
              </p>
            </div>
          </div>

          {/* Action button */}
          {(currentRole === 'MANAGER' || currentRole === 'TEAM_LEAD' || currentRole === 'HR') && (
            <button
              onClick={() => setShowAddReqModal(true)}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Anchor New Requirement</span>
            </button>
          )}
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-4 min-w-0">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block truncate">Total Contract ARR</span>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                ${(totalACV / 1000000).toFixed(2)}M
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="w-3 h-3 shrink-0" /> 100% active retention
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shrink-0 ml-2 shadow-xs">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block truncate">Portfolio Health</span>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {avgHealth}%
              </div>
              <span className="text-[10px] text-indigo-600 font-semibold">Weighted index score</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shrink-0 ml-2 shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block truncate">Active Scope Anchors</span>
              <div className="text-base font-bold text-purple-700 mt-0.5">
                {inSprintReqsCount} Locked
              </div>
              <span className="text-[10px] text-purple-600 font-semibold">In engineering sprints</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-purple-600 shrink-0 ml-2 shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block truncate">SLA Incident Tickets</span>
              <div className="text-base font-bold text-slate-900 mt-0.5">
                {openTicketsCount} Open
              </div>
              <span className="text-[10px] text-amber-600 font-semibold truncate block">
                {tickets.filter((t) => t.severity === 'CRITICAL').length > 0 ? 'CRITICAL blocker alert' : 'Within SLA target'}
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-amber-600 shrink-0 ml-2 shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 bg-white p-2 rounded-xl border border-slate-200 shadow-xs min-w-0">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar pb-1 md:pb-0 min-w-0">
          <button
            onClick={() => setActiveSubTab('accounts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'accounts'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Accounts & Contracts</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700 font-mono">{clients.length}</span>
          </button>

          <button
            onClick={() => setActiveSubTab('requirements')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'requirements'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Scope Anchors</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-100 text-purple-700 font-mono font-semibold">
              {requirements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'tickets'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>SLA Tickets</span>
            {openTicketsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-100 text-amber-800 font-mono font-semibold">
                {openTicketsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('contacts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 whitespace-nowrap shrink-0 ${
              activeSubTab === 'contacts'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
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
              className="w-full bg-slate-50 border border-slate-200 text-xs text-slate-800 pl-7 pr-2.5 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <select
            value={selectedClientFilter}
            onChange={(e) => setSelectedClientFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 px-2 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Accounts</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="bg-white text-slate-800">
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
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs transition-colors space-y-3.5 min-w-0 overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900 truncate">{client.name}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded border shrink-0 ${getTierBadge(client.tier)}`}>
                        {client.tier}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{client.industry}</p>
                  </div>

                  {/* Health Score Pill */}
                  <div className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center space-x-1 shrink-0 ${healthMeta.color}`}>
                    <ShieldCheck className="w-3 h-3" />
                    <span>{client.healthScore}% Health</span>
                  </div>
                </div>

                {/* Account Details Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-2 border-y border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Annual ACV</span>
                    <span className="font-semibold text-slate-900 text-xs">${(client.contractValueAnnual / 1000).toLocaleString()}k/yr</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">SLA Target</span>
                    <span className="font-semibold text-slate-900 text-xs">{client.slaUptimeTarget}% Uptime</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Account Lead</span>
                    <span className="font-semibold text-indigo-700 text-xs truncate block">{client.dedicatedLead}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-medium">Linked Project</span>
                    <button
                      onClick={() => onSelectProject(client.activeProjectId)}
                      className="font-semibold text-purple-700 hover:underline truncate block text-left text-xs"
                    >
                      {linkedProject ? `[${linkedProject.code}]` : 'View'}
                    </button>
                  </div>
                </div>

                {/* Last Touchpoint & Sync */}
                <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 text-xs space-y-1 min-w-0">
                  <div className="flex items-center justify-between text-slate-500 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-600" /> Next Executive Sync:
                    </span>
                    <span className="font-semibold text-slate-800">{client.nextSyncDate}</span>
                  </div>
                  <p className="text-slate-700 text-[11px] pt-0.5 break-words">
                    &ldquo;{client.lastTouchpointSummary}&rdquo;
                  </p>
                </div>

                {/* Primary Contacts Chips */}
                <div className="space-y-1.5 min-w-0">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Key Stakeholders:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {client.contacts.map((contact) => (
                      <div
                        key={contact.id}
                        className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs flex items-center space-x-1.5 max-w-full"
                      >
                        <div className="w-4 h-4 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[9px] shrink-0">
                          {contact.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-800 text-xs truncate block">{contact.name}</span>
                          <span className="text-[9px] text-slate-500 block truncate">{contact.role}</span>
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
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>
              Showing {filteredRequirements.length} Anchored Requirements locked to Sprints & Tasks
            </span>
            <span className="text-indigo-600 font-mono font-medium">Stage 1 & 4 Context Protection Active</span>
          </div>

          <div className="grid grid-cols-1 gap-3 w-full min-w-0">
            {filteredRequirements.map((req) => (
              <div
                key={req.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 transition-colors min-w-0 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 min-w-0">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {req.id.toUpperCase()}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 truncate">{req.title}</h3>
                      <span className={`text-[10px] font-semibold px-2 py-0.2 rounded border shrink-0 ${getStatusBadge(req.status)}`}>
                        {req.status}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded border shrink-0 ${
                          req.priority === 'URGENT'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {req.priority}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="text-purple-700 font-semibold">{req.clientName}</span>
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
                        className="bg-slate-50 border border-slate-200 text-xs text-slate-800 px-2 py-1 rounded-md focus:outline-none focus:border-indigo-500"
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

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-200 break-words">
                  {req.description}
                </p>

                {/* Acceptance Criteria Checklist */}
                {req.acceptanceCriteria && req.acceptanceCriteria.length > 0 && (
                  <div className="space-y-1.5 pt-1 min-w-0">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Client Acceptance Criteria:
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-1 text-xs">
                      {req.acceptanceCriteria.map((crit, idx) => (
                        <li key={idx} className="flex items-start space-x-1.5 text-slate-700 break-words">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
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
                  className={`bg-white border rounded-xl p-4 shadow-xs space-y-2.5 transition-colors min-w-0 overflow-hidden ${
                    tkt.status === 'RESOLVED'
                      ? 'border-slate-200 opacity-60'
                      : isCritical
                      ? 'border-amber-300 ring-1 ring-amber-300/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center space-x-2">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {tkt.id.toUpperCase()}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 truncate">{tkt.title}</h3>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded border shrink-0 ${
                            tkt.severity === 'CRITICAL'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {tkt.severity}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                          {tkt.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span className="text-purple-700 font-semibold">{tkt.clientName}</span>
                        <span>•</span>
                        <span>Assigned Lead: {tkt.assignedLead}</span>
                        <span>•</span>
                        <span>Logged: {tkt.createdAt}</span>
                      </div>
                    </div>

                    {/* SLA countdown and Escalation actions */}
                    <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                      <div className="text-right mr-2 hidden sm:block">
                        <span className="text-[9px] text-slate-500 uppercase font-semibold block">SLA Target</span>
                        <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-600" /> ~{Math.round(tkt.slaRemainingMinutes / 60)}h remaining
                        </span>
                      </div>

                      {tkt.status !== 'RESOLVED' && (
                        <>
                          <button
                            onClick={() => onEscalateTicketToWarRoom(tkt)}
                            className="px-2.5 py-1.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center space-x-1 transition-colors"
                            title="Trigger Emergency War Room for this client ticket"
                          >
                            <Flame className="w-3.5 h-3.5 text-rose-600" />
                            <span>War Room</span>
                          </button>

                          <button
                            onClick={() => onResolveTicket(tkt.id)}
                            className="px-2.5 py-1.5 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center space-x-1 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
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
                className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2.5 min-w-0 overflow-hidden"
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-xs shrink-0 border border-indigo-200 shadow-xs">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{contact.name}</h4>
                    <p className="text-[11px] text-indigo-600 font-semibold truncate">{contact.role}</p>
                    <span className="text-[10px] text-slate-500 truncate block">{c.name}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600 min-w-0">
                  <div className="flex items-center space-x-1.5 min-w-0">
                    <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                    <a href={`mailto:${contact.email}`} className="hover:text-indigo-600 truncate text-[11px]">
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
                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">Anchor New Client Requirement</h3>
              </div>
              <button
                onClick={() => setShowAddReqModal(false)}
                className="text-slate-400 hover:text-slate-600 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequirementSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Client Account
                </label>
                <select
                  value={reqClientId}
                  onChange={(e) => setReqClientId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id} className="bg-white text-slate-800">
                      {c.name} ({c.tier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Target Project
                </label>
                <select
                  value={reqProjectId}
                  onChange={(e) => setReqProjectId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-white text-slate-800">
                      [{p.code}] {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Requirement Title
                </label>
                <input
                  type="text"
                  required
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  placeholder="e.g., Sub-200ms latency for 8-person war rooms"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Detailed Description & Context
                </label>
                <textarea
                  required
                  rows={3}
                  value={reqDesc}
                  onChange={(e) => setReqDesc(e.target.value)}
                  placeholder="Explain exactly what client requested and technical constraints..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">
                    Priority
                  </label>
                  <select
                    value={reqPriority}
                    onChange={(e) => setReqPriority(e.target.value as Priority)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">
                    Est. Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={reqHours}
                    onChange={(e) => setReqHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-slate-700 uppercase mb-1">
                    Release Sprint
                  </label>
                  <input
                    type="text"
                    value={reqSprint}
                    onChange={(e) => setReqSprint(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 uppercase mb-1">
                  Acceptance Criteria (1 per line)
                </label>
                <textarea
                  rows={2}
                  value={reqCriteria}
                  onChange={(e) => setReqCriteria(e.target.value)}
                  placeholder="Peer connection negotiation finishes under 180ms&#10;Screen share 1080p 30fps"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddReqModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-colors"
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
