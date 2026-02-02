import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import '../assets/styles/dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      setError(null);
      const response = await api.get('/analytics/admin-stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch admin stats:', err);
      setError('Failed to load admin statistics');
      // Set default stats if API fails
      setStats({
        totalUsers: 0,
        totalStudents: 0,
        totalMentors: 0,
        totalTasks: 0,
        totalSubmissions: 0,
        averageSubmissionScore: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

      {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{stats?.totalUsers || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Students</h3>
          <p className="stat-value">{stats?.totalStudents || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Mentors</h3>
          <p className="stat-value">{stats?.totalMentors || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-value">{stats?.totalTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Submissions</h3>
          <p className="stat-value">{stats?.totalSubmissions || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Avg Score</h3>
          <p className="stat-value">{stats?.averageSubmissionScore || 0}%</p>
        </div>
      </div>

      <div className="admin-actions">
        <h2>Management</h2>
        <div className="action-buttons">
          <Link to="/users" className="btn btn-primary">
            Manage Users
          </Link>
          <Link to="/tasks" className="btn btn-primary">
            Manage Tasks
          </Link>
          <Link to="/analytics" className="btn btn-primary">
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
