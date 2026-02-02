import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../assets/styles/sidebar.css';

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <h3>Menu</h3>
        <ul className="sidebar-menu">
          {user?.role === 'student' && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/tasks">My Tasks</Link>
              </li>
              <li>
                <Link to="/submissions">My Submissions</Link>
              </li>
              <li>
                <Link to="/messages">Messages</Link>
              </li>
              <li>
                <Link to="/leaderboard">Leaderboard</Link>
              </li>
            </>
          )}

          {user?.role === 'mentor' && (
            <>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link to="/tasks">Manage Tasks</Link>
              </li>
              <li>
                <Link to="/submissions">Review Submissions</Link>
              </li>
              <li>
                <Link to="/analytics">Analytics</Link>
              </li>
              <li>
                <Link to="/messages">Messages</Link>
              </li>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <li>
                <Link to="/admin-dashboard">Admin Dashboard</Link>
              </li>
              <li>
                <Link to="/users">Manage Users</Link>
              </li>
              <li>
                <Link to="/tasks">Manage Tasks</Link>
              </li>
              <li>
                <Link to="/analytics">Analytics</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
