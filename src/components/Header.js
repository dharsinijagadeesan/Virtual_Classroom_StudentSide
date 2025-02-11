import React from 'react';
import bellIcon from '../sidebar-logos/icons8-notification-24.png';  // Import the bell icon
import logo from './logo-learnlab.png'; 
import './Header.css'; // Import the logo

const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <img src={logo} alt="Learnlab Logo" className="logo" />
      </div>
      <div className="header-right">
        <div className="notification">
          <img src={bellIcon} alt="Notification Bell" className="bell-icon" />
        </div>
        <div className="user-profile">
          <span className="profile-icon">D</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
