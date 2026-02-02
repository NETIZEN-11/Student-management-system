import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import '../assets/styles/dashboard.css';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        api.get('/analytics/student-progress'),
        api.get('/tasks/my-tasks'),
      ]);

      setStats(statsRes.data);
      setRecentTasks(tasksRes.data.tasks.slice(0, 5));
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard">
      <h1>Student Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-value">{stats?.totalTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Submitted</h3>
          <p className="stat-value">{stats?.submittedTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Graded</h3>
          <p className="stat-value">{stats?.gradedTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <p className="stat-value">{stats?.averageScore || 0}%</p>
        </div>
      </div>

      <div className="progress-section">
        <h2>Completion Progress</h2>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${stats?.completionPercentage || 0}%` }}
          ></div>
        </div>
        <p>{stats?.completionPercentage || 0}% Complete</p>
      </div>

      <div className="recent-tasks">
        <h2>Recent Tasks</h2>
        {recentTasks.length === 0 ? (
          <p>No tasks assigned yet</p>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>{task.status}</td>
                  <td>
                    <Link to={`/tasks/${task._id}`} className="btn btn-small">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="dashboard-actions">
        <Link to="/tasks" className="btn btn-primary">
          View All Tasks
        </Link>
        <Link to="/leaderboard" className="btn btn-secondary">
          View Leaderboard
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
