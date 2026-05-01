import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/Loader';
import '../assets/styles/dashboard.css';

const MentorDashboard = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    totalSubmissions: 0,
    activeStudents: 0,
    completionRate: 0
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tasksRes, submissionsRes] = await Promise.allSettled([
        api.get('/tasks'),
        api.get('/submissions/my-submissions')
      ]);

      const allTasks = tasksRes.status === 'fulfilled' ? tasksRes.value.data.tasks || [] : [];
      const mySubmissions = submissionsRes.status === 'fulfilled' ? submissionsRes.value.data.submissions || [] : [];

      // Filter tasks created by current user (mentor)
      const userId = JSON.parse(localStorage.getItem('user'))?.userId;
      const mentorTasks = allTasks.filter(task => task.createdBy?._id === userId);

      setTasks(mentorTasks.slice(0, 5)); // Show recent 5 tasks

      // Calculate stats
      const totalStudents = new Set();
      mentorTasks.forEach(task => {
        task.assignedTo?.forEach(student => {
          totalStudents.add(student._id || student);
        });
      });

      const completedSubmissions = mySubmissions.filter(sub => sub.status === 'graded').length;
      const totalSubmissions = mySubmissions.length;

      setStats({
        totalTasks: mentorTasks.length,
        totalSubmissions: totalSubmissions,
        activeStudents: totalStudents.size,
        completionRate: totalSubmissions > 0 ? Math.round((completedSubmissions / totalSubmissions) * 100) : 0
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
      <h1>👨‍🏫 Mentor Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card tasks">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>Tasks Created</h3>
            <p className="stat-value">{stats.totalTasks}</p>
          </div>
        </div>
        <div className="stat-card submissions">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <h3>Submissions to Review</h3>
            <p className="stat-value">{stats.totalSubmissions}</p>
          </div>
        </div>
        <div className="stat-card students">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>Active Students</h3>
            <p className="stat-value">{stats.activeStudents}</p>
          </div>
        </div>
        <div className="stat-card completion">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completion Rate</h3>
            <p className="stat-value">{stats.completionRate}%</p>
          </div>
        </div>
      </div>

      <div className="recent-tasks">
        <h2>📋 Your Recent Tasks</h2>
        {tasks.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📝</div>
            <h3>No Tasks Yet</h3>
            <p>Create your first task to get started with managing student assignments.</p>
            <Link to="/tasks" className="btn btn-primary" style={{ marginTop: '15px' }}>
              Create Task
            </Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>📝 Title</th>
                  <th>📅 Due Date</th>
                  <th>👥 Assigned To</th>
                  <th>📊 Status</th>
                  <th>⚡ Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <div className="task-title">
                        <strong>{task.title}</strong>
                        <span className={`priority-badge priority-${task.priority}`}>
                          {task.priority}
                        </span>
                      </div>
                    </td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                    <td>
                      <span className="student-count">
                        {task.assignedTo?.length || 0} student{(task.assignedTo?.length || 0) !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${task.status}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/tasks/${task._id}`} className="btn btn-small btn-primary">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="dashboard-actions">
        <h2>🚀 Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/tasks" className="action-card">
            <div className="action-icon">📝</div>
            <h3>Manage Tasks</h3>
            <p>Create, edit, and assign tasks</p>
          </Link>
          <Link to="/submissions" className="action-card">
            <div className="action-icon">📤</div>
            <h3>Review Submissions</h3>
            <p>Grade and provide feedback</p>
          </Link>
          <Link to="/analytics" className="action-card">
            <div className="action-icon">📊</div>
            <h3>View Analytics</h3>
            <p>Monitor student performance</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
