import React from 'react';
import '../assets/styles/analytics.css';

const AnalyticsPage = () => {
  const [error] = React.useState(null);

  // Simple static data for now
  const analyticsData = {
    totalUsers: 5,
    totalTasks: 8,
    totalSubmissions: 12,
    averageScore: 78
  };

  const performanceData = [
    { label: 'Excellent (90-100%)', percentage: 25, color: '#10b981' },
    { label: 'Good (70-89%)', percentage: 40, color: '#3b82f6' },
    { label: 'Average (50-69%)', percentage: 25, color: '#f59e0b' },
    { label: 'Needs Improvement (<50%)', percentage: 10, color: '#ef4444' }
  ];

  return (
    <div className="analytics-page">
      <h1>📊 Analytics Dashboard</h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Overview Stats */}
      <div className="analytics-section">
        <h2>📈 System Overview</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-value">{analyticsData.totalUsers}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <h3>Total Tasks</h3>
              <p className="stat-value">{analyticsData.totalTasks}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📤</div>
            <div className="stat-info">
              <h3>Submissions</h3>
              <p className="stat-value">{analyticsData.totalSubmissions}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Average Score</h3>
              <p className="stat-value">{analyticsData.averageScore}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="analytics-section">
        <h2>🎯 Performance Analysis</h2>
        <div className="performance-grid">
          <div className="performance-card">
            <h3>📊 Score Distribution</h3>
            <div className="score-bars">
              {performanceData.map((item, index) => (
                <div key={index} className="score-bar">
                  <span className="score-label">{item.label}</span>
                  <div className="bar">
                    <div 
                      className="bar-fill" 
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color
                      }}
                    ></div>
                  </div>
                  <span className="score-percentage">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="performance-card">
            <h3>📈 Submission Trends</h3>
            <div className="trend-info">
              <div className="trend-item">
                <span className="trend-label">This Week</span>
                <span className="trend-value">+15%</span>
                <span className="trend-indicator positive">↗️</span>
              </div>
              <div className="trend-item">
                <span className="trend-label">This Month</span>
                <span className="trend-value">+8%</span>
                <span className="trend-indicator positive">↗️</span>
              </div>
              <div className="trend-item">
                <span className="trend-label">Completion Rate</span>
                <span className="trend-value">85%</span>
                <span className="trend-indicator positive">✅</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Performance */}
      <div className="analytics-section">
        <h2>🎓 Student Performance</h2>
        <div className="no-data">
          <div className="no-data-icon">🎉</div>
          <h3>Great News!</h3>
          <p>All students are performing well. No immediate support needed.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="analytics-section">
        <h2>⚡ Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => window.location.reload()}>
            <span className="action-icon">🔄</span>
            <span>Refresh Data</span>
          </button>
          <button className="action-btn" onClick={() => alert('Export feature coming soon!')}>
            <span className="action-icon">📊</span>
            <span>Export Report</span>
          </button>
          <button className="action-btn" onClick={() => alert('Notification feature coming soon!')}>
            <span className="action-icon">📧</span>
            <span>Send Notifications</span>
          </button>
          <button className="action-btn" onClick={() => alert('Settings coming soon!')}>
            <span className="action-icon">⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
