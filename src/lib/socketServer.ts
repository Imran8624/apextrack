import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';

export interface ServerToClientEvents {
  'message:received': (message: any) => void;
  'message:pinned': (data: { channelId: string; messageId: string; isPinned: boolean }) => void;
  'report:submitted': (report: any) => void;
  'deadline:recalculated': (data: { projectId: string; calculatedFinishDate: string; velocity: number; riskStatus: string }) => void;
  'warroom:alert': (data: { triggeredBy: string; reason: string; channelId: string; timestamp: string }) => void;
  'webrtc:signal': (data: { senderId: string; signal: any }) => void;
}

export interface ClientToServerEvents {
  'join:channel': (channelId: string) => void;
  'leave:channel': (channelId: string) => void;
  'send:message': (data: { channelId: string; senderId: string; content: string; fileAttachment?: string }) => void;
  'pin:message': (data: { channelId: string; messageId: string; isPinned: boolean }) => void;
  'trigger:warroom': (data: { triggeredBy: string; reason: string }) => void;
  'webrtc:signal': (data: { targetUserId: string; signal: any }) => void;
}

export function initSocketServer(httpServer: HTTPServer): SocketIOServer {
  const io = new SocketIOServer<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`⚡ Socket client connected: ${socket.id}`);

    // Join channel topic
    socket.on('join:channel', (channelId: string) => {
      socket.join(`channel:${channelId}`);
      console.log(`Socket ${socket.id} joined channel:${channelId}`);
    });

    // Leave channel topic
    socket.on('leave:channel', (channelId: string) => {
      socket.leave(`channel:${channelId}`);
    });

    // Handle incoming chat message
    socket.on('send:message', (data) => {
      const formattedMessage = {
        id: `msg-${Date.now()}`,
        channelId: data.channelId,
        senderId: data.senderId,
        content: data.content,
        fileAttachment: data.fileAttachment,
        sentAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isPinned: false
      };

      // Broadcast to channel members
      io.to(`channel:${data.channelId}`).emit('message:received', formattedMessage);
    });

    // Handle pinning message
    socket.on('pin:message', (data) => {
      io.to(`channel:${data.channelId}`).emit('message:pinned', data);
    });

    // Emergency War Room Trigger (Bypasses notification settings)
    socket.on('trigger:warroom', (data) => {
      console.warn(`🚨 WAR ROOM TRIGGERED BY ${data.triggeredBy}: ${data.reason}`);
      io.emit('warroom:alert', {
        triggeredBy: data.triggeredBy,
        reason: data.reason,
        channelId: 'c-3',
        timestamp: new Date().toISOString()
      });
    });

    // WebRTC P2P Signaling Relay
    socket.on('webrtc:signal', (data) => {
      socket.broadcast.emit('webrtc:signal', {
        senderId: socket.id,
        signal: data.signal
      });
    });

    socket.on('disconnect', () => {
      console.log(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
}
