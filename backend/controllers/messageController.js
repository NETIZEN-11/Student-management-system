const Message = require('../models/Message');
const Notification = require('../models/Notification');
const logger = require('../utils/logger');

const messageController = {
  sendMessage: async (req, res) => {
    try {
      const { receiverId, content } = req.body;
      const senderId = req.user.userId;

      if (!receiverId || !content) {
        return res.status(400).json({ message: 'Receiver ID and content are required' });
      }

      const message = new Message({
        senderId,
        receiverId,
        content,
      });

      await message.save();
      await message.populate('senderId', 'name email');
      await message.populate('receiverId', 'name email');

      // Create notification
      await Notification.create({
        userId: receiverId,
        type: 'message_received',
        title: 'New Message',
        message: `You have a new message from ${message.senderId.name}`,
        relatedId: message._id,
        relatedModel: 'Message',
      });

      logger.info(`Message sent: ${message._id}`);
      res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
      logger.error('Send message error:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  },

  getConversation: async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.userId;

      const messages = await Message.find({
        $or: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId },
        ],
      })
        .populate('senderId', 'name email')
        .populate('receiverId', 'name email')
        .sort({ createdAt: 1 });

      // Mark messages as read
      await Message.updateMany(
        { senderId: userId, receiverId: currentUserId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      res.status(200).json({ messages });
    } catch (error) {
      logger.error('Get conversation error:', error);
      res.status(500).json({ message: 'Failed to fetch conversation' });
    }
  },

  getInbox: async (req, res) => {
    try {
      const userId = req.user.userId;

      const messages = await Message.find({ receiverId: userId })
        .populate('senderId', 'name email')
        .sort({ createdAt: -1 });

      const unreadCount = await Message.countDocuments({
        receiverId: userId,
        isRead: false,
      });

      res.status(200).json({ messages, unreadCount });
    } catch (error) {
      logger.error('Get inbox error:', error);
      res.status(500).json({ message: 'Failed to fetch inbox' });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const { messageId } = req.params;

      const message = await Message.findByIdAndUpdate(
        messageId,
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      res.status(200).json({ message: 'Message marked as read', data: message });
    } catch (error) {
      logger.error('Mark as read error:', error);
      res.status(500).json({ message: 'Failed to mark message as read' });
    }
  },

  deleteMessage: async (req, res) => {
    try {
      const { messageId } = req.params;
      const userId = req.user.userId;

      const message = await Message.findById(messageId);
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }

      // Check authorization
      if (message.senderId.toString() !== userId && message.receiverId.toString() !== userId) {
        return res.status(403).json({ message: 'Not authorized to delete this message' });
      }

      await Message.findByIdAndDelete(messageId);
      logger.info(`Message deleted: ${messageId}`);
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      logger.error('Delete message error:', error);
      res.status(500).json({ message: 'Failed to delete message' });
    }
  },
};

module.exports = messageController;
