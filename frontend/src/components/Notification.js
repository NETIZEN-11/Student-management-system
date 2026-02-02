import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../assets/styles/notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
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

  return (
    <div className="notification-container">
      <button
        className="notification-bell"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {showNotifications && (
        <div className="notification-panel">
          <h3>Notifications</h3>
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            <ul className="notification-list">
              {notifications.map((notif) => (
                <li key={notif._id} className={notif.isRead ? 'read' : 'unread'}>
                  <div className="notification-content">
                    <h4>{notif.title}</h4>
                    <p>{notif.message}</p>
                    <small>{new Date(notif.createdAt).toLocaleString()}</small>
                  </div>
                  <div className="notification-actions">
                    {!notif.isRead && (
                      <button onClick={() => handleMarkAsRead(notif._id)}>Mark Read</button>
                    )}
                    <button onClick={() => handleDelete(notif._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
