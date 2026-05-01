import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../assets/styles/notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      // Set empty state if API fails
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      fetchNotifications();
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/mark-all-read');
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'task': return '📝';
      case 'submission': return '📤';
      case 'grade': return '⭐';
      case 'message': return '💬';
      case 'system': return '🔔';
      default: return '📢';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffInMinutes = Math.floor((now - notifDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="notification-container">
      <button
        className={`notification-bell ${unreadCount > 0 ? 'has-notifications' : ''}`}
        onClick={() => setShowNotifications(!showNotifications)}
        title="Notifications"
      >
        <span className="bell-icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {showNotifications && (
        <>
          <div className="notification-overlay" onClick={() => setShowNotifications(false)} />
          <div className="notification-panel">
            <div className="notification-header">
              <h3>
                <span className="header-icon">🔔</span>
                Notifications
              </h3>
              <div className="notification-header-actions">
                {unreadCount > 0 && (
                  <button 
                    className="mark-all-read-btn"
                    onClick={handleMarkAllAsRead}
                    title="Mark all as read"
                  >
                    ✓ All
                  </button>
                )}
                <button 
                  className="close-btn"
                  onClick={() => setShowNotifications(false)}
                  title="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="notification-body">
              {loading ? (
                <div className="notification-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="no-notifications">
                  <div className="no-notifications-icon">🔕</div>
                  <h4>No notifications yet</h4>
                  <p>You're all caught up! New notifications will appear here.</p>
                </div>
              ) : (
                <ul className="notification-list">
                  {notifications.map((notif) => (
                    <li key={notif._id} className={`notification-item ${notif.isRead ? 'read' : 'unread'}`}>
                      <div className="notification-icon">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="notification-content">
                        <h4 className="notification-title">{notif.title || 'Notification'}</h4>
                        <p className="notification-message">{notif.message || 'No message'}</p>
                        <div className="notification-meta">
                          <span className="notification-time">{formatTimeAgo(notif.createdAt)}</span>
                          {!notif.isRead && <span className="unread-dot"></span>}
                        </div>
                      </div>
                      <div className="notification-actions">
                        {!notif.isRead && (
                          <button 
                            className="action-btn mark-read-btn"
                            onClick={() => handleMarkAsRead(notif._id)}
                            title="Mark as read"
                          >
                            ✓
                          </button>
                        )}
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(notif._id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="notification-footer">
                <button 
                  className="view-all-btn"
                  onClick={() => {/* Navigate to notifications page */}}
                >
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Notification;
