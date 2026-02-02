import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import SubmissionForm from '../components/SubmissionForm';
import Loader from '../components/Loader';
import { formatDate } from '../utils/helpers';
import '../assets/styles/taskpage.css';

const TaskPage = () => {
  const { taskId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTaskData();
  }, [taskId]);

  const fetchTaskData = async () => {
    try {
      const [taskRes, submissionsRes] = await Promise.all([
        api.get(`/tasks/${taskId}`),
        api.get(`/submissions/task/${taskId}`),
      ]);

      setTask(taskRes.data.task);
      setSubmissions(submissionsRes.data.submissions);
    } catch (error) {
      console.error('Failed to fetch task data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await api.post('/submissions', {
        taskId,
        ...formData,
      });
      alert('Task submitted successfully!');
      fetchTaskData();
    } catch (error) {
      alert(error.message || 'Failed to submit task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (!task) return <div>Task not found</div>;

  const isStudent = user?.role === 'student';
  const isMentor = user?.role === 'mentor' || user?.role === 'admin';
  const studentSubmission = submissions.find((s) => s.studentId._id === user?.userId);

  return (
    <div className="task-page">
      <button onClick={() => navigate(-1)} className="btn btn-secondary">
        ← Back
      </button>

      <div className="task-details">
        <h1>{task.title}</h1>
        <p className="task-description">{task.description}</p>

        <div className="task-info">
          <div className="info-item">
            <strong>Due Date:</strong> {formatDate(task.dueDate)}
          </div>
          <div className="info-item">
            <strong>Priority:</strong> {task.priority}
          </div>
          <div className="info-item">
            <strong>Max Score:</strong> {task.maxScore}
          </div>
          <div className="info-item">
            <strong>Status:</strong> {task.status}
          </div>
        </div>

        {task.attachments && task.attachments.length > 0 && (
          <div className="attachments">
            <h3>Attachments</h3>
            <ul>
              {task.attachments.map((att, idx) => (
                <li key={idx}>
                  <a href={att.fileUrl} target="_blank" rel="noopener noreferrer">
                    {att.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isStudent && !studentSubmission && (
        <div className="submission-section">
          <h2>Submit Your Work</h2>
          <SubmissionForm onSubmit={handleSubmit} loading={submitting} />
        </div>
      )}

      {studentSubmission && (
        <div className="student-submission">
          <h2>Your Submission</h2>
          <div className="submission-info">
            <p>
              <strong>Submitted:</strong> {formatDate(studentSubmission.submittedAt)}
            </p>
            <p>
              <strong>Status:</strong> {studentSubmission.status}
            </p>
            {studentSubmission.score !== null && (
              <p>
                <strong>Score:</strong> {studentSubmission.score}/{task.maxScore}
              </p>
            )}
            {studentSubmission.feedback && (
              <div className="feedback">
                <strong>Feedback:</strong>
                <p>{studentSubmission.feedback}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isMentor && (
        <div className="submissions-section">
          <h2>Student Submissions ({submissions.length})</h2>
          {submissions.length === 0 ? (
            <p>No submissions yet</p>
          ) : (
            <table className="submissions-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub._id}>
                    <td>{sub.studentId.name}</td>
                    <td>{formatDate(sub.submittedAt)}</td>
                    <td>{sub.status}</td>
                    <td>{sub.score !== null ? `${sub.score}/${task.maxScore}` : '-'}</td>
                    <td>
                      <button
                        onClick={() => navigate(`/submissions/${sub._id}`)}
                        className="btn btn-small"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskPage;
