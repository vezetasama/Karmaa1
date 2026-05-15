const { Server } = require('socket.io');
const { getAllowedOrigins } = require('../utils/appUrl');

let io;

/**
 * Initialize Socket.IO server
 * @param {import('http').Server} httpServer - The HTTP server instance
 * @returns {Server} The Socket.IO server instance
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: getAllowedOrigins(),
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Admin joins a dedicated room for receiving notifications
    socket.on('joinAdmin', () => {
      socket.join('admins');
      console.log(`👑 Admin joined notifications room: ${socket.id}`);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the Socket.IO instance (must call initSocket first)
 * @returns {Server}
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized. Call initSocket(httpServer) first.');
  }
  return io;
};

module.exports = { initSocket, getIO };
