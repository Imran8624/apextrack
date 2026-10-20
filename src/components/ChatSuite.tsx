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
    <div className="bg-[#161e2e] border border-[#232f3e] rounded-lg shadow-sm h-[620px] flex overflow-hidden w-full min-w-0">
      {/* Sidebar: Topic Channels & Pinned Contacts */}
      <div className="w-60 sm:w-68 bg-[#0f141c] border-r border-[#232f3e] flex flex-col justify-between p-3 flex-shrink-0 min-w-0">
        <div className="space-y-3 overflow-y-auto pr-1 min-w-0">
          {/* Working Project Context Tag */}
          <div className="bg-[#161e2e] border border-[#232f3e] p-2 rounded-md flex items-center space-x-2 min-w-0">
            <FolderGit2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <div className="truncate text-xs min-w-0">
              <span className="text-[9px] text-slate-400 uppercase font-semibold block">Current Project</span>
              <span className="font-semibold text-slate-200 truncate block text-xs">{activeProject.name}</span>
            </div>
          </div>

          {/* Active Sender Profile Card */}
          <div className="bg-[#161e2e] border border-[#232f3e] p-2 rounded-md text-xs flex items-center space-x-2 min-w-0">
            <div className="w-7 h-7 rounded-md bg-[#232f3e] border border-[#2d3748] flex items-center justify-center font-bold text-blue-300 text-xs flex-shrink-0">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="truncate min-w-0">
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">Logged In As:</span>
              <span className="font-bold text-slate-200 truncate block text-xs">{currentUser?.name}</span>
              <span className="text-[9px] text-blue-400 block truncate">{currentUser?.jobTitle || currentUser?.department}</span>
            </div>
          </div>

          {/* Manager / TL Database Audit Vault Switcher Button */}
          {isManagerOrLead ? (
            <button
              onClick={() => setChatViewMode(chatViewMode === 'messages' ? 'database' : 'messages')}
              className={`w-full py-1.5 px-2.5 rounded-md text-xs font-semibold border transition-colors flex items-center justify-center space-x-1.5 ${
                chatViewMode === 'database'
                  ? 'bg-[#232f3e] text-amber-300 border-amber-600/70'
                  : 'bg-[#161e2e] text-slate-300 border-[#232f3e] hover:text-white'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span>{chatViewMode === 'database' ? 'Return to Chat' : 'Database Audit Vault'}</span>
            </button>
          ) : (
            <div className="bg-[#161e2e] p-1.5 rounded-md border border-[#232f3e] text-[10px] text-slate-400 flex items-center space-x-1.5">
              <Lock className="w-3 h-3 text-slate-500 flex-shrink-0" />
              <span>Audit Vault: Restricted</span>
            </div>
          )}

          {/* Section 1: Topic Channels */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              <span>Topic Channels</span>
              <span className="text-[9px] bg-[#161e2e] text-slate-400 px-1.5 py-0.2 rounded font-mono">{channels.filter(c => !c.isDirectMessage).length}</span>
            </div>

            <div className="space-y-0.5">
              {channels.filter(c => !c.isDirectMessage).map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => {
                    onSelectChannel(channel.id);
                    setChatViewMode('messages');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    activeChannelId === channel.id && chatViewMode === 'messages'
                      ? channel.isEmergency
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                        : 'bg-[#232f3e] text-white border border-[#3b82f6]/40'
                      : channel.isEmergency
                      ? 'text-rose-400 hover:bg-[#161e2e]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#161e2e]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {channel.isEmergency ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    ) : (
                      <Hash className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{channel.name}</span>
                  </div>

                  {channel.pinnedMessageCount > 0 && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#161e2e] text-blue-400 font-mono flex items-center space-x-0.5">
                      <Pin className="w-2.5 h-2.5" />
                      <span>{channel.pinnedMessageCount}</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Pinned Contacts */}
          {pinnedUsers.length > 0 && (
            <div>
              <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-amber-400 mb-1.5 px-1">
                <span className="flex items-center space-x-1">
                  <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Pinned Leads & Experts</span>
                </span>
                <span className="text-[9px] bg-amber-950/60 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                  {pinnedUsers.length}
                </span>
              </div>

              <div className="space-y-1">
                {pinnedUsers.map((user) => {
                  const dmChannelId = getDMChannelId(currentUserId, user.id);
                  const isSelected = activeChannelId === dmChannelId && chatViewMode === 'messages';
                  return (
                    <div
                      key={user.id}
                      className={`p-1.5 rounded-md border transition-colors space-y-1 ${
                        isSelected
                          ? 'bg-[#152336] border-blue-600/70 text-white'
                          : 'bg-[#161e2e] border-[#232f3e] text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => {
                            onSelectChannel(dmChannelId);
                            setChatViewMode('messages');
                          }}
                          className="flex items-center space-x-2 truncate flex-1 text-left"
                        >
                          <div className="relative flex-shrink-0">
                            <div className="w-6 h-6 rounded bg-[#232f3e] flex items-center justify-center font-bold text-amber-300 text-[10px] border border-amber-800/40">
                              {user.name.charAt(0)}
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute bottom-0 right-0 border border-slate-950"></span>
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-xs text-slate-100 truncate">{user.name}</p>
                            <p className="text-[9px] text-slate-400 truncate">{user.jobTitle || user.department}</p>
                          </div>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePinUserDM(user.id);
                          }}
                          className="p-1 rounded text-amber-400 hover:text-rose-400 transition-colors"
                          title="Unpin contact"
                        >
                          <Pin className="w-3 h-3 fill-amber-400" />
                        </button>
                      </div>

                      <button
                        onClick={() => onStartDirectCall ? onStartDirectCall(user) : onStartCall()}
                        className="w-full py-0.5 px-1.5 rounded bg-[#0f141c] hover:bg-[#232f3e] border border-[#232f3e] text-amber-300 text-[10px] font-semibold flex items-center justify-center space-x-1 transition-colors"
                      >
                        <PhoneCall className="w-3 h-3 text-amber-400" />
                        <span>Direct Call</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 3: All Direct Team Contacts */}
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
              Direct Team Contacts
            </div>

            <div className="space-y-0.5">
              {unpinnedUsers.map((user) => {
                const dmChannelId = getDMChannelId(currentUserId, user.id);
                const isSelected = activeChannelId === dmChannelId && chatViewMode === 'messages';
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between px-2 py-1 rounded-md border transition-colors ${
                      isSelected
                        ? 'bg-[#232f3e] text-white border-[#3b82f6]/40'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#161e2e]'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectChannel(dmChannelId);
                        setChatViewMode('messages');
                      }}
                      className="flex items-center space-x-2 truncate flex-1 text-left"
                    >
                      <div className="w-6 h-6 rounded bg-[#232f3e] flex items-center justify-center font-bold text-blue-300 text-[10px] flex-shrink-0 border border-[#2d3748]">
                        {user.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <p className={`font-medium text-xs truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
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
                      <Pin className="w-3 h-3" />
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
          className="w-full py-1.5 rounded-md bg-[#232f3e] hover:bg-[#2d3748] text-slate-200 text-xs font-semibold border border-[#2d3748] flex items-center justify-center space-x-1.5 transition-colors mt-2"
        >
          <Video className="w-3.5 h-3.5 text-blue-400" />
          <span>Group War Room Call</span>
        </button>
      </div>

      {/* Main Right Area: Messages Feed OR Manager/TL Database Audit Vault */}
      <div className="flex-1 flex flex-col justify-between bg-[#161e2e] min-w-0">
        {chatViewMode === 'database' && isManagerOrLead ? (
          /* MANAGER & TEAM LEAD DATABASE AUDIT VAULT */
          <div className="p-4 space-y-3 h-full flex flex-col justify-between overflow-y-auto min-w-0">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between border-b border-[#232f3e] pb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-md bg-[#232f3e] text-amber-400 border border-[#2d3748] flex items-center justify-center font-bold">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm flex items-center space-x-2">
                      <span>Communication Database & Audit Vault</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 font-mono">
                        PostgreSQL Prisma
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">Raw database table view for managers and team leads</p>
                  </div>
                </div>

                <div className="flex bg-[#0f141c] p-0.5 rounded-md border border-[#232f3e] text-xs font-semibold">
                  <button
                    onClick={() => setSelectedDbTable('messages')}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      selectedDbTable === 'messages' ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Messages ({allDatabaseMessages.length})
                  </button>
                  <button
                    onClick={() => setSelectedDbTable('channels')}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      selectedDbTable === 'channels' ? 'bg-[#232f3e] text-white border border-[#3b82f6]/40' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Channels ({channels.length})
                  </button>
                </div>
              </div>

              {selectedDbTable === 'messages' && (
                <div className="space-y-2 min-w-0">
                  <div className="text-[11px] font-mono text-slate-400 flex justify-between items-center bg-[#0f141c] p-2 rounded-md border border-[#232f3e] truncate">
                    <span className="truncate">SELECT * FROM &quot;Message&quot; WHERE channelId = &apos;{activeChannelId}&apos; ORDER BY sentAt DESC;</span>
                    <span className="text-emerald-400 font-bold shrink-0 ml-2">200 OK (0.4ms)</span>
                  </div>

                  <div className="bg-[#0f141c] border border-[#232f3e] rounded-md overflow-x-auto max-h-[350px]">
                    <table className="w-full text-left text-xs font-mono text-slate-300">
                      <thead className="bg-[#161e2e] border-b border-[#232f3e] text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Message ID</th>
                          <th className="p-2.5">Channel</th>
                          <th className="p-2.5">Sender</th>
                          <th className="p-2.5">Role</th>
                          <th className="p-2.5">Content</th>
                          <th className="p-2.5">Sent At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#232f3e]">
                        {allDatabaseMessages.map((m) => (
                          <tr key={m.id} className="hover:bg-[#161e2e]/60">
                            <td className="p-2.5 text-blue-400">{m.id}</td>
                            <td className="p-2.5 text-slate-400">{m.channelId}</td>
                            <td className="p-2.5 font-semibold text-slate-200">{m.senderName}</td>
                            <td className="p-2.5"><span className="px-1.5 py-0.2 bg-[#232f3e] rounded text-[9px] text-slate-300">{m.senderRole}</span></td>
                            <td className="p-2.5 text-slate-300 max-w-xs truncate">{m.content}</td>
                            <td className="p-2.5 text-slate-400">{m.sentAt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedDbTable === 'channels' && (
                <div className="space-y-2 min-w-0">
                  <div className="text-[11px] font-mono text-slate-400 flex justify-between items-center bg-[#0f141c] p-2 rounded-md border border-[#232f3e] truncate">
                    <span className="truncate">SELECT * FROM &quot;Channel&quot; ORDER BY createdAt ASC;</span>
                    <span className="text-emerald-400 font-bold shrink-0 ml-2">200 OK (0.2ms)</span>
                  </div>

                  <div className="bg-[#0f141c] border border-[#232f3e] rounded-md overflow-x-auto max-h-[350px]">
                    <table className="w-full text-left text-xs font-mono text-slate-300">
                      <thead className="bg-[#161e2e] border-b border-[#232f3e] text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Channel ID</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Type</th>
                          <th className="p-2.5">Members</th>
                          <th className="p-2.5">Pinned</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#232f3e]">
                        {channels.map((c) => (
                          <tr key={c.id} className="hover:bg-[#161e2e]/60">
                            <td className="p-2.5 text-blue-400">{c.id}</td>
                            <td className="p-2.5 font-semibold text-slate-200">{c.name}</td>
                            <td className="p-2.5">{c.isDirectMessage ? <span className="text-purple-300">1-ON-1</span> : c.isEmergency ? <span className="text-rose-400">EMERGENCY</span> : <span className="text-slate-400">PUBLIC</span>}</td>
                            <td className="p-2.5 text-slate-300">{c.membersCount}</td>
                            <td className="p-2.5 text-amber-300 font-semibold">{c.pinnedMessageCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-[#232f3e] flex justify-between items-center">
              <button
                onClick={() => setChatViewMode('messages')}
                className="px-3 py-1.5 rounded-md bg-[#0f141c] hover:bg-[#232f3e] text-slate-300 border border-[#232f3e] text-xs font-semibold transition-colors"
              >
                Close Database View
              </button>
              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Audited DB Logs Encrypted under Role: {currentRole}</span>
              </span>
            </div>
          </div>
        ) : (
          /* REGULAR CHAT FEED VIEW */
          <>
            {/* Header Bar */}
            <div className="p-3 border-b border-[#232f3e] flex items-center justify-between bg-[#0f141c] min-w-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-1.5 rounded bg-[#161e2e] text-blue-400 border border-[#232f3e] shrink-0">
                  {isDirectMessage ? (
                    <Lock className="w-4 h-4 text-amber-400" />
                  ) : activeChannelId === 'c-3' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Hash className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-100 text-xs truncate">{activeChannelName}</h3>
                    {isDirectMessage && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/50 shrink-0">
                        1-on-1 Mode
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate">Project: {activeProject.name} • {activeChannelDesc}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {isDirectMessage && partnerUser ? (
                  <button
                    onClick={() => onStartDirectCall ? onStartDirectCall(partnerUser!) : onStartCall()}
                    className="px-3 py-1.5 rounded-md bg-[#232f3e] hover:bg-[#2d3748] text-amber-300 border border-amber-800/60 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call {partnerUser.name.split(' ')[0]}</span>
                  </button>
                ) : (
                  <button
                    onClick={onStartCall}
                    className="px-3 py-1.5 rounded-md bg-[#232f3e] hover:bg-[#2d3748] text-slate-200 border border-[#2d3748] text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-blue-400" />
                    <span>Start Group Call</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pinned Messages Header Banner */}
            {pinnedMessages.length > 0 && (
              <div className="bg-[#0f141c] border-b border-[#232f3e] p-2.5 text-xs text-slate-300 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-semibold uppercase tracking-wider text-[10px] text-blue-400">
                    <Pin className="w-3 h-3 text-blue-400" />
                    <span>Pinned Channel Announcements ({pinnedMessages.length})</span>
                  </div>
                  <button
                    onClick={() => setPinnedHeaderExpanded(!pinnedHeaderExpanded)}
                    className="text-[10px] font-semibold text-slate-400 hover:text-slate-200"
                  >
                    {pinnedHeaderExpanded ? 'Hide Pinned' : 'View Pinned'}
                  </button>
                </div>

                {pinnedHeaderExpanded && (
                  <div className="mt-1.5 space-y-1 max-h-24 overflow-y-auto pr-1">
                    {pinnedMessages.map((pm) => (
                      <div key={pm.id} className="bg-[#161e2e] border border-[#232f3e] p-1.5 rounded text-xs flex justify-between items-start min-w-0">
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-200 mr-1.5 text-xs">{pm.senderName}:</span>
                          <span className="text-slate-300 text-xs break-words">{pm.content}</span>
                        </div>
                        <span className="text-[9px] text-slate-500 ml-2 whitespace-nowrap shrink-0">{pm.sentAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Scroll Feed */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 min-w-0">
              {channelMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 group p-2 rounded-md border min-w-0 ${
                    msg.senderId === currentUserId
                      ? 'bg-[#121c2c] border-blue-900/60'
                      : msg.isPinned
                      ? 'bg-[#1a1712] border-amber-900/50'
                      : 'bg-[#0f141c] border-[#232f3e]'
                  }`}
                >
                  <div className="w-6 h-6 rounded bg-[#232f3e] border border-[#2d3748] flex items-center justify-center font-bold text-blue-300 text-[10px] flex-shrink-0 mt-0.5">
                    {msg.senderName.charAt(0)}
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center space-x-2">
                      <span className="font-bold text-xs text-slate-200">{msg.senderName}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-[#232f3e] text-slate-400 font-mono">
                        {msg.senderRole}
                      </span>
                      {msg.senderDepartment && (
                        <span className="text-[9px] text-slate-400 font-mono">
                          {msg.senderDepartment}
                        </span>
                      )}
                      <span className="text-[9px] text-slate-500 font-mono">{msg.sentAt}</span>
                      {msg.isPinned && (
                        <span className="text-[9px] text-amber-400 font-bold flex items-center space-x-0.5">
                          <Pin className="w-2.5 h-2.5 fill-amber-400" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed break-words">{msg.content}</p>

                    {msg.fileAttachment && (
                      <div className="mt-1 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#161e2e] text-blue-400 text-[11px] border border-[#232f3e]">
                        <Paperclip className="w-3 h-3" />
                        <span className="break-words">{msg.fileAttachment}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onTogglePinMessage(activeChannelId, msg.id)}
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                      msg.isPinned ? 'text-amber-400' : 'text-slate-500 hover:text-slate-200'
                    }`}
                    title={msg.isPinned ? 'Unpin message' : 'Pin to channel header'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {channelMessages.length === 0 && (
                <div className="text-center text-slate-500 text-xs py-12">
                  No messages yet in {activeChannelName}. Type below to send a message.
                </div>
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-[#232f3e] bg-[#0f141c] space-y-2">
              {showAttachmentBox && (
                <div className="flex items-center space-x-2 bg-[#161e2e] p-2 rounded-md border border-[#232f3e]">
                  <Paperclip className="w-3.5 h-3.5 text-blue-400" />
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
                    className="text-xs text-slate-400 hover:text-slate-200 px-1"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAttachmentBox(!showAttachmentBox)}
                  className="p-2 rounded-md bg-[#161e2e] hover:bg-[#232f3e] text-slate-400 hover:text-slate-200 border border-[#232f3e] transition-colors"
                >
                  <Paperclip className="w-3.5 h-3.5" />
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
                  className="flex-1 bg-[#161e2e] border border-[#232f3e] rounded-md px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 outline-none"
                />

                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-md bg-[#ec7211] hover:bg-[#eb5f07] text-[#0f141c] font-bold transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
