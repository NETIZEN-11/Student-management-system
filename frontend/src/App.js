import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useAuth } from './hooks/useAuth';
import socketService from './services/socketService';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Notification from './components/Notification';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import UsersPage from './pages/UsersPage';
import TaskPage from './pages/TaskPage';
import SubmissionPage from './pages/SubmissionPage';
import AnalyticsPage from './pages/AnalyticsPage';
import TaskManagement from './pages/TaskManagement';
import SubmissionsManagement from './pages/SubmissionsManagement';

import './assets/styles/global.css';

const AppContent = () => {
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      socketService.connect();
    }

    return () => {
      if (isAuthenticated) {
        socketService.disconnect();
      }
    };
  }, [isAuthenticated]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <div className="app-container">
        {isAuthenticated && <Sidebar />}
        <main className="main-content">
          {isAuthenticated && <Notification />}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {user?.role === 'student' && <StudentDashboard />}
                  {user?.role === 'mentor' && <MentorDashboard />}
                  {user?.role === 'admin' && <AdminDashboard />}
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <UsersPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks/:taskId"
              element={
                <ProtectedRoute>
                  <TaskPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/submissions"
              element={
                <ProtectedRoute>
                  <SubmissionsManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/submissions/:submissionId"
              element={
                <ProtectedRoute>
                  <SubmissionPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AnalyticsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TaskManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>🏆 Leaderboard</h2>
                    <p>Student rankings and achievements coming soon...</p>
                    <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>💬 Messages</h2>
                    <p>Messaging system coming soon...</p>
                    <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>👤 Profile</h2>
                    <p>User profile management coming soon...</p>
                    <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h2>🔔 Notifications</h2>
                    <p>Notification center coming soon...</p>
                    <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Redirect */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="*" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
