import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import Loader from '../components/Loader';
import { formatDate } from '../utils/helpers';
import '../assets/styles/submissionpage.css';

const SubmissionPage = () => {
  const { submissionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [grading, setGrading] = useState(false);
  const [gradeData, setGradeData] = useState({
    score: '',
    feedback: '',
  });

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSubmission = async () => {
    try {
      // Fetch from submissions list
      const response = await api.get('/submissions/my-submissions');
      const sub = response.data.submissions.find((s) => s._id === submissionId);
      if (sub) {
        setSubmission(sub);
        setGradeData({
          score: sub.score || '',
          feedback: sub.feedback || '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (e) => {
    e.preventDefault();
    setGrading(true);
    try {
      await api.put(`/submissions/${submissionId}/grade`, gradeData);
      alert('Submission graded successfully!');
      fetchSubmission();
    } catch (error) {
      alert(error.message || 'Failed to grade submission');
    } finally {
      setGrading(false);
    }
  };

  const handleCheckPlagiarism = async () => {
    try {
      const response = await api.post(
        `/submissions/${submissionId}/plagiarism/${submission.taskId._id}`
      );
      alert(`Plagiarism Score: ${response.data.result.plagiarismScore}%`);
    } catch (error) {
      alert('Failed to check plagiarism');
    }
  };

  if (loading) return <Loader />;
  if (!submission) return <div>Submission not found</div>;

  const isMentor = user?.role === 'mentor' || user?.role === 'admin';

  return (
    <div className="submission-page">
      <button onClick={() => navigate(-1)} className="btn btn-secondary">
        ← Back
      </button>

      <div className="submission-details">
        <h1>Submission Review</h1>

        <div className="submission-info">
          <div className="info-item">
            <strong>Task:</strong> {submission.taskId?.title}
          </div>
          <div className="info-item">
            <strong>Student:</strong> {submission.studentId?.name}
          </div>
          <div className="info-item">
            <strong>Submitted:</strong> {formatDate(submission.submittedAt)}
          </div>
          <div className="info-item">
            <strong>Status:</strong> {submission.status}
          </div>
          {submission.isLate && <div className="late-badge">Late Submission</div>}
        </div>

        <div className="submission-content">
          <h2>Submission Content</h2>
          {submission.submissionText && (
            <div className="submission-text">
              <h3>Text Submission</h3>
              <p>{submission.submissionText}</p>
            </div>
          )}
          {submission.submissionLink && (
            <div className="submission-link">
              <h3>Link Submission</h3>
              <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer">
                {submission.submissionLink}
              </a>
            </div>
          )}
        </div>

        {isMentor && (
          <div className="grading-section">
            <h2>Grade Submission</h2>
            <form onSubmit={handleGrade}>
              <div className="form-group">
                <label htmlFor="score">Score</label>
                <input
                  type="number"
                  id="score"
                  value={gradeData.score}
                  onChange={(e) =>
                    setGradeData((prev) => ({
                      ...prev,
                      score: e.target.value,
                    }))
                  }
                  placeholder="Enter score"
                  min="0"
                  max="100"
                />
              </div>

              <div className="form-group">
                <label htmlFor="feedback">Feedback</label>
                <textarea
                  id="feedback"
                  value={gradeData.feedback}
                  onChange={(e) =>
                    setGradeData((prev) => ({
                      ...prev,
                      feedback: e.target.value,
                    }))
                  }
                  placeholder="Enter feedback"
                  rows="6"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={grading}>
                {grading ? 'Grading...' : 'Submit Grade'}
              </button>
            </form>

            <button onClick={handleCheckPlagiarism} className="btn btn-secondary">
              Check Plagiarism
            </button>
            {submission.plagiarismScore > 0 && (
              <p className="plagiarism-score">Plagiarism Score: {submission.plagiarismScore}%</p>
            )}
          </div>
        )}

        {submission.feedback && (
          <div className="feedback-section">
            <h2>Feedback</h2>
            <p>{submission.feedback}</p>
            {submission.aiGeneratedFeedback && (
              <div className="ai-feedback">
                <h3>AI Generated Feedback</h3>
                <p>{submission.aiGeneratedFeedback}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionPage;
