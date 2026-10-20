'use client';

import React, { useState, useMemo } from 'react';
import { WarRoomState, UserRole } from '@/types';
import { ShieldAlert, Video, VideoOff, Mic, MicOff, Monitor, PhoneOff, Users, AlertTriangle, ShieldCheck, Lock, PhoneCall } from 'lucide-react';

interface WarRoomModalProps {
  warRoomState: WarRoomState;
  currentRole: UserRole;
  onClose: () => void;
}

export const WarRoomModal: React.FC<WarRoomModalProps> = ({
  warRoomState,
  currentRole,
  onClose,
}) => {
  const [isMicMuted, setIsMicMuted] = useState<boolean>(false);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false);

  const isDirectCall = warRoomState.isDirectCall;
  const targetName = warRoomState.callTargetName || 'Pinned Contact';

  const callId = useMemo(() => {
    return isDirectCall
      ? `#CALL-DIRECT-${Math.floor(100000 + Math.random() * 900000)}`
      : `#WAR-${Math.floor(100000 + Math.random() * 900000)}`;
  }, [isDirectCall]);

  // For 1-on-1 calls, filter participants to caller + pinned target
  const displayParticipants = isDirectCall
    ? warRoomState.participants.slice(0, 2)
    : warRoomState.participants;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 overflow-hidden animate-fadeIn">
      {/* Top Banner Header */}
      <div
        className={`border p-4 rounded-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4 ${
          isDirectCall
            ? 'bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-950 border-indigo-500/50'
            : 'bg-gradient-to-r from-red-950 via-red-900 to-rose-950 border-red-500/50'
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg ${
              isDirectCall
                ? 'bg-indigo-600 shadow-indigo-600/40'
                : 'bg-red-600 animate-pulse shadow-red-600/40'
            }`}
          >
            {isDirectCall ? <PhoneCall className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-black text-lg text-white tracking-wide uppercase">
                {isDirectCall
                  ? `🔒 PRIVATE 1-ON-1 CALL WITH ${targetName.toUpperCase()}`
                  : '🚨 EMERGENCY WAR ROOM ACTIVE'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono">
                {isDirectCall ? 'PINNED CONTACT DIRECT MODE' : 'BYPASS NOTIFICATIONS'}
              </span>
            </div>
            <p className={`text-xs ${isDirectCall ? 'text-indigo-200' : 'text-red-200'}`}>
              Initiated by: <strong>{warRoomState.triggeredBy}</strong> • {warRoomState.reason}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 text-xs text-slate-300 bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-800">
            <Users className="w-4 h-4 text-indigo-400 mr-1" />
            <span>{displayParticipants.length} Connected in Call</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center space-x-1.5"
          >
            <PhoneOff className="w-4 h-4" />
            <span>END CALL</span>
          </button>
        </div>
      </div>

      {/* Center WebRTC Video Grid */}
      <div
        className={`my-4 flex-1 grid gap-4 overflow-y-auto ${
          isDirectCall ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {displayParticipants.map((participant, idx) => (
          <div
            key={participant.id}
            className={`relative rounded-2xl overflow-hidden border bg-slate-900 flex flex-col justify-between p-4 shadow-2xl min-h-65 transition-all ${
              participant.isScreenSharing
                ? 'col-span-1 md:col-span-2 border-indigo-500 shadow-indigo-500/20'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Simulated Live Video Feed Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-950/80 to-slate-950 z-0" />

            {participant.isScreenSharing ? (
              <div className="absolute inset-0 bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <Monitor className="w-12 h-12 text-indigo-400 animate-pulse" />
                <span className="font-bold text-sm text-slate-200">
                  {participant.name} is sharing screen in private call
                </span>
                <span className="text-xs text-indigo-300 font-mono">1080p • Encrypted Direct Stream</span>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col items-center justify-center h-full my-auto space-y-2">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-slate-800 to-indigo-950 border-2 border-indigo-500/40 flex items-center justify-center text-2xl font-bold text-indigo-300 shadow-xl">
                    {participant.name.charAt(0)}
                  </div>
                  {participant.hasVideo && (
                    <span className="w-4 h-4 rounded-full bg-emerald-400 absolute bottom-1 right-1 border-2 border-slate-900 animate-pulse"></span>
                  )}
                </div>
                <span className="font-bold text-base text-slate-100">{participant.name}</span>
                <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                  {participant.role} {idx === 0 ? '(You)' : '(Pinned Contact)'}
                </span>
              </div>
            )}

            {/* Stream Participant Footer */}
            <div className="relative z-10 flex justify-between items-center bg-slate-950/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-800/80 mt-auto">
              <span className="text-xs font-bold text-slate-200 flex items-center space-x-1">
                <span>{participant.name}</span>
                {participant.isScreenSharing && <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">SCREEN</span>}
              </span>

              <div className="flex items-center space-x-2">
                {participant.isMuted ? (
                  <MicOff className="w-4 h-4 text-red-400" />
                ) : (
                  <Mic className="w-4 h-4 text-emerald-400" />
                )}
                {participant.hasVideo ? (
                  <Video className="w-4 h-4 text-indigo-400" />
                ) : (
                  <VideoOff className="w-4 h-4 text-slate-500" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Media Controls Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs text-slate-300 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isDirectCall ? `Direct 1-on-1 Stream with ${targetName}` : 'Encrypted WebRTC Channel Active'}</span>
        </div>

        {/* Media Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`p-3 rounded-2xl transition-all shadow-lg ${
              isMicMuted
                ? 'bg-red-600 text-white shadow-red-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`p-3 rounded-2xl transition-all shadow-lg ${
              !isVideoOn
                ? 'bg-red-600 text-white shadow-red-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isVideoOn ? <Video className="w-5 h-5 text-indigo-400" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            className={`p-3 rounded-2xl transition-all shadow-lg ${
              isScreenSharing
                ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
            title="Toggle Screen Share"
          >
            <Monitor className="w-5 h-5 text-indigo-400" />
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-xs shadow-xl shadow-red-600/30 transition-all flex items-center space-x-2"
          >
            <PhoneOff className="w-5 h-5" />
            <span>DISCONNECT</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          {callId}
        </div>
      </div>
    </div>
  );
};
