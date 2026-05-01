import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Loader from '../components/Loader';
import '../assets/styles/taskmanagement.css';

const TaskManagement = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    assignedTo: [],
    maxScore: 100,
    tags: ''
  });

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      const students = response.data.users?.filter(u => u.role === 'student') || [];
      setUsers(students);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        dueDate: new Date(formData.dueDate).toISOString()
      };

      if (editingTask) {
        await api.put(`/tasks/${editingTask._id}`, taskData);
        alert('Task updated successfully!');
      } else {
        await api.post('/tasks', taskData);
        alert('Task created successfully!');
      }

      resetForm();
      fetchTasks();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to save task');
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: new Date(task.dueDate).toISOString().split('T')[0],
      priority: task.priority,
      assignedTo: task.assignedTo.map(user => user._id || user),
      maxScore: task.maxScore,
      tags: task.tags?.join(', ') || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        alert('Task deleted successfully!');
        fetchTasks();
      } catch (error) {
        alert('Failed to delete task');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      assignedTo: [],
      maxScore: 100,
      tags: ''
    });
    setEditingTask(null);
    setShowCreateForm(false);
  };

  const handleAssignedToChange = (userId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter(id => id !== userId)
        : [...prev.assignedTo, userId]
    }));
  };

  if (loading) return <Loader />;

  const canManageTasks = user?.role === 'mentor' || user?.role === 'admin';

  return (
    <div className="task-management">
      <div className="task-management-header">
        <h1>📝 Task Management</h1>
        {canManageTasks && (
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateForm(true)}
          >
            ➕ Create New Task
          </button>
        )}
      </div>

      {/* Create/Edit Task Form */}
      {showCreateForm && canManageTasks && (
        <div className="task-form-overlay">
          <div className="task-form">
            <div className="form-header">
              <h2>{editingTask ? '✏️ Edit Task' : '➕ Create New Task'}</h2>
              <button className="close-btn" onClick={resetForm}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Task Title *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  placeholder="Enter task title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                  rows="4"
                  placeholder="Enter task description"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date *</label>
                  <input
                    type="date"
                    id="dueDate"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="maxScore">Max Score</label>
                  <input
                    type="number"
                    id="maxScore"
                    value={formData.maxScore}
                    onChange={(e) => setFormData(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                    min="1"
                    max="1000"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Assign to Students *</label>
                <div className="student-selection">
                  {users.map(student => (
                    <label key={student._id} className="student-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(student._id)}
                        onChange={() => handleAssignedToChange(student._id)}
                      />
                      <span>{student.name} ({student.email})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tags">Tags (comma separated)</label>
                <input
                  type="text"
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="javascript, react, frontend"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="tasks-section">
        <h2>📋 All Tasks ({tasks.length})</h2>
        
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <div className="no-tasks-icon">📝</div>
            <h3>No Tasks Yet</h3>
            <p>Create your first task to get started with student assignments.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map(task => (
              <div key={task._id} className="task-card">
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <div className="task-actions">
                    {canManageTasks && (task.createdBy._id === user.userId || user.role === 'admin') && (
                      <>
                        <button 
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(task)}
                          title="Edit Task"
                        >
                          ✏️
                        </button>
                        <button 
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(task._id)}
                          title="Delete Task"
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <p className="task-description">{task.description}</p>

                <div className="task-meta">
                  <div className="meta-item">
                    <span className="meta-label">📅 Due:</span>
                    <span className="meta-value">{new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">⭐ Score:</span>
                    <span className="meta-value">{task.maxScore} pts</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">👥 Assigned:</span>
                    <span className="meta-value">{task.assignedTo?.length || 0} students</span>
                  </div>
                </div>

                <div className="task-badges">
                  <span className={`priority-badge priority-${task.priority}`}>
                    {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'} {task.priority}
                  </span>
                  <span className={`status-badge status-${task.status}`}>
                    {task.status}
                  </span>
                </div>

                {task.tags && task.tags.length > 0 && (
                  <div className="task-tags">
                    {task.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                )}

                <div className="task-footer">
                  <span className="created-by">
                    👨‍🏫 {task.createdBy?.name || 'Unknown'}
                  </span>
                  <a href={`/tasks/${task._id}`} className="btn btn-small btn-primary">
                    View Details
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskManagement;