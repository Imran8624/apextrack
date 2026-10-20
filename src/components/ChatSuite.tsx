'use client';

import React, { useState } from 'react';
import { Channel, Message, User, UserRole, Project } from '@/types';
import { getDMChannelId } from '@/lib/mockData';
import { Pin, Send, Paperclip, Video, Hash, ShieldAlert, FolderGit2, Lock, PhoneCall, Database, ShieldCheck } from 'lucide-react';

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
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs h-[620px] flex overflow-hidden w-full min-w-0">
      {/* Sidebar: Topic Channels & Pinned Contacts */}
      <div className="w-60 sm:w-68 bg-slate-50 border-r border-slate-200 flex flex-col justify-between p-3 flex-shrink-0 min-w-0">
        <div className="space-y-3 overflow-y-auto pr-1 min-w-0">
          {/* Working Project Context Tag */}
          <div className="bg-white border border-slate-200 p-2 rounded-lg flex items-center space-x-2 min-w-0 shadow-xs">
            <FolderGit2 className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <div className="truncate text-xs min-w-0">
              <span className="text-[9px] text-slate-400 uppercase font-semibold block">Current Project</span>
              <span className="font-semibold text-slate-800 truncate block text-xs">{activeProject.name}</span>
            </div>
          </div>

          {/* Active Sender Profile Card */}
          <div className="bg-white border border-slate-200 p-2 rounded-lg text-xs flex items-center space-x-2 min-w-0 shadow-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs flex-shrink-0">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="truncate min-w-0">
              <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider block">Logged In As:</span>
              <span className="font-bold text-slate-900 truncate block text-xs">{currentUser?.name}</span>
              <span className="text-[9px] text-indigo-600 font-medium block truncate">{currentUser?.jobTitle || currentUser?.department}</span>
            </div>
          </div>

          {/* Manager / TL Database Audit Vault Switcher Button */}
          {isManagerOrLead ? (
            <button
              onClick={() => setChatViewMode(chatViewMode === 'messages' ? 'database' : 'messages')}
              className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center space-x-1.5 shadow-xs ${
                chatViewMode === 'database'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:text-indigo-600 hover:bg-slate-50'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-amber-600" />
              <span>{chatViewMode === 'database' ? 'Return to Chat' : 'Database Audit Vault'}</span>
            </button>
          ) : (
            <div className="bg-white p-1.5 rounded-lg border border-slate-200 text-[10px] text-slate-500 flex items-center space-x-1.5">
              <Lock className="w-3 h-3 text-slate-400 flex-shrink-0" />
              <span>Audit Vault: Restricted</span>
            </div>
          )}

          {/* Section 1: Topic Channels */}
          <div>
            <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 px-1">
              <span>Topic Channels</span>
              <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono font-semibold">{channels.filter(c => !c.isDirectMessage).length}</span>
            </div>

            <div className="space-y-0.5">
              {channels.filter(c => !c.isDirectMessage).map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => {
                    onSelectChannel(channel.id);
                    setChatViewMode('messages');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeChannelId === channel.id && chatViewMode === 'messages'
                      ? channel.isEmergency
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 font-semibold'
                        : 'bg-white text-indigo-700 border border-slate-200 shadow-xs font-semibold'
                      : channel.isEmergency
                      ? 'text-rose-600 hover:bg-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {channel.isEmergency ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                    ) : (
                      <Hash className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    )}
                    <span className="truncate">{channel.name}</span>
                  </div>

                  {channel.pinnedMessageCount > 0 && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 font-mono font-semibold flex items-center space-x-0.5">
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
              <div className="flex justify-between items-center text-[10px] font-semibold uppercase tracking-wider text-amber-700 mb-1.5 px-1">
                <span className="flex items-center space-x-1">
                  <Pin className="w-3 h-3 text-amber-600 fill-amber-600" />
                  <span>Pinned Leads & Experts</span>
                </span>
                <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono font-semibold">
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
                      className={`p-2 rounded-lg border transition-colors space-y-1.5 shadow-xs ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-300 text-indigo-950'
                          : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
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
                            <div className="w-6 h-6 rounded-md bg-amber-50 flex items-center justify-center font-bold text-amber-700 text-[10px] border border-amber-200">
                              {user.name.charAt(0)}
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute bottom-0 right-0 border border-white"></span>
                          </div>
                          <div className="truncate">
                            <p className="font-semibold text-xs text-slate-900 truncate">{user.name}</p>
                            <p className="text-[9px] text-slate-500 truncate">{user.jobTitle || user.department}</p>
                          </div>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePinUserDM(user.id);
                          }}
                          className="p-1 rounded text-amber-500 hover:text-rose-500 transition-colors"
                          title="Unpin contact"
                        >
                          <Pin className="w-3 h-3 fill-amber-500" />
                        </button>
                      </div>

                      <button
                        onClick={() => onStartDirectCall ? onStartDirectCall(user) : onStartCall()}
                        className="w-full py-0.5 px-1.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold flex items-center justify-center space-x-1 transition-colors"
                      >
                        <PhoneCall className="w-3 h-3 text-indigo-600" />
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
            <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5 px-1">
              Direct Team Contacts
            </div>

            <div className="space-y-0.5">
              {unpinnedUsers.map((user) => {
                const dmChannelId = getDMChannelId(currentUserId, user.id);
                const isSelected = activeChannelId === dmChannelId && chatViewMode === 'messages';
                return (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between px-2 py-1 rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-white text-indigo-700 border-slate-200 shadow-xs font-semibold'
                        : 'bg-transparent border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <button
                      onClick={() => {
                        onSelectChannel(dmChannelId);
                        setChatViewMode('messages');
                      }}
                      className="flex items-center space-x-2 truncate flex-1 text-left"
                    >
                      <div className="w-6 h-6 rounded-md bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-[10px] flex-shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="truncate">
                        <p className={`font-medium text-xs truncate ${isSelected ? 'text-indigo-900 font-semibold' : 'text-slate-800'}`}>
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
                      className="p-1 rounded text-slate-400 hover:text-amber-500 transition-colors ml-1"
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
          className="w-full py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs flex items-center justify-center space-x-1.5 transition-colors mt-2"
        >
          <Video className="w-3.5 h-3.5 text-indigo-600" />
          <span>Group War Room Call</span>
        </button>
      </div>

      {/* Main Right Area: Messages Feed OR Manager/TL Database Audit Vault */}
      <div className="flex-1 flex flex-col justify-between bg-white min-w-0">
        {chatViewMode === 'database' && isManagerOrLead ? (
          /* MANAGER & TEAM LEAD DATABASE AUDIT VAULT */
          <div className="p-4 space-y-3 h-full flex flex-col justify-between overflow-y-auto min-w-0 bg-slate-50">
            <div className="space-y-3 min-w-0">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold shadow-xs">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <span>Communication Database & Audit Vault</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-200 font-mono font-semibold">
                        PostgreSQL Prisma
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500">Raw database table view for managers and team leads</p>
                  </div>
                </div>

                <div className="flex bg-white p-0.5 rounded-lg border border-slate-200 text-xs font-semibold shadow-xs">
                  <button
                    onClick={() => setSelectedDbTable('messages')}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      selectedDbTable === 'messages' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Messages ({allDatabaseMessages.length})
                  </button>
                  <button
                    onClick={() => setSelectedDbTable('channels')}
                    className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                      selectedDbTable === 'channels' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Channels ({channels.length})
                  </button>
                </div>
              </div>

              {selectedDbTable === 'messages' && (
                <div className="space-y-2 min-w-0">
                  <div className="text-[11px] font-mono text-slate-600 flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 shadow-xs truncate">
                    <span className="truncate">SELECT * FROM &quot;Message&quot; WHERE channelId = &apos;{activeChannelId}&apos; ORDER BY sentAt DESC;</span>
                    <span className="text-emerald-600 font-bold shrink-0 ml-2">200 OK (0.4ms)</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto max-h-[350px] shadow-xs">
                    <table className="w-full text-left text-xs font-mono text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Message ID</th>
                          <th className="p-2.5">Channel</th>
                          <th className="p-2.5">Sender</th>
                          <th className="p-2.5">Role</th>
                          <th className="p-2.5">Content</th>
                          <th className="p-2.5">Sent At</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {allDatabaseMessages.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="p-2.5 text-indigo-600 font-semibold">{m.id}</td>
                            <td className="p-2.5 text-slate-500">{m.channelId}</td>
                            <td className="p-2.5 font-semibold text-slate-800">{m.senderName}</td>
                            <td className="p-2.5"><span className="px-1.5 py-0.2 bg-slate-100 rounded text-[9px] text-slate-700 font-semibold">{m.senderRole}</span></td>
                            <td className="p-2.5 text-slate-700 max-w-xs truncate">{m.content}</td>
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
                  <div className="text-[11px] font-mono text-slate-600 flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200 shadow-xs truncate">
                    <span className="truncate">SELECT * FROM &quot;Channel&quot; ORDER BY createdAt ASC;</span>
                    <span className="text-emerald-600 font-bold shrink-0 ml-2">200 OK (0.2ms)</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto max-h-[350px] shadow-xs">
                    <table className="w-full text-left text-xs font-mono text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px]">
                        <tr>
                          <th className="p-2.5">Channel ID</th>
                          <th className="p-2.5">Name</th>
                          <th className="p-2.5">Type</th>
                          <th className="p-2.5">Members</th>
                          <th className="p-2.5">Pinned</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {channels.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="p-2.5 text-indigo-600 font-semibold">{c.id}</td>
                            <td className="p-2.5 font-semibold text-slate-800">{c.name}</td>
                            <td className="p-2.5">{c.isDirectMessage ? <span className="text-purple-700 font-semibold">1-ON-1</span> : c.isEmergency ? <span className="text-rose-600 font-semibold">EMERGENCY</span> : <span className="text-slate-500">PUBLIC</span>}</td>
                            <td className="p-2.5 text-slate-600">{c.membersCount}</td>
                            <td className="p-2.5 text-amber-700 font-semibold">{c.pinnedMessageCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => setChatViewMode('messages')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition-colors"
              >
                Close Database View
              </button>
              <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Audited DB Logs Encrypted under Role: {currentRole}</span>
              </span>
            </div>
          </div>
        ) : (
          /* REGULAR CHAT FEED VIEW */
          <>
            {/* Header Bar */}
            <div className="p-3 border-b border-slate-200 flex items-center justify-between bg-white min-w-0">
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 shrink-0 shadow-xs">
                  {isDirectMessage ? (
                    <Lock className="w-4 h-4 text-amber-600" />
                  ) : activeChannelId === 'c-3' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                  ) : (
                    <Hash className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-xs truncate">{activeChannelName}</h3>
                    {isDirectMessage && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold shrink-0">
                        1-on-1 Mode
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">Project: {activeProject.name} • {activeChannelDesc}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                {isDirectMessage && partnerUser ? (
                  <button
                    onClick={() => onStartDirectCall ? onStartDirectCall(partnerUser!) : onStartCall()}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                    <span>Call {partnerUser.name.split(' ')[0]}</span>
                  </button>
                ) : (
                  <button
                    onClick={onStartCall}
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Start Group Call</span>
                  </button>
                )}
              </div>
            </div>

            {/* Pinned Messages Header Banner */}
            {pinnedMessages.length > 0 && (
              <div className="bg-indigo-50/50 border-b border-indigo-100 p-2.5 text-xs text-slate-700 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 font-semibold uppercase tracking-wider text-[10px] text-indigo-700">
                    <Pin className="w-3 h-3 text-indigo-600" />
                    <span>Pinned Channel Announcements ({pinnedMessages.length})</span>
                  </div>
                  <button
                    onClick={() => setPinnedHeaderExpanded(!pinnedHeaderExpanded)}
                    className="text-[10px] font-semibold text-slate-500 hover:text-slate-800"
                  >
                    {pinnedHeaderExpanded ? 'Hide Pinned' : 'View Pinned'}
                  </button>
                </div>

                {pinnedHeaderExpanded && (
                  <div className="mt-1.5 space-y-1 max-h-24 overflow-y-auto pr-1">
                    {pinnedMessages.map((pm) => (
                      <div key={pm.id} className="bg-white border border-slate-200 p-1.5 rounded-md text-xs flex justify-between items-start min-w-0 shadow-xs">
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 mr-1.5 text-xs">{pm.senderName}:</span>
                          <span className="text-slate-700 text-xs break-words">{pm.content}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 ml-2 whitespace-nowrap shrink-0">{pm.sentAt}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Messages Scroll Feed */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 min-w-0 bg-slate-50/50">
              {channelMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 group p-2.5 rounded-lg border min-w-0 shadow-xs ${
                    msg.senderId === currentUserId
                      ? 'bg-indigo-50/70 border-indigo-200'
                      : msg.isPinned
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="w-6 h-6 rounded-md bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {msg.senderName.charAt(0)}
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900">{msg.senderName}</span>
                      <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono font-semibold">
                        {msg.senderRole}
                      </span>
                      {msg.senderDepartment && (
                        <span className="text-[9px] text-slate-500 font-mono">
                          {msg.senderDepartment}
                        </span>
                      )}
                      <span className="text-[9px] text-slate-400 font-mono">{msg.sentAt}</span>
                      {msg.isPinned && (
                        <span className="text-[9px] text-amber-700 font-bold flex items-center space-x-0.5">
                          <Pin className="w-2.5 h-2.5 fill-amber-600 text-amber-600" />
                          <span>Pinned</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed break-words">{msg.content}</p>

                    {msg.fileAttachment && (
                      <div className="mt-1 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[11px] border border-indigo-200 font-medium">
                        <Paperclip className="w-3 h-3" />
                        <span className="break-words">{msg.fileAttachment}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onTogglePinMessage(activeChannelId, msg.id)}
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                      msg.isPinned ? 'text-amber-600' : 'text-slate-400 hover:text-slate-700'
                    }`}
                    title={msg.isPinned ? 'Unpin message' : 'Pin to channel header'}
                  >
                    <Pin className="w-3 h-3" />
                  </button>
                </div>
              ))}

              {channelMessages.length === 0 && (
                <div className="text-center text-slate-400 text-xs py-12 italic">
                  No messages yet in {activeChannelName}. Type below to send a message.
                </div>
              )}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white space-y-2">
              {showAttachmentBox && (
                <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                  <input
                    type="text"
                    placeholder="Attachment file name (e.g. project_spec.pdf)"
                    value={attachmentInput}
                    onChange={(e) => setAttachmentInput(e.target.value)}
                    className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAttachmentBox(false)}
                    className="text-xs text-slate-400 hover:text-slate-600 px-1 font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAttachmentBox(!showAttachmentBox)}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors shadow-xs"
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
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white outline-none"
                />

                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs transition-colors"
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
