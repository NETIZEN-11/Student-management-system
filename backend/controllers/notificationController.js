const Notification = require('../models/Notification');
const logger = require('../utils/logger');

const notificationController = {
  getNotifications: async (req, res) => {
    try {
      const userId = req.user.userId;
      const { isRead } = req.query;

      const filter = { userId };
      if (isRead !== undefined) {
        filter.isRead = isRead === 'true';
      }

      const notifications = await Notification.find(filter)
        .sort({ createdAt: -1 })
        .limit(50);

      const unreadCount = await Notification.countDocuments({
        userId,
        isRead: false,
      });

      res.status(200).json({ notifications, unreadCount });
    } catch (error) {
      logger.error('Get notifications error:', error);
      res.status(500).json({ message: 'Failed to fetch notifications' });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.userId;

      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true, readAt: new Date() },
        { new: true }
      );

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      res.status(200).json({ message: 'Notification marked as read', notification });
    } catch (error) {
      logger.error('Mark notification as read error:', error);
      res.status(500).json({ message: 'Failed to mark notification as read' });
    }
  },

  markAllAsRead: async (req, res) => {
    try {
      const userId = req.user.userId;

      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true, readAt: new Date() }
      );

      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      logger.error('Mark all as read error:', error);
      res.status(500).json({ message: 'Failed to mark all notifications as read' });
    }
  },

  deleteNotification: async (req, res) => {
    try {
      const { notificationId } = req.params;
      const userId = req.user.userId;

      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        userId,
      });

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      logger.info(`Notification deleted: ${notificationId}`);
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      logger.error('Delete notification error:', error);
      res.status(500).json({ message: 'Failed to delete notification' });
    }
  },
};

module.exports = notificationController;
