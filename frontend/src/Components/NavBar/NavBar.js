import React from 'react';
import { useNavigate } from 'react-router-dom';
import {FaBell, FaUser, FaSignOutAlt } from 'react-icons/fa';
import './NavBar.css'; 

function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <div className="logo" onClick={() => navigate('/')}>
          <span>Elevate</span>
        </div>
      </div>
      
      <div className="navbar-right">
        <nav className="nav-items">
          <div className="nav-item" onClick={() => navigate('/allPost')}>
            <span>Posts</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/allLearningProgress')}>
            <span>Learning Progress</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/allLearningPlan')}>
            <span>Learning Plan</span>
          </div>
        </nav>
        
        <div className="nav-actions">
          <div className="nav-action" onClick={() => navigate('/notifications')}>
            <FaBell className="action-icon" />
          </div>
          <div className="nav-action" onClick={() => navigate('/userProfile')}>
            <FaUser className="action-icon" />
          </div>
          <div className="nav-action" onClick={handleLogout}>
            <FaSignOutAlt className="action-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBar;