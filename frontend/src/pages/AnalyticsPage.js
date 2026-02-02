import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Loader from '../components/Loader';
import '../assets/styles/analytics.css';

const AnalyticsPage = () => {
  const [weakStudents, setWeakStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics/weak-students');
      setWeakStudents(response.data.weakStudents);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="analytics-page">
      <h1>Analytics</h1>

      <div className="analytics-section">
        <h2>Students Needing Support</h2>
        {weakStudents.length === 0 ? (
          <p>All students are performing well!</p>
        ) : (
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Score</th>
                <th>Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {weakStudents.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.studentName}</td>
                  <td>{student.studentEmail}</td>
                  <td>{student.score}%</td>
                  <td>
                    <span className={`risk-badge risk-${student.score < 30 ? 'high' : 'medium'}`}>
                      {student.score < 30 ? 'High' : 'Medium'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AnalyticsPage;
