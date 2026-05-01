import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import '../assets/styles/dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalMentors: 0,
    totalTasks: 0,
    totalSubmissions: 0,
    averageSubmissionScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setError(null);
      const [usersRes, tasksRes, submissionsRes] = await Promise.allSettled([
        api.get('/users'),
        api.get('/tasks'),
        api.get('/submissions/my-submissions') // This will be updated to get all submissions
      ]);

      const users = usersRes.status === 'fulfilled' ? usersRes.value.data.users || [] : [];
      const tasks = tasksRes.status === 'fulfilled' ? tasksRes.value.data.tasks || [] : [];
      const submissions = submissionsRes.status === 'fulfilled' ? submissionsRes.value.data.submissions || [] : [];

      const students = users.filter(user => user.role === 'student');
      const mentors = users.filter(user => user.role === 'mentor');

      // Calculate average score
      const gradedSubmissions = submissions.filter(sub => sub.score !== null && sub.score !== undefined);
      const averageScore = gradedSubmissions.length > 0 
        ? Math.round(gradedSubmissions.reduce((sum, sub) => sum + sub.score, 0) / gradedSubmissions.length)
        : 0;

      setStats({
        totalUsers: users.length,
        totalStudents: students.length,
        totalMentors: mentors.length,
        totalTasks: tasks.length,
        totalSubmissions: submissions.length,
        averageSubmissionScore: averageScore
      });

    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setError('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard">
      <h1>🔧 Admin Dashboard</h1>

      {error && (
        <div className="error-message">
          <strong>⚠️ Error:</strong> {error}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card users">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card students">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>Students</h3>
            <p className="stat-value">{stats.totalStudents}</p>
          </div>
        </div>
        <div className="stat-card mentors">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h3>Mentors</h3>
            <p className="stat-value">{stats.totalMentors}</p>
          </div>
        </div>
        <div className="stat-card tasks">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Total Tasks</h3>
            <p className="stat-value">{stats.totalTasks}</p>
          </div>
        </div>
        <div className="stat-card submissions">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <h3>Submissions</h3>
            <p className="stat-value">{stats.totalSubmissions}</p>
          </div>
        </div>
        <div className="stat-card score">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Avg Score</h3>
            <p className="stat-value">{stats.averageSubmissionScore}%</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <h2>🛠️ Management Tools</h2>
        <div className="action-buttons">
          <Link to="/users" className="action-card">
            <div className="action-icon">👥</div>
            <h3>Manage Users</h3>
            <p>Add, edit, and manage user accounts</p>
          </Link>
          <Link to="/tasks" className="action-card">
            <div className="action-icon">📝</div>
            <h3>Manage Tasks</h3>
            <p>Create and assign tasks to students</p>
          </Link>
          <Link to="/analytics" className="action-card">
            <div className="action-icon">📊</div>
            <h3>View Analytics</h3>
            <p>Monitor system performance and stats</p>
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="admin-actions">
        <h2>📊 System Status</h2>
        <div className="status-grid">
          <div className="status-item">
            <span className="status-label">Server Status</span>
            <span className="status-value online">🟢 Online</span>
          </div>
          <div className="status-item">
            <span className="status-label">Database</span>
            <span className="status-value online">🟢 Connected</span>
          </div>
          <div className="status-item">
            <span className="status-label">Last Backup</span>
            <span className="status-value">📅 Today</span>
          </div>
          <div className="status-item">
            <span className="status-label">Active Sessions</span>
            <span className="status-value">👤 {stats.totalUsers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
