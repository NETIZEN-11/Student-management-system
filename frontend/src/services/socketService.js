import io from 'socket.io-client';
import authService from './authService';

let socket = null;

const socketService = {
  connect: () => {
    const token = authService.getToken();
    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

    socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return socket;
  },

  disconnect: () => {
    if (socket) {
      socket.disconnect();
    }
  },

  getSocket: () => {
    return socket;
  },

  on: (event, callback) => {
    if (socket) {
      socket.on(event, callback);
    }
  },

  off: (event) => {
    if (socket) {
      socket.off(event);
    }
  },

  emit: (event, data) => {
    if (socket) {
      socket.emit(event, data);
    }
  },

  sendMessage: (receiverId, content) => {
    if (socket) {
      socket.emit('send_message', { receiverId, content });
    }
  },

  notifyTaskAssigned: (studentIds, taskTitle) => {
    if (socket) {
      socket.emit('task_assigned', { studentIds, taskTitle });
    }
  },

  notifySubmissionReviewed: (studentId, taskTitle, score) => {
    if (socket) {
      socket.emit('submission_reviewed', { studentId, taskTitle, score });
    }
  },

  notifyTyping: (receiverId) => {
    if (socket) {
      socket.emit('typing', { receiverId });
    }
  },

  notifyStopTyping: (receiverId) => {
    if (socket) {
      socket.emit('stop_typing', { receiverId });
    }
  },
};

export default socketService;
