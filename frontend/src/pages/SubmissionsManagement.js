import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Loader from '../components/Loader';
import '../assets/styles/submissionsmanagement.css';

const SubmissionsManagement = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/submissions/all');
      setSubmissions(response.data.submissions || []);
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId, score, feedback) => {
    try {
      await api.put(`/submissions/${submissionId}/grade`, { score, feedback });
      alert('Submission graded successfully!');
      fetchSubmissions();
    } catch (error) {
      alert('Failed to grade submission');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return '#3b82f6';
      case 'reviewed': return '#f59e0b';
      case 'graded': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted': return '📤';
      case 'reviewed': return '👀';
      case 'graded': return '✅';
      default: return '📝';
    }
  };

  const filteredSubmissions = submissions.filter(submission => {
    const matchesFilter = filter === 'all' || submission.status === filter;
    const matchesSearch = searchTerm === '' || 
      submission.studentId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.taskId?.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (loading) return <Loader />;

  const canManageSubmissions = user?.role === 'mentor' || user?.role === 'admin';

  if (!canManageSubmissions) {
    return (
      <div className="submissions-management">
        <div className="no-access">
          <h1>🚫 Access Denied</h1>
          <p>Only mentors and admins can manage submissions.</p>
          <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="submissions-management">
      <div className="submissions-header">
        <h1>📤 Submissions Management</h1>
        <div className="submissions-stats">
          <div className="stat-item">
            <span className="stat-value">{submissions.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{submissions.filter(s => s.status === 'submitted').length}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">{submissions.filter(s => s.status === 'graded').length}</span>
            <span className="stat-label">Graded</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="submissions-controls">
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({submissions.length})
          </button>
          <button 
            className={`filter-btn ${filter === 'submitted' ? 'active' : ''}`}
            onClick={() => setFilter('submitted')}
          >
            📤 Submitted ({submissions.filter(s => s.status === 'submitted').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'reviewed' ? 'active' : ''}`}
            onClick={() => setFilter('reviewed')}
          >
            👀 Reviewed ({submissions.filter(s => s.status === 'reviewed').length})
          </button>
          <button 
            className={`filter-btn ${filter === 'graded' ? 'active' : ''}`}
            onClick={() => setFilter('graded')}
          >
            ✅ Graded ({submissions.filter(s => s.status === 'graded').length})
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search by student name or task title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>
      </div>

      {/* Submissions List */}
      <div className="submissions-section">
        {filteredSubmissions.length === 0 ? (
          <div className="no-submissions">
            <div className="no-submissions-icon">📤</div>
            <h3>No Submissions Found</h3>
            <p>
              {filter === 'all' 
                ? 'No submissions available yet.' 
                : `No ${filter} submissions found.`}
            </p>
          </div>
        ) : (
          <div className="submissions-grid">
            {filteredSubmissions.map(submission => (
              <div key={submission._id} className="submission-card">
                <div className="submission-header">
                  <div className="submission-info">
                    <h3>{submission.taskId?.title || 'Unknown Task'}</h3>
                    <p className="student-name">👤 {submission.studentId?.name || 'Unknown Student'}</p>
                  </div>
                  <div className="submission-status">
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(submission.status) }}
                    >
                      {getStatusIcon(submission.status)} {submission.status}
                    </span>
                  </div>
                </div>

                <div className="submission-meta">
                  <div className="meta-item">
                    <span className="meta-label">📅 Submitted:</span>
                    <span className="meta-value">
                      {new Date(submission.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">📧 Student:</span>
                    <span className="meta-value">{submission.studentId?.email}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">⏰ Due Date:</span>
                    <span className="meta-value">
                      {submission.taskId?.dueDate 
                        ? new Date(submission.taskId.dueDate).toLocaleDateString()
                        : 'N/A'}
                    </span>
                  </div>
                  {submission.isLate && (
                    <div className="meta-item">
                      <span className="late-badge">⚠️ Late Submission</span>
                    </div>
                  )}
                </div>

                {submission.submissionText && (
                  <div className="submission-content">
                    <h4>📝 Submission:</h4>
                    <p className="submission-text">
                      {submission.submissionText.length > 150 
                        ? `${submission.submissionText.substring(0, 150)}...`
                        : submission.submissionText}
                    </p>
                  </div>
                )}

                {submission.submissionLink && (
                  <div className="submission-link">
                    <h4>🔗 Link:</h4>
                    <a 
                      href={submission.submissionLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link-preview"
                    >
                      {submission.submissionLink}
                    </a>
                  </div>
                )}

                {submission.score !== null && submission.score !== undefined && (
                  <div className="submission-score">
                    <div className="score-display">
                      <span className="score-value">
                        {submission.score}/{submission.taskId?.maxScore || 100}
                      </span>
                      <span className="score-percentage">
                        ({Math.round((submission.score / (submission.taskId?.maxScore || 100)) * 100)}%)
                      </span>
                    </div>
                  </div>
                )}

                {submission.feedback && (
                  <div className="submission-feedback">
                    <h4>💬 Feedback:</h4>
                    <p>{submission.feedback}</p>
                    {submission.reviewedBy && (
                      <small>- {submission.reviewedBy.name}</small>
                    )}
                  </div>
                )}

                <div className="submission-actions">
                  <Link 
                    to={`/submissions/${submission._id}`}
                    className="btn btn-small btn-primary"
                  >
                    📋 View Details
                  </Link>
                  
                  {submission.status === 'submitted' && (
                    <QuickGradeForm 
                      submission={submission}
                      onGrade={handleGrade}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Grade Form Component
const QuickGradeForm = ({ submission, onGrade }) => {
  const [showForm, setShowForm] = useState(false);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (score === '' || feedback === '') {
      alert('Please provide both score and feedback');
      return;
    }
    onGrade(submission._id, parseInt(score), feedback);
    setShowForm(false);
    setScore('');
    setFeedback('');
  };

  if (!showForm) {
    return (
      <button 
        className="btn btn-small btn-success"
        onClick={() => setShowForm(true)}
      >
        ⭐ Quick Grade
      </button>
    );
  }

  return (
    <div className="quick-grade-form">
      <form onSubmit={handleSubmit}>
        <div className="grade-inputs">
          <input
            type="number"
            placeholder="Score"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            min="0"
            max={submission.taskId?.maxScore || 100}
            required
          />
          <input
            type="text"
            placeholder="Quick feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
          />
        </div>
        <div className="grade-actions">
          <button type="submit" className="btn btn-tiny btn-success">✓</button>
          <button 
            type="button" 
            className="btn btn-tiny btn-secondary"
            onClick={() => setShowForm(false)}
          >
            ✕
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmissionsManagement;