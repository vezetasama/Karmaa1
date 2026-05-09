import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

let socket = null;

/**
 * Connect to the Socket.IO server
 * @returns {import('socket.io-client').Socket}
 */
export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    withCredentials: true,
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected:', socket.id);
  });

  socket.on('connect_error', (err) => {
    console.warn('Socket connection error:', err.message);
  });

  return socket;
};

/**
 * Get the current socket instance
 * @returns {import('socket.io-client').Socket | null}
 */
export const getSocket = () => socket;

/**
 * Disconnect the socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Join the admin notifications room
 */
export const joinAdminRoom = () => {
  if (socket?.connected) {
    socket.emit('joinAdmin');
  }
};

export default { connectSocket, getSocket, disconnectSocket, joinAdminRoom };
