const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ WebSocket client connected: ${socket.id}`);

    socket.on('join:channel', (channelId) => {
      socket.join(`channel:${channelId}`);
    });

    socket.on('send:message', (data) => {
      console.log(`💬 Message sent in ${data.channelId}: ${data.content}`);
      io.emit('message:received', data);
    });

    socket.on('pin:message', (data) => {
      io.emit('message:pinned', data);
    });

    socket.on('trigger:warroom', (data) => {
      console.warn(`🚨 WAR ROOM TRIGGERED: ${data.reason}`);
      io.emit('warroom:alert', data);
    });

    socket.on('report:submit', (data) => {
      io.emit('report:submitted', data);
    });

    // Learning & Certification Engine Real-Time Alerts
    socket.on('course:passed', (data) => {
      console.log(`🎓 COURSE PASSED: ${data.userName} scored ${data.score}% on ${data.courseTitle}`);
      io.emit('course:passed_alert', data);
    });

    socket.on('course:failed', (data) => {
      console.warn(`⚠️ COURSE FAILED: ${data.userName} scored ${data.score}% on ${data.courseTitle}`);
      io.emit('course:failed_alert', data);
    });

    socket.on('course:assigned', (data) => {
      io.emit('course:assigned_alert', data);
    });


    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`\n🚀 ApexTracker WebSockets Server running on http://${hostname}:${port}\n`);
  });
});
