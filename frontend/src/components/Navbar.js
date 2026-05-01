import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ThemeContext } from '../context/ThemeContext';
import '../assets/styles/navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const themeContext = useContext(ThemeContext);
  const isDarkMode = themeContext?.isDarkMode || false;
  const toggleDarkMode = themeContext?.toggleDarkMode || (() => {});
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      setShowMenu(false);
      // The authService.logout() will handle the redirect
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Student Management System
        </Link>

        <div className="navbar-menu">
          {isAuthenticated && user ? (
            <>
              <span className="navbar-user">Welcome, {user.name}</span>
              <button 
                className="theme-toggle-btn" 
                onClick={toggleDarkMode}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button 
                className="logout-btn-quick" 
                onClick={handleLogout}
                title="Logout"
              >
                Logout
              </button>
              <button className="navbar-toggle" onClick={() => setShowMenu(!showMenu)}>
                ⋮
              </button>
              {showMenu && (
                <div className="navbar-dropdown">
                  <Link to="/profile" onClick={() => setShowMenu(false)}>
                    👤 Profile
                  </Link>
                  <Link to="/notifications" onClick={() => setShowMenu(false)}>
                    🔔 Notifications
                  </Link>
                  <hr style={{ margin: '5px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                  <button onClick={handleLogout} className="logout-btn">
                    🚪 Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="navbar-auth-links">
              <button 
                className="theme-toggle-btn" 
                onClick={toggleDarkMode}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <Link to="/login" className="btn btn-primary" style={{ marginRight: '10px' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
