const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');

const setupSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  // Middleware to authenticate socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      socket.userId = decoded.userId;
      socket.role = decoded.role;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  // Store active users
  const activeUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.userId}`);
    activeUsers.set(socket.userId, socket.id);

    // Broadcast user online status
    io.emit('user_online', { userId: socket.userId });

    // Handle new message
    socket.on('send_message', (data) => {
      const { receiverId, content } = data;
      const receiverSocketId = activeUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', {
          senderId: socket.userId,
          content,
          timestamp: new Date(),
        });
      }
    });

    // Handle task assignment notification
    socket.on('task_assigned', (data) => {
      const { studentIds, taskTitle } = data;
      studentIds.forEach((studentId) => {
        const studentSocketId = activeUsers.get(studentId);
        if (studentSocketId) {
          io.to(studentSocketId).emit('notification', {
            type: 'task_assigned',
            title: 'New Task Assigned',
            message: `You have been assigned: ${taskTitle}`,
          });
        }
      });
    });

    // Handle submission reviewed notification
    socket.on('submission_reviewed', (data) => {
      const { studentId, taskTitle, score } = data;
      const studentSocketId = activeUsers.get(studentId);

      if (studentSocketId) {
        io.to(studentSocketId).emit('notification', {
          type: 'submission_reviewed',
          title: 'Submission Reviewed',
          message: `Your submission for ${taskTitle} has been reviewed. Score: ${score}`,
        });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', {
          senderId: socket.userId,
        });
      }
    });

    // Handle stop typing
    socket.on('stop_typing', (data) => {
      const { receiverId } = data;
      const receiverSocketId = activeUsers.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_stop_typing', {
          senderId: socket.userId,
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.userId}`);
      activeUsers.delete(socket.userId);
      io.emit('user_offline', { userId: socket.userId });
    });
  });

  return io;
};

module.exports = setupSocket;
