import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, getDaysRemaining, getPriorityColor } from '../utils/helpers';
import '../assets/styles/taskcard.css';

const TaskCard = ({ task, onDelete, onEdit }) => {
  const daysRemaining = getDaysRemaining(task.dueDate);
  const isOverdue = daysRemaining < 0;

  return (
    <div className="task-card">
      <div className="task-header">
        <h3>{task.title}</h3>
        <span
          className="priority-badge"
          style={{ backgroundColor: getPriorityColor(task.priority) }}
        >
          {task.priority}
        </span>
      </div>

      <p className="task-description">{task.description.substring(0, 100)}...</p>

      <div className="task-meta">
        <span className="due-date">
          📅 Due: {formatDate(task.dueDate)}
          {isOverdue ? (
            <span className="overdue"> (Overdue)</span>
          ) : (
            <span className="days-remaining"> ({daysRemaining} days)</span>
          )}
        </span>
        <span className="status-badge">{task.status}</span>
      </div>

      <div className="task-actions">
        <Link to={`/tasks/${task._id}`} className="btn btn-primary">
          View
        </Link>
        {onEdit && (
          <button onClick={() => onEdit(task)} className="btn btn-secondary">
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(task._id)} className="btn btn-danger">
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
