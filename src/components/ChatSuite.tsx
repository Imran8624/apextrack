'use client';

import React, { useState } from 'react';
import { Channel, Message, User, UserRole, Project } from '@/types';
import { getDMChannelId } from '@/lib/mockData';
import { Pin, Send, Paperclip, Video, Hash, ShieldAlert, FolderGit2, UserCheck, Lock, PhoneCall, Database, ShieldCheck, Cpu, Briefcase } from 'lucide-react';

interface ChatSuiteProps {
  channels: Channel[];
  messages: Record<string, Message[]>;
  users: User[];
  currentRole: UserRole;
  activeChannelId: string;
  activeProject: Project;
  onSelectChannel: (channelId: string) => void;
  onSendMessage: (channelId: string, content: string, fileAttachment?: string) => void;
  onTogglePinMessage: (channelId: string, messageId: string) => void;
  onTogglePinUserDM: (userId: string) => void;
  onStartCall: () => void;
  onStartDirectCall?: (targetUser: User) => void;
}

export const ChatSuite: React.FC<ChatSuiteProps> = ({
  channels,
  messages,
  users,
  currentRole,
  activeChannelId,
  activeProject,
  onSelectChannel,
  onSendMessage,
  onTogglePinMessage,
  onTogglePinUserDM,
  onStartCall,
  onStartDirectCall,
}) => {
  const [messageInput, setMessageInput] = useState<string>('');
  const [attachmentInput, setAttachmentInput] = useState<string>('');
  const [showAttachmentBox, setShowAttachmentBox] = useState<boolean>(false);
  const [pinnedHeaderExpanded, setPinnedHeaderExpanded] = useState<boolean>(true);
  const [chatViewMode, setChatViewMode] = useState<'messages' | 'database'>('messages');
  const [selectedDbTable, setSelectedDbTable] = useState<'messages' | 'channels' | 'pinned' | 'calls'>('messages');

  // Helper: Get Current User ID based on active RBAC Role
  const getCurrentUserId = (): string => {
    switch (currentRole) {
      case 'MANAGER':
        return 'u-3'; // Elena Rostova
      case 'TEAM_LEAD':
        return 'u-2'; // Marcus Vance
      default:
        return 'u-1'; // Alex Rivers
    }
  };

  const currentUserId = getCurrentUserId();
  const currentUser = users.find((u) => u.id === currentUserId);
  const isManagerOrLead = currentRole === 'TEAM_LEAD' || currentRole === 'MANAGER';

  // Identify partner user for DM channels
  let partnerUser: User | undefined;
  if (activeChannelId.startsWith('dm-')) {
    const userIds = activeChannelId.replace('dm-', '').split('-');
    const partnerUserId = userIds.find((id) => id !== currentUserId) || userIds[0];
    partnerUser = users.find((u) => u.id === partnerUserId);
  }

  // Dynamic active channel title & description
  let activeChannelName = '';
  let activeChannelDesc = '';
  let isDirectMessage = false;

  if (activeChannelId.startsWith('dm-')) {
    isDirectMessage = true;
    if (partnerUser) {
      activeChannelName = `Direct Chat with ${partnerUser.name} (${partnerUser.jobTitle || partnerUser.role})`;
      activeChannelDesc = `Dept: ${partnerUser.department} • Private channel between ${currentUser?.name} and ${partnerUser.name}`;
    } else {
      activeChannelName = '1-on-1 Direct Message';
      activeChannelDesc = 'Private 1-on-1 conversation channel';
    }
  } else {
    const ch = channels.find((c) => c.id === activeChannelId) || channels[0];
    activeChannelName = ch.name;
    activeChannelDesc = ch.description;
  }

  const channelMessages = messages[activeChannelId] || [];
  const pinnedMessages = channelMessages.filter((m) => m.isPinned);

  // Exclude current user from DM list
  const availableUsers = users.filter((u) => u.id !== currentUserId);
  const pinnedUsers = availableUsers.filter((u) => u.isPinnedDM);
  const unpinnedUsers = availableUsers.filter((u) => !u.isPinnedDM);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !attachmentInput.trim()) return;

    onSendMessage(activeChannelId, messageInput, attachmentInput || undefined);
    setMessageInput('');
    setAttachmentInput('');
    setShowAttachmentBox(false);
  };

  const allDatabaseMessages = Object.values(messages).flat();

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl h-[650px] flex overflow-hidden">
      {/* Sidebar: Topic Channels & Pinned Contacts */}
      <div className="w-64 sm:w-72 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0">
        <div className="space-y-4 overflow-y-auto pr-1">
          {/* Working Project Context Tag */}
          <div className="bg-slate-900/90 border border-indigo-500/30 p-2.5 rounded-xl flex items-center space-x-2">
            <FolderGit2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
            <div className="truncate text-xs">
              <span className="text-[10px] text-indigo-400 uppercase font-bold block">Current Project</span>
              <span className="font-bold text-slate-200 truncate block">{activeProject.name}</span>
            </div>
          </div>

          {/* Active Sender Profile Card */}
          <div className="bg-indigo-950/40 border border-indigo-500/40 p-2.5 rounded-xl text-xs flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-black text-white text-xs flex-shrink-0">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="truncate">
              <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider block">Logged In As:</span>
              <span className="font-extrabold text-slate-100 truncate block">{currentUser?.name}</span>
              <span className="text-[9px] text-indigo-400 block truncate">{currentUser?.jobTitle || currentUser?.department}</span>
            </div>
          </div>

          {/* Manager / TL Database Audit Vault Switcher Button */}
          {isManagerOrLead ? (
            <button
              onClick={() => setChatViewMode(chatViewMode === 'messages' ? 'database' : 'messages')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-2 ${
                chatViewMode === 'database'
                  ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30'
                  : 'bg-slate-900 text-amber-400 border-amber-500/40 hover:bg-amber-950/40'
              }`}
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>{chatViewMode === 'database' ? 'Return to Live Messages' : '🗄️ Database Audit Vault'}</span>
            </button>
          ) : (
            <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800 text-[10px] text-slate-400 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
              <span>Database Vault: Restricted to TLs & Managers</span>
            </div>
          )}

          {/* Section 1: Topic Channels */}
          <div>
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              <span>Topic Channels</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full">{channels.filter(c => !c.isDirectMessage).length}</span>
            </div>

            <div className="space-y-1">
              {channels.filter(c => !c.isDirectMessage).map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => {
                    onSelectChannel(channel.id);
                    setChatViewMode('messages');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeChannelId === channel.id && chatViewMode === 'messages'
                      ? channel.isEmergency
                        ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                        : 'bg-indigo-600 text-white shadow-md'
                      : channel.isEmergency
                      ? 'text-red-400 hover:bg-red-950/40'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {channel.isEmergency ? (
                      <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                    ) : (
                      <Hash className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{channel.name}</span>
                  </div>

                  {channel.pinnedMessageCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 font-mono flex items-center space-x-0.5">
                      <Pin className="w-2.5 h-2.5" />
                      <span>{channel.pinnedMessageCount}</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Pinned Contacts (Trending Roles & 1-on-1 Focus Mode) */}
          {pinnedUsers.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-2 px-1">
                <span className="flex items-center space-x-1">
                  <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Pinned Team Leads & AI Experts</span>
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                  {pinnedUsers.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {pinnedUsers.map((user) => {
                  const dmChannelId = getDMChannelId(currentUserId, user.id);
                  const isSelected = activeChannelId === dmChannelId && chatViewMode === 'messages';
                  return (
                    <div
                      key={user.id}
                      className={`p-2 rounded-xl border transition-all space-y-1.5 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-950/60 to-indigo-950/60 border-amber-400 text-white shadow-md'
                          : 'bg-slate-900/80 border-amber-500/30 text-slate-200 hover:border-amber-400/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            onSelectChannel(dmChannelId);
                            setChatViewMode('messages');
                          }}
                          className="flex items-center space-x-2.5 truncate flex-1 text-left"
                        >
                          <div className="relative flex-shrink-0">
                            <div className="w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center font-bold text-amber-300 text-xs border border-amber-500/40">
                              {user.name.charAt(0)}
                            </div>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 absolute bottom-0 right-0 border border-slate-950"></span>
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-xs text-slate-100 truncate">{user.name}</p>
                            <p className="text-[9px] text-amber-300 font-semibold truncate">{user.jobTitle || user.department}</p>
                          </div>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePinUserDM(user.id);
                          }}
                          className="p-1 rounded text-amber-400 hover:text-red-400 transition-colors"
                          title="Unpin contact"
                        >
                          <Pin className="w-3.5 h-3.5 fill-amber-400" />
                        </button>
                      </div>

                      <button
                        onClick={() => onStartDirectCall ? onStartDirectCall(user) : onStartCall()}
                        className="w-full py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center justify-center space-x-1 transition-all"
                      >
                        <PhoneCall className="w-3 h-3 text-amber-400" />
                        <span>Call Only {user.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: All Direct Team Contacts */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
              Direct Team Contacts
            </div>

            <div className="space-y-1">
              {unpinnedUsers.map((user) => {
                const dmChannelId = getDMChannelId(currentUserId, user.id);
                const isSelected = activeChannelId === dmChannelId && chatViewMode === 'messages';
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-950/60 border-slate-900 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectChannel(dmChannelId);
                        setChatViewMode('messages');
                      }}
                      className="flex items-center space-x-2.5 truncate flex-1 text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 text-xs flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <p className={`font-semibold text-xs truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                          {user.name}
                        </p>
                        <p className="text-[9px] text-slate-400 truncate">{user.jobTitle || user.department}</p>
                      </div>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onTogglePinUserDM(user.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-amber-400 transition-colors ml-1"
                      title="Pin contact to top"
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Instant Video Call Button */}
        <button
          onClick={onStartCall}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center space-x-2 transition-all shadow-md mt-3"
        >
          <Video className="w-4 h-4 text-indigo-400" />
          <span>Group War Room Call</span>
        </button>
      </div>

      {/* Main Right Area: Messages Feed OR Manager/TL Database Audit Vault */}
      <div className="flex-1 flex flex-col justify-between bg-slate-900/90">
        {chatViewMode === 'database' && isManagerOrLead ? (
          /* MANAGER & TEAM LEAD DATABASE AUDIT VAULT */
          <div className="p-6 space-y-4 h-full flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base flex items-center space-x-2">
                      <span>Communication Database & Audit Vault</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        PostgreSQL Prisma
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">Manager & Team Lead restricted raw database table viewer</p>
                  </div>
                </div>

                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                  <button
                    onClick={() => setSelectedDbTable('messages')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedDbTable === 'messages' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Messages Table ({allDatabaseMessages.length})
                  </button>
                  <button
                    onClick={() => setSelectedDbTable('channels')}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      selectedDbTable === 'channels' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Channels Table ({channels.length})
                  </button>
                </div>
              </div>

              {selectedDbTable === 'messages' && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span>SELECT * FROM &quot;Message&quot; WHERE channelId = &apos;{activeChannelId}&apos; ORDER BY sentAt DESC;</span>
                    <span className="text-emerald-400 font-bold">200 OK (0.4ms)</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto max-h-[350px]">
                    <table className="w-full text-left text-xs font-mono text-slate-300">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Message ID</th>
                          <th className="p-3">Channel ID</th>
                          <th className="p-3">Sender Name</th>
                          <th className="p-3">Role</th>
                          <th className="p-3">Department</th>
                          <th className="p-3">Content</th>
                          <th className="p-3">Sent At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {allDatabaseMessages.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-900/60">
                            <td className="p-3 text-indigo-400">{m.id}</td>
                            <td className="p-3 text-slate-400">{m.channelId}</td>
                            <td className="p-3 font-bold text-slate-200">{m.senderName}</td>
                            <td className="p-3"><span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px]">{m.senderRole}</span></td>
                            <td className="p-3 text-indigo-300">{m.senderDepartment || 'Engineering'}</td>
                            <td className="p-3 text-slate-300 max-w-xs truncate">{m.content}</td>
                            <td className="p-3 text-slate-400">{m.sentAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedDbTable === 'channels' && (
                <div className="space-y-3">
                  <div className="text-xs font-mono text-slate-400 flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <span>SELECT * FROM &quot;Channel&quot; ORDER BY createdAt ASC;</span>
                    <span className="text-emerald-400 font-bold">200 OK (0.2ms)</span>
                  </div>

                  <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto max-h-[350px]">
                    <table className="w-full text-left text-xs font-mono text-slate-300">
                      <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-3">Channel ID</th>
                          <th className="p-3">Channel Name</th>
                          <th className="p-3">Type</th>
                          <th className="p-3">Members</th>
                          <th className="p-3">Pinned Count</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {channels.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-900/60">
                            <td className="p-3 text-indigo-400">{c.id}</td>
                            <td className="p-3 font-bold text-slate-200">{c.name}</td>
                            <td className="p-3">{c.isDirectMessage ? <span className="text-purple-400 font-bold">1-ON-1 DM</span> : c.isEmergency ? <span className="text-red-400 font-bold">EMERGENCY</span> : <span className="text-slate-400">PUBLIC</span>}</td>
                            <td className="p-3 text-slate-300">{c.membersCount}</td>
                            <td className="p-3 text-amber-400 font-bold">{c.pinnedMessageCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => setChatViewMode('messages')}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                Close Database View
              </button>
              <span className="text-xs text-indigo-300 flex items-center space-x-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Audited DB Logs Encrypted under Role: {currentRole}</span>
              </span>
            </div>
          </div>
        ) : (
          /* REGULAR CHAT FEED VIEW */
          <>
            {/* Header Bar */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-slate-800 text-indigo-400">
                  {isDirectMessage ? (
                    <Lock className="w-5 h-5 text-amber-400" />
                  ) : activeChannelId === 'c-3' ? (
                    <ShieldAlert className="w-5 h-5 text-red-400" />
                  ) : (
                    <Hash className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-100 text-sm">{activeChannelName}</h3>
                    {isDirectMessage && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        🔒 Dedicated 1-on-1 Mode
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">Project: {activeProject.name} • {activeChannelDesc}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {isDirectMessage && partnerUser ? (
                  <button
                    onClick={() => onStartDirectCall ? onStartDirectCall(partnerUser!) : onStartCall()}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Call Only {partnerUser.name.split(' ')[0]}</span>
                  </button>
                ) : (
                  <button
                    onClick={onStartCall}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-md"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Group Call</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pinned Messages Header Banner */}
            {pinnedMessages.length > 0 && (
              <div className="bg-slate-950 border-b border-indigo-500/30 p-3 text-xs text-indigo-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold uppercase tracking-wider text-[11px] text-indigo-400">
                    <Pin className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Pinned Channel Announcements ({pinnedMessages.length})</span>
                  </div>
                  <button
                    onClick={() => setPinnedHeaderExpanded(!pinnedHeaderExpanded)}
                    className="text-[11px] font-bold text-slate-400 hover:text-slate-200 underline"
                  >
                    {pinnedHeaderExpanded ? 'Hide Pinned' : 'View Pinned'}
                  </button>
                </div>

                {pinnedHeaderExpanded && (
                  <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto pr-1">
                    {pinnedMessages.map((pm) => (
                      <div key={pm.id} className="bg-slate-900/90 border border-indigo-500/20 p-2 rounded-lg text-xs flex justify-between items-start">
                        <div>
                          <span className="font-bold text-slate-200 mr-2">{pm.senderName}:</span>
                          <span className="text-slate-300">{pm.content}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 ml-2 whitespace-nowrap">{pm.sentAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Scroll Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {channelMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 group ${
                    msg.senderId === currentUserId
                      ? 'bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/30'
                      : msg.isPinned
                      ? 'bg-amber-500/5 p-3 rounded-xl border border-amber-500/20'
                      : ''
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-indigo-400 text-xs flex-shrink-0">
                    {msg.senderName.charAt(0)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-200">{msg.senderName}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-semibold">
                        {msg.senderRole}
                      </span>
                      {msg.senderDepartment && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 font-mono">
                          {msg.senderDepartment}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500">{msg.sentAt}</span>
                      {msg.isPinned && (
                        <span className="text-[10px] text-amber-400 font-bold flex items-center space-x-0.5">
                          <Pin className="w-3 h-3 fill-amber-400" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{msg.content}</p>

                    {msg.fileAttachment && (
                      <div className="mt-1 inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-slate-800 text-indigo-400 text-xs border border-slate-700">
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>{msg.fileAttachment}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onTogglePinMessage(activeChannelId, msg.id)}
                    className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                      msg.isPinned ? 'text-amber-400 bg-amber-500/10' : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                    title={msg.isPinned ? 'Unpin message' : 'Pin to channel header'}
                  >
                    <Pin className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {channelMessages.length === 0 && (
                <div className="text-center text-slate-500 text-xs py-12">
                  No messages yet in {activeChannelName}. Type below to send a direct message!
                </div>
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
              {showAttachmentBox && (
                <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800">
                  <Paperclip className="w-4 h-4 text-indigo-400" />
                  <input
                    type="text"
                    placeholder="Attachment file name (e.g. project_spec.pdf)"
                    value={attachmentInput}
                    onChange={(e) => setAttachmentInput(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAttachmentBox(false)}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAttachmentBox(!showAttachmentBox)}
                  className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder={
                    partnerUser
                      ? `Send private message to ${partnerUser.name}...`
                      : `Send message as ${currentUser?.name}...`
                  }
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />

                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
