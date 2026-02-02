import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import '../assets/styles/dashboard.css';

const MentorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes] = await Promise.all([api.get('/tasks')]);

      const mentorTasks = tasksRes.data.tasks.filter(
        (task) => task.createdBy._id === localStorage.getItem('userId')
      );

      setTasks(mentorTasks.slice(0, 5));
      setStats({
        totalTasks: mentorTasks.length,
        totalSubmissions: 0,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard">
      <h1>Mentor Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Tasks Created</h3>
          <p className="stat-value">{stats?.totalTasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Submissions to Review</h3>
          <p className="stat-value">{stats?.totalSubmissions || 0}</p>
        </div>
      </div>

      <div className="recent-tasks">
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <p>No tasks created yet</p>
        ) : (
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Due Date</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>{task.assignedTo.length} students</td>
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
          Manage Tasks
        </Link>
        <Link to="/submissions" className="btn btn-secondary">
          Review Submissions
        </Link>
        <Link to="/analytics" className="btn btn-secondary">
          View Analytics
        </Link>
      </div>
    </div>
  );
};

export default MentorDashboard;
